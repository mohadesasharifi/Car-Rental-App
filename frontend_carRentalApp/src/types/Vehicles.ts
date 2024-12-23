// src/Vehicle.ts
export interface Vehicle {
    vehicle_rego: string;
    vehicle_category: string;
    odometer: number;
    commissioned: number;
    decommissioned: number;
}
// export interface VehicleTripsByVehicleReg {
//     booking_or_walkin:string;
//     destination:string;
//     distance:number;
//     end_day:string;
//     odometer_end:number;
//     odometer_start:number;
//     origin:string;
//     requested_category:string;
//     start_day:string;
//     trip_id:number;
// }

export interface VehicleTripsById {

    distance:number;
    odometer_start:number;
    odometer_end:number;
    booking_or_walkin:string;
    origin:string;
    destination:string;
    start_date:string;
    end_date:string;
    requested_category:string;
    vehicle_rego:number;
    vehicle_category:string;
    vehicle_odometer:number;
    vehicle_commissioned:string;
    vehicle_decommissioned:string;
}

export interface TripCardComponentProps {
    tripById: VehicleTripsById; // Changed to tripByVehicle
}
export interface VehicleTrips {
    trip_id:number;
    distance:number;
    origin:string;
    destination:string;
    start_day:string;
    end_day:string;
}

export interface VehicleMaintenanceById {
    maintenance_id: number;
    start_date: string;
    end_date:string;
    location:string;
    mileage: number;
    vehicle_rego:number;
    vehicle_category:string;
    vehicle_odometer:number;
    vehicle_commissioned:string;
    vehicle_decommissioned:string;
}

export interface VehicleMaintenance {
    maintenance_id: number;
    start_day: string;
    end_day:string;
    location:string;
    mileage:number;
}

export interface Maintenance {
    maintenance_id: number;
    start_day: string;
    end_day:string;
    location:string;
    vehicle_category:string;
}
export interface VehicleRelocationById {
    relocation_id:number;
    start_day:string;
    end_day:string;
    origin:string;
    destination:string;
    distance:number;
    vehicle_rego:string;
    vehicle_category:string;
    vehicle_odometer:number;
    vehicle_commissioned:string;
    vehicle_decommissioned:string;
}
export interface Relocation {
    relocation_id:number;
    start_day:string;
    end_day:string;
    origin:string;
    destination:string;
    distance:number;
    vehicle_category:string;
}
// export interface VehicleRelocations {
//     relocation_id:number;
//     start_day:string;
//     end_day:string;
//     origin:string;
//     destination:string;
//     distance:number;
// }
export interface VehicleFetched {
    vehicle_rego: string;
    vehicle_category: string;
    odometer: number;
    commissioned_date: string;
    decommissioned_date: string;
    maintenance_need: number;
}
export interface VehicleLifetime {
    vehicle_rego: string;
    vehicle_category: string;
    odometer: number;
    commissioned_date: string;
    decommissioned_date: string;
    service_duration_days: number;
    maintenance_need: boolean;
}
export interface FiltersComponentProps {
    onFiltered: (filters: {
        rego_no: string;
        max_odometer: number;
        min_odometer: number;
        decommissioned_since: string;
        commissioned_since: string;
        categories: string[]
    }) =>void;
}
export interface IndicatorsFiltersComponentProps {
    onFiltered: (filters: {
        start_day: string,
        end_day: string,
        categories: string[]
    }) =>void;
}

export interface Indicators {
    Period: string;
    Hire_revenue:number;
    Vehicle_purchasing:number;
    Maintenance_expenses:number;
    Relocations_expenses: number;
    Upgrade_losses:number;
    Profit:number;

    // Use placeholders for each category
}
export interface VehiclesCardComponentProps {
    vehiclesList?: VehicleFetched[];
}
export interface IndicatorsFetched {
    Indicators?: Indicators[];
}

export interface RelocationsCardComponentProps {
    relocationsList?: Relocation[];
}
export interface TripsCardComponentProps {
    tripsList?: VehicleTrips[];
}
export interface MaintenancesCardComponentProps {
    maintenancesList?:Maintenance[];
}

export interface SummaryItem {
    "Trips Completed": number;
    "Trips Upgraded": number;
    "Refused Bookings": number;
    "Refused Walk-ins": number;
    "Vehicles Relocated": number;
    "Vehicles Serviced": number;
}

export interface VehicleRates {
    vehicle_category: string;
    daily_hire_rate: number;
    flat_maintenance_rate: number;
    hourly_relocation_rate: number;
    purchase_cost: number;
    monthly_lease_cost: number;
}

export interface vehicleRatesProps {
    vehicleRates: VehicleRates[];
}

export interface OutgoingMovements {
    location:string;
    movement: number;
    year_month:string;
}

export interface IncomingMovements {
    location:string;
    movement: number;
    year_month:string;
}
export interface CombinedMovements {
    date:string;
    location: string;
    movement:number;
    type:string;
}
export interface ApiConfig {
    apiPath: string;
}