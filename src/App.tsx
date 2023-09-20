import { RcFile } from 'antd/es/upload';
import { useState } from 'react'
import ImageSelector from './components/ImageSelector';
import ImagePreview from './components/ImagePreview';

function App() {
  const [imageFile, setImageFile] = useState<RcFile | null>(null);

  if (imageFile === null) {
    return (
      <ImageSelector handleImageFile={file => setImageFile(file)} />
    )
  }
  else {
    return (
      <ImagePreview image={imageFile.slice()} />
    )
  }
}

export default App
