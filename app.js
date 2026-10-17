/* ================= 才薪云 · 核心框架与通用工具 ================= */
var CX = window.CX;
var ROLE = sessionStorage.getItem('cx_role') || 'executive';
var ROLE_INFO = {
  executive: { name: '企业高管', avatar: '高', desc: '拥有全公司数据总览权限：四大经营看板、整体项目健康评分、客户风险评分、全局风险台账；并拥有「全量操作日志审计」权限，可查看全公司所有人员的操作动态（无具体业务操作权限）' },
  manager:   { name: '项目负责人', avatar: '项', desc: '仅授权查看分管项目部数据：本项目考勤、人员、成本、考核扣款、项目健康评分与风险清单，可处理项目级风险工单' },
  hr:        { name: 'HR管理员', avatar: 'H', desc: '负责人力全生命周期管理、考勤核算、薪酬社保RPA审核、人员档案管理（隔离财务经营敏感数据）' }
};

// 角色可见页面白名单（null = 全部）；同时作为菜单过滤与深链越权拦截依据
var ROLE_PAGES = {
  executive: null,
  manager: ['dashboard', 'ops-data', 'ops-attend', 'ops-contract', 'sd-overview', 'sd-bid', 'sd-health', 'sd-client', 'sd-ticket', 'growth', 'bi-project', 'bi-client', 'req'],
  hr: ['dashboard', 'ops-attend', 'staff-file', 'staff-self', 'bi-compliance', 'growth', 'sd-ticket', 'req']
};
function roleCan(role, page) { var a = ROLE_PAGES[role]; return !a || a.indexOf(page) >= 0; }
var MGR_IDS = CX.projects.slice(0, 12).map(function (p) { return p.id; });
function myProjects() { return ROLE === 'manager' ? CX.projects.filter(function (p) { return MGR_IDS.indexOf(p.id) >= 0; }) : CX.projects; }

var MENUS = [
  { key: 'dashboard', top: '工作台', icon: '⌂', items: [{ key: 'dashboard', name: '工作台总览' }] },
  { key: 'ops', top: '数字运营', icon: '⚙', items: [
    { key: 'ops-data', name: '项目经营底账' }, { key: 'ops-attend', name: '考勤薪酬RPA' }, { key: 'ops-contract', name: '合同合规管控' }] },
  { key: 'sd', top: '智慧决策', icon: '◈', items: [
    { key: 'sd-overview', name: '智慧决策总览' }, { key: 'sd-bid', name: '项目投标测算' }, { key: 'sd-health', name: '项目健康评分' },
    { key: 'sd-client', name: '客户价值与流失' }, { key: 'sd-ticket', name: '风险工单闭环' }] },
  { key: 'staff', top: '全员服务', icon: '☺', items: [
    { key: 'staff-file', name: '员工全生命周期' }, { key: 'staff-self', name: '员工自助与AI问答' }] },
  { key: 'growth', top: '成长赋能', icon: '✦', items: [{ key: 'growth', name: '培训与晋升体系' }] },
  { key: 'bi', top: 'BI看板', icon: '▤', items: [
    { key: 'bi-company', name: '公司总览看板' }, { key: 'bi-project', name: '项目经营分析' },
    { key: 'bi-compliance', name: '人力合规看板' }, { key: 'bi-client', name: '客户价值分析' }] },
  { key: 'sys', top: '系统管理', icon: '⚑', items: [
    { key: 'sys-rbac', name: '权限与规则引擎' }, { key: 'sys-arch', name: '平台总体架构' }] },
  { key: 'audit', top: '审计监管', icon: '🛡', items: [
    { key: 'audit', name: '操作日志审计' }] },
  { key: 'collab', top: '协同审批', icon: '📝', items: [
    { key: 'req', name: '需求审批中心' }] }
];
var PAGE_IN_TOP = {};
MENUS.forEach(function (m) { m.items.forEach(function (it) { PAGE_IN_TOP[it.key] = m.key; }); });

var _charts = [];
function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;'); }
function disposeCharts() { _charts.forEach(function (c) { try { c.dispose(); } catch (e) {} }); _charts = []; }
function mkChart(id, option, h) {
  var el = document.getElementById(id);
  if (!el || typeof echarts === 'undefined') return;
  if (h) el.style.height = h + 'px';
  var c = echarts.init(el);
  c.setOption(option);
  _charts.push(c);
}
var CHART_BASE = {
  tooltip: { trigger: 'axis' },
  grid: { left: 46, right: 20, top: 36, bottom: 28 },
  color: ['#1677ff', '#00b578', '#ff9f43', '#7b61ff', '#13c2c2', '#fa5151']
};
function scoreCls(s) { return s >= 75 ? 'score-high' : (s >= 55 ? 'score-mid' : 'score-low'); }
function barColor(s) { return s >= 75 ? '#00b578' : (s >= 55 ? '#ff9f43' : '#fa5151'); }
function levelTag(l) {
  return l === 'good' ? '<span class="tag tag-green">优质</span>'
    : l === 'mid' ? '<span class="tag tag-orange">一般</span>'
    : '<span class="tag tag-red">高风险</span>';
}
function clusterTag(c) {
  return c === 'high' ? '<span class="tag tag-green">高价值稳定型</span>'
    : c === 'growth' ? '<span class="tag tag-blue">成长潜力型</span>'
    : '<span class="tag tag-red">低效风险型</span>';
}
function aiBox(text) {
  return '<div class="ai-box"><div class="ai-head">✨ AI 智能解读</div>' + text + '</div>';
}
function header(title, sub, right) {
  return '<div class="page-header"><div><div class="page-title">' + title +
    (sub ? '<span class="page-sub">' + sub + '</span>' : '') + '</div></div>' + (right || '') + '</div>';
}
function roleBanner() {
  var r = ROLE_INFO[ROLE];
  return '<div class="role-banner">🔑 <b>' + r.name + '</b>（RBAC 分级权限）｜' + r.desc + '</div>';
}
function stat(icon, bg, num, label) {
  return '<div class="stat-card"><div class="stat-icon" style="background:' + bg + '">' + icon + '</div><div><div class="stat-num">' + num + '</div><div class="stat-label">' + label + '</div></div></div>';
}
function kpi(val, label, sub, color) {
  return '<div class="kpi"><div class="k-val" style="color:' + color + '">' + val + '</div><div class="k-label">' + label + '</div><div class="k-sub" style="color:var(--text-3)">' + sub + '</div></div>';
}
function tl(t, d) { return '<div class="tl-item"><div class="tl-t">' + t + '</div><div class="tl-d">' + d + '</div></div>'; }

var PAGES = {};

function render(html) {
  disposeCharts();
  document.getElementById('main').innerHTML = '<div class="page">' + html + '</div>';
}
function route() {
  var page = (location.hash || '#/dashboard').replace('#/', '');
  if (!PAGES[page]) page = 'dashboard';
  if (!roleCan(ROLE, page)) { render(noPermission(page)); return; }
  renderMenu(page);
  PAGES[page]();
  document.getElementById('main').scrollTop = 0;
}
function noPermission(page) {
  return header('权限受限', 'RBAC 分级权限 · 数据范围控制') +
    '<div class="card" style="text-align:center;padding:54px 20px">' +
    '<div style="font-size:48px">🔒</div>' +
    '<div style="font-size:18px;font-weight:600;margin:14px 0 8px">当前角色（' + ROLE_INFO[ROLE].name + '）无权访问该模块</div>' +
    '<div style="color:var(--text-3);max-width:560px;margin:0 auto;line-height:1.9">系统按 RBAC 分级权限隔离数据范围：' + ROLE_INFO[ROLE].desc + '<br>如需访问，请使用具备相应权限的账号重新登录，或联系系统管理员调整授权。</div>' +
    '<button class="btn" style="margin-top:20px" onclick="go(\'dashboard\')">返回我的工作台</button></div>';
}
function renderMenu(activePage) {
  var top = PAGE_IN_TOP[activePage] || 'dashboard';
  var groups = MENUS.map(function (m) {
    return { m: m, items: m.items.filter(function (it) { return roleCan(ROLE, it.key); }) };
  }).filter(function (g) { return g.items.length > 0; });
  document.getElementById('topMenus').innerHTML = groups.map(function (g) {
    return '<span class="top-menu' + (g.m.key === top ? ' active' : '') + '" onclick="go(\'' + g.items[0].key + '\')">' + g.m.icon + ' ' + g.m.top + '</span>';
  }).join('');
  var cur = groups.filter(function (g) { return g.m.key === top; })[0] || groups[0];
  document.getElementById('sidebar').innerHTML = '<div class="side-group">' + cur.m.top.toUpperCase() + '</div>' +
    cur.items.map(function (it) {
      return '<div class="side-item' + (it.key === activePage ? ' active' : '') + '" onclick="go(\'' + it.key + '\')"><span class="ico">▪</span>' + it.name + '</div>';
    }).join('') +
    '<div class="side-group">快速跳转</div>' +
    [['sd-overview', '◈ 智慧决策'], ['bi-project', '▤ 项目看板'], ['sd-ticket', '⚠ 风险工单']].filter(function (q) {
      return roleCan(ROLE, q[0]);
    }).map(function (q) {
      return '<div class="side-item" onclick="go(\'' + q[0] + '\')"><span class="ico">›</span>' + q[1] + '</div>';
    }).join('');
}
window.go = function (page) { location.hash = '#/' + page; };
window.addEventListener('hashchange', route);
window.openModal = function (html) {
  document.getElementById('modalBox').innerHTML = '<span class="modal-close" onclick="closeModal()">✕</span>' + html;
  document.getElementById('modalMask').classList.add('show');
};
window.closeModal = function () { document.getElementById('modalMask').classList.remove('show'); };
window.logout = function () { location.href = 'login.html'; };
window.CX_BOOT = function () {
  var r = ROLE_INFO[ROLE];
  document.getElementById('roleName').textContent = r.name;
  document.getElementById('avatarTxt').textContent = r.avatar;
  route();
};

/* ================= 工作台 ================= */
PAGES['dashboard'] = function () {
  var role = ROLE;
  var scope = myProjects();
  var riskRed = 0, riskYel = 0, st = [];
  if (role === 'manager') {
    st = CX.tickets.filter(function (t) { return scope.some(function (p) { return p.id === t.project; }); });
    riskRed = st.filter(function (t) { return t.level === 'red' && t.status !== '已闭环'; }).length;
    riskYel = st.filter(function (t) { return t.level === 'yellow' && t.status !== '已闭环'; }).length;
  } else {
    riskRed = CX.tickets.filter(function (t) { return t.level === 'red' && t.status !== '已闭环'; }).length;
    riskYel = CX.tickets.filter(function (t) { return t.level === 'yellow' && t.status !== '已闭环'; }).length;
  }
  function qa(ico, label, page) { return '<div class="qa" onclick="go(\'' + page + '\')"><div class="qa-ico">' + ico + '</div><div class="qa-label">' + label + '</div></div>'; }
  var qaSet = role === 'executive'
    ? qa('▤', '全量经营看板', 'bi-company') + qa('🛡', '全局风险审计', 'sd-ticket') + qa('🔍', '全量操作审计', 'audit') + qa('⚖', '审批中枢', 'req') + qa('📊', '客户价值', 'bi-client')
    : role === 'manager'
    ? qa('📁', '我的项目', 'bi-project') + qa('⚠', '我的工单', 'sd-ticket') + qa('📝', '发起需求', 'req') + qa('💰', '预算报批', 'req') + qa('📈', '分管看板', 'bi-project')
    : qa('👥', '员工档案', 'staff-file') + qa('🛡', '社保合规', 'bi-compliance') + qa('🚀', '招聘管道', 'req') + qa('🎓', '培训体系', 'growth') + qa('✅', '录用决策', 'req');
  var reqHtml = reqWidgetHtml(role);
  var html = header('工作台总览', role === 'executive' ? '数据沉淀 — 技术赋能 — 业务落地 — 智能分析 — 价值变现 · 全公司驾驶舱'
    : role === 'manager' ? '分管项目视角 · 团队驾驶舱 · 聚焦本项目经营与风险'
    : '人力资源视角 · 合规驾驶舱 · 聚焦用工与社保合规') + roleBanner();
  if (role === 'hr') {
    html += '<div class="grid g5" style="margin-bottom:16px">' +
      stat('👥', 'var(--primary-light)', 445, '在册员工') +
      stat('🛡', '#e6f7f1', '24.94%', '社保参保率') +
      stat('⏳', '#fff3e5', 12, '待审批异动') +
      stat('🔔', '#feecec', 5, '合同到期提醒') +
      stat('⚠️', '#feecec', CX.projects.filter(function (p) { return p.dedRate > 10; }).length, '社保合规风险项目') + '</div>';
    html += '<div class="card"><div class="card-title">人力资源合规驾驶舱<span class="more">社保参保异常 · 合同到期 · 用工形式合规</span></div><div class="risk-strip">' +
      '<div class="risk-chip rc-red" onclick="go(\'bi-compliance\')"><div><div class="rc-label">社保参保异常</div><div style="font-size:11px;opacity:.85">未参保/现金补贴替代</div></div><div class="rc-num">213</div></div>' +
      '<div class="risk-chip rc-yellow" onclick="go(\'bi-compliance\')"><div><div class="rc-label">合同30天到期</div><div style="font-size:11px;opacity:.85">需启动续签/重谈</div></div><div class="rc-num">5</div></div>' +
      '<div class="risk-chip rc-green" onclick="go(\'staff-file\')"><div><div class="rc-label">本月合规整改</div><div style="font-size:11px;opacity:.85">已闭环工单</div></div><div class="rc-num">18</div></div></div>' +
      '<div style="margin-top:10px;font-size:12.5px;color:var(--text-3)">HR管理员视角已隔离财务经营敏感数据，聚焦"用工合规 + 社保风控 + 人事服务"，与项目负责人、企业高管形成数据边界。</div></div>';
    html += '<div class="qa-grid" style="margin-bottom:16px">' + qaSet + '</div>';
    html += '<div class="grid g32"><div class="card"><div class="card-title">社保参保率趋势（近6月）</div><div id="c-hr" class="chart"></div></div>' +
      '<div style="display:flex;flex-direction:column;gap:14px"><div class="card"><div class="card-title">待办事项<span class="more">HR 专属</span></div>' +
      '<div class="list-row"><span class="lr-text" style="color:var(--red)">213人社保异常待整改</span><span class="lr-time"><button class="btn sm" onclick="go(\'bi-compliance\')">去处置</button></span></div>' +
      '<div class="list-row"><span class="lr-text">5份劳动合同30天内到期</span><span class="lr-time"><button class="btn sm plain" onclick="go(\'staff-file\')">查看</button></span></div>' +
      '<div class="list-row"><span class="lr-text">本月12项人事异动待审批</span><span class="lr-time"><button class="btn sm plain" onclick="go(\'staff-file\')">审批</button></span></div>' +
      '</div>' + reqHtml + '</div></div>';
  } else if (role === 'manager') {
    var ms = scope.reduce(function (s, p) { return s + p.staff; }, 0);
    var mrev = scope.reduce(function (s, p) { return s + p.revenue; }, 0);
    var mcost = scope.reduce(function (s, p) { return s + (p.revenue - p.gross); }, 0);
    var mhigh = scope.filter(function (p) { return p.level === 'high-risk'; }).length;
    html += '<div class="grid g5" style="margin-bottom:16px">' +
      stat('📁', 'var(--primary-light)', scope.length, '分管在营项目') +
      stat('👥', '#efeaff', ms, '分管在册员工') +
      stat('💰', '#e6f7f1', mrev + '万', '分管月营收') +
      stat('📈', '#fff3e5', (mrev - mcost >= 0 ? '+' : '') + (mrev - mcost) + '万', '分管月净利') +
      stat('⚠️', '#feecec', riskRed + riskYel, '分管待处置风险') + '</div>';
    html += '<div class="card"><div class="card-title">分管项目风险仪表盘<span class="more">仅显示您分管范围内的项目风险</span></div><div class="risk-strip">' +
      '<div class="risk-chip rc-red" onclick="go(\'sd-ticket\')"><div><div class="rc-label">红色高风险</div><div style="font-size:11px;opacity:.85">扣款超标/评分危线</div></div><div class="rc-num">' + riskRed + '</div></div>' +
      '<div class="risk-chip rc-yellow" onclick="go(\'sd-ticket\')"><div><div class="rc-label">黄色预警</div><div style="font-size:11px;opacity:.85">阈值临界</div></div><div class="rc-num">' + riskYel + '</div></div>' +
      '<div class="risk-chip rc-green" onclick="go(\'sd-ticket\')"><div><div class="rc-label">已闭环</div><div style="font-size:11px;opacity:.85">本范围风险处置</div></div><div class="rc-num">' + st.filter(function (t) { return t.status === '已闭环'; }).length + '</div></div></div>' +
      '<div style="margin-top:10px;font-size:12.5px;color:var(--text-3)">您当前分管 ' + scope.length + ' 个项目，其中高风险 ' + mhigh + ' 个已触发预警工单。全司财务经营敏感数据已对您隐藏，聚焦分管项目经营。</div></div>';
    html += '<div class="qa-grid" style="margin-bottom:16px">' + qaSet + '</div>';
    html += '<div class="grid g32"><div class="card"><div class="card-title">营收 · 成本趋势（近24个月 · 全司）</div><div id="c-trend" class="chart"></div></div>' +
      '<div style="display:flex;flex-direction:column;gap:14px"><div class="card"><div class="card-title">公告通知<span class="more">项目相关</span></div>' +
      [['关于规范冷链盒饭储存与报废管理的通知', '2026-10-09'], ['庚地区二队安全防护专项培训启动', '2026-10-08'], ['癸劳务协作基地续约谈判方案', '2026-10-07'], ['关于开展高铁五队服务质量专项提升行动的通知', '2026-09-30']].map(function (a) {
        return '<div class="list-row"><span class="lr-text">[通知公告]' + a[0] + '</span><span class="lr-time">' + a[1] + '</span></div>';
      }).join('') +
      '<div class="card-title" style="margin-top:16px">待办事项<span class="more">项目专属</span></div>' +
      '<div class="list-row"><span class="lr-text" style="color:var(--red)">分管红色风险工单待处置</span><span class="lr-time"><button class="btn sm" onclick="go(\'sd-ticket\')">去处理</button></span></div>' +
      '<div class="list-row"><span class="lr-text">分管项目9月经营看板复核</span><span class="lr-time"><button class="btn sm plain" onclick="go(\'bi-project\')">查看</button></span></div>' +
      '</div>' + reqHtml + '</div></div>';
  } else {
    var last = CX.trend[CX.trend.length - 1];
    var high = CX.projects.filter(function (p) { return p.level === 'high-risk'; }).length;
    html += '<div class="grid g5" style="margin-bottom:16px">' +
      stat('👥', 'var(--primary-light)', CX.projects.reduce(function (s, p) { return s + p.staff; }, 0), '在册派遣员工') +
      stat('📁', '#efeaff', CX.projects.length, '在营项目') +
      stat('💰', '#e6f7f1', last.rev + '万', '当月营收') +
      stat('📈', '#fff3e5', (last.rev - last.cost >= 0 ? '+' : '') + (last.rev - last.cost) + '万', '当月净利') +
      stat('⚠️', '#feecec', riskRed + riskYel, '待处置风险') + '</div>';
    html += '<div class="card"><div class="card-title">全局风险仪表盘<span class="more">红/黄/绿 三级预警 · 点击条目跳转风险工单</span></div><div class="risk-strip">' +
      '<div class="risk-chip rc-red" onclick="go(\'sd-ticket\')"><div><div class="rc-label">红色高风险</div><div style="font-size:11px;opacity:.85">扣款超标/高流失/评分危线</div></div><div class="rc-num">' + riskRed + '</div></div>' +
      '<div class="risk-chip rc-yellow" onclick="go(\'sd-ticket\')"><div><div class="rc-label">黄色预警</div><div style="font-size:11px;opacity:.85">阈值临界 · 待观察处置</div></div><div class="rc-num">' + riskYel + '</div></div>' +
      '<div class="risk-chip rc-green" onclick="go(\'sd-ticket\')"><div><div class="rc-label">绿色正常 / 本月已闭环</div><div style="font-size:11px;opacity:.85">风险处置闭环</div></div><div class="rc-num">' + CX.tickets.filter(function (t) { return t.status === '已闭环'; }).length + '</div></div></div>' +
      '<div style="margin-top:10px;font-size:12.5px;color:var(--text-3)">其中高风险项目 ' + high + ' 个已全部触发预警工单，2个经整改后下一考核周期毛利率回升 3.1 个百分点。</div></div>';
    html += '<div class="qa-grid" style="margin-bottom:16px">' + qaSet + '</div>';
    html += '<div class="grid g32"><div class="card"><div class="card-title">营收 · 成本趋势（近24个月）</div><div id="c-trend" class="chart"></div></div>' +
      '<div style="display:flex;flex-direction:column;gap:14px"><div class="card"><div class="card-title">公告通知<span class="more">查看更多 ›</span></div>' +
      [['关于智慧决策模块试运行上线的公告', '2026-10-14'], ['关于规范冷链盒饭储存与报废管理的通知', '2026-10-09'], ['10月社保增减员申报截止日提醒', '2026-10-08'], ['关于开展高铁五队服务质量专项提升行动的通知', '2026-09-30'], ['新员工"培训—考核—上岗"闭环流程启用', '2026-09-22']].map(function (a) {
        return '<div class="list-row"><span class="lr-text">[通知公告]' + a[0] + '</span><span class="lr-time">' + a[1] + '</span></div>';
      }).join('') +
      '<div class="card-title" style="margin-top:16px">待办事项<span class="more">查看更多 ›</span></div>' +
      '<div class="list-row"><span class="lr-text" style="color:var(--red)">红色风险工单待处置</span><span class="lr-time"><button class="btn sm" onclick="go(\'sd-ticket\')">去处理</button></span></div>' +
      '<div class="list-row"><span class="lr-text">9月经营看板数据复核确认</span><span class="lr-time"><button class="btn sm plain" onclick="go(\'bi-project\')">查看</button></span></div>' +
      '<div class="list-row"><span class="lr-text">癸劳务协作基地续约谈判方案</span><span class="lr-time"><button class="btn sm plain" onclick="go(\'sd-client\')">查看</button></span></div>' +
      '</div>' + reqHtml + '</div></div>';
  }
  render(html);
  if (role === 'hr') {
    mkChart('c-hr', Object.assign({}, CHART_BASE, {
      grid: { left: 52, right: 20, top: 40, bottom: 40 },
      tooltip: { trigger: 'axis', valueFormatter: function (v) { return v + ' %'; } },
      xAxis: { type: 'category', data: ['5月', '6月', '7月', '8月', '9月', '10月'], name: '月份', nameLocation: 'middle', nameGap: 28, axisLabel: { fontSize: 10 } },
      yAxis: { type: 'value', name: '参保率（%）', nameGap: 14, max: 40 },
      series: [{ name: '社保参保率', type: 'line', smooth: true, data: [18.2, 20.1, 21.6, 23.0, 24.1, 24.94], areaStyle: { opacity: .08 } }]
    }), 280);
  } else {
    var months = CX.trend.map(function (d) { return d.m; });
    mkChart('c-trend', Object.assign({}, CHART_BASE, {
      grid: { left: 52, right: 24, top: 40, bottom: 48 },
      legend: { data: ['营业收入', '营业成本'], top: 0 },
      tooltip: { trigger: 'axis', valueFormatter: function (v) { return v + ' 万元'; } },
      xAxis: { type: 'category', data: months, name: '统计月份', nameLocation: 'middle', nameGap: 30, axisLabel: { interval: 2, fontSize: 10 } },
      yAxis: { type: 'value', name: '金额（万元）', nameGap: 14 },
      series: [
        { name: '营业收入', type: 'line', smooth: true, data: CX.trend.map(function (d) { return d.rev; }), areaStyle: { opacity: .08 } },
        { name: '营业成本', type: 'line', smooth: true, data: CX.trend.map(function (d) { return d.cost; }), areaStyle: { opacity: .08 } }
      ]
    }), 300);
  }
};

/* ================= 数字运营 ================= */
PAGES['ops-data'] = function () {
  var isMgr = ROLE === 'manager';
  var html = header('项目经营底账', '第一层·数据输入：把项目经营数据汇成"一本项目经营账"') + roleBanner();
  if (isMgr) html += '<div class="role-banner" style="background:#eef6ff;border-color:#adc6ff;color:#1d39c4">📊 数据已按 RBAC 隔离：仅展示您分管的 ' + myProjects().length + ' 个项目经营底账（全司共 ' + CX.projects.length + ' 个），财务经营敏感数据不在您视野内。</div>';
  html += '<div class="kpi-row" style="margin-bottom:16px">' +
    kpi(myProjects().length + ' / ' + CX.projects.length, '在营项目（本角色可见）', '按 RBAC 数据范围隔离', 'var(--green)') +
    kpi('5 项', '月度上报原始数据', '收入/人工/耗材/工时/扣款', 'var(--primary)') +
    kpi('4 项', '自动衍生核算指标', '毛利/毛利率/扣款占比/人均产出', 'var(--purple)') +
    kpi('1 套', '统一统计口径', '原派遣·外包·财务多套口径收敛', 'var(--green)') + '</div>';
  html += '<div class="card"><div class="card-title">项目月度经营台账（单位：万元）<span class="more">数据回流至看板 &lt; 1 个业务日</span></div><div class="table-wrap"><table class="data"><thead><tr>' +
    '<th>项目编号</th><th>项目名称</th><th>协作客户</th><th>月度收入</th><th>直接人工</th><th>耗材成本</th><th>考核扣款</th><th>项目毛利</th><th>毛利率</th><th>扣款占收比</th><th>人均产出</th></tr></thead><tbody>' +
    myProjects().map(function (p) {
      return '<tr><td class="clickable" onclick="showProject(\'' + p.id + '\')">' + p.id + '</td><td>' + p.name + '</td><td>' + p.client + '</td>' +
        '<td>' + p.revenue + '</td><td>' + p.labor + '</td><td>' + p.material + '</td><td' + (p.dedRate > 10 ? ' style="color:var(--red);font-weight:700"' : '') + '>' + p.deduction + '</td>' +
        '<td>' + p.gross + '</td><td>' + p.margin + '%</td><td>' + p.dedRate + '%</td><td>' + p.perCapita + '</td></tr>';
    }).join('') + '</tbody></table></div></div>';
  html += aiBox('24个在营项目的经营数据已100%完成结构化归集。过去依靠Excel汇总、口径不一，往往要到月底才能算清单个项目是盈是亏；现在每个项目从用工第一天起就有一本可实时核对、可追溯的经营账，为盈亏判断与资源调配提供统一数据基础。');
  render(html);
};

PAGES['ops-attend'] = function () {
  var html = header('考勤薪酬 RPA 核算', '技术层·RPA+AI：跨系统数据搬运自动化 + 异常智能识别') + roleBanner();
  html += '<div class="grid g3" style="margin-bottom:16px">' +
    '<div class="card"><div class="card-title">🤖 RPA 数据采集</div><div class="timeline">' +
    tl('自动拉取各项目部排班、打卡、异动数据', '今日 06:00 已完成 24 个项目') +
    tl('自动归集多省份社保增减员申报信息', '云南/重庆/贵阳/成都/石家庄') +
    tl('自动抓取甲方考核回执并录入台账', '本月已识别录入 14 份扫描件') + '</div></div>' +
    '<div class="card"><div class="card-title">🔍 AI 异常识别</div>' +
    '<div class="list-row"><span>漏打卡异常</span><span class="tag tag-orange">7 条</span></div>' +
    '<div class="list-row"><span>加班时长异常</span><span class="tag tag-orange">3 条</span></div>' +
    '<div class="list-row"><span>排班冲突</span><span class="tag tag-red">2 处</span></div>' +
    '<div class="list-row"><span>薪资异常波动</span><span class="tag tag-green">0 条</span></div>' +
    '<div style="margin-top:10px">' + aiBox('AI识别异常考勤并标记预警后，自动完成薪酬基数、社保公积金核算，输出校验报告供HR复核。账务核算仍由规则引擎与人工最终确认。') + '</div></div>' +
    '<div class="card"><div class="card-title">📋 本月薪酬社保核算</div>' +
    '<div class="kpi-row"><div class="kpi"><div class="k-val">445</div><div class="k-label">在册员工</div></div>' +
    '<div class="kpi"><div class="k-val">24.94%</div><div class="k-label">社保参保率</div><div class="k-sub" style="color:var(--red)">低于40%黄色预警线</div></div></div>' +
    '<div style="margin-top:12px;font-size:12.5px;color:var(--text-2);line-height:1.7">规则引擎自动校验：213人现金社保补贴替代缴纳情形已标记，纳入社保合规专项整改台账。</div>' +
    '<button class="btn" style="margin-top:12px" onclick="go(\'bi-compliance\')">查看合规看板</button></div></div>';
  render(html);
};

PAGES['ops-contract'] = function () {
  var html = header('合同合规管控', '数据层·标准化流程框架：合同全生命周期 + 用工合规校验') + roleBanner();
  html += '<div class="grid g2"><div class="card"><div class="card-title">核心业务流程模板（标准化流程框架复用）</div><div class="grid g2" style="gap:8px">' +
    ['人事类：人员需求提报/招聘录用/入职办理/劳动合同/请假/调岗/离职/档案变更',
     '经营类：项目立项/成本归集/甲方考核处置/项目结算/薪酬核算发放/费用报销',
     '合规风险类：社保增减员申报/社保异常处置/用工风险核查/风险工单闭环/合同到期预警',
     '合同与自助类：外包合同评审/变更/终止 ｜ 工资条查询推送/证明开具'].map(function (s, i) {
      return '<div style="background:#f8faff;border:1px solid var(--border);border-radius:8px;padding:12px;font-size:12.5px;line-height:1.8;color:var(--text-2)"><b style="color:var(--primary)">' + ['人事类', '经营类', '合规风险类', '合同与自助类'][i] + '</b><br>' + s.split('：')[1] + '</div>';
    }).join('') + '</div>' +
    '<div style="margin-top:12px;font-size:12.5px;color:var(--text-3)">流程触发与告警规则：合同距到期30天自动启动预警；社保参保异常自动生成处置工单；甲方违规记录录入后自动触发风险评估。全流程留痕，满足审计溯源。</div></div>' +
    '<div class="card"><div class="card-title">合同到期预警（30天内自动触发流程）</div><div class="table-wrap"><table class="data"><thead><tr><th>合同</th><th>甲方</th><th>到期日</th><th>剩余</th><th>状态</th></tr></thead><tbody>' +
    '<tr><td>癸劳务协作基地外包主合同</td><td>癸劳务协作基地</td><td>2026-11-02</td><td>16天</td><td><span class="tag tag-red">红色预警</span></td></tr>' +
    '<tr><td>辛客运配套服务合同</td><td>辛客运配套公司</td><td>2026-11-10</td><td>24天</td><td><span class="tag tag-red">红色预警</span></td></tr>' +
    '<tr><td>庚线路工程公司外包合同</td><td>庚线路工程公司</td><td>2026-11-26</td><td>40天</td><td><span class="tag tag-orange">黄色预警</span></td></tr>' +
    '<tr><td>戊货运服务中心合同</td><td>戊货运服务中心</td><td>2026-12-15</td><td>59天</td><td><span class="tag tag-gray">正常</span></td></tr>' +
    '</tbody></table></div></div></div>';
  render(html);
};

/* ================= 全员服务 ================= */
PAGES['staff-file'] = function () {
  var html = header('员工全生命周期管理', '入 · 转 · 调 · 离全业务线上流转、全程留痕、动态更新') + roleBanner();
  html += '<div class="grid g5" style="margin-bottom:16px">' +
    stat('👥', 'var(--primary-light)', 445, '在册员工') + stat('📝', '#efeaff', 38, '本月异动流程') +
    stat('📂', '#e6f7f1', '100%', '电子档案建档率') + stat('⏳', '#fff3e5', 12, '待审批流程') +
    stat('🔔', '#feecec', 5, '合同到期提醒') + '</div>';
  html += '<div class="card"><div class="card-title">员工档案台账（抽样）</div><div class="table-wrap"><table class="data"><thead><tr>' +
    '<th>工号</th><th>姓名</th><th>所属项目</th><th>岗位</th><th>用工形式</th><th>参保状态</th><th>合同到期</th><th>操作</th></tr></thead><tbody>' +
    [['S1024', '李伟', '甲铁路局乘务服务一队', '餐服员', '派遣', '已参保', '2027-03-15'],
     ['S1087', '张丽', '甲铁路局乘务服务一队', '列车员', '派遣', '现金补贴（待整改）', '2026-11-20'],
     ['S2110', '王强', '丙轨枕预制一线', '预制工', '非全日制', '工伤保险', '2027-01-08'],
     ['S2155', '赵敏', '滇中餐服冷链配送组', '配送员', '派遣', '未参保（待整改）', '2026-12-30'],
     ['S2231', '陈静', '丁动车检修组', '检修员', '派遣', '已参保', '2027-06-02'],
     ['S2301', '刘洋', '甲铁路局餐服配送项目', '销售员', '劳务协作', '现金补贴（待整改）', '2026-10-28']].map(function (r) {
      var tag = r[5] === '已参保' ? '<span class="tag tag-green">已参保</span>' : r[5].indexOf('未参保') === 0 ? '<span class="tag tag-red">' + r[5] + '</span>' : r[5].indexOf('现金') === 0 ? '<span class="tag tag-orange">' + r[5] + '</span>' : '<span class="tag tag-blue">' + r[5] + '</span>';
      return '<tr><td>' + r[0] + '</td><td>' + r[1] + '</td><td>' + r[2] + '</td><td>' + r[3] + '</td><td>' + r[4] + '</td><td>' + tag + '</td><td' + (r[6] < '2026-11-15' ? ' style="color:var(--red)"' : '') + '>' + r[6] + '</td><td><a>档案</a>　<a>异动</a></td></tr>';
    }).join('') + '</tbody></table></div>' +
    '<div style="margin-top:10px;font-size:12.5px;color:var(--text-3)">参保状态由规则引擎按员工逐人跟踪：自动识别未参保/现金补贴替代情形，测算补缴敞口并预警，使合规风险从"账外隐性"变为"系统可视、可预算、可排期"。</div></div>';
  render(html);
};

PAGES['staff-self'] = function () {
  var html = header('员工自助服务与 AI 问答', '轻量化自助体系（小程序同步） · AI问答机器人 7×24 小时') + roleBanner();
  html += '<div class="grid g4" style="margin-bottom:16px">' +
    ['💰 工资条一键查看', '🏥 社保公积金查验', '🌴 在线请假', '📄 证明在线开具'].map(function (s) {
      return '<div class="stat-card"><div class="stat-icon" style="background:var(--primary-light)">' + s.split(' ')[0] + '</div><div><div class="stat-num" style="font-size:15px">' + s.split(' ')[1] + '</div><div class="stat-label">员工端高频服务</div></div></div>';
    }).join('') + '</div>';
  html += '<div class="grid g2"><div class="card"><div class="card-title">💬 AI 智能问答机器人（演示）</div>' +
    '<div style="background:#f8faff;border-radius:10px;padding:14px;margin-bottom:10px;font-size:13px"><b style="color:var(--primary)">员工：</b>我这个月工资怎么比上月少了 300 多？</div>' +
    aiBox('经核算记录比对：您本月业绩提成减少 342 元，主要因当月销售金额环比下降；基本工资、出勤扣款均无变化。工资明细已推送至您的工资条，可点击"工资条一键查看"逐项核对。如对考核计提有异议，可发起申诉，将自动流转至项目部负责人。') +
    '<div style="background:#f8faff;border-radius:10px;padding:14px;margin:12px 0 10px;font-size:13px"><b style="color:var(--primary)">员工：</b>我在重庆参保，老家贵阳的社保怎么算？</div>' +
    aiBox('根据多省市社保政策知识库（已收录云南、重庆、贵阳、成都、石家庄规则）：您的参保地为用工所在地重庆，缴费基数按重庆上年度社平工资核定。若未来调往贵阳项目部，系统将在异动流程中自动触发社保转移接续申报。复杂情形已为您创建人工工单，HR将在1个工作日内联系您。') +
    '<div style="font-size:12px;color:var(--text-3);margin-top:8px">支持语音/文字输入 · 高频问题自动应答 · 复杂问题自动流转HR人工工单 · 问答结果附带原始数据来源链接，避免AI幻觉</div></div>' +
    '<div class="card"><div class="card-title">🔔 服务数据（本月）</div>' +
    '<div class="list-row"><span>工资条查询</span><span class="tag tag-blue">3,842 次</span></div>' +
    '<div class="list-row"><span>社保查验</span><span class="tag tag-blue">1,236 次</span></div>' +
    '<div class="list-row"><span>在线请假审批</span><span class="tag tag-green">287 单 · 平均4.2小时办结</span></div>' +
    '<div class="list-row"><span>AI问答会话</span><span class="tag tag-purple">1,053 次 · 自动解决率 87%</span></div>' +
    '<div class="list-row"><span>流转人工工单</span><span class="tag tag-orange">137 单</span></div>' +
    '<div style="margin-top:12px">' + aiBox('AI问答大幅降低人事咨询压力：HR事务性咨询量下降约 60%，释放工时转向人才盘点与组织发展，支撑"效率节约 8.4~16.8 人年"目标落地。') + '</div></div></div>';
  render(html);
};

/* ================= 成长赋能 ================= */
PAGES['growth'] = function () {
  var html = header('成长赋能：培训与晋升发展体系', '"问题—培训—复测"闭环 · 把一线队伍变成可持续的竞争力') + roleBanner();
  html += '<div class="grid g2" style="margin-bottom:16px">' +
    '<div class="card"><div class="card-title">🎯 专项培训任务（与考核模块联动自动派发）</div><div class="table-wrap"><table class="data"><thead><tr><th>触发来源</th><th>培训任务</th><th>应训/已完成</th><th>复测状态</th></tr></thead><tbody>' +
    '<tr><td>庚地区二队防护不到位×11人</td><td>安全防护专项培训</td><td>11 / 9</td><td><span class="tag tag-orange">复测中</span></td></tr>' +
    '<tr><td>冷链盒饭报废扣款</td><td>冷链储存与报废管理</td><td>17 / 17</td><td><span class="tag tag-green">全部通过</span></td></tr>' +
    '<tr><td>销售不达标扣款</td><td>销售话术与商品推介</td><td>24 / 19</td><td><span class="tag tag-orange">复测中</span></td></tr>' +
    '<tr><td>岗前必修：食品安全</td><td>入职必学课程</td><td>31 / 31</td><td><span class="tag tag-green">全部通过</span></td></tr>' +
    '</tbody></table></div><div style="margin-top:10px;font-size:12.5px;color:var(--text-3)">凡检查扣分或考核未达标人员，系统自动派发专项培训任务并跟踪复测结果，形成"问题—培训—复测"闭环；培训记录统一归档，作为上岗与晋升依据。</div></div>' +
    '<div class="card"><div class="card-title">🪜 晋升通道引擎（透明化）</div>' +
    '<div class="loop-steps" style="margin:6px 0 14px">' + ['派遣员工', '业务骨干', '班组长', '项目主管/培训师'].map(function (s) {
      return '<div class="loop-step"><div class="ls-t" style="font-size:13px">' + s + '</div></div>';
    }).join('') + '</div>' +
    '<div style="font-size:12.5px;color:var(--text-2);line-height:1.8">晋升标准量化：考核结果、培训完成度、在岗时长、无重大质量事故，与薪酬档位自动联动。员工可实时查看自己的晋升进度、差距与下一步要求——把"看不见的上升空间"变为"看得见的成长路线"。</div>' +
    '<div style="margin-top:12px" class="kpi-row"><div class="kpi"><div class="k-val">85%</div><div class="k-label">核心岗位内部晋升率</div></div>' +
    '<div class="kpi"><div class="k-val">312</div><div class="k-label">本季自主完成课程</div></div></div></div></div>';
  html += '<div class="card"><div class="card-title">技能矩阵看板（按业务线技能覆盖度）</div><div id="c-skill" class="chart"></div></div>';
  render(html);
  mkChart('c-skill', Object.assign({}, CHART_BASE, {
    grid: { left: 46, right: 20, top: 40, bottom: 46 },
    legend: { top: 0 },
    tooltip: { trigger: 'axis', valueFormatter: function (v) { return v + ' %'; } },
    xAxis: { type: 'category', data: ['客运乘务', '车辆检修', '轨枕预制', '高铁餐服', '站车保洁', '装卸搬运', '线路养护'], name: '业务线', nameLocation: 'middle', nameGap: 28 },
    yAxis: { type: 'value', name: '覆盖率（%）', nameGap: 14, max: 100 },
    series: [
      { name: '岗位必备证书覆盖率', type: 'bar', data: [94, 91, 88, 82, 90, 85, 76], barWidth: 18, itemStyle: { borderRadius: [6, 6, 0, 0] } },
      { name: '多技能复合率', type: 'bar', data: [38, 45, 41, 29, 33, 27, 22], barWidth: 18, itemStyle: { borderRadius: [6, 6, 0, 0] } }
    ]
  }), 320);
};
