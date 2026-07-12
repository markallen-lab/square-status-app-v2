<?php

require_once 'cors.php';
require_once __DIR__ . '/vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['id'])) {
    http_response_code(400);
    echo json_encode([
        "error" => "Package ID required"
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

    $stmt = $pdo->prepare("DELETE FROM hosting_packages WHERE id = ?");

    $stmt->execute([$data['id']]);

    echo json_encode([
        "success" => true
    ]);

} catch(Exception $e){

    http_response_code(500);

    echo json_encode([
        "error"=>"Delete failed",
        "details"=>$e->getMessage()
    ]);

}