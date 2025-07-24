<?php

date_default_timezone_set('Africa/Johannesburg');

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: https://app.mydomain.co.za");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}
