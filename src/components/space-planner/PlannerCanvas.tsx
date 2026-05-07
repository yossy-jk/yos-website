"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import {
  Stage,
  Layer,
  Rect,
  Line,
  Arc,
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
} from "@/lib/space-planner/store";

const GRID_SIZE = 40; // pixels per grid cell
const PIXELS_PER_METRE = 80; // 1m = 80px
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
      {/* Seat */}
      <Rect width={w} height={seatH} y={backH} fill={fill} cornerRadius={4} />
      {/* Backrest */}
      <Rect width={w} height={backH} y={0} fill={darkFill} cornerRadius={[4, 4, 0, 0] as unknown as number} />
      {/* Seat highlight */}
      <Rect x={4} y={backH + 4} width={w - 8} height={seatH - 8} fill={fill} opacity={0.4} cornerRadius={3} />
      {/* Selected indicator */}
      {isSelected && (
        <Rect width={w} height={h} stroke="#FFFFFF" strokeWidth={2} fill="transparent" cornerRadius={4} />
      )}
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
      {/* Armrests */}
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
      {/* Seat */}
      <Rect x={armW} y={backH} width={w - armW * 2} height={h - backH} fill={fill} cornerRadius={4} />
      {/* Left arm */}
      <Rect x={0} y={backH} width={armW} height={h - backH} fill={darkFill} cornerRadius={[0, 0, 0, 4] as unknown as number} />
      {/* Right arm */}
      <Rect x={w - armW} y={backH} width={armW} height={h - backH} fill={darkFill} cornerRadius={[0, 0, 4, 0] as unknown as number} />
      {/* Backrest */}
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
      {/* Seat */}
      <Rect x={armW} y={backH} width={w - armW * 2} height={h - backH} fill={fill} cornerRadius={2} />
      {/* Cushion divider */}
      <Line points={[mid, backH, mid, h]} stroke={darkFill} strokeWidth={2} />
      {/* Arms */}
      <Rect x={0} y={backH} width={armW} height={h - backH} fill={darkFill} cornerRadius={[0, 0, 0, 3] as unknown as number} />
      <Rect x={w - armW} y={backH} width={armW} height={h - backH} fill={darkFill} cornerRadius={[0, 0, 3, 0] as unknown as number} />
      {/* Backrest */}
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
      {/* Two dividers at 33% and 66% */}
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
      {/* Surface */}
      <Rect width={w} height={h} fill={fill} cornerRadius={2} stroke="#A89060" strokeWidth={1} />
      {/* Legs */}
      <Rect x={4} y={4} width={legSize} height={legSize} fill="#8A7040" />
      <Rect x={w - 4 - legSize} y={4} width={legSize} height={legSize} fill="#8A7040" />
      <Rect x={4} y={h - 4 - legSize} width={legSize} height={legSize} fill="#8A7040" />
      <Rect x={w - 4 - legSize} y={h - 4 - legSize} width={legSize} height={legSize} fill="#8A7040" />
      {/* Front edge highlight */}
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
      {/* Inner border */}
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
      {/* Drawer lines */}
      <Line points={[0, drawerH, w, drawerH]} stroke={lineColor} strokeWidth={1} />
      <Line points={[0, drawerH * 2, w, drawerH * 2]} stroke={lineColor} strokeWidth={1} />
      {/* Handles */}
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
      {/* Main desk */}
      <Rect width={w} height={h - counterH} fill={fill} cornerRadius={2} stroke="#A89060" strokeWidth={1} />
      {/* Front counter (reception-facing) */}
      <Rect y={h - counterH} width={w} height={counterH} fill="#A89060" cornerRadius={[0, 0, 3, 3] as unknown as number} />
      {/* Leg markers */}
      <Rect x={4} y={4} width={5} height={5} fill="#8A7040" />
      <Rect x={w - 9} y={4} width={5} height={5} fill="#8A7040" />
      {isSelected && <Rect width={w} height={h} stroke="#FFFFFF" strokeWidth={2} fill="transparent" cornerRadius={2} />}
    </Group>
  );
}

// Label overlay (drawn separately, not inside transform group)
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
  // Map by productId or name patterns
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
  // Fallback by category
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

    // Vertical alignment (left/right/center of dragging vs other)
    const vPairs: Array<[number, number, number]> = [
      [edges.left, o.left, 0],         [edges.left, o.right, o.right - edges.left],
      [edges.right, o.right, o.right - edges.right],  [edges.right, o.left, o.left - edges.right],
      [edges.centerX, o.centerX, o.centerX - edges.centerX],
    ];
    vPairs.forEach(([a, b, diff]) => {
      const d = Math.abs(a - b);
      if (d < closestV) {
        closestV = d;
        snappedX = draggingItem.x + diff;
        guides.splice(guides.findIndex((g) => g.type === "vertical"), 1);
        guides.push({ type: "vertical", pos: b });
      }
    });

    // Horizontal alignment
    const hPairs: Array<[number, number, number]> = [
      [edges.top, o.top, 0],           [edges.top, o.bottom, o.bottom - edges.top],
      [edges.bottom, o.bottom, o.bottom - edges.bottom],  [edges.bottom, o.top, o.top - edges.bottom],
      [edges.centerY, o.centerY, o.centerY - edges.centerY],
    ];
    hPairs.forEach(([a, b, diff]) => {
      const d = Math.abs(a - b);
      if (d < closestH) {
        closestH = d;
        snappedY = draggingItem.y + diff;
        guides.splice(guides.findIndex((g) => g.type === "horizontal"), 1);
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
        offsetX={0}
        offsetY={0}
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
    // Half-metre tick
    const hpx = ((m + 0.5) * PIXELS_PER_METRE * stageScale) + stageX;
    if (hpx > RULER_SIZE && hpx < width) {
      ticks.push(
        <Line key={`hh${m}`} points={[hpx, height - 5, hpx, height]} stroke="#9B9B9B" strokeWidth={0.5} listening={false} />
      );
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
      <Text key={`vmt${m}`} x={0} y={py + 2} text={`${m}m`} fontSize={9} fill="#9B9B9B" fontFamily="Montserrat, sans-serif" listening={false} rotation={0} />
    );
    const hpy = ((m + 0.5) * PIXELS_PER_METRE * stageScale) + stageY;
    if (hpy > RULER_SIZE && hpy < height) {
      ticks.push(
        <Line key={`vh${m}`} points={[width - 5, hpy, width, hpy]} stroke="#9B9B9B" strokeWidth={0.5} listening={false} />
      );
    }
  }
  return (
    <Group>
      <Rect x={0} y={RULER_SIZE} width={width} height={height - RULER_SIZE} fill="#1E1E1E" />
      {ticks}
    </Group>
  );
}

// ─── Room outline ─────────────────────────────────────────────────────────────

function RoomOutline({ widthM, depthM, offsetX, offsetY }: { widthM: number; depthM: number; offsetX: number; offsetY: number }) {
  const w = widthM * PIXELS_PER_METRE;
  const h = depthM * PIXELS_PER_METRE;
  return (
    <Group x={offsetX} y={offsetY}>
      {/* Floor fill */}
      <Rect width={w} height={h} fill="#F5F0E8" />
      {/* Walls */}
      <Rect width={w} height={h} fill="transparent" stroke="#1A1A1A" strokeWidth={10} />
      {/* Dimension labels */}
      <Text text={`${widthM}m`} x={w / 2 - 20} y={-18} fontSize={11} fill="#6B6B6B" fontFamily="Montserrat, sans-serif" fontStyle="bold" listening={false} />
      <Text text={`${depthM}m`} x={-24} y={h / 2 - 6} fontSize={11} fill="#6B6B6B" fontFamily="Montserrat, sans-serif" fontStyle="bold" listening={false} rotation={-90} />
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
    roomConfig,
    updateItem,
    removeItem,
    setSelected,
    activeTool,
  } = usePlannerStore();

  const [stageScale, setStageScale] = useState(1);
  const [stagePos, setStagePos] = useState({ x: RULER_SIZE, y: RULER_SIZE });
  const [guides, setGuides] = useState<Guide[]>([]);
  const internalStageRef = useRef<Konva.Stage>(null);
  const stageRef = externalStageRef ?? internalStageRef;

  // Grid lines
  const gridLines = useCallback(() => {
    const lines: React.ReactNode[] = [];
    const offsetX = stagePos.x % (GRID_SIZE * stageScale);
    const offsetY = stagePos.y % (GRID_SIZE * stageScale);
    const cols = Math.ceil(width / (GRID_SIZE * stageScale)) + 1;
    const rows = Math.ceil(height / (GRID_SIZE * stageScale)) + 1;
    for (let i = 0; i <= cols; i++) {
      const x = offsetX + i * GRID_SIZE * stageScale;
      lines.push(<Line key={`vg${i}`} points={[x, 0, x, height]} stroke="#E8E8E8" strokeWidth={0.5} listening={false} />);
    }
    for (let i = 0; i <= rows; i++) {
      const y = offsetY + i * GRID_SIZE * stageScale;
      lines.push(<Line key={`hg${i}`} points={[0, y, width, y]} stroke="#E8E8E8" strokeWidth={0.5} listening={false} />);
    }
    return lines;
  }, [width, height, stageScale, stagePos]);

  // Keyboard: zoom
  const handleWheel = useCallback((e: Konva.KonvaEventObject<WheelEvent>) => {
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
  }, [stageScale, stagePos, stageRef]);

  const handleStageClick = useCallback((e: Konva.KonvaEventObject<MouseEvent>) => {
    if (e.target === stageRef.current) {
      setSelected(null);
    }
  }, [setSelected, stageRef]);

  // Room offset on canvas
  const roomOffsetX = stagePos.x / stageScale + 1;
  const roomOffsetY = stagePos.y / stageScale + 1;

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
        onDragEnd={(e) => {
          setStagePos({ x: e.target.x(), y: e.target.y() });
        }}
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

        {/* 2. Grid */}
        <Layer listening={false}>
          <Rect
            x={-stagePos.x / stageScale}
            y={-stagePos.y / stageScale}
            width={width / stageScale + 400}
            height={height / stageScale + 400}
            fill="#F8F8F5"
          />
          {Array.from({ length: Math.ceil((width / stageScale + 400) / GRID_SIZE) + 1 }, (_, i) => (
            <Line key={`vg${i}`} points={[-stagePos.x / stageScale + i * GRID_SIZE, -stagePos.y / stageScale, -stagePos.x / stageScale + i * GRID_SIZE, -stagePos.y / stageScale + height / stageScale + 400]} stroke="#E0E0E0" strokeWidth={0.5} listening={false} />
          ))}
          {Array.from({ length: Math.ceil((height / stageScale + 400) / GRID_SIZE) + 1 }, (_, i) => (
            <Line key={`hg${i}`} points={[-stagePos.x / stageScale, -stagePos.y / stageScale + i * GRID_SIZE, -stagePos.x / stageScale + width / stageScale + 400, -stagePos.y / stageScale + i * GRID_SIZE]} stroke="#E0E0E0" strokeWidth={0.5} listening={false} />
          ))}
        </Layer>

        {/* 3. Room outline */}
        <Layer listening={false}>
          <RoomOutline
            widthM={roomConfig.width}
            depthM={roomConfig.depth}
            offsetX={RULER_SIZE / stageScale}
            offsetY={RULER_SIZE / stageScale}
          />
        </Layer>

        {/* 4. Furniture */}
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

        {/* 5. Alignment guides */}
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

      {/* Rulers — rendered as a separate overlay stage */}
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
        {/* Corner block */}
        <Stage width={RULER_SIZE} height={RULER_SIZE} style={{ position: "absolute", top: 0, left: 0 }}>
          <Layer>
            <Rect width={RULER_SIZE} height={RULER_SIZE} fill="#1E1E1E" />
          </Layer>
        </Stage>
      </div>

      {/* Zoom controls */}
      <div style={{ position: "absolute", bottom: "1rem", right: "1rem", display: "flex", flexDirection: "column", gap: "4px", zIndex: 10 }}>
        <button
          onClick={() => setStageScale((s) => Math.min(4, s * 1.2))}
          style={{ width: 32, height: 32, background: "rgba(255,255,255,0.9)", border: "1px solid #DDD", borderRadius: 6, cursor: "pointer", fontSize: 18, fontWeight: "bold", display: "flex", alignItems: "center", justifyContent: "center" }}
        >+</button>
        <button
          onClick={() => setStageScale((s) => Math.max(0.2, s / 1.2))}
          style={{ width: 32, height: 32, background: "rgba(255,255,255,0.9)", border: "1px solid #DDD", borderRadius: 6, cursor: "pointer", fontSize: 18, fontWeight: "bold", display: "flex", alignItems: "center", justifyContent: "center" }}
        >−</button>
        <button
          onClick={() => { setStageScale(1); setStagePos({ x: RULER_SIZE, y: RULER_SIZE }); }}
          style={{ width: 32, height: 32, background: "rgba(255,255,255,0.9)", border: "1px solid #DDD", borderRadius: 6, cursor: "pointer", fontSize: 10, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Montserrat, sans-serif" }}
          title="Reset zoom"
        >1:1</button>
      </div>

      {/* Scale hint */}
      <div style={{ position: "absolute", bottom: "1rem", left: "2rem", background: "rgba(255,255,255,0.85)", padding: "4px 8px", borderRadius: 6, fontSize: 11, color: "#6B6B6B", fontFamily: "Montserrat, sans-serif", border: "1px solid #E5E5E5" }}>
        {GRID_SIZE}px = {(GRID_SIZE / PIXELS_PER_METRE * 100).toFixed(0)}cm
      </div>
    </div>
  );
}
