<?php
require 'common.php';

$data = json_decode(file_get_contents('php://input'), true);

if (!$data || empty($data['id'])) {
  http_response_code(400);
  echo json_encode(['error' => 'Missing lead ID']);
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
