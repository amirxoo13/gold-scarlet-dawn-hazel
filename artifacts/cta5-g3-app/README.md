# cta5-g3-app

پایپ‌لاین تصویر تخت به PSD شابلون Cartoon Animator 5 (G3 Human).
درخت لایه از صفر ساخته نمی‌شود.

## شابلون رسمی

دانلود:

`https://file.reallusion.com/cta/Cartoon_Animator_5_PSD_Pipeline_Resource.zip`

پس از unzip، پیش‌فرض انسان جلو:

`official/Cartoon_Animator_5_PSD_Pipeline_Resource/01. Templates/PSD(Photoshop, Affinity Photo, Photopea,Clip Studio Paint, Krita)/Human/HumanwithSpriteHand.psd`

بوم: 1916x2152 — ریشه‌ها `RL_ImageV2` / `RL_Bone_HumanV2` / `RL_Bone_HeadV2`.

در این بسته شابلون پشت‌سر جدا نیست.

## ورودی فعلی

- `input/front.png` — رو به دوربین (438x1264)
- `input/back.png` — پشت‌سر (414x1264)

## فرمان‌ها

```bash
python3 dump_psd_tree.py "$TEMPLATE"

python3 parse_character.py input/front.png --out-dir masks/front
python3 parse_character.py input/back.png --out-dir masks/back

python3 fill_template.py \
  --template "$TEMPLATE" \
  --image input/front.png \
  --masks masks/front \
  --view front \
  --out out/front_filled.psd
```

`fill_template.py` نشانگر استخوان را جابه‌جا نمی‌کند و گروه جدید نمی‌سازد.

## هنوز نیست

- inpaint سوراخ لباس زیر بازو
- جداسازی دقیق ران/ساق از یک ماسک `legs`
- Talking Head کامل (چشم و دهان sprite)
- تضمین motion-capture تا وقتی فایل در CTA5 باز و تست نشده
