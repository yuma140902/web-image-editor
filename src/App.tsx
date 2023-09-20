import { DatePicker } from 'antd'
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
  const [count, setCount] = useState(0)

  return (
    <div>
      <DatePicker />
      <button onClick={() => setCount((count) => count + 1)}>
        count is {count}
      </button>
      <Stage width={window.innerWidth} height={window.innerHeight}>
        <Layer>
          <Text text="text on canvas" />
          <Rect x={20} y={50} width={100} height={100} fill="green" shadowBlur={10} />
          <URLImage src="https://konvajs.org/assets/lion.png" x={0} y={0} />
        </Layer>
      </Stage>
    </div>
  )
}

export default App
