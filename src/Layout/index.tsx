import { Spin, Layout as AntdLayout } from 'antd';
import { useEffect, useState } from 'react';
import { Content, Header, Sider } from './components';

export const Layout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <Spin className={'skeleton__main-loading'} tip="加载中, 请稍等..." spinning={loading}>
      <AntdLayout className="skeleton">
        <Sider collapsed={collapsed} />
        <AntdLayout className="skeleton__main">
          <Header collapsed={collapsed} setCollapsed={setCollapsed} />
          <Content />
        </AntdLayout>
      </AntdLayout>
    </Spin>
  );
};
