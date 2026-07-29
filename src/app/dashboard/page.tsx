"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("transcript");

  return (
    <div className="flex flex-col h-full">
      {/* Tabs Header */}
      <div className="flex border-b border-border px-6 pt-4">
        <button onClick={() => setActiveTab("transcript")} className={`px-4 py-2 border-b-2 ${activeTab === "transcript" ? "border-success text-success" : "border-transparent text-text-secondary hover:text-text-primary"} font-medium`}>Transcript</button>
        <button onClick={() => setActiveTab("summary")} className={`px-4 py-2 border-b-2 ${activeTab === "summary" ? "border-success text-success" : "border-transparent text-text-secondary hover:text-text-primary"} font-medium`}>Summary</button>
        <button onClick={() => setActiveTab("actions")} className={`px-4 py-2 border-b-2 ${activeTab === "actions" ? "border-success text-success" : "border-transparent text-text-secondary hover:text-text-primary"} font-medium`}>Actions</button>
        <button onClick={() => setActiveTab("analysis")} className={`px-4 py-2 border-b-2 ${activeTab === "analysis" ? "border-success text-success" : "border-transparent text-text-secondary hover:text-text-primary"} font-medium`}>Analysis</button>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto p-6 pb-32">
        {/* TRANSCRIPT TAB */}
        {activeTab === "transcript" && (
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="bg-surface-high px-2 py-1 rounded-full flex items-center gap-2 border border-border shrink-0 mt-1">
                <div className="w-5 h-5 rounded-full bg-blue-500 overflow-hidden">
                  <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAZbcHmsDGQR2U0fkMuSKpKTgjNCmDgKxgUXZdezIkzQStUApD4mE8qSHTHT7Rb1GjNvwk1pxC_ACNnk7BepDE7g49e69173BpnPS8T3u0pgCsAwrMF9mRB01ut0HoTvkZe9FVocWZSrg9G3UBj8beuq2DaYLIy8dpjETjr87w9RxtrUdluzNV2vJ1X8YZrVmycCIfikWxYH4dGELdupZ1KaSNtcCmCUwHmSnY3CmVtHF5jBGpJsmAM" alt="Sarah" className="w-full h-full object-cover" />
                </div>
                <span className="text-xs font-medium text-info">Sarah Chen</span>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-text-secondary">00:04</span>
                  <button className="text-success"><span></span></button>
                </div>
                <p className="text-text-primary">Alright everyone, let's look at the Q3 roadmap. We need to prioritize the AI summarization layer because user retention is dropping on the legacy dashboard.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-surface-high px-2 py-1 rounded-full flex items-center gap-2 border border-border shrink-0 mt-1">
                <div className="w-5 h-5 rounded-full bg-warning overflow-hidden">
                  <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAlNM2-59CeAAu5ElsGkZJ16hl-YWQSEV8LYDoSJ4HuO-OuapxvGxdCu3O7SxB67miv19yXryQvVuonkm3m8tzSDvVTh9YH9bDno9wJ5pmRoYLx9hP7QzYwoqbCmRIMJHHvMwcJjcimRGbM10IPfKwSnHDZZFEYYr6AA32KkLh9XaWaSlrn-J_Xm0P75h1Rt1NJdSSDLmN6GmxjXPTp-3QDaQ-W-E2ZDyqLPA_7YuGn0ymLJQ3tR7P8" alt="Marcus" className="w-full h-full object-cover" />
                </div>
                <span className="text-xs font-medium text-warning">Marcus J.</span>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-text-secondary">00:12</span>
                  <button className="text-text-secondary"><span></span></button>
                </div>
                <p className="text-text-primary">I agree. The design team has a prototype ready. However, we're seeing some latency issues with the real-time transcription API. We might need to go with an asynchronous approach for the initial launch.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-surface-high px-2 py-1 rounded-full flex items-center gap-2 border border-border shrink-0 mt-1">
                <div className="w-5 h-5 rounded-full bg-success overflow-hidden">
                  <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuB0WFXuCA58bcMznSHpPfj-GxyIETs4lgtsUAG0FB8EzqNBkAd1UGHnCv-knlgtVf6jVdlzbo0KtvqY7hju99NmBmRDvU5dQ2FOA0EspOVIS1kQCqHxhRvOKlOCqHdeA96cWdal7QC3SfCSiGHkTIsa8HRlNn_SxrYj0Bg7CF8BBvBGdwsnlIaSeFE5L2RK1ahUWdEazUNX9uCp-24lINXgyGdMOpwavxmpugV8gBeDvy1ZFKFtJVxC" alt="AI" className="w-full h-full object-cover" />
                </div>
                <span className="text-xs font-medium text-success">AI Assist</span>
              </div>
              <div className="flex flex-col gap-1 bg-surface-low p-4 rounded-lg border-l-2 border-success">
                <div className="flex items-center gap-1">
                  <span className="text-[11px] text-success">00:28 • Insight</span>
                </div>
                <p className="text-text-primary italic">Detected conflict: Marcus mentioned latency issues while Sarah suggested prioritizing AI layer. Suggest reviewing API throughput specs before finalizing sprint scope.</p>
              </div>
            </div>
          </div>
        )}

        {/* SUMMARY TAB */}
        {activeTab === "summary" && (
          <div className="space-y-6">
            <Card className="p-5">
              <h3 className="text-lg font-semibold text-success mb-4">Executive Summary</h3>
              <p className="text-text-primary leading-relaxed">The team discussed the Q3 product strategy, focusing on the integration of an AI-driven summarization layer to combat declining user retention. Key technical hurdles were identified regarding API latency, leading to a proposed shift from real-time to asynchronous processing for V1.</p>
            </Card>
            <div className="grid grid-cols-2 gap-6">
              <Card className="p-5">
                <h4 className="font-medium text-warning mb-4 flex items-center gap-2">
                  <span></span>
                  Key Topics
                </h4>
                <ul className="space-y-2">
                  <li className="flex items-center gap-3 p-2 bg-background/50 rounded-lg">
                    <span className="w-2 h-2 rounded-full bg-success"></span>
                    <span className="text-sm">AI Summarization Integration</span>
                  </li>
                  <li className="flex items-center gap-3 p-2 bg-background/50 rounded-lg">
                    <span className="w-2 h-2 rounded-full bg-warning"></span>
                    <span className="text-sm">User Retention Analytics</span>
                  </li>
                  <li className="flex items-center gap-3 p-2 bg-background/50 rounded-lg">
                    <span className="w-2 h-2 rounded-full bg-info"></span>
                    <span className="text-sm">API Latency Solutions</span>
                  </li>
                </ul>
              </Card>
              <Card className="p-5">
                <h4 className="font-medium text-info mb-4 flex items-center gap-2">
                  <span></span>
                  Main Takeaways
                </h4>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <span className="text-info"></span>
                    <p className="text-sm">Shift to async processing for the AI layer to ensure UX stability.</p>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-info"></span>
                    <p className="text-sm">Prototype review scheduled for next Tuesday at 10 AM.</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* ACTIONS TAB */}
        {activeTab === "actions" && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              <Badge variant="success">All Actions</Badge>
              <Badge variant="neutral">Pending</Badge>
              <Badge variant="neutral">Completed</Badge>
              <Badge variant="danger">High Priority</Badge>
            </div>
            <div className="space-y-3">
              <Card className="p-4 flex items-center justify-between hover:border-border-hover transition-all cursor-pointer">
                <div className="flex items-center gap-4">
                  <input type="checkbox" className="w-5 h-5 rounded border-border bg-background text-success focus:ring-success" />
                  <div>
                    <p className="font-medium text-text-primary">Review API throughput specifications</p>
                    <p className="text-xs text-text-secondary">Due Oct 18 • Marcus J.</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="w-2 h-2 rounded-full bg-danger animate-pulse"></div>
                  <div className="w-8 h-8 rounded-full border border-border overflow-hidden">
                    <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuB4maeh9O_hmElSaoD0dL_C7dXuZbx5DMzN8gjc5PtsyfL7JWkf2ipwiy-J06dJ0JTomPhSaGP-dkYM0_LxC7UwBQ2PLgnOAe3ofvqNWHQs0RIRf_ybgMMfk6DegBJxrqVolPje8ibtttNYOoSlgKMoasQ6jvAaGreJJ_3b6eI6H_lEqZBKB6qz2iyOLhQsdTUDRGvNo8zZS1_0znRfWQBHqXDfKrm9IE6d8CuxejQ1MR2yQdlvNCSt" alt="Marcus" className="w-full h-full object-cover" />
                  </div>
                </div>
              </Card>
              <Card className="p-4 flex items-center justify-between hover:border-border-hover transition-all cursor-pointer">
                <div className="flex items-center gap-4">
                  <input type="checkbox" className="w-5 h-5 rounded border-border bg-background text-success focus:ring-success" />
                  <div>
                    <p className="font-medium text-text-primary">Update Design Prototype with async loading states</p>
                    <p className="text-xs text-text-secondary">Due Oct 20 • Sarah Chen</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="w-2 h-2 rounded-full bg-warning-container"></div>
                  <div className="w-8 h-8 rounded-full border border-border overflow-hidden">
                    <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBTzGQLIFzXIqRo3xYm_81atvV_LxK-XJIG6uIb5estM97x72p7aXh80xm3lkkOFYx8UsVTdPJPCv_-jmZvPy43r7o-ObOVULF0B0Letj3ICTCAhdq-EK1pQDjM4HNfzM_3-4CIL4WvQa9mv9rhS55zIAAjFsgZlNae-eOZvN8CGGZxwuLnzLwiUAesoCj8XQfzPjnkVHoMkclpSPrzElC9GqAi1yaNa95Hdy9kp6aSodYKBWQM21e7" alt="Sarah" className="w-full h-full object-cover" />
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* ANALYSIS TAB */}
        {activeTab === "analysis" && (
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-6">
              <Card className="col-span-1 p-5 flex flex-col items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-success to-transparent"></div>
                <h4 className="font-medium text-text-secondary mb-4">Quality Score</h4>
                <div className="text-5xl font-bold text-success leading-none">7.5</div>
                <div className="text-xs text-text-secondary mt-2">Above benchmark (+1.2)</div>
                <div className="mt-8 relative">
                  <div className="w-3 h-3 bg-success rounded-full animate-ping absolute inset-0 opacity-75"></div>
                  <div className="w-3 h-3 bg-success rounded-full relative z-10"></div>
                </div>
              </Card>
              <Card className="col-span-2 p-5">
                <h4 className="font-medium text-text-secondary mb-6">Participation Distribution</h4>
                <div className="space-y-4">
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-medium">
                      <span>Sarah Chen</span>
                      <span>42%</span>
                    </div>
                    <div className="h-2 w-full bg-background rounded-full overflow-hidden">
                      <div className="h-full bg-success rounded-full" style={{ width: "42%" }}></div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-medium">
                      <span>Marcus J.</span>
                      <span>38%</span>
                    </div>
                    <div className="h-2 w-full bg-background rounded-full overflow-hidden">
                      <div className="h-full bg-warning rounded-full" style={{ width: "38%" }}></div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-medium">
                      <span>AI Assistant</span>
                      <span>20%</span>
                    </div>
                    <div className="h-2 w-full bg-background rounded-full overflow-hidden">
                      <div className="h-full bg-info rounded-full" style={{ width: "20%" }}></div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
            <Card className="p-5">
              <h4 className="font-medium text-text-secondary mb-6">Sentiment Timeline</h4>
              <div className="h-32 flex items-end gap-1 px-4">
                {[30, 45, 60, 20, 75, 90, 80, 65].map((h, i) => (
                  <div key={i} className="flex-1 bg-surface-high hover:bg-success/20 rounded-t transition-all" style={{ height: `${h}%` }}></div>
                ))}
              </div>
              <div className="flex justify-between mt-2 text-[10px] text-text-secondary uppercase tracking-widest px-4">
                <span>00:00</span>
                <span>15:00</span>
                <span>30:00</span>
                <span>45:00</span>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Waveform Player (Bottom Persistent) */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-surface/80 backdrop-blur-md border-t border-border px-6 flex items-center gap-6 z-30">
        <div className="flex items-center gap-4 shrink-0">
          <button className="text-text-secondary hover:text-text-primary transition-all"><span></span></button>
          <button className="w-12 h-12 bg-success text-background rounded-full flex items-center justify-center hover:scale-110 active:scale-95 transition-all">
            <span></span>
          </button>
          <button className="text-text-secondary hover:text-text-primary transition-all"><span></span></button>
        </div>
        <div className="flex-1 flex flex-col gap-1">
          <div className="flex items-end gap-[3px] h-8">
            {[...Array(40)].map((_, i) => (
              <div key={i} className="flex-1 bg-text-secondary/30 rounded-full hover:bg-success transition-all cursor-pointer" style={{ height: `${Math.random() * 24 + 4}px` }}></div>
            ))}
          </div>
          <div className="flex justify-between text-[11px] text-text-secondary">
            <span>04:12</span>
            <span>24:45</span>
          </div>
        </div>
        <div className="flex items-center gap-4 shrink-0">
          <span className="text-text-secondary"><span></span></span>
          <div className="w-24 h-1 bg-border rounded-full overflow-hidden">
            <div className="w-[70%] h-full bg-text-primary"></div>
          </div>
          <button className="text-text-secondary hover:text-success transition-all"><span></span></button>
        </div>
      </div>
    </div>
  );
}
