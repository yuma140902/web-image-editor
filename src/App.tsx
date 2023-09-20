import ImageSelector from './components/ImageSelector';
import ImagePreview from './components/ImagePreview';
import { Button, ConfigProvider, Layout, Space, Switch, theme } from 'antd';
import { Content, Header } from 'antd/es/layout/layout';
import cv from '@techstark/opencv-js';
import useCvMatFromFile from './hooks/useCvMatFromFile';
import { useWindowSize } from '@react-hook/window-size';
import { useState } from 'react';

function App() {
  const [cvMat, setCvMat, setImageFile] = useCvMatFromFile();
  const [windowWidth, windowHeight] = useWindowSize();
  const headerHeight = 64;
  const [isDarkMode, setIsDarkMode] = useState(false); // TODO: ブラウザの設定

  const handleGrayscale = () => {
    if (cvMat) {
      const imgGray = new cv.Mat();
      cv.cvtColor(cvMat, imgGray, cv.COLOR_BGR2GRAY);
      cvMat?.delete();
      setCvMat(imgGray);
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
            />
          )}
        </Content>
      </Layout>
    </ConfigProvider>
  );
}

export default App;
