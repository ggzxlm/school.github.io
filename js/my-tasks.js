/**
 * 我的待办页面
 */

// 模拟任务数据
const mockTasks = [
    {
        id: 1,
        title: '科研经费异常支出核查',
        description: '对计算机学院2024年第三季度科研经费支出进行核查，重点关注大额支出和异常交易',
        priority: 'urgent',
        type: '预警处理',
        deadline: '2025-10-25',
        assignedBy: '李主任',
        completed: false
    },
    {
        id: 2,
        title: '招生录取数据审核',
        description: '审核2024年研究生招生录取数据，确保录取流程符合规定',
        priority: 'high',
        type: '工单处理',
        deadline: '2025-10-26',
        assignedBy: '王处长',
        completed: false
    },
    {
        id: 3,
        title: '整改报告审批',
        description: '审批财务处提交的整改报告，确认整改措施是否到位',
        priority: 'normal',
        type: '整改审批',
        deadline: '2025-10-27',
        assignedBy: '张书记',
        completed: false
    },
    {
        id: 4,
        title: '基建项目现场检查',
        description: '对新建图书馆项目进行现场检查，核实工程进度和资金使用情况',
        priority: 'urgent',
        type: '现场检查',
        deadline: '2025-10-24',
        assignedBy: '刘副校长',
        completed: false
    },
    {
        id: 5,
        title: '月度工作总结',
        description: '完成10月份工作总结报告，汇总本月监督检查情况',
        priority: 'normal',
        type: '报告撰写',
        deadline: '2025-10-31',
        assignedBy: '系统',
        completed: false
    }
];

let currentFilter = 'all';

// 页面初始化
document.addEventListener('DOMContentLoaded', () => {
    initPage();
});

function initPage() {
    renderTasks();
    bindEvents();
}

/**
 * 渲染任务列表
 */
function renderTasks() {
    const container = document.getElementById('tasksContainer');
    const filteredTasks = filterTasks(mockTasks, currentFilter);

    if (filteredTasks.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-check-circle"></i>
                <h3>暂无待办事项</h3>
                <p>您已完成所有待办任务</p>
            </div>
        `;
        return;
    }

    container.innerHTML = filteredTasks.map(task => `
        <div class="task-item" data-id="${task.id}">
            <div class="task-header">
                <div class="task-checkbox ${task.completed ? 'checked' : ''}" data-id="${task.id}"></div>
                <div class="task-content">
                    <div class="task-title">
                        ${task.title}
                        <span class="task-priority ${task.priority}">
                            ${getPriorityText(task.priority)}
                        </span>
                    </div>
                    <div class="task-description">${task.description}</div>
                    <div class="task-meta">
                        <div class="task-meta-item">
                            <i class="fas fa-tag"></i>
                            <span>${task.type}</span>
                        </div>
                        <div class="task-meta-item task-deadline ${isOverdue(task.deadline) ? 'overdue' : ''}">
                            <i class="fas fa-calendar-alt"></i>
                            <span>${formatDeadline(task.deadline)}</span>
                        </div>
                        <div class="task-meta-item">
                            <i class="fas fa-user"></i>
                            <span>${task.assignedBy}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

/**
 * 绑定事件
 */
function bindEvents() {
    // 筛选标签
    document.querySelectorAll('.filter-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            currentFilter = this.dataset.filter;
            renderTasks();
            bindTaskEvents();
        });
    });

    bindTaskEvents();
}

/**
 * 绑定任务事件
 */
function bindTaskEvents() {
    // 复选框点击
    document.querySelectorAll('.task-checkbox').forEach(checkbox => {
        checkbox.addEventListener('click', function(e) {
            e.stopPropagation();
            const taskId = parseInt(this.dataset.id);
            const task = mockTasks.find(t => t.id === taskId);
            
            if (task) {
                task.completed = !task.completed;
                this.classList.toggle('checked');
                
                if (task.completed) {
                    Toast.success('任务已完成');
                    setTimeout(() => {
                        renderTasks();
                        bindTaskEvents();
                    }, 500);
                }
            }
        });
    });

    // 任务项点击
    document.querySelectorAll('.task-item').forEach(item => {
        item.addEventListener('click', function() {
            const taskId = parseInt(this.dataset.id);
            showTaskDetail(taskId);
        });
    });
}

/**
 * 筛选任务
 */
function filterTasks(tasks, filter) {
    const today = new Date().toISOString().split('T')[0];
    
    switch (filter) {
        case 'urgent':
            return tasks.filter(t => !t.completed && t.priority === 'urgent');
        case 'today':
            return tasks.filter(t => !t.completed && t.deadline === today);
        case 'overdue':
            return tasks.filter(t => !t.completed && t.deadline < today);
        case 'all':
        default:
            return tasks.filter(t => !t.completed);
    }
}

/**
 * 获取优先级文本
 */
function getPriorityText(priority) {
    const map = {
        urgent: '紧急',
        high: '重要',
        normal: '普通'
    };
    return map[priority] || '普通';
}

/**
 * 判断是否逾期
 */
function isOverdue(deadline) {
    const today = new Date().toISOString().split('T')[0];
    return deadline < today;
}

/**
 * 格式化截止日期
 */
function formatDeadline(deadline) {
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    if (deadline === today) {
        return '今天截止';
    } else if (deadline === tomorrowStr) {
        return '明天截止';
    } else if (deadline < today) {
        return '已逾期';
    } else {
        return `${deadline} 截止`;
    }
}

/**
 * 显示任务详情
 */
function showTaskDetail(taskId) {
    const task = mockTasks.find(t => t.id === taskId);
    if (!task) return;

    Modal.show({
        title: '任务详情',
        size: 'lg',
        content: `
            <div style="padding: 20px;">
                <div style="margin-bottom: 20px;">
                    <h3 style="font-size: 18px; margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
                        ${task.title}
                        <span class="task-priority ${task.priority}" style="padding: 4px 12px; border-radius: 4px; font-size: 13px;">
                            ${getPriorityText(task.priority)}
                        </span>
                    </h3>
                    <p style="color: var(--color-gray-600); line-height: 1.6;">${task.description}</p>
                </div>
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; padding: 16px; background: var(--color-gray-50); border-radius: 8px;">
                    <div>
                        <div style="font-size: 13px; color: var(--color-gray-500); margin-bottom: 4px;">任务类型</div>
                        <div style="font-size: 14px; color: var(--color-gray-900);">${task.type}</div>
                    </div>
                    <div>
                        <div style="font-size: 13px; color: var(--color-gray-500); margin-bottom: 4px;">截止日期</div>
                        <div style="font-size: 14px; color: var(--color-gray-900);">${task.deadline}</div>
                    </div>
                    <div>
                        <div style="font-size: 13px; color: var(--color-gray-500); margin-bottom: 4px;">分配人</div>
                        <div style="font-size: 14px; color: var(--color-gray-900);">${task.assignedBy}</div>
                    </div>
                    <div>
                        <div style="font-size: 13px; color: var(--color-gray-500); margin-bottom: 4px;">状态</div>
                        <div style="font-size: 14px; color: var(--color-gray-900);">${task.completed ? '已完成' : '进行中'}</div>
                    </div>
                </div>
            </div>
        `,
        buttons: [
            {
                text: '关闭',
                type: 'default',
                onClick: () => Modal.hide()
            },
            {
                text: '开始处理',
                type: 'primary',
                onClick: () => {
                    Modal.hide();
                    Toast.info('功能开发中');
                }
            }
        ]
    });
}
