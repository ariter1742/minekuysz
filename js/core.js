/* =============================================================
 * 云杉寨 · 公共工具
 * -------------------------------------------------------------
 * 渲染页面时用到的小函数都放在这里：转义、日期格式化、成员
 * 统计、头像、图标、搜索、空状态等。页面文件只负责“拼结构”。
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
      '<rect x="3.4" y="5" width="17.2" height="15" rx="2"/><path d="M3.4 10h17.2M8 3v4M16 3v4"/>',
    home:
      '<path d="M3.4 10.6L12 3.6l8.6 7"/><path d="M5.8 9.4V20h12.4V9.4"/><path d="M9.8 20v-5.4h4.4V20"/>',
    trophy:
      '<path d="M8 3.6h8v5.2a4 4 0 0 1-8 0V3.6z"/><path d="M8 5.4H5.2v1.4A3.2 3.2 0 0 0 8 10"/><path d="M16 5.4h2.8v1.4A3.2 3.2 0 0 1 16 10"/><path d="M12 12.8V17"/><path d="M8.4 20.4h7.2"/>',
    clock: '<circle cx="12" cy="12" r="8.4"/><path d="M12 7.6V12l3.2 2"/>',
    pen:
      '<path d="M4 20l4.4-1.2 9.6-9.6a2 2 0 0 0 0-2.8l-.6-.6a2 2 0 0 0-2.8 0L5.2 15.6 4 20z"/><path d="M14.6 6.6l2.8 2.8"/>',
    sparkle:
      '<path d="M12 3.4l1.9 5.1 5.1 1.9-5.1 1.9L12 17.4l-1.9-5.1L5 10.4l5.1-1.9L12 3.4z"/>',
    hammer:
      '<path d="M14.4 4.4l5.2 5.2-2.2 2.2-5.2-5.2z"/><path d="M12 6.8l-7.4 7.4a1.8 1.8 0 0 0 0 2.6l1.6 1.6a1.8 1.8 0 0 0 2.6 0L16.4 11"/>',
    compass:
      '<circle cx="12" cy="12" r="8.4"/><path d="M15.6 8.4l-2.1 5-5 2.1 2.1-5 5-2.1z"/>',
    bell:
      '<path d="M18 16.4V11a6 6 0 1 0-12 0v5.4L4.4 18.4h15.2L18 16.4z"/><path d="M10 20.6a2.2 2.2 0 0 0 4 0"/>'
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
      percent: capacity ? Math.min(Math.round((total / capacity) * 100), 100) : 0
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

  /* ---------- 模糊搜索 ----------
   * 先找连续子串（越靠前分越高），找不到再做「顺序子序列」匹配，
   * 这样 "twb" 也能命中 "TheWindBlows2025"。返回 -1 表示不匹配。
   */
  function fuzzyScore(haystack, needle) {
    var h = String(haystack === null || haystack === undefined ? '' : haystack).toLowerCase();
    var n = String(needle === null || needle === undefined ? '' : needle).trim().toLowerCase();
    if (!n) return 0;
    if (!h) return -1;

    var at = h.indexOf(n);
    if (at >= 0) return 1000 - at;

    var cursor = 0;
    var score = 0;
    var streak = 0;
    for (var i = 0; i < n.length; i++) {
      var found = h.indexOf(n.charAt(i), cursor);
      if (found < 0) return -1;
      streak = found === cursor ? streak + 1 : 0;
      score += 1 + streak;
      cursor = found + 1;
    }
    return score;
  }

  /* 全站可搜索的内容：成员 / 建筑 / 里程碑 */
  function searchEntries() {
    var out = [];

    memberList().forEach(function (m) {
      out.push({
        kind: '成员',
        label: m.name,
        sub: [m.role, m.title].filter(Boolean).join(' · '),
        href: '#/members?q=' + encodeURIComponent(m.name),
        text: [m.name, m.role, m.title].join(' ')
      });
    });

    (CJY.buildings || []).forEach(function (w) {
      out.push({
        kind: '建筑',
        label: w.title,
        sub: [w.author, fmtDate(w.date)].filter(Boolean).join(' · '),
        href: '#/buildings',
        text: [w.title, w.desc, (w.tags || []).join(' ')].join(' ')
      });
    });

    (CJY.milestones || []).forEach(function (ms) {
      out.push({
        kind: '里程碑',
        label: ms.title,
        sub: ms.date,
        href: '#/about',
        text: [ms.title, ms.desc, ms.date].join(' ')
      });
    });

    return out;
  }

  function searchAll(keyword, limit) {
    var n = String(keyword || '').trim();
    if (!n) return [];
    return searchEntries()
      .map(function (entry) {
        return { entry: entry, score: fuzzyScore(entry.text, n), labelScore: fuzzyScore(entry.label, n) };
      })
      .filter(function (x) {
        return x.score >= 0;
      })
      .sort(function (a, b) {
        return b.labelScore - a.labelScore || b.score - a.score;
      })
      .slice(0, limit || 8)
      .map(function (x) {
        return x.entry;
      });
  }

  function suggestItem(entry) {
    return (
      '<button type="button" class="suggest-item" data-href="' + esc(entry.href) + '">' +
      '<span class="suggest-item__kind">' + esc(entry.kind) + '</span>' +
      '<span class="suggest-item__label">' + esc(entry.label) + '</span>' +
      (entry.sub ? '<span class="suggest-item__sub">' + esc(entry.sub) + '</span>' : '') +
      '</button>'
    );
  }

  /* 当前活跃的联想框。同一时刻只会有一个，点击外部统一在下面的
   * 全局监听里收起，避免每渲染一次页面就往 document 上挂一个新监听。 */
  var activeSuggest = null;

  document.addEventListener('click', function (event) {
    if (!activeSuggest) return;
    var input = activeSuggest.input;
    var box = activeSuggest.box;
    if (input && input.contains(event.target)) return;
    if (box && box.contains(event.target)) return;
    activeSuggest.close();
  });

  /* 把输入框 + 联想下拉接起来。
   *   opts.input   输入框元素
   *   opts.box     下拉容器（.suggest-box）
   *   opts.limit   最多几条，默认 8
   *   opts.onPick  选中某条时的回调，参数为 { href, label }
   *   opts.onEnter 直接回车时（无高亮项）的回调，参数为关键词
   */
  function attachSuggest(opts) {
    var input = opts.input;
    var box = opts.box;
    if (!input || !box) return;

    var items = [];
    var active = -1;

    if (activeSuggest && activeSuggest.close) activeSuggest.close();

    function close() {
      box.classList.remove('is-open');
      box.innerHTML = '';
      items = [];
      active = -1;
    }

    function paint() {
      var nodes = box.querySelectorAll('.suggest-item');
      for (var i = 0; i < nodes.length; i++) {
        nodes[i].classList.toggle('is-active', i === active);
      }
    }

    function move(step) {
      if (!items.length) return;
      active = (active + step + items.length) % items.length;
      paint();
    }

    function pick(index) {
      var entry = items[index];
      if (!entry) {
        if (opts.onEnter) opts.onEnter(input.value);
        return;
      }
      close();
      if (opts.onPick) opts.onPick(entry);
      else window.location.hash = String(entry.href || '').replace(/^#/, '');
    }

    function refresh() {
      var keyword = input.value.trim();
      if (!keyword) {
        close();
        return;
      }
      items = searchAll(keyword, opts.limit || 8);
      if (!items.length) {
        box.innerHTML = '<div class="suggest-empty">没有匹配的内容</div>';
        box.classList.add('is-open');
        return;
      }
      box.innerHTML = items.map(suggestItem).join('');
      box.classList.add('is-open');
      active = -1;
    }

    input.addEventListener('input', refresh);
    input.addEventListener('focus', function () {
      if (input.value.trim()) refresh();
    });

    input.addEventListener('keydown', function (event) {
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        move(1);
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        move(-1);
      } else if (event.key === 'Enter') {
        event.preventDefault();
        if (active >= 0) pick(active);
        else if (opts.onEnter) opts.onEnter(input.value);
      } else if (event.key === 'Escape') {
        close();
        input.blur();
      }
    });

    box.addEventListener('click', function (event) {
      var button = event.target.closest ? event.target.closest('.suggest-item') : null;
      if (!button) return;
      var all = Array.prototype.slice.call(box.querySelectorAll('.suggest-item'));
      var index = all.indexOf(button);
      if (index >= 0) pick(index);
    });

    input._closeSuggest = close;
    activeSuggest = { input: input, box: box, close: close };
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

  /* 公告条：site.notice 有内容就用它，否则按剩余名额自动生成 */
  function noticeBar() {
    var site = CJY.site || {};
    var text = String(site.notice || '').trim();
    if (!text) {
      var s = memberStats();
      text =
        s.remaining > 0
          ? '欢迎来到' + site.name + '官网！当前还剩 ' + s.remaining + ' 个名额，想加入的可以先看看「加入我们」里的流程。'
          : '欢迎来到' + site.name + '官网！在册成员已达上限（' + s.total + ' / ' +
            s.capacity + '），空出位置后会重新开放申请。';
    }
    return (
      '<div class="notice-bar">' +
      '<span class="notice-bar__icon">' + icon('bell') + '</span>' +
      '<div class="notice-bar__text">' + esc(text) + '</div>' +
      '</div>'
    );
  }

  /* 带目标进度的统计卡 */
  function goalCard(opts) {
    var total = Number(opts.total) || 0;
    var value = Number(opts.value) || 0;
    var pct = total ? Math.min(Math.round((value / total) * 100), 100) : 0;
    return (
      '<article class="goal-card">' +
      '<div class="goal-card__head">' +
      '<span class="goal-card__label">' + icon(opts.icon || 'box') + esc(opts.label) + '</span>' +
      '<span class="goal-card__value">' + value +
      '<small> / ' + total + ' ' + esc(opts.unit || '') + '</small></span>' +
      '</div>' +
      '<div class="goal-card__bar"><i style="width:' + pct + '%"></i></div>' +
      '<div class="goal-card__foot">' + esc(opts.foot || '') + '</div>' +
      '</article>'
    );
  }

  /* logo 装饰卡：白底 logo 放在白卡上，方边自然消失 */
  function logoCard() {
    return (
      '<div class="logo-card">' +
      '<img src="assets/logo.png" alt="云杉寨 标志" width="132" height="132" loading="lazy" decoding="async">' +
      '</div>'
    );
  }

  /* 荣誉 / 里程碑卡片 */
  function honorCard(item) {
    return (
      '<article class="honor-card">' +
      '<div class="honor-card__icon">' + icon(item.icon || 'trophy') + '</div>' +
      '<div class="honor-card__date">' + esc(item.date) + '</div>' +
      '<h3 class="honor-card__title">' + esc(item.title) + '</h3>' +
      (item.desc ? '<p class="honor-card__desc">' + esc(item.desc) + '</p>' : '') +
      '</article>'
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
        '" loading="lazy" decoding="async"></div>'
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
    var titleIcon = opts.icon ? icon(opts.icon) : '';
    return (
      '<div class="section-head">' +
      '<div class="section-head__main">' +
      (opts.eyebrow ? '<span class="eyebrow">' + esc(opts.eyebrow) + '</span>' : '') +
      '<h2 class="section-title">' + titleIcon +
      '<span class="section-title__text">' + esc(opts.title) +
      (opts.sub ? '<small>' + esc(opts.sub) + '</small>' : '') +
      '</span></h2>' +
      (opts.desc ? '<p class="section-desc">' + esc(opts.desc) + '</p>' : '') +
      '</div>' + link +
      '</div>'
    );
  }

  function pageHead(opts) {
    return (
      '<div class="container"><header class="page-head">' +
      '<span class="eyebrow">' + esc(opts.eyebrow || '云杉寨') + '</span>' +
      '<h1>' + esc(opts.title) + (opts.sub ? '<small>' + esc(opts.sub) + '</small>' : '') + '</h1>' +
      (opts.desc ? '<p class="page-head__desc">' + esc(opts.desc) + '</p>' : '') +
      '</header></div>'
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
    fuzzyScore: fuzzyScore,
    searchEntries: searchEntries,
    searchAll: searchAll,
    attachSuggest: attachSuggest,
    capacityBar: capacityBar,
    noticeBar: noticeBar,
    goalCard: goalCard,
    logoCard: logoCard,
    honorCard: honorCard,
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
