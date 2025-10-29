/**
 * 我的待办页面
 */

// 模拟任务数据 - 完整版
const mockTasks = [
    {
        id: 1,
        title: '审核科研经费报销单 - 张教授课题组',
        description: '监督模型发现张教授课题组科研经费报销存在5张连号发票，金额合计8.5万元，存在虚假报销嫌疑，需要立即核查。',
        type: '预警核查',
        deadline: '2025-10-21',
        priority: 'urgent',
        completed: false,
        assignedBy: '李主任',
        assignedAt: '2025-10-20 09:00',
        source: {
            type: 'alert',
            id: 'ALERT2025001',
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
        title: '跟进学术不端行为调查',
        description: '收到实名举报，某教师论文存在抄袭嫌疑，查重率达到45%，存在大段抄袭，需要深入调查。',
        type: '线索跟进',
        deadline: '2025-10-22',
        priority: 'high',
        completed: false,
        assignedBy: '学术委员会',
        assignedAt: '2025-10-18 15:00',
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
    },
    {
        id: 3,
        title: '完成科研经费核查工作',
        description: '根据工单WO202510210001的要求，需要对科研经费异常报销进行深入核查，包括调取凭证、核实发票、约谈当事人等。',
        type: '工单处理',
        deadline: '2025-10-23',
        priority: 'high',
        completed: false,
        assignedBy: '李主任',
        assignedAt: '2025-10-20 10:30',
        source: {
            type: 'workorder',
            id: 'WO202510210001',
            title: '科研经费异常报销核查',
            module: '工单管理',
            createdAt: '2025-10-20 10:00'
        },
        relations: {
            clueId: 'CLUE2025001',
            clueTitle: '科研经费报销存在连号发票异常',
            workOrderId: 'WO202510210001',
            rectificationId: null
        },
        details: {
            unit: '计算机学院',
            person: '张教授',
            amount: 85000,
            riskLevel: 'high',
            evidence: [
                '已调取报销凭证',
                '发票真伪待核实',
                '当事人约谈安排中'
            ],
            attachments: [
                { name: '工单任务书.pdf', size: '1.2 MB' },
                { name: '核查计划.docx', size: '280 KB' }
            ]
        },
        process: {
            expectedDuration: 3,
            requiredActions: [
                { action: '调取报销凭证', completed: true },
                { action: '核实发票真伪', completed: false },
                { action: '约谈当事人', completed: false },
                { action: '撰写核查报告', completed: false }
            ],
            notes: '作为核查组长，需要协调团队完成各项核查任务。'
        },
        history: [
            {
                time: '2025-10-20 10:00',
                user: '李主任',
                action: '创建工单',
                note: '立案调查科研经费问题'
            },
            {
                time: '2025-10-20 10:30',
                user: '李主任',
                action: '分配任务',
                note: '指定张三为核查组长'
            },
            {
                time: '2025-10-20 14:30',
                user: '张三',
                action: '开始核查',
                note: '已调取相关报销凭证'
            }
        ]
    },
    {
        id: 4,
        title: '提交整改方案和进度报告',
        description: '根据整改通知ZG2025001的要求，需要针对科研经费报销不规范问题制定整改方案，并定期报告整改进度。',
        type: '整改任务',
        deadline: '2025-10-24',
        priority: 'high',
        completed: false,
        assignedBy: '纪检监察室',
        assignedAt: '2025-10-21 09:30',
        source: {
            type: 'rectification',
            id: 'ZG2025001',
            title: '科研经费报销不规范问题整改',
            module: '整改管理',
            createdAt: '2025-10-21 09:00'
        },
        relations: {
            clueId: 'CLUE2025001',
            clueTitle: '科研经费报销存在连号发票异常',
            workOrderId: 'WO202510210001',
            rectificationId: 'ZG2025001'
        },
        details: {
            unit: '科研处',
            person: '王处长',
            amount: 0,
            riskLevel: 'medium',
            evidence: [
                '工单核查结论',
                '问题清单',
                '整改要求'
            ],
            attachments: [
                { name: '整改通知书.pdf', size: '1.8 MB' },
                { name: '问题清单.xlsx', size: '320 KB' }
            ]
        },
        process: {
            expectedDuration: 5,
            requiredActions: [
                { action: '制定整改方案', completed: false },
                { action: '修订管理制度', completed: false },
                { action: '开展人员培训', completed: false },
                { action: '提交进度报告', completed: false }
            ],
            notes: '整改措施要具体可行，确保问题不再发生。'
        },
        history: [
            {
                time: '2025-10-21 09:00',
                user: '纪检监察室',
                action: '下达整改通知',
                note: '要求科研处限期整改'
            },
            {
                time: '2025-10-21 09:30',
                user: '纪检监察室',
                action: '创建待办',
                note: '分配给王处长负责整改'
            }
        ]
    },
    {
        id: 5,
        title: '复查基建项目整改材料',
        description: '基建处已完成招标文件排他性条款的整改工作，提交了整改报告和相关材料，需要进行复查验收。',
        type: '整改复查',
        deadline: '2025-10-25',
        priority: 'high',
        completed: false,
        assignedBy: '纪检监察室',
        assignedAt: '2025-10-24 10:30',
        source: {
            type: 'rectification',
            id: 'ZG2025004',
            title: '基建项目招标文件排他性条款整改',
            module: '整改管理',
            createdAt: '2025-10-24 10:00'
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
                time: '2025-10-24 09:00',
                user: '赵处长',
                action: '提交整改材料',
                note: '已完成整改，申请复查'
            },
            {
                time: '2025-10-24 10:30',
                user: '纪检监察室',
                action: '安排复查',
                note: '分配复查任务'
            }
        ]
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
            <div style="padding: 20px; max-height: 70vh; overflow-y: auto;">
                <!-- 基本信息 -->
                <div style="margin-bottom: 24px;">
                    <h3 style="font-size: 18px; margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
                        ${task.title}
                        <span class="task-priority ${task.priority}" style="padding: 4px 12px; border-radius: 4px; font-size: 13px;">
                            ${getPriorityText(task.priority)}
                        </span>
                    </h3>
                    <p style="color: var(--color-gray-600); line-height: 1.6; margin-bottom: 12px;">${task.description}</p>
                    ${task.process?.notes ? `
                        <div style="padding: 12px; background: #fef2f2; border-left: 3px solid #dc2626; border-radius: 4px; color: #991b1b; font-size: 14px;">
                            <strong>注意事项：</strong>${task.process.notes}
                        </div>
                    ` : ''}
                </div>

                <!-- 来源追溯 -->
                ${task.source ? `
                <div style="margin-bottom: 24px;">
                    <h4 style="font-size: 15px; font-weight: 600; margin-bottom: 12px; display: flex; align-items: center; gap: 6px;">
                        <i class="fas fa-link"></i>
                        来源追溯
                    </h4>
                    <div class="relation-card" style="display: flex; align-items: center; gap: 12px; padding: 12px; background: var(--color-gray-50); border-radius: 8px; border: 1px solid var(--color-gray-200);">
                        <div style="width: 40px; height: 40px; border-radius: 8px; background: ${task.source.type === 'alert' ? '#ef4444' : task.source.type === 'clue' ? '#10b981' : task.source.type === 'workorder' ? '#3b82f6' : '#f59e0b'}; color: white; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                            <i class="fas ${task.source.type === 'alert' ? 'fa-bell' : task.source.type === 'clue' ? 'fa-lightbulb' : task.source.type === 'workorder' ? 'fa-clipboard-check' : 'fa-tasks'}"></i>
                        </div>
                        <div style="flex: 1;">
                            <div style="font-size: 14px; font-weight: 600; color: var(--color-gray-900); margin-bottom: 2px;">${task.source.id} - ${task.source.title}</div>
                            <div style="font-size: 12px; color: var(--color-gray-600);">模块: ${task.source.module} · 时间: ${task.source.createdAt}</div>
                        </div>
                        <button class="btn btn-sm btn-primary" onclick="viewSourceDetail('${task.source.type}', '${task.source.id}')" style="padding: 6px 12px; font-size: 13px;">
                            <i class="fas fa-external-link-alt"></i>
                            查看
                        </button>
                    </div>
                </div>
                ` : ''}

                <!-- 任务详情 -->
                ${task.details ? `
                <div style="margin-bottom: 24px;">
                    <h4 style="font-size: 15px; font-weight: 600; margin-bottom: 12px; display: flex; align-items: center; gap: 6px;">
                        <i class="fas fa-list-alt"></i>
                        任务详情
                    </h4>
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; padding: 16px; background: var(--color-gray-50); border-radius: 8px;">
                        <div>
                            <div style="font-size: 12px; color: var(--color-gray-500); margin-bottom: 4px;">涉及单位</div>
                            <div style="font-size: 14px; color: var(--color-gray-900);">${task.details.unit}</div>
                        </div>
                        <div>
                            <div style="font-size: 12px; color: var(--color-gray-500); margin-bottom: 4px;">涉及人员</div>
                            <div style="font-size: 14px; color: var(--color-gray-900);">${task.details.person}</div>
                        </div>
                        ${task.details.amount > 0 ? `
                        <div>
                            <div style="font-size: 12px; color: var(--color-gray-500); margin-bottom: 4px;">涉及金额</div>
                            <div style="font-size: 14px; color: var(--color-gray-900);">${(task.details.amount / 10000).toFixed(1)}万元</div>
                        </div>
                        ` : ''}
                        <div>
                            <div style="font-size: 12px; color: var(--color-gray-500); margin-bottom: 4px;">风险等级</div>
                            <div>
                                <span style="display: inline-flex; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 500; ${task.details.riskLevel === 'high' ? 'background: rgba(239, 68, 68, 0.1); color: #991b1b;' : task.details.riskLevel === 'medium' ? 'background: rgba(245, 158, 11, 0.1); color: #92400e;' : 'background: rgba(59, 130, 246, 0.1); color: #1e40af;'}">
                                    ${task.details.riskLevel === 'high' ? '高风险' : task.details.riskLevel === 'medium' ? '中风险' : '低风险'}
                                </span>
                            </div>
                        </div>
                        <div>
                            <div style="font-size: 12px; color: var(--color-gray-500); margin-bottom: 4px;">任务类型</div>
                            <div style="font-size: 14px; color: var(--color-gray-900);">${task.type}</div>
                        </div>
                        <div>
                            <div style="font-size: 12px; color: var(--color-gray-500); margin-bottom: 4px;">截止日期</div>
                            <div style="font-size: 14px; color: var(--color-gray-900);">${task.deadline}</div>
                        </div>
                        <div>
                            <div style="font-size: 12px; color: var(--color-gray-500); margin-bottom: 4px;">分配人</div>
                            <div style="font-size: 14px; color: var(--color-gray-900);">${task.assignedBy}</div>
                        </div>
                        <div>
                            <div style="font-size: 12px; color: var(--color-gray-500); margin-bottom: 4px;">分配时间</div>
                            <div style="font-size: 14px; color: var(--color-gray-900);">${task.assignedAt}</div>
                        </div>
                    </div>
                </div>
                ` : ''}

                <!-- 证据材料 -->
                ${task.details?.evidence?.length > 0 ? `
                <div style="margin-bottom: 24px;">
                    <h4 style="font-size: 15px; font-weight: 600; margin-bottom: 12px; display: flex; align-items: center; gap: 6px;">
                        <i class="fas fa-file-alt"></i>
                        证据材料
                    </h4>
                    <ul style="list-style: none; padding: 0; margin: 0;">
                        ${task.details.evidence.map(item => `
                            <li style="padding: 8px 12px; background: var(--color-gray-50); border-radius: 6px; margin-bottom: 8px; border-left: 3px solid var(--color-primary); font-size: 14px; color: var(--color-gray-700);">
                                ${item}
                            </li>
                        `).join('')}
                    </ul>
                </div>
                ` : ''}

                <!-- 附件列表 -->
                ${task.details?.attachments?.length > 0 ? `
                <div style="margin-bottom: 24px;">
                    <h4 style="font-size: 15px; font-weight: 600; margin-bottom: 12px; display: flex; align-items: center; gap: 6px;">
                        <i class="fas fa-paperclip"></i>
                        附件列表
                    </h4>
                    <div style="display: flex; flex-direction: column; gap: 8px;">
                        ${task.details.attachments.map(file => `
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
                ${task.process?.requiredActions?.length > 0 ? `
                <div style="margin-bottom: 24px;">
                    <h4 style="font-size: 15px; font-weight: 600; margin-bottom: 12px; display: flex; align-items: center; gap: 6px;">
                        <i class="fas fa-tasks"></i>
                        需要的操作
                    </h4>
                    <div style="background: var(--color-gray-50); border-radius: 8px; padding: 16px;">
                        ${task.process.requiredActions.map((action, index) => `
                            <label style="display: flex; align-items: center; margin-bottom: 12px; cursor: pointer; font-size: 14px; color: var(--color-gray-700);">
                                <input type="checkbox" ${action.completed ? 'checked' : ''} style="margin-right: 12px; width: 16px; height: 16px;" disabled>
                                <span style="${action.completed ? 'text-decoration: line-through; color: #6b7280;' : ''}">${action.action}</span>
                            </label>
                        `).join('')}
                    </div>
                </div>
                ` : ''}

                <!-- 操作记录 -->
                ${task.history?.length > 0 ? `
                <div style="margin-bottom: 24px;">
                    <h4 style="font-size: 15px; font-weight: 600; margin-bottom: 12px; display: flex; align-items: center; gap: 6px;">
                        <i class="fas fa-history"></i>
                        操作记录
                    </h4>
                    <div class="timeline">
                        ${task.history.map((record, index) => `
                            <div style="position: relative; padding-left: 32px; padding-bottom: 20px; ${index === task.history.length - 1 ? 'padding-bottom: 0;' : ''}">
                                <div style="position: absolute; left: 0; top: 4px; width: 12px; height: 12px; border-radius: 50%; background: ${index === task.history.length - 1 ? 'var(--color-primary)' : 'var(--color-success)'}; border: 2px solid white; box-shadow: 0 0 0 2px ${index === task.history.length - 1 ? 'var(--color-primary)' : 'var(--color-success)'};"></div>
                                ${index < task.history.length - 1 ? '<div style="position: absolute; left: 5px; top: 16px; bottom: 0; width: 2px; background: var(--color-gray-200);"></div>' : ''}
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

/**
 * 查看来源详情
 */
function viewSourceDetail(type, id) {
    console.log('[MyTasks] 查看来源详情:', type, id);
    
    const urlMap = {
        'alert': 'command-center.html',
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
}
