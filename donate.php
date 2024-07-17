<?php
$servername = "";
$username = "";
$password = "";
$dbname = "";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $barcode = $_POST['barcode'];
    $first_name = $_POST['first_name'];
    $last_name = $_POST['last_name'];
    $address = $_POST['address'];
    $phone = $_POST['phone'];
    $email = $_POST['email'];
    $latitude = $_POST['latitude'];
    $longitude = $_POST['longitude'];
    $delete_id = uniqid();
    $expiry_date = date('Y-m-d H:i:s', strtotime('+7 days'));
    $mhd = $_POST['mhd'];


    $api_url = "https://world.openfoodfacts.org/api/v0/product/$barcode.json?lc=de";
    $product_data = json_decode(file_get_contents($api_url), true);

    if (isset($product_data['product'])) {
        $product_name = $product_data['product']['product_name'];
        
    
        $stmt = $conn->prepare("INSERT INTO products (barcode, product_name) VALUES (?, ?) ON DUPLICATE KEY UPDATE product_name=?");
        $stmt->bind_param("sss", $barcode, $product_name, $product_name);
        $stmt->execute();
    } else {
        $product_name = "Unbekanntes Produkt";
    }

    $sql = "INSERT INTO donations (barcode, first_name, last_name, address, phone, email, latitude, longitude, delete_id, expiry_date, mhd) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ssssssddsss", $barcode, $first_name, $last_name, $address, $phone, $email, $latitude, $longitude, $delete_id, $expiry_date, $mhd);

    if ($stmt->execute() === TRUE) {
        $delete_link = "https://foodshare.kevinboehme.de/delete_donation.php?delete_id=$delete_id";
        $subject = "Vielen Dank für Ihre Spende!";
        $message = "Hallo $first_name $last_name,\n\nVielen Dank für das Registrieren des Produkts: $product_name.\n\nFalls Sie das Produkt löschen möchten, klicken Sie bitte auf den folgenden Link:\n$delete_link\n\nMit freundlichen Grüßen,\nIhr Foodshare Team";
        $headers = "From: no-reply@foodshare.kevinboehme.de\r\n";
        $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

        mail($email, $subject, $message, $headers);

        echo json_encode(['status' => 'success']);
    } else {
        echo json_encode(['status' => 'error', 'message' => $stmt->error]);
    }

    $stmt->close();
}

$conn->close();
?>
