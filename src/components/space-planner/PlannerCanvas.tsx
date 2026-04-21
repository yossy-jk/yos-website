"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import {
  Stage,
  Layer,
  Rect,
  Line,
  Arc,
  Text,
  Image as KonvaImage,
  Group,
  Transformer,
} from "react-konva";
import Konva from "konva";
import {
  usePlannerStore,
  getCategoryColor,
  snapToGridValue,
  type PlannerItem,
  type WallSegment,
  type DoorElement,
  type WindowElement,
  type ColumnElement,
} from "@/lib/space-planner/store";
import { RoomTemplateShape, ROOM_TEMPLATES } from "@/components/space-planner/RoomTemplates";

const GRID_SIZE = 50;

// --- Wall style helpers ---

interface WallStyle {
  stroke: string;
  strokeWidth: number;
  dash?: number[];
}

function getWallStyle(wallType: WallSegment["wallType"]): WallStyle {
  switch (wallType) {
    case "gyprock":
      return { stroke: "#1A1A1A", strokeWidth: 8 };
    case "glazing":
      return { stroke: "#00B5A5", strokeWidth: 4 };
    case "external":
      return { stroke: "#1A1A1A", strokeWidth: 14 };
    case "partition":
      return { stroke: "#3D3D3D", strokeWidth: 4, dash: [8, 4] };
    case "existing":
      return { stroke: "#9B9B9B", strokeWidth: 8 };
  }
}

// --- CanvasItem (existing furniture) ---

function CanvasItem({
  item,
  isSelected,
  snapToGrid,
  onSelect,
  onChange,
}: {
  item: PlannerItem;
  isSelected: boolean;
  snapToGrid: boolean;
  onSelect: () => void;
  onChange: (updates: Partial<PlannerItem>) => void;
}) {
  const shapeRef = useRef<Konva.Rect>(null);
  const trRef = useRef<Konva.Transformer>(null);

  useEffect(() => {
    if (isSelected && trRef.current && shapeRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected]);

  const textFill = "#FFFFFF";
  const fontSize = Math.min(12, item.width * 0.14, item.height * 0.3);

  return (
    <>
      <Group
        x={item.x}
        y={item.y}
        rotation={item.rotation}
        draggable
        onClick={onSelect}
        onTap={onSelect}
        onDragEnd={(e) => {
          let nx = e.target.x();
          let ny = e.target.y();
          if (snapToGrid) {
            nx = snapToGridValue(nx, GRID_SIZE);
            ny = snapToGridValue(ny, GRID_SIZE);
          }
          onChange({ x: nx, y: ny });
          e.target.position({ x: nx, y: ny });
        }}
      >
        <Rect
          ref={shapeRef}
          width={item.width}
          height={item.height}
          fill={item.color}
          opacity={0.9}
          cornerRadius={3}
          shadowEnabled={isSelected}
          shadowBlur={8}
          shadowOpacity={0.3}
        />
        <Text
          text={item.name}
          width={item.width}
          height={item.height}
          align="center"
          verticalAlign="middle"
          fontSize={Math.max(7, fontSize)}
          fill={textFill}
          fontFamily="Montserrat, sans-serif"
          fontStyle="bold"
          padding={4}
          listening={false}
          wrap="word"
        />
      </Group>
      {isSelected && (
        <Transformer
          ref={trRef}
          enabledAnchors={["top-left", "top-right", "bottom-left", "bottom-right"]}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 20 || newBox.height < 20) return oldBox;
            return newBox;
          }}
          onTransformEnd={() => {
            const node = shapeRef.current;
            if (!node) return;
            const scaleX = node.scaleX();
            const scaleY = node.scaleY();
            node.scaleX(1);
            node.scaleY(1);
            onChange({
              x: node.x(),
              y: node.y(),
              width: Math.max(20, node.width() * scaleX),
              height: Math.max(20, node.height() * scaleY),
              rotation: node.rotation(),
            });
          }}
        />
      )}
    </>
  );
}

// --- Drawing element renderers ---

function WallRenderer({ wall }: { wall: WallSegment }) {
  const style = getWallStyle(wall.wallType);
  return (
    <Line
      points={wall.points}
      stroke={style.stroke}
      strokeWidth={style.strokeWidth}
      dash={style.dash}
      lineCap="round"
      lineJoin="round"
      listening={false}
    />
  );
}

function DoorRenderer({ door }: { door: DoorElement }) {
  return (
    <Group x={door.x} y={door.y} rotation={door.rotation} listening={false}>
      {/* Door panel */}
      <Rect
        x={0}
        y={-3}
        width={door.width}
        height={6}
        fill="#9B9B9B"
        listening={false}
      />
      {/* Swing arc */}
      <Arc
        x={0}
        y={0}
        innerRadius={0}
        outerRadius={door.width}
        angle={90}
        rotation={door.swingDirection === "left" ? -90 : 0}
        stroke="#00B5A5"
        strokeWidth={1.5}
        dash={[6, 3]}
        fill="transparent"
        listening={false}
      />
    </Group>
  );
}

function WindowRenderer({ win }: { win: WindowElement }) {
  const tickLen = 8;
  return (
    <Group x={win.x} y={win.y} rotation={win.rotation} listening={false}>
      {/* Main line */}
      <Line
        points={[0, 0, win.width, 0]}
        stroke="#00B5A5"
        strokeWidth={6}
        lineCap="square"
        listening={false}
      />
      {/* Left tick */}
      <Line
        points={[0, -tickLen, 0, tickLen]}
        stroke="#00B5A5"
        strokeWidth={2}
        listening={false}
      />
      {/* Right tick */}
      <Line
        points={[win.width, -tickLen, win.width, tickLen]}
        stroke="#00B5A5"
        strokeWidth={2}
        listening={false}
      />
    </Group>
  );
}

function ColumnRenderer({ col }: { col: ColumnElement }) {
  return (
    <Rect
      x={col.x - col.size / 2}
      y={col.y - col.size / 2}
      width={col.size}
      height={col.size}
      fill="#9B9B9B"
      stroke="#3D3D3D"
      strokeWidth={2}
      listening={false}
    />
  );
}

// --- Main PlannerCanvas component ---

interface PlannerCanvasProps {
  width: number;
  height: number;
  onDrop?: (e: React.DragEvent<HTMLDivElement>) => void;
}

export default function PlannerCanvas({ width, height, onDrop }: PlannerCanvasProps) {
  const {
    items,
    zones,
    selectedId,
    floorPlanImage,
    roomTemplate,
    snapToGrid,
    scale,
    updateItem,
    removeItem,
    setSelected,
    // Drawing
    activeTool,
    activeWallType,
    walls,
    doors,
    windows,
    columns,
    drawingPoints,
    addWall,
    removeWall,
    addDoor,
    removeDoor,
    addWindow,
    removeWindow,
    addColumn,
    removeColumn,
    setDrawingPoints,
  } = usePlannerStore();

  const [stageScale, setStageScale] = useState(1);
  const [stagePos, setStagePos] = useState({ x: 0, y: 0 });
  const [bgImage, setBgImage] = useState<HTMLImageElement | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const stageRef = useRef<Konva.Stage>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load floor plan image
  useEffect(() => {
    if (!floorPlanImage) {
      setBgImage(null);
      return;
    }
    const img = new window.Image();
    img.src = floorPlanImage;
    img.onload = () => setBgImage(img);
  }, [floorPlanImage]);

  // Keyboard handling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return;

      if (e.key === "Escape") {
        setDrawingPoints([]);
        return;
      }

      if ((e.key === "Delete" || e.key === "Backspace") && activeTool === "select" && selectedId) {
        removeItem(selectedId);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedId, activeTool, removeItem, setDrawingPoints]);

  // Grid lines
  const gridLines = useCallback(() => {
    const lines: React.ReactNode[] = [];
    const w = width / stageScale;
    const h = height / stageScale;
    for (let x = 0; x < w + GRID_SIZE; x += GRID_SIZE) {
      lines.push(
        <Line
          key={`v${x}`}
          points={[x, 0, x, h + GRID_SIZE]}
          stroke="#E0E0E0"
          strokeWidth={0.5}
          listening={false}
        />
      );
    }
    for (let y = 0; y < h + GRID_SIZE; y += GRID_SIZE) {
      lines.push(
        <Line
          key={`h${y}`}
          points={[0, y, w + GRID_SIZE, y]}
          stroke="#E0E0E0"
          strokeWidth={0.5}
          listening={false}
        />
      );
    }
    return lines;
  }, [width, height, stageScale]);

  const handleZoom = (direction: "in" | "out") => {
    const factor = direction === "in" ? 1.2 : 1 / 1.2;
    setStageScale((prev) => Math.min(3, Math.max(0.3, prev * factor)));
  };

  // Snap helper
  const snap = useCallback(
    (val: number) => (snapToGrid ? snapToGridValue(val, GRID_SIZE) : val),
    [snapToGrid]
  );

  // Get pointer position relative to stage (accounting for scale/offset)
  const getPointerPos = useCallback(() => {
    const stage = stageRef.current;
    if (!stage) return { x: 0, y: 0 };
    const pos = stage.getPointerPosition();
    if (!pos) return { x: 0, y: 0 };
    return {
      x: snap((pos.x - stagePos.x) / stageScale),
      y: snap((pos.y - stagePos.y) / stageScale),
    };
  }, [snap, stagePos, stageScale]);

  // Distance helper for eraser
  const dist = (x1: number, y1: number, x2: number, y2: number) =>
    Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));

  // Wall tool type for glazing/partition shortcuts
  const effectiveWallType =
    activeTool === "glazing"
      ? "glazing"
      : activeTool === "partition"
      ? "partition"
      : activeWallType;

  const isWallTool =
    activeTool === "wall" || activeTool === "glazing" || activeTool === "partition";

  // Stage event handlers
  const handleMouseMove = useCallback(() => {
    if (!isWallTool) return;
    const pos = getPointerPos();
    setMousePos(pos);
  }, [isWallTool, getPointerPos]);

  const handleClick = useCallback(
    (e: Konva.KonvaEventObject<MouseEvent>) => {
      // Ignore right-click
      if (e.evt.button !== 0) return;

      const pos = getPointerPos();

      if (isWallTool) {
        if (drawingPoints.length === 0) {
          setDrawingPoints([pos.x, pos.y]);
        } else {
          // Add wall segment from last point to current
          const lastX = drawingPoints[drawingPoints.length - 2];
          const lastY = drawingPoints[drawingPoints.length - 1];
          addWall({
            points: [lastX, lastY, pos.x, pos.y],
            wallType: effectiveWallType,
            thickness: getWallStyle(effectiveWallType).strokeWidth,
          });
          // Continue chaining from current point
          setDrawingPoints([pos.x, pos.y]);
        }
        return;
      }

      if (activeTool === "door") {
        addDoor({ x: pos.x, y: pos.y, width: 80, rotation: 0, swingDirection: "left" });
        return;
      }

      if (activeTool === "window") {
        addWindow({ x: pos.x, y: pos.y, width: 100, rotation: 0 });
        return;
      }

      if (activeTool === "column") {
        addColumn({ x: pos.x, y: pos.y, size: 40 });
        return;
      }

      if (activeTool === "eraser") {
        const THRESHOLD = 20;
        // Check walls
        for (const wall of walls) {
          const [x1, y1, x2, y2] = wall.points;
          const mx = (x1 + x2) / 2;
          const my = (y1 + y2) / 2;
          if (
            dist(pos.x, pos.y, x1, y1) < THRESHOLD ||
            dist(pos.x, pos.y, x2, y2) < THRESHOLD ||
            dist(pos.x, pos.y, mx, my) < THRESHOLD
          ) {
            removeWall(wall.id);
            return;
          }
        }
        // Check doors
        for (const door of doors) {
          if (dist(pos.x, pos.y, door.x, door.y) < THRESHOLD) {
            removeDoor(door.id);
            return;
          }
        }
        // Check windows
        for (const win of windows) {
          if (dist(pos.x, pos.y, win.x, win.y) < THRESHOLD) {
            removeWindow(win.id);
            return;
          }
        }
        // Check columns
        for (const col of columns) {
          if (dist(pos.x, pos.y, col.x, col.y) < THRESHOLD) {
            removeColumn(col.id);
            return;
          }
        }
        return;
      }

      // Select tool — deselect if clicking stage background
      if (e.target === e.target.getStage()) {
        setSelected(null);
      }
    },
    [
      activeTool,
      isWallTool,
      drawingPoints,
      effectiveWallType,
      walls,
      doors,
      windows,
      columns,
      getPointerPos,
      addWall,
      addDoor,
      addWindow,
      addColumn,
      removeWall,
      removeDoor,
      removeWindow,
      removeColumn,
      setDrawingPoints,
      setSelected,
    ]
  );

  const handleDblClick = useCallback(() => {
    if (isWallTool) {
      setDrawingPoints([]);
    }
  }, [isWallTool, setDrawingPoints]);

  // Cursor style
  const cursorStyle =
    activeTool === "eraser"
      ? "cell"
      : activeTool !== "select"
      ? "crosshair"
      : "default";

  const selectedTemplate = ROOM_TEMPLATES.find((t) => t.id === roomTemplate);

  // Preview line while drawing walls
  const previewPoints =
    isWallTool && drawingPoints.length >= 2
      ? [
          drawingPoints[drawingPoints.length - 2],
          drawingPoints[drawingPoints.length - 1],
          mousePos.x,
          mousePos.y,
        ]
      : null;

  return (
    <div
      className="relative w-full h-full"
      ref={containerRef}
      style={{ cursor: cursorStyle }}
    >
      {/* Zoom controls */}
      <div className="absolute bottom-4 right-4 z-10 flex flex-col gap-1">
        <button
          onClick={() => handleZoom("in")}
          className="w-8 h-8 bg-white border border-gray-300 text-near-black font-bold text-lg hover:bg-gray-50 flex items-center justify-center rounded-lg shadow"
          title="Zoom in"
        >
          +
        </button>
        <button
          onClick={() => handleZoom("out")}
          className="w-8 h-8 bg-white border border-gray-300 text-near-black font-bold text-lg hover:bg-gray-50 flex items-center justify-center rounded-lg shadow"
          title="Zoom out"
        >
          -
        </button>
      </div>

      {/* Scale indicator */}
      <div className="absolute bottom-4 left-4 z-10 bg-white/90 text-xs text-mid-grey px-2 py-1 rounded-lg border border-gray-200 shadow">
        1 square = 1m x 1m
      </div>

      {/* Canvas drop zone */}
      <div
        className="w-full h-full"
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
            if (activeTool === "select") {
              setStagePos({ x: e.target.x(), y: e.target.y() });
            }
          }}
          onMouseMove={handleMouseMove}
          onClick={handleClick}
          onDblClick={handleDblClick}
        >
          {/* 1. Background layer */}
          <Layer>
            <Rect
              x={-stagePos.x / stageScale}
              y={-stagePos.y / stageScale}
              width={width / stageScale + 200}
              height={height / stageScale + 200}
              fill="#FAFAFA"
              listening={false}
            />
          </Layer>

          {/* Grid layer */}
          <Layer listening={false}>{gridLines()}</Layer>

          {/* 2. Floor plan image layer */}
          <Layer>
            {bgImage && (
              <KonvaImage
                image={bgImage}
                x={20}
                y={20}
                width={Math.min(bgImage.width, width - 40)}
                height={Math.min(bgImage.height, height - 40)}
                opacity={0.5}
                listening={false}
              />
            )}
            {selectedTemplate && (
              <RoomTemplateShape
                template={selectedTemplate}
                scale={scale}
                offsetX={40}
                offsetY={40}
              />
            )}
          </Layer>

          {/* Zones layer */}
          <Layer listening={false}>
            {zones.map((zone) => (
              <Group key={zone.id} x={zone.x} y={zone.y}>
                <Rect
                  width={zone.width}
                  height={zone.height}
                  stroke="#00B5A5"
                  strokeWidth={1.5}
                  fill="rgba(0, 181, 165, 0.05)"
                  dash={[6, 3]}
                  listening={false}
                />
                <Text
                  text={zone.label}
                  x={6}
                  y={6}
                  fontSize={11}
                  fill="#00B5A5"
                  fontFamily="Montserrat, sans-serif"
                  fontStyle="bold"
                  listening={false}
                />
              </Group>
            ))}
          </Layer>

          {/* 3. Drawing layer (walls, doors, windows, columns) */}
          <Layer listening={false}>
            {walls.map((wall) => (
              <WallRenderer key={wall.id} wall={wall} />
            ))}
            {doors.map((door) => (
              <DoorRenderer key={door.id} door={door} />
            ))}
            {windows.map((win) => (
              <WindowRenderer key={win.id} win={win} />
            ))}
            {columns.map((col) => (
              <ColumnRenderer key={col.id} col={col} />
            ))}
          </Layer>

          {/* 4. Furniture items layer */}
          <Layer>
            {items.map((item) => (
              <CanvasItem
                key={item.id}
                item={item}
                isSelected={selectedId === item.id}
                snapToGrid={snapToGrid}
                onSelect={() => {
                  if (activeTool === "select") setSelected(item.id);
                }}
                onChange={(updates) => updateItem(item.id, updates)}
              />
            ))}
          </Layer>

          {/* 5. Preview layer (in-progress wall line) */}
          <Layer listening={false}>
            {previewPoints && (
              <Line
                points={previewPoints}
                stroke={getWallStyle(effectiveWallType).stroke}
                strokeWidth={getWallStyle(effectiveWallType).strokeWidth}
                dash={[8, 4]}
                opacity={0.5}
                lineCap="round"
                listening={false}
              />
            )}
            {/* Start point dot */}
            {isWallTool && drawingPoints.length >= 2 && (
              <Rect
                x={drawingPoints[0] - 4}
                y={drawingPoints[1] - 4}
                width={8}
                height={8}
                fill="#00B5A5"
                cornerRadius={4}
                listening={false}
              />
            )}
          </Layer>
        </Stage>
      </div>
    </div>
  );
}
