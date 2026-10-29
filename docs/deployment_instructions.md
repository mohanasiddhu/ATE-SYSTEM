# Production Deployment Guide

## 1. Production Build
Compile the frontend into optimized static bundles:
```bash
npm run build
```
This generates production assets in `./dist`.

---

## 2. Production Service Execution
For full-stack deployment, run the unified Express backend with static hosting:
```bash
npm start
# Equivalent to: NODE_ENV=production node --import tsx server.ts
```

---

## 3. Containerized Deployment (Docker)
Create a `Dockerfile` for edge or cloud cluster orchestration:

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json bun.lock ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
COPY --from=builder /app ./
EXPOSE 3000
CMD ["npm", "start"]
```

Build and run container:
```bash
docker build -t ai-traffic-enforcement:latest .
docker run -d -p 3000:3000 --name traffic_system ai-traffic-enforcement:latest
```

---

## 4. Production Security & Hardening Checklist
- Ensure `JWT_SECRET` in `.env` is set to a cryptographically secure 256-bit random string.
- Restrict `CORS_ORIGIN` to approved agency domain endpoints.
- Mount persistent volumes for `./outputs` and `./database` to preserve court evidence.
- Place Nginx reverse proxy with TLS 1.3 in front of the application.
