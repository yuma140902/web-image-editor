import type cv from '@techstark/opencv-js';
import Konva from 'konva';
import { CvMatToImageBitmap } from '../utils/ConvertImage';

export type Project = {
  mat?: cv.Mat;
  previewMat?: cv.Mat;
};

/**
 * ProjectをKonvaのStageに描画する
 *
 * そのあとKonva.Stage#toDataURL()などを使えば画像として保存できる
 */
export async function renderProject(project: Project): Promise<Konva.Stage> {
  const dummyDiv = document.createElement('div') as HTMLDivElement;

  const stage = new Konva.Stage({
    container: dummyDiv,
    x: 0,
    y: 0,
    width: project.mat?.cols,
    height: project.mat?.rows,
  });

  const layer = new Konva.Layer();
  stage.add(layer);

  if (project.mat) {
    const image = new Konva.Image({
      image: await CvMatToImageBitmap(project.mat),
    });

    layer.add(image);
  }

  return stage;
}
