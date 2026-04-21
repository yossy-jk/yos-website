"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { Stage, Layer, Rect, Line, Text, Image as KonvaImage, Group, Transformer } from "react-konva";
import Konva from "konva";
import { usePlannerStore, getCategoryColor, snapToGridValue, type PlannerItem } from "@/lib/space-planner/store";
import { RoomTemplateShape, ROOM_TEMPLATES } from "@/components/space-planner/RoomTemplates";

const GRID_SIZE = 50;

interface PlannerCanvasProps {
  width: number;
  height: number;
  onDrop?: (e: React.DragEvent<HTMLDivElement>) => void;
}

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

  const textFill = item.category === "Desks" ? "#FFFFFF" : "#FFFFFF";
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
  } = usePlannerStore();

  const [stageScale, setStageScale] = useState(1);
  const [stagePos, setStagePos] = useState({ x: 0, y: 0 });
  const [bgImage, setBgImage] = useState<HTMLImageElement | null>(null);
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

  // Keyboard delete
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === "Delete" || e.key === "Backspace") && selectedId) {
        // Don't delete when typing in inputs
        const target = e.target as HTMLElement;
        if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return;
        removeItem(selectedId);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedId, removeItem]);

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

  const selectedTemplate = ROOM_TEMPLATES.find((t) => t.id === roomTemplate);

  return (
    <div className="relative w-full h-full" ref={containerRef}>
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
          draggable
          onDragEnd={(e) => {
            setStagePos({ x: e.target.x(), y: e.target.y() });
          }}
          onClick={(e) => {
            if (e.target === e.target.getStage()) {
              setSelected(null);
            }
          }}
        >
          {/* Background layer */}
          <Layer>
            {/* White background */}
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
          <Layer listening={false}>
            {gridLines()}
          </Layer>

          {/* Floor plan image */}
          <Layer>
            {bgImage && (
              <KonvaImage
                image={bgImage}
                x={20}
                y={20}
                width={Math.min(bgImage.width, width - 40)}
                height={Math.min(bgImage.height, height - 40)}
                opacity={0.6}
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
          <Layer>
            {zones.map((zone) => (
              <Group key={zone.id} x={zone.x} y={zone.y}>
                <Rect
                  width={zone.width}
                  height={zone.height}
                  stroke="#00B5A5"
                  strokeWidth={1.5}
                  fill="rgba(0, 181, 165, 0.05)"
                  dash={[6, 3]}
                />
                <Text
                  text={zone.label}
                  x={6}
                  y={6}
                  fontSize={11}
                  fill="#00B5A5"
                  fontFamily="Montserrat, sans-serif"
                  fontStyle="bold"
                />
              </Group>
            ))}
          </Layer>

          {/* Items layer */}
          <Layer>
            {items.map((item) => (
              <CanvasItem
                key={item.id}
                item={item}
                isSelected={selectedId === item.id}
                snapToGrid={snapToGrid}
                onSelect={() => setSelected(item.id)}
                onChange={(updates) => updateItem(item.id, updates)}
              />
            ))}
          </Layer>
        </Stage>
      </div>
    </div>
  );
}
