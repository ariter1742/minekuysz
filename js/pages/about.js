/* =============================================================
 * 云杉寨 · 关于云杉寨
 * -------------------------------------------------------------
 * 组织介绍、服务器资料、在意的事与大事记。
 * 文字来自 data/site.js 的 about / server，大事记来自
 * data/milestones.js。
 * ============================================================= */

(function () {
  'use strict';

  var CJY = (window.CJY = window.CJY || {});
  var u = CJY.util;

  function infoRow(label, value) {
    return '<div><dt>' + u.esc(label) + '</dt><dd>' + u.esc(value) + '</dd></div>';
  }

  function featureCard(item) {
    return (
      '<article class="feature">' +
      '<div class="feature__icon">' + u.icon(item.icon || 'grid') + '</div>' +
      '<h3>' + u.esc(item.title) + '</h3>' +
      '<p>' + u.esc(item.desc) + '</p>' +
      '</article>'
    );
  }

  CJY.pages.about = {
    title: '关于云杉寨',

    render: function () {
      var site = CJY.site;
      var about = site.about;
      var server = site.server;

      var paragraphs = about.paragraphs.map(function (text) {
        return '<p>' + u.esc(text) + '</p>';
      }).join('');

      var features = about.features.map(featureCard).join('');

      var timeline = (CJY.milestones || []).map(function (item) {
        return (
          '<li><div class="timeline__date">' + u.esc(item.date) + '</div>' +
          '<h4>' + u.esc(item.title) + '</h4>' +
          '<p>' + u.esc(item.desc) + '</p></li>'
        );
      }).join('');

      return (
        u.pageHead({
          eyebrow: about.eyebrow || 'ABOUT US',
          title: about.title,
          sub: site.nameEn + ' · EST. ' + u.esc(u.fmtMonth(site.established)),
          desc: about.desc
        }) +
        '<section class="section section--tight"><div class="container">' +
        '<div class="split">' +
        '<div class="prose">' + paragraphs + '</div>' +
        '<aside class="info-card">' +
        '<div class="info-card__title">' + u.icon('pin') + '服务器资料</div>' +
        '<dl class="info-list">' +
        infoRow('版本', server.edition) +
        infoRow('服务器', server.name) +
        infoRow('模式', server.mode) +
        infoRow('地址', server.address) +
        infoRow('存档', server.sync) +
        '</dl>' +
        '</aside>' +
        '</div></div></section>' +

        '<section class="section"><div class="container">' +
        u.sectionHead({
          icon: 'sparkle',
          eyebrow: 'WHAT WE CARE',
          title: '我们在意的事',
          desc: '长期、协作、把细节做完——这三件事，比一次建得多漂亮更重要。'
        }) +
        '<div class="features">' + features + '</div>' +
        '</div></section>' +

        '<section class="section"><div class="container">' +
        u.sectionHead({
          icon: 'trophy',
          eyebrow: 'MILESTONES',
          title: '云杉寨大事记',
          sub: 'SINCE ' + u.esc(u.fmtMonth(site.established)),
          desc: '按时间顺序记录寨子的每一步。'
        }) +
        '<ol class="timeline">' + timeline + '</ol>' +
        '</div></section>'
      );
    }
  };
})();
