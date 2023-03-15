import { If } from '@/components/If';
import { UserOutlined, CaretDownOutlined, PoweroffOutlined, SettingOutlined } from '@ant-design/icons';
import { Avatar, Dropdown, Button, MenuProps } from 'antd';

interface IProps {
  collapsed: boolean;
}

export function UserMenu(props: IProps) {
  const { collapsed } = props;

  const items: MenuProps['items'] = [
    {
      label: '我的帐户',
      key: '1',
      icon: <SettingOutlined />,
    },
    {
      label: '退出',
      key: '2',
      icon: <PoweroffOutlined />,
    },
  ];

  return (
    <div className="userMenu" style={{ margin: collapsed ? '20px 0 10px 0' : '20px 45px 10px 0' }}>
      <Avatar size={'small'} icon={<UserOutlined />} />
      <If when={!collapsed}>
        <Dropdown menu={{ items }}>
          <Button>
            管理员
            <CaretDownOutlined style={{ fontSize: 10 }} />
          </Button>
        </Dropdown>
      </If>
    </div>
  );
}
