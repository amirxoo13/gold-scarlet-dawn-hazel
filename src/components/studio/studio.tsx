import { useEffect, useState } from "react";
import {
  BAKED_RUN,
  FALLBACK_RUN,
  loadLabRun,
  type LabRun,
  type LabViewId,
  type StageMode,
} from "@/lib/lab";
import { Badge } from "@/components/ui/badge";
import { TooltipProvider } from "@/components/ui/tooltip";
import { GeneratePanel } from "@/components/studio/generate-panel";
import { Inspector } from "@/components/studio/inspector";
import { PackBanner, PackDownload } from "@/components/studio/pack-download";
import { Stage } from "@/components/studio/stage";
import { cn } from "@/lib/utils";

type InspectorTab = "gates" | "map" | "tree" | "masks";

export function Studio() {
  const [run, setRun] = useState<LabRun>(BAKED_RUN ?? FALLBACK_RUN);
  const [ready, setReady] = useState(false);
  const [viewId, setViewId] = useState<LabViewId>("front");
  const [mode, setMode] = useState<StageMode>("photo");
  const [tab, setTab] = useState<InspectorTab>("gates");
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [isolatedMask, setIsolatedMask] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    loadLabRun()
      .then((data) => {
        if (!cancelled) {
          setRun(data);
          setReady(true);
        }
      })
      .catch(() => {
        if (!cancelled) setReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const view = run.views[viewId];

  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex min-h-dvh flex-col bg-bg text-fg">
        <header className="border-b border-border px-4 py-3 lg:px-6">
          <div className="stagger-in flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-3">
              <span className="grid size-9 place-items-center rounded-md bg-subtle font-mono text-[11px] tracking-tight text-accent">
                G3
              </span>
              <div>
                <p className="text-xs font-medium tracking-wide text-muted">Cartoon Animator 5</p>
                <h1 className="text-lg font-semibold leading-tight tracking-tight">G3 Rig Lab</h1>
              </div>
            </div>
            <p className="max-w-xl text-sm leading-relaxed text-muted">
              عکس دوبعدی به PSD انسان G3 — قالب رسمی HumanwithSpriteHand
            </p>
            <div className="ms-auto flex flex-wrap items-center gap-2">
              <Badge tone="accent">{run.character}</Badge>
              <Badge tone={ready && view.placed.length > 0 ? "ok" : "warn"}>
                {ready && view.placed.length > 0 ? "FASHN پر شده" : "در انتظار پارس"}
              </Badge>
              <PackDownload run={run} label="دانلود ZIP" />
            </div>
          </div>
        </header>

        <GeneratePanel />
        <PackBanner run={run} />

        <div className="flex flex-wrap items-center gap-2 border-b border-border px-4 py-2 lg:px-6">
          {(["front", "back"] as const).map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => {
                setViewId(id);
                setSelectedGroup(null);
                setIsolatedMask(null);
              }}
              className={cn(
                "h-11 rounded-sm px-4 text-sm transition-[background-color,color] duration-150",
                viewId === id ? "bg-subtle text-fg" : "text-muted hover:text-fg",
              )}
            >
              {id === "front" ? "نمای جلو" : "نمای پشت"}
            </button>
          ))}
          <p className="ms-auto hidden font-mono text-[11px] text-faint sm:block">
            {run.parser.id}
            {run.parser.lr ? ` · L/R ${run.parser.lr}` : ""}
          </p>
        </div>

        <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[22rem_minmax(0,1fr)]">
          <div className="order-2 min-h-0 lg:order-1">
            <Inspector
              run={run}
              viewId={viewId}
              view={view}
              tab={tab}
              onTab={setTab}
              selectedGroup={selectedGroup}
              onSelectGroup={(name) => {
                setSelectedGroup(name);
                if (name) setMode("filled");
              }}
              isolatedMask={isolatedMask}
              onIsolateMask={(label) => {
                setIsolatedMask(label);
                if (label) setMode("seg");
              }}
            />
          </div>
          <div className="order-1 min-h-0 lg:order-2">
            <Stage
              viewId={viewId}
              view={view}
              mode={mode}
              onMode={setMode}
              selectedGroup={selectedGroup}
              isolatedMask={isolatedMask}
            />
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
