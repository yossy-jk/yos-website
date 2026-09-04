import { create } from "zustand";
import { nanoid } from "nanoid";

export interface PlannerItem {
  id: string;
  productId: string;
  name: string;
  category: string;
  price: number;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  color: string;
  roomId?: string; // optional room association
}

export interface RoomZone {
  id: string;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export type DrawingToolType = "select" | "wall" | "door" | "window" | "glazing" | "partition" | "column" | "eraser";

export type WallType = "gyprock" | "glazing" | "external" | "partition" | "existing";

export interface WallSegment {
  id: string;
  points: number[];
  wallType: WallType;
  thickness: number;
}

export interface DoorElement {
  id: string;
  x: number;
  y: number;
  width: number;
  rotation: number;
  swingDirection: "left" | "right";
}

export interface WindowElement {
  id: string;
  x: number;
  y: number;
  width: number;
  rotation: number;
}

export interface ColumnElement {
  id: string;
  x: number;
  y: number;
  size: number;
}

// Legacy single-room type
export type LegacyRoomType = "open-plan" | "private-office" | "meeting-room" | "reception" | "custom";

// New multi-room types
export type RoomType = "open-plan" | "private-office" | "small-meeting" | "large-meeting" | "boardroom" | "reception" | "breakout" | "custom";

export interface Room {
  id: string;
  type: RoomType;
  label: string;
  xM: number;   // metres from canvas origin
  yM: number;   // metres from canvas origin
  widthM: number;
  depthM: number;
}

export interface RoomConfig {
  type: LegacyRoomType;
  width: number;  // metres
  depth: number;  // metres
}

// Room presets with suggested furniture pre-placed
// Pixel coords based on PIXELS_PER_METRE = 60
const PPM = 60; // pixels per metre

export interface PresetItem {
  productId: string;
  x: number;
  y: number;
  rotation?: number;
}

export interface RoomPreset {
  name: string;
  defaultSize: { width: number; depth: number };
  suggestedItems: PresetItem[];
}

// Room default dimensions
export const ROOM_TYPE_DEFAULTS: Record<RoomType, { widthM: number; depthM: number; label: string }> = {
  "open-plan":      { widthM: 10, depthM: 8,  label: "Open Plan" },
  "private-office": { widthM: 3,  depthM: 3,  label: "Private Office" },
  "small-meeting":  { widthM: 3,  depthM: 3,  label: "Small Meeting Room" },
  "large-meeting":  { widthM: 6,  depthM: 3,  label: "Large Meeting Room" },
  "boardroom":      { widthM: 8,  depthM: 4,  label: "Boardroom" },
  "reception":      { widthM: 5,  depthM: 4,  label: "Reception" },
  "breakout":       { widthM: 4,  depthM: 3,  label: "Breakout Area" },
  "custom":         { widthM: 5,  depthM: 5,  label: "Room" },
};

// Room type background colours (subtle tints)
export const ROOM_TYPE_COLORS: Record<RoomType, string> = {
  "open-plan":      "#EFF5F0",
  "private-office": "#F0EDE8",
  "small-meeting":  "#E8F4F3",
  "large-meeting":  "#E8F1F8",
  "boardroom":      "#F0EBF4",
  "reception":      "#F5EDE8",
  "breakout":       "#F5F3E8",
  "custom":         "#F5F4F2",
};

export const ROOM_PRESETS: Record<LegacyRoomType, RoomPreset> = {
  "open-plan": {
    name: "Open Plan Office",
    defaultSize: { width: 10, depth: 8 },
    suggestedItems: [
      // Row 1 of workstations
      { productId: "ws1800", x: PPM * 0.5, y: PPM * 0.5 },
      { productId: "chair-task", x: PPM * 0.5 + 60, y: PPM * 0.5 + 75 },
      { productId: "ws1800", x: PPM * 0.5 + 190, y: PPM * 0.5 },
      { productId: "chair-task", x: PPM * 0.5 + 250, y: PPM * 0.5 + 75 },
      { productId: "ws1800", x: PPM * 0.5 + 380, y: PPM * 0.5 },
      { productId: "chair-task", x: PPM * 0.5 + 440, y: PPM * 0.5 + 75 },
      // Row 2
      { productId: "ws1800", x: PPM * 0.5, y: PPM * 0.5 + 200, rotation: 180 },
      { productId: "chair-task", x: PPM * 0.5 + 60, y: PPM * 0.5 + 130 },
      { productId: "ws1800", x: PPM * 0.5 + 190, y: PPM * 0.5 + 200, rotation: 180 },
      { productId: "chair-task", x: PPM * 0.5 + 250, y: PPM * 0.5 + 130 },
      // Meeting table
      { productId: "mtable2400", x: PPM * 5.5, y: PPM * 1.5 },
      { productId: "chair-meeting", x: PPM * 5.5 + 30, y: PPM * 1.5 - 65 },
      { productId: "chair-meeting", x: PPM * 5.5 + 110, y: PPM * 1.5 - 65 },
      { productId: "chair-meeting", x: PPM * 5.5 + 190, y: PPM * 1.5 - 65 },
      { productId: "chair-meeting", x: PPM * 5.5 + 30, y: PPM * 1.5 + 105, rotation: 180 },
      { productId: "chair-meeting", x: PPM * 5.5 + 110, y: PPM * 1.5 + 105, rotation: 180 },
      { productId: "chair-meeting", x: PPM * 5.5 + 190, y: PPM * 1.5 + 105, rotation: 180 },
    ],
  },
  "private-office": {
    name: "Private Office",
    defaultSize: { width: 3, depth: 3 },
    suggestedItems: [
      { productId: "desk1600", x: PPM * 0.3, y: PPM * 0.3 },
      { productId: "chair-executive", x: PPM * 0.3 + 45, y: PPM * 0.3 + 70 },
      { productId: "chair-visitor", x: PPM * 0.3 + 10, y: PPM * 1.8 },
      { productId: "chair-visitor", x: PPM * 0.3 + 80, y: PPM * 1.8 },
      { productId: "storage2d", x: PPM * 1.8, y: PPM * 0.2 },
    ],
  },
  "meeting-room": {
    name: "Meeting Room",
    defaultSize: { width: 7, depth: 5 },
    suggestedItems: [
      { productId: "mtable3600", x: PPM * 0.5, y: PPM * 1.5 },
      { productId: "chair-meeting", x: PPM * 0.5 + 30, y: PPM * 1.5 - 65 },
      { productId: "chair-meeting", x: PPM * 0.5 + 110, y: PPM * 1.5 - 65 },
      { productId: "chair-meeting", x: PPM * 0.5 + 190, y: PPM * 1.5 - 65 },
      { productId: "chair-meeting", x: PPM * 0.5 + 270, y: PPM * 1.5 - 65 },
      { productId: "chair-meeting", x: PPM * 0.5 + 30, y: PPM * 1.5 + 125, rotation: 180 },
      { productId: "chair-meeting", x: PPM * 0.5 + 110, y: PPM * 1.5 + 125, rotation: 180 },
      { productId: "chair-meeting", x: PPM * 0.5 + 190, y: PPM * 1.5 + 125, rotation: 180 },
      { productId: "chair-meeting", x: PPM * 0.5 + 270, y: PPM * 1.5 + 125, rotation: 180 },
      { productId: "chair-meeting", x: PPM * 0.5 - 65, y: PPM * 1.5 + 40, rotation: 90 },
      { productId: "chair-meeting", x: PPM * 0.5 + 370, y: PPM * 1.5 + 40, rotation: 270 },
    ],
  },
  "reception": {
    name: "Reception",
    defaultSize: { width: 8, depth: 6 },
    suggestedItems: [
      { productId: "reception-desk", x: PPM * 0.5, y: PPM * 0.5 },
      { productId: "chair-task", x: PPM * 0.5 + 60, y: PPM * 0.5 + 80 },
      { productId: "lounge-2seat", x: PPM * 4.0, y: PPM * 0.8 },
      { productId: "lounge-2seat", x: PPM * 4.0, y: PPM * 2.5 },
      { productId: "coffee-table", x: PPM * 4.5, y: PPM * 1.8 },
      { productId: "chair-lounge", x: PPM * 6.0, y: PPM * 0.8 },
      { productId: "chair-lounge", x: PPM * 6.0, y: PPM * 2.5 },
    ],
  },
  "custom": {
    name: "Custom",
    defaultSize: { width: 8, depth: 6 },
    suggestedItems: [],
  },
};

// --- EOF Product Catalogue ---
export interface EOFProduct {
  id: string;
  name: string;
  category: string;
  width: number;  // cm
  depth: number;  // cm
  silhouetteType: "chair-task" | "chair-executive" | "chair-meeting" | "chair-visitor" | "chair-lounge" | "desk" | "meeting-table" | "round-table" | "storage" | "screen" | "sofa-2" | "sofa-3" | "coffee-table" | "reception-desk" | "lounge-chair";
}

export const EOF_PRODUCTS: EOFProduct[] = [
  // Seating
  { id: "chair-task", name: "Task Chair", category: "Seating", width: 60, depth: 60, silhouetteType: "chair-task" },
  { id: "chair-executive", name: "Executive Chair", category: "Seating", width: 70, depth: 70, silhouetteType: "chair-executive" },
  { id: "chair-meeting", name: "Meeting Chair", category: "Seating", width: 55, depth: 55, silhouetteType: "chair-meeting" },
  { id: "chair-visitor", name: "Visitor Chair", category: "Seating", width: 55, depth: 55, silhouetteType: "chair-visitor" },
  // Desks
  { id: "ws1800", name: "Workstation 1800", category: "Desks", width: 180, depth: 75, silhouetteType: "desk" },
  { id: "ws1500", name: "Workstation 1500", category: "Desks", width: 150, depth: 75, silhouetteType: "desk" },
  { id: "desk1800", name: "Height Adjust Desk 1800", category: "Desks", width: 180, depth: 80, silhouetteType: "desk" },
  { id: "desk1600", name: "Height Adjust Desk 1600", category: "Desks", width: 160, depth: 80, silhouetteType: "desk" },
  // Meeting
  { id: "mtable3600", name: "Meeting Table 3600 (12 person)", category: "Meeting", width: 360, depth: 120, silhouetteType: "meeting-table" },
  { id: "mtable2400", name: "Meeting Table 2400 (8 person)", category: "Meeting", width: 240, depth: 100, silhouetteType: "meeting-table" },
  { id: "mtable1800", name: "Meeting Table 1800 (6 person)", category: "Meeting", width: 180, depth: 90, silhouetteType: "meeting-table" },
  { id: "round-table", name: "Round Table 1200", category: "Meeting", width: 120, depth: 120, silhouetteType: "round-table" },
  // Storage
  { id: "storage3d", name: "Mobile Pedestal 3-Drawer", category: "Storage", width: 40, depth: 50, silhouetteType: "storage" },
  { id: "storage2d", name: "Lateral Filing 2-Drawer", category: "Storage", width: 90, depth: 50, silhouetteType: "storage" },
  { id: "storage-tall", name: "Tall Storage Cabinet", category: "Storage", width: 90, depth: 45, silhouetteType: "storage" },
  // Breakout
  { id: "chair-lounge", name: "Lounge Chair", category: "Breakout", width: 75, depth: 75, silhouetteType: "chair-lounge" },
  { id: "lounge-2seat", name: "Lounge Sofa 2-Seat", category: "Breakout", width: 150, depth: 80, silhouetteType: "sofa-2" },
  { id: "lounge-3seat", name: "Lounge Sofa 3-Seat", category: "Breakout", width: 210, depth: 80, silhouetteType: "sofa-3" },
  { id: "coffee-table", name: "Coffee Table", category: "Breakout", width: 100, depth: 60, silhouetteType: "coffee-table" },
  // Reception
  { id: "reception-desk", name: "Reception Desk", category: "Seating", width: 180, depth: 75, silhouetteType: "reception-desk" },
  // Screens
  { id: "screen1200", name: "Acoustic Screen 1200", category: "Screens", width: 120, depth: 5, silhouetteType: "screen" },
  { id: "screen1800", name: "Acoustic Screen 1800", category: "Screens", width: 180, depth: 5, silhouetteType: "screen" },
];

// --- Store interface ---
interface PlannerStore {
  // Step/flow
  step: 1 | 2 | 3;
  roomConfig: RoomConfig;
  setStep: (step: 1 | 2 | 3) => void;
  setRoomConfig: (config: RoomConfig) => void;

  // Multi-room system
  rooms: Room[];
  canvasWidthM: number;   // floor plate width, default 20
  canvasDepthM: number;   // floor plate depth, default 15
  selectedRoomId: string | null;
  addRoom: (type: RoomType, widthM: number, depthM: number, label: string) => void;
  updateRoom: (id: string, updates: Partial<Room>) => void;
  removeRoom: (id: string) => void;
  setSelectedRoom: (id: string | null) => void;
  clearRooms: () => void;
  setCanvasSize: (widthM: number, depthM: number) => void;

  // Items
  items: PlannerItem[];
  zones: RoomZone[];
  selectedId: string | null;
  floorPlanImage: string | null;
  roomTemplate: string | null;
  snapToGrid: boolean;
  scale: number;

  // Undo/redo
  history: PlannerItem[][];
  historyIndex: number;
  undo: () => void;
  redo: () => void;
  pushHistory: () => void;

  addItem: (item: Omit<PlannerItem, "id">) => void;
  updateItem: (id: string, updates: Partial<PlannerItem>) => void;
  removeItem: (id: string) => void;
  duplicateItem: (id: string) => void;
  rotateItem: (id: string) => void;
  clearAll: () => void;
  setSelected: (id: string | null) => void;
  setFloorPlan: (src: string | null) => void;
  setRoomTemplate: (template: string | null) => void;
  toggleSnap: () => void;
  addZone: (zone: Omit<RoomZone, "id">) => void;
  removeZone: (id: string) => void;
  applyPreset: (roomType: LegacyRoomType) => void;

  // Drawing tools (kept for compatibility)
  activeTool: DrawingToolType;
  activeWallType: WallType;
  walls: WallSegment[];
  doors: DoorElement[];
  windows: WindowElement[];
  columns: ColumnElement[];
  drawingPoints: number[];

  setActiveTool: (tool: DrawingToolType) => void;
  setActiveWallType: (type: WallType) => void;
  addWall: (wall: Omit<WallSegment, "id">) => void;
  removeWall: (id: string) => void;
  addDoor: (door: Omit<DoorElement, "id">) => void;
  removeDoor: (id: string) => void;
  addWindow: (win: Omit<WindowElement, "id">) => void;
  removeWindow: (id: string) => void;
  addColumn: (col: Omit<ColumnElement, "id">) => void;
  removeColumn: (id: string) => void;
  setDrawingPoints: (points: number[]) => void;
}

const MAX_HISTORY = 50;

// Helper: auto-place rooms without overlap
function findNextRoomPosition(
  rooms: Room[],
  newRoom: { widthM: number; depthM: number },
  canvasWidthM: number
): { xM: number; yM: number } {
  if (rooms.length === 0) return { xM: 0, yM: 0 };

  // Try packing rooms left-to-right, wrapping when needed
  // Sort rooms by row then column
  let curX = 0;
  const curY = 0;
  let rowMaxDepth = 0;

  // Find the right-most extent of rooms on the last row
  // Simple approach: try to place after last room in a row
  for (const room of rooms) {
    const roomRight = room.xM + room.widthM;
    const roomBottom = room.yM + room.depthM;
    if (room.yM >= curY) {
      if (roomRight > curX) curX = roomRight;
      if (roomBottom - curY > rowMaxDepth) rowMaxDepth = roomBottom - curY;
    }
  }

  // Check if it fits on current row
  if (curX + newRoom.widthM <= canvasWidthM) {
    return { xM: curX, yM: curY };
  }

  // Wrap to next row
  const nextY = curY + rowMaxDepth;
  return { xM: 0, yM: nextY };
}

export const usePlannerStore = create<PlannerStore>((set, get) => ({
  // Step/flow defaults
  step: 1,
  roomConfig: { type: "open-plan", width: 10, depth: 8 },
  setStep: (step) => set({ step }),
  setRoomConfig: (roomConfig) => set({ roomConfig }),

  // Multi-room system
  rooms: [],
  canvasWidthM: 20,
  canvasDepthM: 15,
  selectedRoomId: null,

  addRoom: (type, widthM, depthM, label) => {
    const { rooms, canvasWidthM } = get();
    const pos = findNextRoomPosition(rooms, { widthM, depthM }, canvasWidthM);
    const newRoom: Room = {
      id: nanoid(),
      type,
      label,
      xM: pos.xM,
      yM: pos.yM,
      widthM,
      depthM,
    };
    set((state) => ({ rooms: [...state.rooms, newRoom] }));
  },

  updateRoom: (id, updates) => {
    set((state) => ({
      rooms: state.rooms.map((r) => r.id === id ? { ...r, ...updates } : r),
    }));
  },

  removeRoom: (id) => {
    set((state) => ({
      rooms: state.rooms.filter((r) => r.id !== id),
      selectedRoomId: state.selectedRoomId === id ? null : state.selectedRoomId,
    }));
  },

  setSelectedRoom: (id) => set({ selectedRoomId: id }),

  clearRooms: () => set({ rooms: [], selectedRoomId: null }),

  setCanvasSize: (widthM, depthM) => set({ canvasWidthM: widthM, canvasDepthM: depthM }),

  // Existing defaults
  items: [],
  zones: [],
  selectedId: null,
  floorPlanImage: null,
  roomTemplate: null,
  snapToGrid: true,
  scale: 50,

  // Undo/redo
  history: [[]],
  historyIndex: 0,

  pushHistory: () => {
    const { items, history, historyIndex } = get();
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(JSON.parse(JSON.stringify(items)));
    if (newHistory.length > MAX_HISTORY) newHistory.shift();
    set({ history: newHistory, historyIndex: Math.min(newHistory.length - 1, MAX_HISTORY - 1) });
  },

  undo: () => {
    const { history, historyIndex } = get();
    if (historyIndex <= 0) return;
    const newIndex = historyIndex - 1;
    set({ items: JSON.parse(JSON.stringify(history[newIndex])), historyIndex: newIndex, selectedId: null });
  },

  redo: () => {
    const { history, historyIndex } = get();
    if (historyIndex >= history.length - 1) return;
    const newIndex = historyIndex + 1;
    set({ items: JSON.parse(JSON.stringify(history[newIndex])), historyIndex: newIndex, selectedId: null });
  },

  addItem: (item) => {
    get().pushHistory();
    set((state) => ({
      items: [...state.items, { ...item, id: nanoid() }],
    }));
  },

  updateItem: (id, updates) => {
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, ...updates } : item
      ),
    }));
  },

  removeItem: (id) => {
    get().pushHistory();
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
      selectedId: state.selectedId === id ? null : state.selectedId,
    }));
  },

  duplicateItem: (id) => {
    const { items } = get();
    const item = items.find((i) => i.id === id);
    if (!item) return;
    get().pushHistory();
    const newItem: PlannerItem = { ...item, id: nanoid(), x: item.x + 20, y: item.y + 20 };
    set((state) => ({ items: [...state.items, newItem], selectedId: newItem.id }));
  },

  rotateItem: (id) => {
    const { items } = get();
    const item = items.find((i) => i.id === id);
    if (!item) return;
    get().pushHistory();
    set((state) => ({
      items: state.items.map((i) =>
        i.id === id ? { ...i, rotation: (i.rotation + 90) % 360 } : i
      ),
    }));
  },

  clearAll: () => {
    get().pushHistory();
    set({
      items: [],
      zones: [],
      selectedId: null,
      floorPlanImage: null,
      roomTemplate: null,
      walls: [],
      doors: [],
      windows: [],
      columns: [],
      drawingPoints: [],
    });
  },

  setSelected: (id) => set({ selectedId: id }),
  setFloorPlan: (src) => set({ floorPlanImage: src, roomTemplate: null }),
  setRoomTemplate: (template) => set({ roomTemplate: template, floorPlanImage: null }),
  toggleSnap: () => set((state) => ({ snapToGrid: !state.snapToGrid })),

  addZone: (zone) =>
    set((state) => ({ zones: [...state.zones, { ...zone, id: nanoid() }] })),
  removeZone: (id) =>
    set((state) => ({ zones: state.zones.filter((z) => z.id !== id) })),

  applyPreset: (roomType) => {
    const preset = ROOM_PRESETS[roomType];
    if (!preset) return;
    get().pushHistory();
    const PIXELS_PER_CM = 0.5;
    const newItems: PlannerItem[] = preset.suggestedItems.map((si) => {
      const product = EOF_PRODUCTS.find((p) => p.id === si.productId);
      if (!product) return null;
      return {
        id: nanoid(),
        productId: product.id,
        name: product.name,
        category: product.category,
        price: 0,
        x: si.x,
        y: si.y,
        width: product.width * PIXELS_PER_CM,
        height: product.depth * PIXELS_PER_CM,
        rotation: si.rotation ?? 0,
        color: getCategoryColor(product.category),
      };
    }).filter(Boolean) as PlannerItem[];
    set({ items: newItems, selectedId: null });
  },

  // Drawing defaults
  activeTool: "select",
  activeWallType: "gyprock",
  walls: [],
  doors: [],
  windows: [],
  columns: [],
  drawingPoints: [],

  setActiveTool: (tool) => set({ activeTool: tool }),
  setActiveWallType: (type) => set({ activeWallType: type }),

  addWall: (wall) =>
    set((state) => ({ walls: [...state.walls, { ...wall, id: nanoid() }] })),
  removeWall: (id) =>
    set((state) => ({ walls: state.walls.filter((w) => w.id !== id) })),
  addDoor: (door) =>
    set((state) => ({ doors: [...state.doors, { ...door, id: nanoid() }] })),
  removeDoor: (id) =>
    set((state) => ({ doors: state.doors.filter((d) => d.id !== id) })),
  addWindow: (win) =>
    set((state) => ({ windows: [...state.windows, { ...win, id: nanoid() }] })),
  removeWindow: (id) =>
    set((state) => ({ windows: state.windows.filter((w) => w.id !== id) })),
  addColumn: (col) =>
    set((state) => ({ columns: [...state.columns, { ...col, id: nanoid() }] })),
  removeColumn: (id) =>
    set((state) => ({ columns: state.columns.filter((c) => c.id !== id) })),
  setDrawingPoints: (points) => set({ drawingPoints: points }),
}));

export function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    Seating: "#00B5A5",
    Desks: "#2A4A6B",
    Storage: "#6B6B6B",
    Meeting: "#1A6B4A",
    Breakout: "#B5740A",
    Screens: "#9B4A9B",
  };
  return colors[category] ?? "#3D3D3D";
}

export function snapToGridValue(value: number, gridSize: number): number {
  return Math.round(value / gridSize) * gridSize;
}
