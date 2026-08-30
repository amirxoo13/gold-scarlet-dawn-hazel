import { Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { PackDownload } from "@/components/studio/pack-download";
import { gateScore, type LabRun, type LabView, type LabViewId } from "@/lib/lab";
import { cn } from "@/lib/utils";

type Tab = "gates" | "map" | "tree" | "masks";

type Props = {
  run: LabRun;
  viewId: LabViewId;
  view: LabView;
  tab: Tab;
  onTab: (tab: Tab) => void;
  selectedGroup: string | null;
  onSelectGroup: (name: string | null) => void;
  isolatedMask: string | null;
  onIsolateMask: (label: string | null) => void;
};

const TABS: { id: Tab; label: string }[] = [
  { id: "gates", label: "گیت‌ها" },
  { id: "map", label: "نگاشت" },
  { id: "tree", label: "درخت G3" },
  { id: "masks", label: "ماسک" },
];

const G3_GROUPS = [
  "Face",
  "FrontHair",
  "BackHair",
  "Hip",
  "LArm",
  "RArm",
  "LForearm",
  "RForearm",
  "LHand",
  "RHand",
  "LThigh",
  "RThigh",
  "LShank",
  "RShank",
  "LFoot",
  "RFoot",
];

export function Inspector({
  run,
  viewId,
  view,
  tab,
  onTab,
  selectedGroup,
  onSelectGroup,
  isolatedMask,
  onIsolateMask,
}: Props) {
  const score = gateScore(run);

  return (
    <aside className="flex min-h-0 flex-col border-border bg-surface lg:border-s">
      <div className="flex gap-1 overflow-x-auto border-b border-border px-2 py-2">
        {TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onTab(item.id)}
            className={cn(
              "h-11 shrink-0 rounded-sm px-3 text-sm transition-[background-color,color] duration-150",
              tab === item.id ? "bg-subtle text-fg" : "text-muted hover:text-fg",
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-4">
        {tab === "gates" ? (
          <div className="space-y-3">
            <div className="flex items-baseline justify-between gap-3">
              <h2 className="text-sm font-medium">کیفیت پایپ‌لاین</h2>
              <p className="font-mono text-xs tabular-nums text-muted">
                {score.pass}/{score.total}
              </p>
            </div>
            <ul className="space-y-2">
              {run.gates.map((gate) => (
                <li key={gate.id} className="rounded-md bg-subtle p-3">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm leading-snug">{gate.label}</p>
                    <Badge tone={gate.ok ? "ok" : "warn"}>{gate.ok ? "قبول" : "باز"}</Badge>
                  </div>
                  <p className="mt-1 font-mono text-[11px] leading-relaxed text-faint">{gate.detail}</p>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {tab === "map" ? (
          <div className="space-y-3">
            <h2 className="text-sm font-medium">FASHN → گروه رسمی</h2>
            <p className="text-xs leading-relaxed text-muted">
              نام لایه‌ها از قالب Reallusion است. هیچ گروه جدیدی ساخته نمی‌شود.
            </p>
            <ul className="space-y-2">
              {run.mapping.map((row) => (
                <li key={row.g3} className="rounded-md bg-subtle p-3">
                  <p className="font-mono text-xs text-accent">{row.g3}</p>
                  <p className="mt-1 font-mono text-[11px] text-muted">{row.parser}</p>
                  <p className="mt-1 text-xs text-faint">{row.note}</p>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {tab === "tree" ? (
          <div className="space-y-3">
            <h2 className="text-sm font-medium">RL_ImageV2</h2>
            <p className="text-xs text-muted">
              انتخاب گروه، bbox قالب را روی پیش‌نمایش پرشده مشخص می‌کند.
            </p>
            <ul className="space-y-1">
              {G3_GROUPS.map((name) => {
                const placed = view.placed.includes(name);
                const active = selectedGroup === name;
                return (
                  <li key={name}>
                    <button
                      type="button"
                      onClick={() => onSelectGroup(active ? null : name)}
                      className={cn(
                        "flex h-11 w-full items-center justify-between rounded-sm px-3 text-start font-mono text-xs transition-[background-color] duration-150",
                        active ? "bg-accent text-accent-fg" : "hover:bg-subtle",
                      )}
                    >
                      <span>{name}</span>
                      <span className={cn("text-[10px]", active ? "text-accent-fg/70" : "text-faint")}>
                        {placed ? view.modes[name] ?? "fill" : "empty"}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
            <Separator />
            <p className="font-mono text-[11px] leading-relaxed text-faint">
              {run.template.file}
              <br />
              {run.template.size.join(" × ")} · content {run.template.contentBox.join(",")}
            </p>
          </div>
        ) : null}

        {tab === "masks" ? (
          <div className="space-y-3">
            <h2 className="text-sm font-medium">کلاس‌های FASHN</h2>
            <ul className="space-y-1">
              {view.masks.map((mask) => {
                const active = isolatedMask === mask.label;
                return (
                  <li key={mask.label}>
                    <button
                      type="button"
                      onClick={() => onIsolateMask(active ? null : mask.label)}
                      className={cn(
                        "flex h-11 w-full items-center gap-3 rounded-sm px-3 text-start transition-[background-color] duration-150 hover:bg-subtle",
                        active && "bg-subtle",
                      )}
                    >
                      <span
                        className="size-3 shrink-0 rounded-xs"
                        style={{ background: mask.color }}
                        aria-hidden
                      />
                      <span className="font-mono text-xs">{mask.label}</span>
                      <span className="ms-auto font-mono text-[10px] tabular-nums text-faint">
                        {mask.coverage != null ? `${(mask.coverage * 100).toFixed(1)}%` : ""}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
            {view.splits && Object.keys(view.splits).length > 0 ? (
              <p className="font-mono text-[11px] text-faint">
                L/R · {Object.entries(view.splits).map(([k, v]) => `${k}:${v}`).join(" · ")}
              </p>
            ) : null}
          </div>
        ) : null}
      </div>

      <div className="flex flex-col gap-2 border-t border-border p-3">
        <PackDownload run={run} className="w-full" />
        <a
          href={view.psd}
          download={viewId === "front" ? "SHARAF_G3_Front.psd" : "SHARAF_G3_Back.psd"}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-11 items-center justify-center gap-2 rounded-sm bg-subtle px-4 text-sm font-medium text-fg transition-[opacity,transform] duration-150 ease-out hover:opacity-90 active:scale-[0.96]"
        >
          <Download className="size-4" />
          فقط PSD {viewId === "front" ? "جلو" : "پشت"}
        </a>
      </div>
    </aside>
  );
}
