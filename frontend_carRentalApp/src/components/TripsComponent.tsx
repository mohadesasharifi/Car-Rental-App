import React, { useEffect, useState } from "react";
import axios from "axios";
import { VehicleTrips } from "../types/Vehicles";
import PaginationComponent from "./PaginationComponent";
import {useNavigate} from "react-router-dom";
import TripsCardComponent from "./TripsCardComponent"
import getApiConfig from "../utils/ApiConfig";


const TripsComponent: React.FC = () => {
    const [trips, setTrips] = useState<VehicleTrips[]>([]); // Correctly using useState
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(0)
    const apiPath = getApiConfig();
    const fetchTrips = async (page: number) => {
        try {
            const response = await axios.get(`${apiPath.apiPath}?page=${page}`);
            const tripsResult = response.data.trips || [];
            const total = response.data.totalTripsPages || 0;
            setTrips(tripsResult);
            setTotalPages(total);
            console.log("from Trips comp ", trips);


        } catch (error) {
            console.error("Error fetching trips", error);
        }
    };

    useEffect(() => {
        fetchTrips(currentPage);
    }, [currentPage]);


    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setCurrentPage(value);
    };



    return (
        <>
            <TripsCardComponent
                tripsList={trips}
            />

            <PaginationComponent
                count={totalPages}
                currentPage={currentPage}
                onPageChange={handlePageChange}
            />

        </>
    )
};

export default TripsComponent;
