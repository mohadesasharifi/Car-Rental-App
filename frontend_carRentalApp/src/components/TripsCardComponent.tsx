import {useNavigate} from "react-router-dom";
import {Box, Divider, Grid} from "@mui/material";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import React from "react";
import {TripsCardComponentProps} from "../types/Vehicles";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import calculateDaysSpent from "../utils/calculateNumDays";
import getApiConfig from "../utils/ApiConfig";
export default function TripsCardComponent({tripsList} : TripsCardComponentProps) {
    const apiPath = getApiConfig();
    const navigate = useNavigate();
    const handleCardClick = (trip_id:number):void => {
        navigate(`/trips/${trip_id}`);
    };
    console.log("from the tripCardComponent: ", tripsList?.length)
    return (
        <Grid container spacing={2} style={{ padding: '20px' }}>
            {tripsList && tripsList.length > 0 ? (
                tripsList.map((trip) => (
                    <Grid item key={trip.trip_id} xs={12} sm={6} md={4} lg={3}>
                        <Card sx={{ maxWidth: 345, backgroundColor: '#f0f0f0', borderRadius: '8px' }}>
                            <CardActionArea onClick={() => handleCardClick(trip.trip_id)}>
                                <CardContent>
                                    {/* Trip Title */}
                                    <Typography gutterBottom variant="h6" component="div" sx={{ display: 'flex', alignItems: 'center', color: '#0D47A1' }}>
                                        <DirectionsCarIcon sx={{ marginRight: '5px', color: '#1976D2' }} /> Trip Summary
                                    </Typography>

                                    {/* Divider */}
                                    <Divider sx={{ margin: '10px 0' }} />

                                    {/* Origin and Destination */}
                                    <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
                                        <LocationOnIcon sx={{ marginRight: '5px', color: '#2196F3' }} />
                                        {trip.origin}{" -> "}{trip.destination}
                                    </Typography>

                                    {/* Distance */}
                                    <Typography variant="body2" sx={{ marginTop: '8px', fontWeight: 'bold', color: '#333' }}>
                                        Distance: {trip.distance} km
                                    </Typography>

                                    {/* Date Range */}
                                    <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '8px' }}>
                                        <AccessTimeIcon sx={{ marginRight: '5px', color: '#757575' }} />
                                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                            Trip duration: {calculateDaysSpent(trip.start_day, trip.end_day)}
                                        </Typography>
                                    </Box>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                ))
            ) : (
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    No Trips available.
                </Typography>
            )}
        </Grid>
    );
}