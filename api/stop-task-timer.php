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

    if(empty($data['id'])){
        http_response_code(400);
        echo json_encode([
            "error"=>"Missing task ID"
        ]);
        exit;
    }

$stmt = $pdo->prepare("
    SELECT
        timeTracked,
        timerStartedAt,
        current_timer_user
    FROM tasks
    WHERE id = ?
");

    $stmt->execute([
        $data['id']
    ]);

    $task=$stmt->fetch(PDO::FETCH_ASSOC);

    if(!$task || !$task['timerStartedAt']){
        throw new Exception("Timer not running");
    }

    $elapsed =
        time() -
        strtotime($task['timerStartedAt']);

        $log = $pdo->prepare("
    INSERT INTO task_time_logs
    (
        task_id,
        user_id,
        started_at,
        ended_at,
        seconds
    )
    VALUES (?, ?, ?, NOW(), ?)
");

$log->execute([
    $data['id'],
    $task['current_timer_user'],
    $task['timerStartedAt'],
    $elapsed
]);

$stmt = $pdo->prepare("
    UPDATE tasks
    SET
        timeTracked = ?,
        timerRunning = 0,
        timerStartedAt = NULL,
        current_timer_user = NULL
    WHERE id = ?
");

$stmt->execute([
    $task['timeTracked'] + $elapsed,
    $data['id']
]);

    echo json_encode([
        "success"=>true
    ]);

}catch(Exception $e){

    http_response_code(500);

    echo json_encode([
        "error"=>"Failed to stop timer",
        "details"=>$e->getMessage()
    ]);
}