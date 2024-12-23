import axios from "axios";
import {useState} from "react";
import getApiConfig from "../../utils/ApiConfig";
const apiPath = getApiConfig();
const fetchVehicles = async (page: number, filters?:any) => {
    console.log("Vehicle component, fetch vehicles: ", filters.min_odometer);
    const context = "vehicles";

    try{

        const response = await axios.get(`${apiPath.apiPath}?page=${page}`
            , {
                params: {

                    rego_no: filters?.rego_no,
                    odometer_min: filters.min_odometer,
                    odometer_max: filters.max_odometer,
                    commissioned_since: filters.commissioned_since,
                    decommissioned_since: filters.decommissioned_since,
                    categories: filters?.categories,
                    context:context
                }});
        console.log("From vehicles component vehicles: ", response.data);
        return (response.data);

    } catch (error){
        console.error("Error fetching vehicles", error);
        return { vehicles: [], totalPages: 0 };
    }
}
const fetchCostAndRates = async (category:string) => {
    const context = "costAndRates";
    try{
        const response = await axios.get(`${apiPath.apiPath}?`
            , {
                params: {
                    context:context,
                    category: category
                }});

        const costAndRates_result = response.data.costAndRates;
        console.log("From costAndRates component: ", response.data.costAndRates);
        return costAndRates_result;

    } catch (error){
        console.error("Error fetching cost and rates", error);
        return [];
    }
}

export default {fetchVehicles, fetchCostAndRates};