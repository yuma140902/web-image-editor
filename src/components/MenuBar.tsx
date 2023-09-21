import { Menu, MenuProps } from 'antd';

export type MenuBarProps = {
  projectIsOpened: boolean;
  isDarkMode: boolean;
  handleSave: () => Promise<void>;
  handleClose: () => void;
  handleGrayscale: () => void;
};

export default function MenuBar({
  projectIsOpened,
  isDarkMode,
  handleSave,
  handleClose,
  handleGrayscale,
}: MenuBarProps) {
  const handleMenuClick = async ({ key }: { key: string }) => {
    if (key === 'save') {
      await handleSave();
    } else if (key === 'grayscale') {
      handleGrayscale();
    } else if (key === 'close') {
      handleClose();
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
          disabled: !projectIsOpened,
        },
        {
          label: '閉じる',
          key: 'close',
          danger: true,
          disabled: !projectIsOpened,
        },
      ],
    },
    {
      label: 'フィルター',
      key: 'filter',
      children: [
        {
          label: 'グレースケール',
          key: 'grayscale',
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
