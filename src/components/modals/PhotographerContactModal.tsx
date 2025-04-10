import React, { useState, useEffect } from 'react';
import { submitPhotographerContactForm } from '../../services/api';

const PhotographerContactModal: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [photographerName, setPhotographerName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');

  useEffect(() => {
    // Close modal when clicking outside
    const modal = document.getElementById('photographer-contact-modal');
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

  // Add effect to update photographer name when it changes in the DOM
  useEffect(() => {
    const nameSpan = document.getElementById('photographer-contact-name');
    if (nameSpan) {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'characterData' || mutation.type === 'childList') {
            setPhotographerName(nameSpan.textContent || '');
          }
        });
      });
      
      observer.observe(nameSpan, { 
        characterData: true, 
        childList: true,
        subtree: true 
      });
      
      // Initial value
      setPhotographerName(nameSpan.textContent || '');
      
      return () => observer.disconnect();
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id.replace('contact-', '')]: value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');
    setMessageType('');
    
    try {
      // Use the API service to submit the form
      const response = await submitPhotographerContactForm({
        ...formData,
        photographer: photographerName
      });
      
      if (response.success) {
        // Reset form
        setFormData({
          name: '',
          email: '',
          message: ''
        });
        setSubmitMessage(response.message);
        setMessageType('success');
        
        // Close modal after a delay
        setTimeout(() => {
          const modal = document.getElementById('photographer-contact-modal');
          if (modal) {
            modal.style.display = 'none';
          }
          setSubmitMessage('');
        }, 2000);
      } else {
        setSubmitMessage('Failed to send message. Please try again.');
        setMessageType('error');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitMessage('An error occurred. Please try again later.');
      setMessageType('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="photographer-contact-modal" className="modal">
      <div className="modal-content">
        <span className="close-modal">&times;</span>
        <h2>Contact <span id="photographer-contact-name">{photographerName}</span></h2>
        {submitMessage && (
          <div className={`notification ${messageType}`}>
            {submitMessage}
          </div>
        )}
        <form id="photographer-contact-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="contact-name">Your Name</label>
            <input 
              type="text" 
              id="contact-name" 
              value={formData.name}
              onChange={handleChange}
              required 
              disabled={isSubmitting}
            />
          </div>
          <div className="form-group">
            <label htmlFor="contact-email">Your Email</label>
            <input 
              type="email" 
              id="contact-email" 
              value={formData.email}
              onChange={handleChange}
              required 
              disabled={isSubmitting}
            />
          </div>
          <div className="form-group">
            <label htmlFor="contact-message">Message</label>
            <textarea 
              id="contact-message" 
              rows={5} 
              value={formData.message}
              onChange={handleChange}
              required
              disabled={isSubmitting}
            ></textarea>
          </div>
          <button 
            type="submit" 
            className="btn primary-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PhotographerContactModal;