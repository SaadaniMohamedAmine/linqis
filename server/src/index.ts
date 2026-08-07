import "dotenv/config";
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
import { router as chatRouter } from "./routes/chat";
import { router as publicRouter } from "./routes/public";
import { router as pdfRouter } from "./routes/pdf";
import { router as analyticsRouter } from "./routes/analytics";
import { router as workspaceRouter, publicRouter as workspacePublicRouter } from "./routes/workspace";
import { apiRateLimit, uploadRateLimit } from "./middleware/rate-limit";
import { requireAuth, requireWorkspace } from "./middleware/auth";
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

// Invite links have to work for someone who has no account yet, so this one
// is public. Registered before the protected /api/workspace mount below since
// Express matches prefixes in registration order.
app.use("/api/workspace/public", workspacePublicRouter);

// Routes protected by requireAuth -- req.userId is derived from the signed
// bearer token, never trusted from the request body/params. Everything that
// touches meetings additionally goes through requireWorkspace, which resolves
// req.workspaceId from the X-Workspace-Id header after checking membership;
// that -- not userId -- is the access scope for meeting data.
app.use("/api/meetings", requireAuth, requireWorkspace, meetingRouter);
app.use("/api/queue", requireAuth, queueRouter);
app.use("/api/upload", requireAuth, requireWorkspace, uploadRouter);
app.use("/api/export", requireAuth, requireWorkspace, exportRouter);
// Integration settings are personal, but POST /zoom/import creates a Meeting,
// which now needs a workspace -- hence requireWorkspace here too.
app.use("/api/integrations", requireAuth, requireWorkspace, integrationRouter);
app.use("/api/action-items", requireAuth, requireWorkspace, actionItemRouter);
app.use("/api/workspace", requireAuth, requireWorkspace, workspaceRouter);
// users/notifications stay scoped by req.userId alone (personal preferences).
// /api/users must NOT require a workspace: it serves the very endpoint the
// frontend calls to discover which workspaces exist before one is active.
app.use("/api/users", requireAuth, userRouter);
app.use("/api/notifications", requireAuth, notificationRouter);
app.use("/api/search", requireAuth, requireWorkspace, searchRouter);
app.use("/api/chat", requireAuth, requireWorkspace, chatRouter);
// Deliberately public -- this is the read endpoint for shared meeting links,
// gated only by an unguessable shareToken and meeting.isPublic, not a login.
app.use("/api/public", publicRouter);
app.use("/api/pdf", requireAuth, requireWorkspace, pdfRouter);
app.use("/api/analytics", requireAuth, requireWorkspace, analyticsRouter);

// Start worker
worker.on("ready", () => console.log("Worker ready"));

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

export default app;
