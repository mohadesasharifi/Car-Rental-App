import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import {vehicleRatesProps} from "../types/Vehicles";
import {Grid} from "@mui/material";
import {useNavigate} from "react-router-dom";
import getImageUrl from "../utils/getImageUrl"
import getApiConfig from "../utils/ApiConfig";


export default function VehicleCategoryCardComponent({ vehicleRates}: vehicleRatesProps) {
    const apiPath = getApiConfig();
    const navigate = useNavigate();
    const handleCardClick = (category:string) => {
        // Navigate to the vehicle details page with the rego as a parameter
        navigate(`/category/${category}`);
    };

    return (
        <Grid container spacing={2} style={{padding: '20px'}}>
            {vehicleRates && vehicleRates.length > 0 ? (
                vehicleRates.map((vehicle) => (
                    <Grid item key={vehicle.vehicle_category} xs={12} sm={6} md={4} lg={3}>
                        <Card sx={{maxWidth: 345}}>
                            <CardActionArea onClick={() => handleCardClick(vehicle.vehicle_category)}>
                                <CardMedia
                                    component="img"
                                    height="170"
                                    image={getImageUrl(vehicle.vehicle_category)}
                                    alt={vehicle.vehicle_category}
                                />
                                <CardContent>
                                    <Grid container direction="column">

                                        <Grid item xs={12}>
                                            <Typography variant="body2" sx={{color: 'text.secondary'}}>
                                                From NZD ${vehicle.daily_hire_rate}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography variant="body2" sx={{color: 'text.secondary'}}>
                                                From NZD ${vehicle.monthly_lease_cost}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                ))
            ) : (
                <Typography variant="body2" sx={{color: 'text.secondary'}}>
                    Loading ...
                </Typography>
            )}
        </Grid>
    );
}
