<?php
require_once __DIR__ . '/vendor/autoload.php';

header('Content-Type: application/json');
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");

// Load env vars
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

try {
  $pdo = new PDO(
    "mysql:host={$_ENV['DB_HOST']};dbname={$_ENV['DB_NAME']}",
    $_ENV['DB_USER'],
    $_ENV['DB_PASS'],
    [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
  );

  $stmt = $pdo->query("SELECT * FROM tasks ORDER BY created_at DESC");
  $tasks = $stmt->fetchAll(PDO::FETCH_ASSOC);

  echo json_encode(['tasks' => $tasks]);
} catch (Exception $e) {
  http_response_code(500);
  echo json_encode(['error' => 'Database connection failed']);
}
