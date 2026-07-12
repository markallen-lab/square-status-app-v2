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

    if(empty($_GET['task_id'])){

        http_response_code(400);

        echo json_encode([
            "error"=>"Missing task_id"
        ]);

        exit;
    }

    $stmt = $pdo->prepare("

        SELECT

            tc.*,

            u.name AS admin_name,

            c.company_name

        FROM task_comments tc

        LEFT JOIN users u
            ON tc.user_id = u.id

        LEFT JOIN client c
            ON tc.client_id = c.id

        WHERE tc.task_id = ?

        ORDER BY tc.created_at ASC

    ");

    $stmt->execute([
        $_GET['task_id']
    ]);

    echo json_encode([
        "comments"=>$stmt->fetchAll(PDO::FETCH_ASSOC)
    ]);

}
catch(Exception $e){

    http_response_code(500);

    echo json_encode([
        "error"=>"Failed to fetch comments",
        "details"=>$e->getMessage()
    ]);

}