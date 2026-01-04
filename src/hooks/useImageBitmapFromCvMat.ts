import type cv from '@techstark/opencv-js';
import { useEffect, useState } from 'react';
import { CvMatToImageBitmap } from '../utils/ConvertImage';

export default function useImageBitmapFromCvMat(
  image: cv.Mat | undefined | null
): ImageBitmap | null {
  const [imageBitmap, setImageBitmap] = useState<ImageBitmap | null>(null);

  useEffect(() => {
    (async () => {
      if (image) {
        const imageBitmap = await CvMatToImageBitmap(image);

        setImageBitmap(imageBitmap);
      }
    })();
  }, [image]);

  return imageBitmap;
}
