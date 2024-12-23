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
import { MaintenancesCardComponentProps } from "../types/Vehicles";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import calculateDaysSpent from "../utils/calculateNumDays";
import getApiConfig from "../utils/ApiConfig";

export default function MaintenanceCardComponent({ maintenancesList }: MaintenancesCardComponentProps) {
    const navigate = useNavigate();
    const apiPath = getApiConfig();
    const handleCardClick = (maintenance_id: number): void => {
        navigate(`/maintenance/${maintenance_id}`);
    };
    console.log("from maintenance card ", maintenancesList)
    return (
        <Grid container spacing={2} style={{ padding: '20px' }}>
            {maintenancesList && maintenancesList.length > 0 ? (
                maintenancesList.map((maintenance) => (
                    <Grid item key={maintenance.maintenance_id} xs={12} sm={6} md={4} lg={3}>
                        <Card sx={{ maxWidth: 345, backgroundColor: '#f0f0f0', color: 'black' }}>
                            <CardActionArea onClick={() => handleCardClick(maintenance.maintenance_id)}>
                                <CardContent>
                                    <Typography gutterBottom variant="h6" component="div" sx={{ display: 'flex', alignItems: 'center', color: '#0D47A1'}}>
                                        <EngineeringIcon sx={{ marginRight: '5px', color: '#1976D2' }} /> Maintenance Summary
                                    </Typography>
                                    <Divider sx={{ margin: '10px 0', backgroundColor: '#90CAF9' }} />
                                    {/* Location */}
                                    <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
                                        <LocationOnIcon sx={{ marginRight: '5px', color: '#2196F3' }} />
                                        {maintenance.location.toUpperCase()}
                                    </Typography>

                                    {/* Vehicle Category */}
                                    <Typography variant="body2" sx={{ marginTop: '8px', fontWeight: 'bold' }}>
                                        <DirectionsCarIcon sx={{ marginRight: '5px' }} /> {maintenance.vehicle_category.replace(/_/g, ' ')}
                                    </Typography>

                                    {/* Date Range */}
                                    <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '8px' }}>
                                        <AccessTimeIcon sx={{ marginRight: '5px', color: '#B0BEC5' }} />
                                        <Typography variant="body2" sx={{ color: 'black' }}>
                                            Maintenance duration: {calculateDaysSpent(maintenance.start_day, maintenance.end_day)}
                                        </Typography>
                                    </Box>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                ))
            ) : (
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    No maintenances available.
                </Typography>
            )}
        </Grid>
    );
}
