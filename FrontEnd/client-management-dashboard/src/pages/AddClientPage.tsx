import React from 'react';
import AddClientForm from '../components/AddClientForm';

const AddClientPage: React.FC = () => {
    return (
        <div className="page-container">
            <div className="card">
                <div className="card-header">
                    <h1>Add New Client</h1>
                    <p>Create a new client profile to expand your database</p>
                </div>
                <div className="card-body">
                    <AddClientForm />
                </div>
            </div>
        </div>
    );
};

export default AddClientPage;