<?php
session_start();

// Überprüfen, ob bereits eingeloggt
if (!isset($_SESSION['authenticated'])) {
    // Wenn POST-Request mit Passwort
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $password = 'LemonHaze';
        
        if ($_POST['password'] === $password) {
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
        <title>Login</title>
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

// Wenn eingeloggt, zeige den eigentlichen Inhalt
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
        <div class="container roboto-regular">
      <div class="header rye-regular">
        <img id="logo" src="./src/img/logo.png" alt="LOGO" />
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
    <script src="https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js"></script>
  </body>
    </div>
    <script src="script.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js"></script>
</body>
</html> 