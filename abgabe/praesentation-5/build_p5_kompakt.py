# -*- coding: utf-8 -*-
"""Kompakter Entwurf fuer Praesentation 5 "Qualitaet & Tests" (SportMate, 25.11.2026).

Aufruf:  python build_p5_kompakt.py
Ausgabe: SportMate_P5_kompakt.pptx im selben Ordner.

Leitlinien: 8 Folien, eine Kernaussage pro Folie als Satz-Ueberschrift, wenig Text, hoechstens drei Zahlen
pro Folie. Details, Zahlen und die Zuordnung zu den P5-Kriterien stehen in den Sprechernotizen.
Alle Zahlen stehen zentral im Block ZAHLEN. Quellen: docs/testing/testbericht.md, testfaelle.md,
fehlerprotokoll.md, review-protokoll.md, docs/review-leitfaden.md, docs/teststrategie.md.
"""
from pathlib import Path

from pptx import Presentation
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE
from pptx.enum.text import MSO_ANCHOR, PP_ALIGN
from pptx.util import Inches, Pt

HERE = Path(__file__).resolve().parent
REPO = HERE.parent.parent
SHOTS = REPO / "docs" / "testing" / "screenshots"
OUT = HERE / "SportMate_P5_kompakt.pptx"

# ---------------------------------------------------------------- ZAHLEN
# Endlauf 23.11.2026, Commit b98064f (Zahlen vom Orchestrator; Ebenen per Vitest-JSON und e2e-Zaehlung)
STAND = "23.11.2026"
COMMIT = "b98064f"
DATUM_PRAES = "25.11.2026"
LIVE_URL = "sportmate-gamma.vercel.app"
TEAM = ["Julien", "Renat", "Paulo", "Niklas"]

# Testfaelle je Ebene
N_UNIT, N_UNIT_DATEIEN = 255, 22          # src/lib
N_KOMP, N_KOMP_DATEIEN = 47, 7            # src/components
N_KOMP_JSDOM, N_KOMP_HILF = 34, 13        # davon Komponententests in jsdom / Hilfsfunktionen
N_INT, N_INT_LOKAL, N_INT_DB = 8, 6, 2    # tests/integration
N_E2E, N_E2E_PROJEKTE = 72, 2             # e2e/, Mobile Chrome + Desktop Chrome
N_MANUELL = 10

# Laeufe
VITEST_DB_OK, VITEST_DB_FAIL, VITEST_DATEIEN = 310, 0, 32   # mit SUPABASE_INTEGRATION=1
VITEST_CI_OK, VITEST_CI_SKIP = 308, 2                        # ohne Supabase, wie CI
E2E_OK, E2E_SKIP, E2E_FAIL = 142, 2, 0
TSC_FEHLER, ESLINT_BEFUNDE = 0, 0
COV_ANWEISUNGEN, COV_ZWEIGE, COV_FUNKTIONEN, COV_ZEILEN = "95,52 %", "91,07 %", "98,73 %", "97,29 %"
COV_SUPA_REPO_STANDARD = "36,95 %"       # supabase-event-repository.ts, Zeilen im Standardlauf

# Fehler und Review
BUGS_GEFUNDEN, BUGS_BEHOBEN = 4, 4
UNIT_GRUEN_BEI_BUG01 = 85
REV_BLOCK, REV_WICHTIG, REV_HINWEIS = 0, 6, 9
REV_GESAMT = REV_BLOCK + REV_WICHTIG + REV_HINWEIS
REV_BEHOBEN, REV_OFFEN = 10, 5
N_COMMITS = 71

# Wer spricht welche Folie (Index ab 1), je zwei Folien pro Person
SPRECHER = {1: "Julien", 2: "Julien", 3: "Renat", 4: "Paulo", 5: "Renat",
            6: "Niklas", 7: "Paulo", 8: "Niklas"}

# ---------------------------------------------------------------- DESIGN (docs/design.md)
BG = RGBColor(0xF7, 0xF6, 0xF2)
SURFACE = RGBColor(0xFF, 0xFF, 0xFF)
INK = RGBColor(0x15, 0x17, 0x1A)
INK2 = RGBColor(0x5B, 0x60, 0x68)
MUTED = RGBColor(0x9A, 0x9F, 0xA6)
LINE = RGBColor(0xE7, 0xE5, 0xDF)
ACCENT = RGBColor(0xE8, 0x55, 0x2B)
WARN = RGBColor(0xB7, 0x79, 0x1F)
FONT = "Arial"          # Schibsted Grotesk ist auf den Praesentationsrechnern nicht installiert
MONO = "Consolas"

prs = Presentation()
prs.slide_width = Inches(13.333)
prs.slide_height = Inches(7.5)
BLANK = prs.slide_layouts[6]
W = 13.333
M = 0.8
N_FOLIEN = 8


# ---------------------------------------------------------------- HELFER
def text(slide, x, y, w, h, paras, size=20, color=INK, bold=False, align=PP_ALIGN.LEFT,
         anchor=MSO_ANCHOR.TOP, spacing=1.1, space_after=6, mono=False):
    """paras: str | list[str | list[(text, dict)]]. Ein dict kann size/bold/color/mono setzen."""
    tb = slide.shapes.add_textbox(Inches(x), Inches(y), Inches(w), Inches(h))
    tf = tb.text_frame
    tf.word_wrap = True
    tf.auto_size = None
    tf.vertical_anchor = anchor
    tf.margin_left = tf.margin_right = tf.margin_top = tf.margin_bottom = Inches(0)
    if isinstance(paras, str):
        paras = [paras]
    for i, p in enumerate(paras):
        para = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        para.alignment = align
        para.line_spacing = spacing
        para.space_after = Pt(space_after)
        for t, st in ([(p, {})] if isinstance(p, str) else p):
            r = para.add_run()
            r.text = t
            f = r.font
            f.size = Pt(st.get("size", size))
            f.bold = st.get("bold", bold)
            f.color.rgb = st.get("color", color)
            f.name = MONO if st.get("mono", mono) else FONT
    return tb


def shape(slide, kind, x, y, w, h, fill=SURFACE, line=LINE, line_w=1.0, radius=None):
    s = slide.shapes.add_shape(kind, Inches(x), Inches(y), Inches(w), Inches(h))
    if radius is not None:
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


def box(slide, x, y, w, h, **kw):
    kind = MSO_SHAPE.ROUNDED_RECTANGLE if kw.get("radius") is not None else MSO_SHAPE.RECTANGLE
    return shape(slide, kind, x, y, w, h, **kw)


def hline(slide, x, y, w, color=LINE, weight=1.0):
    return box(slide, x, y, w, weight / 72.0, fill=color, line=None)


def arrow(slide, x, y, w=0.5, color=MUTED):
    """Schlanker Pfeil nach rechts: Linie plus kleine Spitze."""
    hline(slide, x, y, w - 0.12, color=color, weight=2)
    tri = shape(slide, MSO_SHAPE.ISOSCELES_TRIANGLE, x + w - 0.16, y - 0.075, 0.16, 0.18, fill=color, line=None)
    tri.rotation = 90


def wordmark(slide, x, y, size):
    text(slide, x, y, 6, size / 50, [[("sportmate", {"bold": True}), (".", {"bold": True, "color": ACCENT})]], size=size)


def base(n, headline):
    """Ruhiges Grundgeruest: Wortmarke, Seitenzahl, Satz-Ueberschrift."""
    s = prs.slides.add_slide(BLANK)
    s.background.fill.solid()
    s.background.fill.fore_color.rgb = BG
    wordmark(s, M, 0.43, 16)
    text(s, W - M - 2, 0.47, 2, 0.3, f"{n:02d} / {N_FOLIEN:02d}", size=12, color=MUTED, align=PP_ALIGN.RIGHT)
    text(s, M, 1.0, W - 2 * M, 1.3, headline, size=36, bold=True, spacing=1.0)
    return s


def notes(slide, n, body):
    slide.notes_slide.notes_text_frame.text = f"Sprecher: {SPRECHER[n]}\n\n" + body.strip()


# ================================================================ FOLIE 1 Titel
s = prs.slides.add_slide(BLANK)
s.background.fill.solid()
s.background.fill.fore_color.rgb = BG
text(s, M, 1.25, 7, 0.3, "SOFTWAREPROJEKT · PRÄSENTATION 5", size=14, color=INK2, bold=True)
wordmark(s, M - 0.05, 1.7, 80)
text(s, M, 3.2, 7.5, 0.8, "Qualität & Tests", size=40, bold=True)
text(s, M, 4.15, 7.5, 0.5, "Wie wir sicherstellen, dass SportMate tut, was es soll.", size=20, color=INK2)
hline(s, M, 5.35, 6.6)
text(s, M, 5.55, 7.5, 0.4, " · ".join(TEAM), size=18, bold=True)
text(s, M, 6.0, 7.5, 0.4, [[(f"{DATUM_PRAES}  ·  ", {"color": INK2}), (LIVE_URL, {"color": INK})]], size=18)
pic_h = 6.5
pic = s.shapes.add_picture(str(SHOTS / "entdecken-mobil.png"), Inches(8.85), Inches(0.5), height=Inches(pic_h))
pic.line.color.rgb = LINE
pic.line.width = Pt(1)
notes(s, 1, f"""
Redetext (ca. 45 Sekunden):
Guten Tag, wir sind Team SportMate: Julien, Renat, Paulo und Niklas. Heute geht es um Qualität und Tests.
Rechts seht ihr die App, wie sie jetzt ist: mobile first, die Karte ist der Startbildschirm, darunter die Liste der Treffen in Flensburg.
Sie läuft live unter {LIVE_URL}; was ihr hier seht, ist der lokale Demo-Modus, den auch unsere automatischen Tests benutzen.

Wir zeigen euch in acht Folien vier Dinge, die P5 verlangt:
erstens, auf welchen Ebenen wir testen, zweitens, wie ein Testfall aufgebaut ist und wie man alle Tests wiederholt,
drittens unseren Review-Leitfaden und viertens, was Tests und Review ergeben haben, inklusive der Fehler, die wir gefunden haben.

Hintergrund für Rückfragen: Seit P4 haben wir die Oberfläche neu gebaut und ein echtes Backend mit Supabase angebunden
(Row Level Security auf allen Tabellen, Schreiben nur über RPC-Funktionen). Auf develop liegen {N_COMMITS} Commits,
jeder beginnt mit der Feature-ID; Test-Commits liegen vor den Umsetzungs-Commits.
Alle Zahlen dieser Präsentation stammen aus dem Endlauf vom {STAND}, Commit {COMMIT}.
Ausführliche Fassung mit allen Tabellen: SportMate_P5_Qualitaet_und_Tests.pptx.

Sprecher: Julien 1–2, Renat 3 und 5, Paulo 4 und 7, Niklas 6 und 8.
""")

# ================================================================ FOLIE 2 Teststrategie
s = base(2, "Wir testen auf vier Ebenen – vom Baustein bis zum Klickpfad")
layers = [  # von oben nach unten
    ("Akzeptanz", "Klickpfade im Browser"),
    ("Integration", "mit echter Datenbank"),
    ("Komponente", "was man auf dem Bildschirm sieht"),
    ("Unit", "Fachregeln, ohne Oberfläche"),
]
lw = [5.0, 6.6, 8.2, 9.8]
lh, gap, y0 = 0.82, 0.1, 2.55
cx = W / 2
for i, ((name, desc), w) in enumerate(zip(layers, lw)):
    yy = y0 + i * (lh + gap)
    top = i == 0
    b = box(s, cx - w / 2, yy, w, lh, fill=INK if top else SURFACE, line=None if top else LINE)
    text(s, cx - w / 2, yy, w, lh, [[(name, {"bold": True}), ("   " + desc, {"color": SURFACE if top else INK2})]],
         size=20, color=SURFACE if top else INK, align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE, space_after=0)
text(s, M, 6.4, W - 2 * M, 0.5, "Unten viele schnelle Tests, oben wenige, die wie ein Mensch durch die App klicken.",
     size=20, color=INK2, align=PP_ALIGN.CENTER)
notes(s, 2, f"""
P5-Kriterium: Testfälle auf mehreren Ebenen (Unit, Komponente, Integration, Akzeptanz).

Redetext (ca. 1 Minute):
Unsere Teststrategie hat vier automatische Ebenen, als Pyramide.
Ganz unten die Unit-Tests: {N_UNIT} Fälle in {N_UNIT_DATEIEN} Dateien. Sie prüfen die Fachregeln, zum Beispiel Validierung beim Erstellen,
Suche und Filter, wer wann teilnehmen darf. Das geht schnell und billig, weil diese Regeln in src/lib liegen, ohne Oberfläche, Netz oder Uhr.
Darüber die Komponententests: {N_KOMP} Tests in src/components, davon {N_KOMP_JSDOM} echte Komponententests mit Testing Library.
Sie prüfen, was eine Komponente anzeigt: Beschriftungen, Zustände wie „Ausgebucht“, die Fokusfalle in Dialogen.
Die übrigen {N_KOMP_HILF} prüfen kleine Hilfsfunktionen der Oberfläche.
Dann {N_INT} Integrationstests: {N_INT_LOKAL} prüfen Anmeldung, Datenzugriff und Kernlogik zusammen im lokalen Modus,
{N_INT_DB} laufen gegen die echte Supabase-Datenbank. Nur dort lassen sich Rechte und der Schutz vor Überbuchung wirklich prüfen.
Oben die Akzeptanztests mit Playwright: {N_E2E} Klickpfade, jeder entspricht einem Akzeptanzkriterium und läuft zweimal,
auf einem Handy-Profil und auf Desktop, also {N_E2E * N_E2E_PROJEKTE} Läufe.
Dazu kommen {N_MANUELL} manuelle, explorative Testfälle im Supabase-Modus.

Eine Story gilt bei uns als getestet, wenn make check und make e2e grün sind und jedes Akzeptanzkriterium einen Test hat.
""")

# ================================================================ FOLIE 3 Ein Testfall
s = base(3, "Jeder Testfall hat eine klare Eingabe und ein festes Orakel")
cw, ch, cy = 5.15, 2.45, 2.55
box(s, M, cy, cw, ch, fill=SURFACE, line=LINE, radius=0.06)
text(s, M + 0.4, cy + 0.35, cw - 0.8, 0.3, "EINGABE", size=14, bold=True, color=INK2)
text(s, M + 0.4, cy + 0.8, cw - 0.8, 1.5, ["Treffen voll: 4 von 4.", "Lea tippt „Jetzt teilnehmen“."],
     size=24, spacing=1.05, space_after=8)
arrow(s, M + cw + 0.32, cy + ch / 2, w=0.9, color=INK)
rx = W - M - cw
box(s, rx, cy, cw, ch, fill=SURFACE, line=INK, line_w=1.5, radius=0.06)
text(s, rx + 0.4, cy + 0.35, cw - 0.8, 0.3, "ERWARTET (ORAKEL)", size=14, bold=True, color=INK2)
text(s, rx + 0.4, cy + 0.8, cw - 0.8, 1.5, [[("„Leider gerade ausgebucht.“", {"bold": True})], "Belegung bleibt bei 4."],
     size=24, spacing=1.05, space_after=8)
text(s, M, cy + ch + 0.2, W - 2 * M, 0.3, "Testname:  F-22 AK2: lehnt Beitritt bei vollem Treffen ab",
     size=14, color=INK2, mono=True)
by, bh = 5.95, 0.9
box(s, M, by, W - 2 * M, bh, fill=INK, line=None, radius=0.1)
half = (W - 2 * M) / 2
for i, (cmd, lab) in enumerate([("make check", "Unit bis Integration"),
                                 ("make e2e", "alle Klickpfade im Browser")]):
    text(s, M + 0.45 + i * half, by, half - 0.5, bh,
         [[(cmd, {"mono": True, "bold": True, "color": SURFACE, "size": 22}), ("   " + lab, {"color": MUTED})]],
         size=18, anchor=MSO_ANCHOR.MIDDLE, space_after=0)
notes(s, 3, f"""
P5-Kriterium: Testfälle sind wiederholbar und ausführbar, mit klaren Inputs und Orakeln.

Redetext (ca. 1 Minute):
So sieht ein Testfall bei uns aus, hier TC-I-02 aus dem Testfallkatalog.
Eingabe: Ein Treffen ist voll, vier von vier Plätzen. Lea ist angemeldet und tippt auf „Jetzt teilnehmen“.
Erwartet, also das Orakel: Die App sagt wörtlich „Leider gerade ausgebucht.“ und die Belegung bleibt bei vier.
Der Testname beginnt mit Feature-ID und Akzeptanzkriterium, F-22 AK2. So ist jeder Test einer Anforderung zugeordnet,
und make trace zeigt, wo ein Kriterium noch keinen Test hat.
Dieselbe Regel prüfen wir auch auf Unit-Ebene (TC-U-07: Lea, Lea nochmal, dann Tom) und als Komponente (TC-K-04: Karte zeigt „Ausgebucht“).

Wiederholbar heißt: ein Befehl, gleiches Ergebnis. make check startet Lint, Typprüfung und alle Vitest-Tests, make e2e alle Klickpfade.
Dafür sorgen wir so: Die Kernlogik bekommt die aktuelle Zeit als Parameter, statt eine Uhr zu lesen, die Browser-Tests laufen immer
mit deutscher Sprache und Zeitzone Europe/Berlin, die Karte läuft im Test offline, und jeder Test startet mit frischen Demo-Daten.
Kein Test hängt von einem anderen ab. Tests werden nicht abgeschaltet; einzige Ausnahme sind die Supabase-Tests,
die nur mit Zugangsdaten laufen (SUPABASE_INTEGRATION=1).
Die CI läuft bei jedem Pull Request und Push: Nachvollziehbarkeit, Lint, Typen, Coverage, Build.

Der vollständige Katalog mit ID, Akzeptanzkriterium, Eingabe, Orakel und Testdatei steht in docs/testing/testfaelle.md.
""")

# ================================================================ FOLIE 4 Review-Leitfaden
s = base(4, "Unser Review-Leitfaden prüft erst die Anforderung, dann den Code")
steps = [("1", "Selbst prüfen", "Mit Checkliste, vor dem Review."),
         ("2", "Anforderung prüfen", "Wurde das Richtige gebaut?"),
         ("3", "Code prüfen", "Wurde es richtig gebaut?"),
         ("4", "Mensch liest", "Pflicht bei Login, Rechten, Datenbank.")]
sw, ag = 2.55, 0.6
total = 4 * sw + 3 * ag
x0 = (W - total) / 2
sy, sh = 2.55, 2.75
for i, (nr, name, sub) in enumerate(steps):
    xx = x0 + i * (sw + ag)
    box(s, xx, sy, sw, sh, fill=SURFACE, line=LINE, radius=0.06)
    text(s, xx + 0.3, sy + 0.3, 1, 0.4, nr, size=20, bold=True, color=ACCENT if i == 1 else MUTED)
    text(s, xx + 0.3, sy + 0.75, sw - 0.5, 0.8, name, size=22, bold=True, spacing=1.0)
    text(s, xx + 0.3, sy + 1.65, sw - 0.5, 1.0, sub, size=18, color=INK2, spacing=1.0)
    if i < 3:
        arrow(s, xx + sw + 0.1, sy + sh / 2, w=ag - 0.2)
ry = 5.95
text(s, x0, ry, 4.6, 0.5, "Jeder Befund bekommt einen Grad:", size=20, color=INK2, anchor=MSO_ANCHOR.MIDDLE)
for i, (lab, col) in enumerate([("blockierend", ACCENT), ("wichtig", WARN), ("Hinweis", INK2)]):
    px = x0 + 4.8 + i * 2.15
    b = box(s, px, ry, 1.95, 0.5, fill=None, line=col, line_w=1.5, radius=0.5)
    text(s, px, ry, 1.95, 0.5, lab, size=18, bold=True, color=col, align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE, space_after=0)
notes(s, 4, """
P5-Kriterium: Review- und Inspektions-Guidelines liegen vor (docs/review-leitfaden.md).

Redetext (ca. 1 Minute):
Neben Tests prüfen wir den Code durch Reviews. Der Leitfaden steht in docs/review-leitfaden.md und gilt für die Selbstprüfung,
für den Review-Agenten und für die zweite Person im Pull Request. Grundlage ist die Inspektion nach Fagan, leichtgewichtig im Pull Request.

Der Ablauf in vier Schritten (im Dokument genauer in sieben):
Erstens prüft, wer umgesetzt hat, selbst: make check grün, Checkliste Code und Sicherheit gelesen.
Zweitens die Anforderung: Wurde das Richtige gebaut? Hat jedes Akzeptanzkriterium einen Test, ist das Orakel sichtbar, sind Randwerte getestet,
wurden Tests vor dem Code committet? Besteht diese Stufe nicht, endet das Review sofort mit „blockierend“.
Drittens der Code: Wurde es richtig gebaut? Dafür gibt es vier Checklisten: Entwurf (E1–E7, z. B. Abhängigkeitsrichtung),
Code (C1–C10, z. B. Namen, Komplexität höchstens 15, deutsche Fehlertexte), Oberfläche (U1–U6, z. B. Tastatur, Fokusfalle, Design-Tokens)
und Sicherheit (S1–S4: Row Level Security, Schreiben nur über RPC, Zeilensperre gegen Überbuchung).
Viertens: Bei Login, Rechten, Datenbankschema und Secrets muss ein Mensch, der nicht selbst umgesetzt hat, den Code lesen.

Jeder Befund bekommt einen Schweregrad mit klarer Folge: blockierend heißt kein Merge, wichtig heißt beheben oder bewusst
als technische Schuld eintragen, ein Hinweis entscheidet die Autorin oder der Autor.
Zwei Regeln noch: höchstens etwa 400 geänderte Zeilen pro Review, und jeder Befund braucht einen Beleg mit Datei und Zeile.
Geprüft wird der Code, nicht die Person.
""")

# ================================================================ FOLIE 5 Ergebnisse
s = base(5, "Im Endlauf ist alles grün – auf jeder Ebene")
kz = [(str(VITEST_DB_OK), "Tests bestanden", "von Unit bis Integration"),
      (str(E2E_OK), "Klickpfade bestanden", "auf Handy und Desktop"),
      (str(BUGS_BEHOBEN), "Fehler gefunden", "und alle behoben")]
colw = (W - 2 * M - 2 * 0.6) / 3
for i, (zahl, lab, sub) in enumerate(kz):
    xx = M + i * (colw + 0.6)
    hline(s, xx, 2.75, colw, color=INK, weight=1.5)
    text(s, xx, 2.95, colw, 1.6, zahl, size=110, bold=True, color=INK, spacing=0.9)
    text(s, xx, 4.7, colw, 0.45, lab, size=24, bold=True)
    text(s, xx, 5.15, colw, 0.45, sub, size=20, color=INK2)
text(s, M, 6.35, W - 2 * M, 0.45, "Keiner fehlgeschlagen. Typprüfung und Lint ohne Befund.", size=20, color=INK2)
notes(s, 5, f"""
P5-Kriterium: Testergebnisse sind dokumentiert (bestanden / fehlgeschlagen), docs/testing/testbericht.md.

Redetext (ca. 1 Minute):
Jetzt die Ergebnisse, alle aus dem Endlauf vom {STAND} auf Commit {COMMIT}, nachdem alle gefundenen Fehler behoben waren.
Vitest, also Unit, Komponente und Integration, einschließlich der Tests gegen die echte Supabase-Datenbank:
{VITEST_DB_OK} von {VITEST_DB_OK} bestanden, in {VITEST_DATEIEN} Dateien, {VITEST_DB_FAIL} fehlgeschlagen.
Ohne Datenbank-Zugang, so wie in der CI, sind es {VITEST_CI_OK} bestanden und {VITEST_CI_SKIP} bewusst übersprungen, nämlich genau die beiden Datenbank-Tests.
Playwright: {E2E_OK} Klickpfade bestanden, {E2E_FAIL} fehlgeschlagen, {E2E_SKIP} gewollt übersprungen: ein Test, der nur auf dem Handy Sinn ergibt,
und einer für die Seitenleiste, die es nur auf Desktop gibt. Projekte: Mobile Chrome und Desktop Chrome.
Typprüfung: {TSC_FEHLER} Fehler, ESLint: {ESLINT_BEFUNDE} Befunde.

Coverage von src/lib im Lauf mit echter Datenbank: Anweisungen {COV_ANWEISUNGEN}, Zweige {COV_ZWEIGE}, Funktionen {COV_FUNKTIONEN}, Zeilen {COV_ZEILEN}.
Unser Ziel waren mindestens 80 Prozent Zeilen. Ehrlich dazu: Im Standardlauf ohne Datenbank ist das Supabase-Repository nur zu {COV_SUPA_REPO_STANDARD}
der Zeilen abgedeckt, der Rest wird nur von den Datenbank-Tests erreicht.

Und: Wir haben {BUGS_GEFUNDEN} echte Fehler gefunden und alle {BUGS_BEHOBEN} behoben. Gefunden durch einen Integrationstest gegen die echte Datenbank (1),
manuelle explorative Tests (2) und das Code-Review (1). Jeder steht mit Fundweg, Ursache, Behebung und Commit in docs/testing/fehlerprotokoll.md.
Den wichtigsten erzählt euch Niklas.
""")

# ================================================================ FOLIE 6 BUG-01
s = base(6, "Ein Fehler hat uns gelehrt: Ein Mock prüft nur unsere eigene Annahme")
text(s, M, 2.55, 6, 0.3, "BUG-01  ·  KRITISCH  ·  BEHOBEN", size=14, bold=True, color=INK2)
stations = [("Unit-Tests grün", "Der Mock antwortet genau so, wie wir es erwarten."),
            ("Echte Datenbank: rot", "Die App kann keine Treffen laden."),
            ("Eine Zeile behoben", "Die Abfrage nennt die gemeinte Beziehung jetzt eindeutig.")]
colw = (W - 2 * M) / 3
ly = 3.35
hline(s, M + 0.17, ly + 0.17, 2 * colw, color=LINE, weight=2)
for i, (h, t) in enumerate(stations):
    xx = M + i * colw
    col = ACCENT if i == 1 else INK
    shape(s, MSO_SHAPE.OVAL, xx, ly, 0.34, 0.34, fill=col, line=None)
    text(s, xx, ly + 0.65, colw - 0.5, 0.5, h, size=24, bold=True, color=col if i == 1 else INK)
    text(s, xx, ly + 1.15, colw - 0.5, 1.0, t, size=18, color=INK2)
box(s, M, 5.85, W - 2 * M, 0.95, fill=SURFACE, line=LINE, radius=0.08)
text(s, M + 0.45, 5.85, W - 2 * M - 0.9, 0.95,
     [[("Seitdem: ", {"bold": True}), ("Datenbank-Regeln testen wir gegen die echte Datenbank.", {})]],
     size=22, anchor=MSO_ANCHOR.MIDDLE, space_after=0)
notes(s, 6, f"""
P5-Kriterium: Testergebnisse inkl. Bug-Beschreibungen dokumentiert (docs/testing/fehlerprotokoll.md, BUG-01).

Redetext (ca. 1 Minute):
Der wichtigste Fehler war BUG-01, und er erzählt sich in drei Stationen.
Erste Station: Alle {UNIT_GRUEN_BEI_BUG01} Unit-Tests, die es zu dem Zeitpunkt gab, waren grün. Dort ist der Supabase-Client gemockt, also nachgebaut,
und der Mock antwortet natürlich genau so, wie wir es erwarten.
Zweite Station: Der Integrationstest gegen die echte Datenbank, zwei von zwei Fällen rot. Im Supabase-Modus konnte die App überhaupt keine Treffen laden,
Meldung „Die Treffen konnten nicht geladen werden“. Ursache war der PostgREST-Fehler PGRST201: Die Abfrage wollte den Organisator aus der Tabelle profiles
mitladen, aber events ist mit profiles auf zwei Wegen verbunden, direkt über organizer_id und indirekt über die Teilnahmen.
Die Datenbank wusste nicht, welche Beziehung gemeint ist.
Dritte Station: Die Behebung war eine Zeile. Wir nennen die Beziehung explizit, profiles!events_organizer_id_fkey, in event-row-mapping.ts. Danach beide Tests grün.

Die Lehre: Ein Mock prüft nur unsere eigene Annahme. Was nur die Datenbank leistet, also Beziehungen, Row Level Security und Sperren,
testen wir gegen die echte Datenbank, vor jeder Änderung an Schema oder Datenzugriff. Das steht jetzt so in der Teststrategie.

Die anderen drei Fehler, alle behoben, für Rückfragen:
BUG-02 (niedrig, manueller Test): Nach dem Beitritt stand „Du bist angemeldet“, das klingt nach Login. Erst die Tests auf „Du bist dabei“ umgestellt (rot), dann der Text.
BUG-03 (mittel, manueller Test): Integrationstests hinterließen sichtbare Testtreffen in der echten Datenbank; jetzt sagt jeder Test sie wieder ab.
BUG-04 (mittel, Code-Review): Treffen über 12 Stunden wurden lokal angenommen, mit Supabase kam eine falsche Meldung; jetzt prüft die Kernlogik die 12-Stunden-Regel selbst.
""")

# ================================================================ FOLIE 7 Review-Ergebnis
s = base(7, f"Das Review fand {REV_GESAMT} Befunde – keiner blockierend, {REV_BEHOBEN} schon behoben")
sq, sg = 0.62, 0.14
row_w = REV_GESAMT * sq + (REV_GESAMT - 1) * sg
sx, sy = (W - row_w) / 2, 2.85
for i in range(REV_GESAMT):
    done = i < REV_BEHOBEN
    box(s, sx + i * (sq + sg), sy, sq, sq, fill=INK if done else None, line=None if done else INK2, line_w=1.5, radius=0.12)
text(s, sx, sy + sq + 0.2, 4, 0.4, "behoben", size=18, bold=True)
text(s, sx + REV_BEHOBEN * (sq + sg), sy + sq + 0.2, 4, 0.4, "offen", size=18, bold=True, color=INK2)
colw = (W - 2 * M - 0.8) / 2
for i, (h, t) in enumerate([("Noch offen", "Die Datenbank-Tests laufen noch nicht automatisch in der CI. Dazu vier kleine Hinweise."),
                            ("Noch zu tun", "Ein Mensch aus dem Team liest Datenbankschema und Login-Code selbst.")]):
    xx = M + i * (colw + 0.8)
    hline(s, xx, 4.75, colw)
    text(s, xx, 4.95, colw, 0.45, h, size=22, bold=True)
    text(s, xx, 5.45, colw, 1.2, t, size=20, color=INK2)
notes(s, 7, f"""
P5-Kriterium: Review-Ergebnisse dokumentiert (docs/testing/review-protokoll.md) und Anwendung des Leitfadens.

Redetext (ca. 1 Minute):
Vor der Präsentation haben wir den Gesamtstand nach unserem Leitfaden reviewt. Ergebnis: {REV_GESAMT} Befunde, {REV_BLOCK} blockierend,
{REV_WICHTIG} wichtig und {REV_HINWEIS} Hinweise. Jeder Befund steht mit Datei und Zeile im Review-Protokoll.
Die dunklen Kästchen sind behoben, {REV_BEHOBEN} von {REV_GESAMT}, jeweils mit eigenem Commit. Beispiele:
REV-01: Die Datenbank erlaubte höchstens 12 Stunden Dauer, die Kernlogik kannte die Regel nicht. Daraus wurde BUG-04, behoben.
REV-05: Der Bestätigungsdialog hielt den Tastaturfokus nicht fest. Behoben, mit gemeinsamer Fokusfalle und Komponententests.
REV-07: 23 harte Farbwerte in 13 Dateien statt Design-Tokens. Behoben.

Offen sind {REV_OFFEN}: REV-02 ist „wichtig“: Der Supabase-Datenzugriff ist im Standardlauf nur zu {COV_SUPA_REPO_STANDARD} abgedeckt,
weil die Datenbank-Tests Zugangsdaten brauchen und deshalb nicht in der CI laufen. Mit Datenbank liefen sie vollständig grün.
Dazu vier Hinweise: REV-09 veralteter Kommentar in der Migration, REV-10 die öffentlich lesbare Organisator-Kennung, über die wir bewusst entscheiden müssen,
REV-13 generierte Datenbank-Typen und REV-14 die Komplexitätsregel, die nicht ESLint, sondern Review und SE-Eval durchsetzen.

Geprüft und in Ordnung ist vor allem die Sicherheit: Row Level Security auf allen Tabellen, Schreiben nur über RPC-Funktionen,
die die Identität ausschließlich aus auth.uid() nehmen, und der Überbuchungsschutz mit Zeilensperre plus Check-Constraint.
Was noch aussteht: Das menschliche Review der Migrationen und der Anmelde-Dateien. Das machen wir als Team vor dem nächsten Merge.
""")

# ================================================================ FOLIE 8 Naechste Schritte
s = base(8, "Als Nächstes testen wir mit echten Menschen")
nxt = [("Nutzertests in P6", "Echte Personen lösen Aufgaben in der App, danach ein kurzer Fragebogen."),
       ("Datenbank-Tests in die CI", "Damit sie bei jedem Pull Request laufen, nicht nur von Hand."),
       ("Offene Befunde abarbeiten", "Inklusive des menschlichen Reviews von Schema und Login.")]
for i, (h, t) in enumerate(nxt):
    yy = 2.6 + i * 1.15
    text(s, M, yy, 0.6, 0.5, str(i + 1), size=24, bold=True, color=ACCENT if i == 0 else MUTED)
    text(s, M + 0.7, yy, 8.5, 0.5, h, size=24, bold=True)
    text(s, M + 0.7, yy + 0.5, 9.5, 0.5, t, size=20, color=INK2)
hline(s, M, 6.15, W - 2 * M)
text(s, M, 6.35, 6, 0.5, "Danke. Fragen?", size=24, bold=True)
text(s, W - M - 6, 6.38, 6, 0.5, LIVE_URL, size=20, color=INK2, align=PP_ALIGN.RIGHT)
notes(s, 8, """
P5-Bezug: Grenzen der Tests ehrlich benennen; Überleitung zu P6 (Nutzertests).

Redetext (ca. 45 Sekunden):
Zum Schluss, was unsere Tests heute nicht zeigen und was wir als Nächstes tun.
Die größte Lücke: Es gab noch keinen Test mit realen Personen. Unsere Akzeptanztests prüfen, ob die App die Spezifikation erfüllt,
nicht, ob echte Menschen damit zurechtkommen. Deshalb machen wir für P6 Nutzertests: eine Aufgabenliste, danach der SUS-Fragebogen,
und die Ergebnisse kommen in unser Feedback-Register.
Zweitens holen wir die Datenbank-Tests in die CI, das ist der offene Befund REV-02.
Drittens arbeiten wir die offenen Hinweise ab, und ein Mensch aus dem Team liest Migration und Anmelde-Code selbst.

Weitere Grenzen für Rückfragen:
Zwei Personen, die gleichzeitig den letzten Platz nehmen, testen wir nicht automatisch; geschützt ist das durch Zeilensperre und Check-Constraint, geprüft im Review.
Der Mutation Score ist offen: Die erste Messung unter Windows war ein Messfehler, wir wiederholen sie unter Linux.
Akzeptanztests laufen nur mit Chromium, im lokalen Modus und mit Offline-Karte. Barrierefreiheit prüfen wir über Rollen und Review, ohne automatischen Audit.

Danke. Wir zeigen gern die App live oder beantworten Fragen.
""")

prs.save(OUT)
print(f"gespeichert: {OUT}")
