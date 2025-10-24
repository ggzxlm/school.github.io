/**
 * 主数据类型管理页面脚本
 */

let editingTypeId = null;
let fields = [];

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    loadTypes();
    updateStatistics();
});

/**
 * 加载类型列表
 */
function loadTypes() {
    const types = window.masterDataTypeService.getAllTypes();
    const container = document.getElementById('typeList');

    if (types.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">📦</div>
                <p>暂无主数据类型</p>
                <button class="btn btn-primary" onclick="showCreateTypeModal()">创建第一个类型</button>
            </div>
        `;
        return;
    }

    container.innerHTML = types.map(type => `
        <div class="type-card">
            <div class="type-header">
                <div class="type-title">
                    <div class="type-icon">
                        <i class="fas ${type.icon}"></i>
                    </div>
                    <div>
                        <h3 style="margin: 0; font-size: 16px; font-weight: 600;">${type.name}</h3>
                        <p style="margin: 4px 0 0 0; font-size: 13px; color: #6B7280;">${type.description || '无描述'}</p>
                    </div>
                </div>
                <div style="display: flex; align-items: center; gap: 12px;">
                    <span class="type-badge ${type.isSystem ? 'system' : 'custom'}">
                        ${type.isSystem ? '系统类型' : '自定义'}
                    </span>
                    <div class="action-buttons">
                        <button class="btn-icon" onclick="viewType('${type.id}')" title="查看">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn-icon" onclick="editType('${type.id}')" title="编辑">
                            <i class="fas fa-edit"></i>
                        </button>
                        ${!type.isSystem ? `
                            <button class="btn-icon btn-danger" onclick="deleteType('${type.id}')" title="删除">
                                <i class="fas fa-trash"></i>
                            </button>
                        ` : ''}
                    </div>
                </div>
            </div>
            <div class="field-list">
                <div style="font-size: 13px; font-weight: 500; color: #374151; margin-bottom: 8px;">
                    字段定义 (${type.fields.length}个)
                </div>
                ${type.fields.map(field => `
                    <div class="field-item">
                        <i class="fas fa-${field.type === 'text' ? 'font' : field.type === 'number' ? 'hashtag' : field.type === 'email' ? 'envelope' : 'cube'}"></i>
                        <span>${field.label}</span>
                        ${field.required ? '<span class="field-required">*</span>' : ''}
                        ${field.unique ? '<span class="badge badge-info" style="font-size: 11px;">唯一</span>' : ''}
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');

    updateStatistics();
}

/**
 * 更新统计信息
 */
function updateStatistics() {
    const stats = window.masterDataTypeService.getStatistics();
    const types = window.masterDataTypeService.getAllTypes();
    const totalFields = types.reduce((sum, type) => sum + type.fields.length, 0);

    document.getElementById('totalTypes').textContent = stats.total;
    document.getElementById('systemTypes').textContent = stats.system;
    document.getElementById('customTypes').textContent = stats.custom;
    document.getElementById('totalFields').textContent = totalFields;

    if (stats.total > 0) {
        document.getElementById('systemPercent').textContent = 
            `${Math.round(stats.system / stats.total * 100)}% 占比`;
        document.getElementById('customPercent').textContent = 
            `${Math.round(stats.custom / stats.total * 100)}% 占比`;
    }
}

/**
 * 显示创建类型模态框
 */
function showCreateTypeModal() {
    editingTypeId = null;
    fields = [];
    
    document.getElementById('typeModalTitle').textContent = '新建主数据类型';
    document.getElementById('typeForm').reset();
    document.getElementById('typeId').disabled = false;
    document.getElementById('fieldsList').innerHTML = '';
    
    // 添加一个默认字段
    addField();
    
    const modal = document.getElementById('typeModal');
    modal.style.display = 'flex';
    modal.classList.add('show');
}

/**
 * 编辑类型
 */
function editType(typeId) {
    const type = window.masterDataTypeService.getTypeById(typeId);
    if (!type) {
        Toast.error('类型不存在');
        return;
    }

    editingTypeId = typeId;
    fields = JSON.parse(JSON.stringify(type.fields)); // 深拷贝

    document.getElementById('typeModalTitle').textContent = '编辑主数据类型';
    document.getElementById('typeId').value = type.id;
    document.getElementById('typeId').disabled = true;
    document.getElementById('typeName').value = type.name;
    document.getElementById('typeIcon').value = type.icon;
    document.getElementById('typeDescription').value = type.description || '';

    renderFields();

    const modal = document.getElementById('typeModal');
    modal.style.display = 'flex';
    modal.classList.add('show');
}

/**
 * 查看类型
 */
function viewType(typeId) {
    const type = window.masterDataTypeService.getTypeById(typeId);
    if (!type) {
        Toast.error('类型不存在');
        return;
    }

    const content = `
        <div style="padding: 16px;">
            <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 20px;">
                <div style="width: 60px; height: 60px; border-radius: 12px; background: #EEF2FF; display: flex; align-items: center; justify-content: center; font-size: 28px; color: #4F46E5;">
                    <i class="fas ${type.icon}"></i>
                </div>
                <div>
                    <h3 style="margin: 0; font-size: 20px;">${type.name}</h3>
                    <p style="margin: 4px 0 0 0; color: #6B7280;">${type.description || '无描述'}</p>
                </div>
            </div>

            <div style="margin-bottom: 16px;">
                <strong>类型ID:</strong> ${type.id}
            </div>
            <div style="margin-bottom: 16px;">
                <strong>类型:</strong> 
                <span class="badge ${type.isSystem ? 'badge-info' : 'badge-success'}">
                    ${type.isSystem ? '系统类型' : '自定义类型'}
                </span>
            </div>
            <div style="margin-bottom: 16px;">
                <strong>创建时间:</strong> ${Utils.formatDate(type.createdAt)}
            </div>
            <div style="margin-bottom: 16px;">
                <strong>更新时间:</strong> ${Utils.formatDate(type.updatedAt)}
            </div>

            <h4 style="margin-top: 24px; margin-bottom: 12px;">字段定义 (${type.fields.length}个)</h4>
            <table class="table">
                <thead>
                    <tr>
                        <th>字段ID</th>
                        <th>字段名称</th>
                        <th>类型</th>
                        <th>必填</th>
                        <th>唯一</th>
                        <th>匹配权重</th>
                    </tr>
                </thead>
                <tbody>
                    ${type.fields.map(field => `
                        <tr>
                            <td><code>${field.id}</code></td>
                            <td>${field.label}</td>
                            <td>${field.type}</td>
                            <td>${field.required ? '<span class="badge badge-danger">是</span>' : '否'}</td>
                            <td>${field.unique ? '<span class="badge badge-info">是</span>' : '否'}</td>
                            <td>${field.matchWeight || 0}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;

    Modal.alert({
        title: '类型详情',
        content: content,
        width: '700px'
    });
}

/**
 * 删除类型
 */
function deleteType(typeId) {
    const type = window.masterDataTypeService.getTypeById(typeId);
    if (!type) {
        Toast.error('类型不存在');
        return;
    }

    Modal.confirm({
        title: '确认删除',
        content: `确定要删除类型"${type.name}"吗？此操作不可恢复。`,
        onConfirm: () => {
            const result = window.masterDataTypeService.deleteType(typeId);
            if (result.success) {
                Toast.success('删除成功');
                loadTypes();
            } else {
                Toast.error(result.error || '删除失败');
            }
        }
    });
}

/**
 * 添加字段
 */
function addField() {
    const field = {
        id: '',
        label: '',
        type: 'text',
        required: false,
        unique: false,
        matchWeight: 0.1
    };
    fields.push(field);
    renderFields();
}

/**
 * 渲染字段列表
 */
function renderFields() {
    const container = document.getElementById('fieldsList');
    container.innerHTML = fields.map((field, index) => `
        <div class="field-editor" style="border: 1px solid #E5E7EB; border-radius: 6px; padding: 16px; margin-bottom: 12px; background: #F9FAFB;">
            <div style="display: flex; justify-content: between; align-items: center; margin-bottom: 12px;">
                <strong>字段 ${index + 1}</strong>
                <button type="button" class="btn-icon btn-danger" onclick="removeField(${index})" title="删除字段">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>字段ID <span class="required">*</span></label>
                    <input type="text" class="form-control" value="${field.id}" 
                           onchange="updateField(${index}, 'id', this.value)" 
                           placeholder="例如: assetCode">
                </div>
                <div class="form-group">
                    <label>字段名称 <span class="required">*</span></label>
                    <input type="text" class="form-control" value="${field.label}" 
                           onchange="updateField(${index}, 'label', this.value)" 
                           placeholder="例如: 资产编码">
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>字段类型</label>
                    <select class="form-control" onchange="updateField(${index}, 'type', this.value)">
                        <option value="text" ${field.type === 'text' ? 'selected' : ''}>文本</option>
                        <option value="number" ${field.type === 'number' ? 'selected' : ''}>数字</option>
                        <option value="email" ${field.type === 'email' ? 'selected' : ''}>邮箱</option>
                        <option value="date" ${field.type === 'date' ? 'selected' : ''}>日期</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>匹配权重</label>
                    <input type="number" class="form-control" value="${field.matchWeight}" 
                           onchange="updateField(${index}, 'matchWeight', parseFloat(this.value))" 
                           min="0" max="1" step="0.1" 
                           placeholder="0-1之间">
                    <small class="form-text">用于重复识别，1表示完全匹配</small>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label class="checkbox-label">
                        <input type="checkbox" ${field.required ? 'checked' : ''} 
                               onchange="updateField(${index}, 'required', this.checked)">
                        <span>必填字段</span>
                    </label>
                </div>
                <div class="form-group">
                    <label class="checkbox-label">
                        <input type="checkbox" ${field.unique ? 'checked' : ''} 
                               onchange="updateField(${index}, 'unique', this.checked)">
                        <span>唯一字段</span>
                    </label>
                </div>
            </div>
        </div>
    `).join('');
}

/**
 * 更新字段
 */
function updateField(index, key, value) {
    fields[index][key] = value;
}

/**
 * 删除字段
 */
function removeField(index) {
    fields.splice(index, 1);
    renderFields();
}

/**
 * 保存类型
 */
function saveType() {
    const typeId = document.getElementById('typeId').value.trim();
    const typeName = document.getElementById('typeName').value.trim();
    const typeIcon = document.getElementById('typeIcon').value.trim() || 'fa-cube';
    const typeDescription = document.getElementById('typeDescription').value.trim();

    // 验证
    if (!typeId) {
        Toast.error('请输入类型ID');
        return;
    }

    if (!/^[A-Z_]+$/.test(typeId)) {
        Toast.error('类型ID只能包含大写字母和下划线');
        return;
    }

    if (!typeName) {
        Toast.error('请输入类型名称');
        return;
    }

    if (fields.length === 0) {
        Toast.error('请至少添加一个字段');
        return;
    }

    // 验证字段
    for (let i = 0; i < fields.length; i++) {
        const field = fields[i];
        if (!field.id || !field.label) {
            Toast.error(`字段 ${i + 1} 的ID和名称不能为空`);
            return;
        }
        if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(field.id)) {
            Toast.error(`字段 ${i + 1} 的ID格式不正确`);
            return;
        }
    }

    const typeData = {
        id: typeId,
        name: typeName,
        icon: typeIcon,
        description: typeDescription,
        fields: fields
    };

    let result;
    if (editingTypeId) {
        result = window.masterDataTypeService.updateType(editingTypeId, typeData);
    } else {
        result = window.masterDataTypeService.createType(typeData);
    }

    if (result.success) {
        Toast.success(editingTypeId ? '更新成功' : '创建成功');
        closeTypeModal();
        loadTypes();
    } else {
        Toast.error(result.error || '操作失败');
    }
}

/**
 * 关闭类型模态框
 */
function closeTypeModal() {
    const modal = document.getElementById('typeModal');
    modal.classList.remove('show');
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
}
