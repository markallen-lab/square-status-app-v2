<?php
require_once 'jwt-utils.php';

$headers = getallheaders();
if (!isset($headers['Authorization']) || !preg_match('/Bearer\s(\S+)/', $headers['Authorization'], $matches)) {
    http_response_code(401);
    echo json_encode(["error" => "Unauthorized"]);
    exit;
}

try {
    $decoded = verifyJWT($matches[1]);
    // You can use $decoded->id or $decoded->email to fetch user-specific data
    echo json_encode(["message" => "Authorized", "userId" => $decoded->id]);
} catch (Exception $e) {
    http_response_code(401);
    echo json_encode(["error" => "Invalid or expired token"]);
    exit;
}

