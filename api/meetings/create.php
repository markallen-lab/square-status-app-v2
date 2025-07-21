<?php
// CORS setup for Vite dev server
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

header('Content-Type: application/json');

// Load environment variables
require_once __DIR__ . '/../vendor/autoload.php';
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->load();

// Connect to DB
try {
    $pdo = new PDO(
        "mysql:host={$_ENV['DB_HOST']};dbname={$_ENV['DB_NAME']};charset=utf8mb4",
        $_ENV['DB_USER'],
        $_ENV['DB_PASS'],
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Database connection failed'
    ]);
    exit;
}

// Read input
$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['id'], $data['title'], $data['date'], $data['time'])) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => 'Missing required fields'
    ]);
    exit;
}

try {
    $stmt = $pdo->prepare("INSERT INTO meetings (id, title, date, time, participants, description, client_ids) VALUES (?, ?, ?, ?, ?, ?, ?)");
    $stmt->execute([
        $data['id'],
        $data['title'],
        $data['date'],
        $data['time'],
        $data['participants'] ?? '',
        $data['description'] ?? '',
        implode(',', $data['clientIds'] ?? [])
    ]);
    echo json_encode([
        'success' => true,
        'message' => 'Meeting created'
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Failed to create meeting'
    ]);
}
