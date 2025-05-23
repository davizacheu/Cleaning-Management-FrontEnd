import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faBuilding,
  faUserTie,
  faClipboardList,
  faChartLine,
  faUserShield
} from '@fortawesome/free-solid-svg-icons';
import styles from './RolePage.module.css';
import { useGetRoleInfo } from "./use-get-role-info.js";
import RoleSideBar from './RoleSideBar.jsx';

const RolePage = () => {
  console.log("Rendering RolePage");
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('info');

  // Get role from location state if available
  const role = location.state?.role;

  const {
    data: userRole,
    isLoading,
    error
  } = useGetRoleInfo(role);

  const handleGoBack = () => {
    navigate('/dashboard');
  };

  const handleEdit = (role) => {
    // Implement edit functionality
    console.log('Edit role:', role);
  };

  const handleDelete = (role) => {
    // Implement delete functionality
    console.log('Delete role:', role);
    navigate('/dashboard');
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loading}>Loading role details...</div>
      </div>
    );
  }

  if (error || !userRole) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.error}>
          <h2>Error Loading Role</h2>
          <p>We couldn't find the role you're looking for.</p>
          <button className={styles.backButton} onClick={handleGoBack}>
            <FontAwesomeIcon icon={faArrowLeft} /> Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <RoleSideBar
          userRole={userRole}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <div className={styles.mainContent}>
          {activeTab === 'info' && <InfoPanel role={userRole} />}
          {activeTab === 'assignments' && <AssignmentsPanel />}
          {activeTab === 'permissions' && <PermissionsPanel />}
          {activeTab === 'reports' && <ReportsPanel />}
        </div>
      </div>
    </div>
  );
};

// Component for Role & Company Info tab
const InfoPanel = ({ role }) => {
  return (
    <div className={styles.infoPanel}>
      <div className={styles.sectionHeader}>
        <h2>Role & Company Information</h2>
        <p className={styles.subtitle}>View and manage your role details and company information</p>
      </div>

      <div className={styles.infoGrid}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <FontAwesomeIcon icon={faUserTie} className={styles.cardIcon} />
            <h3>Role Details</h3>
          </div>
          <div className={styles.cardContent}>
            <div className={styles.infoItem}>
              <span className={styles.label}>Title</span>
              <span className={styles.value}>{role.title || 'Not specified'}</span>
            </div>
            {role.personnel_name && (
              <div className={styles.infoItem}>
                <span className={styles.label}>Contact Person</span>
                <span className={styles.value}>{role.personnel_name}</span>
              </div>
            )}
            <div className={styles.infoItem}>
              <span className={styles.label}>Role ID</span>
              <span className={styles.value}>{role.id || 'Not available'}</span>
            </div>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <FontAwesomeIcon icon={faBuilding} className={styles.cardIcon} />
            <h3>Company Information</h3>
          </div>
          <div className={styles.cardContent}>
            <div className={styles.infoItem}>
              <span className={styles.label}>Company Name</span>
              <span className={styles.value}>{role.company_name || 'Not specified'}</span>
            </div>
            {role.company_address && (
              <div className={styles.infoItem}>
                <span className={styles.label}>Address</span>
                <span className={styles.value}>{role.company_address}</span>
              </div>
            )}
            {role.company_email && (
              <div className={styles.infoItem}>
                <span className={styles.label}>Email</span>
                <span className={styles.value}>{role.company_email}</span>
              </div>
            )}
            {role.company_phone && (
              <div className={styles.infoItem}>
                <span className={styles.label}>Phone</span>
                <span className={styles.value}>{role.company_phone}</span>
              </div>
            )}
          </div>
        </div>

        {role.contact_data && (
          <div className={`${styles.card} ${styles.fullWidth}`}>
            <div className={styles.cardHeader}>
              <h3>Additional Contact Information</h3>
            </div>
            <div className={styles.cardContent}>
              <pre className={styles.contactDataJson}>
                {JSON.stringify(role.contact_data, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Component for Assignments tab
const AssignmentsPanel = () => {
  return (
    <div className={styles.panel}>
      <div className={styles.sectionHeader}>
        <h2>Profile Assignments</h2>
        <p className={styles.subtitle}>Manage which profiles are assigned to this role</p>
      </div>

      <div className={styles.emptyState}>
        <FontAwesomeIcon icon={faClipboardList} className={styles.emptyIcon} />
        <h3>No Assignments Yet</h3>
        <p>You don't have any profile assignments for this role yet.</p>
        <button className={styles.primaryButton}>Assign New Profiles</button>
      </div>
    </div>
  );
};

// Component for Permissions tab
const PermissionsPanel = () => {
  return (
    <div className={styles.panel}>
      <div className={styles.sectionHeader}>
        <h2>Role Permissions</h2>
        <p className={styles.subtitle}>Manage access and permissions for this role</p>
      </div>

      <div className={styles.emptyState}>
        <FontAwesomeIcon icon={faUserShield} className={styles.emptyIcon} />
        <h3>Permission Management</h3>
        <p>Set up access controls and permissions for this role.</p>
        <button className={styles.primaryButton}>Configure Permissions</button>
      </div>
    </div>
  );
};

// Component for Reports tab
const ReportsPanel = () => {
  return (
    <div className={styles.panel}>
      <div className={styles.sectionHeader}>
        <h2>Role Reports</h2>
        <p className={styles.subtitle}>View performance data and analytics for this role</p>
      </div>

      <div className={styles.emptyState}>
        <FontAwesomeIcon icon={faChartLine} className={styles.emptyIcon} />
        <h3>No Reports Available</h3>
        <p>There are no reports available for this role yet.</p>
        <button className={styles.primaryButton}>Generate Report</button>
      </div>
    </div>
  );
};

export default RolePage;