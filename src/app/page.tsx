import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-6">
        <h1 className="text-6xl font-semibold" style={{ fontFamily: "var(--font-geist)" }}>
          Lynqis
        </h1>
        <p className="text-lg text-text-secondary">Every meeting, decoded.</p>
        <div className="flex gap-3 justify-center pt-4">
          <Button variant="primary" size="lg">Get Started</Button>
          <Button variant="secondary" size="lg">Learn More</Button>
        </div>
        <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto pt-12">
          <Card>
            <p className="text-sm text-text-secondary">Instant Transcription</p>
          </Card>
          <Card>
            <p className="text-sm text-text-secondary">AI Summary</p>
          </Card>
          <Card>
            <p className="text-sm text-text-secondary">Export Anywhere</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
