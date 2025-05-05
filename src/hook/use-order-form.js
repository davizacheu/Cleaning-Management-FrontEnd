// src/hook/useFormState.js
import { useState } from 'react';

export function useFormState(initialState, validationFn) {
    const [formData, setFormData] = useState(initialState);
    const [validationErrors, setValidationErrors] = useState({});

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
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

    const validateForm = () => {
        if (!validationFn) return true;

        const errors = validationFn(formData);
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const resetForm = () => {
        setFormData(initialState);
        setValidationErrors({});
    };

    return {
        formData,
        setFormData,
        validationErrors,
        setValidationErrors,
        handleChange,
        validateForm,
        resetForm
    };
}