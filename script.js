// Definition der herstellbaren Gegenstände (items)
const items = [
  { name: "Harz", yield: 10, materials: { Baumstamm: 1 } },
  { name: "Fasern", yield: 10, materials: { Baumstamm: 1 } },
  { name: "Zellstoff", yield: 10, materials: { Baumstamm: 1 } },
  { name: "Sand", yield: 2, materials: { Stein: 1 } },
  { name: "Papier", yield: 5, materials: { Zellstoff: 5 } },
  { name: "Poster", yield: 5, materials: { Papier: 5 } },
  { name: "Schleifpapier", yield: 5, materials: { Sand: 5, Harz: 5 } },
  { name: "Seil", yield: 1, materials: { Zellstoff: 1, Baumwolle: 3 } },
  { name: "Hartholz", yield: 5, materials: { Baumstamm: 1 } },
  { name: "Weichholz", yield: 5, materials: { Baumstamm: 2 } },
  { name: "Hartholzbretter", yield: 5, materials: { Hartholz: 2 } },
  { name: "Weichholzbretter", yield: 5, materials: { Weichholz: 2 } },
  { name: "Verpackung", yield: 5, materials: { Papier: 10 } },
  { name: "Spindel", yield: 1, materials: { Weichholz: 1 } },
  { name: "Pfeifenrohling", yield: 1, materials: { Schleifpapier: 10, Weichholz: 10 } },
  { name: "Whiskeyfass", yield: 10, materials: { Hartholzbretter: 20, Fassbänder: 20 } },
  { name: "Goldwaschtisch", yield: 1, materials: { Weichholz: 5, Hartholz: 5, Nägel: 10 } },
  { name: "Werkzeugstiel", yield: 2, materials: { Schleifpapier: 2, Hartholz: 2 } },
  { name: "Repetierschaft", yield: 1, materials: { Harz: 2, Hartholz: 4, Schleifpapier: 1, Bienenwachs: 1 } },
  { name: "RevolverPistolengriff", yield: 1, materials: { Harz: 2, Hartholz: 4, Schleifpapier: 1, Bienenwachs: 1 } },
  { name: "Gewehrschaft", yield: 1, materials: { Harz: 2, Hartholz: 4, Schleifpapier: 1, Bienenwachs: 1 } },
  { name: "Schrotflintenschaft", yield: 1, materials: { Harz: 2, Hartholz: 4, Schleifpapier: 1, Bienenwachs: 1 } },
];

// Materialpreise definieren (Beispiel)
const prices = {
  Baumstamm: 0.5,
  //Harz: 0.3,
  //Weichholz: 0.7,
  //Schleifpapier: 0.5,
  Fassbänder: 2.2,
  Nägel: 0.38,
  Stein: 0.1,
  // Weitere Materialien mit Preisen
};

// Tatsächliche Verkaufspreise
const actualSellingPrices = {
  Harz: 0.3,
  Zellstoff: 0.3,
  Hartholz: 0.7,
  Weichholz: 0.7,
  Hartholzbretter: 0.6,
  Weichholzbretter: 0.6,
  Fasern: 0.3,
  Whiskeyfass: 8,
  Seil: 2,
  Werkzeugstiel: 2.5,
  Spindel: 7,
  Goldwaschtisch: 25,
  Verpackung: 2,
  Schleifpapier: 0.5,
  Papier: 0.7,
  Pfeifenrohling: 6,
  Poster: 4,
  Repetierschaft: 14,
  RevolverPistolengriff: 14,
  Gewehrschaft: 14,
  Schrotflintenschaft: 14,

  // Weitere Verkaufspreise...
};

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

// Berechnung der Kosten und Verkaufspreise
function calculateCosts(item, quantity) {
  const dummyContainer = document.createElement("div");
  const { steps, totalCost } = displaySteps(dummyContainer, item, quantity); // Berechne die gesamten Herstellungskosten

  // Herstellungskosten pro Stück berechnen
  const costPerUnit = totalCost / item.yield;

  // Verkaufspreise und Gewinne pro Stück berechnen
  const sellingPrice20PerUnit = costPerUnit * 1.2;
  const sellingPrice100PerUnit = costPerUnit * 2.0;
  const profit20PerUnit = sellingPrice20PerUnit - costPerUnit;
  const profit100PerUnit = sellingPrice100PerUnit - costPerUnit;

  // Tatsächlicher Verkaufspreis (pro Stück)
  const actualSellingPrice = actualSellingPrices[item.name] || 0;

  // Vergleich zwischen dem berechneten Verkaufspreis (+20%) und dem tatsächlichen Verkaufspreis
  const comparisonDollar = actualSellingPrice - sellingPrice20PerUnit;
  const comparisonPercent = ((actualSellingPrice - sellingPrice20PerUnit) / sellingPrice20PerUnit) * 100;

  return {
    totalCost,
    costPerUnit,
    sellingPrice20PerUnit,
    sellingPrice100PerUnit,
    profit20PerUnit,
    profit100PerUnit,
    actualSellingPrice,
    comparisonDollar,
    comparisonPercent,
  };
}
// Schrittanzeige und Kostenberechnung
function displaySteps(container, item, quantity) {
  const steps = getSteps(item, quantity);
  let totalCost = 0; // Gesamtkosten für die Herstellung
  container.innerHTML = ""; // Vorherigen Inhalt löschen

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
    container.appendChild(stepText); // Schritt in das übergebene Container-Element einfügen
  });

  return totalCost; // Gesamtkosten zurückgeben
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

// Berechnung der Kosten und Verkaufspreise
function calculateCosts(item, quantity) {
  const dummyContainer = document.createElement("div");
  const totalCost = displaySteps(dummyContainer, item, quantity); // Berechne die gesamten Herstellungskosten

  // Herstellungskosten pro Stück berechnen
  const costPerUnit = totalCost / item.yield;

  // Verkaufspreise und Gewinne pro Stück berechnen
  const sellingPrice20PerUnit = costPerUnit * 1.2;
  const sellingPrice100PerUnit = costPerUnit * 2.0;
  const profit20PerUnit = sellingPrice20PerUnit - costPerUnit;
  const profit100PerUnit = sellingPrice100PerUnit - costPerUnit;

  // Tatsächlicher Verkaufspreis (pro Stück)
  const actualSellingPrice = actualSellingPrices[item.name] || 0;

  // Vergleich zwischen dem berechneten Verkaufspreis (+20%) und dem tatsächlichen Verkaufspreis
  const comparisonDollar = actualSellingPrice - sellingPrice20PerUnit;
  const comparisonPercent = ((actualSellingPrice - sellingPrice20PerUnit) / sellingPrice20PerUnit) * 100;

  return {
    totalCost,
    costPerUnit,
    sellingPrice20PerUnit,
    sellingPrice100PerUnit,
    profit20PerUnit,
    profit100PerUnit,
    actualSellingPrice,
    comparisonDollar,
    comparisonPercent,
  };
}

// Aktualisieren der Tabelle
function updateTable() {
  const itemList = document.getElementById("item-list");
  itemList.innerHTML = ""; // Tabelle zurücksetzen

  items.forEach((item) => {
    const row = document.createElement("tr");

    const nameCell = document.createElement("td");
    nameCell.textContent = item.name;
    row.appendChild(nameCell);

    const yieldCell = document.createElement("td");
    yieldCell.textContent = item.yield;
    row.appendChild(yieldCell);

    const quantityCell = document.createElement("td");
    const quantityInput = document.createElement("input");
    quantityInput.type = "number";
    quantityInput.min = "1";
    quantityInput.value = "1";
    quantityCell.appendChild(quantityInput);
    row.appendChild(quantityCell);

    const materialsCell = document.createElement("td");
    row.appendChild(materialsCell);

    const stepsCell = document.createElement("td");
    row.appendChild(stepsCell);

    const costCell = document.createElement("td");
    row.appendChild(costCell);

    const sellPrice20Cell = document.createElement("td");
    row.appendChild(sellPrice20Cell);

    const sellPrice100Cell = document.createElement("td");
    row.appendChild(sellPrice100Cell);

    const profit20Cell = document.createElement("td");
    row.appendChild(profit20Cell);

    const profit100Cell = document.createElement("td");
    row.appendChild(profit100Cell);

    const actualSellPriceCell = document.createElement("td");
    row.appendChild(actualSellPriceCell);

    const comparisonDollarCell = document.createElement("td");
    row.appendChild(comparisonDollarCell);

    const comparisonPercentCell = document.createElement("td");
    row.appendChild(comparisonPercentCell);

    // Berechne die Herstellungskosten und Verkaufspreise pro Stück
    const updateRow = () => {
      const quantity = parseInt(quantityInput.value, 10) || 1;
      const {
        totalCost,
        costPerUnit,
        sellingPrice20PerUnit,
        sellingPrice100PerUnit,
        profit20PerUnit,
        profit100PerUnit,
        actualSellingPrice,
        comparisonDollar,
        comparisonPercent,
      } = calculateCosts(item, quantity);

      // Update der Tabellenzellen mit Werten pro Stück
      costCell.textContent = `$${costPerUnit.toFixed(2)}`;
      sellPrice20Cell.textContent = `$${sellingPrice20PerUnit.toFixed(2)}`;
      sellPrice100Cell.textContent = `$${sellingPrice100PerUnit.toFixed(2)}`;
      profit20Cell.textContent = `$${profit20PerUnit.toFixed(2)}`;
      profit100Cell.textContent = `$${profit100PerUnit.toFixed(2)}`;
      actualSellPriceCell.textContent = `$${actualSellingPrice.toFixed(2)}`;
      comparisonDollarCell.textContent = `$${comparisonDollar.toFixed(2)}`;
      comparisonPercentCell.textContent = `${comparisonPercent.toFixed(2)}%`;

      // Anzeige der Materialien und Zwischenschritte
      materialsCell.innerHTML = ""; // Vorherige Materialien zurücksetzen
      stepsCell.innerHTML = ""; // Vorherige Schritte zurücksetzen

      // Fülle die Materialien und Schritte neu
      const materials = item.materials;
      materialsCell.textContent = Object.keys(materials)
        .map((mat) => `${materials[mat]} x ${mat}`)
        .join(", ");

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
