import { Layer, Stage } from 'react-konva';
import { Image } from 'react-konva';
import useImageBitmapFromCvMat from '../hooks/useImageBitmapFromCvMat';
import React from 'react';
import { Project } from '../core/Project';
import Konva from 'konva';

export type ImagePreviewProps = {
  project: Project;
  width: number;
  height: number;
  isDarkMode: boolean;
  stageRef: React.RefObject<Konva.Stage>;
};

/**
 * 編集中の画像を表示するコンポーネント
 */
export default function ImagePreview({
  project,
  width,
  height,
  isDarkMode,
  stageRef,
}: ImagePreviewProps) {
  const imageBitmap = useImageBitmapFromCvMat(project.mat);

  if (imageBitmap) {
    return (
      <Stage
        width={width}
        height={height}
        ref={stageRef}
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
