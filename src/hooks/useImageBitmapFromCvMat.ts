import { useEffect, useState } from 'react';
import cv from '@techstark/opencv-js';

export default function useImageBitmapFromCvMat(
  image: cv.Mat | undefined | null,
): ImageBitmap | null {
  const [imageBitmap, setImageBitmap] = useState<ImageBitmap | null>(null);

  useEffect(() => {
    (async () => {
      if (image) {
        // cv.CV_8UC4に変換する
        switch (image.type()) {
          case cv.CV_8UC1:
            cv.cvtColor(image, image, cv.COLOR_GRAY2RGBA);
            break;
          case cv.CV_8UC3:
            cv.cvtColor(image, image, cv.COLOR_RGB2RGBA);
            break;
          case cv.CV_8UC4:
            break;
          default:
            throw new Error('OpenCV convert error');
        }
        const imageData = new ImageData(
          new Uint8ClampedArray(image.data),
          image.cols,
          image.rows,
        );

        const imageBitmap = await createImageBitmap(imageData);

        setImageBitmap(imageBitmap);
      }
    })();
  }, [image]);

  return imageBitmap;
}
