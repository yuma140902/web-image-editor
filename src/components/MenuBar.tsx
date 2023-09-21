import { Menu, MenuProps } from 'antd';

export type MenuBarProps = {
  projectIsOpened: boolean;
  isDarkMode: boolean;
  handleGrayscale: () => void;
  handleSave: () => Promise<void>;
};

export default function MenuBar({
  projectIsOpened,
  isDarkMode,
  handleGrayscale,
  handleSave,
}: MenuBarProps) {
  const handleMenuClick = async ({
    key,
    keyPath,
  }: {
    key: string;
    keyPath: string[];
  }) => {
    if (key === 'save') {
      await handleSave();
    } else if (key === 'grayscale') {
      handleGrayscale();
    }
  };

  const menuItems: MenuProps['items'] = [
    {
      label: 'ファイル',
      key: 'file',
      children: [
        {
          label: '開く',
          key: 'open',
        },
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
