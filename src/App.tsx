import { RcFile } from 'antd/es/upload';
import { useEffect, useRef, useState } from 'react';
import ImageSelector from './components/ImageSelector';
import ImagePreview from './components/ImagePreview';
import { Button, Layout, Space } from 'antd';
import { Content, Header } from 'antd/es/layout/layout';
import cv from '@techstark/opencv-js';

function App() {
  const [imageFile, setImageFile] = useState<RcFile | null>(null);

  const imageElementRef = useRef<HTMLImageElement | null>(null);
  const [imageElement, setImageElement] = useState<HTMLImageElement | null>(
    null,
  );
  const [imageCvMat, setImageCvMat] = useState<cv.Mat | undefined>(undefined);

  const loadImage = () => {
    const imageBlobUrl = imageFile
      ? window.URL.createObjectURL(imageFile.slice())
      : undefined;

    if (imageBlobUrl) {
      const img = new window.Image();
      img.src = imageBlobUrl;
      img.crossOrigin = 'Anonymous';
      imageElementRef.current = img;
      imageElementRef.current.addEventListener('load', handleLoad);
    }
  };

  const handleLoad = () => {
    if (imageElementRef.current) {
      setImageElement(imageElementRef.current);
      setImageCvMat(cv.imread(imageElementRef.current));
    }
  };

  useEffect(() => {
    loadImage();
    return () => {
      if (imageElementRef.current) {
        imageElementRef.current.removeEventListener('load', handleLoad);
      }
    };
  }, []);

  useEffect(() => {
    loadImage();
  }, [imageFile]);

  const handleGrayscale = () => {
    if (imageElementRef.current) {
      const imgIn = cv.imread(imageElementRef.current);
      const imgGray = new cv.Mat();
      cv.cvtColor(imgIn, imgGray, cv.COLOR_BGR2GRAY);
      imageCvMat?.delete();
      setImageCvMat(imgGray);
      imgIn.delete();
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
        {imageFile === null ? (
          <ImageSelector handleImageFile={(file) => setImageFile(file)} />
        ) : (
          <ImagePreview image={imageCvMat} />
        )}
      </Content>
    </Layout>
  );
}

export default App;
