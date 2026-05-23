// ============================================================
// APolo Portfolio - Block View Components (filled/preview mode)
// 각 블록 타입의 실제 렌더링 결과물 컴포넌트
// ============================================================

import React from "react";
import type {
  HeroBlockValue,
  ProfileBlockValue,
  ProjectBlockValue,
  SkillsBlockValue,
  ExperienceBlockValue,
  ContactBlockValue,
  TextBlockValue,
  ImageBlockValue,
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
  return (
    <div className="block-view block-hero">
      {props?.showImage && value.heroImage && (
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
      {props?.showThumbnail && value.thumbnail && (
        <div className="block-project-thumb">
          <img src={value.thumbnail} alt={value.title} />
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
