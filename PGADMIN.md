# PostgreSQL / pgAdmin

Локальная база: school548_site.

Параметры подключения в pgAdmin:

- Host: localhost
- Port: 5432
- Maintenance database: school548_site
- Username: ivanmorozov
- SSL mode: Prefer

Таблица формы: public.contact_submissions.

Для Vercel создайте PostgreSQL-базу у выбранного провайдера и добавьте строку подключения в переменную окружения DATABASE_URL. Схема находится в db/schema.sql.
