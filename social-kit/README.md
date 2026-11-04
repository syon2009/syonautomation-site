# Daily social shorts — Syon Automation LLC

The kit and the step-by-step routine for the 4 short videos a day posted to the Syon Automation LLC
Facebook page, YouTube channel and LinkedIn company page. This folder is NOT part of the website
(only `public/` is deployed). Developed by Syon Automation LLC.

## The owner's rules (do not change without asking him)
- **4 posts a day**, every day, at **8:07 AM, 11:52 AM, 3:37 PM and 7:22 PM** (America/Toronto, Eastern).
- **No approval step (owner's instruction, Nov 1 2026: "turn off the daily approval and just do it").**
  Each afternoon: build the 4 videos for the first upcoming day that has nothing scheduled at 8:07 AM
  (check the Facebook Planner, YouTube Studio's Shorts list and LinkedIn's "View all scheduled posts" first, so nothing is doubled), check them carefully, then host
  and schedule them yourself. Send him one short message afterwards with the 4 videos, captions,
  sources and times, so he can ask for a change.
- Each post different, **factual**, and either about the software (product, tip, benefit, short
  explainer) or an **idea for a next app** (a real plant-floor problem + the app idea + "Would your
  plant use it? Tell us in the comments").
- Daily mix: 1 product tip or benefit, 1 workforce / industry statistic (untrained or uninformed
  workers, the rise of the blue-collar workforce, the aging workforce, transfer of tribal knowledge and
  its key pillars), 1 short explainer, 1 next-app idea. Don't repeat a topic from the last 2 weeks
  (check `public/social/` and CHANGELOG.md).
- **Every statistic must be checked at its original source the same day** (WebSearch + WebFetch) and
  named on screen and in the caption ("Source: …"). If a number can't be verified, don't use it.
- Product facts come from the product pages in `public/*.html` (prices, trial length, features). Never
  invent features or numbers. Current product line-up: AOI Foundry, PlantProof, Datumline, DatumLab
  (+ Academy), LinkScout, SiteWatch, DataCast, RungWise PLC Academy, WO Mailer, DepthForge (hobby).
- Brand: "Syon Automation LLC"; the new wordmark logo (logo_*.png), never the old SY smiley face;
  dark theme; no purple or pink anywhere; say "Google Chrome", never Edge.
- Voice-over: Kokoro **af_heart, speed 1.05** (upbeat female; never am_michael, never Onyx).
  Write "Syon" as **"Sigh-yawn"** and "SCADA" as **"Skayda"** in the spoken text so they are said right.
- Videos: 1080x1920, under 10 MB (gen.py takes care of it), smooth transitions, no ambiguous visuals.
- **Music: only the original Syon Automation LLC library in `music/`** (14 tracks, © 2026 Syon Automation LLC, made
  from scratch by PostProof's `tools/music/compose.py`; `music/catalog.json` lists title, style, BPM, moods, length,
  loudness and licence). Never use music from anywhere else. `music.m4a` is now a copy of track 1 (Forward Motion).

## Build (in a fresh cloud session)
```bash
pip install --break-system-packages kokoro-onnx soundfile
mkdir -p ~/kokoro && cd ~/kokoro
curl -LO https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/kokoro-v1.0.onnx
curl -LO https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/voices-v1.0.bin
# per post: a folder with post.json (see examples/), then
python3 social-kit/gen.py /path/to/post-folder     # -> <slug>.mp4 + <slug>.jpg
```
post.json: `{"slug": "YYYY-MM-DD-topic", "scenes": [{"id": "s1", "say": "spoken text", "html": "card html"}, …]}`.
Optional in post.json: `"type": "product" | "statistic" | "explainer" | "idea"` (sets the music mood; guessed from the
slug when missing: `…-idea-…` → idea, otherwise product) and `"music": "auto" | "none" | "<track id>"` (for example
`"04-synthwave-drive"`). Automatic music (`music_pick.py`, same rules as PostProof): product tip → upbeat, statistic →
cinematic/ambient, explainer → lo-fi/ambient, app idea → bright/pluck/funk, and never one of the last 8 tracks used
(remembered in `music/.recent.json`, local only). The bed starts at the track's section A (bar 8), is looped gap-free, cut to the video length with a 0.6 s
fade-in and 2 s fade-out, and ducked under the voice. gen.py / genstory.py print which track they used.
Card classes come from base.css: `kick` (teal eyebrow), `big` (huge number), `lbl`, `sub`, `hl` (headline),
`src` (source line), `foot` ("Syon Automation LLC"), `shot` (app screenshot; use `{IMG}/…` for
`public/img/…`). The LAST scene is the end card and must contain
`<div id="wmslot" style="width:720px;height:240px"></div>` (the big animated logo is placed there).
Look at 3-4 frames of every finished video before sending it for approval.

## Host and schedule (no approval wait)
1. Copy each `<slug>.mp4` and `<slug>.jpg` to `public/social/`, add a CHANGELOG.md line, commit, push
   (git pull --rebase first; other chats push to this repo too). The files are live at
   `https://syonautomation.com/social/<slug>.mp4` about a minute after the push.
2. **Never use Metricool (owner, Nov 1 and Nov 3 2026: stop using it completely; post directly until our own posting app replaces this routine).**
   Everything is posted through Claude in Chrome in the owner's own browser (he stays signed in):
   - **Facebook Reel**: `https://business.facebook.com/latest/reels_composer?asset_id=1448802374976313`.
     Patch `HTMLInputElement.prototype.click` to capture the file input, click **Add Video**, label the
     captured input and `file_upload` the mp4 → type the caption in the Description box → wait for
     "Your video is safe to publish" → **Next** → **Next** → **Schedule** (scheduling option) → date
     field → pick the day button ("Wednesday, 4 November 2026") → type into the `hours`, `minutes`,
     `meridiem` spinbuttons → check it reads the right day and time → **Schedule** → confirm "Your reel
     is scheduled". Check the Planner at `https://business.facebook.com/latest/content_calendar`.
   - **YouTube Short**: YouTube Studio (`https://studio.youtube.com/channel/UC8526L36mS7v1WMLkoH4w8A`)
     → Create → Upload videos → same file-input capture → title "<title> #shorts", description = caption,
     Not made for kids, altered content **No** → Visibility **Schedule** with the date and time.
     YouTube has a daily upload cap on this channel (hit on Nov 1 after ~10 uploads in one evening):
     upload no more than 5 in any 24 hours (the 6th was refused on Nov 3), and spread big batches over several days.
3. **LinkedIn** (through Claude in Chrome) at
   `https://www.linkedin.com/company/146908454/admin/page-posts/published/?share=true`:
   type the caption in the composer; if a link-preview card appears, close it with its X; then capture the
   hidden file input: patch `HTMLInputElement.prototype.click` (and `showPicker`) to store the file input
   instead of opening the picker, click the composer's **Add media** button, give the captured input an
   aria-label, append it to `document.body`, restore the patched methods, find it and `file_upload`
   `/home/claude/syonautomation-site/public/social/<slug>.mp4` (path must be inside this repo; < 10 MB).
   Click **Next** in the media editor → clock icon (**Schedule post**) → pick the date in the calendar
   pop-up, type the time (e.g. `3:37 PM`), Tab → check the header reads the right day and time → **Next**
   → **Schedule**. Verify under clock → **View all scheduled posts**, then navigate away (no stray drafts).
4. Tell him in one short message what is scheduled where and when.
