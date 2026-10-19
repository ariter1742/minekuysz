/* =============================================================
 * 云杉寨 · 公共工具
 * -------------------------------------------------------------
 * 渲染页面时用到的小函数都放在这里：转义、日期格式化、成员
 * 统计、头像、图标、空状态等。页面文件只负责“拼结构”。
 * ============================================================= */

(function () {
  'use strict';

  var CJY = (window.CJY = window.CJY || {});

  /* ---------- 身份顺序与配色 ----------
   * 目前的身份标签只有这 5 个：会长 / 副会长 / 精英 / 成员 / 见习。
   * 顺序决定成员名单的排列与筛选按钮的先后；
   * 配色类名对应 css/style.css 里的 .role-chip.role-*。
   * 若以后要新增身份：这里补一项 + CSS 补一个 .role-xxx 颜色即可。
   */
  var ROLE_ORDER = {
    会长: 0,
    副会长: 1,
    精英: 2,
    成员: 3,
    见习: 4
  };

  var ROLE_CLASS = {
    会长: 'role-leader',
    副会长: 'role-deputy',
    精英: 'role-elite',
    成员: 'role-member',
    见习: 'role-trainee'
  };

  /* 计入「管理层」统计的身份 */
  var MANAGEMENT_ROLES = ['会长', '副会长'];
  /* ---------- 图标（24×24，线性风格） ---------- */
  var ICONS = {
    tree:
      '<path d="M12 2.6l4.8 7.2h-3l4.2 6.2H6l4.2-6.2h-3L12 2.6z"/><path d="M12 16v5.4"/>',
    grid:
      '<rect x="3.2" y="3.2" width="7.2" height="7.2" rx="1"/><rect x="13.6" y="3.2" width="7.2" height="7.2" rx="1"/><rect x="3.2" y="13.6" width="7.2" height="7.2" rx="1"/><rect x="13.6" y="13.6" width="7.2" height="7.2" rx="1"/>',
    users:
      '<circle cx="9" cy="8" r="3.2"/><path d="M2.6 19.8c0-3.5 2.9-5.5 6.4-5.5s6.4 2 6.4 5.5"/><path d="M16.2 5.6a3 3 0 0 1 0 5.6"/><path d="M18 14.6c2.1.6 3.4 2.1 3.4 4.4"/>',
    search: '<circle cx="11" cy="11" r="6.4"/><path d="M15.8 15.8L21 21"/>',
    card:
      '<rect x="3.2" y="4.4" width="17.6" height="6" rx="1.4"/><rect x="3.2" y="13.6" width="17.6" height="6" rx="1.4"/>',
    list: '<path d="M4 6.5h16M4 12h16M4 17.5h16"/>',
    box:
      '<path d="M12 3l8.4 4.4v9.2L12 21l-8.4-4.4V7.4L12 3z"/><path d="M3.8 7.6L12 12l8.2-4.4M12 12v8.8"/>',
    mail:
      '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3.6 6.6L12 12.8l8.4-6.2"/>',
    pin:
      '<path d="M12 21s7-6.1 7-11a7 7 0 1 0-14 0c0 4.9 7 11 7 11z"/><circle cx="12" cy="10" r="2.6"/>',
    calendar:
      '<rect x="3.4" y="5" width="17.2" height="15" rx="2"/><path d="M3.4 10h17.2M8 3v4M16 3v4"/>'
  };

  function icon(name, className) {
    var body = ICONS[name] || ICONS.box;
    return (
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" ' +
      'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"' +
      (className ? ' class="' + className + '"' : '') +
      '>' + body + '</svg>'
    );
  }

  /* ---------- 基础工具 ---------- */
  function esc(value) {
    return String(value === null || value === undefined ? '' : value).replace(
      /[&<>"']/g,
      function (ch) {
        return {
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#39;'
        }[ch];
      }
    );
  }

  /* 2025-08-16 → 2025.08 */
  function fmtMonth(iso) {
    if (!iso) return '—';
    var m = String(iso).match(/(\d{4})[-./](\d{1,2})/);
    return m ? m[1] + '.' + ('0' + m[2]).slice(-2) : String(iso);
  }

  /* 2026-06-20 → 2026.06.20 */
  function fmtDate(iso) {
    if (!iso) return '—';
    return String(iso).replace(/[-/]/g, '.');
  }

  function nicknameInitial(name) {
    var text = String(name || '').trim();
    if (!text) return '云';
    return /[a-zA-Z]/.test(text.charAt(0)) ? text.charAt(0).toUpperCase() : text.charAt(0);
  }

  function roleClass(role) {
    return ROLE_CLASS[role] || '';
  }

  function roleWeight(role) {
    return Object.prototype.hasOwnProperty.call(ROLE_ORDER, role) ? ROLE_ORDER[role] : 9;
  }

  /* 按职位顺序返回已登记的身份名称 */
  function roleNames() {
    return Object.keys(ROLE_ORDER).sort(function (a, b) {
      return ROLE_ORDER[a] - ROLE_ORDER[b];
    });
  }

  /* ---------- 成员数据 ---------- */
  function memberList() {
    var raw = CJY.members || [];
    return raw
      .map(function (m, i) {
        var copy = {};
        for (var key in m) {
          if (Object.prototype.hasOwnProperty.call(m, key)) copy[key] = m[key];
        }
        copy.role = copy.role || '成员';
        copy.id = copy.id || ('0' + (i + 1)).slice(-2);
        return copy;
      })
      .sort(function (a, b) {
        /* 现代浏览器 sort 稳定：同职位保持 data/members.js 里的先后顺序 */
        return roleWeight(a.role) - roleWeight(b.role);
      });
  }

  function memberStats() {
    var list = memberList();
    var total = list.length;
    var capacity = Number(CJY.site && CJY.site.capacity) || 0;
    var management = list.filter(function (m) {
      return MANAGEMENT_ROLES.indexOf(m.role) >= 0;
    }).length;
    return {
      list: list,
      total: total,
      capacity: capacity,
      remaining: Math.max(capacity - total, 0),
      management: management,
      regular: total - management,
      percent: capacity ? Math.round((total / capacity) * 100) : 0
    };
  }

  function avatarHtml(member) {
    var initial = nicknameInitial(member.name);
    /* 首字头像默认显示在底层；头像图片加载完成后淡入覆盖，失败则一直显示首字 */
    var fallback = '<span class="avatar__fallback">' + esc(initial) + '</span>';
    var img = member.avatar
      ? '<img class="js-avatar-img" src="' + esc(member.avatar) + '" alt="' + esc(member.name) +
        ' 的头像" loading="lazy" decoding="async">'
      : '';
    return '<div class="avatar">' + img + fallback + '</div>';
  }

  function memberCard(member) {
    var chip = member.role
      ? '<span class="role-chip ' + roleClass(member.role) + '">' + esc(member.role) + '</span>'
      : '';
    return (
      '<article class="member-card">' +
      '<div class="member-top">' +
      avatarHtml(member) +
      '<div class="member-id">' +
      '<div class="member-name">' + esc(member.name) + chip + '</div>' +
      '<div class="member-title">' + esc(member.title || '寨内成员') + '</div>' +
      '</div>' +
      '</div>' +
      '<div class="member-meta"><span>#' + esc(member.id) + '</span></div>' +
      '</article>'
    );
  }

  /* 头像加载：成功后才淡入显示，失败则切到首字占位图。
   * 图片在加载完成前保持透明，避免缺图时闪出破图图标和 alt 文字。 */
  function bindImageFallback() {
    document.addEventListener(
      'load',
      function (event) {
        var img = event.target;
        if (!img || img.tagName !== 'IMG' || !img.classList.contains('js-avatar-img')) return;
        img.classList.add('is-loaded');
        if (img.parentNode) img.parentNode.classList.add('is-loaded');
      },
      true
    );

    document.addEventListener(
      'error',
      function (event) {
        var img = event.target;
        if (!img || img.tagName !== 'IMG' || !img.classList.contains('js-avatar-img')) return;
        /* 加载失败：保留底层的首字头像，直接移除破图 */
        img.hidden = true;
      },
      true
    );
  }

  /* ---------- 版面小部件 ---------- */
  function capacityBar() {
    var s = memberStats();
    var pct = Math.min(s.percent, 100);
    return (
      '<div class="capacity">' +
      '<div class="capacity__head"><span>已加入 <b>' + s.total + '</b> / ' + s.capacity + ' 人</span>' +
      '<span>' + s.percent + '%</span></div>' +
      '<div class="capacity__bar"><i style="width:' + pct + '%"></i></div>' +
      '</div>'
    );
  }

  function emptyState(opts) {
    return (
      '<div class="empty">' +
      icon(opts.icon || 'box', 'empty__glyph') +
      '<h3>' + esc(opts.title) + '</h3>' +
      '<p>' + esc(opts.desc) + '</p>' +
      (opts.tag ? '<span class="empty__tag">' + esc(opts.tag) + '</span>' : '') +
      '</div>'
    );
  }

  /* 作品卡片（建筑展示 / 首页） */
  function workCard(work) {
    var tags =
      work.tags && work.tags.length
        ? '<div class="work__tags">' +
          work.tags
            .map(function (t) {
              return '<span>' + esc(t) + '</span>';
            })
            .join('') +
          '</div>'
        : '';
    var media = work.image
      ? '<div class="work__media"><img src="' + esc(work.image) + '" alt="' + esc(work.title) +
        '" decoding="async"></div>'
      : '';
    return (
      '<article class="work">' +
      media +
      '<div class="work__body">' +
      '<h3 class="work__title">' + esc(work.title) + '</h3>' +
      (work.desc ? '<p class="work__desc">' + esc(work.desc) + '</p>' : '') +
      tags +
      '<div class="work__meta"><span>' + esc(work.author || '云杉寨') + '</span><span>' +
      esc(fmtDate(work.date)) + '</span></div>' +
      '</div></article>'
    );
  }

  /* 预留空槽：内容尚未收录，但位置保留 */
  function workSlot(text) {
    return (
      '<div class="work-slot"><div><strong>位置待补充</strong>' +
      esc(text || '这里留给下一件作品') +
      '</div></div>'
    );
  }

  /* 公告条目 */
  function announcementItem(item) {
    return (
      '<article class="news-item">' +
      '<div class="news-item__date">' + esc(fmtDate(item.date)) + '</div>' +
      '<div><h3 class="news-item__title">' + esc(item.title) + '</h3>' +
      (item.desc ? '<p class="news-item__desc">' + esc(item.desc) + '</p>' : '') +
      '</div>' +
      (item.tag ? '<span class="news-item__tag">' + esc(item.tag) + '</span>' : '') +
      '</article>'
    );
  }

  function sectionHead(opts) {
    var link = opts.link
      ? '<a class="section-link" href="' + esc(opts.link.href) + '">' + esc(opts.link.label) + '</a>'
      : '';
    return (
      '<div class="section-head">' +
      '<div class="section-head__main">' +
      (opts.eyebrow ? '<span class="eyebrow">' + esc(opts.eyebrow) + '</span>' : '') +
      '<h2 class="section-title">' + esc(opts.title) +
      (opts.sub ? '<small>' + esc(opts.sub) + '</small>' : '') +
      '</h2>' +
      (opts.desc ? '<p class="section-desc">' + esc(opts.desc) + '</p>' : '') +
      '</div>' + link +
      '</div>'
    );
  }

  function pageHead(opts) {
    return (
      '<header class="page-head"><div class="container">' +
      '<span class="eyebrow">' + esc(opts.eyebrow || '云杉寨') + '</span>' +
      '<h1>' + esc(opts.title) + (opts.sub ? '<small>' + esc(opts.sub) + '</small>' : '') + '</h1>' +
      (opts.desc ? '<p class="page-head__desc">' + esc(opts.desc) + '</p>' : '') +
      '</div></header>'
    );
  }

  /* ---------- 导出 ---------- */
  CJY.util = {
    esc: esc,
    fmtMonth: fmtMonth,
    fmtDate: fmtDate,
    nicknameInitial: nicknameInitial,
    roleClass: roleClass,
    roleWeight: roleWeight,
    roleNames: roleNames,
    memberList: memberList,
    memberStats: memberStats,
    avatarHtml: avatarHtml,
    memberCard: memberCard,
    bindImageFallback: bindImageFallback,
    capacityBar: capacityBar,
    emptyState: emptyState,
    workCard: workCard,
    workSlot: workSlot,
    announcementItem: announcementItem,
    sectionHead: sectionHead,
    pageHead: pageHead,
    icon: icon
  };

  CJY.pages = {};
})();
