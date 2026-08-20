import type { LocaleCode } from "@/lib/i18n/locale-context";

export interface UploadCounterDictionary {
  meetingsLabel: string;
  unlimitedOn: string;
  upgradeForUnlimited: string;
}

export const uploadCounterDictionary: Record<LocaleCode, UploadCounterDictionary> = {
  en: {
    meetingsLabel: "meetings this month",
    unlimitedOn: "Unlimited on",
    upgradeForUnlimited: "Upgrade to Pro for unlimited",
  },
  fr: {
    meetingsLabel: "réunions ce mois-ci",
    unlimitedOn: "Illimité avec",
    upgradeForUnlimited: "Passez à Pro pour un accès illimité",
  },
};
