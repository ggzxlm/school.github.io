/**
 * 数据分类分级页面脚本
 */

class DataClassificationPage {
    constructor() {
        this.currentTab = 'categories';
        this.currentPage = 1;
        this.pageSize = 10;
        this.searchKeyword = '';
    }

    async init() {
        try {
            Loading.show('加载中...');
            await dataClassificationService.initialize();
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
        const stats = dataClassificationService.getStatistics();
        document.getElementById('categoryCount').textContent = stats.categoryCount;
        document.getElementById('sensitiveCount').textContent = stats.sensitiveCount;
        document.getElementById('importantCount').textContent = stats.importantCount;
        document.getElementById('normalCount').textContent = stats.normalCount;
    }

    async loadData() {
        const filters = {
            level: document.getElementById('filter-level')?.value || '',
            search: this.searchKeyword
        };

        if (this.currentTab === 'categories') {
            const data = dataClassificationService.getCategories(filters);
            this.renderCategoriesTable(data);
        } else if (this.currentTab === 'levels') {
            const data = dataClassificationService.getLevels();
            this.renderLevelsTable(data);
        } else if (this.currentTab === 'mapping') {
            const data = dataClassificationService.getMappings(filters);
            this.renderMappingTable(data);
        }
    }

    renderCategoriesTable(data) {
        const header = document.getElementById('tableHeader');
        const body = document.getElementById('tableBody');
        const emptyState = document.getElementById('emptyState');

        header.innerHTML = `
            <tr>
                <th>分类名称</th>
                <th>分类编码</th>
                <th>数据级别</th>
                <th>描述</th>
                <th>关联表数</th>
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
                <td><code>${item.code}</code></td>
                <td><span class="badge badge-${this.getLevelColor(item.level)}">${item.level}</span></td>
                <td>${item.description}</td>
                <td>${item.tableCount}</td>
                <td>${item.createTime}</td>
                <td>
                    <div class="action-btns">
                        <button class="btn-icon" onclick="classificationPage.editCategory('${item.id}')" title="编辑">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-icon" onclick="classificationPage.viewTables('${item.id}')" title="查看表">
                            <i class="fas fa-table"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    renderLevelsTable(data) {
        const header = document.getElementById('tableHeader');
        const body = document.getElementById('tableBody');

        header.innerHTML = `
            <tr>
                <th>级别</th>
                <th>级别名称</th>
                <th>级别编码</th>
                <th>描述</th>
                <th>控制措施</th>
                <th>数据量</th>
            </tr>
        `;

        body.innerHTML = data.map(item => `
            <tr>
                <td><span class="badge" style="background-color: ${item.color}; color: white;">${item.id}</span></td>
                <td>${item.name}</td>
                <td><code>${item.code}</code></td>
                <td>${item.description}</td>
                <td>${item.controlMeasure}</td>
                <td>${item.dataCount}</td>
            </tr>
        `).join('');
    }

    renderMappingTable(data) {
        const header = document.getElementById('tableHeader');
        const body = document.getElementById('tableBody');

        header.innerHTML = `
            <tr>
                <th>表名</th>
                <th>数据分类</th>
                <th>数据级别</th>
                <th>关键字段</th>
                <th>自动分类</th>
                <th>更新时间</th>
                <th width="120">操作</th>
            </tr>
        `;

        body.innerHTML = data.map(item => `
            <tr>
                <td><code>${item.tableName}</code></td>
                <td>${item.category}</td>
                <td><span class="badge badge-${this.getLevelColor(item.level)}">${item.level}</span></td>
                <td>${item.fields.map(f => `<code>${f}</code>`).join(', ')}</td>
                <td>${item.autoClassified ? '<span class="badge badge-success">是</span>' : '<span class="badge badge-secondary">否</span>'}</td>
                <td>${item.updateTime}</td>
                <td>
                    <div class="action-btns">
                        <button class="btn-icon" onclick="classificationPage.editMapping('${item.id}')" title="编辑">
                            <i class="fas fa-edit"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    getLevelColor(level) {
        const colors = {
            'L1': 'success',
            'L2': 'info',
            'L3': 'warning',
            'L4': 'danger'
        };
        return colors[level] || 'secondary';
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

    autoClassify() {
        Toast.info('自动分类功能开发中...');
    }

    showCreateModal() {
        Toast.info('新增分类功能开发中...');
    }

    editCategory(id) {
        Toast.info(`编辑分类 ${id}`);
    }

    viewTables(id) {
        this.switchTab('mapping');
        Toast.info(`查看分类 ${id} 的关联表`);
    }

    editMapping(id) {
        Toast.info(`编辑映射 ${id}`);
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

const classificationPage = new DataClassificationPage();
document.addEventListener('DOMContentLoaded', () => {
    classificationPage.init();
});
