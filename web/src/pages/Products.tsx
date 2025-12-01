// src/pages/Products.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { Card, Button, message, Table } from 'antd';
import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import type { TablePaginationConfig, ColumnsType } from 'antd/es/table';
import {
  getProducts,
  createProduct,
  updateProduct,
  ApiSortDirection,
} from '../api/productsApi';
import { Product, CreateProductDto } from '../api/models';
import ModalForm from '../components/ModalForms';
import { productFormItems } from '../utils/formHelpers';
import { mapSortKeyToApi } from '../utils/sorterHelper';

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    total: 0,
    showSizeChanger: true,
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>(
    undefined,
  );
  const [sortParams, setSortParams] = useState<{
    sortBy?: string;
    sortDirection?: ApiSortDirection;
  }>({});
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const { current, pageSize } = pagination;

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const offset = ((current || 1) - 1) * (pageSize || 10);
      const data = await getProducts({
        limit: pageSize,
        offset,
        ...sortParams, // Use current state values
      });
      setProducts(data.results);
      setPagination((p) => ({ ...p, total: data.total }));
    } catch (error) {
      message.error('Failed to fetch products.');
    } finally {
      setLoading(false);
    }
  }, [current, pageSize, sortParams]);

  useEffect(() => {
    // This effect runs when pagination, sortParams, or refreshTrigger changes
    fetchProducts();
  }, [fetchProducts, refreshTrigger]);

  const handleTableChange = (p: TablePaginationConfig, f: any, sorter: any) => {
    // 1. Determine sort parameters
    let newSortParams: { sortBy?: string; sortDirection?: ApiSortDirection } =
      {};
    if (sorter.field && sorter.order) {
      const apiSortBy = mapSortKeyToApi(String(sorter.field));
      newSortParams = {
        sortBy: apiSortBy,
        sortDirection: sorter.order === 'ascend' ? 'ASC' : 'DESC',
      };
    }

    // 2. Update states (useEffect will handle the fetch)
    setSortParams(newSortParams);

    // Update pagination state separately
    setPagination(p);
  };

  const triggerRefresh = () => setRefreshTrigger((prev) => prev + 1);

  const handleAddProduct = () => {
    setEditingProduct(undefined);
    setModalVisible(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setModalVisible(true);
  };

  const handleModalSubmit = async (values: CreateProductDto) => {
    setLoading(true);
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, values);
        message.success(`Product "${values.name}" updated successfully.`);
      } else {
        await createProduct(values);
        message.success(`Product "${values.name}" created successfully.`);
      }
      setModalVisible(false);
      triggerRefresh(); // Refresh list
    } catch (error) {
      message.error('Operation failed.');
    } finally {
      setLoading(false);
    }
  };

  const columns: ColumnsType<Product> = [
    { title: 'Name', dataIndex: 'name', key: 'name', sorter: true },
    { title: 'Category', dataIndex: 'category', key: 'category', sorter: true },
    { title: 'Price ($)', dataIndex: 'price', key: 'price' },
    { title: 'Quantity', dataIndex: 'qty', key: 'qty' },
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
        <Button
          icon={<EditOutlined />}
          onClick={() => handleEditProduct(record)}
        >
          Edit
        </Button>
      ),
    },
  ];

  return (
    <Card
      title="Products Management"
      extra={
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAddProduct}
        >
          Add Product
        </Button>
      }
    >
      <Table
        columns={columns}
        dataSource={products}
        rowKey="id"
        pagination={pagination}
        loading={loading}
        onChange={handleTableChange}
      />
      <ModalForm<CreateProductDto>
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleModalSubmit}
        title={
          editingProduct
            ? `Edit Product: ${editingProduct.name}`
            : 'Create New Product'
        }
        initialValues={
          editingProduct
            ? {
                name: editingProduct.name,
                category: editingProduct.category,
                price: editingProduct.price,
                qty: editingProduct.qty,
              }
            : undefined
        }
        formItems={productFormItems}
      />
    </Card>
  );
};

export default Products;
