/* =============================================================
 * 云杉寨 · 活动公告
 * -------------------------------------------------------------
 * 数据来自 data/announcements.js。目前没有成文公告，所以显示
 * 空状态——栏目本身必须存在，内容按后期维护逐步补齐。
 * ============================================================= */

(function () {
  'use strict';

  var CJY = (window.CJY = window.CJY || {});
  var u = CJY.util;

  CJY.pages.news = {
    title: '活动公告',

    render: function () {
      var news = CJY.announcements || [];
      var body = news.length
        ? '<div class="news-list">' + news.map(function (item) {
            return u.announcementItem(item);
          }).join('') + '</div>'
        : u.emptyState({
            icon: 'calendar',
            title: '公告整理中',
            desc: '云杉寨目前还没有发布成文的公告。公共工程排期、服务器活动与招新通知会先在社区群里同步，成文后再补到这里。',
            tag: 'COMING SOON'
          });

      return (
        u.pageHead({
          eyebrow: 'NEWS',
          title: '活动公告',
          sub: 'ANNOUNCEMENTS',
          desc: '公共工程排期、服务器活动与寨内通知。'
        }) +
        '<section class="section"><div class="container">' + body + '</div></section>'
      );
    }
  };
})();
