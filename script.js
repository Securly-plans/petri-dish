// 🎵 SOUNDS
const clickSound = new Audio("justsomesounds-click-sound-432501.mp3");
const rollSound = new Audio("u_a4gfvwagf1-tick-sound-effect-1-336779.mp3");
const revealSound = new Audio("minecraft-xp.mp3");
const rareSound = new Audio("mrstokes302-success-videogame-sfx-423626.mp3");


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

// 🎁 PACK SYSTEM
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

// 📖 MICROBE INFO
const microbeInfo = {
  "E. coli": "A common bacterium found in the intestines.",
  "Streptococcus": "Bacteria that can cause infections like strep throat.",
  "Lactobacillus": "Helpful bacteria used in yogurt and digestion.",
  "Salmonella": "A bacteria that can cause food poisoning.",
  "Clostridium": "A group of bacteria, some cause serious illness.",
  "Plasmodium": "A parasite that causes malaria.",
  "Toxoplasma": "A parasite often carried by cats.",
  "Deinococcus radiodurans": "Extremely resistant to radiation.",
  "Tardigrade 🐻‍❄️": "A nearly indestructible microscopic organism."
};


let currentPack = "MicroLoot";

// 💾 LOAD DATA
let inventory = JSON.parse(localStorage.getItem("inventory")) || {};
let coins = parseInt(localStorage.getItem("coins")) || 100;

// 💰 COINS
function updateCoinsDisplay() {
  document.getElementById("coins").innerText = `Coins: ${coins}`;
}

// 📊 COLLECTION PROGRESS
function updateCollectionProgress() {
  const total = Object.values(microbes).flat().length;
  const owned = Object.keys(inventory).length;

  document.getElementById("collection-progress").innerText =
    `Collection: ${owned} / ${total}`;
}

// 🎁 PACK INFO
function updatePackInfo() {
  const pack = packs[currentPack];
  document.getElementById("pack-info").innerHTML = `
    <strong>${currentPack}</strong><br>
    Cost: ${pack.cost} coins
  `;
}

// 🎨 PACK THEME
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

// 📦 INVENTORY (CLICKABLE)
function displayInventory() {
  let container = document.getElementById("inventory");

  container.innerHTML = "<h2>Your Collection</h2><div class='inventory-grid'></div>";
  let grid = container.querySelector(".inventory-grid");

  for (let microbe in inventory) {
    let item = inventory[microbe];

    let div = document.createElement("div");
    div.className = `card ${item.rarity}`;
    div.onclick = () => showInfo(microbe);

    div.innerHTML = `
      <img src="${microbeImages[microbe]}" class="microbe-img"><br>
      <strong>${microbe}</strong><br>
      x${item.count}
    `;

    grid.appendChild(div);
  }
}

// 📖 SHOW INFO PANEL
function showInfo(name) {
  const info = inventory[name];

  document.getElementById("info-name").innerText = name;
  document.getElementById("info-rarity").innerText = info.rarity;
  document.getElementById("info-desc").innerText =
    microbeInfo[name] || "No data yet.";
  document.getElementById("info-img").src = microbeImages[name];

  document.getElementById("info-panel").classList.add("active");
}

function closeInfo() {
  document.getElementById("info-panel").classList.remove("active");
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
  rollSound.play();

  let animation = setInterval(() => {
    let randomRarity = rarities[Math.floor(Math.random() * rarities.length)];
    resultDiv.innerHTML = `Rolling... <span class="${randomRarity}">${randomRarity}</span>`;
    spinCount++;

    if (spinCount > 15) {
      clearInterval(animation);
      rollSound.pause();

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

      // NEW detection
      let isNew = false;
      if (!inventory[reward]) {
        inventory[reward] = { count: 1, rarity: rarity };
        isNew = true;
      } else {
        inventory[reward].count++;
      }

      localStorage.setItem("inventory", JSON.stringify(inventory));

      // 💰 reward coins
      let rewardCoins = {
        Common: 5,
        Uncommon: 10,
        Rare: 20,
        Epic: 50,
        Legendary: 100
      }[rarity];

      coins += rewardCoins;
      localStorage.setItem("coins", coins);
      updateCoinsDisplay();

      // 🔊 effects
      if (rarity === "Legendary") {
        rareSound.play();
        document.body.classList.add("shake");
        setTimeout(() => document.body.classList.remove("shake"), 400);
      } else {
        revealSound.play();
      }

      let extraClass = rarity === "Legendary"
        ? "legendary-glow legendary-reveal"
        : "";

      let newTag = isNew ? "<div class='new-tag'>NEW!</div>" : "";

      resultDiv.innerHTML = `
        <div class="reveal ${rarity} ${extraClass}" style="box-shadow:${pack.glow}; border:2px solid ${pack.color}">
          ${newTag}
          <img src="${microbeImages[reward]}" class="reveal-img"><br>
          <div>${rarity}</div>
          <strong>${reward}</strong>
        </div>
      `;

      button.disabled = false;
      displayInventory();
      updateCollectionProgress();
    }
  }, 100);
}

// 🚀 INIT
updateCoinsDisplay();
updatePackInfo();
applyPackTheme();
displayInventory();
updateCollectionProgress();

// 🔓 SOUND FIX
document.body.addEventListener("click", () => {
  clickSound.play().catch(() => {});
}, { once: true });
