<?php
// CORS setup for Vite dev server
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

// Handle preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Load dependencies
require_once __DIR__ . '/vendor/autoload.php';
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();


$data = json_decode(file_get_contents('php://input'), true);

try {
    $pdo = new PDO(
        "mysql:host={$_ENV['DB_HOST']};dbname={$_ENV['DB_NAME']};charset=utf8mb4",
        $_ENV['DB_USER'],
        $_ENV['DB_PASS'],
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Database connection failed']);
    exit();
}


if (!$data || empty($data['name']) || empty($data['email']) || empty($data['pipelineStage'])) {
  http_response_code(400);
  echo json_encode(['error' => 'Missing required fields']);
  exit;
}

try {
  $stmt = $pdo->prepare('INSERT INTO lead (name, email, phone, source, notes, pipelineStage, status, assignedTo, lastContact) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
  $stmt->execute([
    $data['name'],
    $data['email'],
    $data['phone'] ?? null,
    $data['source'] ?? null,
    $data['notes'] ?? null,
    $data['pipelineStage'],
    $data['status'] ?? 'New',
    $data['assignedTo'] ?? 'Unassigned',
    $data['lastContact'] ?? date('Y-m-d'),
  ]);
  echo json_encode(['success' => true]);
} catch (Exception $e) {
  http_response_code(500);
  echo json_encode(['error' => 'Server error']);
}
