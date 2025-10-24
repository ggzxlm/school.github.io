// 整改管理页面脚本

// 模拟整改任务数据
const mockRectifications = [
    {
        id: 'ZG2025001',
        title: '科研经费报销不规范问题整改',
        department: '科研处',
        responsible: '张三',
        deadline: '2025-11-30',
        progress: 75,
        status: 'in_progress',
        createdAt: '2025-10-01',
        description: '科研项目经费报销存在票据不规范、审批流程不完整等问题，需要完善相关制度并整改。',
        measures: '1. 修订科研经费管理办法\n2. 加强财务人员培训\n3. 完善审批流程\n4. 建立定期检查机制',
        metrics: [
            { label: '制度修订', value: '已完成', target: '1项', status: 'completed' },
            { label: '人员培训', value: '80%', target: '100%', status: 'in_progress' },
            { label: '流程优化', value: '已完成', target: '1项', status: 'completed' }
        ],
        timeline: [
            { date: '2025-10-01', title: '整改任务下达', desc: '纪检部门下达整改通知', status: 'completed' },
            { date: '2025-10-15', title: '制定整改方案', desc: '科研处提交整改方案', status: 'completed' },
            { date: '2025-10-30', title: '制度修订完成', desc: '完成科研经费管理办法修订', status: 'completed' },
            { date: '2025-11-15', title: '人员培训进行中', desc: '已完成80%的财务人员培训', status: 'in_progress' }
        ],
        evidences: [
            { name: '科研经费管理办法（修订版）.pdf', size: '2.3 MB', uploadDate: '2025-10-30', type: 'pdf' },
            { name: '培训签到表.xlsx', size: '156 KB', uploadDate: '2025-11-10', type: 'excel' }
        ]
    },
    {
        id: 'ZG2025002',
        title: '固定资产管理不规范整改',
        department: '资产处',
        responsible: '李四',
        deadline: '2025-10-25',
        progress: 100,
        status: 'completed',
        createdAt: '2025-09-01',
        description: '固定资产账实不符，需要全面清查并建立管理制度。',
        measures: '1. 开展资产清查\n2. 建立资产管理制度\n3. 配备资产管理员',
        metrics: [
            { label: '资产清查', value: '已完成', target: '100%', status: 'completed' },
            { label: '制度建立', value: '已完成', target: '1项', status: 'completed' }
        ],
        timeline: [
            { date: '2025-09-01', title: '整改任务下达', desc: '审计部门下达整改通知', status: 'completed' },
            { date: '2025-09-15', title: '资产清查完成', desc: '完成全校资产清查', status: 'completed' },
            { date: '2025-10-10', title: '制度建立', desc: '建立资产管理制度', status: 'completed' },
            { date: '2025-10-25', title: '整改完成', desc: '整改任务全部完成', status: 'completed' }
        ],
        evidences: [
            { name: '资产清查报告.pdf', size: '3.5 MB', uploadDate: '2025-09-20', type: 'pdf' },
            { name: '资产管理制度.docx', size: '245 KB', uploadDate: '2025-10-10', type: 'word' }
        ]
    }
];

let currentPage = 1;
let pageSize = 10;
let filteredData = [...mockRectifications];
let currentRectification = null;
let currentTab = 'plan';

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('整改管理页面初始化...');
    console.log('模拟数据数量:', mockRectifications.length);
    initializePage();
});

// 初始化页面
function initializePage() {
    // 初始化模态框为隐藏状态
    const detailModal = document.getElementById('detailModal');
    if (detailModal) {
        detailModal.style.display = 'none';
    }
    
    const uploadModal = document.getElementById('uploadModal');
    if (uploadModal) {
        uploadModal.style.display = 'none';
    }
    
    updateDashboard();
    renderTable();
    bindEvents();
}

// 更新看板数据
function updateDashboard() {
    const total = mockRectifications.length;
    const inProgress = mockRectifications.filter(r => r.status === 'in_progress' || r.status === 'review').length;
    const completed = mockRectifications.filter(r => r.status === 'completed').length;
    const overdue = mockRectifications.filter(r => {
        if (r.status === 'completed') return false;
        return new Date(r.deadline) < new Date();
    }).length;
    
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    document.getElementById('totalCount').textContent = total;
    document.getElementById('inProgressCount').textContent = inProgress;
    document.getElementById('completedCount').textContent = completed;
    document.getElementById('overdueCount').textContent = overdue;
    document.getElementById('completionRate').textContent = completionRate + '%';
}

// 渲染表格
function renderTable() {
    const tbody = document.getElementById('taskTableBody');
    if (!tbody) {
        console.error('找不到表格元素 taskTableBody');
        return;
    }
    console.log('渲染表格，数据数量:', filteredData.length);
    
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    const pageData = filteredData.slice(start, end);
    
    if (pageData.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" style="text-align: center; padding: 40px; color: var(--color-gray-500);">
                    <i class="fas fa-inbox" style="font-size: 48px; margin-bottom: 16px; display: block;"></i>
                    <p>暂无整改任务</p>
                </td>
            </tr>
        `;
        updatePagination();
        return;
    }
    
    tbody.innerHTML = pageData.map(item => {
        const isOverdue = new Date(item.deadline) < new Date() && item.status !== 'completed';
        const progressClass = item.progress >= 80 ? 'high' : item.progress >= 50 ? 'medium' : 'low';
        
        const statusMap = {
            'pending': { text: '待整改', class: 'status-pending' },
            'in_progress': { text: '整改中', class: 'status-in-progress' },
            'review': { text: '待复查', class: 'status-review' },
            'completed': { text: '已完成', class: 'status-completed' },
            'overdue': { text: '超期', class: 'status-overdue' }
        };
        
        const status = statusMap[item.status] || statusMap['pending'];
        
        return `
            <tr>
                <td>${item.id}</td>
                <td>${item.title}</td>
                <td>${item.department}</td>
                <td>${item.responsible}</td>
                <td ${isOverdue ? 'class="overdue-text"' : ''}>
                    ${isOverdue ? '<i class="fas fa-exclamation-triangle"></i>' : ''}
                    ${item.deadline}
                </td>
                <td>
                    <div class="progress-container">
                        <div class="progress-bar-wrapper">
                            <div class="progress-bar ${progressClass}" style="width: ${item.progress}%"></div>
                        </div>
                        <span class="progress-text">${item.progress}%</span>
                    </div>
                </td>
                <td>
                    <span class="status-badge ${status.class}">${status.text}</span>
                </td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="viewDetail('${item.id}')">
                        <i class="fas fa-eye"></i> 查看详情
                    </button>
                    <button class="btn btn-sm btn-secondary" onclick="uploadEvidence('${item.id}')">
                        <i class="fas fa-upload"></i> 上传佐证
                    </button>
                </td>
            </tr>
        `;
    }).join('');
    
    updatePagination();
}

// 更新分页
function updatePagination() {
    const total = filteredData.length;
    const totalPages = Math.ceil(total / pageSize);
    const start = (currentPage - 1) * pageSize + 1;
    const end = Math.min(currentPage * pageSize, total);
    
    document.getElementById('pageStart').textContent = total > 0 ? start : 0;
    document.getElementById('pageEnd').textContent = end;
    document.getElementById('totalItems').textContent = total;
    
    // 更新页码按钮
    const pagesContainer = document.getElementById('paginationPages');
    if (!pagesContainer) return;
    
    let pagesHTML = '';
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
            pagesHTML += `
                <button class="btn btn-sm ${i === currentPage ? 'active' : ''}" onclick="goToPage(${i})">
                    ${i}
                </button>
            `;
        } else if (i === currentPage - 2 || i === currentPage + 2) {
            pagesHTML += '<span style="padding: 0 8px;">...</span>';
        }
    }
    pagesContainer.innerHTML = pagesHTML;
    
    // 更新上一页/下一页按钮状态
    const prevBtn = document.getElementById('prevPage');
    const nextBtn = document.getElementById('nextPage');
    if (prevBtn) prevBtn.disabled = currentPage === 1;
    if (nextBtn) nextBtn.disabled = currentPage === totalPages || totalPages === 0;
}

// 绑定事件
function bindEvents() {
    // 搜索
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', Utils.debounce(function(e) {
            filterData();
        }, 300));
    }
    
    // 筛选器
    const statusFilter = document.getElementById('statusFilter');
    const unitFilter = document.getElementById('unitFilter');
    
    if (statusFilter) statusFilter.addEventListener('change', filterData);
    if (unitFilter) unitFilter.addEventListener('change', filterData);
}

// 筛选数据
function filterData() {
    const searchText = document.getElementById('searchInput')?.value.toLowerCase() || '';
    const statusValue = document.getElementById('statusFilter')?.value || '';
    const unitValue = document.getElementById('unitFilter')?.value || '';
    
    filteredData = mockRectifications.filter(item => {
        const matchSearch = !searchText || 
            item.id.toLowerCase().includes(searchText) ||
            item.title.toLowerCase().includes(searchText) ||
            item.responsible.toLowerCase().includes(searchText);
        
        const matchStatus = !statusValue || item.status === statusValue;
        const matchUnit = !unitValue || item.department === unitValue;
        
        return matchSearch && matchStatus && matchUnit;
    });
    
    currentPage = 1;
    renderTable();
}

// 重置筛选
function resetFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('statusFilter').value = '';
    document.getElementById('unitFilter').value = '';
    filterData();
}

// 分页函数
function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        renderTable();
    }
}

function nextPage() {
    const totalPages = Math.ceil(filteredData.length / pageSize);
    if (currentPage < totalPages) {
        currentPage++;
        renderTable();
    }
}

function goToPage(page) {
    currentPage = page;
    renderTable();
}

// 查看详情
function viewDetail(id) {
    currentRectification = mockRectifications.find(r => r.id === id);
    if (!currentRectification) return;
    
    // 填充基本信息
    document.getElementById('detailTaskNo').textContent = currentRectification.id;
    document.getElementById('detailUnit').textContent = currentRectification.department;
    document.getElementById('detailPerson').textContent = currentRectification.responsible;
    document.getElementById('detailCreateTime').textContent = currentRectification.createdAt;
    document.getElementById('detailDeadline').textContent = currentRectification.deadline;
    
    // 状态
    const statusMap = {
        'pending': '待整改',
        'in_progress': '整改中',
        'review': '待复查',
        'completed': '已完成'
    };
    document.getElementById('detailStatus').innerHTML = `<span class="status-badge status-${currentRectification.status}">${statusMap[currentRectification.status]}</span>`;
    
    // 进度
    const progressClass = currentRectification.progress >= 80 ? 'high' : currentRectification.progress >= 50 ? 'medium' : 'low';
    document.getElementById('detailProgress').className = `progress-bar ${progressClass}`;
    document.getElementById('detailProgress').style.width = currentRectification.progress + '%';
    document.getElementById('detailProgressText').textContent = currentRectification.progress + '%';
    
    // 整改计划
    document.getElementById('detailProblem').textContent = currentRectification.description || '-';
    document.getElementById('detailMeasures').textContent = currentRectification.measures || '-';
    
    // 显示模态框
    const modal = document.getElementById('detailModal');
    modal.style.display = 'flex';
    setTimeout(() => {
        modal.classList.add('modal-show');
    }, 10);
    switchTab('plan');
}

// 关闭详情模态框
function closeDetailModal() {
    const modal = document.getElementById('detailModal');
    modal.classList.remove('modal-show');
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
}

// 切换标签页
function switchTab(tabName) {
    currentTab = tabName;
    
    // 更新标签页激活状态
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // 更新内容显示
    document.querySelectorAll('.tab-pane').forEach(pane => {
        pane.classList.remove('active');
    });
    document.getElementById(`tab-${tabName}`).classList.add('active');
    
    // 加载对应内容
    if (tabName === 'indicators' && currentRectification) {
        loadIndicators();
    } else if (tabName === 'timeline' && currentRectification) {
        loadTimeline();
    } else if (tabName === 'evidence' && currentRectification) {
        loadEvidence();
    }
}

// 加载量化指标
function loadIndicators() {
    const container = document.getElementById('indicatorsList');
    if (!currentRectification || !currentRectification.metrics) {
        container.innerHTML = '<p style="text-align: center; color: var(--color-gray-500);">暂无量化指标</p>';
        return;
    }
    
    container.innerHTML = currentRectification.metrics.map(metric => `
        <div class="indicator-card">
            <h4>${metric.label}</h4>
            <div class="indicator-values">
                <span>当前值:</span>
                <strong>${metric.value}</strong>
            </div>
            <div class="indicator-values">
                <span>目标值:</span>
                <strong>${metric.target}</strong>
            </div>
            <div class="indicator-status ${metric.status}">
                <i class="fas fa-${metric.status === 'completed' ? 'check-circle' : 'clock'}"></i>
                ${metric.status === 'completed' ? '已完成' : '进行中'}
            </div>
        </div>
    `).join('');
}

// 加载时间轴
function loadTimeline() {
    const container = document.getElementById('timelineList');
    if (!currentRectification || !currentRectification.timeline) {
        container.innerHTML = '<p style="text-align: center; color: var(--color-gray-500);">暂无时间轴记录</p>';
        return;
    }
    
    container.innerHTML = currentRectification.timeline.map(item => `
        <div class="timeline-item ${item.status}">
            <div class="timeline-dot"></div>
            <div class="timeline-content">
                <h4>${item.title}</h4>
                <div class="timeline-time">${item.date}</div>
                <div class="timeline-description">${item.desc}</div>
            </div>
        </div>
    `).join('');
}

// 加载佐证材料
function loadEvidence() {
    const container = document.getElementById('evidenceList');
    if (!currentRectification || !currentRectification.evidences || currentRectification.evidences.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--color-gray-500);">暂无佐证材料</p>';
        return;
    }
    
    container.innerHTML = currentRectification.evidences.map(file => {
        const iconMap = {
            'pdf': 'fa-file-pdf',
            'word': 'fa-file-word',
            'excel': 'fa-file-excel',
            'image': 'fa-file-image'
        };
        const icon = iconMap[file.type] || 'fa-file';
        
        return `
            <div class="evidence-item">
                <div class="evidence-icon">
                    <i class="fas ${icon}"></i>
                </div>
                <div class="evidence-name">${file.name}</div>
                <div class="evidence-meta">${file.size} · ${file.uploadDate}</div>
                <div class="evidence-actions">
                    <button class="btn btn-sm btn-secondary">
                        <i class="fas fa-eye"></i> 预览
                    </button>
                    <button class="btn btn-sm btn-primary">
                        <i class="fas fa-download"></i> 下载
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// 上传佐证
function uploadEvidence(id) {
    currentRectification = mockRectifications.find(r => r.id === id);
    const modal = document.getElementById('uploadModal');
    modal.style.display = 'flex';
    setTimeout(() => {
        modal.classList.add('modal-show');
    }, 10);
}

// 关闭上传模态框
function closeUploadModal() {
    const modal = document.getElementById('uploadModal');
    modal.classList.remove('modal-show');
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
    document.getElementById('evidenceDescription').value = '';
}

// 提交佐证
function submitEvidence() {
    const description = document.getElementById('evidenceDescription').value;
    if (!description) {
        Toast.warning('请输入材料说明');
        return;
    }
    
    Toast.success('佐证材料上传成功');
    closeUploadModal();
    
    // 更新进度
    if (currentRectification) {
        currentRectification.progress = Math.min(100, currentRectification.progress + 10);
        renderTable();
    }
}

// 复查任务
function reviewTask() {
    if (!currentRectification) return;
    
    Modal.show({
        title: '确认复查',
        content: '<p>确认通过复查吗？</p>',
        buttons: [
            { text: '取消', type: 'default', onClick: () => Modal.hide() },
            { 
                text: '确认', 
                type: 'primary', 
                onClick: () => {
                    Toast.success('复查通过');
                    Modal.hide();
                    closeDetailModal();
                }
            }
        ]
    });
}

// 销号归档
function closeTask() {
    if (!currentRectification) return;
    
    Modal.show({
        title: '确认销号',
        content: '<p>确认销号归档吗？此操作不可撤销。</p>',
        buttons: [
            { text: '取消', type: 'default', onClick: () => Modal.hide() },
            { 
                text: '确认', 
                type: 'danger', 
                onClick: () => {
                    currentRectification.status = 'completed';
                    currentRectification.progress = 100;
                    Toast.success('已销号归档');
                    Modal.hide();
                    closeDetailModal();
                    renderTable();
                    updateDashboard();
                }
            }
        ]
    });
}

// 导出数据
function exportData() {
    const filteredData = getFilteredData();
    
    if (filteredData.length === 0) {
        Toast.warning('没有可导出的数据');
        return;
    }
    
    // 创建CSV内容
    const headers = ['整改编号', '责任单位', '责任人', '整改内容', '状态', '进度', '创建时间', '截止时间'];
    const statusMap = {
        'pending': '待整改',
        'in_progress': '整改中',
        'review': '待复查',
        'completed': '已完成'
    };
    
    const rows = filteredData.map(item => [
        item.id,
        item.department,
        item.responsible,
        item.description || '-',
        statusMap[item.status] || item.status,
        item.progress + '%',
        item.createdAt,
        item.deadline
    ]);
    
    const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
    
    // 创建下载链接
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `整改管理数据_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    
    Toast.success(`已导出 ${filteredData.length} 条数据`);
}

// 刷新数据
function refreshData() {
    filterData();
    Toast.success('数据已刷新');
}
