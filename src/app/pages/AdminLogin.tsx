import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Form, Input, Button, Card, Typography, App as AntdApp } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export default function AdminLogin() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { message } = AntdApp.useApp();

  const onFinish = (values: { email: string; password: string }) => {
    setLoading(true);
    setTimeout(() => {
      if (values.email === 'admin@worksetu.com' && values.password === 'admin123') {
        localStorage.setItem('ws_auth', 'true');
        localStorage.setItem('ws_user', values.email);
        navigate('/dashboard');
      } else {
        message.error('Invalid credentials. Please try again.');
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #001529 0%, #003366 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
      }}
    >
      <Card
        style={{
          width: '100%',
          maxWidth: 420,
          borderRadius: 16,
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          border: 'none',
        }}
        styles={{ body: { padding: '40px 40px' } }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div
            style={{
              width: 60,
              height: 60,
              background: '#1A73E8',
              borderRadius: 14,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 26,
              fontWeight: 800,
              color: '#fff',
              margin: '0 auto 16px',
              boxShadow: '0 4px 12px rgba(26,115,232,0.4)',
            }}
          >
            W
          </div>
          <Title level={3} style={{ margin: 0, color: '#1A1A2E' }}>
            Admin Panel Login
          </Title>
          <Text style={{ color: '#6B7280', fontSize: 14 }}>WorkSetu Super Admin</Text>
        </div>

        <Form
          name="login"
          layout="vertical"
          onFinish={onFinish}
          size="large"
          requiredMark={false}
        >
          <Form.Item
            name="email"
            label="Email Address"
            rules={[
              { required: true, message: 'Please enter your email' },
              { type: 'email', message: 'Please enter a valid email' },
            ]}
          >
            <Input
              prefix={<UserOutlined style={{ color: '#6B7280' }} />}
              placeholder="admin@worksetu.com"
              style={{ borderRadius: 8 }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: 'Please enter your password' }]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: '#6B7280' }} />}
              placeholder="Enter password"
              style={{ borderRadius: 8 }}
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, marginTop: 8 }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              style={{
                height: 48,
                borderRadius: 8,
                fontSize: 15,
                fontWeight: 600,
                background: '#1A73E8',
              }}
            >
              Login to Admin Panel
            </Button>
          </Form.Item>
        </Form>

        <div style={{ textAlign: 'center', marginTop: 24, padding: '12px 16px', background: '#F0F2F5', borderRadius: 8 }}>
          <Text style={{ fontSize: 12, color: '#6B7280' }}>
            Demo: admin@worksetu.com / admin123
          </Text>
        </div>
      </Card>
    </div>
  );
}