/**
 * 模型优化页面逻辑
 */

class ModelOptimization {
    constructor() {
        this.currentTab = 'false-positives';
        this.currentOptimizationId = null;
        this.init();
    }

    init() {
        this.loadMockData();
        this.renderStatistics();
        this.renderFalsePositives();
        this.renderFalseNegatives();
        this.renderOptimizations();
        this.bindEvents();
    }

    // 加载模拟数据
    loadMockData() {
        // 误报标注数据
        this.falsePositives = [
            {
                id: 'FP001',
                alertId: 'ALERT-2025-001',
                ruleName: '科研经费超额使用规则',
                reason: '特殊项目批准',
                markedBy: '张三',
                markedAt: '2025-10-24 14:30:00'
            },
            {
                id: 'FP002',
                alertId: 'ALERT-2025-002',
                ruleName: '预算执行进度异常',
                reason: '季节性因素',
                markedBy: '李四',
                markedAt: '2025-10-24 10:15:00'
            },
            {
                id: 'FP003',
                alertId: 'ALERT-2025-003',
                ruleName: '三公经费超标',
                reason: '政策调整',
                markedBy: '王五',
                markedAt: '2025-10-23 16:45:00'
            },
            {
                id: 'FP004',
                alertId: 'ALERT-2025-004',
                ruleName: '采购价格异常',
                reason: '市场价格波动',
                markedBy: '赵六',
                markedAt: '2025-10-23 14:20:00'
            },
            {
                id: 'FP005',
                alertId: 'ALERT-2025-005',
                ruleName: '资产使用率低',
                reason: '设备维修期间',
                markedBy: '钱七',
                markedAt: '2025-10-23 11:30:00'
            },
            {
                id: 'FP006',
                alertId: 'ALERT-2025-006',
                ruleName: '招生录取分数异常',
                reason: '特殊招生政策',
                markedBy: '孙八',
                markedAt: '2025-10-22 15:45:00'
            },
            {
                id: 'FP007',
                alertId: 'ALERT-2025-007',
                ruleName: '公务接待费用超标',
                reason: '重要会议接待',
                markedBy: '周九',
                markedAt: '2025-10-22 09:20:00'
            },
            {
                id: 'FP008',
                alertId: 'ALERT-2025-008',
                ruleName: '科研项目结题延期',
                reason: '疫情影响',
                markedBy: '吴十',
                markedAt: '2025-10-21 16:10:00'
            },
            {
                id: 'FP009',
                alertId: 'ALERT-2025-009',
                ruleName: '差旅费报销异常',
                reason: '国际会议',
                markedBy: '郑十一',
                markedAt: '2025-10-21 13:50:00'
            },
            {
                id: 'FP010',
                alertId: 'ALERT-2025-010',
                ruleName: '固定资产采购未招标',
                reason: '单一来源采购',
                markedBy: '王十二',
                markedAt: '2025-10-21 10:30:00'
            },
            {
                id: 'FP011',
                alertId: 'ALERT-2025-011',
                ruleName: '预算调整频繁',
                reason: '项目变更',
                markedBy: '李十三',
                markedAt: '2025-10-20 14:15:00'
            },
            {
                id: 'FP012',
                alertId: 'ALERT-2025-012',
                ruleName: '津补贴发放异常',
                reason: '年终奖发放',
                markedBy: '张十四',
                markedAt: '2025-10-20 11:40:00'
            }
        ];

        // 漏报记录数据
        this.falseNegatives = [
            {
                id: 'FN001',
                title: '未检测到的异常采购',
                expectedRule: '采购价格异常规则',
                priority: 'high',
                status: 'pending',
                reportedBy: '赵六',
                reportedAt: '2025-10-24 09:00:00'
            },
            {
                id: 'FN002',
                title: '资产闲置未预警',
                expectedRule: '资产使用率规则',
                priority: 'medium',
                status: 'analyzing',
                reportedBy: '钱七',
                reportedAt: '2025-10-23 15:30:00'
            },
            {
                id: 'FN003',
                title: '科研经费挪用未发现',
                expectedRule: '经费使用合规性规则',
                priority: 'high',
                status: 'pending',
                reportedBy: '孙八',
                reportedAt: '2025-10-23 11:20:00'
            },
            {
                id: 'FN004',
                title: '招生录取舞弊行为',
                expectedRule: '招生异常行为检测',
                priority: 'high',
                status: 'analyzing',
                reportedBy: '周九',
                reportedAt: '2025-10-22 16:45:00'
            },
            {
                id: 'FN005',
                title: '供应商围标串标',
                expectedRule: '采购围标检测规则',
                priority: 'high',
                status: 'pending',
                reportedBy: '吴十',
                reportedAt: '2025-10-22 14:10:00'
            },
            {
                id: 'FN006',
                title: '预算执行率过低',
                expectedRule: '预算执行监控规则',
                priority: 'medium',
                status: 'analyzing',
                reportedBy: '郑十一',
                reportedAt: '2025-10-21 10:30:00'
            },
            {
                id: 'FN007',
                title: '公车私用未检测',
                expectedRule: '公车使用监控规则',
                priority: 'medium',
                status: 'pending',
                reportedBy: '王十二',
                reportedAt: '2025-10-20 15:20:00'
            },
            {
                id: 'FN008',
                title: '关联交易未识别',
                expectedRule: '关联关系检测规则',
                priority: 'low',
                status: 'analyzing',
                reportedBy: '李十三',
                reportedAt: '2025-10-20 09:45:00'
            }
        ];

        // 优化建议数据
        this.optimizations = [
            {
                id: 'OPT001',
                ruleId: 'RULE-001',
                ruleName: '科研经费超额使用规则',
                status: 'pending',
                falsePositiveCount: 8,
                suggestions: [
                    {
                        title: '调整阈值',
                        description: '将超额阈值从10%提高到15%，减少因小额超支产生的误报',
                        confidence: 0.85,
                        expectedReduction: '减少60%误报'
                    },
                    {
                        title: '增加例外条件',
                        description: '添加特殊项目批准、疫情影响等例外情况的判断逻辑',
                        confidence: 0.92,
                        expectedReduction: '减少40%误报'
                    },
                    {
                        title: '时间窗口优化',
                        description: '将检测周期从月度调整为季度，避免短期波动',
                        confidence: 0.78,
                        expectedReduction: '减少30%误报'
                    }
                ],
                currentFalsePositiveRate: '25%',
                expectedFalsePositiveRate: '8%',
                expectedReduction: '68%',
                createdAt: '2025-10-24 10:00:00'
            },
            {
                id: 'OPT002',
                ruleId: 'RULE-002',
                ruleName: '预算执行进度异常',
                status: 'applied',
                falsePositiveCount: 5,
                suggestions: [
                    {
                        title: '季节性调整',
                        description: '根据历史数据调整季度预期进度，考虑寒暑假等因素',
                        confidence: 0.88,
                        expectedReduction: '减少50%误报'
                    },
                    {
                        title: '分类管理',
                        description: '对不同类型预算采用不同的执行进度标准',
                        confidence: 0.82,
                        expectedReduction: '减少35%误报'
                    }
                ],
                currentFalsePositiveRate: '18%',
                expectedFalsePositiveRate: '9%',
                expectedReduction: '50%',
                createdAt: '2025-10-23 14:00:00',
                appliedAt: '2025-10-24 09:00:00'
            },
            {
                id: 'OPT003',
                ruleId: 'RULE-003',
                ruleName: '三公经费超标',
                status: 'pending',
                falsePositiveCount: 6,
                suggestions: [
                    {
                        title: '更新政策标准',
                        description: '根据2025年最新政策调整判断标准和限额',
                        confidence: 0.90,
                        expectedReduction: '减少75%误报'
                    },
                    {
                        title: '增加审批流程检查',
                        description: '验证是否经过正规审批流程，已审批的不作为异常',
                        confidence: 0.87,
                        expectedReduction: '减少45%误报'
                    }
                ],
                currentFalsePositiveRate: '20%',
                expectedFalsePositiveRate: '5%',
                expectedReduction: '75%',
                createdAt: '2025-10-23 11:00:00'
            },
            {
                id: 'OPT004',
                ruleId: 'RULE-004',
                ruleName: '采购价格异常',
                status: 'pending',
                falsePositiveCount: 7,
                suggestions: [
                    {
                        title: '市场价格动态更新',
                        description: '接入市场价格数据库，实时更新参考价格',
                        confidence: 0.91,
                        expectedReduction: '减少65%误报'
                    },
                    {
                        title: '扩大价格波动范围',
                        description: '将异常阈值从±20%调整为±30%',
                        confidence: 0.83,
                        expectedReduction: '减少50%误报'
                    },
                    {
                        title: '增加品牌因素',
                        description: '考虑品牌溢价，对知名品牌放宽价格限制',
                        confidence: 0.79,
                        expectedReduction: '减少40%误报'
                    }
                ],
                currentFalsePositiveRate: '22%',
                expectedFalsePositiveRate: '7%',
                expectedReduction: '68%',
                createdAt: '2025-10-23 09:30:00'
            },
            {
                id: 'OPT005',
                ruleId: 'RULE-005',
                ruleName: '资产使用率低',
                status: 'applied',
                falsePositiveCount: 4,
                suggestions: [
                    {
                        title: '排除维修期',
                        description: '自动排除设备维修、保养期间的使用率统计',
                        confidence: 0.94,
                        expectedReduction: '减少80%误报'
                    },
                    {
                        title: '分类设置阈值',
                        description: '不同类型资产设置不同的使用率标准',
                        confidence: 0.86,
                        expectedReduction: '减少55%误报'
                    }
                ],
                currentFalsePositiveRate: '15%',
                expectedFalsePositiveRate: '4%',
                expectedReduction: '73%',
                createdAt: '2025-10-22 16:00:00',
                appliedAt: '2025-10-23 10:00:00'
            },
            {
                id: 'OPT006',
                ruleId: 'RULE-006',
                ruleName: '招生录取分数异常',
                status: 'pending',
                falsePositiveCount: 3,
                suggestions: [
                    {
                        title: '特殊招生政策识别',
                        description: '识别并排除特长生、少数民族等特殊招生政策',
                        confidence: 0.95,
                        expectedReduction: '减少90%误报'
                    },
                    {
                        title: '动态调整分数线',
                        description: '根据当年录取情况动态调整异常判断标准',
                        confidence: 0.88,
                        expectedReduction: '减少60%误报'
                    }
                ],
                currentFalsePositiveRate: '12%',
                expectedFalsePositiveRate: '3%',
                expectedReduction: '75%',
                createdAt: '2025-10-22 14:20:00'
            },
            {
                id: 'OPT007',
                ruleId: 'RULE-007',
                ruleName: '公务接待费用超标',
                status: 'pending',
                falsePositiveCount: 5,
                suggestions: [
                    {
                        title: '重要会议例外',
                        description: '对重要会议、高层接待设置例外规则',
                        confidence: 0.89,
                        expectedReduction: '减少70%误报'
                    },
                    {
                        title: '人均标准调整',
                        description: '根据地区和接待级别调整人均费用标准',
                        confidence: 0.84,
                        expectedReduction: '减少55%误报'
                    }
                ],
                currentFalsePositiveRate: '19%',
                expectedFalsePositiveRate: '6%',
                expectedReduction: '68%',
                createdAt: '2025-10-22 11:45:00'
            },
            {
                id: 'OPT008',
                ruleId: 'RULE-008',
                ruleName: '科研项目结题延期',
                status: 'applied',
                falsePositiveCount: 6,
                suggestions: [
                    {
                        title: '疫情影响豁免',
                        description: '对受疫情影响的项目自动延长结题期限',
                        confidence: 0.93,
                        expectedReduction: '减少85%误报'
                    }
                ],
                currentFalsePositiveRate: '24%',
                expectedFalsePositiveRate: '6%',
                expectedReduction: '75%',
                createdAt: '2025-10-21 15:30:00',
                appliedAt: '2025-10-22 09:00:00'
            },
            {
                id: 'OPT009',
                ruleId: 'RULE-009',
                ruleName: '差旅费报销异常',
                status: 'pending',
                falsePositiveCount: 4,
                suggestions: [
                    {
                        title: '国际会议识别',
                        description: '自动识别国际会议，放宽差旅费标准',
                        confidence: 0.91,
                        expectedReduction: '减少80%误报'
                    },
                    {
                        title: '城市等级调整',
                        description: '根据目的地城市等级调整费用标准',
                        confidence: 0.85,
                        expectedReduction: '减少60%误报'
                    }
                ],
                currentFalsePositiveRate: '16%',
                expectedFalsePositiveRate: '4%',
                expectedReduction: '75%',
                createdAt: '2025-10-21 13:15:00'
            },
            {
                id: 'OPT010',
                ruleId: 'RULE-010',
                ruleName: '固定资产采购未招标',
                status: 'pending',
                falsePositiveCount: 3,
                suggestions: [
                    {
                        title: '单一来源识别',
                        description: '识别合法的单一来源采购情况',
                        confidence: 0.96,
                        expectedReduction: '减少95%误报'
                    },
                    {
                        title: '金额阈值优化',
                        description: '调整必须招标的金额阈值标准',
                        confidence: 0.87,
                        expectedReduction: '减少65%误报'
                    }
                ],
                currentFalsePositiveRate: '10%',
                expectedFalsePositiveRate: '2%',
                expectedReduction: '80%',
                createdAt: '2025-10-21 10:00:00'
            }
        ];
    }

    // 绑定事件
    bindEvents() {
        const statusFilter = document.getElementById('statusFilter');
        if (statusFilter) {
            statusFilter.addEventListener('change', () => this.renderOptimizations());
        }
    }

    // 渲染统计数据
    renderStatistics() {
        document.getElementById('falsePositivesCount').textContent = this.falsePositives.length;
        document.getElementById('falseNegativesCount').textContent = this.falseNegatives.length;
        document.getElementById('optimizationsCount').textContent = this.optimizations.length;
        document.getElementById('appliedCount').textContent = 
            this.optimizations.filter(o => o.status === 'applied').length;
    }

    // 切换标签页
    switchTab(tabName) {
        this.currentTab = tabName;

        // 更新标签按钮状态
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.tab === tabName) {
                btn.classList.add('active');
            }
        });

        // 更新面板显示
        document.querySelectorAll('.tab-panel').forEach(panel => {
            panel.classList.remove('active');
        });
        document.getElementById(`${tabName}-panel`).classList.add('active');
    }

    // 渲染误报标注列表
    renderFalsePositives() {
        const tbody = document.getElementById('falsePositivesTableBody');
        
        if (this.falsePositives.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align: center; padding: 40px; color: #9ca3af;">
                        <i class="fas fa-inbox" style="font-size: 48px; margin-bottom: 12px; display: block;"></i>
                        暂无误报标注记录
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = this.falsePositives.map(fp => `
            <tr>
                <td><strong>${fp.id}</strong></td>
                <td>${fp.alertId}</td>
                <td>${fp.ruleName}</td>
                <td>${fp.reason}</td>
                <td>${fp.markedBy}</td>
                <td>${new Date(fp.markedAt).toLocaleString('zh-CN')}</td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="modelOptimization.viewFalsePositiveDetail('${fp.id}')">
                        <i class="fas fa-eye"></i> 查看
                    </button>
                </td>
            </tr>
        `).join('');
    }

    // 查看误报详情
    viewFalsePositiveDetail(id) {
        const fp = this.falsePositives.find(item => item.id === id);
        if (!fp) {
            showNotification('error', '记录不存在');
            return;
        }

        // 生成详细信息
        const detailContent = `
            <div class="detail-section">
                <h4>基本信息</h4>
                <div class="detail-grid">
                    <div class="detail-item">
                        <label>标注ID</label>
                        <div><strong>${fp.id}</strong></div>
                    </div>
                    <div class="detail-item">
                        <label>预警ID</label>
                        <div>${fp.alertId}</div>
                    </div>
                    <div class="detail-item">
                        <label>规则名称</label>
                        <div>${fp.ruleName}</div>
                    </div>
                    <div class="detail-item">
                        <label>标注人</label>
                        <div>${fp.markedBy}</div>
                    </div>
                    <div class="detail-item">
                        <label>标注时间</label>
                        <div>${new Date(fp.markedAt).toLocaleString('zh-CN')}</div>
                    </div>
                    <div class="detail-item">
                        <label>误报原因</label>
                        <div><span class="status-badge status-warning">${fp.reason}</span></div>
                    </div>
                </div>
            </div>

            <div class="detail-section">
                <h4>详细说明</h4>
                <div style="padding: 16px; background: var(--color-gray-50); border-radius: 6px; line-height: 1.6;">
                    ${this.getFalsePositiveDescription(fp)}
                </div>
            </div>

            <div class="detail-section">
                <h4>预警数据</h4>
                <div class="code-block">
                    ${this.getFalsePositiveEvidenceData(fp)}
                </div>
            </div>

            <div class="detail-section">
                <h4>处理建议</h4>
                <div style="padding: 16px; background: #dbeafe; border-radius: 6px; border-left: 4px solid #3b82f6;">
                    <p style="margin: 0; color: #1e40af;">
                        <i class="fas fa-lightbulb" style="margin-right: 8px;"></i>
                        ${this.getFalsePositiveSuggestion(fp)}
                    </p>
                </div>
            </div>
        `;

        document.getElementById('optimizationDetailContent').innerHTML = detailContent;
        document.getElementById('optimizationDetailTitle').textContent = '误报标注详情 - ' + fp.id;
        
        // 隐藏应用按钮
        const applyBtn = document.getElementById('applyOptimizationBtn');
        applyBtn.style.display = 'none';

        const modal = document.getElementById('optimizationDetailDialog');
        modal.style.display = 'flex';
        setTimeout(() => modal.classList.add('modal-show'), 10);
    }

    // 获取误报详细描述
    getFalsePositiveDescription(fp) {
        const descriptions = {
            'FP001': '该预警涉及某重点科研项目的经费使用，实际情况是该项目获得了学校特别批准，允许在特定阶段超额使用经费以保证项目进度。相关审批文件齐全，符合学校科研管理规定。',
            'FP002': '预算执行进度在第一季度出现偏低情况，主要是由于寒假期间业务活动减少，属于正常的季节性波动。历史数据显示每年第一季度执行率普遍较低，第二季度会明显提升。',
            'FP003': '三公经费支出超过月度限额，实际原因是当月有重要的政策调整，需要组织多次培训和会议，相关支出已经过严格审批，符合新政策要求。',
            'FP004': '采购价格高于市场平均价格，但该设备为进口高端仪器，品牌溢价和技术先进性导致价格较高，经过专家论证确认为合理价格。',
            'FP005': '资产使用率统计显示某大型设备使用率低，实际情况是该设备正在进行年度维护保养，维护期间无法使用，属于正常情况。',
            'FP006': '某学生录取分数低于正常范围，但该生为国家级体育特长生，符合特殊招生政策，相关材料齐全。',
            'FP007': '公务接待费用超过标准，实际是接待重要的教育部检查组，属于必要的公务活动，已按规定审批。',
            'FP008': '科研项目结题延期，主要是受疫情影响，实验室关闭导致研究进度延缓，已申请延期并获批准。',
            'FP009': '差旅费报销金额较高，实际是参加国际学术会议，包含国际机票和住宿费用，符合国际会议差旅标准。',
            'FP010': '固定资产采购未进行招标，实际为单一来源采购，该设备为特定品牌的配套设备，只能从原厂商采购，符合采购规定。',
            'FP011': '预算调整频繁，主要是由于项目需求变更和资金统筹安排，所有调整都经过正规审批流程。',
            'FP012': '津补贴发放金额异常，实际是年终奖集中发放，属于正常的年度绩效奖励，符合学校薪酬制度。'
        };
        return descriptions[fp.id] || '该预警经核实为误报，实际情况符合相关规定和政策要求。';
    }

    // 获取误报证据数据
    getFalsePositiveEvidenceData(fp) {
        const evidenceData = {
            'FP001': '项目编号: KY2024-001\n经费总额: ¥500,000\n已使用: ¥550,000\n超额比例: 10%\n特批文件: 校科字[2024]15号',
            'FP002': '预算科目: 日常运行经费\n年度预算: ¥1,200,000\n第一季度执行: ¥180,000\n执行率: 15%\n历史同期: 12-18%',
            'FP003': '月度限额: ¥50,000\n实际支出: ¥65,000\n超额金额: ¥15,000\n审批文号: 校办发[2024]28号',
            'FP004': '设备名称: 高精度质谱仪\n市场均价: ¥800,000\n采购价格: ¥1,200,000\n品牌: 德国Bruker\n型号: timsTOF Pro',
            'FP005': '设备编号: ZC-2023-089\n设备名称: 电子显微镜\n本月使用: 3天\n使用率: 10%\n维护期: 2025-10-15至10-31',
            'FP006': '考生姓名: 李**\n录取分数: 485分\n批次线: 520分\n特长类型: 国家一级运动员\n项目: 田径',
            'FP007': '接待日期: 2025-10-20\n接待对象: 教育部检查组\n人数: 8人\n费用: ¥6,400\n人均: ¥800',
            'FP008': '项目编号: KY2023-056\n原定结题: 2024-12-31\n申请延期至: 2025-06-30\n延期原因: 疫情影响\n批准文号: 校科字[2024]42号',
            'FP009': '出差人: 王教授\n目的地: 美国波士顿\n会议: IEEE国际会议\n机票: ¥12,000\n住宿: ¥8,000\n总计: ¥22,000',
            'FP010': '采购项目: 实验室配套设备\n金额: ¥350,000\n供应商: 原设备厂商\n采购方式: 单一来源\n批准文号: 校采字[2024]18号',
            'FP011': '预算科目: 科研项目经费\n年度调整次数: 5次\n调整总额: ¥200,000\n最近调整: 2025-10-15',
            'FP012': '发放项目: 年终绩效奖\n发放人数: 120人\n总金额: ¥1,800,000\n人均: ¥15,000\n发放月份: 10月'
        };
        return evidenceData[fp.id] || '预警相关数据信息';
    }

    // 获取误报处理建议
    getFalsePositiveSuggestion(fp) {
        const suggestions = {
            'FP001': '建议在规则中增加"特批项目"例外条件，当存在正式批准文件时不触发预警。',
            'FP002': '建议按季度而非按月评估预算执行进度，或为第一季度设置较低的执行率阈值。',
            'FP003': '建议增加"政策调整期"的例外判断，在政策变更后的适应期内放宽限制。',
            'FP004': '建议在价格比对时考虑品牌因素，对进口高端设备设置更宽的价格区间。',
            'FP005': '建议在使用率统计中自动排除设备维护保养期间，避免误报。',
            'FP006': '建议完善特殊招生政策识别机制，自动识别并排除特长生、少数民族等特殊情况。',
            'FP007': '建议对重要公务接待设置例外规则，或提高接待标准上限。',
            'FP008': '建议增加疫情影响的自动识别和豁免机制。',
            'FP009': '建议区分国内和国际会议，为国际会议设置更高的差旅费标准。',
            'FP010': '建议完善单一来源采购的识别逻辑，当存在合法单一来源采购批准时不触发预警。',
            'FP011': '建议评估预算调整的合理频次，避免将正常的项目管理行为误判为异常。',
            'FP012': '建议识别年终奖等集中发放的薪酬项目，避免误报。'
        };
        return suggestions[fp.id] || '建议优化规则逻辑，减少此类误报。';
    }

    // 渲染漏报记录列表
    renderFalseNegatives() {
        const tbody = document.getElementById('falseNegativesTableBody');
        
        if (this.falseNegatives.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="8" style="text-align: center; padding: 40px; color: #9ca3af;">
                        <i class="fas fa-inbox" style="font-size: 48px; margin-bottom: 12px; display: block;"></i>
                        暂无漏报记录
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = this.falseNegatives.map(fn => `
            <tr>
                <td><strong>${fn.id}</strong></td>
                <td>${fn.title}</td>
                <td>${fn.expectedRule}</td>
                <td>
                    <span class="priority-badge priority-${fn.priority}">
                        ${fn.priority === 'high' ? '高' : fn.priority === 'medium' ? '中' : '低'}
                    </span>
                </td>
                <td>
                    <span class="status-badge status-${fn.status}">
                        ${fn.status === 'pending' ? '待处理' : fn.status === 'analyzing' ? '分析中' : '已处理'}
                    </span>
                </td>
                <td>${fn.reportedBy}</td>
                <td>${new Date(fn.reportedAt).toLocaleString('zh-CN')}</td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="modelOptimization.viewFalseNegativeDetail('${fn.id}')">
                        <i class="fas fa-eye"></i> 查看
                    </button>
                </td>
            </tr>
        `).join('');
    }

    // 查看漏报详情
    viewFalseNegativeDetail(id) {
        const fn = this.falseNegatives.find(item => item.id === id);
        if (!fn) {
            showNotification('error', '记录不存在');
            return;
        }

        // 生成详细信息
        const detailContent = `
            <div class="detail-section">
                <h4>基本信息</h4>
                <div class="detail-grid">
                    <div class="detail-item">
                        <label>记录ID</label>
                        <div><strong>${fn.id}</strong></div>
                    </div>
                    <div class="detail-item">
                        <label>标题</label>
                        <div>${fn.title}</div>
                    </div>
                    <div class="detail-item">
                        <label>期望规则</label>
                        <div>${fn.expectedRule}</div>
                    </div>
                    <div class="detail-item">
                        <label>优先级</label>
                        <div>
                            <span class="priority-badge priority-${fn.priority}">
                                ${fn.priority === 'high' ? '高' : fn.priority === 'medium' ? '中' : '低'}
                            </span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label>状态</label>
                        <div>
                            <span class="status-badge status-${fn.status}">
                                ${fn.status === 'pending' ? '待处理' : fn.status === 'analyzing' ? '分析中' : '已处理'}
                            </span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label>报告人</label>
                        <div>${fn.reportedBy}</div>
                    </div>
                    <div class="detail-item">
                        <label>报告时间</label>
                        <div>${new Date(fn.reportedAt).toLocaleString('zh-CN')}</div>
                    </div>
                </div>
            </div>

            <div class="detail-section">
                <h4>问题描述</h4>
                <div style="padding: 16px; background: var(--color-gray-50); border-radius: 6px; line-height: 1.6;">
                    ${this.getFalseNegativeDescription(fn)}
                </div>
            </div>

            <div class="detail-section">
                <h4>相关数据</h4>
                <div class="code-block">
                    ${this.getFalseNegativeEvidenceData(fn)}
                </div>
            </div>

            <div class="detail-section">
                <h4>原因分析</h4>
                <div style="padding: 16px; background: #fef3c7; border-radius: 6px; border-left: 4px solid #f59e0b;">
                    <h5 style="margin: 0 0 12px 0; color: #92400e;">可能原因：</h5>
                    <ul style="margin: 0; padding-left: 20px; color: #92400e;">
                        ${this.getFalseNegativeReasons(fn).map(r => `<li>${r}</li>`).join('')}
                    </ul>
                </div>
            </div>

            <div class="detail-section">
                <h4>改进建议</h4>
                <div style="padding: 16px; background: #d1fae5; border-radius: 6px; border-left: 4px solid #10b981;">
                    <h5 style="margin: 0 0 12px 0; color: #065f46;">建议措施：</h5>
                    <ul style="margin: 0; padding-left: 20px; color: #065f46;">
                        ${this.getFalseNegativeSuggestions(fn).map(s => `<li>${s}</li>`).join('')}
                    </ul>
                </div>
            </div>
        `;

        document.getElementById('optimizationDetailContent').innerHTML = detailContent;
        document.getElementById('optimizationDetailTitle').textContent = '漏报记录详情 - ' + fn.id;
        
        // 隐藏应用按钮
        const applyBtn = document.getElementById('applyOptimizationBtn');
        applyBtn.style.display = 'none';

        const modal = document.getElementById('optimizationDetailDialog');
        modal.style.display = 'flex';
        setTimeout(() => modal.classList.add('modal-show'), 10);
    }

    // 获取漏报详细描述
    getFalseNegativeDescription(fn) {
        const descriptions = {
            'FN001': '在某次采购活动中，供应商报价明显高于市场价格，但系统未能触发价格异常预警。经核查发现，该供应商与采购负责人存在关联关系，涉嫌利益输送。',
            'FN002': '某实验室的大型设备已连续6个月未使用，造成资源浪费，但系统未能及时发出闲置预警。该设备价值超过200万元，长期闲置造成较大损失。',
            'FN003': '某科研项目经费使用中，存在将科研经费用于非科研支出的情况，但系统未能检测到经费使用的合规性问题。涉及金额约15万元。',
            'FN004': '在招生录取过程中，发现某考生的加分材料存在造假嫌疑，但系统未能识别出异常的加分行为。该问题可能影响招生公平性。',
            'FN005': '某采购项目中，多个供应商的报价异常接近，投标文件高度相似，存在明显的围标串标迹象，但系统未能检测到这种异常模式。',
            'FN006': '某部门的预算执行率长期低于30%，存在预算编制不合理或执行不力的问题，但系统未能及时预警。',
            'FN007': '某公务用车的行驶轨迹显示，多次在非工作时间和非工作区域使用，疑似公车私用，但系统未能识别这种异常使用模式。',
            'FN008': '某供应商与多个采购项目的评审专家存在关联关系，可能影响采购公正性，但系统未能识别这种复杂的关联关系。'
        };
        return descriptions[fn.id] || '该问题未被现有规则检测到，需要完善相关监督规则。';
    }

    // 获取漏报证据数据
    getFalseNegativeEvidenceData(fn) {
        const evidenceData = {
            'FN001': '采购项目: 办公设备采购\n中标价格: ¥450,000\n市场均价: ¥320,000\n溢价率: 40.6%\n供应商: XX科技公司\n关联关系: 采购负责人配偶为该公司股东',
            'FN002': '设备名称: 高性能计算集群\n设备价值: ¥2,100,000\n购置时间: 2024-04-15\n最后使用: 2024-04-20\n闲置时长: 6个月\n所属部门: 计算机学院',
            'FN003': '项目编号: KY2024-023\n项目经费: ¥500,000\n可疑支出: ¥150,000\n支出项目: 办公家具、装修费用\n支出时间: 2025-09-15',
            'FN004': '考生姓名: 王**\n加分项目: 科技创新\n加分分值: 20分\n材料问题: 专利证书疑似伪造\n举报时间: 2025-10-15',
            'FN005': '采购项目: 实验室设备采购\n投标单位: 3家\n报价: ¥980,000、¥985,000、¥990,000\n价差率: 1.02%\n文件相似度: 92%',
            'FN006': '部门: 后勤管理处\n年度预算: ¥5,000,000\n已执行: ¥1,200,000\n执行率: 24%\n时间进度: 75%',
            'FN007': '车牌号: 京A·12345\n非工作时间使用: 15次\n非工作区域: 商场、住宅区\n月度里程: 2,800公里\n可疑里程: 800公里',
            'FN008': '供应商: XX设备公司\n关联项目: 5个\n关联专家: 3人\n关系类型: 亲属、同学\n中标金额: ¥3,200,000'
        };
        return evidenceData[fn.id] || '相关证据数据信息';
    }

    // 获取漏报原因分析
    getFalseNegativeReasons(fn) {
        const reasons = {
            'FN001': [
                '价格异常检测规则的阈值设置过高，未能捕捉到40%的溢价',
                '缺少关联关系检测机制，无法识别采购人员与供应商的关联',
                '未建立供应商背景调查和关系图谱分析功能'
            ],
            'FN002': [
                '资产使用率监控规则未覆盖高价值设备',
                '闲置预警的时间阈值设置过长（可能设置为12个月）',
                '缺少对设备使用频率的持续监控机制'
            ],
            'FN003': [
                '经费使用合规性检查规则不够完善',
                '缺少对支出项目与科研内容相关性的智能判断',
                '未建立科研经费使用的负面清单检测'
            ],
            'FN004': [
                '招生加分材料的真实性验证机制缺失',
                '未与专利、获奖等外部数据库进行交叉验证',
                '缺少对异常加分行为的模式识别'
            ],
            'FN005': [
                '围标串标检测规则过于简单，只关注价格完全一致的情况',
                '未分析投标文件的相似度和异常模式',
                '缺少对供应商关系网络的分析'
            ],
            'FN006': [
                '预算执行率监控只关注超支，忽视了执行率过低的问题',
                '未建立预算执行进度与时间进度的对比分析',
                '缺少对长期低执行率的预警机制'
            ],
            'FN007': [
                '公车使用监控规则只关注总里程，未分析使用时间和地点',
                '缺少对非工作时间和非工作区域使用的识别',
                '未建立车辆轨迹的异常模式分析'
            ],
            'FN008': [
                '关联关系检测只覆盖直接关系，未分析间接和隐蔽关系',
                '缺少对专家与供应商关系的深度挖掘',
                '未建立多维度的关系图谱分析能力'
            ]
        };
        return reasons[fn.id] || ['规则覆盖不全面', '检测逻辑需要优化', '缺少相关数据源'];
    }

    // 获取漏报改进建议
    getFalseNegativeSuggestions(fn) {
        const suggestions = {
            'FN001': [
                '降低价格异常检测的阈值，对溢价超过30%的情况触发预警',
                '建立采购人员与供应商的关联关系检测机制',
                '引入供应商背景调查和关系图谱分析功能',
                '增加人工复核环节，对高金额采购进行重点审查'
            ],
            'FN002': [
                '将高价值设备（>100万）的闲置预警阈值缩短至3个月',
                '建立设备使用情况的月度监控和报告机制',
                '增加设备使用计划与实际使用情况的对比分析',
                '对长期闲置设备启动调配或处置程序'
            ],
            'FN003': [
                '完善科研经费使用合规性检查规则',
                '建立科研经费支出的负面清单和正面清单',
                '增加支出项目与科研内容相关性的智能判断',
                '加强对大额支出和异常支出的审核'
            ],
            'FN004': [
                '建立加分材料的真实性验证机制',
                '与专利局、教育部等外部数据库对接，进行交叉验证',
                '增加对异常加分行为的模式识别和预警',
                '建立加分材料的人工复核机制'
            ],
            'FN005': [
                '完善围标串标检测算法，分析价格分布的异常模式',
                '增加投标文件相似度分析功能',
                '建立供应商关系网络分析，识别关联投标',
                '对异常投标行为进行重点监控和调查'
            ],
            'FN006': [
                '增加预算执行率过低的预警规则',
                '建立预算执行进度与时间进度的对比分析',
                '对长期低执行率部门进行重点关注和督促',
                '优化预算编制和执行管理流程'
            ],
            'FN007': [
                '增加车辆使用时间和地点的异常检测',
                '建立非工作时间和非工作区域使用的识别规则',
                '增加车辆轨迹的异常模式分析',
                '加强对公车使用的实时监控和管理'
            ],
            'FN008': [
                '扩展关联关系检测的范围和深度',
                '建立多维度的关系图谱分析系统',
                '增加对专家与供应商隐蔽关系的挖掘',
                '建立采购评审的回避机制和监督机制'
            ]
        };
        return suggestions[fn.id] || ['完善相关检测规则', '增加数据源', '优化算法模型'];
    }

    // 渲染优化建议列表
    renderOptimizations() {
        const container = document.getElementById('optimizationsList');
        const statusFilter = document.getElementById('statusFilter')?.value || '';

        let filteredOptimizations = this.optimizations;
        if (statusFilter) {
            filteredOptimizations = this.optimizations.filter(o => o.status === statusFilter);
        }

        if (filteredOptimizations.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-inbox"></i>
                    <p>暂无优化建议</p>
                </div>
            `;
            return;
        }

        container.innerHTML = filteredOptimizations.map(opt => `
            <div class="optimization-card ${opt.status}">
                <div class="optimization-card-header">
                    <div class="optimization-card-title">
                        <h3>${opt.ruleName}</h3>
                        <div class="optimization-meta">
                            <span class="meta-item">
                                <i class="fas fa-flag"></i>
                                误报数: ${opt.falsePositiveCount}
                            </span>
                            <span class="meta-item">
                                <i class="fas fa-lightbulb"></i>
                                建议数: ${opt.suggestions.length}
                            </span>
                            <span class="meta-item">
                                <span class="status-badge status-${opt.status}">
                                    ${opt.status === 'applied' ? '已应用' : opt.status === 'rejected' ? '已拒绝' : '待处理'}
                                </span>
                            </span>
                        </div>
                    </div>
                </div>
                <div class="optimization-card-body">
                    <div class="impact-metrics">
                        <div class="impact-metric">
                            <div class="impact-metric-label">当前误报率</div>
                            <div class="impact-metric-value danger">${opt.currentFalsePositiveRate}</div>
                        </div>
                        <div class="impact-metric">
                            <div class="impact-metric-label">预期误报率</div>
                            <div class="impact-metric-value success">${opt.expectedFalsePositiveRate}</div>
                        </div>
                        <div class="impact-metric">
                            <div class="impact-metric-label">预期降低</div>
                            <div class="impact-metric-value primary">${opt.expectedReduction}</div>
                        </div>
                    </div>
                    <ul class="suggestions-list">
                        ${opt.suggestions.map(s => `
                            <li>
                                <strong>${s.title}:</strong> ${s.description}
                                <span class="confidence-badge">${(s.confidence * 100).toFixed(0)}%</span>
                            </li>
                        `).join('')}
                    </ul>
                </div>
                <div class="optimization-card-footer">
                    <span class="time-info">
                        <i class="fas fa-clock"></i>
                        ${new Date(opt.createdAt).toLocaleString('zh-CN')}
                    </span>
                    <div class="optimization-actions">
                        <button class="btn btn-sm btn-primary" onclick="modelOptimization.viewOptimizationDetail('${opt.id}')">
                            <i class="fas fa-eye"></i> 查看详情
                        </button>
                        ${opt.status === 'pending' ? `
                            <button class="btn btn-sm btn-success" onclick="modelOptimization.quickApplyOptimization('${opt.id}')">
                                <i class="fas fa-check"></i> 应用优化
                            </button>
                        ` : ''}
                    </div>
                </div>
            </div>
        `).join('');
    }

    // 查看优化详情
    viewOptimizationDetail(id) {
        const opt = this.optimizations.find(item => item.id === id);
        if (!opt) {
            showNotification('error', '优化方案不存在');
            return;
        }

        this.currentOptimizationId = id;

        const content = `
            <div class="detail-section">
                <h4>基本信息</h4>
                <div class="detail-grid">
                    <div class="detail-item">
                        <label>规则名称</label>
                        <div>${opt.ruleName}</div>
                    </div>
                    <div class="detail-item">
                        <label>规则ID</label>
                        <div>${opt.ruleId}</div>
                    </div>
                    <div class="detail-item">
                        <label>误报数量</label>
                        <div>${opt.falsePositiveCount}</div>
                    </div>
                    <div class="detail-item">
                        <label>状态</label>
                        <div>
                            <span class="status-badge status-${opt.status}">
                                ${opt.status === 'applied' ? '已应用' : '待处理'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="detail-section">
                <h4>优化建议</h4>
                ${opt.suggestions.map((s, index) => `
                    <div style="padding: 16px; margin-bottom: 12px; background: var(--color-gray-50); border-radius: 6px; border-left: 4px solid var(--color-primary);">
                        <h5 style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600;">${index + 1}. ${s.title}</h5>
                        <p style="margin: 0 0 8px 0; color: var(--color-gray-700);">${s.description}</p>
                        <div style="font-size: 13px; color: var(--color-gray-600);">
                            <p style="margin: 4px 0;"><strong>预期效果:</strong> ${s.expectedReduction}</p>
                            <p style="margin: 4px 0;"><strong>置信度:</strong> ${(s.confidence * 100).toFixed(0)}%</p>
                        </div>
                    </div>
                `).join('')}
            </div>

            <div class="detail-section">
                <h4>预期效果</h4>
                <div class="impact-metrics">
                    <div class="impact-metric">
                        <div class="impact-metric-label">当前误报率</div>
                        <div class="impact-metric-value danger">${opt.currentFalsePositiveRate}</div>
                    </div>
                    <div class="impact-metric">
                        <div class="impact-metric-label">预期误报率</div>
                        <div class="impact-metric-value success">${opt.expectedFalsePositiveRate}</div>
                    </div>
                    <div class="impact-metric">
                        <div class="impact-metric-label">预期降低</div>
                        <div class="impact-metric-value primary">${opt.expectedReduction}</div>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('optimizationDetailContent').innerHTML = content;
        document.getElementById('optimizationDetailTitle').textContent = opt.ruleName + ' - 优化方案';
        
        // 更新按钮状态
        const applyBtn = document.getElementById('applyOptimizationBtn');
        if (opt.status === 'applied') {
            applyBtn.disabled = true;
            applyBtn.innerHTML = '<i class="fas fa-check"></i> 已应用';
        } else {
            applyBtn.disabled = false;
            applyBtn.innerHTML = '<i class="fas fa-check"></i> 应用优化';
        }

        const modal = document.getElementById('optimizationDetailDialog');
        modal.style.display = 'flex';
        setTimeout(() => modal.classList.add('modal-show'), 10);
    }

    // 关闭优化详情
    closeOptimizationDetail() {
        const modal = document.getElementById('optimizationDetailDialog');
        modal.classList.remove('modal-show');
        setTimeout(() => {
            modal.style.display = 'none';
            this.currentOptimizationId = null;
            // 恢复应用按钮显示
            const applyBtn = document.getElementById('applyOptimizationBtn');
            applyBtn.style.display = 'inline-flex';
        }, 300);
    }

    // 应用优化方案
    applyOptimization() {
        if (!this.currentOptimizationId) return;

        showNotification('info', '正在应用优化方案...');
        
        // 模拟应用过程
        setTimeout(() => {
            const opt = this.optimizations.find(o => o.id === this.currentOptimizationId);
            if (opt) {
                opt.status = 'applied';
                opt.appliedAt = new Date().toISOString();
            }
            
            showNotification('success', '优化方案应用成功');
            this.closeOptimizationDetail();
            this.renderOptimizations();
            this.renderStatistics();
        }, 2000);
    }

    // 快速应用优化
    quickApplyOptimization(id) {
        this.currentOptimizationId = id;
        this.applyOptimization();
    }

    // 批量分析所有规则
    analyzeAllRules() {
        showNotification('info', '正在分析规则...');
        
        // 模拟分析过程
        setTimeout(() => {
            showNotification('success', '规则分析完成');
        }, 2000);
    }

    // 刷新数据
    refreshData() {
        showNotification('info', '正在刷新数据...');
        
        setTimeout(() => {
            this.renderFalsePositives();
            this.renderFalseNegatives();
            this.renderOptimizations();
            showNotification('success', '数据已刷新');
        }, 1000);
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    window.modelOptimization = new ModelOptimization();
});
