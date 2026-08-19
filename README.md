# Ayuk Gunung API

Backend for Ayuk Gunung: mountain information, basecamps, and nearby homestays in Indonesia.

## Stack

- NestJS + TypeScript
- MongoDB (Mongoose)
- JWT authentication
- Swagger at `/docs`

## Setup

```bash
cp .env.example .env
docker compose up -d
npm install
npm run start:dev
```

- API: http://localhost:3000/api
- Swagger: http://localhost:3000/docs
- Health: http://localhost:3000/api/health

## Admin

Roles: `superadmin` (all menus), `admin` (gunung, basecamp, homestay), `admin_homestay` (homestay only). Banned accounts cannot log in.

Seeded on first boot from `SUPERADMIN_EMAIL` / `SUPERADMIN_PASSWORD`.

| Method | Path | Permission |
| --- | --- | --- |
| POST | `/api/admin/auth/login` | Public |
| GET | `/api/admin/auth/me` | Any active admin |
| GET/POST | `/api/admin/admins` | `admin:read` / `admin:create` |
| PATCH/DELETE | `/api/admin/admins/:id` | `admin:update` / `admin:delete` |
| POST | `/api/admin/admins/:id/ban` | `admin:ban` |
| POST | `/api/admin/admins/:id/unban` | `admin:ban` |

## Auth endpoints

| Method | Path | Auth |
| --- | --- | --- |
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
| GET | `/api/auth/me` | Bearer JWT |
