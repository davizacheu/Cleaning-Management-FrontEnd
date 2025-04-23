import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBuilding, faPlus } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../hook/useAuthHook.js';
import AddRoleModal from '../AddRoleModal/AddRoleModal.jsx';
import styles from './UserRoles.module.css';


const UserRoles = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { getUserRoles, isAuthenticated } = useAuth();

    const {
        data: userRoles = [],
        isLoading,
        error
    } = useQuery({
        queryKey: ['userRoles'],
        queryFn: getUserRoles,
        enabled: isAuthenticated,
        staleTime: Infinity,
        refetchOnWindowFocus: false,
        retry: 1,
    });

    const handleAddRole = () => {
        setIsModalOpen(true);
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
                    <div className={styles.roleBox} key={role.id}>
                        <div className={styles.roleHeader}>
                            {role.profile_pic ? (
                                <img
                                    src={role.profile_pic}
                                    alt={`${role.company_name} logo`}
                                    className={styles.companyLogo}
                                />
                            ) : (
                                <div className={styles.companyLogoIcon}>
                                    <FontAwesomeIcon icon={faBuilding} />
                                </div>
                            )}
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