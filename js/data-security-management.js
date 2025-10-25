/**
 * 数据安全管理页面脚本
 */

class DataSecurityPage {
    constructor() {
        this.currentTab = 'policies';
        this.currentPage = 1;
        this.pageSize = 10;
        this.searchKeyword = '';
    }

    async init() {
        try {
            Loading.show('加载中...');
            await dataSecurityService.initialize();
            await this.loadData();
            this.updateStatistics();
            Loading.hide();
        } catch (error) {
            console.error('初始化失败:', error);
            Loading.hide();
            Toast.error('初始化失败');
        }
    }

    updateStatistics() {
        const stats = dataSecurityService.getStatistics();
        document.getElementById('policyCount').textContent = stats.policyCount;
        document.getElementById('maskingCount').textContent = stats.maskingCount;
        document.getElementById('accessCount').textContent = stats.accessCount;
        document.getElementById('todayAccessCount').textContent = stats.todayAccessCount;
    }

    async loadData() {
        const filters = {
            status: document.getElementById('filter-status')?.value || '',
            search: this.searchKeyword
        };

        let data = [];
        if (this.currentTab === 'policies') {
            data = dataSecurityService.getPolicies(filters);
            this.renderPoliciesTable(data);
        } else if (this.currentTab === 'masking') {
            data = dataSecurityService.getMaskingRules(filters);
            this.renderMaskingTable(data);
        } else if (this.currentTab === 'access') {
            data = dataSecurityService.getAccessControls(filters);
            this.renderAccessTable(data);
        } else if (this.currentTab === 'audit') {
            data = dataSecurityService.getAuditLogs(filters);
            this.renderAuditTable(data);
        }
    }

    renderPoliciesTable(data) {
        const header = document.getElementById('tableHeader');
        const body = document.getElementById('tableBody');
        const emptyState = document.getElementById('emptyState');

        header.innerHTML = `
            <tr>
                <th>策略名称</th>
                <th>策略类型</th>
                <th>安全级别</th>
                <th>状态</th>
                <th>描述</th>
                <th>创建时间</th>
                <th width="120">操作</th>
            </tr>
        `;

        if (data.length === 0) {
            body.innerHTML = '';
            emptyState.style.display = 'flex';
            return;
        }

        emptyState.style.display = 'none';
        body.innerHTML = data.map(item => `
            <tr>
                <td>${item.name}</td>
                <td><span class="badge badge-info">${item.type}</span></td>
                <td><span class="badge badge-${item.level === '高' ? 'danger' : 'warning'}">${item.level}</span></td>
                <td><span class="badge badge-${item.status === 'enabled' ? 'success' : 'secondary'}">${item.status === 'enabled' ? '启用' : '禁用'}</span></td>
                <td>${item.description}</td>
                <td>${item.createTime}</td>
                <td>
                    <div class="action-btns">
                        <button class="btn-icon" onclick="securityPage.viewDetail('${item.id}')" title="查看详情">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn-icon" onclick="securityPage.editPolicy('${item.id}')" title="编辑">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-icon" onclick="securityPage.toggleStatus('${item.id}')" title="切换状态">
                            <i class="fas fa-power-off"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    renderMaskingTable(data) {
        const header = document.getElementById('tableHeader');
        const body = document.getElementById('tableBody');

        header.innerHTML = `
            <tr>
                <th>规则名称</th>
                <th>字段名</th>
                <th>脱敏类型</th>
                <th>脱敏模式</th>
                <th>应用次数</th>
                <th>状态</th>
                <th>创建时间</th>
            </tr>
        `;

        body.innerHTML = data.map(item => `
            <tr>
                <td>${item.name}</td>
                <td><code>${item.field}</code></td>
                <td>${item.maskType}</td>
                <td>${item.pattern}</td>
                <td>${item.applyCount}</td>
                <td><span class="badge badge-${item.status === 'enabled' ? 'success' : 'secondary'}">${item.status === 'enabled' ? '启用' : '禁用'}</span></td>
                <td>${item.createTime}</td>
            </tr>
        `).join('');
    }

    renderAccessTable(data) {
        const header = document.getElementById('tableHeader');
        const body = document.getElementById('tableBody');

        header.innerHTML = `
            <tr>
                <th>资源</th>
                <th>用户</th>
                <th>角色</th>
                <th>权限</th>
                <th>状态</th>
                <th>授权时间</th>
                <th>过期时间</th>
            </tr>
        `;

        body.innerHTML = data.map(item => `
            <tr>
                <td><code>${item.resource}</code></td>
                <td>${item.user}</td>
                <td><span class="badge badge-primary">${item.role}</span></td>
                <td>${item.permission}</td>
                <td><span class="badge badge-${item.status === 'enabled' ? 'success' : 'secondary'}">${item.status === 'enabled' ? '启用' : '禁用'}</span></td>
                <td>${item.grantTime}</td>
                <td>${item.expireTime}</td>
            </tr>
        `).join('');
    }

    renderAuditTable(data) {
        const header = document.getElementById('tableHeader');
        const body = document.getElementById('tableBody');

        header.innerHTML = `
            <tr>
                <th>用户</th>
                <th>操作</th>
                <th>资源</th>
                <th>结果</th>
                <th>IP地址</th>
                <th>时间</th>
            </tr>
        `;

        body.innerHTML = data.map(item => `
            <tr>
                <td>${item.user}</td>
                <td><span class="badge badge-info">${item.action}</span></td>
                <td><code>${item.resource}</code></td>
                <td><span class="badge badge-${item.result === '成功' ? 'success' : 'danger'}">${item.result}</span></td>
                <td>${item.ip}</td>
                <td>${item.time}</td>
            </tr>
        `).join('');
    }

    switchTab(tab) {
        this.currentTab = tab;
        this.currentPage = 1;
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tab);
        });
        this.loadData();
    }

    handleSearch() {
        this.searchKeyword = document.getElementById('searchInput').value.trim();
        this.currentPage = 1;
        this.loadData();
    }

    prevPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.loadData();
        }
    }

    nextPage() {
        this.currentPage++;
        this.loadData();
    }

    showCreateModal() {
        Modal.show({
            title: '<i class="fas fa-plus-circle"></i> 新增安全策略',
            content: this.getCreateFormHTML(),
            width: '700px',
            onConfirm: () => this.handleCreate(),
            confirmText: '创建',
            cancelText: '取消'
        });
    }
    
    getCreateFormHTML() {
        return `
            <form id="createPolicyForm" class="form-vertical">
                <div class="form-group">
                    <label class="form-label required">策略名称</label>
                    <input type="text" id="policyName" class="form-control" 
                           placeholder="例如：敏感数据访问策略" required>
                </div>
                
                <div class="form-group">
                    <label class="form-label required">策略类型</label>
                    <select id="policyType" class="form-control" required onchange="securityPage.handlePolicyTypeChange()">
                        <option value="">请选择策略类型</option>
                        <option value="访问控制">访问控制</option>
                        <option value="数据脱敏">数据脱敏</option>
                        <option value="数据加密">数据加密</option>
                        <option value="审计监控">审计监控</option>
                        <option value="数据备份">数据备份</option>
                        <option value="权限管理">权限管理</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label class="form-label required">安全级别</label>
                    <select id="policyLevel" class="form-control" required>
                        <option value="">请选择安全级别</option>
                        <option value="高">高 - 核心数据保护</option>
                        <option value="中">中 - 重要数据保护</option>
                        <option value="低">低 - 一般数据保护</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label class="form-label required">策略描述</label>
                    <textarea id="policyDesc" class="form-control" rows="3" 
                              placeholder="详细描述该策略的作用和适用范围" required></textarea>
                </div>
                
                <div class="form-group">
                    <label class="form-label">适用范围</label>
                    <input type="text" id="policyScope" class="form-control" 
                           placeholder="例如：所有敏感数据表">
                    <small class="form-text">指定策略应用的数据范围</small>
                </div>
                
                <div class="form-group">
                    <label class="form-label">执行规则</label>
                    <select id="policyRuleTemplate" class="form-control" onchange="securityPage.handleRuleTemplateChange()">
                        <option value="">选择规则模板（可选）</option>
                        <option value="custom">自定义规则</option>
                    </select>
                    <small class="form-text">选择预设模板或自定义规则</small>
                </div>
                
                <div class="form-group" id="customRulesGroup" style="display: none;">
                    <label class="form-label">自定义规则</label>
                    <textarea id="policyRules" class="form-control" rows="4" 
                              placeholder="输入自定义的执行规则"></textarea>
                </div>
                
                <div id="selectedRulesPreview" style="display: none; margin-top: 12px; padding: 12px; background: #F9FAFB; border-radius: 6px; border-left: 3px solid #3B82F6;">
                    <div style="font-size: 13px; font-weight: 500; color: #666; margin-bottom: 8px;">已选规则预览：</div>
                    <div id="rulesPreviewContent" style="font-size: 13px; color: #333; white-space: pre-line;"></div>
                </div>
                
                <div class="form-group">
                    <label class="checkbox-label">
                        <input type="checkbox" id="policyEnabled" checked>
                        <span>立即启用该策略</span>
                    </label>
                </div>
            </form>
        `;
    }
    
    handleCreate() {
        const form = document.getElementById('createPolicyForm');
        if (!form.checkValidity()) {
            Toast.error('请填写必填项');
            return false;
        }
        
        const formData = {
            name: document.getElementById('policyName').value.trim(),
            type: document.getElementById('policyType').value,
            level: document.getElementById('policyLevel').value,
            description: document.getElementById('policyDesc').value.trim(),
            scope: document.getElementById('policyScope').value.trim(),
            rules: document.getElementById('policyRules').value.trim(),
            status: document.getElementById('policyEnabled').checked ? 'enabled' : 'disabled'
        };
        
        const result = dataSecurityService.createPolicy(formData);
        
        if (result.success) {
            Toast.success('安全策略创建成功');
            this.loadData();
            this.updateStatistics();
            return true;
        } else {
            Toast.error(result.message || '创建失败');
            return false;
        }
    }

    editPolicy(id) {
        const policy = dataSecurityService.getPolicyById(id);
        if (!policy) {
            Toast.error('策略不存在');
            return;
        }
        
        Modal.show({
            title: '<i class="fas fa-edit"></i> 编辑安全策略',
            content: this.getEditFormHTML(policy),
            width: '700px',
            onConfirm: () => this.handleEdit(id),
            confirmText: '保存',
            cancelText: '取消'
        });
    }
    
    getEditFormHTML(policy) {
        return `
            <form id="editPolicyForm" class="form-vertical">
                <div class="form-group">
                    <label class="form-label required">策略名称</label>
                    <input type="text" id="editPolicyName" class="form-control" 
                           value="${policy.name}" required>
                </div>
                
                <div class="form-group">
                    <label class="form-label required">策略类型</label>
                    <select id="editPolicyType" class="form-control" required onchange="securityPage.handleEditPolicyTypeChange()">
                        <option value="访问控制" ${policy.type === '访问控制' ? 'selected' : ''}>访问控制</option>
                        <option value="数据脱敏" ${policy.type === '数据脱敏' ? 'selected' : ''}>数据脱敏</option>
                        <option value="数据加密" ${policy.type === '数据加密' ? 'selected' : ''}>数据加密</option>
                        <option value="审计监控" ${policy.type === '审计监控' ? 'selected' : ''}>审计监控</option>
                        <option value="数据备份" ${policy.type === '数据备份' ? 'selected' : ''}>数据备份</option>
                        <option value="权限管理" ${policy.type === '权限管理' ? 'selected' : ''}>权限管理</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label class="form-label required">安全级别</label>
                    <select id="editPolicyLevel" class="form-control" required>
                        <option value="高" ${policy.level === '高' ? 'selected' : ''}>高 - 核心数据保护</option>
                        <option value="中" ${policy.level === '中' ? 'selected' : ''}>中 - 重要数据保护</option>
                        <option value="低" ${policy.level === '低' ? 'selected' : ''}>低 - 一般数据保护</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label class="form-label required">策略描述</label>
                    <textarea id="editPolicyDesc" class="form-control" rows="3" required>${policy.description}</textarea>
                </div>
                
                <div class="form-group">
                    <label class="form-label">适用范围</label>
                    <input type="text" id="editPolicyScope" class="form-control" 
                           value="${policy.scope || ''}">
                </div>
                
                <div class="form-group">
                    <label class="form-label">执行规则</label>
                    <select id="editPolicyRuleTemplate" class="form-control" onchange="securityPage.handleEditRuleTemplateChange()">
                        <option value="">选择规则模板（可选）</option>
                        <option value="custom" ${policy.rules ? 'selected' : ''}>自定义规则</option>
                    </select>
                </div>
                
                <div class="form-group" id="editCustomRulesGroup" style="display: ${policy.rules ? 'block' : 'none'};">
                    <label class="form-label">自定义规则</label>
                    <textarea id="editPolicyRules" class="form-control" rows="4">${policy.rules || ''}</textarea>
                </div>
                
                <div id="editSelectedRulesPreview" style="display: none; margin-top: 12px; padding: 12px; background: #F9FAFB; border-radius: 6px; border-left: 3px solid #3B82F6;">
                    <div style="font-size: 13px; font-weight: 500; color: #666; margin-bottom: 8px;">已选规则预览：</div>
                    <div id="editRulesPreviewContent" style="font-size: 13px; color: #333; white-space: pre-line;"></div>
                </div>
                
                <div class="form-group">
                    <label class="checkbox-label">
                        <input type="checkbox" id="editPolicyEnabled" ${policy.status === 'enabled' ? 'checked' : ''}>
                        <span>启用该策略</span>
                    </label>
                </div>
            </form>
        `;
    }
    
    handleEdit(id) {
        const form = document.getElementById('editPolicyForm');
        if (!form.checkValidity()) {
            Toast.error('请填写必填项');
            return false;
        }
        
        const formData = {
            name: document.getElementById('editPolicyName').value.trim(),
            type: document.getElementById('editPolicyType').value,
            level: document.getElementById('editPolicyLevel').value,
            description: document.getElementById('editPolicyDesc').value.trim(),
            scope: document.getElementById('editPolicyScope').value.trim(),
            rules: document.getElementById('editPolicyRules').value.trim(),
            status: document.getElementById('editPolicyEnabled').checked ? 'enabled' : 'disabled'
        };
        
        const result = dataSecurityService.updatePolicy(id, formData);
        
        if (result.success) {
            Toast.success('安全策略更新成功');
            this.loadData();
            this.updateStatistics();
            return true;
        } else {
            Toast.error(result.message || '更新失败');
            return false;
        }
    }

    toggleStatus(id) {
        const policy = dataSecurityService.getPolicyById(id);
        if (!policy) {
            Toast.error('策略不存在');
            return;
        }
        
        const newStatus = policy.status === 'enabled' ? 'disabled' : 'enabled';
        const statusText = newStatus === 'enabled' ? '启用' : '禁用';
        
        Modal.confirm({
            title: '确认操作',
            content: `确定要${statusText}策略"${policy.name}"吗？`,
            onConfirm: () => {
                const result = dataSecurityService.updatePolicy(id, { status: newStatus });
                if (result.success) {
                    Toast.success(`策略已${statusText}`);
                    this.loadData();
                    this.updateStatistics();
                } else {
                    Toast.error('操作失败');
                }
            }
        });
    }

    viewDetail(id) {
        const policy = dataSecurityService.getPolicyById(id);
        if (!policy) {
            Toast.error('策略不存在');
            return;
        }
        
        Modal.show({
            title: '<i class="fas fa-info-circle"></i> 策略详情',
            content: this.getDetailHTML(policy),
            width: '700px',
            showCancel: false,
            confirmText: '关闭',
            onConfirm: () => true
        });
    }
    
    getDetailHTML(policy) {
        const statusBadge = policy.status === 'enabled' 
            ? '<span class="badge badge-success">启用</span>' 
            : '<span class="badge badge-secondary">禁用</span>';
        const levelBadge = policy.level === '高' 
            ? '<span class="badge badge-danger">高</span>' 
            : policy.level === '中' 
            ? '<span class="badge badge-warning">中</span>' 
            : '<span class="badge badge-info">低</span>';
            
        return `
            <div class="detail-container" style="padding: 20px;">
                <div class="detail-section" style="margin-bottom: 24px;">
                    <h4 style="color: #3B82F6; margin-bottom: 16px; border-bottom: 2px solid #3B82F6; padding-bottom: 8px;">
                        基本信息
                    </h4>
                    <div style="display: grid; grid-template-columns: 120px 1fr; gap: 12px; line-height: 2;">
                        <div style="color: #666; font-weight: 500;">策略ID:</div>
                        <div><code>${policy.id}</code></div>
                        
                        <div style="color: #666; font-weight: 500;">策略名称:</div>
                        <div style="font-weight: 600;">${policy.name}</div>
                        
                        <div style="color: #666; font-weight: 500;">策略类型:</div>
                        <div><span class="badge badge-info">${policy.type}</span></div>
                        
                        <div style="color: #666; font-weight: 500;">安全级别:</div>
                        <div>${levelBadge}</div>
                        
                        <div style="color: #666; font-weight: 500;">当前状态:</div>
                        <div>${statusBadge}</div>
                        
                        <div style="color: #666; font-weight: 500;">创建时间:</div>
                        <div>${policy.createTime}</div>
                        
                        ${policy.updateTime ? `
                            <div style="color: #666; font-weight: 500;">更新时间:</div>
                            <div>${policy.updateTime}</div>
                        ` : ''}
                    </div>
                </div>
                
                <div class="detail-section" style="margin-bottom: 24px;">
                    <h4 style="color: #3B82F6; margin-bottom: 16px; border-bottom: 2px solid #3B82F6; padding-bottom: 8px;">
                        策略详情
                    </h4>
                    <div style="display: grid; grid-template-columns: 120px 1fr; gap: 12px; line-height: 2;">
                        <div style="color: #666; font-weight: 500;">策略描述:</div>
                        <div>${policy.description}</div>
                        
                        ${policy.scope ? `
                            <div style="color: #666; font-weight: 500;">适用范围:</div>
                            <div>${policy.scope}</div>
                        ` : ''}
                        
                        ${policy.rules ? `
                            <div style="color: #666; font-weight: 500;">执行规则:</div>
                            <div style="white-space: pre-wrap;">${policy.rules}</div>
                        ` : ''}
                    </div>
                </div>
                
                ${policy.applyCount !== undefined ? `
                    <div class="detail-section" style="margin-bottom: 24px;">
                        <h4 style="color: #3B82F6; margin-bottom: 16px; border-bottom: 2px solid #3B82F6; padding-bottom: 8px;">
                            应用统计
                        </h4>
                        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;">
                            <div style="background: #F9FAFB; padding: 16px; border-radius: 8px; text-align: center;">
                                <div style="font-size: 24px; font-weight: 600; color: #3B82F6;">${policy.applyCount || 0}</div>
                                <div style="font-size: 12px; color: #666; margin-top: 4px;">应用次数</div>
                            </div>
                            <div style="background: #F9FAFB; padding: 16px; border-radius: 8px; text-align: center;">
                                <div style="font-size: 24px; font-weight: 600; color: #10B981;">${policy.successCount || 0}</div>
                                <div style="font-size: 12px; color: #666; margin-top: 4px;">成功次数</div>
                            </div>
                            <div style="background: #F9FAFB; padding: 16px; border-radius: 8px; text-align: center;">
                                <div style="font-size: 24px; font-weight: 600; color: #EF4444;">${policy.failCount || 0}</div>
                                <div style="font-size: 12px; color: #666; margin-top: 4px;">失败次数</div>
                            </div>
                        </div>
                    </div>
                ` : ''}
                
                <div class="detail-actions" style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #E5E7EB; text-align: right;">
                    <button class="btn btn-secondary" onclick="Modal.hide()" style="margin-right: 8px;">
                        关闭
                    </button>
                    <button class="btn btn-primary" onclick="Modal.hide(); securityPage.editPolicy('${policy.id}')">
                        <i class="fas fa-edit"></i> 编辑策略
                    </button>
                </div>
            </div>
        `;
    }
    
    viewAuditLog() {
        this.switchTab('audit');
    }

    exportData() {
        Toast.info('导出功能开发中...');
    }

    refreshData() {
        Loading.show('刷新中...');
        this.loadData();
        Loading.hide();
        Toast.success('刷新成功');
    }
    
    /**
     * 获取规则模板
     */
    getRuleTemplates(policyType) {
        const templates = {
            '访问控制': [
                { value: 'access_auth', label: '身份认证要求', rules: '1. 用户必须通过身份认证\n2. 使用强密码策略\n3. 启用多因素认证（MFA）' },
                { value: 'access_approval', label: '访问审批流程', rules: '1. 访问需要部门主管审批\n2. 敏感数据访问需要二级审批\n3. 记录所有审批流程' },
                { value: 'access_ip', label: 'IP白名单控制', rules: '1. 仅允许白名单IP访问\n2. 定期更新IP白名单\n3. 记录所有访问来源' },
                { value: 'access_time', label: '时间限制访问', rules: '1. 仅工作时间允许访问\n2. 非工作时间需要特殊授权\n3. 记录非工作时间访问' },
                { value: 'access_role', label: '基于角色的访问', rules: '1. 按角色分配访问权限\n2. 最小权限原则\n3. 定期审查角色权限' }
            ],
            '数据脱敏': [
                { value: 'mask_idcard', label: '身份证号脱敏', rules: '1. 保留前6位和后4位\n2. 中间位数用*替代\n3. 格式：110101********1234' },
                { value: 'mask_phone', label: '手机号脱敏', rules: '1. 保留前3位和后4位\n2. 中间4位用*替代\n3. 格式：138****5678' },
                { value: 'mask_name', label: '姓名脱敏', rules: '1. 保留姓氏\n2. 名字用*替代\n3. 格式：张**' },
                { value: 'mask_email', label: '邮箱脱敏', rules: '1. 保留@前2位和域名\n2. 其余用*替代\n3. 格式：zh***@example.com' },
                { value: 'mask_bank', label: '银行卡号脱敏', rules: '1. 仅保留后4位\n2. 其余用*替代\n3. 格式：**** **** **** 1234' }
            ],
            '数据加密': [
                { value: 'encrypt_storage', label: '存储加密', rules: '1. 使用AES-256加密算法\n2. 密钥定期轮换\n3. 密钥安全存储' },
                { value: 'encrypt_transfer', label: '传输加密', rules: '1. 使用TLS 1.3协议\n2. 强制HTTPS传输\n3. 禁用弱加密算法' },
                { value: 'encrypt_field', label: '字段级加密', rules: '1. 敏感字段单独加密\n2. 使用不同密钥\n3. 支持密文检索' },
                { value: 'encrypt_backup', label: '备份加密', rules: '1. 备份文件加密存储\n2. 异地备份加密传输\n3. 加密密钥分离管理' }
            ],
            '审计监控': [
                { value: 'audit_access', label: '访问日志记录', rules: '1. 记录所有数据访问\n2. 包含用户、时间、操作\n3. 日志保留180天' },
                { value: 'audit_change', label: '变更日志记录', rules: '1. 记录所有数据变更\n2. 包含变更前后值\n3. 支持变更回溯' },
                { value: 'audit_export', label: '导出操作审计', rules: '1. 记录所有数据导出\n2. 需要审批才能导出\n3. 导出文件加密' },
                { value: 'audit_alert', label: '异常行为告警', rules: '1. 监控异常访问模式\n2. 实时告警通知\n3. 自动阻断可疑操作' }
            ],
            '数据备份': [
                { value: 'backup_daily', label: '每日备份', rules: '1. 每日凌晨自动备份\n2. 保留最近30天备份\n3. 验证备份完整性' },
                { value: 'backup_incremental', label: '增量备份', rules: '1. 每小时增量备份\n2. 每周全量备份\n3. 优化存储空间' },
                { value: 'backup_remote', label: '异地备份', rules: '1. 备份到异地机房\n2. 加密传输和存储\n3. 定期恢复演练' },
                { value: 'backup_version', label: '版本备份', rules: '1. 保留多个历史版本\n2. 支持任意时间点恢复\n3. 版本标记和说明' }
            ],
            '权限管理': [
                { value: 'perm_rbac', label: '角色权限管理', rules: '1. 基于角色分配权限\n2. 支持权限继承\n3. 定期权限审查' },
                { value: 'perm_temp', label: '临时权限授予', rules: '1. 支持临时权限申请\n2. 设置权限有效期\n3. 到期自动回收' },
                { value: 'perm_approval', label: '权限审批流程', rules: '1. 权限申请需要审批\n2. 多级审批机制\n3. 审批记录可追溯' },
                { value: 'perm_separation', label: '职责分离', rules: '1. 关键操作职责分离\n2. 防止权限滥用\n3. 互相监督制约' }
            ]
        };
        
        return templates[policyType] || [];
    }
    
    /**
     * 处理策略类型变化
     */
    handlePolicyTypeChange() {
        const policyType = document.getElementById('policyType').value;
        const templateSelect = document.getElementById('policyRuleTemplate');
        
        if (!policyType || !templateSelect) return;
        
        // 清空现有选项（保留前两个：空选项和自定义）
        while (templateSelect.options.length > 2) {
            templateSelect.remove(2);
        }
        
        // 添加对应类型的模板
        const templates = this.getRuleTemplates(policyType);
        templates.forEach(template => {
            const option = document.createElement('option');
            option.value = template.value;
            option.textContent = template.label;
            option.dataset.rules = template.rules;
            templateSelect.appendChild(option);
        });
        
        // 重置选择
        templateSelect.value = '';
        document.getElementById('customRulesGroup').style.display = 'none';
        document.getElementById('selectedRulesPreview').style.display = 'none';
    }
    
    /**
     * 处理规则模板变化
     */
    handleRuleTemplateChange() {
        const templateSelect = document.getElementById('policyRuleTemplate');
        const customGroup = document.getElementById('customRulesGroup');
        const preview = document.getElementById('selectedRulesPreview');
        const previewContent = document.getElementById('rulesPreviewContent');
        const rulesTextarea = document.getElementById('policyRules');
        
        const selectedValue = templateSelect.value;
        
        if (selectedValue === 'custom') {
            // 显示自定义输入框
            customGroup.style.display = 'block';
            preview.style.display = 'none';
            rulesTextarea.value = '';
        } else if (selectedValue) {
            // 显示选中的模板规则
            const selectedOption = templateSelect.options[templateSelect.selectedIndex];
            const rules = selectedOption.dataset.rules;
            
            customGroup.style.display = 'none';
            preview.style.display = 'block';
            previewContent.textContent = rules;
            rulesTextarea.value = rules;
        } else {
            // 未选择
            customGroup.style.display = 'none';
            preview.style.display = 'none';
            rulesTextarea.value = '';
        }
    }
    
    /**
     * 处理编辑表单的策略类型变化
     */
    handleEditPolicyTypeChange() {
        const policyType = document.getElementById('editPolicyType').value;
        const templateSelect = document.getElementById('editPolicyRuleTemplate');
        
        if (!policyType || !templateSelect) return;
        
        // 清空现有选项（保留前两个）
        while (templateSelect.options.length > 2) {
            templateSelect.remove(2);
        }
        
        // 添加对应类型的模板
        const templates = this.getRuleTemplates(policyType);
        templates.forEach(template => {
            const option = document.createElement('option');
            option.value = template.value;
            option.textContent = template.label;
            option.dataset.rules = template.rules;
            templateSelect.appendChild(option);
        });
    }
    
    /**
     * 处理编辑表单的规则模板变化
     */
    handleEditRuleTemplateChange() {
        const templateSelect = document.getElementById('editPolicyRuleTemplate');
        const customGroup = document.getElementById('editCustomRulesGroup');
        const preview = document.getElementById('editSelectedRulesPreview');
        const previewContent = document.getElementById('editRulesPreviewContent');
        const rulesTextarea = document.getElementById('editPolicyRules');
        
        const selectedValue = templateSelect.value;
        
        if (selectedValue === 'custom') {
            // 显示自定义输入框
            customGroup.style.display = 'block';
            preview.style.display = 'none';
        } else if (selectedValue) {
            // 显示选中的模板规则
            const selectedOption = templateSelect.options[templateSelect.selectedIndex];
            const rules = selectedOption.dataset.rules;
            
            customGroup.style.display = 'none';
            preview.style.display = 'block';
            previewContent.textContent = rules;
            rulesTextarea.value = rules;
        } else {
            // 未选择
            customGroup.style.display = 'none';
            preview.style.display = 'none';
        }
    }
}

const securityPage = new DataSecurityPage();
document.addEventListener('DOMContentLoaded', () => {
    securityPage.init();
});
