import React, { useState, useEffect } from 'react';
import Header from './components/layout/Header';
import Hero from './components/sections/Hero';
import Photographers from './components/sections/Photographers';
import Gallery from './components/sections/Gallery';
import Contact from './components/sections/Contact';
import Footer from './components/layout/Footer';
import AuthModal from './components/modals/AuthModal';
import PhotographerModal from './components/modals/PhotographerModal';
import PhotographerContactModal from './components/modals/PhotographerContactModal';
import LightboxModal from './components/modals/LightboxModal';
import { isAuthenticated, getCurrentUser, logoutUser } from './services/authApi';
import './css/style.css';
import './css/darkmode.css';
import './css/responsive.css';
import './css/photographers.css';

const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = () => {
      const authenticated = isAuthenticated();
      if (authenticated) {
        const user = getCurrentUser();
        if (user) {
          setIsLoggedIn(true);
          setUsername(user.name);
        }
      }
    };

    checkAuth();
  }, []);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle('dark-mode');
  };

  const handleLogout = () => {
    logoutUser();
    setIsLoggedIn(false);
    setUsername('');
  };

  return (
    <div className={`app ${darkMode ? 'dark-mode' : ''}`}>
      <Header 
        toggleTheme={toggleTheme} 
        isLoggedIn={isLoggedIn} 
        username={username} 
        setIsLoggedIn={handleLogout} 
      />
      <main>
        <Hero />
        <Photographers />
        <Gallery />
        <Contact />
      </main>
      <Footer />
      
      {/* Modals */}
      <AuthModal setIsLoggedIn={setIsLoggedIn} setUsername={setUsername} />
      <PhotographerModal />
      <PhotographerContactModal />
      <LightboxModal />
    </div>
  );
};

export default App;
