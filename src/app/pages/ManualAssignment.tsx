import { useState } from 'react';
import { Row, Col, Card, Button, Tag, Typography, Space, Input, Select, App as AntdApp } from 'antd';
import { EnvironmentOutlined, SearchOutlined, UserOutlined } from '@ant-design/icons';

const { Text, Title } = Typography;

interface UnassignedBooking {
  id: string;
  customer: string;
  service: string;
  location: string;
  timeAgo: string;
  statusLabel: string;
  statusColor: string;
}

interface AvailableWorker {
  id: number;
  name: string;
  rating: string;
  service: string;
  distance: string;
  tasks: number;
}

const unassigned: UnassignedBooking[] = [
  { id: '#BK1039', customer: 'Raj Patel', service: 'Plumbing', location: 'BRS Nagar, Ludhiana', timeAgo: '45 min ago', statusLabel: 'No workers found', statusColor: 'red' },
  { id: '#BK1031', customer: 'Harjeet Brar', service: 'AC Repair', location: 'Sarabha Nagar, Ludhiana', timeAgo: '2 hr ago', statusLabel: 'Worker cancelled', statusColor: 'orange' },
  { id: '#BK1028', customer: 'Manpreet Kaur', service: 'Home Cleaning', location: 'Model Town, Ludhiana', timeAgo: '3 hr ago', statusLabel: 'No workers found', statusColor: 'red' },
];

const workers: AvailableWorker[] = [
  { id: 1, name: 'Suresh Kumar', rating: '4.9', service: 'Home Cleaning', distance: '2.1 km', tasks: 3 },
  { id: 2, name: 'Gurpreet Kaur', rating: '4.7', service: 'Home Cleaning', distance: '3.4 km', tasks: 1 },
  { id: 3, name: 'Deepak Sharma', rating: '4.5', service: 'Home Cleaning', distance: '5.2 km', tasks: 0 },
  { id: 4, name: 'Harjit Singh', rating: '4.3', service: 'Home Cleaning', distance: '7.8 km', tasks: 2 },
];

export default function ManualAssignment() {
  const [selectedBooking, setSelectedBooking] = useState<UnassignedBooking | null>(null);
  const [workerSearch, setWorkerSearch] = useState('');
  const [serviceFilter, setServiceFilter] = useState('All');
  const [assignedBookings, setAssignedBookings] = useState<string[]>([]);
  const { modal, notification } = AntdApp.useApp();

  const filteredWorkers = workers.filter((w) => {
    const matchSearch = w.name.toLowerCase().includes(workerSearch.toLowerCase());
    const matchService = serviceFilter === 'All' || w.service === serviceFilter;
    return matchSearch && matchService;
  });

  const handleAssign = (worker: AvailableWorker) => {
    const booking = selectedBooking;
    modal.confirm({
      title: 'Confirm Assignment',
      content: (
        <div>
          <p>
            Assign <strong>{worker.name}</strong> to Booking <strong>{booking?.id}</strong>?
          </p>
          <p style={{ color: '#6B7280', fontSize: 13 }}>
            Customer: {booking?.customer} | Service: {booking?.service}
          </p>
        </div>
      ),
      okText: 'Confirm Assign',
      okButtonProps: { style: { background: '#34A853', borderColor: '#34A853' } },
      onOk: () => {
        if (booking) {
          setAssignedBookings((prev) => [...prev, booking.id]);
          setSelectedBooking(null);
        }
        notification.success({
          message: 'Worker successfully assigned to booking',
          description: `${worker.name} assigned to ${booking?.id}`,
          placement: 'topRight',
        });
      },
    });
  };

  const pendingBookings = unassigned.filter((b) => !assignedBookings.includes(b.id));

  return (
    <Row gutter={[16, 16]}>
      {/* Left: Unassigned Bookings */}
      <Col xs={24} lg={10}>
        <Card
          title={
            <Space>
              <span>Unassigned / Failed Bookings</span>
              <Tag color="red">{pendingBookings.length}</Tag>
            </Space>
          }
          style={{ borderRadius: 12, height: '100%' }}
        >
          {pendingBookings.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#6B7280' }}>
              ✅ All bookings are assigned!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {pendingBookings.map((booking) => (
                <Card
                  key={booking.id}
                  size="small"
                  style={{
                    borderRadius: 8,
                    borderColor: selectedBooking?.id === booking.id ? '#1A73E8' : '#E5E7EB',
                    boxShadow: selectedBooking?.id === booking.id ? '0 0 0 2px rgba(26,115,232,0.2)' : 'none',
                    cursor: 'pointer',
                  }}
                  onClick={() => setSelectedBooking(booking)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <Text strong style={{ color: '#1A73E8' }}>{booking.id}</Text>
                      <div style={{ marginTop: 2 }}>
                        <Text style={{ fontSize: 14 }}>{booking.customer}</Text>
                      </div>
                      <div style={{ color: '#6B7280', fontSize: 12, marginTop: 2 }}>
                        🛠 {booking.service}
                      </div>
                      <div style={{ color: '#6B7280', fontSize: 12, marginTop: 2 }}>
                        <EnvironmentOutlined /> {booking.location}
                      </div>
                      <div style={{ color: '#9CA3AF', fontSize: 11, marginTop: 4 }}>
                        Requested {booking.timeAgo}
                      </div>
                    </div>
                    <Tag color={booking.statusColor}>{booking.statusLabel}</Tag>
                  </div>
                  <Button
                    type="primary"
                    size="small"
                    block
                    style={{ marginTop: 10, background: '#1A73E8' }}
                    onClick={(e) => { e.stopPropagation(); setSelectedBooking(booking); }}
                  >
                    {booking.statusLabel === 'Worker cancelled' ? 'Reassign Worker' : 'Assign Worker'}
                  </Button>
                </Card>
              ))}
            </div>
          )}
        </Card>
      </Col>

      {/* Right: Available Workers */}
      <Col xs={24} lg={14}>
        <Card
          title={
            <Space>
              <UserOutlined />
              <span>Available Workers</span>
              {selectedBooking && (
                <Tag color="blue">For: {selectedBooking.id}</Tag>
              )}
            </Space>
          }
          style={{ borderRadius: 12 }}
        >
          {!selectedBooking ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#6B7280' }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>👈</div>
              <Text style={{ color: '#6B7280' }}>Select a booking from the left to assign a worker</Text>
            </div>
          ) : (
            <>
              <Row gutter={[8, 8]} style={{ marginBottom: 16 }}>
                <Col xs={24} sm={14}>
                  <Input
                    prefix={<SearchOutlined />}
                    placeholder="Search worker name"
                    value={workerSearch}
                    onChange={(e) => setWorkerSearch(e.target.value)}
                    allowClear
                  />
                </Col>
                <Col xs={24} sm={10}>
                  <Select
                    value={serviceFilter}
                    onChange={setServiceFilter}
                    style={{ width: '100%' }}
                    options={[
                      { value: 'All', label: 'All Services' },
                      { value: 'Home Cleaning', label: 'Home Cleaning' },
                      { value: 'Plumbing', label: 'Plumbing' },
                      { value: 'AC Repair', label: 'AC Repair' },
                      { value: 'Car Wash', label: 'Car Wash' },
                    ]}
                  />
                </Col>
              </Row>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {filteredWorkers.map((worker) => (
                  <Card
                    key={worker.id}
                    size="small"
                    style={{ borderRadius: 8, background: '#F9FAFB' }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <Text strong style={{ fontSize: 14 }}>{worker.name}</Text>
                          <Text style={{ color: '#FBBC04' }}>⭐ {worker.rating}</Text>
                        </div>
                        <div style={{ color: '#6B7280', fontSize: 12, marginTop: 2 }}>
                          🛠 {worker.service}
                        </div>
                        <div style={{ display: 'flex', gap: 12, marginTop: 4 }}>
                          <Text style={{ color: '#6B7280', fontSize: 12 }}>
                            <EnvironmentOutlined /> {worker.distance} from location
                          </Text>
                          <Text style={{ color: '#6B7280', fontSize: 12 }}>
                            Tasks today: {worker.tasks}
                          </Text>
                        </div>
                        <Space style={{ marginTop: 4 }}>
                          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#34A853', display: 'inline-block' }} />
                          <Text style={{ color: '#34A853', fontSize: 12 }}>Online</Text>
                        </Space>
                      </div>
                      <Button
                        type="primary"
                        style={{ background: '#1A73E8' }}
                        onClick={() => handleAssign(worker)}
                      >
                        Assign
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </>
          )}
        </Card>
      </Col>
    </Row>
  );
}
