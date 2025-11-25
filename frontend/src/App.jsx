import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import AdminDashboard from './pages/AdminDashboard.jsx'
import LapGalaxy from './components/LapGalaxy.jsx'
import ProductList from './pages/ProductList.jsx'
import Home from './pages/Home.jsx'
import UserRegister from './pages/UserRegister.jsx';
import Login from './pages/Login.jsx';
import ProductDetails from './pages/ProductDetails.jsx';
import Cart from './pages/Cart.jsx';
import Checkout from './pages/Checkout.jsx';
import ResetPassword from './pages/ResetPassword.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import DebugAuth from './components/DebugAuth.jsx';
import About from './pages/About.jsx';
import ContactUs from './pages/ContactUs.jsx';
import Blog from './pages/Blog.jsx';




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
