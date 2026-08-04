"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { searchMeetings, type SearchResult } from "@/lib/api";

export function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [open, setOpen] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      const r = await searchMeetings(query);
      setResults(r);
      setOpen(true);
    }, 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query]);

  return (
    <div className="relative w-full max-w-[360px]">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => results.length > 0 && setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        placeholder="Search meetings, transcripts..."
        className="w-full bg-surface border border-border rounded-lg py-2 px-3 text-sm text-text-primary outline-none focus:border-success"
      />
      {open && results.length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-surface border border-border rounded-lg shadow-lg overflow-hidden z-50">
          {results.map((r) => (
            <button
              key={r.id}
              onClick={() => { router.push(`/dashboard/meetings/${r.id}`); setOpen(false); setQuery(""); }}
              className="w-full text-left p-3 hover:bg-background transition-colors border-b border-border last:border-0 cursor-pointer"
            >
              <p className="font-medium text-text-primary text-sm truncate">{r.title}</p>
              <p className="text-xs text-text-secondary mt-1 line-clamp-2" dangerouslySetInnerHTML={{ __html: r.snippet }} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
