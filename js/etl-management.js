/**
 * ETL作业管理页面脚本
 */

let currentJobId = null;
let currentDesignerJob = null;

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    initPage();
    loadJobs();
    loadDataSources();
    setupEventListeners();
});

/**
 * 初始化页面
 */
function initPage() {
    // 初始化模态框为隐藏状态
    const jobDetailModal = document.getElementById('jobDetailModal');
    if (jobDetailModal) {
        jobDetailModal.style.display = 'none';
    }

    const jobModal = document.getElementById('jobModal');
    if (jobModal) {
        jobModal.style.display = 'none';
    }

    updateStatistics();
}

/**
 * 设置事件监听器
 */
function setupEventListeners() {
    // 搜索
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', Utils.debounce(() => {
            loadJobs();
        }, 300));
    }

    // 筛选
    const statusFilter = document.getElementById('statusFilter');
    const enabledFilter = document.getElementById('enabledFilter');
    
    if (statusFilter) {
        statusFilter.addEventListener('change', loadJobs);
    }
    if (enabledFilter) {
        enabledFilter.addEventListener('change', loadJobs);
    }
    
    // 重置按钮
    const resetBtn = document.getElementById('resetBtn');
    if (resetBtn) {
        resetBtn.addEventListener('click', resetFilters);
    }
    
    // 创建作业按钮
    const createJobBtn = document.getElementById('createJobBtn');
    if (createJobBtn) {
        createJobBtn.addEventListener('click', showCreateJobModal);
    }
    
    // 模态框关闭按钮
    const closeJobModalBtn = document.getElementById('closeJobModalBtn');
    if (closeJobModalBtn) {
        closeJobModalBtn.addEventListener('click', closeJobModal);
    }
    
    const cancelJobBtn = document.getElementById('cancelJobBtn');
    if (cancelJobBtn) {
        cancelJobBtn.addEventListener('click', closeJobModal);
    }
    
    // 保存按钮
    const saveJobBtn = document.getElementById('saveJobBtn');
    if (saveJobBtn) {
        saveJobBtn.addEventListener('click', saveJob);
    }
    
    // 点击模态框外部关闭
    const jobModal = document.getElementById('jobModal');
    if (jobModal) {
        jobModal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeJobModal();
            }
        });
    }

    // 详情模态框关闭按钮
    const closeJobDetailModalBtn = document.getElementById('closeJobDetailModalBtn');
    if (closeJobDetailModalBtn) {
        closeJobDetailModalBtn.addEventListener('click', closeJobDetailModal);
    }

    const closeJobDetailBtn = document.getElementById('closeJobDetailBtn');
    if (closeJobDetailBtn) {
        closeJobDetailBtn.addEventListener('click', closeJobDetailModal);
    }

    // 详情模态框操作按钮
    const executeJobDetailBtn = document.getElementById('executeJobDetailBtn');
    if (executeJobDetailBtn) {
        executeJobDetailBtn.addEventListener('click', function() {
            if (currentJobId) {
                closeJobDetailModal();
                executeJob(currentJobId);
            }
        });
    }

    const designJobDetailBtn = document.getElementById('designJobDetailBtn');
    if (designJobDetailBtn) {
        designJobDetailBtn.addEventListener('click', function() {
            if (currentJobId) {
                closeJobDetailModal();
                openDesigner(currentJobId);
            }
        });
    }

    const editJobDetailBtn = document.getElementById('editJobDetailBtn');
    if (editJobDetailBtn) {
        editJobDetailBtn.addEventListener('click', function() {
            if (currentJobId) {
                closeJobDetailModal();
                editJob(currentJobId);
            }
        });
    }

    // 点击详情模态框外部关闭
    const jobDetailModal = document.getElementById('jobDetailModal');
    if (jobDetailModal) {
        jobDetailModal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeJobDetailModal();
            }
        });
    }
}

/**
 * 重置筛选
 */
function resetFilters() {
    const searchInput = document.getElementById('searchInput');
    const statusFilter = document.getElementById('statusFilter');
    const enabledFilter = document.getElementById('enabledFilter');
    
    if (searchInput) searchInput.value = '';
    if (statusFilter) statusFilter.value = '';
    if (enabledFilter) enabledFilter.value = '';
    
    loadJobs();
}

/**
 * 更新统计信息
 */
function updateStatistics() {
    const stats = window.etlService.getStatistics();
    renderStatsCards(stats);
}

/**
 * 渲染统计卡片
 */
function renderStatsCards(stats) {
    const container = document.getElementById('statsContainer');
    if (!container) return;

    const statsData = [
        {
            title: '总作业数',
            value: stats.total,
            percentage: '100%',
            icon: 'fa-tasks',
            color: 'primary'
        },
        {
            title: '已发布',
            value: stats.published,
            percentage: stats.total > 0 ? `${Math.round(stats.published / stats.total * 100)}%` : '0%',
            icon: 'fa-check-circle',
            color: 'success'
        },
        {
            title: '草稿',
            value: stats.draft,
            percentage: stats.total > 0 ? `${Math.round(stats.draft / stats.total * 100)}%` : '0%',
            icon: 'fa-edit',
            color: 'info'
        },
        {
            title: '启用中',
            value: stats.enabled,
            percentage: stats.total > 0 ? `${Math.round(stats.enabled / stats.total * 100)}%` : '0%',
            icon: 'fa-play-circle',
            color: 'warning'
        }
    ];

    const html = statsData.map(stat => `
        <div class="stat-card stat-card-${stat.color}">
            <div class="stat-icon">
                <i class="fas ${stat.icon}"></i>
            </div>
            <div class="stat-content">
                <div class="stat-label">${stat.title}</div>
                <div class="stat-value">${stat.value}</div>
                <div class="stat-extra">${stat.percentage} 占比</div>
            </div>
        </div>
    `).join('');

    container.innerHTML = html;
}

/**
 * 加载作业列表
 */
function loadJobs() {
    const jobs = window.etlService.getAll();
    const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || '';
    const statusFilter = document.getElementById('statusFilter')?.value || '';
    const enabledFilter = document.getElementById('enabledFilter')?.value || '';

    // 筛选
    let filteredJobs = jobs.filter(job => {
        const matchSearch = !searchTerm || job.jobName.toLowerCase().includes(searchTerm);
        const matchStatus = !statusFilter || job.status === statusFilter;
        const matchEnabled = !enabledFilter || job.enabled.toString() === enabledFilter;
        return matchSearch && matchStatus && matchEnabled;
    });

    // 排序：最新的在前
    filteredJobs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    renderJobTable(filteredJobs);
    updateStatistics();
}

/**
 * 渲染作业表格
 */
function renderJobTable(jobs) {
    const tbody = document.getElementById('jobTableBody');
    
    if (jobs.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="text-center">
                    <div class="empty-state">
                        <div class="empty-icon">📋</div>
                        <p>暂无符合条件的ETL作业</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = jobs.map(job => `
        <tr>
            <td class="px-6 py-4">
                <div class="font-medium text-gray-900">${job.jobName}</div>
                ${job.description ? `<div class="text-xs text-gray-500 mt-1">${job.description}</div>` : ''}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-sm text-gray-600">${job.version}</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                ${renderStatusBadge(job.status)}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                ${renderEnabledBadge(job.enabled)}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-sm text-gray-600">${job.lastExecutionTime ? Utils.formatDate(job.lastExecutionTime) : '-'}</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                ${job.lastExecutionStatus ? renderExecutionStatusBadge(job.lastExecutionStatus) : '<span class="text-sm text-gray-600">-</span>'}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-sm text-gray-600">${Utils.formatDate(job.createdAt)}</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm">
                <button class="action-btn action-btn-primary mr-2" onclick="viewJobDetail('${job.id}')">
                    <i class="fas fa-eye mr-1"></i>查看
                </button>
                <button class="action-btn action-btn-info mr-2" onclick="openDesigner('${job.id}')">
                    <i class="fas fa-project-diagram mr-1"></i>设计
                </button>
                <button class="action-btn action-btn-success mr-2" onclick="executeJob('${job.id}')">
                    <i class="fas fa-play mr-1"></i>执行
                </button>
                <button class="action-btn action-btn-secondary mr-2" onclick="editJob('${job.id}')">
                    <i class="fas fa-edit mr-1"></i>编辑
                </button>
                <button class="action-btn action-btn-danger" onclick="deleteJob('${job.id}')">
                    <i class="fas fa-trash mr-1"></i>删除
                </button>
            </td>
        </tr>
    `).join('');
}

/**
 * 渲染状态徽章
 */
function renderStatusBadge(status) {
    const badges = {
        'DRAFT': '<span class="status-badge status-pending">草稿</span>',
        'PUBLISHED': '<span class="status-badge status-completed">已发布</span>',
        'ARCHIVED': '<span class="status-badge status-closed">已归档</span>'
    };
    return badges[status] || `<span class="status-badge status-pending">${status}</span>`;
}

/**
 * 渲染启用状态徽章
 */
function renderEnabledBadge(enabled) {
    return enabled 
        ? '<span class="status-badge status-completed">已启用</span>'
        : '<span class="status-badge status-pending">已禁用</span>';
}

/**
 * 渲染执行状态徽章
 */
function renderExecutionStatusBadge(status) {
    const badges = {
        'SUCCESS': '<span class="status-badge status-completed">成功</span>',
        'FAILED': '<span class="status-badge status-closed">失败</span>',
        'RUNNING': '<span class="status-badge status-in-progress">运行中</span>'
    };
    return badges[status] || `<span class="status-badge status-pending">${status}</span>`;
}

/**
 * 加载数据源列表
 */
function loadDataSources() {
    if (!window.dataSourceService) return;
    
    const dataSources = window.dataSourceService.getAll();
    const select = document.getElementById('dataSourceId');
    
    if (select) {
        select.innerHTML = '<option value="">请选择数据源</option>' +
            dataSources.map(ds => `<option value="${ds.id}">${ds.name}</option>`).join('');
    }
}

/**
 * 显示创建作业模态框
 */
function showCreateJobModal() {
    console.log('[ETL管理] 打开创建作业模态框');
    currentJobId = null;
    
    const modal = document.getElementById('jobModal');
    if (!modal) {
        console.error('[ETL管理] 找不到模态框元素 #jobModal');
        return;
    }
    
    // 重置表单
    document.getElementById('jobForm').reset();
    document.getElementById('jobId').value = '';
    document.getElementById('enabled').checked = true;
    
    // 设置标题
    const modalTitle = document.getElementById('modalTitle');
    if (modalTitle) {
        modalTitle.innerHTML = '<i class="fas fa-plus-circle"></i>创建ETL作业';
    }
    
    // 显示模态框
    modal.style.display = 'flex';
    setTimeout(() => {
        modal.classList.add('modal-show');
    }, 10);
}

/**
 * 关闭作业模态框
 */
function closeJobModal() {
    const modal = document.getElementById('jobModal');
    if (!modal) return;
    
    modal.classList.remove('modal-show');
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
    
    // 重置表单
    document.getElementById('jobForm').reset();
}

/**
 * 编辑作业
 */
function editJob(jobId) {
    const job = window.etlService.getById(jobId);
    if (!job) {
        showToast('作业不存在', 'error');
        return;
    }

    currentJobId = jobId;
    
    const modal = document.getElementById('jobModal');
    if (!modal) return;
    
    // 设置标题
    const modalTitle = document.getElementById('modalTitle');
    if (modalTitle) {
        modalTitle.innerHTML = '<i class="fas fa-edit"></i>编辑ETL作业';
    }
    
    // 填充表单
    document.getElementById('jobId').value = job.id;
    document.getElementById('jobName').value = job.jobName;
    document.getElementById('jobDescription').value = job.description || '';
    document.getElementById('dataSourceId').value = job.sourceConfig?.dataSourceId || '';
    document.getElementById('sourceQuery').value = job.sourceConfig?.query || '';
    document.getElementById('targetTable').value = job.targetConfig?.tableName || '';
    document.getElementById('writeMode').value = job.targetConfig?.writeMode || 'INSERT';
    document.getElementById('schedule').value = job.schedule || '';
    document.getElementById('enabled').checked = job.enabled;
    
    // 显示模态框
    modal.style.display = 'flex';
    setTimeout(() => {
        modal.classList.add('modal-show');
    }, 10);
}

/**
 * 显示提示消息
 */
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `fixed top-20 right-6 px-6 py-3 rounded-lg shadow-lg text-white z-50 ${
        type === 'success' ? 'bg-green-500' :
        type === 'error' ? 'bg-red-500' :
        type === 'warning' ? 'bg-yellow-500' :
        'bg-blue-500'
    }`;
    toast.innerHTML = `
        <div class="flex items-center space-x-2">
            <i class="fas ${
                type === 'success' ? 'fa-check-circle' :
                type === 'error' ? 'fa-times-circle' :
                type === 'warning' ? 'fa-exclamation-triangle' :
                'fa-info-circle'
            }"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s';
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 2000);
}

/**
 * 保存作业
 */
function saveJob() {
    const jobName = document.getElementById('jobName').value.trim();
    const jobDescription = document.getElementById('jobDescription').value.trim();
    const dataSourceId = document.getElementById('dataSourceId').value;
    const sourceQuery = document.getElementById('sourceQuery').value.trim();
    const targetTable = document.getElementById('targetTable').value.trim();
    const writeMode = document.getElementById('writeMode').value;
    const schedule = document.getElementById('schedule').value.trim();
    const enabled = document.getElementById('enabled').checked;

    if (!jobName) {
        Toast.error('请输入作业名称');
        return;
    }

    if (!dataSourceId) {
        Toast.error('请选择数据源');
        return;
    }

    if (!targetTable) {
        Toast.error('请输入目标表名');
        return;
    }

    const jobData = {
        jobName,
        description: jobDescription,
        sourceConfig: {
            dataSourceId,
            query: sourceQuery
        },
        targetConfig: {
            tableName: targetTable,
            writeMode
        },
        schedule: schedule || null,
        enabled
    };

    let result;
    if (currentJobId) {
        result = window.etlService.update(currentJobId, jobData);
    } else {
        result = window.etlService.create(jobData);
    }

    if (result.success) {
        Toast.success(currentJobId ? '作业更新成功' : '作业创建成功');
        closeJobModal();
        loadJobs();
    } else {
        Toast.error(result.error || '操作失败');
    }
}

/**
 * 删除作业
 */
function deleteJob(jobId) {
    const job = window.etlService.getById(jobId);
    if (!job) {
        Toast.error('作业不存在');
        return;
    }

    Modal.confirm({
        title: '确认删除',
        content: `确定要删除作业"${job.jobName}"吗？此操作不可恢复。`,
        onConfirm: () => {
            const result = window.etlService.delete(jobId);
            if (result.success) {
                Toast.success('作业删除成功');
                loadJobs();
            } else {
                Toast.error(result.error || '删除失败');
            }
        }
    });
}

/**
 * 执行作业
 */
async function executeJob(jobId) {
    const job = window.etlService.getById(jobId);
    if (!job) {
        Toast.error('作业不存在');
        return;
    }

    Loading.show('正在执行作业...');

    try {
        const result = await window.etlService.executeJob(jobId);
        
        Loading.hide();

        if (result.success) {
            Toast.success('作业执行成功');
            loadJobs();
            
            // 显示执行结果
            showExecutionResult(result.data);
        } else {
            Toast.error(result.error || '作业执行失败');
        }
    } catch (error) {
        Loading.hide();
        Toast.error('作业执行失败: ' + error.message);
    }
}

/**
 * 显示执行结果
 */
function showExecutionResult(execution) {
    const content = `
        <div style="padding: 16px;">
            <div style="margin-bottom: 16px;">
                <strong>执行ID:</strong> ${execution.id}
            </div>
            <div style="margin-bottom: 16px;">
                <strong>状态:</strong> ${renderExecutionStatusBadge(execution.status)}
            </div>
            <div style="margin-bottom: 16px;">
                <strong>处理记录数:</strong> ${execution.recordsProcessed}
            </div>
            <div style="margin-bottom: 16px;">
                <strong>成功记录数:</strong> ${execution.recordsSuccess}
            </div>
            <div style="margin-bottom: 16px;">
                <strong>失败记录数:</strong> ${execution.recordsFailed}
            </div>
            <div style="margin-bottom: 16px;">
                <strong>执行时间:</strong> ${Utils.formatDate(execution.startTime)} - ${Utils.formatDate(execution.endTime)}
            </div>
            ${execution.logs && execution.logs.length > 0 ? `
                <div style="margin-top: 20px;">
                    <strong>执行日志:</strong>
                    <div class="execution-logs" style="margin-top: 8px;">
                        ${execution.logs.map(log => `
                            <div class="log-entry">
                                <span class="log-time">${Utils.formatDate(log.time, 'HH:mm:ss')}</span>
                                <span class="log-message">${log.message}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            ` : ''}
        </div>
    `;

    Modal.alert({
        title: '执行结果',
        content: content,
        width: '600px'
    });
}

/**
 * 查看作业详情
 */
function viewJobDetail(jobId) {
    const job = window.etlService.getById(jobId);
    if (!job) {
        Toast.error('作业不存在');
        return;
    }

    currentJobId = jobId;

    // 填充基本信息
    document.getElementById('detailJobName').textContent = job.jobName;
    document.getElementById('detailVersion').textContent = job.version;
    document.getElementById('detailStatus').innerHTML = renderStatusBadge(job.status);
    document.getElementById('detailEnabled').innerHTML = renderEnabledBadge(job.enabled);
    document.getElementById('detailCreateTime').textContent = Utils.formatDate(job.createdAt);
    document.getElementById('detailUpdateTime').textContent = Utils.formatDate(job.updatedAt);
    document.getElementById('detailDescription').textContent = job.description || '-';

    // 填充数据源配置
    const dataSource = job.sourceConfig?.dataSourceId ? 
        window.dataSourceService?.getById(job.sourceConfig.dataSourceId) : null;
    document.getElementById('detailDataSource').textContent = dataSource ? dataSource.name : '-';
    document.getElementById('detailTargetTable').textContent = job.targetConfig?.tableName || '-';
    document.getElementById('detailWriteMode').textContent = job.targetConfig?.writeMode || '-';
    document.getElementById('detailSchedule').textContent = job.schedule || '手动执行';
    document.getElementById('detailSourceQuery').textContent = job.sourceConfig?.query || '-';

    // 填充执行统计
    const stats = window.etlService.getJobStatistics(jobId);
    document.getElementById('detailLastExecution').textContent = job.lastExecutionTime ? 
        Utils.formatDate(job.lastExecutionTime) : '-';
    document.getElementById('detailLastStatus').innerHTML = job.lastExecutionStatus ? 
        renderExecutionStatusBadge(job.lastExecutionStatus) : '-';
    document.getElementById('detailTotalExecutions').textContent = stats.total;
    document.getElementById('detailSuccessRate').textContent = stats.successRate;

    // 填充执行历史
    const executions = window.etlService.getExecutions(jobId, 10);
    const executionHistory = document.getElementById('executionHistory');
    if (executions && executions.length > 0) {
        executionHistory.innerHTML = executions.map(exec => `
            <div class="execution-history-item">
                <div class="execution-history-header">
                    <span class="execution-history-time">
                        <i class="fas fa-clock"></i> ${Utils.formatDate(exec.startTime)}
                    </span>
                    ${renderExecutionStatusBadge(exec.status)}
                </div>
                <div class="execution-history-details">
                    ${exec.status === 'SUCCESS' ? `
                        <span><i class="fas fa-database"></i> 处理记录: ${exec.recordsProcessed || 0}</span>
                        <span><i class="fas fa-check"></i> 成功: ${exec.recordsSuccess || 0}</span>
                        <span><i class="fas fa-times"></i> 失败: ${exec.recordsFailed || 0}</span>
                    ` : `
                        <span class="text-red-600"><i class="fas fa-exclamation-circle"></i> 执行失败</span>
                    `}
                </div>
            </div>
        `).join('');
    } else {
        executionHistory.innerHTML = '<p style="color: #6B7280; font-size: 13px;">暂无执行历史</p>';
    }

    // 显示模态框
    const modal = document.getElementById('jobDetailModal');
    modal.style.display = 'flex';
    setTimeout(() => {
        modal.classList.add('modal-show');
    }, 10);
}

/**
 * 关闭作业详情模态框
 */
function closeJobDetailModal() {
    const modal = document.getElementById('jobDetailModal');
    modal.classList.remove('modal-show');
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
    currentJobId = null;
}

/**
 * 查看作业执行历史
 */
function viewJobHistory(jobId) {
    const job = window.etlService.getById(jobId);
    if (!job) {
        Toast.error('作业不存在');
        return;
    }

    const executions = window.etlService.getExecutions(jobId, 20);
    const stats = window.etlService.getJobStatistics(jobId);

    const content = `
        <div style="padding: 16px;">
            <div style="margin-bottom: 20px; padding: 16px; background: #F9FAFB; border-radius: 8px;">
                <h4 style="margin-bottom: 12px;">统计信息</h4>
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;">
                    <div>
                        <div style="font-size: 12px; color: #6B7280;">总执行次数</div>
                        <div style="font-size: 20px; font-weight: 600; color: #1F2937;">${stats.total}</div>
                    </div>
                    <div>
                        <div style="font-size: 12px; color: #6B7280;">成功率</div>
                        <div style="font-size: 20px; font-weight: 600; color: #10B981;">${stats.successRate}</div>
                    </div>
                    <div>
                        <div style="font-size: 12px; color: #6B7280;">平均处理记录</div>
                        <div style="font-size: 20px; font-weight: 600; color: #3B82F6;">${stats.avgRecords}</div>
                    </div>
                </div>
            </div>

            <h4 style="margin-bottom: 12px;">执行历史</h4>
            ${executions.length > 0 ? `
                <div style="max-height: 400px; overflow-y: auto;">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>执行时间</th>
                                <th>状态</th>
                                <th>处理记录</th>
                                <th>成功/失败</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${executions.map(exec => `
                                <tr>
                                    <td>${Utils.formatDate(exec.startTime)}</td>
                                    <td>${renderExecutionStatusBadge(exec.status)}</td>
                                    <td>${exec.recordsProcessed || 0}</td>
                                    <td>${exec.recordsSuccess || 0} / ${exec.recordsFailed || 0}</td>
                                    <td>
                                        <button class="btn btn-sm btn-secondary" onclick="showExecutionDetail('${exec.id}')">
                                            详情
                                        </button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            ` : '<p style="text-align: center; color: #9CA3AF; padding: 20px;">暂无执行历史</p>'}
        </div>
    `;

    Modal.alert({
        title: `执行历史 - ${job.jobName}`,
        content: content,
        width: '800px'
    });
}

/**
 * 显示执行详情
 */
function showExecutionDetail(executionId) {
    const executions = window.etlService.getExecutions();
    const execution = executions.find(e => e.id === executionId);
    
    if (!execution) {
        Toast.error('执行记录不存在');
        return;
    }

    showExecutionResult(execution);
}

/**
 * 查看版本历史
 */
function viewVersions(jobId) {
    const job = window.etlService.getById(jobId);
    if (!job) {
        Toast.error('作业不存在');
        return;
    }

    const versions = window.etlService.getVersions(jobId);

    const content = `
        <div style="padding: 16px;">
            <div style="margin-bottom: 16px;">
                <strong>当前版本:</strong> <span class="badge badge-info">${job.version}</span>
            </div>

            <h4 style="margin-bottom: 12px;">版本历史</h4>
            ${versions.length > 0 ? `
                <div class="version-list">
                    ${versions.map((ver, index) => `
                        <div class="version-item">
                            <div class="version-info">
                                <div class="version-number">
                                    ${ver.version}
                                    ${index === 0 ? '<span class="version-badge">当前</span>' : ''}
                                </div>
                                <div class="version-meta">
                                    ${Utils.formatDate(ver.createdAt)} · ${ver.createdBy}
                                </div>
                            </div>
                            <div class="version-actions">
                                ${index > 0 ? `
                                    <button class="btn btn-sm btn-secondary" onclick="rollbackToVersion('${jobId}', '${ver.id}')">
                                        回退
                                    </button>
                                ` : ''}
                                ${index > 0 && index < versions.length - 1 ? `
                                    <button class="btn btn-sm btn-secondary" onclick="compareVersions('${versions[index - 1].id}', '${ver.id}')">
                                        对比
                                    </button>
                                ` : ''}
                            </div>
                        </div>
                    `).join('')}
                </div>
            ` : '<p style="text-align: center; color: #9CA3AF; padding: 20px;">暂无版本历史</p>'}
        </div>
    `;

    Modal.alert({
        title: `版本历史 - ${job.jobName}`,
        content: content,
        width: '600px'
    });
}

/**
 * 回退到指定版本
 */
function rollbackToVersion(jobId, versionId) {
    Modal.confirm({
        title: '确认回退',
        content: '确定要回退到此版本吗？当前配置将被覆盖。',
        onConfirm: () => {
            const result = window.etlService.rollbackVersion(jobId, versionId);
            if (result.success) {
                Toast.success('版本回退成功');
                loadJobs();
                // 关闭版本历史模态框
                const overlay = document.querySelector('.modal-overlay');
                if (overlay) overlay.style.display = 'none';
            } else {
                Toast.error(result.error || '回退失败');
            }
        }
    });
}

/**
 * 比较版本
 */
function compareVersions(versionId1, versionId2) {
    const result = window.etlService.compareVersions(versionId1, versionId2);
    
    if (!result.success) {
        Toast.error(result.error || '比较失败');
        return;
    }

    const differences = result.data;
    const hasChanges = differences.sourceConfig.length > 0 || 
                       differences.transformRules.length > 0 || 
                       differences.targetConfig.length > 0;

    const content = `
        <div style="padding: 16px;">
            ${hasChanges ? `
                ${differences.sourceConfig.length > 0 ? `
                    <div style="margin-bottom: 20px;">
                        <h4>数据源配置变更</h4>
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>字段</th>
                                    <th>旧值</th>
                                    <th>新值</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${differences.sourceConfig.map(change => `
                                    <tr>
                                        <td>${change.field}</td>
                                        <td>${JSON.stringify(change.oldValue)}</td>
                                        <td>${JSON.stringify(change.newValue)}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                ` : ''}

                ${differences.transformRules.length > 0 ? `
                    <div style="margin-bottom: 20px;">
                        <h4>转换规则变更</h4>
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>字段</th>
                                    <th>旧值</th>
                                    <th>新值</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${differences.transformRules.map(change => `
                                    <tr>
                                        <td>${change.field}</td>
                                        <td>${JSON.stringify(change.oldValue)}</td>
                                        <td>${JSON.stringify(change.newValue)}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                ` : ''}

                ${differences.targetConfig.length > 0 ? `
                    <div style="margin-bottom: 20px;">
                        <h4>目标配置变更</h4>
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>字段</th>
                                    <th>旧值</th>
                                    <th>新值</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${differences.targetConfig.map(change => `
                                    <tr>
                                        <td>${change.field}</td>
                                        <td>${JSON.stringify(change.oldValue)}</td>
                                        <td>${JSON.stringify(change.newValue)}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                ` : ''}
            ` : '<p style="text-align: center; color: #9CA3AF; padding: 20px;">两个版本没有差异</p>'}
        </div>
    `;

    Modal.alert({
        title: '版本对比',
        content: content,
        width: '800px'
    });
}

/**
 * 打开ETL设计器
 */
function openDesigner(jobId) {
    const job = window.etlService.getById(jobId);
    if (!job) {
        Toast.error('作业不存在');
        return;
    }

    currentDesignerJob = job;
    
    // 显示设计器模态框
    document.getElementById('designerModal').style.display = 'flex';
    
    // 初始化设计器
    initETLDesigner(job);
}

/**
 * 关闭设计器模态框
 */
function closeDesignerModal() {
    document.getElementById('designerModal').style.display = 'none';
    currentDesignerJob = null;
}

/**
 * 初始化ETL设计器
 */
function initETLDesigner(job) {
    const designerContainer = document.getElementById('etlDesigner');
    
    designerContainer.innerHTML = `
        <div class="designer-toolbar">
            <h4>组件库</h4>
            <div class="component-panel">
                <div class="component-item" draggable="true" data-type="source">
                    <span class="icon">📥</span>
                    <span class="label">数据源</span>
                </div>
                <div class="component-item" draggable="true" data-type="filter">
                    <span class="icon">🔍</span>
                    <span class="label">数据过滤</span>
                </div>
                <div class="component-item" draggable="true" data-type="map">
                    <span class="icon">🔄</span>
                    <span class="label">字段映射</span>
                </div>
                <div class="component-item" draggable="true" data-type="calculate">
                    <span class="icon">🧮</span>
                    <span class="label">计算字段</span>
                </div>
                <div class="component-item" draggable="true" data-type="split">
                    <span class="icon">✂️</span>
                    <span class="label">字段拆分</span>
                </div>
                <div class="component-item" draggable="true" data-type="merge">
                    <span class="icon">🔗</span>
                    <span class="label">字段合并</span>
                </div>
                <div class="component-item" draggable="true" data-type="target">
                    <span class="icon">📤</span>
                    <span class="label">目标表</span>
                </div>
            </div>
        </div>
        
        <div class="designer-canvas">
            <div class="canvas-grid" id="canvasGrid">
                <div class="canvas-empty">
                    <div class="icon">🎨</div>
                    <p>从左侧拖拽组件到画布开始设计</p>
                    <p style="font-size: 12px; margin-top: 8px;">或者点击"加载现有配置"</p>
                </div>
            </div>
        </div>
        
        <div class="designer-properties">
            <h4>属性面板</h4>
            <div id="propertiesPanel">
                <p style="color: #9CA3AF; text-align: center; padding: 20px;">
                    选择一个组件查看属性
                </p>
            </div>
        </div>
    `;

    // 设置拖拽事件
    setupDesignerDragDrop();
    
    // 如果作业有转换规则，加载到画布
    if (job.transformRules && job.transformRules.length > 0) {
        loadTransformRulesToCanvas(job.transformRules);
    }
}

/**
 * 设置设计器拖拽功能
 */
function setupDesignerDragDrop() {
    const componentItems = document.querySelectorAll('.component-item');
    const canvas = document.getElementById('canvasGrid');
    
    componentItems.forEach(item => {
        item.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('componentType', item.dataset.type);
        });
    });

    canvas.addEventListener('dragover', (e) => {
        e.preventDefault();
    });

    canvas.addEventListener('drop', (e) => {
        e.preventDefault();
        const componentType = e.dataTransfer.getData('componentType');
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        addNodeToCanvas(componentType, x, y);
    });
}

/**
 * 添加节点到画布
 */
function addNodeToCanvas(type, x, y) {
    const canvas = document.getElementById('canvasGrid');
    const empty = canvas.querySelector('.canvas-empty');
    if (empty) empty.remove();

    const nodeId = 'node_' + Date.now();
    const node = document.createElement('div');
    node.className = 'designer-node';
    node.id = nodeId;
    node.style.left = x + 'px';
    node.style.top = y + 'px';

    const nodeConfig = getNodeConfig(type);
    
    node.innerHTML = `
        <div class="node-header">
            <span class="node-icon">${nodeConfig.icon}</span>
            <span class="node-title">${nodeConfig.title}</span>
            <button class="node-delete" onclick="deleteNode('${nodeId}')">×</button>
        </div>
        <div class="node-content">${nodeConfig.description}</div>
        <div class="node-port input"></div>
        <div class="node-port output"></div>
    `;

    canvas.appendChild(node);

    // 使节点可拖动
    makeNodeDraggable(node);
    
    // 点击节点显示属性
    node.addEventListener('click', () => {
        selectNode(nodeId, type);
    });

    Toast.success('组件已添加');
}

/**
 * 获取节点配置
 */
function getNodeConfig(type) {
    const configs = {
        source: { icon: '📥', title: '数据源', description: '从数据源读取数据' },
        filter: { icon: '🔍', title: '数据过滤', description: '根据条件过滤数据' },
        map: { icon: '🔄', title: '字段映射', description: '映射字段名称' },
        calculate: { icon: '🧮', title: '计算字段', description: '计算新字段' },
        split: { icon: '✂️', title: '字段拆分', description: '拆分字段值' },
        merge: { icon: '🔗', title: '字段合并', description: '合并多个字段' },
        target: { icon: '📤', title: '目标表', description: '写入目标表' }
    };
    return configs[type] || { icon: '❓', title: '未知', description: '' };
}

/**
 * 使节点可拖动
 */
function makeNodeDraggable(node) {
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;

    node.addEventListener('mousedown', (e) => {
        if (e.target.classList.contains('node-delete')) return;
        
        isDragging = true;
        initialX = e.clientX - node.offsetLeft;
        initialY = e.clientY - node.offsetTop;
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        
        e.preventDefault();
        currentX = e.clientX - initialX;
        currentY = e.clientY - initialY;
        
        node.style.left = currentX + 'px';
        node.style.top = currentY + 'px';
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });
}

/**
 * 选择节点
 */
function selectNode(nodeId, type) {
    // 移除其他节点的选中状态
    document.querySelectorAll('.designer-node').forEach(n => {
        n.classList.remove('selected');
    });

    // 选中当前节点
    const node = document.getElementById(nodeId);
    if (node) {
        node.classList.add('selected');
        showNodeProperties(nodeId, type);
    }
}

/**
 * 显示节点属性
 */
function showNodeProperties(nodeId, type) {
    const panel = document.getElementById('propertiesPanel');
    
    let propertiesHTML = `
        <div class="property-group">
            <label class="property-label">节点ID</label>
            <input type="text" class="property-input" value="${nodeId}" readonly>
        </div>
    `;

    // 根据类型显示不同的属性
    switch (type) {
        case 'filter':
            propertiesHTML += `
                <div class="property-group">
                    <label class="property-label">过滤条件</label>
                    <textarea class="property-input" rows="3" placeholder="例如: value > 100"></textarea>
                </div>
            `;
            break;
        case 'map':
            propertiesHTML += `
                <div class="property-group">
                    <label class="property-label">源字段</label>
                    <input type="text" class="property-input" placeholder="source_field">
                </div>
                <div class="property-group">
                    <label class="property-label">目标字段</label>
                    <input type="text" class="property-input" placeholder="target_field">
                </div>
            `;
            break;
        case 'calculate':
            propertiesHTML += `
                <div class="property-group">
                    <label class="property-label">目标字段</label>
                    <input type="text" class="property-input" placeholder="new_field">
                </div>
                <div class="property-group">
                    <label class="property-label">计算表达式</label>
                    <textarea class="property-input" rows="3" placeholder="例如: value * 1.1"></textarea>
                </div>
            `;
            break;
    }

    panel.innerHTML = propertiesHTML;
}

/**
 * 删除节点
 */
function deleteNode(nodeId) {
    const node = document.getElementById(nodeId);
    if (node) {
        node.remove();
        
        // 如果画布为空，显示空状态
        const canvas = document.getElementById('canvasGrid');
        if (canvas.querySelectorAll('.designer-node').length === 0) {
            canvas.innerHTML = `
                <div class="canvas-empty">
                    <div class="icon">🎨</div>
                    <p>从左侧拖拽组件到画布开始设计</p>
                </div>
            `;
        }
    }
}

/**
 * 加载转换规则到画布
 */
function loadTransformRulesToCanvas(rules) {
    // 简化实现：显示规则列表而不是可视化节点
    Toast.info('当前作业有 ' + rules.length + ' 条转换规则');
}

/**
 * 保存设计
 */
function saveDesign() {
    if (!currentDesignerJob) {
        Toast.error('没有选中的作业');
        return;
    }

    // 收集画布上的节点并转换为转换规则
    const nodes = document.querySelectorAll('.designer-node');
    const transformRules = [];

    // 简化实现：这里应该根据节点生成实际的转换规则
    // 目前只是一个占位实现
    
    Toast.success('设计已保存');
    closeDesignerModal();
}

/**
 * 刷新作业列表
 */
function refreshJobList() {
    loadJobs();
    Toast.success('列表已刷新');
}

/**
 * 应用筛选
 */
function applyFilters() {
    loadJobs();
}

/**
 * 重置筛选
 */
function resetFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('statusFilter').value = '';
    document.getElementById('enabledFilter').value = '';
    loadJobs();
}
