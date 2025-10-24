/**
 * 自定义建模工具
 */

class CustomModelBuilder {
    constructor() {
        this.currentModel = null;
        this.scenarios = [];
        this.rules = [];
        this.editingRuleIndex = -1;
        this.init();
    }

    init() {
        this.initNewModel();
        this.render();
    }

    initNewModel() {
        this.currentModel = {
            id: 'model_custom_' + Date.now(),
            name: '',
            type: 'CUSTOM',
            category: '',
            description: '',
            applicableScenarios: [],
            rules: [],
            version: '1.0',
            status: 'DRAFT'
        };
        this.scenarios = [];
        this.rules = [];
    }

    render() {
        this.renderBasicInfo();
        this.renderScenarios();
        this.renderRules();
    }

    renderBasicInfo() {
        document.getElementById('modelId').value = this.currentModel.id;
        document.getElementById('modelName').value = this.currentModel.name;
        document.getElementById('modelCategory').value = this.currentModel.category;
        document.getElementById('modelDescription').value = this.currentModel.description;
        document.getElementById('modelVersion').value = this.currentModel.version;
    }

    renderScenarios() {
        const container = document.getElementById('scenariosList');
        if (this.scenarios.length === 0) {
            container.innerHTML = '<p style="color: #999; font-size: 13px;">暂无场景</p>';
            return;
        }

        container.innerHTML = this.scenarios.map((scenario, index) => `
            <div class="scenario-item-editor">
                <input type="text" value="${scenario}" 
                    onchange="modelBuilder.updateScenario(${index}, this.value)">
                <button class="btn-remove" onclick="modelBuilder.removeScenario(${index})">删除</button>
            </div>
        `).join('');
    }

    renderRules() {
        const container = document.getElementById('rulesList');
        const emptyState = document.getElementById('emptyRules');

        if (this.rules.length === 0) {
            container.innerHTML = '';
            emptyState.style.display = 'block';
            return;
        }

        emptyState.style.display = 'none';
        container.innerHTML = this.rules.map((rule, index) => this.createRuleCard(rule, index)).join('');
    }

    createRuleCard(rule, index) {
        const alertLevelClass = rule.alertLevel.toLowerCase();
        const alertLevelText = {
            'HIGH': '高',
            'MEDIUM': '中',
            'LOW': '低'
        }[rule.alertLevel];

        const configDisplay = JSON.stringify(rule.config, null, 2);

        return `
            <div class="rule-card-editor">
                <div class="rule-card-header">
                    <div class="rule-card-title">
                        <div class="rule-card-name">${rule.ruleName}</div>
                        <span class="rule-card-type">${rule.ruleType}</span>
                    </div>
                    <div class="rule-card-actions">
                        <button class="btn-edit-rule" onclick="modelBuilder.editRule(${index})">编辑</button>
                        <button class="btn-delete-rule" onclick="modelBuilder.deleteRule(${index})">删除</button>
                    </div>
                </div>
                <div class="rule-card-description">${rule.description || '暂无描述'}</div>
                <div class="rule-card-config">${configDisplay}</div>
                <div class="rule-card-footer">
                    <span class="rule-alert-badge ${alertLevelClass}">预警等级: ${alertLevelText}</span>
                    <span class="rule-status">${rule.enabled ? '✅ 已启用' : '⭕ 已禁用'}</span>
                </div>
            </div>
        `;
    }

    // 场景管理
    addScenario() {
        document.getElementById('scenarioInput').value = '';
        document.getElementById('addScenarioDialog').style.display = 'flex';
    }

    saveScenario() {
        const scenario = document.getElementById('scenarioInput').value.trim();
        if (!scenario) {
            showNotification('error', '请输入场景描述');
            return;
        }

        this.scenarios.push(scenario);
        this.renderScenarios();
        this.closeScenarioDialog();
    }

    updateScenario(index, value) {
        this.scenarios[index] = value.trim();
    }

    removeScenario(index) {
        this.scenarios.splice(index, 1);
        this.renderScenarios();
    }

    closeScenarioDialog() {
        document.getElementById('addScenarioDialog').style.display = 'none';
    }

    // 规则管理
    addRule() {
        this.editingRuleIndex = -1;
        document.getElementById('ruleEditorTitle').textContent = '添加规则';
        document.getElementById('ruleEditorForm').reset();
        document.getElementById('ruleConfigArea').innerHTML = '';
        document.getElementById('ruleEditorDialog').style.display = 'flex';
    }

    editRule(index) {
        this.editingRuleIndex = index;
        const rule = this.rules[index];
        
        document.getElementById('ruleEditorTitle').textContent = '编辑规则';
        document.getElementById('ruleName').value = rule.ruleName;
        document.getElementById('ruleType').value = rule.ruleType;
        document.getElementById('ruleDescription').value = rule.description;
        document.getElementById('ruleAlertLevel').value = rule.alertLevel;
        document.getElementById('ruleEnabled').value = rule.enabled.toString();
        
        this.onRuleTypeChange();
        this.fillRuleConfig(rule.config);
        
        document.getElementById('ruleEditorDialog').style.display = 'flex';
    }

    deleteRule(index) {
        if (!confirm('确定要删除此规则吗？')) {
            return;
        }
        this.rules.splice(index, 1);
        this.renderRules();
    }

    onRuleTypeChange() {
        const ruleType = document.getElementById('ruleType').value;
        const configArea = document.getElementById('ruleConfigArea');
        
        if (!ruleType) {
            configArea.innerHTML = '';
            return;
        }

        let configHtml = '<div class="rule-config-section"><h4>规则配置</h4>';
        
        switch (ruleType) {
            case 'THRESHOLD':
                configHtml += this.getThresholdConfigHtml();
                break;
            case 'TREND':
                configHtml += this.getTrendConfigHtml();
                break;
            case 'CORRELATION':
                configHtml += this.getCorrelationConfigHtml();
                break;
            case 'SEQUENCE':
                configHtml += this.getSequenceConfigHtml();
                break;
            case 'GRAPH':
                configHtml += this.getGraphConfigHtml();
                break;
        }
        
        configHtml += '</div>';
        configArea.innerHTML = configHtml;
    }

    getThresholdConfigHtml() {
        return `
            <div class="form-group">
                <label>检查字段 *</label>
                <input type="text" id="configField" class="form-control" 
                    placeholder="例如: amount 或 actual_amount / budget_amount">
                <div class="config-help-text">支持字段名或简单表达式</div>
            </div>
            <div class="config-field-group">
                <div class="form-group">
                    <label>比较运算符 *</label>
                    <select id="configOperator" class="form-control">
                        <option value=">">大于 (&gt;)</option>
                        <option value="<">小于 (&lt;)</option>
                        <option value=">=">大于等于 (&gt;=)</option>
                        <option value="<=">小于等于 (&lt;=)</option>
                        <option value="==">等于 (==)</option>
                        <option value="!=">不等于 (!=)</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>阈值 *</label>
                    <input type="number" id="configThreshold" class="form-control" 
                        placeholder="例如: 100000">
                </div>
            </div>
            <div class="form-group">
                <label>时间窗口</label>
                <select id="configTimeWindow" class="form-control">
                    <option value="">不限</option>
                    <option value="daily">每日</option>
                    <option value="weekly">每周</option>
                    <option value="monthly">每月</option>
                    <option value="yearly">每年</option>
                </select>
            </div>
            <div class="form-group">
                <label>分组字段</label>
                <input type="text" id="configGroupBy" class="form-control" 
                    placeholder="例如: department_id">
                <div class="config-help-text">按指定字段分组检查</div>
            </div>
        `;
    }

    getTrendConfigHtml() {
        return `
            <div class="form-group">
                <label>检查字段 *</label>
                <input type="text" id="configField" class="form-control" 
                    placeholder="例如: expense">
            </div>
            <div class="form-group">
                <label>时间窗口 *</label>
                <select id="configTimeWindow" class="form-control">
                    <option value="7d">最近7天</option>
                    <option value="30d">最近30天</option>
                    <option value="90d">最近90天</option>
                </select>
            </div>
            <div class="form-group">
                <label>趋势条件 *</label>
                <input type="text" id="configCondition" class="form-control" 
                    placeholder="例如: increase > 50%">
                <div class="config-help-text">支持: increase/decrease > X%</div>
            </div>
        `;
    }

    getCorrelationConfigHtml() {
        return `
            <div class="form-group">
                <label>关联实体 *</label>
                <input type="text" id="configEntities" class="form-control" 
                    placeholder="例如: person,supplier (逗号分隔)">
            </div>
            <div class="form-group">
                <label>关联关系 *</label>
                <input type="text" id="configRelations" class="form-control" 
                    placeholder="例如: family_relation,investment_relation (逗号分隔)">
            </div>
        `;
    }

    getSequenceConfigHtml() {
        return `
            <div class="form-group">
                <label>事件序列 *</label>
                <input type="text" id="configEvents" class="form-control" 
                    placeholder="例如: approval_skip,payment_advance (逗号分隔)">
            </div>
            <div class="form-group">
                <label>时间窗口 *</label>
                <select id="configTimeWindow" class="form-control">
                    <option value="1d">1天内</option>
                    <option value="7d">7天内</option>
                    <option value="30d">30天内</option>
                </select>
            </div>
        `;
    }

    getGraphConfigHtml() {
        return `
            <div class="form-group">
                <label>图谱模式 *</label>
                <input type="text" id="configPattern" class="form-control" 
                    placeholder="例如: person->company->contract">
                <div class="config-help-text">使用->表示关系方向</div>
            </div>
            <div class="form-group">
                <label>匹配条件</label>
                <textarea id="configCondition" class="form-control" rows="2" 
                    placeholder="例如: person.role=approver AND company.owner=person.relative"></textarea>
            </div>
        `;
    }

    fillRuleConfig(config) {
        // 根据配置填充表单
        for (const key in config) {
            const element = document.getElementById('config' + key.charAt(0).toUpperCase() + key.slice(1));
            if (element) {
                if (Array.isArray(config[key])) {
                    element.value = config[key].join(',');
                } else {
                    element.value = config[key];
                }
            }
        }
    }

    saveRule() {
        const ruleName = document.getElementById('ruleName').value.trim();
        const ruleType = document.getElementById('ruleType').value;
        const ruleDescription = document.getElementById('ruleDescription').value.trim();
        const alertLevel = document.getElementById('ruleAlertLevel').value;
        const enabled = document.getElementById('ruleEnabled').value === 'true';

        if (!ruleName) {
            showNotification('error', '请输入规则名称');
            return;
        }

        if (!ruleType) {
            showNotification('error', '请选择规则类型');
            return;
        }

        const config = this.collectRuleConfig(ruleType);
        if (!config) {
            return;
        }

        const rule = {
            ruleId: 'rule_' + Date.now(),
            ruleName: ruleName,
            ruleType: ruleType,
            description: ruleDescription,
            config: config,
            alertLevel: alertLevel,
            enabled: enabled
        };

        if (this.editingRuleIndex >= 0) {
            this.rules[this.editingRuleIndex] = rule;
        } else {
            this.rules.push(rule);
        }

        this.renderRules();
        this.closeRuleEditor();
        showNotification('success', '规则保存成功');
    }

    collectRuleConfig(ruleType) {
        const config = {};

        switch (ruleType) {
            case 'THRESHOLD':
                config.field = document.getElementById('configField')?.value.trim();
                config.operator = document.getElementById('configOperator')?.value;
                config.threshold = parseFloat(document.getElementById('configThreshold')?.value);
                config.timeWindow = document.getElementById('configTimeWindow')?.value;
                config.groupBy = document.getElementById('configGroupBy')?.value.trim();

                if (!config.field || !config.operator || isNaN(config.threshold)) {
                    showNotification('error', '请填写必填的配置项');
                    return null;
                }
                break;

            case 'TREND':
                config.field = document.getElementById('configField')?.value.trim();
                config.timeWindow = document.getElementById('configTimeWindow')?.value;
                config.condition = document.getElementById('configCondition')?.value.trim();

                if (!config.field || !config.timeWindow || !config.condition) {
                    showNotification('error', '请填写必填的配置项');
                    return null;
                }
                break;

            case 'CORRELATION':
                const entities = document.getElementById('configEntities')?.value.trim();
                const relations = document.getElementById('configRelations')?.value.trim();
                
                if (!entities || !relations) {
                    showNotification('error', '请填写必填的配置项');
                    return null;
                }
                
                config.entities = entities.split(',').map(e => e.trim());
                config.relations = relations.split(',').map(r => r.trim());
                break;

            case 'SEQUENCE':
                const events = document.getElementById('configEvents')?.value.trim();
                config.timeWindow = document.getElementById('configTimeWindow')?.value;
                
                if (!events || !config.timeWindow) {
                    showNotification('error', '请填写必填的配置项');
                    return null;
                }
                
                config.events = events.split(',').map(e => e.trim());
                break;

            case 'GRAPH':
                config.pattern = document.getElementById('configPattern')?.value.trim();
                config.condition = document.getElementById('configCondition')?.value.trim();
                
                if (!config.pattern) {
                    showNotification('error', '请填写必填的配置项');
                    return null;
                }
                break;
        }

        return config;
    }

    closeRuleEditor() {
        document.getElementById('ruleEditorDialog').style.display = 'none';
    }

    // 模型保存
    saveModel() {
        const name = document.getElementById('modelName').value.trim();
        const category = document.getElementById('modelCategory').value;
        const description = document.getElementById('modelDescription').value.trim();
        const version = document.getElementById('modelVersion').value.trim();

        if (!name) {
            showNotification('error', '请输入模型名称');
            return;
        }

        if (!category) {
            showNotification('error', '请选择模型分类');
            return;
        }

        if (this.rules.length === 0) {
            showNotification('error', '请至少添加一条规则');
            return;
        }

        const modelData = {
            name: name,
            category: category,
            description: description || '暂无描述',
            applicableScenarios: this.scenarios,
            rules: this.rules,
            version: version
        };

        // 检查是否是更新现有模型
        const existingModel = window.supervisionModelService.getModelById(this.currentModel.id);
        
        if (existingModel && existingModel.type === 'CUSTOM') {
            window.supervisionModelService.updateCustomModel(this.currentModel.id, modelData);
            showNotification('success', '模型更新成功');
        } else {
            window.supervisionModelService.createCustomModel(modelData);
            showNotification('success', '模型创建成功');
        }

        // 重置表单
        setTimeout(() => {
            if (confirm('是否继续创建新模型？')) {
                this.initNewModel();
                this.render();
            } else {
                window.location.href = 'supervision-model-library.html';
            }
        }, 1000);
    }

    // 加载模型
    loadModel() {
        const models = window.supervisionModelService.getCustomModels();
        
        if (models.length === 0) {
            showNotification('info', '暂无可加载的自定义模型');
            return;
        }

        const listHtml = models.map(model => `
            <div class="model-select-item" onclick="modelBuilder.selectModel('${model.id}')">
                <div class="model-select-item-header">
                    <span class="model-select-item-name">${model.name}</span>
                    <span class="model-select-item-type">${model.type === 'PRESET' ? '预置' : '自定义'}</span>
                </div>
                <div class="model-select-item-category">${model.category}</div>
                <div class="model-select-item-description">${model.description}</div>
            </div>
        `).join('');

        document.getElementById('modelSelectList').innerHTML = listHtml;
        document.getElementById('loadModelDialog').style.display = 'flex';
    }

    selectModel(modelId) {
        const model = window.supervisionModelService.getModelById(modelId);
        if (!model) return;

        this.currentModel = { ...model };
        this.scenarios = [...(model.applicableScenarios || [])];
        this.rules = model.rules.map(r => ({ ...r }));
        
        this.render();
        this.closeLoadDialog();
        showNotification('success', '模型加载成功');
    }

    closeLoadDialog() {
        document.getElementById('loadModelDialog').style.display = 'none';
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    window.modelBuilder = new CustomModelBuilder();
});
