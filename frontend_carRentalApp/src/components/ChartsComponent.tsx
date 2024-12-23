import React, {useEffect, useState} from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import {Indicators, IncomingMovements, OutgoingMovements} from "../types/Vehicles";
import axios from "axios";
import {Col, Container} from "react-bootstrap";
import OutgoingMovementsChart from "./OutgoingMovementsChart";
import IndicatorChartComponent from "./IndicatorChartComponent";
import IncomingMovementsChart from "./IncomingMovementsCharts";
import CombinedMovementsChart from "./MovementCharts";
import FiltersComponent from "./FiltersComponent";
import IndicatorsFiltersComponent from "./IndicatorsFiltersComponent";
import getApiConfig from "../utils/ApiConfig";
// Register components to use them in the chart


const LineChart: React.FC = () => {
    const apiPath = getApiConfig();

    ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);
    // quarterly_indicators
    const [indicators, setIndicators] = useState<Indicators[]>([]);
    const [outgoingMovements, setOutgoingMovements] = useState<OutgoingMovements[]>([]);
    const [incomingMovements, setIncomingMovements] = useState<IncomingMovements[]>([]);
    const [filters, setFilters] = useState<any>({});
    // const [context, setContext] = useState('linearCharts');


    // useEffect(() => {
    //     fetchIncomingMovement()
    // }, []);

    // const fetchIncomingMovement = async () => {
    //     const context = "incomingMovement"
    //     try{
    //         const response = await axios.get(`${apiPath.apiPath}?`
    //             , {
    //                 params: {
    //                     context:context
    //                 }});
    //
    //         const incomingMovement = response.data.incomingMovement;
    //         console.log("Incoming Movement component",  incomingMovement);
    //         setIncomingMovements(incomingMovement);
    //     }catch (error){
    //         console.error("Error fetching vehicles", error);
    //     }
    // }
    const handleFiltered = (filters: any) => {
        // Call fetchVehicles with the new filters and reset to the first page
        setFilters(filters);
        console.log("from vehicle component", filters);
    };


    return(
        <div>

            <Container>
                <Col>
                    <div style={{margin: '20px auto', padding: '10px'}}>
                        <IndicatorsFiltersComponent onFiltered={handleFiltered}/>
                    </div>
                </Col>
                <Col md={9}>
                    <div style={{margin: '20px auto', padding: '10px'}}>
                        <IndicatorChartComponent filters={filters}/>
                    </div>
                </Col>

                <Col md={9}>
                    <div style={{margin: '20px auto', padding: '10px'}}>
                        <OutgoingMovementsChart/>
                    </div>
                </Col>
                <Col md={9}>
                    <div style={{margin: '20px auto', padding: '10px'}}>
                        <IncomingMovementsChart/>
                    </div>
                </Col>

                <Col md={9}>
                    <div style={{margin: '20px auto', padding: '10px'}}>
                        <CombinedMovementsChart/>
                    </div>
                </Col>

            </Container>
        </div>

    );
};

export default LineChart;

