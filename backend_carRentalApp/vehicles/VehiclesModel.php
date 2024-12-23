<?php
class VehiclesModel
{
    protected $pdo;

    public function __construct($pdo)
    {
        $this->pdo = $pdo;
    }

    public function getVehiclesCategories()
    {

        $sql = "SELECT DISTINCT vehicle_category FROM vehicle";
        try {
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute();
            $categories = [];
            $index = 0;
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                $categories[$index] = htmlspecialchars($row['vehicle_category']);
                $index++;
            }
            return $categories;
        } catch (PDOException $e) {
            echo "Error: " . $e->getMessage();
            return [];
        }


    }

    public function getVehicles($queries, $limit, $offset)
    {

//        var_dump($queries);
        $sql = "SELECT v.vehicle_rego, v.vehicle_category, v.odometer, sc.date as commissioned, sd.date as decommissioned 
        FROM vehicle as v
        LEFT JOIN sim_day_date as sc ON v.commissioned = sc.sim_day 
        LEFT JOIN sim_day_date as sd ON v.decommissioned = sd.sim_day
        WHERE 1=1";
        $params = [];

        $this->addQueries($queries, $sql, $params);
        // Add pagination to the query
        $sql .= " LIMIT :limit OFFSET :offset";
        try {
            $stmt = $this->pdo->prepare($sql);

            // Bind parameters
            foreach ($params as $key => $value) {
                $stmt->bindValue($key, $value, is_int($value) ? PDO::PARAM_INT : PDO::PARAM_STR);
            }

            // Bind pagination parameters
            $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
            $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);

            $stmt->execute();

            // Fetch all vehicles in one go
            $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
            $vehicles = [];
            foreach ($rows as $row) {
                $vehicle = new Vehicle(
                    htmlspecialchars($row['vehicle_rego']),
                    htmlspecialchars($row['vehicle_category']),
                    htmlspecialchars($row['odometer']),
                    htmlspecialchars($row['commissioned']),
                    htmlspecialchars($row['decommissioned'])
                );
                $vehicles[] = $vehicle;
            }

            $this->logSQLResult($vehicles);

            // Return both vehicles and total count
            return $vehicles;
        } catch (PDOException $e) {
            $this->logSQLError($e->getMessage());
            echo "Error: " . $e->getMessage();
            return [];
        }
    }
    private function addQueries($queries, &$sql, &$params) {
        $commissionedDay = $this->getDayNumberByDate($queries['commissioned_since']);
        $decommissionedDay = $this->getDayNumberByDate($queries['decommissioned_since']);


        try {
            if (!empty($queries['rego_no'])) {
                $sql .= " AND v.vehicle_rego = :rego_no";
                $params[':rego_no'] = $queries['rego_no'];
            }
            if (!empty($queries['odometer_min'])) {
                $sql .= " AND v.odometer >= :odometer_min";
                $params[':odometer_min'] = $queries['odometer_min'];
            }
            if (!empty($queries['odometer_max'])) {
                $sql .= " AND v.odometer <= :odometer_max";
                $params[':odometer_max'] = $queries['odometer_max'];
            }
            if (!empty($queries['commissioned_since'])) {
                if ($commissionedDay !== null) {
                    $sql .= " AND commissioned >= :commissioned_since";
                    $params[':commissioned_since'] = $commissionedDay;
                }
            }// Decommissioned Since Filter
            if (!empty($queries['decommissioned_since'])) {
                if ($decommissionedDay !== null) {
                    $sql .= " AND decommissioned >= :decommissioned_since";
                    $params[':decommissioned_since'] = $decommissionedDay;
                }
            }
        } catch (Exception $e) {

        }
        if (!empty($queries['categories']) && is_array($queries['categories'])) {
            // Use placeholders for each category
            $placeholders = implode(',', array_map(function ($index) {
                return ":category_$index";
            }, array_keys($queries['categories'])));
            $sql .= " AND v.vehicle_category IN ($placeholders)";

            foreach ($queries['categories'] as $index => $category) {
                $params[":category_$index"] = $category;
            }
        }

    }

    public function getVehicleMovements($queries) {

        $sql = "SELECT origin AS location, SUM() AS movement, ... AS time FROM vehicle_movements 
                WHERE 1= 1
            ";
        $params = [];
        $this->addQueries($queries, $sql, $params);
        if (!empty($queries['Start_date'])) {

            $sql .= " AND start_date >= :Start_date";

            $params[":start_date"] = $queries['Start_date'];

        }

        if (!empty($queries['End_date'])) {
            $sql .= " AND end_date <= :End_date";
            $params[':end_date'] = $queries['End_date'];
        }

        try {
            $stmt = $this->pdo->prepare($sql);

            // Bind parameters
            foreach ($params as $key => $value) {
                $stmt->bindValue($key, $value, is_int($value) ? PDO::PARAM_INT : PDO::PARAM_STR);
            }

            $stmt->execute();

            // Fetch all vehicles in one go
            $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
            $vehiclesMovement = [];
            foreach ($rows as $row) {
                $vehiclesMovement = [
                    htmlspecialchars($row['']),
                    htmlspecialchars($row['']),
                    htmlspecialchars($row[''])
                ];
            }

            $this->logSQLResult($vehiclesMovement);

            // Return both vehicles and total count
            return $vehiclesMovement;
        } catch (PDOException $e) {
            $this->logSQLError($e->getMessage());
            echo "Error: " . $e->getMessage();
            return [];
        }
    }

    public function getVehicleQuarterlyIndicators($queries) {
        $commissionedDay = $this->getDayNumberByDate($queries['commissioned_since']);
        $decommissionedDay = $this->getDayNumberByDate($queries['decommissioned_since']);
        $maintenanceExpenseMonthly = "
        SELECT
            strftime('%Y-%m', end_date) AS year_month,
            vehicle_category,
            vehicle_odometer,
            commissioned,
            decommissioned,
            vehicle_rego,
            COUNT(*) * flat_maintenance_rate AS maintenance_expense
        FROM maintenance_whole2 
        JOIN costs_and_rates USING (vehicle_category)
    ";



        // Filter for rego_no
        if (!empty($queries['rego_no'])) {
            $maintenanceExpenseMonthly .= " AND vehicle_rego = :rego_no";
            $params[':rego_no'] = $queries['rego_no'];
        }

        // Filter for odometer min
        if (!empty($queries['odometer_min'])) {
            $maintenanceExpenseMonthly .= " AND odometer >= :odometer_min";
            $params[':odometer_min'] = $queries['odometer_min'];
        }

        // Filter for odometer max
        if (!empty($queries['odometer_max'])) {
            $maintenanceExpenseMonthly .= " AND odometer <= :odometer_max";
            $params[':odometer_max'] = $queries['odometer_max'];
        }

        // Filter for commissioned since
        if (!empty($queries['commissioned_since']) && $commissionedDay !== null) {
            $maintenanceExpenseMonthly .= " AND commissioned >= :commissioned_since";
            $params[':commissioned_since'] = $commissionedDay;
        }

        // Filter for decommissioned since
        if (!empty($queries['decommissioned_since']) && $decommissionedDay !== null) {
            $maintenanceExpenseMonthly .= " AND decommissioned <= :decommissioned_since"; // Use <= for decommissioned
            $params[':decommissioned_since'] = $decommissionedDay;
        }

        // Filter for categories
        if (!empty($queries['categories']) && is_array($queries['categories'])) {
            // Use placeholders for each category
            $placeholders = implode(',', array_map(function ($index) {
                return ":category_$index";
            }, array_keys($queries['categories'])));
            $maintenanceExpenseMonthly .= " AND vehicle_category IN ($placeholders)";

            // Bind the category parameters
            foreach ($queries['categories'] as $index => $category) {
                $params[":category_$index"] = $category;
            }
        }

        // Finalize the SQL query with GROUP BY clause
        $maintenanceExpenseMonthly .= "
        GROUP BY year_month, vehicle_category, vehicle_rego
    ";
        try {
            $stmt = $this->pdo->prepare($maintenanceExpenseMonthly); // Use the correct variable

            // Bind parameters
            foreach ($params as $key => $value) {
                $stmt->bindValue($key, $value, is_int($value) ? PDO::PARAM_INT : PDO::PARAM_STR);
            }

            $stmt->execute();

            // Fetch all vehicles in one go
            $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
            $this->logSQLResult($rows);

            // Return both vehicles and total count
            return $rows;
        } catch (PDOException $e) {
            // Log the error message (consider using a logger instead of echo)
            error_log("Error: " . $e->getMessage()); // Log to error log
            return []; // Return an empty array on error
        }
    }




    public function getQuarterlyIndicators($queries)
    {

        $params = [];

        $sql = "SELECT Period, `Hire revenue`, `Vehicle purchasing`, `Maintenance expenses`, `Relocations expenses`, `Upgrade losses`, `Profit` 
        FROM quarterly_indicators2 WHERE 1=1";

        $this->addQueries($queries, $sql, $params);

        if (!empty($queries['Start_date'])) {

            $sql .= " AND year_month >= :Start_date";

            $params[":year_month"] = $queries['Start_date'];

        }

        if (!empty($queries['End_date'])) {
            $sql .= " AND year_month <= :End_date";
            $params[':End_date'] = $queries['End_date'];
        }
        try {

            $stmt = $this->pdo->prepare($sql);

            // Bind parameters
            foreach ($params as $key => $value) {
                $stmt->bindValue($key, $value, is_int($value) ? PDO::PARAM_INT : PDO::PARAM_STR);
            }


            $stmt->execute();

            // Fetch all vehicles in one go
            $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
            $indicators = [];
            foreach ($rows as $row) {
                $indicators[] = [
                    'Period' => htmlspecialchars($row['Period']),
                    'Hire_revenue' => htmlspecialchars($row['Hire revenue']),
                    'Vehicle_purchasing' => htmlspecialchars($row['Vehicle purchasing']),
                    'Maintenance_expenses' => htmlspecialchars($row['Maintenance expenses']),
                    'Relocations_expenses' => htmlspecialchars($row['Relocations expenses']),
                    'Upgrade_losses' => htmlspecialchars($row['Upgrade losses']),
                    'Profit' => htmlspecialchars($row['Profit'])
                ];

            }

            $this->logSQLResult($indicators);

            // Return both vehicles and total count
            return $indicators;
        } catch (PDOException $e) {
            echo "Error: " . $e->getMessage();
            return [];
        }
    }

    public function getNoOfVehicles($queries)
    {
        $commissionedDay = $this->getDayNumberByDate($queries['commissioned_since']);
        $decommissionedDay = $this->getDayNumberByDate($queries['decommissioned_since']);
//        var_dump($queries);
        $sql = "SELECT COUNT(*) as total FROM vehicle WHERE 1=1"; // Added alias for clarity
        $params = [];
        if (!empty($queries['rego_no'])) {
            $sql .= " AND vehicle_rego = :rego_no";
            $params[':rego_no'] = $queries['rego_no'];
        }

        if (!empty($queries['odometer_min'])) {
            $sql .= " AND odometer >= :odometer_min";
            $params[':odometer_min'] = $queries['odometer_min'];
        }

        if (!empty($queries['odometer_max'])) {
            $sql .= " AND odometer <= :odometer_max";
            $params[':odometer_max'] = $queries['odometer_max'];
        }


        if (!empty($queries['commissioned_since'])) {
            if ($commissionedDay !== null) {
                $sql .= " AND commissioned >= :commissioned_since";
                $params[':commissioned_since'] = $commissionedDay;
            }
        }

        // Decommissioned Since Filter
        if (!empty($queries['decommissioned_since'])) {
            if ($decommissionedDay !== null) {
                $sql .= " AND decommissioned >= :decommissioned_since";
                $params[':decommissioned_since'] = $decommissionedDay;
            }
        }


        if (!empty($queries['categories']) && is_array($queries['categories'])) {
            // Use placeholders for each category
            $placeholders = implode(',', array_map(function ($index) {
                return ":category_$index";
            }, array_keys($queries['categories'])));
            $sql .= " AND vehicle_category IN ($placeholders)";

            foreach ($queries['categories'] as $index => $category) {
                $params[":category_$index"] = $category;
            }
        }



        try {
            $stmt = $this->pdo->prepare($sql);

            // Bind parameters
            foreach ($params as $key => $value) {
                $stmt->bindValue($key, $value, is_int($value) ? PDO::PARAM_INT : PDO::PARAM_STR);
            }

            // Bind pagination parameters

            $stmt->execute();

            // Fetch all vehicles in one go
            $totalCount = $stmt->fetchColumn();

            $this->logSQLResult(['totalCount' => $totalCount]);
            // Return both vehicles and total count
            return (int) $totalCount;
        } catch (PDOException $e) {
            $this->logSQLError($e->getMessage());
            echo "Error: " . $e->getMessage();
            return [];
        }
    }


    public function getMinMaxOdometer()
    {
        $sql = "SELECT MIN(odometer) as min, MAX(odometer) as max FROM vehicle";
        try {
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute();
            $odometerRange = [];

            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                $odometerRange[0] = htmlspecialchars($row['min']);
                $odometerRange[1] = htmlspecialchars($row['max']);
            }
            return $odometerRange;
        } catch (PDOException $e) {
            echo "Error: " . $e->getMessage();
            return [];
        }
    }
    public function getCommissionedRange() {
        $sql = "SELECT MIN(s.date) AS oldest_commissioned_date, 
        MAX(s.date) AS newest_commissioned_date
        FROM vehicle AS v
        JOIN sim_day_date AS s ON v.commissioned = s.sim_day";
        try {
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute();
            $commissionedRange = [];

            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                $commissionedRange[0] = htmlspecialchars($row['oldest_commissioned_date']);
                $commissionedRange[1] = htmlspecialchars($row['newest_commissioned_date']);
            }
            return $commissionedRange;
        } catch (PDOException $e) {
            echo "Error: " . $e->getMessage();
            return [];
        }
    }
    public function getDecommissionedRange() {
        $sql = "SELECT MIN(s.date) AS oldest_decommissioned_date, 
        MAX(s.date) AS newest_decommissioned_date
        FROM vehicle AS v
        JOIN sim_day_date AS s ON v.decommissioned = s.sim_day";
        try {
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute();
            $decommissionedRange = [];

            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                $decommissionedRange[0] = htmlspecialchars($row['oldest_decommissioned_date']);
                $decommissionedRange[1] = htmlspecialchars($row['newest_decommissioned_date']);
            }
            return $decommissionedRange;
        } catch (PDOException $e) {
            echo "Error: " . $e->getMessage();
            return [];
        }


    }
    public function getVehicleByRego($vehicleRego)
    {
        $sql = "SELECT v.vehicle_rego, v.vehicle_category, v.odometer, 
       v.commissioned, v.decommissioned FROM vehicle AS v 
       WHERE v.vehicle_rego = :vehicle_rego
       ";
        try {
            $stmt = $this->pdo->prepare($sql);
            $stmt->bindParam(':vehicle_rego', $vehicleRego, PDO::PARAM_STR);
            $stmt->execute();
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            if ($row) {
                return new Vehicle(
                    htmlspecialchars($row['vehicle_rego']),
                    htmlspecialchars($row['vehicle_category']),
                    htmlspecialchars($row['vehicle_odometer']),
                    htmlspecialchars($row['vehicle_commissioned']),
                    htmlspecialchars($row['vehicle_decommissioned'])
                );
            } else {
                // Return null or throw an exception if no vehicle is found
                return [];
            }
        } catch (PDOException $e) {
            echo "Error: " . $e->getMessage();
            return null;
        }
    }

    public function getTrips($limit, $offset) {
        $sql = "SELECT t.trip_id, t.distance, 
               p.origin, p.destination, 
               a.date AS start_day, b.date AS end_day
        FROM trip AS t
        JOIN processed_intent AS p ON t.intent_id = p.intent_id
        JOIN sim_day_date AS a ON p.start_day = a.sim_day
        LEFT JOIN sim_day_date AS b ON p.end_day = b.sim_day
        LIMIT :limit 
        OFFSET :offset";

        try{
            $stmt = $this->pdo->prepare($sql);
            $stmt->bindValue(':limit', (int)$limit, PDO::PARAM_INT);
            $stmt->bindValue(':offset', (int)$offset, PDO::PARAM_INT);
            $stmt->execute();
            $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
            $result = [];
            foreach ($rows as $row) {
                $result[] = [
                    'trip_id'=> htmlspecialchars($row['trip_id']),
                    'distance'=>htmlspecialchars($row['distance']),
                    'origin'=>htmlspecialchars($row['origin']),
                    'destination'=>htmlspecialchars($row['destination']),
                    'start_day'=>htmlspecialchars($row['start_day']),
                    'end_day'=>htmlspecialchars($row['end_day'])
                ];
            }
            return $result;
        } catch (PDOException $e){
            echo "Error: " . $e->getMessage();
            return [];
        }

    }

    public function getTripsByVehicleRego($vehicleRego, $limit, $offset) {
        $sql = "SELECT t.trip_id, t.distance,
               p.origin, p.destination,
               a.date AS start_day, b.date AS end_day
        FROM trip AS t
        JOIN processed_intent AS p ON t.intent_id = p.intent_id
        JOIN sim_day_date AS a ON p.start_day = a.sim_day
        LEFT JOIN sim_day_date AS b ON p.end_day = b.sim_day
        WHERE t.vehicle_rego = :vehicleRego
        LIMIT :limit 
        OFFSET :offset";

        try{
            $stmt = $this->pdo->prepare($sql);
            $stmt->bindValue(':vehicleRego', $vehicleRego, PDO::PARAM_STR);
            $stmt->bindValue(':limit', (int)$limit, PDO::PARAM_INT);
            $stmt->bindValue(':offset', (int)$offset, PDO::PARAM_INT);
            $stmt->execute();
            $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
            $result = [];
            foreach ($rows as $row) {
                $result[] = [
                    'trip_id'=> htmlspecialchars($row['trip_id']),
                    'distance'=>htmlspecialchars($row['distance']),
                    'origin'=>htmlspecialchars($row['origin']),
                    'destination'=>htmlspecialchars($row['destination']),
                    'start_day'=>htmlspecialchars($row['start_day']),
                    'end_day'=>htmlspecialchars($row['end_day'])
                ];
            }
            return $result;
        } catch (PDOException $e){
            echo "Error: " . $e->getMessage();
            return [];
        }
    }
    public function getTripsById($trip_id, $limit, $offset) {
        $sql = "SELECT t.trip_id, t.distance, t.odometer_start, t.odometer_end, 
               p.booking_or_walkin, p.origin, p.destination, 
               a.date AS start_date, b.date AS end_date, p.requested_category,
               v.vehicle_rego, v.vehicle_category, v.odometer, c.date AS commissioned,
                d.date AS decommissioned
        FROM trip AS t
        JOIN processed_intent AS p ON t.intent_id = p.intent_id
        JOIN vehicle AS v ON t.vehicle_rego = v.vehicle_rego
        LEFT JOIN sim_day_date AS a ON p.start_day = a.sim_day
        LEFT JOIN sim_day_date AS b ON p.end_day = b.sim_day
        LEFT JOIN sim_day_date AS c ON v.commissioned = c.sim_day
        LEFT JOIN sim_day_date AS d ON v.decommissioned = d.sim_day
        WHERE t.trip_id = :trip_id
        LIMIT :limit 
        OFFSET :offset";

        try{
            $stmt = $this->pdo->prepare($sql);
            $stmt->bindValue(':trip_id', $trip_id, PDO::PARAM_INT);
            $stmt->bindValue(':limit', (int)$limit, PDO::PARAM_INT);
            $stmt->bindValue(':offset', (int)$offset, PDO::PARAM_INT);
            $stmt->execute();
            $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
            $result = [];
            foreach ($rows as $row) {
                $result[] = [
                    'trip_id'=> htmlspecialchars($row['trip_id']),
                    'distance'=> htmlspecialchars($row['distance']),
                    'odometer_start'=> htmlspecialchars($row['odometer_start']),
                    'odometer_end'=> htmlspecialchars($row['odometer_end']),
                    'booking_or_walkin'=> htmlspecialchars($row['booking_or_walkin']),
                    'origin'=> htmlspecialchars($row['origin']),
                    'destination'=> htmlspecialchars($row['destination']),
                    'start_date'=> htmlspecialchars($row['start_date']),
                    'end_date'=> htmlspecialchars($row['end_date']),
                    'requested_category'=> htmlspecialchars($row['requested_category']),
                    'vehicle_rego'=> htmlspecialchars($row['vehicle_rego']),
                    'vehicle_category'=> htmlspecialchars($row['vehicle_category']),
                    'vehicle_odometer'=> htmlspecialchars($row['odometer']),
                    'vehicle_commissioned'=> htmlspecialchars($row['commissioned']),
                    'vehicle_decommissioned'=> htmlspecialchars($row['decommissioned'])
                    ];
            }
            return $result;
        } catch (PDOException $e){
            echo "Error: " . $e->getMessage();
            return [];
        }

    }
    public function getTotalTrips() {
        $sql = "SELECT COUNT(trip_id) AS total FROM trip";
        try{
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute();
            $row = $stmt->fetchColumn();
            return htmlspecialchars(($row));
        }catch(PDOException $e){}
            echo "Error: " . $e->getMessage();
            return null;
    }

    public function getMaintainable($limit, $offset) {
        $sql = "SELECT m.maintenance_id, a.date AS start_day, b.date AS end_day, m.location
                , v.vehicle_category
        FROM maintenance AS m 
        JOIN vehicle AS v ON m.vehicle_rego = v.vehicle_rego
        JOIN sim_day_date AS a ON m.start_day = a.sim_day
        LEFT JOIN sim_day_date AS b ON m.end_day = b.sim_day
        JOIN sim_day_date AS c ON v.commissioned = c.sim_day
        LEFT JOIN sim_day_date AS d ON v.decommissioned = d.sim_day
        ORDER BY m.maintenance_id ASC
        LIMIT :limit 
        OFFSET :offset";
        try{
            $stmt = $this->pdo->prepare($sql);
            $stmt->bindValue(':limit', (int)$limit, PDO::PARAM_INT);
            $stmt->bindValue(':offset', (int)$offset, PDO::PARAM_INT);
            $stmt->execute();
            $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
            $result = [];
            foreach ($rows as $row) {
                $result[] =[
                    'maintenance_id' => htmlspecialchars($row['maintenance_id']),
                    'start_day'=>htmlspecialchars($row['start_day']),
                    'end_day'=>htmlspecialchars($row['end_day']),
                    'location'=>htmlspecialchars($row['location']),
                    'vehicle_category'=>htmlspecialchars($row['vehicle_category']),
                    ];
            }
            return $result;
        } catch (PDOException $e){
            echo "Error: " . $e->getMessage();
            return [];
        }
    }
    public function getTotalMaintenances() {
        $sql = "SELECT COUNT(*) AS total FROM maintenance";
        try{
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute();
            $row = $stmt->fetchColumn();
            return htmlspecialchars(($row));
        }catch(PDOException $e){}
        echo "Error: " . $e->getMessage();
        return null;
    }

    public function getMaintainableById($limit, $offset, $id) {
        $sql = "SELECT m.maintenance_id, a.date AS start_date, b.date AS end_date, m.location
                , v.vehicle_category, m.mileage, v.vehicle_rego, v.odometer, c.date as commissioned, d.date as decommissioned
        FROM maintenance AS m 
        JOIN vehicle AS v ON m.vehicle_rego = v.vehicle_rego
        JOIN sim_day_date AS a ON m.start_day = a.sim_day
        LEFT JOIN sim_day_date AS b ON m.end_day = b.sim_day
        JOIN sim_day_date AS c ON v.commissioned = c.sim_day
        LEFT JOIN sim_day_date AS d ON v.decommissioned = d.sim_day
        WHERE m.maintenance_id = :id
        LIMIT :limit 
        OFFSET :offset";
        try{
            $stmt = $this->pdo->prepare($sql);
            $stmt->bindValue(':id', $id, PDO::PARAM_INT);
            $stmt->bindValue(':limit', (int)$limit, PDO::PARAM_INT);
            $stmt->bindValue(':offset', (int)$offset, PDO::PARAM_INT);
            $stmt->execute();
            $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
            $result = [];
            foreach ($rows as $row) {
                $result[] =[
                    'maintenance_id' => htmlspecialchars($row['maintenance_id']),
                    'start_date'=>htmlspecialchars($row['start_date']),
                    'end_date'=>htmlspecialchars($row['end_date']),
                    'location'=>htmlspecialchars($row['location']),
                    'mileage'=>htmlspecialchars($row['mileage']),
                    'vehicle_rego'=>htmlspecialchars($row['vehicle_rego']),
                    'vehicle_category'=>htmlspecialchars($row['vehicle_category']),
                    'vehicle_odometer'=>htmlspecialchars($row['odometer']),
                    'vehicle_commissioned'=>htmlspecialchars($row['commissioned']),
                    'vehicle_decommissioned'=>htmlspecialchars($row['decommissioned'])
                    ];
            }
            return $result;
        } catch (PDOException $e){
            echo "Error: " . $e->getMessage();
            return [];
        }
    }
    public function getMaintainableByReg($vehicleRego, $limit, $offset) {
        $sql = "SELECT m.maintenance_id, a.date AS start_day, b.date AS end_day, m.location
                , v.vehicle_category
        FROM maintenance AS m 
        JOIN vehicle AS v ON m.vehicle_rego = v.vehicle_rego
        JOIN sim_day_date AS a ON m.start_day = a.sim_day
        LEFT JOIN sim_day_date AS b ON m.end_day = b.sim_day
        JOIN sim_day_date AS c ON v.commissioned = c.sim_day
        LEFT JOIN sim_day_date AS d ON v.decommissioned = d.sim_day
        WHERE v.vehicle_rego = :vehicle_rego
        LIMIT :limit 
        OFFSET :offset";
        try{
            $stmt = $this->pdo->prepare($sql);
            $stmt->bindParam(':vehicle_rego', $vehicleRego, PDO::PARAM_STR);
            $stmt->bindValue(':limit', (int)$limit, PDO::PARAM_INT);
            $stmt->bindValue(':offset', (int)$offset, PDO::PARAM_INT);
            $stmt->execute();
            $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
            $result = [];
            foreach ($rows as $row) {
                $result[] =[
                    'maintenance_id' => htmlspecialchars($row['maintenance_id']),
                    'start_day'=>htmlspecialchars($row['start_day']),
                    'end_day'=>htmlspecialchars($row['end_day']),
                    'location'=>htmlspecialchars($row['location']),
                    'vehicle_category'=>htmlspecialchars($row['vehicle_category']),
                ];
            }
            return $result;
        } catch (PDOException $e){
            echo "Error: " . $e->getMessage();
            return [];
        }

    }



    public function getRelocationByVehicleReg($vehicleRego, $limit, $offset) {
        $sql = "SELECT r.relocation_id, a.date AS start_day, b.date AS end_day, r.origin, r.destination, r.distance, v.vehicle_category
        FROM relocation AS r 
        JOIN vehicle AS v ON r.vehicle_rego = v.vehicle_rego
        JOIN sim_day_date AS a ON r.start_day = a.sim_day
        LEFT JOIN sim_day_date AS b ON r.end_day = b.sim_day
        WHERE v.vehicle_rego = :vehicle_rego
        LIMIT :limit 
        OFFSET :offset";
        try{
            $stmt = $this->pdo->prepare($sql);
            $stmt->bindParam(':vehicle_rego', $vehicleRego, PDO::PARAM_STR);
            $stmt->bindValue(':limit', (int)$limit, PDO::PARAM_INT);
            $stmt->bindValue(':offset', (int)$offset, PDO::PARAM_INT);
            $stmt->execute();
            $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
            $result = [];
            foreach ($rows as $row) {
                $result[] = [
                    'relocation_id'=>htmlspecialchars($row['relocation_id']),
                    'start_day'=>htmlspecialchars($row['start_day']),
                    'end_day'=>htmlspecialchars($row['end_day']),
                    'origin'=>htmlspecialchars($row['origin']),
                    'destination'=>htmlspecialchars($row['destination']),
                    'distance'=>htmlspecialchars($row['distance']),
                    'vehicle_category'=>htmlspecialchars($row['vehicle_category'])
                ];
            }
            return $result;
        } catch (PDOException $e){
            echo "Error: " . $e->getMessage();
            return [];
        }

    }
    public function getRelocationsById($limit, $offset, $relocationId) {
        $sql = "SELECT r.relocation_id, a.date AS start_day, b.date AS end_day, r.origin, r.destination, r.distance,
                v.vehicle_rego, v.vehicle_category, v.odometer, c.date AS commissioned, d.date AS decommissioned
            FROM relocation AS r
            JOIN vehicle AS v ON r.vehicle_rego = v.vehicle_rego
            JOIN sim_day_date AS a ON r.start_day = a.sim_day
            LEFT JOIN sim_day_date AS b ON r.end_day = b.sim_day
            JOIN sim_day_date AS c ON v.commissioned = c.sim_day
            LEFT JOIN sim_day_date AS d ON v.decommissioned = d.sim_day
            WHERE (r.relocation_id = :relocationId)
            
            LIMIT :limit 
            OFFSET :offset";
        try{
            $stmt = $this->pdo->prepare($sql);
            $stmt->bindValue(':relocationId', $relocationId, PDO::PARAM_INT);
            $stmt->bindValue(':limit', (int)$limit, PDO::PARAM_INT);
            $stmt->bindValue(':offset', (int)$offset, PDO::PARAM_INT);
            $stmt->execute();
            $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
            $relocations = [];
            foreach ($rows as $row) {
                $relocations[] = [
                    'relocation_id'=>htmlspecialchars($row['relocation_id']),
                    'start_day'=>htmlspecialchars($row['start_day']),
                    'end_day'=>htmlspecialchars($row['end_day']),
                    'origin'=>htmlspecialchars($row['origin']),
                    'destination'=>htmlspecialchars($row['destination']),
                    'distance'=>htmlspecialchars($row['distance']),
                    'vehicle_rego'=>htmlspecialchars($row['vehicle_rego']),
                    'vehicle_category'=>htmlspecialchars($row['vehicle_category']),
                    'vehicle_odometer'=>htmlspecialchars($row['odometer']),
                    'vehicle_commissioned'=>htmlspecialchars($row['commissioned']),
                    'vehicle_decommissioned'=>htmlspecialchars($row['decommissioned'])
                    ];
            }
            return $relocations;
        } catch (PDOException $e){
            echo "Error: " . $e->getMessage();
            return [];
        }

    }
    public function getRelocations($limit, $offset) {
        $sql = "SELECT r.relocation_id, a.date AS start_day, b.date AS end_day, r.origin, r.destination, r.distance, v.vehicle_category
        FROM relocation AS r 
        JOIN vehicle AS v ON r.vehicle_rego = v.vehicle_rego
        JOIN sim_day_date AS a ON r.start_day = a.sim_day
        LEFT JOIN sim_day_date AS b ON r.end_day = b.sim_day
        LIMIT :limit 
        OFFSET :offset";
        try{
            $stmt = $this->pdo->prepare($sql);
            $stmt->bindValue(':limit', (int)$limit, PDO::PARAM_INT);
            $stmt->bindValue(':offset', (int)$offset, PDO::PARAM_INT);
            $stmt->execute();
            $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
            $result = [];
            foreach ($rows as $row) {
                $result[] = [
                    'relocation_id'=>htmlspecialchars($row['relocation_id']),
                    'start_day'=>htmlspecialchars($row['start_day']),
                    'end_day'=>htmlspecialchars($row['end_day']),
                    'origin'=>htmlspecialchars($row['origin']),
                    'destination'=>htmlspecialchars($row['destination']),
                    'distance'=>htmlspecialchars($row['distance']),
                    'vehicle_category'=>htmlspecialchars($row['vehicle_category'])
                ];
            }
            return $result;
        } catch (PDOException $e){
            echo "Error: " . $e->getMessage();
            return [];
        }

    }
    public function getLocations() {
        $sql = "SELECT DISTINCT origin FROM processed_intent";
        try{
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_COLUMN, 0);
        } catch (PDOException $e){
            echo "Error: " . $e->getMessage();
            return [];
        }
    }
    public function getTotalRelocations() {
        $sql = "SELECT COUNT(*) AS total FROM relocation";
        try{
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute();
            $result = $stmt->fetchColumn();
            return htmlspecialchars($result);

        }catch(PDOException $e){
            echo "Error: " . $e->getMessage();
            return [];
        }
    }

    private function getDayNumberByDate($date)
    {
//        var_dump($date);
        $stmt = $this->pdo->prepare("SELECT sim_day FROM sim_day_date WHERE date = :date");
        $stmt->bindValue(':date', $date);
        $stmt->execute();
        $dayNumber = $stmt->fetchColumn();

        if ($dayNumber === false) {
            error_log("Error: No sim_day found for date $date");
            return null; // No matching date found
        }

        return $dayNumber;
    }
    // Function to log the SQL query and bound parameters
    public function getTotalTripsByRego($vehicleRego)
    {
        try {
            $countSql = "SELECT COUNT(*) as total FROM trip WHERE vehicle_rego = :vehicle_rego";
            $stmt = $this->pdo->prepare($countSql);
            $stmt->bindParam(':vehicle_rego', $vehicleRego, PDO::PARAM_STR);
            $stmt->execute();
            $totalTrips = $stmt->fetchColumn();
            return htmlspecialchars($totalTrips);
        } catch (PDOException $e){
            echo "Error: " . $e->getMessage();
            return [];
        }

    }

    public function getTotalMaintenanceByRego($vehicleRego)
    {
        try {
            $countSql = "SELECT COUNT(*) as total FROM maintenance WHERE vehicle_rego = :vehicle_rego";
            $stmt = $this->pdo->prepare($countSql);
            $stmt->bindParam(':vehicle_rego', $vehicleRego, PDO::PARAM_STR);
            $stmt->execute();
            $totalMaintenance = $stmt->fetchColumn();
            $total = htmlspecialchars($totalMaintenance);
            return $total !== false ? (int)$total : 0;

        } catch (PDOException $e){
            echo "Error: " . $e->getMessage();
            return [];
        }

    }

    public function getTotalRelocationsByRego($vehicleRego)
    {
        try {
            $countSql = "SELECT COUNT(*) as total FROM relocation WHERE vehicle_rego = :vehicle_rego";
            $stmt = $this->pdo->prepare($countSql);
            $stmt->bindParam(':vehicle_rego', $vehicleRego, PDO::PARAM_STR);
            $stmt->execute();
            $totalRelocations = $stmt->fetchColumn();
            $total = htmlspecialchars($totalRelocations);
            return $total !== false ? (int)$total : 0;
        } catch (PDOException $e){
            echo "Error: " . $e->getMessage();
            return [];
        }

    }
    public function getSummary() {
        $sql = "SELECT * FROM simulation_summary";
        try{
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        }catch(PDOException $e){
            echo "Error: " . $e->getMessage();
            return [];
        }
    }

    public function getCostAndRates($category) {
        $params = [];
        $sql = "SELECT * FROM costs_and_rates WHERE 1=1";

        if (!empty($category)) {
            $sql .= " AND vehicle_category = :category";
            $params[':category'] = $category;
        }

        try {
            $stmt = $this->pdo->prepare($sql);
            if (!empty($params)) {
                foreach ($params as $key => $value) {
                    $stmt->bindValue($key, $value);
                }
            }

            $stmt->execute();
            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
            return $result;

        } catch (PDOException $e){
            echo "Error: " . $e->getMessage();
            return [];
        }
    }
    public function getCombinedMovements() {
        $sql = "
        SELECT 
            DATE(start_date) AS date, 
            origin AS location, 
            COUNT(*) AS movement,
            'outgoing' AS type
        FROM 
            vehicle_movements
        GROUP BY 
            DATE(start_date), origin

        UNION ALL

        SELECT 
            DATE(start_date) AS date, 
            destination AS location, 
            COUNT(*) AS movement,
            'incoming' AS type
        FROM 
            vehicle_movements
        GROUP BY 
            DATE(start_date), destination
        ORDER BY 
            date, location;
    ";

        try {
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            echo "Error: " . $e->getMessage();
            return [];
        }
    }

    public function getOutGoingMovement() {
        $sql = "SELECT origin AS location, COUNT(*) AS movement, 
                  strftime('%Y-%m', start_date) AS year_month
            FROM vehicle_movements
            GROUP BY origin, year_month
            ORDER BY year_month";

        try {
            // Fetch aggregated data for outgoing trips by month and year
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute();
            $outgoingMovements_data = $stmt->fetchAll(PDO::FETCH_ASSOC);

            return $outgoingMovements_data;
        } catch (PDOException $e) {
            echo "Error: " . $e->getMessage();
            return [];
        }
    }

    public function getIncomingMovements() {
        $sql = "SELECT destination AS location, COUNT(*) AS movement, strftime('%Y-%m', start_date) AS year_month
                 FROM vehicle_movements
                 GROUP BY location, year_month";

        try {
            // Fetch combined data for outgoing and incoming trips
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute();
            $IncomingMovements_data = $stmt->fetchAll(PDO::FETCH_ASSOC);

            return $IncomingMovements_data;
        } catch (PDOException $e) {
            echo "Error: " . $e->getMessage();
            return [];
        }
    }
    public function getVehicleLifecycleRange() {
        $sql = "
        SELECT
            MIN(service_duration_days) AS min_service_duration,
            MAX(service_duration_days) AS max_service_duration,
            COUNT(*) AS vehicle_count
        FROM (
            SELECT
            (v.decommissioned - v.commissioned) AS service_duration_days
            FROM
                vehicle v
            WHERE
                v.decommissioned is not null AND
                v.commissioned > 0  -- Exclude vehicles commissioned on day zero
        ) AS service_durations
        GROUP BY
            CASE
                WHEN service_duration_days < 600 THEN '0-600'
                WHEN service_duration_days >= 600 AND service_duration_days < 800 THEN '600-800'
                WHEN service_duration_days >= 800 AND service_duration_days < 1000 THEN '800-1000'
                WHEN service_duration_days >= 1000 AND service_duration_days < 1200 THEN '1000-1200'
                WHEN service_duration_days >= 1200 AND service_duration_days < 1400 THEN '1200-1400'
                WHEN service_duration_days >= 1400 AND service_duration_days < 1600 THEN '1400-1600'
                WHEN service_duration_days >= 1600 AND service_duration_days < 1800 THEN '1600-1800'
                WHEN service_duration_days >= 1800 AND service_duration_days < 2000 THEN '1800-2000'
                ELSE '2000+'
            END
        ORDER BY min_service_duration;
    ";

        $stmt = $this->pdo->prepare($sql);
        $stmt->execute();
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
        return $results;
    }
    public function getVehicleLifecycle($min_day, $max_day, $limit, $offset, $filter) {
        // First query: Fetch paginated results
        $sql = "
        SELECT
        v.vehicle_rego,
        v.vehicle_category,
        v.odometer,
        s1.date AS commissioned_date,
        s2.date AS decommissioned_date,
        CASE 
            WHEN (v.odometer - MAX(m.mileage)) >= 20000 THEN 1
            ELSE 0
        END AS maintenance_need
    FROM
        vehicle v
    LEFT JOIN 
        sim_day_date s1 ON v.commissioned = s1.sim_day
    LEFT JOIN 
        sim_day_date s2 ON v.decommissioned = s2.sim_day
    LEFT JOIN
        maintenance m ON v.vehicle_rego = m.vehicle_rego
    WHERE
        v.commissioned > 0
        AND (v.decommissioned - v.commissioned) BETWEEN :min_day AND :max_day
    GROUP BY 
        v.vehicle_rego
        ";

        $orderConditions = [];

        if (!empty($filter['NeedMaintenance'])) {
            $orderConditions[] = "maintenance_need DESC"; // Show vehicles needing maintenance first
        }
        if (!empty($filter['ASC'])) {
            $orderConditions[] = "(v.decommissioned - v.commissioned) ASC"; // Sort by duration ascending
        }
        if (!empty($filter['DESC'])) {
            $orderConditions[] = "(v.decommissioned - v.commissioned) DESC"; // Sort by duration descending
        }

// Add ordering if any conditions exist
        if (!empty($orderConditions)) {
            $sql .= " ORDER BY " . implode(', ', $orderConditions);
        }
        $sql .= " LIMIT :limit OFFSET :offset";
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindParam(':min_day', $min_day, PDO::PARAM_INT);
        $stmt->bindParam(':max_day', $max_day, PDO::PARAM_INT);
        $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
        $stmt->execute();

        // Fetch the paginated results
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Second query: Get the total number of matching rows without LIMIT and OFFSET
        $countSql = "
        SELECT COUNT(*) AS total_rows
        FROM
            vehicle v
        LEFT JOIN 
            sim_day_date s1 ON v.commissioned = s1.sim_day 
        LEFT JOIN 
            sim_day_date s2 ON v.decommissioned = s2.sim_day 
        WHERE
            v.commissioned > 0 
            AND (v.decommissioned - v.commissioned) BETWEEN :min_day AND :max_day";

        $countStmt = $this->pdo->prepare($countSql);
        $countStmt->bindParam(':min_day', $min_day, PDO::PARAM_INT);
        $countStmt->bindParam(':max_day', $max_day, PDO::PARAM_INT);
        $countStmt->execute();

        // Fetch the total number of rows
        $totalRows = $countStmt->fetch(PDO::FETCH_ASSOC)['total_rows'];

        // Return both results and total row count
        return [
            'results' => $results,
            'total_rows' => $totalRows
        ];
    }



    private function logSQL($sql, $params)
    {
        $sql = "jsut I need the result of this query for a histogram. where x is the duration from 0-600-800 go up by 200 to 2000 and the y axes count of vehicles the rest of conditions are ok
SELECT
    v.vehicle_rego,
    v.vehicle_category,
    v.odometer,
    v.commissioned,
    MAX(m.mileage) AS last_maintenance_mileage,
    (v.odometer - MAX(m.mileage)) AS miles_since_maintenance,
    (v.decommissioned - v.commissioned) AS  duration,
    COUNT(DISTINCT m.vehicle_rego)
FROM
    vehicle v
JOIN
    maintenance m ON v.vehicle_rego = m.vehicle_rego
WHERE
    v.commissioned > 0
    AND v.decommissioned is not null 
GROUP BY
    v.vehicle_rego
HAVING
    (v.odometer - MAX(m.mileage)) >= 20000";
        $logFile = '/Applications/AMPPS/www/assignment/sql.log';
        $logData = "[" . date('Y-m-d H:i:s') . "] SQL: $sql \nParams: " . json_encode($params) . "\n";
        file_put_contents($logFile, $logData, FILE_APPEND);
    }

// Function to log the results
    private function logSQLResult($result)
    {
        $logFile = '/Applications/AMPPS/www/assignment/sql.log';
        $logData = "[" . date('Y-m-d H:i:s') . "] Result: " . json_encode($result) . "\n";
        file_put_contents($logFile, $logData, FILE_APPEND);
    }

// Function to log any SQL errors
    private function logSQLError($error)
    {
        $logFile = '/Applications/AMPPS/www/assignment/sql.log';

        $logData = "[" . date('Y-m-d H:i:s') . "] Error: $error\n";
        file_put_contents($logFile, $logData, FILE_APPEND);
    }



}


?>
