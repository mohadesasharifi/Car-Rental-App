<?php
define("CONNECTION_STRING", "sqlite:" . __DIR__ . "/../RentalSimV8Logging.2024-08-09.db");
define("CONNECTION_USER", "");
define("CONNECTION_PASSWORD", "");
define("CONNECTION_OPTIONS", [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES => false,
]);
?>
