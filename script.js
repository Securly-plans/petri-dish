const microbes = {
  Common: ["E. coli", "Streptococcus", "Lactobacillus"],
  Uncommon: ["Salmonella", "Clostridium"],
  Rare: ["Plasmodium", "Toxoplasma"],
  Epic: ["Deinococcus radiodurans"],
  Legendary: ["Tardigrade 🐻‍❄️"]
};

// Load inventory or create new one
let inventory = JSON.parse(localStorage.getItem("inventory")) || {};

function openPack() {
  let roll = Math.random();
  let rarity;

  if (roll < 0.60) rarity = "Common";
  else if (roll < 0.85) rarity = "Uncommon";
  else if (roll < 0.95) rarity = "Rare";
  else if (roll < 0.99) rarity = "Epic";
  else rarity = "Legendary";

  let pool = microbes[rarity];
  let reward = pool[Math.floor(Math.random() * pool.length)];

  // Add to inventory
  if (!inventory[reward]) {
    inventory[reward] = { count: 1, rarity: rarity };
  } else {
    inventory[reward].count++;
  }

  // Save inventory
  localStorage.setItem("inventory", JSON.stringify(inventory));

  document.getElementById("result").innerHTML =
    `You got a <b>${rarity}</b>: ${reward}`;

  displayInventory();
}

function displayInventory() {
  let container = document.getElementById("inventory");
  container.innerHTML = "<h2>Your Collection</h2>";

  for (let microbe in inventory) {
    let item = inventory[microbe];
    container.innerHTML += `
      <div>
        ${microbe} (${item.rarity}) x${item.count}
      </div>
    `;
  }
}

// Load inventory on page start
displayInventory();
