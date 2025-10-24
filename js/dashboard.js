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
                type: '预警核查',
                deadline: '2025-10-21 18:00',
                priority: 'urgent',
                status: 'pending'
            },
            {
                id: 2,
                title: '复查基建项目整改材料 - 图书馆改造工程',
                type: '整改复查',
                deadline: '2025-10-21 17:00',
                priority: 'high',
                status: 'pending'
            },
            {
                id: 3,
                title: '处理招生录取异常预警 - 计算机学院',
                type: '预警处置',
                deadline: '2025-10-22 12:00',
                priority: 'urgent',
                status: 'pending'
            },
            {
                id: 4,
                title: '审批工单分配申请 - 三公经费超标核查',
                type: '工单审批',
                deadline: '2025-10-22 15:00',
                priority: 'normal',
                status: 'pending'
            },
            {
                id: 5,
                title: '完成月度监督报告编写',
                type: '报告编写',
                deadline: '2025-10-23 18:00',
                priority: 'high',
                status: 'pending'
            },
            {
                id: 6,
                title: '参加纪检工作协调会',
                type: '会议参加',
                deadline: '2025-10-23 10:00',
                priority: 'normal',
                status: 'pending'
            },
            {
                id: 7,
                title: '审核供应商关联冲突预警',
                type: '预警核查',
                deadline: '2025-10-24 16:00',
                priority: 'normal',
                status: 'pending'
            },
            {
                id: 8,
                title: '跟进学术不端行为调查',
                type: '线索跟进',
                deadline: '2025-10-25 18:00',
                priority: 'high',
                status: 'pending'
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
            <div class="detail-section">
                <h3 class="detail-section-title">基本信息</h3>
                <div class="detail-grid">
                    <div class="detail-item">
                        <label>待办ID</label>
                        <div><code>#${todo.id}</code></div>
                    </div>
                    <div class="detail-item">
                        <label>类型</label>
                        <div><span class="badge badge-processing">${todo.type}</span></div>
                    </div>
                    <div class="detail-item">
                        <label>优先级</label>
                        <div><span class="priority-badge ${todo.priority}">${this.getPriorityText(todo.priority)}</span></div>
                    </div>
                    <div class="detail-item">
                        <label>状态</label>
                        <div><span class="badge badge-${isOverdue ? 'danger' : 'warning'}">${isOverdue ? '已超期' : '待处理'}</span></div>
                    </div>
                    <div class="detail-item">
                        <label>截止时间</label>
                        <div class="${isOverdue ? 'text-danger' : ''}">
                            <i class="fas fa-clock"></i> ${Utils.formatDate(todo.deadline)}
                            ${isOverdue ? '<i class="fas fa-exclamation-circle"></i>' : ''}
                        </div>
                    </div>
                    <div class="detail-item">
                        <label>创建时间</label>
                        <div>${Utils.formatDate(new Date())}</div>
                    </div>
                    <div class="detail-item full-width">
                        <label>标题</label>
                        <div style="font-weight: 500;">${todo.title}</div>
                    </div>
                </div>
            </div>
            
            <div class="detail-section">
                <h3 class="detail-section-title">详细说明</h3>
                <div style="padding: 16px; background: #F9FAFB; border-radius: 8px; line-height: 1.6;">
                    <p>此待办事项需要您及时处理，请根据实际情况完成相关工作。</p>
                    <p style="margin-top: 12px;">如有疑问，请联系相关负责人。</p>
                </div>
            </div>
            
            <div class="detail-section">
                <h3 class="detail-section-title">操作记录</h3>
                <div class="timeline" style="padding: 16px; background: #F9FAFB; border-radius: 8px;">
                    <div class="timeline-item primary">
                        <div class="timeline-dot"></div>
                        <div class="timeline-time">${Utils.formatDate(new Date(), 'MM-DD HH:mm')}</div>
                        <div class="timeline-content">
                            <span class="timeline-user">系统</span>
                            创建了待办事项
                        </div>
                    </div>
                </div>
            </div>
        `;

        Modal.show({
            title: '待办详情',
            content: detailHtml,
            width: '800px',
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
