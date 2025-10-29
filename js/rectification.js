// 整改管理页面脚本

// 模拟整改任务数据 - 完整版
const mockRectifications = [
    {
        id: 'ZG2025001',
        title: '科研经费报销不规范问题整改',
        department: '科研处',
        responsible: '张三',
        phone: '138****1234',
        deadline: '2025-11-30',
        progress: 75,
        status: 'in_progress',
        createdAt: '2025-10-01',
        source: '工单 WO202510210001',
        sourceType: '纪检核查',
        // 关联工单
        workOrderId: 'WO202510210001',
        workOrderTitle: '科研经费异常报销核查',
        workOrderStatus: '已完成',
        // 关联线索
        clueId: 'CLUE2025001',
        clueTitle: '科研经费报销存在连号发票异常',
        clueType: '系统预警',
        description: '科研项目经费报销存在票据不规范、审批流程不完整等问题。经核查发现某教授科研经费报销存在连号发票和异常支出，需要完善相关制度并整改。',
        measures: '1. 修订科研经费管理办法，明确报销规范和审批流程\n2. 加强财务人员培训，提升业务能力\n3. 完善审批流程，增加审核环节\n4. 建立定期检查机制，防止类似问题再次发生\n5. 对相关责任人进行约谈和教育',
        metrics: [
            { label: '制度修订', value: '已完成', target: '1项', status: 'completed', completedDate: '2025-10-30' },
            { label: '人员培训', value: '24人', target: '30人', status: 'in_progress', progress: 80 },
            { label: '流程优化', value: '已完成', target: '1项', status: 'completed', completedDate: '2025-11-05' },
            { label: '检查机制', value: '进行中', target: '1项', status: 'in_progress', progress: 60 }
        ],
        timeline: [
            { date: '2025-10-01', title: '整改任务下达', desc: '纪检部门根据工单核查结果下达整改通知', status: 'completed', operator: '纪检监察室' },
            { date: '2025-10-08', title: '整改方案提交', desc: '科研处提交详细整改方案，明确整改措施和时间表', status: 'completed', operator: '张三' },
            { date: '2025-10-15', title: '整改方案审核通过', desc: '纪检部门审核通过整改方案', status: 'completed', operator: '纪检监察室' },
            { date: '2025-10-30', title: '制度修订完成', desc: '完成《科研经费管理办法》修订，新增票据审核和流程规范条款', status: 'completed', operator: '张三' },
            { date: '2025-11-05', title: '审批流程优化', desc: '在OA系统中上线新的科研经费审批流程', status: 'completed', operator: '信息中心' },
            { date: '2025-11-15', title: '人员培训进行中', desc: '已完成24人培训，剩余6人将在本周完成', status: 'in_progress', operator: '张三' },
            { date: '2025-11-20', title: '建立检查机制', desc: '正在制定定期检查制度和检查表单', status: 'in_progress', operator: '张三' }
        ],
        evidences: [
            { name: '科研经费管理办法（修订版）.pdf', size: '2.3 MB', uploadDate: '2025-10-30', type: 'pdf', uploader: '张三' },
            { name: '培训签到表.xlsx', size: '156 KB', uploadDate: '2025-11-10', type: 'excel', uploader: '张三' },
            { name: '培训课件.pptx', size: '8.5 MB', uploadDate: '2025-11-10', type: 'ppt', uploader: '张三' },
            { name: '新审批流程截图.png', size: '1.2 MB', uploadDate: '2025-11-05', type: 'image', uploader: '信息中心' }
        ]
    },
    {
        id: 'ZG2025002',
        title: '固定资产管理不规范整改',
        department: '资产处',
        responsible: '李四',
        phone: '139****5678',
        deadline: '2025-10-25',
        progress: 100,
        status: 'completed',
        createdAt: '2025-09-01',
        completedAt: '2025-10-25',
        source: '审计发现',
        sourceType: '审计核查',
        // 关联工单
        workOrderId: 'WO202509150001',
        workOrderTitle: '固定资产盘点差异核查',
        workOrderStatus: '已完成',
        // 关联线索
        clueId: 'CLUE2025002',
        clueTitle: '固定资产账实不符',
        clueType: '审计发现',
        description: '年度资产盘点发现部分设备账实不符，存在资产管理混乱、台账不清等问题，需要全面清查并建立规范的管理制度。',
        measures: '1. 开展全校固定资产清查，核实账实情况\n2. 建立固定资产管理制度，明确管理责任\n3. 配备专职资产管理员，加强日常管理\n4. 引入资产管理系统，实现信息化管理\n5. 建立资产定期盘点机制',
        metrics: [
            { label: '资产清查', value: '已完成', target: '100%', status: 'completed', completedDate: '2025-09-20' },
            { label: '制度建立', value: '已完成', target: '1项', status: 'completed', completedDate: '2025-10-10' },
            { label: '人员配备', value: '已完成', target: '3人', status: 'completed', completedDate: '2025-10-15' },
            { label: '系统上线', value: '已完成', target: '1套', status: 'completed', completedDate: '2025-10-20' }
        ],
        timeline: [
            { date: '2025-09-01', title: '整改任务下达', desc: '审计部门下达整改通知', status: 'completed', operator: '审计处' },
            { date: '2025-09-05', title: '成立清查小组', desc: '组建资产清查工作小组，制定清查方案', status: 'completed', operator: '李四' },
            { date: '2025-09-20', title: '资产清查完成', desc: '完成全校固定资产清查，核实账实差异', status: 'completed', operator: '李四' },
            { date: '2025-10-10', title: '制度建立', desc: '制定《固定资产管理办法》并发布实施', status: 'completed', operator: '李四' },
            { date: '2025-10-15', title: '人员到位', desc: '招聘并配备3名专职资产管理员', status: 'completed', operator: '人事处' },
            { date: '2025-10-20', title: '系统上线', desc: '资产管理系统正式上线运行', status: 'completed', operator: '信息中心' },
            { date: '2025-10-25', title: '整改完成', desc: '所有整改任务完成，通过复查验收', status: 'completed', operator: '审计处' }
        ],
        evidences: [
            { name: '资产清查报告.pdf', size: '3.5 MB', uploadDate: '2025-09-20', type: 'pdf', uploader: '李四' },
            { name: '资产管理制度.docx', size: '245 KB', uploadDate: '2025-10-10', type: 'word', uploader: '李四' },
            { name: '资产管理员任命文件.pdf', size: '180 KB', uploadDate: '2025-10-15', type: 'pdf', uploader: '人事处' },
            { name: '系统操作手册.pdf', size: '5.2 MB', uploadDate: '2025-10-20', type: 'pdf', uploader: '信息中心' },
            { name: '整改验收报告.pdf', size: '1.8 MB', uploadDate: '2025-10-25', type: 'pdf', uploader: '审计处' }
        ]
    },
    {
        id: 'ZG2025003',
        title: '招生录取数据异常问题整改',
        department: '招生办',
        responsible: '王五',
        phone: '136****9012',
        deadline: '2025-11-15',
        progress: 90,
        status: 'review',
        createdAt: '2025-10-10',
        source: '工单 WO202510170004',
        sourceType: '专项核查',
        // 关联工单
        workOrderId: 'WO202510170004',
        workOrderTitle: '招生录取数据异常核查',
        workOrderStatus: '已完成',
        // 关联线索
        clueId: 'CLUE2025003',
        clueTitle: '招生录取存在低分高录情况',
        clueType: '系统预警',
        description: '系统预警发现某专业存在低分高录情况，虽经核查录取过程符合规定，但暴露出招生录取流程透明度不足、监督机制不完善等问题。',
        measures: '1. 完善招生录取工作流程，增加公示环节\n2. 建立招生录取全程监督机制\n3. 加强招生工作人员培训\n4. 优化招生系统，增加预警功能\n5. 建立招生工作责任追究制度',
        metrics: [
            { label: '流程完善', value: '已完成', target: '1项', status: 'completed', completedDate: '2025-10-25' },
            { label: '监督机制', value: '已完成', target: '1项', status: 'completed', completedDate: '2025-10-28' },
            { label: '人员培训', value: '已完成', target: '15人', status: 'completed', completedDate: '2025-11-01' },
            { label: '系统优化', value: '90%', target: '100%', status: 'in_progress', progress: 90 }
        ],
        timeline: [
            { date: '2025-10-10', title: '整改任务下达', desc: '纪检部门要求完善招生监督机制', status: 'completed', operator: '纪检监察室' },
            { date: '2025-10-18', title: '整改方案制定', desc: '招生办提交整改方案', status: 'completed', operator: '王五' },
            { date: '2025-10-25', title: '流程优化完成', desc: '修订招生录取工作流程，增加公示和监督环节', status: 'completed', operator: '王五' },
            { date: '2025-10-28', title: '监督机制建立', desc: '建立招生录取全程监督机制', status: 'completed', operator: '王五' },
            { date: '2025-11-01', title: '人员培训完成', desc: '完成15名招生工作人员培训', status: 'completed', operator: '王五' },
            { date: '2025-11-10', title: '系统优化进行中', desc: '招生系统预警功能开发中，预计11月15日完成', status: 'in_progress', operator: '信息中心' }
        ],
        evidences: [
            { name: '招生录取工作流程（修订版）.pdf', size: '1.5 MB', uploadDate: '2025-10-25', type: 'pdf', uploader: '王五' },
            { name: '招生监督机制文件.docx', size: '320 KB', uploadDate: '2025-10-28', type: 'word', uploader: '王五' },
            { name: '培训记录及签到表.xlsx', size: '180 KB', uploadDate: '2025-11-01', type: 'excel', uploader: '王五' },
            { name: '系统优化方案.pdf', size: '2.1 MB', uploadDate: '2025-11-05', type: 'pdf', uploader: '信息中心' }
        ]
    },
    {
        id: 'ZG2025004',
        title: '基建项目招标文件排他性条款整改',
        department: '基建处',
        responsible: '赵六',
        phone: '137****3456',
        deadline: '2025-11-20',
        progress: 65,
        status: 'in_progress',
        createdAt: '2025-10-18',
        source: '工单 WO202510200002',
        sourceType: '审计核查',
        description: '新建实验楼招标文件中发现2处疑似排他性条款，限制了公平竞争，需要修改招标文件并完善招标管理制度。',
        measures: '1. 立即修改招标文件，删除排他性条款\n2. 重新组织招标活动\n3. 完善招标文件编制规范\n4. 加强招标文件审核机制\n5. 开展招标管理人员培训',
        metrics: [
            { label: '文件修改', value: '已完成', target: '1项', status: 'completed', completedDate: '2025-10-25' },
            { label: '重新招标', value: '进行中', target: '1项', status: 'in_progress', progress: 70 },
            { label: '规范制定', value: '进行中', target: '1项', status: 'in_progress', progress: 50 },
            { label: '人员培训', value: '待开始', target: '10人', status: 'pending', progress: 0 }
        ],
        timeline: [
            { date: '2025-10-18', title: '整改任务下达', desc: '审计处要求立即整改招标文件', status: 'completed', operator: '审计处' },
            { date: '2025-10-22', title: '问题分析', desc: '组织专家分析排他性条款问题', status: 'completed', operator: '赵六' },
            { date: '2025-10-25', title: '文件修改完成', desc: '删除排他性条款，修订招标文件', status: 'completed', operator: '赵六' },
            { date: '2025-10-28', title: '重新发布招标公告', desc: '在公共资源交易平台重新发布招标公告', status: 'completed', operator: '赵六' },
            { date: '2025-11-10', title: '招标进行中', desc: '正在接受投标文件，预计11月20日开标', status: 'in_progress', operator: '赵六' }
        ],
        evidences: [
            { name: '招标文件（修订版）.pdf', size: '4.2 MB', uploadDate: '2025-10-25', type: 'pdf', uploader: '赵六' },
            { name: '专家论证意见.pdf', size: '850 KB', uploadDate: '2025-10-22', type: 'pdf', uploader: '赵六' },
            { name: '招标公告截图.png', size: '680 KB', uploadDate: '2025-10-28', type: 'image', uploader: '赵六' }
        ]
    },
    {
        id: 'ZG2025005',
        title: '三公经费支出不规范整改',
        department: '财务处',
        responsible: '孙七',
        phone: '135****7890',
        deadline: '2025-12-15',
        progress: 45,
        status: 'in_progress',
        createdAt: '2025-10-16',
        source: '工单 WO202510190003',
        sourceType: '联合核查',
        description: '三公经费专项检查中发现3笔疑似隐蔽吃喝的支出，公务接待和公车使用管理不够规范，需要加强管理和监督。',
        measures: '1. 清退不合规支出\n2. 完善三公经费管理制度\n3. 建立公务接待审批制度\n4. 加强公车使用管理\n5. 建立三公经费公开制度',
        metrics: [
            { label: '清退支出', value: '已完成', target: '3笔', status: 'completed', completedDate: '2025-10-30' },
            { label: '制度完善', value: '进行中', target: '2项', status: 'in_progress', progress: 60 },
            { label: '审批制度', value: '进行中', target: '1项', status: 'in_progress', progress: 40 },
            { label: '公开机制', value: '待开始', target: '1项', status: 'pending', progress: 0 }
        ],
        timeline: [
            { date: '2025-10-16', title: '整改任务下达', desc: '纪检部门下达整改通知', status: 'completed', operator: '纪检监察室' },
            { date: '2025-10-20', title: '问题核实', desc: '财务处核实不合规支出情况', status: 'completed', operator: '孙七' },
            { date: '2025-10-30', title: '清退完成', desc: '3笔不合规支出已全部清退', status: 'completed', operator: '孙七' },
            { date: '2025-11-05', title: '制度修订中', desc: '正在修订三公经费管理制度', status: 'in_progress', operator: '孙七' }
        ],
        evidences: [
            { name: '不合规支出清退凭证.pdf', size: '1.2 MB', uploadDate: '2025-10-30', type: 'pdf', uploader: '孙七' },
            { name: '三公经费管理制度（草案）.docx', size: '380 KB', uploadDate: '2025-11-05', type: 'word', uploader: '孙七' }
        ]
    },
    {
        id: 'ZG2025006',
        title: '师德师风问题整改',
        department: '人事处',
        responsible: '周八',
        phone: '138****2345',
        deadline: '2025-11-30',
        progress: 80,
        status: 'in_progress',
        createdAt: '2025-10-15',
        source: '师德预警',
        sourceType: '纪检核查',
        description: '某教师课堂言论不当，对学生态度恶劣，收到多次投诉。需要加强师德师风建设，完善师德考核机制。',
        measures: '1. 对当事教师进行约谈和教育\n2. 暂停其教学工作，进行师德培训\n3. 完善师德考核制度\n4. 建立师德预警机制\n5. 开展全校师德师风教育',
        metrics: [
            { label: '教师约谈', value: '已完成', target: '1人', status: 'completed', completedDate: '2025-10-20' },
            { label: '师德培训', value: '已完成', target: '1人', status: 'completed', completedDate: '2025-11-01' },
            { label: '制度完善', value: '进行中', target: '1项', status: 'in_progress', progress: 70 },
            { label: '全校教育', value: '进行中', target: '500人', status: 'in_progress', progress: 85 }
        ],
        timeline: [
            { date: '2025-10-15', title: '整改任务下达', desc: '纪检部门下达整改通知', status: 'completed', operator: '纪检监察室' },
            { date: '2025-10-20', title: '教师约谈', desc: '对当事教师进行约谈和批评教育', status: 'completed', operator: '周八' },
            { date: '2025-10-22', title: '暂停教学', desc: '暂停该教师教学工作', status: 'completed', operator: '教务处' },
            { date: '2025-11-01', title: '师德培训完成', desc: '该教师完成30学时师德培训', status: 'completed', operator: '周八' },
            { date: '2025-11-10', title: '全校教育进行中', desc: '已完成425名教师师德教育', status: 'in_progress', operator: '周八' }
        ],
        evidences: [
            { name: '约谈记录.pdf', size: '560 KB', uploadDate: '2025-10-20', type: 'pdf', uploader: '周八' },
            { name: '师德培训证明.pdf', size: '320 KB', uploadDate: '2025-11-01', type: 'pdf', uploader: '周八' },
            { name: '师德教育签到表.xlsx', size: '280 KB', uploadDate: '2025-11-10', type: 'excel', uploader: '周八' },
            { name: '师德考核制度（草案）.docx', size: '420 KB', uploadDate: '2025-11-08', type: 'word', uploader: '周八' }
        ]
    },
    {
        id: 'ZG2025007',
        title: '学术不端问题整改',
        department: '科研处',
        responsible: '吴九',
        phone: '139****6789',
        deadline: '2025-12-31',
        progress: 30,
        status: 'in_progress',
        createdAt: '2025-10-18',
        source: '学术检测',
        sourceType: '学术不端',
        description: '某教师论文存在抄袭嫌疑，查重率达到45%，存在大段抄袭。需要撤回论文，暂停学术活动，加强学术诚信教育。',
        measures: '1. 撤回涉嫌抄袭的论文\n2. 暂停该教师学术活动\n3. 进行学术诚信教育\n4. 完善学术规范制度\n5. 建立学术不端预防机制',
        metrics: [
            { label: '论文撤回', value: '已完成', target: '1篇', status: 'completed', completedDate: '2025-10-25' },
            { label: '暂停活动', value: '已完成', target: '1人', status: 'completed', completedDate: '2025-10-20' },
            { label: '诚信教育', value: '进行中', target: '1人', status: 'in_progress', progress: 50 },
            { label: '制度完善', value: '待开始', target: '1项', status: 'pending', progress: 0 }
        ],
        timeline: [
            { date: '2025-10-18', title: '整改任务下达', desc: '学术委员会下达整改通知', status: 'completed', operator: '学术委员会' },
            { date: '2025-10-20', title: '暂停学术活动', desc: '暂停该教师所有学术活动', status: 'completed', operator: '吴九' },
            { date: '2025-10-25', title: '论文撤回', desc: '向期刊申请撤回论文', status: 'completed', operator: '吴九' },
            { date: '2025-11-01', title: '诚信教育开始', desc: '该教师开始接受学术诚信教育', status: 'in_progress', operator: '吴九' }
        ],
        evidences: [
            { name: '查重报告.pdf', size: '2.8 MB', uploadDate: '2025-10-18', type: 'pdf', uploader: '学术委员会' },
            { name: '论文撤回申请.pdf', size: '450 KB', uploadDate: '2025-10-25', type: 'pdf', uploader: '吴九' },
            { name: '暂停学术活动通知.pdf', size: '320 KB', uploadDate: '2025-10-20', type: 'pdf', uploader: '吴九' }
        ]
    },
    {
        id: 'ZG2025008',
        title: '违规补课问题整改',
        department: '教务处',
        responsible: '郑十',
        phone: '136****4567',
        deadline: '2025-11-25',
        progress: 85,
        status: 'review',
        createdAt: '2025-10-15',
        source: '家长举报',
        sourceType: '违规补课',
        description: '某教师在校外培训机构兼职，给本校学生补课，收费较高，累计违规收入4.5万元。需要立即停止违规行为，退还收入。',
        measures: '1. 立即停止违规补课\n2. 退还全部违规收入\n3. 给予警告处分\n4. 加强师德教育\n5. 建立违规补课监督机制',
        metrics: [
            { label: '停止补课', value: '已完成', target: '1人', status: 'completed', completedDate: '2025-10-18' },
            { label: '退还收入', value: '已完成', target: '4.5万元', status: 'completed', completedDate: '2025-10-25' },
            { label: '纪律处分', value: '已完成', target: '1人', status: 'completed', completedDate: '2025-10-30' },
            { label: '师德教育', value: '已完成', target: '1人', status: 'completed', completedDate: '2025-11-05' }
        ],
        timeline: [
            { date: '2025-10-15', title: '整改任务下达', desc: '纪检部门下达整改通知', status: 'completed', operator: '纪检监察室' },
            { date: '2025-10-18', title: '停止补课', desc: '该教师停止所有校外补课活动', status: 'completed', operator: '郑十' },
            { date: '2025-10-25', title: '退还收入', desc: '退还全部违规收入4.5万元', status: 'completed', operator: '郑十' },
            { date: '2025-10-30', title: '纪律处分', desc: '给予警告处分', status: 'completed', operator: '人事处' },
            { date: '2025-11-05', title: '师德教育完成', desc: '完成20学时师德教育', status: 'completed', operator: '郑十' },
            { date: '2025-11-15', title: '待复查', desc: '整改任务已完成，等待复查验收', status: 'in_progress', operator: '纪检监察室' }
        ],
        evidences: [
            { name: '违规收入退还凭证.pdf', size: '680 KB', uploadDate: '2025-10-25', type: 'pdf', uploader: '郑十' },
            { name: '处分决定.pdf', size: '420 KB', uploadDate: '2025-10-30', type: 'pdf', uploader: '人事处' },
            { name: '师德教育证明.pdf', size: '350 KB', uploadDate: '2025-11-05', type: 'pdf', uploader: '郑十' },
            { name: '承诺书.pdf', size: '280 KB', uploadDate: '2025-11-05', type: 'pdf', uploader: '郑十' }
        ]
    },
    {
        id: 'ZG2025009',
        title: '第一议题学习不到位整改',
        department: '计算机学院',
        responsible: '冯十一',
        phone: '137****8901',
        deadline: '2025-11-30',
        progress: 60,
        status: 'in_progress',
        createdAt: '2025-10-20',
        source: '第一议题监督',
        sourceType: '纪检监督',
        description: '本月实际学习2次，要求4次，缺失2次。缺失议题包括学习习近平总书记关于科技创新的重要论述等。',
        measures: '1. 补齐缺失的学习内容\n2. 加强会议组织管理\n3. 建立学习提醒机制\n4. 完善学习记录制度\n5. 定期报送学习情况',
        metrics: [
            { label: '补学完成', value: '1次', target: '2次', status: 'in_progress', progress: 50 },
            { label: '制度完善', value: '进行中', target: '2项', status: 'in_progress', progress: 70 },
            { label: '提醒机制', value: '已完成', target: '1项', status: 'completed', completedDate: '2025-11-10' }
        ],
        timeline: [
            { date: '2025-10-20', title: '整改任务下达', desc: '纪检部门下达整改通知', status: 'completed', operator: '纪检监察室' },
            { date: '2025-10-25', title: '整改方案提交', desc: '学院提交整改方案', status: 'completed', operator: '冯十一' },
            { date: '2025-11-05', title: '补学第一次', desc: '补学习近平总书记关于科技创新的重要论述', status: 'completed', operator: '冯十一' },
            { date: '2025-11-10', title: '建立提醒机制', desc: '在OA系统中设置学习提醒', status: 'completed', operator: '冯十一' },
            { date: '2025-11-20', title: '补学计划', desc: '计划11月25日补学第二次', status: 'in_progress', operator: '冯十一' }
        ],
        evidences: [
            { name: '补学会议纪要.pdf', size: '1.2 MB', uploadDate: '2025-11-05', type: 'pdf', uploader: '冯十一' },
            { name: '学习提醒机制说明.docx', size: '380 KB', uploadDate: '2025-11-10', type: 'word', uploader: '冯十一' },
            { name: '学习记录制度（草案）.docx', size: '420 KB', uploadDate: '2025-11-12', type: 'word', uploader: '冯十一' }
        ]
    },
    {
        id: 'ZG2025010',
        title: '采购流程不规范整改',
        department: '采购中心',
        responsible: '陈十二',
        phone: '138****3456',
        deadline: '2025-12-10',
        progress: 55,
        status: 'in_progress',
        createdAt: '2025-10-22',
        source: '审计发现',
        sourceType: '审计核查',
        description: '部分采购项目未按规定进行公开招标，存在化整为零、规避招标等问题，需要规范采购流程。',
        measures: '1. 清理不规范采购项目\n2. 完善采购管理制度\n3. 加强采购人员培训\n4. 建立采购监督机制\n5. 引入采购管理系统',
        metrics: [
            { label: '项目清理', value: '进行中', target: '8项', status: 'in_progress', progress: 60 },
            { label: '制度完善', value: '进行中', target: '1项', status: 'in_progress', progress: 50 },
            { label: '人员培训', value: '待开始', target: '12人', status: 'pending', progress: 0 },
            { label: '系统引入', value: '待开始', target: '1套', status: 'pending', progress: 0 }
        ],
        timeline: [
            { date: '2025-10-22', title: '整改任务下达', desc: '审计处下达整改通知', status: 'completed', operator: '审计处' },
            { date: '2025-10-28', title: '问题梳理', desc: '梳理不规范采购项目清单', status: 'completed', operator: '陈十二' },
            { date: '2025-11-05', title: '项目清理开始', desc: '开始清理不规范采购项目', status: 'in_progress', operator: '陈十二' },
            { date: '2025-11-10', title: '制度修订中', desc: '正在修订采购管理制度', status: 'in_progress', operator: '陈十二' }
        ],
        evidences: [
            { name: '不规范采购项目清单.xlsx', size: '280 KB', uploadDate: '2025-10-28', type: 'excel', uploader: '陈十二' },
            { name: '采购管理制度（草案）.docx', size: '520 KB', uploadDate: '2025-11-10', type: 'word', uploader: '陈十二' }
        ]
    },
    {
        id: 'ZG2025011',
        title: '实验室安全隐患整改',
        department: '化学学院',
        responsible: '韩十三',
        phone: '139****7890',
        deadline: '2025-11-10',
        progress: 95,
        status: 'review',
        createdAt: '2025-10-08',
        source: '安全检查',
        sourceType: '专项检查',
        description: '实验室存在危化品管理不规范、安全设施不完善等问题，存在安全隐患，需要立即整改。',
        measures: '1. 规范危化品管理\n2. 完善安全设施\n3. 加强安全培训\n4. 建立安全检查制度\n5. 配备安全管理员',
        metrics: [
            { label: '危化品管理', value: '已完成', target: '1项', status: 'completed', completedDate: '2025-10-20' },
            { label: '安全设施', value: '已完成', target: '5项', status: 'completed', completedDate: '2025-10-28' },
            { label: '安全培训', value: '已完成', target: '80人', status: 'completed', completedDate: '2025-11-01' },
            { label: '检查制度', value: '已完成', target: '1项', status: 'completed', completedDate: '2025-11-05' }
        ],
        timeline: [
            { date: '2025-10-08', title: '整改任务下达', desc: '安全管理处下达整改通知', status: 'completed', operator: '安全管理处' },
            { date: '2025-10-15', title: '整改方案制定', desc: '学院制定详细整改方案', status: 'completed', operator: '韩十三' },
            { date: '2025-10-20', title: '危化品管理规范', desc: '完成危化品分类存放和标识', status: 'completed', operator: '韩十三' },
            { date: '2025-10-28', title: '安全设施完善', desc: '安装通风系统、应急喷淋等设施', status: 'completed', operator: '韩十三' },
            { date: '2025-11-01', title: '安全培训完成', desc: '完成80名师生安全培训', status: 'completed', operator: '韩十三' },
            { date: '2025-11-05', title: '制度建立', desc: '建立实验室安全检查制度', status: 'completed', operator: '韩十三' },
            { date: '2025-11-08', title: '待复查', desc: '整改完成，等待安全管理处复查', status: 'in_progress', operator: '安全管理处' }
        ],
        evidences: [
            { name: '危化品管理台账.xlsx', size: '420 KB', uploadDate: '2025-10-20', type: 'excel', uploader: '韩十三' },
            { name: '安全设施验收报告.pdf', size: '2.1 MB', uploadDate: '2025-10-28', type: 'pdf', uploader: '韩十三' },
            { name: '安全培训记录.pdf', size: '1.5 MB', uploadDate: '2025-11-01', type: 'pdf', uploader: '韩十三' },
            { name: '实验室安全检查制度.docx', size: '380 KB', uploadDate: '2025-11-05', type: 'word', uploader: '韩十三' },
            { name: '整改前后对比照片.zip', size: '8.5 MB', uploadDate: '2025-11-05', type: 'image', uploader: '韩十三' }
        ]
    },
    {
        id: 'ZG2025012',
        title: '学生资助资金管理不规范整改',
        department: '学生处',
        responsible: '曹十四',
        phone: '136****5678',
        deadline: '2025-11-28',
        progress: 70,
        status: 'in_progress',
        createdAt: '2025-10-25',
        source: '审计发现',
        sourceType: '审计核查',
        description: '学生资助资金发放不及时，部分资助对象认定不准确，需要完善资助管理制度和流程。',
        measures: '1. 及时发放滞留资助资金\n2. 重新认定资助对象\n3. 完善资助管理制度\n4. 优化资助发放流程\n5. 建立资助监督机制',
        metrics: [
            { label: '资金发放', value: '已完成', target: '100%', status: 'completed', completedDate: '2025-11-01' },
            { label: '对象认定', value: '进行中', target: '500人', status: 'in_progress', progress: 80 },
            { label: '制度完善', value: '进行中', target: '1项', status: 'in_progress', progress: 60 },
            { label: '流程优化', value: '待开始', target: '1项', status: 'pending', progress: 0 }
        ],
        timeline: [
            { date: '2025-10-25', title: '整改任务下达', desc: '审计处下达整改通知', status: 'completed', operator: '审计处' },
            { date: '2025-10-28', title: '问题核实', desc: '核实滞留资金和认定问题', status: 'completed', operator: '曹十四' },
            { date: '2025-11-01', title: '资金发放完成', desc: '完成所有滞留资金发放', status: 'completed', operator: '曹十四' },
            { date: '2025-11-10', title: '重新认定进行中', desc: '已完成400人资助对象重新认定', status: 'in_progress', operator: '曹十四' }
        ],
        evidences: [
            { name: '资金发放明细.xlsx', size: '520 KB', uploadDate: '2025-11-01', type: 'excel', uploader: '曹十四' },
            { name: '资助对象认定表.xlsx', size: '680 KB', uploadDate: '2025-11-10', type: 'excel', uploader: '曹十四' },
            { name: '资助管理制度（草案）.docx', size: '450 KB', uploadDate: '2025-11-12', type: 'word', uploader: '曹十四' }
        ]
    }
];

let currentPage = 1;
let pageSize = 10;
let filteredData = [...mockRectifications];
let currentRectification = null;
let currentTab = 'plan';

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('整改管理页面初始化...');
    console.log('模拟数据数量:', mockRectifications.length);
    
    // 检查是否从工单页面跳转过来创建整改单
    const urlParams = new URLSearchParams(window.location.search);
    const action = urlParams.get('action');
    
    if (action === 'create') {
        // 从工单创建整改单
        const workOrderData = {
            workOrderId: urlParams.get('workOrderId'),
            workOrderTitle: urlParams.get('workOrderTitle'),
            workOrderType: urlParams.get('workOrderType'),
            description: urlParams.get('description'),
            clueId: urlParams.get('clueId'),
            clueTitle: urlParams.get('clueTitle')
        };
        
        // 延迟打开创建模态框，确保页面已完全加载
        setTimeout(() => {
            openCreateRectificationModal(workOrderData);
        }, 500);
    }
    
    initializePage();
});

// 初始化页面
function initializePage() {
    // 初始化模态框为隐藏状态
    const detailModal = document.getElementById('detailModal');
    if (detailModal) {
        detailModal.style.display = 'none';
    }
    
    const uploadModal = document.getElementById('uploadModal');
    if (uploadModal) {
        uploadModal.style.display = 'none';
    }
    
    updateDashboard();
    renderTable();
    bindEvents();
}

// 更新看板数据
function updateDashboard() {
    const total = mockRectifications.length;
    const inProgress = mockRectifications.filter(r => r.status === 'in_progress' || r.status === 'review').length;
    const completed = mockRectifications.filter(r => r.status === 'completed').length;
    const overdue = mockRectifications.filter(r => {
        if (r.status === 'completed') return false;
        return new Date(r.deadline) < new Date();
    }).length;
    
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    document.getElementById('totalCount').textContent = total;
    document.getElementById('inProgressCount').textContent = inProgress;
    document.getElementById('completedCount').textContent = completed;
    document.getElementById('overdueCount').textContent = overdue;
    document.getElementById('completionRate').textContent = completionRate + '%';
}

// 渲染表格
function renderTable() {
    const tbody = document.getElementById('taskTableBody');
    if (!tbody) {
        console.error('找不到表格元素 taskTableBody');
        return;
    }
    console.log('渲染表格，数据数量:', filteredData.length);
    
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    const pageData = filteredData.slice(start, end);
    
    if (pageData.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" style="text-align: center; padding: 40px; color: var(--color-gray-500);">
                    <i class="fas fa-inbox" style="font-size: 48px; margin-bottom: 16px; display: block;"></i>
                    <p>暂无整改任务</p>
                </td>
            </tr>
        `;
        updatePagination();
        return;
    }
    
    tbody.innerHTML = pageData.map(item => {
        const isOverdue = new Date(item.deadline) < new Date() && item.status !== 'completed';
        const progressClass = item.progress >= 80 ? 'high' : item.progress >= 50 ? 'medium' : 'low';
        
        const statusMap = {
            'pending': { text: '待整改', class: 'status-pending' },
            'in_progress': { text: '整改中', class: 'status-in-progress' },
            'review': { text: '待复查', class: 'status-review' },
            'completed': { text: '已完成', class: 'status-completed' },
            'overdue': { text: '超期', class: 'status-overdue' }
        };
        
        const status = statusMap[item.status] || statusMap['pending'];
        
        return `
            <tr>
                <td>${item.id}</td>
                <td>${item.title}</td>
                <td>${item.department}</td>
                <td>${item.responsible}</td>
                <td ${isOverdue ? 'class="overdue-text"' : ''}>
                    ${isOverdue ? '<i class="fas fa-exclamation-triangle"></i>' : ''}
                    ${item.deadline}
                </td>
                <td>
                    <div class="progress-container">
                        <div class="progress-bar-wrapper">
                            <div class="progress-bar ${progressClass}" style="width: ${item.progress}%"></div>
                        </div>
                        <span class="progress-text">${item.progress}%</span>
                    </div>
                </td>
                <td>
                    <span class="status-badge ${status.class}">${status.text}</span>
                </td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="viewDetail('${item.id}')">
                        <i class="fas fa-eye"></i> 查看详情
                    </button>
                    <button class="btn btn-sm btn-secondary" onclick="uploadEvidence('${item.id}')">
                        <i class="fas fa-upload"></i> 上传佐证
                    </button>
                </td>
            </tr>
        `;
    }).join('');
    
    updatePagination();
}

// 更新分页
function updatePagination() {
    const total = filteredData.length;
    const totalPages = Math.ceil(total / pageSize);
    const start = (currentPage - 1) * pageSize + 1;
    const end = Math.min(currentPage * pageSize, total);
    
    document.getElementById('pageStart').textContent = total > 0 ? start : 0;
    document.getElementById('pageEnd').textContent = end;
    document.getElementById('totalItems').textContent = total;
    
    // 更新页码按钮
    const pagesContainer = document.getElementById('paginationPages');
    if (!pagesContainer) return;
    
    let pagesHTML = '';
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
            pagesHTML += `
                <button class="btn btn-sm ${i === currentPage ? 'active' : ''}" onclick="goToPage(${i})">
                    ${i}
                </button>
            `;
        } else if (i === currentPage - 2 || i === currentPage + 2) {
            pagesHTML += '<span style="padding: 0 8px;">...</span>';
        }
    }
    pagesContainer.innerHTML = pagesHTML;
    
    // 更新上一页/下一页按钮状态
    const prevBtn = document.getElementById('prevPage');
    const nextBtn = document.getElementById('nextPage');
    if (prevBtn) prevBtn.disabled = currentPage === 1;
    if (nextBtn) nextBtn.disabled = currentPage === totalPages || totalPages === 0;
}

// 绑定事件
function bindEvents() {
    // 搜索
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            setTimeout(filterData, 300);
        });
    }
    
    // 筛选器
    const statusFilter = document.getElementById('statusFilter');
    const unitFilter = document.getElementById('unitFilter');
    
    if (statusFilter) statusFilter.addEventListener('change', filterData);
    if (unitFilter) unitFilter.addEventListener('change', filterData);
}

// 筛选数据
function filterData() {
    const searchText = document.getElementById('searchInput')?.value.toLowerCase() || '';
    const statusValue = document.getElementById('statusFilter')?.value || '';
    const unitValue = document.getElementById('unitFilter')?.value || '';
    
    filteredData = mockRectifications.filter(item => {
        const matchSearch = !searchText || 
            item.id.toLowerCase().includes(searchText) ||
            item.title.toLowerCase().includes(searchText) ||
            item.responsible.toLowerCase().includes(searchText);
        
        const matchStatus = !statusValue || item.status === statusValue;
        const matchUnit = !unitValue || item.department === unitValue;
        
        return matchSearch && matchStatus && matchUnit;
    });
    
    currentPage = 1;
    renderTable();
}

// 重置筛选
function resetFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('statusFilter').value = '';
    document.getElementById('unitFilter').value = '';
    filterData();
}

// 分页函数
function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        renderTable();
    }
}

function nextPage() {
    const totalPages = Math.ceil(filteredData.length / pageSize);
    if (currentPage < totalPages) {
        currentPage++;
        renderTable();
    }
}

function goToPage(page) {
    currentPage = page;
    renderTable();
}

// 查看详情
function viewDetail(id) {
    currentRectification = mockRectifications.find(r => r.id === id);
    if (!currentRectification) return;
    
    // 填充基本信息
    document.getElementById('detailTaskNo').textContent = currentRectification.id;
    document.getElementById('detailUnit').textContent = currentRectification.department;
    document.getElementById('detailPerson').textContent = currentRectification.responsible;
    document.getElementById('detailCreateTime').textContent = currentRectification.createdAt;
    document.getElementById('detailDeadline').textContent = currentRectification.deadline;
    
    // 状态
    const statusMap = {
        'pending': '待整改',
        'in_progress': '整改中',
        'review': '待复查',
        'completed': '已完成'
    };
    document.getElementById('detailStatus').innerHTML = `<span class="status-badge status-${currentRectification.status}">${statusMap[currentRectification.status]}</span>`;
    
    // 进度
    const progressClass = currentRectification.progress >= 80 ? 'high' : currentRectification.progress >= 50 ? 'medium' : 'low';
    document.getElementById('detailProgress').className = `progress-bar ${progressClass}`;
    document.getElementById('detailProgress').style.width = currentRectification.progress + '%';
    document.getElementById('detailProgressText').textContent = currentRectification.progress + '%';
    
    // 整改计划
    document.getElementById('detailProblem').textContent = currentRectification.description || '-';
    document.getElementById('detailMeasures').textContent = currentRectification.measures || '-';
    
    // 关联工单信息
    const workOrderCard = document.getElementById('workOrderCard');
    const viewWorkOrderBtn = document.getElementById('viewRelatedWorkOrderBtn');
    
    if (currentRectification.workOrderId) {
        document.getElementById('relatedWorkOrderTitle').textContent = currentRectification.workOrderTitle || '关联工单';
        document.getElementById('relatedWorkOrderMeta').textContent = `工单编号: ${currentRectification.workOrderId} · 状态: ${currentRectification.workOrderStatus || '已完成'}`;
        
        viewWorkOrderBtn.style.display = 'inline-flex';
        viewWorkOrderBtn.onclick = function() {
            window.location.href = `work-order.html?id=${currentRectification.workOrderId}`;
        };
    } else {
        document.getElementById('relatedWorkOrderTitle').textContent = '暂无关联工单';
        document.getElementById('relatedWorkOrderMeta').textContent = '该整改任务未关联工单';
        viewWorkOrderBtn.style.display = 'none';
    }
    
    // 关联线索信息
    const clueCard = document.getElementById('clueCard');
    const viewClueBtn = document.getElementById('viewRelatedClueBtn');
    
    if (currentRectification.clueId) {
        clueCard.style.display = 'flex';
        document.getElementById('relatedClueTitle').textContent = currentRectification.clueTitle || '原始线索';
        document.getElementById('relatedClueMeta').textContent = `线索编号: ${currentRectification.clueId} · 类型: ${currentRectification.clueType || '系统预警'}`;
        
        viewClueBtn.onclick = function() {
            window.location.href = `clue-library.html?id=${currentRectification.clueId}`;
        };
    } else {
        clueCard.style.display = 'none';
    }
    
    // 显示模态框
    const modal = document.getElementById('detailModal');
    modal.style.display = 'flex';
    setTimeout(() => {
        modal.classList.add('modal-show');
    }, 10);
    switchTab('plan');
}

// 关闭详情模态框
function closeDetailModal() {
    const modal = document.getElementById('detailModal');
    modal.classList.remove('modal-show');
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
}

// 切换标签页
function switchTab(tabName) {
    currentTab = tabName;
    
    // 更新标签页激活状态
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // 更新内容显示
    document.querySelectorAll('.tab-pane').forEach(pane => {
        pane.classList.remove('active');
    });
    document.getElementById(`tab-${tabName}`).classList.add('active');
    
    // 加载对应内容
    if (tabName === 'indicators' && currentRectification) {
        loadIndicators();
    } else if (tabName === 'timeline' && currentRectification) {
        loadTimeline();
    } else if (tabName === 'evidence' && currentRectification) {
        loadEvidence();
    }
}

// 加载量化指标
function loadIndicators() {
    const container = document.getElementById('indicatorsList');
    if (!currentRectification || !currentRectification.metrics) {
        container.innerHTML = '<p style="text-align: center; color: var(--color-gray-500);">暂无量化指标</p>';
        return;
    }
    
    container.innerHTML = currentRectification.metrics.map(metric => `
        <div class="indicator-card">
            <h4>${metric.label}</h4>
            <div class="indicator-values">
                <span>当前值:</span>
                <strong>${metric.value}</strong>
            </div>
            <div class="indicator-values">
                <span>目标值:</span>
                <strong>${metric.target}</strong>
            </div>
            <div class="indicator-status ${metric.status}">
                <i class="fas fa-${metric.status === 'completed' ? 'check-circle' : metric.status === 'in_progress' ? 'clock' : 'hourglass-start'}"></i>
                ${metric.status === 'completed' ? '已完成' : metric.status === 'in_progress' ? '进行中' : '待开始'}
            </div>
            ${metric.completedDate ? `<div style="font-size: 12px; color: var(--color-gray-500); margin-top: 8px;">完成时间: ${metric.completedDate}</div>` : ''}
        </div>
    `).join('');
}

// 加载时间轴
function loadTimeline() {
    const container = document.getElementById('timelineList');
    if (!currentRectification || !currentRectification.timeline) {
        container.innerHTML = '<p style="text-align: center; color: var(--color-gray-500);">暂无时间轴记录</p>';
        return;
    }
    
    container.innerHTML = currentRectification.timeline.map(item => `
        <div class="timeline-item ${item.status}">
            <div class="timeline-dot"></div>
            <div class="timeline-content">
                <h4>${item.title}</h4>
                <div class="timeline-time">${item.date} · ${item.operator}</div>
                <div class="timeline-description">${item.desc}</div>
            </div>
        </div>
    `).join('');
}

// 加载佐证材料
function loadEvidence() {
    const container = document.getElementById('evidenceList');
    if (!currentRectification || !currentRectification.evidences || currentRectification.evidences.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--color-gray-500);">暂无佐证材料</p>';
        return;
    }
    
    container.innerHTML = currentRectification.evidences.map(file => {
        const iconMap = {
            'pdf': 'fa-file-pdf',
            'word': 'fa-file-word',
            'excel': 'fa-file-excel',
            'image': 'fa-file-image',
            'ppt': 'fa-file-powerpoint'
        };
        const icon = iconMap[file.type] || 'fa-file';
        
        return `
            <div class="evidence-item">
                <div class="evidence-icon">
                    <i class="fas ${icon}"></i>
                </div>
                <div class="evidence-name">${file.name}</div>
                <div class="evidence-meta">${file.size} · ${file.uploadDate}</div>
                <div class="evidence-meta" style="font-size: 11px;">上传人: ${file.uploader}</div>
                <div class="evidence-actions">
                    <button class="btn btn-sm btn-secondary" onclick="previewFile('${file.name}')">
                        <i class="fas fa-eye"></i> 预览
                    </button>
                    <button class="btn btn-sm btn-primary" onclick="downloadFile('${file.name}')">
                        <i class="fas fa-download"></i> 下载
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// 上传佐证
function uploadEvidence(id) {
    currentRectification = mockRectifications.find(r => r.id === id);
    const modal = document.getElementById('uploadModal');
    modal.style.display = 'flex';
    setTimeout(() => {
        modal.classList.add('modal-show');
    }, 10);
}

// 关闭上传模态框
function closeUploadModal() {
    const modal = document.getElementById('uploadModal');
    modal.classList.remove('modal-show');
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
    document.getElementById('evidenceDescription').value = '';
}

// 提交佐证
function submitEvidence() {
    const description = document.getElementById('evidenceDescription').value;
    if (!description) {
        showToast('请输入材料说明', 'warning');
        return;
    }
    
    showToast('佐证材料上传成功', 'success');
    closeUploadModal();
    
    // 更新进度
    if (currentRectification) {
        currentRectification.progress = Math.min(100, currentRectification.progress + 10);
        renderTable();
    }
}

// 复查任务
function reviewTask() {
    if (!currentRectification) return;
    
    if (confirm('确认通过复查吗？')) {
        showToast('复查通过', 'success');
        closeDetailModal();
    }
}

// 销号归档
function closeTask() {
    if (!currentRectification) return;
    
    if (confirm('确认销号归档吗？此操作不可撤销。')) {
        currentRectification.status = 'completed';
        currentRectification.progress = 100;
        currentRectification.completedAt = new Date().toISOString().split('T')[0];
        currentRectification.archivedAt = new Date().toISOString().split('T')[0];
        
        // 计算整改周期
        if (currentRectification.createdAt) {
            const created = new Date(currentRectification.createdAt);
            const archived = new Date(currentRectification.archivedAt);
            currentRectification.duration = Math.ceil((archived - created) / (1000 * 60 * 60 * 24));
        }
        
        // 显示归档成功提示，包含跳转按钮
        showArchiveSuccessToast();
        closeDetailModal();
        renderTable();
        updateDashboard();
    }
}

// 显示归档成功提示（带跳转按钮）
function showArchiveSuccessToast() {
    const toast = document.createElement('div');
    toast.className = 'fixed top-20 right-6 px-6 py-4 rounded-lg shadow-lg bg-green-500 text-white z-50';
    toast.style.minWidth = '320px';
    toast.innerHTML = `
        <div style="display: flex; align-items: center; margin-bottom: 12px;">
            <i class="fas fa-check-circle" style="font-size: 20px; margin-right: 12px;"></i>
            <div>
                <div style="font-weight: 600; font-size: 15px;">销号归档成功</div>
                <div style="font-size: 13px; opacity: 0.9; margin-top: 4px;">整改任务已归档，可在归档查询中查看</div>
            </div>
        </div>
        <button onclick="window.location.href='rectification-archive.html'" 
                style="width: 100%; padding: 8px; background: rgba(255,255,255,0.2); border: 1px solid rgba(255,255,255,0.3); 
                       border-radius: 6px; color: white; cursor: pointer; font-size: 13px; transition: all 0.2s;"
                onmouseover="this.style.background='rgba(255,255,255,0.3)'"
                onmouseout="this.style.background='rgba(255,255,255,0.2)'">
            <i class="fas fa-archive"></i> 立即查看归档
        </button>
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s';
        setTimeout(() => {
            if (toast.parentNode) {
                document.body.removeChild(toast);
            }
        }, 300);
    }, 5000);
}

// 预览文件
function previewFile(filename) {
    showToast('正在打开文件预览...', 'info');
}

// 下载文件
function downloadFile(filename) {
    showToast('文件下载中...', 'success');
}

// 导出数据
function exportData() {
    showToast('正在导出数据...', 'info');
    setTimeout(() => {
        showToast(`已导出 ${filteredData.length} 条数据`, 'success');
    }, 1000);
}

// 刷新数据
function refreshData() {
    filterData();
    updateDashboard();
    showToast('数据已刷新', 'success');
}

// 显示提示消息
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `fixed top-20 right-6 px-6 py-3 rounded-lg shadow-lg text-white z-50 ${
        type === 'success' ? 'bg-green-500' :
        type === 'error' ? 'bg-red-500' :
        type === 'warning' ? 'bg-yellow-500' :
        'bg-blue-500'
    }`;
    toast.innerHTML = `
        <div class="flex items-center space-x-2">
            <i class="fas ${
                type === 'success' ? 'fa-check-circle' :
                type === 'error' ? 'fa-times-circle' :
                type === 'warning' ? 'fa-exclamation-triangle' :
                'fa-info-circle'
            }"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s';
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 2000);
}

// 打开创建整改单模态框（从工单生成）
function openCreateRectificationModal(workOrderData) {
    // 创建一个简单的创建整改单对话框
    const modal = document.createElement('div');
    modal.id = 'createRectificationModal';
    modal.className = 'modal-overlay';
    modal.style.display = 'flex';
    
    modal.innerHTML = `
        <div class="modal-container modal-lg">
            <div class="modal-header">
                <h3 class="modal-title">
                    <i class="fas fa-plus-circle"></i>
                    创建整改任务
                </h3>
                <button class="modal-close-btn" onclick="closeCreateRectificationModal()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <form id="createRectificationForm">
                    <!-- 来源信息 -->
                    <div class="detail-section" style="background: #f3f4f6; padding: 16px; border-radius: 8px; margin-bottom: 20px;">
                        <h4 style="font-size: 14px; font-weight: 600; margin-bottom: 12px; color: #374151;">
                            <i class="fas fa-link"></i> 来源信息
                        </h4>
                        <div style="font-size: 13px; color: #6b7280; line-height: 1.8;">
                            <div><strong>工单编号：</strong>${workOrderData.workOrderId || '-'}</div>
                            <div><strong>工单标题：</strong>${workOrderData.workOrderTitle || '-'}</div>
                            <div><strong>工单类型：</strong>${workOrderData.workOrderType || '-'}</div>
                            ${workOrderData.clueId ? `<div><strong>原始线索：</strong>${workOrderData.clueId} - ${workOrderData.clueTitle}</div>` : ''}
                        </div>
                    </div>
                    
                    <!-- 基本信息 -->
                    <div class="form-group">
                        <label class="form-label" style="display: block; margin-bottom: 8px; font-weight: 500;">
                            整改任务标题 <span style="color: #ef4444;">*</span>
                        </label>
                        <input type="text" id="rectTitle" class="form-control" required 
                               value="${(workOrderData.workOrderTitle || '').replace('核查', '整改').replace('检查', '整改')}"
                               placeholder="请输入整改任务标题">
                    </div>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                        <div class="form-group">
                            <label class="form-label" style="display: block; margin-bottom: 8px; font-weight: 500;">
                                责任单位 <span style="color: #ef4444;">*</span>
                            </label>
                            <select id="rectDepartment" class="form-control" required>
                                <option value="">请选择</option>
                                <option value="财务处">财务处</option>
                                <option value="科研处">科研处</option>
                                <option value="资产处">资产处</option>
                                <option value="人事处">人事处</option>
                                <option value="教务处">教务处</option>
                                <option value="招生办">招生办</option>
                                <option value="基建处">基建处</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label" style="display: block; margin-bottom: 8px; font-weight: 500;">
                                责任人 <span style="color: #ef4444;">*</span>
                            </label>
                            <input type="text" id="rectResponsible" class="form-control" required placeholder="请输入责任人姓名">
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label" style="display: block; margin-bottom: 8px; font-weight: 500;">
                            整改时限 <span style="color: #ef4444;">*</span>
                        </label>
                        <input type="date" id="rectDeadline" class="form-control" required>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label" style="display: block; margin-bottom: 8px; font-weight: 500;">
                            问题描述 <span style="color: #ef4444;">*</span>
                        </label>
                        <textarea id="rectDescription" class="form-control" rows="4" required 
                                  placeholder="请描述需要整改的问题">${workOrderData.description || ''}</textarea>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label" style="display: block; margin-bottom: 8px; font-weight: 500;">
                            整改措施 <span style="color: #ef4444;">*</span>
                        </label>
                        <textarea id="rectMeasures" class="form-control" rows="5" required 
                                  placeholder="请输入具体的整改措施（每行一条）"></textarea>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" onclick="closeCreateRectificationModal()">取消</button>
                <button class="btn btn-primary" onclick="submitCreateRectification()">
                    <i class="fas fa-check"></i> 创建整改任务
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // 设置默认截止日期为30天后
    const deadline = new Date();
    deadline.setDate(deadline.getDate() + 30);
    document.getElementById('rectDeadline').value = deadline.toISOString().split('T')[0];
    
    // 显示动画
    setTimeout(() => {
        modal.classList.add('modal-show');
    }, 10);
    
    // 保存工单数据供提交时使用
    window.currentWorkOrderData = workOrderData;
    
    showToast('请填写整改任务信息', 'info');
}

// 关闭创建整改单模态框
function closeCreateRectificationModal() {
    const modal = document.getElementById('createRectificationModal');
    if (modal) {
        modal.classList.remove('modal-show');
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
    
    // 清除URL参数
    window.history.replaceState({}, document.title, window.location.pathname);
}

// 提交创建整改单
function submitCreateRectification() {
    const form = document.getElementById('createRectificationForm');
    if (!form.checkValidity()) {
        showToast('请填写所有必填项', 'warning');
        form.reportValidity();
        return;
    }
    
    const workOrderData = window.currentWorkOrderData || {};
    
    // 生成整改单编号
    const newId = 'ZG' + new Date().getFullYear() + String(mockRectifications.length + 1).padStart(3, '0');
    
    // 创建新的整改任务
    const newRectification = {
        id: newId,
        title: document.getElementById('rectTitle').value,
        department: document.getElementById('rectDepartment').value,
        responsible: document.getElementById('rectResponsible').value,
        phone: '138****0000',
        deadline: document.getElementById('rectDeadline').value,
        progress: 0,
        status: 'pending',
        createdAt: new Date().toISOString().split('T')[0],
        source: '工单 ' + (workOrderData.workOrderId || ''),
        sourceType: workOrderData.workOrderType || '纪检核查',
        
        // 关联工单
        workOrderId: workOrderData.workOrderId,
        workOrderTitle: workOrderData.workOrderTitle,
        workOrderStatus: '已完成',
        
        // 关联线索
        clueId: workOrderData.clueId || null,
        clueTitle: workOrderData.clueTitle || null,
        clueType: '系统预警',
        
        description: document.getElementById('rectDescription').value,
        measures: document.getElementById('rectMeasures').value,
        
        metrics: [],
        timeline: [
            {
                date: new Date().toISOString().split('T')[0],
                title: '整改任务下达',
                desc: '根据工单核查结果创建整改任务',
                status: 'completed',
                operator: '纪检监察室'
            }
        ],
        evidences: []
    };
    
    // 添加到数据中
    mockRectifications.unshift(newRectification);
    
    showToast('整改任务创建成功！', 'success');
    
    // 关闭模态框
    closeCreateRectificationModal();
    
    // 刷新页面数据
    setTimeout(() => {
        filterData();
        updateDashboard();
    }, 500);
}
