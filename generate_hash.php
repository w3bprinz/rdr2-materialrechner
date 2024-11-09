<?php
$password = "LemonHaze"; // Ändern Sie dies in Ihr gewünschtes Passwort
$hash = password_hash($password, PASSWORD_DEFAULT);
echo "Ihr Passwort-Hash: " . $hash;
?> 