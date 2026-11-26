'use strict';

const corpus = require('../data/assistant-corpus.json');

const sources = {
  admissions: {
    id: 'admissions',
    title: 'Алгоритм поступления — Школа № 548',
    url: 'https://cou548.mskobr.ru/roditelyam/algoritm-postuplenia',
  },
  rules2027: {
    id: 'rules2027',
    title: 'Положение о комплектовании на 2027–2028 учебный год',
    url: 'https://cou548.mskobr.ru/files/diff/2728nabor/Polozhenie_itog.pdf',
  },
  order2027: {
    id: 'order2027',
    title: 'Приказ от 26.10.2026 о комплектовании',
    url: 'https://cou548.mskobr.ru/files/diff/2728nabor/Prikaz2728.pdf',
  },
  predprof: {
    id: 'predprof',
    title: 'Положение о приёме в предпрофессиональные классы',
    url: 'https://cou548.mskobr.ru/files/diff/predprof/polozhenie_priem_predprof_26.pdf',
  },
};

const faq = [
  {
    id: 'demo',
    question: 'Прошу предоставить демоверсии',
    questionEn: 'Are sample entrance tests available?',
    patterns: [/демоверс/i, /демо\s*\-вариант/i, /демовариант/i, /sample\s+(test|exam)/i],
    answer: 'Демоверсии и демоварианты КИМ не создаются и не публикуются. Вместо них школа направит на почту кандидата кодификатор — перечень проверяемых тем и/или навыков — до 20 декабря 2026 года.',
    sources: ['rules2027'],
  },
  {
    id: 'uin',
    question: 'Когда будет УИН?',
    questionEn: 'When will I receive my candidate ID?',
    patterns: [/уин/i, /уникальн.*номер/i, /candidate\s+id/i],
    answer: 'УИН присваивается каждому кандидату и направляется на электронную почту, указанную при регистрации. Отдельная дата рассылки УИН в положении не указана. Сохраните номер: его нужно сообщить комиссии перед испытанием.',
    sources: ['rules2027'],
  },
  {
    id: 'change-program',
    question: 'Как сменить программу поступления?',
    questionEn: 'How can I change the selected programme?',
    patterns: [/смен.*програм/i, /измен.*(корпус|програм)/i, /change.*(programme|program|campus)/i],
    answer: 'Выбранные корпус и/или программу можно изменить только один раз и не позднее 2 марта 2027 года включительно. Используйте форму: https://smena.s548.ru/. Повторно регистрироваться для смены выбора не нужно.',
    sources: ['admissions', 'rules2027'],
  },
  {
    id: 'exam-dates',
    question: 'Сроки экзаменов',
    questionEn: 'When are the entrance assessments?',
    patterns: [/срок.*(экзам|испыт|сбор)/i, /дат.*(экзам|испыт|сбор)/i, /when.*(exam|assessment)/i],
    answer: 'Календарь конкурсных испытаний и ознакомительных сборов школа направит на почту, указанную при регистрации, не позднее 25 января 2027 года. До официальной рассылки точные даты называть нельзя.',
    sources: ['rules2027'],
  },
  {
    id: 'reserve-days',
    question: 'Будут ли резервные дни для заболевших?',
    questionEn: 'Are alternative dates available in case of illness?',
    patterns: [/резерв.*дн/i, /забол.*(экзам|испыт|сбор)/i, /(ill|sick).*(exam|assessment)/i],
    answer: 'Автоматического «резервного дня» для всех положение не обещает. Если особые обстоятельства, включая болезнь, могут повлиять на участие, о них нужно сообщить комиссии в день испытания, но не позднее сдачи последней работы/собеседования. Если комиссия признает обстоятельства, могут предложить дополнительный срок. Для улучшения уже полученного результата пересдача не предоставляется.',
    sources: ['rules2027'],
  },
  {
    id: 'registration-deadline',
    question: 'Когда заканчивается регистрация?',
    questionEn: 'When does registration close?',
    patterns: [/заканчив.*регистрац/i, /до\s+какого.*регистрац/i, /срок.*регистрац/i, /registration.*(close|deadline)/i],
    answer: 'Заявление на участие в испытаниях/сборах для 5, 7, 8, 9 и 10-х классов нужно подать на сайте школы до 10 марта 2027 года. Форма регистрации: https://priem.s548.ru/.',
    sources: ['rules2027', 'admissions'],
  },
  {
    id: 'view-work',
    question: 'Можно ли посмотреть работу после проверки?',
    questionEn: 'Can we review the marked entrance test?',
    patterns: [/посмотр.*работ/i, /ознаком.*работ/i, /апелляц/i, /review.*(work|test|exam)/i],
    answer: 'Нет. КИМы, сами конкурсные работы и их копии кандидатам и родителям не передаются. Апелляция по оцениванию, содержанию и структуре заданий не предусмотрена.',
    sources: ['rules2027'],
  },
  {
    id: 'email',
    question: 'Не пришло письмо-подтверждение регистрации',
    questionEn: 'I did not receive the registration email',
    patterns: [/не\s+пришл.*письм/i, /письм.*подтвержд/i, /did\s+not\s+receive.*(email|confirmation)/i],
    answer: 'Сначала проверьте папки «Спам», «Рассылки» и «Оповещения». Письмо может не прийти из-за повторной регистрации, спам-фильтра или ошибки в адресе. Если письма нет, напишите в свой корпус: Маршала Захарова — priem-mz@s548.ru; Домодедовская — priem-dom@s548.ru; Инженерный — priem-sov@s548.ru; ЗИЛАРТ — priem-zil@s548.ru. В теме: «Не пришло автоматическое письмо — Фамилия И.О.».',
    sources: ['admissions'],
  },
];

const chunks = [
  { id: 'choice', text: 'Кандидат может выбрать только одну программу и один корпус. Изменить выбор можно один раз до 2 марта 2027 года включительно.', source: 'rules2027' },
  { id: 'registration', text: 'Регистрация для участия в конкурсных испытаниях и ознакомительных сборах заканчивается 10 марта 2027 года.', source: 'rules2027' },
  { id: 'results', text: 'Итоги комплектования: 5–9-е классы — до 25 мая 2027 года; 10-е классы — до 6 июля 2027 года. Результаты направляются на почту в виде протоколов с УИН без персональных данных.', source: 'rules2027' },
  { id: 'documents', text: 'Документы у успешно прошедших конкурсные испытания принимаются до 6 июля 2027 года по графику и перечню на сайте школы.', source: 'rules2027' },
  { id: 'calendar', text: 'Календарь и перечень испытаний направляются на почту кандидата не позднее 25 января 2027 года. Кодификатор тем/навыков — до 20 декабря 2026 года.', source: 'rules2027' },
  { id: 'uin', text: 'УИН присваивается каждому кандидату, направляется на почту после регистрации и используется для допуска и маркировки работ.', source: 'rules2027' },
  { id: 'first-class', text: 'Зачисление в 1-е классы начинается не позднее 1 апреля 2027 года.', source: 'rules2027' },
  { id: 'predprof-dates', text: 'Для приёма в предпрофессиональные классы: с 20 мая до 10 июня принимаются заявления и согласия; с 10 до 26 июня — копии подтверждающих документов.', source: 'predprof' },
];

function sourceList(ids) {
  return [...new Set(ids)].map((id) => sources[id]).filter(Boolean);
}

function normalize(value) {
  return String(value || '').toLowerCase().replace(/ё/g, 'е').replace(/[^a-zа-я0-9\s-]/gi, ' ').replace(/\s+/g, ' ').trim();
}

function findFaq(question) {
  return faq.find((item) => item.patterns.some((pattern) => pattern.test(question))) || null;
}

function relevantChunks(question, limit = 5) {
  const stop = new Set(['как', 'какого', 'когда', 'где', 'что', 'можно', 'ли', 'для', 'прошу', 'меня', 'будет', 'будут', 'какие', 'после', 'год', 'года', 'году', 'the', 'when', 'what', 'how']);
  const tokens = normalize(question)
    .split(' ')
    .filter((token) => token.length > 2 && !stop.has(token))
    .map((token) => token.length > 6 && !/^\d+$/.test(token) ? token.slice(0, 6) : token);
  const searchable = [
    ...chunks.map((chunk) => ({ ...chunk, sourceInfo: sources[chunk.source], curated: true })),
    ...corpus.chunks.map((chunk) => ({
      ...chunk,
      sourceInfo: { id: chunk.documentId, title: chunk.title, url: chunk.url },
    })),
  ];
  return searchable
    .map((chunk) => {
      const body = normalize(chunk.text);
      const title = normalize(chunk.sourceInfo?.title);
      const matchedTokens = tokens.filter((token) => body.includes(token));
      const titleMatches = tokens.filter((token) => title.includes(token));
      const matched = matchedTokens.length + titleMatches.length * 4;
      const coverage = tokens.length ? matchedTokens.length / tokens.length : 0;
      const accepted = matched && (titleMatches.length >= 2 || coverage >= 0.75);
      const score = accepted ? matched + (chunk.curated ? 5 : 0) : 0;
      const sentences = String(chunk.text || '').split(/(?<=[.!?])\s+/).filter(Boolean);
      let bestIndex = 0;
      let bestScore = -1;
      sentences.forEach((sentence, index) => {
        const value = normalize(sentence);
        const sentenceScore = tokens.reduce((total, token) => total + (value.includes(token) ? 1 : 0), 0);
        if (sentenceScore > bestScore) { bestIndex = index; bestScore = sentenceScore; }
      });
      const snippet = sentences.slice(Math.max(0, bestIndex - 1), bestIndex + 2).join(' ');
      return { ...chunk, score, snippet };
    })
    .filter((chunk) => chunk.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

module.exports = { faq, sources, chunks, corpus, findFaq, relevantChunks, sourceList };
