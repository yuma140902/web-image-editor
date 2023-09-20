import ImageSelector from './components/ImageSelector';
import ImagePreview from './components/ImagePreview';
import { Button, ConfigProvider, Layout, Space, Switch, theme } from 'antd';
import { Content, Header } from 'antd/es/layout/layout';
import cv from '@techstark/opencv-js';
import useCvMatFromFile from './hooks/useCvMatFromFile';
import { useWindowSize } from '@react-hook/window-size';
import { useRef, useState } from 'react';
import { Stage } from 'konva/lib/Stage';

function App() {
  const [cvMat, setCvMat, imageFile, setImageFile] = useCvMatFromFile();
  const [windowWidth, windowHeight] = useWindowSize();
  const headerHeight = 64;
  // TODO: 永続化
  // TODO: ブラウザの設定をもとにデフォルト値を決める
  const [isDarkMode, setIsDarkMode] = useState(false);
  const stageRef = useRef<Stage | null>(null);

  const handleGrayscale = () => {
    if (cvMat) {
      const imgGray = new cv.Mat();
      cv.cvtColor(cvMat, imgGray, cv.COLOR_BGR2GRAY);
      cvMat?.delete();
      setCvMat(imgGray);
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
          {!cvMat ? (
            <div style={{ padding: '2rem', height: '100%' }}>
              <ImageSelector handleImageFile={(file) => setImageFile(file)} />
            </div>
          ) : (
            <ImagePreview
              image={cvMat}
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
