/* 智慧决策：项目投标测算 */
PAGES['sd-bid'] = function () {
  var c = CX.bidCase;
  var d = { margin: c.margin, threshold: c.threshold, verdict: c.verdict, name: c.name, aiNote: c.aiNote, laborIn: c.labor, matIn: c.indirect, dedIn: c.deductionExp, revIn: c.revenue };
  var html = header('项目投标测算模型', '业务落地①：把好项目入口关 —— "先测算、后报价"的经营纪律') + roleBanner();
  html += '<div class="card"><div class="card-title">投标测算输入（自动匹配历史同类项目基准）</div><div class="form-grid">' +
    fItem('业务类型', 'sel', 'bid-type', ['客运乘务', '车辆检修', '轨枕预制', '高铁餐服', '站车保洁', '装卸搬运', '线路养护', '站务服务']) +
    fItem('预计年度营收（万元）', 'num', 'bid-rev', 1200) +
    fItem('用工规模（人）', 'num', 'bid-staff', 260) +
    fItem('直接人工成本（万元）', 'num', 'bid-labor', 966) +
    fItem('耗材及间接成本（万元）', 'num', 'bid-mat', 84.4) +
    fItem('预计甲方考核扣款率（%）', 'num', 'bid-ded', 2.2) +
    '</div><div style="margin-top:16px;display:flex;gap:10px"><button class="btn" onclick="runBid()">▶ 开始测算</button><button class="btn plain" onclick="fillDemo()">载入验证案例</button></div></div>' +
    '<div id="bid-result">' + bidResult(d.margin, d) + '</div>';
  render(html);
  window.fillDemo = function () {
    var g = function (id) { return document.getElementById(id); };
    g('bid-type').value = '装卸搬运'; g('bid-rev').value = 1200; g('bid-staff').value = 260;
    g('bid-labor').value = 966; g('bid-mat').value = 84.4; g('bid-ded').value = 2.2;
    document.getElementById('bid-result').innerHTML = bidResult(c.margin, d);
  };
  window.runBid = function () {
    var g = function (id) { return +document.getElementById(id).value || 0; };
    var rev = g('bid-rev'), labor = g('bid-labor'), mat = g('bid-mat');
    var ded = g('bid-ded') / 100 * rev;
    var margin = rev ? +(((rev - labor - mat - ded) / rev) * 100).toFixed(1) : 0;
    var type = document.getElementById('bid-type').value;
    var b = CX.bidBenchmarks[type] || {};
    var r = {
      margin: margin, threshold: 10, verdict: margin >= 10 ? 'pass' : 'block',
      laborIn: labor, matIn: mat, dedIn: +ded.toFixed(1), revIn: rev,
      aiNote: margin >= 10
        ? '预计毛利率 ' + margin + '%，高于公司投标准入线10%，测算通过。历史同类「' + type + '」项目扣款概率基准 ' + (b.dedProb || '-') + '%、毛利率基准 ' + (b.marginBase || '-') + '%。建议按测算口径锁定报价下限，并在合同中明确考核扣款申诉机制，防止履约期毛利侵蚀。'
        : '预计毛利率 ' + margin + '%，低于公司投标准入线10%。' + (margin < 0 ? '测算口径下为亏损订单，建议直接放弃投标。' : '归因：成本结构偏高或扣款预期未压降，建议压减间接人力配置或上调报价 ≥ ' + (10 - margin).toFixed(1) + ' 个百分点后重新测算。在报价环节拦截"看着有量、实则亏损"的项目。'),
      name: '拟投标「' + type + '」项目'
    };
    document.getElementById('bid-result').innerHTML = bidResult(margin, r);
  };
};
function fItem(label, type, id, val) {
  if (Array.isArray(val)) return '<div class="form-item"><label>' + label + '</label><select id="' + id + '">' + val.map(function (v) { return '<option>' + v + '</option>'; }).join('') + '</select></div>';
  return '<div class="form-item"><label>' + label + '</label><input type="' + type + '" id="' + id + '" value="' + val + '"></div>';
}
function bidResult(margin, c) {
  var pass = c.verdict === 'pass';
  var m = '<div class="result-banner ' + (pass ? 'pass' : 'block') + '"><div class="rb-ico">' + (pass ? '✅' : '⛔') + '</div><div>' +
    '<div class="rb-main">' + (pass ? '测算通过 · 建议投标' : '低于准入线 · 建议拦截或优化后重报') + '</div>' +
    '<div class="rb-sub">预计毛利率 <b style="font-size:16px;color:' + (pass ? 'var(--green)' : 'var(--red)') + '">' + margin + '%</b>　投标准入线：毛利率 ≥ ' + c.threshold + '%　｜　测算项目：' + esc(c.name) + '</div></div></div>';
  m += '<div class="grid g2"><div class="card"><div class="card-title">AI 辅助研判（附置信度提示）</div>' + aiBox(c.aiNote) +
    '<div style="margin-top:10px;font-size:12px;color:var(--text-3)">⚠ 模型输出为辅助参考，最终投标决策由管理层确认；样本数据不足时模型会主动提示审慎参考。</div></div>' +
    '<div class="card"><div class="card-title">测算构成</div><div id="c-bidpie" class="chart-sm"></div></div></div>';
  setTimeout(function () {
    mkChart('c-bidpie', { tooltip: {}, series: [{ type: 'pie', radius: ['42%', '68%'], label: { formatter: '{b}\n{d}%' }, data: [
      { name: '直接人工成本', value: c.laborIn || 966, itemStyle: { color: '#1677ff' } },
      { name: '耗材及间接', value: c.matIn || 84.4, itemStyle: { color: '#13c2c2' } },
      { name: '预计考核扣款', value: c.dedIn || 26.4, itemStyle: { color: '#fa5151' } },
      { name: '预期毛利', value: +(c.margin / 100 * (c.revIn || 1200)).toFixed(1), itemStyle: { color: '#00b578' } }
    ] }] }, 260);
  }, 0);
  return m;
}
