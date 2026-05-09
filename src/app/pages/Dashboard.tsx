import { Row, Col, Card, Table, Tag, Typography, Alert, Space } from 'antd';
import type { ReactNode } from 'react';
import {
  BookOutlined,
  TeamOutlined,
  DollarOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { useNavigate } from 'react-router';

const { Text, Title } = Typography;

const weeklyBookings = [
  { day: 'Mon', bookings: 32 },
  { day: 'Tue', bookings: 45 },
  { day: 'Wed', bookings: 38 },
  { day: 'Thu', bookings: 52 },
  { day: 'Fri', bookings: 41 },
  { day: 'Sat', bookings: 47 },
  { day: 'Sun', bookings: 29 },
];

const serviceBreakdown = [
  { name: 'Home Cleaning', value: 35 },
  { name: 'Car Wash', value: 20 },
  { name: 'AC Repair', value: 18 },
  { name: 'Plumbing', value: 15 },
  { name: 'Others', value: 12 },
];

const PIE_COLORS = ['#1A73E8', '#FF6B00', '#34A853', '#FBBC04', '#EA4335'];

const recentBookings = [
  { id: '#BK1042', customer: 'Rahul Sharma', service: 'Home Cleaning', worker: 'Suresh Kumar', status: 'Completed', amount: '₹548' },
  { id: '#BK1041', customer: 'Priya Verma', service: 'Car Wash', worker: 'Amit Singh', status: 'In Progress', amount: '₹249' },
  { id: '#BK1040', customer: 'Meena Gupta', service: 'AC Repair', worker: 'Ravi Kumar', status: 'Completed', amount: '₹699' },
  { id: '#BK1039', customer: 'Raj Patel', service: 'Plumbing', worker: '—', status: 'Searching', amount: '₹349' },
  { id: '#BK1038', customer: 'Sunita Devi', service: 'Electrician', worker: 'Suresh Kumar', status: 'Disputed', amount: '₹299' },
];

const workerStatus = [
  { name: 'Suresh Kumar', service: 'Cleaning', location: 'Model Town', status: 'Online', tasks: 3 },
  { name: 'Amit Singh', service: 'Car Wash', location: 'Civil Lines', status: 'Online', tasks: 2 },
  { name: 'Ravi Kumar', service: 'AC Repair', location: 'Sarabha Nagar', status: 'Busy', tasks: 1 },
  { name: 'Deepak Sharma', service: 'Plumbing', location: 'BRS Nagar', status: 'Offline', tasks: 0 },
  { name: 'Preet Singh', service: 'Electrician', location: 'Dugri', status: 'Online', tasks: 1 },
];

const statusColor: Record<string, string> = {
  Completed: 'green',
  'In Progress': 'orange',
  Searching: 'blue',
  Disputed: 'red',
  Cancelled: 'default',
  Accepted: 'cyan',
};

const workerStatusColor: Record<string, string> = {
  Online: '#34A853',
  Busy: '#FF6B00',
  Offline: '#6B7280',
};

function StatCard({
  title,
  value,
  subtitle,
  icon,
  iconBg,
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: ReactNode;
  iconBg: string;
}) {
  return (
    <Card style={{ borderRadius: 12 }} styles={{ body: { padding: '20px 24px' } }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <Text style={{ color: '#6B7280', fontSize: 13 }}>{title}</Text>
          <Title level={3} style={{ margin: '4px 0 2px', color: '#1A1A2E' }}>
            {value}
          </Title>
          <Text style={{ color: '#6B7280', fontSize: 12 }}>{subtitle}</Text>
        </div>
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            background: iconBg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 22,
            color: '#fff',
          }}
        >
          {icon}
        </div>
      </div>
    </Card>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();

  const bookingColumns = [
    { title: 'Booking ID', dataIndex: 'id', key: 'id', render: (v: string) => <Text strong style={{ color: '#1A73E8' }}>{v}</Text> },
    { title: 'Customer', dataIndex: 'customer', key: 'customer' },
    { title: 'Service', dataIndex: 'service', key: 'service' },
    { title: 'Worker', dataIndex: 'worker', key: 'worker' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (s: string) => <Tag color={statusColor[s] || 'default'}>{s}</Tag>,
    },
    { title: 'Amount', dataIndex: 'amount', key: 'amount', render: (v: string) => <Text strong>{v}</Text> },
  ];

  const workerColumns = [
    { title: 'Worker Name', dataIndex: 'name', key: 'name', render: (v: string) => <Text strong>{v}</Text> },
    { title: 'Service', dataIndex: 'service', key: 'service' },
    { title: 'Location', dataIndex: 'location', key: 'location' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (s: string) => (
        <Space>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: workerStatusColor[s], display: 'inline-block' }} />
          <Text style={{ color: workerStatusColor[s] }}>{s}</Text>
        </Space>
      ),
    },
    { title: 'Tasks Today', dataIndex: 'tasks', key: 'tasks', align: 'center' as const },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Stat Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} xl={6}>
          <StatCard
            title="Total Bookings Today"
            value="47"
            subtitle="+12% from yesterday"
            icon={<BookOutlined />}
            iconBg="#1A73E8"
          />
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <StatCard
            title="Active Workers Online"
            value="23"
            subtitle="Out of 58 total"
            icon={<TeamOutlined />}
            iconBg="#34A853"
          />
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <StatCard
            title="Revenue Today"
            value="₹18,450"
            subtitle="Commission earned"
            icon={<DollarOutlined />}
            iconBg="#FF6B00"
          />
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <StatCard
            title="Open Disputes"
            value="3"
            subtitle="Needs attention"
            icon={<WarningOutlined />}
            iconBg="#EA4335"
          />
        </Col>
      </Row>

      {/* Charts */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={14}>
          <Card title="Bookings This Week" style={{ borderRadius: 12 }}>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={weeklyBookings}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="day" tick={{ fill: '#6B7280', fontSize: 12 }} />
                <YAxis tick={{ fill: '#6B7280', fontSize: 12 }} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="bookings"
                  stroke="#1A73E8"
                  strokeWidth={2.5}
                  dot={{ fill: '#1A73E8', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} lg={10}>
          <Card title="Services Breakdown" style={{ borderRadius: 12 }}>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={serviceBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {serviceBreakdown.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Legend iconSize={10} />
                <Tooltip formatter={(v) => `${v}%`} />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* Tables */}
      <Row gutter={[16, 16]}>
        <Col xs={24} xl={14}>
          <Card title="Recent Bookings" style={{ borderRadius: 12 }}>
            <Table
              columns={bookingColumns}
              dataSource={recentBookings}
              rowKey="id"
              pagination={false}
              size="small"
              scroll={{ x: 600 }}
            />
          </Card>
        </Col>
        <Col xs={24} xl={10}>
          <Card title="Worker Online Status" style={{ borderRadius: 12 }}>
            <Table
              columns={workerColumns}
              dataSource={workerStatus}
              rowKey="name"
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
      </Row>

      {/* Alert Banner */}
      <Alert
        type="warning"
        showIcon
        message={
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div>
              ⚠️ 3 KYC verifications pending review —{' '}
              <a onClick={() => navigate('/kyc')} style={{ color: '#1A73E8', cursor: 'pointer' }}>
                Review Now
              </a>
            </div>
            <div>
              ⚠️ 2 disputes awaiting response (SLA breach risk) —{' '}
              <a onClick={() => navigate('/disputes')} style={{ color: '#1A73E8', cursor: 'pointer' }}>
                View Disputes
              </a>
            </div>
          </div>
        }
        style={{ borderRadius: 12, background: '#FFF7ED', borderColor: '#FBBC04' }}
      />
    </div>
  );
}