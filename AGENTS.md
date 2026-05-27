# AGENTS.md

All AI assistants working in this repository (Cursor, Claude Code, Codex, Jules 등) must follow these rules regardless of tool.

## Scope and Priorities

When rules conflict, resolve in this order (highest wins):

1. User's explicit request in the current session
2. Local inline comments in the file being edited
3. Rules in `.agents/rules/` (loaded via the imports below or path-specific matching)

## File Layout

- **`.agents/rules/*.md`**: 규칙 본문 (단일 진실 공급원, frontmatter 없음)
- **`.agents/skills/`**: AI 도구가 발견하는 도메인 지식 패키지 (Cursor 네이티브 발견 지원)
- **`.claude/rules/*.md`**: Claude Code 진입점 (`paths` frontmatter + `@import`)
- **`.claude/skills/`**: 실제 디렉토리, 개별 skill을 `.agents/skills/`로 파일별 symlink (skill 단위 노출 제어)
- **`.cursor/rules/*.mdc`**: Cursor 진입점 (`globs`/`alwaysApply` frontmatter + `@import`)

## Loading Policy

이 프로젝트는 단일 Vite React PWA로, 모노레포 scope 분리가 없으므로 모든 규칙이 항상 로드됩니다.

- **항상 로드**: `architecture.md`, `common.md`, `workflow.md`
  - Cursor: `.cursor/rules/*.mdc`의 `alwaysApply: true`로 트리거
  - Claude Code: `.claude/rules/*.md`의 frontmatter 없음 → 항상 로드
  - 기타 도구: 본 파일 하단 `@imports`로 로드

향후 scope 분리(예: `apps/server/**`, `packages/core/**`)가 도입되면 해당 scope의 `.agents/rules/{scope}.md`를 추가하고 `.cursor/rules/{scope}.mdc`(globs), `.claude/rules/{scope}.md`(paths frontmatter)로 path-specific 매칭을 구성합니다.

---

@.agents/rules/common.md

@.agents/rules/architecture.md

@.agents/rules/workflow.md
