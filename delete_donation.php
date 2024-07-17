<?php
$servername = "";
$username = "";
$password = "";
$dbname = "";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if (isset($_GET['delete_id'])) {
    $delete_id = $_GET['delete_id'];

    $stmt = $conn->prepare("DELETE FROM donations WHERE delete_id = ?");
    $stmt->bind_param("s", $delete_id);

    if ($stmt->execute() === TRUE) {
        echo "Die Spende wurde erfolgreich gelöscht.";
    } else {
        echo "Fehler beim Löschen der Spende: " . $stmt->error;
    }

    $stmt->close();
} else {
    echo "Ungültige Anfrage.";
}

$conn->close();
?>
