'use strict';

const { findFaq, relevantChunks, sourceList, sources } = require('../lib/assistant-knowledge');

const limits = global.school548AssistantLimits || new Map();
if (process.env.NODE_ENV !== 'production') global.school548AssistantLimits = limits;

function reply(res, status, payload) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.end(JSON.stringify(payload));
}

function allowed(sessionId) {
  const key = String(sessionId || 'anonymous').slice(0, 80);
  const now = Date.now();
  const recent = (limits.get(key) || []).filter((time) => now - time < 60 * 60 * 1000);
  if (recent.length >= 30) return false;
  recent.push(now);
  limits.set(key, recent);
  return true;
}

function outputText(data) {
  if (typeof data.output_text === 'string') return data.output_text.trim();
  return (data.output || [])
    .flatMap((item) => item.content || [])
    .filter((item) => item.type === 'output_text' && typeof item.text === 'string')
    .map((item) => item.text)
    .join('\n')
    .trim();
}

function sourcesFromChunks(chunks) {
  const seen = new Set();
  return chunks
    .map((chunk) => chunk.sourceInfo || sources[chunk.source])
    .filter((source) => source && !seen.has(source.url) && seen.add(source.url));
}

function excerpt(text, limit = 850) {
  const clean = String(text || '').replace(/\s+/g, ' ').trim();
  if (clean.length <= limit) return clean;
  const cut = clean.lastIndexOf('. ', limit);
  return `${clean.slice(0, cut > limit / 2 ? cut + 1 : limit).trim()}…`;
}

async function askModel(question, chunks) {
  if (!process.env.OPENAI_API_KEY || !chunks.length) return null;
  const context = chunks.map((chunk, index) => `[${index + 1}] ${chunk.snippet || chunk.text}\nИсточник: ${(chunk.sourceInfo || sources[chunk.source]).title}`).join('\n\n');
  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || 'gpt-5-mini',
      instructions: 'Ты Бук, справочный ИИ-ассистент ГАОУ Школы № 548. Отвечай кратко и только по приведённым выдержкам. Не придумывай даты, правила и контакты. Если в выдержках нет ответа, честно скажи, что ответ не найден, и предложи открыть официальную страницу поступления. Не запрашивай персональные данные. Сегодня 26 ноября 2026 года.',
      input: `Вопрос: ${question}\n\nВыдержки:\n${context}`,
      max_output_tokens: 450,
    }),
    signal: AbortSignal.timeout(20000),
  });
  if (!response.ok) throw new Error(`OpenAI request failed: ${response.status}`);
  return outputText(await response.json()) || null;
}

module.exports = async function assistant(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return reply(res, 405, { ok: false, error: 'Method not allowed' });
  }
  const body = req.body || {};
  const question = String(body.message || '').trim();
  if (question.length < 2 || question.length > 1000) return reply(res, 400, { ok: false, error: 'Invalid message' });
  if (!allowed(body.sessionId)) return reply(res, 429, { ok: false, error: 'Too many requests' });

  const exact = findFaq(question);
  if (exact) {
    return reply(res, 200, {
      ok: true,
      answer: exact.answer,
      sources: sourceList(exact.sources),
      mode: 'faq',
      faqId: exact.id,
    });
  }

  const chunks = relevantChunks(question);
  try {
    const modelAnswer = await askModel(question, chunks);
    if (modelAnswer) {
      return reply(res, 200, {
        ok: true,
        answer: modelAnswer,
        sources: sourcesFromChunks(chunks),
        mode: 'ai',
      });
    }
  } catch (error) {
    console.error('Assistant model error:', error.message);
  }

  if (chunks.length) {
    return reply(res, 200, {
      ok: true,
      answer: `В актуальных материалах указано: ${excerpt(chunks[0].snippet || chunks[0].text)}`,
      sources: sourcesFromChunks([chunks[0]]),
      mode: 'retrieval',
    });
  }

  return reply(res, 200, {
    ok: true,
    answer: 'В загруженных положениях я не нашёл надёжного ответа. Проверьте официальную страницу поступления или уточните вопрос у приёмной комиссии.',
    sources: sourceList(['admissions']),
    mode: 'fallback',
  });
};
