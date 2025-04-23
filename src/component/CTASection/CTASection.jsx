// src/component/CTASection.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRocket, faCalendarCheck } from '@fortawesome/free-solid-svg-icons';
import styles from './CTASection.module.css';

const CTASection = ({
                        title = "Transform Your Cleaning Business Today",
                        description = "Join over 500 cleaning teams already using CleanMaster to optimize their operations.",
                        buttonText = "Start Your Free Trial",
                        buttonLink = "/signup",
                        secondaryButtonText = "Book a Demo",
                        secondaryButtonLink = "/demo",
                        backgroundClass = ""
                    }) => {
    return (
        <section className={`${styles.ctaSection} ${backgroundClass ? styles[backgroundClass] : ''}`}>
            <div className="container">
                <div className={styles.ctaContent}>
                    <h2>{title}</h2>
                    <p>{description}</p>
                    <div className={styles.ctaButtons}>
                        <Link to={buttonLink} className={`${styles.ctaBtn} ${styles.secondary} ${styles.large}`}>
                            <FontAwesomeIcon icon={faRocket} className={styles.ctaIcon} /> {buttonText}
                        </Link>
                        <Link to={secondaryButtonLink} className={`${styles.ctaBtn} ${styles.secondary} ${styles.large}`}>
                            <FontAwesomeIcon icon={faCalendarCheck} className={styles.ctaIcon} /> {secondaryButtonText}
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CTASection;