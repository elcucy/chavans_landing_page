import React from 'react';

const AISection: React.FC = () => {
  return (
    <section id="ai">
      <h2>AI & Intelligence</h2>
      <p className="lead" style={{color:'var(--muted)'}}>Turn data into outcomes — model development, MLOps, and analytics that scale.</p>
      <div className="cards">
        <div className="card"><h3>Model Development</h3><p>Custom ML & AI engineering to solve business workflows.</p></div>
        <div className="card"><h3>MLOps & Deployment</h3><p>Production-ready pipelines, monitoring and retraining.</p></div>
        <div className="card"><h3>AI Integration</h3><p>Embed intelligence into apps and automation flows.</p></div>
      </div>
    </section>
  );
};

export default AISection;
