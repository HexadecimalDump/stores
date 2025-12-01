// src/pages/StoreDetails.tsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Card,
  Typography,
  message,
  Skeleton,
  Descriptions,
  Button,
  Modal,
  Space,
  Table,
} from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import {
  getStoreById,
  getStoreProductQuantity,
  addProductToStore,
  deleteProductFromStore,
} from '../api/storesApi';
import { getProducts, ApiSortDirection } from '../api/productsApi';
import { Store, Product } from '../api/models';
import AddProductModalTable from '../components/AddProductModalTable';
import { mapSortKeyToApi } from '../utils/sorterHelper';

const { Title } = Typography;

const StoreDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const storeId = Number(id);

  const [store, setStore] = useState<Store | null>(null);
  const [totalQuantity, setTotalQuantity] = useState<number | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingStore, setLoadingStore] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    total: 0,
    showSizeChanger: true,
  });
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [selectedProductIdToAdd, setSelectedProductIdToAdd] = useState<
    number | undefined
  >(undefined);
  const [sortParams, setSortParams] = useState<{
    sortBy?: string;
    sortDirection?: ApiSortDirection;
  }>({});

  // State used to trigger a re-fetch of store details and products when an action (add/remove product) occurs
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const { current, pageSize } = pagination;

  // --- Fetch Core Store Data (Run once on mount or when storeId/refreshTrigger changes) ---
  useEffect(() => {
    const fetchStoreDetails = async () => {
      setLoadingStore(true);
      try {
        const storeData = await getStoreById(storeId);
        setStore(storeData);
        const qtyData = await getStoreProductQuantity(storeId);
        setTotalQuantity(qtyData);
      } catch (error) {
        message.error('Failed to fetch store details.');
      } finally {
        setLoadingStore(false);
      }
    };

    fetchStoreDetails();
  }, [storeId, refreshTrigger]); // Added refreshTrigger here to update quantity/name if necessary

  // --- Fetch Products Data (Run when storeId, pagination, sortParams, or refreshTrigger changes) ---
  useEffect(() => {
    const fetchProductsInStore = async () => {
      setLoadingProducts(true);
      try {
        const offset = ((current || 1) - 1) * (pageSize || 10);
        const data = await getProducts({
          limit: pageSize,
          offset,
          filterBy: 'StoreId',
          filterValue: storeId.toString(),
          ...sortParams,
        });
        setProducts(data.results);
        setPagination((p) => ({
          ...p,
          total: data.total,
        }));
      } catch (error) {
        message.error('Failed to fetch store products.');
      } finally {
        setLoadingProducts(false);
      }
    };

    if (storeId) {
      fetchProductsInStore();
    }
  }, [storeId, current, pageSize, sortParams, refreshTrigger]);

  // Handle pagination/sorting change for the product table
  const handleTableChange = (p: TablePaginationConfig, f: any, sorter: any) => {
    // 1. Determine new sort parameters
    let newSortParams: { sortBy?: string; sortDirection?: ApiSortDirection } =
      {};
    if (sorter.field && sorter.order) {
      const apiSortBy = mapSortKeyToApi(String(sorter.field));
      newSortParams = {
        sortBy: apiSortBy,
        sortDirection: sorter.order === 'ascend' ? 'ASC' : 'DESC',
      };
    }

    // 2. Update all states. The useEffect above will trigger the API call when these states change.
    setSortParams(newSortParams);

    // AntD's p object contains the *new* current and pageSize values
    setPagination((prev) => ({
      ...prev,
      current: p.current,
      pageSize: p.pageSize,
    }));

    // Note: No manual fetch call here. The second useEffect handles it.
  };

  // Function to manually trigger a data refresh after an action (add/remove)
  const triggerRefresh = () => setRefreshTrigger((prev) => prev + 1);

  const handleOpenAddModal = () => {
    setIsAddModalVisible(true);
    setSelectedProductIdToAdd(undefined);
  };

  const handleAddProductSubmit = async () => {
    if (selectedProductIdToAdd && storeId) {
      try {
        setLoadingProducts(true);
        await addProductToStore(storeId, selectedProductIdToAdd);
        message.success('Product added to store successfully.');
        setIsAddModalVisible(false);
        setSelectedProductIdToAdd(undefined);
        triggerRefresh(); // Trigger refresh instead of calling fetchData/fetchStoreProducts manually
      } catch (error) {
        message.error('Failed to add product to store.');
      } finally {
        setLoadingProducts(false);
      }
    }
  };

  const handleRemoveProduct = async (productId: number) => {
    if (storeId && productId) {
      setLoadingProducts(true);
      try {
        await deleteProductFromStore(storeId, productId);
        message.success('Product removed from store.');
        triggerRefresh(); // Trigger refresh
      } catch (error) {
        message.error('Failed to remove product from store.');
      } finally {
        setLoadingProducts(false);
      }
    }
  };

  if (loadingStore || !store) {
    return (
      <Card>
        <Skeleton active />
      </Card>
    );
  }

  const storeProductColumns: ColumnsType<Product> = [
    { title: 'Name', dataIndex: 'name', key: 'name', sorter: true },
    { title: 'Category', dataIndex: 'category', key: 'category', sorter: true },
    { title: 'Price ($)', dataIndex: 'price', key: 'price' },
    { title: 'Quantity', dataIndex: 'qty', key: 'qty' },
    {
      title: 'Action',
      key: 'action',
      render: (_, record: Product) => (
        <Space size="middle">
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleRemoveProduct(record.id)}
            loading={loadingProducts}
          >
            Remove
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Card>
      <Title level={2}>{store.name}</Title>
      <Descriptions bordered column={1} style={{ marginBottom: 24 }}>
        <Descriptions.Item label="Store ID">{store.id}</Descriptions.Item>
        <Descriptions.Item label="Total Product Quantity">
          {totalQuantity ?? 'N/A'}
        </Descriptions.Item>
        <Descriptions.Item label="Created At">
          {new Date(store.createdAt).toLocaleDateString()}
        </Descriptions.Item>
      </Descriptions>

      <Title level={4}>Products in this Store</Title>
      <div style={{ marginBottom: 16 }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleOpenAddModal}
        >
          Add Existing Product to Store
        </Button>
      </div>

      <Table
        columns={storeProductColumns}
        dataSource={products}
        rowKey="id"
        pagination={pagination}
        loading={loadingProducts}
        onChange={handleTableChange}
      />

      <Modal
        title="Select Product to Add"
        open={isAddModalVisible}
        onOk={handleAddProductSubmit}
        onCancel={() => {
          setIsAddModalVisible(false);
          setSelectedProductIdToAdd(undefined);
        }}
        okButtonProps={{ disabled: !selectedProductIdToAdd }}
        confirmLoading={loadingProducts}
        width={800}
      >
        <AddProductModalTable
          storeId={storeId}
          onSelectProduct={setSelectedProductIdToAdd}
          selectedProductId={selectedProductIdToAdd}
        />
      </Modal>
    </Card>
  );
};

export default StoreDetails;
