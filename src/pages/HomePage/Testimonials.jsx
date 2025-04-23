import React from 'react';
import './Testimonials.css';

const Testimonials = () => {
  return (
    <section className="testimonials">
      <div className="container">
        <h2 className="section-title">What Our Clients Say</h2>
        <div className="testimonial-grid">
          <div className="testimonial-card">
            <div className="testimonial-content">
              <p>CleanMaster has transformed how we manage our cleaning staff. Scheduling is now a breeze!</p>
            </div>
            <div className="testimonial-author">
              <h4>Sarah Johnson</h4>
              <p>Facility Manager</p>
            </div>
          </div>
          
          <div className="testimonial-card">
            <div className="testimonial-content">
              <p>The real-time updates and communication features have improved our client satisfaction by 35%.</p>
            </div>
            <div className="testimonial-author">
              <h4>Michael Chen</h4>
              <p>CEO, Pristine Cleaning Services</p>
            </div>
          </div>
          
          <div className="testimonial-card">
            <div className="testimonial-content">
              <p>We've reduced scheduling conflicts by 90% since implementing CleanMaster. A game-changer!</p>
            </div>
            <div className="testimonial-author">
              <h4>Lisa Rodriguez</h4>
              <p>Operations Director</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;