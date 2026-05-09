import { useState } from 'react';
import {
  Card, Button, Tag, Typography, Row, Col, Tabs,
  Modal, Select, Input, Badge, App as AntdApp, Space,
} from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, FileOutlined, CameraOutlined } from '@ant-design/icons';

const { Text, Title } = Typography;
const { TextArea } = Input;

type KYCStatus = 'Pending' | 'Approved' | 'Rejected';

interface KYCEntry {
  id: number;
  name: string;
  phone: string;
  submitted: string;
  status: KYCStatus;
  rejectionReason?: string;
}

const initialKYC: KYCEntry[] = [
  { id: 1, name: 'Gurpreet Kaur', phone: '+91 32109 87654', submitted: '6 May 2025', status: 'Pending' },
  { id: 2, name: 'Manpreet Singh', phone: '+91 21098 76543', submitted: '5 May 2025', status: 'Pending' },
  { id: 3, name: 'Balveer Kaur', phone: '+91 09876 54321', submitted: '4 May 2025', status: 'Pending' },
  { id: 4, name: 'Suresh Kumar', phone: '+91 87654 32109', submitted: '10 Jan 2025', status: 'Approved' },
  { id: 5, name: 'Harjeet Brar', phone: '+91 11223 44556', submitted: '2 Mar 2025', status: 'Rejected', rejectionReason: 'Aadhaar photo unclear. Resubmit required.' },
];

const rejectReasons = [
  'Document unclear',
  'Fake document',
  'Mismatch in details',
  'Incomplete submission',
  'Other',
];

function DocumentPreviewModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Modal title="Document Preview" open={open} onCancel={onClose} footer={<Button onClick={onClose}>Close</Button>}>
      <div style={{ width: '100%', height: 240, background: '#E5E7EB', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 8 }}>
        <FileOutlined style={{ fontSize: 40, color: '#6B7280' }} />
        <Text style={{ color: '#6B7280' }}>Document Preview</Text>
        <Text style={{ color: '#9CA3AF', fontSize: 12 }}>Placeholder — actual document would appear here</Text>
      </div>
    </Modal>
  );
}

export default function KYCVerification() {
  const [kyc, setKyc] = useState<KYCEntry[]>(initialKYC);
  const [activeTab, setActiveTab] = useState('All');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [rejectModal, setRejectModal] = useState(false);
  const [rejectTarget, setRejectTarget] = useState<KYCEntry | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectNote, setRejectNote] = useState('');
  const { modal, notification } = AntdApp.useApp();

  const pendingCount = kyc.filter((k) => k.status === 'Pending').length;

  const filtered = kyc.filter((k) => {
    if (activeTab === 'All') return true;
    return k.status === activeTab;
  });

  const handleApprove = (entry: KYCEntry) => {
    modal.confirm({
      title: 'Approve KYC Documents',
      content: `Approve all KYC documents for ${entry.name}? They will be able to start accepting tasks.`,
      okText: 'Confirm Approve',
      okButtonProps: { style: { background: '#34A853', borderColor: '#34A853' } },
      onOk: () => {
        setKyc((prev) => prev.map((k) => (k.id === entry.id ? { ...k, status: 'Approved' } : k)));
        notification.success({ message: `KYC approved for ${entry.name}`, placement: 'topRight' });
      },
    });
  };

  const openRejectModal = (entry: KYCEntry) => {
    setRejectTarget(entry);
    setRejectReason('');
    setRejectNote('');
    setRejectModal(true);
  };

  const handleReject = () => {
    if (!rejectReason) {
      notification.error({ message: 'Please select a rejection reason', placement: 'topRight' });
      return;
    }
    setKyc((prev) =>
      prev.map((k) =>
        k.id === rejectTarget?.id
          ? { ...k, status: 'Rejected', rejectionReason: `${rejectReason}. ${rejectNote}`.trim() }
          : k
      )
    );
    setRejectModal(false);
    notification.success({ message: `KYC rejected for ${rejectTarget?.name}`, placement: 'topRight' });
  };

  const tabItems = [
    { key: 'All', label: 'All' },
    { key: 'Pending', label: <Badge count={pendingCount} size="small" offset={[6, 0]}>Pending</Badge> },
    { key: 'Approved', label: 'Approved' },
    { key: 'Rejected', label: 'Rejected' },
  ];

  return (
    <div>
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabItems}
        style={{ marginBottom: 16 }}
      />

      <Row gutter={[16, 16]}>
        {filtered.map((entry) => (
          <Col xs={24} md={12} xl={8} key={entry.id}>
            <Card
              style={{ borderRadius: 12, borderLeft: `4px solid ${entry.status === 'Approved' ? '#34A853' : entry.status === 'Rejected' ? '#EA4335' : '#FBBC04'}` }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div>
                  <Title level={5} style={{ margin: 0 }}>{entry.name}</Title>
                  <Text style={{ color: '#6B7280', fontSize: 13 }}>{entry.phone}</Text>
                </div>
                <Tag
                  color={entry.status === 'Approved' ? 'green' : entry.status === 'Rejected' ? 'red' : 'orange'}
                >
                  {entry.status}
                </Tag>
              </div>

              <Text style={{ color: '#6B7280', fontSize: 12 }}>Submitted: {entry.submitted}</Text>

              {/* Documents */}
              <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
                {[
                  { label: 'Aadhaar Card', icon: <FileOutlined /> },
                  { label: 'PAN Card', icon: <FileOutlined /> },
                  { label: 'Selfie', icon: <CameraOutlined /> },
                ].map((doc) => (
                  <div
                    key={doc.label}
                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 10px', background: '#F9FAFB', borderRadius: 6 }}
                  >
                    <Space size={6}>
                      {doc.icon}
                      <Text style={{ fontSize: 13 }}>{doc.label}</Text>
                      <Tag color={entry.status === 'Approved' ? 'green' : 'blue'} style={{ fontSize: 11 }}>
                        {entry.status === 'Approved' ? 'Verified ✓' : 'Uploaded'}
                      </Tag>
                    </Space>
                    <Button size="small" onClick={() => setPreviewOpen(true)}>View</Button>
                  </div>
                ))}
              </div>

              {/* Rejection reason */}
              {entry.status === 'Rejected' && entry.rejectionReason && (
                <div style={{ marginTop: 10, padding: '8px 10px', background: '#FEF2F2', borderRadius: 6, borderLeft: '3px solid #EA4335' }}>
                  <Text style={{ color: '#EA4335', fontSize: 12 }}>
                    <CloseCircleOutlined /> {entry.rejectionReason}
                  </Text>
                </div>
              )}

              {/* Actions */}
              {entry.status === 'Pending' && (
                <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
                  <Button
                    type="primary"
                    icon={<CheckCircleOutlined />}
                    style={{ flex: 1, background: '#34A853', borderColor: '#34A853' }}
                    onClick={() => handleApprove(entry)}
                  >
                    Approve All
                  </Button>
                  <Button
                    danger
                    icon={<CloseCircleOutlined />}
                    style={{ flex: 1 }}
                    onClick={() => openRejectModal(entry)}
                  >
                    Reject
                  </Button>
                </div>
              )}
            </Card>
          </Col>
        ))}
      </Row>

      {/* Document Preview Modal */}
      <DocumentPreviewModal open={previewOpen} onClose={() => setPreviewOpen(false)} />

      {/* Reject Modal */}
      <Modal
        title={`Reject KYC — ${rejectTarget?.name}`}
        open={rejectModal}
        onOk={handleReject}
        onCancel={() => setRejectModal(false)}
        okText="Confirm Reject"
        okButtonProps={{ danger: true }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 16 }}>
          <div>
            <Text strong>Rejection Reason *</Text>
            <Select
              style={{ width: '100%', marginTop: 6 }}
              placeholder="Select reason"
              value={rejectReason || undefined}
              onChange={setRejectReason}
              options={rejectReasons.map((r) => ({ value: r, label: r }))}
            />
          </div>
          <div>
            <Text strong>Additional Note</Text>
            <TextArea
              style={{ marginTop: 6 }}
              rows={3}
              placeholder="Additional details for the worker..."
              value={rejectNote}
              onChange={(e) => setRejectNote(e.target.value)}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
