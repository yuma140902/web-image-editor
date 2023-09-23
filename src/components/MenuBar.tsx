import { DeleteOutlined, SaveOutlined } from '@ant-design/icons';
import { Badge, Menu, MenuProps } from 'antd';

export type MenuBarProps = {
  projectIsOpened: boolean;
  isDarkMode: boolean;
  hasUnsavedChanges: boolean;
  handleSave: () => Promise<void>;
  handleClose: () => void;
  handleGrayscale: () => void;
  handleBinarization: () => void;
  handleCanny: () => void;
  handleInvert: () => void;
  handleContrast: () => void;
};

export default function MenuBar({
  projectIsOpened,
  isDarkMode,
  hasUnsavedChanges,
  handleSave,
  handleClose,
  handleGrayscale,
  handleBinarization,
  handleCanny,
  handleInvert,
  handleContrast,
}: MenuBarProps) {
  const handleMenuClick = async ({ key }: { key: string }) => {
    if (key === 'save') {
      await handleSave();
    } else if (key === 'close') {
      handleClose();
    } else if (key === 'grayscale') {
      handleGrayscale();
    } else if (key === 'binarization') {
      handleBinarization();
    } else if (key === 'canny') {
      handleCanny();
    } else if (key === 'invert') {
      handleInvert();
    } else if (key === 'contrast') {
      handleContrast();
    }
  };

  const menuItems: MenuProps['items'] = [
    {
      label: 'ファイル',
      key: 'file',
      children: [
        {
          label: '保存',
          key: 'save',
          icon: (
            <Badge dot={hasUnsavedChanges}>
              <SaveOutlined />
            </Badge>
          ),
          disabled: !projectIsOpened,
        },
        {
          label: '閉じる',
          key: 'close',
          icon: <DeleteOutlined />,
          danger: true,
          disabled: !projectIsOpened,
        },
      ],
    },
    {
      label: '編集',
      key: 'edit',
      children: [
        {
          label: 'グレースケール',
          key: 'grayscale',
          disabled: !projectIsOpened,
        },
        {
          label: '二値化',
          key: 'binarization',
          disabled: !projectIsOpened,
        },
        {
          label: 'エッジ検出 (Canny法)',
          key: 'canny',
          disabled: !projectIsOpened,
        },
        {
          label: '色を反転',
          key: 'invert',
          disabled: !projectIsOpened,
        },

        {
          label: 'コントラストと明るさ',
          key: 'contrast',
          disabled: !projectIsOpened,
        },
      ],
    },
  ];

  return (
    <Menu
      items={menuItems}
      mode="horizontal"
      selectable={false}
      theme={isDarkMode ? 'dark' : 'light'}
      onClick={handleMenuClick}
    />
  );
}
