// 监督指挥中心 JavaScript

// 模拟数据
const mockData = {
    overview: [
        {
            label: '预警总量',
            value: 1247,
            unit: '条',
            trend: 'up',
            trendValue: '+12.5%',
            icon: 'fa-bell',
            color: '#ef4444'
        },
        {
            label: '问题数量',
            value: 328,
            unit: '个',
            trend: 'up',
            trendValue: '+8.3%',
            icon: 'fa-exclamation-triangle',
            color: '#f59e0b'
        },
        {
            label: '整改完成率',
            value: 87.5,
            unit: '%',
            trend: 'up',
            trendValue: '+3.2%',
            icon: 'fa-check-circle',
            color: '#10b981'
        },
        {
            label: '待处理事项',
            value: 156,
            unit: '项',
            trend: 'down',
            trendValue: '-5.1%',
            icon: 'fa-tasks',
            color: '#3b82f6'
        },
        {
            label: '涉及单位',
            value: 42,
            unit: '个',
            trend: 'neutral',
            trendValue: '0%',
            icon: 'fa-building',
            color: '#8b5cf6'
        },
        {
            label: '涉及金额',
            value: 2847,
            unit: '万元',
            trend: 'up',
            trendValue: '+15.7%',
            icon: 'fa-coins',
            color: '#f59e0b'
        }
    ],
    alertTrend: {
        dates: ['10-14', '10-15', '10-16', '10-17', '10-18', '10-19', '10-20'],
        high: [12, 15, 18, 14, 20, 17, 22],
        medium: [25, 28, 32, 30, 35, 33, 38],
        low: [45, 42, 48, 50, 52, 48, 55]
    },
    unitRisk: [
        { name: '信息学院', value: 85 },
        { name: '经管学院', value: 78 },
        { name: '机械学院', value: 72 },
        { name: '化工学院', value: 68 },
        { name: '外语学院', value: 65 },
        { name: '材料学院', value: 62 },
        { name: '土木学院', value: 58 },
        { name: '生命学院', value: 55 }
    ],
    problemType: [
        { name: '科研经费', value: 156 },
        { name: '基建采购', value: 98 },
        { name: '财务管理', value: 87 },
        { name: '招生录取', value: 65 },
        { name: '资产管理', value: 54 },
        { name: '其他', value: 42 }
    ],
    rectification: {
        completed: 287,
        inProgress: 156,
        overdue: 23,
        total: 466
    },
    realtimeAlerts: [
        { level: 'high', content: '信息学院科研经费报销异常，涉及金额15.8万元', source: '规则引擎', time: '10:25' },
        { level: 'medium', content: '经管学院采购项目存在拆分规避招标嫌疑', source: '智能分析', time: '10:18' },
        { level: 'high', content: '机械学院固定资产账实不符，差异率达12%', source: '数据比对', time: '10:12' },
        { level: 'low', content: '化工学院预算执行进度偏慢，执行率仅45%', source: '规则引擎', time: '10:05' },
        { level: 'medium', content: '外语学院三公经费支出接近预算红线', source: '实时监控', time: '09:58' },
        { level: 'high', content: '材料学院发现连号发票，疑似虚假报销', source: '智能识别', time: '09:45' },
        { level: 'low', content: '土木学院工程变更频率超过阈值', source: '规则引擎', time: '09:32' },
        { level: 'medium', content: '生命学院科研设备重复采购预警', source: '关联分析', time: '09:20' }
    ]
};

// 初始化页面
document.addEventListener('DOMContentLoaded', function() {
    initCurrentTime();
    renderOverviewCards();
    
    // 延迟初始化图表，确保容器已经渲染完成
    setTimeout(() => {
        initCharts();
    }, 100);
    
    startRealtimeAlerts();
});

// 更新当前时间
function initCurrentTime() {
    function updateTime() {
        const now = new Date();
        const timeStr = now.toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });
        document.getElementById('currentTime').textContent = timeStr;
    }
    updateTime();
    setInterval(updateTime, 1000);
}

// 渲染数据概览卡片
function renderOverviewCards() {
    const container = document.getElementById('overviewSection');
    
    mockData.overview.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = 'overview-card';
        card.style.animationDelay = `${index * 0.1}s`;
        
        const trendIcon = item.trend === 'up' ? 'fa-arrow-up' : 
                         item.trend === 'down' ? 'fa-arrow-down' : 'fa-minus';
        const trendClass = item.trend === 'up' ? 'trend-up' : 
                          item.trend === 'down' ? 'trend-down' : 'trend-neutral';
        
        card.innerHTML = `
            <div class="overview-left">
                <div class="overview-icon" style="background: ${item.color}20; color: ${item.color};">
                    <i class="fas ${item.icon}"></i>
                </div>
                <div class="overview-label">${item.label}</div>
            </div>
            <div class="overview-right">
                <div class="overview-value">
                    <span class="counter" data-target="${item.value}">0</span>
                    <span class="overview-unit">${item.unit}</span>
                </div>
                <div class="overview-trend ${trendClass}">
                    <i class="fas ${trendIcon}"></i>
                    <span>较昨日 ${item.trendValue}</span>
                </div>
            </div>
        `;
        
        container.appendChild(card);
    });
    
    // 启动数字动画
    setTimeout(() => {
        animateCounters();
    }, 300);
}

// 数字动画效果
function animateCounters() {
    const counters = document.querySelectorAll('.counter');
    
    counters.forEach(counter => {
        const target = parseFloat(counter.getAttribute('data-target'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        
        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                counter.textContent = target % 1 === 0 ? target : target.toFixed(1);
                clearInterval(timer);
            } else {
                counter.textContent = current % 1 === 0 ? Math.floor(current) : current.toFixed(1);
            }
        }, 16);
    });
}

// 初始化图表
function initCharts() {
    console.log('Initializing charts...');
    
    // 检查所有容器是否存在
    const containers = [
        'alertTrendChart',
        'unitRiskChart',
        'riskMapChart',
        'problemTypeChart',
        'rectificationChart'
    ];
    
    containers.forEach(id => {
        const el = document.getElementById(id);
        console.log(`Container ${id}:`, el ? `Found (${el.offsetWidth}x${el.offsetHeight})` : 'NOT FOUND');
    });
    
    initAlertTrendChart();
    initUnitRiskChart();
    initRiskMapChart();
    initProblemTypeChart();
    initRectificationChart();
    
    console.log('Charts initialized');
}

// 预警趋势折线图
function initAlertTrendChart() {
    const container = document.getElementById('alertTrendChart');
    if (!container) {
        console.error('Alert trend chart container not found');
        return;
    }
    const chart = echarts.init(container);
    
    const option = {
        backgroundColor: 'transparent',
        tooltip: {
            trigger: 'axis',
            backgroundColor: 'rgba(15, 23, 42, 0.95)',
            borderColor: 'rgba(59, 130, 246, 0.5)',
            borderWidth: 1,
            textStyle: { color: '#e2e8f0', fontSize: 13 },
            axisPointer: {
                type: 'cross',
                label: {
                    backgroundColor: 'rgba(59, 130, 246, 0.8)'
                }
            },
            formatter: function(params) {
                let result = `<div style="font-weight: bold; margin-bottom: 5px;">${params[0].axisValue}</div>`;
                params.forEach(item => {
                    result += `<div style="margin: 3px 0;">
                        <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${item.color};margin-right:5px;"></span>
                        ${item.seriesName}: <strong>${item.value}</strong>
                    </div>`;
                });
                const total = params.reduce((sum, item) => sum + item.value, 0);
                result += `<div style="margin-top: 5px; padding-top: 5px; border-top: 1px solid rgba(148, 163, 184, 0.3);">
                    总计: <strong>${total}</strong>
                </div>`;
                return result;
            }
        },
        legend: {
            data: ['高风险', '中风险', '低风险'],
            textStyle: { color: '#94a3b8', fontSize: 12 },
            top: 10,
            icon: 'circle'
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            top: '15%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: mockData.alertTrend.dates,
            axisLine: { lineStyle: { color: 'rgba(59, 130, 246, 0.3)' } },
            axisLabel: { color: '#94a3b8', fontSize: 11 },
            axisTick: { show: false }
        },
        yAxis: {
            type: 'value',
            axisLine: { show: false },
            axisLabel: { color: '#94a3b8', fontSize: 11 },
            splitLine: { lineStyle: { color: 'rgba(59, 130, 246, 0.1)', type: 'dashed' } }
        },
        series: [
            {
                name: '高风险',
                type: 'line',
                data: mockData.alertTrend.high,
                smooth: true,
                symbol: 'circle',
                symbolSize: 6,
                lineStyle: { color: '#ef4444', width: 3 },
                itemStyle: { 
                    color: '#ef4444',
                    borderWidth: 2,
                    borderColor: '#fff'
                },
                emphasis: {
                    scale: true,
                    focus: 'series'
                },
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: 'rgba(239, 68, 68, 0.4)' },
                        { offset: 1, color: 'rgba(239, 68, 68, 0.05)' }
                    ])
                }
            },
            {
                name: '中风险',
                type: 'line',
                data: mockData.alertTrend.medium,
                smooth: true,
                symbol: 'circle',
                symbolSize: 6,
                lineStyle: { color: '#f59e0b', width: 3 },
                itemStyle: { 
                    color: '#f59e0b',
                    borderWidth: 2,
                    borderColor: '#fff'
                },
                emphasis: {
                    scale: true,
                    focus: 'series'
                },
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: 'rgba(245, 158, 11, 0.4)' },
                        { offset: 1, color: 'rgba(245, 158, 11, 0.05)' }
                    ])
                }
            },
            {
                name: '低风险',
                type: 'line',
                data: mockData.alertTrend.low,
                smooth: true,
                symbol: 'circle',
                symbolSize: 6,
                lineStyle: { color: '#3b82f6', width: 3 },
                itemStyle: { 
                    color: '#3b82f6',
                    borderWidth: 2,
                    borderColor: '#fff'
                },
                emphasis: {
                    scale: true,
                    focus: 'series'
                },
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: 'rgba(59, 130, 246, 0.4)' },
                        { offset: 1, color: 'rgba(59, 130, 246, 0.05)' }
                    ])
                }
            }
        ],
        animation: true,
        animationDuration: 1500,
        animationEasing: 'cubicOut'
    };
    
    chart.setOption(option);
    window.addEventListener('resize', () => chart.resize());
}

// 单位风险排名柱状图
function initUnitRiskChart() {
    const container = document.getElementById('unitRiskChart');
    if (!container) {
        console.error('Unit risk chart container not found');
        return;
    }
    const chart = echarts.init(container);
    
    const option = {
        backgroundColor: 'transparent',
        tooltip: {
            trigger: 'axis',
            axisPointer: { 
                type: 'shadow',
                shadowStyle: {
                    color: 'rgba(59, 130, 246, 0.1)'
                }
            },
            backgroundColor: 'rgba(15, 23, 42, 0.95)',
            borderColor: 'rgba(59, 130, 246, 0.5)',
            borderWidth: 1,
            textStyle: { color: '#e2e8f0', fontSize: 13 },
            formatter: function(params) {
                const data = params[0];
                const rank = mockData.unitRisk.length - data.dataIndex;
                return `<div style="font-weight: bold; margin-bottom: 5px;">${data.name}</div>
                    <div>风险指数: <strong style="color: #ef4444;">${data.value}</strong></div>
                    <div>排名: 第 <strong>${rank}</strong> 位</div>`;
            }
        },
        grid: {
            left: '3%',
            right: '15%',
            bottom: '3%',
            top: '5%',
            containLabel: true
        },
        xAxis: {
            type: 'value',
            max: 100,
            axisLine: { show: false },
            axisLabel: { color: '#94a3b8', fontSize: 11 },
            splitLine: { lineStyle: { color: 'rgba(59, 130, 246, 0.1)', type: 'dashed' } },
            axisTick: { show: false }
        },
        yAxis: {
            type: 'category',
            data: mockData.unitRisk.map(item => item.name),
            axisLine: { lineStyle: { color: 'rgba(59, 130, 246, 0.3)' } },
            axisLabel: { 
                color: '#94a3b8',
                fontSize: 12,
                formatter: function(value) {
                    return value.length > 6 ? value.substring(0, 6) + '...' : value;
                }
            },
            axisTick: { show: false },
            inverse: true
        },
        series: [{
            type: 'bar',
            data: mockData.unitRisk.map((item, index) => ({
                value: item.value,
                itemStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                        { offset: 0, color: index < 3 ? '#ef4444' : index < 5 ? '#f59e0b' : '#3b82f6' },
                        { offset: 1, color: index < 3 ? '#f87171' : index < 5 ? '#fbbf24' : '#60a5fa' }
                    ]),
                    borderRadius: [0, 8, 8, 0],
                    shadowColor: 'rgba(0, 0, 0, 0.3)',
                    shadowBlur: 5
                }
            })),
            barWidth: '60%',
            label: {
                show: true,
                position: 'right',
                color: '#e2e8f0',
                fontSize: 12,
                fontWeight: 'bold',
                formatter: '{c}',
                distance: 5
            },
            emphasis: {
                itemStyle: {
                    shadowBlur: 10,
                    shadowColor: 'rgba(59, 130, 246, 0.5)'
                }
            }
        }],
        animation: true,
        animationDuration: 1500,
        animationEasing: 'elasticOut'
    };
    
    chart.setOption(option);
    window.addEventListener('resize', () => chart.resize());
    
    // 添加排名标记动画
    let highlightIndex = 0;
    setInterval(() => {
        chart.dispatchAction({
            type: 'highlight',
            seriesIndex: 0,
            dataIndex: highlightIndex
        });
        setTimeout(() => {
            chart.dispatchAction({
                type: 'downplay',
                seriesIndex: 0,
                dataIndex: highlightIndex
            });
        }, 1500);
        highlightIndex = (highlightIndex + 1) % mockData.unitRisk.length;
    }, 2000);
}

// 风险热力地图
function initRiskMapChart() {
    const container = document.getElementById('riskMapChart');
    if (!container) {
        console.error('Risk map chart container not found');
        return;
    }
    const chart = echarts.init(container);
    
    // 模拟校园地图数据
    const mapData = [
        { name: '信息学院', value: [0.2, 0.3, 85] },
        { name: '经管学院', value: [0.4, 0.5, 78] },
        { name: '机械学院', value: [0.6, 0.4, 72] },
        { name: '化工学院', value: [0.3, 0.7, 68] },
        { name: '外语学院', value: [0.7, 0.6, 65] },
        { name: '材料学院', value: [0.5, 0.8, 62] },
        { name: '土木学院', value: [0.8, 0.3, 58] },
        { name: '生命学院', value: [0.2, 0.6, 55] }
    ];
    
    const option = {
        backgroundColor: 'transparent',
        tooltip: {
            trigger: 'item',
            backgroundColor: 'rgba(15, 23, 42, 0.9)',
            borderColor: 'rgba(59, 130, 246, 0.5)',
            textStyle: { color: '#e2e8f0' },
            formatter: '{b}<br/>风险指数: {c}'
        },
        grid: {
            left: '5%',
            right: '5%',
            bottom: '5%',
            top: '5%',
            containLabel: true
        },
        xAxis: {
            type: 'value',
            show: false,
            min: 0,
            max: 1
        },
        yAxis: {
            type: 'value',
            show: false,
            min: 0,
            max: 1
        },
        visualMap: {
            min: 50,
            max: 90,
            calculable: true,
            orient: 'horizontal',
            left: 'center',
            bottom: '5%',
            textStyle: { color: '#94a3b8' },
            inRange: {
                color: ['#3b82f6', '#f59e0b', '#ef4444']
            }
        },
        series: [{
            type: 'scatter',
            symbolSize: function(val) {
                return val[2] * 0.8;
            },
            data: mapData,
            label: {
                show: true,
                formatter: '{b}',
                position: 'top',
                color: '#e2e8f0',
                fontSize: 12
            },
            itemStyle: {
                shadowBlur: 10,
                shadowColor: 'rgba(59, 130, 246, 0.5)',
                shadowOffsetY: 5
            }
        }]
    };
    
    chart.setOption(option);
    window.addEventListener('resize', () => chart.resize());
}

// 问题分类饼图
function initProblemTypeChart() {
    const container = document.getElementById('problemTypeChart');
    if (!container) {
        console.error('Problem type chart container not found');
        return;
    }
    const chart = echarts.init(container);
    
    const total = mockData.problemType.reduce((sum, item) => sum + item.value, 0);
    
    const option = {
        backgroundColor: 'transparent',
        tooltip: {
            trigger: 'item',
            backgroundColor: 'rgba(15, 23, 42, 0.95)',
            borderColor: 'rgba(59, 130, 246, 0.5)',
            borderWidth: 1,
            textStyle: { color: '#e2e8f0', fontSize: 13 },
            formatter: function(params) {
                return `<div style="font-weight: bold; margin-bottom: 5px;">${params.name}</div>
                    <div>数量: <strong>${params.value}</strong></div>
                    <div>占比: <strong>${params.percent}%</strong></div>`;
            }
        },
        legend: {
            orient: 'vertical',
            right: '8%',
            top: 'center',
            textStyle: { color: '#94a3b8', fontSize: 12 },
            itemGap: 12,
            formatter: function(name) {
                const item = mockData.problemType.find(d => d.name === name);
                return `${name}  ${item.value}`;
            }
        },
        series: [{
            type: 'pie',
            radius: ['45%', '75%'],
            center: ['35%', '50%'],
            avoidLabelOverlap: false,
            itemStyle: {
                borderRadius: 10,
                borderColor: 'rgba(15, 23, 42, 0.8)',
                borderWidth: 3,
                shadowBlur: 10,
                shadowColor: 'rgba(0, 0, 0, 0.3)'
            },
            label: {
                show: false
            },
            labelLine: {
                show: false
            },
            emphasis: {
                label: {
                    show: true,
                    fontSize: 16,
                    fontWeight: 'bold',
                    color: '#e2e8f0',
                    formatter: '{b}\n{d}%'
                },
                itemStyle: {
                    shadowBlur: 20,
                    shadowColor: 'rgba(59, 130, 246, 0.5)'
                },
                scale: true,
                scaleSize: 10
            },
            data: mockData.problemType,
            color: ['#ef4444', '#f59e0b', '#3b82f6', '#10b981', '#8b5cf6', '#ec4899'],
            animation: true,
            animationType: 'scale',
            animationEasing: 'elasticOut',
            animationDelay: function (idx) {
                return idx * 100;
            }
        }]
    };
    
    chart.setOption(option);
    window.addEventListener('resize', () => chart.resize());
}

// 整改进度环形图
function initRectificationChart() {
    const container = document.getElementById('rectificationChart');
    if (!container) {
        console.error('Rectification chart container not found');
        return;
    }
    const chart = echarts.init(container);
    
    const { completed, inProgress, overdue, total } = mockData.rectification;
    const completionRate = ((completed / total) * 100).toFixed(1);
    
    const option = {
        backgroundColor: 'transparent',
        tooltip: {
            trigger: 'item',
            backgroundColor: 'rgba(15, 23, 42, 0.95)',
            borderColor: 'rgba(59, 130, 246, 0.5)',
            borderWidth: 1,
            textStyle: { color: '#e2e8f0', fontSize: 13 },
            formatter: function(params) {
                const percent = ((params.value / total) * 100).toFixed(1);
                return `<div style="font-weight: bold; margin-bottom: 5px;">${params.name}</div>
                    <div>数量: <strong>${params.value}</strong></div>
                    <div>占比: <strong>${percent}%</strong></div>`;
            }
        },
        legend: {
            orient: 'vertical',
            right: '8%',
            top: 'center',
            textStyle: { color: '#94a3b8', fontSize: 12 },
            itemGap: 15,
            formatter: function(name) {
                const item = mockData.rectification;
                let value = 0;
                if (name === '已完成') value = item.completed;
                else if (name === '进行中') value = item.inProgress;
                else if (name === '已超期') value = item.overdue;
                return `${name}  ${value}`;
            }
        },
        series: [
            {
                type: 'pie',
                radius: ['50%', '75%'],
                center: ['35%', '50%'],
                avoidLabelOverlap: false,
                itemStyle: {
                    borderRadius: 10,
                    borderColor: 'rgba(15, 23, 42, 0.8)',
                    borderWidth: 3,
                    shadowBlur: 10,
                    shadowColor: 'rgba(0, 0, 0, 0.3)'
                },
                label: {
                    show: true,
                    position: 'center',
                    formatter: function() {
                        return `{a|${completionRate}%}\n{b|完成率}`;
                    },
                    rich: {
                        a: {
                            fontSize: 36,
                            fontWeight: 'bold',
                            color: '#10b981',
                            lineHeight: 45,
                            textShadowColor: 'rgba(16, 185, 129, 0.5)',
                            textShadowBlur: 10
                        },
                        b: {
                            fontSize: 14,
                            color: '#94a3b8',
                            lineHeight: 20
                        }
                    }
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: 36,
                        fontWeight: 'bold'
                    },
                    itemStyle: {
                        shadowBlur: 20,
                        shadowColor: 'rgba(59, 130, 246, 0.5)'
                    },
                    scale: true,
                    scaleSize: 5
                },
                data: [
                    { 
                        value: completed, 
                        name: '已完成', 
                        itemStyle: { 
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                { offset: 0, color: '#10b981' },
                                { offset: 1, color: '#34d399' }
                            ])
                        } 
                    },
                    { 
                        value: inProgress, 
                        name: '进行中', 
                        itemStyle: { 
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                { offset: 0, color: '#3b82f6' },
                                { offset: 1, color: '#60a5fa' }
                            ])
                        } 
                    },
                    { 
                        value: overdue, 
                        name: '已超期', 
                        itemStyle: { 
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                { offset: 0, color: '#ef4444' },
                                { offset: 1, color: '#f87171' }
                            ])
                        } 
                    }
                ],
                animation: true,
                animationType: 'scale',
                animationEasing: 'elasticOut',
                animationDelay: function (idx) {
                    return idx * 100;
                }
            }
        ]
    };
    
    chart.setOption(option);
    window.addEventListener('resize', () => chart.resize());
    
    // 添加数据更新动画
    setInterval(() => {
        // 模拟数据变化
        const newCompleted = completed + Math.floor(Math.random() * 3);
        const newInProgress = inProgress - Math.floor(Math.random() * 2);
        const newCompletionRate = ((newCompleted / total) * 100).toFixed(1);
        
        chart.setOption({
            series: [{
                label: {
                    formatter: function() {
                        return `{a|${newCompletionRate}%}\n{b|完成率}`;
                    }
                },
                data: [
                    { value: newCompleted, name: '已完成' },
                    { value: newInProgress, name: '进行中' },
                    { value: overdue, name: '已超期' }
                ]
            }]
        });
    }, 30000);
}

// 实时预警滚动
function startRealtimeAlerts() {
    const container = document.getElementById('alertScrollList');
    
    // 渲染预警列表
    function renderAlerts() {
        container.innerHTML = mockData.realtimeAlerts.map(alert => `
            <div class="alert-item ${alert.level}">
                <div class="alert-item-header">
                    <span class="alert-level ${alert.level}">
                        ${alert.level === 'high' ? '高风险' : alert.level === 'medium' ? '中风险' : '低风险'}
                    </span>
                    <span class="alert-time">${alert.time}</span>
                </div>
                <div class="alert-content">${alert.content}</div>
                <div class="alert-source">来源: ${alert.source}</div>
            </div>
        `).join('');
    }
    
    renderAlerts();
    
    // 每30秒刷新一次
    setInterval(() => {
        // 模拟新预警
        const newAlert = {
            level: ['high', 'medium', 'low'][Math.floor(Math.random() * 3)],
            content: '新预警：' + mockData.realtimeAlerts[Math.floor(Math.random() * mockData.realtimeAlerts.length)].content,
            source: '实时监控',
            time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
        };
        
        mockData.realtimeAlerts.unshift(newAlert);
        if (mockData.realtimeAlerts.length > 8) {
            mockData.realtimeAlerts.pop();
        }
        
        renderAlerts();
    }, 30000);
}
