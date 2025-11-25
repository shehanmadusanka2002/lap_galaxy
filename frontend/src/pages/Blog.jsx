import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, User, ArrowRight, Search, Tag, TrendingUp, Laptop, Code, Zap, Shield } from "lucide-react";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

const Blog = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", name: "All Posts", icon: TrendingUp },
    { id: "reviews", name: "Reviews", icon: Laptop },
    { id: "guides", name: "Buying Guides", icon: Code },
    { id: "news", name: "Tech News", icon: Zap },
    { id: "tips", name: "Tips & Tricks", icon: Shield }
  ];

  const blogPosts = [
    {
      id: 1,
      title: "Top 10 Gaming Laptops of 2025: Performance Meets Portability",
      excerpt: "Discover the best gaming laptops that deliver exceptional performance without compromising on portability. From high refresh rate displays to powerful GPUs, we cover everything you need to know.",
      image: "https://images.unsplash.com/photo-1603481588273-2f908a9a7a1b?auto=format&fit=crop&w=800&q=80",
      category: "reviews",
      author: "Alex Thompson",
      date: "Nov 15, 2025",
      readTime: "8 min read",
      tags: ["Gaming", "Reviews", "Performance"]
    },
    {
      id: 2,
      title: "MacBook Air M3 vs M2: Is the Upgrade Worth It?",
      excerpt: "Apple's latest MacBook Air features the new M3 chip. We compare it with the M2 model to help you decide if upgrading is the right choice for your needs and budget.",
      image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80",
      category: "reviews",
      author: "Sarah Miller",
      date: "Nov 12, 2025",
      readTime: "6 min read",
      tags: ["Apple", "MacBook", "Comparison"]
    },
    {
      id: 3,
      title: "Ultimate Laptop Buying Guide 2025: How to Choose the Perfect Device",
      excerpt: "Confused about which laptop to buy? Our comprehensive guide covers processors, RAM, storage, display quality, and more to help you make an informed decision.",
      image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=800&q=80",
      category: "guides",
      author: "Michael Chen",
      date: "Nov 10, 2025",
      readTime: "12 min read",
      tags: ["Buying Guide", "Tips", "Beginners"]
    },
    {
      id: 4,
      title: "Intel 14th Gen vs AMD Ryzen 9000: Battle of the Processors",
      excerpt: "A detailed comparison of Intel's latest 14th generation processors and AMD's Ryzen 9000 series. Which one delivers better performance for your workload?",
      image: "https://images.unsplash.com/photo-1555617981-dac3880eac6e?auto=format&fit=crop&w=800&q=80",
      category: "news",
      author: "David Park",
      date: "Nov 8, 2025",
      readTime: "10 min read",
      tags: ["Hardware", "Processors", "Comparison"]
    },
    {
      id: 5,
      title: "Best Budget Laptops Under $800: Quality Without Breaking the Bank",
      excerpt: "You don't need to spend a fortune for a great laptop. We've tested and reviewed the best budget options that offer excellent value for money.",
      image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80",
      category: "reviews",
      author: "Emma Wilson",
      date: "Nov 5, 2025",
      readTime: "7 min read",
      tags: ["Budget", "Reviews", "Value"]
    },
    {
      id: 6,
      title: "10 Essential Tips to Extend Your Laptop's Battery Life",
      excerpt: "Maximize your laptop's battery performance with these proven tips and tricks. Learn about power settings, background apps, and maintenance techniques.",
      image: "https://images.unsplash.com/photo-1484788984921-03950022c9ef?auto=format&fit=crop&w=800&q=80",
      category: "tips",
      author: "James Rodriguez",
      date: "Nov 3, 2025",
      readTime: "5 min read",
      tags: ["Battery", "Maintenance", "Tips"]
    },
    {
      id: 7,
      title: "OLED vs Mini-LED: Which Display Technology is Right for You?",
      excerpt: "Understanding the differences between OLED and Mini-LED displays can help you choose the best laptop screen for your creative work or entertainment needs.",
      image: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?auto=format&fit=crop&w=800&q=80",
      category: "guides",
      author: "Lisa Anderson",
      date: "Nov 1, 2025",
      readTime: "9 min read",
      tags: ["Display", "Technology", "Guide"]
    },
    {
      id: 8,
      title: "The Rise of AI-Powered Laptops: What It Means for You",
      excerpt: "AI is transforming the laptop industry. Explore how AI-powered features enhance productivity, creativity, and user experience in modern laptops.",
      image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80",
      category: "news",
      author: "Robert Kim",
      date: "Oct 28, 2025",
      readTime: "11 min read",
      tags: ["AI", "Innovation", "Future Tech"]
    },
    {
      id: 9,
      title: "Best Laptops for Students: Performance and Portability Combined",
      excerpt: "Finding the perfect laptop for college or university? Our expert picks balance performance, battery life, and affordability for student success.",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80",
      category: "guides",
      author: "Jennifer Lee",
      date: "Oct 25, 2025",
      readTime: "8 min read",
      tags: ["Students", "Education", "Productivity"]
    }
  ];

  const featuredPost = blogPosts[0];

  const filteredPosts = blogPosts
    .filter(post => selectedCategory === "all" || post.category === selectedCategory)
    .filter(post => 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <NavBar />
      
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6">Blog & News</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto text-white/90">
            Stay updated with the latest tech reviews, buying guides, and industry news
          </p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10 mb-12">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <category.icon size={16} />
                  <span>{category.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Featured Post */}
      {selectedCategory === "all" && !searchQuery && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
            <div className="grid md:grid-cols-2 gap-0">
              <div className="relative h-64 md:h-auto">
                <img 
                  src={featuredPost.image} 
                  alt={featuredPost.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-indigo-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Featured
                  </span>
                </div>
              </div>
              <div className="p-8 flex flex-col justify-center">
                <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                  <span className="flex items-center space-x-1">
                    <Calendar size={16} />
                    <span>{featuredPost.date}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <User size={16} />
                    <span>{featuredPost.author}</span>
                  </span>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  {featuredPost.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  {featuredPost.excerpt}
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {featuredPost.tags.map((tag, index) => (
                    <span key={index} className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full text-sm">
                      <Tag size={14} />
                      <span>{tag}</span>
                    </span>
                  ))}
                </div>
                <Link 
                  to={`/blog/${featuredPost.id}`}
                  className="inline-flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 font-semibold hover:text-indigo-700 dark:hover:text-indigo-300"
                >
                  <span>Read Full Article</span>
                  <ArrowRight size={20} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Blog Posts Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          {selectedCategory === "all" ? "Latest Articles" : `${categories.find(c => c.id === selectedCategory)?.name}`}
        </h2>
        
        {filteredPosts.length === 0 ? (
          <div className="text-center py-16">
            <Search className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No articles found</h3>
            <p className="text-gray-600 dark:text-gray-400">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.slice(selectedCategory === "all" && !searchQuery ? 1 : 0).map(post => (
              <article key={post.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow group">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-indigo-600 text-white px-3 py-1 rounded-full text-xs font-medium capitalize">
                      {post.category}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center space-x-4 text-xs text-gray-600 dark:text-gray-400 mb-3">
                    <span className="flex items-center space-x-1">
                      <Calendar size={14} />
                      <span>{post.date}</span>
                    </span>
                    <span>{post.readTime}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                      <User size={16} />
                      <span>{post.author}</span>
                    </span>
                    <Link 
                      to={`/blog/${post.id}`}
                      className="inline-flex items-center space-x-1 text-indigo-600 dark:text-indigo-400 font-medium hover:text-indigo-700 dark:hover:text-indigo-300"
                    >
                      <span>Read More</span>
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Blog;
