import React from 'react';

const QuickFeatureBar: React.FC = () => {
    const scrollTo = (id: string) => {
        const el = document.getElementById(id);
        if(!el) return;
        el.scrollIntoView({behavior:'smooth', block:'start'});
        window.scrollBy(0,-84); // offset for sticky header
      }

  return (
    <div className="feature-band">
        <div className="feature-row">
            <div className="pill" onClick={() => scrollTo('ai')}><div><strong className="title">AI & Intelligence</strong><div className="sub">Model dev · MLOps · AI apps</div></div></div>
            <div className="pill" onClick={() => scrollTo('infra')}><div><strong className="title">Infrastructure</strong><div className="sub">Cloud & hybrid architecture</div></div></div>
            <div className="pill" onClick={() => scrollTo('security')}><div><strong className="title">Security</strong><div className="sub">SOC · GRC · Incident response</div></div></div>
            <div className="pill" onClick={() => scrollTo('services')}><div><strong className="title">Services</strong><div className="sub">Consulting · Professional · Managed</div></div></div>
            <div className="pill" onClick={() => scrollTo('resources')}><div><strong className="title">Resources</strong><div className="sub">Case studies · Webinars</div></div></div>
        </div>
    </div>
  );
};

export default QuickFeatureBar;