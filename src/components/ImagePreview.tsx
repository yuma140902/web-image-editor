import { Layer, Stage } from 'react-konva';
import { Image } from 'react-konva';
import useImageBitmapFromCvMat from '../hooks/useImageBitmapFromCvMat';
import { Project } from '../core/Project';
import { FloatButton } from 'antd';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { useState } from 'react';

export type ImagePreviewProps = {
  project: Project;
  width: number;
  height: number;
  isDarkMode: boolean;
};

/**
 * 編集中の画像を表示するコンポーネント
 */
export default function ImagePreview({
  project,
  width,
  height,
  isDarkMode,
}: ImagePreviewProps) {
  const imageBitmap = useImageBitmapFromCvMat(project.mat);
  const [scale, setScale] = useState(1.0);

  const handleZoomIn = () => {
    setScale(scale + 0.1);
  };

  const handleZoomOut = () => {
    setScale(scale - 0.1);
  };

  const handleZoomReset = () => {
    setScale(1.0);
  };

  if (imageBitmap) {
    return (
      <>
        <Stage
          width={width}
          height={height}
          className={`checker ${isDarkMode ? 'dark' : 'light'}`}
        >
          <Layer>
            <Image
              image={imageBitmap}
              scaleX={scale}
              scaleY={scale}
              x={width / 2 - (imageBitmap.width * scale) / 2}
              y={height / 2 - (imageBitmap.height * scale) / 2}
            />
          </Layer>
        </Stage>
        <FloatButton.Group shape="square" style={{ right: 24 }}>
          <FloatButton icon={<PlusOutlined />} onClick={handleZoomIn} />
          <FloatButton icon={<MinusOutlined />} onClick={handleZoomOut} />
          <FloatButton description="1:1" onClick={handleZoomReset} />
        </FloatButton.Group>
      </>
    );
  } else {
    return <div>nothing</div>;
  }
}
