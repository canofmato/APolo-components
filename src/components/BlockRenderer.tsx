// ============================================================
// APolo Portfolio - BlockRenderer
// block.type에 따라 알맞은 뷰 또는 편집 컴포넌트를 렌더링
// ============================================================

import React from "react";
import type { AnyBlock, PortfolioContentDocument } from "../types/portfolio.types";
import type { PreviewMode, BlockField } from "../types/block.types";
import type { BlockValue } from "../types/template-blocks.types";
import {
  isHeroBlock,
  isProfileBlock,
  isProjectBlock,
  isSkillsBlock,
  isExperienceBlock,
  isContactBlock,
  isTextBlock,
  isImageBlock,
  isPaperBlock,
  isGalleryBlock,
  isTroubleshootingBlock,
  isProcessBlock,
  isArchitectureBlock,
  isMetricBlock,
  isSectionBlock,
  isColumnsBlock,
} from "../types/block-registry";
import {
  HeroBlockView,
  ProfileBlockView,
  ProjectBlockView,
  SkillsBlockView,
  ExperienceBlockView,
  ContactBlockView,
  TextBlockView,
  ImageBlockView,
  PaperBlockView,
  GalleryBlockView,
  TroubleshootingBlockView,
  ProcessBlockView,
  ArchitectureBlockView,
  MetricBlockView,
} from "./BlockViews";
import { FieldRenderer } from "./FieldRenderer";

// ─────────────────────────────────────────
// Props
// ─────────────────────────────────────────

interface BlockRendererProps {
  block: AnyBlock;
  content: PortfolioContentDocument | null;
  previewMode: PreviewMode;
  /** 블록 전체를 조회할 때 사용 (Section children 렌더링) */
  allBlocks: AnyBlock[];
  /** 콘텐츠 값 변경 핸들러 */
  onContentChange?: (blockId: string, key: string, value: unknown) => void;
  /** 에디터 모드 여부 (툴바/선택 UI 표시) */
  editable?: boolean;
  /** 현재 선택된 블록 ID */
  selectedBlockId?: string;
  onSelectBlock?: (blockId: string) => void;
}

// ─────────────────────────────────────────
// 콘텐츠 값 헬퍼
// ─────────────────────────────────────────

function getBlockValue(
  content: PortfolioContentDocument | null,
  blockId: string
): BlockValue | undefined {
  return content?.values.find((v) => v.blockId === blockId)?.value;
}

// ─────────────────────────────────────────
// Template 모드: 필드 편집 폼 렌더링
// ─────────────────────────────────────────

function TemplateBlockEditor({
  block,
  value,
  onContentChange,
}: {
  block: AnyBlock;
  value: BlockValue | undefined;
  onContentChange?: (blockId: string, key: string, value: unknown) => void;
}) {
  const fields: BlockField[] = block.fields ?? [];
  if (fields.length === 0) return null;
  const contextValue = (value as Record<string, unknown>) ?? {};

  const handleChange = (key: string, val: unknown) => {
    onContentChange?.(block.id, key, val);
  };

  return (
    <div className="block-editor-fields">
      {fields.map((field) => (
        <FieldRenderer
          key={field.key}
          field={field}
          value={contextValue?.[field.key]}
          onChange={handleChange}
          contextValue={contextValue}
        />
      ))}
    </div>
  );
}

// ─────────────────────────────────────────
// Filled 모드: 실제 뷰 렌더링
// ─────────────────────────────────────────

function FilledBlockView({
  block,
  value,
}: {
  block: AnyBlock;
  value: BlockValue | undefined;
}) {
  // 값이 없는 경우 placeholder
  if (!value) {
    return (
      <div className="block-empty-placeholder">
        <span>{block.label} 내용을 입력해주세요</span>
      </div>
    );
  }

  if (isHeroBlock(block)) {
    return <HeroBlockView value={value as never} props={block.props} />;
  }
  if (isProfileBlock(block)) {
    return <ProfileBlockView value={value as never} props={block.props} />;
  }
  if (isProjectBlock(block)) {
    return <ProjectBlockView value={value as never} props={block.props} />;
  }
  if (isSkillsBlock(block)) {
    return <SkillsBlockView value={value as never} props={block.props} />;
  }
  if (isExperienceBlock(block)) {
    return <ExperienceBlockView value={value as never} />;
  }
  if (isContactBlock(block)) {
    return <ContactBlockView value={value as never} props={block.props} />;
  }
  if (isTextBlock(block)) {
    return <TextBlockView value={value as never} />;
  }
  if (isImageBlock(block)) {
    return <ImageBlockView value={value as never} props={block.props} />;
  }
  if (isPaperBlock(block)) {
    return <PaperBlockView value={value as never} props={block.props} />;
  }
  if (isGalleryBlock(block)) {
    return <GalleryBlockView value={value as never} props={block.props} />;
  }
  if (isTroubleshootingBlock(block)) {
    return (
      <TroubleshootingBlockView value={value as never} props={block.props} />
    );
  }
  if (isProcessBlock(block)) {
    return <ProcessBlockView value={value as never} props={block.props} />;
  }
  if (isArchitectureBlock(block)) {
    return (
      <ArchitectureBlockView value={value as never} props={block.props} />
    );
  }
  if (isMetricBlock(block)) {
    return <MetricBlockView value={value as never} props={block.props} />;
  }

  return null;
}

// ─────────────────────────────────────────
// Layout Block Renderers
// ─────────────────────────────────────────

function SectionBlockRenderer({
  block,
  children,
}: {
  block: AnyBlock;
  children: React.ReactNode;
}) {
  if (!isSectionBlock(block)) return null;
  const { title, description, variant } = block.props ?? {};

  return (
    <section
      className={`block-section block-section--${variant ?? "default"}`}
      data-block-id={block.id}
    >
      {(title || description) && (
        <div className="block-section-header">
          {title && <h2 className="block-section-title">{title}</h2>}
          {description && (
            <p className="block-section-desc">{description}</p>
          )}
        </div>
      )}
      <div className="block-section-body">{children}</div>
    </section>
  );
}

function ColumnsBlockRenderer({
  block,
  children,
}: {
  block: AnyBlock;
  children: React.ReactNode[];
}) {
  if (!isColumnsBlock(block)) return null;
  const { count = 2, ratios, gap = 24 } = block.props ?? {};

  const gridTemplate = ratios
    ? ratios.map((r) => `${r}fr`).join(" ")
    : `repeat(${count}, 1fr)`;

  return (
    <div
      className="block-columns"
      data-block-id={block.id}
      style={{ display: "grid", gridTemplateColumns: gridTemplate, gap }}
    >
      {children}
    </div>
  );
}

// ─────────────────────────────────────────
// BlockRenderer (메인)
// ─────────────────────────────────────────

export function BlockRenderer({
  block,
  content,
  previewMode,
  allBlocks,
  onContentChange,
  editable = false,
  selectedBlockId,
  onSelectBlock,
}: BlockRendererProps) {
  if (block.layout?.hidden) return null;

  const isSelected = selectedBlockId === block.id;
  const value = getBlockValue(content, block.id);

  // ── 레이아웃 블록 처리 ──
  if (isSectionBlock(block) || isColumnsBlock(block)) {
    const childBlocks = (block.children ?? [])
      .map((id) => allBlocks.find((b) => b.id === id))
      .filter((b): b is AnyBlock => !!b);

    const childElements = childBlocks.map((child) => (
      <BlockRenderer
        key={child.id}
        block={child}
        content={content}
        previewMode={previewMode}
        allBlocks={allBlocks}
        onContentChange={onContentChange}
        editable={editable}
        selectedBlockId={selectedBlockId}
        onSelectBlock={onSelectBlock}
      />
    ));

    const layoutBlock = isSectionBlock(block) ? (
      <SectionBlockRenderer block={block}>
        {childElements}
      </SectionBlockRenderer>
    ) : (
      <ColumnsBlockRenderer block={block}>
        {childElements}
      </ColumnsBlockRenderer>
    );

    return (
      <BlockWrapper
        block={block}
        editable={editable}
        isSelected={isSelected}
        onSelect={onSelectBlock}
      >
        {layoutBlock}
      </BlockWrapper>
    );
  }

  // spacer
  if (block.type === "spacer") {
    const size = (block.props as { size?: number })?.size ?? 24;
    return <div className="block-spacer" style={{ height: size }} />;
  }

  // divider
  if (block.type === "divider") {
    return <hr className="block-divider" data-block-id={block.id} />;
  }

  // ── 템플릿 블록 처리 ──
  return (
    <BlockWrapper
      block={block}
      editable={editable}
      isSelected={isSelected}
      onSelect={onSelectBlock}
    >
      <div
        className="block-inner"
        style={{
          padding: block.layout?.padding ?? 24,
        }}
      >
        {previewMode === "template" ? (
          <TemplateBlockEditor
            block={block}
            value={value}
            onContentChange={onContentChange}
          />
        ) : (
          <FilledBlockView block={block} value={value} />
        )}
      </div>
    </BlockWrapper>
  );
}

// ─────────────────────────────────────────
// BlockWrapper: 선택/에디터 상태 UI
// ─────────────────────────────────────────

function BlockWrapper({
  block,
  editable,
  isSelected,
  onSelect,
  children,
}: {
  block: AnyBlock;
  editable: boolean;
  isSelected: boolean;
  onSelect?: (id: string) => void;
  children: React.ReactNode;
}) {
  const span = block.layout?.span ?? 12;

  return (
    <div
      className={[
        "block-wrapper",
        `block-wrapper--span-${span}`,
        isSelected ? "block-wrapper--selected" : "",
        editable ? "block-wrapper--editable" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      data-block-id={block.id}
      data-block-type={block.type}
      onClick={
        editable && onSelect ? () => onSelect(block.id) : undefined
      }
    >
      {children}
    </div>
  );
}

export default BlockRenderer;
