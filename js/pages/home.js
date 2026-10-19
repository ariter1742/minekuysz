/* =============================================================
 * 云杉寨 · 首页
 * -------------------------------------------------------------
 * 由公告条、Banner（含全站搜索）、数据目标卡、关于我们、建筑展示、
 * 荣誉·里程碑、成员墙、活动公告、加入入口组成。
 * 所有内容都从 data/ 下的文件读取，改数据即可。
 * ============================================================= */

(function () {
  'use strict';

  var CJY = (window.CJY = window.CJY || {});
  var u = CJY.util;

  /* 右侧点导航锚定的区块，顺序即点的顺序 */
  var SECTIONS = [
    { id: 'sec-top', label: '顶部' },
    { id: 'sec-about', label: '关于我们' },
    { id: 'sec-buildings', label: '建筑展示' },
    { id: 'sec-honors', label: '荣誉里程碑' },
    { id: 'sec-members', label: '成员墙' },
    { id: 'sec-news', label: '活动公告' },
    { id: 'sec-join', label: '加入我们' }
  ];

  function banner(site) {
    return (
      '<section class="banner" id="sec-top">' +
      '<div class="banner-inner">' +
      '<img class="banner-logo" src="assets/logo.png" alt="云杉寨 标志" width="118" height="118">' +
      '<div class="banner-text">' +
      (site.hero.badge ? '<span class="banner-badge">' + u.esc(site.hero.badge) + '</span>' : '') +
      '<h1 class="banner-title">' + u.esc(site.name) + '</h1>' +
      '<p class="banner-sub">' + u.esc(site.slogan) + '</p>' +
      '<p class="banner-desc">' + u.esc(site.hero.desc) + '</p>' +
      '<p class="banner-meta">' + u.esc(site.nameEn) + ' · ' + u.esc(site.version || '') +
      ' · EST. ' + u.esc(String(site.established || '').slice(0, 4)) + '</p>' +
      '<div class="banner-search-wrap">' +
      '<div class="banner-search">' +
      u.icon('search') +
      '<input type="search" id="home-search" placeholder="搜索成员 / 建筑 / 里程碑…" aria-label="全站搜索" autocomplete="off">' +
      '<button type="button" id="home-search-btn">搜索</button>' +
      '</div>' +
      '<div class="suggest-box" id="home-suggest" role="listbox" aria-label="搜索建议"></div>' +
      '</div>' +
      '</div>' +
      '</div></section>'
    );
  }

  function goalCards(site, stats, works) {
    var buildingGoal = Number(site.goals && site.goals.buildings) || 0;
    return (
      '<div class="goal-grid">' +
      u.goalCard({
        icon: 'users',
        label: '在册成员',
        value: stats.total,
        total: stats.capacity,
        unit: '人',
        foot: '目标 ' + stats.capacity + ' 人'
      }) +
      u.goalCard({
        icon: 'grid',
        label: '建筑收录',
        value: works.length,
        total: buildingGoal,
        unit: '件',
        foot: buildingGoal ? '目标 ' + buildingGoal + ' 件' : '目标待补充'
      }) +
      u.logoCard() +
      '</div>'
    );
  }

  function aboutBlock(site) {
    var paragraphs = (site.about.paragraphs || []).slice(0, 2);
    var media = site.hero && site.hero.image
      ? '<div class="about-card__media"><img src="' + u.esc(site.hero.image) + '" alt="' +
        u.esc(site.hero.imageAlt || site.name + '驻地全景') + '" loading="lazy" decoding="async"></div>'
      : '';

    return (
      '<section class="section section--tight" id="sec-about">' +
      '<div class="container">' +
      u.sectionHead({
        icon: 'tree',
        eyebrow: 'ABOUT US',
        title: '关于我们',
        sub: 'SPRUCE HOLLOW',
        desc: site.about.desc,
        link: { href: '#/about', label: '完整介绍' }
      }) +
      '<div class="about-card">' +
      '<div class="about-card__body">' +
      paragraphs.map(function (text) {
        return '<p>' + u.esc(text) + '</p>';
      }).join('') +
      '<div class="about-card__actions">' +
      '<a class="btn btn--primary" href="#/join">加入云杉寨</a>' +
      '<a class="btn btn--ghost" href="#/members">查看成员名单</a>' +
      '</div>' +
      '</div>' + media +
      '</div>' +
      '</div></section>'
    );
  }

  function buildingsBlock(works) {
    var gallery = works.slice(0, 3).map(function (work) {
      return u.workCard(work);
    }).join('');
    for (var i = works.slice(0, 3).length; i < 3; i++) {
      gallery += u.workSlot('等下一件作品入档');
    }
    return (
      '<section class="section" id="sec-buildings">' +
      '<div class="container">' +
      u.sectionHead({
        icon: 'grid',
        eyebrow: 'BUILDINGS',
        title: '建筑展示',
        sub: 'WORKS · ' + works.length + ' ENTRIES',
        desc: '公共建筑、私人小屋与驻地全景，慢慢补全。',
        link: { href: '#/buildings', label: '查看全部' }
      }) +
      '<div class="gallery">' + gallery + '</div>' +
      '</div></section>'
    );
  }

  function honorsBlock(site, milestones) {
    return (
      '<section class="section section--tight" id="sec-honors">' +
      '<div class="container">' +
      u.sectionHead({
        icon: 'trophy',
        eyebrow: 'MILESTONES',
        title: '云杉寨荣誉 · 里程碑',
        sub: 'SINCE ' + u.esc(u.fmtMonth(site.established)),
        desc: '一个寨子是怎么长出来的：从选地、立门到成员扩展。',
        link: { href: '#/about', label: '更多' }
      }) +
      '<div class="honor-grid">' +
      milestones.map(function (item) {
        return u.honorCard(item);
      }).join('') +
      '</div>' +
      '</div></section>'
    );
  }

  function membersBlock(stats) {
    var wall = stats.list.slice(0, 8).map(function (m) {
      return u.memberCard(m);
    }).join('');

    var body = wall
      ? '<div class="member-grid member-grid--wall">' + wall + '</div>'
      : u.emptyState({
          icon: 'users',
          title: '成员名单待补充',
          desc: '在 data/members.js 添加成员后，这里会自动出现成员墙。',
          tag: 'EMPTY'
        });

    return (
      '<section class="section" id="sec-members">' +
      '<div class="container">' +
      u.sectionHead({
        icon: 'users',
        eyebrow: 'MEMBERS',
        title: '成员墙',
        sub: '在册 ' + stats.total + ' / ' + stats.capacity + ' 人',
        desc: '来自不同时段的玩家，在这里一起把寨子建起来。',
        link: { href: '#/members', label: '查看全部' }
      }) +
      body +
      '</div></section>'
    );
  }

  function newsBlock(news) {
    var body = news.length
      ? '<div class="news-list">' + news.slice(0, 3).map(function (item) {
          return u.announcementItem(item);
        }).join('') + '</div>'
      : u.emptyState({
          icon: 'calendar',
          title: '公告整理中',
          desc: '云杉寨还没有发布成文的公告，活动与公共工程排期会先在社区群里同步，这里的栏目先留着。',
          tag: 'COMING SOON'
        });

    return (
      '<section class="section section--tight" id="sec-news">' +
      '<div class="container">' +
      u.sectionHead({
        icon: 'calendar',
        eyebrow: 'NEWS',
        title: '活动公告',
        sub: 'ANNOUNCEMENTS',
        desc: '公共工程排期、服务器活动与寨内通知。',
        link: { href: '#/news', label: '查看全部' }
      }) +
      body +
      '</div></section>'
    );
  }

  function joinBlock() {
    return (
      '<section class="section section--tight" id="sec-join">' +
      '<div class="container">' +
      '<div class="callout">' +
      '<div><h3>想在这里盖自己的第一栋房子？</h3>' +
      '<p>名额有限，先来聊聊你的上线时间和想做的事。</p></div>' +
      '<a class="btn btn--primary" href="#/join">了解加入方式</a>' +
      '</div></div></section>'
    );
  }

  CJY.pages.home = {
    title: '首页',

    render: function () {
      var site = CJY.site;
      var stats = u.memberStats();
      var works = CJY.buildings || [];
      var news = CJY.announcements || [];
      var milestones = CJY.milestones || [];

      return (
        '<div class="container">' +
        u.noticeBar() +
        banner(site) +
        goalCards(site, stats, works) +
        '</div>' +
        aboutBlock(site) +
        buildingsBlock(works) +
        honorsBlock(site, milestones) +
        membersBlock(stats) +
        newsBlock(news) +
        joinBlock()
      );
    },

    mounted: function (root) {
      /* 侧边点导航 */
      if (CJY.layout && CJY.layout.setDotNav) CJY.layout.setDotNav(SECTIONS);

      /* Banner 内嵌搜索：输入时出联想，回车/点按钮跳到成员页并带上关键词 */
      var input = root.querySelector('#home-search');
      var box = root.querySelector('#home-suggest');
      var btn = root.querySelector('#home-search-btn');

      function goMembers() {
        var keyword = input ? input.value.trim() : '';
        if (!keyword) return;
        if (input && input._closeSuggest) input._closeSuggest();
        window.location.hash = '#/members?q=' + encodeURIComponent(keyword);
      }

      if (input && box) {
        u.attachSuggest({
          input: input,
          box: box,
          limit: 8,
          onPick: function (entry) {
            window.location.hash = String(entry.href || '').replace(/^#/, '');
          },
          onEnter: goMembers
        });
      }

      if (btn) btn.addEventListener('click', goMembers);
    }
  };
})();
