#!/usr/bin/env python3
"""
Scans newsletters/*.md and regenerates newsletters/index.json.
Run from the My-Website root: python3 scripts/build_newsletter_index.py
"""

import json
import os
import re

NEWSLETTERS_DIR = "newsletters"
OUTPUT_FILE = os.path.join(NEWSLETTERS_DIR, "index.json")


def parse_frontmatter(content):
    m = re.match(r"^---\r?\n(.*?)\r?\n---\r?\n", content, re.DOTALL)
    if not m:
        return {}, content
    fm = {}
    for line in m.group(1).splitlines():
        idx = line.find(":")
        if idx > 0:
            k = line[:idx].strip()
            v = line[idx + 1 :].strip().strip("\"'")
            fm[k] = v
    return fm, content[m.end() :]


def plain_excerpt(body, max_len=190):
    text = re.sub(r"^#+\s+", "", body, flags=re.MULTILINE)
    text = re.sub(r"\*+([^*]+)\*+", r"\1", text)
    text = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", text)
    text = re.sub(r"\s+", " ", text).strip()
    if len(text) > max_len:
        text = text[:max_len].rsplit(" ", 1)[0] + "..."
    return text


def main():
    entries = []
    for filename in os.listdir(NEWSLETTERS_DIR):
        if not filename.endswith(".md"):
            continue
        slug = filename[:-3]
        with open(os.path.join(NEWSLETTERS_DIR, filename), encoding="utf-8") as f:
            content = f.read()
        fm, body = parse_frontmatter(content)
        entry = {
            "slug": slug,
            "title": fm.get("title", slug.replace("-", " ").title()),
            "date": fm.get("date", "1970-01-01"),
            "excerpt": fm.get("excerpt", plain_excerpt(body)),
        }
        if fm.get("coming_soon", "").lower() == "true":
            entry["coming_soon"] = True
        entries.append(entry)

    entries.sort(key=lambda x: x["date"], reverse=True)

    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(entries, f, indent=2, ensure_ascii=False)

    print(f"Written {OUTPUT_FILE} — {len(entries)} newsletter(s).")


if __name__ == "__main__":
    main()
