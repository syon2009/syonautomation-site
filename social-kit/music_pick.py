"""Background music for the social-kit videos - Syon Automation LLC.
Every track in social-kit/music/ is an original composition (c) 2026 Syon Automation LLC (made with PostProof's
tools/music/compose.py); see music/catalog.json. Same rules as PostProof:
  post.json "music": "auto" (default) | "none" | a track id such as "04-synthwave-drive"
  post.json "type":  product | statistic | explainer | idea   (sets the mood; guessed from the slug if missing)
Automatic pick: never one of the last 8 tracks used (kept in music/.recent.json, local only, not in git),
best mood for the post type first, then the least recently used track."""
import json, os, zlib

ROTATION = 8
TYPE_MOODS = {
    'product': (['upbeat'], ['positive', 'driving', 'groove', 'bright']),
    'statistic': (['cinematic', 'ambient'], ['calm', 'serious', 'piano']),
    'explainer': (['lofi', 'ambient'], ['calm', 'chill', 'warm']),
    'idea': (['bright', 'pluck', 'funk'], ['playful', 'happy', 'upbeat']),
}


def chain(total, track):
    """ffmpeg filter for the bed: cut the decoded track to its exact sample count (AAC pads the file end to a whole
    frame, which would leave a short gap at every loop), loop it in memory, cut to the video length, bed level 0.35,
    0.6 s fade-in, 2 s fade-out. Use the track as a plain input (no -stream_loop)."""
    n = track['samples']
    return (f"atrim=end_sample={n},aloop=loop=-1:size={n},asetpts=N/SR/TB,aresample=48000,atrim=0:{total:.3f},"
            f"asetpts=PTS-STARTPTS,volume=0.35,afade=t=in:st=0:d=0.6,afade=t=out:st={max(0.0, total - 2):.3f}:d=2")


def post_type(post):
    t = post.get('type')
    if t in TYPE_MOODS:
        return t
    slug = post.get('slug', '')
    if '-idea-' in slug or slug.split('-', 3)[-1].startswith('idea'):
        return 'idea'
    return 'product'


def tier(track, typ):
    p, s = TYPE_MOODS.get(typ, ([], []))
    tags = track.get('mood', [])
    return 0 if any(t in tags for t in p) else 1 if any(t in tags for t in s) else 2


def pick(post, kit, record=True):
    """-> (path to the .m4a, track dict) or (None, None) for no music."""
    d = os.path.join(kit, 'music')
    cat = json.load(open(os.path.join(d, 'catalog.json')))['tracks']
    choice = post.get('music', 'auto')
    if choice == 'none':
        return None, None
    rec_f = os.path.join(d, '.recent.json')
    try:
        recent = json.load(open(rec_f))
    except Exception:
        recent = []
    slug = post.get('slug', '')
    recent = [r for r in recent if r.get('slug') != slug]           # re-building the same post does not count twice
    tr = next((t for t in cat if t['id'] == choice), None)
    if tr is None:
        used = [r['id'] for r in recent[-ROTATION:]]
        cands = [t for t in cat if t['id'] not in used] or cat
        last = {r['id']: i for i, r in enumerate(recent)}
        typ = post_type(post)
        h = zlib.crc32(slug.encode())
        cands.sort(key=lambda t: (tier(t, typ), last.get(t['id'], -1), zlib.crc32(t['id'].encode()) ^ h))
        tr = cands[0]
    if record:
        recent.append({'slug': slug, 'id': tr['id']})
        json.dump(recent[-50:], open(rec_f, 'w'), indent=1)
    return os.path.join(d, tr['file']), tr
