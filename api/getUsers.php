<?php
require_once 'cors.php';
require_once __DIR__ . '/vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

try {
    $pdo = new PDO(
        "mysql:host={$_ENV['DB_HOST']};dbname={$_ENV['DB_NAME']};charset=utf8mb4",
        $_ENV['DB_USER'],
        $_ENV['DB_PASS'],
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
        ]
    );

    // Only return active admin users that can be assigned tasks
    $stmt = $pdo->prepare("
        SELECT
            id,
            name,
            email,
            role
        FROM users
        WHERE role IN ('admin', 'super-admin')
        ORDER BY name ASC
    ");

    $stmt->execute();

    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'users' => $users
    ]);

} catch (Exception $e) {
    http_response_code(500);

    echo json_encode([
        'error' => 'Failed to fetch users'
        // Uncomment while debugging:
        // 'details' => $e->getMessage()
    ]);
}