from pathlib import Path
from reportlab.lib.pagesizes import A4
from reportlab.lib.colors import HexColor, white
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "YOS-Capability-Statement.pdf"
FONT_REGULAR = Path("/tmp/yos-capability-fonts/Montserrat-Regular.ttf")
FONT_BOLD = Path("/tmp/yos-capability-fonts/Montserrat-Bold.ttf")

W, H = A4
TEAL = HexColor("#00B5A5")
INK = HexColor("#1A1A1A")
MUTED = HexColor("#5C6268")
PALE = HexColor("#EAF8F6")
SOFT = HexColor("#F5F5F2")

pdfmetrics.registerFont(TTFont("Montserrat", str(FONT_REGULAR)))
pdfmetrics.registerFont(TTFont("Montserrat-Bold", str(FONT_BOLD)))


def txt(c, text, x, y, size=10, color=INK, font="Montserrat", max_width=None, leading=None):
    c.setFillColor(color)
    c.setFont(font, size)
    if max_width is None:
        c.drawString(x, y, text)
        return y
    words = text.split()
    lines, line = [], ""
    for word in words:
        trial = f"{line} {word}".strip()
        if c.stringWidth(trial, font, size) <= max_width:
            line = trial
        else:
            if line:
                lines.append(line)
            line = word
    if line:
        lines.append(line)
    step = leading or size * 1.38
    for line in lines:
        c.drawString(x, y, line)
        y -= step
    return y


def rounded(c, x, y, w, h, fill, radius=16, stroke=None):
    c.setFillColor(fill)
    c.setStrokeColor(stroke or fill)
    c.roundRect(x, y, w, h, radius, fill=1, stroke=1 if stroke else 0)


def header(c, label):
    txt(c, "YOUR OFFICE SPACE", 40, H - 38, 8, TEAL, "Montserrat-Bold")
    txt(c, label.upper(), W - 40 - c.stringWidth(label.upper(), "Montserrat", 7), H - 38, 7, MUTED)
    c.setStrokeColor(HexColor("#D9DDDC"))
    c.line(40, H - 50, W - 40, H - 50)


def footer(c, page):
    c.setStrokeColor(HexColor("#D9DDDC"))
    c.line(40, 34, W - 40, 34)
    txt(c, "yourofficespace.au  |  jk@yourofficespace.au  |  (02) 4092 0733", 40, 19, 7, MUTED)
    txt(c, str(page), W - 45, 19, 7, MUTED)


def image_cover(c, path, x, y, w, h, radius=18):
    path = Path(path)
    if not path.exists():
        return
    with Image.open(path) as im:
        iw, ih = im.size
    scale = max(w / iw, h / ih)
    sw, sh = iw * scale, ih * scale
    c.saveState()
    clip = c.beginPath()
    clip.roundRect(x, y, w, h, radius)
    c.clipPath(clip, stroke=0, fill=0)
    c.drawImage(ImageReader(str(path)), x - (sw - w) / 2, y - (sh - h) / 2, sw, sh, preserveAspectRatio=True, mask="auto")
    c.restoreState()


def card(c, x, y, w, h, number, title, body, fill=SOFT):
    rounded(c, x, y, w, h, fill, 16)
    rounded(c, x + 16, y + h - 42, 28, 28, TEAL, 8)
    txt(c, number, x + 25, y + h - 33, 10, INK, "Montserrat-Bold")
    txt(c, title, x + 16, y + h - 65, 15, INK, "Montserrat-Bold", w - 32, 18)
    txt(c, body, x + 16, y + h - 105, 9, MUTED, "Montserrat", w - 32, 13)


def build():
    c = canvas.Canvas(str(OUT), pagesize=A4)
    c.setTitle("Your Office Space Capability Statement")
    c.setAuthor("Your Office Space")

    # Cover
    c.setFillColor(INK)
    c.rect(0, 0, W, H, fill=1, stroke=0)
    image_cover(c, ROOT / "public/images/furniture/space-cogc-wide.jpg", 0, H * .52, W, H * .48, 0)
    c.setFillColor(HexColor("#000000"))
    c.setFillAlpha(.48)
    c.rect(0, H * .52, W, H * .48, fill=1, stroke=0)
    c.setFillAlpha(1)
    txt(c, "YOUR OFFICE SPACE", 42, H - 58, 9, white, "Montserrat-Bold")
    txt(c, "Find It,", 42, 388, 39, white, "Montserrat-Bold")
    txt(c, "Fit It Out and", 42, 341, 39, white, "Montserrat-Bold")
    txt(c, "Furnish It.", 42, 294, 39, TEAL, "Montserrat-Bold")
    txt(c, "Commercial property, client-side FitOut project management, workplace furniture and ongoing cleaning - coordinated around your business.", 42, 244, 13, white, "Montserrat", W - 84, 19)
    rounded(c, 42, 110, W - 84, 88, HexColor("#242424"), 24)
    txt(c, "ONE TEAM ON YOUR SIDE", 62, 170, 9, TEAL, "Montserrat-Bold")
    txt(c, "Clear decisions. Coordinated delivery. A workplace ready for what comes next.", 62, 154, 13, white, "Montserrat-Bold", W - 124, 17)
    txt(c, "Newcastle-based. Working across NSW and Australia where service scope and licensing permit.", 42, 84, 8, HexColor("#C9CECC"), "Montserrat")
    c.showPage()

    # Overview
    header(c, "Capability overview")
    txt(c, "A clearer way to create your next workplace.", 40, H - 96, 28, INK, "Montserrat-Bold", W - 80, 33)
    txt(c, "YOS coordinates the decisions that usually sit across separate advisers, suppliers and contractors. You keep one client-side point of contact and a clear view of what happens next.", 40, H - 165, 11, MUTED, "Montserrat", W - 80, 17)
    cw = (W - 96) / 2
    card(c, 40, 414, cw, 138, "01", "Find It", "Commercial tenant representation and buyers agency support. We help define the brief, assess opportunities and negotiate from the client's side.")
    card(c, 56 + cw, 414, cw, 138, "02", "FitOut", "Client-side project management from brief and test fit through design coordination, tendering, programme, delivery and handover.", PALE)
    card(c, 40, 248, cw, 138, "03", "Furnish It", "Commercial furniture selected for the way your team works, then quoted, delivered and installed through one coordinated programme.", PALE)
    card(c, 56 + cw, 248, cw, 138, "04", "Look After It", "Commercial cleaning for Newcastle CBD and Lake Macquarie, with the same team, monthly quality audits and Sarah overseeing quality.")
    rounded(c, 40, 86, W - 80, 124, INK, 24)
    txt(c, "THE YOS DIFFERENCE", 60, 178, 8, TEAL, "Montserrat-Bold")
    txt(c, "Independent coordination around your outcome.", 60, 148, 18, white, "Montserrat-Bold")
    txt(c, "YOS acts for the client. We bring the right specialists together, maintain the brief and keep commercial decisions visible.", 60, 120, 10, HexColor("#D7DBDA"), "Montserrat", W - 120, 15)
    footer(c, 2)
    c.showPage()

    # Find it
    header(c, "Find It")
    txt(c, "Lease or buy with someone on your side.", 40, H - 100, 29, INK, "Montserrat-Bold", W - 80, 34)
    txt(c, "Commercial agents act for property owners. YOS represents the business taking the space or making the purchase.", 40, H - 167, 11, MUTED, "Montserrat", W - 80, 17)
    card(c, 40, 450, 245, 165, "A", "Commercial tenant representation", "Brief development, market search, inspections, option comparison, commercial negotiation and coordination with the client's legal and technical advisers.")
    card(c, 310, 450, 245, 165, "B", "Commercial Buyers Agent", "Property search, opportunity assessment, commercial due diligence coordination and negotiation for owner-occupiers and commercial investors.", PALE)
    rounded(c, 40, 250, W - 80, 168, INK, 24)
    txt(c, "STRUCTURE READY. FINANCE READY.", 62, 383, 9, TEAL, "Montserrat-Bold")
    txt(c, "Prepare before the right opportunity appears.", 62, 348, 20, white, "Montserrat-Bold")
    txt(c, "YOS can connect purchasers with experienced accounting, legal, finance and property professionals so the ownership structure, lending pathway and decision team can be organised early.", 62, 310, 10, HexColor("#D7DBDA"), "Montserrat", W - 124, 15)
    txt(c, "YOS does not provide legal, tax, accounting or financial advice. Clients should obtain advice from appropriately qualified professionals before acting, including in relation to SMSF purchases.", 62, 266, 7.7, HexColor("#B7BEBC"), "Montserrat", W - 124, 11)
    txt(c, "NSW service delivery is subject to the engagement scope, property type and applicable licensing requirements.", 40, 204, 8.5, MUTED, "Montserrat", W - 80, 13)
    footer(c, 3)
    c.showPage()

    # FitOut
    header(c, "FitOut")
    txt(c, "Your brief protected from concept to handover.", 40, H - 100, 29, INK, "Montserrat-Bold", W - 80, 34)
    txt(c, "YOS is the client-side project manager. We coordinate the appointed designers, consultants, builder, suppliers and stakeholders; regulated work remains with appropriately licensed contractors.", 40, H - 168, 10.5, MUTED, "Montserrat", W - 80, 16)
    steps = [
        ("01", "Discovery & brief", "People, growth, work styles, brand, budget and timing."),
        ("02", "Concept planning", "Test fits and early layouts where the project requires them."),
        ("03", "Preliminary budget", "Order-of-cost guidance, allowances and visible contingency."),
        ("04", "Design coordination", "Documentation, services, approvals and stakeholder decisions."),
        ("05", "Tender & appointment", "Comparable scopes and coordination of the chosen contractor."),
        ("06", "Delivery & handover", "Programme oversight, furniture coordination, defects and move-in."),
    ]
    y = 520
    for i, (n, t, b) in enumerate(steps):
        x = 40 if i % 2 == 0 else 310
        if i and i % 2 == 0:
            y -= 135
        card(c, x, y, 245, 112, n, t, b, PALE if i % 3 == 1 else SOFT)
    rounded(c, 40, 94, W - 80, 114, TEAL, 24)
    txt(c, "A clear client-side line of sight", 60, 170, 17, INK, "Montserrat-Bold")
    txt(c, "You retain direct contractual relationships with the appointed professionals and contractors. YOS coordinates the moving parts, reports the trade-offs and keeps decisions aligned with the approved brief.", 60, 142, 9.5, INK, "Montserrat", W - 120, 14)
    footer(c, 4)
    c.showPage()

    # Furniture
    header(c, "Furnish It")
    image_cover(c, ROOT / "public/images/furniture/dbt-boardroom.jpg", 40, 470, W - 80, 255, 24)
    rounded(c, 58, 490, 270, 104, INK, 18)
    txt(c, "FURNITURE", 77, 568, 8, TEAL, "Montserrat-Bold")
    txt(c, "Specified for the way your team works.", 77, 540, 17, white, "Montserrat-Bold", 232, 21)
    txt(c, "Desks, seating, meeting, storage, breakout and reception.", 77, 506, 8.5, HexColor("#D7DBDA"), "Montserrat", 232, 12)
    txt(c, "A product and specification service - not a construction page.", 40, 432, 24, INK, "Montserrat-Bold", W - 80, 29)
    txt(c, "YOS develops the furniture brief, coordinates samples and finishes, prepares the quote, manages lead times and organises delivery and installation. Furniture can be supplied as part of a move or as a standalone workplace upgrade.", 40, 365, 10.5, MUTED, "Montserrat", W - 80, 16)
    labels = ["Workstations", "Task seating", "Meeting & boardroom", "Storage", "Breakout", "Reception"]
    x, y = 40, 250
    for i, label in enumerate(labels):
        rounded(c, x, y, 160, 52, PALE if i % 2 else SOFT, 16)
        txt(c, label, x + 16, y + 20, 9, INK, "Montserrat-Bold")
        x += 177
        if (i + 1) % 3 == 0:
            x, y = 40, y - 68
    txt(c, "Academy Range and EOF Group options are presented only where product availability, specification and supply terms are confirmed for the project.", 40, 90, 8, MUTED, "Montserrat", W - 80, 12)
    footer(c, 5)
    c.showPage()

    # Cleaning
    header(c, "Look After It")
    txt(c, "A clean workplace, every visit, without chasing anyone.", 40, H - 100, 27, INK, "Montserrat-Bold", W - 80, 33)
    txt(c, "Commercial cleaning across Newcastle CBD and Lake Macquarie, led by Sarah Kelley with clear standards and direct accountability.", 40, H - 167, 11, MUTED, "Montserrat", W - 80, 17)
    claims = [
        ("01", "Same team", "A consistent cleaning team learns the site and its priorities."),
        ("02", "Monthly QA", "Monthly quality audits identify issues before they become a pattern."),
        ("03", "24-hour quote", "A clear quotation is prepared within 24 hours of the site assessment."),
        ("04", "Sarah-led", "Sarah personally oversees standards, communication and quality."),
    ]
    x = 40
    for i, item in enumerate(claims):
        card(c, x, 400, 122, 174, *item, fill=PALE if i % 2 else SOFT)
        x += 131
    rounded(c, 40, 218, W - 80, 146, INK, 24)
    txt(c, "ONE COORDINATED HANDOVER", 60, 330, 8, TEAL, "Montserrat-Bold")
    txt(c, "From completed FitOut to an ongoing clean.", 60, 300, 19, white, "Montserrat-Bold")
    txt(c, "The project clean, handover standard and ongoing cleaning scope can be coordinated around the same workplace brief - reducing gaps between move-in and day-to-day operations.", 60, 264, 10, HexColor("#D7DBDA"), "Montserrat", W - 120, 15)
    txt(c, "Typical environments", 40, 174, 10, TEAL, "Montserrat-Bold")
    txt(c, "Offices  |  Medical and allied health  |  Real estate  |  Retail  |  Post-construction", 40, 148, 10, INK, "Montserrat-Bold", W - 80, 15)
    footer(c, 6)
    c.showPage()

    # Proof
    header(c, "Client proof")
    txt(c, "What clients say about working with YOS.", 40, H - 100, 28, INK, "Montserrat-Bold", W - 80, 34)
    reviews = [
        ("BETH GWALTER", "OWNER, RECOVERY STATION", "Joe was incredibly helpful through our first tenant rep experience. He made the property search and lease process much easier, explained our rights and options clearly, spotted things we would have missed, and helped with FitOut, furniture and cleaners too. Worth it."),
        ("OLIVIA CRAWFORD", "DIRECTOR, AACAFS", "Highly recommend Your Office Space. Joe was professional, reliable and fantastic to communicate with, and the service was flawless from start to finish. Joe was beyond amazing."),
        ("JASON DOWDALL", "TOTAL FITOUTS", "Joe and the team took the stress out of a stressful time and felt like a one-stop shop."),
        ("NATHAN FRANKS", "DYNAMIC BUSINESS TECHNOLOGIES", "Joe was instrumental in building out our boardroom - high-quality table, chairs and acoustic panelling that completely transformed the space. Practical advice, excellent detail."),
    ]
    y = 530
    for i, (name, role, quote) in enumerate(reviews):
        rounded(c, 40, y, W - 80, 116, PALE if i % 2 else SOFT, 20)
        txt(c, '"' + quote + '"', 60, y + 77, 9.2, INK, "Montserrat", W - 120, 13)
        txt(c, name, 60, y + 29, 8, TEAL, "Montserrat-Bold")
        txt(c, role, 60 + c.stringWidth(name, "Montserrat-Bold", 8) + 12, y + 29, 7.5, MUTED, "Montserrat-Bold")
        y -= 132
    txt(c, "Review wording is reproduced from material supplied to YOS. Publication remains subject to the final source and consent register.", 40, 85, 7.5, MUTED, "Montserrat", W - 80, 11)
    footer(c, 7)
    c.showPage()

    # CTA
    c.setFillColor(INK)
    c.rect(0, 0, W, H, fill=1, stroke=0)
    txt(c, "YOUR OFFICE SPACE", 42, H - 58, 9, TEAL, "Montserrat-Bold")
    txt(c, "Tell us what", 42, 555, 38, white, "Montserrat-Bold")
    txt(c, "you need.", 42, 510, 38, TEAL, "Montserrat-Bold")
    txt(c, "Whether you are searching for a commercial property, planning a FitOut, furnishing a workplace or improving commercial cleaning, the first step is a clear conversation.", 42, 438, 12, white, "Montserrat", W - 84, 18)
    rounded(c, 42, 270, W - 84, 92, HexColor("#242424"), 24)
    txt(c, "JOE KELLEY  |  MANAGING DIRECTOR", 62, 328, 9, TEAL, "Montserrat-Bold")
    txt(c, "jk@yourofficespace.au", 62, 299, 13, white, "Montserrat-Bold")
    txt(c, "(02) 4092 0733  |  yourofficespace.au", 62, 278, 10, HexColor("#D7DBDA"), "Montserrat")
    rounded(c, 42, 176, 132, 52, TEAL, 12)
    txt(c, "ENQUIRE", 74, 195, 11, INK, "Montserrat-Bold")
    txt(c, "Based in Newcastle. Working Australia-wide where service capability and licensing permit.", 42, 92, 8, HexColor("#B7BEBC"), "Montserrat", W - 84, 12)
    c.showPage()
    c.save()
    print(OUT)


if __name__ == "__main__":
    build()
