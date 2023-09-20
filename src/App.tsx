import { FileImageOutlined, InboxOutlined } from '@ant-design/icons'
import { DatePicker } from 'antd'
import { RcFile } from 'antd/es/upload'
import Dragger from 'antd/es/upload/Dragger'
import { useEffect, useRef, useState } from 'react'
import { Image, Layer, Rect, Stage, Text } from 'react-konva'

type URLImageProps = {
  src: string
  x: number
  y: number
}

function URLImage({ src, x, y }: URLImageProps) {
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [image, setImage] = useState<HTMLImageElement | null>(null);

  const loadImage = () => {
    const img = new window.Image();
    img.src = src;
    img.crossOrigin = 'Anonymous';
    imageRef.current = img;
    imageRef.current.addEventListener('load', handleLoad);
  }

  const handleLoad = () => {
    setImage(imageRef.current);
  }

  useEffect(() => {
    loadImage();
    return () => {
      if (imageRef.current) {
        imageRef.current.removeEventListener('load', handleLoad);
      }
    }
  }, []);

  useEffect(() => {
    loadImage();
  }, [src]);

  return <Image x={x} y={y} image={image} />
}


function App() {
  const [imageFile, setImageFile] = useState<RcFile | null>(null);
  const [count, setCount] = useState(0)

  return (
    <div>
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
      <DatePicker />
      <button onClick={() => setCount((count) => count + 1)}>
        count is {count}
      </button>
      <Stage width={window.innerWidth} height={window.innerHeight}>
        <Layer>
          <Text text="text on canvas" />
          <Rect x={20} y={50} width={100} height={100} fill="green" shadowBlur={10} />
          {
            imageFile !== null ?
              <URLImage src={window.URL.createObjectURL(imageFile.slice())} x={0} y={0} />
              : undefined
          }
        </Layer>
      </Stage>
    </div >
  )
}

export default App
