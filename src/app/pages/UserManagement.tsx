import { useState } from 'react';
import {
  Table, Button, Tag, Space, Input, Select, Typography,
  Card, Row, Col, Drawer, Descriptions, List, App as AntdApp,
} from 'antd';
import { SearchOutlined, EyeOutlined, StopOutlined } from '@ant-design/icons';

const { Text } = Typography;

interface User {
  id: number;
  name: string;
  phone: string;
  city: string;
  bookings: number;
  joined: string;
  status: 'Active' | 'Banned';
}

const initialUsers: User[] = [
  { id: 1, name: 'Rahul Sharma', phone: '+91 98765 43210', city: 'Ludhiana', bookings: 5, joined: '12 Jan 2025', status: 'Active' },
  { id: 2, name: 'Priya Verma', phone: '+91 87654 32109', city: 'Ludhiana', bookings: 3, joined: '18 Feb 2025', status: 'Active' },
  { id: 3, name: 'Meena Gupta', phone: '+91 76543 21098', city: 'Ludhiana', bookings: 8, joined: '5 Jan 2025', status: 'Active' },
  { id: 4, name: 'Raj Patel', phone: '+91 65432 10987', city: 'Ludhiana', bookings: 1, joined: '1 Mar 2025', status: 'Active' },
  { id: 5, name: 'Sunita Devi', phone: '+91 54321 09876', city: 'Ludhiana', bookings: 2, joined: '20 Feb 2025', status: 'Banned' },
  { id: 6, name: 'Amit Verma', phone: '+91 43210 98765', city: 'Ludhiana', bookings: 6, joined: '8 Jan 2025', status: 'Active' },
  { id: 7, name: 'Kavita Singh', phone: '+91 32109 87654', city: 'Ludhiana', bookings: 4, joined: '25 Feb 2025', status: 'Active' },
  { id: 8, name: 'Deepak Nath', phone: '+91 21098 76543', city: 'Ludhiana', bookings: 0, joined: '10 Mar 2025', status: 'Active' },
];

const bookingHistory = ['#BK1042 — Home Cleaning — ₹548 — Completed', '#BK1038 — Electrician — ₹299 — Disputed', '#BK1030 — Car Wash — ₹399 — Completed'];

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const { modal, notification } = AntdApp.useApp();

  const filtered = users.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.phone.includes(search);
    const matchFilter = filter === 'All' || u.status === filter;
    return matchSearch && matchFilter;
  });

  const openDrawer = (user: User) => {
    setSelectedUser(user);
    setDrawerOpen(true);
  };

  const handleBanToggle = (user: User) => {
    const isBanning = user.status === 'Active';
    modal.confirm({
      title: isBanning ? 'Ban User' : 'Unban User',
      content: isBanning
        ? `Ban ${user.name}? They will lose all app access.`
        : `Unban ${user.name}? They will regain app access.`,
      okText: isBanning ? 'Ban User' : 'Unban User',
      okType: isBanning ? 'danger' : 'primary',
      onOk: () => {
        setUsers((prev) =>
          prev.map((u) =>
            u.id === user.id ? { ...u, status: isBanning ? 'Banned' : 'Active' } : u
          )
        );
        notification.success({
          message: isBanning ? 'User banned successfully' : 'User unbanned successfully',
          placement: 'topRight',
        });
        if (selectedUser?.id === user.id) {
          setSelectedUser((prev) => prev ? { ...prev, status: isBanning ? 'Banned' : 'Active' } : null);
        }
      },
    });
  };

  const columns = [
    { title: '#', dataIndex: 'id', key: 'id', width: 50 },
    { title: 'Name', dataIndex: 'name', key: 'name', render: (v: string) => <Text strong>{v}</Text> },
    { title: 'Phone', dataIndex: 'phone', key: 'phone' },
    { title: 'City', dataIndex: 'city', key: 'city' },
    { title: 'Bookings', dataIndex: 'bookings', key: 'bookings', align: 'center' as const },
    { title: 'Joined', dataIndex: 'joined', key: 'joined' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (s: string) => <Tag color={s === 'Active' ? 'green' : 'red'}>{s}</Tag>,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: unknown, record: User) => (
        <Space>
          <Button size="small" icon={<EyeOutlined />} onClick={() => openDrawer(record)}>View</Button>
          <Button
            size="small"
            icon={<StopOutlined />}
            danger={record.status === 'Active'}
            onClick={() => handleBanToggle(record)}
          >
            {record.status === 'Active' ? 'Ban' : 'Unban'}
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }} align="middle">
        <Col xs={24} sm={10}>
          <Input
            prefix={<SearchOutlined />}
            placeholder="Search by name or phone"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            allowClear
          />
        </Col>
        <Col xs={24} sm={6}>
          <Select
            value={filter}
            onChange={setFilter}
            style={{ width: '100%' }}
            options={[
              { value: 'All', label: 'All Users' },
              { value: 'Active', label: 'Active' },
              { value: 'Banned', label: 'Banned' },
            ]}
          />
        </Col>
        <Col xs={24} sm={8}>
          <Text strong style={{ color: '#6B7280' }}>Total Users: 1,247</Text>
        </Col>
      </Row>

      <Card style={{ borderRadius: 12 }}>
        <Table
          columns={columns}
          dataSource={filtered}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          scroll={{ x: 800 }}
        />
      </Card>

      <Drawer
        title="User Profile"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        width={420}
        extra={
          selectedUser && (
            <Button
              danger={selectedUser.status === 'Active'}
              type={selectedUser.status === 'Active' ? 'primary' : 'default'}
              onClick={() => handleBanToggle(selectedUser)}
            >
              {selectedUser.status === 'Active' ? 'Ban User' : 'Unban User'}
            </Button>
          )
        }
      >
        {selectedUser && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <Descriptions column={1} bordered size="small">
              <Descriptions.Item label="Name">{selectedUser.name}</Descriptions.Item>
              <Descriptions.Item label="Phone">{selectedUser.phone}</Descriptions.Item>
              <Descriptions.Item label="City">{selectedUser.city}</Descriptions.Item>
              <Descriptions.Item label="Joined">{selectedUser.joined}</Descriptions.Item>
              <Descriptions.Item label="Total Bookings">{selectedUser.bookings}</Descriptions.Item>
              <Descriptions.Item label="Total Spent">₹1,244</Descriptions.Item>
              <Descriptions.Item label="Active Disputes">0</Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={selectedUser.status === 'Active' ? 'green' : 'red'}>{selectedUser.status}</Tag>
              </Descriptions.Item>
            </Descriptions>

            <div>
              <Text strong style={{ fontSize: 14 }}>Booking History</Text>
              <List
                style={{ marginTop: 8 }}
                size="small"
                bordered
                dataSource={bookingHistory}
                renderItem={(item) => (
                  <List.Item>
                    <Text style={{ fontSize: 12 }}>{item}</Text>
                  </List.Item>
                )}
              />
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
