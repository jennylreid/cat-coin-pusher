# CoinPusher retrospective — October 11, 2026

## What went wrong

### Small edits repeatedly changed the character

I used whole-image generation for precise changes to eyes, mouth and paws. Each pass also altered head width, ear placement, feature spacing or paw proportions. I repeatedly asked the generator to preserve features without a reliable way to enforce that preservation. Jenny had to restate decisions and identify unintended changes.

**Lesson:** A prompt saying “keep everything else unchanged” is not an asset lock. Consistency must come from a fixed master and reusable parts, with comparisons against the approved originals.

### Finalized poses were redrawn unnecessarily

Resting—now called Waiting—and the existing Quake impact were already settled. Mockups omitted Waiting paws, substituted different Quake paws, shortened their reach, and sometimes added duplicate paws. The intended Quake change was the head moving down, not a paw redesign.

**Lesson:** Separate each requested change from the established baseline before producing a mockup. The approved mitt assets and placement should be reused directly wherever possible.

### Happy in UAT did not match the shown mockup

To preserve the master outline, I implemented Happy as a native drawing overlay. That was useful structurally, but the mouth, eyes and paw placement did not closely match the mockup. I published the test without presenting that mismatch clearly enough. Happy was also assigned to board clear before its use had been decided; Jenny later specified Rest for board clear and Happy’s use as TBD.

**Lesson:** Approval to put a concept into UAT does not resolve unspecified behavior or make a different rendering an approved match. Show real runtime frames and state any differences before publication.

### Names and approval status lagged behind the work

“Resting,” “Recovery,” “Rest,” “Happy,” “Spray” and “Shower” evolved during the conversation. Pose names, expressions and transition actions were sometimes treated interchangeably. The main spec still described afternoon releases after evening implementation, while checkpoint notes accumulated above old descriptions.

**Lesson:** Maintain one current vocabulary and one approval register. Update the authoritative spec when decisions change; keep older material clearly historical.

### The mouth-drop idea constrained both art and gameplay

Making coins emerge through the teeth forced the mouth to act as both an expression and a dispenser. Jenny found the result unattractive, and the arrangement made it harder to change faces independently. An initial attempt to move the physical release height also reduced measured board slack; I reverted that physics change and kept the new rail as a visual treatment.

**Lesson:** Validate the visual premise early. Separate character expression from coin entry, and measure gameplay effects when a visual change touches physics.

## What went right

### Jenny’s feedback clarified a coherent direction

Specific corrections established the desired character: wide angular tuxedo head, goofy rather than angry teeth, compact expressive smiles, closed golden arches for Happy, and carefully controlled paw poses. The reference crop helped clarify feature ratios. The later naming decision separated Waiting, Rest and Recovery cleanly.

### The confirmed master and approved originals remained available

Sweet was explicitly confirmed as the master. Goofy Grin and Quake were pulled from the actual production payload, rather than reconstructed from memory. Shower artwork was approved separately from its unimplemented power. Original head and mitt PNGs were retained unchanged through the UAT work.

### Production and UAT stayed separate

The earlier power promotion occurred with explicit authorization. Subsequent pose experiments went only to UAT. Game updates retained their correct package identity and APK versions, backups were made before publication, and deployment verified that production APK and JSON hashes were unchanged during UAT releases.

### Runtime testing caught meaningful problems

Tests used the shipped game and Rapier physics. They covered power exclusion, no ordinary coin cost, growl-before-slam, reset behavior, spill outcomes, head motion, recovery scaling, Rest on board clear and Happy preview timing. Board-strategy checks exposed the release-height balance regression before it was published. Real rendered frames also exposed leftover eye pixels and mismatched Happy details that were corrected.

### The final evening state is documented

Production is 20261011191602, APK 13. UAT is 20261011205433, APK 1. Waiting remains the toothy idle pose; Rest is Sweet with raised mitts and is used on board clear. Recovery is the transition into Rest, with mitts shrinking as they recede. Happy is preview-only with use TBD. Shower remains approved artwork with no implemented power. The current spec and handoff record these distinctions.

## What needs to change

1. **Start each art change with a short change contract.** Identify the exact approved baseline, what may change, what is locked, and whether the result is a mockup, UAT test or production release. Keep this practical, not another approval obstacle.

2. **Use a fixed master and reusable layers.** Preserve the head outline, ears, markings, nose and whiskers. Build expressions from eye/mouth layers and poses from the existing paw assets. Use generation for exploration; use deterministic placement for exact reuse. Do not redraw an approved pose to illustrate an unrelated addition.

3. **Compare at the same scale before showing results.** Check ear span, cheek width, chin baseline, eye spacing, nose/mouth ratios, paw dimensions and paw count. A visually polished image is not sufficient if it violates the requested geometry.

4. **Keep artwork, pose and behavior approvals distinct.** An approved face does not imply an approved power economy or trigger. A UAT test does not imply production promotion. Mark pending choices explicitly—especially Happy’s use and Shower’s mechanics.

5. **Show the actual implementation before publishing visual changes.** Present real Waiting, impact, recovery, Rest and Happy frames together. For motion, inspect a short runtime sequence. Explain material differences from the mockup rather than calling an approximate rendering a match.

6. **Preserve physics during art work unless a mechanics change is requested.** If coin entry, timing or collision paths change, run targeted gameplay/balance checks. Keep visual rail experiments distinct from changes to physical release behavior.

7. **Update the current spec as decisions settle.** Use the approval register and consistent names, then revise the relevant current sections. Preserve old docs as history rather than leaving contradictory rules mixed into the current narrative.

8. **Finish with a clear device-review checkpoint.** Desktop tests establish code behavior, asset integrity and channel separation. Jenny’s phone review still establishes how movement, sound, clipping and readability feel. Record that limit without blocking authorized UAT testing.

The next session should begin with phone feedback on the final UAT release, not another redesign of Waiting or the approved Quake mitts.
