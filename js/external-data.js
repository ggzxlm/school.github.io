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
        Modal.show({
            title: '<i class="fas fa-plus-circle"></i> 新增数据接入',
            content: this.getCreateFormHTML(),
            width: '700px',
            onConfirm: () => this.handleCreate(),
            confirmText: '创建',
            cancelText: '取消'
        });
        
        // 初始化表单事件
        setTimeout(() => {
            this.initFormEvents();
        }, 100);
    }
    
    getCreateFormHTML() {
        return `
            <form id="createConnectionForm" class="form-horizontal">
                <div class="form-section">
                    <h4 class="form-section-title">基本信息</h4>
                    
                    <div class="form-group">
                        <label class="form-label required">接入名称</label>
                        <input type="text" id="connectionName" class="form-control" 
                               placeholder="请输入接入名称" required>
                        <small class="form-text">例如：教务系统学生数据接入</small>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label required">接入类型</label>
                        <select id="connectionType" class="form-control" required onchange="externalDataPage.handleTypeChange()">
                            <option value="">请选择接入类型</option>
                            <option value="API">API接入</option>
                            <option value="file">文件接入</option>
                            <option value="system">系统接入</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label required">数据源名称</label>
                        <input type="text" id="datasourceName" class="form-control" 
                               placeholder="请输入数据源名称" required>
                        <small class="form-text">例如：教务管理系统</small>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">描述</label>
                        <textarea id="connectionDesc" class="form-control" rows="3" 
                                  placeholder="请输入接入描述"></textarea>
                    </div>
                </div>
                
                <!-- API接入配置 -->
                <div id="apiConfig" class="form-section" style="display: none;">
                    <h4 class="form-section-title">API配置</h4>
                    
                    <div class="form-group">
                        <label class="form-label required">API地址</label>
                        <input type="url" id="apiUrl" class="form-control" 
                               placeholder="https://api.example.com/data">
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">请求方法</label>
                        <select id="apiMethod" class="form-control">
                            <option value="GET">GET</option>
                            <option value="POST">POST</option>
                            <option value="PUT">PUT</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">认证方式</label>
                        <select id="authType" class="form-control">
                            <option value="none">无需认证</option>
                            <option value="basic">Basic Auth</option>
                            <option value="bearer">Bearer Token</option>
                            <option value="apikey">API Key</option>
                        </select>
                    </div>
                    
                    <div class="form-group" id="authCredentials" style="display: none;">
                        <label class="form-label">认证凭证</label>
                        <input type="text" id="authValue" class="form-control" 
                               placeholder="请输入认证凭证">
                    </div>
                </div>
                
                <!-- 文件接入配置 -->
                <div id="fileConfig" class="form-section" style="display: none;">
                    <h4 class="form-section-title">文件配置</h4>
                    
                    <div class="form-group">
                        <label class="form-label required">文件类型</label>
                        <select id="fileType" class="form-control">
                            <option value="excel">Excel (xlsx/xls)</option>
                            <option value="csv">CSV</option>
                            <option value="json">JSON</option>
                            <option value="xml">XML</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">文件路径</label>
                        <input type="text" id="filePath" class="form-control" 
                               placeholder="/data/import/">
                        <small class="form-text">服务器上的文件存储路径</small>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">编码格式</label>
                        <select id="fileEncoding" class="form-control">
                            <option value="UTF-8">UTF-8</option>
                            <option value="GBK">GBK</option>
                            <option value="GB2312">GB2312</option>
                        </select>
                    </div>
                </div>
                
                <!-- 系统接入配置 -->
                <div id="systemConfig" class="form-section" style="display: none;">
                    <h4 class="form-section-title">系统配置</h4>
                    
                    <div class="form-group">
                        <label class="form-label required">系统类型</label>
                        <select id="systemType" class="form-control">
                            <option value="database">数据库</option>
                            <option value="webservice">Web Service</option>
                            <option value="message">消息队列</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">连接地址</label>
                        <input type="text" id="systemUrl" class="form-control" 
                               placeholder="jdbc:mysql://localhost:3306/db">
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">用户名</label>
                        <input type="text" id="systemUsername" class="form-control">
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">密码</label>
                        <input type="password" id="systemPassword" class="form-control">
                    </div>
                </div>
                
                <div class="form-section">
                    <h4 class="form-section-title">同步配置</h4>
                    
                    <div class="form-group">
                        <label class="form-label required">同步频率</label>
                        <select id="syncFrequency" class="form-control" required>
                            <option value="">请选择同步频率</option>
                            <option value="realtime">实时</option>
                            <option value="hourly">每小时</option>
                            <option value="daily">每日</option>
                            <option value="weekly">每周</option>
                            <option value="monthly">每月</option>
                            <option value="manual">手动</option>
                        </select>
                    </div>
                    
                    <div class="form-group" id="scheduleTimeGroup" style="display: none;">
                        <label class="form-label">执行时间</label>
                        <input type="time" id="scheduleTime" class="form-control" value="00:00">
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">目标表</label>
                        <input type="text" id="targetTable" class="form-control" 
                               placeholder="请输入目标数据表名">
                    </div>
                    
                    <div class="form-group">
                        <label class="checkbox-label">
                            <input type="checkbox" id="autoStart" checked>
                            <span>创建后自动启动</span>
                        </label>
                    </div>
                </div>
            </form>
        `;
    }
    
    initFormEvents() {
        // 认证方式变化
        const authType = document.getElementById('authType');
        if (authType) {
            authType.addEventListener('change', (e) => {
                const credentials = document.getElementById('authCredentials');
                credentials.style.display = e.target.value !== 'none' ? 'block' : 'none';
            });
        }
        
        // 同步频率变化
        const syncFrequency = document.getElementById('syncFrequency');
        if (syncFrequency) {
            syncFrequency.addEventListener('change', (e) => {
                const scheduleGroup = document.getElementById('scheduleTimeGroup');
                const needsTime = ['daily', 'weekly', 'monthly'].includes(e.target.value);
                scheduleGroup.style.display = needsTime ? 'block' : 'none';
            });
        }
    }
    
    handleTypeChange() {
        const type = document.getElementById('connectionType').value;
        
        // 隐藏所有配置区域
        document.getElementById('apiConfig').style.display = 'none';
        document.getElementById('fileConfig').style.display = 'none';
        document.getElementById('systemConfig').style.display = 'none';
        
        // 显示对应的配置区域
        if (type === 'API') {
            document.getElementById('apiConfig').style.display = 'block';
        } else if (type === 'file') {
            document.getElementById('fileConfig').style.display = 'block';
        } else if (type === 'system') {
            document.getElementById('systemConfig').style.display = 'block';
        }
    }
    
    handleCreate() {
        const form = document.getElementById('createConnectionForm');
        if (!form.checkValidity()) {
            Toast.error('请填写必填项');
            return false;
        }
        
        const formData = {
            name: document.getElementById('connectionName').value,
            type: document.getElementById('connectionType').value,
            datasource: document.getElementById('datasourceName').value,
            description: document.getElementById('connectionDesc').value,
            frequency: this.getFrequencyLabel(document.getElementById('syncFrequency').value),
            syncFrequency: document.getElementById('syncFrequency').value,
            targetTable: document.getElementById('targetTable').value,
            autoStart: document.getElementById('autoStart').checked
        };
        
        // 根据类型收集特定配置
        if (formData.type === 'API') {
            formData.config = {
                url: document.getElementById('apiUrl').value,
                method: document.getElementById('apiMethod').value,
                authType: document.getElementById('authType').value,
                authValue: document.getElementById('authValue').value
            };
        } else if (formData.type === 'file') {
            formData.config = {
                fileType: document.getElementById('fileType').value,
                filePath: document.getElementById('filePath').value,
                encoding: document.getElementById('fileEncoding').value
            };
        } else if (formData.type === 'system') {
            formData.config = {
                systemType: document.getElementById('systemType').value,
                url: document.getElementById('systemUrl').value,
                username: document.getElementById('systemUsername').value,
                password: document.getElementById('systemPassword').value
            };
        }
        
        // 添加到服务
        const result = externalDataService.createConnection(formData);
        
        if (result.success) {
            Toast.success('数据接入创建成功');
            this.loadData();
            this.updateStatistics();
            return true;
        } else {
            Toast.error(result.message || '创建失败');
            return false;
        }
    }
    
    getFrequencyLabel(value) {
        const labels = {
            'realtime': '实时',
            'hourly': '每小时',
            'daily': '每日',
            'weekly': '每周',
            'monthly': '每月',
            'manual': '手动'
        };
        return labels[value] || value;
    }

    viewDetail(id) {
        const connection = externalDataService.getConnectionById(id);
        if (!connection) {
            Toast.error('接入不存在');
            return;
        }
        
        Modal.show({
            title: '<i class="fas fa-info-circle"></i> 接入详情',
            content: this.getDetailHTML(connection),
            width: '800px',
            showCancel: false,
            confirmText: '关闭',
            onConfirm: () => true
        });
    }
    
    getDetailHTML(connection) {
        return `
            <div class="detail-container">
                <!-- 基本信息 -->
                <div class="detail-section">
                    <h4 class="detail-section-title">基本信息</h4>
                    <div class="detail-grid">
                        <div class="detail-item">
                            <label>接入ID</label>
                            <div class="detail-value">${connection.id}</div>
                        </div>
                        <div class="detail-item">
                            <label>接入名称</label>
                            <div class="detail-value">${connection.name}</div>
                        </div>
                        <div class="detail-item">
                            <label>接入类型</label>
                            <div class="detail-value">
                                <span class="badge badge-${this.getTypeBadge(connection.type)}">
                                    ${this.getTypeLabel(connection.type)}
                                </span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <label>数据源</label>
                            <div class="detail-value">${connection.datasource}</div>
                        </div>
                        <div class="detail-item">
                            <label>状态</label>
                            <div class="detail-value">
                                <span class="badge badge-${this.getStatusBadge(connection.status)}">
                                    ${this.getStatusLabel(connection.status)}
                                </span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <label>同步频率</label>
                            <div class="detail-value">${connection.frequency}</div>
                        </div>
                        ${connection.description ? `
                        <div class="detail-item full-width">
                            <label>描述</label>
                            <div class="detail-value">${connection.description}</div>
                        </div>
                        ` : ''}
                    </div>
                </div>
                
                <!-- 配置信息 -->
                ${this.getConfigDetailHTML(connection)}
                
                <!-- 同步信息 -->
                <div class="detail-section">
                    <h4 class="detail-section-title">同步信息</h4>
                    <div class="detail-grid">
                        <div class="detail-item">
                            <label>最后同步时间</label>
                            <div class="detail-value">${connection.lastSync}</div>
                        </div>
                        <div class="detail-item">
                            <label>下次同步时间</label>
                            <div class="detail-value">${connection.nextSync}</div>
                        </div>
                        <div class="detail-item">
                            <label>同步次数</label>
                            <div class="detail-value">${connection.syncCount}</div>
                        </div>
                        <div class="detail-item">
                            <label>错误次数</label>
                            <div class="detail-value ${connection.errorCount > 0 ? 'text-danger' : ''}">
                                ${connection.errorCount}
                            </div>
                        </div>
                        ${connection.targetTable ? `
                        <div class="detail-item">
                            <label>目标表</label>
                            <div class="detail-value">${connection.targetTable}</div>
                        </div>
                        ` : ''}
                    </div>
                </div>
                
                <!-- 时间信息 -->
                <div class="detail-section">
                    <h4 class="detail-section-title">时间信息</h4>
                    <div class="detail-grid">
                        <div class="detail-item">
                            <label>创建时间</label>
                            <div class="detail-value">${connection.createTime}</div>
                        </div>
                        ${connection.updateTime ? `
                        <div class="detail-item">
                            <label>更新时间</label>
                            <div class="detail-value">${connection.updateTime}</div>
                        </div>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
    }
    
    getConfigDetailHTML(connection) {
        if (!connection.config) return '';
        
        let configHTML = '';
        
        if (connection.type === 'API') {
            configHTML = `
                <div class="detail-section">
                    <h4 class="detail-section-title">API配置</h4>
                    <div class="detail-grid">
                        <div class="detail-item full-width">
                            <label>API地址</label>
                            <div class="detail-value code">${connection.config.url || '-'}</div>
                        </div>
                        <div class="detail-item">
                            <label>请求方法</label>
                            <div class="detail-value">${connection.config.method || '-'}</div>
                        </div>
                        <div class="detail-item">
                            <label>认证方式</label>
                            <div class="detail-value">${connection.config.authType || '无'}</div>
                        </div>
                        ${connection.config.authType && connection.config.authType !== 'none' ? `
                        <div class="detail-item full-width">
                            <label>认证凭证</label>
                            <div class="detail-value">********</div>
                        </div>
                        ` : ''}
                    </div>
                </div>
            `;
        } else if (connection.type === 'file') {
            configHTML = `
                <div class="detail-section">
                    <h4 class="detail-section-title">文件配置</h4>
                    <div class="detail-grid">
                        <div class="detail-item">
                            <label>文件类型</label>
                            <div class="detail-value">${connection.config.fileType || '-'}</div>
                        </div>
                        <div class="detail-item">
                            <label>编码格式</label>
                            <div class="detail-value">${connection.config.encoding || '-'}</div>
                        </div>
                        <div class="detail-item full-width">
                            <label>文件路径</label>
                            <div class="detail-value code">${connection.config.filePath || '-'}</div>
                        </div>
                    </div>
                </div>
            `;
        } else if (connection.type === 'system') {
            configHTML = `
                <div class="detail-section">
                    <h4 class="detail-section-title">系统配置</h4>
                    <div class="detail-grid">
                        <div class="detail-item">
                            <label>系统类型</label>
                            <div class="detail-value">${connection.config.systemType || '-'}</div>
                        </div>
                        <div class="detail-item full-width">
                            <label>连接地址</label>
                            <div class="detail-value code">${connection.config.url || '-'}</div>
                        </div>
                        <div class="detail-item">
                            <label>用户名</label>
                            <div class="detail-value">${connection.config.username || '-'}</div>
                        </div>
                        <div class="detail-item">
                            <label>密码</label>
                            <div class="detail-value">********</div>
                        </div>
                    </div>
                </div>
            `;
        }
        
        return configHTML;
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
        const connection = externalDataService.getConnectionById(id);
        if (!connection) {
            Toast.error('接入不存在');
            return;
        }
        
        this.currentEditId = id;
        
        Modal.show({
            title: '<i class="fas fa-edit"></i> 编辑数据接入',
            content: this.getEditFormHTML(connection),
            width: '700px',
            onConfirm: () => this.handleEdit(),
            confirmText: '保存',
            cancelText: '取消'
        });
        
        // 初始化表单事件
        setTimeout(() => {
            this.initFormEvents();
            this.handleTypeChange(); // 显示对应的配置区域
        }, 100);
    }
    
    getEditFormHTML(connection) {
        return `
            <form id="editConnectionForm" class="form-horizontal">
                <div class="form-section">
                    <h4 class="form-section-title">基本信息</h4>
                    
                    <div class="form-group">
                        <label class="form-label">接入ID</label>
                        <input type="text" class="form-control" value="${connection.id}" disabled>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label required">接入名称</label>
                        <input type="text" id="connectionName" class="form-control" 
                               value="${connection.name}" required>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label required">接入类型</label>
                        <select id="connectionType" class="form-control" required onchange="externalDataPage.handleTypeChange()">
                            <option value="API" ${connection.type === 'API' ? 'selected' : ''}>API接入</option>
                            <option value="file" ${connection.type === 'file' ? 'selected' : ''}>文件接入</option>
                            <option value="system" ${connection.type === 'system' ? 'selected' : ''}>系统接入</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label required">数据源名称</label>
                        <input type="text" id="datasourceName" class="form-control" 
                               value="${connection.datasource}" required>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">描述</label>
                        <textarea id="connectionDesc" class="form-control" rows="3">${connection.description || ''}</textarea>
                    </div>
                </div>
                
                <!-- API接入配置 -->
                <div id="apiConfig" class="form-section" style="display: none;">
                    <h4 class="form-section-title">API配置</h4>
                    
                    <div class="form-group">
                        <label class="form-label required">API地址</label>
                        <input type="url" id="apiUrl" class="form-control" 
                               value="${connection.config?.url || ''}"
                               placeholder="https://api.example.com/data">
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">请求方法</label>
                        <select id="apiMethod" class="form-control">
                            <option value="GET" ${connection.config?.method === 'GET' ? 'selected' : ''}>GET</option>
                            <option value="POST" ${connection.config?.method === 'POST' ? 'selected' : ''}>POST</option>
                            <option value="PUT" ${connection.config?.method === 'PUT' ? 'selected' : ''}>PUT</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">认证方式</label>
                        <select id="authType" class="form-control">
                            <option value="none" ${connection.config?.authType === 'none' ? 'selected' : ''}>无需认证</option>
                            <option value="basic" ${connection.config?.authType === 'basic' ? 'selected' : ''}>Basic Auth</option>
                            <option value="bearer" ${connection.config?.authType === 'bearer' ? 'selected' : ''}>Bearer Token</option>
                            <option value="apikey" ${connection.config?.authType === 'apikey' ? 'selected' : ''}>API Key</option>
                        </select>
                    </div>
                    
                    <div class="form-group" id="authCredentials" style="display: ${connection.config?.authType && connection.config?.authType !== 'none' ? 'block' : 'none'};">
                        <label class="form-label">认证凭证</label>
                        <input type="text" id="authValue" class="form-control" 
                               value="${connection.config?.authValue || ''}"
                               placeholder="请输入认证凭证">
                        <small class="form-text">留空则保持原有凭证不变</small>
                    </div>
                </div>
                
                <!-- 文件接入配置 -->
                <div id="fileConfig" class="form-section" style="display: none;">
                    <h4 class="form-section-title">文件配置</h4>
                    
                    <div class="form-group">
                        <label class="form-label required">文件类型</label>
                        <select id="fileType" class="form-control">
                            <option value="excel" ${connection.config?.fileType === 'excel' ? 'selected' : ''}>Excel (xlsx/xls)</option>
                            <option value="csv" ${connection.config?.fileType === 'csv' ? 'selected' : ''}>CSV</option>
                            <option value="json" ${connection.config?.fileType === 'json' ? 'selected' : ''}>JSON</option>
                            <option value="xml" ${connection.config?.fileType === 'xml' ? 'selected' : ''}>XML</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">文件路径</label>
                        <input type="text" id="filePath" class="form-control" 
                               value="${connection.config?.filePath || ''}"
                               placeholder="/data/import/">
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">编码格式</label>
                        <select id="fileEncoding" class="form-control">
                            <option value="UTF-8" ${connection.config?.encoding === 'UTF-8' ? 'selected' : ''}>UTF-8</option>
                            <option value="GBK" ${connection.config?.encoding === 'GBK' ? 'selected' : ''}>GBK</option>
                            <option value="GB2312" ${connection.config?.encoding === 'GB2312' ? 'selected' : ''}>GB2312</option>
                        </select>
                    </div>
                </div>
                
                <!-- 系统接入配置 -->
                <div id="systemConfig" class="form-section" style="display: none;">
                    <h4 class="form-section-title">系统配置</h4>
                    
                    <div class="form-group">
                        <label class="form-label required">系统类型</label>
                        <select id="systemType" class="form-control">
                            <option value="database" ${connection.config?.systemType === 'database' ? 'selected' : ''}>数据库</option>
                            <option value="webservice" ${connection.config?.systemType === 'webservice' ? 'selected' : ''}>Web Service</option>
                            <option value="message" ${connection.config?.systemType === 'message' ? 'selected' : ''}>消息队列</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">连接地址</label>
                        <input type="text" id="systemUrl" class="form-control" 
                               value="${connection.config?.url || ''}"
                               placeholder="jdbc:mysql://localhost:3306/db">
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">用户名</label>
                        <input type="text" id="systemUsername" class="form-control"
                               value="${connection.config?.username || ''}">
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">密码</label>
                        <input type="password" id="systemPassword" class="form-control"
                               placeholder="留空则保持原密码不变">
                        <small class="form-text">留空则保持原密码不变</small>
                    </div>
                </div>
                
                <div class="form-section">
                    <h4 class="form-section-title">同步配置</h4>
                    
                    <div class="form-group">
                        <label class="form-label required">同步频率</label>
                        <select id="syncFrequency" class="form-control" required>
                            <option value="realtime" ${connection.syncFrequency === 'realtime' ? 'selected' : ''}>实时</option>
                            <option value="hourly" ${connection.syncFrequency === 'hourly' ? 'selected' : ''}>每小时</option>
                            <option value="daily" ${connection.syncFrequency === 'daily' ? 'selected' : ''}>每日</option>
                            <option value="weekly" ${connection.syncFrequency === 'weekly' ? 'selected' : ''}>每周</option>
                            <option value="monthly" ${connection.syncFrequency === 'monthly' ? 'selected' : ''}>每月</option>
                            <option value="manual" ${connection.syncFrequency === 'manual' ? 'selected' : ''}>手动</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">目标表</label>
                        <input type="text" id="targetTable" class="form-control" 
                               value="${connection.targetTable || ''}"
                               placeholder="请输入目标数据表名">
                    </div>
                </div>
            </form>
        `;
    }
    
    handleEdit() {
        const form = document.getElementById('editConnectionForm');
        if (!form.checkValidity()) {
            Toast.error('请填写必填项');
            return false;
        }
        
        const formData = {
            name: document.getElementById('connectionName').value,
            type: document.getElementById('connectionType').value,
            datasource: document.getElementById('datasourceName').value,
            description: document.getElementById('connectionDesc').value,
            frequency: this.getFrequencyLabel(document.getElementById('syncFrequency').value),
            syncFrequency: document.getElementById('syncFrequency').value,
            targetTable: document.getElementById('targetTable').value
        };
        
        // 根据类型收集特定配置
        if (formData.type === 'API') {
            formData.config = {
                url: document.getElementById('apiUrl').value,
                method: document.getElementById('apiMethod').value,
                authType: document.getElementById('authType').value,
                authValue: document.getElementById('authValue').value
            };
        } else if (formData.type === 'file') {
            formData.config = {
                fileType: document.getElementById('fileType').value,
                filePath: document.getElementById('filePath').value,
                encoding: document.getElementById('fileEncoding').value
            };
        } else if (formData.type === 'system') {
            formData.config = {
                systemType: document.getElementById('systemType').value,
                url: document.getElementById('systemUrl').value,
                username: document.getElementById('systemUsername').value,
                password: document.getElementById('systemPassword').value
            };
        }
        
        // 更新接入
        const result = externalDataService.updateConnection(this.currentEditId, formData);
        
        if (result.success) {
            Toast.success('接入更新成功');
            this.loadData();
            this.updateStatistics();
            return true;
        } else {
            Toast.error(result.message || '更新失败');
            return false;
        }
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
