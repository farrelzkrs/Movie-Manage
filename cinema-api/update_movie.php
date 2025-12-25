<?php
require 'db.php';
require 'helpers.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $id = $_POST['id'] ?? null;
    if (!$id) jsonResponse(["success" => false, "message" => "ID required"], 400);

    $title = $_POST['title'] ?? '';
    $desc  = $_POST['description'] ?? '';
    $price = intval($_POST['ticket_price'] ?? 0);

    // Logic update gambar jika ada upload baru
    $sql = "UPDATE movies SET title=?, description=?, ticket_price=? WHERE id=?";
    $params = [$title, $desc, $price, $id];

    if (isset($_FILES['poster']) && $_FILES['poster']['error'] === UPLOAD_ERR_OK) {
        $tmp = $_FILES['poster']['tmp_name'];
        $ext = pathinfo($_FILES['poster']['name'], PATHINFO_EXTENSION);
        $poster_name = uniqid('mov_') . '.' . $ext;
        move_uploaded_file($tmp, __DIR__ . "/poster/" . $poster_name);

        $sql = "UPDATE movies SET title=?, description=?, ticket_price=?, poster=? WHERE id=?";
        $params = [$title, $desc, $price, $poster_name, $id];
    }

    $stmt = $pdo->prepare($sql);
    if ($stmt->execute($params)) {
        jsonResponse(["success" => true, "message" => "Film berhasil diupdate"]);
    } else {
        jsonResponse(["success" => false, "message" => "Gagal update"], 500);
    }
}
