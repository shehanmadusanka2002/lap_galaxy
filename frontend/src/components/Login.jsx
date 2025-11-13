import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { authAPI } from "../services/api";

const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ 
      ...formData, 
      [e.target.name]: e.target.value 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    
    try {
      const response = await authAPI.login(formData);
      const { token, username, email, role, message: successMessage } = response.data;
      
      // Store token and user info in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify({ username, email }));
      localStorage.setItem('role', role);

      console.log("=== LOGIN SUCCESS ===");
      console.log("Token:", token);
      console.log("Role:", role);
      console.log("Username:", username);
      console.log("Email:", email);
      console.log("Redirecting to:", role === 'ADMIN' ? '/admin' : '/');

      setMessage(successMessage);
      
      // Redirect based on role
      setTimeout(() => {
        if (role === 'ADMIN') {
          console.log("Navigating to /admin");
          navigate('/admin', { replace: true });
        } else {
          console.log("Navigating to /");
          navigate('/', { replace: true });
        }
      }, 500);
      
    } catch (err) {
      console.error('Login error:', err);
      setMessage("Error: " + (err.response?.data?.error || "Invalid username or password"));
    } finally {
      setIsLoading(false);
    }
  };

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div
      className="w-screen min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1531746790731-6c087fecd65a?auto=format&fit=crop&w=1470&q=80')"
      }}
    >
      <div className="bg-white/20 backdrop-blur-lg border border-white/30 p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Login</h2>
        {message && (
          <p className={`text-center mb-4 ${message.includes('Error') ? 'text-red-600' : 'text-green-600'}`}>
            {message}
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username Input */}
          <input
            type="text"
            name="username"
            placeholder="👤 Username"
            value={formData.username}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
            disabled={isLoading}
          />

          {/* Password Input with Toggle */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="🔒 Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 pr-10"
              required
              disabled={isLoading}
            />
            <div
              className="absolute right-3 top-2.5 cursor-pointer text-gray-500"
              onClick={togglePassword}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </div>
          </div>

          {/* Forgot Password Link */}
          <div className="flex justify-end text-sm">
            <Link to="/reset-password" className="text-blue-600 hover:underline">
              Forgotten Password?
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>

          {/* Register Link */}
          <div className="text-center text-sm mt-4">
            Don’t have an account?{" "}
            <Link to="/register" className="text-blue-600 hover:underline">
              Register
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
