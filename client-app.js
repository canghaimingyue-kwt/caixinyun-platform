/* 甲方客户端：独立门户应用（与内部管理端共用 core.js 组件层与 CX 数据底座） */
(function () {
  if (location.search.indexOf('demo') >= 0) sessionStorage.setItem('cx_client', sessionStorage.getItem('cx_client') || '甲铁路局');
  if (!sessionStorage.getItem('cx_client')) { location.href = 'client-login.html'; return; }
  var client = sessionStorage.getItem('cx_client');
  var uploads = [
    { name: '2026-08 乘务一队 甲方自行统计薪资.xlsx', date: '2026-09-02', status: '已回流至才薪云' }
  ];

  function go(p) { location.hash = '#/' + p; }
  function nav(active) {
    var items = [['overview', '履约总览'], ['payroll', '薪资考勤'], ['receipt', '考核回执']];
    return '<div class="client-nav">' + items.map(function (it) {
      return '<span class="cn-item' + (it[0] === active ? ' active' : '') + '" onclick="go(\'' + it[0] + '\')">' + it[1] + '</span>';
    }).join('') + '</div>';
  }

  function overview() {
    var html = '';
    html += '<div class="client-hero"><div><div class="ch-title">' + client + ' · 协同门户</div>' +
      '<div class="ch-sub">脱敏履约视图 · 项目进度 / 考核回执 / 数据看板</div></div>' +
      '<div class="ch-time">数据更新：2026-10-17 09:00</div></div>';
    html += '<div class="grid g4" style="margin-bottom:16px">' +
      stat('📁', '#e6f7f1', 3, '在履约项目') + stat('👷', '#efeaff', '326', '在岗人员') +
      stat('✅', '#e6f7f1', '98.2%', '考勤到岗率') + stat('⭐', '#fff3e5', '4.7/5', '甲方满意度') + '</div>';
    html += '<div class="card"><div class="card-title">项目履约进度（脱敏）</div><div class="table-wrap"><table class="data"><thead><tr><th>项目</th><th>人员到岗</th><th>工时合规</th><th>考核回执</th><th>状态</th></tr></thead><tbody>' +
      [['甲铁路局乘务服务一队', '98%', '99%', '已回传', '<span class="tag tag-green">正常</span>'],
       ['乙铁路局高铁客运服务队', '95%', '97%', '已回传', '<span class="tag tag-green">正常</span>'],
       ['丙轨枕预制一线', '92%', '94%', '待回传', '<span class="tag tag-orange">关注</span>']].map(function (r) {
        return '<tr><td>' + r[0] + '</td><td>' + r[1] + '</td><td>' + r[2] + '</td><td>' + r[3] + '</td><td>' + r[4] + '</td></tr>';
      }).join('') + '</tbody></table></div></div>';
    html += '<div class="card"><div class="card-title">脱敏数据看板（甲方可见范围）</div><div class="grid g3" style="gap:12px">' +
      '<div style="background:#f3fbf7;border:1px solid #b7eb8f;border-radius:10px;padding:14px"><b style="color:#13a86a">人员到岗率</b><div style="font-size:24px;font-weight:700;margin-top:6px">98.2%</div><div style="font-size:12px;color:var(--text-3)">高于合同约定 95%</div></div>' +
      '<div style="background:#f3fbf7;border:1px solid #b7eb8f;border-radius:10px;padding:14px"><b style="color:#13a86a">工时合规率</b><div style="font-size:24px;font-weight:700;margin-top:6px">97.5%</div><div style="font-size:12px;color:var(--text-3)">AI 识别违规已闭环</div></div>' +
      '<div style="background:#f3fbf7;border:1px solid #b7eb8f;border-radius:10px;padding:14px"><b style="color:#13a86a">服务投诉率</b><div style="font-size:24px;font-weight:700;margin-top:6px">0.3%</div><div style="font-size:12px;color:var(--text-3)">近30天</div></div></div>' +
      '<div style="margin-top:8px;font-size:12.5px;color:var(--text-3)">甲方客户端与中心管理端共享同一数据底座与 AI 能力池：履约数据由中心端实时回流，考核回执由甲方在此端口上传，双向互通、脱敏呈现。您看到的均为对外脱敏口径，成本、毛利与内部薪资不在可见范围。</div></div>';
    return html;
  }

  function payroll() {
    var html = '';
    html += '<div class="client-hero"><div><div class="ch-title">' + client + ' · 薪资考勤数据</div>' +
      '<div class="ch-sub">双向核对 · 甲方自行统计可上传回流，思瑞达已统报表可直接下载</div></div>' +
      '<div class="ch-time">协同模式：统算 / 下载 二选一</div></div>';
    html += '<div class="card"><div class="card-title">📥 下载区 · 思瑞达已统好的薪资考勤报表<span class="more">由才薪云（思瑞达）核算，甲方直接取用</span></div>' +
      '<div class="list-row"><span>2026-09 乘务一队 薪资明细（思瑞达统）.xlsx</span><button class="btn sm" onclick="alert(\'演示：下载 薪资明细.xlsx\')">下载</button></div>' +
      '<div class="list-row"><span>2026-09 乘务一队 考勤工时（思瑞达统）.xlsx</span><button class="btn sm" onclick="alert(\'演示：下载 考勤工时.xlsx\')">下载</button></div>' +
      '<div class="list-row"><span>2026-09 全口径社保与个税明细（思瑞达统）.xlsx</span><button class="btn sm" onclick="alert(\'演示：下载 社保个税.xlsx\')">下载</button></div></div>';
    html += '<div class="card" style="margin-top:16px"><div class="card-title">📤 上传区 · 甲方自行统计的薪资考勤<span class="more">上传后统一回流至才薪云系统归档核对</span></div>' +
      '<div style="font-size:12.5px;color:var(--text-2);margin-bottom:10px">若甲方以自有口径（站段排班、工时、绩效）先行统计，可在此上传，系统自动与才薪云回传数据做双向核对并统一归档。</div>' +
      '<div id="uploadList">' + uploads.map(function (u) {
        return '<div class="list-row"><span>' + u.name + ' <span style="color:var(--text-3);font-size:11px">(' + u.date + ')</span></span><span class="tag tag-green">' + u.status + '</span></div>';
      }).join('') + '</div>' +
      '<div style="margin-top:10px"><button class="btn sm ghost" onclick="document.getElementById(\'payFile\').click()">＋ 上传薪资考勤文件</button>' +
      '<input type="file" id="payFile" style="display:none" onchange="upPay(this)"></div></div>';
    html += '<div style="margin-top:10px;font-size:12px;color:var(--text-3)">说明：甲方端看到的薪资考勤为对外协作口径，已屏蔽单人员工级敏感明细；如需员工级工资条，请通过「员工移动端」由员工本人查看。</div>';
    return html;
  }
  window.upPay = function (inp) {
    if (!inp.files || !inp.files.length) return;
    uploads.unshift({ name: inp.files[0].name, date: '2026-10-17', status: '已回流至才薪云' });
    var box = document.getElementById('uploadList');
    if (box) box.innerHTML = uploads.map(function (u) {
      return '<div class="list-row"><span>' + u.name + ' <span style="color:var(--text-3);font-size:11px">(' + u.date + ')</span></span><span class="tag tag-green">' + u.status + '</span></div>';
    }).join('');
    inp.value = '';
    alert('已上传并回流至才薪云系统，等待思瑞达核对归档 ✓');
  };

  function receipt() {
    var html = '';
    html += '<div class="client-hero"><div><div class="ch-title">' + client + ' · 考核回执上传</div>' +
      '<div class="ch-sub">甲方对服务质量的考核结果回传，作为才薪云结算与服务改进依据</div></div>' +
      '<div class="ch-time">月度回传</div></div>';
    html += '<div class="card"><div class="card-title">考核回执上传</div>' +
      '<div class="list-row"><span>2026-10 甲铁路局乘务服务一队 考核回执</span><span class="tag tag-green">已上传</span></div>' +
      '<div class="list-row"><span>2026-10 乙铁路局高铁客运服务队 考核回执</span><span class="tag tag-green">已上传</span></div>' +
      '<div class="list-row"><span>2026-10 丙轨枕预制一线 考核回执</span><span class="tag tag-orange">待上传</span></div>' +
      '<div style="margin-top:10px"><button class="btn sm ghost" onclick="alert(\'演示：打开回执上传\')">＋ 上传考核回执</button></div></div>';
    html += '<div class="card" style="margin-top:16px"><div class="card-title">考核口径说明</div>' +
      '<div style="font-size:12.5px;color:var(--text-2);line-height:1.9">甲方按月回传服务质量考核（安全、投诉、响应时效等），才薪云将其与内部履约数据合并，驱动服务改进与结算口径统一，形成「甲方考核 ↔ 才薪云履约」的闭环协同。</div></div>';
    return html;
  }

  function route() {
    var p = (location.hash || '#/overview').replace('#/', '');
    var body = p === 'payroll' ? payroll() : p === 'receipt' ? receipt() : overview();
    render(nav(p) + body);
  }
  window.go = go;
  window.addEventListener('hashchange', route);
  route();
  window.clogout = function () { sessionStorage.removeItem('cx_client'); location.href = 'client-login.html'; };
})();
