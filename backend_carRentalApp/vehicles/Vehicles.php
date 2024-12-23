<?php
class Vehicles
{
    protected $pdo;

    public function __construct($pdo)
    {
        $this->pdo = $pdo;
    }

    public function getAllVehicles($limit, $offset)
    {
        $vehicles = array();
        $query = "SELECT * FROM vehicle LIMIT :limit OFFSET :offset";
        $stmt = $this->pdo->prepare($query);
        $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
        $stmt->execute();

        while ($row = $stmt->fetch(PDO::FETCH_ASSOC))
        {
            $vehicle = new Vehicle(
                htmlspecialchars($row['vehicle_rego']),
                htmlspecialchars($row['vehicle_category']),
                htmlspecialchars($row['odometer']),
                htmlspecialchars($row['commissioned']),
                htmlspecialchars($row['decommissioned'])
            );
            $vehicles[] = $vehicle;
        }
        $this->pdo = null;
        return $vehicles;
    }
}
?>
