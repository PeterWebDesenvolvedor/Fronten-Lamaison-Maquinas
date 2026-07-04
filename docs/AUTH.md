# Auth Backend Contract

This document describes the API contract that the frontend expects from the backend for authentication. The frontend is a Vite + React SPA that stores the **access token in memory only** and relies on an **httpOnly cookie** for the refresh token.

## Endpoints

### `POST /auth/login`

Authenticates a user with email and password.

**Request body:**
```json
{ "email": "user@example.com", "password": "secret" }
```

**Response (200 OK):**
```json
{
  "accessToken": "<short-lived JWT>",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "User Name",
    "role": "ADMIN" // or "USER"
  }
}
```

**Cookie set by backend:**
- Name: `refreshToken`
- Flags: `HttpOnly; Path=/auth/refresh; SameSite=Lax` (or `SameSite=None; Secure` if frontend and backend are on different origins in production)
- The frontend never reads or writes this cookie directly.

---

### `POST /auth/refresh`

Silently renews the session using the httpOnly refresh cookie. Called automatically on app boot and on 401 responses.

**Request:** No body required. The browser sends the `refreshToken` cookie automatically.

**Response (200 OK):**
```json
{
  "accessToken": "<new short-lived JWT>",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "User Name",
    "role": "ADMIN"
  }
}
```

**Response (401 Unauthorized):** Returned when the refresh cookie is missing, expired, or invalid. The frontend will redirect to `/login`.

**Cookie:** Backend should rotate the refresh token and set a new `refreshToken` cookie on each successful refresh.

---

### `POST /auth/logout`

Invalidates the session and clears the refresh cookie.

**Request:** No body required. The browser sends the `refreshToken` cookie automatically.

**Response (200 OK or 204 No Content):** The backend clears the `refreshToken` cookie (`Max-Age=0` or `Expires` in the past).

---

## CORS Configuration

Because the frontend sends cookies (`withCredentials: true`), the backend **must**:

- Set an explicit `Access-Control-Allow-Origin` header matching the frontend origin (e.g., `http://localhost:5173`). **`*` is not allowed when credentials are involved.**
- Set `Access-Control-Allow-Credentials: true`.
- Include `Authorization` in `Access-Control-Allow-Headers` if needed.

Example (Express + `cors` package):
```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL, // e.g. "http://localhost:5173"
  credentials: true,
}));
```

## Local Development Proxy

In development, the Vite dev server proxies `/api` requests to `http://localhost:8070`, so the frontend and backend share the same origin (`localhost:5173`). This avoids cross-origin cookie issues during development. The `VITE_API_URL` env variable is set to `/api`.

In production, configure the backend origin and `SameSite` cookie attribute according to your deployment topology.
