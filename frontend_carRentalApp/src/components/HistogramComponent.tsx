import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import axios from "axios";
import VehiclesCardComponent from "./VehiclesCardComponent";
import {VehicleFetched, VehicleLifetime} from "../types/Vehicles";
import PaginationComponent from "./PaginationComponent";
import {useNavigate} from "react-router-dom";
import FiltersComponent from "./FiltersComponent";
import LifecycleFilter from "./LifecycleFilter";
import getApiConfig from "../utils/ApiConfig";


ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface ServiceDuration {
    min_service_duration: number;
    max_service_duration: number;
    vehicle_count: number; // New property for vehicle count
}

interface HistogramProps {
    vehicleData: ServiceDuration[]; // Array of service duration objects
}
const apiPath = getApiConfig();
const VehicleHistogram = ({ vehicleData }: { vehicleData: ServiceDuration[] }) => {
    const [vehiclesData, setVehiclesData] = useState<VehicleFetched[]>([]); // State to hold the fetched vehicle data
    const [selectedBin, setSelectedBin] = useState<{ min_day: number; max_day: number } | null>(null); // State to hold selected bin info
    const [totalPages, setTotalPages] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [filters, setFilters] = useState<any>({});
    const [selectedFilter, setSelectedFilter] = useState<string | null>(null); // State for selected filter



    const [chartData, setChartData] = useState<any>({
        labels: [],
        datasets: [
            {
                label: 'Vehicle Count',
                data: [],
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    });

    useEffect(() => {
        if (!vehicleData || vehicleData.length === 0) return;

        const bins: number[] = vehicleData.map((item) => item.vehicle_count);
        const binLabels: string[] = vehicleData.map((item) => {
            const min = item.min_service_duration;
            const max = item.max_service_duration;
            return `${min} - ${max} days`; // Example: "600 - 800 days"
        });

        // Update chart data
        setChartData({
            labels: binLabels,
            datasets: [
                {
                    label: 'Vehicle Count',
                    data: bins,
                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                },
            ],
        });
    }, [vehicleData]);

    // Separate useEffect to fetch data when selectedBin changes
    useEffect(() => {
        const fetchVehicleData = async (page: number) => {
            if (selectedBin) {
                try {
                    const response = await axios.get(`${apiPath.apiPath}?page=${page}`, {
                        params: {
                            min_day: selectedBin.min_day,
                            max_day: selectedBin.max_day,
                            ASC:filters.ASC,
                            DESC:filters.DESC,
                            NeedMaintenance:filters.NeedMaintenance
                        },
                    });

                    // Save the result in the state
                    setVehiclesData(response.data.vehicleLifeCycle);
                    setTotalPages(response.data.totalVehiclesLifecyclePages);
                    console.log('Fetched vehicle data:', response.data.vehicleLifeCycle);
                    console.log('Fetched vehicle data total pages:', response.data.totalVehiclesLifecyclePages);
                } catch (error) {
                    console.error('Error fetching vehicle data:', error);
                }
            }
        };

        fetchVehicleData(currentPage);
    }, [selectedBin, currentPage, filters]); // Runs when selectedBin changes
    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setCurrentPage(value);
    };
    const handleClick = (event: any, elements: any) => {
        if (elements.length > 0) {
            const binIndex = elements[0].index;
            const binLabel = chartData.labels[binIndex];
            const [min_day, max_day] = binLabel.split(' - ').map((label: string) => parseInt(label));
            setSelectedBin({ min_day, max_day });
            setSelectedFilter(null); // Reset the selected filter when a new bin is clicked
            setFilters({});

        }
    };
    const handleFiltered = (filters: any) => {
        // Call fetchVehicles with the new filters and reset to the first page
        setFilters(filters);
        console.log("from lifecycle filters component", filters);
        setCurrentPage(1);
    };

    return (
        <div>
            <h2>Vehicle Lifetime Duration Histogram</h2>
            <Bar
                data={chartData}
                options={{
                    responsive: true,
                    plugins: {
                        legend: {
                            display: true,
                            position: 'top',
                        },
                        title: {
                            display: true,
                            text: 'Vehicle Lifetime Duration',
                        },
                    },
                    onClick: handleClick,
                }}
            />

            {vehiclesData.length > 0 && (
                <LifecycleFilter
                    onFiltered={handleFiltered}
                    selectedFilter={selectedFilter}
                    setSelectedFilter={setSelectedFilter} // Pass down the setter
                />
            )}
            {vehiclesData.length > 0 && (
            <VehiclesCardComponent
                vehiclesList={vehiclesData}
                // Set true or false based on layout preference
            />
            )}
            {vehiclesData.length > 0 && (
            <PaginationComponent
                count={totalPages}
                currentPage={currentPage}
                onPageChange={handlePageChange}
            />
            )}
        </div>
    );
};

export default VehicleHistogram;
