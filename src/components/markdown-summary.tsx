import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// The AI summary comes back as markdown (**bold**, bullet lists), but every
// consumer used to interpolate it as a raw string -- component overrides use
// the app's own design tokens instead of @tailwindcss/typography's `prose`
// so headings/bold/lists match the rest of the dashboard.
export function MarkdownSummary({ text }: { text: string }) {
  return (
    <div className="text-text-primary leading-relaxed space-y-3">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          p: ({ children }) => <p className="leading-relaxed">{children}</p>,
          strong: ({ children }) => <strong className="font-semibold text-text-primary">{children}</strong>,
          ul: ({ children }) => <ul className="list-disc list-inside space-y-1">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal list-inside space-y-1">{children}</ol>,
          li: ({ children }) => <li className="text-text-primary">{children}</li>,
          h1: ({ children }) => <h4 className="text-base font-semibold text-success mt-2">{children}</h4>,
          h2: ({ children }) => <h4 className="text-base font-semibold text-success mt-2">{children}</h4>,
          h3: ({ children }) => <h4 className="text-base font-semibold text-success mt-2">{children}</h4>,
          a: ({ children, href }) => (
            <a href={href} target="_blank" rel="noopener noreferrer" className="text-success hover:underline">
              {children}
            </a>
          ),
        }}
      >
        {text}
      </ReactMarkdown>
    </div>
  );
}
