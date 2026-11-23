# -*- coding: utf-8 -*-
"""Erzeugt die Folien fuer Praesentation 5 "Qualitaet & Tests" (SportMate, 25.11.2026).

Aufruf:  python build_p5.py
Ausgabe: SportMate_P5_Qualitaet_und_Tests.pptx im selben Ordner.

Alle Zahlen stehen zentral unten im Block ZAHLEN. Quellen:
docs/testing/testbericht.md, docs/testing/testfaelle.md, docs/testing/review-protokoll.md,
docs/testing/fehlerprotokoll.md, docs/teststrategie.md, docs/review-leitfaden.md, docs/backlog.md,
evaluation/results/bericht.md, evaluation/ANLEITUNG.md. Nach einem neuen Testlauf nur die Konstanten
anpassen und das Skript erneut ausfuehren.
"""
from pathlib import Path

from pptx import Presentation
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE, MSO_CONNECTOR
from pptx.enum.text import MSO_ANCHOR, PP_ALIGN
from pptx.util import Emu, Inches, Pt

HERE = Path(__file__).resolve().parent
REPO = HERE.parent.parent
SHOTS = REPO / "docs" / "testing" / "screenshots"
OUT = HERE / "SportMate_P5_Qualitaet_und_Tests.pptx"

# ---------------------------------------------------------------- ZAHLEN
STAND = "23.11.2026"
COMMIT = "9f79927"
DATUM_PRAES = "25.11.2026"
LIVE_URL = "sportmate-gamma.vercel.app"
TEAM = ["Julien", "Renat", "Paulo", "Niklas"]

# Testfaelle je Ebene (testfaelle.md, Uebersicht)
N_UNIT, N_UNIT_DATEIEN = 200, 14
N_KOMP, N_KOMP_DATEIEN = 39, 7
N_INT, N_INT_LOKAL, N_INT_DB = 8, 6, 2
N_E2E, N_E2E_PROJEKTE = 51, 2
N_MANUELL = 10
N_AUTO = N_UNIT + N_KOMP + N_INT + N_E2E  # automatisierte Testfaelle

# Laeufe (testbericht.md)
VITEST_OK, VITEST_FAIL, VITEST_SKIP, VITEST_DAUER = 245, 0, 2, "2,4 s"
DB_ERST_OK, DB_ERST_FAIL, DB_OK, DB_FAIL = 0, 2, 2, 0
E2E_MOBIL_OK, E2E_DESKTOP_OK, E2E_FAIL, E2E_DAUER = 51, 51, 0, "59,1 s"
MAN_OK, MAN_FAIL = 10, 0
TSC_FEHLER, ESLINT_BEFUNDE = 0, 0
UNIT_GRUEN_BEI_BUG01 = 85  # fehlerprotokoll.md, BUG-01

# Coverage src/lib (testbericht.md)
COV_LIB_ZEILEN, COV_LIB_ZWEIGE = "87,59 %", "84,01 %"
COV_EVENTS_ZEILEN = "100 %"
COV_SUPA_REPO_ZEILEN = "38,3 %"
COV_ZIEL = "80 %"

# SE-Eval (evaluation/results/bericht.md, Commit 8e4f171, vor den UI-Stories)
SE_COMMIT = "8e4f171"
SE_KK_MEDIAN, SE_KK_P90, SE_KK_UEBER15 = 1, 3, 0
SE_TSC, SE_UMGEHUNGEN, SE_DUPLIKATE = 0, 0, "0 %"
SE_LINE, SE_BRANCH = "92,71 %", "97,26 %"
SE_MUT_SCORE, SE_MUTANTEN, SE_UEBERLEBT = "7,69 %", 767, 696

# Review (review-protokoll.md)
REV_BLOCK, REV_WICHTIG, REV_HINWEIS = 0, 6, 9
REV_OFFEN = 15
REV_FARBWERTE, REV_FARB_DATEIEN = 23, 13

# Backlog / Git
R1_STORIES, R1_MUST, R1_SHOULD = 14, 13, 1
N_COMMITS = 34

# Wer spricht welche Folie (Index ab 1)
SPRECHER = {1: "Julien", 2: "Julien", 3: "Renat", 4: "Renat", 5: "Renat",
            6: "Paulo", 7: "Niklas", 8: "Niklas", 9: "Paulo", 10: "Paulo"}

# ---------------------------------------------------------------- DESIGN
BG = RGBColor(0xF7, 0xF6, 0xF2)
SURFACE = RGBColor(0xFF, 0xFF, 0xFF)
INK = RGBColor(0x15, 0x17, 0x1A)
INK2 = RGBColor(0x5B, 0x60, 0x68)
LINE = RGBColor(0xE7, 0xE5, 0xDF)
ACCENT = RGBColor(0xE8, 0x55, 0x2B)
ACCENT_SOFT = RGBColor(0xFC, 0xE9, 0xE2)
OK = RGBColor(0x1F, 0x8A, 0x5B)
WARN = RGBColor(0xB7, 0x79, 0x1F)
FONT = "Arial"          # Schibsted Grotesk ist auf den Praesentationsrechnern nicht installiert
MONO = "Consolas"

KRITERIEN = ["Testebenen", "Ausführbar", "Review-Leitfaden", "Ergebnisse"]

prs = Presentation()
prs.slide_width = Inches(13.333)
prs.slide_height = Inches(7.5)
BLANK = prs.slide_layouts[6]
W = 13.333
M = 0.6  # Seitenrand in Zoll


# ---------------------------------------------------------------- HELFER
def _apply(run, size=14, bold=False, color=INK, mono=False, italic=False):
    f = run.font
    f.size = Pt(size)
    f.bold = bold
    f.italic = italic
    f.color.rgb = color
    f.name = MONO if mono else FONT


def text(slide, x, y, w, h, paras, size=14, color=INK, bold=False, align=PP_ALIGN.LEFT,
         anchor=MSO_ANCHOR.TOP, spacing=1.1, space_after=4, mono=False):
    """paras: str | list[str | list[(text, dict)]]. Ein dict kann size/bold/color/mono setzen."""
    tb = slide.shapes.add_textbox(Inches(x), Inches(y), Inches(w), Inches(h))
    tf = tb.text_frame
    tf.word_wrap = True
    tf.auto_size = None
    tf.vertical_anchor = anchor
    tf.margin_left = tf.margin_right = Inches(0)
    tf.margin_top = tf.margin_bottom = Inches(0)
    if isinstance(paras, str):
        paras = [paras]
    for i, p in enumerate(paras):
        para = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        para.alignment = align
        para.line_spacing = spacing
        para.space_after = Pt(space_after)
        runs = [(p, {})] if isinstance(p, str) else p
        for t, st in runs:
            r = para.add_run()
            r.text = t
            _apply(r, size=st.get("size", size), bold=st.get("bold", bold),
                   color=st.get("color", color), mono=st.get("mono", mono),
                   italic=st.get("italic", False))
    return tb


def box(slide, x, y, w, h, fill=SURFACE, line=LINE, radius=None, line_w=0.75):
    shape_type = MSO_SHAPE.ROUNDED_RECTANGLE if radius else MSO_SHAPE.RECTANGLE
    s = slide.shapes.add_shape(shape_type, Inches(x), Inches(y), Inches(w), Inches(h))
    if radius:
        s.adjustments[0] = radius
    if fill is None:
        s.fill.background()
    else:
        s.fill.solid()
        s.fill.fore_color.rgb = fill
    if line is None:
        s.line.fill.background()
    else:
        s.line.color.rgb = line
        s.line.width = Pt(line_w)
    s.shadow.inherit = False
    s.text_frame.text = ""
    return s


def hline(slide, x, y, w, color=LINE, weight=0.75):
    # schmales Rechteck statt Verbinder: keine Schatten/Theme-Effekte
    return box(slide, x, y, w, weight / 72.0, fill=color, line=None)


def picture(slide, path, x, y, h=None, w=None, border=True):
    if h is not None:
        pic = slide.shapes.add_picture(str(path), Inches(x), Inches(y), height=Inches(h))
    else:
        pic = slide.shapes.add_picture(str(path), Inches(x), Inches(y), width=Inches(w))
    if border:
        pic.line.color.rgb = LINE
        pic.line.width = Pt(1)
    return pic


def base(n, title, subtitle, kriterien, quelle):
    """Grundgeruest: Hintergrund, Kopf mit Nummer und Titel, Kriterien-Leiste, Quellenzeile."""
    s = prs.slides.add_slide(BLANK)
    s.background.fill.solid()
    s.background.fill.fore_color.rgb = BG
    text(s, M, 0.42, 3, 0.3, [[("sportmate", {"bold": True}), (".", {"bold": True, "color": ACCENT})]], size=13)
    text(s, M, 0.85, 1.0, 0.5, f"{n:02d}", size=13, color=INK2, bold=True)
    text(s, M + 0.55, 0.78, 11.5, 0.6, title, size=28, bold=True)
    if subtitle:
        text(s, M + 0.55, 1.36, 8.9, 0.4, subtitle, size=14, color=INK2)
    # Kriterien-Leiste oben rechts: welche P5-Kriterien diese Folie bedient
    kx = W - M - 4 * 1.26 + 0.06
    for i, k in enumerate(KRITERIEN):
        active = k in kriterien
        b = box(s, kx + i * 1.26, 0.40, 1.2, 0.28, fill=INK if active else None,
                line=INK if active else LINE, radius=0.5)
        tf = b.text_frame
        tf.margin_left = tf.margin_right = tf.margin_top = tf.margin_bottom = 0
        p = tf.paragraphs[0]
        p.alignment = PP_ALIGN.CENTER
        r = p.add_run()
        r.text = k
        _apply(r, size=8, bold=active, color=SURFACE if active else INK2)
        tf.vertical_anchor = MSO_ANCHOR.MIDDLE
    hline(s, M, 7.0, W - 2 * M)
    text(s, M, 7.08, 8.5, 0.3, f"Quelle: {quelle}", size=9, color=INK2)
    text(s, W - M - 4.5, 7.08, 4.5, 0.3, f"Präsentation 5 · Qualität & Tests · {DATUM_PRAES}",
         size=9, color=INK2, align=PP_ALIGN.RIGHT)
    return s


def notes(slide, n, body):
    tf = slide.notes_slide.notes_text_frame
    tf.text = f"Sprecher: {SPRECHER[n]}\n\n" + body.strip()


def table(slide, x, y, widths, rows, header=None, row_h=0.42, size=11, header_size=9,
          col_styles=None, first_bold=False):
    """Schlichte Tabelle aus Textfeldern und Trennlinien. rows: Liste von Zeilen (str oder Laufliste)."""
    cy = y
    total = sum(widths)
    if header:
        cx = x
        for wcol, htxt in zip(widths, header):
            text(slide, cx, cy, wcol - 0.12, 0.3, htxt.upper(), size=header_size, color=INK2, bold=True)
            cx += wcol
        cy += 0.32
        hline(slide, x, cy, total, color=INK, weight=1)
        cy += 0.1
    heights = row_h if isinstance(row_h, list) else [row_h] * len(rows)
    for r_i, row in enumerate(rows):
        cx = x
        for c_i, (wcol, cell) in enumerate(zip(widths, row)):
            st = (col_styles or {}).get(c_i, {})
            if isinstance(cell, list) and cell and isinstance(cell[0], tuple):
                cell = [cell]  # einzelne Laufliste = ein Absatz
            text(slide, cx, cy, wcol - 0.15, heights[r_i] - 0.05, cell if isinstance(cell, list) else [cell],
                 size=st.get("size", size), bold=st.get("bold", first_bold and c_i == 0),
                 color=st.get("color", INK), mono=st.get("mono", False), spacing=1.05, space_after=2)
            cx += wcol
        cy += heights[r_i]
        hline(slide, x, cy - 0.06, total)
    return cy


def code(t):
    return (t, {"mono": True})


# ================================================================ FOLIE 1 Titel
s = prs.slides.add_slide(BLANK)
s.background.fill.solid()
s.background.fill.fore_color.rgb = BG
text(s, M, 0.9, 7, 0.3, "SOFTWAREPROJEKT · WS 2026/27", size=12, color=INK2, bold=True)
text(s, M, 1.45, 7.5, 1.3, [[("sportmate", {"bold": True}), (".", {"bold": True, "color": ACCENT})]], size=72)
text(s, M, 2.8, 7.5, 0.6, "Präsentation 5 · Qualität & Tests", size=26, bold=True)
text(s, M, 3.45, 7.5, 0.4, f"{DATUM_PRAES} · {', '.join(TEAM[:-1])} und {TEAM[-1]}", size=15, color=INK2)
text(s, M, 3.85, 7.5, 0.4, [[("Live: ", {"color": INK2}), (LIVE_URL, {"bold": True})]], size=15)
# drei Kennzahlen
kz = [(str(N_AUTO), "automatisierte Testfälle\nauf 4 Ebenen"),
      (str(VITEST_FAIL + E2E_FAIL), "fehlgeschlagen im\nletzten Lauf"),
      ("4", "Fehler gefunden,\nBUG-01 kritisch, behoben")]
for i, (zahl, lab) in enumerate(kz):
    x0 = M + i * 2.45
    hline(s, x0, 4.95, 2.2, color=INK, weight=1)
    text(s, x0, 5.05, 2.2, 0.7, zahl, size=36, bold=True, color=ACCENT if i == 2 else INK)
    text(s, x0, 5.8, 2.3, 0.7, lab, size=12, color=INK2)
text(s, M, 6.75, 8, 0.3, f"Stand der Zahlen: Testbericht vom {STAND}, Commit {COMMIT}", size=10, color=INK2)
picture(s, SHOTS / "entdecken-mobil.png", 9.25, 0.55, h=6.4)
notes(s, 1, f"""
Redetext:
Guten Tag, wir sind Team SportMate: Julien, Renat, Paulo und Niklas. Heute geht es um Präsentation 5, Qualität und Tests.
Rechts seht ihr unsere App, wie sie jetzt aussieht: mobile first, Karte als Startbildschirm, darunter die Trefferliste im Bottom Sheet.
Die App läuft live unter {LIVE_URL}.

Drei Zahlen vorweg, die wir gleich belegen: {N_AUTO} automatisierte Testfälle auf vier Ebenen, im letzten Lauf 0 fehlgeschlagen,
und wir haben 4 echte Fehler gefunden, darunter einen kritischen, den nur ein Test gegen die echte Datenbank zeigen konnte.

Ablauf: Was ist seit P4 neu, unsere Teststrategie, Beispiel-Testfälle, wie man sie wiederholt, der Review-Leitfaden,
dann die Ergebnisse: Testläufe, Fehler, Review-Befunde und zum Schluss die Grenzen.

Hinweis für uns: Alle Zahlen stammen aus docs/testing/testbericht.md (Stand {STAND}, Commit {COMMIT}).
Rollen: Julien Folien 1-2, Renat 3-5, Paulo 6, 9, 10, Niklas 7-8.
""")

# ================================================================ FOLIE 2 Seit P4
s = base(2, "Seit P4: neue App, echtes Backend", "Release 1 als Grundlage für alle Tests dieser Präsentation",
         ["Testebenen"], "docs/backlog.md, docs/design.md, docs/architecture.md, git log")
items = [
    ("Neue mobile-first App", "Karte als Startbildschirm, Bottom Sheet mit Liste, Erstellen in drei Schritten, Desktop als Erweiterung."),
    ("Supabase statt Demo-Daten", "Konten, Treffen und Teilnahmen in Postgres. RLS auf allen Tabellen, Schreiben nur über RPC-Funktionen."),
    ("Live auf Vercel", f"{LIVE_URL} – zusätzlich ein lokaler Demo-Modus ohne Server, den alle Akzeptanztests nutzen."),
    (f"Release 1: {R1_STORIES} Stories", f"{R1_MUST} Must, {R1_SHOULD} Should: entdecken, filtern, Karte, Details, anmelden, erstellen, teilnehmen, absagen."),
    ("Tests zuerst", f"{N_COMMITS} Commits, jeder mit Feature-ID. Test-Commit vor Umsetzungs-Commit, z. B. d93e8de vor 90cf99b."),
]
y0 = 2.05
for i, (h, t) in enumerate(items):
    yy = y0 + i * 0.93
    text(s, M, yy, 0.4, 0.4, f"{i + 1}", size=14, bold=True, color=ACCENT)
    text(s, M + 0.45, yy, 6.4, 0.35, h, size=16, bold=True)
    text(s, M + 0.45, yy + 0.36, 6.4, 0.55, t, size=12, color=INK2)
    if i < len(items) - 1:
        hline(s, M + 0.45, yy + 0.84, 6.4)
for j, (f, cap) in enumerate([("detail-mobil.png", "Detailansicht"), ("erstellen-schritt-2-mobil.png", "Erstellen, Schritt 2"),
                              ("entdecken-mobil.png", "Entdecken")]):
    px = 7.85 + j * 1.68
    picture(s, SHOTS / f, px, 1.95, h=3.1)
    text(s, px, 5.1, 1.6, 0.3, cap, size=10, color=INK2)
text(s, 7.85, 5.55, 4.9, 1.2, ["Echte Screenshots aus dem Testlauf (docs/testing/screenshots), Demo-Modus mit Online-Karte."],
     size=10, color=INK2)
notes(s, 2, f"""
Redetext:
Seit P4 hat sich die App grundlegend verändert. Erstens: Wir haben die Oberfläche neu gebaut, mobile first. Die Karte ist der Startbildschirm,
die Treffer liegen in einem Bottom Sheet, und Treffen erstellt man in einem Assistenten mit drei Schritten. Rechts seht ihr Detailansicht,
den Schritt Ort und Zeit beim Erstellen und die Entdecken-Ansicht.

Zweitens: Statt Demo-Daten gibt es jetzt ein echtes Backend mit Supabase. Row Level Security ist auf allen Tabellen aktiv, und geschrieben wird
ausschließlich über RPC-Funktionen in der Datenbank. Das ist für das Testen wichtig, weil genau diese Regeln nur gegen die echte Datenbank prüfbar sind.

Drittens: Die App ist live auf Vercel. Daneben gibt es einen lokalen Demo-Modus ohne Server. Den nutzen alle Akzeptanztests, damit sie wiederholbar sind.

Viertens: Release 1 umfasst {R1_STORIES} Stories, {R1_MUST} Must und {R1_SHOULD} Should. Jede Story mit Akzeptanzkriterien hat Akzeptanztests, das hat das Review bestätigt.

Fünftens: Wir arbeiten testgetrieben. Im Git-Log stehen die Test-Commits vor den Umsetzungs-Commits, zum Beispiel die Akzeptanztests zum Teilnehmen
(d93e8de) vor der Umsetzung (90cf99b). Insgesamt {N_COMMITS} Commits, jeder beginnt mit der Feature-ID.

Übergabe an Renat: Wie testen wir das?
""")

# ================================================================ FOLIE 3 Teststrategie
s = base(3, "Teststrategie: vier automatische Ebenen", "Jede Ebene prüft, was sie am billigsten und sichersten prüfen kann",
         ["Testebenen", "Ausführbar"], "docs/teststrategie.md, docs/testing/testfaelle.md (Übersicht)")
levels = [  # von oben nach unten
    ("Akzeptanz (E2E)", f"{N_E2E}", f"× {N_E2E_PROJEKTE} Projekte = {N_E2E * N_E2E_PROJEKTE} Läufe", "Playwright · Mobile + Desktop Chrome · ein AK = ein Nutzerweg"),
    ("Integration", f"{N_INT}", f"{N_INT_LOKAL} lokal, {N_INT_DB} gegen echte DB", "Vitest · RLS, RPC, Trigger, Überbuchungsschutz"),
    ("Komponente", f"{N_KOMP}", f"in {N_KOMP_DATEIEN} Dateien", "Vitest + Testing Library · Beschriftung, Zustände, aria-invalid"),
    ("Unit", f"{N_UNIT}", f"in {N_UNIT_DATEIEN} Dateien", "Vitest · Fachregeln in src/lib ohne UI, Netz und Uhr"),
]
widths = [3.0, 4.0, 5.0, 6.0]
cx = M + 3.0
for i, ((name, n, sub, tool), w) in enumerate(zip(levels, widths)):
    yy = 2.0 + i * 1.02
    x0 = cx - w / 2
    b = box(s, x0, yy, w, 0.86, fill=SURFACE if i else INK, line=INK if i == 0 else LINE)
    col = SURFACE if i == 0 else INK
    text(s, x0 + 0.2, yy + 0.1, w - 0.4, 0.4, [[(n + "  ", {"size": 24, "bold": True}), (name, {"size": 13, "bold": True})]],
         color=col, align=PP_ALIGN.CENTER)
    text(s, x0 + 0.2, yy + 0.53, w - 0.4, 0.3, sub, size=10, color=SURFACE if i == 0 else INK2, align=PP_ALIGN.CENTER)
    text(s, 6.95, yy + 0.12, 5.8, 0.7, [[(name, {"bold": True})], tool], size=11, color=INK2, space_after=1)
text(s, M, 6.15, 6.2, 0.6, f"Dazu {N_MANUELL} manuelle/explorative Fälle (TC-M) für den Supabase-Modus im Browser und die RPCs per Skript.",
     size=11, color=INK2)
box(s, 6.95, 6.13, 5.8, 0.7, fill=ACCENT_SOFT, line=None, radius=0.12)
text(s, 7.1, 6.2, 5.55, 0.6, [[("Story gilt als getestet: ", {"bold": True}),
                               (f"make check und make e2e grün, jedes AK hat einen Test, Coverage-Ziel ≥ {COV_ZIEL} Zeilen.", {})]],
     size=11)
notes(s, 3, f"""
Redetext:
Unsere Teststrategie hat vier automatische Ebenen, als Pyramide dargestellt.
Unten die Unit-Tests: {N_UNIT} Fälle in {N_UNIT_DATEIEN} Dateien. Sie prüfen die Fachregeln, zum Beispiel Validierung, Suche und Filter, Teilnahmeregeln
und die Übersetzung von Datenbankfehlern. Das geht billig, weil die Fachregeln laut Architektur rein in src/lib liegen, ohne Oberfläche, Netz oder Uhr.
Darüber {N_KOMP} Komponententests mit Testing Library: Sie prüfen, was eine Komponente anzeigt, etwa Beschriftungen, Zustände und dass ein Fehlerfeld aria-invalid trägt.
Dann {N_INT} Integrationstests: {N_INT_LOKAL} prüfen Anmeldung, Repository und Sitzung zusammen im lokalen Modus, {N_INT_DB} laufen gegen die echte Supabase-Datenbank.
Nur dort lassen sich Row Level Security, RPC-Funktionen und der Überbuchungsschutz wirklich prüfen.
Oben {N_E2E} Akzeptanztests mit Playwright. Jeder Test ist ein Akzeptanzkriterium als Nutzerweg und läuft in zwei Projekten, Handy und Desktop,
also {N_E2E * N_E2E_PROJEKTE} Läufe.
Dazu kommen {N_MANUELL} manuelle Testfälle für das, was automatisch noch nicht geht: der Supabase-Modus im Browser und die RPCs per Skript.

Wann ist eine Story getestet? make check und make e2e sind grün, jedes Akzeptanzkriterium hat einen Test auf der festgelegten Ebene,
und die Coverage der geänderten Dateien wird genannt, Ziel mindestens {COV_ZIEL} Zeilen.
""")

# ================================================================ FOLIE 4 Beispiel-Testfaelle
s = base(4, "Testfälle: Eingabe → Orakel", "Der Testname nennt das Akzeptanzkriterium, das erwartete Ergebnis steht wörtlich im Test",
         ["Testebenen", "Ausführbar"], "docs/testing/testfaelle.md (TC-U-07, TC-K-01, TC-I-02, TC-A-42)")
rows = [
    [[("Unit", {"bold": True})], [("TC-U-07", {"color": INK2})]],
    [[code("F-00 AK2: verhindert Doppelteilnahme und Überbelegung")]],
    ["Treffen mit 1 freien Platz. Lea tritt bei, Lea erneut, dann Tom"],
    ["Lea dabei, Wiederholung ändert nichts; Tom → „Leider gerade ausgebucht.“, Status „Ausgebucht“"],
    [[("Komponente", {"bold": True})], [("TC-K-01", {"color": INK2})]],
    [[code("F-05 AK2: zeigt die freien Plätze als \"5 von 10 Plätzen frei\"")]],
    ["EventCard mit Kapazität 10, Belegung 5 rendern"],
    ["Text „5 von 10 Plätzen frei“"],
    [[("Integration", {"bold": True})], [("TC-I-02", {"color": INK2})]],
    [[code("F-22 AK2: lehnt Beitritt bei vollem Treffen ab")]],
    ["angemeldet; „demo-volleyball-hafen“ voll (4/4); beitreten"],
    ["„Leider gerade ausgebucht.“, Belegung bleibt 4"],
    [[("Akzeptanz", {"bold": True})], [("TC-A-42", {"color": INK2})]],
    [[code("F-17 AK4: 51 Plätze werden abgelehnt")]],
    ["Lea angemeldet, Assistent Schritt 3, Plätze: 51"],
    ["Meldung „zwischen 2 und 50“, URL bleibt /erstellen"],
]
rows = [rows[i:i + 4] for i in range(0, len(rows), 4)]
rows = [[r[0], r[1], r[2], r[3]] for r in rows]
table(s, M, 2.0, [1.6, 3.9, 3.3, 3.33], rows, header=["Ebene", "Testname", "Eingabe / Vorbedingung", "Orakel (erwartet)"],
      row_h=0.98, size=12, col_styles={1: {"size": 11}})
text(s, M, 6.35, 12.1, 0.5, [[("Regeln: ", {"bold": True}),
                              ("je AK mindestens ein Gutfall, Randwerte als eigene Fälle (z. B. Kapazität 1 / 2 / 50 / 51). "
                               "Hilfsfunktionen in e2e/support.ts bedienen nur, prüfen nie. Katalog: 115 Einträge mit ID, AK, Eingabe, Orakel, Datei › Test.", {})]],
     size=11, color=INK2)
notes(s, 4, """
Redetext:
Hier je ein Testfall pro Ebene, genau so, wie er im Testfallkatalog steht. Jede Zeile hat Testname, Eingabe und Orakel, also das erwartete Ergebnis.

Unit, TC-U-07: Ein Treffen hat noch einen freien Platz. Lea tritt bei, tritt nochmal bei, dann versucht es Tom.
Erwartet: Lea ist dabei, der zweite Beitritt ändert nichts, Tom bekommt wörtlich "Leider gerade ausgebucht." und das Treffen hat den Status "Ausgebucht".

Komponente, TC-K-01: Wir rendern die Treffen-Karte mit Kapazität 10 und Belegung 5. Erwartet ist genau der Text "5 von 10 Plätzen frei".

Integration, TC-I-02: Angemeldet, das Demo-Treffen Volleyball an der Hafenspitze ist mit 4 von 4 voll. Beitritt wird mit "Leider gerade ausgebucht." abgelehnt,
und die Belegung bleibt 4. Hier arbeiten Anmeldung, Repository und Kernlogik zusammen.

Akzeptanz, TC-A-42: Lea ist angemeldet, im Erstellen-Assistenten trägt sie 51 Plätze ein. Erwartet: die Meldung "zwischen 2 und 50" und die URL bleibt /erstellen.
Das ist derselbe Randwert, den wir auch auf Unit-Ebene prüfen, aber diesmal aus Sicht der Nutzerin.

Wichtig: Der Testname beginnt immer mit Feature-ID und Akzeptanzkriterium, z. B. "F-22 AK2". So ist jeder Test einer Anforderung zugeordnet,
und make trace zeigt Lücken. Das Orakel steht sichtbar im Test, nicht versteckt in Hilfsfunktionen.
Der vollständige Katalog liegt in docs/testing/testfaelle.md: repräsentative Unit- und Komponententests, alle Integrations- und Akzeptanztests und die manuellen Fälle.
""")

# ================================================================ FOLIE 5 Ausfuehrbarkeit
s = base(5, "Wiederholbar: ein Befehl, gleiches Ergebnis", "Keine Abhängigkeit von Uhrzeit, Netz, Zufall oder Reihenfolge",
         ["Ausführbar"], "docs/teststrategie.md (Abschnitte 2–4), .github/workflows/ci.yml, Makefile")
box(s, M, 2.0, 6.3, 3.35, fill=INK, line=None, radius=0.04)
cmds = [
    ("# Lint + Typen + Unit/Komponente/Integration", "make check"),
    ("# mit Coverage (src/lib)", "make coverage"),
    ("# Akzeptanz, Mobile + Desktop Chrome", "npx playwright test"),
    ("# gegen echte Supabase-DB (von Hand)", "SUPABASE_INTEGRATION=1 npx vitest run \\\n  tests/integration/supabase-event-repository.int.test.ts"),
    ("# Nachvollziehbarkeit AK → Test", "make trace"),
]
paras = []
for c, cmd in cmds:
    paras.append([(c, {"color": RGBColor(0x9A, 0x9F, 0xA6)})])
    for ln in cmd.split("\n"):
        paras.append([(ln, {"color": SURFACE})])
text(s, M + 0.3, 2.2, 5.8, 3.0, paras, size=12, mono=True, space_after=2, spacing=1.0)
text(s, M, 5.55, 6.3, 0.8, [[("CI bei jedem Pull Request und Push: ", {"bold": True}),
                             ("trace, lint, typecheck, coverage, build. E2E läuft lokal vor jedem Merge, die Supabase-Tests von Hand.", {})]],
     size=11, color=INK2)
det = [
    ("Zeit als Parameter", "Kernlogik bekommt now übergeben; Tests nutzen feste Zeitpunkte, z. B. 26.10.2026 08:00, inkl. Zeitumstellung."),
    ("Feste Umgebung im Browser", "locale de-DE, timezoneId Europe/Berlin, Dev-Server Port 3010."),
    ("Offline-Karte", "NEXT_PUBLIC_MAP_MODE=offline: keine Kartenkacheln aus dem Netz."),
    ("Deterministische Daten", "lokaler Modus, Demotreffen relativ zu „jetzt“, jede Seite frisch, kein Test hängt vom anderen ab."),
    ("Kein Abschalten", "kein skip, only, todo – einzige Ausnahme: skipIf für die Supabase-Tests ohne Zugangsdaten."),
]
for i, (h, t) in enumerate(det):
    yy = 2.0 + i * 0.97
    text(s, 7.35, yy, 5.4, 0.3, h, size=14, bold=True)
    text(s, 7.35, yy + 0.32, 5.4, 0.6, t, size=11, color=INK2)
    if i < len(det) - 1:
        hline(s, 7.35, yy + 0.88, 5.4)
notes(s, 5, """
Redetext:
Ein Testfall ist nur etwas wert, wenn jede Person ihn wiederholen kann und dasselbe Ergebnis bekommt.
Links die Befehle: make check führt Lint, Typprüfung und alle Vitest-Tests aus. make coverage misst zusätzlich die Abdeckung von src/lib.
npx playwright test startet die Akzeptanztests in beiden Browser-Projekten. Die Tests gegen die echte Supabase-Datenbank brauchen
Zugangsdaten und werden deshalb bewusst mit SUPABASE_INTEGRATION=1 eingeschaltet. make trace zeigt, welches Akzeptanzkriterium welchen Test hat.

Rechts, wie wir Wiederholbarkeit sicherstellen:
Die Kernlogik liest keine Uhr. Die aktuelle Zeit wird als Parameter now übergeben. Die Tests setzen feste Zeitpunkte, zum Beispiel den 26.10.2026,
direkt nach der Zeitumstellung, damit auch dieser Randfall abgedeckt ist.
Im Browser laufen die Tests immer mit deutscher Sprache und Zeitzone Europe/Berlin.
Die Karte läuft im Test offline, weil Kartenkacheln aus dem Netz Tests langsam und unzuverlässig machen.
Testdaten sind Demotreffen relativ zu jetzt, im lokalen Modus nur im Arbeitsspeicher. Jede Seite startet frisch, kein Test hängt von einem anderen ab.
Und: Tests werden nicht abgeschaltet. Die einzige erlaubte Ausnahme ist das bedingte Überspringen der Supabase-Tests, wenn keine Zugangsdaten gesetzt sind.

Ehrlich zur CI: Sie läuft bei jedem Pull Request und Push und prüft Nachvollziehbarkeit, Lint, Typen, Coverage und Build.
Die Akzeptanztests laufen lokal vor jedem Merge, die Supabase-Tests von Hand. Beides in die CI zu holen, ist ein nächster Schritt.

Übergabe an Paulo: Neben Tests prüfen wir den Code auch durch Reviews.
""")

# ================================================================ FOLIE 6 Review-Leitfaden
s = base(6, "Review-Leitfaden: erst Spec, dann Code", "Inspektion nach Fagan, leichtgewichtig im Pull Request – jeder Befund mit Beleg Datei:Zeile",
         ["Review-Leitfaden"], "docs/review-leitfaden.md")
steps = [("0", "Selbst-\nprüfung", "coder"), ("1", "Vorbe-\nreitung", "reviewer"), ("2", "Spec-Kon-\nformität", "A1–A7"),
         ("3", "Entwurf\nund Code", "E, C, U, S"), ("4", "Prüf-\nläufe", "check, e2e"), ("5", "Mensch\nliest", "Pflicht*"),
         ("6", "Nach-\narbeit", "coder")]
sw, gap = 1.58, 0.14
for i, (nr, name, who) in enumerate(steps):
    x0 = M + i * (sw + gap)
    hl = nr in ("2", "5")
    box(s, x0, 2.0, sw, 1.3, fill=SURFACE, line=ACCENT if hl else LINE, radius=0.08, line_w=1.25 if hl else 0.75)
    text(s, x0 + 0.15, 2.1, 0.4, 0.3, nr, size=12, bold=True, color=ACCENT if hl else INK2)
    text(s, x0 + 0.15, 2.38, sw - 0.3, 0.6, name, size=13, bold=True, spacing=0.95, space_after=0)
    text(s, x0 + 0.15, 2.98, sw - 0.3, 0.3, who, size=10, color=INK2)
text(s, M, 3.42, 12.1, 0.3, "* Pflicht bei Login, Rechten (RLS, RPC, security definer), Schema/Migrationen, Seed, Secrets. "
     "Höchstens etwa 400 geänderte Zeilen je Review. Besteht Stufe 1 nicht, endet das Review mit „blockierend“.", size=10, color=INK2)
# Checklisten
text(s, M, 3.95, 6, 0.3, "CHECKLISTEN", size=9, bold=True, color=INK2)
checks = [("A", "7", "Spec: jedes AK hat Test, Orakel sichtbar, Randwerte, Tests vor Code"),
          ("E", "7", "Entwurf: Baustein, Abhängigkeitsrichtung, nichts doppelt"),
          ("C", "10", "Code: Namen, Kommentare, Komplexität ≤ 15, deutsche Fehlertexte"),
          ("U", "6", "Oberfläche: Zustände, Tastatur, Fokusfalle, Tokens, 360 px"),
          ("S", "4", "Sicherheit: RLS, nur RPC, Zeilensperre, stabile Fehlercodes")]
for i, (k, n, t) in enumerate(checks):
    yy = 4.3 + i * 0.5
    text(s, M, yy, 0.4, 0.4, k, size=16, bold=True)
    text(s, M + 0.4, yy + 0.04, 0.5, 0.4, n, size=11, color=INK2)
    text(s, M + 0.85, yy + 0.04, 5.6, 0.4, t, size=11)
    hline(s, M, yy + 0.44, 6.4)
text(s, 7.45, 3.95, 5, 0.3, "SCHWEREGRADE", size=9, bold=True, color=INK2)
sev = [("blockierend", "AK nicht erfüllt, Sicherheits- oder Datenfolge, Regel umgangen", "kein Merge", ACCENT),
       ("wichtig", "Fehlverhalten mit Umweg, Testlücke an riskanter Stelle, Barrierefreiheit", "beheben oder Tech-Debt", WARN),
       ("Hinweis", "Verbesserungsidee, veralteter Kommentar", "Autor entscheidet", INK2)]
for i, (g, d, f, col) in enumerate(sev):
    yy = 4.3 + i * 0.83
    box(s, 7.45, yy + 0.05, 0.08, 0.62, fill=col, line=None)
    text(s, 7.7, yy, 2.0, 0.3, g, size=14, bold=True)
    text(s, 9.75, yy + 0.03, 3.0, 0.3, f, size=11, bold=True, color=col if col != INK2 else INK, align=PP_ALIGN.RIGHT)
    text(s, 7.7, yy + 0.34, 5.05, 0.45, d, size=10.5, color=INK2)
notes(s, 6, """
Redetext:
Unser Review-Leitfaden steht in docs/review-leitfaden.md. Er gilt für die Selbstprüfung, für den Reviewer und für die zweite Person im Pull Request.
Oben der Ablauf in sieben Schritten. Wichtig ist die Reihenfolge: Erst wird geprüft, ob das Richtige gebaut wurde, also Spec-Konformität,
dann erst, ob es richtig gebaut wurde, also Entwurf und Code. Wenn Stufe 1 nicht besteht, endet das Review sofort mit "blockierend".
Schritt 5 ist das menschliche Review: Bei Login, Rechten, Datenbankschema und Secrets muss ein Mensch, der nicht selbst umgesetzt hat, den Code lesen.

Links die Checklisten mit Anzahl der Prüfpunkte: A für die Spec, zum Beispiel "jedes Akzeptanzkriterium hat einen Test" und "das Orakel ist sichtbar".
E für den Entwurf, etwa die Abhängigkeitsrichtung. C für den Code, U für die Oberfläche, etwa Fokusfalle in Dialogen und Design-Tokens statt harter Farben,
und S für die Sicherheit: Row Level Security, Schreiben nur über RPC, Zeilensperre gegen Überbuchung.
Zusätzlich gibt es drei Punkte für die Inspektion von Dokumenten wie Spec, Architektur und Migration.

Rechts die drei Schweregrade mit klarer Folge: blockierend heißt kein Merge, wichtig heißt beheben oder bewusst als technische Schuld eintragen,
ein Hinweis entscheidet die Autorin oder der Autor.
Zwei Regeln noch: höchstens etwa 400 geänderte Zeilen pro Review, und jeder Befund braucht einen Beleg mit Datei und Zeile. Geprüft wird der Code, nicht die Person.
Grundlage ist die Inspektion nach Fagan 1976.

Übergabe an Niklas: Was kam bei den Tests heraus?
""")

# ================================================================ FOLIE 7 Testergebnisse
s = base(7, "Testergebnisse: 0 fehlgeschlagen", f"Lauf vom {STAND}, Commit {COMMIT}, Windows 11, Node 22, Playwright 1.65",
         ["Ergebnisse", "Ausführbar"], "docs/testing/testbericht.md, evaluation/results/bericht.md, evaluation/ANLEITUNG.md")
G = {"color": OK, "bold": True}
R = {"color": ACCENT, "bold": True}
res_rows = [
    ["Unit + Komponente + Integration lokal", [(str(VITEST_OK), G)], [(str(VITEST_FAIL), {})], [(str(VITEST_SKIP), {})], f"{VITEST_DAUER}; 2 = Supabase ohne Zugang"],
    ["Integration gegen echte Supabase-DB", [(f"{DB_ERST_OK} → {DB_OK}", G)], [(f"{DB_ERST_FAIL} → {DB_FAIL}", R)], "0", "1. Lauf rot: BUG-01"],
    ["Akzeptanz Mobile Chrome (Pixel 7)", [(str(E2E_MOBIL_OK), G)], str(E2E_FAIL), "0", ""],
    ["Akzeptanz Desktop Chrome", [(str(E2E_DESKTOP_OK), G)], str(E2E_FAIL), "0", f"102 Läufe in {E2E_DAUER}"],
    ["Manuell / explorativ (TC-M-01…10)", [(str(MAN_OK), G)], str(MAN_FAIL), "0", "Befunde BUG-02, BUG-03"],
    ["Typprüfung · Lint", "–", f"{TSC_FEHLER} · {ESLINT_BEFUNDE}", "–", "tsc 0 Fehler, ESLint 0 Befunde"],
]
table(s, M, 1.95, [3.25, 1.1, 1.2, 1.05, 2.0], res_rows,
      header=["Ebene", "bestanden", "fehlgeschl.", "übersprung.", "Bemerkung"], row_h=0.5, size=11,
      col_styles={1: {"size": 14}, 2: {"size": 14}, 3: {"size": 14}, 4: {"size": 9.5, "color": INK2}})
# Coverage
text(s, M, 5.35, 4, 0.3, "COVERAGE src/lib", size=9, bold=True, color=INK2)
cov = [(COV_LIB_ZEILEN, "Zeilen gesamt"), (COV_LIB_ZWEIGE, "Zweige gesamt"), (COV_EVENTS_ZEILEN, "Zeilen Fachregeln\nsrc/lib/events"),
       (COV_SUPA_REPO_ZEILEN, "Supabase-Repository\nim Standardlauf")]
for i, (v, lab) in enumerate(cov):
    x0 = M + i * 2.15
    text(s, x0, 5.62, 2.1, 0.5, v, size=24, bold=True, color=ACCENT if i == 3 else INK)
    text(s, x0, 6.12, 2.1, 0.6, lab, size=10, color=INK2, spacing=1.0)
# SE-Eval
box(s, 9.45, 1.95, 3.28, 4.85, fill=SURFACE, line=LINE, radius=0.05)
text(s, 9.65, 2.1, 3.0, 0.3, "SE-EVAL (EXTERNE MESSUNG)", size=9, bold=True, color=INK2)
text(s, 9.65, 2.35, 3.0, 0.3, f"Commit {SE_COMMIT}, vor den UI-Stories", size=9, color=INK2)
se = [(f"{SE_KK_MEDIAN} / {SE_KK_P90} / {SE_KK_UEBER15}", "kognitive Komplexität\nMedian / P90 / > 15"),
      (f"{SE_TSC} / {SE_UMGEHUNGEN} / {SE_DUPLIKATE}", "strict-Fehler / Typ-Umgehungen /\nDuplikate"),
      (f"{SE_LINE} / {SE_BRANCH}", "Line / Branch Coverage")]
for i, (v, lab) in enumerate(se):
    yy = 2.75 + i * 0.85
    text(s, 9.65, yy, 3.0, 0.4, v, size=17, bold=True)
    text(s, 9.65, yy + 0.38, 3.0, 0.45, lab, size=9.5, color=INK2, spacing=1.0)
hline(s, 9.65, 5.3, 2.9)
text(s, 9.65, 5.4, 3.0, 0.4, [[(SE_MUT_SCORE, {"bold": True, "size": 17, "color": INK2}), ("  Mutation Score", {"size": 10, "color": INK2})]])
text(s, 9.65, 5.82, 2.95, 0.95, f"nicht verwertbar: {SE_UEBERLEBT} von {SE_MUTANTEN} Mutanten „überlebt“ trotz 100 % Zeilen-Coverage. "
     "Messfehler Stryker + Vitest unter Windows; Linux-Lauf offen.", size=9, color=INK2, spacing=1.0)
notes(s, 7, f"""
Redetext:
Jetzt die Ergebnisse, alle aus dem Testbericht vom {STAND} auf Commit {COMMIT}.
Vitest, also Unit, Komponente und lokale Integration: {VITEST_OK} bestanden, {VITEST_FAIL} fehlgeschlagen, {VITEST_SKIP} übersprungen. Die zwei übersprungenen sind
die Supabase-Tests, die ohne Zugangsdaten bewusst nicht laufen. Dauer {VITEST_DAUER}.
Die Supabase-Tests gegen die echte Datenbank: Im ersten Lauf waren beide rot. Das war BUG-01, dazu gleich mehr. Nach der Behebung beide grün.
Akzeptanztests: {E2E_MOBIL_OK} von {N_E2E} auf dem Handy-Profil und {E2E_DESKTOP_OK} von {N_E2E} auf Desktop, zusammen 102 Läufe in {E2E_DAUER}.
Die 10 manuellen Tests im Supabase-Modus sind funktional bestanden, haben aber zwei Befunde geliefert, BUG-02 und BUG-03.
Typprüfung und Lint: 0 Fehler, 0 Befunde.

Coverage von src/lib: {COV_LIB_ZEILEN} der Zeilen und {COV_LIB_ZWEIGE} der Zweige. Die Fachregeln in src/lib/events sind zu {COV_EVENTS_ZEILEN} der Zeilen abgedeckt.
Die Schwachstelle ist rot markiert: Das Supabase-Repository ist im Standardlauf nur zu {COV_SUPA_REPO_ZEILEN} abgedeckt, weil der Rest nur von den
Integrationstests gegen die echte DB erreicht wird. Das hat auch das Review als wichtigen Befund festgehalten.

Rechts die externe Messung mit SE-Eval. Ehrlicher Hinweis: gemessen auf Commit {SE_COMMIT}, also vor den UI-Stories.
Kognitive Komplexität Median {SE_KK_MEDIAN}, P90 {SE_KK_P90}, keine Funktion über 15. Keine strict-Fehler, keine Typ-Umgehungen, keine Duplikate.
Line Coverage {SE_LINE}, Branch {SE_BRANCH}.
Der Mutation Score von {SE_MUT_SCORE} ist nicht verwertbar. {SE_UEBERLEBT} von {SE_MUTANTEN} Mutanten sollen überlebt haben, obwohl die Fachregeln zu 100 Prozent mit exakten
Orakeln abgedeckt sind. Gegenprobe: Baut man einen dieser Mutanten von Hand ein, schlagen 21 Tests fehl. Ursache ist sehr wahrscheinlich die Kopplung
von Stryker und Vitest unter Windows. Wir verwenden die Zahl deshalb nicht als Aussage und wiederholen die Messung unter Linux.
""")

# ================================================================ FOLIE 8 Fehler
s = base(8, "Gefundene Fehler: BUG-01 bis BUG-04", "Jeder Fehler: Fundweg, Ursache, Behebung, Nachweis – Test zuerst, dann Fix",
         ["Ergebnisse"], "docs/testing/fehlerprotokoll.md, docs/testing/testbericht.md")
text(s, M, 1.95, 6, 0.3, "BUG-01 · KRITISCH · BEHOBEN", size=10, bold=True, color=ACCENT)
story = [(f"{UNIT_GRUEN_BEI_BUG01} Unit-Tests grün", "Supabase-Client gemockt: der Mock antwortet so, wie wir es erwarten."),
         ("Integrationstest gegen echte DB: 2 / 2 rot", "PostgREST PGRST201: Einbettung organizer:profiles mehrdeutig – events ist zweimal mit profiles verbunden."),
         ("Behebung: Beziehung benannt", "profiles!events_organizer_id_fkey in event-row-mapping.ts → 2 / 2 grün.")]
for i, (h, t) in enumerate(story):
    yy = 2.35 + i * 1.1
    col = OK if i != 1 else ACCENT
    box(s, M, yy + 0.06, 0.26, 0.26, fill=col, line=None, radius=0.5)
    if i < 2:
        box(s, M + 0.12, yy + 0.36, 0.02, 0.78, fill=LINE, line=None)
    text(s, M + 0.45, yy, 5.6, 0.35, h, size=15, bold=True)
    text(s, M + 0.45, yy + 0.37, 5.6, 0.65, t, size=11, color=INK2)
box(s, M, 5.75, 6.1, 1.05, fill=ACCENT_SOFT, line=None, radius=0.08)
text(s, M + 0.2, 5.85, 5.75, 0.9, [[("Lehre: ", {"bold": True}),
                                     ("Ein Mock prüft nur unsere eigene Annahme. Was nur die Datenbank leistet – Beziehungen, RLS, Sperren – "
                                      "prüfen wir gegen die echte DB, vor jeder Änderung an Schema oder Datenzugriff.", {})]], size=11.5)
text(s, 7.15, 1.95, 5.6, 0.3, "WEITERE FEHLER", size=10, bold=True, color=INK2)
bugs = [
    ("BUG-02", "niedrig", "Toast nach Beitritt „Du bist angemeldet“ klingt nach Login.",
     "manueller Test TC-M-03", "in Bearbeitung: erst Akzeptanztests auf neuen Text, dann Fix"),
    ("BUG-03", "mittel", "Integrationstest hinterlässt sichtbare „Integrationstest Treffen“ in der echten DB.",
     "manueller Test TC-M-01", "Altdaten gelöscht, Aufräumen im Test in Bearbeitung"),
    ("BUG-04", "mittel", "Treffen > 12 h: lokal angenommen, mit Supabase falsche Meldung „Das Ende muss nach dem Beginn liegen.“",
     "Code-Review REV-01", "offen: zuerst Unit-Test 12 h / 12 h 1 min"),
]
for i, (bid, grad, d, fund, st) in enumerate(bugs):
    yy = 2.35 + i * 1.5
    text(s, 7.15, yy, 1.2, 0.3, bid, size=14, bold=True)
    text(s, 8.25, yy + 0.03, 1.2, 0.3, grad, size=10, bold=True, color=WARN if grad == "mittel" else INK2)
    text(s, 9.35, yy + 0.03, 3.4, 0.3, f"Fund: {fund}", size=10, color=INK2, align=PP_ALIGN.RIGHT)
    text(s, 7.15, yy + 0.35, 5.6, 0.55, d, size=11.5)
    text(s, 7.15, yy + 0.92, 5.6, 0.3, st, size=10, color=INK2)
    hline(s, 7.15, yy + 1.3, 5.6)
notes(s, 8, f"""
Redetext:
Insgesamt haben wir vier Fehler gefunden und im Fehlerprotokoll dokumentiert, jeweils mit Fundweg, Ursache, Behebung und Status.

Die wichtigste Geschichte ist BUG-01. Alle {UNIT_GRUEN_BEI_BUG01} Unit-Tests, die es zu dem Zeitpunkt gab, waren grün. Dort ist der Supabase-Client gemockt,
und der Mock antwortet natürlich genau so, wie wir es erwarten.
Dann der Integrationstest gegen die echte Datenbank: beide Fälle rot. Im Supabase-Modus konnte die App überhaupt keine Treffen laden.
Ursache war der PostgREST-Fehler PGRST201: Die Abfrage wollte den Organisator aus der Tabelle profiles einbetten, aber events ist mit profiles
auf zwei Wegen verbunden, direkt über organizer_id und indirekt über die Teilnahmen. Die Datenbank wusste nicht, welche Beziehung gemeint ist.
Die Behebung war eine Zeile: Wir benennen die Beziehung explizit, profiles!events_organizer_id_fkey. Danach beide Tests grün.
Die Lehre: Ein Mock prüft nur unsere eigene Annahme. Was nur die Datenbank leistet, also Beziehungen, Row Level Security und Sperren,
müssen wir gegen die echte Datenbank testen, und zwar vor jeder Änderung an Schema oder Datenzugriff. Das steht jetzt so in der Teststrategie.

Rechts die drei weiteren Fehler.
BUG-02, niedrig: Nach dem Beitritt steht "Du bist angemeldet". Das klingt nach Login. Gefunden im manuellen Test. Weil die Akzeptanztests genau diesen
Text prüfen, stellen wir zuerst die Tests um und ändern dann den Text.
BUG-03, mittel: Die Integrationstests haben Testtreffen in der echten Datenbank hinterlassen, die in der Live-App sichtbar waren. Die Altdaten sind gelöscht,
das automatische Aufräumen im Test ist in Arbeit.
BUG-04, mittel: Treffen länger als 12 Stunden. Die Regel steht nur in der Datenbank, nicht in der Kernlogik. Lokal wird so ein Treffen angenommen,
mit Supabase kommt eine falsche Meldung. Das wurde im Code-Review gefunden, ist also noch nicht durch einen Test belegt, und ist noch offen.
Auch hier gilt: zuerst ein Unit-Test mit 12 Stunden und 12 Stunden und einer Minute, dann die Behebung.

Übergabe an Paulo: die Review-Ergebnisse.
""")

# ================================================================ FOLIE 9 Review-Ergebnisse
s = base(9, "Review: 15 Befunde, 0 blockierend", f"Gesamt-Review von Commit {COMMIT} nach dem Leitfaden, {STAND}",
         ["Review-Leitfaden", "Ergebnisse"], "docs/testing/review-protokoll.md")
for i, (n, lab, col) in enumerate([(REV_BLOCK, "blockierend", INK), (REV_WICHTIG, "wichtig", WARN), (REV_HINWEIS, "Hinweise", INK2)]):
    x0 = M + i * 2.1
    hline(s, x0, 2.0, 1.85, color=INK, weight=1)
    text(s, x0, 2.08, 1.85, 0.8, str(n), size=44, bold=True, color=col)
    text(s, x0, 2.9, 1.85, 0.3, lab, size=12, color=INK2)
text(s, M, 3.45, 6.2, 0.3, "BEISPIELE (WICHTIG)", size=9, bold=True, color=INK2)
ex = [("REV-01", "12-h-Regel fehlt in der Kernlogik → BUG-04"),
      ("REV-02", f"Supabase-Datenzugriff im Standardlauf nur {COV_SUPA_REPO_ZEILEN} Zeilen-Coverage"),
      ("REV-05", "Bestätigungsdialog ohne Fokusfalle, Fokus kehrt nicht zurück"),
      ("REV-07", f"{REV_FARBWERTE} harte Farbwerte in {REV_FARB_DATEIEN} Dateien statt Design-Tokens")]
for i, (rid, t) in enumerate(ex):
    yy = 3.8 + i * 0.55
    text(s, M, yy, 1.0, 0.35, rid, size=12, bold=True, mono=True)
    text(s, M + 1.05, yy + 0.02, 5.2, 0.45, t, size=12)
    hline(s, M, yy + 0.47, 6.2)
text(s, M, 6.1, 6.3, 0.75, [[("Status: ", {"bold": True}),
                             (f"alle {REV_OFFEN} offen; „wichtig“ wird behoben oder als technische Schuld eingetragen. "
                              "Menschliches Review von Migration und Auth-Dateien steht aus.", {})]], size=11, color=INK2)
box(s, 7.25, 1.95, 5.5, 4.85, fill=SURFACE, line=LINE, radius=0.05)
text(s, 7.5, 2.15, 5.0, 0.3, "GEPRÜFT, OHNE BEFUND", size=9, bold=True, color=INK2)
pos = [("S1 RLS", "auf profiles, events, participations aktiv; fremde Teilnahmen nur über prüfende Funktion"),
       ("S2 RPC", "security definer mit search_path = '' und Identität nur aus auth.uid()"),
       ("S3 Überbuchung", "Zeilensperre select … for update plus Check-Constraint als zweites Netz"),
       ("E2 Abhängigkeiten", "Kernlogik importiert nichts aus Datenzugriff oder Oberfläche"),
       ("A6 Regeln", "kein any, ts-ignore, eslint-disable, skip oder only im Code")]
for i, (h, t) in enumerate(pos):
    yy = 2.55 + i * 0.83
    box(s, 7.5, yy + 0.07, 0.14, 0.14, fill=OK, line=None, radius=0.5)
    text(s, 7.8, yy, 4.8, 0.3, h, size=12, bold=True)
    text(s, 7.8, yy + 0.3, 4.75, 0.5, t, size=10.5, color=INK2, spacing=1.0)
notes(s, 9, f"""
Redetext:
Vor der Präsentation haben wir den Gesamtstand nach unserem Leitfaden reviewt, Commit {COMMIT}. Das Ergebnis: {REV_BLOCK + REV_WICHTIG + REV_HINWEIS} Befunde,
{REV_BLOCK} blockierend, {REV_WICHTIG} wichtig und {REV_HINWEIS} Hinweise. Jeder Befund steht mit Datei und Zeile im Review-Protokoll.

Vier Beispiele für "wichtig":
REV-01: Die Datenbank erlaubt höchstens 12 Stunden Dauer, die Kernlogik kennt diese Regel nicht. Daraus wurde BUG-04, den Niklas eben gezeigt hat.
REV-02: Der Supabase-Datenzugriff ist im normalen Testlauf nur zu {COV_SUPA_REPO_ZEILEN} abgedeckt. BUG-01 hat gezeigt, dass genau hier Fehler entstehen.
REV-05: Der Bestätigungsdialog hält den Tastaturfokus nicht fest und gibt ihn nach dem Schließen nicht zurück. Das ist ein Barrierefreiheitsproblem.
REV-07: {REV_FARBWERTE} harte Farbwerte in {REV_FARB_DATEIEN} Dateien statt unserer Design-Tokens.

Rechts, was geprüft wurde und in Ordnung ist, vor allem die Sicherheit: Row Level Security auf allen Tabellen, Schreiben nur über RPC-Funktionen,
die die Identität ausschließlich aus auth.uid() nehmen, und der Überbuchungsschutz mit Zeilensperre und zusätzlichem Check-Constraint.
Die Kernlogik hängt nicht von Datenzugriff oder Oberfläche ab, und es gibt keine umgangenen Regeln.

Ehrlich zum Status: Alle {REV_OFFEN} Befunde sind noch offen. Die wichtigen beheben wir oder tragen sie bewusst als technische Schuld ein.
Und das menschliche Review der Migration und der Anmelde-Dateien steht noch aus. Das machen wir als Team vor dem nächsten Merge.
""")

# ================================================================ FOLIE 10 Grenzen
s = base(10, "Grenzen und nächste Schritte", "Was unsere Tests heute nicht zeigen – und wie wir es angehen",
         ["Testebenen", "Ergebnisse"], "docs/teststrategie.md (Abschnitt 8), docs/testing/testbericht.md, evaluation/ANLEITUNG.md")
text(s, M, 1.95, 5.8, 0.3, "GRENZEN", size=9, bold=True, color=INK2)
lim = [("Kein realer Nutzertest", "Akzeptanztests prüfen die Spec, nicht die Brauchbarkeit."),
       ("Kein Paralleltest auf den letzten Platz", "Schutz per Zeilensperre und Constraint, nur im Review geprüft."),
       ("Mutation Score nicht verwertbar", f"{SE_MUT_SCORE} unter Windows ist ein Messfehler."),
       ("Supabase-Tests nicht in CI", "brauchen Zugangsdaten, laufen von Hand."),
       ("E2E nur Chromium, lokaler Modus", "Safari, Firefox, Online-Karte nur manuell."),
       ("Barrierefreiheit", "über Rollen und Review, kein axe-Audit, kein Screenreader.")]
for i, (h, t) in enumerate(lim):
    yy = 2.3 + i * 0.75
    text(s, M, yy, 5.8, 0.3, h, size=13, bold=True)
    text(s, M, yy + 0.3, 5.8, 0.4, t, size=11, color=INK2)
    hline(s, M, yy + 0.68, 5.8)
text(s, 7.05, 1.95, 5.7, 0.3, "NÄCHSTE SCHRITTE", size=9, bold=True, color=INK2)
nxt = [("P6: Nutzertests mit realen Personen", "Aufgabenliste und SUS-Fragebogen, Ergebnisse ins Feedback-Register."),
       ("BUG-02 bis BUG-04 beheben", "jeweils zuerst ein roter Test, dann die Umsetzung."),
       ("Mutation Score unter Linux messen", "SE-Eval in Docker oder CI statt Windows."),
       ("Paralleltest auf den letzten Platz", "gleichzeitige Beitritte gegen die echte DB."),
       ("Eigene Supabase-Instanz für Tests", "keine Testdaten mehr in der Live-App (BUG-03)."),
       ("Menschliches Review der Migration", "Login, Rechte, Schema vor dem nächsten Merge.")]
for i, (h, t) in enumerate(nxt):
    yy = 2.3 + i * 0.75
    text(s, 7.05, yy, 0.4, 0.3, str(i + 1), size=13, bold=True, color=ACCENT if i == 0 else INK2)
    text(s, 7.45, yy, 5.3, 0.3, h, size=13, bold=True)
    text(s, 7.45, yy + 0.3, 5.3, 0.4, t, size=11, color=INK2)
    hline(s, 7.05, yy + 0.68, 5.7)
notes(s, 10, f"""
Redetext:
Zum Schluss, was unsere Tests heute nicht zeigen.
Erstens, und am wichtigsten: Es gab noch keinen Test mit realen Personen. Unsere Akzeptanztests prüfen, ob die App die Spezifikation erfüllt,
nicht, ob echte Menschen damit zurechtkommen.
Zweitens: Zwei Personen, die gleichzeitig den letzten Platz nehmen wollen, testen wir nicht automatisch. Geschützt ist das durch eine Zeilensperre und einen
Check-Constraint in der Datenbank, aber geprüft nur im Review.
Drittens: Der Mutation Score von {SE_MUT_SCORE} ist ein Messfehler unter Windows, wir haben also aktuell keine verwertbare Aussage zur Wirksamkeit per Mutation.
Viertens: Die Supabase-Tests laufen nicht in der CI. Fünftens: Akzeptanztests nur mit Chromium, im lokalen Modus und mit Offline-Karte.
Sechstens: Barrierefreiheit prüfen wir über Rollen und Beschriftungen in Tests und im Review, aber ohne automatischen Audit und ohne Screenreader.

Daraus die nächsten Schritte. Für P6 machen wir Nutzertests mit realen Personen: Aufgabenliste, SUS-Fragebogen, Ergebnisse ins Feedback-Register.
Wir beheben BUG-02 bis BUG-04, jeweils Test zuerst. Wir messen den Mutation Score unter Linux. Wir schreiben einen Paralleltest auf den letzten Platz gegen die echte DB.
Wir richten eine eigene Supabase-Instanz für Tests ein, damit keine Testdaten mehr in der Live-App landen. Und wir lesen als Menschen die Migration und die Anmelde-Dateien selbst.

Danke. Wir zeigen jetzt gern die App live oder beantworten Fragen.
""")

prs.save(OUT)
print(f"gespeichert: {OUT}")
