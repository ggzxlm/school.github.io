/**
 * 主数据管理页面脚本
 */

class MasterDataPage {
    constructor() {
        this.currentTab = 'all';
        this.currentPage = 1;
        this.pageSize = 10;
        this.searchKeyword = '';
        this.selectedIds = new Set();
        this.editingId = null;
        this.currentDetailId = null;
    }

    /**
     * 初始化页面
     */
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
            
            // 初始化主数据服务
            await masterDataService.initialize();
            
            // 自动识别重复数据
            masterDataService.identifyAllDuplicates();
            
            // 绑定事件
            this.bindEvents();
            
            // 加载数据
            await this.loadData();
            
            Loading.hide();
        } catch (error) {
            console.error('初始化失败:', error);
            Loading.hide();
            Toast.error('初始化失败: ' + error.message);
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
        
        // 从详情页编辑
        const editFromDetailBtn = document.getElementById('editFromDetailBtn');
        if (editFromDetailBtn) {
            editFromDetailBtn.addEventListener('click', () => {
                if (this.currentDetailId) {
                    this.closeDetailModal();
                    this.editData(this.currentDetailId);
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
        
        // 实体类型变更
        const entityType = document.getElementById('entityType');
        if (entityType) {
            entityType.addEventListener('change', () => this.handleEntityTypeChange());
        }
        
        // 新增按钮
        const createBtn = document.getElementById('createBtn');
        if (createBtn) {
            createBtn.addEventListener('click', () => this.showCreateModal());
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

    /**
     * 加载数据
     */
    async loadData() {
        try {
            const statusFilter = document.getElementById('statusFilter');
            const filters = {
                entityType: this.currentTab === 'all' ? null : this.currentTab.toUpperCase(),
                search: this.searchKeyword,
                status: statusFilter ? statusFilter.value : null
            };

            const data = masterDataService.getMasterData(filters);
            
            // 更新统计
            this.updateCounts();
            
            // 渲染表格
            this.renderTable(data);
            
        } catch (error) {
            console.error('加载数据失败:', error);
            console.error(error);
        }
    }

    /**
     * 更新统计数据
     */
    updateCounts() {
        const allData = masterDataService.getMasterData({});
        const personData = masterDataService.getMasterData({ entityType: 'PERSON' });
        const supplierData = masterDataService.getMasterData({ entityType: 'SUPPLIER' });
        const organizationData = masterDataService.getMasterData({ entityType: 'ORGANIZATION' });

        const allCountEl = document.getElementById('allCount');
        const personCountEl = document.getElementById('personCount');
        const supplierCountEl = document.getElementById('supplierCount');
        const organizationCountEl = document.getElementById('organizationCount');

        if (allCountEl) allCountEl.textContent = allData.length;
        if (personCountEl) personCountEl.textContent = personData.length;
        if (supplierCountEl) supplierCountEl.textContent = supplierData.length;
        if (organizationCountEl) organizationCountEl.textContent = organizationData.length;
    }

    /**
     * 渲染表格
     */
    renderTable(data) {
        const tbody = document.getElementById('masterDataTableBody');
        
        if (!tbody) {
            console.error('找不到表格元素');
            return;
        }
        
        if (data.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="9" class="px-6 py-12">
                        <div class="empty-state">
                            <i class="fas fa-database"></i>
                            <p>暂无数据</p>
                        </div>
                    </td>
                </tr>
            `;
            this.updatePagination(0);
            return;
        }

        // 分页
        const start = (this.currentPage - 1) * this.pageSize;
        const end = start + this.pageSize;
        const pageData = data.slice(start, end);

        tbody.innerHTML = pageData.map(item => `
            <tr>
                <td class="px-6 py-4">
                    <input type="checkbox" ${this.selectedIds.has(item.id) ? 'checked' : ''} 
                           onchange="toggleSelect('${item.id}')">
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="text-sm text-gray-600">${item.id}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    ${this.getEntityTypeBadge(item.entityType)}
                </td>
                <td class="px-6 py-4">
                    <span class="text-sm font-medium text-gray-900">${item.name || '-'}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="text-sm text-gray-600">${this.getKeyIdentifier(item)}</span>
                </td>
                <td class="px-6 py-4">
                    <div class="flex gap-1">
                        ${item.sources.map(s => `<span class="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">${s}</span>`).join('')}
                    </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="text-sm text-gray-600">v${item.version}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="text-sm text-gray-600">${Utils.formatDate(item.updatedAt, 'YYYY-MM-DD HH:mm')}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                    <button class="action-btn action-btn-primary mr-2" onclick="viewDetail('${item.id}')">
                        <i class="fas fa-eye mr-1"></i>查看
                    </button>
                    <button class="action-btn action-btn-info mr-2" onclick="viewHistory('${item.id}')">
                        <i class="fas fa-history mr-1"></i>历史
                    </button>
                    <button class="action-btn action-btn-secondary mr-2" onclick="editData('${item.id}')">
                        <i class="fas fa-edit mr-1"></i>编辑
                    </button>
                    <button class="action-btn action-btn-danger" onclick="deleteData('${item.id}')">
                        <i class="fas fa-trash mr-1"></i>删除
                    </button>
                </td>
            </tr>
        `).join('');

        // 更新分页
        this.updatePagination(data.length);
    }

    /**
     * 获取实体类型徽章
     */
    getEntityTypeBadge(type) {
        const typeMap = {
            'PERSON': { label: '人员', class: 'status-completed' },
            'SUPPLIER': { label: '供应商', class: 'status-in-progress' },
            'ORGANIZATION': { label: '组织', class: 'status-pending' },
            'PROCUREMENT_PROJECT': { label: '采购项目', class: 'status-review' }
        };
        const config = typeMap[type] || { label: type, class: 'status-pending' };
        return `<span class="status-badge ${config.class}">${config.label}</span>`;
    }

    /**
     * 获取关键标识
     */
    getKeyIdentifier(item) {
        if (item.entityType === 'PERSON') {
            return item.idCard || '-';
        } else if (item.entityType === 'SUPPLIER') {
            return item.creditCode || '-';
        } else if (item.entityType === 'ORGANIZATION') {
            return item.code || '-';
        } else if (item.entityType === 'PROCUREMENT_PROJECT') {
            return item.projectCode || '-';
        }
        return '-';
    }

    /**
     * 更新分页
     */
    updatePagination(total) {
        const totalPages = Math.ceil(total / this.pageSize);
        const start = (this.currentPage - 1) * this.pageSize + 1;
        const end = Math.min(this.currentPage * this.pageSize, total);
        
        const pageStartEl = document.getElementById('pageStart');
        const pageEndEl = document.getElementById('pageEnd');
        const totalCountEl = document.getElementById('totalCount');
        
        if (pageStartEl) pageStartEl.textContent = total > 0 ? start : 0;
        if (pageEndEl) pageEndEl.textContent = end;
        if (totalCountEl) totalCountEl.textContent = total;
        
        // 更新页码按钮
        const pageNumbers = document.getElementById('pageNumbers');
        if (pageNumbers) {
            pageNumbers.innerHTML = '';
            for (let i = 1; i <= totalPages; i++) {
                if (i === 1 || i === totalPages || (i >= this.currentPage - 1 && i <= this.currentPage + 1)) {
                    const btn = document.createElement('button');
                    btn.className = `page-btn ${i === this.currentPage ? 'active' : ''}`;
                    btn.textContent = i;
                    btn.onclick = () => this.goToPage(i);
                    pageNumbers.appendChild(btn);
                } else if (i === this.currentPage - 2 || i === this.currentPage + 2) {
                    const span = document.createElement('span');
                    span.className = 'px-2 text-gray-400';
                    span.textContent = '...';
                    pageNumbers.appendChild(span);
                }
            }
        }
        
        const prevBtn = document.getElementById('prevPage');
        const nextBtn = document.getElementById('nextPage');
        if (prevBtn) prevBtn.disabled = this.currentPage === 1;
        if (nextBtn) nextBtn.disabled = this.currentPage === totalPages || totalPages === 0;
    }
    
    /**
     * 跳转到指定页
     */
    goToPage(page) {
        this.currentPage = page;
        this.loadData();
    }

    /**
     * 切换标签页
     */
    async switchTab(tab) {
        this.currentTab = tab;
        this.currentPage = 1;
        
        // 更新标签页样式
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tab);
        });
        
        await this.loadData();
    }

    /**
     * 搜索处理
     */
    handleSearch() {
        const input = document.getElementById('searchInput');
        this.searchKeyword = input.value.trim();
        this.currentPage = 1;
        this.loadData();
    }

    /**
     * 切换选择
     */
    toggleSelect(id) {
        if (this.selectedIds.has(id)) {
            this.selectedIds.delete(id);
        } else {
            this.selectedIds.add(id);
        }
    }

    /**
     * 全选/取消全选
     */
    toggleSelectAll() {
        const checkbox = document.getElementById('selectAll');
        const checkboxes = document.querySelectorAll('#masterDataTableBody input[type="checkbox"]');
        
        checkboxes.forEach(cb => {
            cb.checked = checkbox.checked;
            const id = cb.onchange.toString().match(/'([^']+)'/)[1];
            if (checkbox.checked) {
                this.selectedIds.add(id);
            } else {
                this.selectedIds.delete(id);
            }
        });
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
        this.currentPage++;
        this.loadData();
    }

    /**
     * 查看详情
     */
    viewDetail(id) {
        const data = masterDataService.getMasterDataById(id);
        if (!data) return;

        const modal = document.getElementById('detailModal');
        const body = document.getElementById('detailModalBody');

        let fieldsHtml = '';
        if (data.entityType === 'PERSON') {
            fieldsHtml = `
                <div class="detail-grid">
                    <div class="detail-item">
                        <span class="detail-label">姓名</span>
                        <span class="detail-value">${data.name || '-'}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">身份证号</span>
                        <span class="detail-value">${data.idCard || '-'}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">手机号</span>
                        <span class="detail-value">${data.phone || '-'}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">邮箱</span>
                        <span class="detail-value">${data.email || '-'}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">部门</span>
                        <span class="detail-value">${data.department || '-'}</span>
                    </div>
                </div>
            `;
        } else if (data.entityType === 'SUPPLIER') {
            fieldsHtml = `
                <div class="detail-grid">
                    <div class="detail-item">
                        <span class="detail-label">名称</span>
                        <span class="detail-value">${data.name || '-'}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">统一社会信用代码</span>
                        <span class="detail-value">${data.creditCode || '-'}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">法人</span>
                        <span class="detail-value">${data.legalPerson || '-'}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">电话</span>
                        <span class="detail-value">${data.phone || '-'}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">地址</span>
                        <span class="detail-value">${data.address || '-'}</span>
                    </div>
                </div>
            `;
        } else if (data.entityType === 'ORGANIZATION') {
            fieldsHtml = `
                <div class="detail-grid">
                    <div class="detail-item">
                        <span class="detail-label">名称</span>
                        <span class="detail-value">${data.name || '-'}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">编码</span>
                        <span class="detail-value">${data.code || '-'}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">层级</span>
                        <span class="detail-value">${data.level || '-'}</span>
                    </div>
                </div>
            `;
        } else if (data.entityType === 'PROCUREMENT_PROJECT') {
            fieldsHtml = `
                <div class="detail-grid">
                    <div class="detail-item">
                        <span class="detail-label">项目编号</span>
                        <span class="detail-value">${data.projectCode || '-'}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">项目名称</span>
                        <span class="detail-value">${data.projectName || '-'}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">采购类型</span>
                        <span class="detail-value">${data.projectType || '-'}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">预算金额</span>
                        <span class="detail-value">${data.budget ? '¥' + data.budget.toLocaleString() : '-'}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">申请部门</span>
                        <span class="detail-value">${data.department || '-'}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">申请人</span>
                        <span class="detail-value">${data.applicant || '-'}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">计划开始日期</span>
                        <span class="detail-value">${data.startDate || '-'}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">计划结束日期</span>
                        <span class="detail-value">${data.endDate || '-'}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">项目状态</span>
                        <span class="detail-value">${data.status || '-'}</span>
                    </div>
                </div>
            `;
        }

        body.innerHTML = `
            <div class="detail-section">
                <div class="detail-section-title">基本信息</div>
                ${fieldsHtml}
            </div>
            <div class="detail-section">
                <div class="detail-section-title">系统信息</div>
                <div class="detail-grid">
                    <div class="detail-item">
                        <span class="detail-label">ID</span>
                        <span class="detail-value">${data.id}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">版本</span>
                        <span class="detail-value">v${data.version}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">创建时间</span>
                        <span class="detail-value">${Utils.formatDate(data.createdAt)}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">更新时间</span>
                        <span class="detail-value">${Utils.formatDate(data.updatedAt)}</span>
                    </div>
                </div>
            </div>
            <div class="detail-section">
                <div class="detail-section-title">来源系统</div>
                <div class="source-tags">
                    ${data.sources.map(s => `<span class="source-tag">${s}</span>`).join('')}
                </div>
            </div>
        `;

        modal.style.display = 'flex';
        setTimeout(() => {
            modal.classList.add('modal-show');
        }, 10);
    }

    /**
     * 查看详情（新实现 - 按数据源管理方式）
     */
    viewDetail(id) {
        const data = masterDataService.getMasterDataById(id);
        if (!data) {
            Toast.error('数据不存在');
            return;
        }
        
        this.currentDetailId = id;
        
        // 填充基本信息
        document.getElementById('detailId').textContent = data.id;
        document.getElementById('detailEntityType').innerHTML = this.getEntityTypeBadge(data.entityType);
        document.getElementById('detailName').textContent = data.name || '-';
        document.getElementById('detailVersion').textContent = 'v' + data.version;
        document.getElementById('detailCreateTime').textContent = Utils.formatDate(data.createdAt);
        document.getElementById('detailUpdateTime').textContent = Utils.formatDate(data.updatedAt);
        
        // 填充实体详细信息
        const entityInfo = document.getElementById('detailEntityInfo');
        entityInfo.innerHTML = this.renderEntityInfo(data);
        
        // 填充数据来源
        const sources = document.getElementById('detailSources');
        if (data.sources && data.sources.length > 0) {
            sources.innerHTML = data.sources.map(source => `
                <div class="source-item">
                    <i class="fas fa-server"></i>
                    <span>${source}</span>
                </div>
            `).join('');
        } else {
            sources.innerHTML = '<p style="color: #6B7280; font-size: 13px;">暂无来源信息</p>';
        }
        
        // 填充变更历史（模拟数据）
        const history = document.getElementById('detailHistory');
        const mockHistory = this.generateMockHistory(data);
        if (mockHistory.length > 0) {
            history.innerHTML = mockHistory.map(item => `
                <div class="history-item">
                    <div class="history-header">
                        <span class="history-time">
                            <i class="fas fa-clock"></i> ${item.time}
                        </span>
                        <span class="badge badge-info">${item.action}</span>
                    </div>
                    <div class="history-details">
                        <span><i class="fas fa-user"></i> ${item.operator}</span>
                        <span><i class="fas fa-info-circle"></i> ${item.description}</span>
                    </div>
                </div>
            `).join('');
        } else {
            history.innerHTML = '<p style="color: #6B7280; font-size: 13px;">暂无变更历史</p>';
        }
        
        // 显示模态框
        const modal = document.getElementById('detailModal');
        modal.style.display = 'flex';
        setTimeout(() => {
            modal.classList.add('modal-show');
        }, 10);
    }
    
    /**
     * 渲染实体详细信息
     */
    renderEntityInfo(data) {
        if (data.entityType === 'PERSON') {
            return `
                <div class="detail-item">
                    <label>身份证号</label>
                    <div><code>${data.idCard || '-'}</code></div>
                </div>
                <div class="detail-item">
                    <label>手机号</label>
                    <div>${data.phone || '-'}</div>
                </div>
                <div class="detail-item">
                    <label>邮箱</label>
                    <div>${data.email || '-'}</div>
                </div>
                <div class="detail-item">
                    <label>部门</label>
                    <div>${data.department || '-'}</div>
                </div>
                <div class="detail-item">
                    <label>职位</label>
                    <div>${data.position || '-'}</div>
                </div>
            `;
        } else if (data.entityType === 'SUPPLIER') {
            return `
                <div class="detail-item">
                    <label>统一社会信用代码</label>
                    <div><code>${data.creditCode || '-'}</code></div>
                </div>
                <div class="detail-item">
                    <label>法定代表人</label>
                    <div>${data.legalPerson || '-'}</div>
                </div>
                <div class="detail-item">
                    <label>联系电话</label>
                    <div>${data.phone || '-'}</div>
                </div>
                <div class="detail-item">
                    <label>注册地址</label>
                    <div>${data.address || '-'}</div>
                </div>
                <div class="detail-item">
                    <label>注册资本</label>
                    <div>${data.capital ? data.capital + '万元' : '-'}</div>
                </div>
                <div class="detail-item">
                    <label>成立日期</label>
                    <div>${data.establishDate || '-'}</div>
                </div>
            `;
        } else if (data.entityType === 'ORGANIZATION') {
            return `
                <div class="detail-item">
                    <label>组织代码</label>
                    <div><code>${data.code || '-'}</code></div>
                </div>
                <div class="detail-item">
                    <label>上级组织</label>
                    <div>${data.parent || '-'}</div>
                </div>
                <div class="detail-item">
                    <label>组织类型</label>
                    <div>${data.type || '-'}</div>
                </div>
                <div class="detail-item">
                    <label>负责人</label>
                    <div>${data.leader || '-'}</div>
                </div>
                <div class="detail-item">
                    <label>联系电话</label>
                    <div>${data.phone || '-'}</div>
                </div>
            `;
        } else if (data.entityType === 'PROCUREMENT_PROJECT') {
            return `
                <div class="detail-item">
                    <label>项目编号</label>
                    <div><code>${data.projectCode || '-'}</code></div>
                </div>
                <div class="detail-item">
                    <label>项目金额</label>
                    <div>${data.amount ? data.amount + '万元' : '-'}</div>
                </div>
                <div class="detail-item">
                    <label>采购方式</label>
                    <div>${data.method || '-'}</div>
                </div>
                <div class="detail-item">
                    <label>项目负责人</label>
                    <div>${data.leader || '-'}</div>
                </div>
                <div class="detail-item">
                    <label>项目状态</label>
                    <div>${data.status || '-'}</div>
                </div>
            `;
        }
        return '<p style="color: #6B7280;">暂无详细信息</p>';
    }
    
    /**
     * 生成模拟变更历史
     */
    generateMockHistory(data) {
        return [
            {
                time: Utils.formatDate(data.updatedAt),
                action: '更新',
                operator: '系统管理员',
                description: '更新主数据信息'
            },
            {
                time: Utils.formatDate(data.createdAt),
                action: '创建',
                operator: '系统管理员',
                description: '创建主数据记录'
            }
        ];
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
        console.log('[主数据管理] 打开创建模态框');
        this.editingId = null;
        
        const modal = document.getElementById('createModal');
        if (!modal) {
            console.error('[主数据管理] 找不到模态框元素 #createModal');
            Toast.error('模态框初始化失败');
            return;
        }
        
        const modalTitle = document.getElementById('createModalTitle');
        if (modalTitle) {
            modalTitle.innerHTML = '<i class="fas fa-plus-circle"></i>新增主数据';
        }
        
        const form = document.getElementById('masterDataForm');
        if (form) {
            form.reset();
        }
        
        // 隐藏所有实体字段
        document.querySelectorAll('.entity-fields').forEach(el => {
            el.style.display = 'none';
        });
        
        // 显示模态框
        modal.style.display = 'flex';
        setTimeout(() => {
            modal.classList.add('modal-show');
        }, 10);
        
        console.log('[主数据管理] 模态框已显示');
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
     * 处理实体类型变更
     */
    handleEntityTypeChange() {
        const entityType = document.getElementById('entityType').value;
        
        // 隐藏所有实体字段
        document.querySelectorAll('.entity-fields').forEach(el => {
            el.style.display = 'none';
        });
        
        // 显示对应的实体字段
        if (entityType === 'PERSON') {
            document.getElementById('personFields').style.display = 'block';
        } else if (entityType === 'SUPPLIER') {
            document.getElementById('supplierFields').style.display = 'block';
        } else if (entityType === 'ORGANIZATION') {
            document.getElementById('organizationFields').style.display = 'block';
        } else if (entityType === 'PROCUREMENT_PROJECT') {
            document.getElementById('projectFields').style.display = 'block';
        }
    }
    
    /**
     * 提交表单
     */
    submitForm() {
        const entityType = document.getElementById('entityType').value;
        if (!entityType) {
            Toast.error('请选择实体类型');
            return;
        }
        
        let formData = {
            entityType: entityType,
            sources: []
        };
        
        // 添加来源系统
        const sourceSystem = document.getElementById('sourceSystem').value;
        if (sourceSystem) {
            formData.sources.push(sourceSystem);
        }
        
        // 根据实体类型收集数据
        if (entityType === 'PERSON') {
            const name = document.getElementById('personName').value;
            const idCard = document.getElementById('personIdCard').value;
            
            if (!name || !idCard) {
                Toast.error('请填写必填项');
                return;
            }
            
            formData.name = name;
            formData.idCard = idCard;
            formData.phone = document.getElementById('personPhone').value;
            formData.email = document.getElementById('personEmail').value;
            formData.department = document.getElementById('personDepartment').value;
            formData.position = document.getElementById('personPosition').value;
            
        } else if (entityType === 'SUPPLIER') {
            const name = document.getElementById('supplierName').value;
            const creditCode = document.getElementById('supplierCreditCode').value;
            
            if (!name || !creditCode) {
                Toast.error('请填写必填项');
                return;
            }
            
            formData.name = name;
            formData.creditCode = creditCode;
            formData.legalPerson = document.getElementById('supplierLegalPerson').value;
            formData.phone = document.getElementById('supplierPhone').value;
            formData.address = document.getElementById('supplierAddress').value;
            formData.capital = document.getElementById('supplierCapital').value;
            formData.establishDate = document.getElementById('supplierEstablishDate').value;
            
        } else if (entityType === 'ORGANIZATION') {
            const name = document.getElementById('orgName').value;
            const code = document.getElementById('orgCode').value;
            
            if (!name || !code) {
                Toast.error('请填写必填项');
                return;
            }
            
            formData.name = name;
            formData.code = code;
            formData.parent = document.getElementById('orgParent').value;
            formData.type = document.getElementById('orgType').value;
            formData.leader = document.getElementById('orgLeader').value;
            formData.phone = document.getElementById('orgPhone').value;
            
        } else if (entityType === 'PROCUREMENT_PROJECT') {
            const name = document.getElementById('projectName').value;
            const projectCode = document.getElementById('projectCode').value;
            
            if (!name || !projectCode) {
                Toast.error('请填写必填项');
                return;
            }
            
            formData.name = name;
            formData.projectCode = projectCode;
            formData.amount = document.getElementById('projectAmount').value;
            formData.method = document.getElementById('projectMethod').value;
            formData.leader = document.getElementById('projectLeader').value;
            formData.status = document.getElementById('projectStatus').value;
        }
        
        try {
            Loading.show('保存中...');
            
            if (this.editingId) {
                // 编辑模式
                masterDataService.updateMasterData(this.editingId, formData);
                Toast.success('更新成功');
            } else {
                // 创建模式
                masterDataService.createMasterData(formData);
                Toast.success('创建成功');
            }
            
            Loading.hide();
            this.closeCreateModal();
            this.loadData();
            
        } catch (error) {
            Loading.hide();
            Toast.error('保存失败: ' + error.message);
        }
    }

    /**
     * 编辑数据
     */
    editData(id) {
        const data = masterDataService.getMasterDataById(id);
        if (!data) return;

        this.editingId = id;
        
        const modalTitle = document.getElementById('createModalTitle');
        if (modalTitle) {
            modalTitle.innerHTML = '<i class="fas fa-edit"></i>编辑主数据';
        }
        
        document.getElementById('entityType').value = data.entityType;
        this.handleEntityTypeChange();

        // 填充表单
        setTimeout(() => {
            if (data.entityType === 'PERSON') {
                document.getElementById('name').value = data.name || '';
                document.getElementById('idCard').value = data.idCard || '';
                document.getElementById('phone').value = data.phone || '';
                document.getElementById('email').value = data.email || '';
                document.getElementById('department').value = data.department || '';
            } else if (data.entityType === 'SUPPLIER') {
                document.getElementById('name').value = data.name || '';
                document.getElementById('creditCode').value = data.creditCode || '';
                document.getElementById('legalPerson').value = data.legalPerson || '';
                document.getElementById('phone').value = data.phone || '';
                document.getElementById('address').value = data.address || '';
            } else if (data.entityType === 'ORGANIZATION') {
                document.getElementById('name').value = data.name || '';
                document.getElementById('code').value = data.code || '';
                document.getElementById('level').value = data.level || '';
            } else if (data.entityType === 'PROCUREMENT_PROJECT') {
                document.getElementById('projectCode').value = data.projectCode || '';
                document.getElementById('projectName').value = data.projectName || '';
                document.getElementById('projectType').value = data.projectType || '';
                document.getElementById('budget').value = data.budget || '';
                document.getElementById('department').value = data.department || '';
                document.getElementById('applicant').value = data.applicant || '';
                document.getElementById('startDate').value = data.startDate || '';
                document.getElementById('endDate').value = data.endDate || '';
                document.getElementById('status').value = data.status || '';
            }
        }, 100);

        const modal = document.getElementById('createModal');
        modal.style.display = 'flex';
        setTimeout(() => {
            modal.classList.add('modal-show');
        }, 10);
    }

    /**
     * 处理实体类型变更
     */
    handleEntityTypeChange() {
        const entityType = document.getElementById('entityType').value;
        const dynamicFields = document.getElementById('dynamicFields');

        if (!entityType) {
            dynamicFields.innerHTML = '';
            return;
        }

        let fieldsHtml = '';
        if (entityType === 'PERSON') {
            fieldsHtml = `
                <div class="form-group">
                    <label>姓名 <span class="required">*</span></label>
                    <input type="text" id="name" class="form-control" required>
                </div>
                <div class="form-group">
                    <label>身份证号 <span class="required">*</span></label>
                    <input type="text" id="idCard" class="form-control" required>
                </div>
                <div class="form-group">
                    <label>手机号</label>
                    <input type="text" id="phone" class="form-control">
                </div>
                <div class="form-group">
                    <label>邮箱</label>
                    <input type="email" id="email" class="form-control">
                </div>
                <div class="form-group">
                    <label>部门</label>
                    <input type="text" id="department" class="form-control">
                </div>
            `;
        } else if (entityType === 'SUPPLIER') {
            fieldsHtml = `
                <div class="form-group">
                    <label>名称 <span class="required">*</span></label>
                    <input type="text" id="name" class="form-control" required>
                </div>
                <div class="form-group">
                    <label>统一社会信用代码 <span class="required">*</span></label>
                    <input type="text" id="creditCode" class="form-control" required>
                </div>
                <div class="form-group">
                    <label>法人</label>
                    <input type="text" id="legalPerson" class="form-control">
                </div>
                <div class="form-group">
                    <label>电话</label>
                    <input type="text" id="phone" class="form-control">
                </div>
                <div class="form-group">
                    <label>地址</label>
                    <input type="text" id="address" class="form-control">
                </div>
            `;
        } else if (entityType === 'ORGANIZATION') {
            fieldsHtml = `
                <div class="form-group">
                    <label>名称 <span class="required">*</span></label>
                    <input type="text" id="name" class="form-control" required>
                </div>
                <div class="form-group">
                    <label>编码 <span class="required">*</span></label>
                    <input type="text" id="code" class="form-control" required>
                </div>
                <div class="form-group">
                    <label>层级</label>
                    <input type="number" id="level" class="form-control" min="1">
                </div>
            `;
        } else if (entityType === 'PROCUREMENT_PROJECT') {
            fieldsHtml = `
                <div class="form-group">
                    <label>项目编号 <span class="required">*</span></label>
                    <input type="text" id="projectCode" class="form-control" required>
                </div>
                <div class="form-group">
                    <label>项目名称 <span class="required">*</span></label>
                    <input type="text" id="projectName" class="form-control" required>
                </div>
                <div class="form-group">
                    <label>采购类型 <span class="required">*</span></label>
                    <select id="projectType" class="form-control" required>
                        <option value="">请选择</option>
                        <option value="货物采购">货物采购</option>
                        <option value="工程项目">工程项目</option>
                        <option value="服务采购">服务采购</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>预算金额 <span class="required">*</span></label>
                    <input type="number" id="budget" class="form-control" min="0" step="0.01" required>
                </div>
                <div class="form-group">
                    <label>申请部门 <span class="required">*</span></label>
                    <input type="text" id="department" class="form-control" required>
                </div>
                <div class="form-group">
                    <label>申请人 <span class="required">*</span></label>
                    <input type="text" id="applicant" class="form-control" required>
                </div>
                <div class="form-group">
                    <label>计划开始日期</label>
                    <input type="date" id="startDate" class="form-control">
                </div>
                <div class="form-group">
                    <label>计划结束日期</label>
                    <input type="date" id="endDate" class="form-control">
                </div>
                <div class="form-group">
                    <label>项目状态</label>
                    <select id="status" class="form-control">
                        <option value="计划中">计划中</option>
                        <option value="进行中">进行中</option>
                        <option value="已完成">已完成</option>
                        <option value="已取消">已取消</option>
                    </select>
                </div>
            `;
        }

        dynamicFields.innerHTML = fieldsHtml;
    }

    /**
     * 提交表单
     */
    async submitForm() {
        const form = document.getElementById('masterDataForm');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const entityType = document.getElementById('entityType').value;
        let formData = { entityType, sources: ['手动录入'] };

        if (entityType === 'PERSON') {
            formData.name = document.getElementById('name').value;
            formData.idCard = document.getElementById('idCard').value;
            formData.phone = document.getElementById('phone').value;
            formData.email = document.getElementById('email').value;
            formData.department = document.getElementById('department').value;
        } else if (entityType === 'SUPPLIER') {
            formData.name = document.getElementById('name').value;
            formData.creditCode = document.getElementById('creditCode').value;
            formData.legalPerson = document.getElementById('legalPerson').value;
            formData.phone = document.getElementById('phone').value;
            formData.address = document.getElementById('address').value;
        } else if (entityType === 'ORGANIZATION') {
            formData.name = document.getElementById('name').value;
            formData.code = document.getElementById('code').value;
            formData.level = parseInt(document.getElementById('level').value) || 1;
        } else if (entityType === 'PROCUREMENT_PROJECT') {
            formData.projectCode = document.getElementById('projectCode').value;
            formData.projectName = document.getElementById('projectName').value;
            formData.projectType = document.getElementById('projectType').value;
            formData.budget = parseFloat(document.getElementById('budget').value) || 0;
            formData.department = document.getElementById('department').value;
            formData.applicant = document.getElementById('applicant').value;
            formData.startDate = document.getElementById('startDate').value;
            formData.endDate = document.getElementById('endDate').value;
            formData.status = document.getElementById('status').value || '计划中';
        }

        try {
            Loading.show('保存中...');

            if (this.editingId) {
                // 更新
                await masterDataService.updateMasterData(this.editingId, formData);
                Toast.success('更新成功');
            } else {
                // 创建
                const result = await masterDataService.createMasterData(formData);
                if (result.success) {
                    Toast.success('创建成功');
                } else {
                    // 发现重复数据
                    Loading.hide();
                    this.closeCreateModal();
                    this.showDuplicateConfirm(formData, result.duplicates);
                    return;
                }
            }

            Loading.hide();
            this.closeCreateModal();
            await this.loadData();
        } catch (error) {
            Loading.hide();
            Toast.error('保存失败: ' + error.message);
        }
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
    }

    /**
     * 显示重复数据确认
     */
    showDuplicateConfirm(newData, duplicates) {
        Modal.confirm({
            title: '发现可能重复的数据',
            content: `
                <p>系统检测到 ${duplicates.length} 条可能重复的数据，相似度最高为 ${(duplicates[0].similarity * 100).toFixed(0)}%</p>
                <p>是否继续创建？</p>
            `,
            onConfirm: async () => {
                try {
                    Loading.show('创建中...');
                    newData.id = newData.entityType.charAt(0) + Utils.generateId().toUpperCase();
                    newData.createdAt = new Date().toISOString();
                    newData.updatedAt = new Date().toISOString();
                    newData.version = 1;
                    masterDataService.masterData.push(newData);
                    Loading.hide();
                    Toast.success('创建成功');
                    await this.loadData();
                } catch (error) {
                    Loading.hide();
                    Toast.error('创建失败: ' + error.message);
                }
            }
        });
    }

    /**
     * 删除数据
     */
    async deleteData(id) {
        Modal.confirm({
            title: '确认删除',
            content: '确定要删除这条主数据吗？此操作不可恢复。',
            onConfirm: async () => {
                try {
                    Loading.show('删除中...');
                    await masterDataService.deleteMasterData(id);
                    Loading.hide();
                    Toast.success('删除成功');
                    await this.loadData();
                } catch (error) {
                    Loading.hide();
                    Toast.error('删除失败: ' + error.message);
                }
            }
        });
    }

    /**
     * 查看历史
     */
    viewHistory(id) {
        const history = masterDataService.getChangeHistory(id);
        const data = masterDataService.getMasterDataById(id);

        Modal.alert({
            title: `变更历史 - ${data.name}`,
            content: history.length > 0 ? `
                <div class="history-timeline">
                    ${history.map(h => `
                        <div class="history-item">
                            <div class="history-header">
                                <span class="history-type ${h.changeType.toLowerCase()}">${this.getChangeTypeLabel(h.changeType)}</span>
                                <span class="history-time">${Utils.formatDate(h.changeTime)}</span>
                            </div>
                            <div class="history-description">${h.description}</div>
                            <div class="history-user">操作人: ${h.changeBy}</div>
                        </div>
                    `).join('')}
                </div>
            ` : '<p style="text-align: center; color: #9CA3AF;">暂无变更历史</p>'
        });
    }

    /**
     * 获取变更类型标签
     */
    getChangeTypeLabel(type) {
        const typeMap = {
            'CREATE': '创建',
            'UPDATE': '更新',
            'MERGE': '合并',
            'DELETE': '删除'
        };
        return typeMap[type] || type;
    }

    /**
     * 显示重复数据
     */
    showDuplicates() {
        const groups = masterDataService.getDuplicateGroups({ status: 'PENDING' });
        const modal = document.getElementById('duplicatesModal');
        const content = document.getElementById('duplicatesContent');

        if (groups.length === 0) {
            content.innerHTML = '<p style="text-align: center; color: #9CA3AF; padding: 40px;">暂无重复数据</p>';
        } else {
            content.innerHTML = groups.map(group => this.renderDuplicateGroup(group)).join('');
        }

        modal.style.display = 'flex';
        setTimeout(() => {
            modal.classList.add('modal-show');
        }, 10);
    }

    /**
     * 渲染重复数据组
     */
    renderDuplicateGroup(group) {
        const similarity = group.duplicates[0].similarity;
        const similarityClass = similarity >= 0.9 ? 'high' : 'medium';

        return `
            <div class="duplicate-group">
                <div class="duplicate-group-header">
                    <div class="duplicate-group-title">
                        ${this.getEntityTypeBadge(group.entityType)} - ${group.master.name}
                    </div>
                    <span class="similarity-badge ${similarityClass}">
                        相似度 ${(similarity * 100).toFixed(0)}%
                    </span>
                </div>
                <div class="duplicate-items">
                    <div class="duplicate-item master">
                        <div class="duplicate-item-header">
                            <span class="duplicate-item-label">主数据</span>
                        </div>
                        ${this.renderDuplicateItemFields(group.master)}
                    </div>
                    ${group.duplicates.map(d => `
                        <div class="duplicate-item">
                            <div class="duplicate-item-header">
                                <span class="duplicate-item-label">重复数据</span>
                            </div>
                            <div class="match-fields">
                                ${d.matchFields.map(f => `<span class="match-field">${f}</span>`).join('')}
                            </div>
                            ${this.renderDuplicateItemFields(d.entity)}
                        </div>
                    `).join('')}
                </div>
                <div class="duplicate-actions">
                    <button class="btn btn-primary btn-sm" onclick="masterDataPage.mergeDuplicates('${group.id}')">
                        合并数据
                    </button>
                    <button class="btn btn-secondary btn-sm" onclick="masterDataPage.ignoreDuplicate('${group.id}')">
                        忽略
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * 渲染重复数据项字段
     */
    renderDuplicateItemFields(item) {
        let fields = [];
        if (item.entityType === 'PERSON') {
            fields = [
                { label: '姓名', value: item.name },
                { label: '身份证号', value: item.idCard },
                { label: '手机号', value: item.phone },
                { label: '邮箱', value: item.email }
            ];
        } else if (item.entityType === 'SUPPLIER') {
            fields = [
                { label: '名称', value: item.name },
                { label: '信用代码', value: item.creditCode },
                { label: '法人', value: item.legalPerson },
                { label: '电话', value: item.phone }
            ];
        } else if (item.entityType === 'ORGANIZATION') {
            fields = [
                { label: '名称', value: item.name },
                { label: '编码', value: item.code },
                { label: '层级', value: item.level }
            ];
        } else if (item.entityType === 'PROCUREMENT_PROJECT') {
            fields = [
                { label: '项目编号', value: item.projectCode },
                { label: '项目名称', value: item.projectName },
                { label: '采购类型', value: item.projectType },
                { label: '预算金额', value: item.budget ? '¥' + item.budget.toLocaleString() : '-' }
            ];
        }

        return `
            <div class="duplicate-item-fields">
                ${fields.map(f => `
                    <div class="duplicate-field">
                        <span class="duplicate-field-label">${f.label}:</span>
                        <span class="duplicate-field-value">${f.value || '-'}</span>
                    </div>
                `).join('')}
            </div>
        `;
    }

    /**
     * 合并重复数据
     */
    async mergeDuplicates(groupId) {
        const group = masterDataService.duplicateGroups.find(g => g.id === groupId);
        if (!group) return;

        // 显示合并确认
        const sourceIds = group.duplicates.map(d => d.entity.id);
        const targetId = group.master.id;

        Modal.confirm({
            title: '确认合并',
            content: `
                <p>将合并 ${sourceIds.length + 1} 条数据为一条主数据</p>
                <div class="merge-preview">
                    <div class="merge-preview-title">合并后的数据预览</div>
                    <div class="merge-preview-grid">
                        <div class="merge-preview-item">
                            <span class="merge-preview-label">名称</span>
                            <span class="merge-preview-value">${group.master.name}</span>
                        </div>
                        <div class="merge-preview-item">
                            <span class="merge-preview-label">来源系统</span>
                            <span class="merge-preview-value">${[...new Set([...group.master.sources, ...group.duplicates.flatMap(d => d.entity.sources)])].join(', ')}</span>
                        </div>
                    </div>
                </div>
            `,
            onConfirm: async () => {
                try {
                    Loading.show('合并中...');
                    await masterDataService.mergeMasterData(sourceIds, targetId, group.master);
                    Loading.hide();
                    Toast.success('合并成功');
                    this.closeDuplicatesModal();
                    await this.loadData();
                } catch (error) {
                    Loading.hide();
                    Toast.error('合并失败: ' + error.message);
                }
            }
        });
    }

    /**
     * 忽略重复数据
     */
    ignoreDuplicate(groupId) {
        Modal.confirm({
            title: '确认忽略',
            content: '确定要忽略这组重复数据吗？',
            onConfirm: () => {
                masterDataService.ignoreDuplicateGroup(groupId);
                Toast.success('已忽略');
                this.showDuplicates();
            }
        });
    }

    /**
     * 关闭重复数据模态框
     */
    closeDuplicatesModal() {
        const modal = document.getElementById('duplicatesModal');
        if (modal) {
            modal.classList.remove('modal-show');
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300);
        }
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
    async refreshData() {
        Loading.show('刷新中...');
        await this.loadData();
        Loading.hide();
        Toast.success('刷新成功');
    }
}

// 创建页面实例
const masterDataPage = new MasterDataPage();

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    masterDataPage.init();
    bindEvents();
});

/**
 * 绑定事件
 */
function bindEvents() {
    console.log('[主数据管理] 开始绑定事件');
    
    // 搜索
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', () => masterDataPage.handleSearch());
        console.log('[主数据管理] 搜索框事件已绑定');
    }
    
    // 类型筛选
    const typeFilter = document.getElementById('typeFilter');
    if (typeFilter) {
        typeFilter.addEventListener('change', (e) => {
            masterDataPage.currentTab = e.target.value || 'all';
            masterDataPage.currentPage = 1;
            masterDataPage.loadData();
        });
        console.log('[主数据管理] 类型筛选事件已绑定');
    }
    
    // 状态筛选
    const statusFilter = document.getElementById('statusFilter');
    if (statusFilter) {
        statusFilter.addEventListener('change', () => {
            masterDataPage.currentPage = 1;
            masterDataPage.loadData();
        });
        console.log('[主数据管理] 状态筛选事件已绑定');
    }
    
    // 重置按钮
    const resetBtn = document.getElementById('resetBtn');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            if (searchInput) searchInput.value = '';
            if (typeFilter) typeFilter.value = '';
            if (statusFilter) statusFilter.value = '';
            masterDataPage.searchKeyword = '';
            masterDataPage.currentTab = 'all';
            masterDataPage.currentPage = 1;
            masterDataPage.loadData();
        });
        console.log('[主数据管理] 重置按钮事件已绑定');
    }
    
    // 重复数据按钮
    const duplicatesBtn = document.getElementById('duplicatesBtn');
    if (duplicatesBtn) {
        duplicatesBtn.addEventListener('click', () => masterDataPage.showDuplicates());
        console.log('[主数据管理] 重复数据按钮事件已绑定');
    }
    
    // 导出按钮
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', () => masterDataPage.exportData());
        console.log('[主数据管理] 导出按钮事件已绑定');
    }
    
    // 新增按钮 - 关键修复
    const createBtn = document.getElementById('createBtn');
    if (createBtn) {
        console.log('[主数据管理] 找到新增按钮，准备绑定事件');
        createBtn.addEventListener('click', function(e) {
            console.log('[主数据管理] 新增按钮被点击');
            e.preventDefault();
            e.stopPropagation();
            masterDataPage.showCreateModal();
        });
        console.log('[主数据管理] 新增按钮事件已绑定');
    } else {
        console.error('[主数据管理] 找不到新增按钮元素 #createBtn');
    }
    
    // 全选复选框
    const selectAll = document.getElementById('selectAll');
    if (selectAll) {
        selectAll.addEventListener('change', () => masterDataPage.toggleSelectAll());
        console.log('[主数据管理] 全选复选框事件已绑定');
    }
    
    // 分页按钮
    const prevPage = document.getElementById('prevPage');
    if (prevPage) {
        prevPage.addEventListener('click', () => masterDataPage.prevPage());
        console.log('[主数据管理] 上一页按钮事件已绑定');
    }
    
    const nextPage = document.getElementById('nextPage');
    if (nextPage) {
        nextPage.addEventListener('click', () => masterDataPage.nextPage());
        console.log('[主数据管理] 下一页按钮事件已绑定');
    }
    
    console.log('[主数据管理] 所有事件绑定完成');
}


// ============================================================================
// 全局函数包装器（用于HTML onclick事件）
// ============================================================================

/**
 * 查看主数据详情
 */
function viewDetail(id) {
    masterDataPage.viewDetail(id);
}

/**
 * 查看变更历史
 */
function viewHistory(id) {
    masterDataPage.viewHistory(id);
}

/**
 * 编辑主数据
 */
function editData(id) {
    masterDataPage.editData(id);
}

/**
 * 删除主数据
 */
function deleteData(id) {
    masterDataPage.deleteData(id);
}

/**
 * 切换选择
 */
function toggleSelect(id) {
    masterDataPage.toggleSelect(id);
}

/**
 * 显示创建模态框
 */
function showCreateModal() {
    masterDataPage.showCreateModal();
}

/**
 * 显示重复数据
 */
function showDuplicates() {
    masterDataPage.showDuplicates();
}

/**
 * 导出数据
 */
function exportData() {
    masterDataPage.exportData();
}
