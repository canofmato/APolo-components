import { useEffect, useMemo, useState } from "react";
import { usePortfolioStore } from "./store/portfolioStore";
import type { AIPortfolioResponse } from "./store/portfolioStore";

type JobType = "developer" | "designer" | "cv";
type CareerLevel = "entry" | "three_plus" | "five_plus" | "ten_plus";

interface PortfolioGeneratorPageProps {
  onGenerated: () => void;
}

const JOB_OPTIONS: Array<{ value: JobType; label: string; detail: string }> = [
  { value: "developer", label: "개발자", detail: "프로젝트와 문제 해결 중심" },
  { value: "designer", label: "디자이너", detail: "작업물과 과정 중심" },
  { value: "cv", label: "대학원 CV", detail: "연구 관심과 논문 중심" },
];

const CAREER_OPTIONS: Array<{ value: CareerLevel; label: string }> = [
  { value: "entry", label: "신입" },
  { value: "three_plus", label: "3년 이상" },
  { value: "five_plus", label: "5년 이상" },
  { value: "ten_plus", label: "10년 이상" },
];

const GENERATION_STEPS = [
  "컴포넌트 명세 확인 중",
  "레이아웃 구성 중",
  "블록 묶음 검증 중",
  "편집기 준비 중",
];

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000";

export function PortfolioGeneratorPage({ onGenerated }: PortfolioGeneratorPageProps) {
  const [jobType, setJobType] = useState<JobType>("developer");
  const [careerLevel, setCareerLevel] = useState<CareerLevel>("entry");
  const [request, setRequest] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [error, setError] = useState("");
  const loadFromAI = usePortfolioStore((state) => state.loadFromAI);
  const setStoreGenerating = usePortfolioStore((state) => state.setIsGenerating);

  const canSubmit = useMemo(
    () => request.trim().length >= 5 && !isGenerating,
    [request, isGenerating],
  );

  useEffect(() => {
    if (!isGenerating) return;

    const timer = window.setInterval(() => {
      setStepIndex((current) => Math.min(current + 1, GENERATION_STEPS.length - 1));
    }, 2200);

    return () => window.clearInterval(timer);
  }, [isGenerating]);

  const handleGenerate = async () => {
    if (!canSubmit) return;

    setError("");
    setStepIndex(0);
    setIsGenerating(true);
    setStoreGenerating(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/portfolio/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobType, careerLevel, request: request.trim() }),
      });

      const data = await response.json().catch(() => null);
      if (!response.ok) {
        const message = data?.detail ?? "포트폴리오를 생성하지 못했습니다.";
        throw new Error(message);
      }
      if (!data?.portfolioTemplate || !Array.isArray(data.portfolioTemplate.blocks)) {
        throw new Error("서버에서 올바른 포트폴리오 데이터를 받지 못했습니다.");
      }

      setStepIndex(GENERATION_STEPS.length - 1);
      loadFromAI(data as AIPortfolioResponse);
      onGenerated();
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : "알 수 없는 오류가 발생했습니다.";
      setError(
        message === "Failed to fetch"
          ? "FastAPI 서버에 연결할 수 없습니다. 백엔드가 실행 중인지 확인해주세요."
          : message,
      );
    } finally {
      setIsGenerating(false);
      setStoreGenerating(false);
    }
  };

  return (
    <main className="generator-page">
      <header className="generator-header">
        <span className="generator-brand">APolo</span>
        <div>
          <h1>AI 포트폴리오 생성</h1>
          <p>목적과 경력에 맞는 편집 가능한 포트폴리오 초안을 만듭니다.</p>
        </div>
      </header>

      <form
        className="generator-form"
        onSubmit={(event) => {
          event.preventDefault();
          void handleGenerate();
        }}
      >
        <fieldset className="generator-fieldset" disabled={isGenerating}>
          <legend>직무 선택</legend>
          <div className="job-options">
            {JOB_OPTIONS.map((option) => (
              <button
                type="button"
                key={option.value}
                className={`job-option${jobType === option.value ? " is-selected" : ""}`}
                aria-pressed={jobType === option.value}
                onClick={() => setJobType(option.value)}
              >
                <strong>{option.label}</strong>
                <span>{option.detail}</span>
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="generator-fieldset" disabled={isGenerating}>
          <legend>경력 수준</legend>
          <div className="career-options">
            {CAREER_OPTIONS.map((option) => (
              <button
                type="button"
                key={option.value}
                className={careerLevel === option.value ? "is-selected" : ""}
                aria-pressed={careerLevel === option.value}
                onClick={() => setCareerLevel(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </fieldset>

        <div className="generator-request">
          <label htmlFor="portfolio-request">원하는 구성과 강조할 내용</label>
          <textarea
            id="portfolio-request"
            value={request}
            maxLength={2000}
            disabled={isGenerating}
            onChange={(event) => setRequest(event.target.value)}
            placeholder="예: 이미지가 크게 보이는 밝은 포트폴리오를 원해요. 브랜딩 프로젝트 3개와 작업 과정을 강조해주세요."
          />
          <span className="generator-character-count">{request.length} / 2000</span>
        </div>

        {isGenerating && (
          <div className="generation-progress" role="status" aria-live="polite">
            <div className="generation-progress-track">
              <span style={{ width: `${((stepIndex + 1) / GENERATION_STEPS.length) * 100}%` }} />
            </div>
            <p>{GENERATION_STEPS[stepIndex]}</p>
          </div>
        )}

        {error && <p className="generator-error" role="alert">{error}</p>}

        <button className="generator-submit" type="submit" disabled={!canSubmit}>
          {isGenerating ? "생성 중" : "포트폴리오 생성하기"}
        </button>
      </form>
    </main>
  );
}
