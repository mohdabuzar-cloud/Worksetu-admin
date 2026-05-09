import { useState } from 'react';
import {
  Table, Button, Tag, Space, Input, Select, Typography,
  Card, Row, Col, Drawer, Descriptions, List, App as AntdApp,
} from 'antd';
import { SearchOutlined, EyeOutlined, StopOutlined } from '@ant-design/icons';

const { Text } = Typography;

interface Worker {
  id: number;
  name: string;
  phone: string;
  service: string;
  city: string;
  kycStatus: 'Verified' | 'Pending' | 'Rejected';
  onlineStatus: 'Online' | 'Offline' | 'Busy';
  tasks: number;
  rating: string;
  banned: boolean;
}

const initialWorkers: Worker[] = [
  { id: 1, name: 'Suresh Kumar', phone: '+91 87654 32109', service: 'Cleaning', city: 'Ludhiana', kycStatus: 'Verified', onlineStatus: 'Online', tasks: 42, rating: '4.9', banned: false },
  { id: 2, name: 'Amit Singh', phone: '+91 76543 21098', service: 'Car Wash', city: 'Ludhiana', kycStatus: 'Verified', onlineStatus: 'Online', tasks: 38, rating: '4.7', banned: false },
  { id: 3, name: 'Ravi Kumar', phone: '+91 65432 10987', service: 'AC Repair', city: 'Ludhiana', kycStatus: 'Verified', onlineStatus: 'Busy', tasks: 29, rating: '4.8', banned: false },
  { id: 4, name: 'Deepak Sharma', phone: '+91 54321 09876', service: 'Plumbing', city: 'Ludhiana', kycStatus: 'Verified', onlineStatus: 'Offline', tasks: 15, rating: '4.5', banned: false },
  { id: 5, name: 'Preet Singh', phone: '+91 43210 98765', service: 'Electrician', city: 'Ludhiana', kycStatus: 'Verified', onlineStatus: 'Online', tasks: 21, rating: '4.6', banned: false },
  { id: 6, name: 'Gurpreet Kaur', phone: '+91 32109 87654', service: 'Cleaning', city: 'Ludhiana', kycStatus: 'Pending', onlineStatus: 'Offline', tasks: 0, rating: '—', banned: false },
  { id: 7, name: 'Manpreet Singh', phone: '+91 21098 76543', service: 'Car Wash', city: 'Ludhiana', kycStatus: 'Rejected', onlineStatus: 'Offline', tasks: 0, rating: '—', banned: false },
  { id: 8, name: 'Harjit Singh', phone: '+91 10987 65432', service: 'Plumbing', city: 'Ludhiana', kycStatus: 'Verified', onlineStatus: 'Offline', tasks: 7, rating: '4.3', banned: false },
];

const kycColor: Record<string, string> = { Verified: 'green', Pending: 'orange', Rejected: 'red' };
const onlineColor: Record<string, string> = { Online: '#34A853', Offline: '#6B7280', Busy: '#FF6B00' };

export default function WorkerManagement() {
  const [workers, setWorkers] = useState<Worker[]>(initialWorkers);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);
  const { modal, notification } = AntdApp.useApp();

  const filtered = workers.filter((w) => {
    const matchSearch =
      w.name.toLowerCase().includes(search.toLowerCase()) ||
      w.phone.includes(search);
    const matchFilter =
      filter === 'All' ||
      (filter === 'Online' && w.onlineStatus === 'Online') ||
      (filter === 'Offline' && w.onlineStatus === 'Offline') ||
      (filter === 'Banned' && w.banned) ||
      (filter === 'KYC Pending' && w.kycStatus === 'Pending');
    return matchSearch && matchFilter;
  });

  const openDrawer = (worker: Worker) => {
    setSelectedWorker(worker);
    setDrawerOpen(true);
  };

  const handleBanToggle = (worker: Worker) => {
    modal.confirm({
      title: worker.banned ? 'Unban Worker' : 'Ban Worker',
      content: (
        <div>
          <p>{worker.banned ? `Unban ${worker.name}?` : `Ban ${worker.name}?`}</p>
          {!worker.banned && (
            <Input.TextArea placeholder="Reason for ban (required)" rows={3} style={{ marginTop: 8 }} />
          )}
        </div>
      ),
      okText: worker.banned ? 'Unban' : 'Ban Worker',
      okType: worker.banned ? 'primary' : 'danger',
      onOk: () => {
        setWorkers((prev) =>
          prev.map((w) => (w.id === worker.id ? { ...w, banned: !w.banned } : w))
        );
        notification.success({
          message: worker.banned ? 'Worker unbanned' : 'Worker banned successfully',
          placement: 'topRight',
        });
        if (selectedWorker?.id === worker.id) {
          setSelectedWorker((prev) => prev ? { ...prev, banned: !prev.banned } : null);
        }
      },
    });
  };

  const columns = [
    { title: '#', dataIndex: 'id', key: 'id', width: 50 },
    { title: 'Name', dataIndex: 'name', key: 'name', render: (v: string) => <Text strong>{v}</Text> },
    { title: 'Phone', dataIndex: 'phone', key: 'phone' },
    { title: 'Service', dataIndex: 'service', key: 'service' },
    { title: 'City', dataIndex: 'city', key: 'city' },
    {
      title: 'KYC Status',
      dataIndex: 'kycStatus',
      key: 'kycStatus',
      render: (s: string) => <Tag color={kycColor[s]}>{s}</Tag>,
    },
    {
      title: 'Online',
      dataIndex: 'onlineStatus',
      key: 'onlineStatus',
      render: (s: string) => (
        <Space size={4}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: onlineColor[s], display: 'inline-block' }} />
          <Text style={{ color: onlineColor[s] }}>{s}</Text>
        </Space>
      ),
    },
    { title: 'Tasks', dataIndex: 'tasks', key: 'tasks', align: 'center' as const },
    {
      title: 'Rating',
      dataIndex: 'rating',
      key: 'rating',
      render: (v: string) => v !== '—' ? <Text strong>⭐{v}</Text> : <Text type="secondary">—</Text>,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: unknown, record: Worker) => (
        <Space>
          <Button size="small" icon={<EyeOutlined />} onClick={() => openDrawer(record)}>View</Button>
          <Button
            size="small"
            icon={<StopOutlined />}
            danger={!record.banned}
            onClick={() => handleBanToggle(record)}
          >
            {record.banned ? 'Unban' : 'Ban'}
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }} align="middle">
        <Col xs={24} sm={9}>
          <Input
            prefix={<SearchOutlined />}
            placeholder="Search by name or phone"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            allowClear
          />
        </Col>
        <Col xs={24} sm={7}>
          <Select
            value={filter}
            onChange={setFilter}
            style={{ width: '100%' }}
            options={[
              { value: 'All', label: 'All Workers' },
              { value: 'Online', label: 'Online' },
              { value: 'Offline', label: 'Offline' },
              { value: 'Banned', label: 'Banned' },
              { value: 'KYC Pending', label: 'KYC Pending' },
            ]}
          />
        </Col>
        <Col xs={24} sm={8}>
          <Text strong style={{ color: '#6B7280' }}>Total Workers: 58</Text>
        </Col>
      </Row>

      <Card style={{ borderRadius: 12 }}>
        <Table
          columns={columns}
          dataSource={filtered}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          scroll={{ x: 900 }}
        />
      </Card>

      <Drawer
        title="Worker Profile"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        width={440}
        extra={
          selectedWorker && (
            <Button
              danger={!selectedWorker.banned}
              type={!selectedWorker.banned ? 'primary' : 'default'}
              onClick={() => handleBanToggle(selectedWorker)}
            >
              {selectedWorker.banned ? 'Unban Worker' : 'Ban Worker'}
            </Button>
          )
        }
      >
        {selectedWorker && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <Descriptions column={1} bordered size="small">
              <Descriptions.Item label="Name">{selectedWorker.name}</Descriptions.Item>
              <Descriptions.Item label="Phone">{selectedWorker.phone}</Descriptions.Item>
              <Descriptions.Item label="Service">{selectedWorker.service}</Descriptions.Item>
              <Descriptions.Item label="City">{selectedWorker.city}</Descriptions.Item>
              <Descriptions.Item label="KYC Status">
                <Tag color={kycColor[selectedWorker.kycStatus]}>{selectedWorker.kycStatus}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Online Status">
                <Text style={{ color: onlineColor[selectedWorker.onlineStatus] }}>{selectedWorker.onlineStatus}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Rating">
                {selectedWorker.rating !== '—' ? `⭐ ${selectedWorker.rating} (24 reviews)` : '—'}
              </Descriptions.Item>
              <Descriptions.Item label="Total Earned">₹12,400</Descriptions.Item>
              <Descriptions.Item label="Commission Paid">₹2,480</Descriptions.Item>
              <Descriptions.Item label="Wallet Balance">₹2,100 available | ₹304 on hold</Descriptions.Item>
            </Descriptions>

            <div>
              <Text strong style={{ fontSize: 14 }}>Documents</Text>
              <List
                style={{ marginTop: 8 }}
                size="small"
                bordered
                dataSource={['📄 Aadhaar Card', '📄 PAN Card', '🤳 Selfie']}
                renderItem={(item) => (
                  <List.Item>
                    <Text>{item}</Text>
                    <Tag color={selectedWorker.kycStatus === 'Verified' ? 'green' : 'orange'}>
                      {selectedWorker.kycStatus === 'Verified' ? 'Verified ✓' : 'Pending'}
                    </Tag>
                  </List.Item>
                )}
              />
            </div>

            <div>
              <Text strong style={{ fontSize: 14 }}>Recent Tasks</Text>
              <List
                style={{ marginTop: 8 }}
                size="small"
                bordered
                dataSource={['#BK1042 — Home Cleaning — ₹548 — Completed', '#BK1038 — Cleaning — ₹399 — Completed', '#BK1030 — Cleaning — ₹299 — Completed']}
                renderItem={(item) => <List.Item><Text style={{ fontSize: 12 }}>{item}</Text></List.Item>}
              />
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
