import { useState } from 'react';
import {
  Card, Form, Input, Switch, Button, Typography, Tabs,
  Table, Modal, Row, Col, Space, App as AntdApp,
} from 'antd';
import { PlusOutlined, EditOutlined } from '@ant-design/icons';

const { Text, Title } = Typography;
const { TextArea } = Input;

const cities = [{ key: 1, city: 'Ludhiana', state: 'Punjab', status: 'Active', workers: 58 }];

const pushTemplates = [
  { id: 1, title: 'Booking Confirmed', template: 'Your booking for {service} is confirmed! Worker assigned: {worker_name}' },
  { id: 2, title: 'Worker Assigned', template: 'Worker {worker_name} is on the way! ETA: {eta} minutes' },
  { id: 3, title: 'Payment Received', template: 'Payment of ₹{amount} received for {service}. Thank you!' },
  { id: 4, title: 'Dispute Resolved', template: 'Your dispute #{dispute_id} has been resolved. Check app for details.' },
];

export default function PlatformSettings() {
  const { notification, modal } = AntdApp.useApp();

  const [dispatchForm] = Form.useForm();
  const [commissionForm] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [cityModal, setCityModal] = useState(false);
  const [cityForm] = Form.useForm();
  const [templates, setTemplates] = useState(pushTemplates);
  const [editingTemplate, setEditingTemplate] = useState<number | null>(null);
  const [templateValues, setTemplateValues] = useState<Record<number, string>>(
    Object.fromEntries(pushTemplates.map((t) => [t.id, t.template]))
  );

  const [appToggles, setAppToggles] = useState({
    cashPayments: true,
    upiPayments: true,
    aiChatbot: true,
    workerRating: true,
    customerRating: true,
    autoExpandRadius: true,
    maintenanceMode: false,
  });

  const saveSection = (sectionName: string) => {
    notification.success({ message: `${sectionName} saved successfully`, placement: 'topRight' });
  };

  const handleAddCity = () => {
    cityForm.validateFields().then(() => {
      setCityModal(false);
      cityForm.resetFields();
      notification.success({ message: 'City added successfully', placement: 'topRight' });
    });
  };

  const handleUpdatePassword = () => {
    passwordForm.validateFields().then((values) => {
      if (values.newPassword !== values.confirmPassword) {
        notification.error({ message: 'Passwords do not match', placement: 'topRight' });
        return;
      }
      passwordForm.resetFields();
      notification.success({ message: 'Password updated successfully', placement: 'topRight' });
    });
  };

  const saveTemplate = (id: number) => {
    setTemplates((prev) => prev.map((t) => (t.id === id ? { ...t, template: templateValues[id] } : t)));
    setEditingTemplate(null);
    notification.success({ message: 'Template saved', placement: 'topRight' });
  };

  const cityColumns = [
    { title: 'City', dataIndex: 'city', key: 'city', render: (v: string) => <Text strong>{v}</Text> },
    { title: 'State', dataIndex: 'state', key: 'state' },
    { title: 'Status', dataIndex: 'status', key: 'status' },
    { title: 'Workers', dataIndex: 'workers', key: 'workers', align: 'center' as const },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <Space>
          <Button size="small" icon={<EditOutlined />}>Edit</Button>
          <Button
            size="small"
            danger
            onClick={() =>
              modal.confirm({
                title: 'Deactivate City',
                content: 'Are you sure you want to deactivate this city?',
                okType: 'danger',
                onOk: () => notification.success({ message: 'City deactivated', placement: 'topRight' }),
              })
            }
          >
            Deactivate
          </Button>
        </Space>
      ),
    },
  ];

  const notifTabItems = [
    {
      key: 'push',
      label: 'Push',
      children: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {templates.map((t) => (
            <Card key={t.id} size="small" style={{ borderRadius: 8, background: '#F9FAFB' }}>
              <Text strong style={{ display: 'block', marginBottom: 8 }}>{t.title}</Text>
              {editingTemplate === t.id ? (
                <>
                  <TextArea
                    rows={3}
                    value={templateValues[t.id]}
                    onChange={(e) => setTemplateValues((prev) => ({ ...prev, [t.id]: e.target.value }))}
                  />
                  <Space style={{ marginTop: 8 }}>
                    <Button type="primary" size="small" style={{ background: '#1A73E8' }} onClick={() => saveTemplate(t.id)}>Save</Button>
                    <Button size="small" onClick={() => setEditingTemplate(null)}>Cancel</Button>
                  </Space>
                </>
              ) : (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                  <Text style={{ fontSize: 13, color: '#374151', flex: 1 }}>{templateValues[t.id]}</Text>
                  <Button size="small" icon={<EditOutlined />} onClick={() => setEditingTemplate(t.id)}>Edit</Button>
                </div>
              )}
            </Card>
          ))}
        </div>
      ),
    },
    { key: 'sms', label: 'SMS', children: <div style={{ padding: '20px 0', color: '#6B7280', textAlign: 'center' }}>SMS templates coming soon</div> },
    { key: 'email', label: 'Email', children: <div style={{ padding: '20px 0', color: '#6B7280', textAlign: 'center' }}>Email templates coming soon</div> },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* Section 1: Dispatch Settings */}
      <Card title="Worker Dispatch Configuration" style={{ borderRadius: 12 }}>
        <Form
          form={dispatchForm}
          layout="vertical"
          initialValues={{ searchRadius: 5, expandedRadius: 10, timeout: 60, maxRejections: 3 }}
        >
          <Row gutter={16}>
            <Col xs={24} sm={12} md={6}>
              <Form.Item name="searchRadius" label="Initial Search Radius (km)">
                <Input type="number" suffix="km" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Form.Item name="expandedRadius" label="Expanded Search Radius (km)">
                <Input type="number" suffix="km" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Form.Item name="timeout" label="Task Request Timeout (sec)">
                <Input type="number" suffix="sec" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Form.Item name="maxRejections" label="Max Rejection Before Penalty">
                <Input type="number" suffix="times" />
              </Form.Item>
            </Col>
          </Row>
          <Button type="primary" style={{ background: '#1A73E8' }} onClick={() => saveSection('Dispatch Settings')}>
            Save Dispatch Settings
          </Button>
        </Form>
      </Card>

      {/* Section 2: Commission Settings */}
      <Card title="Commission & Pricing" style={{ borderRadius: 12 }}>
        <Form
          form={commissionForm}
          layout="vertical"
          initialValues={{ commission: 20, minPrice: 99, holdDuration: 24 }}
        >
          <Row gutter={16}>
            <Col xs={24} sm={8}>
              <Form.Item name="commission" label="Platform Commission Rate">
                <Input type="number" suffix="%" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item name="minPrice" label="Minimum Service Price">
                <Input type="number" prefix="₹" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item name="holdDuration" label="Wallet Hold Duration">
                <Input type="number" suffix="hours" />
              </Form.Item>
            </Col>
          </Row>
          <Button type="primary" style={{ background: '#1A73E8' }} onClick={() => saveSection('Commission Settings')}>
            Save Commission Settings
          </Button>
        </Form>
      </Card>

      {/* Section 3: City & Coverage */}
      <Card
        title="Active Cities"
        extra={
          <Button type="primary" icon={<PlusOutlined />} style={{ background: '#1A73E8' }} onClick={() => setCityModal(true)}>
            Add New City
          </Button>
        }
        style={{ borderRadius: 12 }}
      >
        <Table columns={cityColumns} dataSource={cities} rowKey="key" pagination={false} />
      </Card>

      {/* Section 4: Notification Templates */}
      <Card title="SMS & Push Notification Templates" style={{ borderRadius: 12 }}>
        <Tabs items={notifTabItems} />
      </Card>

      {/* Section 5: App Controls */}
      <Card title="App Feature Toggles" style={{ borderRadius: 12 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[
            { key: 'cashPayments', label: 'Allow Cash Payments' },
            { key: 'upiPayments', label: 'Allow UPI Payments' },
            { key: 'aiChatbot', label: 'Show AI Chatbot' },
            { key: 'workerRating', label: 'Worker Rating System' },
            { key: 'customerRating', label: 'Customer Rating System' },
            { key: 'autoExpandRadius', label: 'Auto-expand Radius' },
            { key: 'maintenanceMode', label: 'Maintenance Mode', danger: true },
          ].map((item) => (
            <div key={item.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: '#F9FAFB', borderRadius: 8 }}>
              <Text style={{ color: item.danger && appToggles[item.key as keyof typeof appToggles] ? '#EA4335' : '#1A1A2E' }}>
                {item.label}
                {item.danger && appToggles[item.key as keyof typeof appToggles] && (
                  <Text style={{ color: '#EA4335', fontSize: 12, marginLeft: 8 }}>⚠️ Site in maintenance</Text>
                )}
              </Text>
              <Switch
                checked={appToggles[item.key as keyof typeof appToggles]}
                onChange={(val) => setAppToggles((prev) => ({ ...prev, [item.key]: val }))}
                style={item.danger && appToggles[item.key as keyof typeof appToggles] ? { background: '#EA4335' } : undefined}
              />
            </div>
          ))}
        </div>
        <Button type="primary" style={{ marginTop: 16, background: '#1A73E8' }} onClick={() => saveSection('App Settings')}>
          Save App Settings
        </Button>
      </Card>

      {/* Section 6: Admin Account */}
      <Card title="Admin Account Settings" style={{ borderRadius: 12 }}>
        <div style={{ marginBottom: 16, padding: '10px 14px', background: '#F0F2F5', borderRadius: 8 }}>
          <Text style={{ color: '#6B7280', fontSize: 13 }}>Current email: </Text>
          <Text strong>admin@worksetu.com</Text>
        </div>
        <Title level={5}>Change Password</Title>
        <Form form={passwordForm} layout="vertical" style={{ maxWidth: 420 }}>
          <Form.Item name="currentPassword" label="Current Password" rules={[{ required: true }]}>
            <Input.Password placeholder="Enter current password" />
          </Form.Item>
          <Form.Item name="newPassword" label="New Password" rules={[{ required: true, min: 6 }]}>
            <Input.Password placeholder="Enter new password" />
          </Form.Item>
          <Form.Item name="confirmPassword" label="Confirm New Password" rules={[{ required: true }]}>
            <Input.Password placeholder="Confirm new password" />
          </Form.Item>
          <Button type="primary" style={{ background: '#1A73E8' }} onClick={handleUpdatePassword}>
            Update Password
          </Button>
        </Form>
      </Card>

      {/* Add City Modal */}
      <Modal
        title="Add New City"
        open={cityModal}
        onOk={handleAddCity}
        onCancel={() => { setCityModal(false); cityForm.resetFields(); }}
        okText="Save City"
        okButtonProps={{ style: { background: '#1A73E8' } }}
      >
        <Form form={cityForm} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item name="cityName" label="City Name" rules={[{ required: true }]}>
            <Input placeholder="e.g. Amritsar" />
          </Form.Item>
          <Form.Item name="state" label="State" rules={[{ required: true }]}>
            <Input placeholder="e.g. Punjab" />
          </Form.Item>
          <Form.Item name="launchDate" label="Launch Date">
            <Input type="date" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
