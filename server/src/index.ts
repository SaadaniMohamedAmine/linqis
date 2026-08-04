import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { router as meetingRouter } from "./routes/meetings";
import { router as queueRouter } from "./routes/queue";
import { router as uploadRouter } from "./routes/upload";
import { router as exportRouter } from "./routes/exports";
import { router as integrationRouter } from "./routes/integrations";
import { router as actionItemRouter } from "./routes/action-items";
import { router as userRouter } from "./routes/user";
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

app.use("/api/meetings", meetingRouter);
app.use("/api/queue", queueRouter);
app.use("/api/upload", uploadRouter);
app.use("/api/export", exportRouter);
app.use("/api/integrations", integrationRouter);
app.use("/api/action-items", actionItemRouter);
app.use("/api/users", userRouter);

// Start worker
worker.on("ready", () => console.log("Worker ready"));

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

export default app;
