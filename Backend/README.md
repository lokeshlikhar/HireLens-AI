# HireLens AI backend

Copy `.env.example` to `.env` and provide `MONGO_URL`, `JWT_SECRET`, and `GROQ_API_KEY` before starting the API.

For local development, set `CLIENT_URL=http://localhost:5173` and run:

```sh
npm install
npm start
```

For deployment, use HTTPS and set `NODE_ENV=production`, `CLIENT_URL` to the deployed frontend origin (multiple comma-separated origins are supported), and `PORT` if your host provides one. The health check is available at `GET /api/health`.
