import ImageSelector from './components/ImageSelector';
import ImagePreview from './components/ImagePreview';
import { ConfigProvider, Layout, Space, Switch, theme } from 'antd';
import { Content, Header } from 'antd/es/layout/layout';
import cv from '@techstark/opencv-js';
import useCvMatFromFile from './hooks/useCvMatFromFile';
import { useWindowSize } from '@react-hook/window-size';
import { useEffect, useState } from 'react';
import { Project, renderProject } from './core/Project';
import MenuBar from './components/MenuBar';

function App() {
  const [project, setProject] = useState<Project>({});
  const [mat, imageFile, setImageFile] = useCvMatFromFile();
  const [windowWidth, windowHeight] = useWindowSize();
  const headerHeight = 64;
  // TODO: 永続化
  // TODO: ブラウザの設定をもとにデフォルト値を決める
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Headerをライトテーマにするために必要
  // https://github.com/ant-design/ant-design/issues/25048
  const {
    token: { colorBgContainer },
  } = theme.useToken();

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

  const handleSave = async () => {
    const stage = await renderProject(project);
    const dataUrl = stage.toDataURL({
      pixelRatio: 1,
      mimeType: 'image/png',
      x: 0,
      y: 0,
      width: project.mat?.cols,
      height: project.mat?.rows,
    });
    downloadURI(dataUrl, imageFile?.name ?? 'output.png');
  };

  const handleClose = () => {
    project.mat?.delete();
    setProject({});
  };

  const projectIsOpened = (): boolean => !!project.mat;

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
        <Header
          style={{
            ...{
              width: '100%',
              display: 'flex',
            },
            // https://github.com/ant-design/ant-design/issues/25048
            ...(isDarkMode ? {} : { background: colorBgContainer }),
          }}
        >
          <MenuBar
            projectIsOpened={projectIsOpened()}
            isDarkMode={isDarkMode}
            handleSave={handleSave}
            handleClose={handleClose}
            handleGrayscale={handleGrayscale}
          />
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
          {!projectIsOpened() ? (
            <div style={{ padding: '2rem', height: '100%' }}>
              <ImageSelector handleImageFile={(file) => setImageFile(file)} />
            </div>
          ) : (
            <ImagePreview
              project={project}
              width={windowWidth}
              height={windowHeight - headerHeight}
              isDarkMode={isDarkMode}
            />
          )}
        </Content>
      </Layout>
    </ConfigProvider>
  );
}

export default App;
