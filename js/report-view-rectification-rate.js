/**
 * 整改完成率趋势图报表
 */

class RectificationRateReport {
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
                { name: '计算机学院', total: 28, completed: 27, processing: 1, overdue: 0, avgDays: 8.5 },
                { name: '经济管理学院', total: 25, completed: 24, processing: 1, overdue: 0, avgDays: 9.2 },
                { name: '后勤管理处', total: 22, completed: 20, processing: 1, overdue: 1, avgDays: 11.8 },
                { name: '财务处', total: 20, completed: 19, processing: 1, overdue: 0, avgDays: 8.9 },
                { name: '科研处', total: 19, completed: 18, processing: 0, overdue: 1, avgDays: 10.3 },
                { name: '教务处', total: 18, completed: 17, processing: 1, overdue: 0, avgDays: 9.5 },
                { name: '学生处', total: 17, completed: 16, processing: 0, overdue: 1, avgDays: 10.8 },
                { name: '人事处', total: 16, completed: 16, processing: 0, overdue: 0, avgDays: 7.8 },
                { name: '资产管理处', total: 15, completed: 13, processing: 1, overdue: 1, avgDays: 12.5 },
                { name: '招生办', total: 14, completed: 14, processing: 0, overdue: 0, avgDays: 8.2 },
                { name: '其他部门', total: 51, completed: 44, processing: 6, overdue: 1, avgDays: 10.1 }
            ],
            monthlyTrend: [
                { month: '1月', total: 20, completed: 18, rate: 90.0 },
                { month: '2月', total: 18, completed: 17, rate: 94.4 },
                { month: '3月', total: 22, completed: 20, rate: 90.9 },
                { month: '4月', total: 25, completed: 23, rate: 92.0 },
                { month: '5月', total: 24, completed: 22, rate: 91.7 },
                { month: '6月', total: 26, completed: 24, rate: 92.3 },
                { month: '7月', total: 23, completed: 22, rate: 95.7 },
                { month: '8月', total: 21, completed: 20, rate: 95.2 },
                { month: '9月', total: 28, completed: 26, rate: 92.9 },
                { month: '10月', total: 38, completed: 36, rate: 94.7 }
            ],
            typeDistribution: [
                { name: '预警整改', value: 98, rate: 94.9 },
                { name: '线索整改', value: 76, rate: 92.1 },
                { name: '审计整改', value: 71, rate: 91.5 }
            ]
        };
    }

    // 渲染详细数据表格
    renderDetailTable() {
        const tbody = document.getElementById('detailTableBody');
        tbody.innerHTML = this.data.departments.map(dept => {
            const rate = ((dept.completed / dept.total) * 100).toFixed(1);
            return `
                <tr>
                    <td><strong>${dept.name}</strong></td>
                    <td>${dept.total}</td>
                    <td><span style="color: var(--color-success); font-weight: 600;">${dept.completed}</span></td>
                    <td>${dept.processing}</td>
                    <td><span style="color: var(--color-danger); font-weight: 600;">${dept.overdue}</span></td>
                    <td><strong>${rate}%</strong></td>
                    <td>${dept.avgDays}</td>
                </tr>
            `;
        }).join('');
    }

    // 初始化图表
    initCharts() {
        this.initTrendChart();
        this.initDeptCompareChart();
        this.initTypeChart();
    }

    // 月度完成率趋势图表
    initTrendChart() {
        const chart = echarts.init(document.getElementById('trendChart'));
        const option = {
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: ['任务总数', '已完成', '完成率']
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
                data: this.data.monthlyTrend.map(t => t.month)
            },
            yAxis: [
                {
                    type: 'value',
                    name: '任务数量',
                    position: 'left'
                },
                {
                    type: 'value',
                    name: '完成率(%)',
                    position: 'right',
                    min: 85,
                    max: 100
                }
            ],
            series: [
                {
                    name: '任务总数',
                    type: 'line',
                    data: this.data.monthlyTrend.map(t => t.total),
                    smooth: true,
                    itemStyle: { color: '#3b82f6' }
                },
                {
                    name: '已完成',
                    type: 'line',
                    data: this.data.monthlyTrend.map(t => t.completed),
                    smooth: true,
                    itemStyle: { color: '#10b981' }
                },
                {
                    name: '完成率',
                    type: 'line',
                    yAxisIndex: 1,
                    data: this.data.monthlyTrend.map(t => t.rate),
                    smooth: true,
                    itemStyle: { color: '#f59e0b' },
                    areaStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            { offset: 0, color: 'rgba(245, 158, 11, 0.3)' },
                            { offset: 1, color: 'rgba(245, 158, 11, 0.05)' }
                        ])
                    }
                }
            ]
        };
        chart.setOption(option);
        window.addEventListener('resize', () => chart.resize());
    }

    // 部门完成率对比图表
    initDeptCompareChart() {
        const chart = echarts.init(document.getElementById('deptCompareChart'));
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
                name: '完成率(%)',
                min: 80,
                max: 100
            },
            yAxis: {
                type: 'category',
                data: top10.map(d => d.name).reverse()
            },
            series: [
                {
                    name: '完成率',
                    type: 'bar',
                    data: top10.map(d => ((d.completed / d.total) * 100).toFixed(1)).reverse(),
                    itemStyle: {
                        color: function(params) {
                            const value = params.value;
                            if (value >= 95) return '#10b981';
                            if (value >= 90) return '#3b82f6';
                            if (value >= 85) return '#f59e0b';
                            return '#ef4444';
                        },
                        borderRadius: [0, 4, 4, 0]
                    },
                    label: {
                        show: true,
                        position: 'right',
                        formatter: '{c}%'
                    }
                }
            ]
        };
        chart.setOption(option);
        window.addEventListener('resize', () => chart.resize());
    }

    // 整改类型分布图表
    initTypeChart() {
        const chart = echarts.init(document.getElementById('typeChart'));
        const option = {
            tooltip: {
                trigger: 'item',
                formatter: function(params) {
                    const data = params.data;
                    return `${params.name}<br/>数量: ${data.value}条<br/>完成率: ${data.rate}%`;
                }
            },
            legend: {
                orient: 'vertical',
                right: '10%',
                top: 'center'
            },
            series: [
                {
                    name: '整改类型',
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
                        formatter: function(params) {
                            return `${params.name}\n${params.value}条\n${params.data.rate}%`;
                        }
                    },
                    emphasis: {
                        label: {
                            show: true,
                            fontSize: 16,
                            fontWeight: 'bold'
                        }
                    },
                    data: this.data.typeDistribution
                }
            ],
            color: ['#1e40af', '#10b981', '#f59e0b']
        };
        chart.setOption(option);
        window.addEventListener('resize', () => chart.resize());
    }

    // 切换年份
    changeYear() {
        const year = document.getElementById('yearSelect').value;
        showNotification('info', `正在加载${year}年的数据...`);
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
    window.rectificationRateReport = new RectificationRateReport();
});
