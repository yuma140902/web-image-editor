import { Layer, Stage } from 'react-konva';
import { Image } from 'react-konva';
import cv from '@techstark/opencv-js';
import useImageBitmapFromCvMat from '../hooks/useImageBitmapFromCvMat';

export type ImagePreviewProps = {
  image: cv.Mat | undefined | null;
  width: number;
  height: number;
};

/**
 * 編集中の画像を表示するコンポーネント
 */
export default function ImagePreview({
  image,
  width,
  height,
}: ImagePreviewProps) {
  const imageBitmap = useImageBitmapFromCvMat(image);

  if (imageBitmap) {
    return (
      <Stage width={width} height={height}>
        <Layer>
          <Image image={imageBitmap} />
        </Layer>
      </Stage>
    );
  } else {
    return <div>nothing</div>;
  }
}
