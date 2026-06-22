// Room coordinates — center of each room as % of image.
// Calibrated via drag-to-position tool by user.

const base = import.meta.env.BASE_URL;

export const FLOOR_PLANS = [
  { id: 'floor8_ic', building: 'ישראל קנדה', floor: 8, oldImage: `${base}floors/floor8_ic_old.png`, newImage: `${base}floors/floor8_ic_new.png`, label: 'קומה 8 — ישראל קנדה' },
  { id: 'floor6_ic', building: 'ישראל קנדה', floor: 6, oldImage: `${base}floors/floor6_ic_old.png`, newImage: `${base}floors/floor6_ic_new.png`, label: 'קומה 6 — ישראל קנדה' },
  { id: 'floor8_acro', building: 'אקרו', floor: 8, oldImage: `${base}floors/floor8_acro_old.png`, newImage: `${base}floors/floor8_acro_new.png`, label: 'קומה 8 — אקרו' },
  { id: 'floor7_acro', building: 'אקרו', floor: 7, oldImage: `${base}floors/floor7_acro_old.png`, newImage: `${base}floors/floor7_acro_new.png`, label: 'קומה 7 — אקרו' },
];

export const ROOM_COORDS = {
  '01A': { x: 20, y: 7, w: 7, h: 7, floor: 'floor8_ic' },
  '02A': { x: 30, y: 7, w: 5, h: 6, floor: 'floor8_ic' },
  '03A': { x: 40, y: 7, w: 5, h: 6, floor: 'floor8_ic' },
  '04A': { x: 49, y: 7, w: 6, h: 6, floor: 'floor8_ic' },
  '05A': { x: 55.5, y: 7, w: 5, h: 6, floor: 'floor8_ic' },
  '06A': { x: 62, y: 7, w: 5, h: 6, floor: 'floor8_ic' },
  '07A': { x: 68, y: 7, w: 5, h: 6, floor: 'floor8_ic' },
  '08A': { x: 75, y: 7, w: 5, h: 6, floor: 'floor8_ic' },
  '09A': { x: 83, y: 7, w: 6, h: 6, floor: 'floor8_ic' },
  '10A': { x: 83, y: 22, w: 6, h: 7, floor: 'floor8_ic' },
  '11A': { x: 83, y: 30, w: 6, h: 5, floor: 'floor8_ic' },
  '12A': { x: 79, y: 63, w: 8, h: 5, floor: 'floor8_ic' },
  '13A': { x: 79, y: 71, w: 8, h: 4, floor: 'floor8_ic' },
  '14A': { x: 79, y: 80, w: 5, h: 4, floor: 'floor8_ic' },
  '15A': { x: 85, y: 80, w: 5, h: 4, floor: 'floor8_ic' },
  '18A': { x: 72, y: 90, w: 5, h: 4, floor: 'floor8_ic' },
  '19A': { x: 72, y: 83, w: 4, h: 4, floor: 'floor8_ic' },
  '16A': { x: 77, y: 92, w: 4, h: 4, floor: 'floor8_ic' },
  '17A': { x: 86, y: 91, w: 6, h: 5, floor: 'floor8_ic' },
  '20A': { x: 65, y: 90, w: 7, h: 6, floor: 'floor8_ic' },
  '21A': { x: 52, y: 90, w: 6, h: 4, floor: 'floor8_ic' },
  '22A': { x: 39, y: 88, w: 6, h: 4, floor: 'floor8_ic' },
  '23A': { x: 32, y: 88, w: 5, h: 4, floor: 'floor8_ic' },
  '24A': { x: 17, y: 90, w: 5, h: 4, floor: 'floor8_ic' },
  '25A': { x: 17, y: 77, w: 6, h: 6, floor: 'floor8_ic' },
  '26A': { x: 17, y: 66, w: 6, h: 6, floor: 'floor8_ic' },
  '27A': { x: 17, y: 58, w: 6, h: 5, floor: 'floor8_ic' },
  '28A': { x: 17, y: 42, w: 7, h: 7, floor: 'floor8_ic' },
  '14B': { x: 18, y: 5, w: 6, h: 6, floor: 'floor6_ic' },
  '09B': { x: 25, y: 5, w: 5, h: 5, floor: 'floor6_ic' },
  '08B': { x: 32, y: 5, w: 6, h: 6, floor: 'floor6_ic' },
  '07B': { x: 38, y: 5, w: 7, h: 6, floor: 'floor6_ic' },
  '06B': { x: 44.5, y: 5, w: 8, h: 6, floor: 'floor6_ic' },
  '11B': { x: 16, y: 24, w: 5, h: 4, floor: 'floor6_ic' },
  '10B': { x: 22, y: 24, w: 5, h: 4, floor: 'floor6_ic' },
  '03B': { x: 32, y: 22, w: 5, h: 5, floor: 'floor6_ic' },
  '04B': { x: 38, y: 22, w: 6, h: 5, floor: 'floor6_ic' },
  '05B': { x: 45, y: 22, w: 7, h: 6, floor: 'floor6_ic' },
  '02B': { x: 32, y: 28, w: 5, h: 4, floor: 'floor6_ic' },
  '01B': { x: 33, y: 34, w: 8, h: 5, floor: 'floor6_ic' },
  '12B': { x: 16, y: 30, w: 4, h: 4, floor: 'floor6_ic' },
  '13B': { x: 22, y: 30, w: 4, h: 4, floor: 'floor6_ic' },
  '07C': { x: 83, y: 32, w: 4, h: 4, floor: 'floor6_ic' },
  '06C': { x: 87, y: 32, w: 4, h: 4, floor: 'floor6_ic' },
  '08C': { x: 76, y: 38, w: 5, h: 4, floor: 'floor6_ic' },
  '05C': { x: 86, y: 39, w: 5, h: 4, floor: 'floor6_ic' },
  '09C': { x: 73, y: 45, w: 6, h: 4, floor: 'floor6_ic' },
  '04C': { x: 86, y: 47, w: 5, h: 4, floor: 'floor6_ic' },
  '10C': { x: 73, y: 52, w: 6, h: 4, floor: 'floor6_ic' },
  '03C': { x: 84, y: 55, w: 5, h: 4, floor: 'floor6_ic' },
  '02C': { x: 84, y: 60, w: 6, h: 5, floor: 'floor6_ic' },
  '01C': { x: 84, y: 68, w: 7, h: 5, floor: 'floor6_ic' },
  '27D': { x: 26, y: 7, w: 7, h: 5, floor: 'floor8_acro' },
  '26D': { x: 31, y: 7, w: 5, h: 5, floor: 'floor8_acro' },
  '25D': { x: 37, y: 7, w: 5, h: 5, floor: 'floor8_acro' },
  '24D': { x: 44, y: 7, w: 6, h: 5, floor: 'floor8_acro' },
  '23D': { x: 50, y: 7, w: 7, h: 5, floor: 'floor8_acro' },
  '22D': { x: 76, y: 6, w: 7, h: 5, floor: 'floor8_acro' },
  '21D': { x: 83, y: 7, w: 6, h: 5, floor: 'floor8_acro' },
  '28D': { x: 19, y: 19, w: 5, h: 4, floor: 'floor8_acro' },
  '29D': { x: 21, y: 35, w: 5, h: 5, floor: 'floor8_acro' },
  '30D': { x: 30, y: 25, w: 5, h: 4, floor: 'floor8_acro' },
  '31D': { x: 35, y: 25, w: 5, h: 4, floor: 'floor8_acro' },
  '32D': { x: 41, y: 24, w: 5, h: 4, floor: 'floor8_acro' },
  '33D': { x: 47, y: 23, w: 5, h: 4, floor: 'floor8_acro' },
  '34D': { x: 52, y: 23, w: 6, h: 4, floor: 'floor8_acro' },
  '36D': { x: 31, y: 32, w: 5, h: 4, floor: 'floor8_acro' },
  '35D': { x: 39, y: 32, w: 6, h: 4, floor: 'floor8_acro' },
  '37D': { x: 18, y: 68, w: 5, h: 4, floor: 'floor8_acro' },
  '20D': { x: 83, y: 15, w: 5, h: 4, floor: 'floor8_acro' },
  '19D': { x: 83, y: 23, w: 5, h: 4, floor: 'floor8_acro' },
  '18D': { x: 83, y: 31, w: 5, h: 4, floor: 'floor8_acro' },
  '17D': { x: 83, y: 37, w: 5, h: 4, floor: 'floor8_acro' },
  '16D': { x: 83, y: 43, w: 5, h: 4, floor: 'floor8_acro' },
  '15D': { x: 83, y: 49, w: 6, h: 5, floor: 'floor8_acro' },
  '14D': { x: 83, y: 56, w: 5, h: 4, floor: 'floor8_acro' },
  '13D': { x: 83, y: 64, w: 5, h: 4, floor: 'floor8_acro' },
  '12D': { x: 83, y: 72, w: 5, h: 4, floor: 'floor8_acro' },
  '11D': { x: 83, y: 79, w: 5, h: 4, floor: 'floor8_acro' },
  '01D': { x: 20, y: 87, w: 5, h: 6, floor: 'floor8_acro' },
  '02D': { x: 31, y: 87, w: 5, h: 6, floor: 'floor8_acro' },
  '03D': { x: 37, y: 87, w: 5, h: 6, floor: 'floor8_acro' },
  '04D': { x: 43, y: 87, w: 5, h: 6, floor: 'floor8_acro' },
  '05D': { x: 50, y: 87, w: 5, h: 6, floor: 'floor8_acro' },
  '06D': { x: 56, y: 87, w: 5, h: 6, floor: 'floor8_acro' },
  '07D': { x: 63, y: 87, w: 5, h: 6, floor: 'floor8_acro' },
  '08D': { x: 69, y: 87, w: 5, h: 6, floor: 'floor8_acro' },
  '09D': { x: 76, y: 91, w: 4, h: 4, floor: 'floor8_acro' },
  '10D': { x: 83, y: 88, w: 5, h: 4, floor: 'floor8_acro' },
  '10E': { x: 19, y: 11, w: 6, h: 5, floor: 'floor7_acro' },
  '09E': { x: 29, y: 8, w: 5, h: 5, floor: 'floor7_acro' },
  '08E': { x: 37, y: 8, w: 5, h: 5, floor: 'floor7_acro' },
  '07E': { x: 44, y: 8, w: 5, h: 5, floor: 'floor7_acro' },
  '06E': { x: 50, y: 8, w: 6, h: 5, floor: 'floor7_acro' },
  '05E': { x: 58, y: 8, w: 6, h: 5, floor: 'floor7_acro' },
  '04E': { x: 65, y: 8, w: 5, h: 5, floor: 'floor7_acro' },
  '03E': { x: 71, y: 8, w: 5, h: 5, floor: 'floor7_acro' },
  '02E': { x: 78, y: 8, w: 5, h: 5, floor: 'floor7_acro' },
  '01E': { x: 83, y: 8, w: 5, h: 5, floor: 'floor7_acro' },
  '11E': { x: 19, y: 23, w: 5, h: 5, floor: 'floor7_acro' },
  '12E': { x: 34, y: 24, w: 5, h: 5, floor: 'floor7_acro' },
  '13E': { x: 40, y: 24, w: 5, h: 5, floor: 'floor7_acro' },
  '14E': { x: 73, y: 25, w: 8, h: 5, floor: 'floor7_acro' },
};

// Normalize room ID: '01B' → '1B', '07A' stays '07A' if that's the canonical key
function normalizeRoomId(roomId) {
  if (!roomId) return roomId;
  return roomId.replace(/^0+/, '') || roomId;
}

// Build a lookup that works with both '01B' and '1B'
export const ROOM_LOOKUP = {};
for (const [key, val] of Object.entries(ROOM_COORDS)) {
  ROOM_LOOKUP[key] = val;
  const alt = normalizeRoomId(key);
  if (alt !== key) ROOM_LOOKUP[alt] = val;
}

export function getRoomCoords(roomId) {
  return ROOM_LOOKUP[roomId] || ROOM_LOOKUP[normalizeRoomId(roomId)] || null;
}

export function floorIdForRoom(roomId) {
  if (!roomId) return null;
  const coords = getRoomCoords(roomId);
  if (coords) return coords.floor;
  const letter = roomId.slice(-1);
  if (letter === 'A') return 'floor8_ic';
  if (letter === 'B' || letter === 'C') return 'floor6_ic';
  if (letter === 'D') return 'floor8_acro';
  if (letter === 'E') return 'floor7_acro';
  return null;
}
