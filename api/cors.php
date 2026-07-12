<?php

date_default_timezone_set('Africa/Johannesburg');

$allowedOrigins = [
    "http://localhost:5173",
    "https://app.mydomain.co.za",
];

$origin = $_SERVER['HTTP_ORIGIN'] ?? "";

if (in_array($origin, $allowedOrigins, true)) {
    header("Access-Control-Allow-Origin: $origin");
}

header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}