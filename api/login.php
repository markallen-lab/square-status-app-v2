<?php
require_once 'cors.php';
require_once 'jwt-utils.php';
require_once __DIR__ . '/vendor/autoload.php';
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid JSON input"]);
    exit;
}

$email = trim($data['email'] ?? '');
$password = $data['password'] ?? '';

if (!$email || !$password) {
    http_response_code(400);
    echo json_encode(["error" => "Email and password are required"]);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid email address"]);
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
    http_response_code(500);
    echo json_encode(["error" => "Database connection failed"]);
    exit;
}

file_put_contents('php://stderr', "Starting login process\n");
try {
    $stmt = $pdo->prepare("SELECT id, name, email, password_hash, role, email_verified FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        http_response_code(401);
        echo json_encode(["error" => "Invalid email or password"]);
        exit;
    }

    file_put_contents('php://stderr', "✅ User found and email is verified.\n");


    if (!$user['email_verified']) {
        http_response_code(403);
        echo json_encode(["error" => "Email is not verified. Please check your inbox."]);
        exit;
    }

    file_put_contents('php://stderr', "Comparing input password: '$password' with hash: '{$user['password_hash']}'\n");

    if (!password_verify($password, $user['password_hash'])) {
    file_put_contents('php://stderr', "❌ Password does NOT match!\n");
    http_response_code(401);
    echo json_encode(["error" => "Invalid email or password"]);
    exit;
    }
    
    $token = createJWT([
        "id" => $user['id'],
        "email" => $user['email'],
        "role" => $user['role']
    ]);
    
    echo json_encode([
        "message" => "Login successful",
        "token" => $token,
        "user" => [
            "id" => $user['id'],
            "name" => $user['name'],
            "email" => $user['email'],
            "role" => $user['role'],
            "emailVerified" => (bool)$user['email_verified']
        ]
    ]);
    exit;

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Server error", "details" => $e->getMessage()]);
    file_put_contents('php://stderr', "Exception: " . $e->getMessage() . "\n");
    exit;
}
