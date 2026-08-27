import React from 'react';
import { VARIANTS, DEFAULT_VARIANT } from './variants.jsx';

const { useState: useStateC2, useEffect: useEffectC2, useRef: useRefC2, useMemo: useMemoC2 } = React;

const C2_SECTIONS = [
{ id: "landing", no: "00", label: "Landing" },
{ id: "about", no: "01", label: "About" },
{ id: "work", no: "02", label: "Work" },
{ id: "contact", no: "03", label: "Contact" }];

// Bada 상세는 분량이 많아 탭으로 나눕니다.
const BADA_TABS = [
{ id: "overview", label: "Overview" },
{ id: "architecture", label: "Architecture" },
{ id: "failures", label: "Failure Analysis" },
{ id: "lessons", label: "Lessons" }];

// 렌더 중 정의하면 매 렌더마다 remount되므로 컴포넌트 밖에 둡니다.
function VariantSwitch({ current, onChange, compact }) {
  return (
    <div className={"x-vswitch" + (compact ? " compact" : "")} role="group" aria-label="포트폴리오 버전 선택">
      {Object.values(VARIANTS).map((item) =>
        <button
          key={item.id}
          type="button"
          className={item.id === current ? "on" : ""}
          aria-pressed={item.id === current}
          onClick={() => onChange && onChange(item.id)}>
          {item.label}
        </button>
      )}
    </div>
  );
}

// 케이스 상세 본문 (Solution / Results / Stack) — 아코디언과 Featured가 공유
function CaseDetail({ c }) {
  return (
    <>
      <div className="x-section-h">Solution</div>
      <div style={{ marginBottom: 28 }}>
        {c.solution.map((s, i) =>
          <div key={i} className="x-sol">
            <h4>{s.h}</h4>
            <p>{s.d}</p>
          </div>
        )}
      </div>

      {c.metrics &&
      <>
        <div className="x-section-h">Results</div>
        <div className="x-results-grid" style={{ marginBottom: 28 }}>
          {c.metrics.map((m, i) =>
            <div key={i} className="x-metric text">
              <div className="k">{m.k}</div>
              <div className="v">{m.v}</div>
            </div>
          )}
        </div>
      </>
      }

      {c.stack &&
      <div className="x-stack-row">
        <span className="x-stack-lbl">Stack</span>
        <div>{c.stack.map((s) => <span key={s} className="x-pill">{s}</span>)}</div>
      </div>
      }
    </>
  );
}


export default function DirectionC2({ data, variant = DEFAULT_VARIANT, onVariantChange }) {
  const [section, setSection] = useStateC2("landing");
  const [expandedCase, setExpandedCase] = useStateC2(null); // 아코디언으로 펼친 케이스 id
  const [badaTab, setBadaTab] = useStateC2("overview");
  const [slideDir, setSlideDir] = useStateC2(0); // -1: 왼쪽에서, 1: 오른쪽에서
  const [animKey, setAnimKey] = useStateC2(0);
  const scrollRef = useRefC2(null);

  const v = VARIANTS[variant] || VARIANTS[DEFAULT_VARIANT];

  const sectionIdx = C2_SECTIONS.findIndex((s) => s.id === section);
  const current = C2_SECTIONS[sectionIdx];

  const goSectionById = (id) => {
    setSection((cur) => {
      const curIdx = C2_SECTIONS.findIndex((s) => s.id === cur);
      const nextIdx = C2_SECTIONS.findIndex((s) => s.id === id);
      if (nextIdx === curIdx) return cur;
      setSlideDir(nextIdx > curIdx ? 1 : -1);
      setAnimKey((k) => k + 1);
      setExpandedCase(null);
      return id;
    });
  };

  useEffectC2(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [section, variant]);

  // variant가 바뀌면 펼쳐둔 상태를 초기화 (다른 케이스 목록이므로)
  useEffectC2(() => {
    setExpandedCase(null);
    setBadaTab("overview");
  }, [variant]);

  // ---- 좌우 제스처: 트랙패드 가로 스크롤 + Shift+휠 ----
  useEffectC2(() => {
    const el = scrollRef.current;
    if (!el) return;

    // 한 제스처당 한 섹션만 이동.
    // 트랙패드 관성으로 wheel 이벤트가 길게 이어지므로,
    // 발화 후에는 "이벤트가 일정 시간 멈출 때까지" 잠금을 유지한다(=손가락을 뗄 때까지).
    let locked = false;
    let accum = 0;
    let idleTimer = null;

    // 인접 섹션으로 한 칸 이동. 양 끝에서는 멈춤.
    // setSection이 함수형 업데이트라 최신 state를 클로저로 붙잡을 필요가 없습니다.
    const goStep = (dir) => {
      setSection((cur) => {
        const curIdx = C2_SECTIONS.findIndex((s) => s.id === cur);
        const nextIdx = curIdx + dir;
        if (nextIdx < 0 || nextIdx >= C2_SECTIONS.length) return cur;
        setSlideDir(dir);
        setAnimKey((k) => k + 1);
        setExpandedCase(null);
        return C2_SECTIONS[nextIdx].id;
      });
    };

    const scheduleIdle = (delay) => {
      if (idleTimer) window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(() => {
        accum = 0;
        locked = false; // 관성이 멎으면 다음 스윕 허용
      }, delay);
    };

    const onWheel = (e) => {
      // Shift+휠은 deltaY를 가로 의도로 사용, 그 외에는 트랙패드 가로 스크롤(deltaX)
      const dx = e.shiftKey ? (e.deltaX || e.deltaY) : e.deltaX;
      const vy = e.shiftKey ? 0 : e.deltaY;
      if (Math.abs(dx) <= Math.abs(vy)) return; // 세로 스크롤 의도면 그대로
      e.preventDefault();

      if (locked) { scheduleIdle(200); return; } // 잠긴 동안의 관성은 흡수

      accum += dx;
      scheduleIdle(200);
      if (Math.abs(accum) > 90) {
        locked = true;
        accum = 0;
        goStep(dx > 0 ? 1 : -1);
      }
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      el.removeEventListener("wheel", onWheel);
      if (idleTimer) window.clearTimeout(idleTimer);
    };
  }, []);

  // 뉴트럴 팔레트 — 흰 배경 + 그레이 스케일, 액센트는 소량만.
  const vars = {
    "--x-bg": "#ffffff",
    "--x-bg-2": "#f6f7f8",
    "--x-bg-3": "#eef0f2",
    "--x-ink": "#14171a",
    "--x-ink-2": "#3d4348",
    "--x-mute": "#6b7280",
    "--x-soft": "#9ca3af",
    "--x-line": "#e3e6e9",
    "--x-line-2": "#eef0f2",
    "--x-accent": "#1257c7",
    "--x-sans": "'Noto Sans KR', 'Noto Sans', system-ui, -apple-system, sans-serif",
    "--x-mono": "ui-monospace, 'SF Mono', 'JetBrains Mono', Menlo, monospace"
  };

  // variant의 caseOrder대로 정렬. 목록에 없는 케이스는 원래 순서로 뒤에 붙임.
  const cases = useMemoC2(() => {
    const order = v.caseOrder || [];
    const rank = (c) => {
      const i = order.indexOf(c.id);
      return i === -1 ? order.length + Number(c.number) : i;
    };
    // 표시 번호는 variant 순서에 맞춰 다시 매깁니다 (data의 number는 고정값이라 순서와 어긋남).
    return [...data.caseStudies]
      .sort((a, b) => rank(a) - rank(b))
      .map((c, i) => ({ ...c, number: String(i + 1).padStart(2, "0") }));
  }, [data.caseStudies, v.caseOrder]);

  // variant의 skillOrder대로 Skills 재정렬
  const skillEntries = useMemoC2(() => {
    const order = v.skillOrder || [];
    return Object.entries(data.skills).sort((a, b) => {
      const ia = order.indexOf(a[0]), ib = order.indexOf(b[0]);
      return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
    });
  }, [data.skills, v.skillOrder]);

  const featured = cases.find((c) => c.id === v.featuredId) || cases[0];
  const others = cases.filter((c) => c.id !== featured.id);

  const vswitch = (compact) => <VariantSwitch current={v.id} onChange={onVariantChange} compact={compact} />;

  return (
    <div className="dirX" style={vars}>
      <style>{`
        .dirX {
          width: 100%; height: 100%;
          background: var(--x-bg);
          color: var(--x-ink);
          font-family: var(--x-sans);
          font-size: 16px;
          line-height: 1.75;
          font-weight: 400;
          display: grid;
          grid-template-rows: auto 1fr auto;
          overflow: hidden;
          -webkit-font-smoothing: antialiased;
          letter-spacing: -.003em;
        }
        .dirX a { color: inherit; text-decoration: none; transition: color .15s; }
        .dirX a:hover { color: var(--x-accent); }
        .dirX p { text-wrap: pretty; }
        .dirX *:focus-visible {
          outline: 2px solid var(--x-accent);
          outline-offset: 2px;
        }

        /* ---------- HEADER ---------- */
        .x-header {
          border-bottom: 1px solid var(--x-line);
          background: var(--x-bg);
        }
        .x-header-inner {
          max-width: 1180px;
          width: 100%;
          margin: 0 auto;
          padding: 16px 64px;
          display: grid;
          grid-template-columns: auto 1fr auto;
          gap: 40px;
          align-items: center;
        }
        .x-brand {
          font-size: 15.5px;
          font-weight: 600;
          letter-spacing: -.008em;
          display: flex; align-items: baseline; gap: 10px;
        }
        .x-brand .sub {
          font-size: 12.5px;
          color: var(--x-mute);
          font-weight: 400;
          letter-spacing: 0;
        }
        .x-nav {
          display: flex;
          gap: 26px;
          justify-content: center;
        }
        .x-nav button {
          all: unset; cursor: pointer;
          font-size: 13.5px;
          letter-spacing: .005em;
          color: var(--x-mute);
          padding: 6px 2px;
          position: relative;
          transition: color .18s;
        }
        .x-nav button:hover { color: var(--x-ink); }
        .x-nav button.active { color: var(--x-ink); font-weight: 500; }
        .x-nav button.active::after {
          content: ''; position: absolute;
          left: 0; right: 0; bottom: -1px;
          height: 2px;
          background: var(--x-accent);
        }
        .x-head-right {
          display: flex; align-items: center; gap: 16px;
        }
        .x-status {
          font-size: 12.5px;
          color: var(--x-mute);
          display: flex; align-items: center; gap: 7px;
          letter-spacing: 0;
          white-space: nowrap;
        }
        .x-status .dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #16a34a;
        }

        /* ---------- VARIANT SWITCH ---------- */
        .x-vswitch {
          display: inline-flex;
          border: 1px solid var(--x-line);
          border-radius: 3px;
          overflow: hidden;
          flex: 0 0 auto;
        }
        .x-vswitch button {
          all: unset;
          cursor: pointer;
          padding: 6px 14px;
          font-size: 12.5px;
          font-weight: 500;
          color: var(--x-mute);
          letter-spacing: -.002em;
          transition: background .15s, color .15s;
          white-space: nowrap;
        }
        .x-vswitch button + button { border-left: 1px solid var(--x-line); }
        .x-vswitch button:hover { background: var(--x-bg-2); color: var(--x-ink); }
        .x-vswitch button.on {
          background: var(--x-ink);
          color: #fff;
        }
        .x-vswitch.compact button { padding: 5px 11px; font-size: 12px; }

        /* ---------- MAIN (top-aligned, scrollable) ---------- */
        .x-main {
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          overflow-y: auto;
          overscroll-behavior-x: contain;
          padding: 0 64px;
        }
        .x-frame {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 260px;
          gap: 72px;
          width: 100%;
          max-width: 1180px;
          margin: 0 auto;
          padding: 48px 0 72px;
          flex-shrink: 0;
          align-items: start;
        }
        /* grid 자식이 콘텐츠 폭으로 부풀어 트랙 밖으로 넘치는 것 방지 */
        .x-frame > * { min-width: 0; }

        /* ---------- TYPE ---------- */
        .x-eyebrow {
          font-size: 11px;
          letter-spacing: .2em;
          text-transform: uppercase;
          color: var(--x-mute);
          font-weight: 600;
          margin-bottom: 20px;
          display: flex; align-items: center; gap: 12px;
        }
        .x-eyebrow b {
          color: var(--x-accent);
          font-weight: 600;
          letter-spacing: .1em;
        }
        .x-eyebrow .bar {
          flex: 0 0 24px; height: 2px;
          background: var(--x-accent);
        }

        .x-h1 {
          font-weight: 600;
          font-size: 44px;
          line-height: 1.18;
          letter-spacing: -.032em;
          margin: 0 0 20px;
        }
        .x-h1 .em { color: var(--x-mute); font-weight: 400; }
        .x-h2 {
          font-weight: 600;
          font-size: 30px;
          line-height: 1.26;
          letter-spacing: -.028em;
          margin: 0 0 18px;
        }
        .x-lede {
          font-size: 17.5px;
          line-height: 1.68;
          color: var(--x-ink-2);
          letter-spacing: -.008em;
          margin: 0 0 28px;
          max-width: 36em;
        }
        .x-section-h {
          font-size: 11px;
          letter-spacing: .2em;
          text-transform: uppercase;
          color: var(--x-mute);
          font-weight: 600;
          margin: 0 0 16px;
          padding-bottom: 8px;
          border-bottom: 1px solid var(--x-line);
        }
        .x-section-h.plain { border-bottom: 0; padding-bottom: 0; }

        /* ---------- SLIDE ANIMATION ---------- */
        @keyframes slideInFromRight {
          from { opacity: 0; transform: translateX(40px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInFromLeft {
          from { opacity: 0; transform: translateX(-40px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .x-slide-right { animation: slideInFromRight .3s cubic-bezier(.22,.61,.36,1) both; }
        .x-slide-left  { animation: slideInFromLeft  .3s cubic-bezier(.22,.61,.36,1) both; }
        @media (prefers-reduced-motion: reduce) {
          .x-slide-right, .x-slide-left, .x-acc-body { animation: none !important; }
          .dirX * { transition: none !important; }
        }

        /* ---------- SIDE COLUMN ---------- */
        .x-side {
          font-size: 13px;
          color: var(--x-mute);
          line-height: 1.7;
          display: grid; gap: 20px;
          padding-left: 32px;
          border-left: 1px solid var(--x-line);
          position: sticky;
          top: 0;
        }
        .x-side .lbl {
          font-size: 10px;
          letter-spacing: .2em;
          text-transform: uppercase;
          color: var(--x-soft);
          margin-bottom: 6px;
          font-weight: 600;
        }
        .x-side .val {
          color: var(--x-ink-2);
          font-size: 13.5px;
          line-height: 1.65;
          letter-spacing: -.004em;
          white-space: pre-line;
        }
        .x-side .val b { font-weight: 600; color: var(--x-ink); }

        /* ---------- DL ---------- */
        .x-dl { margin: 0; }
        .x-dl-row {
          display: grid; grid-template-columns: 150px 1fr;
          gap: 24px;
          padding: 16px 0;
          border-bottom: 1px solid var(--x-line-2);
          align-items: baseline;
        }
        .x-dl-row:first-of-type { border-top: 1px solid var(--x-line); }
        .x-dl-row:last-of-type { border-bottom: 1px solid var(--x-line); }
        /* 섹션 헤딩(밑줄 있음) 바로 뒤에 오는 블록은 자기 윗선을 지운다 — 이중선 방지 */
        .x-section-h + .x-dl .x-dl-row:first-of-type,
        .x-section-h + .x-acc-list .x-acc:first-of-type,
        .x-section-h + * > .x-sol:first-child,
        .x-section-h + .x-focus .x-focus-item:first-child,
        .x-section-h + .x-sol { border-top: 0; }
        .x-dl-row dt {
          font-size: 11px;
          letter-spacing: .14em;
          text-transform: uppercase;
          color: var(--x-mute);
          font-weight: 600;
        }
        .x-dl-row dd {
          margin: 0;
          font-size: 15px;
          line-height: 1.7;
          letter-spacing: -.003em;
        }
        .x-dl-row dd b { font-weight: 600; }

        /* ---------- EXPERIENCE TIMELINE ---------- */
        .x-exp-head {
          display: flex; align-items: baseline; justify-content: space-between;
          gap: 16px;
          padding-bottom: 14px;
          border-bottom: 1px solid var(--x-line);
        }
        .x-exp-head b { font-weight: 600; font-size: 16px; letter-spacing: -.008em; }
        .x-exp-head .role { color: var(--x-mute); font-size: 14px; margin-left: 8px; }
        .x-exp-period {
          font-size: 12px; color: var(--x-mute);
          letter-spacing: .02em; white-space: nowrap;
          font-variant-numeric: tabular-nums;
        }
        .x-timeline { list-style: none; margin: 2px 0 0; padding: 0; }
        .x-timeline li {
          display: grid; grid-template-columns: 76px 1fr; gap: 20px;
          padding: 11px 0; align-items: baseline;
          font-size: 14.5px; line-height: 1.6;
          border-bottom: 1px solid var(--x-line-2);
        }
        .x-timeline li:last-child { border-bottom: 0; }
        .x-timeline .t-date {
          font-size: 12px; color: var(--x-mute); letter-spacing: .02em;
          font-variant-numeric: tabular-nums;
          font-family: var(--x-mono);
        }
        .x-timeline li.now .t-date { color: var(--x-accent); }
        .x-timeline li.now b { color: var(--x-accent); font-weight: 600; }

        /* ---------- PILL ---------- */
        .x-pill {
          display: inline-block;
          padding: 4px 10px;
          font-size: 12px;
          background: var(--x-bg-2);
          border: 1px solid var(--x-line);
          border-radius: 3px;
          color: var(--x-ink-2);
          margin: 3px 5px 3px 0;
          letter-spacing: -.002em;
          white-space: nowrap;
        }
        /* ---------- BUTTON ---------- */
        .x-btn {
          all: unset; cursor: pointer;
          padding: 11px 22px;
          font-size: 14px;
          font-weight: 500;
          color: var(--x-ink);
          border: 1px solid var(--x-line);
          border-radius: 3px;
          letter-spacing: -.005em;
          transition: background .15s, color .15s, border-color .15s;
        }
        .x-btn:hover { background: var(--x-bg-2); border-color: var(--x-soft); }
        .x-btn-primary {
          background: var(--x-ink);
          border-color: var(--x-ink);
          color: #fff;
        }
        .x-btn-primary:hover {
          background: var(--x-accent);
          border-color: var(--x-accent);
          color: #fff;
        }

        /* ---------- FEATURED CARD ---------- */
        .x-feat {
          border: 1px solid var(--x-line);
          border-radius: 4px;
          overflow: hidden;
        }
        .x-feat-head {
          padding: 22px 26px;
          background: var(--x-bg-2);
          border-bottom: 1px solid var(--x-line);
        }
        .x-feat-badges {
          display: flex; flex-wrap: wrap; align-items: center;
          gap: 10px; margin-bottom: 12px;
        }
        .x-badge {
          font-size: 10px; letter-spacing: .14em; text-transform: uppercase;
          font-weight: 600; padding: 3px 8px; border-radius: 2px;
          background: var(--x-accent); color: #fff;
        }
        .x-badge.ghost {
          background: transparent; color: var(--x-mute);
          border: 1px solid var(--x-line); font-weight: 500;
        }
        .x-feat-title {
          font-size: 25px; font-weight: 600;
          letter-spacing: -.024em; margin-bottom: 8px;
        }
        .x-feat-sub {
          font-size: 15px; color: var(--x-mute);
          line-height: 1.65; margin: 0;
        }
        .x-feat-body { padding: 26px; }

        /* ---------- TABS ---------- */
        .x-tabs {
          display: flex; gap: 2px;
          border-bottom: 1px solid var(--x-line);
          margin-bottom: 26px;
          overflow-x: auto;
          scrollbar-width: none;
        }
        .x-tabs::-webkit-scrollbar { display: none; }
        .x-tabs button {
          all: unset; cursor: pointer;
          padding: 10px 16px;
          font-size: 13.5px; font-weight: 500;
          color: var(--x-mute);
          border-bottom: 2px solid transparent;
          margin-bottom: -1px;
          white-space: nowrap;
          transition: color .15s, border-color .15s;
        }
        .x-tabs button:hover { color: var(--x-ink); }
        .x-tabs button.on {
          color: var(--x-accent);
          border-bottom-color: var(--x-accent);
        }

        /* ---------- PIPELINE DIAGRAM ---------- */
        .x-pipe {
          display: flex;
          align-items: stretch;
          gap: 0;
          border: 1px solid var(--x-line);
          border-radius: 4px;
          margin: 0 0 14px;
          overflow-x: auto;
        }
        .x-pipe-stage {
          flex: 1 1 0;
          min-width: 128px;
          display: flex;
          flex-direction: column;
          gap: 7px;
          padding: 18px 16px;
        }
        .x-pipe-stage + .x-pipe-stage { border-left: 1px solid var(--x-line); }
        .x-pipe-idx {
          font-size: 10px; font-weight: 600;
          letter-spacing: .14em; color: var(--x-soft);
          font-family: var(--x-mono);
        }
        .x-pipe-name {
          font-size: 14.5px;
          font-weight: 600;
          letter-spacing: -.01em;
          color: var(--x-ink);
        }
        .x-pipe-tool {
          font-family: var(--x-mono);
          font-size: 10.5px;
          letter-spacing: .01em;
          color: var(--x-accent);
          background: var(--x-bg-2);
          border: 1px solid var(--x-line);
          border-radius: 2px;
          padding: 2px 6px;
          align-self: flex-start;
        }
        .x-pipe-rows {
          display: flex;
          flex-direction: column;
          gap: 2px;
          margin-top: 4px;
          padding-top: 8px;
          border-top: 1px solid var(--x-line-2);
          font-size: 12px;
          line-height: 1.5;
          color: var(--x-mute);
        }
        .x-note {
          margin: 0 0 28px;
          padding: 12px 16px;
          background: var(--x-bg-2);
          border-left: 2px solid var(--x-soft);
          border-radius: 0 3px 3px 0;
          font-size: 13px;
          line-height: 1.7;
          color: var(--x-ink-2);
          letter-spacing: -.003em;
        }

        /* ---------- ACCORDION ---------- */
        .x-acc { border-bottom: 1px solid var(--x-line-2); }
        .x-acc:first-of-type { border-top: 1px solid var(--x-line); }
        .x-acc.open { background: var(--x-bg-2); }
        .x-acc-head {
          all: unset;
          box-sizing: border-box;
          display: grid;
          width: 100%;
          grid-template-columns: 48px 1fr auto;
          gap: 20px;
          padding: 22px 16px;
          cursor: pointer;
          align-items: baseline;
          transition: background .15s;
        }
        .x-acc-head:hover { background: var(--x-bg-2); }
        .x-acc-head:hover .x-case-title { color: var(--x-accent); }
        .x-acc.open .x-case-title { color: var(--x-accent); }
        .x-acc-chevron {
          color: var(--x-soft);
          align-self: start;
          margin-top: 6px;
          transition: color .15s, transform .25s cubic-bezier(.22,.61,.36,1);
        }
        .x-acc.open .x-acc-chevron {
          color: var(--x-accent);
          transform: rotate(180deg);
        }
        .x-case-no {
          font-size: 12px;
          color: var(--x-soft);
          font-weight: 600;
          letter-spacing: .1em;
          font-family: var(--x-mono);
        }
        .x-case-title {
          font-size: 20px;
          font-weight: 600;
          letter-spacing: -.02em;
          line-height: 1.3;
          transition: color .18s;
        }
        .x-case-sub {
          margin-top: 5px;
          font-size: 14px;
          color: var(--x-mute);
          line-height: 1.6;
          letter-spacing: -.003em;
        }
        .x-case-meta {
          margin-top: 10px;
          font-size: 12px;
          color: var(--x-mute);
          letter-spacing: .01em;
          display: flex; flex-wrap: wrap; gap: 8px; align-items: center;
        }
        .x-acc-body {
          overflow: hidden;
          animation: accOpen .3s cubic-bezier(.22,.61,.36,1);
        }
        .x-acc-grid {
          padding: 4px 16px 32px 68px;
        }
        @keyframes accOpen {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ---------- SOLUTION ROWS ---------- */
        .x-sol {
          padding: 18px 0;
          border-top: 1px solid var(--x-line-2);
          display: grid;
          grid-template-columns: 210px 1fr;
          gap: 26px;
          align-items: baseline;
        }
        .x-sol:last-child { border-bottom: 1px solid var(--x-line-2); }
        .x-sol h4 {
          margin: 0;
          font-size: 14.5px;
          font-weight: 600;
          letter-spacing: -.008em;
          line-height: 1.5;
        }
        .x-sol h4 .ph {
          color: var(--x-accent); font-size: 10.5px;
          letter-spacing: .12em; display: block; margin-bottom: 3px;
          font-weight: 600; font-family: var(--x-mono);
        }
        .x-sol p {
          margin: 0;
          font-size: 14.5px;
          line-height: 1.78;
          color: var(--x-ink-2);
        }

        /* ---------- LESSONS ---------- */
        .x-focus { list-style: none; margin: 0; padding: 0; }
        .x-focus-item {
          display: grid;
          grid-template-columns: 34px 1fr;
          gap: 16px;
          align-items: baseline;
          padding: 14px 0;
          border-bottom: 1px solid var(--x-line-2);
        }
        .x-focus-item:first-child { border-top: 1px solid var(--x-line-2); }
        .x-focus-item .n {
          font-size: 12px;
          color: var(--x-soft);
          font-weight: 600;
          letter-spacing: .08em;
          font-family: var(--x-mono);
        }
        .x-focus-item .h {
          font-size: 15px;
          font-weight: 600;
          letter-spacing: -.008em;
          margin-bottom: 3px;
        }
        .x-focus-item .d {
          font-size: 14px;
          color: var(--x-mute);
          line-height: 1.65;
          letter-spacing: -.003em;
        }

        /* ---------- METRICS ---------- */
        .x-results-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 1px;
          background: var(--x-line);
          border: 1px solid var(--x-line);
          border-radius: 4px;
          overflow: hidden;
        }
        .x-metric {
          padding: 16px 18px;
          background: var(--x-bg);
          display: flex; flex-direction: column; gap: 6px;
        }
        .x-metric .k {
          font-size: 10.5px;
          letter-spacing: .16em;
          text-transform: uppercase;
          color: var(--x-mute);
          font-weight: 600;
        }
        .x-metric .v {
          font-size: 22px;
          font-weight: 600;
          color: var(--x-ink);
          letter-spacing: -.02em;
          font-variant-numeric: tabular-nums;
          line-height: 1.2;
        }
        .x-metric.text .v {
          font-size: 15px;
          letter-spacing: -.005em;
          line-height: 1.4;
        }

        /* ---------- STACK ROW ---------- */
        .x-stack-row {
          display: grid; grid-template-columns: 210px 1fr;
          gap: 26px; align-items: baseline;
          padding-top: 18px;
        }
        .x-stack-lbl {
          font-size: 11px; letter-spacing: .2em; text-transform: uppercase;
          color: var(--x-mute); font-weight: 600;
        }


        /* ---------- FOOTER ---------- */
        .x-foot {
          border-top: 1px solid var(--x-line);
          background: var(--x-bg);
        }
        .x-foot-inner {
          max-width: 1180px;
          width: 100%;
          margin: 0 auto;
          padding: 12px 64px;
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          font-size: 12px;
          color: var(--x-mute);
          letter-spacing: 0;
        }
        .x-foot-inner .r { text-align: right; }
        .x-foot-inner b { color: var(--x-ink); font-weight: 600; }
        .x-foot .dots {
          display: inline-flex; gap: 5px;
          margin-left: 10px; vertical-align: middle;
        }
        .x-foot .dots i {
          width: 4px; height: 4px; border-radius: 50%;
          background: var(--x-line);
        }
        .x-foot .dots i.on { background: var(--x-accent); }

        /* ====== TABLET (<= 1024px) ====== */
        @media (max-width: 1024px) {
          .x-header-inner { padding: 14px 32px; gap: 20px; }
          .x-main { padding: 0 32px; }
          .x-foot-inner { padding: 12px 32px; }
          .x-nav { gap: 18px; }
          .x-status { display: none; }

          .x-frame {
            grid-template-columns: minmax(0, 1fr) !important;
            gap: 0 !important;
            padding: 36px 0 56px;
          }
          .x-side { display: none !important; }

          .x-h1 { font-size: 36px; }
          .x-h2 { font-size: 27px; }
          .x-lede { font-size: 16.5px; }
          .x-sol, .x-stack-row { grid-template-columns: 170px 1fr; gap: 20px; }
        }

        /* ====== MOBILE (<= 640px) ====== */
        @media (max-width: 640px) {
          .x-header-inner {
            grid-template-columns: 1fr auto;
            gap: 10px 12px;
            padding: 12px 20px;
          }
          .x-nav {
            grid-column: 1 / -1;
            justify-content: flex-start;
            gap: 16px;
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none;
          }
          .x-nav::-webkit-scrollbar { display: none; }
          .x-nav button { white-space: nowrap; flex: 0 0 auto; }
          .x-brand .sub { display: none; }

          .x-main { padding: 0 20px; }
          .x-frame { padding: 24px 0 48px; }

          .x-h1 { font-size: 29px; }
          .x-h2 { font-size: 22px; }
          .x-lede { font-size: 16px; max-width: none; }

          .x-dl-row { grid-template-columns: 1fr; gap: 6px; padding: 14px 0; }
          .x-sol, .x-stack-row { grid-template-columns: 1fr; gap: 6px; padding: 16px 0; }
          .x-stack-row { padding-top: 16px; }

          .x-acc-head { grid-template-columns: 32px 1fr auto; gap: 12px; padding: 18px 8px; }
          .x-acc-grid { padding: 4px 8px 28px; }
          .x-case-title { font-size: 18px; }

          .x-feat-head { padding: 18px; }
          .x-feat-body { padding: 18px; }
          .x-feat-title { font-size: 21px; }

          .x-timeline li { grid-template-columns: 62px 1fr; gap: 12px; }
          .x-results-grid { grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); }

          .x-foot-inner {
            grid-template-columns: 1fr;
            gap: 4px;
            padding: 10px 20px;
            text-align: center;
          }
          .x-foot-inner .r { text-align: center; }
        }
      `}</style>

      {/* HEADER */}
      <header className="x-header">
        <div className="x-header-inner">
          <div className="x-brand">
            <span>최&nbsp;환</span>
            <span className="sub">{v.role}</span>
          </div>
          <nav className="x-nav">
            {C2_SECTIONS.map((s) =>
            <button
              key={s.id}
              className={section === s.id ? "active" : ""}
              aria-current={section === s.id ? "page" : undefined}
              onClick={() => goSectionById(s.id)}>
                {s.label}
              </button>
            )}
          </nav>
          <div className="x-head-right">
            <span className="x-status">
              <span className="dot" />
              새로운 기회 탐색 중
            </span>
            {vswitch(true)}
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="x-main" ref={scrollRef}>
        <div key={animKey + "-" + variant} className={"x-frame" + (slideDir > 0 ? " x-slide-right" : slideDir < 0 ? " x-slide-left" : "")}>
          {section === "landing" &&
          <>
              <div>
                <div className="x-eyebrow"><span className="bar" /><b>00</b> · Landing</div>
                <h1 className="x-h1">
                  {data.nameEn}<br />
                  <span className="em">{v.role}</span>
                </h1>
                <p className="x-lede">{v.tagline}</p>

                <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 44 }}>
                  <button className="x-btn x-btn-primary" onClick={() => goSectionById("work")}>
                    View Work
                  </button>
                  <button className="x-btn" onClick={() => goSectionById("about")}>
                    About
                  </button>
                </div>

                <div className="x-section-h">Featured Work</div>
                <div className="x-feat">
                  <div className="x-feat-head">
                    <div className="x-feat-badges">
                      <span className="x-badge">Featured</span>
                      <span className="x-badge ghost">{featured.tag}</span>
                      <span style={{ fontSize: 12, color: "var(--x-mute)" }}>{featured.period}</span>
                    </div>
                    <div className="x-feat-title">{featured.title}</div>
                    <p className="x-feat-sub">{featured.subtitle}</p>
                  </div>
                  <div className="x-feat-body">
                    <p style={{ margin: "0 0 20px", fontSize: 14.5, lineHeight: 1.8, color: "var(--x-ink-2)" }}>
                      {featured.lessons || featured.challenge}
                    </p>
                    {(featured.results || featured.metrics) &&
                    <div className="x-results-grid" style={{ marginBottom: 20 }}>
                      {(featured.results || featured.metrics).map((m, i) =>
                        <div key={i} className={"x-metric" + (featured.results ? "" : " text")}>
                          <div className="k">{m.k}</div>
                          <div className="v">{m.v}</div>
                        </div>
                      )}
                    </div>
                    }
                    <button className="x-btn" onClick={() => goSectionById("work")}>
                      자세히 보기 →
                    </button>
                  </div>
                </div>
              </div>

              <aside className="x-side">
                {(v.sideNotes?.landing || []).map((n, i) =>
                  <div key={i}>
                    <div className="lbl">{n.lbl}</div>
                    <div className="val">{n.val}</div>
                  </div>
                )}
              </aside>
            </>
          }

          {section === "about" &&
          <>
              <div>
                <div className="x-eyebrow"><span className="bar" /><b>01</b> · About</div>
                <h2 className="x-h2">{v.id === "agent" ? <>사람의 인지에서 출발해<br />에이전트 시스템으로.</> : <>사람의 인지에서 출발해<br />사람이 놓이는 화면으로.</>}</h2>

                <div className="x-section-h">Profile</div>
                <div style={{ fontSize: 15.5, lineHeight: 1.9, color: "var(--x-ink-2)", marginBottom: 44, maxWidth: "40em" }}>
                  {v.intro.map((p, i) => <p key={i} style={{ margin: "0 0 1.1em" }}>{p}</p>)}
                </div>

                <div className="x-section-h">Skills</div>
                <dl className="x-dl" style={{ marginBottom: 44 }}>
                  {skillEntries.map(([cat, items]) =>
                <div key={cat} className="x-dl-row">
                      <dt>{cat}</dt>
                      <dd>{items.map((s) => <span key={s} className="x-pill">{s}</span>)}</dd>
                    </div>
                )}
                </dl>

                <div className="x-section-h">Experience</div>
                <div className="x-exp" style={{ marginBottom: 44 }}>
                  <div className="x-exp-head">
                    <div><b>{data.experience.company}</b><span className="role">{data.experience.role}</span></div>
                    <span className="x-exp-period">{data.experience.period}</span>
                  </div>
                  <ul className="x-timeline">
                    {data.experience.timeline.map((t, i) =>
                    <li key={i} className={t.now ? "now" : ""}>
                        <span className="t-date">{t.date}</span>
                        <span>{t.now ? <b>{t.desc}</b> : t.desc}</span>
                      </li>
                    )}
                  </ul>
                </div>

                <div className="x-section-h">Education</div>
                <dl className="x-dl">
                  {data.education.map((e, i) =>
                <div key={i} className="x-dl-row">
                      <dt>{e.period}</dt>
                      <dd><b>{e.school}</b><div style={{ color: "var(--x-mute)", marginTop: 3, fontSize: 14 }}>{e.detail}</div></dd>
                    </div>
                )}
                </dl>
              </div>

              <aside className="x-side">
                <div>
                  <div className="lbl">Focus</div>
                  <div className="val">{v.focus}</div>
                </div>
                <div>
                  <div className="lbl">Bridge</div>
                  <div className="val"><b>심리학 → 엔지니어링</b></div>
                  <div style={{ marginTop: 6, fontSize: 13, lineHeight: 1.65 }}>
                    사람을 읽던 시선이, 지금은 시스템을 설계하는 일로 이어졌다고 생각합니다.
                  </div>
                </div>
              </aside>
            </>
          }

          {section === "work" &&
              <>
                <div>
                  <div className="x-eyebrow"><span className="bar" /><b>02</b> · Work</div>
                  <h2 className="x-h2" style={{ marginBottom: 40 }}>프로젝트 나열이 아닌,<br />문제와 설계의 흐름.</h2>

                  {/* ── Featured Case ── */}
                  <div className="x-section-h">Featured Case</div>
                  <div className="x-feat" style={{ marginBottom: 52 }}>
                    <div className="x-feat-head">
                      <div className="x-feat-badges">
                        <span className="x-badge">{featured.number}</span>
                        <span className="x-badge ghost">{featured.tag}</span>
                        <span style={{ fontSize: 12, color: "var(--x-mute)" }}>{featured.period}</span>
                        {featured.link &&
                          <a href={`https://${featured.link}`} target="_blank" rel="noopener noreferrer"
                             style={{ fontSize: 12, color: "var(--x-accent)", textDecoration: "underline", textUnderlineOffset: 2 }}>
                            {featured.link} ↗
                          </a>
                        }
                      </div>
                      <div className="x-feat-title">{featured.title}</div>
                      <p className="x-feat-sub">{featured.subtitle}</p>
                    </div>

                    <div className="x-feat-body">
                      {/* Bada는 분량이 많아 탭으로, 나머지는 한 번에 */}
                      {featured.id === "bada" ? (
                        <>
                          <div className="x-tabs" role="tablist">
                            {BADA_TABS.map((t) =>
                              <button key={t.id} role="tab" aria-selected={badaTab === t.id}
                                className={badaTab === t.id ? "on" : ""}
                                onClick={() => setBadaTab(t.id)}>
                                {t.label}
                              </button>
                            )}
                          </div>

                          {badaTab === "overview" &&
                          <div>
                            <div className="x-section-h">Problem</div>
                            <p style={{ fontSize: 15, lineHeight: 1.85, margin: "0 0 32px", color: "var(--x-ink-2)", maxWidth: "40em" }}>{featured.problem}</p>

                            <div className="x-section-h">Results</div>
                            <div className="x-results-grid" style={{ marginBottom: 32 }}>
                              {featured.results.map((m, i) =>
                                <div key={i} className="x-metric">
                                  <div className="k">{m.k}</div>
                                  <div className="v">{m.v}</div>
                                </div>
                              )}
                            </div>

                            <div className="x-section-h">Outcome</div>
                            <p className="x-note" style={{ marginBottom: 0 }}>{featured.lessons}</p>
                          </div>
                          }

                          {badaTab === "architecture" &&
                          <div>
                            <div className="x-section-h">Pipeline</div>
                            <div className="x-pipe">
                              {featured.pipeline.map((p, i) =>
                                <div className="x-pipe-stage" key={p.stage}>
                                  <div className="x-pipe-idx">{String(i + 1).padStart(2, "0")}</div>
                                  <div className="x-pipe-name">{p.stage}</div>
                                  <div className="x-pipe-tool">{p.tool}</div>
                                  <div className="x-pipe-rows">
                                    <span>{p.role}</span>
                                    <span>{p.out}</span>
                                  </div>
                                </div>
                              )}
                            </div>
                            {featured.pipelineNote && <p className="x-note">{featured.pipelineNote}</p>}

                            <div className="x-section-h">Design Decisions</div>
                            <div style={{ marginBottom: 32 }}>
                              {featured.solution.map((s, i) =>
                                <div key={i} className="x-sol">
                                  <h4>{s.h}</h4>
                                  <p>{s.d}</p>
                                </div>
                              )}
                            </div>

                            <div className="x-section-h">Evolution</div>
                            <div>
                              {featured.evolution.map((p, i) =>
                                <div key={i} className="x-sol">
                                  <h4><span className="ph">{p.phase}</span>{p.title}</h4>
                                  <p>{p.body}</p>
                                </div>
                              )}
                            </div>
                          </div>
                          }

                          {badaTab === "failures" &&
                          <div>
                            <p className="x-note">
                              루프를 운용하며 마주한 실패를 유형별로 정리했습니다. 무엇이 잘못됐는지보다, 그 실패가 어떤 설계 변경으로 이어졌는지를 남겼습니다.
                            </p>
                            {featured.failureCases.map((f, i) =>
                              <div key={i} className="x-sol">
                                <h4><span className="ph">{f.type}</span>{f.title}</h4>
                                <p>{f.body}</p>
                              </div>
                            )}
                          </div>
                          }

                          {badaTab === "lessons" &&
                          <div>
                            <ul className="x-focus">
                              {featured.lessonsLearned.map((l, i) =>
                                <li key={i} className="x-focus-item">
                                  <span className="n">{l.n}</span>
                                  <div>
                                    <div className="h">{l.h}</div>
                                    <div className="d">{l.d}</div>
                                  </div>
                                </li>
                              )}
                            </ul>
                          </div>
                          }
                        </>
                      ) : (
                        <>
                          <div className="x-section-h">Challenge</div>
                          <p style={{ fontSize: 15, lineHeight: 1.85, margin: "0 0 32px", color: "var(--x-ink-2)", maxWidth: "40em" }}>
                            {featured.challenge || featured.problem}
                          </p>
                          <CaseDetail c={featured} />
                        </>
                      )}
                    </div>
                  </div>

                  {/* ── Other Projects ── */}
                  <div className="x-section-h">Selected Projects</div>
                  <div className="x-acc-list">
                    {others.map((c) => {
                      const open = expandedCase === c.id;
                      return (
                        <div key={c.id} className={"x-acc" + (open ? " open" : "")}>
                          <button
                            type="button"
                            className="x-acc-head"
                            aria-expanded={open}
                            onClick={() => setExpandedCase(open ? null : c.id)}>
                            <div className="x-case-no">{c.number}</div>
                            <div>
                              <div className="x-case-title">{c.title}</div>
                              <div className="x-case-sub">{c.subtitle}</div>
                              <div className="x-case-meta">
                                <span>{c.period}</span>
                                <span className="x-badge ghost">{c.tag}</span>
                              </div>
                            </div>
                            <svg className="x-acc-chevron" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                              <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </button>
                          {open &&
                          <div className="x-acc-body">
                            <div className="x-acc-grid">
                              <div className="x-section-h">Challenge</div>
                              <p style={{ margin: "0 0 28px", fontSize: 14.5, lineHeight: 1.85, color: "var(--x-ink-2)", maxWidth: "40em" }}>
                                {c.challenge || c.problem}
                              </p>
                              <CaseDetail c={c} />
                            </div>
                          </div>
                          }
                        </div>
                      );
                    })}
                  </div>
                </div>

                <aside className="x-side">
                  {(v.sideNotes?.work || []).map((n, i) =>
                    <div key={i}>
                      <div className="lbl">{n.lbl}</div>
                      <div className="val">{n.val}</div>
                    </div>
                  )}
                </aside>
              </>
          }


          {section === "contact" &&
          <>
              <div>
                <div className="x-eyebrow"><span className="bar" /><b>03</b> · Contact</div>
                <h2 className="x-h2">
                  {data.contact.heading.split("\n").map((line, i, arr) =>
                  <React.Fragment key={i}>{line}{i < arr.length - 1 && <br />}</React.Fragment>
                  )}
                </h2>
                <dl className="x-dl">
                  <div className="x-dl-row"><dt>Email</dt><dd><b><a href={`mailto:${data.contact.email}`}>{data.contact.email}</a></b></dd></div>
                  <div className="x-dl-row"><dt>GitHub</dt><dd><b><a href={`https://${data.contact.github}`} target="_blank" rel="noopener noreferrer">{data.contact.github}</a></b></dd></div>
                  <div className="x-dl-row"><dt>Location</dt><dd>{data.contact.location}</dd></div>
                </dl>
              </div>

              <aside className="x-side">
                <div>
                  <div className="lbl">Response time</div>
                  <div className="val"><b>~24h</b></div>
                </div>
                <div>
                  <div className="lbl">Scope</div>
                  <div className="val">{v.focus}</div>
                </div>
              </aside>
            </>
          }
        </div>
      </main>

      {/* FOOTER */}
      <footer className="x-foot">
        <div className="x-foot-inner">
          <div>{v.navLabel}</div>
          <div>
            <b>{current.label}</b>
            <span className="dots">
              {C2_SECTIONS.map((_, i) =>
              <i key={i} className={i === sectionIdx ? "on" : ""} />
              )}
            </span>
          </div>
          <div className="r">Portfolio v2026.08</div>
        </div>
      </footer>

    </div>);

}
