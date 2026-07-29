import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { router as meetingRouter } from "./routes/meetings";
import { router as queueRouter } from "./routes/queue";
import { worker } from "./queue/worker";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:3000" }));
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/meetings", meetingRouter);
app.use("/api/queue", queueRouter);

// Start worker
worker.on("ready", () => console.log("Worker ready"));

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

export default app;
