/**
 * 数据查看页面脚本
 */

let currentDataType = 'raw'; // raw 或 cleaned
let currentTableId = null;
let currentPage = 1;
let pageSize = 20;
let searchTerm = '';

// 字段名中文映射
const fieldNameMap = {
    'id': 'ID',
    'name': '姓名',
    'id_card': '身份证号',
    'phone': '手机号',
    'email': '邮箱',
    'department': '部门',
    'position': '职位',
    'hire_date': '入职日期',
    'status': '状态',
    'created_at': '创建时间',
    'updated_at': '更新时间',
    'source_system': '来源系统',
    'source_id': '来源ID',
    'data_quality_score': '数据质量分数',
    'master_data_id': '主数据ID',
    'remarks': '备注',
    'credit_code': '统一社会信用代码',
    'legal_person': '法定代表人',
    'address': '地址',
    'capital': '注册资本(万元)',
    'establish_date': '成立日期',
    'project_name': '项目名称',
    'project_code': '项目编号',
    'amount': '金额(万元)',
    'method': '采购方式',
    'leader': '负责人',
    'start_date': '开始日期',
    'end_date': '结束日期',
    'supplier_id': '供应商ID',
    'budget': '预算(万元)',
    'actual_amount': '实际金额(万元)',
    'actual_expense': '实际支出(万元)',
    'voucher_no': '凭证号',
    'date': '日期',
    'account': '账户',
    'subject': '科目',
    'debit': '借方',
    'credit': '贷方',
    'balance': '余额',
    'project': '项目',
    'person': '经办人',
    'summary': '摘要',
    'auditor': '审核人',
    'audit_date': '审核日期',
    'progress': '进度(%)',
    'asset_name': '资产名称',
    'asset_code': '资产编号',
    'category': '类别',
    'purchase_date': '购置日期',
    'purchase_price': '购置价格(万元)',
    'custodian': '保管人',
    'location': '存放地点',
    'usage_rate': '使用率(%)',
    'last_check_date': '最后盘点日期',
    'appraisal_price': '评估价格(万元)',
    'contract_no': '合同编号',
    'contract_name': '合同名称',
    'sign_date': '签订日期',
    'person_in_charge': '负责人',
    'change_count': '变更次数',
    'student_name': '学生姓名',
    'admission_score': '录取分数',
    'major': '专业',
    'admission_type': '录取类型',
    'bonus_points': '加分',
    'province': '省份',
    'admission_date': '录取日期',
    'student_id': '学号',
    'aid_type': '资助类型',
    'academic_year': '学年',
    'issue_date': '发放日期',
    'person_id': '人员ID',
    'person_name': '人员姓名',
    'person_id_card': '人员身份证',
    'related_person_id': '关联人员ID',
    'related_person_name': '关联人员姓名',
    'related_person_id_card': '关联人员身份证',
    'relation_type': '关系类型',
    'verified': '已核实',
    'data_source': '数据来源',
    'company_id': '企业ID',
    'company_name': '企业名称',
    'company_credit_code': '企业信用代码',
    'equity_ratio': '持股比例(%)',
    'alert_type': '预警类型',
    'person_a_id': '人员A ID',
    'person_a_name': '人员A姓名',
    'person_a_role': '人员A角色',
    'person_b_id': '人员B ID',
    'person_b_name': '人员B姓名',
    'person_b_role': '人员B角色',
    'relation_path': '关系路径',
    'relation_depth': '关系层级',
    'risk_level': '风险等级',
    'confidence_score': '置信度分数',
    'related_procurement_id': '关联采购ID',
    'related_procurement_name': '关联采购项目',
    'procurement_amount': '采购金额(万元)',
    'alert_date': '预警日期',
    'verification_result': '核实结果'
};

/**
 * 获取字段的中文名称
 */
function getFieldDisplayName(fieldName) {
    return fieldNameMap[fieldName] || fieldName;
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    loadStatistics();
    loadTableList();
    bindEvents();
});

/**
 * 绑定事件
 */
function bindEvents() {
    // 搜索
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            searchTerm = this.value.trim();
            if (currentTableId) {
                currentPage = 1;
                loadTableData();
            }
        });
    }
}

/**
 * 加载统计信息
 */
function loadStatistics() {
    const stats = window.dataViewerService.getStatistics();
    
    document.getElementById('totalTables').textContent = stats.totalTables;
    document.getElementById('rawTables').textContent = stats.rawTables;
    document.getElementById('cleanedTables').textContent = stats.cleanedTables;
    document.getElementById('totalRecords').textContent = stats.totalRecords.toLocaleString();
}

/**
 * 切换数据类型
 */
function switchDataType(type) {
    currentDataType = type;
    currentTableId = null;
    currentPage = 1;
    searchTerm = '';
    
    // 更新标签按钮状态
    document.querySelectorAll('.data-type-tabs .tab-btn').forEach(btn => {
        if (btn.dataset.type === type) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // 重置搜索框
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.value = '';
    }
    
    // 加载表列表
    loadTableList();
    
    // 隐藏数据表格
    showEmptyState();
}

/**
 * 加载数据表列表
 */
function loadTableList() {
    const tables = window.dataViewerService.getTables(currentDataType);
    const select = document.getElementById('tableSelect');
    
    select.innerHTML = '<option value="">请选择数据表</option>' +
        tables.map(table => 
            `<option value="${table.id}">${table.displayName} (${table.recordCount.toLocaleString()} 条)</option>`
        ).join('');
}

/**
 * 加载表数据
 */
function loadTableData() {
    const select = document.getElementById('tableSelect');
    currentTableId = select.value;
    
    if (!currentTableId) {
        showEmptyState();
        return;
    }
    
    // 获取表信息
    const tableInfo = window.dataViewerService.getTableInfo(currentTableId);
    if (!tableInfo) {
        showEmptyState();
        return;
    }
    
    // 显示表信息
    document.getElementById('infoTableName').textContent = tableInfo.displayName;
    document.getElementById('infoRecordCount').textContent = tableInfo.recordCount.toLocaleString();
    document.getElementById('infoFieldCount').textContent = tableInfo.fieldCount;
    document.getElementById('infoLastUpdate').textContent = tableInfo.lastUpdate;
    document.getElementById('infoDataSource').textContent = tableInfo.dataSource;
    document.getElementById('infoCollectionTask').textContent = tableInfo.collectionTask;
    
    document.getElementById('tableInfo').style.display = 'block';
    
    // 获取表数据
    const result = window.dataViewerService.getTableData(currentTableId, currentPage, pageSize, searchTerm);
    
    // 渲染表格
    renderDataTable(tableInfo, result);
    
    // 显示表格
    document.getElementById('emptyState').style.display = 'none';
    document.getElementById('dataTableWrapper').style.display = 'block';
}

/**
 * 渲染数据表格
 */
function renderDataTable(tableInfo, result) {
    const thead = document.getElementById('dataTableHead');
    const tbody = document.getElementById('dataTableBody');
    
    // 渲染表头（使用中文）
    thead.innerHTML = `
        <tr>
            ${tableInfo.fields.map(field => `<th>${getFieldDisplayName(field)}</th>`).join('')}
            <th>操作</th>
        </tr>
    `;
    
    // 渲染数据行
    if (result.data.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="${tableInfo.fields.length + 1}" style="text-align: center; padding: 40px;">
                    <div style="color: #9CA3AF;">
                        <i class="fas fa-inbox" style="font-size: 32px; margin-bottom: 12px;"></i>
                        <p>暂无数据</p>
                    </div>
                </td>
            </tr>
        `;
    } else {
        tbody.innerHTML = result.data.map(record => `
            <tr onclick="viewRecordDetail('${currentTableId}', ${record.id})">
                ${tableInfo.fields.map(field => {
                    const value = record[field];
                    const displayValue = value === null || value === undefined || value === '' 
                        ? '<span style="color: #9CA3AF; font-style: italic;">NULL</span>' 
                        : escapeHtml(String(value));
                    return `<td title="${escapeHtml(String(value || ''))}">${displayValue}</td>`;
                }).join('')}
                <td>
                    <button class="action-btn action-btn-primary" onclick="event.stopPropagation(); viewRecordDetail('${currentTableId}', ${record.id})">
                        <i class="fas fa-eye"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }
    
    // 更新分页信息
    updatePagination(result);
}

/**
 * 更新分页信息
 */
function updatePagination(result) {
    const start = result.total === 0 ? 0 : (result.page - 1) * result.pageSize + 1;
    const end = Math.min(result.page * result.pageSize, result.total);
    
    document.getElementById('pageStart').textContent = start;
    document.getElementById('pageEnd').textContent = end;
    document.getElementById('totalCount').textContent = result.total;
    
    // 渲染页码按钮
    const pageNumbers = document.getElementById('pageNumbers');
    const totalPages = result.totalPages;
    
    let pages = [];
    if (totalPages <= 7) {
        pages = Array.from({length: totalPages}, (_, i) => i + 1);
    } else {
        if (currentPage <= 4) {
            pages = [1, 2, 3, 4, 5, '...', totalPages];
        } else if (currentPage >= totalPages - 3) {
            pages = [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
        } else {
            pages = [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
        }
    }
    
    pageNumbers.innerHTML = pages.map(page => {
        if (page === '...') {
            return '<span class="page-ellipsis">...</span>';
        }
        return `<button class="page-btn ${page === currentPage ? 'active' : ''}" onclick="goToPage(${page})">${page}</button>`;
    }).join('');
    
    // 更新上一页/下一页按钮状态
    document.getElementById('prevPage').disabled = currentPage === 1;
    document.getElementById('nextPage').disabled = currentPage === totalPages || totalPages === 0;
}

/**
 * 上一页
 */
function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        loadTableData();
    }
}

/**
 * 下一页
 */
function nextPage() {
    const result = window.dataViewerService.getTableData(currentTableId, currentPage, pageSize, searchTerm);
    if (currentPage < result.totalPages) {
        currentPage++;
        loadTableData();
    }
}

/**
 * 跳转到指定页
 */
function goToPage(page) {
    currentPage = page;
    loadTableData();
}

/**
 * 显示空状态
 */
function showEmptyState() {
    document.getElementById('tableInfo').style.display = 'none';
    document.getElementById('emptyState').style.display = 'block';
    document.getElementById('dataTableWrapper').style.display = 'none';
}

/**
 * 重置筛选
 */
function resetFilters() {
    const searchInput = document.getElementById('searchInput');
    const tableSelect = document.getElementById('tableSelect');
    
    if (searchInput) searchInput.value = '';
    if (tableSelect) tableSelect.value = '';
    
    searchTerm = '';
    currentTableId = null;
    currentPage = 1;
    
    showEmptyState();
}

/**
 * 刷新数据
 */
function refreshData() {
    if (currentTableId) {
        loadTableData();
        showToast('数据已刷新', 'success');
    } else {
        showToast('请先选择数据表', 'warning');
    }
}

/**
 * 导出数据
 */
function exportData() {
    if (!currentTableId) {
        showToast('请先选择数据表', 'warning');
        return;
    }
    
    const result = window.dataViewerService.exportData(currentTableId, 'csv');
    
    if (result.success) {
        // 创建下载链接
        const blob = new Blob([result.data], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = result.filename;
        link.click();
        
        showToast('导出成功', 'success');
    } else {
        showToast('导出失败: ' + result.error, 'error');
    }
}

/**
 * 显示对比模态框
 */
function showCompareModal() {
    // 加载数据表列表
    const rawTables = window.dataViewerService.getTables('raw');
    const cleanedTables = window.dataViewerService.getTables('cleaned');
    
    const rawSelect = document.getElementById('compareRawTable');
    const cleanedSelect = document.getElementById('compareCleanedTable');
    
    rawSelect.innerHTML = '<option value="">请选择</option>' +
        rawTables.map(table => `<option value="${table.id}">${table.displayName}</option>`).join('');
    
    cleanedSelect.innerHTML = '<option value="">请选择</option>' +
        cleanedTables.map(table => `<option value="${table.id}">${table.displayName}</option>`).join('');
    
    // 显示模态框
    const modal = document.getElementById('compareModal');
    modal.style.display = 'flex';
    setTimeout(() => {
        modal.classList.add('modal-show');
    }, 10);
}

/**
 * 关闭对比模态框
 */
function closeCompareModal() {
    const modal = document.getElementById('compareModal');
    modal.classList.remove('modal-show');
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
    
    // 重置结果
    document.getElementById('compareResult').style.display = 'none';
}

/**
 * 执行对比
 */
function performCompare() {
    const rawTableId = document.getElementById('compareRawTable').value;
    const cleanedTableId = document.getElementById('compareCleanedTable').value;
    
    if (!rawTableId || !cleanedTableId) {
        showToast('请选择要对比的数据表', 'warning');
        return;
    }
    
    const result = window.dataViewerService.compareData(rawTableId, cleanedTableId);
    
    // 渲染对比结果
    const resultDiv = document.getElementById('compareResult');
    resultDiv.innerHTML = `
        <div class="compare-stats">
            <div class="compare-stat-card">
                <div class="compare-stat-label">原始数据</div>
                <div class="compare-stat-value">${result.statistics.rawCount}</div>
            </div>
            <div class="compare-stat-card">
                <div class="compare-stat-label">治理后数据</div>
                <div class="compare-stat-value success">${result.statistics.cleanedCount}</div>
            </div>
            <div class="compare-stat-card">
                <div class="compare-stat-label">清理记录数</div>
                <div class="compare-stat-value warning">${result.statistics.removedCount}</div>
            </div>
            <div class="compare-stat-card">
                <div class="compare-stat-label">数据清洗率</div>
                <div class="compare-stat-value">${result.statistics.cleanRate}%</div>
            </div>
        </div>
        
        <div class="compare-details">
            ${result.fieldChanges.added.length > 0 || result.fieldChanges.removed.length > 0 ? `
                <div class="compare-section">
                    <h4 class="compare-section-title">字段变更</h4>
                    ${result.fieldChanges.added.length > 0 ? `
                        <div class="compare-item">
                            <div class="compare-item-header">
                                <span class="compare-item-field">新增字段</span>
                                <span class="compare-item-badge added">+${result.fieldChanges.added.length}</span>
                            </div>
                            <div style="color: #6B7280; font-size: 13px;">
                                ${result.fieldChanges.added.join(', ')}
                            </div>
                        </div>
                    ` : ''}
                    ${result.fieldChanges.removed.length > 0 ? `
                        <div class="compare-item">
                            <div class="compare-item-header">
                                <span class="compare-item-field">移除字段</span>
                                <span class="compare-item-badge removed">-${result.fieldChanges.removed.length}</span>
                            </div>
                            <div style="color: #6B7280; font-size: 13px;">
                                ${result.fieldChanges.removed.join(', ')}
                            </div>
                        </div>
                    ` : ''}
                </div>
            ` : ''}
            
            ${result.qualityImprovements.length > 0 ? `
                <div class="compare-section">
                    <h4 class="compare-section-title">数据质量提升</h4>
                    ${result.qualityImprovements.map(item => `
                        <div class="compare-item">
                            <div class="compare-item-header">
                                <span class="compare-item-field">${item.field}</span>
                                <span class="compare-item-badge modified">${item.improvement}</span>
                            </div>
                            <div class="compare-item-values">
                                <div class="compare-value">
                                    <div class="compare-value-label">原始数据</div>
                                    <div class="compare-value-content">${item.rawValue}</div>
                                </div>
                                <div class="compare-value">
                                    <div class="compare-value-label">治理后</div>
                                    <div class="compare-value-content">${item.cleanedValue}</div>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            ` : ''}
        </div>
    `;
    
    resultDiv.style.display = 'block';
}

/**
 * 查看记录详情
 */
function viewRecordDetail(tableId, recordId) {
    const record = window.dataViewerService.getRecordDetail(tableId, recordId);
    if (!record) {
        showToast('记录不存在', 'error');
        return;
    }
    
    const content = document.getElementById('recordDetailContent');
    content.innerHTML = Object.entries(record).map(([key, value]) => `
        <div class="record-field">
            <div class="record-field-label">${getFieldDisplayName(key)}</div>
            <div class="record-field-value ${value === null || value === undefined || value === '' ? 'null' : ''}">
                ${value === null || value === undefined || value === '' ? 'NULL' : escapeHtml(String(value))}
            </div>
        </div>
    `).join('');
    
    // 显示模态框
    const modal = document.getElementById('recordDetailModal');
    modal.style.display = 'flex';
    setTimeout(() => {
        modal.classList.add('modal-show');
    }, 10);
}

/**
 * 关闭记录详情模态框
 */
function closeRecordDetailModal() {
    const modal = document.getElementById('recordDetailModal');
    modal.classList.remove('modal-show');
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
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
