<?php
require_once __DIR__ . '/../vendor/autoload.php'; // adjust if needed
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

$JWT_SECRET = "eec3442f289eb40080ed6e5034b03a99aa9e5d7f74430b43f125365c3ba70f59";

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
