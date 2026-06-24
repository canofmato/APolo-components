import { useState } from "react";

// ============================================================
// APolo Portfolio - Block View Components (filled/preview mode)
// 각 블록 타입의 실제 렌더링 결과물 컴포넌트
// ============================================================

import type {
  HeroBlockValue,
  ProfileBlockValue,
  ProjectBlockValue,
  SkillsBlockValue,
  ExperienceBlockValue,
  ContactBlockValue,
  TextBlockValue,
  ImageBlockValue,
  PaperBlockValue,
  GalleryBlockValue,
  TroubleshootingBlockValue,
  ProcessBlockValue,
  ArchitectureBlockValue,
  MetricBlockValue,
  LinkItem,
  DateRange,
} from "../types/template-blocks.types";
import type {
  HeroBlockProps,
  ProfileBlockProps,
  ProjectBlockProps,
  SkillsBlockProps,
  ContactBlockProps,
  ImageBlockProps,
  PaperBlockProps,
  GalleryBlockProps,
  TroubleshootingBlockProps,
  ProcessBlockProps,
  ArchitectureBlockProps,
  MetricBlockProps,
} from "../types/template-blocks.types";

// ─────────────────────────────────────────
// 공통 유틸
// ─────────────────────────────────────────

function formatDateRange(range?: DateRange): string {
  if (!range) return "";
  const start = range.start
    ? new Date(range.start).toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "short",
      })
    : "";
  const end = range.isCurrent
    ? "현재"
    : range.end
    ? new Date(range.end).toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "short",
      })
    : "";
  return [start, end].filter(Boolean).join(" – ");
}

function ExternalLink({ item }: { item: LinkItem }) {
  return (
    <a
      href={item.url}
      target={item.target ?? "_blank"}
      rel="noopener noreferrer"
      className="block-link"
    >
      {item.label}
    </a>
  );
}

// ─────────────────────────────────────────
// HeroBlockView
// ─────────────────────────────────────────

export function HeroBlockView({
  value,
  props,
}: {
  value: HeroBlockValue;
  props?: HeroBlockProps;
}) {
  const shouldShowImage = Boolean(value.heroImage);

  return (
    <div className="block-view block-hero">
      {shouldShowImage && (
        <div className="block-hero-image">
          <img src={value.heroImage} alt="hero" />
        </div>
      )}
      <div className="block-hero-content">
        {value.headline && (
          <h1 className="block-hero-headline">{value.headline}</h1>
        )}
        {value.subheadline && (
          <p className="block-hero-sub">{value.subheadline}</p>
        )}
        {props?.showCta && value.ctaLabel && value.ctaLink && (
          <a
            href={value.ctaLink}
            className="block-hero-cta"
            target="_blank"
            rel="noopener noreferrer"
          >
            {value.ctaLabel}
          </a>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// ProfileBlockView
// ─────────────────────────────────────────

export function ProfileBlockView({
  value,
  props,
}: {
  value: ProfileBlockValue;
  props?: ProfileBlockProps;
}) {
  const imageClass =
    props?.imageShape === "square"
      ? "block-profile-img--square"
      : props?.imageShape === "rounded"
      ? "block-profile-img--rounded"
      : "block-profile-img--circle";

  return (
    <div className="block-view block-profile">
      {value.profileImage && (
        <img
          src={value.profileImage}
          alt={value.name ?? "profile"}
          className={`block-profile-img ${imageClass}`}
        />
      )}
      <div className="block-profile-info">
        {value.name && <h2 className="block-profile-name">{value.name}</h2>}
        {value.role && <p className="block-profile-role">{value.role}</p>}
        {props?.showLocation && value.location && (
          <p className="block-profile-location">📍 {value.location}</p>
        )}
        {value.intro && (
          <p className="block-profile-intro">{value.intro}</p>
        )}
        {props?.showLinks && value.links && value.links.length > 0 && (
          <div className="block-profile-links">
            {value.links.map((link, i) => (
              <ExternalLink key={i} item={link} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// ProjectBlockView
// ─────────────────────────────────────────

export function ProjectBlockView({
  value,
  props,
}: {
  value: ProjectBlockValue;
  props?: ProjectBlockProps;
}) {
  const displayClass =
    props?.display === "list"
      ? "block-project--list"
      : props?.display === "grid"
      ? "block-project--grid"
      : "block-project--card";

  return (
    <div className={`block-view block-project ${displayClass}`}>
      {props?.showThumbnail !== false && value.thumbnail && (
        <div className="block-project-thumb">
          <img src={value.thumbnail} alt={value.title || "프로젝트 썸네일"} />
        </div>
      )}
      <div className="block-project-body">
        {value.title && (
          <h3 className="block-project-title">{value.title}</h3>
        )}
        {value.period && (
          <p className="block-project-period">
            {formatDateRange(value.period)}
          </p>
        )}
        {value.role && (
          <p className="block-project-role">역할: {value.role}</p>
        )}
        {value.summary && (
          <p className="block-project-summary">{value.summary}</p>
        )}
        {value.techStack && value.techStack.length > 0 && (
          <div className="block-project-stack">
            {value.techStack.map((tech) => (
              <span key={tech} className="block-tag">
                {tech}
              </span>
            ))}
          </div>
        )}
        {value.links && value.links.length > 0 && (
          <div className="block-project-links">
            {value.links.map((link, i) => (
              <ExternalLink key={i} item={link} />
            ))}
          </div>
        )}
        {value.troubleshooting && value.troubleshooting.length > 0 && (
          <div className="block-project-troubleshooting">
            <p className="block-project-troubleshooting-title">트러블슈팅</p>
            {value.troubleshooting.map((item, i) => (
              <div key={i} className="block-project-trouble-item">
                <p className="block-project-trouble-problem">
                  <span className="block-project-trouble-label">문제</span>
                  {item.problem}
                </p>
                <p className="block-project-trouble-solution">
                  <span className="block-project-trouble-label">해결</span>
                  {item.solution}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// SkillsBlockView
// ─────────────────────────────────────────

export function SkillsBlockView({
  value,
  props,
}: {
  value: SkillsBlockValue;
  props?: SkillsBlockProps;
}) {
  const displayClass =
    props?.display === "list"
      ? "block-skills--list"
      : props?.display === "grid"
      ? "block-skills--grid"
      : "block-skills--tag";

  return (
    <div className={`block-view block-skills ${displayClass}`}>
      {value.category && (
        <h4 className="block-skills-category">{value.category}</h4>
      )}
      <div className="block-skills-items">
        {value.items.map((item) => (
          <span key={item} className="block-tag block-skill-tag">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// ExperienceBlockView
// ─────────────────────────────────────────

export function ExperienceBlockView({
  value,
}: {
  value: ExperienceBlockValue;
}) {
  return (
    <div className="block-view block-experience">
      <div className="block-experience-header">
        <div>
          <h3 className="block-experience-org">{value.organization}</h3>
          {value.role && (
            <p className="block-experience-role">{value.role}</p>
          )}
        </div>
        {value.period && (
          <p className="block-experience-period">
            {formatDateRange(value.period)}
          </p>
        )}
      </div>
      {value.description && (
        <p className="block-experience-desc">{value.description}</p>
      )}
      {value.achievements && value.achievements.length > 0 && (
        <ul className="block-experience-achievements">
          {value.achievements.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ─────────────────────────────────────────
// ContactBlockView
// ─────────────────────────────────────────

const CONTACT_ICONS: Record<string, string> = {
  email: "✉️",
  phone: "📱",
  github: "💻",
  blog: "📝",
  notion: "📄",
};

export function ContactBlockView({
  value,
  props,
}: {
  value: ContactBlockValue;
  props?: ContactBlockProps;
}) {
  const items = [
    value.email && {
      key: "email",
      label: value.email,
      href: `mailto:${value.email}`,
    },
    value.phone && {
      key: "phone",
      label: value.phone,
      href: `tel:${value.phone}`,
    },
    value.github && {
      key: "github",
      label: value.github.label,
      href: value.github.url,
    },
    value.blog && {
      key: "blog",
      label: value.blog.label,
      href: value.blog.url,
    },
    value.notion && {
      key: "notion",
      label: value.notion.label,
      href: value.notion.url,
    },
  ].filter(Boolean) as { key: string; label: string; href: string }[];

  const listClass =
    props?.display === "list"
      ? "block-contact--list"
      : "block-contact--icon-list";

  return (
    <div className={`block-view block-contact ${listClass}`}>
      {items.map((item) => (
        <a
          key={item.key}
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          className="block-contact-item"
        >
          <span className="block-contact-icon">
            {CONTACT_ICONS[item.key] ?? "🔗"}
          </span>
          <span className="block-contact-label">{item.label}</span>
        </a>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────
// TextBlockView
// ─────────────────────────────────────────

export function TextBlockView({ value }: { value: TextBlockValue }) {
  return (
    <div className="block-view block-text">
      {value.title && <h3 className="block-text-title">{value.title}</h3>}
      <p className="block-text-body">{value.body}</p>
    </div>
  );
}

// ─────────────────────────────────────────
// ImageBlockView
// ─────────────────────────────────────────

export function ImageBlockView({
  value,
  props,
}: {
  value: ImageBlockValue;
  props?: ImageBlockProps;
}) {
  return (
    <div className="block-view block-image">
      <img
        src={value.image}
        alt={value.alt}
        className="block-image-img"
        style={{ objectFit: props?.objectFit ?? "cover" }}
      />
      {value.caption && (
        <p className="block-image-caption">{value.caption}</p>
      )}
    </div>
  );
}

// ─────────────────────────────────────────
// PaperBlockView
// ─────────────────────────────────────────

export function PaperBlockView({
  value,
  props,
}: {
  value: PaperBlockValue;
  props?: PaperBlockProps;
}) {
  return (
    <article className="block-view block-paper">
      <div className="block-paper-header">
        {value.title && <h3 className="block-paper-title">{value.title}</h3>}
        {props?.showMeta !== false && (
          <p className="block-paper-meta">
            {[value.authors, value.venue, value.year].filter(Boolean).join(" · ")}
          </p>
        )}
      </div>
      {value.topic && <p className="block-paper-topic">Topic: {value.topic}</p>}
      {value.summary && (
        <p className="block-paper-section">
          <span>Summary</span>
          {value.summary}
        </p>
      )}
      {value.takeaway && (
        <p className="block-paper-section">
          <span>Takeaway</span>
          {value.takeaway}
        </p>
      )}
      {value.followUpQuestion && (
        <p className="block-paper-section">
          <span>Question</span>
          {value.followUpQuestion}
        </p>
      )}
      {value.link && value.link.url && (
        <div className="block-paper-links">
          <ExternalLink item={value.link} />
        </div>
      )}
    </article>
  );
}

// ─────────────────────────────────────────
// GalleryBlockView
// ─────────────────────────────────────────

export function GalleryBlockView({
  value,
  props,
}: {
  value: GalleryBlockValue;
  props?: GalleryBlockProps;
}) {
  const images =
    value.images && value.images.length > 0
      ? value.images
      : ([value.mainImage, value.subImage1, value.subImage2].filter(
          Boolean
        ) as string[]);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = images[activeIndex] ?? images[0];
  const isCarousel = props?.layout === "carousel";
  const layoutClass =
    props?.layout === "carousel"
      ? "block-gallery--carousel"
      : props?.layout === "feature"
      ? "block-gallery--feature"
      : "block-gallery--grid";

  const goTo = (index: number) => {
    if (images.length === 0) return;
    setActiveIndex((index + images.length) % images.length);
  };

  return (
    <div className={`block-view block-gallery ${layoutClass}`}>
      <div className="block-gallery-copy">
        {value.title && <h3 className="block-gallery-title">{value.title}</h3>}
        {value.description && (
          <p className="block-gallery-desc">{value.description}</p>
        )}
      </div>
      {isCarousel && activeImage && (
        <div className="block-gallery-carousel">
          <div className="block-gallery-carousel-stage">
            <img
              src={activeImage}
              alt={value.alt || value.title || "gallery image"}
              className="block-gallery-carousel-img"
            />
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  className="block-gallery-nav block-gallery-nav--prev"
                  aria-label="이전 이미지"
                  onClick={() => goTo(activeIndex - 1)}
                >
                  ‹
                </button>
                <button
                  type="button"
                  className="block-gallery-nav block-gallery-nav--next"
                  aria-label="다음 이미지"
                  onClick={() => goTo(activeIndex + 1)}
                >
                  ›
                </button>
              </>
            )}
          </div>
          {images.length > 1 && (
            <div className="block-gallery-dots" aria-label="갤러리 이미지 선택">
              {images.map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  className={[
                    "block-gallery-dot",
                    activeIndex === index ? "block-gallery-dot--active" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  aria-label={`${index + 1}번째 이미지 보기`}
                  onClick={() => goTo(index)}
                />
              ))}
            </div>
          )}
        </div>
      )}
      {!isCarousel && images.length > 0 && (
        <div className="block-gallery-images">
          {images.map((image, index) => (
            <img
              key={`${image}-${index}`}
              src={image}
              alt={value.alt || value.title || "gallery image"}
              className="block-gallery-img"
            />
          ))}
        </div>
      )}
      {value.caption && (
        <p className="block-gallery-caption">{value.caption}</p>
      )}
    </div>
  );
}

// ─────────────────────────────────────────
// TroubleshootingBlockView
// ─────────────────────────────────────────

export function TroubleshootingBlockView({
  value,
  props,
}: {
  value: TroubleshootingBlockValue;
  props?: TroubleshootingBlockProps;
}) {
  const rows = [
    ["상황", value.context],
    ["문제", value.problem],
    ["원인", value.cause],
    ["해결", value.solution],
    ...(props?.showResult === false ? [] : [["결과", value.result] as const]),
  ].filter(([, body]) => body);

  return (
    <div className="block-view block-troubleshooting">
      {value.title && (
        <h3 className="block-troubleshooting-title">{value.title}</h3>
      )}
      <div className="block-troubleshooting-rows">
        {rows.map(([label, body]) => (
          <div key={label} className="block-troubleshooting-row">
            <span className="block-troubleshooting-label">{label}</span>
            <p>{body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// ProcessBlockView
// ─────────────────────────────────────────

export function ProcessBlockView({
  value,
  props,
}: {
  value: ProcessBlockValue;
  props?: ProcessBlockProps;
}) {
  const steps = [
    ["Research", value.research],
    ["Direction", value.direction],
    ["Execution", value.execution],
    ["Outcome", value.outcome],
  ].filter(([, body]) => body);
  const layoutClass =
    props?.layout === "stack" ? "block-process--stack" : "block-process--timeline";

  return (
    <section className={`block-view block-process ${layoutClass}`}>
      <div className="block-process-header">
        {value.title && <h3 className="block-process-title">{value.title}</h3>}
        {value.overview && (
          <p className="block-process-overview">{value.overview}</p>
        )}
      </div>
      {steps.length > 0 && (
        <div className="block-process-steps">
          {steps.map(([label, body], index) => (
            <article key={label} className="block-process-step">
              <span className="block-process-index">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <h4 className="block-process-label">{label}</h4>
                <p className="block-process-body">{body}</p>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

// ─────────────────────────────────────────
// ArchitectureBlockView
// ─────────────────────────────────────────

export function ArchitectureBlockView({
  value,
  props,
}: {
  value: ArchitectureBlockValue;
  props?: ArchitectureBlockProps;
}) {
  const layers = [
    ["Frontend", value.frontend],
    ["Backend", value.backend],
    ["Data", value.database],
    ["Deployment", value.deployment],
  ].filter(([, body]) => body);
  const shouldShowDiagram = props?.showDiagram !== false && value.diagramImage;

  return (
    <section className="block-view block-architecture">
      <div className="block-architecture-copy">
        {value.title && (
          <h3 className="block-architecture-title">{value.title}</h3>
        )}
        {value.summary && (
          <p className="block-architecture-summary">{value.summary}</p>
        )}
      </div>
      {shouldShowDiagram && (
        <img
          src={value.diagramImage}
          alt={value.title || "architecture diagram"}
          className="block-architecture-diagram"
        />
      )}
      {layers.length > 0 && (
        <div className="block-architecture-layers">
          {layers.map(([label, body]) => (
            <article key={label} className="block-architecture-layer">
              <h4>{label}</h4>
              <p>{body}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

// ─────────────────────────────────────────
// MetricBlockView
// ─────────────────────────────────────────

export function MetricBlockView({
  value,
  props,
}: {
  value: MetricBlockValue;
  props?: MetricBlockProps;
}) {
  const displayClass =
    props?.emphasis === "compact" ? "block-metric--compact" : "block-metric--single";

  return (
    <section className={`block-view block-metric ${displayClass}`}>
      <div className="block-metric-main">
        {value.value && <strong className="block-metric-value">{value.value}</strong>}
        {value.label && <span className="block-metric-label">{value.label}</span>}
      </div>
      <div className="block-metric-copy">
        {value.title && <h3 className="block-metric-title">{value.title}</h3>}
        {value.description && (
          <p className="block-metric-description">{value.description}</p>
        )}
        {value.evidence && (
          <p className="block-metric-evidence">{value.evidence}</p>
        )}
      </div>
    </section>
  );
}
