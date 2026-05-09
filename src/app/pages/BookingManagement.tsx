import { useState } from 'react';
import {
  Table, Button, Tag, Space, Input, Select, Typography,
  Card, Row, Col, Modal, Descriptions, Steps, App as AntdApp,
} from 'antd';
import { SearchOutlined, EyeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router';

const { Text } = Typography;

interface Booking {
  id: string;
  customer: string;
  customerPhone: string;
  service: string;
  worker: string;
  workerPhone: string;
  workerRating: string;
  location: string;
  amount: string;
  commission: string;
  workerPayout: string;
  status: string;
  date: string;
}

const bookings: Booking[] = [
  { id: '#BK1042', customer: 'Rahul Sharma', customerPhone: '+91 98765 43210', service: 'Home Cleaning', worker: 'Suresh Kumar', workerPhone: '+91 87654 32109', workerRating: '4.9', location: 'Model Town, Ludhiana', amount: '₹548', commission: '₹49', workerPayout: '₹499', status: 'Completed', date: 'Today' },
  { id: '#BK1041', customer: 'Priya Verma', customerPhone: '+91 87654 32109', service: 'Car Wash', worker: 'Amit Singh', workerPhone: '+91 76543 21098', workerRating: '4.7', location: 'Civil Lines, Ludhiana', amount: '₹249', commission: '₹25', workerPayout: '₹224', status: 'In Progress', date: 'Today' },
  { id: '#BK1040', customer: 'Meena Gupta', customerPhone: '+91 76543 21098', service: 'AC Repair', worker: 'Ravi Kumar', workerPhone: '+91 65432 10987', workerRating: '4.8', location: 'Sarabha Nagar, Ludhiana', amount: '₹699', commission: '₹70', workerPayout: '₹629', status: 'Completed', date: 'Today' },
  { id: '#BK1039', customer: 'Raj Patel', customerPhone: '+91 65432 10987', service: 'Plumbing', worker: 'Searching...', workerPhone: '—', workerRating: '—', location: 'BRS Nagar, Ludhiana', amount: '₹349', commission: '₹35', workerPayout: '—', status: 'Searching', date: 'Today' },
  { id: '#BK1038', customer: 'Sunita Devi', customerPhone: '+91 54321 09876', service: 'Electrician', worker: 'Suresh Kumar', workerPhone: '+91 87654 32109', workerRating: '4.9', location: 'Dugri, Ludhiana', amount: '₹299', commission: '₹30', workerPayout: '₹269', status: 'Disputed', date: 'Yesterday' },
  { id: '#BK1037', customer: 'Amit Verma', customerPhone: '+91 43210 98765', service: 'Home Cleaning', worker: 'Deepak Sharma', workerPhone: '+91 54321 09876', workerRating: '4.5', location: 'Model Town, Ludhiana', amount: '₹499', commission: '₹50', workerPayout: '₹449', status: 'Completed', date: 'Yesterday' },
  { id: '#BK1036', customer: 'Kavita Singh', customerPhone: '+91 32109 87654', service: 'Sofa Cleaning', worker: '—', workerPhone: '—', workerRating: '—', location: 'Civil Lines, Ludhiana', amount: '₹399', commission: '₹40', workerPayout: '—', status: 'Cancelled', date: 'Yesterday' },
  { id: '#BK1035', customer: 'Deepak Nath', customerPhone: '+91 21098 76543', service: 'Car Wash', worker: 'Amit Singh', workerPhone: '+91 76543 21098', workerRating: '4.7', location: 'Sarabha Nagar, Ludhiana', amount: '₹199', commission: '₹20', workerPayout: '₹179', status: 'Completed', date: '5 May' },
  { id: '#BK1034', customer: 'Gurpreet Kaur', customerPhone: '+91 32109 87654', service: 'Plumbing', worker: 'Ravi Kumar', workerPhone: '+91 65432 10987', workerRating: '4.8', location: 'BRS Nagar, Ludhiana', amount: '₹349', commission: '₹35', workerPayout: '₹314', status: 'Completed', date: '5 May' },
  { id: '#BK1033', customer: 'Harjit Singh', customerPhone: '+91 10987 65432', service: 'AC Repair', worker: 'Preet Singh', workerPhone: '+91 43210 98765', workerRating: '4.6', location: 'Dugri, Ludhiana', amount: '₹599', commission: '₹60', workerPayout: '₹539', status: 'Cancelled', date: '4 May' },
];

const statusColor: Record<string, string> = {
  Completed: 'green',
  'In Progress': 'orange',
  Searching: 'blue',
  Disputed: 'red',
  Cancelled: 'default',
  Accepted: 'cyan',
};

export default function BookingManagement() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [serviceFilter, setServiceFilter] = useState('All');
  const [viewModal, setViewModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [overrideStatus, setOverrideStatus] = useState('');
  const { modal, notification } = AntdApp.useApp();

  const filtered = bookings.filter((b) => {
    const matchSearch =
      b.id.toLowerCase().includes(search.toLowerCase()) ||
      b.customer.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || b.status === statusFilter;
    const matchService = serviceFilter === 'All' || b.service === serviceFilter;
    return matchSearch && matchStatus && matchService;
  });

  const openView = (booking: Booking) => {
    setSelectedBooking(booking);
    setOverrideStatus(booking.status);
    setViewModal(true);
  };

  const handleCancelBooking = () => {
    modal.confirm({
      title: 'Cancel Booking',
      content: `Cancel booking ${selectedBooking?.id}? This cannot be undone.`,
      okText: 'Cancel Booking',
      okType: 'danger',
      onOk: () => {
        setViewModal(false);
        notification.success({ message: 'Booking cancelled successfully', placement: 'topRight' });
      },
    });
  };

  const services = ['All', ...Array.from(new Set(bookings.map((b) => b.service)))];

  const columns = [
    { title: 'Booking ID', dataIndex: 'id', key: 'id', render: (v: string) => <Text strong style={{ color: '#1A73E8' }}>{v}</Text> },
    { title: 'Customer', dataIndex: 'customer', key: 'customer' },
    { title: 'Service', dataIndex: 'service', key: 'service' },
    { title: 'Worker', dataIndex: 'worker', key: 'worker' },
    { title: 'Location', dataIndex: 'location', key: 'location' },
    { title: 'Amount', dataIndex: 'amount', key: 'amount', render: (v: string) => <Text strong>{v}</Text> },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (s: string) => <Tag color={statusColor[s] || 'default'}>{s}</Tag>,
    },
    { title: 'Date', dataIndex: 'date', key: 'date' },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: unknown, record: Booking) => (
        <Space>
          <Button size="small" icon={<EyeOutlined />} onClick={() => openView(record)}>View</Button>
          {record.status === 'Searching' && (
            <Button
              size="small"
              type="primary"
              style={{ background: '#1A73E8' }}
              onClick={() => { setViewModal(false); navigate('/assignment'); }}
            >
              Assign
            </Button>
          )}
        </Space>
      ),
    },
  ];

  const getTimelineStatus = (booking: Booking) => {
    const steps = ['Booking Created', 'Worker Assigned', 'Work Started', 'Completed'];
    if (booking.status === 'Searching') return 0;
    if (booking.status === 'Accepted') return 1;
    if (booking.status === 'In Progress') return 2;
    if (booking.status === 'Completed') return 3;
    return 0;
  };

  return (
    <div>
      <Row gutter={[12, 12]} style={{ marginBottom: 16 }} align="middle">
        <Col xs={24} sm={7}>
          <Input
            prefix={<SearchOutlined />}
            placeholder="Search by booking ID or customer"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            allowClear
          />
        </Col>
        <Col xs={24} sm={5}>
          <Select
            value={statusFilter}
            onChange={setStatusFilter}
            style={{ width: '100%' }}
            options={['All', 'Searching', 'Accepted', 'In Progress', 'Completed', 'Cancelled', 'Disputed'].map((s) => ({ value: s, label: s }))}
          />
        </Col>
        <Col xs={24} sm={5}>
          <Select
            value={serviceFilter}
            onChange={setServiceFilter}
            style={{ width: '100%' }}
            options={services.map((s) => ({ value: s, label: s }))}
          />
        </Col>
        <Col xs={24} sm={7}>
          <Text strong style={{ color: '#6B7280' }}>Total Bookings: 1,847</Text>
        </Col>
      </Row>

      <Card style={{ borderRadius: 12 }}>
        <Table
          columns={columns}
          dataSource={filtered}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          scroll={{ x: 1000 }}
        />
      </Card>

      {/* Booking Detail Modal */}
      <Modal
        title={`Booking Details — ${selectedBooking?.id}`}
        open={viewModal}
        onCancel={() => setViewModal(false)}
        width={640}
        footer={
          <Space>
            <Button onClick={() => setViewModal(false)}>Close</Button>
            <Button onClick={() => { setViewModal(false); navigate('/assignment'); }}>
              Reassign Worker
            </Button>
            <Button
              type="primary"
              style={{ background: '#1A73E8' }}
              onClick={() => {
                notification.success({ message: 'Status updated successfully', placement: 'topRight' });
                setViewModal(false);
              }}
            >
              Save Changes
            </Button>
            <Button danger onClick={handleCancelBooking}>Cancel Booking</Button>
          </Space>
        }
      >
        {selectedBooking && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Row gutter={16}>
              <Col span={12}>
                <Descriptions title="Customer Info" column={1} size="small" bordered>
                  <Descriptions.Item label="Name">{selectedBooking.customer}</Descriptions.Item>
                  <Descriptions.Item label="Phone">{selectedBooking.customerPhone}</Descriptions.Item>
                </Descriptions>
              </Col>
              <Col span={12}>
                <Descriptions title="Worker Info" column={1} size="small" bordered>
                  <Descriptions.Item label="Name">{selectedBooking.worker}</Descriptions.Item>
                  <Descriptions.Item label="Phone">{selectedBooking.workerPhone}</Descriptions.Item>
                  <Descriptions.Item label="Rating">
                    {selectedBooking.workerRating !== '—' ? `⭐ ${selectedBooking.workerRating}` : '—'}
                  </Descriptions.Item>
                </Descriptions>
              </Col>
            </Row>

            <Descriptions column={2} size="small" bordered>
              <Descriptions.Item label="Service">{selectedBooking.service}</Descriptions.Item>
              <Descriptions.Item label="Date">{selectedBooking.date}</Descriptions.Item>
              <Descriptions.Item label="Location" span={2}>{selectedBooking.location}</Descriptions.Item>
            </Descriptions>

            <div>
              <Text strong style={{ fontSize: 13 }}>Booking Timeline</Text>
              <Steps
                size="small"
                current={getTimelineStatus(selectedBooking)}
                style={{ marginTop: 10 }}
                items={[
                  { title: 'Created', description: '10:00 AM' },
                  { title: 'Assigned', description: '10:12 AM' },
                  { title: 'Started', description: '10:45 AM' },
                  { title: 'Completed', description: '12:30 PM' },
                ]}
              />
            </div>

            <Descriptions title="Payment Summary" column={3} size="small" bordered>
              <Descriptions.Item label="Amount Paid"><Text strong>{selectedBooking.amount}</Text></Descriptions.Item>
              <Descriptions.Item label="Commission">{selectedBooking.commission}</Descriptions.Item>
              <Descriptions.Item label="Worker Payout">{selectedBooking.workerPayout}</Descriptions.Item>
            </Descriptions>

            <Row gutter={12} align="middle">
              <Col span={8}>
                <Text strong style={{ fontSize: 13 }}>Current Status</Text>
                <Tag color={statusColor[selectedBooking.status] || 'default'} style={{ display: 'block', marginTop: 4 }}>
                  {selectedBooking.status}
                </Tag>
              </Col>
              <Col span={16}>
                <Text strong style={{ fontSize: 13 }}>Override Status</Text>
                <Select
                  style={{ width: '100%', marginTop: 4 }}
                  value={overrideStatus}
                  onChange={setOverrideStatus}
                  options={['Searching', 'Accepted', 'In Progress', 'Completed', 'Cancelled', 'Disputed'].map((s) => ({ value: s, label: s }))}
                />
              </Col>
            </Row>
          </div>
        )}
      </Modal>
    </div>
  );
}
