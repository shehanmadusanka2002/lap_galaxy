import React from 'react';
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Twitter, Linkedin, Youtube, Send, ArrowRight, Award, Shield, Truck, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function Footer() {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  const handleSubscribe = (e) => {
    e.preventDefault();
    alert('Thank you for subscribing to our newsletter!');
  };

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Top Section - Features */}
      <div className="bg-gradient-to-r from-indigo-900/50 to-purple-900/50 py-6 sm:py-8 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            <div className="flex items-center gap-3 sm:gap-4 bg-white/5 rounded-lg p-3 sm:p-4 hover:bg-white/10 transition-all">
              <div className="bg-indigo-600 p-2 sm:p-3 rounded-full">
                <Truck size={20} className="sm:w-6 sm:h-6" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm sm:text-base">Free Shipping</h4>
                <p className="text-xs sm:text-sm text-gray-300">On orders over Rs. 50,000</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 sm:gap-4 bg-white/5 rounded-lg p-3 sm:p-4 hover:bg-white/10 transition-all">
              <div className="bg-green-600 p-2 sm:p-3 rounded-full">
                <Shield size={20} className="sm:w-6 sm:h-6" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm sm:text-base">Secure Payment</h4>
                <p className="text-xs sm:text-sm text-gray-300">100% secure transactions</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 sm:gap-4 bg-white/5 rounded-lg p-3 sm:p-4 hover:bg-white/10 transition-all">
              <div className="bg-yellow-600 p-2 sm:p-3 rounded-full">
                <Award size={20} className="sm:w-6 sm:h-6" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm sm:text-base">Quality Guarantee</h4>
                <p className="text-xs sm:text-sm text-gray-300">Authentic products only</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 sm:gap-4 bg-white/5 rounded-lg p-3 sm:p-4 hover:bg-white/10 transition-all">
              <div className="bg-purple-600 p-2 sm:p-3 rounded-full">
                <CreditCard size={20} className="sm:w-6 sm:h-6" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm sm:text-base">Easy Returns</h4>
                <p className="text-xs sm:text-sm text-gray-300">7-day return policy</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="py-8 sm:py-10 lg:py-12">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-8">
            {/* Company Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-1.5 sm:p-2 rounded-lg">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="white" viewBox="0 0 24 24">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-5 14H4v-4h11v4zm0-5H4V9h11v4zm5 5h-4V9h4v9z"/>
                  </svg>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                  LAPGALAXY
                </h3>
              </div>
              <p className="text-sm sm:text-base text-gray-300 mb-3 sm:mb-4 leading-relaxed">
                Your premier destination for cutting-edge laptops and computer accessories. We bring you the latest technology at competitive prices with exceptional customer service.
              </p>
              <div className="space-y-1.5 sm:space-y-2 mb-4 sm:mb-6">
                <div className="flex items-center gap-2 sm:gap-3 text-sm sm:text-base text-gray-300 hover:text-white transition-colors">
                  <MapPin size={16} className="text-indigo-400 flex-shrink-0" />
                  <span className="text-xs sm:text-sm">123 Main Street, Colombo 07, Sri Lanka</span>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 text-sm sm:text-base text-gray-300 hover:text-white transition-colors">
                  <Phone size={16} className="text-green-400 flex-shrink-0" />
                  <span className="text-xs sm:text-sm">+94 112 584 406 / +94 77 123 4567</span>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 text-sm sm:text-base text-gray-300 hover:text-white transition-colors">
                  <Mail size={16} className="text-purple-400 flex-shrink-0" />
                  <span className="text-xs sm:text-sm">info@lapgalaxy.lk</span>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 text-sm sm:text-base text-gray-300 hover:text-white transition-colors">
                  <Clock size={16} className="text-yellow-400 flex-shrink-0" />
                  <span className="text-xs sm:text-sm">Mon - Sat: 9:00 AM - 7:00 PM</span>
                </div>
              </div>
              
              {/* Social Media */}
              <div>
                <h4 className="font-semibold mb-2 sm:mb-3 text-white text-sm sm:text-base">Follow Us</h4>
                <div className="flex gap-2 sm:gap-3 flex-wrap">
                  <a href="#" className="bg-white/10 hover:bg-blue-600 p-2 sm:p-2.5 rounded-lg transition-all transform hover:scale-110">
                    <Facebook size={18} className="sm:w-5 sm:h-5" />
                  </a>
                  <a href="#" className="bg-white/10 hover:bg-pink-600 p-2 sm:p-2.5 rounded-lg transition-all transform hover:scale-110">
                    <Instagram size={18} className="sm:w-5 sm:h-5" />
                  </a>
                  <a href="#" className="bg-white/10 hover:bg-blue-400 p-2 sm:p-2.5 rounded-lg transition-all transform hover:scale-110">
                    <Twitter size={18} className="sm:w-5 sm:h-5" />
                  </a>
                  <a href="#" className="bg-white/10 hover:bg-blue-700 p-2 sm:p-2.5 rounded-lg transition-all transform hover:scale-110">
                    <Linkedin size={18} className="sm:w-5 sm:h-5" />
                  </a>
                  <a href="#" className="bg-white/10 hover:bg-red-600 p-2 sm:p-2.5 rounded-lg transition-all transform hover:scale-110">
                    <Youtube size={18} className="sm:w-5 sm:h-5" />
                  </a>
                </div>
              </div>
            </div>
            
            {/* Quick Links */}
            <div>
              <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 text-white">Quick Links</h3>
              <ul className="space-y-2 sm:space-y-2.5">
                <li>
                  <a href="/" className="text-gray-300 hover:text-indigo-400 transition-colors flex items-center gap-2 group">
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    Home
                  </a>
                </li>
                <li>
                  <a href="/products" className="text-gray-300 hover:text-indigo-400 transition-colors flex items-center gap-2 group">
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    Products
                  </a>
                </li>
                <li>
                  <a href="/about" className="text-gray-300 hover:text-indigo-400 transition-colors flex items-center gap-2 group">
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    About Us
                  </a>
                </li>
                <li>
                  <a href="/contact" className="text-gray-300 hover:text-indigo-400 transition-colors flex items-center gap-2 group">
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="/blog" className="text-gray-300 hover:text-indigo-400 transition-colors flex items-center gap-2 group">
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    Blog & News
                  </a>
                </li>
              </ul>
            </div>
            
            {/* Product Categories */}
            <div>
              <h3 className="text-lg font-bold mb-4 text-white">Categories</h3>
              <ul className="space-y-2.5">
                <li>
                  <a href="/category/laptops" className="text-gray-300 hover:text-indigo-400 transition-colors flex items-center gap-2 group">
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    Laptops
                  </a>
                </li>
                <li>
                  <a href="/category/gaming" className="text-gray-300 hover:text-indigo-400 transition-colors flex items-center gap-2 group">
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    Gaming Laptops
                  </a>
                </li>
                <li>
                  <a href="/category/accessories" className="text-gray-300 hover:text-indigo-400 transition-colors flex items-center gap-2 group">
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    Accessories
                  </a>
                </li>
                <li>
                  <a href="/category/components" className="text-gray-300 hover:text-indigo-400 transition-colors flex items-center gap-2 group">
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    Components
                  </a>
                </li>
                <li>
                  <a href="/category/peripherals" className="text-gray-300 hover:text-indigo-400 transition-colors flex items-center gap-2 group">
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    Peripherals
                  </a>
                </li>
              </ul>
            </div>
            
            {/* Newsletter */}
            <div>
              <h3 className="text-lg font-bold mb-4 text-white">Newsletter</h3>
              <p className="text-gray-300 mb-4 text-sm">
                Subscribe to get special offers, free giveaways, and exclusive deals.
              </p>
              <form onSubmit={handleSubscribe} className="space-y-3">
                <div className="relative">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    required
                    className="w-full bg-white/10 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-4 py-3 rounded-lg font-medium transition-all transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg"
                >
                  <Send size={18} />
                  Subscribe Now
                </button>
              </form>
              
              {/* Payment Methods */}
              <div className="mt-6">
                <h4 className="font-semibold mb-3 text-white text-sm">We Accept</h4>
                <div className="flex flex-wrap gap-2">
                  <div className="bg-white rounded px-3 py-1.5 text-xs font-semibold text-gray-800">VISA</div>
                  <div className="bg-white rounded px-3 py-1.5 text-xs font-semibold text-gray-800">Mastercard</div>
                  <div className="bg-white rounded px-3 py-1.5 text-xs font-semibold text-gray-800">AmEx</div>
                  <div className="bg-white rounded px-3 py-1.5 text-xs font-semibold text-gray-800">PayPal</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Bar */}
      <div className="bg-black/30 py-4 sm:py-6 border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3 sm:gap-4">
            <p className="text-gray-400 text-xs sm:text-sm text-center md:text-left">
              &copy; {currentYear} <span className="font-semibold text-white">LAPGALAXY</span>. All rights reserved. 
              <span className="hidden lg:inline"> | Crafted with ❤️ in Sri Lanka</span>
            </p>
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4 lg:gap-6 text-xs sm:text-sm">
              <a href="/privacy" className="text-gray-400 hover:text-white transition-colors whitespace-nowrap">
                Privacy Policy
              </a>
              <a href="/terms" className="text-gray-400 hover:text-white transition-colors whitespace-nowrap">
                Terms of Service
              </a>
              <a href="/shipping" className="text-gray-400 hover:text-white transition-colors whitespace-nowrap">
                Shipping Policy
              </a>
              <a href="/returns" className="text-gray-400 hover:text-white transition-colors whitespace-nowrap">
                Return Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
