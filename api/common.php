<?php
// common.php
header('Content-Type: application/json');

// Allow CORS for your frontend origin (adjust accordingly)
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle OPTIONS preflight request (for CORS)
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
  exit(0);
}

// Connect to DB
$pdo = new PDO(
    "mysql:host={$_ENV['DB_HOST']};dbname={$_ENV['DB_NAME']};charset=utf8mb4",
    $_ENV['DB_USER'],
    $_ENV['DB_PASS'],
    [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
);
?>
