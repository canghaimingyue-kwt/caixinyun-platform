/* 智慧决策：项目健康评分 + 客户价值与流失 */
PAGES['sd-health'] = function () {
  var html = header('项目健康评分模型', '熵权法—TOPSIS · 经营盈利 / 人员稳定 / 合规风控 / 甲方考核 四维动态打分') + roleBanner();
  html += '<div class="grid g32" style="margin-bottom:16px"><div class="card"><div class="card-title">在营项目评分分布（n=24）</div><div id="c-dist" class="chart-sm"></div></div>' +
    '<div class="card"><div class="card-title">评分区间 [32.5, 91.4] · 分类管控口径</div>' +
    '<div class="list-row"><span><span class="tag tag-green">优质项目</span>　评分 ≥ 75　优先保障资源配置</span><span class="score-high">9 个</span></div>' +
    '<div class="list-row"><span><span class="tag tag-orange">一般项目</span>　55 ≤ 评分 &lt; 75　按月滚动观察</span><span class="score-mid">11 个</span></div>' +
    '<div class="list-row"><span><span class="tag tag-red">高风险项目</span>　评分 &lt; 55　全部触发预警工单</span><span class="score-low">4 个</span></div>' +
    '<div style="margin-top:12px">' + aiBox('模型把"真正赚钱的项目"和"表面有营收、实际被扣款吃光利润的项目"清晰区分开，为项目分类管控提供依据。评分按月自动滚动更新，低于阈值自动生成预警工单派发至项目负责人。') + '</div></div></div>';
  html += '<div class="card"><div class="card-title">在营项目健康评分明细<span class="more">点击项目名称查看四维拆解</span></div><div class="table-wrap"><table class="data"><thead><tr>' +
    '<th>项目</th><th>客户</th><th>健康评分</th><th>分类</th><th>毛利率</th><th>扣款占收比</th><th style="width:220px">评分条</th></tr></thead><tbody>' +
    CX.projects.slice().sort(function (a, b) { return b.score - a.score; }).map(function (p) {
      return '<tr><td class="clickable" onclick="showProject(\'' + p.id + '\')">' + p.name + '</td><td>' + p.client + '</td>' +
        '<td class="' + scoreCls(p.score) + '">' + p.score + '</td><td>' + levelTag(p.level) + '</td>' +
        '<td>' + p.margin + '%</td><td>' + p.dedRate + '%</td>' +
        '<td><div class="bar-cell"><div class="bar-track"><div class="bar-fill" style="width:' + p.score + '%;background:' + barColor(p.score) + '"></div></div><span style="font-size:11.5px;color:var(--text-3)">' + p.score + '</span></div></td></tr>';
    }).join('') + '</tbody></table></div></div>';
  render(html);
  mkChart('c-dist', {
    tooltip: {}, legend: { bottom: 0 },
    series: [{ type: 'pie', radius: ['40%', '66%'], center: ['50%', '44%'], label: { show: false }, data: [
      { name: '优质项目 9个', value: 9, itemStyle: { color: '#00b578' } },
      { name: '一般项目 11个', value: 11, itemStyle: { color: '#ff9f43' } },
      { name: '高风险项目 4个', value: 4, itemStyle: { color: '#fa5151' } }
    ] }]
  }, 260);
};

PAGES['sd-client'] = function () {
  var html = header('客户价值分级 × 流失风险评分', 'KMeans聚类（轮廓系数0.62）+ 随机森林（AUC 0.86 · 准确率84.2%）') + roleBanner();
  html += '<div class="grid g2" style="margin-bottom:16px">' +
    '<div class="card"><div class="card-title">KMeans 客户价值分级（毛利率 × 累计毛利）<span class="more">三类差异显著 p&lt;0.05</span></div><div id="c-kmeans" class="chart-sm"></div></div>' +
    '<div class="card"><div class="card-title">随机森林流失风险 · 特征重要性<span class="more">流失本质：扣款与结算出了问题</span></div><div id="c-feat" class="chart-sm"></div></div></div>';
  html += '<div class="card"><div class="card-title">客户分级名单与流失评分<span class="more">点击客户查看维护建议</span></div><div class="table-wrap"><table class="data"><thead><tr>' +
    '<th>客户</th><th>价值分层</th><th>累计营收(万)</th><th>累计毛利(万)</th><th>客户毛利率</th><th>合作时长</th><th>扣款频次</th><th>流失风险评分</th><th>结算</th></tr></thead><tbody>' +
    CX.clients.slice().sort(function (a, b) { return b.cumRevenue - a.cumRevenue; }).map(function (c) {
      var rc = c.churn >= 60 ? 'score-low' : (c.churn >= 30 ? 'score-mid' : 'score-high');
      return '<tr><td class="clickable" onclick="showClient(\'' + c.id + '\')">' + c.name + '</td><td>' + clusterTag(c.cluster) + '</td>' +
        '<td>' + c.cumRevenue + '</td><td>' + c.cumProfit + '</td><td>' + c.margin + '%</td><td>' + c.years + '年</td>' +
        '<td>' + c.dedFreq + '次</td><td class="' + rc + '">' + c.churn + '</td><td>' + c.settle + '</td></tr>';
    }).join('') + '</tbody></table></div></div>';
  html += '<div class="card"><div class="card-title">业务落地③：守住存量项目收入 —— 高风险客户续约跟踪</div>' +
    CX.renewal.map(function (r) {
      return '<div class="ticket"><div class="t-level ' + (r.result === 'done' ? 'lev-green' : 'lev-yellow') + '"></div><div style="flex:1">' +
        '<div class="t-title">' + r.client + '　<span class="tag ' + (r.result === 'done' ? 'tag-green' : 'tag-orange') + '">' + (r.result === 'done' ? '已完成续约谈判' : '谈判进行中') + '</span>　流失评分 ' + r.risk + '</div>' +
        '<div class="t-desc">' + r.note + '</div></div></div>';
    }).join('') +
    '<div style="font-size:12.5px;color:var(--text-3)">验证期内，模型标记的3家高风险客户中，2家在合同到期前完成续约谈判，守住了存量项目收入。</div></div>';
  render(html);
  var CL = { high: '#00b578', growth: '#1677ff', risk: '#fa5151' };
  var CN = { high: '高价值稳定型', growth: '成长潜力型', risk: '低效风险型' };
  mkChart('c-kmeans', Object.assign({}, CHART_BASE, {
    legend: { top: 0 },
    tooltip: { formatter: function (p) { return p.name + '<br>毛利率 ' + p.value[0] + '%　累计毛利 ' + p.value[1] + '万<br>流失评分 ' + p.value[2]; } },
    xAxis: { name: '客户毛利率 %', type: 'value' }, yAxis: { name: '累计毛利 万', type: 'value' },
    series: ['high', 'growth', 'risk'].map(function (k) {
      return { name: CN[k], type: 'scatter', symbolSize: 16,
        data: CX.clients.filter(function (c) { return c.cluster === k; }).map(function (c) { return { name: c.name, value: [c.margin, c.cumProfit, c.churn] }; }),
        itemStyle: { color: CL[k] },
        label: { show: true, position: 'top', fontSize: 10, color: '#5b6b82', formatter: function (p) { return p.name.length > 6 ? p.name.slice(0, 6) + '…' : p.name; } } };
    })
  }), 300);
  mkChart('c-feat', Object.assign({}, CHART_BASE, {
    tooltip: {},
    xAxis: { type: 'value', name: '重要性 %' },
    yAxis: { type: 'category', data: CX.churnFeatures.map(function (f) { return f.name; }).reverse() },
    series: [{ type: 'bar', barWidth: 16, itemStyle: { borderRadius: [0, 8, 8, 0] }, label: { show: true, position: 'right', formatter: '{c}%' },
      data: CX.churnFeatures.map(function (f) { return f.imp; }).reverse() }]
  }), 300);
};
