import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Client } from '../types/Client';

const ClientListPage: React.FC = () => {
    const [clients, setClients] = useState<Client[]>([]);
    const [filteredClients, setFilteredClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const history = useHistory();

    useEffect(() => {
        const fetchClients = async () => {
            try {
                setLoading(true);
                const response = await fetch('/client');
                if (response.ok) {
                    const data = await response.json();
                    setClients(data);
                    setFilteredClients(data);
                } else {
                    setError('Failed to load clients');
                }
            } catch (error) {
                setError('Error fetching clients');
                console.error('Error fetching clients:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchClients();
    }, []);

    useEffect(() => {
        const filtered = clients.filter(client =>
            client.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            client.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            client.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredClients(filtered);
    }, [searchTerm, clients]);

    const handleEdit = (client: Client) => {
        console.log('Edit client:', client);
        console.log('Client ID:', client.id);
        console.log('Customer ID:', client.customerId);
        if (client.customerId) {
            history.push(`/edit/${client.customerId}`);
        } else {
            setError('Client ID is missing');
        }
    };

    const handleDelete = async (customerId: string) => {
        if (window.confirm('Are you sure you want to delete this client?')) {
            try {
                const response = await fetch(`/client/${customerId}`, {
                    method: 'DELETE',
                });
                if (response.ok) {
                    setClients(clients.filter(client => client.customerId !== customerId));
                } else {
                    setError('Failed to delete client');
                }
            } catch (error) {
                setError('Error deleting client');
                console.error('Error deleting client:', error);
            }
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading clients...</p>
            </div>
        );
    }

    return (
        <div className="page-container">
            <div className="card" style={{ maxWidth: '1200px' }}>
                <div className="card-header">
                    <h1>Client Management</h1>
                    <p>Manage your client database with ease</p>
                </div>
                
                <div className="card-body">
                    {error && (
                        <div className="alert alert-error">
                            {error}
                        </div>
                    )}

                    {/* Search and Add New Section */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '30px',
                        gap: '20px',
                        flexWrap: 'wrap'
                    }}>
                        <div style={{ flex: 1, minWidth: '300px' }}>
                            <input
                                type="text"
                                placeholder="Search clients by name or email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="form-input"
                                style={{ margin: 0 }}
                            />
                        </div>
                        <button
                            onClick={() => history.push('/add')}
                            className="btn btn-primary"
                            style={{ whiteSpace: 'nowrap' }}
                        >
                            <span style={{ marginRight: '8px' }}>+</span>
                            Add New Client
                        </button>
                    </div>

                    {/* Stats Cards */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '20px',
                        marginBottom: '30px'
                    }}>
                        <div className="stats-card">
                            <div className="stats-number">{clients.length}</div>
                            <div className="stats-label">Total Clients</div>
                        </div>
                        <div className="stats-card">
                            <div className="stats-number">{clients.filter(c => c.isActive).length}</div>
                            <div className="stats-label">Active Clients</div>
                        </div>
                        <div className="stats-card">
                            <div className="stats-number">{filteredClients.length}</div>
                            <div className="stats-label">Search Results</div>
                        </div>
                    </div>

                    {/* Client Table */}
                    {filteredClients.length === 0 ? (
                        <div style={{
                            textAlign: 'center',
                            padding: '60px 20px',
                            color: '#6c757d'
                        }}>
                            <div style={{ fontSize: '48px', marginBottom: '20px' }}>👥</div>
                            <h3 style={{ marginBottom: '10px' }}>
                                {searchTerm ? 'No clients found' : 'No clients yet'}
                            </h3>
                            <p style={{ marginBottom: '30px' }}>
                                {searchTerm 
                                    ? 'Try adjusting your search criteria' 
                                    : 'Get started by adding your first client'
                                }
                            </p>
                            {!searchTerm && (
                                <button
                                    onClick={() => history.push('/add')}
                                    className="btn btn-primary"
                                >
                                    Add Your First Client
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="table-container">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Client</th>
                                        <th>Contact</th>
                                        <th>Location</th>
                                        <th>Type</th>
                                        <th>Status</th>
                                        <th style={{ textAlign: 'center' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredClients.map((client) => (
                                        <tr key={client.customerId || client.nationalIdNumber}>
                                            <td>
                                                <div className="client-info">
                                                    <div className="client-avatar">
                                                        {client.firstName?.charAt(0) || 'U'}{client.lastName?.charAt(0) || 'N'}
                                                    </div>
                                                    <div>
                                                        <div className="client-name">
                                                            {client.firstName} {client.lastName}
                                                        </div>
                                                        <div className="client-id">
                                                            ID: {client.nationalIdNumber}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="contact-info">
                                                    <div>{client.email}</div>
                                                    <div className="phone-number">{client.phoneNumber}</div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="location-info">
                                                    <div>{client.city}</div>
                                                    <div className="postal-code">{client.postalCode}</div>
                                                </div>
                                            </td>
                                            <td>
                                                <span className={`badge badge-${client.customerType?.toLowerCase() || 'individual'}`}>
                                                    {client.customerType || 'Individual'}
                                                </span>
                                            </td>
                                            <td>
                                                <span className={`status-badge ${client.isActive ? 'active' : 'inactive'}`}>
                                                    <span className="status-dot"></span>
                                                    {client.isActive ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="action-buttons">
                                                    <button
                                                        onClick={() => handleEdit(client)}
                                                        className="btn-icon btn-icon-primary"
                                                        title="Edit client"
                                                    >
                                                        ✏️
                                                    </button>
                                                    {client.customerId && (
                                                        <button
                                                            onClick={() => handleDelete(client.customerId!)}
                                                            className="btn-icon btn-icon-danger"
                                                            title="Delete client"
                                                        >
                                                            🗑️
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ClientListPage;