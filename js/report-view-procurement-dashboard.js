/**
 * 采购招标监控仪表板
 */

class ProcurementDashboard {
    constructor() {
        this.init();
    }

    init() {
        this.loadData();
        this.renderRiskTable();
        this.initCharts();
    }

    // 加载数据
    loadData() {
        this.data = {
            risks: [
                { name: '实验室设备采购', amount: '¥850,000', type: '价格异常', level: 'high', time: '2025-10-24 14:30', status: '待核查' },
                { name: '办公家具采购', amount: '¥320,000', type: '围标串标', level: 'high', time: '2025-10-24 11:20', status: '核查中' },
                { name: '图书馆设备采购', amount: '¥680,000', type: '价格异常', level: 'medium', time: '2025-10-23 16:45', status: '待核查' },
                { name: '食堂设备采购', amount: '¥450,000', type: '供应商关联', level: 'medium', time: '2025-10-23 10:15', status: '核查中' },
                { name: '网络设备采购', amount: '¥1,200,000', type: '价格异常', level: 'high', time: '2025-10-22 14:50', status: '已处理' }
            ],
            amountTrend: [
                { month: '5月', amount: 2.2, projects: 98 },
                { month: '6月', amount: 2.5, projects: 105 },
                { month: '7月', amount: 2.3, projects: 102 },
                { month: '8月', amount: 2.6, projects: 112 },
                { month: '9月', amount: 2.4, projects: 108 },
                { month: '10月', amount: 2.8, projects: 128 }
            ],
            priceAnomaly: [
                { type: '高于市场价', count: 12 },
                { type: '低于市场价', count: 6 },
                { type: '价格波动大', count: 8 },
                { type: '品牌溢价', count: 5 }
            ],
            suppliers: [
                { name: '本地供应商', value: 45 },
                { name: '省内供应商', value: 38 },
                { name: '省外供应商', value: 28 },
                { name: '国外供应商', value: 17 }
            ]
        };
    }

    // 渲染风险表格
    renderRiskTable() {
        const tbody = document.getElementById('riskTableBody');
        tbody.innerHTML = this.data.risks.map(risk => {
            const levelClass = risk.level === 'high' ? 'danger' : risk.level === 'medium' ? 'warning' : 'info';
            const levelText = risk.level === 'high' ? '高风险' : risk.level === 'medium' ? '中风险' : '低风险';
            const statusClass = risk.status === '已处理' ? 'success' : risk.status === '核查中' ? 'warning' : 'info';
            
            return `
                <tr>
                    <td><strong>${risk.name}</strong></td>
                    <td>${risk.amount}</td>
                    <td>${risk.type}</td>
                    <td>
                        <span style="color: var(--color-${levelClass}); font-weight: 600;">
                            ${levelText}
                        </span>
                    </td>
                    <td>${risk.time}</td>
                    <td>
                        <span class="status-badge status-${statusClass.toLowerCase()}">
                            ${risk.status}
                        </span>
                    </td>
                </tr>
            `;
        }).join('');
    }

    // 初始化图表
    initCharts() {
        this.initAmountTrendChart();
        this.initPriceAnomalyChart();
        this.initSupplierChart();
    }

    // 采购金额趋势图表
    initAmountTrendChart() {
        const chart = echarts.init(document.getElementById('amountTrendChart'));
        const option = {
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: ['采购金额', '项目数量']
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: this.data.amountTrend.map(d => d.month)
            },
            yAxis: [
                {
                    type: 'value',
                    name: '金额(亿元)',
                    position: 'left'
                },
                {
                    type: 'value',
                    name: '项目数',
                    position: 'right'
                }
            ],
            series: [
                {
                    name: '采购金额',
                    type: 'line',
                    data: this.data.amountTrend.map(d => d.amount),
                    smooth: true,
                    itemStyle: { color: '#1e40af' },
                    areaStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            { offset: 0, color: 'rgba(30, 64, 175, 0.3)' },
                            { offset: 1, color: 'rgba(30, 64, 175, 0.05)' }
                        ])
                    }
                },
                {
                    name: '项目数量',
                    type: 'bar',
                    yAxisIndex: 1,
                    data: this.data.amountTrend.map(d => d.projects),
                    itemStyle: { color: '#10b981' }
                }
            ]
        };
        chart.setOption(option);
        window.addEventListener('resize', () => chart.resize());
    }

    // 价格异常分析图表
    initPriceAnomalyChart() {
        const chart = echarts.init(document.getElementById('priceAnomalyChart'));
        const option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: this.data.priceAnomaly.map(d => d.type)
            },
            yAxis: {
                type: 'value',
                name: '项目数量'
            },
            series: [
                {
                    name: '异常项目',
                    type: 'bar',
                    data: this.data.priceAnomaly.map(d => d.count),
                    itemStyle: {
                        color: function(params) {
                            const colors = ['#ef4444', '#f59e0b', '#3b82f6', '#10b981'];
                            return colors[params.dataIndex];
                        },
                        borderRadius: [4, 4, 0, 0]
                    },
                    label: {
                        show: true,
                        position: 'top',
                        formatter: '{c}项'
                    }
                }
            ]
        };
        chart.setOption(option);
        window.addEventListener('resize', () => chart.resize());
    }

    // 供应商分布图表
    initSupplierChart() {
        const chart = echarts.init(document.getElementById('supplierChart'));
        const option = {
            tooltip: {
                trigger: 'item',
                formatter: '{b}: {c}家 ({d}%)'
            },
            legend: {
                orient: 'vertical',
                right: '10%',
                top: 'center'
            },
            series: [
                {
                    name: '供应商分布',
                    type: 'pie',
                    radius: ['40%', '70%'],
                    avoidLabelOverlap: false,
                    itemStyle: {
                        borderRadius: 10,
                        borderColor: '#fff',
                        borderWidth: 2
                    },
                    label: {
                        show: true,
                        formatter: '{b}\n{c}家'
                    },
                    emphasis: {
                        label: {
                            show: true,
                            fontSize: 16,
                            fontWeight: 'bold'
                        }
                    },
                    data: this.data.suppliers
                }
            ],
            color: ['#1e40af', '#10b981', '#f59e0b', '#8b5cf6']
        };
        chart.setOption(option);
        window.addEventListener('resize', () => chart.resize());
    }

    // 切换周期
    changePeriod() {
        const period = document.getElementById('periodSelect').value;
        showNotification('info', '正在加载数据...');
        setTimeout(() => {
            showNotification('success', '数据已更新');
        }, 1000);
    }

    // 切换类型
    changeType() {
        const type = document.getElementById('typeSelect').value;
        if (type) {
            showNotification('info', '正在筛选数据...');
        } else {
            showNotification('info', '正在加载全部数据...');
        }
        setTimeout(() => {
            showNotification('success', '数据已更新');
        }, 1000);
    }

    // 刷新数据
    refresh() {
        showNotification('info', '正在刷新数据...');
        setTimeout(() => {
            this.loadData();
            this.renderRiskTable();
            this.initCharts();
            showNotification('success', '数据已刷新');
        }, 1000);
    }

    // 导出Excel
    exportExcel() {
        showNotification('success', 'Excel文件已生成并下载');
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    window.procurementDashboard = new ProcurementDashboard();
});
