import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Client } from '../types/Client';
import { validateClient } from '../utils/validation';

interface EditClientFormProps {
  client?: Client;
  onUpdate?: () => void;
}

const EditClientForm: React.FC<EditClientFormProps> = ({ client: initialClient, onUpdate }) => {
    const { id } = useParams<{ id: string }>();
    const history = useHistory();
    const [formData, setFormData] = useState<Client>({
        customerId: '',
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        nationalIdNumber: '',
        postalCode: '',
        dateOfBirth: '',
        streetAddress: '',
        city: '',
        country: '',
        customerType: 'Individual',
        isActive: false,
        loyaltyNumber: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (initialClient) {
            setFormData(initialClient);
            setLoading(false);
        } else if (id) {
            fetch(`/clientID?ClientID=${id}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    setFormData(data);
                    setLoading(false);
                })
                .catch(error => {
                    console.error('Error:', error);
                    setError('Failed to load client');
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }, [id, initialClient]);

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
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phoneNumber: formData.phoneNumber,
            idNumber: formData.nationalIdNumber,
            postalCode: formData.postalCode,
            dateOfBirth: formData.dateOfBirth,
            city: formData.city
        };

        const validation = validateClient(clientData);
        
        if (!validation.isValid) {
            setError(validation.error);
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch(`/client`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            
            if (response.ok) {
                if (onUpdate) {
                    onUpdate();
                } else {
                    history.push('/');
                }
            } else {
                const errorData = await response.text();
                setError('Failed to update client: ' + errorData);
            }
        } catch (error) {
            setError('Error updating client. Please try again.');
            console.error('Error updating client:', error);
        } finally {
            setIsSubmitting(false);
        }
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

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '60px 20px',
                flexDirection: 'column',
                gap: '20px'
            }}>
                <div className="spinner"></div>
                <p style={{ color: '#6c757d', margin: 0 }}>Loading client data...</p>
            </div>
        );
    }

    if (error && !formData.firstName) {
        return (
            <div className="alert alert-error">
                <strong>Error:</strong> {error}
                <div style={{ marginTop: '15px' }}>
                    <button
                        onClick={() => history.push('/')}
                        className="btn btn-primary"
                    >
                        ← Back to Client List
                    </button>
                </div>
            </div>
        );
    }

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
                        value={formData.dateOfBirth ? formData.dateOfBirth.split('T')[0] : ''}
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
                        id="isActiveEdit"
                    />
                    <label htmlFor="isActiveEdit" style={{ marginBottom: 0, fontWeight: 'normal' }}>
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
                            Updating Client...
                        </>
                    ) : (
                        '💾 Update Client'
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

export default EditClientForm;