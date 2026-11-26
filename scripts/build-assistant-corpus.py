#!/usr/bin/env python3
"""Build the local, source-attributed corpus used by Buk.

Run this script when the official school regulations change. It downloads the
documents listed on the official documents page together with the current
admissions regulations, extracts text page by page and writes a compact JSON
corpus used by the server-side retriever.
"""

from __future__ import annotations

import json
import re
import urllib.parse
import urllib.request
from pathlib import Path

import pdfplumber


ROOT = Path(__file__).resolve().parents[1]
DOWNLOADS = ROOT / "research" / "source-docs" / "all-docs"
CORPUS = ROOT / "data" / "assistant-corpus.json"
API = "https://api-typalsites.mskobr.ru/api/v0/files_by_slug/13866"
ALL_DOC_QUERIES = ("15,12,4,5,17,18,19,29,27,3,14", "7,35&descript=true")

ADMISSION_DOCS = [
    {
        "id": "admission-rules-2027",
        "title": "Положение о комплектовании на 2027–2028 учебный год",
        "url": "https://cou548.mskobr.ru/files/diff/2728nabor/Polozhenie_itog.pdf",
        "local": ROOT / "research/source-docs/polozhenie-komplektovanie-2027-2028.pdf",
    },
    {
        "id": "admission-order-2027",
        "title": "Приказ от 26.10.2026 о комплектовании",
        "url": "https://cou548.mskobr.ru/files/diff/2728nabor/Prikaz2728.pdf",
        "local": ROOT / "research/source-docs/prikaz-komplektovanie-2027-2028.pdf",
    },
    {
        "id": "predprof-rules-2026",
        "title": "Положение о предпрофессиональных классах",
        "url": "https://cou548.mskobr.ru/files/diff/predprof/polozhenie_o_predprof_26.pdf",
        "local": ROOT / "research/source-docs/polozhenie-predprof-2026.pdf",
    },
    {
        "id": "predprof-admission-2026",
        "title": "Положение о приёме в предпрофессиональные классы",
        "url": "https://cou548.mskobr.ru/files/diff/predprof/polozhenie_priem_predprof_26.pdf",
        "local": ROOT / "research/source-docs/polozhenie-priem-predprof-2026.pdf",
    },
]


def get_json(url: str) -> dict:
    with urllib.request.urlopen(url, timeout=45) as response:
        return json.load(response)


def download(url: str, target: Path) -> None:
    encoded = urllib.parse.quote(url, safe=":/?=&{}%,")
    request = urllib.request.Request(encoded, headers={"User-Agent": "School548KnowledgeBuilder/1.0"})
    with urllib.request.urlopen(request, timeout=90) as response:
        payload = response.read()
    if not payload.startswith(b"%PDF"):
        raise ValueError(f"Not a PDF: {url}")
    target.write_bytes(payload)


def chunks(text: str, size: int = 2200, overlap: int = 250) -> list[str]:
    clean = re.sub(r"\s+", " ", text).strip()
    if not clean:
        return []
    result = []
    start = 0
    while start < len(clean):
        end = min(len(clean), start + size)
        if end < len(clean):
            boundary = clean.rfind(". ", start + size // 2, end)
            if boundary > start:
                end = boundary + 1
        result.append(clean[start:end].strip())
        if end >= len(clean):
            break
        start = max(start + 1, end - overlap)
    return result


def extract(document: dict) -> list[dict]:
    output = []
    with pdfplumber.open(document["local"]) as pdf:
        for page_number, page in enumerate(pdf.pages, 1):
            for part_number, text in enumerate(chunks(page.extract_text() or ""), 1):
                output.append(
                    {
                        "id": f"{document['id']}-p{page_number}-{part_number}",
                        "documentId": document["id"],
                        "title": document["title"],
                        "url": document["url"],
                        "page": page_number,
                        "text": text,
                    }
                )
    return output


def main() -> None:
    DOWNLOADS.mkdir(parents=True, exist_ok=True)
    CORPUS.parent.mkdir(parents=True, exist_ok=True)
    documents = []
    seen = set()
    for query in ALL_DOC_QUERIES:
        data = get_json(f"{API}?slug={query}").get("data", [])
        for item in data:
            guid = item.get("guid") or item.get("slug")
            if not guid or guid in seen:
                continue
            seen.add(guid)
            target = DOWNLOADS / f"{guid}.pdf"
            download(item["url"], target)
            documents.append(
                {
                    "id": f"official-{guid.lower()}",
                    "title": item["full_name"],
                    "url": item["url"],
                    "local": target,
                }
            )
    documents.extend(ADMISSION_DOCS)
    corpus = []
    failures = []
    for document in documents:
        try:
            corpus.extend(extract(document))
        except Exception as error:  # retain a complete build report without hiding failures
            failures.append({"title": document["title"], "error": str(error)})
    result = {
        "generatedAt": "2026-11-26",
        "sourcePage": "https://cou548.mskobr.ru/info_edu/all_docs/",
        "documents": [{key: value for key, value in doc.items() if key != "local"} for doc in documents],
        "chunks": corpus,
        "failures": failures,
    }
    CORPUS.write_text(json.dumps(result, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    print(f"Wrote {len(corpus)} chunks from {len(documents)} documents to {CORPUS}")
    if failures:
        print(f"Extraction failures: {len(failures)}")
        for failure in failures:
            print(f"- {failure['title']}: {failure['error']}")


if __name__ == "__main__":
    main()
