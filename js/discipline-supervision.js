// 纪检监督页面脚本

// ==================== 第一议题监督数据 ====================

// 异常单位数据
const abnormalUnitsData = [
    {
        unitId: 'UNIT-001',
        unit: '计算机学院',
        actualCount: 2,
        requiredCount: 4,
        missing: 2,
        risk: 'high',
        responsible: '张三',
        responsibleTitle: '党委书记',
        phone: '138****1234',
        lastStudyDate: '2025-09-15',
        missingTopics: [
            '学习习近平总书记关于科技创新的重要论述',
            '学习党的二十大报告关于教育科技人才的论述'
        ],
        reason: '因学院工作繁忙，部分会议未能按时召开',
        plan: '计划在11月补齐缺失的学习内容，加强会议组织管理'
    },
    {
        unitId: 'UNIT-002',
        unit: '经济管理学院',
        actualCount: 3,
        requiredCount: 4,
        missing: 1,
        risk: 'medium',
        responsible: '李四',
        responsibleTitle: '党委书记',
        phone: '139****5678',
        lastStudyDate: '2025-10-15',
        missingTopics: [
            '学习中央经济工作会议精神'
        ],
        reason: '10月份有重要学术会议，调整了部分党委会议安排',
        plan: '已安排在10月底补学'
    },
    {
        unitId: 'UNIT-003',
        unit: '外国语学院',
        actualCount: 2,
        requiredCount: 4,
        missing: 2,
        risk: 'high',
        responsible: '王五',
        responsibleTitle: '党委书记',
        phone: '136****9012',
        lastStudyDate: '2025-10-12',
        missingTopics: [
            '学习习近平总书记关于文化建设的重要论述',
            '学习全国宣传思想文化工作会议精神'
        ],
        reason: '学院党委书记外出学习，部分会议延期',
        plan: '书记已返校，将在近期组织补学'
    },
    {
        unitId: 'UNIT-004',
        unit: '机械工程学院',
        actualCount: 3,
        requiredCount: 4,
        missing: 1,
        risk: 'medium',
        responsible: '赵六',
        responsibleTitle: '党委书记',
        phone: '137****3456',
        lastStudyDate: '2025-10-10',
        missingTopics: [
            '学习习近平总书记关于制造强国的重要论述'
        ],
        reason: '学院承办全国性学术会议，会议安排较紧',
        plan: '会议结束后立即安排补学'
    },
    {
        unitId: 'UNIT-005',
        unit: '化学化工学院',
        actualCount: 1,
        requiredCount: 4,
        missing: 3,
        risk: 'high',
        responsible: '孙七',
        responsibleTitle: '党委书记',
        phone: '135****7890',
        lastStudyDate: '2025-10-08',
        missingTopics: [
            '学习习近平总书记关于生态文明建设的重要论述',
            '学习党的二十大报告关于绿色发展的论述',
            '学习中央环保督察工作要求'
        ],
        reason: '学院实验室安全整改工作占用较多时间',
        plan: '整改工作已基本完成，将集中补齐学习内容'
    }
];

// 会议纪要分析数据
const minutesAnalysisData = [
    {
        recordId: 'RECORD-001',
        date: '2025-10-18',
        unit: '计算机学院',
        unitId: 'UNIT-001',
        topic: '党委会第10次会议',
        content: '学习习近平总书记关于教育工作的重要论述',
        duration: 45,
        result: '正常',
        participants: ['张三（书记）', '李明（副书记）', '王芳（组织委员）', '刘强（宣传委员）', '陈静（纪检委员）'],
        keyPoints: [
            '深入学习习近平总书记关于教育工作的重要论述',
            '讨论如何将总书记讲话精神贯彻到学院工作中',
            '研究制定学院人才培养改革方案',
            '部署下一阶段重点工作'
        ],
        studyMaterials: [
            '《习近平总书记关于教育的重要论述摘编》',
            '《求是》杂志相关文章',
            '教育部学习材料'
        ],
        discussion: '与会同志围绕总书记讲话精神进行了深入讨论，一致认为要坚持立德树人根本任务，培养德智体美劳全面发展的社会主义建设者和接班人。',
        nextStep: '要求各系部结合实际制定具体落实措施，下次会议进行汇报交流。'
    },
    {
        recordId: 'RECORD-002',
        date: '2025-10-15',
        unit: '经济管理学院',
        unitId: 'UNIT-002',
        topic: '党委会第9次会议',
        content: '学习党的二十大精神',
        duration: 50,
        result: '正常',
        participants: ['李四（书记）', '张伟（副书记）', '赵敏（组织委员）', '孙丽（宣传委员）', '周杰（纪检委员）'],
        keyPoints: [
            '系统学习党的二十大报告',
            '重点学习关于经济建设的重要论述',
            '研究学院如何服务国家经济发展战略',
            '讨论学科建设和人才培养方向'
        ],
        studyMaterials: [
            '党的二十大报告',
            '党的二十大报告辅导读本',
            '经济日报相关评论文章'
        ],
        discussion: '大家一致表示要深刻领会党的二十大精神，把思想和行动统一到党中央决策部署上来，为建设社会主义现代化国家贡献力量。',
        nextStep: '组织全院师生开展专题学习，将二十大精神融入教学科研工作。'
    },
    {
        recordId: 'RECORD-003',
        date: '2025-10-12',
        unit: '外国语学院',
        unitId: 'UNIT-003',
        topic: '党委会第8次会议',
        content: '学习中央经济工作会议精神',
        duration: 30,
        result: '时长偏短',
        participants: ['王五（书记）', '李娜（副书记）', '张华（组织委员）'],
        keyPoints: [
            '学习中央经济工作会议主要精神',
            '讨论学院如何做好外语人才培养工作'
        ],
        studyMaterials: [
            '中央经济工作会议公报',
            '人民日报评论员文章'
        ],
        discussion: '简要学习了会议精神，但讨论不够深入。',
        nextStep: '需要组织更深入的学习讨论。',
        issues: ['学习时长不足30分钟，未达到规定要求', '参会人员不齐，缺少部分委员', '学习讨论不够深入']
    },
    {
        recordId: 'RECORD-004',
        date: '2025-10-10',
        unit: '机械工程学院',
        unitId: 'UNIT-004',
        topic: '党委会第11次会议',
        content: '学习全国教育大会精神',
        duration: 55,
        result: '正常',
        participants: ['赵六（书记）', '钱七（副书记）', '孙八（组织委员）', '李九（宣传委员）', '周十（纪检委员）', '吴十一（统战委员）'],
        keyPoints: [
            '全面学习全国教育大会精神',
            '深入讨论新时代工程教育改革',
            '研究学院"新工科"建设方案',
            '部署产教融合工作'
        ],
        studyMaterials: [
            '全国教育大会文件汇编',
            '教育部关于新工科建设的指导意见',
            '工程教育认证标准'
        ],
        discussion: '与会同志结合学院实际，就如何推进新工科建设、深化产教融合进行了热烈讨论，提出了许多建设性意见。',
        nextStep: '成立新工科建设工作组，制定详细实施方案，下月提交党委会审议。'
    },
    {
        recordId: 'RECORD-005',
        date: '2025-10-08',
        unit: '化学化工学院',
        unitId: 'UNIT-005',
        topic: '党委会第7次会议',
        content: '学习党章党规',
        duration: 40,
        result: '正常',
        participants: ['孙七（书记）', '郑十二（副书记）', '王十三（组织委员）', '李十四（宣传委员）'],
        keyPoints: [
            '学习新修订的党章',
            '学习党内重要法规',
            '讨论加强党员教育管理',
            '研究党风廉政建设工作'
        ],
        studyMaterials: [
            '中国共产党章程',
            '中国共产党廉洁自律准则',
            '中国共产党纪律处分条例'
        ],
        discussion: '大家认真学习了党章党规，表示要严格遵守党的纪律规矩，做合格党员。',
        nextStep: '在全院党员中开展党章党规学习教育活动。'
    }
];

// ==================== 师德师风监督数据 ====================

// 师德预警数据
const teacherEthicsWarningData = [
    {
        teacher: '张**',
        teacherId: 'T001',
        fullName: '张某某',
        college: '文学院',
        position: '副教授',
        warningType: '师德失范',
        warningLevel: 'high',
        score: 2.8,
        reportCount: 3,
        date: '2025-10-20',
        issues: ['课堂言论不当，传播负面情绪', '对学生态度恶劣，存在歧视行为', '多次收到学生投诉'],
        sources: [
            { type: '学生评教', score: 2.5, feedback: '老师经常在课堂上发表不当言论' },
            { type: '同事举报', content: '对待学生态度恶劣，存在歧视现象' },
            { type: '学生投诉', content: '课堂管理混乱，经常迟到早退' }
        ],
        suggestedAction: '立即约谈该教师，进行师德教育，暂停其教学工作，组织专项调查'
    },
    {
        teacher: '李**',
        teacherId: 'T002',
        fullName: '李某某',
        college: '数学学院',
        position: '教授',
        warningType: '学术不端',
        warningLevel: 'high',
        score: 3.2,
        reportCount: 2,
        date: '2025-10-18',
        issues: ['论文存在抄袭嫌疑', '数据造假问题', '一稿多投违规'],
        sources: [
            { type: '学术检测', score: 0, feedback: '论文查重率达到45%，存在大段抄袭' },
            { type: '同行举报', content: '实验数据存在造假嫌疑，无法重现' },
            { type: '期刊反馈', content: '同一篇文章投稿多个期刊' }
        ],
        suggestedAction: '暂停其学术活动，成立调查组进行深入调查，如属实将给予严厉处分'
    },
    {
        teacher: '王**',
        teacherId: 'T003',
        fullName: '王某某',
        college: '物理学院',
        position: '讲师',
        warningType: '违规补课',
        warningLevel: 'medium',
        score: 3.8,
        reportCount: 1,
        date: '2025-10-15',
        issues: ['校外有偿补课', '利用职务便利推荐学生参加培训班'],
        sources: [
            { type: '家长举报', content: '该教师在校外培训机构兼职，给本校学生补课' },
            { type: '暗访调查', content: '确认该教师在某培训机构任教' }
        ],
        suggestedAction: '责令立即停止违规补课行为，退还违规收入，给予警告处分'
    },
    {
        teacher: '赵**',
        teacherId: 'T004',
        fullName: '赵某某',
        college: '化学学院',
        position: '副教授',
        warningType: '师德失范',
        warningLevel: 'medium',
        score: 3.5,
        reportCount: 2,
        date: '2025-10-12',
        issues: ['课堂管理不当', '对学生缺乏耐心'],
        sources: [
            { type: '学生评教', score: 3.2, feedback: '老师上课缺乏耐心，经常批评学生' },
            { type: '督导反馈', content: '课堂管理需要改进，师生互动不足' }
        ],
        suggestedAction: '进行师德教育，参加教学能力培训，改进教学方法'
    },
    {
        teacher: '孙**',
        teacherId: 'T005',
        fullName: '孙某某',
        college: '计算机学院',
        position: '教授',
        warningType: '学术不端',
        warningLevel: 'low',
        score: 4.1,
        reportCount: 1,
        date: '2025-10-10',
        issues: ['论文署名不规范'],
        sources: [{ type: '期刊编辑', content: '论文作者署名顺序存在争议' }],
        suggestedAction: '进行学术规范教育，规范论文署名行为'
    }
];

// 学术不端检测数据
const academicMisconductData = [
    {
        teacher: '李**',
        teacherId: 'T002',
        fullName: '李某某',
        college: '数学学院',
        paper: '关于微分方程的数值解法研究',
        journal: '数学学报',
        type: '论文抄袭',
        similarity: 45,
        date: '2025-10-18',
        risk: 'high',
        details: {
            totalPages: 12,
            plagiarizedPages: 5,
            originalSources: ['《数值分析方法》- 张三著', '《微分方程理论》- 李四著', '国外期刊论文3篇']
        },
        evidence: ['第3-7页内容与参考文献高度相似', '核心算法部分完全照搬他人成果', '未标注引用来源', '查重系统检测相似度达45%'],
        suggestedAction: '撤回论文，暂停该教师学术活动，进行学术诚信教育'
    },
    {
        teacher: '周**',
        teacherId: 'T006',
        fullName: '周某某',
        college: '生物学院',
        paper: '植物基因表达调控机制研究',
        journal: '生物学杂志',
        type: '数据造假',
        similarity: 0,
        date: '2025-10-16',
        risk: 'high',
        details: { totalPages: 15, suspiciousData: 8, originalSources: [] },
        evidence: ['实验数据过于完美，缺乏合理的误差范围', '部分图表数据无法通过重复实验验证', '统计分析结果存在明显异常', '实验记录不完整，缺少原始数据'],
        suggestedAction: '立即暂停相关研究项目，成立调查组核实数据真实性'
    },
    {
        teacher: '吴**',
        teacherId: 'T007',
        fullName: '吴某某',
        college: '经济学院',
        paper: '宏观经济政策效应分析',
        journal: '经济研究',
        type: '一稿多投',
        similarity: 15,
        date: '2025-10-14',
        risk: 'medium',
        details: { totalPages: 20, submittedJournals: ['经济研究', '经济学季刊', '金融研究'] },
        evidence: ['同一篇论文同时投稿3个期刊', '未告知编辑部多投情况', '违反学术期刊投稿规定'],
        suggestedAction: '撤回多余投稿，向相关期刊道歉，进行学术规范教育'
    },
    {
        teacher: '郑**',
        teacherId: 'T008',
        fullName: '郑某某',
        college: '外国语学院',
        paper: '英语教学方法创新研究',
        journal: '外语教学与研究',
        type: '署名争议',
        similarity: 8,
        date: '2025-10-12',
        risk: 'low',
        details: { totalPages: 10, disputedAuthors: ['郑某某（第一作者）', '钱某某（声称应为第一作者）'] },
        evidence: ['合作者对署名顺序存在异议', '贡献度分配不明确', '缺少署名协议'],
        suggestedAction: '协调解决署名争议，建立规范的合作协议制度'
    }
];

// 违规补课监控数据
const illegalTutoringData = [
    {
        teacher: '王**',
        teacherId: 'T003',
        fullName: '王某某',
        college: '物理学院',
        institution: '某某培训机构',
        institutionAddress: '海淀区某某路88号',
        subject: '高中物理',
        students: 15,
        fee: 200,
        totalIncome: 45000,
        period: '2025年9月-10月',
        risk: 'high',
        evidence: ['在校外培训机构任教', '教授本校学生，存在利益冲突', '收费标准较高，每小时200元', '累计违规收入4.5万元'],
        reportSource: '家长举报',
        investigationResult: '经调查属实',
        suggestedAction: '立即停止违规补课，退还全部违规收入，给予记过处分'
    },
    {
        teacher: '陈**',
        teacherId: 'T009',
        fullName: '陈某某',
        college: '数学学院',
        institution: '某某教育中心',
        institutionAddress: '朝阳区某某街99号',
        subject: '高中数学',
        students: 20,
        fee: 180,
        totalIncome: 54000,
        period: '2025年8月-10月',
        risk: 'high',
        evidence: ['长期在校外机构兼职', '利用职务便利推荐学生', '影响正常教学工作', '违规收入较大'],
        reportSource: '同事举报',
        investigationResult: '调查中',
        suggestedAction: '暂停教学工作，深入调查违规情况，依规严肃处理'
    },
    {
        teacher: '林**',
        teacherId: 'T010',
        fullName: '林某某',
        college: '英语学院',
        institution: '某某外语培训班',
        institutionAddress: '西城区某某胡同66号',
        subject: '英语口语',
        students: 8,
        fee: 150,
        totalIncome: 18000,
        period: '2025年10月',
        risk: 'medium',
        evidence: ['私人开设培训班', '学生主要为本校学生', '收费相对较低但仍属违规'],
        reportSource: '学生举报',
        investigationResult: '已确认',
        suggestedAction: '责令停止违规行为，退还收入，给予警告处分'
    },
    {
        teacher: '黄**',
        teacherId: 'T011',
        fullName: '黄某某',
        college: '化学学院',
        institution: '某某辅导班',
        institutionAddress: '丰台区某某小区',
        subject: '高中化学',
        students: 12,
        fee: 120,
        totalIncome: 21600,
        period: '2025年9月-10月',
        risk: 'medium',
        evidence: ['在居民区开设辅导班', '主要面向高考学生', '收费标准适中但违反规定'],
        reportSource: '匿名举报',
        investigationResult: '正在核实',
        suggestedAction: '核实情况后依规处理，加强师德教育'
    }
];

// ==================== 三重一大监督数据 ====================

// 重大事项识别数据
const majorIssuesData = [
    {
        issueId: 'MAJOR-001',
        issue: '新校区建设项目',
        type: '重大项目',
        amount: 500000000,
        unit: '基建处',
        date: '2025-10-18',
        status: '已决策',
        meetingType: '党委常委会第15次会议',
        voteResult: '全票通过',
        overview: '新校区建设项目是学校"十四五"规划重点项目，总投资5亿元，建设周期3年，包括教学楼、实验楼、图书馆等设施',
        basis: '根据学校发展规划和办学需要，经过充分论证和风险评估，符合"三重一大"决策要求'
    },
    {
        issueId: 'MAJOR-002',
        issue: '学科带头人引进',
        type: '重要人事',
        amount: 5000000,
        unit: '人事处',
        date: '2025-10-15',
        status: '待决策',
        meetingType: '待召开党委常委会',
        voteResult: '待表决',
        overview: '拟引进3名学科带头人，包括1名院士、2名长江学者，总投入约500万元',
        basis: '提升学科竞争力，推进双一流建设'
    },
    {
        issueId: 'MAJOR-003',
        issue: '科研平台建设',
        type: '重大项目',
        amount: 80000000,
        unit: '科研处',
        date: '2025-10-12',
        status: '已决策',
        meetingType: '校长办公会第12次会议',
        voteResult: '8票赞成，1票弃权',
        overview: '建设国家级科研平台，总投资8000万元，包括实验室、设备采购等',
        basis: '提升科研能力，支撑重大科研项目'
    },
    {
        issueId: 'MAJOR-004',
        issue: '院系调整方案',
        type: '重大改革',
        amount: 0,
        unit: '发展规划处',
        date: '2025-10-10',
        status: '待决策',
        meetingType: '待召开党委全委会',
        voteResult: '待表决',
        overview: '优化学科布局，调整部分院系设置，涉及5个学院',
        basis: '适应学科发展需要，提高办学效益'
    },
    {
        issueId: 'MAJOR-005',
        issue: '大型设备采购',
        type: '重大支出',
        amount: 25000000,
        unit: '资产管理处',
        date: '2025-10-08',
        status: '已决策',
        meetingType: '校长办公会第11次会议',
        voteResult: '一致通过',
        overview: '采购大型科研设备，包括电子显微镜、质谱仪等，总金额2500万元',
        basis: '提升科研条件，支撑学科建设'
    }
];

// 决策过程完整性数据
const decisionProcessData = [
    {
        issueId: 'MAJOR-001',
        issue: '新校区建设项目',
        research: true,
        expert: true,
        risk: true,
        collective: true,
        completeness: 100,
        riskLevel: 'low',
        procedures: [
            { name: '调查研究', completed: true, date: '2025-09-15', note: '形成调研报告' },
            { name: '专家论证', completed: true, date: '2025-09-25', note: '专家组一致通过' },
            { name: '风险评估', completed: true, date: '2025-10-05', note: '风险可控' },
            { name: '集体决策', completed: true, date: '2025-10-18', note: '党委常委会全票通过' }
        ],
        issues: []
    },
    {
        issueId: 'MAJOR-002',
        issue: '学科带头人引进',
        research: true,
        expert: false,
        risk: true,
        collective: false,
        completeness: 50,
        riskLevel: 'high',
        procedures: [
            { name: '调查研究', completed: true, date: '2025-09-20', note: '完成人才需求调研' },
            { name: '专家论证', completed: false, date: '-', note: '未组织专家论证' },
            { name: '风险评估', completed: true, date: '2025-10-01', note: '完成风险评估' },
            { name: '集体决策', completed: false, date: '-', note: '尚未提交会议讨论' }
        ],
        issues: ['缺少专家论证环节', '未进行集体决策']
    },
    {
        issueId: 'MAJOR-003',
        issue: '科研平台建设',
        research: true,
        expert: true,
        risk: false,
        collective: true,
        completeness: 75,
        riskLevel: 'medium',
        procedures: [
            { name: '调查研究', completed: true, date: '2025-09-10', note: '完成可行性研究' },
            { name: '专家论证', completed: true, date: '2025-09-28', note: '专家组通过' },
            { name: '风险评估', completed: false, date: '-', note: '风险评估不够充分' },
            { name: '集体决策', completed: true, date: '2025-10-12', note: '校长办公会通过' }
        ],
        issues: ['风险评估不够充分']
    },
    {
        issueId: 'MAJOR-004',
        issue: '院系调整方案',
        research: true,
        expert: true,
        risk: true,
        collective: true,
        completeness: 100,
        riskLevel: 'low',
        procedures: [
            { name: '调查研究', completed: true, date: '2025-08-15', note: '广泛征求意见' },
            { name: '专家论证', completed: true, date: '2025-09-05', note: '专家组论证通过' },
            { name: '风险评估', completed: true, date: '2025-09-20', note: '完成风险评估' },
            { name: '集体决策', completed: true, date: '2025-10-10', note: '待党委全委会审议' }
        ],
        issues: []
    },
    {
        issueId: 'MAJOR-005',
        issue: '大型设备采购',
        research: true,
        expert: true,
        risk: false,
        collective: true,
        completeness: 75,
        riskLevel: 'medium',
        procedures: [
            { name: '调查研究', completed: true, date: '2025-09-01', note: '完成需求调研' },
            { name: '专家论证', completed: true, date: '2025-09-18', note: '技术专家论证' },
            { name: '风险评估', completed: false, date: '-', note: '缺少财务风险评估' },
            { name: '集体决策', completed: true, date: '2025-10-08', note: '校长办公会通过' }
        ],
        issues: ['缺少财务风险评估']
    }
];

// 会议纪要匹配数据
const minutesMatchData = [
    {
        issueId: 'MAJOR-001',
        issue: '新校区建设项目',
        expected: '党委常委会',
        actual: '党委常委会',
        status: '匹配',
        time: '2025-10-15',
        risk: 'low',
        meetingDate: '2025-10-15',
        meetingNo: '党委常委会第15次会议',
        participants: ['党委书记', '校长', '党委副书记', '副校长（分管基建）', '副校长（分管财务）', '纪委书记', '其他常委'],
        keyPoints: ['审议通过新校区建设总体规划', '确定建设规模和投资预算', '明确建设时间表和责任分工', '要求严格按照程序推进项目实施'],
        decisions: ['同意启动新校区建设项目', '批准项目可行性研究报告', '成立新校区建设领导小组', '授权基建处开展前期工作']
    },
    {
        issueId: 'MAJOR-002',
        issue: '学科带头人引进',
        expected: '党委常委会',
        actual: '未找到',
        status: '未匹配',
        time: '-',
        risk: 'high',
        meetingDate: '-',
        meetingNo: '-',
        participants: [],
        keyPoints: [],
        decisions: [],
        issues: ['该事项尚未召开正式会议', '缺少会议纪要记录', '决策程序不完整']
    },
    {
        issueId: 'MAJOR-003',
        issue: '科研平台建设',
        expected: '校长办公会',
        actual: '校长办公会',
        status: '匹配',
        time: '2025-10-10',
        risk: 'low',
        meetingDate: '2025-10-10',
        meetingNo: '校长办公会第12次会议',
        participants: ['校长', '副校长（分管科研）', '副校长（分管财务）', '科研处长', '财务处长', '发展规划处长'],
        keyPoints: ['审议科研平台建设方案', '讨论投资预算和资金来源', '明确建设进度和验收标准'],
        decisions: ['原则同意科研平台建设方案', '批准8000万元建设预算', '要求科研处制定详细实施方案']
    },
    {
        issueId: 'MAJOR-004',
        issue: '院系调整方案',
        expected: '党委全委会',
        actual: '党委常委会',
        status: '会议级别不符',
        time: '2025-10-08',
        risk: 'medium',
        meetingDate: '2025-10-08',
        meetingNo: '党委常委会第14次会议',
        participants: ['党委书记', '校长', '党委副书记', '纪委书记', '其他常委'],
        keyPoints: ['讨论院系调整方案', '听取各方意见', '初步形成调整意见'],
        decisions: ['原则同意调整方向', '要求进一步完善方案', '提交党委全委会审议'],
        issues: ['应由党委全委会审议，但在常委会讨论', '会议级别不符合规定']
    },
    {
        issueId: 'MAJOR-005',
        issue: '大型设备采购',
        expected: '校长办公会',
        actual: '校长办公会',
        status: '匹配',
        time: '2025-10-05',
        risk: 'low',
        meetingDate: '2025-10-05',
        meetingNo: '校长办公会第11次会议',
        participants: ['校长', '副校长（分管科研）', '副校长（分管财务）', '资产管理处长', '财务处长', '审计处长'],
        keyPoints: ['审议大型设备采购方案', '讨论设备技术参数和采购方式', '明确采购程序和监督机制'],
        decisions: ['同意采购方案', '批准2500万元采购预算', '要求严格按照政府采购程序执行']
    }
];

// 初始化页面
document.addEventListener('DOMContentLoaded', function () {
    // 检查 URL 参数，如果有 type 参数则加载对应模块
    const urlParams = new URLSearchParams(window.location.search);
    const moduleType = urlParams.get('type');

    if (moduleType) {
        // 移除所有内容区域的活动状态
        document.querySelectorAll('.supervision-content').forEach(content => content.classList.remove('active'));

        // 激活当前模块的内容区域
        const content = document.getElementById(`${moduleType}-content`);
        if (content) {
            content.classList.add('active');
            // 加载对应模块内容
            loadModuleContent(moduleType);
        } else {
            // 如果找不到对应模块，加载第一议题
            loadFirstTopicModule();
        }
    } else {
        // 没有参数，默认加载第一议题
        loadFirstTopicModule();
    }
});

// 初始化导航（已移除页面内导航，此函数保留以防其他地方调用）
function initNavigation() {
    // 页面内导航已移除，通过侧边栏菜单切换
    const navItems = document.querySelectorAll('.supervision-nav-item');

    navItems.forEach(item => {
        item.addEventListener('click', function (e) {
            e.preventDefault();

            // 移除所有活动状态
            navItems.forEach(nav => nav.classList.remove('active'));
            document.querySelectorAll('.supervision-content').forEach(content => {
                content.classList.remove('active');
            });

            // 添加当前活动状态
            this.classList.add('active');
            const module = this.dataset.module;
            const content = document.getElementById(`${module}-content`);
            if (content) {
                content.classList.add('active');
            }

            // 加载对应模块内容
            loadModuleContent(module);
        });
    });
}

// 加载模块内容
function loadModuleContent(module) {
    switch (module) {
        case 'first-topic':
            loadFirstTopicModule();
            break;
        case 'major-decision':
            loadMajorDecisionModule();
            break;
        case 'enrollment':
            loadEnrollmentModule();
            break;
        case 'research-funds':
            loadResearchFundsModule();
            break;
        case 'construction':
            loadConstructionModule();
            break;
        case 'finance':
            loadFinanceModule();
            break;
        case 'eight-rules':
            loadEightRulesModule();
            break;
        case 'teacher-ethics':
            loadTeacherEthicsModule();
            break;
        case 'three-major':
            loadThreeMajorModule();
            break;
    }
}

// ==================== 加载函数 ====================

// 加载第一议题监督模块
function loadFirstTopicModule() {
    loadFirstTopicStats();
    loadAbnormalUnits();
    loadMinutesAnalysis();
}

// 加载第一议题统计数据
function loadFirstTopicStats() {
    const stats = {
        monthlyStudyCount: 156,
        coveredUnits: 42,
        abnormalUnits: abnormalUnitsData.length,
        avgDuration: 45
    };

    document.getElementById('monthlyStudyCount').textContent = stats.monthlyStudyCount;
    document.getElementById('coveredUnits').textContent = stats.coveredUnits;
    document.getElementById('abnormalUnits').textContent = stats.abnormalUnits;
    document.getElementById('avgDuration').textContent = stats.avgDuration + '分钟';
}

// 加载异常单位清单
function loadAbnormalUnits() {
    const tbody = document.querySelector('#abnormalUnitsTable tbody');
    if (!tbody) return;
    
    tbody.innerHTML = abnormalUnitsData.map(item => `
        <tr>
            <td class="font-medium text-gray-900">${item.unit}</td>
            <td>${item.actualCount}</td>
            <td>${item.requiredCount}</td>
            <td class="text-red-600 font-medium">${item.missing}</td>
            <td>
                <span class="risk-badge ${item.risk}">
                    ${item.risk === 'high' ? '高风险' : item.risk === 'medium' ? '中风险' : '低风险'}
                </span>
            </td>
            <td>${item.responsible}</td>
            <td>
                <button class="action-btn action-btn-primary mr-2" onclick="viewUnitDetail('${item.unitId}')">
                    <i class="fas fa-eye"></i> 查看
                </button>
                <button class="action-btn action-btn-secondary" onclick="sendReminder('${item.unitId}')">
                    <i class="fas fa-bell"></i> 提醒
                </button>
            </td>
        </tr>
    `).join('');
}

// 加载会议纪要分析结果
function loadMinutesAnalysis() {
    const tbody = document.querySelector('#minutesAnalysisTable tbody');
    if (!tbody) return;
    
    tbody.innerHTML = minutesAnalysisData.map(item => `
        <tr>
            <td>${item.date}</td>
            <td class="font-medium text-gray-900">${item.unit}</td>
            <td>${item.topic}</td>
            <td>${item.content}</td>
            <td>${item.duration}分钟</td>
            <td>
                <span class="${item.result === '正常' ? 'text-green-600' : 'text-yellow-600'}">
                    ${item.result}
                </span>
            </td>
            <td>
                <button class="action-btn action-btn-primary" onclick="viewMinutesDetail('${item.recordId}')">
                    <i class="fas fa-file-alt"></i> 查看纪要
                </button>
            </td>
        </tr>
    `).join('');
}

// ==================== 详情函数 ====================

// 查看单位详情
function viewUnitDetail(unitId) {
    const unit = abnormalUnitsData.find(u => u.unitId === unitId);
    if (!unit) {
        Toast.error('未找到单位信息');
        return;
    }
    
    // 构建风险等级徽章
    let riskBadge = '';
    if (unit.risk === 'high') {
        riskBadge = '<span class="badge badge-danger">高风险</span>';
    } else if (unit.risk === 'medium') {
        riskBadge = '<span class="badge badge-warning">中风险</span>';
    } else {
        riskBadge = '<span class="badge badge-info">低风险</span>';
    }
    
    // 构建缺失议题列表
    const missingTopicsHtml = `
        <div style="background: #FEF2F2; padding: 16px; border-radius: 8px; border-left: 4px solid #DC2626; margin-top: 16px;">
            <h4 style="margin: 0 0 12px 0; color: #991B1B; font-size: 15px; font-weight: 600;">
                <i class="fas fa-exclamation-triangle"></i> 缺失的学习议题
            </h4>
            <ul style="margin: 0; padding-left: 20px; color: #991B1B; font-size: 14px; line-height: 2;">
                ${unit.missingTopics.map(topic => `<li><strong>${topic}</strong></li>`).join('')}
            </ul>
            <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid #FEE2E2;">
                <p style="margin: 0 0 8px 0; color: #991B1B; font-size: 13px;">
                    <strong>原因说明：</strong>${unit.reason}
                </p>
                <p style="margin: 0; color: #991B1B; font-size: 13px;">
                    <strong>整改计划：</strong>${unit.plan}
                </p>
            </div>
        </div>
    `;
    
    showDetailModal('异常单位详情', unit.unit, {
        '单位信息': {
            '单位名称': unit.unit,
            '责任人': `${unit.responsible}（${unit.responsibleTitle}）`,
            '联系电话': unit.phone,
            '最后学习日期': unit.lastStudyDate
        },
        '学习情况': {
            '本月实际学习次数': `${unit.actualCount}次`,
            '本月要求学习次数': `${unit.requiredCount}次`,
            '缺失次数': `<span style="color: #DC2626; font-weight: 600;">${unit.missing}次</span>`,
            '风险等级': riskBadge
        },
        '缺失议题与整改': missingTopicsHtml
    });
}

// 查看会议纪要详情
function viewMinutesDetail(recordId) {
    const record = minutesAnalysisData.find(r => r.recordId === recordId);
    if (!record) {
        Toast.error('未找到会议纪要');
        return;
    }
    
    // 构建参会人员列表
    const participantsHtml = `
        <div style="margin-top: 8px;">
            <p style="margin: 8px 0; color: #374151; font-size: 14px;">
                <strong>参会人员：</strong>
            </p>
            <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px;">
                ${record.participants.map(p => `<span style="background: #EFF6FF; color: #1E40AF; padding: 4px 12px; border-radius: 12px; font-size: 13px;">${p}</span>`).join('')}
            </div>
        </div>
    `;
    
    // 构建会议要点
    const keyPointsHtml = `
        <div style="margin-top: 8px;">
            <p style="margin: 8px 0; color: #374151; font-size: 14px;">
                <strong>会议要点：</strong>
            </p>
            <ul style="margin: 0; padding-left: 20px; color: #374151; font-size: 13px; line-height: 1.8;">
                ${record.keyPoints.map(point => `<li>${point}</li>`).join('')}
            </ul>
        </div>
    `;
    
    // 构建学习材料
    const materialsHtml = `
        <div style="margin-top: 8px;">
            <p style="margin: 8px 0; color: #374151; font-size: 14px;">
                <strong>学习材料：</strong>
            </p>
            <ul style="margin: 0; padding-left: 20px; color: #059669; font-size: 13px; line-height: 1.8; font-weight: 600;">
                ${record.studyMaterials.map(material => `<li>${material}</li>`).join('')}
            </ul>
        </div>
    `;
    
    // 构建问题清单（如有）
    let issuesHtml = '';
    if (record.issues && record.issues.length > 0) {
        issuesHtml = `
            <div style="background: #FEF2F2; padding: 16px; border-radius: 8px; border-left: 4px solid #DC2626; margin-top: 16px;">
                <h4 style="margin: 0 0 12px 0; color: #991B1B; font-size: 15px; font-weight: 600;">
                    <i class="fas fa-exclamation-triangle"></i> 发现的问题
                </h4>
                <ul style="margin: 0; padding-left: 20px; color: #991B1B; font-size: 14px; line-height: 2;">
                    ${record.issues.map(issue => `<li><strong>${issue}</strong></li>`).join('')}
                </ul>
            </div>
        `;
    }
    
    showDetailModal('会议纪要详情', `${record.unit} - ${record.topic}`, {
        '会议信息': {
            '会议日期': record.date,
            '单位名称': record.unit,
            '会议主题': record.topic,
            '学习内容': record.content,
            '学习时长': `${record.duration}分钟`,
            '分析结果': `<span class="${record.result === '正常' ? 'text-green-600' : 'text-yellow-600'}">${record.result}</span>`
        },
        '参会情况': participantsHtml,
        '会议要点': keyPointsHtml,
        '学习材料': materialsHtml,
        '讨论情况': record.discussion,
        '下一步工作': record.nextStep,
        '问题清单': issuesHtml || '<p style="color: #059669; margin-top: 16px;"><i class="fas fa-check-circle"></i> 未发现问题</p>'
    });
}

// 发送提醒
function sendReminder(unitId) {
    const unit = abnormalUnitsData.find(u => u.unitId === unitId);
    if (!unit) {
        Toast.error('未找到单位信息');
        return;
    }
    
    // 这里可以实现实际的提醒功能
    Toast.success(`已向${unit.unit}（${unit.responsible}）发送学习提醒`);
}



// 重大决策数据
const majorDecisionData = [
    {
        name: '新校区建设项目立项',
        unit: '校办',
        type: '重大项目',
        date: '2025-10-15',
        participants: 15,
        status: 'complete',
        risk: 'low',
        host: '党委书记',
        recorder: '办公室主任',
        duration: '2小时',
        research: true,
        expert: true,
        riskAssess: true,
        collective: true,
        content: '经党委常委会研究决定，同意启动新校区建设项目立项工作。项目总投资约5亿元，建设周期3年，包括教学楼、实验楼、图书馆等设施。要求严格按照程序推进，确保项目质量和资金安全。',
        opinion: '与会委员一致同意该项目立项，要求：\n1. 严格执行招投标程序\n2. 加强项目资金监管\n3. 定期报告项目进展\n4. 确保工程质量安全',
        issues: []
    },
    {
        name: '科研经费管理办法修订',
        unit: '科研处',
        type: '制度修订',
        date: '2025-10-18',
        participants: 12,
        status: 'complete',
        risk: 'low',
        host: '分管副校长',
        recorder: '科研处处长',
        duration: '1.5小时',
        research: true,
        expert: true,
        riskAssess: true,
        collective: true,
        content: '为进一步规范科研经费管理，提高经费使用效益，根据国家最新政策要求，对《科研经费管理办法》进行修订。主要修订内容包括：简化报销流程、提高劳务费比例、加强间接费用管理等。',
        opinion: '与会人员一致通过修订方案，要求：\n1. 加强政策宣传培训\n2. 完善配套实施细则\n3. 做好新旧政策衔接\n4. 强化监督检查',
        issues: []
    },
    {
        name: '大型设备采购计划',
        unit: '资产处',
        type: '重大采购',
        date: '2025-10-20',
        participants: 8,
        status: 'incomplete',
        risk: 'medium',
        host: '资产处处长',
        recorder: '资产处副处长',
        duration: '1小时',
        research: true,
        expert: false,
        riskAssess: true,
        collective: true,
        content: '拟采购高性能计算机、电子显微镜等大型科研设备，总预算3500万元。设备将用于物理学院、化学学院等单位的科研工作。',
        opinion: '原则同意采购计划，但要求：\n1. 补充专家论证报告\n2. 完善设备共享方案\n3. 明确使用效益指标\n4. 加强采购程序监督',
        issues: ['缺少专家论证环节']
    },
    {
        name: '人才引进方案审批',
        unit: '人事处',
        type: '人事决策',
        date: '2025-10-21',
        participants: 10,
        status: 'complete',
        risk: 'low',
        host: '党委书记',
        recorder: '人事处处长',
        duration: '1.5小时',
        research: true,
        expert: true,
        riskAssess: true,
        collective: true,
        content: '拟引进高层次人才5名，包括长江学者1名、青年千人2名、优秀博士2名。总投入约2000万元（含安家费、科研启动费等）。',
        opinion: '同意引进方案，要求：\n1. 严格考察程序\n2. 明确考核指标\n3. 做好服务保障\n4. 加强跟踪管理',
        issues: []
    },
    {
        name: '学科建设经费分配',
        unit: '发展规划处',
        type: '资金分配',
        date: '2025-10-22',
        participants: 6,
        status: 'missing',
        risk: 'high',
        host: '发展规划处处长',
        recorder: '发展规划处副处长',
        duration: '0.5小时',
        research: false,
        expert: false,
        riskAssess: false,
        collective: false,
        content: '拟将本年度学科建设经费8000万元分配给各学院，其中重点学科5000万元，一般学科3000万元。',
        opinion: '会议讨论通过分配方案。',
        issues: ['未进行充分调查研究', '缺少专家论证', '未进行风险评估', '参与人数不足，不符合集体决策要求']
    },
    {
        name: '校园安全管理系统升级',
        unit: '保卫处',
        type: '信息化建设',
        date: '2025-10-16',
        participants: 9,
        status: 'complete',
        risk: 'low',
        host: '分管副校长',
        recorder: '保卫处处长',
        duration: '1小时',
        research: true,
        expert: true,
        riskAssess: true,
        collective: true,
        content: '对校园安全管理系统进行全面升级，包括视频监控系统、门禁系统、消防系统等，总投资1200万元。',
        opinion: '同意系统升级方案，要求：\n1. 确保数据安全\n2. 做好系统对接\n3. 加强人员培训\n4. 按期完成建设',
        issues: []
    },
    {
        name: '国际合作办学项目',
        unit: '国际交流处',
        type: '对外合作',
        date: '2025-10-17',
        participants: 13,
        status: 'complete',
        risk: 'low',
        host: '党委书记',
        recorder: '国际交流处处长',
        duration: '2小时',
        research: true,
        expert: true,
        riskAssess: true,
        collective: true,
        content: '拟与英国某大学合作开展"2+2"本科联合培养项目，涉及计算机、金融等专业，每年招生100人。',
        opinion: '同意开展合作项目，要求：\n1. 严格审核合作协议\n2. 确保教学质量\n3. 做好学生管理\n4. 加强风险防控',
        issues: []
    },
    {
        name: '教职工绩效工资改革',
        unit: '人事处',
        type: '薪酬改革',
        date: '2025-10-19',
        participants: 11,
        status: 'incomplete',
        risk: 'medium',
        host: '党委书记',
        recorder: '人事处处长',
        duration: '2.5小时',
        research: true,
        expert: true,
        riskAssess: false,
        collective: true,
        content: '对教职工绩效工资分配办法进行改革，加大向一线教师和优秀人才倾斜力度，优化分配结构。',
        opinion: '原则同意改革方案，但要求：\n1. 补充风险评估报告\n2. 广泛征求意见\n3. 做好政策解释\n4. 稳妥推进实施',
        issues: ['缺少风险评估环节']
    }
];

// 加载重大决策监督模块
function loadMajorDecisionModule() {
    // 更新统计卡片
    updateMajorDecisionStats();
    
    // 初始化决策程序合规性分析图表
    initDecisionComplianceChart();

    // 加载决策事项列表
    const tbody = document.querySelector('#major-decision-content table tbody');
    if (!tbody) return;

    tbody.innerHTML = majorDecisionData.map(item => {
        let statusBadge = '';
        let statusColor = '';

        if (item.status === 'complete') {
            statusBadge = '<span class="badge badge-success">程序完整</span>';
            statusColor = 'success';
        } else if (item.status === 'incomplete') {
            statusBadge = '<span class="badge badge-warning">程序待完善</span>';
            statusColor = 'warning';
        } else if (item.status === 'missing') {
            statusBadge = '<span class="badge badge-danger">程序缺失</span>';
            statusColor = 'danger';
        }

        let riskBadge = '';
        if (item.risk === 'low') {
            riskBadge = '<span class="badge badge-info">低风险</span>';
        } else if (item.risk === 'medium') {
            riskBadge = '<span class="badge badge-warning">中风险</span>';
        } else if (item.risk === 'high') {
            riskBadge = '<span class="badge badge-danger">高风险</span>';
        }

        return `
            <tr>
                <td>${item.name}</td>
                <td>${item.unit}</td>
                <td>${item.type}</td>
                <td>${item.date}</td>
                <td>${item.participants}人</td>
                <td>${statusBadge}</td>
                <td>${riskBadge}</td>
                <td>
                    <button class="btn-link" onclick="viewMajorDecisionDetail('${item.name}')">查看详情</button>
                </td>
            </tr>
        `;
    }).join('');
}

// 更新重大决策统计数据
function updateMajorDecisionStats() {
    const total = majorDecisionData.length;
    const completeCount = majorDecisionData.filter(d => d.status === 'complete').length;
    const complianceRate = ((completeCount / total) * 100).toFixed(1);

    // 计算待审批事项（这里假设是未来日期的事项）
    const today = new Date();
    const pendingCount = majorDecisionData.filter(d => {
        const decisionDate = new Date(d.date);
        return decisionDate > today;
    }).length || 5; // 默认5个

    // 计算异常预警（中高风险且程序不完整的）
    const warningCount = majorDecisionData.filter(d =>
        (d.risk === 'medium' || d.risk === 'high') && d.status !== 'complete'
    ).length;

    // 更新统计卡片
    const statCards = document.querySelectorAll('#major-decision-content .stat-card');
    if (statCards.length >= 4) {
        // 本月决策事项
        statCards[0].querySelector('.stat-card-value').textContent = total;

        // 程序合规率
        statCards[1].querySelector('.stat-card-value').textContent = complianceRate + '%';

        // 待审批事项
        statCards[2].querySelector('.stat-card-value').textContent = pendingCount;

        // 异常预警
        statCards[3].querySelector('.stat-card-value').textContent = warningCount;
        if (warningCount > 0) {
            statCards[3].querySelector('.stat-card-value').classList.add('warning');
        }
    }
}

// 初始化决策程序合规性分析图表
function initDecisionComplianceChart() {
    const chartDom = document.getElementById('decisionComplianceChart');
    if (!chartDom) return;
    
    const myChart = echarts.init(chartDom);
    
    // 统计各个程序环节的完成情况
    const total = majorDecisionData.length;
    const researchCount = majorDecisionData.filter(d => d.research).length;
    const expertCount = majorDecisionData.filter(d => d.expert).length;
    const riskAssessCount = majorDecisionData.filter(d => d.riskAssess).length;
    const collectiveCount = majorDecisionData.filter(d => d.collective).length;
    
    const option = {
        title: {
            text: '决策程序各环节完成率',
            left: 'center',
            top: 10,
            textStyle: {
                fontSize: 16,
                fontWeight: 600,
                color: '#111827'
            }
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            },
            formatter: function(params) {
                const data = params[0];
                return `${data.name}<br/>完成率: ${data.value}%<br/>完成数: ${Math.round(data.value * total / 100)}/${total}`;
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            top: 60,
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: ['调查研究', '专家论证', '风险评估', '集体决策'],
            axisLabel: {
                fontSize: 13,
                color: '#6B7280'
            },
            axisLine: {
                lineStyle: {
                    color: '#E5E7EB'
                }
            }
        },
        yAxis: {
            type: 'value',
            name: '完成率(%)',
            max: 100,
            axisLabel: {
                formatter: '{value}%',
                fontSize: 12,
                color: '#6B7280'
            },
            splitLine: {
                lineStyle: {
                    color: '#F3F4F6'
                }
            }
        },
        series: [
            {
                name: '完成率',
                type: 'bar',
                data: [
                    {
                        value: ((researchCount / total) * 100).toFixed(1),
                        itemStyle: {
                            color: researchCount === total ? '#10B981' : researchCount / total >= 0.8 ? '#F59E0B' : '#EF4444'
                        }
                    },
                    {
                        value: ((expertCount / total) * 100).toFixed(1),
                        itemStyle: {
                            color: expertCount === total ? '#10B981' : expertCount / total >= 0.8 ? '#F59E0B' : '#EF4444'
                        }
                    },
                    {
                        value: ((riskAssessCount / total) * 100).toFixed(1),
                        itemStyle: {
                            color: riskAssessCount === total ? '#10B981' : riskAssessCount / total >= 0.8 ? '#F59E0B' : '#EF4444'
                        }
                    },
                    {
                        value: ((collectiveCount / total) * 100).toFixed(1),
                        itemStyle: {
                            color: collectiveCount === total ? '#10B981' : collectiveCount / total >= 0.8 ? '#F59E0B' : '#EF4444'
                        }
                    }
                ],
                barWidth: '50%',
                label: {
                    show: true,
                    position: 'top',
                    formatter: '{c}%',
                    fontSize: 12,
                    fontWeight: 600
                }
            }
        ]
    };
    
    myChart.setOption(option);
    
    // 响应式调整
    window.addEventListener('resize', function() {
        myChart.resize();
    });
}

// 查看重大决策详情
function viewMajorDecisionDetail(decisionName) {
    const decision = majorDecisionData.find(d => d.name === decisionName);
    if (!decision) return;

    // 构建程序检查项
    const checkItems = [
        { name: '调查研究', completed: decision.research },
        { name: '专家论证', completed: decision.expert },
        { name: '风险评估', completed: decision.riskAssess },
        { name: '集体决策', completed: decision.collective }
    ];

    const checkHtml = checkItems.map(item => {
        if (item.completed) {
            return `<div style="margin-bottom: 8px;"><i class="fas fa-check-circle" style="color: #10B981;"></i> <strong>${item.name}</strong>：已完成</div>`;
        } else {
            return `<div style="margin-bottom: 8px;"><i class="fas fa-times-circle" style="color: #DC2626;"></i> <strong>${item.name}</strong>：<span style="color: #DC2626; font-weight: 600;">未完成</span></div>`;
        }
    }).join('');

    // 状态徽章
    let statusBadge = '';
    if (decision.status === 'complete') {
        statusBadge = '<span class="badge badge-success">程序完整</span>';
    } else if (decision.status === 'incomplete') {
        statusBadge = '<span class="badge badge-warning">程序待完善</span>';
    } else if (decision.status === 'missing') {
        statusBadge = '<span class="badge badge-danger">程序缺失</span>';
    }

    let riskBadge = '';
    if (decision.risk === 'low') {
        riskBadge = '<span class="badge badge-info">低风险</span>';
    } else if (decision.risk === 'medium') {
        riskBadge = '<span class="badge badge-warning">中风险</span>';
    } else if (decision.risk === 'high') {
        riskBadge = '<span class="badge badge-danger">高风险</span>';
    }

    // 构建详情对象
    const detailSections = {
        '决策信息': {
            '决策事项': decision.name,
            '决策单位': decision.unit,
            '决策类型': decision.type,
            '决策时间': decision.date
        },
        '参与情况': {
            '参与人数': `${decision.participants}人`,
            '主持人': decision.host,
            '记录人': decision.recorder,
            '会议时长': decision.duration
        },
        '程序检查': {
            '检查结果': checkHtml,
            '程序状态': statusBadge,
            '风险等级': riskBadge
        },
        '决策内容': decision.content,
        '审批意见': decision.opinion.replace(/\n/g, '<br>')
    };

    // 如果有问题，添加问题清单
    if (decision.issues && decision.issues.length > 0) {
        const issuesHtml = `
            <div style="background: #FEF2F2; padding: 16px; border-radius: 8px; border-left: 4px solid #DC2626;">
                <h4 style="margin: 0 0 12px 0; color: #991B1B; font-size: 15px; font-weight: 600;">
                    <i class="fas fa-exclamation-triangle"></i> 发现的问题
                </h4>
                <ul style="margin: 0; padding-left: 20px; color: #991B1B; font-size: 14px; line-height: 2;">
                    ${decision.issues.map(issue => `<li><strong>${issue}</strong></li>`).join('')}
                </ul>
            </div>
        `;
        detailSections['问题清单'] = issuesHtml;
    } else {
        detailSections['合规性评价'] = '<div style="background: #F0FDF4; padding: 16px; border-radius: 8px; border-left: 4px solid #10B981; color: #166534; font-size: 14px;"><i class="fas fa-check-circle" style="color: #10B981; margin-right: 8px;"></i><strong>该决策事项程序完整，符合规范要求。</strong></div>';
    }

    showDetailModal('重大决策详情', decisionName, detailSections);
}

// 低分高录检测数据
const lowScoreEnrollmentData = [
    {
        name: '张**',
        fullName: '张某某',
        examNo: '2025****001',
        major: '计算机科学与技术',
        college: '计算机学院',
        score: 580,
        minScore: 595,
        diff: -15,
        risk: 'high',
        gender: '男',
        province: '江苏省',
        category: '普通类',
        admissionType: '普通批次',
        hasApproval: false,
        approvalReason: '',
        reviewStatus: '待核查',
        issues: [
            '录取分数低于专业最低分数线15分',
            '未发现特殊类型招生审批材料',
            '不符合降分录取政策条件'
        ]
    },
    {
        name: '李**',
        fullName: '李某某',
        examNo: '2025****002',
        major: '软件工程',
        college: '计算机学院',
        score: 572,
        minScore: 585,
        diff: -13,
        risk: 'high',
        gender: '女',
        province: '浙江省',
        category: '普通类',
        admissionType: '普通批次',
        hasApproval: false,
        approvalReason: '',
        reviewStatus: '待核查',
        issues: [
            '录取分数低于专业最低分数线13分',
            '未发现特殊类型招生审批材料',
            '录取时间在正常批次之后'
        ]
    },
    {
        name: '王**',
        fullName: '王某某',
        examNo: '2025****003',
        major: '电子信息工程',
        college: '电子工程学院',
        score: 565,
        minScore: 572,
        diff: -7,
        risk: 'medium',
        gender: '男',
        province: '安徽省',
        category: '普通类',
        admissionType: '普通批次',
        hasApproval: true,
        approvalReason: '少数民族预科转入',
        reviewStatus: '审核中',
        issues: [
            '录取分数低于专业最低分数线7分',
            '审批材料需进一步核实'
        ]
    },
    {
        name: '赵**',
        fullName: '赵某某',
        examNo: '2025****004',
        major: '自动化',
        college: '自动化学院',
        score: 558,
        minScore: 563,
        diff: -5,
        risk: 'medium',
        gender: '女',
        province: '山东省',
        category: '普通类',
        admissionType: '普通批次',
        hasApproval: true,
        approvalReason: '农村专项计划',
        reviewStatus: '审核中',
        issues: [
            '录取分数低于专业最低分数线5分',
            '需核实农村专项计划资格'
        ]
    },
    {
        name: '孙**',
        fullName: '孙某某',
        examNo: '2025****005',
        major: '人工智能',
        college: '计算机学院',
        score: 612,
        minScore: 628,
        diff: -16,
        risk: 'high',
        gender: '男',
        province: '北京市',
        category: '普通类',
        admissionType: '普通批次',
        hasApproval: false,
        approvalReason: '',
        reviewStatus: '待核查',
        issues: [
            '录取分数低于专业最低分数线16分',
            '未发现特殊类型招生审批材料',
            '该考生为本校教职工子女但未申报'
        ]
    },
    {
        name: '周**',
        fullName: '周某某',
        examNo: '2025****006',
        major: '数据科学与大数据技术',
        college: '计算机学院',
        score: 598,
        minScore: 610,
        diff: -12,
        risk: 'high',
        gender: '女',
        province: '上海市',
        category: '普通类',
        admissionType: '普通批次',
        hasApproval: false,
        approvalReason: '',
        reviewStatus: '待核查',
        issues: [
            '录取分数低于专业最低分数线12分',
            '录取操作时间为非工作时间',
            '未发现特殊类型招生审批材料'
        ]
    }
];

// 加载招生录取监督模块
function loadEnrollmentModule() {
    loadLowScoreDetection();
    loadOperationLogMonitoring();
    loadRelativeComparison();
}

// 加载低分高录检测
function loadLowScoreDetection() {
    const tbody = document.querySelector('#lowScoreTable tbody');
    if (!tbody) return;

    tbody.innerHTML = lowScoreEnrollmentData.map(item => `
        <tr>
            <td class="font-medium text-gray-900">${item.name}</td>
            <td>${item.examNo}</td>
            <td>${item.major}</td>
            <td>${item.score}</td>
            <td>${item.minScore}</td>
            <td class="text-red-600 font-medium">${item.diff}</td>
            <td>
                <span class="risk-badge ${item.risk}">
                    ${item.risk === 'high' ? '高风险' : item.risk === 'medium' ? '中风险' : '低风险'}
                </span>
            </td>
            <td>
                <button class="action-btn action-btn-primary" onclick="viewEnrollmentDetail('${item.examNo}')">
                    <i class="fas fa-search"></i> 核查
                </button>
            </td>
        </tr>
    `).join('');
}

// 操作日志异常监控数据
const operationLogData = [
    {
        time: '2025-10-20 23:45:32',
        operator: '招生办-张三',
        operatorId: 'ZS001',
        type: '修改录取信息',
        target: '考生2025****005',
        targetExamNo: '2025****005',
        reason: '非工作时间操作',
        risk: 'high',
        ip: '192.168.1.105',
        device: 'Windows PC',
        beforeValue: '未录取',
        afterValue: '已录取-计算机科学与技术',
        issues: [
            '操作时间为23:45，属于非工作时间',
            '该操作未见审批流程',
            '修改后该考生分数低于专业最低分数线'
        ]
    },
    {
        time: '2025-10-19 22:15:18',
        operator: '招生办-李四',
        operatorId: 'LS002',
        type: '查询考生信息',
        target: '批量查询500条',
        targetExamNo: '',
        reason: '批量查询异常',
        risk: 'medium',
        ip: '192.168.1.108',
        device: 'Windows PC',
        beforeValue: '',
        afterValue: '',
        issues: [
            '单次查询500条考生信息，超过正常查询量',
            '查询时间为22:15，属于非工作时间',
            '查询内容包含敏感个人信息'
        ]
    },
    {
        time: '2025-10-18 14:30:22',
        operator: '招生办-王五',
        operatorId: 'WW003',
        type: '修改专业志愿',
        target: '考生2025****008',
        targetExamNo: '2025****008',
        reason: '录取后修改志愿',
        risk: 'high',
        ip: '192.168.1.112',
        device: 'Windows PC',
        beforeValue: '第一志愿：电子信息工程',
        afterValue: '第一志愿：计算机科学与技术',
        issues: [
            '该考生已被电子信息工程专业录取',
            '录取后修改志愿违反招生规定',
            '修改操作未见审批流程'
        ]
    },
    {
        time: '2025-10-17 20:05:45',
        operator: '招生办-赵六',
        operatorId: 'ZL004',
        type: '导出考生数据',
        target: '全部考生信息',
        targetExamNo: '',
        reason: '非工作时间导出',
        risk: 'medium',
        ip: '192.168.1.115',
        device: 'Windows PC',
        beforeValue: '',
        afterValue: '',
        issues: [
            '导出时间为20:05，属于非工作时间',
            '导出全部考生信息，数据量较大',
            '导出操作未见审批记录'
        ]
    },
    {
        time: '2025-10-16 23:30:15',
        operator: '招生办-张三',
        operatorId: 'ZS001',
        type: '修改录取状态',
        target: '考生2025****006',
        targetExamNo: '2025****006',
        reason: '非工作时间操作',
        risk: 'high',
        ip: '192.168.1.105',
        device: 'Windows PC',
        beforeValue: '待录取',
        afterValue: '已录取-数据科学与大数据技术',
        issues: [
            '操作时间为23:30，属于深夜时段',
            '该操作员当天已有多次非工作时间操作',
            '修改后该考生分数低于专业最低分数线'
        ]
    }
];

// 加载操作日志异常监控
function loadOperationLogMonitoring() {
    const tbody = document.querySelector('#operationLogTable tbody');
    if (!tbody) return;

    tbody.innerHTML = operationLogData.map(item => `
        <tr>
            <td>${item.time}</td>
            <td class="font-medium text-gray-900">${item.operator}</td>
            <td>${item.type}</td>
            <td>${item.target}</td>
            <td class="text-red-600">${item.reason}</td>
            <td>
                <span class="risk-badge ${item.risk}">
                    ${item.risk === 'high' ? '高风险' : item.risk === 'medium' ? '中风险' : '低风险'}
                </span>
            </td>
            <td>
                <button class="action-btn action-btn-primary" onclick="viewLogDetail('${item.time}', '${item.operatorId}')">
                    <i class="fas fa-eye"></i> 查看
                </button>
            </td>
        </tr>
    `).join('');
}

// 教职工亲属关联比对数据
const relativeComparisonData = [
    {
        name: '孙**',
        fullName: '孙某某（考生）',
        examNo: '2025****010',
        major: '经济学',
        college: '经济管理学院',
        score: 592,
        minScore: 588,
        staff: '孙某某',
        staffId: 'T2015001',
        relation: '子女',
        dept: '经济管理学院',
        position: '教授',
        declared: false,
        risk: 'high',
        issues: [
            '考生为本校教职工子女但未按规定申报',
            '录取专业与教职工所在学院相同',
            '存在利益关联风险'
        ]
    },
    {
        name: '周**',
        fullName: '周某某（考生）',
        examNo: '2025****011',
        major: '英语',
        college: '外国语学院',
        score: 578,
        minScore: 572,
        staff: '周某某',
        staffId: 'T2018005',
        relation: '子女',
        dept: '外国语学院',
        position: '副教授',
        declared: true,
        risk: 'low',
        issues: []
    },
    {
        name: '吴**',
        fullName: '吴某某（考生）',
        examNo: '2025****012',
        major: '机械设计',
        college: '机械工程学院',
        score: 585,
        minScore: 580,
        staff: '吴某某',
        staffId: 'T2012008',
        relation: '侄子',
        dept: '机械工程学院',
        position: '教授',
        declared: false,
        risk: 'medium',
        issues: [
            '考生为本校教职工侄子但未申报',
            '录取专业与教职工所在学院相同'
        ]
    },
    {
        name: '郑**',
        fullName: '郑某某（考生）',
        examNo: '2025****013',
        major: '化学工程',
        college: '化学化工学院',
        score: 595,
        minScore: 590,
        staff: '郑某某',
        staffId: 'T2016012',
        relation: '子女',
        dept: '化学化工学院',
        position: '讲师',
        declared: true,
        risk: 'low',
        issues: []
    },
    {
        name: '孙**',
        fullName: '孙某某（考生-重复）',
        examNo: '2025****005',
        major: '人工智能',
        college: '计算机学院',
        score: 612,
        minScore: 628,
        staff: '孙建国',
        staffId: 'T2010003',
        relation: '子女',
        dept: '计算机学院',
        position: '教授',
        declared: false,
        risk: 'high',
        issues: [
            '考生为本校教职工子女但未申报',
            '录取分数低于专业最低分数线16分',
            '录取专业与教职工所在学院相同',
            '存在严重利益关联风险'
        ]
    },
    {
        name: '钱**',
        fullName: '钱某某（考生）',
        examNo: '2025****014',
        major: '法学',
        college: '法学院',
        score: 582,
        minScore: 578,
        staff: '钱某某',
        staffId: 'T2019007',
        relation: '子女',
        dept: '法学院',
        position: '副教授',
        declared: true,
        risk: 'low',
        issues: []
    }
];

// 加载教职工亲属关联比对
function loadRelativeComparison() {
    const tbody = document.querySelector('#relativeTable tbody');
    if (!tbody) return;

    tbody.innerHTML = relativeComparisonData.map(item => `
        <tr>
            <td class="font-medium text-gray-900">${item.name}</td>
            <td>${item.examNo}</td>
            <td>${item.major}</td>
            <td>${item.staff}</td>
            <td>${item.relation}</td>
            <td>${item.dept}</td>
            <td>
                <span class="${item.declared ? 'text-green-600' : 'text-red-600'}">
                    ${item.declared ? '已申报' : '未申报'}
                </span>
            </td>
            <td>
                <button class="action-btn action-btn-primary" onclick="viewRelativeDetail('${item.examNo}')">
                    <i class="fas fa-search"></i> 核查
                </button>
            </td>
        </tr>
    `).join('');
}

// 查看招生详情
function viewEnrollmentDetail(examNo) {
    const student = lowScoreEnrollmentData.find(s => s.examNo === examNo);
    if (!student) {
        Toast.error('未找到考生信息');
        return;
    }

    // 构建风险等级徽章
    let riskBadge = '';
    if (student.risk === 'high') {
        riskBadge = '<span class="badge badge-danger">高风险</span>';
    } else if (student.risk === 'medium') {
        riskBadge = '<span class="badge badge-warning">中风险</span>';
    } else {
        riskBadge = '<span class="badge badge-info">低风险</span>';
    }

    // 构建审批状态
    let approvalHtml = '';
    if (student.hasApproval) {
        approvalHtml = `
            <div style="background: #FEF3C7; padding: 16px; border-radius: 8px; border-left: 4px solid #F59E0B; margin-top: 16px;">
                <h4 style="margin: 0 0 8px 0; color: #92400E; font-size: 14px; font-weight: 600;">
                    <i class="fas fa-info-circle"></i> 特殊类型招生说明
                </h4>
                <p style="margin: 0; color: #92400E; font-size: 13px;">
                    <strong>审批原因：</strong>${student.approvalReason}
                </p>
            </div>
        `;
    }

    // 构建问题清单
    let issuesHtml = '';
    if (student.issues && student.issues.length > 0) {
        issuesHtml = `
            <div style="background: #FEF2F2; padding: 16px; border-radius: 8px; border-left: 4px solid #DC2626; margin-top: 16px;">
                <h4 style="margin: 0 0 12px 0; color: #991B1B; font-size: 15px; font-weight: 600;">
                    <i class="fas fa-exclamation-triangle"></i> 发现的问题
                </h4>
                <ul style="margin: 0; padding-left: 20px; color: #991B1B; font-size: 14px; line-height: 2;">
                    ${student.issues.map(issue => `<li><strong>${issue}</strong></li>`).join('')}
                </ul>
            </div>
        `;
    }

    showDetailModal('考生录取详情', student.fullName, {
        '考生基本信息': {
            '考生号': student.examNo,
            '姓名': student.name,
            '性别': student.gender,
            '生源地': student.province,
            '考生类别': student.category
        },
        '录取信息': {
            '录取学院': student.college,
            '录取专业': student.major,
            '录取类型': student.admissionType,
            '高考分数': `<span style="color: #DC2626; font-weight: 600;">${student.score}分</span>`,
            '专业最低分': `${student.minScore}分`,
            '分差': `<span style="color: #DC2626; font-weight: 600;">${student.diff}分</span>`
        },
        '风险分析': {
            '风险等级': riskBadge,
            '审核状态': student.reviewStatus,
            '是否有审批': student.hasApproval ? '<span style="color: #059669;">是</span>' : '<span style="color: #DC2626;">否</span>'
        },
        '审批说明': approvalHtml,
        '问题清单': issuesHtml
    });
}

// 查看日志详情
function viewLogDetail(time, operatorId) {
    const log = operationLogData.find(l => l.time === time && l.operatorId === operatorId);
    if (!log) {
        Toast.error('未找到日志信息');
        return;
    }

    // 构建风险等级徽章
    let riskBadge = '';
    if (log.risk === 'high') {
        riskBadge = '<span class="badge badge-danger">高风险</span>';
    } else if (log.risk === 'medium') {
        riskBadge = '<span class="badge badge-warning">中风险</span>';
    } else {
        riskBadge = '<span class="badge badge-info">低风险</span>';
    }

    // 构建修改内容
    let changeHtml = '';
    if (log.beforeValue && log.afterValue) {
        changeHtml = `
            <div style="background: #F3F4F6; padding: 12px; border-radius: 6px; margin-top: 8px;">
                <p style="margin: 0 0 8px 0; color: #6B7280; font-size: 13px;">
                    <strong>修改前：</strong>${log.beforeValue}
                </p>
                <p style="margin: 0; color: #111827; font-size: 13px;">
                    <strong>修改后：</strong><span style="color: #DC2626; font-weight: 600;">${log.afterValue}</span>
                </p>
            </div>
        `;
    }

    // 构建问题清单
    let issuesHtml = '';
    if (log.issues && log.issues.length > 0) {
        issuesHtml = `
            <div style="background: #FEF2F2; padding: 16px; border-radius: 8px; border-left: 4px solid #DC2626; margin-top: 16px;">
                <h4 style="margin: 0 0 12px 0; color: #991B1B; font-size: 15px; font-weight: 600;">
                    <i class="fas fa-exclamation-triangle"></i> 异常分析
                </h4>
                <ul style="margin: 0; padding-left: 20px; color: #991B1B; font-size: 14px; line-height: 2;">
                    ${log.issues.map(issue => `<li><strong>${issue}</strong></li>`).join('')}
                </ul>
            </div>
        `;
    }

    showDetailModal('操作日志详情', log.operator, {
        '操作基本信息': {
            '操作时间': `<span style="color: #DC2626; font-weight: 600;">${log.time}</span>`,
            '操作人': log.operator,
            '操作人ID': log.operatorId,
            '操作类型': log.type,
            'IP地址': log.ip,
            '设备信息': log.device
        },
        '操作详情': {
            '操作对象': log.target,
            '异常原因': `<span style="color: #DC2626; font-weight: 600;">${log.reason}</span>`,
            '风险等级': riskBadge
        },
        '修改内容': changeHtml,
        '异常分析': issuesHtml
    });
}

// 查看亲属关联详情
function viewRelativeDetail(examNo) {
    const relative = relativeComparisonData.find(r => r.examNo === examNo);
    if (!relative) {
        Toast.error('未找到关联信息');
        return;
    }

    // 构建风险等级徽章
    let riskBadge = '';
    if (relative.risk === 'high') {
        riskBadge = '<span class="badge badge-danger">高风险</span>';
    } else if (relative.risk === 'medium') {
        riskBadge = '<span class="badge badge-warning">中风险</span>';
    } else {
        riskBadge = '<span class="badge badge-info">低风险</span>';
    }

    // 构建申报状态
    let declaredStatus = '';
    if (relative.declared) {
        declaredStatus = '<span style="color: #059669; font-weight: 600;"><i class="fas fa-check-circle"></i> 已申报</span>';
    } else {
        declaredStatus = '<span style="color: #DC2626; font-weight: 600;"><i class="fas fa-times-circle"></i> 未申报</span>';
    }

    // 构建分数对比
    const scoreDiff = relative.score - relative.minScore;
    let scoreCompare = '';
    if (scoreDiff >= 0) {
        scoreCompare = `<span style="color: #059669;">高于最低分 ${scoreDiff} 分</span>`;
    } else {
        scoreCompare = `<span style="color: #DC2626; font-weight: 600;">低于最低分 ${Math.abs(scoreDiff)} 分</span>`;
    }

    // 构建问题清单或合规评价
    let issuesHtml = '';
    if (relative.issues && relative.issues.length > 0) {
        issuesHtml = `
            <div style="background: #FEF2F2; padding: 16px; border-radius: 8px; border-left: 4px solid #DC2626; margin-top: 16px;">
                <h4 style="margin: 0 0 12px 0; color: #991B1B; font-size: 15px; font-weight: 600;">
                    <i class="fas fa-exclamation-triangle"></i> 发现的问题
                </h4>
                <ul style="margin: 0; padding-left: 20px; color: #991B1B; font-size: 14px; line-height: 2;">
                    ${relative.issues.map(issue => `<li><strong>${issue}</strong></li>`).join('')}
                </ul>
                <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid #FEE2E2;">
                    <p style="margin: 0; color: #991B1B; font-size: 13px;">
                        <strong>处理建议：</strong>需核查录取过程是否存在利益输送，是否符合回避制度要求
                    </p>
                </div>
            </div>
        `;
    } else {
        issuesHtml = `
            <div style="background: #F0FDF4; padding: 16px; border-radius: 8px; border-left: 4px solid #10B981; margin-top: 16px;">
                <p style="margin: 0; color: #166534; font-size: 14px;">
                    <i class="fas fa-check-circle" style="color: #10B981; margin-right: 8px;"></i>
                    <strong>该考生已按规定申报亲属关系，录取程序符合规范要求。</strong>
                </p>
            </div>
        `;
    }

    showDetailModal('教职工亲属关联详情', relative.fullName, {
        '考生信息': {
            '考生号': relative.examNo,
            '姓名': relative.name,
            '录取学院': relative.college,
            '录取专业': relative.major,
            '高考分数': `${relative.score}分`,
            '专业最低分': `${relative.minScore}分`,
            '分数对比': scoreCompare
        },
        '教职工信息': {
            '教职工姓名': relative.staff,
            '工号': relative.staffId,
            '所属部门': relative.dept,
            '职务': relative.position,
            '关系': `<span style="color: #DC2626; font-weight: 600;">${relative.relation}</span>`
        },
        '申报与风险': {
            '是否申报': declaredStatus,
            '风险等级': riskBadge,
            '利益关联': relative.college === relative.dept ? '<span style="color: #DC2626; font-weight: 600;">录取学院与教职工所在学院相同</span>' : '无直接利益关联'
        },
        '风险评估': issuesHtml
    });
}

// 连号发票识别数据
const serialInvoiceData = [
    {
        project: '人工智能算法研究',
        projectNo: '2025-KY-001',
        leader: '张教授',
        college: '计算机学院',
        totalBudget: 500000,
        invoiceRange: 'No.12345678-12345685',
        invoiceStart: '12345678',
        invoiceEnd: '12345685',
        count: 8,
        amount: 45600,
        date: '2025-10-15',
        vendor: '某某科技公司',
        vendorTaxNo: '91110000XXXXXXXX01',
        risk: 'high',
        issues: [
            '连续8张发票号码，存在虚假报销嫌疑',
            '发票开具时间集中在同一天',
            '该供应商近期多次出现连号发票',
            '发票金额较为平均，不符合正常采购规律'
        ]
    },
    {
        project: '大数据分析平台建设',
        projectNo: '2025-KY-002',
        leader: '李教授',
        college: '数据科学学院',
        totalBudget: 800000,
        invoiceRange: 'No.23456789-23456793',
        invoiceStart: '23456789',
        invoiceEnd: '23456793',
        count: 5,
        amount: 32000,
        date: '2025-10-12',
        vendor: '数据服务公司',
        vendorTaxNo: '91110000XXXXXXXX02',
        risk: 'medium',
        issues: [
            '连续5张发票号码',
            '需核实采购真实性'
        ]
    },
    {
        project: '物联网技术应用',
        projectNo: '2025-KY-003',
        leader: '王教授',
        college: '电子工程学院',
        totalBudget: 600000,
        invoiceRange: 'No.34567890-34567896',
        invoiceStart: '34567890',
        invoiceEnd: '34567896',
        count: 7,
        amount: 38500,
        date: '2025-10-10',
        vendor: '电子设备公司',
        vendorTaxNo: '91110000XXXXXXXX03',
        risk: 'high',
        issues: [
            '连续7张发票号码，风险较高',
            '该项目已多次出现连号发票',
            '需重点核查采购合同和验收记录'
        ]
    },
    {
        project: '区块链技术研究',
        projectNo: '2025-KY-004',
        leader: '赵教授',
        college: '计算机学院',
        totalBudget: 450000,
        invoiceRange: 'No.45678901-45678904',
        invoiceStart: '45678901',
        invoiceEnd: '45678904',
        count: 4,
        amount: 28000,
        date: '2025-10-08',
        vendor: '区块链技术公司',
        vendorTaxNo: '91110000XXXXXXXX04',
        risk: 'medium',
        issues: [
            '连续4张发票号码',
            '需核实采购真实性'
        ]
    },
    {
        project: '云计算平台建设',
        projectNo: '2025-KY-005',
        leader: '孙教授',
        college: '软件学院',
        totalBudget: 700000,
        invoiceRange: 'No.56789012-56789018',
        invoiceStart: '56789012',
        invoiceEnd: '56789018',
        count: 7,
        amount: 52000,
        date: '2025-10-05',
        vendor: '云服务公司',
        vendorTaxNo: '91110000XXXXXXXX05',
        risk: 'high',
        issues: [
            '连续7张发票号码',
            '发票金额总计超过5万元',
            '该供应商信用记录存疑',
            '需核查采购审批流程'
        ]
    }
];

// 加载科研经费监督模块
function loadResearchFundsModule() {
    loadSerialInvoiceDetection();
    loadBudgetDeviationAnalysis();
    loadDuplicateEquipmentWarning();
}

// 加载连号发票识别
function loadSerialInvoiceDetection() {
    const tbody = document.querySelector('#serialInvoiceTable tbody');
    if (!tbody) return;

    tbody.innerHTML = serialInvoiceData.map(item => `
        <tr>
            <td class="font-medium text-gray-900">${item.project}</td>
            <td>${item.leader}</td>
            <td>${item.invoiceRange}</td>
            <td>${item.count}</td>
            <td>¥${formatNumber(item.amount)}</td>
            <td>${item.date}</td>
            <td>
                <span class="risk-badge ${item.risk}">
                    ${item.risk === 'high' ? '高风险' : item.risk === 'medium' ? '中风险' : '低风险'}
                </span>
            </td>
            <td>
                <button class="action-btn action-btn-primary" onclick="viewInvoiceDetail('${item.projectNo}')">
                    <i class="fas fa-search"></i> 核查
                </button>
            </td>
        </tr>
    `).join('');
}

// 预算执行偏离度分析数据
const budgetDeviationData = [
    {
        project: '智能制造技术研究',
        projectNo: '2025-KY-006',
        leader: '孙教授',
        college: '机械工程学院',
        budget: 500000,
        executed: 125000,
        rate: 25,
        deviation: -50,
        risk: 'high',
        startDate: '2025-01-01',
        endDate: '2025-12-31',
        progress: 75,
        issues: [
            '项目进度已达75%，但预算执行率仅25%',
            '存在严重的预算执行偏离',
            '可能存在预算闲置或项目推进缓慢问题',
            '需核查项目实际进展情况'
        ],
        budgetBreakdown: {
            equipment: { budget: 200000, executed: 50000, rate: 25 },
            materials: { budget: 150000, executed: 30000, rate: 20 },
            labor: { budget: 100000, executed: 30000, rate: 30 },
            other: { budget: 50000, executed: 15000, rate: 30 }
        }
    },
    {
        project: '新能源材料开发',
        projectNo: '2025-KY-007',
        leader: '周教授',
        college: '材料科学学院',
        budget: 800000,
        executed: 680000,
        rate: 85,
        deviation: 15,
        risk: 'medium',
        startDate: '2025-01-01',
        endDate: '2025-12-31',
        progress: 70,
        issues: [
            '预算执行率85%，高于项目进度70%',
            '存在一定的预算执行偏离',
            '需关注后续预算使用情况'
        ],
        budgetBreakdown: {
            equipment: { budget: 300000, executed: 260000, rate: 87 },
            materials: { budget: 250000, executed: 210000, rate: 84 },
            labor: { budget: 150000, executed: 130000, rate: 87 },
            other: { budget: 100000, executed: 80000, rate: 80 }
        }
    },
    {
        project: '生物医药技术',
        projectNo: '2025-KY-008',
        leader: '吴教授',
        college: '生命科学学院',
        budget: 600000,
        executed: 150000,
        rate: 25,
        deviation: -50,
        risk: 'high',
        startDate: '2025-01-01',
        endDate: '2025-12-31',
        progress: 80,
        issues: [
            '项目进度已达80%，但预算执行率仅25%',
            '存在严重的预算执行偏离',
            '可能存在预算编制不合理或执行不力问题',
            '需重点核查项目实际支出情况'
        ],
        budgetBreakdown: {
            equipment: { budget: 250000, executed: 60000, rate: 24 },
            materials: { budget: 200000, executed: 50000, rate: 25 },
            labor: { budget: 100000, executed: 25000, rate: 25 },
            other: { budget: 50000, executed: 15000, rate: 30 }
        }
    },
    {
        project: '环境工程技术',
        projectNo: '2025-KY-009',
        leader: '郑教授',
        college: '环境学院',
        budget: 450000,
        executed: 405000,
        rate: 90,
        deviation: 20,
        risk: 'low',
        startDate: '2025-01-01',
        endDate: '2025-12-31',
        progress: 85,
        issues: [],
        budgetBreakdown: {
            equipment: { budget: 180000, executed: 165000, rate: 92 },
            materials: { budget: 150000, executed: 135000, rate: 90 },
            labor: { budget: 80000, executed: 70000, rate: 88 },
            other: { budget: 40000, executed: 35000, rate: 88 }
        }
    }
];

// 加载预算执行偏离度分析
function loadBudgetDeviationAnalysis() {
    const tbody = document.querySelector('#budgetDeviationTable tbody');
    if (!tbody) return;

    tbody.innerHTML = budgetDeviationData.map(item => `
        <tr>
            <td class="font-medium text-gray-900">${item.project}</td>
            <td>${item.leader}</td>
            <td>¥${formatNumber(item.budget)}</td>
            <td>¥${formatNumber(item.executed)}</td>
            <td>${item.rate}%</td>
            <td class="${item.deviation < -30 || item.deviation > 30 ? 'text-red-600' : 'text-yellow-600'} font-medium">
                ${item.deviation > 0 ? '+' : ''}${item.deviation}%
            </td>
            <td>
                <span class="risk-badge ${item.risk}">
                    ${item.risk === 'high' ? '高风险' : item.risk === 'medium' ? '中风险' : '低风险'}
                </span>
            </td>
            <td>
                <button class="action-btn action-btn-primary" onclick="viewBudgetDetail('${item.projectNo}')">
                    <i class="fas fa-chart-line"></i> 分析
                </button>
            </td>
        </tr>
    `).join('');
}

// 设备重复采购预警数据
const duplicateEquipmentData = [
    {
        equipment: '高性能服务器',
        model: 'Dell PowerEdge R740',
        project: '云计算平台建设',
        projectNo: '2025-KY-010',
        leader: '钱教授',
        college: '计算机学院',
        amount: 85000,
        quantity: 2,
        existing: 3,
        existingLocations: [
            { location: '计算机学院机房A', quantity: 1, purchaseDate: '2024-03-15', status: '在用' },
            { location: '计算机学院机房B', quantity: 1, purchaseDate: '2024-06-20', status: '在用' },
            { location: '数据中心', quantity: 1, purchaseDate: '2024-09-10', status: '闲置' }
        ],
        risk: 'high',
        utilizationRate: 65,
        issues: [
            '学校已有3台同型号设备',
            '其中1台处于闲置状态',
            '设备利用率仅65%',
            '建议优先盘活现有设备，避免重复采购'
        ]
    },
    {
        equipment: '激光打印机',
        model: 'HP LaserJet Pro M404dn',
        project: '办公设备采购',
        projectNo: '2025-KY-011',
        leader: '陈教授',
        college: '行政办公室',
        amount: 3500,
        quantity: 5,
        existing: 8,
        existingLocations: [
            { location: '行政楼201', quantity: 2, purchaseDate: '2023-05-10', status: '在用' },
            { location: '行政楼305', quantity: 2, purchaseDate: '2023-08-15', status: '在用' },
            { location: '行政楼408', quantity: 2, purchaseDate: '2024-01-20', status: '在用' },
            { location: '仓库', quantity: 2, purchaseDate: '2024-04-10', status: '闲置' }
        ],
        risk: 'medium',
        utilizationRate: 75,
        issues: [
            '学校已有8台同型号设备',
            '其中2台处于闲置状态',
            '建议先盘活闲置设备'
        ]
    },
    {
        equipment: '显微镜',
        model: 'Olympus BX53',
        project: '生物实验室建设',
        projectNo: '2025-KY-012',
        leader: '林教授',
        college: '生命科学学院',
        amount: 125000,
        quantity: 1,
        existing: 2,
        existingLocations: [
            { location: '生命科学学院实验室A', quantity: 1, purchaseDate: '2023-09-15', status: '在用' },
            { location: '生命科学学院实验室B', quantity: 1, purchaseDate: '2024-03-20', status: '在用' }
        ],
        risk: 'high',
        utilizationRate: 90,
        issues: [
            '学校已有2台同型号设备',
            '现有设备利用率较高（90%）',
            '但仍需评估是否可通过共享使用满足需求',
            '建议先进行需求论证'
        ]
    },
    {
        equipment: '示波器',
        model: 'Tektronix MSO54',
        project: '电子实验室升级',
        projectNo: '2025-KY-013',
        leader: '黄教授',
        college: '电子工程学院',
        amount: 68000,
        quantity: 2,
        existing: 4,
        existingLocations: [
            { location: '电子工程学院实验室1', quantity: 2, purchaseDate: '2023-11-10', status: '在用' },
            { location: '电子工程学院实验室2', quantity: 1, purchaseDate: '2024-05-15', status: '在用' },
            { location: '电子工程学院仓库', quantity: 1, purchaseDate: '2024-07-20', status: '闲置' }
        ],
        risk: 'medium',
        utilizationRate: 70,
        issues: [
            '学校已有4台同型号设备',
            '其中1台处于闲置状态',
            '建议优先使用闲置设备'
        ]
    }
];

// 加载设备重复采购预警
function loadDuplicateEquipmentWarning() {
    const tbody = document.querySelector('#duplicateEquipmentTable tbody');
    if (!tbody) return;

    tbody.innerHTML = duplicateEquipmentData.map(item => `
        <tr>
            <td class="font-medium text-gray-900">${item.equipment}</td>
            <td>${item.model}</td>
            <td>${item.project}</td>
            <td>${item.leader}</td>
            <td>¥${formatNumber(item.amount)}</td>
            <td class="text-yellow-600 font-medium">${item.existing}台</td>
            <td>
                <span class="risk-badge ${item.risk}">
                    ${item.risk === 'high' ? '高风险' : item.risk === 'medium' ? '中风险' : '低风险'}
                </span>
            </td>
            <td>
                <button class="action-btn action-btn-primary" onclick="viewEquipmentDetail('${item.projectNo}')">
                    <i class="fas fa-search"></i> 核查
                </button>
            </td>
        </tr>
    `).join('');
}

// 科研经费监督 - 查看发票详情
function viewInvoiceDetail(projectNo) {
    const invoice = serialInvoiceData.find(i => i.projectNo === projectNo);
    if (!invoice) {
        Toast.error('未找到发票信息');
        return;
    }

    // 构建风险等级徽章
    let riskBadge = '';
    if (invoice.risk === 'high') {
        riskBadge = '<span class="badge badge-danger">高风险</span>';
    } else if (invoice.risk === 'medium') {
        riskBadge = '<span class="badge badge-warning">中风险</span>';
    } else {
        riskBadge = '<span class="badge badge-info">低风险</span>';
    }

    // 生成发票明细表格
    const invoiceDetails = [];
    const avgAmount = (invoice.amount / invoice.count).toFixed(2);
    for (let i = 0; i < invoice.count; i++) {
        const invoiceNo = parseInt(invoice.invoiceStart) + i;
        invoiceDetails.push(`
            <tr>
                <td>No.${invoiceNo}</td>
                <td>¥${formatNumber(avgAmount)}</td>
                <td>办公用品/耗材</td>
                <td>${invoice.date}</td>
            </tr>
        `);
    }

    // 构建问题清单
    let issuesHtml = '';
    if (invoice.issues && invoice.issues.length > 0) {
        issuesHtml = `
            <div style="background: #FEF2F2; padding: 16px; border-radius: 8px; border-left: 4px solid #DC2626; margin-top: 16px;">
                <h4 style="margin: 0 0 12px 0; color: #991B1B; font-size: 15px; font-weight: 600;">
                    <i class="fas fa-exclamation-triangle"></i> 风险分析
                </h4>
                <ul style="margin: 0; padding-left: 20px; color: #991B1B; font-size: 14px; line-height: 2;">
                    ${invoice.issues.map(issue => `<li><strong>${issue}</strong></li>`).join('')}
                </ul>
                <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid #FEE2E2;">
                    <p style="margin: 0; color: #991B1B; font-size: 13px;">
                        <strong>处理建议：</strong>需核实采购真实性，检查是否存在虚开发票、虚假报销等问题
                    </p>
                </div>
            </div>
        `;
    }

    // 发票明细表格HTML
    const invoiceTableHtml = `
        <table class="data-table" style="width: 100%; margin-top: 8px;">
            <thead>
                <tr>
                    <th>发票号</th>
                    <th>金额</th>
                    <th>内容</th>
                    <th>日期</th>
                </tr>
            </thead>
            <tbody>
                ${invoiceDetails.join('')}
            </tbody>
        </table>
    `;

    showDetailModal('连号发票详情', invoice.project, {
        '项目信息': {
            '项目名称': invoice.project,
            '项目编号': invoice.projectNo,
            '项目负责人': invoice.leader,
            '所属学院': invoice.college,
            '项目总经费': `¥${formatNumber(invoice.totalBudget)}`
        },
        '连号发票信息': {
            '发票号段': invoice.invoiceRange,
            '发票数量': `${invoice.count}张`,
            '总金额': `¥${formatNumber(invoice.amount)}`,
            '开票日期': invoice.date,
            '开票单位': invoice.vendor,
            '纳税人识别号': invoice.vendorTaxNo,
            '风险等级': riskBadge
        },
        '发票明细': invoiceTableHtml,
        '风险分析': issuesHtml
    });
}

// 科研经费监督 - 查看预算详情
function viewBudgetDetail(projectNo) {
    const budget = budgetDeviationData.find(b => b.projectNo === projectNo);
    if (!budget) {
        Toast.error('未找到预算信息');
        return;
    }

    // 构建风险等级徽章
    let riskBadge = '';
    if (budget.risk === 'high') {
        riskBadge = '<span class="badge badge-danger">高风险</span>';
    } else if (budget.risk === 'medium') {
        riskBadge = '<span class="badge badge-warning">中风险</span>';
    } else {
        riskBadge = '<span class="badge badge-info">低风险</span>';
    }

    // 构建预算明细表格
    const budgetBreakdownHtml = `
        <table class="data-table" style="width: 100%; margin-top: 8px;">
            <thead>
                <tr>
                    <th>科目</th>
                    <th>预算金额</th>
                    <th>已执行</th>
                    <th>执行率</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>设备费</td>
                    <td>¥${formatNumber(budget.budgetBreakdown.equipment.budget)}</td>
                    <td>¥${formatNumber(budget.budgetBreakdown.equipment.executed)}</td>
                    <td style="color: ${budget.budgetBreakdown.equipment.rate < 50 ? '#DC2626' : '#059669'};">${budget.budgetBreakdown.equipment.rate}%</td>
                </tr>
                <tr>
                    <td>材料费</td>
                    <td>¥${formatNumber(budget.budgetBreakdown.materials.budget)}</td>
                    <td>¥${formatNumber(budget.budgetBreakdown.materials.executed)}</td>
                    <td style="color: ${budget.budgetBreakdown.materials.rate < 50 ? '#DC2626' : '#059669'};">${budget.budgetBreakdown.materials.rate}%</td>
                </tr>
                <tr>
                    <td>劳务费</td>
                    <td>¥${formatNumber(budget.budgetBreakdown.labor.budget)}</td>
                    <td>¥${formatNumber(budget.budgetBreakdown.labor.executed)}</td>
                    <td style="color: ${budget.budgetBreakdown.labor.rate < 50 ? '#DC2626' : '#059669'};">${budget.budgetBreakdown.labor.rate}%</td>
                </tr>
                <tr>
                    <td>其他费用</td>
                    <td>¥${formatNumber(budget.budgetBreakdown.other.budget)}</td>
                    <td>¥${formatNumber(budget.budgetBreakdown.other.executed)}</td>
                    <td style="color: ${budget.budgetBreakdown.other.rate < 50 ? '#DC2626' : '#059669'};">${budget.budgetBreakdown.other.rate}%</td>
                </tr>
            </tbody>
        </table>
    `;

    // 构建问题清单或合规评价
    let issuesHtml = '';
    if (budget.issues && budget.issues.length > 0) {
        issuesHtml = `
            <div style="background: #FEF2F2; padding: 16px; border-radius: 8px; border-left: 4px solid #DC2626; margin-top: 16px;">
                <h4 style="margin: 0 0 12px 0; color: #991B1B; font-size: 15px; font-weight: 600;">
                    <i class="fas fa-exclamation-triangle"></i> 发现的问题
                </h4>
                <ul style="margin: 0; padding-left: 20px; color: #991B1B; font-size: 14px; line-height: 2;">
                    ${budget.issues.map(issue => `<li><strong>${issue}</strong></li>`).join('')}
                </ul>
                <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid #FEE2E2;">
                    <p style="margin: 0; color: #991B1B; font-size: 13px;">
                        <strong>处理建议：</strong>需核查项目实际进展情况，分析预算执行偏离原因，督促项目组合理使用经费
                    </p>
                </div>
            </div>
        `;
    } else {
        issuesHtml = `
            <div style="background: #F0FDF4; padding: 16px; border-radius: 8px; border-left: 4px solid #10B981; margin-top: 16px;">
                <p style="margin: 0; color: #166534; font-size: 14px;">
                    <i class="fas fa-check-circle" style="color: #10B981; margin-right: 8px;"></i>
                    <strong>该项目预算执行情况正常，与项目进度基本匹配。</strong>
                </p>
            </div>
        `;
    }

    showDetailModal('预算执行偏离度分析', budget.project, {
        '项目信息': {
            '项目名称': budget.project,
            '项目编号': budget.projectNo,
            '项目负责人': budget.leader,
            '所属学院': budget.college,
            '项目周期': `${budget.startDate} 至 ${budget.endDate}`
        },
        '预算执行情况': {
            '预算总额': `¥${formatNumber(budget.budget)}`,
            '已执行': `¥${formatNumber(budget.executed)}`,
            '执行率': `${budget.rate}%`,
            '项目进度': `${budget.progress}%`,
            '偏离度': `<span style="color: ${Math.abs(budget.deviation) > 30 ? '#DC2626' : '#D97706'}; font-weight: 600;">${budget.deviation > 0 ? '+' : ''}${budget.deviation}%</span>`,
            '风险等级': riskBadge
        },
        '预算明细': budgetBreakdownHtml,
        '偏离分析': issuesHtml
    });
}

// 科研经费监督 - 查看设备详情
function viewEquipmentDetail(projectNo) {
    const equipment = duplicateEquipmentData.find(e => e.projectNo === projectNo);
    if (!equipment) {
        Toast.error('未找到设备信息');
        return;
    }

    // 构建风险等级徽章
    let riskBadge = '';
    if (equipment.risk === 'high') {
        riskBadge = '<span class="badge badge-danger">高风险</span>';
    } else if (equipment.risk === 'medium') {
        riskBadge = '<span class="badge badge-warning">中风险</span>';
    } else {
        riskBadge = '<span class="badge badge-info">低风险</span>';
    }

    // 构建现有设备分布表格
    const existingEquipmentHtml = `
        <table class="data-table" style="width: 100%; margin-top: 8px;">
            <thead>
                <tr>
                    <th>存放位置</th>
                    <th>数量</th>
                    <th>采购日期</th>
                    <th>状态</th>
                </tr>
            </thead>
            <tbody>
                ${equipment.existingLocations.map(loc => `
                    <tr>
                        <td>${loc.location}</td>
                        <td>${loc.quantity}台</td>
                        <td>${loc.purchaseDate}</td>
                        <td><span style="color: ${loc.status === '闲置' ? '#DC2626' : '#059669'}; font-weight: 600;">${loc.status}</span></td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;

    // 构建问题清单
    let issuesHtml = '';
    if (equipment.issues && equipment.issues.length > 0) {
        issuesHtml = `
            <div style="background: #FEF2F2; padding: 16px; border-radius: 8px; border-left: 4px solid #DC2626; margin-top: 16px;">
                <h4 style="margin: 0 0 12px 0; color: #991B1B; font-size: 15px; font-weight: 600;">
                    <i class="fas fa-exclamation-triangle"></i> 重复采购风险
                </h4>
                <ul style="margin: 0; padding-left: 20px; color: #991B1B; font-size: 14px; line-height: 2;">
                    ${equipment.issues.map(issue => `<li><strong>${issue}</strong></li>`).join('')}
                </ul>
            </div>
        `;
    }

    showDetailModal('设备重复采购预警', equipment.equipment, {
        '设备信息': {
            '设备名称': equipment.equipment,
            '设备型号': equipment.model,
            '拟采购数量': `${equipment.quantity}台`,
            '采购金额': `¥${formatNumber(equipment.amount)}`
        },
        '项目信息': {
            '项目名称': equipment.project,
            '项目编号': equipment.projectNo,
            '项目负责人': equipment.leader,
            '所属学院': equipment.college
        },
        '现有设备情况': {
            '现有数量': `${equipment.existing}台`,
            '设备利用率': `${equipment.utilizationRate}%`,
            '风险等级': riskBadge
        },
        '现有设备分布': existingEquipmentHtml,
        '风险分析': issuesHtml
    });
}



// 项目监督检查点数据
const projectCheckpointData = [
    {
        project: '新校区图书馆建设',
        projectNo: 'JJ-2025-001',
        amount: 85000000,
        buildingUnit: '基建处',
        contractor: '某某建设集团',
        checkpoint: '招标文件审查',
        content: '需求倾向性检查',
        result: '发现3处倾向性条款',
        risk: 'high',
        checkDate: '2025-10-15',
        checker: '纪检监察室',
        issues: [
            '要求投标人必须具有某品牌产品授权',
            '指定特定型号的材料设备',
            '要求投标人具有本地区类似项目经验'
        ],
        suggestions: '要求建设单位修改招标文件，删除倾向性条款，确保公平竞争'
    },
    {
        project: '学生宿舍楼改造',
        projectNo: 'JJ-2025-002',
        amount: 32000000,
        buildingUnit: '后勤处',
        contractor: '装饰工程公司',
        checkpoint: '开标过程监督',
        content: '投标人资格审查',
        result: '正常',
        risk: 'low',
        checkDate: '2025-10-18',
        checker: '纪检监察室',
        issues: [],
        suggestions: ''
    },
    {
        project: '实验楼装修工程',
        projectNo: 'JJ-2025-003',
        amount: 18000000,
        buildingUnit: '物理学院',
        contractor: '装修工程公司',
        checkpoint: '合同签订审查',
        content: '合同条款合规性',
        result: '发现1处不合规条款',
        risk: 'medium',
        checkDate: '2025-10-20',
        checker: '纪检监察室',
        issues: [
            '合同中存在不平等条款，对学校权益保护不足'
        ],
        suggestions: '要求修改合同条款，增加违约责任和质量保证条款'
    },
    {
        project: '校园道路改造',
        projectNo: 'JJ-2025-004',
        amount: 12000000,
        buildingUnit: '基建处',
        contractor: '市政工程公司',
        checkpoint: '施工过程监督',
        content: '材料质量检查',
        result: '正常',
        risk: 'low',
        checkDate: '2025-10-22',
        checker: '纪检监察室',
        issues: [],
        suggestions: ''
    },
    {
        project: '体育馆维修',
        projectNo: 'JJ-2025-005',
        amount: 8500000,
        buildingUnit: '体育部',
        contractor: '建筑维修公司',
        checkpoint: '变更审批监督',
        content: '变更合理性审查',
        result: '变更频率偏高',
        risk: 'medium',
        checkDate: '2025-10-23',
        checker: '纪检监察室',
        issues: [
            '项目变更次数达到8次，超过正常范围',
            '部分变更缺少充分的理由说明',
            '变更导致工程造价增加15%'
        ],
        suggestions: '加强项目前期论证，减少不必要的变更；对重大变更进行专家论证'
    }
];

// 加载基建采购监督模块
function loadConstructionModule() {
    loadProjectCheckpoints();
    initBidderRelationGraph();
    loadBidderRelationAnalysis();
    loadExclusiveClauseDetection();
}

// 加载项目监督检查点
function loadProjectCheckpoints() {
    const tbody = document.querySelector('#checkpointTable tbody');
    if (!tbody) return;

    tbody.innerHTML = projectCheckpointData.map(item => `
        <tr>
            <td class="font-medium text-gray-900">${item.project}</td>
            <td>¥${formatNumber(item.amount)}</td>
            <td>${item.checkpoint}</td>
            <td>${item.content}</td>
            <td class="${item.result === '正常' ? 'text-green-600' : 'text-red-600'}">${item.result}</td>
            <td>
                <span class="risk-badge ${item.risk}">
                    ${item.risk === 'high' ? '高风险' : item.risk === 'medium' ? '中风险' : '低风险'}
                </span>
            </td>
            <td>
                <button class="action-btn action-btn-primary" onclick="viewCheckpointDetail('${item.projectNo}')">
                    <i class="fas fa-eye"></i> 查看
                </button>
            </td>
        </tr>
    `).join('');
}

// 投标人关联分析数据
const bidderRelationData = [
    {
        project: '新校区图书馆建设',
        projectNo: 'JJ-2025-001',
        companyA: '建设集团A',
        companyACode: '91110000XXXXXXXX11',
        companyALegal: '张某某',
        companyB: '建设集团B',
        companyBCode: '91110000XXXXXXXX12',
        companyBLegal: '李某某',
        relationType: '法人关联',
        detail: '两家企业法人为夫妻关系',
        risk: 'high',
        evidence: [
            '张某某与李某某为夫妻关系（民政局婚姻登记信息）',
            '两家企业注册地址相近，仅相隔200米',
            '两家企业财务人员为同一人',
            '两家企业银行账户存在频繁资金往来'
        ],
        bidAmount: {
            companyA: 82000000,
            companyB: 83500000
        }
    },
    {
        project: '学生宿舍楼改造',
        projectNo: 'JJ-2025-002',
        companyA: '装饰公司C',
        companyACode: '91110000XXXXXXXX13',
        companyALegal: '王某某',
        companyB: '装饰公司D',
        companyBCode: '91110000XXXXXXXX14',
        companyBLegal: '赵某某',
        relationType: '股权关联',
        detail: '公司C持有公司D 30%股权',
        risk: 'high',
        evidence: [
            '工商登记信息显示公司C持有公司D 30%股权',
            '公司C法人王某某担任公司D监事',
            '两家企业存在关联交易记录',
            '两家企业共用同一办公场所'
        ],
        bidAmount: {
            companyA: 30500000,
            companyB: 31200000
        }
    },
    {
        project: '实验楼装修工程',
        projectNo: 'JJ-2025-003',
        companyA: '工程公司E',
        companyACode: '91110000XXXXXXXX15',
        companyALegal: '孙某某',
        companyB: '工程公司F',
        companyBCode: '91110000XXXXXXXX16',
        companyBLegal: '周某某',
        relationType: '人员关联',
        detail: '两家企业有3名共同员工',
        risk: 'medium',
        evidence: [
            '社保缴纳记录显示3名员工同时在两家企业参保',
            '两家企业投标文件中的技术方案高度相似',
            '两家企业使用相同的投标文件模板'
        ],
        bidAmount: {
            companyA: 17500000,
            companyB: 17800000
        }
    },
    {
        project: '校园道路改造',
        projectNo: 'JJ-2025-004',
        companyA: '市政公司G',
        companyACode: '91110000XXXXXXXX17',
        companyALegal: '吴某某',
        companyB: '市政公司H',
        companyBCode: '91110000XXXXXXXX18',
        companyBLegal: '郑某某',
        relationType: '地址关联',
        detail: '注册地址相同',
        risk: 'medium',
        evidence: [
            '两家企业注册地址完全相同',
            '两家企业联系电话前7位相同',
            '两家企业成立时间相近（相差不到1个月）'
        ],
        bidAmount: {
            companyA: 11800000,
            companyB: 11500000
        }
    }
];

// 初始化投标人关联关系图谱
function initBidderRelationGraph() {
    const chartDom = document.getElementById('bidderRelationGraph');
    if (!chartDom) return;
    
    const myChart = echarts.init(chartDom);
    
    // 构建图谱数据
    const nodes = [];
    const links = [];
    const nodeMap = new Map();
    
    // 添加项目节点和企业节点
    bidderRelationData.forEach((item, index) => {
        // 添加项目节点
        const projectId = `project_${index}`;
        if (!nodeMap.has(projectId)) {
            nodes.push({
                id: projectId,
                name: item.project,
                symbolSize: 60,
                category: 0,
                itemStyle: {
                    color: '#3B82F6'
                }
            });
            nodeMap.set(projectId, true);
        }
        
        // 添加企业A节点
        const companyAId = `company_${item.companyACode}`;
        if (!nodeMap.has(companyAId)) {
            nodes.push({
                id: companyAId,
                name: item.companyA,
                symbolSize: 50,
                category: 1,
                itemStyle: {
                    color: '#10B981'
                },
                label: {
                    fontSize: 11
                }
            });
            nodeMap.set(companyAId, true);
        }
        
        // 添加企业B节点
        const companyBId = `company_${item.companyBCode}`;
        if (!nodeMap.has(companyBId)) {
            nodes.push({
                id: companyBId,
                name: item.companyB,
                symbolSize: 50,
                category: 1,
                itemStyle: {
                    color: '#10B981'
                },
                label: {
                    fontSize: 11
                }
            });
            nodeMap.set(companyBId, true);
        }
        
        // 添加法人节点
        const legalAId = `legal_${item.companyALegal}`;
        if (!nodeMap.has(legalAId)) {
            nodes.push({
                id: legalAId,
                name: item.companyALegal,
                symbolSize: 35,
                category: 2,
                itemStyle: {
                    color: '#F59E0B'
                },
                label: {
                    fontSize: 10
                }
            });
            nodeMap.set(legalAId, true);
        }
        
        const legalBId = `legal_${item.companyBLegal}`;
        if (!nodeMap.has(legalBId)) {
            nodes.push({
                id: legalBId,
                name: item.companyBLegal,
                symbolSize: 35,
                category: 2,
                itemStyle: {
                    color: '#F59E0B'
                },
                label: {
                    fontSize: 10
                }
            });
            nodeMap.set(legalBId, true);
        }
        
        // 添加关系连线
        // 项目到企业A
        links.push({
            source: projectId,
            target: companyAId,
            label: {
                show: true,
                formatter: `¥${(item.bidAmount.companyA / 10000).toFixed(0)}万`,
                fontSize: 10
            },
            lineStyle: {
                color: '#94A3B8',
                width: 2
            }
        });
        
        // 项目到企业B
        links.push({
            source: projectId,
            target: companyBId,
            label: {
                show: true,
                formatter: `¥${(item.bidAmount.companyB / 10000).toFixed(0)}万`,
                fontSize: 10
            },
            lineStyle: {
                color: '#94A3B8',
                width: 2
            }
        });
        
        // 企业A到法人A
        links.push({
            source: companyAId,
            target: legalAId,
            label: {
                show: true,
                formatter: '法人',
                fontSize: 9
            },
            lineStyle: {
                color: '#CBD5E1',
                width: 1.5
            }
        });
        
        // 企业B到法人B
        links.push({
            source: companyBId,
            target: legalBId,
            label: {
                show: true,
                formatter: '法人',
                fontSize: 9
            },
            lineStyle: {
                color: '#CBD5E1',
                width: 1.5
            }
        });
        
        // 企业A和企业B之间的关联关系（高风险用红色标注）
        links.push({
            source: companyAId,
            target: companyBId,
            label: {
                show: true,
                formatter: item.relationType,
                fontSize: 11,
                fontWeight: 'bold',
                color: item.risk === 'high' ? '#DC2626' : '#F59E0B'
            },
            lineStyle: {
                color: item.risk === 'high' ? '#DC2626' : '#F59E0B',
                width: 3,
                type: 'dashed'
            }
        });
    });
    
    const option = {
        title: {
            text: '投标人关联关系图谱',
            left: 'center',
            top: 10,
            textStyle: {
                fontSize: 16,
                fontWeight: 600,
                color: '#111827'
            }
        },
        tooltip: {
            trigger: 'item',
            formatter: function(params) {
                if (params.dataType === 'node') {
                    return `${params.data.name}`;
                } else if (params.dataType === 'edge') {
                    return `${params.data.source} → ${params.data.target}`;
                }
            }
        },
        legend: [{
            data: ['项目', '企业', '法人'],
            orient: 'vertical',
            left: 10,
            top: 50,
            textStyle: {
                fontSize: 12,
                color: '#6B7280'
            }
        }],
        series: [{
            type: 'graph',
            layout: 'force',
            data: nodes,
            links: links,
            categories: [
                { name: '项目' },
                { name: '企业' },
                { name: '法人' }
            ],
            roam: true,
            label: {
                show: true,
                position: 'bottom',
                fontSize: 11,
                color: '#374151'
            },
            force: {
                repulsion: 800,
                edgeLength: [100, 200],
                gravity: 0.1
            },
            emphasis: {
                focus: 'adjacency',
                lineStyle: {
                    width: 5
                }
            },
            lineStyle: {
                curveness: 0.2
            }
        }]
    };
    
    myChart.setOption(option);
    
    // 响应式调整
    window.addEventListener('resize', function() {
        myChart.resize();
    });
}

// 加载投标人关联分析
function loadBidderRelationAnalysis() {
    const tbody = document.querySelector('#bidderRelationTable tbody');
    if (!tbody) return;

    tbody.innerHTML = bidderRelationData.map(item => `
        <tr>
            <td class="font-medium text-gray-900">${item.project}</td>
            <td>${item.companyA}</td>
            <td>${item.companyB}</td>
            <td>${item.relationType}</td>
            <td class="text-red-600">${item.detail}</td>
            <td>
                <span class="risk-badge ${item.risk}">
                    ${item.risk === 'high' ? '高风险' : item.risk === 'medium' ? '中风险' : '低风险'}
                </span>
            </td>
            <td>
                <button class="action-btn action-btn-primary" onclick="viewRelationGraph('${item.projectNo}')">
                    <i class="fas fa-project-diagram"></i> 图谱
                </button>
            </td>
        </tr>
    `).join('');
}
// 排他性条款识别数据
const exclusiveClauseData = [
    {
        project: '新校区图书馆建设',
        projectNo: 'JJ-2025-001',
        document: '招标文件-技术要求',
        documentDate: '2025-09-15',
        clause: '要求投标人必须具有某品牌产品授权',
        clauseLocation: '第三章 技术要求 第2.3条',
        type: '品牌限制',
        risk: 'high',
        analysis: '该条款限定了特定品牌，排除了其他符合技术标准的产品，违反了公平竞争原则',
        legalBasis: '《招标投标法实施条例》第三十二条：招标人不得以不合理的条件限制或者排斥潜在投标人',
        impact: '可能导致围标串标，限制竞争，抬高采购成本',
        suggestion: '删除品牌限制，改为技术参数要求，允许同等性能产品参与竞标'
    },
    {
        project: '学生宿舍楼改造',
        projectNo: 'JJ-2025-002',
        document: '招标文件-资格要求',
        documentDate: '2025-09-20',
        clause: '要求投标人注册资本不低于5000万元',
        clauseLocation: '第二章 投标人资格要求 第1.2条',
        type: '资金门槛过高',
        risk: 'medium',
        analysis: '该项目预算3200万元，要求注册资本5000万元明显过高，排除了部分有能力的中小企业',
        legalBasis: '《政府采购法》第二十二条：资格条件应当与采购项目的具体特点和实际需要相适应',
        impact: '限制了中小企业参与，减少了竞争，可能影响采购效果',
        suggestion: '根据项目规模合理设置资金门槛，建议调整为注册资本不低于2000万元'
    },
    {
        project: '实验楼装修工程',
        projectNo: 'JJ-2025-003',
        document: '招标文件-业绩要求',
        documentDate: '2025-09-25',
        clause: '要求投标人具有本地区类似项目经验',
        clauseLocation: '第二章 投标人资格要求 第1.5条',
        type: '地域限制',
        risk: 'high',
        analysis: '限定本地区经验构成地域歧视，排除了外地优秀企业，违反了公平竞争原则',
        legalBasis: '《招标投标法》第十八条：招标人不得以不合理的条件限制或者排斥潜在投标人',
        impact: '严重限制竞争，可能导致本地企业形成垄断，影响工程质量和造价',
        suggestion: '删除地域限制，改为要求类似项目经验，不限定地区'
    },
    {
        project: '校园道路改造',
        projectNo: 'JJ-2025-004',
        document: '招标文件-技术规格',
        documentDate: '2025-09-28',
        clause: '指定特定型号的材料设备',
        clauseLocation: '第三章 技术规格 第3.1条',
        type: '型号指定',
        risk: 'high',
        analysis: '直接指定材料设备型号，排除了其他符合标准的产品，存在明显的倾向性',
        legalBasis: '《招标投标法实施条例》第三十二条：不得指定特定的专利、商标、品牌',
        impact: '限制竞争，可能导致采购价格偏高，存在利益输送风险',
        suggestion: '删除型号指定，改为性能参数要求，允许同等性能产品'
    },
    {
        project: '体育馆维修',
        projectNo: 'JJ-2025-005',
        document: '招标文件-资格要求',
        documentDate: '2025-10-01',
        clause: '要求投标人具有特定资质证书',
        clauseLocation: '第二章 投标人资格要求 第1.3条',
        type: '资质限制',
        risk: 'medium',
        analysis: '要求的资质证书超出项目实际需要，可能排除部分有能力的企业',
        legalBasis: '《政府采购法》第二十二条：资格条件应当与采购项目相适应',
        impact: '限制了部分企业参与，减少了竞争',
        suggestion: '根据项目实际需要合理设置资质要求，不应过度限制'
    }
];
// 加载排他性条款识别
function loadExclusiveClauseDetection() {
    const tbody = document.querySelector('#exclusiveClauseTable tbody');
    if (!tbody) return;

    tbody.innerHTML = exclusiveClauseData.map(item => `
        <tr>
            <td class="font-medium text-gray-900">${item.project}</td>
            <td>${item.document}</td>
            <td class="text-red-600">${item.clause}</td>
            <td>${item.type}</td>
            <td>
                <span class="risk-badge ${item.risk}">
                    ${item.risk === 'high' ? '高风险' : item.risk === 'medium' ? '中风险' : '低风险'}
                </span>
            </td>
            <td>
                <button class="action-btn action-btn-primary" onclick="viewClauseDetail('${item.projectNo}')">
                    <i class="fas fa-file-alt"></i> 查看
                </button>
            </td>
        </tr>
    `).join('');
}

// 查看检查点详情
function viewCheckpointDetail(projectNo) {
    const checkpoint = projectCheckpointData.find(c => c.projectNo === projectNo);
    if (!checkpoint) {
        Toast.error('未找到检查点信息');
        return;
    }

    // 构建风险等级徽章
    let riskBadge = '';
    if (checkpoint.risk === 'high') {
        riskBadge = '<span class="badge badge-danger">高风险</span>';
    } else if (checkpoint.risk === 'medium') {
        riskBadge = '<span class="badge badge-warning">中风险</span>';
    } else {
        riskBadge = '<span class="badge badge-info">低风险</span>';
    }

    // 构建问题清单或合规评价
    let issuesHtml = '';
    if (checkpoint.issues && checkpoint.issues.length > 0) {
        issuesHtml = `
            <div style="background: #FEF2F2; padding: 16px; border-radius: 8px; border-left: 4px solid #DC2626; margin-top: 16px;">
                <h4 style="margin: 0 0 12px 0; color: #991B1B; font-size: 15px; font-weight: 600;">
                    <i class="fas fa-exclamation-triangle"></i> 发现的问题
                </h4>
                <ul style="margin: 0; padding-left: 20px; color: #991B1B; font-size: 14px; line-height: 2;">
                    ${checkpoint.issues.map((issue, index) => `<li><strong>${index + 1}. ${issue}</strong></li>`).join('')}
                </ul>
                ${checkpoint.suggestions ? `
                    <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid #FEE2E2;">
                        <p style="margin: 0; color: #991B1B; font-size: 13px;">
                            <strong>整改建议：</strong>${checkpoint.suggestions}
                        </p>
                    </div>
                ` : ''}
            </div>
        `;
    } else {
        issuesHtml = `
            <div style="background: #F0FDF4; padding: 16px; border-radius: 8px; border-left: 4px solid #10B981; margin-top: 16px;">
                <p style="margin: 0; color: #166534; font-size: 14px;">
                    <i class="fas fa-check-circle" style="color: #10B981; margin-right: 8px;"></i>
                    <strong>该检查点未发现问题，项目执行规范。</strong>
                </p>
            </div>
        `;
    }

    showDetailModal('项目监督检查详情', checkpoint.project, {
        '项目基本信息': {
            '项目名称': checkpoint.project,
            '项目编号': checkpoint.projectNo,
            '项目金额': `¥${formatNumber(checkpoint.amount)}`,
            '建设单位': checkpoint.buildingUnit,
            '施工单位': checkpoint.contractor
        },
        '检查情况': {
            '检查点': checkpoint.checkpoint,
            '检查内容': checkpoint.content,
            '检查日期': checkpoint.checkDate,
            '检查人员': checkpoint.checker,
            '检查结果': `<span style="color: ${checkpoint.result === '正常' ? '#059669' : '#DC2626'}; font-weight: 600;">${checkpoint.result}</span>`,
            '风险等级': riskBadge
        },
        '问题与建议': issuesHtml
    });
}

// 查看关系图谱
function viewRelationGraph(projectNo) {
    const relation = bidderRelationData.find(r => r.projectNo === projectNo);
    if (!relation) {
        Toast.error('未找到关联信息');
        return;
    }

    // 构建风险等级徽章
    let riskBadge = '';
    if (relation.risk === 'high') {
        riskBadge = '<span class="badge badge-danger">高风险</span>';
    } else if (relation.risk === 'medium') {
        riskBadge = '<span class="badge badge-warning">中风险</span>';
    } else {
        riskBadge = '<span class="badge badge-info">低风险</span>';
    }

    // 构建关联证据列表
    const evidenceHtml = `
        <div style="background: #FEF2F2; padding: 16px; border-radius: 8px; border-left: 4px solid #DC2626; margin-top: 16px;">
            <h4 style="margin: 0 0 12px 0; color: #991B1B; font-size: 15px; font-weight: 600;">
                <i class="fas fa-exclamation-triangle"></i> 关联证据
            </h4>
            <ul style="margin: 0; padding-left: 20px; color: #991B1B; font-size: 14px; line-height: 2;">
                ${relation.evidence.map(ev => `<li><strong>${ev}</strong></li>`).join('')}
            </ul>
            <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid #FEE2E2;">
                <p style="margin: 0; color: #991B1B; font-size: 13px;">
                    <strong>风险提示：</strong>两家企业存在关联关系，可能涉嫌围标串标，建议取消其投标资格或要求其中一家退出投标
                </p>
            </div>
        </div>
    `;

    showDetailModal('投标人关联分析', relation.project, {
        '项目信息': {
            '项目名称': relation.project,
            '项目编号': relation.projectNo
        },
        '企业A信息': {
            '企业名称': relation.companyA,
            '统一社会信用代码': relation.companyACode,
            '法定代表人': relation.companyALegal,
            '投标金额': `¥${formatNumber(relation.bidAmount.companyA)}`
        },
        '企业B信息': {
            '企业名称': relation.companyB,
            '统一社会信用代码': relation.companyBCode,
            '法定代表人': relation.companyBLegal,
            '投标金额': `¥${formatNumber(relation.bidAmount.companyB)}`
        },
        '关联分析': {
            '关联类型': relation.relationType,
            '关联详情': `<span style="color: #DC2626; font-weight: 600;">${relation.detail}</span>`,
            '风险等级': riskBadge
        },
        '关联证据': evidenceHtml
    });
}

// 查看条款详情
function viewClauseDetail(projectNo) {
    const clause = exclusiveClauseData.find(c => c.projectNo === projectNo);
    if (!clause) {
        Toast.error('未找到条款信息');
        return;
    }

    // 构建风险等级徽章
    let riskBadge = '';
    if (clause.risk === 'high') {
        riskBadge = '<span class="badge badge-danger">高风险</span>';
    } else if (clause.risk === 'medium') {
        riskBadge = '<span class="badge badge-warning">中风险</span>';
    } else {
        riskBadge = '<span class="badge badge-info">低风险</span>';
    }

    // 构建分析内容
    const analysisHtml = `
        <div style="background: #FEF2F2; padding: 16px; border-radius: 8px; border-left: 4px solid #DC2626; margin-top: 16px;">
            <h4 style="margin: 0 0 12px 0; color: #991B1B; font-size: 15px; font-weight: 600;">
                <i class="fas fa-exclamation-triangle"></i> 问题分析
            </h4>
            <div style="margin-bottom: 12px;">
                <p style="margin: 0 0 8px 0; color: #991B1B; font-size: 14px; line-height: 1.8;">
                    <strong>问题描述：</strong>${clause.analysis}
                </p>
            </div>
            <div style="margin-bottom: 12px; padding: 12px; background: #FEE2E2; border-radius: 4px;">
                <p style="margin: 0; color: #991B1B; font-size: 13px; line-height: 1.8;">
                    <strong>法律依据：</strong>${clause.legalBasis}
                </p>
            </div>
            <div style="margin-bottom: 12px;">
                <p style="margin: 0; color: #991B1B; font-size: 14px; line-height: 1.8;">
                    <strong>影响分析：</strong>${clause.impact}
                </p>
            </div>
            <div style="padding-top: 12px; border-top: 1px solid #FEE2E2;">
                <p style="margin: 0; color: #991B1B; font-size: 13px; line-height: 1.8;">
                    <strong>整改建议：</strong>${clause.suggestion}
                </p>
            </div>
        </div>
    `;

    showDetailModal('排他性条款详情', clause.project, {
        '项目信息': {
            '项目名称': clause.project,
            '项目编号': clause.projectNo
        },
        '文件信息': {
            '文件名称': clause.document,
            '发布日期': clause.documentDate,
            '条款位置': clause.clauseLocation
        },
        '条款内容': {
            '条款内容': `<span style="color: #DC2626; font-weight: 600;">${clause.clause}</span>`,
            '条款类型': clause.type,
            '风险等级': riskBadge
        },
        '分析与建议': analysisHtml
    });
}

// 加载财务管理监督模块
function loadFinanceModule() {
    loadThreePublicFundsMonitoring();
    loadSlushFundScreening();
    loadFundMisuseDetection();
}
// 三公经费监控数据
const threePublicFundsData = [
    {
        unit: '机关部门',
        unitId: 'FIN-001',
        type: '公务用车费',
        budget: 1200000,
        used: 1185000,
        rate: 98.8,
        status: 'warning',
        details: {
            vehicleCount: 8,
            maintenanceCost: 450000,
            fuelCost: 520000,
            insuranceCost: 215000
        },
        issues: [
            '执行率已达98.8%，接近预算上限',
            '需严格控制后续支出',
            '建议加强车辆使用管理'
        ]
    },
    {
        unit: '计算机学院',
        unitId: 'FIN-002',
        type: '因公出国（境）费',
        budget: 300000,
        used: 256000,
        rate: 85.3,
        status: 'normal',
        details: {
            tripCount: 5,
            averageCost: 51200,
            destinations: '美国、英国、日本',
            purpose: '学术交流、会议参加'
        },
        issues: []
    },
    {
        unit: '经济管理学院',
        unitId: 'FIN-003',
        type: '公务接待费',
        budget: 200000,
        used: 182000,
        rate: 91.0,
        status: 'normal',
        details: {
            receptionCount: 12,
            averageCost: 15167,
            guestType: '兄弟院校、合作单位',
            standard: '符合接待标准'
        },
        issues: []
    },
    {
        unit: '外国语学院',
        unitId: 'FIN-004',
        type: '因公出国（境）费',
        budget: 250000,
        used: 235000,
        rate: 94.0,
        status: 'attention',
        details: {
            tripCount: 4,
            averageCost: 58750,
            destinations: '法国、德国、西班牙',
            purpose: '学术交流、师资培训'
        },
        issues: [
            '执行率较高，需关注后续支出'
        ]
    },
    {
        unit: '机械工程学院',
        unitId: 'FIN-005',
        type: '公务接待费',
        budget: 180000,
        used: 165000,
        rate: 91.7,
        status: 'normal',
        details: {
            receptionCount: 10,
            averageCost: 16500,
            guestType: '企业合作方、专家学者',
            standard: '符合接待标准'
        },
        issues: []
    }
];

// 小金库线索筛查数据
const slushFundData = [
    {
        unit: '后勤服务中心',
        unitId: 'SLU-001',
        type: '虚报项目',
        description: '发现3个虚假维修项目',
        amount: 125000,
        date: '2025-10-18',
        risk: 'high',
        discoveryMethod: '数据比对分析',
        evidence: [
            '维修项目无实际施工记录',
            '发票开具单位与合同单位不符',
            '项目验收记录缺失',
            '资金流向异常'
        ],
        involvedPersons: ['后勤处长', '财务人员'],
        suggestedAction: '立即冻结相关账户，启动调查程序，追回违规资金'
    },
    {
        unit: '继续教育学院',
        unitId: 'SLU-002',
        type: '违规收费',
        description: '培训费未入账',
        amount: 85000,
        date: '2025-10-15',
        risk: 'high',
        discoveryMethod: '学员举报',
        evidence: [
            '培训收费未开具正式发票',
            '收费未纳入学校财务系统',
            '存在私设账户嫌疑',
            '收费标准未经审批'
        ],
        involvedPersons: ['继续教育学院院长', '培训中心主任'],
        suggestedAction: '要求立即整改，将所有收费纳入学校财务管理，追缴未入账资金'
    },
    {
        unit: '资产管理处',
        unitId: 'SLU-003',
        type: '虚开发票',
        description: '发现5张虚假发票',
        amount: 68000,
        date: '2025-10-12',
        risk: 'medium',
        discoveryMethod: '发票查验系统',
        evidence: [
            '发票号码在税务系统中不存在',
            '开票单位已注销',
            '发票内容与实际业务不符',
            '报销审批流程存在漏洞'
        ],
        involvedPersons: ['资产管理员', '报销经办人'],
        suggestedAction: '追回违规报销资金，完善报销审批流程，加强发票真伪核查'
    },
    {
        unit: '图书馆',
        unitId: 'SLU-004',
        type: '账外资金',
        description: '复印费未入账',
        amount: 32000,
        date: '2025-10-10',
        risk: 'medium',
        discoveryMethod: '内部审计',
        evidence: [
            '复印服务收费未纳入财务系统',
            '收费记录不完整',
            '资金去向不明',
            '缺少收费审批手续'
        ],
        involvedPersons: ['图书馆副馆长', '复印室负责人'],
        suggestedAction: '规范收费管理，建立完善的收费入账制度，追缴未入账资金'
    }
];

// 专项资金挪用检测数据
const fundMisuseData = [
    {
        project: '双一流建设专项',
        projectId: 'MIS-001',
        fundType: '学科建设经费',
        total: 5000000,
        abnormal: 350000,
        abnormalRate: 7.0,
        description: '用于非学科建设支出',
        risk: 'high',
        misuseDetails: [
            { item: '办公设备采购', amount: 150000, reason: '非学科建设直接相关' },
            { item: '会议费', amount: 120000, reason: '超出合理范围' },
            { item: '差旅费', amount: 80000, reason: '与学科建设无关' }
        ],
        responsiblePerson: '学科建设办公室主任',
        discoveryDate: '2025-10-20',
        suggestedAction: '要求立即停止违规支出，追回已挪用资金，严格按照专项资金管理办法使用'
    },
    {
        project: '科研创新平台建设',
        projectId: 'MIS-002',
        fundType: '科研基础设施经费',
        total: 3000000,
        abnormal: 180000,
        abnormalRate: 6.0,
        description: '用于日常办公支出',
        risk: 'medium',
        misuseDetails: [
            { item: '办公家具', amount: 80000, reason: '非科研设施' },
            { item: '日常办公用品', amount: 60000, reason: '应由日常经费支出' },
            { item: '车辆维修', amount: 40000, reason: '与科研平台无关' }
        ],
        responsiblePerson: '科研处处长',
        discoveryDate: '2025-10-18',
        suggestedAction: '规范专项资金使用，建立专项资金专账管理制度'
    },
    {
        project: '人才引进专项',
        projectId: 'MIS-003',
        fundType: '人才经费',
        total: 2000000,
        abnormal: 250000,
        abnormalRate: 12.5,
        description: '用于非人才相关支出',
        risk: 'high',
        misuseDetails: [
            { item: '部门活动费', amount: 100000, reason: '与人才引进无关' },
            { item: '办公装修', amount: 90000, reason: '非人才安置费用' },
            { item: '其他支出', amount: 60000, reason: '用途不明' }
        ],
        responsiblePerson: '人事处处长',
        discoveryDate: '2025-10-16',
        suggestedAction: '严格执行人才经费使用规定，追回违规支出，加强专项资金监管'
    },
    {
        project: '实验室建设专项',
        projectId: 'MIS-004',
        fundType: '设备购置经费',
        total: 1500000,
        abnormal: 120000,
        abnormalRate: 8.0,
        description: '用于其他项目支出',
        risk: 'medium',
        misuseDetails: [
            { item: '非实验室设备', amount: 70000, reason: '不符合专项用途' },
            { item: '维修费', amount: 50000, reason: '应由维修经费支出' }
        ],
        responsiblePerson: '实验室管理中心主任',
        discoveryDate: '2025-10-14',
        suggestedAction: '加强设备购置审批管理，确保专款专用'
    }
];
// 加载三公经费监控
function loadThreePublicFundsMonitoring() {
    const tbody = document.querySelector('#threePublicFundsTable tbody');
    if (!tbody) return;

    tbody.innerHTML = threePublicFundsData.map(item => {
        let statusText = '正常';
        let statusClass = 'text-green-600';
        if (item.status === 'warning') {
            statusText = '⚠️ 接近红线';
            statusClass = 'text-red-600 font-medium';
        } else if (item.status === 'attention') {
            statusText = '需关注';
            statusClass = 'text-yellow-600';
        }

        return `
            <tr>
                <td class="font-medium text-gray-900">${item.unit}</td>
                <td>${item.type}</td>
                <td>¥${formatNumber(item.budget)}</td>
                <td>¥${formatNumber(item.used)}</td>
                <td>${item.rate}%</td>
                <td class="${statusClass}">${statusText}</td>
                <td>
                    <button class="action-btn action-btn-primary" onclick="viewFundDetail('${item.unitId}')">
                        <i class="fas fa-chart-line"></i> 查看
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

// 加载小金库线索筛查
function loadSlushFundScreening() {
    const tbody = document.querySelector('#slushFundTable tbody');
    if (!tbody) return;

    tbody.innerHTML = slushFundData.map(item => `
        <tr>
            <td class="font-medium text-gray-900">${item.unit}</td>
            <td>${item.type}</td>
            <td class="text-red-600">${item.description}</td>
            <td class="font-medium">¥${formatNumber(item.amount)}</td>
            <td>${item.date}</td>
            <td>
                <span class="risk-badge ${item.risk}">
                    ${item.risk === 'high' ? '高风险' : item.risk === 'medium' ? '中风险' : '低风险'}
                </span>
            </td>
            <td>
                <button class="action-btn action-btn-primary" onclick="viewSlushFundDetail('${item.unitId}')">
                    <i class="fas fa-search"></i> 核查
                </button>
            </td>
        </tr>
    `).join('');
}

// 加载专项资金挪用检测
function loadFundMisuseDetection() {
    const tbody = document.querySelector('#fundMisuseTable tbody');
    if (!tbody) return;

    tbody.innerHTML = fundMisuseData.map(item => `
        <tr>
            <td class="font-medium text-gray-900">${item.project}</td>
            <td>${item.fundType}</td>
            <td>¥${formatNumber(item.total)}</td>
            <td class="text-red-600 font-medium">¥${formatNumber(item.abnormal)}</td>
            <td class="text-red-600">${item.description}</td>
            <td>
                <span class="risk-badge ${item.risk}">
                    ${item.risk === 'high' ? '高风险' : item.risk === 'medium' ? '中风险' : '低风险'}
                </span>
            </td>
            <td>
                <button class="action-btn action-btn-primary" onclick="viewMisuseDetail('${item.projectId}')">
                    <i class="fas fa-search"></i> 核查
                </button>
            </td>
        </tr>
    `).join('');
}
// 查看三公经费详情
function viewFundDetail(unitId) {
    const fund = threePublicFundsData.find(f => f.unitId === unitId);
    if (!fund) {
        Toast.error('未找到经费信息');
        return;
    }

    // 构建详细信息HTML
    let detailsHtml = '';
    if (fund.type === '公务用车费') {
        detailsHtml = `
            <table class="data-table" style="width: 100%; margin-top: 8px;">
                <thead>
                    <tr>
                        <th>费用项目</th>
                        <th>金额</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>车辆维护费</td>
                        <td>¥${formatNumber(fund.details.maintenanceCost)}</td>
                    </tr>
                    <tr>
                        <td>燃油费</td>
                        <td>¥${formatNumber(fund.details.fuelCost)}</td>
                    </tr>
                    <tr>
                        <td>保险费</td>
                        <td>¥${formatNumber(fund.details.insuranceCost)}</td>
                    </tr>
                </tbody>
            </table>
        `;
    } else if (fund.type === '因公出国（境）费') {
        detailsHtml = `
            <div style="margin-top: 8px;">
                <p style="margin: 8px 0; color: #374151; font-size: 14px;">
                    <strong>出访次数：</strong>${fund.details.tripCount}次
                </p>
                <p style="margin: 8px 0; color: #374151; font-size: 14px;">
                    <strong>平均费用：</strong>¥${formatNumber(fund.details.averageCost)}/次
                </p>
                <p style="margin: 8px 0; color: #374151; font-size: 14px;">
                    <strong>目的地：</strong>${fund.details.destinations}
                </p>
                <p style="margin: 8px 0; color: #374151; font-size: 14px;">
                    <strong>出访目的：</strong>${fund.details.purpose}
                </p>
            </div>
        `;
    } else if (fund.type === '公务接待费') {
        detailsHtml = `
            <div style="margin-top: 8px;">
                <p style="margin: 8px 0; color: #374151; font-size: 14px;">
                    <strong>接待次数：</strong>${fund.details.receptionCount}次
                </p>
                <p style="margin: 8px 0; color: #374151; font-size: 14px;">
                    <strong>平均费用：</strong>¥${formatNumber(fund.details.averageCost)}/次
                </p>
                <p style="margin: 8px 0; color: #374151; font-size: 14px;">
                    <strong>接待对象：</strong>${fund.details.guestType}
                </p>
                <p style="margin: 8px 0; color: #374151; font-size: 14px;">
                    <strong>接待标准：</strong>${fund.details.standard}
                </p>
            </div>
        `;
    }

    // 构建问题提示或合规评价
    let issuesHtml = '';
    if (fund.issues && fund.issues.length > 0) {
        issuesHtml = `
            <div style="background: #FEF2F2; padding: 16px; border-radius: 8px; border-left: 4px solid #DC2626; margin-top: 16px;">
                <h4 style="margin: 0 0 12px 0; color: #991B1B; font-size: 15px; font-weight: 600;">
                    <i class="fas fa-exclamation-triangle"></i> 风险提示
                </h4>
                <ul style="margin: 0; padding-left: 20px; color: #991B1B; font-size: 14px; line-height: 2;">
                    ${fund.issues.map(issue => `<li><strong>${issue}</strong></li>`).join('')}
                </ul>
            </div>
        `;
    } else {
        issuesHtml = `
            <div style="background: #F0FDF4; padding: 16px; border-radius: 8px; border-left: 4px solid #10B981; margin-top: 16px;">
                <p style="margin: 0; color: #166534; font-size: 14px;">
                    <i class="fas fa-check-circle" style="color: #10B981; margin-right: 8px;"></i>
                    <strong>该单位三公经费使用规范，执行情况良好。</strong>
                </p>
            </div>
        `;
    }

    showDetailModal('三公经费详情', `${fund.unit} - ${fund.type}`, {
        '单位信息': {
            '单位名称': fund.unit,
            '经费类型': fund.type,
            '预算年度': '2025年'
        },
        '预算执行': {
            '预算总额': `¥${formatNumber(fund.budget)}`,
            '已使用金额': `¥${formatNumber(fund.used)}`,
            '执行率': `<span style="color: ${fund.rate > 95 ? '#DC2626' : '#059669'}; font-weight: 600;">${fund.rate}%</span>`,
            '剩余预算': `¥${formatNumber(fund.budget - fund.used)}`
        },
        '费用明细': detailsHtml,
        '风险评估': issuesHtml
    });
}

// 查看小金库详情
function viewSlushFundDetail(unitId) {
    const slush = slushFundData.find(s => s.unitId === unitId);
    if (!slush) {
        Toast.error('未找到小金库信息');
        return;
    }

    // 构建风险等级徽章
    let riskBadge = '';
    if (slush.risk === 'high') {
        riskBadge = '<span class="badge badge-danger">高风险</span>';
    } else if (slush.risk === 'medium') {
        riskBadge = '<span class="badge badge-warning">中风险</span>';
    } else {
        riskBadge = '<span class="badge badge-info">低风险</span>';
    }

    // 构建证据列表
    const evidenceHtml = `
        <div style="background: #FEF2F2; padding: 16px; border-radius: 8px; border-left: 4px solid #DC2626; margin-top: 16px;">
            <h4 style="margin: 0 0 12px 0; color: #991B1B; font-size: 15px; font-weight: 600;">
                <i class="fas fa-exclamation-triangle"></i> 证据清单
            </h4>
            <ul style="margin: 0; padding-left: 20px; color: #991B1B; font-size: 14px; line-height: 2;">
                ${slush.evidence.map(ev => `<li><strong>${ev}</strong></li>`).join('')}
            </ul>
            <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid #FEE2E2;">
                <p style="margin: 0; color: #991B1B; font-size: 13px;">
                    <strong>处理建议：</strong>${slush.suggestedAction}
                </p>
            </div>
        </div>
    `;

    showDetailModal('小金库线索详情', slush.unit, {
        '单位信息': {
            '单位名称': slush.unit,
            '问题类型': slush.type,
            '发现日期': slush.date,
            '发现方式': slush.discoveryMethod
        },
        '问题描述': {
            '问题概述': slush.description,
            '涉及金额': `<span style="color: #DC2626; font-weight: 600;">¥${formatNumber(slush.amount)}</span>`,
            '风险等级': riskBadge,
            '涉及人员': slush.involvedPersons.join('、')
        },
        '证据与建议': evidenceHtml
    });
}

// 查看资金挪用详情
function viewMisuseDetail(projectId) {
    const misuse = fundMisuseData.find(m => m.projectId === projectId);
    if (!misuse) {
        Toast.error('未找到挪用信息');
        return;
    }

    // 构建风险等级徽章
    let riskBadge = '';
    if (misuse.risk === 'high') {
        riskBadge = '<span class="badge badge-danger">高风险</span>';
    } else if (misuse.risk === 'medium') {
        riskBadge = '<span class="badge badge-warning">中风险</span>';
    } else {
        riskBadge = '<span class="badge badge-info">低风险</span>';
    }

    // 构建挪用明细表格
    const misuseDetailsHtml = `
        <table class="data-table" style="width: 100%; margin-top: 8px;">
            <thead>
                <tr>
                    <th>支出项目</th>
                    <th>金额</th>
                    <th>违规原因</th>
                </tr>
            </thead>
            <tbody>
                ${misuse.misuseDetails.map(detail => `
                    <tr>
                        <td>${detail.item}</td>
                        <td style="color: #DC2626; font-weight: 600;">¥${formatNumber(detail.amount)}</td>
                        <td style="color: #DC2626;">${detail.reason}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;

    // 构建处理建议
    const suggestionHtml = `
        <div style="background: #FEF2F2; padding: 16px; border-radius: 8px; border-left: 4px solid #DC2626; margin-top: 16px;">
            <h4 style="margin: 0 0 12px 0; color: #991B1B; font-size: 15px; font-weight: 600;">
                <i class="fas fa-exclamation-triangle"></i> 处理建议
            </h4>
            <p style="margin: 0; color: #991B1B; font-size: 14px; line-height: 1.8;">
                ${misuse.suggestedAction}
            </p>
        </div>
    `;

    showDetailModal('专项资金挪用详情', misuse.project, {
        '项目信息': {
            '项目名称': misuse.project,
            '资金类型': misuse.fundType,
            '发现日期': misuse.discoveryDate,
            '责任人': misuse.responsiblePerson
        },
        '资金情况': {
            '资金总额': `¥${formatNumber(misuse.total)}`,
            '异常金额': `<span style="color: #DC2626; font-weight: 600;">¥${formatNumber(misuse.abnormal)}</span>`,
            '异常比例': `<span style="color: #DC2626; font-weight: 600;">${misuse.abnormalRate}%</span>`,
            '问题描述': misuse.description,
            '风险等级': riskBadge
        },
        '挪用明细': misuseDetailsHtml,
        '处理建议': suggestionHtml
    });
}


// 加载八项规定监督模块
function loadEightRulesModule() {
    loadHiddenDiningDetection();
    initVehicleTrackMap();
    loadVehicleTrackMonitoring();
    loadGiftReceiptScreening();
}

// 隐蔽吃喝识别数据
const hiddenDiningData = [
    {
        unit: '机关办公室',
        unitId: 'EIGHT-001',
        person: '张某',
        personId: 'P001',
        project: '办公用品采购',
        actual: '餐饮消费',
        amount: 8500,
        date: '2025-10-18',
        risk: 'high',
        merchant: '某高档餐厅',
        invoiceNo: 'FP20251018001',
        participants: 8,
        evidence: [
            '报销项目为办公用品，但发票为餐饮发票',
            '消费金额较大，人均超过1000元',
            '消费时间为晚上，非工作时间',
            '商家为高档餐厅，不符合接待标准'
        ],
        suggestedAction: '要求退回违规报销款项，对相关责任人进行诫勉谈话，加强财务报销审核'
    },
    {
        unit: '后勤服务中心',
        unitId: 'EIGHT-002',
        person: '李某',
        personId: 'P002',
        project: '会议费',
        actual: '高档餐厅消费',
        amount: 12000,
        date: '2025-10-15',
        risk: 'high',
        merchant: '某五星级酒店餐厅',
        invoiceNo: 'FP20251015002',
        participants: 10,
        evidence: [
            '以会议费名义报销，但无会议记录',
            '消费地点为五星级酒店，超出接待标准',
            '人均消费1200元，明显超标',
            '发票内容包含高档酒水'
        ],
        suggestedAction: '追回违规报销款项，对责任人进行党纪处分，通报批评'
    },
    {
        unit: '学生工作处',
        unitId: 'EIGHT-003',
        person: '王某',
        personId: 'P003',
        project: '培训费',
        actual: '餐饮娱乐',
        amount: 6800,
        date: '2025-10-12',
        risk: 'medium',
        merchant: '某餐饮娱乐会所',
        invoiceNo: 'FP20251012003',
        participants: 6,
        evidence: [
            '培训费报销中包含餐饮和娱乐费用',
            '消费地点为娱乐会所，不符合规定',
            '无培训相关资料和签到记录'
        ],
        suggestedAction: '要求退回不合规费用，加强培训费用管理'
    },
    {
        unit: '科研处',
        unitId: 'EIGHT-004',
        person: '赵某',
        personId: 'P004',
        project: '差旅费',
        actual: '餐饮消费',
        amount: 5200,
        date: '2025-10-10',
        risk: 'medium',
        merchant: '某特色餐厅',
        invoiceNo: 'FP20251010004',
        participants: 4,
        evidence: [
            '差旅费中餐饮费用超出标准',
            '消费地点与出差地点不符',
            '人均消费超过差旅餐饮补助标准'
        ],
        suggestedAction: '要求补充说明并退回超标部分，加强差旅费审核'
    }
];

// 公车轨迹监控数据
const vehicleTrackData = [
    {
        plate: '粤A12345',
        vehicleId: 'VEH-001',
        dept: '机关办公室',
        driver: '张某某',
        time: '2025-10-20 19:30',
        location: '某高档会所',
        address: '天河区某某路88号',
        type: '非工作时间使用',
        risk: 'high',
        duration: '2小时30分钟',
        mileage: 25,
        trackPoints: [
            { time: '19:30', location: '学校出发' },
            { time: '19:50', location: '到达会所' },
            { time: '22:00', location: '离开会所' },
            { time: '22:20', location: '返回学校' }
        ],
        evidence: [
            '非工作时间使用公车（19:30-22:20）',
            '目的地为高档会所，非公务场所',
            '停留时间长达2小时30分钟',
            '无公务出行审批记录'
        ],
        suggestedAction: '对驾驶员和审批人进行问责，追究私用公车责任，加强公车管理'
    },
    {
        plate: '粤AB7890',
        vehicleId: 'VEH-002',
        dept: '后勤服务中心',
        driver: '李某某',
        time: '2025-10-19 14:20',
        location: '某景区',
        address: '白云区某某景区',
        type: '工作时间私用',
        risk: 'high',
        duration: '4小时',
        mileage: 80,
        trackPoints: [
            { time: '14:20', location: '学校出发' },
            { time: '15:30', location: '到达景区' },
            { time: '18:30', location: '离开景区' },
            { time: '19:40', location: '返回学校' }
        ],
        evidence: [
            '工作时间驾驶公车前往景区',
            '停留时间长达3小时',
            '行驶里程80公里，明显超出正常公务范围',
            '无相关公务活动记录'
        ],
        suggestedAction: '严肃处理私用公车行为，追缴相关费用，给予纪律处分'
    },
    {
        plate: '粤AC1111',
        vehicleId: 'VEH-003',
        dept: '学生工作处',
        driver: '王某某',
        time: '2025-10-18 21:00',
        location: '某娱乐场所',
        address: '越秀区某某街99号',
        type: '非工作时间使用',
        risk: 'high',
        duration: '3小时',
        mileage: 30,
        trackPoints: [
            { time: '21:00', location: '学校出发' },
            { time: '21:20', location: '到达娱乐场所' },
            { time: '00:00', location: '离开娱乐场所' },
            { time: '00:20', location: '返回学校' }
        ],
        evidence: [
            '深夜使用公车（21:00-00:20）',
            '目的地为娱乐场所',
            '停留时间长达3小时',
            '严重违反公车使用规定'
        ],
        suggestedAction: '严肃查处违规行为，给予党纪政纪处分，通报批评'
    },
    {
        plate: '粤AD2222',
        vehicleId: 'VEH-004',
        dept: '科研处',
        driver: '赵某某',
        time: '2025-10-17 12:30',
        location: '某高档餐厅',
        address: '西城区某某大厦',
        type: '午餐时间异常',
        risk: 'medium',
        duration: '2小时',
        mileage: 15,
        trackPoints: [
            { time: '12:30', location: '学校出发' },
            { time: '12:45', location: '到达餐厅' },
            { time: '14:30', location: '离开餐厅' },
            { time: '14:45', location: '返回学校' }
        ],
        evidence: [
            '午餐时间使用公车前往高档餐厅',
            '停留时间2小时，超出正常午餐时间',
            '餐厅消费水平较高'
        ],
        suggestedAction: '核实公务用车情况，如属私用需追究责任'
    },
    {
        plate: '粤AE3333',
        vehicleId: 'VEH-005',
        dept: '教务处',
        driver: '孙某某',
        time: '2025-10-16 周末',
        location: '某商场',
        address: '朝阳区某某购物中心',
        type: '周末私用',
        risk: 'medium',
        duration: '3小时',
        mileage: 20,
        trackPoints: [
            { time: '10:00', location: '学校出发' },
            { time: '10:20', location: '到达商场' },
            { time: '13:00', location: '离开商场' },
            { time: '13:20', location: '返回学校' }
        ],
        evidence: [
            '周末使用公车前往商场',
            '无公务活动安排',
            '明显属于私人用途'
        ],
        suggestedAction: '对周末私用公车行为进行处理，加强节假日公车管理'
    }
];

// 礼品票据筛查数据
const giftReceiptData = [
    {
        unit: '机关办公室',
        unitId: 'GIFT-001',
        person: '孙某',
        personId: 'P005',
        content: '高档烟酒',
        amount: 15000,
        merchant: '某烟酒专卖店',
        merchantAddress: '某某区某某路',
        reason: '高档烟酒采购',
        risk: 'high',
        date: '2025-10-18',
        invoiceNo: 'FP20251018005',
        items: [
            { name: '某品牌白酒', quantity: 10, unitPrice: 1000, total: 10000 },
            { name: '某品牌香烟', quantity: 20, unitPrice: 250, total: 5000 }
        ],
        evidence: [
            '采购高档烟酒，单价过高',
            '数量较大，超出正常接待需求',
            '无相关接待审批手续',
            '违反禁止公款购买高档烟酒规定'
        ],
        suggestedAction: '立即停止违规采购，追回已购烟酒或款项，对责任人进行严肃处理'
    },
    {
        unit: '外事办公室',
        unitId: 'GIFT-002',
        person: '周某',
        personId: 'P006',
        content: '礼品卡',
        amount: 20000,
        merchant: '某商场',
        merchantAddress: '某某区某某广场',
        reason: '大额礼品卡采购',
        risk: 'high',
        date: '2025-10-15',
        invoiceNo: 'FP20251015006',
        items: [
            { name: '购物卡', quantity: 20, unitPrice: 1000, total: 20000 }
        ],
        evidence: [
            '大额采购礼品卡，用途不明',
            '无具体使用计划和审批',
            '存在变相发放福利嫌疑',
            '违反禁止发放购物卡规定'
        ],
        suggestedAction: '追回礼品卡，调查使用去向，对违规发放行为严肃处理'
    },
    {
        unit: '后勤服务中心',
        unitId: 'GIFT-003',
        person: '吴某',
        personId: 'P007',
        content: '高档茶叶',
        amount: 8000,
        merchant: '某茶叶店',
        merchantAddress: '某某区某某街',
        reason: '高档茶叶采购',
        risk: 'medium',
        date: '2025-10-12',
        invoiceNo: 'FP20251012007',
        items: [
            { name: '某品牌茶叶', quantity: 4, unitPrice: 2000, total: 8000 }
        ],
        evidence: [
            '采购高档茶叶，单价过高',
            '超出正常办公用品标准',
            '缺少采购审批手续'
        ],
        suggestedAction: '核实采购用途，如属违规需追回款项并处理'
    },
    {
        unit: '科研处',
        unitId: 'GIFT-004',
        person: '郑某',
        personId: 'P008',
        content: '工艺品',
        amount: 12000,
        merchant: '某工艺品店',
        merchantAddress: '某某区某某路',
        reason: '高价工艺品采购',
        risk: 'medium',
        date: '2025-10-10',
        invoiceNo: 'FP20251010008',
        items: [
            { name: '某工艺品', quantity: 3, unitPrice: 4000, total: 12000 }
        ],
        evidence: [
            '采购高价工艺品，用途不明',
            '单价较高，超出合理范围',
            '可能用于送礼'
        ],
        suggestedAction: '核实采购用途和去向，如属送礼需严肃处理'
    },
    {
        unit: '学生工作处',
        unitId: 'GIFT-005',
        person: '钱某',
        personId: 'P009',
        content: '购物卡',
        amount: 10000,
        merchant: '某超市',
        merchantAddress: '某某区某某商业街',
        reason: '购物卡采购',
        risk: 'high',
        date: '2025-10-08',
        invoiceNo: 'FP20251008009',
        items: [
            { name: '超市购物卡', quantity: 10, unitPrice: 1000, total: 10000 }
        ],
        evidence: [
            '采购购物卡，违反规定',
            '可能用于变相发放福利',
            '无合理用途说明'
        ],
        suggestedAction: '追回购物卡，调查发放情况，对违规行为进行处理'
    }
];

// 加载隐蔽吃喝识别
function loadHiddenDiningDetection() {
    const tbody = document.querySelector('#hiddenDiningTable tbody');
    if (!tbody) return;

    tbody.innerHTML = hiddenDiningData.map(item => `
        <tr>
            <td class="font-medium text-gray-900">${item.unit}</td>
            <td>${item.person}</td>
            <td>${item.project}</td>
            <td class="text-red-600">${item.actual}</td>
            <td class="font-medium">¥${formatNumber(item.amount)}</td>
            <td>${item.date}</td>
            <td>
                <span class="risk-badge ${item.risk}">
                    ${item.risk === 'high' ? '高风险' : item.risk === 'medium' ? '中风险' : '低风险'}
                </span>
            </td>
            <td>
                <button class="action-btn action-btn-primary" onclick="viewDiningDetail('${item.unitId}')">
                    <i class="fas fa-search"></i> 核查
                </button>
            </td>
        </tr>
    `).join('');
}

// 初始化公车轨迹地图
function initVehicleTrackMap() {
    const chartDom = document.getElementById('vehicleTrackMap');
    if (!chartDom) return;
    
    const myChart = echarts.init(chartDom);
    
    // 广州市各区的真实经纬度坐标
    const guangzhouDistricts = {
        '天河区': [113.3616, 23.1372],
        '越秀区': [113.2644, 23.1291],
        '白云区': [113.2733, 23.1579],
        '海珠区': [113.3178, 23.0838],
        '荔湾区': [113.2442, 23.1253],
        '番禺区': [113.3838, 22.9379],
        '黄埔区': [113.4786, 23.1062],
        '花都区': [113.2191, 23.3965],
        '南沙区': [113.5253, 22.7745],
        '增城区': [113.8107, 23.2617],
        '从化区': [113.5868, 23.5451]
    };
    
    // 为每个车辆分配真实的地理坐标
    const scatterData = vehicleTrackData.map((item) => {
        // 根据地址提取区域
        let coords = [113.2644, 23.1291]; // 默认越秀区
        for (const [district, coord] of Object.entries(guangzhouDistricts)) {
            if (item.address.includes(district.replace('区', ''))) {
                coords = coord;
                break;
            }
        }
        
        // 添加一些随机偏移，避免重叠
        const offset = 0.015;
        coords = [
            coords[0] + (Math.random() - 0.5) * offset,
            coords[1] + (Math.random() - 0.5) * offset
        ];
        
        return {
            name: item.plate,
            value: [...coords],
            itemStyle: {
                color: item.risk === 'high' ? '#EF4444' : item.risk === 'medium' ? '#F59E0B' : '#10B981',
                borderColor: '#fff',
                borderWidth: 2
            }
        };
    });
    
    // 使用简化的可视化方案（不依赖复杂的GeoJSON）
    const option = {
        title: {
            text: '广州市公车异常轨迹分布图',
            subtext: '各区域异常车辆分布情况',
            left: 'center',
            top: 10,
            textStyle: {
                fontSize: 16,
                fontWeight: 600,
                color: '#111827'
            },
            subtextStyle: {
                fontSize: 12,
                color: '#6B7280'
            }
        },
        tooltip: {
            trigger: 'item',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderColor: '#E5E7EB',
            borderWidth: 1,
            textStyle: {
                color: '#374151'
            },
            formatter: function(params) {
                const item = vehicleTrackData.find(v => v.plate === params.name);
                if (item) {
                    const riskColor = item.risk === 'high' ? '#EF4444' : item.risk === 'medium' ? '#F59E0B' : '#10B981';
                    const riskText = item.risk === 'high' ? '高风险' : item.risk === 'medium' ? '中风险' : '低风险';
                    return `
                        <div style="padding: 8px; min-width: 200px;">
                            <div style="font-weight: 600; margin-bottom: 8px; font-size: 14px; color: #111827;">
                                ${item.plate}
                                <span style="float: right; color: ${riskColor}; font-size: 12px;">${riskText}</span>
                            </div>
                            <div style="font-size: 12px; color: #6B7280; line-height: 1.8;">
                                <div>📍 ${item.address}</div>
                                <div>🏢 ${item.dept}</div>
                                <div>🕐 ${item.time}</div>
                                <div>📌 ${item.location}</div>
                                <div>⚠️ ${item.type}</div>
                            </div>
                        </div>
                    `;
                }
                return params.name;
            }
        },
        grid: {
            left: '5%',
            right: '5%',
            bottom: '5%',
            top: 80,
            containLabel: true
        },
        xAxis: {
            type: 'value',
            show: false,
            min: 113.15,
            max: 113.60
        },
        yAxis: {
            type: 'value',
            show: false,
            min: 22.85,
            max: 23.25
        },
        series: [
            {
                name: '异常车辆',
                type: 'effectScatter',
                data: scatterData,
                symbolSize: 22,
                showEffectOn: 'render',
                rippleEffect: {
                    brushType: 'stroke',
                    scale: 3.5,
                    period: 4
                },
                label: {
                    show: true,
                    formatter: '{b}',
                    position: 'top',
                    fontSize: 10,
                    color: '#111827',
                    fontWeight: 600,
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    padding: [3, 6],
                    borderRadius: 4,
                    borderColor: '#E5E7EB',
                    borderWidth: 1
                },
                emphasis: {
                    scale: 1.5,
                    focus: 'self',
                    label: {
                        show: true,
                        fontSize: 12
                    }
                },
                zlevel: 2
            }
        ],
        graphic: [
            {
                type: 'text',
                left: 'center',
                top: 'middle',
                z: 0,
                style: {
                    text: '广州市',
                    fontSize: 60,
                    fontWeight: 'bold',
                    fill: 'rgba(59, 130, 246, 0.08)'
                }
            },
            // 添加区域标注
            {
                type: 'text',
                left: '25%',
                top: '35%',
                z: 1,
                style: {
                    text: '越秀区',
                    fontSize: 14,
                    fill: '#6B7280',
                    fontWeight: 500
                }
            },
            {
                type: 'text',
                left: '55%',
                top: '35%',
                z: 1,
                style: {
                    text: '天河区',
                    fontSize: 14,
                    fill: '#6B7280',
                    fontWeight: 500
                }
            },
            {
                type: 'text',
                left: '35%',
                top: '60%',
                z: 1,
                style: {
                    text: '海珠区',
                    fontSize: 14,
                    fill: '#6B7280',
                    fontWeight: 500
                }
            },
            {
                type: 'text',
                left: '25%',
                top: '20%',
                z: 1,
                style: {
                    text: '白云区',
                    fontSize: 14,
                    fill: '#6B7280',
                    fontWeight: 500
                }
            },
            {
                type: 'text',
                left: '75%',
                top: '40%',
                z: 1,
                style: {
                    text: '黄埔区',
                    fontSize: 14,
                    fill: '#6B7280',
                    fontWeight: 500
                }
            },
            {
                type: 'text',
                left: '50%',
                top: '75%',
                z: 1,
                style: {
                    text: '番禺区',
                    fontSize: 14,
                    fill: '#6B7280',
                    fontWeight: 500
                }
            }
        ]
    };
    
    myChart.setOption(option);
    
    // 响应式调整
    window.addEventListener('resize', function() {
        myChart.resize();
    });
}

// 加载公车轨迹监控
function loadVehicleTrackMonitoring() {
    const tbody = document.querySelector('#vehicleTrackTable tbody');
    if (!tbody) return;

    tbody.innerHTML = vehicleTrackData.map(item => `
        <tr>
            <td class="font-medium text-gray-900">${item.plate}</td>
            <td>${item.dept}</td>
            <td>${item.time}</td>
            <td class="text-red-600">${item.location}</td>
            <td>${item.type}</td>
            <td>
                <span class="risk-badge ${item.risk}">
                    ${item.risk === 'high' ? '高风险' : item.risk === 'medium' ? '中风险' : '低风险'}
                </span>
            </td>
            <td>
                <button class="action-btn action-btn-primary" onclick="viewTrackDetail('${item.vehicleId}')">
                    <i class="fas fa-map-marked-alt"></i> 轨迹
                </button>
            </td>
        </tr>
    `).join('');
}

// 加载礼品票据筛查
function loadGiftReceiptScreening() {
    const tbody = document.querySelector('#giftReceiptTable tbody');
    if (!tbody) return;

    tbody.innerHTML = giftReceiptData.map(item => `
        <tr>
            <td class="font-medium text-gray-900">${item.unit}</td>
            <td>${item.person}</td>
            <td>${item.content}</td>
            <td class="font-medium">¥${formatNumber(item.amount)}</td>
            <td>${item.merchant}</td>
            <td class="text-red-600">${item.reason}</td>
            <td>
                <span class="risk-badge ${item.risk}">
                    ${item.risk === 'high' ? '高风险' : item.risk === 'medium' ? '中风险' : '低风险'}
                </span>
            </td>
            <td>
                <button class="action-btn action-btn-primary" onclick="viewReceiptDetail('${item.unitId}')">
                    <i class="fas fa-file-invoice"></i> 查看
                </button>
            </td>
        </tr>
    `).join('');
}

// 查看隐蔽吃喝详情
function viewDiningDetail(unitId) {
    const dining = hiddenDiningData.find(d => d.unitId === unitId);
    if (!dining) {
        Toast.error('未找到吃喝信息');
        return;
    }

    // 构建风险等级徽章
    let riskBadge = '';
    if (dining.risk === 'high') {
        riskBadge = '<span class="badge badge-danger">高风险</span>';
    } else if (dining.risk === 'medium') {
        riskBadge = '<span class="badge badge-warning">中风险</span>';
    } else {
        riskBadge = '<span class="badge badge-info">低风险</span>';
    }

    // 构建证据列表
    const evidenceHtml = `
        <div style="background: #FEF2F2; padding: 16px; border-radius: 8px; border-left: 4px solid #DC2626; margin-top: 16px;">
            <h4 style="margin: 0 0 12px 0; color: #991B1B; font-size: 15px; font-weight: 600;">
                <i class="fas fa-exclamation-triangle"></i> 违规证据
            </h4>
            <ul style="margin: 0; padding-left: 20px; color: #991B1B; font-size: 14px; line-height: 2;">
                ${dining.evidence.map(ev => `<li><strong>${ev}</strong></li>`).join('')}
            </ul>
            <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid #FEE2E2;">
                <p style="margin: 0; color: #991B1B; font-size: 13px;">
                    <strong>处理建议：</strong>${dining.suggestedAction}
                </p>
            </div>
        </div>
    `;

    showDetailModal('隐蔽吃喝详情', `${dining.person} - ${dining.date}`, {
        '报销信息': {
            '报销人': dining.person,
            '所属单位': dining.unit,
            '报销项目': dining.project,
            '报销日期': dining.date,
            '报销金额': `<span style="color: #DC2626; font-weight: 600;">¥${formatNumber(dining.amount)}</span>`
        },
        '实际消费': {
            '实际用途': `<span style="color: #DC2626; font-weight: 600;">${dining.actual}</span>`,
            '消费商家': dining.merchant,
            '发票号码': dining.invoiceNo,
            '参与人数': `${dining.participants}人`,
            '人均消费': `¥${formatNumber(Math.round(dining.amount / dining.participants))}`,
            '风险等级': riskBadge
        },
        '违规证据与建议': evidenceHtml
    });
}

// 查看公车轨迹详情
function viewTrackDetail(vehicleId) {
    const track = vehicleTrackData.find(t => t.vehicleId === vehicleId);
    if (!track) {
        Toast.error('未找到轨迹信息');
        return;
    }

    // 构建风险等级徽章
    let riskBadge = '';
    if (track.risk === 'high') {
        riskBadge = '<span class="badge badge-danger">高风险</span>';
    } else if (track.risk === 'medium') {
        riskBadge = '<span class="badge badge-warning">中风险</span>';
    } else {
        riskBadge = '<span class="badge badge-info">低风险</span>';
    }

    // 构建轨迹点表格
    const trackPointsHtml = `
        <table class="data-table" style="width: 100%; margin-top: 8px;">
            <thead>
                <tr>
                    <th>时间</th>
                    <th>位置</th>
                </tr>
            </thead>
            <tbody>
                ${track.trackPoints.map(point => `
                    <tr>
                        <td>${point.time}</td>
                        <td>${point.location}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;

    // 构建证据列表
    const evidenceHtml = `
        <div style="background: #FEF2F2; padding: 16px; border-radius: 8px; border-left: 4px solid #DC2626; margin-top: 16px;">
            <h4 style="margin: 0 0 12px 0; color: #991B1B; font-size: 15px; font-weight: 600;">
                <i class="fas fa-exclamation-triangle"></i> 违规证据
            </h4>
            <ul style="margin: 0; padding-left: 20px; color: #991B1B; font-size: 14px; line-height: 2;">
                ${track.evidence.map(ev => `<li><strong>${ev}</strong></li>`).join('')}
            </ul>
            <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid #FEE2E2;">
                <p style="margin: 0; color: #991B1B; font-size: 13px;">
                    <strong>处理建议：</strong>${track.suggestedAction}
                </p>
            </div>
        </div>
    `;

    showDetailModal('公车轨迹详情', `${track.plate} - ${track.time}`, {
        '车辆信息': {
            '车牌号': track.plate,
            '所属部门': track.dept,
            '驾驶员': track.driver,
            '出行时间': track.time
        },
        '轨迹信息': {
            '目的地': `<span style="color: #DC2626; font-weight: 600;">${track.location}</span>`,
            '详细地址': track.address,
            '违规类型': track.type,
            '停留时长': track.duration,
            '行驶里程': `${track.mileage}公里`,
            '风险等级': riskBadge
        },
        '行驶轨迹': trackPointsHtml,
        '违规证据与建议': evidenceHtml
    });
}

// 查看礼品票据详情
function viewReceiptDetail(unitId) {
    const receipt = giftReceiptData.find(r => r.unitId === unitId);
    if (!receipt) {
        Toast.error('未找到票据信息');
        return;
    }

    // 构建风险等级徽章
    let riskBadge = '';
    if (receipt.risk === 'high') {
        riskBadge = '<span class="badge badge-danger">高风险</span>';
    } else if (receipt.risk === 'medium') {
        riskBadge = '<span class="badge badge-warning">中风险</span>';
    } else {
        riskBadge = '<span class="badge badge-info">低风险</span>';
    }

    // 构建采购明细表格
    const itemsHtml = `
        <table class="data-table" style="width: 100%; margin-top: 8px;">
            <thead>
                <tr>
                    <th>物品名称</th>
                    <th>数量</th>
                    <th>单价</th>
                    <th>小计</th>
                </tr>
            </thead>
            <tbody>
                ${receipt.items.map(item => `
                    <tr>
                        <td>${item.name}</td>
                        <td>${item.quantity}</td>
                        <td>¥${formatNumber(item.unitPrice)}</td>
                        <td style="color: #DC2626; font-weight: 600;">¥${formatNumber(item.total)}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;

    // 构建证据列表
    const evidenceHtml = `
        <div style="background: #FEF2F2; padding: 16px; border-radius: 8px; border-left: 4px solid #DC2626; margin-top: 16px;">
            <h4 style="margin: 0 0 12px 0; color: #991B1B; font-size: 15px; font-weight: 600;">
                <i class="fas fa-exclamation-triangle"></i> 违规证据
            </h4>
            <ul style="margin: 0; padding-left: 20px; color: #991B1B; font-size: 14px; line-height: 2;">
                ${receipt.evidence.map(ev => `<li><strong>${ev}</strong></li>`).join('')}
            </ul>
            <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid #FEE2E2;">
                <p style="margin: 0; color: #991B1B; font-size: 13px;">
                    <strong>处理建议：</strong>${receipt.suggestedAction}
                </p>
            </div>
        </div>
    `;

    showDetailModal('礼品票据详情', `${receipt.person} - ${receipt.content}`, {
        '采购信息': {
            '采购人': receipt.person,
            '所属单位': receipt.unit,
            '采购内容': receipt.content,
            '采购日期': receipt.date,
            '采购金额': `<span style="color: #DC2626; font-weight: 600;">¥${formatNumber(receipt.amount)}</span>`
        },
        '商家信息': {
            '商家名称': receipt.merchant,
            '商家地址': receipt.merchantAddress,
            '发票号码': receipt.invoiceNo,
            '违规原因': `<span style="color: #DC2626; font-weight: 600;">${receipt.reason}</span>`,
            '风险等级': riskBadge
        },
        '采购明细': itemsHtml,
        '违规证据与建议': evidenceHtml
    });
}


// ==================== 师德师风监督模块 ====================

// 加载师德师风监督模块
function loadTeacherEthicsModule() {
    loadTeacherEthicsWarning();
    loadAcademicMisconductDetection();
    loadIllegalTutoringMonitoring();
}

// 加载师德预警
function loadTeacherEthicsWarning() {
    const tbody = document.querySelector('#teacherEthicsTable tbody');
    if (!tbody) return;

    tbody.innerHTML = teacherEthicsWarningData.map(item => {
        let levelBadge = '';
        if (item.warningLevel === 'high') {
            levelBadge = '<span class="badge badge-danger">高风险</span>';
        } else if (item.warningLevel === 'medium') {
            levelBadge = '<span class="badge badge-warning">中风险</span>';
        } else {
            levelBadge = '<span class="badge badge-info">低风险</span>';
        }

        return `
            <tr>
                <td class="font-medium text-gray-900">${item.teacher}</td>
                <td>${item.college}</td>
                <td>${item.warningType}</td>
                <td>${item.score}</td>
                <td>${item.reportCount}</td>
                <td>${levelBadge}</td>
                <td>${item.date}</td>
                <td>
                    <button class="action-btn action-btn-primary" onclick="viewTeacherWarningDetail('${item.teacherId}')">
                        <i class="fas fa-eye"></i> 查看
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

// 加载学术不端检测
function loadAcademicMisconductDetection() {
    const tbody = document.querySelector('#academicMisconductTable tbody');
    if (!tbody) return;

    tbody.innerHTML = academicMisconductData.map(item => `
        <tr>
            <td class="font-medium text-gray-900">${item.teacher}</td>
            <td>${item.college}</td>
            <td>${item.paper}</td>
            <td>${item.type}</td>
            <td class="${item.similarity > 30 ? 'text-red-600' : item.similarity > 15 ? 'text-yellow-600' : 'text-green-600'} font-medium">
                ${item.similarity}%
            </td>
            <td>
                <span class="risk-badge ${item.risk}">
                    ${item.risk === 'high' ? '高风险' : item.risk === 'medium' ? '中风险' : '低风险'}
                </span>
            </td>
            <td>
                <button class="action-btn action-btn-primary" onclick="viewAcademicMisconductDetail('${item.teacherId}')">
                    <i class="fas fa-search"></i> 详情
                </button>
            </td>
        </tr>
    `).join('');
}

// 加载违规补课监控
function loadIllegalTutoringMonitoring() {
    const tbody = document.querySelector('#illegalTutoringTable tbody');
    if (!tbody) return;

    tbody.innerHTML = illegalTutoringData.map(item => `
        <tr>
            <td class="font-medium text-gray-900">${item.teacher}</td>
            <td>${item.college}</td>
            <td>${item.institution}</td>
            <td>${item.subject}</td>
            <td>${item.students}人</td>
            <td class="font-medium">¥${formatNumber(item.totalIncome)}</td>
            <td>
                <span class="risk-badge ${item.risk}">
                    ${item.risk === 'high' ? '高风险' : item.risk === 'medium' ? '中风险' : '低风险'}
                </span>
            </td>
            <td>
                <button class="action-btn action-btn-primary" onclick="viewTutoringDetail('${item.teacherId}')">
                    <i class="fas fa-search"></i> 核查
                </button>
            </td>
        </tr>
    `).join('');
}

// 查看师德预警详情
function viewTeacherWarningDetail(teacherId) {
    const teacher = teacherEthicsWarningData.find(t => t.teacherId === teacherId);
    if (!teacher) {
        Toast.error('未找到教师信息');
        return;
    }

    let levelBadge = '';
    if (teacher.warningLevel === 'high') {
        levelBadge = '<span class="badge badge-danger">高风险</span>';
    } else if (teacher.warningLevel === 'medium') {
        levelBadge = '<span class="badge badge-warning">中风险</span>';
    } else {
        levelBadge = '<span class="badge badge-info">低风险</span>';
    }

    const sourcesHtml = `
        <table class="data-table" style="width: 100%; margin-top: 8px;">
            <thead>
                <tr>
                    <th>数据来源</th>
                    <th>评分/内容</th>
                    <th>具体反馈</th>
                </tr>
            </thead>
            <tbody>
                ${teacher.sources.map(source => `
                    <tr>
                        <td>${source.type}</td>
                        <td>${source.score !== undefined ? source.score + '分' : '-'}</td>
                        <td style="color: #DC2626;">${source.feedback || source.content}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;

    const issuesHtml = `
        <div style="background: #FEF2F2; padding: 16px; border-radius: 8px; border-left: 4px solid #DC2626; margin-top: 16px;">
            <h4 style="margin: 0 0 12px 0; color: #991B1B; font-size: 15px; font-weight: 600;">
                <i class="fas fa-exclamation-triangle"></i> 发现的问题
            </h4>
            <ul style="margin: 0; padding-left: 20px; color: #991B1B; font-size: 14px; line-height: 2;">
                ${teacher.issues.map(issue => `<li><strong>${issue}</strong></li>`).join('')}
            </ul>
            <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid #FEE2E2;">
                <p style="margin: 0; color: #991B1B; font-size: 13px;">
                    <strong>处理建议：</strong>${teacher.suggestedAction}
                </p>
            </div>
        </div>
    `;

    showDetailModal('师德师风预警详情', `${teacher.fullName} - ${teacher.warningType}`, {
        '教师信息': {
            '姓名': teacher.fullName,
            '所属学院': teacher.college,
            '职务': teacher.position,
            '预警类型': teacher.warningType,
            '预警日期': teacher.date
        },
        '预警评估': {
            '综合评分': `<span style="color: ${teacher.score < 3 ? '#DC2626' : teacher.score < 4 ? '#D97706' : '#059669'}; font-weight: 600;">${teacher.score}分</span>`,
            '举报次数': `${teacher.reportCount}次`,
            '风险等级': levelBadge
        },
        '数据来源': sourcesHtml,
        '问题与建议': issuesHtml
    });
}

// 查看学术不端详情
function viewAcademicMisconductDetail(teacherId) {
    const misconduct = academicMisconductData.find(m => m.teacherId === teacherId);
    if (!misconduct) {
        Toast.error('未找到学术不端信息');
        return;
    }

    let riskBadge = '';
    if (misconduct.risk === 'high') {
        riskBadge = '<span class="badge badge-danger">高风险</span>';
    } else if (misconduct.risk === 'medium') {
        riskBadge = '<span class="badge badge-warning">中风险</span>';
    } else {
        riskBadge = '<span class="badge badge-info">低风险</span>';
    }

    let detailsHtml = '';
    if (misconduct.type === '论文抄袭') {
        detailsHtml = `
            <div style="margin-top: 8px;">
                <p style="margin: 8px 0; color: #374151; font-size: 14px;">
                    <strong>论文总页数：</strong>${misconduct.details.totalPages}页
                </p>
                <p style="margin: 8px 0; color: #374151; font-size: 14px;">
                    <strong>抄袭页数：</strong><span style="color: #DC2626; font-weight: 600;">${misconduct.details.plagiarizedPages}页</span>
                </p>
                <p style="margin: 8px 0; color: #374151; font-size: 14px;">
                    <strong>主要来源：</strong>
                </p>
                <ul style="margin: 0; padding-left: 20px; color: #374151; font-size: 13px; line-height: 1.8;">
                    ${misconduct.details.originalSources.map(source => `<li>${source}</li>`).join('')}
                </ul>
            </div>
        `;
    } else if (misconduct.type === '数据造假') {
        detailsHtml = `
            <div style="margin-top: 8px;">
                <p style="margin: 8px 0; color: #374151; font-size: 14px;">
                    <strong>论文总页数：</strong>${misconduct.details.totalPages}页
                </p>
                <p style="margin: 8px 0; color: #374151; font-size: 14px;">
                    <strong>可疑数据：</strong><span style="color: #DC2626; font-weight: 600;">${misconduct.details.suspiciousData}处</span>
                </p>
            </div>
        `;
    } else if (misconduct.type === '一稿多投') {
        detailsHtml = `
            <div style="margin-top: 8px;">
                <p style="margin: 8px 0; color: #374151; font-size: 14px;">
                    <strong>投稿期刊：</strong>
                </p>
                <ul style="margin: 0; padding-left: 20px; color: #DC2626; font-size: 13px; line-height: 1.8; font-weight: 600;">
                    ${misconduct.details.submittedJournals.map(journal => `<li>${journal}</li>`).join('')}
                </ul>
            </div>
        `;
    } else if (misconduct.type === '署名争议') {
        detailsHtml = `
            <div style="margin-top: 8px;">
                <p style="margin: 8px 0; color: #374151; font-size: 14px;">
                    <strong>争议作者：</strong>
                </p>
                <ul style="margin: 0; padding-left: 20px; color: #DC2626; font-size: 13px; line-height: 1.8; font-weight: 600;">
                    ${misconduct.details.disputedAuthors.map(author => `<li>${author}</li>`).join('')}
                </ul>
            </div>
        `;
    }

    const evidenceHtml = `
        <div style="background: #FEF2F2; padding: 16px; border-radius: 8px; border-left: 4px solid #DC2626; margin-top: 16px;">
            <h4 style="margin: 0 0 12px 0; color: #991B1B; font-size: 15px; font-weight: 600;">
                <i class="fas fa-exclamation-triangle"></i> 违规证据
            </h4>
            <ul style="margin: 0; padding-left: 20px; color: #991B1B; font-size: 14px; line-height: 2;">
                ${misconduct.evidence.map(ev => `<li><strong>${ev}</strong></li>`).join('')}
            </ul>
            <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid #FEE2E2;">
                <p style="margin: 0; color: #991B1B; font-size: 13px;">
                    <strong>处理建议：</strong>${misconduct.suggestedAction}
                </p>
            </div>
        </div>
    `;

    showDetailModal('学术不端检测详情', `${misconduct.fullName} - ${misconduct.paper}`, {
        '教师信息': {
            '姓名': misconduct.fullName,
            '所属学院': misconduct.college,
            '检测日期': misconduct.date
        },
        '论文信息': {
            '论文题目': misconduct.paper,
            '发表期刊': misconduct.journal,
            '不端类型': misconduct.type,
            '相似度': `<span style="color: ${misconduct.similarity > 30 ? '#DC2626' : misconduct.similarity > 15 ? '#D97706' : '#059669'}; font-weight: 600;">${misconduct.similarity}%</span>`,
            '风险等级': riskBadge
        },
        '详细信息': detailsHtml,
        '证据与建议': evidenceHtml
    });
}

// 查看违规补课详情
function viewTutoringDetail(teacherId) {
    const tutoring = illegalTutoringData.find(t => t.teacherId === teacherId);
    if (!tutoring) {
        Toast.error('未找到补课信息');
        return;
    }

    let riskBadge = '';
    if (tutoring.risk === 'high') {
        riskBadge = '<span class="badge badge-danger">高风险</span>';
    } else if (tutoring.risk === 'medium') {
        riskBadge = '<span class="badge badge-warning">中风险</span>';
    } else {
        riskBadge = '<span class="badge badge-info">低风险</span>';
    }

    const evidenceHtml = `
        <div style="background: #FEF2F2; padding: 16px; border-radius: 8px; border-left: 4px solid #DC2626; margin-top: 16px;">
            <h4 style="margin: 0 0 12px 0; color: #991B1B; font-size: 15px; font-weight: 600;">
                <i class="fas fa-exclamation-triangle"></i> 违规证据
            </h4>
            <ul style="margin: 0; padding-left: 20px; color: #991B1B; font-size: 14px; line-height: 2;">
                ${tutoring.evidence.map(ev => `<li><strong>${ev}</strong></li>`).join('')}
            </ul>
            <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid #FEE2E2;">
                <p style="margin: 0; color: #991B1B; font-size: 13px;">
                    <strong>处理建议：</strong>${tutoring.suggestedAction}
                </p>
            </div>
        </div>
    `;

    showDetailModal('违规补课详情', `${tutoring.fullName} - ${tutoring.institution}`, {
        '教师信息': {
            '姓名': tutoring.fullName,
            '所属学院': tutoring.college,
            '补课期间': tutoring.period
        },
        '补课信息': {
            '培训机构': tutoring.institution,
            '机构地址': tutoring.institutionAddress,
            '补课科目': tutoring.subject,
            '学生人数': `${tutoring.students}人`,
            '收费标准': `¥${tutoring.fee}/小时`,
            '违规收入': `<span style="color: #DC2626; font-weight: 600;">¥${formatNumber(tutoring.totalIncome)}</span>`,
            '风险等级': riskBadge
        },
        '调查情况': {
            '举报来源': tutoring.reportSource,
            '调查结果': tutoring.investigationResult
        },
        '违规证据与建议': evidenceHtml
    });
}

// ==================== 三重一大监督模块 ====================

// 加载三重一大监督模块
function loadThreeMajorModule() {
    loadMajorIssueIdentification();
    loadDecisionProcessCheck();
    loadMinutesMatching();
}

// 加载重大事项识别
function loadMajorIssueIdentification() {
    const tbody = document.querySelector('#majorIssueTable tbody');
    if (!tbody) return;

    tbody.innerHTML = majorIssuesData.map(item => `
        <tr>
            <td class="font-medium text-gray-900">${item.issue}</td>
            <td>${item.type}</td>
            <td>${item.amount > 0 ? '¥' + formatNumber(item.amount) : '-'}</td>
            <td>${item.unit}</td>
            <td>${item.date}</td>
            <td>
                <span class="${item.status === '已决策' ? 'text-green-600' : 'text-yellow-600'}">
                    ${item.status}
                </span>
            </td>
            <td>
                <button class="action-btn action-btn-primary" onclick="viewIssueDetail('${item.issueId}')">
                    <i class="fas fa-eye"></i> 查看
                </button>
            </td>
        </tr>
    `).join('');
}

// 加载决策过程完整性检查
function loadDecisionProcessCheck() {
    const tbody = document.querySelector('#decisionProcessTable tbody');
    if (!tbody) return;

    tbody.innerHTML = decisionProcessData.map(item => {
        const checkIcon = (status) => status ? '<i class="fas fa-check-circle text-green-600"></i>' : '<i class="fas fa-times-circle text-red-600"></i>';

        return `
            <tr>
                <td class="font-medium text-gray-900">${item.issue}</td>
                <td class="text-center">${checkIcon(item.research)}</td>
                <td class="text-center">${checkIcon(item.expert)}</td>
                <td class="text-center">${checkIcon(item.risk)}</td>
                <td class="text-center">${checkIcon(item.collective)}</td>
                <td>
                    <div class="flex items-center gap-2">
                        <div class="flex-1 bg-gray-200 rounded-full h-2">
                            <div class="bg-blue-600 h-2 rounded-full" style="width: ${item.completeness}%"></div>
                        </div>
                        <span class="text-sm">${item.completeness}%</span>
                    </div>
                </td>
                <td>
                    <span class="risk-badge ${item.riskLevel}">
                        ${item.riskLevel === 'high' ? '高风险' : item.riskLevel === 'medium' ? '中风险' : '低风险'}
                    </span>
                </td>
                <td>
                    <button class="action-btn action-btn-primary" onclick="viewProcessDetail('${item.issueId}')">
                        <i class="fas fa-search"></i> 核查
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

// 加载会议纪要匹配校验
function loadMinutesMatching() {
    const tbody = document.querySelector('#minutesMatchTable tbody');
    if (!tbody) return;

    tbody.innerHTML = minutesMatchData.map(item => {
        let statusClass = 'text-green-600';
        if (item.status === '未匹配') statusClass = 'text-red-600';
        else if (item.status === '会议级别不符') statusClass = 'text-yellow-600';

        return `
            <tr>
                <td class="font-medium text-gray-900">${item.issue}</td>
                <td>${item.expected}</td>
                <td>${item.actual}</td>
                <td class="${statusClass} font-medium">${item.status}</td>
                <td>${item.time}</td>
                <td>
                    <span class="risk-badge ${item.risk}">
                        ${item.risk === 'high' ? '高风险' : item.risk === 'medium' ? '中风险' : '低风险'}
                    </span>
                </td>
                <td>
                    <button class="action-btn action-btn-primary" onclick="viewMinutesMatchDetail('${item.issueId}')">
                        <i class="fas fa-file-alt"></i> 查看
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

// ==================== 详情函数 ====================

// 查看重大事项详情
function viewIssueDetail(issueId) {
    const issue = majorIssuesData.find(i => i.issueId === issueId);
    if (!issue) {
        Toast.error('未找到事项信息');
        return;
    }

    showDetailModal('重大事项详情', issue.issue, {
        '事项信息': {
            '事项名称': issue.issue,
            '事项类型': issue.type,
            '涉及金额': issue.amount > 0 ? `¥${formatNumber(issue.amount)}` : '-',
            '责任单位': issue.unit
        },
        '决策情况': {
            '决策时间': issue.date,
            '决策会议': issue.meetingType,
            '决策状态': `<span class="${issue.status === '已决策' ? 'text-green-600' : 'text-yellow-600'}">${issue.status}</span>`,
            '表决结果': issue.voteResult
        },
        '事项概述': issue.overview,
        '决策依据': issue.basis
    });
}

// 查看决策过程详情
function viewProcessDetail(issueId) {
    const process = decisionProcessData.find(p => p.issueId === issueId);
    if (!process) {
        Toast.error('未找到决策过程信息');
        return;
    }

    // 构建风险等级徽章
    let riskBadge = '';
    if (process.riskLevel === 'high') {
        riskBadge = '<span class="badge badge-danger">高风险</span>';
    } else if (process.riskLevel === 'medium') {
        riskBadge = '<span class="badge badge-warning">中风险</span>';
    } else {
        riskBadge = '<span class="badge badge-info">低风险</span>';
    }

    // 构建程序表格
    const proceduresHtml = `
        <table class="data-table" style="width: 100%; margin-top: 8px;">
            <thead>
                <tr>
                    <th>程序环节</th>
                    <th>完成情况</th>
                    <th>完成时间</th>
                    <th>备注</th>
                </tr>
            </thead>
            <tbody>
                ${process.procedures.map(proc => `
                    <tr>
                        <td>${proc.name}</td>
                        <td>${proc.completed ? '<i class="fas fa-check-circle text-green-600"></i> 已完成' : '<i class="fas fa-times-circle text-red-600"></i> 未完成'}</td>
                        <td>${proc.date}</td>
                        <td>${proc.note}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;

    // 构建问题清单
    let issuesHtml = '';
    if (process.issues.length > 0) {
        issuesHtml = `
            <div style="background: #FEF2F2; padding: 16px; border-radius: 8px; border-left: 4px solid #DC2626; margin-top: 16px;">
                <h4 style="margin: 0 0 12px 0; color: #991B1B; font-size: 15px; font-weight: 600;">
                    <i class="fas fa-exclamation-triangle"></i> 发现的问题
                </h4>
                <ul style="margin: 0; padding-left: 20px; color: #991B1B; font-size: 14px; line-height: 2;">
                    ${process.issues.map(issue => `<li><strong>${issue}</strong></li>`).join('')}
                </ul>
            </div>
        `;
    } else {
        issuesHtml = '<p style="color: #059669; margin-top: 16px;"><i class="fas fa-check-circle"></i> 决策程序完整，未发现问题</p>';
    }

    showDetailModal('决策过程完整性详情', process.issue, {
        '事项信息': {
            '事项名称': process.issue,
            '完整性评分': `${process.completeness}%`,
            '风险等级': riskBadge
        },
        '程序完成情况': {
            '调查研究': process.research ? '<i class="fas fa-check-circle text-green-600"></i> 已完成' : '<i class="fas fa-times-circle text-red-600"></i> 未完成',
            '专家论证': process.expert ? '<i class="fas fa-check-circle text-green-600"></i> 已完成' : '<i class="fas fa-times-circle text-red-600"></i> 未完成',
            '风险评估': process.risk ? '<i class="fas fa-check-circle text-green-600"></i> 已完成' : '<i class="fas fa-times-circle text-red-600"></i> 未完成',
            '集体决策': process.collective ? '<i class="fas fa-check-circle text-green-600"></i> 已完成' : '<i class="fas fa-times-circle text-red-600"></i> 未完成'
        },
        '详细程序': proceduresHtml,
        '问题与建议': issuesHtml
    });
}

// 查看会议纪要匹配详情
function viewMinutesMatchDetail(issueId) {
    const match = minutesMatchData.find(m => m.issueId === issueId);
    if (!match) {
        Toast.error('未找到会议纪要信息');
        return;
    }

    // 构建风险等级徽章
    let riskBadge = '';
    if (match.risk === 'high') {
        riskBadge = '<span class="badge badge-danger">高风险</span>';
    } else if (match.risk === 'medium') {
        riskBadge = '<span class="badge badge-warning">中风险</span>';
    } else {
        riskBadge = '<span class="badge badge-info">低风险</span>';
    }

    // 构建匹配状态
    let statusBadge = '';
    if (match.status === '匹配') {
        statusBadge = '<span class="badge badge-success">匹配</span>';
    } else if (match.status === '未匹配') {
        statusBadge = '<span class="badge badge-danger">未匹配</span>';
    } else {
        statusBadge = '<span class="badge badge-warning">会议级别不符</span>';
    }

    // 构建参会人员列表
    let participantsHtml = '';
    if (match.participants.length > 0) {
        participantsHtml = `
            <div style="margin-top: 8px;">
                <p style="margin: 8px 0; color: #374151; font-size: 14px;">
                    <strong>参会人员：</strong>
                </p>
                <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px;">
                    ${match.participants.map(p => `<span style="background: #EFF6FF; color: #1E40AF; padding: 4px 12px; border-radius: 12px; font-size: 13px;">${p}</span>`).join('')}
                </div>
            </div>
        `;
    } else {
        participantsHtml = '<p style="color: #DC2626; margin-top: 8px;">未找到会议记录</p>';
    }

    // 构建会议要点
    let keyPointsHtml = '';
    if (match.keyPoints.length > 0) {
        keyPointsHtml = `
            <div style="margin-top: 8px;">
                <p style="margin: 8px 0; color: #374151; font-size: 14px;">
                    <strong>会议要点：</strong>
                </p>
                <ul style="margin: 0; padding-left: 20px; color: #374151; font-size: 13px; line-height: 1.8;">
                    ${match.keyPoints.map(point => `<li>${point}</li>`).join('')}
                </ul>
            </div>
        `;
    }

    // 构建决策内容
    let decisionsHtml = '';
    if (match.decisions.length > 0) {
        decisionsHtml = `
            <div style="margin-top: 8px;">
                <p style="margin: 8px 0; color: #374151; font-size: 14px;">
                    <strong>决策内容：</strong>
                </p>
                <ul style="margin: 0; padding-left: 20px; color: #059669; font-size: 13px; line-height: 1.8; font-weight: 600;">
                    ${match.decisions.map(decision => `<li>${decision}</li>`).join('')}
                </ul>
            </div>
        `;
    }

    // 构建问题清单
    let issuesHtml = '';
    if (match.issues && match.issues.length > 0) {
        issuesHtml = `
            <div style="background: #FEF2F2; padding: 16px; border-radius: 8px; border-left: 4px solid #DC2626; margin-top: 16px;">
                <h4 style="margin: 0 0 12px 0; color: #991B1B; font-size: 15px; font-weight: 600;">
                    <i class="fas fa-exclamation-triangle"></i> 发现的问题
                </h4>
                <ul style="margin: 0; padding-left: 20px; color: #991B1B; font-size: 14px; line-height: 2;">
                    ${match.issues.map(issue => `<li><strong>${issue}</strong></li>`).join('')}
                </ul>
            </div>
        `;
    } else {
        issuesHtml = '<p style="color: #059669; margin-top: 16px;"><i class="fas fa-check-circle"></i> 会议纪要匹配正常，未发现问题</p>';
    }

    showDetailModal('会议纪要匹配详情', match.issue, {
        '匹配信息': {
            '事项名称': match.issue,
            '应开会议': match.expected,
            '实际会议': match.actual,
            '匹配状态': statusBadge,
            '会议时间': match.time,
            '风险等级': riskBadge
        },
        '会议信息': {
            '会议编号': match.meetingNo || '-',
            '会议日期': match.meetingDate || '-'
        },
        '参会人员': participantsHtml,
        '会议要点': keyPointsHtml,
        '决策内容': decisionsHtml,
        '问题与建议': issuesHtml
    });
}


// 通用详情展示函数
function showDetailModal(title, subtitle, sections) {
    let content = '<div class="detail-content">';

    for (const [sectionTitle, sectionData] of Object.entries(sections)) {
        if (typeof sectionData === 'string') {
            // 检查是否是HTML内容（包含标签）
            const isHtml = /<[a-z][\s\S]*>/i.test(sectionData);

            if (isHtml) {
                // 如果是HTML内容，直接插入，不包装在<p>标签中
                content += `
                    <div class="detail-section">
                        <h4 class="detail-section-title">${sectionTitle}</h4>
                        <div class="detail-text">
                            ${sectionData}
                        </div>
                    </div>
                `;
            } else {
                // 如果是纯文本，包装在<p>标签中
                content += `
                    <div class="detail-section">
                        <h4 class="detail-section-title">${sectionTitle}</h4>
                        <div class="detail-text">
                            <p>${sectionData.replace(/\n/g, '<br>')}</p>
                        </div>
                    </div>
                `;
            }
        } else {
            content += `
                <div class="detail-section">
                    <h4 class="detail-section-title">${sectionTitle}</h4>
                    <div class="detail-grid">
            `;
            for (const [key, value] of Object.entries(sectionData)) {
                content += `
                    <div class="detail-item">
                        <label>${key}</label>
                        <p>${value}</p>
                    </div>
                `;
            }
            content += `
                    </div>
                </div>
            `;
        }
    }

    content += '</div>';

    Modal.show({
        title: title,
        content: content,
        size: 'lg',
        buttons: [
            { text: '关闭', type: 'default', onClick: () => Modal.hide() }
        ]
    });
}

// 工具函数：格式化数字
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// 工具函数：格式化日期
function formatDate(dateStr) {
    const date = new Date(dateStr);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
