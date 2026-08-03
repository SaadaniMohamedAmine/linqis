import Link from "next/link";

export function PublicFooter() {
  return (
    <footer className="border-t border-border py-12 bg-background">
      <div className="max-w-[1440px] mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-success">Lynqis</span>
            <span className="text-xs text-text-secondary">© 2026 Lynqis AI Inc.</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-text-secondary">
            <Link href="#" className="hover:text-success transition-colors">GitHub</Link>
            <Link href="#" className="hover:text-success transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-success transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-success transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
