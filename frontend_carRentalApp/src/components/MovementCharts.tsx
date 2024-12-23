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
import { CombinedMovements } from '../types/Vehicles';
import getApiConfig from "../utils/ApiConfig";

// Register components to use them in the chart
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const CombinedMovementsChart: React.FC = () => {
    const apiPath = getApiConfig();
    const [chartData, setChartData] = useState<any>({
        labels: [],
        datasets: [],
    });
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        fetchMovements();
    }, []);

    const fetchMovements = async () => {
        try {
            const response = await axios.get(apiPath.apiPath, {
                params: { context: 'combinedMovements' },
            });
            const movements = response.data.combinedMovement;
            processChartData(movements);
            console.log("from combined movement ", movements);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching movements', error);
            setLoading(false);
        }
    };

    const processChartData = (data: CombinedMovements[]) => {
        const labels = [...new Set(data.map(d => d.date))]; // Assuming there's a date field
        const locations = [...new Set(data.map(d => d.location))] as Array<keyof typeof colors.outgoing>;

        const outgoingDatasets = locations.map(location => ({
            label: `${location} (Outgoing)`,
            data: labels.map(date => {
                const record = data.find(d => d.date === date && d.location === location && d.type === 'outgoing');
                return record ? record.movement : 0;
            }),
            borderColor: colors.outgoing[location], // Use specific outgoing colors
            // backgroundColor: 'rgba(0, 0, 0, 0)',
            borderWidth: 1,
            pointRadius: 1,
            fill: true, // Fill area under the line
        }));

        const incomingDatasets = locations.map(location => ({
            label: `${location} (Incoming)`,
            data: labels.map(date => {
                const record = data.find(d => d.date === date && d.location === location && d.type === 'incoming');
                return record ? record.movement : 0;
            }),
            borderColor: colors.incoming[location], // Use specific incoming colors
            borderWidth: 1,
            pointRadius: 1,
            borderDash: [5, 5], // Dotted line style
            fill: false, // No fill for incoming
        }));

        setChartData({
            labels,
            datasets: [...outgoingDatasets, ...incomingDatasets],
        });
    };

    const colors = {
        outgoing: {
            'CHRISTCHURCH': '#FF5733', // Bright Red
            'AUCKLAND': '#33C1FF',     // Bright Blue
            'WELLINGTON': '#FF33A1',   // Bright Pink
            'DUNEDIN': '#FFD833',      // Bright Yellow
            'QUEENSTOWN': '#4CAF50',   // Bright Green
        },
        incoming: {
            'CHRISTCHURCH': '#5D3B8B', // Dark Purple
            'AUCKLAND': '#4A90E2',     // Blue
            'WELLINGTON': '#B86F00',   // Dark Orange
            'DUNEDIN': '#C70039',      // Deep Red
            'QUEENSTOWN': '#C0C0C0',   // Gray
        },
    } as const;
    return (
        <div>
            {loading ? (
                <p>Loading daily movement chart...</p>
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
                                    text: 'Daily Outgoing and Incoming Trips Per Location',
                                },
                            },
                            scales: {
                                x: {
                                    title: {
                                        display: true,
                                        text: 'Date',
                                    },
                                },
                                y: {
                                    title: {
                                        display: true,
                                        text: 'Trips',
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

export default CombinedMovementsChart;
