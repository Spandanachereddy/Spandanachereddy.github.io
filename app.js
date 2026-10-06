'use strict';
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
if (!reducedMotion.matches && 'IntersectionObserver' in window) {
  document.documentElement.classList.add('js-motion');
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
  }), { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}
const progress = document.querySelector('.reading-progress');
function updateProgress() { const height = document.documentElement.scrollHeight - innerHeight; progress.style.width = `${height > 0 ? scrollY / height * 100 : 0}%`; }
addEventListener('scroll', updateProgress, { passive: true }); addEventListener('resize', updateProgress); updateProgress();
const menu = document.querySelector('.menu-toggle'), mobileNav = document.querySelector('#mobile-nav');
menu.addEventListener('click', () => { const open = menu.getAttribute('aria-expanded') !== 'true'; menu.setAttribute('aria-expanded', String(open)); menu.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation'); mobileNav.hidden = !open; });
mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => { menu.setAttribute('aria-expanded', 'false'); menu.setAttribute('aria-label', 'Open navigation'); mobileNav.hidden = true; }));
addEventListener('keydown', e => { if (e.key === 'Escape' && !mobileNav.hidden) { mobileNav.hidden = true; menu.setAttribute('aria-expanded', 'false'); menu.setAttribute('aria-label', 'Open navigation'); menu.focus(); } });
document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('[data-filter]').forEach(b => { b.classList.toggle('active', b === button); b.setAttribute('aria-pressed', String(b === button)); });
  document.querySelectorAll('[data-category]').forEach(card => { card.hidden = button.dataset.filter !== 'all' && card.dataset.category !== button.dataset.filter; if (!card.hidden) card.classList.add('visible'); });
}));
const projects = {
  biology: { category: 'SCIENTIFIC AI / COMPUTATIONAL BIOLOGY', title: 'Learning the language of biology', description: 'At the University of Guelph, my research explores how foundation models and interpretable deep learning can reveal useful patterns in biological sequence data.', details: [['Research focus', 'Biological sequence understanding, genomic classification across organisms, and antimicrobial peptide discovery.'], ['Methods', 'Transformers, CNNs, BiLSTMs, and GRUs, supported by reproducible Python/PyTorch pipelines integrating sequence datasets, metadata, and scientific knowledge.'], ['Related work', 'ALERT: ADML — Antimicrobial Learning Exploration & Research for Targets. Under review at Computers in Biology and Medicine (2026).']] },
  thought: { category: 'LANGUAGE MODELS / INTERPRETABILITY', title: 'What happens inside deep thought?', description: 'Measuring Deep Thought in LLMs Through Hidden State Analysis examines the internal representations of language models to investigate reasoning behavior.', details: [['Research focus', 'Hidden-state analysis, representation behavior, and internal model dynamics.'], ['Publication', 'ICPRAI 2026.'], ['Collaborators', 'Nicholas Vinden, Kayla Kopel, Kamal Aslam, Gurjit S. Randhawa, Paul Sheridan, and Aitazaz A. Farooque.']] },
  systems: { category: 'SOFTWARE ENGINEERING / BIODIVERSITY', title: 'Infrastructure behind discovery', description: 'As a Software Engineer at the Centre for Biodiversity Genomics, I develop services and workflows that support scientific data management and downstream research.', details: [['Systems', 'A Python/FastAPI microservice for DOI generation, metadata validation, and automated processing across large object repositories. Bioinformatics tools for AB1/SCF genomic trace files and metadata modelling.'], ['Reported impact', 'Approximately 40–60% improvement in data processing efficiency through batch metadata extraction, multi-file handling, and resumable uploads and downloads, as reported in my CV.'], ['Tools', 'Python, FastAPI, REST APIs, Docker, Git, and Linux.']], engineering: true },
  brain: { category: 'MULTIMODAL AI / NEUROSCIENCE', title: 'A connected view of brain health', description: 'During my DAAD research fellowship at Forschungszentrum Jülich, I explored computational methods for multimodal biomedical data and scientific AI at INM-4.', details: [['Research focus', 'Machine learning, computational neuroscience, graph neural networks, foundation models, and reproducible analysis pipelines.'], ['Related manuscripts', 'AI-Driven Analysis of Brain Metabolite Networks in Major Depressive Disorder; Graph-Based Multimodal Metabolomics for Precision Psychiatry; Graph Neural Networks for Metabolite Network Learning in Neuropsychiatric Disorders.'], ['Status', 'These related manuscripts are in preparation (2026).']] }
};
const dialog = document.querySelector('#project-dialog'); dialog.setAttribute('aria-labelledby', 'dialog-title');
document.querySelectorAll('[data-project]').forEach(button => button.addEventListener('click', () => {
  const project = projects[button.dataset.project];
  document.querySelector('#dialog-category').textContent = project.category;
  document.querySelector('#dialog-title').textContent = project.title;
  document.querySelector('#dialog-description').textContent = project.description;
  const details = document.querySelector('#dialog-details'); details.replaceChildren();
  project.details.forEach(([heading, body]) => { const h = document.createElement('h3'), p = document.createElement('p'); h.textContent = heading; p.textContent = body; details.append(h, p); });
  const link = document.querySelector('#dialog-link'); link.href = project.engineering ? 'mailto:cheredds@uoguelph.ca' : 'https://scholar.google.com/citations?user=daUilisAAAAJ&hl=en'; link.textContent = project.engineering ? 'Let’s talk engineering ↗' : 'View research on Scholar ↗';
  if (project.engineering) { link.removeAttribute('target'); } else { link.target = '_blank'; }
  dialog.showModal();
}));
document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', e => { const box = dialog.getBoundingClientRect(); if (e.clientX < box.left || e.clientX > box.right || e.clientY < box.top || e.clientY > box.bottom) dialog.close(); });
document.querySelector('#copy-email').addEventListener('click', async () => { const status = document.querySelector('#copy-status'); try { await navigator.clipboard.writeText('cheredds@uoguelph.ca'); status.textContent = 'Email copied!'; } catch { status.textContent = 'Email: cheredds@uoguelph.ca'; } setTimeout(() => { status.textContent = ''; }, 5000); });
document.querySelector('#year').textContent = new Date().getFullYear();
// A projected sequence helix: illustrative geometry, not experimental data.
const canvas = document.querySelector('#network'), ctx = canvas.getContext('2d');
if (ctx) {
  let width = 0, height = 0, angle = 0, frame = 0, manualPause = false, visible = true, pointer = 0;
  const motionButton = document.querySelector('#motion-toggle');
  function resize() { const rect = canvas.getBoundingClientRect(); width = rect.width; height = rect.height; const dpr = Math.min(devicePixelRatio || 1, 2); canvas.width = width * dpr; canvas.height = height * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); draw(); }
  function draw() {
    ctx.clearRect(0, 0, width, height);
    const points = [], steps = 44, radius = width * .25;
    for (let n = 0; n < steps; n++) { const t = n / (steps - 1), phase = t * Math.PI * 4 + angle + pointer;
      for (let strand = 0; strand < 2; strand++) { const a = phase + strand * Math.PI, depth = Math.sin(a); points.push({ x: width / 2 + Math.cos(a) * radius + Math.sin(t * Math.PI) * 12, y: height * .18 + t * height * .63 + depth * 17, depth, strand, n }); }
    }
    ctx.lineWidth = .6;
    for (let n = 0; n < steps; n++) { const a = points[n * 2], b = points[n * 2 + 1]; ctx.strokeStyle = 'rgba(201,239,178,.18)'; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); }
    for (let strand = 0; strand < 2; strand++) { for (let n = 1; n < steps; n++) { const a = points[(n - 1) * 2 + strand], b = points[n * 2 + strand]; ctx.strokeStyle = `rgba(201,239,178,${.22 + (b.depth + 1) * .22})`; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); } }
    points.sort((a,b) => a.depth - b.depth).forEach(p => { ctx.beginPath(); ctx.fillStyle = `rgba(201,239,178,${.25 + (p.depth + 1) * .32})`; ctx.arc(p.x, p.y, 1.8 + (p.depth + 1) * .85, 0, Math.PI * 2); ctx.fill(); });
    for (let n = 0; n < 26; n++) { const x = width * (.08 + ((n * .618) % .84)), y = height * (.16 + ((n * .381) % .68)); ctx.fillStyle = 'rgba(201,239,178,.13)'; ctx.beginPath(); ctx.arc(x, y, n % 3 ? 1 : 1.8, 0, 7); ctx.fill(); }
  }
  function tick() { frame = 0; if (manualPause || reducedMotion.matches || !visible || document.hidden) return; angle += .004; draw(); frame = requestAnimationFrame(tick); }
  function syncMotion() { if (frame) cancelAnimationFrame(frame); frame = 0; const paused = manualPause || reducedMotion.matches; document.body.classList.toggle('motion-paused', paused); motionButton.textContent = paused ? 'Play motion ▷' : 'Pause motion Ⅱ'; motionButton.setAttribute('aria-pressed', String(paused)); motionButton.setAttribute('aria-label', paused ? 'Play visual animation' : 'Pause visual animation'); motionButton.disabled = reducedMotion.matches; if (!paused && visible && !document.hidden) frame = requestAnimationFrame(tick); draw(); }
  motionButton.addEventListener('click', () => { manualPause = !manualPause; syncMotion(); });
  canvas.addEventListener('pointermove', e => { if (!manualPause && !reducedMotion.matches) { pointer = (e.offsetX / width - .5) * .3; } });
  canvas.addEventListener('pointerleave', () => { pointer = 0; });
  reducedMotion.addEventListener('change', syncMotion); document.addEventListener('visibilitychange', syncMotion);
  if ('IntersectionObserver' in window) new IntersectionObserver(entries => { visible = entries[0].isIntersecting; syncMotion(); }).observe(canvas);
  new ResizeObserver(resize).observe(canvas); resize(); syncMotion();
}
