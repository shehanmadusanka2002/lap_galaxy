import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import AdminDashboard from './components/AdminDashboard.jsx'
import LapGalaxy from './components/LapGalaxy.jsx'
import ProductList from './components/ProductList.jsx'
import Home from './components/Home.jsx'
import UserRegister from './components/UserRegister.jsx';
import Login from './components/Login.jsx';
import ProductDetails from './components/ProductDetails.jsx';
import Cart from './components/Cart.jsx';
import Checkout from './components/Checkout.jsx';
import ResetPassword from './components/ResetPassword.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import DebugAuth from './components/DebugAuth.jsx';
import About from './components/About.jsx';
import ContactUs from './components/ContactUs.jsx';
import Blog from './components/Blog.jsx';




function App() {
  

  return (
    <>
      <div>
        
      <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/lap" element={<LapGalaxy />} />
        <Route path="/admin" element={
          <ProtectedRoute requireAdmin={true}>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/products" element={<ProductList />} />
        <Route path="/register" element={<UserRegister />} />
        <Route path="/login" element={<Login />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/debug-auth" element={<DebugAuth />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/blog" element={<Blog />} />
      </Routes>
    </Router>
    
    
    
       
      </div>
    </>
  )
}

export default App
