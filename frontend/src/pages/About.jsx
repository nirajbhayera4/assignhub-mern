import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import '../styles/About.css';

const highlights = [
  {
    title: 'Real work opportunities',
    description:
      'We blend native AssignHub tasks with live external job feeds so users can build experience on actual projects.',
  },
  {
    title: 'Trust-first collaboration',
    description:
      'Profiles, ratings, structured payouts, and transparent communication help clients and contributors work with confidence.',
  },
  {
    title: 'Career growth',
    description:
      'Students, freelancers, and specialists can use AssignHub to learn, earn, and build a stronger public portfolio.',
  },
];

const values = [
  'Clarity over clutter',
  'High-quality outcomes',
  'Fair opportunity for new talent',
  'Practical tools that help people earn',
];

const About = () => {
  return (
    <div className="about-page">
      <div className="about-background">
        <div className="about-orb about-orb-1"></div>
        <div className="about-orb about-orb-2"></div>
      </div>

      <section className="about-hero">
        <div className="about-kicker">About AssignHub</div>
        <h1>Building a marketplace where learning and real work meet.</h1>
        <p>
          AssignHub is designed to feel like a modern freelancing platform while still
          supporting students, specialists, and clients who need trustworthy project
          delivery. We want users to find meaningful work, build proof of skill, and
          collaborate through one clean workflow.
        </p>
        <div className="about-hero-actions">
          <Link to="/register?role=worker" className="btn-primary">Join as Talent</Link>
          <Link to="/register?role=provider" className="btn-secondary">Post a Project</Link>
        </div>
      </section>

      <section className="about-section">
        <div className="about-section-heading">
          <h2>What We’re Creating</h2>
          <p>
            A polished workspace for project discovery, profile building, and delivery
            management that helps users move from browsing to real earnings.
          </p>
        </div>
        <div className="about-highlight-grid">
          {highlights.map((item) => (
            <article key={item.title} className="about-card">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="about-section about-story-grid">
        <div className="about-card emphasis">
          <span className="about-card-label">Mission</span>
          <h3>Help people turn capability into opportunity.</h3>
          <p>
            We believe strong marketplaces do more than list jobs. They help users
            present themselves better, discover relevant work faster, and complete
            projects in a way that creates long-term trust.
          </p>
        </div>
        <div className="about-card">
          <span className="about-card-label">Vision</span>
          <h3>A more practical talent network</h3>
          <p>
            AssignHub aims to become a place where emerging talent and serious clients
            can meet around real work, measurable skill, and cleaner project execution.
          </p>
        </div>
      </section>

      <section className="about-section">
        <div className="about-section-heading">
          <h2>Core Values</h2>
          <p>The standards we want the product and community to reflect every day.</p>
        </div>
        <div className="about-values">
          {values.map((value) => (
            <div key={value} className="about-value-pill">{value}</div>
          ))}
        </div>
      </section>

      <section className="about-section">
        <div className="about-contact-card">
          <div>
            <span className="about-card-label">Contact</span>
            <h2>Want to collaborate or grow with AssignHub?</h2>
            <p>
              Use the platform to post work, build your freelancer profile, and connect
              with contributors who are ready to deliver.
            </p>
          </div>
          <div className="about-contact-actions">
            <Link to="/marketplace" className="btn-primary">Explore Marketplace</Link>
            <Link to="/profile" className="btn-secondary">Complete Your Profile</Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
