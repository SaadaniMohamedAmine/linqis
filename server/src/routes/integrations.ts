import { Router } from "express";
import { getZoomRecordings, downloadZoomRecording } from "../services/integrations/zoom";
import { getGoogleAuthUrl, getGoogleCalendarEvents } from "../services/integrations/google-calendar";
import { getPrisma } from "../db";

export const router = Router();

// Zoom Routes
router.get("/zoom/recordings", async (req, res) => {
  try {
    const { from, to } = req.query;
    const recordings = await getZoomRecordings(from as string, to as string);
    res.json(recordings);
  } catch (error) {
    console.error("Zoom recordings error:", error);
    res.status(500).json({ error: "Failed to fetch Zoom recordings" });
  }
});

router.post("/zoom/import", async (req, res) => {
  try {
    const { recordingId, downloadUrl, title } = req.body;
    const prisma = getPrisma();

    // Download the recording
    const buffer = await downloadZoomRecording(downloadUrl);
    
    // Here you would typically upload to storage and create a meeting record
    // For now, we just acknowledge the import
    res.json({ status: "imported", recordingId });
  } catch (error) {
    console.error("Zoom import error:", error);
    res.status(500).json({ error: "Failed to import Zoom recording" });
  }
});

// Google Calendar Routes
router.get("/google-calendar/auth-url", (req, res) => {
  try {
    const authUrl = getGoogleAuthUrl();
    res.json({ authUrl });
  } catch (error) {
    console.error("Google Calendar auth URL error:", error);
    res.status(500).json({ error: "Failed to generate auth URL" });
  }
});

router.get("/google-calendar/events", async (req, res) => {
  try {
    const { accessToken, timeMin, timeMax } = req.query;
    if (!accessToken) {
      return res.status(400).json({ error: "Access token required" });
    }
    
    const events = await getGoogleCalendarEvents(
      accessToken as string,
      timeMin as string,
      timeMax as string
    );
    res.json(events);
  } catch (error) {
    console.error("Google Calendar events error:", error);
    res.status(500).json({ error: "Failed to fetch calendar events" });
  }
});
