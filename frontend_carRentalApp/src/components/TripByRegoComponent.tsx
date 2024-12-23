// src/components/RelocationsComponent.tsx
import React, {useEffect, useState} from 'react';
import {VehicleTrips} from "../types/Vehicles";
import {useParams} from "react-router-dom";
import axios from "axios";
import PaginationComponent from "./PaginationComponent";
import TripsCardComponent from "./TripsCardComponent";
import getApiConfig from "../utils/ApiConfig";

const TripByRegoComponent: React.FC = () => {
    const apiPath = getApiConfig();
    const [trips, setTrips] = useState<VehicleTrips[]>([]);
    const [totalTripsPages, setTotalTripsPages] = useState<number>(0);
    const [currentTripsPage, setCurrentTripsPage] = useState<number>(1);

    const {rego} = useParams<{ rego: string }>();
    const fetchVehiclesTrips = async (page: number) => {
        try {
            const response = await axios.get(`${apiPath.apiPath}?page=${page}`
                , {
                    params: {
                        rego_no: rego,
                    }
                });

            const tripsResult = Array.isArray(response.data.vehicleTrips)
                ? response.data.vehicleTrips
                : [response.data.vehicleTrips];
            setTrips(tripsResult);
            console.log("from tripbyrego is it an array?", Array.isArray(tripsResult) )
            console.log("from tripsByRego componenet: ", response.data.vehicleTrips);
            setTotalTripsPages(response.data.totalTripsByRegPage);
        } catch (error) {
            console.error("Error fetching trips", error);
        }
    }
    useEffect(() => {
        fetchVehiclesTrips(currentTripsPage);
    }, [currentTripsPage, rego]);

    const handleTripsPageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setCurrentTripsPage(value);
    };

    return (
        <div className="vehicles-container">



            <TripsCardComponent
                tripsList={trips}
            />
            <PaginationComponent
                count={totalTripsPages}
                currentPage={currentTripsPage}
                onPageChange={handleTripsPageChange}
            />
        </div>);
};

export default TripByRegoComponent;
