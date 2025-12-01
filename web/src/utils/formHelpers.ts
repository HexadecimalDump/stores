// src/utils/formHelpers.ts
import { FormItemProps } from 'antd';

export const storeFormItems: FormItemProps[] = [
  {
    name: 'name',
    label: 'Store Name',
    rules: [{ required: true, message: 'Please input the store name!' }],
  },
];

export const productFormItems: FormItemProps[] = [
  {
    name: 'name',
    label: 'Product Name',
    rules: [{ required: true, message: 'Please input the name!' }],
  },
  {
    name: 'category',
    label: 'Category',
    rules: [{ required: true, message: 'Please input the category!' }],
  },
  {
    name: 'price',
    label: 'Price',
    rules: [{ required: true, type: 'number', min: 0 }],
  },
  {
    name: 'qty',
    label: 'Quantity',
    rules: [{ required: true, type: 'number', min: 0, max: 99999 }],
  },
];
