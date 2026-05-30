// ============================================================
// APolo Portfolio - Block Default Fields
// 블록 타입별 기본 fields 정의
// loadFromAI 시 fields가 없는 블록에 자동으로 주입됨
// ============================================================

import type { BlockField, BlockType } from "./block.types";

export const BLOCK_DEFAULT_FIELDS: Partial<Record<BlockType, BlockField[]>> = {

  // ─── Hero ───
  hero: [
    { key: "headline", label: "헤드라인", input: "text", group: "content", placeholder: "안녕하세요, 디자이너 OOO입니다", validation: { required: true } },
    { key: "subheadline", label: "서브 헤드라인", input: "textarea", group: "content", placeholder: "한 줄 소개를 입력하세요" },
    { key: "heroImage", label: "배경 이미지", input: "imageUpload", group: "content" },
    { key: "ctaLabel", label: "버튼 텍스트", input: "text", group: "content", placeholder: "작업물 보기" },
    { key: "ctaLink", label: "버튼 링크", input: "text", group: "content", placeholder: "#work" },
  ],

  // ─── Profile ───
  profile: [
    { key: "name", label: "이름", input: "text", group: "content", placeholder: "홍길동", validation: { required: true } },
    { key: "role", label: "직무", input: "text", group: "content", placeholder: "Visual / UX Designer" },
    { key: "intro", label: "자기소개", input: "textarea", group: "content", placeholder: "간략한 자기소개를 입력하세요" },
    { key: "profileImage", label: "프로필 이미지", input: "imageUpload", group: "content" },
    { key: "location", label: "위치", input: "text", group: "content", placeholder: "Seoul, Korea" },
    { key: "links", label: "링크 목록", input: "linkList", group: "content" },
  ],

  // ─── Project ───
  project: [
    { key: "title", label: "프로젝트 이름", input: "text", group: "content", placeholder: "프로젝트 제목", validation: { required: true } },
    { key: "summary", label: "한 줄 설명", input: "textarea", group: "content", placeholder: "프로젝트에 대한 간략한 설명" },
    { key: "role", label: "역할", input: "text", group: "content", placeholder: "Visual Designer" },
    { key: "period", label: "기간", input: "dateRange", group: "content" },
    { key: "techStack", label: "사용 툴/기술", input: "toggleTagSelector", group: "content", allowCustom: true },
    { key: "links", label: "관련 링크", input: "linkList", group: "content" },
    { key: "thumbnail", label: "썸네일 이미지", input: "imageUpload", group: "content" },
  ],

  // ─── Skills ───
  skills: [
    { key: "category", label: "카테고리", input: "text", group: "content", placeholder: "Tools / Frontend / etc" },
    { key: "items", label: "스킬 목록", input: "toggleTagSelector", group: "content", allowCustom: true },
  ],

  // ─── Experience ───
  experience: [
    { key: "organization", label: "소속", input: "text", group: "content", placeholder: "회사 / 학교 / 활동명", validation: { required: true } },
    { key: "role", label: "역할", input: "text", group: "content", placeholder: "인턴 / 팀원 등" },
    { key: "period", label: "기간", input: "dateRange", group: "content" },
    { key: "description", label: "설명", input: "textarea", group: "content", placeholder: "담당 업무 및 설명" },
    { key: "achievements", label: "주요 성과", input: "repeater", group: "content" },
  ],

  // ─── Contact ───
  contact: [
    { key: "email", label: "이메일", input: "text", group: "content", placeholder: "your@email.com" },
    { key: "github", label: "GitHub", input: "link", group: "content" },
    { key: "blog", label: "블로그 / Behance", input: "link", group: "content" },
    { key: "notion", label: "Notion", input: "link", group: "content" },
  ],

  // ─── Text ───
  text: [
    { key: "title", label: "제목", input: "text", group: "content", placeholder: "섹션 제목 (선택)" },
    { key: "body", label: "본문", input: "textarea", group: "content", placeholder: "내용을 입력하세요", validation: { required: true } },
  ],

  // ─── Image ───
  image: [
    { key: "image", label: "이미지", input: "imageUpload", group: "content", validation: { required: true } },
    { key: "alt", label: "이미지 설명 (alt)", input: "text", group: "content", placeholder: "이미지 설명" },
    { key: "caption", label: "캡션", input: "text", group: "content", placeholder: "이미지 하단 설명 (선택)" },
  ],
};

/**
 * 블록에 fields가 없으면 기본값으로 채워주는 유틸
 */
export function injectDefaultFields<T extends { type: BlockType; fields?: import("./block.types").BlockField[] }>(
  block: T
): T {
  if (block.fields && block.fields.length > 0) return block;
  const defaults = BLOCK_DEFAULT_FIELDS[block.type];
  if (!defaults) return block;
  return { ...block, fields: defaults };
}
