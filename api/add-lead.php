<?php
require_once __DIR__ . '/vendor/autoload.php';

header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

// Load env variables
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

$data = json_decode(file_get_contents('php://input'), true);

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
