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
        Modal.confirm({
            title: '<i class="fas fa-magic"></i> 自动分类',
            content: `
                <div style="padding: 16px;">
                    <p style="margin-bottom: 16px;">系统将根据以下规则自动对数据进行分类：</p>
                    <ul style="margin-left: 20px; line-height: 1.8;">
                        <li>包含身份证、手机号等字段 → <strong>个人信息 (L3-敏感)</strong></li>
                        <li>包含金额、账号等字段 → <strong>财务数据 (L4-机密)</strong></li>
                        <li>包含项目、合同等字段 → <strong>业务数据 (L2-内部)</strong></li>
                        <li>包含日志、配置等字段 → <strong>系统数据 (L1-公开)</strong></li>
                    </ul>
                    <p style="margin-top: 16px; color: #F59E0B;">
                        <i class="fas fa-exclamation-triangle"></i> 
                        注意：自动分类可能不完全准确，建议人工复核
                    </p>
                </div>
            `,
            confirmText: '开始分类',
            cancelText: '取消',
            onConfirm: () => {
                this.performAutoClassify();
            }
        });
    }
    
    async performAutoClassify() {
        Loading.show('正在自动分类...');
        
        try {
            // 模拟自动分类过程
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            const result = dataClassificationService.performAutoClassification();
            
            Loading.hide();
            
            if (result.success) {
                Modal.alert({
                    title: '自动分类完成',
                    content: `
                        <div style="padding: 16px;">
                            <div style="margin-bottom: 16px;">
                                <i class="fas fa-check-circle" style="color: #10B981; font-size: 48px;"></i>
                            </div>
                            <p style="margin-bottom: 12px; font-size: 16px;">分类结果：</p>
                            <div style="background: #F9FAFB; padding: 16px; border-radius: 8px;">
                                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;">
                                    <div>
                                        <span style="color: #666;">扫描表数：</span>
                                        <strong>${result.scannedTables}</strong>
                                    </div>
                                    <div>
                                        <span style="color: #666;">已分类：</span>
                                        <strong style="color: #10B981;">${result.classifiedTables}</strong>
                                    </div>
                                    <div>
                                        <span style="color: #666;">新增分类：</span>
                                        <strong style="color: #3B82F6;">${result.newClassifications}</strong>
                                    </div>
                                    <div>
                                        <span style="color: #666;">更新分类：</span>
                                        <strong style="color: #F59E0B;">${result.updatedClassifications}</strong>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `,
                    width: '500px'
                });
                
                this.loadData();
                this.updateStatistics();
            } else {
                Toast.error(result.message || '自动分类失败');
            }
        } catch (error) {
            Loading.hide();
            Toast.error('自动分类失败: ' + error.message);
        }
    }

    showCreateModal() {
        Modal.show({
            title: '<i class="fas fa-plus-circle"></i> 新增数据分类',
            content: this.getCreateFormHTML(),
            width: '600px',
            onConfirm: () => this.handleCreate(),
            confirmText: '创建',
            cancelText: '取消'
        });
    }
    
    getCreateFormHTML() {
        return `
            <form id="createCategoryForm" class="form-vertical">
                <div class="form-group">
                    <label class="form-label required">分类名称</label>
                    <input type="text" id="categoryName" class="form-control" 
                           placeholder="例如：个人信息" required>
                    <small class="form-text">清晰描述数据类别</small>
                </div>
                
                <div class="form-group">
                    <label class="form-label required">分类编码</label>
                    <input type="text" id="categoryCode" class="form-control" 
                           placeholder="例如：PERSONAL_INFO" required>
                    <small class="form-text">使用大写字母和下划线，保持唯一性</small>
                </div>
                
                <div class="form-group">
                    <label class="form-label required">数据级别</label>
                    <select id="categoryLevel" class="form-control" required>
                        <option value="">请选择数据级别</option>
                        <option value="L1">L1 - 公开（可以公开访问）</option>
                        <option value="L2">L2 - 内部（仅限内部人员）</option>
                        <option value="L3">L3 - 敏感（需严格控制）</option>
                        <option value="L4">L4 - 机密（最高级别保护）</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label class="form-label">分类描述</label>
                    <textarea id="categoryDesc" class="form-control" rows="3" 
                              placeholder="详细描述该分类包含的数据类型和范围"></textarea>
                </div>
                
                <div class="form-group">
                    <label class="form-label">关键字段</label>
                    <input type="text" id="categoryFields" class="form-control" 
                           placeholder="例如：name, id_card, phone（用逗号分隔）">
                    <small class="form-text">用于自动分类识别的关键字段名</small>
                </div>
                
                <div class="form-group">
                    <label class="form-label">控制措施</label>
                    <textarea id="categoryControl" class="form-control" rows="2" 
                              placeholder="描述该分类数据的访问控制和安全措施"></textarea>
                </div>
                
                <div class="form-group">
                    <label class="checkbox-label">
                        <input type="checkbox" id="categoryActive" checked>
                        <span>启用该分类</span>
                    </label>
                </div>
            </form>
        `;
    }
    
    handleCreate() {
        const form = document.getElementById('createCategoryForm');
        if (!form.checkValidity()) {
            Toast.error('请填写必填项');
            return false;
        }
        
        const formData = {
            name: document.getElementById('categoryName').value.trim(),
            code: document.getElementById('categoryCode').value.trim().toUpperCase(),
            level: document.getElementById('categoryLevel').value,
            description: document.getElementById('categoryDesc').value.trim(),
            fields: document.getElementById('categoryFields').value.trim(),
            controlMeasure: document.getElementById('categoryControl').value.trim(),
            active: document.getElementById('categoryActive').checked
        };
        
        // 验证编码格式
        if (!/^[A-Z_]+$/.test(formData.code)) {
            Toast.error('分类编码只能包含大写字母和下划线');
            return false;
        }
        
        const result = dataClassificationService.createCategory(formData);
        
        if (result.success) {
            Toast.success('数据分类创建成功');
            this.loadData();
            this.updateStatistics();
            return true;
        } else {
            Toast.error(result.message || '创建失败');
            return false;
        }
    }

    editCategory(id) {
        const category = dataClassificationService.getCategoryById(id);
        if (!category) {
            Toast.error('分类不存在');
            return;
        }
        
        Modal.show({
            title: '<i class="fas fa-edit"></i> 编辑数据分类',
            content: this.getEditFormHTML(category),
            width: '600px',
            onConfirm: () => this.handleEdit(id),
            confirmText: '保存',
            cancelText: '取消'
        });
    }
    
    getEditFormHTML(category) {
        return `
            <form id="editCategoryForm" class="form-vertical">
                <div class="form-group">
                    <label class="form-label required">分类名称</label>
                    <input type="text" id="editCategoryName" class="form-control" 
                           value="${category.name}" required>
                </div>
                
                <div class="form-group">
                    <label class="form-label required">分类编码</label>
                    <input type="text" id="editCategoryCode" class="form-control" 
                           value="${category.code}" required>
                    <small class="form-text">修改编码可能影响现有映射关系</small>
                </div>
                
                <div class="form-group">
                    <label class="form-label required">数据级别</label>
                    <select id="editCategoryLevel" class="form-control" required>
                        <option value="L1" ${category.level === 'L1' ? 'selected' : ''}>L1 - 公开</option>
                        <option value="L2" ${category.level === 'L2' ? 'selected' : ''}>L2 - 内部</option>
                        <option value="L3" ${category.level === 'L3' ? 'selected' : ''}>L3 - 敏感</option>
                        <option value="L4" ${category.level === 'L4' ? 'selected' : ''}>L4 - 机密</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label class="form-label">分类描述</label>
                    <textarea id="editCategoryDesc" class="form-control" rows="3">${category.description}</textarea>
                </div>
                
                <div class="form-group">
                    <label class="form-label">关键字段</label>
                    <input type="text" id="editCategoryFields" class="form-control" 
                           value="${category.fields || ''}">
                </div>
                
                <div class="form-group">
                    <label class="form-label">控制措施</label>
                    <textarea id="editCategoryControl" class="form-control" rows="2">${category.controlMeasure || ''}</textarea>
                </div>
            </form>
        `;
    }
    
    handleEdit(id) {
        const form = document.getElementById('editCategoryForm');
        if (!form.checkValidity()) {
            Toast.error('请填写必填项');
            return false;
        }
        
        const formData = {
            name: document.getElementById('editCategoryName').value.trim(),
            code: document.getElementById('editCategoryCode').value.trim().toUpperCase(),
            level: document.getElementById('editCategoryLevel').value,
            description: document.getElementById('editCategoryDesc').value.trim(),
            fields: document.getElementById('editCategoryFields').value.trim(),
            controlMeasure: document.getElementById('editCategoryControl').value.trim()
        };
        
        const result = dataClassificationService.updateCategory(id, formData);
        
        if (result.success) {
            Toast.success('数据分类更新成功');
            this.loadData();
            this.updateStatistics();
            return true;
        } else {
            Toast.error(result.message || '更新失败');
            return false;
        }
    }

    viewTables(id) {
        this.switchTab('mapping');
        Toast.info(`查看分类 ${id} 的关联表`);
    }

    editMapping(id) {
        const mapping = dataClassificationService.getMappingById(id);
        if (!mapping) {
            Toast.error('映射不存在');
            return;
        }
        
        Modal.show({
            title: '<i class="fas fa-edit"></i> 编辑分类映射',
            content: this.getMappingEditFormHTML(mapping),
            width: '600px',
            onConfirm: () => this.handleMappingEdit(id),
            confirmText: '保存',
            cancelText: '取消'
        });
    }
    
    getMappingEditFormHTML(mapping) {
        const categories = dataClassificationService.getCategories();
        
        return `
            <form id="editMappingForm" class="form-vertical">
                <div class="form-group">
                    <label class="form-label">表名</label>
                    <input type="text" class="form-control" value="${mapping.tableName}" disabled>
                    <small class="form-text">表名不可修改</small>
                </div>
                
                <div class="form-group">
                    <label class="form-label required">数据分类</label>
                    <select id="editMappingCategory" class="form-control" required>
                        ${categories.map(c => `
                            <option value="${c.name}" ${c.name === mapping.category ? 'selected' : ''}>
                                ${c.name} (${c.code})
                            </option>
                        `).join('')}
                    </select>
                </div>
                
                <div class="form-group">
                    <label class="form-label required">数据级别</label>
                    <select id="editMappingLevel" class="form-control" required>
                        <option value="L1" ${mapping.level === 'L1' ? 'selected' : ''}>L1 - 公开</option>
                        <option value="L2" ${mapping.level === 'L2' ? 'selected' : ''}>L2 - 内部</option>
                        <option value="L3" ${mapping.level === 'L3' ? 'selected' : ''}>L3 - 敏感</option>
                        <option value="L4" ${mapping.level === 'L4' ? 'selected' : ''}>L4 - 机密</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label class="form-label">关键字段</label>
                    <input type="text" id="editMappingFields" class="form-control" 
                           value="${mapping.fields.join(', ')}"
                           placeholder="用逗号分隔多个字段">
                    <small class="form-text">标识该表中的敏感或关键字段</small>
                </div>
                
                <div class="form-group">
                    <label class="checkbox-label">
                        <input type="checkbox" id="editMappingAuto" ${mapping.autoClassified ? 'checked' : ''}>
                        <span>标记为自动分类</span>
                    </label>
                </div>
            </form>
        `;
    }
    
    handleMappingEdit(id) {
        const form = document.getElementById('editMappingForm');
        if (!form.checkValidity()) {
            Toast.error('请填写必填项');
            return false;
        }
        
        const fieldsValue = document.getElementById('editMappingFields').value.trim();
        const fields = fieldsValue ? fieldsValue.split(',').map(f => f.trim()).filter(f => f) : [];
        
        const formData = {
            category: document.getElementById('editMappingCategory').value,
            level: document.getElementById('editMappingLevel').value,
            fields: fields,
            autoClassified: document.getElementById('editMappingAuto').checked
        };
        
        const result = dataClassificationService.updateMapping(id, formData);
        
        if (result.success) {
            Toast.success('映射更新成功');
            this.loadData();
            this.updateStatistics();
            return true;
        } else {
            Toast.error(result.message || '更新失败');
            return false;
        }
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
