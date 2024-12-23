// IndicatorsChart.tsx
import React, {useEffect, useState} from 'react';
import { Line } from 'react-chartjs-2';
import {Indicators, IndicatorsFiltersComponentProps} from "../types/Vehicles";
import { Container, Col } from "react-bootstrap";
import axios from "axios";
import * as http from "node:http";
import {
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip
} from "chart.js";
import getApiConfig from "../utils/ApiConfig";

interface IndicatorChartProps {
    filters: {
        start_day: string; // Replace with actual type if different
        end_day: string;
        categories: string[];
    };
}
const IndicatorsChart: React.FC<IndicatorChartProps> = ({ filters }) => {
    const apiPath = getApiConfig();
    ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);
    const [indicators, setIndicators] = useState<Indicators[]>([]);

    useEffect(() => {
        fetchIndicators(filters)
    }, [filters]);

    const fetchIndicators = async (filters?:any) => {
        console.log("Charts component, fetch indicators: ", );
        const context ="linearCharts";
        try{
            const response = await axios.get(`${apiPath.apiPath}?`
                , {
                    params: {
                        Start_date: filters?.Start_date,
                        End_date: filters?.Start_date,
                        categories: filters?.Start_date,
                        context:context
                    }});

            const indicators_result = response.data.quarterly_indicators;
            setIndicators(indicators_result);

        } catch (error){
            console.error("Error fetching vehicles", error);
        }
    }
    const labels = indicators.map((item: Indicators) => item.Period);

    const data = {
        labels: labels,
        datasets: [
            {
                label: 'Hire Revenue',
                data: indicators.map((item) => item.Hire_revenue),
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
            },
            {
                label: 'Vehicle Purchasing',
                data: indicators.map((item) => item.Vehicle_purchasing),
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
            },
            {
                label: 'Maintenance Expenses',
                data: indicators.map((item) => item.Maintenance_expenses),
                borderColor: 'rgb(54, 162, 235)',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
            },
            {
                label: 'Relocations Expenses',
                data: indicators.map((item) => item.Relocations_expenses),
                borderColor: 'rgb(255, 206, 86)',
                backgroundColor: 'rgba(255, 206, 86, 0.2)',
            },
            {
                label: 'Upgrade Losses',
                data: indicators.map((item) => item.Upgrade_losses),
                borderColor: 'rgb(153, 102, 255)',
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
            },
            {
                label: 'Profit',
                data: indicators.map((item) => item.Profit),
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { position: 'top' as const }, // Use 'as const' to ensure type compatibility
            title: {
                display: true,
                text: 'Quarterly Indicators',
            },
        },
    };

    return (
        <Line data={data} options={options}/>
    );
};

export default IndicatorsChart;
