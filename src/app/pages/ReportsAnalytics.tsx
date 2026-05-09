import { Table, Button, Typography, Card, Row, Col, App as AntdApp } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend,
} from 'recharts';

const { Text, Title } = Typography;

const monthlyBookings = [
  { month: 'Jan', bookings: 210 },
  { month: 'Feb', bookings: 285 },
  { month: 'Mar', bookings: 320 },
  { month: 'Apr', bookings: 398 },
  { month: 'May', bookings: 412 },
];

const weeklyRevenue = [
  { day: 'Mon', revenue: 3200 },
  { day: 'Tue', revenue: 4100 },
  { day: 'Wed', revenue: 3800 },
  { day: 'Thu', revenue: 5200 },
  { day: 'Fri', revenue: 4800 },
  { day: 'Sat', revenue: 6100 },
  { day: 'Sun', revenue: 4900 },
];

const workerPerformance = [
  { worker: 'Suresh Kumar', tasks: 42, rating: '⭐4.9', earnings: '₹6,720', completion: '97%', disputes: 0 },
  { worker: 'Ravi Kumar', tasks: 29, rating: '⭐4.8', earnings: '₹7,840', completion: '95%', disputes: 1 },
  { worker: 'Amit Singh', tasks: 38, rating: '⭐4.7', earnings: '₹5,760', completion: '94%', disputes: 0 },
  { worker: 'Preet Singh', tasks: 21, rating: '⭐4.6', earnings: '₹4,200', completion: '91%', disputes: 1 },
  { worker: 'Deepak Sharma', tasks: 15, rating: '⭐4.5', earnings: '₹3,600', completion: '88%', disputes: 2 },
];

const servicePopularity = [
  { service: 'Home Cleaning', bookings: 645, revenue: '₹96,755', avgPrice: '₹299-499' },
  { service: 'Car Wash', bookings: 389, revenue: '₹38,900', avgPrice: '₹199-299' },
  { service: 'AC Repair', bookings: 234, revenue: '₹1,17,000', avgPrice: '₹499-699' },
  { service: 'Plumbing', bookings: 287, revenue: '₹71,750', avgPrice: '₹299-499' },
  { service: 'Sofa Cleaning', bookings: 156, revenue: '₹62,400', avgPrice: '₹399-499' },
  { service: 'Electrician', bookings: 136, revenue: '₹27,200', avgPrice: '₹199-299' },
];

function MetricCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <Card style={{ borderRadius: 10, textAlign: 'center' }} bodyStyle={{ padding: '16px 12px' }}>
      <Title level={4} style={{ margin: 0, color: '#1A1A2E' }}>{value}</Title>
      <Text style={{ color: '#6B7280', fontSize: 13 }}>{label}</Text>
      {sub && <div style={{ fontSize: 12, color: '#34A853', marginTop: 2 }}>{sub}</div>}
    </Card>
  );
}

export default function ReportsAnalytics() {
  const { notification } = AntdApp.useApp();

  const handleExport = () => {
    notification.success({ message: 'Report exported successfully', description: 'CSV file download started', placement: 'topRight' });
  };

  const workerColumns = [
    { title: 'Worker', dataIndex: 'worker', key: 'worker', render: (v: string) => <Text strong>{v}</Text> },
    { title: 'Tasks', dataIndex: 'tasks', key: 'tasks', align: 'center' as const },
    { title: 'Rating', dataIndex: 'rating', key: 'rating' },
    { title: 'Earnings', dataIndex: 'earnings', key: 'earnings', render: (v: string) => <Text strong style={{ color: '#34A853' }}>{v}</Text> },
    { title: 'Completion Rate', dataIndex: 'completion', key: 'completion' },
    { title: 'Disputes', dataIndex: 'disputes', key: 'disputes', align: 'center' as const },
  ];

  const serviceColumns = [
    { title: 'Service', dataIndex: 'service', key: 'service', render: (v: string) => <Text strong>{v}</Text> },
    { title: 'Total Bookings', dataIndex: 'bookings', key: 'bookings', align: 'center' as const },
    { title: 'Revenue', dataIndex: 'revenue', key: 'revenue', render: (v: string) => <Text strong style={{ color: '#1A73E8' }}>{v}</Text> },
    { title: 'Avg Price Range', dataIndex: 'avgPrice', key: 'avgPrice' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Top Bar */}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          icon={<DownloadOutlined />}
          style={{ borderColor: '#1A73E8', color: '#1A73E8' }}
          onClick={handleExport}
        >
          Export CSV
        </Button>
      </div>

      {/* Section 1: Booking Analytics */}
      <Card title="Booking Analytics" style={{ borderRadius: 12 }}>
        <Row gutter={[12, 12]} style={{ marginBottom: 20 }}>
          <Col xs={12} sm={6}><MetricCard label="Total Bookings" value="1,847" /></Col>
          <Col xs={12} sm={6}><MetricCard label="Completed" value="1,623" sub="87.9%" /></Col>
          <Col xs={12} sm={6}><MetricCard label="Cancelled" value="148" sub="8%" /></Col>
          <Col xs={12} sm={6}><MetricCard label="Disputed" value="76" sub="4.1%" /></Col>
        </Row>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={monthlyBookings}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="month" tick={{ fill: '#6B7280', fontSize: 12 }} />
            <YAxis tick={{ fill: '#6B7280', fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="bookings" fill="#1A73E8" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Section 2: Revenue Analytics */}
      <Card title="Revenue Analytics" style={{ borderRadius: 12 }}>
        <Row gutter={[12, 12]} style={{ marginBottom: 20 }}>
          <Col xs={12} sm={6}><MetricCard label="Total Revenue" value="₹2,84,500" /></Col>
          <Col xs={12} sm={6}><MetricCard label="Platform Commission" value="₹56,900" sub="20%" /></Col>
          <Col xs={12} sm={6}><MetricCard label="Worker Payouts" value="₹2,27,600" /></Col>
          <Col xs={12} sm={6}><MetricCard label="Refunds Issued" value="₹4,200" /></Col>
        </Row>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={weeklyRevenue}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="day" tick={{ fill: '#6B7280', fontSize: 12 }} />
            <YAxis tick={{ fill: '#6B7280', fontSize: 12 }} />
            <Tooltip formatter={(v) => `₹${v}`} />
            <Legend />
            <Line
              type="monotone"
              dataKey="revenue"
              name="Revenue (₹)"
              stroke="#34A853"
              strokeWidth={2.5}
              dot={{ fill: '#34A853', r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Section 3: Worker Performance */}
      <Card title="Worker Performance" style={{ borderRadius: 12 }}>
        <Table
          columns={workerColumns}
          dataSource={workerPerformance}
          rowKey="worker"
          pagination={false}
          scroll={{ x: 600 }}
        />
      </Card>

      {/* Section 4: Service Popularity */}
      <Card title="Service Popularity" style={{ borderRadius: 12 }}>
        <Table
          columns={serviceColumns}
          dataSource={servicePopularity}
          rowKey="service"
          pagination={false}
          scroll={{ x: 500 }}
        />
      </Card>
    </div>
  );
}
