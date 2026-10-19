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
 * 每个页面都在 js/pages/ 下单独一个文件，注册到 CJY.pages。
 * ============================================================= */

(function () {
  'use strict';

  var CJY = window.CJY;
  var ROUTES = ['home', 'members', 'buildings', 'news', 'join', 'about'];

  function currentRoute() {
    var raw = window.location.hash.replace(/^#\/?/, '').replace(/\/+$/, '');
    return ROUTES.indexOf(raw) >= 0 ? raw : 'home';
  }

  function scrollToTop() {
    var html = document.documentElement;
    var previous = html.style.scrollBehavior;
    html.style.scrollBehavior = 'auto';
    window.scrollTo(0, 0);
    html.style.scrollBehavior = previous;
  }

  function render() {
    var id = currentRoute();
    var page = CJY.pages[id] || CJY.pages.home;
    var app = document.getElementById('app');
    if (!app || !page) return;

    CJY.state.route = id;
    app.innerHTML = '<div class="view">' + page.render() + '</div>';
    document.title =
      id === 'home'
        ? CJY.site.name + ' · ' + (CJY.site.tagline || '官方页面')
        : (page.title || '') + ' · ' + CJY.site.name;

    CJY.layout.setActive(id);
    if (typeof page.mounted === 'function') page.mounted(app);
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
