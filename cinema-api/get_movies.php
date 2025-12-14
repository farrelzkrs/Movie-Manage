<?php
require 'db.php';
require 'helpers.php';

$stmt = $pdo->query("SELECT * FROM movies ORDER BY id DESC");
$data = $stmt->fetchAll();
echo json_encode($data);
