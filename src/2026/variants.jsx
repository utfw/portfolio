// Variant 정의 — ?v=agent / ?v=frontend 로 전환됩니다.
// 공통 데이터(data.jsx)는 그대로 두고, 여기서 강조점만 바꿉니다.
//   - role/tagline/intro: 첫인상 문구
//   - featuredId: Work 섹션에서 펼쳐서 보여줄 대표 케이스
//   - caseOrder: 케이스 노출 순서 (미포함 항목은 뒤에 원래 순서로 붙습니다)
//   - skillOrder: Skills 카테고리 노출 순서
//   - letter: Letter 섹션 본문

export const VARIANTS = {
  agent: {
    id: "agent",
    label: "Agent",
    navLabel: "Agent Engineer",
    role: "AI Agent Engineer",
    tagline: "무엇을 에이전트에게 맡기고, 어디서 사람이 확인할지",
    intro: [
      "저는 사람이 정보를 어떻게 인식하고 판단하는지 궁금해 심리학을 전공했고, 최근에는 사람이 하던 판단과 작업을 대신하는 에이전트 시스템을 설계했습니다. 사람이 매번 지시하지 않아도 동작하려면 무엇이 필요한지에 가장 관심이 있습니다.",
      "개인 프로젝트에서는 에이전트가 코드를 고치고 스스로 검증하는 닫힌 루프를 만들어 GitHub Actions로 상시 운용했습니다. 거기서 얻은 판단을 회사로 옮겨 이슈를 받아 Draft MR까지 올리는 에이전트를 사내 두 제품에 적용했고, 실행 기록에 드러나는 문제를 고쳐 가며 운영했습니다.",
    ],
    focus: "Agent Workflow · LLM Evaluation · Autonomous Pipeline",
    featuredId: "bada",
    caseOrder: ["bada", "issue-to-mr-pipeline", "review-bot-quality", "chatbot-engine", "grid-engine", "legacy-grid"],
    skillOrder: ["AI / Agent", "Languages", "Testing/QA", "Engineering", "Frontend"],
    sideNotes: {
      landing: [
        { lbl: "Focus", val: "자율 에이전트 설계\n검증 체계 · 평가 설계" },
        { lbl: "Scale", val: "Review 470회 · 자동 커밋 84건\n실행당 $2.55" },
        { lbl: "In Practice", val: "사내 두 제품군의 이슈 자동화\n약 두 달, 이슈 200여 건 수정" },
      ],
    },
  },

  frontend: {
    id: "frontend",
    label: "Frontend",
    navLabel: "Frontend Engineer",
    role: "Frontend Engineer",
    tagline: "쓰는 사람이 무엇을 겪는지부터, 화면을 받치는 구조까지",
    intro: [
      "저는 사람의 행동과 지각이 궁금해 심리학을 전공했고, 사람의 행동은 그 사람이 놓인 환경에 따라 크게 달라진다는 것을 알게 되었습니다.",
      "물리적인 환경은 만드는 데 제약이 많아, 훨씬 자유롭게 짜고 고칠 수 있는 프로그래밍으로 관심을 옮겨 프론트엔드로 전향했습니다.",
      "여러 도입사가 함께 쓰는 상용 그리드 컴포넌트를 유지보수하며 시작해, 이후 수백만 행을 다루는 차세대 데이터 그리드의 핵심 아키텍처를 전담했습니다. 같은 제품의 라이선스 관리자 화면은 서버 API까지 직접 구현했고, 이슈를 받아 Draft MR까지 여는 자동화도 만들어 개발에 썼습니다.",
    ],
    focus: "UI Engine Architecture · Interaction Design · Accessibility",
    featuredId: "grid-engine",
    caseOrder: ["grid-engine", "legacy-grid", "chatbot-engine", "bada", "issue-to-mr-pipeline", "review-bot-quality"],
    skillOrder: ["Frontend", "Languages", "Engineering", "Testing/QA", "AI / Agent"],
    sideNotes: {
      landing: [
        { lbl: "Background", val: "심리학 → 프론트엔드\n인지 · 행동" },
        { lbl: "Scale", val: "수백만 행 가상 스크롤\nWCAG AA · NVDA" },
        { lbl: "Frameworks", val: "React · Vue · Angular\n멀티 프레임워크 지원" },
      ],
    },
  },
};

export const DEFAULT_VARIANT = "agent";

export function resolveVariant(raw) {
  const key = String(raw || "").toLowerCase();
  if (key === "frontend" || key === "fe") return "frontend";
  if (key === "agent" || key === "ai") return "agent";
  return DEFAULT_VARIANT;
}
