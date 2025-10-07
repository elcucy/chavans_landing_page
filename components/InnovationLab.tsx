import React from 'react';

const SecuritySection: React.FC = () => {
  return (
    <section id="security">
      <h2>Security & Compliance</h2>
      <p className="lead" style={{color:'var(--muted)'}}>Security-first engineering with monitoring, governance, and incident readiness.</p>
      <div className="cards">
        <div className="card"><h3>Security Architecture</h3><p>Zero trust, secure-by-design platforms.</p></div>
        <div className="card"><h3>SOC & Monitoring</h3><p>24×7 security operations and alerts.</p></div>
        <div className="card"><h3>GRC & Pen-testing</h3><p>Compliance frameworks and vulnerability testing.</p></div>
      </div>
    </section>
  );
};

export default SecuritySection;
