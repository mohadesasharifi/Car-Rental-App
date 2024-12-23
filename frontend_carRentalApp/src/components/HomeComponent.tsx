// src/components/HomeComponent.tsx
import React, {useEffect, useState} from 'react';
import axios from "axios";
import {SummaryItem, VehicleRates} from "../types/Vehicles";
import { Card, CardContent, Grid, Typography } from '@mui/material';
import {useNavigate} from "react-router-dom";
import VehiclesCardComponent from "./VehiclesCardComponent";
import VehicleCategoryCardComponent from "./VehicleCategoryCardComponent";
import API from "./utils/vehiclesRequest";
import getApiConfig from "../utils/ApiConfig";
const HomeComponent: React.FC = () => {
    const apiPath = getApiConfig();
    const [summary, setSummary] = useState<SummaryItem[]>([]);
    const [context, setContext] = useState("home");
    const [costAndRates, setCostAndRates] = useState<VehicleRates[]>([]);
    const navigate = useNavigate();
    useEffect(() => {
        fetchSummary();
    }, []);
    useEffect(() => {
        async function fetchData() {
            try {
                const costAndRates_result = await API.fetchCostAndRates("");
                console.log("From home ", costAndRates_result)
                setCostAndRates(costAndRates_result);
            } catch (error) {
                console.error("error fetching vehicles", error);
            }
        }
        fetchData()
    }, []);
    const fetchSummary = async () => {
        try{
            const response = await axios.get(`${apiPath.apiPath}?`
                , {
                    params: {
                        context:context
                    }});
            setContext("costAndRates")
            const summary_result = response.data.summary;
            console.log("From summary component vehicles: ", response.data.summary);
            setSummary(summary_result)

        } catch (error){
            console.error("Error fetching locations", error);
        }
    }


    // Click handlers for clickable items
    const handleTripsClick = () => {
        navigate(`/trips/`);
    };

    const handleRelocatedClick = () => {
        navigate(`/relocations/`);
    };

    const handleServicedClick = () => {
        navigate(`/maintenance/`);
    };
    return (
        <div style={{padding: '20px'}}>
            <Typography variant="h4" component="h1" gutterBottom textAlign="center">
                Summary
            </Typography>
            <Grid container justifyContent="center">
                <Grid item xs={12} md={10}>
                    <Card variant="outlined"
                          sx={{maxWidth: '100%', minHeight: '150px', padding: '16px', backgroundColor: '#f8f9fa'}}>
                        {summary.length > 0 && summary.map((item, index) => (
                            <CardContent key={index}>
                                <Grid container spacing={2}>
                                    {/* First row */}
                                    <Grid item xs={4}>
                                        <Typography variant="body1"
                                                    style={{ cursor: 'pointer', color: 'blue' }}
                                                    onClick={handleTripsClick}>
                                            <strong>Trips Completed:</strong> {item["Trips Completed"]}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Typography variant="body1">
                                            <strong>Trips Upgraded:</strong> {item["Trips Upgraded"]}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Typography variant="body1">
                                            <strong>Refused Bookings:</strong> {item["Refused Bookings"]}
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <Grid container spacing={2} sx={{marginTop: '12px'}}>
                                    {/* Second row */}
                                    <Grid item xs={4}>
                                        <Typography variant="body1">
                                            <strong>Refused Walk-ins:</strong> {item["Refused Walk-ins"]}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Typography variant="body1"
                                                    style={{ cursor: 'pointer', color: 'blue' }}
                                                    onClick={handleRelocatedClick}>
                                            <strong>Vehicles Relocated:</strong> {item["Vehicles Relocated"]}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Typography variant="body1"
                                                    style={{ cursor: 'pointer', color: 'blue' }}
                                                    onClick={handleServicedClick}>
                                            <strong>Vehicles Serviced:</strong> {item["Vehicles Serviced"]}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        ))}
                    </Card>
                </Grid>
            </Grid>

            <Typography
                variant="h4"
                component="h1"
                gutterBottom
                textAlign="center"
                sx={{ marginTop: '30px' }}
            >
                Categories
            </Typography>
            <Grid container justifyContent="center">
                <Grid item xs={12} md={10}>
                    <VehicleCategoryCardComponent vehicleRates={costAndRates} />
                </Grid>
            </Grid>
        </div>
    );
};


export default HomeComponent;
