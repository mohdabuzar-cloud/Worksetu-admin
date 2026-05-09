import { useState } from 'react';
import type { ReactNode } from 'react';
import {
  Table, Button, Tag, Typography, Card, Tabs, Row, Col,
  Modal, Space, App as AntdApp, Input,
} from 'antd';
import { DollarOutlined, WalletOutlined, ArrowUpOutlined, RollbackOutlined } from '@ant-design/icons';

const { Text, Title } = Typography;

interface PayoutRow {
  id: number;
  worker: string;
  service: string;
  tasks: number;
  gross: string;
  commission: string;
  net: string;
  walletStatus: string;
  paid: boolean;
}

const initialPayouts: PayoutRow[] = [
  { id: 1, worker: 'Suresh Kumar', service: 'Cleaning', tasks: 42, gross: '₹8,400', commission: '₹1,680', net: '₹6,720', walletStatus: 'Available', paid: false },
  { id: 2, worker: 'Amit Singh', service: 'Car Wash', tasks: 38, gross: '₹7,200', commission: '₹1,440', net: '₹5,760', walletStatus: 'Available', paid: false },
  { id: 3, worker: 'Ravi Kumar', service: 'AC Repair', tasks: 29, gross: '₹9,800', commission: '₹1,960', net: '₹7,840', walletStatus: 'On Hold 🔒', paid: false },
  { id: 4, worker: 'Deepak Sharma', service: 'Plumbing', tasks: 15, gross: '₹4,500', commission: '₹900', net: '₹3,600', walletStatus: 'Available', paid: false },
  { id: 5, worker: 'Preet Singh', service: 'Electrician', tasks: 21, gross: '₹5,250', commission: '₹1,050', net: '₹4,200', walletStatus: 'Available', paid: false },
  { id: 6, worker: 'Gurpreet Kaur', service: 'Cleaning', tasks: 0, gross: '₹0', commission: '₹0', net: '₹0', walletStatus: '—', paid: false },
];

const transactions = [
  { id: '#TXN1042', bookingId: '#BK1042', customer: 'Rahul Sharma', worker: 'Suresh Kumar', amount: '₹548', commission: '₹49', type: 'UPI', date: 'Today' },
  { id: '#TXN1041', bookingId: '#BK1041', customer: 'Priya Verma', worker: 'Amit Singh', amount: '₹249', commission: '₹25', type: 'Cash', date: 'Today' },
  { id: '#TXN1040', bookingId: '#BK1040', customer: 'Meena Gupta', worker: 'Ravi Kumar', amount: '₹699', commission: '₹70', type: 'UPI', date: 'Today' },
  { id: '#TXN1037', bookingId: '#BK1037', customer: 'Amit Verma', worker: 'Deepak Sharma', amount: '₹499', commission: '₹50', type: 'UPI', date: 'Yesterday' },
  { id: '#TXN1035', bookingId: '#BK1035', customer: 'Deepak Nath', worker: 'Amit Singh', amount: '₹199', commission: '₹20', type: 'Cash', date: '5 May' },
  { id: '#TXN1034', bookingId: '#BK1034', customer: 'Gurpreet Kaur', worker: 'Ravi Kumar', amount: '₹349', commission: '₹35', type: 'UPI', date: '5 May' },
  { id: '#TXN1033', bookingId: '#BK1033', customer: 'Harjit Singh', worker: 'Preet Singh', amount: '₹599', commission: '₹60', type: 'UPI', date: '4 May' },
  { id: '#TXN1030', bookingId: '#BK1030', customer: 'Kavita Singh', worker: 'Suresh Kumar', amount: '₹299', commission: '₹30', type: 'Cash', date: '3 May' },
];

const initialRefunds = [
  { id: '#RF004', bookingId: '#BK1038', customer: 'Sunita Devi', amount: '₹299', reason: 'Poor quality', status: 'Pending', date: 'Today' },
  { id: '#RF003', bookingId: '#BK1036', customer: 'Kavita Singh', amount: '₹399', reason: 'Worker cancelled', status: 'Approved', date: 'Yesterday' },
  { id: '#RF002', bookingId: '#BK1029', customer: 'Kavita Singh', amount: '₹150', reason: 'Partial - overcharge', status: 'Approved', date: '4 May' },
  { id: '#RF001', bookingId: '#BK1018', customer: 'Meena Gupta', amount: '₹499', reason: 'Worker no-show', status: 'Approved', date: '3 May' },
];

function StatCard({ title, value, subtitle, icon, color }: { title: string; value: string; subtitle: string; icon: ReactNode; color: string }) {
  return (
    <Card style={{ borderRadius: 12 }} styles={{ body: { padding: '20px 24px' } }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <Text style={{ color: '#6B7280', fontSize: 13 }}>{title}</Text>
          <Title level={4} style={{ margin: '4px 0 2px', color: '#1A1A2E' }}>{value}</Title>
          <Text style={{ color: '#6B7280', fontSize: 12 }}>{subtitle}</Text>
        </div>
        <div style={{ width: 44, height: 44, borderRadius: 10, background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, color: '#fff' }}>
          {icon}
        </div>
      </div>
    </Card>
  );
}

export default function FinancePayouts() {
  const [payouts, setPayouts] = useState<PayoutRow[]>(initialPayouts);
  const [refunds, setRefunds] = useState(initialRefunds);
  const [payModal, setPayModal] = useState(false);
  const [payTarget, setPayTarget] = useState<PayoutRow | null>(null);
  const [refundModal, setRefundModal] = useState(false);
  const [refundTarget, setRefundTarget] = useState<(typeof initialRefunds)[0] | null>(null);
  const [partialAmount, setPartialAmount] = useState('');
  const { modal, notification } = AntdApp.useApp();

  const handlePayNow = (payout: PayoutRow) => {
    setPayTarget(payout);
    setPayModal(true);
  };

  const confirmPay = () => {
    setPayouts((prev) => prev.map((p) => (p.id === payTarget?.id ? { ...p, paid: true } : p)));
    setPayModal(false);
    notification.success({ message: `Payout of ${payTarget?.net} released to ${payTarget?.worker}`, placement: 'topRight' });
  };

  const handlePayAll = () => {
    modal.confirm({
      title: 'Pay All Available Workers',
      content: 'Release payouts for all workers with "Available" wallet status?',
      okText: 'Confirm Bulk Payout',
      okButtonProps: { style: { background: '#34A853', borderColor: '#34A853' } },
      onOk: () => {
        setPayouts((prev) => prev.map((p) => (p.walletStatus === 'Available' ? { ...p, paid: true } : p)));
        notification.success({ message: 'All available payouts released successfully', placement: 'topRight' });
      },
    });
  };

  const handleRefundAction = (refund: typeof initialRefunds[0]) => {
    setRefundTarget(refund);
    setPartialAmount('');
    setRefundModal(true);
  };

  const confirmRefund = (type: 'approve' | 'reject' | 'partial') => {
    setRefunds((prev) =>
      prev.map((r) =>
        r.id === refundTarget?.id
          ? { ...r, status: type === 'reject' ? 'Rejected' : 'Approved' }
          : r
      )
    );
    setRefundModal(false);
    notification.success({
      message: type === 'reject' ? 'Refund rejected' : 'Refund approved successfully',
      placement: 'topRight',
    });
  };

  const payoutColumns = [
    { title: 'Worker', dataIndex: 'worker', key: 'worker', render: (v: string) => <Text strong>{v}</Text> },
    { title: 'Service', dataIndex: 'service', key: 'service' },
    { title: 'Tasks', dataIndex: 'tasks', key: 'tasks', align: 'center' as const },
    { title: 'Gross Earned', dataIndex: 'gross', key: 'gross' },
    { title: 'Commission', dataIndex: 'commission', key: 'commission' },
    { title: 'Net Payout', dataIndex: 'net', key: 'net', render: (v: string) => <Text strong style={{ color: '#34A853' }}>{v}</Text> },
    {
      title: 'Status',
      key: 'status',
      render: (_: unknown, r: PayoutRow) => (
        r.paid ? <Tag color="green">Paid ✓</Tag> :
        <Tag color={r.walletStatus === 'Available' ? 'blue' : r.walletStatus === '—' ? 'default' : 'orange'}>{r.walletStatus}</Tag>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: unknown, r: PayoutRow) => {
        if (r.paid) return <Text style={{ color: '#34A853' }}>Paid</Text>;
        if (r.walletStatus === 'Available') return <Button size="small" type="primary" style={{ background: '#1A73E8' }} onClick={() => handlePayNow(r)}>Pay Now</Button>;
        if (r.walletStatus === '—') return <Text type="secondary">—</Text>;
        return <Button size="small" disabled>Locked</Button>;
      },
    },
  ];

  const txnColumns = [
    { title: 'Transaction ID', dataIndex: 'id', key: 'id', render: (v: string) => <Text style={{ color: '#1A73E8' }}>{v}</Text> },
    { title: 'Booking ID', dataIndex: 'bookingId', key: 'bookingId' },
    { title: 'Customer', dataIndex: 'customer', key: 'customer' },
    { title: 'Worker', dataIndex: 'worker', key: 'worker' },
    { title: 'Amount', dataIndex: 'amount', key: 'amount', render: (v: string) => <Text strong>{v}</Text> },
    { title: 'Commission', dataIndex: 'commission', key: 'commission' },
    { title: 'Type', dataIndex: 'type', key: 'type', render: (v: string) => <Tag color={v === 'UPI' ? 'blue' : 'default'}>{v}</Tag> },
    { title: 'Date', dataIndex: 'date', key: 'date' },
  ];

  const refundColumns = [
    { title: 'Refund ID', dataIndex: 'id', key: 'id', render: (v: string) => <Text style={{ color: '#1A73E8' }}>{v}</Text> },
    { title: 'Booking ID', dataIndex: 'bookingId', key: 'bookingId' },
    { title: 'Customer', dataIndex: 'customer', key: 'customer' },
    { title: 'Amount', dataIndex: 'amount', key: 'amount', render: (v: string) => <Text strong>{v}</Text> },
    { title: 'Reason', dataIndex: 'reason', key: 'reason' },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (s: string) => <Tag color={s === 'Approved' ? 'green' : s === 'Pending' ? 'orange' : s === 'Rejected' ? 'red' : 'default'}>{s}</Tag> },
    { title: 'Date', dataIndex: 'date', key: 'date' },
    {
      title: 'Action',
      key: 'action',
      render: (_: unknown, r: typeof initialRefunds[0]) =>
        r.status === 'Pending' ? (
          <Button size="small" type="primary" style={{ background: '#1A73E8' }} onClick={() => handleRefundAction(r)}>Review</Button>
        ) : (
          <Button size="small" onClick={() => handleRefundAction(r)}>View</Button>
        ),
    },
  ];

  const tabItems = [
    {
      key: 'payouts',
      label: 'Payouts',
      children: (
        <div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
            <Button type="primary" style={{ background: '#34A853', borderColor: '#34A853' }} onClick={handlePayAll}>Pay All Available</Button>
          </div>
          <Table columns={payoutColumns} dataSource={payouts} rowKey="id" pagination={false} scroll={{ x: 800 }} />
        </div>
      ),
    },
    {
      key: 'transactions',
      label: 'Transactions',
      children: <Table columns={txnColumns} dataSource={transactions} rowKey="id" pagination={{ pageSize: 10 }} scroll={{ x: 900 }} />,
    },
    {
      key: 'refunds',
      label: 'Refunds',
      children: <Table columns={refundColumns} dataSource={refunds} rowKey="id" pagination={false} scroll={{ x: 800 }} />,
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} xl={6}>
          <StatCard title="Total Revenue" value="₹2,84,500" subtitle="All time platform earnings" icon={<DollarOutlined />} color="#1A73E8" />
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <StatCard title="Commission This Month" value="₹18,450" subtitle="20% of bookings" icon={<ArrowUpOutlined />} color="#34A853" />
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <StatCard title="Pending Payouts" value="₹12,340" subtitle="8 workers awaiting" icon={<WalletOutlined />} color="#FF6B00" />
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <StatCard title="Total Refunded" value="₹4,200" subtitle="This month" icon={<RollbackOutlined />} color="#EA4335" />
        </Col>
      </Row>

      <Card style={{ borderRadius: 12 }}>
        <Tabs items={tabItems} />
      </Card>

      {/* Pay Now Modal */}
      <Modal
        title="Confirm Payout"
        open={payModal}
        onOk={confirmPay}
        onCancel={() => setPayModal(false)}
        okText="Confirm Release"
        okButtonProps={{ style: { background: '#34A853', borderColor: '#34A853' } }}
      >
        {payTarget && (
          <div style={{ padding: '8px 0' }}>
            <p>Release payout of <strong>{payTarget.net}</strong> to <strong>{payTarget.worker}</strong>?</p>
            <p style={{ color: '#6B7280', fontSize: 13 }}>This will transfer to their registered bank account.</p>
          </div>
        )}
      </Modal>

      {/* Refund Modal */}
      <Modal
        title={`Refund Review — ${refundTarget?.id}`}
        open={refundModal}
        onCancel={() => setRefundModal(false)}
        footer={
          refundTarget?.status === 'Pending' ? (
            <Space>
              <Button onClick={() => setRefundModal(false)}>Cancel</Button>
              <Button danger onClick={() => confirmRefund('reject')}>Reject Refund</Button>
              <Button style={{ borderColor: '#1A73E8', color: '#1A73E8' }} onClick={() => confirmRefund('partial')}>
                Partial Refund
              </Button>
              <Button type="primary" style={{ background: '#34A853', borderColor: '#34A853' }} onClick={() => confirmRefund('approve')}>
                Approve Full Refund
              </Button>
            </Space>
          ) : (
            <Button onClick={() => setRefundModal(false)}>Close</Button>
          )
        }
      >
        {refundTarget && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <p>Approve full refund of <strong>{refundTarget.amount}</strong> to <strong>{refundTarget.customer}</strong>?</p>
            <p style={{ color: '#6B7280', fontSize: 13 }}>Booking: {refundTarget.bookingId} | Reason: {refundTarget.reason}</p>
            {refundTarget.status === 'Pending' && (
              <div>
                <Text strong style={{ fontSize: 13 }}>Partial Refund Amount</Text>
                <Input prefix="₹" placeholder="Enter partial amount" value={partialAmount} onChange={(e) => setPartialAmount(e.target.value)} style={{ marginTop: 6 }} />
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}