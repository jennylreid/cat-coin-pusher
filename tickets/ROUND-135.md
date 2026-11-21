# UAT 135 round (Jenny approved Nov 20, after testing production 2026.11.20)
Then: quick test, production update (PROD-11).

Jenny, verbatim (production, Pixel): "the endless board... started with the level 1 board, but without a timer... you just have
a very boring game that lasts far too long because the prizes are pushed over the edge within the first 30 seconds... And then
you just have to sit there and wait for the next board to load... the second board was also the level 1 board... the level
boards listed, which isn't really meant to be a production thing... there are 2 home buttons on this board... it's kind of
overlapping with the settings button and the dance meter."

Decisions (her paste):
1. Keep prizes coming: when only a few prizes are left on the board, new ones drop in, so a board never runs dry. Engineer picks
   a sensible threshold and pace (tell the PM). Use the existing prize drop-in; the frozen pickup (look, sizes, timing, sounds,
   multi-drop) is unchanged.
2. Never the same board twice in a row (NEW BOARD and any start).
3. Level boards: UAT only (like Goal boards; off on a production-named build).
4. Remove the board's own Home button (the pause menu has Home); fix the top-bar overlap with settings and the Dance meter.
   Check the whole top bar at 412x915 and 360x640.
