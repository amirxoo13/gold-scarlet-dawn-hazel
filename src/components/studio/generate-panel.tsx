import { useState } from "react";
import { Sparkles, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Gate = { id: string; ok: boolean; label: string };

type Status =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "error"; message: string }
  | { kind: "done"; fileName: string; gates: Gate[]; gatesPassed: number; gatesTotal: number };

function FileField({
  label,
  hint,
  file,
  onChange,
}: {
  label: string;
  hint: string;
  file: File | null;
  onChange: (file: File | null) => void;
}) {
  return (
    <label className="flex min-h-28 cursor-pointer flex-col justify-center gap-1 rounded-md border border-dashed border-border bg-bg px-4 py-3 transition-colors hover:border-accent/60">
      <input
        type="file"
        accept="image/jpeg,image/png,image/jpg"
        className="hidden"
        onChange={(e) => onChange(e.target.files?.[0] ?? null)}
      />
      <div className="flex items-center gap-2 text-sm font-medium text-fg">
        <UploadCloud className="size-4 text-muted" />
        {label}
      </div>
      <p className="truncate font-mono text-[11px] text-faint">{file ? file.name : hint}</p>
    </label>
  );
}

export function GeneratePanel() {
  const [front, setFront] = useState<File | null>(null);
  const [back, setBack] = useState<File | null>(null);
  const [name, setName] = useState("Character");
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  async function handleGenerate() {
    if (!front) return;
    setStatus({ kind: "loading" });
    try {
      const form = new FormData();
      form.set("front", front);
      if (back) form.set("back", back);
      form.set("name", name || "Character");

      const response = await fetch("/api/generate", { method: "POST", body: form });
      if (!response.ok) {
        let message = `خطای سرور (${response.status})`;
        try {
          const body = (await response.json()) as { error?: string };
          if (body.error) message = body.error;
        } catch {
          // response wasn't JSON — keep the generic message
        }
        setStatus({ kind: "error", message });
        return;
      }

      const blob = await response.blob();
      const disposition = response.headers.get("Content-Disposition") ?? "";
      const fileName =
        /filename="([^"]+)"/.exec(disposition)?.[1] ?? `${name || "Character"}_G3_CTA5.zip`;
      const gates: Gate[] = JSON.parse(
        decodeURIComponent(response.headers.get("X-CTA5-Gates") ?? "[]"),
      );
      const gatesPassed = Number(
        response.headers.get("X-CTA5-Gates-Passed") ?? gates.filter((g) => g.ok).length,
      );
      const gatesTotal = Number(response.headers.get("X-CTA5-Gates-Total") ?? gates.length);

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      setStatus({ kind: "done", fileName, gates, gatesPassed, gatesTotal });
    } catch (err) {
      setStatus({ kind: "error", message: err instanceof Error ? err.message : "خطای غیرمنتظره" });
    }
  }

  const loading = status.kind === "loading";

  return (
    <section className="border-b border-border bg-surface px-4 py-4 lg:px-6">
      <div className="rounded-xl bg-subtle p-4">
        <div className="flex items-start gap-2">
          <Sparkles className="mt-0.5 size-4 shrink-0 text-accent" />
          <div className="min-w-0 flex-1">
            <h2 className="text-sm font-semibold leading-tight tracking-tight">
              از عکس خودت کاراکتر G3 بساز
            </h2>
            <p className="mt-1 max-w-2xl text-xs leading-relaxed text-muted">
              یک عکس تمام‌قد جلو (و اختیاری، عکس پشت) آپلود کن. پارس بدن با FASHN روی Hugging Face
              انجام می‌شود و PSD نهایی از همان قالب رسمی HumanwithSpriteHand ساخته می‌شود — چند
              دقیقه طول می‌کشد.
            </p>
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <FileField
            label="عکس جلو (الزامی)"
            hint="JPG یا PNG، تمام‌قد"
            file={front}
            onChange={setFront}
          />
          <FileField
            label="عکس پشت (اختیاری)"
            hint="برای پر شدن BackHair"
            file={back}
            onChange={setBack}
          />
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="نام کاراکتر"
            className="h-11 w-48 rounded-sm bg-bg px-3 text-sm text-fg shadow-[var(--shadow-border)] outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
          />
          <Button onClick={handleGenerate} disabled={!front || loading} className="shrink-0">
            {loading ? "در حال تولید…" : "تولید کاراکتر G3"}
          </Button>
          {status.kind === "done" ? (
            <Badge tone={status.gatesPassed === status.gatesTotal ? "ok" : "warn"}>
              گیت‌ها {status.gatesPassed}/{status.gatesTotal}
            </Badge>
          ) : null}
        </div>

        {status.kind === "error" ? (
          <pre className="mt-3 whitespace-pre-wrap rounded-md bg-bad/10 p-3 font-mono text-[11px] leading-relaxed text-bad">
            {status.message}
          </pre>
        ) : null}

        {status.kind === "done" ? (
          <div className="mt-3 space-y-2">
            <p className="text-xs text-muted">
              دانلود شد: <span className="font-mono text-fg">{status.fileName}</span> — استخراج کن و
              PSD جلو را روی صحنهٔ Cartoon Animator 5 دراپ کن.
            </p>
            {status.gates.filter((g) => !g.ok).length > 0 ? (
              <ul className="grid gap-1 sm:grid-cols-2">
                {status.gates
                  .filter((g) => !g.ok)
                  .map((g) => (
                    <li
                      key={g.id}
                      className={cn(
                        "rounded-md bg-bg px-3 py-2 text-xs leading-relaxed text-muted",
                      )}
                    >
                      باز: {g.label}
                    </li>
                  ))}
              </ul>
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}
