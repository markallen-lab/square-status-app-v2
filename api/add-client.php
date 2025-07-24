<?php
require_once 'cors.php';
require_once __DIR__ . '/vendor/autoload.php';
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    echo json_encode(['success' => false, 'error' => 'Invalid input']);
    exit;
}

// Basic validation (you can extend this)
if (empty($input['name']) || empty($input['email']) || empty($input['company_name'])) {
    echo json_encode(['success' => false, 'error' => 'Missing required fields']);
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
        INSERT INTO client 
        (name, lastname, email, cell, company_name, company_email, company_address, company_phone, company_fax, company_industry, domain, package, status) 
        VALUES 
        (:name, :lastname, :email, :phone, :company_name, :company_email, :company_address, :company_phone, :company_fax, :company_industry, :domain, :package, :status)
    ");

    $stmt->execute([
        ':name' => $input['name'],
        ':lastname' => $input['lastname'] ?? null,
        ':email' => $input['email'],
        ':phone' => $input['phone'] ?? null,
        ':company_name' => $input['company_name'],
        ':company_email' => $input['company_email'] ?? null,
        ':company_address' => $input['company_address'] ?? null,
        ':company_phone' => $input['company_phone'] ?? null,
        ':company_fax' => $input['company_fax'] ?? null,
        ':company_industry' => $input['company_industry'] ?? null,
        ':domain' => $input['domain'] ?? null,
        ':package' => $input['package'] ?? null,
        ':status' => $input['status'] ?? 'Pending',
    ]);

    echo json_encode(['success' => true]);

} catch (PDOException $e) {
    echo json_encode(['success' => false, 'error' => 'Database error: ' . $e->getMessage()]);
}
