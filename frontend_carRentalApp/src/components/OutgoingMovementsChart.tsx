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
import { OutgoingMovements } from '../types/Vehicles';
import getApiConfig from "../utils/ApiConfig";

// Register components to use them in the chart
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const OutgoingMovementsChart: React.FC = () => {
    const apiPath = getApiConfig();
    const [outgoingMovements, setOutgoingMovements] = useState<OutgoingMovements[]>([]);
    const [chartData, setChartData] = useState<any>({
        labels: [],
        datasets: [],
    });
    const [loading, setLoading] = useState<boolean>(true); // Loading state

    useEffect(() => {
        fetchOutgoingMovement();
    }, []);

    // Fetch outgoing movements from API
    const fetchOutgoingMovement = async () => {
        const context = 'outGoingMovement';
        try {
            const response = await axios.get(apiPath.apiPath, {
                params: { context },
            });
            console.log('From outgoing movements ', response.data.outgoingMovement);
            const movements: OutgoingMovements[] = response.data.outgoingMovement;
            if (movements && movements.length > 0) {
                setOutgoingMovements(movements);
                processChartData(movements);
                setLoading(false); // Turn off loading when done
            } else {
                console.warn('No movements found');
            }


        } catch (error) {
            console.error('Error fetching outgoing movement', error);
            setLoading(false); // Turn off loading if there was an error
        }
    };

    // Prepare data for the chart using simple logic
    const processChartData = (data: OutgoingMovements[]) => {
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
                <p>Loading chart for monthly outgoing trips...</p>
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
                                    text: 'Monthly Outgoing Trips Per Location',
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
                                        text: 'Outgoing Trips',
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

export default OutgoingMovementsChart;
