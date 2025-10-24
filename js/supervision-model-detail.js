/**
 * 监督模型详情页面逻辑
 */

class SupervisionModelDetailPage {
    constructor() {
        this.modelId = null;
        this.model = null;
        this.init();
    }

    init() {
        // 从URL参数获取模型ID
        const urlParams = new URLSearchParams(window.location.search);
        this.modelId = urlParams.get('id');

        if (!this.modelId) {
            showNotification('error', '未指定模型ID');
            setTimeout(() => {
                window.location.href = 'supervision-model-library.html';
            }, 2000);
            return;
        }

        this.loadModelDetail();
    }

    loadModelDetail() {
        if (!window.supervisionModelService) {
            showNotification('error', '监督模型服务未初始化');
            return;
        }

        this.model = window.supervisionModelService.getModelById(this.modelId);

        if (!this.model) {
            showNotification('error', '模型不存在');
            setTimeout(() => {
                window.location.href = 'supervision-model-library.html';
            }, 2000);
            return;
        }

        this.renderModelDetail();
        this.loadStatistics();
    }

    renderModelDetail() {
        // 设置模型名称和状态
        document.getElementById('modelName').textContent = this.model.name;

        const statusBadge = document.getElementById('modelStatus');
        if (this.model.status === 'ACTIVE') {
            statusBadge.textContent = '稳定';
            statusBadge.style.background = '#e8f5e9';
            statusBadge.style.color = '#2e7d32';
        } else {
            statusBadge.textContent = '草稿';
            statusBadge.style.background = '#fff3e0';
            statusBadge.style.color = '#f57c00';
        }

        // 设置场景说明
        document.getElementById('scenarioDescription').textContent = this.model.description;

        // 设置主要数据源
        const dataSources = this.getDataSources();
        document.getElementById('dataSources').textContent = dataSources;

        // 设置指标与SLA
        const slaIndicators = this.getSLAIndicators();
        document.getElementById('slaIndicators').textContent = slaIndicators;

        // 调试：检查规则数据
        console.log('模型数据:', this.model);
        console.log('规则数量:', this.model.rules ? this.model.rules.length : 0);

        // 渲染规则列表
        this.renderRules();
    }

    getDataSources() {
        // 根据模型类别返回数据源
        const dataSourceMap = {
            '科研监督': 'OA系统、宣传部、党委会议记录、学习平台',
            '财务监督': '财务系统、报销系统、预算系统',
            '采购监督': '采购系统、合同系统、供应商库',
            '资产监督': '资产管理系统、盘点系统',
            '招生监督': '招生系统、学籍系统',
            '作风监督': '公务用车系统、接待系统、考勤系统',
            '综合监督': '多系统数据整合'
        };
        return dataSourceMap[this.model.category] || '相关业务系统';
    }

    getSLAIndicators() {
        // 根据规则生成SLA指标
        const rules = this.model.rules || [];
        const highCount = rules.filter(r => r.alertLevel === 'HIGH').length;
        const mediumCount = rules.filter(r => r.alertLevel === 'MEDIUM').length;

        return `红灯${highCount}日、黄灯${mediumCount}日、整改闭环≥98%`;
    }

    renderRules() {
        const tbody = document.getElementById('rulesTableBody');
        const rules = this.model.rules || [];

        if (rules.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" style="text-align: center; padding: 40px; color: #999;">
                        暂无规则
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = rules.map(rule => {
            const levelClass = rule.alertLevel.toLowerCase();
            const levelText = {
                'HIGH': '高',
                'MEDIUM': '中',
                'LOW': '低'
            }[rule.alertLevel] || rule.alertLevel;

            const condition = this.formatRuleCondition(rule);
            const lastHit = this.getRandomDate();

            return `
                <tr>
                    <td>${rule.ruleName}</td>
                    <td>${condition}</td>
                    <td>
                        <span class="rule-level-badge ${levelClass}">${levelText}</span>
                    </td>
                    <td>${lastHit}</td>
                    <td>
                        <span class="rule-status-badge ${rule.enabled ? 'enabled' : 'disabled'}">
                            ${rule.enabled ? '启用' : '禁用'}
                        </span>
                    </td>
                </tr>
            `;
        }).join('');
    }

    formatRuleCondition(rule) {
        const config = rule.config || {};

        if (rule.ruleType === 'THRESHOLD') {
            const operator = config.operator || '>';
            const threshold = config.threshold || 0;
            return `${operator}${threshold}`;
        } else if (rule.ruleType === 'TREND') {
            return config.condition || '趋势异常';
        } else if (rule.ruleType === 'CORRELATION') {
            return '关联关系检测';
        } else if (rule.ruleType === 'SEQUENCE') {
            return '时序模式匹配';
        } else if (rule.ruleType === 'GRAPH') {
            return '图谱关系分析';
        }

        return '-';
    }

    getRandomDate() {
        const days = Math.floor(Math.random() * 30);
        const date = new Date();
        date.setDate(date.getDate() - days);
        return date.toISOString().split('T')[0];
    }

    loadStatistics() {
        // 模拟统计数据
        const redCount = Math.floor(Math.random() * 5);
        const yellowCount = Math.floor(Math.random() * 10) + 2;
        const greenCount = Math.floor(Math.random() * 100) + 50;

        document.getElementById('redCount').textContent = redCount;
        document.getElementById('yellowCount').textContent = yellowCount;
        document.getElementById('greenCount').textContent = greenCount;

        // 加载证据快照
        this.loadEvidenceSnapshots();
    }

    loadEvidenceSnapshots() {
        const evidences = this.getEvidenceData();
        this.renderEvidenceSnapshots(evidences);
    }

    getEvidenceData() {
        // 根据模型的规则生成对应的证据数据
        const rules = this.model.rules || [];
        const evidences = [];

        // 为每个规则生成对应的证据
        rules.forEach((rule, index) => {
            if (index >= 10) return; // 只显示前10条

            const evidence = this.generateEvidenceForRule(rule);
            if (evidence) {
                evidences.push(evidence);
            }
        });

        // 如果规则少于10条，补充一些通用证据
        if (evidences.length < 10) {
            const additionalEvidences = this.getAdditionalEvidences();
            evidences.push(...additionalEvidences.slice(0, 10 - evidences.length));
        }

        return evidences;
    }

    generateEvidenceForRule(rule) {
        // 根据规则类型和名称生成对应的证据
        const ruleNameLower = rule.ruleName.toLowerCase();

        // 根据规则名称匹配证据类型
        if (ruleNameLower.includes('设备') || ruleNameLower.includes('使用率')) {
            return {
                type: 'chart',
                title: `${rule.ruleName}统计`,
                unit: '科研处',
                time: this.getRandomDate(),
                content: null,
                hasChart: true,
                chartData: this.generateRandomChartData(),
                ruleName: rule.ruleName
            };
        } else if (ruleNameLower.includes('发票') || ruleNameLower.includes('验证')) {
            return {
                type: 'alert',
                title: rule.ruleName,
                unit: '财务处',
                time: this.getRandomDate(),
                content: `检测到${Math.floor(Math.random() * 5) + 1}张发票验证失败，需要进一步核查`,
                hasChart: false,
                ruleName: rule.ruleName
            };
        } else if (ruleNameLower.includes('预算') || ruleNameLower.includes('执行')) {
            return {
                type: 'chart',
                title: rule.ruleName,
                unit: '财务处',
                time: this.getRandomDate(),
                content: null,
                hasChart: true,
                chartData: this.generateRandomChartData(),
                ruleName: rule.ruleName
            };
        } else if (ruleNameLower.includes('劳务费') || ruleNameLower.includes('工资')) {
            return {
                type: 'alert',
                title: rule.ruleName,
                unit: '人事处',
                time: this.getRandomDate(),
                content: `检测到${Math.floor(Math.random() * 3) + 1}笔劳务费发放超出标准`,
                hasChart: false,
                ruleName: rule.ruleName
            };
        } else if (ruleNameLower.includes('差旅') || ruleNameLower.includes('报销')) {
            return {
                type: 'document',
                title: rule.ruleName,
                unit: '财务处',
                time: this.getRandomDate(),
                content: `本月共审核差旅费报销${Math.floor(Math.random() * 100) + 50}笔，发现${Math.floor(Math.random() * 5)}笔异常`,
                hasChart: false,
                ruleName: rule.ruleName
            };
        } else if (ruleNameLower.includes('采购') || ruleNameLower.includes('招标')) {
            return {
                type: 'alert',
                title: rule.ruleName,
                unit: '采购中心',
                time: this.getRandomDate(),
                content: `检测到疑似异常采购行为，建议重点审查`,
                hasChart: false,
                ruleName: rule.ruleName
            };
        } else if (ruleNameLower.includes('资产') || ruleNameLower.includes('盘点')) {
            return {
                type: 'document',
                title: rule.ruleName,
                unit: '资产处',
                time: this.getRandomDate(),
                content: `资产盘点发现${Math.floor(Math.random() * 10) + 1}件设备存在差异`,
                hasChart: false,
                ruleName: rule.ruleName
            };
        } else if (ruleNameLower.includes('录取') || ruleNameLower.includes('招生')) {
            return {
                type: 'alert',
                title: rule.ruleName,
                unit: '招生办',
                time: this.getRandomDate(),
                content: `检测到${Math.floor(Math.random() * 3) + 1}条招生异常记录`,
                hasChart: false,
                ruleName: rule.ruleName
            };
        } else if (ruleNameLower.includes('接待') || ruleNameLower.includes('公车') || ruleNameLower.includes('津补贴')) {
            return {
                type: 'alert',
                title: rule.ruleName,
                unit: '纪检监察室',
                time: this.getRandomDate(),
                content: `检测到疑似违反八项规定行为，需要核查`,
                hasChart: false,
                ruleName: rule.ruleName
            };
        } else {
            // 默认生成文档类型证据
            return {
                type: 'document',
                title: rule.ruleName,
                unit: '相关部门',
                time: this.getRandomDate(),
                content: `规则执行正常，本月检测数据${Math.floor(Math.random() * 1000) + 100}条`,
                hasChart: false,
                ruleName: rule.ruleName
            };
        }
    }

    generateRandomChartData() {
        const data = [];
        for (let i = 0; i < 12; i++) {
            data.push(Math.floor(Math.random() * 50) + 50);
        }
        return data;
    }

    getAdditionalEvidences() {
        // 补充的通用证据数据
        const evidenceTemplates = {
            '科研监督': [
                {
                    type: 'chart',
                    title: '学习平台活跃度统计',
                    unit: '教务处',
                    time: '2025年9月',
                    content: null,
                    hasChart: true,
                    chartData: [65, 78, 82, 90, 75, 88, 92, 85, 79, 86, 91, 88]
                },
                {
                    type: 'document',
                    title: '会议纪要提报结果',
                    unit: '党委理论学习中心小组',
                    time: '2025-09-18',
                    content: '记事贴少"记事提示人"与"审核人"字段，建议补充完整',
                    hasChart: false
                },
                {
                    type: 'document',
                    title: '"第一议题"执行情况',
                    unit: '2025年第三季度统计',
                    time: '2025年第三季度统计',
                    content: '共召开党委会12次，其中11次落实第一议题，执行率91.7%',
                    hasChart: false
                },
                {
                    type: 'chart',
                    title: '设备使用率统计',
                    unit: '科研处',
                    time: '2025年9月',
                    content: null,
                    hasChart: true,
                    chartData: [45, 52, 38, 65, 42, 58, 48, 55, 40, 62, 50, 47]
                },
                {
                    type: 'alert',
                    title: '劳务费发放异常',
                    unit: '计算机学院',
                    time: '2025-09-20',
                    content: '检测到张某9月劳务费发放金额8500元，超出标准上限',
                    hasChart: false
                },
                {
                    type: 'document',
                    title: '发票验证结果',
                    unit: '财务处',
                    time: '2025-09-15',
                    content: '本月共验证发票1250张，发现3张发票验证失败',
                    hasChart: false
                }
            ],
            '财务监督': [
                {
                    type: 'chart',
                    title: '预算执行率统计',
                    unit: '财务处',
                    time: '2025年9月',
                    content: null,
                    hasChart: true,
                    chartData: [72, 75, 78, 82, 85, 88, 90, 92, 89, 91, 93, 95]
                },
                {
                    type: 'alert',
                    title: '超预算支出预警',
                    unit: '物理学院',
                    time: '2025-09-25',
                    content: '9月实际支出125万元，超出预算额度15万元',
                    hasChart: false
                },
                {
                    type: 'document',
                    title: '大额资金转账记录',
                    unit: '财务处',
                    time: '2025-09-18',
                    content: '检测到1笔150万元转账，已通知相关部门核查',
                    hasChart: false
                },
                {
                    type: 'chart',
                    title: '报销金额趋势',
                    unit: '财务处',
                    time: '2025年9月',
                    content: null,
                    hasChart: true,
                    chartData: [85, 92, 88, 95, 102, 98, 105, 110, 108, 112, 115, 118]
                }
            ],
            '采购监督': [
                {
                    type: 'alert',
                    title: '疑似围标串标',
                    unit: '采购中心',
                    time: '2025-09-20',
                    content: '检测到3家投标企业存在关联关系，建议重点审查',
                    hasChart: false
                },
                {
                    type: 'document',
                    title: '拆分采购检测',
                    unit: '采购中心',
                    time: '2025-09-15',
                    content: '发现供应商A在30天内多笔采购总额达25万元',
                    hasChart: false
                },
                {
                    type: 'chart',
                    title: '采购金额统计',
                    unit: '采购中心',
                    time: '2025年9月',
                    content: null,
                    hasChart: true,
                    chartData: [180, 220, 195, 240, 210, 235, 250, 228, 245, 260, 238, 255]
                }
            ],
            '资产监督': [
                {
                    type: 'alert',
                    title: '资产长期闲置',
                    unit: '化学学院',
                    time: '2025-09-18',
                    content: '检测到5台设备采购后超过6个月未使用',
                    hasChart: false
                },
                {
                    type: 'document',
                    title: '资产盘点差异',
                    unit: '资产处',
                    time: '2025-09-10',
                    content: '年度盘点发现15件设备账实不符，差异率3.2%',
                    hasChart: false
                },
                {
                    type: 'chart',
                    title: '资产使用率统计',
                    unit: '资产处',
                    time: '2025年9月',
                    content: null,
                    hasChart: true,
                    chartData: [68, 72, 75, 78, 80, 82, 85, 83, 86, 88, 90, 87]
                }
            ],
            '招生监督': [
                {
                    type: 'alert',
                    title: '录取分数异常',
                    unit: '招生办',
                    time: '2025-09-05',
                    content: '检测到1名学生录取分数低于专业最低线12分',
                    hasChart: false
                },
                {
                    type: 'document',
                    title: '特殊类型招生统计',
                    unit: '招生办',
                    time: '2025-09-01',
                    content: '本年度特殊类型招生占比4.8%，符合规定',
                    hasChart: false
                }
            ],
            '作风监督': [
                {
                    type: 'alert',
                    title: '公务接待费用过高',
                    unit: '行政办公室',
                    time: '2025-09-22',
                    content: '检测到1笔公务接待费用6800元，超出标准',
                    hasChart: false
                },
                {
                    type: 'document',
                    title: '公车使用统计',
                    unit: '后勤处',
                    time: '2025-09-15',
                    content: '本月检测到3次非工作时间用车记录',
                    hasChart: false
                },
                {
                    type: 'chart',
                    title: '三公经费支出趋势',
                    unit: '财务处',
                    time: '2025年9月',
                    content: null,
                    hasChart: true,
                    chartData: [45, 48, 42, 50, 46, 52, 49, 47, 51, 48, 46, 44]
                }
            ]
        };

        const category = this.model.category;
        return evidenceTemplates[category] || evidenceTemplates['科研监督'];
    }

    renderEvidenceSnapshots(evidences) {
        const container = document.getElementById('evidenceGrid');

        if (evidences.length === 0) {
            container.innerHTML = '<p style="color: #999; text-align: center; padding: 40px;">暂无证据数据</p>';
            return;
        }

        container.innerHTML = evidences.map(evidence => {
            const iconClass = evidence.type;
            const iconMap = {
                'chart': '<i class="fas fa-chart-bar"></i>',
                'document': '<i class="fas fa-file-alt"></i>',
                'alert': '<i class="fas fa-exclamation-triangle"></i>'
            };

            let chartHtml = '';
            if (evidence.hasChart && evidence.chartData) {
                const maxValue = Math.max(...evidence.chartData);
                const bars = evidence.chartData.map(value => {
                    const height = (value / maxValue) * 100;
                    return `<div class="chart-bar" style="height: ${height}%"></div>`;
                }).join('');

                chartHtml = `
                    <div class="evidence-chart">
                        <div class="evidence-chart-placeholder">
                            ${bars}
                        </div>
                    </div>
                `;
            }

            let contentHtml = '';
            if (evidence.content) {
                contentHtml = `<div class="evidence-content">${evidence.content}</div>`;
            }

            return `
                <div class="evidence-card">
                    <div class="evidence-header">
                        <div class="evidence-icon ${iconClass}">
                            ${iconMap[evidence.type]}
                        </div>
                        <div class="evidence-info">
                            <div class="evidence-title">${evidence.title}</div>
                            <div class="evidence-meta">${evidence.unit} · ${evidence.time}</div>
                        </div>
                    </div>
                    ${chartHtml}
                    ${contentHtml}
                </div>
            `;
        }).join('');
    }

    viewAllEvidence() {
        showNotification('info', '证据详情功能开发中');
    }

    goBack() {
        window.location.href = 'supervision-model-library.html';
    }

    editModel() {
        if (this.model.type === 'PRESET') {
            showNotification('warning', '预置模型不支持编辑');
            return;
        }

        // 跳转到编辑页面（使用模型库页面的编辑功能）
        window.location.href = `supervision-model-library.html?action=edit&id=${this.modelId}`;
    }

    configureRules() {
        if (this.model.type === 'PRESET') {
            showNotification('info', '预置模型的规则配置请联系管理员');
            return;
        }

        // 跳转到编辑页面
        this.editModel();
    }

    manageRules() {
        // 跳转到规则管理页面
        window.location.href = 'rule-engine-management.html';
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    window.modelDetailPage = new SupervisionModelDetailPage();
});
