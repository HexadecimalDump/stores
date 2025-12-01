// src/components/AddProductModalTable.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { Table, Radio, message } from 'antd';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import { getAvailableProductsForStore } from '../api/storesApi'; // Use the specific API call
import { Product } from '../api/models';

interface AddProductModalTableProps {
  storeId: number;
  onSelectProduct: (productId: number | undefined) => void;
  selectedProductId: number | undefined;
}

const AddProductModalTable: React.FC<AddProductModalTableProps> = ({
  storeId,
  onSelectProduct,
  selectedProductId,
}) => {
  const [availableProducts, setAvailableProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  // Add pagination state for the modal table
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 5,
    total: 0,
  });
  const { current, pageSize } = pagination;

  const fetchAvailableProducts = useCallback(
    async (page: number, pageSize: number) => {
      setLoading(true);
      try {
        const offset = (page - 1) * pageSize;
        // Use the new dedicated API endpoint for available products
        const response = await getAvailableProductsForStore(storeId, {
          limit: pageSize,
          offset,
        });
        setAvailableProducts(response.results);
        setPagination((p) => ({
          ...p,
          current: page,
          pageSize: pageSize,
          total: response.total,
        }));
      } catch (error) {
        message.error('Failed to load available products.');
      } finally {
        setLoading(false);
      }
    },
    [storeId],
  );

  useEffect(() => {
    fetchAvailableProducts(current!, pageSize!);
  }, [fetchAvailableProducts, current, pageSize]);

  const handleTableChange = (p: TablePaginationConfig) => {
    if (p.current && p.pageSize) {
      // AntD Table triggers onChange, which updates state, which triggers useEffect
      setPagination(p);
    }
  };

  const columns: ColumnsType<Product> = [
    {
      title: 'Select',
      key: 'select',
      render: (_, record) => (
        <Radio
          checked={selectedProductId === record.id}
          onChange={() => onSelectProduct(record.id)}
        />
      ),
      width: 60,
    },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Category', dataIndex: 'category', key: 'category' },
    { title: 'Price ($)', dataIndex: 'price', key: 'price' },
    { title: 'Quantity', dataIndex: 'qty', key: 'qty' },
  ];

  return (
    <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
      {/* Loading state is handled by the table itself now using the loading prop */}
      <Table
        columns={columns}
        dataSource={availableProducts}
        rowKey="id"
        pagination={{ ...pagination, showSizeChanger: true }}
        loading={loading}
        size="small"
        onChange={handleTableChange} // Add change handler for pagination
        // Handle row click to select radio button
        onRow={(record) => {
          return {
            onClick: () => {
              onSelectProduct(record.id);
            },
          };
        }}
      />
      {!loading && availableProducts.length === 0 && (
        <p style={{ marginTop: 10, textAlign: 'center', color: 'gray' }}>
          All products are already associated with this store.
        </p>
      )}
    </div>
  );
};

export default AddProductModalTable;
