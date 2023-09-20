import { RcFile } from 'antd/es/upload';
import { useState } from 'react'
import { Layer, Stage } from 'react-konva'
import URLImage from './components/URLImage';
import ImageSelector from './components/ImageSelector';

function App() {
  const [imageFile, setImageFile] = useState<RcFile | null>(null);

  if (imageFile === null) {
    return (
      <ImageSelector handleImageFile={file => setImageFile(file)} />
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
