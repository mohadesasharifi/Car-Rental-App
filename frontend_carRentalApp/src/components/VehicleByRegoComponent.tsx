import React, { useEffect, useState } from 'react';
import {useParams, Link, useNavigate} from 'react-router-dom';
import { VehicleFetched } from "../types/Vehicles";
import axios from "axios";
import {Box, Button, Card, CardContent, CardMedia, Divider, Grid, Typography} from "@mui/material";
import getImageUrl from "../utils/getImageUrl";
import getApiConfig from "../utils/ApiConfig";



export default function VehicleByRegoComponent() {
    const apiPath = getApiConfig();
    const [vehicle, setVehicle] = useState<VehicleFetched>({
        commissioned_date: "",
        decommissioned_date: "",
        odometer: 0,
        vehicle_category: "",
        vehicle_rego: "",
        maintenance_need: 0
    });
    const [tripsCount, setTripsCount] = useState<number>(0);
    const [maintenancesCount, setMaintenancesCount] = useState<number>(0);
    const [relocationsCount, setRelocationsCount] = useState<number>(0);
    const { rego } = useParams<{ rego: string }>();

    const fetchVehicleData = async () => {
        try {
            const response = await axios.get(`${apiPath.apiPath}?`, {
                params: { rego_no: rego },
            });

            const vehicleData = response.data.vehicles.length > 0 ? response.data.vehicles[0] : null;
            setVehicle(vehicleData);
            setTripsCount(response.data.totalTripsByReg || 0);
            setMaintenancesCount(response.data.totalMaintenanceByReg || 0);
            setRelocationsCount(response.data.totalRelocationsByReg || 0);
            console.log("From vehicle by rego: ", tripsCount, maintenancesCount, relocationsCount);
        } catch (error) {
            console.error("Error fetching vehicle data", error);
        }
    };
    const navigate = useNavigate();
    useEffect(() => {
        fetchVehicleData();
    }, [rego]);

    return (
        <Grid container justifyContent="center" style={{ padding: '20px' }}>
            <Grid item xs={12} sm={12} md={9}>
                <Card sx={{ display: 'flex', backgroundColor: '#f5f5f5', color: 'black', padding: '16px' }}>
                    <CardMedia
                        component="img"
                        sx={{ width: { xs: 100, sm: 150, md: 250, lg: 300, xl: 400 }, height: 'auto', objectFit: 'cover', marginRight: '12px' }}
                        image={getImageUrl(vehicle.vehicle_category)}
                        alt="Vehicle"
                    />
                    <CardContent sx={{ flex: '1 0 auto' }}>
                        <Typography variant="h5" component="div" sx={{ color: '#0D47A1', marginBottom: '16px' }}>
                            Vehicle: {vehicle.vehicle_rego}
                        </Typography>
                        <Typography variant="body1" sx={{ marginBottom: '16px' }}>
                            Category: {vehicle.vehicle_category.replace(/_/g, ' ')}
                        </Typography>
                        <Typography variant="body1" sx={{ marginBottom: '16px' }}>
                            Odometer: {vehicle.odometer} km
                        </Typography>
                        <Grid item xs={12} sx={{
                            background: vehicle.decommissioned_date === '' ? '#CCE0AC' : '#CCD3CA',
                            padding: '10px',
                            marginBottom: '8px',
                            // Optional: Add padding for better appearance
                            borderRadius: '4px', // Optional: Add border radius for rounded corners
                            color: vehicle.decommissioned_date === '' ? 'white' : 'white' // Change text color as needed
                        }}>
                            {vehicle.decommissioned_date === '' ? (
                                <Typography variant="body2" sx={{color: 'green'}}>
                                    Commissioned: {vehicle.commissioned_date}
                                </Typography>
                            ) : (
                                <>
                                    <Typography variant="body2" sx={{color: '#CC5500'}}>
                                        Decommissioned: {vehicle.decommissioned_date}
                                    </Typography>
                                    <Typography variant="body2" sx={{color: 'gray'}}>
                                        Commissioned: {vehicle.commissioned_date}
                                    </Typography>
                                </>
                            )}
                        </Grid>

                        <Divider
                            sx={{
                                marginBottom: '16px',
                                borderColor: 'black',
                            }}
                        />

                        {/* Summary of Trips, Maintenance, and Relocations */}
                        <Typography variant="h6" sx={{ color: '#0D47A1', marginBottom: '16px' }}>
                            Summary:
                        </Typography>
                        <Typography variant="body2">
                            Trips: {tripsCount} | Maintenance: {maintenancesCount} | Relocations: {relocationsCount}
                        </Typography>

                        {/* Action buttons */}
                        <Box sx={{ display: 'flex', gap: 2, marginTop: '16px' }}>
                            <Button
                                variant="contained"
                                color="primary"
                                component={Link}
                                to={`/vehicle/${rego}/trips/`}
                                disabled={tripsCount === 0}
                            >
                                View Trips
                            </Button>
                            <Button
                                variant="contained"
                                color="secondary"
                                component={Link}
                                to={`/vehicle/${rego}/maintenance/`}
                                disabled={maintenancesCount === 0}
                            >
                                View Maintenance
                            </Button>
                            <Button
                                variant="contained"
                                color="info"
                                component={Link}
                                to={`/vehicle/${rego}/relocations/`}
                                disabled={relocationsCount === 0}
                            >
                                View Relocations
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
}
