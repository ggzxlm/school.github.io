class AdmissionReport {
    constructor() { this.init(); }
    init() {
        this.renderTable();
        this.initCharts();
    }
    renderTable() {
        const data = [
            { name: '计算机学院', plan: 450, admitted: 450, highest: 625, lowest: 588, avg: 602 },
            { name: '经济管理学院', plan: 380, admitted: 380, highest: 618, lowest: 582, avg: 595 },
            { name: '机械工程学院', plan: 420, admitted: 418, highest: 612, lowest: 575, avg: 589 },
            { name: '化学学院', plan: 320, admitted: 320, highest: 608, lowest: 570, avg: 585 },
            { name: '物理学院', plan: 280, admitted: 280, highest: 615, lowest: 578, avg: 592 },
            { name: '外国语学院', plan: 250, admitted: 248, highest: 605, lowest: 568, avg: 583 }
        ];
        document.getElementById('detailTableBody').innerHTML = data.map(d => `
            <tr>
                <td><strong>${d.name}</strong></td>
                <td>${d.plan}</td>
                <td>${d.admitted}</td>
                <td><strong>${((d.admitted/d.plan)*100).toFixed(1)}%</strong></td>
                <td><span style="color: var(--color-success);">${d.highest}</span></td>
                <td><span style="color: var(--color-warning);">${d.lowest}</span></td>
                <td><strong>${d.avg}</strong></td>
            </tr>
        `).join('');
    }
    initCharts() {
        const collegeChart = echarts.init(document.getElementById('collegeChart'));
        collegeChart.setOption({
            tooltip: { trigger: 'axis' },
            legend: { data: ['计划数', '录取数'] },
            xAxis: { type: 'category', data: ['计算机', '经管', '机械', '化学', '物理', '外语'] },
            yAxis: { type: 'value' },
            series: [
                { name: '计划数', type: 'bar', data: [450, 380, 420, 320, 280, 250], itemStyle: { color: '#3b82f6' } },
                { name: '录取数', type: 'bar', data: [450, 380, 418, 320, 280, 248], itemStyle: { color: '#10b981' } }
            ]
        });

        const scoreTrendChart = echarts.init(document.getElementById('scoreTrendChart'));
        scoreTrendChart.setOption({
            tooltip: { trigger: 'axis' },
            legend: { data: ['最高分', '最低分', '平均分'] },
            xAxis: { type: 'category', data: ['2020', '2021', '2022', '2023', '2024', '2025'] },
            yAxis: { type: 'value', min: 550, max: 630 },
            series: [
                { name: '最高分', type: 'line', data: [615, 618, 620, 622, 623, 625], smooth: true, itemStyle: { color: '#10b981' } },
                { name: '最低分', type: 'line', data: [565, 568, 570, 572, 575, 578], smooth: true, itemStyle: { color: '#f59e0b' } },
                { name: '平均分', type: 'line', data: [585, 588, 590, 592, 595, 598], smooth: true, itemStyle: { color: '#1e40af' } }
            ]
        });

        const sourceChart = echarts.init(document.getElementById('sourceChart'));
        sourceChart.setOption({
            tooltip: { trigger: 'item' },
            series: [{
                type: 'pie',
                radius: ['40%', '70%'],
                data: [
                    { name: '本省', value: 4850 },
                    { name: '华东地区', value: 1520 },
                    { name: '华北地区', value: 980 },
                    { name: '华南地区', value: 650 },
                    { name: '西部地区', value: 520 }
                ],
                label: { formatter: '{b}\n{c}人' }
            }],
            color: ['#1e40af', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444']
        });
    }
    refresh() { showNotification('success', '数据已刷新'); }
    exportExcel() { showNotification('success', 'Excel已导出'); }
    print() { window.print(); }
}
document.addEventListener('DOMContentLoaded', () => {
    window.admissionReport = new AdmissionReport();
});
