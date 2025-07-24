<?php
require_once 'cors.php';
require_once __DIR__ . '/vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

$token = $_GET['token'] ?? '';

if (!$token || !preg_match('/^[a-zA-Z0-9\-_=]+$/', $token)) {
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

    $stmt = $pdo->prepare("SELECT id, verification_token_expires FROM users WHERE verification_token = ?");
    $stmt->execute([$token]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        echo json_encode(['status' => 'invalid']);
        exit;
    }

    $expiresAt = new DateTime($user['verification_token_expires']);
    $now = new DateTime();

    if ($now > $expiresAt) {
        echo json_encode(['status' => 'expired']);
        exit;
    }

    $update = $pdo->prepare("
        UPDATE users
        SET email_verified = 1,
            verification_token = NULL,
            verification_token_expires = NULL
        WHERE id = ?
    ");
    $update->execute([$user['id']]);

    echo json_encode(['status' => 'success']);
    exit;

} catch (PDOException $e) {
    echo json_encode(['status' => 'dberror']);
    exit;
} catch (Exception $e) {
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
    exit;
}
