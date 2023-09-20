import React, { useCallback, useEffect, useRef, useState } from 'react';
import cv from '@techstark/opencv-js';

/*
 * Fileの内容をcv.Matに読み込むフック
 */
export default function useCvMatFromFile(
  setCvMat: (mat: cv.Mat) => void,
): [File | undefined, React.Dispatch<React.SetStateAction<File | undefined>>] {
  const [imageFile, setImageFile] = useState<File | undefined>(undefined);
  const dummyImageElementRef = useRef<HTMLImageElement | null>(null);

  const loadImage = useCallback(() => {
    const blobUrl = imageFile
      ? window.URL.createObjectURL(imageFile.slice())
      : undefined;

    if (blobUrl) {
      const img = new window.Image();
      img.src = blobUrl;
      img.crossOrigin = 'Anonymous';
      dummyImageElementRef.current = img;
      dummyImageElementRef.current.addEventListener('load', handleLoad);
    }
  }, [imageFile]);

  const handleLoad = () => {
    if (dummyImageElementRef.current) {
      setCvMat(cv.imread(dummyImageElementRef.current));
    }
  };

  useEffect(() => {
    loadImage();
    return () => {
      if (dummyImageElementRef.current) {
        dummyImageElementRef.current.removeEventListener('load', handleLoad);
      }
    };
  }, [loadImage]);

  useEffect(() => {
    loadImage();
  }, [imageFile, loadImage]);

  return [imageFile, setImageFile];
}
