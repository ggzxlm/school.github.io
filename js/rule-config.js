/**
 * 规则配置页面脚本
 */

let ruleService;
let selectedRules = new Set();
let currentEditingRuleId = null;
let importedFileData = null;
let currentTestRuleId = null;

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 等待组件加载完成
    setTimeout(() => {
        ruleService = new RuleEngineService();
        initializePage();
    }, 100);
});

/**
 * 初始化页面
 */
function initializePage() {
    console.log('初始化规则配置页面...');
    console.log('RuleEngineService:', ruleService);
    loadRules();
    populateCategoryFilter();
}

/**
 * 加载规则列表
 */
function loadRules() {
    console.log('加载规则列表...');
    const rules = ruleService.getAllRules();
    console.log('获取到的规则数量:', rules.length);
    console.log('规则数据:', rules);
    renderRulesTable(rules);
}

/**
 * 渲染规则表格
 */
function renderRulesTable(rules) {
    console.log('渲染规则表格, 规则数量:', rules.length);
    const tbody = document.getElementById('rulesTableBody');
    if (!tbody) {
        console.error('找不到表格 tbody 元素');
        return;
    }
    if (rules.length === 0) {
        tbody.innerHTML = '<tr><td colspan="11" class="empty-state">暂无规则数据</td></tr>';
        return;
    }
    
    tbody.innerHTML = rules.map(rule => `
        <tr>
            <td><input type="checkbox" class="rule-checkbox" value="${rule.id}" onchange="updateSelection()"></td>
            <td>${rule.ruleName}</td>
            <td><span class="rule-type-badge ${rule.ruleType.toLowerCase()}">${getRuleTypeName(rule.ruleType)}</span></td>
            <td>${rule.category}</td>
            <td><span class="priority-display ${getPriorityClass(rule.priority)}">${rule.priority}</span></td>
            <td><span class="alert-level-badge ${rule.alertLevel.toLowerCase()}">${getAlertLevelName(rule.alertLevel)}</span></td>
            <td><span class="status-badge ${rule.enabled ? 'enabled' : 'disabled'}">${rule.enabled ? '已启用' : '已禁用'}</span></td>
            <td>${rule.executionCount}</td>
            <td>${rule.matchCount}</td>
            <td>${rule.lastExecutionTime ? formatDateTime(rule.lastExecutionTime) : '-'}</td>
            <td>
                <button class="action-btn primary" onclick="viewRuleDetail('${rule.id}')">详情</button>
                <button class="action-btn secondary" onclick="editRule('${rule.id}')">编辑</button>
                <button class="action-btn ${rule.enabled ? 'warning' : 'success'}" onclick="toggleRuleStatus('${rule.id}')">
                    ${rule.enabled ? '禁用' : '启用'}
                </button>
                <button class="action-btn info" onclick="executeRule('${rule.id}')">执行</button>
                <button class="action-btn info" onclick="showTestModal('${rule.id}')">测试</button>
                <button class="action-btn secondary" onclick="showHistory('${rule.id}')">历史</button>
                <button class="action-btn danger" onclick="deleteRule('${rule.id}')">删除</button>
            </td>
        </tr>
    `).join('');
}

/**
 * 过滤规则
 */
function filterRules() {
    const typeFilter = document.getElementById('ruleTypeFilter').value;
    const statusFilter = document.getElementById('statusFilter').value;
    const categoryFilter = document.getElementById('categoryFilter').value;
    const alertLevelFilter = document.getElementById('alertLevelFilter').value;
    const searchText = document.getElementById('ruleSearch').value.toLowerCase();
    
    let rules = ruleService.getAllRules();
    
    if (typeFilter) {
        rules = rules.filter(r => r.ruleType === typeFilter);
    }
    if (statusFilter) {
        rules = rules.filter(r => statusFilter === 'enabled' ? r.enabled : !r.enabled);
    }
    if (categoryFilter) {
        rules = rules.filter(r => r.category === categoryFilter);
    }
    if (alertLevelFilter) {
        rules = rules.filter(r => r.alertLevel === alertLevelFilter);
    }
    if (searchText) {
        rules = rules.filter(r => r.ruleName.toLowerCase().includes(searchText));
    }
    
    renderRulesTable(rules);
}

/**
 * 填充分类过滤器
 */
function populateCategoryFilter() {
    const rules = ruleService.getAllRules();
    const categories = [...new Set(rules.map(r => r.category))];
    const select = document.getElementById('categoryFilter');
    
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        select.appendChild(option);
    });
}

/**
 * 显示创建规则模态框
 */
function showCreateRuleModal() {
    currentEditingRuleId = null;
    document.getElementById('ruleModalTitle').textContent = '创建规则';
    document.getElementById('ruleForm').reset();
    document.getElementById('ruleId').value = '';
    document.getElementById('configEditor').innerHTML = '<p style="color: #999;">请先选择规则类型</p>';
    document.getElementById('ruleModal').classList.add('show');
}

/**
 * 关闭规则模态框
 */
function closeRuleModal() {
    document.getElementById('ruleModal').classList.remove('show');
}

/**
 * 编辑规则
 */
function editRule(ruleId) {
    const rule = ruleService.getRuleById(ruleId);
    if (!rule) return;
    
    currentEditingRuleId = ruleId;
    document.getElementById('ruleModalTitle').textContent = '编辑规则';
    document.getElementById('ruleId').value = rule.id;
    document.getElementById('ruleName').value = rule.ruleName;
    document.getElementById('ruleType').value = rule.ruleType;
    document.getElementById('ruleCategory').value = rule.category;
    document.getElementById('alertLevel').value = rule.alertLevel;
    document.getElementById('priority').value = rule.priority;
    document.getElementById('groupId').value = rule.groupId || '';
    document.getElementById('ruleDescription').value = rule.description;
    document.getElementById('ruleEnabled').checked = rule.enabled;
    
    updateConfigEditor();
    loadConfigValues(rule.config);
    
    document.getElementById('ruleModal').classList.add('show');
}

/**
 * 保存规则
 */
function saveRule() {
    const ruleId = document.getElementById('ruleId').value;
    const ruleData = {
        ruleName: document.getElementById('ruleName').value,
        ruleType: document.getElementById('ruleType').value,
        category: document.getElementById('ruleCategory').value || '通用规则',
        alertLevel: document.getElementById('alertLevel').value,
        priority: parseInt(document.getElementById('priority').value),
        groupId: document.getElementById('groupId').value || null,
        description: document.getElementById('ruleDescription').value,
        enabled: document.getElementById('ruleEnabled').checked,
        config: getConfigValues()
    };
    
    if (!ruleData.ruleName || !ruleData.ruleType) {
        alert('请填写必填项');
        return;
    }
    
    try {
        if (ruleId) {
            ruleService.updateRule(ruleId, ruleData);
            showNotification('规则更新成功', 'success');
        } else {
            ruleService.createRule(ruleData);
            showNotification('规则创建成功', 'success');
        }
        closeRuleModal();
        loadRules();
    } catch (error) {
        showNotification('保存失败: ' + error.message, 'error');
    }
}

/**
 * 更新配置编辑器
 */
function updateConfigEditor() {
    const ruleType = document.getElementById('ruleType').value;
    const editor = document.getElementById('configEditor');
    
    if (!ruleType) {
        editor.innerHTML = '<p style="color: #999;">请先选择规则类型</p>';
        return;
    }
    
    let html = '';
    
    switch (ruleType) {
        case 'THRESHOLD':
            html = `
                <div class="config-field">
                    <label>检查字段:</label>
                    <input type="text" id="config_field" placeholder="如: amount, count等">
                </div>
                <div class="config-field">
                    <label>运算符:</label>
                    <select id="config_operator">
                        <option value=">">大于 ></option>
                        <option value="<">小于 <</option>
                        <option value=">=">大于等于 >=</option>
                        <option value="<=">小于等于 <=</option>
                        <option value="==">等于 ==</option>
                        <option value="!=">不等于 !=</option>
                    </select>
                </div>
                <div class="config-field">
                    <label>阈值:</label>
                    <input type="number" id="config_threshold" placeholder="如: 100000">
                </div>
                <div class="config-field">
                    <label>时间窗口:</label>
                    <select id="config_timeWindow">
                        <option value="single">单次</option>
                        <option value="daily">每日</option>
                        <option value="weekly">每周</option>
                        <option value="monthly">每月</option>
                        <option value="yearly">每年</option>
                    </select>
                </div>
            `;
            break;
        case 'TREND':
            html = `
                <div class="config-field">
                    <label>检查字段:</label>
                    <input type="text" id="config_field" placeholder="如: expense, revenue等">
                </div>
                <div class="config-field">
                    <label>时间窗口:</label>
                    <input type="text" id="config_timeWindow" placeholder="如: 30d, 7d等">
                </div>
                <div class="config-field">
                    <label>趋势条件:</label>
                    <input type="text" id="config_condition" placeholder="如: increase > 50%">
                </div>
            `;
            break;
        case 'CORRELATION':
            html = `
                <div class="config-field">
                    <label>实体类型:</label>
                    <input type="text" id="config_entities" placeholder="如: person,supplier (逗号分隔)">
                </div>
                <div class="config-field">
                    <label>关系类型:</label>
                    <input type="text" id="config_relations" placeholder="如: family_relation,investment_relation">
                </div>
            `;
            break;
        case 'SEQUENCE':
            html = `
                <div class="config-field">
                    <label>事件序列:</label>
                    <input type="text" id="config_events" placeholder="如: event1,event2,event3">
                </div>
                <div class="config-field">
                    <label>时间窗口:</label>
                    <input type="text" id="config_timeWindow" placeholder="如: 7d, 30d等">
                </div>
            `;
            break;
        case 'GRAPH':
            html = `
                <div class="config-field">
                    <label>图谱模式:</label>
                    <input type="text" id="config_pattern" placeholder="如: person->company->contract">
                </div>
                <div class="config-field">
                    <label>匹配条件:</label>
                    <input type="text" id="config_condition" placeholder="如: person.role=approver">
                </div>
            `;
            break;
    }
    
    editor.innerHTML = html;
}

/**
 * 获取配置值
 */
function getConfigValues() {
    const ruleType = document.getElementById('ruleType').value;
    const config = {};
    
    switch (ruleType) {
        case 'THRESHOLD':
            config.field = document.getElementById('config_field')?.value;
            config.operator = document.getElementById('config_operator')?.value;
            config.threshold = parseFloat(document.getElementById('config_threshold')?.value) || 0;
            config.timeWindow = document.getElementById('config_timeWindow')?.value;
            break;
        case 'TREND':
            config.field = document.getElementById('config_field')?.value;
            config.timeWindow = document.getElementById('config_timeWindow')?.value;
            config.condition = document.getElementById('config_condition')?.value;
            break;
        case 'CORRELATION':
            config.entities = document.getElementById('config_entities')?.value.split(',').map(s => s.trim());
            config.relations = document.getElementById('config_relations')?.value.split(',').map(s => s.trim());
            break;
        case 'SEQUENCE':
            config.events = document.getElementById('config_events')?.value.split(',').map(s => s.trim());
            config.timeWindow = document.getElementById('config_timeWindow')?.value;
            break;
        case 'GRAPH':
            config.pattern = document.getElementById('config_pattern')?.value;
            config.condition = document.getElementById('config_condition')?.value;
            break;
    }
    
    return config;
}

/**
 * 加载配置值
 */
function loadConfigValues(config) {
    const ruleType = document.getElementById('ruleType').value;
    
    switch (ruleType) {
        case 'THRESHOLD':
            if (document.getElementById('config_field')) document.getElementById('config_field').value = config.field || '';
            if (document.getElementById('config_operator')) document.getElementById('config_operator').value = config.operator || '>';
            if (document.getElementById('config_threshold')) document.getElementById('config_threshold').value = config.threshold || 0;
            if (document.getElementById('config_timeWindow')) document.getElementById('config_timeWindow').value = config.timeWindow || 'single';
            break;
        case 'TREND':
            if (document.getElementById('config_field')) document.getElementById('config_field').value = config.field || '';
            if (document.getElementById('config_timeWindow')) document.getElementById('config_timeWindow').value = config.timeWindow || '';
            if (document.getElementById('config_condition')) document.getElementById('config_condition').value = config.condition || '';
            break;
        case 'CORRELATION':
            if (document.getElementById('config_entities')) document.getElementById('config_entities').value = (config.entities || []).join(',');
            if (document.getElementById('config_relations')) document.getElementById('config_relations').value = (config.relations || []).join(',');
            break;
        case 'SEQUENCE':
            if (document.getElementById('config_events')) document.getElementById('config_events').value = (config.events || []).join(',');
            if (document.getElementById('config_timeWindow')) document.getElementById('config_timeWindow').value = config.timeWindow || '';
            break;
        case 'GRAPH':
            if (document.getElementById('config_pattern')) document.getElementById('config_pattern').value = config.pattern || '';
            if (document.getElementById('config_condition')) document.getElementById('config_condition').value = config.condition || '';
            break;
    }
}

/**
 * 查看规则详情
 */
function viewRuleDetail(ruleId) {
    const rule = ruleService.getRuleById(ruleId);
    if (!rule) return;
    
    const detailHtml = `
        <div class="detail-grid">
            <div class="detail-item">
                <div class="detail-label">规则名称</div>
                <div class="detail-value">${rule.ruleName}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">规则类型</div>
                <div class="detail-value"><span class="rule-type-badge ${rule.ruleType.toLowerCase()}">${getRuleTypeName(rule.ruleType)}</span></div>
            </div>
            <div class="detail-item">
                <div class="detail-label">规则分类</div>
                <div class="detail-value">${rule.category}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">预警等级</div>
                <div class="detail-value"><span class="alert-level-badge ${rule.alertLevel.toLowerCase()}">${getAlertLevelName(rule.alertLevel)}</span></div>
            </div>
            <div class="detail-item">
                <div class="detail-label">优先级</div>
                <div class="detail-value">${rule.priority}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">状态</div>
                <div class="detail-value"><span class="status-badge ${rule.enabled ? 'enabled' : 'disabled'}">${rule.enabled ? '已启用' : '已禁用'}</span></div>
            </div>
            <div class="detail-item full-width">
                <div class="detail-label">规则描述</div>
                <div class="detail-value">${rule.description || '-'}</div>
            </div>
            <div class="detail-item full-width">
                <div class="detail-label">规则配置</div>
                <div class="detail-value"><pre>${JSON.stringify(rule.config, null, 2)}</pre></div>
            </div>
            <div class="detail-item">
                <div class="detail-label">执行次数</div>
                <div class="detail-value">${rule.executionCount}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">匹配次数</div>
                <div class="detail-value">${rule.matchCount}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">创建时间</div>
                <div class="detail-value">${formatDateTime(rule.createdAt)}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">最后执行</div>
                <div class="detail-value">${rule.lastExecutionTime ? formatDateTime(rule.lastExecutionTime) : '-'}</div>
            </div>
        </div>
    `;
    
    document.getElementById('ruleDetailBody').innerHTML = detailHtml;
    document.getElementById('ruleDetailModal').classList.add('show');
}

/**
 * 关闭规则详情模态框
 */
function closeRuleDetailModal() {
    document.getElementById('ruleDetailModal').classList.remove('show');
}

/**
 * 切换规则状态
 */
function toggleRuleStatus(ruleId) {
    const rule = ruleService.getRuleById(ruleId);
    if (!rule) return;
    
    try {
        ruleService.toggleRule(ruleId, !rule.enabled);
        showNotification(`规则已${!rule.enabled ? '启用' : '禁用'}`, 'success');
        loadRules();
    } catch (error) {
        showNotification('操作失败: ' + error.message, 'error');
    }
}

/**
 * 执行规则
 */
async function executeRule(ruleId) {
    try {
        showNotification('正在执行规则...', 'info');
        const result = await ruleService.executeRule(ruleId);
        showNotification(`规则执行完成，匹配 ${result.matchedCount} 条数据`, 'success');
        loadRules();
    } catch (error) {
        showNotification('执行失败: ' + error.message, 'error');
    }
}

/**
 * 删除规则
 */
function deleteRule(ruleId) {
    if (!confirm('确定要删除这条规则吗？')) return;
    
    try {
        ruleService.deleteRule(ruleId);
        showNotification('规则删除成功', 'success');
        loadRules();
    } catch (error) {
        showNotification('删除失败: ' + error.message, 'error');
    }
}

/**
 * 批量操作相关
 */
function toggleSelectAll() {
    const selectAll = document.getElementById('selectAll').checked;
    document.querySelectorAll('.rule-checkbox').forEach(checkbox => {
        checkbox.checked = selectAll;
    });
    updateSelection();
}

function updateSelection() {
    selectedRules.clear();
    document.querySelectorAll('.rule-checkbox:checked').forEach(checkbox => {
        selectedRules.add(checkbox.value);
    });
    
    const count = selectedRules.size;
    document.getElementById('selectedCount').textContent = count;
    document.getElementById('batchActions').classList.toggle('show', count > 0);
}

function clearSelection() {
    document.getElementById('selectAll').checked = false;
    document.querySelectorAll('.rule-checkbox').forEach(checkbox => {
        checkbox.checked = false;
    });
    updateSelection();
}

function batchEnableRules() {
    if (selectedRules.size === 0) return;
    
    try {
        const result = ruleService.batchEnableRules(Array.from(selectedRules));
        showNotification(`已启用 ${result.count} 条规则`, 'success');
        loadRules();
        clearSelection();
    } catch (error) {
        showNotification('批量启用失败: ' + error.message, 'error');
    }
}

function batchDisableRules() {
    if (selectedRules.size === 0) return;
    
    try {
        const result = ruleService.batchDisableRules(Array.from(selectedRules));
        showNotification(`已禁用 ${result.count} 条规则`, 'success');
        loadRules();
        clearSelection();
    } catch (error) {
        showNotification('批量禁用失败: ' + error.message, 'error');
    }
}

function batchExportRules() {
    if (selectedRules.size === 0) return;
    
    try {
        const jsonData = ruleService.exportRules(Array.from(selectedRules));
        const blob = new Blob([jsonData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `rules_export_${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
        showNotification('规则导出成功', 'success');
    } catch (error) {
        showNotification('导出失败: ' + error.message, 'error');
    }
}

function batchDeleteRules() {
    if (selectedRules.size === 0) return;
    if (!confirm(`确定要删除选中的 ${selectedRules.size} 条规则吗？`)) return;
    
    try {
        const result = ruleService.batchDeleteRules(Array.from(selectedRules));
        showNotification(`已删除 ${result.count} 条规则`, 'success');
        loadRules();
        clearSelection();
    } catch (error) {
        showNotification('批量删除失败: ' + error.message, 'error');
    }
}

/**
 * 导入导出相关
 */
function showImportModal() {
    document.getElementById('importModal').classList.add('show');
}

function closeImportModal() {
    document.getElementById('importModal').classList.remove('show');
    document.getElementById('importFile').value = '';
    importedFileData = null;
}

function handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            importedFileData = e.target.result;
            showNotification('文件读取成功', 'success');
        } catch (error) {
            showNotification('文件读取失败: ' + error.message, 'error');
        }
    };
    reader.readAsText(file);
}

function importRules() {
    if (!importedFileData) {
        showNotification('请先选择文件', 'warning');
        return;
    }
    
    const options = {
        overwrite: document.getElementById('overwriteExisting').checked,
        enableOnImport: document.getElementById('enableOnImport').checked
    };
    
    try {
        const result = ruleService.importRules(importedFileData, options);
        if (result.success) {
            showNotification(`导入成功: ${result.imported} 条规则，跳过 ${result.skipped} 条`, 'success');
            closeImportModal();
            loadRules();
        } else {
            showNotification('导入失败: ' + result.error, 'error');
        }
    } catch (error) {
        showNotification('导入失败: ' + error.message, 'error');
    }
}

/**
 * 规则测试相关
 */
function showTestModal(ruleId) {
    currentTestRuleId = ruleId;
    document.getElementById('testDataInput').value = '';
    document.getElementById('testResultContainer').innerHTML = '';
    document.getElementById('testModal').classList.add('show');
}

function closeTestModal() {
    document.getElementById('testModal').classList.remove('show');
    currentTestRuleId = null;
}

async function runRuleTest() {
    if (!currentTestRuleId) return;
    
    const testDataInput = document.getElementById('testDataInput').value;
    let testData = null;
    
    if (testDataInput.trim()) {
        try {
            testData = JSON.parse(testDataInput);
        } catch (error) {
            showNotification('测试数据格式错误: ' + error.message, 'error');
            return;
        }
    }
    
    try {
        showNotification('正在执行测试...', 'info');
        const result = await ruleService.testRule(currentTestRuleId, testData);
        displayTestResult(result);
        showNotification('测试完成', 'success');
    } catch (error) {
        showNotification('测试失败: ' + error.message, 'error');
    }
}

function displayTestResult(result) {
    const container = document.getElementById('testResultContainer');
    const html = `
        <div class="test-result">
            <h4>测试结果</h4>
            <div class="test-metrics">
                <div class="test-metric">
                    <div class="test-metric-label">测试数据量</div>
                    <div class="test-metric-value">${result.testDataCount || 0}</div>
                </div>
                <div class="test-metric">
                    <div class="test-metric-label">匹配数</div>
                    <div class="test-metric-value">${result.matchedCount}</div>
                </div>
                <div class="test-metric">
                    <div class="test-metric-label">匹配率</div>
                    <div class="test-metric-value">${result.matchRate}%</div>
                </div>
                <div class="test-metric">
                    <div class="test-metric-label">执行时长</div>
                    <div class="test-metric-value">${result.executionDuration}ms</div>
                </div>
            </div>
            ${result.alerts && result.alerts.length > 0 ? `
                <h4>生成的预警 (前10条)</h4>
                <div class="alerts-list">
                    ${result.alerts.slice(0, 10).map(alert => `
                        <div class="alert-item ${alert.alertLevel.toLowerCase()}">
                            <div class="alert-header">
                                <span class="alert-title">${alert.title}</span>
                                <span class="alert-level-badge ${alert.alertLevel.toLowerCase()}">${getAlertLevelName(alert.alertLevel)}</span>
                            </div>
                            <div class="alert-desc">${alert.description}</div>
                        </div>
                    `).join('')}
                </div>
            ` : ''}
        </div>
    `;
    container.innerHTML = html;
}

/**
 * 执行历史相关
 */
function showHistory(ruleId) {
    const executions = ruleService.getExecutionHistory({ ruleId });
    renderHistory(executions);
    document.getElementById('historyModal').classList.add('show');
}

function closeHistoryModal() {
    document.getElementById('historyModal').classList.remove('show');
}

function renderHistory(executions) {
    const tbody = document.getElementById('historyTableBody');
    if (executions.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="empty-state">暂无执行历史</td></tr>';
        return;
    }
    
    tbody.innerHTML = executions.slice(0, 50).map(exec => `
        <tr>
            <td>${formatDateTime(exec.executionTime)}</td>
            <td>${exec.dataCount}</td>
            <td>${exec.matchedCount}</td>
            <td>${((exec.matchedCount / exec.dataCount) * 100).toFixed(2)}%</td>
            <td>${exec.executionDuration}ms</td>
            <td><span class="status-badge ${exec.status.toLowerCase()}">${exec.status === 'SUCCESS' ? '成功' : '失败'}</span></td>
        </tr>
    `).join('');
}

/**
 * 工具函数
 */
function getRuleTypeName(type) {
    const names = {
        'THRESHOLD': '阈值规则',
        'TREND': '趋势规则',
        'CORRELATION': '关联规则',
        'SEQUENCE': '时序规则',
        'GRAPH': '图谱规则'
    };
    return names[type] || type;
}

function getAlertLevelName(level) {
    const names = {
        'HIGH': '高',
        'MEDIUM': '中',
        'LOW': '低'
    };
    return names[level] || level;
}

function getPriorityClass(priority) {
    if (priority >= 70) return 'high';
    if (priority >= 30) return 'medium';
    return 'low';
}

function formatDateTime(dateStr) {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function showNotification(message, type = 'info') {
    // 使用common.js中的通知函数
    if (typeof window.showNotification === 'function') {
        window.showNotification(message, type);
    } else {
        alert(message);
    }
}

/**
 * 重置数据（开发测试用）
 */
function resetData() {
    if (!confirm('确定要重置为预置数据吗？这将清除所有自定义规则！')) {
        return;
    }
    
    try {
        ruleService.resetToPresetData();
        showNotification('数据已重置为预置数据', 'success');
        loadRules();
        populateCategoryFilter();
    } catch (error) {
        showNotification('重置失败: ' + error.message, 'error');
    }
}
