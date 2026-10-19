/* =============================================================
 * 云杉寨 · 启动页
 * -------------------------------------------------------------
 * 打开站点时先展示 logo 与四周扩散的径向渐变，约 4.3 秒后淡出。
 * 同一个标签页内只会出现一次（避免每次切回首页都重新播放）。
 *
 * 想调整时长：改下面的 DURATION（建议保持 3000–5000 毫秒），
 * 并同步修改 css/style.css 中 .splash-progress i 的 animation-duration。
 * ============================================================= */

(function () {
  'use strict';

  var CJY = (window.CJY = window.CJY || {});
  var KEY = 'cjy-splash-seen';
  var DURATION = 4300;
  var FADE = 650;

  function alreadySeen() {
    try {
      return window.sessionStorage.getItem(KEY) === '1';
    } catch (e) {
      return false;
    }
  }

  function markSeen() {
    try {
      window.sessionStorage.setItem(KEY, '1');
    } catch (e) {
      /* 隐私模式下不可用也没关系 */
    }
  }

  function init() {
    var splash = document.getElementById('splash');
    if (!splash) return;

    if (alreadySeen()) {
      splash.parentNode.removeChild(splash);
      return;
    }

    document.body.classList.add('is-locked');

    /* 左下角版本号来自 data/site.js，避免两处手写 */
    var versionEl = document.getElementById('splash-version');
    if (versionEl && CJY.site) {
      versionEl.textContent =
        (CJY.site.version || '') + ' · EST. ' + String(CJY.site.established || '').slice(0, 4);
    }

    var timer = window.setTimeout(dismiss, DURATION);
    var leaving = false;

    function dismiss() {
      if (leaving) return;
      leaving = true;
      window.clearTimeout(timer);
      markSeen();
      document.body.classList.remove('is-locked');
      splash.classList.add('is-leaving');
      splash.setAttribute('aria-hidden', 'true');
      window.setTimeout(function () {
        if (splash.parentNode) splash.parentNode.removeChild(splash);
      }, FADE);
    }

    /* 点击任意位置 / 按 Esc 可跳过 */
    splash.addEventListener('click', dismiss);
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') dismiss();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
