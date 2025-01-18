import React from 'react';

const SearchBar = ({ query, setQuery, filter, setFilter }) => {
    return (
        <div className="flex flex-col items-center mb-6">
            <input
                type="text"
                className="p-2 rounded-lg shadow-md mb-4"
                placeholder="Search..."
                value={query}
                onChange={(e) => setQuery(e.target.value)} // Update query state
            />
            <select
                className="p-2 rounded-lg shadow-md"
                value={filter}
                onChange={(e) => setFilter(e.target.value)} // Update filter state
            >
                <option value="">All</option>
                <option value="title">Title</option>
                <option value="location">Location</option>
                {/* Add more filter options as needed */}
            </select>
        </div>
    );
};

export default SearchBar;
