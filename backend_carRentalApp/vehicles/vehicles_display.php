<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Displaying Vehicles</title>
    <style>
        table {
            width: 100%;
            border-collapse: collapse;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 8px;
        }
        th {
            background-color: #f2f2f2;
        }
    </style>
</head>
<body>

<h1>Vehicle List</h1>
<a href="vehicles_api.php?page=1">First</a>
<a href="vehicles_api.php?page=2">PRE</a>
<a href="vehicles_api.php?page=3">Next</a>
<a href="vehicles_api.php?page=5">Last</a>
getNoOfVehicles();
<table id="vehicleTable">
    <thead>
    <tr>
        <th>Registration</th>
        <th>Category</th>
        <th>Odometer</th>
        <th>Commissioned</th>
        <th>Decommissioned</th>
    </tr>
    </thead>
    <tbody>
    <!-- Rows will be added here by JavaScript -->
    </tbody>
</table>

<script>
    // Fetch the JSON data from the PHP script
    fetch('vehicles_api.php?page=${page}') // Adjust the path to your PHP file
        .then(response => response.json())
        .then(data => {
            const tableBody = document.querySelector('#vehicleTable tbody');

            // Iterate over each vehicle and add a row to the table
            data.forEach(vehicle => {
                const row = document.createElement('tr');
                row.innerHTML = `
                        <td>${vehicle.vehicle_rego}</td>
                        <td>${vehicle.vehicle_category}</td>
                        <td>${vehicle.odometer}</td>
                        <td>${vehicle.commissioned}</td>
                        <td>${vehicle.decommissioned || 'N/A'}</td>
                    ;
                tableBody.appendChild(row);
            });
        })
        .catch(error => console.error('Error fetching JSON data:', error));
</script>

</body>
</html>
