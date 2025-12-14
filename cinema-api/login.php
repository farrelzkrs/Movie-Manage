<?php
require 'db.php';
require 'helpers.php';

$input = json_decode(file_get_contents('php://input'), true);
$email = $input['email'] ?? '';
$password = $input['password'] ?? '';

$stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
$stmt->execute([$email]);
$user = $stmt->fetch();

if ($user && password_verify($password, $user['password'])) {
    $token = bin2hex(random_bytes(16));
    $pdo->prepare("UPDATE users SET token = ? WHERE id = ?")->execute([$token, $user['id']]);

    unset($user['password']);
    $user['token'] = $token;

    jsonResponse(["success" => true, "data" => $user]);
} else {
    jsonResponse(["success" => false, "message" => "Email atau password salah"], 401);
}
