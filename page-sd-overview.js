/* 智慧决策：总览页 */
PAGES['sd-overview'] = function () {
  var html = header('智慧决策模块总览', 'AI模型驱动的核心差异化模块 · 五层架构端到端验证样本', '<span class="tag tag-purple">MVP 已上线</span>') + roleBanner();
  html += '<div class="card"><div class="card-title">五层经营决策闭环（总体架构贯通验证）</div><div class="loop-steps">' +
    [['① 数据输入', '24个项目经营数据<br>汇成一本经营账'],
     ['② 技术赋能', '三大模型：投标测算<br>健康评分 · 价值/流失'],
     ['③ 业务落地', '嵌入投标·在营管控<br>客户维护真实动作'],
     ['④ 智能看板', '项目/客户双视角<br>下钻至班组明细'],
     ['⑤ 决策输出', '项目进退·客户取舍<br>资源投放决策']].map(function (s, i) {
      return '<div class="loop-step' + (i === 1 ? ' hot' : '') + '"><div class="ls-t">' + s[0] + '</div><div class="ls-d">' + s[1] + '</div></div>';
    }).join('') + '</div></div>';
  html += '<div class="grid g3" style="margin-bottom:16px">' +
    '<div class="model-card mc-blue" onclick="go(\'sd-bid\')"><div class="mc-name">📊 项目投标测算模型</div><div class="mc-desc">基于历史同类项目成本、人员配置、扣款概率、毛利水平，测算新项目预计成本、预期毛利与风险概率，避免盲目投标、低价亏损接单。</div><div class="mc-metric">投标准入线：毛利率 ≥ 10%</div></div>' +
    '<div class="model-card mc-purple" onclick="go(\'sd-health\')"><div class="mc-name">❤ 项目健康评分模型</div><div class="mc-desc">熵权法—TOPSIS，从经营盈利、人员稳定、合规风控、甲方考核四维度对在营项目动态打分，区分优质/一般/高风险项目。</div><div class="mc-metric">评分区间 [32.5, 91.4] · 优质9 / 一般11 / 高风险4</div></div>' +
    '<div class="model-card mc-teal" onclick="go(\'sd-client\')"><div class="mc-name">🤝 客户价值与流失模型</div><div class="mc-desc">KMeans客户价值分级 + 随机森林流失风险评分，智能识别高流失风险甲方客户，提前提示商务团队维护。</div><div class="mc-metric">轮廓系数 0.62 · AUC 0.86 · 准确率 84.2%</div></div></div>';
  html += '<div class="grid g4" style="margin-bottom:16px">' +
    kpi('100%', '项目数据结构化归集', '多套口径收敛为1套', 'var(--green)') +
    kpi('2 / 3', '高风险客户完成续约谈判', '守住存量项目收入', 'var(--primary)') +
    kpi('+3.1pct', '高风险项目整改后毛利率回升', '识别—派单—整改—复盘闭环', 'var(--green)') +
    kpi('&lt; 1 日', '数据回流到看板更新', '可下钻至项目/班组/客户明细', 'var(--purple)') + '</div>';
  html += '<div class="card"><div class="card-title">第五层·决策输出：三类可执行经营决策</div><div class="grid g3" style="gap:12px">' +
    '<div style="background:#f8faff;border:1px solid var(--border);border-radius:10px;padding:14px"><b style="color:var(--primary)">① 项目结构优化</b><div style="font-size:12.5px;color:var(--text-2);margin-top:6px;line-height:1.7">"哪些项目该保、该改、该退"：4个高风险项目分别给出人员优化、成本压降或退出评估建议；建立毛利率≥10%投标准入红线。</div></div>' +
    '<div style="background:#f8faff;border:1px solid var(--border);border-radius:10px;padding:14px"><b style="color:var(--primary)">② 客户结构优化</b><div style="font-size:12.5px;color:var(--text-2);margin-top:6px;line-height:1.7">"把项目资源投向赚钱的客户"：高价值客户优先保障履约；低效风险客户优化报价或逐步收缩，建立流失预警响应机制。</div></div>' +
    '<div style="background:#f8faff;border:1px solid var(--border);border-radius:10px;padding:14px"><b style="color:var(--primary)">③ 经营改善成效</b><div style="font-size:12.5px;color:var(--text-2);margin-top:6px;line-height:1.7">投标亏损率下降；项目毛利率整体提升约2—3个百分点；客户续约率提升、存量项目收入更稳定。</div></div></div></div>';
  html += '<div style="margin-top:16px">' + aiBox('三大模型基于企业历史项目数据、经营数据、考核扣款数据、客户合作数据持续迭代参数，通过数据回流、案例训练、结果校验不断提升准确率。AI输出均为辅助参考并附置信度提示——<b>模型给建议，人做最终决策</b>；账务核算、业务审批、考核处罚仍由规则引擎与人工完成最终确认，全部AI调用记录留存日志满足审计要求。') + '</div>';
  render(html);
};
