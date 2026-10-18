# UAT-13 — Messages off the cat's face

Status: published to UAT **20261015195300 / APK2**, October 15, 2026. Jenny approved the previews and publication: “perfecto, proceed to UAT”. Jenny subsequently confirmed “approved/passed”: UAT-13 passed and signed off on October 15, 2026.

Baseline: published UAT 20261015164930 / APK2, matched byte-for-byte against its JSON payload. Draft: `work/uat13/draft.html`. Publication used the newer UAT 20261015172100 baseline, preserving its continuous-fall motion. Exactly the same four approved message replacements were applied; only the BUILD label changed additionally. Current source: `work/uat13/release.html`.

Changes:
- Move comic callouts, including BOARD CLEAR!, onto the table. Minimum clearance accounts for their existing pop scale and rotation on shorter screens.
- Stop collection messages below the face. Keep the existing rise interpolation, duration and fade; change only its destination.
- Collection text is white with a thicker dark outline for contrast over gold coins. Large callouts retain their existing heavy black outline and colors.
- Preserve the baseline wording: SHRIMP / COLLECTED! and CHEESE / COLLECTED!.

Evidence: `UAT-13-evidence/*-comparison.png` contains nine paired 400×889 game renders over the full initial 220-coin board: Board Clear, Shrimp, Cheese, Try Again, Snacks Set Complete, Level, Quest Complete, Daily Won, and Crown. These are desktop-rendered phone-sized previews, not phone captures. Collection previews show the top of the rise; callouts show maximum pop with extreme rotation. Additional callouts use the same shared renderer; dormant ones are explicitly invoked for preview.

Validation: conservative text envelopes checked through the pop animation at 60 Hz for heights 720, 889 and 960. Both collection lines remain below the head's lower boundary throughout the rise; callout bounds include outline and maximum rotation. See `work/uat13/animation-bounds.json`. Source changes are limited to four message-rendering expressions. Regression checks found no failures.

Phone UAT: Jenny confirmed “approved/passed” for UAT-13 on release 20261015195300 / APK2. Message placement, face clearance and readability accepted. No separate numeric phone FPS measurement was supplied. No production changes or promotion requested.

Publication: backed up to `uat/backups/before-20261015195300`; verified all 23 runtime files and UAT identity/APK2. Payload SHA256: `95c80ce98ebdfbb57b95db44db81caecebd47c89f217a61f4ef15f5a90341726`. Evidence: `UAT-13-release-verification.json`. Animation bounds were rechecked against the current source before publication.

Final status: UAT-13 complete with Jenny's UAT sign-off. Evidence of acceptance: “approved/passed” in this ticket conversation.
