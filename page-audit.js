/* 审计监管：操作日志审计（高管可见全员，他人受限） */
PAGES['audit'] = function () {
  var all = CX.logs;
  // RBAC 差异：高管可见全公司所有人员操作日志；项目负责人/HR仅见本人职责范围内的操作
  var scopeLogs = ROLE === 'executive' ? all : all.filter(function (l) { return l.role === ROLE; });
  var modName = { 'bi-company':'公司总览', 'bi-project':'项目经营', 'bi-compliance':'人力合规', 'bi-client':'客户价值', 'dashboard':'工作台', 'sd-ticket':'风险工单', 'sd-bid':'投标测算', 'sd-health':'健康评分', 'ops-attend':'考勤薪酬', 'staff-file':'员工档案', 'sys-rbac':'规则引擎', 'login':'系统登录' };
  var html = header('操作日志审计', '全量操作留痕 · 满足合规溯源与内部监督', '<span class="tag ' + (ROLE === 'executive' ? 'tag-purple' : 'tag-blue') + '">' + (ROLE === 'executive' ? '全量视图（高管）' : '受限视图（' + ROLE_INFO[ROLE].name + '）') + '</span>') + roleBanner();
  html += '<div class="role-banner" style="background:#fff7e6;border-color:#ffd591;color:#874d00">🔍 <b>权限差异说明：</b>企业高管拥有「全量审计」权限，可查看全公司所有人员的操作动态（查询、处置、导出、配置等），全面掌握各岗位工作进展；项目负责人仅可查看本人分管范围内的操作记录，HR管理员仅可查看人力相关操作，系统管理员的操作亦纳入高管审计视野。所有操作（含AI模型调用）均留存日志，支持回溯与责任界定。</div>';
  html += '<div class="grid g4" style="margin-bottom:16px">' +
    stat('📜', 'var(--primary-light)', scopeLogs.length, (ROLE === 'executive' ? '全公司操作记录' : '本职责范围记录')) +
    stat('👤', '#efeaff', (ROLE === 'executive' ? all.length : scopeLogs.length), '可审计人员/操作') +
    stat('🛡', '#e6f7f1', '100%', '操作留痕覆盖率') +
    stat('⏱', '#fff3e5', scopeLogs.length ? scopeLogs[0].time.slice(0,10) : '-', '最近操作日期') + '</div>';
  html += '<div class="grid g32" style="margin-bottom:16px"><div class="card"><div class="card-title">操作模块分布（当前视图）</div><div id="c-audit-mod" class="chart-sm"></div></div>' +
    '<div class="card"><div class="card-title">权限与审计范围</div>' +
    '<div class="list-row"><span><span class="tag tag-purple">企业高管</span> 查看全公司所有人员操作日志，掌握全员工作动态</span><span class="tag tag-green">全量</span></div>' +
    '<div class="list-row"><span><span class="tag tag-blue">项目负责人</span> 仅查看本人分管项目部相关操作</span><span class="tag tag-gray">受限</span></div>' +
    '<div class="list-row"><span><span class="tag tag-blue">HR管理员</span> 仅查看人力相关操作（档案/社保/考勤）</span><span class="tag tag-gray">受限</span></div>' +
    '<div class="list-row"><span><span class="tag tag-gray">系统管理员</span> 配置类操作纳入高管审计视野</span><span class="tag tag-green">受审计</span></div>' +
    '<div style="margin-top:10px;font-size:12.5px;color:var(--text-3)">日志字段：操作时间 · 操作人 · 所属部门 · 操作类型 · 目标模块 · 来源IP · 结果，可作为内部审计与责任界定的依据。</div></div></div>';
  html += '<div class="card"><div class="card-title">操作日志明细<span class="more">' + (ROLE === 'executive' ? '高管全量视图' : '仅显示职责范围内记录') + '</span></div><div class="table-wrap"><table class="data"><thead><tr>' +
    '<th>操作时间</th><th>操作人</th><th>所属部门</th><th>操作类型</th><th>目标模块</th><th>来源IP</th><th>结果</th></tr></thead><tbody>' +
    scopeLogs.map(function (l) {
      return '<tr><td>' + l.time + '</td><td>' + l.user + '</td><td>' + l.dept + '</td><td>' + l.action + '</td><td>' + (modName[l.target] || l.target) + '</td><td>' + l.ip + '</td><td><span class="tag tag-green">成功</span></td></tr>';
    }).join('') + '</tbody></table></div></div>';
  render(html);
  var cnt = {};
  scopeLogs.forEach(function (l) { cnt[modName[l.target] || l.target] = (cnt[modName[l.target] || l.target] || 0) + 1; });
  var keys = Object.keys(cnt);
  mkChart('c-audit-mod', Object.assign({}, CHART_BASE, {
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: keys, axisLabel: { fontSize: 11 } },
    yAxis: { type: 'value', name: '操作次数', minInterval: 1 },
    series: [{ type: 'bar', barWidth: 18, itemStyle: { borderRadius: [6, 6, 0, 0] }, data: keys.map(function (k) { return cnt[k]; }) }]
  }), 280);
};
