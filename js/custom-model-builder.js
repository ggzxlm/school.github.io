/**
 * 自定义建模工具
 */

class CustomModelBuilder {
    constructor() {
        this.currentStep = 1;
        this.selectedRules = [];
        this.modelData = {
            name: '',
            category: '',
            description: '',
            scenarios: [],
            rules: []
        };
        this.init();
    }

    init() {
        this.showStep(1);
        this.loadAvailableRules();
    }

    // 步骤导航
    showStep(step) {
        // 隐藏所有步骤
        for (let i = 1; i <= 4; i++) {
            const stepContent = document.getElementById(`step${i}`);
            if (stepContent) {
                stepContent.style.display = 'none';
            }
            
            const stepIndicator = document.querySelector(`.step[data-step="${i}"]`);
            if (stepIndicator) {
                stepIndicator.classList.remove('active');
                if (i < step) {
                    stepIndicator.classList.add('completed');
                } else {
                    stepIndicator.classList.remove('completed');
                }
            }
        }

        // 显示当前步骤
        const currentStepContent = document.getElementById(`step${step}`);
        if (currentStepContent) {
            currentStepContent.style.display = 'block';
        }

        const currentStepIndicator = document.querySelector(`.step[data-step="${step}"]`);
        if (currentStepIndicator) {
            currentStepIndicator.classList.add('active');
        }

        this.currentStep = step;

        // 根据步骤执行特定操作
        if (step === 2) {
            this.renderRulesGrid();
        } else if (step === 3) {
            this.renderRuleConfigs();
        } else if (step === 4) {
            this.renderPreview();
        }
    }

    nextStep() {
        if (this.validateCurrentStep()) {
            this.saveCurrentStepData();
            if (this.currentStep < 4) {
                this.showStep(this.currentStep + 1);
            }
        }
    }

    prevStep() {
        if (this.currentStep > 1) {
            this.showStep(this.currentStep - 1);
        }
    }

    validateCurrentStep() {
        if (this.currentStep === 1) {
            const name = document.getElementById('modelName').value.trim();
            const category = document.getElementById('modelCategory').value;
            
            if (!name) {
                showNotification('warning', '请输入模型名称');
                return false;
            }
            if (!category) {
                showNotification('warning', '请选择模型分类');
                return false;
            }
        } else if (this.currentStep === 2) {
            if (this.selectedRules.length === 0) {
                showNotification('warning', '请至少选择一条规则');
                return false;
            }
        }
        return true;
    }

    saveCurrentStepData() {
        if (this.currentStep === 1) {
            this.modelData.name = document.getElementById('modelName').value.trim();
            this.modelData.category = document.getElementById('modelCategory').value;
            this.modelData.description = document.getElementById('modelDescription').value.trim();
            
            const scenariosText = document.getElementById('modelScenarios').value.trim();
            this.modelData.scenarios = scenariosText ? 
                scenariosText.split('\n').map(s => s.trim()).filter(s => s) : [];
        }
    }

    // 加载可用规则
    loadAvailableRules() {
        if (window.ruleEngineService) {
            this.availableRules = window.ruleEngineService.getAllRules();
        } else {
            this.availableRules = [];
        }
    }

    // 渲染规则网格
    renderRulesGrid() {
        const container = document.getElementById('rulesGrid');
        
        if (this.availableRules.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: #999; padding: 40px;">暂无可用规则</p>';
            return;
        }

        container.innerHTML = this.availableRules.map(rule => {
            const isSelected = this.selectedRules.some(r => r.id === rule.id);
            const levelClass = rule.alertLevel.toLowerCase();
            const levelText = {
                'HIGH': '高',
                'MEDIUM': '中',
                'LOW': '低'
            }[rule.alertLevel] || rule.alertLevel;

            return `
                <div class="rule-card ${isSelected ? 'selected' : ''}" onclick="modelBuilder.toggleRule('${rule.id}')">
                    <div class="rule-card-header">
                        <div class="rule-card-title">${rule.ruleName}</div>
                        <input type="checkbox" class="rule-card-checkbox" ${isSelected ? 'checked' : ''}>
                    </div>
                    <div class="rule-card-description">${rule.description}</div>
                    <div class="rule-card-meta">
                        <span class="rule-type-badge">${rule.ruleType}</span>
                        <span class="rule-level-badge ${levelClass}">${levelText}</span>
                    </div>
                </div>
            `;
        }).join('');

        this.updateSelectedCount();
    }

    toggleRule(ruleId) {
        const rule = this.availableRules.find(r => r.id === ruleId);
        if (!rule) return;

        const index = this.selectedRules.findIndex(r => r.id === ruleId);
        if (index > -1) {
            this.selectedRules.splice(index, 1);
        } else {
            this.selectedRules.push(rule);
        }

        this.renderRulesGrid();
    }

    updateSelectedCount() {
        const countEl = document.getElementById('selectedCount');
        if (countEl) {
            countEl.textContent = this.selectedRules.length;
        }
    }

    // 渲染规则配置
    renderRuleConfigs() {
        const container = document.getElementById('ruleConfigList');
        
        if (this.selectedRules.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: #999; padding: 40px;">未选择规则</p>';
            return;
        }

        container.innerHTML = this.selectedRules.map(rule => `
            <div class="rule-config-item">
                <div class="rule-config-header">
                    <i class="fas fa-cog"></i>
                    ${rule.ruleName}
                </div>
                <div class="form-group">
                    <label class="form-label">规则状态</label>
                    <select class="form-control" data-rule-id="${rule.id}" data-config="enabled">
                        <option value="true" selected>启用</option>
                        <option value="false">禁用</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">预警等级</label>
                    <select class="form-control" data-rule-id="${rule.id}" data-config="alertLevel">
                        <option value="HIGH" ${rule.alertLevel === 'HIGH' ? 'selected' : ''}>高</option>
                        <option value="MEDIUM" ${rule.alertLevel === 'MEDIUM' ? 'selected' : ''}>中</option>
                        <option value="LOW" ${rule.alertLevel === 'LOW' ? 'selected' : ''}>低</option>
                    </select>
                </div>
            </div>
        `).join('');
    }

    // 渲染预览
    renderPreview() {
        const container = document.getElementById('modelPreview');
        
        const scenariosHtml = this.modelData.scenarios.length > 0 ?
            this.modelData.scenarios.map(s => `<li>${s}</li>`).join('') :
            '<li style="color: #999;">暂无</li>';

        const rulesHtml = this.selectedRules.map(rule => `
            <li>${rule.ruleName} (${rule.ruleType})</li>
        `).join('');

        container.innerHTML = `
            <div class="preview-section">
                <div class="preview-section-title">
                    <i class="fas fa-info-circle"></i>
                    基本信息
                </div>
                <div class="preview-content">
                    <div class="preview-item">
                        <div class="preview-label">模型名称：</div>
                        <div class="preview-value">${this.modelData.name}</div>
                    </div>
                    <div class="preview-item">
                        <div class="preview-label">模型分类：</div>
                        <div class="preview-value">${this.modelData.category}</div>
                    </div>
                    <div class="preview-item">
                        <div class="preview-label">模型描述：</div>
                        <div class="preview-value">${this.modelData.description || '暂无'}</div>
                    </div>
                </div>
            </div>

            <div class="preview-section">
                <div class="preview-section-title">
                    <i class="fas fa-list-ul"></i>
                    适用场景
                </div>
                <div class="preview-content">
                    <ul style="margin: 0; padding-left: 20px;">
                        ${scenariosHtml}
                    </ul>
                </div>
            </div>

            <div class="preview-section">
                <div class="preview-section-title">
                    <i class="fas fa-list-check"></i>
                    检查规则（${this.selectedRules.length}条）
                </div>
                <div class="preview-content">
                    <ul style="margin: 0; padding-left: 20px;">
                        ${rulesHtml}
                    </ul>
                </div>
            </div>
        `;
    }

    // 保存模型
    saveModel() {
        showNotification('info', '保存功能开发中');
    }

    // 加载模型
    loadModel() {
        showNotification('info', '加载功能开发中');
    }

    // 保存并完成
    saveAndFinish() {
        if (!window.supervisionModelService) {
            showNotification('error', '监督模型服务未初始化');
            return;
        }

        const modelData = {
            name: this.modelData.name,
            category: this.modelData.category,
            description: this.modelData.description,
            applicableScenarios: this.modelData.scenarios,
            rules: this.selectedRules
        };

        try {
            window.supervisionModelService.createCustomModel(modelData);
            showNotification('success', '模型创建成功！');
            
            setTimeout(() => {
                window.location.href = 'supervision-model-library.html';
            }, 1500);
        } catch (error) {
            showNotification('error', '创建失败：' + error.message);
        }
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    window.modelBuilder = new CustomModelBuilder();
});
