import cv from '@techstark/opencv-js';
import Konva from 'konva';
import { CvMatToImageBitmap } from '../utils/ConvertImage';

export type Project = {
  mat?: cv.Mat;
};

export async function renderProject(project: Project): Promise<Konva.Stage> {
  let dummyDiv = document.getElementById(
    'renderProject_dummyDiv',
  ) as HTMLDivElement;
  if (!dummyDiv) {
    dummyDiv = document.createElement('div') as HTMLDivElement;
  }

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