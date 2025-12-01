import React, { useState, useEffect } from 'react';
import { Table, Button, Space, message, Card } from 'antd';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import { PlusOutlined, EditOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { getStores, createStore, updateStore } from '../api/storesApi';
import { Store, StoreDto } from '../api/models';
import ModalForm from '../components/ModalForms';
import { storeFormItems } from '../utils/formHelpers';
import { getAxiosErrorMessage } from '../utils/errorHelpers';

const initialPagination = {
  current: 1,
  pageSize: 10,
  total: 0,
};

const Stores: React.FC = () => {
  const navigate = useNavigate();
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState(initialPagination);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingStore, setEditingStore] = useState<Store | undefined>(
    undefined,
  );

  const fetchStores = async (page: number, pageSize: number) => {
    setLoading(true);
    try {
      // API uses offset/limit, AntD uses current/pageSize
      const offset = (page - 1) * pageSize;
      const data = await getStores({ limit: pageSize, offset });
      setStores(data.results);
      setPagination({
        current: page,
        pageSize: pageSize,
        total: data.total,
      });
    } catch (error) {
      message.error('Failed to fetch stores.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores(initialPagination.current, initialPagination.pageSize);
  }, []);

  const handleTableChange = (p: TablePaginationConfig) => {
    if (p.current && p.pageSize) {
      fetchStores(p.current, p.pageSize);
    }
  };

  const handleAddStore = () => {
    setEditingStore(undefined);
    setModalVisible(true);
  };

  const handleEditStore = (store: Store) => {
    setEditingStore(store);
    setModalVisible(true);
  };

  const handleModalSubmit = async (values: StoreDto) => {
    setLoading(true);
    try {
      if (editingStore) {
        await updateStore(editingStore.id, values);
        message.success(`Store "${values.name}" updated successfully.`);
      } else {
        await createStore(values);
        message.success(`Store "${values.name}" created successfully.`);
      }
      setModalVisible(false);
      fetchStores(pagination.current, pagination.pageSize); // Refresh list
    } catch (error: any) {
      message.error(getAxiosErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const columns: ColumnsType<Store> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <Button
          style={{ border: 'none' }}
          onClick={() => navigate(`/stores/${record.id}`)}
        >
          {text}
        </Button>
      ),
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (dateString: string) => new Date(dateString).toLocaleDateString(),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEditStore(record)}
          >
            Edit
          </Button>
          {/* Add delete functionality if needed */}
        </Space>
      ),
    },
  ];

  return (
    <Card
      title="Stores Management"
      extra={
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAddStore}>
          Add Store
        </Button>
      }
    >
      <Table
        columns={columns}
        dataSource={stores}
        rowKey="id"
        pagination={{ ...pagination, showSizeChanger: true }}
        loading={loading}
        onChange={handleTableChange}
      />
      <ModalForm<StoreDto>
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleModalSubmit}
        title={
          editingStore ? `Edit Store: ${editingStore.name}` : 'Create New Store'
        }
        initialValues={editingStore}
        formItems={storeFormItems}
      />
    </Card>
  );
};

export default Stores;
