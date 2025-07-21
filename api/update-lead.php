<?php
// CORS headers - allow your frontend origin or use * for dev (but better specify)
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    // Preflight request: just return 200 OK with headers
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/vendor/autoload.php';
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

$data = json_decode(file_get_contents('php://input'), true);

if (!$data || empty($data['id'])) {
  http_response_code(400);
  echo json_encode(['error' => 'Missing lead ID']);
  exit;
}

try {
    $pdo = new PDO(
        "mysql:host={$_ENV['DB_HOST']};dbname={$_ENV['DB_NAME']};charset=utf8mb4",
        $_ENV['DB_USER'],
        $_ENV['DB_PASS'],
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]
    );
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'DB connection failed: ' . $e->getMessage()]);
    exit;
}


try {
  $stmt = $pdo->prepare('UPDATE lead SET name=?, email=?, phone=?, source=?, notes=?, pipelineStage=?, status=?, assignedTo=?, lastContact=? WHERE id=?');
  $stmt->execute([
    $data['name'] ?? null,
    $data['email'] ?? null,
    $data['phone'] ?? null,
    $data['source'] ?? null,
    $data['notes'] ?? null,
    $data['pipelineStage'] ?? null,
    $data['status'] ?? null,
    $data['assignedTo'] ?? null,
    $data['lastContact'] ?? null,
    $data['id'],
  ]);
  echo json_encode(['success' => true]);
} catch (Exception $e) {
  http_response_code(500);
  echo json_encode(['error' => 'Server error']);
}
