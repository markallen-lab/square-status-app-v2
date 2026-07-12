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

    if (empty($data['id'])) {
        http_response_code(400);
        echo json_encode([
            "error" => "Missing task ID"
        ]);
        exit;
    }

    $pdo->beginTransaction();

    // Stop every running timer
    $pdo->exec("
        UPDATE tasks
        SET
            timerRunning = 0,
            timerStartedAt = NULL
        WHERE timerRunning = 1
    ");

    // Start selected task
$stmt = $pdo->prepare("
    UPDATE tasks
    SET
        timerRunning = 1,
        timerStartedAt = NOW(),
        current_timer_user = ?
    WHERE id = ?
");

$stmt->execute([
    $data['user_id'],
    $data['id']
]);

    $pdo->commit();

    echo json_encode([
        "success" => true
    ]);

} catch(Exception $e){

    if(isset($pdo)){
        $pdo->rollBack();
    }

    http_response_code(500);

    echo json_encode([
        "error"=>"Failed to start timer",
        "details"=>$e->getMessage()
    ]);
}