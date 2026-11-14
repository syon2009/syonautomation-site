"""Nov 14 2026 daily posts (4). Builds post.json in each sub-folder. Developed by Syon Automation LLC."""
import json, os
B, T, A, G, M, R = '#2fa4ff', '#36cfc9', '#ffc53d', '#4fd39a', '#8f9aa6', '#ff6b5a'
F = '<div class="foot">Syon Automation LLC</div>'
def kick(t): return f'<div class="kick">{t}</div>'
def hl(t, s=100, c='#f5f7fa'): return f'<div class="hl" style="font-size:{s}px;color:{c}">{t}</div>'
def lbl(t, s=62, c='#f5f7fa'): return f'<div class="lbl" style="font-size:{s}px;color:{c}">{t}</div>'
def sub(t, c='#b8c2cc'): return f'<div class="sub" style="color:{c}">{t}</div>'
def src(t): return f'<div class="src">{t}</div>'
def shot(f, w=960): return f'<img class="shot" style="width:{w}px" src="{{IMG}}/{f}">'
def num(n, t): return f'<div style="display:flex;gap:34px;align-items:center;text-align:left;max-width:920px"><div style="flex:none;width:130px;height:130px;border-radius:50%;border:5px solid {T};color:{T};font-weight:800;font-size:72px;display:grid;place-items:center">{n}</div><div style="font-weight:700;font-size:58px;line-height:1.15">{t}</div></div>'
def end(line, url):
    return f'<div id="wmslot" style="width:720px;height:240px"></div>{hl(line, 80)}<div class="sub" style="color:#2fa4ff;font-weight:700;margin-top:40px">{url}</div><div class="foot">Developed by Syon Automation LLC</div>'



P = {}
P['2026-11-14-wo-mailer-proof'] = [
 ("Did the supervisor get the work order? With WO Mailer, you don't have to guess.",
  kick('WO Mailer tip') + hl('Did the supervisor<br>get the work order?', 104) + F),
 ("Your HMIs already e-mail screenshots. WO Mailer receives them on the plant network, reads the work order number and time off the screen, and puts them in the subject line.",
  kick('From the panel') + shot('wm/email.webp', 960) + lbl('Work Order # and time, in the subject', 54, B) + F),
 ("The whole screen goes in the message body, so it opens on a phone or a desk PC with no attachment.",
  kick('The whole screen') + hl('In the message body.<br>No attachment.', 100, T) + F),
 ("Then open the send report. It shows when the HMI sent it, when WO Mailer sent it on, who it went to, and through which server.",
  kick('The send report') + shot('wm/report.webp', 960) + lbl('Who · When · Where · How', 58, B) + F),
 ("With Microsoft 365, it also shows when it landed in each mailbox in your organization, and whether it was read.",
  kick('Microsoft 365') + hl('Delivered.<br>Read.', 130, G) + sub('Pro, Site and Enterprise editions') + F),
 ("Every record is fingerprinted with SHA-256 in a hash-chained ledger, so the report is tamper-evident. Print it or save it as a PDF.",
  kick('Tamper-evident') + hl('SHA-256<br>hash-chained ledger', 100, A) + sub('Print it or save it as a PDF') + F),
 ("Setup takes about twenty minutes. Point each panel's mail server at the PC, port twenty-five, and add your sender rules.",
  kick('Running in about 20 minutes') + hl('Panel → PC, port 25.<br>Add sender rules.', 96) + F),
 ("One-time price from one hundred forty-nine dollars, with a free fourteen-day trial. No credit card.",
  kick('Yours to keep') + '<div class="big" style="color:#2fa4ff;font-size:220px">$149</div>' + lbl('one-time price · free 14-day trial') + F),
 ("WO Mailer from Sigh-yawn Automation, at sigh-yawn automation dot com.",
  end('The work order, in the subject line.', 'syonautomation.com/wo-mailer')),
]
SRC = 'Source: National Student Clearinghouse Research Center, May 22 2025'
SRC2 = 'Source: National Student Clearinghouse, Spring 2026 Enrollment Trends (June 4 2026)'
P['2026-11-14-trade-schools-rising'] = [
 ("More young people are choosing the trades. The enrollment numbers show it.",
  kick('The trades are back') + hl('More students are<br>choosing the trades', 100) + F),
 ("In spring 2025, enrollment at trade-focused public two-year colleges grew eleven point seven percent, the third year in a row of strong growth.",
  kick('Spring 2025') + '<div class="big" style="color:#4fd39a">+11.7%</div>' + lbl('enrollment at trade-focused public two-year colleges') + sub('Third year in a row of strong growth') + src(SRC) + F),
 ("That's about eight hundred seventy-one thousand students, almost twenty percent more than in spring 2020.",
  kick('Since 2020') + '<div class="big" style="color:#2fa4ff">871,000</div>' + lbl('students, almost 20% more than in spring 2020') + src(SRC) + F),
 ("And in spring 2026, undergraduate certificate programs grew ten point two percent, adding eighty-six thousand students.",
  kick('Spring 2026') + '<div class="big" style="color:#ffc53d">+10.2%</div>' + lbl('certificate program enrollment, +86,000 students') + src(SRC2) + F),
 ("The blue-collar pipeline is growing. The question for every plant is how fast a new hire becomes a technician you can trust on the floor.",
  kick('For your plant') + hl('New hire →<br>trusted technician.<br>How fast?', 96, T) + F),
 ("Three ways to speed it up. One: pair every new hire with an experienced tech on real equipment.",
  kick('Tip 1') + num(1, 'Pair new hires with an experienced tech, on real equipment.') + F),
 ("Two: give them a clear course path, from safety basics to troubleshooting.",
  kick('Tip 2') + num(2, 'A clear path: safety basics to troubleshooting.') + F),
 ("Three: let them practice on simulations, where a mistake costs nothing.",
  kick('Tip 3') + num(3, 'Practice on simulations, where a mistake costs nothing.') + F),
 ("TechProof gives a plant sixty-three maintenance courses, from electrical safety to running a maintenance department, with one license for the whole facility.",
  kick('TechProof') + shot('tp/catalog.webp', 900) + lbl('63 plant-floor courses · one plant license', 54, T) + F),
 ("Sigh-yawn Automation. Train the people you hire, at sigh-yawn automation dot com.",
  end('Train the people you hire.', 'syonautomation.com/techproof')),
]
SRC3 = 'Standard reliability definitions'
P['2026-11-14-mtbf-mttr-explained'] = [
 ("MTBF and MTTR. Two numbers every maintenance team hears about. Here's what they mean.",
  kick('Explainer') + hl('MTBF &amp; MTTR', 140) + sub('What they mean, in one minute') + F),
 ("MTBF is mean time between failures: total running time, divided by the number of failures.",
  kick('MTBF · Mean Time Between Failures') + hl('Running time ÷<br>number of failures', 100, B) + sub('Higher is better') + F),
 ("MTTR is mean time to repair: total repair time, divided by the number of repairs.",
  kick('MTTR · Mean Time To Repair') + hl('Repair time ÷<br>number of repairs', 100, A) + sub('Lower is better') + F),
 ("Example. A machine runs six hundred hours and fails four times. Six hundred divided by four is an MTBF of one hundred fifty hours.",
  kick('Example: MTBF') + hl('600 h ÷ 4 failures', 100) + '<div class="big" style="color:#2fa4ff;font-size:200px">150 h</div>' + F),
 ("The four repairs took six hours in total. Six divided by four is an MTTR of one and a half hours.",
  kick('Example: MTTR') + hl('6 h ÷ 4 repairs', 100) + '<div class="big" style="color:#ffc53d;font-size:200px">1.5 h</div>' + F),
 ("Put them together and you get availability: MTBF divided by MTBF plus MTTR. Here that's about ninety-nine percent.",
  kick('Availability') + hl('<span style="white-space:nowrap">MTBF ÷ (MTBF + MTTR)</span>', 76) + '<div class="big" style="color:#4fd39a;font-size:200px">≈ 99%</div>' + lbl('150 ÷ 151.5 = 0.990', 58) + src(SRC3) + F),
 ("To improve MTBF, fix root causes, and keep up with lubrication and preventive maintenance, so failures happen less often.",
  kick('Raise MTBF') + hl('Fix root causes.<br>Keep up the PMs.', 104, B) + sub('Fail less often') + F),
 ("To improve MTTR, have the parts, the drawings and the know-how ready, so each repair is faster. Repair time includes finding the fault and waiting for parts.",
  kick('Lower MTTR') + hl('Parts. Drawings.<br>Know-how.', 104, A) + sub('Repair time includes diagnosis and waiting for parts') + F),
 ("One tip: count failures the same way every time, or the numbers won't compare from month to month.",
  kick('Tip') + hl('Count failures<br>the same way, every time', 96, T) + F),
 ("TechProof course TP-407, Maintenance KPIs and Metrics, covers MTBF, MTTR, OEE and the numbers that prove performance.",
  kick('TechProof · TP-407') + hl('Maintenance KPIs<br>and Metrics', 104, T) + sub('MTBF · MTTR · OEE') + F),
 ("Sigh-yawn Automation, at sigh-yawn automation dot com.",
  end('Measure it. Then improve it.', 'syonautomation.com/techproof')),
]
P['2026-11-14-idea-panel-qr'] = [
 ("Two in the morning. A line is down, and the tech is standing at the panel. Where are the drawings?",
  kick('2 AM, line down') + hl('Where are<br>the drawings?', 124) + F),
 ("In a binder in the office. On someone's laptop. Or the copy in the panel is three revisions old.",
  kick('Where they usually are') + hl('A binder.<br>A laptop.<br>Three revisions old.', 96) + F),
 ("Every minute spent looking for the right print is a minute the line stays down.",
  kick('The cost') + hl('Every minute searching<br>is a minute down.', 96, R) + F),
 ("An idea for our next app: scan the panel, get the prints.",
  kick('Software idea') + hl('Scan the panel.<br>Get the prints.', 116, T) + F),
 ("One. A QR tag on every cabinet door.",
  kick('The idea') + num(1, 'A QR tag on every cabinet door.') + F),
 ("Two. Scan it with a phone, and the latest approved drawings, I O list and manuals open right there.",
  kick('The idea') + num(2, 'Scan it: latest drawings, I/O list and manuals open.') + F),
 ("Three. Only the current revision shows. Old ones are archived, so nobody works from an outdated print.",
  kick('The idea') + num(3, 'Only the current revision. Old ones archived.') + F),
 ("Four. Mark up a field change with a photo and a note, and engineering gets it to approve.",
  kick('The idea') + num(4, 'Field changes: photo + note, sent for approval.') + F),
 ("Five. A history for every panel: what changed, when, and who changed it.",
  kick('The idea') + num(5, 'A history for every panel: what, when, who.') + F),
 ("And it would run on your own plant network, with no monthly subscription.",
  kick('The idea') + hl('Your network.<br>No subscription.', 104, T) + F),
 ("Would your plant use it? Tell us in the comments. The best ideas become the next Sigh-yawn Automation app.",
  kick('Your turn') + hl('Would your plant<br>use it?', 116) + lbl('Tell us in the comments.', 58, T) + F),
 ("Sigh-yawn Automation, at sigh-yawn automation dot com.",
  end('Built from real plant-floor problems.', 'syonautomation.com')),
]
TYPES = {'wo-mailer-proof': 'product', 'trade-schools-rising': 'statistic', 'mtbf-mttr-explained': 'explainer', 'idea-panel-qr': 'idea'}
base = os.path.dirname(os.path.abspath(__file__))
for slug, sc in P.items():
    d = os.path.join(base, slug); os.makedirs(d, exist_ok=True)
    json.dump({"slug": slug, "type": TYPES[slug[11:]], "scenes": [{"id": f"s{i+1}", "say": s, "html": h} for i, (s, h) in enumerate(sc)]}, open(os.path.join(d, 'post.json'), 'w'), indent=1)
    print(slug, sum(len(s.split()) for s, _ in sc), 'words')
