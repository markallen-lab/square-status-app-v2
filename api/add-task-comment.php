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

    $data = json_decode(file_get_contents("php://input"), true);

    if (
        empty($data['task_id']) ||
        empty($data['comment'])
    ) {

        http_response_code(400);

        echo json_encode([
            "error"=>"Missing required fields"
        ]);

        exit;
    }

    $stmt = $pdo->prepare("
        INSERT INTO task_comments
        (
            task_id,
            user_id,
            client_id,
            comment,
            is_internal
        )
        VALUES
        (
            ?, ?, ?, ?, ?
        )
    ");

    $stmt->execute([
        $data['task_id'],
        $data['user_id'] ?? null,
        $data['client_id'] ?? null,
        trim($data['comment']),
        $data['is_internal'] ?? 1
    ]);

    echo json_encode([
        "success"=>true,
        "id"=>$pdo->lastInsertId()
    ]);

}
catch(Exception $e){

    http_response_code(500);

    echo json_encode([
        "error"=>"Failed to add comment",
        "details"=>$e->getMessage()
    ]);

}