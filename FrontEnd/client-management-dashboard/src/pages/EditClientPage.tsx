import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import EditClientForm from '../components/EditClientForm';
import { Client } from '../types/Client';

const EditClientPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const history = useHistory();
    const [client, setClient] = useState<Client | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchClient = async () => {
            try {
                const response = await fetch(`/clientID?ClientID=${id}`);
                if (response.ok) {
                    const data = await response.json();
                    setClient(data);
                } else {
                    console.error('Failed to fetch client');
                }
            } catch (error) {
                console.error('Error fetching client:', error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchClient();
        }
    }, [id]);

    const handleUpdate = () => {
        history.push('/');
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading client data...</p>
            </div>
        );
    }

    if (!client) {
        return (
            <div className="loading-container">
                <div className="card" style={{ maxWidth: '500px' }}>
                    <div className="card-body" style={{ textAlign: 'center' }}>
                        <h2 style={{ color: '#dc3545', marginBottom: '15px' }}>Client Not Found</h2>
                        <p style={{ marginBottom: '25px' }}>
                            The client you're looking for doesn't exist or has been removed.
                        </p>
                        <button onClick={() => history.push('/')} className="btn btn-primary">
                            ← Back to Client List
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="page-container">
            <div className="card">
                <div className="card-header">
                    <h1>Edit Client</h1>
                    <p>Update {client.firstName} {client.lastName}'s information</p>
                </div>
                <div className="card-body">
                    <EditClientForm client={client} onUpdate={handleUpdate} />
                </div>
            </div>
        </div>
    );
};

export default EditClientPage;