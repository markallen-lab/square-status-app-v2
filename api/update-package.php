<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

require_once 'cors.php';
require_once __DIR__ . '/vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

$data = json_decode(file_get_contents("php://input"), true);

if (!$data || !isset($data['id'])) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "error" => "Invalid request."
    ]);
    exit;
}

try {

    $pdo = new PDO(
        "mysql:host={$_ENV['DB_HOST']};dbname={$_ENV['DB_NAME']};charset=utf8mb4",
        $_ENV['DB_USER'],
        $_ENV['DB_PASS'],
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
        ]
    );

$stmt = $pdo->prepare("
    UPDATE hosting_packages
    SET
        name = ?,
        price = ?,
        pricePrefix = ?,
        billing = ?,
        category = ?,
        description = ?,
        bestFor = ?,
        badge = ?,
        ctaText = ?,
        features = ?,
        isActive = ?
    WHERE id = ?
");

$stmt->execute([
    $data['name'],
    $data['price'],
    $data['pricePrefix'] ?? null,
    $data['billing'],
    $data['category'],
    $data['description'],
    $data['bestFor'] ?? null,
    $data['badge'] ?? null,
    $data['ctaText'] ?? null,
    json_encode($data['features'] ?? []),
    !empty($data['isActive']) ? 1 : 0,
    $data['id']
]);

    echo json_encode([
        "success" => true,
        "package" => $data
    ]);

} catch (Exception $e) {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "error" => "Failed to update package.",
        "details" => $e->getMessage()
    ]);
}