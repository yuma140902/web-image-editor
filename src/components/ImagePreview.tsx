import { Layer, Stage } from "react-konva"
import URLImage from "./URLImage"

export type ImagePreviewProps = {
  image: Blob
}

/**
 * 編集中の画像を表示するコンポーネント
 */
export default function ImagePreview({ image }: ImagePreviewProps) {
  return (
    <Stage width={window.innerWidth} height={window.innerHeight}>
      <Layer>
        <URLImage src={window.URL.createObjectURL(image)} x={0} y={0} />
      </Layer>
    </Stage>
  )
}
