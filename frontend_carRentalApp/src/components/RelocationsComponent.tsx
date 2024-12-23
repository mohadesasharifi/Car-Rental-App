import React, { useEffect, useState } from "react";
import axios from "axios";
import {Relocation} from "../types/Vehicles";
import PaginationComponent from "./PaginationComponent";
import RelocationsCardComponent from "./RelocationsCardComponent";
import getApiConfig from "../utils/ApiConfig";

const RelocationsComponent: React.FC = () => {
    const [relocations, setRelocations] = useState<Relocation[]>([]); // Correctly using useState
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(0)
    const apiPath = getApiConfig();
    const fetchRelocations = async (page: number) => {
        try {
            const response = await axios.get(`${apiPath.apiPath}?page=${page}`);
            const relocationsResult = response.data.relocations || [];
            const total = response.data.totalRelocationsPage || 0;
            console.log("from the relocations component: ", response.data);
            setRelocations(relocationsResult);
            setTotalPages(total);

        } catch (error) {
            console.error("Error fetching trips", error);
        }
    };

    useEffect(() => {
        fetchRelocations(currentPage);
    }, [currentPage]);


    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setCurrentPage(value);
    };
   return (
        <>
            <RelocationsCardComponent
                relocationsList={relocations}
            />

            <PaginationComponent
                count={totalPages}
                currentPage={currentPage}
                onPageChange={handlePageChange}
            />

        </>
    )
};

export default RelocationsComponent;


