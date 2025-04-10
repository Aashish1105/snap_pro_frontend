import React, { useState, useEffect } from 'react';
import { getCurrentUser } from '../../services/authApi';
import { sendContactEmail } from '../../services/contactApi';

interface ContactFormProps {
  photographerName: string;
  photographerEmail?: string;
  onClose: () => void;
}

const ContactForm: React.FC<ContactFormProps> = ({ 
  photographerName, 
  photographerEmail = 'info@snappro.com', 
  onClose 
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Pre-fill user data if logged in
  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await sendContactEmail({
        name,
        email,
        message,
        photographerName,
        photographerEmail
      });
      
      setSuccess(true);
      
      // Reset form after 3 seconds and close
      setTimeout(() => {
        onClose();
      }, 3000);
      
    } catch (err: any) {
      setError(err.message || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-form-container">
      {success ? (
        <div className="success-message">
          <i className="fas fa-check-circle"></i>
          <h3>Message Sent!</h3>
          <p>Your message has been sent to {photographerName}. They will contact you soon.</p>
        </div>
      ) : (
        <>
          <h2>Contact {photographerName}</h2>
          {error && <div className="error-message">{error}</div>}
          
          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-group">
              <label htmlFor="name">Your Name</label>
              <input 
                type="text" 
                id="name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required 
                disabled={loading}
                className="form-control"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Your Email</label>
              <input 
                type="email" 
                id="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                disabled={loading}
                className="form-control"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea 
                id="message" 
                rows={5} 
                value={message} 
                onChange={(e) => setMessage(e.target.value)} 
                required 
                disabled={loading}
                className="form-control"
                placeholder={`Hi ${photographerName}, I'm interested in your photography services...`}
              ></textarea>
            </div>
            
            <div className="form-actions">
              <button 
                type="button" 
                className="btn secondary-btn" 
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn primary-btn" 
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default ContactForm;