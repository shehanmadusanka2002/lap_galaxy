import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, User, Mail, Lock, Laptop, ArrowRight, CheckCircle, Shield, Sparkles } from "lucide-react";
import { authAPI } from "../services/api";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: ""
  });

  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
      const res = await authAPI.register(formData);
      setMessage("Registration successful! Redirecting to login...");
      setFormData({ username: "", email: "", password: "" });
      
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err) {
      const errorMsg = err.response?.data || "Something went wrong";
      setMessage("Error: " + errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen w-full flex bg-gradient-to-br from-purple-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      {/* Left Side - Registration Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center mb-8">
            <Link to="/" className="flex items-center space-x-2">
              <Laptop className="text-indigo-600" size={32} />
              <span className="text-2xl font-bold text-gray-900 dark:text-white">LapGalaxy</span>
            </Link>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-100 dark:border-gray-700">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mb-4">
                <Sparkles className="text-white" size={32} />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Create Account</h2>
              <p className="text-gray-600 dark:text-gray-400">Join LapGalaxy and start shopping</p>
            </div>

            {message && (
              <div className={`mb-6 p-4 rounded-lg ${
                message.includes('Error') 
                  ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800' 
                  : 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-800'
              }`}>
                <div className="flex items-center">
                  {!message.includes('Error') && <CheckCircle size={20} className="mr-2" />}
                  <p className="text-sm font-medium">{message}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Username Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="username"
                    placeholder="Choose a username"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 transition-all"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 transition-all"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 transition-all"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={togglePassword}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  Must be at least 8 characters long
                </p>
              </div>

              {/* Terms Agreement */}
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="terms"
                    type="checkbox"
                    required
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="terms" className="text-gray-700 dark:text-gray-300">
                    I agree to the{' '}
                    <Link to="#" className="text-purple-600 hover:text-purple-500 dark:text-purple-400 font-medium">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link to="#" className="text-purple-600 hover:text-purple-500 dark:text-purple-400 font-medium">
                      Privacy Policy
                    </Link>
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02]"
              >
                <span>{isLoading ? 'Creating account...' : 'Create Account'}</span>
                {!isLoading && <ArrowRight size={20} />}
              </button>
            </form>

            {/* Divider */}
            <div className="mt-8 mb-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">Already have an account?</span>
                </div>
              </div>
            </div>

            {/* Login Link */}
            <div className="text-center">
              <Link 
                to="/login" 
                className="inline-flex items-center space-x-2 text-purple-600 hover:text-purple-500 dark:text-purple-400 font-medium"
              >
                <span>Sign in instead</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          {/* Back to Home */}
          <div className="text-center mt-6">
            <Link to="/" className="text-sm text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>

      {/* Right Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-500 p-12 flex-col justify-between relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl"></div>
        
        <div className="relative z-10">
          <Link to="/" className="flex items-center space-x-3 mb-8">
            <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
              <Laptop className="text-white" size={32} />
            </div>
            <span className="text-3xl font-bold text-white">LapGalaxy</span>
          </Link>
          
          <div className="mt-12 space-y-6">
            <h1 className="text-5xl font-extrabold text-white leading-tight">
              Start Your<br />Tech Journey Today
            </h1>
            <p className="text-xl text-white/90 max-w-md">
              Join thousands of satisfied customers who trust LapGalaxy for their laptop needs. Get exclusive deals and personalized recommendations.
            </p>
          </div>
        </div>

        <div className="relative z-10 space-y-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-start space-x-4">
              <div className="p-2 bg-white/20 rounded-lg">
                <Shield className="text-white" size={24} />
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg mb-2">Secure Shopping</h3>
                <p className="text-white/80 text-sm">Your data is protected with industry-standard encryption</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-start space-x-4">
              <div className="p-2 bg-white/20 rounded-lg">
                <CheckCircle className="text-white" size={24} />
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg mb-2">Verified Products</h3>
                <p className="text-white/80 text-sm">All laptops are authentic and come with warranty</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
