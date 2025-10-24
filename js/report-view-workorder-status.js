class WorkorderReport {
    constructor() {
        this.init();
    }
    init() {
        this.renderTable();
        this.initCharts();
    }
    renderTable() {
        const data = [
            { name: '计算机学院', total: 18, completed: 16, processing: 1, overdue: 1, avgDays: 5.2 },
            { name: '经济管理学院', total: 15, completed: 14, processing: 1, overdue: 0, avgDays: 4.8 },
            { name: '后勤管理处', total: 14, completed: 12, processing: 1, overdue: 1, avgDays: 6.5 },
            { name: '财务处', total: 12, completed: 11, processing: 1, overdue: 0, avgDays: 5.1 },
            { name: '科研处', total: 11, completed: 10, processing: 0, overdue: 1, avgDays: 6.8 }
        ];
        document.getElementById('detailTableBody').innerHTML = data.map(d => `
            <tr>
                <td><strong>${d.name}</strong></td>
                <td>${d.total}</td>
                <td>${d.completed}</td>
                <td>${d.processing}</td>
                <td>${d.overdue}</td>
                <td>${d.avgDays}</td>
                <td><strong>${((d.completed/d.total)*100).toFixed(1)}%</strong></td>
            </tr>
        `).join('');
    }
    initCharts() {
        const chart = echarts.init(document.getElementById('typeChart'));
        chart.setOption({
            tooltip: { trigger: 'item' },
            series: [{
                type: 'pie',
                radius: ['40%', '70%'],
                data: [
                    { name: '纪检核查', value: 45 },
                    { name: '审计核查', value: 38 },
                    { name: '联合核查', value: 32 },
                    { name: '专项核查', value: 19 }
                ]
            }],
            color: ['#1e40af', '#10b981', '#f59e0b', '#ef4444']
        });
    }
    refresh() { showNotification('success', '数据已刷新'); }
    exportExcel() { showNotification('success', 'Excel已导出'); }
    print() { window.print(); }
}
document.addEventListener('DOMContentLoaded', () => {
    window.workorderReport = new WorkorderReport();
});
