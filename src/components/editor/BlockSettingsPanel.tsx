// ============================================================
// APolo Portfolio - BlockSettingsPanel
// 선택된 블록의 layout / style / props 를 편집하는 사이드 패널
// ============================================================

import React, { useCallback } from "react";
import type { AnyBlock } from "../../types/portfolio.types";
import type { BlockLayout, BlockStyle } from "../../types/block.types";
import { BLOCK_REGISTRY } from "../../types/block-registry";

// ─────────────────────────────────────────
// Props
// ─────────────────────────────────────────

interface BlockSettingsPanelProps {
  block: AnyBlock;
  onLayoutChange: (blockId: string, layout: Partial<BlockLayout>) => void;
  onStyleChange: (blockId: string, style: Partial<BlockStyle>) => void;
  onPropsChange: (blockId: string, props: Record<string, unknown>) => void;
  onClose: () => void;
}

// ─────────────────────────────────────────
// 공통 설정 입력 컴포넌트들
// ─────────────────────────────────────────

function SettingRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="settings-row">
      <label className="settings-row-label">{label}</label>
      <div className="settings-row-control">{children}</div>
    </div>
  );
}

function SettingSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="settings-section">
      <h4 className="settings-section-title">{title}</h4>
      {children}
    </div>
  );
}

// span 슬라이더: 1~12
function SpanControl({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="settings-span-control">
      <input
        type="range"
        min={1}
        max={12}
        step={1}
        value={value}
        className="settings-slider"
        onChange={(e) => onChange(Number(e.target.value))}
      />
      <span className="settings-span-value">{value} / 12</span>
    </div>
  );
}

// padding 슬라이더: 0~64 (8px 단위)
function PaddingControl({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="settings-span-control">
      <input
        type="range"
        min={0}
        max={64}
        step={4}
        value={value}
        className="settings-slider"
        onChange={(e) => onChange(Number(e.target.value))}
      />
      <span className="settings-span-value">{value}px</span>
    </div>
  );
}

// emphasis 선택
function EmphasisControl({
  value,
  onChange,
}: {
  value: "high" | "medium" | "low" | undefined;
  onChange: (v: "high" | "medium" | "low") => void;
}) {
  const options: { value: "high" | "medium" | "low"; label: string }[] = [
    { value: "high", label: "강조" },
    { value: "medium", label: "보통" },
    { value: "low", label: "낮음" },
  ];

  return (
    <div className="settings-segmented">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          className={`settings-seg-btn ${value === opt.value ? "active" : ""}`}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

// variant 선택
function VariantControl({
  value,
  onChange,
}: {
  value: string | undefined;
  onChange: (v: string) => void;
}) {
  const options = [
    { value: "default", label: "기본" },
    { value: "highlight", label: "강조" },
    { value: "minimal", label: "미니멀" },
    { value: "ghost", label: "고스트" },
  ];

  return (
    <div className="settings-segmented settings-segmented--wrap">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          className={`settings-seg-btn ${value === opt.value ? "active" : ""}`}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

// 정렬 선택
function AlignControl({
  value,
  onChange,
}: {
  value: "left" | "center" | "right" | undefined;
  onChange: (v: "left" | "center" | "right") => void;
}) {
  const options: { value: "left" | "center" | "right"; label: string }[] = [
    { value: "left", label: "왼쪽" },
    { value: "center", label: "가운데" },
    { value: "right", label: "오른쪽" },
  ];

  return (
    <div className="settings-segmented">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          className={`settings-seg-btn ${value === opt.value ? "active" : ""}`}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────
// 블록 타입별 Props 설정 섹션
// ─────────────────────────────────────────

function PropsSection({
  block,
  onPropsChange,
}: {
  block: AnyBlock;
  onPropsChange: (blockId: string, props: Record<string, unknown>) => void;
}) {
  const props = (block.props ?? {}) as Record<string, unknown>;

  const update = useCallback(
    (key: string, value: unknown) => {
      onPropsChange(block.id, { ...props, [key]: value });
    },
    [block.id, props, onPropsChange]
  );

  switch (block.type) {
    case "hero":
      return (
        <SettingSection title="Hero 설정">
          <SettingRow label="CTA 버튼 표시">
            <input
              type="checkbox"
              checked={!!(props.showCta)}
              onChange={(e) => update("showCta", e.target.checked)}
            />
          </SettingRow>
          <SettingRow label="이미지 표시">
            <input
              type="checkbox"
              checked={!!(props.showImage)}
              onChange={(e) => update("showImage", e.target.checked)}
            />
          </SettingRow>
        </SettingSection>
      );

    case "profile":
      return (
        <SettingSection title="Profile 설정">
          <SettingRow label="이미지 모양">
            <div className="settings-segmented">
              {(["circle", "rounded", "square"] as const).map((shape) => (
                <button
                  key={shape}
                  type="button"
                  className={`settings-seg-btn ${props.imageShape === shape ? "active" : ""}`}
                  onClick={() => update("imageShape", shape)}
                >
                  {shape === "circle" ? "원형" : shape === "rounded" ? "둥근" : "사각"}
                </button>
              ))}
            </div>
          </SettingRow>
          <SettingRow label="위치 표시">
            <input
              type="checkbox"
              checked={!!(props.showLocation)}
              onChange={(e) => update("showLocation", e.target.checked)}
            />
          </SettingRow>
          <SettingRow label="링크 표시">
            <input
              type="checkbox"
              checked={!!(props.showLinks)}
              onChange={(e) => update("showLinks", e.target.checked)}
            />
          </SettingRow>
        </SettingSection>
      );

    case "project":
      return (
        <SettingSection title="Project 설정">
          <SettingRow label="표시 방식">
            <div className="settings-segmented">
              {(["card", "grid", "list"] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  className={`settings-seg-btn ${props.display === mode ? "active" : ""}`}
                  onClick={() => update("display", mode)}
                >
                  {mode === "card" ? "카드" : mode === "grid" ? "그리드" : "목록"}
                </button>
              ))}
            </div>
          </SettingRow>
          <SettingRow label="썸네일 표시">
            <input
              type="checkbox"
              checked={!!(props.showThumbnail)}
              onChange={(e) => update("showThumbnail", e.target.checked)}
            />
          </SettingRow>
        </SettingSection>
      );

    case "skills":
      return (
        <SettingSection title="Skills 설정">
          <SettingRow label="표시 방식">
            <div className="settings-segmented">
              {(["tag", "list", "grid"] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  className={`settings-seg-btn ${props.display === mode ? "active" : ""}`}
                  onClick={() => update("display", mode)}
                >
                  {mode === "tag" ? "태그" : mode === "list" ? "목록" : "그리드"}
                </button>
              ))}
            </div>
          </SettingRow>
        </SettingSection>
      );

    case "contact":
      return (
        <SettingSection title="Contact 설정">
          <SettingRow label="표시 방식">
            <div className="settings-segmented">
              {(["iconList", "list"] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  className={`settings-seg-btn ${props.display === mode ? "active" : ""}`}
                  onClick={() => update("display", mode)}
                >
                  {mode === "iconList" ? "아이콘 목록" : "목록"}
                </button>
              ))}
            </div>
          </SettingRow>
        </SettingSection>
      );

    case "gallery":
      return (
        <SettingSection title="Gallery 설정">
          <SettingRow label="표시 방식">
            <div className="settings-segmented">
              {(["grid", "feature", "carousel"] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  className={`settings-seg-btn ${props.layout === mode ? "active" : ""}`}
                  onClick={() => update("layout", mode)}
                >
                  {mode === "grid" ? "그리드" : mode === "feature" ? "강조" : "캐러셀"}
                </button>
              ))}
            </div>
          </SettingRow>
        </SettingSection>
      );

    case "process":
      return (
        <SettingSection title="Process 설정">
          <SettingRow label="표시 방식">
            <div className="settings-segmented">
              {(["timeline", "stack"] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  className={`settings-seg-btn ${props.layout === mode ? "active" : ""}`}
                  onClick={() => update("layout", mode)}
                >
                  {mode === "timeline" ? "타임라인" : "스택"}
                </button>
              ))}
            </div>
          </SettingRow>
        </SettingSection>
      );

    case "architecture":
      return (
        <SettingSection title="Architecture 설정">
          <SettingRow label="구조 이미지 표시">
            <input
              type="checkbox"
              checked={props.showDiagram !== false}
              onChange={(e) => update("showDiagram", e.target.checked)}
            />
          </SettingRow>
        </SettingSection>
      );

    case "metric":
      return (
        <SettingSection title="Metric 설정">
          <SettingRow label="표시 방식">
            <div className="settings-segmented">
              {(["single", "compact"] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  className={`settings-seg-btn ${props.emphasis === mode ? "active" : ""}`}
                  onClick={() => update("emphasis", mode)}
                >
                  {mode === "single" ? "크게" : "컴팩트"}
                </button>
              ))}
            </div>
          </SettingRow>
        </SettingSection>
      );

    case "section":
      return (
        <SettingSection title="Section 설정">
          <SettingRow label="제목">
            <input
              type="text"
              className="settings-input"
              value={(props.title as string) ?? ""}
              placeholder="섹션 제목"
              onChange={(e) => update("title", e.target.value)}
            />
          </SettingRow>
          <SettingRow label="설명">
            <input
              type="text"
              className="settings-input"
              value={(props.description as string) ?? ""}
              placeholder="섹션 설명 (선택)"
              onChange={(e) => update("description", e.target.value)}
            />
          </SettingRow>
        </SettingSection>
      );

    case "columns":
      return (
        <SettingSection title="Columns 설정">
          <SettingRow label="컬럼 수">
            <div className="settings-segmented">
              {([2, 3] as const).map((n) => (
                <button
                  key={n}
                  type="button"
                  className={`settings-seg-btn ${props.count === n ? "active" : ""}`}
                  onClick={() => update("count", n)}
                >
                  {n}단
                </button>
              ))}
            </div>
          </SettingRow>
        </SettingSection>
      );

    default:
      return null;
  }
}

// ─────────────────────────────────────────
// BlockSettingsPanel (메인)
// ─────────────────────────────────────────

export function BlockSettingsPanel({
  block,
  onLayoutChange,
  onStyleChange,
  onPropsChange,
  onClose,
}: BlockSettingsPanelProps) {
  const registry = BLOCK_REGISTRY[block.type];
  const meta = block.agentMeta;
  const layout = block.layout ?? {};
  const style = block.style ?? {};

  const editableKeys = new Set(meta?.editableLayoutKeys ?? ["span", "order", "padding"]);

  const updateLayout = (partial: Partial<BlockLayout>) => {
    onLayoutChange(block.id, partial);
  };

  const updateStyle = (partial: Partial<BlockStyle>) => {
    onStyleChange(block.id, partial);
  };

  return (
    <aside className="block-settings-panel" aria-label="블록 설정">
      {/* 헤더 */}
      <div className="settings-panel-header">
        <div className="settings-panel-title">
          <span className="settings-panel-type-badge">{registry.label}</span>
          <span className="settings-panel-block-label">{block.label}</span>
        </div>
        <button
          type="button"
          className="settings-panel-close"
          aria-label="설정 닫기"
          onClick={onClose}
        >
          ×
        </button>
      </div>

      <div className="settings-panel-body">

        {/* ── 레이아웃 섹션 ── */}
        <SettingSection title="레이아웃">
          {editableKeys.has("span") && (
            <SettingRow label="너비 (Span)">
              <SpanControl
                value={layout.span ?? 12}
                onChange={(v) => updateLayout({ span: v })}
              />
            </SettingRow>
          )}
          {editableKeys.has("padding") && (
            <SettingRow label="패딩">
              <PaddingControl
                value={layout.padding ?? 24}
                onChange={(v) => updateLayout({ padding: v })}
              />
            </SettingRow>
          )}
          {editableKeys.has("align") && (
            <SettingRow label="정렬">
              <AlignControl
                value={layout.align}
                onChange={(v) => updateLayout({ align: v })}
              />
            </SettingRow>
          )}
          {editableKeys.has("hidden") && (
            <SettingRow label="숨기기">
              <input
                type="checkbox"
                checked={!!layout.hidden}
                onChange={(e) => updateLayout({ hidden: e.target.checked })}
              />
            </SettingRow>
          )}
        </SettingSection>

        {/* ── 스타일 섹션 ── */}
        <SettingSection title="스타일">
          <SettingRow label="강조도">
            <EmphasisControl
              value={style.emphasis}
              onChange={(v) => updateStyle({ emphasis: v })}
            />
          </SettingRow>
          <SettingRow label="변형">
            <VariantControl
              value={style.variant}
              onChange={(v) => updateStyle({ variant: v as BlockStyle["variant"] })}
            />
          </SettingRow>
        </SettingSection>

        {/* ── 블록 타입별 Props 섹션 ── */}
        <PropsSection block={block} onPropsChange={onPropsChange} />

        {/* ── 블록 정보 ── */}
        <SettingSection title="블록 정보">
          <div className="settings-block-info">
            <span className="settings-info-item">
              <span className="settings-info-key">ID</span>
              <code className="settings-info-val">{block.id}</code>
            </span>
            <span className="settings-info-item">
              <span className="settings-info-key">타입</span>
              <code className="settings-info-val">{block.type}</code>
            </span>
            <span className="settings-info-item">
              <span className="settings-info-key">카테고리</span>
              <code className="settings-info-val">{block.category}</code>
            </span>
            {block.repeatable && (
              <span className="settings-info-item">
                <span className="settings-info-key">반복</span>
                <code className="settings-info-val">
                  {block.minItems ?? 1} ~ {block.maxItems ?? "∞"}
                </code>
              </span>
            )}
          </div>
        </SettingSection>
      </div>
    </aside>
  );
}

export default BlockSettingsPanel;
