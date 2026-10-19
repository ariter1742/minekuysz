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
    avatar: 'assets/avatars/01.png',
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
    avatar: 'assets/avatars/04.png',
  },
  {
    id: '05',
    name: '苔原鹿',
    role: '精英',
    title: '慢工出细活',
    avatar: 'assets/avatars/05.png',
  },
  {
    id: '06',
    name: '榉木',
    role: '精英',
    title: '木结构爱好者',
    avatar: 'assets/avatars/06.png',
  },
  {
    id: '07',
    name: '听雨',
    role: '精英',
    title: '屋顶要有坡度',
    avatar: 'assets/avatars/07.png',
  },
  {
    id: '08',
    name: '砾川',
    role: '精英',
    title: '石料承包商',
    avatar: 'assets/avatars/08.png',
  },
  {
    id: '09',
    name: '硌硌',
    role: '精英',
    title: '灯不能只亮一盏',
    avatar: 'assets/avatars/09.png',
  },
  {
    id: '10',
    name: '阿七',
    role: '精英',
    title: '自动化农场合集',
    avatar: 'assets/avatars/10.png',
  },
  {
    id: '11',
    name: '小满',
    role: '成员',
    title: '收集控',
    avatar: 'assets/avatars/11.png',
  },
  {
    id: '12',
    name: '橘猫',
    role: '成员',
    title: '钓鱼佬',
    avatar: 'assets/avatars/12.png',
  },
  {
    id: '13',
    name: '南枝',
    role: '成员',
    title: '种树的人',
    avatar: 'assets/avatars/13.png',
  },
  {
    id: '14',
    name: '石阶',
    role: '成员',
    title: '搬运工',
    avatar: 'assets/avatars/14.png',
  },

];
