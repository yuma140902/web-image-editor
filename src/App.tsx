import ImageSelector from './components/ImageSelector';
import ImagePreview from './components/ImagePreview';
import { Button, ConfigProvider, Layout, Space, Switch, theme } from 'antd';
import { Content, Header } from 'antd/es/layout/layout';
import cv from '@techstark/opencv-js';
import useCvMatFromFile from './hooks/useCvMatFromFile';
import { useWindowSize } from '@react-hook/window-size';
import { useEffect, useRef, useState } from 'react';
import { Stage } from 'konva/lib/Stage';
import { Project } from './core/Project';

function App() {
  const [project, setProject] = useState<Project>({});
  const [mat, imageFile, setImageFile] = useCvMatFromFile();
  const [windowWidth, windowHeight] = useWindowSize();
  const headerHeight = 64;
  // TODO: 永続化
  // TODO: ブラウザの設定をもとにデフォルト値を決める
  const [isDarkMode, setIsDarkMode] = useState(false);
  const stageRef = useRef<Stage | null>(null);

  useEffect(() => setProject((p) => ({ ...p, mat: mat })), [mat]);

  const handleGrayscale = () => {
    if (project.mat) {
      const imgGray = new cv.Mat();
      cv.cvtColor(project.mat, imgGray, cv.COLOR_BGR2GRAY);
      project.mat?.delete();
      setProject({ ...project, mat: imgGray });
    }
  };

  // https://konvajs.org/docs/data_and_serialization/High-Quality-Export.html
  const downloadURI = (uri: string, filename: string) => {
    const link = document.createElement('a');
    link.download = filename;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // TODO: プレビュー用のコンポーネントに表示されている内容を保存する
  // この設計はおかしいのでなんとかする
  // 例えば拡大表示されているときは表示されている部分だけが保存されてしまう
  const handleSave = () => {
    if (stageRef.current) {
      const dataUrl = stageRef.current.toDataURL({
        pixelRatio: 1,
        mimeType: 'image/png',
        x: 0,
        y: 0,
        width: project.mat?.cols,
        height: project.mat?.rows,
      });
      downloadURI(dataUrl, imageFile?.name ?? 'output.png');
    }
  };

  return (
    <ConfigProvider
      theme={{
        algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
        components: {
          Layout: {
            headerHeight: headerHeight,
          },
        },
      }}
    >
      <Layout style={{ height: '100%' }}>
        <Header style={{ width: '100%', display: 'flex' }}>
          <Space>
            <Button onClick={handleSave}>保存</Button>
            <Button onClick={handleGrayscale}>グレースケール</Button>
          </Space>
          <Space style={{ float: 'right', marginLeft: 'auto' }}>
            <Switch
              checkedChildren="Dark"
              unCheckedChildren="Light"
              checked={isDarkMode}
              onChange={(checked) => setIsDarkMode(checked)}
            />
          </Space>
        </Header>
        <Content>
          {!project.mat ? (
            <div style={{ padding: '2rem', height: '100%' }}>
              <ImageSelector handleImageFile={(file) => setImageFile(file)} />
            </div>
          ) : (
            <ImagePreview
              project={project}
              width={windowWidth}
              height={windowHeight - headerHeight}
              stageRef={stageRef}
            />
          )}
        </Content>
      </Layout>
    </ConfigProvider>
  );
}

export default App;
