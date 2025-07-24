<?php
require_once 'cors.php';

if (!file_exists(__DIR__ . '/vendor/autoload.php')) {
    error_log("Autoload file not found!");
    http_response_code(500);
    echo json_encode(["error" => "Server error: autoload.php missing"]);
    exit;
} else {
    error_log("Autoload file found and included.");
}

require __DIR__ . '/vendor/autoload.php';
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

error_log("DB_HOST: " . ($_ENV['DB_HOST'] ?? 'NOT SET'));
error_log("DB_NAME: " . ($_ENV['DB_NAME'] ?? 'NOT SET'));
error_log("DB_USER: " . ($_ENV['DB_USER'] ?? 'NOT SET'));
error_log("DB_PASS: " . (isset($_ENV['DB_PASS']) ? 'SET' : 'NOT SET'));


use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// ---------------------------
// ✅ Parse input
// ---------------------------
$data = json_decode(file_get_contents("php://input"), true);
error_log("Received data: " . print_r($data, true));

if (!$data) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid JSON input"]);
    exit;
}

$name = trim($data['name'] ?? '');
$email = trim($data['email'] ?? '');
$phone = trim($data['phone'] ?? '');
$password = $data['password'] ?? '';
$role = $data['role'] ?? 'user';

// ---------------------------
// ✅ Validate input
// ---------------------------
if (!$name || !$email || !$phone || !$password) {
    http_response_code(400);
    echo json_encode(["error" => "Please fill all required fields"]);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid email address"]);
    exit;
}

if (!preg_match('/^\+?[0-9]{7,15}$/', $phone)) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid phone number"]);
    exit;
}

$passwordPattern = '/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/';
if (!preg_match($passwordPattern, $password)) {
    http_response_code(400);
    echo json_encode([
        "error" => "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character."
    ]);
    exit;
}

// ---------------------------
// ✅ Connect to database
// ---------------------------
error_log("DB vars: HOST=$_ENV[DB_HOST], NAME=$_ENV[DB_NAME], USER=$_ENV[DB_USER], PASS=" . (isset($_ENV['DB_PASS']) ? 'SET' : 'NOT SET'));


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

// ---------------------------
// ✅ Create user
// ---------------------------
try {
    $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute([$email]);
    if ($stmt->fetch()) {
        http_response_code(409);
        echo json_encode(["error" => "Email already registered"]);
        exit;
    }

    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
    $token = bin2hex(random_bytes(32));
    $expires = date('Y-m-d H:i:s', strtotime('+1 day'));

    $stmt = $pdo->prepare("INSERT INTO users (name, email, phone, password_hash, role, email_verified, verification_token, verification_token_expires) VALUES (?, ?, ?, ?, ?, 0, ?, ?)");
    $stmt->execute([$name, $email, $phone, $hashedPassword, $role, $token, $expires]);

    $newUserId = $pdo->lastInsertId();
    $verifyLink = "http://localhost/squarestatusApp/api/verify-email.php?token=$token";

    // ---------------------------
    // ✅ Send verification email
    // ---------------------------
    $mail = new PHPMailer(true);
    try {
        $mail->isSMTP();
        $mail->Host       = $_ENV['MAIL_HOST'];
        $mail->SMTPAuth   = $_ENV['MAIL_AUTH'] === 'true';
        $mail->Username   = $_ENV['MAIL_USER'];
        $mail->Password   = $_ENV['MAIL_PASS'];
        $mail->SMTPSecure = $_ENV['MAIL_SEC']; 
        $mail->Port       = $_ENV['MAIL_PORT'];

        $mail->setFrom($_ENV['MAIL_USER'], 'SquareStatus');
        $mail->addAddress($email, $name);

        $mail->Subject = 'Verify Your Email - SquareStatus';
        $mail->Body = "Hi $name,\n\nThank you for signing up. Please verify your email by clicking the link below:\n\n$verifyLink\n\nThis link expires in 24 hours.";

        $mail->send();
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["error" => "User created but failed to send verification email: " . $mail->ErrorInfo]);
        exit;
    }

    http_response_code(201);
    echo json_encode([
        "message" => "User created successfully. Please check your email to verify your account.",
        "userId" => $newUserId,
        "name" => $name,
        "email" => $email,
        "role" => $role
    ]);
    exit;

} catch (Exception $e) {
    error_log("Unhandled exception: " . $e->getMessage());
    http_response_code(500);
    ob_end_clean();
    echo json_encode(["error" => "Unexpected server error"]);
    exit;
}

ob_end_clean();
