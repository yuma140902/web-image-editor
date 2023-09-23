import { useWindowSize } from '@react-hook/window-size';
import { Button, Drawer, Space } from 'antd';
import { ReactNode } from 'react';

export type ToolDrawerProps = {
  title: string;
  open: boolean;
  size?: number;
  handleCancel: () => void;
  handleConfirm: () => void;
  children: ReactNode;
};

export default function ToolDrawer({
  title,
  open,
  handleCancel,
  handleConfirm,
  children,
}: ToolDrawerProps) {
  const [windowWidth, windowHeight] = useWindowSize();

  return (
    <Drawer
      title={title}
      open={open}
      closable={false}
      onClose={handleConfirm}
      placement={windowWidth > windowHeight ? 'right' : 'bottom'}
      maskStyle={{ background: 'transparent', display: 'none' }}
      extra={
        <Space>
          <Button onClick={handleCancel}>キャンセル</Button>
          <Button onClick={handleConfirm} type="primary">
            適用
          </Button>
        </Space>
      }
    >
      {children}
    </Drawer>
  );
}
