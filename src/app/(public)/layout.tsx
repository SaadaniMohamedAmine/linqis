import { PublicNavbar } from "@/components/public-navbar";
import { PublicFooter } from "@/components/public-footer";
import { ScrollToTop } from "@/components/scroll-to-top";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-text-primary flex flex-col">
      <PublicNavbar />
      <main className="flex-1 pt-16">
        {children}
      </main>
      <PublicFooter />
      <ScrollToTop />
    </div>
  );
}
