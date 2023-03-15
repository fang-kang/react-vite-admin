import React from 'react';
import { Result, Typography } from 'antd';

const { Paragraph, Text } = Typography;

const NotFound: React.FC = () => (
  <Result status="error" title="页面走丢了" subTitle="请确认路径是否正确">
    <div className="desc">
      <Paragraph>
        <Text
          strong
          style={{
            fontSize: 16,
          }}
        >
          页面走丢了
        </Text>
      </Paragraph>
    </div>
  </Result>
);

export default NotFound;
