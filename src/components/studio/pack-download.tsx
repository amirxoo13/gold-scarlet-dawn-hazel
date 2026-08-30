import { FileArchive } from "lucide-react";
import { cn } from "@/lib/utils";
import type { LabRun } from "@/lib/lab";

const DEFAULT_HREF = "/lab/SHARAF_G3_CTA5.zip";
const DEFAULT_FILE = "SHARAF_G3_CTA5.zip";

export function packHref(run?: LabRun | null) {
  return run?.pack?.href ?? DEFAULT_HREF;
}

export function packFile(run?: LabRun | null) {
  return run?.pack?.file ?? DEFAULT_FILE;
}

type Props = {
  run?: LabRun | null;
  className?: string;
  label?: string;
};

export function PackDownload({ run, className, label = "دانلود بسته ایمپورت CTA5" }: Props) {
  return (
    <a
      href={packHref(run)}
      download={packFile(run)}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex h-11 items-center justify-center gap-2 rounded-sm bg-accent px-4 text-sm font-medium text-accent-fg transition-[opacity,transform] duration-150 ease-out hover:opacity-90 active:scale-[0.96]",
        className,
      )}
    >
      <FileArchive className="size-4" />
      {label}
    </a>
  );
}

export function PackBanner({ run }: { run: LabRun }) {
  return (
    <section className="border-b border-border bg-surface px-4 py-4 lg:px-6">
      <div className="rounded-xl bg-subtle p-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium tracking-wide text-muted">یک فایل برای تست در Cartoon Animator 5</p>
            <h2 className="mt-1 text-lg font-semibold leading-tight tracking-tight">بسته ایمپورت SHARAF #9</h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
              ZIP شامل PSD جلو، PSD پشت، عکس اصلی و راهنمای ایمپورت. استخراج کنید، سپس
              <span className="font-mono text-fg"> SHARAF_G3_Front.psd </span>
              را روی صحنه CTA5 بکشید.
            </p>
          </div>
          <PackDownload run={run} className="h-12 w-full shrink-0 px-5 lg:w-auto" />
        </div>
        <ol className="mt-4 grid gap-2 text-sm leading-relaxed text-muted sm:grid-cols-2 lg:grid-cols-4">
          <li className="rounded-md bg-bg px-3 py-3">
            <span className="font-mono text-[11px] text-faint">01</span>
            <p className="mt-1">ZIP را Extract کنید</p>
          </li>
          <li className="rounded-md bg-bg px-3 py-3">
            <span className="font-mono text-[11px] text-faint">02</span>
            <p className="mt-1">Cartoon Animator 5 را باز کنید</p>
          </li>
          <li className="rounded-md bg-bg px-3 py-3">
            <span className="font-mono text-[11px] text-faint">03</span>
            <p className="mt-1">Front.psd را روی صحنه دراپ کنید</p>
          </li>
          <li className="rounded-md bg-bg px-3 py-3">
            <span className="font-mono text-[11px] text-faint">04</span>
            <p className="mt-1">یک موشن G3 Human اعمال کنید</p>
          </li>
        </ol>
      </div>
    </section>
  );
}
