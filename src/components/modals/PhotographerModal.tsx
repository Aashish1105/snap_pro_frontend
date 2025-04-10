import React, { useEffect } from 'react';

const PhotographerModal: React.FC = () => {
  useEffect(() => {
    // Close modal when clicking outside
    const modal = document.getElementById('photographer-modal');
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

  return (
    <div id="photographer-modal" className="modal">
      <div className="modal-content">
        <span className="close-modal">&times;</span>
        <div id="photographer-details" className="photographer-details">
          {/* Content will be dynamically inserted by the Photographers component */}
        </div>
      </div>
    </div>
  );
};

export default PhotographerModal;