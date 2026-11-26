from pathlib import Path
from bs4 import BeautifulSoup

root = Path(__file__).resolve().parents[1]
page = root / "site" / "index.html"
soup = BeautifulSoup(page.read_text(encoding="utf-8"), "lxml")
search = soup.select_one("form[data-site-search] input[type=search]")
if not search:
    raise SystemExit("Search input not found")
search["name"] = "query"
page.write_text(str(soup), encoding="utf-8")
print("Added the query field name to the site search")
