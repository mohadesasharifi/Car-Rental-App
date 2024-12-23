import React from 'react';
import getApiConfig from "../utils/ApiConfig";

interface LifecycleFilterProps {
    onFiltered: (filters: { NeedMaintenance: string | null; ASC: string | null; DESC: string | null }) => void;
    selectedFilter: string | null; // New prop to track selected filter
    setSelectedFilter: (filter: string | null) => void; // Function to reset selected filter
}

const LifecycleFilter: React.FC<LifecycleFilterProps> = ({ onFiltered, selectedFilter, setSelectedFilter }) => {
    const apiPath = getApiConfig();
    const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSelectedFilter(value); // Update selected filter state
        onFiltered({
            NeedMaintenance: value === 'maintenance' ? '1' : null,
            ASC: value === 'ASC' ? '1' : null,
            DESC: value === 'DESC' ? '1' : null,
        });
    };

    return (
        <div className="filter-container">
            <h3 className="filter-title">Filter Vehicles</h3>
            <div className="radio-group">
                <label className="radio-label">
                    <input
                        type="radio"
                        value="ASC"
                        checked={selectedFilter === "ASC"}
                        onChange={handleFilterChange}
                    />
                    <span className="radio-text">Longer Lifetime</span>
                </label>
                <label className="radio-label">
                    <input
                        type="radio"
                        value="DESC"
                        checked={selectedFilter === "DESC"}
                        onChange={handleFilterChange}
                    />
                    <span className="radio-text">Shorter Lifetime</span>
                </label>
                <label className="radio-label">
                    <input
                        type="radio"
                        value="maintenance"
                        checked={selectedFilter === "maintenance"}
                        onChange={handleFilterChange}
                    />
                    <span className="radio-text">Needs Maintenance</span>
                </label>
            </div>
        </div>
    );
};

export default LifecycleFilter;
