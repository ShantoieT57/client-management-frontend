import React from 'react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;

    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
    }

    return (
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <button 
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                style={{ margin: '0 5px', padding: '5px 10px' }}
            >
                Previous
            </button>
            
            {pages.map(page => (
                <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    style={{
                        margin: '0 2px',
                        padding: '5px 10px',
                        backgroundColor: currentPage === page ? '#007bff' : '#f8f9fa',
                        color: currentPage === page ? 'white' : 'black',
                        border: '1px solid #ccc',
                        cursor: 'pointer'
                    }}
                >
                    {page}
                </button>
            ))}
            
            <button 
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                style={{ margin: '0 5px', padding: '5px 10px' }}
            >
                Next
            </button>
        </div>
    );
};

export default Pagination;