<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

$servername = "";
$username = "";
$password = "";
$dbname = "";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(['status' => 'error', 'message' => 'Connection failed: ' . $conn->connect_error]));
}

$sql = "SELECT * FROM donations";
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
