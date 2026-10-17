/* BI 看板：公司总览 / 项目经营 / 人力合规 / 客户价值 */
PAGES['bi-company'] = function () {
  var html = header('公司总览看板', '高管驾驶舱：宏观经营 + 全局风险汇总 · 支持下钻至项目/班组/人员明细') + roleBanner();
  var last = CX.trend[CX.trend.length - 1];
  var profit = +(last.rev - last.cost).toFixed(1);
  html += '<div class="grid g4" style="margin-bottom:16px">' +
    stat('💰', 'var(--primary-light)', last.rev + ' 万', '当期营收') +
    stat('📈', '#e6f7f1', (profit >= 0 ? '+' : '') + profit + ' 万', '当期净利（净利率 ' + (profit / last.rev * 100).toFixed(1) + '%）') +
    stat('👥', '#efeaff', '2,434', '一线在岗员工') +
    stat('⚠️', '#fff3e5', CX.tickets.filter(function (t) { return t.status !== '已闭环'; }).length, '待处置风险事件') + '</div>';
  html += '<div class="grid g32"><div class="card"><div class="card-title">营收 / 成本 / 净利趋势（近24个月）</div><div id="c-bi-trend" class="chart"></div></div>' +
    '<div class="card"><div class="card-title">人员概览</div>' +
    '<div class="list-row"><span>本月入职</span><span class="tag tag-green">+64</span></div>' +
    '<div class="list-row"><span>本月离职</span><span class="tag tag-red">-71</span></div>' +
    '<div class="list-row"><span>整体月流失率</span><span class="score-mid">3.1%</span></div>' +
    '<div id="c-region" class="chart-sm" style="margin-top:6px"></div></div></div>';
  html += '<div class="card"><div class="card-title">全局风险汇总<span class="more">点击跳转处置</span></div><div class="table-wrap"><table class="data"><thead><tr><th>风险类型</th><th>数量</th><th>已闭环</th><th>逾期未处置</th><th>风险集中区域</th><th>操作</th></tr></thead><tbody>' +
    '<tr><td>甲方考核扣款风险</td><td>3</td><td>1</td><td>0</td><td>庚地区、癸地区</td><td><a onclick="go(\'sd-ticket\')">查看工单</a></td></tr>' +
    '<tr><td>合同临期</td><td>3</td><td>0</td><td>0</td><td>癸地区、辛地区、庚地区</td><td><a onclick="go(\'ops-contract\')">查看</a></td></tr>' +
    '<tr><td>社保异常</td><td>3</td><td>0</td><td>0</td><td>庚地区、辛地区</td><td><a onclick="go(\'bi-compliance\')">查看</a></td></tr>' +
    '<tr><td>高流失客户</td><td>3</td><td>2</td><td>0</td><td>癸地区、辛地区、庚地区</td><td><a onclick="go(\'sd-client\')">查看</a></td></tr>' +
    '</tbody></table></div></div>';
  render(html);
  var months = CX.trend.map(function (d) { return d.m; });
  mkChart('c-bi-trend', Object.assign({}, CHART_BASE, {
    grid: { left: 52, right: 24, top: 40, bottom: 48 },
    legend: { top: 0 },
    tooltip: { trigger: 'axis', valueFormatter: function (v) { return v + ' 万元'; } },
    xAxis: { type: 'category', data: months, name: '统计月份', nameLocation: 'middle', nameGap: 30, axisLabel: { interval: 2, fontSize: 10 } },
    yAxis: { type: 'value', name: '金额（万元）', nameGap: 14 },
    series: [
      { name: '营收', type: 'bar', data: CX.trend.map(function (d) { return d.rev; }), barWidth: 10, itemStyle: { borderRadius: [3, 3, 0, 0] } },
      { name: '成本', type: 'bar', data: CX.trend.map(function (d) { return d.cost; }), barWidth: 10, itemStyle: { borderRadius: [3, 3, 0, 0] } },
      { name: '净利', type: 'line', smooth: true, data: CX.trend.map(function (d) { return +(d.rev - d.cost).toFixed(1); }), lineStyle: { width: 2.5 } }
    ]
  }), 320);
  mkChart('c-region', {
    tooltip: { trigger: 'item', formatter: '{b}：{c}%（占比 {d}%）' },
    legend: { bottom: 0, type: 'scroll' },
    series: [{ type: 'pie', radius: ['38%', '62%'], center: ['50%', '46%'], label: { fontSize: 11, formatter: '{b}\n{d}%' }, data: [
      { name: '区域一', value: 38, itemStyle: { color: '#1677ff' } }, { name: '区域二', value: 18, itemStyle: { color: '#00b578' } },
      { name: '区域三', value: 16, itemStyle: { color: '#7b61ff' } }, { name: '区域四', value: 12, itemStyle: { color: '#13c2c2' } },
      { name: '其他区域', value: 16, itemStyle: { color: '#c9d4e3' } }
    ] }]
  }, 240);
};

PAGES['bi-project'] = function () {
  var isMgr = ROLE === 'manager';
  var projects = myProjects();
  var html = header('项目经营分析看板', (isMgr ? '您分管项目视角' : '项目负责人/财务使用') + '：盈利分析与项目风险识别 · AI自动标注风险诱因') + roleBanner();
  if (isMgr) html += '<div class="role-banner" style="background:#eef6ff;border-color:#adc6ff;color:#1d39c4">📊 数据已按 RBAC 隔离：当前仅展示您分管的 ' + projects.length + ' 个项目（全司共 ' + CX.projects.length + ' 个），财务经营敏感数据不在您视野内。</div>';
  html += '<div class="grid g2" style="margin-bottom:16px">' +
    '<div class="card"><div class="card-title">跨项目毛利率对比<span class="more">低于投标准入线10%标红</span></div><div id="c-margin" class="chart"></div></div>' +
    '<div class="card"><div class="card-title">扣款占收比 × 毛利率 散点<span class="more">气泡大小=人员规模</span></div><div id="c-ded" class="chart"></div></div></div>';
  html +=     '<div class="card"><div class="card-title">项目经营明细与风险标注（按毛利率升序）<span class="more">点击项目下钻</span></div><div class="table-wrap"><table class="data"><thead><tr>' +
    '<th>项目</th><th>客户</th><th>毛利率</th><th>扣款占收比</th><th>毛利(万)</th><th>健康评分</th><th>AI 风险备注</th></tr></thead><tbody>' +
    projects.slice().sort(function (a, b) { return a.margin - b.margin; }).map(function (p) {
      var note = p.level === 'high-risk' ? '<span style="color:var(--red)">' + esc(p.riskCause) + '</span>'
        : p.dedRate > 8 ? '<span style="color:#e6861a">扣款占比偏高，建议核查现场作业合规</span>'
        : '<span style="color:var(--green)">正常</span>';
      return '<tr><td class="clickable" onclick="showProject(\'' + p.id + '\')">' + p.name + '</td><td>' + p.client + '</td>' +
        '<td class="' + (p.margin < 10 ? 'score-low' : 'score-high') + '">' + p.margin + '%</td><td>' + p.dedRate + '%</td><td>' + p.gross + '</td>' +
        '<td class="' + scoreCls(p.score) + '">' + p.score + '</td><td style="white-space:normal;max-width:320px;font-size:12px">' + note + '</td></tr>';
    }).join('') + '</tbody></table></div></div>';
  render(html);
  var sorted = projects.slice().sort(function (a, b) { return b.margin - a.margin; });
  mkChart('c-margin', Object.assign({}, CHART_BASE, {
    grid: { left: 52, right: 20, top: 40, bottom: 88 },
    tooltip: { trigger: 'axis', formatter: function (ps) { var p = ps[0]; return p.name + '<br/>毛利率：' + p.value + ' %'; } },
    xAxis: { type: 'category', data: sorted.map(function (p) { return p.name; }), axisLabel: { rotate: 40, fontSize: 10, interval: 0 }, name: '在营项目', nameLocation: 'middle', nameGap: 66 },
    yAxis: { type: 'value', name: '毛利率（%）', nameGap: 14, max: 100 },
    series: [{ name: '毛利率（%）', type: 'bar', barWidth: 14, data: sorted.map(function (p) { return { value: p.margin, itemStyle: { color: p.margin < 10 ? '#fa5151' : '#1677ff', borderRadius: [4, 4, 0, 0] } }; }),
      markLine: { data: [{ yAxis: 10, lineStyle: { color: '#fa5151', type: 'dashed' }, label: { formatter: '投标准入线 10%' } }] } }]
  }), 360);
  mkChart('c-ded', Object.assign({}, CHART_BASE, {
    tooltip: { formatter: function (p) { return p.data.name + '<br>扣款占收比 ' + p.data.value[0] + '%<br>毛利率 ' + p.data.value[1] + '%'; } },
    xAxis: { name: '扣款占收比 %', type: 'value' }, yAxis: { name: '毛利率 %', type: 'value' },
    series: [{ type: 'scatter', symbolSize: function (v) { return Math.max(8, v[2] / 12); },
      data: projects.map(function (p) { return { name: p.name, value: [p.dedRate, p.margin, p.staff], itemStyle: { color: p.level === 'high-risk' ? '#fa5151' : p.level === 'mid' ? '#ff9f43' : '#00b578', opacity: .8 } }; }) }]
  }), 360);
};

PAGES['bi-compliance'] = function () {
  var html = header('人力合规看板', 'HR中台使用：用工、社保、合同合规风险（平台核心风控看板）· 可导出合规台账') + roleBanner();
  html += '<div class="grid g4" style="margin-bottom:16px">' +
    kpi('24.94%', '社保参保率（8月样本）', '低于40%黄线 / 25%红线', 'var(--red)') +
    kpi('334 人', '未参保人员', '含213人现金补贴替代', 'var(--orange)') +
    kpi('≈302 万/年', '全员合规参保净增成本', '相当于现有全年净利1.92倍', 'var(--purple)') +
    kpi('5 人', '合同30天内到期', '自动启动预警处置流程', 'var(--primary)') + '</div>';
  html += '<div class="grid g2"><div class="card"><div class="card-title">参保状态分布（445人 · 2026年8月样本）</div><div id="c-ins" class="chart-sm"></div></div>' +
    '<div class="card"><div class="card-title">用工合规风险清单（按风险等级排序）</div>' +
    '<div class="list-row"><span><span class="tag tag-red">红</span> 213人以现金补贴替代社保缴纳</span><button class="btn sm ghost" onclick="openSocial()">整改方案</button></div>' +
    '<div class="list-row"><span><span class="tag tag-red">红</span> 121人完全未参保</span><button class="btn sm ghost" onclick="openSocial()">整改方案</button></div>' +
    '<div class="list-row"><span><span class="tag tag-orange">黄</span> 3人参保地与用工地不一致</span><span class="tag tag-blue">处置中</span></div>' +
    '<div class="list-row"><span><span class="tag tag-orange">黄</span> 超龄用工2人（继续用工超60岁）</span><span class="tag tag-blue">处置中</span></div>' +
    '<div class="list-row"><span><span class="tag tag-gray">绿</span> 劳动合同签订率 100%</span><span class="tag tag-green">正常</span></div>' +
    '<div style="margin-top:10px"><button class="btn ghost">⬇ 导出合规台账（自查/甲方审计）</button></div></div></div>';
  render(html);
  mkChart('c-ins', {
    tooltip: {}, legend: { bottom: 0 },
    series: [{ type: 'pie', radius: ['40%', '64%'], center: ['50%', '44%'], label: { show: false }, data: [
      { name: '已参保 111人', value: 111, itemStyle: { color: '#00b578' } },
      { name: '现金补贴替代 213人', value: 213, itemStyle: { color: '#ff9f43' } },
      { name: '未参保 121人', value: 121, itemStyle: { color: '#fa5151' } }
    ] }]
  }, 280);
  window.openSocial = function () {
    openModal('<h3>社保合规专项整改 · 分步推进方案</h3><div class="timeline">' +
      '<div class="tl-item"><div class="tl-t">① 用工与参保状态专项自查（3个月内）</div><div class="tl-d">445名员工"一人一档"台账，界定标准劳动关系/非全日制/劳务协作类别，全量录入才薪云参保状态看板</div></div>' +
      '<div class="tl-item"><div class="tl-t">② 测算并锁定风险敞口</div><div class="tl-d">按属地缴费基数测算：月增成本约40.05万，冲减现金补贴14.87万后净增25.19万/月，年化约302.24万，形成《社保合规成本与风险评估报告》</div></div>' +
      '<div class="tl-item"><div class="tl-t">③ 分类处置、分步推进</div><div class="tl-d">核心岗位优先足额参保 → 非全日制依法缴纳工伤保险 → 标准劳动关系特征人员分批次纳入，避免一次性成本冲击</div></div>' +
      '<div class="tl-item"><div class="tl-t">④ 主动沟通争取政策空间</div><div class="tl-d">向属地人社、税务部门争取分步补缴、缓缴或过渡安排，避免被动稽查</div></div></div>' +
      '<div style="margin-top:10px">' + aiBox('系统按员工逐人跟踪参保状态、自动识别未参保/现金补贴替代情形、测算补缴敞口并预警，使合规风险从"账外隐性"变为"系统可视、可预算、可排期"。越晚处理，累积补缴金额与滞纳金越高。') + '</div>');
  };
};

PAGES['bi-client'] = function () {
  var html = header('客户价值分析看板', '高管与商务使用：评估铁路甲方客户价值与合作风险 · 支撑"把项目资源投向赚钱的客户"') + roleBanner();
  var sorted = CX.clients.slice().sort(function (a, b) { return b.cumRevenue - a.cumRevenue; });
  html += '<div class="grid g32" style="margin-bottom:16px"><div class="card"><div class="card-title">客户营收贡献排名</div><div id="c-clientbar" class="chart"></div></div>' +
    '<div class="card"><div class="card-title">客户分层与维护策略</div>' +
    '<div class="list-row"><span><span class="tag tag-green">高价值稳定型 3家</span> 优先保障履约与资源配置</span><span class="score-high">约65.6% 营收</span></div>' +
    '<div class="list-row"><span><span class="tag tag-blue">成长潜力型 4家</span> 提升履约质量，防范扣款上升</span><span class="score-mid">约27.2% 营收</span></div>' +
    '<div class="list-row"><span><span class="tag tag-red">低效风险型 4家</span> 优化报价或逐步收缩</span><span class="score-low">约7.2% 营收</span></div>' +
    '<div style="margin-top:12px">' + aiBox('低效风险型客户合计贡献营收仅7.2%，但占用4个项目与约28%的扣款事件，资源错配明显。对于高风险客户，提示提前洽谈合同条款、优化现场人员配置或评估项目续标可行性。') + '</div></div></div>';
  html += '<div class="card"><div class="card-title">客户价值明细</div><div class="table-wrap"><table class="data"><thead><tr>' +
    '<th>客户</th><th>分层</th><th>累计营收(万)</th><th>累计毛利(万)</th><th>毛利率</th><th>项目数</th><th>扣款频次</th><th>流失评分</th><th>合同预警</th></tr></thead><tbody>' +
    sorted.map(function (c) {
      var warn = (c.id === 'C11' || c.id === 'C09') ? '<span class="tag tag-red">30天内到期</span>' : c.id === 'C08' ? '<span class="tag tag-orange">40天内到期</span>' : '<span class="tag tag-gray">正常</span>';
      return '<tr><td class="clickable" onclick="showClient(\'' + c.id + '\')">' + c.name + '</td><td>' + clusterTag(c.cluster) + '</td>' +
        '<td>' + c.cumRevenue + '</td><td>' + c.cumProfit + '</td><td>' + c.margin + '%</td><td>' + c.projects + '</td><td>' + c.dedFreq + '</td>' +
        '<td class="' + (c.churn >= 60 ? 'score-low' : c.churn >= 30 ? 'score-mid' : 'score-high') + '">' + c.churn + '</td><td>' + warn + '</td></tr>';
    }).join('') + '</tbody></table></div></div>';
  render(html);
  mkChart('c-clientbar', Object.assign({}, CHART_BASE, {
    tooltip: {},
    xAxis: { type: 'value', name: '累计营收 万' },
    yAxis: { type: 'category', data: sorted.map(function (c) { return c.name; }).reverse(), axisLabel: { fontSize: 11 } },
    series: [{ type: 'bar', barWidth: 14, data: sorted.map(function (c) { return { value: c.cumRevenue, itemStyle: { color: c.cluster === 'high' ? '#00b578' : c.cluster === 'growth' ? '#1677ff' : '#fa5151', borderRadius: [0, 6, 6, 0] } }; }).reverse() }]
  }), 380);
};
