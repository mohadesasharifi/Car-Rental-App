<?php
class Vehicle implements JsonSerializable
{
    protected $vehicle_rego;
    protected $vehicle_category;
    protected $odometer;
    protected $commissioned;
    protected $decommissioned;

    public function __construct($vehicle_rego, $vehicle_category, $odometer, $commissioned, $decommissioned)
    {
        $this->vehicle_rego = $vehicle_rego;
        $this->vehicle_category = $vehicle_category;
        $this->odometer = $odometer;
        $this->commissioned = $commissioned;
        $this->decommissioned = $decommissioned;
    }

    public function jsonSerialize()
    {
        return [
            'vehicle_rego' => $this->vehicle_rego,
            'vehicle_category' => $this->vehicle_category,
            'odometer' => $this->odometer,
            'commissioned_date' => $this->commissioned,
            'decommissioned_date' => $this->decommissioned
        ];
    }

    public function getVehicleRego() { return $this->vehicle_rego; }
    public function getVehicleCategory() { return $this->vehicle_category; }
    public function getOdometer() { return $this->odometer; }
    public function getCommissioned() { return $this->commissioned; }
    public function getDeCommissioned() { return $this->decommissioned; }
}
?>
