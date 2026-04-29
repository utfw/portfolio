import React from "react";

const { useState: useStateA, useEffect: useEffectA } = React;

const sessionStartA = Date.now();

const A_SECTIONS = [
{ id: "index", no: "00", label: "index", file: "index.tsx" },
{ id: "about", no: "01", label: "about", file: "about.md" },
{ id: "work", no: "02", label: "work", file: "work.json" },
{ id: "case", no: "03", label: "case_studies", file: "case_studies/" },
{ id: "earlier", no: "04", label: "earlier", file: "earlier/2022_2023" },
{ id: "contact", no: "05", label: "contact", file: "contact.send()" }];


const A_NEXT = {
  index: "about",
  about: "work",
  work: "case",
  case: "earlier",
  earlier: "contact",
  contact: "index"
};

function useNowA() {
  const [now, setNow] = useStateA(() => new Date());
  useEffectA(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  const pad = (n) => String(n).padStart(2, "0");
  return `${now.getFullYear()}.${pad(now.getMonth() + 1)}.${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
}

export default function DirectionA({ data, density = "comfortable", bodyType = "mono", accent = "#9b3a2a" }) {
  const [section, setSection] = useStateA("index");
  const [activeCase, setActiveCase] = useStateA(null);
  const ts = useNowA();

  const styleVars = {
    "--a-bg": "#f5f0e6",
    "--a-bg-2": "#ebe4d4",
    "--a-ink": "#1a1814",
    "--a-mute": "#6b665c",
    "--a-line": "#cfc6b4",
    "--a-accent": accent,
    "--a-side-w": "240px",
    "--a-foot-h": "60px",
    "--a-pad-x": density === "tight" ? "48px" : density === "loose" ? "104px" : "76px",
    "--a-pad-y": density === "tight" ? "36px" : density === "loose" ? "88px" : "60px",
    "--a-row": density === "tight" ? "10px" : density === "loose" ? "20px" : "14px",
    "--a-body": bodyType === "serif" ? "'Source Serif 4', 'Noto Serif KR', Georgia, serif" :
    bodyType === "sans" ? "'Pretendard', 'Inter', system-ui, sans-serif" :
    "'JetBrains Mono', 'Pretendard', ui-monospace, monospace"
  };

  return (
    <div className="dirA" style={styleVars}>
      <style>{`
        a { text-decoration: none; color: inherit; cursor: pointer; }
        a:hover { color: var(--a-accent); }
        .dirA {
          width: 100%; height: 100%;
          background: var(--a-bg); color: var(--a-ink);
          font-family: var(--a-body);
          font-size: 15px; line-height: 1.6;
          display: grid;
          grid-template-columns: var(--a-side-w) 1fr;
          grid-template-rows: 1fr var(--a-foot-h);
          overflow: hidden;
          position: relative;
        }

        /* SIDEBAR =============================================== */
        .dirA-side {
          grid-column: 1; grid-row: 1 / span 2;
          border-right: 1px solid var(--a-line);
          display: grid;
          grid-template-rows: auto auto 1fr auto;
          background: var(--a-bg);
          font-family: 'JetBrains Mono', 'Pretendard', ui-monospace, monospace;
        }
        .dirA-brand {
          padding: 26px 22px 22px;
          border-bottom: 1px solid var(--a-line);
        }
        .dirA-brand .mark {
          font-size: 11px; letter-spacing: .06em; color: var(--a-mute);
          display: flex; align-items: center; gap: 8px;
        }
        .dirA-brand .mark .dot { color: var(--a-accent); }
        .dirA-brand .name {
          margin-top: 14px;
          font-size: 18px; font-weight: 600; letter-spacing: -.01em;
          color: var(--a-ink);
        }
        .dirA-brand .role {
          margin-top: 4px;
          font-size: 11px; color: var(--a-mute); letter-spacing: .04em;
        }
        .dirA-brand .ver {
          margin-top: 14px; font-size: 10.5px; color: var(--a-mute);
          letter-spacing: .04em;
        }

        .dirA-nav {
          display: flex; flex-direction: column;
          padding: 14px 0;
          border-bottom: 1px solid var(--a-line);
        }
        .dirA-tab {
          all: unset; box-sizing: border-box;
          display: grid; grid-template-columns: 38px 1fr auto;
          align-items: baseline; gap: 8px;
          padding: 11px 22px;
          color: var(--a-mute); cursor: pointer;
          font-family: inherit; font-size: 12px; letter-spacing: .04em;
          border-left: 2px solid transparent;
          transition: background .15s, color .15s, border-color .15s;
        }
        .dirA-tab:hover { background: var(--a-bg-2); color: var(--a-ink); }
        .dirA-tab.active {
          color: var(--a-ink); background: var(--a-bg-2);
          border-left-color: var(--a-accent);
        }
        .dirA-tab.active .num { color: var(--a-accent); }
        .dirA-tab .num { font-size: 10.5px; color: var(--a-mute); }
        .dirA-tab .arrow {
          opacity: 0; font-size: 11px; color: var(--a-accent);
          transition: opacity .15s;
        }
        .dirA-tab.active .arrow,
        .dirA-tab:hover .arrow { opacity: 1; }

        .dirA-side-log {
          padding: 18px 22px;
          border-top: 1px solid var(--a-line);
          color: var(--a-mute);
          font-size: 10.5px; line-height: 1.5;
          letter-spacing: .04em;
          align-self: stretch;
        }
        .dirA-side-log pre {
          margin: 0; white-space: pre;
          font-family: inherit;
        }

        .dirA-side-meta {
          padding: 22px 22px;
          font-size: 10.5px; color: var(--a-mute);
          letter-spacing: .04em;
          display: grid; gap: 18px;
          align-content: end;
        }
        .dirA-side-meta .lbl {
          color: var(--a-mute); text-transform: uppercase; letter-spacing: .08em;
          margin-bottom: 4px;
        }
        .dirA-side-meta .val { color: var(--a-ink); font-size: 11.5px; }

        /* MAIN =================================================== */
        .dirA-main {
          grid-column: 2; grid-row: 1;
          overflow-y: auto;
          display: flex; flex-direction: column;
          background: var(--a-bg);
        }
        .dirA-body {
          padding: var(--a-pad-y) var(--a-pad-x) 44px;
          background: var(--a-bg);
          flex: 1 1 auto;
        }
        .dirA-main { display: flex; flex-direction: column; }

        /* HEAD: current-section breadcrumb (above body) */
        .dirA-head {
          flex: 0 0 auto;
          border-bottom: 1px solid var(--a-line);
          padding: 14px var(--a-pad-x);
          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: baseline;
          gap: 28px;
          background: var(--a-bg);
        }
        .dirA-head .hh-l { display: flex; align-items: baseline; gap: 12px; }
        .dirA-head .hh-meta {
          font-size: 10.5px; letter-spacing: .08em; text-transform: uppercase;
          color: var(--a-mute);
        }
        .dirA-head .hh-pos {
          font-size: 10.5px; letter-spacing: .04em;
          color: var(--a-ink); font-weight: 600;
        }
        .dirA-head .hh-c {
          display: flex; align-items: baseline; gap: 12px;
          font-size: 22px; letter-spacing: -.01em;
        }
        .dirA-head .hh-num { color: var(--a-accent); font-weight: 600; }
        .dirA-head .hh-label { color: var(--a-ink); font-weight: 500; }
        .dirA-head .hh-prog {
          margin: 0;
          font-size: 10.5px; letter-spacing: .15em;
          color: var(--a-mute); white-space: pre;
        }
        .dirA-head .hh-prog .bar { color: var(--a-ink); letter-spacing: 0; }
        .dirA-head .hh-prog .barmute { color: var(--a-line); letter-spacing: 0; }

        .dirA-ground {
          flex: 0 0 auto;
          min-height: 160px;
          margin-top: auto;
          background: var(--a-bg-2);
          border-top: 1px solid var(--a-line);
          padding: 36px var(--a-pad-x);
          display: grid;
          grid-template-columns: auto 1fr auto;
          gap: 48px;
          font-family: 'JetBrains Mono', 'Pretendard', ui-monospace, monospace;
          color: var(--a-mute);
          cursor: pointer;
          transition: background .15s;
        }
        .dirA-ground:hover { background: #e2d9c4; }
        .dirA-ground:hover .gx { color: var(--a-accent); }
        .dirA-ground b { color: var(--a-ink); font-weight: 600; }
        .dirA-ground .gh {
          display: flex; align-items: baseline; gap: 14px;
          font-size: 10.5px; letter-spacing: .08em; text-transform: uppercase;
          margin-bottom: 12px; color: var(--a-mute);
        }
        .dirA-ground .gh .pos { color: var(--a-mute); letter-spacing: .04em; }
        .dirA-ground .gx {
          font-size: 32px; font-weight: 500;
          letter-spacing: -.01em; line-height: 1;
          color: var(--a-ink);
          transition: color .15s;
          display: flex; align-items: baseline; gap: 14px;
        }
        .dirA-ground .gx .num { color: var(--a-accent); font-size: 22px; }
        .dirA-ground .gx .arr { color: var(--a-mute); font-size: 22px; transition: transform .15s, color .15s; }
        .dirA-ground:hover .gx .arr { transform: translateX(4px); color: var(--a-accent); }
        .dirA-ground .gsub {
          margin-top: 10px; font-size: 11px;
          color: var(--a-mute); letter-spacing: .04em;
        }
        .dirA-ground .gprog {
          margin: 0;
          font-size: 10.5px; letter-spacing: .15em;
          color: var(--a-mute); white-space: pre;
          line-height: 1.5;
          text-align: right;
        }
        .dirA-ground .gprog .bar { color: var(--a-mute); letter-spacing: 0; }
        .dirA-ground .gprog .barmute { color: var(--a-line); letter-spacing: 0; }

        /* 3-col guideline grid: meta / body / side */
        .a-frame {
          display: grid;
          grid-template-columns: 92px minmax(0, 1.35fr) minmax(360px, 1fr);
          gap: 44px;
          align-items: start;
        }
        .a-frame > .a-col-meta {
          font-family: 'JetBrains Mono', 'Pretendard', ui-monospace, monospace;
          font-size: 10.5px; letter-spacing: .08em; text-transform: uppercase;
          color: var(--a-mute);
          display: grid; gap: 18px;
          padding-top: 8px;
        }
        .a-col-meta .ix {
          font-size: 32px; color: var(--a-accent);
          font-weight: 500; letter-spacing: -.01em;
          line-height: 1; text-transform: none;
        }
        .a-col-meta .tic { color: var(--a-mute); }
        .a-col-meta .tic span { display: block; margin-bottom: 2px; white-space: nowrap; }
        .a-col-meta hr {
          border: 0; height: 1px; background: var(--a-line);
          margin: 4px 0;
        }

        .a-col-body { min-width: 0; display: grid; gap: 28px; }
        .a-col-side { min-width: 0; }

        /* TYPE =================================================== */
        .dirA, .dirA * {
          font-feature-settings: 'ss01', 'cv11', 'tnum';
          font-variant-numeric: tabular-nums;
        }
        .dirA p { text-wrap: pretty; }
        .dirA h1 { font-family: 'JetBrains Mono', 'Pretendard', ui-monospace, monospace;
          font-weight: 500; font-size: 104px; line-height: .98; letter-spacing: -.035em;
          margin: 0; }
        .dirA h2 { font-family: 'JetBrains Mono', 'Pretendard', ui-monospace, monospace;
          font-weight: 500; font-size: 40px; line-height: 1.12; letter-spacing: -.02em;
          margin: 0; }
        .dirA .lede { font-size: 18.5px; line-height: 1.55; max-width: 60ch;
          letter-spacing: -.005em; }
        .dirA .meta { font-family: 'JetBrains Mono', 'Pretendard', ui-monospace, monospace;
          font-size: 10.5px; letter-spacing: .08em; text-transform: uppercase;
          color: var(--a-mute); font-weight: 500; }
        .dirA .rule { height: 1px; background: var(--a-line); width: 100%; }
        .dirA .ascii { white-space: pre; font-family: 'JetBrains Mono', 'Pretendard', ui-monospace, monospace;
          font-size: 11px; line-height: 1.25; color: var(--a-mute); }

        /* SHARED ATOMS =========================================== */
        .a-grid { display: grid; gap: var(--a-row); }
        .a-row2 { display: grid; grid-template-columns: 180px 1fr; gap: 28px;
          padding: var(--a-row) 0; border-bottom: 1px solid var(--a-line); }
        .a-row2:last-child { border-bottom: 0; }
        .a-row2 dt { color: var(--a-mute); font-family: 'JetBrains Mono', 'Pretendard', ui-monospace, monospace;
          font-size: 11px; letter-spacing: .06em; text-transform: uppercase; }
        .a-row2 dd { margin: 0; }

        .a-pill { display: inline-block; padding: 3px 9px; border: 1px solid var(--a-line);
          font-family: 'JetBrains Mono', 'Pretendard', ui-monospace, monospace; font-size: 11px;
          letter-spacing: .04em; margin: 2px 4px 2px 0;
          color: var(--a-ink); background: transparent;
          transition: background .15s, color .15s, border-color .15s; cursor: default; }
        .a-pill:hover { background: var(--a-ink); color: var(--a-bg); border-color: var(--a-ink); }

        .a-case-card { padding: 14px 12px; border-bottom: 1px solid var(--a-line);
          display: grid; grid-template-columns: 52px 1fr auto; gap: 20px; align-items: baseline;
          cursor: pointer; transition: background .15s, padding .15s; position: relative; }
        .a-case-card:hover { background: var(--a-bg-2); padding-left: 18px; padding-right: 18px; }
        .a-case-feat { background: var(--a-bg-2); padding-left: 14px; padding-right: 14px; }
        .a-case-feat::before {
          content: ''; position: absolute; left: 0; top: 0; bottom: 0;
          width: 3px; background: var(--a-accent);
        }
        .a-case-pin {
          display: inline-block; margin-left: 10px;
          font-family: 'JetBrains Mono', 'Pretendard', ui-monospace, monospace;
          font-size: 9.5px; letter-spacing: .12em; text-transform: uppercase;
          color: var(--a-accent); vertical-align: 3px;
        }
        .a-case-num { font-family: 'JetBrains Mono', 'Pretendard', ui-monospace, monospace;
          font-size: 20px; color: var(--a-accent); font-weight: 500; }
        .a-case-title { font-family: 'JetBrains Mono', 'Pretendard', ui-monospace, monospace;
          font-size: 17px; font-weight: 500; }
        .a-case-sub { color: var(--a-mute); margin-top: 3px; font-size: 12.5px; }
        .a-case-arrow { color: var(--a-mute); font-family: 'JetBrains Mono', 'Pretendard', ui-monospace, monospace; font-size: 12.5px; }

        /* SIDEPANEL ============================================== */
        .a-sp {
          border-left: 1px solid var(--a-line);
          padding: 4px 0 0 28px;
          display: grid; gap: 22px;
          align-self: stretch;
        }
        .a-sp-block { display: grid; gap: 8px; }
        .a-sp-head {
          display: flex; justify-content: space-between; align-items: baseline;
          padding-bottom: 8px; border-bottom: 1px solid var(--a-line);
        }
        .a-foots {
          margin-top: auto;
          padding-top: 18px; border-top: 1px dashed var(--a-line);
          display: grid; gap: 10px;
        }
        .a-foots .fn {
          display: grid; grid-template-columns: 36px 1fr; gap: 10px;
          font-family: 'JetBrains Mono', 'Pretendard', ui-monospace, monospace;
          font-size: 11px; line-height: 1.5; color: var(--a-mute);
        }
        .a-foots .fn .mk { color: var(--a-accent); }
        .a-foots .fn em { font-style: normal; color: var(--a-ink); }

        /* MODAL ================================================== */
        .a-modal-back { position: absolute; inset: 0; background: rgba(26,24,20,.55);
          z-index: 10; display: flex; align-items: stretch; justify-content: flex-end;
          animation: aModalBackIn .2s ease-out both; }
        .a-modal { width: min(960px, 70%); max-width: 70%; height: 100%;
          background: var(--a-bg);
          border-left: 1px solid var(--a-line); padding: 40px var(--a-pad-x); overflow-y: auto;
          box-shadow: -20px 0 60px rgba(0,0,0,.18);
          animation: aModalIn .42s cubic-bezier(.22,.61,.36,1) .04s both; }
        .a-modal-close { background: transparent; border: 1px solid var(--a-line);
          padding: 6px 12px; cursor: pointer; font-family: inherit; font-size: 11px;
          letter-spacing: .04em; text-transform: uppercase; color: var(--a-mute); }
        .a-modal-close:hover { background: var(--a-ink); color: var(--a-bg); border-color: var(--a-ink); }
        @keyframes aModalBackIn { from { background: rgba(26,24,20,0); } to { background: rgba(26,24,20,.55); } }
        @keyframes aModalIn { from { transform: translateX(100%); } to { transform: translateX(0); } }

        /* FOOTER ================================================= */
        .dirA-foot {
          grid-column: 2; grid-row: 2;
          border-top: 1px solid var(--a-line);
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          padding: 0 var(--a-pad-x);
          font-family: 'JetBrains Mono', 'Pretendard', ui-monospace, monospace;
          font-size: 10.5px; letter-spacing: .06em;
          color: var(--a-mute);
          background: var(--a-bg);
        }
        .dirA-foot .l, .dirA-foot .r { display: flex; align-items: center; gap: 14px; }
        .dirA-foot .r { justify-content: flex-end; }
        .dirA-foot b { color: var(--a-ink); font-weight: 600; }
        .dirA-foot .blink { color: var(--a-accent); }
        .dirA-foot button {
          all: unset; cursor: pointer;
          padding: 6px 10px; border: 1px solid var(--a-line);
          color: var(--a-mute); letter-spacing: .06em; text-transform: uppercase;
          font-size: 10.5px; transition: background .15s, color .15s, border-color .15s;
        }
        .dirA-foot button:hover { background: var(--a-ink); color: var(--a-bg); border-color: var(--a-ink); }

        .dirA .blink { animation: blinkA 1.1s steps(1, end) infinite; color: var(--a-accent); }
        @keyframes blinkA { 50% { opacity: 0; } }
      `}</style>

      {/* SIDEBAR ----------------------------------------------------------- */}
      <aside className="dirA-side">
        <div className="dirA-brand">
          <div className="mark"><span className="dot">●</span> hwan_choi.fe</div>
          <div className="name">최&nbsp;환</div>
          <div className="role">software_engineer · interfaces · ai</div>
          <div className="ver">v2026.04 · seoul.kr</div>
        </div>

        <nav className="dirA-nav" aria-label="sections">
          {A_SECTIONS.map((s) =>
          <button
            key={s.id}
            className={"dirA-tab" + (section === s.id ? " active" : "")}
            onClick={() => {setSection(s.id);setActiveCase(null);}}>
            
              <span className="num">{s.no}</span>
              <span>{s.label}</span>
              <span className="arrow">→</span>
            </button>
          )}
        </nav>

        <div className="dirA-side-log" aria-hidden="true">
          <pre>{`> session
  uptime ${Math.floor((Date.now() - sessionStartA) / 1000)}s
  scope  /portfolio
  view   ${section}.tsx`}</pre>
        </div>

        <div className="dirA-side-meta">
          <div>
            <div className="lbl">// status</div>
            <div className="val" style={{ color: "var(--a-accent)" }}>● 새로운 기회 탐색 중</div>
          </div>
          <div>
            <div className="lbl">// repo</div>
            <div className="val"><a href="https://github.com/utfw" target="_blank">github.com/utfw</a></div>
          </div>
        </div>
      </aside>

      {/* MAIN -------------------------------------------------------------- */}
      <main className="dirA-main">
        {/* HEAD: current-section breadcrumb */}
        <div className="dirA-head" aria-hidden="false" style={{ textAlign: "center" }}>
          <div className="hh-l">
            <span className="hh-meta">// section</span>
            <span className="hh-pos">
              {String(A_SECTIONS.findIndex((s) => s.id === section) + 1).padStart(2, "0")}
              {" / "}
              {String(A_SECTIONS.length).padStart(2, "0")}
            </span>
          </div>
          <div className="hh-c">
            <span className="hh-num">
              {A_SECTIONS.find((s) => s.id === section).no}
            </span>
            <span className="hh-label">
              {A_SECTIONS.find((s) => s.id === section).file}
            </span>
          </div>
          <pre className="hh-prog">{(() => {
              const idx = A_SECTIONS.findIndex((s) => s.id === section);
              const total = A_SECTIONS.length;
              const filled = "\u2588".repeat(idx + 1);
              const empty = "\u2591".repeat(total - idx - 1);
              return (
                <>
                <span className="bar">{filled}</span>
                <span className="barmute">{empty}</span>
                {`  ${idx + 1}/${total}`}
              </>);

            })()}</pre>
        </div>

        <div className="dirA-body">
          {section === "index" && <A_Index data={data} go={setSection} />}
          {section === "about" && <A_About data={data} />}
          {section === "work" && <A_Work data={data} />}
          {section === "case" && <A_Cases data={data} onOpen={(c) => setActiveCase(c)} />}
          {section === "earlier" && <A_Earlier data={data} />}
          {section === "contact" && <A_Contact data={data} />}
        </div>
        <div
          className="dirA-ground"
          onClick={() => {setSection(A_NEXT[section]);setActiveCase(null);}}
          role="button"
          aria-label={`go to ${A_NEXT[section]}`}>
          
          <div>
            <div className="gh">
              <span>// next.section</span>
              <span className="pos">
                {String(A_SECTIONS.findIndex((s) => s.id === A_NEXT[section]) + 1).padStart(2, "0")}
                {" / "}
                {String(A_SECTIONS.length).padStart(2, "0")}
              </span>
            </div>
            <div className="gx">
              <span className="num">
                {A_SECTIONS.find((s) => s.id === A_NEXT[section]).no}
              </span>
              <span>{A_NEXT[section]}</span>
              <span className="arr">→</span>
            </div>
            <div className="gsub">click anywhere to continue · →</div>
          </div>

          <div /> {/* spacer */}

          <pre className="gprog">{(() => {
              const idx = A_SECTIONS.findIndex((s) => s.id === section);
              const total = A_SECTIONS.length;
              const filled = "\u2588".repeat(idx + 1);
              const empty = "\u2591".repeat(total - idx - 1);
              return (
                <>
                <span>{`progress\n`}</span>
                <span className="bar">{filled}</span>
                <span className="barmute">{empty}</span>
                {`  ${idx + 1}/${total}`}
              </>);

            })()}</pre>
        </div>
      </main>

      {/* FOOTER ------------------------------------------------------------ */}
      <footer className="dirA-foot">
        <div className="l">
          <span className="blink">▌</span>
          <span><b>{section}</b>.section</span>
          <span style={{ color: "var(--a-line)" }}>/</span>
          <span>{ts}</span>
        </div>
        <div className="c" />
        <div className="r" />
      </footer>

      {/* CASE MODAL ------------------------------------------------------- */}
      {activeCase &&
      <div className="a-modal-back" onClick={() => setActiveCase(null)}>
          <aside className="a-modal" onClick={(e) => e.stopPropagation()}>
            <A_CaseDetail c={activeCase} onClose={() => setActiveCase(null)} />
          </aside>
        </div>
      }
    </div>);

}

/* ===================================================================== */
/* FRAME wrapper — gives every section the same 3-col rhythm             */
/* ===================================================================== */
function A_Frame({ no, label, ticks = [], children, side }) {
  return (
    <div className="a-frame">
      <div className="a-col-meta">
        <div className="ix">{no}</div>
        <div>{label}</div>
        <hr />
        {ticks.length > 0 &&
        <div className="tic">
            {ticks.map((t, i) => <span key={i}>{t}</span>)}
          </div>
        }
      </div>
      <div className="a-col-body">{children}</div>
      <div className="a-col-side">{side}</div>
    </div>);

}

function A_SidePanel({ label, sub, children, footnotes }) {
  return (
    <div className="a-sp">
      <div className="a-sp-head">
        <div className="meta">{label}</div>
        {sub && <div className="meta" style={{ opacity: .7 }}>{sub}</div>}
      </div>
      {children}
      {footnotes && footnotes.length > 0 &&
      <div className="a-foots">
          <div className="meta" style={{ marginBottom: 2, color: "var(--a-mute)" }}>
            // footnotes
          </div>
          {footnotes.map((f, i) =>
        <div key={i} className="fn">
              <span className="mk">*[{String(i + 1).padStart(2, "0")}]</span>
              <span><em>{f.h}</em>{f.d ? ` — ${f.d}` : ""}</span>
            </div>
        )}
        </div>
      }
    </div>);

}

/* ===================================================================== */
/* INDEX                                                                  */
/* ===================================================================== */
function A_Index({ data, go }) {
  return (
    <A_Frame
      no="00"
      label="index.tsx"
      ticks={["// hello", "// 2026.04", "// seoul.kr"]}
      side={
      <A_SidePanel
        label="// at_a_glance"
        sub="2026.04"
        footnotes={[
        { h: "UI 엔진 설계", d: "가상 렌더링 · 접근성 · 아키텍처" },
        { h: "IBChatbot", d: "2024 릴리즈 · 출시 완료" },
        { h: "IBSheet8", d: "QA 자동화 · 핸드오프 완료" }]
        }>
        
          <div className="a-sp-block">
            <div className="meta">currently</div>
            <div style={{
            fontFamily: "'JetBrains Mono', 'Pretendard', ui-monospace, monospace",
            fontSize: 20, fontWeight: 500, letterSpacing: "-.005em"
          }}>
              UI 엔진 아키텍처
            </div>
            <div style={{ color: "var(--a-mute)", fontSize: 13.5 }}>
              가상 스크롤 위에서 키보드와 스크린리더가 동등하게 닿는 그리드를 만들고 있습니다.
            </div>
          </div>

          <div className="rule" />

          <div className="a-sp-block">
            <div className="meta">focus</div>
            <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "grid", gap: 8 }}>
              {[
            "Self-explanatory Interface",
            "Accessibility for everyone",
            "AI as a trustworthy primitive"].
            map((t, i) =>
            <li key={i} style={{ display: "grid", gridTemplateColumns: "20px 1fr", gap: 10 }}>
                  <span style={{ color: "var(--a-accent)" }}>→</span>
                  <span>{t}</span>
                </li>
            )}
            </ul>
          </div>
        </A_SidePanel>
      }>
      
      <div style={{
        display: "grid",
        gap: 40,
        paddingTop: 24
      }}>
        <div>
          <div className="meta" style={{ marginBottom: 18 }}>
            software.engineer · interfaces · a11y · ai · seoul
          </div>
          <h1>
            최&nbsp;환<span className="blink">_</span>
            <span style={{
              color: "var(--a-mute)", fontSize: 28, marginLeft: 18,
              letterSpacing: "-.01em", fontWeight: 400, verticalAlign: "middle"
            }}>
              // Hwan Choi
            </span>
          </h1>
        </div>

        <p className="lede" style={{ maxWidth: "54ch", margin: 0 }}>
          {data.tagline}
        </p>

        {/* mid-band: terminal echo — gives the page a breathing visual anchor */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "auto 1fr",
          gap: "4px 14px",
          fontFamily: "'JetBrains Mono', 'Pretendard', ui-monospace, monospace",
          fontSize: 13,
          padding: "16px 0",
          borderTop: "1px solid var(--a-line)",
          borderBottom: "1px solid var(--a-line)",
          alignItems: "baseline"
        }}>
          <span style={{ color: "var(--a-mute)" }}>$</span>
          <span style={{ color: "var(--a-ink)" }}>
            whoami<span style={{ color: "var(--a-mute)" }}> &amp;&amp; </span>cat ./role.txt
          </span>
          <span style={{ color: "var(--a-accent)" }}>→</span>
          <span style={{ color: "var(--a-ink)" }}>
            software_engineer — 인터랙션을 만드는 사람
          </span>
          <span style={{ color: "var(--a-mute)" }}>$</span>
          <span style={{ color: "var(--a-ink)" }}>
            cat ./status.txt
          </span>
          <span style={{ color: "var(--a-accent)" }}>→</span>
          <span style={{ color: "var(--a-ink)" }}>
            <span style={{ color: "var(--a-accent)" }}>●</span> 새로운 기회 탐색 중 <span style={{ color: "var(--a-mute)" }}>· open to opportunities</span>
          </span>
        </div>

        <div style={{ display: "grid", gap: 22 }}>
          <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
            <button
              onClick={() => go("case")}
              style={{
                background: "var(--a-ink)", color: "var(--a-bg)", border: 0,
                padding: "14px 22px", fontFamily: "'JetBrains Mono', 'Pretendard', ui-monospace, monospace",
                fontSize: 12, letterSpacing: ".06em", textTransform: "uppercase",
                cursor: "pointer"
              }}>
              
              → read case studies
            </button>
            <button
              onClick={() => go("about")}
              style={{
                background: "transparent", color: "var(--a-ink)",
                border: "1px solid var(--a-line)",
                padding: "14px 22px", fontFamily: "'JetBrains Mono', 'Pretendard', ui-monospace, monospace",
                fontSize: 12, letterSpacing: ".06em", textTransform: "uppercase",
                cursor: "pointer"
              }}>
              
              about
            </button>
          </div>

          <div className="rule" />
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, auto)",
            justifyContent: "start",
            gap: "6px 28px",
            fontFamily: "'JetBrains Mono', 'Pretendard', ui-monospace, monospace",
            fontSize: 11, letterSpacing: ".06em",
            color: "var(--a-mute)"
          }}>
            <span>since 2023.07</span>
            <span style={{ color: "var(--a-line)" }}>/</span>
            <span>(주)소프트인 · fe.engineer</span>
            <span>now</span>
            <span style={{ color: "var(--a-line)" }}>/</span>
            <span style={{ color: "var(--a-ink)" }}>그리드 · 접근성 · 에이전트</span>
            <span>availability</span>
            <span style={{ color: "var(--a-line)" }}>/</span>
            <span style={{ color: "var(--a-accent)" }}>● 새로운 기회 탐색 중</span>
          </div>
        </div>
      </div>
    </A_Frame>);

}

/* ===================================================================== */
/* ABOUT                                                                  */
/* ===================================================================== */
function A_About({ data }) {
  return (
    <A_Frame
      no="01"
      label="about.md"
      ticks={["// intro", "// path", "// education"]}
      side={
      <A_SidePanel
        label="// margin_notes"
        footnotes={[
        { h: "소프트인", d: "2023.07 ~ 현재" },
        { h: "강원", d: "강원대학교 심리학과 졸업" },
        { h: "bridge", d: "사람의 인지를 아는 UI" }]
        }>
        
          <pre className="ascii" style={{ margin: 0, fontSize: 11 }}>{`
   psychology         engineering
   ───────────        ───────────
   사람을 읽기   ─→   시스템을 짓기
        ↘                ↗
         ↘              ↗
          ──→  bridge ──
              · · ·
     화면 너머의
     사람을 향해
`}</pre>
        </A_SidePanel>
      }>
      
      <h2>about()</h2>
      <div style={{ fontSize: 16, lineHeight: 1.7, color: "var(--a-ink)" }}>
        {data.intro.map((p, i) => <p key={i} style={{ margin: "0 0 .6em" }}>{p}</p>)}
      </div>

      <div className="rule" />
      <div className="meta">education</div>
      <dl style={{ margin: 0 }}>
        {data.education.map((e, i) =>
        <div key={i} className="a-row2">
            <dt>{e.period}</dt>
            <dd><b>{e.school}</b><div style={{ color: "var(--a-mute)" }}>{e.detail}</div></dd>
          </div>
        )}
      </dl>
    </A_Frame>);

}

/* ===================================================================== */
/* WORK                                                                   */
/* ===================================================================== */
function A_Work({ data }) {
  return (
    <A_Frame
      no="02"
      label="work.json"
      ticks={["// stack", "// timeline", "// tools"]}
      side={
      <A_SidePanel
        label="// build_log"
        footnotes={[
        { h: "도구는 도구일 뿐", d: "가상화 · 접근성 · 신뢰성에 더 머무릅니다" }]
        }>
        
          <pre className="ascii" style={{ margin: 0, fontSize: 11 }}>{`
  $ tail -f /var/log/career
  [2023.07] booted...
  [2023.07] joined softin/inc
  [2023.08] ibsheet8/maintain
  [2024.06] ibchatbot/migrate
  [2024.10] ibchatbot/ship  ✓
  [2025.12] ibsheet8/handoff ✓
  [now]     looking forward...
`}</pre>
        </A_SidePanel>
      }>
      
      <h2>technical_skills()</h2>
      <dl style={{ margin: 0 }}>
        {Object.entries(data.skills).map(([cat, items]) =>
        <div key={cat} className="a-row2">
            <dt>{cat}</dt>
            <dd>
              {items.map((s) => <span key={s} className="a-pill">{s}</span>)}
            </dd>
          </div>
        )}
      </dl>

      <div className="rule" />
      <div className="meta">experience</div>
      <dl style={{ margin: 0 }}>
        {data.experience.map((x, i) =>
        <div key={i} className="a-row2">
            <dt>{x.period}</dt>
            <dd><b>{x.company}</b><div style={{ color: "var(--a-mute)" }}>{x.role}</div></dd>
          </div>
        )}
      </dl>
    </A_Frame>);

}

/* ===================================================================== */
/* CASES                                                                  */
/* ===================================================================== */
function A_Cases({ data, onOpen }) {
  return (
    <A_Frame
      no="03"
      label="case_studies/"
      ticks={["// 4 entries", "// click→open", "// ~2min each"]}
      side={
      <A_SidePanel
        label="// reading_guide"
        footnotes={[
        { h: "challenge → solution → outcome", d: "각 케이스의 공통 포맷" },
        { h: "metrics", d: "정량 지표는 카드 하단 표에" }]
        }>
        
          <pre className="ascii" style={{ margin: 0, fontSize: 11 }}>{`
   challenge
      |
      v
   solution ──→ outcome
      |             ^
      └─────────────┘
         (iterate)
`}</pre>
          <div style={{ borderTop: "1px solid var(--a-line)", paddingTop: 14,
          display: "grid", gap: 6 }}>
            <div className="meta">// reading_time</div>
            <div style={{
            fontFamily: "'JetBrains Mono', 'Pretendard', ui-monospace, monospace",
            fontSize: 28, color: "var(--a-ink)", letterSpacing: "-.01em"
          }}>~ 2 min<span style={{ color: "var(--a-mute)", fontSize: 16 }}> / each</span></div>
          </div>
        </A_SidePanel>
      }>
      
      <h2 style={{ marginBottom: 4 }}>cases.map(c =&gt; tell(c))</h2>
      <p style={{ color: "var(--a-mute)", margin: "0 0 12px", maxWidth: "60ch" }}>
        선택한 프로젝트들. 카드를 클릭하면 문제 → 해결 → 결과를 자세히 볼 수 있습니다.
      </p>
      <div>
        {data.caseStudies.map((c, i) =>
        <div
          key={c.id}
          className={"a-case-card" + (i === 0 ? " a-case-feat" : "")}
          onClick={() => onOpen(c)}>
            <div className="a-case-num">{c.number}</div>
            <div>
              <div className="a-case-title">
                {c.title}
                {i === 0 && <span className="a-case-pin">★ latest</span>}
              </div>
              <div className="a-case-sub">{c.subtitle} · <span style={{ color: "var(--a-accent)" }}>{c.tag}</span></div>
            </div>
            <div className="a-case-arrow">[ open → ]</div>
          </div>
        )}
      </div>
    </A_Frame>);

}

function A_CaseDetail({ c, onClose }) {
  return (
    <div style={{ display: "grid", gap: 22 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div className="meta">// case_{c.number} · {c.year}</div>
        <button className="a-modal-close" onClick={onClose}>esc · close</button>
      </div>

      <div>
        <div style={{ fontFamily: "'JetBrains Mono', 'Pretendard', ui-monospace, monospace",
          fontSize: 36, fontWeight: 500, lineHeight: 1.1 }}>{c.title}</div>
        <div style={{ color: "var(--a-mute)", marginTop: 6, fontSize: 15 }}>{c.subtitle}</div>
      </div>

      <dl style={{ margin: 0 }}>
        <div className="a-row2"><dt>role</dt><dd>{c.role}</dd></div>
        <div className="a-row2"><dt>period</dt><dd>{c.period}</dd></div>
        <div className="a-row2"><dt>stack</dt><dd>{c.stack.map((s) => <span key={s} className="a-pill">{s}</span>)}</dd></div>
      </dl>

      <div>
        <div className="meta" style={{ marginBottom: 8 }}>challenge</div>
        <p style={{ margin: 0, fontSize: 15, lineHeight: 1.7 }}>{c.challenge}</p>
      </div>

      <div>
        <div className="meta" style={{ marginBottom: 12 }}>solution</div>
        <div style={{ display: "grid", gap: 14 }}>
          {c.solution.map((s, i) =>
          <div key={i} style={{ borderLeft: "2px solid var(--a-accent)", paddingLeft: 14 }}>
              <div style={{ fontWeight: 600 }}>→ {s.h}</div>
              <div style={{ color: "var(--a-mute)", marginTop: 2, fontSize: 14 }}>{s.d}</div>
            </div>
          )}
        </div>
      </div>

      {c.metrics &&
      <div>
          <div className="meta" style={{ marginBottom: 10 }}>outcomes</div>
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${c.metrics.length}, 1fr)`,
          border: "1px solid var(--a-line)" }}>
            {c.metrics.map((m, i) =>
          <div key={i} style={{
            padding: "16px 14px",
            borderRight: i < c.metrics.length - 1 ? "1px solid var(--a-line)" : 0
          }}>
                <div className="meta">{m.k}</div>
                <div style={{ fontSize: 22, fontFamily: "'JetBrains Mono', 'Pretendard', ui-monospace, monospace",
              marginTop: 4, color: "var(--a-accent)" }}>{m.v}</div>
              </div>
          )}
          </div>
        </div>
      }
    </div>);

}

/* ===================================================================== */
/* EARLIER                                                                */
/* ===================================================================== */
function A_Earlier({ data }) {
  const e = data.earlier;
  return (
    <A_Frame
      no="04"
      label="earlier/2022_2023"
      ticks={["// archive", "// matter.js", "// experiments"]}
      side={
      <A_SidePanel
        label="// memo"
        footnotes={[
        { h: "기록 우선", d: "도구보다 경험에 대한 기억" }]
        }>
        
          <pre className="ascii" style={{ margin: 0, fontSize: 11 }}>{`
   ↘ □  □ ↙
   □  ✦  □     ← 안으로 작용하는 힘
   ↗ □  □ ↖
       ⇣
   ▢ ▢ ▢ ▢
  ▢▢▢▢▢▢▢▢   ← 하단에 쌓이는 조각들
  ▔▔▔▔▔▔▔▔
`}</pre>
        </A_SidePanel>
      }>
      
      <h2>archive()</h2>

      <div style={{
        display: "grid", gap: 18,
        paddingLeft: 22,
        borderLeft: "1px solid var(--a-line)"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between",
          alignItems: "baseline", gap: 16, flexWrap: "wrap" }}>
          <div>
            <div style={{
              fontFamily: "'JetBrains Mono', 'Pretendard', ui-monospace, monospace",
              fontSize: 24, fontWeight: 500, letterSpacing: "-.01em"
            }}>{e.title}</div>
            <div style={{ color: "var(--a-mute)", marginTop: 4, fontSize: 14 }}>
              {e.subtitle}
            </div>
          </div>
          <div className="meta">2023 / matter.js</div>
        </div>

        <p style={{ margin: 0, fontSize: 14, lineHeight: 1.7,
          color: "var(--a-mute)", maxWidth: "62ch",
          fontFamily: "'Source Serif 4', 'Noto Serif KR', Georgia, serif",
          fontStyle: "italic"
        }}>
          {e.note}
        </p>

        <div className="meta" style={{ marginTop: 6 }}>// included_works</div>
        <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
          {e.items.map((p, i) =>
          <li key={i} style={{
            display: "grid", gridTemplateColumns: "44px 200px 1fr",
            gap: 16, padding: "10px 0",
            borderTop: "1px dashed var(--a-line)",
            borderBottom: i === e.items.length - 1 ? "1px dashed var(--a-line)" : 0,
            fontSize: 13.5
          }}>
              <span style={{ color: "var(--a-mute)",
              fontFamily: "'JetBrains Mono', 'Pretendard', ui-monospace, monospace" }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <span style={{ fontWeight: 600 }}>{p.name}</span>
              <span style={{ color: "var(--a-mute)" }}>{p.note}</span>
            </li>
          )}
        </ul>
      </div>
    </A_Frame>);

}

/* ===================================================================== */
/* CONTACT                                                                */
/* ===================================================================== */
function A_Contact({ data }) {
  return (
    <A_Frame
      no="05"
      label="contact.send()"
      ticks={["// status", "// scope", "// reply"]}
      side={
      <A_SidePanel
        label="// envelope"
        footnotes={[
        { h: "응답 시간", d: "보통 24시간 이내" },
        { h: "작업 범위", d: "UI 엔진 · 접근성 · 시스템 설계" }]
        }>
        
          <pre className="ascii" style={{ margin: 0, fontSize: 11 }}>{`
   _________________
  |\\               /|
  | \\             / |
  |  \\___________/  |
  |   to: you       |
  |_________________|
`}</pre>
        </A_SidePanel>
      }>
      
      <h2>contact.send()</h2>
      <p style={{ fontSize: 16, color: "var(--a-mute)", margin: 0, maxWidth: "60ch" }}>
        대규모 그리드, 접근성, 자율 에이전트 — 함께 풀어보고 싶은 문제가 있다면 언제든 연락 주세요.
      </p>
      <dl style={{ margin: 0 }}>
        <div className="a-row2"><dt>email</dt><dd><b>{data.contact.email}</b></dd></div>
        <div className="a-row2"><dt>phone</dt><dd><b>{data.contact.phone}</b></dd></div>
        <div className="a-row2"><dt>github</dt><dd><b><a href="https://github.com/utfw" target="_blank">{data.contact.github}</a></b></dd></div>
        <div className="a-row2"><dt>location</dt><dd>{data.contact.location}</dd></div>
      </dl>

      <pre className="ascii" style={{ marginTop: 4 }}>{`
  > thanks for reading_
`}</pre>
    </A_Frame>);

}

window.DirectionA = DirectionA;