/* 智慧决策：风险工单闭环（AI Agent 驱动） */
PAGES['sd-ticket'] = function () {
  var html = header('风险工单闭环', 'AI Agent：智能识别 → 分级预警 → 工单派发 → 处置 → 自动核验归档', '<span class="tag tag-purple">AI Agent 驱动</span>') + roleBanner();
  html += '<div class="card"><div class="loop-steps">' +
    [['🔍 智能识别', '监测合同到期/社保异常/<br>考核扣分/高流失信号'],
     ['🧮 分级预警', '匹配知识库同类案例<br>评估风险等级红黄绿'],
     ['📨 工单派发', '生成标准化风险工单<br>推送责任人并抄送'],
     ['🛠 处置执行', '责任人整改并上传<br>处置材料'],
     ['✅ 核验归档', 'Agent核验材料完整性<br>闭环归档·复盘验证']].map(function (s, i) {
      return '<div class="loop-step' + (i === 2 ? ' hot' : '') + '"><div class="ls-t">' + s[0] + '</div><div class="ls-d">' + s[1] + '</div></div>';
    }).join('') + '</div></div>';
  html += '<div class="card"><div class="card-title">风险工单列表</div>' +
    '<div style="margin-bottom:12px;display:flex;gap:8px" id="tk-filter">' +
    ['全部', '待处置', '处置中', '已闭环'].map(function (s, i) {
      return '<button class="btn sm' + (i === 0 ? '' : ' plain') + '" data-st="' + s + '" onclick="filterTicket(\'' + s + '\')">' + s + '</button>';
    }).join('') + '</div><div id="ticket-list"></div></div>';
  render(html);
  window.filterTicket = function (st) {
    document.querySelectorAll('#tk-filter .btn').forEach(function (b) { b.className = 'btn sm' + (b.dataset.st === st ? '' : ' plain'); });
    var list = CX.tickets.filter(function (t) { return st === '全部' || t.status === st; });
    document.getElementById('ticket-list').innerHTML = list.length ? list.map(ticketHtml).join('') : '<div style="color:var(--text-3);padding:30px;text-align:center">该状态下暂无工单</div>';
  };
  window.openTicket = function (id) {
    var t = CX.tickets.find(function (x) { return x.id === id; });
    var p = CX.projects.find(function (x) { return x.id === t.project; });
    openModal('<h3>' + esc(t.title) + '</h3>' +
      '<div style="margin-bottom:12px;display:flex;gap:10px;flex-wrap:wrap"><span class="tag ' + (t.level === 'red' ? 'tag-red' : t.level === 'yellow' ? 'tag-orange' : 'tag-green') + '">' + (t.level === 'red' ? '红色高风险' : t.level === 'yellow' ? '黄色预警' : '绿色') + '</span>' +
      '<span class="tag tag-gray">工单号 ' + t.id + '</span><span class="tag tag-gray">状态：' + t.status + '</span><span class="tag tag-gray">责任人：' + t.owner + '</span><span class="tag tag-gray">创建：' + t.created + '</span></div>' +
      (p ? '<div style="font-size:12.5px;color:var(--text-2);margin-bottom:12px">关联项目：' + p.name + '　健康评分 <b class="' + scoreCls(p.score) + '">' + p.score + '</b>　毛利率 ' + p.margin + '%　扣款占收比 ' + p.dedRate + '%</div>' : '') +
      '<div class="card-title" style="margin:6px 0 8px">风险描述</div><div style="font-size:13px;color:var(--text-2);line-height:1.8;margin-bottom:12px">' + esc(t.desc) + '</div>' +
      '<div class="card-title" style="margin:6px 0 8px">AI Agent 整改建议</div>' + aiBox(esc(t.suggestion) + '<br><br><span style="font-size:12px">🤖 Agent 执行记录：' + esc(t.agent) + '</span>') +
      '<div class="card-title" style="margin:14px 0 8px">处置时间线</div><div class="timeline">' +
      '<div class="tl-item"><div class="tl-t">Agent 监测到风险信号并自动创建工单</div><div class="tl-d">匹配知识库同类案例，评估风险等级为「' + (t.level === 'red' ? '红' : t.level === 'yellow' ? '黄' : '绿') + '」，推送至' + t.owner + '</div><div class="tl-time">' + t.created + ' 09:12</div></div>' +
      '<div class="tl-item"><div class="tl-t">责任响应与处置</div><div class="tl-d">' + (t.status === '待处置' ? '等待责任人响应' : '整改动作执行中，处置材料陆续回传') + '</div><div class="tl-time">' + t.created + ' 14:30</div></div>' +
      (t.status === '已闭环' ? '<div class="tl-item"><div class="tl-t">Agent 自动核验处置结果，工单闭环归档</div><div class="tl-d">下考核周期指标回升，验证处置有效性</div><div class="tl-time">已闭环</div></div>' : '') +
      '</div>' + (t.status !== '已闭环' ? '<div style="margin-top:14px;display:flex;gap:10px"><button class="btn" onclick="closeTicket(\'' + t.id + '\')">✅ 完成处置并闭环</button><button class="btn ghost" onclick="closeModal()">稍后处理</button></div>' : '<div style="margin-top:14px"><button class="btn plain" onclick="closeModal()">关闭</button></div>'));
  };
  window.closeTicket = function (id) {
    var t = CX.tickets.find(function (x) { return x.id === id; });
    t.status = '已闭环';
    closeModal(); window.filterTicket('全部');
  };
  window.filterTicket('全部');
};
function ticketHtml(t) {
  return '<div class="ticket"><div class="t-level ' + (t.level === 'red' ? 'lev-red' : t.level === 'yellow' ? 'lev-yellow' : 'lev-green') + '"></div>' +
    '<div style="flex:1"><div class="t-title">' + esc(t.title) + '</div><div class="t-desc">' + esc(t.desc) + '</div>' +
    '<div class="t-meta"><span>工单号 ' + t.id + '</span><span>责任人 ' + t.owner + '</span><span>' + t.created + '</span>' +
    '<span class="tag ' + (t.status === '已闭环' ? 'tag-green' : t.status === '处置中' ? 'tag-blue' : 'tag-red') + '">' + t.status + '</span>' +
    '<button class="btn sm ghost" style="margin-left:auto" onclick="openTicket(\'' + t.id + '\')">查看详情</button></div></div></div>';
}
