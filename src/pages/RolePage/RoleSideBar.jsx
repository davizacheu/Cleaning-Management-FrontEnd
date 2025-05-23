import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faEdit,
  faTrash,
  faBuilding,
  faClipboardList,
  faChartLine,
  faUserShield,
  faCog
} from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';
import styles from './RoleSideBar.module.css';

/**
 * RoleSideBar Component
 * 
 * A sidebar component for displaying role information, navigation tabs,
 * and management actions (edit/delete) for a role page.
 * 
 * @param {Object} props - Component props
 * @param {Object} props.userRole - Role data object
 * @param {string} props.activeTab - Currently active tab identifier
 * @param {Function} props.onTabChange - Callback for tab changes
 * @param {Function} props.onEdit - Callback for edit action
 * @param {Function} props.onDelete - Callback for delete action
 */
const RoleSideBar = ({ 
  userRole, 
  activeTab, 
  onTabChange, 
  onEdit, 
  onDelete 
}) => {
  const navigate = useNavigate();
  const [showSettings, setShowSettings] = useState(false);
  const settingsRef = useRef(null);

  // Navigation configuration - memoized to prevent unnecessary re-renders
  const navigationItems = useMemo(() => [
    {
      key: 'info',
      icon: faBuilding,
      label: 'Role & Company Info'
    },
    {
      key: 'assignments',
      icon: faClipboardList,
      label: 'Assignments'
    },
    {
      key: 'permissions',
      icon: faUserShield,
      label: 'Permissions'
    },
    {
      key: 'reports',
      icon: faChartLine,
      label: 'Reports'
    }
  ], []);

  // Event handlers - memoized to prevent unnecessary re-renders
  const handleGoBack = useCallback(() => {
    navigate('/dashboard');
  }, [navigate]);

  const handleEdit = useCallback(() => {
    if (onEdit && userRole) {
      onEdit(userRole);
      setShowSettings(false);
    }
  }, [onEdit, userRole]);

  const handleDelete = useCallback(() => {
    if (onDelete && userRole) {
      onDelete(userRole);
      setShowSettings(false);
    }
  }, [onDelete, userRole]);

  const toggleSettings = useCallback(() => {
    setShowSettings(prev => !prev);
  }, []);

  const handleTabClick = useCallback((tabKey) => {
    if (onTabChange) {
      onTabChange(tabKey);
    }
  }, [onTabChange]);

  // Close settings dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setShowSettings(false);
      }
    };

    if (showSettings) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [showSettings]);

  // Close settings on escape key
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape' && showSettings) {
        setShowSettings(false);
      }
    };

    if (showSettings) {
      document.addEventListener('keydown', handleEscapeKey);
      return () => {
        document.removeEventListener('keydown', handleEscapeKey);
      };
    }
  }, [showSettings]);

  // Early return if userRole is not provided
  if (!userRole) {
    return (
      <div className={styles.sidebar}>
        <div className={styles.errorState}>
          <p>Role data not available</p>
          <button className={styles.backButton} onClick={handleGoBack}>
            <FontAwesomeIcon icon={faArrowLeft} />
            <span>Back to Dashboard</span>
          </button>
        </div>
      </div>
    );
  }

  const renderLogo = () => {
    if (userRole.company_logo) {
      return (
        <img 
          src={userRole.company_logo} 
          alt={`${userRole.company_name || 'Company'} logo`}
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
      );
    }
    
    if (userRole.profile_pic) {
      return (
        <img 
          src={userRole.profile_pic} 
          alt="Role"
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
      );
    }
    
    return (
      <div className={styles.placeholderLogo}>
        <FontAwesomeIcon icon={faBuilding} />
      </div>
    );
  };

  const renderNavigationItems = () => {
    return navigationItems.map((item) => (
      <button
        key={item.key}
        className={`${styles.navItem} ${activeTab === item.key ? styles.active : ''}`}
        onClick={() => handleTabClick(item.key)}
        aria-current={activeTab === item.key ? 'page' : undefined}
        type="button"
      >
        <FontAwesomeIcon icon={item.icon} aria-hidden="true" />
        <span>{item.label}</span>
      </button>
    ));
  };

  const renderSettingsDropdown = () => {
    if (!showSettings) return null;

    return (
      <div className={styles.settingsDropdown} role="menu">
        <button
          className={styles.settingsItem}
          onClick={handleEdit}
          type="button"
          role="menuitem"
          disabled={!onEdit}
        >
          <FontAwesomeIcon icon={faEdit} aria-hidden="true" />
          <span>Edit Role</span>
        </button>
        <button
          className={`${styles.settingsItem} ${styles.deleteItem}`}
          onClick={handleDelete}
          type="button"
          role="menuitem"
          disabled={!onDelete}
        >
          <FontAwesomeIcon icon={faTrash} aria-hidden="true" />
          <span>Delete Role</span>
        </button>
      </div>
    );
  };

  return (
    <aside className={styles.sidebar} aria-label="Role navigation">
      <header className={styles.sidebarHeader}>
        <button 
          className={styles.backButton} 
          onClick={handleGoBack}
          type="button"
          aria-label="Go back to dashboard"
        >
          <FontAwesomeIcon icon={faArrowLeft} aria-hidden="true" />
          <span>Dashboard</span>
        </button>

        <div className={styles.settingsWrapper} ref={settingsRef}>
          <button
            className={`${styles.settingsButton} ${showSettings ? styles.active : ''}`}
            onClick={toggleSettings}
            aria-label="Role settings"
            aria-expanded={showSettings}
            aria-haspopup="menu"
            type="button"
          >
            <FontAwesomeIcon icon={faCog} aria-hidden="true" />
          </button>
          {renderSettingsDropdown()}
        </div>
      </header>

      <div className={styles.profile}>
        <div className={styles.logo}>
          {renderLogo()}
        </div>
        <div className={styles.info}>
          <h3 className={styles.title}>
            {userRole.title || 'Role Title'}
          </h3>
          <p className={styles.companyName}>
            {userRole.company_name || 'Company Name'}
          </p>
        </div>
      </div>

      <nav className={styles.nav} aria-label="Role sections">
        {renderNavigationItems()}
      </nav>
    </aside>
  );
};

// PropTypes for better development experience and documentation
RoleSideBar.propTypes = {
  userRole: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    title: PropTypes.string,
    company_name: PropTypes.string,
    company_logo: PropTypes.string,
    profile_pic: PropTypes.string,
  }),
  activeTab: PropTypes.string.isRequired,
  onTabChange: PropTypes.func.isRequired,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
};

RoleSideBar.defaultProps = {
  userRole: null,
  onEdit: null,
  onDelete: null,
};

export default RoleSideBar;