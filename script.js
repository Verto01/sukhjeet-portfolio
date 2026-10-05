const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.site-nav');
const profileTrigger = document.querySelector('.profile-trigger');
const profileDialog = document.querySelector('#profile-dialog');
const profileClose = document.querySelector('.profile-close');

menuButton.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  navigation.classList.toggle('is-open', !isOpen);
});

navigation.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    menuButton.setAttribute('aria-expanded', 'false');
    navigation.classList.remove('is-open');
  });
});

const projectDeck = document.querySelector('[data-project-deck]');

if (projectDeck) {
  const projectData = [
    {
      filename: 'webhook.dispatcher.js',
      language: 'NODE.JS',
      lines: [
        'const webhook = {',
        '  retry: "exponential + jitter",',
        '  failed: "dead-letter queue",',
        '  delivery: "idempotent",',
        '  verify: "HMAC signature",',
        '  data: "MongoDB",',
        '  deploy: "AWS EC2"',
        '};',
      ],
      footer: 'RETRY WINDOW · SAFE DELIVERY',
      kicker: 'SYSTEM SKETCH / 01',
      caption: 'Reliable delivery by design',
      mark: 'ƒ(x)',
      visualTitle: 'retry strategy',
      visualDetail: 'exponential backoff',
      visual: '<svg viewBox="0 0 104 36" role="presentation"><path d="M6 31H98M8 29C28 29 39 27 53 22S77 12 95 4"/><circle cx="95" cy="4" r="2.8"/></svg>',
    },
    {
      filename: 'grocery.recommendations.js',
      language: 'AI · FULL STACK',
      lines: [
        'const groceryPlan = {',
        '  meals: "3-day plan",',
        '  suggest: "Gemini AI",',
        '  context: "order history",',
        '  cart: "smart grocery list",',
        '  insights: "spending dashboard",',
        '  auth: "JWT + MongoDB"',
        '};',
      ],
      footer: 'PLAN · RECOMMEND · TRACK',
      kicker: 'SYSTEM SKETCH / 02',
      caption: 'Plans shaped around the shopper',
      mark: 'AI →',
      visualTitle: 'recommendation flow',
      visualDetail: 'plan · suggest · shop',
      visual: '<svg viewBox="0 0 104 36" role="presentation"><path d="M14 18H33M29 14l5 4-5 4M58 18H77M73 14l5 4-5 4"/><circle cx="8" cy="18" r="6"/><circle cx="52" cy="18" r="6"/><circle cx="96" cy="18" r="6"/></svg>',
    },
    {
      filename: 'rb.constructions.portal.js',
      language: 'CLIENT PLATFORM',
      lines: [
        'const clientPortal = {',
        '  booking: "vehicle rentals",',
        '  catalog: "material inventory",',
        '  admin: "order tracking",',
        '  notify: "booking email",',
        '  api: "Express + MongoDB",',
        '  leads: "stored for follow-up"',
        '};',
      ],
      footer: 'BOOKING · INVENTORY · LEADS',
      kicker: 'SYSTEM SKETCH / 03',
      caption: 'A business workflow, brought online',
      mark: '↗',
      visualTitle: 'business workflow',
      visualDetail: 'book · track · notify',
      visual: '<svg viewBox="0 0 104 36" role="presentation"><path d="M15 18H32M28 14l5 4-5 4M59 18H76M72 14l5 4-5 4"/><rect x="1" y="8" width="14" height="20" rx="3"/><rect x="45" y="8" width="14" height="20" rx="3"/><rect x="89" y="8" width="14" height="20" rx="3"/></svg>',
    },
  ];

  const cardsRoot = projectDeck.querySelector('[data-deck-cards]');
  const techVisual = projectDeck.querySelector('[data-project-visual]');
  const projectKicker = projectDeck.querySelector('[data-project-kicker]');
  const projectCaption = projectDeck.querySelector('[data-project-caption]');
  const projectPosition = projectDeck.querySelector('[data-project-position]');
  let activeProject = 0;
  let isAdvancing = false;

  const escapeHTML = (value) => value.replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[character]);

  const highlightLine = (line) => line.split(/("(?:[^"\\]|\\.)*")|(\b(?:const|await|return)\b)|(\b[a-zA-Z_$][\w$]*(?=\s*:))|([{}()[\],.;=])/g)
    .filter((part) => part !== undefined && part !== '')
    .map((part) => {
      const safe = escapeHTML(part).replace(/ /g, '&nbsp;');
      if (/^"/.test(part)) return `<span class="code-green">${safe}</span>`;
      if (/^(const|await|return)$/.test(part)) return `<span class="code-muted">${safe}</span>`;
      if (/^[a-zA-Z_$][\w$]*$/.test(part) && /[a-zA-Z_$]/.test(part)) return `<span class="code-blue">${safe}</span>`;
      if (/^[{}()[\],.;=]$/.test(part)) return `<span class="code-punc">${safe}</span>`;
      return safe;
    }).join('');

  const renderCard = (project, index) => `
    <button class="code-window deck-card" type="button" data-deck-card data-project-index="${index}" aria-label="Show next project. Current project: ${escapeHTML(project.filename)}">
      <span class="window-top">
        <span class="window-dots" aria-hidden="true"><i></i><i></i><i></i></span>
        <span class="window-filename">${escapeHTML(project.filename)}</span>
        <span class="window-language">${escapeHTML(project.language)}</span>
        <span class="deck-arrow" aria-hidden="true">↗</span>
      </span>
      <span class="code-content">${project.lines.map((line, lineIndex) => `<span class="code-line"><span class="code-number">${String(lineIndex + 1).padStart(2, '0')}</span><span class="code-source">${highlightLine(line)}</span></span>`).join('')}</span>
      <span class="window-footer"><span class="status-dot" aria-hidden="true"></span>${escapeHTML(project.footer)}<span class="footer-cursor" aria-hidden="true">_</span></span>
    </button>`;

  const renderTechVisual = (project) => {
    techVisual.innerHTML = `<span class="math-symbol">${escapeHTML(project.mark)}</span><span class="math-copy"><b>${escapeHTML(project.visualTitle)}</b><small>${escapeHTML(project.visualDetail)}</small></span>${project.visual}`;
  };

  const updateDeck = () => {
    cardsRoot.querySelectorAll('[data-deck-card]').forEach((card, cardIndex) => {
      const depth = (cardIndex - activeProject + projectData.length) % projectData.length;
      card.dataset.depth = String(depth);
      card.classList.toggle('is-front', depth === 0);
      card.setAttribute('aria-hidden', String(depth !== 0));
      card.tabIndex = depth === 0 ? 0 : -1;
      card.disabled = depth !== 0 || isAdvancing;
    });
    const project = projectData[activeProject];
    projectKicker.textContent = project.kicker;
    projectCaption.textContent = project.caption;
    projectPosition.textContent = `${String(activeProject + 1).padStart(2, '0')} / 03`;
    renderTechVisual(project);
  };

  cardsRoot.innerHTML = projectData.map(renderCard).join('');
  updateDeck();

  cardsRoot.addEventListener('click', (event) => {
    const activeCard = event.target.closest('.deck-card.is-front');
    if (!activeCard || isAdvancing) return;
    isAdvancing = true;
    activeProject = (activeProject + 1) % projectData.length;
    updateDeck();
    const transitionDelay = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 340;
    window.setTimeout(() => {
      isAdvancing = false;
      updateDeck();
      cardsRoot.querySelector('.deck-card.is-front')?.focus({ preventScroll: true });
    }, transitionDelay);
  });
}

document.querySelector('#year').textContent = new Date().getFullYear();

profileTrigger.addEventListener('click', () => profileDialog.showModal());
profileClose.addEventListener('click', () => profileDialog.close());
profileDialog.addEventListener('click', (event) => {
  if (event.target === profileDialog) profileDialog.close();
});

document.querySelector('[data-copy-email]').addEventListener('click', async (event) => {
  const button = event.currentTarget;
  const originalLabel = button.textContent;
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText('sukhh2405@gmail.com');
    } else {
      const field = document.createElement('textarea');
      field.value = 'sukhh2405@gmail.com';
      field.style.position = 'fixed';
      field.style.opacity = '0';
      document.body.append(field);
      field.select();
      document.execCommand('copy');
      field.remove();
    }
    button.textContent = 'Copied';
  } catch {
    button.textContent = 'Select email';
  }
  window.setTimeout(() => { button.textContent = originalLabel; }, 1600);
});
