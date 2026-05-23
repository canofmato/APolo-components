// ============================================================
// APolo Portfolio - SortableBlockWrapper
// dnd-kit 기반 블록 드래그 정렬 래퍼
//
// 의존성: @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
// ============================================================

import React from "react";
import {
  useSortable,
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import type { AnyBlock } from "../../types/portfolio.types";

// ─────────────────────────────────────────
// SortableBlockItem
// 단일 블록을 sortable로 래핑
// ─────────────────────────────────────────

interface SortableBlockItemProps {
  blockId: string;
  children: React.ReactNode;
  disabled?: boolean;
}

export function SortableBlockItem({
  blockId,
  children,
  disabled = false,
}: SortableBlockItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: blockId, disabled });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    position: "relative",
    zIndex: isDragging ? 1 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={[
        "sortable-block-item",
        isDragging ? "sortable-block-item--dragging" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      data-block-id={blockId}
      {...attributes}
    >
      {/* 드래그 핸들 — data-drag-handle 속성을 가진 요소에만 드래그 바인딩 */}
      <DragHandle listeners={listeners} />
      {children}
    </div>
  );
}

// ─────────────────────────────────────────
// DragHandle
// BlockToolbar 내의 드래그 핸들에 리스너 전달
// ─────────────────────────────────────────

function DragHandle({
  listeners,
}: {
  listeners: ReturnType<typeof useSortable>["listeners"];
}) {
  return (
    <span
      className="sortable-drag-handle"
      {...listeners}
      aria-label="드래그하여 순서 변경"
      role="button"
      tabIndex={0}
    />
  );
}

// ─────────────────────────────────────────
// SortableBlockList Props
// ─────────────────────────────────────────

interface SortableBlockListProps {
  blocks: AnyBlock[];
  /** 드래그 완료 후 새 순서의 block ID 배열 반환 */
  onReorder: (newOrderIds: string[]) => void;
  /** 현재 드래그 중인 블록 ID */
  activeBlockId?: string | null;
  onDragStart?: (blockId: string) => void;
  onDragEnd?: () => void;
  disabled?: boolean;
  children: (block: AnyBlock, index: number) => React.ReactNode;
  /** DragOverlay에 렌더링할 컴포넌트 */
  renderOverlay?: (block: AnyBlock) => React.ReactNode;
}

// ─────────────────────────────────────────
// SortableBlockList (메인)
// ─────────────────────────────────────────

export function SortableBlockList({
  blocks,
  onReorder,
  activeBlockId,
  onDragStart,
  onDragEnd,
  disabled = false,
  children,
  renderOverlay,
}: SortableBlockListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        // 5px 이상 움직여야 드래그 시작 (클릭과 구분)
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor)
  );

  const blockIds = blocks.map((b) => b.id);
  const activeBlock = activeBlockId
    ? blocks.find((b) => b.id === activeBlockId)
    : null;

  const handleDragStart = (event: DragStartEvent) => {
    onDragStart?.(String(event.active.id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = blockIds.indexOf(String(active.id));
      const newIndex = blockIds.indexOf(String(over.id));
      const newOrder = arrayMove(blockIds, oldIndex, newIndex);
      onReorder(newOrder);
    }

    onDragEnd?.();
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      modifiers={[restrictToVerticalAxis]}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={blockIds}
        strategy={verticalListSortingStrategy}
        disabled={disabled}
      >
        <div className="sortable-block-list">
          {blocks.map((block, index) => (
            <SortableBlockItem
              key={block.id}
              blockId={block.id}
              disabled={disabled}
            >
              {children(block, index)}
            </SortableBlockItem>
          ))}
        </div>
      </SortableContext>

      {/* 드래그 중 커서 위치에 표시되는 오버레이 */}
      <DragOverlay>
        {activeBlock && renderOverlay ? (
          <div className="sortable-drag-overlay">
            {renderOverlay(activeBlock)}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

// ─────────────────────────────────────────
// useSortableBlocks 훅
// 블록 배열의 순서 상태를 로컬에서 관리
// ─────────────────────────────────────────

import { useState, useCallback } from "react";

interface UseSortableBlocksOptions {
  initialBlocks: AnyBlock[];
  onReorder?: (newOrderIds: string[]) => void;
}

export function useSortableBlocks({
  initialBlocks,
  onReorder,
}: UseSortableBlocksOptions) {
  const [activeBlockId, setActiveBlockId] = useState<string | null>(null);

  const handleReorder = useCallback(
    (newOrderIds: string[]) => {
      onReorder?.(newOrderIds);
    },
    [onReorder]
  );

  return {
    activeBlockId,
    onDragStart: setActiveBlockId,
    onDragEnd: () => setActiveBlockId(null),
    onReorder: handleReorder,
  };
}
