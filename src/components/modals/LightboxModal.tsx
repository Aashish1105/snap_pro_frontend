import React, { useEffect } from 'react';

const LightboxModal: React.FC = () => {
  useEffect(() => {
    // Close modal when clicking outside
    const modal = document.getElementById('lightbox-modal');
    const closeBtn = modal?.querySelector('.close-modal');
    
    const closeModal = () => {
      if (modal) {
        modal.style.display = 'none';
      }
    };
    
    closeBtn?.addEventListener('click', closeModal);
    
    window.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });
    
    return () => {
      closeBtn?.removeEventListener('click', closeModal);
      window.removeEventListener('click', closeModal);
    };
  }, []);

  const navigateLightbox = (direction: 'prev' | 'next') => {
    const lightboxImg = document.getElementById('lightbox-img') as HTMLImageElement;
    if (!lightboxImg || !lightboxImg.dataset.allImages) return;
    
    const allImages = JSON.parse(lightboxImg.dataset.allImages);
    let currentIndex = parseInt(lightboxImg.dataset.currentIndex || '0');
    
    // Calculate new index
    if (direction === 'next') {
      currentIndex = (currentIndex + 1) % allImages.length;
    } else {
      currentIndex = (currentIndex - 1 + allImages.length) % allImages.length;
    }
    
    // Update image and index
    lightboxImg.src = allImages[currentIndex];
    lightboxImg.dataset.currentIndex = currentIndex.toString();
  };

  return (
    <div id="lightbox-modal" className="modal lightbox-modal">
      <div className="modal-content lightbox-content">
        <span className="close-modal">&times;</span>
        <div className="lightbox-container">
          <button className="lightbox-nav prev-btn" onClick={() => navigateLightbox('prev')}>
            <i className="fas fa-chevron-left"></i>
          </button>
          <div className="lightbox-img-container">
            <img id="lightbox-img" src="" alt="Lightbox image" />
          </div>
          <button className="lightbox-nav next-btn" onClick={() => navigateLightbox('next')}>
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LightboxModal;