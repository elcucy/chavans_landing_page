import React from 'react';

const InfrastructureSection: React.FC = () => {
  return (
    <section id="infra">
      <h2>Infrastructure & Cloud</h2>
      <p className="lead" style={{color:'var(--muted)'}}>Robust, secure, and scalable architecture — public, hybrid, and multi-cloud.</p>
      <div className="cards">
        <div className="card"><h3>Cloud Migration</h3><p>Lift-and-modernize strategies for minimal disruption.</p></div>
        <div className="card"><h3>Hybrid & Multi-Cloud</h3><p>Vendor-agnostic, resilient designs.</p></div>
        <div className="card"><h3>Infra Automation</h3><p>IaC, CI/CD and automated operations.</p></div>
      </div>
    </section>
  );
};

export default InfrastructureSection;