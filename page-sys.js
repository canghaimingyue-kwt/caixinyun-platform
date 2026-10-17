/* 系统管理 + 项目/客户详情弹层 */
PAGES['sys-rbac'] = function () {
  var html = header('权限与规则引擎', 'RBAC角色权限体系 + 可配置可审计的硬性业务规则（AI的"硬闸门"）') + roleBanner();
  html += '<div class="card"><div class="card-title">RBAC 权限矩阵</div><div class="table-wrap"><table class="data"><thead><tr>' +
    '<th>角色</th><th>数据范围</th><th>四大看板</th><th>业务操作</th><th>敏感数据隔离</th></tr></thead><tbody>' +
    '<tr><td><b>企业高管</b></td><td>全公司总览</td><td>✓ 全部</td><td>仅查看决策，无业务操作权限</td><td>—</td></tr>' +
    '<tr><td><b>项目负责人</b></td><td>仅分管项目部</td><td>✓ 项目经营分析</td><td>项目级风险工单、人员异动审批、作业合规管控</td><td>隔离其他项目部数据</td></tr>' +
    '<tr><td><b>HR管理员</b></td><td>人力全域</td><td>✓ 人力合规</td><td>人事全流程操作、薪酬社保RPA审核</td><td>隔离财务经营敏感数据</td></tr>' +
    '<tr><td><b>财务人员</b></td><td>结算与成本</td><td>✓ 项目经营分析</td><td>结算核对、经营报表导出</td><td>隔离人员隐私与甲方合同涉密信息</td></tr>' +
    '<tr><td><b>合规/运营管理员</b></td><td>规则与流程全域</td><td>✓ 全部（督办视角）</td><td>规则引擎配置、阈值调整、知识库更新、工单督办</td><td>—</td></tr>' +
    '<tr><td><b>甲方客户端</b></td><td>脱敏履约视图</td><td>—</td><td>履约进度查看、考核回执上传</td><td>屏蔽成本/毛利/内部薪资</td></tr>' +
    '</tbody></table></div></div>';
  html += '<div class="card"><div class="card-title">规则引擎 · 月度经营监控阈值（管理人员可直接更新，无需改代码；触发日志全留痕）</div><div class="table-wrap"><table class="data"><thead><tr>' +
    '<th>监控指标</th><th>计算口径</th><th>黄色预警线</th><th>红色预警线</th><th>监控频率</th><th>当前值</th><th>状态</th></tr></thead><tbody>' +
    [['净利率', '净利润 ÷ 营业收入', '低于 3%', '低于 0%（当月亏损）', '月', '2.1%', 'warn'],
     ['工资占收比', '应发工资 ÷ 营业收入', '高于 72%', '高于 75%', '月', '74.28%', 'warn'],
     ['考核扣款占收比', '甲方考核扣款 ÷ 营业收入', '高于 10%', '高于 15%', '月', '9.4%', 'ok'],
     ['社保参保率', '实际参保人数 ÷ 在册人数', '低于 40%', '低于 25%', '季', '24.94%', 'red'],
     ['检查扣分/扣款率', '有扣分记录数 ÷ 检查总条数', '高于 10%', '高于 15%', '月', '16.14%', 'red'],
     ['投标准入线', '预计项目毛利率', '—', '低于 10% 拦截', '逐单', '按单测算', 'ok']].map(function (r) {
      var st = r[6] === 'red' ? '<span class="tag tag-red">红色预警</span>' : r[6] === 'warn' ? '<span class="tag tag-orange">黄色预警</span>' : '<span class="tag tag-green">正常</span>';
      return '<tr><td><b>' + r[0] + '</b></td><td>' + r[1] + '</td><td>' + r[2] + '</td><td>' + r[3] + '</td><td>' + r[4] + '</td><td>' + r[5] + '</td><td>' + st + '</td></tr>';
    }).join('') + '</tbody></table></div>' +
    '<div style="margin-top:10px;font-size:12.5px;color:var(--text-2)">人机互补分工：确定性、强合规、可审计的业务判断交给规则引擎（社保校验、薪酬约束、预警阈值、考核处罚判定、风险分级）；模糊解读、案例类比、归纳建议交给大模型。工资占收比超阈值时自动预警并冻结非常规用工申请——成本红线从事后统计变为事中拦截。</div></div>';
  html += '<div class="card"><div class="card-title">操作审计与溯源（满足内控与合规）</div>' +
    '<div class="grid g2" style="gap:12px">' +
    '<div style="background:#f8faff;border:1px solid var(--border);border-radius:10px;padding:14px;font-size:13px;line-height:1.8"><b style="color:var(--primary)">全量审计视图（仅高管）</b><br>企业高管可查看全公司所有人员的操作日志——查询、处置、导出、配置等，全面掌握各岗位工作动态与系统使用情况，作为内部审计与责任界定的依据。</div>' +
    '<div style="background:#f8faff;border:1px solid var(--border);border-radius:10px;padding:14px;font-size:13px;line-height:1.8"><b style="color:var(--primary)">分权受限视图（项目负责人 / HR）</b><br>项目负责人仅可查看本人分管范围内的操作；HR管理员仅可查看人力相关操作。所有操作（含AI模型调用）均留存日志，支持按时间、人员、模块回溯，确保"谁在何时做了什么"可追溯。</div></div>' +
    '<div style="margin-top:10px"><button class="btn" onclick="go(\'audit\')">前往操作日志审计 ›</button></div></div>';
  render(html);
};

PAGES['sys-arch'] = function () {
  var html = header('平台总体架构', '五层架构 + 三端协同 · 存量迭代 + MVP分阶段落地', '<span class="tag tag-blue" onclick="go(\'sd-overview\')" style="cursor:pointer">查看端到端验证 ›</span>');
  var layers = [
    ['5️⃣ 价值输出层', '对内：降本·提效·控险·提质　对外：脱敏行业数据资产 → 咨询/履约评估增值服务（第二增长曲线）', '#1554d6'],
    ['4️⃣ 全局数据分析与可视化层（BI）', '公司总览 · 项目经营分析 · 人力合规 · 客户价值四大看板；支持下钻至项目/班组/人员明细，按角色权限隔离，风险红黄绿标色', '#2d7dff'],
    ['3️⃣ 业务应用层（五大模块）', '数字运营（MVP刚需）· 智慧决策（AI模型差异化）· 全员服务 · 智能招聘（二期）· 成长赋能', '#13c2c2'],
    ['2️⃣ 技术层（公共技术底座）', '低代码平台 · RPA · AI大模型 · AI智能体Agent · 规则引擎 · 大数据分析 ｜ 三位一体AI知识库（业务/培训/行业对标）', '#7b61ff'],
    ['1️⃣ 数据层（多源统一数据底座）', '存量HRO数据 + 业务上报数据 + 外部接口（多省市社保/甲方考核/银行回执）；四大指标域统一口径；标准化流程框架（表单/审批/告警/归档）', '#00a870']
  ];
  html += '<div class="card">' + layers.map(function (l) {
    return '<div style="border-radius:10px;padding:14px 18px;margin-bottom:10px;color:#fff;background:' + l[2] + '"><b style="font-size:14.5px">' + l[0] + '</b><div style="font-size:12.5px;opacity:.93;margin-top:5px;line-height:1.7">' + l[1] + '</div></div>';
  }).join('') +
    '<div style="border-radius:10px;padding:12px 18px;background:#f0f2f5;color:var(--text-2);font-size:12.5px"><b>多端口协同</b>：中心管理端（本系统，含高管 / 项目负责人 / 职能管理者 三类 PC 管理端口）· 员工移动端（微信小程序）· 甲方客户端（独立门户 · PC端）——各端口独立登录、物理隔离，共享同一数据底座与 AI 能力池，数据实时互通、双向回流、对外脱敏呈现</div></div>';
  html += '<div class="card"><div class="card-title">建设模式：不推倒重建，存量迭代 + MVP分阶段</div><div class="loop-steps">' +
    [['第一阶段 MVP', '业务数字化筑基<br>解决运营端高频痛点'],
     ['第二阶段', '平台化智慧决策<br>提升盈利与风险管控'],
     ['第三阶段', '行业数据资产沉淀<br>增值服务对外输出']].map(function (s) {
      return '<div class="loop-step"><div class="ls-t">' + s[0] + '</div><div class="ls-d">' + s[1] + '</div></div>';
    }).join('') + '</div>' +
    '<div style="margin-top:12px">' + aiBox('充分复用企业现有人资云HRO存量数字化资产，适配企业预算约束与数字化成熟度现状。MVP收尾增量为万元级；每期均设可验收的里程碑，未达验收标准的不进入下一期投入（吸取2020年"拼8方"系统铺展过大而搁置的教训）。') + '</div></div>';
  render(html);
};

window.showProject = function (id) {
  var p = CX.projects.find(function (x) { return x.id === id; });
  var tk = CX.tickets.find(function (t) { return t.project === id; });
  openModal('<h3>' + p.name + ' · 项目健康档案</h3>' +
    '<div style="margin-bottom:12px;display:flex;gap:10px;flex-wrap:wrap">' + levelTag(p.level) +
    '<span class="tag tag-gray">客户：' + p.client + '</span><span class="tag tag-gray">业务：' + p.type + '</span><span class="tag tag-gray">在岗 ' + p.staff + ' 人</span></div>' +
    '<div class="grid g2"><div><div class="kpi-row" style="flex-direction:column">' +
    kpi(p.score, '健康评分（熵权法-TOPSIS）', '评分区间 [32.5, 91.4]', barColor(p.score)) +
    kpi(p.margin + '%', '项目毛利率', '毛利 ' + p.gross + ' 万 / 营收 ' + p.revenue + ' 万（准入线10%）', p.margin >= 10 ? 'var(--green)' : 'var(--red)') +
    kpi(p.dedRate + '%', '甲方考核扣款占收比', '扣款 ' + p.deduction + ' 万（黄线10%）', p.dedRate > 10 ? 'var(--red)' : 'var(--green)') +
    kpi(p.perCapita + ' 万/人', '人均产出', '按月度收入 ÷ 在岗人数', 'var(--primary)') + '</div></div>' +
    '<div><div id="c-radar" style="width:100%;height:280px"></div></div></div>' +
    (p.level === 'high-risk' ? '<div style="margin-top:12px">' + aiBox('风险归因：' + esc(p.riskCause)) + '</div>' : '') +
    (tk ? '<div class="card-title" style="margin-top:6px">关联风险工单</div><div class="ticket"><div class="t-level ' + (tk.level === 'red' ? 'lev-red' : 'lev-yellow') + '"></div><div style="flex:1"><div class="t-title">' + esc(tk.title) + '</div><div class="t-meta"><span>' + tk.status + '</span><span>责任人 ' + tk.owner + '</span><button class="btn sm ghost" style="margin-left:auto" onclick="closeModal();go(\'sd-ticket\')">去处置</button></div></div></div>' : ''));
  setTimeout(function () {
    mkChart('c-radar', {
      tooltip: {},
      radar: { indicator: [{ name: '经营盈利', max: 100 }, { name: '人员稳定', max: 100 }, { name: '合规风控', max: 100 }, { name: '甲方考核', max: 100 }], radius: '64%' },
      series: [{ type: 'radar', data: [{ value: [p.dims.profit, p.dims.stable, p.dims.compliance, p.dims.assessment], name: '维度得分', areaStyle: { opacity: .25 }, itemStyle: { color: '#1677ff' } }] }]
    }, 280);
  }, 30);
};

window.showClient = function (id) {
  var c = CX.clients.find(function (x) { return x.id === id; });
  var d = { margin: c.margin, revenue: c.cumRevenue, profit: c.cumProfit, churn: c.churn };
  openModal('<h3>' + c.name + ' · 客户档案</h3>' +
    '<div class="kpi-row" style="margin-bottom:14px">' +
    kpi(c.cumRevenue + '万', '累计营收', '合作 ' + c.years + ' 年 · ' + c.projects + ' 个项目', 'var(--primary)') +
    kpi(c.cumProfit + '万', '累计毛利', '毛利率 ' + c.margin + '%', 'var(--green)') +
    kpi(c.churn, '流失风险评分', c.dedFreq + ' 次历史扣款', c.churn >= 60 ? 'var(--red)' : 'var(--orange)') + '</div>' +
    '<div id="c-clientpie" style="width:100%;height:220px;margin-bottom:8px"></div>' +
    aiBox(c.cluster === 'risk'
      ? '该客户属于<b>低效风险型</b>：历史扣款频次 ' + c.dedFreq + ' 次、结算' + c.settle + '，为流失评分主要驱动因子。建议：优化报价结构或逐步收缩资源配置；合同到期前60天启动续约谈判或退出预案，建立流失预警响应。'
      : c.cluster === 'growth'
        ? '该客户属于<b>成长潜力型</b>：毛利率与结算表现居中，具备增量空间。建议：提升履约质量与沟通频次，推动合作规模从 ' + c.projects + ' 个项目扩展，防范扣款频次上升趋势。'
        : '该客户属于<b>高价值稳定型</b>：累计贡献与毛利率双高、扣款频次低。建议：优先保障履约资源配置，签订长期框架协议，作为标杆案例沉淀至行业对标知识库。'));
  setTimeout(function () {
    mkChart('c-clientpie', {
      tooltip: { formatter: '{a}<br>{b}: {c}万 ({d}%)' },
      series: [{ type: 'pie', radius: ['40%', '66%'], label: { formatter: '{b}\n{d}%' }, data: [
        { name: '累计毛利', value: c.cumProfit, itemStyle: { color: '#00b578' } },
        { name: '成本占用', value: +(c.cumRevenue - c.cumProfit).toFixed(1), itemStyle: { color: '#c9d4e3' } }
      ] }]
    }, 220);
  }, 30);
};
