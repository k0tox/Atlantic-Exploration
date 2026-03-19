// Fisch Bucket — Reworked full JS
// Movement, radar, hotbar toggles, inventory (E), aquarium (M), rods, lore, fishing minigame, persistence

// -------------------- DOM --------------------
const canvas = document.getElementById("gameCanvas");
const hudRegion = document.getElementById("hudRegion");
const hudGPS = document.getElementById("hudGPS");
const hudDepth = document.getElementById("hudDepth");
const hudCenterBanner = document.getElementById("hudCenterBanner");
const catchAlert = document.getElementById("catchAlert");

const hotbarSlots = Array.from(document.querySelectorAll(".hotbar-slot"));
const panelMap = {
  0: document.getElementById("panelRod"),
  1: document.getElementById("panelBag"),
  2: document.getElementById("panelBait"),
  3: document.getElementById("panelBestiary"),
  4: document.getElementById("panelQuests"),
  5: document.getElementById("panelTotems"),
  6: document.getElementById("panelPotions"),
  7: document.getElementById("panelRelic"),
  8: document.getElementById("panelUtility")
};

const panelInventory = document.getElementById("panelInventory");
const panelAquarium = document.getElementById("panelAquarium");

const radarArrow = document.getElementById("radarArrow");
const radarLabel = document.getElementById("radarLabel");

const rodListEl = document.getElementById("rodList");
const bagListEl = document.getElementById("bagList");
const baitListEl = document.getElementById("baitList");
const bestiaryFishEl = document.getElementById("bestiaryFish");
const bestiaryRodsEl = document.getElementById("bestiaryRods");
const bestiaryIslandsEl = document.getElementById("bestiaryIslands");
const bestiaryTabs = document.querySelectorAll("#bestiaryTabs .tab");

const fishingMinigame = document.getElementById("fishingMinigame");
const minigameZone = document.getElementById("minigameZone");
const minigameCursor = document.getElementById("minigameCursor");
const minigameReel = document.getElementById("minigameReel");
const minigameCancel = document.getElementById("minigameCancel");
const minigameHint = document.getElementById("minigameHint");

const aquariumSlotsEl = document.getElementById("aquariumSlots");
const aquariumInfoEl = document.getElementById("aquariumInfo");
const collectAquariumBtn = document.getElementById("collectAquarium");
const nextPayoutEl = document.getElementById("nextPayout");

// -------------------- Data --------------------
const RARITY = {
  COMMON: "common",
  UNCOMMON: "uncommon",
  RARE: "rare",
  EPIC: "epic",
  LEGENDARY: "legendary",
  MYTHIC: "mythic",
  EXOTIC: "exotic"
};

const rarityColors = {
  [RARITY.COMMON]: "#ffffff",
  [RARITY.UNCOMMON]: "#4caf50",
  [RARITY.RARE]: "#2196f3",
  [RARITY.EPIC]: "#9c27b0",
  [RARITY.LEGENDARY]: "#ff9800",
  [RARITY.MYTHIC]: "#f44336",
  [RARITY.EXOTIC]: "#ff00ff"
};

// Rods with stats and lore
const RODS = [
  { id:"driftwood", name:"Driftwood", rarity:RARITY.COMMON, variantBonus:0.0, color:0x8d6e63, power:1.0, control:0.9, lore:"A salvaged rod from old piers. It carries the scent of salt and stories." },
  { id:"harborOak", name:"Harbor Oak", rarity:RARITY.UNCOMMON, variantBonus:0.003, color:0x6d4c41, power:1.12, control:1.02, lore:"Carved from oak that watched over the harbor for generations." },
  { id:"prism", name:"Prism Rod", rarity:RARITY.EPIC, variantBonus:0.01, color:0x9c27b0, power:1.25, control:1.12, lore:"Shards of light trapped in the shaft; fish are drawn to its shimmer." },
  { id:"nullcurrent", name:"Nullcurrent", rarity:RARITY.EXOTIC, variantBonus:0.05, color:0x00e5ff, power:1.5, control:1.3, lore:"A rod rumored to bend currents; prized by those who chase the impossible." }
];

// Fish tables with lore
const FISH_TABLES = {
  harbor: [
    { name:"Harbor Minnow", rarity:RARITY.COMMON, depth:"surface", lore:"Tiny and quick, common near docks." },
    { name:"Dock Perch", rarity:RARITY.COMMON, depth:"surface", lore:"A sturdy perch that hides under pilings." },
    { name:"Pier Snapper", rarity:RARITY.RARE, depth:"mid", lore:"Snaps at bait with surprising force." },
    { name:"Tide Barracuda", rarity:RARITY.EPIC, depth:"mid", lore:"A sleek hunter of the harbor's edges." },
    { name:"Harbor Leviathan", rarity:RARITY.LEGENDARY, depth:"deep", lore:"A whispered giant that patrols the deep channel." }
  ],
  jungle: [
    { name:"Reed Minnow", rarity:RARITY.COMMON, depth:"surface", lore:"Lives among the reeds and lily pads." },
    { name:"Mossback Fry", rarity:RARITY.UNCOMMON, depth:"surface", lore:"Camouflaged with mossy scales." },
    { name:"Vine Pike", rarity:RARITY.RARE, depth:"mid", lore:"Ambush predator among submerged roots." },
    { name:"Emerald Ray", rarity:RARITY.EPIC, depth:"mid", lore:"Glows faintly under moonlight." },
    { name:"Verdant Serpent", rarity:RARITY.LEGENDARY, depth:"deep", lore:"A long serpent said to guard ancient groves." }
  ],
  volcano: [
    { name:"Ember Minnow", rarity:RARITY.COMMON, depth:"surface", lore:"Warmth-loving minnows near hot springs." },
    { name:"Lava Perch", rarity:RARITY.UNCOMMON, depth:"surface", lore:"Scales like cooled magma." },
    { name:"Volcanic Snapper", rarity:RARITY.RARE, depth:"mid", lore:"Bites with molten speed." },
    { name:"Ash Serpent", rarity:RARITY.EPIC, depth:"deep", lore:"A serpent that swims through smoke." },
    { name:"Infernal Leviathan", rarity:RARITY.MYTHIC, depth:"deep", lore:"A beast born from the heart of the mountain." }
  ],
  ocean: [
    { name:"Open Sea Minnow", rarity:RARITY.COMMON, depth:"surface", lore:"Small fish of the open blue." },
    { name:"Blueback Runner", rarity:RARITY.UNCOMMON, depth:"mid", lore:"Fast and elusive in open water." },
    { name:"Oceanic Ray", rarity:RARITY.RARE, depth:"mid", lore:"A graceful ray that glides in currents." },
    { name:"Deep Sea Serpent", rarity:RARITY.EPIC, depth:"deep", lore:"A rare deepwater hunter." },
    { name:"Abyssal Sovereign", rarity:RARITY.MYTHIC, depth:"abyss", lore:"Ruler of the abyssal plains." }
  ]
};

// Fisch-style spawn zones
const FISH_SPAWN_ZONES = {
  harbor: [ new THREE.Vector3(40,0,80), new THREE.Vector3(-60,0,20), new THREE.Vector3(20,0,-90) ],
  jungle: [ new THREE.Vector3(420,0,260), new THREE.Vector3(380,0,200), new THREE.Vector3(450,0,300) ],
  volcano: [ new THREE.Vector3(-520,0,-310), new THREE.Vector3(-480,0,-260), new THREE.Vector3(-550,0,-350) ],
  ocean: [ new THREE.Vector3(200,0,-400), new THREE.Vector3(-300,0,500), new THREE.Vector3(600,0,200) ]
};

// discovery & player state
let discoveredFish = new Set();
let discoveredRods = new Set(["driftwood"]);
let discoveredIslands = new Set(["harbor"]);

let currentRod = RODS[0];
let currentBait = null;
let playerCash = 0;

// inventory & aquarium
let inventory = [];
const AQUARIUM_SLOT_COUNT = 6;
let aquarium = {
  slots: Array.from({length:AQUARIUM_SLOT_COUNT}, ()=>null),
  lastPayout: Date.now()
};

// persistence
const SAVE_KEY = "fisch_rework_v2";

// -------------------- Three.js scene --------------------
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x071026);

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x071026, 0.0018);

const camera = new THREE.PerspectiveCamera(70, window.innerWidth/window.innerHeight, 0.1, 4000);
const cameraHolder = new THREE.Object3D();
const cameraPivot = new THREE.Object3D();
cameraHolder.add(cameraPivot);
cameraPivot.add(camera);
scene.add(cameraHolder);

const player = new THREE.Object3D();
player.position.set(0,20,0);
scene.add(player);

camera.position.set(0,3,-6);
cameraPivot.position.set(0,2,0);
cameraHolder.position.copy(player.position);

const hemi = new THREE.HemisphereLight(0xbfd8ff, 0x0b1020, 0.8);
scene.add(hemi);
const sun = new THREE.DirectionalLight(0xffffff, 0.9);
sun.position.set(100,200,80);
scene.add(sun);

// water plane
const OCEAN_SIZE = 4000;
const WATER_LEVEL = 0;
const BORDER_RADIUS = 1800;
const waterGeo = new THREE.PlaneGeometry(OCEAN_SIZE, OCEAN_SIZE, 128, 128);
const waterMat = new THREE.MeshPhongMaterial({ color:0x1b4f72, shininess:80, transparent:true, opacity:0.9 });
const water = new THREE.Mesh(waterGeo, waterMat);
water.rotation.x = -Math.PI/2;
water.position.y = WATER_LEVEL;
scene.add(water);

// islands
const ISLANDS = [
  { id:"harbor", name:"Harbor's Rest", position:[0,-5,0], radius:120, type:"harbor" },
  { id:"jungle", name:"Verdant Reach", position:[400,-5,250], radius:140, type:"jungle" },
  { id:"volcano", name:"Ashspire Isle", position:[-500,-5,-300], radius:150, type:"volcano" }
];

const islandLabels = [];
function createIslandLabel(text){
  const c = document.createElement("canvas"); c.width=256; c.height=64;
  const ctx = c.getContext("2d");
  ctx.fillStyle="rgba(0,0,0,0.6)"; ctx.fillRect(0,0,c.width,c.height);
  ctx.fillStyle="#fff"; ctx.font="22px system-ui"; ctx.textAlign="center"; ctx.textBaseline="middle";
  ctx.fillText(text,c.width/2,c.height/2);
  const tex = new THREE.CanvasTexture(c);
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map:tex, transparent:true }));
  sprite.scale.set(80,20,1); sprite.material.opacity=0;
  return sprite;
}

function buildIslands(){
  for(const isl of ISLANDS){
    const base = new THREE.Vector3(...isl.position);
    const geo = new THREE.DodecahedronGeometry(isl.radius*0.6);
    const mat = new THREE.MeshStandardMaterial({ color: isl.type==="volcano"?0x6d4c41: isl.type==="jungle"?0x43a047:0x9ccc65 });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.scale.y = isl.type==="harbor"?0.3: isl.type==="jungle"?0.4:0.5;
    mesh.position.copy(base);
    scene.add(mesh);
    const label = createIslandLabel(isl.name);
    label.position.set(base.x, base.y+30, base.z);
    scene.add(label);
    islandLabels.push({ island:isl, sprite:label });
  }
}

// -------------------- Movement --------------------
let yaw = 0, pitch = 0, rightMouseDown = false;
const keys = {};
document.addEventListener("keydown", e => { keys[e.code] = true; });
document.addEventListener("keyup", e => { keys[e.code] = false; });

canvas.addEventListener("contextmenu", e=>e.preventDefault());
canvas.addEventListener("mousedown", e => { if(e.button===2) rightMouseDown=true; });
document.addEventListener("mouseup", e => { if(e.button===2) rightMouseDown=false; });

document.addEventListener("mousemove", e => {
  if(!rightMouseDown) return;
  yaw += e.movementX * 0.002;
  pitch -= e.movementY * 0.002;
  pitch = Math.max(-Math.PI/3, Math.min(Math.PI/3, pitch));
});

let velocityY = 0;
const gravity = -25;
let cameraBobTime = 0;

function updateMovement(dt){
  let forward=0, right=0;
  if(keys["KeyW"]||keys["ArrowUp"]) forward+=1;
  if(keys["KeyS"]||keys["ArrowDown"]) forward-=1;
  if(keys["KeyA"]||keys["ArrowLeft"]) right-=1;
  if(keys["KeyD"]||keys["ArrowRight"]) right+=1;

  const dir = new THREE.Vector3();
  camera.getWorldDirection(dir);
  dir.y = 0; dir.normalize();

  // FIXED right vector: A = left, D = right
  const rightDir = new THREE.Vector3(-dir.z, 0, dir.x);

  const move = new THREE.Vector3();
  move.addScaledVector(dir, forward);
  move.addScaledVector(rightDir, right);
  if(move.length()>0) move.normalize();

  const speed = 12;
  velocityY += gravity * dt;
  if(keys["Space"] && player.position.y <= 20.1) velocityY = 10;

  player.position.x += move.x * speed * dt;
  player.position.z += move.z * speed * dt;
  player.position.y += velocityY * dt;

  if(player.position.y < 20){ player.position.y = 20; velocityY = 0; }

  const r = Math.sqrt(player.position.x**2 + player.position.z**2);
  if(r > BORDER_RADIUS){ const scale = BORDER_RADIUS / r; player.position.x *= scale; player.position.z *= scale; }

  cameraHolder.position.copy(player.position);
  cameraHolder.rotation.y = yaw;
  cameraPivot.rotation.x = pitch;

  if(move.length()>0){ cameraBobTime += dt*8; camera.position.y = 3 + Math.sin(cameraBobTime)*0.05; } else { cameraBobTime *= 0.9; camera.position.y = 3; }

  // island label fade
  for(const {island,sprite} of islandLabels){
    const ipos = new THREE.Vector3(...island.position);
    const d = player.position.distanceTo(ipos);
    const target = d < island.radius*3 ? 1 : 0;
    sprite.material.opacity += (target - sprite.material.opacity) * 0.06;
  }
}

// -------------------- HUD helpers --------------------
function showBanner(text, time=3500){
  hudCenterBanner.textContent = text;
  hudCenterBanner.style.opacity = "1";
  hudCenterBanner.classList.remove("hidden");
  setTimeout(()=> { hudCenterBanner.style.opacity = "0"; }, time);
}

// -------------------- Fishing system --------------------
let isFishing=false, fishingState="idle", fishingCastTime=0, fishingTimer=0;
let currentBobber=null, currentHookedFish=null;

const bobberGeo = new THREE.SphereGeometry(0.28, 12, 12);
const bobberMat = new THREE.MeshStandardMaterial({ color:0xffb86c, emissive:0x331100 });

function startFishing(){
  if(isFishing) return;
  if(Math.abs(player.position.y - WATER_LEVEL) > 3) { showBanner("Too far from water"); return; }
  isFishing = true; fishingState = "charging"; fishingCastTime = 0;
  showBanner("Charging cast...");
}

function castBobber(power){
  if(currentBobber){ scene.remove(currentBobber); currentBobber=null; }
  const bobber = new THREE.Mesh(bobberGeo, bobberMat.clone());
  const dir = new THREE.Vector3(); camera.getWorldDirection(dir); dir.y=0; dir.normalize();
  const distance = 5 + power*10;
  const pos = player.position.clone().add(dir.multiplyScalar(distance));
  pos.y = WATER_LEVEL + 0.3;
  bobber.position.copy(pos);
  scene.add(bobber);
  currentBobber = bobber;
}

function baseVariantChanceForRarity(rarity){
  switch(rarity){
    case RARITY.COMMON: return 0.01;
    case RARITY.UNCOMMON: return 0.008;
    case RARITY.RARE: return 0.005;
    case RARITY.EPIC: return 0.0025;
    case RARITY.LEGENDARY: return 0.001;
    case RARITY.MYTHIC: return 0.0005;
    case RARITY.EXOTIC: return 0.0001;
    default: return 0;
  }
}

function pickFish(regionId){
  const table = FISH_TABLES[regionId] || FISH_TABLES["ocean"];
  const fish = table[Math.floor(Math.random()*table.length)];
  const baseChance = baseVariantChanceForRarity(fish.rarity);
  const totalChance = baseChance + (currentRod.variantBonus || 0);
  let variant = null;
  if(Math.random() < totalChance) variant = "variant";
  return {...fish, variant};
}

function reelInFish(){
  if(!currentHookedFish) return;
  discoveredFish.add(currentHookedFish.name);
  showBanner(`Caught: ${currentHookedFish.name} (${currentHookedFish.rarity})`);
  addFishToInventory(currentHookedFish);
  endFishing();
}

function endFishing(){
  isFishing=false; fishingState="idle"; fishingTimer=0; fishingCastTime=0; currentHookedFish=null;
  if(currentBobber){ scene.remove(currentBobber); currentBobber=null; }
}

// E toggles inventory, M toggles aquarium
document.addEventListener("keydown", e=>{
  if(e.code==="KeyE"){ toggleInventory(); }
  if(e.code==="KeyM"){ toggleAquarium(); }
  if(e.code==="KeyF"){ if(!isFishing) startFishing(); }
});

// fishing update
function updateFishing(dt, time){
  if(!isFishing) return;
  if(fishingState==="charging"){
    fishingCastTime += dt;
    if(!keys["KeyE"]){ // release E to cast
      const power = Math.min(1, fishingCastTime/1.5);
      castBobber(power);
      fishingState = "waiting";
      fishingTimer = 0;
    }
  } else if(fishingState==="waiting"){
    fishingTimer += dt;
    const biteTime = 1.5 + Math.random()*2.5;
    if(fishingTimer > biteTime){
      const regionId = getRegionIdAtPosition(player.position);
      const fish = pickFish(regionId);
      currentHookedFish = fish;
      fishingState = "hooked";
      fishingTimer = 0;
      showBanner(`Something bit! ${fish.rarity.toUpperCase()}`, 2500);
      setTimeout(()=> openMinigameForHook(), 250);
    }
  } else if(fishingState==="hooked"){
    fishingTimer += dt;
    if(fishingTimer > 8){ endFishing(); showBanner("Fish escaped"); }
  }

  if(currentBobber){
    currentBobber.position.y = WATER_LEVEL + 0.3 + Math.sin(time*4)*0.1;
  }
}

// -------------------- Fisch-style radar --------------------
function getClosestFishDirection(){
  const regionId = getRegionIdAtPosition(player.position);
  const table = FISH_TABLES[regionId];
  const zones = FISH_SPAWN_ZONES[regionId];
  if(!table || !zones) return null;
  const fish = table[Math.floor(Math.random()*table.length)];
  let closest=null, closestDist=Infinity;
  for(const z of zones){
    const d = player.position.distanceTo(z);
    if(d < closestDist){ closestDist = d; closest = z; }
  }
  if(!closest) return null;
  const dx = closest.x - player.position.x;
  const dz = closest.z - player.position.z;
  const angle = Math.atan2(dx, dz);
  return { fish, angle };
}

function updateFishRadar(){
  const data = getClosestFishDirection();
  if(!data){
    radarArrow.style.opacity = "0.3";
    radarArrow.style.animation = "none";
    radarArrow.style.transform = "rotate(0rad)";
    radarArrow.style.color = "#fff";
    radarLabel.textContent = "No fish";
    return;
  }
  const { fish, angle } = data;
  radarArrow.style.opacity = "1";
  radarArrow.style.transform = `rotate(${angle}rad)`;
  radarArrow.style.color = rarityColors[fish.rarity] || "#fff";
  radarLabel.textContent = fish.name;
  if([RARITY.EPIC, RARITY.LEGENDARY, RARITY.MYTHIC, RARITY.EXOTIC].includes(fish.rarity)){
    radarArrow.style.animation = "pulse 0.6s infinite alternate";
  } else radarArrow.style.animation = "none";
}

// -------------------- Hotbar toggle behavior --------------------
let activePanelIndex = null;
hotbarSlots.forEach(slot=>{
  slot.addEventListener("click", ()=>{
    const idx = parseInt(slot.dataset.slot,10);
    togglePanel(idx);
  });
});

function togglePanel(idx){
  const panel = panelMap[idx];
  if(!panel) return;
  if(activePanelIndex === idx){
    panel.style.display = "none";
    panel.setAttribute("aria-hidden","true");
    activePanelIndex = null;
    hotbarSlots[idx].classList.remove("active");
  } else {
    if(activePanelIndex !== null){
      const prev = panelMap[activePanelIndex];
      if(prev){ prev.style.display = "none"; prev.setAttribute("aria-hidden","true"); hotbarSlots[activePanelIndex].classList.remove("active"); }
    }
    panel.style.display = "block";
    panel.setAttribute("aria-hidden","false");
    activePanelIndex = idx;
    hotbarSlots[idx].classList.add("active");
  }
}

// close panels when clicking outside
document.addEventListener("mousedown", e=>{
  if(e.target.closest(".gui-panel")) return;
  if(e.target.closest(".hotbar-slot")) return;
  if(activePanelIndex !== null){
    const panel = panelMap[activePanelIndex];
    if(panel){ panel.style.display = "none"; panel.setAttribute("aria-hidden","true"); hotbarSlots[activePanelIndex].classList.remove("active"); }
    activePanelIndex = null;
  }
});

// close buttons
document.querySelectorAll(".gui-panel .close").forEach(btn=>{
  btn.addEventListener("click", e=>{
    const panel = e.target.closest(".gui-panel");
    panel.style.display = "none";
    panel.setAttribute("aria-hidden","true");
    const idx = Object.keys(panelMap).find(k => panelMap[k] === panel);
    if(idx !== undefined) hotbarSlots[idx].classList.remove("active");
  });
});

// -------------------- Inventory & Aquarium --------------------
function toggleInventory(){
  if(panelInventory.style.display === "block"){
    panelInventory.style.display = "none"; panelInventory.setAttribute("aria-hidden","true");
  } else {
    panelInventory.style.display = "block"; panelInventory.setAttribute("aria-hidden","false");
    populateInventory();
  }
}

function toggleAquarium(){
  if(panelAquarium.style.display === "block"){
    panelAquarium.style.display = "none"; panelAquarium.setAttribute("aria-hidden","true");
  } else {
    panelAquarium.style.display = "block"; panelAquarium.setAttribute("aria-hidden","false");
    populateAquariumUI();
  }
}

function addFishToInventory(fish){
  inventory.push(fish);
  showBanner(`${fish.name} added to inventory`);
  saveState();
}

function populateInventory(){
  const el = document.getElementById("inventoryList");
  el.innerHTML = "";
  if(inventory.length === 0){
    el.innerHTML = "<div class='small'>Inventory empty</div>";
    return;
  }
  inventory.forEach((f, i)=>{
    const row = document.createElement("div");
    row.className = "entry";
    const left = document.createElement("div");
    left.innerHTML = `<div style="color:${rarityColors[f.rarity]||'#fff'}">${f.name}</div><div class="small">${f.lore}</div>`;
    const right = document.createElement("div");
    right.innerHTML = `<button data-i="${i}" class="btnPlace">Place</button> <button data-i="${i}" class="btnSell">Sell</button>`;
    row.appendChild(left); row.appendChild(right);
    el.appendChild(row);
  });
  el.querySelectorAll(".btnPlace").forEach(b=>{
    b.addEventListener("click", e=>{
      const i = parseInt(e.target.dataset.i,10);
      placeFishInAquarium(i);
    });
  });
  el.querySelectorAll(".btnSell").forEach(b=>{
    b.addEventListener("click", e=>{
      const i = parseInt(e.target.dataset.i,10);
      sellFishFromInventory(i);
    });
  });
}

// Aquarium UI & logic
function populateAquariumUI(){
  aquariumSlotsEl.innerHTML = "";
  for(let i=0;i<AQUARIUM_SLOT_COUNT;i++){
    const slot = document.createElement("div");
    slot.className = "aquarium-slot";
    const fish = aquarium.slots[i];
    if(fish){
      slot.innerHTML = `<div style="text-align:center"><div style="color:${rarityColors[fish.rarity]||'#fff'}">${fish.name}</div><div class="small">+${fish.payoutPer30m}$ /30m</div></div>`;
    } else {
      slot.innerHTML = `<div class="small">Empty</div>`;
    }
    aquariumSlotsEl.appendChild(slot);
  }
  updateAquariumInfo();
}

function updateAquariumInfo(){
  const next = getNextPayoutTime();
  nextPayoutEl.textContent = `Next payout: ${formatTimeRemaining(next - Date.now())}`;
  aquariumInfoEl.textContent = `Stored fish: ${aquarium.slots.filter(s=>s).length}/${AQUARIUM_SLOT_COUNT}`;
}

function placeFishInAquarium(inventoryIndex){
  const emptyIndex = aquarium.slots.findIndex(s=>!s);
  if(emptyIndex === -1){ showBanner("Aquarium full"); return; }
  const fish = inventory.splice(inventoryIndex,1)[0];
  const rarityBase = { common:2, uncommon:5, rare:12, epic:30, legendary:100, mythic:250, exotic:600 };
  const base = rarityBase[fish.rarity] || 2;
  const payoutPer30m = Math.round(base * (currentRod.power || 1));
  aquarium.slots[emptyIndex] = { ...fish, payoutPer30m };
  showBanner(`${fish.name} placed in aquarium`);
  populateInventory();
  populateAquariumUI();
  saveState();
}

function sellFishFromInventory(i){
  const fish = inventory.splice(i,1)[0];
  const rarityBase = { common:2, uncommon:5, rare:12, epic:30, legendary:100, mythic:250, exotic:600 };
  const base = rarityBase[fish.rarity] || 2;
  const value = Math.round(base * (currentRod.power || 1) * 0.6);
  playerCash += value;
  showBanner(`Sold ${fish.name} for $${value}`);
  populateInventory();
  saveState();
}

function collectAquariumPayouts(online=true){
  const multiplier = online ? 1.0 : 0.6;
  let total = 0;
  for(const f of aquarium.slots){
    if(f) total += Math.round(f.payoutPer30m * multiplier);
  }
  if(total > 0){
    playerCash += total;
    showBanner(`Collected $${total} from aquarium (${online ? "online" : "offline"})`);
    aquarium.lastPayout = Date.now();
    saveState();
  } else {
    showBanner("No fish to collect");
  }
  updateAquariumInfo();
}

collectAquariumBtn.addEventListener("click", ()=> collectAquariumPayouts(true));

function getNextPayoutTime(){
  const interval = 30 * 60 * 1000;
  const last = aquarium.lastPayout || Date.now();
  return last + interval;
}

function formatTimeRemaining(ms){
  if(ms <= 0) return "00:00";
  const s = Math.floor(ms/1000);
  const m = Math.floor(s/60);
  const sec = s % 60;
  return `${String(m).padStart(2,"0")}:${String(sec).padStart(2,"0")}`;
}

// -------------------- Bestiary & GUI population --------------------
function rarityLabel(r){
  switch(r){
    case RARITY.COMMON: return "Common";
    case RARITY.UNCOMMON: return "Uncommon";
    case RARITY.RARE: return "Rare";
    case RARITY.EPIC: return "Epic";
    case RARITY.LEGENDARY: return "Legendary";
    case RARITY.MYTHIC: return "Mythic";
    case RARITY.EXOTIC: return "Exotic";
    default: return "Unknown";
  }
}

function populateRods(){
  rodListEl.innerHTML = "";
  RODS.forEach((rod, i)=>{
    const div = document.createElement("div");
    div.className = "entry";
    const left = document.createElement("div");
    left.innerHTML = `<div style="color:${rarityColors[rod.rarity]||'#fff'}">${rod.name}</div><div class="small">${rod.lore}</div>`;
    const right = document.createElement("div");
    right.innerHTML = `<div class="small">Power: ${rod.power.toFixed(2)} • Control: ${rod.control.toFixed(2)}</div><button data-i="${i}" class="btnEquip">Equip</button>`;
    div.appendChild(left); div.appendChild(right);
    rodListEl.appendChild(div);
  });
  rodListEl.querySelectorAll(".btnEquip").forEach(b=>{
    b.addEventListener("click", e=>{
      const i = parseInt(e.target.dataset.i,10);
      currentRod = RODS[i];
      discoveredRods.add(currentRod.id);
      showBanner(`Equipped ${currentRod.name}`);
      updateRodAppearance();
      populateBestiary();
      saveState();
    });
  });
}

function populateBag(){ bagListEl.innerHTML = "<div class='small'>Equipment bag placeholder</div>"; }
function populateBait(){ baitListEl.innerHTML = "<div class='small'>Bait placeholder</div>"; }

function populateBestiary(){
  bestiaryFishEl.innerHTML = "";
  Object.keys(FISH_TABLES).forEach(regionId=>{
    const header = document.createElement("div");
    header.textContent = regionId==="ocean"?"Open Ocean": ISLANDS.find(i=>i.id===regionId)?.name || regionId;
    header.style.marginTop="8px"; header.style.color="#cfe8ff"; header.style.fontSize="13px";
    bestiaryFishEl.appendChild(header);
    FISH_TABLES[regionId].forEach(f=>{
      const row = document.createElement("div"); row.className="entry";
      const name = document.createElement("div"); name.textContent = discoveredFish.has(f.name)?f.name:"???"; name.style.color = discoveredFish.has(f.name)?(rarityColors[f.rarity]||"#fff"):"#7b8aa0";
      const meta = document.createElement("div"); meta.textContent = discoveredFish.has(f.name)?`${rarityLabel(f.rarity)} • ${f.depth}`:"Undiscovered"; meta.className="meta";
      row.appendChild(name); row.appendChild(meta); bestiaryFishEl.appendChild(row);
    });
  });
  bestiaryRodsEl.innerHTML = "";
  RODS.forEach(r=>{
    const row = document.createElement("div"); row.className="entry";
    const name = document.createElement("div"); name.textContent = discoveredRods.has(r.id)?r.name:"???"; name.style.color = discoveredRods.has(r.id)?(rarityColors[r.rarity]||"#fff"):"#7b8aa0";
    const meta = document.createElement("div"); meta.textContent = discoveredRods.has(r.id)?`${rarityLabel(r.rarity)}`:"Undiscovered"; meta.className="meta";
    row.appendChild(name); row.appendChild(meta); bestiaryRodsEl.appendChild(row);
  });
  bestiaryIslandsEl.innerHTML = "";
  ISLANDS.forEach(i=>{
    const row = document.createElement("div"); row.className="entry";
    const name = document.createElement("div"); name.textContent = discoveredIslands.has(i.id)?i.name:"???"; name.style.color = discoveredIslands.has(i.id)?"#fff":"#7b8aa0";
    const meta = document.createElement("div"); meta.textContent = discoveredIslands.has(i.id)?`Type: ${i.type}`:"Undiscovered"; meta.className="meta";
    row.appendChild(name); row.appendChild(meta); bestiaryIslandsEl.appendChild(row);
  });
}

bestiaryTabs.forEach(btn=>{
  btn.addEventListener("click", ()=>{
    bestiaryTabs.forEach(b=>b.classList.remove("active"));
    btn.classList.add("active");
    const tab = btn.dataset.tab;
    document.querySelectorAll(".bestiary-section").forEach(s=>s.classList.remove("active"));
    if(tab==="fish") bestiaryFishEl.classList.add("active");
    if(tab==="rods") bestiaryRodsEl.classList.add("active");
    if(tab==="islands") bestiaryIslandsEl.classList.add("active");
  });
});

// -------------------- Fishing minigame --------------------
let minigameActive=false;
let cursorX=0, cursorDir=1, cursorSpeed=220;
let zoneLeft=0, zoneWidth=0;

function openMinigameForHook(){
  if(!currentHookedFish) return;
  const rarityFactor = { common:0.28, uncommon:0.22, rare:0.18, epic:0.14, legendary:0.10, mythic:0.08, exotic:0.06 };
  const base = rarityFactor[currentHookedFish.rarity] || 0.2;
  const control = currentRod.control || 1.0;
  const zonePct = Math.max(0.05, base * (1.0 / control));
  const meterWidth = document.getElementById("minigameMeter").clientWidth;
  zoneWidth = Math.max(28, Math.round(meterWidth * zonePct));
  zoneLeft = Math.round((meterWidth - zoneWidth) * (0.2 + Math.random()*0.6));
  minigameZone.style.width = zoneWidth + "px";
  minigameZone.style.left = zoneLeft + "px";
  cursorX = 0; cursorDir = 1;
  cursorSpeed = 220 + Math.random()*120;
  minigameCursor.style.left = cursorX + "px";
  fishingMinigame.classList.remove("hidden");
  fishingMinigame.setAttribute("aria-hidden","false");
  minigameActive = true;
  minigameHint.textContent = `Reel when the cursor is inside the green zone. Fish: ${currentHookedFish.name}`;
}

function closeMinigame(){
  fishingMinigame.classList.add("hidden");
  fishingMinigame.setAttribute("aria-hidden","true");
  minigameActive = false;
}

minigameReel.addEventListener("click", ()=>{
  if(!minigameActive) return;
  const meterWidth = document.getElementById("minigameMeter").clientWidth;
  const cursorCenter = cursorX + 4;
  const inZone = cursorCenter >= zoneLeft && cursorCenter <= (zoneLeft + zoneWidth);
  const distToCenter = Math.abs((zoneLeft + zoneWidth/2) - cursorCenter);
  const centerFactor = Math.max(0, 1 - (distToCenter / (meterWidth/2)));
  const rodFactor = currentRod.power || 1;
  const successChance = Math.min(0.99, 0.35 + centerFactor*0.6*rodFactor);
  const roll = Math.random();
  closeMinigame();
  if(inZone && roll < successChance){
    reelInFish();
  } else {
    showBanner("Missed! The fish got away...", 2000);
    endFishing();
  }
});

minigameCancel.addEventListener("click", ()=>{
  closeMinigame();
  endFishing();
});

function updateMinigame(dt){
  if(!minigameActive) return;
  const meter = document.getElementById("minigameMeter");
  const maxX = meter.clientWidth - 8;
  cursorX += cursorDir * cursorSpeed * dt;
  if(cursorX < 0){ cursorX = 0; cursorDir = 1; }
  if(cursorX > maxX){ cursorX = maxX; cursorDir = -1; }
  minigameCursor.style.left = cursorX + "px";
}

// -------------------- Rod mesh (first-person) --------------------
let rodMesh = null;
function createRodMesh(){
  const rodGeo = new THREE.CylinderGeometry(0.06,0.08,5,10);
  const rodMat = new THREE.MeshStandardMaterial({ color: currentRod.color, metalness:0.2, roughness:0.4 });
  const handleGeo = new THREE.CylinderGeometry(0.18,0.2,1.6,10);
  const handleMat = new THREE.MeshStandardMaterial({ color:0x4e342e, roughness:0.8 });
  const reelBodyGeo = new THREE.CylinderGeometry(0.4,0.4,0.4,16);
  const reelBodyMat = new THREE.MeshStandardMaterial({ color:0x212121, metalness:0.6, roughness:0.3 });
  const reelArmGeo = new THREE.BoxGeometry(0.1,0.6,0.1);
  const reelArmMat = new THREE.MeshStandardMaterial({ color:0xbdbdbd, metalness:0.8, roughness:0.2 });
  const lineGeo = new THREE.CylinderGeometry(0.01,0.01,4,6);
  const lineMat = new THREE.MeshBasicMaterial({ color:0xe0f7fa });

  const rod = new THREE.Mesh(rodGeo, rodMat);
  const handle = new THREE.Mesh(handleGeo, handleMat);
  const reelBody = new THREE.Mesh(reelBodyGeo, reelBodyMat);
  const reelArm = new THREE.Mesh(reelArmGeo, reelArmMat);
  const line = new THREE.Mesh(lineGeo, lineMat);

  const group = new THREE.Group();
  rod.position.y = 2.4; handle.position.y = 0.6;
  reelBody.position.set(-0.25,1.0,0.0); reelBody.rotation.z = Math.PI/2;
  reelArm.position.set(-0.25,1.5,0.0); line.position.set(0,4.5,0.4); line.rotation.x = Math.PI/2;

  group.add(rod); group.add(handle); group.add(reelBody); group.add(reelArm); group.add(line);
  group.position.set(0.7,1.4,0.6); group.rotation.z = -Math.PI/4; group.rotation.y = Math.PI/10;

  cameraPivot.add(group);
  rodMesh = group;
}

function updateRodAppearance(){
  if(!rodMesh) return;
  rodMesh.traverse(child=>{
    if(child.isMesh && child.geometry instanceof THREE.CylinderGeometry){
      if(Math.abs(child.geometry.parameters.height - 5) < 0.01){
        child.material.color.setHex(currentRod.color);
      }
    }
  });
}

// -------------------- Utility: region detection --------------------
function getRegionIdAtPosition(pos){
  let closest=null, closestDist=Infinity;
  for(const isl of ISLANDS){
    const ipos = new THREE.Vector3(...isl.position);
    const d = pos.distanceTo(ipos);
    if(d < closestDist){ closestDist = d; closest = isl; }
  }
  if(!closest) return "ocean";
  if(closestDist < closest.radius*2.5){
    if(!discoveredIslands.has(closest.id)){ discoveredIslands.add(closest.id); showBanner(`Discovered: ${closest.name}`); saveState(); }
    return closest.id;
  }
  return "ocean";
}

// -------------------- Water animation --------------------
function updateWater(time){
  const pos = water.geometry.attributes.position;
  for(let i=0;i<pos.count;i++){
    const x = pos.getX(i), z = pos.getZ(i);
    const wave = Math.sin((x + time*20)*0.002)*0.3 + Math.cos((z + time*15)*0.002)*0.3 + Math.sin((x+z+time*10)*0.0015)*0.2;
    pos.setY(i, wave);
  }
  pos.needsUpdate = true;
  water.geometry.computeVertexNormals();
}

// -------------------- Persistence (save/load + offline payouts) --------------------
function saveState(){
  const state = {
    playerCash,
    inventory,
    aquarium,
    discoveredFish: Array.from(discoveredFish),
    discoveredRods: Array.from(discoveredRods),
    discoveredIslands: Array.from(discoveredIslands),
    currentRodId: currentRod.id,
    lastSave: Date.now()
  };
  localStorage.setItem(SAVE_KEY, JSON.stringify(state));
}

function loadState(){
  const raw = localStorage.getItem(SAVE_KEY);
  if(!raw) return;
  try{
    const s = JSON.parse(raw);
    playerCash = s.playerCash || 0;
    inventory = s.inventory || [];
    aquarium = s.aquarium || aquarium;
    discoveredFish = new Set(s.discoveredFish || []);
    discoveredRods = new Set(s.discoveredRods || ["driftwood"]);
    discoveredIslands = new Set(s.discoveredIslands || ["harbor"]);
    const rodId = s.currentRodId || "driftwood";
    const rod = RODS.find(r=>r.id===rodId);
    if(rod) currentRod = rod;

    // Offline payouts: calculate how many 30-minute intervals passed since lastPayout
    const now = Date.now();
    const last = aquarium.lastPayout || s.lastSave || now;
    const interval = 30 * 60 * 1000;
    const elapsed = Math.max(0, now - last);
    const intervals = Math.floor(elapsed / interval);
    if(intervals > 0){
      // offline multiplier
      const offlineMultiplier = 0.6;
      let total = 0;
      for(const f of aquarium.slots){
        if(f) total += Math.round(f.payoutPer30m * offlineMultiplier * intervals);
      }
      if(total > 0){
        playerCash += total;
        showBanner(`Offline aquarium payout: $${total} (for ${intervals} intervals)`);
      }
      aquarium.lastPayout = last + intervals * interval;
    }
  }catch(e){ console.warn("Failed to load save", e); }
}

// -------------------- Main loop --------------------
let lastTime = performance.now();
let radarTimer = 0;
let payoutTimer = 0;

function loop(now){
  const dt = (now - lastTime)/1000;
  lastTime = now;

  updateMovement(dt);
  updateFishing(dt, now/1000);
  updateMinigame(dt);
  updateWater(now/1000);

  radarTimer += dt;
  if(radarTimer > 1.5){ radarTimer = 0; updateFishRadar(); }

  payoutTimer += dt;
  if(payoutTimer > 1){ // check every second
    payoutTimer = 0;
    const next = getNextPayoutTime();
    if(Date.now() >= next){
      collectAquariumPayouts(true);
    }
    if(panelAquarium.style.display === "block") updateAquariumInfo();
  }

  // HUD updates
  const pos = player.position;
  hudGPS.textContent = `X: ${pos.x.toFixed(0)} | Y: ${pos.y.toFixed(0)} | Z: ${pos.z.toFixed(0)}`;
  const depth = Math.max(0, WATER_LEVEL - pos.y);
  hudDepth.textContent = `Depth: ${depth.toFixed(1)}m`;
  const regionId = getRegionIdAtPosition(player.position);
  const island = ISLANDS.find(i=>i.id===regionId);
  hudRegion.textContent = `Region: ${island?island.name:"Open Ocean"}`;

  renderer.render(scene, camera);
  requestAnimationFrame(loop);
}

// -------------------- Init --------------------
function init(){
  loadState();
  buildIslands();
  createRodMesh();
  populateRods();
  populateBag();
  populateBait();
  populateBestiary();
  populateInventory();
  populateAquariumUI();
  updateRodAppearance();
  window.addEventListener("resize", ()=>{ renderer.setSize(window.innerWidth, window.innerHeight); camera.aspect = window.innerWidth/window.innerHeight; camera.updateProjectionMatrix(); });
  requestAnimationFrame(loop);
}

init();
