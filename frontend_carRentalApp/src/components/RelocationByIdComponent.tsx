import { useNavigate, useParams } from "react-router-dom";
import { Box, Card, CardActionArea, CardContent, CardMedia, Divider, Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import SpeedIcon from '@mui/icons-material/Speed';
import {VehicleRelocationById} from "../types/Vehicles";
import axios from "axios";
import getImageUrl from "../utils/getImageUrl";
import calculateDaysSpent from "../utils/calculateNumDays";
import DoneOutlinedIcon from '@mui/icons-material/DoneOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import {Button, Col, Row} from "react-bootstrap";
import getApiConfig from "../utils/ApiConfig";

export default function RelocationByIdComponent() {
    const apiPath = getApiConfig();
    const { relocation_id } = useParams<{ relocation_id: string }>();
    const [relocation, setRelocation] = useState<VehicleRelocationById>({
        destination: "",
        distance: 0,
        end_day: "",
        origin: "",
        relocation_id: 0,
        start_day: "",
        vehicle_category: "",
        vehicle_commissioned: "",
        vehicle_decommissioned: "",
        vehicle_odometer: 0,
        vehicle_rego: ""
    });

    useEffect(() => {
        fetchRelocationById();
    }, []);

    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/vehicle/${relocation.vehicle_rego}`);
    };
    const fetchRelocationById = async () => {
        try {
            const response = await axios.get(`${apiPath.apiPath}?`, {
                params: {
                    relocation_id: relocation_id,
                }
            });
            setRelocation(response.data.relocationById[0]);
            console.log("From relocation by id: ", relocation_id);
            console.log("From relocation by id: ", response.data.relocationById);
        } catch (error) {
            console.error("Error fetching relocationById", error);
        }
    }

    return (
        <Grid container justifyContent="center" style={{ padding: '20px' }}>
            <Grid item xs={12} sm={12} md={9}>
                <Card sx={{ display: 'flex', backgroundColor: '#f5f5f5', color: 'black', height: 'auto', padding: '16px' }}>

                    <CardMedia
                        component="img"
                        sx={{ width: {xs: 100, sm:150, md: 200, lg:290, xl: 400}, height: 'auto', objectFit: 'cover', marginRight: '12px' }}
                        image={relocation && relocation.vehicle_category ? getImageUrl(relocation.vehicle_category) : ''}
                        alt="Vehicle"
                    />
                    <CardContent sx={{ flex: '1 0 auto', padding: '16px', marginRight: '16px' }}>
                        <Typography variant="h5" component="div" sx={{ color: '#0D47A1', marginBottom: '16px' }}>
                            Vehicle Relocation Summary
                     </Typography>
                        <Row>
                        <Col>
                        {/* Location */}
                            <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                                <LocationOnIcon sx={{ marginRight: '8px', color: '#2196F3' }} />
                                {relocation.origin} {"->"} {relocation.destination}
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
                                <strong>Vehicle Reg No:</strong> {relocation.vehicle_rego}
                            </Typography>
                            <Typography variant="body2">
                                <strong>Relocation distance:</strong> {relocation.distance} km
                            </Typography>
                            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', marginBottom: '8px', marginTop: '8px' }}>
                                <SpeedIcon sx={{ marginRight: '8px', color: '#0277BD' }} />
                                <strong>Vehicle Odometer: </strong> {relocation.vehicle_odometer} km
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
                                <strong>Relocation Duration: </strong>{` ${calculateDaysSpent(relocation.start_day, relocation.end_day)}| From: ${relocation.start_day} to `}
                                {relocation.end_day ? relocation.end_day : 'Present'}
                            </Typography>
                        </Box>

                        {/* Additional Info */}
                        <Box sx={{ backgroundColor: '#E0F7FA', padding: '10px', borderRadius: '4px', marginBottom: '8px' }}>
                            {/* Booking Type */}

                            {/* Requested and Booked Vehicle */}
                            <Typography variant="body2">
                                <strong>Vehicle Type:</strong> {relocation.vehicle_category.replace(/_/g, ' ')}
                            </Typography>
                        </Box>



                        {/* Commissioned/Decommissioned Status */}
                        <Grid item xs={12} sx={{
                            background: relocation.vehicle_decommissioned === '' ? '#CCE0AC' : '#CCD3CA',
                            padding: '10px',
                            borderRadius: '4px',
                            color: relocation.vehicle_decommissioned === '' ? 'green' : 'gray'
                        }}>
                            {relocation.vehicle_decommissioned === '' ? (
                                <Typography variant="body2" sx={{ color: 'green' }}>
                                    Commissioned: {relocation.vehicle_commissioned}
                                </Typography>
                            ) : (
                                <>
                                    <Typography variant="body2" sx={{ color: '#CC5500' }}>
                                        Decommissioned: {relocation.vehicle_decommissioned}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: 'gray' }}>
                                        Commissioned: {relocation.vehicle_commissioned}
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
