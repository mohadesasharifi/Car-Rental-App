// src/components/RelocationsComponent.tsx
import React, {useEffect, useState} from 'react';
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIconRetina from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import getApiConfig from "../utils/ApiConfig";
// Fix Leaflet's default icon issues in TypeScript

interface Location {
    name: string;
    latitude: number;
    longitude: number;
}
// Set default icon for Leaflet markers
const DefaultIcon = L.icon({
    iconUrl: markerIcon,
    iconRetinaUrl: markerIconRetina,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// This line is necessary to make sure Leaflet uses this icon by default
L.Marker.prototype.options.icon = DefaultIcon;
const LocationsComponent: React.FC = () => {
    const apiPath = getApiConfig();
    const [locations, setLocations] = useState<Location[]>([]);
    const [context, setContext] = useState("locations");


    const fetchLocations = async () => {
        try{
            const response = await axios.get(`${apiPath.apiPath}?`
                , {
                    params: {
                        context:context
                    }});

            const locations_result = response.data.locations;
            console.log("From locations component vehicles: ", response.data.locations);
            await geocodeCities(locations_result);


        } catch (error){
            console.error("Error fetching locations", error);
        }
    }
    // Geocode city names to get lat/lng
    const geocodeCities = async (cities: string[]) => {
        const geocodedLocations = await Promise.all(
            cities.map(async (cityName) => {
                const geoData = await geocodeCity(cityName);
                return { name: cityName, latitude: geoData.lat, longitude: geoData.lon };
            })
        );
        setLocations(geocodedLocations);
    };

    // Geocode a single city using Nominatim
    const geocodeCity = async (cityName: string) => {
        try {
            const response = await axios.get(
                `https://nominatim.openstreetmap.org/search?q=${cityName},New%20Zealand&format=json&limit=1`
            );
            if (response.data && response.data.length > 0) {
                const { lat, lon } = response.data[0];
                return { lat: parseFloat(lat), lon: parseFloat(lon) };
            } else {
                console.error("No geocode result for", cityName);
                return { lat: 0, lon: 0 }; // Default to 0,0 if no result
            }
        } catch (error) {
            console.error("Error geocoding city", cityName, error);
            return { lat: 0, lon: 0 }; // Default to 0,0 if error
        }
    };

    useEffect(() => {
        fetchLocations();
    }, []);

    return (
        <div>
            <h4> Car Rental Locations Across New Zealand</h4>
            {locations.length > 0 ? (
                <MapContainer
                    center={[-40.9006, 174.8860]} // Centered on New Zealand
                    zoom={5} // Adjusted zoom level for better view
                    style={{ height: '500px', width: '100%' }} // Ensure correct map styling
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />

                    {/* Render markers dynamically from the geocoded locations */}
                    {locations.map((location, index) => {
                        if (location.latitude && location.longitude && location.latitude !== 0 && location.longitude !== 0) {
                            return (
                                <Marker key={index} position={[location.latitude, location.longitude]}>
                                    <Popup>
                                        <strong>{location.name}</strong>
                                    </Popup>
                                </Marker>
                            );
                        } else {
                            console.warn(`Invalid coordinates for ${location.name}:`, location);
                            return null;
                        }
                    })}
                </MapContainer>
            ) : (
                <p>Loading locations...</p>
            )}
        </div>
    );
};

export default LocationsComponent;
