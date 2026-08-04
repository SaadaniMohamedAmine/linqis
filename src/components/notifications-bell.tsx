"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import NotificationsPanel from "@/components/notifications-panel";

export function NotificationsBell() {
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  return (
    <>
      <Button variant="ghost" size="sm" onClick={() => setNotificationsOpen(true)} aria-label="Notifications">
        🔔
      </Button>
      <NotificationsPanel isOpen={notificationsOpen} onClose={() => setNotificationsOpen(false)} />
    </>
  );
}
