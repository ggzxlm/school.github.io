// 数据分析页面脚本

// 模拟数据
const mockData = {
    indicatorData: [
        { department: '计算机学院', alerts: 45, clues: 23, completionRate: 85.5, avgDays: 12.3, overdueRate: 8.2 },
        { department: '经济管理学院', alerts: 38, clues: 19, completionRate: 92.1, avgDays: 9.8, overdueRate: 5.3 },
        { department: '外国语学院', alerts: 28, clues: 15, completionRate: 88.7, avgDays: 11.2, overdueRate: 6.7 },
        { department: '机械工程学院', alerts: 52, clues: 28, completionRate: 78.9, avgDays: 15.6, overdueRate: 12.1 },
        { department: '化学化工学院', alerts: 41, clues: 21, completionRate: 90.3, avgDays: 10.5, overdueRate: 4.8 },
        { department: '生命科学学院', alerts: 35, clues: 18, completionRate: 86.4, avgDays: 11.8, overdueRate: 7.5 },
        { department: '物理学院', alerts: 31, clues: 16, completionRate: 91.2, avgDays: 9.2, overdueRate: 5.1 },
        { department: '数学学院', alerts: 26, clues: 14, completionRate: 93.5, avgDays: 8.7, overdueRate: 3.9 }
    ],
    
    relationData: {
        nodes: [
            { id: 'person1', name: '张三', type: 'person', title: '采购部主任' },
            { id: 'person2', name: '李四', type: 'person', title: '项目负责人' },
            { id: 'person3', name: '王五', type: 'person', title: '供应商法人' },
            { id: 'company1', name: '科技有限公司', type: 'company', regCapital: '500万' },
            { id: 'company2', name: '工程建设公司', type: 'company', regCapital: '1000万' },
            { id: 'contract1', name: '设备采购合同', type: 'contract', amount: '120万' },
            { id: 'contract2', name: '工程建设合同', type: 'contract', amount: '800万' },
            { id: 'bid1', name: '实验室设备招标', type: 'bid', date: '2025-03-15' },
            { id: 'bid2', name: '教学楼建设招标', type: 'bid', date: '2025-05-20' }
        ],
        edges: [
            { source: 'person1', target: 'contract1', relation: '签订' },
            { source: 'person2', target: 'contract2', relation: '负责' },
            { source: 'person3', target: 'company1', relation: '法人' },
            { source: 'company1', target: 'contract1', relation: '中标' },
            { source: 'company2', target: 'contract2', relation: '承建' },
            { source: 'company1', target: 'bid1', relation: '参与' },
            { source: 'company2', target: 'bid2', relation: '参与' },
            { source: 'person1', target: 'person3', relation: '亲属关系', risk: true }
        ]
    }
};

// 当前图表实例
let currentChart = null;

// 页面初始化
document.addEventListener('DOMContentLoaded', function() {
    initToolbarSwitch();
    initIndicatorAnalysis();
    initTrendAnalysis();
    initCorrelationAnalysis();
    initKnowledgeGraph();
});

// 初始化工具栏切换
function initToolbarSwitch() {
    const toolbarItems = document.querySelectorAll('.toolbar-item');
    const analysisModules = document.querySelectorAll('.analysis-module');
    
    toolbarItems.forEach(item => {
        item.addEventListener('click', function() {
            const analysisType = this.dataset.analysisType;
            
            // 更新工具栏激活状态
            toolbarItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            
            // 切换分析模块
            analysisModules.forEach(module => {
                module.classList.remove('active');
            });
            
            const targetModule = document.getElementById(`${analysisType}-analysis`);
            if (targetModule) {
                targetModule.classList.add('active');
                
                // 切换到对应模块时，初始化或重新渲染图表
                setTimeout(() => {
                    if (analysisType === 'trend') {
                        if (!trendChartInitialized) {
                            updateTrendChart();
                            trendChartInitialized = true;
                        } else if (trendChart) {
                            trendChart.resize();
                        }
                    } else if (analysisType === 'correlation') {
                        // 关联分析图表已在初始化时渲染
                        const relationChart = echarts.getInstanceByDom(document.getElementById('relation-graph'));
                        if (relationChart) {
                            relationChart.resize();
                        }
                    } else if (analysisType === 'graph') {
                        if (!knowledgeGraphChart) {
                            updateKnowledgeGraph();
                        } else {
                            knowledgeGraphChart.resize();
                        }
                    } else if (analysisType === 'indicator' && currentChart) {
                        currentChart.resize();
                    }
                }, 100);
            }
        });
    });
}

// 初始化指标分析
function initIndicatorAnalysis() {
    // 维度切换
    const dimensionTags = document.querySelectorAll('.dimension-tag');
    dimensionTags.forEach(tag => {
        tag.addEventListener('click', function() {
            dimensionTags.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            updateIndicatorChart();
        });
    });
    
    // 图表类型切换
    const chartTypeBtns = document.querySelectorAll('.chart-type-btn');
    chartTypeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            chartTypeBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const chartType = this.dataset.chartType;
            updateIndicatorChart(chartType);
        });
    });
    
    // 初始化图表和表格
    updateIndicatorChart('bar');
    renderIndicatorTable();
}

// 更新指标图表
function updateIndicatorChart(chartType = 'bar') {
    const chartDom = document.getElementById('indicator-chart');
    
    if (currentChart) {
        currentChart.dispose();
    }
    
    currentChart = echarts.init(chartDom);
    
    const departments = mockData.indicatorData.map(d => d.department);
    const alerts = mockData.indicatorData.map(d => d.alerts);
    const clues = mockData.indicatorData.map(d => d.clues);
    
    let option;
    
    if (chartType === 'bar') {
        option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            legend: {
                data: ['预警数量', '线索数量']
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: departments,
                axisLabel: {
                    rotate: 30,
                    interval: 0
                }
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                    name: '预警数量',
                    type: 'bar',
                    data: alerts,
                    itemStyle: {
                        color: '#3b82f6'
                    }
                },
                {
                    name: '线索数量',
                    type: 'bar',
                    data: clues,
                    itemStyle: {
                        color: '#10b981'
                    }
                }
            ]
        };
    } else if (chartType === 'line') {
        option = {
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: ['预警数量', '线索数量']
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: departments,
                axisLabel: {
                    rotate: 30,
                    interval: 0
                }
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                    name: '预警数量',
                    type: 'line',
                    data: alerts,
                    smooth: true,
                    itemStyle: {
                        color: '#3b82f6'
                    }
                },
                {
                    name: '线索数量',
                    type: 'line',
                    data: clues,
                    smooth: true,
                    itemStyle: {
                        color: '#10b981'
                    }
                }
            ]
        };
    } else if (chartType === 'pie') {
        const pieData = mockData.indicatorData.map(d => ({
            name: d.department,
            value: d.alerts
        }));
        
        option = {
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b}: {c} ({d}%)'
            },
            legend: {
                orient: 'vertical',
                right: 10,
                top: 'center',
                data: departments
            },
            series: [
                {
                    name: '预警数量',
                    type: 'pie',
                    radius: ['40%', '70%'],
                    avoidLabelOverlap: false,
                    itemStyle: {
                        borderRadius: 10,
                        borderColor: '#fff',
                        borderWidth: 2
                    },
                    label: {
                        show: false,
                        position: 'center'
                    },
                    emphasis: {
                        label: {
                            show: true,
                            fontSize: 20,
                            fontWeight: 'bold'
                        }
                    },
                    labelLine: {
                        show: false
                    },
                    data: pieData
                }
            ]
        };
    }
    
    currentChart.setOption(option);
    
    // 响应式
    window.addEventListener('resize', function() {
        if (currentChart) {
            currentChart.resize();
        }
    });
}

// 渲染指标表格
function renderIndicatorTable() {
    const tbody = document.getElementById('indicator-table-body');
    
    const rows = mockData.indicatorData.map(data => `
        <tr>
            <td class="font-medium">${data.department}</td>
            <td>${data.alerts}</td>
            <td>${data.clues}</td>
            <td>
                <div class="flex items-center gap-2">
                    <div class="flex-1 bg-gray-200 rounded-full h-2">
                        <div class="bg-green-500 h-2 rounded-full" style="width: ${data.completionRate}%"></div>
                    </div>
                    <span class="text-sm">${data.completionRate}%</span>
                </div>
            </td>
            <td>${data.avgDays}</td>
            <td>
                <span class="px-2 py-1 rounded text-xs ${data.overdueRate > 10 ? 'bg-red-100 text-red-700' : data.overdueRate > 5 ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}">
                    ${data.overdueRate}%
                </span>
            </td>
        </tr>
    `).join('');
    
    tbody.innerHTML = rows;
}

// 初始化关联分析
function initCorrelationAnalysis() {
    renderRelationGraph();
    
    // 图谱工具栏事件
    const graphToolBtns = document.querySelectorAll('.graph-tool-btn');
    graphToolBtns.forEach((btn, index) => {
        btn.addEventListener('click', function() {
            // 这里可以添加图谱操作逻辑
            console.log('Graph tool clicked:', index);
        });
    });
}

// 渲染关系图谱
function renderRelationGraph() {
    const graphDom = document.getElementById('relation-graph');
    const relationChart = echarts.init(graphDom);
    
    // 准备节点数据
    const nodes = mockData.relationData.nodes.map(node => {
        let symbolSize = 50;
        let itemStyle = {};
        
        switch(node.type) {
            case 'person':
                itemStyle.color = '#3b82f6';
                break;
            case 'company':
                itemStyle.color = '#10b981';
                symbolSize = 60;
                break;
            case 'contract':
                itemStyle.color = '#f59e0b';
                symbolSize = 55;
                break;
            case 'bid':
                itemStyle.color = '#8b5cf6';
                symbolSize = 55;
                break;
        }
        
        return {
            id: node.id,
            name: node.name,
            symbolSize: symbolSize,
            itemStyle: itemStyle,
            label: {
                show: true
            },
            data: node
        };
    });
    
    // 准备边数据
    const links = mockData.relationData.edges.map(edge => ({
        source: edge.source,
        target: edge.target,
        label: {
            show: true,
            formatter: edge.relation
        },
        lineStyle: {
            color: edge.risk ? '#ef4444' : '#9ca3af',
            width: edge.risk ? 3 : 2,
            type: edge.risk ? 'dashed' : 'solid'
        }
    }));
    
    const option = {
        tooltip: {
            formatter: function(params) {
                if (params.dataType === 'node') {
                    const data = params.data.data;
                    let content = `<strong>${data.name}</strong><br/>`;
                    content += `类型: ${getTypeName(data.type)}<br/>`;
                    
                    if (data.title) content += `职务: ${data.title}<br/>`;
                    if (data.regCapital) content += `注册资本: ${data.regCapital}<br/>`;
                    if (data.amount) content += `金额: ${data.amount}<br/>`;
                    if (data.date) content += `日期: ${data.date}<br/>`;
                    
                    return content;
                } else if (params.dataType === 'edge') {
                    return `关系: ${params.data.label.formatter}`;
                }
            }
        },
        series: [
            {
                type: 'graph',
                layout: 'force',
                data: nodes,
                links: links,
                roam: true,
                label: {
                    position: 'bottom',
                    fontSize: 12
                },
                force: {
                    repulsion: 200,
                    edgeLength: 150
                },
                emphasis: {
                    focus: 'adjacency',
                    lineStyle: {
                        width: 4
                    }
                }
            }
        ]
    };
    
    relationChart.setOption(option);
    
    // 点击节点显示详情
    relationChart.on('click', function(params) {
        if (params.dataType === 'node') {
            showEntityDetail(params.data.data);
        }
    });
    
    // 响应式
    window.addEventListener('resize', function() {
        relationChart.resize();
    });
}

// 获取类型名称
function getTypeName(type) {
    const typeMap = {
        'person': '人员',
        'company': '企业',
        'contract': '合同',
        'bid': '投标'
    };
    return typeMap[type] || type;
}

// 显示实体详情
function showEntityDetail(entity) {
    const panel = document.getElementById('entity-detail-panel');
    const content = document.getElementById('entity-detail-content');
    
    let html = `
        <div class="detail-item">
            <div class="detail-label">名称</div>
            <div class="detail-value font-semibold">${entity.name}</div>
        </div>
        <div class="detail-item">
            <div class="detail-label">类型</div>
            <div class="detail-value">${getTypeName(entity.type)}</div>
        </div>
    `;
    
    if (entity.title) {
        html += `
            <div class="detail-item">
                <div class="detail-label">职务</div>
                <div class="detail-value">${entity.title}</div>
            </div>
        `;
    }
    
    if (entity.regCapital) {
        html += `
            <div class="detail-item">
                <div class="detail-label">注册资本</div>
                <div class="detail-value">${entity.regCapital}</div>
            </div>
        `;
    }
    
    if (entity.amount) {
        html += `
            <div class="detail-item">
                <div class="detail-label">合同金额</div>
                <div class="detail-value text-blue-600 font-semibold">${entity.amount}</div>
            </div>
        `;
    }
    
    if (entity.date) {
        html += `
            <div class="detail-item">
                <div class="detail-label">日期</div>
                <div class="detail-value">${entity.date}</div>
            </div>
        `;
    }
    
    content.innerHTML = html;
    panel.classList.remove('hidden');
}

// 关闭实体详情
function closeEntityDetail() {
    const panel = document.getElementById('entity-detail-panel');
    panel.classList.add('hidden');
}

// 趋势分析相关变量
let trendChart = null;
let trendChartInitialized = false;
const trendMockData = {
    alerts: [32, 38, 35, 42, 45, 61, 52, 48, 55, 58, 54, 60],
    clues: [18, 22, 20, 25, 28, 35, 30, 28, 32, 34, 31, 36],
    rectification: [15, 18, 16, 20, 22, 28, 25, 23, 26, 28, 25, 30],
    workorder: [25, 30, 28, 33, 36, 45, 40, 38, 42, 44, 41, 48],
    months: ['4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月', '1月', '2月', '3月']
};

// 初始化趋势分析
function initTrendAnalysis() {
    // 指标切换
    const metricTags = document.querySelectorAll('[data-trend-metric]');
    metricTags.forEach(tag => {
        tag.addEventListener('click', function() {
            metricTags.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            if (trendChartInitialized) {
                updateTrendChart();
            }
        });
    });
    
    // 粒度切换
    const granularityTags = document.querySelectorAll('[data-trend-granularity]');
    granularityTags.forEach(tag => {
        tag.addEventListener('click', function() {
            granularityTags.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            if (trendChartInitialized) {
                updateTrendChart();
            }
        });
    });
    
    // 复选框事件
    const showForecast = document.getElementById('show-forecast');
    const showAverage = document.getElementById('show-average');
    
    if (showForecast) {
        showForecast.addEventListener('change', function() {
            if (trendChartInitialized) {
                updateTrendChart();
            }
        });
    }
    
    if (showAverage) {
        showAverage.addEventListener('change', function() {
            if (trendChartInitialized) {
                updateTrendChart();
            }
        });
    }
    
    // 不在这里初始化图表，等到模块显示时再初始化
}

// 更新趋势图表
function updateTrendChart() {
    const chartDom = document.getElementById('trend-chart');
    
    if (trendChart) {
        trendChart.dispose();
    }
    
    trendChart = echarts.init(chartDom);
    
    // 获取当前选中的指标
    const activeMetric = document.querySelector('[data-trend-metric].active');
    const metric = activeMetric ? activeMetric.dataset.trendMetric : 'alerts';
    
    const metricNames = {
        alerts: '预警数量',
        clues: '线索数量',
        rectification: '整改任务',
        workorder: '工单数量'
    };
    
    const data = trendMockData[metric];
    const months = trendMockData.months;
    
    // 计算平均值
    const average = data.reduce((a, b) => a + b, 0) / data.length;
    const averageLine = new Array(data.length).fill(average);
    
    // 简单预测（线性回归）
    const forecast = [];
    const lastThree = data.slice(-3);
    const avgGrowth = (lastThree[2] - lastThree[0]) / 2;
    forecast.push(Math.round(data[data.length - 1] + avgGrowth));
    forecast.push(Math.round(data[data.length - 1] + avgGrowth * 2));
    
    const showForecast = document.getElementById('show-forecast')?.checked !== false;
    const showAverage = document.getElementById('show-average')?.checked !== false;
    
    const series = [
        {
            name: metricNames[metric],
            type: 'line',
            data: data,
            smooth: true,
            itemStyle: {
                color: '#3b82f6'
            },
            areaStyle: {
                color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [{
                        offset: 0, color: 'rgba(59, 130, 246, 0.3)'
                    }, {
                        offset: 1, color: 'rgba(59, 130, 246, 0.05)'
                    }]
                }
            }
        }
    ];
    
    if (showAverage) {
        series.push({
            name: '平均值',
            type: 'line',
            data: averageLine,
            lineStyle: {
                type: 'dashed',
                color: '#10b981'
            },
            itemStyle: {
                color: '#10b981'
            },
            symbol: 'none'
        });
    }
    
    if (showForecast) {
        series.push({
            name: '预测值',
            type: 'line',
            data: [...new Array(data.length - 1).fill(null), data[data.length - 1], ...forecast],
            lineStyle: {
                type: 'dashed',
                color: '#f59e0b'
            },
            itemStyle: {
                color: '#f59e0b'
            }
        });
    }
    
    const option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross'
            }
        },
        legend: {
            data: series.map(s => s.name)
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: [...months, '预测1', '预测2'],
            boundaryGap: false
        },
        yAxis: {
            type: 'value'
        },
        series: series
    };
    
    trendChart.setOption(option);
    
    // 响应式
    window.addEventListener('resize', function() {
        if (trendChart) {
            trendChart.resize();
        }
    });
}

// 知识图谱相关变量
let knowledgeGraphChart = null;
const knowledgeGraphData = {
    risk: {
        nodes: [
            { id: 'alert1', name: '高风险预警', type: 'alert', risk: 'high' },
            { id: 'dept1', name: '计算机学院', type: 'department', risk: 'medium' },
            { id: 'person1', name: '张三', type: 'person', risk: 'high' },
            { id: 'person2', name: '李四', type: 'person', risk: 'medium' },
            { id: 'contract1', name: '采购合同A', type: 'contract', risk: 'high' },
            { id: 'company1', name: '供应商X', type: 'company', risk: 'medium' },
            { id: 'process1', name: '采购流程', type: 'process', risk: 'low' },
            { id: 'clue1', name: '线索#001', type: 'clue', risk: 'high' }
        ],
        edges: [
            { source: 'alert1', target: 'dept1', relation: '涉及部门' },
            { source: 'alert1', target: 'person1', relation: '涉及人员' },
            { source: 'person1', target: 'dept1', relation: '所属部门' },
            { source: 'person1', target: 'contract1', relation: '签订合同' },
            { source: 'contract1', target: 'company1', relation: '合同方' },
            { source: 'person2', target: 'company1', relation: '关联关系', risk: true },
            { source: 'contract1', target: 'process1', relation: '执行流程' },
            { source: 'alert1', target: 'clue1', relation: '转化线索' }
        ]
    }
};

// 初始化知识图谱
function initKnowledgeGraph() {
    // 图谱类型切换
    const graphTypeTags = document.querySelectorAll('[data-graph-type]');
    graphTypeTags.forEach(tag => {
        tag.addEventListener('click', function() {
            graphTypeTags.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            updateKnowledgeGraph();
        });
    });
    
    // 深度滑块
    const depthSlider = document.getElementById('graph-depth-slider');
    const depthValue = document.getElementById('graph-depth-value');
    if (depthSlider && depthValue) {
        depthSlider.addEventListener('input', function() {
            depthValue.textContent = this.value + '层';
        });
    }
    
    // 不在这里初始化图谱，等到模块显示时再初始化
}

// 更新知识图谱
function updateKnowledgeGraph() {
    const chartDom = document.getElementById('knowledge-graph');
    
    if (knowledgeGraphChart) {
        knowledgeGraphChart.dispose();
    }
    
    knowledgeGraphChart = echarts.init(chartDom);
    
    const graphType = document.querySelector('[data-graph-type].active')?.dataset.graphType || 'risk';
    const graphData = knowledgeGraphData[graphType] || knowledgeGraphData.risk;
    
    // 准备节点数据
    const nodes = graphData.nodes.map(node => {
        let symbolSize = 50;
        let color = '#10b981';
        
        // 根据风险等级设置颜色
        if (node.risk === 'high') {
            color = '#ef4444';
            symbolSize = 60;
        } else if (node.risk === 'medium') {
            color = '#f59e0b';
            symbolSize = 55;
        } else if (node.risk === 'low') {
            color = '#3b82f6';
        }
        
        return {
            id: node.id,
            name: node.name,
            symbolSize: symbolSize,
            itemStyle: {
                color: color
            },
            label: {
                show: true,
                fontSize: 12
            },
            data: node
        };
    });
    
    // 准备边数据
    const links = graphData.edges.map(edge => ({
        source: edge.source,
        target: edge.target,
        label: {
            show: true,
            formatter: edge.relation,
            fontSize: 10
        },
        lineStyle: {
            color: edge.risk ? '#ef4444' : '#9ca3af',
            width: edge.risk ? 3 : 2,
            type: edge.risk ? 'dashed' : 'solid'
        }
    }));
    
    const option = {
        tooltip: {
            formatter: function(params) {
                if (params.dataType === 'node') {
                    const data = params.data.data;
                    return `<strong>${data.name}</strong><br/>类型: ${data.type}<br/>风险: ${data.risk || '正常'}`;
                } else if (params.dataType === 'edge') {
                    return `关系: ${params.data.label.formatter}`;
                }
            }
        },
        series: [
            {
                type: 'graph',
                layout: 'force',
                data: nodes,
                links: links,
                roam: true,
                label: {
                    position: 'bottom'
                },
                force: {
                    repulsion: 300,
                    edgeLength: 150,
                    gravity: 0.1
                },
                emphasis: {
                    focus: 'adjacency',
                    lineStyle: {
                        width: 5
                    }
                }
            }
        ]
    };
    
    knowledgeGraphChart.setOption(option);
    
    // 响应式
    window.addEventListener('resize', function() {
        if (knowledgeGraphChart) {
            knowledgeGraphChart.resize();
        }
    });
}

// 图谱工具函数
function zoomIn() {
    if (knowledgeGraphChart) {
        const option = knowledgeGraphChart.getOption();
        // ECharts图表缩放功能
        console.log('Zoom in');
    }
}

function zoomOut() {
    if (knowledgeGraphChart) {
        console.log('Zoom out');
    }
}

function fitView() {
    if (knowledgeGraphChart) {
        knowledgeGraphChart.resize();
    }
}

function relayout() {
    updateKnowledgeGraph();
}

function toggleLabels() {
    if (knowledgeGraphChart) {
        const option = knowledgeGraphChart.getOption();
        const showLabel = !option.series[0].label.show;
        knowledgeGraphChart.setOption({
            series: [{
                label: {
                    show: showLabel
                }
            }]
        });
    }
}

// 导出为全局函数供 HTML 调用
window.closeEntityDetail = closeEntityDetail;
window.updateTrendChart = updateTrendChart;
window.updateKnowledgeGraph = updateKnowledgeGraph;
window.zoomIn = zoomIn;
window.zoomOut = zoomOut;
window.fitView = fitView;
window.relayout = relayout;
window.toggleLabels = toggleLabels;
