import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Client } from '../types/Client';
import { validateClient } from '../utils/validation';

const AddClientForm: React.FC = () => {
    const history = useHistory();
    const [formData, setFormData] = useState<Partial<Client>>({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        nationalIdNumber: '',
        postalCode: '',
        dateOfBirth: '',
        streetAddress: '',
        city: '',
        country: 'South Africa',
        customerType: 'Individual',
        isActive: true,
        loyaltyNumber: '',
    });
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        
        const clientData = {
            firstName: formData.firstName || '',
            lastName: formData.lastName || '',
            email: formData.email || '',
            phoneNumber: formData.phoneNumber || '',
            idNumber: formData.nationalIdNumber || '',
            postalCode: formData.postalCode || '',
            dateOfBirth: formData.dateOfBirth || '',
            city: formData.city || ''
        };

        const validation = validateClient(clientData);
        
        if (!validation.isValid) {
            setError(validation.error);
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch('/client', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            
            if (response.ok) {
                history.push('/');
            } else {
                const errorData = await response.text();
                setError('Failed to add client: ' + errorData);
            }
        } catch (error) {
            setError('Error adding client. Please try again.');
            console.error('Error adding client:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const inputStyle = {
        width: '100%',
        padding: '12px 16px',
        border: '2px solid #e9ecef',
        borderRadius: '8px',
        fontSize: '16px',
        transition: 'border-color 0.3s, box-shadow 0.3s',
        boxSizing: 'border-box' as const,
        fontFamily: 'inherit'
    };

    const labelStyle = {
        display: 'block',
        marginBottom: '8px',
        fontWeight: '600' as const,
        color: '#495057',
        fontSize: '14px'
    };

    const fieldGroupStyle = {
        marginBottom: '20px'
    };

    return (
        <form onSubmit={handleSubmit}>
            {error && (
                <div className="alert alert-error">
                    <strong>Error:</strong> {error}
                </div>
            )}

            {/* Personal Information Section */}
            <div className="form-section">
                <h3 style={{
                    margin: '0 0 20px 0',
                    color: '#495057',
                    fontSize: '18px',
                    fontWeight: '600'
                }}>
                    Personal Information
                </h3>
                
                <div className="form-grid form-grid-2">
                    <div style={fieldGroupStyle}>
                        <label style={labelStyle}>First Name *</label>
                        <input
                            type="text"
                            name="firstName"
                            value={formData.firstName || ''}
                            onChange={handleChange}
                            required
                            className="form-input"
                            placeholder="Enter first name"
                        />
                    </div>
                    <div style={fieldGroupStyle}>
                        <label style={labelStyle}>Last Name *</label>
                        <input
                            type="text"
                            name="lastName"
                            value={formData.lastName || ''}
                            onChange={handleChange}
                            required
                            className="form-input"
                            placeholder="Enter last name"
                        />
                    </div>
                </div>

                <div style={fieldGroupStyle}>
                    <label style={labelStyle}>Email Address *</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email || ''}
                        onChange={handleChange}
                        required
                        className="form-input"
                        placeholder="client@example.com"
                    />
                </div>

                <div className="form-grid form-grid-2">
                    <div style={fieldGroupStyle}>
                        <label style={labelStyle}>Phone Number</label>
                        <input
                            type="tel"
                            name="phoneNumber"
                            value={formData.phoneNumber || ''}
                            onChange={handleChange}
                            className="form-input"
                            placeholder="e.g., 0821234567"
                        />
                    </div>
                    <div style={fieldGroupStyle}>
                        <label style={labelStyle}>ID Number *</label>
                        <input
                            type="text"
                            name="nationalIdNumber"
                            value={formData.nationalIdNumber || ''}
                            onChange={handleChange}
                            required
                            maxLength={13}
                            className="form-input"
                            placeholder="13-digit SA ID number"
                        />
                    </div>
                </div>

                <div style={fieldGroupStyle}>
                    <label style={labelStyle}>Date of Birth *</label>
                    <input
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth || ''}
                        onChange={handleChange}
                        required
                        className="form-input"
                    />
                </div>
            </div>

            {/* Address Information Section */}
            <div className="form-section">
                <h3 style={{
                    margin: '0 0 20px 0',
                    color: '#495057',
                    fontSize: '18px',
                    fontWeight: '600'
                }}>
                    Address Information
                </h3>

                <div style={fieldGroupStyle}>
                    <label style={labelStyle}>Street Address</label>
                    <input
                        type="text"
                        name="streetAddress"
                        value={formData.streetAddress || ''}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="e.g., 123 Main Street"
                    />
                </div>

                <div className="form-grid form-grid-3">
                    <div style={fieldGroupStyle}>
                        <label style={labelStyle}>City *</label>
                        <input
                            type="text"
                            name="city"
                            value={formData.city || ''}
                            onChange={handleChange}
                            required
                            className="form-input"
                            placeholder="e.g., Cape Town"
                        />
                    </div>
                    <div style={fieldGroupStyle}>
                        <label style={labelStyle}>Postal Code *</label>
                        <input
                            type="text"
                            name="postalCode"
                            value={formData.postalCode || ''}
                            onChange={handleChange}
                            required
                            minLength={4}
                            maxLength={10}
                            className="form-input"
                            placeholder="e.g., 8001"
                        />
                    </div>
                </div>

                <div style={fieldGroupStyle}>
                    <label style={labelStyle}>Country</label>
                    <input
                        type="text"
                        name="country"
                        value={formData.country || ''}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="South Africa"
                    />
                </div>
            </div>

            {/* Account Information Section */}
            <div className="form-section">
                <h3 style={{
                    margin: '0 0 20px 0',
                    color: '#495057',
                    fontSize: '18px',
                    fontWeight: '600'
                }}>
                    Account Information
                </h3>

                <div className="form-grid form-grid-2">
                    <div style={fieldGroupStyle}>
                        <label style={labelStyle}>Customer Type *</label>
                        <select
                            name="customerType"
                            value={formData.customerType || 'Individual'}
                            onChange={handleChange}
                            required
                            className="form-select"
                        >
                            <option value="Individual">Individual</option>
                            <option value="Business">Business</option>
                        </select>
                    </div>
                    <div style={fieldGroupStyle}>
                        <label style={labelStyle}>Loyalty Number</label>
                        <input
                            type="text"
                            name="loyaltyNumber"
                            value={formData.loyaltyNumber || ''}
                            onChange={handleChange}
                            className="form-input"
                            placeholder="Optional loyalty number"
                        />
                    </div>
                </div>

                <div className="form-checkbox">
                    <input
                        type="checkbox"
                        name="isActive"
                        checked={formData.isActive || false}
                        onChange={handleChange}
                        id="isActive"
                    />
                    <label htmlFor="isActive" style={{ marginBottom: 0, fontWeight: 'normal' }}>
                        Active client (can receive communications and services)
                    </label>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="btn-group">
                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSubmitting}
                    style={{ 
                        opacity: isSubmitting ? 0.7 : 1,
                        cursor: isSubmitting ? 'not-allowed' : 'pointer'
                    }}
                >
                    {isSubmitting ? (
                        <>
                            <div style={{
                                display: 'inline-block',
                                width: '16px',
                                height: '16px',
                                border: '2px solid #ffffff',
                                borderTop: '2px solid transparent',
                                borderRadius: '50%',
                                animation: 'spin 1s linear infinite',
                                marginRight: '8px'
                            }}></div>
                            Adding Client...
                        </>
                    ) : (
                        '+ Add Client'
                    )}
                </button>
                <button
                    type="button"
                    onClick={() => history.push('/')}
                    className="btn btn-secondary"
                    disabled={isSubmitting}
                >
                    Cancel
                </button>
            </div>
        </form>
    );
};

export default AddClientForm;