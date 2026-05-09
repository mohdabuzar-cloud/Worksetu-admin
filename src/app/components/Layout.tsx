import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router';
import {
  Layout,
  Menu,
  Avatar,
  Badge,
  Button,
  Typography,
  Space,
  App as AntdApp,
} from 'antd';
import {
  DashboardOutlined,
  ToolOutlined,
  UserOutlined,
  TeamOutlined,
  SafetyCertificateOutlined,
  BookOutlined,
  SwapOutlined,
  WarningOutlined,
  DollarOutlined,
  BarChartOutlined,
  SettingOutlined,
  BellOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';

const { Sider, Header, Content } = Layout;
const { Text } = Typography;

const menuItems = [
  { key: '/dashboard', icon: <DashboardOutlined />, label: 'Dashboard' },
  { key: '/services', icon: <ToolOutlined />, label: 'Service Management' },
  { key: '/users', icon: <UserOutlined />, label: 'User Management' },
  { key: '/workers', icon: <TeamOutlined />, label: 'Worker Management' },
  { key: '/kyc', icon: <SafetyCertificateOutlined />, label: 'KYC & Verification' },
  { key: '/bookings', icon: <BookOutlined />, label: 'Booking Management' },
  { key: '/assignment', icon: <SwapOutlined />, label: 'Manual Assignment' },
  { key: '/disputes', icon: <WarningOutlined />, label: 'Dispute & Support' },
  { key: '/finance', icon: <DollarOutlined />, label: 'Finance & Payouts' },
  { key: '/reports', icon: <BarChartOutlined />, label: 'Reports & Analytics' },
  { key: '/settings', icon: <SettingOutlined />, label: 'Platform Settings' },
];

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/services': 'Service Management',
  '/users': 'User Management',
  '/workers': 'Worker Management',
  '/kyc': 'KYC & Verification',
  '/bookings': 'Booking Management',
  '/assignment': 'Manual Assignment',
  '/disputes': 'Dispute & Support',
  '/finance': 'Finance & Payouts',
  '/reports': 'Reports & Analytics',
  '/settings': 'Platform Settings',
};

export function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const { modal } = AntdApp.useApp();

  const handleLogout = () => {
    modal.confirm({
      title: 'Confirm Logout',
      content: 'Are you sure you want to logout?',
      okText: 'Logout',
      okType: 'danger',
      onOk: () => {
        localStorage.removeItem('ws_auth');
        localStorage.removeItem('ws_user');
        navigate('/login');
      },
    });
  };

  const currentPath = '/' + location.pathname.split('/')[1];
  const pageTitle = pageTitles[currentPath] || 'WorkSetu Admin';

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        width={220}
        style={{
          background: '#FFFFFF',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 100,
          overflow: 'auto',
          display: 'flex',
          flexDirection: 'column',
          borderRight: '1px solid #E5E7EB',
        }}
        trigger={null}
      >
        {/* Logo */}
        <div
          style={{
            padding: collapsed ? '20px 12px' : '20px 16px',
            borderBottom: '1px solid #E5E7EB',
            textAlign: collapsed ? 'center' : 'left',
          }}
        >
          {!collapsed ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    background: '#4F46E5',
                    borderRadius: 8,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    color: '#fff',
                    fontSize: 16,
                    flexShrink: 0,
                  }}
                >
                  W
                </div>
                <div>
                  <div style={{ color: '#0F172A', fontWeight: 700, fontSize: 15, lineHeight: 1.2 }}>
                    WorkSetu
                  </div>
                  <div style={{ color: '#64748B', fontSize: 10, lineHeight: 1.2 }}>
                    Admin Panel
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div
              style={{
                width: 32,
                height: 32,
                background: '#4F46E5',
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                color: '#fff',
                fontSize: 16,
                margin: '0 auto',
              }}
            >
              W
            </div>
          )}
        </div>

        {/* Navigation Menu */}
        <Menu
          theme="light"
          mode="inline"
          selectedKeys={[currentPath]}
          onClick={({ key }) => navigate(key)}
          items={menuItems}
          style={{ flex: 1, borderRight: 0, background: '#FFFFFF' }}
        />

        {/* Admin Profile Bottom */}
        <div
          style={{
            padding: collapsed ? '12px 8px' : '12px 16px',
            borderTop: '1px solid #E5E7EB',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <Avatar
            size={32}
            style={{ background: '#4F46E5', flexShrink: 0 }}
            icon={<UserOutlined />}
          />
          {!collapsed && (
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <div style={{ color: '#0F172A', fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                Super Admin
              </div>
              <div style={{ color: '#64748B', fontSize: 11, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                admin@worksetu.com
              </div>
            </div>
          )}
          {!collapsed && (
            <Button
              type="text"
              icon={<LogoutOutlined />}
              onClick={handleLogout}
              style={{ color: '#64748B', padding: 4 }}
              title="Logout"
            />
          )}
        </div>
      </Sider>

      {/* Main Area */}
      <Layout style={{ marginLeft: collapsed ? 80 : 220, transition: 'margin-left 0.2s' }}>
        {/* Header */}
        <Header
          style={{
            background: '#fff',
            padding: '0 24px',
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid #E5E7EB',
            position: 'sticky',
            top: 0,
            zIndex: 99,
            boxShadow: '0 1px 4px rgba(0,21,41,0.08)',
          }}
        >
          <Space>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{ fontSize: 16 }}
            />
            <Text strong style={{ fontSize: 18, color: '#1A1A2E' }}>
              {pageTitle}
            </Text>
          </Space>

          <Space size={16}>
            <Badge count={5} size="small">
              <Button
                type="text"
                icon={<BellOutlined style={{ fontSize: 18 }} />}
                style={{ color: '#6B7280' }}
              />
            </Badge>
            <Space size={8}>
              <Avatar
                size={36}
                style={{ background: '#1A73E8' }}
                icon={<UserOutlined />}
              />
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#1A1A2E', lineHeight: 1.3 }}>
                  Super Admin
                </div>
                <div style={{ fontSize: 11, color: '#6B7280', lineHeight: 1.3 }}>
                  administrator
                </div>
              </div>
            </Space>
          </Space>
        </Header>

        {/* Content */}
        <Content
          style={{
            padding: 24,
            background: '#F0F2F5',
            minHeight: 'calc(100vh - 64px)',
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
