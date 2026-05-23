// ============================================================
// APolo Portfolio - Setting Input Components
// NumberInput / RangeSlider / SegmentedControl / DatePicker
// 레이아웃·설정 패널에서 사용하는 독립 입력 컴포넌트
// ============================================================

import React from "react";

// ─────────────────────────────────────────
// NumberInput
// span, order, padding, gap 설정
// ─────────────────────────────────────────

interface NumberInputProps {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  unit?: string;
  disabled?: boolean;
}

export function NumberInput({
  value,
  onChange,
  min = 0,
  max = 9999,
  step = 1,
  label,
  unit,
  disabled,
}: NumberInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const parsed = Number(e.target.value);
    if (!Number.isNaN(parsed)) {
      onChange(Math.min(max, Math.max(min, parsed)));
    }
  };

  const decrement = () => onChange(Math.max(min, value - step));
  const increment = () => onChange(Math.min(max, value + step));

  return (
    <div className="number-input" aria-label={label}>
      <button
        type="button"
        className="number-input-btn"
        onClick={decrement}
        disabled={disabled || value <= min}
        aria-label="감소"
      >
        −
      </button>
      <input
        type="number"
        className="number-input-field"
        value={value}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        onChange={handleChange}
        aria-label={label}
      />
      {unit && <span className="number-input-unit">{unit}</span>}
      <button
        type="button"
        className="number-input-btn"
        onClick={increment}
        disabled={disabled || value >= max}
        aria-label="증가"
      >
        +
      </button>
    </div>
  );
}

// ─────────────────────────────────────────
// RangeSlider
// 간격, 강조도, 크기 조절
// ─────────────────────────────────────────

interface RangeSliderProps {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  unit?: string;
  showValue?: boolean;
  disabled?: boolean;
}

export function RangeSlider({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  label,
  unit,
  showValue = true,
  disabled,
}: RangeSliderProps) {
  const percent = ((value - min) / (max - min)) * 100;

  return (
    <div className="range-slider" aria-label={label}>
      <div className="range-slider-track">
        <div
          className="range-slider-fill"
          style={{ width: `${percent}%` }}
        />
        <input
          type="range"
          className="range-slider-input"
          value={value}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          onChange={(e) => onChange(Number(e.target.value))}
          aria-label={label}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
        />
      </div>
      {showValue && (
        <span className="range-slider-value">
          {value}
          {unit}
        </span>
      )}
    </div>
  );
}

// ─────────────────────────────────────────
// SegmentedControl
// 정렬, 방향, 스타일 분기 선택
// ─────────────────────────────────────────

interface SegmentedOption<T extends string> {
  value: T;
  label: string;
  icon?: React.ReactNode;
}

interface SegmentedControlProps<T extends string> {
  options: SegmentedOption<T>[];
  value: T;
  onChange: (v: T) => void;
  label?: string;
  disabled?: boolean;
  size?: "sm" | "md";
  fullWidth?: boolean;
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  label,
  disabled,
  size = "md",
  fullWidth = false,
}: SegmentedControlProps<T>) {
  return (
    <div
      className={[
        "segmented-control",
        `segmented-control--${size}`,
        fullWidth ? "segmented-control--full" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      role="group"
      aria-label={label}
    >
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          role="radio"
          aria-checked={value === opt.value}
          className={[
            "segmented-control-btn",
            value === opt.value ? "segmented-control-btn--active" : "",
          ]
            .filter(Boolean)
            .join(" ")}
          disabled={disabled}
          onClick={() => onChange(opt.value)}
        >
          {opt.icon && (
            <span className="segmented-control-icon">{opt.icon}</span>
          )}
          {opt.label}
        </button>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────
// DatePicker
// 단일 날짜 입력
// ─────────────────────────────────────────

interface DatePickerProps {
  value: string; // ISO 날짜 문자열 (YYYY-MM-DD)
  onChange: (v: string) => void;
  label?: string;
  placeholder?: string;
  min?: string;
  max?: string;
  disabled?: boolean;
}

export function DatePicker({
  value,
  onChange,
  label,
  placeholder,
  min,
  max,
  disabled,
}: DatePickerProps) {
  return (
    <div className="date-picker" aria-label={label}>
      <input
        type="date"
        className="date-picker-input"
        value={value ?? ""}
        placeholder={placeholder}
        min={min}
        max={max}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        aria-label={label}
      />
    </div>
  );
}
