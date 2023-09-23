import { Layer, Stage } from 'react-konva';
import { Image } from 'react-konva';
import useImageBitmapFromCvMat from '../hooks/useImageBitmapFromCvMat';
import { Project } from '../core/Project';
import { FloatButton, Tooltip } from 'antd';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { useState } from 'react';
import Konva from 'konva';

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
  const imageBitmap = useImageBitmapFromCvMat(
    project.previewMat ?? project.mat,
  );
  const [scale, setScale] = useState(1.0);
  const [isDragging, setIsDragging] = useState(false);
  const [lastMousePos, setLastMousePos] = useState({ x: 0.0, y: 0.0 });
  const [offset, setOffset] = useState({ x: 0.0, y: 0.0 });

  const handleZoomIn = () => {
    setScale(scale + 0.1);
  };

  const handleZoomOut = () => {
    setScale(scale - 0.1);
  };

  const handleViewReset = () => {
    setScale(1.0);
    setOffset({ x: 0.0, y: 0.0 });
  };

  const handlePointerDown = (e: Konva.KonvaEventObject<PointerEvent>) => {
    setIsDragging(true);
    const posX = e.evt.pageX;
    const posY = e.evt.pageY;
    setLastMousePos({ x: posX, y: posY });
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  const handlePointerMove = (e: Konva.KonvaEventObject<PointerEvent>) => {
    if (isDragging) {
      const posX = e.evt.pageX;
      const posY = e.evt.pageY;
      const dx = posX - lastMousePos.x;
      const dy = posY - lastMousePos.y;
      setOffset({ x: offset.x + dx, y: offset.y + dy });
      setLastMousePos({ x: posX, y: posY });
    }
  };

  const handleWheel = (e: Konva.KonvaEventObject<WheelEvent>) => {
    setScale(scale * (1.0 + e.evt.deltaY * -0.001));
  };

  if (imageBitmap) {
    return (
      <>
        <Stage
          width={width}
          height={height}
          className={`checker ${isDarkMode ? 'dark' : 'light'}`}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerMove={handlePointerMove}
          onWheel={handleWheel}
        >
          <Layer>
            <Image
              image={imageBitmap}
              scaleX={scale}
              scaleY={scale}
              x={width / 2 - (imageBitmap.width * scale) / 2 + offset.x}
              y={height / 2 - (imageBitmap.height * scale) / 2 + offset.y}
            />
          </Layer>
        </Stage>
        <FloatButton.Group shape="square" style={{ right: 24 }}>
          <Tooltip title="ズームイン" placement="left">
            <FloatButton icon={<PlusOutlined />} onClick={handleZoomIn} />
          </Tooltip>
          <Tooltip title="ズームアウト" placement="left">
            <FloatButton icon={<MinusOutlined />} onClick={handleZoomOut} />
          </Tooltip>
          <Tooltip title="ビューをリセット" placement="left">
            <FloatButton
              shape="square"
              description="1:1"
              onClick={handleViewReset}
            />
          </Tooltip>
        </FloatButton.Group>
      </>
    );
  } else {
    return <div>nothing</div>;
  }
}
