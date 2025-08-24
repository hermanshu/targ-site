import React, { useState, useCallback } from 'react';
import { 
  ChevronLeftIcon, 
  ChevronRightIcon, 
  XMarkIcon 
} from '@heroicons/react/24/outline';

interface GalleryProps {
  images: { src: string; alt?: string; w?: number; h?: number }[];
}

export const Gallery: React.FC<GalleryProps> = React.memo(({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showFullscreen, setShowFullscreen] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  console.log('Gallery received images:', images);
  console.log('Images length:', images?.length);
  console.log('Current index:', currentIndex);

  const nextImage = useCallback(() => {
    console.log('nextImage called, current:', currentIndex, 'new:', (currentIndex + 1) % images.length);
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length, currentIndex]);

  const prevImage = useCallback(() => {
    console.log('prevImage called, current:', currentIndex, 'new:', (currentIndex - 1 + images.length) % images.length);
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length, currentIndex]);

  const handleImageClick = useCallback(() => {
    if (images.length > 0) {
      setShowFullscreen(true);
    }
  }, [images.length]);

  const handleCloseFullscreen = useCallback(() => {
    setShowFullscreen(false);
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextImage();
    }
    if (isRightSwipe) {
      prevImage();
    }

    setTouchStart(null);
    setTouchEnd(null);
  }, [touchStart, touchEnd, nextImage, prevImage]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (showFullscreen) {
      if (e.key === 'Escape') {
        handleCloseFullscreen();
      } else if (e.key === 'ArrowRight') {
        nextImage();
      } else if (e.key === 'ArrowLeft') {
        prevImage();
      }
    } else {
      if (images.length > 1) {
        if (e.key === 'ArrowRight') {
          nextImage();
        } else if (e.key === 'ArrowLeft') {
          prevImage();
        }
      }
    }
  }, [showFullscreen, images.length, nextImage, prevImage, handleCloseFullscreen]);

  if (!images || images.length === 0) {
    return (
      <div className="detail-image-container">
        <div className="detail-image-placeholder">
          <div className="placeholder-icon-large">📷</div>
          <span>Нет фото</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div 
        className="detail-image-container" 
        onClick={handleImageClick}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
          <img 
            src={images[currentIndex].src}
            alt={images[currentIndex].alt || 'Изображение товара'}
            className="detail-image"
            style={{ aspectRatio: '4/3' }}
            loading={currentIndex < 2 ? 'eager' : 'lazy'}
            decoding={currentIndex < 2 ? 'sync' : 'async'}
            onError={(e) => {
              console.error('Error loading image:', images[currentIndex].src);
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling?.classList.remove('hidden');
            }}
            onLoad={() => {
              console.log('Image loaded successfully:', images[currentIndex].src);
            }}
          />
          
          <div className="image-overlay" onClick={handleImageClick} />
          
          {images.length > 1 && (
            <>
              <button 
                className="photo-nav-button prev" 
                onClick={(e) => {
                  e.stopPropagation();
                  console.log('Prev button clicked, current index:', currentIndex);
                  prevImage();
                }}
              >
                <ChevronLeftIcon className="photo-nav-icon" />
              </button>
              
              <button 
                className="photo-nav-button next" 
                onClick={(e) => {
                  e.stopPropagation();
                  console.log('Next button clicked, current index:', currentIndex);
                  nextImage();
                }}
              >
                <ChevronRightIcon className="photo-nav-icon" />
              </button>
              
              <div className="photo-indicator">
                <span className="photo-counter">
                  {currentIndex + 1} / {images.length}
                </span>
              </div>
            </>
          )}
        </div>

      {/* Полноэкранный просмотр */}
      {showFullscreen && (
        <div 
          className="fullscreen-image-overlay" 
          onClick={handleCloseFullscreen}
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          <div className="fullscreen-image-container" onClick={(e) => e.stopPropagation()}>
            <img 
              src={images[currentIndex].src}
              alt={images[currentIndex].alt || 'Изображение товара'}
              className="fullscreen-image"
            />
            
            <button className="fullscreen-nav-button prev" onClick={prevImage}>
              <ChevronLeftIcon className="fullscreen-nav-icon" />
            </button>
            <button className="fullscreen-nav-button next" onClick={nextImage}>
              <ChevronRightIcon className="fullscreen-nav-icon" />
            </button>
            
            <button className="fullscreen-close-button" onClick={handleCloseFullscreen}>
              <XMarkIcon className="fullscreen-close-icon" />
            </button>
            
            <div className="fullscreen-indicator">
              <span className="fullscreen-counter">
                {currentIndex + 1} / {images.length}
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}); 