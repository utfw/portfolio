import React from 'react';

const { useState: useStateC2, useEffect: useEffectC2, useRef: useRefC2 } = React;

const C2_SECTIONS = [
{ id: "landing", no: "00", label: "Landing" },
{ id: "about", no: "01", label: "About" },
{ id: "philosophy", no: "02", label: "Philosophy" },
{ id: "work", no: "03", label: "Work" },
{ id: "contact", no: "04", label: "Contact" }];


export default function DirectionC2({ data, accent = "#9b3a2a" }) {
  const [section, setSection] = useStateC2("landing");
  const [expandedCase, setExpandedCase] = useStateC2(null); // 아코디언으로 펼친 케이스 id
  const [slideDir, setSlideDir] = useStateC2(0); // -1: 왼쪽에서, 1: 오른쪽에서
  const [animKey, setAnimKey] = useStateC2(0);
  const scrollRef = useRefC2(null);

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

  // 인접 섹션으로 한 칸 이동 (좌우 제스처용). 양 끝에서는 멈춤.
  const goStep = useRefC2(null);
  goStep.current = (dir) => {
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

  useEffectC2(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [section]);

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
        goStep.current(dx > 0 ? 1 : -1);
      }
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      el.removeEventListener("wheel", onWheel);
      if (timer) window.clearTimeout(timer);
    };
  }, []);

  const vars = {
    "--x-bg": "#fbf9f4",
    "--x-bg-2": "#f2eee4",
    "--x-ink": "#171717",
    "--x-ink-2": "#2a2823",
    "--x-mute": "#7c7a74",
    "--x-soft": "#bcb9b1",
    "--x-line": "#e1dac8",
    "--x-line-2": "#ece6d6",
    "--x-accent": accent,
    "--x-sans": "'Noto Sans KR', 'Noto Sans', system-ui, sans-serif"
  };

  const cases = [...data.caseStudies].sort((a, b) => a.number.localeCompare(b.number));

  return (
    <div className="dirX" style={vars}>
      <style>{`
        .dirX {
          width: 100%; height: 100%;
          background: var(--x-bg);
          color: var(--x-ink);
          font-family: var(--x-sans);
          font-size: 16px;
          line-height: 1.78;
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

        /* ---------- HEADER ---------- */
        .x-header {
          border-bottom: 1px solid var(--x-line);
          background: var(--x-bg);
        }
        .x-header-inner {
          max-width: 1180px;
          width: 100%;
          margin: 0 auto;
          padding: 18px 64px;
          display: grid;
          grid-template-columns: auto 1fr auto;
          gap: 40px;
          align-items: center;
        }
        .x-brand {
          font-size: 16px;
          font-weight: 600;
          letter-spacing: -.008em;
        }
        .x-brand .sub {
          margin-left: 10px;
          font-size: 13px;
          color: var(--x-mute);
          font-weight: 400;
          letter-spacing: 0;
        }
        .x-nav {
          display: flex;
          gap: 28px;
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
          left: 50%; bottom: -2px;
          transform: translateX(-50%);
          width: 4px; height: 4px; border-radius: 50%;
          background: var(--x-accent);
        }
        .x-status {
          font-size: 13px;
          color: var(--x-mute);
          display: flex; align-items: center; gap: 8px;
          letter-spacing: 0;
        }
        .x-status .dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: var(--x-accent);
        }

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
          grid-template-columns: minmax(0, 1fr) 280px;
          gap: 80px;
          width: 100%;
          max-width: 1180px;
          margin: 0 auto;
          padding: 48px 0;
          flex-shrink: 0;
          align-items: start;
        }
        /* grid 자식이 콘텐츠 폭으로 부풀어 트랙 밖으로 넘치는 것 방지 */
        .x-frame > * { min-width: 0; }

        /* ---------- TYPE ---------- */
        .x-eyebrow {
          font-size: 11.5px;
          letter-spacing: .24em;
          text-transform: uppercase;
          color: var(--x-mute);
          font-weight: 500;
          margin-bottom: 22px;
          display: flex; align-items: center; gap: 14px;
        }
        .x-eyebrow b {
          color: var(--x-accent);
          font-weight: 500;
          letter-spacing: .12em;
        }
        .x-eyebrow .bar {
          flex: 0 0 28px; height: 1px;
          background: var(--x-accent);
          opacity: .6;
        }

        .x-h1 {
          font-family: var(--x-sans);
          font-weight: 500;
          font-size: 46px;
          line-height: 1.16;
          letter-spacing: -.03em;
          margin: 0 0 24px;
        }
        .x-h1 .em { color: var(--x-mute); font-weight: 400; }
        .x-h2 {
          font-family: var(--x-sans);
          font-weight: 500;
          font-size: 32px;
          line-height: 1.22;
          letter-spacing: -.026em;
          margin: 0 0 20px;
        }
        .x-lede {
          font-size: 18px;
          line-height: 1.65;
          color: var(--x-ink-2);
          letter-spacing: -.008em;
          margin: 0 0 28px;
          max-width: 34em;
          font-weight: 400;
        }
        .x-section-h {
          font-size: 11.5px;
          letter-spacing: .24em;
          text-transform: uppercase;
          color: var(--x-mute);
          font-weight: 500;
          margin: 0 0 18px;
        }
        .x-rule { height: 1px; background: var(--x-line); border: 0; margin: 36px 0; }

        /* ---------- SLIDE ANIMATION ---------- */
        @keyframes slideInFromRight {
          from { opacity: 0; transform: translateX(48px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInFromLeft {
          from { opacity: 0; transform: translateX(-48px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .x-slide-right { animation: slideInFromRight .32s cubic-bezier(.22,.61,.36,1) both; }
        .x-slide-left  { animation: slideInFromLeft  .32s cubic-bezier(.22,.61,.36,1) both; }

        /* ---------- SIDE COLUMN ---------- */
        .x-side {
          font-size: 13.5px;
          color: var(--x-mute);
          line-height: 1.72;
          display: grid; gap: 22px;
          padding-left: 40px;
          border-left: 1px solid var(--x-line);
        }
        .x-side .lbl {
          font-size: 10.5px;
          letter-spacing: .22em;
          text-transform: uppercase;
          color: var(--x-soft);
          margin-bottom: 8px;
          font-weight: 500;
        }
        .x-side .val { color: var(--x-ink); font-size: 14.5px; font-weight: 400; letter-spacing: -.005em; }
        .x-side .val b { font-weight: 600; }

        /* ---------- DL ---------- */
        .x-dl { margin: 0; }
        .x-dl-row {
          display: grid; grid-template-columns: 160px 1fr;
          gap: 26px;
          padding: 18px 0;
          border-bottom: 1px solid var(--x-line);
          align-items: baseline;
        }
        .x-dl-row:first-of-type { border-top: 1px solid var(--x-line); }
        .x-dl-row dt {
          font-size: 11.5px;
          letter-spacing: .18em;
          text-transform: uppercase;
          color: var(--x-mute);
          font-weight: 500;
        }
        .x-dl-row dd {
          margin: 0;
          font-size: 15.5px;
          line-height: 1.7;
          letter-spacing: -.003em;
        }
        .x-dl-row dd b { font-weight: 600; }

        /* ---------- EXPERIENCE TIMELINE ---------- */
        .x-exp-head {
          display: flex; align-items: baseline; justify-content: space-between;
          gap: 16px;
          padding-bottom: 16px;
          border-bottom: 1px solid var(--x-line);
        }
        .x-exp-head b { font-weight: 600; font-size: 16.5px; letter-spacing: -.008em; }
        .x-exp-head .role { color: var(--x-mute); font-size: 14.5px; margin-left: 6px; }
        .x-exp-period {
          font-size: 12.5px; color: var(--x-mute);
          letter-spacing: .02em; white-space: nowrap;
        }
        .x-timeline { list-style: none; margin: 4px 0 0; padding: 0; }
        .x-timeline li {
          display: grid; grid-template-columns: 72px 1fr; gap: 20px;
          padding: 12px 0; align-items: baseline;
          font-size: 14.5px; line-height: 1.6;
          border-bottom: 1px solid var(--x-line-2);
        }
        .x-timeline li:last-child { border-bottom: 0; }
        .x-timeline .t-date { font-size: 12.5px; color: var(--x-mute); letter-spacing: .02em; }
        .x-timeline li.now .t-date { color: var(--x-accent); }
        .x-timeline li.now b { color: var(--x-accent); font-weight: 600; }

        /* ---------- PILL (square, editorial) ---------- */
        .x-pill {
          display: inline-block;
          padding: 5px 12px;
          font-size: 12.5px;
          background: var(--x-bg-2);
          color: var(--x-ink);
          margin: 3px 5px 3px 0;
          letter-spacing: -.002em;
        }
        .x-pill:hover {
          background: var(--x-ink);
          color: var(--x-bg);
          cursor: default;
        }
        /* ---------- BUTTON (square) ---------- */
        .x-btn {
          all: unset; cursor: pointer;
          padding: 13px 24px;
          font-size: 14px;
          font-weight: 500;
          color: var(--x-ink);
          border: 1px solid var(--x-ink);
          letter-spacing: -.005em;
          transition: background .15s, color .15s, border-color .15s;
        }
        .x-btn:hover { background: var(--x-ink); color: var(--x-bg); }
        .x-btn-primary {
          background: var(--x-ink);
          color: var(--x-bg);
        }
        .x-btn-primary:hover {
          background: var(--x-accent);
          border-color: var(--x-accent);
          color: #fff;
        }

        /* ---------- CASE ---------- */
        .x-case {
          display: grid;
          grid-template-columns: 64px 1fr auto;
          gap: 24px;
          padding: 30px 0;
          border-bottom: 1px solid var(--x-line);
          cursor: pointer;
          align-items: baseline;
          transition: background .18s, padding .18s;
        }
        .x-case:first-of-type { border-top: 1px solid var(--x-line); }
        .x-case:hover {
          background: var(--x-bg-2);
          padding-left: 18px;
          padding-right: 18px;
        }
        .x-case:hover .x-case-arrow {
          color: var(--x-accent);
          transform: translateX(4px);
        }
        .x-case:hover .x-case-title {
          color: var(--x-accent);
        }
        .x-case-no {
          font-size: 13px;
          color: var(--x-accent);
          font-weight: 500;
          letter-spacing: .12em;
        }
        .x-case-title {
          font-size: 24px;
          font-weight: 500;
          letter-spacing: -.022em;
          line-height: 1.25;
          transition: color .18s;
        }
        .x-case-sub {
          margin-top: 6px;
          font-size: 14.5px;
          color: var(--x-mute);
          line-height: 1.6;
          letter-spacing: -.003em;
        }
        .x-case-meta {
          margin-top: 14px;
          font-size: 12.5px;
          color: var(--x-mute);
          letter-spacing: .01em;
        }
        .x-case-meta b { color: var(--x-ink); font-weight: 500; }
        .x-case-arrow {
          font-size: 18px;
          color: var(--x-soft);
          transition: color .15s, transform .15s;
        }
        .x-case-feat {
          background: var(--x-bg-2);
          border-left: 3px solid var(--x-accent);
          padding-left: 15px;
        }
        .x-case-feat:hover { padding-left: 22px; }

        /* ---------- PIPELINE DIAGRAM ---------- */
        .x-pipe {
          display: flex;
          align-items: stretch;
          gap: 4px;
          background: var(--x-bg-2);
          padding: 24px 20px;
          margin: 0 0 14px;
          overflow-x: auto;
        }
        .x-pipe-stage {
          flex: 1 1 0;
          min-width: 96px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding: 4px 6px;
        }
        .x-pipe-name {
          font-size: 14px;
          font-weight: 600;
          letter-spacing: -.01em;
          color: var(--x-ink);
        }
        .x-pipe-tool {
          font-family: ui-monospace, 'JetBrains Mono', monospace;
          font-size: 11px;
          letter-spacing: .02em;
          color: var(--x-accent);
        }
        .x-pipe-rows {
          display: flex;
          flex-direction: column;
          gap: 3px;
          margin-top: 2px;
          padding-top: 8px;
          border-top: 1px solid var(--x-line);
          font-size: 12px;
          line-height: 1.5;
          color: var(--x-mute);
        }
        .x-pipe-arrow {
          flex: 0 0 auto;
          align-self: center;
          color: var(--x-soft);
          font-size: 15px;
          padding: 0 2px;
        }
        .x-pipe-note {
          margin: 0 0 32px;
          padding-left: 14px;
          border-left: 2px solid var(--x-line);
          font-size: 13px;
          line-height: 1.7;
          color: var(--x-mute);
          letter-spacing: -.003em;
        }

        /* ---------- ACCORDION ---------- */
        .x-acc { border-bottom: 1px solid var(--x-line); }
        .x-acc:first-of-type { border-top: 1px solid var(--x-line); }
        .x-acc-head {
          display: grid;
          grid-template-columns: 64px 1fr auto;
          gap: 24px;
          padding: 30px 0;
          cursor: pointer;
          align-items: baseline;
        }
        .x-acc-head:hover .x-case-title { color: var(--x-accent); }
        .x-acc-head:hover .x-acc-chevron { color: var(--x-accent); }
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
        /* hover peek — 펼쳐질 내용을 한 줄 미리 보여줌 */
        .x-acc-peek {
          max-height: 0;
          opacity: 0;
          overflow: hidden;
          margin-top: 0;
          font-size: 13.5px;
          line-height: 1.6;
          color: var(--x-mute);
          letter-spacing: -.003em;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          transition: max-height .25s ease, opacity .2s ease, margin-top .25s ease;
        }
        .x-acc-head:hover .x-acc-peek {
          max-height: 3.4em;
          opacity: 1;
          margin-top: 14px;
        }
        .x-acc-peek-label {
          display: inline-block;
          margin-right: 10px;
          font-size: 10px;
          letter-spacing: .18em;
          text-transform: uppercase;
          color: var(--x-accent);
          font-weight: 500;
        }
        .x-acc-body {
          overflow: hidden;
          animation: accOpen .32s cubic-bezier(.22,.61,.36,1);
        }
        .x-acc-grid {
          padding: 4px 18px 36px;
          border-left: 2px solid var(--x-line-2);
          margin-left: 18px;
        }
        @keyframes accOpen {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ---------- FOCUS LIST (index) ---------- */
        .x-focus {
          list-style: none; margin: 0; padding: 0;
          display: grid; gap: 16px;
        }
        .x-focus-item {
          display: grid;
          grid-template-columns: 36px 1fr;
          gap: 18px;
          align-items: baseline;
        }
        .x-focus-item .n {
          font-size: 13px;
          color: var(--x-accent);
          font-weight: 500;
          letter-spacing: .08em;
        }
        .x-focus-item .h {
          font-size: 17px;
          font-weight: 600;
          letter-spacing: -.008em;
          margin-bottom: 4px;
        }
        .x-focus-item .d {
          font-size: 14.5px;
          color: var(--x-mute);
          line-height: 1.65;
          letter-spacing: -.003em;
        }

        /* ---------- ARCHIVE ---------- */
        .x-arc {
          display: grid;
          grid-template-columns: 32px 220px 1fr;
          gap: 20px;
          padding: 16px 0;
          border-bottom: 1px solid var(--x-line);
          font-size: 15px;
          line-height: 1.5;
          align-items: baseline;
        }
        .x-arc:first-of-type { border-top: 1px solid var(--x-line); }
        .x-arc-no { color: var(--x-soft); font-size: 13px; }
        .x-arc-name { font-weight: 600; letter-spacing: -.005em; }
        .x-arc-note { color: var(--x-mute); font-size: 14px; }

        /* ---------- AI FEATURE CARDS (ruled rows, consistent with .x-case) ---------- */
        .x-ai-grid {
          margin-top: 4px;
        }
        .x-ai-card {
          display: grid;
          grid-template-columns: 64px 1fr auto;
          gap: 24px;
          padding: 30px 0;
          align-items: baseline;
          border-bottom: 1px solid var(--x-line);
          cursor: pointer;
          transition: background .18s, padding .18s;
        }
        .x-ai-card:first-of-type { border-top: 1px solid var(--x-line); }
        .x-ai-card:hover {
          background: var(--x-bg-2);
          padding-left: 18px;
          padding-right: 18px;
        }
        .x-ai-card:hover .x-ai-arrow { color: var(--x-accent); transform: translateX(4px); }
        .x-ai-card:hover .x-ai-title { color: var(--x-accent); }
        .x-ai-no {
          font-size: 13px; font-weight: 500;
          color: var(--x-accent); letter-spacing: .12em;
        }
        .x-ai-titlerow {
          display: flex; align-items: baseline; gap: 12px; flex-wrap: wrap;
        }
        .x-ai-title {
          font-size: 24px; font-weight: 500;
          letter-spacing: -.022em; line-height: 1.25;
          transition: color .18s;
        }
        .x-ai-tag {
          font-size: 10.5px; letter-spacing: .14em; text-transform: uppercase;
          color: var(--x-bg); background: var(--x-accent);
          padding: 3px 9px; font-weight: 500;
        }
        .x-ai-year {
          font-size: 12px; color: var(--x-mute); letter-spacing: .04em;
        }
        .x-ai-arrow {
          font-size: 18px; color: var(--x-soft);
          transition: color .15s, transform .15s;
        }
        .x-ai-sub {
          margin-top: 7px;
          font-size: 14.5px; color: var(--x-mute); line-height: 1.6;
          letter-spacing: -.004em;
        }
        .x-ai-metrics {
          display: flex; flex-wrap: wrap; gap: 28px;
          margin-top: 16px;
          padding-top: 16px;
          border-top: 1px solid var(--x-line);
        }
        .x-ai-metric .k {
          font-size: 10.5px; letter-spacing: .16em; text-transform: uppercase;
          color: var(--x-mute);
        }
        .x-ai-metric .v {
          margin-top: 5px;
          font-size: 19px; font-weight: 600; color: var(--x-accent);
          letter-spacing: -.015em;
        }
        .x-ai-stack {
          display: flex; flex-wrap: wrap; gap: 6px;
          margin-top: 16px;
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
          padding: 14px 64px;
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          font-size: 12.5px;
          color: var(--x-mute);
          letter-spacing: 0;
        }
        .x-foot-inner .r { text-align: right; }
        .x-foot-inner b { color: var(--x-ink); font-weight: 500; }
        .x-foot .dots {
          display: inline-flex; gap: 6px;
          margin-left: 12px; vertical-align: middle;
        }
        .x-foot .dots i {
          width: 5px; height: 5px; border-radius: 50%;
          background: var(--x-line);
        }
        .x-foot .dots i.on { background: var(--x-accent); }

        .x-sol {
          padding: 20px 0;
          border-top: 1px solid var(--x-line);
          display: grid;
          grid-template-columns: 200px 1fr;
          gap: 26px;
          align-items: baseline;
        }
        .x-sol:last-child { border-bottom: 1px solid var(--x-line); }
        .x-sol h4 {
          margin: 0;
          font-size: 15.5px;
          font-weight: 600;
          letter-spacing: -.008em;
        }
        .x-sol p {
          margin: 0;
          font-size: 15px;
          line-height: 1.75;
          color: var(--x-mute);
        }

        .x-results-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          gap: 12px;
        }
        .x-metric {
          padding: 18px 22px;
          background: var(--x-bg-2);
          display: flex; justify-content: space-between; align-items: baseline;
        }
        .x-metric .k {
          font-size: 11px;
          letter-spacing: .22em;
          text-transform: uppercase;
          color: var(--x-mute);
          font-weight: 500;
        }
        .x-metric .v {
          font-size: 24px;
          font-weight: 600;
          color: var(--x-accent);
          letter-spacing: -.015em;
        }
        /* 텍스트형 지표(라벨이 긴 경우) — 세로 배치 + 작은 값 */
        .x-metric.text {
          flex-direction: column;
          align-items: flex-start;
          gap: 8px;
        }
        .x-metric.text .v {
          font-size: 15px;
          font-weight: 600;
          letter-spacing: -.005em;
          line-height: 1.35;
        }

        /* ====== TABLET (<= 1024px) — single column, tighter gutters ====== */
        @media (max-width: 1024px) {
          .x-header-inner { padding: 16px 32px; gap: 20px; }
          .x-main { padding: 0 32px; }
          .x-foot-inner { padding: 14px 32px; }
          .x-nav { gap: 18px; }

          /* 2단 프레임을 단일 컬럼으로 접고, 사이드 노트(마진 노트)는 숨김 */
          .x-frame {
            grid-template-columns: minmax(0, 1fr) !important;
            gap: 0 !important;
            padding: 36px 0;
          }
          .x-side { display: none !important; }

          .x-h1 { font-size: 38px; }
          .x-h2 { font-size: 28px; }
          .x-lede { font-size: 17px; }
        }

        /* ====== MOBILE (<= 640px) — full-bleed, stacked rows ====== */
        @media (max-width: 640px) {
          .x-header-inner {
            grid-template-columns: 1fr auto;
            gap: 12px 16px;
            padding: 14px 20px;
          }
          /* nav를 가로 스크롤 가능한 한 줄로, 전체 폭 차지 */
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
          .x-status { display: none; }

          .x-main { padding: 0 20px; }
          .x-frame { padding: 28px 0; }

          .x-h1 { font-size: 30px; }
          .x-h2 { font-size: 23px; }
          .x-lede { font-size: 16px; max-width: none; }

          /* 라벨 + 값 형태의 2단 행들을 세로로 적층 */
          .x-dl-row {
            grid-template-columns: 1fr;
            gap: 6px;
            padding: 14px 0;
          }
          .x-sol {
            grid-template-columns: 1fr;
            gap: 8px;
            padding: 16px 0;
          }
          .x-case, .x-acc-head, .x-ai-card {
            grid-template-columns: 40px 1fr auto;
            gap: 14px;
            padding: 22px 0;
          }
          .x-case:hover, .x-ai-card:hover {
            padding-left: 0; padding-right: 0;
          }
          .x-case-title, .x-ai-title { font-size: 20px; }

          .x-timeline li { grid-template-columns: 60px 1fr; gap: 14px; }
          .x-arc { grid-template-columns: 24px 1fr; gap: 6px 14px; }
          .x-arc-note { grid-column: 2; }

          /* Results 지표 그리드가 좁은 화면에서 넘치지 않도록 */
          .x-ai-metrics { gap: 18px; }
          .x-results-grid { grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); }
          /* 좁은 폭에서 라벨/값이 한 줄에 짓눌리지 않도록 세로 적층 */
          .x-metric {
            flex-direction: column;
            align-items: flex-start;
            gap: 6px;
            padding: 14px 16px;
          }

          .x-foot-inner {
            grid-template-columns: 1fr;
            gap: 6px;
            padding: 12px 20px;
            text-align: center;
          }
          .x-foot-inner .r { text-align: center; }
        }
      `}</style>

      {/* HEADER */}
      <header className="x-header">
        <div className="x-header-inner">
          <div className="x-brand">
            최&nbsp;환<span className="sub">Software Engineer</span>
          </div>
          <nav className="x-nav">
            {C2_SECTIONS.map((s) =>
            <button
              key={s.id}
              className={section === s.id ? "active" : ""}
              onClick={() => goSectionById(s.id)}>
                {s.label}
              </button>
            )}
          </nav>
          <div className="x-status">
            <span className="dot" />
            새로운 기회 탐색 중
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="x-main" ref={scrollRef}>
        <div key={animKey} className={"x-frame" + (slideDir > 0 ? " x-slide-right" : slideDir < 0 ? " x-slide-left" : "")}>
          {section === "landing" &&
          <>
              <div>
                <div className="x-eyebrow"><span className="bar" /><b>00</b> · Landing</div>
                <h1 className="x-h1">
                  {data.nameEn}<br />
                  <span className="em">{data.role}</span>
                </h1>
                <p className="x-lede">{data.tagline}</p>

                <div style={{ display: "flex", gap: 12, marginBottom: 40 }}>
                  <button className="x-btn" onClick={() => goSectionById("about")}>
                    About
                  </button>
                  <button className="x-btn x-btn-primary" onClick={() => goSectionById("work")}>
                    View Work →
                  </button>
                </div>

                <div className="x-section-h">Featured Work</div>
                {(() => {
                  const bada = data.caseStudies.find((c) => c.id === "bada");
                  return (
                    <div
                      onClick={() => goSectionById("work")}
                      style={{
                        minWidth: 0,
                        borderLeft: "3px solid var(--x-accent)",
                        padding: "24px 28px",
                        cursor: "pointer",
                        transition: "background .15s",
                        overflowWrap: "anywhere",
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = "var(--x-bg-2)"}
                      onMouseLeave={(e) => e.currentTarget.style.background = ""}
                    >
                      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "baseline", gap: 12, marginBottom: 10 }}>
                        <span style={{ fontSize: 10.5, letterSpacing: ".14em", textTransform: "uppercase", color: "var(--x-accent)", fontWeight: 500 }}>★ Featured</span>
                        <span style={{ fontSize: 12, color: "var(--x-mute)", letterSpacing: ".04em" }}>{bada.tag}</span>
                        <span style={{ fontSize: 12, color: "var(--x-mute)" }}>{bada.period}</span>
                      </div>
                      <div style={{ fontSize: 22, fontWeight: 500, letterSpacing: "-.02em", marginBottom: 8 }}>{bada.title}</div>
                      <div style={{ fontSize: 15, color: "var(--x-mute)", lineHeight: 1.65, marginBottom: 18 }}>{bada.subtitle}</div>
                      <div style={{ fontSize: 14, color: "var(--x-mute)" }}>{bada.lessons}</div>
                      <div style={{ marginTop: 18, fontSize: 13, color: "var(--x-accent)", letterSpacing: ".04em" }}>자세히 보기 →</div>
                    </div>
                  );
                })()}
              </div>

              <aside className="x-side">
                <div>
                  <div className="lbl">Bada Stack</div>
                  <div className="val" style={{ fontSize: 13.5, lineHeight: 1.8, color: "var(--x-mute)", fontWeight: 400 }}>
                    Claude Code · Ollama<br />Playwright · TypeScript
                  </div>
                </div>
                <div>
                  <div className="lbl">Workflow</div>
                  <div className="val" style={{ fontSize: 13.5, lineHeight: 1.8, color: "var(--x-mute)", fontWeight: 400 }}>
                    Observer → Planner<br />→ Implementer → Reviewer
                  </div>
                </div>
                <div>
                  <div className="lbl">Status</div>
                  <div className="val" style={{ color: "var(--x-accent)" }}>● 새로운 기회 탐색 중</div>
                </div>
              </aside>
            </>
          }

          {section === "about" &&
          <>
              <div>
                <div className="x-eyebrow"><span className="bar" /><b>01</b> · About</div>
                <h2 className="x-h2">사람의 인지에서 출발해<br />시스템을 짓는 일.</h2>

                <div className="x-section-h">Story</div>
                <div style={{ fontSize: 16.5, lineHeight: 1.88, color: "var(--x-ink-2)", marginBottom: 44 }}>
                  {data.intro.map((p, i) => <p key={i} style={{ margin: "0 0 1.15em" }}>{p}</p>)}
                </div>

                <div className="x-section-h">Skills</div>
                <dl className="x-dl" style={{ marginBottom: 44 }}>
                  {Object.entries(data.skills).map(([cat, items]) =>
                <div key={cat} className="x-dl-row">
                      <dt>{cat}</dt>
                      <dd>{items.map((s) => <span key={s} className="x-pill">{s}</span>)}</dd>
                    </div>
                )}
                </dl>

                <div className="x-section-h">Experience</div>
                <div className="x-exp">
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

                <div className="x-section-h" style={{ marginTop: 44 }}>Education</div>
                <dl className="x-dl">
                  {data.education.map((e, i) =>
                <div key={i} className="x-dl-row">
                      <dt>{e.period}</dt>
                      <dd><b>{e.school}</b><div style={{ color: "var(--x-mute)", marginTop: 4 }}>{e.detail}</div></dd>
                    </div>
                )}
                </dl>
              </div>

              <aside className="x-side">
                <div>
                  <div className="lbl">Bridge</div>
                  <div className="val">심리학 → 엔지니어링</div>
                  <div style={{ color: "var(--x-mute)", marginTop: 8, fontSize: 13.5 }}>
                    사람을 읽던 시선이, 지금은 AI 인터페이스를 설계하는 일로 이어졌다고 생각합니다.
                  </div>
                </div>
              </aside>
            </>
          }

          {section === "philosophy" &&
          <>
              <div>
                <div className="x-eyebrow"><span className="bar" /><b>02</b> · Philosophy</div>
                <h2 className="x-h2">{data.philosophy.headline}</h2>
                <div style={{ fontSize: 16.5, lineHeight: 1.88, color: "var(--x-ink-2)", marginBottom: 44 }}>
                  {data.philosophy.body.map((p, i) => <p key={i} style={{ margin: "0 0 1em" }}>{p}</p>)}
                </div>

                <div className="x-section-h">Core Principles</div>
                <ul className="x-focus">
                  {[
                    "시스템이 지금 어떤 상태인지 언제나 확인할 수 있어야 한다",
                    "실패는 예외가 아니라 설계의 일부다",
                    "검증되지 않은 구현은 완성된 구현이 아니다",
                    "같은 입력은 같은 결과를 보장해야 한다",
                  ].map((desc, i) =>
                  <li key={i} className="x-focus-item">
                        <span className="n">{String(i + 1).padStart(2, "0")}</span>
                        <div>
                          <div className="h">{data.philosophy.keywords[i]}</div>
                          <div className="d">{desc}</div>
                        </div>
                      </li>
                  )}
                </ul>
              </div>

              <aside className="x-side">
                <div>
                  <div className="lbl">Observe → Improve</div>
                  <div className="val" style={{ fontSize: 13.5, lineHeight: 1.7, color: "var(--x-mute)", fontWeight: 400 }}>
                    실행 결과를 보고, 다음 개선점을 찾는다.
                  </div>
                </div>
                <div>
                  <div className="lbl">Self-improving</div>
                  <div className="val" style={{ fontSize: 13.5, lineHeight: 1.7, color: "var(--x-mute)", fontWeight: 400 }}>
                    이 사이클이 반복될수록 시스템은 스스로 나아진다.
                  </div>
                </div>
              </aside>
            </>
          }

          {section === "work" && (() => {
            const bada = data.caseStudies.find((c) => c.id === "bada");
            const others = cases.filter((c) => c.id !== "bada");
            return (
              <>
                <div>
                  <div className="x-eyebrow"><span className="bar" /><b>03</b> · Work</div>
                  <h2 className="x-h2">프로젝트 나열이 아닌,<br />문제와 설계의 흐름.</h2>

                  {/* ── Bada Featured ── */}
                  <div style={{
                    borderLeft: "3px solid var(--x-accent)",
                    paddingLeft: 28,
                    marginBottom: 56,
                  }}>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 16 }}>
                      <span style={{ fontSize: 10.5, letterSpacing: ".14em", textTransform: "uppercase", color: "var(--x-accent)", fontWeight: 500 }}>★ Featured</span>
                      <span style={{ fontSize: 12, color: "var(--x-mute)" }}>{bada.tag} · {bada.period}</span>
                    </div>
                    <div style={{ fontSize: 28, fontWeight: 500, letterSpacing: "-.022em", marginBottom: 10 }}>{bada.title}</div>
                    <p style={{ fontSize: 16, color: "var(--x-mute)", lineHeight: 1.7, margin: "0 0 32px", textWrap: "balance" }}>{bada.subtitle}</p>

                    <div className="x-section-h">Problem</div>
                    <p style={{ fontSize: 15.5, lineHeight: 1.82, margin: "0 0 32px", color: "var(--x-ink-2)" }}>{bada.problem}</p>

                    <div className="x-section-h">Architecture</div>
                    <div className="x-pipe">
                      {bada.pipeline.map((p, i) =>
                        <React.Fragment key={p.stage}>
                          <div className="x-pipe-stage">
                            <div className="x-pipe-name">{p.stage}</div>
                            <div className="x-pipe-tool">{p.tool}</div>
                            <div className="x-pipe-rows">
                              <span>{p.role}</span>
                              <span>{p.out}</span>
                            </div>
                          </div>
                          {i < bada.pipeline.length - 1 && <div className="x-pipe-arrow">→</div>}
                        </React.Fragment>
                      )}
                    </div>
                    {bada.pipelineNote &&
                    <p className="x-pipe-note">{bada.pipelineNote}</p>
                    }

                    <div className="x-section-h">Solution</div>
                    <div style={{ marginBottom: 32 }}>
                      {bada.solution.map((s, i) =>
                        <div key={i} className="x-sol">
                          <h4>{s.h}</h4>
                          <p>{s.d}</p>
                        </div>
                      )}
                    </div>

                    <div className="x-section-h">Architecture Evolution</div>
                    <div style={{ marginBottom: 32 }}>
                      {bada.evolution.map((p, i) =>
                        <div key={i} className="x-sol">
                          <h4><span style={{ color: "var(--x-accent)", fontSize: 12, letterSpacing: ".08em", display: "block", marginBottom: 4 }}>{p.phase}</span>{p.title}</h4>
                          <p>{p.body}</p>
                        </div>
                      )}
                    </div>

                    <div className="x-section-h">Failure Cases</div>
                    <div style={{ marginBottom: 32 }}>
                      {bada.failureCases.map((f, i) =>
                        <div key={i} className="x-sol">
                          <h4><span style={{ color: "var(--x-accent)", fontSize: 12, letterSpacing: ".08em", display: "block", marginBottom: 4 }}>{f.type}</span>{f.title}</h4>
                          <p>{f.body}</p>
                        </div>
                      )}
                    </div>

                    <div className="x-section-h">Lessons Learned</div>
                    <ul style={{ listStyle: "none", margin: "0 0 32px", padding: 0 }}>
                      {bada.lessonsLearned.map((l, i) =>
                        <li key={i} className="x-focus-item" style={{ marginBottom: 18 }}>
                          <span className="n">{l.n}</span>
                          <div>
                            <div className="h">{l.h}</div>
                            <div className="d">{l.d}</div>
                          </div>
                        </li>
                      )}
                    </ul>

                    <div className="x-section-h">Results</div>
                    <div className="x-results-grid">
                      {bada.results.map((m, i) =>
                        <div key={i} className="x-metric">
                          <div className="k">{m.k}</div>
                          <div className="v">{m.v}</div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* ── Other Projects ── */}
                  <div className="x-section-h">Other Projects</div>
                  <div className="x-acc-list">
                    {others.map((c) => {
                      const open = expandedCase === c.id;
                      return (
                        <div key={c.id} className={"x-acc" + (open ? " open" : "")}>
                          <div
                            className="x-acc-head"
                            onClick={() => setExpandedCase(open ? null : c.id)}>
                            <div className="x-case-no">{c.number}</div>
                            <div>
                              <div className="x-case-title">{c.title}</div>
                              <div className="x-case-sub">{c.subtitle}</div>
                              <div className="x-case-meta">{c.period} · <b>{c.tag}</b></div>
                              {!open &&
                              <div className="x-acc-peek">
                                <span className="x-acc-peek-label">Challenge</span>
                                {c.challenge}
                              </div>
                              }
                            </div>
                            <svg className="x-acc-chevron" width="16" height="16" viewBox="0 0 16 16" fill="none">
                              <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </div>
                          {open &&
                          <div className="x-acc-body">
                            <div className="x-acc-grid">
                              <div className="x-section-h">Challenge</div>
                              <p style={{ margin: "0 0 28px", fontSize: 15, lineHeight: 1.8, color: "var(--x-ink-2)" }}>
                                {c.challenge}
                              </p>

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
                                <div style={{ display: "grid", gridTemplateColumns: `repeat(${c.metrics.length}, 1fr)`, gap: 12, marginBottom: 28 }}>
                                  {c.metrics.map((m, i) =>
                                    <div key={i} className="x-metric text">
                                      <div className="k">{m.k}</div>
                                      <div className="v">{m.v}</div>
                                    </div>
                                  )}
                                </div>
                              </>
                              }

                              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                                {c.stack.map((s) => <span key={s} className="x-pill">{s}</span>)}
                              </div>
                            </div>
                          </div>
                          }
                        </div>
                      );
                    })}
                  </div>
                </div>

                <aside className="x-side">
                  <div>
                    <div className="lbl">Pipeline</div>
                    <div className="val" style={{ fontSize: 13, lineHeight: 1.8, color: "var(--x-mute)", fontWeight: 400 }}>
                      Observer<br />→ Planner<br />→ Implementer<br />→ Reviewer
                    </div>
                  </div>
                  <div>
                    <div className="lbl">Memory</div>
                    <div className="val" style={{ fontSize: 13, lineHeight: 1.7, color: "var(--x-mute)", fontWeight: 400 }}>
                      REVIEW_CHECKLIST.md<br />장기 실패 패턴 축적
                    </div>
                  </div>
                  <div>
                    <div className="lbl">Key Insight</div>
                    <div className="val" style={{ fontSize: 13, lineHeight: 1.7, color: "var(--x-mute)", fontWeight: 400 }}>
                      Workflow가 LLM보다<br />결과의 질을 결정했다
                    </div>
                  </div>
                </aside>
              </>
            );
          })()}

          {section === "contact" &&
          <>
              <div>
                <div className="x-eyebrow"><span className="bar" /><b>04</b> · Contact</div>
                <h2 className="x-h2">잘 만든 시스템을<br />함께 고민할 곳을 찾고 있습니다.</h2>
                <p className="x-lede" style={{ fontSize: 17 }}>
                  새로운 문제를 함께 풀어보고 싶다면, 언제든 편하게 연락 주시면 감사하겠습니다.
                </p>
                <dl className="x-dl">
                  <div className="x-dl-row"><dt>Email</dt><dd><b>{data.contact.email}</b></dd></div>
                  <div className="x-dl-row"><dt>GitHub</dt><dd><b><a href={`https://${data.contact.github}`} target="_blank" rel="noopener noreferrer">{data.contact.github}</a></b></dd></div>
                  <div className="x-dl-row"><dt>Location</dt><dd>{data.contact.location}</dd></div>
                </dl>
              </div>

              <aside className="x-side">
                <div>
                  <div className="lbl">Response time</div>
                  <div className="val">~24h</div>
                </div>
                <div>
                  <div className="lbl">Scope</div>
                  <div className="val" style={{ fontSize: 14, lineHeight: 1.7 }}>
                    UI 엔진 · 접근성<br />시스템 설계 · AI
                  </div>
                </div>
              </aside>
            </>
          }
        </div>
      </main>

      {/* FOOTER */}
      <footer className="x-foot">
        <div className="x-foot-inner">
          <div />
          <div>
            <b>{current.label}</b>
            <span className="dots">
              {C2_SECTIONS.map((_, i) =>
              <i key={i} className={i === sectionIdx ? "on" : ""} />
              )}
            </span>
          </div>
          <div className="r">Portfolio v2026.05</div>
        </div>
      </footer>

    </div>);

}
