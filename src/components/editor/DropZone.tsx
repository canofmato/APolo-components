// ============================================================
// APolo Portfolio - DropZone
// 블록 삽입 위치를 시각적으로 표시하고 클릭으로 블록 추가
// ============================================================

import React, { useState, useRef } from "react";
import type { BlockType } from "../../types/block.types";
import { BLOCK_REGISTRY } from "../../types/block-registry";

// ─────────────────────────────────────────
// 추가 가능한 블록 목록
// ─────────────────────────────────────────

const ADDABLE_BLOCK_TYPES: BlockType[] = [
  "hero",
  "profile",
  "project",
  "skills",
  "experience",
  "contact",
  "text",
  "image",
  "section",
  "columns",
  "spacer",
  "divider",
];

// ─────────────────────────────────────────
// BlockPickerMenu
// DropZone 클릭 시 나타나는 블록 타입 선택 메뉴
// ─────────────────────────────────────────

interface BlockPickerMenuProps {
  onSelect: (type: BlockType) => void;
  onClose: () => void;
  anchorRef: React.RefObject<HTMLDivElement>;
}

function BlockPickerMenu({
  onSelect,
  onClose,
  anchorRef,
}: BlockPickerMenuProps) {
  const templateBlocks = ADDABLE_BLOCK_TYPES.filter(
    (t) => BLOCK_REGISTRY[t].category === "template"
  );
  const layoutBlocks = ADDABLE_BLOCK_TYPES.filter(
    (t) => BLOCK_REGISTRY[t].category === "layout"
  );

  // 외부 클릭 닫기
  React.useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        anchorRef.current &&
        !anchorRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [anchorRef, onClose]);

  const BlockItem = ({ type }: { type: BlockType }) => {
    const entry = BLOCK_REGISTRY[type];
    return (
      <button
        type="button"
        className="block-picker-item"
        onClick={() => {
          onSelect(type);
          onClose();
        }}
      >
        <span className="block-picker-item-label">{entry.label}</span>
        <span className="block-picker-item-desc">{entry.description}</span>
      </button>
    );
  };

  return (
    <div className="block-picker-menu" role="menu" aria-label="블록 추가">
      <div className="block-picker-header">
        <span>블록 추가</span>
        <button
          type="button"
          className="block-picker-close"
          onClick={onClose}
          aria-label="닫기"
        >
          ×
        </button>
      </div>

      <div className="block-picker-body">
        <div className="block-picker-group">
          <p className="block-picker-group-title">콘텐츠 블록</p>
          {templateBlocks.map((type) => (
            <BlockItem key={type} type={type} />
          ))}
        </div>
        <div className="block-picker-group">
          <p className="block-picker-group-title">레이아웃 블록</p>
          {layoutBlocks.map((type) => (
            <BlockItem key={type} type={type} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// DropZone Props
// ─────────────────────────────────────────

interface DropZoneProps {
  /** 이 DropZone 다음에 블록이 삽입됨. undefined면 맨 위 */
  afterBlockId?: string;
  /** 부모 블록 ID (section 내부 등) */
  parentBlockId?: string;
  onAddBlock: (type: BlockType, afterBlockId?: string, parentBlockId?: string) => void;
  /** dnd-kit의 드래그 오버 상태 (외부에서 주입) */
  isOver?: boolean;
  /** 항상 표시 여부. false이면 hover 시에만 표시 */
  alwaysVisible?: boolean;
}

// ─────────────────────────────────────────
// DropZone (메인)
// ─────────────────────────────────────────

export function DropZone({
  afterBlockId,
  parentBlockId,
  onAddBlock,
  isOver = false,
  alwaysVisible = false,
}: DropZoneProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const isVisible = alwaysVisible || isHovered || isOver || pickerOpen;

  const handleAddBlock = (type: BlockType) => {
    onAddBlock(type, afterBlockId, parentBlockId);
  };

  return (
    <div
      ref={containerRef}
      className={[
        "drop-zone",
        isVisible ? "drop-zone--visible" : "drop-zone--hidden",
        isOver ? "drop-zone--over" : "",
        pickerOpen ? "drop-zone--active" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => !pickerOpen && setIsHovered(false)}
      aria-label="블록 삽입 위치"
    >
      {/* 삽입선 */}
      <div className="drop-zone-line">
        <button
          type="button"
          className="drop-zone-add-btn"
          aria-label="블록 추가"
          onClick={(e) => {
            e.stopPropagation();
            setPickerOpen((prev) => !prev);
          }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path
              d="M6 1v10M1 6h10"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      {/* 블록 타입 선택 메뉴 */}
      {pickerOpen && (
        <BlockPickerMenu
          onSelect={handleAddBlock}
          onClose={() => {
            setPickerOpen(false);
            setIsHovered(false);
          }}
          anchorRef={containerRef}
        />
      )}
    </div>
  );
}

export default DropZone;
