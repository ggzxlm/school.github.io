/**
 * 线索处置效率分析报表
 */

class ClueEfficiencyReport {
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
                { name: '计算机学院', total: 12, completed: 11, processing: 1, overdue: 0, avgDays: 10.5 },
                { name: '经济管理学院', total: 10, completed: 9, processing: 1, overdue: 0, avgDays: 11.2 },
                { name: '后勤管理处', total: 9, completed: 7, processing: 1, overdue: 1, avgDays: 15.8 },
                { name: '财务处', total: 8, completed: 7, processing: 1, overdue: 0, avgDays: 12.3 },
                { name: '科研处', total: 8, completed: 7, processing: 0, overdue: 1, avgDays: 14.6 },
                { name: '教务处', total: 7, completed: 6, processing: 1, overdue: 0, avgDays: 11.8 },
                { name: '学生处', total: 7, completed: 6, processing: 0, overdue: 1, avgDays: 13.9 },
                { name: '人事处', total: 6, completed: 6, processing: 0, overdue: 0, avgDays: 9.5 },
                { name: '资产管理处', total: 6, completed: 5, processing: 0, overdue: 1, avgDays: 16.2 },
                { name: '招生办', total: 5, completed: 5, processing: 0, overdue: 0, avgDays: 10.8 },
                { name: '其他部门', total: 11, completed: 9, processing: 1, overdue: 1, avgDays: 13.5 }
            ],
            durationDistribution: [
                { range: '0-5天', count: 18 },
                { range: '6-10天', count: 25 },
                { range: '11-15天', count: 20 },
                { range: '16-20天', count: 10 },
                { range: '21-30天', count: 5 },
                { range: '30天以上', count: 0 }
            ],
            typeDistribution: [
                { name: '举报线索', value: 35, avgDays: 13.2 },
                { name: '巡查发现', value: 28, avgDays: 11.5 },
                { name: '审计发现', value: 26, avgDays: 12.8 }
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
                    <td><strong>${dept.avgDays}</strong></td>
                    <td><strong>${rate}%</strong></td>
                </tr>
            `;
        }).join('');
    }

    // 初始化图表
    initCharts() {
        this.initDurationChart();
        this.initDeptEfficiencyChart();
        this.initTypeChart();
    }

    // 处置时长分布图表
    initDurationChart() {
        const chart = echarts.init(document.getElementById('durationChart'));
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
                data: this.data.durationDistribution.map(d => d.range)
            },
            yAxis: {
                type: 'value',
                name: '线索数量'
            },
            series: [
                {
                    name: '线索数量',
                    type: 'bar',
                    data: this.data.durationDistribution.map(d => d.count),
                    itemStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            { offset: 0, color: '#1e40af' },
                            { offset: 1, color: '#3b82f6' }
                        ]),
                        borderRadius: [4, 4, 0, 0]
                    },
                    label: {
                        show: true,
                        position: 'top',
                        formatter: '{c}条'
                    }
                }
            ]
        };
        chart.setOption(option);
        window.addEventListener('resize', () => chart.resize());
    }

    // 部门效率对比图表
    initDeptEfficiencyChart() {
        const chart = echarts.init(document.getElementById('deptEfficiencyChart'));
        const top8 = this.data.departments.slice(0, 8);
        const option = {
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: ['线索总数', '平均处置时长(天)']
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: top8.map(d => d.name)
            },
            yAxis: [
                {
                    type: 'value',
                    name: '线索数量',
                    position: 'left'
                },
                {
                    type: 'value',
                    name: '平均时长(天)',
                    position: 'right'
                }
            ],
            series: [
                {
                    name: '线索总数',
                    type: 'bar',
                    data: top8.map(d => d.total),
                    itemStyle: {
                        color: '#3b82f6'
                    }
                },
                {
                    name: '平均处置时长(天)',
                    type: 'line',
                    yAxisIndex: 1,
                    data: top8.map(d => d.avgDays),
                    itemStyle: {
                        color: '#f59e0b'
                    },
                    smooth: true
                }
            ]
        };
        chart.setOption(option);
        window.addEventListener('resize', () => chart.resize());
    }

    // 线索类型分析图表
    initTypeChart() {
        const chart = echarts.init(document.getElementById('typeChart'));
        const option = {
            tooltip: {
                trigger: 'item',
                formatter: function(params) {
                    const data = params.data;
                    return `${params.name}<br/>数量: ${data.value}条<br/>平均时长: ${data.avgDays}天`;
                }
            },
            legend: {
                orient: 'vertical',
                right: '10%',
                top: 'center'
            },
            series: [
                {
                    name: '线索类型',
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
                            return `${params.name}\n${params.value}条`;
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

    // 切换周期
    changePeriod() {
        const period = document.getElementById('periodSelect').value;
        showNotification('info', `正在加载${period}的数据...`);
        setTimeout(() => {
            showNotification('success', '数据已更新');
        }, 1000);
    }

    // 切换类型
    changeType() {
        const type = document.getElementById('typeSelect').value;
        if (type) {
            showNotification('info', `正在筛选${type}的数据...`);
        } else {
            showNotification('info', '正在加载全部类型数据...');
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
    window.clueEfficiencyReport = new ClueEfficiencyReport();
});
