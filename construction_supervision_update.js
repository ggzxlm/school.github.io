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
