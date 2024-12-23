import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import axios from 'axios';
import { IncomingMovements } from '../types/Vehicles';
import getApiConfig from "../utils/ApiConfig";

// Register components to use them in the chart
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);
const apiPath = getApiConfig();
const IncomingMovementsChart: React.FC = () => {

    const [incomingMovements, setIncomingMovements] = useState<IncomingMovements[]>([]);
    const [chartData, setChartData] = useState<any>({
        labels: [],
        datasets: [],
    });
    const [loading, setLoading] = useState<boolean>(true); // Loading state

    useEffect(() => {
        fetchIncomingMovement();
    }, []);

    // Fetch incoming movements from API
    const fetchIncomingMovement = async () => {
        try {
            const response = await axios.get(apiPath.apiPath, {
                params: { context: 'incomingMovement' },
            });
            console.log('From incoming movements ', response.data.incomingMovement);
            const movements: IncomingMovements[] = response.data.incomingMovement;
            if (movements && movements.length > 0) {
                setIncomingMovements(movements);
                processChartData(movements);
                setLoading(false); // Turn off loading when done
            } else {
                console.warn('No movements found');
            }


        } catch (error) {
            console.error('Error fetching incoming movement', error);
            setLoading(false); // Turn off loading if there was an error
        }
    };

    // Prepare data for the chart using simple logic
    const processChartData = (data: IncomingMovements[]) => {
        // Process the data into the format required by chart.js
        const labels = [...new Set(data.map((d) => d.year_month))]; // Get unique years
        const locations = [...new Set(data.map((d) => d.location))]; // Get unique locations

        const datasets = locations.map((location) => {
            return {
                label: location,
                data: labels.map((year) => {
                    const record = data.find((d) => d.year_month === year && d.location === location);
                    return record ? record.movement : 0;
                }),
                borderColor: getRandomColor(),
                fill: false,
            };
        });
        setChartData({
            labels, // x-axis: unique years
            datasets, // y-axis: datasets per location
        });
    };

    // Helper function to generate random colors for each dataset
    const getRandomColor = () => {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };

    return (
        <div>
            {loading ? (
                <p>Loading chart for monthly incoming trips...</p>
            ) : (
                chartData && (
                    <Line
                        data={chartData}
                        options={{
                            responsive: true,
                            plugins: {
                                legend: {
                                    position: 'top',
                                },
                                title: {
                                    display: true,
                                    text: 'Monthly Incoming Trips Per Location',
                                },
                            },
                            scales: {
                                x: {
                                    title: {
                                        display: true,
                                        text: 'Year',
                                    },
                                },
                                y: {
                                    title: {
                                        display: true,
                                        text: 'Incoming Trips',
                                    },
                                },
                            },
                        }}
                    />
                )
            )}
        </div>
    );
};

export default IncomingMovementsChart;
