// src/pages/Home.tsx
import React from 'react';
import { Card, Typography } from 'antd';

const { Title, Paragraph } = Typography;

const Home: React.FC = () => {
  return (
    <Card>
      <Title level={2}>Welcome to the Store Management App!</Title>
      <Paragraph>
        Use the side navigation panel to manage your stores and products.
      </Paragraph>
      <ul>
        <li>**Stores:** View, add, edit stores and see product quantities.</li>
        <li>**Products:** View, add, and edit individual products.</li>
      </ul>
    </Card>
  );
};

export default Home;
