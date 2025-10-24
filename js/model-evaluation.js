/**
 * 模型评估页面逻辑
 */

class ModelEvaluation {
    constructor() {
        this.evaluationData = [];
        this.filteredData = [];
        this.init();
    }

    init() {
        this.loadEvaluationData();
        this.loadStatistics();
        this.renderEvaluationTable();
        this.bindEvents();
    }

    // 绑定事件
    bindEvents() {
        // 搜索
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', () => this.applyFilters());
        }

        // 筛选器
        ['categoryFilter', 'statusFilter', 'timeFilter'].forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('change', () => this.applyFilters());
            }
        });
    }

    // 加载评估数据
    loadEvaluationData() {
        // 模拟评估数据
        this.evaluationData = [
            {
                id: 'eval_001',
                modelName: '科研经费使用监督模型',
                category: '科研监督',
                accuracy: 0.92,
                recall: 0.88,
                f1Score: 0.90,
                overallScore: 92,
                status: 'excellent',
                evaluationTime: '2025-10-24 14:30:00',
                suggestions: [
                    '可以增加更多历史数据训练',
                    '优化特征工程提升准确率',
                    '调整阈值参数减少误报'
                ]
            },
            {
                id: 'eval_002',
                modelName: '预算执行监督模型',
                category: '财务监督',
                accuracy: 0.85,
                recall: 0.82,
                f1Score: 0.83,
                overallScore: 85,
                status: 'good',
                evaluationTime: '2025-10-24 13:15:00',
                suggestions: [
                    '增加季节性因素考虑',
                    '优化预算偏差检测算法',
                    '加强异常值处理'
                ]
            },
            {
                id: 'eval_003',
                modelName: '三公经费监督模型',
                category: '财务监督',
                accuracy: 0.78,
                recall: 0.75,
                f1Score: 0.76,
                overallScore: 76,
                status: 'average',
                evaluationTime: '2025-10-24 12:00:00',
                suggestions: [
                    '扩充训练数据集',
                    '改进特征选择策略',
                    '调整模型参数'
                ]
            },
            {
                id: 'eval_004',
                modelName: '采购招标监督模型',
                category: '采购监督',
                accuracy: 0.89,
                recall: 0.86,
                f1Score: 0.87,
                overallScore: 87,
                status: 'good',
                evaluationTime: '2025-10-24 11:45:00',
                suggestions: [
                    '增强围标串标检测能力',
                    '优化价格异常识别',
                    '完善供应商关系分析'
                ]
            },
            {
                id: 'eval_005',
                modelName: '资产管理监督模型',
                category: '资产监督',
                accuracy: 0.72,
                recall: 0.68,
                f1Score: 0.70,
                overallScore: 70,
                status: 'average',
                evaluationTime: '2025-10-24 10:30:00',
                suggestions: [
                    '改进资产使用率计算方法',
                    '增加资产生命周期分析',
                    '优化闲置资产识别'
                ]
            },
            {
                id: 'eval_006',
                modelName: '招生录取监督模型',
                category: '招生监督',
                accuracy: 0.95,
                recall: 0.93,
                f1Score: 0.94,
                overallScore: 94,
                status: 'excellent',
                evaluationTime: '2025-10-24 09:15:00',
                suggestions: [
                    '保持当前优秀性能',
                    '定期更新招生政策规则',
                    '增强异常分数检测'
                ]
            },
            {
                id: 'eval_007',
                modelName: '八项规定监督模型',
                category: '作风监督',
                accuracy: 0.81,
                recall: 0.79,
                f1Score: 0.80,
                overallScore: 80,
                status: 'good',
                evaluationTime: '2025-10-24 08:00:00',
                suggestions: [
                    '增强公务接待费用检测',
                    '优化公车使用监控',
                    '完善津补贴发放规则'
                ]
            },
            {
                id: 'eval_008',
                modelName: '综合风险监督模型',
                category: '综合监督',
                accuracy: 0.65,
                recall: 0.62,
                f1Score: 0.63,
                overallScore: 63,
                status: 'poor',
                evaluationTime: '2025-10-23 16:30:00',
                suggestions: [
                    '重新设计特征工程',
                    '增加更多关联分析维度',
                    '优化图谱分析算法',
                    '扩充训练数据'
                ]
            }
        ];

        this.filteredData = [...this.evaluationData];
    }

    // 加载统计数据
    loadStatistics() {
        const totalModels = this.evaluationData.length;
        const excellentModels = this.evaluationData.filter(d => d.status === 'excellent').length;
        const needOptimization = this.evaluationData.filter(d => d.status === 'poor' || d.status === 'average').length;
        const lastEvaluation = this.evaluationData.length > 0 ? 
            new Date(this.evaluationData[0].evaluationTime).toLocaleDateString('zh-CN', {
                month: '2-digit',
                day: '2-digit'
            }) : '-';

        document.getElementById('totalModels').textContent = totalModels;
        document.getElementById('excellentModels').textContent = excellentModels;
        document.getElementById('needOptimization').textContent = needOptimization;
        document.getElementById('lastEvaluation').textContent = lastEvaluation;
    }

    // 渲染评估表格
    renderEvaluationTable() {
        const tbody = document.getElementById('evaluationTableBody');
        
        if (this.filteredData.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="8" style="text-align: center; padding: 40px; color: #9ca3af;">
                        <i class="fas fa-inbox" style="font-size: 48px; margin-bottom: 12px; display: block;"></i>
                        暂无评估数据
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = this.filteredData.map(item => {
            const statusClass = this.getStatusClass(item.status);
            
            return `
                <tr>
                    <td>
                        <strong>${item.modelName}</strong>
                    </td>
                    <td>
                        <span class="category-badge">${item.category}</span>
                    </td>
                    <td>${(item.accuracy * 100).toFixed(1)}%</td>
                    <td>${(item.recall * 100).toFixed(1)}%</td>
                    <td>${(item.f1Score * 100).toFixed(1)}%</td>
                    <td>
                        <span class="score-badge ${statusClass}">${item.overallScore}</span>
                    </td>
                    <td>${new Date(item.evaluationTime).toLocaleString('zh-CN')}</td>
                    <td>
                        <button class="btn btn-sm btn-primary" onclick="modelEvaluation.viewEvaluationDetail('${item.id}')">
                            <i class="fas fa-eye"></i> 详情
                        </button>
                    </td>
                </tr>
            `;
        }).join('');
    }

    getStatusClass(status) {
        const classMap = {
            'excellent': 'score-excellent',
            'good': 'score-good',
            'average': 'score-average',
            'poor': 'score-poor'
        };
        return classMap[status] || 'score-average';
    }

    // 应用筛选
    applyFilters() {
        const searchText = document.getElementById('searchInput').value.toLowerCase();
        const category = document.getElementById('categoryFilter').value;
        const status = document.getElementById('statusFilter').value;
        const time = document.getElementById('timeFilter').value;

        this.filteredData = this.evaluationData.filter(item => {
            let match = true;

            // 搜索过滤
            if (searchText && !item.modelName.toLowerCase().includes(searchText)) {
                match = false;
            }

            // 分类过滤
            if (category && item.category !== category) {
                match = false;
            }

            // 状态过滤
            if (status && item.status !== status) {
                match = false;
            }

            // 时间过滤
            if (time) {
                const itemDate = new Date(item.evaluationTime);
                const now = new Date();
                
                switch (time) {
                    case 'today':
                        match = match && itemDate.toDateString() === now.toDateString();
                        break;
                    case 'week':
                        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                        match = match && itemDate >= weekAgo;
                        break;
                    case 'month':
                        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                        match = match && itemDate >= monthAgo;
                        break;
                }
            }

            return match;
        });

        this.renderEvaluationTable();
    }

    // 查看评估详情
    viewEvaluationDetail(evaluationId) {
        const evaluation = this.evaluationData.find(e => e.id === evaluationId);
        if (!evaluation) return;

        document.getElementById('evaluationDetailTitle').textContent = evaluation.modelName + ' - 评估详情';
        
        const content = document.getElementById('evaluationDetailContent');
        content.innerHTML = `
            <div class="evaluation-metrics">
                <div class="metric-item">
                    <div class="metric-label">准确率</div>
                    <div class="metric-value">${(evaluation.accuracy * 100).toFixed(1)}%</div>
                </div>
                <div class="metric-item">
                    <div class="metric-label">召回率</div>
                    <div class="metric-value">${(evaluation.recall * 100).toFixed(1)}%</div>
                </div>
                <div class="metric-item">
                    <div class="metric-label">F1分数</div>
                    <div class="metric-value">${(evaluation.f1Score * 100).toFixed(1)}%</div>
                </div>
                <div class="metric-item">
                    <div class="metric-label">综合评分</div>
                    <div class="metric-value">${evaluation.overallScore}</div>
                </div>
            </div>
            
            <div class="evaluation-chart">
                <i class="fas fa-chart-bar" style="font-size: 48px; margin-right: 12px;"></i>
                性能趋势图（开发中）
            </div>
            
            <div class="optimization-suggestions">
                <h4>
                    <i class="fas fa-lightbulb" style="color: #f59e0b;"></i>
                    优化建议
                </h4>
                <ul>
                    ${evaluation.suggestions.map(s => `<li>${s}</li>`).join('')}
                </ul>
            </div>
        `;

        const modal = document.getElementById('evaluationDetailDialog');
        modal.style.display = 'flex';
        setTimeout(() => modal.classList.add('modal-show'), 10);
    }

    // 关闭评估详情
    closeEvaluationDetail() {
        const modal = document.getElementById('evaluationDetailDialog');
        modal.classList.remove('modal-show');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }

    // 开始评估
    startEvaluation() {
        showNotification('info', '正在启动模型评估...');
        
        // 模拟评估过程
        setTimeout(() => {
            showNotification('success', '评估完成！');
            this.refreshData();
        }, 2000);
    }

    // 刷新数据
    refreshData() {
        showNotification('info', '正在刷新数据...');
        
        // 模拟数据刷新
        setTimeout(() => {
            this.loadEvaluationData();
            this.loadStatistics();
            this.renderEvaluationTable();
            showNotification('success', '数据已刷新');
        }, 1000);
    }

    // 导出报告
    exportReport() {
        showNotification('info', '正在生成评估报告...');
        
        // 模拟报告生成
        setTimeout(() => {
            showNotification('success', '报告已生成并下载');
        }, 1500);
    }

    // 优化模型
    optimizeModel() {
        showNotification('info', '模型优化功能开发中');
        this.closeEvaluationDetail();
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    window.modelEvaluation = new ModelEvaluation();
});
