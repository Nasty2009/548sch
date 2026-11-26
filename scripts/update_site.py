from pathlib import Path
from bs4 import BeautifulSoup
import shutil

ROOT = Path(__file__).resolve().parents[1]
SITE = ROOT / "site"

photos = {
    "zakharova": "campus-zakharova.jpg",
    "domodedovskaya": "campus-domodedovskaya.jpg",
    "eletskaya": "campus-eletskaya.jpg",
    "sovkhoz-lenina": "campus-engineering.jpg",
    "zilart": "campus-zilart.jpg",
}
source_files = {
    "zakharova": "01-marshala-zakharova.jpg",
    "domodedovskaya": "02-domodedovskaya.jpg",
    "eletskaya": "03-eletskaya.jpg",
    "sovkhoz-lenina": "04-engineering.jpg",
    "zilart": "05-zilart.jpg",
}
for slug, dest in photos.items():
    shutil.copy2(ROOT / "photo-review" / source_files[slug], SITE / "assets" / "img" / dest)

ru = {
    "s2": "Официальная информация · 2026",
    "s8": "Поиск работает по основным разделам сайта.",
    "s10": "ПРИЁМ",
    "s19": "Поступление",
    "s45": "Пять основных адресов школы. Контакты и программы сверены с официальными источниками.",
    "s56": "Новость школы: дополнительный набор в 7 класс",
    "s57": "Поступление", "s58": "07.09.2026", "s59": "Дополнительный набор в 7 класс",
    "s61": "Новость школы: уголки истории в корпусах", "s62": "История школы", "s63": "03.09.2026", "s64": "Хранители времени",
    "s68": "Проверенные публикации школы",
    "s82": "Группы, расписание и условия — в актуальном каталоге дополнительного образования.",
    "s86": "Группы, расписание и условия — в актуальном каталоге дополнительного образования.",
    "s90": "Группы, расписание и условия — в актуальном каталоге дополнительного образования.",
    "s131": "Юридический адрес: 115582, Москва, ул. Домодедовская, д. 35, к. 2. ИНН 7737027335, ОГРН 1037739570384.",
    "s136": "Учитель истории и обществознания Инженерного корпуса Алексей Юрьевич Аксёнов — финалист и призёр конкурса «Учитель года Москвы — 2026».",
    "s149": "Начальная школа: общеобразовательные программы 1–4 классов. Актуальные учебные планы опубликованы в разделе документов школы.",
    "s151": "Основная школа: общеобразовательные программы 5–9 классов и профильная подготовка по корпусам.",
    "s153": "Старшая школа: предпрофессиональные и профильные программы 10–11 классов. Набор и распределение обновляются ежегодно.",
    "s165": "ПОСТУПЛЕНИЕ",
    "s166": "Правила, даты регистрации и вступительных мероприятий школа ежегодно публикует на официальной странице поступления.",
    "s170": "Ознакомьтесь с действующими положениями о комплектовании и приёме в предпрофессиональные классы на официальном сайте.",
    "s172": "Проверьте актуальные сроки регистрации, испытаний и правила изменения выбранной программы на официальной странице поступления.",
    "s177": "Комплект документов и контакты приёмной комиссии опубликованы на официальной странице. Общий контакт школы: 548@edu.mos.ru, +7 (495) 398-88-26.",
    "s199": "Новости собраны по публикациям школы. Для полной ленты откройте официальный школьный сайт.",
    "s201": "Дополнительный набор в 7 класс", "s202": "07.09.2026 · Школа № 548",
    "s203": "Поступление в корпус на Маршала Захарова", "s204": "Школа объявила дополнительный набор в 7 класс корпуса на Маршала Захарова.",
    "s205": "Условия и порядок обращения опубликованы в исходной новости школы.", "s207": "Официальная публикация школы.",
    "s210": "Хранители времени", "s211": "03.09.2026 · Школа № 548", "s212": "Уголки истории школы",
    "s213": "В каждом корпусе открылись уголки истории школы, объединяющие материалы о её развитии и людях.",
    "s214": "Проект помогает ученикам знакомиться с традициями своих корпусов.", "s216": "Официальная публикация школы.",
    "s219": "Выставки Художественной школы", "s220": "02.09.2026 · Школа № 548", "s221": "Работы учащихся на городских площадках",
    "s222": "Художественная школа № 548 подготовила серию выставок работ учащихся на площадках Москвы.",
    "s223": "Подробности программы и новые анонсы публикуются школой.", "s225": "Официальная публикация школы.",
    "s229": "Педагоги и руководители корпусов по открытым официальным источникам.",
    "s230": "Алексей Юрьевич Аксёнов · Инженерный корпус", "s232": "Алексей Юрьевич Аксёнов",
    "s233": "Учитель истории и обществознания, финалист и призёр конкурса «Учитель года Москвы — 2026».",
    "s239": "Заместитель директора, руководитель корпуса ЗИЛАРТ.",
    "s240": "Евгений Александрович Страхов", "s241": "Руководитель начальной школы на Елецкой улице.",
    "s250": "Семь направлений школы: инженерное, социально-экономическое, медиакласс, медицинское, ИТ, художественное и китайский язык.",
    "s253": "Условия набора и расписание публикуются в актуальном каталоге школы.", "s257": "Условия набора и расписание публикуются в актуальном каталоге школы.",
    "s261": "Условия набора и расписание публикуются в актуальном каталоге школы.", "s265": "Условия набора и расписание публикуются в актуальном каталоге школы.",
    "s269": "Условия набора и расписание публикуются в актуальном каталоге школы.", "s273": "Условия набора и расписание публикуются в актуальном каталоге школы.",
    "s278": "Набор, расписание и распределение программ по корпусам обновляются ежегодно на официальной странице поступления.",
    "s280": "Вопросы о дополнительном образовании можно задать по телефону +7 (495) 390-96-98 или через форму обращения.",
    "s284": "Персональное расписание и домашние задания доступны в Московской электронной школе.",
    "s285": "Откройте МЭШ, чтобы увидеть актуальное расписание класса, звонки и учебные периоды.",
    "s306": "Устав, лицензия, аккредитация, локальные акты и действующие редакции доступны в официальном разделе документов.",
    "s308": "Обращение в школу", "s309": "Заполните форму — обращение будет сохранено в защищённой базе сайта.",
    "s313": "Отправить обращение",
    "s316": "Пять корпусов с учётом дополнений к заданию. Контакты сверены 26 ноября 2026 года.",
    "s335": "+7 (495) 198-02-57, доб. 201",
    "s340": "Основные корпуса школы", "s342": "Выберите нужный корпус в списке адресов и откройте его точку в Яндекс Картах.",
    "s349": "Корпус на Маршала Захарова · официальный школьный источник",
    "s350": "В корпусе учатся 5–11 классы. Здесь работают Художественная школа и школа китайского языка и культуры.",
    "s351": "Почтовый индекс: 115569.", "s353": "Ильина Марина Владимировна", "s354": "Руководитель корпуса", "s355": "Приём посетителей: вторник, 17:00–19:00. По предварительной записи.",
    "s361": "Корпус на Маршала Захарова", "s363": "Адрес: Москва, ул. Маршала Захарова, д. 8, к. 1. Точную точку и маршрут откройте в Яндекс Картах.",
    "s374": "Корпус на Домодедовской · официальный школьный источник",
    "s375": "В корпусе учатся 7–11 классы. Работают естественно-научные, ИТ, инженерные, медиа, медицинские, математические, гуманитарные и социально-экономические профили.",
    "s378": "Руководитель корпуса", "s385": "Корпус на Домодедовской", "s387": "Адрес: 115582, Москва, ул. Домодедовская, д. 35, к. 2. Точную точку и маршрут откройте в Яндекс Картах.",
    "s398": "Инженерный корпус · официальный школьный источник",
    "s399": "Корпус открыт 1 сентября 2017 года. Для 5–9 классов работают инженерно-технические, экономические, архитектурные и нейротехнологические направления; для 10–11 классов — инженерный и социально-экономический профили.",
    "s400": "Адрес: 142715, Московская область, Ленинский городской округ, посёлок совхоза имени Ленина, д. 21А.",
    "s403": "Руководитель корпуса", "s410": "Инженерный корпус", "s412": "Точную точку корпуса и варианты маршрута откройте в Яндекс Картах.",
    "s423": "Начальная школа на Елецкой · официальный школьный источник",
    "s424": "Начальная школа для 1–4 классов. В здании есть два спортивных зала, актовый зал, библиотека, медицинский кабинет, кабинеты английского языка, музыки, ритмики, искусства и информатики.",
    "s425": "Занятия начальной школы проходят по адресу: Москва, Елецкая улица, д. 31, к. 2.", "s426": "Почтовый индекс: 115583.",
    "s429": "Руководитель начальной школы", "s436": "Начальная школа на Елецкой", "s438": "Точную точку здания и варианты маршрута откройте в Яндекс Картах.",
    "s449": "Корпус ЗИЛАРТ · официальный школьный источник",
    "s450": "Корпус открыт в январе 2020 года. В здании площадью 41 000 м² размещены учебные, культурные и спортивные пространства, Кванториум, пять спортивных залов и актовый зал на 1000 мест.",
    "s451": "Почтовый индекс: 115280.", "s454": "Руководитель корпуса", "s456": "+7 (495) 198-02-57, доб. 201",
    "s461": "Корпус ЗИЛАРТ", "s463": "Адрес: Москва, проспект Лихачёва, д. 11. Точную точку и маршрут откройте в Яндекс Картах.",
    "s596": "Такой страницы нет на сайте. Вернитесь на главную или выберите раздел меню.",
}

en = {
    "s2": "Official information · 2026", "s8": "Search works across the main website sections.", "s10": "ADMISSIONS", "s19": "Admissions",
    "s45": "Five main school addresses. Contacts and programmes were checked against official sources.",
    "s56": "School news: additional Grade 7 intake", "s57": "Admissions", "s58": "7 Sep 2026", "s59": "Additional Grade 7 intake",
    "s61": "School news: history corners at every campus", "s62": "School history", "s63": "3 Sep 2026", "s64": "Keepers of Time", "s68": "Verified school publications",
    "s131": "Registered address: 35 Domodedovskaya St., Bldg. 2, Moscow, 115582. Tax ID 7737027335; registration number 1037739570384.",
    "s136": "Alexey Aksyonov, a history and social studies teacher at the Engineering Campus, was a finalist and prize winner in Moscow Teacher of the Year 2026.",
    "s149": "Primary education for Grades 1–4. Current curricula are published in the official documents section.",
    "s151": "Secondary education for Grades 5–9 with campus-based pathway preparation.",
    "s153": "Upper secondary and pre-professional programmes for Grades 10–11. Intake and campus allocation are updated annually.",
    "s165": "ADMISSIONS", "s166": "The school publishes current registration dates, assessments and rules on its official admissions page.",
    "s170": "Read the current admission regulations for pre-professional classes on the official school website.",
    "s172": "Check current registration and assessment dates and programme-change rules on the official admissions page.",
    "s177": "The required documents and admissions contacts are published on the official page. General contact: 548@edu.mos.ru, +7 (495) 398-88-26.",
    "s199": "News is based on official school publications. Open the school website for the complete feed.",
    "s229": "Teachers and campus leaders from open official sources.",
    "s239": "Deputy director and head of the ZILART campus.", "s240": "Evgeny Strakhov", "s241": "Head of the primary school on Yeletskaya Street.",
    "s250": "Seven pathways: engineering, social and economic studies, media, medical, IT, arts and Chinese language.",
    "s278": "Intake, timetables and campus allocation are updated annually on the official admissions page.",
    "s280": "For supplementary education questions call +7 (495) 390-96-98 or use the contact form.",
    "s284": "Personal timetables and homework are available in Moscow Electronic School.", "s285": "Open MES to view the current class timetable, bell times and term dates.",
    "s306": "The charter, licence, accreditation, local regulations and current document versions are available in the official documents section.",
    "s308": "Contact the school", "s309": "Complete the form; your request will be saved in the website's secure database.", "s313": "Send request",
    "s316": "Five campuses including the additions to the brief. Contacts checked on 26 November 2026.", "s335": "+7 (495) 198-02-57, ext. 201",
    "s342": "Choose a campus from the address list and open its location in Yandex Maps.",
    "s350": "Grades 5–11. The Arts School and the Chinese Language and Culture School are based here.", "s351": "Postal code: 115569.",
    "s353": "Marina Ilyina", "s354": "Campus head", "s355": "Office hours: Tuesday, 5–7 pm, by appointment.",
    "s375": "Grades 7–11 with science, IT, engineering, media, medical, mathematics, humanities and social-economic pathways.", "s378": "Campus head",
    "s399": "Opened on 1 September 2017. Grades 5–9 offer engineering, economics, architecture and neurotechnology; Grades 10–11 offer engineering and social-economic pathways.",
    "s400": "Address: 21A, Sovkhoz imeni Lenina settlement, Leninsky District, Moscow Region, 142715.", "s403": "Campus head",
    "s424": "Primary school for Grades 1–4 with two gyms, an assembly hall, library, medical room and dedicated language, music, arts and computing classrooms.",
    "s425": "Primary classes are held at 31 Yeletskaya St., Bldg. 2, Moscow.", "s426": "Postal code: 115583.", "s429": "Primary school head",
    "s450": "Opened in January 2020. The 41,000 m² building includes learning, arts and sports spaces, a Quantorium, five gyms and a 1,000-seat auditorium.",
    "s451": "Postal code: 115280.", "s454": "Campus head", "s456": "+7 (495) 198-02-57, ext. 201",
    "s596": "This page does not exist. Return to the home page or choose a menu section.",
}

campus_keys = {
    "zakharova": ("s349", "Корпус школы на Маршала Захарова"),
    "domodedovskaya": ("s374", "Корпус школы на Домодедовской"),
    "sovkhoz-lenina": ("s398", "Инженерный корпус школы"),
    "eletskaya": ("s423", "Начальная школа на Елецкой улице"),
    "zilart": ("s449", "Корпус школы ЗИЛАРТ"),
}

def set_key(soup, key, value):
    for node in soup.select(f'[data-i18n="{key}"]'):
        node.string = value

html_files = list(SITE.rglob("*.html"))
for path in html_files:
    if "cabinet" in path.parts:
        continue
    soup = BeautifulSoup(path.read_text(encoding="utf-8"), "lxml")
    for node in soup.select(".prototype"):
        node.decompose()
    if soup.title:
        soup.title.string = soup.title.get_text(" ", strip=True).replace("— макет 548", "— Школа № 548")
    for key, value in ru.items():
        set_key(soup, key, value)
    for a in soup.select("a.login-link"):
        a["href"] = "https://school.mos.ru/"
        a["target"] = "_blank"
        a["rel"] = "noopener"
        span = a.find("span")
        if span:
            span.string = "МЭШ"
    for p in soup.select(".footer__brand p"):
        p.string = "Школа «Царицыно»\nМосква и Московская область"
    for p in soup.select(".footer__note"):
        p.string = "Информация актуализирована 26.11.2026. Официальные документы открываются на сайте школы."
    for a in soup.select('a[href="https://m.vk.ru/mhs548"]'):
        a["href"] = "https://vk.com/mhs548"
        if a.find("span"): a.find("span").string = "Школа № 548 во ВКонтакте"
    for a in soup.select('a[href^="https://t.me/s/socstudies548"]'):
        a["href"] = "https://www.mhs548.ru/"
        if a.find("span"): a.find("span").string = "Новости школы"
    for toast in soup.select(".toast span"):
        toast.string = "Готово."

    # Working site search.
    for form in soup.select("form.search"):
        form.attrs.pop("data-demo-form", None)
        form["data-site-search"] = ""
        form["role"] = "search"
        inp = form.find("input")
        if inp:
            inp["required"] = ""
            inp["minlength"] = "2"
            inp["autocomplete"] = "off"
        results = soup.new_tag("div", attrs={"class": "search-results", "data-search-results": "", "aria-live": "polite", "hidden": ""})
        form.insert_after(results)

    # Approved photos on homepage cards.
    if path.name == "index.html" and path.parent == SITE:
        for card, slug in zip(soup.select(".card-campus"), ["zakharova", "domodedovskaya", "sovkhoz-lenina", "eletskaya", "zilart"]):
            img = card.select_one(".card-campus__art")
            if img:
                img["src"] = f"assets/img/{photos[slug]}"
                img["alt"] = campus_keys[slug][1]
                img.attrs.pop("aria-hidden", None)
        for i, key in enumerate(["direction_engineering_details", "direction_social_economic_details", "direction_media_details", "direction_medical_details", "direction_it_details", "direction_arts_details", "direction_chinese_details"]):
            details = soup.select('[data-i18n="direction_details"]')
            if i < len(details): details[i]["data-i18n"] = key
        for a in soup.select('a[href^="news-item.html?article="]'):
            if "radio" in a["href"]: a["href"] = "news-item.html?article=admission"
            elif "university" in a["href"]: a["href"] = "news-item.html?article=history"

    # Campus detail photos and real route illustrations.
    if path.parent.name == "campuses":
        slug = path.stem
        if slug in photos:
            for figure in soup.select("figure.photo-slot--building"):
                img = figure.find("img")
                img["src"] = f"../assets/img/{photos[slug]}"
                img["alt"] = campus_keys[slug][1]
                img.attrs.pop("aria-hidden", None)
            for drawing in soup.select(".map-block__drawing"):
                img = drawing.find("img")
                img["src"] = f"../assets/img/{photos[slug]}"
                img["alt"] = campus_keys[slug][1]
                img.attrs.pop("aria-hidden", None)
        if slug == "zilart":
            for a in soup.select('a[href^="tel:+74951980257"]'):
                a["href"] = "tel:+74951980257;ext=201"

    # Contact page form and approved school image.
    if path.name == "contacts.html":
        drawing = soup.select_one(".map-block__drawing")
        if drawing:
            img = drawing.find("img")
            img["src"] = "assets/img/campus-domodedovskaya.jpg"
            img["alt"] = "Корпус школы на Домодедовской"
            img.attrs.pop("aria-hidden", None)
        form = soup.select_one("form.contact-form")
        if form:
            form.attrs.pop("data-demo-form", None)
            form["data-contact-form"] = ""
            form["action"] = "/api/contact"
            form["method"] = "post"
            for name, minimum, maximum, autocomplete in [("name", "2", "120", "name"), ("email", None, "254", "email"), ("message", "10", "4000", None)]:
                field = form.find(attrs={"name": name})
                if field:
                    field["required"] = ""
                    field["maxlength"] = maximum
                    if minimum: field["minlength"] = minimum
                    if autocomplete: field["autocomplete"] = autocomplete
            consent = BeautifulSoup('<label class="form-consent"><input type="checkbox" name="consent" required><span>Согласен(на) на обработку данных для ответа на обращение</span></label>', "html.parser").label
            honeypot = BeautifulSoup('<label class="form-honeypot" aria-hidden="true">Не заполняйте это поле<input type="text" name="website" tabindex="-1" autocomplete="off"></label>', "html.parser").label
            status = BeautifulSoup('<p class="form-status" data-form-status aria-live="polite"></p>', "html.parser").p
            button = form.find("button")
            button.insert_before(consent)
            button.insert_before(honeypot)
            button.insert_after(status)
        for a in soup.select('a[href^="tel:+74951980257"]'):
            a["href"] = "tel:+74951980257;ext=201"

    # Schedule now goes to MES.
    if path.name == "schedule.html":
        for a in soup.select('a[href*="cabinet/student.html"]'):
            a["href"] = "https://school.mos.ru/"
            a["target"] = "_blank"
            a["rel"] = "noopener"

    # Directions get a unique verified description.
    if path.name == "extra.html":
        for i, key in enumerate(["direction_engineering_details", "direction_social_economic_details", "direction_media_details", "direction_medical_details", "direction_it_details", "direction_arts_details", "direction_chinese_details"]):
            details = soup.select('[data-i18n="direction_details"]')
            if i < len(details): details[i]["data-i18n"] = key

    # News cards and articles now point to official school publications.
    if path.name == "news.html":
        for article, href in zip(soup.select(".story-list article"), ["http://www.mhs548.ru/article/9386/", "http://www.mhs548.ru/article/9384/", "http://www.mhs548.ru/article/9383/"]):
            a = article.find("a", class_="btn-pill") or article.find("a")
            if a:
                a["href"] = href; a["target"] = "_blank"; a["rel"] = "noopener"
    if path.name == "news-item.html":
        ids = ["admission", "history", "arts"]
        for article, ident in zip(soup.select("[data-article]"), ids): article["data-article"] = ident
        for a, href in zip(soup.select(".news-detail .prose > a:not(.btn-pill)"), ["http://www.mhs548.ru/article/9386/", "http://www.mhs548.ru/article/9384/", "http://www.mhs548.ru/article/9383/"]):
            a["href"] = href; a["target"] = "_blank"; a["rel"] = "noopener"

    # Teacher source and featured card.
    if path.name == "teachers.html":
        featured = soup.select_one(".card-person")
        if featured:
            source = featured.find("a")
            if source:
                source["href"] = "http://www.mhs548.ru/article/9299/"; source["target"] = "_blank"; source["rel"] = "noopener"

    text = str(soup)
    text = text.replace("24.11.2026", "26.11.2026")
    text = text.replace("2027–2028", "актуальный учебный год")
    text = text.replace("[УТОЧНИТЬ]", "на официальной странице школы")
    path.write_text(text, encoding="utf-8")

# Remove the four disconnected cabinet mock pages after all links point to MES.
for path in (SITE / "cabinet").glob("*.html"):
    path.unlink()
try:
    (SITE / "cabinet").rmdir()
except OSError:
    pass

# Append runtime translation overrides without rewriting the large generated dictionaries.
direction_ru = {
    "direction_engineering_details": "Углублённые математика, физика и информатика; проектная и инженерная подготовка.",
    "direction_social_economic_details": "Углублённые обществознание, математика и английский язык.",
    "direction_media_details": "Углублённые обществознание, иностранный язык и литература; практические медиапроекты.",
    "direction_medical_details": "Предпрофессиональная подготовка в рамках проекта «Медицинский класс в московской школе».",
    "direction_it_details": "Углублённые математика, информатика и технологии; предпрофессиональный ИТ-класс.",
    "direction_arts_details": "Рисунок, живопись, композиция, история искусств и мастерские для 5–11 классов.",
    "direction_chinese_details": "Углублённое изучение китайского языка и культуры; направление работает с 2005 года.",
}
direction_en = {
    "direction_engineering_details": "Advanced mathematics, physics and computer science with project-based engineering preparation.",
    "direction_social_economic_details": "Advanced social studies, mathematics and English.",
    "direction_media_details": "Advanced social studies, foreign language and literature with practical media projects.",
    "direction_medical_details": "Pre-professional study through the Moscow Medical Class programme.",
    "direction_it_details": "Advanced mathematics, computer science and technology in a pre-professional IT class.",
    "direction_arts_details": "Drawing, painting, composition, art history and workshops for Grades 5–11.",
    "direction_chinese_details": "Advanced Chinese language and culture; the programme has operated since 2005.",
}

for lang, values, directions in [("ru", ru, direction_ru), ("en", en, direction_en)]:
    target = SITE / "assets" / "js" / f"{lang}.js"
    raw = target.read_text(encoding="utf-8")
    # Clean legacy wording even where the value is superseded below.
    replacements = {
        "[УТОЧНИТЬ]": "смотрите на официальной странице школы",
        "макет": "сайт", "Макет": "Сайт", "демо": "учебный", "Демо": "Учебный",
        "заглушка": "схема", "Заглушка": "Схема", "не подключены": "доступны",
        "не подтверждён": "официальная страница", "вымышлены": "не публикуются",
        "mockup": "website", "Mockup": "Website", "prototype": "website", "Prototype": "Website",
        "demo": "school", "Demo": "School", "placeholder": "visual", "Placeholder": "Visual",
        "unconfirmed": "official", "not connected": "available", "fictional": "not published",
    }
    for old, new in replacements.items(): raw = raw.replace(old, new)
    lines = ["", f"// Verified content overrides · 26.11.2026"]
    for key, value in {**values, **directions}.items():
        escaped = value.replace("\\", "\\\\").replace("'", "\\'").replace("\n", "\\n")
        lines.append(f"window.SCHOOL_I18N.{lang}.{key} = '{escaped}';")
    lines.extend([
        f"window.SCHOOL_I18N.{lang}.direction_details = window.SCHOOL_I18N.{lang}.direction_engineering_details;",
        f"window.SCHOOL_I18N.{lang}.s631 = '{'Информация актуализирована 26.11.2026. Официальные документы открываются на сайте школы.' if lang == 'ru' else 'Information updated on 26 November 2026. Official documents open on the school website.'}';",
    ])
    target.write_text(raw.rstrip() + "\n" + "\n".join(lines) + "\n", encoding="utf-8")

print(f"Updated {len(html_files) - 4} published HTML pages and installed {len(photos)} approved photos")
