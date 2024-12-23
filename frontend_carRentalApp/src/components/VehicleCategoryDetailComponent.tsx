// src/components/RelocationsComponent.tsx
import React, {useEffect, useState} from 'react';
import {Link, useParams} from "react-router-dom";
import getImageUrl from "../utils/getImageUrl";
import {VehicleFetched, VehicleRates} from "../types/Vehicles";
import {Box, Button, Card, CardContent, CardMedia, Divider, Grid, Typography} from "@mui/material";
import API from "./utils/vehiclesRequest";
import VehiclesCardComponent from "./VehiclesCardComponent";
import PaginationComponent from "./PaginationComponent";
import getApiConfig from "../utils/ApiConfig";

const VehicleCategoryDetailComponent: React.FC = () => {
    const apiPath = getApiConfig();
    const [vehicleRates, setVehicleRates] = useState<VehicleRates>({
        daily_hire_rate: 0,
        flat_maintenance_rate: 0,
        hourly_relocation_rate: 0,
        monthly_lease_cost: 0,
        purchase_cost: 0,
        vehicle_category: ""
    });
    const {category} = useParams<{ category: string }>();
    const [vehicles, setVehicles] = useState<VehicleFetched[]>([]);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [filters, setFilters] = useState<{ categories: string[] }>({
        categories: [category||""] // Set the category from URL params here
    });
    const [context, setContext] = useState(vehicles);

    useEffect(() => {
        async function fetchData() {
            try {
                console.log("what is category", category);
                const costAndRates_result = await API.fetchCostAndRates(category||"");
                setVehicleRates(costAndRates_result[0]);
            } catch (error) {
                console.error("error fetching vehicles", error);
            }
        }
        fetchData()
    }, [category]);

    useEffect(() => {
        async function fetchData() {
            try {
                const vehicles_result = await API.fetchVehicles(currentPage, filters);
                setVehicles(vehicles_result.vehicles);
                setTotalPages(vehicles_result.totalPages);
            } catch (error) {
                console.error("error fetching vehicles", error);
            }
        }
        fetchData()
    }, [currentPage, filters]);
    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setCurrentPage(value);
    };



    return (
        <Grid container justifyContent="center" style={{ padding: '20px' }}>
            <Grid item xs={12} sm={12} md={10}>
                <Card sx={{ display: 'flex', backgroundColor: '#f5f5f5', color: 'black', padding: '16px' }}>
                    <CardMedia
                        component="img"
                        sx={{ width: { xs: 100, sm: 150, md: 250, lg: 300, xl: 400 }, height: 'auto', objectFit: 'cover', marginRight: '12px' }}
                        image={getImageUrl(vehicleRates.vehicle_category)}
                        alt="Vehicle"
                    />
                    <CardContent sx={{ flex: '1 0 auto' }}>
                        <Typography variant="h5" component="div" sx={{ color: '#0D47A1', marginBottom: '16px' }}>
                            Category: {vehicleRates.vehicle_category.replace(/_/g, ' ')}
                        </Typography>
                        <Typography variant="body1" sx={{ marginBottom: '16px' }}>
                            Daily Hire Rate: NZD {vehicleRates.daily_hire_rate}
                        </Typography>
                        <Typography variant="body1" sx={{ marginBottom: '16px' }}>
                            Monthly Lease Cost: NZD {vehicleRates.monthly_lease_cost}
                        </Typography>
                        <Typography variant="body1" sx={{ marginBottom: '16px' }}>
                            Flat Maintenance Rate: NZD {vehicleRates.flat_maintenance_rate}
                        </Typography>
                        <Typography variant="body1" sx={{ marginBottom: '16px' }}>
                            Hourly Relocation Rate: NZD {vehicleRates.hourly_relocation_rate}
                        </Typography>
                        <Typography variant="body1" sx={{ marginBottom: '16px' }}>
                            Purchase Cost: NZD {vehicleRates.purchase_cost}
                        </Typography>


                        <Divider
                            sx={{
                                marginBottom: '16px',
                                borderColor: 'black',
                            }}
                        />


                    </CardContent>
                </Card>

                <VehiclesCardComponent
                    vehiclesList={vehicles}
                    // Set true or false based on layout preference
                />
                <PaginationComponent
                    count={totalPages}
                    currentPage={currentPage}
                    onPageChange={handlePageChange}
                />
            </Grid>

        </Grid>
    );
};

export default VehicleCategoryDetailComponent;
