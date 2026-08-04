export const PLAN_LIMITS = {
  FREE: {
    maxMeetingsPerMonth: 5,
    maxMeetingDurationMinutes: 30,
    exportsEnabled: false,
    chatEnabled: false,
    pdfExportEnabled: false,
    analyticsEnabled: false,
  },
  PRO: {
    maxMeetingsPerMonth: Infinity,
    maxMeetingDurationMinutes: 180,
    exportsEnabled: true,
    chatEnabled: true,
    pdfExportEnabled: true,
    analyticsEnabled: true,
  },
} as const;

export type PlanName = keyof typeof PLAN_LIMITS;
