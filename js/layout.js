/* =============================================================
 * 云杉寨 · 页面骨架（导航 / 页脚 / 移动端菜单）
 * -------------------------------------------------------------
 * 导航与页脚的数据来自 data/site.js，页面里不重复写菜单，
 * 以后增删栏目只需要改 site.js 的 nav 数组。
 * ============================================================= */

(function () {
  'use strict';

  var CJY = (window.CJY = window.CJY || {});
  var util = CJY.util;

  function navHref(id) {
    return id === 'home' ? '#/' : '#/' + id;
  }

  function renderNav() {
    var host = document.getElementById('site-nav');
    if (!host) return;
    host.innerHTML = (CJY.site.nav || [])
      .map(function (item) {
        return (
          '<a class="nav-link" data-nav="' + util.esc(item.id) + '" href="' +
          util.esc(navHref(item.id)) + '">' + util.esc(item.label) + '</a>'
        );
      })
      .join('');
  }

  function contactLine(label, value) {
    if (!value) {
      return '<span>' + util.esc(label) + '：待补充</span>';
    }
    if (/^https?:\/\//i.test(value)) {
      return (
        '<a href="' + util.esc(value) + '" target="_blank" rel="noopener noreferrer">' +
        util.esc(label) + '</a>'
      );
    }
    return '<span>' + util.esc(label) + '：' + util.esc(value) + '</span>';
  }

  function renderFooter() {
    var host = document.getElementById('site-footer');
    if (!host) return;
    var site = CJY.site;
    var footer = site.footer || {};

    var navLinks = (site.nav || [])
      .map(function (item) {
        return '<a href="' + util.esc(navHref(item.id)) + '">' + util.esc(item.label) + '</a>';
      })
      .join('');

    host.innerHTML =
      '<div class="container">' +
      '<div class="footer-grid">' +
      '<div class="footer-brand">' +
      '<img src="assets/logo.svg" alt="云杉寨 标志" width="42" height="42" loading="lazy">' +
      '<div>' +
      '<div class="footer-brand__name">' + util.esc(site.name) + '</div>' +
      '<p class="footer-brand__desc">' + util.esc(footer.desc || site.subtitle) + '</p>' +
      '<p class="footer-brand__desc" style="margin-top:6px;color:#6f8577;">' +
      util.esc(footer.slogan || site.slogan) + '</p>' +
      '</div>' +
      '</div>' +
      '<div class="footer-col"><h4>栏目</h4>' + navLinks + '</div>' +
      '<div class="footer-col"><h4>联络</h4>' +
      contactLine('QQ 群', site.links && site.links.qq) +
      contactLine('Discord', site.links && site.links.discord) +
      contactLine('站内地图', site.links && site.links.map) +
      '</div>' +
      '</div>' +
      '<div class="footer-bottom">' +
      '<span>' + util.esc(footer.copyright || '© 云杉寨') + '</span>' +
      '<span>' + util.esc(site.version || '') + '</span>' +
      '<span class="disclaimer">' + util.esc(footer.disclaimer || '') + '</span>' +
      '</div>' +
      '</div>';
  }

  function closeMenu() {
    var header = document.getElementById('site-header');
    if (!header) return;
    header.classList.remove('is-open');
    var toggle = header.querySelector('.nav-toggle');
    if (toggle) {
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', '打开导航菜单');
    }
  }

  function setActive(id) {
    var links = document.querySelectorAll('#site-nav .nav-link');
    for (var i = 0; i < links.length; i++) {
      var link = links[i];
      var active = link.getAttribute('data-nav') === id;
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    }
    closeMenu();
  }

  function init() {
    renderNav();
    renderFooter();

    var header = document.getElementById('site-header');
    var toggle = header && header.querySelector('.nav-toggle');
    if (toggle) {
      toggle.addEventListener('click', function () {
        var open = header.classList.toggle('is-open');
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        toggle.setAttribute('aria-label', open ? '关闭导航菜单' : '打开导航菜单');
      });
    }

    /* 点击菜单外区域时收起移动端菜单 */
    document.addEventListener('click', function (event) {
      if (!header || !header.classList.contains('is-open')) return;
      if (header.contains(event.target)) return;
      closeMenu();
    });

    var navHost = document.getElementById('site-nav');
    if (navHost) {
      navHost.addEventListener('click', function (event) {
        var link = event.target.closest ? event.target.closest('a[data-nav]') : null;
        if (!link) return;
        closeMenu();
        /* 已经在该页面时，点击导航回到顶部 */
        if (CJY.state && CJY.state.route === link.getAttribute('data-nav')) {
          event.preventDefault();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
    }

    /* 左上角「logo + 云杉寨」始终回到主页 */
    var brand = document.getElementById('brand-link');
    if (brand) {
      brand.addEventListener('click', function (event) {
        if (CJY.state && CJY.state.route === 'home') {
          event.preventDefault();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
    }
  }

  CJY.layout = {
    init: init,
    setActive: setActive,
    navHref: navHref
  };
})();
