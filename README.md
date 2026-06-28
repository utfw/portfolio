# Portfolio — Hwan Choi

🔗 **[Live Demo →](https://portfolio-utfw.vercel.app/)**

AI Agent & Frontend Engineer의 인터랙티브 포트폴리오입니다.
에이전트 워크플로우, UI 엔진, 웹 접근성을 주제로 한 작업들을 한 페이지 안에 담았습니다.

> "좋은 시스템은 관찰할 수 있어야 합니다. 에이전트도 마찬가지입니다."

## Sections

- **About** — 심리학에서 출발해 프론트엔드, 에이전트 시스템 설계로 이어진 과정
- **Philosophy** — 관찰 가능성(Observability)을 중심에 둔 시스템 설계 원칙
- **Work** — 자율 에이전트 워크플로우(Bada), AI 챗봇 마이그레이션, 가상 스크롤 그리드 엔진, 상용 컴포넌트 유지보수
- **Contact**

## Tech Stack

- **Framework**: React 19, Vite 8
- **Styling**: scoped CSS-in-JS, 반응형 레이아웃 (tablet ≤1024px / mobile ≤640px)
- **Language**: JavaScript (JSX)

## Structure

```
src/
├─ App.jsx                  진입점
└─ 2026/
   ├─ direction-c2.jsx      현재 디자인 (레이아웃 + 스타일 + 인터랙션)
   └─ data.jsx              이력/프로젝트 데이터
```

콘텐츠는 [`src/2026/data.jsx`](src/2026/data.jsx)에서 관리하며,
화면 구성과 스타일은 [`src/2026/direction-c2.jsx`](src/2026/direction-c2.jsx) 한 파일에 담겨 있습니다.
