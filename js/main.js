/* =============================================================
 * 云杉寨 · 路由与启动
 * -------------------------------------------------------------
 * 页面用 URL 里的 # 路由切换，例如：
 *   #/            首页
 *   #/members     成员名单
 *   #/buildings   建筑展示
 *   #/news        活动公告
 *   #/join        加入我们
 *   #/about       关于云杉寨
 *
 * 路由可以带查询参数，用于跨页传递关键词，例如：
 *   #/members?q=ariter
 * 页面在 mounted(root, params) 里拿到 params。
 *
 * 每个页面都在 js/pages/ 下单独一个文件，注册到 CJY.pages。
 * ============================================================= */

(function () {
  'use strict';

  var CJY = window.CJY;
  var ROUTES = ['home', 'members', 'buildings', 'news', 'join', 'about'];

  function decode(value) {
    try {
      return decodeURIComponent(value);
    } catch (e) {
      return value;
    }
  }

  /* 把 #/members?q=xxx 拆成 { id, params, unknown } */
  function parseRoute() {
    var raw = String(window.location.hash || '').replace(/^#\/?/, '');
    var params = {};

    var at = raw.indexOf('?');
    if (at >= 0) {
      raw
        .slice(at + 1)
        .split('&')
        .forEach(function (pair) {
          if (!pair) return;
          var eq = pair.indexOf('=');
          params[decode(eq < 0 ? pair : pair.slice(0, eq))] = eq < 0 ? '' : decode(pair.slice(eq + 1));
        });
      raw = raw.slice(0, at);
    }

    raw = raw.replace(/\/+$/, '');
    var known = ROUTES.indexOf(raw) >= 0;

    return { id: known ? raw : 'home', params: params, unknown: !known && raw !== '' };
  }

  function scrollToTop() {
    var html = document.documentElement;
    var previous = html.style.scrollBehavior;
    html.style.scrollBehavior = 'auto';
    window.scrollTo(0, 0);
    html.style.scrollBehavior = previous;
  }

  function render() {
    var route = parseRoute();
    var id = route.id;

    /* #/typo 这类无效路由：页面回首页，同时把地址栏归位，
     * 免得用户点 logo / 首页导航也回不到 #/ */
    if (route.unknown) {
      try {
        window.history.replaceState(null, '', '#/');
      } catch (e) {
        /* file:// 等环境可能不支持，忽略即可 */
      }
    }

    var page = CJY.pages[id] || CJY.pages.home;
    var app = document.getElementById('app');
    if (!app || !page) return;

    CJY.state.route = id;
    if (CJY.layout && CJY.layout.setDotNav) CJY.layout.setDotNav(null);
    app.innerHTML = '<div class="view">' + page.render() + '</div>';
    document.title =
      id === 'home'
        ? CJY.site.name + ' · ' + (CJY.site.tagline || '官方页面')
        : (page.title || '') + ' · ' + CJY.site.name;

    CJY.layout.setActive(id);
    if (typeof page.mounted === 'function') page.mounted(app, route.params);
    scrollToTop();
  }

  function boot() {
    CJY.state = CJY.state || { route: 'home' };
    CJY.util.bindImageFallback();
    CJY.layout.init();
    render();
    window.addEventListener('hashchange', render);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
