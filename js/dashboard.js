/**
 * 个人工作台页面逻辑
 */

const Dashboard = {
    // 当前页码
    currentPage: 1,
    pageSize: 10,
    currentFilter: 'all',

    // 模拟数据
    mockData: {
        stats: [
            {
                id: 'todo',
                title: '待办事项',
                value: 23,
                trend: { type: 'up', value: '12%' },
                icon: 'fa-tasks',
                color: 'primary',
                link: '#todo-section'
            },
            {
                id: 'alert',
                title: '我的预警',
                value: 15,
                trend: { type: 'down', value: '8%' },
                icon: 'fa-exclamation-triangle',
                color: 'warning',
                link: 'alert-center.html'
            },
            {
                id: 'rectification',
                title: '整改任务',
                value: 8,
                trend: { type: 'up', value: '5%' },
                icon: 'fa-clipboard-check',
                color: 'success',
                link: 'rectification.html'
            },
            {
                id: 'clue',
                title: '本月线索',
                value: 42,
                trend: { type: 'up', value: '15%' },
                icon: 'fa-lightbulb',
                color: 'info',
                link: 'clue-library.html'
            }
        ],

        todos: [
            {
                id: 1,
                title: '审核科研经费报销单 - 张教授课题组',
                description: '监督模型发现张教授课题组科研经费报销存在5张连号发票，金额合计8.5万元，存在虚假报销嫌疑，需要立即核查。',
                type: '预警核查',
                deadline: '2025-10-21 18:00',
                priority: 'urgent',
                status: 'pending',
                source: {
                    type: 'alert',
                    id: 'YJ-2025-001',
                    title: '科研经费报销异常',
                    module: '科研经费监督',
                    createdAt: '2025-10-20 08:30'
                },
                relations: {
                    clueId: 'CLUE2025001',
                    clueTitle: '科研经费报销存在连号发票异常',
                    workOrderId: null,
                    rectificationId: null
                },
                details: {
                    unit: '计算机学院',
                    person: '张教授',
                    amount: 85000,
                    riskLevel: 'high',
                    evidence: [
                        '连号发票5张（发票号：12345-12349）',
                        '报销金额8.5万元',
                        '报销时间：2025-10-15',
                        '报销项目：办公用品采购'
                    ],
                    attachments: [
                        { name: '报销单扫描件.pdf', size: '2.3 MB' },
                        { name: '发票清单.xlsx', size: '156 KB' }
                    ]
                },
                process: {
                    expectedDuration: 2,
                    requiredActions: [
                        { action: '调取报销凭证', completed: false },
                        { action: '核实发票真伪', completed: false },
                        { action: '约谈当事人', completed: false },
                        { action: '形成核查结论', completed: false }
                    ],
                    notes: '请在2个工作日内完成核查，如发现问题及时上报。'
                },
                history: [
                    {
                        time: '2025-10-20 08:30',
                        user: '系统',
                        action: '预警触发',
                        note: '监督模型发现异常'
                    },
                    {
                        time: '2025-10-20 09:00',
                        user: '李主任',
                        action: '创建待办',
                        note: '分配给张三进行核查'
                    }
                ]
            },
            {
                id: 2,
                title: '复查基建项目整改材料 - 图书馆改造工程',
                description: '基建处已完成招标文件排他性条款的整改工作，提交了整改报告和相关材料，需要进行复查验收。',
                type: '整改复查',
                deadline: '2025-10-21 17:00',
                priority: 'high',
                status: 'pending',
                source: {
                    type: 'rectification',
                    id: 'ZG2025004',
                    title: '基建项目招标文件排他性条款整改',
                    module: '整改管理',
                    createdAt: '2025-10-18 10:00'
                },
                relations: {
                    clueId: 'CLUE2025004',
                    clueTitle: '基建项目招标文件存在排他性条款',
                    workOrderId: 'WO202510200002',
                    rectificationId: 'ZG2025004'
                },
                details: {
                    unit: '基建处',
                    person: '赵处长',
                    amount: 0,
                    riskLevel: 'medium',
                    evidence: [
                        '整改报告',
                        '修订后的招标文件',
                        '专家论证意见',
                        '重新招标公告'
                    ],
                    attachments: [
                        { name: '整改报告.pdf', size: '3.2 MB' },
                        { name: '招标文件（修订版）.pdf', size: '4.2 MB' },
                        { name: '专家论证意见.pdf', size: '850 KB' }
                    ]
                },
                process: {
                    expectedDuration: 1,
                    requiredActions: [
                        { action: '审查整改报告', completed: false },
                        { action: '核实整改措施', completed: false },
                        { action: '检查招标文件', completed: false },
                        { action: '出具复查意见', completed: false }
                    ],
                    notes: '重点检查排他性条款是否已完全删除。'
                },
                history: [
                    {
                        time: '2025-10-18 14:00',
                        user: '审计处',
                        action: '发现问题',
                        note: '招标文件存在排他性条款'
                    },
                    {
                        time: '2025-10-20 09:00',
                        user: '纪检监察室',
                        action: '下达整改通知',
                        note: '要求基建处立即整改'
                    },
                    {
                        time: '2025-10-21 09:00',
                        user: '赵处长',
                        action: '提交整改材料',
                        note: '已完成整改，申请复查'
                    }
                ]
            },
            {
                id: 3,
                title: '处理招生录取异常预警 - 计算机学院',
                description: '数据比对发现计算机学院存在3例低分高录情况，需要核查录取流程是否规范，是否存在违规操作。',
                type: '预警处置',
                deadline: '2025-10-22 12:00',
                priority: 'urgent',
                status: 'pending',
                source: {
                    type: 'alert',
                    id: 'YJ-2025-003',
                    title: '招生录取数据异常',
                    module: '招生监督',
                    createdAt: '2025-10-20 16:45'
                },
                details: {
                    unit: '计算机学院',
                    person: '招生办',
                    amount: 0,
                    riskLevel: 'high',
                    evidence: [
                        '3例低分高录情况',
                        '录取分数低于最低控制线',
                        '缺少特殊录取审批材料'
                    ],
                    attachments: [
                        { name: '异常数据清单.xlsx', size: '180 KB' }
                    ]
                },
                process: {
                    expectedDuration: 1,
                    requiredActions: [
                        { action: '调取录取档案', completed: false },
                        { action: '核实录取流程', completed: false },
                        { action: '约谈相关人员', completed: false }
                    ],
                    notes: '涉及招生公平问题，需要高度重视。'
                },
                history: [
                    {
                        time: '2025-10-20 16:45',
                        user: '系统',
                        action: '预警触发',
                        note: '数据比对发现异常'
                    }
                ]
            },
            {
                id: 4,
                title: '审批工单分配申请 - 三公经费超标核查',
                description: '行政办公室本月三公经费支出已达预算的85%，需要审批工单分配申请，安排专人进行核查。',
                type: '工单审批',
                deadline: '2025-10-22 15:00',
                priority: 'normal',
                status: 'pending',
                source: {
                    type: 'workorder',
                    id: 'WO202510210003',
                    title: '三公经费超标核查',
                    module: '工单管理',
                    createdAt: '2025-10-21 10:00'
                },
                details: {
                    unit: '行政办公室',
                    person: '办公室主任',
                    amount: 0,
                    riskLevel: 'medium',
                    evidence: [
                        '三公经费支出明细',
                        '预算执行情况表'
                    ]
                },
                process: {
                    requiredActions: [
                        { action: '审查工单内容', completed: false },
                        { action: '分配核查人员', completed: false },
                        { action: '批准工单', completed: false }
                    ]
                },
                history: [
                    {
                        time: '2025-10-21 10:00',
                        user: '李主任',
                        action: '创建工单',
                        note: '申请分配核查人员'
                    }
                ]
            },
            {
                id: 5,
                title: '完成月度监督报告编写',
                description: '需要完成10月份监督工作总结报告，汇总本月预警处置、线索核查、工单处理、整改跟进等情况。',
                type: '报告编写',
                deadline: '2025-10-23 18:00',
                priority: 'high',
                status: 'pending',
                details: {
                    unit: '纪检监察室',
                    person: '本人',
                    amount: 0,
                    riskLevel: 'low'
                },
                process: {
                    requiredActions: [
                        { action: '收集数据', completed: true },
                        { action: '撰写报告', completed: false },
                        { action: '审核报告', completed: false },
                        { action: '提交报告', completed: false }
                    ]
                },
                history: [
                    {
                        time: '2025-10-20 09:00',
                        user: '系统',
                        action: '创建待办',
                        note: '月度例行任务'
                    },
                    {
                        time: '2025-10-21 14:00',
                        user: '本人',
                        action: '开始处理',
                        note: '已完成数据收集'
                    }
                ]
            },
            {
                id: 6,
                title: '参加纪检工作协调会',
                description: '参加学校纪检工作协调会，讨论本月监督工作情况和下月工作计划。',
                type: '会议参加',
                deadline: '2025-10-23 10:00',
                priority: 'normal',
                status: 'pending',
                details: {
                    unit: '纪检监察室',
                    person: '本人',
                    amount: 0,
                    riskLevel: 'low'
                },
                history: [
                    {
                        time: '2025-10-20 15:00',
                        user: '办公室',
                        action: '发送会议通知',
                        note: '会议时间：10月23日上午10:00'
                    }
                ]
            },
            {
                id: 7,
                title: '审核供应商关联冲突预警',
                description: '监督模型发现某采购项目的中标供应商与评审专家存在关联关系，需要核查是否存在利益冲突。',
                type: '预警核查',
                deadline: '2025-10-24 16:00',
                priority: 'normal',
                status: 'pending',
                source: {
                    type: 'alert',
                    id: 'YJ-2025-006',
                    title: '供应商关联冲突',
                    module: '采购监督',
                    createdAt: '2025-10-19 15:30'
                },
                details: {
                    unit: '采购中心',
                    person: '采购负责人',
                    amount: 0,
                    riskLevel: 'medium',
                    evidence: [
                        '供应商与专家存在关联关系',
                        '未进行回避申报'
                    ]
                },
                process: {
                    requiredActions: [
                        { action: '调取采购档案', completed: false },
                        { action: '核实关联关系', completed: false },
                        { action: '形成处理意见', completed: false }
                    ]
                },
                history: [
                    {
                        time: '2025-10-22 09:00',
                        user: '系统',
                        action: '预警触发',
                        note: '发现关联关系'
                    }
                ]
            },
            {
                id: 8,
                title: '跟进学术不端行为调查',
                description: '收到实名举报，某教师论文存在抄袭嫌疑，查重率达到45%，存在大段抄袭，需要深入调查。',
                type: '线索跟进',
                deadline: '2025-10-25 18:00',
                priority: 'high',
                status: 'pending',
                source: {
                    type: 'clue',
                    id: 'CLUE2025007',
                    title: '论文存在抄袭嫌疑',
                    module: '学术诚信监督',
                    createdAt: '2025-10-18 14:20'
                },
                relations: {
                    clueId: 'CLUE2025007',
                    clueTitle: '论文存在抄袭嫌疑',
                    workOrderId: 'WO202510250001',
                    rectificationId: null
                },
                details: {
                    unit: '数学学院',
                    person: '某教师',
                    amount: 0,
                    riskLevel: 'high',
                    evidence: [
                        '查重报告显示重复率45%',
                        '存在大段文字抄袭',
                        '参考文献标注不规范',
                        '实名举报材料'
                    ],
                    attachments: [
                        { name: '查重报告.pdf', size: '2.8 MB' },
                        { name: '举报材料.docx', size: '450 KB' }
                    ]
                },
                process: {
                    expectedDuration: 3,
                    requiredActions: [
                        { action: '核实举报内容', completed: true },
                        { action: '调取论文原文', completed: true },
                        { action: '进行查重检测', completed: true },
                        { action: '约谈当事人', completed: false },
                        { action: '形成调查结论', completed: false }
                    ],
                    notes: '涉及学术诚信问题，需要严肃处理。'
                },
                history: [
                    {
                        time: '2025-10-18 14:20',
                        user: '举报人',
                        action: '提交举报',
                        note: '实名举报学术不端行为'
                    },
                    {
                        time: '2025-10-18 15:00',
                        user: '学术委员会',
                        action: '创建待办',
                        note: '分配给相关人员调查'
                    },
                    {
                        time: '2025-10-19 10:30',
                        user: '张三',
                        action: '开始调查',
                        note: '已完成初步核实'
                    }
                ]
            }
        ],

        alerts: [
            {
                id: 1,
                level: 'high',
                title: '科研经费异常报销',
                content: '检测到张教授课题组存在连号发票报销，涉及金额 5.2 万元',
                source: '规则引擎',
                time: '2025-10-21 09:30',
                person: '张三教授',
                amount: '52,000'
            },
            {
                id: 2,
                level: 'medium',
                title: '三公经费接近预算红线',
                content: '行政办公室本月三公经费支出已达预算的 85%',
                source: '预算监控',
                time: '2025-10-21 08:15',
                department: '行政办公室',
                percentage: '85%'
            },
            {
                id: 3,
                level: 'high',
                title: '招生录取数据异常',
                content: '计算机学院发现 3 例低分高录情况，需要核查',
                source: '数据比对',
                time: '2025-10-20 16:45',
                department: '计算机学院',
                count: '3'
            },
            {
                id: 4,
                level: 'low',
                title: '固定资产盘点差异',
                content: '物理学院固定资产盘点发现 2 台设备账实不符',
                source: '资产系统',
                time: '2025-10-20 14:20',
                department: '物理学院',
                count: '2'
            },
            {
                id: 5,
                level: 'medium',
                title: '工程变更频率异常',
                content: '体育馆改造项目工程变更次数超过阈值',
                source: '工程监控',
                time: '2025-10-20 11:00',
                project: '体育馆改造',
                count: '8'
            }
        ],

        activities: [
            {
                id: 1,
                type: 'success',
                time: '2025-10-21 10:30',
                user: '张三',
                action: '完成了预警核查',
                target: '供应商关联冲突预警 #2024-1015'
            },
            {
                id: 2,
                type: 'primary',
                time: '2025-10-21 09:15',
                user: '李四',
                action: '分发了工单',
                target: '三公经费超标核查工单'
            },
            {
                id: 3,
                type: 'warning',
                time: '2025-10-21 08:45',
                user: '王五',
                action: '标记了整改任务超期',
                target: '基建项目整改 #2024-0892'
            },
            {
                id: 4,
                type: 'success',
                time: '2025-10-20 17:20',
                user: '张三',
                action: '归档了线索',
                target: '科研经费使用异常线索 #2024-0756'
            },
            {
                id: 5,
                type: 'primary',
                time: '2025-10-20 16:00',
                user: '赵六',
                action: '创建了新线索',
                target: '招生录取数据异常'
            },
            {
                id: 6,
                type: 'success',
                time: '2025-10-20 14:30',
                user: '张三',
                action: '完成了整改复查',
                target: '财务管理整改任务 #2024-0623'
            }
        ]
    },

    /**
     * 初始化
     */
    async init() {
        console.log('[Dashboard] 开始初始化');
        this.updateCurrentDate();
        console.log('[Dashboard] 加载数据前，mockData.todos数量:', this.mockData.todos.length);
        await this.loadData();
        console.log('[Dashboard] 加载数据后，mockData.todos数量:', this.mockData.todos.length);
        console.log('[Dashboard] 加载数据后，mockData.alerts数量:', this.mockData.alerts.length);
        console.log('[Dashboard] 加载数据后，mockData.activities数量:', this.mockData.activities.length);
        this.renderStatsCards();
        this.renderTodoList();
        this.renderAlertList();
        this.renderTimeline();
        this.bindEvents();
        console.log('[Dashboard] 初始化完成');
    },

    /**
     * 加载数据
     */
    async loadData() {
        try {
            // 尝试从dataService加载数据，如果失败则使用mockData
            if (window.dataService && typeof window.dataService.getDashboardStats === 'function') {
                // 加载统计数据
                const stats = await window.dataService.getDashboardStats();
                this.mockData.stats = [
                    {
                        id: 'todo',
                        title: '待办事项',
                        value: stats.todos.total,
                        trend: { type: stats.todos.trendUp ? 'up' : 'down', value: stats.todos.trend },
                        icon: 'fa-tasks',
                        color: 'primary',
                        link: '#todo-section'
                    },
                    {
                        id: 'alert',
                        title: '我的预警',
                        value: stats.myAlerts.total,
                        trend: { type: stats.myAlerts.trendUp ? 'up' : 'down', value: stats.myAlerts.trend },
                        icon: 'fa-exclamation-triangle',
                        color: 'warning',
                        link: 'alert-center.html'
                    },
                    {
                        id: 'rectification',
                        title: '整改任务',
                        value: stats.rectifications.total,
                        trend: { type: stats.rectifications.trendUp ? 'up' : 'down', value: stats.rectifications.trend },
                        icon: 'fa-clipboard-check',
                        color: 'success',
                        link: 'rectification.html'
                    },
                    {
                        id: 'clue',
                        title: '本月线索',
                        value: stats.monthlyClues.total,
                        trend: { type: stats.monthlyClues.trendUp ? 'up' : 'down', value: stats.monthlyClues.trend },
                        icon: 'fa-lightbulb',
                        color: 'info',
                        link: 'clue-library.html'
                    }
                ];

                // 加载待办事项
                const todos = await window.dataService.getTodos();
                // 只在有数据时才覆盖mockData
                if (todos && todos.length > 0) {
                    this.mockData.todos = todos.map(todo => ({
                        id: todo.id,
                        title: todo.title,
                        type: todo.type,
                        deadline: todo.deadline,
                        priority: todo.priority,
                        status: todo.status
                    }));
                    console.log('[Dashboard] 使用dataService的待办数据');
                } else {
                    console.log('[Dashboard] dataService返回空待办数据，保留mockData');
                }

                // 加载预警列表（只显示未处理的）
                const alertsResult = await window.dataService.getAlerts({ status: 'unprocessed' });
                // 只在有数据时才覆盖mockData
                if (alertsResult && alertsResult.data && alertsResult.data.length > 0) {
                    this.mockData.alerts = alertsResult.data.slice(0, 5).map(alert => ({
                        id: alert.id,
                        level: alert.riskLevel,
                        title: alert.title,
                        content: alert.description,
                        source: alert.source,
                        time: Utils.formatDate(alert.createTime, 'MM-DD HH:mm'),
                        person: alert.involvedPerson,
                        department: alert.involvedDepartment,
                        amount: alert.amount ? Utils.formatNumber(alert.amount) : null
                    }));
                    console.log('[Dashboard] 使用dataService的预警数据');
                } else {
                    console.log('[Dashboard] dataService返回空预警数据，保留mockData');
                }

                // 加载最近动态
                const activities = await window.dataService.getRecentActivities(6);
                // 只在有数据时才覆盖mockData
                if (activities && activities.length > 0) {
                    this.mockData.activities = activities.map(activity => ({
                        id: activity.id,
                        type: activity.type,
                        time: Utils.formatDate(activity.time, 'MM-DD HH:mm'),
                        user: activity.user,
                        action: activity.action,
                        target: activity.title
                    }));
                    console.log('[Dashboard] 使用dataService的动态数据');
                } else {
                    console.log('[Dashboard] dataService返回空动态数据，保留mockData');
                }
            } else {
                console.log('使用模拟数据');
                // 如果dataService不可用，使用mockData中的默认数据
                // mockData已经在类定义时初始化，无需额外操作
            }
        } catch (error) {
            console.error('Failed to load dashboard data:', error);
            console.log('使用模拟数据作为后备');
            // 发生错误时，使用mockData中的默认数据
            // mockData已经在类定义时初始化，无需额外操作
        }
    },

    /**
     * 更新当前日期
     */
    updateCurrentDate() {
        const dateElement = document.getElementById('current-date');
        if (dateElement) {
            const now = new Date();
            const options = { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                weekday: 'long'
            };
            dateElement.textContent = now.toLocaleDateString('zh-CN', options);
        }
    },

    /**
     * 渲染统计卡片
     */
    renderStatsCards() {
        const container = document.getElementById('stats-cards');
        if (!container) return;

        const html = this.mockData.stats.map(stat => `
            <div class="stat-card stat-card-${stat.color}" onclick="Dashboard.navigateToCard('${stat.link}')">
                <div class="stat-icon">
                    <i class="fas ${stat.icon}"></i>
                </div>
                <div class="stat-content">
                    <div class="stat-label">${stat.title}</div>
                    <div class="stat-value">${stat.value}</div>
                    <div class="stat-extra">
                        <span class="stat-trend ${stat.trend.type}">
                            <i class="fas fa-arrow-${stat.trend.type === 'up' ? 'up' : 'down'}"></i>
                            ${stat.trend.value}
                        </span>
                        较上月
                    </div>
                </div>
            </div>
        `).join('');

        container.innerHTML = html;
    },

    /**
     * 渲染待办列表
     */
    renderTodoList() {
        console.log('[Dashboard] 开始渲染待办列表，数据数量:', this.mockData.todos.length);
        const tbody = document.getElementById('todo-tbody');
        if (!tbody) {
            console.error('[Dashboard] 找不到todo-tbody元素');
            return;
        }

        // 筛选数据
        let filteredTodos = this.mockData.todos;
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        if (this.currentFilter === 'urgent') {
            filteredTodos = filteredTodos.filter(todo => todo.priority === 'urgent');
        } else if (this.currentFilter === 'today') {
            filteredTodos = filteredTodos.filter(todo => {
                const deadline = new Date(todo.deadline);
                const deadlineDate = new Date(deadline.getFullYear(), deadline.getMonth(), deadline.getDate());
                return deadlineDate.getTime() === today.getTime();
            });
        } else if (this.currentFilter === 'overdue') {
            filteredTodos = filteredTodos.filter(todo => {
                const deadline = new Date(todo.deadline);
                return deadline < now;
            });
        }

        // 更新计数
        this.updateTodoCounts();

        // 分页
        const start = (this.currentPage - 1) * this.pageSize;
        const end = start + this.pageSize;
        const paginatedTodos = filteredTodos.slice(start, end);

        if (paginatedTodos.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" class="empty-state">
                        <i class="fas fa-inbox"></i>
                        <p>暂无待办事项</p>
                    </td>
                </tr>
            `;
            return;
        }

        const html = paginatedTodos.map((todo, index) => {
            const deadline = new Date(todo.deadline);
            const isOverdue = deadline < now;
            const isToday = deadline.toDateString() === now.toDateString();

            return `
                <tr>
                    <td><input type="checkbox" class="todo-checkbox" data-id="${todo.id}"></td>
                    <td>${start + index + 1}</td>
                    <td>
                        <a href="javascript:void(0)" onclick="Dashboard.viewTodoDetail('${todo.id}')" class="text-primary">
                            ${todo.title}
                        </a>
                    </td>
                    <td><span class="badge badge-processing">${todo.type}</span></td>
                    <td class="${isOverdue ? 'text-danger' : isToday ? 'text-warning' : ''}">
                        <i class="fas fa-clock"></i>
                        ${Utils.formatDate(todo.deadline, 'MM-DD HH:mm')}
                        ${isOverdue ? '<i class="fas fa-exclamation-circle"></i>' : ''}
                    </td>
                    <td>
                        <span class="priority-badge ${todo.priority}">
                            ${this.getPriorityText(todo.priority)}
                        </span>
                    </td>
                    <td>
                        <button class="btn btn-sm btn-primary" onclick="Dashboard.processTodo('${todo.id}')">
                            <i class="fas fa-check"></i>
                            处理
                        </button>
                        <button class="btn btn-sm btn-secondary" onclick="Dashboard.viewTodoDetail('${todo.id}')">
                            <i class="fas fa-eye"></i>
                            查看
                        </button>
                    </td>
                </tr>
            `;
        }).join('');

        tbody.innerHTML = html;

        // 渲染分页
        this.renderPagination(filteredTodos.length);
    },

    /**
     * 更新待办计数
     */
    updateTodoCounts() {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        const counts = {
            all: this.mockData.todos.length,
            urgent: this.mockData.todos.filter(t => t.priority === 'urgent').length,
            today: this.mockData.todos.filter(t => {
                const deadline = new Date(t.deadline);
                const deadlineDate = new Date(deadline.getFullYear(), deadline.getMonth(), deadline.getDate());
                return deadlineDate.getTime() === today.getTime();
            }).length,
            overdue: this.mockData.todos.filter(t => new Date(t.deadline) < now).length
        };

        Object.keys(counts).forEach(key => {
            const element = document.getElementById(`count-${key}`);
            if (element) {
                element.textContent = counts[key];
            }
        });
    },

    /**
     * 渲染分页
     */
    renderPagination(totalItems) {
        const container = document.getElementById('todo-pagination');
        if (!container) return;

        const totalPages = Math.ceil(totalItems / this.pageSize);
        
        if (totalPages <= 1) {
            container.innerHTML = '';
            return;
        }

        let html = `
            <button ${this.currentPage === 1 ? 'disabled' : ''} onclick="Dashboard.changePage(${this.currentPage - 1})">
                <i class="fas fa-chevron-left"></i>
            </button>
        `;

        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= this.currentPage - 1 && i <= this.currentPage + 1)) {
                html += `
                    <button class="${i === this.currentPage ? 'active' : ''}" onclick="Dashboard.changePage(${i})">
                        ${i}
                    </button>
                `;
            } else if (i === this.currentPage - 2 || i === this.currentPage + 2) {
                html += '<span>...</span>';
            }
        }

        html += `
            <button ${this.currentPage === totalPages ? 'disabled' : ''} onclick="Dashboard.changePage(${this.currentPage + 1})">
                <i class="fas fa-chevron-right"></i>
            </button>
            <span class="pagination-info">共 ${totalItems} 条</span>
        `;

        container.innerHTML = html;
    },

    /**
     * 渲染预警列表
     */
    renderAlertList() {
        console.log('[Dashboard] 开始渲染预警列表，数据数量:', this.mockData.alerts.length);
        const container = document.getElementById('alert-list');
        if (!container) {
            console.error('[Dashboard] 找不到alert-list元素');
            return;
        }

        if (this.mockData.alerts.length === 0) {
            container.innerHTML = '<div class="empty-state">暂无预警信息</div>';
            return;
        }

        // 添加批量操作工具栏
        const selectedCount = this.mockData.alerts.filter(a => a.selected).length;
        const toolbarHtml = `
            <div class="alert-toolbar">
                <div class="alert-toolbar-left">
                    <label class="checkbox-label">
                        <input type="checkbox" id="check-all-alerts" onchange="Dashboard.toggleAllAlerts()">
                        <span>全选</span>
                    </label>
                    ${selectedCount > 0 ? `<span class="selected-count">已选择 ${selectedCount} 项</span>` : ''}
                </div>
                <div class="alert-toolbar-right">
                    ${selectedCount > 0 ? `
                        <button class="btn btn-sm btn-primary" onclick="Dashboard.batchProcessAlerts()">
                            <i class="fas fa-check"></i> 批量处理
                        </button>
                    ` : ''}
                    <button class="btn btn-sm btn-secondary" onclick="Dashboard.refreshAlerts()">
                        <i class="fas fa-sync-alt"></i> 刷新
                    </button>
                    <button class="btn btn-sm btn-info" onclick="Dashboard.exportAlerts()">
                        <i class="fas fa-download"></i> 导出
                    </button>
                </div>
            </div>
        `;

        const alertsHtml = this.mockData.alerts.map(alert => `
            <div class="alert-item ${alert.level} ${alert.selected ? 'selected' : ''}">
                <div class="alert-checkbox">
                    <input type="checkbox" ${alert.selected ? 'checked' : ''} 
                           onchange="Dashboard.toggleAlertSelection('${alert.id}')" 
                           onclick="event.stopPropagation()">
                </div>
                <div class="alert-main" onclick="Dashboard.viewAlertDetail('${alert.id}')">
                    <div class="alert-header">
                        <span class="alert-level ${alert.level}">
                            ${alert.level === 'high' ? '高风险' : alert.level === 'medium' ? '中风险' : '低风险'}
                        </span>
                        <span class="alert-time">${alert.time}</span>
                    </div>
                    <div class="alert-content">
                        <div class="alert-title">${alert.title}</div>
                        <div class="alert-description">${alert.content}</div>
                        <div class="alert-meta">
                            <span class="alert-source">${alert.source}</span>
                            ${alert.person ? `<span class="alert-person"><i class="fas fa-user"></i> ${alert.person}</span>` : ''}
                            ${alert.department ? `<span class="alert-department"><i class="fas fa-building"></i> ${alert.department}</span>` : ''}
                            ${alert.amount ? `<span class="alert-amount"><i class="fas fa-dollar-sign"></i> ${alert.amount}</span>` : ''}
                            ${alert.count ? `<span class="alert-count"><i class="fas fa-exclamation-circle"></i> ${alert.count}个问题</span>` : ''}
                            ${alert.percentage ? `<span class="alert-percentage"><i class="fas fa-chart-pie"></i> ${alert.percentage}</span>` : ''}
                        </div>
                    </div>
                </div>
                <div class="alert-actions">
                    <button class="btn btn-sm btn-primary" onclick="event.stopPropagation(); Dashboard.processAlert('${alert.id}')" title="处理">
                        <i class="fas fa-check"></i>
                    </button>
                    <button class="btn btn-sm btn-success" onclick="event.stopPropagation(); Dashboard.markAlertRead('${alert.id}')" title="标记已读">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-warning" onclick="event.stopPropagation(); Dashboard.ignoreAlert('${alert.id}')" title="忽略">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
        `).join('');

        container.innerHTML = toolbarHtml + '<div class="alert-items">' + alertsHtml + '</div>';
        
        // 更新全选状态
        const checkAll = document.getElementById('check-all-alerts');
        if (checkAll) {
            const selectedCount = this.mockData.alerts.filter(a => a.selected).length;
            checkAll.checked = selectedCount === this.mockData.alerts.length && this.mockData.alerts.length > 0;
            checkAll.indeterminate = selectedCount > 0 && selectedCount < this.mockData.alerts.length;
        }
    },

    /**
     * 渲染时间线
     */
    renderTimeline() {
        console.log('[Dashboard] 开始渲染时间线，数据数量:', this.mockData.activities.length);
        const container = document.getElementById('timeline');
        if (!container) {
            console.error('[Dashboard] 找不到timeline元素');
            return;
        }

        const html = this.mockData.activities.map(activity => `
            <div class="timeline-item ${activity.type}">
                <div class="timeline-dot"></div>
                <div class="timeline-time">${activity.time}</div>
                <div class="timeline-content">
                    <span class="timeline-user">${activity.user}</span>
                    ${activity.action}
                    <strong>${activity.target}</strong>
                </div>
            </div>
        `).join('');

        container.innerHTML = html;
    },

    /**
     * 绑定事件
     */
    bindEvents() {
        // 全选复选框
        const selectAll = document.getElementById('select-all');
        if (selectAll) {
            selectAll.addEventListener('change', (e) => {
                const checkboxes = document.querySelectorAll('.todo-checkbox');
                checkboxes.forEach(cb => cb.checked = e.target.checked);
            });
        }

        // 筛选按钮
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                filterBtns.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentFilter = e.target.dataset.filter;
                this.currentPage = 1;
                this.renderTodoList();
            });
        });
    },

    /**
     * 获取优先级文本
     */
    getPriorityText(priority) {
        const map = {
            urgent: '紧急',
            high: '高',
            normal: '普通',
            low: '低'
        };
        return map[priority] || priority;
    },

    /**
     * 获取预警等级文本
     */
    getAlertLevelText(level) {
        const map = {
            high: '高风险',
            medium: '中风险',
            low: '低风险'
        };
        return map[level] || level;
    },

    /**
     * 切换页码
     */
    changePage(page) {
        this.currentPage = page;
        this.renderTodoList();
        // 滚动到表格顶部
        document.getElementById('todo-table').scrollIntoView({ behavior: 'smooth' });
    },

    /**
     * 卡片导航
     */
    navigateToCard(link) {
        if (link.startsWith('#')) {
            const element = document.querySelector(link);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        } else {
            window.location.href = link;
        }
    },

    /**
     * 快捷操作
     */
    quickAction(action) {
        if (action === 'new-clue') {
            this.showNewClueForm();
        } else if (action === 'new-order') {
            this.showNewOrderForm();
        }
    },

    /**
     * 显示新建线索表单
     */
    showNewClueForm() {
        const formHtml = `
            <form id="new-clue-form" class="form-grid">
                <div class="form-group">
                    <label class="required">线索标题</label>
                    <input type="text" name="title" class="form-control" placeholder="请输入线索标题" required>
                </div>
                <div class="form-group">
                    <label class="required">线索类型</label>
                    <select name="type" class="form-control" required>
                        <option value="">请选择</option>
                        <option value="纪检监察">纪检监察</option>
                        <option value="审计监督">审计监督</option>
                        <option value="巡察巡视">巡察巡视</option>
                        <option value="信访举报">信访举报</option>
                        <option value="其他">其他</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="required">线索来源</label>
                    <select name="source" class="form-control" required>
                        <option value="">请选择</option>
                        <option value="系统预警">系统预警</option>
                        <option value="群众举报">群众举报</option>
                        <option value="上级交办">上级交办</option>
                        <option value="日常监督">日常监督</option>
                        <option value="专项检查">专项检查</option>
                        <option value="其他">其他</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="required">紧急程度</label>
                    <select name="urgency" class="form-control" required>
                        <option value="">请选择</option>
                        <option value="紧急">紧急</option>
                        <option value="重要">重要</option>
                        <option value="一般">一般</option>
                    </select>
                </div>
                <div class="form-group full-width">
                    <label>涉及人员</label>
                    <input type="text" name="person" class="form-control" placeholder="请输入涉及人员姓名">
                </div>
                <div class="form-group full-width">
                    <label>涉及部门</label>
                    <input type="text" name="department" class="form-control" placeholder="请输入涉及部门">
                </div>
                <div class="form-group full-width">
                    <label class="required">线索描述</label>
                    <textarea name="description" class="form-control" rows="4" placeholder="请详细描述线索内容" required></textarea>
                </div>
                <div class="form-group full-width">
                    <label>附件上传</label>
                    <input type="file" name="attachments" class="form-control" multiple>
                    <small class="form-text">支持上传多个文件，单个文件不超过10MB</small>
                </div>
            </form>
        `;

        Modal.show({
            title: '新建线索',
            content: formHtml,
            width: '600px',
            showFooter: true,
            confirmText: '提交',
            onConfirm: () => {
                const form = document.getElementById('new-clue-form');
                if (!form.checkValidity()) {
                    form.reportValidity();
                    return false;
                }

                const formData = new FormData(form);
                const data = Object.fromEntries(formData.entries());
                
                console.log('新建线索数据:', data);
                Toast.success('线索创建成功！');
                
                // 刷新页面数据
                setTimeout(() => {
                    this.loadData().then(() => {
                        this.renderStatsCards();
                        this.renderTodoList();
                    });
                }, 500);
                
                return true;
            }
        });
    },

    /**
     * 显示创建工单表单
     */
    showNewOrderForm() {
        const formHtml = `
            <form id="new-order-form" class="form-grid">
                <div class="form-group">
                    <label class="required">工单标题</label>
                    <input type="text" name="title" class="form-control" placeholder="请输入工单标题" required>
                </div>
                <div class="form-group">
                    <label class="required">工单类型</label>
                    <select name="type" class="form-control" required>
                        <option value="">请选择</option>
                        <option value="预警核查">预警核查</option>
                        <option value="线索核实">线索核实</option>
                        <option value="专项检查">专项检查</option>
                        <option value="整改督办">整改督办</option>
                        <option value="其他">其他</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="required">优先级</label>
                    <select name="priority" class="form-control" required>
                        <option value="">请选择</option>
                        <option value="urgent">紧急</option>
                        <option value="high">高</option>
                        <option value="normal">普通</option>
                        <option value="low">低</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="required">负责人</label>
                    <select name="assignee" class="form-control" required>
                        <option value="">请选择</option>
                        <option value="张三">张三</option>
                        <option value="李四">李四</option>
                        <option value="王五">王五</option>
                        <option value="赵六">赵六</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="required">完成期限</label>
                    <input type="datetime-local" name="deadline" class="form-control" required>
                </div>
                <div class="form-group">
                    <label>关联线索</label>
                    <input type="text" name="relatedClue" class="form-control" placeholder="请输入线索编号">
                </div>
                <div class="form-group full-width">
                    <label class="required">工单描述</label>
                    <textarea name="description" class="form-control" rows="4" placeholder="请详细描述工单内容和要求" required></textarea>
                </div>
                <div class="form-group full-width">
                    <label>附件上传</label>
                    <input type="file" name="attachments" class="form-control" multiple>
                    <small class="form-text">支持上传多个文件，单个文件不超过10MB</small>
                </div>
            </form>
        `;

        Modal.show({
            title: '创建工单',
            content: formHtml,
            width: '600px',
            showFooter: true,
            confirmText: '创建',
            onConfirm: () => {
                const form = document.getElementById('new-order-form');
                if (!form.checkValidity()) {
                    form.reportValidity();
                    return false;
                }

                const formData = new FormData(form);
                const data = Object.fromEntries(formData.entries());
                
                console.log('创建工单数据:', data);
                Toast.success('工单创建成功！');
                
                // 刷新页面数据
                setTimeout(() => {
                    this.loadData().then(() => {
                        this.renderStatsCards();
                        this.renderTodoList();
                    });
                }, 500);
                
                return true;
            }
        });
    },

    /**
     * 刷新待办
     */
    async refreshTodos() {
        Toast.info('正在刷新待办列表...');
        try {
            await this.loadData();
            this.renderTodoList();
            Toast.success('刷新成功');
        } catch (error) {
            Toast.error('刷新失败');
        }
    },

    /**
     * 查看待办详情
     */
    viewTodoDetail(id) {
        const todo = this.mockData.todos.find(t => t.id == id);
        if (!todo) {
            console.error('[Dashboard] 找不到待办:', id, '现有待办:', this.mockData.todos.map(t => t.id));
            Toast.error('待办事项不存在');
            return;
        }

        const deadline = new Date(todo.deadline);
        const now = new Date();
        const isOverdue = deadline < now;

        const detailHtml = `
            <div style="max-height: 70vh; overflow-y: auto; padding: 20px;">
                <!-- 基本信息 -->
                <div class="detail-section" style="margin-bottom: 24px;">
                    <h3 class="detail-section-title" style="font-size: 18px; margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
                        <i class="fas fa-info-circle"></i>
                        ${todo.title}
                        <span class="priority-badge ${todo.priority}" style="padding: 4px 12px; border-radius: 4px; font-size: 13px; margin-left: auto;">
                            ${this.getPriorityText(todo.priority)}
                        </span>
                    </h3>
                    <p style="color: var(--color-gray-600); line-height: 1.6; margin-bottom: 12px;">${todo.description || '此待办事项需要您及时处理，请根据实际情况完成相关工作。'}</p>
                    ${todo.process?.notes ? `
                        <div style="padding: 12px; background: #fef2f2; border-left: 3px solid #dc2626; border-radius: 4px; color: #991b1b; font-size: 14px;">
                            <strong>注意事项：</strong>${todo.process.notes}
                        </div>
                    ` : ''}
                </div>

                <!-- 来源追溯 -->
                ${todo.source ? `
                <div class="detail-section" style="margin-bottom: 24px;">
                    <h4 style="font-size: 15px; font-weight: 600; margin-bottom: 12px; display: flex; align-items: center; gap: 6px;">
                        <i class="fas fa-link"></i>
                        来源追溯
                    </h4>
                    <div style="display: flex; align-items: center; gap: 12px; padding: 12px; background: var(--color-gray-50); border-radius: 8px; border: 1px solid var(--color-gray-200);">
                        <div style="width: 40px; height: 40px; border-radius: 8px; background: ${todo.source.type === 'alert' ? '#ef4444' : todo.source.type === 'clue' ? '#10b981' : todo.source.type === 'workorder' ? '#3b82f6' : '#f59e0b'}; color: white; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                            <i class="fas ${todo.source.type === 'alert' ? 'fa-bell' : todo.source.type === 'clue' ? 'fa-lightbulb' : todo.source.type === 'workorder' ? 'fa-clipboard-check' : 'fa-tasks'}"></i>
                        </div>
                        <div style="flex: 1;">
                            <div style="font-size: 14px; font-weight: 600; color: var(--color-gray-900); margin-bottom: 2px;">${todo.source.id} - ${todo.source.title}</div>
                            <div style="font-size: 12px; color: var(--color-gray-600);">模块: ${todo.source.module} · 时间: ${todo.source.createdAt}</div>
                        </div>
                        <button class="btn btn-sm btn-primary" onclick="Dashboard.viewSourceDetail('${todo.source.type}', '${todo.source.id}')" style="padding: 6px 12px; font-size: 13px;">
                            <i class="fas fa-external-link-alt"></i>
                            查看
                        </button>
                    </div>
                </div>
                ` : ''}

                <!-- 任务详情 -->
                ${todo.details ? `
                <div class="detail-section" style="margin-bottom: 24px;">
                    <h4 style="font-size: 15px; font-weight: 600; margin-bottom: 12px; display: flex; align-items: center; gap: 6px;">
                        <i class="fas fa-list-alt"></i>
                        任务详情
                    </h4>
                    <div class="detail-grid" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; padding: 16px; background: var(--color-gray-50); border-radius: 8px;">
                        <div>
                            <div style="font-size: 12px; color: var(--color-gray-500); margin-bottom: 4px;">涉及单位</div>
                            <div style="font-size: 14px; color: var(--color-gray-900);">${todo.details.unit}</div>
                        </div>
                        <div>
                            <div style="font-size: 12px; color: var(--color-gray-500); margin-bottom: 4px;">涉及人员</div>
                            <div style="font-size: 14px; color: var(--color-gray-900);">${todo.details.person}</div>
                        </div>
                        ${todo.details.amount > 0 ? `
                        <div>
                            <div style="font-size: 12px; color: var(--color-gray-500); margin-bottom: 4px;">涉及金额</div>
                            <div style="font-size: 14px; color: var(--color-gray-900);">${(todo.details.amount / 10000).toFixed(1)}万元</div>
                        </div>
                        ` : ''}
                        <div>
                            <div style="font-size: 12px; color: var(--color-gray-500); margin-bottom: 4px;">风险等级</div>
                            <div>
                                <span style="display: inline-flex; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 500; ${todo.details.riskLevel === 'high' ? 'background: rgba(239, 68, 68, 0.1); color: #991b1b;' : todo.details.riskLevel === 'medium' ? 'background: rgba(245, 158, 11, 0.1); color: #92400e;' : 'background: rgba(59, 130, 246, 0.1); color: #1e40af;'}">
                                    ${todo.details.riskLevel === 'high' ? '高风险' : todo.details.riskLevel === 'medium' ? '中风险' : '低风险'}
                                </span>
                            </div>
                        </div>
                        <div>
                            <div style="font-size: 12px; color: var(--color-gray-500); margin-bottom: 4px;">截止时间</div>
                            <div style="font-size: 14px; color: var(--color-gray-900);">${Utils.formatDate(todo.deadline)}</div>
                        </div>
                        <div>
                            <div style="font-size: 12px; color: var(--color-gray-500); margin-bottom: 4px;">任务类型</div>
                            <div style="font-size: 14px; color: var(--color-gray-900);">${todo.type}</div>
                        </div>
                    </div>
                </div>
                ` : ''}

                <!-- 证据材料 -->
                ${todo.details?.evidence?.length > 0 ? `
                <div class="detail-section" style="margin-bottom: 24px;">
                    <h4 style="font-size: 15px; font-weight: 600; margin-bottom: 12px; display: flex; align-items: center; gap: 6px;">
                        <i class="fas fa-file-alt"></i>
                        证据材料
                    </h4>
                    <ul style="list-style: none; padding: 0; margin: 0;">
                        ${todo.details.evidence.map(item => `
                            <li style="padding: 8px 12px; background: var(--color-gray-50); border-radius: 6px; margin-bottom: 8px; border-left: 3px solid var(--color-primary); font-size: 14px; color: var(--color-gray-700);">
                                ${item}
                            </li>
                        `).join('')}
                    </ul>
                </div>
                ` : ''}

                <!-- 附件列表 -->
                ${todo.details?.attachments?.length > 0 ? `
                <div class="detail-section" style="margin-bottom: 24px;">
                    <h4 style="font-size: 15px; font-weight: 600; margin-bottom: 12px; display: flex; align-items: center; gap: 6px;">
                        <i class="fas fa-paperclip"></i>
                        附件列表
                    </h4>
                    <div style="display: flex; flex-direction: column; gap: 8px;">
                        ${todo.details.attachments.map(file => `
                            <div style="display: flex; align-items: center; gap: 12px; padding: 10px 12px; background: var(--color-gray-50); border-radius: 6px; border: 1px solid var(--color-gray-200);">
                                <i class="fas fa-file-pdf" style="color: #dc2626; font-size: 18px;"></i>
                                <span style="flex: 1; font-size: 14px; color: var(--color-gray-900);">${file.name}</span>
                                <span style="font-size: 12px; color: var(--color-gray-500);">${file.size}</span>
                                <button class="btn-icon" onclick="Toast.info('下载功能开发中')" style="padding: 4px 8px; color: var(--color-primary); cursor: pointer; background: none; border: none;">
                                    <i class="fas fa-download"></i>
                                </button>
                            </div>
                        `).join('')}
                    </div>
                </div>
                ` : ''}

                <!-- 需要的操作 -->
                ${todo.process?.requiredActions?.length > 0 ? `
                <div class="detail-section" style="margin-bottom: 24px;">
                    <h4 style="font-size: 15px; font-weight: 600; margin-bottom: 12px; display: flex; align-items: center; gap: 6px;">
                        <i class="fas fa-tasks"></i>
                        需要的操作
                    </h4>
                    <div style="background: var(--color-gray-50); border-radius: 8px; padding: 16px;">
                        ${todo.process.requiredActions.map((action, index) => `
                            <label style="display: flex; align-items: center; margin-bottom: 12px; cursor: pointer; font-size: 14px; color: var(--color-gray-700);">
                                <input type="checkbox" ${action.completed ? 'checked' : ''} style="margin-right: 12px; width: 16px; height: 16px;" disabled>
                                <span style="${action.completed ? 'text-decoration: line-through; color: #6b7280;' : ''}">${action.action}</span>
                            </label>
                        `).join('')}
                    </div>
                </div>
                ` : ''}

                <!-- 操作记录 -->
                ${todo.history?.length > 0 ? `
                <div class="detail-section" style="margin-bottom: 24px;">
                    <h4 style="font-size: 15px; font-weight: 600; margin-bottom: 12px; display: flex; align-items: center; gap: 6px;">
                        <i class="fas fa-history"></i>
                        操作记录
                    </h4>
                    <div class="timeline">
                        ${todo.history.map((record, index) => `
                            <div style="position: relative; padding-left: 32px; padding-bottom: 20px; ${index === todo.history.length - 1 ? 'padding-bottom: 0;' : ''}">
                                <div style="position: absolute; left: 0; top: 4px; width: 12px; height: 12px; border-radius: 50%; background: ${index === todo.history.length - 1 ? 'var(--color-primary)' : 'var(--color-success)'}; border: 2px solid white; box-shadow: 0 0 0 2px ${index === todo.history.length - 1 ? 'var(--color-primary)' : 'var(--color-success)'};"></div>
                                ${index < todo.history.length - 1 ? '<div style="position: absolute; left: 5px; top: 16px; bottom: 0; width: 2px; background: var(--color-gray-200);"></div>' : ''}
                                <div>
                                    <h5 style="font-size: 14px; font-weight: 600; color: var(--color-gray-900); margin: 0 0 4px 0;">${record.action}</h5>
                                    <div style="font-size: 12px; color: var(--color-gray-500); margin-bottom: 4px;">${record.time} · ${record.user}</div>
                                    <div style="font-size: 13px; color: var(--color-gray-600); line-height: 1.4;">${record.note}</div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                ` : ''}
            </div>
        `;

        Modal.show({
            title: '待办详情',
            content: detailHtml,
            width: '900px',
            showFooter: true,
            confirmText: '立即处理',
            cancelText: '关闭',
            onConfirm: () => {
                Modal.hide();
                this.processTodo(id);
                return false; // 阻止自动关闭
            }
        });
    },
    
    /**
     * 查看来源详情
     */
    viewSourceDetail(type, id) {
        console.log('[Dashboard] 查看来源详情:', type, id);
        
        const urlMap = {
            'alert': `alert-center.html?id=${id}`,
            'clue': `clue-library.html?id=${id}`,
            'workorder': `work-order.html?id=${id}`,
            'rectification': `rectification.html?id=${id}`
        };
        
        const url = urlMap[type];
        if (url) {
            window.open(url, '_blank');
        } else {
            Toast.info('功能开发中...');
        }
    },

    /**
     * 处理待办
     */
    processTodo(id) {
        const todo = this.mockData.todos.find(t => t.id == id);
        if (!todo) {
            console.error('[Dashboard] 找不到待办:', id, '现有待办:', this.mockData.todos.map(t => t.id));
            Toast.error('待办事项不存在');
            return;
        }

        const formHtml = `
            <form id="process-todo-form" class="form-grid">
                <div class="form-group full-width">
                    <label class="required">处理结果</label>
                    <select name="result" class="form-control" required>
                        <option value="">请选择</option>
                        <option value="completed">已完成</option>
                        <option value="rejected">驳回</option>
                        <option value="transferred">转办</option>
                        <option value="deferred">延期</option>
                    </select>
                </div>
                <div class="form-group full-width">
                    <label class="required">处理说明</label>
                    <textarea name="remark" class="form-control" rows="4" placeholder="请输入处理说明" required></textarea>
                </div>
                <div class="form-group full-width">
                    <label>附件上传</label>
                    <input type="file" name="attachments" class="form-control" multiple>
                    <small class="form-text">支持上传多个文件，单个文件不超过10MB</small>
                </div>
            </form>
        `;

        Modal.show({
            title: `处理待办 - ${todo.title}`,
            content: formHtml,
            width: '600px',
            showFooter: true,
            confirmText: '提交',
            onConfirm: () => {
                const form = document.getElementById('process-todo-form');
                if (!form.checkValidity()) {
                    form.reportValidity();
                    return false;
                }

                const formData = new FormData(form);
                const data = Object.fromEntries(formData.entries());
                
                console.log('处理待办数据:', data);
                
                // 从列表中移除该待办
                const index = this.mockData.todos.findIndex(t => t.id == id);
                if (index > -1) {
                    this.mockData.todos.splice(index, 1);
                }
                
                Toast.success('待办处理成功！');
                
                // 刷新列表
                this.renderTodoList();
                this.updateTodoCounts();
                this.renderStatsCards();
                
                return true;
            }
        });
    },

    /**
     * 批量处理待办
     */
    batchProcess() {
        const selectedTodos = this.mockData.todos.filter(t => t.selected);
        if (selectedTodos.length === 0) {
            Toast.warning('请先选择要处理的待办事项');
            return;
        }

        const formHtml = `
            <form id="batch-process-form" class="form-grid">
                <div class="form-group full-width">
                    <label>选中的待办事项</label>
                    <div class="selected-todos-list">
                        ${selectedTodos.map(todo => `
                            <div class="selected-todo-item">
                                <span class="todo-title">${todo.title}</span>
                                <span class="todo-type">${todo.type}</span>
                                <span class="priority-badge ${todo.priority}">${this.getPriorityText(todo.priority)}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
                <div class="form-group">
                    <label class="required">处理结果</label>
                    <select name="result" class="form-control" required>
                        <option value="">请选择</option>
                        <option value="completed">批量完成</option>
                        <option value="rejected">批量驳回</option>
                        <option value="transferred">批量转办</option>
                        <option value="deferred">批量延期</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>处理人</label>
                    <select name="handler" class="form-control">
                        <option value="">保持当前处理人</option>
                        <option value="张三">张三</option>
                        <option value="李四">李四</option>
                        <option value="王五">王五</option>
                        <option value="赵六">赵六</option>
                    </select>
                </div>
                <div class="form-group full-width">
                    <label class="required">处理说明</label>
                    <textarea name="remark" class="form-control" rows="4" placeholder="请输入批量处理说明" required></textarea>
                </div>
            </form>
        `;

        Modal.show({
            title: `批量处理待办 (${selectedTodos.length}项)`,
            content: formHtml,
            width: '700px',
            showFooter: true,
            confirmText: '批量处理',
            onConfirm: () => {
                const form = document.getElementById('batch-process-form');
                if (!form.checkValidity()) {
                    form.reportValidity();
                    return false;
                }

                const formData = new FormData(form);
                const data = Object.fromEntries(formData.entries());
                
                console.log('批量处理数据:', data);
                
                Loading.show('批量处理中...');
                
                setTimeout(() => {
                    // 移除选中的待办
                    this.mockData.todos = this.mockData.todos.filter(t => !t.selected);
                    
                    Loading.hide();
                    Toast.success(`成功处理 ${selectedTodos.length} 个待办事项`);
                    
                    // 刷新列表
                    this.renderTodoList();
                    this.updateTodoCounts();
                    this.renderStatsCards();
                    
                    // 添加到最近动态
                    this.mockData.activities.unshift({
                        id: Date.now(),
                        type: 'success',
                        time: Utils.formatDate(new Date(), 'MM-DD HH:mm'),
                        user: '张三',
                        action: '批量处理了待办事项',
                        target: `${selectedTodos.length}个待办`
                    });
                    
                    if (this.mockData.activities.length > 10) {
                        this.mockData.activities = this.mockData.activities.slice(0, 10);
                    }
                    
                    this.renderTimeline();
                }, 1500);
                
                return true;
            }
        });
    },

    /**
     * 批量分配
     */
    batchAssign() {
        const selectedTodos = this.mockData.todos.filter(t => t.selected);
        if (selectedTodos.length === 0) {
            Toast.warning('请先选择要分配的待办事项');
            return;
        }

        const formHtml = `
            <form id="batch-assign-form" class="form-grid">
                <div class="form-group full-width">
                    <label>选中的待办事项</label>
                    <div class="selected-todos-list">
                        ${selectedTodos.map(todo => `
                            <div class="selected-todo-item">
                                <span class="todo-title">${todo.title}</span>
                                <span class="todo-type">${todo.type}</span>
                                <span class="priority-badge ${todo.priority}">${this.getPriorityText(todo.priority)}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
                <div class="form-group">
                    <label class="required">分配给</label>
                    <select name="assignee" class="form-control" required>
                        <option value="">请选择</option>
                        <option value="张三">张三</option>
                        <option value="李四">李四</option>
                        <option value="王五">王五</option>
                        <option value="赵六">赵六</option>
                        <option value="钱七">钱七</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>优先级调整</label>
                    <select name="priority" class="form-control">
                        <option value="">保持原优先级</option>
                        <option value="urgent">紧急</option>
                        <option value="high">高</option>
                        <option value="normal">普通</option>
                        <option value="low">低</option>
                    </select>
                </div>
                <div class="form-group full-width">
                    <label>分配说明</label>
                    <textarea name="remark" class="form-control" rows="3" placeholder="请输入分配说明（可选）"></textarea>
                </div>
                <div class="form-group full-width">
                    <label class="checkbox-label">
                        <input type="checkbox" name="notify" checked>
                        <span>发送通知给被分配人</span>
                    </label>
                </div>
            </form>
        `;

        Modal.show({
            title: `批量分配待办 (${selectedTodos.length}项)`,
            content: formHtml,
            width: '700px',
            showFooter: true,
            confirmText: '确认分配',
            onConfirm: () => {
                const form = document.getElementById('batch-assign-form');
                if (!form.checkValidity()) {
                    form.reportValidity();
                    return false;
                }

                const formData = new FormData(form);
                const data = Object.fromEntries(formData.entries());
                
                console.log('批量分配数据:', data);
                
                Loading.show('分配中...');
                
                setTimeout(() => {
                    // 更新选中待办的分配信息
                    selectedTodos.forEach(todo => {
                        todo.assignee = data.assignee;
                        if (data.priority) {
                            todo.priority = data.priority;
                        }
                        todo.selected = false; // 取消选中
                    });
                    
                    Loading.hide();
                    Toast.success(`成功分配 ${selectedTodos.length} 个待办事项给 ${data.assignee}`);
                    
                    // 刷新列表
                    this.renderTodoList();
                    
                    // 添加到最近动态
                    this.mockData.activities.unshift({
                        id: Date.now(),
                        type: 'info',
                        time: Utils.formatDate(new Date(), 'MM-DD HH:mm'),
                        user: '张三',
                        action: '批量分配了待办事项',
                        target: `${selectedTodos.length}个待办给${data.assignee}`
                    });
                    
                    if (this.mockData.activities.length > 10) {
                        this.mockData.activities = this.mockData.activities.slice(0, 10);
                    }
                    
                    this.renderTimeline();
                }, 1000);
                
                return true;
            }
        });
    },
    
    /**
     * 分配单个待办
     */
    assignTodo(id) {
        const todo = this.mockData.todos.find(t => t.id == id);
        if (!todo) {
            Toast.error('待办事项不存在');
            return;
        }

        const formHtml = `
            <form id="assign-todo-form" class="form-grid">
                <div class="form-group full-width">
                    <label>待办信息</label>
                    <div class="todo-info-card">
                        <div class="todo-title">${todo.title}</div>
                        <div class="todo-meta">
                            <span class="badge badge-processing">${todo.type}</span>
                            <span class="priority-badge ${todo.priority}">${this.getPriorityText(todo.priority)}</span>
                            <span class="deadline"><i class="fas fa-clock"></i> ${Utils.formatDate(todo.deadline)}</span>
                        </div>
                    </div>
                </div>
                <div class="form-group">
                    <label class="required">分配给</label>
                    <select name="assignee" class="form-control" required>
                        <option value="">请选择</option>
                        <option value="张三">张三</option>
                        <option value="李四">李四</option>
                        <option value="王五">王五</option>
                        <option value="赵六">赵六</option>
                        <option value="钱七">钱七</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>优先级调整</label>
                    <select name="priority" class="form-control">
                        <option value="">保持原优先级</option>
                        <option value="urgent" ${todo.priority === 'urgent' ? 'selected' : ''}>紧急</option>
                        <option value="high" ${todo.priority === 'high' ? 'selected' : ''}>高</option>
                        <option value="normal" ${todo.priority === 'normal' ? 'selected' : ''}>普通</option>
                        <option value="low" ${todo.priority === 'low' ? 'selected' : ''}>低</option>
                    </select>
                </div>
                <div class="form-group full-width">
                    <label>分配说明</label>
                    <textarea name="remark" class="form-control" rows="3" placeholder="请输入分配说明（可选）"></textarea>
                </div>
                <div class="form-group full-width">
                    <label class="checkbox-label">
                        <input type="checkbox" name="notify" checked>
                        <span>发送通知给被分配人</span>
                    </label>
                </div>
            </form>
        `;

        Modal.show({
            title: '分配待办',
            content: formHtml,
            width: '600px',
            showFooter: true,
            confirmText: '确认分配',
            onConfirm: () => {
                const form = document.getElementById('assign-todo-form');
                if (!form.checkValidity()) {
                    form.reportValidity();
                    return false;
                }

                const formData = new FormData(form);
                const data = Object.fromEntries(formData.entries());
                
                console.log('分配待办数据:', data);
                
                // 更新待办信息
                todo.assignee = data.assignee;
                if (data.priority) {
                    todo.priority = data.priority;
                }
                
                Toast.success(`待办已分配给 ${data.assignee}`);
                
                // 刷新列表
                this.renderTodoList();
                
                // 添加到最近动态
                this.mockData.activities.unshift({
                    id: Date.now(),
                    type: 'info',
                    time: Utils.formatDate(new Date(), 'MM-DD HH:mm'),
                    user: '张三',
                    action: '分配了待办事项',
                    target: `${todo.title} 给 ${data.assignee}`
                });
                
                if (this.mockData.activities.length > 10) {
                    this.mockData.activities = this.mockData.activities.slice(0, 10);
                }
                
                this.renderTimeline();
                
                return true;
            }
        });
    },
    
    /**
     * 全选/取消全选待办
     */
    toggleAllTodos() {
        const checkAll = document.getElementById('check-all-todos');
        if (!checkAll) return;
        
        const isChecked = checkAll.checked;
        this.mockData.todos.forEach(todo => {
            todo.selected = isChecked;
        });
        
        this.renderTodoList();
    },
    
    /**
     * 切换单个待办选择状态
     */
    toggleTodoSelection(id) {
        const todo = this.mockData.todos.find(t => t.id == id);
        if (todo) {
            todo.selected = !todo.selected;
        }
        
        // 更新全选状态
        const checkAll = document.getElementById('check-all-todos');
        if (checkAll) {
            const selectedCount = this.mockData.todos.filter(t => t.selected).length;
            checkAll.checked = selectedCount === this.mockData.todos.length;
            checkAll.indeterminate = selectedCount > 0 && selectedCount < this.mockData.todos.length;
        }
        
        this.renderTodoList();
    },
    
    /**
     * 创建新待办
     */
    createTodo() {
        const formHtml = `
            <form id="create-todo-form" class="form-grid">
                <div class="form-group full-width">
                    <label class="required">待办标题</label>
                    <input type="text" name="title" class="form-control" placeholder="请输入待办标题" required>
                </div>
                <div class="form-group">
                    <label class="required">待办类型</label>
                    <select name="type" class="form-control" required>
                        <option value="">请选择</option>
                        <option value="预警处理">预警处理</option>
                        <option value="线索核查">线索核查</option>
                        <option value="整改跟进">整改跟进</option>
                        <option value="审批审核">审批审核</option>
                        <option value="数据审核">数据审核</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="required">优先级</label>
                    <select name="priority" class="form-control" required>
                        <option value="">请选择</option>
                        <option value="urgent">紧急</option>
                        <option value="high">高</option>
                        <option value="normal">普通</option>
                        <option value="low">低</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="required">截止日期</label>
                    <input type="date" name="deadline" class="form-control" required>
                </div>
                <div class="form-group">
                    <label>分配给</label>
                    <select name="assignee" class="form-control">
                        <option value="">请选择</option>
                        <option value="张三">张三</option>
                        <option value="李四">李四</option>
                        <option value="王五">王五</option>
                        <option value="赵六">赵六</option>
                    </select>
                </div>
                <div class="form-group full-width">
                    <label>待办描述</label>
                    <textarea name="description" class="form-control" rows="4" placeholder="请输入待办描述（可选）"></textarea>
                </div>
            </form>
        `;

        Modal.show({
            title: '新建待办',
            content: formHtml,
            width: '700px',
            showFooter: true,
            confirmText: '创建',
            onConfirm: () => {
                const form = document.getElementById('create-todo-form');
                if (!form.checkValidity()) {
                    form.reportValidity();
                    return false;
                }

                const formData = new FormData(form);
                const data = Object.fromEntries(formData.entries());
                
                // 创建新待办
                const newTodo = {
                    id: Date.now(),
                    title: data.title,
                    type: data.type,
                    priority: data.priority,
                    deadline: data.deadline,
                    assignee: data.assignee || '未分配',
                    description: data.description,
                    selected: false
                };
                
                this.mockData.todos.unshift(newTodo);
                
                Toast.success('待办创建成功');
                
                // 刷新列表
                this.renderTodoList();
                this.updateTodoCounts();
                this.renderStatsCards();
                
                // 添加到最近动态
                this.mockData.activities.unshift({
                    id: Date.now(),
                    type: 'success',
                    time: Utils.formatDate(new Date(), 'MM-DD HH:mm'),
                    user: '张三',
                    action: '创建了待办事项',
                    target: data.title
                });
                
                if (this.mockData.activities.length > 10) {
                    this.mockData.activities = this.mockData.activities.slice(0, 10);
                }
                
                this.renderTimeline();
                
                return true;
            }
        });
    },

    /**
     * 查看预警详情
     */
    viewAlertDetail(id) {
        const alert = this.mockData.alerts.find(a => a.id == id);
        if (!alert) {
            Toast.error('预警不存在');
            return;
        }

        const detailHtml = `
            <div class="detail-section">
                <h3 class="detail-section-title">预警信息</h3>
                <div class="detail-grid">
                    <div class="detail-item">
                        <label>预警ID</label>
                        <div><code>#${alert.id}</code></div>
                    </div>
                    <div class="detail-item">
                        <label>风险等级</label>
                        <div><span class="alert-level ${alert.level}">${this.getAlertLevelText(alert.level)}</span></div>
                    </div>
                    <div class="detail-item">
                        <label>预警来源</label>
                        <div><span class="badge badge-info">${alert.source}</span></div>
                    </div>
                    <div class="detail-item">
                        <label>预警时间</label>
                        <div><i class="fas fa-clock"></i> ${alert.time}</div>
                    </div>
                    ${alert.person ? `
                        <div class="detail-item">
                            <label>涉及人员</label>
                            <div><i class="fas fa-user"></i> ${alert.person}</div>
                        </div>
                    ` : ''}
                    ${alert.department ? `
                        <div class="detail-item">
                            <label>涉及部门</label>
                            <div><i class="fas fa-building"></i> ${alert.department}</div>
                        </div>
                    ` : ''}
                    ${alert.amount ? `
                        <div class="detail-item">
                            <label>涉及金额</label>
                            <div style="color: #EF4444; font-weight: 600;"><i class="fas fa-dollar-sign"></i> ${alert.amount} 元</div>
                        </div>
                    ` : ''}
                    ${alert.count ? `
                        <div class="detail-item">
                            <label>问题数量</label>
                            <div style="color: #F59E0B; font-weight: 600;">${alert.count} 个</div>
                        </div>
                    ` : ''}
                    ${alert.percentage ? `
                        <div class="detail-item">
                            <label>占比</label>
                            <div style="color: #F59E0B; font-weight: 600;">${alert.percentage}</div>
                        </div>
                    ` : ''}
                    ${alert.project ? `
                        <div class="detail-item">
                            <label>相关项目</label>
                            <div>${alert.project}</div>
                        </div>
                    ` : ''}
                    <div class="detail-item full-width">
                        <label>预警标题</label>
                        <div style="font-weight: 500; font-size: 15px;">${alert.title}</div>
                    </div>
                    <div class="detail-item full-width">
                        <label>预警内容</label>
                        <div style="padding: 12px; background: #FEF3C7; border-left: 4px solid #F59E0B; border-radius: 4px; line-height: 1.6;">
                            ${alert.content}
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="detail-section">
                <h3 class="detail-section-title">处理建议</h3>
                <div style="padding: 16px; background: #F9FAFB; border-radius: 8px; line-height: 1.6;">
                    <ul style="margin: 0; padding-left: 20px;">
                        <li>及时核查相关情况，确认预警的真实性</li>
                        <li>收集相关证据材料，做好记录</li>
                        <li>根据实际情况采取相应的处置措施</li>
                        <li>及时反馈处理结果，更新预警状态</li>
                    </ul>
                </div>
            </div>
        `;

        Modal.show({
            title: '预警详情',
            content: detailHtml,
            width: '800px',
            showFooter: true,
            confirmText: '立即处理',
            cancelText: '关闭',
            onConfirm: () => {
                Modal.hide();
                this.processAlert(id);
                return false;
            }
        });
    },

    /**
     * 处理预警
     */
    processAlert(id) {
        const alert = this.mockData.alerts.find(a => a.id == id);
        if (!alert) {
            Toast.error('预警不存在');
            return;
        }

        const formHtml = `
            <form id="process-alert-form" class="form-grid">
                <div class="form-group">
                    <label class="required">处理方式</label>
                    <select name="action" class="form-control" required>
                        <option value="">请选择</option>
                        <option value="investigate">立案调查</option>
                        <option value="verify">核实情况</option>
                        <option value="ignore">误报忽略</option>
                        <option value="transfer">转交处理</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="required">处理人</label>
                    <select name="handler" class="form-control" required>
                        <option value="">请选择</option>
                        <option value="张三">张三</option>
                        <option value="李四">李四</option>
                        <option value="王五">王五</option>
                        <option value="赵六">赵六</option>
                    </select>
                </div>
                <div class="form-group full-width">
                    <label class="required">处理说明</label>
                    <textarea name="remark" class="form-control" rows="4" placeholder="请详细说明处理情况和结果" required></textarea>
                </div>
                <div class="form-group full-width">
                    <label>附件上传</label>
                    <input type="file" name="attachments" class="form-control" multiple>
                    <small class="form-text">支持上传相关证据材料</small>
                </div>
            </form>
        `;

        Modal.show({
            title: `处理预警 - ${alert.title}`,
            content: formHtml,
            width: '600px',
            showFooter: true,
            confirmText: '提交',
            onConfirm: () => {
                const form = document.getElementById('process-alert-form');
                if (!form.checkValidity()) {
                    form.reportValidity();
                    return false;
                }

                const formData = new FormData(form);
                const data = Object.fromEntries(formData.entries());
                
                console.log('处理预警数据:', data);
                
                // 从列表中移除该预警
                const index = this.mockData.alerts.findIndex(a => a.id == id);
                if (index > -1) {
                    this.mockData.alerts.splice(index, 1);
                }
                
                Toast.success('预警处理成功！');
                
                // 刷新列表
                this.renderAlertList();
                this.renderStatsCards();
                
                return true;
            }
        });
    },

    /**
     * 标记预警已读
     */
    markAlertRead(id) {
        const alert = this.mockData.alerts.find(a => a.id == id);
        if (!alert) {
            Toast.error('预警不存在');
            return;
        }

        Modal.confirm({
            title: '标记已读',
            content: `确定要将预警"${alert.title}"标记为已读吗？<br><br><small style="color: #6B7280;">标记已读后，该预警将从待处理列表中移除，但仍可在预警中心查看历史记录。</small>`,
            onConfirm: () => {
                // 从列表中移除
                const index = this.mockData.alerts.findIndex(a => a.id == id);
                if (index > -1) {
                    this.mockData.alerts.splice(index, 1);
                }

                Toast.success('已标记为已读');
                
                // 刷新列表和统计
                this.renderAlertList();
                this.renderStatsCards();
                
                // 添加到最近动态
                this.mockData.activities.unshift({
                    id: Date.now(),
                    type: 'primary',
                    time: Utils.formatDate(new Date(), 'MM-DD HH:mm'),
                    user: '张三',
                    action: '标记预警为已读',
                    target: alert.title
                });
                
                // 只保留最新的10条动态
                if (this.mockData.activities.length > 10) {
                    this.mockData.activities = this.mockData.activities.slice(0, 10);
                }
                
                this.renderTimeline();
            }
        });
    },

    /**
     * 忽略预警
     */
    ignoreAlert(id) {
        const alert = this.mockData.alerts.find(a => a.id == id);
        if (!alert) {
            Toast.error('预警不存在');
            return;
        }

        const formHtml = `
            <form id="ignore-alert-form" class="form-grid">
                <div class="form-group full-width">
                    <label>预警信息</label>
                    <div style="padding: 12px; background: #FEF3C7; border-left: 4px solid #F59E0B; border-radius: 4px;">
                        <div style="font-weight: 500; margin-bottom: 4px;">${alert.title}</div>
                        <div style="font-size: 13px; color: #6B7280;">${alert.content}</div>
                    </div>
                </div>
                <div class="form-group full-width">
                    <label class="required">忽略原因</label>
                    <select name="reason" class="form-control" required>
                        <option value="">请选择</option>
                        <option value="false_positive">误报</option>
                        <option value="duplicate">重复预警</option>
                        <option value="resolved">已解决</option>
                        <option value="not_applicable">不适用</option>
                        <option value="other">其他原因</option>
                    </select>
                </div>
                <div class="form-group full-width">
                    <label class="required">说明</label>
                    <textarea name="remark" class="form-control" rows="3" placeholder="请说明忽略该预警的原因" required></textarea>
                </div>
            </form>
        `;

        Modal.show({
            title: '忽略预警',
            content: formHtml,
            width: '600px',
            showFooter: true,
            confirmText: '确认忽略',
            onConfirm: () => {
                const form = document.getElementById('ignore-alert-form');
                if (!form.checkValidity()) {
                    form.reportValidity();
                    return false;
                }

                const formData = new FormData(form);
                const data = Object.fromEntries(formData.entries());
                
                console.log('忽略预警数据:', data);
                
                // 从列表中移除
                const index = this.mockData.alerts.findIndex(a => a.id == id);
                if (index > -1) {
                    this.mockData.alerts.splice(index, 1);
                }

                Toast.success('预警已忽略');
                
                // 刷新列表和统计
                this.renderAlertList();
                this.renderStatsCards();
                
                // 添加到最近动态
                this.mockData.activities.unshift({
                    id: Date.now(),
                    type: 'warning',
                    time: Utils.formatDate(new Date(), 'MM-DD HH:mm'),
                    user: '张三',
                    action: '忽略了预警',
                    target: alert.title
                });
                
                // 只保留最新的10条动态
                if (this.mockData.activities.length > 10) {
                    this.mockData.activities = this.mockData.activities.slice(0, 10);
                }
                
                this.renderTimeline();
                
                return true;
            }
        });
    },
    
    /**
     * 批量处理预警
     */
    batchProcessAlerts() {
        const selectedAlerts = this.mockData.alerts.filter(a => a.selected);
        if (selectedAlerts.length === 0) {
            Toast.warning('请先选择要处理的预警');
            return;
        }

        Modal.confirm({
            title: '批量处理预警',
            content: `确定要批量处理选中的 ${selectedAlerts.length} 个预警吗？`,
            onConfirm: () => {
                Loading.show('处理中...');
                
                setTimeout(() => {
                    // 移除选中的预警
                    this.mockData.alerts = this.mockData.alerts.filter(a => !a.selected);
                    
                    Loading.hide();
                    Toast.success(`成功处理 ${selectedAlerts.length} 个预警`);
                    
                    // 刷新列表
                    this.renderAlertList();
                    this.renderStatsCards();
                }, 1000);
            }
        });
    },
    
    /**
     * 导出预警列表
     */
    exportAlerts() {
        if (this.mockData.alerts.length === 0) {
            Toast.warning('暂无预警数据可导出');
            return;
        }

        Loading.show('导出中...');
        
        setTimeout(() => {
            Loading.hide();
            Toast.success('预警列表已导出');
            console.log('导出预警数据:', this.mockData.alerts);
        }, 1000);
    },
    
    /**
     * 刷新预警列表
     */
    refreshAlerts() {
        Loading.show('刷新中...');
        
        setTimeout(() => {
            Loading.hide();
            Toast.success('预警列表已刷新');
            this.renderAlertList();
        }, 500);
    }
};

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    Dashboard.init();
});
