// src/component/UserOrders/user-orders.jsx
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faBroom,
    faPlus,
    faBuilding,
    faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons';

import { useAllUserOrders } from './use-all-user-orders.js';
import AddOrderModal from '../add-order-modal/add-order-modal.jsx';
import CompanyLogo from '../company-logo/company-logo.jsx';
import styles from './user-orders.module.css';

const UserOrders = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { data: userOrders = [], isLoading, error } = useAllUserOrders();

    const handleAddOrder = () => {
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
        <div className={styles.requestsSection}>
            <h3 className={styles.sectionTitle}>Your Cleaning Requests</h3>
            <div className={styles.requestsGrid}>
                {userOrders.map((order) => (
                    <div className={styles.requestBox} key={order.id}>
                        <div className={styles.requestHeader}>
                            {order.icon ? (
                                <img
                                    src={order.request_icon}
                                    alt={`${order.name} icon`}
                                    className={styles.requestLogo}
                                />
                            ) : (
                                <div className={styles.requestLogoIcon}>
                                    <FontAwesomeIcon icon={faBroom} />
                                </div>
                            )}
                            <h4 className={styles.requestName}>{order.name}</h4>
                        </div>
                        <div className={styles.requestContent}>
                            {order.contractor ? (
                                <div className={styles.contractorInfo}>
                                    <CompanyLogo
                                        logoUrl={order.contractor_logo}
                                        companyName={order.contractor}
                                        className={styles.contractorLogo}
                                        size="small"
                                    />
                                    <span className={styles.contractorName}>{order.contractor}</span>
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
                <div className={`${styles.requestBox} ${styles.addRequestBox}`} onClick={handleAddOrder}>
                    <div className={styles.addRequestContent}>
                        <div className={styles.addRequestIcon}>
                            <FontAwesomeIcon icon={faPlus} />
                        </div>
                        <span className={styles.addRequestText}>Add New Request</span>
                    </div>
                </div>
            </div>

            <AddOrderModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
};

export default UserOrders;