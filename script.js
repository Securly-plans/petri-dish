const microbes = {
  Common: ["E. coli", "Streptococcus", "Lactobacillus"],
  Uncommon: ["Salmonella", "Clostridium"],
  Rare: ["Plasmodium", "Toxoplasma"],
  Epic: ["Deinococcus radiodurans"],
  Legendary: ["Tardigrade 🐻‍❄️"]
};

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

  document.getElementById("result").innerHTML =
    `You got a <b>${rarity}</b>: ${reward}`;
}
