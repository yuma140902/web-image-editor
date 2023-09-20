import { RcFile } from 'antd/es/upload';
import { useState } from 'react';
import ImageSelector from './components/ImageSelector';
import ImagePreview from './components/ImagePreview';
import { Button, Layout, Space } from 'antd';
import { Content, Header } from 'antd/es/layout/layout';

function App() {
  const [imageFile, setImageFile] = useState<RcFile | null>(null);

  return (
    <Layout style={{ height: '100%' }}>
      <Header>
        <Space>
          <Button>グレースケール</Button>
        </Space>
      </Header>
      <Content>
        {imageFile === null ? (
          <ImageSelector handleImageFile={(file) => setImageFile(file)} />
        ) : (
          <ImagePreview image={imageFile.slice()} />
        )}
      </Content>
    </Layout>
  );
}

export default App;
