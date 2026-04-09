// 🎵 SOUNDS
const clickSound = new Audio("justsomesounds-click-sound-432501.mp3");
const rollSound = new Audio("u_a4gfvwagf1-tick-sound-effect-1-336779.mp3");
const revealSound = new Audio("minecraft-xp.mp3");
const rareSound = new Audio("mrstokes302-success-videogame-sfx-423626.mp3")

// 🧬 MICROBE DATA
const microbes = {
  Common: ["E. coli", "Streptococcus", "Lactobacillus"],
  Uncommon: ["Salmonella", "Clostridium"],
  Rare: ["Plasmodium", "Toxoplasma"],
  Epic: ["Deinococcus radiodurans"],
  Legendary: ["Tardigrade 🐻‍❄️"]
};

// 🖼️ IMAGE MAP
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

// 🎁 PACK SYSTEM (WITH THEMES)
const packs = {
  "MicroLoot": {
    cost: 20,
    color: "#27ae60",
    glow: "0 0 20px #27ae60",
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
    color: "#2980b9",
    glow: "0 0 20px #2980b9",
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
    color: "#8e44ad",
    glow: "0 0 25px #8e44ad",
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

// 💾 LOAD DATA
let inventory = JSON.parse(localStorage.getItem("inventory")) || {};
let coins = parseInt(localStorage.getItem("coins")) || 100;

// 💰 UPDATE COINS
function updateCoinsDisplay() {
  document.getElementById("coins").innerText = `Coins: ${coins}`;
}

// 🎁 UPDATE PACK INFO
function updatePackInfo() {
  const pack = packs[currentPack];

  document.getElementById("pack-info").innerHTML = `
    <strong>${currentPack}</strong><br>
    Cost: ${pack.cost} coins
  `;
}

// 🎨 APPLY PACK THEME
function applyPackTheme() {
  const pack = packs[currentPack];
  const box = document.querySelector(".pack-box");

  box.style.border = `2px solid ${pack.color}`;
  box.style.boxShadow = pack.glow;

  const button = box.querySelector("button");
  button.style.background = pack.color;

  document.body.style.background = `radial-gradient(circle, ${pack.color}33, #0f2027)`;
}

// 🎯 SELECT PACK
function selectPack(packName) {
  currentPack = packName;
  updatePackInfo();
  applyPackTheme();
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

// 🎲 OPEN PACK
function openPack() {
  const resultDiv = document.getElementById("result");
  const button = document.querySelector(".pack-box button");

  const pack = packs[currentPack];
  const packCost = pack.cost;

  if (coins < packCost) {
    alert("Not enough coins!");
    return;
  }

  coins -= packCost;
  localStorage.setItem("coins", coins);
  updateCoinsDisplay();

  clickSound.play();
  button.disabled = true;

  const rarities = ["Common", "Uncommon", "Rare", "Epic", "Legendary"];
  let spinCount = 0;

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

      // 🎯 PACK RNG
      let roll = Math.random();
      let cumulative = 0;
      let rarity;

      for (let r in pack.odds) {
        cumulative += pack.odds[r];
        if (roll <= cumulative) {
          rarity = r;
          break;
        }
      }

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

      // 🔊 SOUND + EFFECTS
      if (rarity === "Legendary") {
        rareSound.volume = 0.8;
        rareSound.play();

        document.body.classList.add("shake");
        setTimeout(() => document.body.classList.remove("shake"), 400);

        document.body.classList.add("flash");
        setTimeout(() => document.body.classList.remove("flash"), 300);

      } else if (rarity === "Epic") {
        rareSound.volume = 0.5;
        rareSound.play();
      } else {
        revealSound.play();
      }

      // 🎉 RESULT DISPLAY
      let extraClass = "";
      if (rarity === "Legendary") {
        extraClass = "legendary-glow legendary-reveal";
      }

      resultDiv.innerHTML = `
        <div class="reveal ${rarity} ${extraClass}" style="box-shadow:${pack.glow}; border:2px solid ${pack.color}">
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

// 🚀 INIT
updateCoinsDisplay();
updatePackInfo();
applyPackTheme();
displayInventory();

// 🔓 SOUND FIX
document.body.addEventListener("click", () => {
  clickSound.play().catch(() => {});
}, { once: true });
