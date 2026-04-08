const clickSound = new Audio("justsomesounds-click-sound-432501.mp3");
const rollSound = new Audio("u_a4gfvwagf1-tick-sound-effect-1-336779.mp3");
const revealSound = new Audio("minecraft-xp.mp3");
const rareSound = new Audio("mrstokes302-success-videogame-sfx-423626.mp3");

const microbes = {
  Common: ["E. coli", "Streptococcus", "Lactobacillus"],
  Uncommon: ["Salmonella", "Clostridium"],
  Rare: ["Plasmodium", "Toxoplasma"],
  Epic: ["Deinococcus radiodurans"],
  Legendary: ["Tardigrade 🐻‍❄️"]
};

let coins = parseInt(localStorage.getItem("coins")) || 100;

// Load inventory or create new one
let inventory = JSON.parse(localStorage.getItem("inventory")) || {};

function openPack() {
  const resultDiv = document.getElementById("result");
  const button = document.querySelector("button");

  clickSound.play(); // click sound
  button.disabled = true;

  const rarities = ["Common", "Uncommon", "Rare", "Epic", "Legendary"];
  let spinCount = 0;

  rollSound.loop = true;
  rollSound.currentTime = 0;
  rollSound.play();

  let animation = setInterval(() => {
    let randomRarity = rarities[Math.floor(Math.random() * rarities.length)];
    resultDiv.innerHTML = `Rolling... <span class="${randomRarity}">${randomRarity}</span>`;
    spinCount++;

    if (spinCount > 15) {
      clearInterval(animation);
      rollSound.pause();

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

      // Save inventory
      if (!inventory[reward]) {
        inventory[reward] = { count: 1, rarity: rarity };
      } else {
        inventory[reward].count++;
      }

      localStorage.setItem("inventory", JSON.stringify(inventory));

      // PLAY SOUND BASED ON RARITY
      if (rarity === "Epic" || rarity === "Legendary") {
        rareSound.play();
      } else {
        revealSound.play();
      }

      // Show result
      resultDiv.innerHTML = `
        <div class="reveal ${rarity}">
          ${rarity}!<br>${reward}
        </div>
      `;

// Reward coins based on rarity
let rewardCoins = 0;

if (rarity === "Common") rewardCoins = 5;
else if (rarity === "Uncommon") rewardCoins = 10;
else if (rarity === "Rare") rewardCoins = 20;
else if (rarity === "Epic") rewardCoins = 50;
else if (rarity === "Legendary") rewardCoins = 100;

coins += rewardCoins;
localStorage.setItem("coins", coins);
updateCoinsDisplay();
      
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

  function updateCoinsDisplay() {
  document.getElementById("coins").innerText = `Coins: ${coins}`;

  const packCost = 20;

if (coins < packCost) {
  alert("Not enough coins!");
  return;
}

coins -= packCost;
localStorage.setItem("coins", coins);
updateCoinsDisplay();
    
  }
}

// Load inventory on page start
displayInventory();
updateCoinsDisplay();
