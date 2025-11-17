import { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line
} from 'recharts';
import {
  Bell, Menu, X, Home, PieChart, Users, Settings,
  HelpCircle, LogOut, Search, ChevronDown, Shield, Package
} from 'lucide-react';
import { isAdmin, logout, getCurrentUser } from '../services/api';
import { useNavigate } from 'react-router-dom';
import ProductsCreate from './ProductsCreate';
import UserTable from './UserTable';
import ProductTable from './ProductTable';
import HeroManagement from './HeroManagement';
import OrderManagement from './OrderManagement';


// 🔹 Sample Monthly Laptop Sales Data
const salesData = [
  { month: 'Jan', percentage: 20 },
  { month: 'Feb', percentage: 35 },
  { month: 'Mar', percentage: 50 },
  { month: 'Apr', percentage: 40 },
  { month: 'May', percentage: 60 },
  { month: 'Jun', percentage: 70 },
  { month: 'Jul', percentage: 80 },
  { month: 'Aug', percentage: 75 },
  { month: 'Sep', percentage: 90 },
  { month: 'Oct', percentage: 85 },
  { month: 'Nov', percentage: 95 },
  { month: 'Dec', percentage: 100 },
];

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const navigate = useNavigate();
  const adminUser = isAdmin();
  const currentUser = getCurrentUser();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
      navigate('/login');
    }
  };

  // Redirect if not admin
  if (!adminUser) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-orange-50">
        <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md text-center">
          <div className="bg-red-100 rounded-full p-6 w-24 h-24 mx-auto mb-4 flex items-center justify-center">
            <Shield size={48} className="text-red-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-6">
            You need administrator privileges to access this dashboard.
          </p>
          <button
            onClick={() => navigate('/')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen bg-gray-100 overflow-hidden">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-indigo-700 text-white transition-all duration-300 ease-in-out hidden md:block flex-shrink-0`}>
        <div className="p-3 lg:p-4 flex items-center justify-between">
          {sidebarOpen && <h1 className="text-xl font-bold">Dashboard</h1>}
          <button onClick={toggleSidebar} className="p-1 rounded-lg hover:bg-indigo-600">
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
        <nav className="mt-5">
          <div
            className="px-4 py-3 flex items-center gap-3 text-white rounded-lg hover:bg-red-300 cursor-pointer hover:text-black"
            onClick={() => setActiveMenu('dashboard')}
          >
            <Home size={20} />
            {sidebarOpen && <span>Dashboard</span>}
          </div>

          <div
            className="px-4 py-3 flex items-center gap-3 text-indigo-200 rounded-lg hover:bg-red-300 cursor-pointer hover:text-black"
            onClick={() => setActiveMenu('addItems')}
          >
            <PieChart size={20} />
            {sidebarOpen && <span>AddItems</span>}
          </div>

          <div
            className="px-4 py-3 flex items-center gap-3 text-indigo-200 rounded-lg hover:bg-red-300 cursor-pointer hover:text-black"
            onClick={() => setActiveMenu('regUsers')}
          >
            <Users size={20} />
            {sidebarOpen && <span>RegUsers</span>}
          </div>

          <div
            className="px-4 py-3 flex items-center gap-3 text-indigo-200 rounded-lg hover:bg-red-300 cursor-pointer hover:text-black"
            onClick={() => setActiveMenu('showItems')}
          >
            <Settings size={20} />
            {sidebarOpen && <span>ShowItems</span>}
          </div>

          <div
            className="px-4 py-3 flex items-center gap-3 text-indigo-200 rounded-lg hover:bg-red-300 cursor-pointer hover:text-black"
            onClick={() => setActiveMenu('heroImages')}
          >
            <PieChart size={20} />
            {sidebarOpen && <span>Hero Images</span>}
          </div>

          <div
            className="px-4 py-3 flex items-center gap-3 text-indigo-200 rounded-lg hover:bg-red-300 cursor-pointer hover:text-black"
            onClick={() => setActiveMenu('orders')}
          >
            <Package size={20} />
            {sidebarOpen && <span>Orders</span>}
          </div>

          <div
            className="px-4 py-3 flex items-center gap-3 text-indigo-200 rounded-lg hover:bg-red-300 cursor-pointer hover:text-black"
            onClick={() => setActiveMenu('help')}
          >
            <HelpCircle size={20} />
            {sidebarOpen && <span>Help</span>}
          </div>

          <div className="mt-8 px-4 py-3 flex items-center gap-3 text-indigo-200 rounded-lg hover:bg-red-300 cursor-pointer hover:text-black"
            onClick={handleLogout}
          >
            <LogOut size={20} />
            {sidebarOpen && <span>Logout</span>}
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-x-hidden overflow-y-auto">
        {/* Header */}
        <header className="bg-white shadow-sm sticky top-0 z-40">
          <div className="flex items-center justify-between px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Mobile Menu Button */}
              <button 
                onClick={toggleSidebar}
                className="md:hidden p-2 text-gray-500 hover:text-indigo-600"
              >
                <Menu size={24} />
              </button>
              
              <div className="relative w-40 sm:w-48 lg:w-64">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-1.5 sm:py-2 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <Search className="absolute left-2 sm:left-3 top-2 sm:top-2.5 text-gray-400" size={16} />
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <button className="relative p-2 text-gray-500 hover:text-indigo-600 focus:outline-none">
                <Bell size={18} className="sm:w-5 sm:h-5" />
                <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
              </button>
              <div className="flex items-center gap-1 sm:gap-2 cursor-pointer">
                <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-semibold text-sm">
                  {currentUser?.username?.charAt(0).toUpperCase() || 'A'}
                </div>
                {sidebarOpen && (
                  <div className="hidden sm:flex items-center gap-1">
                    <div>
                      <div className="text-xs sm:text-sm font-medium">{currentUser?.username || 'Admin'}</div>
                      <div className="text-xs text-gray-500 flex items-center gap-1">
                        <Shield size={10} className="sm:w-3 sm:h-3 text-indigo-600" />
                        Admin
                      </div>
                    </div>
                    <ChevronDown size={14} className="sm:w-4 sm:h-4" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-3 sm:p-4 lg:p-6">
          {activeMenu === 'dashboard' && (
            <div>
              <h2 className="text-xl sm:text-2xl font-bold mb-2 text-indigo-700">Welcome to Lap_Galaxy Shop Admin Panel</h2>
              <p className="text-sm sm:text-base text-gray-700 mb-4 sm:mb-6">
                <strong>Lap_Galaxy</strong> is a trusted laptop retail shop offering a wide range of branded laptops.
                Monitor monthly sales statistics and manage your products and customers from this admin dashboard.
              </p>

              <div className="w-full h-64 sm:h-80 bg-white rounded-lg shadow p-3 sm:p-4">
                <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Monthly Laptop Sales (%)</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={salesData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" tick={{fontSize: 12}} />
                    <YAxis domain={[0, 100]} tick={{fontSize: 12}} />
                    <Tooltip />
                    <Line type="monotone" dataKey="percentage" stroke="#4f46e5" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {activeMenu === 'addItems' && <ProductsCreate />}
          {activeMenu === 'regUsers' && <UserTable />}
          {activeMenu === 'showItems' && <ProductTable />}
          {activeMenu === 'heroImages' && <HeroManagement />}
          {activeMenu === 'orders' && <OrderManagement />}
        </div>
      </div>
    </div>
  );
}