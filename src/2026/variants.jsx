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
    tagline: "저는 사람이 지켜보지 않는 상태에서도 돌아가는 시스템을 설계하는 일에 관심이 있습니다.",
    intro: [
      "저는 사람의 행동과 지각에 관심을 가져 심리학을 전공했습니다. 사람이 정보를 어떻게 인식하고 판단하는지에 대한 관심은, 그 판단을 대신 수행하는 시스템을 만드는 일로 이어졌습니다.",
      "지금은 사용자의 목표를 이해하고 스스로 작업을 수행하는 에이전트 시스템을 설계하고 있습니다. 사람이 매번 지시하지 않아도 돌아가려면 무엇이 필요한지에 가장 관심이 있습니다.",
      "개인 프로젝트에서 에이전트가 코드를 고치고 스스로 검증하는 닫힌 루프를 470회 운용했고, 지금은 사람 트리거 없이 상시로 돌아갑니다. 개인 프로젝트의 경험을 바탕으로 회사에서는 이슈를 받아 Draft MR까지 올리는 에이전트를 설계했고, 운영하며 실행 기록에 드러나는 문제를 고쳐 나가고 있습니다.",
    ],
    focus: "Agent Workflow · LLM Evaluation · Autonomous Pipeline",
    featuredId: "bada",
    caseOrder: ["bada", "issue-to-mr-pipeline", "review-bot-quality", "chatbot-engine", "grid-engine", "legacy-grid"],
    skillOrder: ["AI / Agent", "Languages", "Testing/QA", "Engineering", "Frontend"],
    sideNotes: {
      landing: [
        { lbl: "Focus", val: "자율 에이전트 설계\n검증 체계 · 평가 설계" },
        { lbl: "Scale", val: "Review 470회 · 자동 커밋 84건\n실행당 $2.55" },
        { lbl: "In Production", val: "Bada의 판단을 바탕으로\n사내 개발 자동화 에이전트" },
      ],
      work: [
        { lbl: "Pipeline", val: "Observer → Planner\n→ Implementer → Reviewer" },
        { lbl: "Verification", val: "결정론적 검사 + 육안 확인\n판정 기준은 사람 라벨과 대조" },
        { lbl: "Key Insight", val: "지시로 금지한 규칙은 우회됐고\n실행 권한으로 막아야 지켜졌다" },
      ],
    },
  },

  frontend: {
    id: "frontend",
    label: "Frontend",
    navLabel: "Frontend Engineer",
    role: "Frontend Engineer",
    tagline: "저는 상호작용을 통해 사람과 환경을 연결하는 일을 하고 있습니다.",
    intro: [
      "저는 사람의 행동과 지각에 관심을 가져 심리학을 전공했습니다. 심리학을 전공하며 사람의 행동은 그 사람이 놓인 환경에 따라 크게 달라진다는 것을 알게 되었습니다.",
      "이는 사용자와 직접 대면하는 프론트엔드 개발에 대한 관심으로 이어졌습니다. 화면은 사용자가 제품 안에서 놓이는 환경이라고 생각하기 때문에, 어떻게 만드느냐에 따라 사용자가 할 수 있는 일이 달라진다고 생각합니다.",
      "여러 도입사가 함께 쓰는 상용 그리드 컴포넌트를 유지보수하며 시작해, 지금은 수백만 행을 다루는 차세대 데이터 그리드의 핵심 아키텍처를 전담하고 있습니다. 해당 제품의 이슈를 확인해 자율적으로 개발하는 에이전트 환경을 직접 구축해 개발에 활용하고 있습니다.",
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
      work: [
        { lbl: "Architecture", val: "Virtual Rendering\nRoving Tabindex" },
        { lbl: "Verification", val: "jsdom · axe-core\n접근성 회귀 방지" },
        { lbl: "Key Insight", val: "경로를 열어 두는 일이\n기능을 붙이는 일만큼 중요하다" },
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
