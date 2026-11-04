"""Build one vertical short from a post folder containing post.json.
post.json: {"slug": "...", "scenes": [{"id": "s1", "say": "...", "html": "<inner html>", "style": "optional"}...]}
The last scene is the end card: its html must contain <div id="wmslot" style="width:720px;height:240px"></div>.
Usage: python3 genstory.py POSTDIR  (gen.py with a jitter-free zoom: each card is zoomed at 4x resolution, then scaled down)"""
import json, os, subprocess, sys
import numpy as np, soundfile as sf
KIT = os.path.dirname(os.path.abspath(__file__))
TTS = os.environ.get('SYON_TTS', os.path.expanduser('~/kokoro'))
P = os.path.abspath(sys.argv[1]); os.chdir(P)
post = json.load(open('post.json')); sc = post['scenes']; n = len(sc)
# 1 voice
os.makedirs('vo', exist_ok=True)
from kokoro_onnx import Kokoro
k = Kokoro(f'{TTS}/kokoro-v1.0.onnx', f'{TTS}/voices-v1.0.bin')
durs = {}
for s in sc:
    a, sr = k.create(s['say'], voice='af_heart', speed=1.05, lang='en-us')
    sf.write(f"vo/{s['id']}.wav", a, sr); durs[s['id']] = len(a) / sr
json.dump(durs, open('durs.json', 'w'))
# 2 cards
css = open(f'{KIT}/base.css').read().replace('url(manrope', f'url(file://{KIT}/manrope')
IMG = 'file://' + os.path.abspath(os.path.join(KIT, '..', 'public', 'img'))
for s in sc: s['html'] = s['html'].replace('{IMG}', IMG)
body = ''.join(f"<div class=\"c\" id=\"{s['id']}\" style=\"{s.get('style','')}\">{s['html']}</div>" for s in sc)
open('cards.html', 'w').write(f'<!doctype html><html><head><meta charset="utf-8"><style>{css}</style></head><body>{body}</body></html>')
ids = [s['id'] for s in sc]
js = """const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920}});
await p.goto('file://'+process.cwd()+'/cards.html');await p.waitForTimeout(600);
const V=%s;
for(const id of %s){const tr=V.includes(id);await p.evaluate(([i,tr])=>{document.querySelectorAll('.c').forEach(c=>c.classList.toggle('on',c.id==i));const bg=tr?'transparent':'';document.documentElement.style.background=bg;document.body.style.background=bg;document.getElementById(i).style.background=tr?'transparent':''},[id,tr]);await p.waitForTimeout(200);await p.screenshot({path:`card_${id}.png`,omitBackground:tr});}
await b.close();})();""" % (json.dumps([s['id'] for s in sc if s.get('video')]), json.dumps(ids))
open('rcards.js', 'w').write(js)
subprocess.run(['node', 'rcards.js'], check=True, env={**os.environ, 'NODE_PATH': os.environ.get('NODE_PATH', '/usr/lib/node_modules:/usr/local/lib/node_modules')})
# 3 video
X = 0.45; PAD = 0.8; FPS = 30
dur = [durs[i] + PAD for i in ids]; dur[-1] += 1.2
starts = []; t = 0
for x in dur: starts.append(t); t += x - X
total = starts[-1] + dur[-1]
cmd = ['ffmpeg', '-v', 'error', '-y']
VID = {s['id']: s for s in sc if s.get('video')}
for i, x in zip(ids, dur):
    nf = int(round(x * FPS))
    if i in VID:   # live stock clip under a transparent text overlay; the clip's own motion, no added zoom
        v = VID[i]; src = os.path.abspath(os.path.join(P, v['video'])); vs = float(v.get('vstart', 0))
        ln = float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', src], capture_output=True, text=True).stdout)
        slow = max(1.0, x / max(0.5, ln - vs - 0.1))   # gently slow a short clip instead of looping it (no visible jump)
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', f'{vs:.2f}', '-i', src, '-loop', '1', '-i', f'card_{i}.png', '-filter_complex',
            f"[0:v]setpts={slow:.4f}*(PTS-STARTPTS),scale=1080:1920:force_original_aspect_ratio=increase:flags=lanczos,crop=1080:1920,fps={FPS},setsar=1[bg];[bg][1:v]overlay=0:0:format=auto,format=yuv420p[v]",
            '-map', '[v]', '-frames:v', str(nf), '-an', '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '16', '-pix_fmt', 'yuv420p', f'clip_{i}.mp4'], check=True)
        cmd += ['-i', f'clip_{i}.mp4']; continue
    import cv2
    img = cv2.imread(f'card_{i}.png', cv2.IMREAD_COLOR)
    h, w = img.shape[:2]
    p = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'bgr24', '-s', f'{w}x{h}', '-r', str(FPS), '-i', '-',
        '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '14', '-pix_fmt', 'yuv420p', f'clip_{i}.mp4'], stdin=subprocess.PIPE)
    for fr in range(nf):
        z = 1 + 0.035 * fr / max(1, nf - 1)            # smooth, sub-pixel zoom about the centre (no rounding steps)
        M = np.float32([[z, 0, (1 - z) * w / 2], [0, z, (1 - z) * h / 2]])
        p.stdin.write(cv2.warpAffine(img, M, (w, h), flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_REFLECT).tobytes())
    p.stdin.close(); p.wait()
    cmd += ['-i', f'clip_{i}.mp4']
cmd += ['-loop', '1', '-i', f'{KIT}/logo_sm.png', '-loop', '1', '-i', f'{KIT}/logo_big.png']
for i in ids: cmd += ['-i', f'vo/{i}.wav']
# background music: original Syon Automation LLC library (music/), picked by mood with an 8-post rotation (music_pick.py)
sys.path.insert(0, KIT)
from music_pick import pick, chain
music, track = pick(post, KIT)
if music:
    cmd += ['-i', music]
f = []
for kk, x in enumerate(dur):
    f.append(f"[{kk}:v]setsar=1,format=yuv420p,fps={FPS}[v{kk}]")
prev = 'v0'; acc = dur[0]
for kk in range(1, n):
    f.append(f"[{prev}][v{kk}]xfade=transition=fade:duration={X}:offset={acc - X:.3f}[x{kk}]"); prev = f'x{kk}'; acc += dur[kk] - X
L = n; B = n + 1; se = starts[-1]
hue = "hue=h='-75+75*cos(2*PI*t/18)'"
f.append(f"[{L}:v]format=rgba,{hue}[ls]")
f.append(f"[{B}:v]format=rgba,{hue},fade=t=in:st={se + 0.3:.2f}:d=0.6:alpha=1[lb]")
f.append(f"[{prev}][ls]overlay=x=(W-w)/2:y=150:enable='lt(t,{se + 0.2:.2f})'[o1]")
f.append(f"[o1][lb]overlay=x=180:y=676:enable='gte(t,{se:.2f})',format=yuv420p[vout]")
for kk in range(n):
    ms = int((starts[kk] + 0.25) * 1000); f.append(f"[{n + 2 + kk}:a]aresample=48000,adelay={ms}|{ms}[a{kk}]")
f.append(''.join(f'[a{kk}]' for kk in range(n)) + f"amix=inputs={n}:normalize=0,apad=whole_dur={total:.3f},atrim=0:{total:.3f}[vo]")
if music:   # loop the bed, cut it to the exact video length, fade in and out, duck it under the voice
    f.append(f"[{2 * n + 2}:a]" + chain(total, track) + "[mu]")
    f.append("[vo]asplit=2[vo1][vo2]")
    f.append("[mu][vo1]sidechaincompress=threshold=0.03:ratio=8:attack=20:release=400[mud]")
    f.append("[vo2][mud]amix=inputs=2:normalize=0,loudnorm=I=-16:TP=-1.5:LRA=11[aout]")
else:
    f.append("[vo]loudnorm=I=-16:TP=-1.5:LRA=11[aout]")
out = f"{post['slug']}.mp4"
for crf in (21, 23, 25, 27):
    subprocess.run(cmd + ['-filter_complex', ';'.join(f), '-map', '[vout]', '-map', '[aout]', '-t', f'{total:.2f}', '-c:v', 'libx264', '-preset', 'veryfast', '-crf', str(crf), '-pix_fmt', 'yuv420p', '-r', '30', '-c:a', 'aac', '-b:a', '160k', '-movflags', '+faststart', out], check=True)
    if os.path.getsize(out) < 60e6: break
# thumbnail from the first card
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', '1.5', '-i', out, '-frames:v', '1', '-q:v', '3', f"{post['slug']}.jpg"], check=True)
print(json.dumps({'out': out, 'seconds': round(total, 1), 'mb': round(os.path.getsize(out) / 1e6, 2), 'music': track['id'] if track else None}))
