import React, { useState, useEffect, useRef } from 'react';

// Custom hook to detect clicks outside of a referenced element
function useOnClickOutside(ref: React.RefObject<HTMLElement>, handler: () => void) {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      handler();
    };
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
}

// Sub-component for clickable accordion sections
const AccordionSection: React.FC<{ title: string; items: string[]; isActive: boolean; onToggle: () => void }> = ({ title, items, isActive, onToggle }) => {
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onToggle();
        }
    };
    return (
        <div className={`section ${isActive ? 'active' : ''}`}>
            <button className="section-title" onClick={onToggle} onKeyDown={handleKeyDown} tabIndex={0} aria-expanded={isActive}>
                {title} <span className="section-caret">▸</span>
            </button>
            <ul className="section-list">
                {items.map((item, index) => <li key={index}><a href="#">{item}</a></li>)}
            </ul>
        </div>
    );
};


// Sub-component for the top-level mobile menu category (e.g., "Services", "AI")
const MobileMenuCategory: React.FC<{ title: string; startOpen?: boolean; children: React.ReactNode }> = ({ title, startOpen = false, children }) => {
    const [isOpen, setIsOpen] = useState(startOpen);
    const hasContent = React.Children.count(children) > 0;
    return (
        <div className={`mobile-category-item ${isOpen ? 'open' : ''}`}>
            <button onClick={() => hasContent && setIsOpen(!isOpen)} className="mobile-category-title" aria-expanded={isOpen}>
                {title}
                {hasContent && <span className="accordion-icon">{isOpen ? '−' : '+'}</span>}
            </button>
            {isOpen && hasContent && <div className="mobile-category-content">{children}</div>}
        </div>
    );
};


const Header: React.FC<{ openModal: () => void }> = ({ openModal }) => {
  const [openMegaMenu, setOpenMegaMenu] = useState<string | null>(null);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  const handleNavClick = (menuId: string) => {
    setOpenMegaMenu(openMegaMenu === menuId ? null : menuId);
  };
  
  const closeAllMenus = () => {
      setOpenMegaMenu(null);
  }

  useOnClickOutside(headerRef, () => {
      closeAllMenus();
  });
  
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeAllMenus();
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, []);

  const MegaPanel: React.FC<{id: string, children: React.ReactNode}> = ({id, children}) => (
    <div id={id} className={`mega-panel ${openMegaMenu === id ? 'visible' : ''}`} role="menu" aria-hidden={openMegaMenu !== id}>
        {children}
    </div>
  );

  const ServicesMenu: React.FC<{ isMobile?: boolean, openModal: () => void }> = ({ isMobile, openModal }) => {
    const [activeConsulting, setActiveConsulting] = useState<string|null>(null);
    const [activeProfessional, setActiveProfessional] = useState<string|null>(null);
    const [activeManaged, setActiveManaged] = useState<string|null>(null);

    const consultingItems = [
      { key: 'edge', title: 'EDGE', items: ['Edge adoption roadmap', 'Edge infra planning', 'AI at the edge'] },
      { key: 'app', title: 'APP & AGENTS', items: ['Legacy application assessment', 'Modernisation roadmap creation'] },
      { key: 'data', title: 'DATA & AI', items: ['Define AI goals', 'Build AI adoption roadmap', 'AI readiness assessment', 'ML model selection', 'Unifying data model selection'] },
      { key: 'infra', title: 'INFRASTRUCTURE', items: ['Infra strategy & planning', 'Infra architecture & designing', 'Capacity planning', 'Cloud adoption roadmap', 'Cloud vendor selection', 'Multi-cloud & hybrid cloud design'] },
      { key: 'sec', title: 'SECURITY', items: ['Security & compliance architecture and design'] },
    ];
    const professionalItems = [
        { key: 'apps', title: 'APPS & AGENTS', items: ['Application deployment', 'Legacy App migration to cloud', 'Application reengineering'] },
        { key: 'data', title: 'DATA & AI', items: ['Data landscape assessment', 'Data migration and integration', 'Data fabric architecture setup', 'ML model integration', 'Custom AI model development', 'BI tool integration'] },
        { key: 'infra', title: 'INFRASTRUCTURE', items: ['Cloud readiness assessment', 'Infrastructure provisioning', 'Infrastructure monitoring & optimisation', 'Well architected reviews (WAR)', 'Server, Storage & Backup implementation', 'Disaster Recovery (DR) setup & drills'] },
        { key: 'sec', title: 'SECURITY', items: ['Security and compliance setup', 'Cybersecurity risk assessments', 'Vulnerability scanning & penetration testing'] },
        { key: 'market', title: 'MARKETPLACE', items: ['Product listing in AWS/Azure Marketplace'] },
    ];
    const managedItems = [
        { key: 'included', title: 'Included Services (summary)', items: ['Subscription Management', 'IAM / User Management', 'Billing-related Issue Support', 'Quota limit increases', '24×7 Technical Support — Email, Phone & Chat', 'Case Severity & SLA (Critical 1hr / Moderate 4hrs / Minimal 8hrs)', 'Identify unused assets & over-provisioned VMs', 'Well-Architected Reviews (Quarterly)', 'Identify RI & Savings Plan opportunities', 'Allocate cost & show back spend across BUs', 'Monitor costs & alerting', 'Forecast usage & budgets', 'Database & App monitoring (native)', 'Monthly/Weekly reports', 'Incident management', 'Security recommendations', 'Backup & Restore', 'Change management & Ticketing'] }
    ];

    const renderColumn = (title: string, items: typeof consultingItems, activeKey: string | null, setActive: (key: string|null)=>void) => (
      <>
        <h4>{title}</h4>
        {items.map(item => (
          <AccordionSection 
            key={item.key}
            title={item.title}
            items={item.items}
            isActive={activeKey === item.key}
            onToggle={() => setActive(activeKey === item.key ? null : item.key)}
          />
        ))}
      </>
    );

    if (isMobile) {
      return (
        <>
          <MobileMenuCategory title="Consulting Services">
            {consultingItems.map(i => <AccordionSection key={i.key} title={i.title} items={i.items} isActive={activeConsulting === i.key} onToggle={() => setActiveConsulting(activeConsulting === i.key ? null : i.key)} />)}
          </MobileMenuCategory>
          <MobileMenuCategory title="Professional Services">
            {professionalItems.map(i => <AccordionSection key={i.key} title={i.title} items={i.items} isActive={activeProfessional === i.key} onToggle={() => setActiveProfessional(activeProfessional === i.key ? null : i.key)} />)}
          </MobileMenuCategory>
          <MobileMenuCategory title="Managed Services">
             {managedItems.map(i => <AccordionSection key={i.key} title={i.title} items={i.items} isActive={activeManaged === i.key} onToggle={() => setActiveManaged(activeManaged === i.key ? null : i.key)} />)}
          </MobileMenuCategory>
        </>
      );
    }
    return (
      <>
        <div className="mega-grid">
            <div className="mega-col">{renderColumn('Consulting Services', consultingItems, activeConsulting, setActiveConsulting)}</div>
            <div className="mega-col">{renderColumn('Professional Services', professionalItems, activeProfessional, setActiveProfessional)}</div>
            <div className="mega-col">{renderColumn('Managed Services', managedItems, activeManaged, setActiveManaged)}</div>
        </div>
        <div className="mega-footer">
            <span>Need help selecting a service?</span>
            <button className="btn" onClick={openModal}>Talk to an Expert</button>
        </div>
      </>
    );
  };
  
  const AIMenu: React.FC<{isMobile?: boolean, openModal: () => void}> = ({ isMobile, openModal }) => {
    const [activeOverview, setActiveOverview] = useState<string | null>(null);
    const [activeCustomize, setActiveCustomize] = useState<string | null>(null);
    const [activeBuild, setActiveBuild] = useState<string | null>(null);

    const overviewSections = [
        { key: 'core', title: 'Core', items: ['Build and scale the next wave of AI innovation with Chavans', 'Build with a proven IT leader', 'AI use cases to enhance business value', 'AI services & tools — GenAI, AgenticAI, ML, AI infra, Data foundation for AI', 'Success Stories | How customers are innovating with AI', 'Building AI responsibly'] },
        { key: 'blogs', title: 'Blogs', items: ['New Amazon Sagemaker AI innovations continue to transform AI model development', 'Azure AI Foundry innovations continue to transform AI model development'] },
        { key: 'res', title: 'Tutorials & Resources', items: ['Tutorials | Resources to develop AI skills', 'Hands-on labs'] },
        { key: 'start', title: 'Get Started', items: ['Start PoC', "Discover Chavans' alliance to accelerate your AI innovation"] }
    ];
    const customizeItems = [{key: 'custom', title: 'Customize', items: ['GenAI & Agentic AI', 'Model selection & PoC', 'Model governance & explainability', 'Responsible AI controls & safety']}];
    const buildItems = [{key: 'build', title: 'Build', items: ['MLOps & CI/CD', 'Feature stores & pipelines', 'Model monitoring & drift detection', 'Model registries & deployment']}];

    if(isMobile) return (
        <>
            <MobileMenuCategory title="Overview">
                {overviewSections.map(s => <AccordionSection key={s.key} title={s.title} items={s.items} isActive={activeOverview === s.key} onToggle={()=>setActiveOverview(activeOverview === s.key ? null : s.key)} />)}
            </MobileMenuCategory>
            <MobileMenuCategory title="Customize AI Models">
                {customizeItems.map(s => <AccordionSection key={s.key} title={s.title} items={s.items} isActive={activeCustomize === s.key} onToggle={()=>setActiveCustomize(activeCustomize === s.key ? null : s.key)} />)}
            </MobileMenuCategory>
            <MobileMenuCategory title="Build your own AI Models">
                {buildItems.map(s => <AccordionSection key={s.key} title={s.title} items={s.items} isActive={activeBuild === s.key} onToggle={()=>setActiveBuild(activeBuild === s.key ? null : s.key)} />)}
            </MobileMenuCategory>
        </>
    )

    return (
        <>
            <div className="mega-grid">
                <div className="mega-col">
                    <h4>Overview</h4>
                    {overviewSections.map(s => <AccordionSection key={s.key} title={s.title} items={s.items} isActive={activeOverview === s.key} onToggle={() => setActiveOverview(activeOverview === s.key ? null : s.key)} />)}
                </div>
                <div className="mega-col">
                    <h4>Customize AI Models</h4>
                    {customizeItems.map(s => <AccordionSection key={s.key} title={s.title} items={s.items} isActive={activeCustomize === s.key} onToggle={() => setActiveCustomize(activeCustomize === s.key ? null : s.key)} />)}
                </div>
                <div className="mega-col">
                    <h4>Build your own AI Models</h4>
                    {buildItems.map(s => <AccordionSection key={s.key} title={s.title} items={s.items} isActive={activeBuild === s.key} onToggle={() => setActiveBuild(activeBuild === s.key ? null : s.key)} />)}
                </div>
            </div>
            <div className="mega-footer">
                <span>Start your AI journey</span>
                <button className="btn" onClick={openModal}>Request an AI PoC</button>
            </div>
        </>
  )};

  const IntelligentInfrastructureMenu: React.FC<{isMobile?: boolean, openModal: () => void}> = ({ isMobile, openModal }) => {
    const [activeCloud, setActiveCloud] = useState<string|null>(null);
    const [activeDC, setActiveDC] = useState<string|null>(null);
    const [activeEdge, setActiveEdge] = useState<string|null>(null);
    const cloudItems = [
        { key: 'overview', title: 'Overview', items: ['Build and scale your business on Cloud with Chavans', 'Cloud use cases to enhance business value', 'Containers, Kubernetes, Virtual Machines, HCI, Compute, Data Storage', 'Backup & DR, Networking', 'Partnerships | Big-3, ACP, CSP', 'Tutorials & resources to develop Cloud skills'] },
        { key: 'solutions', title: 'Cloud solutions', items: ['Multi-Cloud & Hybrid', 'Modernise Apps', 'Migrate to innovate in the era of AI', 'HPC & Cloud FinOps'] },
    ];
    const datacenterItems = [
        { key: 'overview', title: 'Overview', items: ['Build and scale your business on-premises with Chavans', 'DC use cases & services (HCI, VMs, Storage, Backup & DR)', 'Partnerships | Dell, HPE, Nutanix, NetApp', 'Tutorials & resources to develop DC skills'] },
        { key: 'modern', title: 'Modernisation', items: ['Co-location', 'Flex-on-Demand (FoD)', 'Co-managed infrastructure'] },
    ];
    const edgeItems = [
        { key: 'aipc', title: 'AI PC / Copilot+ PCs', items: ['Copilot+ PCs', 'Cloud PCs', 'Edge compute for low-latency AI'] },
        { key: 'solutions', title: 'Edge Solutions', items: ['Edge adoption roadmap', 'Edge infra planning', 'AI at the edge'] },
    ];
    if(isMobile) return (
        <>
            <MobileMenuCategory title="Cloud">{cloudItems.map(i => <AccordionSection key={i.key} title={i.title} items={i.items} isActive={activeCloud === i.key} onToggle={()=>setActiveCloud(activeCloud === i.key ? null : i.key)} />)}</MobileMenuCategory>
            <MobileMenuCategory title="Datacenter">{datacenterItems.map(i => <AccordionSection key={i.key} title={i.title} items={i.items} isActive={activeDC === i.key} onToggle={()=>setActiveDC(activeDC === i.key ? null : i.key)} />)}</MobileMenuCategory>
            <MobileMenuCategory title="Edge">{edgeItems.map(i => <AccordionSection key={i.key} title={i.title} items={i.items} isActive={activeEdge === i.key} onToggle={()=>setActiveEdge(activeEdge === i.key ? null : i.key)} />)}</MobileMenuCategory>
        </>
    )
    return (
        <>
            <div className="mega-grid">
                <div className="mega-col">
                    <h4>Cloud</h4>
                    {cloudItems.map(item => <AccordionSection key={item.key} title={item.title} items={item.items} isActive={activeCloud === item.key} onToggle={()=>setActiveCloud(activeCloud === item.key ? null : item.key)} />)}
                </div>
                <div className="mega-col">
                    <h4>Datacenter</h4>
                    {datacenterItems.map(item => <AccordionSection key={item.key} title={item.title} items={item.items} isActive={activeDC === item.key} onToggle={()=>setActiveDC(activeDC === item.key ? null : item.key)} />)}
                </div>
                <div className="mega-col">
                    <h4>Edge</h4>
                    {edgeItems.map(item => <AccordionSection key={item.key} title={item.title} items={item.items} isActive={activeEdge === item.key} onToggle={()=>setActiveEdge(activeEdge === item.key ? null : item.key)} />)}
                </div>
            </div>
            <div className="mega-footer">
                <span>Need an infrastructure assessment?</span>
                <button className="btn" onClick={openModal}>Request Assessment</button>
            </div>
        </>
  )};

  const SecurityMenu: React.FC<{isMobile?: boolean, openModal: () => void}> = ({ isMobile, openModal }) => {
      const [activeArch, setActiveArch] = useState<string|null>(null);
      const [activeOps, setActiveOps] = useState<string|null>(null);
      const [activeAssess, setActiveAssess] = useState<string|null>(null);
      const architectureItems = [
          { key: 'design', title: 'Design', items: ['Zero-trust & secure-by-design', 'Identity & Access Management (IAM)', 'Network & data protection'] },
          { key: 'enc', title: 'Encryption & Key Mgmt', items: ['Data at rest & in transit', 'KMS & HSM guidance'] }
      ];
      const opsItems = [
          { key: 'soc', title: 'SOC & Monitoring', items: ['Threat monitoring & SIEM', 'XDR integrations'] },
          { key: 'ir', title: 'Incident Response', items: ['IR playbooks & runbooks', 'Forensics & post-incident reviews'] }
      ];
      const assessmentItems = [
          { key: 'vuln', title: 'Vulnerability & Pen-testing', items: ['External & internal scans', 'Red team engagements'] },
          { key: 'grc', title: 'GRC', items: ['Framework mapping (ISO, NIST, PCI, HIPAA)', 'Audit readiness'] }
      ];

      if (isMobile) return (
          <>
              <MobileMenuCategory title="Security Architecture">{architectureItems.map(i => <AccordionSection key={i.key} title={i.title} items={i.items} isActive={activeArch === i.key} onToggle={()=>setActiveArch(activeArch === i.key ? null : i.key)} />)}</MobileMenuCategory>
              <MobileMenuCategory title="Operations & Response">{opsItems.map(i => <AccordionSection key={i.key} title={i.title} items={i.items} isActive={activeOps === i.key} onToggle={()=>setActiveOps(activeOps === i.key ? null : i.key)} />)}</MobileMenuCategory>
              <MobileMenuCategory title="Assessment & Compliance">{assessmentItems.map(i => <AccordionSection key={i.key} title={i.title} items={i.items} isActive={activeAssess === i.key} onToggle={()=>setActiveAssess(activeAssess === i.key ? null : i.key)} />)}</MobileMenuCategory>
          </>
      )

    return(
        <>
            <div className="mega-grid">
                <div className="mega-col">
                    <h4>Security Architecture</h4>
                    {architectureItems.map(item => <AccordionSection key={item.key} title={item.title} items={item.items} isActive={activeArch === item.key} onToggle={()=>setActiveArch(activeArch === item.key ? null : item.key)} />)}
                </div>
                <div className="mega-col">
                    <h4>Operations & Response</h4>
                    {opsItems.map(item => <AccordionSection key={item.key} title={item.title} items={item.items} isActive={activeOps === item.key} onToggle={()=>setActiveOps(activeOps === item.key ? null : item.key)} />)}
                </div>
                <div className="mega-col">
                    <h4>Assessment & Compliance</h4>
                    {assessmentItems.map(item => <AccordionSection key={item.key} title={item.title} items={item.items} isActive={activeAssess === item.key} onToggle={()=>setActiveAssess(activeAssess === item.key ? null : item.key)} />)}
                </div>
            </div>
            <div className="mega-footer"><span>Schedule a security review</span><button className="btn" onClick={openModal}>Request Review</button></div>
        </>
  )};

  const ResourcesMenu: React.FC<{isMobile?: boolean}> = ({ isMobile }) => {
    const [activeLearn, setActiveLearn] = useState<string|null>(null);
    const [activeConnect, setActiveConnect] = useState<string|null>(null);
    const learnSections = [
        { key: 'sol', title: 'Solution Library', items: ['Solution patterns', 'Reference architectures', 'Starter templates']},
        { key: 'arch', title: 'Architecture', items: ['Reference architectures & diagrams']},
    ];
    const connectSections = [
        { key: 'events', title: 'Events & Webinars', items: ['Upcoming webinars', 'Workshops & trainings']}
    ];
    const learnLinks = ['Fundamentals', 'Tutorials'];
    const connectLinks = ['Press Releases'];
    const storiesItems = ['Blogs', 'Success Stories', 'Case studies'];

    const searchFooter = (
        <div style={{ marginTop: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ color: 'var(--muted)' }}>Need a search bar to find the right content?</div>
            <div style={{ width: '420px', maxWidth: '100%' }} className="resources-search">
                <input type="search" placeholder="Search docs, case studies, webinars..." aria-label="Search resources"/>
                <button className="btn" onClick={() => alert('Search functionality not implemented.')}>Search</button>
            </div>
        </div>
    );

    if(isMobile) return(
        <>
            <MobileMenuCategory title="Learn">
                {learnSections.map(i => <AccordionSection key={i.key} title={i.title} items={i.items} isActive={activeLearn === i.key} onToggle={()=>setActiveLearn(activeLearn === i.key ? null : i.key)} />)}
                {learnLinks.map(item => <a href="#" key={item} style={{display:'block', padding: '8px 0', marginLeft: '1rem'}}>{item}</a>)}
            </MobileMenuCategory>
             <MobileMenuCategory title="Connect">
                {connectSections.map(i => <AccordionSection key={i.key} title={i.title} items={i.items} isActive={activeConnect === i.key} onToggle={()=>setActiveConnect(activeConnect === i.key ? null : i.key)} />)}
                {connectLinks.map(item => <a href="#" key={item} style={{display:'block', padding: '8px 0', marginLeft: '1rem'}}>{item}</a>)}
            </MobileMenuCategory>
             <MobileMenuCategory title="Stories">
                {storiesItems.map(item => <a href="#" key={item} style={{display:'block', padding: '8px 0', marginLeft: '1rem'}}>{item}</a>)}
            </MobileMenuCategory>
            <div className="resources-search" style={{marginTop: '16px', flexDirection: 'column', alignItems: 'stretch' }}>
                 <input type="search" placeholder="Search resources..." />
                 <button className="btn" style={{marginTop:'8px'}} onClick={() => alert('Search functionality not implemented.')}>Search</button>
            </div>
        </>
    )

    return(
      <>
        <div className="mega-grid">
            <div className="mega-col">
                <h4>Learn</h4>
                {learnSections.map(item => <AccordionSection key={item.key} title={item.title} items={item.items} isActive={activeLearn === item.key} onToggle={()=>setActiveLearn(activeLearn === item.key ? null : item.key)} />)}
                {learnLinks.map(link => <a href="#" key={link}>{link}</a>)}
            </div>
            <div className="mega-col">
                <h4>Connect</h4>
                {connectSections.map(item => <AccordionSection key={item.key} title={item.title} items={item.items} isActive={activeConnect === item.key} onToggle={()=>setActiveConnect(activeConnect === item.key ? null : item.key)} />)}
                {connectLinks.map(item => <a href="#" key={item}>{item}</a>)}
            </div>
            <div className="mega-col">
                <h4>Stories</h4>
                {storiesItems.map(item => <a href="#" key={item}>{item}</a>)}
            </div>
        </div>
        {searchFooter}
      </>
  )};

  const PricingMenu: React.FC<{isMobile?: boolean}> = ({ isMobile }) => {
    const tiers = ['Standard — 10% of MRR', 'Premium — 13%', 'Premium+ — 15%', 'Enterprise — 17%'];
    const custom = ['Request a quote', 'Bulk enterprise pricing'];

    if(isMobile) return (
        <>
            <MobileMenuCategory title="Service Tiers">
                <ul className="section-list" style={{display: 'block', paddingLeft: 0, listStyle: 'none'}}>{tiers.map(i => <li key={i}><a href="#">{i}</a></li>)}</ul>
            </MobileMenuCategory>
             <MobileMenuCategory title="Custom Pricing">
                 <ul className="section-list" style={{display: 'block', paddingLeft: 0, listStyle: 'none'}}>{custom.map(i => <li key={i}><a href="#">{i}</a></li>)}</ul>
            </MobileMenuCategory>
        </>
    );
    return(
        <div className="mega-grid">
            <div className="mega-col">
                <h4>Service Tiers</h4>
                <ul className="section-list" style={{display: 'block', paddingLeft: 0, listStyle: 'none'}}>
                    {tiers.map(i => <li key={i}><a href="#">{i}</a></li>)}
                </ul>
            </div>
            <div className="mega-col">
                <h4>Custom Pricing</h4>
                <ul className="section-list" style={{display: 'block', paddingLeft: 0, listStyle: 'none'}}>
                    {custom.map(i => <li key={i}><a href="#">{i}</a></li>)}
                </ul>
            </div>
        </div>
    )
  }

  return (
    <header aria-label="Main header" ref={headerRef}>
      <div className="container header-row">
        <div className="brand">CHAVANS</div>
        <nav aria-label="Primary navigation" className="nav">
          <button className="nav-btn" onClick={() => handleNavClick('services-mega')}>Services ▾</button>
          <button className="nav-btn" onClick={() => handleNavClick('ai-mega')}>AI ▾</button>
          <button className="nav-btn" onClick={() => handleNavClick('intel-mega')}>Intelligent Infrastructure ▾</button>
          <button className="nav-btn" onClick={() => handleNavClick('security-mega')}>Security ▾</button>
          <button className="nav-btn" onClick={() => handleNavClick('resources-mega')}>Resources ▾</button>
          <button className="nav-btn" onClick={() => handleNavClick('pricing-mega')}>Pricing ▾</button>
        </nav>
        <div className="nav">
          <button className="btn" onClick={openModal}>Contact Us</button>
        </div>
        <div className="mobile-nav-toggle">
            <button className="nav-btn" onClick={() => setMobileMenuOpen(!isMobileMenuOpen)} aria-label="Toggle menu" aria-expanded={isMobileMenuOpen}>
                {isMobileMenuOpen ? 'Close' : 'Menu'}
            </button>
        </div>
      </div>

      <MegaPanel id="services-mega"><ServicesMenu openModal={openModal}/></MegaPanel>
      <MegaPanel id="ai-mega"><AIMenu openModal={openModal}/></MegaPanel>
      <MegaPanel id="intel-mega"><IntelligentInfrastructureMenu openModal={openModal} /></MegaPanel>
      <MegaPanel id="security-mega"><SecurityMenu openModal={openModal}/></MegaPanel>
      <MegaPanel id="resources-mega"><ResourcesMenu/></MegaPanel>
      <MegaPanel id="pricing-mega"><PricingMenu/></MegaPanel>

      {isMobileMenuOpen && (
        <div className="mobile-menu">
            <MobileMenuCategory title="Services" startOpen={true}>
                <ServicesMenu isMobile={true} openModal={openModal} />
            </MobileMenuCategory>
            <MobileMenuCategory title="AI">
                <AIMenu isMobile={true} openModal={openModal}/>
            </MobileMenuCategory>
            <MobileMenuCategory title="Intelligent Infrastructure">
                <IntelligentInfrastructureMenu isMobile={true} openModal={openModal}/>
            </MobileMenuCategory>
             <MobileMenuCategory title="Security">
                <SecurityMenu isMobile={true} openModal={openModal}/>
            </MobileMenuCategory>
             <MobileMenuCategory title="Resources">
                <ResourcesMenu isMobile={true} />
            </MobileMenuCategory>
            <MobileMenuCategory title="Pricing">
                <PricingMenu isMobile={true} />
            </MobileMenuCategory>
            <div className="mobile-contact-btn-wrapper">
                <button className="btn" onClick={() => { openModal(); setMobileMenuOpen(false); }}>Contact Us</button>
            </div>
        </div>
      )}
    </header>
  );
};

export default Header;