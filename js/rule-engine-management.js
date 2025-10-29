/**
 * 规则引擎管理页面脚本
 */

let ruleService;
let selectedRules = new Set();
let currentEditingRuleId = null;
let importedFileData = null;

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
    loadOverviewData();
    loadRules();
    loadExecutionHistory();
    loadTestHistory();
    populateTestRuleSelect();
    populateCategoryFilter();
}

/**
 * 加载概览数据
 */
function loadOverviewData() {
    const stats = ruleService.getRuleStatistics();
    
    // 更新统计卡片
    document.getElementById('stat-total-rules').textContent = stats.overall.totalRules;
    document.getElementById('stat-enabled-rules').textContent = stats.overall.enabledRules;
    document.getElementById('stat-total-executions').textContent = stats.overall.totalExecutions;
    document.getElementById('stat-total-matches').textContent = stats.overall.totalMatches;
    document.getElementById('stat-avg-match-rate').textContent = stats.overall.avgMatchRate + '%';
    
    // 检测冲突
    const conflicts = ruleService.detectConflicts();
    document.getElementById('stat-conflicts').textContent = conflicts.length;
    
    // 显示冲突详情
    displayConflicts(conflicts);
    
    // 今日执行次数
    const today = new Date().toISOString().split('T')[0];
    const todayExecutions = ruleService.getExecutionHistory({ startDate: today });
    document.getElementById('stat-today-executions').textContent = todayExecutions.length;
    
    // 渲染图表
    renderRuleTypeChart(stats.byType);
    renderExecutionTrendChart(stats.trend);
    
    // 渲染分类统计表
    renderCategoryStats(stats.byCategory);
}

/**
 * 渲染规则类型图表
 */
function renderRuleTypeChart(data) {
    const chart = echarts.init(document.getElementById('ruleTypeChart'));
    const option = {
        tooltip: {
            trigger: 'item',
            formatter: '{b}: {c} ({d}%)'
        },
        legend: {
            orient: 'vertical',
            right: 10,
            top: 'center'
        },
        series: [{
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
                borderRadius: 10,
                borderColor: '#fff',
                borderWidth: 2
            },
            label: {
                show: false
            },
            emphasis: {
                label: {
                    show: true,
                    fontSize: 14,
                    fontWeight: 'bold'
                }
            },
            data: data.map(item => ({
                name: getRuleTypeName(item.type),
                value: item.total
            }))
        }]
    };
    chart.setOption(option);
}

/**
 * 渲染执行趋势图表
 */
function renderExecutionTrendChart(data) {
    const chart = echarts.init(document.getElementById('executionTrendChart'));
    const option = {
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: ['执行次数', '匹配次数']
        },
        xAxis: {
            type: 'category',
            data: data.map(item => item.date.substring(5))
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                name: '执行次数',
                type: 'line',
                smooth: true,
                data: data.map(item => item.executionCount),
                itemStyle: { color: '#2c5282' }
            },
            {
                name: '匹配次数',
                type: 'line',
                smooth: true,
                data: data.map(item => item.matchCount),
                itemStyle: { color: '#ffc107' }
            }
        ]
    };
    chart.setOption(option);
}

/**
 * 渲染分类统计表
 */
function renderCategoryStats(data) {
    const tbody = document.getElementById('categoryStatsBody');
    if (data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="empty-state">暂无数据</td></tr>';
        return;
    }
    
    tbody.innerHTML = data.map(item => `
        <tr>
            <td>${item.category}</td>
            <td>${item.total}</td>
            <td>${item.enabled}</td>
            <td>${item.total - item.enabled}</td>
        </tr>
    `).join('');
}

/**
 * 加载规则列表
 */
function loadRules() {
    const rules = ruleService.getAllRules();
    renderRulesTable(rules);
}

/**
 * 渲染规则表格
 */
function renderRulesTable(rules) {
    const tbody = document.getElementById('rulesTableBody');
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
                <button class="action-btn secondary" onclick="copyRule('${rule.id}')">复制</button>
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
 * 切换标签页
 */
function switchTab(tabName) {
    // 隐藏所有标签页内容
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // 移除所有标签按钮的激活状态
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // 显示选中的标签页
    document.getElementById(tabName + '-tab').classList.add('active');
    event.target.classList.add('active');
    
    // 根据标签页加载数据
    if (tabName === 'overview') {
        loadOverviewData();
    } else if (tabName === 'execution') {
        loadExecutionHistory();
    } else if (tabName === 'test') {
        loadTestHistory();
    }
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
    
    // 初始化数据源配置（添加一个空的数据源）
    document.getElementById('dataSourcesContainer').innerHTML = '';
    addDataSource();
    
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
    
    // 加载数据源配置
    document.getElementById('dataSourcesContainer').innerHTML = '';
    if (rule.dataSources && rule.dataSources.length > 0) {
        rule.dataSources.forEach((ds, index) => {
            addDataSource();
            const item = document.querySelectorAll('.data-source-item')[index];
            if (item) {
                item.querySelector('.ds-alias').value = ds.alias;
                item.querySelector('.ds-type').value = ds.type;
                item.querySelector('.ds-table').value = ds.table;
                if (ds.joinField) {
                    item.querySelector('.ds-join-field').value = ds.joinField;
                }
            }
        });
    } else {
        // 如果没有数据源配置，添加一个空的
        addDataSource();
    }
    
    updateConfigEditor();
    loadConfigValues(rule.config);
    
    document.getElementById('ruleModal').classList.add('show');
}

/**
 * 保存规则
 */
function saveRule() {
    const ruleId = document.getElementById('ruleId').value;
    const dataSources = getDataSourcesConfig();
    
    const ruleData = {
        ruleName: document.getElementById('ruleName').value,
        ruleType: document.getElementById('ruleType').value,
        dataSources: dataSources,
        category: document.getElementById('ruleCategory').value || '通用规则',
        alertLevel: document.getElementById('alertLevel').value,
        priority: parseInt(document.getElementById('priority').value),
        groupId: document.getElementById('groupId').value || null,
        description: document.getElementById('ruleDescription').value,
        enabled: document.getElementById('ruleEnabled').checked,
        config: getConfigValues()
    };
    
    if (!ruleData.ruleName || !ruleData.ruleType) {
        alert('请填写必填项（规则名称、规则类型）');
        return;
    }
    
    if (dataSources.length === 0) {
        alert('请至少添加一个数据源');
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
        loadOverviewData();
    } catch (error) {
        showNotification('保存失败: ' + error.message, 'error');
    }
}

/**
 * 添加数据源
 */
function addDataSource() {
    const container = document.getElementById('dataSourcesContainer');
    const index = container.children.length;
    
    const dataSourceHtml = `
        <div class="data-source-item" data-index="${index}" style="border: 1px solid #e5e7eb; padding: 15px; border-radius: 6px; margin-bottom: 10px; background: #f9fafb;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <strong style="color: #374151;">数据源 ${index + 1}</strong>
                <button type="button" class="btn btn-sm" onclick="removeDataSource(${index})" style="color: #ef4444; padding: 4px 8px;">
                    <i class="fas fa-times"></i> 删除
                </button>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>数据源别名 <span class="required">*</span></label>
                    <input type="text" class="ds-alias" placeholder="如：procurement, finance" required>
                    <div class="form-help">用于在规则配置中引用，如：procurement.amount</div>
                </div>
                <div class="form-group">
                    <label>数据源类型 <span class="required">*</span></label>
                    <select class="ds-type" required>
                        <option value="">请选择</option>
                        <option value="procurement_db">采购系统数据库</option>
                        <option value="finance_db">财务系统数据库</option>
                        <option value="hr_db">人事系统数据库</option>
                        <option value="asset_db">资产系统数据库</option>
                        <option value="contract_db">合同系统数据库</option>
                        <option value="unified_db">统一数据仓库</option>
                        <option value="external_api">外部API</option>
                    </select>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>数据表/视图 <span class="required">*</span></label>
                    <input type="text" class="ds-table" placeholder="如：procurement_orders" required>
                </div>
                <div class="form-group">
                    <label>关联字段</label>
                    <input type="text" class="ds-join-field" placeholder="如：user_id（用于多数据源关联）">
                </div>
            </div>
        </div>
    `;
    
    container.insertAdjacentHTML('beforeend', dataSourceHtml);
}

/**
 * 删除数据源
 */
function removeDataSource(index) {
    const item = document.querySelector(`.data-source-item[data-index="${index}"]`);
    if (item) {
        item.remove();
        // 重新编号
        updateDataSourceIndexes();
    }
}

/**
 * 更新数据源索引
 */
function updateDataSourceIndexes() {
    const items = document.querySelectorAll('.data-source-item');
    items.forEach((item, index) => {
        item.setAttribute('data-index', index);
        item.querySelector('strong').textContent = `数据源 ${index + 1}`;
        const deleteBtn = item.querySelector('button[onclick^="removeDataSource"]');
        if (deleteBtn) {
            deleteBtn.setAttribute('onclick', `removeDataSource(${index})`);
        }
    });
}

/**
 * 获取数据源配置
 */
function getDataSourcesConfig() {
    const items = document.querySelectorAll('.data-source-item');
    const dataSources = [];
    
    items.forEach(item => {
        const alias = item.querySelector('.ds-alias').value;
        const type = item.querySelector('.ds-type').value;
        const table = item.querySelector('.ds-table').value;
        const joinField = item.querySelector('.ds-join-field').value;
        
        if (alias && type && table) {
            dataSources.push({
                alias,
                type,
                table,
                joinField: joinField || null
            });
        }
    });
    
    return dataSources;
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
    
    // 生成数据源配置HTML
    let dataSourcesHtml = '';
    if (rule.dataSources && rule.dataSources.length > 0) {
        dataSourcesHtml = rule.dataSources.map((ds, idx) => `
            <div style="border: 1px solid #e5e7eb; padding: 12px; border-radius: 6px; margin-bottom: 10px; background: #f9fafb;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                    <strong style="color: #374151;">数据源 ${idx + 1}: ${ds.alias}</strong>
                    <span style="padding: 2px 8px; background: #dbeafe; color: #1e40af; border-radius: 4px; font-size: 12px;">${getDataSourceTypeName(ds.type)}</span>
                </div>
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; font-size: 13px;">
                    <div>
                        <span style="color: #6b7280;">数据表/视图：</span>
                        <span style="color: #111827; font-weight: 500;">${ds.table}</span>
                    </div>
                    ${ds.joinField ? `
                        <div>
                            <span style="color: #6b7280;">关联字段：</span>
                            <span style="color: #3b82f6; font-weight: 500;">${ds.joinField}</span>
                        </div>
                    ` : '<div></div>'}
                </div>
            </div>
        `).join('');
    } else {
        dataSourcesHtml = '<div style="color: #9ca3af; font-style: italic;">未配置数据源</div>';
    }
    
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
                <div class="detail-label">数据源配置 ${rule.dataSources && rule.dataSources.length > 1 ? `<span style="color: #3b82f6; font-size: 12px;">(跨${rule.dataSources.length}个数据源)</span>` : ''}</div>
                <div class="detail-value">
                    ${dataSourcesHtml}
                </div>
            </div>
            <div class="detail-item full-width">
                <div class="detail-label">规则描述</div>
                <div class="detail-value">${rule.description || '-'}</div>
            </div>
            <div class="detail-item full-width">
                <div class="detail-label">规则配置</div>
                <div class="detail-value"><pre style="background: #f9fafb; padding: 12px; border-radius: 6px; overflow-x: auto;">${JSON.stringify(rule.config, null, 2)}</pre></div>
            </div>
            <div class="detail-item">
                <div class="detail-label">执行次数</div>
                <div class="detail-value"><strong style="color: #059669;">${rule.executionCount}</strong></div>
            </div>
            <div class="detail-item">
                <div class="detail-label">匹配次数</div>
                <div class="detail-value"><strong style="color: #dc2626;">${rule.matchCount}</strong></div>
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
        loadOverviewData();
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
        loadOverviewData();
        loadExecutionHistory();
    } catch (error) {
        showNotification('执行失败: ' + error.message, 'error');
    }
}

/**
 * 复制规则
 */
function copyRule(ruleId) {
    try {
        const newRule = ruleService.copyRule(ruleId);
        showNotification('规则复制成功', 'success');
        loadRules();
        loadOverviewData();
    } catch (error) {
        showNotification('复制失败: ' + error.message, 'error');
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
        loadOverviewData();
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
        loadOverviewData();
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
        loadOverviewData();
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
        loadOverviewData();
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
            loadOverviewData();
        } else {
            showNotification('导入失败: ' + result.error, 'error');
        }
    } catch (error) {
        showNotification('导入失败: ' + error.message, 'error');
    }
}

/**
 * 执行历史相关
 */
function loadExecutionHistory() {
    const executions = ruleService.getExecutionHistory();
    renderExecutionHistory(executions.slice(0, 50)); // 只显示最近50条
}

function renderExecutionHistory(executions) {
    const tbody = document.getElementById('executionHistoryBody');
    if (executions.length === 0) {
        tbody.innerHTML = '<tr><td colspan="9" class="empty-state">暂无执行历史</td></tr>';
        return;
    }
    
    tbody.innerHTML = executions.map(exec => `
        <tr>
            <td>${formatDateTime(exec.executionTime)}</td>
            <td>${exec.ruleName}</td>
            <td><span class="rule-type-badge ${exec.ruleType.toLowerCase()}">${getRuleTypeName(exec.ruleType)}</span></td>
            <td>${exec.dataCount}</td>
            <td>${exec.matchedCount}</td>
            <td>${((exec.matchedCount / exec.dataCount) * 100).toFixed(2)}%</td>
            <td>${exec.executionDuration}ms</td>
            <td><span class="status-badge ${exec.status.toLowerCase()}">${exec.status === 'SUCCESS' ? '成功' : '失败'}</span></td>
            <td>
                <button class="action-btn primary" onclick="viewExecutionDetail('${exec.id}')">详情</button>
            </td>
        </tr>
    `).join('');
}

function viewExecutionDetail(executionId) {
    const executions = ruleService.getExecutionHistory();
    const execution = executions.find(e => e.id === executionId);
    if (!execution) return;
    
    const detailHtml = `
        <div class="detail-grid">
            <div class="detail-item">
                <div class="detail-label">执行时间</div>
                <div class="detail-value">${formatDateTime(execution.executionTime)}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">规则名称</div>
                <div class="detail-value">${execution.ruleName}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">数据量</div>
                <div class="detail-value">${execution.dataCount}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">匹配数</div>
                <div class="detail-value">${execution.matchedCount}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">匹配率</div>
                <div class="detail-value">${((execution.matchedCount / execution.dataCount) * 100).toFixed(2)}%</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">执行时长</div>
                <div class="detail-value">${execution.executionDuration}ms</div>
            </div>
        </div>
        <h4 style="margin: 20px 0 10px 0;">生成的预警</h4>
        <div class="alerts-list">
            ${execution.alerts.map(alert => `
                <div class="alert-item ${alert.alertLevel.toLowerCase()}">
                    <div class="alert-header">
                        <div class="alert-title">${alert.title}</div>
                        <span class="alert-level-badge ${alert.alertLevel.toLowerCase()}">${getAlertLevelName(alert.alertLevel)}</span>
                    </div>
                    <div class="alert-desc">${alert.description}</div>
                    <div class="alert-entities">涉及对象: ${alert.involvedEntities.map(e => e.entityName).join(', ')}</div>
                </div>
            `).join('')}
        </div>
    `;
    
    document.getElementById('ruleDetailBody').innerHTML = detailHtml;
    document.getElementById('ruleDetailModal').classList.add('show');
}

/**
 * 规则测试相关
 */
function populateTestRuleSelect() {
    const rules = ruleService.getAllRules().filter(r => r.enabled);
    const select = document.getElementById('testRuleSelect');
    
    select.innerHTML = '<option value="">请选择规则</option>';
    rules.forEach(rule => {
        const option = document.createElement('option');
        option.value = rule.id;
        option.textContent = rule.ruleName;
        select.appendChild(option);
    });
}

function loadRuleForTest() {
    const ruleId = document.getElementById('testRuleSelect').value;
    if (!ruleId) return;
    
    const rule = ruleService.getRuleById(ruleId);
    if (rule) {
        // 可以在这里显示规则配置信息
        console.log('Selected rule for test:', rule);
    }
}

async function runRuleTest() {
    const ruleId = document.getElementById('testRuleSelect').value;
    if (!ruleId) {
        showNotification('请选择要测试的规则', 'warning');
        return;
    }
    
    let testData = null;
    const testDataInput = document.getElementById('testDataInput').value.trim();
    if (testDataInput) {
        try {
            testData = JSON.parse(testDataInput);
            if (!Array.isArray(testData)) {
                throw new Error('测试数据必须是数组格式');
            }
        } catch (error) {
            showNotification('测试数据格式错误: ' + error.message, 'error');
            return;
        }
    }
    
    try {
        showNotification('正在执行测试...', 'info');
        const result = await ruleService.testRule(ruleId, testData);
        displayTestResult(result);
        loadTestHistory();
        showNotification('测试完成', 'success');
    } catch (error) {
        showNotification('测试失败: ' + error.message, 'error');
    }
}

function displayTestResult(result) {
    const html = `
        <div class="test-result">
            <h4>测试结果</h4>
            <div class="test-metrics">
                <div class="test-metric">
                    <div class="test-metric-label">测试数据量</div>
                    <div class="test-metric-value">${result.testDataCount || '模拟数据'}</div>
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
            <h4 style="margin-top: 15px;">匹配的预警</h4>
            <div class="alerts-list">
                ${result.alerts.map(alert => `
                    <div class="alert-item ${alert.alertLevel.toLowerCase()}">
                        <div class="alert-header">
                            <div class="alert-title">${alert.title}</div>
                            <span class="alert-level-badge ${alert.alertLevel.toLowerCase()}">${getAlertLevelName(alert.alertLevel)}</span>
                        </div>
                        <div class="alert-desc">${alert.description}</div>
                        <div class="alert-entities">涉及对象: ${alert.involvedEntities.map(e => e.entityName).join(', ')}</div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    document.getElementById('testResultContainer').innerHTML = html;
}

function loadTestHistory() {
    const testResults = ruleService.getTestHistory();
    renderTestHistory(testResults.slice(0, 20)); // 只显示最近20条
}

function renderTestHistory(testResults) {
    const tbody = document.getElementById('testHistoryBody');
    if (testResults.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="empty-state">暂无测试历史</td></tr>';
        return;
    }
    
    tbody.innerHTML = testResults.map(test => `
        <tr>
            <td>${formatDateTime(test.testTime)}</td>
            <td>${test.ruleName}</td>
            <td>${test.testDataCount || '模拟数据'}</td>
            <td>${test.matchedCount}</td>
            <td>${test.matchRate}%</td>
            <td>${test.executionDuration}ms</td>
            <td>
                <button class="action-btn primary" onclick="viewTestDetail('${test.id}')">详情</button>
            </td>
        </tr>
    `).join('');
}

function viewTestDetail(testId) {
    const testResults = ruleService.getTestHistory();
    const test = testResults.find(t => t.id === testId);
    if (!test) return;
    
    displayTestResult(test);
}

/**
 * 工具函数
 */
function getDataSourceTypeName(type) {
    const names = {
        'procurement_db': '采购系统',
        'finance_db': '财务系统',
        'hr_db': '人事系统',
        'asset_db': '资产系统',
        'contract_db': '合同系统',
        'unified_db': '统一数据仓库',
        'external_api': '外部API'
    };
    return names[type] || type;
}

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

function formatDateTime(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function showNotification(message, type = 'info') {
    // 简单的通知实现
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : type === 'warning' ? '#ffc107' : '#17a2b8'};
        color: white;
        border-radius: 4px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// 添加动画样式
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

/**
 * 显示规则冲突
 */
function displayConflicts(conflicts) {
    const section = document.getElementById('conflictsSection');
    const container = document.getElementById('conflictsContainer');
    
    if (conflicts.length === 0) {
        section.style.display = 'none';
        return;
    }
    
    section.style.display = 'block';
    
    const html = `
        <div class="conflict-warning">
            <h4>检测到 ${conflicts.length} 个规则冲突</h4>
            ${conflicts.map((conflict, index) => `
                <div class="conflict-item">
                    <div class="conflict-rules">
                        冲突 ${index + 1}: ${conflict.rule1.name} ⚔️ ${conflict.rule2.name}
                    </div>
                    <div class="conflict-desc">
                        <strong>冲突类型:</strong> ${getConflictTypeName(conflict.conflictType)}<br>
                        <strong>描述:</strong> ${conflict.description}
                    </div>
                    <div style="margin-top: 10px;">
                        <button class="action-btn primary" onclick="viewRuleDetail('${conflict.rule1.id}')">查看规则1</button>
                        <button class="action-btn primary" onclick="viewRuleDetail('${conflict.rule2.id}')">查看规则2</button>
                        <button class="action-btn warning" onclick="resolveConflict('${conflict.rule1.id}', '${conflict.rule2.id}')">解决冲突</button>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
    
    container.innerHTML = html;
}

/**
 * 获取冲突类型名称
 */
function getConflictTypeName(type) {
    const names = {
        'PRIORITY_CONFLICT': '优先级冲突',
        'DUPLICATE_CONFIG': '配置重复',
        'LOGIC_CONFLICT': '逻辑冲突'
    };
    return names[type] || type;
}

/**
 * 解决冲突
 */
function resolveConflict(ruleId1, ruleId2) {
    const rule1 = ruleService.getRuleById(ruleId1);
    const rule2 = ruleService.getRuleById(ruleId2);
    
    if (!rule1 || !rule2) return;
    
    const action = confirm(
        `检测到规则冲突:\n\n` +
        `规则1: ${rule1.ruleName} (优先级: ${rule1.priority})\n` +
        `规则2: ${rule2.ruleName} (优先级: ${rule2.priority})\n\n` +
        `建议操作:\n` +
        `- 点击"确定"禁用优先级较低的规则\n` +
        `- 点击"取消"手动调整规则配置`
    );
    
    if (action) {
        // 禁用优先级较低的规则
        const lowerPriorityRule = rule1.priority < rule2.priority ? rule1 : rule2;
        try {
            ruleService.toggleRule(lowerPriorityRule.id, false);
            showNotification(`已禁用规则: ${lowerPriorityRule.ruleName}`, 'success');
            loadRules();
            loadOverviewData();
        } catch (error) {
            showNotification('操作失败: ' + error.message, 'error');
        }
    }
}

/**
 * 调整规则优先级
 */
function adjustRulePriority(ruleId, newPriority) {
    try {
        ruleService.updateRule(ruleId, { priority: newPriority });
        showNotification('优先级已更新', 'success');
        loadRules();
        loadOverviewData();
    } catch (error) {
        showNotification('更新失败: ' + error.message, 'error');
    }
}

/**
 * 按分组执行规则
 */
async function executeRulesByGroup(groupId) {
    const rules = ruleService.getAllRules().filter(r => r.groupId === groupId && r.enabled);
    
    if (rules.length === 0) {
        showNotification('该分组没有启用的规则', 'warning');
        return;
    }
    
    // 按优先级排序
    rules.sort((a, b) => b.priority - a.priority);
    
    showNotification(`正在执行分组 ${groupId} 的 ${rules.length} 条规则...`, 'info');
    
    const results = [];
    for (const rule of rules) {
        try {
            const result = await ruleService.executeRule(rule.id);
            results.push(result);
        } catch (error) {
            console.error(`规则 ${rule.ruleName} 执行失败:`, error);
        }
    }
    
    showNotification(`分组执行完成，共执行 ${results.length} 条规则`, 'success');
    loadRules();
    loadOverviewData();
    loadExecutionHistory();
}
