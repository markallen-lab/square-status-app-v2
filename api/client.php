<?php
require_once 'cors.php';
require_once __DIR__ . '/vendor/autoload.php';
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

// Connect to DB
$host = $_ENV['DB_HOST'];
$db   = $_ENV['DB_NAME'];
$user = $_ENV['DB_USER'];
$pass = $_ENV['DB_PASS'];
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";

try {
    $pdo = new PDO($dsn, $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Database connection failed"]);
    exit;
}

// Get client ID from query
$clientId = $_GET['id'] ?? null;

if (!$clientId || !is_numeric($clientId)) {
    http_response_code(400);
    echo json_encode(["error" => "Missing or invalid client ID"]);
    exit;
}

// Fetch client
try {
    $stmt = $pdo->prepare("SELECT * FROM client WHERE id = ?");
    $stmt->execute([$clientId]);
    $client = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$client) {
        http_response_code(404);
        echo json_encode(["error" => "Client not found"]);
        exit;
    }

    http_response_code(200);
    echo json_encode($client);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Server error"]);
}
