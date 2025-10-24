/**
 * 监督模型库页面逻辑
 */

class SupervisionModelLibraryPage {
    constructor() {
        this.currentFilters = {
            type: '',
            category: '',
            status: ''
        };
        this.currentModelId = null;
        this.selectedRules = [];
        this.tempSelectedRules = [];
        this.availableRules = [];
        this.init();
    }

    init() {
        this.loadStatistics();
        this.loadModels();
        this.bindEvents();
        this.checkUrlParams();
    }

    checkUrlParams() {
        // 检查URL参数，如果有编辑请求则打开编辑对话框
        const urlParams = new URLSearchParams(window.location.search);
        const action = urlParams.get('action');
        const id = urlParams.get('id');

        if (action === 'edit' && id) {
            setTimeout(() => {
                this.editModel(id);
            }, 500);
        }
    }

    bindEvents() {
        // 筛选器变化
        document.getElementById('filterType').addEventListener('change', (e) => {
            this.currentFilters.type = e.target.value;
            this.loadModels();
        });

        document.getElementById('filterCategory').addEventListener('change', (e) => {
            this.currentFilters.category = e.target.value;
            this.loadModels();
        });

        document.getElementById('filterStatus').addEventListener('change', (e) => {
            this.currentFilters.status = e.target.value;
            this.loadModels();
        });
    }

    loadStatistics() {
        const stats = window.supervisionModelService.getModelStatistics();
        
        document.getElementById('totalModels').textContent = stats.total;
        document.getElementById('activeModels').textContent = stats.active;
        document.getElementById('customModels').textContent = stats.custom;
        document.getElementById('categoryCount').textContent = Object.keys(stats.byCategory).length;
    }

    loadModels() {
        let models = window.supervisionModelService.getAllModels();
        
        // 应用筛选
        if (this.currentFilters.type) {
            models = models.filter(m => m.type === this.currentFilters.type);
        }
        if (this.currentFilters.category) {
            models = models.filter(m => m.category === this.currentFilters.category);
        }
        if (this.currentFilters.status) {
            models = models.filter(m => m.status === this.currentFilters.status);
        }

        this.renderModels(models);
    }

    resetFilters() {
        this.currentFilters = {
            type: '',
            category: '',
            status: ''
        };
        document.getElementById('filterType').value = '';
        document.getElementById('filterCategory').value = '';
        document.getElementById('filterStatus').value = '';
        this.loadModels();
    }

    renderModels(models) {
        const container = document.getElementById('modelList');
        
        if (models.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="icon">📦</div>
                    <p>暂无符合条件的模型</p>
                </div>
            `;
            return;
        }

        container.innerHTML = models.map(model => this.createModelCard(model)).join('');
    }

    createModelCard(model) {
        const typeBadge = model.type === 'PRESET' ? 
            '<span class="badge badge-preset">预置</span>' : 
            '<span class="badge badge-custom">自定义</span>';
        
        const statusBadge = model.status === 'ACTIVE' ? 
            '<span class="badge badge-active">已启用</span>' : 
            model.status === 'INACTIVE' ?
            '<span class="badge badge-inactive">已禁用</span>' :
            '<span class="badge badge-draft">草稿</span>';

        const scenarios = model.applicableScenarios || [];
        const scenarioTags = scenarios.slice(0, 3).map(s => 
            `<span class="scenario-tag">${s}</span>`
        ).join('');
        const moreScenarios = scenarios.length > 3 ? 
            `<span class="scenario-tag">+${scenarios.length - 3}个</span>` : '';

        const enableButton = model.status === 'ACTIVE' ?
            `<button class="btn-sm btn-disable" onclick="modelLibraryPage.disableModel('${model.id}')">禁用</button>` :
            `<button class="btn-sm btn-enable" onclick="modelLibraryPage.enableModel('${model.id}')">启用</button>`;

        const editButton = model.type === 'CUSTOM' ?
            `<button class="btn-sm btn-edit" onclick="modelLibraryPage.editModel('${model.id}')">编辑</button>` : '';

        const deleteButton = model.type === 'CUSTOM' ?
            `<button class="btn-sm btn-delete" onclick="modelLibraryPage.deleteModel('${model.id}')">删除</button>` : '';

        return `
            <div class="model-card">
                <div class="model-card-header">
                    <div>
                        <div class="model-title">${model.name}</div>
                        <div class="model-badges">
                            ${typeBadge}
                            ${statusBadge}
                        </div>
                    </div>
                </div>
                
                <div class="model-category">${model.category}</div>
                
                <div class="model-description">${model.description}</div>
                
                ${scenarios.length > 0 ? `
                    <div class="model-scenarios">
                        <div class="model-scenarios-title">适用场景：</div>
                        <div class="scenario-tags">
                            ${scenarioTags}
                            ${moreScenarios}
                        </div>
                    </div>
                ` : ''}
                
                <div class="model-rules-count">
                    <span class="icon">📋</span>
                    <span>包含 ${model.rules.length} 条检查规则</span>
                </div>
                
                <div class="model-card-footer">
                    <div class="model-meta">
                        版本 ${model.version}
                    </div>
                    <div class="model-actions">
                        <button class="btn-sm btn-view" onclick="modelLibraryPage.viewModelDetail('${model.id}')">
                            查看详情
                        </button>
                        ${enableButton}
                        ${editButton}
                        ${deleteButton}
                    </div>
                </div>
            </div>
        `;
    }

    viewModelDetail(modelId) {
        // 跳转到详情页面
        window.location.href = `supervision-model-detail.html?id=${modelId}`;
    }



    enableModel(modelId) {
        const result = window.supervisionModelService.enableModel(modelId);
        if (result.success) {
            showNotification('success', result.message);
            this.loadStatistics();
            this.loadModels();
        } else {
            showNotification('error', result.message);
        }
    }

    disableModel(modelId) {
        if (!confirm('确定要禁用此模型吗？禁用后将不再执行该模型的检查规则。')) {
            return;
        }
        
        const result = window.supervisionModelService.disableModel(modelId);
        if (result.success) {
            showNotification('success', result.message);
            this.loadStatistics();
            this.loadModels();
        } else {
            showNotification('error', result.message);
        }
    }

    showCustomModelDialog() {
        document.getElementById('customModelForm').reset();
        document.getElementById('editModelId').value = '';
        document.getElementById('customModelDialogTitle').textContent = '创建自定义模型';
        document.getElementById('saveButtonText').textContent = '创建';
        this.selectedRules = [];
        this.renderSelectedRules();
        
        const modal = document.getElementById('customModelDialog');
        modal.style.display = 'flex';
        setTimeout(() => modal.classList.add('modal-show'), 10);
    }

    closeCustomModelDialog() {
        const modal = document.getElementById('customModelDialog');
        modal.classList.remove('modal-show');
        setTimeout(() => {
            modal.style.display = 'none';
            document.getElementById('customModelForm').reset();
            this.selectedRules = [];
        }, 300);
    }

    saveCustomModel() {
        const editModelId = document.getElementById('editModelId').value;
        const name = document.getElementById('customModelName').value.trim();
        const category = document.getElementById('customModelCategory').value;
        const version = document.getElementById('customModelVersion').value.trim() || '1.0.0';
        const description = document.getElementById('customModelDescription').value.trim();
        const scenariosText = document.getElementById('customModelScenarios').value.trim();

        if (!name) {
            showNotification('error', '请输入模型名称');
            return;
        }

        if (!category) {
            showNotification('error', '请选择模型分类');
            return;
        }

        const scenarios = scenariosText ? 
            scenariosText.split('\n').map(s => s.trim()).filter(s => s) : [];

        const modelData = {
            name: name,
            category: category,
            version: version,
            description: description || '暂无描述',
            applicableScenarios: scenarios,
            rules: this.selectedRules || []
        };

        if (editModelId) {
            // 更新模型
            const result = window.supervisionModelService.updateCustomModel(editModelId, modelData);
            if (result.success) {
                showNotification('success', '模型更新成功');
            } else {
                showNotification('error', result.message);
                return;
            }
        } else {
            // 创建新模型
            window.supervisionModelService.createCustomModel(modelData);
            showNotification('success', '自定义模型创建成功');
        }
        
        this.closeCustomModelDialog();
        this.loadStatistics();
        this.loadModels();
    }

    showRuleSelector() {
        this.tempSelectedRules = [...(this.selectedRules || [])];
        this.loadAvailableRules();
        
        const modal = document.getElementById('ruleSelectorDialog');
        modal.style.display = 'flex';
        setTimeout(() => modal.classList.add('modal-show'), 10);

        // 绑定搜索和筛选事件
        document.getElementById('ruleSelectorSearch').addEventListener('input', () => this.filterRules());
        document.getElementById('ruleSelectorCategory').addEventListener('change', () => this.filterRules());
    }

    closeRuleSelector() {
        const modal = document.getElementById('ruleSelectorDialog');
        modal.classList.remove('modal-show');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }

    loadAvailableRules() {
        // 从规则引擎服务获取所有规则
        this.availableRules = window.ruleEngineService ? 
            window.ruleEngineService.getAllRules() : [];
        this.filterRules();
    }

    filterRules() {
        const searchText = document.getElementById('ruleSelectorSearch').value.toLowerCase();
        const category = document.getElementById('ruleSelectorCategory').value;

        let filtered = this.availableRules.filter(rule => {
            const matchSearch = !searchText || 
                rule.ruleName.toLowerCase().includes(searchText) ||
                rule.description.toLowerCase().includes(searchText);
            const matchCategory = !category || rule.category === category;
            return matchSearch && matchCategory;
        });

        this.renderRuleList(filtered);
    }

    renderRuleList(rules) {
        const container = document.getElementById('ruleSelectorList');
        
        if (rules.length === 0) {
            container.innerHTML = '<p style="color: #6B7280; text-align: center; padding: 40px;">暂无可用规则</p>';
            return;
        }

        container.innerHTML = rules.map(rule => {
            const isSelected = this.tempSelectedRules.some(r => r.id === rule.id);
            return `
                <div class="rule-selector-item ${isSelected ? 'selected' : ''}" data-rule-id="${rule.id}">
                    <div class="rule-selector-checkbox">
                        <input type="checkbox" ${isSelected ? 'checked' : ''} 
                            onchange="modelLibraryPage.toggleRuleSelection('${rule.id}')">
                    </div>
                    <div class="rule-selector-info">
                        <div class="rule-selector-name">${rule.ruleName}</div>
                        <div class="rule-selector-desc">${rule.description}</div>
                        <div class="rule-selector-meta">
                            <span class="rule-type-badge">${rule.ruleType}</span>
                            <span class="rule-alert-badge ${rule.alertLevel.toLowerCase()}">${rule.alertLevel}</span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    toggleRuleSelection(ruleId) {
        const rule = this.availableRules.find(r => r.id === ruleId);
        if (!rule) return;

        const index = this.tempSelectedRules.findIndex(r => r.id === ruleId);
        if (index > -1) {
            this.tempSelectedRules.splice(index, 1);
        } else {
            this.tempSelectedRules.push(rule);
        }

        // 更新UI
        const item = document.querySelector(`[data-rule-id="${ruleId}"]`);
        if (item) {
            item.classList.toggle('selected');
        }
    }

    confirmRuleSelection() {
        this.selectedRules = [...this.tempSelectedRules];
        this.renderSelectedRules();
        this.closeRuleSelector();
        showNotification('success', `已选择 ${this.selectedRules.length} 条规则`);
    }

    renderSelectedRules() {
        const container = document.getElementById('selectedRules');
        const countEl = document.getElementById('selectedRulesCount');
        
        // 更新计数
        if (countEl) {
            countEl.textContent = this.selectedRules ? this.selectedRules.length : 0;
        }
        
        if (!this.selectedRules || this.selectedRules.length === 0) {
            container.innerHTML = '';
            return;
        }

        container.innerHTML = this.selectedRules.map(rule => `
            <div class="selected-rule-tag">
                <i class="fas fa-check-circle"></i>
                <span>${rule.ruleName}</span>
                <button type="button" class="remove-rule-btn" onclick="modelLibraryPage.removeSelectedRule('${rule.id}')">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `).join('');
    }

    removeSelectedRule(ruleId) {
        this.selectedRules = this.selectedRules.filter(r => r.id !== ruleId);
        this.renderSelectedRules();
    }

    editModel(modelId) {
        const model = window.supervisionModelService.getModelById(modelId);
        if (!model) {
            showNotification('error', '模型不存在');
            return;
        }

        if (model.type === 'PRESET') {
            showNotification('warning', '预置模型不支持编辑');
            return;
        }

        // 填充表单
        document.getElementById('editModelId').value = model.id;
        document.getElementById('customModelName').value = model.name;
        document.getElementById('customModelCategory').value = model.category;
        document.getElementById('customModelVersion').value = model.version || '1.0.0';
        document.getElementById('customModelDescription').value = model.description;
        
        const scenariosText = (model.applicableScenarios || []).join('\n');
        document.getElementById('customModelScenarios').value = scenariosText;

        // 设置已选规则
        this.selectedRules = [...model.rules];
        this.renderSelectedRules();

        // 更新对话框标题
        document.getElementById('customModelDialogTitle').textContent = '编辑自定义模型';
        document.getElementById('saveButtonText').textContent = '保存';

        const modal = document.getElementById('customModelDialog');
        modal.style.display = 'flex';
        setTimeout(() => modal.classList.add('modal-show'), 10);
    }

    deleteModel(modelId) {
        if (!confirm('确定要删除此自定义模型吗？此操作不可恢复。')) {
            return;
        }

        const result = window.supervisionModelService.deleteCustomModel(modelId);
        if (result.success) {
            showNotification('success', result.message);
            this.loadStatistics();
            this.loadModels();
        } else {
            showNotification('error', result.message);
        }
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    window.modelLibraryPage = new SupervisionModelLibraryPage();
});
