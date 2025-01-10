import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import HomePage from './components/HomePage';
import AddProductPage from './farmer/AddProductPage';
import Home from './components/Home';
import Product from './farmer/Product';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/add-product" element={<AddProductPage />} />
        <Route path="/products" element={<Product />} />
      </Routes>
    </Router>
  );
};

export default App;
