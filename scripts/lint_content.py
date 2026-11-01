#!/usr/bin/env python3
"""Content gate for the ARQ website. Python standard library only.

Usage: python scripts/lint_content.py [repo_root]

Checks (each failure is printed, exit code 1 if any):
  1. every JSON file under content/ and data/ parses
  2. no em dash anywhere in text files of the repo
  3. locale files only use keys that exist in content/en/ui.json (extra keys fail,
     missing keys are reported as untranslated and do not fail)
  4. brand facts match the single source (content/en/site.json) and the wrong,
     old contact details appear nowhere
  5. banned marketing phrases, confidential names and conflict-of-interest terms
     do not appear in public content (content/ and ui/)
  6. product rules: valid status, trial only on products listed in site.json,
     non-live products carry no live features
"""
import json
import re
import sys
from pathlib import Path

ROOT = Path(sys.argv[1]).resolve() if len(sys.argv) > 1 else Path(__file__).resolve().parent.parent
errors: list[str] = []
notes: list[str] = []

TEXT_SUFFIXES = {".md", ".json", ".py", ".ts", ".tsx", ".js", ".jsx", ".css", ".html", ".txt", ".example"}
SKIP_DIRS = {"node_modules", ".next", ".git", "out", "dist", "__pycache__"}

# Public surfaces. docs/ is internal and may name these things.
PUBLIC_DIRS = ["content", "ui"]

BANNED_PHRASES = [
    "bank-grade", "military-grade", "100% secure", "guaranteed", "revolutionary",
    "game-changing", "game changing", "cutting-edge", "cutting edge", "seamless",
    "world-class", "best-in-class", "synergies", "ISO 27001", "SOC 2", "SOC2",
    "trusted by", "#1 ", "number one", "end-to-end encrypted", "data never leaves",
    "stays in india", "data residency",
]
CONFLICT_TERMS = ["pharma", "GxP", "clinical", "GSK", "Bayer", "ZS Associates", "life sciences"]
CONFIDENTIAL_NAMES = [
    "Niket", "RestroPulse", "Galaxy", "Comsky", "FireAI", "Biz Analyst", "Welset",
    "Shree TNB", "Excel Polymers", "Ammar", "Rohit Bajaj", "Rishi", "Rishikesh",
    "NEXT SOLUTIONS", "Suvit", "GoGST",
]
WRONG_OLD_CONTACT = ["97248 06960", "9724806960", "arq-analytics.com"]
VENDOR_NAMES = ["OpenAI", "GPT-4", "LangChain", "Pinecone", "Weaviate", "Gemini", "Groq", "Llama", "Sarvam"]


def load(path: Path):
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception as exc:  # noqa: BLE001
        errors.append(f"[json] {path.relative_to(ROOT)}: {exc}")
        return None


def flatten(obj, prefix=""):
    out = {}
    if isinstance(obj, dict):
        for k, v in obj.items():
            if k.startswith("_"):
                continue
            out.update(flatten(v, f"{prefix}{k}."))
    elif isinstance(obj, list):
        for i, v in enumerate(obj):
            out.update(flatten(v, f"{prefix}{i}."))
    else:
        out[prefix.rstrip(".")] = obj
    return out


def iter_text_files(base: Path):
    for p in base.rglob("*"):
        if not p.is_file() or p.suffix not in TEXT_SUFFIXES:
            continue
        if any(part in SKIP_DIRS for part in p.parts):
            continue
        yield p


# 1. JSON validity
for folder in ("content", "data"):
    base = ROOT / folder
    if base.exists():
        for jp in base.rglob("*.json"):
            load(jp)

# 2. em dash
for p in iter_text_files(ROOT):
    if p.name == "lint_content.py":
        continue
    if "—" in p.read_text(encoding="utf-8", errors="ignore"):
        errors.append(f"[style] em dash in {p.relative_to(ROOT)}")

# 3. locale key parity
en_ui = load(ROOT / "content/en/ui.json")
if en_ui is not None:
    en_keys = set(flatten(en_ui))
    for loc in ("hi", "mr", "gu"):
        lp = ROOT / f"content/{loc}/ui.json"
        if not lp.exists():
            errors.append(f"[i18n] missing {lp.relative_to(ROOT)}")
            continue
        data = load(lp)
        if data is None:
            continue
        keys = set(flatten(data))
        extra = sorted(keys - en_keys)
        missing = sorted(en_keys - keys)
        for k in extra:
            errors.append(f"[i18n] {loc}/ui.json has key not in en: {k}")
        if missing:
            notes.append(f"[i18n] {loc}/ui.json untranslated keys: {len(missing)}")

# 4. brand facts
site = load(ROOT / "content/en/site.json")
if site is not None:
    expected = {
        "contact.phoneDisplay": "+91 97270 67044",
        "contact.email": "contact@arqoneailabs.space",
        "contact.linkedin": "https://www.linkedin.com/company/arq-one-ai-labs",
        "brand.domain": "https://arqoneailabs.space",
    }
    flat = flatten(site)
    for k, v in expected.items():
        if flat.get(k) != v:
            errors.append(f"[brand] site.json {k} is {flat.get(k)!r}, expected {v!r}")

# 5. public content scan
for d in PUBLIC_DIRS:
    base = ROOT / d
    if not base.exists():
        continue
    for p in iter_text_files(base):
        text = p.read_text(encoding="utf-8", errors="ignore")
        low = text.lower()
        rel = p.relative_to(ROOT)
        for phrase in BANNED_PHRASES:
            if phrase.lower() in low:
                errors.append(f"[claims] banned phrase {phrase!r} in {rel}")
        for term in CONFLICT_TERMS:
            if re.search(r"\b" + re.escape(term.lower()) + r"\b", low):
                errors.append(f"[scope] conflict-of-interest term {term!r} in {rel}")
        for name in CONFIDENTIAL_NAMES:
            if name.lower() in low:
                errors.append(f"[confidential] {name!r} in {rel}")
        for wrong in WRONG_OLD_CONTACT:
            if wrong.lower() in low:
                errors.append(f"[brand] old wrong contact {wrong!r} in {rel}")
        for vendor in VENDOR_NAMES:
            if vendor.lower() in low:
                errors.append(f"[claims] AI vendor name {vendor!r} in {rel} (do not name vendors publicly)")

# Old contact details must not appear anywhere in specs either, except in audit notes
for p in iter_text_files(ROOT / "specs"):
    text = p.read_text(encoding="utf-8", errors="ignore")
    for wrong in WRONG_OLD_CONTACT:
        if wrong in text:
            errors.append(f"[brand] old wrong contact {wrong!r} in {p.relative_to(ROOT)}")

# 6. product rules
prod = load(ROOT / "content/en/products.json")
if prod is not None and site is not None:
    statuses = set(site.get("statusEnum", []))
    trial_products = set(site.get("trial", {}).get("products", []))
    for item in prod.get("products", []):
        pid = item.get("id")
        if item.get("status") not in statuses:
            errors.append(f"[product] {pid}: invalid status {item.get('status')!r}")
        if item.get("status") != "live" and item.get("featuresLive"):
            errors.append(f"[product] {pid}: not live but has featuresLive")
        if item.get("status") == "live" and pid not in trial_products:
            notes.append(f"[product] {pid}: live without a trial entry in site.json")
        if pid in trial_products and item.get("status") != "live":
            errors.append(f"[product] {pid}: has a trial but is not live")
        for field in ("name", "slug", "tagline", "oneLine", "seo"):
            if not item.get(field):
                errors.append(f"[product] {pid}: missing {field}")
        desc = item.get("seo", {}).get("description", "")
        if len(desc) > 165:
            errors.append(f"[seo] {pid}: description is {len(desc)} chars, keep under 165")
    # every product must have a card in each locale's ui.json
    ids = {p["id"] for p in prod.get("products", [])}
    if en_ui is not None:
        card_ids = set(en_ui.get("products", {}).get("cards", {}).keys())
        if ids != card_ids:
            errors.append(f"[product] ui.json cards {sorted(card_ids)} do not match products {sorted(ids)}")

for p in (ROOT / "content/en").glob("*.json"):
    data = load(p)
    if data is None:
        continue
    for k, v in flatten(data).items():
        if k.endswith("seo.description") and isinstance(v, str) and len(v) > 165:
            errors.append(f"[seo] {p.name} {k} is {len(v)} chars, keep under 165")

for n in notes:
    print("note:", n)
if errors:
    print(f"\nFAIL: {len(errors)} problem(s)")
    for e in errors:
        print(" -", e)
    sys.exit(1)
print("PASS: content gate clean")
