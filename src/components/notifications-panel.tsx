"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { getNotifications, markAllNotificationsRead, type Notification } from "@/lib/api";

interface NotificationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

function timeAgo(iso: string): string {
  const seconds = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min${minutes > 1 ? "s" : ""} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? "s" : ""} ago`;
}

export default function NotificationsPanel({ isOpen, onClose }: NotificationsPanelProps) {
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (isOpen && session?.user?.id) {
      getNotifications(session.user.id).then(setNotifications);
    }
  }, [isOpen, session?.user?.id]);

  const markAllRead = async () => {
    if (!session?.user?.id) return;
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    await markAllNotificationsRead(session.user.id);
  };

  const unread = notifications.filter((n) => !n.read);
  const earlier = notifications.filter((n) => n.read);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-full md:w-[400px] z-50 bg-surface/80 backdrop-blur-md border-l border-border flex flex-col shadow-2xl">
      {/* Panel Header */}
      <div className="p-6 flex items-center justify-between border-b border-border">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-text-primary">Notifications</h2>
          {unread.length > 0 && (
            <span className="bg-success text-background text-[10px] px-1.5 py-0.5 rounded-full font-bold">{unread.length}</span>
          )}
        </div>
        <button onClick={markAllRead} className="text-success text-sm hover:opacity-80 transition-opacity">Mark all read</button>
      </div>

      {/* Notification List */}
      <div className="flex-1 overflow-y-auto py-4">
        {notifications.length === 0 && (
          <p className="text-sm text-text-secondary text-center px-6 py-8">No notifications yet.</p>
        )}

        {unread.length > 0 && (
          <div className="px-4 mb-4">
            <p className="text-xs font-bold uppercase tracking-widest text-text-secondary px-4 mb-4">Unread</p>
            {unread.map((notification) => (
              <div key={notification.id} className="p-4 rounded-xl cursor-pointer transition-all flex gap-4 relative hover:bg-surface/50">
                <div className="absolute right-4 top-1/2 -translate-y-1/2 w-2 h-2 bg-success rounded-full"></div>
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                  notification.type.toLowerCase() === "success" ? "bg-success/20 text-success" :
                  notification.type.toLowerCase() === "warning" ? "bg-warning/20 text-warning" :
                  "bg-info/20 text-info"
                }`} />
                <div className="flex-1 pr-6">
                  <p className="font-medium leading-tight">{notification.title}</p>
                  <p className="text-sm text-text-secondary mt-1 line-clamp-2">{notification.message}</p>
                  <p className="text-[10px] text-text-secondary mt-2">{timeAgo(notification.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {earlier.length > 0 && (
          <div className="px-4">
            <p className="text-xs font-bold uppercase tracking-widest text-text-secondary px-4 mb-4">Earlier</p>
            {earlier.map((notification) => (
              <div key={notification.id} className="p-4 rounded-xl cursor-pointer transition-all flex gap-4 opacity-80 hover:bg-surface/50">
                <div className="w-10 h-10 rounded-lg bg-surface flex items-center justify-center text-text-secondary shrink-0" />
                <div className="flex-1">
                  <p className="font-medium leading-tight">{notification.title}</p>
                  <p className="text-sm text-text-secondary mt-1">{notification.message}</p>
                  <p className="text-[10px] text-text-secondary mt-2">{timeAgo(notification.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Panel Footer */}
      <div className="p-6 border-t border-border bg-surface-low">
        <Button variant="secondary" className="w-full gap-2" onClick={onClose}>
          Close Panel
        </Button>
      </div>
    </div>
  );
}
