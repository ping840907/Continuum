module.exports = function(minified) {
  var clayConfig = this;

  // 原本的函數：根據動畫開關狀態，隱藏或顯示慣性效果開關
  function toggleInertia() {
    var inertiaItem = clayConfig.getItemByMessageKey('INERTIA_TOGGLE');
    if (inertiaItem) {
      if (this.get()) {
        inertiaItem.show();
      } else {
        inertiaItem.hide();
      }
    }
  }

  clayConfig.on(clayConfig.EVENTS.AFTER_BUILD, function() {
    // === 1. 動畫/慣性連動邏輯 ===
    var animToggle = clayConfig.getItemByMessageKey('ANIMATION_TOGGLE');
    if (animToggle) {
      toggleInertia.call(animToggle);
      animToggle.on('change', toggleInertia);
    }

    // === 2. 硬體平台過濾邏輯 ===
    var platform = clayConfig.meta.activeWatchInfo.platform;
    
    // 改用 getItemByMessageKey 來抓取你的觸控開關
    var touchToggle = clayConfig.getItemByMessageKey('TOUCH_TOGGLE');

    // 如果目前連接的手錶不是 emery，且也不是 gabbro，就把該選項隱藏
    if (platform !== 'emery' && platform !== 'gabbro') {
      if (touchToggle) {
        touchToggle.hide(); 
      }
    }
  });
};