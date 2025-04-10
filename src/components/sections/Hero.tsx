import React from 'react';

const Hero: React.FC = () => {
  return (
    <section id="home" className="hero">
      <div className="container">
        <h1>Discover Amazing Photographers</h1>
        <p>Find the perfect photographer for your next project</p>
        <a href="#photographers" className="btn primary-btn">Explore Now</a>
      </div>
    </section>
  );
};

export default Hero;