/**
 * 外部数据接入页面脚本
 */

class ExternalDataPage {
    constructor() {
        this.currentTab = 'all';
        this.currentPage = 1;
        this.pageSize = 10;
        this.searchKeyword = '';
    }

    async init() {
        try {
            Loading.show('加载中...');
            await externalDataService.initialize();
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
        const stats = externalDataService.getStatistics();
        document.getElementById('totalCount').textContent = stats.totalCount;
        document.getElementById('runningCount').textContent = stats.runningCount;
        document.getElementById('todaySyncCount').textContent = stats.todaySyncCount;
        document.getElementById('failedCount').textContent = stats.failedCount;
    }

    async loadData() {
        const filters = {
            type: this.currentTab,
            status: document.getElementById('filter-status')?.value || '',
            search: this.searchKeyword
        };

        const data = externalDataService.getConnections(filters);
        this.renderTable(data);
    }

    renderTable(data) {
        const body = document.getElementById('tableBody');
        const emptyState = document.getElementById('emptyState');

        if (data.length === 0) {
            body.innerHTML = '';
            emptyState.style.display = 'flex';
            return;
        }

        emptyState.style.display = 'none';
        const start = (this.currentPage - 1) * this.pageSize;
        const end = start + this.pageSize;
        const pageData = data.slice(start, end);

        body.innerHTML = pageData.map(item => `
            <tr>
                <td>${item.name}</td>
                <td><span class="badge badge-${this.getTypeBadge(item.type)}">${this.getTypeLabel(item.type)}</span></td>
                <td>${item.datasource}</td>
                <td>${item.frequency}</td>
                <td>${item.lastSync}</td>
                <td><span class="badge badge-${this.getStatusBadge(item.status)}">${this.getStatusLabel(item.status)}</span></td>
                <td>
                    <div class="action-btns">
                        <button class="btn-icon" onclick="externalDataPage.viewDetail('${item.id}')" title="查看">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn-icon" onclick="externalDataPage.syncNow('${item.id}')" title="立即同步">
                            <i class="fas fa-sync-alt"></i>
                        </button>
                        <button class="btn-icon" onclick="externalDataPage.editConnection('${item.id}')" title="编辑">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-icon ${item.status === 'running' ? '' : 'danger'}" onclick="externalDataPage.toggleStatus('${item.id}')" title="${item.status === 'running' ? '停止' : '启动'}">
                            <i class="fas fa-${item.status === 'running' ? 'stop' : 'play'}"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');

        this.updatePagination(data.length);
    }

    getTypeBadge(type) {
        const badges = {
            'API': 'primary',
            'file': 'info',
            'system': 'success'
        };
        return badges[type] || 'secondary';
    }

    getTypeLabel(type) {
        const labels = {
            'API': 'API接入',
            'file': '文件接入',
            'system': '系统接入'
        };
        return labels[type] || type;
    }

    getStatusBadge(status) {
        const badges = {
            'running': 'success',
            'stopped': 'secondary',
            'failed': 'danger'
        };
        return badges[status] || 'secondary';
    }

    getStatusLabel(status) {
        const labels = {
            'running': '运行中',
            'stopped': '已停止',
            'failed': '失败'
        };
        return labels[status] || status;
    }

    updatePagination(total) {
        const totalPages = Math.ceil(total / this.pageSize);
        document.getElementById('totalRecords').textContent = total;
        document.getElementById('currentPage').textContent = this.currentPage;
        document.getElementById('totalPages').textContent = totalPages;
        document.getElementById('prevBtn').disabled = this.currentPage === 1;
        document.getElementById('nextBtn').disabled = this.currentPage === totalPages || totalPages === 0;
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

    testConnection() {
        Toast.info('测试连接功能开发中...');
    }

    showCreateModal() {
        Toast.info('新增接入功能开发中...');
    }

    viewDetail(id) {
        Toast.info(`查看接入 ${id} 详情`);
    }

    syncNow(id) {
        Loading.show('同步中...');
        setTimeout(() => {
            Loading.hide();
            Toast.success('同步成功');
            this.loadData();
        }, 1500);
    }

    editConnection(id) {
        Toast.info(`编辑接入 ${id}`);
    }

    toggleStatus(id) {
        Toast.info(`切换接入 ${id} 状态`);
    }

    exportData() {
        Toast.info('导出功能开发中...');
    }

    refreshData() {
        Loading.show('刷新中...');
        this.loadData();
        this.updateStatistics();
        Loading.hide();
        Toast.success('刷新成功');
    }
}

const externalDataPage = new ExternalDataPage();
document.addEventListener('DOMContentLoaded', () => {
    externalDataPage.init();
});
