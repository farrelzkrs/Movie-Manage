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

$stmt = $pdo->prepare("SELECT id, role FROM users WHERE token = ?");
$stmt->execute([$token]);
$user = $stmt->fetch();

if (!$user || $user['role'] !== 'admin') {
    jsonResponse(["success" => false, "message" => "Forbidden"], 403);
}

$sql = "SELECT b.*, m.title as movie_title, u.name as user_name 
        FROM bookings b 
        JOIN movies m ON b.movie_id = m.id 
        JOIN users u ON b.user_id = u.id
        ORDER BY b.created_at DESC";

$stmt = $pdo->query($sql);
$data = $stmt->fetchAll();

jsonResponse(["success" => true, "data" => $data]);
