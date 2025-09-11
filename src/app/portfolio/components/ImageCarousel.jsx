import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ImageCarousel = ({ images, autoPlay = true, interval = 4000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Auto-play functionality
  useEffect(() => {
    if (!autoPlay || isHovered) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, interval);

    return () => clearInterval(timer);
  }, [autoPlay, interval, isHovered, images.length]);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const carouselVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.8,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.8,
    }),
  };

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  const transition = {
    x: { type: "spring", stiffness: 300, damping: 30 },
    opacity: { duration: 0.2 },
    scale: { duration: 0.3 },
  };

  return (
    <div 
      className="image-carousel"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main Image Display */}
      <div className="carousel-container">
        <AnimatePresence mode="wait" custom={1}>
          <motion.div
            key={currentIndex}
            custom={1}
            variants={carouselVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={transition}
            className="carousel-image-wrapper"
          >
            <img
              src={images[currentIndex]}
              alt={`Experience ${currentIndex + 1}`}
              className="carousel-image"
            />
            <div className="image-overlay">
              <div className="image-info">
                <h4>Experience {currentIndex + 1}</h4>
                <p>Professional Journey</p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        <button 
          className="carousel-arrow carousel-arrow-left"
          onClick={goToPrevious}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <i className="fas fa-chevron-left"></i>
        </button>
        
        <button 
          className="carousel-arrow carousel-arrow-right"
          onClick={goToNext}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <i className="fas fa-chevron-right"></i>
        </button>

        {/* Image Counter */}
        <div className="image-counter">
          {currentIndex + 1} / {images.length}
        </div>
      </div>

      {/* Thumbnail Navigation */}
      <div className="thumbnail-container">
        {images.map((image, index) => (
          <motion.div
            key={index}
            className={`thumbnail ${index === currentIndex ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <img src={image} alt={`Thumbnail ${index + 1}`} />
            <div className="thumbnail-overlay">
              <i className="fas fa-play"></i>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="progress-container">
        <motion.div
          className="progress-bar"
          initial={{ width: 0 }}
          animate={{ width: `${((currentIndex + 1) / images.length) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </div>
  );
};

export default ImageCarousel;
