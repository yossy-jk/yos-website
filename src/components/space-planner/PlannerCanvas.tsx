"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import {
  Stage,
  Layer,
  Rect,
  Line,
  Circle,
  Text,
  Group,
  Transformer,
} from "react-konva";
import Konva from "konva";
import {
  usePlannerStore,
  snapToGridValue,
  type PlannerItem,
  type EOFProduct,
  type Room,
  ROOM_TYPE_COLORS,
} from "@/lib/space-planner/store";

const GRID_SIZE = 60; // pixels — 1 grid cell = 1 metre at 1:1
const PIXELS_PER_METRE = 60; // 1m = 60px
const RULER_SIZE = 24; // ruler width/height in px

// ─── Silhouette Renderers ────────────────────────────────────────────────────

interface SilhouetteProps {
  item: PlannerItem;
  isSelected: boolean;
}

function ChairSilhouette({ item, isSelected }: SilhouetteProps) {
  const w = item.width;
  const h = item.height;
  const backH = Math.max(6, h * 0.25);
  const seatH = h - backH;
  const fill = "#00B5A5";
  const darkFill = "#007A70";
  return (
    <Group>
      <Rect width={w} height={seatH} y={backH} fill={fill} cornerRadius={4} />
      <Rect width={w} height={backH} y={0} fill={darkFill} cornerRadius={[4, 4, 0, 0] as unknown as number} />
      <Rect x={4} y={backH + 4} width={w - 8} height={seatH - 8} fill={fill} opacity={0.4} cornerRadius={3} />
      {isSelected && <Rect width={w} height={h} stroke="#FFFFFF" strokeWidth={2} fill="transparent" cornerRadius={4} />}
    </Group>
  );
}

function ExecutiveChairSilhouette({ item, isSelected }: SilhouetteProps) {
  const w = item.width;
  const h = item.height;
  const backH = Math.max(8, h * 0.28);
  const seatH = h - backH;
  const fill = "#2A4A6B";
  const darkFill = "#1A2E45";
  return (
    <Group>
      <Rect width={w} height={seatH} y={backH} fill={fill} cornerRadius={6} />
      <Rect width={w} height={backH} y={0} fill={darkFill} cornerRadius={[6, 6, 0, 0] as unknown as number} />
      <Rect x={-4} y={backH + 4} width={6} height={seatH - 12} fill={darkFill} cornerRadius={2} />
      <Rect x={w - 2} y={backH + 4} width={6} height={seatH - 12} fill={darkFill} cornerRadius={2} />
      {isSelected && <Rect width={w} height={h} stroke="#FFFFFF" strokeWidth={2} fill="transparent" cornerRadius={6} />}
    </Group>
  );
}

function LoungeChairSilhouette({ item, isSelected }: SilhouetteProps) {
  const w = item.width;
  const h = item.height;
  const fill = "#B5740A";
  const darkFill = "#8A5500";
  const armW = Math.max(6, w * 0.1);
  const backH = Math.max(8, h * 0.2);
  return (
    <Group>
      <Rect x={armW} y={backH} width={w - armW * 2} height={h - backH} fill={fill} cornerRadius={4} />
      <Rect x={0} y={backH} width={armW} height={h - backH} fill={darkFill} cornerRadius={[0, 0, 0, 4] as unknown as number} />
      <Rect x={w - armW} y={backH} width={armW} height={h - backH} fill={darkFill} cornerRadius={[0, 0, 4, 0] as unknown as number} />
      <Rect x={0} y={0} width={w} height={backH} fill={darkFill} cornerRadius={[4, 4, 0, 0] as unknown as number} />
      {isSelected && <Rect width={w} height={h} stroke="#FFFFFF" strokeWidth={2} fill="transparent" cornerRadius={4} />}
    </Group>
  );
}

function Sofa2Silhouette({ item, isSelected }: SilhouetteProps) {
  const w = item.width;
  const h = item.height;
  const fill = "#B5740A";
  const darkFill = "#8A5500";
  const armW = Math.max(6, w * 0.06);
  const backH = Math.max(8, h * 0.22);
  const mid = w / 2;
  return (
    <Group>
      <Rect x={armW} y={backH} width={w - armW * 2} height={h - backH} fill={fill} cornerRadius={2} />
      <Line points={[mid, backH, mid, h]} stroke={darkFill} strokeWidth={2} />
      <Rect x={0} y={backH} width={armW} height={h - backH} fill={darkFill} cornerRadius={[0, 0, 0, 3] as unknown as number} />
      <Rect x={w - armW} y={backH} width={armW} height={h - backH} fill={darkFill} cornerRadius={[0, 0, 3, 0] as unknown as number} />
      <Rect x={0} y={0} width={w} height={backH} fill={darkFill} cornerRadius={[4, 4, 0, 0] as unknown as number} />
      {isSelected && <Rect width={w} height={h} stroke="#FFFFFF" strokeWidth={2} fill="transparent" cornerRadius={4} />}
    </Group>
  );
}

function Sofa3Silhouette({ item, isSelected }: SilhouetteProps) {
  const w = item.width;
  const h = item.height;
  const fill = "#B5740A";
  const darkFill = "#8A5500";
  const armW = Math.max(6, w * 0.05);
  const backH = Math.max(8, h * 0.22);
  return (
    <Group>
      <Rect x={armW} y={backH} width={w - armW * 2} height={h - backH} fill={fill} cornerRadius={2} />
      <Line points={[w / 3, backH, w / 3, h]} stroke={darkFill} strokeWidth={2} />
      <Line points={[(w * 2) / 3, backH, (w * 2) / 3, h]} stroke={darkFill} strokeWidth={2} />
      <Rect x={0} y={backH} width={armW} height={h - backH} fill={darkFill} cornerRadius={[0, 0, 0, 3] as unknown as number} />
      <Rect x={w - armW} y={backH} width={armW} height={h - backH} fill={darkFill} cornerRadius={[0, 0, 3, 0] as unknown as number} />
      <Rect x={0} y={0} width={w} height={backH} fill={darkFill} cornerRadius={[4, 4, 0, 0] as unknown as number} />
      {isSelected && <Rect width={w} height={h} stroke="#FFFFFF" strokeWidth={2} fill="transparent" cornerRadius={4} />}
    </Group>
  );
}

function DeskSilhouette({ item, isSelected }: SilhouetteProps) {
  const w = item.width;
  const h = item.height;
  const fill = "#D4C5A0";
  const legSize = 5;
  return (
    <Group>
      <Rect width={w} height={h} fill={fill} cornerRadius={2} stroke="#A89060" strokeWidth={1} />
      <Rect x={4} y={4} width={legSize} height={legSize} fill="#8A7040" />
      <Rect x={w - 4 - legSize} y={4} width={legSize} height={legSize} fill="#8A7040" />
      <Rect x={4} y={h - 4 - legSize} width={legSize} height={legSize} fill="#8A7040" />
      <Rect x={w - 4 - legSize} y={h - 4 - legSize} width={legSize} height={legSize} fill="#8A7040" />
      <Rect x={0} y={h - 4} width={w} height={4} fill="#A89060" cornerRadius={[0, 0, 2, 2] as unknown as number} />
      {isSelected && <Rect width={w} height={h} stroke="#FFFFFF" strokeWidth={2} fill="transparent" cornerRadius={2} />}
    </Group>
  );
}

function MeetingTableSilhouette({ item, isSelected }: SilhouetteProps) {
  const w = item.width;
  const h = item.height;
  const fill = "#E8DCC0";
  return (
    <Group>
      <Rect width={w} height={h} fill={fill} cornerRadius={3} stroke="#C0A870" strokeWidth={1.5} />
      <Rect x={4} y={4} width={w - 8} height={h - 8} fill="transparent" stroke="#C0A870" strokeWidth={0.5} cornerRadius={2} />
      {isSelected && <Rect width={w} height={h} stroke="#FFFFFF" strokeWidth={2} fill="transparent" cornerRadius={3} />}
    </Group>
  );
}

function RoundTableSilhouette({ item, isSelected }: SilhouetteProps) {
  const r = Math.min(item.width, item.height) / 2;
  return (
    <Group x={r} y={r}>
      <Circle radius={r} fill="#E8DCC0" stroke="#C0A870" strokeWidth={1.5} />
      <Circle radius={r - 4} fill="transparent" stroke="#C0A870" strokeWidth={0.5} />
      {isSelected && <Circle radius={r} stroke="#FFFFFF" strokeWidth={2} fill="transparent" />}
    </Group>
  );
}

function StorageSilhouette({ item, isSelected }: SilhouetteProps) {
  const w = item.width;
  const h = item.height;
  const fill = "#9B9B9B";
  const lineColor = "#6B6B6B";
  const drawerH = h / 3;
  return (
    <Group>
      <Rect width={w} height={h} fill={fill} cornerRadius={2} stroke={lineColor} strokeWidth={1} />
      <Line points={[0, drawerH, w, drawerH]} stroke={lineColor} strokeWidth={1} />
      <Line points={[0, drawerH * 2, w, drawerH * 2]} stroke={lineColor} strokeWidth={1} />
      <Rect x={w / 2 - 8} y={drawerH / 2 - 2} width={16} height={4} fill={lineColor} cornerRadius={2} />
      <Rect x={w / 2 - 8} y={drawerH + drawerH / 2 - 2} width={16} height={4} fill={lineColor} cornerRadius={2} />
      <Rect x={w / 2 - 8} y={drawerH * 2 + drawerH / 2 - 2} width={16} height={4} fill={lineColor} cornerRadius={2} />
      {isSelected && <Rect width={w} height={h} stroke="#FFFFFF" strokeWidth={2} fill="transparent" cornerRadius={2} />}
    </Group>
  );
}

function ScreenSilhouette({ item, isSelected }: SilhouetteProps) {
  const w = item.width;
  const h = Math.max(item.height, 16);
  const fill = "#6B3D8B";
  const lineColor = "#4A2A6A";
  const step = Math.max(8, w / 8);
  const diagonals: React.ReactNode[] = [];
  for (let x = -h; x < w + h; x += step) {
    diagonals.push(
      <Line key={x} points={[x, 0, x + h, h]} stroke={lineColor} strokeWidth={1} listening={false} />
    );
  }
  return (
    <Group>
      <Rect width={w} height={h} fill={fill} cornerRadius={2} />
      {diagonals}
      {isSelected && <Rect width={w} height={h} stroke="#FFFFFF" strokeWidth={2} fill="transparent" cornerRadius={2} />}
    </Group>
  );
}

function CoffeeTableSilhouette({ item, isSelected }: SilhouetteProps) {
  const w = item.width;
  const h = item.height;
  const fill = "#C8B890";
  return (
    <Group>
      <Rect width={w} height={h} fill={fill} cornerRadius={6} stroke="#A89060" strokeWidth={1} />
      <Rect x={8} y={8} width={w - 16} height={h - 16} fill="transparent" stroke="#A89060" strokeWidth={0.5} cornerRadius={4} />
      {isSelected && <Rect width={w} height={h} stroke="#FFFFFF" strokeWidth={2} fill="transparent" cornerRadius={6} />}
    </Group>
  );
}

function ReceptionDeskSilhouette({ item, isSelected }: SilhouetteProps) {
  const w = item.width;
  const h = item.height;
  const fill = "#D4C5A0";
  const counterH = Math.max(12, h * 0.3);
  return (
    <Group>
      <Rect width={w} height={h - counterH} fill={fill} cornerRadius={2} stroke="#A89060" strokeWidth={1} />
      <Rect y={h - counterH} width={w} height={counterH} fill="#A89060" cornerRadius={[0, 0, 3, 3] as unknown as number} />
      <Rect x={4} y={4} width={5} height={5} fill="#8A7040" />
      <Rect x={w - 9} y={4} width={5} height={5} fill="#8A7040" />
      {isSelected && <Rect width={w} height={h} stroke="#FFFFFF" strokeWidth={2} fill="transparent" cornerRadius={2} />}
    </Group>
  );
}

function ItemLabel({ item }: { item: PlannerItem }) {
  const fontSize = Math.min(10, item.width * 0.12, item.height * 0.28);
  if (fontSize < 6) return null;
  return (
    <Text
      text={item.name}
      width={item.width}
      height={item.height}
      align="center"
      verticalAlign="middle"
      fontSize={Math.max(6, fontSize)}
      fill="#FFFFFF"
      fontFamily="Montserrat, sans-serif"
      fontStyle="bold"
      padding={3}
      listening={false}
      wrap="word"
    />
  );
}

function getSilhouetteType(item: PlannerItem): EOFProduct["silhouetteType"] {
  const id = item.productId.toLowerCase();
  if (id.includes("executive")) return "chair-executive";
  if (id.includes("lounge-2") || id.includes("sofa-2")) return "sofa-2";
  if (id.includes("lounge-3") || id.includes("sofa-3")) return "sofa-3";
  if (id.includes("lounge") || id.includes("chair-lounge")) return "chair-lounge";
  if (id.includes("coffee")) return "coffee-table";
  if (id.includes("reception")) return "reception-desk";
  if (id.includes("round")) return "round-table";
  if (id.includes("screen")) return "screen";
  if (id.includes("storage") || id.includes("filing") || id.includes("pedestal") || id.includes("cabinet")) return "storage";
  if (id.includes("mtable") || id.includes("meeting-table") || id.includes("table")) return "meeting-table";
  if (id.includes("desk") || id.includes("ws") || id.includes("workstation")) return "desk";
  if (id.includes("meeting") || id.includes("visitor")) return "chair-meeting";
  if (id.includes("task") || id.includes("chair-task")) return "chair-task";
  const cat = item.category;
  if (cat === "Desks") return "desk";
  if (cat === "Meeting") return "meeting-table";
  if (cat === "Storage") return "storage";
  if (cat === "Screens") return "screen";
  if (cat === "Breakout") return "chair-lounge";
  return "chair-task";
}

function FurnitureSilhouette({ item, isSelected }: SilhouetteProps) {
  const type = getSilhouetteType(item);
  switch (type) {
    case "chair-task":
    case "chair-meeting":
    case "chair-visitor":
      return <ChairSilhouette item={item} isSelected={isSelected} />;
    case "chair-executive":
      return <ExecutiveChairSilhouette item={item} isSelected={isSelected} />;
    case "chair-lounge":
      return <LoungeChairSilhouette item={item} isSelected={isSelected} />;
    case "sofa-2":
      return <Sofa2Silhouette item={item} isSelected={isSelected} />;
    case "sofa-3":
      return <Sofa3Silhouette item={item} isSelected={isSelected} />;
    case "desk":
      return <DeskSilhouette item={item} isSelected={isSelected} />;
    case "meeting-table":
      return <MeetingTableSilhouette item={item} isSelected={isSelected} />;
    case "round-table":
      return <RoundTableSilhouette item={item} isSelected={isSelected} />;
    case "storage":
      return <StorageSilhouette item={item} isSelected={isSelected} />;
    case "screen":
      return <ScreenSilhouette item={item} isSelected={isSelected} />;
    case "coffee-table":
      return <CoffeeTableSilhouette item={item} isSelected={isSelected} />;
    case "reception-desk":
      return <ReceptionDeskSilhouette item={item} isSelected={isSelected} />;
    default:
      return <DeskSilhouette item={item} isSelected={isSelected} />;
  }
}

// ─── Alignment guides ─────────────────────────────────────────────────────────

interface Guide {
  type: "vertical" | "horizontal";
  pos: number;
}

function getEdges(item: PlannerItem) {
  return {
    left: item.x,
    right: item.x + item.width,
    centerX: item.x + item.width / 2,
    top: item.y,
    bottom: item.y + item.height,
    centerY: item.y + item.height / 2,
  };
}

export function getAlignmentGuides(draggingItem: PlannerItem, allItems: PlannerItem[]): { guides: Guide[]; snappedX: number; snappedY: number } {
  const SNAP_THRESHOLD = 6;
  const edges = getEdges(draggingItem);
  const guides: Guide[] = [];
  let snappedX = draggingItem.x;
  let snappedY = draggingItem.y;
  let closestH = SNAP_THRESHOLD + 1;
  let closestV = SNAP_THRESHOLD + 1;

  allItems.filter((i) => i.id !== draggingItem.id).forEach((other) => {
    const o = getEdges(other);

    const vPairs: Array<[number, number, number]> = [
      [edges.left, o.left, 0], [edges.left, o.right, o.right - edges.left],
      [edges.right, o.right, o.right - edges.right], [edges.right, o.left, o.left - edges.right],
      [edges.centerX, o.centerX, o.centerX - edges.centerX],
    ];
    vPairs.forEach(([a, b, diff]) => {
      const d = Math.abs(a - b);
      if (d < closestV) {
        closestV = d;
        snappedX = draggingItem.x + diff;
        const idx = guides.findIndex((g) => g.type === "vertical");
        if (idx >= 0) guides.splice(idx, 1);
        guides.push({ type: "vertical", pos: b });
      }
    });

    const hPairs: Array<[number, number, number]> = [
      [edges.top, o.top, 0], [edges.top, o.bottom, o.bottom - edges.top],
      [edges.bottom, o.bottom, o.bottom - edges.bottom], [edges.bottom, o.top, o.top - edges.bottom],
      [edges.centerY, o.centerY, o.centerY - edges.centerY],
    ];
    hPairs.forEach(([a, b, diff]) => {
      const d = Math.abs(a - b);
      if (d < closestH) {
        closestH = d;
        snappedY = draggingItem.y + diff;
        const idx = guides.findIndex((g) => g.type === "horizontal");
        if (idx >= 0) guides.splice(idx, 1);
        guides.push({ type: "horizontal", pos: b });
      }
    });
  });

  return {
    guides: closestV <= SNAP_THRESHOLD || closestH <= SNAP_THRESHOLD ? guides : [],
    snappedX: closestV <= SNAP_THRESHOLD ? snappedX : draggingItem.x,
    snappedY: closestH <= SNAP_THRESHOLD ? snappedY : draggingItem.y,
  };
}

// ─── CanvasItem with Transformer ──────────────────────────────────────────────

function CanvasItem({
  item,
  isSelected,
  snapToGrid: snapEnabled,
  allItems,
  onSelect,
  onChange,
  onGuides,
}: {
  item: PlannerItem;
  isSelected: boolean;
  snapToGrid: boolean;
  allItems: PlannerItem[];
  onSelect: () => void;
  onChange: (updates: Partial<PlannerItem>) => void;
  onGuides: (guides: Guide[]) => void;
}) {
  const groupRef = useRef<Konva.Group>(null);
  const trRef = useRef<Konva.Transformer>(null);

  useEffect(() => {
    if (isSelected && trRef.current && groupRef.current) {
      trRef.current.nodes([groupRef.current]);
      trRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected]);

  return (
    <>
      <Group
        ref={groupRef}
        x={item.x}
        y={item.y}
        rotation={item.rotation}
        draggable
        onClick={onSelect}
        onTap={onSelect}
        onDragMove={(e) => {
          let nx = e.target.x();
          let ny = e.target.y();
          const draggingCopy = { ...item, x: nx, y: ny };
          const { guides, snappedX, snappedY } = getAlignmentGuides(draggingCopy, allItems);
          if (snapEnabled) {
            nx = snapToGridValue(snappedX, GRID_SIZE);
            ny = snapToGridValue(snappedY, GRID_SIZE);
          } else {
            nx = snappedX;
            ny = snappedY;
          }
          e.target.position({ x: nx, y: ny });
          onGuides(guides);
        }}
        onDragEnd={(e) => {
          let nx = e.target.x();
          let ny = e.target.y();
          if (snapEnabled) {
            nx = snapToGridValue(nx, GRID_SIZE);
            ny = snapToGridValue(ny, GRID_SIZE);
            e.target.position({ x: nx, y: ny });
          }
          onChange({ x: nx, y: ny });
          onGuides([]);
        }}
      >
        <FurnitureSilhouette item={item} isSelected={isSelected} />
        <ItemLabel item={item} />
      </Group>

      {isSelected && (
        <Transformer
          ref={trRef}
          enabledAnchors={["top-left", "top-right", "bottom-left", "bottom-right", "middle-right", "middle-left"]}
          rotateEnabled={true}
          borderStroke="#00B5A5"
          anchorStroke="#00B5A5"
          anchorFill="#FFFFFF"
          anchorSize={8}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 20 || newBox.height < 20) return oldBox;
            return newBox;
          }}
          onTransformEnd={() => {
            const node = groupRef.current;
            if (!node) return;
            const scaleX = node.scaleX();
            const scaleY = node.scaleY();
            node.scaleX(1);
            node.scaleY(1);
            onChange({
              x: node.x(),
              y: node.y(),
              width: Math.max(20, item.width * scaleX),
              height: Math.max(20, item.height * scaleY),
              rotation: node.rotation(),
            });
          }}
        />
      )}
    </>
  );
}

// ─── Ruler ────────────────────────────────────────────────────────────────────

function RulerH({ width, height, stageScale, stageX }: { width: number; height: number; stageScale: number; stageX: number }) {
  const ticks: React.ReactNode[] = [];
  const startM = Math.floor(-stageX / stageScale / PIXELS_PER_METRE);
  const endM = Math.ceil((width - stageX) / stageScale / PIXELS_PER_METRE);
  for (let m = startM; m <= endM; m++) {
    const px = (m * PIXELS_PER_METRE * stageScale) + stageX;
    if (px < RULER_SIZE || px > width) continue;
    ticks.push(
      <Line key={`hm${m}`} points={[px, height - 8, px, height]} stroke="#9B9B9B" strokeWidth={1} listening={false} />,
      <Text key={`hmt${m}`} x={px + 2} y={height - 14} text={`${m}m`} fontSize={9} fill="#9B9B9B" fontFamily="Montserrat, sans-serif" listening={false} />
    );
    const hpx = ((m + 0.5) * PIXELS_PER_METRE * stageScale) + stageX;
    if (hpx > RULER_SIZE && hpx < width) {
      ticks.push(<Line key={`hh${m}`} points={[hpx, height - 5, hpx, height]} stroke="#9B9B9B" strokeWidth={0.5} listening={false} />);
    }
  }
  return (
    <Group>
      <Rect x={RULER_SIZE} y={0} width={width - RULER_SIZE} height={height} fill="#1E1E1E" />
      {ticks}
    </Group>
  );
}

function RulerV({ width, height, stageScale, stageY }: { width: number; height: number; stageScale: number; stageY: number }) {
  const ticks: React.ReactNode[] = [];
  const startM = Math.floor(-stageY / stageScale / PIXELS_PER_METRE);
  const endM = Math.ceil((height - stageY) / stageScale / PIXELS_PER_METRE);
  for (let m = startM; m <= endM; m++) {
    const py = (m * PIXELS_PER_METRE * stageScale) + stageY;
    if (py < RULER_SIZE || py > height) continue;
    ticks.push(
      <Line key={`vm${m}`} points={[width - 8, py, width, py]} stroke="#9B9B9B" strokeWidth={1} listening={false} />,
      <Text key={`vmt${m}`} x={0} y={py + 2} text={`${m}m`} fontSize={9} fill="#9B9B9B" fontFamily="Montserrat, sans-serif" listening={false} />
    );
    const hpy = ((m + 0.5) * PIXELS_PER_METRE * stageScale) + stageY;
    if (hpy > RULER_SIZE && hpy < height) {
      ticks.push(<Line key={`vh${m}`} points={[width - 5, hpy, width, hpy]} stroke="#9B9B9B" strokeWidth={0.5} listening={false} />);
    }
  }
  return (
    <Group>
      <Rect x={0} y={RULER_SIZE} width={width} height={height - RULER_SIZE} fill="#1E1E1E" />
      {ticks}
    </Group>
  );
}

// ─── Floor plate with rooms ───────────────────────────────────────────────────

function FloorPlate({ canvasWidthM, canvasDepthM, rooms, selectedRoomId, onSelectRoom, onRoomDragEnd }: {
  canvasWidthM: number;
  canvasDepthM: number;
  rooms: Room[];
  selectedRoomId: string | null;
  onSelectRoom: (id: string | null) => void;
  onRoomDragEnd: (id: string, xM: number, yM: number) => void;
}) {
  const w = canvasWidthM * PIXELS_PER_METRE;
  const h = canvasDepthM * PIXELS_PER_METRE;

  return (
    <Group x={RULER_SIZE} y={RULER_SIZE}>
      {/* Floor fill */}
      <Rect width={w} height={h} fill="#F5F4F2" />
      {/* 1m grid overlay */}
      {Array.from({ length: canvasWidthM + 1 }, (_, i) => (
        <Line key={`vg${i}`} points={[i * PIXELS_PER_METRE, 0, i * PIXELS_PER_METRE, h]} stroke="#E0DDD8" strokeWidth={1} listening={false} />
      ))}
      {Array.from({ length: canvasDepthM + 1 }, (_, i) => (
        <Line key={`hg${i}`} points={[0, i * PIXELS_PER_METRE, w, i * PIXELS_PER_METRE]} stroke="#E0DDD8" strokeWidth={1} listening={false} />
      ))}
      {/* Floor plate border */}
      <Rect width={w} height={h} fill="transparent" stroke="#2A2A2A" strokeWidth={3} />

      {/* Rooms */}
      {rooms.map((room) => {
        const rx = room.xM * PIXELS_PER_METRE;
        const ry = room.yM * PIXELS_PER_METRE;
        const rw = room.widthM * PIXELS_PER_METRE;
        const rh = room.depthM * PIXELS_PER_METRE;
        const fillColor = ROOM_TYPE_COLORS[room.type] ?? "#F5F4F2";
        const isSelected = selectedRoomId === room.id;

        return (
          <Group
            key={room.id}
            x={rx}
            y={ry}
            draggable
            onClick={() => onSelectRoom(room.id)}
            onTap={() => onSelectRoom(room.id)}
            onDragEnd={(e) => {
              const nx = Math.max(0, Math.round(e.target.x() / PIXELS_PER_METRE * 10) / 10);
              const ny = Math.max(0, Math.round(e.target.y() / PIXELS_PER_METRE * 10) / 10);
              onRoomDragEnd(room.id, nx, ny);
            }}
          >
            {/* Room fill */}
            <Rect width={rw} height={rh} fill={fillColor} />
            {/* Room border */}
            <Rect
              width={rw}
              height={rh}
              fill="transparent"
              stroke={isSelected ? "#00B5A5" : "#2A2A2A"}
              strokeWidth={isSelected ? 2.5 : 2}
            />
            {/* Room label */}
            <Text
              text={room.label}
              x={6}
              y={6}
              fontSize={11}
              fill="#4B4B4B"
              fontFamily="Montserrat, sans-serif"
              fontStyle="bold"
              listening={false}
            />
            {/* Room dimension label */}
            <Text
              text={`${room.widthM}×${room.depthM}m`}
              x={6}
              y={20}
              fontSize={9}
              fill="#9B9B9B"
              fontFamily="Montserrat, sans-serif"
              listening={false}
            />
          </Group>
        );
      })}
    </Group>
  );
}

// ─── Main PlannerCanvas ────────────────────────────────────────────────────────

interface PlannerCanvasProps {
  width: number;
  height: number;
  onDrop?: (e: React.DragEvent<HTMLDivElement>) => void;
  stageRef?: React.RefObject<Konva.Stage | null>;
}

export default function PlannerCanvas({ width, height, onDrop, stageRef: externalStageRef }: PlannerCanvasProps) {
  const {
    items,
    selectedId,
    snapToGrid,
    canvasWidthM,
    canvasDepthM,
    rooms,
    selectedRoomId,
    setSelectedRoom,
    updateRoom,
    updateItem,
    setSelected,
    activeTool,
  } = usePlannerStore();

  const [stageScale, setStageScale] = useState(1);
  const [stagePos, setStagePos] = useState({ x: RULER_SIZE, y: RULER_SIZE });
  const [guides, setGuides] = useState<Guide[]>([]);
  const internalStageRef = useRef<Konva.Stage>(null);
  const stageRef = externalStageRef ?? internalStageRef;

  const handleWheel = (e: Konva.KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();
    const scaleBy = 1.06;
    const stage = stageRef.current;
    if (!stage) return;
    const oldScale = stageScale;
    const pointer = stage.getPointerPosition();
    if (!pointer) return;
    const mousePointTo = {
      x: (pointer.x - stagePos.x) / oldScale,
      y: (pointer.y - stagePos.y) / oldScale,
    };
    const newScale = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;
    const clampedScale = Math.min(4, Math.max(0.2, newScale));
    setStageScale(clampedScale);
    setStagePos({
      x: pointer.x - mousePointTo.x * clampedScale,
      y: pointer.y - mousePointTo.y * clampedScale,
    });
  };

  const handleStageClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (e.target === stageRef.current) {
      setSelected(null);
      setSelectedRoom(null);
    }
  };

  const handleRoomDragEnd = useCallback((id: string, xM: number, yM: number) => {
    updateRoom(id, { xM, yM });
  }, [updateRoom]);

  return (
    <div
      className="relative w-full h-full"
      style={{ background: "#CCCCCC", cursor: activeTool === "select" ? "default" : "crosshair" }}
      onDragOver={(e) => e.preventDefault()}
      onDrop={onDrop}
    >
      <Stage
        ref={stageRef}
        width={width}
        height={height}
        scaleX={stageScale}
        scaleY={stageScale}
        x={stagePos.x}
        y={stagePos.y}
        draggable={activeTool === "select"}
        onDragEnd={(e) => { setStagePos({ x: e.target.x(), y: e.target.y() }); }}
        onWheel={handleWheel}
        onClick={handleStageClick}
      >
        {/* 1. Background */}
        <Layer listening={false}>
          <Rect
            x={-stagePos.x / stageScale}
            y={-stagePos.y / stageScale}
            width={width / stageScale + 400}
            height={height / stageScale + 400}
            fill="#CCCCCC"
          />
        </Layer>

        {/* 2. Floor plate + rooms */}
        <Layer>
          <FloorPlate
            canvasWidthM={canvasWidthM}
            canvasDepthM={canvasDepthM}
            rooms={rooms}
            selectedRoomId={selectedRoomId}
            onSelectRoom={setSelectedRoom}
            onRoomDragEnd={handleRoomDragEnd}
          />
        </Layer>

        {/* 3. Furniture */}
        <Layer>
          {items.map((item) => (
            <CanvasItem
              key={item.id}
              item={item}
              isSelected={selectedId === item.id}
              snapToGrid={snapToGrid}
              allItems={items}
              onSelect={() => setSelected(item.id)}
              onChange={(updates) => updateItem(item.id, updates)}
              onGuides={setGuides}
            />
          ))}
        </Layer>

        {/* 4. Alignment guides */}
        <Layer listening={false}>
          {guides.map((guide, i) =>
            guide.type === "vertical" ? (
              <Line key={i} points={[guide.pos, -stagePos.y / stageScale, guide.pos, (-stagePos.y + height) / stageScale]} stroke="#00B5A5" strokeWidth={1} dash={[4, 4]} opacity={0.8} />
            ) : (
              <Line key={i} points={[-stagePos.x / stageScale, guide.pos, (-stagePos.x + width) / stageScale, guide.pos]} stroke="#00B5A5" strokeWidth={1} dash={[4, 4]} opacity={0.8} />
            )
          )}
        </Layer>
      </Stage>

      {/* Rulers */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <Stage width={width} height={RULER_SIZE} style={{ position: "absolute", top: 0, left: 0 }}>
          <Layer>
            <RulerH width={width} height={RULER_SIZE} stageScale={stageScale} stageX={stagePos.x} />
          </Layer>
        </Stage>
        <Stage width={RULER_SIZE} height={height} style={{ position: "absolute", top: 0, left: 0 }}>
          <Layer>
            <RulerV width={RULER_SIZE} height={height} stageScale={stageScale} stageY={stagePos.y} />
          </Layer>
        </Stage>
        <Stage width={RULER_SIZE} height={RULER_SIZE} style={{ position: "absolute", top: 0, left: 0 }}>
          <Layer>
            <Rect width={RULER_SIZE} height={RULER_SIZE} fill="#1E1E1E" />
          </Layer>
        </Stage>
      </div>

      {/* Canvas size label */}
      <div style={{
        position: "absolute", top: "2rem", right: "1rem",
        background: "rgba(26,26,26,0.85)", padding: "4px 10px", borderRadius: 6,
        fontSize: 11, color: "#9B9B9B", fontFamily: "Montserrat, sans-serif",
        border: "1px solid #2A2A2A", pointerEvents: "none",
      }}>
        {canvasWidthM}×{canvasDepthM}m canvas
      </div>

      {/* Zoom controls */}
      <div style={{ position: "absolute", bottom: "1rem", right: "1rem", display: "flex", flexDirection: "column", gap: "4px", zIndex: 10 }}>
        <button onClick={() => setStageScale((s) => Math.min(4, s * 1.2))} style={{ width: 32, height: 32, background: "rgba(255,255,255,0.9)", border: "1px solid #DDD", borderRadius: 6, cursor: "pointer", fontSize: 18, fontWeight: "bold", display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
        <button onClick={() => setStageScale((s) => Math.max(0.2, s / 1.2))} style={{ width: 32, height: 32, background: "rgba(255,255,255,0.9)", border: "1px solid #DDD", borderRadius: 6, cursor: "pointer", fontSize: 18, fontWeight: "bold", display: "flex", alignItems: "center", justifyContent: "center" }}>−</button>
        <button onClick={() => { setStageScale(1); setStagePos({ x: RULER_SIZE, y: RULER_SIZE }); }} style={{ width: 32, height: 32, background: "rgba(255,255,255,0.9)", border: "1px solid #DDD", borderRadius: 6, cursor: "pointer", fontSize: 10, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Montserrat, sans-serif" }} title="Reset zoom">1:1</button>
      </div>

      {/* Scale hint */}
      <div style={{ position: "absolute", bottom: "1rem", left: "2rem", background: "rgba(255,255,255,0.85)", padding: "4px 8px", borderRadius: 6, fontSize: 11, color: "#6B6B6B", fontFamily: "Montserrat, sans-serif", border: "1px solid #E5E5E5" }}>
        {PIXELS_PER_METRE}px = 1m
      </div>
    </div>
  );
}
