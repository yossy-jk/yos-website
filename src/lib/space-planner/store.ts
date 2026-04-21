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

interface PlannerStore {
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
}

export const usePlannerStore = create<PlannerStore>((set) => ({
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
