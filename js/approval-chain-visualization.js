/**
 * 审批链可视化服务
 * Approval Chain Visualization Service
 * 
 * 功能:
 * - 生成时间线图表
 * - 展示审批记录清单
 * - 支持审批链导出
 */

class ApprovalChainVisualization {
    constructor() {
        this.timelineChart = null;
        this.currentChain = null;
    }

    /**
     * 渲染时间线图表
     * @param {string} containerId - 容器ID
     * @param {Object} chain - 审批链数据
     */
    renderTimeline(containerId, chain) {
        this.currentChain = chain;
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`容器 ${containerId} 不存在`);
            return;
        }

        // 使用ECharts渲染时间线
        if (!this.timelineChart) {
            this.timelineChart = echarts.init(container);
        }

        const option = this.generateTimelineOption(chain);
        this.timelineChart.setOption(option);

        // 响应式调整
        window.addEventListener('resize', () => {
            this.timelineChart.resize();
        });
    }

    /**
     * 生成时间线图表配置
     * @param {Object} chain - 审批链数据
     * @returns {Object} ECharts配置
     */
    generateTimelineOption(chain) {
        const nodes = chain.nodes.filter(n => n.approvalTime);
        
        // 准备数据
        const categories = ['审批流程'];
        const data = nodes.map((node, index) => {
            const status = this.getNodeStatus(node);
            return {
                name: node.nodeName,
                value: [
                    0, // category index
                    new Date(node.approvalTime).getTime(),
                    new Date(node.approvalTime).getTime() + (node.duration || 0) * 60000,
                    node.duration || 0
                ],
                itemStyle: {
                    color: this.getNodeColor(node, status)
                },
                tooltip: {
                    formatter: () => {
                        return `
                            <div style="padding: 10px;">
                                <div style="font-weight: bold; margin-bottom: 5px;">${node.nodeName}</div>
                                <div>审批人: ${node.approver || '待审批'}</div>
                                <div>角色: ${node.approverRole}</div>
                                <div>时间: ${node.approvalTime ? new Date(node.approvalTime).toLocaleString('zh-CN') : '-'}</div>
                                <div>结果: ${this.getResultText(node.result)}</div>
                                <div>耗时: ${node.duration ? this.formatDuration(node.duration) : '-'}</div>
                                ${node.opinion ? `<div>意见: ${node.opinion}</div>` : ''}
                            </div>
                        `;
                    }
                }
            };
        });

        return {
            title: {
                text: `审批流程时间线 - ${chain.businessTitle}`,
                left: 'center'
            },
            tooltip: {
                trigger: 'item'
            },
            grid: {
                left: '10%',
                right: '10%',
                top: '15%',
                bottom: '15%'
            },
            xAxis: {
                type: 'time',
                axisLabel: {
                    formatter: (value) => {
                        const date = new Date(value);
                        return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
                    }
                }
            },
            yAxis: {
                type: 'category',
                data: categories,
                axisLabel: {
                    show: false
                }
            },
            series: [
                {
                    type: 'custom',
                    renderItem: (params, api) => {
                        const categoryIndex = api.value(0);
                        const start = api.coord([api.value(1), categoryIndex]);
                        const end = api.coord([api.value(2), categoryIndex]);
                        const height = api.size([0, 1])[1] * 0.6;
                        
                        const rectShape = echarts.graphic.clipRectByRect(
                            {
                                x: start[0],
                                y: start[1] - height / 2,
                                width: end[0] - start[0],
                                height: height
                            },
                            {
                                x: params.coordSys.x,
                                y: params.coordSys.y,
                                width: params.coordSys.width,
                                height: params.coordSys.height
                            }
                        );

                        return rectShape && {
                            type: 'rect',
                            transition: ['shape'],
                            shape: rectShape,
                            style: api.style()
                        };
                    },
                    encode: {
                        x: [1, 2],
                        y: 0
                    },
                    data: data
                }
            ]
        };
    }

    /**
     * 渲染审批记录清单
     * @param {string} containerId - 容器ID
     * @param {Object} chain - 审批链数据
     */
    renderRecordList(containerId, chain) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`容器 ${containerId} 不存在`);
            return;
        }

        let html = `
            <div class="approval-record-list">
                <div class="record-header">
                    <h3>审批记录清单</h3>
                    <div class="record-summary">
                        <span>业务编号: ${chain.businessId}</span>
                        <span>业务类型: ${chain.businessType}</span>
                        <span>申请人: ${chain.applicant}</span>
                        <span>状态: ${this.getStatusBadge(chain.status)}</span>
                    </div>
                </div>
                <div class="record-table">
                    <table>
                        <thead>
                            <tr>
                                <th>序号</th>
                                <th>节点名称</th>
                                <th>审批人</th>
                                <th>审批角色</th>
                                <th>审批时间</th>
                                <th>审批结果</th>
                                <th>耗时</th>
                                <th>审批意见</th>
                            </tr>
                        </thead>
                        <tbody>
        `;

        chain.nodes.forEach((node, index) => {
            const status = this.getNodeStatus(node);
            const rowClass = status === 'anomaly' ? 'anomaly-row' : '';
            
            html += `
                <tr class="${rowClass}">
                    <td>${index + 1}</td>
                    <td>${node.nodeName}</td>
                    <td>${node.approver || '<span class="pending-text">待审批</span>'}</td>
                    <td>${node.approverRole}</td>
                    <td>${node.approvalTime ? new Date(node.approvalTime).toLocaleString('zh-CN') : '-'}</td>
                    <td>${this.getResultBadge(node.result)}</td>
                    <td>${node.duration ? this.formatDuration(node.duration) : '-'}</td>
                    <td class="opinion-cell">${node.opinion || '-'}</td>
                </tr>
            `;
        });

        html += `
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        container.innerHTML = html;
    }

    /**
     * 渲染流程图
     * @param {string} containerId - 容器ID
     * @param {Object} chain - 审批链数据
     */
    renderFlowChart(containerId, chain) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`容器 ${containerId} 不存在`);
            return;
        }

        const chart = echarts.init(container);
        const option = this.generateFlowChartOption(chain);
        chart.setOption(option);

        window.addEventListener('resize', () => {
            chart.resize();
        });
    }

    /**
     * 生成流程图配置
     * @param {Object} chain - 审批链数据
     * @returns {Object} ECharts配置
     */
    generateFlowChartOption(chain) {
        const nodes = chain.nodes.map((node, index) => {
            const status = this.getNodeStatus(node);
            return {
                id: node.id,
                name: node.nodeName,
                x: 100 + (index % 3) * 300,
                y: 100 + Math.floor(index / 3) * 150,
                symbolSize: 80,
                itemStyle: {
                    color: this.getNodeColor(node, status)
                },
                label: {
                    show: true,
                    formatter: `{b}\n${node.approver || '待审批'}`
                },
                tooltip: {
                    formatter: () => {
                        return `
                            <div style="padding: 10px;">
                                <div style="font-weight: bold;">${node.nodeName}</div>
                                <div>审批人: ${node.approver || '待审批'}</div>
                                <div>结果: ${this.getResultText(node.result)}</div>
                                ${node.duration ? `<div>耗时: ${this.formatDuration(node.duration)}</div>` : ''}
                            </div>
                        `;
                    }
                }
            };
        });

        const links = [];
        for (let i = 0; i < chain.nodes.length - 1; i++) {
            links.push({
                source: chain.nodes[i].id,
                target: chain.nodes[i + 1].id,
                lineStyle: {
                    curveness: 0.2
                }
            });
        }

        return {
            title: {
                text: `审批流程图 - ${chain.businessTitle}`,
                left: 'center'
            },
            tooltip: {},
            series: [
                {
                    type: 'graph',
                    layout: 'none',
                    symbolSize: 80,
                    roam: true,
                    label: {
                        show: true,
                        fontSize: 12
                    },
                    edgeSymbol: ['none', 'arrow'],
                    edgeSymbolSize: [0, 10],
                    data: nodes,
                    links: links,
                    lineStyle: {
                        opacity: 0.9,
                        width: 2,
                        curveness: 0
                    }
                }
            ]
        };
    }

    /**
     * 导出审批链数据
     * @param {Object} chain - 审批链数据
     * @param {string} format - 导出格式 (json, csv, excel)
     * @returns {Promise<Blob>} 导出文件
     */
    async exportChain(chain, format = 'json') {
        if (format === 'json') {
            return this.exportAsJSON(chain);
        } else if (format === 'csv') {
            return this.exportAsCSV(chain);
        } else if (format === 'excel') {
            return this.exportAsExcel(chain);
        }
        throw new Error(`不支持的导出格式: ${format}`);
    }

    /**
     * 导出为JSON
     * @param {Object} chain - 审批链数据
     * @returns {Blob} JSON文件
     */
    exportAsJSON(chain) {
        const data = JSON.stringify(chain, null, 2);
        return new Blob([data], { type: 'application/json' });
    }

    /**
     * 导出为CSV
     * @param {Object} chain - 审批链数据
     * @returns {Blob} CSV文件
     */
    exportAsCSV(chain) {
        const headers = ['序号', '节点名称', '审批人', '审批角色', '审批时间', '审批结果', '耗时(分钟)', '审批意见'];
        const rows = chain.nodes.map((node, index) => [
            index + 1,
            node.nodeName,
            node.approver || '待审批',
            node.approverRole,
            node.approvalTime ? new Date(node.approvalTime).toLocaleString('zh-CN') : '-',
            this.getResultText(node.result),
            node.duration || '-',
            node.opinion || '-'
        ]);

        let csv = headers.join(',') + '\n';
        rows.forEach(row => {
            csv += row.map(cell => `"${cell}"`).join(',') + '\n';
        });

        // 添加BOM以支持Excel正确显示中文
        const BOM = '\uFEFF';
        return new Blob([BOM + csv], { type: 'text/csv;charset=utf-8' });
    }

    /**
     * 导出为Excel(简化版,实际应使用xlsx库)
     * @param {Object} chain - 审批链数据
     * @returns {Blob} Excel文件
     */
    exportAsExcel(chain) {
        // 这里简化处理,实际应使用xlsx库
        return this.exportAsCSV(chain);
    }

    /**
     * 下载文件
     * @param {Blob} blob - 文件内容
     * @param {string} filename - 文件名
     */
    downloadFile(blob, filename) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    /**
     * 获取节点状态
     * @param {Object} node - 节点数据
     * @returns {string} 状态
     */
    getNodeStatus(node) {
        if (node.skipped) return 'skipped';
        if (node.pending) return 'pending';
        if (node.result === 'REJECTED') return 'rejected';
        if (node.result === 'APPROVED') return 'approved';
        if (node.duration && node.duration > 4320) return 'anomaly';
        return 'normal';
    }

    /**
     * 获取节点颜色
     * @param {Object} node - 节点数据
     * @param {string} status - 状态
     * @returns {string} 颜色
     */
    getNodeColor(node, status) {
        const colors = {
            'approved': '#52c41a',
            'rejected': '#ff4d4f',
            'pending': '#faad14',
            'skipped': '#d9d9d9',
            'anomaly': '#ff7875',
            'normal': '#1890ff'
        };
        return colors[status] || colors.normal;
    }

    /**
     * 获取结果文本
     * @param {string} result - 结果代码
     * @returns {string} 结果文本
     */
    getResultText(result) {
        const resultMap = {
            'SUBMITTED': '已提交',
            'APPROVED': '已通过',
            'REJECTED': '已拒绝',
            'PENDING': '待审批',
            'SKIPPED': '已跳过',
            'RESUBMITTED': '重新提交'
        };
        return resultMap[result] || result;
    }

    /**
     * 获取结果徽章HTML
     * @param {string} result - 结果代码
     * @returns {string} HTML
     */
    getResultBadge(result) {
        const badges = {
            'SUBMITTED': '<span class="badge badge-info">已提交</span>',
            'APPROVED': '<span class="badge badge-success">已通过</span>',
            'REJECTED': '<span class="badge badge-danger">已拒绝</span>',
            'PENDING': '<span class="badge badge-warning">待审批</span>',
            'SKIPPED': '<span class="badge badge-secondary">已跳过</span>',
            'RESUBMITTED': '<span class="badge badge-primary">重新提交</span>'
        };
        return badges[result] || result;
    }

    /**
     * 获取状态徽章HTML
     * @param {string} status - 状态代码
     * @returns {string} HTML
     */
    getStatusBadge(status) {
        const badges = {
            'COMPLETED': '<span class="badge badge-success">已完成</span>',
            'IN_PROGRESS': '<span class="badge badge-primary">进行中</span>',
            'REJECTED': '<span class="badge badge-danger">已拒绝</span>',
            'CANCELLED': '<span class="badge badge-secondary">已取消</span>'
        };
        return badges[status] || status;
    }

    /**
     * 格式化持续时间
     * @param {number} minutes - 分钟数
     * @returns {string} 格式化文本
     */
    formatDuration(minutes) {
        if (minutes < 60) {
            return `${minutes}分钟`;
        }
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        if (hours < 24) {
            return `${hours}小时${mins}分钟`;
        }
        const days = Math.floor(hours / 24);
        const remainHours = hours % 24;
        return `${days}天${remainHours}小时`;
    }

    /**
     * 销毁图表
     */
    dispose() {
        if (this.timelineChart) {
            this.timelineChart.dispose();
            this.timelineChart = null;
        }
    }
}

// 创建全局实例
window.approvalChainVisualization = new ApprovalChainVisualization();
