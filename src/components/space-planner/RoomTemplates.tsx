"use client";

import { Rect, Text, Group } from "react-konva";

export interface RoomTemplate {
  id: string;
  label: string;
  widthM: number;
  depthM: number;
}

export const ROOM_TEMPLATES: RoomTemplate[] = [
  { id: "open-plan", label: "Open Plan 15x12m", widthM: 15, depthM: 12 },
  { id: "boardroom", label: "Boardroom 8x6m", widthM: 8, depthM: 6 },
  { id: "small-office", label: "Small Office 6x5m", widthM: 6, depthM: 5 },
  { id: "reception", label: "Reception 10x8m", widthM: 10, depthM: 8 },
];

interface RoomTemplateShapeProps {
  template: RoomTemplate;
  scale: number; // px per metre
  offsetX?: number;
  offsetY?: number;
}

export function RoomTemplateShape({
  template,
  scale,
  offsetX = 40,
  offsetY = 40,
}: RoomTemplateShapeProps) {
  const w = template.widthM * scale;
  const h = template.depthM * scale;

  return (
    <Group x={offsetX} y={offsetY}>
      <Rect
        x={0}
        y={0}
        width={w}
        height={h}
        stroke="#6B6B6B"
        strokeWidth={2}
        fill="rgba(247, 246, 244, 0.3)"
        dash={[8, 4]}
      />
      <Text
        x={8}
        y={8}
        text={`${template.label}`}
        fontSize={12}
        fill="#6B6B6B"
        fontFamily="Montserrat, sans-serif"
      />
      <Text
        x={8}
        y={22}
        text={`${template.widthM}m × ${template.depthM}m`}
        fontSize={11}
        fill="#00B5A5"
        fontFamily="Montserrat, sans-serif"
      />
    </Group>
  );
}
