import { useState } from 'react';
import {
  Table, Button, Tag, Space, Modal, Form, Input, Switch,
  Select, Typography, App as AntdApp, Card, Row, Col,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { Text } = Typography;
const { TextArea } = Input;

interface Service {
  id: number;
  name: string;
  icon: string;
  basePrice: string;
  status: 'Active' | 'Inactive';
  bookings: number;
  description: string;
}

const initialServices: Service[] = [
  { id: 1, name: 'Home Cleaning', icon: '🧹', basePrice: '299', status: 'Active', bookings: 234, description: 'Professional home cleaning service' },
  { id: 2, name: 'Car Wash', icon: '🚗', basePrice: '199', status: 'Active', bookings: 189, description: 'Complete car washing and cleaning' },
  { id: 3, name: 'Plumbing', icon: '🔧', basePrice: '349', status: 'Active', bookings: 145, description: 'All types of plumbing repairs' },
  { id: 4, name: 'AC Repair', icon: '❄️', basePrice: '499', status: 'Active', bookings: 98, description: 'AC installation, service & repair' },
  { id: 5, name: 'Sofa Cleaning', icon: '🛋️', basePrice: '399', status: 'Inactive', bookings: 67, description: 'Deep sofa and upholstery cleaning' },
  { id: 6, name: 'Electrician', icon: '⚡', basePrice: '249', status: 'Active', bookings: 112, description: 'Electrical repairs and installation' },
];

const iconOptions = ['🧹', '🚗', '🔧', '❄️', '🛋️', '⚡', '🪟', '🏠', '🌿', '🔌'];

export default function ServiceManagement() {
  const [services, setServices] = useState<Service[]>(initialServices);
  const [editModal, setEditModal] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [editForm] = Form.useForm();
  const [addForm] = Form.useForm();
  const { notification, modal } = AntdApp.useApp();

  const openEdit = (service: Service) => {
    setSelectedService(service);
    editForm.setFieldsValue({
      name: service.name,
      basePrice: service.basePrice,
      description: service.description,
      status: service.status === 'Active',
    });
    setEditModal(true);
  };

  const handleEdit = () => {
    editForm.validateFields().then((values) => {
      setServices((prev) =>
        prev.map((s) =>
          s.id === selectedService?.id
            ? { ...s, name: values.name, basePrice: values.basePrice, description: values.description, status: values.status ? 'Active' : 'Inactive' }
            : s
        )
      );
      setEditModal(false);
      notification.success({ message: 'Service updated successfully', placement: 'topRight' });
    });
  };

  const handleToggle = (service: Service) => {
    const action = service.status === 'Active' ? 'deactivate' : 'activate';
    modal.confirm({
      title: `${action.charAt(0).toUpperCase() + action.slice(1)} Service`,
      content: `Are you sure you want to ${action} "${service.name}"?`,
      okText: `Yes, ${action}`,
      okType: service.status === 'Active' ? 'danger' : 'primary',
      onOk: () => {
        setServices((prev) =>
          prev.map((s) =>
            s.id === service.id
              ? { ...s, status: s.status === 'Active' ? 'Inactive' : 'Active' }
              : s
          )
        );
        notification.success({ message: `Service ${action}d successfully`, placement: 'topRight' });
      },
    });
  };

  const handleDelete = (service: Service) => {
    modal.confirm({
      title: 'Delete Service',
      content: `Delete "${service.name}"? This action cannot be undone.`,
      okText: 'Delete',
      okType: 'danger',
      onOk: () => {
        setServices((prev) => prev.filter((s) => s.id !== service.id));
        notification.success({ message: 'Service deleted', placement: 'topRight' });
      },
    });
  };

  const handleAdd = () => {
    addForm.validateFields().then((values) => {
      const newService: Service = {
        id: Date.now(),
        name: values.name,
        icon: values.icon || '🔧',
        basePrice: values.basePrice,
        description: values.description || '',
        status: values.status ? 'Active' : 'Active',
        bookings: 0,
      };
      setServices((prev) => [...prev, newService]);
      setAddModal(false);
      addForm.resetFields();
      notification.success({ message: 'Service created successfully', placement: 'topRight' });
    });
  };

  const columns = [
    { title: '#', dataIndex: 'id', key: 'id', width: 50 },
    {
      title: 'Service Name',
      key: 'name',
      render: (_: unknown, r: Service) => (
        <Space>
          <span style={{ fontSize: 20 }}>{r.icon}</span>
          <Text strong>{r.name}</Text>
        </Space>
      ),
    },
    {
      title: 'Base Price',
      dataIndex: 'basePrice',
      key: 'basePrice',
      render: (v: string) => <Text strong>₹{v}</Text>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (s: string) => <Tag color={s === 'Active' ? 'green' : 'default'}>{s}</Tag>,
    },
    {
      title: 'Total Bookings',
      dataIndex: 'bookings',
      key: 'bookings',
      align: 'center' as const,
      render: (v: number) => <Text strong>{v}</Text>,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: unknown, record: Service) => (
        <Space>
          <Button size="small" icon={<EditOutlined />} onClick={() => openEdit(record)}>
            Edit
          </Button>
          <Button
            size="small"
            onClick={() => handleToggle(record)}
            style={{ color: record.status === 'Active' ? '#EA4335' : '#34A853', borderColor: record.status === 'Active' ? '#EA4335' : '#34A853' }}
          >
            {record.status === 'Active' ? 'Deactivate' : 'Activate'}
          </Button>
          <Button size="small" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record)} />
        </Space>
      ),
    },
  ];

  return (
    <div>
      {/* Top bar */}
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <Text style={{ color: '#6B7280' }}>Manage all platform services</Text>
        </Col>
        <Col>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setAddModal(true)}
            style={{ background: '#1A73E8' }}
          >
            Add New Service
          </Button>
        </Col>
      </Row>

      <Card style={{ borderRadius: 12 }}>
        <Table
          columns={columns}
          dataSource={services}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          scroll={{ x: 700 }}
        />
      </Card>

      {/* Edit Modal */}
      <Modal
        title={`Edit Service — ${selectedService?.name}`}
        open={editModal}
        onOk={handleEdit}
        onCancel={() => setEditModal(false)}
        okText="Save Changes"
        okButtonProps={{ style: { background: '#1A73E8' } }}
      >
        <Form form={editForm} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item name="name" label="Service Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="basePrice" label="Base Price (₹)" rules={[{ required: true }]}>
            <Input prefix="₹" type="number" />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <TextArea rows={3} />
          </Form.Item>
          <Form.Item name="status" label="Status" valuePropName="checked">
            <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Add Modal */}
      <Modal
        title="Add New Service"
        open={addModal}
        onOk={handleAdd}
        onCancel={() => { setAddModal(false); addForm.resetFields(); }}
        okText="Create Service"
        okButtonProps={{ style: { background: '#1A73E8' } }}
      >
        <Form form={addForm} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item name="name" label="Service Name" rules={[{ required: true }]}>
            <Input placeholder="e.g. Home Cleaning" />
          </Form.Item>
          <Form.Item name="basePrice" label="Base Price (₹)" rules={[{ required: true }]}>
            <Input prefix="₹" type="number" placeholder="299" />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <TextArea rows={3} placeholder="Short description of the service" />
          </Form.Item>
          <Form.Item name="icon" label="Service Icon">
            <Select placeholder="Select an icon">
              {iconOptions.map((ico) => (
                <Select.Option key={ico} value={ico}>
                  <span style={{ fontSize: 18, marginRight: 8 }}>{ico}</span>
                  {ico}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="status" label="Status" valuePropName="checked" initialValue={true}>
            <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
