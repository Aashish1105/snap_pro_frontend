import React, { useState } from 'react';

interface HeaderProps {
  toggleTheme: () => void;
  isLoggedIn: boolean;
  username: string;
  setIsLoggedIn: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleTheme, isLoggedIn, username, setIsLoggedIn }) => {
  const [mobileNavActive, setMobileNavActive] = useState(false);

  const toggleMobileNav = () => {
    setMobileNavActive(!mobileNavActive);
    const mobileNav = document.querySelector('.mobile-nav');
    if (mobileNav) {
      mobileNav.classList.toggle('active');
    }
  };

  const handleLoginClick = () => {
    const authModal = document.getElementById('auth-modal');
    if (authModal) {
      authModal.style.display = 'block';
      // Set to login tab
      const loginTab = document.getElementById('login-tab');
      if (loginTab) {
        loginTab.click();
      }
    }
  };

  const handleSignupClick = () => {
    const authModal = document.getElementById('auth-modal');
    if (authModal) {
      authModal.style.display = 'block';
      // Set to signup tab
      const signupTab = document.getElementById('signup-tab');
      if (signupTab) {
        signupTab.click();
      }
    }
  };

  const handleLogout = () => {
    setIsLoggedIn();
  };

  return (
    <header>
      <div className="container">
        <div className="logo">
          <h1>SnapPro</h1>
        </div>
        <nav className="desktop-nav">
          <ul>
            <li><a href="#home">Home</a></li>
            <li><a href="#photographers">Photographers</a></li>
            <li><a href="#gallery">Gallery</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </nav>
        <div className="nav-controls">
          <button id="theme-toggle" aria-label="Toggle dark/light mode" onClick={toggleTheme}>
            <i className="fas fa-moon"></i>
          </button>
          {!isLoggedIn ? (
            <div className="auth-buttons">
              <button id="login-btn" className="login-btn" onClick={handleLoginClick}>Login</button>
              <button id="signup-btn" className="signup-btn" onClick={handleSignupClick}>Sign Up</button>
            </div>
          ) : (
            <div id="user-profile" className="user-profile">
              <span id="username">{username}</span>
              <button id="logout-btn" onClick={handleLogout}>Logout</button>
            </div>
          )}
          <button className="hamburger" aria-label="Menu" onClick={toggleMobileNav}>
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;