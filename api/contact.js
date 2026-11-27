const { Pool } = require('pg');
const rawConnectionString = process.env.DATABASE_URL;
const useSsl = rawConnectionString && !/localhost|127\.0\.0\.1/.test(rawConnectionString);
let connectionString = rawConnectionString;
if (useSsl) {
  const databaseUrl = new URL(rawConnectionString);
  databaseUrl.searchParams.delete('sslmode');
  connectionString = databaseUrl.toString();
}
const pool = global.school548Pool || new Pool({
  connectionString,
  ssl: useSsl ? { rejectUnauthorized: true } : false,
  max: 5,
});
if (process.env.NODE_ENV !== 'production') global.school548Pool = pool;

function reply(res, status, payload) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.end(JSON.stringify(payload));
}

module.exports = async function contact(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return reply(res, 405, { ok: false, error: 'Method not allowed' });
  }
  if (!connectionString) return reply(res, 503, { ok: false, error: 'Database is not configured' });
  const body = req.body || {};
  const name = String(body.name || '').trim();
  const email = String(body.email || '').trim().toLowerCase();
  const message = String(body.message || '').trim();
  const locale = String(body.locale || 'ru').slice(0, 5);
  const sourcePage = String(body.sourcePage || '/contacts.html').slice(0, 255);
  const website = String(body.website || '').trim();
  const consent = body.consent === true || body.consent === 'true' || body.consent === 'on';
  if (website) return reply(res, 201, { ok: true });
  if (name.length < 2 || name.length > 120) return reply(res, 400, { ok: false, error: 'Invalid name' });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) return reply(res, 400, { ok: false, error: 'Invalid email' });
  if (message.length < 10 || message.length > 4000) return reply(res, 400, { ok: false, error: 'Invalid message' });
  if (!consent) return reply(res, 400, { ok: false, error: 'Consent is required' });
  try {
    const recent = await pool.query(
      "SELECT COUNT(*)::int AS count FROM contact_submissions WHERE LOWER(email) = LOWER($1) AND created_at > NOW() - INTERVAL '1 hour'",
      [email],
    );
    if (recent.rows[0].count >= 5) return reply(res, 429, { ok: false, error: 'Too many requests' });
    const result = await pool.query(
      'INSERT INTO contact_submissions (name, email, message, locale, source_page) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      [name, email, message, locale, sourcePage],
    );
    return reply(res, 201, { ok: true, id: result.rows[0].id });
  } catch (error) {
    console.error('Contact form database error:', error.message);
    return reply(res, 500, { ok: false, error: 'Could not save request' });
  }
};
