import { IfWrapper, If, Else } from '@/components/If';
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import { Button, Layout } from 'antd';
import logo from '@/assets/react.svg';
import React from 'react';

interface IProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export const Header: React.FC<IProps> = (props: IProps) => {
  const { collapsed, setCollapsed } = props;

  return (
    <Layout.Header className="skeleton__main-header">
      <div className="header">
        <div className="header__left">
          <Button
            type="primary"
            className="header__left-button"
            onClick={() => {
              setCollapsed(!collapsed);
            }}
          >
            <IfWrapper>
              <If when={collapsed}>
                <MenuUnfoldOutlined style={{ fontSize: 12 }} />
              </If>
              <Else>
                <MenuFoldOutlined style={{ fontSize: 12 }} />
              </Else>
            </IfWrapper>
          </Button>
          <div className="header__left-title">
            <img src={logo} width={25} height={25} style={{ marginRight: 10 }} />
            后台管理系统
          </div>
        </div>
      </div>
    </Layout.Header>
  );
};
