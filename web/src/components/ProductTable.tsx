import React from 'react';
import { Table, Space, Button } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { EditOutlined } from '@ant-design/icons';
import { Product } from '../api/models';

interface ProductTableProps {
  products: Product[];
  loading: boolean;
  pagination: object;
  onChange: (p: any) => void;
  onEdit?: (product: Product) => void;
}

const ProductTable: React.FC<ProductTableProps> = ({
  products,
  loading,
  pagination,
  onChange,
  onEdit,
}) => {
  const columns: ColumnsType<Product> = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Category', dataIndex: 'category', key: 'category' },
    { title: 'Price ($)', dataIndex: 'price', key: 'price' },
    { title: 'Quantity', dataIndex: 'qty', key: 'qty' },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (dateString: string) => new Date(dateString).toLocaleDateString(),
    },
  ];

  if (onEdit) {
    columns.push({
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button icon={<EditOutlined />} onClick={() => onEdit(record)}>
            Edit
          </Button>
          {/* Add remove from store/delete functionality if needed */}
        </Space>
      ),
    });
  }

  return (
    <Table
      columns={columns}
      dataSource={products}
      rowKey="id"
      pagination={pagination}
      loading={loading}
      onChange={onChange}
    />
  );
};

export default ProductTable;
