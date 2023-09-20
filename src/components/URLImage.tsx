import { useEffect, useRef, useState } from "react";
import { Image } from 'react-konva';

export type URLImageProps = {
  src: string
  x: number
  y: number
}

export default function URLImage({ src, x, y }: URLImageProps) {
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [image, setImage] = useState<HTMLImageElement | null>(null);

  const loadImage = () => {
    const img = new window.Image();
    img.src = src;
    img.crossOrigin = 'Anonymous';
    imageRef.current = img;
    imageRef.current.addEventListener('load', handleLoad);
  }

  const handleLoad = () => {
    setImage(imageRef.current);
  }

  useEffect(() => {
    loadImage();
    return () => {
      if (imageRef.current) {
        imageRef.current.removeEventListener('load', handleLoad);
      }
    }
  }, []);

  useEffect(() => {
    loadImage();
  }, [src]);

  return <Image x={x} y={y} image={image} />
}

