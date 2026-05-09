import { RouterProvider } from 'react-router';
import { ConfigProvider, App as AntdApp } from 'antd';
import { router } from './routes';

export default function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#4F46E5',
          colorSuccess: '#34A853',
          colorError: '#EA4335',
          colorWarning: '#FBBC04',
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif',
          borderRadius: 8,
          colorBgLayout: '#F0F2F5',
        },
        components: {
          Layout: {
            siderBg: '#FFFFFF',
            triggerBg: '#FFFFFF',
          },
          Menu: {
            itemBg: '#FFFFFF',
            subMenuItemBg: '#FFFFFF',
            itemColor: '#334155',
            itemHoverColor: '#0F172A',
            itemSelectedColor: '#4F46E5',
            itemHoverBg: '#F1F5F9',
            itemSelectedBg: '#EEF2FF',
          },
        },
      }}
    >
      <AntdApp>
        <RouterProvider router={router} />
      </AntdApp>
    </ConfigProvider>
  );
}
