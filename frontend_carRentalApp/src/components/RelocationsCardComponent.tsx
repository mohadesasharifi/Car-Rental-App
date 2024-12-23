import { useNavigate } from "react-router-dom";
import { Box, Divider, Grid } from "@mui/material";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import React from "react";
import EngineeringIcon from '@mui/icons-material/Engineering';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import EmojiTransportationIcon from '@mui/icons-material/EmojiTransportation';
import {RelocationsCardComponentProps} from "../types/Vehicles";
import calculateDaysSpent from "../utils/calculateNumDays";
import getApiConfig from "../utils/ApiConfig";

export default function RelocationsCardComponent({ relocationsList }: RelocationsCardComponentProps) {
    const navigate = useNavigate();
    const apiPath = getApiConfig();
    const handleCardClick = (relocation_id:number) => {
        navigate(`/relocations/${relocation_id}`);
    };

    return (
        <Grid container spacing={2} style={{ padding: '20px' }}>
            {relocationsList && relocationsList.length > 0 ? (
                relocationsList.map((relocation) => (
                    <Grid item key={relocation.relocation_id} xs={12} sm={6} md={4} lg={3}>
                        <Card sx={{ maxWidth: 345, backgroundColor: '#f0f0f0', color: 'black' }}>
                            <CardActionArea onClick={() => handleCardClick(relocation.relocation_id)}>
                                <CardContent>
                                    <Typography gutterBottom variant="h6" component="div" sx={{ display: 'flex', alignItems: 'center', color: '#0D47A1' }}>
                                        <EmojiTransportationIcon sx={{ marginRight: '5px', color: '#1976D2' }} /> Relocation Summary
                                    </Typography>
                                    <Divider sx={{ margin: '10px 0', backgroundColor: '#90CAF9' }} />
                                    {/* Location */}
                                    <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                                        <LocationOnIcon sx={{ marginRight: '5px', color: '#2196F3' }} />
                                        {relocation.origin} {"->"} {relocation.destination}
                                    </Typography>

                                    {/* Vehicle Category */}
                                    <Typography variant="body2" sx={{ fontWeight: 'bold', marginBottom: '8px' }}>
                                        <DirectionsCarIcon sx={{ marginRight: '5px' }} /> {relocation.vehicle_category.replace(/_/g, ' ')}
                                    </Typography>

                                    {/* Distance */}
                                    <Typography variant="body2" sx={{ marginTop: '8px', fontWeight: 'bold', color: '#0D47A1' }}>
                                        Distance: {relocation.distance} km
                                    </Typography>

                                    {/* Date Range */}
                                    <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '8px' }}>
                                        <AccessTimeIcon sx={{ marginRight: '5px', color: '#B0BEC5' }} />
                                        <Typography variant="body2" sx={{ color: 'black' }}>
                                            Relocation duration: {calculateDaysSpent(relocation.start_day, relocation.end_day)}
                                        </Typography>
                                    </Box>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                ))
            ) : (
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    No relocations available.
                </Typography>
            )}
        </Grid>
    );
}
