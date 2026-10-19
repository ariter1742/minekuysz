/* =============================================================
 * 云杉寨 · 加入我们
 * -------------------------------------------------------------
 * 名额、条件、流程都来自 data/site.js 的 join 字段。
 * 名额进度条会自动根据成员名单统计，不需要手动同步数字。
 * ============================================================= */

(function () {
  'use strict';

  var CJY = (window.CJY = window.CJY || {});
  var u = CJY.util;

  function infoRow(label, value) {
    return '<div><dt>' + u.esc(label) + '</dt><dd>' + u.esc(value) + '</dd></div>';
  }

  CJY.pages.join = {
    title: '加入我们',

    render: function () {
      var site = CJY.site;
      var join = site.join;
      var server = site.server;
      var stats = u.memberStats();

      var conditions = join.conditions.map(function (text) {
        return '<li>' + u.esc(text) + '</li>';
      }).join('');

      var steps = join.steps.map(function (step) {
        return '<li><h4>' + u.esc(step.title) + '</h4><p>' + u.esc(step.desc) + '</p></li>';
      }).join('');

      return (
        u.pageHead({
          eyebrow: join.eyebrow || 'JOIN US',
          title: join.title,
          sub: 'RECRUITING · ' + stats.total + ' / ' + stats.capacity,
          desc: join.desc
        }) +
        '<section class="section section--tight"><div class="container">' +
        '<div class="split">' +
        '<div class="prose">' +
        '<p>' + u.esc(join.intro) + '</p>' +
        '<p>' + u.esc(join.note) + '</p>' +
        '</div>' +
        '<aside class="info-card">' +
        '<div class="info-card__title">' + u.icon('users') + '当前名额</div>' +
        u.capacityBar() +
        '<dl class="info-list info-list--gap">' +
        infoRow('服务器', server.name) +
        infoRow('申请方式', '服务器内联络管理员 / 社区群') +
        infoRow('联系方式', join.contact) +
        infoRow('名额状态', stats.total + ' / ' + stats.capacity + ' · 剩余 ' + stats.remaining) +
        '</dl>' +
        '</aside>' +
        '</div></div></section>' +

        '<section class="section"><div class="container">' +
        u.sectionHead({
          eyebrow: 'CONDITIONS',
          title: '加入条件',
          desc: '这些不是门槛，是让寨子能长期运转的约定。'
        }) +
        '<ul class="checklist">' + conditions + '</ul>' +
        '</div></section>' +

        '<section class="section section--tight"><div class="container">' +
        u.sectionHead({
          eyebrow: 'HOW TO JOIN',
          title: '加入流程',
          desc: '四步走完；中间任何一步觉得不合适，都可以直接退出。'
        }) +
        '<ol class="steps">' + steps + '</ol>' +
        '</div></section>' +

        '<section class="section section--tight"><div class="container">' +
        '<div class="callout">' +
        '<div><h3>准备好了就来找我们</h3>' +
        '<p>联系方式：' + u.esc(join.contact) + '</p></div>' +
        '<a class="btn btn--primary" href="#/about">先了解云杉寨</a>' +
        '</div></div></section>'
      );
    }
  };
})();
