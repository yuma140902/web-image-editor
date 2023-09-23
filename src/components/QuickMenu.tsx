import { SaveOutlined } from '@ant-design/icons';
import { Badge, FloatButton, Tooltip } from 'antd';

export type QuickMenuProps = {
  handleSave: () => void;
  hasUnsavedChanges: boolean;
};

export default function QuickMenu({
  handleSave,
  hasUnsavedChanges,
}: QuickMenuProps) {
  return (
    <FloatButton.Group style={{ top: 100, left: 24 }}>
      <Tooltip title="保存" placement="right">
        <Badge dot={hasUnsavedChanges}>
          <FloatButton icon={<SaveOutlined />} onClick={handleSave} />
        </Badge>
      </Tooltip>
    </FloatButton.Group>
  );
}
