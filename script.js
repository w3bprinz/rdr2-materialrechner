const items = [
  { name: "Harz", yield: 10, materials: { Baumstamm: 1 } },
  { name: "Verpackung", yield: 5, materials: { Papier: 10 } },
  { name: "Pfeifenrohling", yield: 1, materials: { Schleifpapier: 1, Weichholz: 1 } },
  { name: "Zellstoff", yield: 10, materials: { Baumstamm: 1 } },
  { name: "Hartholz", yield: 5, materials: { Baumstamm: 1 } },
  { name: "Weichholz", yield: 5, materials: { Baumstamm: 1 } },
  { name: "Hartholzbretter", yield: 5, materials: { Hartholz: 2 } },
  { name: "Weichholzbretter", yield: 5, materials: { Weichholz: 2 } },
  { name: "Fasern", yield: 10, materials: { Baumstamm: 1 } },
  { name: "Whiskeyfass", yield: 10, materials: { Hartholzbretter: 20, Fassbänder: 20 } },
  { name: "Seil", yield: 1, materials: { Zellstoff: 1, Baumwolle: 3 } },
  { name: "Werkzeugstiel", yield: 2, materials: { Schleifpapier: 2, Hartholz: 2 } },
  { name: "Spindel", yield: 1, materials: { Weichholz: 1 } },
  { name: "Poster", yield: 5, materials: { Papier: 5 } },
  { name: "Goldwaschtisch", yield: 1, materials: { Weichholz: 5, Hartholz: 5, Nägel: 10 } },
  { name: "Holzplanke", yield: 4, materials: { Baumstamm: 1 } },
  { name: "Schleifpapier", yield: 5, materials: { Sand: 5, Harz: 5 } },
  { name: "Papier", yield: 5, materials: { Zellstoff: 5 } },
  { name: "Repetier-Schaft", yield: 1, materials: { Harz: 2, Hartholz: 4, Schleifpapier: 1, Bienenwachs: 1 } },
  { name: "Revolver/Pistolengriff", yield: 1, materials: { Harz: 2, Hartholz: 4, Schleifpapier: 1, Bienenwachs: 1 } },
  { name: "Gewehr-Schaft", yield: 1, materials: { Harz: 2, Hartholz: 4, Schleifpapier: 1, Bienenwachs: 1 } },
  { name: "Schrotflintenschaft", yield: 1, materials: { Harz: 2, Hartholz: 4, Schleifpapier: 1, Bienenwachs: 1 } },
];

const prices = {
  Baumwolle: 0.1,
  Hickorynuss: 0.1,
  Walnuss: 0.1,
  Baumstamm: 0.5,
  Fasern: 0.1,
  Nägel: 0.38,
  Fassbänder: 2.2,
  Bienenwachs: 1.5,
  Stein: 0.1,
  Sand: 0.1,
};

const itemList = document.getElementById("item-list");

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
  quantityInput.min = "0";
  quantityInput.value = "0";
  quantityInput.addEventListener("input", () => calculateMaterials(item, quantityInput.value));
  quantityCell.appendChild(quantityInput);
  row.appendChild(quantityCell);

  const materialsCell = document.createElement("td");
  materialsCell.id = `materials-${item.name}`;
  row.appendChild(materialsCell);

  const stepsCell = document.createElement("td");
  stepsCell.id = `steps-${item.name}`;
  stepsCell.classList.add("steps-cell");
  row.appendChild(stepsCell);

  const costCell = document.createElement("td");
  costCell.id = `cost-${item.name}`;
  row.appendChild(costCell);

  itemList.appendChild(row);
});

function calculateMaterials(item, quantity) {
  const materialsCell = document.getElementById(`materials-${item.name}`);
  const stepsCell = document.getElementById(`steps-${item.name}`);
  const costCell = document.getElementById(`cost-${item.name}`);
  materialsCell.innerHTML = "";
  stepsCell.innerHTML = "";
  costCell.innerHTML = "";
  const materials = getMaterials(item, quantity);
  displayMaterials(materialsCell, materials);
  displaySteps(stepsCell, item, quantity);
  const cost = calculateCost(materials);
  costCell.textContent = `$${cost.toFixed(2)}`;
}

function getMaterials(item, quantity) {
  const materials = {};
  const batches = Math.ceil(quantity / item.yield);
  for (const [material, amount] of Object.entries(item.materials)) {
    const totalAmount = amount * batches;
    if (items.some((i) => i.name === material)) {
      const subMaterials = getMaterials(
        items.find((i) => i.name === material),
        totalAmount
      );
      materials[material] = totalAmount;
      for (const [subMaterial, subAmount] of Object.entries(subMaterials)) {
        materials[subMaterial] = (materials[subMaterial] || 0) + subAmount;
      }
    } else {
      materials[material] = (materials[material] || 0) + totalAmount;
    }
  }
  return materials;
}

function displayMaterials(container, materials) {
  for (const [material, amount] of Object.entries(materials)) {
    const materialText = document.createElement("div");
    materialText.textContent = `${material}: ${amount}`;
    container.appendChild(materialText);
  }
}

function displaySteps(container, item, quantity) {
  const steps = getSteps(item, quantity); // Schritte in der natürlichen Reihenfolge
  steps.forEach((step, index) => {
    const materials = step.materials.map((material) => `${material.amount} x ${material.name}`).join(" & ");
    const stepText = document.createElement("div");
    stepText.textContent = `Schritt ${index + 1}: ${materials} für ${step.yield * step.batches} x ${step.item}`;
    container.appendChild(stepText);
  });
}

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

function calculateCost(materials) {
  let totalCost = 0;
  for (const [material, amount] of Object.entries(materials)) {
    if (prices[material] !== undefined) {
      totalCost += prices[material] * amount;
    }
  }
  return totalCost;
}
