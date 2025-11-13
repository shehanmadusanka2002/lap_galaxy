import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DebugAuth = () => {
  const navigate = useNavigate();
  const [authInfo, setAuthInfo] = useState({
    token: null,
    user: null,
    role: null
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    const role = localStorage.getItem('role');

    setAuthInfo({
      token: token || 'Not found',
      user: user || 'Not found',
      role: role || 'Not found'
    });
  }, []);

  const clearStorage = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6">Authentication Debug Info</h1>
        
        <div className="space-y-4">
          <div className="border-b pb-4">
            <h2 className="font-semibold text-lg mb-2">Token:</h2>
            <p className="text-sm bg-gray-100 p-2 rounded break-all">{authInfo.token}</p>
          </div>

          <div className="border-b pb-4">
            <h2 className="font-semibold text-lg mb-2">User:</h2>
            <pre className="text-sm bg-gray-100 p-2 rounded overflow-auto">
              {authInfo.user}
            </pre>
          </div>

          <div className="border-b pb-4">
            <h2 className="font-semibold text-lg mb-2">Role:</h2>
            <p className="text-sm bg-gray-100 p-2 rounded">{authInfo.role}</p>
            {authInfo.role === 'ADMIN' && (
              <p className="text-green-600 mt-2">✅ You have ADMIN access</p>
            )}
            {authInfo.role === 'USER' && (
              <p className="text-blue-600 mt-2">ℹ️ You have USER access (not admin)</p>
            )}
          </div>

          <div className="flex gap-4 mt-6">
            <button
              onClick={() => navigate('/admin')}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Go to Admin Dashboard
            </button>
            <button
              onClick={() => navigate('/login')}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Go to Login
            </button>
            <button
              onClick={clearStorage}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Clear Storage & Reload
            </button>
          </div>

          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded">
            <h3 className="font-semibold mb-2">⚠️ Troubleshooting:</h3>
            <ul className="text-sm space-y-1">
              <li>1. Make sure you're logging in with an admin account</li>
              <li>2. Check the database: <code>SELECT username, role FROM users;</code></li>
              <li>3. Admin user should have role = 'ADMIN'</li>
              <li>4. Check browser console for detailed logs</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DebugAuth;
