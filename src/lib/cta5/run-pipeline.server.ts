import { randomUUID } from "node:crypto";
import { spawn } from "node:child_process";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

// Server-only: shells out to the Python CTA5 G3 pipeline (pipeline/generate_character.py).
// Never import this from client code — it touches the filesystem and env secrets.
if (typeof window !== "undefined") {
  throw new Error("run-pipeline.server is server-only");
}

const REPO_ROOT = process.cwd();
const PYTHON_BIN = process.env.PYTHON_BIN || "python3";
const MAX_UPLOAD_BYTES = 15 * 1024 * 1024;
const MAX_JOB_MS = 4 * 60 * 1000;

const EXT_BY_MIME = new Map<string, string>([
  ["image/jpeg", ".jpg"],
  ["image/jpg", ".jpg"],
  ["image/png", ".png"],
]);

export class PipelineError extends Error {
  status: number;
  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
  }
}

type GenerateInput = {
  front: File;
  back: File | null;
  name: string;
};

export type GenerateGate = { id: string; ok: boolean; label: string };

export type GenerateResult = {
  zip: Buffer;
  fileName: string;
  gates: GenerateGate[];
  gatesPassed: number;
  gatesTotal: number;
  hasBack: boolean;
};

function extFor(file: File): string {
  const byMime = EXT_BY_MIME.get(file.type);
  if (byMime) return byMime;
  const lower = file.name.toLowerCase();
  if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return ".jpg";
  if (lower.endsWith(".png")) return ".png";
  throw new PipelineError(
    `فرمت عکس پشتیبانی نمی‌شود: «${file.type || file.name}». فقط JPG یا PNG.`,
  );
}

async function saveUpload(file: File, dest: string): Promise<void> {
  if (file.size === 0) throw new PipelineError("فایل عکس خالی است.");
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new PipelineError(
      `حجم عکس بیش از حد مجاز است (حداکثر ${Math.floor(MAX_UPLOAD_BYTES / 1024 / 1024)}MB).`,
    );
  }
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(dest, buffer);
}

function runPython(args: string[]): Promise<{ code: number; stdout: string; stderr: string }> {
  return new Promise((resolve, reject) => {
    const child = spawn(PYTHON_BIN, args, { cwd: REPO_ROOT, env: process.env });
    let stdout = "";
    let stderr = "";
    const timer = setTimeout(() => {
      child.kill("SIGKILL");
      reject(new PipelineError("پردازش بیش از حد طول کشید و متوقف شد.", 504));
    }, MAX_JOB_MS);
    child.stdout.on("data", (chunk: Buffer) => {
      stdout += chunk.toString();
    });
    child.stderr.on("data", (chunk: Buffer) => {
      stderr += chunk.toString();
    });
    child.on("error", (err) => {
      clearTimeout(timer);
      reject(new PipelineError(`اجرای python3 ممکن نشد: ${err.message}`, 500));
    });
    child.on("close", (code) => {
      clearTimeout(timer);
      resolve({ code: code ?? 1, stdout, stderr });
    });
  });
}

export async function generateCharacter({
  front,
  back,
  name,
}: GenerateInput): Promise<GenerateResult> {
  if (!process.env.HF_TOKEN && !process.env.HUGGING_FACE_HUB_TOKEN) {
    throw new PipelineError(
      "HF_TOKEN تنظیم نشده. یک Access Token از huggingface.co/settings/tokens بساز و آن را به‌عنوان متغیر محیطی HF_TOKEN در تنظیمات محیط قرار بده — این سرویس توکن را از بدنهٔ درخواست قبول نمی‌کند.",
      400,
    );
  }

  const jobId = randomUUID();
  const jobDir = await mkdtemp(join(tmpdir(), `cta5-${jobId}-`));
  const safeName =
    (name || "Character").replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 40) || "Character";

  try {
    const frontPath = join(jobDir, `front${extFor(front)}`);
    await saveUpload(front, frontPath);

    let backPath: string | null = null;
    if (back && back.size > 0) {
      backPath = join(jobDir, `back${extFor(back)}`);
      await saveUpload(back, backPath);
    }

    const outZip = join(jobDir, `${safeName}_G3_CTA5.zip`);
    const outReport = join(jobDir, "report.json");
    const args = [
      join(REPO_ROOT, "pipeline", "generate_character.py"),
      "--front",
      frontPath,
      "--job-dir",
      join(jobDir, "work"),
      "--out-zip",
      outZip,
      "--out-report",
      outReport,
      "--name",
      safeName,
    ];
    if (backPath) args.push("--back", backPath);

    const { code, stdout, stderr } = await runPython(args);
    if (code !== 0) {
      const tail = (stderr || stdout).trim().split("\n").slice(-6).join("\n");
      throw new PipelineError(`پایپ‌لاین شکست خورد:\n${tail || "خطای نامشخص"}`, 502);
    }

    const zipBuffer = await readFile(outZip);
    let gates: GenerateGate[] = [];
    let gatesPassed = 0;
    let gatesTotal = 0;
    try {
      const report = JSON.parse(await readFile(outReport, "utf8")) as {
        gates?: { id: string; ok: boolean; label: string }[];
        gatesPassed?: number;
        gatesTotal?: number;
      };
      gates = (report.gates ?? []).map((g) => ({ id: g.id, ok: g.ok, label: g.label }));
      gatesPassed = report.gatesPassed ?? gates.filter((g) => g.ok).length;
      gatesTotal = report.gatesTotal ?? gates.length;
    } catch {
      // report is best-effort — the zip is still valid without it.
    }

    return {
      zip: zipBuffer,
      fileName: `${safeName}_G3_CTA5.zip`,
      gates,
      gatesPassed,
      gatesTotal,
      hasBack: backPath !== null,
    };
  } finally {
    await rm(jobDir, { recursive: true, force: true }).catch(() => {});
  }
}
