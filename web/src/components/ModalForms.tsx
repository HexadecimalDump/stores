// src/components/ModalForms.tsx
import React from 'react';
import { Modal, Form, Input, InputNumber, Button, FormItemProps } from 'antd';

interface ModalFormProps<T> {
  visible: boolean;
  onCancel: () => void;
  onOk: (values: T) => void;
  initialValues?: T;
  title: string;
  formItems: FormItemProps[];
}

const ModalForm = <T extends object>({
  visible,
  onCancel,
  onOk,
  initialValues,
  title,
  formItems,
}: ModalFormProps<T>) => {
  const [form] = Form.useForm();

  React.useEffect(() => {
    if (visible) {
      form.setFieldsValue(initialValues);
    } else {
      form.resetFields();
    }
  }, [visible, initialValues, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      onOk(values);
      form.resetFields();
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  };

  return (
    <Modal
      title={title}
      open={visible}
      onOk={handleOk}
      onCancel={onCancel}
      footer={[
        <Button key="back" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={handleOk}>
          Submit
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical" initialValues={initialValues}>
        {formItems.map((item) => (
          <Form.Item key={item.name as string} {...item}>
            {/* Determine input type based on name heuristics */}
            {item.name === 'price' || item.name === 'qty' ? (
              <InputNumber style={{ width: '100%' }} />
            ) : (
              <Input />
            )}
          </Form.Item>
        ))}
      </Form>
    </Modal>
  );
};

export default ModalForm;
