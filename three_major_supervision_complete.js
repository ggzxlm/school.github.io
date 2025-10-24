// ==================== 三重一大监督模块 ====================

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
        keyPoints: [
            '审议通过新校区建设总体规划',
            '确定建设规模和投资预算',
            '明确建设时间表和责任分工',
            '要求严格按照程序推进项目实施'
        ],
        decisions: [
            '同意启动新校区建设项目',
            '批准项目可行性研究报告',
            '成立新校区建设领导小组',
            '授权基建处开展前期工作'
        ]
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
        keyPoints: [
            '审议科研平台建设方案',
            '讨论投资预算和资金来源',
            '明确建设进度和验收标准'
        ],
        decisions: [
            '原则同意科研平台建设方案',
            '批准8000万元建设预算',
            '要求科研处制定详细实施方案'
        ]
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
        keyPoints: [
            '讨论院系调整方案',
            '听取各方意见',
            '初步形成调整意见'
        ],
        decisions: [
            '原则同意调整方向',
            '要求进一步完善方案',
            '提交党委全委会审议'
        ],
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
        keyPoints: [
            '审议大型设备采购方案',
            '讨论设备技术参数和采购方式',
            '明确采购程序和监督机制'
        ],
        decisions: [
            '同意采购方案',
            '批准2500万元采购预算',
            '要求严格按照政府采购程序执行'
        ]
    }
];

// ==================== 加载函数 ====================

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
