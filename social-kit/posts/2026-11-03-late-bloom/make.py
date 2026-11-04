"""Builds post.json for "The Late-Bloom Automation Architect" (RungWise story video). Developed by Syon Automation LLC."""
import json, os
B, T, A, G, M, R = '#2fa4ff', '#36cfc9', '#ffc53d', '#4fd39a', '#8f9aa6', '#ff6b5a'
F = '<div class="foot">Syon Automation LLC</div>'
DIS = '<div class="src" style="bottom:240px;text-align:center">A dramatized story. David is a fictional character.</div>'

def svg(body, w=900, h=760):
    return f'<svg width="{w}" height="{h}" viewBox="0 0 {w} {h}" fill="none" stroke-linecap="round" stroke-linejoin="round" style="display:block;margin:10px auto 0">{body}</svg>'

def kick(t): return f'<div class="kick">{t}</div>'
def cap(t, c='#f5f7fa', s=62): return f'<div class="lbl" style="font-size:{s}px;color:{c}">{t}</div>'

# --- illustrations (simple, accurate line art) ---
relay_panel = svg(f'''
<rect x="150" y="40" width="600" height="660" rx="22" stroke="{M}" stroke-width="6"/>
<line x1="190" y1="150" x2="710" y2="150" stroke="#3a4654" stroke-width="10"/>
<line x1="190" y1="390" x2="710" y2="390" stroke="#3a4654" stroke-width="10"/>
''' + ''.join(f'<rect x="{200+i*100}" y="170" width="70" height="150" rx="10" stroke="{B}" stroke-width="5"/><circle cx="{235+i*100}" cy="205" r="12" stroke="{T}" stroke-width="4"/><line x1="{215+i*100}" y1="290" x2="{255+i*100}" y2="290" stroke="{B}" stroke-width="4"/>' for i in range(5))
+ ''.join(f'<rect x="{200+i*170}" y="420" width="120" height="120" rx="14" stroke="{A}" stroke-width="5"/><circle cx="{260+i*170}" cy="480" r="30" stroke="{A}" stroke-width="5"/>' for i in range(3))
+ f'''<path d="M200 600 C 300 640, 400 560, 500 620 S 650 600, 700 640" stroke="{T}" stroke-width="5"/>
<path d="M200 650 C 320 690, 420 610, 520 670 S 650 650, 700 690" stroke="{B}" stroke-width="5"/>''')

locked = svg(f'''
<rect x="120" y="110" width="660" height="460" rx="24" stroke="{M}" stroke-width="6"/>
<rect x="160" y="150" width="580" height="380" rx="12" fill="#0b1520" stroke="#2a3644" stroke-width="4"/>
''' + ''.join(f'<text x="190" y="{205+i*48}" font-family="monospace" font-size="30" fill="#3d5266">{t}</text>' for i, t in enumerate(['XIC Line_Run   OTE Conv_M1', 'TON T4:0  PRE 5000  ACC 0', 'MOV N7:12  F8:3  SCP 0 4095', 'JSR Seq_Main  RES C5:1', 'XIO Fault_Latch  OTU Ready', 'EQU State 30  ONS B3:2/4', 'MOV 0  N7:40  CPT F8:9']))
+ f'''<rect x="330" y="300" width="240" height="190" rx="26" fill="#04070b" stroke="{R}" stroke-width="10"/>
<path d="M380 300 V245 a70 70 0 0 1 140 0 V300" stroke="{R}" stroke-width="10"/>
<circle cx="450" cy="385" r="22" fill="{R}"/><rect x="442" y="395" width="16" height="50" rx="6" fill="{R}"/>
<text x="450" y="660" text-anchor="middle" font-family="M,sans-serif" font-weight="800" font-size="46" fill="{R}">LINE DOWN · SOFTWARE FAULT</text>''')

invoice = svg(f'''
<rect x="60" y="250" width="440" height="290" rx="18" stroke="{B}" stroke-width="6"/>
<rect x="90" y="280" width="380" height="220" rx="8" fill="#0b1520"/>
<path d="M20 560 H540 L500 600 H60 Z" stroke="{B}" stroke-width="6"/>
<line x1="270" y1="560" x2="270" y2="700" stroke="{M}" stroke-width="5" stroke-dasharray="14 12"/>
<text x="280" y="400" text-anchor="middle" font-family="M,sans-serif" font-weight="700" font-size="34" fill="{T}">ONLINE</text>
<rect x="560" y="90" width="300" height="420" rx="14" stroke="{A}" stroke-width="6" fill="#0d1116"/>
<text x="710" y="160" text-anchor="middle" font-family="M,sans-serif" font-weight="800" font-size="40" fill="{A}">INVOICE</text>
<line x1="600" y1="200" x2="820" y2="200" stroke="{M}" stroke-width="4"/>
<text x="600" y="260" font-family="M,sans-serif" font-size="30" fill="#b8c2cc">Call-out</text>
<text x="600" y="310" font-family="M,sans-serif" font-size="30" fill="#b8c2cc">1 hr on site</text>
<line x1="600" y1="360" x2="820" y2="360" stroke="{M}" stroke-width="4"/>
<text x="600" y="440" font-family="M,sans-serif" font-weight="800" font-size="54" fill="{A}">$$$$</text>''')

waiting = svg(f'''
<circle cx="450" cy="330" r="230" stroke="{M}" stroke-width="10"/>
<line x1="450" y1="330" x2="450" y2="170" stroke="{A}" stroke-width="14"/>
<line x1="450" y1="330" x2="570" y2="400" stroke="{A}" stroke-width="14"/>
<circle cx="450" cy="330" r="16" fill="{A}"/>
''' + ''.join(f'<line x1="{450+200*__import__("math").cos(i*0.5236):.1f}" y1="{330+200*__import__("math").sin(i*0.5236):.1f}" x2="{450+222*__import__("math").cos(i*0.5236):.1f}" y2="{330+222*__import__("math").sin(i*0.5236):.1f}" stroke="{M}" stroke-width="8"/>' for i in range(12))
+ f'<text x="450" y="680" text-anchor="middle" font-family="M,sans-serif" font-weight="800" font-size="56" fill="{R}">Still waiting on the contractor</text>')

ladder_cyl = svg(f'''
<line x1="60" y1="60" x2="60" y2="300" stroke="{G}" stroke-width="10"/>
<line x1="840" y1="60" x2="840" y2="300" stroke="{M}" stroke-width="10"/>
<line x1="60" y1="180" x2="300" y2="180" stroke="{G}" stroke-width="8"/>
<line x1="300" y1="130" x2="300" y2="230" stroke="{G}" stroke-width="8"/><line x1="350" y1="130" x2="350" y2="230" stroke="{G}" stroke-width="8"/>
<line x1="350" y1="180" x2="560" y2="180" stroke="{G}" stroke-width="8"/>
<path d="M590 125 Q560 180 590 235" stroke="{G}" stroke-width="8"/><path d="M650 125 Q680 180 650 235" stroke="{G}" stroke-width="8"/>
<line x1="680" y1="180" x2="840" y2="180" stroke="{M}" stroke-width="8"/>
<text x="325" y="105" text-anchor="middle" font-family="monospace" font-size="30" fill="#e6edf3">Part_Present</text>
<text x="620" y="105" text-anchor="middle" font-family="monospace" font-size="30" fill="#e6edf3">Push_Cyl</text>
<text x="325" y="275" text-anchor="middle" font-family="monospace" font-size="24" fill="{M}">XIC</text>
<text x="620" y="275" text-anchor="middle" font-family="monospace" font-size="24" fill="{M}">OTE</text>
<path d="M620 300 V390" stroke="{T}" stroke-width="6" stroke-dasharray="12 10"/><path d="M600 372 L620 400 L640 372" stroke="{T}" stroke-width="6"/>
<rect x="430" y="420" width="300" height="110" rx="14" stroke="{B}" stroke-width="7"/>
<rect x="455" y="445" width="80" height="60" rx="6" fill="{B}"/>
<line x1="535" y1="475" x2="840" y2="475" stroke="{B}" stroke-width="14"/>
<rect x="820" y="440" width="30" height="70" rx="6" fill="{B}"/>
<rect x="60" y="600" width="780" height="40" rx="20" stroke="{M}" stroke-width="6"/>
''' + ''.join(f'<circle cx="{100+i*140}" cy="620" r="12" fill="{M}"/>' for i in range(6))
+ f'<rect x="300" y="540" width="120" height="60" rx="8" stroke="{A}" stroke-width="6"/>')


def photo(img, top, bottom, credit, pos='center'):
    """Full-bleed real photo with dark fades top and bottom so the text stays readable."""
    return (f'<div style="position:absolute;inset:0;background:url(photos/{img}) {pos}/cover"></div>'
            '<div style="position:absolute;inset:0;background:linear-gradient(#04070bee 0%,#04070b55 26%,#04070b00 45%,#04070b00 58%,#04070bcc 76%,#04070bf5 100%)"></div>'
            f'<div style="position:absolute;top:150px;left:70px;right:70px;text-align:center">{top}</div>'
            f'<div style="position:absolute;bottom:250px;left:70px;right:70px;text-align:center">{bottom}</div>'
            f'<div style="position:absolute;bottom:190px;left:0;right:0;text-align:center;font-size:24px;color:#9aa6b2">{credit}</div>')
def framed(img, credit, w=960):
    return (f'<img src="photos/{img}" style="width:{w}px;border-radius:22px;border:2px solid #1f2a36;box-shadow:0 20px 80px rgba(47,164,255,.25);display:block">'
            f'<div style="font-size:24px;color:#9aa6b2;margin-top:18px">{credit}</div>')
PX = ' / Pexels'

def shot(f, w=960): return f'<img class="shot" style="width:{w}px" src="{{IMG}}/rw/{f}">'

card = svg(f'''
<rect x="90" y="140" width="720" height="420" rx="26" fill="#0b1118" stroke="{B}" stroke-width="5"/>
<rect x="130" y="190" width="70" height="70" rx="14" stroke="{T}" stroke-width="6"/>
<path d="M145 225 H185 M165 205 V245" stroke="{T}" stroke-width="6"/>
<text x="225" y="245" font-family="M,sans-serif" font-weight="800" font-size="52" fill="#f5f7fa">Nexus Applied Logic</text>
<line x1="130" y1="300" x2="770" y2="300" stroke="#22303f" stroke-width="4"/>
<text x="130" y="370" font-family="M,sans-serif" font-weight="700" font-size="40" fill="#f5f7fa">David Miller</text>
<text x="130" y="420" font-family="M,sans-serif" font-size="32" fill="{T}">PLC Programming · Controls Consulting</text>
<text x="130" y="500" font-family="M,sans-serif" font-size="28" fill="{M}">Independent · Georgia</text>''')

line_online = svg(f'''
<rect x="40" y="420" width="820" height="50" rx="25" stroke="{M}" stroke-width="6"/>
''' + ''.join(f'<circle cx="{80+i*105}" cy="445" r="13" fill="{M}"/>' for i in range(8))
+ ''.join(f'<rect x="{120+i*230}" y="350" width="110" height="70" rx="8" stroke="{A}" stroke-width="6"/>' for i in range(3))
+ f'''<rect x="80" y="520" width="200" height="180" rx="12" stroke="{B}" stroke-width="6"/><circle cx="180" cy="590" r="40" stroke="{B}" stroke-width="6"/>
<text x="180" y="680" text-anchor="middle" font-family="monospace" font-size="24" fill="{M}">PLC</text>
<path d="M280 610 H420" stroke="{T}" stroke-width="5" stroke-dasharray="12 10"/>
<rect x="430" y="540" width="300" height="160" rx="14" stroke="{T}" stroke-width="6"/>
<text x="580" y="600" text-anchor="middle" font-family="M,sans-serif" font-weight="700" font-size="30" fill="{T}">ONLINE EDIT</text>
<text x="580" y="660" text-anchor="middle" font-family="M,sans-serif" font-weight="800" font-size="36" fill="#f5f7fa">14.2 s → 11.8 s</text>
<text x="450" y="120" text-anchor="middle" font-family="M,sans-serif" font-weight="800" font-size="50" fill="#f5f7fa">Cycle time</text>
<text x="450" y="190" text-anchor="middle" font-family="M,sans-serif" font-size="34" fill="{M}">example</text>
<path d="M150 260 H750" stroke="#22303f" stroke-width="4"/>''')

clients = svg(f'''
<circle cx="450" cy="380" r="70" fill="#0b1118" stroke="{T}" stroke-width="7"/>
<text x="450" y="395" text-anchor="middle" font-family="M,sans-serif" font-weight="800" font-size="40" fill="{T}">D</text>
''' + ''.join(f'<line x1="450" y1="380" x2="{x}" y2="{y}" stroke="{B}" stroke-width="4" stroke-dasharray="10 10"/><rect x="{x-55}" y="{y-45}" width="110" height="90" rx="10" fill="#04070b" stroke="{B}" stroke-width="5"/><path d="M{x-35} {y+25} V{y-10} L{x-10} {y+5} V{y-10} L{x+15} {y+5} V{y-25} H{x+35} V{y+25} Z" stroke="{A}" stroke-width="4"/>' for x, y in [(150, 140), (450, 100), (750, 140), (130, 420), (770, 420), (220, 660), (680, 660)])
+ f'<text x="450" y="560" text-anchor="middle" font-family="M,sans-serif" font-weight="700" font-size="34" fill="{M}">word of mouth</text>')

plane = svg(f'''
<rect x="200" y="30" width="500" height="430" rx="200" fill="#0a1a2c" stroke="{M}" stroke-width="14"/>
<rect x="232" y="62" width="436" height="366" rx="180" fill="#103152"/>
<rect x="232" y="300" width="436" height="128" fill="#0b2a49"/>
<circle cx="560" cy="170" r="34" fill="{A}" opacity=".9"/>
<path d="M260 300 H640" stroke="#3f7fb8" stroke-width="4"/>
<path d="M300 240 q30 -18 60 0 M400 220 q30 -18 60 0" stroke="#7fb3e0" stroke-width="4"/>
<rect x="250" y="520" width="400" height="22" rx="8" fill="#26303b"/>
<rect x="300" y="380" width="300" height="140" rx="10" stroke="{B}" stroke-width="5" fill="#0b1520"/>
<line x1="320" y1="400" x2="320" y2="500" stroke="{G}" stroke-width="5"/><line x1="320" y1="440" x2="420" y2="440" stroke="{G}" stroke-width="4"/>
<line x1="420" y1="420" x2="420" y2="460" stroke="{G}" stroke-width="4"/><line x1="440" y1="420" x2="440" y2="460" stroke="{G}" stroke-width="4"/>
<line x1="440" y1="440" x2="520" y2="440" stroke="{G}" stroke-width="4"/><circle cx="545" cy="440" r="18" stroke="{G}" stroke-width="4"/>
<path d="M300 520 H600 L630 545 H270 Z" fill="#1a232d" stroke="{B}" stroke-width="4"/>
<rect x="680" y="470" width="60" height="70" rx="10" stroke="{A}" stroke-width="5"/><path d="M740 490 h18 a14 14 0 0 1 0 28 h-18" stroke="{A}" stroke-width="5"/>
<path d="M120 690 Q450 600 780 690" stroke="{T}" stroke-width="5" stroke-dasharray="14 12"/>
<text x="120" y="740" font-family="M,sans-serif" font-weight="700" font-size="30" fill="{M}">Georgia</text>
<text x="780" y="740" text-anchor="end" font-family="M,sans-serif" font-weight="700" font-size="30" fill="{T}">Guam</text>''')

beach = svg(f'''
<rect x="40" y="40" width="820" height="680" rx="30" fill="#0b2238"/>
<circle cx="640" cy="250" r="90" fill="{A}" opacity=".85"/>
<rect x="40" y="330" width="820" height="150" fill="#14507e"/>
<path d="M40 360 H860 M40 410 H860" stroke="#2c6fa3" stroke-width="4"/>
<path d="M40 480 Q450 440 860 480 V690 a30 30 0 0 1 -30 30 H70 a30 30 0 0 1 -30 -30 Z" fill="#e8dcc0"/>
<path d="M150 700 Q170 470 280 210" stroke="#7a5a3a" stroke-width="18"/>
<path d="M280 210 q-90 -20 -150 40 M280 210 q-40 -80 -130 -80 M280 210 q40 -90 140 -70 M280 210 q90 0 130 70 M280 210 q10 -100 -30 -150" stroke="{G}" stroke-width="12"/>
<path d="M360 690 Q380 530 450 380" stroke="#7a5a3a" stroke-width="14"/>
<path d="M450 380 q-70 -10 -110 40 M450 380 q-30 -60 -100 -60 M450 380 q30 -70 110 -50 M450 380 q70 0 100 55" stroke="{G}" stroke-width="10"/>
<rect x="560" y="560" width="230" height="16" rx="6" fill="#6b4b2e"/>
<rect x="585" y="470" width="180" height="90" rx="8" fill="#0b1520" stroke="{B}" stroke-width="5"/>
<path d="M600 500 H750 M600 525 H700" stroke="{G}" stroke-width="5"/>
<path d="M580 560 H770 L790 575 H560 Z" fill="#1a232d"/>''')

scenes = [
 ("s1", "For thirty years, David was the guy who fixed things when they broke. A senior maintenance tech in Georgia, he knew every relay, valve, and air line in the plant.",
  photo('rw-story-panel.jpg', kick('The Late-Bloom Automation Architect'), cap('30 years of relays, valves and air lines', s=58) + '<div style="font-size:26px;color:#c3cbd3;margin-top:22px">A dramatized story. David is a fictional character.</div>', 'Photo: Bulat843'+PX)),
 ("s2", "But the machines were moving behind digital walls. When a line went down on a software fault, David had to wait for an outside contractor with a laptop.",
  kick('The digital wall') + locked + cap('A software fault meant waiting', s=58) + F),
 ("s3", "They'd plug in, click a few buttons, bill thousands for an hour, and leave.",
  kick('Plug in. Click. Invoice.') + invoice + cap('Thousands of dollars for an hour', A) + F),
 ("s4", "Thirty years of hands-on know-how, and he still had to wait. David wanted control of his own career.",
  kick('Trapped') + waiting + cap('He wanted control of his own career', s=58) + F),
 ("s5", "At fifty-nine, he decided he wasn't done growing. He found PLC training built for technicians like him.",
  kick('The turning point') + '<div class="big" style="color:#36cfc9">59</div>' + cap("and not done growing", s=70) + '<div class="sub">PLC training built for technicians</div>' + F),
 ("s6", "No computer science theory. Every rung of ladder logic was tied to a real device, so a bit in the program meant a cylinder moving on a real conveyor.",
  kick('Ladder logic, tied to real devices') + ladder_cyl + cap('One bit. One cylinder. One conveyor.', s=56) + F),
 ("s7", "In the evenings he worked through it: controller organization, mapping inputs and outputs, Studio five thousand, and Siemens T I A Portal.",
  photo('rw-story-study.jpg', kick('Evenings, one module at a time'), shot('sealin.webp', 900) + '<div class="sub" style="color:#f5f7fa;font-weight:700;margin-top:30px">Controller organization · I/O mapping<br>Studio 5000 · Siemens TIA Portal</div>', 'Photo: Czapp Árpád'+PX)),
 ("s8", "The wall of code turned into a map he could read. His thirty years of troubleshooting finally had a keyboard.",
  kick('From wall of code to a map') + shot('pid.webp') + cap('30 years of troubleshooting, now with a keyboard', s=54) + F),
 ("s9", "Then he went out on his own, and opened his own consulting firm.",
  kick('A new class of freedom') + card + cap('His own consulting firm', s=64) + F),
 ("s10", "Plants noticed. He could walk up to a struggling line, find the mechanical bottleneck, then go online with the PLC and tighten the cycle time and the safety logic.",
  kick('Both worlds: the machine and the code') + line_online + cap('Find the bottleneck. Fix it online.', s=60) + F),
 ("s11", "Word of mouth did the rest: logic for high-speed packaging lines, secure remote monitoring, and plants that keep running.",
  kick('Client by client') + clients + cap('Packaging lines · remote monitoring', s=56) + F),
 ("s12", "With secure remote access, his office goes where he goes. Some days it's a seat over the Pacific, reviewing a ladder routine on the way to a client in Guam.",
  photo('rw-story-plane.jpg', kick('The office, at 35,000 feet'), cap('Reviewing ladder logic on the way to Guam', s=56), 'Photo: Rahul Pandit'+PX)),
 ("s13", "Other days it's a beach in Boracay, palm trees past the screen, while his code keeps a plant running half a world away.",
  kick('Or a beach in Boracay') + framed('bora_palms.jpg', 'White Beach, Boracay. Photo: Tuderna, CC BY 3.0, via Wikimedia Commons') + cap('His code keeps a plant running, half a world away', s=52) + F),
 ("s14", "At sixty, David didn't just change jobs. He re-engineered his life.",
  photo('rw-story-beach.jpg', '', '<div class="big" style="color:#2fa4ff">60</div><div class="hl" style="font-size:96px;margin-top:30px">He re-engineered his life.</div>', 'Photo: Kraken Media'+PX, 'center 30%')),
 ("s15", "You don't need a computer science degree, and you're never too late to start. You need the right system.",
  photo('bora_sunset.jpg', kick('Re-engineer your own future'), '<div class="hl" style="font-size:92px">No degree needed.<br><span style="color:#36cfc9">Never too late.</span></div><div class="sub" style="font-size:50px;color:#f5f7fa;font-weight:700">You need the right system.</div>', 'Paraw sailboats, Boracay. Photo: Sam Villaroman, CC BY 2.0, via Wikimedia Commons')),
 ("s16", "RungWise PLC Academy, from Sigh-yawn Automation. Start your free fourteen-day trial at sigh-yawn automation dot com.",
  '<div id="wmslot" style="width:720px;height:240px"></div><div class="hl" style="font-size:84px;margin-top:60px">RungWise PLC Academy</div><div class="sub" style="color:#2fa4ff;font-weight:700">Free 14-day trial · syonautomation.com</div><div class="src" style="bottom:240px;text-align:center">Dramatized story. Individual results vary.</div><div class="foot">Developed by Syon Automation LLC</div>'),
]
post = {"slug": "2026-11-03-late-bloom-automation", "scenes": [{"id": i, "say": s, "html": h} for i, s, h in scenes]}
json.dump(post, open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'post.json'), 'w'), indent=1)
print(sum(len(s.split()) for _, s, _ in scenes), 'words')
