"""Nov 5 2026 daily posts (4). Builds post.json in each sub-folder. Developed by Syon Automation LLC."""
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
SRC1 = 'Source: Panopto with YouGov, Workplace Knowledge and Productivity Report (2018), 1,001 U.S. workers'
P['2026-11-05-tribal-knowledge'] = [
 ("Forty-two percent of what people know at work is known only by them.",
  kick('Tribal knowledge') + '<div class="big" style="color:#ffc53d">42%</div>' + lbl('of workplace knowledge is unique to the individual') + src(SRC1) + F),
 ("That's from a 2018 survey of one thousand and one U.S. workers by Panopto and YouGov.",
  kick('Who said it') + hl('1,001 U.S. workers', 96) + sub('surveyed online by Panopto with YouGov, 2018') + src(SRC1) + F),
 ("When that person retires, changes shifts, or simply goes on vacation, nearly half of what they know leaves with them.",
  kick('What walks out the door') + hl('Retires. Changes shifts.<br>Goes on vacation.', 88) + lbl('Nearly half of what they know leaves with them.', 56, '#ffc53d') + F),
 ("On a plant floor, that's the trick that restarts the line, the sensor that reads wrong when it's cold, the breaker that was never relabeled.",
  kick('On the plant floor') + hl('The restart trick.<br>The sensor that lies<br>when it\'s cold.<br>The unlabeled breaker.', 82) + F),
 ("It shows up as longer downtime, repeat failures, and new hires learning the hard way, one breakdown at a time.",
  kick('What it costs') + hl('Longer downtime.<br>Repeat failures.', 92, '#ff6b5a') + lbl('New hires learning the hard way.', 58) + F),
 ("Four pillars keep that knowledge in the building.",
  kick('Keep it in the building') + hl('4 pillars', 140, '#36cfc9') + F),
 ("One. Write the fix down where the next person will look, at the machine, by the asset, with photos.",
  kick('Pillar 1') + num(1, 'Write the fix down at the machine, by the asset, with photos.') + F),
 ("Keep it short: the symptom, the cause, the fix, and a photo of the part. A two-line note at the machine beats a perfect manual nobody opens.",
  kick('Keep it short') + hl('Symptom.<br>Cause.<br>Fix.<br>Photo.', 100, '#2fa4ff') + sub('A two-line note at the machine beats a perfect manual nobody opens.') + F),
 ("Two. Pair people up. Shadowing an experienced tech teaches what no binder can.",
  kick('Pillar 2') + num(2, 'Pair people up. Shadowing teaches what a binder can\'t.') + F),
 ("Send a newer technician on the next call with your most experienced one, and let the newer tech hold the meter.",
  kick('Make it hands-on') + hl('Let the new tech<br>hold the meter.', 100) + sub('The experienced tech talks them through it.') + F),
 ("Three. Teach the why, not just the steps, so the next person can handle the problem nobody wrote down.",
  kick('Pillar 3') + num(3, 'Teach the why, not just the steps.') + F),
 ("If a tech knows why a fix works, they can handle the next problem that looks a little different. Steps alone only fix the problem you wrote down.",
  kick('Why the why matters') + hl('Steps fix one problem.<br>The why fixes the next one.', 84, '#2fa4ff') + F),
 ("Four. Check that it moved. A quick sign-off or checkoff shows the knowledge actually landed.",
  kick('Pillar 4') + num(4, 'Check that it moved: a sign-off or checkoff.') + F),
 ("Where to start? Your ten most frequent breakdowns. That's where captured knowledge pays back first.",
  kick('Where to start') + '<div class="big" style="color:#36cfc9">10</div>' + lbl('most frequent breakdowns') + sub('That\'s where captured knowledge pays back first.') + F),
 ("Datumline keeps a time-stamped journal for every machine, with photos. TechProof trains technicians with forty-eight plant-floor courses, with one license for the whole plant.",
  kick('Tools for all four') + shot('tp/catalog.webp', 900) + lbl('Datumline: a journal for every machine', 52, '#2fa4ff') + lbl('TechProof: 48 plant-floor courses, one plant license', 52, '#36cfc9') + F),
 ("Sigh-yawn Automation. Keep what your plant knows, at sigh-yawn automation dot com.",
  end('Keep what your plant knows.', 'syonautomation.com')),
]
P['2026-11-05-datumlab-loop-tip'] = [
 ("Is that control loop really tuned, or does it just look fine on the HMI?",
  kick('DatumLab tip') + hl('Is that loop really tuned?', 104) + sub('Or does it just look fine on the HMI?') + F),
 ("Many loops get tuned once, at startup, and never looked at again. Valves wear, the process changes, and the loop quietly gets worse.",
  kick('Loops drift') + hl('Tuned once.<br>Never checked again.', 96) + lbl('Valves wear. The process changes.', 56, '#ffc53d') + F),
 ("The fix is to measure it. Same test, same numbers, before and after every change.",
  kick('Measure it') + hl('Numbers,<br>not opinions.', 112, '#36cfc9') + sub('Same test, before and after every change.') + F),
 ("DatumLab connects to any OPC UA server: Kepware, FactoryTalk Linx Gateway, Ignition, Siemens S7-1500 or Beckhoff.",
  kick('Live tags, straight off the PLC') + shot('lab/trend.webp') + lbl('Kepware · FactoryTalk Linx Gateway · Ignition · S7-1500 · Beckhoff', 44, '#b8c2cc') + F),
 ("Double-click the tags you want and they stream into a live trend at a fixed rate.",
  kick('Fixed-rate sampling') + hl('Double-click a tag.<br>It streams live.', 96) + sub('A fixed rate keeps FFTs and filters valid.') + F),
 ("Pick the process variable and the setpoint, then run control-loop performance.",
  kick('Control-loop performance') + shot('lab/loop.webp') + lbl('Pick PV and SP. One click.', 56, '#2fa4ff') + F),
 ("You get the error scores, I A E, I S E and I T A E, plus time in band, with the error plotted underneath.",
  kick('Error scores') + hl('IAE · ISE · ITAE', 110, '#36cfc9') + sub('plus time in band, with the error plotted') + F),
 ("Time in band is the plain-English one: how much of the run the variable actually stayed where you wanted it.",
  kick('Time in band') + hl('How long it stayed<br>where you wanted it', 90) + F),
 ("It flags oscillation, output saturation and valve reversals, the trouble that wastes energy and wears out valves.",
  kick('What it flags') + hl('Oscillation<br>Output saturation<br>Valve reversals', 92, '#ffc53d') + F),
 ("Step-response metrics give a first-order-plus-dead-time estimate and a SIMC P I tuning starting point.",
  kick('A place to start tuning') + hl('FOPDT estimate', 96) + lbl('+ SIMC PI tuning starting point', 58, '#2fa4ff') + F),
 ("Cross-correlation between tags finds the lag and the dead time.",
  kick('Lag and dead time') + hl('Cross-correlation', 104, '#36cfc9') + sub('between any two tags') + F),
 ("Dead time is the delay before the process even starts to respond. A loop tuned without knowing it tends to overshoot and swing.",
  kick('Why dead time matters') + hl('Ignore the delay,<br>get the swing.', 100, '#ffc53d') + sub('Dead time is the wait before the process responds.') + F),
 ("Then run an FFT for vibration and ripple, or SPC with Cp and Cpk, on the same live data.",
  kick('Same data, more answers') + shot('lab/fft.webp') + lbl('FFT · SPC · Cp/Cpk', 60, '#2fa4ff') + F),
 ("Cp and Cpk tell you whether the process can hold its spec, not just whether it happens to be in spec today.",
  kick('Process capability') + shot('lab/spc.webp') + lbl('Can it hold the spec?', 60, '#36cfc9') + F),
 ("Start with your worst loop, the one operators keep putting in manual. That's where the savings show up first.",
  kick('Where to start') + hl('Your worst loop', 110, '#ffc53d') + sub('The one operators keep putting in manual.') + F),
 ("Record every sample to CSV. It runs on your own network, with a one-time price from four hundred ninety-five dollars.",
  kick('Yours to keep') + '<div class="big" style="color:#2fa4ff;font-size:220px">$495</div>' + lbl('one-time price · no subscription') + sub('Runs on your own network') + F),
 ("DatumLab from Sigh-yawn Automation. Free fourteen-day trial at sigh-yawn automation dot com.",
  end('DatumLab: free 14-day trial', 'syonautomation.com/datumlab')),
]
loop_svg = f'''<svg width="900" height="520" viewBox="0 0 900 520" fill="none" stroke-linecap="round" stroke-linejoin="round" style="display:block;margin:20px auto">
<rect x="40" y="170" width="230" height="180" rx="16" stroke="{B}" stroke-width="6"/><text x="155" y="250" text-anchor="middle" font-family="M,sans-serif" font-weight="800" font-size="34" fill="#f5f7fa">24 V DC</text><text x="155" y="295" text-anchor="middle" font-family="M,sans-serif" font-size="26" fill="{M}">supply</text>
<rect x="630" y="170" width="230" height="180" rx="16" stroke="{T}" stroke-width="6"/><text x="745" y="250" text-anchor="middle" font-family="M,sans-serif" font-weight="800" font-size="32" fill="#f5f7fa">Transmitter</text><text x="745" y="295" text-anchor="middle" font-family="M,sans-serif" font-size="26" fill="{M}">2-wire</text>
<rect x="335" y="380" width="230" height="120" rx="16" stroke="{A}" stroke-width="6"/><text x="450" y="450" text-anchor="middle" font-family="M,sans-serif" font-weight="800" font-size="32" fill="#f5f7fa">PLC input</text>
<path d="M270 210 H630" stroke="{G}" stroke-width="7"/><path d="M745 350 V440 H565" stroke="{G}" stroke-width="7"/><path d="M335 440 H155 V350" stroke="{G}" stroke-width="7"/>
<path d="M430 190 l30 20 l-30 20" stroke="{G}" stroke-width="6"/>
<text x="450" y="160" text-anchor="middle" font-family="M,sans-serif" font-weight="700" font-size="34" fill="{G}">same current everywhere in the loop</text></svg>'''
scale_svg = f'''<svg width="900" height="300" viewBox="0 0 900 300" fill="none" style="display:block;margin:30px auto">
<rect x="60" y="120" width="780" height="40" rx="20" fill="#0d1a26" stroke="#22303f" stroke-width="4"/><rect x="60" y="120" width="390" height="40" rx="20" fill="{B}"/>
<text x="60" y="95" font-family="M,sans-serif" font-weight="800" font-size="40" fill="#f5f7fa">4 mA</text><text x="450" y="95" text-anchor="middle" font-family="M,sans-serif" font-weight="800" font-size="40" fill="{B}">12 mA</text><text x="840" y="95" text-anchor="end" font-family="M,sans-serif" font-weight="800" font-size="40" fill="#f5f7fa">20 mA</text>
<text x="60" y="215" font-family="M,sans-serif" font-size="34" fill="{M}">0%</text><text x="450" y="215" text-anchor="middle" font-family="M,sans-serif" font-weight="700" font-size="34" fill="{B}">50%</text><text x="840" y="215" text-anchor="end" font-family="M,sans-serif" font-size="34" fill="{M}">100%</text></svg>'''
SRC3 = 'Source: NAMUR NE 43 signal levels'
P['2026-11-05-why-4-20ma'] = [
 ("Why does a 4 to 20 milliamp signal start at 4, and not at zero?",
  kick('Explainer') + hl('Why does 4–20 mA<br>start at 4?', 110) + F),
 ("Because zero has to mean something is wrong.",
  kick('The short answer') + hl('Zero has to mean<br>something is wrong.', 100, '#ffc53d') + F),
 ("Four to twenty milliamps has been the workhorse of process instruments for decades: pressure, level, flow and temperature transmitters.",
  kick('The workhorse signal') + hl('Pressure · Level<br>Flow · Temperature', 92) + sub('One analog signal for decades of plant instruments') + F),
 ("Four milliamps is the bottom of the range, zero percent. Twenty milliamps is the top, one hundred percent.",
  kick('The range') + scale_svg + sub('4 mA = 0% · 20 mA = 100%') + F),
 ("If a wire breaks or the transmitter loses power, the current falls toward zero. The PLC sees less than 4 milliamps and knows it's a fault, not a real reading. That's called a live zero.",
  kick('A live zero') + hl('Broken wire → near 0 mA', 92, '#ff6b5a') + lbl('The PLC knows it\'s a fault, not a reading.', 56) + F),
 ("Those 4 milliamps can also power the transmitter itself, so a two-wire loop carries power and signal on the same pair.",
  kick('Power and signal on one pair') + loop_svg + F),
 ("Why current and not voltage? In a series loop the current is the same everywhere, so long wire runs don't change the reading, and it holds up better against electrical noise.",
  kick('Why current, not voltage') + hl('Same current<br>at every point', 100, '#4fd39a') + sub('Long runs don\'t change the reading. Better noise immunity.') + F),
 ("Many instruments follow NAMUR N E 43. Readings from 3.8 to 20.5 milliamps are measurements. At or below 3.6, or at or above 21, the transmitter is signaling a failure.",
  kick('NAMUR NE 43') + hl('3.8 – 20.5 mA', 110, '#2fa4ff') + lbl('measurement', 52, '#b8c2cc') + hl('≤ 3.6 or ≥ 21 mA', 100, '#ff6b5a') + lbl('failure signal', 52, '#b8c2cc') + src(SRC3) + F),
 ("Scaling is a straight line. Percent equals the reading minus 4, divided by 16, times 100. So 12 milliamps is 50 percent.",
  kick('Scaling') + hl('% = (mA − 4) ÷ 16 × 100', 84) + lbl('12 mA → 50%', 76, '#2fa4ff') + F),
 ("Example: a level transmitter ranged zero to ten feet reads 16 milliamps. 16 minus 4 is 12, divided by 16 is 75 percent, so the level is seven and a half feet.",
  kick('Worked example') + lbl('Range 0–10 ft · reading 16 mA', 58, '#b8c2cc') + hl('(16 − 4) ÷ 16 = 75%', 96) + lbl('= 7.5 ft', 90, '#2fa4ff') + F),
 ("Many transmitters also carry HART, a digital signal riding on the same pair, for setup and diagnostics.",
  kick('Bonus: HART') + hl('Digital data<br>on the same pair', 100, '#36cfc9') + sub('for setup and diagnostics') + F),
 ("Troubleshooting tip: measure the loop current with a meter in series, and compare it to what the PLC shows. If they disagree, look at the scaling or the input card.",
  kick('Troubleshooting tip') + hl('Meter vs. PLC', 112) + sub('If they disagree, check the scaling or the input card.') + F),
 ("TechProof's course T P two-oh-two, 4 to 20 milliamp Loop Calibrator, walks technicians through it step by step.",
  kick('Learn it hands-on') + hl('TechProof TP-202', 104, '#36cfc9') + lbl('4–20 mA Loop Calibrator', 64) + sub('48 maintenance technician courses') + F),
 ("TechProof from Sigh-yawn Automation, at sigh-yawn automation dot com.",
  end('Train the tech who checks the loop.', 'syonautomation.com/techproof')),
]
SRC4 = 'Source: SKF, Lubricants technical data (2022)'
P['2026-11-05-idea-lube-route'] = [
 ("SKF says poor lubrication accounts for over 36 percent of premature bearing failures.",
  kick('Bearings') + '<div class="big" style="color:#ffc53d">36%+</div>' + lbl('of premature bearing failures come from poor lubrication') + src(SRC4) + F),
 ("Too little grease, too much grease, the wrong grease, or a point nobody remembered.",
  kick('How it goes wrong') + hl('Too little. Too much.<br>The wrong grease.<br>The point nobody remembered.', 84) + F),
 ("And bearings are everywhere in a plant: motors, pumps, fans, conveyors and gearboxes.",
  kick('Everywhere') + hl('Motors · Pumps · Fans<br>Conveyors · Gearboxes', 88) + F),
 ("Too much grease is a problem too. It can make a bearing run hot and push past the seals.",
  kick('More isn\'t better') + hl('Over-greasing', 116, '#ff6b5a') + sub('can make a bearing run hot and push past the seals') + F),
 ("In a lot of plants the lube route lives on a paper list, or in one person's head. When that person is out, points get skipped.",
  kick('Today') + hl('A paper list.<br>Or one person\'s head.', 96) + lbl('When they\'re out, points get skipped.', 56, '#ffc53d') + F),
 ("A missed lube point doesn't fail today. It fails weeks later, usually in the middle of a run, and nobody connects it back to the grease.",
  kick('The slow failure') + hl('Missed today.<br>Fails weeks later.', 100, '#ff6b5a') + sub('Usually mid-run. Rarely traced back to the grease.') + F),
 ("An idea for our next app.",
  kick('Software idea') + hl('A lube route<br>in your pocket', 120, '#36cfc9') + F),
 ("Every grease point on a plant map, with its grease type, amount and interval.",
  kick('The idea') + num(1, 'Every grease point on a plant map: grease type, amount, interval.') + F),
 ("The route builds itself from that map, in walking order, so nobody doubles back across the plant.",
  kick('The idea') + hl('A route in<br>walking order', 110, '#2fa4ff') + sub('No doubling back across the plant.') + F),
 ("Scan a QR tag at the point, log it from your phone, and the next due date sets itself.",
  kick('The idea') + num(2, 'Scan the QR tag, log it, next due date sets itself.') + F),
 ("Missed points turn red, and the supervisor gets the list.",
  kick('The idea') + num(3, 'Missed points turn red. The supervisor gets the list.') + F),
 ("And every bearing keeps its history, so when one fails you can see how it was greased.",
  kick('The idea') + num(4, 'A history for every bearing.') + F),
 ("A photo at every point, so a new technician greases the right fitting with the right grease gun.",
  kick('The idea') + num(5, 'A photo at every point: right fitting, right gun.') + F),
 ("And a report for audits: what was greased, when, by whom, and how much.",
  kick('The idea') + num(6, 'Audit report: what, when, who, how much.') + F),
 ("It would run on your own plant network, with no monthly subscription.",
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
