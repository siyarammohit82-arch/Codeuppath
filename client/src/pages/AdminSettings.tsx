import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

export default function AdminSettings() {
  const [liveMode, setLiveMode] = useState(true);

  return (
    <AdminLayout pageTitle="Settings" activeSection="Settings">
      <section className="space-y-6">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_25px_55px_rgba(0,0,0,0.45)]">
          <h2 className="text-2xl font-semibold text-white">Platform controls</h2>
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/30 px-4 py-3">
              <div>
                <p className="text-sm font-semibold text-white">Live mode</p>
                <p className="text-xs text-muted-foreground">Enable or pause all public listings.</p>
              </div>
              <Switch checked={liveMode} onCheckedChange={setLiveMode} />
            </div>
            <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/30 px-4 py-3">
              <div>
                <p className="text-sm font-semibold text-white">Maintenance</p>
                <p className="text-xs text-muted-foreground">Notifications that the platform is undergoing updates.</p>
              </div>
              <Switch checked={!liveMode} onCheckedChange={() => setLiveMode((prev) => !prev)} />
            </div>
            <Button>Save settings</Button>
          </div>
        </div>
      </section>
    </AdminLayout>
  );
}
