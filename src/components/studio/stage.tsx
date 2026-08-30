import { useState } from "react";
import { STAGE_MODES, BONE_EDGES, type LabView, type LabViewId, type StageMode } from "@/lib/lab";
import { cn } from "@/lib/utils";

type Props = {
  viewId: LabViewId;
  view: LabView;
  mode: StageMode;
  onMode: (mode: StageMode) => void;
  selectedGroup: string | null;
  isolatedMask: string | null;
};

export function Stage({ viewId, view, mode, onMode, selectedGroup, isolatedMask }: Props) {
  const canvas = view.canvas?.[0] && view.canvas?.[1] ? view.canvas : [1916, 2152];
  const src = sourceForMode(view, mode);
  const dest = selectedGroup && (mode === "filled" || mode === "bones") ? view.dests[selectedGroup] : null;
  const slot = selectedGroup && (mode === "filled" || mode === "bones") ? view.slots?.[selectedGroup] : null;
  const showBones = mode === "bones";
  const maskHit = isolatedMask ? view.masks.find((m) => m.label === isolatedMask) : null;
  const isPsdSpace = mode === "filled" || mode === "bones";
  const isInpaint = mode === "inpaint" && Boolean(view.inpaint);
  const aspect = isPsdSpace ? `${canvas[0]} / ${canvas[1]}` : "438 / 1264";
  const [split, setSplit] = useState(46);
  const pixels = view.inpaintPixels;

  return (
    <section className="flex min-h-0 min-w-0 flex-col bg-bg">
      <div className="flex flex-wrap items-center gap-2 border-b border-border px-3 py-2 lg:px-4">
        <div className="flex flex-wrap gap-1">
          {STAGE_MODES.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onMode(item.id)}
              className={cn(
                "h-11 rounded-sm px-3 text-sm transition-[background-color,color] duration-150",
                mode === item.id ? "bg-accent text-accent-fg" : "text-muted hover:bg-subtle hover:text-fg",
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
        <p className="ms-auto hidden font-mono text-[11px] text-faint md:block">
          {viewId === "front" ? "FRONT" : "BACK"} · {isPsdSpace ? `${canvas[0]}×${canvas[1]}` : "source"}
        </p>
      </div>

      <div className="stage-grid relative min-h-[280px] flex-1 overflow-hidden lg:min-h-0">
        <div className="flex h-full min-h-[280px] items-center justify-center p-4 sm:p-6">
          <figure
            className="relative h-[min(58dvh,560px)] max-w-full lg:h-[min(70dvh,720px)]"
            style={{ aspectRatio: aspect }}
            dir={isInpaint ? "ltr" : undefined}
          >
            {isInpaint ? (
              <>
                <img
                  src={view.source}
                  alt=""
                  className="lab-frame absolute inset-0 h-full w-full object-contain"
                  draggable={false}
                />
                <img
                  src={view.inpaint}
                  alt=""
                  className="absolute inset-0 h-full w-full object-contain"
                  style={{ clipPath: `inset(0 0 0 ${split}%)` }}
                  draggable={false}
                />
                {view.holes ? (
                  <img
                    src={view.holes}
                    alt=""
                    className="pointer-events-none absolute inset-0 h-full w-full object-contain"
                  />
                ) : null}
                <div
                  className="pointer-events-none absolute inset-y-0 w-px bg-accent"
                  style={{ left: `${split}%` }}
                  aria-hidden
                />
              </>
            ) : (
              <img
                src={src}
                alt={viewId === "front" ? "نمای جلو کاراکتر" : "نمای پشت کاراکتر"}
                className="lab-frame absolute inset-0 h-full w-full object-contain"
                draggable={false}
              />
            )}

            {mode === "seg" && maskHit ? (
              <img
                src={maskHit.file}
                alt=""
                className="pointer-events-none absolute inset-0 h-full w-full object-contain opacity-70 mix-blend-screen"
              />
            ) : null}

            {(showBones || dest || slot) && (
              <svg
                viewBox={`0 0 ${canvas[0]} ${canvas[1]}`}
                className="pointer-events-none absolute inset-0 h-full w-full text-accent"
                aria-hidden
              >
                {showBones
                  ? BONE_EDGES.map(([a, b]) => {
                      const pa = view.bonesHuman[a];
                      const pb = view.bonesHuman[b];
                      if (!pa || !pb) return null;
                      return (
                        <line
                          key={`${a}-${b}`}
                          x1={pa[0]}
                          y1={pa[1]}
                          x2={pb[0]}
                          y2={pb[1]}
                          stroke="currentColor"
                          strokeWidth="7"
                          strokeLinecap="round"
                          opacity="0.9"
                        />
                      );
                    })
                  : null}
                {showBones
                  ? Object.entries(view.bonesHuman).map(([name, pt]) => (
                      <circle key={name} cx={pt[0]} cy={pt[1]} r="16" fill="currentColor" />
                    ))
                  : null}
                {slot ? (
                  <rect
                    x={slot[0]}
                    y={slot[1]}
                    width={Math.max(1, slot[2] - slot[0])}
                    height={Math.max(1, slot[3] - slot[1])}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="6"
                    strokeDasharray="18 14"
                    opacity="0.35"
                  />
                ) : null}
                {dest ? (
                  <rect
                    x={dest[0]}
                    y={dest[1]}
                    width={Math.max(1, dest[2] - dest[0])}
                    height={Math.max(1, dest[3] - dest[1])}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    opacity="0.95"
                  />
                ) : null}
              </svg>
            )}
          </figure>
        </div>
      </div>

      {isInpaint ? (
        <div className="flex flex-col gap-2 border-t border-border px-4 py-3" dir="ltr">
          <div className="flex items-center justify-between gap-3 text-[12px] text-muted">
            <span>اصل</span>
            <span className="font-mono text-[11px] text-faint">
              {view.inpaintMethod ?? "Telea"}
              {pixels?.underarm != null ? ` · underarm ${pixels.underarm}` : ""}
              {pixels?.forehead != null ? ` · forehead ${pixels.forehead}` : ""}
            </span>
            <span>ترمیم</span>
          </div>
          <input
            type="range"
            min={8}
            max={92}
            value={split}
            onChange={(event) => setSplit(Number(event.target.value))}
            className="h-11 w-full"
            aria-label="مقایسه عکس و ترمیم"
          />
        </div>
      ) : (
        <div className="border-t border-border px-4 py-3 text-[12px] leading-relaxed text-faint">
          فایل PSD را در Cartoon Animator 5 رها کنید تا G3 Human شناسایی شود.
          {mode === "filled" || mode === "bones"
            ? " خط‌چین = اسلات T-pose قالب · کادر توپر = اسپرایت ژست ایستاده."
            : ""}
        </div>
      )}
    </section>
  );
}

function sourceForMode(view: LabView, mode: StageMode): string {
  switch (mode) {
    case "photo":
      return view.source;
    case "seg":
      return view.overlay;
    case "cutout":
      return view.cutout;
    case "inpaint":
      return view.inpaint || view.source;
    case "filled":
    case "bones":
      return view.filled;
    default:
      return view.source;
  }
}