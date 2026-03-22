import React from 'react';
import Hero from '../components/Hero';
import Stats from '../components/Stats';
import HowItWorks from '../components/HowItWorks';
import Features from '../components/Features';
import CTA from '../components/CTA';
import Footer from '../components/Footer';
import { useAnimations } from '../hooks/useAnimations';
import '../styles/global.css';

const Home = () => {
  useAnimations();

  return (
    <div>
      <div className="cursor"></div>
      <Hero />
      <Stats />
      <HowItWorks />
      <Features />
      <CTA />
      <Footer />
    </div>
  );
};

export default Home;