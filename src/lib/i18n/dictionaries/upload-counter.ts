import type { LocaleCode } from "@/lib/i18n/locale-context";

export interface UploadCounterDictionary {
  unlimitedStatus: (meetingsThisMonth: number) => string;
  limitedStatus: (meetingsThisMonth: number, maxMeetingsPerMonth: number) => string;
  upgradeForUnlimited: string;
}

export const uploadCounterDictionary: Record<LocaleCode, UploadCounterDictionary> = {
  en: {
    unlimitedStatus: (n) => `${n} meeting${n === 1 ? "" : "s"} this month · Unlimited on Pro`,
    limitedStatus: (n, max) => `${n}/${max} meetings this month`,
    upgradeForUnlimited: "Upgrade to Pro for unlimited",
  },
  fr: {
    unlimitedStatus: (n) => `${n} réunion${n > 1 ? "s" : ""} ce mois-ci · Illimité avec Pro`,
    limitedStatus: (n, max) => `${n}/${max} réunions ce mois-ci`,
    upgradeForUnlimited: "Passez à Pro pour un accès illimité",
  },
};
