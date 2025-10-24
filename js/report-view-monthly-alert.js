/**
 * 月度预警统计报表
 */

class MonthlyAlertReport {
    constructor() {
        this.init();
    }

    init() {
        this.loadData();
        this.renderDetailTable();
        this.initCharts();
    }

    // 加载数据
    loadData() {
        this.data = {
            departments: [
                { name: '计算机学院', total: 28, high: 5, medium: 12, low: 11, handled: 25, pending: 3 },
                { name: '经济管理学院', total: 22, high: 3, medium: 10, low: 9, handled: 20, pending: 2 },
                { name: '后勤管理处', total: 18, high: 4, medium: 8, low: 6, handled: 16, pending: 2 },
                { name: '财务处', total: 15, high: 2, medium: 7, low: 6, handled: 14, pending: 1 },
                { name: '科研处', total: 14, high: 3, medium: 6, low: 5, handled: 13, pending: 1 },
                { name: '教务处', total: 12, high: 1, medium: 6, low: 5, handled: 11, pending: 1 },
                { name: '学生处', total: 11, high: 2, medium: 5, low: 4, handled: 10, pending: 1 },
                { name: '人事处', total: 10, high: 1, medium: 4, low: 5, handled: 9, pending: 1 },
                { name: '资产管理处', total: 9, high: 1, medium: 4, low: 4, handled: 8, pending: 1 },
                { name: '招生办', total: 8, high: 1, medium: 3, low: 4, handled: 7, pending: 1 },
                { name: '其他部门', total: 9, high: 0, medium: 4, low: 5, handled: 9, pending: 0 }
            ],
            categories: [
                { name: '科研监督', value: 35 },
                { name: '财务监督', value: 32 },
                { name: '采购监督', value: 28 },
                { name: '资产监督', value: 22 },
                { name: '招生监督', value: 18 },
                { name: '作风监督', value: 21 }
            ],
            trend: [
                { month: '5月', total: 128, high: 18, handled: 115 },
                { month: '6月', total: 135, high: 20, handled: 122 },
                { month: '7月', total: 142, high: 21, handled: 128 },
                { month: '8月', total: 138, high: 19, handled: 125 },
                { month: '9月', total: 139, high: 21, handled: 127 },
                { month: '10月', total: 156, high: 23, handled: 142 }
            ]
        };
    }

    // 渲染详细数据表格
    renderDetailTable() {
        const tbody = document.getElementById('detailTableBody');
        tbody.innerHTML = this.data.departments.map(dept => {
            const rate = ((dept.handled / dept.total) * 100).toFixed(1);
            return `
                <tr>
                    <td><strong>${dept.name}</strong></td>
                    <td>${dept.total}</td>
                    <td><span style="color: var(--color-danger); font-weight: 600;">${dept.high}</span></td>
                    <td><span style="color: var(--color-warning); font-weight: 600;">${dept.medium}</span></td>
                    <td><span style="color: var(--color-success); font-weight: 600;">${dept.low}</span></td>
                    <td>${dept.handled}</td>
                    <td>${dept.pending}</td>
                    <td><strong>${rate}%</strong></td>
                </tr>
            `;
        }).join('');
    }

    // 初始化图表
    initCharts() {
        this.initCategoryChart();
        this.initDeptRankChart();
        this.initTrendChart();
    }

    // 预警分类统计图表
    initCategoryChart() {
        const chart = echarts.init(document.getElementById('categoryChart'));
        const option = {
            tooltip: {
                trigger: 'item',
                formatter: '{b}: {c} ({d}%)'
            },
            legend: {
                orient: 'vertical',
                right: '10%',
                top: 'center'
            },
            series: [
                {
                    name: '预警分类',
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
                        formatter: '{b}\n{c}条'
                    },
                    emphasis: {
                        label: {
                            show: true,
                            fontSize: 16,
                            fontWeight: 'bold'
                        }
                    },
                    data: this.data.categories.map(cat => ({
                        name: cat.name,
                        value: cat.value
                    }))
                }
            ],
            color: ['#1e40af', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4']
        };
        chart.setOption(option);
        window.addEventListener('resize', () => chart.resize());
    }

    // 部门预警排名图表
    initDeptRankChart() {
        const chart = echarts.init(document.getElementById('deptRankChart'));
        const top10 = this.data.departments.slice(0, 10);
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
                type: 'value',
                name: '预警数量'
            },
            yAxis: {
                type: 'category',
                data: top10.map(d => d.name).reverse()
            },
            series: [
                {
                    name: '预警数量',
                    type: 'bar',
                    data: top10.map(d => d.total).reverse(),
                    itemStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                            { offset: 0, color: '#1e40af' },
                            { offset: 1, color: '#3b82f6' }
                        ]),
                        borderRadius: [0, 4, 4, 0]
                    },
                    label: {
                        show: true,
                        position: 'right',
                        formatter: '{c}条'
                    }
                }
            ]
        };
        chart.setOption(option);
        window.addEventListener('resize', () => chart.resize());
    }

    // 预警趋势分析图表
    initTrendChart() {
        const chart = echarts.init(document.getElementById('trendChart'));
        const option = {
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: ['预警总数', '高风险预警', '已处置']
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: this.data.trend.map(t => t.month)
            },
            yAxis: {
                type: 'value',
                name: '数量'
            },
            series: [
                {
                    name: '预警总数',
                    type: 'line',
                    data: this.data.trend.map(t => t.total),
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
                    name: '高风险预警',
                    type: 'line',
                    data: this.data.trend.map(t => t.high),
                    smooth: true,
                    itemStyle: { color: '#ef4444' }
                },
                {
                    name: '已处置',
                    type: 'line',
                    data: this.data.trend.map(t => t.handled),
                    smooth: true,
                    itemStyle: { color: '#10b981' }
                }
            ]
        };
        chart.setOption(option);
        window.addEventListener('resize', () => chart.resize());
    }

    // 切换月份
    changeMonth() {
        const month = document.getElementById('monthSelect').value;
        showNotification('info', `正在加载${month}的数据...`);
        setTimeout(() => {
            showNotification('success', '数据已更新');
        }, 1000);
    }

    // 切换部门
    changeDept() {
        const dept = document.getElementById('deptSelect').value;
        if (dept) {
            showNotification('info', `正在筛选${dept}的数据...`);
        } else {
            showNotification('info', '正在加载全部部门数据...');
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
            this.renderDetailTable();
            this.initCharts();
            showNotification('success', '数据已刷新');
        }, 1000);
    }

    // 导出Excel
    exportExcel() {
        showNotification('success', 'Excel文件已生成并下载');
    }

    // 导出PDF
    exportPDF() {
        showNotification('success', 'PDF文件已生成并下载');
    }

    // 打印
    print() {
        window.print();
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    window.monthlyAlertReport = new MonthlyAlertReport();
});
