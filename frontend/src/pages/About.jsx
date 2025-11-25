import React from "react";
import { Link } from "react-router-dom";
import { Award, Target, Eye, Users, Laptop, Shield, Zap, Heart, ArrowRight } from "lucide-react";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

const About = () => {
  const stats = [
    { label: "Years in Business", value: "10+", icon: Award },
    { label: "Happy Customers", value: "50K+", icon: Users },
    { label: "Products Available", value: "500+", icon: Laptop },
    { label: "Expert Team Members", value: "25+", icon: Heart },
  ];

  const values = [
    {
      icon: Target,
      title: "Our Mission",
      description: "To provide cutting-edge technology and exceptional service, making premium laptops accessible to everyone. We believe in empowering individuals and businesses with the right tools to succeed."
    },
    {
      icon: Eye,
      title: "Our Vision",
      description: "To become the leading online destination for laptop enthusiasts worldwide, known for quality, reliability, and customer satisfaction. We envision a future where technology connects people."
    },
    {
      icon: Shield,
      title: "Quality Assurance",
      description: "Every product undergoes rigorous testing and quality checks. We partner only with authorized brands and provide authentic warranties to ensure your peace of mind."
    },
    {
      icon: Zap,
      title: "Fast Delivery",
      description: "Lightning-fast shipping with real-time tracking. We understand the excitement of getting your new laptop, and we ensure it reaches you safely and quickly."
    }
  ];

  const team = [
    {
      name: "John Anderson",
      role: "CEO & Founder",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80",
      description: "Tech entrepreneur with 15+ years of experience"
    },
    {
      name: "Sarah Williams",
      role: "Head of Operations",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80",
      description: "Expert in supply chain management"
    },
    {
      name: "Michael Chen",
      role: "Chief Technology Officer",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
      description: "Innovation leader in e-commerce tech"
    },
    {
      name: "Emily Rodriguez",
      role: "Customer Success Manager",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
      description: "Passionate about customer satisfaction"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <NavBar />
      
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6">About LapGalaxy</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto text-white/90">
            Your trusted partner in finding the perfect laptop for work, gaming, and creativity
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 text-center transform hover:scale-105 transition-all">
              <stat.icon className="w-12 h-12 mx-auto mb-4 text-indigo-600" />
              <h3 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">{stat.value}</h3>
              <p className="text-gray-600 dark:text-gray-400">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Story Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">Our Story</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
              Founded in 2015, LapGalaxy started with a simple mission: to make premium laptops accessible to everyone. What began as a small online store has grown into one of the most trusted names in the tech retail industry.
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
              We've served over 50,000 satisfied customers, providing them with the latest technology from top brands like Dell, HP, Lenovo, Apple, and more. Our commitment to quality, competitive pricing, and exceptional customer service has made us a leader in the market.
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Today, we continue to innovate and expand our offerings, ensuring that whether you're a student, professional, gamer, or creative, you'll find the perfect laptop at LapGalaxy.
            </p>
          </div>
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80" 
              alt="Office workspace"
              className="rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-white dark:bg-gray-800 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Our Core Values</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center group">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 mb-4 group-hover:scale-110 transition-transform">
                  <value.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{value.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Meet Our Team</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Passionate professionals dedicated to your success
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow">
              <img 
                src={member.image} 
                alt={member.name}
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{member.name}</h3>
                <p className="text-indigo-600 dark:text-indigo-400 font-medium mb-2">{member.role}</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{member.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Find Your Perfect Laptop?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Explore our extensive collection and experience the LapGalaxy difference
          </p>
          <Link 
            to="/" 
            className="inline-flex items-center space-x-2 bg-white text-indigo-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg"
          >
            <span>Browse Products</span>
            <ArrowRight size={20} />
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default About;
