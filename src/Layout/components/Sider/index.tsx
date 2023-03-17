import { Layout, Menu } from 'antd';
import { UserMenu } from './UserMenu';
import { getMenuList, IMenu, menuList } from '@/router';
import { useNavigate } from 'react-router-dom';
import { ItemType } from 'antd/es/menu/hooks/useItems';
import { useSelector, useDispatch } from 'react-redux';
import { setActiveTab, setTabList } from '@/store/modules/global';
import { RootState } from '@/store';
import { findItemByKey } from '@/utils';
import React, { useEffect, useState } from 'react';

interface IProps {
  collapsed: boolean;
}

export const Sider: React.FC<IProps> = (props: IProps) => {
  const { collapsed } = props;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { activeTab, openKeys } = useSelector((store: RootState) => store.global);

  const [open, setOpen] = useState(openKeys);

  useEffect(() => {
    setOpen(openKeys);
  }, [openKeys]);

  useEffect(() => {
    if (collapsed) {
      setOpen([]);
      window.$openKeys = [];
    }
  }, [collapsed]);

  const renderItems = (menuList: IMenu[]): ItemType[] => {
    return menuList.map((menu) => {
      const { path, icon, title, children } = menu;
      const currentRouter = {
        key: path,
        icon,
        label: title,
        children,
      } as any;
      if (children && children.length > 0) {
        currentRouter.children = renderItems(children);
      }
      return currentRouter;
    });
  };

  const filterMenuList = menuList.filter((v) => !v.isHide);

  //   console.log(filterMenuList, 'filterMenuList');

  return (
    <Layout.Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      width={180}
      collapsedWidth={64}
      className="skeleton__left"
    >
      <UserMenu collapsed={collapsed} />
      <Menu
        selectedKeys={[activeTab]}
        openKeys={open}
        mode="inline"
        theme="dark"
        items={renderItems(filterMenuList)}
        onSelect={(item) => {
          navigate(item.key);
          dispatch(setActiveTab(item.key));
          const menu = findItemByKey(getMenuList({ a: 1 }), 'path', item.key) as IMenu;
          menu && dispatch(setTabList(menu));
        }}
        onOpenChange={(openKeys) => {
          setOpen([...open, ...openKeys]);
          window.$openKeys = [...open, ...openKeys];
        }}
      />
    </Layout.Sider>
  );
};
