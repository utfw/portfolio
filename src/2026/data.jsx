// Resume + portfolio data — consumed by direction-c2.jsx
// 렌더링에 실제로 사용되는 필드만 유지합니다.
const data = {
  nameEn: "Hwan Choi",
  role: "AI Agent & Frontend Systems Engineer",
  tagline: "좋은 시스템은 관찰할 수 있어야 합니다. 에이전트도 마찬가지입니다.",
  philosophy: {
    headline: "Good Software is Observable.",
    body: [
      "좋은 시스템은 지금 어떤 상태인지 들여다볼 수 있어야 합니다. Agent도 예외는 아닙니다.",
      "결국 결과의 질을 가르는 것은 모델 자체가 아니라, 상태를 추적하고 실패를 복구하며 검증하고 같은 결과를 반복할 수 있게 만드는 설계라고 믿습니다.",
    ],
    keywords: [
      "State Tracking",
      "Failure Recovery",
      "Verifiability",
      "Repeatable Execution",
    ],
  },
  intro: [
    "심리학을 전공하며 사람이 무엇을 어떻게 인식하는지 오래 들여다봤습니다. 그 관심은 사용자의 의도를 화면으로 옮기는 프론트엔드로, 다시 사용자의 목표를 이해하고 스스로 작업을 수행하는 에이전트 시스템 설계로 이어졌습니다.",
    "AI 챗봇 엔진, 대규모 그리드 아키텍처, 자율 에이전트 워크플로우까지 — 다루는 영역은 달라져도 신뢰할 수 있는 시스템을 만든다는 기준만큼은 바꾸지 않았습니다.",
  ],
  skills: {
    Languages: ["TypeScript", "JavaScript (ES6+)", "Python"],
    "Frontend": ["React", "Next.js", "Vue", "Angular", "Recoil", "Chakra UI"],
    "AI / Agent": ["OpenAI API", "Claude Code", "Ollama", "Embedding", "Prompt Engineering", "Agent Workflow Design"],
    "Testing/QA": ["Playwright", "Puppeteer", "Jest", "axe-core", "jsdom"],
    Engineering: ["Virtual Rendering", "Component Architecture", "Accessibility (WCAG)", "State Management", "Performance Optimization", "CI/CD"],
  },
  caseStudies: [
    {
      id: "bada",
      number: "01",
      title: "Bada",
      subtitle: "자율 에이전트가 코드를 직접 작성하고 검증하는 닫힌 루프를 만들 수 있을까",
      tag: "Agent · Workflow · Lab",
      period: "2026.03 — 2026.04",
      problem:
        "LLM은 코드를 생성할 수 있지만 자신이 만든 결과물을 스스로 검증하기는 어렵습니다. 단발성 호출을 넘어, 관찰 → 계획 → 구현 → 검증 사이클을 반복하며 결과를 다듬어 가는 자율 개선 시스템이 필요했습니다.",
      solution: [
        {
          h: "4-Stage Agent Pipeline",
          d: "Observer(Playwright 관찰) → Planner(goals.md 계획) → Implementer(구현 · 타입 체크) → Reviewer(체크리스트 검증 후 자동 커밋).",
        },
        {
          h: "Reflection Loop",
          d: "REVIEW_FAIL 발생 시 자동 재시도. 실패 패턴을 REVIEW_CHECKLIST.md에 축적해 다음 실행에 반영.",
        },
        {
          h: "Self-Improvement Workflow",
          d: "Reviewer의 개선 제안(SUGGESTIONS)을 goals.md에 자동 반영해 다음 사이클의 목표로 전환.",
        },
        {
          h: "Multi-Model Architecture",
          d: "Ollama(로컬 경량 추론)와 Claude Code(복잡한 구현)를 역할에 따라 분리 활용.",
        },
      ],
      lessons:
        "에이전트 시스템에서는 모델을 어떻게 호출하느냐보다 상태 관리, 검증 체계, 피드백 루프를 어떻게 설계하느냐가 결과를 좌우했습니다. 결국 결과의 질을 가른 것은 LLM이 아니라 워크플로우였습니다.",
      architecture: `Observer → Planner → Implementer → Reviewer
    │           │              │              │
Playwright   Read-only    Edit/Write     Checklist
 Runtime      계획만        코드수정        검증전용
 스크린샷      plan.md       TypeCheck    PASS/FAIL`,
      evolution: [
        {
          phase: "Phase 1",
          title: "Correctness Loop",
          body: "Observer → Planner → Implementer → Reviewer로 버그를 잡고 회귀를 막았습니다. 다만 REVIEW_PASS가 반복돼도 장면이 더 나아지지는 않는 한계에 부딪혔습니다.",
        },
        {
          phase: "Phase 2",
          title: "Evolver 추가",
          body: "dramaScore(물고기-포식자 상호작용 지표)로 정체를 감지하고 개선 목표를 자동으로 생성했습니다. 사람이 목표를 주던 구조에서, 에이전트가 스스로 다음 목표를 찾는 구조로 옮겨갔습니다.",
        },
      ],
      failureCases: [
        {
          type: "Type A",
          title: "Measurement Error",
          body: "avgForwardDot = -1.00을 역방향 수영으로 잘못 해석해, 멀쩡한 코드를 반복해서 수정했습니다. 수치 자체는 정확했지만 그 의미를 잘못 읽은 경우였습니다.",
        },
        {
          type: "Type B",
          title: "Evaluation Error",
          body: "God Ray 구현은 Lighting.ts로 옮겨졌는데 체크리스트는 여전히 Ocean.ts를 가리키고 있었습니다. 평가 기준 자체도 검증 대상이라는 걸 확인한 사례입니다.",
        },
        {
          type: "Type C",
          title: "Human-Only Discovery",
          body: "지느러미 관련 세 버그는 모두 코드 수치상으로는 정상이었지만 화면에서는 어색했습니다. 수치가 합리적인 것과 시각적으로 자연스러운 것은 별개였습니다.",
        },
        {
          type: "Type D",
          title: "Correctness without Progress",
          body: "REVIEW_PASS가 쌓여도 장면 품질은 제자리였습니다. Correctness Loop는 퇴행을 막을 뿐 진보를 만들지는 못했고, 이것이 Evolver를 도입한 직접적인 계기가 됐습니다.",
        },
      ],
      lessonsLearned: [
        { n: "01", h: "Evaluation is harder than Generation", d: "평가 기준이 없으면 개선할 목표도 생기지 않습니다." },
        { n: "02", h: "Metrics are not understanding", d: "측정값이 맞아도 그 의미를 잘못 읽을 수 있습니다." },
        { n: "03", h: "Evaluation systems require evaluation", d: "평가 기준도 코드와 함께 끊임없이 갱신되어야 합니다." },
        { n: "04", h: "Correctness does not imply progress", d: "퇴행을 막는 루프와 진보를 만드는 루프는 따로 설계해야 합니다." },
        { n: "05", h: "Human judgment remains necessary", d: "자동화할 수 있는 영역과 사람이 필요한 영역의 경계를 분명히 긋는 것이 핵심입니다." },
      ],
      results: [
        { k: "Review 수행", v: "260+" },
        { k: "REVIEW_FAIL", v: "99" },
        { k: "REVIEW_PASS", v: "162" },
      ],
    },
    {
      id: "chatbot-engine",
      number: "02",
      title: "IBChatbot",
      subtitle: "응답의 신뢰성과 API 비용을 함께 잡은 AI 챗봇 마이그레이션",
      tag: "AI · Migration · Guardrail",
      period: "2024.06 — 2024.10",
      challenge:
        "Python(Streamlit) 레거시 챗봇을 React 기반으로 전환하면서, 단순 이식을 넘어 응답 품질과 운영 비용, 기술지원 공수까지 함께 개선하는 것이 과제였습니다.",
      solution: [
        {
          h: "React / Recoil 전면 마이그레이션",
          d: "Streamlit 구조를 React로 다시 짜고 Recoil로 세션 상태를 일원화했습니다. 자연스러운 텍스트 타이핑 효과와 저해상도 기기용 사이드 메뉴까지 직접 구현했습니다.",
        },
        {
          h: "Embedding Guardrail · 데이터 정제",
          d: "OpenAI 임베딩 유사도 필터링으로 무관한 질의를 모델 호출 전에 차단하고, 매뉴얼 문서의 주석·이미지·불필요한 토큰을 제거하는 정제와 프롬프트 엔지니어링으로 비용과 할루시네이션을 함께 줄였습니다.",
        },
        {
          h: "Iframe 코드 샌드박스",
          d: "답변에 실행 가능한 코드가 포함되면, iframe 격리 환경에서 안전하게 실행하고 가상 결과 화면을 실시간으로 렌더링하는 데모 뷰어를 설계했습니다.",
        },
        {
          h: "비동기 로그 · 세션 처리",
          d: "긴 답변을 위한 DB 로그 저장을 비동기 병렬로 처리하고, 이용 동의 쿠키(7일 유지)를 연동해 운영 환경의 안정성을 확보했습니다.",
        },
      ],
      stack: ["React", "Recoil", "OpenAI API", "GPT-4o mini", "Python", "Docker"],
      metrics: [
        { k: "마이그레이션", v: "Python → React" },
        { k: "응답 신뢰성", v: "Guardrail 적용" },
        { k: "기술지원 공수", v: "절감" },
      ],
    },
    {
      id: "grid-engine",
      number: "03",
      title: "차세대 그리드 엔진",
      subtitle: "수십만 행 가상 스크롤과 웹 접근성을 양립시킨 그리드 엔진",
      tag: "Architecture · a11y · Engine",
      period: "2026.01 — 현재",
      challenge:
        "DOM에 존재하지 않는 행에 키보드 포커스를 유지하고, NVDA 스크린리더가 가상화된 셀을 정확히 탐색하게 만드는 것은 브라우저 렌더링 모델 자체를 깊이 이해해야 하는 문제였습니다.",
      solution: [
        {
          h: "Virtual Rendering Engine 독립 설계",
          d: "가상 스크롤 기반 대용량 처리 엔진 아키텍처를 직접 설계하고, 조회 시 속도와 메모리 사용량을 비교 분석해 최적 성능을 도출했습니다.",
        },
        {
          h: "Roving Tabindex 키보드 내비게이션",
          d: "role=\"grid\" 구조 위에서 가상 스크롤이 일어날 때 앵커 셀을 자동 보정하는 로직을 구현해 포커스 연속성을 확보했습니다.",
        },
        {
          h: "NVDA 브라우즈 모드 대응",
          d: "Tab 진입 시 그리드 상태를 동기화하고 스크롤포트로 포커스를 리다이렉트하며, aria-rowcount를 동적 갱신해 스크린리더 탐색 흐름의 정합성을 확보했습니다.",
        },
        {
          h: "접근성 테스트 자동화",
          d: "jsdom 기반 접근성 유닛 테스트와 axe-core 자동화 체계를 구축하고, 중복 스크린리더 안내를 없애기 위해 aria-roledescription·접두사를 정리했습니다.",
        },
      ],
      stack: ["TypeScript", "Virtual Rendering", "NVDA", "axe-core", "jsdom", "Playwright"],
      metrics: [
        { k: "처리 규모", v: "대용량 행" },
        { k: "접근성", v: "WCAG · NVDA" },
        { k: "검증", v: "자동화 테스트" },
      ],
    },
    {
      id: "legacy-grid",
      number: "04",
      title: "IBSheet8",
      subtitle: "상용 그리드 엔진을 안정적으로 유지보수하며 QA를 자동화하다",
      tag: "Maintenance · QA · Multi-framework",
      period: "2023.07 — 2025.12",
      challenge:
        "변경이 도입사 환경으로 곧장 흘러가는 만큼, 한 번의 릴리즈가 React · Vue · Angular 환경 모두에서 깨지지 않게 만드는 것이 가장 큰 과제였습니다.",
      solution: [
        {
          h: "코어 엔진 기능 보완",
          d: "피벗 테이블 데이터 연동 오류와 다차원 푸터 계산 로직을 확장하고, 대용량 모드에서 트리시트 렌더링이 깨지고 속도가 떨어지던 문제를 구조적으로 해결했습니다.",
        },
        {
          h: "차트 다이얼로그 플러그인 개발",
          d: "차트 생성 UI 플러그인 런칭을 전담해 이미지 다운로드·복합 차트 반전·데이터 레이블/범례 예외 처리와 테마별 색상 변환까지 정교화했습니다.",
        },
        {
          h: "코어 보안 강화",
          d: "시크릿 모드의 localStorage 예외를 처리하고, 제품 전반의 eval 사용처를 정밀 분석해 JSON.parse·exportData 등 안전한 대체 로직으로 교체하며 취약점을 제거했습니다.",
        },
        {
          h: "QA 자동화 · 온보딩 체계",
          d: "Puppeteer·Jest 기반 QA 자동화 테스트를 설계하고, 신입 온보딩 평가용 실습 저장소를 단독 구축해 실무 투입 기간을 단축했습니다.",
        },
      ],
      stack: ["JavaScript", "jQuery", "Puppeteer", "Jest", "React", "Vue", "Angular"],
      metrics: [
        { k: "도입사 대응", v: "금융·대기업" },
        { k: "코어 보안", v: "eval 제거" },
        { k: "QA", v: "자동화 · 온보딩" },
      ],
    },
  ],
  experience: {
    company: "(주)소프트인",
    role: "프론트엔드 개발자",
    period: "2023.07 — 재직 중",
    timeline: [
      { date: "2023.08", desc: "IBSheet8 그리드 엔진 유지보수 · 신규 기능 개발" },
      { date: "2024.06", desc: "IBChatbot React · Recoil 마이그레이션" },
      { date: "2024.10", desc: "IBChatbot 출시" },
      { date: "2024.10", desc: "대기업 계열사 엔터프라이즈 클라우드 플랫폼 PoC" },
      { date: "2025.12", desc: "IBSheet8 핸드오프" },
      { date: "2026", desc: "차세대 그리드 엔진 · 자율 에이전트 파이프라인", now: true },
    ],
  },
  education: [
    { school: "강원대학교", detail: "심리학과 졸업", period: "2010.03 — 2017.02" },
    { school: "이젠아카데미", detail: "UI/UX 웹·앱 디자인 / React.js", period: "2022.11 — 2023.05" },
  ],
  contact: {
    email: "hwan.c.0330@gmail.com",
    github: "github.com/utfw",
    location: "Seoul, KR",
  },
};

export default data
