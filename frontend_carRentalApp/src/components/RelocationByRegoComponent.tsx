import React, {useEffect, useState} from 'react';
import {Relocation} from "../types/Vehicles";
import {useParams} from "react-router-dom";
import axios from "axios";
import PaginationComponent from "./PaginationComponent";
import RelocationsCardComponent from "./RelocationsCardComponent";
import getApiConfig from "../utils/ApiConfig";

const RelocationByRegoComponent: React.FC = () => {
    const apiPath = getApiConfig();
    const [relocation, setRelocation] = useState<Relocation[]>([]);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);

    const {rego} = useParams<{ rego: string }>();
    const fetchVehicleRelocations = async (page: number) => {
        try {
            const response = await axios.get(`${apiPath.apiPath}?page=${page}`
                , {
                    params: {
                        rego_no: rego,
                    }
                });

            const result = Array.isArray(response.data.vehicleRelocations)
                ? response.data.vehicleRelocations
                : [response.data.vehicleRelocations];
            setRelocation(result);
            console.log("from vehicleRelocation is it an array?", Array.isArray(result) )
            console.log("from vehicleRelocation component: ", response.data);
            setTotalPages(response.data.totalRelocationsByRegPage);
        } catch (error) {
            console.error("Error fetching trips", error);
        }
    }
    useEffect(() => {
        fetchVehicleRelocations(currentPage);
    }, [currentPage, rego]);

    const handleTripsPageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setCurrentPage(value);
    };

    return (
        <div className="vehicles-container">



            <RelocationsCardComponent
                relocationsList={relocation}
            />
            <PaginationComponent
                count={totalPages}
                currentPage={currentPage}
                onPageChange={handleTripsPageChange}
            />
        </div>);
};

export default RelocationByRegoComponent;
