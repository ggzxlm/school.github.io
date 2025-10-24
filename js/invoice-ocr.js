/**
 * 票据OCR识别与查验页面控制器
 */

class InvoiceOCRController {
    constructor() {
        this.service = new InvoiceOCRService();
        this.currentResult = null;
        this.batchResults = [];
        this.anomalyData = null;
        this.init();
    }

    init() {
        this.initTabs();
        this.initSingleUpload();
        this.initBatchUpload();
        this.initVerifyForm();
    }

    /**
     * 初始化选项卡
     */
    initTabs() {
        const tabBtns = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');

        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const tabName = btn.dataset.tab;
                
                // 更新按钮状态
                tabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // 更新内容显示
                tabContents.forEach(content => {
                    content.classList.remove('active');
                    if (content.id === `${tabName}-tab`) {
                        content.classList.add('active');
                    }
                });
            });
        });
    }

    /**
     * 初始化单张上传
     */
    initSingleUpload() {
        const uploadArea = document.getElementById('single-upload-area');
        const fileInput = document.getElementById('single-file-input');

        // 点击上传区域
        uploadArea.addEventListener('click', (e) => {
            if (e.target !== fileInput) {
                fileInput.click();
            }
        });

        // 文件选择
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                this.processSingleFile(file);
            }
        });

        // 拖拽上传
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        });

        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('dragover');
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            
            const file = e.dataTransfer.files[0];
            if (file) {
                this.processSingleFile(file);
            }
        });
    }

    /**
     * 处理单个文件
     */
    async processSingleFile(file) {
        try {
            // 显示加载状态
            this.showLoading('正在识别发票信息...');

            // 调用OCR识别
            const result = await this.service.recognizeInvoice(file);

            if (result.success) {
                this.currentResult = result.data;
                this.displaySingleResult(file, result.data);
            } else {
                this.showError('识别失败：' + result.error);
            }
        } catch (error) {
            console.error('处理失败:', error);
            this.showError('处理失败：' + error.message);
        } finally {
            this.hideLoading();
        }
    }

    /**
     * 显示单张识别结果
     */
    displaySingleResult(file, data) {
        // 隐藏上传区域，显示结果区域
        document.querySelector('.upload-section').style.display = 'none';
        document.getElementById('single-result').style.display = 'block';

        // 显示预览图
        const reader = new FileReader();
        reader.onload = (e) => {
            document.getElementById('invoice-preview').src = e.target.result;
        };
        reader.readAsDataURL(file);

        // 填充基本信息
        document.getElementById('invoice-type').textContent = data.invoiceType;
        document.getElementById('invoice-code').textContent = data.invoiceCode;
        document.getElementById('invoice-number').textContent = data.invoiceNumber;
        document.getElementById('invoice-date').textContent = data.invoiceDate;
        document.getElementById('invoice-amount').textContent = '¥' + data.amount;
        document.getElementById('invoice-tax').textContent = '¥' + data.taxAmount;
        document.getElementById('invoice-total').textContent = '¥' + data.totalAmount;
        document.getElementById('invoice-confidence').textContent = (data.confidence * 100).toFixed(1) + '%';

        // 填充销售方信息
        document.getElementById('seller-name').textContent = data.seller.name;
        document.getElementById('seller-tax-number').textContent = data.seller.taxNumber;
        document.getElementById('seller-address').textContent = `${data.seller.address} ${data.seller.phone}`;
        document.getElementById('seller-bank').textContent = `${data.seller.bank} ${data.seller.account}`;

        // 填充购买方信息
        document.getElementById('buyer-name').textContent = data.buyer.name;
        document.getElementById('buyer-tax-number').textContent = data.buyer.taxNumber;
    }

    /**
     * 查验单张发票
     */
    async verifySingleInvoice() {
        if (!this.currentResult) {
            this.showError('没有可查验的发票');
            return;
        }

        try {
            this.showLoading('正在查验发票真伪...');

            const result = await this.service.verifyInvoice(
                this.currentResult.invoiceCode,
                this.currentResult.invoiceNumber,
                this.currentResult.invoiceDate,
                this.currentResult.totalAmount
            );

            if (result.success) {
                this.displayVerificationResult(result.data);
            } else {
                this.showError('查验失败：' + result.error);
            }
        } catch (error) {
            console.error('查验失败:', error);
            this.showError('查验失败：' + error.message);
        } finally {
            this.hideLoading();
        }
    }

    /**
     * 显示查验结果
     */
    displayVerificationResult(data) {
        const resultDiv = document.getElementById('verification-result');
        const statusDiv = document.getElementById('verification-status');

        resultDiv.style.display = 'block';
        
        const statusClass = data.isValid ? 'valid' : 'invalid';
        statusDiv.className = `verification-status ${statusClass}`;
        
        let html = `
            <div style="margin-bottom: 12px;">
                <strong style="font-size: 16px;">${data.statusText}</strong>
            </div>
            <div style="font-size: 14px; color: #666;">
                <p>查验时间：${new Date(data.verifyTime).toLocaleString()}</p>
                <p>查验来源：${data.verifySource}</p>
        `;

        if (data.isValid && data.details) {
            html += `
                <p>发票状态：${data.details.invoiceStatus}</p>
                <p>开票日期：${data.details.issueDate}</p>
                <p>备注：${data.details.remark}</p>
            `;
        } else if (!data.isValid && data.details) {
            html += `
                <p>失败原因：${data.details.reason}</p>
                <p>建议：${data.details.suggestion}</p>
            `;
        }

        html += '</div>';
        statusDiv.innerHTML = html;
    }

    /**
     * 导出单张结果
     */
    async exportSingleResult() {
        if (!this.currentResult) {
            this.showError('没有可导出的结果');
            return;
        }

        try {
            const { blob, filename } = await this.service.exportResults([this.currentResult], 'CSV');
            this.downloadFile(blob, filename);
            this.showSuccess('导出成功');
        } catch (error) {
            console.error('导出失败:', error);
            this.showError('导出失败：' + error.message);
        }
    }

    /**
     * 重置单张识别
     */
    resetSingle() {
        document.querySelector('.upload-section').style.display = 'block';
        document.getElementById('single-result').style.display = 'none';
        document.getElementById('single-file-input').value = '';
        document.getElementById('verification-result').style.display = 'none';
        this.currentResult = null;
    }

    /**
     * 初始化批量上传
     */
    initBatchUpload() {
        const uploadArea = document.getElementById('batch-upload-area');
        const fileInput = document.getElementById('batch-file-input');

        uploadArea.addEventListener('click', (e) => {
            if (e.target !== fileInput) {
                fileInput.click();
            }
        });

        fileInput.addEventListener('change', (e) => {
            const files = Array.from(e.target.files);
            if (files.length > 0) {
                this.processBatchFiles(files);
            }
        });

        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        });

        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('dragover');
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            
            const files = Array.from(e.dataTransfer.files);
            if (files.length > 0) {
                this.processBatchFiles(files);
            }
        });
    }

    /**
     * 处理批量文件
     */
    async processBatchFiles(files) {
        try {
            // 显示进度条
            document.getElementById('batch-progress').style.display = 'block';
            document.getElementById('batch-results').style.display = 'none';

            // 批量处理
            const result = await this.service.batchProcess(files, (progress) => {
                this.updateProgress(progress);
            });

            if (result.success) {
                this.batchResults = result.data.results;
                this.displayBatchResults(result.data);
            } else {
                this.showError('批量处理失败：' + result.error);
            }
        } catch (error) {
            console.error('批量处理失败:', error);
            this.showError('批量处理失败：' + error.message);
        }
    }

    /**
     * 更新进度
     */
    updateProgress(progress) {
        const progressFill = document.getElementById('progress-fill');
        const progressText = document.getElementById('progress-text');

        progressFill.style.width = progress.percentage + '%';
        progressText.textContent = `已处理 ${progress.processed} / ${progress.total} (${progress.percentage}%)`;
    }

    /**
     * 显示批量结果
     */
    displayBatchResults(data) {
        document.getElementById('batch-progress').style.display = 'none';
        document.getElementById('batch-results').style.display = 'block';

        // 更新统计卡片
        document.getElementById('batch-total').textContent = data.total;
        document.getElementById('batch-success').textContent = data.successful;
        document.getElementById('batch-failed').textContent = data.failed;
        document.getElementById('batch-amount').textContent = '¥' + data.summary.totalAmount;

        // 填充表格
        const tbody = document.getElementById('batch-table-body');
        tbody.innerHTML = '';

        data.results.forEach((item, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${item.fileName}</td>
                <td>${item.invoiceType}</td>
                <td>${item.invoiceCode}</td>
                <td>${item.invoiceNumber}</td>
                <td>${item.invoiceDate}</td>
                <td>¥${item.totalAmount}</td>
                <td>${item.seller.name}</td>
                <td>${(item.confidence * 100).toFixed(1)}%</td>
                <td>
                    <button class="btn btn-link" onclick="invoiceOCR.viewDetail(${index})">查看</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    /**
     * 检测异常
     */
    async detectAnomalies() {
        if (this.batchResults.length === 0) {
            this.showError('没有可检测的数据');
            return;
        }

        try {
            this.showLoading('正在检测异常...');

            const result = await this.service.detectSerialInvoices(this.batchResults);

            if (result.success) {
                this.anomalyData = result.data;
                
                // 切换到异常检测标签
                document.querySelector('[data-tab="anomaly"]').click();
                
                // 显示异常结果
                this.displayAnomalies(result.data);
                
                this.showSuccess(`检测完成，发现 ${result.data.summary.serialCount + result.data.summary.duplicateCount} 个异常`);
            } else {
                this.showError('检测失败：' + result.error);
            }
        } catch (error) {
            console.error('检测失败:', error);
            this.showError('检测失败：' + error.message);
        } finally {
            this.hideLoading();
        }
    }

    /**
     * 显示异常结果
     */
    displayAnomalies(data) {
        // 更新统计
        document.getElementById('serial-count').textContent = data.summary.serialCount;
        document.getElementById('duplicate-count').textContent = data.summary.duplicateCount;
        document.getElementById('high-risk-count').textContent = data.summary.highRiskCount;

        // 显示异常列表
        const listDiv = document.getElementById('anomaly-list');
        
        if (!data.hasAnomalies) {
            listDiv.innerHTML = '<p class="empty-message">未发现异常</p>';
            return;
        }

        let html = '';

        // 连号发票
        data.serialGroups.forEach(group => {
            html += `
                <div class="anomaly-item ${group.riskLevel.toLowerCase()}-risk">
                    <div class="anomaly-header">
                        <div class="anomaly-title">连号发票异常</div>
                        <span class="anomaly-badge ${group.riskLevel.toLowerCase()}">${group.riskLevel}</span>
                    </div>
                    <div class="anomaly-description">${group.description}</div>
                    <div class="anomaly-details">
                        供应商：${group.supplier} | 日期：${group.date} | 数量：${group.count}张
                    </div>
                </div>
            `;
        });

        // 重复发票
        data.duplicates.forEach(dup => {
            html += `
                <div class="anomaly-item high-risk">
                    <div class="anomaly-header">
                        <div class="anomaly-title">重复发票</div>
                        <span class="anomaly-badge high">HIGH</span>
                    </div>
                    <div class="anomaly-description">${dup.description}</div>
                    <div class="anomaly-details">
                        发票代码：${dup.invoiceCode} | 发票号码：${dup.invoiceNumber} | 重复次数：${dup.count}
                    </div>
                </div>
            `;
        });

        listDiv.innerHTML = html;
    }

    /**
     * 导出批量结果
     */
    async exportBatchResults() {
        if (this.batchResults.length === 0) {
            this.showError('没有可导出的结果');
            return;
        }

        try {
            const { blob, filename } = await this.service.exportResults(this.batchResults, 'CSV');
            this.downloadFile(blob, filename);
            this.showSuccess('导出成功');
        } catch (error) {
            console.error('导出失败:', error);
            this.showError('导出失败：' + error.message);
        }
    }

    /**
     * 重置批量处理
     */
    resetBatch() {
        document.getElementById('batch-progress').style.display = 'none';
        document.getElementById('batch-results').style.display = 'none';
        document.getElementById('batch-file-input').value = '';
        this.batchResults = [];
    }

    /**
     * 初始化查验表单
     */
    initVerifyForm() {
        const form = document.getElementById('verify-form');
        
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const code = document.getElementById('verify-code').value;
            const number = document.getElementById('verify-number').value;
            const date = document.getElementById('verify-date').value;
            const amount = document.getElementById('verify-amount').value;

            try {
                this.showLoading('正在查验...');

                const result = await this.service.verifyInvoice(code, number, date, amount);

                if (result.success) {
                    this.displayVerifyResult(result.data);
                } else {
                    this.showError('查验失败：' + result.error);
                }
            } catch (error) {
                console.error('查验失败:', error);
                this.showError('查验失败：' + error.message);
            } finally {
                this.hideLoading();
            }
        });
    }

    /**
     * 显示查验结果
     */
    displayVerifyResult(data) {
        const resultDiv = document.getElementById('verify-result');
        const contentDiv = document.getElementById('verify-result-content');

        resultDiv.style.display = 'block';

        const statusClass = data.isValid ? 'valid' : 'invalid';
        
        let html = `
            <div class="verification-status ${statusClass}">
                <div style="margin-bottom: 12px;">
                    <strong style="font-size: 18px;">${data.statusText}</strong>
                </div>
                <div style="font-size: 14px;">
                    <p><strong>发票代码：</strong>${data.invoiceCode}</p>
                    <p><strong>发票号码：</strong>${data.invoiceNumber}</p>
                    <p><strong>开票日期：</strong>${data.invoiceDate}</p>
                    <p><strong>发票金额：</strong>¥${data.amount}</p>
                    <p><strong>查验时间：</strong>${new Date(data.verifyTime).toLocaleString()}</p>
                    <p><strong>查验来源：</strong>${data.verifySource}</p>
        `;

        if (data.isValid && data.details) {
            html += `
                <p><strong>发票状态：</strong>${data.details.invoiceStatus}</p>
                <p><strong>备注：</strong>${data.details.remark}</p>
            `;
        } else if (!data.isValid && data.details) {
            html += `
                <p><strong>失败原因：</strong>${data.details.reason}</p>
                <p><strong>建议：</strong>${data.details.suggestion}</p>
            `;
        }

        html += '</div></div>';
        contentDiv.innerHTML = html;
    }

    /**
     * 刷新异常数据
     */
    refreshAnomalies() {
        if (this.anomalyData) {
            this.displayAnomalies(this.anomalyData);
            this.showSuccess('已刷新');
        } else {
            this.showError('暂无异常数据');
        }
    }

    /**
     * 筛选历史记录
     */
    filterHistory() {
        const startDate = document.getElementById('history-start-date').value;
        const endDate = document.getElementById('history-end-date').value;
        
        // 这里应该调用API获取历史记录
        console.log('筛选历史记录:', startDate, endDate);
        this.showSuccess('筛选功能开发中');
    }

    /**
     * 查看详情
     */
    viewDetail(index) {
        const item = this.batchResults[index];
        if (item) {
            this.currentResult = item;
            document.querySelector('[data-tab="single"]').click();
            this.displaySingleResult(new Blob(), item);
        }
    }

    /**
     * 下载文件
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
     * 显示加载状态
     */
    showLoading(message = '加载中...') {
        // 简单实现，实际应该使用更好的加载组件
        console.log('Loading:', message);
    }

    /**
     * 隐藏加载状态
     */
    hideLoading() {
        console.log('Loading hidden');
    }

    /**
     * 显示成功消息
     */
    showSuccess(message) {
        alert(message);
    }

    /**
     * 显示错误消息
     */
    showError(message) {
        alert(message);
    }
}

// 初始化控制器
let invoiceOCR;
document.addEventListener('DOMContentLoaded', () => {
    invoiceOCR = new InvoiceOCRController();
});
