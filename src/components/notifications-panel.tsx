"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { X, CheckCircle2, AlertTriangle, Info, Bell } from "lucide-react";
import { getNotifications, markAllNotificationsRead, type Notification } from "@/lib/api";
import { useDictionary } from "@/lib/i18n/locale-context";
import { notificationsDictionary, type NotificationsDictionary } from "@/lib/i18n/dictionaries/notifications";

interface NotificationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const CLOSE_ANIMATION_MS = 200;

// NotificationType enum values (see prisma/schema.prisma) arrive uppercase
// from the API; normalized to lowercase here since it's only ever compared
// against string literals, never persisted or sent back.
function getNotificationIcon(type: string) {
  switch (type.toLowerCase()) {
    case "success":
      return CheckCircle2;
    case "warning":
      return AlertTriangle;
    case "info":
      return Info;
    default:
      return Bell;
  }
}

function timeAgo(iso: string, t: NotificationsDictionary): string {
  const seconds = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (seconds < 60) return t.justNow;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return t.minutesAgo(minutes);
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return t.hoursAgo(hours);
  const days = Math.floor(hours / 24);
  return t.daysAgo(days);
}

export default function NotificationsPanel({ isOpen, onClose }: NotificationsPanelProps) {
  const t = useDictionary(notificationsDictionary);
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (isOpen && session?.user?.id) {
      getNotifications().then(setNotifications);
    }
  }, [isOpen, session?.user?.id]);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setClosing(false);
      return;
    }
    if (!shouldRender) return;
    setClosing(true);
    const timer = setTimeout(() => {
      setShouldRender(false);
      setClosing(false);
    }, CLOSE_ANIMATION_MS);
    return () => clearTimeout(timer);
    // shouldRender is only read here to skip the timer when already closed --
    // it must stay out of the deps or the timer would reset on its own change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const markAllRead = async () => {
    if (!session?.user?.id) return;
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    await markAllNotificationsRead();
  };

  const unread = notifications.filter((n) => !n.read);
  const earlier = notifications.filter((n) => n.read);

  if (!shouldRender) return null;

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/40 ${closing ? "animate-fade-out" : "animate-fade-in"}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className={`fixed inset-y-0 right-0 w-full md:w-[400px] z-50 bg-surface/80 backdrop-blur-md border-l border-border flex flex-col shadow-2xl ${
          closing ? "animate-drawer-out" : "animate-drawer-in"
        }`}
      >
        {/* Panel Header */}
        <div className="p-6 flex items-center justify-between border-b border-border">
          <div className="flex items-center gap-3">
            {unread.length > 0 && (
              <span className="bg-success text-background text-[10px] px-1.5 py-0.5 rounded-full font-bold">{unread.length}</span>
            )}
            <button onClick={markAllRead} className="text-success text-sm hover:opacity-80 transition-opacity cursor-pointer">{t.markAllRead}</button>
          </div>
          <button onClick={onClose} aria-label={t.closeAriaLabel} className="text-text-secondary hover:text-text-primary cursor-pointer">
            <X size={20} />
          </button>
        </div>

        {/* Notification List */}
        <div className="flex-1 overflow-y-auto py-4">
          {notifications.length === 0 && (
            <p className="text-sm text-text-secondary text-center px-6 py-8">{t.noNotifications}</p>
          )}

          {unread.length > 0 && (
            <div className="px-4 mb-4">
              <p className="text-xs font-bold uppercase tracking-widest text-text-secondary px-4 mb-4">{t.unread}</p>
              {unread.map((notification) => {
                const Icon = getNotificationIcon(notification.type);
                return (
                  <div key={notification.id} className="p-4 rounded-xl cursor-pointer transition-all flex gap-4 relative hover:bg-surface/50">
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 w-2 h-2 bg-success rounded-full"></div>
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                      notification.type.toLowerCase() === "success" ? "bg-success/20 text-success" :
                      notification.type.toLowerCase() === "warning" ? "bg-warning/20 text-warning" :
                      "bg-info/20 text-info"
                    }`}>
                      <Icon size={18} />
                    </div>
                    <div className="flex-1 pr-6">
                      <p className="font-medium leading-tight">{notification.title}</p>
                      <p className="text-sm text-text-secondary mt-1 line-clamp-2">{notification.message}</p>
                      <p className="text-[10px] text-text-secondary mt-2">{timeAgo(notification.createdAt, t)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {earlier.length > 0 && (
            <div className="px-4">
              <p className="text-xs font-bold uppercase tracking-widest text-text-secondary px-4 mb-4">{t.earlier}</p>
              {earlier.map((notification) => {
                const Icon = getNotificationIcon(notification.type);
                return (
                  <div key={notification.id} className="p-4 rounded-xl cursor-pointer transition-all flex gap-4 opacity-80 hover:bg-surface/50">
                    <div className="w-10 h-10 rounded-lg bg-surface flex items-center justify-center text-text-secondary shrink-0">
                      <Icon size={18} />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium leading-tight">{notification.title}</p>
                      <p className="text-sm text-text-secondary mt-1">{notification.message}</p>
                      <p className="text-[10px] text-text-secondary mt-2">{timeAgo(notification.createdAt, t)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
