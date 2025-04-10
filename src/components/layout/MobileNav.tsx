import React from 'react';

const MobileNav: React.FC = () => {
  return (
    <div className="mobile-nav">
      <ul>
        <li><a href="#home">Home</a></li>
        <li><a href="#photographers">Photographers</a></li>
        <li><a href="#gallery">Gallery</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>
    </div>
  );
};

export default MobileNav;