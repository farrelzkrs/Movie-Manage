<?php
// cinema-api/pay_booking.php
require 'db.php';
require 'helpers.php';

// Validasi Token
$headers = getallheaders();
$auth = $headers['Authorization'] ?? '';
if (!$auth && isset($_SERVER['HTTP_AUTHORIZATION'])) {
    $auth = $_SERVER['HTTP_AUTHORIZATION'];
}

if (!preg_match('/Bearer\s(\S+)/', $auth, $matches)) {
    http_response_code(401);
    echo json_encode(["success" => false, "message" => "Unauthorized"]);
    exit;
}
$token = $matches[1];

$stmt = $pdo->prepare("SELECT id FROM users WHERE token = ?");
$stmt->execute([$token]);
$user = $stmt->fetch();

if (!$user) {
    http_response_code(401);
    echo json_encode(["success" => false, "message" => "Invalid Token"]);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$booking_id = $input['booking_id'] ?? null;
$payment_method = $input['payment_method'] ?? 'Other';

if (!$booking_id) {
    echo json_encode(["success" => false, "message" => "Booking ID diperlukan"]);
    exit;
}

// Update status menjadi 'paid'
$sql = "UPDATE bookings SET status = 'paid' WHERE id = ? AND user_id = ?";
$stmt = $pdo->prepare($sql);
$stmt->execute([$booking_id, $user['id']]);

if ($stmt->rowCount() > 0) {
    echo json_encode(["success" => true, "message" => "Pembayaran berhasil!"]);
} else {
    echo json_encode(["success" => false, "message" => "Gagal update status (Pesanan tidak ditemukan atau sudah dibayar)"]);
}
