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
  const resultDiv = document.getElementById("result");
  const button = document.querySelector("button");

  button.disabled = true;

  const rarities = ["Common", "Uncommon", "Rare", "Epic", "Legendary"];
  let spinCount = 0;

  let animation = setInterval(() => {
    let randomRarity = rarities[Math.floor(Math.random() * rarities.length)];
    resultDiv.innerHTML = `Rolling... <span class="${randomRarity}">${randomRarity}</span>`;
    spinCount++;

    if (spinCount > 15) { // how long it spins
      clearInterval(animation);

      // FINAL RNG
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

      localStorage.setItem("inventory", JSON.stringify(inventory));

      // FINAL DISPLAY
      resultDiv.innerHTML = `
        <div class="reveal ${rarity}">
          ${rarity}!<br>${reward}
        </div>
      `;

      if (rarity === "Epic" || rarity === "Legendary") {
  document.body.classList.add("flash");
  setTimeout(() => document.body.classList.remove("flash"), 300);
} 
      button.disabled = false;
      displayInventory();
    }
  }, 100);
}

function displayInventory() {
  let container = document.getElementById("inventory");

  container.innerHTML = "<h2>Your Collection</h2><div class='inventory-grid'></div>";
  let grid = container.querySelector(".inventory-grid");

  for (let microbe in inventory) {
    let item = inventory[microbe];

    let div = document.createElement("div");
    div.className = `card ${item.rarity}`;
    div.innerHTML = `
      <strong>${microbe}</strong><br>
      ${item.rarity}<br>
      x${item.count}
    `;

    grid.appendChild(div);
  }
}

// Load inventory on page start
displayInventory();
