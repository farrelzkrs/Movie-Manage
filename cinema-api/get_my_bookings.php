<?php
require 'db.php';
require 'helpers.php';

$headers = getallheaders();
$auth = $headers['Authorization'] ?? '';
if (!$auth && isset($_SERVER['HTTP_AUTHORIZATION'])) {
    $auth = $_SERVER['HTTP_AUTHORIZATION'];
}

if (!preg_match('/Bearer\s(\S+)/', $auth, $matches)) {
    jsonResponse(["success" => false, "message" => "Unauthorized"], 401);
}
$token = $matches[1];

$stmt = $pdo->prepare("SELECT id FROM users WHERE token = ?");
$stmt->execute([$token]);
$user = $stmt->fetch();

if (!$user) {
    jsonResponse(["success" => false, "message" => "Invalid Token"], 401);
}

$sql = "SELECT b.*, m.title as movie_title 
        FROM bookings b 
        JOIN movies m ON b.movie_id = m.id 
        WHERE b.user_id = ? 
        ORDER BY b.created_at DESC";

$stmt = $pdo->prepare($sql);
$stmt->execute([$user['id']]);
$data = $stmt->fetchAll();

jsonResponse(["success" => true, "data" => $data]);
