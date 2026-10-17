/* 员工移动端（微信小程序 H5 版）：与中心管理端、甲方客户端共用 core.js 组件层与 CX 数据底座 */
(function () {
  if (location.search.indexOf('demo') >= 0) { sessionStorage.setItem('cx_staff', sessionStorage.getItem('cx_staff') || '张×'); sessionStorage.setItem('cx_staff_proj', sessionStorage.getItem('cx_staff_proj') || '甲铁路局乘务服务一队'); }
  if (!sessionStorage.getItem('cx_staff')) { location.href = 'staff-login.html'; return; }
  var me = sessionStorage.getItem('cx_staff');
  var proj = sessionStorage.getItem('cx_staff_proj') || '甲铁路局乘务服务一队';

  // 当前日期（演示基准 2026-10-17）
  var TY = 2026, TM = 9, TD = 17;
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  var HOURS = ''; for (var h = 0; h < 24; h++) HOURS += '<option>' + pad(h) + '</option>';
  var MINS = ''; for (var m = 0; m < 60; m++) MINS += '<option>' + pad(m) + '</option>';

  // 请假日历选择状态
  var calY = TY, calM = TM, pickMode = 'start', lvStart = '', lvEnd = '';

  function go(t) { location.hash = '#/' + t; }
  function slogout() { sessionStorage.removeItem('cx_staff'); location.href = 'staff-login.html'; }
  window.go = go; window.slogout = slogout;

  function myReq() {
    try { return JSON.parse(localStorage.getItem('cx_req_extra') || '[]').filter(function (r) { return r.fromRole === 'employee'; }); }
    catch (e) { return []; }
  }

  // 通用月历渲染：marks={day:'ok'|'late'|'rest'|'future'}，clickable 时点击回填请假时间
  function calHTML(y, m, marks, clickable) {
    var wk = ['日', '一', '二', '三', '四', '五', '六'];
    var first = new Date(y, m, 1).getDay();
    var days = new Date(y, m + 1, 0).getDate();
    var cells = [];
    for (var i = 0; i < first; i++) cells.push('<div class="cal-cell empty"></div>');
    var selStr = pickMode === 'start' ? lvStart : lvEnd;
    for (var d = 1; d <= days; d++) {
      var cls = marks[d] || '';
      if (y === TY && m === TM && d === TD) cls += ' today';
      if (clickable && selStr && selStr.slice(0, 10) === y + '-' + pad(m + 1) + '-' + pad(d)) cls += ' sel';
      var clk = clickable ? ' onclick="pickDay(' + d + ')"' : '';
      var clkCls = clickable ? ' clk' : '';
      cells.push('<div class="cal-cell' + clkCls + ' ' + cls.trim() + '"' + clk + '>' + d + '</div>');
    }
    return '<div class="cal"><div class="cal-h"><span onclick="calMove(-1)">‹</span><b>' + y + '年' + (m + 1) + '月</b><span onclick="calMove(1)">›</span></div>' +
      '<div class="cal-wk">' + wk.map(function (w) { return '<span>' + w + '</span>'; }).join('') + '</div>' +
      '<div class="cal-grid">' + cells.join('') + '</div>' +
      (clickable ? '<div class="cal-time">时间：<select id="calH" class="s-input" style="width:62px;display:inline;margin:0 4px">' + HOURS + '</select> 时 <select id="calMin" class="s-input" style="width:62px;display:inline;margin:0 4px">' + MINS + '</select> 分</div>' : '') +
      '</div>';
  }
  window.pickDay = function (d) {
    var hh = document.getElementById('calH').value, mm = document.getElementById('calMin').value;
    var s = calY + '-' + pad(calM + 1) + '-' + pad(d) + ' ' + hh + ':' + mm;
    if (pickMode === 'start') { lvStart = s; pickMode = 'end'; } else { lvEnd = s; }
    req();
  };
  window.calMove = function (n) { calM += n; if (calM < 0) { calM = 11; calY--; } if (calM > 11) { calM = 0; calY++; } req(); };
  window.setMode = function (mode) { pickMode = mode; req(); };

  function home() {
    var reqs = myReq();
    var html = '';
    html += '<div class="s-card"><div class="s-greet">Hi，' + me + ' 👋</div><div class="s-sub">' + proj + ' · 乘务服务员 · 在职</div></div>';
    html += '<div class="s-pay"><div class="s-sub" style="color:#dffaef">2026-09 实发工资（脱敏）</div><div class="big">¥ 6,842</div>' +
      '<div style="font-size:12px;opacity:.9;margin-top:4px">含绩效 ¥1,200 ｜ 代扣社保 ¥612 ｜ 个税 ¥38</div></div>';
    html += '<div class="s-card"><div class="s-row"><span>本月出勤</span><b>21 / 22 天</b></div>' +
      '<div class="s-row"><span>在岗状态</span><span class="s-pill" style="background:#e9f9ef">正常在岗</span></div>' +
      '<div class="s-row"><span>我的待办</span><b>' + reqs.filter(function (r) { return r.status === '待审批'; }).length + ' 项审批中</b></div></div>';
    html += '<div class="s-card"><div style="font-size:13px;font-weight:600;margin-bottom:6px">快捷入口</div>' +
      '<button class="s-btn" onclick="go(\'pay\')">查看工资条</button>' +
      '<button class="s-btn ghost" onclick="go(\'att\')">考勤打卡</button>' +
      '<button class="s-btn ghost" onclick="go(\'train\')">培训认证</button>' +
      '<button class="s-btn ghost" onclick="go(\'req\')">发起请假 / 需求</button></div>';
    if (reqs.length) {
      html += '<div class="s-card"><div style="font-size:13px;font-weight:600;margin-bottom:6px">我的申请（已回流中心端）</div>' +
        reqs.map(function (r) { return '<div class="s-row"><span>' + r.title + '</span><span class="s-pill">' + r.status + '</span></div>'; }).join('') + '</div>';
    }
    render(html);
  }

  function pay() {
    var html = '<div class="s-pay"><div class="s-sub" style="color:#dffaef">2026-09 工资条（脱敏 · 仅本人可见）</div><div class="big">¥ 6,842</div></div>';
    html += '<div class="s-card"><div class="s-row"><span>基本工资</span><b>¥ 5,000</b></div>' +
      '<div class="s-row"><span>绩效奖金</span><b>¥ 1,200</b></div>' +
      '<div class="s-row"><span>加班 / 津补贴</span><b>¥ 1,292</b></div>' +
      '<div class="s-row"><span>代扣社保</span><b style="color:#fa5151">- ¥ 612</b></div>' +
      '<div class="s-row"><span>代扣个税</span><b style="color:#fa5151">- ¥ 38</b></div>' +
      '<div class="s-row"><span>实发合计</span><b style="color:#07c060">¥ 6,842</b></div></div>';
    html += '<div class="s-card" style="font-size:12px;color:var(--text-3)">工资条由才薪云（思瑞达）统一核算并推送；甲方端仅可见对外协作口径，员工级明细仅本人于此端口查看，保障隐私合规。</div>';
    render(html);
  }

  var clocked = false;
  function att() {
    var marks = {};
    for (var d = 1; d <= TD; d++) marks[d] = (d === 10 ? 'late' : 'ok');
    for (var f = TD + 1; f <= 31; f++) marks[f] = 'future';
    var html = '<div class="s-card" style="text-align:center"><div style="font-size:13px;color:var(--text-3)">今日状态</div>' +
      '<div style="font-size:20px;font-weight:700;margin:6px 0;color:' + (clocked ? '#07c060' : '#8a94a6') + '">' + (clocked ? '已打卡 ✓' : '未打卡') + '</div>' +
      '<button class="s-btn" onclick="sClock()">' + (clocked ? '下班打卡' : '上班打卡') + '</button></div>';
    html += '<div class="s-card"><div style="font-size:13px;font-weight:600;margin-bottom:6px">考勤日历 · 2026年10月</div>' +
      calHTML(TY, TM, marks, false) +
      '<div style="font-size:11px;color:var(--text-3);margin-top:8px">🟢 正常 ｜ 🟠 迟到 ｜ ⚪ 未到</div></div>';
    html += '<div class="s-card"><div style="font-size:13px;font-weight:600;margin-bottom:6px">本月出勤</div>' +
      '<div class="s-row"><span>应出勤</span><b>22 天</b></div><div class="s-row"><span>已出勤</span><b>21 天</b></div>' +
      '<div class="s-row"><span>迟到 / 缺勤</span><b>1 次</b></div></div>';
    html += '<div class="s-card"><div style="font-size:13px;font-weight:600;margin-bottom:6px">本周排班</div>' +
      ['10-17 早班 06:30-14:30', '10-18 早班 06:30-14:30', '10-19 休息', '10-20 晚班 14:30-22:30', '10-21 晚班 14:30-22:30'].map(function (x) {
        return '<div class="s-row"><span>' + x + '</span></div>';
      }).join('') + '</div>';
    render(html);
  }
  window.sClock = function () { clocked = !clocked; att(); };

  function req() {
    var html = '<div class="s-card"><div class="s-greet" style="font-size:15px">发起请假 / 需求</div>' +
      '<div class="s-sub">提交后将统一回流至中心端「需求审批中心」，由项目负责人审批</div></div>';
    var hint = pickMode === 'start' ? '① 请选择「开始时间」' : '② 请选择「结束时间」';
    var sBtn = '<button class="s-btn ghost" onclick="setMode(\'start\')"' + (pickMode === 'start' ? ' style="border:1px solid #07c060;color:#07c060"' : '') + '>开始时间：' + (lvStart || '请选择 ›') + '</button>';
    var eBtn = '<button class="s-btn ghost" onclick="setMode(\'end\')"' + (pickMode === 'end' ? ' style="border:1px solid #07c060;color:#07c060"' : '') + '>结束时间：' + (lvEnd || '请选择 ›') + '</button>';
    html += '<div class="s-card"><select id="rq-t" class="s-input"><option>请假异动</option><option>其他</option></select>' +
      sBtn + eBtn +
      '<div style="font-size:12px;color:#07c060;margin:8px 0 2px">' + hint + '</div>' +
      calHTML(calY, calM, {}, true) +
      '<textarea id="rq-desc" class="s-input" rows="2" placeholder="请假事由（文字说明）" style="margin-top:8px"></textarea>' +
      '<button class="s-btn" onclick="sSend()">提交申请</button></div>';
    var mine = myReq();
    if (mine.length) {
      html += '<div class="s-card"><div style="font-size:13px;font-weight:600;margin-bottom:6px">我的申请</div>' +
        mine.map(function (r) { return '<div class="s-row"><span>' + r.title + '</span><span class="s-pill">' + r.status + '</span></div>'; }).join('') + '</div>';
    }
    render(html);
  }
  window.sSend = function () {
    var t = document.getElementById('rq-t').value;
    var desc = document.getElementById('rq-desc').value || '（无补充说明）';
    if (!lvStart || !lvEnd) { alert('请通过日历选择请假的开始与结束时间（年月日时分）'); return; }
    var title = t + '：' + lvStart + ' ~ ' + lvEnd;
    staffAddReq({ id: 'R' + Date.now(), type: t, title: title, from: '员工·' + me, fromRole: 'employee', to: 'manager', amount: 0, priority: '中', status: '待审批', created: '2026-10-17', desc: desc });
    alert('已提交，需求已回流至中心端「需求审批中心」，项目负责人将收到审批 ✓');
    lvStart = ''; lvEnd = '';
    req();
  };

  function train() {
    var courses = [
      { t: '高铁服务礼仪与沟通', p: 80, tag: '线上', c: '#07c060' },
      { t: '安全防护专项培训', p: 100, tag: '已认证', c: '#07c060' },
      { t: '应急处置与消防演练', p: 40, tag: '线下', c: '#fa8c16' },
      { t: 'AI 工具提效训练营', p: 15, tag: '线上', c: '#1677ff' }
    ];
    var html = '<div class="s-card"><div class="s-greet" style="font-size:15px">培训与成长 🎓</div><div class="s-sub">学时累计 86h ｜ 年度目标 120h</div>' +
      '<div class="s-bar"><i style="width:72%"></i></div></div>';
    html += '<div class="s-card"><div style="font-size:13px;font-weight:600;margin-bottom:6px">学习任务</div>' +
      courses.map(function (c) {
        return '<div style="margin-bottom:10px"><div class="s-row" style="border:none;padding:2px 0"><span>' + c.t + '</span><span class="s-chip">' + c.tag + '</span></div>' +
          '<div class="s-bar"><i style="width:' + c.p + '%;background:' + c.c + '"></i></div>' +
          '<div style="font-size:11px;color:var(--text-3);margin-top:3px">进度 ' + c.p + '%' + (c.p >= 100 ? ' · 已完成' : '') + '</div></div>';
      }).join('') + '</div>';
    html += '<div class="s-card"><div style="font-size:13px;font-weight:600;margin-bottom:6px">我的证书</div>' +
      '<div class="s-row"><span>📜 安全防护专项培训合格证</span><span class="s-pill">有效</span></div>' +
      '<div class="s-row"><span>📜 高铁服务礼仪认证</span><span class="s-pill">有效</span></div></div>';
    html += '<div class="s-card"><div style="font-size:13px;font-weight:600;margin-bottom:6px">报名通道</div>' +
      '<button class="s-btn ghost" onclick="alert(\'演示：进入培训商城报名\')">浏览全部课程 ›</button></div>';
    render(html);
  }

  function me() {
    var html = '<div class="s-card"><div class="s-greet" style="font-size:15px">个人中心</div>' +
      '<div class="s-sub">' + me + ' ｜ ' + proj + '</div>' +
      '<div class="s-row"><span>岗位</span><b>乘务服务员</b></div>' +
      '<div class="s-row"><span>工号</span><b>CR-' + (TD * 37 % 9000 + 1000) + '</b></div>' +
      '<div class="s-row"><span>入职</span><b>2023-03-15</b></div></div>';
    html += '<div class="s-card"><div style="font-size:13px;font-weight:600;margin-bottom:6px">AI 问答</div>' +
      '<div class="s-chat" id="chat"><div class="a"><span>你好，我是才薪云 AI 助手，可解答工资、考勤、请假、培训等问题。</span></div></div>' +
      '<input id="ai-q" class="s-input" placeholder="输入问题，如：我的工资怎么算？">' +
      '<button class="s-btn" onclick="sAsk()">发送</button></div>';
    render(html);
  }
  window.sAsk = function () {
    var q = (document.getElementById('ai-q').value || '').trim();
    if (!q) return;
    var a = q.indexOf('工资') >= 0 || q.indexOf('薪资') >= 0 ? '您的工资由基本工资+绩效+津补贴构成，代扣社保与个税后实发。9月实发 ¥6,842，明细可在「工资条」查看。'
      : q.indexOf('请假') >= 0 ? '请到「请假」页通过日历选择起止时间（年月日时分）并提交，系统会回流至中心端需求审批中心，由项目负责人审批。'
      : q.indexOf('培训') >= 0 ? '您可在「培训」查看学习任务与证书；安全防护专项培训已完成认证，年度学时 86/120h。'
      : q.indexOf('考勤') >= 0 ? '本月应出勤 22 天、已出勤 21 天，可在「考勤」查看日历与排班。'
      : '已收到您的问题：「' + q + '」。常见工资、考勤、请假、培训问题我可直接解答，复杂问题将转人工客服。';
    var c = document.getElementById('chat');
    c.innerHTML += '<div class="q"><span>' + q + '</span></div><div class="a"><span>' + a + '</span></div>';
    document.getElementById('ai-q').value = '';
    c.scrollTop = c.scrollHeight;
  };

  function route() {
    var t = (location.hash || '#/home').replace('#/', '');
    var map = { home: home, pay: pay, att: att, req: req, train: train, me: me };
    (map[t] || home)();
    var tabs = document.getElementById('tabs').children;
    for (var i = 0; i < tabs.length; i++) tabs[i].classList.toggle('active', tabs[i].getAttribute('data-t') === t);
  }
  window.addEventListener('hashchange', route);
  route();
})();
