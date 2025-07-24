<?php
require_once '../cors.php';
require_once __DIR__ . '/../vendor/autoload.php';
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->load();

try {
    $pdo = new PDO(
        "mysql:host={$_ENV['DB_HOST']};dbname={$_ENV['DB_NAME']};charset=utf8mb4",
        $_ENV['DB_USER'],
        $_ENV['DB_PASS'],
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed']);
    exit();
}

// Parse input JSON
$data = json_decode(file_get_contents("php://input"), true);

// Validate meeting ID
if (!isset($data['id'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Meeting ID is required']);
    exit;
}

// Attempt deletion
try {
    $stmt = $pdo->prepare("DELETE FROM meetings WHERE id = ?");
    $stmt->execute([$data['id']]);
    echo json_encode([
  'success' => true,
  'message' => 'Meeting deleted'
]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Failed to delete meeting'
    ]);
}
