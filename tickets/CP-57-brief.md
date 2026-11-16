# CP-57 Money sounds: cash register, louder Dance break music (Jenny, Nov 16)

Engineer: same rules as CP-54 (AGENTS.md: frozen pickup; CODEX_BRIEF.md; SOUND_MAP.md; tickets/CP-54.md).

**Jenny (Nov 16):**
- "This should sound like money."
- "You need a multitude of sounds."
- "Instead of the bell, I want to use the cash register for prizes dropping over the ledge. ... keep the bell for
  something."
- The Dance break music "isn't loud enough".
- "We'll try it." It's a trial, judged on her phone.

**Bell split (Jenny, Nov 16):**
- Prizes and rain coins over the edge: the cash register.
- Power coins (Quake etc.) over the edge: keep the bell sound.
- The bell prize (Jingle bell) over the edge: the bell sound.
- First confirm what plays today for each and list it in the report.

## Do
1. **Prize over the ledge:** a real cash-register recording replaces the ledge bell.
   - Use a few takes, rotating so it never repeats twice in a row.
   - **Only the bell changes.** Jenny explicitly reopened that one sound of the frozen pickup. The pickup's look, sizes,
     timing, its other sounds and the busy multi-drop stay exactly as they are.
   - Keep the bell's file and code available, unused for now. Jenny will use it for something else later.
2. **Rain coin over the edge:** the same cash register, rotating takes.
3. **Dance break music:** louder. Start at about +10 dB (twice the perceived loudness) without clipping, and report the
   before and after levels against the other sounds.
4. **Real recordings only,** with a licence that allows use in a game. Note each one's source and licence.
   Nothing code-made.

## Publishing
Prepare the change now, but don't publish yet. Codex is publishing CP-56 as UAT 72. When the PM says go, build on the
latest UAT (UAT 72) and publish the next one with the usual backup, version, cloud check and checkpoint. Production
stays untouched.

## Test plan
At the top of `tickets/CP-57.md`: a short phone test (prize over the ledge, rain coin over the edge, several prizes at
once, the Dance break), ending with a sign-off line. Then message the PM (session
`local_c33de928-2fcf-4e87-9b03-fae33ff1496d`).
