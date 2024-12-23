// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

import './App.css';
import VehiclesComponent from './components/VehiclesComponent';
import Navbar from "./components/NavbarComponent";
import HomeComponent from "./components/HomeComponent";
import TripsComponent from "./components/TripsComponent";
import RelocationsComponent from "./components/RelocationsComponent";
// import ChartsComponent from "./components/ChartsComponent";
import LifetimeComponent from "./components/LifetimeComponents";
import LocationsComponent from "./components/LocationsComponent";
import MaintenanceComponent from "./components/MaintenanceComponent";
import VehicleByRegoComponent from "./components/VehicleByRegoComponent";
import TripByIdComponent from "./components/TripByIdComponent";
import MaintenanceByIdComponent from "./components/MaintenanceByIdComponent";
import RelocationByIdComponent from "./components/RelocationByIdComponent";
import TripByRegoComponent from "./components/TripByRegoComponent";
import MaintenanceByRegoComponent from "./components/MaintenanceByRegoComponent";
import RelocationByRegoComponent from "./components/RelocationByRegoComponent";
import LineChart from "./components/ChartsComponent";
import VehicleCategoryDetailComponent from "./components/VehicleCategoryDetailComponent";

const App: React.FC = () => {
  return (
      <Router>
      <Navbar />
    <Routes>
        <Route path="/" element={<HomeComponent />} />
        <Route path="/category/:category" element={<VehicleCategoryDetailComponent />} />
        <Route path="/vehicles" element={<VehiclesComponent />} />
        <Route path="/vehicle/:rego" element={<VehicleByRegoComponent />} />
        <Route path="/trips" element={<TripsComponent />} />
        <Route path="/trips/:trip_id" element={<TripByIdComponent />} />
        <Route path="/vehicle/:rego/trips/" element={<TripByRegoComponent />} />
        <Route path="/relocations" element={<RelocationsComponent />} />
        <Route path="/vehicle/:rego/relocations" element={<RelocationByRegoComponent />} />
        <Route path="/charts" element={<LineChart />} />
        <Route path="/maintenance" element={<MaintenanceComponent />} />
        <Route path="/vehicle/:rego/maintenance/" element={<MaintenanceByRegoComponent />} />
        <Route path="/maintenance/:maintenance_id" element={<MaintenanceByIdComponent />} />
        <Route path="/lifetime" element={<LifetimeComponent />} />
        <Route path="/locations" element={<LocationsComponent />} />
        <Route path="/relocations/:relocation_id" element={<RelocationByIdComponent />} />

    </Routes>
      </Router>
  );
};

export default App;
