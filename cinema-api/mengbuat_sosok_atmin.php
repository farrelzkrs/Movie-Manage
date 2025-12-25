<?php
require 'db.php';

// Data Admin
$name = "Supermin";
$email = "atmincerdas17@mail.com";
$password = "berotaksenku";
$role = "admin";

// 1. Cek apakah email sudah ada
$stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
$stmt->execute([$email]);
if ($stmt->fetch()) {
    echo "Gagal: Email $email sudah terdaftar di database.";
    exit;
}

// 2. Hash Password
$hash = password_hash($password, PASSWORD_DEFAULT);

// 3. Generate Token Random
$token = bin2hex(random_bytes(16));

// 4. Insert ke Database
try {
    $sql = "INSERT INTO users (name, email, password, token, role) VALUES (?, ?, ?, ?, ?)";
    $insert = $pdo->prepare($sql);
    $insert->execute([$name, $email, $hash, $token, $role]);

    echo "SUKSES! Admin berhasil ditambahkan.<br>";
    echo "Email: $email<br>";
    echo "Password: $password";
} catch (Exception $e) {
    echo "Error Database: " . $e->getMessage();
}
