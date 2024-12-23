// src/components/RelocationsComponent.tsx
import React, {useEffect, useState} from 'react';
import {Maintenance} from "../types/Vehicles";
import {useParams} from "react-router-dom";
import axios from "axios";
import PaginationComponent from "./PaginationComponent";
import TripsCardComponent from "./TripsCardComponent";
import MaintenanceCardComponent from "./MaintenanceCardComponent";
import getApiConfig from "../utils/ApiConfig";

const MaintenanceByRegoComponent: React.FC = () => {
    const apiPath = getApiConfig();
    const [maintenance, setMaintenance] = useState<Maintenance[]>([]);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);

    const {rego} = useParams<{ rego: string }>();
    const fetchVehiclesMaintenance = async (page: number) => {
        try {
            const response = await axios.get(`${apiPath.apiPath}?page=${page}`
                , {
                    params: {
                        rego_no: rego,
                    }
                });

            const result = Array.isArray(response.data.vehicleMaintenance)
                ? response.data.vehicleMaintenance
                : [response.data.vehicleMaintenance];
            setMaintenance(result);
            console.log("from maintenancebyrego is it an array?", Array.isArray(result) )
            console.log("from maintenancebyrego componenet: ", response.data);
            setTotalPages(response.data.totalMaintenanceByRegPage);
        } catch (error) {
            console.error("Error fetching trips", error);
        }
    }
    useEffect(() => {
        fetchVehiclesMaintenance(currentPage);
    }, [currentPage, rego]);

    const handleTripsPageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setCurrentPage(value);
    };

    return (
        <div className="vehicles-container">



            <MaintenanceCardComponent
                maintenancesList={maintenance}
            />
            <PaginationComponent
                count={totalPages}
                currentPage={currentPage}
                onPageChange={handleTripsPageChange}
            />
        </div>);
};

export default MaintenanceByRegoComponent;
