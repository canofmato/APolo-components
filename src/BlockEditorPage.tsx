// ============================================================
// APolo - BlockEditorPage
// 에디터 전체 레이아웃
// 좌: 블록 리스트 패널 / 중: 캔버스(PreviewRenderer + SortableBlockList) / 우: 속성 패널
// ============================================================

import  { useCallback } from "react";
import { PreviewRenderer } from "./components/PreviewRenderer";
import { BlockSettingsPanel } from "./components/editor/BlockSettingsPanel";
import { SortableBlockList } from "./components/editor/SortableBlockWrapper";
import { useSortableBlocks } from "./components/editor/useSortableBlocks";
import { DropZone } from "./components/editor/DropZone";
import { BlockToolbar } from "./components/editor/BlockToolbar";
import { BlockRenderer } from "./components/BlockRenderer";
import {
  usePortfolioStore,
  usePortfolioHistory,
  useSelectedBlock,
  useIsSettingsPanelOpen,
} from "./store/portfolioStore";
import type { BlockType } from "./types/block.types";
import type { AnyBlock } from "./types/portfolio.types";
import { getRootBlocks } from "./types/portfolio.types";
import { BLOCK_REGISTRY } from "./types/block-registry";

// ─────────────────────────────────────────
// 상단 툴바
// ─────────────────────────────────────────

function EditorTopBar() {
  const template      = usePortfolioStore((s) => s.template);
  const previewMode   = usePortfolioStore((s) => s.previewMode);
  const isDirty       = usePortfolioStore((s) => s.isDirty);
  const isSaving      = usePortfolioStore((s) => s.isSaving);
  const setPreviewMode = usePortfolioStore((s) => s.setPreviewMode);
  const { undo, redo, canUndo, canRedo } = usePortfolioHistory();

  return (
    <header className="editor-topbar">
      {/* 로고 */}
      <div className="editor-topbar-left">
        <span className="editor-logo">APolo</span>
        {template && (
          <span className="editor-doc-title">{template.title}</span>
        )}
        {isDirty && <span className="editor-dirty-dot" title="저장되지 않은 변경사항" />}
      </div>

      {/* 액션 */}
      <div className="editor-topbar-center">
        <button
          className={`editor-mode-btn ${previewMode === "template" ? "active" : ""}`}
          onClick={() => setPreviewMode("template")}
        >
          편집
        </button>
        <button
          className={`editor-mode-btn ${previewMode === "filled" ? "active" : ""}`}
          onClick={() => setPreviewMode("filled")}
        >
          미리보기
        </button>
      </div>

      <div className="editor-topbar-right">
        {/* Undo / Redo */}
        <button
          className="editor-icon-btn"
          onClick={() => undo()}
          disabled={!canUndo}
          title="실행 취소 (⌘Z)"
        >
          ↩
        </button>
        <button
          className="editor-icon-btn"
          onClick={() => redo()}
          disabled={!canRedo}
          title="다시 실행 (⌘⇧Z)"
        >
          ↪
        </button>
        <div className="editor-topbar-divider" />
        <button className="editor-save-btn" disabled={isSaving || !isDirty}>
          {isSaving ? "저장 중..." : "저장"}
        </button>
        <button className="editor-publish-btn">공유</button>
      </div>
    </header>
  );
}

// ─────────────────────────────────────────
// 좌측 블록 목록 패널
// ─────────────────────────────────────────

function BlockListPanel() {
  const template      = usePortfolioStore((s) => s.template);
  const selectedBlockId = usePortfolioStore((s) => s.selectedBlockId);
  const selectBlock   = usePortfolioStore((s) => s.selectBlock);
  const openSettingsPanel = usePortfolioStore((s) => s.openSettingsPanel);

  if (!template) return (
    <aside className="editor-block-list-panel editor-block-list-panel--empty">
      <p className="editor-panel-empty">아직 블록이 없습니다</p>
    </aside>
  );

  const rootBlocks = getRootBlocks(template);

  return (
    <aside className="editor-block-list-panel">
      <div className="editor-panel-header">
        <span className="editor-panel-title">블록 목록</span>
        <span className="editor-panel-count">{template.blocks.length}</span>
      </div>
      <div className="editor-block-list">
        {rootBlocks.map((block) => (
          <BlockListItem
            key={block.id}
            block={block}
            isSelected={selectedBlockId === block.id}
            onSelect={() => selectBlock(block.id)}
            onOpenSettings={() => openSettingsPanel(block.id)}
            childBlocks={
              (block.children ?? [])
                .map((id) => template.blocks.find((b) => b.id === id))
                .filter((b): b is AnyBlock => !!b)
            }
            allSelected={selectedBlockId}
          />
        ))}
      </div>
    </aside>
  );
}

function BlockListItem({
  block,
  isSelected,
  onSelect,
  onOpenSettings,
  childBlocks,
  allSelected,
}: {
  block: AnyBlock;
  isSelected: boolean;
  onSelect: () => void;
  onOpenSettings: () => void;
  childBlocks: AnyBlock[];
  allSelected: string | null;
}) {
  const registry = BLOCK_REGISTRY[block.type];
  const isHidden = block.layout?.hidden;

  return (
    <div className="block-list-group">
      <button
        className={[
          "block-list-item",
          isSelected ? "block-list-item--selected" : "",
          isHidden ? "block-list-item--hidden" : "",
        ].filter(Boolean).join(" ")}
        onClick={onSelect}
        onDoubleClick={onOpenSettings}
        title="더블클릭으로 설정 열기"
      >
        <span className={`block-list-item-dot block-list-item-dot--${block.category}`} />
        <span className="block-list-item-type">{registry.label}</span>
        <span className="block-list-item-id">{block.id}</span>
        {isHidden && <span className="block-list-item-hidden-badge">숨김</span>}
      </button>
      {/* children 들여쓰기 */}
      {childBlocks.length > 0 && (
        <div className="block-list-children">
          {childBlocks.map((child) => (
            <BlockListItem
              key={child.id}
              block={child}
              isSelected={allSelected === child.id}
              onSelect={() => {}}
              onOpenSettings={() => {}}
              childBlocks={[]}
              allSelected={allSelected}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────
// 중앙 캔버스
// ─────────────────────────────────────────

function EditorCanvas() {
  const template           = usePortfolioStore((s) => s.template);
  const content            = usePortfolioStore((s) => s.content);
  const previewMode        = usePortfolioStore((s) => s.previewMode);
  const selectedBlockId    = usePortfolioStore((s) => s.selectedBlockId);
  const selectBlock        = usePortfolioStore((s) => s.selectBlock);
  const openSettingsPanel  = usePortfolioStore((s) => s.openSettingsPanel);
  const updateContentValue = usePortfolioStore((s) => s.updateContentValue);
  const addBlock           = usePortfolioStore((s) => s.addBlock);
  const removeBlock        = usePortfolioStore((s) => s.removeBlock);
  const duplicateBlock     = usePortfolioStore((s) => s.duplicateBlock);
  const moveBlockUp        = usePortfolioStore((s) => s.moveBlockUp);
  const moveBlockDown      = usePortfolioStore((s) => s.moveBlockDown);
  const toggleBlockHidden  = usePortfolioStore((s) => s.toggleBlockHidden);
  const reorderBlocks      = usePortfolioStore((s) => s.reorderBlocks);

  const { activeBlockId, onDragStart, onDragEnd, onReorder } = useSortableBlocks({
    onReorder: reorderBlocks,
  });

  const handleAddBlock = useCallback(
    (type: BlockType, afterBlockId?: string, parentBlockId?: string) => {
      addBlock(type, afterBlockId, parentBlockId);
    },
    [addBlock]
  );

  // 빈 상태
  if (!template) {
    return (
      <main className="editor-canvas editor-canvas--empty">
        <div className="editor-canvas-empty-state">
          <p className="editor-canvas-empty-icon">✦</p>
          <p className="editor-canvas-empty-title">포트폴리오가 없습니다</p>
          <p className="editor-canvas-empty-desc">
            AI JSON을 붙여넣거나 블록을 추가해서 시작하세요
          </p>
        </div>
      </main>
    );
  }

  const rootBlocks = getRootBlocks(template);

  // filled 모드: 그냥 PreviewRenderer
  if (previewMode === "filled") {
    return (
      <main className="editor-canvas">
        <div className="editor-canvas-inner">
          <PreviewRenderer
            template={template}
            content={content}
            previewMode="filled"
          />
        </div>
      </main>
    );
  }

  // template(편집) 모드: SortableBlockList + BlockToolbar + DropZone
  return (
    <main
      className="editor-canvas"
      onClick={() => selectBlock(null)}
    >
      <div className="editor-canvas-inner">
        {/* 맨 위 DropZone */}
        <DropZone onAddBlock={handleAddBlock} />

        <SortableBlockList
          blocks={rootBlocks}
          onReorder={onReorder}
          activeBlockId={activeBlockId}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          renderOverlay={(block) => (
            <div className="editor-drag-overlay-label">
              {BLOCK_REGISTRY[block.type].label}
            </div>
          )}
        >
          {(block, index) => (
            <div
              key={block.id}
              className={[
                "editor-block-slot",
                selectedBlockId === block.id ? "editor-block-slot--selected" : "",
              ].filter(Boolean).join(" ")}
              onClick={(e) => {
                e.stopPropagation();
                selectBlock(block.id);
              }}
            >
              {/* BlockToolbar */}
              <BlockToolbar
                block={block}
                isFirst={index === 0}
                isLast={index === rootBlocks.length - 1}
                onMoveUp={moveBlockUp}
                onMoveDown={moveBlockDown}
                onDuplicate={duplicateBlock}
                onDelete={removeBlock}
                onToggleHidden={toggleBlockHidden}
                onOpenSettings={openSettingsPanel}
              />

              {/* 블록 렌더링 */}
              <BlockRenderer
                block={block}
                content={content}
                previewMode="template"
                allBlocks={template.blocks}
                onContentChange={updateContentValue}
                editable
                selectedBlockId={selectedBlockId ?? undefined}
                onSelectBlock={selectBlock}
              />

              {/* 블록 사이 DropZone */}
              <DropZone
                afterBlockId={block.id}
                onAddBlock={handleAddBlock}
              />
            </div>
          )}
        </SortableBlockList>
      </div>
    </main>
  );
}

// ─────────────────────────────────────────
// BlockEditorPage (메인)
// ─────────────────────────────────────────

export function BlockEditorPage() {
  const settingsPanelOpen  = useIsSettingsPanelOpen();
  const selectedBlock      = useSelectedBlock();
  const updateBlockLayout  = usePortfolioStore((s) => s.updateBlockLayout);
  const updateBlockStyle   = usePortfolioStore((s) => s.updateBlockStyle);
  const updateBlockProps   = usePortfolioStore((s) => s.updateBlockProps);
  const closeSettingsPanel = usePortfolioStore((s) => s.closeSettingsPanel);

  return (
    <div className="editor-root">
      <EditorTopBar />
      <div className="editor-body">
        <BlockListPanel />
        <EditorCanvas />
        {settingsPanelOpen && selectedBlock && (
          <BlockSettingsPanel
            block={selectedBlock}
            onLayoutChange={updateBlockLayout}
            onStyleChange={updateBlockStyle}
            onPropsChange={updateBlockProps}
            onClose={closeSettingsPanel}
          />
        )}
      </div>
    </div>
  );
}

export default BlockEditorPage;
