/* =============================================================
 * 云杉寨 · 首页
 * -------------------------------------------------------------
 * 首页由 Hero、数据条、关于、成员墙、建筑展示、公告、大事记、
 * 加入入口组成。所有内容都从 data/ 下的文件读取，改数据即可。
 * ============================================================= */

(function () {
  'use strict';

  var CJY = (window.CJY = window.CJY || {});
  var u = CJY.util;

  function featureCard(item) {
    return (
      '<article class="feature">' +
      '<div class="feature__icon">' + u.icon(item.icon || 'grid') + '</div>' +
      '<h3>' + u.esc(item.title) + '</h3>' +
      '<p>' + u.esc(item.desc) + '</p>' +
      '</article>'
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

      /* ---------- Hero ---------- */
      var hero =
        '<section class="hero">' +
        '<div class="hero__media"><img src="' + u.esc(site.hero.image) + '" alt="' +
        u.esc(site.hero.imageAlt) + '"></div>' +
        '<div class="hero__scrim"></div>' +
        '<div class="container"><div class="hero__inner">' +
        '<div class="hero__copy">' +
        '<span class="hero__badge"><span class="dot"></span>' + u.esc(site.hero.badge) + '</span>' +
        '<h1 class="hero__title">' + u.esc(site.name) +
        '<span class="hero__title-en">' + u.esc(site.nameEn) + '</span></h1>' +
        '<p class="hero__slogan">' + u.esc(site.slogan) + '</p>' +
        '<p class="hero__desc">' + u.esc(site.hero.desc) + '</p>' +
        '<div class="hero__actions">' +
        '<a class="btn btn--primary" href="#/join">加入云杉寨</a>' +
        '<a class="btn btn--ghost" href="#/members">查看成员名单</a>' +
        '</div>' +
        '</div>' +
        '<div class="hero__emblem" aria-hidden="true">' +
        '<span class="ring ring--1"></span><span class="ring ring--2"></span>' +
        '<span class="ring ring--3"></span>' +
        '<img src="assets/logo.svg" alt="">' +
        '<span class="hero__emblem-caption">' + u.esc(site.hero.emblemCaption) + '</span>' +
        '</div>' +
        '</div></div></section>';

      /* ---------- 数据条 ---------- */
      var statsBlock =
        '<section class="section section--tight"><div class="container">' +
        '<div class="stats-strip">' +
        '<div class="stat"><div class="stat__value">' + stats.total +
        '<em>/ ' + stats.capacity + ' 人</em></div><div class="stat__label">在册成员</div></div>' +
        '<div class="stat"><div class="stat__value">' + stats.remaining +
        '<em>个名额</em></div><div class="stat__label">当前剩余</div></div>' +
        '<div class="stat"><div class="stat__value">' + works.length +
        '<em>件作品</em></div><div class="stat__label">建筑展示</div></div>' +
        '<div class="stat"><div class="stat__value">' + u.esc(u.fmtMonth(site.established)) +
        '<em>成立</em></div><div class="stat__label">建寨时间</div></div>' +
        '</div>' +
        u.capacityBar() +
        '</div></section>';

      /* ---------- 关于 ---------- */
      var aboutBlock =
        '<section class="section"><div class="container">' +
        u.sectionHead({
          eyebrow: site.about.eyebrow,
          title: site.about.title,
          sub: 'SPRUCE HOLLOW',
          desc: site.about.desc,
          link: { href: '#/about', label: '完整介绍' }
        }) +
        '<div class="features">' + site.about.features.map(featureCard).join('') + '</div>' +
        '</div></section>';

      /* ---------- 成员墙 ---------- */
      var wall = stats.list.slice(0, 8).map(function (m) {
        return u.memberCard(m);
      }).join('');

      var wallBody = wall
        ? '<div class="member-grid member-grid--wall">' + wall + '</div>'
        : u.emptyState({
            icon: 'users',
            title: '成员名单待补充',
            desc: '在 data/members.js 添加成员后，这里会自动出现成员墙。',
            tag: 'EMPTY'
          });

      var memberBlock =
        '<section class="section"><div class="container">' +
        u.sectionHead({
          eyebrow: 'MEMBERS',
          title: '成员墙',
          sub: '在册 ' + stats.total + ' 人',
          desc: '来自不同时段的玩家，在这里一起把寨子建起来。',
          link: { href: '#/members', label: '查看全部' }
        }) +
        wallBody +
        '</div></section>';

      /* ---------- 建筑展示 ---------- */
      var gallery = works.slice(0, 3).map(function (work) {
        return u.workCard(work);
      }).join('');
      for (var i = works.length; i < 3; i++) {
        gallery += u.workSlot('等下一件作品入档');
      }

      var buildingBlock =
        '<section class="section"><div class="container">' +
        u.sectionHead({
          eyebrow: 'BUILDINGS',
          title: '建筑展示',
          sub: 'WORKS',
          desc: '公共建筑、私人小屋与驻地全景，慢慢补全。',
          link: { href: '#/buildings', label: '查看全部' }
        }) +
        '<div class="gallery">' + gallery + '</div>' +
        '</div></section>';

      /* ---------- 公告 ---------- */
      var newsBody = news.length
        ? '<div class="news-list">' + news.slice(0, 3).map(function (item) {
            return u.announcementItem(item);
          }).join('') + '</div>'
        : u.emptyState({
            icon: 'calendar',
            title: '公告整理中',
            desc: '云杉寨还没有发布成文的公告，活动与公共工程排期会先在社区群里同步，这里的栏目先留着。',
            tag: 'COMING SOON'
          });

      var newsBlock =
        '<section class="section"><div class="container">' +
        u.sectionHead({
          eyebrow: 'NEWS',
          title: '活动公告',
          sub: 'ANNOUNCEMENTS',
          desc: '公共工程排期、服务器活动与寨内通知。',
          link: { href: '#/news', label: '查看全部' }
        }) +
        newsBody +
        '</div></section>';

      /* ---------- 大事记 ---------- */
      var timeline = milestones.map(function (item) {
        return (
          '<li><div class="timeline__date">' + u.esc(item.date) + '</div>' +
          '<h4>' + u.esc(item.title) + '</h4>' +
          '<p>' + u.esc(item.desc) + '</p></li>'
        );
      }).join('');

      var milestoneBlock =
        '<section class="section"><div class="container">' +
        u.sectionHead({
          eyebrow: 'MILESTONES',
          title: '云杉寨大事记',
          sub: 'SINCE ' + u.esc(u.fmtMonth(site.established)),
          desc: '一个寨子是怎么长出来的：从选地、立门到成员扩展。',
          link: { href: '#/about', label: '更多' }
        }) +
        '<ol class="timeline">' + timeline + '</ol>' +
        '</div></section>';

      /* ---------- 加入入口 ---------- */
      var joinBlock =
        '<section class="section section--tight"><div class="container">' +
        '<div class="callout">' +
        '<div><h3>想在这里盖自己的第一栋房子？</h3>' +
        '<p>名额有限，先来聊聊你的上线时间和想做的事。</p></div>' +
        '<a class="btn btn--primary" href="#/join">了解加入方式</a>' +
        '</div></div></section>';

      return (
        hero + statsBlock + aboutBlock + memberBlock +
        buildingBlock + newsBlock + milestoneBlock + joinBlock
      );
    }
  };
})();
