import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import QuickFeatureBar from './components/Testimonials'; // Repurposed for the feature bar
import AISection from './components/WhyChooseUs'; // Repurposed for AI section
import InfrastructureSection from './components/FeaturedSolutions'; // Repurposed for Infrastructure
import SecuritySection from './components/InnovationLab'; // Repurposed for Security
import ServicesSection from './components/Services'; // Repurposed for Services section
import ResourcesSection from './components/LearningHub'; // Repurposed for Resources section
import Footer from './components/Footer';
import ContactModal from './components/ContactModal';

const App: React.FC = () => {
  const [isModalOpen, setModalOpen] = useState(false);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <>
      <Header openModal={openModal} />
      <main>
        <Hero openModal={openModal} />
        <QuickFeatureBar />
        <AISection />
        <InfrastructureSection />
        <SecuritySection />
        <ServicesSection />
        <ResourcesSection />
      </main>
      <Footer />
      <ContactModal isOpen={isModalOpen} closeModal={closeModal} />
    </>
  );
};

export default App;