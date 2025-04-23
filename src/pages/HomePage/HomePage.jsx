import React from 'react';
import './HomePage.css'; // Import the homepage-specific styles
import Hero from '../../component/Hero/Hero.jsx';
import Testimonials from './Testimonials.jsx';
import scheduleIcon from "../../assets/schedule-icon.svg";
import communicationIcon from "../../assets/communication-icon.svg";
import analyticsIcon from "../../assets/analytics-icon.svg";

const HomePage = () => {
  return (
    <>
      <Hero />
      
      <section className="stats">
        <div className="container">
          <div className="stat-item">
            <h3>500+</h3>
            <p>Cleaning Teams</p>
          </div>
          <div className="stat-item">
            <h3>10,000+</h3>
            <p>Projects Completed</p>
          </div>
          <div className="stat-item">
            <h3>98%</h3>
            <p>Customer Satisfaction</p>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <h2 className="section-title">Why Choose CleanMaster?</h2>
          <div className="features-grid">
            <div className="feature">
              <img src={scheduleIcon} alt="Scheduling" className="feature-icon" />
              <h3>Smart Scheduling</h3>
              <p>
                Optimize team schedules and automate task assignments
                with our AI-powered calendar system.
              </p>
            </div>
            <div className="feature">
              <img src={communicationIcon} alt="Communication" className="feature-icon" />
              <h3>Seamless Communication</h3>
              <p>
                Connect teams and clients with real-time messaging,
                notifications, and updates on project status.
              </p>
            </div>
            <div className="feature">
              <img src={analyticsIcon} alt="Analytics" className="feature-icon" />
              <h3>Powerful Analytics</h3>
              <p>
                Track performance metrics, client satisfaction, and
                team efficiency with detailed reporting tools.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Add this divider */}
      <div className="section-divider"></div>


      <Testimonials />
    </>
  );
};

export default HomePage;