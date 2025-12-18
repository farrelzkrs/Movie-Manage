<?php
$host = "localhost";
$user = "root"; // Ganti dengan user database Anda
$pass = "";     // Ganti dengan password database Anda
$db   = "nama_database";
$options = [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
];
try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "DB Connection Failed"]);
    exit;
}
