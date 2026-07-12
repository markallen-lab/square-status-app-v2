<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

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

$stmt = $pdo->query("
    SELECT
        id,
        name,
        price,
        pricePrefix,
        billing,
        category,
        description,
        bestFor,
        badge,
        ctaText,
        features,
        isActive
    FROM hosting_packages
    ORDER BY id ASC
");

    $packages = $stmt->fetchAll(PDO::FETCH_ASSOC);

foreach ($packages as &$package) {
    $package['features'] = $package['features']
        ? json_decode($package['features'], true)
        : [];

    $package['isActive'] = (bool)$package['isActive'];
}

    echo json_encode([
        "packages" => $packages
    ]);

} catch(Exception $e){

    http_response_code(500);

    echo json_encode([
        "error"=>"Failed to fetch packages",
        "details"=>$e->getMessage()
    ]);
}