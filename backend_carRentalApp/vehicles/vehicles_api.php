<?php
require_once 'queries.php';
require_once 'Vehicle.php';
require_once 'VehiclesModel.php';
// Allow cross-origin requests from any origin
header("Access-Control-Allow-Origin: *");
// Allow specific HTTP methods
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
// Allow specific headers in the request
header("Access-Control-Allow-Headers: Content-Type, Authorization");
// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}
// Establish a PDO connection
$pdo = openConnection();
if (!$pdo) {
    throw new Exception('Database connection failed.');
}

$vehicleModel = new VehiclesModel($pdo);
$page = isset($_GET['page']) && is_numeric($_GET['page']) ? (int)$_GET['page'] : 1;
$limit = 20; // Number of vehicles per page
$offset = ($page - 1) * $limit;
$vehicleRego = isset($_GET['rego_no']) ? htmlspecialchars($_GET['rego_no']) : null;
$trip_id = isset($_GET['trip_id']) ? htmlspecialchars($_GET['trip_id']) : null;
$maintenance_id = isset($_GET['maintenance_id']) ? htmlspecialchars($_GET['maintenance_id']) : null;
$relocation_id = isset($_GET['relocation_id']) ? htmlspecialchars($_GET['relocation_id']) : null;
$costAndRatesParam = isset($_GET['category']) ? htmlspecialchars($_GET['category']) : null;
$min_day = isset($_GET['min_day']) ? (int) $_GET['min_day'] : null;
$max_day = isset($_GET['max_day']) ? (int) $_GET['max_day'] : null;
// Check if query parameters are present
$queries = [
    'rego_no' => isset($_GET['rego_no']) ? htmlspecialchars($_GET['rego_no']) : null,
    'odometer_min' => isset($_GET['odometer_min']) ? htmlspecialchars($_GET['odometer_min']) : null,
    'odometer_max' => isset($_GET['odometer_max']) ? htmlspecialchars($_GET['odometer_max']) : null,
    'commissioned_since' => isset($_GET['commissioned_since']) ? htmlspecialchars($_GET['commissioned_since']) : null,
    'decommissioned_since' => isset($_GET['decommissioned_since']) ? htmlspecialchars($_GET['decommissioned_since']) : null,
    'categories' => isset($_GET['categories']) ? array_map('htmlspecialchars', $_GET['categories']) : []
];

$context= isset($_GET['context']) && htmlspecialchars($_GET['context']) ? $_GET['context'] : "vehicles";

$indicators_queries = [
    'End_date' => isset($_GET['End_date']) ? htmlspecialchars($_GET['End_date']) : null,
    'Start_date' => isset($_GET['Start_date']) ? htmlspecialchars($_GET['Start_date']) : null,
    'categories' => isset($_GET['categories']) ? array_map('htmlspecialchars', $_GET['categories']) : []
];
$lifeCycleFilters = [
    'ASC' => isset($_GET['ASC']) ? htmlspecialchars($_GET['ASC']) : null,
    'DESC' => isset($_GET['DESC']) ? htmlspecialchars($_GET['DESC']) : null,
    'NeedMaintenance' =>isset($_GET['NeedMaintenance']) ? htmlspecialchars($_GET['NeedMaintenance']) : null,
];
try {
    if ($min_day !== null && $max_day !== null) {
        $vehicleData = $vehicleModel->getVehicleLifecycle($min_day, $max_day, $limit, $offset, $lifeCycleFilters);
        $vehiclesInLifecycle = $vehicleData['results'];
        $totalVehiclesLifecycle = $vehicleData['total_rows'];
        $totalVehiclesLifecyclePages = ceil($totalVehiclesLifecycle / $limit);
    } else {
        $vehiclesInLifecycle = [];
        $totalVehiclesLifecyclePages = 0;
    }

    if ($context === 'vehicleLifecycleRange') {
        $vehiclesInLifecycleRange = $vehicleModel->getVehicleLifecycleRange();
    } else {
        $vehiclesInLifecycleRange = [];
    }

    if ($context === 'combinedMovements') {
        $combinedMovement= $vehicleModel->getCombinedMovements();
    } else{
        $combinedMovement = [];
    }
    if ($context === 'outGoingMovement') {
        $outgoingMovement= $vehicleModel->getOutGoingMovement();
    } else {$outgoingMovement = [];}

    if ($context === 'incomingMovement') {
        $incomingMovement= $vehicleModel->getIncomingMovements();
    } else {$incomingMovement = [];}


    if ($context === 'linearCharts')
        {$quarterly_indicators = $vehicleModel->getQuarterlyIndicators($indicators_queries);}
    else {$quarterly_indicators = [];}

    if ($context === 'locations') {
        $locations= $vehicleModel->getLocations();
    } else {
        $locations = [];
    }

    if ($context === 'home') {
        $summary = $vehicleModel->getSummary();

    } else {
        $summary = [];
    }
    if ($context === 'vehicles') {
        $vehicles = $vehicleModel->getVehicles($queries, $limit, $offset);
    } else {
        $vehicles = [];
    }

    $categories = $vehicleModel->getVehiclesCategories();
    $odometerRange=$vehicleModel->getMinMaxOdometer();



    if ($trip_id !== null) {
        $tripById = $vehicleModel->getTripsById($trip_id, $limit, $offset);
    }
    if ($maintenance_id !== null) {
        $maintenancesById = $vehicleModel->getMaintainableById($limit, $offset, $maintenance_id);
    }
    if ($relocation_id !== null) {
        $relocationById = $vehicleModel->getRelocationsById($limit, $offset, $relocation_id);

    }
    if($vehicleRego !== null){
        $vehicleTrips =  $vehicleModel->getTripsByVehicleRego($vehicleRego, $limit, $offset);
        $vehicleMaintenance =  $vehicleModel->getMaintainableByReg($vehicleRego, $limit, $offset);
        $vehicleRelocations =  $vehicleModel->getRelocationByVehicleReg($vehicleRego, $limit, $offset);
        $vehicleByReg =  $vehicleModel->getVehicleByRego($vehicleRego);

    }
    $totalMaintenanceByReg = $vehicleModel->getTotalMaintenanceByRego($vehicleRego);
    $totalRelocationsByReg = $vehicleModel->getTotalRelocationsByRego($vehicleRego);

    if ($page >= 1) {
        $maintenances =  $vehicleModel->getMaintainable($limit, $offset);
        $relocations =  $vehicleModel->getRelocations($limit, $offset);
        $Trips =  $vehicleModel->getTrips($limit, $offset);

    }
    $costAndRates = $vehicleModel->getCostAndRates($costAndRatesParam);
    $totalRelocations = $vehicleModel->getTotalRelocations();
    $totalTrips = $vehicleModel->getTotalTrips();
    $totalVehicles = $vehicleModel->getNoOfVehicles($queries);
    $totalPages = ceil($totalVehicles / $limit);

    $totalTripsByReg = $vehicleModel->getTotalTripsByRego($vehicleRego);
    $totalTripsByRegPage = ceil($totalTripsByReg/$limit);
    $totalTripsPages = ceil($totalTrips/$limit);
    $totalMaintenanceByRegPage = ceil($totalMaintenanceByReg/$limit);
    $totalRelocationsByRegPage = ceil($totalRelocationsByReg/$limit);
    $totalRelocationsPage = ceil($totalRelocations/$limit);
    $commissionedRange = $vehicleModel->getCommissionedRange();
    $decommissionedRange = $vehicleModel->getDecommissionedRange();
    $totalMaintenance=$vehicleModel->getTotalMaintenances();
    $totalMaintenancePage = ceil($totalMaintenance/$limit);
    header('Content-Type: application/json');
    echo json_encode([
        'vehicleLifeCycle' => $vehiclesInLifecycle,
        'vehiclesInLifecycleRange'=>$vehiclesInLifecycleRange,
        'vehicles' => $vehicles,
        'totalPages' => $totalPages,
        'totalVehicles' => $totalVehicles,
        'categories' => $categories,
        'odometerRange' => $odometerRange,
        'commissionedRange' => $commissionedRange,
        'decommissionedRange' => $decommissionedRange,
        'vehicleTrips' => $vehicleTrips,
        'vehicleMaintenance'=>$vehicleMaintenance,
        'vehicleRelocations'=>$vehicleRelocations,
        'vehicleByReg'=>$vehicleByReg,
        'maintenances'=>$maintenances,
        'relocations'=>$relocations,
        'totalRelocationsPage'=>$totalRelocationsPage,
        'trips'=>$Trips,
        'totalTripsPages'=>$totalTripsPages,
        'totalTripsByRegPage'=>$totalTripsByRegPage,
        'totalMaintenanceByRegPage'=>$totalMaintenanceByRegPage,
        'totalRelocationsByRegPage'=>$totalRelocationsByRegPage,
        'maintenanceById'=>$maintenancesById,
        'totalMaintenancePage'=>$totalMaintenancePage,
        'tripById' => $tripById,
        'relocationById' => $relocationById,
        'totalTripsByReg' => $totalTripsByReg,
        'totalMaintenanceByReg'=>$totalMaintenanceByReg,
        'totalRelocationsByReg' => $totalRelocationsByReg,
        'quarterly_indicators' => $quarterly_indicators,
        'locations' => $locations,
        'summary' =>$summary,
        'costAndRates'=>$costAndRates,
        'outgoingMovement' => $outgoingMovement,
        'incomingMovement' => $incomingMovement,
        'combinedMovement'=>$combinedMovement,
        'totalVehiclesLifecyclePages'=>$totalVehiclesLifecyclePages
    ]);
} catch (Exception $e) {
    // Log the error message to a file
    error_log($e->getMessage(), 3, '/path/to/your/error.log');
    http_response_code(500); // Internal Server Error
    echo json_encode(['error' => 'An error occurred, please try again later.']);
}
?>
