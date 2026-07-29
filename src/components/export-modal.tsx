"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ExportModal({ isOpen, onClose }: ExportModalProps) {
  const [selectedTarget, setSelectedTarget] = useState("notion");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-[380px] bg-surface-high border border-border rounded-xl shadow-lg flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="p-6 border-b border-border flex justify-between items-start">
          <div>
            <h2 className="text-lg font-semibold text-text-primary mb-1">Export Meeting</h2>
            <p className="text-sm text-text-secondary">Choose your destination and target workspace.</p>
          </div>
          <button onClick={onClose} className="text-text-secondary hover:text-text-primary transition-colors cursor-pointer">
            <span></span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 flex flex-col gap-6">
          {/* Notion Option */}
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                checked={selectedTarget === "notion"}
                onChange={() => setSelectedTarget("notion")}
                className="w-5 h-5 text-success border-border bg-surface focus:ring-0 focus:ring-offset-0"
                name="export-target"
                type="radio"
              />
              <div className="flex items-center gap-2 flex-1">
                <span className="text-text-primary"></span>
                <span className="font-medium text-text-primary">Notion</span>
              </div>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-surface-low text-text-secondary border border-border">CONNECTED</span>
            </label>
            <div className="ml-8">
              <div className="relative">
                <select
                  disabled={selectedTarget !== "notion"}
                  className={`w-full bg-background border border-border rounded-lg py-3 px-4 text-sm text-text-primary outline-none appearance-none cursor-pointer ${selectedTarget !== "notion" ? "opacity-50" : ""}`}
                >
                  <option>Q4 Planning Documents</option>
                  <option>Engineering Wiki</option>
                  <option>Product Roadmap</option>
                  <option>New Page...</option>
                </select>
                <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-text-secondary"><span></span></span>
              </div>
            </div>
          </div>

          {/* Slack Option */}
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                checked={selectedTarget === "slack"}
                onChange={() => setSelectedTarget("slack")}
                className="w-5 h-5 text-success border-border bg-surface focus:ring-0 focus:ring-offset-0"
                name="export-target"
                type="radio"
              />
              <div className="flex items-center gap-2 flex-1">
                <span className="text-text-primary"></span>
                <span className="font-medium text-text-primary">Slack</span>
              </div>
            </label>
            <div className="ml-8">
              <div className="relative">
                <select
                  disabled={selectedTarget !== "slack"}
                  className={`w-full bg-background border border-border rounded-lg py-3 px-4 text-sm text-text-primary outline-none appearance-none cursor-pointer ${selectedTarget !== "slack" ? "opacity-50" : ""}`}
                >
                  <option>#general</option>
                  <option>#product-updates</option>
                  <option>#meeting-summaries</option>
                </select>
                <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-text-secondary opacity-50"><span></span></span>
              </div>
            </div>
          </div>

          {/* Email Option */}
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                checked={selectedTarget === "email"}
                onChange={() => setSelectedTarget("email")}
                className="w-5 h-5 text-success border-border bg-surface focus:ring-0 focus:ring-offset-0"
                name="export-target"
                type="radio"
              />
              <div className="flex items-center gap-2 flex-1">
                <span className="text-text-primary"></span>
                <span className="font-medium text-text-primary">Email Recap</span>
              </div>
            </label>
            <div className="ml-8">
              <input
                disabled={selectedTarget !== "email"}
                className={`w-full bg-background border border-border rounded-lg py-3 px-4 text-sm text-text-primary outline-none ${selectedTarget !== "email" ? "opacity-50" : ""}`}
                placeholder="Enter recipient email..."
                type="email"
              />
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-6 bg-surface-low border-t border-border flex gap-4">
          <Button variant="secondary" className="flex-1" onClick={onClose}>Cancel</Button>
          <Button variant="primary" className="flex-1">Export Now</Button>
        </div>
      </div>
    </div>
  );
}
