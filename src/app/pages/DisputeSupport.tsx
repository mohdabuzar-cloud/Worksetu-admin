import { useState } from 'react';
import {
  Table, Button, Tag, Typography, Card, Tabs, Badge,
  Alert, Modal, Descriptions, Select, Input, Row, Col,
  Space, App as AntdApp,
} from 'antd';
import { EyeOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

const { Text, Title } = Typography;
const { TextArea } = Input;

interface Dispute {
  id: string;
  bookingId: string;
  customer: string;
  worker: string;
  issueType: string;
  raisedOn: string;
  slaStatus: string;
  status: string;
}

const initialDisputes: Dispute[] = [
  { id: '#DS006', bookingId: '#BK1038', customer: 'Sunita Devi', worker: 'Suresh Kumar', issueType: 'Poor quality', raisedOn: 'Today 9am', slaStatus: 'Breach', status: 'Open' },
  { id: '#DS005', bookingId: '#BK1033', customer: 'Harjit Singh', worker: 'Preet Singh', issueType: 'Worker no-show', raisedOn: 'Today 8am', slaStatus: 'At Risk', status: 'Open' },
  { id: '#DS004', bookingId: '#BK1029', customer: 'Kavita Singh', worker: 'Amit Singh', issueType: 'Overcharged', raisedOn: 'Yesterday', slaStatus: 'Within SLA', status: 'Under Review' },
  { id: '#DS003', bookingId: '#BK1025', customer: 'Raj Patel', worker: 'Ravi Kumar', issueType: 'Rude behavior', raisedOn: '4 May', slaStatus: 'Resolved', status: 'Resolved' },
  { id: '#DS002', bookingId: '#BK1018', customer: 'Meena Gupta', worker: 'Deepak Sharma', issueType: 'Poor quality', raisedOn: '3 May', slaStatus: 'Resolved', status: 'Resolved' },
  { id: '#DS001', bookingId: '#BK1010', customer: 'Rahul Sharma', worker: 'Suresh Kumar', issueType: 'Payment issue', raisedOn: '1 May', slaStatus: 'Resolved', status: 'Closed' },
];

const slaColor: Record<string, string> = { Breach: 'red', 'At Risk': 'orange', 'Within SLA': 'green', Resolved: 'default' };
const statusColor: Record<string, string> = { Open: 'red', 'Under Review': 'orange', Resolved: 'green', Closed: 'default' };

export default function DisputeSupport() {
  const [activeTab, setActiveTab] = useState('All');
  const [viewModal, setViewModal] = useState(false);
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
  const [resolutionStatus, setResolutionStatus] = useState('');
  const [resolutionType, setResolutionType] = useState('');
  const [refundAmount, setRefundAmount] = useState('');
  const [adminNote, setAdminNote] = useState('');
  const { notification } = AntdApp.useApp();

  const openCount = initialDisputes.filter((d) => d.status === 'Open').length;

  const filtered = initialDisputes.filter((d) => {
    if (activeTab === 'All') return true;
    return d.status === activeTab;
  });

  const openView = (dispute: Dispute) => {
    setSelectedDispute(dispute);
    setResolutionStatus(dispute.status);
    setResolutionType('');
    setRefundAmount('');
    setAdminNote('');
    setViewModal(true);
  };

  const handleSaveResolution = () => {
    notification.success({
      message: 'Dispute resolved successfully',
      description: `Resolution saved for ${selectedDispute?.id}`,
      placement: 'topRight',
    });
    setViewModal(false);
  };

  const handleEscalate = () => {
    notification.warning({
      message: 'Dispute escalated',
      description: `${selectedDispute?.id} has been escalated to senior admin`,
      placement: 'topRight',
    });
    setViewModal(false);
  };

  const tabItems = [
    { key: 'All', label: 'All' },
    { key: 'Open', label: <Badge count={openCount} size="small" offset={[6, 0]}>Open</Badge> },
    { key: 'Under Review', label: 'Under Review' },
    { key: 'Resolved', label: 'Resolved' },
    { key: 'Closed', label: 'Closed' },
  ];

  const columns = [
    { title: 'Dispute ID', dataIndex: 'id', key: 'id', render: (v: string) => <Text strong style={{ color: '#1A73E8' }}>{v}</Text> },
    { title: 'Booking ID', dataIndex: 'bookingId', key: 'bookingId' },
    { title: 'Customer', dataIndex: 'customer', key: 'customer' },
    { title: 'Worker', dataIndex: 'worker', key: 'worker' },
    { title: 'Issue Type', dataIndex: 'issueType', key: 'issueType' },
    { title: 'Raised On', dataIndex: 'raisedOn', key: 'raisedOn' },
    {
      title: 'SLA Status',
      dataIndex: 'slaStatus',
      key: 'slaStatus',
      render: (s: string) => <Tag color={slaColor[s] || 'default'}>{s}</Tag>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (s: string) => <Tag color={statusColor[s] || 'default'}>{s}</Tag>,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: unknown, record: Dispute) => (
        <Button size="small" icon={<EyeOutlined />} onClick={() => openView(record)}>View</Button>
      ),
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* SLA Warning */}
      <Alert
        type="error"
        icon={<ExclamationCircleOutlined />}
        showIcon
        message="⚠️ 2 disputes have exceeded 24-hour SLA — immediate action required"
        style={{ borderRadius: 8 }}
      />

      <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} />

      <Card style={{ borderRadius: 12 }}>
        <Table
          columns={columns}
          dataSource={filtered}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          scroll={{ x: 900 }}
        />
      </Card>

      {/* Dispute Detail Modal */}
      <Modal
        title={
          <Space>
            <span>Dispute Details — {selectedDispute?.id}</span>
            {selectedDispute && <Tag color={slaColor[selectedDispute.slaStatus]}>{selectedDispute.slaStatus}</Tag>}
          </Space>
        }
        open={viewModal}
        onCancel={() => setViewModal(false)}
        width={700}
        footer={
          <Space>
            <Button onClick={() => setViewModal(false)}>Close</Button>
            <Button
              style={{ color: '#FF6B00', borderColor: '#FF6B00' }}
              onClick={handleEscalate}
            >
              Escalate
            </Button>
            <Button
              type="primary"
              style={{ background: '#1A73E8' }}
              onClick={handleSaveResolution}
            >
              Save Resolution
            </Button>
          </Space>
        }
      >
        {selectedDispute && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Descriptions column={2} size="small" bordered>
              <Descriptions.Item label="Dispute ID">{selectedDispute.id}</Descriptions.Item>
              <Descriptions.Item label="Booking ID">{selectedDispute.bookingId}</Descriptions.Item>
              <Descriptions.Item label="Customer">{selectedDispute.customer}</Descriptions.Item>
              <Descriptions.Item label="Worker">{selectedDispute.worker}</Descriptions.Item>
              <Descriptions.Item label="Issue Type">{selectedDispute.issueType}</Descriptions.Item>
              <Descriptions.Item label="Raised On">{selectedDispute.raisedOn}</Descriptions.Item>
            </Descriptions>

            {/* Customer Description */}
            <div style={{ padding: '12px 16px', background: '#FEF2F2', borderRadius: 8, borderLeft: '4px solid #EA4335' }}>
              <Text strong style={{ display: 'block', marginBottom: 6 }}>Customer's Complaint</Text>
              <Text style={{ color: '#374151' }}>
                "The worker did not clean properly. Left the place messy. Demanding refund."
              </Text>
            </div>

            {/* Evidence */}
            <div>
              <Text strong>Customer Submitted Evidence</Text>
              <Row gutter={8} style={{ marginTop: 8 }}>
                {[1, 2, 3].map((i) => (
                  <Col key={i} span={8}>
                    <div style={{ height: 80, background: '#E5E7EB', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Text style={{ color: '#9CA3AF', fontSize: 12 }}>Image {i}</Text>
                    </div>
                  </Col>
                ))}
              </Row>
            </div>

            {/* Worker Response */}
            <div style={{ padding: '12px 16px', background: '#EFF6FF', borderRadius: 8, borderLeft: '4px solid #1A73E8' }}>
              <Text strong style={{ display: 'block', marginBottom: 6 }}>Worker's Response</Text>
              <Text style={{ color: '#374151' }}>
                "I completed the work as per the service scope. Customer was not satisfied with standard results."
              </Text>
              <div style={{ marginTop: 6 }}>
                <Text style={{ color: '#6B7280', fontSize: 12 }}>{selectedDispute.worker} — ⭐ 4.9</Text>
              </div>
            </div>

            {/* Admin Action Panel */}
            <div style={{ padding: '16px', background: '#F9FAFB', borderRadius: 8, border: '1px solid #E5E7EB' }}>
              <Title level={5} style={{ marginTop: 0, marginBottom: 12 }}>Admin Action Panel</Title>
              <Row gutter={[12, 12]}>
                <Col xs={24} sm={12}>
                  <Text strong style={{ fontSize: 13 }}>Update Status</Text>
                  <Select
                    value={resolutionStatus}
                    onChange={setResolutionStatus}
                    style={{ width: '100%', marginTop: 4 }}
                    options={['Open', 'Under Review', 'Resolved', 'Closed'].map((s) => ({ value: s, label: s }))}
                  />
                </Col>
                <Col xs={24} sm={12}>
                  <Text strong style={{ fontSize: 13 }}>Resolution Type</Text>
                  <Select
                    value={resolutionType || undefined}
                    onChange={setResolutionType}
                    placeholder="Select resolution"
                    style={{ width: '100%', marginTop: 4 }}
                    options={['Full Refund', 'Partial Refund', 'No Refund', 'Warning to Worker', 'Ban Worker', 'Dismiss Dispute'].map((s) => ({ value: s, label: s }))}
                  />
                </Col>
                {(resolutionType === 'Full Refund' || resolutionType === 'Partial Refund') && (
                  <Col xs={24} sm={12}>
                    <Text strong style={{ fontSize: 13 }}>Refund Amount</Text>
                    <Input
                      prefix="₹"
                      placeholder="Enter amount"
                      value={refundAmount}
                      onChange={(e) => setRefundAmount(e.target.value)}
                      style={{ marginTop: 4 }}
                    />
                  </Col>
                )}
                <Col xs={24}>
                  <Text strong style={{ fontSize: 13 }}>Admin Note (Internal)</Text>
                  <TextArea
                    rows={3}
                    placeholder="Internal note for record keeping..."
                    value={adminNote}
                    onChange={(e) => setAdminNote(e.target.value)}
                    style={{ marginTop: 4 }}
                  />
                </Col>
              </Row>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
