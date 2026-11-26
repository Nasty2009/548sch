(function () {
  'use strict';

  const script = document.currentScript;
  const assetRoot = script ? new URL('../', script.src) : new URL('/assets/', location.href);
  const logoUrl = new URL('img/school-logo.jpg', assetRoot).href;
  const sessionKey = 'school548-buk-session';
  const historyKey = 'school548-buk-history';
  const seenKey = 'school548-buk-seen';

  const copy = {
    ru: {
      launcher: 'Спроси у Бука',
      title: 'Бук!',
      subtitle: 'ИИ-ассистент школы',
      hello: 'Привет! 👋\nЯ — Бук, школьный ИИ-ассистент. Отвечаю по актуальным положениям школы. Чем помочь?',
      placeholder: 'Написать сообщение…',
      note: 'Не вводите персональные данные. Бук даёт справочные ответы; даты и условия сверяйте с положением.',
      peek: 'Спросите о поступлении, УИН, сроках и документах',
      error: 'Сейчас не удалось получить ответ. Повторите позже или откройте страницу поступления.',
      minimize: 'Свернуть помощника',
      close: 'Закрыть помощника',
      send: 'Отправить вопрос',
      questions: [
        'Прошу предоставить демоверсии', 'Когда будет УИН?', 'Как сменить программу поступления?', 'Сроки экзаменов',
        'Будут ли резервные дни для заболевших?', 'Когда заканчивается регистрация?', 'Можно ли посмотреть работу после проверки?', 'Не пришло письмо-подтверждение',
      ],
    },
    en: {
      launcher: 'Ask Buk', title: 'Buk!', subtitle: 'School AI assistant',
      hello: 'Hello! 👋\nI am Buk, the school AI assistant. I answer using the current school regulations. How can I help?',
      placeholder: 'Write a message…', note: 'Do not enter personal data. Buk provides reference information; verify dates and requirements in the official regulation.',
      peek: 'Ask about admissions, candidate IDs, deadlines and documents', error: 'I could not get an answer right now. Please try again or open the admissions page.',
      minimize: 'Minimise assistant', close: 'Close assistant', send: 'Send question',
      questions: ['Are sample entrance tests available?', 'When will I receive my candidate ID?', 'How can I change the selected programme?', 'When are the entrance assessments?', 'Are alternative dates available in case of illness?', 'When does registration close?', 'Can we review the marked entrance test?', 'I did not receive the registration email'],
    },
  };

  function getSessionId() {
    let value = localStorage.getItem(sessionKey);
    if (!value) {
      value = (crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`).slice(0, 80);
      localStorage.setItem(sessionKey, value);
    }
    return value;
  }

  function getHistory() {
    try {
      const value = JSON.parse(sessionStorage.getItem(historyKey) || '[]');
      return Array.isArray(value) ? value.slice(-12) : [];
    } catch (_) { return []; }
  }

  let history = getHistory();
  let language = document.documentElement.lang === 'en' ? 'en' : 'ru';
  let text = copy[language];

  const root = document.createElement('div');
  root.className = 'buk-root';
  root.innerHTML = `
    <div class="buk-peek" hidden></div>
    <section class="buk-panel" aria-label="Бук, ИИ-ассистент школы" aria-hidden="true" hidden>
      <div class="buk-panel__watermark" aria-hidden="true"></div>
      <header class="buk-header">
        <img class="buk-avatar" alt="" src="${logoUrl}">
        <div class="buk-header__title"><strong></strong><small></small></div>
        <button class="buk-icon-button" data-buk-minimize type="button">−</button>
        <button class="buk-icon-button" data-buk-close type="button">×</button>
      </header>
      <div class="buk-messages" aria-live="polite"></div>
      <div class="buk-quick" aria-label="Частые вопросы"></div>
      <form class="buk-form">
        <input maxlength="1000" autocomplete="off">
        <button class="buk-send" type="submit">↑</button>
      </form>
      <p class="buk-note"></p>
    </section>
    <button class="buk-launcher is-new" type="button" aria-expanded="false">
      <img alt="" src="${logoUrl}"><span class="buk-launcher__label"></span><span class="buk-launcher__arrow" aria-hidden="true">→</span>
    </button>`;
  document.body.append(root);

  const panel = root.querySelector('.buk-panel');
  const launcher = root.querySelector('.buk-launcher');
  const messages = root.querySelector('.buk-messages');
  const form = root.querySelector('.buk-form');
  const input = form.querySelector('input');
  const send = root.querySelector('.buk-send');
  const quick = root.querySelector('.buk-quick');
  const peek = root.querySelector('.buk-peek');

  function saveHistory() {
    sessionStorage.setItem(historyKey, JSON.stringify(history.slice(-12)));
  }

  function addMessage(role, content, sources, save) {
    const row = document.createElement('div');
    row.className = `buk-message buk-message--${role}`;
    if (role === 'assistant') {
      const avatar = document.createElement('img');
      avatar.className = 'buk-avatar';
      avatar.alt = '';
      avatar.src = logoUrl;
      row.append(avatar);
    }
    const bubble = document.createElement('div');
    bubble.className = 'buk-message__bubble';
    bubble.textContent = content;
    if (sources && sources.length) {
      const sourceBox = document.createElement('div');
      sourceBox.className = 'buk-message__sources';
      sources.forEach((source) => {
        const link = document.createElement('a');
        link.href = source.url;
        link.target = '_blank';
        link.rel = 'noopener';
        link.textContent = source.title;
        sourceBox.append(link);
      });
      bubble.append(sourceBox);
    }
    row.append(bubble);
    messages.append(row);
    messages.scrollTop = messages.scrollHeight;
    if (save !== false) {
      history.push({ role, content, sources: sources || [] });
      saveHistory();
    }
    return row;
  }

  function renderHistory() {
    messages.replaceChildren();
    if (!history.length) addMessage('assistant', text.hello, [], true);
    else history.forEach((item) => addMessage(item.role, item.content, item.sources, false));
  }

  function renderLanguage() {
    language = document.documentElement.lang === 'en' ? 'en' : 'ru';
    text = copy[language];
    root.querySelector('.buk-launcher__label').textContent = text.launcher;
    root.querySelector('.buk-header strong').textContent = text.title;
    root.querySelector('.buk-header small').textContent = text.subtitle;
    root.querySelector('[data-buk-minimize]').setAttribute('aria-label', text.minimize);
    root.querySelector('[data-buk-close]').setAttribute('aria-label', text.close);
    input.placeholder = text.placeholder;
    input.setAttribute('aria-label', text.placeholder);
    send.setAttribute('aria-label', text.send);
    root.querySelector('.buk-note').textContent = text.note;
    peek.textContent = text.peek;
    quick.replaceChildren();
    text.questions.forEach((question) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = question;
      button.addEventListener('click', () => ask(question));
      quick.append(button);
    });
    if (!history.length) renderHistory();
  }

  function openPanel() {
    panel.hidden = false;
    panel.setAttribute('aria-hidden', 'false');
    panel.classList.add('is-open');
    launcher.setAttribute('aria-expanded', 'true');
    launcher.classList.remove('is-new');
    peek.hidden = true;
    sessionStorage.setItem(seenKey, '1');
    setTimeout(() => input.focus(), 0);
  }

  function closePanel() {
    panel.hidden = true;
    panel.setAttribute('aria-hidden', 'true');
    panel.classList.remove('is-open');
    launcher.setAttribute('aria-expanded', 'false');
    launcher.focus();
  }

  async function ask(question) {
    const message = String(question || '').trim();
    if (message.length < 2 || send.disabled) return;
    openPanel();
    addMessage('user', message);
    input.value = '';
    send.disabled = true;
    const typing = addMessage('assistant', '•••', [], false);
    typing.querySelector('.buk-message__bubble').classList.add('buk-typing');
    try {
      const response = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, locale: language, sessionId: getSessionId() }),
      });
      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error(result.error || 'Assistant request failed');
      typing.remove();
      addMessage('assistant', result.answer, result.sources || []);
    } catch (_) {
      typing.remove();
      addMessage('assistant', text.error, [{ title: language === 'en' ? 'Official admissions page' : 'Официальная страница поступления', url: 'https://cou548.mskobr.ru/roditelyam/algoritm-postuplenia' }]);
    } finally {
      send.disabled = false;
      input.focus();
    }
  }

  launcher.addEventListener('click', () => panel.hidden ? openPanel() : closePanel());
  root.querySelector('[data-buk-minimize]').addEventListener('click', closePanel);
  root.querySelector('[data-buk-close]').addEventListener('click', closePanel);
  form.addEventListener('submit', (event) => { event.preventDefault(); ask(input.value); });
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && !panel.hidden) closePanel(); });
  new MutationObserver(renderLanguage).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });

  renderLanguage();
  renderHistory();
  if (!sessionStorage.getItem(seenKey)) {
    peek.hidden = false;
    setTimeout(() => { peek.hidden = true; }, 8000);
  }
})();
