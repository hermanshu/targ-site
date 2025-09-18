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



  const nextImage = useCallback(() => {

    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length, currentIndex]);

  const prevImage = useCallback(() => {

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
    <div className="w-full flex flex-col items-center">
      {/* Основное фото */}
      <div className="relative w-full aspect-square max-w-xs bg-gray-100 rounded-lg overflow-hidden shadow-md flex items-center justify-center mx-auto z-20">
        {images.length > 0 ? (
          <img 
            src={images[currentIndex].src}
            alt={images[currentIndex].alt || 'Фото'}
            className="object-contain w-full h-full cursor-pointer transition-transform duration-200 hover:scale-105 mx-auto"
            onClick={handleImageClick}
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 text-4xl bg-gray-50">
            <div>📷</div>
            <span className="text-base mt-2">Нет фото</span>
          </div>
        )}
        {/* Стрелки навигации */}
        {images.length > 1 && (
          <>
            <button 
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow hover:bg-white z-30"
              onClick={(e) => { e.stopPropagation(); prevImage(); }}
            >
              <ChevronLeftIcon className="w-6 h-6 text-gray-700" />
            </button>
            <button 
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow hover:bg-white z-30"
              onClick={(e) => { e.stopPropagation(); nextImage(); }}
            >
              <ChevronRightIcon className="w-6 h-6 text-gray-700" />
            </button>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/60 text-white text-xs rounded-full px-3 py-1 z-30">
              {currentIndex + 1} / {images.length}
            </div>
          </>
        )}
      </div>
      {/* Миниатюры */}
      {images.length > 1 && (
        <div className="flex gap-2 mt-2">
          {images.map((img, idx) => (
            <img
              key={idx}
              src={img.src}
              alt={img.alt || 'thumb'}
              className={`w-14 h-14 object-cover rounded-md border-2 cursor-pointer transition-all duration-150 ${idx === currentIndex ? 'border-indigo-500' : 'border-transparent'} hover:border-indigo-400`}
              onClick={() => setCurrentIndex(idx)}
            />
          ))}
        </div>
      )}
      {/* Полноэкранный просмотр */}
      {showFullscreen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50" onClick={handleCloseFullscreen}>
          <div className="relative max-w-3xl w-full h-full flex items-center justify-center" onClick={e => e.stopPropagation()}>
            <img 
              src={images[currentIndex].src}
              alt={images[currentIndex].alt || 'Фото'}
              className="max-h-[90vh] max-w-full object-contain mx-auto"
            />
            <button className="absolute top-4 right-4 bg-white/80 rounded-full p-2" onClick={handleCloseFullscreen}>
              <XMarkIcon className="w-7 h-7 text-gray-700" />
            </button>
            {images.length > 1 && (
              <>
                <button className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2" onClick={prevImage}>
                  <ChevronLeftIcon className="w-7 h-7 text-gray-700" />
                </button>
                <button className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2" onClick={nextImage}>
                  <ChevronRightIcon className="w-7 h-7 text-gray-700" />
                </button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white text-xs rounded-full px-4 py-2">
                  {currentIndex + 1} / {images.length}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
});