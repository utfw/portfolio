// Resume + portfolio data — shared across all three directions
window.PORTFOLIO_DATA = {
  name: "최 환",
  nameEn: "Hwan Choi",
  role: "Software Engineer",
  subRole: "Interfaces · Accessibility · AI",
  tagline: "설명이 필요 없는 인터페이스를, 누구나 같은 방식으로 쓸 수 있게.",
  taglineEn: "Interfaces that explain themselves — for everyone.",
  intro: [
    "좋은 디자인은 기능 그 자체이고, 좋은 인터페이스는 자기 자신을 설명합니다. 사람이 무엇을 어떻게 인식하는지 오래 들여다본 끝에, 지금은 그 답을 직접 만드는 소프트웨어 엔지니어로 일하고 있습니다.",
    "AI 챗봇 엔진, 대규모 그리드 아키텍처, 자율 에이전트 워크플로우 — 다루는 영역은 달라져도, 모두가 어려움 없이 사용할 수 있는 인터페이스를 만든다는 기준은 바뀌지 않습니다.",
  ],
  skills: {
    Languages: ["JavaScript (ES6+)", "TypeScript"],
    Frameworks: ["React", "Next.js", "Node.js", "Recoil"],
    Engineering: ["UI Component Architecture", "Virtual Rendering", "DOM Management", "a11y"],
    "AI & Tools": ["OpenAI API", "Chakra-UI", "Webpack", "Grunt", "Docker"],
    "Testing/QA": ["Jest", "Puppeteer", "Selenium", "axe-core", "jsdom"],
  },
  experience: [
    {
      company: "(주)소프트인",
      role: "프론트엔드 개발자",
      period: "2023.07 — 재직 중",
    },
  ],
  caseStudies: [
    {
      id: "grid-engine",
      year: "2026",
      number: "01",
      title: "데이터 그리드 엔진",
      subtitle: "대규모 그리드 엔진의 웹 접근성 혁신",
      tag: "Architecture · a11y",
      role: "차세대 그리드 컴포넌트 독립 설계 / 웹 접근성 표준 총괄",
      period: "2026.01 — 현재",
      challenge:
        "수십만 행을 가상 스크롤로 그리면서도 키보드 · 스크린리더(NVDA) 사용자가 동등한 경험을 받아야 했습니다. 가상화와 접근성을 동시에 만족시키는 엔진을 처음부터 설계했습니다.",
      solution: [
        {
          h: "Virtual Rendering",
          d: "대용량 데이터를 끊김 없이 그리는 가상 스크롤 엔진 아키텍처 직접 설계.",
        },
        {
          h: "Roving Tabindex",
          d: "앵커 셀 보정 로직으로 가상화 환경에서도 키보드 포커스 연속성 확보.",
        },
        {
          h: "NVDA 브라우즈 모드",
          d: "리다이렉트 로직을 구현해 스크린리더 탐색 흐름 정합성 확보.",
        },
        {
          h: "Test Harness",
          d: "jsdom · axe-core 기반 자동화 테스트로 접근성 회귀 사전 차단.",
        },
      ],
      stack: ["TypeScript", "Virtual Render", "axe-core", "jsdom"],
      metrics: [
        { k: "rows handled", v: "1M+" },
        { k: "a11y", v: "WCAG AA" },
        { k: "regression", v: "0" },
      ],
    },
    {
      id: "chatbot-engine",
      year: "2024",
      number: "02",
      title: "IBChatbot",
      subtitle: "AI 대화형 솔루션의 엔지니어링적 도약",
      tag: "AI · Migration",
      role: "레거시 마이그레이션 / AI 서비스 엔지니어링",
      period: "2024.06 — 2024.10",
      challenge:
        "Python(Streamlit) 레거시 챗봇은 성능 · 확장성에서 한계가 명확했고, AI 응답의 신뢰성(할루시네이션)과 API 호출 비용도 동시에 풀어야 할 문제였습니다.",
      solution: [
        {
          h: "React / Recoil 전환",
          d: "전면 마이그레이션으로 데이터 흐름 일원화 · 렌더링 성능 개선.",
        },
        {
          h: "Embedding Guardrail",
          d: "OpenAI 임베딩 유사도 필터링으로 무관한 질의 사전 차단 · API 비용 절감.",
        },
        {
          h: "Iframe Sandbox",
          d: "답변 속 JS 코드를 격리 환경에서 안전하게 실행 · 시각화.",
        },
      ],
      stack: ["React", "Recoil", "OpenAI", "Iframe Sandbox"],
      metrics: [
        { k: "API cost", v: "↓" },
        { k: "hallucination", v: "filtered" },
        { k: "stack", v: "Py → React" },
      ],
    },
    {
      id: "legacy-grid",
      year: "2023—25",
      number: "03",
      title: "IBSheet8",
      subtitle: "전사 UI 컴포넌트 유지보수 · QA 자동화",
      tag: "Maintenance · QA",
      role: "엔진 유지보수 / QA 자동화 프로세스 정립",
      period: "2023.07 — 2025.12",
      challenge:
        "이미 상용화되어 다수 도입사가 운영 중인 그리드 엔진 위에서, 신규 기능 개발 · 기존 기능 유지보수 · 테스트 환경 개선을 동시에 진행해야 했습니다. 변경이 도입사 환경으로 곧장 흘러가는 만큼, 한 번의 릴리즈가 어떤 환경에서도 깨지지 않게 만드는 것이 가장 큰 과제였습니다.",
      solution: [
        {
          h: "신규 기능 개발",
          d: "피벗 · 트리 · 행 고정 등 엔진 핵심 기능 설계 · 구현.",
        },
        {
          h: "Engine 유지보수",
          d: "도입사 이슈 대응과 성능 튜닝으로 장기 운영 안정성 확보.",
        },
        {
          h: "QA 환경 개선",
          d: "Puppeteer · Jest 기반 시나리오 자동화로 수동 검증 비중 축소.",
        },
        {
          h: "React 호환성",
          d: "래퍼 컴포넌트 유지보수와 도입사 기술 지원.",
        },
      ],
      stack: ["Puppeteer", "Jest", "React"],
      metrics: [
        { k: "release", v: "stable" },
        { k: "automation", v: "CI" },
      ],
    },
    {
      id: "bada",
      year: "2026",
      number: "04",
      title: "Bada",
      subtitle: "자율 에이전트가 코드를 작성·검증하는 닫힌 루프 실험",
      tag: "Lab · Agent · 3D",
      role: "사이드 프로젝트 / Claude Code 자율 에이전트 파이프라인 설계",
      period: "2026.03 계획 — 2026.04 착수",
      challenge:
        "단순한 3D 시각화를 넘어, 에이전트가 화면을 관찰하고 계획을 세우고 코드를 직접 커밋하는 닫힌 루프를 만드는 테스트베드입니다. 사람이 개입하지 않아도 결과물이 일정 품질에 수렴하도록 단계 간 책임을 명확히 나눴습니다.",
      solution: [
        {
          h: "4-Stage Agent Pipeline",
          d: "Observer(Playwright 관찰) → Planner(goals.md 계획) → Implementer(구현 · 타입 체크) → Reviewer(체크리스트 검증 후 자동 커밋).",
        },
        {
          h: "Procedural 3D",
          d: "고래상어는 LatheGeometry + CatmullRomCurve3 기반 입체 유영 경로, 물고기 떼는 5개 군집 120마리에 Boids 알고리즘 적용.",
        },
        {
          h: "Adaptive Input",
          d: "디바이스 환경에 따라 자이로스코프 → 터치 드래그 → 마우스 순으로 자동 폴백되는 조작 체인.",
        },
        {
          h: "Live Weather Sync",
          d: "OpenWeatherMap API와 위치 정보로 실제 날씨를 장면에 반영(안개 밀도 · 조명 색상).",
        },
      ],
      stack: ["TypeScript", "Three.js", "Vite", "Playwright", "Claude Code SDK"],
      metrics: [
        { k: "agent stages", v: "4" },
        { k: "boids", v: "120" },
        { k: "repo", v: "github.com/utfw/bada" },
      ],
    },
  ],
  earlier: {
    title: "Interactive Portfolio 2023",
    subtitle: "Matter.js 물리 엔진을 활용한 인터랙티브 포트폴리오",
    note: "엔진과 시스템을 다루기 전, 브라우저 위에서 인터랙션을 직접 만들어보던 시기의 작업들입니다. 아래 사이트들을 한 페이지 안에 담아 인터랙티브 포트폴리오로 만들었습니다.",
    items: [
      { name: "FESCARO", note: "기업 사이트 클론" },
      { name: "삼성전자", note: "프로모션 페이지 클론" },
      { name: "CJ ONE", note: "프로모션 페이지 클론" },
      { name: "React Talk App", note: "실시간 채팅 UI 클론" },
      { name: "React Netflix", note: "스트리밍 UI 클론" },
    ],
  },
  education: [
    { school: "강원대학교", detail: "심리학과 졸업", period: "2010.03 — 2017.02" },
    { school: "이젠아카데미", detail: "UI/UX 웹·앱 디자인 / React.js", period: "2022.11 — 2023.05" },
  ],
  contact: {
    email: "fantasylife_@naver.com",
    phone: "",
    github: "github.com/utfw",
    location: "Seoul, KR",
  },
};
