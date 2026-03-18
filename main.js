// =====================================================
// Fisch Bucket Prototype - Expanded, Detailed Version
// Better visuals, better gameplay, better design
// =====================================================

// ----------------------
// DOM references
// ----------------------
const canvas = document.getElementById("gameCanvas");
const hudRegion = document.getElementById("hudRegion");
const hudGPS = document.getElementById("hudGPS");
const hudDepth = document.getElementById("hudDepth");
const hudCenterBanner = document.getElementById("hudCenterBanner");
const catchAlert = document.getElementById("catchAlert");

const panelRod = document.getElementById("panelRod");
const panelToolBag = document.getElementById("panelToolBag");
const panelBaitBag = document.getElementById("panelBaitBag");
const panelBestiary = document.getElementById("panelBestiary");
const panelQuest = document.getElementById("panelQuest");
const panelTotems = document.getElementById("panelTotems");
const panelPotions = document.getElementById("panelPotions");
const panelRelic = document.getElementById("panelRelic");
const panelUtility = document.getElementById("panelUtility");

const btnRod = document.getElementById("btnRod");
const btnToolBag = document.getElementById("btnToolBag");
const btnBaitBag = document.getElementById("btnBaitBag");
const btnBestiary = document.getElementById("btnBestiary");
const btnQuest = document.getElementById("btnQuest");
const btnTotems = document.getElementById("btnTotems");
const btnPotions = document.getElementById("btnPotions");
const btnRelic = document.getElementById("btnRelic");
const btnUtility = document.getElementById("btnUtility");

const hotbarSlots = Array.from(document.querySelectorAll(".hotbar-slot"));

const radarArrow = document.getElementById("radarArrow");
const radarLabel = document.getElementById("radarLabel");

const rodList = document.getElementById("rodList");
const baitList = document.getElementById("baitList");
const toolList = document.getElementById("toolList");
const questList = document.getElementById("questList");
const totemList = document.getElementById("totemList");
const potionList = document.getElementById("potionList");
const relicInfo = document.getElementById("relicInfo");
const utilityList = document.getElementById("utilityList");

const bestiaryTabs = document.getElementById("bestiaryTabs");
const bestiaryFish = document.getElementById("bestiaryFish");
const bestiaryRods = document.getElementById("bestiaryRods");
const bestiaryIslands = document.getElementById("bestiaryIslands");

// ----------------------
// Core data definitions
// ----------------------
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

// Rods expanded with more detail
const RODS = [
  {
    id: "driftwood",
    name: "Driftwood Rod",
    rarity: RARITY.COMMON,
    variantBonus: 0.0,
    color: 0x8d6e63,
    desc: "A simple rod made from washed-up driftwood. Reliable, but nothing special.",
    control: "Basic control, no special effects."
  },
  {
    id: "harborOak",
    name: "Harbor Oak Rod",
    rarity: RARITY.UNCOMMON,
    variantBonus: 0.002,
    color: 0x6d4c41,
    desc: "Carved from old harbor oak. Slightly steadier bite timing.",
    control: "Smoother bite window for common harbor fish."
  },
  {
    id: "prism",
    name: "Prism Rod",
    rarity: RARITY.EPIC,
    variantBonus: 0.01,
    color: 0x9c27b0,
    desc: "Refracts light beneath the waves, slightly increasing the chance of variant fish.",
    control: "Subtle glow on rare bites."
  },
  {
    id: "nullcurrent",
    name: "Nullcurrent Rod",
    rarity: RARITY.EXOTIC,
    variantBonus: 0.05,
    color: 0x00e5ff,
    desc: "A rod that bends currents around it, greatly boosting variant encounters.",
    control: "More stable bobber, higher variant chance."
  }
];

const BAITS = [
  { id: "basic", name: "Basic Bait", rarity: RARITY.COMMON, desc: "Standard bait. Works anywhere, but nothing fancy." },
  { id: "harborShrimp", name: "Harbor Shrimp", rarity: RARITY.UNCOMMON, desc: "Favored by harbor fish. Slightly boosts harbor catches." },
  { id: "jungleGrub", name: "Jungle Grub", rarity: RARITY.UNCOMMON, desc: "Sticky jungle bait. Attracts jungle species." },
  { id: "emberWorm", name: "Ember Worm", rarity: RARITY.RARE, desc: "Glows faintly. Volcano fish love it." }
];

const TOOLS = [
  { id: "net", name: "Landing Net", desc: "Helps secure larger fish once hooked." },
  { id: "scale", name: "Precision Scale", desc: "Measures fish weight for records." },
  { id: "lineKit", name: "Line Repair Kit", desc: "Reduces chance of line snapping on big catches." }
];

const POTIONS = [
  { id: "luck", name: "Potion of Luck", desc: "Temporarily increases rare fish chance." },
  { id: "clarity", name: "Potion of Clarity", desc: "Highlights bite timing in the fishing minigame." },
  { id: "depth", name: "Potion of Depthsense", desc: "Makes deep fish slightly easier to hook." }
];

const TOTEMS = [
  { id: "storm", name: "Storm Totem", desc: "Summons rough seas, changing fish behavior." },
  { id: "calm", name: "Calm Totem", desc: "Smooths the waters, easier fishing but fewer exotics." },
  { id: "tide", name: "Tide Totem", desc: "Shifts currents, altering which fish appear." }
];

const UTILITIES = [
  { id: "campfire", name: "Portable Campfire", desc: "A place to rest and cook fish." },
  { id: "beacon", name: "Sea Beacon", desc: "Marks a location in the ocean." },
  { id: "flare", name: "Signal Flare", desc: "Marks the sky above your position." }
];

const RELIC = {
  id: "ancientKey",
  name: "Ancient Relic Key",
  desc: "Said to unlock a forgotten trench somewhere beyond the known islands."
};

// Islands with positions and types
const ISLANDS = [
  {
    id: "harbor",
    name: "Harbor's Rest",
    position: [0, -5, 0],
    radius: 120,
    type: "harbor"
  },
  {
    id: "jungle",
    name: "Verdant Reach",
    position: [400, -5, 250],
    radius: 140,
    type: "jungle"
  },
  {
    id: "volcano",
    name: "Ashspire Isle",
    position: [-500, -5, -300],
    radius: 150,
    type: "volcano"
  }
];

// Fish tables per region
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

// Discovery tracking
let discoveredIslands = new Set(["harbor"]);
let discoveredFish = new Set();
let discoveredRods = new Set(["driftwood"]);

// Current rod and hotbar
let currentRod = RODS[0];
let selectedHotbarSlot = 0;

// ----------------------
// Three.js setup
// ----------------------
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x0a0c18);

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x0a0c18, 0.0018);

// Day-night cycle color targets
const daySkyColor = new THREE.Color(0x87cefa);
const nightSkyColor = new THREE.Color(0x02030a);
const dayFogColor = new THREE.Color(0x0a1a2a);
const nightFogColor = new THREE.Color(0x02030a);

// Camera hierarchy
const camera = new THREE.PerspectiveCamera(
  70,
  window.innerWidth / window.innerHeight,
  0.1,
  4000
);

const cameraHolder = new THREE.Object3D();
const cameraPivot = new THREE.Object3D();
cameraHolder.add(cameraPivot);
cameraPivot.add(camera);
scene.add(cameraHolder);

// Player object
const player = new THREE.Object3D();
player.position.set(0, 20, 0);
scene.add(player);

// Camera initial placement
camera.position.set(0, 3, -6);
cameraPivot.position.set(0, 2, 0);
cameraHolder.position.copy(player.position);

// Lights
const hemi = new THREE.HemisphereLight(0xbfd8ff, 0x0b1020, 0.8);
scene.add(hemi);

const sun = new THREE.DirectionalLight(0xffffff, 1.0);
sun.position.set(100, 200, 80);
sun.castShadow = true;
scene.add(sun);

// ----------------------
// World / water / islands
// ----------------------
const OCEAN_SIZE = 4000;
const WATER_LEVEL = 0;
const BORDER_RADIUS = 1800;

// Water plane
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
water.receiveShadow = true;
scene.add(water);

// Simple underwater tint plane (for when camera goes below water)
const underwaterOverlay = new THREE.Mesh(
  new THREE.PlaneGeometry(2, 2),
  new THREE.MeshBasicMaterial({
    color: 0x001a33,
    transparent: true,
    opacity: 0
  })
);
underwaterOverlay.position.z = -1;
camera.add(underwaterOverlay);

// Water animation
function updateWater(time) {
  const pos = water.geometry.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const z = pos.getZ(i);
    const wave =
      Math.sin((x + time * 20) * 0.002) * 0.3 +
      Math.cos((z + time * 15) * 0.002) * 0.3 +
      Math.sin((x + z + time * 10) * 0.0015) * 0.2;
    pos.setY(i, wave);
  }
  pos.needsUpdate = true;
  water.geometry.computeVertexNormals();
}

// Island labels
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

// Harbor details
function addHarborDetails(basePos) {
  const dockGeo = new THREE.BoxGeometry(40, 1, 10);
  const dockMat = new THREE.MeshStandardMaterial({ color: 0x8b5a2b });
  const dock = new THREE.Mesh(dockGeo, dockMat);
  dock.position.set(basePos.x + 20, basePos.y + 1, basePos.z);
  dock.castShadow = true;
  dock.receiveShadow = true;
  scene.add(dock);

  const crateGeo = new THREE.BoxGeometry(3, 3, 3);
  const crateMat = new THREE.MeshStandardMaterial({ color: 0x6d4c41 });
  for (let i = 0; i < 4; i++) {
    const crate = new THREE.Mesh(crateGeo, crateMat);
    crate.position.set(
      basePos.x + 10 + i * 3,
      basePos.y + 2,
      basePos.z + (i % 2 === 0 ? 4 : -4)
    );
    crate.castShadow = true;
    crate.receiveShadow = true;
    scene.add(crate);
  }

  const lampGeo = new THREE.CylinderGeometry(0.2, 0.2, 6, 8);
  const lampMat = new THREE.MeshStandardMaterial({ color: 0x4e342e });
  const lamp = new THREE.Mesh(lampGeo, lampMat);
  lamp.position.set(basePos.x + 30, basePos.y + 4, basePos.z - 3);
  scene.add(lamp);

  const lampLight = new THREE.PointLight(0xfff2b2, 1.2, 40);
  lampLight.position.set(basePos.x + 30, basePos.y + 7, basePos.z - 3);
  scene.add(lampLight);
}

// Jungle details
function addJungleDetails(basePos) {
  const trunkGeo = new THREE.CylinderGeometry(0.8, 1.2, 8, 6);
  const trunkMat = new THREE.MeshStandardMaterial({ color: 0x5b3a1a });
  const leafGeo = new THREE.ConeGeometry(4, 6, 8);
  const leafMat = new THREE.MeshStandardMaterial({ color: 0x2e7d32 });

  for (let i = 0; i < 9; i++) {
    const t = new THREE.Mesh(trunkGeo, trunkMat);
    const l = new THREE.Mesh(leafGeo, leafMat);
    const angle = (i / 9) * Math.PI * 2;
    const r = 20 + Math.random() * 10;
    const x = basePos.x + Math.cos(angle) * r;
    const z = basePos.z + Math.sin(angle) * r;
    t.position.set(x, basePos.y + 4, z);
    l.position.set(x, basePos.y + 9, z);
    t.castShadow = true;
    t.receiveShadow = true;
    l.castShadow = true;
    l.receiveShadow = true;
    scene.add(t);
    scene.add(l);
  }
}

// Volcano details
function addVolcanoDetails(basePos) {
  const coneGeo = new THREE.ConeGeometry(40, 40, 16);
  const coneMat = new THREE.MeshStandardMaterial({ color: 0x4e342e });
  const cone = new THREE.Mesh(coneGeo, coneMat);
  cone.position.set(basePos.x, basePos.y + 25, basePos.z);
  cone.castShadow = true;
  cone.receiveShadow = true;
  scene.add(cone);

  const lavaGeo = new THREE.CircleGeometry(10, 16);
  const lavaMat = new THREE.MeshBasicMaterial({ color: 0xff5722 });
  const lava = new THREE.Mesh(lavaGeo, lavaMat);
  lava.rotation.x = -Math.PI / 2;
  lava.position.set(basePos.x, basePos.y + 45, basePos.z);
  scene.add(lava);
}

// Build islands
function buildIslands() {
  for (const island of ISLANDS) {
    let mesh;
    const basePos = new THREE.Vector3(...island.position);

    if (island.type === "harbor") {
      const geo = new THREE.DodecahedronGeometry(island.radius * 0.6);
      const mat = new THREE.MeshStandardMaterial({ color: 0x9ccc65 });
      mesh = new THREE.Mesh(geo, mat);
      mesh.scale.y = 0.3;
      mesh.position.copy(basePos);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      scene.add(mesh);
      addHarborDetails(basePos);
    } else if (island.type === "jungle") {
      const geo = new THREE.DodecahedronGeometry(island.radius * 0.7);
      const mat = new THREE.MeshStandardMaterial({ color: 0x43a047 });
      mesh = new THREE.Mesh(geo, mat);
      mesh.scale.y = 0.4;
      mesh.position.copy(basePos);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      scene.add(mesh);
      addJungleDetails(basePos);
    } else if (island.type === "volcano") {
      const geo = new THREE.DodecahedronGeometry(island.radius * 0.6);
      const mat = new THREE.MeshStandardMaterial({ color: 0x6d4c41 });
      mesh = new THREE.Mesh(geo, mat);
      mesh.scale.y = 0.5;
      mesh.position.copy(basePos);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      scene.add(mesh);
      addVolcanoDetails(basePos);
    }

    const label = createIslandLabel(island.name);
    label.position.set(basePos.x, basePos.y + 30, basePos.z);
    island.label = label;
    scene.add(label);
    islandLabels.push({ island, sprite: label });
  }
}

// Control sign near spawn
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
  sign.castShadow = true;
  scene.add(sign);
}

// ----------------------
// Rod model in first person
// ----------------------
let rodMesh = null;

function createRodMesh() {
  const rodGeo = new THREE.CylinderGeometry(0.06, 0.08, 5, 10);
  const rodMat = new THREE.MeshStandardMaterial({
    color: currentRod.color,
    metalness: 0.2,
    roughness: 0.4
  });

  const handleGeo = new THREE.CylinderGeometry(0.18, 0.2, 1.6, 10);
  const handleMat = new THREE.MeshStandardMaterial({
    color: 0x4e342e,
    roughness: 0.8
  });

  const reelBodyGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.4, 16);
  const reelBodyMat = new THREE.MeshStandardMaterial({
    color: 0x212121,
    metalness: 0.6,
    roughness: 0.3
  });

  const reelArmGeo = new THREE.BoxGeometry(0.1, 0.6, 0.1);
  const reelArmMat = new THREE.MeshStandardMaterial({
    color: 0xbdbdbd,
    metalness: 0.8,
    roughness: 0.2
  });

  const lineGeo = new THREE.CylinderGeometry(0.01, 0.01, 4, 6);
  const lineMat = new THREE.MeshBasicMaterial({ color: 0xe0f7fa });

  const rod = new THREE.Mesh(rodGeo, rodMat);
  const handle = new THREE.Mesh(handleGeo, handleMat);
  const reelBody = new THREE.Mesh(reelBodyGeo, reelBodyMat);
  const reelArm = new THREE.Mesh(reelArmGeo, reelArmMat);
  const line = new THREE.Mesh(lineGeo, lineMat);

  const group = new THREE.Group();

  rod.position.y = 2.4;
  handle.position.y = 0.6;
  reelBody.position.set(-0.25, 1.0, 0.0);
  reelBody.rotation.z = Math.PI / 2;
  reelArm.position.set(-0.25, 1.5, 0.0);
  line.position.set(0, 4.5, 0.4);
  line.rotation.x = Math.PI / 2;

  group.add(rod);
  group.add(handle);
  group.add(reelBody);
  group.add(reelArm);
  group.add(line);

  group.position.set(0.7, 1.4, 0.6);
  group.rotation.z = -Math.PI / 4;
  group.rotation.y = Math.PI / 10;

  cameraPivot.add(group);
  rodMesh = group;
}

function updateRodAppearance() {
  if (!rodMesh) return;
  rodMesh.traverse(child => {
    if (child.isMesh && child.geometry instanceof THREE.CylinderGeometry) {
      if (Math.abs(child.geometry.parameters.height - 5) < 0.01) {
        child.material.color.setHex(currentRod.color);
      }
    }
  });
}

// ----------------------
// Region / fish tables
// ----------------------
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

// ----------------------
// Movement & camera
// ----------------------
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
  yaw += e.movementX * 0.002;
  pitch -= e.movementY * 0.002;
  pitch = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, pitch));
});

let velocityY = 0;
const gravity = -25;
let cameraBobTime = 0;

function updateMovement(dt) {
  let forward = 0;
  let right = 0;

  if (keys["KeyW"] || keys["ArrowUp"]) forward += 1;
  if (keys["KeyS"] || keys["ArrowDown"]) forward -= 1;
  if (keys["KeyA"] || keys["ArrowLeft"]) right -= 1;
  if (keys["KeyD"] || keys["ArrowRight"]) right += 1;

  const dir = new THREE.Vector3();
  camera.getWorldDirection(dir);
  dir.y = 0;
  dir.normalize();

  const rightDir = new THREE.Vector3(dir.z, 0, -dir.x);

  const move = new THREE.Vector3();
  // FIX: W moves forward, S moves backward (no inversion)
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

  if (move.length() > 0) {
    cameraBobTime += dt * 8;
    const bobOffset = Math.sin(cameraBobTime) * 0.05;
    camera.position.y = 3 + bobOffset;
  } else {
    cameraBobTime *= 0.9;
    camera.position.y = 3;
  }

  const camWorldPos = new THREE.Vector3();
  camera.getWorldPosition(camWorldPos);
  if (camWorldPos.y < WATER_LEVEL - 0.5) {
    underwaterOverlay.material.opacity = 0.35;
  } else {
    underwaterOverlay.material.opacity = 0;
  }
}

// ----------------------
// HUD updates
// ----------------------
function updateHUD() {
  const pos = player.position;
  const depth = Math.max(0, WATER_LEVEL - pos.y);
  const regionId = getRegionIdAtPosition(pos);
  const island = ISLANDS.find(i => i.id === regionId);

  if (island && !discoveredIslands.has(island.id)) {
    discoveredIslands.add(island.id);
    showBanner(`Discovered: ${island.name}`);
  }

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

// ----------------------
// Catch alert
// ----------------------
function showCatchAlert(rarity) {
  const color = rarityColors[rarity] || "#ffffff";
  catchAlert.style.borderColor = color;
  catchAlert.style.color = color;
  catchAlert.style.opacity = "1";
  catchAlert.style.animation = "catchPulse 0.4s alternate 2";
  setTimeout(() => {
    catchAlert.style.opacity = "0";
    catchAlert.style.animation = "none";
  }, 700);
}

// ----------------------
// Fishing system
// ----------------------
let isFishing = false;
let fishingState = "idle";
let fishingCastTime = 0;
let fishingTimer = 0;
let currentBobber = null;
let currentHookedFish = null;

const bobberGeo = new THREE.SphereGeometry(0.3, 16, 16);
const bobberMat = new THREE.MeshStandardMaterial({
  color: 0xffb86c,
  emissive: 0x331100
});

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
  camera.getWorldDirection(dir);
  dir.y = 0;
  dir.normalize();
  const distance = 5 + power * 10;
  const pos = player.position.clone().add(dir.multiplyScalar(distance));
  pos.y = WATER_LEVEL + 0.3;
  bobber.position.copy(pos);
  bobber.castShadow = true;
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
  discoveredFish.add(currentHookedFish.name);
  showCatchAlert(currentHookedFish.rarity);
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

document.addEventListener("keydown", e => {
  if (e.code === "KeyE") {
    if (!isFishing) startFishing();
    else if (fishingState === "hooked") reelInFish();
  }
});

// ----------------------
// Exotic spawns
// ----------------------
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

// ----------------------
// Banner
// ----------------------
function showBanner(text) {
  hudCenterBanner.textContent = text;
  hudCenterBanner.style.opacity = "1";
  setTimeout(() => {
    hudCenterBanner.style.opacity = "0";
  }, 10000);
}

// ----------------------
// Fish radar (directional only)
// ----------------------
function getClosestFishDirection() {
  const regionId = getRegionIdAtPosition(player.position);
  const table = getFishTable(regionId);

  if (!table || table.length === 0) return null;

  const fish = table[Math.floor(Math.random() * table.length)];
  const angle = Math.random() * Math.PI * 2;

  return {
    fish,
    angle
  };
}

function updateFishRadar() {
  const data = getClosestFishDirection();

  if (!data) {
    radarArrow.style.opacity = "0.3";
    radarArrow.style.animation = "none";
    radarArrow.style.transform = "rotate(0rad)";
    radarArrow.style.color = "#ffffff";
    radarLabel.textContent = "No fish detected";
    return;
  }

  const { fish, angle } = data;

  radarArrow.style.opacity = "1";
  radarArrow.style.transform = `rotate(${angle}rad)`;
  radarArrow.style.color = rarityColors[fish.rarity] || "#ffffff";
  radarLabel.textContent = fish.name;

  if (
    fish.rarity === RARITY.EPIC ||
    fish.rarity === RARITY.LEGENDARY ||
    fish.rarity === RARITY.MYTHIC ||
    fish.rarity === RARITY.EXOTIC
  ) {
    radarArrow.style.animation = "pulse 0.6s infinite alternate";
  } else {
    radarArrow.style.animation = "none";
  }
}

setInterval(updateFishRadar, 1500);

// ----------------------
// GUI / hotbar
// ----------------------
function hideAllPanels() {
  [
    panelRod,
    panelToolBag,
    panelBaitBag,
    panelBestiary,
    panelQuest,
    panelTotems,
    panelPotions,
    panelRelic,
    panelUtility
  ]
    .filter(Boolean)
    .forEach(p => (p.style.display = "none"));
}

function showPanel(panel) {
  if (!panel) return;
  hideAllPanels();
  panel.style.display = "block";
}

[panelRod, panelToolBag, panelBaitBag, panelBestiary, panelQuest, panelTotems, panelPotions, panelRelic, panelUtility]
  .filter(Boolean)
  .forEach(panel => {
    panel.addEventListener("click", e => {
      const rect = panel.getBoundingClientRect();
      const xIconArea = rect.right - 24;
      if (e.clientX >= xIconArea && e.clientY <= rect.top + 24) {
        panel.style.display = "none";
      }
    });
  });

if (btnRod) btnRod.onclick = () => showPanel(panelRod);
if (btnToolBag) btnToolBag.onclick = () => showPanel(panelToolBag);
if (btnBaitBag) btnBaitBag.onclick = () => showPanel(panelBaitBag);
if (btnBestiary) btnBestiary.onclick = () => showPanel(panelBestiary);
if (btnQuest) btnQuest.onclick = () => showPanel(panelQuest);
if (btnTotems) btnTotems.onclick = () => showPanel(panelTotems);
if (btnPotions) btnPotions.onclick = () => showPanel(panelPotions);
if (btnRelic) btnRelic.onclick = () => showPanel(panelRelic);
if (btnUtility) btnUtility.onclick = () => showPanel(panelUtility);

function setActiveHotbarSlot(index) {
  hotbarSlots.forEach((slot, i) => {
    if (i === index) slot.classList.add("active");
    else slot.classList.remove("active");
  });
}

setActiveHotbarSlot(0);

document.addEventListener("keydown", e => {
  if (e.code >= "Digit1" && e.code <= "Digit9") {
    const idx = parseInt(e.code.slice(-1), 10) - 1;
    selectedHotbarSlot = idx;
    setActiveHotbarSlot(idx);
    if (idx >= 0 && idx < RODS.length) {
      currentRod = RODS[idx];
      discoveredRods.add(currentRod.id);
      updateRodAppearance();
    }
  }
});

// ----------------------
// Bestiary population
// ----------------------
function rarityLabel(r) {
  switch (r) {
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

function populateRodPanel() {
  if (!rodList) return;
  rodList.innerHTML = "";
  RODS.forEach(rod => {
    const div = document.createElement("div");
    div.className = "bestiary-entry";
    const name = document.createElement("div");
    name.className = "bestiary-entry-name";
    name.textContent = rod.name;
    name.style.color = rarityColors[rod.rarity] || "#fff";
    const meta = document.createElement("div");
    meta.className = "bestiary-entry-meta";
    meta.textContent = `${rarityLabel(rod.rarity)} • ${rod.desc} • ${rod.control}`;
    div.appendChild(name);
    div.appendChild(meta);
    rodList.appendChild(div);
  });
}

function populateBaitPanel() {
  if (!baitList) return;
  baitList.innerHTML = "";
  BAITS.forEach(bait => {
    const div = document.createElement("div");
    div.className = "bestiary-entry";
    const name = document.createElement("div");
    name.className = "bestiary-entry-name";
    name.textContent = bait.name;
    name.style.color = rarityColors[bait.rarity] || "#fff";
    const meta = document.createElement("div");
    meta.className = "bestiary-entry-meta";
    meta.textContent = `${rarityLabel(bait.rarity)} • ${bait.desc}`;
    div.appendChild(name);
    div.appendChild(meta);
    baitList.appendChild(div);
  });
}

function populateToolPanel() {
  if (!toolList) return;
  toolList.innerHTML = "";
  TOOLS.forEach(tool => {
    const div = document.createElement("div");
    div.className = "bestiary-entry";
    const name = document.createElement("div");
    name.className = "bestiary-entry-name";
    name.textContent = tool.name;
    const meta = document.createElement("div");
    meta.className = "bestiary-entry-meta";
    meta.textContent = tool.desc;
    div.appendChild(name);
    div.appendChild(meta);
    toolList.appendChild(div);
  });
}

function populateQuestPanel() {
  if (!questList) return;
  questList.innerHTML = "";
  const placeholder = document.createElement("div");
  placeholder.className = "bestiary-entry-meta";
  placeholder.textContent = "No quests yet. Future NPCs will offer tasks and storylines.";
  questList.appendChild(placeholder);
}

function populateTotemPanel() {
  if (!totemList) return;
  totemList.innerHTML = "";
  TOTEMS.forEach(totem => {
    const div = document.createElement("div");
    div.className = "bestiary-entry";
    const name = document.createElement("div");
    name.className = "bestiary-entry-name";
    name.textContent = totem.name;
    const meta = document.createElement("div");
    meta.className = "bestiary-entry-meta";
    meta.textContent = totem.desc;
    div.appendChild(name);
    div.appendChild(meta);
    totemList.appendChild(div);
  });
}

function populatePotionPanel() {
  if (!potionList) return;
  potionList.innerHTML = "";
  POTIONS.forEach(potion => {
    const div = document.createElement("div");
    div.className = "bestiary-entry";
    const name = document.createElement("div");
    name.className = "bestiary-entry-name";
    name.textContent = potion.name;
    const meta = document.createElement("div");
    meta.className = "bestiary-entry-meta";
    meta.textContent = potion.desc;
    div.appendChild(name);
    div.appendChild(meta);
    potionList.appendChild(div);
  });
}

function populateRelicPanel() {
  if (!relicInfo) return;
  relicInfo.innerHTML = "";
  const name = document.createElement("div");
  name.className = "bestiary-entry-name";
  name.textContent = RELIC.name;
  const meta = document.createElement("div");
  meta.className = "bestiary-entry-meta";
  meta.textContent = RELIC.desc;
  relicInfo.appendChild(name);
  relicInfo.appendChild(meta);
}

function populateUtilityPanel() {
  if (!utilityList) return;
  utilityList.innerHTML = "";
  UTILITIES.forEach(util => {
    const div = document.createElement("div");
    div.className = "bestiary-entry";
    const name = document.createElement("div");
    name.className = "bestiary-entry-name";
    name.textContent = util.name;
    const meta = document.createElement("div");
    meta.className = "bestiary-entry-meta";
    meta.textContent = util.desc;
    div.appendChild(name);
    div.appendChild(meta);
    utilityList.appendChild(div);
  });
}

function populateBestiaryFish() {
  if (!bestiaryFish) return;
  bestiaryFish.innerHTML = "";
  const allRegions = Object.keys(FISH_TABLES);
  allRegions.forEach(regionId => {
    const regionHeader = document.createElement("div");
    regionHeader.className = "bestiary-entry-meta";
    regionHeader.style.marginTop = "4px";
    regionHeader.textContent =
      regionId === "ocean"
        ? "Open Ocean"
        : ISLANDS.find(i => i.id === regionId)?.name || regionId;
    bestiaryFish.appendChild(regionHeader);

    FISH_TABLES[regionId].forEach(fish => {
      const div = document.createElement("div");
      div.className = "bestiary-entry";
      const name = document.createElement("div");
      name.className = "bestiary-entry-name";
      const discovered = discoveredFish.has(fish.name);
      name.textContent = discovered ? fish.name : "???";
      name.style.color = discovered ? (rarityColors[fish.rarity] || "#fff") : "#888";
      const meta = document.createElement("div");
      meta.className = "bestiary-entry-meta";
      meta.textContent = discovered
        ? `${rarityLabel(fish.rarity)} • ${fish.depth} depth`
        : "Undiscovered";
      div.appendChild(name);
      div.appendChild(meta);
      bestiaryFish.appendChild(div);
    });
  });
}

function populateBestiaryRods() {
  if (!bestiaryRods) return;
  bestiaryRods.innerHTML = "";
  RODS.forEach(rod => {
    const div = document.createElement("div");
    div.className = "bestiary-entry";
    const name = document.createElement("div");
    name.className = "bestiary-entry-name";
    const discovered = discoveredRods.has(rod.id);
    name.textContent = discovered ? rod.name : "???";
    name.style.color = discovered ? (rarityColors[rod.rarity] || "#fff") : "#888";
    const meta = document.createElement("div");
    meta.className = "bestiary-entry-meta";
    meta.textContent = discovered
      ? `${rarityLabel(rod.rarity)} • Variant bonus: ${(rod.variantBonus * 100).toFixed(1)}%`
      : "Undiscovered";
    div.appendChild(name);
    div.appendChild(meta);
    bestiaryRods.appendChild(div);
  });
}

function populateBestiaryIslands() {
  if (!bestiaryIslands) return;
  bestiaryIslands.innerHTML = "";
  ISLANDS.forEach(island => {
    const div = document.createElement("div");
    div.className = "bestiary-entry";
    const name = document.createElement("div");
    name.className = "bestiary-entry-name";
    const discovered = discoveredIslands.has(island.id);
    name.textContent = discovered ? island.name : "???";
    name.style.color = discovered ? "#fff" : "#888";
    const meta = document.createElement("div");
    meta.className = "bestiary-entry-meta";
    meta.textContent = discovered ? `Type: ${island.type}` : "Undiscovered";
    div.appendChild(name);
    div.appendChild(meta);
    bestiaryIslands.appendChild(div);
  });
}

function initBestiaryTabs() {
  if (!bestiaryTabs) return;
  const buttons = Array.from(bestiaryTabs.querySelectorAll("button"));
  const sections = {
    fish: bestiaryFish,
    rods: bestiaryRods,
    islands: bestiaryIslands
  };

  function activate(tab) {
    buttons.forEach(btn => {
      if (btn.dataset.tab === tab) btn.classList.add("active");
      else btn.classList.remove("active");
    });
    Object.keys(sections).forEach(key => {
      if (key === tab) sections[key].classList.add("active");
      else sections[key].classList.remove("active");
    });
  }

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      const tab = btn.dataset.tab;
      if (tab === "fish") populateBestiaryFish();
      if (tab === "rods") populateBestiaryRods();
      if (tab === "islands") populateBestiaryIslands();
      activate(tab);
    });
  });

  populateBestiaryFish();
  populateBestiaryRods();
  populateBestiaryIslands();
  activate("fish");
}

// ----------------------
// Day-night cycle
// ----------------------
let dayTime = 0; // 0..1

function updateDayNight(dt) {
  const cycleLength = 240;
  dayTime = (dayTime + dt / cycleLength) % 1;

  const t = Math.sin(dayTime * Math.PI * 2) * 0.5 + 0.5;

  const skyColor = new THREE.Color().lerpColors(nightSkyColor, daySkyColor, t);
  const fogColor = new THREE.Color().lerpColors(nightFogColor, dayFogColor, t);

  renderer.setClearColor(skyColor);
  scene.fog.color.copy(fogColor);

  const sunIntensity = 0.3 + t * 0.9;
  sun.intensity = sunIntensity;
  hemi.intensity = 0.4 + t * 0.6;

  sun.position.set(
    Math.cos(dayTime * Math.PI * 2) * 200,
    150 + Math.sin(dayTime * Math.PI * 2) * 100,
    80
  );
}

// ----------------------
// Main loop
// ----------------------
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
  updateDayNight(dt);

  exoticSpawnTimer += dt;
  if (exoticSpawnTimer > 120 && !exoticActive) {
    exoticSpawnTimer = 0;
    triggerExoticSpawn();
  }

  renderer.render(scene, camera);
  requestAnimationFrame(loop);
}

// ----------------------
// Init
// ----------------------
function init() {
  buildIslands();
  createControlSign();
  createRodMesh();

  populateRodPanel();
  populateBaitPanel();
  populateToolPanel();
  populateQuestPanel();
  populateTotemPanel();
  populatePotionPanel();
  populateRelicPanel();
  populateUtilityPanel();
  initBestiaryTabs();

  window.addEventListener("resize", () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  });

  requestAnimationFrame(loop);
}

init();
