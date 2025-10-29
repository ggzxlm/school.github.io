// 整改归档查询页面脚本

// 从整改管理页面导入已归档的数据
// 实际应用中应该从后端API获取
let archivedRectifications = [];

let currentPage = 1;
let pageSize = 10;
let filteredData = [];
let currentArchive = null;

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('整改归档查询页面初始化...');
    loadArchivedData();
    initializePage();
});

// 加载归档数据
function loadArchivedData() {
    // 从 localStorage 获取整改数据（模拟）
    // 实际应用中应该调用后端API
    
    // 模拟已归档的整改数据
    archivedRectifications = [
        {
            id: 'ZG2025002',
            title: '固定资产管理不规范整改',
            department: '资产处',
            responsible: '李四',
            createdAt: '2025-09-01',
            completedAt: '2025-10-25',
            archivedAt: '2025-10-25',
            duration: 54, // 整改周期（天）
            source: '工单 WO202509150001',
            sourceType: '审计核查',
            description: '年度资产盘点发现部分设备账实不符，存在资产管理混乱、台账不清等问题。',
            measures: '1. 开展全校固定资产清查\n2. 建立固定资产管理制度\n3. 配备专职资产管理员\n4. 引入资产管理系统\n5. 建立资产定期盘点机制',
            achievements: [
                { item: '资产清查', result: '完成全校固定资产清查，核实账实差异' },
                { item: '制度建立', result: '制定《固定资产管理办法》并发布实施' },
                { item: '人员配备', result: '招聘并配备3名专职资产管理员' },
                { item: '系统上线', result: '资产管理系统正式上线运行' }
            ],
            evidences: [
                { name: '资产清查报告.pdf', size: '3.5 MB', uploadDate: '2025-09-20' },
                { name: '资产管理制度.docx', size: '245 KB', uploadDate: '2025-10-10' },
                { name: '整改验收报告.pdf', size: '1.8 MB', uploadDate: '2025-10-25' }
            ]
        }
    ];
    
    filteredData = [...archivedRectifications];
}

// 初始化页面
function initializePage() {
    try {
        // 初始化模态框为隐藏状态
        const detailModal = document.getElementById('archiveDetailModal');
        if (detailModal) {
            detailModal.style.display = 'none';
        }
        
        updateDashboard();
        renderTable();
        bindEvents();
        
        console.log('归档查询页面初始化成功');
    } catch (error) {
        console.error('初始化失败:', error);
        showToast('页面初始化失败: ' + error.message, 'error');
    }
}

// 更新看板数据
function updateDashboard() {
    const total = archivedRectifications.length;
    
    // 本年度归档
    const currentYear = new Date().getFullYear();
    const thisYear = archivedRectifications.filter(r => {
        return r.archivedAt && r.archivedAt.startsWith(currentYear.toString());
    }).length;
    
    // 本月归档
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
    const thisMonth = archivedRectifications.filter(r => {
        return r.archivedAt && r.archivedAt.startsWith(currentMonth);
    }).length;
    
    // 平均整改周期
    const totalDuration = archivedRectifications.reduce((sum, r) => sum + (r.duration || 0), 0);
    const avgDuration = total > 0 ? Math.round(totalDuration / total) : 0;
    
    document.getElementById('totalArchived').textContent = total;
    document.getElementById('thisYearArchived').textContent = thisYear;
    document.getElementById('thisMonthArchived').textContent = thisMonth;
    document.getElementById('avgDuration').textContent = avgDuration;
}

// 渲染表格
function renderTable() {
    try {
        const tbody = document.getElementById('archiveTableBody');
        if (!tbody) {
            console.error('找不到表格元素 archiveTableBody');
            return;
        }
        
        const start = (currentPage - 1) * pageSize;
        const end = start + pageSize;
        const pageData = filteredData.slice(start, end);
    
    if (pageData.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" style="text-align: center; padding: 40px; color: var(--color-gray-500);">
                    <i class="fas fa-inbox" style="font-size: 48px; margin-bottom: 16px; display: block;"></i>
                    <p>暂无归档记录</p>
                </td>
            </tr>
        `;
        updatePagination();
        return;
    }
    
        tbody.innerHTML = pageData.map(item => {
            return `
                <tr>
                    <td>${item.id}</td>
                    <td>${item.title}</td>
                    <td>${item.department}</td>
                    <td>${item.responsible}</td>
                    <td>${item.createdAt}</td>
                    <td>${item.archivedAt || item.completedAt}</td>
                    <td>${item.duration || '-'} 天</td>
                    <td>
                        <button class="btn btn-sm btn-primary" onclick="viewArchiveDetail('${item.id}')">
                            <i class="fas fa-eye"></i> 查看详情
                        </button>
                        <button class="btn btn-sm btn-secondary" onclick="downloadReport('${item.id}')">
                            <i class="fas fa-download"></i> 下载
                        </button>
                    </td>
                </tr>
            `;
        }).join('');
        
        updatePagination();
    } catch (error) {
        console.error('渲染表格失败:', error);
        if (tbody) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="8" style="text-align: center; padding: 40px; color: #ef4444;">
                        <i class="fas fa-exclamation-triangle"></i>
                        <p>渲染失败: ${error.message}</p>
                    </td>
                </tr>
            `;
        }
    }
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
        searchInput.addEventListener('input', function(e) {
            setTimeout(filterData, 300);
        });
    }
    
    // 筛选器
    const yearFilter = document.getElementById('yearFilter');
    const unitFilter = document.getElementById('unitFilter');
    const sourceFilter = document.getElementById('sourceFilter');
    
    if (yearFilter) yearFilter.addEventListener('change', filterData);
    if (unitFilter) unitFilter.addEventListener('change', filterData);
    if (sourceFilter) sourceFilter.addEventListener('change', filterData);
}

// 筛选数据
function filterData() {
    const searchText = document.getElementById('searchInput')?.value.toLowerCase() || '';
    const yearValue = document.getElementById('yearFilter')?.value || '';
    const unitValue = document.getElementById('unitFilter')?.value || '';
    const sourceValue = document.getElementById('sourceFilter')?.value || '';
    
    filteredData = archivedRectifications.filter(item => {
        const matchSearch = !searchText || 
            item.id.toLowerCase().includes(searchText) ||
            item.title.toLowerCase().includes(searchText) ||
            item.responsible.toLowerCase().includes(searchText);
        
        const matchYear = !yearValue || (item.archivedAt && item.archivedAt.startsWith(yearValue));
        const matchUnit = !unitValue || item.department === unitValue;
        const matchSource = !sourceValue || item.sourceType === sourceValue;
        
        return matchSearch && matchYear && matchUnit && matchSource;
    });
    
    currentPage = 1;
    renderTable();
}

// 重置筛选
function resetFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('yearFilter').value = '';
    document.getElementById('unitFilter').value = '';
    document.getElementById('sourceFilter').value = '';
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

// 查看归档详情
function viewArchiveDetail(id) {
    currentArchive = archivedRectifications.find(r => r.id === id);
    if (!currentArchive) return;
    
    // 填充基本信息
    document.getElementById('detailTaskNo').textContent = currentArchive.id;
    document.getElementById('detailUnit').textContent = currentArchive.department;
    document.getElementById('detailPerson').textContent = currentArchive.responsible;
    document.getElementById('detailCreateTime').textContent = currentArchive.createdAt;
    document.getElementById('detailArchiveTime').textContent = currentArchive.archivedAt || currentArchive.completedAt;
    document.getElementById('detailDuration').textContent = (currentArchive.duration || '-') + ' 天';
    document.getElementById('detailSource').textContent = currentArchive.source;
    
    // 整改内容
    document.getElementById('detailProblem').textContent = currentArchive.description || '-';
    document.getElementById('detailMeasures').textContent = currentArchive.measures || '-';
    
    // 整改成果
    const achievementsContainer = document.getElementById('achievementsList');
    if (currentArchive.achievements && currentArchive.achievements.length > 0) {
        achievementsContainer.innerHTML = currentArchive.achievements.map(achievement => `
            <div style="padding: 12px; background: #f9fafb; border-radius: 6px; margin-bottom: 8px;">
                <div style="font-weight: 600; color: #1f2937; margin-bottom: 4px;">
                    <i class="fas fa-check-circle" style="color: #10b981; margin-right: 8px;"></i>
                    ${achievement.item}
                </div>
                <div style="color: #6b7280; font-size: 14px; margin-left: 28px;">
                    ${achievement.result}
                </div>
            </div>
        `).join('');
    } else {
        achievementsContainer.innerHTML = '<p style="text-align: center; color: #6b7280;">暂无整改成果记录</p>';
    }
    
    // 佐证材料
    const evidencesContainer = document.getElementById('evidencesList');
    if (currentArchive.evidences && currentArchive.evidences.length > 0) {
        evidencesContainer.innerHTML = currentArchive.evidences.map(file => `
            <div class="evidence-item">
                <div class="evidence-icon">
                    <i class="fas fa-file-pdf"></i>
                </div>
                <div class="evidence-name">${file.name}</div>
                <div class="evidence-meta">${file.size} · ${file.uploadDate}</div>
                <div class="evidence-actions">
                    <button class="btn btn-sm btn-secondary" onclick="previewFile('${file.name}')">
                        <i class="fas fa-eye"></i> 预览
                    </button>
                    <button class="btn btn-sm btn-primary" onclick="downloadFile('${file.name}')">
                        <i class="fas fa-download"></i> 下载
                    </button>
                </div>
            </div>
        `).join('');
    } else {
        evidencesContainer.innerHTML = '<p style="text-align: center; color: #6b7280;">暂无佐证材料</p>';
    }
    
    // 显示模态框
    const modal = document.getElementById('archiveDetailModal');
    modal.style.display = 'flex';
    setTimeout(() => {
        modal.classList.add('modal-show');
    }, 10);
}

// 关闭归档详情模态框
function closeArchiveDetailModal() {
    const modal = document.getElementById('archiveDetailModal');
    modal.classList.remove('modal-show');
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
}

// 下载归档报告
function downloadArchiveReport() {
    if (!currentArchive) return;
    showToast('正在生成归档报告...', 'info');
    setTimeout(() => {
        showToast('归档报告下载成功', 'success');
    }, 1000);
}

// 下载单个报告
function downloadReport(id) {
    showToast('正在下载归档报告...', 'info');
    setTimeout(() => {
        showToast('下载成功', 'success');
    }, 1000);
}

// 导出归档数据
function exportArchive() {
    showToast('正在导出归档数据...', 'info');
    setTimeout(() => {
        showToast(`已导出 ${filteredData.length} 条归档记录`, 'success');
    }, 1000);
}

// 刷新数据
function refreshData() {
    loadArchivedData();
    filterData();
    updateDashboard();
    showToast('数据已刷新', 'success');
}

// 预览文件
function previewFile(filename) {
    showToast('正在打开文件预览...', 'info');
}

// 下载文件
function downloadFile(filename) {
    showToast('文件下载中...', 'success');
}

// 显示提示消息
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
