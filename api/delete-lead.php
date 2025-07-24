<?php
require_once 'cors.php';
require_once __DIR__ . '/vendor/autoload.php';
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

try {
      $data = json_decode(file_get_contents("php://input"), true);
      $id = $data['id'] ?? null;

      if (!$id) {
        echo json_encode(['success' => false, 'error' => 'Missing client ID']);
        exit();
    }
      $pdo = new PDO(
        "mysql:host={$_ENV['DB_HOST']};dbname={$_ENV['DB_NAME']};charset=utf8mb4",
        $_ENV['DB_USER'],
        $_ENV['DB_PASS'],
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );
    
  $stmt = $pdo->prepare('DELETE FROM lead WHERE id = ?');
  $stmt->execute([$data['id']]);
  echo json_encode(['success' => true]);
} catch (Exception $e) {
  http_response_code(500);
  echo json_encode(['error' => 'Server error']);
}
