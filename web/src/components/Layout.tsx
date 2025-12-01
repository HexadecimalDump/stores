// src/components/Layout.tsx
import React from 'react';
import { Layout as AntdLayout, Menu } from 'antd';
import {
  HomeOutlined,
  ShopOutlined,
  ShoppingCartOutlined,
} from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

const { Header, Content, Sider } = AntdLayout;

const Layout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { key: '/', icon: <HomeOutlined />, label: 'Home' },
    { key: '/stores', icon: <ShopOutlined />, label: 'Stores' },
    { key: '/products', icon: <ShoppingCartOutlined />, label: 'Products' },
  ];

  return (
    <AntdLayout style={{ minHeight: '100vh' }}>
      <Sider width={200} theme="dark">
        <div
          className="logo"
          style={{
            height: '32px',
            margin: '16px',
            background: 'rgba(255, 255, 255, 0.2)',
            color: 'white',
            textAlign: 'center',
            lineHeight: '32px',
          }}
        >
          Store App
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>
      <AntdLayout>
        <Header style={{ padding: 0, background: '#fff' }} />
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            background: '#fff',
            minHeight: 280,
          }}
        >
          <Outlet />
        </Content>
      </AntdLayout>
    </AntdLayout>
  );
};

export default Layout;
