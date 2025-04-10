import React, { useState } from 'react';
import { submitContactForm } from '../../services/api';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');
    setMessageType('');
    
    try {
      // Use the API service to submit the form
      const response = await submitContactForm(formData);
      
      if (response.success) {
        // Reset form
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
        setSubmitMessage(response.message);
        setMessageType('success');
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
    <section id="contact" className="contact-section">
      <div className="container">
        <div className="section-header">
          <h2>Get In Touch</h2>
        </div>
        {submitMessage && (
          <div className={`notification ${messageType}`}>
            {submitMessage}
          </div>
        )}
        <form id="contact-form" className="contact-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input 
              type="text" 
              id="name" 
              name="name" 
              value={formData.name}
              onChange={handleChange}
              required 
              disabled={isSubmitting}
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              value={formData.email}
              onChange={handleChange}
              required 
              disabled={isSubmitting}
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label htmlFor="subject">Subject</label>
            <input 
              type="text" 
              id="subject" 
              name="subject" 
              value={formData.subject}
              onChange={handleChange}
              required 
              disabled={isSubmitting}
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea 
              id="message" 
              name="message" 
              rows={5} 
              value={formData.message}
              onChange={handleChange}
              required
              disabled={isSubmitting}
              className="form-control"
            ></textarea>
          </div>
          <button 
            type="submit" 
            className="btn primary-btn submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      </div>
    </section>
  );
};

export default Contact;