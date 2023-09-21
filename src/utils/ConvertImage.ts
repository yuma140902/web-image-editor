import cv from '@techstark/opencv-js';

/**
 * OpenCVのMatをImageBitmapに変換する
 */
export async function CvMatToImageBitmap(mat: cv.Mat): Promise<ImageBitmap> {
  const imageData = CvMatToImageData(mat);
  return await createImageBitmap(imageData);
}

/**
 * OpenCVのMatをImageDataに変換する
 */
export function CvMatToImageData(mat: cv.Mat): ImageData {
  // cv.CV_8UC4に変換する
  switch (mat.type()) {
    case cv.CV_8UC1:
      cv.cvtColor(mat, mat, cv.COLOR_GRAY2RGBA);
      break;
    case cv.CV_8UC3:
      cv.cvtColor(mat, mat, cv.COLOR_RGB2RGBA);
      break;
    case cv.CV_8UC4:
      break;
    default:
      throw new Error('OpenCV convert error');
  }
  return new ImageData(new Uint8ClampedArray(mat.data), mat.cols, mat.rows);
}
