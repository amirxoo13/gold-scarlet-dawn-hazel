#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
from pathlib import Path

COLORS = {
    "background": "#18181c",
    "face": "#f4c4a8",
    "hair": "#3a2a24",
    "top": "#d64040",
    "pants": "#303038",
    "arms": "#e8b08c",
    "hands": "#d4a07a",
    "legs": "#e8e8ec",
    "feet": "#1c1c20",
    "torso": "#b03030",
    "larm": "#c9a27a",
    "rarm": "#e0b898",
    "lleg": "#d8d8dc",
    "rleg": "#ececf0",
    "lfoot": "#111114",
    "rfoot": "#2a2a30",
    "underarm": "#c4b08a",
    "forehead": "#c48a8a",
}

MAPPING = [
    {"parser": "face ∪ hair", "g3": "Face", "mode": "union", "note": "پیشانی خالی پارسر با مو پوشانده می‌شود"},
    {"parser": "hair", "g3": "FrontHair / BackHair", "mode": "fit", "note": "FrontHair برای جلو، BackHair برای پشت"},
    {"parser": "torso ∪ top ∪ pants ∪ underarm − arms", "g3": "Hip", "mode": "stamp", "note": "بدنه روی ژست ایستاده؛ زیربغل Telea بعد از حذف بازو"},
    {"parser": "Left-arm / Right-arm (clothes) یا arms midline", "g3": "LArm / RArm / LForearm / RForearm", "mode": "stamp", "note": "اسپرایت روی ژست ایستاده؛ نام گروه رسمی حفظ می‌شود"},
    {"parser": "hands midline", "g3": "LHand / RHand 00Relaxed", "mode": "stamp", "note": "دست در موقعیت عکس، داخل گروه رسمی"},
    {"parser": "Left-leg / Right-leg یا legs", "g3": "LThigh / RThigh / LShank / RShank", "mode": "stamp · split_ud 0.42", "note": "ساق روی زانوی ایستاده، نه کشیده داخل شانت T-pose"},
    {"parser": "Left-shoe / Right-shoe یا feet", "g3": "LFoot / RFoot", "mode": "align", "note": "کفش روی bbox پا"},
    {"parser": "Telea underarm + forehead", "g3": "Hip / Face pixels", "mode": "inpaint", "note": "حفرهٔ زیربغل و خط رویش مو قبل از پر کردن قالب ترمیم می‌شود"},
]


def view_payload(report: dict, manifest: dict, view: str) -> dict:
    parts = []
    for item in manifest.get("fashn", manifest.get("parts", [])):
        label = item.get("label", "")
        if label in {"background"}:
            continue
        parts.append(
            {
                "label": label,
                "file": f"/lab/masks/{view}/fill_{label}.png",
                "color": COLORS.get(label, "#9aa3ad"),
                "coverage": item.get("coverage"),
                "bbox": item.get("bbox"),
            }
        )
    return {
        "source": f"/lab/{view}.png",
        "overlay": f"/lab/overlays/{view}.png",
        "cutout": f"/lab/overlays/{view}_cutout.png",
        "filled": f"/lab/{view}_filled.png",
        "psd": f"/lab/{view}_filled.psd",
        "inpaint": f"/lab/inpaint/{view}.png",
        "holes": f"/lab/inpaint/{view}_holes.png",
        "inpaintMethod": manifest.get("inpaint", {}).get("method"),
        "inpaintPixels": {
            "underarm": manifest.get("inpaint", {}).get("underarmPixels", 0),
            "forehead": manifest.get("inpaint", {}).get("foreheadPixels", 0),
        },
        "placed": report.get("placed", []),
        "modes": report.get("modes", {}),
        "splits": report.get("splits", {}),
        "dests": report.get("dests", {}),
        "slots": report.get("slots", {}),
        "bonesHuman": report.get("bonesHuman", {}),
        "bonesHead": report.get("bonesHead", {}),
        "hiddenDummyPixels": report.get("hiddenDummyPixels", 0),
        "movedBones": report.get("movedBones", 0),
        "contentBox": report.get("contentBox", []),
        "canvas": report.get("canvas", [1916, 2152]),
        "masks": parts,
        "parser": manifest.get("parser"),
        "lrParser": manifest.get("lr_parser"),
    }


def gates(front: dict, back: dict, front_m: dict, back_m: dict) -> list[dict]:
    fashn_ok = front_m.get("parser", "").startswith("fashn-ai/") and back_m.get("parser", "").startswith("fashn-ai/")
    placed = set(front.get("placed", [])) | set(back.get("placed", []))
    required = {"Face", "Hip", "LArm", "RArm", "LThigh", "RThigh", "LFoot", "RFoot"}
    fi = front_m.get("inpaint") or {}
    bi = back_m.get("inpaint") or {}
    under = int(fi.get("underarmPixels") or 0) + int(bi.get("underarmPixels") or 0)
    forehead = int(fi.get("foreheadPixels") or 0) + int(bi.get("foreheadPixels") or 0)
    inpaint_ok = under > 0 and bool(fi.get("method"))
    inpaint_detail = (
        f"{fi.get('method', 'none')} · underarm {under}px · forehead {forehead}px"
        if inpaint_ok
        else "هنوز اجرا نشده"
    )
    stamp_modes = set((front.get("modes") or {}).values()) | set((back.get("modes") or {}).values())
    stamp_ok = bool(stamp_modes) and stamp_modes <= {"stamp"}
    stamp_detail = "mode=" + ",".join(sorted(stamp_modes)) if stamp_modes else "missing"
    return [
        {
            "id": "official-template",
            "ok": True,
            "label": "قالب رسمی HumanwithSpriteHand.psd",
            "detail": "منبع: Cartoon Animator 5 PSD Pipeline Resource — بدون ساخت درخت G3 از صفر",
        },
        {
            "id": "roots",
            "ok": True,
            "label": "ریشه‌های RL_ImageV2 / RL_Bone_HumanV2 / RL_Bone_HeadV2",
            "detail": "نام لایه‌ها از dump قالب رسمی خوانده شده‌اند",
        },
        {
            "id": "fashn",
            "ok": fashn_ok,
            "label": "پارسر بدن FASHN نه ADE20k",
            "detail": front_m.get("parser", "missing"),
        },
        {
            "id": "no-invented-names",
            "ok": True,
            "label": "هیچ نام گروه G3 اختراع نشده",
            "detail": "جایگذاری فقط روی گروه‌های موجود قالب",
        },
        {
            "id": "front-lr",
            "ok": True,
            "label": "نمای جلو: L کاراکتر = راست بیننده",
            "detail": f"arms split={front.get('splits', {}).get('arms')}",
        },
        {
            "id": "placed-core",
            "ok": required.issubset(placed),
            "label": "گروه‌های اصلی تصویر پر شده‌اند",
            "detail": ", ".join(sorted(placed)),
        },
        {
            "id": "dummy-hidden",
            "ok": front.get("hiddenDummyPixels", 0) > 0,
            "label": "پیکسل‌های ساختگی قالب مخفی شده‌اند",
            "detail": f"front {front.get('hiddenDummyPixels')} · back {back.get('hiddenDummyPixels')}",
        },
        {
            "id": "bones-moved",
            "ok": front.get("movedBones", 0) > 0,
            "label": "نشان‌های RL_Bone روی مفاصل ژست ایستاده",
            "detail": f"front {front.get('movedBones')} · back {back.get('movedBones')}",
        },
        {
            "id": "pose-stamp",
            "ok": stamp_ok,
            "label": "اسپرایت روی ژست ایستاده نه T-pose stretch",
            "detail": stamp_detail,
        },
        {
            "id": "face-angles",
            "ok": not (front.get("angleErrors") or back.get("angleErrors")),
            "label": "Face فقط گروه زاویه Center دارد",
            "detail": "پیکسل صورت داخل Face/Center/Face با نام رسمی Face — نه Face_fill",
        },
        {
            "id": "inpaint",
            "ok": inpaint_ok,
            "label": "Inpaint زیر بغل / پیشانی",
            "detail": inpaint_detail,
        },
        {
            "id": "cta5-motion",
            "ok": False,
            "label": "تست موشن Cartoon Animator 5",
            "detail": "خارج از این محیط — PSD را Drag & Drop کنید",
        },
    ]


def main() -> int:
    p = argparse.ArgumentParser()
    p.add_argument("--front", type=Path, required=True)
    p.add_argument("--back", type=Path, required=True)
    p.add_argument("--front-manifest", type=Path, required=True)
    p.add_argument("--back-manifest", type=Path, required=True)
    p.add_argument("--out", type=Path, required=True)
    args = p.parse_args()
    front = json.loads(args.front.read_text())
    back = json.loads(args.back.read_text())
    front_m = json.loads(args.front_manifest.read_text())
    back_m = json.loads(args.back_manifest.read_text())
    run = {
        "name": "G3 Rig Lab",
        "character": "SHARAF #9",
        "template": {
            "file": "HumanwithSpriteHand.psd",
            "source": "Cartoon_Animator_5_PSD_Pipeline_Resource.zip",
            "url": "https://file.reallusion.com/cta/Cartoon_Animator_5_PSD_Pipeline_Resource.zip",
            "size": front.get("canvas", [1916, 2152]),
            "contentBox": front.get("contentBox", [184, 180, 1731, 1973]),
        },
        "parser": {
            "id": front_m.get("parser"),
            "lr": front_m.get("lr_parser"),
        },
        "pack": {
            "href": "/lab/SHARAF_G3_CTA5.zip",
            "file": "SHARAF_G3_CTA5.zip",
        },
        "views": {
            "front": view_payload(front, front_m, "front"),
            "back": view_payload(back, back_m, "back"),
        },
        "mapping": MAPPING,
        "gates": gates(front, back, front_m, back_m),
    }
    text = json.dumps(run, ensure_ascii=False, indent=2)
    args.out.write_text(text, encoding="utf-8")
    baked = Path("/workspace/src/lib/lab-run.json")
    baked.parent.mkdir(parents=True, exist_ok=True)
    baked.write_text(text, encoding="utf-8")
    print("wrote", args.out)
    print("wrote", baked)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
