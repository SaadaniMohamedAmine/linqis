import rateLimit from "express-rate-limit";

export const uploadRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 10, // 10 uploads / 15min / IP
  message: { error: "Too many uploads. Please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

export const apiRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 min
  max: 60, // 60 req/min/IP
  message: { error: "Too many requests. Please slow down." },
  standardHeaders: true,
  legacyHeaders: false,
});
