import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { router as meetingRouter } from "./routes/meetings";
import { router as queueRouter } from "./routes/queue";
import { router as uploadRouter, publicRouter as uploadProgressRouter } from "./routes/upload";
import { router as exportRouter } from "./routes/exports";
import { router as integrationRouter } from "./routes/integrations";
import { router as actionItemRouter } from "./routes/action-items";
import { router as userRouter } from "./routes/user";
import { router as notificationRouter } from "./routes/notifications";
import { router as searchRouter } from "./routes/search";
import { apiRateLimit, uploadRateLimit } from "./middleware/rate-limit";
import { requireAuth } from "./middleware/auth";
import { worker } from "./queue/worker";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:3000" }));
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serves uploaded/extracted audio files so the dashboard's audio player can
// stream them directly (e.g. GET /uploads/audio/foo.mp3). crossOriginResourcePolicy
// is relaxed above so the Next.js frontend (different origin/port) can load them.
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api", apiRateLimit);
app.use("/api/upload", uploadRateLimit);

// EventSource can't send an Authorization header, so this stays public --
// must be registered before the protected /api/upload mount below since
// Express matches prefixes in registration order. See upload.ts for why
// that's an accepted tradeoff.
app.use("/api/upload/progress", uploadProgressRouter);

// Routes protected by requireAuth -- req.userId is derived from the signed
// bearer token, never trusted from the request body/params.
app.use("/api/meetings", requireAuth, meetingRouter);
app.use("/api/queue", requireAuth, queueRouter);
app.use("/api/upload", requireAuth, uploadRouter);
app.use("/api/export", requireAuth, exportRouter);
app.use("/api/integrations", requireAuth, integrationRouter);
app.use("/api/action-items", requireAuth, actionItemRouter);
app.use("/api/users", requireAuth, userRouter);
app.use("/api/notifications", requireAuth, notificationRouter);
app.use("/api/search", requireAuth, searchRouter);

// Start worker
worker.on("ready", () => console.log("Worker ready"));

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

export default app;
