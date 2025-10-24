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
        Toast.info('新增策略功能开发中...');
    }

    editPolicy(id) {
        Toast.info(`编辑策略 ${id}`);
    }

    toggleStatus(id) {
        Toast.info(`切换策略 ${id} 状态`);
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
}

const securityPage = new DataSecurityPage();
document.addEventListener('DOMContentLoaded', () => {
    securityPage.init();
});
