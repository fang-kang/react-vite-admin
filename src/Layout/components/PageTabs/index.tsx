import { RootState } from '@/store';
import { removeTabList, setActiveTab } from '@/store/modules/global';
import { Tabs } from 'antd';
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export const PageTabs: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { tabList, activeTab } = useSelector((store: RootState) => store.global);

  console.log(tabList, '=tabList==');
  const onChange = (key: string) => {
    navigate(key);
    dispatch(setActiveTab(key));
  };

  const onEdit = (path: React.MouseEvent | React.KeyboardEvent | string, action: 'add' | 'remove') => {
    if (action === 'remove') {
      remove(path);
    }
  };

  const remove = (path: React.MouseEvent | React.KeyboardEvent | string) => {
    dispatch(removeTabList(path));
    navigate(window.$activeTab);
  };

  return (
    <Tabs
      className="page-tabs"
      type="editable-card"
      hideAdd={true}
      animated={false}
      activeKey={activeTab}
      items={tabList.map((v) => {
        return {
          ...v,
        };
      })}
      onChange={onChange}
      onEdit={onEdit}
    />
  );
};
