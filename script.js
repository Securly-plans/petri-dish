const microbeImages = {
  "E. coli": "images/E. coli.svg",
  "Streptococcus": "images/Streptococcus.svg",
  "Lactobacillus": "images/Lactobacillus.svg",
  "Salmonella": "images/Salmonella.svg",
  "Clostridium": "images/Clostridium.svg",
  "Plasmodium": "images/Plasmodium.svg",
  "Toxoplasma": "images/Toxoplasma.svg",
  "Deinococcus radiodurans": "images/Deinococcus radiodurans.svg",
  "Tardigrade 🐻‍❄️": "images/Tardigrade.svg"
};

const packs = {
  "MicroLoot": {
    cost: 20,
    odds: {
      Common: 0.65,
      Uncommon: 0.25,
      Rare: 0.08,
      Epic: 0.019,
      Legendary: 0.001
    }
  },

  "BioBox": {
    cost: 50,
    odds: {
      Common: 0.40,
      Uncommon: 0.35,
      Rare: 0.18,
      Epic: 0.06,
      Legendary: 0.01
    }
  },

  "CellCraze": {
    cost: 100,
    odds: {
      Common: 0.20,
      Uncommon: 0.30,
      Rare: 0.30,
      Epic: 0.15,
      Legendary: 0.05
    }
  }
};

let currentPack = "MicroLoot";

// 🎵 SOUNDS
const clickSound = new Audio("justsomesounds-click-sound-432501.mp3");
const rollSound = new Audio("u_a4gfvwagf1-tick-sound-effect-1-336779.mp3");
const revealSound = new Audio("minecraft-xp.mp3");
const rareSound = new Audio("mrstokes302-success-videogame-sfx-423626.mp3");

// 🦠 MICROBE DATA
const microbes = {
  Common: ["E. coli", "Streptococcus", "Lactobacillus"],
  Uncommon: ["Salmonella", "Clostridium"],
  Rare: ["Plasmodium", "Toxoplasma"],
  Epic: ["Deinococcus radiodurans"],
  Legendary: ["Tardigrade 🐻‍❄️"]
};

// 💾 LOAD DATA
let inventory = JSON.parse(localStorage.getItem("inventory")) || {};
let coins = parseInt(localStorage.getItem("coins")) || 100;

// 💰 UPDATE COINS DISPLAY
function updateCoinsDisplay() {
  document.getElementById("coins").innerText = `Coins: ${coins}`;
}

// 📦 DISPLAY INVENTORY
function displayInventory() {
  let container = document.getElementById("inventory");

  container.innerHTML = "<h2>Your Collection</h2><div class='inventory-grid'></div>";
  let grid = container.querySelector(".inventory-grid");

  for (let microbe in inventory) {
    let item = inventory[microbe];

    let div = document.createElement("div");
    div.className = `card ${item.rarity}`;

    div.innerHTML = `
      <img src="${microbeImages[microbe]}" class="microbe-img"><br>
      <strong>${microbe}</strong><br>
      x${item.count}
    `;

    grid.appendChild(div);
  }
}

// 🎲 OPEN PACK FUNCTION
function openPack() {
  const resultDiv = document.getElementById("result");
  const button = document.querySelector("button");

  const packCost = 20;

  // ❌ Not enough coins
  if (coins < packCost) {
    alert("Not enough coins!");
    return;
  }

  // 💸 Spend coins
  coins -= packCost;
  localStorage.setItem("coins", coins);
  updateCoinsDisplay();

  clickSound.play();
  button.disabled = true;

  const rarities = ["Common", "Uncommon", "Rare", "Epic", "Legendary"];
  let spinCount = 0;

  // 🔊 Start rolling sound
  rollSound.loop = true;
  rollSound.currentTime = 0;
  rollSound.volume = 0.3;
  rollSound.play();

  let animation = setInterval(() => {
    let randomRarity = rarities[Math.floor(Math.random() * rarities.length)];
    resultDiv.innerHTML = `Rolling... <span class="${randomRarity}">${randomRarity}</span>`;
    spinCount++;

    if (spinCount > 15) {
      clearInterval(animation);
      rollSound.pause();

      // 🎯 FINAL RNG
      let roll = Math.random();
      let rarity;

      if (roll < 0.60) rarity = "Common";
      else if (roll < 0.85) rarity = "Uncommon";
      else if (roll < 0.95) rarity = "Rare";
      else if (roll < 0.99) rarity = "Epic";
      else rarity = "Legendary";

      let pool = microbes[rarity];
      let reward = pool[Math.floor(Math.random() * pool.length)];

      // 📦 SAVE INVENTORY
      if (!inventory[reward]) {
        inventory[reward] = { count: 1, rarity: rarity };
      } else {
        inventory[reward].count++;
      }

      localStorage.setItem("inventory", JSON.stringify(inventory));

      // 💰 REWARD COINS
      let rewardCoins = 0;

      if (rarity === "Common") rewardCoins = 5;
      else if (rarity === "Uncommon") rewardCoins = 10;
      else if (rarity === "Rare") rewardCoins = 20;
      else if (rarity === "Epic") rewardCoins = 50;
      else if (rarity === "Legendary") rewardCoins = 100;

      coins += rewardCoins;
      localStorage.setItem("coins", coins);
      updateCoinsDisplay();

      // 🔊 PLAY SOUND
      if (rarity === "Epic" || rarity === "Legendary") {
        rareSound.volume = 0.6;
        rareSound.play();

        // ⚡ screen flash
        document.body.classList.add("flash");
        setTimeout(() => document.body.classList.remove("flash"), 300);
      } else {
        revealSound.play();
      }

      // 🎉 SHOW RESULT
     resultDiv.innerHTML = `
  <div class="reveal ${rarity}">
    <img src="${microbeImages[reward]}" class="reveal-img"><br>
    <div>${rarity}</div>
    <strong>${reward}</strong>
  </div>
`;

      button.disabled = false;
      displayInventory();
    }
  }, 100);
}

// 🚀 INITIAL LOAD
updateCoinsDisplay();
displayInventory();

// 🔓 Fix for browser sound restrictions
document.body.addEventListener("click", () => {
  clickSound.play().catch(() => {});
}, { once: true });
