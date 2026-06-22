// Room coordinates mapped from clean AutoCAD exports (1600x1280 images).
// x,y = center of room as % of image. w,h = room size as % for overlay highlight.

export const FLOOR_PLANS = [
  { id: 'floor8_ic', building: 'ישראל קנדה', floor: 8, oldImage: '/floors/floor8_ic_old.png', newImage: '/floors/floor8_ic_new.png', label: 'קומה 8 — ישראל קנדה' },
  { id: 'floor6_ic', building: 'ישראל קנדה', floor: 6, oldImage: '/floors/floor6_ic_old.png', newImage: '/floors/floor6_ic_new.png', label: 'קומה 6 — ישראל קנדה' },
  { id: 'floor8_acro', building: 'אקרו', floor: 8, oldImage: '/floors/floor8_acro_old.png', newImage: '/floors/floor8_acro_new.png', label: 'קומה 8 — אקרו' },
  { id: 'floor7_acro', building: 'אקרו', floor: 7, oldImage: '/floors/floor7_acro_old.png', newImage: '/floors/floor7_acro_new.png', label: 'קומה 7 — אקרו' },
];

export const ROOM_COORDS = {
  // ═══════════════════════════════════════════════════
  // Floor 8 Israel Canada — rooms around perimeter
  // Top row left→right, then right col top→bottom,
  // then bottom row right→left, then left col bottom→top
  // ═══════════════════════════════════════════════════
  '01A': { x: 8, y: 12, w: 5, h: 8, floor: 'floor8_ic' },
  '02A': { x: 15, y: 7, w: 4, h: 6, floor: 'floor8_ic' },
  '03A': { x: 19, y: 7, w: 4, h: 6, floor: 'floor8_ic' },
  '04A': { x: 26, y: 6, w: 7, h: 7, floor: 'floor8_ic' },
  '05A': { x: 35, y: 7, w: 5, h: 6, floor: 'floor8_ic' },
  '06A': { x: 39, y: 7, w: 5, h: 6, floor: 'floor8_ic' },
  '07A': { x: 45, y: 7, w: 4, h: 6, floor: 'floor8_ic' },
  '08A': { x: 48, y: 7, w: 4, h: 6, floor: 'floor8_ic' },
  // Right side top→bottom
  '09A': { x: 84, y: 5, w: 6, h: 5, floor: 'floor8_ic' },
  '10A': { x: 87, y: 11, w: 9, h: 7, floor: 'floor8_ic' },
  '11A': { x: 91, y: 24, w: 7, h: 7, floor: 'floor8_ic' },
  '12A': { x: 88, y: 46, w: 9, h: 8, floor: 'floor8_ic' },
  '13A': { x: 88, y: 54, w: 9, h: 5, floor: 'floor8_ic' },
  '14A': { x: 87, y: 66, w: 8, h: 8, floor: 'floor8_ic' },
  // Bottom-right cluster
  '15A': { x: 89, y: 77, w: 6, h: 5, floor: 'floor8_ic' },
  '16A': { x: 81, y: 82, w: 4, h: 4, floor: 'floor8_ic' },
  '17A': { x: 86, y: 87, w: 10, h: 7, floor: 'floor8_ic' },
  '18A': { x: 72, y: 82, w: 6, h: 5, floor: 'floor8_ic' },
  // Bottom row right→left
  '19A': { x: 60, y: 79, w: 7, h: 6, floor: 'floor8_ic' },
  '20A': { x: 50, y: 79, w: 8, h: 8, floor: 'floor8_ic' },
  '21A': { x: 40, y: 79, w: 7, h: 6, floor: 'floor8_ic' },
  '22A': { x: 28, y: 80, w: 6, h: 5, floor: 'floor8_ic' },
  '23A': { x: 23, y: 80, w: 5, h: 5, floor: 'floor8_ic' },
  '24A': { x: 14, y: 81, w: 5, h: 5, floor: 'floor8_ic' },
  '25A': { x: 8, y: 75, w: 7, h: 8, floor: 'floor8_ic' },
  // Left side bottom→top
  '26A': { x: 7, y: 58, w: 8, h: 8, floor: 'floor8_ic' },
  '27A': { x: 12, y: 52, w: 5, h: 4, floor: 'floor8_ic' },
  '28A': { x: 6, y: 29, w: 6, h: 8, floor: 'floor8_ic' },

  // ═══════════════════════════════════════════════════
  // Floor 6 Israel Canada — B rooms (top/left) + C rooms (right)
  // ═══════════════════════════════════════════════════
  // B rooms — top area right→left
  '14B': { x: 5, y: 5, w: 8, h: 8, floor: 'floor6_ic' },
  '06B': { x: 42, y: 5, w: 10, h: 7, floor: 'floor6_ic' },
  '07B': { x: 32, y: 8, w: 5, h: 5, floor: 'floor6_ic' },
  '08B': { x: 27, y: 8, w: 5, h: 5, floor: 'floor6_ic' },
  '09B': { x: 19, y: 8, w: 5, h: 5, floor: 'floor6_ic' },
  // B inner rooms
  '10B': { x: 11, y: 17, w: 6, h: 6, floor: 'floor6_ic' },
  '03B': { x: 23, y: 17, w: 5, h: 5, floor: 'floor6_ic' },
  '04B': { x: 29, y: 17, w: 5, h: 5, floor: 'floor6_ic' },
  '05B': { x: 35, y: 17, w: 7, h: 6, floor: 'floor6_ic' },
  '02B': { x: 21, y: 24, w: 5, h: 6, floor: 'floor6_ic' },
  '01B': { x: 30, y: 29, w: 10, h: 8, floor: 'floor6_ic' },
  // B left side
  '11B': { x: 7, y: 27, w: 4, h: 4, floor: 'floor6_ic' },
  '12B': { x: 4, y: 36, w: 5, h: 6, floor: 'floor6_ic' },
  '13B': { x: 10, y: 36, w: 5, h: 6, floor: 'floor6_ic' },

  // C rooms — right side top→bottom
  '07C': { x: 76, y: 23, w: 4, h: 4, floor: 'floor6_ic' },
  '06C': { x: 82, y: 23, w: 4, h: 4, floor: 'floor6_ic' },
  '08C': { x: 79, y: 30, w: 5, h: 4, floor: 'floor6_ic' },
  '05C': { x: 88, y: 33, w: 7, h: 5, floor: 'floor6_ic' },
  '09C': { x: 78, y: 36, w: 5, h: 5, floor: 'floor6_ic' },
  '04C': { x: 87, y: 42, w: 5, h: 5, floor: 'floor6_ic' },
  '03C': { x: 89, y: 48, w: 5, h: 5, floor: 'floor6_ic' },
  '10C': { x: 72, y: 52, w: 7, h: 6, floor: 'floor6_ic' },
  '02C': { x: 84, y: 62, w: 4, h: 4, floor: 'floor6_ic' },
  '01C': { x: 84, y: 67, w: 7, h: 6, floor: 'floor6_ic' },

  // ═══════════════════════════════════════════════════
  // Floor 8 Acro — D rooms
  // Top row right→left, inner block, bottom row, right col
  // ═══════════════════════════════════════════════════
  // Top-right corner
  '21D': { x: 91, y: 6, w: 5, h: 7, floor: 'floor8_acro' },
  '20D': { x: 91, y: 14, w: 5, h: 5, floor: 'floor8_acro' },
  '22D': { x: 83, y: 8, w: 6, h: 7, floor: 'floor8_acro' },
  // Top row right→left
  '23D': { x: 60, y: 6, w: 8, h: 7, floor: 'floor8_acro' },
  '24D': { x: 50, y: 6, w: 7, h: 7, floor: 'floor8_acro' },
  '25D': { x: 40, y: 6, w: 7, h: 7, floor: 'floor8_acro' },
  '26D': { x: 32, y: 7, w: 5, h: 6, floor: 'floor8_acro' },
  '27D': { x: 18, y: 6, w: 8, h: 7, floor: 'floor8_acro' },
  // Left side
  '28D': { x: 8, y: 15, w: 5, h: 5, floor: 'floor8_acro' },
  '29D': { x: 5, y: 24, w: 5, h: 7, floor: 'floor8_acro' },
  // Inner rooms (left of central core)
  '30D': { x: 18, y: 20, w: 5, h: 5, floor: 'floor8_acro' },
  '31D': { x: 23, y: 20, w: 5, h: 5, floor: 'floor8_acro' },
  '32D': { x: 29, y: 20, w: 5, h: 5, floor: 'floor8_acro' },
  '33D': { x: 37, y: 20, w: 6, h: 5, floor: 'floor8_acro' },
  '34D': { x: 45, y: 20, w: 7, h: 5, floor: 'floor8_acro' },
  '36D': { x: 24, y: 28, w: 5, h: 5, floor: 'floor8_acro' },
  '35D': { x: 30, y: 28, w: 5, h: 5, floor: 'floor8_acro' },
  '37D': { x: 12, y: 63, w: 5, h: 5, floor: 'floor8_acro' },
  // Bottom row left→right
  '01D': { x: 7, y: 84, w: 5, h: 8, floor: 'floor8_acro' },
  '02D': { x: 14, y: 84, w: 6, h: 8, floor: 'floor8_acro' },
  '03D': { x: 22, y: 84, w: 6, h: 8, floor: 'floor8_acro' },
  '04D': { x: 30, y: 84, w: 6, h: 8, floor: 'floor8_acro' },
  '05D': { x: 38, y: 84, w: 6, h: 8, floor: 'floor8_acro' },
  '06D': { x: 45, y: 84, w: 6, h: 8, floor: 'floor8_acro' },
  '07D': { x: 53, y: 84, w: 6, h: 8, floor: 'floor8_acro' },
  '08D': { x: 60, y: 84, w: 6, h: 8, floor: 'floor8_acro' },
  // Bottom-right
  '09D': { x: 78, y: 86, w: 4, h: 5, floor: 'floor8_acro' },
  '10D': { x: 83, y: 84, w: 5, h: 5, floor: 'floor8_acro' },
  // Right column bottom→top
  '11D': { x: 90, y: 78, w: 6, h: 5, floor: 'floor8_acro' },
  '12D': { x: 90, y: 72, w: 6, h: 5, floor: 'floor8_acro' },
  '13D': { x: 90, y: 62, w: 7, h: 5, floor: 'floor8_acro' },
  '14D': { x: 90, y: 55, w: 6, h: 5, floor: 'floor8_acro' },
  '15D': { x: 89, y: 48, w: 8, h: 6, floor: 'floor8_acro' },
  '16D': { x: 90, y: 40, w: 5, h: 4, floor: 'floor8_acro' },
  '17D': { x: 91, y: 34, w: 6, h: 5, floor: 'floor8_acro' },
  '18D': { x: 92, y: 25, w: 6, h: 5, floor: 'floor8_acro' },
  '19D': { x: 92, y: 18, w: 5, h: 5, floor: 'floor8_acro' },

  // ═══════════════════════════════════════════════════
  // Floor 7 Acro — E rooms (top rows only)
  // ═══════════════════════════════════════════════════
  // Top row right→left
  '01E': { x: 92, y: 7, w: 5, h: 6, floor: 'floor7_acro' },
  '02E': { x: 84, y: 7, w: 5, h: 6, floor: 'floor7_acro' },
  '03E': { x: 76, y: 7, w: 5, h: 6, floor: 'floor7_acro' },
  '04E': { x: 66, y: 7, w: 6, h: 6, floor: 'floor7_acro' },
  '05E': { x: 57, y: 7, w: 6, h: 6, floor: 'floor7_acro' },
  '06E': { x: 48, y: 7, w: 6, h: 6, floor: 'floor7_acro' },
  '07E': { x: 40, y: 7, w: 5, h: 6, floor: 'floor7_acro' },
  '08E': { x: 32, y: 7, w: 5, h: 6, floor: 'floor7_acro' },
  '09E': { x: 23, y: 7, w: 5, h: 6, floor: 'floor7_acro' },
  // Second row
  '10E': { x: 10, y: 14, w: 5, h: 5, floor: 'floor7_acro' },
  '11E': { x: 13, y: 21, w: 5, h: 5, floor: 'floor7_acro' },
  '12E': { x: 22, y: 21, w: 5, h: 5, floor: 'floor7_acro' },
  '13E': { x: 30, y: 21, w: 5, h: 5, floor: 'floor7_acro' },
  '14E': { x: 87, y: 21, w: 8, h: 6, floor: 'floor7_acro' },
};

export function floorIdForRoom(roomId) {
  if (!roomId) return null;
  const letter = roomId.slice(-1);
  if (letter === 'A') return 'floor8_ic';
  if (letter === 'B' || letter === 'C') return 'floor6_ic';
  if (letter === 'D') return 'floor8_acro';
  if (letter === 'E') return 'floor7_acro';
  return null;
}
