from pathlib import Path
from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parents[1]
SITE = ROOT / "site"

direction_keys = {
    "direction_engineering": "direction_engineering_details",
    "direction_social_economic": "direction_social_economic_details",
    "direction_media": "direction_media_details",
    "direction_medical": "direction_medical_details",
    "direction_it": "direction_it_details",
    "direction_arts": "direction_arts_details",
    "direction_chinese": "direction_chinese_details",
}

for path in SITE.rglob("*.html"):
    soup = BeautifulSoup(path.read_text(encoding="utf-8"), "lxml")
    for link in soup.select("a.login-link"):
        span = link.find("span")
        if span:
            span["data-i18n"] = "global_mesh"
            span.string = "МЭШ"
    for node in soup.select(".footer__brand p"):
        node["data-i18n"] = "global_footer_brand"
        node.string = "Школа «Царицыно» · Москва и Московская область"
    for node in soup.select(".footer__note"):
        node["data-i18n"] = "global_footer_note"
        node.string = "Информация актуализирована 26.11.2026. Официальные документы открываются на сайте школы."
    for link in soup.select('a[href="https://vk.com/mhs548"]'):
        span = link.find("span")
        if span:
            span["data-i18n"] = "global_vk"
            span.string = "Школа № 548 во ВКонтакте"
    for link in soup.select('a[href="https://www.mhs548.ru/"]'):
        if link.find_parent(class_="footer"):
            span = link.find("span")
            if span:
                span["data-i18n"] = "global_news"
                span.string = "Новости школы"
    for span in soup.select(".toast span"):
        span["data-i18n"] = "global_ready"
        span.string = "Готово."
    for card in soup.select(".extra-grid > article, .extra-grid > .tile"):
        title = card.find(["h2", "h3"], attrs={"data-i18n": True})
        detail = card.find("p", attrs={"data-i18n": True})
        if title and detail and title.get("data-i18n") in direction_keys:
            detail["data-i18n"] = direction_keys[title["data-i18n"]]

    if path.name in ("index.html", "teachers.html") and path.parent == SITE:
        card = soup.select_one(".card-person")
        if card:
            figure = card.select_one(".photo-slot--person")
            if figure:
                image = figure.find("img")
                image["src"] = "assets/img/campus-engineering.jpg"
                image["alt"] = "Инженерный корпус Школы № 548"
                image.attrs.pop("aria-hidden", None)
                caption = figure.find("figcaption")
                if caption:
                    caption["data-i18n"] = "teacher_campus_caption"
                    caption.string = "Инженерный корпус · место работы Алексея Аксёнова"
            if path.name == "index.html":
                values = {
                    "s71": "Инженерный корпус · место работы Алексея Аксёнова",
                    "s72": "История и обществознание",
                    "s73": "Алексей Юрьевич Аксёнов",
                    "s74": "Учитель истории и обществознания, финалист и призёр конкурса «Учитель года Москвы — 2026».",
                    "s75": "Официальная публикация",
                }
                for key, value in values.items():
                    for node in card.select('[data-i18n="' + key + '"]'):
                        node.string = value
                source = card.find("a")
                if source:
                    source["href"] = "http://www.mhs548.ru/article/9299/"
                    source["target"] = "_blank"
                    source["rel"] = "noopener"

    consent = soup.select_one(".form-consent span")
    if consent:
        consent["data-i18n"] = "contact_consent"
    if path.name == "schedule.html":
        for node in soup.select('[data-i18n="s286"]'):
            node.string = "Открыть расписание в МЭШ"
    path.write_text(str(soup), encoding="utf-8")

for lang, values in {
    "ru": {
        "global_mesh": "МЭШ",
        "global_footer_brand": "Школа «Царицыно» · Москва и Московская область",
        "global_footer_note": "Информация актуализирована 26.11.2026. Официальные документы открываются на сайте школы.",
        "global_vk": "Школа № 548 во ВКонтакте",
        "global_news": "Новости школы",
        "global_ready": "Готово.",
        "teacher_campus_caption": "Инженерный корпус · место работы Алексея Аксёнова",
        "contact_consent": "Согласен(на) на обработку данных для ответа на обращение",
        "s286": "Открыть расписание в МЭШ",
        "s71": "Инженерный корпус · место работы Алексея Аксёнова",
        "s72": "История и обществознание",
        "s73": "Алексей Юрьевич Аксёнов",
        "s74": "Учитель истории и обществознания, финалист и призёр конкурса «Учитель года Москвы — 2026».",
        "s75": "Официальная публикация",
    },
    "en": {
        "global_mesh": "MES",
        "global_footer_brand": "Tsaritsyno School · Moscow and Moscow Region",
        "global_footer_note": "Information updated on 26 November 2026. Official documents open on the school website.",
        "global_vk": "School No. 548 on VK",
        "global_news": "School news",
        "global_ready": "Done.",
        "teacher_campus_caption": "Engineering Campus · Alexey Aksyonov’s workplace",
        "contact_consent": "I consent to data processing for a response to this enquiry",
        "s286": "Open timetable in MES",
        "s71": "Engineering Campus · Alexey Aksyonov’s workplace",
        "s72": "History and social studies",
        "s73": "Alexey Aksyonov",
        "s74": "History and social studies teacher; finalist and prize winner in Moscow Teacher of the Year 2026.",
        "s75": "Official publication",
    },
}.items():
    target = SITE / "assets" / "js" / (lang + ".js")
    lines = ["", "// Shared published interface labels"]
    for key, value in values.items():
        escaped = value.replace("\\", "\\\\").replace("'", "\\'")
        lines.append("window.SCHOOL_I18N." + lang + "." + key + " = '" + escaped + "';")
    raw = target.read_text(encoding="utf-8")
    cleanup = {
        "Место для фото:": "Иллюстрация новости:",
        "Место для согласованного фото к публикации": "Иллюстрация к публикации",
        "Место для согласованного портрета педагога": "Инженерный корпус",
        "Место для фото фасада:": "Корпус:",
        "Сайт для согласования": "Москва и Московская область",
        "Демо расписания ученика": "Открыть расписание в МЭШ",
        "Photo visual:": "News illustration:",
        "Approved portrait visual": "Engineering Campus",
        "Building photo visual:": "Campus:",
        "Website for review": "Moscow and Moscow Region",
        "Student school timetable": "Open timetable in MES",
    }
    for old, new in cleanup.items():
        raw = raw.replace(old, new)
    target.write_text(raw.rstrip() + "\n" + "\n".join(lines) + "\n", encoding="utf-8")

print("Final content labels and direction mappings applied")
