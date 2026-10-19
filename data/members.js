/* =============================================================
 * 云杉寨 · 成员名单
 * -------------------------------------------------------------
 * 增加一名成员（三步）：
 *   1) 把头像图片放进 assets/avatars/ 目录。
 *      建议 128×128 的正方形图片（png / jpg 均可），
 *      文件名用英文或数字，例如 avatars/17.png，避免空格与特殊符号。
 *   2) 在下面的数组末尾追加一条对象，把 avatar 指向该文件。
 *   3) 保存并刷新页面。成员总数、剩余名额、首页成员墙会自动更新。
 *
 * 字段说明：
 *   id      编号（字符串即可），用于列表视图的角标，留空会自动生成
 *   name    游戏 ID / 常用昵称
 *   role    身份：会长 / 副会长 / 精英 / 成员 / 见习
 *   title   一句话头衔，显示在名字下方
 *   avatar  头像路径。留空或图片加载失败时，会自动显示“首字”占位头像
 * ============================================================= */

window.CJY = window.CJY || {};

CJY.members = [
  {
    id: '01',
    name: 'tiedan_MC',
    role: '会长',
    title: '云杉寨寨主',
    avatar: 'assets/avatars/tiedan_MC.png',
  },
  {
    id: '02',
    name: 'Nlkijh_124',
    role: '副会长',
    title: '综合事务主管',
    avatar: 'assets/avatars/Nlkijh_124.png',
  },
  {
    id: '03',
    name: 'Fl_ovo',
    role: '副会长',
    title: '寨军总司令',
    avatar: 'assets/avatars/Fl_ovo.png',
  },
  {
    id: '04',
    name: 'kongcheng',
    role: '副会长',
    title: '生电部主管',
    avatar: 'assets/avatars/kongcheng.png',
  },
  {
    id: '05',
    name: 'TheWindBlows2025',
    role: '精英',
    title: '寨军',
    avatar: 'assets/avatars/TheWindBlows2025.png',
  },
  {
    id: '06',
    name: 'Ariter',
    role: '精英',
    title: '生电部',
    avatar: 'assets/avatars/Ariter.png',
  },
  {
    id: '07',
    name: 'wzm',
    role: '精英',
    title: '政治部',
    avatar: 'assets/avatars/wzm.png',
  },
  {
    id: '08',
    name: 'Elma520',
    role: '成员',
    title: '政治部',
    avatar: 'assets/avatars/Elma520.png',
  },
  {
    id: '09',
    name: 'mikeke2323',
    role: '成员',
    title: '寨军',
    avatar: 'assets/avatars/mikeke2323.png',
  },
  {
    id: '10',
    name: 'csh0227',
    role: '成员',
    title: '',
    avatar: 'assets/avatars/csh0227.png',
  },
  {
    id: '11',
    name: 'xyyynhhhh01',
    role: '成员',
    title: '',
    avatar: 'assets/avatars/xyyynhhhh01.png',
  },
  {
    id: '12',
    name: 'taixiumei',
    role: '成员',
    title: '生电部',
    avatar: 'assets/avatars/taixiumei.png',
  },
  {
    id: '13',
    name: 'JerryLi387',
    role: '成员',
    title: '',
    avatar: 'assets/avatars/JerryLi387.png',
  },
  {
    id: '14',
    name: '3g_egg',
    role: '成员',
    title: '',
    avatar: 'assets/avatars/3g_egg.png',
  },

];
