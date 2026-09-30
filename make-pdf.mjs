// 포트폴리오 PDF 생성기
// data.jsx + variants.jsx를 읽어 A4 인쇄용 정적 HTML을 만들고 Playwright로 PDF를 출력합니다.
//   node make-pdf.mjs                → dist/portfolio-agent.pdf (기본)
//   node make-pdf.mjs frontend       → dist/portfolio-frontend.pdf
//   node make-pdf.mjs all            → 두 버전 모두
// 사이트(direction-c2.jsx)와 동일한 색감/타이포를 사용하되, 인쇄용 단일 흐름 레이아웃으로 재구성합니다.
import { chromium } from 'playwright';
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dir = dirname(fileURLToPath(import.meta.url));

// --- data.jsx 로드 (ESM이 아닌 jsx지만 export default 객체를 그대로 평가) ---
async function loadData() {
  const src = readFileSync(resolve(__dir, 'src/2026/data.jsx'), 'utf8');
  // `const data = {...}; export default data` → 객체만 추출해 평가
  const body = src
    .replace(/^\s*\/\/.*$/gm, '')          // 줄 주석 제거
    .replace(/export\s+default\s+data\s*;?/m, '')
    .replace(/const\s+data\s*=\s*/, 'return ');
  // eslint-disable-next-line no-new-func
  const fn = new Function(body + '\n');
  return fn();
}

// --- variants.jsx 로드 (VARIANTS 객체만 평가) ---
async function loadVariants() {
  const src = readFileSync(resolve(__dir, 'src/2026/variants.jsx'), 'utf8');
  const m = src.match(/export const VARIANTS\s*=\s*(\{[\s\S]*?\n\};)/);
  if (!m) throw new Error('variants.jsx에서 VARIANTS를 찾지 못했습니다.');
  // eslint-disable-next-line no-new-func
  return new Function('return ' + m[1].replace(/;$/, '') + '\n')();
}

const esc = (s = '') => String(s).replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));

function buildHTML(data, v) {
  // 사이트와 동일한 뉴트럴 팔레트
  const accent = '#1257c7';
  const vars = `
    --x-bg:#ffffff; --x-bg-2:#f6f7f8; --x-ink:#14171a; --x-ink-2:#3d4348;
    --x-mute:#6b7280; --x-soft:#9ca3af; --x-line:#e3e6e9; --x-line-2:#eef0f2;
    --x-accent:${accent};
    --x-sans:'Noto Sans KR','Noto Sans',system-ui,sans-serif;`;

  // variant의 caseOrder대로 정렬 (사이트와 동일한 규칙)
  const order = v.caseOrder || [];
  const rank = (c) => {
    const i = order.indexOf(c.id);
    return i === -1 ? order.length + Number(c.number) : i;
  };
  // 표시 번호는 variant 순서에 맞춰 다시 매깁니다 (data의 number는 고정값이라 순서와 어긋남).
  const cases = [...data.caseStudies]
    .sort((a, b) => rank(a) - rank(b))
    .map((c, i) => ({ ...c, number: String(i + 1).padStart(2, '0') }));

  const sectionH = (t) => `<div class="x-section-h">${esc(t)}</div>`;

  // ---- 목차 항목 (커버 하단에 함께 배치) ----
  const tocItems = [
    { no: '01', t: 'About', sub: 'Introduction · Skills · Experience' },
    { no: '02', t: 'Selected Work', sub: cases.map((c) => c.title).join(' · ') },
    ...cases.map((c) => ({ no: c.number, t: c.title, sub: c.subtitle, indent: true })),
    { no: '03', t: 'Contact', sub: data.contact.email },
  ];

  // ---- COVER (타이틀 상단 + 목차 하단, 한 페이지) ----
  const cover = `
  <section class="cover">
    <div class="cover-top">
      <div class="x-eyebrow"><span class="bar"></span><b>PORTFOLIO</b> &nbsp;·&nbsp; 2026</div>
      <h1 class="x-h1 cover-name">${esc(data.nameEn)}</h1>
      <div class="cover-role">${esc(v.role)}</div>
      <div class="cover-contact">
        <span>${esc(data.contact.email)}</span><span class="sep">·</span>
        <a href="https://${esc(data.contact.github)}">${esc(data.contact.github)}</a>
      </div>
    </div>

    <div class="cover-toc contents">
      <div class="x-section-h">Contents</div>
      <div class="toc">${tocItems.map((it) => `
        <div class="toc-row${it.indent ? ' indent' : ''}">
          <span class="toc-no">${esc(it.no)}</span>
          <span class="toc-t">${esc(it.t)}</span>
          <span class="toc-sub muted">${esc(it.sub)}</span>
        </div>`).join('')}</div>
    </div>
  </section>`;

  // ---- ABOUT ----
  const skillOrder = v.skillOrder || [];
  const skills = Object.entries(data.skills).sort((a, b) => {
    const ia = skillOrder.indexOf(a[0]), ib = skillOrder.indexOf(b[0]);
    return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
  }).map(([k, vs]) => `
    <div class="skill-row">
      <div class="skill-k">${esc(k)}</div>
      <div class="skill-tags">${vs.map((v) => `<span class="tag">${esc(v)}</span>`).join('')}</div>
    </div>`).join('');

  const timeline = data.experience.timeline.map((t) => `
    <div class="tl-row${t.now ? ' now' : ''}">
      <div class="tl-date">${esc(t.date)}</div>
      <div class="tl-desc">${esc(t.desc)}</div>
    </div>`).join('');

  const edu = data.education.map((e) => `
    <div class="edu-row">
      <div class="edu-period muted">${esc(e.period)}</div>
      <div><b>${esc(e.school)}</b> <span class="muted">${esc(e.detail)}</span></div>
    </div>`).join('');

  const about = `
  <section class="block about-block">
    <div class="lead">
      <div class="x-eyebrow"><span class="bar"></span><b>01</b> &nbsp; ABOUT</div>
      <h2 class="x-h2">Introduction</h2>
      ${v.intro.map((p) => `<p class="body">${esc(p)}</p>`).join('')}
    </div>

    <div class="sub">
      ${sectionH('Skills')}
      <div class="skills">${skills}</div>
    </div>

    <div class="sub exp-start">
      ${sectionH('Experience')}
      <div class="exp-head"><b>${esc(data.experience.company)}</b> · ${esc(data.experience.role)} <span class="muted">${esc(data.experience.period)}</span></div>
      <div class="timeline">${timeline}</div>
    </div>

    <div class="sub">
      ${sectionH('Education')}
      <div class="edu">${edu}</div>
    </div>
  </section>`;

  // ---- WORK INTRO — 별도 표지 없이 첫 케이스 위에 섹션 머리로 얹는다.
  // 목차는 커버 하단에 있고 각 케이스가 스스로 설명하므로 리드 문단은 두지 않는다.
  const workLead = `
    <div class="lead work-lead">
      <div class="x-eyebrow"><span class="bar"></span><b>02</b> &nbsp; WORK</div>
      <h2 class="x-h2">Selected Work</h2>
    </div>`;

  // ---- WORK (case studies) ----
  // 각 케이스는 새 페이지에서 시작하지만, 내부는 '문서'처럼 자연스럽게 흐른다.
  // 섹션 제목+첫 내용은 .sub로 묶어 페이지 끝에서 고아로 잘리지 않게 한다.
  const sub = (inner, extra = '') => `<div class="sub${extra ? ' ' + extra : ''}">${inner}</div>`;
  // 목록형 섹션(Solution/Failure/Lessons)은 한 페이지를 넘길 수 있으므로 통째로 avoid하지 않는다.
  // 대신 개별 항목만 쪼개지지 않게 하고, 제목은 첫 항목과 붙여 둔다(.x-section-h{break-after:avoid}).
  const subFlow = (inner, extra = '') => `<div class="sub sub--flow${extra ? ' ' + extra : ''}">${inner}</div>`;

  const renderCase = (c, leadHtml = '') => {
    const blocks = [];
    if (leadHtml) blocks.push(leadHtml);
    blocks.push(`
      <div class="case-head">
        <div class="case-no">${esc(c.number)}</div>
        <div>
          <div class="case-title">${esc(c.title)}</div>
          <div class="case-sub">${esc(c.subtitle)}</div>
          <div class="case-meta"><span class="case-tag">${esc(c.tag)}</span><span class="muted">${esc(c.period)}</span>${c.link ? `<a class="case-link" href="https://${esc(c.link)}">↗ ${esc(c.link)}</a>` : ''}</div>
        </div>
      </div>`);

    if (c.problem) blocks.push(sub(`${sectionH('Problem')}<p class="body">${esc(c.problem)}</p>`));
    if (c.challenge) blocks.push(sub(`${sectionH('Challenge')}<p class="body">${esc(c.challenge)}</p>`));

    if (c.solution) {
      // 기본은 1열(문서처럼 읽힌다). 항목이 많은 케이스만 2열로 접어 한 페이지에 담는다.
      const dense = c.solution.length >= 7;
      blocks.push(subFlow(`${sectionH('Solution')}<div class="sol-grid ${dense ? 'sol-grid--two' : 'sol-grid--single'}">${c.solution.map((s) => `
        <div class="sol-item"><div class="sol-h">${esc(s.h)}</div><div class="sol-d">${esc(s.d)}</div></div>`).join('')}</div>`));
    }

    if (c.pipeline) {
      blocks.push(sub(`${sectionH('Architecture')}<div class="pipe">${c.pipeline.map((p) => `
        <div class="pipe-stage">
          <div class="pipe-name">${esc(p.stage)}</div>
          <div class="pipe-tool">${esc(p.tool)}</div>
          <div class="pipe-role muted">${esc(p.role)}</div>
          <div class="pipe-out">→ ${esc(p.out)}</div>
        </div>`).join('')}</div>${c.pipelineNote ? `<p class="note">${esc(c.pipelineNote)}</p>` : ''}`));
    }

    if (c.evolution) {
      blocks.push(subFlow(`${sectionH('Architecture Evolution')}<div class="evo">${c.evolution.map((e) => `
        <div class="evo-item"><div class="evo-phase">${esc(e.phase)}</div><div class="evo-title">${esc(e.title)}</div><div class="sol-d">${esc(e.body)}</div></div>`).join('')}</div>`));
    }

    if (c.failureCases) {
      blocks.push(subFlow(`${sectionH('Failure Cases')}<div class="fail">${c.failureCases.map((f) => `
        <div class="fail-item"><div class="fail-type">${esc(f.type)}</div><div class="fail-title">${esc(f.title)}</div><div class="sol-d">${esc(f.body)}</div></div>`).join('')}</div>`));
    }

    if (c.lessonsLearned) {
      blocks.push(subFlow(`${sectionH('Lessons Learned')}<div class="lessons">${c.lessonsLearned.map((l) => `
        <div class="lesson-item"><span class="lesson-n">${esc(l.n)}</span><div><div class="lesson-h">${esc(l.h)}</div><div class="sol-d">${esc(l.d)}</div></div></div>`).join('')}</div>`, 'sub--gap'));
    } else if (c.lessons) {
      blocks.push(sub(`${sectionH('Lessons Learned')}<p class="body">${esc(c.lessons)}</p>`, 'sub--gap'));
    }

    if (c.stack) blocks.push(`<div class="stack">${c.stack.map((s) => `<span class="tag">${esc(s)}</span>`).join('')}</div>`);

    const metrics = c.results || c.metrics;
    if (metrics) {
      blocks.push(sub(`${sectionH('Results')}<div class="metrics">${metrics.map((m) => `
        <div class="metric"><div class="metric-v">${esc(m.v)}</div><div class="metric-k muted">${esc(m.k)}</div></div>`).join('')}</div>`, 'sub--gap'));
    }

    // 섹션이 5개를 넘는 긴 케이스는 간격을 좁혀 페이지 끝에 몇 줄만 넘치는 것을 막는다.
    const long = blocks.length > 6 ? ' case--long' : '';
    return `<section class="block case${long}">${blocks.join('\n')}</section>`;
  };

  // 각 프로젝트는 새 페이지에서 시작 — 프로젝트 간 구분과 여백을 일관되게 확보.
  // 첫 프로젝트(Bada) 위엔 Work 도입부를 얹는다.
  const work = cases.map((c, i) => renderCase(c, i === 0 ? workLead : '')).join('\n');

  // ---- CONTACT ----
  // phone은 보안 원칙상 data.jsx/커밋에 두지 않고, PDF 생성 시 환경변수로만 주입한다.
  //   예) PHONE="010-0000-0000" node make-pdf.mjs
  const phone = process.env.PHONE && process.env.PHONE.trim();
  const githubUrl = `https://${data.contact.github}`;
  const contactItems = [
    { label: 'EMAIL', value: `<a href="mailto:${esc(data.contact.email)}">${esc(data.contact.email)}</a>` },
    { label: 'GITHUB', value: `<a href="${esc(githubUrl)}">${esc(data.contact.github)}</a>` },
    ...(phone ? [{ label: 'PHONE', value: esc(phone) }] : []),
  ];
  // Contact는 3줄뿐이라 새 페이지를 강제하면 페이지 대부분이 빈다.
  // 앞 케이스 뒤에 이어 붙이되, 잘리지만 않게 한다(자리가 없으면 자연히 다음 장으로).
  const contact = `
  <section class="block contact-block">
    <div class="x-eyebrow"><span class="bar"></span><b>03</b> &nbsp; CONTACT</div>
    <h2 class="x-h2">Contact</h2>
    <div class="contact-list">
      ${contactItems.map((it) => `
      <div class="c-row"><div class="c-label">${it.label}</div><div class="c-value">${it.value}</div></div>`).join('')}
    </div>
  </section>`;

  return `<!doctype html><html lang="ko"><head><meta charset="utf-8">
  <style>
  @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;600;700&display=swap');
  :root{${vars}}
  *{margin:0;padding:0;box-sizing:border-box;}
  /* 문서: 모든 페이지에 일정한 여백 — 좌우/상하 margin은 page.pdf()에서 지정.
     (displayHeaderFooter와 함께 쓰려고 CSS @page margin은 비운다) */
  @page{ size:A4; }
  html,body{ background:var(--x-bg); color:var(--x-ink); font-family:var(--x-sans);
    font-size:13px; line-height:1.7; letter-spacing:-.003em; -webkit-font-smoothing:antialiased; }

  /* 흐름 단위. 강제 페이지 분할 없음 — 콘텐츠가 자연스럽게 이어진다. */
  /* 페이지를 강제로 나누지 않으므로, 섹션 구분은 여백이 대신한다.
     대분류(About → Work → Contact)와 케이스 사이는 충분히 벌린다. */
  .block{ margin-bottom:30px; }
  .block:last-child{ margin-bottom:0; }
  /* About·Work·Contact 세 대분류는 같은 형태(굵은 선 + 여백)로 시작한다. */
  .about-block{ margin-bottom:72px; padding-top:36px; border-top:2px solid var(--x-ink); }
  .case + .case{ margin-top:56px; }
  /* 케이스가 페이지 맨 위에서 시작할 땐 위 여백이 낭비이므로 줄인다. */
  .case{ break-inside:auto; }
  /* 케이스·후반 섹션은 새 페이지에서 시작 (독립 단위) */
  .break-before{ break-before:page; page-break-before:always; }
  /* Contact는 통째로 유지하되 페이지를 강제하지 않는다 + 앞 케이스와 시각적으로 분리 */
  /* Contact도 About·Work와 같은 대분류이므로 구분 여백·굵기를 맞춘다. */
  .contact-block{ break-inside:avoid; margin-top:72px; padding-top:36px; border-top:2px solid var(--x-ink); }
  /* 섹션 제목+첫 내용 묶음: 페이지 끝에서 고아로 잘리지 않게 */
  .sub{ margin-top:20px; break-inside:avoid; }
  /* About은 4개 블록이 한 페이지에 20px쯤 모자라, 마지막 Education만 다음 장으로
     밀리며 3페이지가 거의 비었다. 줄여서 욱여넣는 대신 Experience 앞에서 페이지를
     넘겨, 2페이지(Introduction+Skills)와 3페이지(Experience+Education)가
     각각 내용으로 차게 한다. */
  .about-block > .sub.exp-start{ break-before:page; margin-top:0; }
  /* 단, 섹션의 '마지막' 블록까지 통째로 avoid하면 그 블록만 다음 장으로 튕겨
     앞 페이지가 거의 비어 버린다(Education·Results 고아 페이지).
     마지막 블록은 쪼개짐을 허용하고, 내부 항목만 온전히 지킨다. */
  .block > .sub:last-child{ break-inside:auto; }
  .block > .sub:last-child > *{ break-inside:avoid; }
  .edu-row, .c-row{ break-inside:avoid; }
  /* 목록형 섹션은 페이지를 넘겨 이어진다 — 통째로 avoid하면 앞 페이지에 큰 여백이 남는다.
     쪼개짐 방지는 개별 항목(.sol-item 등)에서 처리한다. */
  .sub--flow{ break-inside:auto; }
  /* Lessons Learned · Results — 이전 섹션과 좀 더 떼어 놓는다 */
  .sub--gap{ margin-top:26px; }
  /* 섹션이 많은 케이스(Bada)는 간격을 조금 좁혀 마지막 페이지에 몇 줄만 넘어가는 것을 막는다. */
  .case--long .sub{ margin-top:11px; }
  .case--long .sub--gap{ margin-top:14px; }
  .case--long .case-head{ margin-bottom:12px; }
  .case--long .fail{ gap:11px 20px; }
  .case--long .lessons{ gap:8px 20px; }
  .lead{ break-inside:avoid; }
  h2,.x-h2,.x-section-h{ break-after:avoid; }

  .muted{ color:var(--x-mute); }
  .body{ color:var(--x-ink-2); margin:0 0 14px; max-width:46em; }
  .note{ color:var(--x-mute); font-size:12px; margin:10px 0 4px; max-width:46em; }

  .x-eyebrow{ font-size:10.5px; letter-spacing:.24em; text-transform:uppercase;
    color:var(--x-mute); font-weight:500; margin-bottom:18px; display:flex; align-items:center; gap:12px; }
  .x-eyebrow b{ color:var(--x-accent); font-weight:600; letter-spacing:.12em; }
  .x-eyebrow .bar{ flex:0 0 26px; height:1px; background:var(--x-accent); opacity:.6; }
  .x-h1{ font-weight:600; font-size:42px; line-height:1.14; letter-spacing:-.03em; margin:0 0 18px; }
  .x-h2{ font-weight:600; font-size:27px; line-height:1.22; letter-spacing:-.026em; margin:0 0 18px; }
  /* 대분류 타이틀(Introduction·Selected Work·Contact)은 본문과 더 떼어 놓는다. */
  .about-block > .lead .x-h2,
  .work-lead .x-h2,
  .contact-block .x-h2{ margin-bottom:30px; }
  .contact-block .x-h2{ font-size:22px; }
  .x-lede{ font-size:15px; line-height:1.62; color:var(--x-ink-2); margin:0 0 22px; max-width:40em; }
  .x-section-h{ font-size:10.5px; letter-spacing:.22em; text-transform:uppercase; color:var(--x-mute);
    font-weight:600; margin:0 0 12px; }

  /* COVER — 타이틀 상단 + 목차 하단, 한 페이지 (콘텐츠 영역 = 297-18-16mm) */
  /* min-height로 이미 한 페이지를 채우므로 break-after까지 두면
     뒤따르는 .break-before와 겹쳐 페이지가 하나 더 밀린다. */
  .cover{ display:flex; flex-direction:column; min-height:263mm; }
  .cover-top{ padding-top:96px; }   /* 상단 여백 — 타이틀을 화면 위쪽 1/3 지점에 */
  .cover-name{ font-size:56px; margin-bottom:10px; }
  .cover-role{ font-size:18px; color:var(--x-accent); font-weight:500; margin-bottom:20px; letter-spacing:-.01em; }
  .cover-contact{ font-size:13px; color:var(--x-mute); display:flex; gap:10px; flex-wrap:wrap; }
  .cover-contact .sep{ color:var(--x-soft); }
  .cover-contact a{ color:inherit; text-decoration:none; }
  .cover-toc{ margin-top:64px; }
  .cover-toc .x-section-h{ margin-bottom:14px; }

  /* SKILLS */
  .skills{ display:flex; flex-direction:column; gap:10px; }
  .skill-row{ display:grid; grid-template-columns:130px 1fr; gap:16px; align-items:baseline; }
  .skill-k{ font-weight:600; font-size:12.5px; }
  .skill-tags{ display:flex; flex-wrap:wrap; gap:6px; }
  .tag{ font-size:11.5px; padding:3px 10px; border:1px solid var(--x-line); border-radius:20px;
    color:var(--x-ink-2); }

  /* EXPERIENCE */
  .exp-head{ font-size:13px; margin-bottom:14px; }
  .timeline{ display:flex; flex-direction:column; gap:7px; margin-left:4px;
    border-left:1px solid var(--x-line); padding-left:22px; }
  .tl-row{ display:grid; grid-template-columns:64px 1fr; gap:14px; position:relative; }
  .tl-row::before{ content:''; position:absolute; left:-26px; top:7px; width:9px; height:9px;
    border-radius:50%; background:var(--x-soft); box-shadow:0 0 0 3px var(--x-bg); }
  .tl-row.now::before{ background:var(--x-accent); }
  .tl-date{ color:var(--x-mute); font-size:12px; }
  .tl-desc{ color:var(--x-ink-2); }

  /* EDU */
  .edu{ display:flex; flex-direction:column; gap:8px; }
  .edu-row{ display:grid; grid-template-columns:128px 1fr; gap:14px; font-size:12.5px; align-items:baseline; }
  .edu-period{ font-size:12px; }

  /* PHILOSOPHY */
  .kw{ display:flex; flex-wrap:wrap; gap:8px; margin-top:18px; }
  .kw-chip{ font-size:12px; padding:6px 14px; border:1px solid var(--x-accent); color:var(--x-accent);
    border-radius:4px; letter-spacing:.02em; }

  /* WORK TOC (Selected Work 내부 목록) */
  .work-toc{ margin-top:24px; display:flex; flex-direction:column; }
  .toc-row{ display:grid; grid-template-columns:42px 150px 1fr; gap:14px; align-items:baseline;
    padding:12px 0; border-top:1px solid var(--x-line); }
  .toc-no{ color:var(--x-accent); font-weight:600; }
  .toc-t{ font-weight:600; font-size:14px; }
  .toc-sub{ font-size:12px; }

  /* CONTENTS (커버 하단 목차) */
  /* 각 행이 border-top만 가지면 목록이 닫히지 않아 허전하다 — 마지막에 아래선을 둔다. */
  .toc{ display:flex; flex-direction:column; border-bottom:1px solid var(--x-line); }
  .contents .toc-row{ grid-template-columns:22px 1fr; gap:7px; padding:9px 0;
    align-items:baseline; border-top:1px solid var(--x-line); }
  .contents .toc-t{ font-size:15px; }
  .contents .toc-sub{ grid-column:2; font-size:11.5px; margin-top:-1px; line-height:1.35; }
  .contents .toc-row.indent{ padding:6px 0 6px 26px; border-top:1px solid var(--x-line-2); }
  .contents .toc-row.indent .toc-no{ color:var(--x-soft); font-weight:500; font-size:11.5px; }
  .contents .toc-row.indent .toc-t{ font-weight:500; font-size:13px; }

  /* WORK 도입부 — 첫 프로젝트 위에 얹히고, 아래로 충분한 여백을 둔다. */
  /* Work 섹션 머리 — 앞의 About과 확실히 떨어뜨리고, 첫 케이스와도 간격을 준다. */
  .work-lead{ margin-top:24px; margin-bottom:44px; padding-top:36px; border-top:2px solid var(--x-ink); }

  /* CASE */
  .case-head{ display:grid; grid-template-columns:auto 1fr; gap:18px; align-items:start;
    padding-bottom:14px; border-bottom:1px solid var(--x-line); margin-bottom:4px; }
  .case-no{ font-size:34px; font-weight:700; color:var(--x-soft); line-height:1; letter-spacing:-.02em; }
  .case-title{ font-size:24px; font-weight:600; letter-spacing:-.02em; }
  .case-sub{ color:var(--x-ink-2); font-size:14px; margin-top:4px; max-width:42em; }
  .case-meta{ margin-top:10px; display:flex; gap:12px; align-items:center; font-size:12px; flex-wrap:wrap; }
  .case-tag{ color:var(--x-accent); font-weight:500; letter-spacing:.02em; }
  .case-link{ color:var(--x-accent); font-weight:500; text-decoration:underline;
    text-underline-offset:2px; }

  .sol-grid{ display:grid; grid-template-columns:1fr 1fr; gap:14px 20px; }
  .sol-grid--single{ grid-template-columns:1fr; gap:13px; }
  .sol-grid--two{ grid-template-columns:1fr 1fr; gap:12px 20px; align-items:start; }
  /* 2열은 한 줄이 짧아 행간을 조금 좁혀도 읽기 부담이 없다 */
  .sol-grid--two .sol-d{ font-size:12px; line-height:1.55; }
  .sol-item{ break-inside:avoid; }
  .sol-h{ font-weight:600; font-size:13px; margin-bottom:3px; }
  .sol-d{ color:var(--x-ink-2); font-size:12.5px; line-height:1.6; }

  .pipe{ display:grid; grid-template-columns:repeat(4,1fr); gap:10px; }
  .pipe-stage{ border:1px solid var(--x-line); border-radius:6px; padding:12px; break-inside:avoid; }
  .pipe-name{ font-weight:600; font-size:13px; }
  .pipe-tool{ font-size:11.5px; color:var(--x-accent); margin:2px 0 6px; }
  .pipe-role{ font-size:11.5px; }
  .pipe-out{ font-size:11px; color:var(--x-mute); margin-top:6px; }

  .evo{ display:grid; grid-template-columns:1fr 1fr; gap:16px; }
  .evo-item{ break-inside:avoid; }
  .evo-phase{ font-size:11px; color:var(--x-accent); font-weight:600; letter-spacing:.06em; }
  .evo-title{ font-weight:600; font-size:14px; margin:2px 0 5px; }

  .fail{ display:grid; grid-template-columns:1fr 1fr; gap:14px 20px; }
  .fail-item{ break-inside:avoid; border-left:2px solid var(--x-line); padding-left:12px; }
  .fail-type{ font-size:10.5px; letter-spacing:.1em; color:var(--x-accent); font-weight:600; }
  .fail-title{ font-weight:600; font-size:13px; margin:1px 0 4px; }

  /* 항목이 한 줄짜리라 2단으로 두면 페이지를 훨씬 촘촘하게 채운다. */
  .lessons{ display:grid; grid-template-columns:1fr 1fr; gap:10px 20px; align-items:start; }
  .lesson-item{ display:grid; grid-template-columns:auto 1fr; gap:14px; align-items:start; break-inside:avoid; }
  .lesson-n{ font-size:13px; font-weight:700; color:var(--x-soft); }
  .lesson-h{ font-weight:600; font-size:13px; }

  .stack{ display:flex; flex-wrap:wrap; gap:6px; margin-top:14px; }

  /* Results — 카드 형태(연한 배경 + 테두리)로 구분 */
  .metrics{ display:flex; flex-wrap:wrap; gap:12px; }
  .metric{ flex:1 1 0; min-width:120px; padding:11px 15px;
    border:1px solid var(--x-line); border-radius:8px; background:#faf9f7; }
  .metric-v{ font-size:18px; font-weight:600; letter-spacing:-.02em; }
  .metric-k{ font-size:11.5px; margin-top:2px; }

  /* CONTACT — 다른 섹션과 동일하게 좌측 상단부터, 연락처는 세로 배열 */
  .contact-list{ display:flex; flex-direction:column; margin-top:6px; }
  .c-row{ display:grid; grid-template-columns:120px 1fr; gap:16px; align-items:baseline;
    padding:12px 0; border-top:1px solid var(--x-line); }
  .c-label{ font-size:11px; letter-spacing:.14em; color:var(--x-mute); font-weight:500; text-transform:uppercase; }
  .c-value{ font-size:14px; font-weight:600; color:var(--x-ink); }
  .c-value a{ color:inherit; text-decoration:none; }
  </style></head>
  <body>${cover}${about}${work}${contact}</body></html>`;
}

const data = await loadData();
const VARIANTS = await loadVariants();

const arg = (process.argv[2] || 'agent').toLowerCase();
const targets = arg === 'all' ? Object.keys(VARIANTS) : [VARIANTS[arg] ? arg : 'agent'];

const browser = await chromium.launch();

for (const key of targets) {
  const v = VARIANTS[key];
  const html = buildHTML(data, v);
  const htmlPath = resolve(__dir, `dist/portfolio-print-${key}.html`);
  writeFileSync(htmlPath, html);

  const page = await browser.newPage();
  await page.goto('file://' + htmlPath, { waitUntil: 'networkidle' });
  await page.waitForTimeout(800); // 웹폰트 로드 대기
  const outPath = resolve(__dir, `dist/portfolio-${key}.pdf`);

  // 모든 페이지 하단에 규칙적인 구분선(+ 페이지 번호). 좌우 17mm 콘텐츠 폭에 맞춘다.
  const footer = `
    <div style="width:100%; font-family:'Noto Sans KR',sans-serif; -webkit-print-color-adjust:exact;">
      <div style="margin:0 17mm; border-top:1px solid #e3e6e9; padding-top:4px;
                  display:flex; justify-content:space-between;
                  font-size:7px; letter-spacing:.08em; color:#9ca3af;">
        <span>HWAN CHOI · ${esc(v.role).toUpperCase()} · PORTFOLIO 2026</span>
        <span class="pageNumber"></span>
      </div>
    </div>`;

  await page.pdf({
    path: outPath,
    format: 'A4',
    printBackground: true,
    displayHeaderFooter: true,
    headerTemplate: '<span></span>',
    footerTemplate: footer,
    margin: { top: '18mm', bottom: '16mm', left: '17mm', right: '17mm' },
  });
  await page.close();
  console.log('PDF written:', outPath);
}

await browser.close();
