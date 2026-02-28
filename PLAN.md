# Pacific Fish — План разработки

## Стек технологий

| Компонент            | Решение                                                                      |
| -------------------- | ---------------------------------------------------------------------------- |
| Фреймворк            | **Next.js** (фронт + API routes)                                             |
| ORM                  | **Prisma**                                                                   |
| БД                   | **PostgreSQL**                                                               |
| Авторизация          | **NextAuth.js (Auth.js)**                                                    |
| Хранение картинок    | **Локально на сервере** (папка /uploads, Docker volume)                      |
| Telegram уведомления | **grammy** (встроено в Next.js API)                                          |
| Контейнеризация      | **Docker + Docker Compose**                                                  |
| Сервер               | **Timeweb Cloud VPS** (~2GB RAM)                                             |
| CI/CD                | **GitHub Actions**                                                           |
| Reverse proxy + SSL  | **Nginx + Let's Encrypt**                                                    |
| Рендеринг            | **SSG + ISR** (статика + фоновая регенерация), App Router, Server Components |
| i18n                 | **next-intl** (серверный рендеринг переводов), языки: RU, EN, ZH             |
| Домен                | Купить + настроить DNS                                                       |

---

## План действий

### Этап 1 — Минимальный проект + Docker ✅

1. ~~Инициализировать Next.js проект (минимальная страница-заглушка)~~
2. ~~Написать Dockerfile для Next.js~~
3. ~~Написать docker-compose.yml (app + PostgreSQL)~~
4. ~~Проверить что всё работает локально в Docker~~

### Этап 2 — Сервер и домен (частично ✅)

5. ~~Арендовать VPS на Timeweb Cloud~~
6. ~~Настроить сервер (Docker, Docker Compose, SSH-ключи)~~
7. ~~Установить и настроить Nginx (reverse proxy)~~
8. Купить домен, привязать DNS к серверу
9. Настроить SSL (Let's Encrypt через Certbot)

### Этап 3 — CI/CD ✅

10. ~~Настроить GitHub Actions: push в master → сборка Docker-образа → деплой на сервер по SSH~~
11. ~~Добавить секреты в GitHub (SSH-ключ, адрес сервера, переменные окружения)~~
12. ~~Первый деплой, проверка всего пайплайна~~
13. ~~Разбить pipeline на 4 отдельных jobs: `build-app` → `build-migrator` (параллельно) → `migrate` → `deploy`~~

### Этап 4 — DX: линтеры, форматирование, pre-commit хуки ✅

14. ~~Настроить .vscode/settings.json (format on save, рекомендованные расширения)~~
15. ~~Доработать конфиги ESLint, Prettier, Stylelint~~
16. ~~Настроить pre-commit хуки (husky + lint-staged): линтинг и форматирование перед коммитом~~

### Этап 5 — FSD архитектура + Интернационализация (i18n) ✅

17. ~~Внедрить Feature-Sliced Design структуру (entities, features, shared, widgets)~~
18. ~~Добавить FSD path aliases в tsconfig.json~~
19. ~~Настроить next-intl (middleware, routing по /ru, /en, /zh)~~
20. ~~Создать JSON-файлы переводов для каждого языка~~
21. ~~Переключатель языков в layout~~

### Этап 6 — Роутинг и страницы-заглушки ✅

22. ~~Проанализировать файлы старого проекта (структура страниц, навигация)~~
23. ~~Настроить роутинг App Router на основе структуры старого сайта~~
24. ~~Создать страницы-заглушки для всех разделов с базовой навигацией~~

### Этап 7 — База данных и авторизация ✅

#### Схема БД (Prisma) ✅

**Prisma 6** (`prisma@6.19.2`, `@prisma/client@6.19.2`), генератор `prisma-client-js`.
Синглтон PrismaClient: `src/shared/lib/prisma.ts`.
Первая миграция: `prisma/migrations/20260227154148_init/`.
Seed-скрипт: `prisma/seed.ts` (данные из старого проекта).

**Сущности (11 моделей, 2 enum):**

1. **User** — администраторы сайта
   - `id`, `email`, `passwordHash`, `name`, `role` (ADMIN), `createdAt`

2. **News** — новости (мультиязычные)
   - `id`, `slug`, `publishedAt`, `featured`, `createdAt`, `updatedAt`
   - `titleRu`, `titleEn`, `titleZh` — заголовок (3 языка)
   - `descriptionRu`, `descriptionEn`, `descriptionZh` — краткое описание
   - `contentRu`, `contentEn`, `contentZh` — полный текст
   - `thumbnailUrl` — миниатюра для списка
   - Связь: `images` → NewsImage[]

3. **NewsImage** — изображения к новостям
   - `id`, `newsId` (FK → News), `url`, `order`

4. **Product** — продукция / прайс-лист
   - `id`, `nameRu`, `nameEn`, `nameZh`
   - `category` (рыба, морепродукты, икра и т.д.)
   - `price` (Decimal) — цена с НДС в рублях
   - `active`, `order`, `createdAt`, `updatedAt`
   - Связь: `stocks` → ProductStock[]

5. **Supplier** — заводы-поставщики
   - `id`, `name`, `logoUrl`, `active`, `order`

6. **ProductStock** — наличие продукта у поставщика (связь M:N)
   - `id`, `productId` (FK → Product), `supplierId` (FK → Supplier)
   - `weightKg` (Decimal) — вес в кг

7. **Partner** — партнёры (логотипы на главной)
   - `id`, `name`, `logoUrl`, `active`, `order`

8. **GalleryImage** — фотогалерея
   - `id`, `url`, `category` (FISH | PRODUCTION), `order`

9. **Announcement** — объявления/приглашения на главной
   - `id`, `imageUrl`, `link` (опционально), `active`, `order`

10. **ContactRequest** — заявки с формы обратной связи
    - `id`, `name`, `phone`, `email`, `message`, `createdAt`

11. **SiteSetting** — настройки сайта (контакты, цифры и т.д.)
    - `id`, `key` (unique), `value` (JSON)
    - Ключи: `contacts` (адрес, телефоны, email, ссылка на карту),
      `companyFeatures` (год основания, кол-во поставщиков, тонн и т.д.),
      `videoUrl` (ссылка на RuTube)

#### CI/CD для миграций ✅

- Dockerfile: отдельный target `migrator` (на базе `deps` stage с полными node_modules)
- Runner stage содержит только `.prisma` и `@prisma/client` (runtime)
- Pipeline разбит на 4 jobs с графом зависимостей:
  - `build-app` — сборка и пуш app-образа (`:latest` + `:sha`), параллельно с `build-migrator`
  - `build-migrator` — сборка и пуш migrator-образа (`:migrator`)
  - `migrate` — SSH на сервер, `prisma migrate deploy` + seed (зависит от обоих build)
  - `deploy` — SSH на сервер, генерация `docker-compose.override.yml`, `docker compose up -d` (зависит от `migrate`)
- `DATABASE_URL` конструируется из `POSTGRES_PASSWORD` в `.env` на сервере
- `docker-compose.override.yml` пробрасывает `AUTH_SECRET`, `AUTH_URL`, `AUTH_TRUST_HOST` в app-контейнер

#### Задачи этапа

25. ~~Настроить Prisma — установить, подключить к PostgreSQL, создать схему~~
26. ~~Создать все модели (User, News, NewsImage, Product, Supplier, ProductStock, Partner, GalleryImage, Announcement, ContactRequest, SiteSetting)~~
27. ~~Написать seed-скрипт — перенести данные из старого проекта (news.js, prices.js) в БД~~
28. ~~Настроить переменные окружения (.env, .env.example)~~
29. ~~Сделать авторизацию через NextAuth.js (Credentials — логин/пароль)~~

**Auth.js v5** (`next-auth@beta`), JWT-сессии, Credentials provider, bcryptjs.
Конфиг: `src/shared/lib/auth.ts` + `auth.types.ts`.
API route: `src/app/api/auth/[...nextauth]/route.ts`.
Админка: `/admin` (вне i18n, русский) — клиентская, `useSession` + `signIn`/`signOut` из `next-auth/react`.
`SessionProvider` в `layout.tsx`, вход/выход без перезагрузки страницы через `update()`.
FSD: shared/lib (конфиг), features/auth/ui (LoginForm), app/admin (страницы).
Seed: admin@pacific-fish.ru / admin123.

### Этап 8 — Бэкенд (API)

30. API routes: CRUD новостей + загрузка изображений к новостям
31. API routes: CRUD продуктов + управление наличием по поставщикам
32. API routes: CRUD поставщиков (Supplier)
33. API routes: CRUD партнёров (Partner) + загрузка логотипов
34. API routes: CRUD фотогалереи + загрузка изображений
35. API routes: CRUD объявлений (Announcement) + загрузка изображений
36. API route: настройки сайта (SiteSetting) — контакты, цифры компании
37. API route: форма обратной связи → сохранение + уведомление в Telegram через grammy
38. API route: загрузка файлов (сохранение в /uploads, путь в БД)

### Этап 9 — Админка

39. Страница логина
40. Dashboard — обзор (кол-во новостей, заявок и т.д.)
41. Управление новостями (список, создание, редактирование, удаление, загрузка фото)
42. Управление продукцией и поставщиками (таблица прайса, наличие по заводам)
43. Управление партнёрами (логотипы, порядок)
44. Управление фотогалереей (загрузка, категории, сортировка)
45. Управление объявлениями (загрузка, вкл/выкл)
46. Управление контактами и настройками сайта
47. Просмотр заявок с формы обратной связи

### Этап 10 — Публичная часть сайта

48. Главная: секция «О компании» + цифры (из SiteSetting)
49. Главная: секция «Наука-инновации-производство» + видео
50. Главная: секция «Партнёры» (карусель логотипов)
51. Главная: секция «Как оформить заказ»
52. Главная: секция «Новости» (последние 5)
53. Главная: секция «Объявления»
54. Страница новостей — список + детальная страница `/news/[slug]`
55. Страница прайса — таблица продуктов с наличием по заводам
56. Страница галереи — сетка фотографий с категориями
57. Страница контактов — карта, адрес, телефоны, форма обратной связи
58. Footer — контакты, навигация, копирайт
59. Настроить Docker volume для /uploads
