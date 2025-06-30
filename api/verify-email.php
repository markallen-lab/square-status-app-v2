<?php
require_once __DIR__ . '/vendor/autoload.php';
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

header('Content-Type: application/json');

$token = $_GET['token'] ?? '';

if (!$token) {
    echo json_encode(['status' => 'missing']);
    exit;
}

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
    echo json_encode(['status' => 'dberror']);
    exit;
}

$stmt = $pdo->prepare("SELECT id, verification_token_expires FROM users WHERE verification_token = ?");
$stmt->execute([$token]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$user) {
    echo json_encode(['status' => 'invalid']);
    exit;
}

// Check if token is expired
if (new DateTime() > new DateTime($user['verification_token_expires'])) {
    echo json_encode(['status' => 'expired']);
    exit;
}

// Mark email as verified
$update = $pdo->prepare("UPDATE users SET email_verified = 1, verification_token = NULL, verification_token_expires = NULL WHERE id = ?");
$update->execute([$user['id']]);

header('Location: http://localhost/squarestatusApp/login?verified=true');
exit;

