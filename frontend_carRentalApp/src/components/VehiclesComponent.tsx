// src/Vehicles.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {Vehicle, VehicleFetched} from '../types/Vehicles';
import PaginationComponent from "./PaginationComponent";
import FiltersComponent from './FiltersComponent';
import VehiclesCardComponent from "./VehiclesCardComponent";
import API from "./utils/vehiclesRequest"
import getApiConfig from "../utils/ApiConfig";
const Vehicles: React.FC = () => {
    const [vehicles, setVehicles] = useState<VehicleFetched[]>([]);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [filters, setFilters] = useState<any>({});
    const apiPath = getApiConfig();

    
    useEffect(() => {

        async function fetchData() {
            try {
                const vehicles_result = await API.fetchVehicles(currentPage, filters);
                setVehicles(vehicles_result.vehicles);
                setTotalPages(vehicles_result.totalPages);
            } catch (error) {
                console.error("error fetching vehicles", error);
            }
        }
        fetchData()
    }, [currentPage, filters]);
    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setCurrentPage(value);
    };


    const handleFiltered = (filters: any) => {
        // Call fetchVehicles with the new filters and reset to the first page
        setFilters(filters);
        console.log("from vehicle component", filters);
        setCurrentPage(1);
    };

    return (
        <div className="vehicles-container">


            <FiltersComponent onFiltered={handleFiltered}/>
            <VehiclesCardComponent
                vehiclesList={vehicles}
                  // Set true or false based on layout preference
            />
            <PaginationComponent
                count={totalPages}
                currentPage={currentPage}
                onPageChange={handlePageChange}
            />
        </div>
    );
};

export default Vehicles;
