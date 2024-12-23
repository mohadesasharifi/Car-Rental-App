import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import { Vehicle, VehiclesCardComponentProps } from "../types/Vehicles";
import {Grid} from "@mui/material";
import {useNavigate} from "react-router-dom";
import getImageUrl from "../utils/getImageUrl"
import getApiConfig from "../utils/ApiConfig";


export default function VehiclesCardComponent({ vehiclesList}: VehiclesCardComponentProps) {
    const apiPath = getApiConfig();
    console.log("maintenance need from vehicles card ", vehiclesList)
    const navigate = useNavigate();
    const handleCardClick = (rego:string) => {
        // Navigate to the vehicle details page with the rego as a parameter
        navigate(`/vehicle/${rego}`);
    };

    return (
        <Grid container spacing={2} style={{padding: '20px'}}>
            {vehiclesList && vehiclesList.length > 0 ? (
                vehiclesList.map((vehicle) => (
                    <Grid item key={vehicle.vehicle_rego} xs={12} sm={6} md={4} lg={3}>
                        <Card sx={{maxWidth: 345,
                            backgroundColor: vehicle.maintenance_need === 1 ? '#EEE7D2' : '#f0f0f0'}}>
                            <CardActionArea onClick={() => handleCardClick(vehicle.vehicle_rego)}>
                                <CardMedia
                                    component="img"
                                    height="170"
                                    image={getImageUrl(vehicle.vehicle_category)}
                                    alt={vehicle.vehicle_category}
                                />
                                <CardContent>

                                    <Grid container direction="column">
                                        <Grid item xs={12}>
                                            <Typography variant="h6" gutterBottom sx={{color: '#0D47A1'}}>
                                                {vehicle.vehicle_rego}
                                            </Typography>


                                    </Grid>

                                        {vehicle.maintenance_need === 1 ? (
                                            <Grid item xs={6}>
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        color: '#D9A600', // Burnt yellow color
                                                    }}
                                                >
                                                    ⚠️ Needs Maintenance
                                                </Typography>
                                            </Grid>
                                        ) : (
                                            <Grid item xs={12} style={{ visibility: 'hidden' , marginBottom: '20px'  }}></Grid> // Empty space if maintenanceNeed is not 1
                                        )}
                                        <Grid item xs={12}>
                                            <Typography variant="body2" sx={{color: 'text.secondary'}}>
                                                Odometer: {vehicle.odometer}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography variant="body2" sx={{color: 'text.secondary'}}>
                                                {vehicle.vehicle_category}
                                            </Typography>
                                        </Grid>

                                        <Grid item xs={12} sx={{
                                            background: vehicle.decommissioned_date === '' ? '#CCE0AC' : '#CCD3CA',
                                            padding: '10px',
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
                                    </Grid>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                ))
            ) : (
                <Typography variant="body2" sx={{color: 'text.secondary'}}>
                    No vehicles available.
                </Typography>
            )}
        </Grid>
    );
}
