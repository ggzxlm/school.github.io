/**
 * 采集任务管理页面脚本
 */

let currentTask = null;
let currentTab = 'info';

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    loadStatistics();
    loadTasks();
    loadDataSources();
    bindEvents();
    
    // 每30秒刷新一次
    setInterval(() => {
        loadStatistics();
        loadTasks();
    }, 30000);
});

/**
 * 绑定事件
 */
function bindEvents() {
    // 搜索
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', loadTasks);
    }
    
    // 筛选器
    const typeFilter = document.getElementById('typeFilter');
    if (typeFilter) {
        typeFilter.addEventListener('change', loadTasks);
    }
    
    const statusFilter = document.getElementById('statusFilter');
    if (statusFilter) {
        statusFilter.addEventListener('change', loadTasks);
    }
    
    // 重置按钮
    const resetBtn = document.getElementById('resetBtn');
    if (resetBtn) {
        resetBtn.addEventListener('click', resetFilters);
    }
    
    // 新建任务按钮
    const createTaskBtn = document.getElementById('createTaskBtn');
    if (createTaskBtn) {
        createTaskBtn.addEventListener('click', showCreateTaskModal);
    }
}

/**
 * 重置筛选
 */
function resetFilters() {
    const searchInput = document.getElementById('searchInput');
    const typeFilter = document.getElementById('typeFilter');
    const statusFilter = document.getElementById('statusFilter');
    
    if (searchInput) searchInput.value = '';
    if (typeFilter) typeFilter.value = '';
    if (statusFilter) statusFilter.value = '';
    
    loadTasks();
}

/**
 * 加载统计信息
 */
function loadStatistics() {
    const stats = window.collectionTaskService.getStatistics();
    
    document.getElementById('totalTasks').textContent = stats.total;
    document.getElementById('runningTasks').textContent = stats.running;
    document.getElementById('stoppedTasks').textContent = stats.stopped;
    document.getElementById('errorTasks').textContent = stats.error;
}

/**
 * 加载任务列表
 */
function loadTasks() {
    const typeFilterEl = document.getElementById('typeFilter');
    const statusFilterEl = document.getElementById('statusFilter');
    const searchInputEl = document.getElementById('searchInput');
    
    const filterType = typeFilterEl ? typeFilterEl.value : '';
    const filterStatus = statusFilterEl ? statusFilterEl.value : '';
    const searchText = searchInputEl ? searchInputEl.value.toLowerCase() : '';
    
    let tasks = window.collectionTaskService.getAll();
    
    // 应用筛选
    if (filterType) {
        tasks = tasks.filter(t => t.taskType === filterType);
    }
    if (filterStatus) {
        tasks = tasks.filter(t => t.status === filterStatus);
    }
    if (searchText) {
        tasks = tasks.filter(t => t.taskName.toLowerCase().includes(searchText));
    }
    
    // 渲染任务列表
    const tbody = document.getElementById('taskTableBody');
    
    if (tasks.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="px-6 py-12">
                    <div class="empty-state">
                        <i class="fas fa-tasks"></i>
                        <p>暂无采集任务</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = tasks.map(task => renderTaskRow(task)).join('');
}

/**
 * 渲染任务行
 */
function renderTaskRow(task) {
    const dataSource = window.dataSourceService ? window.dataSourceService.getById(task.dataSourceId) : null;
    const dataSourceName = dataSource ? dataSource.name : '未知数据源';
    
    const typeText = {
        'FULL': '全量采集',
        'INCREMENTAL': '增量采集',
        'CDC': 'CDC同步'
    }[task.taskType] || task.taskType;
    
    const statusText = {
        'RUNNING': '运行中',
        'STOPPED': '已停止',
        'ERROR': '错误'
    }[task.status] || task.status;
    
    const statusClass = {
        'RUNNING': 'status-in-progress',
        'STOPPED': 'status-pending',
        'ERROR': 'status-closed'
    }[task.status] || 'status-pending';
    
    const lastExecTime = task.lastExecutionTime || '-';
    const lastExecStatus = task.lastExecutionStatus || '-';
    
    return `
        <tr>
            <td class="px-6 py-4">
                <span class="text-sm font-medium text-gray-900">${escapeHtml(task.taskName)}</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-sm text-gray-600">${escapeHtml(dataSourceName)}</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-sm text-gray-600">${typeText}</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="status-badge ${statusClass}">${statusText}</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-sm text-gray-600">${lastExecTime}</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-sm text-gray-600">${lastExecStatus}</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm">
                <button class="action-btn action-btn-primary mr-2" onclick="viewTaskDetail('${task.id}')">
                    <i class="fas fa-eye mr-1"></i>查看
                </button>
                ${task.status !== 'RUNNING' ? `
                    <button class="action-btn action-btn-success mr-2" onclick="executeTask('${task.id}')">
                        <i class="fas fa-play mr-1"></i>执行
                    </button>
                ` : `
                    <button class="action-btn action-btn-warning mr-2" onclick="stopTask('${task.id}')">
                        <i class="fas fa-stop mr-1"></i>停止
                    </button>
                `}
                <button class="action-btn action-btn-secondary mr-2" onclick="editTask('${task.id}')">
                    <i class="fas fa-edit mr-1"></i>编辑
                </button>
                <button class="action-btn action-btn-danger" onclick="deleteTask('${task.id}')">
                    <i class="fas fa-trash mr-1"></i>删除
                </button>
            </td>
        </tr>
    `;
}

/**
 * 显示创建任务模态框
 */
function showCreateTaskModal() {
    console.log('[采集任务] 打开创建任务模态框');
    
    const modal = document.getElementById('createTaskModal');
    if (!modal) {
        console.error('[采集任务] 找不到模态框元素');
        alert('模态框初始化失败');
        return;
    }
    
    // 重置表单和标题
    const form = document.getElementById('createTaskForm');
    if (form) {
        form.reset();
    }
    
    const modalTitle = document.getElementById('createTaskModalTitle');
    if (modalTitle) {
        modalTitle.innerHTML = '<i class="fas fa-plus-circle"></i>新建采集任务';
    }
    
    const submitBtn = document.getElementById('submitTaskBtn');
    if (submitBtn) {
        submitBtn.innerHTML = '<i class="fas fa-check"></i> 创建';
        submitBtn.onclick = createTask;
    }
    
    // 显示模态框
    modal.style.display = 'flex';
    setTimeout(() => {
        modal.classList.add('modal-show');
    }, 10);
    
    console.log('[采集任务] 模态框已显示');
}

/**
 * 关闭创建任务模态框
 */
function closeCreateTaskModal() {
    const modal = document.getElementById('createTaskModal');
    if (modal) {
        modal.classList.remove('modal-show');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }
}

/**
 * 加载数据源列表
 */
function loadDataSources() {
    const dataSources = window.dataSourceService.getAll();
    const select = document.getElementById('dataSourceId');
    
    select.innerHTML = '<option value="">请选择数据源</option>' +
        dataSources.map(ds => `
            <option value="${ds.id}">${escapeHtml(ds.name)} (${ds.type})</option>
        `).join('');
}

/**
 * 处理任务类型变更
 */
function handleTaskTypeChange() {
    const taskType = document.getElementById('taskType').value;
    const incrementalFieldGroup = document.getElementById('incrementalFieldGroup');
    
    if (taskType === 'INCREMENTAL') {
        incrementalFieldGroup.style.display = 'block';
    } else {
        incrementalFieldGroup.style.display = 'none';
    }
}

/**
 * 创建任务
 */
async function createTask() {
    const taskName = document.getElementById('taskName').value.trim();
    const dataSourceId = document.getElementById('dataSourceId').value;
    const taskType = document.getElementById('taskType').value;
    const schedule = document.getElementById('schedule').value.trim();
    const query = document.getElementById('query').value.trim();
    const incrementalField = document.getElementById('incrementalField').value.trim();
    const maxRetries = parseInt(document.getElementById('maxRetries').value);
    const enabled = document.getElementById('enabled').checked;
    
    if (!taskName) {
        alert('请输入任务名称');
        return;
    }
    
    if (!dataSourceId) {
        alert('请选择数据源');
        return;
    }
    
    const taskData = {
        taskName,
        dataSourceId,
        taskType,
        schedule: schedule || null,
        query: query || null,
        incrementalField: taskType === 'INCREMENTAL' ? incrementalField : null,
        maxRetries,
        enabled
    };
    
    const result = window.collectionTaskService.create(taskData);
    
    if (result.success) {
        alert('任务创建成功');
        closeCreateTaskModal();
        loadStatistics();
        loadTasks();
    } else {
        alert('任务创建失败: ' + result.error);
    }
}

/**
 * 执行任务
 */
async function executeTask(taskId) {
    if (!confirm('确定要执行此任务吗?')) {
        return;
    }
    
    const result = await window.collectionTaskService.executeTask(taskId, true);
    
    if (result.success) {
        alert('任务已开始执行');
        loadStatistics();
        loadTasks();
    } else {
        alert('任务执行失败: ' + result.error);
    }
}

/**
 * 停止任务
 */
function stopTask(taskId) {
    if (!confirm('确定要停止此任务吗?')) {
        return;
    }
    
    const result = window.collectionTaskService.stopTask(taskId);
    
    if (result.success) {
        alert('任务已停止');
        loadStatistics();
        loadTasks();
    } else {
        alert('停止任务失败: ' + result.error);
    }
}

/**
 * 切换任务启用状态
 */
function toggleTask(taskId, enabled) {
    const action = enabled ? '启用' : '禁用';
    if (!confirm(`确定要${action}此任务吗?`)) {
        return;
    }
    
    const result = window.collectionTaskService.toggleTask(taskId, enabled);
    
    if (result.success) {
        alert(`任务已${action}`);
        loadStatistics();
        loadTasks();
    } else {
        alert(`${action}任务失败: ` + result.error);
    }
}

/**
 * 编辑任务
 */
function editTask(taskId) {
    console.log('[采集任务] 编辑任务:', taskId);
    
    const task = window.collectionTaskService.getById(taskId);
    if (!task) {
        alert('任务不存在');
        return;
    }
    
    // 填充表单
    document.getElementById('taskName').value = task.taskName;
    document.getElementById('dataSourceId').value = task.dataSourceId;
    document.getElementById('taskType').value = task.taskType;
    document.getElementById('schedule').value = task.schedule || '';
    document.getElementById('query').value = task.query || '';
    document.getElementById('incrementalField').value = task.incrementalField || '';
    document.getElementById('maxRetries').value = task.maxRetries;
    document.getElementById('enabled').checked = task.enabled;
    
    // 处理任务类型变更（显示/隐藏增量字段）
    handleTaskTypeChange();
    
    // 更新模态框标题
    const modalTitle = document.getElementById('createTaskModalTitle');
    if (modalTitle) {
        modalTitle.innerHTML = '<i class="fas fa-edit"></i>编辑采集任务';
    }
    
    // 更新提交按钮
    const submitBtn = document.getElementById('submitTaskBtn');
    if (submitBtn) {
        submitBtn.innerHTML = '<i class="fas fa-check"></i> 保存';
        submitBtn.onclick = function() {
            updateTask(taskId);
        };
    }
    
    // 显示模态框
    const modal = document.getElementById('createTaskModal');
    modal.style.display = 'flex';
    setTimeout(() => {
        modal.classList.add('modal-show');
    }, 10);
    
    console.log('[采集任务] 编辑模态框已显示');
}

/**
 * 更新任务
 */
function updateTask(taskId) {
    const taskName = document.getElementById('taskName').value.trim();
    const dataSourceId = document.getElementById('dataSourceId').value;
    const taskType = document.getElementById('taskType').value;
    const schedule = document.getElementById('schedule').value.trim();
    const query = document.getElementById('query').value.trim();
    const incrementalField = document.getElementById('incrementalField').value.trim();
    const maxRetries = parseInt(document.getElementById('maxRetries').value);
    const enabled = document.getElementById('enabled').checked;
    
    if (!taskName) {
        alert('请输入任务名称');
        return;
    }
    
    if (!dataSourceId) {
        alert('请选择数据源');
        return;
    }
    
    const taskData = {
        taskName,
        dataSourceId,
        taskType,
        schedule: schedule || null,
        query: query || null,
        incrementalField: taskType === 'INCREMENTAL' ? incrementalField : null,
        maxRetries,
        enabled
    };
    
    const result = window.collectionTaskService.update(taskId, taskData);
    
    if (result.success) {
        alert('任务更新成功');
        closeCreateTaskModal();
        loadStatistics();
        loadTasks();
    } else {
        alert('任务更新失败: ' + result.error);
    }
}

/**
 * 删除任务
 */
function deleteTask(taskId) {
    if (!confirm('确定要删除此任务吗? 此操作不可恢复。')) {
        return;
    }
    
    const result = window.collectionTaskService.delete(taskId);
    
    if (result.success) {
        alert('任务已删除');
        loadStatistics();
        loadTasks();
    } else {
        alert('删除任务失败: ' + result.error);
    }
}

/**
 * 查看任务详情
 */
function viewTaskDetail(taskId) {
    console.log('[采集任务] 查看任务详情:', taskId);
    
    currentTask = window.collectionTaskService.getById(taskId);
    if (!currentTask) {
        alert('任务不存在');
        return;
    }
    
    // 更新标题
    const titleEl = document.getElementById('detailTaskName');
    if (titleEl) {
        titleEl.innerHTML = `<i class="fas fa-info-circle"></i>${escapeHtml(currentTask.taskName)}`;
    }
    
    // 显示模态框
    const modal = document.getElementById('taskDetailModal');
    modal.style.display = 'flex';
    setTimeout(() => {
        modal.classList.add('modal-show');
    }, 10);
    
    // 默认显示基本信息
    switchDetailTab('info');
    
    console.log('[采集任务] 详情模态框已显示');
}

/**
 * 查看任务日志
 */
function viewTaskLogs(taskId) {
    console.log('[采集任务] 查看任务日志:', taskId);
    
    currentTask = window.collectionTaskService.getById(taskId);
    if (!currentTask) {
        alert('任务不存在');
        return;
    }
    
    // 更新标题
    const titleEl = document.getElementById('detailTaskName');
    if (titleEl) {
        titleEl.innerHTML = `<i class="fas fa-file-alt"></i>${escapeHtml(currentTask.taskName)} - 执行日志`;
    }
    
    // 显示模态框
    const modal = document.getElementById('taskDetailModal');
    modal.style.display = 'flex';
    setTimeout(() => {
        modal.classList.add('modal-show');
    }, 10);
    
    // 显示日志标签页
    switchDetailTab('logs');
}

/**
 * 关闭任务详情模态框
 */
function closeTaskDetailModal() {
    const modal = document.getElementById('taskDetailModal');
    if (modal) {
        modal.classList.remove('modal-show');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }
    currentTask = null;
}

/**
 * 切换详情标签页
 */
function switchDetailTab(tab) {
    currentTab = tab;
    
    // 更新标签按钮状态
    document.querySelectorAll('#taskDetailModal .tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // 设置当前标签为active
    const buttons = document.querySelectorAll('#taskDetailModal .tab-btn');
    const tabIndex = ['info', 'history', 'logs', 'stats'].indexOf(tab);
    if (tabIndex >= 0 && buttons[tabIndex]) {
        buttons[tabIndex].classList.add('active');
    }
    
    // 渲染标签内容
    const content = document.getElementById('tabContent');
    
    switch(tab) {
        case 'info':
            content.innerHTML = renderTaskInfo();
            break;
        case 'history':
            content.innerHTML = renderTaskHistory();
            break;
        case 'logs':
            content.innerHTML = renderTaskLogs();
            break;
        case 'stats':
            content.innerHTML = renderTaskStats();
            break;
    }
}

/**
 * 渲染任务基本信息
 */
function renderTaskInfo() {
    if (!currentTask) return '';
    
    const dataSource = window.dataSourceService.getById(currentTask.dataSourceId);
    const dataSourceName = dataSource ? dataSource.name : '未知数据源';
    
    return `
        <div class="stats-grid">
            <div class="stats-item">
                <div class="stats-item-label">任务名称</div>
                <div class="stats-item-value" style="font-size: 16px;">${escapeHtml(currentTask.taskName)}</div>
            </div>
            <div class="stats-item">
                <div class="stats-item-label">任务类型</div>
                <div class="stats-item-value" style="font-size: 16px;">${currentTask.taskType}</div>
            </div>
            <div class="stats-item">
                <div class="stats-item-label">数据源</div>
                <div class="stats-item-value" style="font-size: 16px;">${escapeHtml(dataSourceName)}</div>
            </div>
            <div class="stats-item">
                <div class="stats-item-label">状态</div>
                <div class="stats-item-value" style="font-size: 16px;">${currentTask.status}</div>
            </div>
            <div class="stats-item">
                <div class="stats-item-label">调度配置</div>
                <div class="stats-item-value" style="font-size: 16px;">${currentTask.schedule || '手动执行'}</div>
            </div>
            <div class="stats-item">
                <div class="stats-item-label">最大重试次数</div>
                <div class="stats-item-value" style="font-size: 16px;">${currentTask.maxRetries}</div>
            </div>
            <div class="stats-item">
                <div class="stats-item-label">创建时间</div>
                <div class="stats-item-value" style="font-size: 14px;">${formatDateTime(currentTask.createdAt)}</div>
            </div>
            <div class="stats-item">
                <div class="stats-item-label">更新时间</div>
                <div class="stats-item-value" style="font-size: 14px;">${formatDateTime(currentTask.updatedAt)}</div>
            </div>
        </div>
        ${currentTask.query ? `
            <div style="margin-top: 20px;">
                <h4 style="margin-bottom: 12px;">查询语句/API路径</h4>
                <pre style="background: #f3f4f6; padding: 12px; border-radius: 6px; overflow-x: auto;">${escapeHtml(currentTask.query)}</pre>
            </div>
        ` : ''}
    `;
}

/**
 * 渲染任务执行历史
 */
function renderTaskHistory() {
    if (!currentTask) return '';
    
    const executions = window.collectionTaskService.getExecutions(currentTask.id, 20);
    
    if (executions.length === 0) {
        return '<div class="empty-state"><p>暂无执行历史</p></div>';
    }
    
    return `
        <table class="history-table">
            <thead>
                <tr>
                    <th>执行时间</th>
                    <th>状态</th>
                    <th>采集记录数</th>
                    <th>失败记录数</th>
                    <th>重试次数</th>
                    <th>执行方式</th>
                </tr>
            </thead>
            <tbody>
                ${executions.map(exec => `
                    <tr>
                        <td>${formatDateTime(exec.startTime)}</td>
                        <td><span class="status-badge ${exec.status.toLowerCase()}">${exec.status}</span></td>
                        <td>${exec.recordsCollected || 0}</td>
                        <td>${exec.recordsFailed || 0}</td>
                        <td>${exec.retryAttempt || 0}</td>
                        <td>${exec.isManual ? '手动' : '自动'}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

/**
 * 渲染任务日志
 */
function renderTaskLogs() {
    if (!currentTask) return '';
    
    const logs = window.collectionTaskService.getTaskLogs(currentTask.id, 50);
    
    if (logs.length === 0) {
        return '<div class="empty-state"><p>暂无执行日志</p></div>';
    }
    
    return `
        <div class="log-container">
            ${logs.map(log => `
                <div class="log-entry">
                    <span class="log-time">[${formatDateTime(log.startTime)}]</span>
                    <span class="log-level ${log.status.toLowerCase()}">[${log.status}]</span>
                    ${log.taskName} - 
                    ${log.status === 'SUCCESS' 
                        ? `采集 ${log.recordsCollected} 条记录` 
                        : `失败: ${log.errorMessage || '未知错误'}`}
                </div>
            `).join('')}
        </div>
    `;
}

/**
 * 渲染任务统计
 */
function renderTaskStats() {
    if (!currentTask) return '';
    
    const stats = window.collectionTaskService.getTaskStatistics(currentTask.id);
    
    return `
        <div class="stats-grid">
            <div class="stats-item">
                <div class="stats-item-label">总执行次数</div>
                <div class="stats-item-value">${stats.total}</div>
            </div>
            <div class="stats-item">
                <div class="stats-item-label">成功次数</div>
                <div class="stats-item-value" style="color: #10b981;">${stats.success}</div>
            </div>
            <div class="stats-item">
                <div class="stats-item-label">失败次数</div>
                <div class="stats-item-value" style="color: #ef4444;">${stats.failed}</div>
            </div>
            <div class="stats-item">
                <div class="stats-item-label">成功率</div>
                <div class="stats-item-value">${stats.successRate}</div>
            </div>
            <div class="stats-item">
                <div class="stats-item-label">总采集记录数</div>
                <div class="stats-item-value">${stats.totalRecords.toLocaleString()}</div>
            </div>
            <div class="stats-item">
                <div class="stats-item-label">平均每次采集</div>
                <div class="stats-item-value">${stats.avgRecords.toLocaleString()}</div>
            </div>
        </div>
    `;
}

/**
 * 格式化日期时间
 */
function formatDateTime(dateStr) {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
}

/**
 * HTML转义
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * 退出登录
 */
function logout() {
    if (confirm('确定要退出登录吗?')) {
        window.location.href = 'login.html';
    }
}
