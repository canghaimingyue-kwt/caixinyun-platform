/* 才薪云 · 跨端口共享组件层
 * 内部管理端 / 甲方客户端 / 员工移动端 共用同一套 UI 组件与数据底座（data.js -> CX）
 * 目的：保证三类端口技术架构一致、使用逻辑一致、数据双向流转便利。
 */
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
function aiBox(text) { return '<div class="ai-box"><div class="ai-head">✨ AI 智能解读</div>' + text + '</div>'; }
function header(title, sub, right) {
  return '<div class="page-header"><div><div class="page-title">' + title +
    (sub ? '<span class="page-sub">' + sub + '</span>' : '') + '</div></div>' + (right || '') + '</div>';
}
function roleBanner() {
  var r = ROLE_INFO[ROLE];
  return '<div class="role-banner">🔑 <b>' + r.name + '</b>（RBAC 分级权限）｜ ' + r.desc + '</div>';
}
function stat(icon, bg, num, label) {
  return '<div class="stat-card"><div class="stat-icon" style="background:' + bg + '">' + icon + '</div><div><div class="stat-num">' + num + '</div><div class="stat-label">' + label + '</div></div></div>';
}
function kpi(val, label, sub, color) {
  return '<div class="kpi"><div class="k-val" style="color:' + color + '">' + val + '</div><div class="k-label">' + label + '</div><div class="k-sub" style="color:var(--text-3)">' + sub + '</div></div>';
}
function tl(t, d) { return '<div class="tl-item"><div class="tl-t">' + t + '</div><div class="tl-d">' + d + '</div></div>'; }
function card(title, body) { return '<div class="card"><div class="card-title">' + title + '</div>' + body + '</div>'; }
function render(html) {
  disposeCharts();
  var el = document.getElementById('main');
  if (el) el.innerHTML = '<div class="page">' + html + '</div>';
}

/* 跨端口需求流转：员工移动端提交的需求，统一回流至中心端「需求审批中心」 */
function staffAddReq(r) {
  try {
    var extra = JSON.parse(localStorage.getItem('cx_req_extra') || '[]');
    extra.unshift(r);
    localStorage.setItem('cx_req_extra', JSON.stringify(extra));
  } catch (e) {}
}
(function () {
  if (window.CX && CX.requirements) {
    try {
      var extra = JSON.parse(localStorage.getItem('cx_req_extra') || '[]');
      extra.forEach(function (r) {
        if (!CX.requirements.some(function (x) { return x.id === r.id; })) CX.requirements.unshift(r);
      });
    } catch (e) {}
  }
})();
