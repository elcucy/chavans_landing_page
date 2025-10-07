import React from 'react';

const Hero: React.FC<{ openModal: () => void }> = ({ openModal }) => {
  return (
    <section className="hero" aria-label="hero">
      <div style={{maxWidth:'1000px',margin:'0 auto',padding:'0 20px'}}>
        <h1>Empowering Digital Evolution—<br/>One Intelligent Solution at a Time.</h1>
        <p className="lead">We architect, build, and manage secure cloud and AI platforms that accelerate business outcomes.</p>
        <div className="hero-cta">
          <button className="btn">Discover Our Solutions</button>
          <button className="btn" style={{background:'transparent',color:'#fff',border:'1px solid rgba(255,255,255,.25)'}} onClick={openModal}>Talk to an Expert</button>
        </div>
      </div>
    </section>
  );
};

export default Hero;