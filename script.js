// Materialpreise definieren (Beispiel)
const prices = {
  Baumstamm: 0.5,
  Harz: 1.0,
  Sand: 0.2,
  Weichholz: 0.75,
  Schleifpapier: 1.5,
  // Weitere Materialien mit Preisen
};

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

  return totalCost; // Gesamtkosten zurückgeben
}

function calculateCosts(item, quantity) {
  const totalCost = displaySteps(document.createElement("div"), item, quantity);

  // Berechnung der Verkaufspreise und Gewinne
  const sellingPrice20 = totalCost * 1.2;
  const sellingPrice100 = totalCost * 2.0;
  const profit20 = sellingPrice20 - totalCost;
  const profit100 = sellingPrice100 - totalCost;

  return {
    totalCost,
    sellingPrice20,
    sellingPrice100,
    profit20,
    profit100,
  };
}

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

    // Berechne die Herstellungskosten und Verkaufspreise
    quantityInput.addEventListener("input", () => {
      const quantity = parseInt(quantityInput.value, 10) || 1;
      const { totalCost, sellingPrice20, sellingPrice100, profit20, profit100 } = calculateCosts(item, quantity);

      costCell.textContent = `$${totalCost.toFixed(2)}`;
      sellPrice20Cell.textContent = `$${sellingPrice20.toFixed(2)}`;
      sellPrice100Cell.textContent = `$${sellingPrice100.toFixed(2)}`;
      profit20Cell.textContent = `$${profit20.toFixed(2)}`;
      profit100Cell.textContent = `$${profit100.toFixed(2)}`;
    });

    itemList.appendChild(row);
  });
}

// Aufruf zum Aktualisieren der Tabelle
updateTable();
