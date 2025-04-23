import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faBroom,
    faPlus,
    faBuilding,
    faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons';

import { useAuth } from '../../hook/useAuthHook.js';
import AddRequestModal from '../AddRequestModal/AddRequestModal.jsx';
import styles from './UserRequests.module.css';

const UserRequests = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { getUserOrders, isAuthenticated } = useAuth();

    const {
        data: userRequests = [],
        isLoading,
        error
    } = useQuery({
        queryKey: ['userRequests'],
        queryFn: getUserOrders,
        enabled: isAuthenticated,
        staleTime: Infinity,
        refetchOnWindowFocus: false,
        retry: 1,
    });

    const handleAddRequest = () => {
        setIsModalOpen(true);
    };

    if (isLoading) {
        return <div className={styles.loading}>Loading cleaning requests...</div>;
    }

    if (error) {
        return (
            <div className={styles.errorMessage}>
                Failed to load your cleaning requests. Please try again later.
            </div>
        );
    }

    return (
        // Continue changing all className references to use the styles object
        <div className={styles.requestsSection}>
            <h3 className={styles.sectionTitle}>Your Cleaning Requests</h3>
            <div className={styles.requestsGrid}>
                {userRequests.map((request) => (
                    <div className={styles.requestBox} key={request.id}>
                        <div className={styles.requestHeader}>
                            {request.icon ? (
                                <img
                                    src={request.request_icon}
                                    alt={`${request.name} icon`}
                                    className={styles.requestLogo}
                                />
                            ) : (
                                <div className={styles.requestLogoIcon}>
                                    <FontAwesomeIcon icon={faBroom} />
                                </div>
                            )}
                            <h4 className={styles.requestName}>{request.name}</h4>
                        </div>
                        <div className={styles.requestContent}>
                            {request.contractor ? (
                                <div className={styles.contractorInfo}>
                                    {request.contractor_logo ? (
                                        <img
                                            src={request.contractor_logo}
                                            alt={`${request.contractor} logo`}
                                            className={styles.contractorLogo}
                                        />
                                    ) : (
                                        <div className={styles.contractorLogoDefault}>
                                            <FontAwesomeIcon icon={faBuilding} />
                                        </div>
                                    )}
                                    <span className={styles.contractorName}>{request.contractor}</span>
                                </div>
                            ) : (
                                <div className={styles.noContractorWarning}>
                                    <FontAwesomeIcon icon={faExclamationTriangle} className={styles.warningIcon} />
                                    <span>No contractor assigned</span>
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {/* Add Request Box */}
                <div className={`${styles.requestBox} ${styles.addRequestBox}`} onClick={handleAddRequest}>
                    <div className={styles.addRequestContent}>
                        <div className={styles.addRequestIcon}>
                            <FontAwesomeIcon icon={faPlus} />
                        </div>
                        <span className={styles.addRequestText}>Add New Request</span>
                    </div>
                </div>
            </div>

            <AddRequestModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
};

export default UserRequests;