var Clay = require('@rebble/clay');
var clayConfig = require('./config');
var customClay = require('./custom-clay');
var clay = new Clay(clayConfig, customClay, { autoHandleEvents: false });

Pebble.addEventListener('showConfiguration', function (e) {
  if (Pebble.getActiveWatchInfo) {
    clay.meta.activeWatchInfo = Pebble.getActiveWatchInfo();
  }
  Pebble.openURL(clay.generateUrl());
});

Pebble.addEventListener('webviewclosed', function (e) {
  if (e && !e.response) {
    return;
  }
  var dict = clay.getSettings(e.response);
  var messageKeys = require('message_keys');


  // Theme overrides
  var theme = parseInt(dict['THEME'] || dict[messageKeys.THEME] || 0);
  if (theme > 0) {
    var themes = {
      1: { // Ocean Blue
        'INNER_RING_COLOR': '0x0000AA',
        'SUB_INNER_RING_COLOR': '0x000055',
        'MIDDLE_RING_COLOR': '0x000055',
        'OUTER_RING_COLOR': '0x000055',
        'HIGHLIGHT_FILL_COLOR': '0x0055FF',
        'LINE_COLOR': '0x0000AA',
        'NUMBER_COLOR': '0x0055FF',
        'CENTER_TEXT_COLOR': '0x00FFFF',
        'HIGHLIGHT_NUMBER_COLOR': '0x00FFFF',
        'BACKGROUND_COLOR': '0x000055'
      },
      2: { // Forest Green
        'INNER_RING_COLOR': '0x555500',
        'SUB_INNER_RING_COLOR': '0xAAAA55',
        'MIDDLE_RING_COLOR': '0xAAAA55',
        'OUTER_RING_COLOR': '0xAAAA55',
        'HIGHLIGHT_FILL_COLOR': '0xAA5500',
        'LINE_COLOR': '0x555500',
        'NUMBER_COLOR': '0x005500',
        'CENTER_TEXT_COLOR': '0x55AA55',
        'HIGHLIGHT_NUMBER_COLOR': '0x55AA55',
        'BACKGROUND_COLOR': '0xAAAA55'
      },
      3: { // Cyberpunk
        'INNER_RING_COLOR': '0xFF55FF',
        'SUB_INNER_RING_COLOR': '0xAAFF00',
        'MIDDLE_RING_COLOR': '0xFF55FF',
        'OUTER_RING_COLOR': '0x000055',
        'HIGHLIGHT_FILL_COLOR': '0x0000AA',
        'LINE_COLOR': '0x000000',
        'NUMBER_COLOR': '0x0055AA',
        'CENTER_TEXT_COLOR': '0xAAFF00',
        'HIGHLIGHT_NUMBER_COLOR': '0xFF55FF',
        'BACKGROUND_COLOR': '0x000055'
      }
    };

    var selectedTheme = themes[theme];
    if (selectedTheme) {
      for (var key in selectedTheme) {
        // Use the numeric message key ID so we update the correct entry in the
        // dict returned by clay.getSettings() (which uses numeric keys), rather
        // than adding a separate string-keyed duplicate that may be ignored or
        // sent twice.
        var numericKey = messageKeys[key];
        if (numericKey !== undefined) {
          dict[numericKey] = parseInt(selectedTheme[key]);
        } else {
          dict[key] = parseInt(selectedTheme[key]);
        }
      }
    }
  }

  // THEME is a JS-only selector; the watch has no handler for it.
  var themeKey = messageKeys['THEME'];
  if (themeKey !== undefined) {
    delete dict[themeKey];
  }

  Pebble.sendAppMessage(dict, function (e) {
    console.log('Sent config data to Pebble');
  }, function (e) {
    console.log('Failed to send config data!');
    console.log(JSON.stringify(e));
  });
});
