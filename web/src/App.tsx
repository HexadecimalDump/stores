import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Stores from './pages/Stores';
import Products from './pages/Products';
import StoreDetails from './pages/StoreDetails';
import 'antd/dist/reset.css';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/stores" element={<Stores />} />
          <Route path="/stores/:id" element={<StoreDetails />} />
          <Route path="/products" element={<Products />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
