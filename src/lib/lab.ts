import bakedRunJson from "./lab-run.json";

export type LabViewId = "front" | "back";

export type LabMask = {
  label: string;
  file: string;
  color: string;
  coverage?: number | null;
  bbox?: number[] | null;
};

export type LabView = {
  source: string;
  overlay: string;
  cutout: string;
  filled: string;
  psd: string;
  inpaint?: string;
  holes?: string;
  inpaintMethod?: string | null;
  inpaintPixels?: { underarm?: number; forehead?: number };
  placed: string[];
  modes: Record<string, string>;
  splits: Record<string, string>;
  dests: Record<string, number[]>;
  slots?: Record<string, number[]>;
  bonesHuman: Record<string, number[]>;
  bonesHead: Record<string, number[]>;
  hiddenDummyPixels: number;
  movedBones: number;
  contentBox: number[];
  canvas: number[];
  masks: LabMask[];
  parser?: string;
  lrParser?: string | null;
};

export type LabGate = {
  id: string;
  ok: boolean;
  label: string;
  detail: string;
};

export type LabMapping = {
  parser: string;
  g3: string;
  mode: string;
  note: string;
};

export type LabPack = {
  href: string;
  file: string;
};

export type LabRun = {
  name: string;
  character: string;
  template: {
    file: string;
    source: string;
    url: string;
    size: number[];
    contentBox: number[];
  };
  parser: { id: string; lr?: string | null };
  pack?: LabPack;
  views: Record<LabViewId, LabView>;
  mapping: LabMapping[];
  gates: LabGate[];
};

export const BAKED_RUN = bakedRunJson as LabRun;

export const BONE_EDGES: [string, string][] = [
  ["Hip", "Torso"],
  ["Torso", "Neck"],
  ["Neck", "Head"],
  ["Head", "Head_Nub"],
  ["Hip", "LThigh"],
  ["LThigh", "LShank"],
  ["LShank", "LFoot"],
  ["LFoot", "LFoot2"],
  ["LFoot2", "LToe"],
  ["LToe", "LToe_Nub"],
  ["Hip", "RThigh"],
  ["RThigh", "RShank"],
  ["RShank", "RFoot"],
  ["RFoot", "RFoot2"],
  ["RFoot2", "RToe"],
  ["RToe", "RToe_Nub"],
  ["Neck", "LArm"],
  ["LArm", "LForearm"],
  ["LForearm", "LHand"],
  ["LHand", "LHand_Nub"],
  ["Neck", "RArm"],
  ["RArm", "RForearm"],
  ["RForearm", "RHand"],
  ["RHand", "RHand_Nub"],
];

export const STAGE_MODES = [
  { id: "photo", label: "عکس" },
  { id: "seg", label: "تقطیع FASHN" },
  { id: "cutout", label: "برش" },
  { id: "inpaint", label: "ترمیم" },
  { id: "filled", label: "پرشده G3" },
  { id: "bones", label: "استخوان" },
] as const;

export type StageMode = (typeof STAGE_MODES)[number]["id"];

export const FALLBACK_RUN: LabRun = BAKED_RUN;

export async function loadLabRun(): Promise<LabRun> {
  const response = await fetch("/lab/run.json", { cache: "no-store" });
  if (!response.ok) return FALLBACK_RUN;
  return (await response.json()) as LabRun;
}

export function gateScore(run: LabRun): { pass: number; total: number } {
  const total = run.gates.length;
  const pass = run.gates.filter((g) => g.ok).length;
  return { pass, total };
}
