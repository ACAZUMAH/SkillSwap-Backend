# SkillSwap — Backend

Backend for the SkillSwap application. Built with TypeScript, Express, Apollo Server (GraphQL), and MongoDB.

Minimal README

Overview
- Exposes a GraphQL API with support for subscriptions and a Socket.IO endpoint for realtime features.
- Handles authentication, user profiles, swaps, messaging, reviews, and notifications.

Requirements
- Node.js >= 20
- Yarn or npm
- MongoDB (connection string required)

Quick start
1. Clone and install dependencies:

```powershell
git clone https://github.com/ACAZUMAH/SkillSwap-Backend.git
cd SkillSwap-Backend
yarn install
```

2. Add environment variables (create a `.env` file). At minimum include:
- MONGODB_URL
- JWT_SECRET
- PORT (optional, default 8800)

3. Run in development:

```powershell
yarn dev
```

Useful scripts (in package.json)
- `yarn dev` — start in development (nodemon)
- `yarn build` — compile TypeScript
- `yarn start` — run compiled build
- `yarn generate` — run GraphQL codegen

Important endpoints
- GET /health — basic health check
- GET / — root, returns a simple message
- POST /graphql — GraphQL API
- ws://<host>:<port>/graphql — GraphQL subscriptions
- Socket.IO — connect to /socket.io

Project layout (high level)
- `src/main.ts` — entry
- `src/app.ts` — server setup, DB connect, GraphQL + sockets
- `src/servers/*` — server factories (Express, GraphQL, Socket.IO)
- `src/graphql` — schema and resolvers
- `src/models`, `src/services`, `src/middlewares` — core app code

Contributing
- Fork, branch, add tests, open a PR. Keep secrets out of commits.

License
- MIT (see package.json)

If you'd like a longer README, `.env.example`, or a CONTRIBUTING file I can add them.
- yarn build — compile TypeScript (`tsc`) and run `tsc-alias` to fix path aliases
