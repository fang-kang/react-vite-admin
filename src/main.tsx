import ReactDOM from 'react-dom/client';
import { ConfigProvider, theme } from 'antd';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from '@/store';
import App from './App';
import zhCN from 'antd/locale/zh_CN';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import '@/styles/index.less';

dayjs.locale('zh');

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <Provider store={store}>
    <ConfigProvider
      locale={zhCN}
      dropdownMatchSelectWidth
      select={{ showSearch: true }}
      theme={{
        token: {
          colorPrimary: '#379ff1',
          colorPrimaryText: '#379ff1',
          colorInfo: '#379ff1',
          colorLink: '#379ff1',
          colorInfoText: '#379ff1',
          borderRadius: 3,
        },
        algorithm: [theme.compactAlgorithm],
      }}
    >
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ConfigProvider>
  </Provider>
);
