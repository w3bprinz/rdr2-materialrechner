let decryptedData = null;
let encryptedData = null;

// Lade verschlüsselte Daten beim Start
async function loadEncryptedData() {
  try {
    const response = await fetch("data.enc");
    encryptedData = await response.text();
  } catch (error) {
    console.error("Fehler beim Laden der verschlüsselten Daten:", error);
  }
}

// Passwort überprüfen und Daten entschlüsseln
function checkPassword() {
  const passwordInput = document.getElementById("password-input");
  const password = passwordInput.value;

  try {
    const decrypted = CryptoJS.AES.decrypt(encryptedData, password).toString(CryptoJS.enc.Utf8);
    decryptedData = JSON.parse(decrypted);

    // Wenn die Entschlüsselung erfolgreich war
    document.getElementById("password-dialog").style.display = "none";
    document.getElementById("main-content").style.display = "block";

    // Globale Variablen mit entschlüsselten Daten setzen
    items = decryptedData.items;
    prices = decryptedData.prices;
    actualSellingPrices = decryptedData.actualSellingPrices;

    // Tabelle initialisieren
    updateTable();
  } catch (error) {
    alert("Falsches Passwort!");
    passwordInput.value = "";
  }
}

// Event Listener für Enter-Taste
document.getElementById("password-input").addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    checkPassword();
  }
});

// Lade verschlüsselte Daten beim Start
document.addEventListener("DOMContentLoaded", loadEncryptedData);

function formatComparisonPercent(percent) {
  let cssClass = ""; // Standardklasse (keine Klasse)

  if (percent < 0) {
    cssClass = "red-bold"; // Unter 0%: ROT und FETT
  } else if (percent >= 0 && percent <= 20) {
    cssClass = "red"; // 0-20%: ROT
  } else if (percent > 20 && percent <= 50) {
    cssClass = "orange"; // 25-50%: ORANGE
  } else if (percent > 50) {
    cssClass = "green"; // Über 50%: GRÜN
  }
  return cssClass;
}

// Schrittanzeige und Kostenberechnung
function displaySteps(container, item, quantity) {
  const steps = getSteps(item, quantity);
  let totalCost = 0; // Gesamtkosten für die Herstellung

  steps.forEach((step, index) => {
    const materials = step.materials.map((material) => `${material.amount} x ${material.name}`).join(" & ");

    // Berechne die Kosten für diesen Schritt
    const stepCost = step.materials.reduce((sum, material) => {
      const materialCost = prices[material.name] || 0;
      return sum + material.amount * materialCost;
    }, 0);

    totalCost += stepCost;

    const stepText = document.createElement("div");
    stepText.textContent = `Schritt ${index + 1}: ${materials} für ${step.yield * step.batches} x ${step.item}`;
    container.appendChild(stepText);
  });

  return { steps, totalCost }; // Schritte und Gesamtkosten zurückgeben
}

// Berechnung der Schritte
function getSteps(item, quantity, level = 1) {
  const steps = [];
  const batches = Math.ceil(quantity / item.yield);

  // Materialien für den aktuellen Schritt sammeln
  const materialsForStep = [];

  for (const [material, amount] of Object.entries(item.materials)) {
    const totalAmount = amount * batches;

    // Prüfe, ob das Material ein herstellbares Produkt ist
    const subItem = items.find((i) => i.name === material);

    if (subItem) {
      // Rekursiv die Schritte für das herstellbare Material hinzufügen
      const subSteps = getSteps(subItem, totalAmount, level + 1);
      steps.push(...subSteps); // Füge die Sub-Schritte zuerst ein (rekursiv)
    }

    // Füge das Material zu den Materialien des aktuellen Schritts hinzu
    materialsForStep.push({ name: material, amount: totalAmount });
  }

  // Füge den aktuellen Schritt für das Produkt hinzu
  steps.push({
    level,
    item: item.name,
    yield: item.yield,
    batches,
    materials: materialsForStep,
  });

  return steps;
}

function getItemByName(name) {
  // Diese Funktion sollte das Item-Objekt für den gegebenen Namen zurückgeben
  // Sie könnte auf eine globale Liste oder ein Objekt von Items zugreifen
  return allItems.find((item) => item.name === name);
}

// Berechnung der Kosten und Verkaufspreise
function calculateCosts(item, quantity) {
  function calculateItemCost(currentItem, currentQuantity, depth = 0) {
    const indent = "  ".repeat(depth);
    // console.log(`${indent}Berechne Kosten für: ${currentItem.name}, Menge: ${currentQuantity}`);

    if (!currentItem) {
      // console.warn(`${indent}Item nicht gefunden: ${JSON.stringify(currentItem)}`);
      return 0;
    }

    if (prices[currentItem.name] !== undefined) {
      // console.log(`${indent}Kaufpreis gefunden für ${currentItem.name}: ${prices[currentItem.name]}`);
      return prices[currentItem.name] * currentQuantity;
    } else if (currentItem.materials) {
      // console.log(`${indent}Berechne Materialkosten für: ${currentItem.name}`);
      let itemCost = 0;
      for (const [material, amount] of Object.entries(currentItem.materials)) {
        // console.log(`${indent}  Suche Material: ${material}`);
        const materialPrice = prices[material];
        if (materialPrice !== undefined) {
          const materialCost = materialPrice * amount * currentQuantity;
          itemCost += materialCost;
          // console.log(`${indent}  Materialkosten für ${material}: ${materialCost}`);
        } else {
          const materialItem = items.find((i) => i.name === material);
          if (!materialItem) {
            // console.warn(`${indent}  Material nicht gefunden: ${material} für Item: ${currentItem.name}`);
            // console.log(`${indent}  Verfügbare Items:`, items.map(i => i.name));
            continue;
          }
          const materialCost = calculateItemCost(materialItem, amount * currentQuantity, depth + 1);
          itemCost += materialCost;
        }
      }
      const finalCost = itemCost / (currentItem.yield || 1);
      // console.log(`${indent}Gesamtkosten für ${currentItem.name}: ${finalCost}`);
      return finalCost;
    }
    // console.warn(`${indent}Keine Preisinformationen für: ${currentItem.name}`);
    return 0;
  }

  const totalCost = calculateItemCost(item, quantity);
  const costPerUnit = totalCost / quantity;

  // Verkaufspreise und Gewinne pro Stück berechnen
  const sellingPrice20PerUnit = costPerUnit * 1.2;
  const sellingPrice50PerUnit = costPerUnit * 1.5;
  const profit20PerUnit = sellingPrice20PerUnit - costPerUnit;
  const profit50PerUnit = sellingPrice50PerUnit - costPerUnit;

  // Tatsächlicher Verkaufspreis (pro Stück)
  const actualSellingPrice = actualSellingPrices[item.name] || 0;

  // Vergleich zwischen dem berechneten Verkaufspreis (+20%) und dem tatsächlichen Verkaufspreis
  // const comparisonDollar = actualSellingPrice - sellingPrice20PerUnit;
  // const comparisonPercent = ((actualSellingPrice - sellingPrice20PerUnit) / sellingPrice20PerUnit) * 100;

  // Vergleich zwischen den Herstellungskosten und dem tatsächlichen Verkaufspreis
  const comparisonDollar = actualSellingPrice - costPerUnit;
  const comparisonPercent = ((actualSellingPrice - costPerUnit) / costPerUnit) * 100;

  return {
    totalCost,
    costPerUnit,
    sellingPrice20PerUnit,
    sellingPrice50PerUnit,
    profit20PerUnit,
    profit50PerUnit,
    actualSellingPrice,
    comparisonDollar,
    comparisonPercent,
  };
}

function calculateTotalBuildTime(item, quantity) {
  const steps = getSteps(item, quantity);
  let totalTimeSeconds = 0;

  steps.forEach((step) => {
    const itemData = items.find((i) => i.name === step.item);
    if (itemData && itemData.buildTime) {
      totalTimeSeconds += itemData.buildTime * step.batches;
    }
  });

  if (totalTimeSeconds <= 60) {
    return `${totalTimeSeconds} sec`;
  } else {
    const minutes = Math.floor(totalTimeSeconds / 60);
    const seconds = totalTimeSeconds % 60;
    return `${minutes} min ${seconds} sec`;
  }
}

// Aktualisieren der Tabelle
function updateTable() {
  const itemList = document.getElementById("item-list");
  itemList.innerHTML = ""; // Tabelle zurücksetzen

  items.forEach((item) => {
    const row = document.createElement("tr");

    // Name cell
    const nameCell = document.createElement("td");
    nameCell.textContent = item.name;
    row.appendChild(nameCell);

    // Yield cell
    const yieldCell = document.createElement("td");
    yieldCell.textContent = item.yield;
    row.appendChild(yieldCell);

    // Quantity cell
    const quantityCell = document.createElement("td");
    const quantityInput = document.createElement("input");
    quantityInput.type = "number";
    quantityInput.min = "1";
    quantityInput.value = "1";
    quantityCell.appendChild(quantityInput);
    row.appendChild(quantityCell);

    // Materials cell
    const materialsCell = document.createElement("td");
    row.appendChild(materialsCell);

    // Build Time cell
    const buildTimeCell = document.createElement("td");
    row.appendChild(buildTimeCell);

    // Steps cell
    const stepsCell = document.createElement("td");
    row.appendChild(stepsCell);

    // Cost cell
    const costCell = document.createElement("td");
    row.appendChild(costCell);

    // Sell Price (+20%) cell
    const sellPrice20Cell = document.createElement("td");
    row.appendChild(sellPrice20Cell);

    // Sell Price (+100%) cell
    const sellPrice100Cell = document.createElement("td");
    row.appendChild(sellPrice100Cell);

    // Profit (+20%) cell
    const profit20Cell = document.createElement("td");
    row.appendChild(profit20Cell);

    // Profit (+100%) cell
    const profit100Cell = document.createElement("td");
    row.appendChild(profit100Cell);

    // Actual Sell Price cell
    const actualSellPriceCell = document.createElement("td");
    row.appendChild(actualSellPriceCell);

    // Comparison ($) cell
    const comparisonDollarCell = document.createElement("td");
    row.appendChild(comparisonDollarCell);

    // Comparison (%) cell
    const comparisonPercentCell = document.createElement("td");
    row.appendChild(comparisonPercentCell);

    const updateRow = () => {
      const quantity = parseInt(quantityInput.value, 10) || 1;
      const {
        totalCost,
        costPerUnit,
        sellingPrice20PerUnit,
        sellingPrice50PerUnit,
        profit20PerUnit,
        profit50PerUnit,
        actualSellingPrice,
        comparisonDollar,
        comparisonPercent,
      } = calculateCosts(item, quantity);

      const totalBuildTime = calculateTotalBuildTime(item, quantity);
      buildTimeCell.textContent = totalBuildTime;

      // Update cells
      buildTimeCell.textContent = `${totalBuildTime}`;
      costCell.textContent = `$${costPerUnit.toFixed(2)}`;
      sellPrice20Cell.textContent = `$${sellingPrice20PerUnit.toFixed(2)}`;
      sellPrice100Cell.textContent = `$${sellingPrice50PerUnit.toFixed(2)}`;
      profit20Cell.textContent = `$${profit20PerUnit.toFixed(2)}`;
      profit100Cell.textContent = `$${profit50PerUnit.toFixed(2)}`;
      actualSellPriceCell.textContent = `$${actualSellingPrice.toFixed(2)}`;
      comparisonDollarCell.textContent = `$${comparisonDollar.toFixed(2)}`;
      comparisonPercentCell.textContent = `${comparisonPercent.toFixed(2)}%`;
      comparisonPercentCell.className = formatComparisonPercent(comparisonPercent);

      // Update materials and steps
      materialsCell.textContent = Object.entries(item.materials)
        .map(([mat, amount]) => `${amount} x ${mat}`)
        .join(", ");

      stepsCell.innerHTML = "";
      const dummyContainer = document.createElement("div");
      displaySteps(dummyContainer, item, quantity);
      stepsCell.appendChild(dummyContainer);
    };

    quantityInput.addEventListener("input", updateRow);
    updateRow(); // Initiale Berechnung mit Standardwert 1

    itemList.appendChild(row);
  });
}

// Aufruf zum Aktualisieren der Tabelle
updateTable();
