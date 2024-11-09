<?php
session_start();

// Passwort-Hash (generiert mit password_hash)
$correct_hash = 'TGVtb25IYXpl'; // Ersetzen Sie dies mit Ihrem eigenen Hash

// Überprüfen, ob bereits eingeloggt
if (!isset($_SESSION['authenticated'])) {
    // Wenn POST-Request mit Passwort
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        if (password_verify($_POST['password'], $correct_hash)) {
            $_SESSION['authenticated'] = true;
            header('Location: ' . $_SERVER['PHP_SELF']);
            exit;
        } else {
            $error = 'Falsches Passwort!';
        }
    }
    
    // Login-Formular anzeigen
    ?>
    <!DOCTYPE html>
    <html lang="de">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="style.css">
        <title>Login - Materialrechner</title>
    </head>
    <body>
        <div class="password-overlay">
            <div class="password-container">
                <img id="login-logo" src="./src/img/logo.png" alt="LOGO">
                <h2>Passwort erforderlich</h2>
                <?php if (isset($error)): ?>
                    <p style="color: red;"><?php echo $error; ?></p>
                <?php endif; ?>
                <form method="post">
                    <input type="password" name="password" placeholder="Passwort eingeben" required>
                    <button type="submit">Einloggen</button>
                </form>
            </div>
        </div>
    </body>
    </html>
    <?php
    exit;
}

// Wenn eingeloggt, zeige den Hauptinhalt
?>
<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="style.css">
    <title>Materialrechner</title>
</head>
<body>
    <div class="container roboto-regular">
        <div class="header rye-regular">
            <img id="logo" src="./src/img/logo.png" alt="LOGO">
            <h1>ABRUZI & CO. KG - MATERIALRECHNER</h1>
        </div>
        <table id="item-table">
            <thead>
                <tr>
                    <th>Item</th>
                    <th>Yield</th>
                    <th>Quantity</th>
                    <th>Materials</th>
                    <th>Build Time</th>
                    <th>Steps</th>
                    <th>Cost</th>
                    <th>Sell Price (+20%)</th>
                    <th>Sell Price (+50%)</th>
                    <th>Profit (+20%)</th>
                    <th>Profit (+50%)</th>
                    <th>Actual Sell Price</th>
                    <th>Comparison ($)</th>
                    <th>Comparison (%)</th>
                </tr>
            </thead>
            <tbody id="item-list"></tbody>
        </table>
    </div>
    <script src="script.js"></script>
</body>
</html> 