<?php
$servername = "";
$username = "";
$password = "";
$dbname = "";



$conn = new mysqli($servername, $username, $password, $dbname);


if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}


$sql = "SELECT d.*, p.product_name 
        FROM donations d 
        LEFT JOIN products p ON d.barcode = p.barcode 
        ORDER BY d.id DESC 
        LIMIT 5";
$result = $conn->query($sql);

$donations = array();

if ($result->num_rows > 0) {

    while($row = $result->fetch_assoc()) {
        $donations[] = $row;
    }
}


echo json_encode($donations);


$conn->close();
?>
