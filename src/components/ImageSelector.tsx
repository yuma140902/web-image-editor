import { FileImageOutlined } from "@ant-design/icons";
import { RcFile } from "antd/es/upload";
import Dragger from "antd/es/upload/Dragger";

export type ImageSelectorProps = {
  handleImageFile: (imageFile: RcFile) => void
}

/**
 * ファイル選択ダイアログまたはドラッグアンドドロップによって画像を選択するコンポーネント
 */
export default function ImageSelector({ handleImageFile }: ImageSelectorProps) {
  return (
    <Dragger name="file" multiple={false} maxCount={1} showUploadList={false}
      beforeUpload={(file) => {
        handleImageFile(file);
        return false;
      }}
    >
      <p className='ant-upload-drag-icon'>
        <FileImageOutlined />
      </p>
      <p className='ant-upload-text'>
        クリックまたはここへドラッグして画像を選択
      </p>
      <p className='ant-upload-hint'>aiueo</p>
    </Dragger>
  )
}
