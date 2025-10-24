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
