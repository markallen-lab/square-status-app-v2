<?php
require_once __DIR__ . '/vendor/autoload.php'; 

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

$JWT_SECRET = $_ENV['JWT_SECRET'];

function createJWT($payload) {
    global $JWT_SECRET;
    $issuedAt = time();
    $expiration = $issuedAt + (60 * 60 * 24); // 24 hours

    $token = array_merge($payload, [
        "iat" => $issuedAt,
        "exp" => $expiration
    ]);

    return JWT::encode($token, $JWT_SECRET, 'HS256');
}

function verifyJWT($token) {
    global $JWT_SECRET;
    return JWT::decode($token, new Key($JWT_SECRET, 'HS256'));
}
