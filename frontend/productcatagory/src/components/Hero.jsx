import React, { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

const Hero = () => {
  const laptop = {
    images: [
      'laptop1.jpg',
      'laptop3.jpg',
      'laptop2.jpg',
      'laptop4.jpg',
      'laptop5.png',
    ],
  };

  const [mainImage, setMainImage] = useState(0);
  const [fade, setFade] = useState(true);

  // Auto-slide with fade
  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false); // trigger fade out
      setTimeout(() => {
        setMainImage((prev) =>
          prev === laptop.images.length - 1 ? 0 : prev + 1
        );
        setFade(true); // fade in new image
      }, 300); // match transition duration
    }, 5000);

    return () => clearInterval(interval);
  }, [laptop.images.length]);

  return (
    <div className="flex flex-col md:flex-row gap-6 h-auto md:h-[600px] pt-8 px-6 bg-white dark:bg-gray-900 transition duration-300">
      
      {/* Main Image */}
      <div className="relative md:w-3/4 w-full h-[300px] md:h-full rounded-xl overflow-hidden shadow-lg">
        <img 
          src={laptop.images[mainImage]} 
          alt={`Main view ${mainImage + 1}`} 
          className={`w-full h-full object-cover rounded-xl transition-opacity duration-500 ease-in-out ${
            fade ? "opacity-100" : "opacity-0"
          }`}
        />
        
        {/* Arrows */}
        <button 
          onClick={() => {
            setFade(false);
            setTimeout(() => {
              setMainImage((prev) => (prev === 0 ? laptop.images.length - 1 : prev - 1));
              setFade(true);
            }, 300);
          }}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 p-2 rounded-full shadow-md hover:text-amber-500 text-gray-700 dark:text-gray-200"
        >
          <ArrowLeft size={24} />
        </button>
        <button 
          onClick={() => {
            setFade(false);
            setTimeout(() => {
              setMainImage((prev) => (prev === laptop.images.length - 1 ? 0 : prev + 1));
              setFade(true);
            }, 300);
          }}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 p-2 rounded-full shadow-md hover:text-amber-500 text-gray-700 dark:text-gray-200"
        >
          <ArrowRight size={24} />
        </button>
      </div>

      {/* Thumbnails */}
      <div className="md:w-1/4 w-full flex md:flex-col flex-row gap-4 pt-4 md:pt-0">
        {laptop.images.map((img, index) => (
          <button 
            key={index}
            onClick={() => {
              setFade(false);
              setTimeout(() => {
                setMainImage(index);
                setFade(true);
              }, 300);
            }}
            className={`rounded-lg overflow-hidden transition-all duration-200 border-2 ${
              mainImage === index
                ? 'border-amber-500 shadow-md'
                : 'border-gray-300 dark:border-gray-600'
            } hover:scale-105`}
          >
            <img 
              src={img} 
              alt={`Thumbnail ${index + 1}`} 
              className="object-cover w-24 h-24 md:w-full md:h-24"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default Hero;
