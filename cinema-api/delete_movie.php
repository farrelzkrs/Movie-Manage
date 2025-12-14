<?php
require 'db.php';
require 'helpers.php';

$id = $_GET['id'] ?? null;
if (!$id) jsonResponse(["success" => false, "message" => "ID required"], 400);

$stmt = $pdo->prepare("DELETE FROM movies WHERE id = ?");
if ($stmt->execute([$id])) {
    jsonResponse(["success" => true, "message" => "Film dihapus"]);
} else {
    jsonResponse(["success" => false, "message" => "Gagal menghapus"], 500);
}
