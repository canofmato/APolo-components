// ============================================================
// APolo Portfolio - Template Block Types
// ============================================================

import type {
  BaseBlock,
  ImageShape,
  ProjectDisplayMode,
  SkillsDisplayMode,
  ContactDisplayMode,
} from "./block.types";

// ─────────────────────────────────────────
// Hero Block
// ─────────────────────────────────────────

export interface HeroBlockProps {
  showCta?: boolean;
  showImage?: boolean;
}

export interface HeroBlock extends BaseBlock {
  type: "hero";
  category: "template";
  repeatable: false;
  props: HeroBlockProps;
}

// Hero 콘텐츠 값 (PortfolioContentDocument에서 사용)
export interface HeroBlockValue {
  headline: string;
  subheadline?: string;
  ctaLabel?: string;
  ctaLink?: string;
  heroImage?: string;   // 이미지 URL 또는 업로드 파일 key
}

// ─────────────────────────────────────────
// Profile Block
// ─────────────────────────────────────────

export interface ProfileBlockProps {
  showLocation?: boolean;
  showLinks?: boolean;
  imageShape?: ImageShape;
}

export interface ProfileBlock extends BaseBlock {
  type: "profile";
  category: "template";
  repeatable: false;
  props: ProfileBlockProps;
}

export interface LinkItem {
  label: string;
  url: string;
  target?: "_blank" | "_self";
}

export interface ProfileBlockValue {
  name?: string;
  role?: string;
  intro?: string;
  profileImage?: string;
  location?: string;
  links?: LinkItem[];
}

// ─────────────────────────────────────────
// Project Block
// ─────────────────────────────────────────

export interface ProjectBlockProps {
  display?: ProjectDisplayMode;
  showThumbnail?: boolean;
}

export interface ProjectBlock extends BaseBlock {
  type: "project";
  category: "template";
  repeatable: true;
  minItems: number;
  maxItems: number;
  props: ProjectBlockProps;
}

export interface DateRange {
  start?: string;   // ISO 날짜 문자열
  end?: string;
  isCurrent?: boolean;
}

export interface ProjectBlockValue {
  title: string;
  summary?: string;
  role?: string;
  period?: DateRange;
  techStack?: string[];
  links?: LinkItem[];
  thumbnail?: string;
}

// ─────────────────────────────────────────
// Skills Block
// ─────────────────────────────────────────

export interface SkillsBlockProps {
  display?: SkillsDisplayMode;
}

export interface SkillsBlock extends BaseBlock {
  type: "skills";
  category: "template";
  repeatable: true;
  props: SkillsBlockProps;
}

export interface SkillsBlockValue {
  category?: string;
  items: string[];
}

// ─────────────────────────────────────────
// Experience Block
// ─────────────────────────────────────────

export interface ExperienceBlockProps {
  showLogo?: boolean;
}

export interface ExperienceBlock extends BaseBlock {
  type: "experience";
  category: "template";
  repeatable: true;
  props: ExperienceBlockProps;
}

export interface ExperienceBlockValue {
  organization: string;
  role?: string;
  period?: DateRange;
  description?: string;
  achievements?: string[];
}

// ─────────────────────────────────────────
// Contact Block
// ─────────────────────────────────────────

export interface ContactBlockProps {
  display?: ContactDisplayMode;
}

export interface ContactBlock extends BaseBlock {
  type: "contact";
  category: "template";
  repeatable: false;
  props: ContactBlockProps;
}

export interface ContactBlockValue {
  email?: string;
  phone?: string;
  github?: LinkItem | null;
  blog?: LinkItem | null;
  notion?: LinkItem | null;
}

// ─────────────────────────────────────────
// Text Block
// ─────────────────────────────────────────

export interface TextBlockProps {
  align?: "left" | "center" | "right";
}

export interface TextBlock extends BaseBlock {
  type: "text";
  category: "template";
  repeatable: true;
  props: TextBlockProps;
}

export interface TextBlockValue {
  title?: string;
  body: string;
}

// ─────────────────────────────────────────
// Image Block
// ─────────────────────────────────────────

export interface ImageBlockProps {
  objectFit?: "cover" | "contain" | "fill";
}

export interface ImageBlock extends BaseBlock {
  type: "image";
  category: "template";
  repeatable: true;
  props: ImageBlockProps;
}

export interface ImageBlockValue {
  image: string;
  caption?: string;
  alt: string;
}

// ─────────────────────────────────────────
// Template Block Union
// ─────────────────────────────────────────

export type TemplateBlock =
  | HeroBlock
  | ProfileBlock
  | ProjectBlock
  | SkillsBlock
  | ExperienceBlock
  | ContactBlock
  | TextBlock
  | ImageBlock;

// ─────────────────────────────────────────
// Block Value Union
// (PortfolioContentDocument.values에서 사용)
// ─────────────────────────────────────────

export type BlockValue =
  | HeroBlockValue
  | ProfileBlockValue
  | ProjectBlockValue
  | SkillsBlockValue
  | ExperienceBlockValue
  | ContactBlockValue
  | TextBlockValue
  | ImageBlockValue;

// 블록 타입 → 값 타입 매핑 (유틸리티)
export interface BlockValueMap {
  hero: HeroBlockValue;
  profile: ProfileBlockValue;
  project: ProjectBlockValue;
  skills: SkillsBlockValue;
  experience: ExperienceBlockValue;
  contact: ContactBlockValue;
  text: TextBlockValue;
  image: ImageBlockValue;
}
