// AddRequestModal.jsx - updated code
import React, {useEffect, useState} from 'react';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faTimes, faUpload} from '@fortawesome/free-solid-svg-icons';
import {useAuth} from '../../hook/useAuthHook.js';
import styles from './AddRequestModal.module.css';

const AddRequestModal = ({isOpen, onClose}) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        startDate: '',
        endDate: '',
        isIndefinite: false,
        icon: null,
        contractorName: ''
    });
    const [iconPreviewUrl, setIconPreviewUrl] = useState(null);
    const [validationErrors, setValidationErrors] = useState({});
    const {addRequest} = useAuth();
    const queryClient = useQueryClient();

    const addRequestMutation = useMutation({
        mutationFn: addRequest,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['userRequests']});
            onClose();
            resetForm();
        },
        onError: (error) => {
            console.error('Failed to add request:', error);
            setValidationErrors({
                form: 'Failed to create request. Please try again.'
            });
        }
    });

    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            startDate: '',
            endDate: '',
            isIndefinite: false,
            icon: null,
            contractorName: ''
        });
        setIconPreviewUrl(null);
        setValidationErrors({});
    };

    const handleChange = (e) => {
        const {name, value, type, checked} = e.target;
        const inputValue = type === 'checkbox' ? checked : value;

        setFormData((prev) => ({
            ...prev,
            [name]: inputValue
        }));

        if (validationErrors[name]) {
            setValidationErrors((prev) => ({
                ...prev,
                [name]: undefined
            }));
        }
    };

    // Handler for image upload (icon)
    const handleIconUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData((prev) => ({
                ...prev,
                icon: file
            }));
            const reader = new FileReader();
            reader.onloadend = () => {
                setIconPreviewUrl(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Function to handle image removal
    const handleRemoveIcon = () => {
        setFormData(prev => ({
            ...prev,
            icon: null
        }));
        setIconPreviewUrl(null);
    };

    // Updated validation to handle indefinite end date
    const validateForm = () => {
        const errors = {};

        if (!formData.name.trim()) {
            errors.name = 'Request name is required';
        }
        if (!formData.description.trim()) {
            errors.description = 'Description is required';
        }
        if (!formData.startDate) {
            errors.startDate = 'Start date is required';
        }
        if (!formData.isIndefinite && !formData.endDate) {
            errors.endDate = 'End date is required when not indefinite';
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        // Build the new request object
        const newRequest = {
            name: formData.name,
            description: formData.description,
            startDate: formData.startDate,
            endDate: formData.isIndefinite ? 'Indefinite' : formData.endDate,
            icon: formData.icon,
            contractorName: formData.contractorName || null
        };

        addRequestMutation.mutate(newRequest);
    };

    // Button should be disabled if required fields are not provided
    const isDisabled =
        !formData.name.trim() ||
        !formData.description.trim() ||
        !formData.startDate ||
        (!formData.isIndefinite && !formData.endDate);

    useEffect(() => {
        if (isOpen) {
            document.body.classList.add(styles.modalOpen);
        } else {
            document.body.classList.remove(styles.modalOpen);
        }
        return () => {
            document.body.classList.remove(styles.modalOpen);
        };
    }, [isOpen]);

    // Don't render anything if the modal is not open
    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContainer}>

                {/*Modal Header*/}
                <div className={styles.modalHeader}>
                    <h3>Add Request</h3>
                    <button className="x-close-btn" onClick={onClose}>
                        <FontAwesomeIcon icon={faTimes}/>
                    </button>
                </div>

                {validationErrors.form && (
                    <div className={styles.formErrorMessage}>{validationErrors.form}</div>
                )}

                {/* Request Form */}
                <form className={styles.addRequestForm} onSubmit={handleSubmit}>

                  {/* Name Section */}
                  <div className={styles.formSection}>
                        <label htmlFor="name">
                            Request Name <span className={styles.requiredAsterisk}>*</span>
                        </label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            value={formData.name}
                            onChange={handleChange}
                            className={validationErrors.name ? styles.inputError : ''}
                            placeholder="Enter request name"
                        />
                        {validationErrors.name && (
                            <div className={styles.errorMessage}>{validationErrors.name}</div>
                        )}
                    </div>

                  {/*  Description Section */}
                  <div className={styles.formSection}>
                        <label htmlFor="description">
                            Description <span className={styles.requiredAsterisk}>*</span>
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className={validationErrors.description ? styles.inputError : ''}
                            placeholder="Describe the request"
                            rows={3}
                        />
                        {validationErrors.description && (
                            <div className={styles.errorMessage}>{validationErrors.description}</div>
                        )}
                    </div>

                  {/*  Start Date Section  */}
                  <div className={styles.formRow}>
                        <div className={styles.formSection}>
                            <label htmlFor="startDate">
                                Start Date <span className={styles.requiredAsterisk}>*</span>
                            </label>
                            <input
                                id="startDate"
                                name="startDate"
                                type="date"
                                value={formData.startDate}
                                onChange={handleChange}
                                className={validationErrors.startDate ? styles.inputError : ''}
                            />
                            {validationErrors.startDate && (
                                <div className={styles.errorMessage}>{validationErrors.startDate}</div>
                            )}
                        </div>

                    {/* End Date Section */}
                    <div className={styles.formSection}>
                            <label htmlFor="endDate">
                                End Date {!formData.isIndefinite && <span className={styles.requiredAsterisk}>*</span>}
                            </label>
                            <input
                                type="date"
                                id="endDate"
                                name="endDate"
                                value={formData.endDate}
                                onChange={handleChange}
                                className={validationErrors.endDate ? styles.inputError : ''}
                                disabled={formData.isIndefinite}
                            />
                            <div className={styles.indefiniteCheckboxContainer}>
                                <input
                                    type="checkbox"
                                    id="isIndefinite"
                                    name="isIndefinite"
                                    checked={formData.isIndefinite}
                                    onChange={handleChange}
                                    className={styles.indefiniteCheckbox}
                                />
                                <label htmlFor="isIndefinite" className={styles.indefiniteLabel}>Indefinite
                                    duration</label>
                            </div>
                            {validationErrors.endDate && (
                                <div className={styles.errorMessage}>{validationErrors.endDate}</div>
                            )}
                        </div>

                    </div>

                  {/*  Contractor Name Section  */}
                  <div className={styles.formSection}>
                        <label htmlFor="contractorName">Contractor Name (optional)</label>
                        <input
                            id="contractorName"
                            name="contractorName"
                            type="text"
                            value={formData.contractorName}
                            onChange={handleChange}
                            placeholder="Enter contractor name"
                        />
                    </div>

                  {/*  Upload Icon Section */}
                  <div className={styles.formSection}>

                    <label htmlFor="icon">Upload Icon (Optional)</label>
                    <div className={styles.imageUploadContainer}>
                      {iconPreviewUrl ? (
                          <div className={styles.imagePreviewWrapper}>
                            <img
                                src={iconPreviewUrl}
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

                    {/* Modal Bottom Buttons */}
                    <div className={styles.formActions}>
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={isDisabled}
                        >
                            Create Request
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddRequestModal;