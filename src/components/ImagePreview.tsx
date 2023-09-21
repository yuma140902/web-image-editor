import { Layer, Stage } from 'react-konva';
import { Image } from 'react-konva';
import useImageBitmapFromCvMat from '../hooks/useImageBitmapFromCvMat';
import { Project } from '../core/Project';

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

  if (imageBitmap) {
    return (
      <Stage
        width={width}
        height={height}
        className={`checker ${isDarkMode ? 'dark' : 'light'}`}
      >
        <Layer>
          <Image image={imageBitmap} />
        </Layer>
      </Stage>
    );
  } else {
    return <div>nothing</div>;
  }
}
