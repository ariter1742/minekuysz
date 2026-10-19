/* =============================================================
 * 云杉寨 · 成员名单
 * -------------------------------------------------------------
 * 支持模糊搜索（含昵称、身份、头衔）、按身份筛选、卡片 / 列表两种视图。
 * 搜索框带联想下拉，键盘上下键可选、回车直接应用。
 * 从首页 Banner 搜索跳过来时地址栏是 #/members?q=关键词，
 * 这里会自动把关键词填进搜索框并筛好。
 * 成员数据来自 data/members.js，新增成员不需要改这个文件。
 * ============================================================= */

(function () {
  'use strict';

  var CJY = (window.CJY = window.CJY || {});
  var u = CJY.util;

  CJY.pages.members = {
    title: '成员名单',

    render: function () {
      var stats = u.memberStats();

      /* 身份筛选按钮：先列出已登记的 5 个身份，再补上数据里
       * 出现的其他身份（未知身份排在最后），无需手改列表。 */
      var roleNames = u.roleNames();
      stats.list.forEach(function (member) {
        if (roleNames.indexOf(member.role) === -1) roleNames.push(member.role);
      });
      var roles = ['全部'].concat(roleNames);

      var filters = roles.map(function (role) {
        return (
          '<button type="button" class="filter-btn' + (role === '全部' ? ' is-active' : '') +
          '" data-role="' + u.esc(role) + '">' + u.esc(role) + '</button>'
        );
      }).join('');

      return (
        u.pageHead({
          eyebrow: 'MEMBERS',
          title: '云杉寨成员',
          sub: 'ROSTER · ' + stats.total + ' / ' + stats.capacity,
          desc: '按身份排列的在册成员。想加入的话，先去「加入我们」看看流程。'
        }) +
        '<section class="section section--tight"><div class="container">' +
        '<div class="member-summary">' +
        '<span>总人数 <b>' + stats.total + '</b></span>' +
        '<span>人数上限 <b>' + stats.capacity + '</b></span>' +
        '<span>管理层 <b>' + stats.management + '</b></span>' +
        '<span>普通成员 <b>' + stats.regular + '</b></span>' +
        '<span>剩余名额 <b>' + stats.remaining + '</b></span>' +
        '</div>' +

        '<div class="toolbar">' +
        '<div class="toolbar__group">' +
        '<div class="search-wrap">' +
        '<label class="search">' + u.icon('search') +
        '<input type="search" data-search placeholder="搜索昵称 / 身份 / 头衔" aria-label="搜索成员" autocomplete="off">' +
        '</label>' +
        '<div class="suggest-box" data-suggest role="listbox" aria-label="成员搜索建议"></div>' +
        '</div>' +
        '<div class="filters" data-filters>' + filters + '</div>' +
        '</div>' +
        '<div class="view-toggle" role="group" aria-label="切换视图">' +
        '<button type="button" class="is-active" data-view="card">' + u.icon('card') + '卡片</button>' +
        '<button type="button" data-view="list">' + u.icon('list') + '列表</button>' +
        '</div>' +
        '</div>' +

        '<div class="member-grid" data-member-grid></div>' +
        '</div></section>'
      );
    },

    mounted: function (root, params) {
      var grid = root.querySelector('[data-member-grid]');
      var search = root.querySelector('[data-search]');
      var filters = root.querySelector('[data-filters]');
      var suggestBox = root.querySelector('[data-suggest]');
      var toggles = root.querySelectorAll('[data-view]');
      if (!grid) return;

      var state = { keyword: '', role: '全部', view: 'card' };

      /* 从首页搜索跳过来：把关键词带进搜索框 */
      if (params && params.q) {
        state.keyword = params.q;
        if (search) search.value = params.q;
      }

      /* 名字命中优先，其次头衔 / 身份 */
      function scoreOf(member) {
        var keyword = state.keyword.trim();
        if (!keyword) return 0;
        var byName = u.fuzzyScore(member.name, keyword);
        if (byName >= 0) return byName + 1000;
        return Math.max(u.fuzzyScore(member.title, keyword), u.fuzzyScore(member.role, keyword));
      }

      function matched() {
        var keyword = state.keyword.trim();
        return u.memberList()
          .filter(function (member) {
            if (state.role !== '全部' && member.role !== state.role) return false;
            if (!keyword) return true;
            return scoreOf(member) >= 0;
          })
          .sort(function (a, b) {
            if (!keyword) return 0;
            return scoreOf(b) - scoreOf(a);
          });
      }

      function draw() {
        var all = u.memberList();
        grid.classList.toggle('is-list', state.view === 'list');

        /* 名单为空（例如刚清理完示例数据）时给出专门的提示 */
        if (!all.length) {
          grid.innerHTML =
            '<div class="member-empty">' +
            u.emptyState({
              icon: 'users',
              title: '还没有登记成员',
              desc: '在 data/members.js 里添加第一条记录，这里就会出现成员卡片。',
              tag: 'EMPTY'
            }) +
            '</div>';
          return;
        }

        var list = matched();
        if (!list.length) {
          grid.innerHTML =
            '<div class="member-empty">' +
            u.emptyState({
              icon: 'search',
              title: '没有匹配的成员',
              desc: '换个关键词，或者把身份筛选切回「全部」再试试。',
              tag: 'EMPTY'
            }) +
            '</div>';
          return;
        }
        grid.innerHTML = list.map(function (member) {
          return u.memberCard(member);
        }).join('');
      }

      if (search) {
        search.addEventListener('input', function () {
          state.keyword = search.value;
          draw();
        });
      }

      /* 联想下拉：只列成员，选中即填入关键词 */
      if (search && suggestBox) {
        u.attachSuggest({
          input: search,
          box: suggestBox,
          limit: 8,
          onPick: function (entry) {
            state.keyword = entry.label || '';
            if (search) search.value = state.keyword;
            draw();
          }
        });
      }

      if (filters) {
        filters.addEventListener('click', function (event) {
          var button = event.target.closest ? event.target.closest('[data-role]') : null;
          if (!button) return;
          state.role = button.getAttribute('data-role');
          var all = filters.querySelectorAll('.filter-btn');
          for (var i = 0; i < all.length; i++) {
            all[i].classList.toggle('is-active', all[i] === button);
          }
          draw();
        });
      }

      for (var i = 0; i < toggles.length; i++) {
        toggles[i].addEventListener('click', function (event) {
          var button = event.currentTarget;
          state.view = button.getAttribute('data-view');
          for (var j = 0; j < toggles.length; j++) {
            toggles[j].classList.toggle('is-active', toggles[j] === button);
          }
          draw();
        });
      }

      draw();
    }
  };
})();
