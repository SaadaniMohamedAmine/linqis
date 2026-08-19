import type { LocaleCode } from "@/lib/i18n/locale-context";

export interface NotificationsDictionary {
  bellAriaLabel: string;
  closeAriaLabel: string;
  markAllRead: string;
  noNotifications: string;
  unread: string;
  earlier: string;
  justNow: string;
  minutesAgo: (n: number) => string;
  hoursAgo: (n: number) => string;
  daysAgo: (n: number) => string;
}

export const notificationsDictionary: Record<LocaleCode, NotificationsDictionary> = {
  en: {
    bellAriaLabel: "Notifications",
    closeAriaLabel: "Close notifications",
    markAllRead: "Mark all read",
    noNotifications: "No notifications yet.",
    unread: "Unread",
    earlier: "Earlier",
    justNow: "just now",
    minutesAgo: (n) => `${n} min${n > 1 ? "s" : ""} ago`,
    hoursAgo: (n) => `${n} hour${n > 1 ? "s" : ""} ago`,
    daysAgo: (n) => `${n} day${n > 1 ? "s" : ""} ago`,
  },
  fr: {
    bellAriaLabel: "Notifications",
    closeAriaLabel: "Fermer les notifications",
    markAllRead: "Tout marquer comme lu",
    noNotifications: "Aucune notification pour le moment.",
    unread: "Non lues",
    earlier: "Plus tôt",
    justNow: "à l'instant",
    minutesAgo: (n) => `il y a ${n} min${n > 1 ? "s" : ""}`,
    hoursAgo: (n) => `il y a ${n} heure${n > 1 ? "s" : ""}`,
    daysAgo: (n) => `il y a ${n} jour${n > 1 ? "s" : ""}`,
  },
};
