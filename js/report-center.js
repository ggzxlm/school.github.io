/**
 * 报表中心页面逻辑
 */

class ReportCenter {
    constructor() {
        this.currentCategory = 'all';
        this.currentReportId = null;
        this.init();
    }

    init() {
        this.loadMockData();
        this.renderStatistics();
        this.renderReports();
        this.bindEvents();
    }

    // 加载模拟数据
    loadMockData() {
        this.reports = [
            {
                id: 'RPT001',
                name: '月度预警统计报表',
                type: 'TABLE',
                description: '按月统计各类预警数量、处置情况和趋势分析',
                status: 'published',
                author: '张三',
                createTime: '2025-10-01 10:00:00',
                updateTime: '2025-10-24 14:30:00',
                views: 156,
                favorites: 12,
                dataSource: 'alerts',
                schedule: '每月1日自动生成',
                subscribers: 8
            },
            {
                id: 'RPT002',
                name: '部门风险评估仪表板',
                type: 'DASHBOARD',
                description: '实时展示各部门风险等级、预警分布和整改进度',
                status: 'published',
                author: '李四',
                createTime: '2025-09-15 09:30:00',
                updateTime: '2025-10-23 16:20:00',
                views: 289,
                favorites: 25,
                dataSource: 'alerts',
                schedule: '实时更新',
                subscribers: 15
            },
            {
                id: 'RPT003',
                name: '线索处置效率分析',
                type: 'CHART',
                description: '分析线索从发现到处置完成的时间分布和效率指标',
                status: 'published',
                author: '王五',
                createTime: '2025-09-20 14:15:00',
                updateTime: '2025-10-22 11:45:00',
                views: 178,
                favorites: 18,
                dataSource: 'clues',
                schedule: '每周一生成',
                subscribers: 10
            },
            {
                id: 'RPT004',
                name: '工单处理情况报表',
                type: 'TABLE',
                description: '统计工单数量、处理时长、超期情况等关键指标',
                status: 'published',
                author: '赵六',
                createTime: '2025-10-05 11:20:00',
                updateTime: '2025-10-24 09:15:00',
                views: 134,
                favorites: 9,
                dataSource: 'workorders',
                schedule: '每日生成',
                subscribers: 6
            },
            {
                id: 'RPT005',
                name: '整改完成率趋势图',
                type: 'CHART',
                description: '展示各部门整改完成率的月度变化趋势',
                status: 'published',
                author: '钱七',
                createTime: '2025-09-28 15:40:00',
                updateTime: '2025-10-21 13:30:00',
                views: 201,
                favorites: 16,
                dataSource: 'rectification',
                schedule: '每月生成',
                subscribers: 12
            },
            {
                id: 'RPT006',
                name: '科研经费监督报表',
                type: 'TABLE',
                description: '科研经费使用情况、异常预警和审计发现问题统计',
                status: 'published',
                author: '孙八',
                createTime: '2025-10-10 10:30:00',
                updateTime: '2025-10-23 14:50:00',
                views: 167,
                favorites: 14,
                dataSource: 'alerts',
                schedule: '每季度生成',
                subscribers: 11
            },
            {
                id: 'RPT007',
                name: '采购招标监控仪表板',
                type: 'DASHBOARD',
                description: '实时监控采购招标流程、价格异常和围标串标风险',
                status: 'draft',
                author: '周九',
                createTime: '2025-10-18 16:00:00',
                updateTime: '2025-10-24 10:20:00',
                views: 45,
                favorites: 3,
                dataSource: 'alerts',
                schedule: '实时更新',
                subscribers: 2
            },
            {
                id: 'RPT008',
                name: '三公经费支出分析',
                type: 'CHART',
                description: '分析三公经费支出结构、趋势和超标情况',
                status: 'published',
                author: '吴十',
                createTime: '2025-09-25 13:45:00',
                updateTime: '2025-10-20 15:10:00',
                views: 192,
                favorites: 20,
                dataSource: 'alerts',
                schedule: '每月生成',
                subscribers: 13
            },
            {
                id: 'RPT009',
                name: '资产使用效率报表',
                type: 'TABLE',
                description: '统计固定资产使用率、闲置情况和处置建议',
                status: 'published',
                author: '郑十一',
                createTime: '2025-10-08 09:15:00',
                updateTime: '2025-10-22 16:40:00',
                views: 143,
                favorites: 11,
                dataSource: 'alerts',
                schedule: '每季度生成',
                subscribers: 7
            },
            {
                id: 'RPT010',
                name: '招生录取监督报表',
                type: 'TABLE',
                description: '招生录取数据分析、异常情况统计和政策执行评估',
                status: 'published',
                author: '王十二',
                createTime: '2025-09-30 14:20:00',
                updateTime: '2025-10-19 11:25:00',
                views: 158,
                favorites: 15,
                dataSource: 'alerts',
                schedule: '每学期生成',
                subscribers: 9
            },
            {
                id: 'RPT011',
                name: '综合监督态势图',
                type: 'DASHBOARD',
                description: '全局监督态势展示，包含预警、线索、工单、整改等全维度数据',
                status: 'published',
                author: '李十三',
                createTime: '2025-10-12 10:50:00',
                updateTime: '2025-10-24 08:30:00',
                views: 312,
                favorites: 28,
                dataSource: 'all',
                schedule: '实时更新',
                subscribers: 18
            },
            {
                id: 'RPT012',
                name: '预警响应时效分析',
                type: 'CHART',
                description: '分析预警从触发到响应的时间分布和改进建议',
                status: 'draft',
                author: '张十四',
                createTime: '2025-10-20 15:30:00',
                updateTime: '2025-10-24 11:15:00',
                views: 28,
                favorites: 2,
                dataSource: 'alerts',
                schedule: '每周生成',
                subscribers: 1
            }
        ];
    }

    // 绑定事件
    bindEvents() {
        // 分类标签切换
        document.querySelectorAll('.category-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const category = e.currentTarget.dataset.category;
                this.switchCategory(category);
            });
        });

        // 搜索
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', () => this.applyFilters());
        }

        // 筛选器
        ['typeFilter', 'statusFilter', 'sortFilter'].forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('change', () => this.applyFilters());
            }
        });
    }

    // 渲染统计数据
    renderStatistics() {
        const totalReports = this.reports.length;
        const favoriteReports = this.reports.filter(r => r.favorites > 10).length;
        const sharedReports = this.reports.filter(r => r.status === 'published').length;
        const subscribedReports = this.reports.filter(r => r.subscribers > 5).length;

        document.getElementById('totalReports').textContent = totalReports;
        document.getElementById('favoriteReports').textContent = favoriteReports;
        document.getElementById('sharedReports').textContent = sharedReports;
        document.getElementById('subscribedReports').textContent = subscribedReports;
    }

    // 切换分类
    switchCategory(category) {
        this.currentCategory = category;

        // 更新标签状态
        document.querySelectorAll('.category-tab').forEach(tab => {
            tab.classList.remove('active');
            if (tab.dataset.category === category) {
                tab.classList.add('active');
            }
        });

        this.renderReports();
    }

    // 应用筛选
    applyFilters() {
        this.renderReports();
    }

    // 渲染报表列表
    renderReports() {
        const container = document.getElementById('reportGrid');
        const searchText = document.getElementById('searchInput')?.value.toLowerCase() || '';
        const typeFilter = document.getElementById('typeFilter')?.value || '';
        const statusFilter = document.getElementById('statusFilter')?.value || '';
        const sortFilter = document.getElementById('sortFilter')?.value || 'updateTime';

        // 筛选报表
        let filteredReports = this.reports.filter(report => {
            let match = true;

            // 分类筛选
            if (this.currentCategory !== 'all') {
                if (this.currentCategory === 'table' && report.type !== 'TABLE') match = false;
                if (this.currentCategory === 'chart' && report.type !== 'CHART') match = false;
                if (this.currentCategory === 'dashboard' && report.type !== 'DASHBOARD') match = false;
                if (this.currentCategory === 'template') match = false; // 暂无模板
            }

            // 搜索筛选
            if (searchText && !report.name.toLowerCase().includes(searchText) && 
                !report.description.toLowerCase().includes(searchText)) {
                match = false;
            }

            // 类型筛选
            if (typeFilter && report.type !== typeFilter) {
                match = false;
            }

            // 状态筛选
            if (statusFilter && report.status !== statusFilter) {
                match = false;
            }

            return match;
        });

        // 排序
        filteredReports.sort((a, b) => {
            switch (sortFilter) {
                case 'updateTime':
                    return new Date(b.updateTime) - new Date(a.updateTime);
                case 'createTime':
                    return new Date(b.createTime) - new Date(a.createTime);
                case 'name':
                    return a.name.localeCompare(b.name);
                case 'views':
                    return b.views - a.views;
                default:
                    return 0;
            }
        });

        if (filteredReports.length === 0) {
            container.innerHTML = `
                <div class="empty-state" style="grid-column: 1 / -1;">
                    <i class="fas fa-inbox"></i>
                    <p>暂无报表数据</p>
                    <button class="btn btn-primary" onclick="reportCenter.createReport()">
                        <i class="fas fa-plus"></i> 创建第一个报表
                    </button>
                </div>
            `;
            return;
        }

        container.innerHTML = filteredReports.map(report => `
            <div class="report-card" onclick="reportCenter.viewReportDetail('${report.id}')">
                <div class="report-card-header">
                    <div class="report-card-icon type-${report.type.toLowerCase()}">
                        <i class="fas fa-${this.getReportIcon(report.type)}"></i>
                    </div>
                    <div class="report-card-actions">
                        <button class="report-card-action-btn ${report.favorites > 10 ? 'active' : ''}" 
                                onclick="event.stopPropagation(); reportCenter.toggleFavorite('${report.id}')">
                            <i class="fas fa-star"></i>
                        </button>
                        <button class="report-card-action-btn" 
                                onclick="event.stopPropagation(); reportCenter.shareReport('${report.id}')">
                            <i class="fas fa-share-alt"></i>
                        </button>
                    </div>
                </div>
                <div class="report-card-body">
                    <h3 class="report-card-title">${report.name}</h3>
                    <p class="report-card-description">${report.description}</p>
                    <div class="report-card-meta">
                        <span class="report-card-meta-item">
                            <i class="fas fa-eye"></i>
                            ${report.views}
                        </span>
                        <span class="report-card-meta-item">
                            <i class="fas fa-star"></i>
                            ${report.favorites}
                        </span>
                        <span class="report-card-meta-item">
                            <i class="fas fa-bell"></i>
                            ${report.subscribers}
                        </span>
                    </div>
                </div>
                <div class="report-card-footer">
                    <span class="report-card-status status-${report.status}">
                        ${report.status === 'published' ? '已发布' : report.status === 'draft' ? '草稿' : '已归档'}
                    </span>
                    <span class="report-card-author">${report.author}</span>
                </div>
            </div>
        `).join('');
    }

    // 获取报表图标
    getReportIcon(type) {
        const icons = {
            'TABLE': 'table',
            'CHART': 'chart-bar',
            'DASHBOARD': 'tachometer-alt'
        };
        return icons[type] || 'file-alt';
    }

    // 查看报表详情
    viewReportDetail(reportId) {
        const report = this.reports.find(r => r.id === reportId);
        if (!report) {
            showNotification('error', '报表不存在');
            return;
        }

        this.currentReportId = reportId;

        const content = `
            <div class="detail-section">
                <h4>基本信息</h4>
                <div class="detail-grid">
                    <div class="detail-item">
                        <label>报表名称</label>
                        <div><strong>${report.name}</strong></div>
                    </div>
                    <div class="detail-item">
                        <label>报表ID</label>
                        <div>${report.id}</div>
                    </div>
                    <div class="detail-item">
                        <label>报表类型</label>
                        <div>${this.getReportTypeName(report.type)}</div>
                    </div>
                    <div class="detail-item">
                        <label>状态</label>
                        <div>
                            <span class="report-card-status status-${report.status}">
                                ${report.status === 'published' ? '已发布' : report.status === 'draft' ? '草稿' : '已归档'}
                            </span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label>创建人</label>
                        <div>${report.author}</div>
                    </div>
                    <div class="detail-item">
                        <label>创建时间</label>
                        <div>${new Date(report.createTime).toLocaleString('zh-CN')}</div>
                    </div>
                    <div class="detail-item">
                        <label>更新时间</label>
                        <div>${new Date(report.updateTime).toLocaleString('zh-CN')}</div>
                    </div>
                    <div class="detail-item">
                        <label>数据源</label>
                        <div>${this.getDataSourceName(report.dataSource)}</div>
                    </div>
                </div>
            </div>

            <div class="detail-section">
                <h4>报表描述</h4>
                <div style="padding: 16px; background: var(--color-gray-50); border-radius: 6px; line-height: 1.6;">
                    ${report.description}
                </div>
            </div>

            <div class="detail-section">
                <h4>使用统计</h4>
                <div class="detail-grid">
                    <div class="detail-item">
                        <label>浏览次数</label>
                        <div><strong>${report.views}</strong> 次</div>
                    </div>
                    <div class="detail-item">
                        <label>收藏次数</label>
                        <div><strong>${report.favorites}</strong> 次</div>
                    </div>
                    <div class="detail-item">
                        <label>订阅人数</label>
                        <div><strong>${report.subscribers}</strong> 人</div>
                    </div>
                    <div class="detail-item">
                        <label>生成频率</label>
                        <div>${report.schedule}</div>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('reportDetailContent').innerHTML = content;
        document.getElementById('reportDetailTitle').textContent = report.name;

        const modal = document.getElementById('reportDetailDialog');
        modal.style.display = 'flex';
        setTimeout(() => modal.classList.add('modal-show'), 10);
    }

    // 获取报表类型名称
    getReportTypeName(type) {
        const names = {
            'TABLE': '表格报表',
            'CHART': '图表报表',
            'DASHBOARD': '仪表板'
        };
        return names[type] || type;
    }

    // 获取数据源名称
    getDataSourceName(dataSource) {
        const names = {
            'alerts': '预警数据',
            'clues': '线索数据',
            'workorders': '工单数据',
            'rectification': '整改数据',
            'all': '全部数据'
        };
        return names[dataSource] || dataSource;
    }

    // 关闭报表详情
    closeReportDetail() {
        const modal = document.getElementById('reportDetailDialog');
        modal.classList.remove('modal-show');
        setTimeout(() => {
            modal.style.display = 'none';
            this.currentReportId = null;
        }, 300);
    }

    // 查看报表
    viewReport() {
        if (!this.currentReportId) return;
        const report = this.reports.find(r => r.id === this.currentReportId);
        if (!report) return;

        // 根据报表ID跳转到对应的查看页面
        const viewPages = {
            'RPT001': 'report-view-monthly-alert.html',
            'RPT002': 'report-view-dept-risk-dashboard.html',
            'RPT003': 'report-view-clue-efficiency.html',
            'RPT004': 'report-view-workorder-status.html',
            'RPT005': 'report-view-rectification-rate.html',
            'RPT006': 'report-view-research-fund.html',
            'RPT007': 'report-view-procurement-dashboard.html',
            'RPT008': 'report-view-three-public.html',
            'RPT009': 'report-view-asset-efficiency.html',
            'RPT010': 'report-view-admission-supervision.html',
            'RPT011': 'report-view-supervision-overview.html',
            'RPT012': 'report-view-alert-response.html'
        };

        const viewPage = viewPages[this.currentReportId];
        if (viewPage) {
            window.location.href = viewPage;
        } else {
            showNotification('info', '该报表查看页面开发中');
            this.closeReportDetail();
        }
    }

    // 创建报表
    createReport() {
        const modal = document.getElementById('createReportDialog');
        modal.style.display = 'flex';
        setTimeout(() => modal.classList.add('modal-show'), 10);
    }

    // 关闭创建对话框
    closeCreateDialog() {
        const modal = document.getElementById('createReportDialog');
        modal.classList.remove('modal-show');
        setTimeout(() => {
            modal.style.display = 'none';
            // 清空表单
            document.getElementById('reportName').value = '';
            document.getElementById('reportType').value = '';
            document.getElementById('reportDescription').value = '';
            document.getElementById('reportDataSource').value = '';
        }, 300);
    }

    // 保存报表
    saveReport() {
        const name = document.getElementById('reportName').value;
        const type = document.getElementById('reportType').value;
        const description = document.getElementById('reportDescription').value;
        const dataSource = document.getElementById('reportDataSource').value;

        if (!name || !type) {
            showNotification('warning', '请填写必填项');
            return;
        }

        showNotification('success', '报表创建成功');
        this.closeCreateDialog();
    }

    // 导入报表
    importReport() {
        showNotification('info', '导入报表功能开发中');
    }

    // 切换收藏
    toggleFavorite(reportId) {
        showNotification('success', '收藏状态已更新');
    }

    // 分享报表
    shareReport(reportId) {
        showNotification('info', '分享链接已复制到剪贴板');
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    window.reportCenter = new ReportCenter();
});
