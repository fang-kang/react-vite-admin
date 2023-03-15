import { Layout } from 'antd';
import React from 'react';
import { PageTabs } from '../PageTabs';

export const Content: React.FC = () => {
  return (
    <Layout.Content className="skeleton__main-content">
      <PageTabs />
    </Layout.Content>
  );
};
