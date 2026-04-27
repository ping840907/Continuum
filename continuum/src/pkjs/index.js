// Clay is temporarily removed (incompatible with Gabbro SDK 4).
// The watchface runs on default / previously persisted settings.
// showConfiguration and webviewclosed handlers are stubs only.

Pebble.addEventListener('showConfiguration', function () {
  // No-op: configuration UI unavailable without Clay.
});

Pebble.addEventListener('webviewclosed', function () {
  // No-op.
});
