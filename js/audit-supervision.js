/**
 * 审计监督页面脚本
 */

// 页面初始化
document.addEventListener('DOMContentLoaded', function () {
    initializePage();
    setupNavigation();
    loadModuleFromURL();
});

/**
 * 初始化页面
 */
function initializePage() {
    // 加载演示数据
    loadDemoData();
}

/**
 * 设置导航
 */
function setupNavigation() {
    const navItems = document.querySelectorAll('.supervision-nav-item');

    navItems.forEach(item => {
        item.addEventListener('click', function (e) {
            e.preventDefault();

            // 更新导航状态
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');

            // 显示对应内容
            const module = this.dataset.module;
            showModule(module);

            // 更新URL
            window.history.pushState({}, '', `?type=${module}`);
        });
    });
}

/**
 * 从URL加载模块
 */
function loadModuleFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const type = urlParams.get('type');

    if (type) {
        showModule(type);

        // 更新导航状态
        const navItems = document.querySelectorAll('.supervision-nav-item');
        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.dataset.module === type) {
                item.classList.add('active');
            }
        });
    }
}

/**
 * 显示指定模块
 */
function showModule(module) {
    // 隐藏所有内容
    const contents = document.querySelectorAll('.supervision-content');
    contents.forEach(content => content.classList.remove('active'));

    // 显示指定内容
    const targetContent = document.getElementById(`${module}-content`);
    if (targetContent) {
        targetContent.classList.add('active');
    }
}

/**
 * 加载演示数据
 */
function loadDemoData() {
    loadBudgetData();
    loadResearchData();
    loadProcurementData();
    loadAssetsData();
    loadEnrollmentData();
    loadProjectData();
    loadSalaryData();
    loadITData();
}

/**
 * 加载预算执行数据
 */
function loadBudgetData() {
    const data = [
        { department: '化学学院', budget: 4200000, executed: 4410000, rate: 105.0, issueType: 'over_budget', status: 'danger' },
        { department: '经济学院', budget: 3800000, executed: 3990000, rate: 105.0, issueType: 'over_budget', status: 'danger' },
        { department: '物理学院', budget: 4500000, executed: 3150000, rate: 70.0, issueType: 'low_execution', status: 'warning' },
        { department: '生命科学学院', budget: 3600000, executed: 2520000, rate: 70.0, issueType: 'low_execution', status: 'warning' },
        { department: '计算机学院', budget: 5200000, executed: 5356000, rate: 103.0, issueType: 'unauthorized_adjustment', status: 'danger' },
        { department: '外国语学院', budget: 2800000, executed: 2940000, rate: 105.0, issueType: 'over_budget', status: 'danger' },
        { department: '数学学院', budget: 3200000, executed: 2080000, rate: 65.0, issueType: 'low_execution', status: 'warning' },
        { department: '历史学院', budget: 2500000, executed: 2625000, rate: 105.0, issueType: 'year_end_spending', status: 'danger' }
    ];

    const tbody = document.getElementById('budgetTableBody');
    tbody.innerHTML = data.map(item => {
        let issueLabel = '';
        let issueColor = 'danger';

        if (item.issueType === 'over_budget') {
            issueLabel = '预算超支';
            issueColor = 'danger';
        } else if (item.issueType === 'low_execution') {
            issueLabel = '执行偏低';
            issueColor = 'warning';
        } else if (item.issueType === 'unauthorized_adjustment') {
            issueLabel = '擅自调整';
            issueColor = 'danger';
        } else if (item.issueType === 'year_end_spending') {
            issueLabel = '年底突击花钱';
            issueColor = 'danger';
        }

        return `
        <tr>
            <td>${item.department}</td>
            <td>¥${(item.budget / 10000).toFixed(2)}万</td>
            <td style="color: ${item.rate > 100 ? '#DC2626' : item.rate < 75 ? '#D97706' : '#6B7280'}; font-weight: ${item.rate > 100 || item.rate < 75 ? '600' : 'normal'};">
                ¥${(item.executed / 10000).toFixed(2)}万
            </td>
            <td style="color: ${item.rate > 100 ? '#DC2626' : item.rate < 75 ? '#D97706' : '#059669'}; font-weight: ${item.rate > 100 || item.rate < 75 ? '600' : 'normal'};">
                ${item.rate}%
            </td>
            <td><span class="badge badge-${issueColor}">${issueLabel}</span></td>
            <td>
                <button type="button" class="btn-action" onclick="viewDetail('budget', '${item.department}'); return false;">
                    <i class="fas fa-exclamation-triangle" style="color: ${item.status === 'danger' ? '#DC2626' : '#D97706'}; margin-right: 4px;"></i>
                    查看详情
                </button>
            </td>
        </tr>
    `;
    }).join('');
}

/**
 * 加载科研经费数据
 */
function loadResearchData() {
    const data = [
        { project: '新材料开发', leader: '王教授', total: 1500000, used: 1575000, issueType: 'over_budget', risk: 'high' },
        { project: '量子计算研究', leader: '李教授', total: 2500000, used: 2625000, issueType: 'over_budget', risk: 'high' },
        { project: '智能制造研究', leader: '周教授', total: 1800000, used: 1890000, issueType: 'fake_invoice', risk: 'high' },
        { project: '人工智能研究项目', leader: '张教授', total: 1800000, used: 1620000, issueType: 'labor_cost_high', risk: 'medium' },
        { project: '环境工程研究', leader: '刘教授', total: 1200000, used: 1140000, issueType: 'slow_progress', risk: 'medium' },
        { project: '生物医药研究', leader: '赵教授', total: 2000000, used: 1900000, issueType: 'equipment_overpriced', risk: 'medium' },
        { project: '纳米技术研究', leader: '陈教授', total: 1600000, used: 1680000, issueType: 'over_budget', risk: 'high' },
        { project: '新能源开发', leader: '吴教授', total: 2200000, used: 2310000, issueType: 'fake_invoice', risk: 'high' }
    ];

    const tbody = document.getElementById('researchTableBody');
    tbody.innerHTML = data.map(item => {
        let issueLabel = '';
        let issueColor = 'danger';

        if (item.issueType === 'over_budget') {
            issueLabel = '经费超支';
            issueColor = 'danger';
        } else if (item.issueType === 'fake_invoice') {
            issueLabel = '虚假发票';
            issueColor = 'danger';
        } else if (item.issueType === 'labor_cost_high') {
            issueLabel = '劳务费超标';
            issueColor = 'warning';
        } else if (item.issueType === 'slow_progress') {
            issueLabel = '进度缓慢';
            issueColor = 'warning';
        } else if (item.issueType === 'equipment_overpriced') {
            issueLabel = '设备采购价高';
            issueColor = 'warning';
        }

        return `
        <tr>
            <td>${item.project}</td>
            <td>${item.leader}</td>
            <td>¥${(item.total / 10000).toFixed(2)}万</td>
            <td style="color: ${item.used > item.total ? '#DC2626' : '#6B7280'}; font-weight: ${item.used > item.total ? '600' : 'normal'};">
                ¥${(item.used / 10000).toFixed(2)}万
            </td>
            <td><span class="badge badge-${issueColor}">${issueLabel}</span></td>
            <td>
                <button type="button" class="btn-action" onclick="viewDetail('research', '${item.project}'); return false;">
                    <i class="fas fa-exclamation-triangle" style="color: ${issueColor === 'danger' ? '#DC2626' : '#D97706'}; margin-right: 4px;"></i>
                    查看详情
                </button>
            </td>
        </tr>
    `;
    }).join('');
}

/**
 * 加载采购管理数据
 */
function loadProcurementData() {
    const data = [
        { project: '实验耗材采购', department: '化学学院', amount: 850000, method: '单一来源', issueType: 'single_source', status: 'warning' },
        { project: '高端仪器采购', department: '物理学院', amount: 1200000, method: '单一来源', issueType: 'single_source', status: 'warning' },
        { project: '办公设备采购', department: '行政办', amount: 680000, method: '询价采购', issueType: 'procedure_irregular', status: 'warning' },
        { project: '实验设备采购', department: '物理学院', amount: 8500000, method: '公开招标', issueType: 'split_procurement', status: 'warning' },
        { project: '图书馆图书采购', department: '图书馆', amount: 2300000, method: '竞争性谈判', issueType: 'normal', status: 'in_progress' },
        { project: '网络设备采购', department: '信息中心', amount: 4500000, method: '公开招标', issueType: 'normal', status: 'completed' },
        { project: '实验室家具采购', department: '生命科学学院', amount: 950000, method: '单一来源', issueType: 'single_source', status: 'warning' },
        { project: '教学设备采购', department: '计算机学院', amount: 3200000, method: '竞争性谈判', issueType: 'price_high', status: 'warning' }
    ];

    const tbody = document.getElementById('procurementTableBody');
    tbody.innerHTML = data.map(item => {
        let issueLabel = '';
        let issueColor = 'success';

        if (item.issueType === 'single_source') {
            issueLabel = '单一来源';
            issueColor = 'danger';
        } else if (item.issueType === 'procedure_irregular') {
            issueLabel = '程序不规范';
            issueColor = 'warning';
        } else if (item.issueType === 'split_procurement') {
            issueLabel = '化整为零';
            issueColor = 'danger';
        } else if (item.issueType === 'price_high') {
            issueLabel = '价格偏高';
            issueColor = 'warning';
        } else {
            issueLabel = '正常';
            issueColor = 'success';
        }

        return `
        <tr>
            <td>${item.project}</td>
            <td>${item.department}</td>
            <td>¥${(item.amount / 10000).toFixed(2)}万</td>
            <td>${item.method}</td>
            <td><span class="badge badge-${issueColor}">${issueLabel}</span></td>
            <td>
                <button type="button" class="btn-action" onclick="viewDetail('procurement', '${item.project}'); return false;">
                    ${issueColor !== 'success' ? '<i class="fas fa-exclamation-triangle" style="color: ' + (issueColor === 'danger' ? '#DC2626' : '#D97706') + '; margin-right: 4px;"></i>' : ''}
                    查看详情
                </button>
            </td>
        </tr>
    `;
    }).join('');
}

/**
 * 加载固定资产数据
 */
function loadAssetsData() {
    const data = [
        { name: '光谱分析仪', code: 'EQ2023156', department: '化学学院', value: 680000, issueType: 'idle', status: 'idle' },
        { name: '质谱仪', code: 'EQ2023089', department: '化学学院', value: 950000, issueType: 'idle', status: 'idle' },
        { name: '离心机', code: 'EQ2023045', department: '生命科学学院', value: 420000, issueType: 'idle', status: 'idle' },
        { name: '测试设备', code: 'EQ2022178', department: '物理学院', value: 580000, issueType: 'missing', status: 'missing' },
        { name: '高性能计算机', code: 'EQ2024001', department: '计算机学院', value: 850000, issueType: 'normal', status: 'in_use' },
        { name: '电子显微镜', code: 'EQ2024002', department: '物理学院', value: 1200000, issueType: 'personal_use', status: 'in_use' },
        { name: '实验台', code: 'EQ2024003', department: '生命科学学院', value: 320000, issueType: 'normal', status: 'in_use' },
        { name: '色谱仪', code: 'EQ2022234', department: '化学学院', value: 720000, issueType: 'idle', status: 'idle' }
    ];

    const tbody = document.getElementById('assetsTableBody');
    tbody.innerHTML = data.map(item => {
        let issueLabel = '';
        let issueColor = 'success';

        if (item.issueType === 'idle') {
            issueLabel = '长期闲置';
            issueColor = 'warning';
        } else if (item.issueType === 'missing') {
            issueLabel = '账实不符';
            issueColor = 'danger';
        } else if (item.issueType === 'personal_use') {
            issueLabel = '公物私用';
            issueColor = 'danger';
        } else {
            issueLabel = '正常';
            issueColor = 'success';
        }

        return `
        <tr>
            <td>${item.name}</td>
            <td>${item.code}</td>
            <td>${item.department}</td>
            <td>¥${(item.value / 10000).toFixed(2)}万</td>
            <td><span class="badge badge-${issueColor}">${issueLabel}</span></td>
            <td>
                <button type="button" class="btn-action" onclick="viewDetail('assets', '${item.code}'); return false;">
                    ${issueColor !== 'success' ? '<i class="fas fa-exclamation-triangle" style="color: ' + (issueColor === 'danger' ? '#DC2626' : '#D97706') + '; margin-right: 4px;"></i>' : ''}
                    查看详情
                </button>
            </td>
        </tr>
    `;
    }).join('');
}

/**
 * 加载招生学籍数据
 */
function loadEnrollmentData() {
    const data = [
        { major: '网络工程', plan: 50, enrolled: 53, minScore: 608, issueType: 'over_plan', status: 'warning' },
        { major: '物联网工程', plan: 45, enrolled: 48, minScore: 602, issueType: 'over_plan', status: 'warning' },
        { major: '信息安全', plan: 40, enrolled: 43, minScore: 618, issueType: 'low_score', status: 'warning' },
        { major: '电子信息工程', plan: 70, enrolled: 73, minScore: 610, issueType: 'over_plan', status: 'warning' },
        { major: '数据科学与大数据技术', plan: 60, enrolled: 65, minScore: 615, issueType: 'over_plan', status: 'warning' },
        { major: '通信工程', plan: 55, enrolled: 60, minScore: 605, issueType: 'low_score', status: 'warning' },
        { major: '自动化', plan: 65, enrolled: 70, minScore: 598, issueType: 'over_plan', status: 'warning' },
        { major: '电气工程', plan: 75, enrolled: 80, minScore: 595, issueType: 'low_score', status: 'warning' },
        { major: '机械工程', plan: 80, enrolled: 85, minScore: 590, issueType: 'over_plan', status: 'warning' },
        { major: '土木工程', plan: 90, enrolled: 95, minScore: 585, issueType: 'low_score', status: 'warning' },
        { major: '计算机科学与技术', plan: 120, enrolled: 120, minScore: 625, issueType: 'normal', status: 'normal' },
        { major: '软件工程', plan: 100, enrolled: 98, minScore: 618, issueType: 'normal', status: 'normal' },
        { major: '人工智能', plan: 80, enrolled: 80, minScore: 632, issueType: 'normal', status: 'normal' }
    ];

    const tbody = document.getElementById('enrollmentTableBody');
    tbody.innerHTML = data.map(item => {
        let issueLabel = '';
        let issueColor = 'success';

        if (item.issueType === 'over_plan') {
            issueLabel = '超计划录取';
            issueColor = 'danger';
        } else if (item.issueType === 'low_score') {
            issueLabel = '低分高录';
            issueColor = 'danger';
        } else {
            issueLabel = '正常';
            issueColor = 'success';
        }

        return `
        <tr>
            <td>${item.major}</td>
            <td>${item.plan}</td>
            <td style="color: ${item.enrolled > item.plan ? '#DC2626' : '#6B7280'}; font-weight: ${item.enrolled > item.plan ? '600' : 'normal'};">
                ${item.enrolled}
            </td>
            <td>${item.minScore}</td>
            <td><span class="badge badge-${issueColor}">${issueLabel}</span></td>
            <td>
                <button type="button" class="btn-action" onclick="viewDetail('enrollment', '${item.major}'); return false;">
                    ${issueColor !== 'success' ? '<i class="fas fa-exclamation-triangle" style="color: #DC2626; margin-right: 4px;"></i>' : ''}
                    查看详情
                </button>
            </td>
        </tr>
    `;
    }).join('');
}

/**
 * 加载工程项目数据
 */
function loadProjectData() {
    const data = [
        { name: '新教学楼建设', leader: '基建处', budget: 68000000, used: 71400000, progress: 95, risk: 'high', issueType: 'over_budget', overRate: 5.0, delayDays: 0 },
        { name: '图书馆扩建', leader: '图书馆', budget: 42000000, used: 44100000, progress: 98, risk: 'high', issueType: 'over_budget', overRate: 5.0, delayDays: 0 },
        { name: '学生宿舍改造', leader: '后勤处', budget: 25000000, used: 23750000, progress: 65, risk: 'high', issueType: 'delay', overRate: 0, delayDays: 120 },
        { name: '实验室装修', leader: '物理学院', budget: 8500000, used: 8075000, progress: 70, risk: 'medium', issueType: 'quality', overRate: 0, delayDays: 45 },
        { name: '体育馆维修', leader: '体育部', budget: 12000000, used: 11400000, progress: 55, risk: 'high', issueType: 'bidding', overRate: 0, delayDays: 90 },
        { name: '校园道路改造', leader: '基建处', budget: 15000000, used: 15750000, progress: 100, risk: 'high', issueType: 'over_budget', overRate: 5.0, delayDays: 0 },
        { name: '食堂扩建', leader: '后勤处', budget: 18000000, used: 17100000, progress: 60, risk: 'high', issueType: 'delay', overRate: 0, delayDays: 150 },
        { name: '停车场建设', leader: '保卫处', budget: 8000000, used: 7600000, progress: 68, risk: 'medium', issueType: 'quality', overRate: 0, delayDays: 60 }
    ];

    const tbody = document.getElementById('projectTableBody');
    tbody.innerHTML = data.map(item => {
        const overBudget = item.used - item.budget;
        const isOver = overBudget > 0;

        // 根据问题类型显示不同的状态
        let statusBadge = '';
        let statusColor = '#059669';

        if (item.issueType === 'over_budget') {
            statusBadge = '<span class="badge badge-danger">预算超支</span>';
            statusColor = '#DC2626';
        } else if (item.issueType === 'delay') {
            statusBadge = `<span class="badge badge-warning">工期延误${item.delayDays}天</span>`;
            statusColor = '#D97706';
        } else if (item.issueType === 'quality') {
            statusBadge = '<span class="badge badge-warning">质量问题</span>';
            statusColor = '#D97706';
        } else if (item.issueType === 'bidding') {
            statusBadge = '<span class="badge badge-danger">招标违规</span>';
            statusColor = '#DC2626';
        }

        return `
        <tr>
            <td>${item.name}</td>
            <td>${item.leader}</td>
            <td>¥${(item.budget / 10000).toFixed(2)}万</td>
            <td style="color: ${isOver ? '#DC2626' : '#6B7280'}; font-weight: ${isOver ? '600' : 'normal'};">
                ¥${(item.used / 10000).toFixed(2)}万
                ${isOver ? `<span style="font-size: 12px; color: #DC2626;"> (+${item.overRate}%)</span>` : ''}
            </td>
            <td>
                <div style="display: flex; align-items: center; gap: 8px;">
                    <div style="flex: 1; height: 8px; background: #E5E7EB; border-radius: 4px; overflow: hidden;">
                        <div style="width: ${item.progress}%; height: 100%; background: ${item.progress >= 100 ? '#10B981' : item.progress >= 80 ? '#3B82F6' : '#F59E0B'};"></div>
                    </div>
                    <span style="color: ${item.progress >= 100 ? '#059669' : item.progress >= 80 ? '#2563EB' : '#D97706'};">${item.progress}%</span>
                </div>
            </td>
            <td>${statusBadge}</td>
            <td>
                <button type="button" class="btn-action" onclick="viewDetail('project', '${item.name}'); return false;">
                    <i class="fas fa-exclamation-triangle" style="color: ${statusColor}; margin-right: 4px;"></i>
                    查看详情
                </button>
            </td>
        </tr>
    `;
    }).join('');
}

/**
 * 加载薪酬社保数据
 */
function loadSalaryData() {
    const data = [
        { department: '计算机学院', count: 156, salary: 4680000, social: 936000, issueType: 'ghost_employee', status: 'danger' },
        { department: '经济学院', count: 128, salary: 3840000, social: 768000, issueType: 'salary_standard_violation', status: 'danger' },
        { department: '物理学院', count: 142, salary: 4260000, social: 852000, issueType: 'social_security_underpaid', status: 'warning' },
        { department: '化学学院', count: 135, salary: 4050000, social: 810000, issueType: 'allowance_irregular', status: 'warning' },
        { department: '生命科学学院', count: 118, salary: 3540000, social: 708000, issueType: 'normal', status: 'normal' },
        { department: '外国语学院', count: 95, salary: 2850000, social: 570000, issueType: 'overtime_pay_missing', status: 'warning' },
        { department: '数学学院', count: 108, salary: 3240000, social: 648000, issueType: 'normal', status: 'normal' },
        { department: '历史学院', count: 82, salary: 2460000, social: 492000, issueType: 'duplicate_payment', status: 'danger' }
    ];

    const tbody = document.getElementById('salaryTableBody');
    tbody.innerHTML = data.map(item => {
        let issueLabel = '';
        let issueColor = 'success';

        if (item.issueType === 'ghost_employee') {
            issueLabel = '虚报冒领';
            issueColor = 'danger';
        } else if (item.issueType === 'salary_standard_violation') {
            issueLabel = '违规发放';
            issueColor = 'danger';
        } else if (item.issueType === 'social_security_underpaid') {
            issueLabel = '社保少缴';
            issueColor = 'warning';
        } else if (item.issueType === 'allowance_irregular') {
            issueLabel = '津贴不规范';
            issueColor = 'warning';
        } else if (item.issueType === 'overtime_pay_missing') {
            issueLabel = '加班费未发';
            issueColor = 'warning';
        } else if (item.issueType === 'duplicate_payment') {
            issueLabel = '重复发放';
            issueColor = 'danger';
        } else {
            issueLabel = '正常';
            issueColor = 'success';
        }

        return `
        <tr>
            <td>${item.department}</td>
            <td>${item.count}</td>
            <td>¥${(item.salary / 10000).toFixed(2)}万</td>
            <td>¥${(item.social / 10000).toFixed(2)}万</td>
            <td><span class="badge badge-${issueColor}">${issueLabel}</span></td>
            <td>
                <button type="button" class="btn-action" onclick="viewDetail('salary', '${item.department}'); return false;">
                    ${issueColor !== 'success' ? '<i class="fas fa-exclamation-triangle" style="color: ' + (issueColor === 'danger' ? '#DC2626' : '#D97706') + '; margin-right: 4px;"></i>' : ''}
                    查看详情
                </button>
            </td>
        </tr>
    `;
    }).join('');
}

/**
 * 加载IT治理数据
 */
function loadITData() {
    const data = [
        { system: '科研管理系统', department: '科研处', investment: 7800000, level: '三级', status: 'running', issueType: 'security_vulnerability', vulnerabilityCount: 8 },
        { system: '图书管理系统', department: '图书馆', investment: 4500000, level: '三级', status: 'running', issueType: 'data_leak_risk', sensitiveDataCount: 15000 },
        { system: '学生管理系统', department: '学工处', investment: 5800000, level: '三级', status: 'running', issueType: 'system_outdated', version: 'v2.1', latestVersion: 'v5.3' },
        { system: '教务管理系统', department: '教务处', investment: 8500000, level: '三级', status: 'running', issueType: 'operation_irregular', backupDays: 45 },
        { system: '财务管理系统', department: '财务处', investment: 12000000, level: '二级', status: 'running', issueType: 'normal' },
        { system: '人事管理系统', department: '人事处', investment: 6500000, level: '三级', status: 'running', issueType: 'normal' },
        { system: '资产管理系统', department: '资产处', investment: 5200000, level: '三级', status: 'running', issueType: 'security_vulnerability', vulnerabilityCount: 5 },
        { system: '招生管理系统', department: '招生办', investment: 6800000, level: '三级', status: 'running', issueType: 'data_leak_risk', sensitiveDataCount: 8500 },
        { system: '办公自动化系统', department: '办公室', investment: 3200000, level: '三级', status: 'running', issueType: 'system_outdated', version: 'v1.8', latestVersion: 'v4.2' },
        { system: '档案管理系统', department: '档案馆', investment: 4800000, level: '三级', status: 'running', issueType: 'operation_irregular', backupDays: 60 }
    ];

    const tbody = document.getElementById('itTableBody');
    tbody.innerHTML = data.map(item => {
        let issueLabel = '';
        let issueColor = 'success';

        if (item.issueType === 'security_vulnerability') {
            issueLabel = '安全漏洞';
            issueColor = 'danger';
        } else if (item.issueType === 'data_leak_risk') {
            issueLabel = '数据泄露风险';
            issueColor = 'danger';
        } else if (item.issueType === 'system_outdated') {
            issueLabel = '系统老化';
            issueColor = 'warning';
        } else if (item.issueType === 'operation_irregular') {
            issueLabel = '运维不规范';
            issueColor = 'warning';
        } else {
            issueLabel = '正常';
            issueColor = 'success';
        }

        return `
        <tr>
            <td>${item.system}</td>
            <td>${item.department}</td>
            <td>¥${(item.investment / 10000).toFixed(2)}万</td>
            <td><span class="badge badge-${item.level === '二级' ? 'warning' : 'info'}">${item.level}</span></td>
            <td><span class="badge badge-${issueColor}">${issueLabel}</span></td>
            <td>
                <button type="button" class="btn-action" onclick="viewDetail('it', '${item.system}'); return false;">
                    ${issueColor !== 'success' ? '<i class="fas fa-exclamation-triangle" style="color: ' + (issueColor === 'danger' ? '#DC2626' : '#D97706') + '; margin-right: 4px;"></i>' : ''}
                    查看详情
                </button>
            </td>
        </tr>
    `;
    }).join('');
}

/**
 * 工具函数
 */
function getStatusText(status) {
    const map = {
        'normal': '正常',
        'warning': '预警',
        'danger': '超支'
    };
    return map[status] || status;
}

function getRiskText(risk) {
    const map = {
        'low': '低风险',
        'medium': '中风险',
        'high': '高风险'
    };
    return map[risk] || risk;
}

function getProcurementStatus(status) {
    const map = {
        'completed': '已完成',
        'in_progress': '进行中',
        'warning': '异常'
    };
    return map[status] || status;
}

/**
 * 查看详情
 */
function viewDetail(module, id) {
    let content = '';

    switch (module) {
        case 'budget':
            content = getBudgetDetail(id);
            break;
        case 'research':
            content = getResearchDetail(id);
            break;
        case 'procurement':
            content = getProcurementDetail(id);
            break;
        case 'assets':
            content = getAssetsDetail(id);
            break;
        case 'enrollment':
            content = getEnrollmentDetail(id);
            break;
        case 'project':
            content = getProjectDetail(id);
            break;
        case 'salary':
            content = getSalaryDetail(id);
            break;
        case 'it':
            content = getITDetail(id);
            break;
        default:
            content = getDefaultDetail(module, id);
    }

    Modal.show({
        title: `${getModuleName(module)} - 详情`,
        content: content,
        size: 'lg',
        buttons: [
            { text: '关闭', type: 'default', onClick: () => Modal.hide() },
            { text: '导出报告', type: 'primary', onClick: () => exportDetail(module, id) }
        ]
    });
}

/**
 * 预算执行审计详情
 */
function getBudgetDetail(department) {
    // 不同部门的问题类型数据
    const departmentData = {
        '化学学院': { budget: 420.00, executed: 441.00, rate: 105.0, issueType: 'over_budget' },
        '经济学院': { budget: 380.00, executed: 399.00, rate: 105.0, issueType: 'over_budget' },
        '物理学院': { budget: 450.00, executed: 315.00, rate: 70.0, issueType: 'low_execution' },
        '生命科学学院': { budget: 360.00, executed: 252.00, rate: 70.0, issueType: 'low_execution' },
        '计算机学院': { budget: 520.00, executed: 535.60, rate: 103.0, issueType: 'unauthorized_adjustment' },
        '外国语学院': { budget: 280.00, executed: 294.00, rate: 105.0, issueType: 'over_budget' },
        '数学学院': { budget: 320.00, executed: 208.00, rate: 65.0, issueType: 'low_execution' },
        '历史学院': { budget: 250.00, executed: 262.50, rate: 105.0, issueType: 'year_end_spending' }
    };

    const data = departmentData[department] || { budget: 520.00, executed: 468.00, rate: 90.0, issueType: 'normal' };

    let issueTitle = '';
    let issueColor = '#059669';
    let statusBadge = '';
    let findings = '';
    let suggestions = '';

    // 根据问题类型生成不同的审计结论
    if (data.issueType === 'over_budget') {
        issueTitle = '该部门预算执行存在严重超支问题！';
        issueColor = '#DC2626';
        statusBadge = '<span class="badge badge-danger">预算超支</span>';
        findings = `
            <p><strong>具体问题清单：</strong></p>
            <ul>
                <li><i class="fas fa-exclamation-circle text-red-600"></i> <strong>预算超支5%</strong>，违反预算管理规定</li>
                <li><i class="fas fa-exclamation-circle text-red-600"></i> <strong>办公费科目超支严重</strong>，达到预算的120%</li>
                <li><i class="fas fa-exclamation-circle text-red-600"></i> <strong>差旅费支出超标</strong>，存在不合理支出</li>
                <li><i class="fas fa-exclamation-triangle text-yellow-600"></i> 会议费支出偏高，部分会议必要性不足</li>
                <li><i class="fas fa-exclamation-triangle text-yellow-600"></i> 招待费超标，存在违规接待现象</li>
                <li><i class="fas fa-info-circle text-blue-600"></i> 预算执行缺少有效监控</li>
            </ul>
        `;
        suggestions = `
            <p><strong>1. 立即整改措施：</strong></p>
            <ul>
                <li><strong>立即停止</strong>一切非必要支出，严格控制预算</li>
                <li>对超支部分进行<strong>专项审查</strong>，追究相关责任</li>
                <li>对不合理支出进行<strong>清退</strong></li>
            </ul>
            <p><strong>2. 长期改进措施：</strong></p>
            <ul>
                <li>建立预算执行<strong>预警机制</strong>，防止再次超支</li>
                <li>加强财务管理培训，提高预算管理意识</li>
                <li>下年度预算编制需更加科学合理</li>
            </ul>
        `;
    } else if (data.issueType === 'low_execution') {
        issueTitle = '该部门预算执行进度严重偏低！';
        issueColor = '#D97706';
        statusBadge = '<span class="badge badge-warning">执行偏低</span>';
        findings = `
            <p><strong>具体问题清单：</strong></p>
            <ul>
                <li><i class="fas fa-exclamation-triangle text-yellow-600"></i> <strong>执行率仅${data.rate}%</strong>，远低于平均水平85%</li>
                <li><i class="fas fa-exclamation-triangle text-yellow-600"></i> <strong>设备购置科目执行率不足40%</strong>，大量预算闲置</li>
                <li><i class="fas fa-exclamation-triangle text-yellow-600"></i> <strong>科研项目配套经费未及时到位</strong>，影响项目进度</li>
                <li><i class="fas fa-exclamation-triangle text-yellow-600"></i> 存在预算闲置浪费现象</li>
                <li><i class="fas fa-info-circle text-blue-600"></i> 部分项目采购流程过慢</li>
                <li><i class="fas fa-info-circle text-blue-600"></i> 预算编制与实际需求脱节</li>
            </ul>
        `;
        suggestions = `
            <p><strong>1. 加快执行进度：</strong></p>
            <ul>
                <li>加快预算执行进度，确保年底前执行率达到<strong>90%以上</strong></li>
                <li>优化采购流程，提高设备购置效率</li>
                <li>对闲置预算进行清理，及时调整支出计划</li>
            </ul>
            <p><strong>2. 完善管理机制：</strong></p>
            <ul>
                <li>建立预算执行<strong>月度通报制度</strong></li>
                <li>加强项目管理，确保配套经费及时到位</li>
                <li>提高预算编制的<strong>科学性和准确性</strong></li>
            </ul>
        `;
    } else if (data.issueType === 'unauthorized_adjustment') {
        issueTitle = '该部门存在擅自调整预算问题！';
        issueColor = '#DC2626';
        statusBadge = '<span class="badge badge-danger">擅自调整</span>';
        findings = `
            <p><strong>具体问题清单：</strong></p>
            <ul>
                <li><i class="fas fa-exclamation-circle text-red-600"></i> <strong>未经审批擅自调整预算科目</strong>，涉及金额15.6万元</li>
                <li><i class="fas fa-exclamation-circle text-red-600"></i> <strong>违规将设备购置费调整为办公费</strong>，规避采购程序</li>
                <li><i class="fas fa-exclamation-circle text-red-600"></i> <strong>预算调整未履行审批手续</strong>，违反预算管理规定</li>
                <li><i class="fas fa-exclamation-triangle text-yellow-600"></i> 预算科目之间频繁调剂，缺少必要说明</li>
                <li><i class="fas fa-exclamation-triangle text-yellow-600"></i> 预算调整记录不完整</li>
                <li><i class="fas fa-info-circle text-blue-600"></i> 预算管理制度执行不严</li>
            </ul>
        `;
        suggestions = `
            <p><strong>1. 立即整改：</strong></p>
            <ul>
                <li>对擅自调整的预算进行<strong>全面清查</strong></li>
                <li>补办预算调整<strong>审批手续</strong></li>
                <li>对相关责任人进行<strong>严肃问责</strong></li>
            </ul>
            <p><strong>2. 规范管理：</strong></p>
            <ul>
                <li>严格执行预算调整<strong>审批程序</strong></li>
                <li>建立预算调整<strong>台账制度</strong></li>
                <li>加强预算管理<strong>培训和监督</strong></li>
            </ul>
        `;
    } else if (data.issueType === 'year_end_spending') {
        issueTitle = '该部门存在年底突击花钱问题！';
        issueColor = '#DC2626';
        statusBadge = '<span class="badge badge-danger">年底突击花钱</span>';
        findings = `
            <p><strong>具体问题清单：</strong></p>
            <ul>
                <li><i class="fas fa-exclamation-circle text-red-600"></i> <strong>12月份支出占全年支出的35%</strong>，明显异常</li>
                <li><i class="fas fa-exclamation-circle text-red-600"></i> <strong>年底集中采购大量办公用品</strong>，超出实际需求</li>
                <li><i class="fas fa-exclamation-circle text-red-600"></i> <strong>突击购买设备</strong>，部分设备必要性不足</li>
                <li><i class="fas fa-exclamation-triangle text-yellow-600"></i> 年底集中报销差旅费，存在提前消费现象</li>
                <li><i class="fas fa-exclamation-triangle text-yellow-600"></i> 预算执行前松后紧，缺少统筹安排</li>
                <li><i class="fas fa-info-circle text-blue-600"></i> 担心预算结余影响下年度预算</li>
            </ul>
        `;
        suggestions = `
            <p><strong>1. 立即整改：</strong></p>
            <ul>
                <li>对年底突击支出进行<strong>专项审查</strong></li>
                <li>清理不必要的采购，<strong>退货退款</strong></li>
                <li>对相关责任人进行<strong>约谈和问责</strong></li>
            </ul>
            <p><strong>2. 建立长效机制：</strong></p>
            <ul>
                <li>建立预算执行<strong>均衡性考核机制</strong></li>
                <li>加强预算执行<strong>进度监控</strong></li>
                <li>树立正确的预算管理理念，<strong>节约光荣、浪费可耻</strong></li>
            </ul>
        `;
    } else {
        issueTitle = '该部门预算执行总体规范';
        statusBadge = '<span class="badge badge-success">执行正常</span>';
        findings = `
            <p><strong>审计结论：</strong>该部门预算执行总体规范。</p>
            <ul>
                <li><i class="fas fa-check-circle text-green-600"></i> 预算执行率90%，符合要求</li>
                <li><i class="fas fa-check-circle text-green-600"></i> 各科目支出均衡合理</li>
                <li><i class="fas fa-check-circle text-green-600"></i> 预算管理制度健全</li>
                <li><i class="fas fa-check-circle text-green-600"></i> 预算调整程序规范</li>
            </ul>
        `;
        suggestions = `
            <p>1. 继续保持良好的预算执行习惯</p>
            <p>2. 加强预算执行分析，提高资金使用效益</p>
            <p>3. 进一步提高预算编制的科学性</p>
        `;
    }

    const isOver = data.executed > data.budget;
    const difference = Math.abs(data.executed - data.budget);

    return `
        <div class="detail-content">
            <div class="detail-section">
                <h4 class="detail-section-title">部门信息</h4>
                <div class="detail-grid">
                    <div class="detail-item"><label>部门名称</label><p>${department}</p></div>
                    <div class="detail-item"><label>部门负责人</label><p>院长</p></div>
                    <div class="detail-item"><label>预算年度</label><p>2024年</p></div>
                    <div class="detail-item"><label>审计状态</label><p>${statusBadge}</p></div>
                    <div class="detail-item"><label>审计日期</label><p>2024-10-15</p></div>
                    <div class="detail-item"><label>审计人员</label><p>审计处</p></div>
                </div>
            </div>
            <div class="detail-section">
                <h4 class="detail-section-title">预算执行情况</h4>
                <div class="detail-grid">
                    <div class="detail-item"><label>年度预算</label><p style="font-size: 18px; font-weight: 600; color: #2563EB;">¥${data.budget.toFixed(2)}万</p></div>
                    <div class="detail-item"><label>已执行金额</label><p style="font-size: 18px; font-weight: 600; color: ${isOver ? '#DC2626' : data.rate < 75 ? '#D97706' : '#059669'};">¥${data.executed.toFixed(2)}万</p></div>
                    <div class="detail-item"><label>执行率</label><p style="font-size: 18px; font-weight: 600; color: ${isOver ? '#DC2626' : data.rate < 75 ? '#D97706' : '#059669'};">${data.rate}%</p></div>
                    <div class="detail-item"><label>${isOver ? '超支金额' : '剩余预算'}</label><p style="font-size: 18px; font-weight: 600; color: ${isOver ? '#DC2626' : '#6B7280'};">¥${difference.toFixed(2)}万</p></div>
                </div>
            </div>
            <div class="detail-section">
                <h4 class="detail-section-title">审计发现</h4>
                <div class="detail-text">
                    <p><strong style="color: ${issueColor};">审计结论：${issueTitle}</strong></p>
                    ${findings}
                </div>
            </div>
            ${data.issueType !== 'normal' ? `
            <div class="detail-section">
                <h4 class="detail-section-title">整改要求</h4>
                <div class="detail-text">
                    <p><strong style="color: ${issueColor};">${data.issueType === 'over_budget' || data.issueType === 'unauthorized_adjustment' || data.issueType === 'year_end_spending' ? '严重违规，要求立即整改（限期30天）' : '要求限期整改（限期20天）'}：</strong></p>
                    ${suggestions}
                    <p><strong>3. 责任追究：</strong></p>
                    <ul>
                        <li>对部门负责人进行<strong>约谈</strong>，要求作出书面检查</li>
                        <li>将整改情况纳入部门<strong>年度考核</strong></li>
                        ${data.issueType === 'unauthorized_adjustment' ? '<li>对相关责任人给予<strong>通报批评</strong></li>' : ''}
                    </ul>
                </div>
            </div>
            <div class="detail-section">
                <h4 class="detail-section-title">后续监督</h4>
                <div class="detail-text">
                    <p>1. ${data.issueType === 'over_budget' || data.issueType === 'unauthorized_adjustment' || data.issueType === 'year_end_spending' ? '30' : '20'}天后进行整改情况<strong>专项检查</strong></p>
                    <p>2. 对整改不力的，将<strong>通报批评</strong>并追究领导责任</p>
                    <p>3. 建立预算执行<strong>回访制度</strong>，跟踪整改落实情况</p>
                </div>
            </div>
            ` : `
            <div class="detail-section">
                <h4 class="detail-section-title">工作建议</h4>
                <div class="detail-text">
                    ${suggestions}
                </div>
            </div>
            `}
        </div>
    `;
}

/**
 * 科研经费审计详情
 */
function getResearchDetail(project) {
    // 不同项目的问题类型数据
    const projectData = {
        '新材料开发': { total: 150.00, used: 157.50, rate: 105, issueType: 'over_budget', laborCostRate: 28 },
        '量子计算研究': { total: 250.00, used: 262.50, rate: 105, issueType: 'over_budget', laborCostRate: 32 },
        '智能制造研究': { total: 180.00, used: 189.00, rate: 105, issueType: 'fake_invoice', invoiceCount: 5, invoiceAmount: 12.5 },
        '人工智能研究项目': { total: 180.00, used: 162.00, rate: 90, issueType: 'labor_cost_high', laborCostRate: 38, laborCostAmount: 61.56 },
        '环境工程研究': { total: 120.00, used: 114.00, rate: 95, issueType: 'slow_progress', progressRate: 45, planProgressRate: 75 },
        '生物医药研究': { total: 200.00, used: 190.00, rate: 95, issueType: 'equipment_overpriced', equipmentAmount: 85, marketPrice: 72 },
        '纳米技术研究': { total: 160.00, used: 168.00, rate: 105, issueType: 'over_budget', laborCostRate: 35 },
        '新能源开发': { total: 220.00, used: 231.00, rate: 105, issueType: 'fake_invoice', invoiceCount: 7, invoiceAmount: 18.2 }
    };

    const data = projectData[project] || { total: 180.00, used: 162.00, rate: 90, issueType: 'normal' };

    let issueTitle = '';
    let issueColor = '#059669';
    let statusBadge = '';
    let riskBadge = '';
    let findings = '';
    let suggestions = '';

    // 根据问题类型生成不同的审计结论
    if (data.issueType === 'over_budget') {
        issueTitle = '项目经费使用存在严重超支问题！';
        issueColor = '#DC2626';
        statusBadge = '<span class="badge badge-danger">发现问题</span>';
        riskBadge = '<span class="badge badge-danger">高风险</span>';
        findings = `
            <p><strong>具体问题清单：</strong></p>
            <ul>
                <li><i class="fas fa-exclamation-circle text-red-600"></i> <strong>经费超支5%</strong>，违反科研经费管理规定</li>
                <li><i class="fas fa-exclamation-circle text-red-600"></i> <strong>劳务费占比${data.laborCostRate}%</strong>，${data.laborCostRate > 30 ? '超过规定上限30%' : '接近规定上限'}</li>
                <li><i class="fas fa-exclamation-circle text-red-600"></i> <strong>设备采购未按规定招标</strong>，存在利益输送风险</li>
                <li><i class="fas fa-exclamation-triangle text-yellow-600"></i> 差旅费报销存在超标准现象</li>
                <li><i class="fas fa-exclamation-triangle text-yellow-600"></i> 部分支出凭证不完整</li>
                <li><i class="fas fa-info-circle text-blue-600"></i> 项目预算编制不够科学</li>
            </ul>
        `;
        suggestions = `
            <p><strong>1. 立即整改措施：</strong></p>
            <ul>
                <li><strong>立即停止</strong>项目经费支出，接受专项审查</li>
                <li>对超支部分进行<strong>逐项核查</strong>，分析超支原因</li>
                <li>对不合理支出进行<strong>清退</strong></li>
            </ul>
            <p><strong>2. 长期改进措施：</strong></p>
            <ul>
                <li>严格控制劳务费支出比例，不得超过<strong>30%</strong></li>
                <li>加强设备采购管理，严格执行<strong>招标程序</strong></li>
                <li>规范差旅费报销，严格执行<strong>标准</strong></li>
            </ul>
        `;
    } else if (data.issueType === 'fake_invoice') {
        issueTitle = '项目经费使用存在虚假发票问题！';
        issueColor = '#DC2626';
        statusBadge = '<span class="badge badge-danger">发现问题</span>';
        riskBadge = '<span class="badge badge-danger">高风险</span>';
        findings = `
            <p><strong>具体问题清单：</strong></p>
            <ul>
                <li><i class="fas fa-exclamation-circle text-red-600"></i> <strong>发现${data.invoiceCount}张连号发票</strong>，涉嫌虚假报销，金额${data.invoiceAmount}万元</li>
                <li><i class="fas fa-exclamation-circle text-red-600"></i> <strong>发票开具单位与实际供货单位不符</strong></li>
                <li><i class="fas fa-exclamation-circle text-red-600"></i> <strong>部分发票无法在税务系统查验</strong></li>
                <li><i class="fas fa-exclamation-triangle text-yellow-600"></i> 发票报销时间集中，存在突击报销现象</li>
                <li><i class="fas fa-exclamation-triangle text-yellow-600"></i> 发票内容与项目研究内容关联性不强</li>
                <li><i class="fas fa-info-circle text-blue-600"></i> 发票审核不严格</li>
            </ul>
            <div style="background: #FEF2F2; padding: 16px; border-radius: 6px; margin: 16px 0; border-left: 4px solid #DC2626;">
                <p style="margin: 0; color: #991B1B;"><strong>重点关注：</strong></p>
                <p style="margin: 8px 0 0 0; color: #991B1B;">发现${data.invoiceCount}张连号发票，发票号码连续，开具时间相同，涉嫌<strong>虚假报销</strong>，已移交纪检部门调查。</p>
            </div>
        `;
        suggestions = `
            <p><strong>1. 立即整改措施：</strong></p>
            <ul>
                <li><strong>立即停止</strong>项目经费支出，接受专项审查</li>
                <li>对连号发票进行<strong>专项调查</strong>，如属实将追究法律责任</li>
                <li>对虚假报销金额进行<strong>全额追回</strong></li>
                <li>移交纪检部门进行<strong>深入调查</strong></li>
            </ul>
            <p><strong>2. 长期改进措施：</strong></p>
            <ul>
                <li>建立发票<strong>真伪查验机制</strong></li>
                <li>加强发票审核，确保<strong>票货相符</strong></li>
                <li>建立发票报销<strong>预警机制</strong></li>
            </ul>
        `;
    } else if (data.issueType === 'labor_cost_high') {
        issueTitle = '项目劳务费支出超标！';
        issueColor = '#D97706';
        statusBadge = '<span class="badge badge-warning">发现问题</span>';
        riskBadge = '<span class="badge badge-warning">中风险</span>';
        findings = `
            <p><strong>具体问题清单：</strong></p>
            <ul>
                <li><i class="fas fa-exclamation-triangle text-yellow-600"></i> <strong>劳务费占比${data.laborCostRate}%</strong>，超过规定上限30%，金额${data.laborCostAmount}万元</li>
                <li><i class="fas fa-exclamation-triangle text-yellow-600"></i> <strong>劳务费发放人员名单不完整</strong></li>
                <li><i class="fas fa-exclamation-triangle text-yellow-600"></i> 部分劳务费发放标准偏高</li>
                <li><i class="fas fa-exclamation-triangle text-yellow-600"></i> 劳务费发放缺少工作量证明</li>
                <li><i class="fas fa-info-circle text-blue-600"></i> 劳务费管理不够规范</li>
            </ul>
        `;
        suggestions = `
            <p><strong>1. 立即整改措施：</strong></p>
            <ul>
                <li>严格控制劳务费支出比例，不得超过<strong>30%</strong></li>
                <li>对超标部分进行<strong>核查</strong>，调整支出结构</li>
                <li>完善劳务费发放<strong>审批程序</strong></li>
            </ul>
            <p><strong>2. 长期改进措施：</strong></p>
            <ul>
                <li>建立劳务费发放<strong>台账制度</strong></li>
                <li>规范劳务费发放<strong>标准</strong></li>
                <li>加强劳务费支出<strong>监督检查</strong></li>
            </ul>
        `;
    } else if (data.issueType === 'slow_progress') {
        issueTitle = '项目进度严重滞后！';
        issueColor = '#D97706';
        statusBadge = '<span class="badge badge-warning">发现问题</span>';
        riskBadge = '<span class="badge badge-warning">中风险</span>';
        findings = `
            <p><strong>具体问题清单：</strong></p>
            <ul>
                <li><i class="fas fa-exclamation-triangle text-yellow-600"></i> <strong>项目实际进度${data.progressRate}%</strong>，计划进度${data.planProgressRate}%，严重滞后</li>
                <li><i class="fas fa-exclamation-triangle text-yellow-600"></i> <strong>关键节点未按期完成</strong></li>
                <li><i class="fas fa-exclamation-triangle text-yellow-600"></i> 经费使用进度与项目进度不匹配</li>
                <li><i class="fas fa-exclamation-triangle text-yellow-600"></i> 项目组人员投入不足</li>
                <li><i class="fas fa-info-circle text-blue-600"></i> 项目管理不够规范</li>
            </ul>
        `;
        suggestions = `
            <p><strong>1. 加快项目进度：</strong></p>
            <ul>
                <li>制定<strong>赶工计划</strong>，确保按期完成</li>
                <li>增加项目组<strong>人员投入</strong></li>
                <li>加强项目<strong>过程管理</strong></li>
            </ul>
            <p><strong>2. 完善管理机制：</strong></p>
            <ul>
                <li>建立项目进度<strong>月报制度</strong></li>
                <li>加强项目<strong>监督检查</strong></li>
                <li>提高经费使用<strong>效率</strong></li>
            </ul>
        `;
    } else if (data.issueType === 'equipment_overpriced') {
        issueTitle = '项目设备采购价格偏高！';
        issueColor = '#D97706';
        statusBadge = '<span class="badge badge-warning">发现问题</span>';
        riskBadge = '<span class="badge badge-warning">中风险</span>';
        findings = `
            <p><strong>具体问题清单：</strong></p>
            <ul>
                <li><i class="fas fa-exclamation-triangle text-yellow-600"></i> <strong>设备采购价格${data.equipmentAmount}万元</strong>，市场价格约${data.marketPrice}万元，高出${((data.equipmentAmount - data.marketPrice) / data.marketPrice * 100).toFixed(1)}%</li>
                <li><i class="fas fa-exclamation-triangle text-yellow-600"></i> <strong>设备采购未充分比价</strong></li>
                <li><i class="fas fa-exclamation-triangle text-yellow-600"></i> 设备采购缺少市场调研</li>
                <li><i class="fas fa-exclamation-triangle text-yellow-600"></i> 设备采购议价能力不足</li>
                <li><i class="fas fa-info-circle text-blue-600"></i> 设备采购管理不够规范</li>
            </ul>
        `;
        suggestions = `
            <p><strong>1. 立即整改措施：</strong></p>
            <ul>
                <li>对设备采购价格进行<strong>核查</strong></li>
                <li>加强设备采购<strong>市场调研</strong></li>
                <li>做好设备采购<strong>比价工作</strong></li>
            </ul>
            <p><strong>2. 长期改进措施：</strong></p>
            <ul>
                <li>建立设备采购<strong>价格数据库</strong></li>
                <li>规范设备采购<strong>程序</strong></li>
                <li>提高设备采购<strong>议价能力</strong></li>
            </ul>
        `;
    } else {
        issueTitle = '项目经费使用总体规范';
        statusBadge = '<span class="badge badge-success">正常</span>';
        riskBadge = '<span class="badge badge-success">低风险</span>';
        findings = `
            <p><strong>审计结论：</strong>项目经费使用总体规范。</p>
            <ul>
                <li><i class="fas fa-check-circle text-green-600"></i> 经费使用符合规定</li>
                <li><i class="fas fa-check-circle text-green-600"></i> 劳务费占比合理</li>
                <li><i class="fas fa-check-circle text-green-600"></i> 支出凭证完整</li>
                <li><i class="fas fa-check-circle text-green-600"></i> 项目进度正常</li>
            </ul>
        `;
        suggestions = `
            <p>1. 继续保持良好的经费管理</p>
            <p>2. 加强项目进度管理，提高经费使用效率</p>
        `;
    }

    const isOver = data.used > data.total;
    const difference = Math.abs(data.used - data.total);

    return `
        <div class="detail-content">
            <div class="detail-section">
                <h4 class="detail-section-title">项目基本信息</h4>
                <div class="detail-grid">
                    <div class="detail-item"><label>项目名称</label><p>${project}</p></div>
                    <div class="detail-item"><label>项目负责人</label><p>教授</p></div>
                    <div class="detail-item"><label>项目编号</label><p>KY2024-${Math.floor(Math.random() * 100).toString().padStart(3, '0')}</p></div>
                    <div class="detail-item"><label>项目类型</label><p>国家自然科学基金</p></div>
                    <div class="detail-item"><label>立项时间</label><p>2024-01-15</p></div>
                    <div class="detail-item"><label>项目周期</label><p>3年</p></div>
                    <div class="detail-item"><label>风险等级</label><p>${riskBadge}</p></div>
                    <div class="detail-item"><label>审计状态</label><p>${statusBadge}</p></div>
                </div>
            </div>
            <div class="detail-section">
                <h4 class="detail-section-title">经费使用情况</h4>
                <div class="detail-grid">
                    <div class="detail-item"><label>经费总额</label><p style="font-size: 18px; font-weight: 600; color: #2563EB;">¥${data.total.toFixed(2)}万</p></div>
                    <div class="detail-item"><label>已使用</label><p style="font-size: 18px; font-weight: 600; color: ${isOver ? '#DC2626' : '#059669'};">¥${data.used.toFixed(2)}万</p></div>
                    <div class="detail-item"><label>使用率</label><p style="font-size: 18px; font-weight: 600; color: ${isOver ? '#DC2626' : data.rate < 80 ? '#D97706' : '#059669'};">${data.rate}%</p></div>
                    <div class="detail-item"><label>${isOver ? '超支金额' : '剩余经费'}</label><p style="font-size: 18px; font-weight: 600; color: ${isOver ? '#DC2626' : '#6B7280'};">¥${difference.toFixed(2)}万</p></div>
                </div>
            </div>
            <div class="detail-section">
                <h4 class="detail-section-title">审计发现</h4>
                <div class="detail-text">
                    <p><strong style="color: ${issueColor};">审计结论：${issueTitle}</strong></p>
                    ${findings}
                </div>
            </div>
            ${data.issueType !== 'normal' ? `
            <div class="detail-section">
                <h4 class="detail-section-title">整改要求</h4>
                <div class="detail-text">
                    <p><strong style="color: ${issueColor};">${data.issueType === 'over_budget' || data.issueType === 'fake_invoice' ? '严重违规，要求立即整改（限期15天）' : '要求限期整改（限期20天）'}：</strong></p>
                    ${suggestions}
                    <p><strong>3. 责任追究：</strong></p>
                    <ul>
                        <li>对项目负责人进行<strong>约谈</strong>，要求作出书面检查</li>
                        ${data.issueType === 'fake_invoice' ? '<li>对涉嫌违规人员进行<strong>立案调查</strong></li>' : ''}
                        <li>将整改情况纳入项目<strong>年度考核</strong></li>
                    </ul>
                </div>
            </div>
            <div class="detail-section">
                <h4 class="detail-section-title">后续监督</h4>
                <div class="detail-text">
                    <p>1. ${data.issueType === 'over_budget' || data.issueType === 'fake_invoice' ? '15' : '20'}天后进行整改情况<strong>专项检查</strong></p>
                    <p>2. 对整改不力的，将<strong>通报批评</strong>并追究领导责任</p>
                    <p>3. 建立科研经费审计<strong>回访制度</strong>，跟踪整改落实情况</p>
                </div>
            </div>
            ` : `
            <div class="detail-section">
                <h4 class="detail-section-title">工作建议</h4>
                <div class="detail-text">
                    ${suggestions}
                </div>
            </div>
            `}
        </div>
    `;
}

/**
 * 采购管理审计详情
 */
function getProcurementDetail(project) {
    // 不同采购项目的问题类型数据
    const projectData = {
        '实验耗材采购': {
            amount: 85.00, department: '化学学院', method: '单一来源',
            issueType: 'single_source', supplier: 'XX耗材公司'
        },
        '高端仪器采购': {
            amount: 120.00, department: '物理学院', method: '单一来源',
            issueType: 'single_source', supplier: 'YY仪器公司'
        },
        '办公设备采购': {
            amount: 68.00, department: '行政办', method: '询价采购',
            issueType: 'procedure_irregular', supplier: 'ZZ设备公司'
        },
        '实验设备采购': {
            amount: 850.00, department: '物理学院', method: '公开招标',
            issueType: 'split_procurement', supplier: 'AA科技公司',
            splitAmount: 850, splitCount: 5
        },
        '图书馆图书采购': {
            amount: 230.00, department: '图书馆', method: '竞争性谈判',
            issueType: 'normal', supplier: 'BB图书公司'
        },
        '网络设备采购': {
            amount: 450.00, department: '信息中心', method: '公开招标',
            issueType: 'normal', supplier: 'CC网络公司'
        },
        '实验室家具采购': {
            amount: 95.00, department: '生命科学学院', method: '单一来源',
            issueType: 'single_source', supplier: 'DD家具公司'
        },
        '教学设备采购': {
            amount: 320.00, department: '计算机学院', method: '竞争性谈判',
            issueType: 'price_high', supplier: 'EE教学设备公司',
            actualPrice: 320, marketPrice: 285
        }
    };

    const data = projectData[project] || projectData['网络设备采购'];

    let issueTitle = '';
    let issueColor = '#059669';
    let statusBadge = '';
    let findings = '';
    let suggestions = '';

    // 根据问题类型生成不同的审计结论
    if (data.issueType === 'single_source') {
        issueTitle = '该采购项目存在单一来源采购问题！';
        issueColor = '#DC2626';
        statusBadge = '<span class="badge badge-danger">单一来源</span>';
        findings = `
            <p><strong>具体问题清单：</strong></p>
            <ul>
                <li><i class="fas fa-exclamation-circle text-red-600"></i> <strong>未经审批采用单一来源采购</strong>，违反政府采购规定</li>
                <li><i class="fas fa-exclamation-circle text-red-600"></i> <strong>未提供单一来源采购理由说明</strong></li>
                <li><i class="fas fa-exclamation-circle text-red-600"></i> 采购金额${data.amount}万元，应采用公开招标或竞争性谈判</li>
                <li><i class="fas fa-exclamation-triangle text-yellow-600"></i> 缺少市场调研和价格比对</li>
                <li><i class="fas fa-exclamation-triangle text-yellow-600"></i> 存在利益输送风险</li>
                <li><i class="fas fa-info-circle text-blue-600"></i> 采购程序不规范</li>
            </ul>
        `;
        suggestions = `
            <p><strong>1. 立即整改措施：</strong></p>
            <ul>
                <li>对单一来源采购进行<strong>专项审查</strong></li>
                <li>补充单一来源采购<strong>理由说明</strong></li>
                <li>如不符合单一来源条件，应<strong>重新采购</strong></li>
            </ul>
            <p><strong>2. 长期改进措施：</strong></p>
            <ul>
                <li>严格执行采购<strong>审批程序</strong></li>
                <li>加强采购方式<strong>合规性审查</strong></li>
                <li>建立采购<strong>监督机制</strong></li>
            </ul>
        `;
    } else if (data.issueType === 'split_procurement') {
        issueTitle = '该采购项目存在化整为零问题！';
        issueColor = '#DC2626';
        statusBadge = '<span class="badge badge-danger">化整为零</span>';
        findings = `
            <p><strong>具体问题清单：</strong></p>
            <ul>
                <li><i class="fas fa-exclamation-circle text-red-600"></i> <strong>将${data.splitAmount}万元采购项目拆分为${data.splitCount}个子项目</strong>，规避公开招标</li>
                <li><i class="fas fa-exclamation-circle text-red-600"></i> <strong>拆分后单个项目金额均低于招标限额</strong></li>
                <li><i class="fas fa-exclamation-circle text-red-600"></i> 采购内容相同或相近，应合并采购</li>
                <li><i class="fas fa-exclamation-triangle text-yellow-600"></i> 采购时间集中，存在故意拆分嫌疑</li>
                <li><i class="fas fa-exclamation-triangle text-yellow-600"></i> 违反政府采购法相关规定</li>
                <li><i class="fas fa-info-circle text-blue-600"></i> 可能导致采购成本增加</li>
            </ul>
            <div style="background: #FEF2F2; padding: 16px; border-radius: 6px; margin: 16px 0; border-left: 4px solid #DC2626;">
                <p style="margin: 0; color: #991B1B;"><strong>重点关注：</strong></p>
                <p style="margin: 8px 0 0 0; color: #991B1B;">该项目明显存在<strong>化整为零、规避招标</strong>行为，已移交纪检部门调查。</p>
            </div>
        `;
        suggestions = `
            <p><strong>1. 立即整改措施：</strong></p>
            <ul>
                <li>对拆分采购进行<strong>全面清查</strong></li>
                <li>对相关责任人进行<strong>严肃问责</strong></li>
                <li>移交纪检部门进行<strong>深入调查</strong></li>
            </ul>
            <p><strong>2. 长期改进措施：</strong></p>
            <ul>
                <li>建立采购项目<strong>合并审查机制</strong></li>
                <li>加强采购计划<strong>统筹管理</strong></li>
                <li>严格执行<strong>招标限额规定</strong></li>
            </ul>
        `;
    } else if (data.issueType === 'procedure_irregular') {
        issueTitle = '该采购项目程序不规范！';
        issueColor = '#D97706';
        statusBadge = '<span class="badge badge-warning">程序不规范</span>';
        findings = `
            <p><strong>具体问题清单：</strong></p>
            <ul>
                <li><i class="fas fa-exclamation-triangle text-yellow-600"></i> <strong>采购申请审批手续不完整</strong></li>
                <li><i class="fas fa-exclamation-triangle text-yellow-600"></i> <strong>询价单位数量不足3家</strong>，不符合询价采购要求</li>
                <li><i class="fas fa-exclamation-triangle text-yellow-600"></i> 采购文件缺少必要的技术参数</li>
                <li><i class="fas fa-exclamation-triangle text-yellow-600"></i> 采购结果公示不及时</li>
                <li><i class="fas fa-info-circle text-blue-600"></i> 采购档案不完整</li>
            </ul>
        `;
        suggestions = `
            <p><strong>1. 立即整改措施：</strong></p>
            <ul>
                <li>补充完善采购<strong>审批手续</strong></li>
                <li>规范询价采购<strong>程序</strong></li>
                <li>完善采购<strong>档案资料</strong></li>
            </ul>
            <p><strong>2. 长期改进措施：</strong></p>
            <ul>
                <li>建立采购<strong>流程规范</strong></li>
                <li>加强采购人员<strong>培训</strong></li>
                <li>完善采购<strong>档案管理</strong></li>
            </ul>
        `;
    } else if (data.issueType === 'price_high') {
        issueTitle = '该采购项目价格偏高！';
        issueColor = '#D97706';
        statusBadge = '<span class="badge badge-warning">价格偏高</span>';
        findings = `
            <p><strong>具体问题清单：</strong></p>
            <ul>
                <li><i class="fas fa-exclamation-triangle text-yellow-600"></i> <strong>采购价格${data.actualPrice}万元</strong>，市场价格约${data.marketPrice}万元，高出${((data.actualPrice - data.marketPrice) / data.marketPrice * 100).toFixed(1)}%</li>
                <li><i class="fas fa-exclamation-triangle text-yellow-600"></i> <strong>采购前未充分进行市场调研</strong></li>
                <li><i class="fas fa-exclamation-triangle text-yellow-600"></i> 谈判过程议价不充分</li>
                <li><i class="fas fa-exclamation-triangle text-yellow-600"></i> 缺少价格比对分析</li>
                <li><i class="fas fa-info-circle text-blue-600"></i> 采购成本控制不力</li>
            </ul>
        `;
        suggestions = `
            <p><strong>1. 立即整改措施：</strong></p>
            <ul>
                <li>对采购价格进行<strong>核查</strong></li>
                <li>加强采购<strong>市场调研</strong></li>
                <li>提高采购<strong>议价能力</strong></li>
            </ul>
            <p><strong>2. 长期改进措施：</strong></p>
            <ul>
                <li>建立采购<strong>价格数据库</strong></li>
                <li>完善采购<strong>比价机制</strong></li>
                <li>加强采购<strong>成本控制</strong></li>
            </ul>
        `;
    } else {
        issueTitle = '该采购项目程序规范，符合政府采购相关规定';
        statusBadge = '<span class="badge badge-success">合规</span>';
        findings = `
            <p><strong>合规性评价：</strong>该采购项目程序规范。</p>
            <ul>
                <li><i class="fas fa-check-circle text-green-600"></i> 采购方式选择合理，符合金额要求</li>
                <li><i class="fas fa-check-circle text-green-600"></i> 招标程序完整，公告期限符合规定</li>
                <li><i class="fas fa-check-circle text-green-600"></i> 评标过程公正，评分标准明确</li>
                <li><i class="fas fa-check-circle text-green-600"></i> 中标结果合理，价格优势明显</li>
            </ul>
        `;
        suggestions = `
            <p>1. 继续保持规范的采购管理</p>
            <p>2. 加强采购过程监督，确保公平公正</p>
        `;
    }

    return `
        <div class="detail-content">
            <div class="detail-section">
                <h4 class="detail-section-title">采购项目信息</h4>
                <div class="detail-grid">
                    <div class="detail-item"><label>项目名称</label><p>${project}</p></div>
                    <div class="detail-item"><label>采购部门</label><p>${data.department}</p></div>
                    <div class="detail-item"><label>采购编号</label><p>CG2024-${Math.floor(Math.random() * 1000).toString().padStart(4, '0')}</p></div>
                    <div class="detail-item"><label>采购方式</label><p>${data.method}</p></div>
                    <div class="detail-item"><label>采购金额</label><p style="font-size: 18px; font-weight: 600; color: #2563EB;">¥${data.amount.toFixed(2)}万</p></div>
                    <div class="detail-item"><label>供应商</label><p>${data.supplier}</p></div>
                    <div class="detail-item"><label>采购状态</label><p><span class="badge badge-${data.issueType === 'normal' ? 'success' : 'info'}">已完成</span></p></div>
                    <div class="detail-item"><label>合规性</label><p>${statusBadge}</p></div>
                </div>
            </div>
            
            ${data.issueType !== 'single_source' ? `
            <div class="detail-section">
                <h4 class="detail-section-title">${data.method === '公开招标' ? '投标情况' : '报价情况'}</h4>
                <table class="detail-table">
                    <thead>
                        <tr>
                            <th>${data.method === '公开招标' ? '投标单位' : '报价单位'}</th>
                            <th>报价金额</th>
                            ${data.method === '公开招标' ? '<th>技术得分</th><th>商务得分</th>' : ''}
                            <th>综合得分</th>
                            <th>结果</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr style="background: ${data.issueType === 'normal' ? '#F0FDF4' : '#FFFBEB'};">
                            <td><strong>${data.supplier}</strong></td>
                            <td><strong>¥${data.amount.toFixed(2)}万</strong></td>
                            ${data.method === '公开招标' ? '<td>92分</td><td>88分</td>' : ''}
                            <td><strong>90.0分</strong></td>
                            <td><span class="badge badge-success">中标</span></td>
                        </tr>
                        <tr>
                            <td>竞争单位A</td>
                            <td>¥${(data.amount * 1.05).toFixed(2)}万</td>
                            ${data.method === '公开招标' ? '<td>88分</td><td>85分</td>' : ''}
                            <td>86.5分</td>
                            <td><span class="badge badge-secondary">未中标</span></td>
                        </tr>
                        <tr>
                            <td>竞争单位B</td>
                            <td>¥${(data.amount * 1.08).toFixed(2)}万</td>
                            ${data.method === '公开招标' ? '<td>85分</td><td>82分</td>' : ''}
                            <td>83.5分</td>
                            <td><span class="badge badge-secondary">未中标</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            ` : ''}
            
            <div class="detail-section">
                <h4 class="detail-section-title">审计发现</h4>
                <div class="detail-text">
                    <p><strong style="color: ${issueColor};">审计结论：${issueTitle}</strong></p>
                    ${findings}
                </div>
            </div>
            
            ${data.issueType !== 'normal' ? `
            <div class="detail-section">
                <h4 class="detail-section-title">整改要求</h4>
                <div class="detail-text">
                    <p><strong style="color: ${issueColor};">${data.issueType === 'single_source' || data.issueType === 'split_procurement' ? '严重违规，要求立即整改（限期15天）' : '要求限期整改（限期20天）'}：</strong></p>
                    ${suggestions}
                    <p><strong>3. 责任追究：</strong></p>
                    <ul>
                        <li>对采购负责人进行<strong>约谈</strong>，要求作出书面检查</li>
                        ${data.issueType === 'split_procurement' ? '<li>对涉嫌违规人员进行<strong>立案调查</strong></li>' : ''}
                        <li>将整改情况纳入部门<strong>年度考核</strong></li>
                    </ul>
                </div>
            </div>
            <div class="detail-section">
                <h4 class="detail-section-title">后续监督</h4>
                <div class="detail-text">
                    <p>1. ${data.issueType === 'single_source' || data.issueType === 'split_procurement' ? '15' : '20'}天后进行整改情况<strong>专项检查</strong></p>
                    <p>2. 对整改不力的，将<strong>通报批评</strong>并追究领导责任</p>
                    <p>3. 建立采购审计<strong>回访制度</strong>，跟踪整改落实情况</p>
                </div>
            </div>
            ` : `
            <div class="detail-section">
                <h4 class="detail-section-title">工作建议</h4>
                <div class="detail-text">
                    ${suggestions}
                </div>
            </div>
            `}
        </div>
    `;
}


/**
 * 固定资产审计详情
 */
function getAssetsDetail(code) {
    // 不同资产的问题类型数据
    const assetData = {
        'EQ2023156': { name: '光谱分析仪', department: '化学学院', value: 68.00, purchaseDate: '2023-03-15', issueType: 'idle', idleMonths: 8 },
        'EQ2023089': { name: '质谱仪', department: '化学学院', value: 95.00, purchaseDate: '2023-05-20', issueType: 'idle', idleMonths: 6 },
        'EQ2023045': { name: '离心机', department: '生命科学学院', value: 42.00, purchaseDate: '2023-07-10', issueType: 'idle', idleMonths: 4 },
        'EQ2022178': { name: '测试设备', department: '物理学院', value: 58.00, purchaseDate: '2022-11-15', issueType: 'missing', lastCheckDate: '2024-09-20' },
        'EQ2024001': { name: '高性能计算机', department: '计算机学院', value: 85.00, purchaseDate: '2024-03-15', issueType: 'normal' },
        'EQ2024002': { name: '电子显微镜', department: '物理学院', value: 120.00, purchaseDate: '2024-01-10', issueType: 'personal_use', personalUser: '张教授' },
        'EQ2024003': { name: '实验台', department: '生命科学学院', value: 32.00, purchaseDate: '2024-04-20', issueType: 'normal' },
        'EQ2022234': { name: '色谱仪', department: '化学学院', value: 72.00, purchaseDate: '2022-12-05', issueType: 'idle', idleMonths: 10 }
    };

    const data = assetData[code] || assetData['EQ2024001'];

    let issueTitle = '';
    let issueColor = '#059669';
    let statusBadge = '';
    let findings = '';
    let suggestions = '';

    // 根据问题类型生成不同的审计结论
    if (data.issueType === 'idle') {
        issueTitle = '资产长期闲置，造成资源浪费！';
        issueColor = '#D97706';
        statusBadge = '<span class="badge badge-warning">长期闲置</span>';
        findings = `
            <p><strong>具体问题清单：</strong></p>
            <ul>
                <li><i class="fas fa-exclamation-triangle text-yellow-600"></i> 资产已<strong>闲置${data.idleMonths}个月</strong>，未有效利用</li>
                <li><i class="fas fa-exclamation-triangle text-yellow-600"></i> <strong>造成资金占用和资源浪费</strong>，价值${data.value}万元</li>
                <li><i class="fas fa-exclamation-triangle text-yellow-600"></i> <strong>未按规定办理闲置资产报备手续</strong></li>
                <li><i class="fas fa-exclamation-triangle text-yellow-600"></i> 资产使用计划不合理</li>
                <li><i class="fas fa-info-circle text-blue-600"></i> 资产管理不够规范</li>
            </ul>
        `;
        suggestions = `
            <p><strong>1. 立即整改措施：</strong></p>
            <ul>
                <li>立即启用该资产或办理<strong>调拨手续</strong></li>
                <li>如确实无法使用，按规定程序申请<strong>处置</strong></li>
                <li>补办闲置资产<strong>报备手续</strong></li>
            </ul>
            <p><strong>2. 长期改进措施：</strong></p>
            <ul>
                <li>加强资产<strong>使用管理</strong>，避免资源浪费</li>
                <li>建立闲置资产<strong>定期清查制度</strong></li>
                <li>完善资产<strong>调拨共享机制</strong></li>
            </ul>
        `;
    } else if (data.issueType === 'missing') {
        issueTitle = '资产账实不符，实物无法找到！';
        issueColor = '#DC2626';
        statusBadge = '<span class="badge badge-danger">账实不符</span>';
        findings = `
            <p><strong>具体问题清单：</strong></p>
            <ul>
                <li><i class="fas fa-exclamation-circle text-red-600"></i> <strong>资产实物无法找到</strong>，账面价值${data.value}万元</li>
                <li><i class="fas fa-exclamation-circle text-red-600"></i> <strong>最后盘点日期${data.lastCheckDate}</strong>，当时已发现实物缺失</li>
                <li><i class="fas fa-exclamation-circle text-red-600"></i> <strong>未及时报告资产丢失情况</strong></li>
                <li><i class="fas fa-exclamation-triangle text-yellow-600"></i> 资产管理责任不明确</li>
                <li><i class="fas fa-exclamation-triangle text-yellow-600"></i> 资产盘点制度执行不严</li>
                <li><i class="fas fa-info-circle text-blue-600"></i> 存在资产管理漏洞</li>
            </ul>
            <div style="background: #FEF2F2; padding: 16px; border-radius: 6px; margin: 16px 0; border-left: 4px solid #DC2626;">
                <p style="margin: 0; color: #991B1B;"><strong>重点关注：</strong></p>
                <p style="margin: 8px 0 0 0; color: #991B1B;">该资产实物无法找到，涉及金额${data.value}万元，需<strong>立即查明原因</strong>，如属丢失或盗窃，应报案处理。</p>
            </div>
        `;
        suggestions = `
            <p><strong>1. 立即整改措施：</strong></p>
            <ul>
                <li><strong>立即查明</strong>资产去向，追究相关责任</li>
                <li>如属丢失或盗窃，应<strong>报案处理</strong></li>
                <li>对资产管理责任人进行<strong>问责</strong></li>
            </ul>
            <p><strong>2. 长期改进措施：</strong></p>
            <ul>
                <li>建立资产<strong>定期盘点制度</strong></li>
                <li>明确资产<strong>管理责任</strong></li>
                <li>完善资产<strong>安全管理措施</strong></li>
            </ul>
        `;
    } else if (data.issueType === 'personal_use') {
        issueTitle = '资产被长期占用于个人项目！';
        issueColor = '#DC2626';
        statusBadge = '<span class="badge badge-danger">公物私用</span>';
        findings = `
            <p><strong>具体问题清单：</strong></p>
            <ul>
                <li><i class="fas fa-exclamation-circle text-red-600"></i> <strong>资产被${data.personalUser}长期占用</strong>，用于个人项目</li>
                <li><i class="fas fa-exclamation-circle text-red-600"></i> <strong>未办理资产借用手续</strong></li>
                <li><i class="fas fa-exclamation-circle text-red-600"></i> <strong>影响其他师生正常使用</strong>，造成资源浪费</li>
                <li><i class="fas fa-exclamation-triangle text-yellow-600"></i> 资产使用记录不完整</li>
                <li><i class="fas fa-exclamation-triangle text-yellow-600"></i> 资产共享机制未有效执行</li>
                <li><i class="fas fa-info-circle text-blue-600"></i> 存在公物私用现象</li>
            </ul>
            <div style="background: #FEF2F2; padding: 16px; border-radius: 6px; margin: 16px 0; border-left: 4px solid #DC2626;">
                <p style="margin: 0; color: #991B1B;"><strong>重点关注：</strong></p>
                <p style="margin: 8px 0 0 0; color: #991B1B;">该资产价值${data.value}万元，被${data.personalUser}长期占用于个人项目，严重影响资产使用效率，属于<strong>公物私用</strong>行为。</p>
            </div>
        `;
        suggestions = `
            <p><strong>1. 立即整改措施：</strong></p>
            <ul>
                <li><strong>立即收回</strong>被占用资产，归还部门统一管理</li>
                <li>对占用人进行<strong>批评教育</strong></li>
                <li>补办资产<strong>借用手续</strong></li>
            </ul>
            <p><strong>2. 长期改进措施：</strong></p>
            <ul>
                <li>建立资产<strong>共享使用机制</strong></li>
                <li>规范资产<strong>借用审批程序</strong></li>
                <li>加强资产使用<strong>监督检查</strong></li>
            </ul>
        `;
    } else {
        issueTitle = '资产使用正常';
        statusBadge = '<span class="badge badge-success">使用中</span>';
        findings = `
            <p><strong>审计结论：</strong>资产使用正常。</p>
            <ul>
                <li><i class="fas fa-check-circle text-green-600"></i> 资产使用率良好</li>
                <li><i class="fas fa-check-circle text-green-600"></i> 维护记录完整</li>
                <li><i class="fas fa-check-circle text-green-600"></i> 资产管理规范</li>
            </ul>
        `;
        suggestions = `
            <p>1. 继续保持良好的资产管理</p>
            <p>2. 加强资产维护保养，延长使用寿命</p>
        `;
    }

    return `
        <div class="detail-content">
            <div class="detail-section">
                <h4 class="detail-section-title">资产基本信息</h4>
                <div class="detail-grid">
                    <div class="detail-item"><label>资产编号</label><p>${code}</p></div>
                    <div class="detail-item"><label>资产名称</label><p>${data.name}</p></div>
                    <div class="detail-item"><label>使用部门</label><p>${data.department}</p></div>
                    <div class="detail-item"><label>资产价值</label><p style="font-size: 18px; font-weight: 600; color: ${data.issueType !== 'normal' ? '#DC2626' : '#2563EB'};">¥${data.value.toFixed(2)}万</p></div>
                    <div class="detail-item"><label>购置日期</label><p>${data.purchaseDate}</p></div>
                    ${data.issueType === 'idle' ? `<div class="detail-item"><label>闲置时长</label><p style="color: #DC2626; font-weight: 600;">${data.idleMonths}个月</p></div>` : ''}
                    ${data.issueType === 'missing' ? `<div class="detail-item"><label>最后盘点</label><p style="color: #DC2626;">${data.lastCheckDate}</p></div>` : ''}
                    ${data.issueType === 'personal_use' ? `<div class="detail-item"><label>占用人</label><p style="color: #DC2626; font-weight: 600;">${data.personalUser}</p></div>` : ''}
                    <div class="detail-item"><label>资产状态</label><p>${statusBadge}</p></div>
                    <div class="detail-item"><label>管理员</label><p>${data.department}资产管理员</p></div>
                </div>
            </div>
            
            <div class="detail-section">
                <h4 class="detail-section-title">审计发现</h4>
                <div class="detail-text">
                    <p><strong style="color: ${issueColor};">审计结论：${issueTitle}</strong></p>
                    ${findings}
                </div>
            </div>
            
            ${data.issueType !== 'normal' ? `
            <div class="detail-section">
                <h4 class="detail-section-title">整改要求</h4>
                <div class="detail-text">
                    <p><strong style="color: ${issueColor};">${data.issueType === 'missing' || data.issueType === 'personal_use' ? '严重问题，要求立即整改（限期10天）' : '要求限期整改（限期15天）'}：</strong></p>
                    ${suggestions}
                    <p><strong>3. 责任追究：</strong></p>
                    <ul>
                        <li>对资产管理责任人进行<strong>约谈</strong>，要求作出书面检查</li>
                        ${data.issueType === 'missing' ? '<li>如属丢失或盗窃，应<strong>报案处理</strong>并追究责任</li>' : ''}
                        ${data.issueType === 'personal_use' ? '<li>对占用人进行<strong>批评教育</strong>和通报</li>' : ''}
                        <li>将整改情况纳入部门<strong>年度考核</strong></li>
                    </ul>
                </div>
            </div>
            <div class="detail-section">
                <h4 class="detail-section-title">后续监督</h4>
                <div class="detail-text">
                    <p>1. ${data.issueType === 'missing' || data.issueType === 'personal_use' ? '10' : '15'}天后进行整改情况<strong>专项检查</strong></p>
                    <p>2. 对整改不力的，将<strong>通报批评</strong>并追究领导责任</p>
                    <p>3. 建立资产审计<strong>回访制度</strong>，跟踪整改落实情况</p>
                </div>
            </div>
            ` : `
            <div class="detail-section">
                <h4 class="detail-section-title">工作建议</h4>
                <div class="detail-text">
                    ${suggestions}
                </div>
            </div>
            `}
        </div>
    `;
}

/**
 * 招生学籍审计详情
 */
function getEnrollmentDetail(major) {
    // 定义不同问题类型的专业
    const overEnrolledMajors = ['网络工程', '物联网工程', '电子信息工程', '数据科学与大数据技术', '自动化', '机械工程'];
    const lowScoreMajors = ['信息安全', '通信工程', '电气工程', '土木工程'];

    // 定义所有专业数据（在函数顶部，供所有分支使用）
    const overPlanMajorData = {
        '网络工程': { plan: 50, enrolled: 53, minScore: 608, over: 3 },
        '物联网工程': { plan: 45, enrolled: 48, minScore: 602, over: 3 },
        '电子信息工程': { plan: 70, enrolled: 73, minScore: 610, over: 3 },
        '数据科学与大数据技术': { plan: 60, enrolled: 65, minScore: 615, over: 5 },
        '自动化': { plan: 65, enrolled: 70, minScore: 598, over: 5 },
        '机械工程': { plan: 80, enrolled: 85, minScore: 590, over: 5 }
    };

    const lowScoreMajorData = {
        '信息安全': { plan: 40, enrolled: 43, minScore: 618, over: 3, lowScoreCount: 2, minLowScore: 603 },
        '通信工程': { plan: 55, enrolled: 60, minScore: 605, over: 5, lowScoreCount: 3, minLowScore: 592 },
        '电气工程': { plan: 75, enrolled: 80, minScore: 595, over: 5, lowScoreCount: 2, minLowScore: 580 },
        '土木工程': { plan: 90, enrolled: 95, minScore: 585, over: 5, lowScoreCount: 3, minLowScore: 570 }
    };

    let plan, enrolled, minScore, overCount, statusBadge, findings, suggestions, issueType;

    // 判断问题类型
    if (overEnrolledMajors.includes(major)) {
        issueType = 'over_plan';
    } else if (lowScoreMajors.includes(major)) {
        issueType = 'low_score';
    } else {
        issueType = 'normal';
    }

    if (issueType === 'over_plan') {
        // 超计划录取情况
        const data = overPlanMajorData[major];
        plan = data.plan;
        enrolled = data.enrolled;
        minScore = data.minScore;
        overCount = data.over;
        statusBadge = '<span class="badge badge-danger">超计划录取</span>';

        findings = `
            <p><strong style="color: #DC2626;">审计发现：该专业存在超计划录取问题！</strong></p>
            <ul>
                <li><i class="fas fa-exclamation-circle text-red-600"></i> <strong>超计划录取${overCount}人</strong>，违反招生计划管理规定</li>
                <li><i class="fas fa-exclamation-circle text-red-600"></i> <strong>未经审批擅自扩大招生规模</strong></li>
                <li><i class="fas fa-exclamation-triangle text-yellow-600"></i> 招生计划执行不严格</li>
                <li><i class="fas fa-exclamation-triangle text-yellow-600"></i> 部分考生加分项目审核不严</li>
                <li><i class="fas fa-info-circle text-blue-600"></i> 招生信息公示不够及时</li>
            </ul>
            
            <div style="background: #FEF2F2; padding: 16px; border-radius: 6px; margin-top: 16px; border-left: 4px solid #DC2626;">
                <p style="margin: 0; color: #991B1B;"><strong>重点关注：</strong></p>
                <p style="margin: 8px 0 0 0; color: #991B1B;">该专业计划招生${plan}人，实际录取${enrolled}人，超计划录取${overCount}人（超出${((overCount / plan) * 100).toFixed(1)}%），违反了教育部关于招生计划管理的相关规定。</p>
            </div>
        `;

        suggestions = `
            <p><strong style="color: #DC2626;">整改要求（限期10天）：</strong></p>
            <p><strong>1. 立即整改措施：</strong></p>
            <ul>
                <li><strong>立即核查</strong>超计划录取的${overCount}名学生录取资格</li>
                <li>对招生负责人进行<strong>约谈</strong>，追究相关责任</li>
                <li>向上级主管部门<strong>报告</strong>超计划录取情况</li>
            </ul>
            <p><strong>2. 长期改进措施：</strong></p>
            <ul>
                <li>完善招生管理制度，<strong>严格执行招生计划</strong></li>
                <li>加强招生信息公开，接受社会监督</li>
                <li>建立招生<strong>预警机制</strong>，防止类似问题再次发生</li>
            </ul>
            <p><strong>3. 责任追究：</strong></p>
            <ul>
                <li>对招生负责人进行<strong>约谈</strong>，要求作出书面检查</li>
                <li>将整改情况纳入部门<strong>年度考核</strong></li>
            </ul>
        `;
    } else if (issueType === 'low_score') {
        // 低分高录情况
        const data = lowScoreMajorData[major];
        plan = data.plan;
        enrolled = data.enrolled;
        minScore = data.minScore;
        overCount = data.over;
        const lowScoreCount = data.lowScoreCount;
        const minLowScore = data.minLowScore;
        const scoreDiff = minScore - minLowScore;

        statusBadge = '<span class="badge badge-danger">低分高录</span>';

        findings = `
            <p><strong style="color: #DC2626;">审计发现：该专业存在低分高录问题！</strong></p>
            <ul>
                <li><i class="fas fa-exclamation-circle text-red-600"></i> 发现<strong>${lowScoreCount}名考生分数低于专业录取线</strong></li>
                <li><i class="fas fa-exclamation-circle text-red-600"></i> 最低录取考生分数为<strong>${minLowScore}分</strong>，低于录取线${minScore}分<strong>${scoreDiff}分</strong></li>
                <li><i class="fas fa-exclamation-circle text-red-600"></i> <strong>未提供特殊招生政策依据</strong>，录取程序不规范</li>
                <li><i class="fas fa-exclamation-triangle text-yellow-600"></i> 同时存在超计划录取${overCount}人的问题</li>
                <li><i class="fas fa-exclamation-triangle text-yellow-600"></i> 部分考生加分项目<strong>审核不严</strong></li>
                <li><i class="fas fa-info-circle text-blue-600"></i> 招生信息公示不够透明</li>
            </ul>
            
            <div style="background: #FEF2F2; padding: 16px; border-radius: 6px; margin-top: 16px; border-left: 4px solid #DC2626;">
                <p style="margin: 0; color: #991B1B;"><strong>重点关注：</strong></p>
                <p style="margin: 8px 0 0 0; color: #991B1B;">发现考生李某（考号：2024****123）文化课成绩${minLowScore}分，低于专业录取线${minScore}分<strong>${scoreDiff}分</strong>，但已被录取。</p>
                <p style="margin: 8px 0 0 0; color: #991B1B;">发现考生王某（考号：2024****456）文化课成绩${minLowScore + Math.floor(scoreDiff / 2)}分，低于专业录取线${minScore}分<strong>${Math.floor(scoreDiff / 2)}分</strong>，但已被录取。</p>
                <p style="margin: 8px 0 0 0; color: #991B1B;">以上考生均<strong>未提供特殊招生政策依据</strong>，存在违规录取嫌疑。</p>
            </div>
        `;

        suggestions = `
            <p><strong style="color: #DC2626;">整改要求（限期10天）：</strong></p>
            <p><strong>1. 立即整改措施：</strong></p>
            <ul>
                <li>对低分高录的${lowScoreCount}名考生进行<strong>专项调查</strong></li>
                <li>核查是否符合<strong>特殊招生政策</strong>（如少数民族、艺术特长等）</li>
                <li>如不符合政策，必须<strong>取消录取资格</strong></li>
                <li>对招生负责人进行<strong>严肃问责</strong></li>
            </ul>
            <p><strong>2. 长期改进措施：</strong></p>
            <ul>
                <li>严格执行<strong>招生录取标准</strong>，不得擅自降低分数线</li>
                <li>完善特殊招生政策<strong>审核机制</strong></li>
                <li>加强招生过程<strong>监督检查</strong></li>
                <li>建立招生<strong>责任追究制度</strong></li>
            </ul>
            <p><strong>3. 责任追究：</strong></p>
            <ul>
                <li>对招生负责人进行<strong>严肃问责</strong>，视情节给予处分</li>
                <li>如发现<strong>徇私舞弊</strong>行为，移交纪检部门处理</li>
                <li>将整改情况纳入部门<strong>年度考核</strong>，实行一票否决</li>
            </ul>
        `;
    } else {
        // 正常情况
        plan = major === '计算机科学与技术' ? 120 : major === '软件工程' ? 100 : 80;
        enrolled = major === '计算机科学与技术' ? 120 : major === '软件工程' ? 98 : 80;
        minScore = major === '计算机科学与技术' ? 625 : major === '软件工程' ? 618 : 632;
        statusBadge = '<span class="badge badge-success">正常</span>';

        findings = `
            <p><strong>审计结论：该专业招生录取程序规范，符合招生政策要求。</strong></p>
            <ul>
                <li><i class="fas fa-check-circle text-green-600"></i> 严格执行招生计划，未超计划录取</li>
                <li><i class="fas fa-check-circle text-green-600"></i> 录取分数符合要求，无低分高录现象</li>
                <li><i class="fas fa-check-circle text-green-600"></i> 招生程序规范，手续完备</li>
                <li><i class="fas fa-check-circle text-green-600"></i> 信息公开及时透明</li>
            </ul>
        `;

        suggestions = `
            <p>1. 继续保持规范的招生管理</p>
            <p>2. 加强招生政策宣传，提高透明度</p>
        `;
    }

    const avgScore = minScore + 13;
    const maxScore = minScore + 33;

    return `
        <div class="detail-content">
            <div class="detail-section">
                <h4 class="detail-section-title">专业信息</h4>
                <div class="detail-grid">
                    <div class="detail-item"><label>专业名称</label><p>${major}</p></div>
                    <div class="detail-item"><label>招生计划</label><p>${plan}人</p></div>
                    <div class="detail-item"><label>实际录取</label><p style="color: ${issueType !== 'normal' ? '#DC2626' : '#059669'}; font-weight: 600;">${enrolled}人</p></div>
                    <div class="detail-item"><label>完成率</label><p><span class="badge badge-${issueType !== 'normal' ? 'danger' : 'success'}">${Math.round(enrolled / plan * 100)}%</span></p></div>
                    <div class="detail-item"><label>最低分</label><p>${minScore}分</p></div>
                    <div class="detail-item"><label>平均分</label><p>${avgScore}分</p></div>
                    <div class="detail-item"><label>最高分</label><p>${maxScore}分</p></div>
                    <div class="detail-item"><label>审计状态</label><p>${statusBadge}</p></div>
                </div>
            </div>
            
            ${issueType === 'over_plan' ? `
            <div class="detail-section">
                <h4 class="detail-section-title">超计划录取明细</h4>
                <table class="detail-table">
                    <thead>
                        <tr>
                            <th>序号</th>
                            <th>考生姓名</th>
                            <th>考号</th>
                            <th>分数</th>
                            <th>录取线</th>
                            <th>差值</th>
                            <th>状态</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${Array.from({ length: overCount }, (_, i) => {
        const score = minScore + Math.floor(Math.random() * 20);
        return `
                            <tr>
                                <td>${i + 1}</td>
                                <td>${['张某', '李某', '王某', '刘某', '陈某'][i % 5]}</td>
                                <td>2024****${(123 + i * 111).toString().slice(-3)}</td>
                                <td style="color: #059669; font-weight: 600;">${score}分</td>
                                <td>${minScore}分</td>
                                <td style="color: #059669; font-weight: 600;">+${score - minScore}分</td>
                                <td><span class="badge badge-success">正常</span></td>
                            </tr>
                            `;
    }).join('')}
                    </tbody>
                </table>
            </div>
            ` : ''}
            
            ${issueType === 'low_score' ? `
            <div class="detail-section">
                <h4 class="detail-section-title">低分高录明细</h4>
                <table class="detail-table">
                    <thead>
                        <tr>
                            <th>序号</th>
                            <th>考生姓名</th>
                            <th>考号</th>
                            <th>分数</th>
                            <th>录取线</th>
                            <th>差值</th>
                            <th>特殊政策</th>
                            <th>状态</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr style="background: #FEF2F2;">
                            <td>1</td>
                            <td>李某</td>
                            <td>2024****123</td>
                            <td style="color: #DC2626; font-weight: 600;">${lowScoreMajorData[major]?.minLowScore || minScore - 15}分</td>
                            <td>${minScore}分</td>
                            <td style="color: #DC2626; font-weight: 600;">-${minScore - (lowScoreMajorData[major]?.minLowScore || minScore - 15)}分</td>
                            <td style="color: #DC2626;">未提供</td>
                            <td><span class="badge badge-danger">违规录取</span></td>
                        </tr>
                        <tr style="background: #FEF2F2;">
                            <td>2</td>
                            <td>王某</td>
                            <td>2024****456</td>
                            <td style="color: #DC2626; font-weight: 600;">${(lowScoreMajorData[major]?.minLowScore || minScore - 15) + Math.floor((minScore - (lowScoreMajorData[major]?.minLowScore || minScore - 15)) / 2)}分</td>
                            <td>${minScore}分</td>
                            <td style="color: #DC2626; font-weight: 600;">-${Math.floor((minScore - (lowScoreMajorData[major]?.minLowScore || minScore - 15)) / 2)}分</td>
                            <td style="color: #DC2626;">未提供</td>
                            <td><span class="badge badge-danger">违规录取</span></td>
                        </tr>
                        ${issueType === 'low_score' && (lowScoreMajorData[major]?.lowScoreCount || 2) > 2 ? `
                        <tr style="background: #FEF2F2;">
                            <td>3</td>
                            <td>赵某</td>
                            <td>2024****789</td>
                            <td style="color: #DC2626; font-weight: 600;">${(lowScoreMajorData[major]?.minLowScore || minScore - 15) + Math.floor((minScore - (lowScoreMajorData[major]?.minLowScore || minScore - 15)) / 3)}分</td>
                            <td>${minScore}分</td>
                            <td style="color: #DC2626; font-weight: 600;">-${Math.floor((minScore - (lowScoreMajorData[major]?.minLowScore || minScore - 15)) / 3)}分</td>
                            <td style="color: #DC2626;">未提供</td>
                            <td><span class="badge badge-danger">违规录取</span></td>
                        </tr>
                        ` : ''}
                    </tbody>
                </table>
            </div>
            ` : ''}
            
            <div class="detail-section">
                <h4 class="detail-section-title">审计发现</h4>
                <div class="detail-text">${findings}</div>
            </div>
            
            <div class="detail-section">
                <h4 class="detail-section-title">${issueType !== 'normal' ? '整改要求' : '工作建议'}</h4>
                <div class="detail-text">${suggestions}</div>
            </div>
            
            ${issueType !== 'normal' ? `
            <div class="detail-section">
                <h4 class="detail-section-title">后续监督</h4>
                <div class="detail-text">
                    <p>1. 10天后进行整改情况<strong>专项检查</strong></p>
                    <p>2. 对整改不力的，将<strong>通报批评</strong>并追究领导责任</p>
                    <p>3. 建立招生审计<strong>回访制度</strong>，跟踪整改落实情况</p>
                    <p>4. 将整改情况报送<strong>上级主管部门</strong></p>
                </div>
            </div>
            ` : ''}
        </div>
    `;
}

/**
 * 工程项目审计详情
 */
function getProjectDetail(name) {
    // 不同类型的项目数据
    const projectData = {
        '新教学楼建设': {
            budget: 6800, used: 7140, progress: 95, issueType: 'over_budget',
            overBudget: 340, delayDays: 0,
            issues: ['超预算5%', '变更频繁23次', '材料价格上涨'],
            leader: '基建处', contractor: 'XX建筑公司', supervisor: 'YY监理公司',
            startDate: '2023-06-01', planEndDate: '2024-12-31'
        },
        '图书馆扩建': {
            budget: 4200, used: 4410, progress: 98, issueType: 'over_budget',
            overBudget: 210, delayDays: 0,
            issues: ['超预算5%', '设计变更18次', '隐蔽工程验收不规范'],
            leader: '图书馆', contractor: 'ZZ建设集团', supervisor: 'AA监理公司',
            startDate: '2023-08-01', planEndDate: '2024-10-31'
        },
        '学生宿舍改造': {
            budget: 2500, used: 2375, progress: 65, issueType: 'delay',
            overBudget: 0, delayDays: 120,
            issues: ['工期延误120天', '施工进度缓慢', '人员配备不足'],
            leader: '后勤处', contractor: 'BB建筑公司', supervisor: 'CC监理公司',
            startDate: '2023-05-01', planEndDate: '2024-08-31', actualEndDate: '预计2024-12-29'
        },
        '实验室装修': {
            budget: 850, used: 807.5, progress: 70, issueType: 'quality',
            overBudget: 0, delayDays: 45,
            issues: ['质量问题严重', '返工3次', '材料不合格'],
            leader: '物理学院', contractor: 'DD装饰公司', supervisor: 'EE监理公司',
            startDate: '2024-01-01', planEndDate: '2024-06-30', actualEndDate: '预计2024-08-14'
        },
        '体育馆维修': {
            budget: 1200, used: 1140, progress: 55, issueType: 'bidding',
            overBudget: 0, delayDays: 90,
            issues: ['招标程序违规', '存在围标嫌疑', '评标不公正'],
            leader: '体育部', contractor: 'FF建设公司', supervisor: 'GG监理公司',
            startDate: '2023-09-01', planEndDate: '2024-05-31', actualEndDate: '预计2024-08-29'
        },
        '校园道路改造': {
            budget: 1500, used: 1575, progress: 100, issueType: 'over_budget',
            overBudget: 75, delayDays: 0,
            issues: ['超预算5%', '地下管网改造', '签证单管理混乱'],
            leader: '基建处', contractor: 'HH市政公司', supervisor: 'II监理公司',
            startDate: '2023-07-01', planEndDate: '2024-09-30'
        },
        '食堂扩建': {
            budget: 1800, used: 1710, progress: 60, issueType: 'delay',
            overBudget: 0, delayDays: 150,
            issues: ['工期延误150天', '资金拨付延迟', '设计方案多次调整'],
            leader: '后勤处', contractor: 'JJ建筑公司', supervisor: 'KK监理公司',
            startDate: '2023-04-01', planEndDate: '2024-07-31', actualEndDate: '预计2024-12-28'
        },
        '停车场建设': {
            budget: 800, used: 760, progress: 68, issueType: 'quality',
            overBudget: 0, delayDays: 60,
            issues: ['质量问题', '排水系统不达标', '地基处理不当'],
            leader: '保卫处', contractor: 'LL工程公司', supervisor: 'MM监理公司',
            startDate: '2024-02-01', planEndDate: '2024-08-31', actualEndDate: '预计2024-10-30'
        }
    };

    const data = projectData[name] || projectData['新教学楼建设'];
    const overRate = data.overBudget > 0 ? ((data.overBudget / data.budget) * 100).toFixed(1) : '0.0';

    // 根据问题类型生成不同的审计结论
    let issueTitle = '';
    let issueColor = '#DC2626';
    let issueDetails = '';
    let rectificationRequirements = '';

    if (data.issueType === 'over_budget') {
        issueTitle = '该项目存在严重超预算问题，需立即整改！';
        issueDetails = `
            <p><strong>具体问题清单：</strong></p>
            <ul>
                <li><i class="fas fa-exclamation-circle text-red-600"></i> <strong>预算超支${overRate}%</strong>，超支金额${data.overBudget.toFixed(2)}万元</li>
                <li><i class="fas fa-exclamation-circle text-red-600"></i> <strong>设计变更频繁</strong>，共发生${data.issues[1] || '多次'}变更，未严格履行审批程序</li>
                <li><i class="fas fa-exclamation-circle text-red-600"></i> <strong>隐蔽工程验收不规范</strong>，部分隐蔽工程未经监理签字即进入下一工序</li>
                <li><i class="fas fa-exclamation-triangle text-yellow-600"></i> <strong>材料价格上涨</strong>，但未及时调整预算或采取控制措施</li>
                <li><i class="fas fa-exclamation-triangle text-yellow-600"></i> <strong>签证单管理混乱</strong>，部分工程签证缺少必要的审批手续</li>
                <li><i class="fas fa-exclamation-triangle text-yellow-600"></i> <strong>工程量清单不准确</strong>，实际工程量与预算差异较大</li>
                <li><i class="fas fa-exclamation-triangle text-yellow-600"></i> <strong>质量整改费用</strong>，因施工质量问题产生返工费用约${(data.overBudget * 0.3).toFixed(2)}万元</li>
            </ul>
        `;
        rectificationRequirements = `
            <p><strong>1. 预算管理方面：</strong></p>
            <ul>
                <li>对超支的${data.overBudget.toFixed(2)}万元进行<strong>逐项核查</strong>，分析超支原因</li>
                <li>对不合理支出进行<strong>追回</strong>，对相关责任人进行问责</li>
                <li>完善预算调整审批程序，严格控制项目成本</li>
            </ul>
            <p><strong>2. 设计变更管理：</strong></p>
            <ul>
                <li>对所有设计变更进行<strong>合规性审查</strong></li>
                <li>未履行审批程序的变更，追究相关人员责任</li>
                <li>建立严格的设计变更审批制度</li>
            </ul>
        `;
    } else if (data.issueType === 'delay') {
        issueTitle = '该项目存在严重工期延误问题，需加快进度！';
        issueColor = '#D97706';
        issueDetails = `
            <p><strong>具体问题清单：</strong></p>
            <ul>
                <li><i class="fas fa-exclamation-circle text-red-600"></i> <strong>工期延误${data.delayDays}天</strong>，严重影响项目交付</li>
                <li><i class="fas fa-exclamation-circle text-red-600"></i> <strong>施工进度缓慢</strong>，实际进度仅${data.progress}%，远低于计划进度</li>
                <li><i class="fas fa-exclamation-triangle text-yellow-600"></i> <strong>人员配备不足</strong>，施工队伍人数不足合同要求</li>
                <li><i class="fas fa-exclamation-triangle text-yellow-600"></i> <strong>设备投入不足</strong>，关键施工设备未按计划到位</li>
                <li><i class="fas fa-exclamation-triangle text-yellow-600"></i> <strong>材料供应延迟</strong>，多次出现材料供应不及时情况</li>
                <li><i class="fas fa-info-circle text-blue-600"></i> 施工组织不合理，工序安排存在问题</li>
            </ul>
        `;
        rectificationRequirements = `
            <p><strong>1. 进度管理方面：</strong></p>
            <ul>
                <li>立即制定<strong>赶工方案</strong>，增加人员和设备投入</li>
                <li>优化施工组织，合理安排工序，提高施工效率</li>
                <li>建立每日进度报告制度，及时发现和解决问题</li>
            </ul>
            <p><strong>2. 资源保障方面：</strong></p>
            <ul>
                <li>确保施工人员和设备<strong>按合同要求配备</strong></li>
                <li>加强材料供应管理，建立材料储备机制</li>
                <li>协调解决影响施工的外部因素</li>
            </ul>
        `;
    } else if (data.issueType === 'quality') {
        issueTitle = '该项目存在严重质量问题，需立即整改！';
        issueDetails = `
            <p><strong>具体问题清单：</strong></p>
            <ul>
                <li><i class="fas fa-exclamation-circle text-red-600"></i> <strong>质量问题严重</strong>，已发现多处质量缺陷</li>
                <li><i class="fas fa-exclamation-circle text-red-600"></i> <strong>返工次数多</strong>，因质量问题已返工3次，造成工期延误${data.delayDays}天</li>
                <li><i class="fas fa-exclamation-circle text-red-600"></i> <strong>材料不合格</strong>，部分材料未经检验即投入使用</li>
                <li><i class="fas fa-exclamation-triangle text-yellow-600"></i> <strong>隐蔽工程验收不规范</strong>，存在未验收即覆盖的情况</li>
                <li><i class="fas fa-exclamation-triangle text-yellow-600"></i> <strong>施工工艺不达标</strong>，部分工序未按规范施工</li>
                <li><i class="fas fa-exclamation-triangle text-yellow-600"></i> <strong>监理履职不到位</strong>，未及时发现和制止质量问题</li>
            </ul>
        `;
        rectificationRequirements = `
            <p><strong>1. 质量管理方面：</strong></p>
            <ul>
                <li>对已完工程进行<strong>全面质量复查</strong>，发现问题立即整改</li>
                <li>对不合格材料进行<strong>清退</strong>，重新采购合格材料</li>
                <li>加强施工过程质量控制，严格执行施工规范</li>
            </ul>
            <p><strong>2. 监理管理方面：</strong></p>
            <ul>
                <li>约谈监理单位，要求<strong>加强现场监管</strong></li>
                <li>增加监理人员，提高监理频次</li>
                <li>建立质量问题报告制度，及时发现和处理问题</li>
            </ul>
        `;
    } else if (data.issueType === 'bidding') {
        issueTitle = '该项目招投标程序存在严重违规，需彻查！';
        issueDetails = `
            <p><strong>具体问题清单：</strong></p>
            <ul>
                <li><i class="fas fa-exclamation-circle text-red-600"></i> <strong>招标程序违规</strong>，未按规定公开招标信息</li>
                <li><i class="fas fa-exclamation-circle text-red-600"></i> <strong>存在围标嫌疑</strong>，3家投标单位存在关联关系</li>
                <li><i class="fas fa-exclamation-circle text-red-600"></i> <strong>评标不公正</strong>，评标标准设置不合理，倾向性明显</li>
                <li><i class="fas fa-exclamation-triangle text-yellow-600"></i> <strong>评委资质存疑</strong>，部分评委专业背景与项目不符</li>
                <li><i class="fas fa-exclamation-triangle text-yellow-600"></i> <strong>中标价格异常</strong>，中标价格明显高于市场价格</li>
                <li><i class="fas fa-exclamation-triangle text-yellow-600"></i> <strong>合同条款不合理</strong>，存在明显偏向承包方的条款</li>
            </ul>
            <div style="background: #FEF2F2; padding: 16px; border-radius: 6px; margin: 16px 0; border-left: 4px solid #DC2626;">
                <p style="margin: 0; color: #991B1B;"><strong>重点关注：</strong></p>
                <p style="margin: 8px 0 0 0; color: #991B1B;">经调查发现，3家投标单位的法定代表人存在亲属关系，且注册地址相同，存在<strong>明显的围标串标嫌疑</strong>，建议移交纪检部门进一步调查。</p>
            </div>
        `;
        rectificationRequirements = `
            <p><strong>1. 招标程序方面：</strong></p>
            <ul>
                <li>对招标过程进行<strong>全面审查</strong>，查明违规责任</li>
                <li>对涉嫌围标串标的单位进行<strong>调查取证</strong></li>
                <li>考虑<strong>废标重新招标</strong>，确保招标公平公正</li>
            </ul>
            <p><strong>2. 责任追究方面：</strong></p>
            <ul>
                <li>对招标负责人进行<strong>严肃问责</strong></li>
                <li>将涉嫌违规的单位列入<strong>黑名单</strong></li>
                <li>移交纪检部门进行<strong>深入调查</strong></li>
            </ul>
        `;
    }

    return `
        <div class="detail-content">
            <div class="detail-section">
                <h4 class="detail-section-title">项目基本信息</h4>
                <div class="detail-grid">
                    <div class="detail-item"><label>项目名称</label><p>${name}</p></div>
                    <div class="detail-item"><label>项目负责人</label><p>${data.leader}</p></div>
                    <div class="detail-item"><label>项目编号</label><p>JJ2023-${Math.floor(Math.random() * 100).toString().padStart(3, '0')}</p></div>
                    <div class="detail-item"><label>建设单位</label><p>学校${data.leader}</p></div>
                    <div class="detail-item"><label>施工单位</label><p>${data.contractor}</p></div>
                    <div class="detail-item"><label>监理单位</label><p>${data.supervisor}</p></div>
                    <div class="detail-item"><label>开工日期</label><p>${data.startDate}</p></div>
                    <div class="detail-item"><label>计划完工</label><p>${data.planEndDate}</p></div>
                    ${data.actualEndDate ? `<div class="detail-item"><label>预计完工</label><p style="color: #D97706; font-weight: 600;">${data.actualEndDate}</p></div>` : ''}
                    ${data.delayDays > 0 ? `<div class="detail-item"><label>延误天数</label><p style="color: #DC2626; font-weight: 600;">${data.delayDays}天</p></div>` : ''}
                </div>
            </div>
            
            <div class="detail-section">
                <h4 class="detail-section-title">预算执行情况</h4>
                <div class="detail-grid">
                    <div class="detail-item"><label>项目预算</label><p style="font-size: 18px; font-weight: 600; color: #2563EB;">¥${data.budget.toFixed(2)}万</p></div>
                    <div class="detail-item"><label>已使用金额</label><p style="font-size: 18px; font-weight: 600; color: ${data.overBudget > 0 ? '#DC2626' : '#6B7280'};">¥${data.used.toFixed(2)}万</p></div>
                    <div class="detail-item"><label>${data.overBudget > 0 ? '超支金额' : '剩余预算'}</label><p style="font-size: 18px; font-weight: 600; color: ${data.overBudget > 0 ? '#DC2626' : '#059669'};">¥${data.overBudget > 0 ? data.overBudget.toFixed(2) : (data.budget - data.used).toFixed(2)}万</p></div>
                    <div class="detail-item"><label>${data.overBudget > 0 ? '超支率' : '执行率'}</label><p style="font-size: 18px; font-weight: 600; color: ${data.overBudget > 0 ? '#DC2626' : '#059669'};">${data.overBudget > 0 ? overRate : ((data.used / data.budget) * 100).toFixed(1)}%</p></div>
                    <div class="detail-item"><label>项目进度</label><p style="font-size: 18px; font-weight: 600; color: ${data.progress >= 100 ? '#059669' : data.progress >= 80 ? '#2563EB' : '#D97706'};">${data.progress}%</p></div>
                    <div class="detail-item"><label>进度状态</label><p><span class="badge badge-${data.progress >= 100 ? 'success' : data.progress >= 80 ? 'info' : 'warning'}">${data.progress >= 100 ? '已完工' : data.progress >= 80 ? '正常施工' : '进度滞后'}</span></p></div>
                    <div class="detail-item"><label>审计状态</label><p><span class="badge badge-danger">发现问题</span></p></div>
                    <div class="detail-item"><label>风险等级</label><p><span class="badge badge-${data.issueType === 'bidding' || data.issueType === 'over_budget' ? 'danger' : 'warning'}">${data.issueType === 'bidding' || data.issueType === 'over_budget' ? '高风险' : '中风险'}</span></p></div>
                </div>
            </div>
            
            <div class="detail-section">
                <h4 class="detail-section-title">招投标情况</h4>
                <table class="detail-table">
                    <thead>
                        <tr>
                            <th>投标单位</th>
                            <th>投标金额</th>
                            <th>技术得分</th>
                            <th>商务得分</th>
                            <th>综合得分</th>
                            <th>结果</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${data.issueType === 'bidding' ? `
                        <tr style="background: #FEF2F2;">
                            <td><strong>${data.contractor}</strong></td>
                            <td><strong>¥${data.budget.toFixed(2)}万</strong></td>
                            <td>88分</td>
                            <td>92分</td>
                            <td><strong>90.0分</strong></td>
                            <td><span class="badge badge-danger">中标（存疑）</span></td>
                        </tr>
                        <tr style="background: #FFFBEB;">
                            <td>关联单位A</td>
                            <td>¥${(data.budget * 0.99).toFixed(2)}万</td>
                            <td>90分</td>
                            <td>88分</td>
                            <td>89.2分</td>
                            <td><span class="badge badge-warning">未中标（围标嫌疑）</span></td>
                        </tr>
                        <tr style="background: #FFFBEB;">
                            <td>关联单位B</td>
                            <td>¥${(data.budget * 1.01).toFixed(2)}万</td>
                            <td>86分</td>
                            <td>85分</td>
                            <td>85.6分</td>
                            <td><span class="badge badge-warning">未中标（围标嫌疑）</span></td>
                        </tr>
                        ` : `
                        <tr style="background: #F0FDF4;">
                            <td><strong>${data.contractor}</strong></td>
                            <td><strong>¥${data.budget.toFixed(2)}万</strong></td>
                            <td>88分</td>
                            <td>92分</td>
                            <td><strong>90.0分</strong></td>
                            <td><span class="badge badge-success">中标</span></td>
                        </tr>
                        <tr>
                            <td>投标单位B</td>
                            <td>¥${(data.budget * 0.98).toFixed(2)}万</td>
                            <td>92分</td>
                            <td>85分</td>
                            <td>88.8分</td>
                            <td><span class="badge badge-secondary">未中标</span></td>
                        </tr>
                        <tr>
                            <td>投标单位C</td>
                            <td>¥${(data.budget * 1.02).toFixed(2)}万</td>
                            <td>85分</td>
                            <td>88分</td>
                            <td>86.6分</td>
                            <td><span class="badge badge-secondary">未中标</span></td>
                        </tr>
                        `}
                    </tbody>
                </table>
            </div>
            
            <div class="detail-section">
                <h4 class="detail-section-title">审计发现问题</h4>
                <div class="detail-text">
                    <p><strong style="color: ${issueColor};">审计结论：${issueTitle}</strong></p>
                    
                    <div style="background: ${data.issueType === 'bidding' || data.issueType === 'over_budget' ? '#FEF2F2' : '#FFFBEB'}; padding: 16px; border-radius: 6px; margin: 16px 0; border-left: 4px solid ${issueColor};">
                        <p style="margin: 0; color: ${data.issueType === 'bidding' || data.issueType === 'over_budget' ? '#991B1B' : '#92400E'};"><strong>主要问题：</strong></p>
                        <ul style="margin: 8px 0 0 20px; color: ${data.issueType === 'bidding' || data.issueType === 'over_budget' ? '#991B1B' : '#92400E'};">
                            ${data.issues.map(issue => `<li>${issue}</li>`).join('')}
                        </ul>
                    </div>
                    
                    ${issueDetails}
                    
                    ${data.issueType !== 'bidding' ? `
                    <div style="background: #FFFBEB; padding: 16px; border-radius: 6px; margin: 16px 0; border-left: 4px solid #F59E0B;">
                        <p style="margin: 0; color: #92400E;"><strong>其他问题：</strong></p>
                        <ul style="margin: 8px 0 0 20px; color: #92400E;">
                            <li>项目管理制度执行不严格</li>
                            <li>施工现场管理存在漏洞</li>
                            <li>档案资料不够完整规范</li>
                        </ul>
                    </div>
                    ` : ''}
                </div>
            </div>
            
            <div class="detail-section">
                <h4 class="detail-section-title">整改要求</h4>
                <div class="detail-text">
                    <p><strong style="color: ${issueColor};">${data.issueType === 'bidding' ? '严重违规，要求立即整改（限期10天）' : data.issueType === 'over_budget' ? '严重违规，要求立即整改（限期15天）' : '要求限期整改（限期20天）'}：</strong></p>
                    
                    ${rectificationRequirements}
                    
                    <p><strong>${data.issueType === 'bidding' ? '3' : data.issueType === 'over_budget' ? '3' : '3'}. 责任追究：</strong></p>
                    <ul>
                        <li>对项目负责人进行<strong>约谈</strong>，要求作出书面检查</li>
                        ${data.issueType === 'bidding' ? '<li>对涉嫌违规人员进行<strong>立案调查</strong></li>' : ''}
                        <li>对造成重大损失的责任人，按规定给予<strong>纪律处分</strong></li>
                        <li>将本项目作为<strong>反面教材</strong>，加强项目管理培训</li>
                    </ul>
                </div>
            </div>
            
            <div class="detail-section">
                <h4 class="detail-section-title">后续监督</h4>
                <div class="detail-text">
                    <p>1. 15天后进行整改情况<strong>专项检查</strong></p>
                    <p>2. 对整改不力的，将<strong>通报批评</strong>并追究领导责任</p>
                    <p>3. 建立项目审计<strong>回访制度</strong>，跟踪整改落实情况</p>
                    <p>4. 将整改情况纳入部门年度考核</p>
                </div>
            </div>
        </div>
    `;
}

/**
 * 薪酬社保审计详情
 */
function getSalaryDetail(department) {
    // 不同部门的问题类型数据
    const departmentData = {
        '计算机学院': {
            count: 156, salary: 468.00, social: 93.60, issueType: 'ghost_employee',
            ghostCount: 2, ghostAmount: 18.5
        },
        '经济学院': {
            count: 128, salary: 384.00, social: 76.80, issueType: 'salary_standard_violation',
            violationAmount: 45.2, violationCount: 15
        },
        '物理学院': {
            count: 142, salary: 426.00, social: 85.20, issueType: 'social_security_underpaid',
            underpaidAmount: 12.8, underpaidCount: 8
        },
        '化学学院': {
            count: 135, salary: 405.00, social: 81.00, issueType: 'allowance_irregular',
            irregularAmount: 28.5, irregularCount: 12
        },
        '生命科学学院': {
            count: 118, salary: 354.00, social: 70.80, issueType: 'normal'
        },
        '外国语学院': {
            count: 95, salary: 285.00, social: 57.00, issueType: 'overtime_pay_missing',
            missingAmount: 15.6, missingCount: 23
        },
        '数学学院': {
            count: 108, salary: 324.00, social: 64.80, issueType: 'normal'
        },
        '历史学院': {
            count: 82, salary: 246.00, social: 49.20, issueType: 'duplicate_payment',
            duplicateAmount: 8.5, duplicateCount: 3
        }
    };

    const data = departmentData[department] || departmentData['生命科学学院'];

    let issueTitle = '';
    let issueColor = '#059669';
    let issueDetails = '';
    let rectificationRequirements = '';
    let statusBadge = '<span class="badge badge-success">正常</span>';

    if (data.issueType === 'ghost_employee') {
        issueTitle = '该部门存在虚报冒领问题，需立即整改！';
        issueColor = '#DC2626';
        statusBadge = '<span class="badge badge-danger">发现问题</span>';
        issueDetails = `
            <p><strong>具体问题清单：</strong></p>
            <ul>
                <li><i class="fas fa-exclamation-circle text-red-600"></i> <strong>虚报人员${data.ghostCount}人</strong>，涉及金额${data.ghostAmount}万元</li>
                <li><i class="fas fa-exclamation-circle text-red-600"></i> <strong>已离职人员仍在发放工资</strong>，存在虚报冒领行为</li>
                <li><i class="fas fa-exclamation-triangle text-yellow-600"></i> 人员信息更新不及时，存在管理漏洞</li>
                <li><i class="fas fa-exclamation-triangle text-yellow-600"></i> 工资发放审核不严格</li>
                <li><i class="fas fa-info-circle text-blue-600"></i> 未建立离职人员工资停发机制</li>
            </ul>
        `;
        rectificationRequirements = `
            <p><strong>1. 立即追回违规资金：</strong></p>
            <ul>
                <li>对虚报冒领的${data.ghostAmount}万元进行<strong>全额追回</strong></li>
                <li>对相关责任人进行<strong>严肃问责</strong></li>
                <li>将涉案人员移交<strong>纪检部门调查</strong></li>
            </ul>
            <p><strong>2. 完善管理制度：</strong></p>
            <ul>
                <li>建立离职人员工资<strong>自动停发机制</strong></li>
                <li>加强人员信息<strong>动态管理</strong></li>
                <li>完善工资发放<strong>审核流程</strong></li>
            </ul>
        `;
    } else if (data.issueType === 'salary_standard_violation') {
        issueTitle = '该部门存在违规发放薪酬问题，需立即整改！';
        issueColor = '#DC2626';
        statusBadge = '<span class="badge badge-danger">发现问题</span>';
        issueDetails = `
            <p><strong>具体问题清单：</strong></p>
            <ul>
                <li><i class="fas fa-exclamation-circle text-red-600"></i> <strong>违规发放津贴补贴</strong>，涉及${data.violationCount}人，金额${data.violationAmount}万元</li>
                <li><i class="fas fa-exclamation-circle text-red-600"></i> <strong>超标准发放绩效工资</strong>，违反薪酬管理规定</li>
                <li><i class="fas fa-exclamation-triangle text-yellow-600"></i> 发放名目不规范，存在"巧立名目"现象</li>
                <li><i class="fas fa-exclamation-triangle text-yellow-600"></i> 未经审批擅自提高津贴标准</li>
                <li><i class="fas fa-info-circle text-blue-600"></i> 薪酬发放缺少必要的审批手续</li>
            </ul>
        `;
        rectificationRequirements = `
            <p><strong>1. 清理违规发放：</strong></p>
            <ul>
                <li>对违规发放的${data.violationAmount}万元进行<strong>清退</strong></li>
                <li>严格执行薪酬<strong>标准和审批程序</strong></li>
                <li>对相关责任人进行<strong>约谈和问责</strong></li>
            </ul>
            <p><strong>2. 规范薪酬管理：</strong></p>
            <ul>
                <li>严格执行国家和学校<strong>薪酬政策</strong></li>
                <li>规范津贴补贴<strong>发放名目和标准</strong></li>
                <li>加强薪酬发放<strong>审核监督</strong></li>
            </ul>
        `;
    } else if (data.issueType === 'social_security_underpaid') {
        issueTitle = '该部门存在社保少缴问题，需立即整改！';
        issueColor = '#D97706';
        statusBadge = '<span class="badge badge-warning">发现问题</span>';
        issueDetails = `
            <p><strong>具体问题清单：</strong></p>
            <ul>
                <li><i class="fas fa-exclamation-triangle text-yellow-600"></i> <strong>社保缴费基数偏低</strong>，涉及${data.underpaidCount}人，少缴${data.underpaidAmount}万元</li>
                <li><i class="fas fa-exclamation-triangle text-yellow-600"></i> 未按实际工资足额缴纳社保</li>
                <li><i class="fas fa-exclamation-triangle text-yellow-600"></i> 部分临时工未缴纳社保</li>
                <li><i class="fas fa-info-circle text-blue-600"></i> 社保缴纳基数调整不及时</li>
            </ul>
        `;
        rectificationRequirements = `
            <p><strong>1. 补缴社保：</strong></p>
            <ul>
                <li>对少缴的${data.underpaidAmount}万元进行<strong>补缴</strong></li>
                <li>按实际工资<strong>足额缴纳</strong>社保</li>
                <li>及时调整社保<strong>缴费基数</strong></li>
            </ul>
            <p><strong>2. 完善社保管理：</strong></p>
            <ul>
                <li>建立社保缴纳<strong>核查机制</strong></li>
                <li>确保临时工社保<strong>应缴尽缴</strong></li>
                <li>加强社保政策<strong>学习培训</strong></li>
            </ul>
        `;
    } else if (data.issueType === 'allowance_irregular') {
        issueTitle = '该部门津贴发放不规范，需加强管理！';
        issueColor = '#D97706';
        statusBadge = '<span class="badge badge-warning">发现问题</span>';
        issueDetails = `
            <p><strong>具体问题清单：</strong></p>
            <ul>
                <li><i class="fas fa-exclamation-triangle text-yellow-600"></i> <strong>津贴发放标准不统一</strong>，涉及${data.irregularCount}人，金额${data.irregularAmount}万元</li>
                <li><i class="fas fa-exclamation-triangle text-yellow-600"></i> 同岗不同酬现象存在</li>
                <li><i class="fas fa-exclamation-triangle text-yellow-600"></i> 津贴发放依据不充分</li>
                <li><i class="fas fa-info-circle text-blue-600"></i> 津贴发放缺少明确的管理办法</li>
            </ul>
        `;
        rectificationRequirements = `
            <p><strong>1. 规范津贴发放：</strong></p>
            <ul>
                <li>制定明确的<strong>津贴发放标准</strong></li>
                <li>确保同岗同酬，<strong>公平公正</strong></li>
                <li>完善津贴发放<strong>审批程序</strong></li>
            </ul>
            <p><strong>2. 加强制度建设：</strong></p>
            <ul>
                <li>制定津贴发放<strong>管理办法</strong></li>
                <li>建立津贴发放<strong>公示制度</strong></li>
                <li>加强津贴发放<strong>监督检查</strong></li>
            </ul>
        `;
    } else if (data.issueType === 'overtime_pay_missing') {
        issueTitle = '该部门存在加班费未发放问题，需立即整改！';
        issueColor = '#D97706';
        statusBadge = '<span class="badge badge-warning">发现问题</span>';
        issueDetails = `
            <p><strong>具体问题清单：</strong></p>
            <ul>
                <li><i class="fas fa-exclamation-triangle text-yellow-600"></i> <strong>加班费未按规定发放</strong>，涉及${data.missingCount}人，金额${data.missingAmount}万元</li>
                <li><i class="fas fa-exclamation-triangle text-yellow-600"></i> 节假日加班未支付加班费</li>
                <li><i class="fas fa-exclamation-triangle text-yellow-600"></i> 加班记录不完整</li>
                <li><i class="fas fa-info-circle text-blue-600"></i> 加班审批制度执行不严</li>
            </ul>
        `;
        rectificationRequirements = `
            <p><strong>1. 补发加班费：</strong></p>
            <ul>
                <li>对欠发的${data.missingAmount}万元加班费进行<strong>补发</strong></li>
                <li>严格执行<strong>加班费发放标准</strong></li>
                <li>确保加班费<strong>及时足额发放</strong></li>
            </ul>
            <p><strong>2. 完善加班管理：</strong></p>
            <ul>
                <li>建立完善的<strong>加班审批制度</strong></li>
                <li>规范加班<strong>记录和统计</strong></li>
                <li>加强加班费发放<strong>监督检查</strong></li>
            </ul>
        `;
    } else if (data.issueType === 'duplicate_payment') {
        issueTitle = '该部门存在重复发放问题，需立即整改！';
        issueColor = '#DC2626';
        statusBadge = '<span class="badge badge-danger">发现问题</span>';
        issueDetails = `
            <p><strong>具体问题清单：</strong></p>
            <ul>
                <li><i class="fas fa-exclamation-circle text-red-600"></i> <strong>重复发放工资</strong>，涉及${data.duplicateCount}人，金额${data.duplicateAmount}万元</li>
                <li><i class="fas fa-exclamation-circle text-red-600"></i> 系统数据不同步导致重复发放</li>
                <li><i class="fas fa-exclamation-triangle text-yellow-600"></i> 工资发放审核不严格</li>
                <li><i class="fas fa-info-circle text-blue-600"></i> 缺少重复发放预警机制</li>
            </ul>
        `;
        rectificationRequirements = `
            <p><strong>1. 追回重复发放资金：</strong></p>
            <ul>
                <li>对重复发放的${data.duplicateAmount}万元进行<strong>全额追回</strong></li>
                <li>核查是否存在<strong>其他重复发放</strong>情况</li>
                <li>对相关责任人进行<strong>问责</strong></li>
            </ul>
            <p><strong>2. 完善系统管理：</strong></p>
            <ul>
                <li>建立工资发放<strong>预警机制</strong></li>
                <li>加强系统数据<strong>同步管理</strong></li>
                <li>完善工资发放<strong>审核流程</strong></li>
            </ul>
        `;
    } else {
        issueTitle = '薪酬发放和社保缴纳符合规定';
        issueDetails = `
            <p><strong>审计结论：</strong>该部门薪酬社保管理规范。</p>
            <ul>
                <li><i class="fas fa-check-circle text-green-600"></i> 薪酬发放及时准确</li>
                <li><i class="fas fa-check-circle text-green-600"></i> 社保缴纳足额到位</li>
                <li><i class="fas fa-check-circle text-green-600"></i> 人员信息准确完整</li>
                <li><i class="fas fa-check-circle text-green-600"></i> 管理制度健全有效</li>
            </ul>
        `;
        rectificationRequirements = `
            <p>1. 继续保持良好的薪酬社保管理</p>
            <p>2. 加强政策学习，确保合规发放</p>
        `;
    }

    return `
        <div class="detail-content">
            <div class="detail-section">
                <h4 class="detail-section-title">部门信息</h4>
                <div class="detail-grid">
                    <div class="detail-item"><label>部门名称</label><p>${department}</p></div>
                    <div class="detail-item"><label>在职人数</label><p>${data.count}人</p></div>
                    <div class="detail-item"><label>月薪酬总额</label><p style="font-size: 18px; font-weight: 600; color: #2563EB;">¥${data.salary}万</p></div>
                    <div class="detail-item"><label>社保缴纳</label><p style="font-size: 18px; font-weight: 600; color: ${data.issueType === 'social_security_underpaid' ? '#D97706' : '#059669'};">¥${data.social}万</p></div>
                    <div class="detail-item"><label>社保覆盖率</label><p><span class="badge badge-${data.issueType === 'social_security_underpaid' ? 'warning' : 'success'}">${data.issueType === 'social_security_underpaid' ? '95%' : '100%'}</span></p></div>
                    <div class="detail-item"><label>审计状态</label><p>${statusBadge}</p></div>
                    <div class="detail-item"><label>审计日期</label><p>2024-10-15</p></div>
                    <div class="detail-item"><label>审计人员</label><p>审计处</p></div>
                </div>
            </div>
            
            <div class="detail-section">
                <h4 class="detail-section-title">审计发现</h4>
                <div class="detail-text">
                    <p><strong style="color: ${issueColor};">审计结论：${issueTitle}</strong></p>
                    ${issueDetails}
                </div>
            </div>
            
            ${data.issueType !== 'normal' ? `
            <div class="detail-section">
                <h4 class="detail-section-title">整改要求</h4>
                <div class="detail-text">
                    <p><strong style="color: ${issueColor};">${data.issueType === 'ghost_employee' || data.issueType === 'salary_standard_violation' || data.issueType === 'duplicate_payment' ? '严重违规，要求立即整改（限期10天）' : '要求限期整改（限期15天）'}：</strong></p>
                    ${rectificationRequirements}
                    <p><strong>3. 责任追究：</strong></p>
                    <ul>
                        <li>对部门负责人进行<strong>约谈</strong>，要求作出书面检查</li>
                        ${data.issueType === 'ghost_employee' || data.issueType === 'duplicate_payment' ? '<li>对涉嫌违规人员进行<strong>立案调查</strong></li>' : ''}
                        <li>将整改情况纳入部门<strong>年度考核</strong></li>
                    </ul>
                </div>
            </div>
            
            <div class="detail-section">
                <h4 class="detail-section-title">后续监督</h4>
                <div class="detail-text">
                    <p>1. ${data.issueType === 'ghost_employee' || data.issueType === 'salary_standard_violation' || data.issueType === 'duplicate_payment' ? '10' : '15'}天后进行整改情况<strong>专项检查</strong></p>
                    <p>2. 对整改不力的，将<strong>通报批评</strong>并追究领导责任</p>
                    <p>3. 建立薪酬社保审计<strong>回访制度</strong>，跟踪整改落实情况</p>
                </div>
            </div>
            ` : `
            <div class="detail-section">
                <h4 class="detail-section-title">工作建议</h4>
                <div class="detail-text">
                    ${rectificationRequirements}
                </div>
            </div>
            `}
        </div>
    `;
}

/**
 * IT治理审计详情
 */
function getITDetail(system) {
    // 定义不同问题类型的系统数据
    const systemData = {
        '科研管理系统': { department: '科研处', investment: 780, level: '三级', onlineDate: '2022-03-15', users: 3500, availability: 98.5, issueType: 'security_vulnerability', vulnerabilityCount: 8, highRiskCount: 3 },
        '图书管理系统': { department: '图书馆', investment: 450, level: '三级', onlineDate: '2021-09-01', users: 25000, availability: 99.2, issueType: 'data_leak_risk', sensitiveDataCount: 15000, encryptionRate: 45 },
        '学生管理系统': { department: '学工处', investment: 580, level: '三级', onlineDate: '2019-06-20', users: 18000, availability: 97.8, issueType: 'system_outdated', version: 'v2.1', latestVersion: 'v5.3', yearsOld: 5 },
        '教务管理系统': { department: '教务处', investment: 850, level: '三级', onlineDate: '2023-09-01', users: 15000, availability: 99.8, issueType: 'operation_irregular', backupDays: 45, lastMaintenance: '2024-06-15' },
        '财务管理系统': { department: '财务处', investment: 1200, level: '二级', onlineDate: '2023-01-10', users: 500, availability: 99.9, issueType: 'normal' },
        '人事管理系统': { department: '人事处', investment: 650, level: '三级', onlineDate: '2022-11-20', users: 800, availability: 99.5, issueType: 'normal' },
        '资产管理系统': { department: '资产处', investment: 520, level: '三级', onlineDate: '2022-05-15', users: 1200, availability: 98.8, issueType: 'security_vulnerability', vulnerabilityCount: 5, highRiskCount: 2 },
        '招生管理系统': { department: '招生办', investment: 680, level: '三级', onlineDate: '2021-12-01', users: 12000, availability: 99.1, issueType: 'data_leak_risk', sensitiveDataCount: 8500, encryptionRate: 50 },
        '办公自动化系统': { department: '办公室', investment: 320, level: '三级', onlineDate: '2018-03-10', users: 5000, availability: 96.5, issueType: 'system_outdated', version: 'v1.8', latestVersion: 'v4.2', yearsOld: 6 },
        '档案管理系统': { department: '档案馆', investment: 480, level: '三级', onlineDate: '2023-04-20', users: 600, availability: 98.2, issueType: 'operation_irregular', backupDays: 60, lastMaintenance: '2024-05-10' }
    };

    const data = systemData[system] || systemData['财务管理系统'];

    let issueTitle = '';
    let issueColor = '#059669';
    let statusBadge = '';
    let findings = '';
    let suggestions = '';

    // 根据问题类型生成不同的审计结论
    if (data.issueType === 'security_vulnerability') {
        issueTitle = '系统存在安全漏洞，存在被攻击风险！';
        issueColor = '#DC2626';
        statusBadge = '<span class="badge badge-danger">安全漏洞</span>';
        findings = `
            <p><strong style="color: #DC2626;">审计发现：该系统存在严重安全漏洞！</strong></p>
            <ul>
                <li><i class="fas fa-exclamation-circle text-red-600"></i> 发现<strong>${data.vulnerabilityCount}个安全漏洞</strong>，其中高危漏洞${data.highRiskCount}个</li>
                <li><i class="fas fa-exclamation-circle text-red-600"></i> <strong>SQL注入漏洞</strong>未修复，可能导致数据泄露</li>
                <li><i class="fas fa-exclamation-circle text-red-600"></i> <strong>XSS跨站脚本漏洞</strong>存在，用户数据安全受威胁</li>
                <li><i class="fas fa-exclamation-triangle text-yellow-600"></i> 系统补丁<strong>未及时更新</strong>，存在已知漏洞</li>
                <li><i class="fas fa-exclamation-triangle text-yellow-600"></i> 安全扫描<strong>未定期进行</strong></li>
                <li><i class="fas fa-info-circle text-blue-600"></i> 安全日志记录不完整</li>
            </ul>
            
            <div style="background: #FEF2F2; padding: 16px; border-radius: 6px; margin-top: 16px; border-left: 4px solid #DC2626;">
                <p style="margin: 0; color: #991B1B;"><strong>重点关注：</strong></p>
                <p style="margin: 8px 0 0 0; color: #991B1B;">该系统存在${data.highRiskCount}个<strong>高危安全漏洞</strong>，包括SQL注入和XSS漏洞，可能导致数据库被非法访问、用户数据泄露等严重后果，需<strong>立即修复</strong>。</p>
            </div>
        `;
        suggestions = `
            <p><strong style="color: #DC2626;">整改要求（限期7天）：</strong></p>
            <p><strong>1. 立即整改措施：</strong></p>
            <ul>
                <li><strong>立即修复</strong>所有高危安全漏洞</li>
                <li>对系统进行<strong>全面安全加固</strong></li>
                <li>更新系统<strong>安全补丁</strong>到最新版本</li>
                <li>加强<strong>访问控制</strong>和权限管理</li>
            </ul>
            <p><strong>2. 长期改进措施：</strong></p>
            <ul>
                <li>建立<strong>定期安全扫描</strong>机制（每月至少1次）</li>
                <li>完善<strong>安全日志</strong>记录和监控</li>
                <li>加强开发人员<strong>安全培训</strong></li>
                <li>建立<strong>应急响应</strong>机制</li>
            </ul>
            <p><strong>3. 责任追究：</strong></p>
            <ul>
                <li>对系统管理员进行<strong>约谈</strong>，要求作出书面检查</li>
                <li>对技术负责人进行<strong>安全培训</strong></li>
                <li>将整改情况纳入部门<strong>年度考核</strong></li>
            </ul>
        `;
    } else if (data.issueType === 'data_leak_risk') {
        issueTitle = '数据保护不足，存在泄露风险！';
        issueColor = '#DC2626';
        statusBadge = '<span class="badge badge-danger">数据泄露风险</span>';
        findings = `
            <p><strong style="color: #DC2626;">审计发现：该系统数据保护措施不足！</strong></p>
            <ul>
                <li><i class="fas fa-exclamation-circle text-red-600"></i> 系统存储<strong>${data.sensitiveDataCount.toLocaleString()}条敏感数据</strong>，包括个人身份信息</li>
                <li><i class="fas fa-exclamation-circle text-red-600"></i> <strong>数据加密率仅${data.encryptionRate}%</strong>，大量敏感数据未加密</li>
                <li><i class="fas fa-exclamation-circle text-red-600"></i> <strong>未实施数据脱敏</strong>，开发测试环境使用真实数据</li>
                <li><i class="fas fa-exclamation-triangle text-yellow-600"></i> 数据访问<strong>权限控制不严</strong>，存在越权访问风险</li>
                <li><i class="fas fa-exclamation-triangle text-yellow-600"></i> <strong>未建立数据分类分级</strong>管理制度</li>
                <li><i class="fas fa-info-circle text-blue-600"></i> 数据备份未加密存储</li>
            </ul>
            
            <div style="background: #FEF2F2; padding: 16px; border-radius: 6px; margin-top: 16px; border-left: 4px solid #DC2626;">
                <p style="margin: 0; color: #991B1B;"><strong>重点关注：</strong></p>
                <p style="margin: 8px 0 0 0; color: #991B1B;">该系统存储${data.sensitiveDataCount.toLocaleString()}条敏感数据，但<strong>加密率仅${data.encryptionRate}%</strong>，且开发测试环境使用真实数据，存在严重的<strong>数据泄露风险</strong>，违反《数据安全法》和《个人信息保护法》相关规定。</p>
            </div>
        `;
        suggestions = `
            <p><strong style="color: #DC2626;">整改要求（限期10天）：</strong></p>
            <p><strong>1. 立即整改措施：</strong></p>
            <ul>
                <li><strong>立即对所有敏感数据进行加密</strong>，加密率达到100%</li>
                <li>对开发测试环境数据进行<strong>脱敏处理</strong></li>
                <li>加强数据访问<strong>权限控制</strong>，实施最小权限原则</li>
                <li>对数据备份进行<strong>加密存储</strong></li>
            </ul>
            <p><strong>2. 长期改进措施：</strong></p>
            <ul>
                <li>建立<strong>数据分类分级</strong>管理制度</li>
                <li>完善<strong>数据访问审计</strong>机制</li>
                <li>加强数据安全<strong>培训和意识</strong></li>
                <li>定期开展<strong>数据安全评估</strong></li>
            </ul>
            <p><strong>3. 责任追究：</strong></p>
            <ul>
                <li>对数据管理负责人进行<strong>约谈</strong>，要求作出书面检查</li>
                <li>对相关人员进行<strong>数据安全培训</strong></li>
                <li>将整改情况纳入部门<strong>年度考核</strong></li>
            </ul>
        `;
    } else if (data.issueType === 'system_outdated') {
        issueTitle = '系统版本过旧，存在安全和性能隐患！';
        issueColor = '#D97706';
        statusBadge = '<span class="badge badge-warning">系统老化</span>';
        findings = `
            <p><strong style="color: #D97706;">审计发现：该系统版本严重过旧！</strong></p>
            <ul>
                <li><i class="fas fa-exclamation-triangle text-yellow-600"></i> 当前版本<strong>${data.version}</strong>，已使用${data.yearsOld}年</li>
                <li><i class="fas fa-exclamation-triangle text-yellow-600"></i> 最新版本为<strong>${data.latestVersion}</strong>，落后多个大版本</li>
                <li><i class="fas fa-exclamation-triangle text-yellow-600"></i> <strong>系统可用率${data.availability}%</strong>，低于标准要求（99%）</li>
                <li><i class="fas fa-exclamation-triangle text-yellow-600"></i> 系统性能下降，<strong>响应时间过长</strong></li>
                <li><i class="fas fa-exclamation-triangle text-yellow-600"></i> <strong>不支持新功能</strong>，影响业务发展</li>
                <li><i class="fas fa-info-circle text-blue-600"></i> 厂商已停止技术支持</li>
            </ul>
            
            <div style="background: #FFFBEB; padding: 16px; border-radius: 6px; margin-top: 16px; border-left: 4px solid #D97706;">
                <p style="margin: 0; color: #92400E;"><strong>重点关注：</strong></p>
                <p style="margin: 8px 0 0 0; color: #92400E;">该系统当前版本${data.version}已使用${data.yearsOld}年，落后最新版本${data.latestVersion}多个大版本，系统可用率仅${data.availability}%，且厂商已<strong>停止技术支持</strong>，存在安全和性能隐患，需尽快升级。</p>
            </div>
        `;
        suggestions = `
            <p><strong style="color: #D97706;">整改要求（限期30天）：</strong></p>
            <p><strong>1. 立即整改措施：</strong></p>
            <ul>
                <li>制定<strong>系统升级计划</strong>，明确时间表和责任人</li>
                <li>评估升级<strong>成本和风险</strong></li>
                <li>准备<strong>数据迁移</strong>方案</li>
            </ul>
            <p><strong>2. 长期改进措施：</strong></p>
            <ul>
                <li>建立<strong>系统版本管理</strong>制度</li>
                <li>定期进行<strong>系统评估</strong>和升级</li>
                <li>加强<strong>技术储备</strong>和人员培训</li>
                <li>建立<strong>应急预案</strong>，防止系统故障</li>
            </ul>
            <p><strong>3. 责任追究：</strong></p>
            <ul>
                <li>对系统管理部门进行<strong>约谈</strong>，要求作出书面检查</li>
                <li>将整改情况纳入部门<strong>年度考核</strong></li>
            </ul>
        `;
    } else if (data.issueType === 'operation_irregular') {
        issueTitle = '运维管理不规范，存在管理漏洞！';
        issueColor = '#D97706';
        statusBadge = '<span class="badge badge-warning">运维不规范</span>';
        findings = `
            <p><strong style="color: #D97706;">审计发现：该系统运维管理不规范！</strong></p>
            <ul>
                <li><i class="fas fa-exclamation-triangle text-yellow-600"></i> <strong>数据备份间隔${data.backupDays}天</strong>，超过规定的7天标准</li>
                <li><i class="fas fa-exclamation-triangle text-yellow-600"></i> 最后维护时间<strong>${data.lastMaintenance}</strong>，距今已超过4个月</li>
                <li><i class="fas fa-exclamation-triangle text-yellow-600"></i> <strong>未建立运维日志</strong>记录制度</li>
                <li><i class="fas fa-exclamation-triangle text-yellow-600"></i> 系统监控<strong>不完善</strong>，无法及时发现问题</li>
                <li><i class="fas fa-exclamation-triangle text-yellow-600"></i> <strong>应急预案缺失</strong>，故障响应不及时</li>
                <li><i class="fas fa-info-circle text-blue-600"></i> 运维人员配备不足</li>
            </ul>
            
            <div style="background: #FFFBEB; padding: 16px; border-radius: 6px; margin-top: 16px; border-left: 4px solid #D97706;">
                <p style="margin: 0; color: #92400E;"><strong>重点关注：</strong></p>
                <p style="margin: 8px 0 0 0; color: #92400E;">该系统数据备份间隔达<strong>${data.backupDays}天</strong>，远超规定的7天标准，且最后维护时间为${data.lastMaintenance}，距今已超过4个月，运维管理严重不规范，存在<strong>数据丢失风险</strong>。</p>
            </div>
        `;
        suggestions = `
            <p><strong style="color: #D97706;">整改要求（限期15天）：</strong></p>
            <p><strong>1. 立即整改措施：</strong></p>
            <ul>
                <li><strong>立即调整备份策略</strong>，确保每周至少备份1次</li>
                <li>对系统进行<strong>全面维护</strong>和检查</li>
                <li>建立<strong>运维日志</strong>记录制度</li>
                <li>完善<strong>系统监控</strong>机制</li>
            </ul>
            <p><strong>2. 长期改进措施：</strong></p>
            <ul>
                <li>制定<strong>运维管理规范</strong>和操作手册</li>
                <li>建立<strong>应急预案</strong>和演练机制</li>
                <li>加强<strong>运维人员培训</strong></li>
                <li>定期开展<strong>运维检查</strong>和评估</li>
            </ul>
            <p><strong>3. 责任追究：</strong></p>
            <ul>
                <li>对运维负责人进行<strong>约谈</strong>，要求作出书面检查</li>
                <li>将整改情况纳入部门<strong>年度考核</strong></li>
            </ul>
        `;
    } else {
        issueTitle = '系统运行正常';
        statusBadge = '<span class="badge badge-success">正常</span>';
        findings = `
            <p><strong>审计结论：该系统运行稳定，管理规范。</strong></p>
            <ul>
                <li><i class="fas fa-check-circle text-green-600"></i> 系统运行稳定，可用率${data.availability}%</li>
                <li><i class="fas fa-check-circle text-green-600"></i> 数据备份完整，定期进行</li>
                <li><i class="fas fa-check-circle text-green-600"></i> 安全防护有效，无重大漏洞</li>
                <li><i class="fas fa-check-circle text-green-600"></i> 运维管理规范，记录完整</li>
            </ul>
        `;
        suggestions = `
            <p>1. 继续保持良好的系统运维管理</p>
            <p>2. 定期进行安全评估和系统升级</p>
            <p>3. 加强运维人员培训，提升技术水平</p>
        `;
    }

    return `
        <div class="detail-content">
            <div class="detail-section">
                <h4 class="detail-section-title">系统信息</h4>
                <div class="detail-grid">
                    <div class="detail-item"><label>系统名称</label><p>${system}</p></div>
                    <div class="detail-item"><label>负责部门</label><p>${data.department}</p></div>
                    <div class="detail-item"><label>投资金额</label><p style="font-size: 18px; font-weight: 600; color: ${data.issueType !== 'normal' ? '#DC2626' : '#2563EB'};">¥${data.investment.toFixed(2)}万</p></div>
                    <div class="detail-item"><label>安全等级</label><p><span class="badge badge-${data.level === '二级' ? 'warning' : 'info'}">${data.level}</span></p></div>
                    <div class="detail-item"><label>上线时间</label><p>${data.onlineDate}</p></div>
                    <div class="detail-item"><label>用户数量</label><p>${data.users.toLocaleString()}人</p></div>
                    ${data.issueType === 'security_vulnerability' ? `<div class="detail-item"><label>安全漏洞</label><p style="color: #DC2626; font-weight: 600;">${data.vulnerabilityCount}个（高危${data.highRiskCount}个）</p></div>` : ''}
                    ${data.issueType === 'data_leak_risk' ? `<div class="detail-item"><label>敏感数据</label><p style="color: #DC2626; font-weight: 600;">${data.sensitiveDataCount.toLocaleString()}条</p></div>` : ''}
                    ${data.issueType === 'data_leak_risk' ? `<div class="detail-item"><label>加密率</label><p style="color: #DC2626; font-weight: 600;">${data.encryptionRate}%</p></div>` : ''}
                    ${data.issueType === 'system_outdated' ? `<div class="detail-item"><label>当前版本</label><p style="color: #D97706; font-weight: 600;">${data.version}</p></div>` : ''}
                    ${data.issueType === 'system_outdated' ? `<div class="detail-item"><label>最新版本</label><p style="color: #059669;">${data.latestVersion}</p></div>` : ''}
                    ${data.issueType === 'operation_irregular' ? `<div class="detail-item"><label>备份间隔</label><p style="color: #D97706; font-weight: 600;">${data.backupDays}天</p></div>` : ''}
                    ${data.issueType === 'operation_irregular' ? `<div class="detail-item"><label>最后维护</label><p style="color: #D97706;">${data.lastMaintenance}</p></div>` : ''}
                    <div class="detail-item"><label>系统状态</label><p>${statusBadge}</p></div>
                    <div class="detail-item"><label>可用率</label><p><span class="badge badge-${data.availability >= 99 ? 'success' : 'warning'}">${data.availability}%</span></p></div>
                </div>
            </div>
            
            <div class="detail-section">
                <h4 class="detail-section-title">审计发现</h4>
                <div class="detail-text">
                    <p><strong style="color: ${issueColor};">审计结论：${issueTitle}</strong></p>
                    ${findings}
                </div>
            </div>
            
            ${data.issueType !== 'normal' ? `
            <div class="detail-section">
                <h4 class="detail-section-title">整改要求</h4>
                <div class="detail-text">
                    ${suggestions}
                </div>
            </div>
            <div class="detail-section">
                <h4 class="detail-section-title">后续监督</h4>
                <div class="detail-text">
                    <p>1. ${data.issueType === 'security_vulnerability' ? '7' : data.issueType === 'data_leak_risk' ? '10' : data.issueType === 'operation_irregular' ? '15' : '30'}天后进行整改情况<strong>专项检查</strong></p>
                    <p>2. 对整改不力的，将<strong>通报批评</strong>并追究领导责任</p>
                    <p>3. 建立IT审计<strong>回访制度</strong>，跟踪整改落实情况</p>
                    <p>4. 将整改情况报送<strong>上级主管部门</strong></p>
                </div>
            </div>
            ` : `
            <div class="detail-section">
                <h4 class="detail-section-title">工作建议</h4>
                <div class="detail-text">
                    ${suggestions}
                </div>
            </div>
            `}
        </div>
    `;
}

/**
 * 默认详情
 */
function getDefaultDetail(module, id) {
    return `<div class="detail-content"><div class="detail-section"><h4 class="detail-section-title">基本信息</h4><div class="detail-grid"><div class="detail-item"><label>标识</label><p>${id}</p></div><div class="detail-item"><label>审计模块</label><p>${getModuleName(module)}</p></div><div class="detail-item"><label>创建时间</label><p>${new Date().toLocaleString('zh-CN')}</p></div><div class="detail-item"><label>状态</label><p><span class="badge badge-success">正常</span></p></div></div></div></div>`;
}

/**
 * 获取模块名称
 */
function getModuleName(module) {
    const names = {
        'budget': '预算执行审计',
        'research': '科研经费审计',
        'procurement': '采购管理审计',
        'assets': '固定资产审计',
        'enrollment': '招生学籍审计',
        'project': '工程项目审计',
        'salary': '薪酬社保审计',
        'it': 'IT治理审计'
    };
    return names[module] || module;
}

/**
 * 导出详情报告
 */
function exportDetail(module, id) {
    alert(`导出${getModuleName(module)}报告: ${id}`);
}
