# Bebo Vitamins Store

Готовый к запуску демо-проект интернет-магазина витаминов. Репозиторий содержит SPA на React и backend на Node.js/Express с БД PostgreSQL и ORM Prisma.

## Структура

```
├── client/   # фронтенд (React + Vite + Tailwind CSS)
├── server/   # backend (Express + Prisma + JWT)
├── docker-compose.yml
├── swagger.yaml
└── package.json
```

## Возможности

- Каталог витаминов с фильтрами по категории, бренду, форме и цене.
- Детальная страница товара, корзина, оформление заказа.
- Регистрация и вход по email+паролю, хранение токенов JWT (access + refresh).
- Защищённые разделы: профиль пользователя, список заказов, админ-панель.
- CRUD продуктов для администратора.
- Prisma миграции и сиды с тестовыми данными (10 товаров, 3 категории, 2 пользователя).
- Rate limiting для логина, CORS, bcrypt-хеширование паролей.
- Локальные SVG-изображения товаров (`/server/public/assets/products`).

## Тестовые пользователи

| Роль | Email | Пароль |
| ---- | ----- | ------ |
| Admin | `admin@test.local` | `Admin123!` |
| User | `user@test.local` | `User123!` |

Пароли в базе хешируются с помощью bcrypt, исходные значения приведены для удобства.

## Требования

- Node.js 20+
- npm 9+
- Docker (опционально, для контейнерного запуска)

## Переменные окружения

Создайте файл `server/.env` на основе примера:

```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/bebo"
PORT=4000
JWT_SECRET="supersecretjwt"
JWT_REFRESH_SECRET="supersecretrefresh"
CORS_ORIGIN="http://localhost:5173"
```

Для фронтенда можно задать `client/.env` (опционально):

```
VITE_API_URL=http://localhost:4000
```

## Локальный запуск (без Docker)

1. Установите зависимости:
   ```bash
   npm install
   npm --prefix server install
   npm --prefix client install
   ```
2. Примените миграции и загрузите сид-данные:
   ```bash
   npm run migrate
   npm run seed
   ```
3. Запустите backend и frontend одной командой:
   ```bash
   npm run dev
   ```
   - Backend доступен на `http://localhost:4000`
   - Frontend SPA — `http://localhost:5173`

Для отдельного запуска:
```bash
npm run dev:server   # только backend
npm run dev:client   # только фронтенд
```

## Сборка и продакшн

```bash
npm run build   # сборка клиента и сервера
npm run start   # запуск собранного backend (предварительно npm run build)
```

## Docker

```bash
docker-compose up --build
```

Сервисы:
- `client` — Vite build c serve на `5173`
- `server` — Express API на `4000`
- `db` — PostgreSQL 15 (данные в volume `db_data`)

Для применения миграций и сидов внутри контейнера backend выполняет `prisma migrate deploy` при старте. При необходимости повторно прогоните сиды:
```bash
docker compose exec server npm run seed
```

## Prisma

- Схема: `server/prisma/schema.prisma`
- Миграции: `npx prisma migrate dev --name init` (локально)
- Сид: `npm run seed`
- Клиент генерируется автоматически (`npx prisma generate`)

## API

- Swagger/OpenAPI описание: `server/swagger.yaml`
- Основные эндпойнты:
  - `POST /api/auth/register`
  - `POST /api/auth/login`
  - `POST /api/auth/refresh`
  - `GET /api/products?category=&q=&page=`
  - `GET /api/products/categories/all`
  - `GET /api/products/:id`
  - `POST /api/orders` (авторизация требуется)
  - `GET /api/orders` (история заказов)
  - `POST /api/cart` (сводка по корзине)
  - `POST /api/orders/cart` (альтернативная сводка)
  - `GET/POST/PUT/DELETE /api/admin/products` (для роли `ADMIN`)

## Тестирование

Минимальные unit-тесты не входят в поставку, но проект готов к интеграции Jest/Supertest. Для визуальной проверки:
1. Запустите проект.
2. Авторизуйтесь под `user@test.local`.
3. Добавьте товары в корзину, оформите заказ.
4. Проверьте появление записи в разделе "Мои заказы" и в таблицах БД (`orders`, `order_items`).

## Полезные команды

```bash
npm run migrate        # применить миграции (deploy)
npm run migrate:dev    # (из server) миграции в dev-режиме
npm run seed           # заполнить тестовыми данными
npm run build          # собрать клиент и сервер
npm run start          # старт production backend
```

## Примечания

- Изображения товаров обслуживаются backend-ом из `server/public/assets` и доступны по URL `http://localhost:4000/assets/products/...`.
- Для боевой среды предусмотрено хранение файлов в S3 (можно заменить локальный сторедж).
- Rate limiting настроен только на маршрут `/api/auth/login` (10 запросов в минуту).
- В качестве UI-библиотеки используется Tailwind CSS, без сторонних компонентов.

