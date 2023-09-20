import ImageSelector from './components/ImageSelector';
import ImagePreview from './components/ImagePreview';
import { Button, Layout, Space } from 'antd';
import { Content, Header } from 'antd/es/layout/layout';
import cv from '@techstark/opencv-js';
import useCvMatFromFile from './hooks/useCvMatFromFile';
import { useWindowSize } from '@react-hook/window-size';

function App() {
  const [imageCvMat, setImageCvMat, setImageFile] = useCvMatFromFile();
  const [windowWidth, windowHeight] = useWindowSize();
  // design token: headerHeight
  // https://ant.design/docs/react/customize-theme#customize-design-token
  const headerHeight = 64;

  const handleGrayscale = () => {
    if (imageCvMat) {
      const imgGray = new cv.Mat();
      cv.cvtColor(imageCvMat, imgGray, cv.COLOR_BGR2GRAY);
      imageCvMat?.delete();
      setImageCvMat(imgGray);
    }
  };

  return (
    <Layout style={{ height: '100%' }}>
      <Header>
        <Space>
          <Button onClick={handleGrayscale}>グレースケール</Button>
        </Space>
      </Header>
      <Content>
        {!imageCvMat ? (
          <ImageSelector handleImageFile={(file) => setImageFile(file)} />
        ) : (
          <ImagePreview
            image={imageCvMat}
            width={windowWidth}
            height={windowHeight - headerHeight}
          />
        )}
      </Content>
    </Layout>
  );
}

export default App;
