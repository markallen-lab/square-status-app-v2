<?php
require_once 'cors.php';
require_once __DIR__ . '/vendor/autoload.php';
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

$data = json_decode(file_get_contents("php://input"), true);

if (!$data || !isset($data['id'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Missing client ID or data']);
    exit;
}

try {
    $pdo = new PDO(
        "mysql:host={$_ENV['DB_HOST']};dbname={$_ENV['DB_NAME']};charset=utf8mb4",
        $_ENV['DB_USER'],
        $_ENV['DB_PASS'],
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );

  $stmt = $pdo->prepare("
    UPDATE client SET
        name = :name,
        lastname = :lastname,
        email = :email,
        cell = :cell, -- ✅ FIXED THIS LINE
        company_name = :company_name,
        company_email = :company_email,
        company_address = :company_address,
        company_phone = :company_phone,
        company_fax = :company_fax,
        company_industry = :company_industry,
        domain = :domain,
        package = :package,
        status = :status
    WHERE id = :id
");

$stmt->execute([
    ':name'             => $data['name'] ?? '',
    ':lastname'         => $data['lastname'] ?? '',
    ':email'            => $data['email'] ?? '',
    ':cell'             => $data['phone'] ?? '',
    ':company_name'     => $data['company_name'] ?? '',
    ':company_email'    => $data['company_email'] ?? '',
    ':company_address'  => $data['company_address'] ?? '',
    ':company_phone'    => $data['company_phone'] ?? '',
    ':company_fax'      => $data['company_fax'] ?? '',
    ':company_industry' => $data['company_industry'] ?? '',
    ':domain'           => $data['domain'] ?? '',
    ':package'          => $data['package'] ?? '',
    ':status'           => $data['status'] ?? 'Pending',
    ':id'               => $data['id']
]);


    echo json_encode(['success' => true, 'message' => 'Client updated successfully']);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Database error: ' . $e->getMessage()]);
}
