import { useNavigate, useParams } from "react-router-dom";
import {Box, Card, CardActionArea, CardContent, CardMedia, Divider, Grid, Typography} from "@mui/material";
import React, { useEffect, useState } from "react";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import SpeedIcon from '@mui/icons-material/Speed';
import { VehicleTripsById } from "../types/Vehicles";
import axios from "axios";
import getImageUrl from "../utils/getImageUrl";
import calculateDaysSpent from "../utils/calculateNumDays";
import DoneOutlinedIcon from '@mui/icons-material/DoneOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import {Col, Row, Button} from "react-bootstrap";
import getApiConfig from "../utils/ApiConfig";



export default function TripByIdComponent() {
    const apiPath = getApiConfig();
    const { trip_id } = useParams<{ trip_id: string }>();
    const [trip, setTrip] = useState<VehicleTripsById>({
        booking_or_walkin: "",
        destination: "",
        distance: 0,
        end_date: "",
        odometer_end: 0,
        odometer_start: 0,
        origin: "",
        requested_category: "",
        start_date: "",
        vehicle_category: "",
        vehicle_commissioned: "",
        vehicle_decommissioned: "",
        vehicle_odometer: 0,
        vehicle_rego: 0,
    });

    useEffect(() => {
        fetchVehiclesTrips();
    }, []);

    const fetchVehiclesTrips = async () => {
        try {
            const response = await axios.get(`${apiPath.apiPath}?`, {
                params: {
                    trip_id: trip_id,
                }
            });
            setTrip(response.data.tripById[0]);
        } catch (error) {
            console.error("Error fetching trip", error);
        }
    }
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/vehicle/${trip.vehicle_rego}`);
    };

    return (
        <Grid container justifyContent="center" style={{ padding: '20px' }}>
            <Grid item xs={12} sm={12} md={9}>
                <Card sx={{ display: 'flex', backgroundColor: '#f5f5f5', color: 'black', height: 'auto', padding: '16px' }}>

                    <CardMedia
                        component="img"
                        sx={{ width: {xs: 100, sm:150, md: 200, lg:290, xl: 400}, height: 'auto', objectFit: 'cover', marginRight: '12px' }}
                        image={getImageUrl(trip.vehicle_category)}
                        alt="Vehicle"
                    />
                    <CardContent sx={{ flex: '1 0 auto', padding: '16px', marginRight: '16px' }}>
                        <Typography variant="h5" component="div" sx={{ color: '#0D47A1', marginBottom: '16px' }}>
                            Trip Summary
                        </Typography>
                        <Row>
                            <Col>
                        {/* Location */}
                        <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                            <LocationOnIcon sx={{ marginRight: '8px', color: '#2196F3' }} />
                            {trip.origin} {"->"} {trip.destination}
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
                                <strong>Trip Distance:</strong> {trip.distance} km
                            </Typography>
                            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', marginBottom: '8px', marginTop: '8px' }}>
                                <SpeedIcon sx={{ marginRight: '8px', color: '#0277BD' }} />
                                <strong>Trip Odometer:</strong> {trip.odometer_start} km (started) - {trip.odometer_end} km (final)
                            </Typography>
                            <Typography variant="body2">
                                <strong>Current Odometer:</strong> {trip.vehicle_odometer} km
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
                                <strong>Duration: </strong> {` ${calculateDaysSpent(trip.start_date, trip.end_date)}| From: ${trip.start_date} to `}
                                {trip.end_date ? trip.end_date : 'Present'}
                            </Typography>
                        </Box>

                        {/* Additional Info */}
                        <Box sx={{ backgroundColor: '#E0F7FA', padding: '10px', borderRadius: '4px', marginBottom: '8px' }}>
                            {/* Booking Type */}
                            <Typography variant="body2">
                                <strong>Vehicle Reg No:</strong> {trip.vehicle_rego}
                            </Typography>

                            <Typography variant="body2">
                                <strong>Booking Type:</strong> {trip.booking_or_walkin}
                            </Typography>


                            {/* Requested and Booked Vehicle */}
                            <Typography variant="body2">
                                <strong>Requested Vehicle:</strong> {trip.requested_category.replace(/_/g, ' ')}
                                <span style={{ margin: '0 5px' }}>|</span>
                                <strong>Booked Vehicle:</strong> {trip.vehicle_category.replace(/_/g, ' ')}
                                {trip.requested_category === trip.vehicle_category ? (
                                    <DoneOutlinedIcon sx={{ marginLeft: '10px', color: 'green' }} />
                                ) : (
                                    <CloseOutlinedIcon sx={{ marginLeft: '10px', color: 'orange' }} />
                                )}
                            </Typography>
                        </Box>



                        {/* Commissioned/Decommissioned Status */}
                        <Grid item xs={12} sx={{
                            background: trip.vehicle_decommissioned === '' ? '#CCE0AC' : '#CCD3CA',
                            padding: '10px',
                            borderRadius: '4px',
                            color: trip.vehicle_decommissioned === '' ? 'green' : 'gray'
                        }}>
                            {trip.vehicle_decommissioned === '' ? (
                                <Typography variant="body2" sx={{ color: 'green' }}>
                                    Commissioned: {trip.vehicle_commissioned}
                                </Typography>
                            ) : (
                                <>
                                    <Typography variant="body2" sx={{ color: '#CC5500' }}>
                                        Decommissioned: {trip.vehicle_decommissioned}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: 'gray' }}>
                                        Commissioned: {trip.vehicle_commissioned}
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
