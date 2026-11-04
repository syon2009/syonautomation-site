"""Nov 6 2026 daily posts (4). Builds post.json in each sub-folder. Developed by Syon Automation LLC."""
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
SRC1 = 'Source: Deloitte and The Manufacturing Institute (April 2024)'
SRC1b = 'Source: The Manufacturing Institute, citing the NAM Q1 2024 Manufacturers’ Outlook Survey'
P['2026-11-06-skills-gap'] = [
 ("Manufacturers could need as many as 3.8 million new employees between 2024 and 2033.",
  kick('The skills gap') + '<div class="big" style="color:#2fa4ff">3.8M</div>' + lbl('new manufacturing employees could be needed, 2024 to 2033') + src(SRC1) + F),
 ("And if the skills and applicant gaps aren't closed, 1.9 million of those jobs could go unfilled.",
  kick('The gap') + '<div class="big" style="color:#ffc53d">1.9M</div>' + lbl('jobs could remain unfilled') + src(SRC1) + F),
 ("That's from a 2024 study by Deloitte and the Manufacturing Institute.",
  kick('Who said it') + hl('Deloitte +<br>The Manufacturing Institute', 92) + sub('Study released April 2024') + F),
 ("In the National Association of Manufacturers' first-quarter 2024 survey, 65 percent named attracting and retaining talent as their primary business challenge.",
  kick('The top problem') + '<div class="big" style="color:#ff6b5a">65%</div>' + lbl('named attracting and retaining talent their primary business challenge') + src(SRC1b) + F),
 ("On the plant floor, that means fewer experienced technicians, longer work-order lists, and newer people covering equipment they've never worked on.",
  kick('On the plant floor') + hl('Fewer experienced techs.<br>Longer work-order lists.', 86) + lbl('Newer people on unfamiliar equipment.', 56, '#ffc53d') + F),
 ("The jobs are there. The open question is who will keep the machines running, and how fast they can get good at it.",
  kick('The real question') + hl('Who keeps the<br>machines running?', 110) + F),
 ("Here's the useful part. Deloitte's research found employees who feel they can gain important future skills are 2.7 times less likely to leave within twelve months.",
  kick('The useful part') + '<div class="big" style="color:#4fd39a">2.7×</div>' + lbl('less likely to leave within 12 months when they feel they can gain important future skills') + src(SRC1) + F),
 ("So training isn't only a cost. It's how you keep the people you worked so hard to hire.",
  kick('Training is retention') + hl('Train them.<br>Keep them.', 120, '#36cfc9') + F),
 ("Three moves that help. One: put new hires on real equipment early, with an experienced mentor beside them.",
  kick('Move 1') + num(1, 'Real equipment early, with a mentor beside them.') + F),
 ("Two: give every technician a clear path, from safety basics to troubleshooting to process control.",
  kick('Move 2') + num(2, 'A clear path: safety, troubleshooting, process control.') + F),
 ("Three: track progress, so people can see they're growing, and so can their supervisor.",
  kick('Move 3') + num(3, 'Track progress, so everyone can see the growth.') + F),
 ("Start small. One technician, one module a week, adds up to a much stronger crew by this time next year.",
  kick('Start small') + hl('One tech.<br>One module a week.', 108, '#36cfc9') + sub('It adds up by this time next year.') + F),
 ("RungWise PLC Academy teaches ladder logic from the first contact to live PID, with live simulations, auto-graded labs and a quiz at the end of every module.",
  kick('Ladder logic, hands-on') + shot('rw/sealin.webp', 900) + lbl('RungWise PLC Academy', 60, '#2fa4ff') + sub('Live simulations · graded labs · a quiz every module') + F),
 ("TechProof gives a plant forty-eight courses, from electrical safety to PID control and running a maintenance department, with one license for the whole facility.",
  kick('A full technician program') + shot('tp/catalog.webp', 900) + lbl('TechProof: 48 plant-floor courses', 58, '#36cfc9') + sub('One license covers the whole facility') + F),
 ("Sigh-yawn Automation. Grow the team you have, at sigh-yawn automation dot com.",
  end('Grow the team you have.', 'syonautomation.com')),
]
P['2026-11-06-controldraft-tip'] = [
 ("Planning a new control panel? Here's how ControlDraft goes from a few words to a panel you can build.",
  kick('ControlDraft tip') + hl('From a few words<br>to a panel you can build', 96) + F),
 ("Start by describing the process in plain words, or import a spreadsheet you already have.",
  kick('Step 1') + hl('Describe it.<br>Or import it.', 110) + sub('Plain words or a spreadsheet') + F),
 ("ControlDraft drafts the I O list, picks the hardware for your platform, and assigns every rack, slot, channel and PLC address.",
  kick('The I/O list') + shot('cd/io.webp') + lbl('Every rack, slot, channel and address', 54, '#2fa4ff') + F),
 ("Platforms include CompactLogix and ControlLogix, Siemens S7-1200 and 1500, AutomationDirect CLICK, BRX and Productivity, and DCS in PlantPAx and DeltaV style.",
  kick('Your platform') + hl('CompactLogix · ControlLogix<br>S7-1200 / 1500<br>CLICK · BRX · Productivity', 74) + sub('plus DCS, PlantPAx and DeltaV style') + F),
 ("The enclosure, back panel, DIN rails and wire duct are sized from the real parts, then laid out to scale with a build grid and dimensions for the shop.",
  kick('Laid out to scale') + shot('cd/panel.webp') + lbl('Sized from the real parts', 56, '#36cfc9') + F),
 ("It checks heat load, duct fill, and UL 508A short-circuit current ratings, and fits the HMI against the door cutout and depth.",
  kick('Checked as you go') + hl('Heat load · Duct fill<br>UL 508A SCCR', 92, '#ffc53d') + sub('HMI checked against the door cutout and depth') + F),
 ("Every wire is numbered at both ends, every terminal is shown, and the wire list gives the from and to of every wire.",
  kick('Wiring, numbered end to end') + shot('cd/wiring.webp') + lbl('Both ends of every wire', 56, '#2fa4ff') + F),
 ("The drawing set includes power distribution, an I O wiring sheet per module, the panel build layout and the Ethernet routing sheet.",
  kick('The drawing set') + shot('cd/drawings.webp') + F),
 ("Open Items flags what still needs a decision, like a silo with no high-level switch, before you finalize the design.",
  kick('Nothing slips through') + shot('cd/items.webp') + lbl('Open Items, before you finalize', 56, '#ff6b5a') + F),
 ("Already have the panel? Scan the PLC printout. The free built-in OCR reads the addresses, comments and rungs, with no internet needed.",
  kick('Existing panels') + hl('Scan the printout', 110, '#36cfc9') + sub('Free built-in OCR. No internet needed.') + F),
 ("Then search your approved vendors, compare prices and stock, and get a priced bill of material, labor hours and the quote.",
  kick('Priced and quoted') + hl('BOM · Labor · Quote', 104, '#2fa4ff') + sub('From your own approved vendors') + F),
 ("It's a planning tool. A qualified person still checks every design against the codes that apply, like NEC, NFPA 79 and UL 508A.",
  kick('Good practice') + hl('Plan faster.<br>Still check it.', 108) + sub('NEC · NFPA 79 · UL 508A · local rules') + F),
 ("One-time price from four hundred ninety-five dollars, with a free fourteen-day trial.",
  kick('Yours to keep') + '<div class="big" style="color:#2fa4ff;font-size:220px">$495</div>' + lbl('one-time price · free 14-day trial') + F),
 ("ControlDraft from Sigh-yawn Automation, at sigh-yawn automation dot com.",
  end('Plan the whole system first.', 'syonautomation.com/controldraft')),
]
bar = lambda label, pct, col: f'<div style="display:flex;align-items:center;gap:24px;width:900px;margin:16px auto"><div style="width:300px;text-align:right;font-weight:700;font-size:44px">{label}</div><div style="flex:1;height:54px;border-radius:12px;background:#0d1a26;border:2px solid #22303f;overflow:hidden"><div style="width:{pct}%;height:100%;background:{col}"></div></div><div style="width:150px;font-weight:800;font-size:48px;color:{col}">{pct}%</div></div>'
SRC3 = 'OEE = Availability × Performance × Quality (standard definition)'
P['2026-11-06-what-is-oee'] = [
 ("What is OEE, and why do so many plants track it?",
  kick('Explainer') + hl('What is OEE?', 140) + F),
 ("OEE stands for Overall Equipment Effectiveness. It shows how much of your planned production time is truly productive.",
  kick('Overall Equipment Effectiveness') + hl('How much planned time<br>is truly productive', 96, '#36cfc9') + F),
 ("It multiplies three numbers: availability, times performance, times quality.",
  kick('The formula') + hl('OEE = A × P × Q', 120, '#2fa4ff') + sub('Availability × Performance × Quality') + src(SRC3) + F),
 ("Availability is run time divided by planned production time. Breakdowns, changeovers and waiting pull it down.",
  kick('Availability') + hl('Run time ÷<br>planned time', 104) + sub('Breakdowns, changeovers and waiting pull it down') + F),
 ("Performance compares how fast you actually ran to the ideal speed. Slow cycles and small stops pull it down.",
  kick('Performance') + hl('Actual speed ÷<br>ideal speed', 104) + sub('Slow cycles and small stops pull it down') + F),
 ("Quality is good parts divided by total parts. Scrap and rework pull it down.",
  kick('Quality') + hl('Good parts ÷<br>total parts', 104) + sub('Scrap and rework pull it down') + F),
 ("Each of the three hides a different kind of loss, so OEE tells you not only how much you're losing, but where.",
  kick('Why three numbers') + hl('Not just how much.<br>Where.', 112, '#36cfc9') + F),
 ("Example. A line is available ninety percent of the time, runs at ninety-five percent of ideal speed, and ninety-eight percent of its parts are good.",
  kick('Example') + bar('Availability', 90, B) + bar('Performance', 95, T) + bar('Quality', 98, G) + F),
 ("Ninety percent, times ninety-five percent, times ninety-eight percent, is about eighty-three point eight percent OEE.",
  kick('Multiply them') + hl('0.90 × 0.95 × 0.98', 96) + '<div class="big" style="color:#ffc53d;font-size:200px">83.8%</div>' + lbl('OEE', 70) + F),
 ("Three numbers that each look fine still add up to losing about one sixth of your planned time.",
  kick('The surprise') + hl('Each looks fine.<br>Together: about 1/6 lost.', 92, '#ff6b5a') + F),
 ("The real value is in the why. Tag every stop with a reason, and a Pareto chart shows which few causes cost you the most.",
  kick('Find the why') + hl('Tag every stop.<br>Pareto the reasons.', 100, '#36cfc9') + sub('A few causes usually cost the most') + F),
 ("Measure it the same way every shift, straight from the PLC, not from memory, or the numbers won't be comparable.",
  kick('Measure it right') + hl('From the PLC,<br>not from memory', 104) + sub('Same method every shift, or the numbers won\'t compare') + F),
 ("And start with one line. Get the stop reasons right there first, then roll it out.",
  kick('Where to start') + hl('One line first', 120, '#ffc53d') + sub('Get the stop reasons right, then roll it out.') + F),
 ("PlantProof tracks OEE per line, with a downtime Pareto and stop reasons, straight from your PLC data.",
  kick('PlantProof') + shot('pp/runtime.webp', 900) + lbl('OEE per line · downtime Pareto · stop reasons', 50, '#2fa4ff') + F),
 ("It also brings SCADA screens, a historian, alarms and maintenance into one install, from nine hundred ninety-five dollars one-time, with a free thirty-day evaluation.",
  kick('One install') + hl('SCADA · Historian<br>Alarms · Maintenance', 96) + lbl('From $995 one-time · free 30-day evaluation', 50, '#36cfc9') + F),
 ("PlantProof from Sigh-yawn Automation, at sigh-yawn automation dot com.",
  end('Run it. Prove it.', 'syonautomation.com/plantproof')),
]
P['2026-11-06-idea-shift-handover'] = [
 ("Shift change. The night crew knows the filler has been tripping all night. Does the day crew?",
  kick('Shift change') + hl('Night shift knows.<br>Does day shift?', 110) + F),
 ("Too often the warning lives on a whiteboard, a sticky note, or in one person's head, and it doesn't make it across the change.",
  kick('Where the warning lives') + hl('A whiteboard.<br>A sticky note.<br>One person\'s head.', 90) + F),
 ("Then the same problem gets rediscovered, the same parts get pulled, and the same hour gets lost again.",
  kick('The cost') + hl('Same problem.<br>Same hour lost.<br>Again.', 100, '#ff6b5a') + F),
 ("A good handover takes two minutes. A missed one can cost the whole next shift.",
  kick('Two minutes') + hl('A good handover:<br>two minutes.', 104, '#4fd39a') + lbl('A missed one: the next shift.', 60, '#ff6b5a') + F),
 ("An idea for our next app: a shift handover log.",
  kick('Software idea') + hl('A shift<br>handover log', 128, '#36cfc9') + F),
 ("One. Each shift logs open issues by machine, in about a minute, from a phone or the line PC.",
  kick('The idea') + num(1, 'Log open issues by machine, from a phone or the line PC.') + F),
 ("Two. Anything not closed carries over to the next shift automatically, so nothing falls through the gap.",
  kick('The idea') + num(2, 'Open items carry over automatically.') + F),
 ("Three. The incoming lead reads it and signs off, so you know the message landed.",
  kick('The idea') + num(3, 'The incoming lead signs off: message received.') + F),
 ("Four. Attach photos and the active alarm list, so the next crew sees what you saw.",
  kick('The idea') + num(4, 'Photos and the active alarm list attached.') + F),
 ("Five. Safety items go at the top, in red, every time.",
  kick('The idea') + num(5, 'Safety items on top, in red, every time.') + F),
 ("Six. A searchable history, so repeat problems on the same machine stand out.",
  kick('The idea') + num(6, 'Searchable history: repeat problems stand out.') + F),
 ("Seven. A handover summary that prints or e-mails itself at the end of every shift, for the supervisor and maintenance.",
  kick('The idea') + num(7, 'A shift summary that prints or e-mails itself.') + F),
 ("Operators, maintenance technicians and shift leads would all use the same log, on every shift, at every line.",
  kick('Who uses it') + hl('Operators · Maintenance<br>Shift leads', 96) + sub('One log, every shift, every line') + F),
 ("And it would run on your own plant network, with no monthly subscription.",
  kick('The idea') + hl('Your network.<br>No subscription.', 104, '#36cfc9') + F),
 ("Would your plant use it? Tell us in the comments. The best ideas become the next Sigh-yawn Automation app.",
  kick('Your turn') + hl('Would your plant<br>use it?', 116) + lbl('Tell us in the comments.', 58, '#36cfc9') + F),
 ("Sigh-yawn Automation, at sigh-yawn automation dot com.",
  end('Built from real plant-floor problems.', 'syonautomation.com')),
]
base = os.path.dirname(os.path.abspath(__file__))
for slug, sc in P.items():
    d = os.path.join(base, slug); os.makedirs(d, exist_ok=True)
    json.dump({"slug": slug, "scenes": [{"id": f"s{i+1}", "say": s, "html": h} for i, (s, h) in enumerate(sc)]}, open(os.path.join(d, 'post.json'), 'w'), indent=1)
    print(slug, sum(len(s.split()) for s, _ in sc), 'words')
