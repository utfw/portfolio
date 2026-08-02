// Resume + portfolio data — consumed by direction-c2.jsx
// 렌더링에 실제로 사용되는 필드만 유지합니다.
const data = {
  nameEn: "Hwan Choi",
  role: "AI Agent & Frontend Engineer",
  tagline: "저는 스스로 나아지는 시스템을 짓는 일에 관심이 있습니다.",
  intro: [
    "저는 심리학을 전공하며 사람이 정보를 어떻게 인식하고 판단하는지 오래 들여다봤습니다. 인터페이스가 사람의 행동을 특정 방향으로 이끌 수 있다는 점에 끌려 프론트엔드로, 다시 사용자의 목표를 이해하고 스스로 작업을 수행하는 에이전트 시스템을 설계하는 일로 자연스럽게 이어졌습니다.",
    "프론트엔드 엔지니어로서 대규모 그리드 엔진과 접근성, AI 챗봇 서비스를 만들어 왔고, 지금은 자율 에이전트 쪽에 가장 큰 관심을 두고 있습니다.",
    "개인 프로젝트에서 확인한 것들을 회사 업무로 옮겨, 이슈를 받아 구현과 검증, 리뷰를 거쳐 Draft MR까지 스스로 올리는 파이프라인을 만들고 있습니다. 결과를 가른 것은 모델의 성능이 아니라 에이전트에게 무엇을 맡기고 무엇을 맡기지 않을지를 정하는 일이었습니다.",
  ],
  skills: {
    Languages: ["TypeScript", "JavaScript (ES6+)"],
    "Frontend": ["React", "Next.js", "Vue", "Angular", "Recoil", "Chakra UI"],
    "AI / Agent": ["OpenAI API", "Claude Code", "Ollama", "RAG", "Embedding", "Prompt Engineering", "Agent Workflow Design", "Headless Orchestration", "LLM Evaluation", "Prompt Injection Defense"],
    "Testing/QA": ["Playwright", "Puppeteer", "Jest", "axe-core", "jsdom"],
    Engineering: ["Virtual Rendering", "Component Architecture", "Accessibility (WCAG)", "State Management", "Performance Optimization", "CI/CD", "GitHub Actions (self-hosted)"],
  },
  caseStudies: [
    {
      id: "bada",
      number: "01",
      title: "Bada",
      subtitle: "자율 에이전트가 코드를 직접 작성하고 검증하는 닫힌 루프를 만들 수 있을까",
      tag: "Agent · Workflow · Lab",
      period: "2026.04 — 현재",
      link: "github.com/utfw/bada",
      problem:
        "LLM은 코드를 생성할 수 있지만, 자신이 만든 결과물을 스스로 검증하기는 어렵다고 느꼈습니다. 그래서 단발성 호출을 넘어 관찰 → 계획 → 구현 → 검증 사이클을 반복하며 결과를 다듬어 가는 자율 개선 시스템을 직접 만들어 보고 싶었습니다.",
      solution: [
        {
          h: "4-Stage Agent Pipeline",
          d: "Observer(Playwright 관찰) → Planner(goals.md 계획) → Implementer(구현 · 타입 체크) → Reviewer(검증 후 자동 커밋).",
        },
        {
          h: "Two-Layer Verification",
          d: "산술로 판정되는 항목은 LLM 없이 코드로 결정론적 검증해 계산 오류와 토큰을 줄이고, 그것으로 못 잡는 시각 품질은 Reviewer가 스크린샷 · 탑뷰를 직접 열어 육안 확인.",
        },
        {
          h: "Reflection Loop",
          d: "육안 관찰을 적지 않은 통과는 자동 무효 처리하고 REVIEW_FAIL 시 재시도. 실패 패턴을 REVIEW_CHECKLIST.md에 축적해 다음 실행에 반영.",
        },
        {
          h: "Self-Improvement Workflow",
          d: "Reviewer의 개선 제안(SUGGESTIONS)을 goals.md에 자동 반영해 다음 사이클의 목표로 전환.",
        },
        {
          h: "Always-On Runner Loop",
          d: "self-hosted GitHub Actions 러너 위에서 사람 트리거 없이 반복 실행. 래퍼 스크립트가 종료 코드로 분기해 정상 종료면 잠깐 쉬고 다음 반복, 사용 한도(exit 75)면 리셋 시각까지 대기 후 스스로 재개, 예기치 않은 실패일 때만 루프를 멈추고 사람을 기다림.",
        },
        {
          h: "Unattended Guardrails",
          d: "완료되지 않은 목표가 남긴 변경은 되돌리고, 변경 0인 완료는 커밋하지 않으며, 커밋 본문에 실제 변경 파일을 기록. 에이전트 자신의 코드는 자동 커밋에서 제외해 사람 검토를 거치게 함.",
        },
        {
          h: "Multi-Model Architecture",
          d: "Ollama(로컬 경량 추론)와 Claude Code(복잡한 구현)를 역할에 따라 분리 활용. 상시 루프에서는 목표 생성·중복 판정 같은 가벼운 작업을 로컬 모델이 먼저 맡고, 없거나 형식을 어기면 Claude가 폴백해 사용 한도를 아끼면서 루프가 끊기지 않게 함.",
        },
      ],
      lessons:
        "이 작업을 하면서, 에이전트 시스템에서는 모델을 어떻게 호출하느냐보다 상태 관리와 검증 체계, 피드백 루프를 어떻게 설계하느냐가 결과를 좌우한다는 것을 배웠습니다. 여기서 얻은 판단들은 이후 회사에서 이슈 → Draft MR 파이프라인을 설계할 때 그대로 출발점이 됐습니다.",
      pipeline: [
        { stage: "Observer", tool: "Playwright", role: "런타임 관찰", out: "스크린샷" },
        { stage: "Planner", tool: "Read-only", role: "계획 수립", out: "plan.md" },
        { stage: "Implementer", tool: "Edit / Write", role: "코드 수정", out: "TypeCheck" },
        { stage: "Reviewer", tool: "수치+육안", role: "이중 검증", out: "PASS / FAIL" },
      ],
      pipelineNote: "각 단계는 독립된 claude -p 에이전트입니다. 여기에 더해 Evolver(dramaScore 계산 모듈)가 Observer와 Planner 사이에서 정체를 감지해 다음 개선 목표를 자동 생성합니다. 이 파이프라인 전체는 self-hosted 러너 위에서 사람 트리거 없이 반복 실행됩니다.",
      evolution: [
        {
          phase: "Phase 1",
          title: "Correctness Loop",
          body: "Observer → Planner → Implementer → Reviewer 구조로 버그를 잡고 회귀를 막았습니다. 다만 REVIEW_PASS가 반복돼도 장면이 더 나아지지는 않는 한계에 부딪혔습니다.",
        },
        {
          phase: "Phase 2",
          title: "Evolver 추가",
          body: "dramaScore(물고기-포식자 상호작용 지표)로 정체를 감지하고 개선 목표를 자동으로 생성했습니다. 사람이 목표를 주던 구조에서, 에이전트가 스스로 다음 목표를 찾는 구조로 옮겨갔습니다.",
        },
        {
          phase: "Phase 3",
          title: "Always-On Loop",
          body: "self-hosted 러너를 등록해 루프가 사람 트리거 없이 계속 돌게 했습니다. 매 실행마다 새 머신을 띄우는 CI 방식은 아직 푸시되지 않은 완료 커밋이 유실되고, 사용 한도로 프로세스가 죽으면 다시 깨울 수단이 없어서, 상시 머신에서 한 프로세스가 계속 도는 구조를 택했습니다. 이때부터 rate-limit은 '다음 실행을 못 깨우는 문제'가 아니라 '리셋 시각까지 자면 되는 문제'가 됐습니다.",
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
        {
          type: "Type E",
          title: "Fake Completion",
          body: "상시 루프의 러너 로그를 보니 같은 목표가 반복해서 '완료'로 마킹되는데 실제 코드 변경은 0이었습니다. 그 값은 매 프레임 덮어써져 고쳐도 무효였고, 에이전트는 '바꾸지 않는 게 맞다'는 판단을 숨긴 채 완료로 위장하고 있었습니다. 바꾸지 않기로 했다면 이유를 남기고 보류하게 고쳐 가짜 완료와 같은 목표의 무한 재생성을 함께 끊었습니다. 사람이 지켜보지 않는 루프에서는 실패를 정직하게 드러내는 경로가 따로 설계돼야 했습니다.",
        },
      ],
      lessonsLearned: [
        { n: "01", h: "Evaluation is harder than Generation", d: "평가 기준이 없으면 개선할 목표도 생기지 않습니다." },
        { n: "02", h: "Metrics are not understanding", d: "측정값이 맞아도 그 의미를 잘못 읽을 수 있습니다." },
        { n: "03", h: "Evaluation systems require evaluation", d: "멀티모달 판정도 바로 합격에 쓰지 않고, 사람 라벨과 대조해 신뢰성부터 측정했습니다." },
        { n: "04", h: "Correctness does not imply progress", d: "퇴행을 막는 루프와 진보를 만드는 루프는 따로 설계해야 합니다." },
        { n: "05", h: "Human judgment remains necessary", d: "자동화할 수 있는 영역과 사람이 필요한 영역의 경계를 분명히 긋는 것이 핵심입니다." },
        { n: "06", h: "Autonomy is an operations problem", d: "상시로 돌리려면 모델 성능보다 종료 코드 계약·헤드리스 인증·커밋 무결성 같은 운영 설계가 먼저 필요했습니다." },
        { n: "07", h: "Constrain the agent, not the model", d: "쓸 수 있는 도구를 미리 좁히는 것이 더 좋은 모델을 붙이는 것보다 결과를 안정시켰습니다." },
      ],
      results: [
        { k: "Review 수행", v: "470+" },
        { k: "REVIEW_PASS", v: "361" },
        { k: "REVIEW_FAIL", v: "59" },
        { k: "자동 커밋", v: "67" },
      ],
    },
    {
      id: "issue-to-mr-pipeline",
      number: "02",
      title: "이슈 → MR 자율 파이프라인",
      subtitle: "Bada에서 검증한 구조를 실제 제품 개발 흐름에 옮긴 사내 자동화",
      tag: "Agent · Pipeline · DevOps",
      period: "2026.07 — 현재",
      challenge:
        "이슈를 받아 브랜치를 만들고 구현과 검증, 리뷰를 거쳐 Draft MR을 올리기까지, 반복되는 개발 절차를 에이전트가 대신하게 하는 것이 목표였습니다. 사람이 지켜보지 않는 상태에서 실제 제품 코드를 고치는 일이므로, 에이전트에게 어디까지 권한을 줄지, 스스로 만든 결과를 무엇으로 검증하게 할지, 실행마다 달라지는 부분을 어디까지 고정해 둘지를 먼저 정해야 했습니다.",
      solution: [
        {
          h: "7단계 고정 파이프라인 · 단일 검토 지점",
          d: "이슈 확인, 브랜치, 설계, 구현, 검증, 리뷰, 커밋을 정해진 순서로 고정하고, 에이전트가 할 수 있는 일은 Draft MR을 올리는 데까지로 두었습니다. 머지와 배포는 되돌리기 어렵고 다른 작업자에게 바로 영향을 주는 일이라, 리뷰 완료 처리를 포함해 아예 도구에서 빼두어 사람의 확인을 거치게 했습니다.",
        },
        {
          h: "구현과 리뷰의 분리",
          d: "구현한 에이전트가 이어서 리뷰까지 하면, 자신의 구현 의도를 근거로 결과를 정당화하는 편향이 생깁니다. 그래서 리뷰는 정확성·접근성·좌우 반전 레이아웃·성능 네 관점의 별도 에이전트로 분리해 동시에 실행하고, 각 관점에는 구현 의도나 설계 배경 없이 변경 내용과 판단 기준만 넘겼습니다. 한 관점이라도 문제를 지적하면 구현 단계로 되돌아가 해당 부분만 수정했고, 재시도 횟수에 상한을 두어 스스로 해결하지 못한 경우에는 무리해서 통과시키는 대신 남은 문제를 기록하고 사람에게 넘기도록 했습니다.",
        },
        {
          h: "재현되지 않는 이슈의 종료 경로",
          d: "이슈가 항상 유효한 것은 아닙니다. 재현 절차를 그대로 따라도 재현되지 않거나 이미 고쳐져 있는 경우가 있는데, 이때 무언가를 고쳐야 한다고 전제하면 멀쩡한 코드를 건드리게 됩니다. 그래서 재현되지 않으면 손대지 않고 구현 단계에서 종료한 뒤 그렇게 판단한 근거를 이슈에 남기게 했습니다. 실행 결과도 성공·실패·미재현 세 가지로 나눠 집계해, 고치지 않은 실행이 실패로 묻히지 않게 했습니다.",
        },
        {
          h: "외부 입력 격리 · 출력 마스킹",
          d: "이슈 본문과 코멘트는 누구나 쓸 수 있는 텍스트인데, 에이전트는 그것을 읽고 코드를 수정합니다. 본문에 적힌 문장이 지시로 읽히면 의도하지 않은 변경으로 이어질 수 있다고 보고, 문자를 정규화하고 보이지 않는 제어문자를 제거한 뒤 실행마다 달라지는 구분자로 감싸 참고 자료로만 다루도록 격리했습니다. 내보내는 쪽에서는 토큰처럼 노출되면 안 되는 값을 가리도록 했습니다.",
        },
        {
          h: "결정론적 작업의 스크립트화",
          d: "빌드 설정 조회, 참조 방향 검사, 테스트 실행처럼 결과가 매번 같아야 하는 일을 에이전트가 그때그때 명령을 조립해 수행하고 있었습니다. 검사 범위가 실행마다 달라지면서 잘못된 지적이 60건 넘게 나온 적이 있어, 이 작업들을 스크립트로 고정하고 에이전트는 호출만 하게 했습니다.",
        },
        {
          h: "실행 기록 구조화",
          d: "사람이 지켜보지 않는 파이프라인은 무엇이 잘못됐는지 나중에 되짚을 수 있어야 한다고 보고, 실행마다 소요 시간과 비용, 단계별 결과가 기록으로 남게 했습니다. 그전까지는 로그가 콘솔로 흘러가 버려 어느 단계에서 시간과 비용을 쓰는지 알 수 없었습니다. 모델을 지정하지 않으면 실행할 때마다 달라진다는 것은 Bada에서 이미 겪었기 때문에, 검토 단계가 작은 모델로 돌아 결함을 놓치는 일이 없도록 단계별로 쓸 모델을 처음부터 고정해 두었습니다.",
        },
        {
          h: "지침을 문서 대신 스킬에",
          d: "절차 문서가 여러 곳에 흩어져 서로 다른 말을 하고 있었고, 그중에는 이미 쓰이지 않는 방식을 권하는 것도 있었습니다. 실행 기록을 열어 보니 에이전트는 문서를 서두에 통째로 읽고도 실제 인용은 두 건뿐이었습니다. 읽어야 할 문서를 따로 두는 한 사본은 계속 낡는다고 보고, 지침을 에이전트가 실행하는 스킬 안에 직접 넣어 문서와 실제 동작이 어긋날 수 없게 했습니다.",
        },
      ],
      stack: ["Claude Code (headless)", "Node.js", "Docker", "GitLab API", "Agent Orchestration", "Playwright"],
      metrics: [
        { k: "자율 구간", v: "7단계" },
        { k: "사람 확인", v: "Draft MR 1회" },
        { k: "검증이 찾은 결함", v: "14건" },
        { k: "실행당 소요", v: "17–23분" },
      ],
    },
    {
      id: "review-bot-quality",
      number: "03",
      title: "MR 리뷰 봇 품질 개선",
      subtitle: "도구가 볼 수 없는 것을 요구하던 지시문을 다시 쓰고 반복 측정으로 검증한 개선",
      tag: "LLM Ops · Evaluation · Prompt",
      period: "2026.07",
      challenge:
        "사내 MR 리뷰 봇이 확인을 떠넘기는 말과 사실이 아닌 지적을 많이 달아, 아무도 읽지 않는 상태였습니다. 지시문은 코멘트를 쓰기 전에 어떤 입력에서 어떤 장애가 생기는지까지 제시하라고 요구하고 있었지만, 정작 봇이 받는 것은 변경된 줄과 그 앞뒤 몇 줄, MR 본문이 전부였습니다. 다른 파일도 실행 중의 상태도 볼 수 없는 모델에게 알 수 없는 것을 요구한 셈이라, 모델은 추측으로 메우거나 사람에게 확인을 넘길 수밖에 없었습니다.",
      solution: [
        {
          h: "판단 가능한 범위로 지시문 재작성",
          d: "도구가 볼 수 없는 것을 요구하는 한 추측은 사라지지 않는다고 보고, 장애까지 증명하라는 요구를 걷어내고 변경된 코드만으로 결론이 나는 세 가지에 집중하게 했습니다. 같은 MR 안의 변경끼리 앞뒤가 맞지 않는 경우, 정해둔 규칙을 어긴 경우, 조건식과 그 사용처가 함께 보이면서 특정 값에서 결과가 뒤집히는 경우입니다. 판단할 수 없는 항목을 덜어내면서 25개였던 점검 항목은 8개로, 지시문 분량은 60% 줄었습니다.",
        },
        {
          h: "동일 입력 96회 반복 측정",
          d: "지시문을 고쳤다는 것만으로는 나아졌다고 말할 수 없어, 과거 MR 16건을 기존 지시문과 새 지시문으로 각각 3회씩 돌려 비교했습니다. 같은 입력에도 결과가 조금씩 달라지기 때문에, 한 번의 실행으로 판단하지 않도록 3회씩 측정해 평균을 봤습니다.",
        },
        {
          h: "잡음 억제와 검출력의 상충",
          d: "잡음을 막으려고 조심하라는 문구를 넣을 때마다 제대로 된 지적도 함께 줄었고, 서로 다른 네 버전에서 같은 결과가 반복됐습니다. 다만 같은 의도라도 표현에 따라 손실의 크기가 달랐습니다. 대부분의 MR에는 문제가 없다는 식으로 미리 단정하는 문장이 특히 해로웠고, 쓸 범위만 정해주는 쪽은 검출을 거의 떨어뜨리지 않았습니다. 잡음은 태도를 당부해서가 아니라 판단 기준을 좁혀서 줄여야 한다고 정리했습니다.",
        },
        {
          h: "모델 교체 검증 · 설정 점검",
          d: "모델을 올리면 나아질 여지도 있다고 보고 상위 모델로 바꿔 함께 측정해 봤습니다. 비용이 5배 넘게 드는데 품질은 같았고 요구한 형식을 지키는 정도는 오히려 낮아, 모델의 한계에서 온 문제가 아니라는 것만 확인하고 모델은 그대로 두었습니다. 대신 설정을 점검해, 기본값 그대로여서 큰 MR의 변경 내용이 잘린 채 전달되던 입력 토큰 상한을 늘렸습니다.",
        },
      ],
      stack: ["Prompt Engineering", "LLM Evaluation", "GitLab CI"],
      metrics: [
        { k: "금지 형태 비율", v: "12% → 0%" },
        { k: "유효 지적률", v: "73% → 77%" },
        { k: "총 지적 수", v: "34 → 46" },
        { k: "입력 토큰", v: "45% 절감" },
      ],
    },
    {
      id: "chatbot-engine",
      number: "04",
      title: "IBChatbot",
      subtitle: "RAG 검색 품질을 개선해 응답의 신뢰성과 API 비용을 함께 잡은 AI 챗봇 마이그레이션",
      tag: "AI · RAG · Migration",
      period: "2024.06 — 2024.10",
      challenge:
        "Python(Streamlit)으로 만들어진 레거시 챗봇을 React 기반으로 전환하는 일을 맡았습니다. 단순히 옮겨오는 데 그치지 않고 응답 품질과 운영 비용, 기술지원 공수까지 함께 개선하는 것이 과제였습니다.",
      solution: [
        {
          h: "React / Recoil 전면 마이그레이션",
          d: "Streamlit 구조를 React로 다시 짜고 Recoil로 세션 상태를 일원화했습니다. 자연스러운 텍스트 타이핑 효과와 저해상도 기기용 사이드 메뉴까지 직접 구현했습니다.",
        },
        {
          h: "RAG 검색 품질 개선 · 응답 안전장치",
          d: "매뉴얼 문서를 OpenAI 임베딩으로 검색해 컨텍스트에 주입하는 기존 RAG 구조 위에서, 검색된 문서의 유사도가 임계값에 못 미치면 모델 호출 없이 대체 응답으로 전환하는 안전장치를 추가했습니다. 이때 '모른다'로 끝내지 않고 고객지원 연락처와 홈페이지 링크를 함께 안내해, 환각을 막으면서도 사용자가 다음 행동을 이어가게 했습니다.",
        },
        {
          h: "데이터 정제 · 프롬프트 엔지니어링",
          d: "매뉴얼 문서의 주석·이미지·불필요한 토큰을 제거하는 정제와 프롬프트 엔지니어링으로 API 비용과 환각을 함께 줄였습니다.",
        },
        {
          h: "Iframe 코드 샌드박스",
          d: "답변에 실행 가능한 코드가 포함되면, iframe 격리 환경에서 안전하게 실행하고 결과 화면을 실시간으로 렌더링하는 데모 뷰어를 설계했습니다.",
        },
        {
          h: "비동기 로그 · 세션 처리",
          d: "긴 답변을 위한 DB 로그 저장을 비동기 병렬로 처리하고, 이용 동의 쿠키(7일 유지)를 연동해 운영 환경의 안정성을 확보했습니다.",
        },
      ],
      stack: ["React", "Recoil", "OpenAI API", "GPT-4o mini", "RAG", "Embedding", "Python", "Docker"],
      metrics: [
        { k: "마이그레이션", v: "Python → React" },
        { k: "응답 신뢰성", v: "RAG · 안전장치" },
        { k: "기술지원 공수", v: "절감" },
      ],
    },
    {
      id: "grid-engine",
      number: "05",
      title: "차세대 그리드 엔진",
      subtitle: "수백만 행 가상 스크롤과 웹 접근성을 양립시킨 그리드 엔진",
      tag: "Architecture · a11y · Engine",
      period: "2026.01 — 현재",
      challenge:
        "DOM에 존재하지 않는 행에 키보드 포커스를 유지하고, NVDA 스크린리더가 가상화된 셀을 정확히 탐색하게 만들어야 했습니다. 이를 풀기 위해서는 브라우저 렌더링 모델 자체를 깊이 이해해야 했습니다.",
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
        { k: "처리 규모", v: "수백만 행" },
        { k: "접근성", v: "WCAG AA · NVDA" },
        { k: "검증", v: "자동화 테스트" },
      ],
    },
    {
      id: "legacy-grid",
      number: "06",
      title: "IBSheet8",
      subtitle: "상용 그리드 엔진을 안정적으로 유지보수하며 QA를 자동화하다",
      tag: "Maintenance · QA · Multi-framework",
      period: "2023.07 — 2025.12",
      challenge:
        "수년간 상용 서비스되며 여러 고객사가 운영해 온 제품이라, 코드에는 그만큼 오래된 레거시와 도입사별 커스텀이 쌓여 있었습니다. 그 위에서 한 번의 릴리즈가 어느 환경에서도 기존 동작을 유지하도록 만드는 것이 핵심 과제였습니다.",
      solution: [
        {
          h: "코어 엔진 기능 보완",
          d: "피벗 테이블 데이터 연동 오류를 바로잡고 다차원 푸터 계산 로직을 확장했으며, 대용량 모드에서 트리시트 렌더링이 깨지고 속도가 떨어지던 문제를 구조적으로 해결했습니다.",
        },
        {
          h: "차트 다이얼로그 플러그인 개발",
          d: "차트 생성 UI 플러그인 런칭을 전담해 이미지 다운로드·복합 차트 반전·데이터 레이블/범례 예외 처리와 테마별 색상 변환까지 정교화했습니다.",
        },
        {
          h: "코어 보안 강화",
          d: "시크릿 모드의 localStorage 예외를 처리하고, 제품 전반의 eval 사용처를 정밀 분석해 JSON.parse·new Function 등 안전한 대체 로직으로 교체하며 취약점을 제거했습니다.",
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
    role: "프론트엔드 엔지니어",
    period: "2023.07 — 재직 중",
    timeline: [
      { date: "2023.08", desc: "IBSheet8 그리드 엔진 유지보수 · 신규 기능 개발" },
      { date: "2024.06", desc: "IBChatbot React · Recoil 마이그레이션" },
      { date: "2024.10", desc: "IBChatbot 출시" },
      { date: "2024.10", desc: "엔터프라이즈 클라우드 플랫폼 PoC 참여" },
      { date: "2025.12", desc: "IBSheet8 유지보수에서 차세대 그리드 엔진 신규 개발 전담으로 전환" },
      { date: "2026.01", desc: "차세대 그리드 엔진 핵심 아키텍처 설계" },
      { date: "2026.07", desc: "MR 리뷰 봇 지시문 재작성 · 리뷰 품질 측정" },
      { date: "2026.07", desc: "이슈 → Draft MR 자동화 파이프라인 설계 · 구축", now: true },
    ],
  },
  education: [
    { school: "강원대학교", detail: "심리학과 졸업", period: "2010.03 — 2017.02" },
    { school: "이젠아카데미", detail: "UI/UX 웹·앱 디자인 / React.js", period: "2022.11 — 2023.05" },
  ],
  contact: {
    heading: "새로운 기회를 찾고 있습니다 —",
    email: "hwan.c.0330@gmail.com",
    github: "github.com/utfw",
    location: "Seoul, KR",
  },
  // PDF 전용 콘텐츠 — make-pdf.mjs에서만 참조 (사이트 direction-c2.jsx는 사용하지 않음)
  pdf: {
    workLead: [
      "에이전트가 스스로 코드를 고치게 만들었고, 같은 구조를 회사로 옮겨 이슈에서 Draft MR까지 스스로 올리게 했고, 챗봇이 모르는 건 지어내지 않고 다음 갈 곳을 알려주게 했고, 수백만 행을 스크린리더가 읽게 했습니다.",
    ],
  },
};

export default data
