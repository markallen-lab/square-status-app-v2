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

  $stmt = $pdo->query("SELECT * FROM tasks ORDER BY created_at DESC");
  $tasks = $stmt->fetchAll(PDO::FETCH_ASSOC);

  echo json_encode(['tasks' => $tasks]);
} catch (Exception $e) {
  http_response_code(500);
  echo json_encode(['error' => 'Database connection failed']);
}
