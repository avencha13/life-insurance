# QNB Life — React Back Office

Flutter → React migration of `qnb-insurance-ui` / `qnb-insurance-ui-component`.

Architecture: see [`../docs/gatewayui-revamp-architecture.md`](../docs/gatewayui-revamp-architecture.md)  
Backlog: see [`../docs/react-migration-backlog.md`](../docs/react-migration-backlog.md)

## Scripts

```bash
npm run dev
npm run build
npm run lint
```

## Structure

```txt
src/
  app/           routes + App shell
  core/          api, auth, i18n, config, router guards
  themes/        --qnb-* tokens (colors, typography, spacing, radius)
  components/    layout + ui primitives
  features/      domain modules (auth, dashboard, master/city, …)
```

## First screens

| Route | Status |
|-------|--------|
| `/login` | done |
| `/dashboard` | done (shell + menu) |
| `/dashboard/city` | done (CRUD template) |
| other dashboard paths | stub → Coming Soon |

Demo login previously used mocks. Login now calls Flutter BO APIs via Vite proxy:

1. `POST /data-api/auth-server/public/rp` (RSA keys)
2. Encrypt password with JSEncrypt
3. `POST /bo-api/auth-server/login` with `{ un, ps }` + BO headers
4. MFA secure-value / OTP when `mfaYn === Y`

Upstream hosts match Flutter `base_url.dart` (`dataurl` / `baseUrl`). Restart `npm.cmd run dev` after `.env` / proxy changes.
