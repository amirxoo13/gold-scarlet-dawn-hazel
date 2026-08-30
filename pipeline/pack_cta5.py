#!/usr/bin/env python3
"""Build the single ZIP a user can extract and drop into Cartoon Animator 5."""

from __future__ import annotations

import zipfile
from pathlib import Path

ROOT = Path("/workspace/public/lab")
OUT = ROOT / "SHARAF_G3_CTA5.zip"

IMPORT = """\ufeffبسته ایمپورت SHARAF #9  —  Cartoon Animator 5
================================================

فایل اصلی کاراکتر (همین را ایمپورت کنید):
    SHARAF_G3_Front.psd

این PSD قالب رسمی Reallusion است:
    HumanwithSpriteHand.psd
    ریشهها: RL_ImageV2 / RL_Bone_HumanV2 / RL_Bone_HeadV2
    دست: Sprite Hand (00Relaxed)

ایمپورت
-------
1. Cartoon Animator 5 را باز کنید.
2. پروژه جدید بسازید.
3. فایل SHARAF_G3_Front.psd را روی صحنه بکشید و رها کنید (Drag & Drop).
4. موتور باید G3 Human را بشناسد.
5. از Content Manager یک موشن G3 Human (Idle / Walk / Soccer) روی کاراکتر بیندازید.

نمای پشت
--------
SHARAF_G3_Back.psd همان قالب جلو است که با عکس پشت پر شده.
برای کاراکتر ۳۶۰ درجه کامل، قالب Side رسمی جداگانه لازم است.
این بسته Front + Back است.

اگر CTA5 فایل را نپذیرفت
------------------------
خروجی psd-tools گاهی با فتوشاپ یکی نیست.
1. SHARAF_G3_Front.psd را در https://www.photopea.com باز کنید
2. File > Save as PSD  (همین Save کافی است — ساختار لایه‌ها را دست نزنید)
3. فایل ذخیره‌شده را دوباره روی CTA5 دراپ کنید

اگر سر قالب ماند و بدن درست بود
-------------------------------
خطای «naming of the group of the multi-angle view of the face»:
گروه Face فقط باید پوشه زاویه به نام Center داشته باشد.
این نسخه پیکسل صورت را داخل Face/Center/Face می‌گذارد (نام رسمی Face).
لایه Face_fill دیگر وجود ندارد.

محتوای ZIP
----------
SHARAF_G3_Front.psd     کاراکتر جلو — فایل ایمپورت اصلی
SHARAF_G3_Back.psd      کاراکتر پشت
Source/front.png        عکس ورودی جلو
Source/back.png         عکس ورودی پشت
Preview/front_g3.png    پیشنمایش لایههای پرشده جلو
Preview/back_g3.png     پیشنمایش لایههای پرشده پشت
IMPORT.txt              همین راهنما

محدودیت
-------
قطعات داخل اسلات T-pose آدمک رسمی نشستهاند (بازوها باز).
استخوانها جابهجا نشدهاند. موشن کتابخانهٔ G3 Human روی همین حالت استراحت کار میکند.
اگر کاراکتر را ایستاده ببینی، اول Apply یک Idle/Cheer Dance بزن.
"""


def add(zf: zipfile.ZipFile, src: Path, name: str) -> None:
    if not src.is_file():
        raise SystemExit(f"missing {src}")
    zf.write(src, name)
    print(f"  {src.stat().st_size:10d}  {name}")


def main() -> int:
    files = {
        "SHARAF_G3_Front.psd": ROOT / "front_filled.psd",
        "SHARAF_G3_Back.psd": ROOT / "back_filled.psd",
        "Source/front.png": ROOT / "front.png",
        "Source/back.png": ROOT / "back.png",
        "Preview/front_g3.png": ROOT / "front_filled.png",
        "Preview/back_g3.png": ROOT / "back_filled.png",
    }
    OUT.parent.mkdir(parents=True, exist_ok=True)
    tmp = OUT.with_suffix(".zip.tmp")
    with zipfile.ZipFile(tmp, "w", compression=zipfile.ZIP_DEFLATED) as zf:
        zf.writestr("IMPORT.txt", IMPORT.encode("utf-8"))
        print(f"  {len(IMPORT.encode('utf-8')):10d}  IMPORT.txt")
        for name, src in files.items():
            add(zf, src, name)
    tmp.replace(OUT)
    print("wrote", OUT, "bytes", OUT.stat().st_size)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
