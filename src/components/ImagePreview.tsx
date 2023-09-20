import { Layer, Stage } from 'react-konva';
import { Image } from 'react-konva';
import cv from '@techstark/opencv-js';
import { useEffect, useState } from 'react';

export type ImagePreviewProps = {
  image: cv.Mat | undefined | null;
};

/**
 * 編集中の画像を表示するコンポーネント
 */
export default function ImagePreview({ image }: ImagePreviewProps) {
  const [imageBitmap, setImageBitmap] = useState<ImageBitmap | null>(null);

  useEffect(() => {
    (async () => {
      if (image) {
        // convert the img type to cv.CV_8UC4
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
            throw new Error(
              'Bad number of channels (Source image must have 1, 3 or 4 channels)',
            );
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

  if (imageBitmap) {
    return (
      <Stage width={innerWidth} height={innerHeight}>
        <Layer>
          <Image image={imageBitmap} />
        </Layer>
      </Stage>
    );
  } else {
    return <div>nothing</div>;
  }
}
