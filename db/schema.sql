CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(120) NOT NULL CHECK (char_length(name) BETWEEN 2 AND 120),
  email VARCHAR(254) NOT NULL CHECK (position('@' IN email) > 1),
  message TEXT NOT NULL CHECK (char_length(message) BETWEEN 10 AND 4000),
  locale VARCHAR(5) NOT NULL DEFAULT 'ru',
  source_page VARCHAR(255),
  status VARCHAR(20) NOT NULL DEFAULT 'new'
    CHECK (status IN ('new', 'in_progress', 'closed', 'spam')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS contact_submissions_created_at_idx
  ON contact_submissions (created_at DESC);
CREATE INDEX IF NOT EXISTS contact_submissions_email_idx
  ON contact_submissions (LOWER(email), created_at DESC);
CREATE INDEX IF NOT EXISTS contact_submissions_status_idx
  ON contact_submissions (status);
