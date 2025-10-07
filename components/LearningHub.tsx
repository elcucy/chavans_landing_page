import React from 'react';

const ResourcesSection: React.FC = () => {
  return (
    <section id="resources">
      <h2>Resources & Learning</h2>
      <p className="lead" style={{color:'var(--muted)'}}>Actionable case studies, technical guides and interactive workshops.</p>
      <div className="cards">
        <div className="card"><h3>Case Studies</h3><p>Real-world success stories with measurable outcomes.</p></div>
        <div className="card"><h3>Webinars & Workshops</h3><p>On-demand sessions and upcoming events.</p></div>
        <div className="card"><h3>Whitepapers</h3><p>Architectural patterns, security playbooks and best practices.</p></div>
      </div>
    </section>
  );
};

export default ResourcesSection;
