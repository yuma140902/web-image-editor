import { CloseOutlined, SaveOutlined } from '@ant-design/icons';
import { FloatButton, Tooltip } from 'antd';

export type QuickMenuProps = {
  handleSave: () => void;
};

export default function QuickMenu({ handleSave }: QuickMenuProps) {
  return (
    <FloatButton.Group style={{ top: 100, left: 24 }}>
      <Tooltip title="保存" placement="right">
        <FloatButton icon={<SaveOutlined />} onClick={handleSave} />
      </Tooltip>
    </FloatButton.Group>
  );
}
