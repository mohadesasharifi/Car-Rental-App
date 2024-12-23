// src/components/LifetimeComponent.tsx
import React, { useEffect, useState } from 'react';
import VehicleHistogram from "./HistogramComponent";
import { Col, Container } from "react-bootstrap";
import axios from "axios";
import getApiConfig from "../utils/ApiConfig";

interface ServiceDuration {
    min_service_duration: number;
    max_service_duration: number;
    vehicle_count: number;
}
const LifetimeComponent: React.FC = () => {
    const apiPath = getApiConfig();
    const [serviceDuration, setServiceDuration] = useState<ServiceDuration[]>([]); // Initialize as an empty array

    const fetchServiceDuration = async () => {
        try {
            const context = 'vehicleLifecycleRange';
            const response = await axios.get(`${apiPath.apiPath}`, {
                params: { context: context },
            });

            const vehicleData = response.data.vehiclesInLifecycleRange;
            setServiceDuration(vehicleData);
            console.log("From vehicle lifecycle: ", vehicleData);
        } catch (error) {
            console.error("Error fetching ServiceDuration", error);
        }
    };

    useEffect(() => {
        fetchServiceDuration();
    }, []);

    return (
        <Container>
            <Col>
                <div style={{ margin: '20px auto', padding: '10px' }}>
                    <VehicleHistogram vehicleData={serviceDuration.length > 0 ? serviceDuration : []} />
                </div>
            </Col>
        </Container>
    );
};

export default LifetimeComponent;
