// ============================================================
// APolo Portfolio - RepeaterField
// 반복 입력 처리 컴포넌트
// ExperienceBlock.achievements, linkList 등에서 사용
// ============================================================

import React, { useCallback } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";

// ─────────────────────────────────────────
// RepeaterField Props
// ─────────────────────────────────────────

interface RepeaterFieldProps<T> {
  /** 현재 아이템 목록 */
  items: T[];
  onChange: (items: T[]) => void;
  /** 새 아이템의 기본값 생성 함수 */
  createDefaultItem: () => T;
  /** 각 아이템을 렌더링하는 함수 */
  renderItem: (params: {
    item: T;
    index: number;
    onChange: (updated: T) => void;
    onRemove: () => void;
  }) => React.ReactNode;
  /** 최소 아이템 수 */
  minItems?: number;
  /** 최대 아이템 수 */
  maxItems?: number;
  /** 추가 버튼 텍스트 */
  addLabel?: string;
  /** 드래그 정렬 활성화 여부 */
  sortable?: boolean;
  disabled?: boolean;
  /** 아이템 고유 key 생성 함수 (없으면 index 사용) */
  getItemKey?: (item: T, index: number) => string;
}

// ─────────────────────────────────────────
// SortableRepeaterItem
// ─────────────────────────────────────────

function SortableRepeaterItem({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`repeater-item ${isDragging ? "repeater-item--dragging" : ""}`}
    >
      {/* 드래그 핸들 */}
      <button
        type="button"
        className="repeater-drag-handle"
        aria-label="드래그하여 순서 변경"
        {...attributes}
        {...listeners}
      >
        <svg width="10" height="14" viewBox="0 0 10 14" fill="none">
          <circle cx="3" cy="3" r="1.2" fill="currentColor" />
          <circle cx="7" cy="3" r="1.2" fill="currentColor" />
          <circle cx="3" cy="7" r="1.2" fill="currentColor" />
          <circle cx="7" cy="7" r="1.2" fill="currentColor" />
          <circle cx="3" cy="11" r="1.2" fill="currentColor" />
          <circle cx="7" cy="11" r="1.2" fill="currentColor" />
        </svg>
      </button>
      <div className="repeater-item-content">{children}</div>
    </div>
  );
}

// ─────────────────────────────────────────
// RepeaterField (메인)
// ─────────────────────────────────────────

export function RepeaterField<T>({
  items,
  onChange,
  createDefaultItem,
  renderItem,
  minItems = 0,
  maxItems = Infinity,
  addLabel = "+ 항목 추가",
  sortable = true,
  disabled = false,
  getItemKey,
}: RepeaterFieldProps<T>) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor)
  );

  // 아이템별 stable key 생성
  const getKey = (item: T, index: number): string =>
    getItemKey ? getItemKey(item, index) : String(index);

  const itemIds = items.map(getKey);

  const handleAdd = useCallback(() => {
    if (items.length >= maxItems) return;
    onChange([...items, createDefaultItem()]);
  }, [items, maxItems, createDefaultItem, onChange]);

  const handleRemove = useCallback(
    (index: number) => {
      if (items.length <= minItems) return;
      onChange(items.filter((_, i) => i !== index));
    },
    [items, minItems, onChange]
  );

  const handleChange = useCallback(
    (index: number, updated: T) => {
      const next = [...items];
      next[index] = updated;
      onChange(next);
    },
    [items, onChange]
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;
      const oldIdx = itemIds.indexOf(String(active.id));
      const newIdx = itemIds.indexOf(String(over.id));
      onChange(arrayMove(items, oldIdx, newIdx));
    },
    [items, itemIds, onChange]
  );

  const canAdd = !disabled && items.length < maxItems;
  const canRemove = !disabled && items.length > minItems;

  // ── 정렬 가능 모드 ──
  if (sortable) {
    return (
      <div className="repeater-field">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          modifiers={[restrictToVerticalAxis]}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={itemIds}
            strategy={verticalListSortingStrategy}
          >
            <div className="repeater-list">
              {items.map((item, index) => {
                const key = getKey(item, index);
                return (
                  <SortableRepeaterItem key={key} id={key}>
                    {renderItem({
                      item,
                      index,
                      onChange: (updated) => handleChange(index, updated),
                      onRemove: () => handleRemove(index),
                    })}
                    <button
                      type="button"
                      className="repeater-remove-btn"
                      aria-label="항목 삭제"
                      disabled={!canRemove}
                      onClick={() => handleRemove(index)}
                    >
                      ×
                    </button>
                  </SortableRepeaterItem>
                );
              })}
            </div>
          </SortableContext>
        </DndContext>

        <button
          type="button"
          className="repeater-add-btn"
          disabled={!canAdd}
          onClick={handleAdd}
        >
          {addLabel}
        </button>

        {maxItems < Infinity && (
          <p className="repeater-count-hint">
            {items.length} / {maxItems}
          </p>
        )}
      </div>
    );
  }

  // ── 정렬 불가 모드 ──
  return (
    <div className="repeater-field">
      <div className="repeater-list">
        {items.map((item, index) => (
          <div key={getKey(item, index)} className="repeater-item repeater-item--static">
            <div className="repeater-item-content">
              {renderItem({
                item,
                index,
                onChange: (updated) => handleChange(index, updated),
                onRemove: () => handleRemove(index),
              })}
            </div>
            <button
              type="button"
              className="repeater-remove-btn"
              aria-label="항목 삭제"
              disabled={!canRemove}
              onClick={() => handleRemove(index)}
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        className="repeater-add-btn"
        disabled={!canAdd}
        onClick={handleAdd}
      >
        {addLabel}
      </button>
    </div>
  );
}

// ─────────────────────────────────────────
// 자주 쓰는 RepeaterField 프리셋
// ─────────────────────────────────────────

/** 문자열 목록 반복 (achievements, 간단 태그 등) */
export function StringRepeaterField({
  items,
  onChange,
  placeholder = "내용 입력",
  addLabel = "+ 항목 추가",
  minItems = 0,
  maxItems = Infinity,
  disabled = false,
}: {
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
  addLabel?: string;
  minItems?: number;
  maxItems?: number;
  disabled?: boolean;
}) {
  return (
    <RepeaterField<string>
      items={items}
      onChange={onChange}
      createDefaultItem={() => ""}
      minItems={minItems}
      maxItems={maxItems}
      addLabel={addLabel}
      disabled={disabled}
      sortable
      renderItem={({ item, onChange: onItemChange }) => (
        <input
          type="text"
          className="field-input"
          value={item}
          placeholder={placeholder}
          disabled={disabled}
          onChange={(e) => onItemChange(e.target.value)}
        />
      )}
    />
  );
}
