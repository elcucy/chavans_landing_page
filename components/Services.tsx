import React from 'react';

const ServicesSection: React.FC = () => {
  return (
    <section id="services">
      <h2>Services</h2>
      <p className="lead" style={{color:'var(--muted)'}}>Full lifecycle services — plan, build and operate so your teams can focus on outcomes.</p>
      <div className="cards">
        <div className="card"><h3>Professional Services</h3><p>Cloud migration, app modernization, data & AI consulting.</p></div>
        <div className="card"><h3>Managed Services</h3><p>Monitoring, incident management, cost governance, backup & DR.</p></div>
        <div className="card"><h3>Educational Services</h3><p>Training, Innovation Lab and enterprise upskilling programs.</p></div>
      </div>
    </section>
  );
};

export default ServicesSection;
