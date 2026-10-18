# Android app

A small Java wrapper that runs the game in a WebView and checks for game updates over HTTPS.

The build copies the game (index.html, img/, lib/, sounds/) into `app/src/main/assets/`, along with
`update-url.txt`, the private download link for game updates. Those files are not in this repository.
