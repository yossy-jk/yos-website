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
}

export interface RoomZone {
  id: string;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

// --- Drawing types ---

export type DrawingToolType =
  | "select"
  | "wall"
  | "door"
  | "window"
  | "glazing"
  | "partition"
  | "column"
  | "eraser";

export type WallType =
  | "gyprock"
  | "glazing"
  | "external"
  | "partition"
  | "existing";

export interface WallSegment {
  id: string;
  points: number[]; // flat array [x1, y1, x2, y2]
  wallType: WallType;
  thickness: number; // pixels
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

// --- Store interface ---

interface PlannerStore {
  // Existing
  items: PlannerItem[];
  zones: RoomZone[];
  selectedId: string | null;
  floorPlanImage: string | null;
  roomTemplate: string | null;
  snapToGrid: boolean;
  scale: number;
  addItem: (item: Omit<PlannerItem, "id">) => void;
  updateItem: (id: string, updates: Partial<PlannerItem>) => void;
  removeItem: (id: string) => void;
  clearAll: () => void;
  setSelected: (id: string | null) => void;
  setFloorPlan: (src: string | null) => void;
  setRoomTemplate: (template: string | null) => void;
  toggleSnap: () => void;
  addZone: (zone: Omit<RoomZone, "id">) => void;
  removeZone: (id: string) => void;

  // Drawing tools
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

export const usePlannerStore = create<PlannerStore>((set) => ({
  // --- Existing defaults ---
  items: [],
  zones: [],
  selectedId: null,
  floorPlanImage: null,
  roomTemplate: null,
  snapToGrid: true,
  scale: 50,

  addItem: (item) =>
    set((state) => ({
      items: [...state.items, { ...item, id: nanoid() }],
    })),

  updateItem: (id, updates) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, ...updates } : item
      ),
    })),

  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
      selectedId: state.selectedId === id ? null : state.selectedId,
    })),

  clearAll: () =>
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
    }),

  setSelected: (id) => set({ selectedId: id }),

  setFloorPlan: (src) => set({ floorPlanImage: src, roomTemplate: null }),

  setRoomTemplate: (template) =>
    set({ roomTemplate: template, floorPlanImage: null }),

  toggleSnap: () => set((state) => ({ snapToGrid: !state.snapToGrid })),

  addZone: (zone) =>
    set((state) => ({
      zones: [...state.zones, { ...zone, id: nanoid() }],
    })),

  removeZone: (id) =>
    set((state) => ({
      zones: state.zones.filter((z) => z.id !== id),
    })),

  // --- Drawing defaults ---
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
    set((state) => ({
      walls: [...state.walls, { ...wall, id: nanoid() }],
    })),

  removeWall: (id) =>
    set((state) => ({
      walls: state.walls.filter((w) => w.id !== id),
    })),

  addDoor: (door) =>
    set((state) => ({
      doors: [...state.doors, { ...door, id: nanoid() }],
    })),

  removeDoor: (id) =>
    set((state) => ({
      doors: state.doors.filter((d) => d.id !== id),
    })),

  addWindow: (win) =>
    set((state) => ({
      windows: [...state.windows, { ...win, id: nanoid() }],
    })),

  removeWindow: (id) =>
    set((state) => ({
      windows: state.windows.filter((w) => w.id !== id),
    })),

  addColumn: (col) =>
    set((state) => ({
      columns: [...state.columns, { ...col, id: nanoid() }],
    })),

  removeColumn: (id) =>
    set((state) => ({
      columns: state.columns.filter((c) => c.id !== id),
    })),

  setDrawingPoints: (points) => set({ drawingPoints: points }),
}));

export function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    Seating: "#00B5A5",
    Desks: "#1A1A1A",
    Storage: "#9B9B9B",
    Meeting: "#2A4A6B",
    Breakout: "#B5740A",
    Screens: "#6B6B6B",
  };
  return colors[category] ?? "#3D3D3D";
}

export function snapToGridValue(value: number, gridSize: number): number {
  return Math.round(value / gridSize) * gridSize;
}
