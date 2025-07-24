<?php
require_once 'cors.php';
require_once __DIR__ . '/vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

try {
  $pdo = new PDO(
    "mysql:host={$_ENV['DB_HOST']};dbname={$_ENV['DB_NAME']}",
    $_ENV['DB_USER'],
    $_ENV['DB_PASS'],
    [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
  );

  $data = json_decode(file_get_contents("php://input"), true);

  if (!$data || empty($data['title'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing task title']);
    exit;
  }

  $stmt = $pdo->prepare("INSERT INTO tasks (title, project, assignedTo, priority, status, dueDate, clientId, timeTracked, timerRunning)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->execute([
    $data['title'],
    $data['project'] ?? null,
    $data['assignedTo'] ?? null,
    $data['priority'] ?? 'Medium',
    $data['status'] ?? 'Pending',
    $data['dueDate'] ?? null,
    $data['clientId'] ?? null,
    $data['timeTracked'] ?? 0,
    $data['timerRunning'] ?? false
  ]);

  echo json_encode(['success' => true]);
} catch (Exception $e) {
  http_response_code(500);
  echo json_encode(['error' => 'Failed to add task']);
}
