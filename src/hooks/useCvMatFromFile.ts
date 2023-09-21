import React, { useCallback, useEffect, useRef, useState } from 'react';
import cv from '@techstark/opencv-js';

/*
 * Fileの内容をcv.Matに読み込むフック
 */
export default function useCvMatFromFile(): [
  cv.Mat | undefined,
  File | undefined,
  React.Dispatch<React.SetStateAction<File | undefined>>,
] {
  const [mat, setMat] = useState<cv.Mat | undefined>(undefined);
  const [imageFile, setImageFile] = useState<File | undefined>(undefined);
  const dummyImageRef = useRef<HTMLImageElement | null>(null);

  const handleLoad = useCallback(() => {
    if (dummyImageRef.current) {
      setMat(cv.imread(dummyImageRef.current));
    }
  }, [setMat]);

  const loadImage = useCallback(() => {
    const blobUrl = imageFile
      ? window.URL.createObjectURL(imageFile.slice())
      : undefined;

    if (blobUrl) {
      const img = new window.Image();
      img.src = blobUrl;
      img.crossOrigin = 'Anonymous';
      dummyImageRef.current = img;
      dummyImageRef.current.addEventListener('load', handleLoad);
    }
  }, [imageFile, handleLoad]);

  useEffect(() => {
    loadImage();
    return () => {
      if (dummyImageRef.current) {
        dummyImageRef.current.removeEventListener('load', handleLoad);
      }
    };
  }, [loadImage, handleLoad]);

  useEffect(() => {
    loadImage();
  }, [imageFile, loadImage]);

  useEffect(
    () => console.log('useCvMatFromFile/imageFile has changed', imageFile),
    [imageFile],
  );
  useEffect(
    () => console.log('useCvMatFromFile/setMat has changed', setMat),
    [setMat],
  );
  useEffect(
    () => console.log('useCvMatFromFile/handleLoad has changed', handleLoad),
    [handleLoad],
  );
  useEffect(
    () => console.log('useCvMatFromFile/loadImage has changed', loadImage),
    [loadImage],
  );

  return [mat, imageFile, setImageFile];
}
