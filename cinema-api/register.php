<?php
require 'db.php';
require 'helpers.php';

$input = json_decode(file_get_contents('php://input'), true);
$name = $input['name'] ?? '';
$email = $input['email'] ?? '';
$password = $input['password'] ?? '';

if (!$name || !$email || !$password) jsonResponse(["success" => false, "message" => "Data tidak lengkap"], 400);

$stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
$stmt->execute([$email]);
if ($stmt->fetch()) jsonResponse(["success" => false, "message" => "Email sudah terdaftar"], 400);

$hash = password_hash($password, PASSWORD_DEFAULT);
$stmt = $pdo->prepare("INSERT INTO users (name, email, password) VALUES (?, ?, ?)");
if ($stmt->execute([$name, $email, $hash])) {
    jsonResponse(["success" => true, "message" => "Registrasi berhasil, silakan login"]);
} else {
    jsonResponse(["success" => false, "message" => "Gagal registrasi"], 500);
}
