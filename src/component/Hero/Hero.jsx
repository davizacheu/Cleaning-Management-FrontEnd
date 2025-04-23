import React from 'react';
import styles from './Hero.module.css';


const Hero = () => {
  return (
      <section className={styles.hero}>
        <div className={`container ${styles.heroContent}`}>
          <div className={styles.heroText}>
            <h2>Streamline Your Cleaning Operations</h2>
            <p>
              The all-in-one platform for managing cleaning teams,
              schedules, and client communication with ease.
            </p>
            <div className={styles.heroButtons}>
              <button className={`${styles.ctaBtn} ${styles.primary}`}>Get Started Free</button>
              <button className={`${styles.ctaBtn} ${styles.secondary}`}>Watch Demo</button>
            </div>
          </div>
          <div className={styles.heroImage}>
            {/* This div will display the background image defined in CSS */}
          </div>
        </div>
      </section>

  );
};

export default Hero;