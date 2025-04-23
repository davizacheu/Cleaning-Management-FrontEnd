// src/component/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMapMarkerAlt,
  faPhone,
  faEnvelope
} from '@fortawesome/free-solid-svg-icons';
import {
  faFacebookF,
  faTwitter,
  faLinkedinIn,
  faInstagram
} from '@fortawesome/free-brands-svg-icons';
// Import the SVG directly
import cleaningIcon from '../../assets/cleaning-icon.svg';
import './Footer.css';


const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
      <footer className="footer">
        <div className="container footer-content">
          <div className="footer-main">
            <div className="footer-brand">
              <div className="footer-logo">
                <img src={cleaningIcon} alt="CleanMaster Logo" className="footer-brand-logo" />
                <h3>CleanMaster</h3>
              </div>
              <p className="footer-tagline">
                Streamlining cleaning operations for businesses worldwide
              </p>
              <div className="footer-social">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                  <FontAwesomeIcon icon={faFacebookF} />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                  <FontAwesomeIcon icon={faTwitter} />
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                  <FontAwesomeIcon icon={faLinkedinIn} />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <FontAwesomeIcon icon={faInstagram} />
                </a>
              </div>
            </div>


            <div className="footer-links">
              <div className="footer-links-column">
                <h4>Product</h4>
                <ul>
                  <li><Link to="/features">Features</Link></li>
                  <li><Link to="/pricing">Pricing</Link></li>
                  <li><Link to="/integrations">Integrations</Link></li>
                  <li><Link to="/testimonials">Testimonials</Link></li>
                </ul>
              </div>

              <div className="footer-links-column">
                <h4>Resources</h4>
                <ul>
                  <li><Link to="/blog">Blog</Link></li>
                  <li><Link to="/guides">Guides</Link></li>
                  <li><Link to="/support">Support</Link></li>
                  <li><Link to="/api">API Documentation</Link></li>
                </ul>
              </div>

              <div className="footer-links-column">
                <h4>Company</h4>
                <ul>
                  <li><Link to="/about">About Us</Link></li>
                  <li><Link to="/careers">Careers</Link></li>
                  <li><Link to="/contact">Contact Us</Link></li>
                  <li><Link to="/partners">Partners</Link></li>
                </ul>
              </div>
            </div>

            <div className="footer-contact">
              <h4>Contact Us</h4>
              <address>
                <p><FontAwesomeIcon icon={faMapMarkerAlt} className="contact-icon" /> 123 Clean Street, Suite 456</p>
                <p><FontAwesomeIcon icon={faPhone} className="contact-icon" /> (123) 456-7890</p>
                <p><FontAwesomeIcon icon={faEnvelope} className="contact-icon" /> info@cleanmaster.com</p>
              </address>
              <div className="footer-newsletter">
                <h4>Subscribe to our newsletter</h4>
                <form className="newsletter-form">
                  <input type="email" placeholder="Enter your email" required />
                  <button type="submit" className="subscribe-btn">Subscribe</button>
                </form>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <div className="footer-copyright">
              <p>&copy; {currentYear} CleanMaster. All rights reserved.</p>
            </div>
            <div className="footer-legal">
              <Link to="/privacy">Privacy Policy</Link>
              <Link to="/terms">Terms of Service</Link>
              <Link to="/cookies">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </footer>
  );
};

export default Footer;