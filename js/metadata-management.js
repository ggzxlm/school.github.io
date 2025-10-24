/**
 * 元数据管理页面脚本
 */

class MetadataPage {
    constructor() {
        this.currentTab = 'tables';
        this.currentPage = 1;
        this.pageSize = 10;
        this.searchKeyword = '';
        this.currentDetailId = null;
        this.editingId = null;
    }

    async init() {
        try {
            Loading.show('加载中...');
            
            // 初始化模态框为隐藏状态
            const detailModal = document.getElementById('detailModal');
            if (detailModal) {
                detailModal.style.display = 'none';
            }
            
            const createModal = document.getElementById('createModal');
            if (createModal) {
                createModal.style.display = 'none';
            }
            
            await metadataService.initialize();
            this.loadDatasourceFilter();
            this.bindEvents();
            await this.loadData();
            this.updateStatistics();
            Loading.hide();
        } catch (error) {
            console.error('初始化失败:', error);
            Loading.hide();
            Toast.error('初始化失败');
        }
    }
    
    /**
     * 绑定事件
     */
    bindEvents() {
        // 详情模态框关闭按钮
        const closeDetailModalBtn = document.getElementById('closeDetailModalBtn');
        if (closeDetailModalBtn) {
            closeDetailModalBtn.addEventListener('click', () => this.closeDetailModal());
        }
        
        const closeDetailBtn = document.getElementById('closeDetailBtn');
        if (closeDetailBtn) {
            closeDetailBtn.addEventListener('click', () => this.closeDetailModal());
        }
        
        // 查看字段按钮
        const viewFieldsBtn = document.getElementById('viewFieldsBtn');
        if (viewFieldsBtn) {
            viewFieldsBtn.addEventListener('click', () => {
                if (this.currentDetailId) {
                    this.closeDetailModal();
                    this.switchTab('fields');
                }
            });
        }
        
        // 创建模态框关闭按钮
        const closeCreateModalBtn = document.getElementById('closeCreateModalBtn');
        if (closeCreateModalBtn) {
            closeCreateModalBtn.addEventListener('click', () => this.closeCreateModal());
        }
        
        const cancelCreateBtn = document.getElementById('cancelCreateBtn');
        if (cancelCreateBtn) {
            cancelCreateBtn.addEventListener('click', () => this.closeCreateModal());
        }
        
        // 提交按钮
        const submitCreateBtn = document.getElementById('submitCreateBtn');
        if (submitCreateBtn) {
            submitCreateBtn.addEventListener('click', () => this.submitForm());
        }
        
        // 点击模态框外部关闭
        const detailModal = document.getElementById('detailModal');
        if (detailModal) {
            detailModal.addEventListener('click', (e) => {
                if (e.target === detailModal) {
                    this.closeDetailModal();
                }
            });
        }
        
        const createModal = document.getElementById('createModal');
        if (createModal) {
            createModal.addEventListener('click', (e) => {
                if (e.target === createModal) {
                    this.closeCreateModal();
                }
            });
        }
    }

    loadDatasourceFilter() {
        const datasources = metadataService.getDatasources();
        const select = document.getElementById('filter-datasource');
        datasources.forEach(ds => {
            const option = document.createElement('option');
            option.value = ds;
            option.textContent = ds;
            select.appendChild(option);
        });
    }

    updateStatistics() {
        const stats = metadataService.getStatistics();
        document.getElementById('tableCount').textContent = stats.tableCount;
        document.getElementById('fieldCount').textContent = stats.fieldCount;
        document.getElementById('datasourceCount').textContent = stats.datasourceCount;
        document.getElementById('lineageCount').textContent = stats.lineageCount;
    }

    async loadData() {
        const filters = {
            datasource: document.getElementById('filter-datasource')?.value || '',
            search: this.searchKeyword
        };

        let data = [];
        if (this.currentTab === 'tables') {
            data = metadataService.getTables(filters);
            this.renderTablesTable(data);
        } else if (this.currentTab === 'fields') {
            data = metadataService.getFields(filters);
            this.renderFieldsTable(data);
        } else if (this.currentTab === 'lineage') {
            data = metadataService.getLineages(filters);
            this.renderLineageTable(data);
        }
    }

    renderTablesTable(data) {
        const header = document.getElementById('tableHeader');
        const body = document.getElementById('tableBody');
        const emptyState = document.getElementById('emptyState');

        header.innerHTML = `
            <tr>
                <th>表名</th>
                <th>表注释</th>
                <th>数据源</th>
                <th>记录数</th>
                <th>大小</th>
                <th>负责人</th>
                <th>更新时间</th>
                <th width="120">操作</th>
            </tr>
        `;

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
                <td><code>${item.tableName}</code></td>
                <td>${item.tableComment}</td>
                <td><span class="badge badge-info">${item.datasource}</span></td>
                <td>${item.rowCount.toLocaleString()}</td>
                <td>${item.size}</td>
                <td>${item.owner}</td>
                <td>${item.updateTime}</td>
                <td>
                    <div class="action-btns">
                        <button class="btn-icon" onclick="metadataPage.viewDetail('${item.id}')" title="查看">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn-icon" onclick="metadataPage.viewFields('${item.id}')" title="字段">
                            <i class="fas fa-list"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');

        this.updatePagination(data.length);
    }

    renderFieldsTable(data) {
        const header = document.getElementById('tableHeader');
        const body = document.getElementById('tableBody');
        const emptyState = document.getElementById('emptyState');

        header.innerHTML = `
            <tr>
                <th>字段名</th>
                <th>字段注释</th>
                <th>数据类型</th>
                <th>主键</th>
                <th>可空</th>
                <th>默认值</th>
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
                <td><code>${item.fieldName}</code></td>
                <td>${item.fieldComment}</td>
                <td>${item.dataType}</td>
                <td>${item.isPrimaryKey ? '<span class="badge badge-success">是</span>' : '-'}</td>
                <td>${item.isNullable ? '是' : '否'}</td>
                <td>${item.defaultValue || '-'}</td>
            </tr>
        `).join('');
    }

    renderLineageTable(data) {
        const header = document.getElementById('tableHeader');
        const body = document.getElementById('tableBody');
        const emptyState = document.getElementById('emptyState');

        header.innerHTML = `
            <tr>
                <th>源表</th>
                <th>源字段</th>
                <th>目标表</th>
                <th>目标字段</th>
                <th>血缘类型</th>
                <th>转换规则</th>
                <th>创建时间</th>
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
                <td><code>${item.sourceTable}</code></td>
                <td><code>${item.sourceField}</code></td>
                <td><code>${item.targetTable}</code></td>
                <td><code>${item.targetField}</code></td>
                <td><span class="badge badge-primary">${item.lineageType}</span></td>
                <td>${item.transformRule}</td>
                <td>${item.createTime}</td>
            </tr>
        `).join('');
    }

    updatePagination(total) {
        const totalPages = Math.ceil(total / this.pageSize);
        document.getElementById('totalCount').textContent = total;
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

    syncMetadata() {
        Toast.info('元数据同步功能开发中...');
    }

    showCreateModal() {
        Toast.info('新增元数据功能开发中...');
    }

    viewDetail(id) {
        Toast.info('查看详情功能开发中...');
    }

    viewFields(id) {
        this.switchTab('fields');
        Toast.info(`查看表 ${id} 的字段信息`);
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
     * 查看详情
     */
    viewDetail(id) {
        const table = metadataService.getTableById(id);
        if (!table) {
            Toast.error('数据不存在');
            return;
        }
        
        this.currentDetailId = id;
        
        // 填充基本信息
        document.getElementById('detailTableName').innerHTML = `<code>${table.tableName}</code>`;
        document.getElementById('detailTableComment').textContent = table.tableComment;
        document.getElementById('detailDatasource').innerHTML = `<span class="badge badge-info">${table.datasource}</span>`;
        document.getElementById('detailOwner').textContent = table.owner;
        document.getElementById('detailRowCount').textContent = table.rowCount.toLocaleString();
        document.getElementById('detailSize').textContent = table.size;
        document.getElementById('detailCreateTime').textContent = table.createTime || '-';
        document.getElementById('detailUpdateTime').textContent = table.updateTime;
        
        // 填充字段信息
        const fieldsContainer = document.getElementById('detailFields');
        if (table.fields && table.fields.length > 0) {
            fieldsContainer.innerHTML = `
                <table class="detail-table">
                    <thead>
                        <tr>
                            <th>字段名</th>
                            <th>字段注释</th>
                            <th>数据类型</th>
                            <th>主键</th>
                            <th>可空</th>
                            <th>默认值</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${table.fields.map(field => `
                            <tr>
                                <td><code>${field.fieldName}</code></td>
                                <td>${field.fieldComment}</td>
                                <td>${field.dataType}</td>
                                <td>${field.isPrimaryKey ? '<span class="badge badge-success">是</span>' : '-'}</td>
                                <td>${field.isNullable ? '是' : '否'}</td>
                                <td>${field.defaultValue || '-'}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
        } else {
            fieldsContainer.innerHTML = '<p style="color: #6B7280; font-size: 13px;">暂无字段信息</p>';
        }
        
        // 填充索引信息
        const indexesContainer = document.getElementById('detailIndexes');
        if (table.indexes && table.indexes.length > 0) {
            indexesContainer.innerHTML = table.indexes.map(index => `
                <div class="index-item">
                    <div class="index-header">
                        <span class="index-name"><i class="fas fa-key"></i> ${index.indexName}</span>
                        <span class="badge badge-${index.isUnique ? 'success' : 'info'}">${index.isUnique ? '唯一索引' : '普通索引'}</span>
                    </div>
                    <div class="index-fields">
                        <span>字段: ${index.fields.join(', ')}</span>
                    </div>
                </div>
            `).join('');
        } else {
            indexesContainer.innerHTML = '<p style="color: #6B7280; font-size: 13px;">暂无索引信息</p>';
        }
        
        // 显示模态框
        const modal = document.getElementById('detailModal');
        modal.style.display = 'flex';
        setTimeout(() => {
            modal.classList.add('modal-show');
        }, 10);
    }
    
    /**
     * 关闭详情模态框
     */
    closeDetailModal() {
        const modal = document.getElementById('detailModal');
        if (modal) {
            modal.classList.remove('modal-show');
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300);
        }
        this.currentDetailId = null;
    }
    
    /**
     * 显示创建模态框
     */
    showCreateModal() {
        this.editingId = null;
        
        const modal = document.getElementById('createModal');
        if (!modal) {
            Toast.error('模态框初始化失败');
            return;
        }
        
        const modalTitle = document.getElementById('createModalTitle');
        if (modalTitle) {
            modalTitle.innerHTML = '<i class="fas fa-plus-circle"></i>新增元数据';
        }
        
        const form = document.getElementById('metadataForm');
        if (form) {
            form.reset();
        }
        
        // 重置字段容器
        const fieldsContainer = document.getElementById('fieldsContainer');
        if (fieldsContainer) {
            fieldsContainer.innerHTML = `
                <div class="field-row">
                    <input type="text" class="form-control" placeholder="字段名" name="fieldName[]">
                    <input type="text" class="form-control" placeholder="字段注释" name="fieldComment[]">
                    <select class="form-control" name="dataType[]">
                        <option value="">数据类型</option>
                        <option value="VARCHAR">VARCHAR</option>
                        <option value="INT">INT</option>
                        <option value="BIGINT">BIGINT</option>
                        <option value="DECIMAL">DECIMAL</option>
                        <option value="DATE">DATE</option>
                        <option value="DATETIME">DATETIME</option>
                        <option value="TEXT">TEXT</option>
                    </select>
                    <label class="checkbox-label">
                        <input type="checkbox" name="isPrimaryKey[]">
                        <span>主键</span>
                    </label>
                    <button type="button" class="btn-icon" onclick="metadataPage.removeField(this)">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `;
        }
        
        // 显示模态框
        modal.style.display = 'flex';
        setTimeout(() => {
            modal.classList.add('modal-show');
        }, 10);
    }
    
    /**
     * 关闭创建模态框
     */
    closeCreateModal() {
        const modal = document.getElementById('createModal');
        if (modal) {
            modal.classList.remove('modal-show');
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300);
        }
        this.editingId = null;
    }
    
    /**
     * 添加字段行
     */
    addField() {
        const container = document.getElementById('fieldsContainer');
        const fieldRow = document.createElement('div');
        fieldRow.className = 'field-row';
        fieldRow.innerHTML = `
            <input type="text" class="form-control" placeholder="字段名" name="fieldName[]">
            <input type="text" class="form-control" placeholder="字段注释" name="fieldComment[]">
            <select class="form-control" name="dataType[]">
                <option value="">数据类型</option>
                <option value="VARCHAR">VARCHAR</option>
                <option value="INT">INT</option>
                <option value="BIGINT">BIGINT</option>
                <option value="DECIMAL">DECIMAL</option>
                <option value="DATE">DATE</option>
                <option value="DATETIME">DATETIME</option>
                <option value="TEXT">TEXT</option>
            </select>
            <label class="checkbox-label">
                <input type="checkbox" name="isPrimaryKey[]">
                <span>主键</span>
            </label>
            <button type="button" class="btn-icon" onclick="metadataPage.removeField(this)">
                <i class="fas fa-times"></i>
            </button>
        `;
        container.appendChild(fieldRow);
    }
    
    /**
     * 删除字段行
     */
    removeField(button) {
        const container = document.getElementById('fieldsContainer');
        if (container.children.length > 1) {
            button.closest('.field-row').remove();
        } else {
            Toast.warning('至少保留一个字段');
        }
    }
    
    /**
     * 提交表单
     */
    submitForm() {
        const tableName = document.getElementById('tableName').value.trim();
        const datasource = document.getElementById('datasource').value;
        const tableComment = document.getElementById('tableComment').value.trim();
        
        if (!tableName || !datasource || !tableComment) {
            Toast.error('请填写必填项');
            return;
        }
        
        // 收集字段信息
        const fieldNames = document.getElementsByName('fieldName[]');
        const fieldComments = document.getElementsByName('fieldComment[]');
        const dataTypes = document.getElementsByName('dataType[]');
        const isPrimaryKeys = document.getElementsByName('isPrimaryKey[]');
        
        const fields = [];
        for (let i = 0; i < fieldNames.length; i++) {
            const fieldName = fieldNames[i].value.trim();
            const fieldComment = fieldComments[i].value.trim();
            const dataType = dataTypes[i].value;
            
            if (fieldName && dataType) {
                fields.push({
                    fieldName,
                    fieldComment,
                    dataType,
                    isPrimaryKey: isPrimaryKeys[i].checked,
                    isNullable: !isPrimaryKeys[i].checked
                });
            }
        }
        
        if (fields.length === 0) {
            Toast.error('请至少添加一个字段');
            return;
        }
        
        const formData = {
            tableName,
            datasource,
            tableComment,
            owner: document.getElementById('owner').value.trim(),
            rowCount: parseInt(document.getElementById('rowCount').value) || 0,
            description: document.getElementById('description').value.trim(),
            fields
        };
        
        try {
            Loading.show('保存中...');
            
            if (this.editingId) {
                metadataService.updateTable(this.editingId, formData);
                Toast.success('更新成功');
            } else {
                metadataService.createTable(formData);
                Toast.success('创建成功');
            }
            
            Loading.hide();
            this.closeCreateModal();
            this.loadData();
            this.updateStatistics();
            
        } catch (error) {
            Loading.hide();
            Toast.error('保存失败: ' + error.message);
        }
    }
    
    /**
     * 查看字段
     */
    viewFields(id) {
        this.currentDetailId = id;
        this.switchTab('fields');
    }
    
    /**
     * 同步元数据
     */
    syncMetadata() {
        Modal.confirm({
            title: '同步元数据',
            content: '确定要从数据源同步元数据吗？此操作可能需要一些时间。',
            onConfirm: () => {
                Loading.show('同步中...');
                setTimeout(() => {
                    Loading.hide();
                    Toast.success('元数据同步成功');
                    this.loadData();
                    this.updateStatistics();
                }, 2000);
            }
        });
    }
    
    /**
     * 导出数据
     */
    exportData() {
        Toast.info('导出功能开发中...');
    }
    
    /**
     * 刷新数据
     */
    refreshData() {
        this.loadData();
        this.updateStatistics();
        Toast.success('刷新成功');
    }
    
    /**
     * 切换标签页
     */
    switchTab(tab) {
        this.currentTab = tab;
        this.currentPage = 1;
        
        // 更新标签按钮状态
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.tab === tab) {
                btn.classList.add('active');
            }
        });
        
        this.loadData();
    }
    
    /**
     * 处理搜索
     */
    handleSearch() {
        this.searchKeyword = document.getElementById('searchInput').value;
        this.currentPage = 1;
        this.loadData();
    }
    
    /**
     * 上一页
     */
    prevPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.loadData();
        }
    }
    
    /**
     * 下一页
     */
    nextPage() {
        const totalPages = Math.ceil(this.getTotalCount() / this.pageSize);
        if (this.currentPage < totalPages) {
            this.currentPage++;
            this.loadData();
        }
    }
    
    /**
     * 获取总数
     */
    getTotalCount() {
        const filters = {
            datasource: document.getElementById('filter-datasource')?.value || '',
            search: this.searchKeyword
        };
        
        if (this.currentTab === 'tables') {
            return metadataService.getTables(filters).length;
        } else if (this.currentTab === 'fields') {
            return metadataService.getFields(filters).length;
        } else if (this.currentTab === 'lineage') {
            return metadataService.getLineages(filters).length;
        }
        return 0;
    }
}


// 创建页面实例
const metadataPage = new MetadataPage();

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    metadataPage.init();
});
