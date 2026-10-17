/* ================= 才薪云 · 模拟数据集 =================
   依据《商业分析报告整合版V1.2》"结果验证"章节口径仿真生成：
   在营项目24个、协作客户11家、历史期间24个月。
   仅用于检验架构对项目经营的支撑能力，不代表企业真实经营数据。 */
(function (global) {
  'use strict';

  // ---------- 客户（11家） ----------
  // cluster: high=高价值稳定型 / growth=成长潜力型 / risk=低效风险型
  var clients = [
    { id:'C01', name:'甲铁路局客运段',        cluster:'high',   cumRevenue:2860, cumProfit:214.5, margin:7.5, years:6, projects:3, dedFreq:2,  settle:'及时',  churn:12.4 },
    { id:'C02', name:'甲铁路局车辆段',        cluster:'high',   cumRevenue:1980, cumProfit:158.4, margin:8.0, years:5, projects:2, dedFreq:1,  settle:'及时',  churn:10.8 },
    { id:'C03', name:'乙铁路局高铁客运段',      cluster:'high',   cumRevenue:1725, cumProfit:129.4, margin:7.5, years:4, projects:2, dedFreq:2,  settle:'及时',  churn:15.2 },
    { id:'C04', name:'丙轨枕制造基地',    cluster:'growth', cumRevenue:960,  cumProfit:67.2,  margin:7.0, years:2, projects:2, dedFreq:3,  settle:'基本及时', churn:28.5 },
    { id:'C05', name:'丁动车检修中心',    cluster:'growth', cumRevenue:845,  cumProfit:59.2,  margin:7.0, years:2, projects:2, dedFreq:3,  settle:'基本及时', churn:31.0 },
    { id:'C06', name:'戊货运服务中心',  cluster:'growth', cumRevenue:620,  cumProfit:40.3,  margin:6.5, years:2, projects:1, dedFreq:4,  settle:'偶有延迟', churn:38.7 },
    { id:'C07', name:'己餐饮服务公司',    cluster:'risk',   cumRevenue:1180, cumProfit:35.4,  margin:3.0, years:3, projects:2, dedFreq:9,  settle:'经常延迟', churn:66.3 },
    { id:'C08', name:'庚线路工程公司',    cluster:'risk',   cumRevenue:740,  cumProfit:22.2,  margin:3.0, years:3, projects:2, dedFreq:11, settle:'经常延迟', churn:71.8 },
    { id:'C09', name:'辛客运配套公司',    cluster:'risk',   cumRevenue:410,  cumProfit:10.3,  margin:2.5, years:1, projects:1, dedFreq:12, settle:'经常延迟', churn:78.2 },
    { id:'C10', name:'壬高铁物业',        cluster:'growth', cumRevenue:530,  cumProfit:31.8,  margin:6.0, years:2, projects:2, dedFreq:2,  settle:'及时',  churn:22.4 },
    { id:'C11', name:'癸劳务协作基地',    cluster:'risk',   cumRevenue:365,  cumProfit:7.3,   margin:2.0, years:1, projects:1, dedFreq:14, settle:'经常延迟', churn:83.6 }
  ];

  // ---------- 在营项目（24个） ----------
  // score 四维: profit经营盈利 / stable人员稳定 / compliance合规风控 / assessment甲方考核
  // level: good优质(9) / mid一般(11) / high-risk高风险(4)，分数区间 [32.5, 91.4]
  var projects = [
    { id:'P01', name:'甲铁路局乘务服务一队',   client:'甲铁路局客运段',     type:'客运乘务', staff:186, revenue:486,  labor:392,  material:38,  deduction:9.8,  score:91.4, level:'good' },
    { id:'P02', name:'甲铁路局车辆检修项目',   client:'甲铁路局车辆段',     type:'车辆检修', staff:142, revenue:395,  labor:312,  material:30,  deduction:6.5,  score:88.2, level:'good' },
    { id:'P03', name:'乙铁路局高铁客运服务队',   client:'乙铁路局高铁客运段',   type:'客运乘务', staff:165, revenue:438,  labor:352,  material:33,  deduction:8.1,  score:86.7, level:'good' },
    { id:'P04', name:'丙轨枕预制二线',     client:'丙轨枕制造基地', type:'轨枕预制', staff:118, revenue:312,  labor:242,  material:26,  deduction:5.2,  score:84.9, level:'good' },
    { id:'P05', name:'丁动车检修组',       client:'丁动车检修中心', type:'车辆检修', staff:96,  revenue:268,  labor:208,  material:21,  deduction:4.4,  score:83.5, level:'good' },
    { id:'P06', name:'甲铁路局保洁综合作业',   client:'壬高铁物业',     type:'站车保洁', staff:88,  revenue:172,  labor:132,  material:14,  deduction:3.6,  score:81.3, level:'good' },
    { id:'P07', name:'甲铁路局乘务服务二队',   client:'甲铁路局客运段',     type:'客运乘务', staff:154, revenue:402,  labor:325,  material:31,  deduction:11.2, score:79.8, level:'good' },
    { id:'P08', name:'乙铁路局高铁餐饮保障组',   client:'乙铁路局高铁客运段',   type:'高铁餐服', staff:74,  revenue:186,  labor:141,  material:17,  deduction:5.8,  score:78.2, level:'good' },
    { id:'P09', name:'丙轨枕预制一线',     client:'丙轨枕制造基地', type:'轨枕预制', staff:104, revenue:286,  labor:224,  material:24,  deduction:6.9,  score:76.6, level:'good' },
    { id:'P10', name:'甲铁路局站台引导服务',   client:'甲铁路局客运段',     type:'站务服务', staff:62,  revenue:138,  labor:105,  material:10,  deduction:4.1,  score:74.3, level:'mid' },
    { id:'P11', name:'丁动车清洗作业组',   client:'丁动车检修中心', type:'车辆检修', staff:58,  revenue:126,  labor:97,   material:11,  deduction:4.6,  score:71.8, level:'mid' },
    { id:'P12', name:'戊货运装卸项目',   client:'戊货运服务中心', type:'装卸搬运', staff:92, revenue:214,  labor:168,  material:15,  deduction:8.8,  score:69.4, level:'mid' },
    { id:'P13', name:'壬高铁物业绿化组',   client:'壬高铁物业',     type:'站车保洁', staff:46,  revenue:98,   labor:76,   material:8,   deduction:3.2,  score:67.9, level:'mid' },
    { id:'P14', name:'乙铁路局高铁随车机械师辅组', client:'乙铁路局高铁客运段',  type:'车辆检修', staff:38,  revenue:112,  labor:87,   material:9,   deduction:5.4,  score:65.5, level:'mid' },
    { id:'P15', name:'甲铁路局餐服配送项目',   client:'己餐饮服务公司', type:'高铁餐服', staff:132, revenue:296,  labor:238,  material:26,  deduction:24.6, score:58.7, level:'mid' },
    { id:'P16', name:'庚线路养护作业一队', client:'庚线路工程公司', type:'线路养护', staff:108, revenue:238,  labor:192,  material:18,  deduction:18.9, score:55.3, level:'mid' },
    { id:'P17', name:'戊货运仓储管理组', client:'戊货运服务中心', type:'装卸搬运', staff:54, revenue:118,  labor:94,   material:8,   deduction:7.6,  score:63.2, level:'mid' },
    { id:'P18', name:'甲铁路局后勤保障项目',   client:'壬高铁物业',     type:'站务服务', staff:66,  revenue:142,  labor:114,  material:11,  deduction:9.3,  score:61.8, level:'mid' },
    { id:'P19', name:'辛客运配套服务组',   client:'辛客运配套公司', type:'站务服务', staff:72,  revenue:148,  labor:121,  material:12,  deduction:16.4, score:46.2, level:'high-risk' },
    { id:'P20', name:'庚线路养护作业二队', client:'庚线路工程公司', type:'线路养护', staff:96,  revenue:198,  labor:167,  material:15,  deduction:22.8, score:41.6, level:'high-risk' },
    { id:'P21', name:'癸劳务协作项目',     client:'癸劳务协作基地', type:'装卸搬运', staff:84,  revenue:156,  labor:132,  material:12,  deduction:19.5, score:38.9, level:'high-risk' },
    { id:'P22', name:'滇中餐服冷链配送组',   client:'己餐饮服务公司', type:'高铁餐服', staff:88,  revenue:176,  labor:147,  material:16,  deduction:21.3, score:32.5, level:'high-risk' },
    { id:'P23', name:'丁动车部件转运组',   client:'丁动车检修中心', type:'车辆检修', staff:42,  revenue:104,  labor:80,   material:9,   deduction:6.2,  score:75.1, level:'good' },
    { id:'P24', name:'丙轨枕质检协作组',   client:'丙轨枕制造基地', type:'轨枕预制', staff:36,  revenue:92,   labor:70,   material:7,   deduction:4.8,  score:72.6, level:'mid' }
  ];

  // 衍生指标：毛利 / 毛利率 / 扣款占收比 / 人均产出（单位：万元、%、万元/人·年）
  projects.forEach(function (p) {
    p.gross = +(p.revenue - p.labor - p.material - p.deduction).toFixed(1);
    p.margin = +(p.gross / p.revenue * 100).toFixed(1);
    p.dedRate = +(p.deduction / p.revenue * 100).toFixed(1);
    p.perCapita = +(p.revenue / p.staff).toFixed(1);
  });

  // 健康评分四维拆解（熵权法-TOPSIS 输入示意）
  var levelDims = {
    good:      { profit: [78, 95], stable: [80, 95], compliance: [80, 96], assessment: [78, 95] },
    mid:       { profit: [55, 76], stable: [58, 80], compliance: [60, 82], assessment: [55, 78] },
    'high-risk': { profit: [25, 48], stable: [30, 52], compliance: [28, 50], assessment: [22, 45] }
  };
  function rnd(seedStr, min, max) {
    var h = 2166136261;
    for (var i = 0; i < seedStr.length; i++) { h ^= seedStr.charCodeAt(i); h = Math.imul(h, 16777619); }
    var x = (h >>> 0) / 4294967296;
    return +(min + x * (max - min)).toFixed(1);
  }
  projects.forEach(function (p) {
    var d = levelDims[p.level];
    p.dims = {
      profit: rnd(p.id + 'p', d.profit[0], d.profit[1]),
      stable: rnd(p.id + 's', d.stable[0], d.stable[1]),
      compliance: rnd(p.id + 'c', d.compliance[0], d.compliance[1]),
      assessment: rnd(p.id + 'a', d.assessment[0], d.assessment[1])
    };
    // 高风险项目归因说明
    if (p.level === 'high-risk') {
      p.riskCause = p.dedRate > 12
        ? '甲方考核扣款占收比达 ' + p.dedRate + '%，历史高频扣款叠加人员流失，建议重点管控现场作业流程并压降间接人力'
        : '人员频繁流动导致作业违规进而引发扣款，毛利率持续低于盈亏平衡线';
    }
  });

  // ---------- 风险工单（AI Agent 闭环） ----------
  var tickets = [
    { id:'W2026-018', level:'red',    project:'P22', title:'滇中餐服冷链配送组 · 考核扣款占收比超红色预警线（12.1%）',
      desc:'甲方月度考核扣款21.3万元，占营收比12.1%，超15%红线临近。AI归因：冷链盒饭报废扣款+销售不达标扣款为主因，涉及乘务岗位17人次违规记录。',
      suggestion:'①对17人次违规员工自动派发专项培训任务；②优化冷链备货量预测；③与甲方沟通考核口径异议项。', owner:'项目部-王敏', status:'处置中', created:'2026-10-12', agent:'已自动归档3份同类历史案例，生成整改建议初稿' },
    { id:'W2026-017', level:'red',    project:'P21', title:'癸劳务协作项目 · 项目健康评分38.9（高风险）',
      desc:'连续3个月健康评分低于45分阈值，毛利仅3.6万元（毛利率2.3%），人员流失率18.7%。',
      suggestion:'建议退出评估或重新报价：按投标测算模型复核，该项目续签报价需上调≥8%方可达到10%毛利准入线。', owner:'商务部-李强', status:'待处置', created:'2026-10-11', agent:'已推送至项目负责人并抄送高管驾驶舱' },
    { id:'W2026-016', level:'red',    project:'P20', title:'庚线路养护二队 · 作业违规记录集中触发',
      desc:'当月甲方检查记录32条中11条扣分（扣分率34.4%），同类"防护不到位"问题重复出现4次。',
      suggestion:'触发"问题—培训—复测"闭环：自动生成安全防护专项培训任务11人，复测结果回传后核验闭环。', owner:'项目部-张伟', status:'处置中', created:'2026-10-09', agent:'已比对知识库同类案例2份并附整改模板' },
    { id:'W2026-015', level:'yellow', project:'P19', title:'辛客运配套服务组 · 工资占收比81.8%超黄线',
      desc:'当月应发工资121万元÷营收148万元=81.8%，超过75%红色线、72%黄色线。',
      suggestion:'当月提交成本压降方案：建议将3个班组弹性排班压缩6%工时，预计压降人工成本7.2万元/月。', owner:'财务部-陈芳', status:'已闭环', created:'2026-10-05', agent:'处置材料已自动核验完整，工单闭环归档' },
    { id:'W2026-014', level:'yellow', project:'C11', title:'癸劳务协作基地 · 客户流失风险评分83.6（高流失）',
      desc:'历史扣款频次14次、结算经常延迟，流失评分高。主驱动因子：历史扣款频次（32.6%）、结算及时性（24.1%）。',
      suggestion:'合同到期前60天启动续约谈判：优化报价结构或逐步收缩资源配置。', owner:'商务部-李强', status:'处置中', created:'2026-10-03', agent:'已生成客户分层维护方案草稿' },
    { id:'W2026-013', level:'yellow', project:'P15', title:'甲铁路局餐服配送项目 · 扣款占收比8.3%超黄线',
      desc:'考核扣款24.6万元占收比8.3%，其中冷链盒饭报废扣款4.2万元。',
      suggestion:'优化备货量预测模型参数；临期商品优先销售策略已在2个班组试运行。', owner:'项目部-赵磊', status:'已闭环', created:'2026-09-28', agent:'下考核周期毛利率回升1.9pct，自动核验通过' },
    { id:'W2026-012', level:'green',  project:'P11', title:'丁动车清洗作业组 · 排班冲突预警',
      desc:'RPA巡检发现连续2周夜班排班冲突3处，AI识别为排班模板配置错误。',
      suggestion:'已在低代码平台调整排班规则并重新生成班表。', owner:'运营组-刘洋', status:'已闭环', created:'2026-09-25', agent:'自动核验通过' },
    { id:'W2026-011', level:'yellow', project:'P16', title:'庚线路养护一队 · 社保异常人员3名',
      desc:'规则引擎校验发现3名员工参保地与用工地不一致，触发社保异常处置流程。',
      suggestion:'按属地社保政策接口核验缴费基数，10月申报期内完成增员属地变更。', owner:'HR中台-孙倩', status:'处置中', created:'2026-09-22', agent:'已调取云南/贵州两地社保政策差异对比' }
  ];

  // ---------- 投标测算：模型内置基准（历史同类项目沉淀） ----------
  var bidBenchmarks = {
    '客运乘务': { laborRate: 80.5, materialRate: 6.8, dedProb: 2.1,  marginBase: 8.9 },
    '车辆检修': { laborRate: 79.0, materialRate: 7.8, dedProb: 1.7,  marginBase: 9.4 },
    '轨枕预制': { laborRate: 77.5, materialRate: 8.3, dedProb: 2.0,  marginBase: 9.8 },
    '高铁餐服': { laborRate: 80.2, materialRate: 9.1, dedProb: 6.5,  marginBase: 4.2 },
    '站车保洁': { laborRate: 76.7, materialRate: 8.2, dedProb: 2.3,  marginBase: 8.1 },
    '装卸搬运': { laborRate: 78.4, materialRate: 7.0, dedProb: 4.2,  marginBase: 6.3 },
    '线路养护': { laborRate: 80.7, materialRate: 7.6, dedProb: 7.9,  marginBase: 4.6 },
    '站务服务': { laborRate: 80.0, materialRate: 7.7, dedProb: 5.5,  marginBase: 5.9 }
  };

  // ---------- 24个月经营趋势（万/月，双项目线合并口径） ----------
  var trend = [
    { m:'2024-11', rev:412, cost:401 }, { m:'2024-12', rev:468, cost:451 },
    { m:'2025-01', rev:382, cost:395 }, { m:'2025-02', rev:356, cost:362 },
    { m:'2025-03', rev:428, cost:408 }, { m:'2025-04', rev:395, cost:398 },
    { m:'2025-05', rev:431, cost:426 }, { m:'2025-06', rev:452, cost:435 },
    { m:'2025-07', rev:389, cost:421 }, { m:'2025-08', rev:486, cost:462 },
    { m:'2025-09', rev:398, cost:415 }, { m:'2025-10', rev:502, cost:468 },
    { m:'2025-11', rev:438, cost:419 }, { m:'2025-12', rev:495, cost:472 },
    { m:'2026-01', rev:372, cost:389 }, { m:'2026-02', rev:368, cost:371 },
    { m:'2026-03', rev:436, cost:409 }, { m:'2026-04', rev:391, cost:402 },
    { m:'2026-05', rev:425, cost:424 }, { m:'2026-06', rev:458, cost:437 },
    { m:'2026-07', rev:402, cost:428 }, { m:'2026-08', rev:512, cost:478 },
    { m:'2026-09', rev:486, cost:459 }, { m:'2026-10', rev:521, cost:483 }
  ];

  // ---------- 随机森林：特征重要性 / ROC ----------
  var churnFeatures = [
    { name:'历史扣款频次', imp:32.6 }, { name:'结算及时性', imp:24.1 },
    { name:'合作波动幅度', imp:18.9 }, { name:'履约要求变更', imp:13.2 },
    { name:'沟通反馈频次', imp:7.4 },  { name:'其他特征', imp:3.8 }
  ];
  // AUC=0.86 的 ROC 示意曲线
  var roc = [
    [0,0],[0.02,0.18],[0.05,0.34],[0.1,0.48],[0.16,0.58],[0.24,0.66],[0.32,0.72],
    [0.42,0.78],[0.52,0.83],[0.63,0.87],[0.72,0.91],[0.8,0.94],[0.88,0.965],[0.94,0.985],[1,1]
  ];

  // ---------- 投标测算验证案例（报告口径） ----------
  var bidCase = {
    name: '某制造线外包项目（拟投标）',
    revenue: 1200, staff: 260, labor: 966, indirect: 58, deductionExp: 26.4,
    margin: 8.7, threshold: 10,
    verdict: 'block',
    aiNote: '预计毛利率8.7%，低于公司投标准入线10%。归因：现场间接人力配置冗余（26人间接岗，历史同类项目基准为18人），建议压减间接人力8人并重报方案，预计毛利率可回升至10.2%。在报价环节即拦下一单"看着有量、实则亏损"的项目。'
  };

  // ---------- 客户续约验证（业务落地成果） ----------
  var renewal = [
    { client:'乙铁路局高铁客运段', risk:66.3, result:'done',  note:'合同到期前45天完成续约谈判，锁定2年期合同，谈判中针对扣款条款增设申诉机制' },
    { client:'丙轨枕制造基地', risk:38.7, result:'done', note:'优化服务模式后完成续约，续约价格上浮3%' },
    { client:'癸劳务协作基地', risk:83.6, result:'doing', note:'续约谈判进行中，已提交服务改进方案，同步启动退出预案评估' }
  ];

  // ---------- 操作日志（审计溯源 · 脱敏示例数据） ----------
  // role: executive高管 / manager项目负责人 / hr HR管理员 / admin系统管理员
  var logs = [
    { time:'2026-10-16 14:22', user:'企业高管-周明', role:'executive', dept:'高管', action:'查看 公司总览看板', target:'bi-company', ip:'10.20.3.11', result:'成功' },
    { time:'2026-10-16 13:40', user:'项目部-王敏',   role:'manager',   dept:'乘务项目部', action:'处置风险工单 W2026-018', target:'sd-ticket', ip:'10.20.5.22', result:'成功' },
    { time:'2026-10-16 11:15', user:'HR中台-孙倩',   role:'hr',        dept:'人力资源部', action:'导出 社保合规台账', target:'bi-compliance', ip:'10.20.6.08', result:'成功' },
    { time:'2026-10-16 10:02', user:'财务部-陈芳',   role:'manager',   dept:'财务部', action:'复核 9月经营看板', target:'bi-project', ip:'10.20.4.31', result:'成功' },
    { time:'2026-10-15 18:30', user:'运营组-刘洋',   role:'manager',   dept:'运营部', action:'调整 排班规则', target:'ops-attend', ip:'10.20.5.40', result:'成功' },
    { time:'2026-10-15 16:12', user:'系统管理员',     role:'admin',     dept:'信息技术部', action:'修改 规则引擎阈值', target:'sys-rbac', ip:'10.20.1.02', result:'成功' },
    { time:'2026-10-15 15:05', user:'商务部-李强',   role:'manager',   dept:'商务部', action:'查看 客户价值分析', target:'bi-client', ip:'10.20.7.19', result:'成功' },
    { time:'2026-10-15 14:20', user:'HR中台-孙倩',   role:'hr',        dept:'人力资源部', action:'办理 员工入职 S2401', target:'staff-file', ip:'10.20.6.08', result:'成功' },
    { time:'2026-10-15 09:48', user:'项目部-张伟',   role:'manager',   dept:'线路项目部', action:'提交 整改工单 W2026-016', target:'sd-ticket', ip:'10.20.5.27', result:'成功' },
    { time:'2026-10-14 17:33', user:'企业高管-周明', role:'executive', dept:'高管', action:'导出 全局风险台账', target:'dashboard', ip:'10.20.3.11', result:'成功' },
    { time:'2026-10-14 15:10', user:'运营组-刘洋',   role:'manager',   dept:'运营部', action:'运行 薪酬社保RPA核算', target:'ops-attend', ip:'10.20.5.40', result:'成功' },
    { time:'2026-10-14 11:25', user:'HR中台-孙倩',   role:'hr',        dept:'人力资源部', action:'查询 员工档案 S2231', target:'staff-file', ip:'10.20.6.08', result:'成功' },
    { time:'2026-10-14 10:00', user:'系统管理员',     role:'admin',     dept:'信息技术部', action:'登录系统', target:'login', ip:'10.20.1.02', result:'成功' },
    { time:'2026-10-13 16:45', user:'项目部-赵磊',   role:'manager',   dept:'餐服项目部', action:'查看 投标测算模型', target:'sd-bid', ip:'10.20.5.33', result:'成功' },
    { time:'2026-10-13 14:02', user:'企业高管-周明', role:'executive', dept:'高管', action:'查看 项目健康评分', target:'sd-health', ip:'10.20.3.11', result:'成功' }
  ];

  // ---------- 需求工单（跨端口协同：发起 / 接收 / 审批） ----------
  // fromRole / toRole：executive高管 / manager项目负责人 / hr职能管理者(HR) / other其他管理者 / employee员工 / frontline一线管理者
  var requirements = [
    { id:'R2026-031', type:'请假异动', title:'一线员工 张× 婚假申请（5天）', from:'员工·乘务一队', fromRole:'employee', to:'manager', amount:0, priority:'中', status:'待审批', created:'2026-10-16', desc:'员工张× 申请婚假 5 天并附证明，需项目经理审批后流转 HR 备案。' },
    { id:'R2026-030', type:'排班调整', title:'乘务一队 下周排班优化', from:'一线管理者·乘务队长', fromRole:'frontline', to:'manager', amount:0, priority:'中', status:'待审批', created:'2026-10-15', desc:'因客流变化申请调整排班模板，已附 RPA 冲突检测结果。' },
    { id:'R2026-028', type:'招聘需求', title:'乘务岗 紧急补员 ×20 人', from:'项目负责人·王敏', fromRole:'manager', to:'hr', amount:0, priority:'高', status:'待处理', created:'2026-10-14', desc:'甲铁路局乘务服务一队离职率上升，需紧急补员 20 人，期望 11 月到岗。' },
    { id:'R2026-027', type:'培训需求', title:'安全防护专项培训（庚地区二队）', from:'项目负责人·张伟', fromRole:'manager', to:'hr', amount:0, priority:'高', status:'待处理', created:'2026-10-13', desc:'庚地区二队防护不到位×11人，申请专项安全培训并复测闭环。' },
    { id:'R2026-029', type:'录用决策', title:'补员 20 人 录用名单确认', from:'HR中台·孙倩', fromRole:'hr', to:'manager', amount:0, priority:'高', status:'待项目经理确认', created:'2026-10-16', desc:'招聘流程已完成，20 名候选人通过筛选，系统推送录用决策待项目经理最终确认（系统操作审批）。' },
    { id:'R2026-025', type:'预算报批', title:'戊货运新项目 启动预算 80 万', from:'项目负责人·王敏', fromRole:'manager', to:'executive', amount:80, priority:'高', status:'待审批', created:'2026-10-12', desc:'戊货运服务中心新外包项目投标测算毛利率 8.7%（低于准入线），需高管审批是否承接及预算安排。' },
    { id:'R2026-026', type:'预算报批', title:'社保合规整改 月度净增 25.19 万', from:'HR中台·孙倩', fromRole:'hr', to:'executive', amount:25.19, priority:'高', status:'待审批', created:'2026-10-11', desc:'社保合规分步推进，月度净增成本 25.19 万，需高管审批整改节奏与资金安排。' },
    { id:'R2026-024', type:'预算报批', title:'运营RPA升级 一次性 12 万', from:'其他管理者·运营组', fromRole:'other', to:'executive', amount:12, priority:'中', status:'待审批', created:'2026-10-10', desc:'薪酬社保 RPA 扩容与规则引擎升级，一次性投入 12 万。' },
    { id:'R2026-020', type:'招聘需求', title:'丁动车检修组 补员 ×8', from:'项目负责人·赵磊', fromRole:'manager', to:'hr', amount:0, priority:'中', status:'已完成', created:'2026-09-28', desc:'已闭环，8 人到岗。' },
    { id:'R2026-018', type:'预算报批', title:'甲铁路局乘务项目 季度预算', from:'项目负责人·王敏', fromRole:'manager', to:'executive', amount:60, priority:'中', status:'已批准', created:'2026-09-20', desc:'高管已批准，进入执行。' }
  ];

  global.CX = {
    clients: clients, projects: projects, tickets: tickets,
    bidBenchmarks: bidBenchmarks, trend: trend,
    churnFeatures: churnFeatures, roc: roc,
    bidCase: bidCase, renewal: renewal, logs: logs, requirements: requirements
  };
})(window);
