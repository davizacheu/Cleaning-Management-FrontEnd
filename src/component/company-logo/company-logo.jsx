import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBuilding } from '@fortawesome/free-solid-svg-icons';
import { supabase } from '../../model/net/supabase-client.js';
import styles from './company-logo.module.css';

/**
 * A reusable company logo component that handles loading from Supabase storage
 * 
 * @param {Object} props
 * @param {string} props.logoUrl - Supabase storage path
 * @param {string} props.companyName - Company name for alt text
 * @param {string} props.className - Optional CSS class name
 */
const CompanyLogo = ({ 
  logoUrl, 
  companyName, 
  className,
  size = 'medium' // 'small', 'medium', 'large'
}) => {
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const downloadLogo = async () => {
      if (!logoUrl) {
        setError(true);
        return;
      }

      setLoading(true);
      setError(false);

      try {
        const { data, error: downloadError } = await supabase.storage
          .from('company-logos')
          .download(logoUrl);

        if (downloadError) {
          console.error('Error downloading logo:', downloadError);
          setError(true);
          return;
        }

        // Create a URL for the downloaded blob
        const url = URL.createObjectURL(data);
        setImageUrl(url);
      } catch (err) {
        console.error('Failed to download logo:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (logoUrl) {
      downloadLogo();
    }

    // Clean up object URLs when unmounting or when logoUrl changes
    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [logoUrl]);

  const sizeClass = styles[size] || styles.medium;
  const combinedClassName = `${styles.logoContainer} ${sizeClass} ${className || ''}`;

  if (loading) {
    return (
      <div className={combinedClassName}>
        <div className={styles.loader}></div>
      </div>
    );
  }

  if (error || !logoUrl) {
    
    return (
      <div className={`${combinedClassName} ${styles.placeholder}`}>
        <FontAwesomeIcon icon={faBuilding} />
      </div>
    );
  }

  return (
    <div className={combinedClassName}>
      <img 
        src={imageUrl} 
        alt={`${companyName || 'Company'} logo`} 
        className={styles.logo} 
      />
    </div>
  );
};

export default CompanyLogo;