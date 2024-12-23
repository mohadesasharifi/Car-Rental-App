<?php
function openConnection()
{
    require 'login.php'; // Assuming you will handle the credentials in login.php

    try {
        $pdo = new PDO(
            CONNECTION_STRING,
            CONNECTION_USER,
            CONNECTION_PASSWORD,
            CONNECTION_OPTIONS
        );
    } catch (PDOException $e) {
        fatalError($e->getMessage());
        exit;
    }

    return $pdo;
}

function fatalError($errorMessage)
{
    echo "<p><strong>Something went wrong: $errorMessage</strong></p>";
}


?>

