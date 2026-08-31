#!/usr/bin/env python3
"""End-to-end CTA5 G3 character generator: one or two photos -> import-ready package.

Wraps the existing, already-gated pipeline stages for a single job:
  parse_character.py -> inpaint_holes.py -> fill_template.py   (per view)
then zips the result into a package CTA5 can Drag & Drop.

This does not touch the fixed "G3 Rig Lab" demo assets under public/lab —
it writes everything under a caller-supplied --job-dir, so it is safe to run
concurrently for different users/jobs.

Front photo is mandatory. Back photo is optional: if omitted, BackHair /
the back-view PSD are simply not produced, and the job report says so
honestly instead of pretending the back was generated.
"""

from __future__ import annotations

import argparse
import json
import subprocess
import sys
import zipfile
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))

from assemble_run import gates as compute_gates  # noqa: E402


DEFAULT_TEMPLATE = (
    HERE.parent
    / "artifacts"
    / "cta5-g3-app"
    / "official"
    / "Cartoon_Animator_5_PSD_Pipeline_Resource"
    / "01. Templates"
    / "PSD(Photoshop, Affinity Photo, Photopea,Clip Studio Paint, Krita)"
    / "Human"
    / "HumanwithSpriteHand.psd"
)

IMPORT_TEMPLATE = """﻿بستهٔ ایمپورت {name} — Cartoon Animator 5
================================================

فایل اصلی کاراکتر (همین را ایمپورت کنید):
    {name}_G3_Front.psd

این PSD قالب رسمی Reallusion است:
    HumanwithSpriteHand.psd
    ریشه‌ها: RL_ImageV2 / RL_Bone_HumanV2 / RL_Bone_HeadV2
    دست: Sprite Hand (00Relaxed)

ایمپورت
-------
1. Cartoon Animator 5 را باز کنید.
2. پروژهٔ جدید بسازید.
3. فایل {name}_G3_Front.psd را روی صحنه بکشید و رها کنید (Drag & Drop).
4. موتور باید G3 Human را بشناسد.
5. از Content Manager یک موشن G3 Human (Idle / Walk) روی کاراکتر بیندازید.

{back_note}
اگر CTA5 فایل را نپذیرفت
------------------------
خروجی psd-tools گاهی با فتوشاپ یکی نیست.
1. {name}_G3_Front.psd را در https://www.photopea.com باز کنید
2. File > Save as PSD  (همین Save کافی است — ساختار لایه‌ها را دست نزنید)
3. فایل ذخیره‌شده را دوباره روی CTA5 دراپ کنید

اگر سر قالب ماند و بدن درست بود
-------------------------------
خطای «naming of the group of the multi-angle view of the face»:
گروه Face فقط باید پوشهٔ زاویه به نام Center داشته باشد.
این نسخه پیکسل صورت را داخل Face/Center/Face می‌گذارد (نام رسمی Face).

محدودیت
-------
قطعات داخل اسلات T-pose آدمک رسمی نشسته‌اند (بازوها باز).
استخوان‌ها جابه‌جا نشده‌اند — موشن کتابخانهٔ G3 Human روی همین حالت استراحت کار می‌کند.
اگر کاراکتر را ایستاده دیدی، اول یک Idle/Cheer Dance را Apply کن.
"""

BACK_NOTE_WITH = """نمای پشت
--------
{name}_G3_Back.psd همان قالب جلو است که با عکس پشت پر شده.
برای کاراکتر ۳۶۰ درجه کامل، قالب Side رسمی جداگانه لازم است — این بسته Front + Back است.
"""

BACK_NOTE_WITHOUT = """نمای پشت
--------
این بسته فقط از روی عکس جلو ساخته شده؛ فایل Back در آن نیست.
برای BackHair/نمای پشت، همین اسکریپت را یک‌بار دیگر با --back اجرا کن.
"""


def run(cmd: list[str]) -> None:
    print("+", " ".join(str(c) for c in cmd))
    result = subprocess.run(cmd)
    if result.returncode != 0:
        raise SystemExit(f"stage failed ({result.returncode}): {' '.join(str(c) for c in cmd)}")


def process_view(python: str, template: Path, image: Path, job_dir: Path, view: str) -> dict:
    masks_dir = job_dir / "masks" / view
    run([python, str(HERE / "parse_character.py"), "--image", str(image), "--out", str(masks_dir), "--view", view])

    inpainted = job_dir / f"{view}_inpainted.png"
    run(
        [
            python,
            str(HERE / "inpaint_holes.py"),
            "--image",
            str(image),
            "--masks",
            str(masks_dir),
            "--out-image",
            str(inpainted),
            "--out-overlay",
            str(job_dir / f"{view}_holes.png"),
            "--out-report",
            str(job_dir / f"{view}_inpaint_report.json"),
        ]
    )

    filled_psd = job_dir / f"{view}_filled.psd"
    filled_preview = job_dir / f"{view}_filled.png"
    fill_report = job_dir / f"{view}_report.json"
    run(
        [
            python,
            str(HERE / "fill_template.py"),
            "--template",
            str(template),
            "--image",
            str(inpainted),
            "--masks",
            str(masks_dir),
            "--out",
            str(filled_psd),
            "--preview",
            str(filled_preview),
            "--report",
            str(fill_report),
            "--view",
            view,
        ]
    )
    return json.loads(fill_report.read_text(encoding="utf-8"))


def build_zip(
    out_zip: Path,
    name: str,
    front_image: Path,
    front_psd: Path,
    front_preview: Path,
    back_image: Path | None,
    back_psd: Path | None,
    back_preview: Path | None,
) -> None:
    out_zip.parent.mkdir(parents=True, exist_ok=True)
    back_note = BACK_NOTE_WITH.format(name=name) if back_psd else BACK_NOTE_WITHOUT
    import_txt = IMPORT_TEMPLATE.format(name=name, back_note=back_note)
    tmp = out_zip.with_suffix(".zip.tmp")
    with zipfile.ZipFile(tmp, "w", compression=zipfile.ZIP_DEFLATED) as zf:
        zf.writestr("IMPORT.txt", import_txt.encode("utf-8"))
        zf.write(front_psd, f"{name}_G3_Front.psd")
        zf.write(front_image, f"Source/front{front_image.suffix}")
        zf.write(front_preview, "Preview/front_g3.png")
        if back_psd is not None and back_image is not None and back_preview is not None:
            zf.write(back_psd, f"{name}_G3_Back.psd")
            zf.write(back_image, f"Source/back{back_image.suffix}")
            zf.write(back_preview, "Preview/back_g3.png")
    tmp.replace(out_zip)


def main() -> int:
    parser = argparse.ArgumentParser(description="Generate one CTA5 G3 character package from photo(s).")
    parser.add_argument("--front", type=Path, required=True, help="front-view photo (jpg/png)")
    parser.add_argument("--back", type=Path, default=None, help="optional back-view photo (jpg/png)")
    parser.add_argument("--template", type=Path, default=DEFAULT_TEMPLATE)
    parser.add_argument("--job-dir", type=Path, required=True, help="scratch directory for this job")
    parser.add_argument("--out-zip", type=Path, required=True)
    parser.add_argument("--out-report", type=Path, default=None)
    parser.add_argument("--name", default="Character")
    parser.add_argument("--python", default=sys.executable)
    args = parser.parse_args()

    if not args.front.is_file():
        print(f"front photo not found: {args.front}", file=sys.stderr)
        return 2
    if args.back is not None and not args.back.is_file():
        print(f"back photo not found: {args.back}", file=sys.stderr)
        return 2
    if not args.template.is_file():
        print(f"template not found: {args.template}", file=sys.stderr)
        print("official package: https://file.reallusion.com/cta/Cartoon_Animator_5_PSD_Pipeline_Resource.zip", file=sys.stderr)
        return 2

    args.job_dir.mkdir(parents=True, exist_ok=True)

    front_report = process_view(args.python, args.template, args.front, args.job_dir, "front")
    back_report = process_view(args.python, args.template, args.back, args.job_dir, "back") if args.back else {}

    front_manifest = json.loads((args.job_dir / "masks" / "front" / "manifest.json").read_text(encoding="utf-8"))
    back_manifest = (
        json.loads((args.job_dir / "masks" / "back" / "manifest.json").read_text(encoding="utf-8")) if args.back else {}
    )

    build_zip(
        out_zip=args.out_zip,
        name=args.name,
        front_image=args.front,
        front_psd=args.job_dir / "front_filled.psd",
        front_preview=args.job_dir / "front_filled.png",
        back_image=args.back,
        back_psd=(args.job_dir / "back_filled.psd") if args.back else None,
        back_preview=(args.job_dir / "back_filled.png") if args.back else None,
    )

    gate_list = compute_gates(front_report, back_report, front_manifest, back_manifest)
    report = {
        "name": args.name,
        "template": str(args.template),
        "hasBack": args.back is not None,
        "zip": str(args.out_zip),
        "front": front_report,
        "back": back_report,
        "gates": gate_list,
        "gatesPassed": sum(1 for g in gate_list if g["ok"]),
        "gatesTotal": len(gate_list),
    }
    if args.out_report is not None:
        args.out_report.parent.mkdir(parents=True, exist_ok=True)
        args.out_report.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")

    print(f"wrote {args.out_zip}")
    print(f"gates: {report['gatesPassed']}/{report['gatesTotal']} passed")
    for gate in gate_list:
        if not gate["ok"]:
            print(f"  open: {gate['id']} — {gate['label']} ({gate['detail']})")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
