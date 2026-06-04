import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function HeroBanner() {
  const { t } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      image: '/banner_tech.png',
      title: 'banner.title2',
      desc: 'banner.desc2',
      badge: 'NEW ARRIVALS'
    },
    {
      id: 2,
      image: '/banner_fashion.png',
      title: 'banner.title1',
      desc: 'banner.desc1',
      badge: 'LIMITED EDITION'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <section className="hero-section">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
        >
          <img
            src={slide.image}
            alt="Hero Banner"
            className="hero-img"
            onError={(e) => {
              // Fallback gradient if images are still loading/generating
              e.target.style.display = 'none';
            }}
          />
          <div className="hero-image-overlay"></div>
          
          <div className="hero-content">
            <div className="product-category" style={{ color: 'var(--accent-red)', fontWeight: 'bold', marginBottom: '0.5rem' }}>
              {slide.badge}
            </div>
            <h2 className="hero-title">
              {t(slide.title).split(' ').map((word, wIdx) => {
                // Style specific word or last word with accent color
                if (wIdx >= t(slide.title).split(' ').length - 2) {
                  return <span key={wIdx}> {word}</span>;
                }
                return ' ' + word;
              })}
            </h2>
            <p className="hero-desc">{t(slide.desc)}</p>
            <div className="hero-actions">
              <button className="hero-btn-primary">{t('banner.shopNow')}</button>
              <button className="hero-btn-secondary">{t('banner.viewCollection')}</button>
            </div>
          </div>
        </div>
      ))}

      <div className="hero-indicator">
        {slides.map((_, index) => (
          <div
            key={index}
            className={`indicator-dot ${index === currentSlide ? 'active' : ''}`}
            onClick={() => setCurrentSlide(index)}
          ></div>
        ))}
      </div>
    </section>
  );
}
