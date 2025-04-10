import React, { useState, useEffect } from 'react';
import { fetchPhotographers, getPhotographerById, addPhotographer } from '../../services/photographerApi';
import { getCurrentUser } from '../../services/authApi';
import ContactForm from '../modals/ContactForm'; // Add this import

// Helper functions
const capitalizeFirstLetter = (string: string): string => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const truncateText = (text: string, maxLength: number): string => {
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};

// Define interface for photographer
interface Photographer {
  _id: string;
  id: number;
  name: string;
  specialization: string;
  bio: string;
  image: string;
  location: string;
  experience: number;
  projects: number;
  hourlyRate: number;
  portfolio: string[];
}

// New photographer form state
interface NewPhotographer {
  name: string;
  specialization: string;
  bio: string;
  image: string;
  location: string;
  experience: number;
  projects: number;
  hourlyRate: number;
  portfolio: string[];
}

const Photographers: React.FC = () => {
  const [filter, setFilter] = useState('all');
  const [photographers, setPhotographers] = useState<Photographer[]>([]);
  const [filteredPhotographers, setFilteredPhotographers] = useState<Photographer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [newPortfolioLink, setNewPortfolioLink] = useState('');
  const [selectedPhotographer, setSelectedPhotographer] = useState<string>('');
  const [showContactForm, setShowContactForm] = useState(false);
  const [newPhotographer, setNewPhotographer] = useState<NewPhotographer>({
    name: '',
    specialization: 'wedding',
    bio: '',
    image: '',
    location: '',
    experience: 0,
    projects: 0,
    hourlyRate: 0,
    portfolio: []
  });

  // Check if user is admin
  useEffect(() => {
    const user = getCurrentUser();
    if (user && user.role === 'admin') {
      setIsAdmin(true);
    }
  }, []);

  // Fetch photographers when component mounts
  useEffect(() => {
    const loadPhotographers = async () => {
      try {
        setLoading(true);
        const data = await fetchPhotographers();
        setPhotographers(data);
        setLoading(false);
      } catch (err) {
        console.error('Error loading photographers:', err);
        setError('Failed to load photographers');
        setLoading(false);
      }
    };

    loadPhotographers();
  }, []);

  // Filter photographers based on selected filter
  useEffect(() => {
    if (filter === 'all') {
      setFilteredPhotographers(photographers);
    } else {
      setFilteredPhotographers(photographers.filter(p => p.specialization === filter));
    }
  }, [filter, photographers]);

  const handleFilterClick = (newFilter: string) => {
    setFilter(newFilter);
  };

  // Open add photographer modal
  const openAddPhotographerModal = () => {
    const modal = document.getElementById('add-photographer-modal');
    if (modal) {
      modal.style.display = 'block';
    }
  };

  // Close add photographer modal
  const closeAddPhotographerModal = () => {
    const modal = document.getElementById('add-photographer-modal');
    if (modal) {
      modal.style.display = 'none';
    }
    // Reset form
    setNewPhotographer({
      name: '',
      specialization: 'wedding',
      bio: '',
      image: '',
      location: '',
      experience: 0,
      projects: 0,
      hourlyRate: 0,
      portfolio: []
    });
    setNewPortfolioLink('');
  };

  // Handle input change for new photographer form
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewPhotographer({
      ...newPhotographer,
      [name]: name === 'experience' || name === 'projects' || name === 'hourlyRate' 
        ? parseInt(value) || 0 
        : value
    });
  };

  // Add portfolio link
  const addPortfolioLink = () => {
    if (newPortfolioLink.trim() !== '') {
      setNewPhotographer({
        ...newPhotographer,
        portfolio: [...newPhotographer.portfolio, newPortfolioLink.trim()]
      });
      setNewPortfolioLink('');
    }
  };

  // Remove portfolio link
  const removePortfolioLink = (index: number) => {
    const updatedPortfolio = [...newPhotographer.portfolio];
    updatedPortfolio.splice(index, 1);
    setNewPhotographer({
      ...newPhotographer,
      portfolio: updatedPortfolio
    });
  };

  // Submit new photographer
  const handleSubmitPhotographer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await addPhotographer(newPhotographer);
      if (response) {
        // Add new photographer to the list
        setPhotographers([...photographers, response]);
        closeAddPhotographerModal();
      }
    } catch (err) {
      console.error('Error adding photographer:', err);
    }
  };

  const openPhotographerModal = async (photographerId: number) => {
    try {
      // Find the photographer in the already loaded data instead of making another API call
      // This is more reliable since we already have the data
      const photographer = filteredPhotographers.find(p => p.id === photographerId);
      if (!photographer) return;
      
      const photographerDetails = document.getElementById('photographer-details');
      if (!photographerDetails) return;
      
      photographerDetails.innerHTML = `
        <div class="photographer-profile">
          <div class="photographer-profile-img">
            <img src="${photographer.image}" alt="${photographer.name}" onerror="this.src='https://via.placeholder.com/300x300?text=Photographer'">
          </div>
          <div class="photographer-profile-info">
            <h2>${photographer.name}</h2>
            <span class="photographer-profile-tag">${capitalizeFirstLetter(photographer.specialization)}</span>
            <p class="photographer-profile-bio">${photographer.bio}</p>
            <p><i class="fas fa-map-marker-alt"></i> ${photographer.location}</p>
            
            <div class="photographer-stats">
              <div class="stat-item">
                <div class="stat-value">${photographer.experience}</div>
                <div class="stat-label">Years</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">${photographer.projects}</div>
                <div class="stat-label">Projects</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">$${photographer.hourlyRate}</div>
                <div class="stat-label">Per Hour</div>
              </div>
            </div>
            
            <button class="btn primary-btn contact-photographer-btn" data-id="${photographer.id}">Contact Photographer</button>
          </div>
        </div>
        
        <div class="photographer-portfolio">
          <h3>Portfolio</h3>
          <div class="portfolio-grid">
            ${photographer.portfolio && photographer.portfolio.length > 0 
              ? photographer.portfolio.map((image: string) => `
                <div class="portfolio-item" data-src="${image}">
                  <img src="${image}" alt="Portfolio image" onerror="this.src='https://via.placeholder.com/150x150?text=Image'">
                </div>
              `).join('') 
              : '<p>No portfolio images available</p>'
            }
          </div>
        </div>
      `;
      
      // Show the modal
      const modal = document.getElementById('photographer-modal');
      if (modal) {
        modal.style.display = 'block';
      }
      
      // Add event listener to contact button
      const contactBtn = document.querySelector('.contact-photographer-btn');
      if (contactBtn) {
        contactBtn.addEventListener('click', function(this: HTMLElement) {
          const id = this.getAttribute('data-id');
          if (id) {
            openPhotographerContactModal(parseInt(id));
          }
        });
      }
      
      // Add event listeners to portfolio items
      document.querySelectorAll('.portfolio-item').forEach(item => {
        item.addEventListener('click', function(this: HTMLElement) {
          const imageSrc = this.getAttribute('data-src');
          if (imageSrc) {
            openLightbox(imageSrc, photographer.portfolio);
          }
        });
      });
    } catch (err) {
      console.error('Error opening photographer modal:', err);
    }
  };

  const openPhotographerContactModal = (photographerId: number) => {
    const photographer = filteredPhotographers.find(p => p.id === photographerId);
    if (!photographer) return;
    
    setSelectedPhotographer(photographer.name);
    setShowContactForm(true);
    
    const modal = document.getElementById('photographer-contact-modal');
    if (modal) {
      modal.style.display = 'block';
    }
  };
  
  // Close contact form modal
  const closeContactForm = () => {
    setShowContactForm(false);
    
    const modal = document.getElementById('photographer-contact-modal');
    if (modal) {
      modal.style.display = 'none';
    }
  };

  const openLightbox = (imageSrc: string, allImages: string[]) => {
    const lightboxImg = document.getElementById('lightbox-img') as HTMLImageElement;
    if (lightboxImg) {
      lightboxImg.src = imageSrc;
      
      // Store all images for navigation
      lightboxImg.dataset.allImages = JSON.stringify(allImages);
      lightboxImg.dataset.currentIndex = allImages.indexOf(imageSrc).toString();
      
      // Show the lightbox
      const lightboxModal = document.getElementById('lightbox-modal');
      if (lightboxModal) {
        lightboxModal.style.display = 'block';
      }
    }
  };

  return (
    <section id="photographers" className="photographers">
      <div className="container">
        <div className="section-header">
          <h2>Our Photographers</h2>
          {isAdmin && (
            <button 
              className="btn primary-btn add-photographer-btn" 
              onClick={openAddPhotographerModal}
            >
              <i className="fas fa-plus"></i> Add Photographer
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
          // Inside the return statement, let's update the photographer card structure
          <div id="photographers-grid" className="photographers-grid">
            {filteredPhotographers.length > 0 ? (
              filteredPhotographers.map(photographer => (
                <div key={photographer._id || photographer.id} className="photographer-card" data-id={photographer.id}>
                  <div className="photographer-card-inner">
                    <div className="photographer-img">
                      <img 
                        src={photographer.image} 
                        alt={photographer.name} 
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://via.placeholder.com/300x250?text=Photographer';
                        }}
                      />
                      <div className="photographer-overlay">
                        <button 
                          className="btn view-profile-btn" 
                          data-id={photographer.id}
                          onClick={() => openPhotographerModal(photographer.id)}
                        >
                          View Profile
                        </button>
                      </div>
                    </div>
                    <div className="photographer-info">
                      <div className="photographer-header">
                        <h3 className="photographer-name">{photographer.name}</h3>
                        <span className="photographer-tag">{capitalizeFirstLetter(photographer.specialization)}</span>
                      </div>
                      <div className="photographer-stats-mini">
                        <div className="stat-mini">
                          <i className="fas fa-camera"></i> {photographer.projects} Projects
                        </div>
                        <div className="stat-mini">
                          <i className="fas fa-dollar-sign"></i> ${photographer.hourlyRate}/hr
                        </div>
                      </div>
                      <p className="photographer-bio">{truncateText(photographer.bio, 80)}</p>
                      <div className="photographer-footer">
                        <span className="photographer-location">
                          <i className="fas fa-map-marker-alt"></i> {photographer.location}
                        </span>
                        <button 
                          className="contact-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            openPhotographerContactModal(photographer.id);
                          }}
                        >
                          Contact
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-photographers">No photographers found for this category</div>
            )}
          </div>
        )}
      </div>

      {/* Add Photographer Modal */}
      <div id="add-photographer-modal" className="modal">
        <div className="modal-content">
          <span className="close" onClick={closeAddPhotographerModal}>&times;</span>
          <h2>Add New Photographer</h2>
          <form onSubmit={handleSubmitPhotographer}>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input 
                type="text" 
                id="name" 
                name="name"
                value={newPhotographer.name} 
                onChange={handleInputChange} 
                required 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="specialization">Specialization</label>
              <select 
                id="specialization" 
                name="specialization"
                value={newPhotographer.specialization} 
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
              <label htmlFor="bio">Bio</label>
              <textarea 
                id="bio" 
                name="bio"
                value={newPhotographer.bio} 
                onChange={handleInputChange} 
                required 
              ></textarea>
            </div>
            
            <div className="form-group">
              <label htmlFor="image">Profile Image URL</label>
              <input 
                type="url" 
                id="image" 
                name="image"
                value={newPhotographer.image} 
                onChange={handleInputChange} 
                required 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="location">Location</label>
              <input 
                type="text" 
                id="location" 
                name="location"
                value={newPhotographer.location} 
                onChange={handleInputChange} 
                required 
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="experience">Experience (Years)</label>
                <input 
                  type="number" 
                  id="experience" 
                  name="experience"
                  value={newPhotographer.experience} 
                  onChange={handleInputChange} 
                  min="0"
                  required 
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="projects">Projects</label>
                <input 
                  type="number" 
                  id="projects" 
                  name="projects"
                  value={newPhotographer.projects} 
                  onChange={handleInputChange} 
                  min="0"
                  required 
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="hourlyRate">Hourly Rate ($)</label>
                <input 
                  type="number" 
                  id="hourlyRate" 
                  name="hourlyRate"
                  value={newPhotographer.hourlyRate} 
                  onChange={handleInputChange} 
                  min="0"
                  required 
                />
              </div>
            </div>
            
            <div className="form-group">
              <label>Portfolio Images</label>
              <div className="portfolio-links">
                {newPhotographer.portfolio.map((link, index) => (
                  <div key={index} className="portfolio-link-item">
                    <span className="portfolio-link">{link}</span>
                    <button 
                      type="button" 
                      className="remove-link-btn"
                      onClick={() => removePortfolioLink(index)}
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                ))}
              </div>
              
              <div className="add-portfolio-link">
                <input 
                  type="url" 
                  placeholder="Enter image URL" 
                  value={newPortfolioLink}
                  onChange={(e) => setNewPortfolioLink(e.target.value)}
                />
                <button 
                  type="button" 
                  className="btn secondary-btn"
                  onClick={addPortfolioLink}
                >
                  Add Link
                </button>
              </div>
            </div>
            
            <button type="submit" className="btn primary-btn">Add Photographer</button>
          </form>
        </div>
      </div>

      {/* Photographer Modal */}
      <div id="photographer-modal" className="modal">
        <div className="modal-content">
          <span className="close" onClick={() => {
            const modal = document.getElementById('photographer-modal');
            if (modal) modal.style.display = 'none';
          }}>&times;</span>
          <div id="photographer-details"></div>
        </div>
      </div>

      {/* Contact Form Modal */}
      <div id="photographer-contact-modal" className="modal">
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

      {/* Lightbox Modal */}
      <div id="lightbox-modal" className="modal">
        <div className="modal-content">
          <span className="close" onClick={() => {
            const modal = document.getElementById('lightbox-modal');
            if (modal) modal.style.display = 'none';
          }}>&times;</span>
          <div className="lightbox-container">
            <img id="lightbox-img" src="" alt="Lightbox" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Photographers;