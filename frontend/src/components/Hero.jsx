import React, { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight, Sparkles, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const Hero = () => {
  const [heroImages, setHeroImages] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [fade, setFade] = useState(true);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch hero images from backend
  // fetch the images
  useEffect(() => {
    axios.get(`${API_BASE_URL}/hero/active`)
      .then(response => {
        setHeroImages(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching hero images:', error);
        setLoading(false);
      });
  }, []);

  // Auto-slide with fade
  useEffect(() => {
    if (heroImages.length === 0) return;
    
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentSlide((prev) =>
          prev === heroImages.length - 1 ? 0 : prev + 1
        );
        setFade(true);
      }, 300);
    }, 5000);

    return () => clearInterval(interval);
  }, [heroImages.length]);

  const goToSlide = (index) => {
    setFade(false);
    setTimeout(() => {
      setCurrentSlide(index);
      setFade(true);
    }, 300);
  };

  const nextSlide = () => {
    setFade(false);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev === heroImages.length - 1 ? 0 : prev + 1));
      setFade(true);
    }, 300);
  };

  const prevSlide = () => {
    setFade(false);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev === 0 ? heroImages.length - 1 : prev - 1));
      setFade(true);
    }, 300);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[600px] bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading hero images...</p>
        </div>
      </div>
    );
  }

  if (heroImages.length === 0) {
    return (
      <div className="flex items-center justify-center h-[600px] bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-900">
        <div className="text-center">
          <Sparkles size={64} className="text-indigo-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
            No Hero Images Available
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Admin can upload hero images to showcase featured products
          </p>
        </div>
      </div>
    );
  }

  const currentHero = heroImages[currentSlide];

  return (
    <div className="relative w-full h-[400px] sm:h-[500px] md:h-[600px] overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src={`data:${currentHero.imageType};base64,${currentHero.imageBase64}`}
          alt={currentHero.title}
          className={`w-full h-full object-cover transition-opacity duration-500 ${
            fade ? "opacity-100" : "opacity-0"
          }`}
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 w-full">
          <div className="max-w-2xl">
            {/* Title with Animation */}
            <h1 
              className={`text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-extrabold text-white mb-4 sm:mb-6 leading-tight transition-all duration-500 ${
                fade ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              {currentHero.title}
            </h1>

            {/* Description */}
            {currentHero.description && (
              <p 
                className={`text-base sm:text-lg md:text-xl text-gray-200 mb-6 sm:mb-8 leading-relaxed transition-all duration-500 delay-100 ${
                  fade ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
              >
                {currentHero.description}
              </p>
            )}

            {/* CTA Buttons */}
            <div 
              className={`flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 transition-all duration-500 delay-200 ${
                fade ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              {currentHero.buttonText && currentHero.buttonLink && (
                <button
                  onClick={() => navigate(currentHero.buttonLink)}
                  className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-bold text-base sm:text-lg shadow-2xl hover:shadow-indigo-500/50 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
                >
                  <ShoppingBag size={20} className="sm:w-6 sm:h-6" />
                  {currentHero.buttonText}
                </button>
              )}
              <button
                onClick={() => navigate('/products')}
                className="w-full sm:w-auto bg-white/20 backdrop-blur-sm border-2 border-white/50 hover:bg-white/30 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-bold text-base sm:text-lg shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                Browse Products
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      {heroImages.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 bg-white/20 backdrop-blur-md hover:bg-white/30 text-white p-3 md:p-4 rounded-full shadow-xl transition-all duration-300 transform hover:scale-110"
          >
            <ArrowLeft size={28} />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 bg-white/20 backdrop-blur-md hover:bg-white/30 text-white p-3 md:p-4 rounded-full shadow-xl transition-all duration-300 transform hover:scale-110"
          >
            <ArrowRight size={28} />
          </button>
        </>
      )}

      {/* Slide Indicators */}
      {heroImages.length > 1 && (
        <div className="absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2 sm:gap-3">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-300 rounded-full ${
                index === currentSlide
                  ? "w-8 sm:w-12 h-2 sm:h-3 bg-white"
                  : "w-2 sm:w-3 h-2 sm:h-3 bg-white/50 hover:bg-white/75"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-20 right-20 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
};

export default Hero;
