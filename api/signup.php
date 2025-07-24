<?php
ob_start();
require_once 'cors.php';

if (!file_exists(__DIR__ . '/vendor/autoload.php')) {
    error_log("Autoload file not found!");
    http_response_code(500);
    echo json_encode(["error" => "Server error"]);
    exit;
}

require __DIR__ . '/vendor/autoload.php';
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

header('Content-Type: application/json');

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
$errors = [];

if (!$name) $errors[] = "Name is required";
if (!$email) $errors[] = "Email is required";
if (!$phone) $errors[] = "Phone is required";
if (!$password) $errors[] = "Password is required";

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = "Invalid email format";
}

if (!preg_match('/^\+?[0-9]{7,15}$/', $phone)) {
    $errors[] = "Invalid phone number format";
}

$passwordPattern = '/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/';
if (!preg_match($passwordPattern, $password)) {
    $errors[] = "Password must be at least 8 characters long, and include uppercase, lowercase, number, and symbol.";
}

if (!empty($errors)) {
    http_response_code(400);
    echo json_encode(["error" => implode("; ", $errors)]);
    exit;
}

// ---------------------------
// ✅ Connect to database
// ---------------------------
$dsn = "mysql:host={$_ENV['DB_HOST']};dbname={$_ENV['DB_NAME']};charset=utf8mb4";
try {
    $pdo = new PDO($dsn, $_ENV['DB_USER'], $_ENV['DB_PASS'], [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    ]);
} catch (PDOException $e) {
    error_log("DB connection failed: " . $e->getMessage());
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

    $stmt = $pdo->prepare("
        INSERT INTO users (name, email, phone, password_hash, role, email_verified, verification_token, verification_token_expires)
        VALUES (?, ?, ?, ?, ?, 0, ?, ?)
    ");
    $stmt->execute([$name, $email, $phone, $hashedPassword, $role, $token, $expires]);

    $newUserId = $pdo->lastInsertId();
    $domain = $_ENV['FRONTEND_URL'] ?? 'https://app.squarestatus.co.za';
    $verifyLink = "$domain/api/verify-email.php?token=$token";

    // ---------------------------
    // ✅ Send email
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

        $mail->isHTML(false);
        $mail->Subject = 'Verify Your Email - SquareStatus';
        $mail->Body = "Hi $name,\n\nThank you for signing up. Please verify your email:\n\n$verifyLink\n\nThis link expires in 24 hours.";

        $mail->send();
    } catch (Exception $e) {
        error_log("Email send failed: " . $mail->ErrorInfo);
        http_response_code(500);
        echo json_encode(["error" => "User created but email failed: " . $mail->ErrorInfo]);
        exit;
    }

    http_response_code(201);
    echo json_encode([
        "message" => "User created. Please verify your email.",
        "userId" => $newUserId,
        "name" => $name,
        "email" => $email,
        "role" => $role
    ]);
    exit;

} catch (Exception $e) {
    error_log("Unhandled exception: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(["error" => "Unexpected server error"]);
    exit;
}

ob_end_clean();
