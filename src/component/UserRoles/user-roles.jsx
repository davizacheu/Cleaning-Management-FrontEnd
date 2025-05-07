import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import { useAllUserRoles } from './use-all-user-roles.js';
import AddRoleModal from '../AddRoleModal/AddRoleModal.jsx';
import CompanyLogo from '../company-logo/company-logo.jsx';
import styles from './UserRoles.module.css';

const UserRoles = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();
    const { data: userRoles = [], isLoading, error } = useAllUserRoles();

    const handleAddRole = () => {
        setIsModalOpen(true);
    };

    const handleRoleClick = (role) => {
        console.log('Role clicked:', role);
        navigate(`/role/${role.id}`, { state: { role } });
    };

    if (isLoading) {
        return <div className={styles.loading}>Loading roles...</div>;
    }

    if (error) {
        return (
            <div className={styles.errorMessage}>
                Failed to load your roles. Please try again later.
            </div>
        );
    }

    return (
        <div className={styles.rolesSection}>
            <h3 className={styles.sectionTitle}>Your Roles</h3>
            <div className={styles.rolesGrid}>
                {userRoles.map((role) => (
                    <div 
                        className={styles.roleBox} 
                        key={role.id}
                        onClick={() => handleRoleClick(role)}
                    >
                        <div className={styles.roleHeader}>
                            <CompanyLogo
                                logoUrl={role.company_logo_url}
                                companyName={role.company_name}
                                className={styles.companyLogo}
                                size="medium"
                            />
                            <h4 className={styles.companyName}>{role.company_name}</h4>
                        </div>
                        <div className={styles.roleContent}>
                            <span className={styles.roleTitle}>{role.title}</span>
                        </div>
                    </div>
                ))}

                {/* Add Role Box */}
                <div className={`${styles.roleBox} ${styles.addRoleBox}`} onClick={handleAddRole}>
                    <div className={styles.addRoleContent}>
                        <div className={styles.addRoleIcon}>
                            <FontAwesomeIcon icon={faPlus} />
                        </div>
                        <span className={styles.addRoleText}>Add New Role</span>
                    </div>
                </div>
            </div>

            {/* Modal component */}
            <AddRoleModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
};

export default UserRoles;