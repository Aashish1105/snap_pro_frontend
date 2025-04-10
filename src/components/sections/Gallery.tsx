import React, { useState, useEffect } from 'react';
import { fetchGalleryItems, addGalleryItem } from '../../services/galleryApi';
import { getCurrentUser } from '../../services/authApi';
import ContactForm from '../modals/ContactForm';

// Define interface for gallery image
interface GalleryImage {
  _id: string;
  id: number;
  category: string;
  src: string;
  alt: string;
  photographer: string;
}

// New gallery item form state
interface NewGalleryItem {
  category: string;
  src: string;
  alt: string;
  photographer: string;
}

const Gallery: React.FC = () => {
  const [filter, setFilter] = useState('all');
  const [filteredImages, setFilteredImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [newGalleryItem, setNewGalleryItem] = useState<NewGalleryItem>({
    category: 'wedding',
    src: '',
    alt: '',
    photographer: ''
  });
  const [selectedPhotographer, setSelectedPhotographer] = useState('');
  const [showContactForm, setShowContactForm] = useState(false);

  // Check if user is admin
  useEffect(() => {
    const user = getCurrentUser();
    console.log('Current user:', user); // Debug: Log the user object
    
    if (user && user.role === 'admin') {
      console.log('User is admin, setting isAdmin to true'); // Debug: Confirm admin role
      setIsAdmin(true);
    } else {
      console.log('User is not admin or not logged in:', user?.role); // Debug: Log why not admin
    }
  }, []);

  // Fetch images when component mounts
  useEffect(() => {
    const loadGalleryImages = async () => {
      try {
        setLoading(true);
        const data = await fetchGalleryItems(filter);
        setFilteredImages(data);
        setLoading(false);
      } catch (err) {
        console.error('Error loading gallery images:', err);
        setError('Failed to load gallery images');
        setLoading(false);
      }
    };

    loadGalleryImages();
  }, [filter]);

  const handleFilterClick = (newFilter: string) => {
    setFilter(newFilter);
  };

  // Open add gallery item modal
  const openAddGalleryModal = () => {
    const modal = document.getElementById('add-gallery-modal');
    if (modal) {
      modal.style.display = 'block';
    }
  };

  // Close add gallery item modal
  const closeAddGalleryModal = () => {
    const modal = document.getElementById('add-gallery-modal');
    if (modal) {
      modal.style.display = 'none';
    }
    // Reset form
    setNewGalleryItem({
      category: 'wedding',
      src: '',
      alt: '',
      photographer: ''
    });
  };

  // Handle input change for new gallery item form
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewGalleryItem({
      ...newGalleryItem,
      [name]: value
    });
  };

  // Submit new gallery item
  const handleSubmitGalleryItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await addGalleryItem(newGalleryItem);
      if (response) {
        // Add new gallery item to the list if it matches the current filter
        if (filter === 'all' || filter === response.category) {
          setFilteredImages([...filteredImages, response]);
        }
        closeAddGalleryModal();
      }
    } catch (err) {
      console.error('Error adding gallery item:', err);
    }
  };

  const openLightbox = (imageSrc: string, allImages: string[], photographer: string) => {
    const lightboxImg = document.getElementById('lightbox-img') as HTMLImageElement;
    const photographerInfo = document.getElementById('lightbox-photographer-info');
    
    if (lightboxImg && photographerInfo) {
      lightboxImg.src = imageSrc;
      
      // Store all images for navigation
      lightboxImg.dataset.allImages = JSON.stringify(allImages);
      lightboxImg.dataset.currentIndex = allImages.indexOf(imageSrc).toString();
      
      // Display photographer info
      photographerInfo.innerHTML = `
        <span class="photographer-name">
          <i class="fas fa-camera"></i> ${photographer}
        </span>
        <button 
          class="contact-btn"
          onclick="document.getElementById('contact-modal').style.display='block'; 
                  document.getElementById('lightbox-modal').style.display='none';"
        >
          Contact Photographer
        </button>
      `;
      
      // Set selected photographer for contact form
      setSelectedPhotographer(photographer);
      
      // Show the lightbox
      const lightboxModal = document.getElementById('lightbox-modal');
      if (lightboxModal) {
        lightboxModal.style.display = 'block';
      }
    }
  };

  // Open contact form modal
  const openContactForm = (photographerName: string) => {
    setSelectedPhotographer(photographerName);
    setShowContactForm(true);
    
    const modal = document.getElementById('contact-modal');
    if (modal) {
      modal.style.display = 'block';
    }
  };

  // Close contact form modal
  const closeContactForm = () => {
    setShowContactForm(false);
    
    const modal = document.getElementById('contact-modal');
    if (modal) {
      modal.style.display = 'none';
    }
  };

  return (
    <section id="gallery" className="gallery">
      <div className="container">
        <div className="section-header">
          <h2>Photo Gallery</h2>
          {isAdmin && (
            <button 
              className="btn primary-btn add-gallery-btn" 
              onClick={openAddGalleryModal}
            >
              <i className="fas fa-plus"></i> Add Gallery Item
            </button>
          )}
        </div>
        <div className="filter-buttons">
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`} 
            onClick={() => handleFilterClick('all')}
          >
            All
          </button>
          <button 
            className={`filter-btn ${filter === 'wedding' ? 'active' : ''}`} 
            onClick={() => handleFilterClick('wedding')}
          >
            Wedding
          </button>
          <button 
            className={`filter-btn ${filter === 'portrait' ? 'active' : ''}`} 
            onClick={() => handleFilterClick('portrait')}
          >
            Portrait
          </button>
          <button 
            className={`filter-btn ${filter === 'landscape' ? 'active' : ''}`} 
            onClick={() => handleFilterClick('landscape')}
          >
            Landscape
          </button>
          <button 
            className={`filter-btn ${filter === 'event' ? 'active' : ''}`} 
            onClick={() => handleFilterClick('event')}
          >
            Event
          </button>
          <button 
            className={`filter-btn ${filter === 'fashion' ? 'active' : ''}`} 
            onClick={() => handleFilterClick('fashion')}
          >
            Fashion
          </button>
        </div>
        
        {loading ? (
          <div className="loading-spinner">Loading...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : (
          <div id="gallery-grid" className="gallery-grid">
            {filteredImages.length > 0 ? (
              filteredImages.map(image => (
                <div 
                  key={image._id || image.id} 
                  className="gallery-item" 
                  data-src={image.src}
                  data-id={image.id}
                >
                  <img 
                    src={image.src} 
                    alt={image.alt} 
                    onClick={() => openLightbox(image.src, filteredImages.map(img => img.src), image.photographer)}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://via.placeholder.com/400x300?text=Image';
                    }}
                  />
                  <div className="gallery-overlay" onClick={() => openLightbox(image.src, filteredImages.map(img => img.src), image.photographer)}>
                    <i className="fas fa-search-plus"></i>
                  </div>
                  <div className="gallery-info">
                    <div className="photographer-info">
                      <span className="photographer-name">
                        <i className="fas fa-camera"></i> {image.photographer}
                      </span>
                      <button 
                        className="contact-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          openContactForm(image.photographer);
                        }}
                      >
                        Contact
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-images">No images found for this category</div>
            )}
          </div>
        )}
      </div>

      {/* Add Gallery Item Modal */}
      <div id="add-gallery-modal" className="modal">
        <div className="modal-content">
          <span className="close" onClick={closeAddGalleryModal}>&times;</span>
          <h2>Add New Gallery Item</h2>
          <form onSubmit={handleSubmitGalleryItem}>
            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select 
                id="category" 
                name="category"
                value={newGalleryItem.category} 
                onChange={handleInputChange} 
                required
              >
                <option value="wedding">Wedding</option>
                <option value="portrait">Portrait</option>
                <option value="landscape">Landscape</option>
                <option value="event">Event</option>
                <option value="fashion">Fashion</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="src">Image URL</label>
              <input 
                type="url" 
                id="src" 
                name="src"
                value={newGalleryItem.src} 
                onChange={handleInputChange} 
                required 
              />
              {newGalleryItem.src && (
                <div className="image-preview">
                  <img 
                    src={newGalleryItem.src} 
                    alt="Preview" 
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://via.placeholder.com/400x300?text=Invalid+Image+URL';
                    }}
                  />
                </div>
              )}
            </div>
            
            <div className="form-group">
              <label htmlFor="alt">Image Description</label>
              <input 
                type="text" 
                id="alt" 
                name="alt"
                value={newGalleryItem.alt} 
                onChange={handleInputChange} 
                required 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="photographer">Photographer Name</label>
              <input 
                type="text" 
                id="photographer" 
                name="photographer"
                value={newGalleryItem.photographer} 
                onChange={handleInputChange} 
                required 
              />
            </div>
            
            <button type="submit" className="btn primary-btn">Add Gallery Item</button>
          </form>
        </div>
      </div>

      {/* Contact Form Modal */}
      <div id="contact-modal" className="modal">
        <div className="modal-content">
          <span className="close" onClick={closeContactForm}>&times;</span>
          {showContactForm && (
            <ContactForm 
              photographerName={selectedPhotographer} 
              onClose={closeContactForm} 
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default Gallery;

// Add this to your JSX where the lightbox modal is defined
<div id="lightbox-modal" className="modal">
  <div className="modal-content">
    <span className="close" onClick={() => {
      const modal = document.getElementById('lightbox-modal');
      if (modal) modal.style.display = 'none';
    }}>&times;</span>
    <div className="lightbox-container">
      <img id="lightbox-img" src="" alt="Lightbox" />
      <div id="lightbox-photographer-info" className="photographer-info"></div>
    </div>
  </div>
</div>