import { Download } from "lucide-react";
import { Button } from "@hexnest/ui";
import type { AyaCue } from "../domain/types";
import { exportAllData } from "../storage/db";

interface DataPortProps {
  onCue: (cue: AyaCue) => void;
}

export function DataPort({ onCue }: DataPortProps) {
  async function downloadExport(): Promise<void> {
    const payload = await exportAllData();
    const blob = new Blob([payload], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `aya-japan-tutor-${new Date().toISOString().slice(0, 10)}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
    onCue({ mood: "saved", bubble: "Local study data exported." });
  }

  return (
    <section className="work-panel data-port">
      <div className="panel-head">
        <div>
          <p className="eyebrow">Local Data</p>
          <h2>Backup</h2>
        </div>
      </div>
      <Button type="button" variant="ghost" onClick={() => void downloadExport()}>
        <Download size={16} />
        Export JSON
      </Button>
    </section>
  );
}

