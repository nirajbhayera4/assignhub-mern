import React from 'react';
import Footer from '../components/Footer';
import '../styles/InfoPage.css';

const Guidelines = () => {
  return (
    <div className="info-page">
      <div className="info-shell">
        <div className="info-header">
          <span className="info-kicker">Guidelines</span>
          <h1>Standards for a healthy AssignHub community</h1>
          <p>
            These guidelines are here to keep the marketplace professional, useful, and
            respectful for students, freelancers, and clients alike.
          </p>
        </div>

        <div className="info-card">
          <h2>Be honest</h2>
          <p>Represent your skills, deadlines, project requirements, and expectations clearly from the start.</p>
          <h2>Respect others</h2>
          <p>Communicate professionally and avoid harassment, discrimination, or abusive behavior.</p>
          <h2>Protect quality</h2>
          <p>Do not upload stolen work, plagiarized content, malware, or anything that puts other users at risk.</p>
          <h2>Build trust</h2>
          <p>Use your profile, portfolio, and marketplace history responsibly so others can evaluate you with confidence.</p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Guidelines;
