// Passwort-Hash
const CORRECT_HASH = "942ad5b0b963a88025c4292a6f22a68ae484e0a86194a50b4ce8129c744e071b";

// Hash-Funktion
async function sha256(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  return hashHex;
}

// Passwort überprüfen
async function checkPassword() {
  const input = document.getElementById("password-input").value;
  const inputHash = await sha256(input);

  if (inputHash === CORRECT_HASH) {
    // Passwort korrekt
    document.getElementById("login-overlay").style.display = "none";
    document.getElementById("main-content").style.display = "block";
    // Speichere Login-Status
    sessionStorage.setItem("authenticated", "true");
  } else {
    // Passwort falsch
    document.getElementById("error-message").style.display = "block";
    document.getElementById("password-input").value = "";
  }
}

// Enter-Taste abfangen
document.getElementById("password-input").addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    checkPassword();
  }
});

// Beim Laden prüfen, ob bereits eingeloggt
window.onload = function () {
  if (sessionStorage.getItem("authenticated") === "true") {
    document.getElementById("login-overlay").style.display = "none";
    document.getElementById("main-content").style.display = "block";
  }
};
