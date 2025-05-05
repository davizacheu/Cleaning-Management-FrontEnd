// src/components/AddRoleModal.jsx
import React, {useEffect, useState} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faTimes, faUpload, faBuilding, faIdCard, faLink, faSpinner, faCheckCircle} from '@fortawesome/free-solid-svg-icons';
import styles from './AddRoleModal.module.css';
import {useAddNewCompanyMutation} from "../../hook/use-add-new-company.js";
import {useJoinCompanyMutation} from "../../hook/use-join-company.js";

const AddRoleModal = ({isOpen, onClose}) => {
    const [roleType, setRoleType] = useState('existing');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [roleId, setRoleId] = useState('');
    const [previewUrl, setPreviewUrl] = useState(null);
    const [newCompanyData, setNewCompanyData] = useState({
        companyName: '',
        address: '',
        phoneNumber: '',
        emailAddress: '',
        externalLinks: '',
        roleTitle: '',
        companyLogo: null
    });

    // Handle the form input changes for new company
    const handleNewCompanyChange = (e) => {
        const {name, value} = e.target;
        setNewCompanyData({
            ...newCompanyData,
            [name]: value
        });
    };

    // Handler for image upload (icon)
    const handleIconUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setNewCompanyData((prev) => ({
                ...prev,
                companyLogo: file
            }));
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result); // Now correctly setting the preview URL
            };
            reader.readAsDataURL(file);
        }
    };

    // Function to handle image removal
    const handleRemoveIcon = () => {
        setNewCompanyData(prev => ({
            ...prev,
            companyLogo: null
        }));
        setPreviewUrl(null);
    };

    const onMutate = () => {
        // Set loading state when mutation starts
        setIsSubmitting(true);
    }

    const onError = (error) => {
        setIsSubmitting(false);
        console.error("Error adding role:", error);
    }

    const onSuccess = () => {
        // Show success message
        setIsSubmitting(false);
        setSubmitSuccess(true);
        resetForm();
        // Reset success message after a delay
        setTimeout(() => {
            setSubmitSuccess(false);
        }, 3000);
    }

    // Use React Query mutation for adding new role
    const addNewCompanyMutation = useAddNewCompanyMutation({
        newCompanyData: newCompanyData,
        options: {
            onMutate,
            onError,
            onSuccess
        }
    });

    // Use React Query mutation for joining existing role
    const joinCompanyMutation = useJoinCompanyMutation({
        roleId: roleId,
        options: {
        onMutate,
        onError,
        onSuccess
    }
    })

    const handleModalClose = () => {
        // Only close if not currently submitting
        if (!isSubmitting) {
            // Reset form before closing
            resetForm();
            resetSubmissionState();
            onClose();
        }
    };

    const resetForm = () => {
        setRoleType('existing');
        setRoleId('');
        setNewCompanyData({
            companyName: '',
            address: '',
            phoneNumber: '',
            emailAddress: '',
            externalLinks: '',
            roleTitle: '',
            companyLogo: null
        });
        setPreviewUrl(null);
    };

    const resetSubmissionState = () => {
        setSubmitSuccess(false);
        setIsSubmitting(false);
    }


    const handleSubmit = (e) => {
        e.preventDefault();

        // Don't allow submission if already submitting
        if (isSubmitting) return;

        if (roleType === 'existing') {
            joinCompanyMutation.mutate(roleId);
        } else {
            addNewCompanyMutation.mutate({
                company_name: newCompanyData.companyName,
                address: newCompanyData.address,
                phone_number: newCompanyData.phoneNumber,
                email_address: newCompanyData.emailAddress,
                external_links: newCompanyData.externalLinks,
                role_title: newCompanyData.roleTitle,
                company_logo: newCompanyData.companyLogo
            });
        }
    };


    // Fix the useEffect in AddRoleModal.jsx
    useEffect(() => {
        if (isOpen) {
            // When modal opens, add class to body to prevent scrolling
            document.body.classList.add(styles.modalOpen);
        } else {
            // When modal closes, remove the class to enable scrolling again
            document.body.classList.remove(styles.modalOpen);
        }

        // Cleanup function to ensure we remove the class if component unmounts while modal is open
        return () => {
            document.body.classList.remove(styles.modalOpen);
            setSubmitSuccess(false);
            setIsSubmitting(false);
        };
    }, [isOpen]);

    // Button should be disabled if required fields are not provided
    const isDisabled =
        roleType === 'existing'
        ? !roleId
        : !newCompanyData.companyName ||
        !newCompanyData.address ||
        !newCompanyData.phoneNumber ||
        !newCompanyData.emailAddress ||
        !newCompanyData.roleTitle

    const renderSuccessMessage = () => (
        submitSuccess && (
            <div className={styles.successMessage}>
                <FontAwesomeIcon icon={faCheckCircle} />
                <span>Successfully added new role!</span>
            </div>
        )
    );

    return isOpen && (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContainer}>

                {/* Modal Header */}
                <div className={styles.modalHeader}>
                    <h3>Add a Role</h3>
                    <button className="x-close-btn" onClick={handleModalClose}>
                        <FontAwesomeIcon icon={faTimes}/>
                    </button>
                </div>

                {/* Modal Form */}
                <form onSubmit={handleSubmit} className={styles.roleForm}>
                    {/* Display success message if present */}
                    {renderSuccessMessage()}

                    <div className={styles.roleTypeSelector}>
                            <div className={styles.roleOptions}>
                                <label className={`${styles.roleOption} ${roleType === 'existing' ? styles.active : ''}`}>
                                    <input
                                        type="radio"
                                        name="roleType"
                                        value="existing"
                                        checked={roleType === 'existing'}
                                        onChange={() => setRoleType('existing')}
                                    />
                                    <FontAwesomeIcon icon={faIdCard}/>
                                    <span>Join with Role ID</span>
                                </label>

                                <label className={`${styles.roleOption} ${roleType === 'new' ? styles.active : ''}`}>
                                    <input
                                        type="radio"
                                        name="roleType"
                                        value="new"
                                        checked={roleType === 'new'}
                                        onChange={() => setRoleType('new')}
                                    />
                                    <FontAwesomeIcon icon={faBuilding}/>
                                    <span>Create New Company</span>
                                </label>
                            </div>
                    </div>

                    {roleType === 'existing' ? (

                    <div className={styles.formGroup}>
                        <label htmlFor="roleId">
                            Role ID <span className={styles.requiredAsterisk}>*</span>
                        </label>
                        <input
                            type="text"
                            id="roleId"
                            name="roleId"
                            value={roleId}
                            onChange={(e) => setRoleId(e.target.value)}
                            required
                            placeholder="Enter the role ID"
                        />
                    </div>

                    ) : (

                    <div className={styles.formSection}>
                        <h4>Company Information</h4>

                        <div className={styles.formGroup}>
                            <label htmlFor="companyName">
                                Company Name <span className={styles.requiredAsterisk}>*</span>
                            </label>
                            <input
                                type="text"
                                id="companyName"
                                name="companyName"
                                value={newCompanyData.companyName}
                                onChange={handleNewCompanyChange}
                                required
                                placeholder="Enter company name"
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="address">
                                Address <span className={styles.requiredAsterisk}>*</span>
                            </label>
                            <input
                                type="text"
                                id="address"
                                name="address"
                                value={newCompanyData.address}
                                onChange={handleNewCompanyChange}
                                required
                                placeholder="Enter company address"
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="phoneNumber">
                                Phone Number <span className={styles.requiredAsterisk}>*</span>
                            </label>
                            <input
                                type="tel"
                                id="phoneNumber"
                                name="phoneNumber"
                                value={newCompanyData.phoneNumber}
                                onChange={handleNewCompanyChange}
                                required
                                placeholder="Enter phone number"
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="emailAddress">
                                Email Address <span className={styles.requiredAsterisk}>*</span>
                            </label>
                            <input
                                type="email"
                                id="emailAddress"
                                name="emailAddress"
                                value={newCompanyData.emailAddress}
                                onChange={handleNewCompanyChange}
                                required
                                placeholder="Enter email address"
                            />
                        </div>

                        {/* External Links Field */}
                        <div className={styles.linksGroup}>
                            <label htmlFor="externalLinks">External Links (Optional)</label>
                            <div className={styles.linksInput}>
                                <FontAwesomeIcon icon={faLink} className={styles.linksIcon} />
                                <input
                                    type="text"
                                    id="externalLinks"
                                    name="externalLinks"
                                    value={newCompanyData.externalLinks}
                                    onChange={handleNewCompanyChange}
                                    placeholder="Website, LinkedIn, etc."
                                />
                            </div>
                            <p className={styles.linkHint}>Separate multiple links with commas</p>
                        </div>


                        {/* Company Logo Field*/}
                        <div className={styles.formGroup}>
                            <label htmlFor="profilePic">Company Logo (Optional)</label>
                            <div className={styles.imageUploadContainer}>
                                {previewUrl ? (
                                    <div className={styles.imagePreviewWrapper}>
                                        <img
                                            src={previewUrl}
                                            alt="Icon Preview"
                                            className={styles.imagePreview}
                                        />
                                        <button
                                            type="button"
                                            className={styles.removeImageBtn}
                                            onClick={handleRemoveIcon}
                                            aria-label="Remove image"
                                        >
                                            <FontAwesomeIcon icon={faTimes} />
                                        </button>
                                    </div>
                                ) : (
                                    <div className={styles.uploadArea}>
                                        <input
                                            type="file"
                                            id="icon"
                                            name="icon"
                                            accept="image/*"
                                            onChange={handleIconUpload}
                                            className={styles.fileInput}
                                        />
                                        <button
                                            type="button"
                                            className={styles.uploadButton}
                                            onClick={() => document.getElementById('icon').click()}
                                        >
                                            <FontAwesomeIcon icon={faUpload} /> Choose Image
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="roleTitle">Your Position/Title</label>
                                <input
                                    type="text"
                                    id="roleTitle"
                                    name="roleTitle"
                                    value={newCompanyData.roleTitle}
                                    onChange={handleNewCompanyChange}
                                    placeholder="Enter your role title"
                                />
                            </div>
                    </div>
                    )}

                    <div className={styles.formActions}>
                        <button type="button" className="btn btn-secondary" onClick={handleModalClose}>
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={isDisabled && isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <FontAwesomeIcon icon={faSpinner} spin />
                                    <span>Adding Role...</span>
                                </>

                            ) : (roleType === 'existing' ? 'Join Role' : 'Create Company & Role')
                            }

                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddRoleModal;