import React from 'react';

interface SearchBarProps {
    searchTerm: string;
    onSearchChange: (term: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, onSearchChange }) => {
    return (
        <div style={{ marginBottom: '20px' }}>
            <input
                type="text"
                placeholder="Search clients by name or email..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                style={{
                    padding: '10px',
                    width: '300px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    fontSize: '16px'
                }}
            />
        </div>
    );
};

export default SearchBar;