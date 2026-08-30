import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as FileArchive, r as Download } from "../_libs/lucide-react.mjs";
import { t as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { n as Portal, r as Provider, t as Content2 } from "../_libs/@radix-ui/react-tooltip+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-BlEQw_70.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var lab_run_default = {
	name: "G3 Rig Lab",
	character: "SHARAF #9",
	template: {
		"file": "HumanwithSpriteHand.psd",
		"source": "Cartoon_Animator_5_PSD_Pipeline_Resource.zip",
		"url": "https://file.reallusion.com/cta/Cartoon_Animator_5_PSD_Pipeline_Resource.zip",
		"size": [1916, 2152],
		"contentBox": [
			184,
			180,
			1731,
			1973
		]
	},
	parser: {
		"id": "fashn-ai/fashn-human-parser",
		"lr": "mattmdjaga/segformer_b2_clothes"
	},
	pack: {
		"href": "/lab/SHARAF_G3_CTA5.zip",
		"file": "SHARAF_G3_CTA5.zip"
	},
	views: {
		"front": {
			"source": "/lab/front.png",
			"overlay": "/lab/overlays/front.png",
			"cutout": "/lab/overlays/front_cutout.png",
			"filled": "/lab/front_filled.png",
			"psd": "/lab/front_filled.psd",
			"inpaint": "/lab/inpaint/front.png",
			"holes": "/lab/inpaint/front_holes.png",
			"inpaintMethod": "opencv.INPAINT_TELEA",
			"inpaintPixels": {
				"underarm": 69,
				"forehead": 14
			},
			"placed": [
				"Face",
				"FrontHair",
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
				"RFoot"
			],
			"modes": {
				"Face": "stamp",
				"FrontHair": "stamp",
				"Hip": "stamp",
				"LArm": "stamp",
				"RArm": "stamp",
				"LForearm": "stamp",
				"RForearm": "stamp",
				"LHand": "stamp",
				"RHand": "stamp",
				"LThigh": "stamp",
				"RThigh": "stamp",
				"LShank": "stamp",
				"RShank": "stamp",
				"LFoot": "stamp",
				"RFoot": "stamp"
			},
			"splits": {
				"arms": "parser-lr",
				"hands": "midline",
				"legs": "parser-lr",
				"feet": "parser-lr"
			},
			"dests": {
				"Face": [
					897,
					264,
					1073,
					508
				],
				"FrontHair": [
					897,
					264,
					1069,
					453
				],
				"Hip": [
					744,
					449,
					1225,
					1767
				],
				"LArm": [
					1143,
					686,
					1245,
					953
				],
				"RArm": [
					731,
					758,
					826,
					992
				],
				"LForearm": [
					1157,
					952,
					1243,
					1221
				],
				"RForearm": [
					733,
					990,
					815,
					1225
				],
				"LHand": [
					1158,
					1073,
					1242,
					1233
				],
				"RHand": [
					731,
					1078,
					812,
					1230
				],
				"LThigh": [
					1035,
					1369,
					1151,
					1421
				],
				"RThigh": [
					822,
					1370,
					935,
					1420
				],
				"LShank": [
					1041,
					1420,
					1148,
					1495
				],
				"RShank": [
					822,
					1418,
					930,
					1486
				],
				"LFoot": [
					1076,
					1759,
					1199,
					1912
				],
				"RFoot": [
					768,
					1756,
					1195,
					1912
				]
			},
			"slots": {
				"Face": [
					818,
					229,
					1098,
					666
				],
				"FrontHair": [
					804,
					188,
					1114,
					418
				],
				"Hip": [
					761,
					449,
					1154,
					1246
				],
				"LArm": [
					1038,
					671,
					1383,
					828
				],
				"RArm": [
					532,
					673,
					877,
					830
				],
				"LForearm": [
					1287,
					692,
					1572,
					814
				],
				"RForearm": [
					344,
					692,
					629,
					814
				],
				"LHand": [
					1496,
					696,
					1731,
					869
				],
				"RHand": [
					184,
					697,
					419,
					870
				],
				"LThigh": [
					956,
					1116,
					1105,
					1518
				],
				"RThigh": [
					808,
					1115,
					957,
					1518
				],
				"LShank": [
					955,
					1440,
					1087,
					1824
				],
				"RShank": [
					825,
					1440,
					958,
					1824
				],
				"LFoot": [
					968,
					1755,
					1146,
					1969
				],
				"RFoot": [
					771,
					1759,
					949,
					1973
				]
			},
			"bonesHuman": {
				"ObjectPivot": [1059, 1886],
				"LHand_Nub": [1200, 1207],
				"LHand": [1200, 1153],
				"LForearm": [1200, 996],
				"LArm": [1194, 730],
				"RHand_Nub": [771, 1205],
				"RHand": [771, 1154],
				"RForearm": [774, 1029],
				"RArm": [778, 797],
				"Head_Nub": [985, 304],
				"Head": [985, 386],
				"Neck": [985, 468],
				"Torso": [984, 888],
				"LToe_Nub": [1137, 1887],
				"LToe": [1137, 1887],
				"LFoot2": [1137, 1887],
				"LFoot": [1137, 1835],
				"LShank": [1094, 1432],
				"LThigh": [1093, 1377],
				"RToe_Nub": [981, 1886],
				"RToe": [981, 1886],
				"RFoot2": [981, 1886],
				"RFoot": [981, 1834],
				"RShank": [876, 1429],
				"RThigh": [878, 1378],
				"Hip": [984, 1108],
				"Root": [1059, 1886]
			},
			"bonesHead": {
				"LeftBrow": [985, 304],
				"RightBrow": [985, 304],
				"LeftEye": [985, 345],
				"RightEye": [985, 345],
				"Nose": [985, 386],
				"Mouth": [985, 468],
				"LeftEar>LEarRing": [1101, 504],
				"LeftEar": [1078, 458],
				"RightEar>REarRing": [810, 500],
				"RightEar": [836, 458],
				"FrontHair": [983, 358],
				"BackHair": [957, 341],
				"Face": [985, 386]
			},
			"hiddenDummyPixels": 15,
			"movedBones": 35,
			"contentBox": [
				184,
				180,
				1731,
				1973
			],
			"canvas": [1916, 2152],
			"masks": [
				{
					"label": "arms",
					"file": "/lab/masks/front/fill_arms.png",
					"color": "#e8b08c",
					"coverage": .040298,
					"bbox": [
						58,
						411,
						423,
						645
					]
				},
				{
					"label": "face",
					"file": "/lab/masks/front/fill_face.png",
					"color": "#f4c4a8",
					"coverage": .018993,
					"bbox": [
						177,
						100,
						300,
						231
					]
				},
				{
					"label": "feet",
					"file": "/lab/masks/front/fill_feet.png",
					"color": "#1c1c20",
					"coverage": .024525,
					"bbox": [
						87,
						1116,
						391,
						1225
					]
				},
				{
					"label": "hair",
					"file": "/lab/masks/front/fill_hair.png",
					"color": "#3a2a24",
					"coverage": .009835,
					"bbox": [
						177,
						60,
						297,
						192
					]
				},
				{
					"label": "hands",
					"file": "/lab/masks/front/fill_hands.png",
					"color": "#d4a07a",
					"coverage": .01561,
					"bbox": [
						60,
						630,
						419,
						742
					]
				},
				{
					"label": "legs",
					"file": "/lab/masks/front/fill_legs.png",
					"color": "#e8e8ec",
					"coverage": .020244,
					"bbox": [
						123,
						837,
						359,
						918
					]
				},
				{
					"label": "pants",
					"file": "/lab/masks/front/fill_pants.png",
					"color": "#303038",
					"coverage": .130247,
					"bbox": [
						104,
						649,
						374,
						1119
					]
				},
				{
					"label": "top",
					"file": "/lab/masks/front/fill_top.png",
					"color": "#d64040",
					"coverage": .178884,
					"bbox": [
						69,
						229,
						407,
						655
					]
				},
				{
					"label": "torso",
					"file": "/lab/masks/front/fill_torso.png",
					"color": "#b03030",
					"coverage": .008368,
					"bbox": [
						194,
						190,
						283,
						288
					]
				}
			],
			"parser": "fashn-ai/fashn-human-parser",
			"lrParser": "mattmdjaga/segformer_b2_clothes"
		},
		"back": {
			"source": "/lab/back.png",
			"overlay": "/lab/overlays/back.png",
			"cutout": "/lab/overlays/back_cutout.png",
			"filled": "/lab/back_filled.png",
			"psd": "/lab/back_filled.psd",
			"inpaint": "/lab/inpaint/back.png",
			"holes": "/lab/inpaint/back_holes.png",
			"inpaintMethod": "opencv.INPAINT_TELEA",
			"inpaintPixels": {
				"underarm": 130,
				"forehead": 328
			},
			"placed": [
				"Face",
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
				"RFoot"
			],
			"modes": {
				"Face": "stamp",
				"BackHair": "stamp",
				"Hip": "stamp",
				"LArm": "stamp",
				"RArm": "stamp",
				"LForearm": "stamp",
				"RForearm": "stamp",
				"LHand": "stamp",
				"RHand": "stamp",
				"LThigh": "stamp",
				"RThigh": "stamp",
				"LShank": "stamp",
				"RShank": "stamp",
				"LFoot": "stamp",
				"RFoot": "stamp"
			},
			"splits": {
				"arms": "parser-lr",
				"hands": "midline",
				"legs": "parser-lr",
				"feet": "parser-lr"
			},
			"dests": {
				"Face": [
					860,
					266,
					1032,
					502
				],
				"BackHair": [
					860,
					266,
					1032,
					467
				],
				"Hip": [
					703,
					442,
					1191,
					1818
				],
				"LArm": [
					1106,
					761,
					1191,
					962
				],
				"RArm": [
					692,
					674,
					787,
					948
				],
				"LForearm": [
					1116,
					1063,
					1196,
					1224
				],
				"RForearm": [
					692,
					946,
					778,
					1221
				],
				"LHand": [
					696,
					1075,
					778,
					1228
				],
				"RHand": [
					1117,
					1084,
					1199,
					1230
				],
				"LThigh": [
					1133,
					773,
					1205,
					1072
				],
				"RThigh": [
					697,
					983,
					700,
					1003
				],
				"LShank": [
					997,
					1071,
					1196,
					1485
				],
				"RShank": [
					788,
					1369,
					900,
					1483
				],
				"LFoot": [
					1046,
					1776,
					1145,
					1909
				],
				"RFoot": [
					748,
					1777,
					1064,
					1907
				]
			},
			"slots": {
				"Face": [
					818,
					229,
					1098,
					666
				],
				"BackHair": [
					767,
					180,
					1151,
					638
				],
				"Hip": [
					761,
					449,
					1154,
					1246
				],
				"LArm": [
					1038,
					671,
					1383,
					828
				],
				"RArm": [
					532,
					673,
					877,
					830
				],
				"LForearm": [
					1287,
					692,
					1572,
					814
				],
				"RForearm": [
					344,
					692,
					629,
					814
				],
				"LHand": [
					1496,
					696,
					1731,
					869
				],
				"RHand": [
					184,
					697,
					419,
					870
				],
				"LThigh": [
					956,
					1116,
					1105,
					1518
				],
				"RThigh": [
					808,
					1115,
					957,
					1518
				],
				"LShank": [
					955,
					1440,
					1087,
					1824
				],
				"RShank": [
					825,
					1440,
					958,
					1824
				],
				"LFoot": [
					968,
					1755,
					1146,
					1969
				],
				"RFoot": [
					771,
					1759,
					949,
					1973
				]
			},
			"bonesHuman": {
				"ObjectPivot": [1e3, 1886],
				"LHand_Nub": [737, 1203],
				"LHand": [737, 1151],
				"LForearm": [1156, 1089],
				"LArm": [1148, 794],
				"RHand_Nub": [1158, 1206],
				"RHand": [1158, 1157],
				"RForearm": [735, 991],
				"RArm": [739, 719],
				"Head_Nub": [946, 305],
				"Head": [946, 384],
				"Neck": [946, 463],
				"Torso": [947, 900],
				"LToe_Nub": [1095, 1887],
				"LToe": [1095, 1887],
				"LFoot2": [1095, 1887],
				"LFoot": [1095, 1842],
				"LShank": [1096, 1140],
				"LThigh": [1169, 822],
				"RToe_Nub": [906, 1886],
				"RToe": [906, 1886],
				"RFoot2": [906, 1886],
				"RFoot": [906, 1842],
				"RShank": [844, 1388],
				"RThigh": [698, 987],
				"Hip": [947, 1130],
				"Root": [1e3, 1886]
			},
			"bonesHead": {
				"LeftBrow": [946, 305],
				"RightBrow": [946, 305],
				"LeftEye": [946, 344],
				"RightEye": [946, 344],
				"Nose": [946, 384],
				"Mouth": [946, 463],
				"LeftEar>LEarRing": [1101, 504],
				"LeftEar": [1078, 458],
				"RightEar>REarRing": [810, 500],
				"RightEar": [836, 458],
				"FrontHair": [957, 295],
				"BackHair": [946, 366],
				"Face": [946, 384]
			},
			"hiddenDummyPixels": 15,
			"movedBones": 35,
			"contentBox": [
				184,
				180,
				1731,
				1973
			],
			"canvas": [1916, 2152],
			"masks": [
				{
					"label": "arms",
					"file": "/lab/masks/back/fill_arms.png",
					"color": "#e8b08c",
					"coverage": .044573,
					"bbox": [
						16,
						411,
						383,
						670
					]
				},
				{
					"label": "face",
					"file": "/lab/masks/back/fill_face.png",
					"color": "#f4c4a8",
					"coverage": .002222,
					"bbox": [
						139,
						140,
						259,
						227
					]
				},
				{
					"label": "feet",
					"file": "/lab/masks/back/fill_feet.png",
					"color": "#1c1c20",
					"coverage": .01966,
					"bbox": [
						58,
						1126,
						342,
						1222
					]
				},
				{
					"label": "hair",
					"file": "/lab/masks/back/fill_hair.png",
					"color": "#3a2a24",
					"coverage": .025068,
					"bbox": [
						139,
						61,
						259,
						202
					]
				},
				{
					"label": "hands",
					"file": "/lab/masks/back/fill_hands.png",
					"color": "#d4a07a",
					"coverage": .015806,
					"bbox": [
						23,
						632,
						377,
						740
					]
				},
				{
					"label": "legs",
					"file": "/lab/masks/back/fill_legs.png",
					"color": "#e8e8ec",
					"coverage": .019154,
					"bbox": [
						86,
						838,
						317,
						916
					]
				},
				{
					"label": "pants",
					"file": "/lab/masks/back/fill_pants.png",
					"color": "#303038",
					"coverage": .142432,
					"bbox": [
						67,
						653,
						334,
						1155
					]
				},
				{
					"label": "top",
					"file": "/lab/masks/back/fill_top.png",
					"color": "#d64040",
					"coverage": .200554,
					"bbox": [
						28,
						225,
						371,
						825
					]
				},
				{
					"label": "torso",
					"file": "/lab/masks/back/fill_torso.png",
					"color": "#b03030",
					"coverage": .004149,
					"bbox": [
						160,
						185,
						242,
						227
					]
				}
			],
			"parser": "fashn-ai/fashn-human-parser",
			"lrParser": "mattmdjaga/segformer_b2_clothes"
		}
	},
	mapping: [
		{
			"parser": "face ∪ hair",
			"g3": "Face",
			"mode": "union",
			"note": "پیشانی خالی پارسر با مو پوشانده می‌شود"
		},
		{
			"parser": "hair",
			"g3": "FrontHair / BackHair",
			"mode": "fit",
			"note": "FrontHair برای جلو، BackHair برای پشت"
		},
		{
			"parser": "torso ∪ top ∪ pants ∪ underarm − arms",
			"g3": "Hip",
			"mode": "stamp",
			"note": "بدنه روی ژست ایستاده؛ زیربغل Telea بعد از حذف بازو"
		},
		{
			"parser": "Left-arm / Right-arm (clothes) یا arms midline",
			"g3": "LArm / RArm / LForearm / RForearm",
			"mode": "stamp",
			"note": "اسپرایت روی ژست ایستاده؛ نام گروه رسمی حفظ می‌شود"
		},
		{
			"parser": "hands midline",
			"g3": "LHand / RHand 00Relaxed",
			"mode": "stamp",
			"note": "دست در موقعیت عکس، داخل گروه رسمی"
		},
		{
			"parser": "Left-leg / Right-leg یا legs",
			"g3": "LThigh / RThigh / LShank / RShank",
			"mode": "stamp · split_ud 0.42",
			"note": "ساق روی زانوی ایستاده، نه کشیده داخل شانت T-pose"
		},
		{
			"parser": "Left-shoe / Right-shoe یا feet",
			"g3": "LFoot / RFoot",
			"mode": "align",
			"note": "کفش روی bbox پا"
		},
		{
			"parser": "Telea underarm + forehead",
			"g3": "Hip / Face pixels",
			"mode": "inpaint",
			"note": "حفرهٔ زیربغل و خط رویش مو قبل از پر کردن قالب ترمیم می‌شود"
		}
	],
	gates: [
		{
			"id": "official-template",
			"ok": true,
			"label": "قالب رسمی HumanwithSpriteHand.psd",
			"detail": "منبع: Cartoon Animator 5 PSD Pipeline Resource — بدون ساخت درخت G3 از صفر"
		},
		{
			"id": "roots",
			"ok": true,
			"label": "ریشه‌های RL_ImageV2 / RL_Bone_HumanV2 / RL_Bone_HeadV2",
			"detail": "نام لایه‌ها از dump قالب رسمی خوانده شده‌اند"
		},
		{
			"id": "fashn",
			"ok": true,
			"label": "پارسر بدن FASHN نه ADE20k",
			"detail": "fashn-ai/fashn-human-parser"
		},
		{
			"id": "no-invented-names",
			"ok": true,
			"label": "هیچ نام گروه G3 اختراع نشده",
			"detail": "جایگذاری فقط روی گروه‌های موجود قالب"
		},
		{
			"id": "front-lr",
			"ok": true,
			"label": "نمای جلو: L کاراکتر = راست بیننده",
			"detail": "arms split=parser-lr"
		},
		{
			"id": "placed-core",
			"ok": true,
			"label": "گروه‌های اصلی تصویر پر شده‌اند",
			"detail": "BackHair, Face, FrontHair, Hip, LArm, LFoot, LForearm, LHand, LShank, LThigh, RArm, RFoot, RForearm, RHand, RShank, RThigh"
		},
		{
			"id": "dummy-hidden",
			"ok": true,
			"label": "پیکسل‌های ساختگی قالب مخفی شده‌اند",
			"detail": "front 15 · back 15"
		},
		{
			"id": "bones-moved",
			"ok": true,
			"label": "نشان‌های RL_Bone روی مفاصل ژست ایستاده",
			"detail": "front 35 · back 35"
		},
		{
			"id": "pose-stamp",
			"ok": true,
			"label": "اسپرایت روی ژست ایستاده نه T-pose stretch",
			"detail": "mode=stamp"
		},
		{
			"id": "inpaint",
			"ok": true,
			"label": "Inpaint زیر بغل / پیشانی",
			"detail": "opencv.INPAINT_TELEA · underarm 199px · forehead 342px"
		},
		{
			"id": "cta5-motion",
			"ok": false,
			"label": "تست موشن Cartoon Animator 5",
			"detail": "خارج از این محیط — PSD را Drag & Drop کنید"
		}
	]
};
var BONE_EDGES = [
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
	["RHand", "RHand_Nub"]
];
var STAGE_MODES = [
	{
		id: "photo",
		label: "عکس"
	},
	{
		id: "seg",
		label: "تقطیع FASHN"
	},
	{
		id: "cutout",
		label: "برش"
	},
	{
		id: "inpaint",
		label: "ترمیم"
	},
	{
		id: "filled",
		label: "پرشده G3"
	},
	{
		id: "bones",
		label: "استخوان"
	}
];
var FALLBACK_RUN = {
	name: "G3 Rig Lab",
	character: "SHARAF #9",
	template: {
		file: "HumanwithSpriteHand.psd",
		source: "Cartoon_Animator_5_PSD_Pipeline_Resource.zip",
		url: "https://file.reallusion.com/cta/Cartoon_Animator_5_PSD_Pipeline_Resource.zip",
		size: [1916, 2152],
		contentBox: [
			184,
			180,
			1731,
			1973
		]
	},
	parser: {
		id: "fashn-ai/fashn-human-parser",
		lr: "mattmdjaga/segformer_b2_clothes"
	},
	pack: {
		href: "/lab/SHARAF_G3_CTA5.zip",
		file: "SHARAF_G3_CTA5.zip"
	},
	views: {
		front: {
			source: "/lab/front.png",
			overlay: "/lab/overlays/front.png",
			cutout: "/lab/overlays/front_cutout.png",
			filled: "/lab/front_filled.png",
			psd: "/lab/front_filled.psd",
			placed: [],
			modes: {},
			splits: {},
			dests: {},
			bonesHuman: {},
			bonesHead: {},
			hiddenDummyPixels: 0,
			movedBones: 0,
			contentBox: [
				184,
				180,
				1731,
				1973
			],
			canvas: [1916, 2152],
			masks: []
		},
		back: {
			source: "/lab/back.png",
			overlay: "/lab/overlays/back.png",
			cutout: "/lab/overlays/back_cutout.png",
			filled: "/lab/back_filled.png",
			psd: "/lab/back_filled.psd",
			placed: [],
			modes: {},
			splits: {},
			dests: {},
			bonesHuman: {},
			bonesHead: {},
			hiddenDummyPixels: 0,
			movedBones: 0,
			contentBox: [
				184,
				180,
				1731,
				1973
			],
			canvas: [1916, 2152],
			masks: []
		}
	},
	mapping: [
		{
			parser: "face ∪ hair",
			g3: "Face",
			mode: "union",
			note: "پیشانی خالی پارسر با مو پوشانده می‌شود"
		},
		{
			parser: "hair",
			g3: "FrontHair / BackHair",
			mode: "fit",
			note: "FrontHair برای جلو، BackHair برای پشت"
		},
		{
			parser: "torso ∪ top ∪ pants",
			g3: "Hip",
			mode: "align",
			note: "بدنه داخل bbox قالب"
		},
		{
			parser: "Left-arm / Right-arm یا arms",
			g3: "LArm / RArm / LForearm / RForearm",
			mode: "fit · split_ud",
			note: "L کاراکتر = راستِ بیننده در نمای جلو"
		},
		{
			parser: "hands",
			g3: "LHand / RHand 00Relaxed",
			mode: "fit",
			note: "اسپرایت دست رسمی حفظ می‌شود"
		},
		{
			parser: "Left-leg / Right-leg یا legs",
			g3: "LThigh align · LShank fit",
			mode: "split_ud 0.42",
			note: "ساق قالب T-pose از ژست ایستاده بلندتر است"
		},
		{
			parser: "Left-shoe / Right-shoe یا feet",
			g3: "LFoot / RFoot",
			mode: "align",
			note: "کفش روی bbox پا"
		}
	],
	gates: [{
		id: "official-template",
		ok: true,
		label: "قالب رسمی HumanwithSpriteHand.psd",
		detail: "منبع Reallusion — درخت G3 از صفر ساخته نمی‌شود"
	}, {
		id: "fashn",
		ok: false,
		label: "پارسر FASHN",
		detail: "در حال اجرا روی Hugging Face Inference"
	}]
};
async function loadLabRun() {
	const response = await fetch("/lab/run.json", { cache: "no-store" });
	if (!response.ok) return FALLBACK_RUN;
	return await response.json();
}
function gateScore(run) {
	const total = run.gates.length;
	return {
		pass: run.gates.filter((g) => g.ok).length,
		total
	};
}
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function Badge({ className, tone = "muted", children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-flex items-center rounded-sm px-2 py-0.5 text-xs font-medium", {
			muted: "text-muted bg-subtle",
			ok: "text-ok bg-ok/10",
			warn: "text-warn bg-warn/10",
			bad: "text-bad bg-bad/10",
			accent: "text-accent-fg bg-accent"
		}[tone], className),
		children
	});
}
var TooltipProvider = Provider;
var TooltipContent = import_react.forwardRef(({ className, sideOffset = 6, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2, {
	ref,
	sideOffset,
	className: cn("z-50 max-w-xs rounded-md bg-subtle px-3 py-2 text-xs text-fg shadow-[var(--shadow-border)]", "origin-[var(--radix-tooltip-content-transform-origin)]", "data-[state=delayed-open]:animate-[rise-in_150ms_cubic-bezier(0.22,1,0.36,1)]", className),
	...props
}) }));
TooltipContent.displayName = "TooltipContent";
function Separator({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		role: "separator",
		className: cn("h-px w-full bg-border", className)
	});
}
var TABS = [
	{
		id: "gates",
		label: "گیت‌ها"
	},
	{
		id: "map",
		label: "نگاشت"
	},
	{
		id: "tree",
		label: "درخت G3"
	},
	{
		id: "masks",
		label: "ماسک"
	}
];
var G3_GROUPS = [
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
	"RFoot"
];
function Inspector({ run, viewId, view, tab, onTab, selectedGroup, onSelectGroup, isolatedMask, onIsolateMask }) {
	const score = gateScore(run);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
		className: "flex min-h-0 flex-col border-border bg-surface lg:border-s",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex gap-1 overflow-x-auto border-b border-border px-2 py-2",
				children: TABS.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => onTab(item.id),
					className: cn("h-11 shrink-0 rounded-sm px-3 text-sm transition-[background-color,color] duration-150", tab === item.id ? "bg-subtle text-fg" : "text-muted hover:text-fg"),
					children: item.label
				}, item.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-h-0 flex-1 overflow-y-auto p-4",
				children: [
					tab === "gates" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-baseline justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-sm font-medium",
								children: "کیفیت پایپ‌لاین"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "font-mono text-xs tabular-nums text-muted",
								children: [
									score.pass,
									"/",
									score.total
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "space-y-2",
							children: run.gates.map((gate) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "rounded-md bg-subtle p-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start justify-between gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm leading-snug",
										children: gate.label
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										tone: gate.ok ? "ok" : "warn",
										children: gate.ok ? "قبول" : "باز"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 font-mono text-[11px] leading-relaxed text-faint",
									children: gate.detail
								})]
							}, gate.id))
						})]
					}) : null,
					tab === "map" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-sm font-medium",
								children: "FASHN → گروه رسمی"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs leading-relaxed text-muted",
								children: "نام لایه‌ها از قالب Reallusion است. هیچ گروه جدیدی ساخته نمی‌شود."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "space-y-2",
								children: run.mapping.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "rounded-md bg-subtle p-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-mono text-xs text-accent",
											children: row.g3
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-1 font-mono text-[11px] text-muted",
											children: row.parser
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-1 text-xs text-faint",
											children: row.note
										})
									]
								}, row.g3))
							})
						]
					}) : null,
					tab === "tree" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-sm font-medium",
								children: "RL_ImageV2"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted",
								children: "انتخاب گروه، bbox قالب را روی پیش‌نمایش پرشده مشخص می‌کند."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "space-y-1",
								children: G3_GROUPS.map((name) => {
									const placed = view.placed.includes(name);
									const active = selectedGroup === name;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => onSelectGroup(active ? null : name),
										className: cn("flex h-11 w-full items-center justify-between rounded-sm px-3 text-start font-mono text-xs transition-[background-color] duration-150", active ? "bg-accent text-accent-fg" : "hover:bg-subtle"),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: name }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: cn("text-[10px]", active ? "text-accent-fg/70" : "text-faint"),
											children: placed ? view.modes[name] ?? "fill" : "empty"
										})]
									}) }, name);
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator, {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "font-mono text-[11px] leading-relaxed text-faint",
								children: [
									run.template.file,
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
									run.template.size.join(" × "),
									" · content ",
									run.template.contentBox.join(",")
								]
							})
						]
					}) : null,
					tab === "masks" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-sm font-medium",
								children: "کلاس‌های FASHN"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "space-y-1",
								children: view.masks.map((mask) => {
									const active = isolatedMask === mask.label;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => onIsolateMask(active ? null : mask.label),
										className: cn("flex h-11 w-full items-center gap-3 rounded-sm px-3 text-start transition-[background-color] duration-150 hover:bg-subtle", active && "bg-subtle"),
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "size-3 shrink-0 rounded-xs",
												style: { background: mask.color },
												"aria-hidden": true
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-mono text-xs",
												children: mask.label
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "ms-auto font-mono text-[10px] tabular-nums text-faint",
												children: mask.coverage != null ? `${(mask.coverage * 100).toFixed(1)}%` : ""
											})
										]
									}) }, mask.label);
								})
							}),
							view.splits && Object.keys(view.splits).length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "font-mono text-[11px] text-faint",
								children: ["L/R · ", Object.entries(view.splits).map(([k, v]) => `${k}:${v}`).join(" · ")]
							}) : null
						]
					}) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-2 border-t border-border p-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
					href: run.pack?.href ?? "/lab/SHARAF_G3_CTA5.zip",
					download: run.pack?.file ?? "SHARAF_G3_CTA5.zip",
					className: "flex h-11 items-center justify-center gap-2 rounded-sm bg-accent px-4 text-sm font-medium text-accent-fg transition-transform duration-150 ease-out active:scale-[0.96]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileArchive, { className: "size-4" }), "دانلود بسته کامل CTA5"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
					href: view.psd,
					download: viewId === "front" ? "SHARAF_G3_Front.psd" : "SHARAF_G3_Back.psd",
					className: "flex h-11 items-center justify-center gap-2 rounded-sm bg-subtle px-4 text-sm font-medium text-fg transition-transform duration-150 ease-out active:scale-[0.96]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-4" }),
						"فقط PSD ",
						viewId === "front" ? "جلو" : "پشت"
					]
				})]
			})
		]
	});
}
function Stage({ viewId, view, mode, onMode, selectedGroup, isolatedMask }) {
	const canvas = view.canvas?.[0] && view.canvas?.[1] ? view.canvas : [1916, 2152];
	const src = sourceForMode(view, mode);
	const dest = selectedGroup && (mode === "filled" || mode === "bones") ? view.dests[selectedGroup] : null;
	const slot = selectedGroup && (mode === "filled" || mode === "bones") ? view.slots?.[selectedGroup] : null;
	const showBones = mode === "bones";
	const maskHit = isolatedMask ? view.masks.find((m) => m.label === isolatedMask) : null;
	const isPsdSpace = mode === "filled" || mode === "bones";
	const isInpaint = mode === "inpaint" && Boolean(view.inpaint);
	const aspect = isPsdSpace ? `${canvas[0]} / ${canvas[1]}` : "438 / 1264";
	const [split, setSplit] = (0, import_react.useState)(46);
	const pixels = view.inpaintPixels;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "flex min-h-0 min-w-0 flex-col bg-bg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-2 border-b border-border px-3 py-2 lg:px-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-wrap gap-1",
					children: STAGE_MODES.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => onMode(item.id),
						className: cn("h-11 rounded-sm px-3 text-sm transition-[background-color,color] duration-150", mode === item.id ? "bg-accent text-accent-fg" : "text-muted hover:bg-subtle hover:text-fg"),
						children: item.label
					}, item.id))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "ms-auto hidden font-mono text-[11px] text-faint md:block",
					children: [
						viewId === "front" ? "FRONT" : "BACK",
						" · ",
						isPsdSpace ? `${canvas[0]}×${canvas[1]}` : "source"
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "stage-grid relative min-h-[280px] flex-1 overflow-hidden lg:min-h-0",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex h-full min-h-[280px] items-center justify-center p-4 sm:p-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", {
						className: "relative h-[min(58dvh,560px)] max-w-full lg:h-[min(70dvh,720px)]",
						style: { aspectRatio: aspect },
						dir: isInpaint ? "ltr" : void 0,
						children: [
							isInpaint ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: view.source,
									alt: "",
									className: "lab-frame absolute inset-0 h-full w-full object-contain",
									draggable: false
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: view.inpaint,
									alt: "",
									className: "absolute inset-0 h-full w-full object-contain",
									style: { clipPath: `inset(0 0 0 ${split}%)` },
									draggable: false
								}),
								view.holes ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: view.holes,
									alt: "",
									className: "pointer-events-none absolute inset-0 h-full w-full object-contain"
								}) : null,
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "pointer-events-none absolute inset-y-0 w-px bg-accent",
									style: { left: `${split}%` },
									"aria-hidden": true
								})
							] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src,
								alt: viewId === "front" ? "نمای جلو کاراکتر" : "نمای پشت کاراکتر",
								className: "lab-frame absolute inset-0 h-full w-full object-contain",
								draggable: false
							}),
							mode === "seg" && maskHit ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: maskHit.file,
								alt: "",
								className: "pointer-events-none absolute inset-0 h-full w-full object-contain opacity-70 mix-blend-screen"
							}) : null,
							(showBones || dest || slot) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
								viewBox: `0 0 ${canvas[0]} ${canvas[1]}`,
								className: "pointer-events-none absolute inset-0 h-full w-full text-accent",
								"aria-hidden": true,
								children: [
									showBones ? BONE_EDGES.map(([a, b]) => {
										const pa = view.bonesHuman[a];
										const pb = view.bonesHuman[b];
										if (!pa || !pb) return null;
										return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
											x1: pa[0],
											y1: pa[1],
											x2: pb[0],
											y2: pb[1],
											stroke: "currentColor",
											strokeWidth: "7",
											strokeLinecap: "round",
											opacity: "0.9"
										}, `${a}-${b}`);
									}) : null,
									showBones ? Object.entries(view.bonesHuman).map(([name, pt]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
										cx: pt[0],
										cy: pt[1],
										r: "16",
										fill: "currentColor"
									}, name)) : null,
									slot ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
										x: slot[0],
										y: slot[1],
										width: Math.max(1, slot[2] - slot[0]),
										height: Math.max(1, slot[3] - slot[1]),
										fill: "none",
										stroke: "currentColor",
										strokeWidth: "6",
										strokeDasharray: "18 14",
										opacity: "0.35"
									}) : null,
									dest ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
										x: dest[0],
										y: dest[1],
										width: Math.max(1, dest[2] - dest[0]),
										height: Math.max(1, dest[3] - dest[1]),
										fill: "none",
										stroke: "currentColor",
										strokeWidth: "8",
										opacity: "0.95"
									}) : null
								]
							})
						]
					})
				})
			}),
			isInpaint ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-2 border-t border-border px-4 py-3",
				dir: "ltr",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between gap-3 text-[12px] text-muted",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "اصل" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-mono text-[11px] text-faint",
							children: [
								view.inpaintMethod ?? "Telea",
								pixels?.underarm != null ? ` · underarm ${pixels.underarm}` : "",
								pixels?.forehead != null ? ` · forehead ${pixels.forehead}` : ""
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "ترمیم" })
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "range",
					min: 8,
					max: 92,
					value: split,
					onChange: (event) => setSplit(Number(event.target.value)),
					className: "h-11 w-full",
					"aria-label": "مقایسه عکس و ترمیم"
				})]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "border-t border-border px-4 py-3 text-[12px] leading-relaxed text-faint",
				children: ["فایل PSD را در Cartoon Animator 5 رها کنید تا G3 Human شناسایی شود.", mode === "filled" || mode === "bones" ? " خط‌چین = اسلات T-pose قالب · کادر توپر = اسپرایت ژست ایستاده." : ""]
			})
		]
	});
}
function sourceForMode(view, mode) {
	switch (mode) {
		case "photo": return view.source;
		case "seg": return view.overlay;
		case "cutout": return view.cutout;
		case "inpaint": return view.inpaint || view.source;
		case "filled":
		case "bones": return view.filled;
		default: return view.source;
	}
}
function Studio() {
	const [run, setRun] = (0, import_react.useState)(lab_run_default ?? FALLBACK_RUN);
	const [ready, setReady] = (0, import_react.useState)(false);
	const [viewId, setViewId] = (0, import_react.useState)("front");
	const [mode, setMode] = (0, import_react.useState)("photo");
	const [tab, setTab] = (0, import_react.useState)("gates");
	const [selectedGroup, setSelectedGroup] = (0, import_react.useState)(null);
	const [isolatedMask, setIsolatedMask] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		loadLabRun().then((data) => {
			if (!cancelled) {
				setRun(data);
				setReady(true);
			}
		}).catch(() => {
			if (!cancelled) setReady(true);
		});
		return () => {
			cancelled = true;
		};
	}, []);
	const view = run.views[viewId];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipProvider, {
		delayDuration: 200,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex min-h-dvh flex-col bg-bg text-fg",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
					className: "border-b border-border px-4 py-3 lg:px-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "stagger-in flex flex-wrap items-center gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "grid size-9 place-items-center rounded-md bg-subtle font-mono text-[11px] tracking-tight text-accent",
									children: "G3"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-medium tracking-wide text-muted",
									children: "Cartoon Animator 5"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
									className: "text-lg font-semibold leading-tight tracking-tight",
									children: "G3 Rig Lab"
								})] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "max-w-xl text-sm leading-relaxed text-muted",
								children: "عکس دوبعدی به PSD انسان G3 — قالب رسمی HumanwithSpriteHand"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "ms-auto flex flex-wrap items-center gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										tone: "accent",
										children: run.character
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										tone: ready && view.placed.length > 0 ? "ok" : "warn",
										children: ready && view.placed.length > 0 ? "FASHN پر شده" : "در انتظار پارس"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
										href: run.pack?.href ?? "/lab/SHARAF_G3_CTA5.zip",
										download: run.pack?.file ?? "SHARAF_G3_CTA5.zip",
										className: "inline-flex h-11 items-center gap-2 rounded-sm bg-accent px-3 text-sm font-medium text-accent-fg transition-transform duration-150 ease-out active:scale-[0.96]",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileArchive, { className: "size-4" }), "بسته CTA5"]
									})
								]
							})
						]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-2 border-b border-border px-4 py-2 lg:px-6",
					children: [["front", "back"].map((id) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => {
							setViewId(id);
							setSelectedGroup(null);
							setIsolatedMask(null);
						},
						className: cn("h-11 rounded-sm px-4 text-sm transition-[background-color,color] duration-150", viewId === id ? "bg-subtle text-fg" : "text-muted hover:text-fg"),
						children: id === "front" ? "نمای جلو" : "نمای پشت"
					}, id)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "ms-auto hidden font-mono text-[11px] text-faint sm:block",
						children: [run.parser.id, run.parser.lr ? ` · L/R ${run.parser.lr}` : ""]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[22rem_minmax(0,1fr)]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "order-2 min-h-0 lg:order-1",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Inspector, {
							run,
							viewId,
							view,
							tab,
							onTab: setTab,
							selectedGroup,
							onSelectGroup: (name) => {
								setSelectedGroup(name);
								if (name) setMode("filled");
							},
							isolatedMask,
							onIsolateMask: (label) => {
								setIsolatedMask(label);
								if (label) setMode("seg");
							}
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "order-1 min-h-0 lg:order-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stage, {
							viewId,
							view,
							mode,
							onMode: setMode,
							selectedGroup,
							isolatedMask
						})
					})]
				})
			]
		})
	});
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Studio, {});
}
//#endregion
export { Home as component };
