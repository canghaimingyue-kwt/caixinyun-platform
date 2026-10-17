/* 协同审批：需求发起与审批（三类端口共用：项目负责人 / 职能管理者 / 高管） */
var REQ_ROLE = {
  executive: '高管', manager: '项目负责人', hr: '职能管理者(HR)', other: '其他管理者',
  employee: '员工', frontline: '一线管理者'
};
var REQ_TO = {
  '招聘需求': ['hr'], '培训需求': ['hr'], '预算报批': ['executive'],
  '请假异动': ['manager'], '排班调整': ['manager'], '其他': ['executive', 'hr', 'manager']
};
PAGES['req'] = function () {
  var html = header('需求审批中心', '三类端口协同：发起需求 → 路由审批 → 闭环', '<span class="tag ' + (ROLE === 'executive' ? 'tag-purple' : 'tag-blue') + '">' + REQ_ROLE[ROLE] + ' 端口</span>') + roleBanner();
  html += '<div class="role-banner" style="background:#eef6ff;border-color:#adc6ff;color:#1d39c4">🔁 <b>端口协同规则：</b>项目负责人接收「员工/一线管理者」需求并审批，向职能管理者(HR)发起招聘/培训需求、向高管发起预算报批；职能管理者(HR)发起录用决策待项目经理确认；高管审批各管理层级报批。所有需求全程留痕、可追踪。</div>';
  var roleNote = ROLE === 'manager'
    ? '📥 <b>您的协同视角：</b>在此接收「员工 / 一线管理者」的需求并审批，向职能管理者(HR)发起招聘 / 培训需求、向高管发起预算报批，并确认 HR 推送的录用决策（系统操作审批）。'
    : ROLE === 'hr'
    ? '📥 <b>您的协同视角：</b>在此接收「项目负责人」的招聘 / 培训需求并推进，向项目负责人推送录用决策待确认，并向高管发起社保整改等预算报批。'
    : '📥 <b>您的高管视角：</b>在此审批来自项目负责人、职能管理者(HR)、其他管理者等各管理层级提交的预算与资源报批需求，统一把控资金与承接决策。';
  html += '<div class="role-banner" style="background:#fff7e6;border-color:#ffd591;color:#ad6800">' + roleNote + '</div>';
  var mine = CX.requirements.filter(function (r) { return r.to === ROLE && (r.status === '待审批' || r.status === '待处理' || r.status === '待项目经理确认'); });
  var sent = CX.requirements.filter(function (r) { return r.fromRole === ROLE; });
  var done = CX.requirements.filter(function (r) { return r.status === '已完成' || r.status === '已批准' || r.status === '已通过' || r.status === '已驳回'; }).length;
  html += '<div class="grid g4" style="margin-bottom:16px">' +
    stat('📥', 'var(--primary-light)', mine.length, '待我审批') +
    stat('📤', '#efeaff', sent.length, '我发起的') +
    stat('✅', '#e6f7f1', done, '已办结（全端口）') +
    stat('🧭', '#fff3e5', '3', '协同端口') + '</div>';
  // 发起需求
  html += '<div class="card"><div class="card-title">发起需求<span class="more">选择类型后系统自动建议接收端口</span></div>' +
    '<div class="grid g2" style="gap:12px">' +
    '<div><div style="font-size:12.5px;color:var(--text-2);margin-bottom:6px">需求类型</div><select id="rq-type" class="login-input" onchange="rqTo()">' +
    ['招聘需求', '培训需求', '预算报批', '请假异动', '排班调整', '其他'].map(function (t) { return '<option>' + t + '</option>'; }).join('') + '</select></div>' +
    '<div><div style="font-size:12.5px;color:var(--text-2);margin-bottom:6px">接收端口</div><select id="rq-to" class="login-input"></select></div>' +
    '<div style="grid-column:1/3"><div style="font-size:12.5px;color:var(--text-2);margin-bottom:6px">需求标题</div><input id="rq-title" class="login-input" placeholder="一句话描述需求"></div>' +
    '<div><div style="font-size:12.5px;color:var(--text-2);margin-bottom:6px">优先级</div><select id="rq-pri" class="login-input"><option>高</option><option selected>中</option><option>低</option></select></div>' +
    '<div><div style="font-size:12.5px;color:var(--text-2);margin-bottom:6px">金额/预算（万元，非预算类填0）</div><input id="rq-amt" class="login-input" value="0"></div>' +
    '<div style="grid-column:1/3"><div style="font-size:12.5px;color:var(--text-2);margin-bottom:6px">需求说明</div><textarea id="rq-desc" class="login-input" rows="2" placeholder="补充背景与诉求"></textarea></div>' +
    '</div><button class="btn" style="margin-top:12px" onclick="rqSend()">提交需求</button></div>';
  // 待我审批
  html += '<div class="card"><div class="card-title">待我审批 / 接收的需求<span class="more">点击「同意 / 驳回」完成端口流转</span></div><div id="rq-inbox">';
  if (!mine.length) html += '<div style="padding:18px;color:var(--text-3);text-align:center">当前没有需要您审批的需求 ✓</div>';
  mine.forEach(function (r) { html += reqCard(r, true); });
  html += '</div></div>';
  // 我发起的
  html += '<div class="card"><div class="card-title">我发起的需求（跟踪状态）</div><div id="rq-sent">';
  if (!sent.length) html += '<div style="padding:18px;color:var(--text-3);text-align:center">您尚未发起需求</div>';
  sent.forEach(function (r) { html += reqCard(r, false); });
  html += '</div></div>';
  render(html);
  window.rqTo = function () {
    var t = document.getElementById('rq-type').value;
    var sel = document.getElementById('rq-to');
    sel.innerHTML = (REQ_TO[t] || ['executive']).map(function (k) { return '<option value="' + k + '">' + REQ_ROLE[k] + '</option>'; }).join('');
  };
  window.rqSend = function () {
    var t = document.getElementById('rq-type').value;
    var to = document.getElementById('rq-to').value;
    var title = document.getElementById('rq-title').value || (t + '（未命名）');
    var pri = document.getElementById('rq-pri').value;
    var amt = parseFloat(document.getElementById('rq-amt').value) || 0;
    var desc = document.getElementById('rq-desc').value || '（无补充说明）';
    CX.requirements.unshift({ id: 'R2026-' + (40 + CX.requirements.length), type: t, title: title, from: REQ_ROLE[ROLE] + '·我', fromRole: ROLE, to: to, amount: amt, priority: pri, status: to === 'hr' ? '待处理' : '待审批', created: '2026-10-17', desc: desc });
    PAGES['req']();
  };
  window.rqAct = function (id, act) {
    var r = CX.requirements.find(function (x) { return x.id === id; });
    if (!r) return;
    r.status = act === 'ok' ? (r.to === 'executive' ? '已批准' : '已通过') : '已驳回';
    PAGES['req']();
  };
  rqTo();
};
function reqCard(r, actionable) {
  var st = r.status;
  var stTag = st === '待审批' || st === '待处理' || st === '待项目经理确认'
    ? '<span class="tag tag-orange">' + st + '</span>'
    : st === '已通过' || st === '已批准' || st === '已完成'
    ? '<span class="tag tag-green">' + st + '</span>'
    : '<span class="tag tag-red">' + st + '</span>';
  var priTag = r.priority === '高' ? '<span class="tag tag-red">高</span>' : r.priority === '中' ? '<span class="tag tag-orange">中</span>' : '<span class="tag tag-gray">低</span>';
  var html = '<div style="border:1px solid var(--border);border-radius:10px;padding:12px;margin-bottom:10px">' +
    '<div style="display:flex;justify-content:space-between;align-items:center"><div><b>' + r.title + '</b> <span class="tag tag-blue">' + r.type + '</span> ' + priTag + (r.amount ? ' <span class="tag tag-purple">' + r.amount + '万</span>' : '') + '</div>' + stTag + '</div>' +
    '<div style="font-size:12px;color:var(--text-3);margin:6px 0">' + r.id + ' ｜ ' + r.from + ' → ' + REQ_ROLE[r.to] + ' ｜ ' + r.created + '</div>' +
    '<div style="font-size:12.5px;color:var(--text-2);line-height:1.7">' + r.desc + '</div>';
  if (actionable) {
    html += '<div style="margin-top:8px;display:flex;gap:8px">' +
      '<button class="btn sm" onclick="rqAct(\'' + r.id + '\',\'ok\')">同意 / 确认</button>' +
      '<button class="btn sm plain" onclick="rqAct(\'' + r.id + '\',\'no\')">驳回</button></div>';
  }
  return html + '</div>';
}
function reqWidgetHtml(role) {
  var title = role === 'executive' ? '审批中枢 · 待我批准'
    : role === 'manager' ? '需求协同 · 我的审批与发起'
    : '需求协同 · 招聘管道与决策';
  var inbox = CX.requirements.filter(function (r) { return r.to === role && (r.status === '待审批' || r.status === '待处理' || r.status === '待项目经理确认'); });
  var sent = CX.requirements.filter(function (r) { return r.fromRole === role; });
  var html = '<div class="card"><div class="card-title">' + title + '<span class="more">' + inbox.length + ' 待办 · ' + sent.length + ' 已发起</span></div>';
  if (!inbox.length) html += '<div style="padding:14px;color:var(--text-3);text-align:center;font-size:13px">暂无待处理需求 ✓</div>';
  inbox.slice(0, 4).forEach(function (r) {
    html += '<div class="req-mini"><div class="rm-t"><b>' + r.title + '</b> <span class="tag tag-orange">' + r.type + '</span></div>' +
      '<div class="rm-s">' + r.id + ' ｜ ' + r.from + ' ｜ ' + r.created + '</div></div>';
  });
  html += '<button class="btn sm plain" style="margin-top:8px" onclick="go(\'req\')">进入需求审批中心 ›</button></div>';
  return html;
}
