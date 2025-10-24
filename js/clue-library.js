/**
 * 线索库页面逻辑
 */

const ClueLibrary = {
    // 当前页码
    currentPage: 1,
    pageSize: 10,
    
    // 筛选条件
    filters: {
        search: '',
        time: '',
        source: '',
        risk: '',
        status: '',
        department: ''
    },

    // 模拟数据
    mockData: {
        stats: [
            {
                id: 'total',
                title: '线索总数',
                value: 156,
                percentage: '100%',
                icon: 'fa-database',
                color: 'primary'
            },
            {
                id: 'pending',
                title: '待处理',
                value: 42,
                percentage: '26.9%',
                icon: 'fa-clock',
                color: 'warning'
            },
            {
                id: 'processing',
                title: '处理中',
                value: 68,
                percentage: '43.6%',
                icon: 'fa-spinner',
                color: 'info'
            },
            {
                id: 'completed',
                title: '已完成',
                value: 46,
                percentage: '29.5%',
                icon: 'fa-check-circle',
                color: 'success'
            }
        ],

        clues: [
            {
                id: 1,
                code: 'XS-2025-001',
                title: '科研经费异常报销 - 张教授课题组连号发票问题',
                source: 'rule',
                sourceName: '规则引擎',
                risk: 'high',
                department: '计算机学院',
                status: 'investigating',
                statusName: '核查中',
                createdAt: '2025-10-15 09:30:00',
                amount: '52,000',
                person: '张三教授'
            },
            {
                id: 2,
                code: 'XS-2025-002',
                title: '三公经费超预算预警 - 行政办公室本月支出异常',
                source: 'rule',
                sourceName: '规则引擎',
                risk: 'medium',
                department: '行政办公室',
                status: 'assigned',
                statusName: '已分发',
                createdAt: '2025-10-14 14:20:00',
                percentage: '85%'
            },
            {
                id: 3,
                code: 'XS-2025-003',
                title: '招生录取数据异常 - 计算机学院低分高录情况',
                source: 'audit',
                sourceName: '审计发现',
                risk: 'high',
                department: '计算机学院',
                status: 'rectifying',
                statusName: '整改中',
                createdAt: '2025-10-13 16:45:00',
                count: '3例'
            },
            {
                id: 4,
                code: 'XS-2025-004',
                title: '固定资产账实不符 - 物理学院设备盘点差异',
                source: 'inspection',
                sourceName: '巡查发现',
                risk: 'low',
                department: '物理学院',
                status: 'completed',
                statusName: '已完成',
                createdAt: '2025-10-12 11:15:00',
                count: '2台'
            },
            {
                id: 5,
                code: 'XS-2025-005',
                title: '工程变更频率异常 - 体育馆改造项目变更次数过多',
                source: 'rule',
                sourceName: '规则引擎',
                risk: 'medium',
                department: '基建处',
                status: 'investigating',
                statusName: '核查中',
                createdAt: '2025-10-11 10:00:00',
                count: '8次'
            },
            {
                id: 6,
                code: 'XS-2025-006',
                title: '供应商关联冲突预警 - 采购项目投标人关联分析',
                source: 'rule',
                sourceName: '规则引擎',
                risk: 'high',
                department: '采购中心',
                status: 'pending',
                statusName: '待处理',
                createdAt: '2025-10-10 15:30:00'
            },
            {
                id: 7,
                code: 'XS-2025-007',
                title: '学术不端行为举报 - 某教师论文抄袭问题',
                source: 'report',
                sourceName: '举报投诉',
                risk: 'high',
                department: '化学学院',
                status: 'investigating',
                statusName: '核查中',
                createdAt: '2025-10-09 09:00:00'
            },
            {
                id: 8,
                code: 'XS-2025-008',
                title: '预算执行偏离度过大 - 某科研项目经费使用异常',
                source: 'audit',
                sourceName: '审计发现',
                risk: 'medium',
                department: '科研处',
                status: 'assigned',
                statusName: '已分发',
                createdAt: '2025-10-08 13:45:00',
                percentage: '120%'
            },
            {
                id: 9,
                code: 'XS-2025-009',
                title: '公车使用轨迹异常 - 非工作时间使用记录',
                source: 'rule',
                sourceName: '规则引擎',
                risk: 'medium',
                department: '后勤处',
                status: 'completed',
                statusName: '已完成',
                createdAt: '2025-10-07 16:20:00'
            },
            {
                id: 10,
                code: 'XS-2025-010',
                title: '设备重复采购预警 - 实验室设备采购重复性检测',
                source: 'rule',
                sourceName: '规则引擎',
                risk: 'low',
                department: '物理学院',
                status: 'archived',
                statusName: '已归档',
                createdAt: '2025-10-06 10:30:00'
            },
            {
                id: 11,
                code: 'XS-2025-011',
                title: '津补贴发放异常 - 某部门津贴发放标准不一致',
                source: 'audit',
                sourceName: '审计发现',
                risk: 'medium',
                department: '人事处',
                status: 'rectifying',
                statusName: '整改中',
                createdAt: '2025-10-05 14:00:00'
            },
            {
                id: 12,
                code: 'XS-2025-012',
                title: '专项资金使用不规范 - 教学改革经费挪用问题',
                source: 'inspection',
                sourceName: '巡查发现',
                risk: 'high',
                department: '教务处',
                status: 'investigating',
                statusName: '核查中',
                createdAt: '2025-10-04 11:20:00',
                amount: '80,000'
            },
            {
                id: 13,
                code: 'XS-2025-013',
                title: '权限异常访问 - 非工作时段访问敏感数据',
                source: 'rule',
                sourceName: '规则引擎',
                risk: 'high',
                department: '信息中心',
                status: 'pending',
                statusName: '待处理',
                createdAt: '2025-10-03 08:45:00'
            },
            {
                id: 14,
                code: 'XS-2025-014',
                title: '招标文件排他性条款 - 某采购项目需求倾向性问题',
                source: 'manual',
                sourceName: '手动录入',
                risk: 'medium',
                department: '采购中心',
                status: 'assigned',
                statusName: '已分发',
                createdAt: '2025-10-02 15:10:00'
            },
            {
                id: 15,
                code: 'XS-2025-015',
                title: '第一议题制度落实不到位 - 某学院会议纪要缺失',
                source: 'inspection',
                sourceName: '巡查发现',
                risk: 'low',
                department: '数学学院',
                status: 'completed',
                statusName: '已完成',
                createdAt: '2025-10-01 09:30:00'
            }
        ]
    },

    /**
     * 初始化
     */
    init() {
        this.renderStatsCards();
        this.renderClueList();
        this.bindEvents();
    },

    /**
     * 渲染统计卡片
     */
    renderStatsCards() {
        const container = document.getElementById('stats-cards');
        if (!container) return;

        const html = this.mockData.stats.map(stat => `
            <div class="stat-card stat-card-${stat.color}" onclick="ClueLibrary.filterByStatus('${stat.id}')">
                <div class="stat-icon">
                    <i class="fas ${stat.icon}"></i>
                </div>
                <div class="stat-content">
                    <div class="stat-label">${stat.title}</div>
                    <div class="stat-value">${stat.value}</div>
                    <div class="stat-extra">${stat.percentage} 占比</div>
                </div>
            </div>
        `).join('');

        container.innerHTML = html;
    },

    /**
     * 渲染线索列表
     */
    renderClueList() {
        const tbody = document.getElementById('clue-tbody');
        if (!tbody) return;

        // 应用筛选
        let filteredClues = this.applyFiltersToData();

        // 分页
        const start = (this.currentPage - 1) * this.pageSize;
        const end = start + this.pageSize;
        const paginatedClues = filteredClues.slice(start, end);

        if (paginatedClues.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="9" class="empty-state">
                        <i class="fas fa-inbox"></i>
                        <p>暂无线索数据</p>
                        <button class="btn btn-primary" onclick="ClueLibrary.createClue()">
                            <i class="fas fa-plus"></i>
                            新建线索
                        </button>
                    </td>
                </tr>
            `;
            return;
        }

        const html = paginatedClues.map(clue => `
            <tr onclick="ClueLibrary.viewDetail(${clue.id})">
                <td onclick="event.stopPropagation()">
                    <input type="checkbox" class="clue-checkbox" data-id="${clue.id}">
                </td>
                <td>
                    <strong>${clue.code}</strong>
                </td>
                <td>
                    <div style="max-width: 300px;">
                        <a href="javascript:void(0)" class="text-primary" style="font-weight: 500;">
                            ${clue.title}
                        </a>
                    </div>
                </td>
                <td>
                    <span class="source-badge">
                        <i class="fas ${this.getSourceIcon(clue.source)}"></i>
                        ${clue.sourceName}
                    </span>
                </td>
                <td>
                    <span class="risk-badge ${clue.risk}">
                        <i class="fas fa-circle"></i>
                        ${this.getRiskText(clue.risk)}
                    </span>
                </td>
                <td>${clue.department}</td>
                <td>
                    <span class="status-badge ${clue.status}">
                        ${clue.statusName}
                    </span>
                </td>
                <td>
                    <span style="color: var(--color-gray-600); font-size: 13px;">
                        ${Utils.formatDate(clue.createdAt, 'YYYY-MM-DD HH:mm')}
                    </span>
                </td>
                <td onclick="event.stopPropagation()">
                    <div class="action-buttons">
                        <button class="btn btn-sm btn-primary" onclick="ClueLibrary.viewDetail(${clue.id})">
                            <i class="fas fa-eye"></i>
                            查看
                        </button>
                        <button class="btn btn-sm btn-secondary" onclick="ClueLibrary.assignClue(${clue.id})">
                            <i class="fas fa-share"></i>
                            分发
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');

        tbody.innerHTML = html;

        // 渲染分页
        this.renderPagination(filteredClues.length);
    },

    /**
     * 应用筛选条件到数据
     */
    applyFiltersToData() {
        let filtered = [...this.mockData.clues];

        // 搜索
        if (this.filters.search) {
            const search = this.filters.search.toLowerCase();
            filtered = filtered.filter(clue => 
                clue.title.toLowerCase().includes(search) ||
                clue.code.toLowerCase().includes(search) ||
                (clue.person && clue.person.toLowerCase().includes(search))
            );
        }

        // 来源类型
        if (this.filters.source) {
            filtered = filtered.filter(clue => clue.source === this.filters.source);
        }

        // 风险等级
        if (this.filters.risk) {
            filtered = filtered.filter(clue => clue.risk === this.filters.risk);
        }

        // 处理状态
        if (this.filters.status) {
            filtered = filtered.filter(clue => clue.status === this.filters.status);
        }

        // 责任单位
        if (this.filters.department) {
            filtered = filtered.filter(clue => clue.department.includes(this.filters.department));
        }

        // 时间范围
        if (this.filters.time) {
            const now = new Date();
            filtered = filtered.filter(clue => {
                const clueDate = new Date(clue.createdAt);
                switch (this.filters.time) {
                    case 'today':
                        return clueDate.toDateString() === now.toDateString();
                    case 'week':
                        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                        return clueDate >= weekAgo;
                    case 'month':
                        return clueDate.getMonth() === now.getMonth() && 
                               clueDate.getFullYear() === now.getFullYear();
                    case 'quarter':
                        const quarter = Math.floor(now.getMonth() / 3);
                        const clueQuarter = Math.floor(clueDate.getMonth() / 3);
                        return clueQuarter === quarter && 
                               clueDate.getFullYear() === now.getFullYear();
                    case 'year':
                        return clueDate.getFullYear() === now.getFullYear();
                    default:
                        return true;
                }
            });
        }

        return filtered;
    },

    /**
     * 渲染分页
     */
    renderPagination(totalItems) {
        const container = document.getElementById('pagination');
        if (!container) return;

        const totalPages = Math.ceil(totalItems / this.pageSize);
        
        if (totalPages <= 1) {
            container.innerHTML = `<span class="pagination-info">共 ${totalItems} 条</span>`;
            return;
        }

        let html = `
            <button ${this.currentPage === 1 ? 'disabled' : ''} onclick="ClueLibrary.changePage(${this.currentPage - 1})">
                <i class="fas fa-chevron-left"></i>
            </button>
        `;

        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= this.currentPage - 1 && i <= this.currentPage + 1)) {
                html += `
                    <button class="${i === this.currentPage ? 'active' : ''}" onclick="ClueLibrary.changePage(${i})">
                        ${i}
                    </button>
                `;
            } else if (i === this.currentPage - 2 || i === this.currentPage + 2) {
                html += '<span>...</span>';
            }
        }

        html += `
            <button ${this.currentPage === totalPages ? 'disabled' : ''} onclick="ClueLibrary.changePage(${this.currentPage + 1})">
                <i class="fas fa-chevron-right"></i>
            </button>
            <span class="pagination-info">共 ${totalItems} 条</span>
        `;

        container.innerHTML = html;
    },

    /**
     * 绑定事件
     */
    bindEvents() {
        // 全选复选框
        const selectAll = document.getElementById('select-all');
        if (selectAll) {
            selectAll.addEventListener('change', (e) => {
                const checkboxes = document.querySelectorAll('.clue-checkbox');
                checkboxes.forEach(cb => cb.checked = e.target.checked);
            });
        }

        // 搜索框
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('input', Utils.debounce((e) => {
                this.filters.search = e.target.value;
                this.currentPage = 1;
                this.renderClueList();
            }, 500));
        }
    },

    /**
     * 获取来源图标
     */
    getSourceIcon(source) {
        const icons = {
            rule: 'fa-robot',
            report: 'fa-flag',
            inspection: 'fa-search',
            audit: 'fa-clipboard-check',
            manual: 'fa-keyboard'
        };
        return icons[source] || 'fa-circle';
    },

    /**
     * 获取风险等级文本
     */
    getRiskText(risk) {
        const map = {
            high: '高风险',
            medium: '中风险',
            low: '低风险'
        };
        return map[risk] || risk;
    },

    /**
     * 应用筛选
     */
    applyFilters() {
        this.filters.time = document.getElementById('filter-time').value;
        this.filters.source = document.getElementById('filter-source').value;
        this.filters.risk = document.getElementById('filter-risk').value;
        this.filters.status = document.getElementById('filter-status').value;
        this.filters.department = document.getElementById('filter-department').value;
        
        this.currentPage = 1;
        this.renderClueList();
        Toast.success('筛选条件已应用');
    },

    /**
     * 重置筛选
     */
    resetFilters() {
        this.filters = {
            search: '',
            time: '',
            source: '',
            risk: '',
            status: '',
            department: ''
        };
        
        document.getElementById('search-input').value = '';
        document.getElementById('filter-time').value = '';
        document.getElementById('filter-source').value = '';
        document.getElementById('filter-risk').value = '';
        document.getElementById('filter-status').value = '';
        document.getElementById('filter-department').value = '';
        
        this.currentPage = 1;
        this.renderClueList();
        Toast.success('筛选条件已重置');
    },

    /**
     * 按状态筛选
     */
    filterByStatus(statusId) {
        const statusMap = {
            'total': '',
            'pending': 'pending',
            'processing': 'investigating',
            'completed': 'completed'
        };
        
        this.filters.status = statusMap[statusId] || '';
        document.getElementById('filter-status').value = this.filters.status;
        this.currentPage = 1;
        this.renderClueList();
    },

    /**
     * 切换页码
     */
    changePage(page) {
        this.currentPage = page;
        this.renderClueList();
        // 滚动到表格顶部
        document.getElementById('clue-table').scrollIntoView({ behavior: 'smooth' });
    },

    /**
     * 刷新列表
     */
    refreshList() {
        Toast.info('正在刷新线索列表...');
        setTimeout(() => {
            this.renderClueList();
            Toast.success('刷新成功');
        }, 500);
    },

    /**
     * 查看详情
     */
    viewDetail(id) {
        window.location.href = `clue-detail.html?id=${id}`;
    },

    /**
     * 分发线索
     */
    assignClue(id) {
        const clue = this.mockData.clues.find(c => c.id === id);
        if (!clue) {
            Toast.error('线索不存在');
            return;
        }
        
        this.currentAssignClueId = id;
        
        // 填充线索信息
        const infoBox = document.getElementById('assignClueInfo');
        infoBox.innerHTML = `
            <div style="margin-bottom: 8px;"><strong>线索编号：</strong>${clue.code}</div>
            <div style="margin-bottom: 8px;"><strong>线索标题：</strong>${clue.title}</div>
            <div><strong>风险等级：</strong><span class="risk-badge ${clue.risk}"><i class="fas fa-circle"></i> ${this.getRiskText(clue.risk)}</span></div>
        `;
        
        // 设置默认期限为7天后
        const deadline = new Date();
        deadline.setDate(deadline.getDate() + 7);
        document.getElementById('assignDeadline').value = deadline.toISOString().split('T')[0];
        
        // 显示模态框
        document.getElementById('assignClueModal').classList.add('active');
    },

    /**
     * 关闭分发模态框
     */
    closeAssignModal() {
        document.getElementById('assignClueModal').classList.remove('active');
        document.getElementById('assignClueForm').reset();
        this.currentAssignClueId = null;
    },

    /**
     * 提交分发线索
     */
    submitAssignClue() {
        const form = document.getElementById('assignClueForm');
        if (!form.checkValidity()) {
            Toast.warning('请填写所有必填项');
            return;
        }
        
        const department = document.getElementById('assignDepartment').value;
        const handler = document.getElementById('assignHandler').value;
        const deadline = document.getElementById('assignDeadline').value;
        const remark = document.getElementById('assignRemark').value;
        
        // 模拟提交
        Toast.success(`线索已分发给 ${department} - ${handler}`);
        this.closeAssignModal();
        
        // 更新线索状态
        const clue = this.mockData.clues.find(c => c.id === this.currentAssignClueId);
        if (clue) {
            clue.status = 'assigned';
            clue.statusName = '已分发';
            this.renderClueList();
        }
    },

    /**
     * 创建线索
     */
    createClue() {
        // 显示模态框
        document.getElementById('createClueModal').classList.add('active');
    },

    /**
     * 关闭新建模态框
     */
    closeCreateModal() {
        document.getElementById('createClueModal').classList.remove('active');
        document.getElementById('createClueForm').reset();
    },

    /**
     * 提交新建线索
     */
    submitCreateClue() {
        const form = document.getElementById('createClueForm');
        if (!form.checkValidity()) {
            Toast.warning('请填写所有必填项');
            return;
        }
        
        const title = document.getElementById('clueTitle').value;
        const source = document.getElementById('clueSource').value;
        const risk = document.getElementById('clueRisk').value;
        const department = document.getElementById('clueDepartment').value;
        const person = document.getElementById('cluePerson').value;
        const description = document.getElementById('clueDescription').value;
        
        // 生成新线索编号
        const newCode = `XS-2025-${String(this.mockData.clues.length + 1).padStart(3, '0')}`;
        
        // 创建新线索对象
        const newClue = {
            id: this.mockData.clues.length + 1,
            code: newCode,
            title: title,
            source: source,
            sourceName: source,
            risk: risk,
            status: 'pending',
            statusName: '待处理',
            department: department,
            person: person || '-',
            description: description,
            reportTime: new Date().toISOString().split('T')[0],
            handler: '-'
        };
        
        // 添加到数据中
        this.mockData.clues.unshift(newClue);
        
        Toast.success('线索创建成功');
        this.closeCreateModal();
        this.renderClueList();
        this.renderStatsCards();
    },

    /**
     * 编辑线索
     */
    editClue(id) {
        const clue = this.mockData.clues.find(c => c.id === id);
        if (!clue) {
            Toast.error('线索不存在');
            return;
        }
        
        this.currentEditClueId = id;
        
        // 填充表单
        document.getElementById('editClueId').value = clue.id;
        document.getElementById('editClueTitle').value = clue.title;
        document.getElementById('editClueSource').value = clue.source;
        document.getElementById('editClueRisk').value = clue.risk;
        document.getElementById('editClueDepartment').value = clue.department;
        document.getElementById('editCluePerson').value = clue.person === '-' ? '' : clue.person;
        document.getElementById('editClueDescription').value = clue.description;
        
        // 显示模态框
        document.getElementById('editClueModal').classList.add('active');
    },

    /**
     * 关闭编辑模态框
     */
    closeEditModal() {
        document.getElementById('editClueModal').classList.remove('active');
        document.getElementById('editClueForm').reset();
        this.currentEditClueId = null;
    },

    /**
     * 提交编辑线索
     */
    submitEditClue() {
        const form = document.getElementById('editClueForm');
        if (!form.checkValidity()) {
            Toast.warning('请填写所有必填项');
            return;
        }
        
        const clue = this.mockData.clues.find(c => c.id === this.currentEditClueId);
        if (!clue) {
            Toast.error('线索不存在');
            return;
        }
        
        // 更新线索信息
        clue.title = document.getElementById('editClueTitle').value;
        clue.source = document.getElementById('editClueSource').value;
        clue.sourceName = clue.source;
        clue.risk = document.getElementById('editClueRisk').value;
        clue.department = document.getElementById('editClueDepartment').value;
        clue.person = document.getElementById('editCluePerson').value || '-';
        clue.description = document.getElementById('editClueDescription').value;
        
        Toast.success('线索更新成功');
        this.closeEditModal();
        this.renderClueList();
    },

    /**
     * 导出线索
     */
    exportClues() {
        // 获取当前筛选的线索数据
        const filteredClues = this.getFilteredClues();
        
        if (filteredClues.length === 0) {
            Toast.warning('没有可导出的数据');
            return;
        }
        
        // 创建CSV内容
        const headers = ['线索编号', '线索标题', '来源类型', '风险等级', '涉及部门', '涉及人员', '状态', '上报时间', '处理人'];
        const rows = filteredClues.map(clue => [
            clue.code,
            clue.title,
            clue.sourceName,
            this.getRiskText(clue.risk),
            clue.department,
            clue.person,
            clue.statusName,
            clue.reportTime,
            clue.handler
        ]);
        
        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
        ].join('\n');
        
        // 创建下载链接
        const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `线索库导出_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
        
        Toast.success(`已导出 ${filteredClues.length} 条线索`);
    },

    /**
     * 获取风险等级文本
     */
    getRiskText(risk) {
        const riskMap = {
            'high': '高风险',
            'medium': '中风险',
            'low': '低风险'
        };
        return riskMap[risk] || risk;
    },

    /**
     * 批量分发
     */
    batchAssign() {
        const checked = document.querySelectorAll('.clue-checkbox:checked');
        if (checked.length === 0) {
            Toast.warning('请先选择要分发的线索');
            return;
        }
        
        Modal.confirm({
            title: '批量分发',
            content: `确定要分发选中的 ${checked.length} 条线索吗？`,
            onConfirm: () => {
                Toast.success(`已分发 ${checked.length} 条线索`);
                this.renderClueList();
            }
        });
    },

    /**
     * 批量合并
     */
    batchMerge() {
        const checked = document.querySelectorAll('.clue-checkbox:checked');
        if (checked.length < 2) {
            Toast.warning('请至少选择两条线索进行合并');
            return;
        }
        
        Modal.confirm({
            title: '批量合并',
            content: `确定要合并选中的 ${checked.length} 条线索吗？`,
            onConfirm: () => {
                Toast.success(`已合并 ${checked.length} 条线索`);
                this.renderClueList();
            }
        });
    },

    /**
     * 批量导出
     */
    batchExport() {
        const checked = document.querySelectorAll('.clue-checkbox:checked');
        if (checked.length === 0) {
            Toast.warning('请先选择要导出的线索');
            return;
        }
        
        // 获取选中的线索ID
        const selectedIds = Array.from(checked).map(cb => parseInt(cb.dataset.id));
        const selectedClues = this.mockData.clues.filter(clue => selectedIds.includes(clue.id));
        
        // 创建CSV内容
        const headers = ['线索编号', '线索标题', '来源类型', '风险等级', '涉及部门', '涉及人员', '状态', '上报时间', '处理人'];
        const rows = selectedClues.map(clue => [
            clue.code,
            clue.title,
            clue.sourceName,
            this.getRiskText(clue.risk),
            clue.department,
            clue.person,
            clue.statusName,
            clue.reportTime,
            clue.handler
        ]);
        
        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
        ].join('\n');
        
        // 创建下载链接
        const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `线索库批量导出_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
        
        Toast.success(`已导出 ${checked.length} 条线索`);
    }
};

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    ClueLibrary.init();
    
    // 启用表格右键菜单
    ContextMenu.enableForTable('#clue-table', (rowData) => {
        return [
            {
                icon: 'fas fa-eye',
                label: '查看详情',
                onClick: () => {
                    const row = rowData.element;
                    const id = row.getAttribute('data-id');
                    if (id) {
                        window.location.href = `clue-detail.html?id=${id}`;
                    }
                }
            },
            {
                icon: 'fas fa-edit',
                label: '编辑',
                onClick: () => {
                    ClueLibrary.editClue(clueId);
                }
            },
            { divider: true },
            {
                icon: 'fas fa-share-alt',
                label: '分发处置',
                onClick: () => {
                    ClueLibrary.distribute();
                }
            },
            {
                icon: 'fas fa-object-group',
                label: '合并线索',
                onClick: () => {
                    ClueLibrary.merge();
                }
            },
            { divider: true },
            {
                icon: 'fas fa-download',
                label: '导出',
                onClick: () => {
                    ClueLibrary.exportClue();
                }
            },
            { divider: true },
            {
                icon: 'fas fa-trash',
                label: '删除',
                danger: true,
                onClick: () => {
                    Confirm.delete('确定要删除这条线索吗？', () => {
                        Toast.success('删除成功');
                    });
                }
            }
        ];
    });
    
    // 注册页面特定的快捷键
    document.addEventListener('app:save', () => {
        // 如果有编辑表单，保存表单
        Toast.info('保存快捷键触发');
    });
});
