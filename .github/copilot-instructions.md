# Copilot instructions for this repository

This is a small NestJS monorepo with three applications under `apps/` (book, users, bookstore-api-gateway). The goal of this file is to give an AI coding agent just-enough, concrete context to be productive quickly.

High-level architecture
- Monorepo layout: each app lives at `apps/<name>/` with a `src/` folder, a `test/` folder and its own `tsconfig.app.json`.
- Apps present in this repository: `book` (HTTP app), `bookstore-api-gateway` (HTTP gateway), `users` (TCP microservice).
- Entrypoints: `apps/*/src/main.ts` — note `users` uses `NestFactory.createMicroservice` with `Transport.TCP`; the others use `NestFactory.create` (HTTP).

How this repo is started locally (examples)
- Install dependencies: `npm install`.
- Run a specific app in dev/watch mode (pass `--project` to the nest CLI):
  - Example: start the API gateway on port 3001
    - `port=3001 npm run start:dev -- --project=bookstore-api-gateway`
  - Example: start the users microservice (TCP)
    - `port=4001 npm run start:dev -- --project=users`

Notes about environment variables and ports
- The code reads process.env.port (lowercase `port`) in the entrypoints. Conventions in this repo currently use `port` rather than `PORT`. Use that exact name when running locally or set both if you modify code.

Build / production run
- Build: `npm run build` (uses the Nest CLI). Output is emitted to `dist/` by default.
- Production start: after build run the relevant compiled file, e.g. `node dist/apps/<project>/main.js`.
- WARNING: the root `package.json` contains `start:prod: node dist/apps/bookstore/main` which looks like a template leftover — double-check the project name and file extension before using.

Tests
- Unit tests: `npm run test` (runs Jest across apps — see `jest` config in `package.json`).
- Per-app e2e configs live at `apps/<app>/test/jest-e2e.json`. The root `test:e2e` script references `./apps/bookstore/test/jest-e2e.json` (likely a stale template path). For e2e run a specific app config, e.g.:
  - `npx jest --config ./apps/book/test/jest-e2e.json`

Conventions and code patterns to follow (discoverable rules)
- App structure: `apps/<name>/src/<name>.module.ts`, controller at `<name>.controller.ts`, service at `<name>.service.ts`. Follow existing naming.
- Controllers return plain strings in these examples; services provide business logic. Add functionality in services and call them from controllers.
- Microservice pattern: `apps/users/src/main.ts` demonstrates a TCP microservice created with `NestFactory.createMicroservice<MicroserviceOptions>(UsersModule, { transport: Transport.TCP, options: { port: process.env.port ?? 3000 } })`.
- Cross-service communication: not implemented yet. When integrating, prefer Nest `ClientsModule` + `ClientProxy` (in gateway or other apps) to talk to the `users` TCP service. Place client registration in the consuming module (e.g. `bookstore-api-gateway.module.ts`).

Key files to inspect when making changes
- `nest-cli.json` — monorepo config and per-project entry files (use `--project` with nest CLI).
- `package.json` — scripts (build/test/lint). Watch for stale template entries.
- `apps/*/src/main.ts` — startup patterns (HTTP vs microservice).
- `apps/*/src/*.controller.ts` and `*.service.ts` — where HTTP endpoints and business logic live.
- `apps/*/test/jest-e2e.json` — per-app e2e Jest configs.
- `eslint.config.mjs` — repo linting rules.

Common pitfalls observed
- Inconsistent template leftovers: `start:prod` and root `nest-cli.json` include `bookstore` references that don't match the `projects` keys. Validate script paths before running in production.
- Env var name: code uses `process.env.port` (lowercase). Using `PORT` only will not set the value unless both are set or code is changed.
- When starting a single app, pass `--project=<name>` to `nest` (or use `npx nest start --project <name>`).

Quick contract for code changes
- Inputs: modify files under `apps/<project>/src` and update `apps/<project>/test` for tests.
- Outputs: compiled JS under `dist/apps/<project>/` after `npm run build`.
- Error modes to watch: missing `--project` selection, wrong env variable name, stale script paths in `package.json`.

If anything here is unclear or you want me to change scripts to be less error-prone (for example, normalize `PORT` usage or fix `start:prod`/`test:e2e` paths), tell me which behavior you prefer and I will update `package.json` and the entrypoints accordingly.

-- End of instructions (feel free to request additions or corrections)
