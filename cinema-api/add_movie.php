<?php
require 'db.php';
require 'helpers.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $title = $_POST['title'] ?? '';
    $desc  = $_POST['description'] ?? '';
    $price = intval($_POST['ticket_price'] ?? 0);
    $poster_name = null;

    if (isset($_FILES['poster']) && $_FILES['poster']['error'] === UPLOAD_ERR_OK) {
        $tmp = $_FILES['poster']['tmp_name'];
        $ext = pathinfo($_FILES['poster']['name'], PATHINFO_EXTENSION);
        $poster_name = uniqid('mov_') . '.' . $ext;
        move_uploaded_file($tmp, __DIR__ . "/poster/" . $poster_name);
    }

    $stmt = $pdo->prepare("INSERT INTO movies (title, description, ticket_price, poster) VALUES (?,?,?,?)");
    if ($stmt->execute([$title, $desc, $price, $poster_name])) {
        jsonResponse(["success" => true, "message" => "Film berhasil ditambahkan"]);
    } else {
        jsonResponse(["success" => false, "message" => "Gagal menambah film"], 500);
    }
}
