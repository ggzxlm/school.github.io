// ==================== 师德师风监督模块 ====================

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
        issues: [
            '课堂言论不当，传播负面情绪',
            '对学生态度恶劣，存在歧视行为',
            '多次收到学生投诉'
        ],
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
        issues: [
            '论文存在抄袭嫌疑',
            '数据造假问题',
            '一稿多投违规'
        ],
        sources: [
            { type: '学术检测', score: 0, feedback: '论文查重率达到45%，存在大段抄袭' },
            { type: '同行举报', content: '实验数据存在造假嫌疑，无法重现' },
            { type: '期刊反馈', content: '同一篇文章投稿多个期刊' }
        ],
        suggestedAction: '暂停其学术活动，成立调查组进行深入调查，如属实将给予严厉处分'
    }
];

// 继续添加更多师德预警数据
teacherEthicsWarningData.push(
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
        issues: [
            '校外有偿补课',
            '利用职务便利推荐学生参加培训班'
        ],
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
        issues: [
            '课堂管理不当',
            '对学生缺乏耐心'
        ],
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
        issues: [
            '论文署名不规范'
        ],
        sources: [
            { type: '期刊编辑', content: '论文作者署名顺序存在争议' }
        ],
        suggestedAction: '进行学术规范教育，规范论文署名行为'
    }
);

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
            originalSources: [
                '《数值分析方法》- 张三著',
                '《微分方程理论》- 李四著',
                '国外期刊论文3篇'
            ]
        },
        evidence: [
            '第3-7页内容与参考文献高度相似',
            '核心算法部分完全照搬他人成果',
            '未标注引用来源',
            '查重系统检测相似度达45%'
        ],
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
        details: {
            totalPages: 15,
            suspiciousData: 8,
            originalSources: []
        },
        evidence: [
            '实验数据过于完美，缺乏合理的误差范围',
            '部分图表数据无法通过重复实验验证',
            '统计分析结果存在明显异常',
            '实验记录不完整，缺少原始数据'
        ],
        suggestedAction: '立即暂停相关研究项目，成立调查组核实数据真实性'
    }
];

academicMisconductData.push(
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
        details: {
            totalPages: 20,
            submittedJournals: [
                '经济研究',
                '经济学季刊',
                '金融研究'
            ]
        },
        evidence: [
            '同一篇论文同时投稿3个期刊',
            '未告知编辑部多投情况',
            '违反学术期刊投稿规定'
        ],
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
        details: {
            totalPages: 10,
            disputedAuthors: [
                '郑某某（第一作者）',
                '钱某某（声称应为第一作者）'
            ]
        },
        evidence: [
            '合作者对署名顺序存在异议',
            '贡献度分配不明确',
            '缺少署名协议'
        ],
        suggestedAction: '协调解决署名争议，建立规范的合作协议制度'
    }
);

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
        evidence: [
            '在校外培训机构任教',
            '教授本校学生，存在利益冲突',
            '收费标准较高，每小时200元',
            '累计违规收入4.5万元'
        ],
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
        evidence: [
            '长期在校外机构兼职',
            '利用职务便利推荐学生',
            '影响正常教学工作',
            '违规收入较大'
        ],
        reportSource: '同事举报',
        investigationResult: '调查中',
        suggestedAction: '暂停教学工作，深入调查违规情况，依规严肃处理'
    }
];

illegalTutoringData.push(
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
        evidence: [
            '私人开设培训班',
            '学生主要为本校学生',
            '收费相对较低但仍属违规'
        ],
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
        evidence: [
            '在居民区开设辅导班',
            '主要面向高考学生',
            '收费标准适中但违反规定'
        ],
        reportSource: '匿名举报',
        investigationResult: '正在核实',
        suggestedAction: '核实情况后依规处理，加强师德教育'
    }
);

// ==================== 加载函数 ====================

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

// ==================== 详情函数 ====================

// 查看师德预警详情
function viewTeacherWarningDetail(teacherId) {
    const teacher = teacherEthicsWarningData.find(t => t.teacherId === teacherId);
    if (!teacher) {
        Toast.error('未找到教师信息');
        return;
    }
    
    // 构建风险等级徽章
    let levelBadge = '';
    if (teacher.warningLevel === 'high') {
        levelBadge = '<span class="badge badge-danger">高风险</span>';
    } else if (teacher.warningLevel === 'medium') {
        levelBadge = '<span class="badge badge-warning">中风险</span>';
    } else {
        levelBadge = '<span class="badge badge-info">低风险</span>';
    }
    
    // 构建数据来源表格
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
    
    // 构建问题清单
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
    
    // 构建风险等级徽章
    let riskBadge = '';
    if (misconduct.risk === 'high') {
        riskBadge = '<span class="badge badge-danger">高风险</span>';
    } else if (misconduct.risk === 'medium') {
        riskBadge = '<span class="badge badge-warning">中风险</span>';
    } else {
        riskBadge = '<span class="badge badge-info">低风险</span>';
    }
    
    // 构建详细信息
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
    
    // 构建证据列表
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
    
    // 构建风险等级徽章
    let riskBadge = '';
    if (tutoring.risk === 'high') {
        riskBadge = '<span class="badge badge-danger">高风险</span>';
    } else if (tutoring.risk === 'medium') {
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
