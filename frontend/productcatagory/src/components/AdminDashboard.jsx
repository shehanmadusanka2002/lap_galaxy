import { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line
} from 'recharts';
import {
  Bell, Menu, X, Home, PieChart, Users, Settings,
  HelpCircle, LogOut, Search, ChevronDown
} from 'lucide-react';
import ProductsCreate from './ProductsCreate';
import UserTable from './UserTable';
import ProductTable from './ProductTable';


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

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen w-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-indigo-700 text-white transition-all duration-300 ease-in-out`}>
        <div className="p-4 flex items-center justify-between">
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
            onClick={() => setActiveMenu('help')}
          >
            <HelpCircle size={20} />
            {sidebarOpen && <span>Help</span>}
          </div>

          <div className="mt-8 px-4 py-3 flex items-center gap-3 text-indigo-200 rounded-lg hover:bg-red-300 cursor-pointer hover:text-black">
            <LogOut size={20} />
            {sidebarOpen && <span>Logout</span>}
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-x-hidden overflow-y-auto">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="relative w-64">
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            </div>
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-500 hover:text-indigo-600 focus:outline-none">
                <Bell size={20} />
                <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
              </button>
              <div className="flex items-center gap-2 cursor-pointer">
                <div className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-semibold">
                  JS
                </div>
                {sidebarOpen && (
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-medium">John Smith</span>
                    <ChevronDown size={16} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-6">
          {activeMenu === 'dashboard' && (
            <div>
              <h2 className="text-2xl font-bold mb-2 text-indigo-700">Welcome to Lap_Galaxy Shop Admin Panel</h2>
              <p className="text-gray-700 mb-6">
                <strong>Lap_Galaxy</strong> is a trusted laptop retail shop offering a wide range of branded laptops.
                Monitor monthly sales statistics and manage your products and customers from this admin dashboard.
              </p>

              <div className="w-full h-80 bg-white rounded-lg shadow p-4">
                <h3 className="text-lg font-semibold mb-4">Monthly Laptop Sales (%)</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={salesData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="percentage" stroke="#4f46e5" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {activeMenu === 'addItems' && <ProductsCreate />}
          {activeMenu === 'regUsers' && <UserTable />}
          {activeMenu ===  'showItems' && <ProductTable />}
        </div>
      </div>
    </div>
  );
}