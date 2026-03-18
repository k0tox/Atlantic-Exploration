// ===============================
// Fisch Bucket Prototype (Single File, No JSON)
// ===============================

// ----- DOM -----
const canvas = document.getElementById("gameCanvas");
const hudRegion = document.getElementById("hudRegion");
const hudGPS = document.getElementById("hudGPS");
const hudDepth = document.getElementById("hudDepth");
const hudCenterBanner = document.getElementById("hudCenterBanner");
const catchAlert = document.getElementById("catchAlert");
const radarCanvas = document.getElementById("radarCanvas");
const radarCtx = radarCanvas.getContext("2d");

// ----- DATA (hardcoded so it always works) -----
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

const VARIANTS = [
  "sparkling",
  "shiny",
  "rainbow",
  "gold",
  "silver",
  "translucent",
  "ghastly",
  "dirty",
  "frozen"
];

const RODS = [
  {
    id: "driftwood",
    name: "Driftwood Rod",
    rarity: RARITY.COMMON,
    variantBonus: 0.0
  },
  {
    id: "prism",
    name: "Prism Rod",
    rarity: RARITY.EPIC,
    variantBonus: 0.01
  },
  {
    id: "nullcurrent",
    name: "Nullcurrent Rod",
    rarity: RARITY.EXOTIC,
    variantBonus: 0.05
  }
];

const ISLANDS = [
  {
    id: "harbor",
    name: "Harbor's Rest",
    position: [0, -5, 0],
    radius: 120
  },
  {
    id: "jungle",
    name: "Verdant Reach",
    position: [400, -5, 250],
    radius: 140
  },
  {
    id: "volcano",
    name: "Ashspire Isle",
    position: [-500, -5, -300],
    radius: 150
  }
];

const FISH_TABLES = {
  harbor: [
    { name: "Harbor Minnow", rarity: RARITY.COMMON, depth: "surface" },
    { name: "Dock Perch", rarity: RARITY.COMMON, depth: "surface" },
    { name: "Pier Snapper", rarity: RARITY.RARE, depth: "mid" },
    { name: "Tide Barracuda", rarity: RARITY.EPIC, depth: "mid" },
    { name: "Harbor Leviathan", rarity: RARITY.LEGENDARY, depth: "deep" }
  ],
  jungle: [
    { name: "Reed Minnow", rarity: RARITY.COMMON, depth: "surface" },
    { name: "Mossback Fry", rarity: RARITY.UNCOMMON, depth: "surface" },
    { name: "Vine Pike", rarity: RARITY.RARE, depth: "mid" },
    { name: "Emerald Ray", rarity: RARITY.EPIC, depth: "mid" },
    { name: "Verdant Serpent", rarity: RARITY.LEGENDARY, depth: "deep" }
  ],
  volcano: [
    { name: "Ember Minnow", rarity: RARITY.COMMON, depth: "surface" },
    { name: "Lava Perch", rarity: RARITY.UNCOMMON, depth: "surface" },
    { name: "Volcanic Snapper", rarity: RARITY.RARE, depth: "mid" },
    { name: "Ash Serpent", rarity: RARITY.EPIC, depth: "deep" },
    { name: "Infernal Leviathan", rarity: RARITY.MYTHIC, depth: "deep" }
  ],
  ocean: [
    { name: "Open Sea Minnow", rarity: RARITY.COMMON, depth: "surface" },
    { name: "Blueback Runner", rarity: RARITY.UNCOMMON, depth: "mid" },
    { name: "Oceanic Ray", rarity: RARITY.RARE, depth: "mid" },
    { name: "Deep Sea Serpent", rarity: RARITY.EPIC, depth: "deep" },
    { name: "Abyssal Sovereign", rarity: RARITY.MYTHIC, depth: "abyss" }
  ]
};

let currentRod = RODS[0];

// ----- THREE SETUP -----
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x0a0c18);

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x0a0c18, 0.002);

const camera = new THREE.PerspectiveCamera(
  70,
  window.innerWidth / window.innerHeight,
  0.1,
  4000
);

// camera rig
const cameraHolder = new THREE.Object3D();
const cameraPivot = new THREE.Object3D();
cameraHolder.add(cameraPivot);
cameraPivot.add(camera);
scene.add(cameraHolder);

// player
const player = new THREE.Object3D();
player.position.set(0, 20, 0);
scene.add(player);

camera.position.set(0, 4, -8);
cameraPivot.position.set(0, 3, 0);
cameraHolder.position.copy(player.position);

// lights
const hemi = new THREE.HemisphereLight(0xbfd8ff, 0x0b1020, 0.8);
scene.add(hemi);

const sun = new THREE.DirectionalLight(0xffffff, 0.8);
sun.position.set(100, 200, 80);
scene.add(sun);

// ----- WORLD -----
const OCEAN_SIZE = 4000;
const WATER_LEVEL = 0;
const BORDER_RADIUS = 1800;

// water
const waterGeo = new THREE.PlaneGeometry(OCEAN_SIZE, OCEAN_SIZE, 128, 128);
const waterMat = new THREE.MeshPhongMaterial({
  color: 0x1b4f72,
  emissive: 0x000000,
  shininess: 80,
  transparent: true,
  opacity: 0.9
});
const water = new THREE.Mesh(waterGeo, waterMat);
water.rotation.x = -Math.PI / 2;
water.position.y = WATER_LEVEL;
scene.add(water);

function updateWater(time) {
  const pos = water.geometry.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const z = pos.getZ(i);
    const wave =
      Math.sin((x + time * 20) * 0.002) * 0.3 +
      Math.cos((z + time * 15) * 0.002) * 0.3;
    pos.setY(i, wave);
  }
  pos.needsUpdate = true;
  water.geometry.computeVertexNormals();
}

// islands + labels
const islandLabels = [];

function createIslandLabel(text) {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 64;
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "rgba(0,0,0,0.6)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#ffffff";
  ctx.font = "24px system-ui";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);

  const tex = new THREE.CanvasTexture(canvas);
  const sprite = new THREE.Sprite(
    new THREE.SpriteMaterial({ map: tex, transparent: true })
  );
  sprite.scale.set(80, 20, 1);
  sprite.material.opacity = 0;
  return sprite;
}

function buildIslands() {
  for (const island of ISLANDS) {
    const geo = new THREE.CylinderGeometry(island.radius * 0.6, island.radius, 10, 32);
    const mat = new THREE.MeshStandardMaterial({ color: 0xc2b280 });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(...island.position);
    scene.add(mesh);

    const label = createIslandLabel(island.name);
    label.position.set(island.position[0], island.position[1] + 20, island.position[2]);
    island.label = label;
    scene.add(label);
    islandLabels.push({ island, sprite: label });
  }
}

// control sign
function createControlSign() {
  const signGeo = new THREE.BoxGeometry(10, 6, 1);
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#3b2a1a";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#ffffff";
  ctx.font = "28px system-ui";
  ctx.textAlign = "center";

  ctx.fillText("Controls", 256, 40);
  ctx.font = "22px system-ui";
  ctx.fillText("WASD — Move", 256, 100);
  ctx.fillText("Right Click — Look", 256, 140);
  ctx.fillText("E — Interact / Fish", 256, 180);
  ctx.fillText("Space — Jump", 256, 220);

  const tex = new THREE.CanvasTexture(canvas);
  const mat = new THREE.MeshBasicMaterial({ map: tex });
  const sign = new THREE.Mesh(signGeo, mat);

  sign.position.set(0, 12, -20);
  scene.add(sign);
}

// ----- REGION -----
function getRegionIdAtPosition(pos) {
  let closest = null;
  let closestDist = Infinity;

  for (const island of ISLANDS) {
    const ipos = new THREE.Vector3(...island.position);
    const d = pos.distanceTo(ipos);
    if (d < closestDist) {
      closestDist = d;
      closest = island;
    }
  }

  if (!closest) return "ocean";
  if (closestDist < closest.radius * 2.5) return closest.id;
  return "ocean";
}

function getFishTable(regionId) {
  return FISH_TABLES[regionId] || FISH_TABLES["ocean"];
}

// ----- MOVEMENT & CAMERA -----
let yaw = 0;
let pitch = 0;
let rightMouseDown = false;

const keys = {};
document.addEventListener("keydown", e => (keys[e.code] = true));
document.addEventListener("keyup", e => (keys[e.code] = false));

canvas.addEventListener("contextmenu", e => e.preventDefault());
canvas.addEventListener("mousedown", e => {
  if (e.button === 2) rightMouseDown = true;
});
document.addEventListener("mouseup", e => {
  if (e.button === 2) rightMouseDown = false;
});

document.addEventListener("mousemove", e => {
  if (!rightMouseDown) return;
  yaw -= e.movementX * 0.002;
  pitch -= e.movementY * 0.002;
  pitch = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, pitch));
});

let velocityY = 0;
const gravity = -25;

function updateMovement(dt) {
  let forward = 0,
    right = 0;

  if (keys["KeyW"] || keys["ArrowUp"]) forward += 1;
  if (keys["KeyS"] || keys["ArrowDown"]) forward -= 1;
  if (keys["KeyA"] || keys["ArrowLeft"]) right -= 1;
  if (keys["KeyD"] || keys["ArrowRight"]) right += 1;

  const dir = new THREE.Vector3();
  cameraHolder.getWorldDirection(dir);
  dir.y = 0;
  dir.normalize();

  const rightDir = new THREE.Vector3(dir.z, 0, -dir.x);

  const move = new THREE.Vector3();
  move.addScaledVector(dir, forward);
  move.addScaledVector(rightDir, right);
  if (move.length() > 0) move.normalize();

  const speed = 12;

  velocityY += gravity * dt;
  if (keys["Space"] && player.position.y <= 20.1) velocityY = 10;

  player.position.x += move.x * speed * dt;
  player.position.z += move.z * speed * dt;
  player.position.y += velocityY * dt;

  if (player.position.y < 20) {
    player.position.y = 20;
    velocityY = 0;
  }

  const r = Math.sqrt(player.position.x ** 2 + player.position.z ** 2);
  if (r > BORDER_RADIUS) {
    const scale = BORDER_RADIUS / r;
    player.position.x *= scale;
    player.position.z *= scale;
  }

  cameraHolder.position.copy(player.position);
  cameraHolder.rotation.y = yaw;
  cameraPivot.rotation.x = pitch;
}

// ----- HUD -----
function updateHUD() {
  const pos = player.position;
  const depth = Math.max(0, WATER_LEVEL - pos.y);
  const regionId = getRegionIdAtPosition(pos);
  const island = ISLANDS.find(i => i.id === regionId);

  hudRegion.textContent = `Region: ${island ? island.name : "Open Ocean"}`;
  hudGPS.textContent = `X: ${pos.x.toFixed(0)} | Y: ${pos.y.toFixed(0)} | Z: ${pos.z.toFixed(0)}`;
  hudDepth.textContent = `Depth: ${depth.toFixed(1)}m`;

  for (const { island: isl, sprite } of islandLabels) {
    const ipos = new THREE.Vector3(...isl.position);
    const d = pos.distanceTo(ipos);
    const targetOpacity = d < isl.radius * 3 ? 1 : 0;
    sprite.material.opacity += (targetOpacity - sprite.material.opacity) * 0.05;
  }
}

// ----- CATCH ALERT -----
function showCatchAlert(rarity) {
  const color = rarityColors[rarity] || "#ffffff";
  catchAlert.style.borderColor = color;
  catchAlert.style.color = color;
  catchAlert.style.opacity = "1";
  setTimeout(() => {
    catchAlert.style.opacity = "0";
  }, 600);
}

// ----- FISHING -----
let isFishing = false;
let fishingState = "idle";
let fishingCastTime = 0;
let fishingTimer = 0;
let currentBobber = null;
let currentHookedFish = null;

const bobberGeo = new THREE.SphereGeometry(0.3, 16, 16);
const bobberMat = new THREE.MeshStandardMaterial({ color: 0xffb86c, emissive: 0x331100 });

function baseVariantChanceForRarity(rarity) {
  switch (rarity) {
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

function startFishing() {
  if (isFishing) return;
  if (Math.abs(player.position.y - WATER_LEVEL) > 3) return;
  isFishing = true;
  fishingState = "charging";
  fishingCastTime = 0;
}

function castBobber(power) {
  if (currentBobber) {
    scene.remove(currentBobber);
    currentBobber = null;
  }
  const bobber = new THREE.Mesh(bobberGeo, bobberMat.clone());
  const dir = new THREE.Vector3();
  cameraHolder.getWorldDirection(dir);
  dir.y = 0;
  dir.normalize();
  const distance = 5 + power * 10;
  const pos = player.position.clone().add(dir.multiplyScalar(distance));
  pos.y = WATER_LEVEL + 0.3;
  bobber.position.copy(pos);
  scene.add(bobber);
  currentBobber = bobber;
}

function pickFish(regionId) {
  const table = getFishTable(regionId);
  if (!table.length) return { name: "Nothing", rarity: RARITY.COMMON, variant: null };

  const fish = table[Math.floor(Math.random() * table.length)];
  const baseChance = baseVariantChanceForRarity(fish.rarity);
  const totalChance = baseChance + (currentRod.variantBonus || 0);
  let variant = null;
  if (Math.random() < totalChance) {
    variant = VARIANTS[Math.floor(Math.random() * VARIANTS.length)];
  }
  return { ...fish, variant };
}

function reelInFish() {
  if (!currentHookedFish) return;
  console.log("Caught fish:", currentHookedFish);
  endFishing();
}

function endFishing() {
  isFishing = false;
  fishingState = "idle";
  fishingTimer = 0;
  fishingCastTime = 0;
  currentHookedFish = null;
  if (currentBobber) {
    scene.remove(currentBobber);
    currentBobber = null;
  }
}

function updateFishing(dt, time) {
  if (!isFishing) return;

  if (fishingState === "charging") {
    fishingCastTime += dt;
    if (!keys["KeyE"]) {
      const power = Math.min(1, fishingCastTime / 1.5);
      castBobber(power);
      fishingState = "waiting";
      fishingTimer = 0;
    }
  } else if (fishingState === "waiting") {
    fishingTimer += dt;
    const biteTime = 1.5 + Math.random() * 2.5;
    if (fishingTimer > biteTime) {
      const regionId = getRegionIdAtPosition(player.position);
      const fish = pickFish(regionId);
      currentHookedFish = fish;
      fishingState = "hooked";
      fishingTimer = 0;
      showCatchAlert(fish.rarity);
    }
  } else if (fishingState === "hooked") {
    fishingTimer += dt;
    if (fishingTimer > 4) {
      endFishing();
    }
  }

  if (currentBobber) {
    currentBobber.position.y = WATER_LEVEL + 0.3 + Math.sin(time * 4) * 0.1;
  }
}

// interact key
document.addEventListener("keydown", e => {
  if (e.code === "KeyE") {
    if (!isFishing) startFishing();
    else if (fishingState === "hooked") reelInFish();
  }
});

// ----- EXOTIC SPAWNS -----
let exoticActive = false;
let exoticTimer = 0;
let exoticDuration = 0;
let exoticPosition = new THREE.Vector3();

function triggerExoticSpawn() {
  exoticActive = true;
  exoticDuration = 300 + Math.random() * 300;
  exoticTimer = 0;
  exoticPosition.set(
    (Math.random() - 0.5) * OCEAN_SIZE * 0.6,
    -50 - Math.random() * 150,
    (Math.random() - 0.5) * OCEAN_SIZE * 0.6
  );
  showBanner("A Divine Fish has appeared in the ocean!");
}

function updateExotic(dt) {
  if (!exoticActive) return;
  exoticTimer += dt;
  if (exoticTimer > exoticDuration) {
    exoticActive = false;
    showBanner("The Divine Fish has vanished...");
  }
}

function showBanner(text) {
  hudCenterBanner.textContent = text;
  hudCenterBanner.style.opacity = "1";
  setTimeout(() => {
    hudCenterBanner.style.opacity = "0";
  }, 10000);
}

// ----- RADAR -----
let radarFishPoints = [];
let radarTimer = 0;

function updateRadarData() {
  radarFishPoints = [];
  const regionId = getRegionIdAtPosition(player.position);
  const table = getFishTable(regionId);
  for (let i = 0; i < 12; i++) {
    const angle = Math.random() * Math.PI * 2;
    const dist = 10 + Math.random() * 60;
    const x = player.position.x + Math.cos(angle) * dist;
    const z = player.position.z + Math.sin(angle) * dist;
    const fish = table[Math.floor(Math.random() * table.length)];
    radarFishPoints.push({
      x,
      z,
      rarity: fish.rarity,
      variant: Math.random() < 0.05
    });
  }
  if (exoticActive) {
    radarFishPoints.push({
      x: exoticPosition.x,
      z: exoticPosition.z,
      rarity: RARITY.EXOTIC,
      variant: true
    });
  }
}

function drawRadar() {
  const w = radarCanvas.width;
  const h = radarCanvas.height;
  const cx = w / 2;
  const cy = h / 2;
  const maxRange = 80;

  radarCtx.clearRect(0, 0, w, h);
  radarCtx.fillStyle = "rgba(0,0,0,0.8)";
  radarCtx.fillRect(0, 0, w, h);

  radarCtx.strokeStyle = "rgba(255,255,255,0.2)";
  radarCtx.beginPath();
  radarCtx.arc(cx, cy, w / 2 - 6, 0, Math.PI * 2);
  radarCtx.stroke();

  radarCtx.strokeStyle = "rgba(255,255,255,0.1)";
  radarCtx.beginPath();
  radarCtx.arc(cx, cy, (w / 2 - 6) * 0.66, 0, Math.PI * 2);
  radarCtx.stroke();

  radarCtx.beginPath();
  radarCtx.arc(cx, cy, (w / 2 - 6) * 0.33, 0, Math.PI * 2);
  radarCtx.stroke();

  radarCtx.fillStyle = "#ffffff";
  radarCtx.beginPath();
  radarCtx.arc(cx, cy, 3, 0, Math.PI * 2);
  radarCtx.fill();

  for (const p of radarFishPoints) {
    const dx = p.x - player.position.x;
    const dz = p.z - player.position.z;
    const dist = Math.sqrt(dx * dx + dz * dz);
    if (dist > maxRange) continue;
    const angle = Math.atan2(dz, dx) - cameraHolder.rotation.y;
    const r = (dist / maxRange) * (w / 2 - 8);
    const px = cx + Math.cos(angle) * r;
    const py = cy + Math.sin(angle) * r;

    const color = rarityColors[p.rarity] || "#ffffff";
    radarCtx.fillStyle = color;
    radarCtx.beginPath();
    radarCtx.arc(px, py, p.variant ? 4 : 3, 0, Math.PI * 2);
    radarCtx.fill();

    if (p.variant) {
      radarCtx.strokeStyle = "rgba(255,255,255,0.7)";
      radarCtx.beginPath();
      radarCtx.arc(px, py, 6, 0, Math.PI * 2);
      radarCtx.stroke();
    }
  }
}

// ----- MAIN LOOP -----
let lastTime = performance.now();
let exoticSpawnTimer = 0;

function loop(now) {
  const dt = (now - lastTime) / 1000;
  lastTime = now;

  updateMovement(dt);
  updateHUD();
  updateFishing(dt, now / 1000);
  updateExotic(dt);
  updateWater(now / 1000);

  radarTimer += dt;
  if (radarTimer > 0.5) {
    radarTimer = 0;
    updateRadarData();
  }
  drawRadar();

  exoticSpawnTimer += dt;
  if (exoticSpawnTimer > 120 && !exoticActive) {
    exoticSpawnTimer = 0;
    triggerExoticSpawn();
  }

  renderer.render(scene, camera);
  requestAnimationFrame(loop);
}

// ----- INIT -----
function init() {
  buildIslands();
  createControlSign();

  window.addEventListener("resize", () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  });

  requestAnimationFrame(loop);
}

init();
