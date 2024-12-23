import { useNavigate, useParams } from "react-router-dom";
import { Box, Card, CardActionArea, CardContent, CardMedia, Divider, Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import SpeedIcon from '@mui/icons-material/Speed';
import {VehicleMaintenanceById} from "../types/Vehicles";
import axios from "axios";
import getImageUrl from "../utils/getImageUrl";
import calculateDaysSpent from "../utils/calculateNumDays";
import DoneOutlinedIcon from '@mui/icons-material/DoneOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import {Button, Col, Row} from "react-bootstrap";
import getApiConfig from "../utils/ApiConfig";

export default function MaintenanceByIdComponent() {
    const apiPath = getApiConfig();
    const { maintenance_id } = useParams<{ maintenance_id: string }>();
    const [maintenance, setMaintenance] = useState<VehicleMaintenanceById>({
        end_date: "",
        location: "",
        maintenance_id: 0,
        mileage: 0,
        start_date: "",
        vehicle_category: "",
        vehicle_commissioned: "",
        vehicle_decommissioned: "",
        vehicle_odometer: 0,
        vehicle_rego: 0
    });
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/vehicle/${maintenance.vehicle_rego}`);
    };

    useEffect(() => {
        fetchMaintenanceById();
    }, []);

    const fetchMaintenanceById = async () => {
        try {
            const response = await axios.get(`${apiPath.apiPath}?`, {
                params: {
                    maintenance_id: maintenance_id,
                }
            });
            setMaintenance(response.data.maintenanceById[0]);
            console.log("From maintenanceBYID", response.data.maintenanceById);
        } catch (error) {
            console.error("Error fetching maintenanceById", error);
        }
    }

    return (
        <Grid container justifyContent="center" style={{ padding: '20px' }}>
            <Grid item xs={12} sm={12} md={9}>
                <Card sx={{ display: 'flex', backgroundColor: '#f5f5f5', color: 'black', height: 'auto', padding: '16px' }}>

                    <CardMedia
                        component="img"
                        sx={{ width: {xs: 100, sm:150, md: 200, lg:290, xl: 400}, height: 'auto', objectFit: 'cover', marginRight: '12px' }}
                        image={getImageUrl(maintenance.vehicle_category)}
                        alt="Vehicle"
                    />
                    <CardContent sx={{ flex: '1 0 auto', padding: '16px', marginRight: '16px' }}>
                        <Typography variant="h5" component="div" sx={{ color: '#0D47A1', marginBottom: '16px' }}>
                            Maintenance Summary
                        </Typography>
<Row>
    <Col>
                        {/* Location */}
                        <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                            <LocationOnIcon sx={{ marginRight: '8px', color: '#2196F3' }} />
                            Maintained at {maintenance.location}
                        </Typography>
    </Col>
                        <Col>
                            <Button style={{ marginBottom: '16px' }} onClick={handleClick}>
                                Vehicle Details
                            </Button>
                        </Col>
</Row>
                        {/* Odometer and Distance Info in a Box */}
                        <Box sx={{ padding: '12px', backgroundColor: '#E0F7FA', borderRadius: '8px' }}>
                            <Typography variant="body2">
                                <strong>Vehicle Reg No:</strong> {maintenance.vehicle_rego}
                            </Typography>
                            <Typography variant="body2">
                                <strong>Vehicle Mileage:</strong> {maintenance.mileage} km
                            </Typography>
                            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', marginTop: '8px' }}>
                                <SpeedIcon sx={{ marginRight: '8px', color: '#0277BD' }} />
                                <strong>Vehicle Odometer:</strong> {maintenance.vehicle_odometer} km
                            </Typography>

                        </Box>

                        {/* Date Range */}
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            backgroundColor: '#E0F7FA',
                            padding: '8px',
                            borderRadius: '4px' // Optional: To round the corners
                        }}>
                            <AccessTimeIcon sx={{ marginRight: '8px', color: 'grey' }} />
                            <Typography variant="body2">
                                <strong>Maintenance Duration: </strong>{` ${calculateDaysSpent(maintenance.start_date, maintenance.end_date)}| From: ${maintenance.start_date} to `}
                                {maintenance.end_date ? maintenance.end_date : 'Present'}
                            </Typography>
                        </Box>

                        {/* Additional Info */}
                        <Box sx={{ backgroundColor: '#E0F7FA', padding: '10px', borderRadius: '4px', marginBottom: '8px' }}>
                            {/* Booking Type */}

                            {/* Requested and Booked Vehicle */}
                            <Typography variant="body2">
                                <strong>Vehicle Type:</strong> {maintenance.vehicle_category.replace(/_/g, ' ')}
                            </Typography>
                        </Box>



                        {/* Commissioned/Decommissioned Status */}
                        <Grid item xs={12} sx={{
                            background: maintenance.vehicle_decommissioned === '' ? '#CCE0AC' : '#CCD3CA',
                            padding: '10px',
                            borderRadius: '4px',
                            color: maintenance.vehicle_decommissioned === '' ? 'green' : 'gray'
                        }}>
                            {maintenance.vehicle_decommissioned === '' ? (
                                <Typography variant="body2" sx={{ color: 'green' }}>
                                    Commissioned: {maintenance.vehicle_commissioned}
                                </Typography>
                            ) : (
                                <>
                                    <Typography variant="body2" sx={{ color: '#CC5500' }}>
                                        Decommissioned: {maintenance.vehicle_decommissioned}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: 'gray' }}>
                                        Commissioned: {maintenance.vehicle_commissioned}
                                    </Typography>
                                </>
                            )}
                        </Grid>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
}
