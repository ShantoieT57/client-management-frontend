import React from 'react';
import { useHistory } from 'react-router-dom';
import { Client } from '../types/Client';
import Pagination from './Pagination';
import ConfirmDialog from './ConfirmDialog';

interface ClientListProps {
  clients: Client[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onEditClient: (client: Client) => void;
  onDeleteClient: (id: string) => void;
}

const ClientList: React.FC<ClientListProps> = ({
  clients,
  currentPage,
  totalPages,
  onPageChange,
  onEditClient,
  onDeleteClient,
}) => {
  const history = useHistory();
  const [confirmDialogOpen, setConfirmDialogOpen] = React.useState(false);
  const [clientToDelete, setClientToDelete] = React.useState<string | null>(null);

  const handleDeleteClick = (id: string) => {
    setClientToDelete(id);
    setConfirmDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (clientToDelete) {
      onDeleteClient(clientToDelete);
    }
    setConfirmDialogOpen(false);
    setClientToDelete(null);
  };

  const handleCancelDelete = () => {
    setConfirmDialogOpen(false);
    setClientToDelete(null);
  };

  const handleAddClient = () => {
    history.push('/add');
  };

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={handleAddClient}
          style={{
            backgroundColor: '#4CAF50',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Add New Client
        </button>
      </div>
      
      <table>
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {clients.map(client => (
            <tr key={client.id || client.customerId}>
              <td>{client.firstName}</td>
              <td>{client.lastName}</td>
              <td>{client.email}</td>
              <td>{client.phoneNumber}</td>
              <td>
                <button onClick={() => onEditClient(client)}>Edit</button>
                <button onClick={() => handleDeleteClick(client.id || client.customerId || '')}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
      <ConfirmDialog
        open={confirmDialogOpen}
        message="Are you sure you want to delete this client?"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
};

export default ClientList;