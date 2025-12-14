<?php
require 'db.php';
require 'helpers.php';

$auth = $_SERVER['HTTP_AUTHORIZATION'] ?? '';

if (!$auth && function_exists('getallheaders')) {
    $headers = getallheaders();
    $auth = $headers['Authorization'] ?? '';
}

if (!preg_match('/Bearer\s(\S+)/', $auth, $matches)) {
    jsonResponse(["success" => false, "message" => "Unauthorized: Token tidak terbaca"], 401);
}
$token = $matches[1];

$stmt = $pdo->prepare("SELECT id FROM users WHERE token = ?");
$stmt->execute([$token]);
$user = $stmt->fetch();

if (!$user) {
    jsonResponse(["success" => false, "message" => "Invalid Token: User tidak ditemukan"], 401);
}

$input = json_decode(file_get_contents('php://input'), true);
$movie_id = $input['movie_id'] ?? 0;
$qty = intval($input['qty'] ?? 1);
$total = intval($input['total_price'] ?? 0);

if (!$movie_id || $qty < 1) jsonResponse(["success" => false, "message" => "Data tidak valid"], 400);

$ins = $pdo->prepare("INSERT INTO bookings (user_id, movie_id, qty, total_price) VALUES (?, ?, ?, ?)");
if ($ins->execute([$user['id'], $movie_id, $qty, $total])) {
    jsonResponse(["success" => true, "message" => "Tiket berhasil dipesan!"]);
} else {
    jsonResponse(["success" => false, "message" => "Gagal memesan"], 500);
}
