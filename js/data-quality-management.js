/**
 * 数据质量管理页面脚本
 */

class DataQualityPage {
    constructor() {
        this.currentTab = 'rules';
        this.editingRuleId = null;
        this.currentDetailRuleId = null;
    }

    async init() {
        try {
            console.log('[数据质量] 开始初始化');
            Loading.show('加载中...');
            
            // 初始化模态框为隐藏状态
            const ruleDetailModal = document.getElementById('ruleDetailModal');
            if (ruleDetailModal) {
                ruleDetailModal.style.display = 'none';
            }
            
            const createRuleModal = document.getElementById('createRuleModal');
            if (createRuleModal) {
                createRuleModal.style.display = 'none';
            }
            
            await dataQualityService.initialize();
            console.log('[数据质量] 服务初始化完成');
            this.updateStatistics();
            console.log('[数据质量] 统计数据更新完成');
            this.loadRules();
            console.log('[数据质量] 规则列表加载完成');
            this.loadCheckHistory();
            this.loadIssues();
            this.renderReports();
            Loading.hide();
        } catch (error) {
            console.error('[数据质量] 初始化失败:', error);
            Loading.hide();
            Toast.error('初始化失败');
        }
    }

    updateStatistics() {
        const stats = dataQualityService.getStatistics();
        document.getElementById('totalRules').textContent = stats.totalRules;
        document.getElementById('avgScore').textContent = stats.avgScore;
        document.getElementById('totalChecks').textContent = stats.totalChecks;
        document.getElementById('openTickets').textContent = stats.openTickets;
    }



    loadRules() {
        console.log('[数据质量] 加载规则列表');
        console.log('[数据质量] dataQualityService:', dataQualityService);
        console.log('[数据质量] dataQualityService.initialized:', dataQualityService.initialized);
        console.log('[数据质量] dataQualityService.rules:', dataQualityService.rules);
        
        const rules = dataQualityService.getRules();
        console.log('[数据质量] 规则数量:', rules.length);
        console.log('[数据质量] 规则数据:', rules);
        
        const tbody = document.getElementById('rulesTableBody');
        
        if (!tbody) {
            console.error('[数据质量] 找不到rulesTableBody元素');
            return;
        }
        
        if (rules.length === 0) {
            console.log('[数据质量] 规则数组为空，显示空状态');
            tbody.innerHTML = '<tr><td colspan="9" class="empty-state">暂无规则，请创建规则</td></tr>';
            return;
        }
        
        console.log('[数据质量] 开始渲染规则表格');
        
        const html = rules.map(rule => `
            <tr>
                <td>${rule.name}</td>
                <td><span class="badge badge-info">${rule.ruleType}</span></td>
                <td><code>${rule.targetTable}</code></td>
                <td><span class="badge badge-${this.getSeverityBadge(rule.severity)}">${this.getSeverityLabel(rule.severity)}</span></td>
                <td>${rule.threshold}%</td>
                <td>${rule.lastCheckTime || '-'}</td>
                <td><span class="badge badge-${this.getScoreBadge(rule.lastScore)}">${rule.lastScore || '-'}</span></td>
                <td>${rule.status ? `<span class="badge badge-${rule.status === 'PASS' ? 'success' : 'danger'}">${rule.status === 'PASS' ? '通过' : '失败'}</span>` : '<span class="badge badge-secondary">未检查</span>'}</td>
                <td>
                    <div class="action-btns">
                        <button class="btn-icon" onclick="dataQualityPage.executeCheck('${rule.id}')" title="执行检查">
                            <i class="fas fa-play"></i>
                        </button>
                        <button class="btn-icon" onclick="dataQualityPage.editRule('${rule.id}')" title="编辑">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-icon" onclick="dataQualityPage.viewRuleDetail('${rule.id}')" title="查看">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
        
        console.log('[数据质量] 生成的HTML长度:', html.length);
        console.log('[数据质量] HTML前100个字符:', html.substring(0, 100));
        
        tbody.innerHTML = html;
        
        console.log('[数据质量] 表格渲染完成，tbody.children.length:', tbody.children.length);
    }

    getScoreBadge(score) {
        if (!score && score !== 0) return 'secondary';
        if (score >= 95) return 'success';
        if (score >= 85) return 'info';
        if (score >= 75) return 'warning';
        return 'danger';
    }

    getSeverityBadge(severity) {
        const badges = {
            'HIGH': 'danger',
            'MEDIUM': 'warning',
            'LOW': 'info'
        };
        return badges[severity] || 'secondary';
    }

    getSeverityLabel(severity) {
        const labels = {
            'HIGH': '高',
            'MEDIUM': '中',
            'LOW': '低'
        };
        return labels[severity] || severity;
    }

    filterRules() {
        const search = document.getElementById('ruleSearch').value;
        const rules = dataQualityService.getRules({ search });
        this.loadRules();
    }

    showCreateRuleModal() {
        console.log('[数据质量] 打开创建规则模态框');
        
        // 重置编辑状态
        this.editingRuleId = null;
        
        const modal = document.getElementById('createRuleModal');
        if (!modal) {
            console.error('[数据质量] 找不到模态框元素 #createRuleModal');
            Toast.error('模态框初始化失败');
            return;
        }
        
        const modalTitle = document.getElementById('createRuleModalTitle');
        if (modalTitle) {
            modalTitle.innerHTML = '<i class="fas fa-plus-circle"></i>新建规则';
        }
        
        const form = document.getElementById('ruleForm');
        if (form) {
            form.reset();
        }
        
        // 显示模态框
        modal.style.display = 'flex';
        setTimeout(() => {
            modal.classList.add('modal-show');
        }, 10);
        
        console.log('[数据质量] 模态框已显示');
    }

    closeCreateRuleModal() {
        const modal = document.getElementById('createRuleModal');
        if (modal) {
            modal.classList.remove('modal-show');
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300);
        }
    }

    submitRule() {
        const form = document.getElementById('ruleForm');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const ruleData = {
            name: document.getElementById('ruleName').value,
            ruleType: document.getElementById('ruleType').value,
            severity: document.getElementById('ruleSeverity').value,
            targetTable: document.getElementById('targetTable').value,
            targetColumn: document.getElementById('targetColumn').value,
            threshold: parseInt(document.getElementById('threshold').value),
            expression: document.getElementById('ruleExpression').value,
            description: document.getElementById('ruleDescription').value
        };

        try {
            Loading.show('保存中...');
            
            if (this.editingRuleId) {
                // 编辑模式：更新规则
                dataQualityService.updateRule(this.editingRuleId, ruleData);
                Toast.success('规则更新成功');
                this.editingRuleId = null;
            } else {
                // 创建模式：新建规则
                dataQualityService.createRule(ruleData);
                Toast.success('规则创建成功');
            }
            
            Loading.hide();
            this.closeCreateRuleModal();
            this.updateStatistics();
            this.loadRules();
        } catch (error) {
            Loading.hide();
            Toast.error('保存失败: ' + error.message);
        }
    }

    executeCheck(ruleId) {
        Loading.show('执行检查中...');
        setTimeout(() => {
            Loading.hide();
            Toast.success('检查完成');
            this.loadRules();
            this.updateStatistics();
        }, 1500);
    }

    batchExecuteChecks() {
        Toast.info('批量检查功能开发中...');
    }

    editRule(ruleId) {
        console.log('[数据质量] 编辑规则:', ruleId);
        
        const rule = dataQualityService.getRuleById(ruleId);
        if (!rule) {
            Toast.error('规则不存在');
            return;
        }
        
        // 设置为编辑模式
        this.editingRuleId = ruleId;
        
        // 更新模态框标题
        const modalTitle = document.getElementById('createRuleModalTitle');
        if (modalTitle) {
            modalTitle.innerHTML = '<i class="fas fa-edit"></i>编辑规则';
        }
        
        // 填充表单数据
        document.getElementById('ruleName').value = rule.name || '';
        document.getElementById('ruleType').value = this.getRuleTypeValue(rule.ruleType) || '';
        document.getElementById('ruleSeverity').value = rule.severity || '';
        document.getElementById('targetTable').value = rule.targetTable || '';
        document.getElementById('targetColumn').value = rule.targetField || '';
        document.getElementById('threshold').value = rule.threshold || 95;
        document.getElementById('ruleExpression').value = rule.checkExpression || '';
        document.getElementById('ruleDescription').value = rule.description || '';
        
        // 显示模态框
        const modal = document.getElementById('createRuleModal');
        modal.style.display = 'flex';
        setTimeout(() => {
            modal.classList.add('modal-show');
        }, 10);
        
        console.log('[数据质量] 编辑模态框已显示');
    }

    viewRuleDetail(ruleId) {
        console.log('[数据质量] 查看规则详情:', ruleId);
        
        const rule = dataQualityService.getRuleById(ruleId);
        if (!rule) {
            Toast.error('规则不存在');
            return;
        }
        
        this.currentDetailRuleId = ruleId;
        
        // 填充基本信息
        document.getElementById('detailRuleName').textContent = rule.name;
        document.getElementById('detailRuleType').innerHTML = `<span class="badge badge-info">${rule.ruleType}</span>`;
        document.getElementById('detailSeverity').innerHTML = `<span class="badge badge-${this.getSeverityBadge(rule.severity)}">${this.getSeverityLabel(rule.severity)}</span>`;
        document.getElementById('detailEnabled').innerHTML = `<span class="badge badge-${rule.enabled ? 'success' : 'secondary'}">${rule.enabled ? '已启用' : '已禁用'}</span>`;
        document.getElementById('detailTargetTable').innerHTML = `<code>${rule.targetTable}</code>`;
        document.getElementById('detailTargetField').textContent = rule.targetField || '-';
        document.getElementById('detailThreshold').textContent = rule.threshold + '%';
        document.getElementById('detailCreateTime').textContent = rule.createTime || '-';
        document.getElementById('detailExpression').textContent = rule.checkExpression || '-';
        document.getElementById('detailDescription').textContent = rule.description || '-';
        
        // 填充检查统计
        document.getElementById('detailLastCheck').textContent = rule.lastCheckTime || '未检查';
        document.getElementById('detailLastScore').innerHTML = rule.lastScore ? 
            `<span class="badge badge-${this.getScoreBadge(rule.lastScore)}">${rule.lastScore}</span>` : '-';
        document.getElementById('detailStatus').innerHTML = rule.status ? 
            `<span class="badge badge-${rule.status === 'PASS' ? 'success' : 'danger'}">${rule.status === 'PASS' ? '通过' : '失败'}</span>` : 
            '<span class="badge badge-secondary">未检查</span>';
        document.getElementById('detailTotalChecks').textContent = '0';
        
        // 填充检查历史（模拟数据）
        const checkHistory = this.generateMockCheckHistory(ruleId);
        const historyContainer = document.getElementById('ruleCheckHistory');
        if (checkHistory.length > 0) {
            historyContainer.innerHTML = checkHistory.map(check => `
                <div class="check-history-item">
                    <div class="check-history-header">
                        <span class="check-history-time">
                            <i class="fas fa-clock"></i> ${check.checkTime}
                        </span>
                        <span class="badge badge-${check.status === 'PASS' ? 'success' : 'danger'}">
                            ${check.status === 'PASS' ? '通过' : '失败'}
                        </span>
                    </div>
                    <div class="check-history-details">
                        <span><i class="fas fa-star"></i> 评分: ${check.score}</span>
                        <span><i class="fas fa-exclamation-circle"></i> 问题数: ${check.issues}</span>
                        <span><i class="fas fa-clock"></i> 耗时: ${check.duration}</span>
                    </div>
                </div>
            `).join('');
        } else {
            historyContainer.innerHTML = '<p style="color: #6B7280; font-size: 13px;">暂无检查历史</p>';
        }
        
        // 显示模态框
        const modal = document.getElementById('ruleDetailModal');
        modal.style.display = 'flex';
        setTimeout(() => {
            modal.classList.add('modal-show');
        }, 10);
    }
    
    /**
     * 关闭规则详情模态框
     */
    closeRuleDetailModal() {
        const modal = document.getElementById('ruleDetailModal');
        modal.classList.remove('modal-show');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
        this.currentDetailRuleId = null;
    }
    
    /**
     * 从详情页执行检查
     */
    executeCheckFromDetail() {
        if (this.currentDetailRuleId) {
            this.closeRuleDetailModal();
            this.executeCheck(this.currentDetailRuleId);
        }
    }
    
    /**
     * 从详情页编辑规则
     */
    editRuleFromDetail() {
        if (this.currentDetailRuleId) {
            this.closeRuleDetailModal();
            this.editRule(this.currentDetailRuleId);
        }
    }
    
    /**
     * 生成模拟检查历史
     */
    generateMockCheckHistory(ruleId) {
        return [
            {
                checkTime: '2024-10-24 10:30:00',
                status: 'PASS',
                score: 98.5,
                issues: 0,
                duration: '2.3秒'
            },
            {
                checkTime: '2024-10-23 10:30:00',
                status: 'PASS',
                score: 97.2,
                issues: 1,
                duration: '2.1秒'
            },
            {
                checkTime: '2024-10-22 10:30:00',
                status: 'FAIL',
                score: 89.5,
                issues: 5,
                duration: '2.5秒'
            }
        ];
    }
    
    /**
     * 显示详情模态框
     */
    showDetailModal(title, content) {
        // 创建模态框元素
        const modal = document.createElement('div');
        modal.className = 'modal-overlay modal-show';
        modal.innerHTML = `
            <div class="modal-container modal-lg">
                <div class="modal-header">
                    <h2 class="modal-title">
                        <i class="fas fa-info-circle"></i>${title}
                    </h2>
                    <button class="modal-close-btn" onclick="this.closest('.modal-overlay').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    ${content}
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" onclick="this.closest('.modal-overlay').remove()">关闭</button>
                </div>
            </div>
        `;
        
        // 点击遮罩层关闭
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.remove();
            }
        });
        
        // 添加到页面
        document.body.appendChild(modal);
    }
    
    /**
     * 获取规则类型的值（用于表单）
     */
    getRuleTypeValue(typeLabel) {
        const typeMap = {
            '完整性': 'COMPLETENESS',
            '准确性': 'ACCURACY',
            '一致性': 'CONSISTENCY',
            '唯一性': 'UNIQUENESS',
            '有效性': 'VALIDITY',
            '及时性': 'TIMELINESS'
        };
        return typeMap[typeLabel] || '';
    }

    refreshData() {
        Loading.show('刷新中...');
        this.updateStatistics();
        this.loadRules();
        Loading.hide();
        Toast.success('刷新成功');
    }
    
    /**
     * 切换标签页
     */
    switchTab(tab) {
        this.currentTab = tab;
        
        // 更新标签按钮状态
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        event.target.closest('.tab-btn').classList.add('active');
        
        // 更新标签页内容
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        
        const tabMap = {
            'rules': 'rulesTab',
            'checks': 'checksTab',
            'reports': 'reportsTab',
            'issues': 'issuesTab'
        };
        
        const targetTab = document.getElementById(tabMap[tab]);
        if (targetTab) {
            targetTab.classList.add('active');
        }
        
        // 加载对应数据
        if (tab === 'checks') {
            this.loadCheckHistory();
        } else if (tab === 'reports') {
            this.renderReports();
        } else if (tab === 'issues') {
            this.loadIssues();
        }
    }
    
    /**
     * 加载检查历史
     */
    loadCheckHistory() {
        const tbody = document.getElementById('checksTableBody');
        
        // 模拟检查历史数据
        const checks = [
            {
                id: 'check-001',
                checkTime: '2024-10-24 10:30:00',
                ruleName: '学生身份证号完整性检查',
                targetTable: 'student_info',
                result: 'PASS',
                score: 98.5,
                issues: 0,
                duration: '2.3秒'
            },
            {
                id: 'check-002',
                checkTime: '2024-10-24 10:15:00',
                ruleName: '手机号格式校验',
                targetTable: 'student_info',
                result: 'PASS',
                score: 92.3,
                issues: 2,
                duration: '1.8秒'
            },
            {
                id: 'check-003',
                checkTime: '2024-10-24 10:00:00',
                ruleName: '邮箱格式有效性',
                targetTable: 'student_info',
                result: 'FAIL',
                score: 85.6,
                issues: 8,
                duration: '2.1秒'
            }
        ];
        
        if (checks.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8" class="empty-state">暂无检查历史</td></tr>';
            return;
        }
        
        tbody.innerHTML = checks.map(check => `
            <tr>
                <td>${check.checkTime}</td>
                <td>${check.ruleName}</td>
                <td><code>${check.targetTable}</code></td>
                <td><span class="badge badge-${check.result === 'PASS' ? 'success' : 'danger'}">${check.result === 'PASS' ? '通过' : '失败'}</span></td>
                <td><span class="badge badge-${this.getScoreBadge(check.score)}">${check.score}</span></td>
                <td>${check.issues}</td>
                <td>${check.duration}</td>
                <td>
                    <button class="btn-icon" onclick="dataQualityPage.viewCheckDetail('${check.id}')" title="查看详情">
                        <i class="fas fa-eye"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }
    
    /**
     * 查看检查详情
     */
    viewCheckDetail(checkId) {
        Toast.info('检查详情功能开发中...');
    }
    
    /**
     * 加载质量问题
     */
    loadIssues() {
        const tbody = document.getElementById('issuesTableBody');
        
        // 模拟质量问题数据
        const issues = [
            {
                id: 'issue-001',
                ruleName: '邮箱格式有效性',
                targetTable: 'student_info',
                severity: 'HIGH',
                description: '发现8条邮箱格式不符合规范的记录',
                foundTime: '2024-10-24 10:00:00',
                status: 'OPEN'
            },
            {
                id: 'issue-002',
                ruleName: '手机号格式校验',
                targetTable: 'student_info',
                severity: 'MEDIUM',
                description: '发现2条手机号格式错误的记录',
                foundTime: '2024-10-24 10:15:00',
                status: 'IN_PROGRESS'
            },
            {
                id: 'issue-003',
                ruleName: '学号唯一性检查',
                targetTable: 'student_info',
                severity: 'HIGH',
                description: '发现3组重复的学号',
                foundTime: '2024-10-23 15:30:00',
                status: 'RESOLVED'
            }
        ];
        
        if (issues.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8" class="empty-state">暂无质量问题</td></tr>';
            return;
        }
        
        tbody.innerHTML = issues.map(issue => `
            <tr>
                <td><code>${issue.id}</code></td>
                <td>${issue.ruleName}</td>
                <td><code>${issue.targetTable}</code></td>
                <td><span class="badge badge-${this.getSeverityBadge(issue.severity)}">${this.getSeverityLabel(issue.severity)}</span></td>
                <td>${issue.description}</td>
                <td>${issue.foundTime}</td>
                <td><span class="badge badge-${this.getIssueStatusBadge(issue.status)}">${this.getIssueStatusLabel(issue.status)}</span></td>
                <td>
                    <button class="btn-icon" onclick="dataQualityPage.viewIssueDetail('${issue.id}')" title="查看详情">
                        <i class="fas fa-eye"></i>
                    </button>
                    ${issue.status === 'OPEN' ? `
                        <button class="btn-icon" onclick="dataQualityPage.resolveIssue('${issue.id}')" title="标记为已解决">
                            <i class="fas fa-check"></i>
                        </button>
                    ` : ''}
                </td>
            </tr>
        `).join('');
    }
    
    /**
     * 获取问题状态徽章
     */
    getIssueStatusBadge(status) {
        const badges = {
            'OPEN': 'danger',
            'IN_PROGRESS': 'warning',
            'RESOLVED': 'success',
            'CLOSED': 'secondary'
        };
        return badges[status] || 'secondary';
    }
    
    /**
     * 获取问题状态标签
     */
    getIssueStatusLabel(status) {
        const labels = {
            'OPEN': '待处理',
            'IN_PROGRESS': '处理中',
            'RESOLVED': '已解决',
            'CLOSED': '已关闭'
        };
        return labels[status] || status;
    }
    
    /**
     * 查看问题详情
     */
    viewIssueDetail(issueId) {
        Toast.info('问题详情功能开发中...');
    }
    
    /**
     * 解决问题
     */
    resolveIssue(issueId) {
        Modal.confirm({
            title: '确认操作',
            content: '确定要将此问题标记为已解决吗？',
            onConfirm: () => {
                Toast.success('问题已标记为已解决');
                this.loadIssues();
            }
        });
    }
    
    /**
     * 渲染质量报告
     */
    renderReports() {
        this.renderQualityTrendChart();
        this.renderRuleTypeChart();
        this.renderSeverityChart();
        this.renderTableQualityChart();
    }
    
    /**
     * 渲染质量趋势图
     */
    renderQualityTrendChart() {
        const container = document.getElementById('qualityTrendChart');
        if (!container) return;
        
        const data = [
            { date: '10-20', score: 95.2 },
            { date: '10-21', score: 96.5 },
            { date: '10-22', score: 94.8 },
            { date: '10-23', score: 97.1 },
            { date: '10-24', score: 96.4 }
        ];
        
        container.innerHTML = `
            <div class="chart-data">
                ${data.map(item => `
                    <div class="chart-item">
                        <div class="chart-label">${item.date}</div>
                        <div class="chart-bar" style="width: ${item.score}%;">
                            <span class="chart-value">${item.score}</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    /**
     * 渲染规则类型分布图
     */
    renderRuleTypeChart() {
        const container = document.getElementById('ruleTypeChart');
        if (!container) return;
        
        const data = [
            { type: '完整性', count: 8, color: '#3B82F6' },
            { type: '准确性', count: 5, color: '#10B981' },
            { type: '一致性', count: 4, color: '#F59E0B' },
            { type: '唯一性', count: 2, color: '#EF4444' },
            { type: '有效性', count: 1, color: '#8B5CF6' }
        ];
        
        const total = data.reduce((sum, item) => sum + item.count, 0);
        
        container.innerHTML = `
            <div class="pie-chart">
                ${data.map(item => `
                    <div class="pie-item">
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <div style="width: 12px; height: 12px; border-radius: 2px; background: ${item.color};"></div>
                            <span>${item.type}</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 12px;">
                            <span style="font-weight: 600;">${item.count}</span>
                            <span style="color: #6B7280; font-size: 12px;">${Math.round(item.count / total * 100)}%</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    /**
     * 渲染严重程度分布图
     */
    renderSeverityChart() {
        const container = document.getElementById('severityChart');
        if (!container) return;
        
        const data = [
            { severity: '高', count: 5, color: '#EF4444' },
            { severity: '中', count: 10, color: '#F59E0B' },
            { severity: '低', count: 5, color: '#3B82F6' }
        ];
        
        const total = data.reduce((sum, item) => sum + item.count, 0);
        
        container.innerHTML = `
            <div class="pie-chart">
                ${data.map(item => `
                    <div class="pie-item">
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <div style="width: 12px; height: 12px; border-radius: 2px; background: ${item.color};"></div>
                            <span>${item.severity}</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 12px;">
                            <span style="font-weight: 600;">${item.count}</span>
                            <span style="color: #6B7280; font-size: 12px;">${Math.round(item.count / total * 100)}%</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    /**
     * 渲染表质量排名
     */
    renderTableQualityChart() {
        const container = document.getElementById('tableQualityChart');
        if (!container) return;
        
        const data = [
            { table: 'student_info', score: 98.5 },
            { table: 'course_info', score: 96.2 },
            { table: 'teacher_info', score: 95.8 },
            { table: 'grade_records', score: 94.3 },
            { table: 'attendance', score: 92.7 },
            { table: 'financial_data', score: 91.5 },
            { table: 'asset_info', score: 90.2 },
            { table: 'procurement', score: 88.9 },
            { table: 'research_projects', score: 87.6 },
            { table: 'user_accounts', score: 85.4 }
        ];
        
        container.innerHTML = `
            <div class="chart-data">
                ${data.map((item, index) => `
                    <div class="chart-item">
                        <div class="chart-label" style="min-width: 120px;">${index + 1}. ${item.table}</div>
                        <div class="chart-bar" style="width: ${item.score}%; background: linear-gradient(90deg, ${this.getScoreColor(item.score)} 0%, ${this.getScoreColor(item.score)}dd 100%);">
                            <span class="chart-value">${item.score}</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    /**
     * 根据评分获取颜色
     */
    getScoreColor(score) {
        if (score >= 95) return '#10B981';
        if (score >= 85) return '#3B82F6';
        if (score >= 75) return '#F59E0B';
        return '#EF4444';
    }
}

const dataQualityPage = new DataQualityPage();

document.addEventListener('DOMContentLoaded', () => {
    dataQualityPage.init();
});

// ============================================================================
// 全局函数包装器（用于HTML onclick事件）
// ============================================================================

/**
 * 显示创建规则模态框
 */
function showCreateRuleModal() {
    dataQualityPage.showCreateRuleModal();
}

/**
 * 刷新看板
 */
function refreshDashboard() {
    dataQualityPage.refreshDashboard();
}
