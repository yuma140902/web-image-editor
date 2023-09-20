import { FileImageOutlined } from '@ant-design/icons'
import { RcFile } from 'antd/es/upload';
import Dragger from 'antd/es/upload/Dragger';
import { useState } from 'react'
import { Layer, Stage } from 'react-konva'
import URLImage from './components/URLImage';

function App() {
  const [imageFile, setImageFile] = useState<RcFile | null>(null);

  if (imageFile === null) {
    return (
      <Dragger name="file" multiple={false} maxCount={1} showUploadList={false}
        beforeUpload={(file) => {
          console.log(file);
          setImageFile(file);
          return false;
        }}
      >
        <p className='ant-upload-drag-icon'>
          <FileImageOutlined />
        </p>
        <p className='ant-upload-text'>
          クリックまたはここへドラッグして画像を選択
        </p>
        <p className='ant-upload-hint'>aiueo</p>
      </Dragger>
    )
  }

  else {
    return (
      <div>
        <Stage width={window.innerWidth} height={window.innerHeight}>
          <Layer>
            <URLImage src={window.URL.createObjectURL(imageFile.slice())} x={0} y={0} />
          </Layer>
        </Stage>
      </div >
    )
  }
}

export default App
