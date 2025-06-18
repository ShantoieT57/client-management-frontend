import React from 'react';

interface ConfirmDialogProps {
  open: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({ open, message, onConfirm, onCancel }) => {
  if (!open) return null;

  return (
    <div style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      right: 0, 
      bottom: 0, 
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{ 
        backgroundColor: 'white', 
        padding: '20px', 
        borderRadius: '8px',
        maxWidth: '400px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        <p>{message}</p>
        <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
          <button onClick={onConfirm} style={{ padding: '8px 16px' }}>Confirm</button>
          <button onClick={onCancel} style={{ padding: '8px 16px' }}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;