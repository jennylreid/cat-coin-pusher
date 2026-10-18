# Gameplay sound map

Updated October 11, 2026. Production: **20261011164847 (4:48 PM)**, main APK **13**. UAT: **20261011182423 (6:24 PM)**, UAT APK **1**. These are separate channels. The two-power test and consistent tooth colors are UAT-only; they have not been approved for production.

Effects only; no background music or spoken announcer. Missing voice clips stay silent, with no TTS fallback.

| Action | Recording / effect | Current behavior |
|---|---|---|
| Accepted coin | coin-drop.mp3; freesound_gamestudio-drop-coin-384921 | Short cue, up to 1.1 s |
| First physical landing | coin-land.mp3; dragon-studio-dropping-a-coin-478359 | Contact-timed; 0.84 s impact |
| Active advancing pusher | pusher.mp3; freesound_community-push-100769 | One short mechanical cue per stroke |
| Pusher contacts moving coins | coin-roll.mp3; universfield-spinning-coin-on-table-352448 | Dedicated 0.6 s rattle, at most once per forward stroke |
| Single edge fall | coin-off.mp3; sumaga123-coin-drop-432151 | First 0.85 s |
| Three or more close edge falls | coin-spill.mp3; freesound_community-coin-spill-105867 | Limited burst, up to 1.8 s |
| Tower breaks | coin-roll.mp3 | Limited roll/rattle |
| Cheese/shrimp collected | Original synth soft pop + three rising sine chimes | Distinct reward cue, not animal/food noises; ordinary coin-off cue omitted for target |
| BOARD CLEAR | Existing cash-register/clear effect | Preserve favorite cue; delayed until collection messages finish |
| Paw Sweep | Rumble; production also retains existing growl | UAT reserves growl for Catquake and uses sweet face |
| Catquake (UAT only) | Existing goofy growl, then impact rumble | Roar once on activation; impact once at paw contact |

HTMLAudio pools, cooldowns/duration caps and max six simultaneous recordings limit overlapping clatter. Clear celebration ducks recordings. Mute, reset and backgrounding stop recordings. Synth fallbacks handle unloaded samples. Catquake is not a looping music track. Audio routing tests are not acoustic/device tests. Confirm levels and character on the phone.

Future sound assets, if desired: a polished short goofy roar, paw-edge thump, sweep scrape, softer landing/rattle variants and target reward variants. Keep existing preferred clear/growl available; replacement needs review. Original recording filenames do not by themselves establish redistribution rights—retain asset provenance and check licensing for release.
