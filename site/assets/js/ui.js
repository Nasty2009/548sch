(function () {
  'use strict';
  const toggle = document.querySelector('.menu-toggle');
  const menu = document.querySelector('.nav-menu');
  function closeMenu() {
    if (!menu || !toggle) return;
    menu.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
  }
  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') !== 'true';
      toggle.setAttribute('aria-expanded', String(open));
      menu.classList.toggle('is-open', open);
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        closeMenu();
        toggle.focus();
      }
    });
    document.addEventListener('click', (event) => {
      if (!event.target.closest('.nav-pill')) closeMenu();
    });
    menu.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
  }

  const searchIndex = [
    ['Корпуса и адреса', 'Campuses and addresses', 'contacts.html', 'маршала захарова домодедовская елецкая зиларт инженерный адрес телефон campus address'],
    ['Обучение', 'Education', 'education.html', 'начальная основная старшая школа curriculum education'],
    ['Направления', 'Pathways', 'extra.html', 'инженерный социально экономический медиакласс медицинский ит художественный китайский pathways'],
    ['Поступление', 'Admissions', 'admission.html', 'прием поступление документы регистрация admission enrolment'],
    ['Педагоги', 'Teachers', 'teachers.html', 'учителя педагоги руководители teacher staff'],
    ['Документы', 'Documents', 'documents.html', 'устав лицензия аккредитация документы charter licence'],
    ['Новости', 'News', 'news.html', 'новости события публикации news'],
    ['Расписание', 'Timetable', 'schedule.html', 'расписание мэш дневник timetable mesh'],
  ];
  document.querySelectorAll('[data-site-search]').forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const formValue = new FormData(form).get('query');
      const inputValue = form.querySelector('input[type="search"]')?.value;
      const query = String(formValue ?? inputValue ?? '').trim().toLowerCase();
      const output = form.parentElement.querySelector('[data-search-results]');
      if (!output) return;
      const lang = document.documentElement.lang === 'en' ? 1 : 0;
      const matches = query.length < 2 ? [] : searchIndex.filter((item) => `${item[0]} ${item[1]} ${item[3]}`.toLowerCase().includes(query));
      output.hidden = false;
      output.replaceChildren();
      if (!matches.length) {
        output.textContent = lang ? 'No matches. Try a campus, programme or document.' : 'Ничего не найдено. Попробуйте название корпуса, программы или документа.';
        return;
      }
      const list = document.createElement('ul');
      matches.forEach((item) => {
        const li = document.createElement('li');
        const link = document.createElement('a');
        link.href = item[2];
        link.textContent = item[lang];
        li.append(link);
        list.append(li);
      });
      output.append(list);
    });
  });

  document.querySelectorAll('[data-contact-form]').forEach((form) => {
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const status = form.querySelector('[data-form-status]');
      const button = form.querySelector('button[type="submit"]');
      const data = Object.fromEntries(new FormData(form));
      data.consent = Boolean(form.elements.consent?.checked);
      data.locale = document.documentElement.lang || 'ru';
      data.sourcePage = location.pathname;
      button.disabled = true;
      status.textContent = data.locale === 'en' ? 'Sending…' : 'Отправляем…';
      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'Request failed');
        form.reset();
        status.textContent = data.locale === 'en' ? 'Your request has been received.' : 'Обращение принято. Спасибо!';
      } catch (error) {
        status.textContent = data.locale === 'en'
          ? 'Could not send the request. Please try again or use the phone number above.'
          : 'Не удалось отправить обращение. Повторите попытку или позвоните по указанному выше номеру.';
      } finally {
        button.disabled = false;
      }
    });
  });

  const stories = document.querySelectorAll('[data-article]');
  if (stories.length) {
    let id = new URLSearchParams(location.search).get('article') || 'admission';
    if (!Array.from(stories).some((story) => story.dataset.article === id)) id = 'admission';
    stories.forEach((story) => { story.hidden = story.dataset.article !== id; });
  }
})();
