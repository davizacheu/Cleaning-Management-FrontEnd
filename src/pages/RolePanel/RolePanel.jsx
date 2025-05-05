import { useState } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBuilding,
  faUserTie,
  faClipboardList,
  faChartLine,
  faEnvelope,
  faPhone,
  faMapMarkerAlt,
  faGlobe
} from '@fortawesome/free-solid-svg-icons';
import styles from './RolePanel.module.css';

const RolePanel = ({ role = {} }) => {
  const [activeTab, setActiveTab] = useState('info');

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
      <div className={styles.rolePanel}>
        <div className={styles.panelHero}>
          <div className={styles.heroBackground}></div>
          <div className={styles.heroContent}>
            <div className={styles.logoContainer}>
              {role.company_logo ? (
                  <img src={role.company_logo} alt={`${role.company_name} logo`} className={styles.companyLogo} />
              ) : role.profile_pic ? (
                  <img src={role.profile_pic} alt="Role" className={styles.companyLogo} />
              ) : (
                  <div className={styles.placeholderLogo}>
                    <FontAwesomeIcon icon={faBuilding} />
                  </div>
              )}
            </div>
            <div className={styles.heroInfo}>
              <h1 className={styles.roleTitle}>{role.title || 'Role Title'}</h1>
              <h2 className={styles.companyName}>{role.company_name || 'Company Name'}</h2>
              {role.personnel_name && (
                  <p className={styles.personnelName}>Contact: {role.personnel_name}</p>
              )}
            </div>
          </div>
        </div>

        <div className={styles.tabsContainer}>
          <div className={styles.tabs}>
            <button
                className={`${styles.tabButton} ${activeTab === 'info' ? styles.active : ''}`}
                onClick={() => handleTabChange('info')}
            >
              <FontAwesomeIcon icon={faBuilding} />
              <span>Role & Company Info</span>
            </button>
            <button
                className={`${styles.tabButton} ${activeTab === 'assignments' ? styles.active : ''}`}
                onClick={() => handleTabChange('assignments')}
            >
              <FontAwesomeIcon icon={faClipboardList} />
              <span>Assignments</span>
            </button>
            <button
                className={`${styles.tabButton} ${activeTab === 'reports' ? styles.active : ''}`}
                onClick={() => handleTabChange('reports')}
            >
              <FontAwesomeIcon icon={faChartLine} />
              <span>Reports</span>
            </button>
          </div>

          <div className={styles.tabContent}>
            {activeTab === 'info' && (
                <div className={styles.infoTab}>
                  <div className={styles.infoSection}>
                    <h3 className={styles.sectionTitle}>Role Information</h3>
                    <div className={styles.detailsGrid}>
                      <div className={styles.detailItem}>
                        <div className={styles.detailIcon}><FontAwesomeIcon icon={faUserTie} /></div>
                        <div className={styles.detailContent}>
                          <label>Role Title</label>
                          <p>{role.title || 'Not specified'}</p>
                        </div>
                      </div>

                      <div className={styles.detailItem}>
                        <div className={styles.detailIcon}><FontAwesomeIcon icon={faBuilding} /></div>
                        <div className={styles.detailContent}>
                          <label>Company</label>
                          <p>{role.company_name || 'Not specified'}</p>
                        </div>
                      </div>

                      {role.personnel_name && (
                          <div className={styles.detailItem}>
                            <div className={styles.detailIcon}><FontAwesomeIcon icon={faUserTie} /></div>
                            <div className={styles.detailContent}>
                              <label>Personnel Name</label>
                              <p>{role.personnel_name}</p>
                            </div>
                          </div>
                      )}
                    </div>
                  </div>

                  <div className={styles.infoSection}>
                    <h3 className={styles.sectionTitle}>Company Contact Information</h3>
                    <div className={styles.detailsGrid}>
                      {role.company_address && (
                          <div className={styles.detailItem}>
                            <div className={styles.detailIcon}><FontAwesomeIcon icon={faMapMarkerAlt} /></div>
                            <div className={styles.detailContent}>
                              <label>Address</label>
                              <p>{role.company_address}</p>
                            </div>
                          </div>
                      )}

                      {role.company_email && (
                          <div className={styles.detailItem}>
                            <div className={styles.detailIcon}><FontAwesomeIcon icon={faEnvelope} /></div>
                            <div className={styles.detailContent}>
                              <label>Email</label>
                              <p>{role.company_email}</p>
                            </div>
                          </div>
                      )}

                      {role.company_phone && (
                          <div className={styles.detailItem}>
                            <div className={styles.detailIcon}><FontAwesomeIcon icon={faPhone} /></div>
                            <div className={styles.detailContent}>
                              <label>Phone</label>
                              <p>{role.company_phone}</p>
                            </div>
                          </div>
                      )}

                      {role.website && (
                          <div className={styles.detailItem}>
                            <div className={styles.detailIcon}><FontAwesomeIcon icon={faGlobe} /></div>
                            <div className={styles.detailContent}>
                              <label>Website</label>
                              <p>
                                <a href={role.website} target="_blank" rel="noopener noreferrer">
                                  {role.website}
                                </a>
                              </p>
                            </div>
                          </div>
                      )}
                    </div>
                  </div>

                  {role.contact_data && (
                      <div className={styles.infoSection}>
                        <h3 className={styles.sectionTitle}>Additional Contact Information</h3>
                        <div className={styles.contactData}>
                          <pre>{JSON.stringify(role.contact_data, null, 2)}</pre>
                        </div>
                      </div>
                  )}
                </div>
            )}

            {activeTab === 'assignments' && (
                <div className={styles.assignmentsTab}>
                  <div className={styles.emptyState}>
                    <FontAwesomeIcon icon={faClipboardList} className={styles.emptyStateIcon} />
                    <h3>Profile Assignments</h3>
                    <p>Manage which profiles are assigned to this role.</p>
                    <button className={styles.primaryButton}>Assign Profiles</button>
                  </div>
                </div>
            )}

            {activeTab === 'reports' && (
                <div className={styles.reportsTab}>
                  <div className={styles.emptyState}>
                    <FontAwesomeIcon icon={faChartLine} className={styles.emptyStateIcon} />
                    <h3>Role Reports</h3>
                    <p>View performance data and analytics for this role.</p>
                    <button className={styles.primaryButton}>Generate Report</button>
                  </div>
                </div>
            )}
          </div>
        </div>
      </div>
  );
};

RolePanel.propTypes = {
  role: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
    company_name: PropTypes.string,
    profile_pic: PropTypes.string,
    company_id: PropTypes.string,
    company_address: PropTypes.string,
    company_email: PropTypes.string,
    company_phone: PropTypes.string,
    company_logo: PropTypes.string,
    personnel_name: PropTypes.string,
    contact_data: PropTypes.object
  })
};

export default RolePanel;