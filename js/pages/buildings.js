/* =============================================================
 * 云杉寨 · 建筑展示
 * -------------------------------------------------------------
 * 数据来自 data/buildings.js。作品不足 3 件时，页面用虚线空槽
 * 补位——空槽不是缺内容，而是“位置已经留好，等素材”。
 * ============================================================= */

(function () {
  'use strict';

  var CJY = (window.CJY = window.CJY || {});
  var u = CJY.util;

  CJY.pages.buildings = {
    title: '建筑展示',

    render: function () {
      var works = CJY.buildings || [];
      var gallery = works.map(function (work) {
        return u.workCard(work);
      }).join('');

      for (var i = works.length; i < 3; i++) {
        gallery += u.workSlot('等下一件作品入档');
      }

      return (
        u.pageHead({
          eyebrow: 'BUILDINGS',
          title: '建筑展示',
          sub: 'WORKS · ' + works.length + ' ENTRIES',
          desc: '公共建筑、私人小屋与驻地全景的影像记录。作品还在陆续整理，没收录的位置先留空。'
        }) +
        '<section class="section"><div class="container">' +
        (works.length
          ? '<div class="gallery">' + gallery + '</div>'
          : u.emptyState({
              icon: 'grid',
              title: '作品还在整理中',
              desc: '这个栏目已经建好，等第一批建筑截图与说明整理完就会补进来。',
              tag: 'COMING SOON'
            }) +
            '<div class="gallery gallery--spaced">' +
            u.workSlot('等下一件作品入档') + u.workSlot('等下一件作品入档') +
            u.workSlot('等下一件作品入档') +
            '</div>') +
        '<p class="section-desc">说明：虚线空槽代表位置已预留、内容待补充；收录新作品时只需在 data/buildings.js 里追加一条记录。</p>' +
        '</div></section>'
      );
    }
  };
})();
