import React, { useEffect, useState } from "react";
import axios from "axios";
import {Maintenance} from "../types/Vehicles";
import PaginationComponent from "./PaginationComponent";
import MaintenanceCardComponent from "./MaintenanceCardComponent";
import getApiConfig from "../utils/ApiConfig";

const MaintenanceComponent: React.FC = () => {
    const [maintenances, setMaintenances] = useState<Maintenance[]>([]); // Correctly using useState
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(0)
    const apiPath = getApiConfig();
    const fetchMaintenances = async (page: number) => {
        try {
            const response = await axios.get(`${apiPath.apiPath}?page=${page}`);
            const maintenancesResult = response.data.maintenances || [];
            const total = response.data.totalMaintenancePage || 0;
            setMaintenances(maintenancesResult);
            setTotalPages(total);
            console.log("from maintenance comp ", maintenancesResult);


        } catch (error) {
            console.error("Error fetching trips", error);
        }
    };

    useEffect(() => {
        fetchMaintenances(currentPage);
    }, [currentPage]);


    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setCurrentPage(value);
    };

    return (
        <div>
            <MaintenanceCardComponent
                maintenancesList={maintenances}
            />
            <PaginationComponent
                count={totalPages}
                currentPage={currentPage}
                onPageChange={handlePageChange}
            />
        </div>

    );
};

export default MaintenanceComponent;
