/**
 * 发票OCR识别服务
 * 提供发票图像识别、真伪查验、连号检测等功能
 */

class InvoiceOCRService {
    constructor() {
        this.apiEndpoint = '/api/ocr';
        this.taxVerifyEndpoint = '/api/tax/verify';
        this.processingQueue = [];
        this.maxConcurrent = 5;
    }

    /**
     * 识别发票信息
     * @param {File|Blob} imageFile - 发票图像文件
     * @returns {Promise<Object>} 识别结果
     */
    async recognizeInvoice(imageFile) {
        try {
            // 模拟OCR识别过程
            const imageData = await this._readImageFile(imageFile);
            
            // 在实际应用中,这里会调用OCR引擎(Tesseract或PaddleOCR)
            // 这里使用模拟数据演示
            const result = await this._simulateOCR(imageData);
            
            return {
                success: true,
                data: result,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            console.error('发票识别失败:', error);
            return {
                success: false,
                error: error.message,
                timestamp: new Date().toISOString()
            };
        }
    }

    /**
     * 读取图像文件
     * @private
     */
    async _readImageFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = (e) => reject(new Error('文件读取失败'));
            reader.readAsDataURL(file);
        });
    }

    /**
     * 模拟OCR识别
     * @private
     */
    async _simulateOCR(imageData) {
        // 模拟识别延迟
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // 生成模拟识别结果
        const invoiceTypes = ['增值税专用发票', '增值税普通发票', '电子发票'];
        const suppliers = ['北京科技有限公司', '上海贸易公司', '深圳电子科技', '广州服务公司'];
        const buyers = ['某某大学', '某某学院', '某某研究所'];
        
        const invoiceCode = this._generateInvoiceCode();
        const invoiceNumber = this._generateInvoiceNumber();
        
        return {
            invoiceType: invoiceTypes[Math.floor(Math.random() * invoiceTypes.length)],
            invoiceCode: invoiceCode,
            invoiceNumber: invoiceNumber,
            invoiceDate: this._generateRandomDate(),
            amount: (Math.random() * 100000 + 1000).toFixed(2),
            taxAmount: (Math.random() * 10000 + 100).toFixed(2),
            totalAmount: (Math.random() * 110000 + 1100).toFixed(2),
            seller: {
                name: suppliers[Math.floor(Math.random() * suppliers.length)],
                taxNumber: this._generateTaxNumber(),
                address: '北京市海淀区中关村大街1号',
                phone: '010-12345678',
                bank: '中国工商银行',
                account: '1234567890123456789'
            },
            buyer: {
                name: buyers[Math.floor(Math.random() * buyers.length)],
                taxNumber: this._generateTaxNumber(),
                address: '北京市朝阳区建国路88号',
                phone: '010-87654321',
                bank: '中国建设银行',
                account: '9876543210987654321'
            },
            items: this._generateInvoiceItems(),
            remark: '',
            confidence: (0.85 + Math.random() * 0.14).toFixed(2), // 识别置信度
            verificationStatus: 'PENDING' // 待查验
        };
    }

    /**
     * 生成发票代码
     * @private
     */
    _generateInvoiceCode() {
        const prefix = '1100';
        const year = new Date().getFullYear().toString().slice(-2);
        const random = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
        return prefix + year + random;
    }

    /**
     * 生成发票号码
     * @private
     */
    _generateInvoiceNumber() {
        return Math.floor(Math.random() * 100000000).toString().padStart(8, '0');
    }

    /**
     * 生成税号
     * @private
     */
    _generateTaxNumber() {
        return '91' + Math.floor(Math.random() * 10000000000000000).toString().padStart(16, '0');
    }

    /**
     * 生成随机日期
     * @private
     */
    _generateRandomDate() {
        const start = new Date(2024, 0, 1);
        const end = new Date();
        const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
        return date.toISOString().split('T')[0];
    }

    /**
     * 生成发票明细
     * @private
     */
    _generateInvoiceItems() {
        const items = [
            { name: '办公用品', spec: '批', quantity: 1, price: 5000, amount: 5000, taxRate: '13%' },
            { name: '电脑设备', spec: '台', quantity: 2, price: 6000, amount: 12000, taxRate: '13%' },
            { name: '咨询服务', spec: '次', quantity: 1, price: 8000, amount: 8000, taxRate: '6%' },
            { name: '培训费', spec: '人次', quantity: 10, price: 500, amount: 5000, taxRate: '6%' }
        ];
        
        const count = Math.floor(Math.random() * 3) + 1;
        return items.slice(0, count);
    }

    /**
     * 查验发票真伪
     * @param {string} invoiceCode - 发票代码
     * @param {string} invoiceNumber - 发票号码
     * @param {string} invoiceDate - 开票日期
     * @param {number} amount - 发票金额
     * @returns {Promise<Object>} 查验结果
     */
    async verifyInvoice(invoiceCode, invoiceNumber, invoiceDate, amount) {
        try {
            // 模拟调用税务接口查验
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // 模拟查验结果
            const isValid = Math.random() > 0.1; // 90%概率为真发票
            
            return {
                success: true,
                data: {
                    invoiceCode,
                    invoiceNumber,
                    invoiceDate,
                    amount,
                    isValid,
                    status: isValid ? 'VALID' : 'INVALID',
                    statusText: isValid ? '发票真实有效' : '发票不存在或已作废',
                    verifyTime: new Date().toISOString(),
                    verifySource: '国家税务总局发票查验平台',
                    details: isValid ? {
                        invoiceStatus: '正常',
                        issueDate: invoiceDate,
                        issuer: '税务机关',
                        remark: '该发票已在税务系统中登记'
                    } : {
                        reason: '发票代码或号码错误',
                        suggestion: '请核对发票信息后重新查验'
                    }
                }
            };
        } catch (error) {
            console.error('发票查验失败:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * 检测连号发票
     * @param {Array<Object>} invoices - 发票列表
     * @returns {Promise<Object>} 检测结果
     */
    async detectSerialInvoices(invoices) {
        try {
            const serialGroups = [];
            const duplicates = [];
            
            // 按供应商和日期分组
            const grouped = this._groupInvoices(invoices);
            
            // 检测每组中的连号发票
            for (const [key, group] of Object.entries(grouped)) {
                if (group.length < 2) continue;
                
                // 按发票号码排序
                group.sort((a, b) => parseInt(a.invoiceNumber) - parseInt(b.invoiceNumber));
                
                // 检测连号
                const serials = this._findSerialNumbers(group);
                if (serials.length > 0) {
                    serialGroups.push({
                        supplier: group[0].seller.name,
                        date: group[0].invoiceDate,
                        invoices: serials,
                        count: serials.length,
                        riskLevel: serials.length >= 5 ? 'HIGH' : serials.length >= 3 ? 'MEDIUM' : 'LOW',
                        description: `同一供应商在同一天开具${serials.length}张连号发票`
                    });
                }
            }
            
            // 检测重复发票
            const seen = new Map();
            for (const invoice of invoices) {
                const key = `${invoice.invoiceCode}-${invoice.invoiceNumber}`;
                if (seen.has(key)) {
                    duplicates.push({
                        invoiceCode: invoice.invoiceCode,
                        invoiceNumber: invoice.invoiceNumber,
                        count: seen.get(key).count + 1,
                        invoices: [seen.get(key).invoice, invoice],
                        riskLevel: 'HIGH',
                        description: '发票代码和号码完全相同'
                    });
                    seen.get(key).count++;
                } else {
                    seen.set(key, { invoice, count: 1 });
                }
            }
            
            return {
                success: true,
                data: {
                    totalInvoices: invoices.length,
                    serialGroups,
                    duplicates,
                    hasAnomalies: serialGroups.length > 0 || duplicates.length > 0,
                    summary: {
                        serialCount: serialGroups.length,
                        duplicateCount: duplicates.length,
                        highRiskCount: [...serialGroups, ...duplicates].filter(g => g.riskLevel === 'HIGH').length
                    }
                }
            };
        } catch (error) {
            console.error('连号检测失败:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * 按供应商和日期分组发票
     * @private
     */
    _groupInvoices(invoices) {
        const grouped = {};
        for (const invoice of invoices) {
            const key = `${invoice.seller.name}-${invoice.invoiceDate}`;
            if (!grouped[key]) {
                grouped[key] = [];
            }
            grouped[key].push(invoice);
        }
        return grouped;
    }

    /**
     * 查找连号发票
     * @private
     */
    _findSerialNumbers(sortedInvoices) {
        const serials = [];
        let currentSerial = [sortedInvoices[0]];
        
        for (let i = 1; i < sortedInvoices.length; i++) {
            const prev = parseInt(sortedInvoices[i - 1].invoiceNumber);
            const curr = parseInt(sortedInvoices[i].invoiceNumber);
            
            if (curr === prev + 1) {
                currentSerial.push(sortedInvoices[i]);
            } else {
                if (currentSerial.length >= 2) {
                    serials.push(...currentSerial);
                }
                currentSerial = [sortedInvoices[i]];
            }
        }
        
        if (currentSerial.length >= 2) {
            serials.push(...currentSerial);
        }
        
        return serials;
    }

    /**
     * 批量处理发票
     * @param {Array<File>} files - 发票图像文件数组
     * @param {Function} progressCallback - 进度回调函数
     * @returns {Promise<Object>} 批量处理结果
     */
    async batchProcess(files, progressCallback) {
        const results = [];
        const errors = [];
        let processed = 0;
        
        try {
            // 分批并行处理
            for (let i = 0; i < files.length; i += this.maxConcurrent) {
                const batch = files.slice(i, i + this.maxConcurrent);
                const batchPromises = batch.map(async (file, index) => {
                    try {
                        const result = await this.recognizeInvoice(file);
                        if (result.success) {
                            results.push({
                                fileName: file.name,
                                fileSize: file.size,
                                ...result.data
                            });
                        } else {
                            errors.push({
                                fileName: file.name,
                                error: result.error
                            });
                        }
                    } catch (error) {
                        errors.push({
                            fileName: file.name,
                            error: error.message
                        });
                    }
                    
                    processed++;
                    if (progressCallback) {
                        progressCallback({
                            processed,
                            total: files.length,
                            percentage: Math.round((processed / files.length) * 100)
                        });
                    }
                });
                
                await Promise.all(batchPromises);
            }
            
            return {
                success: true,
                data: {
                    total: files.length,
                    successful: results.length,
                    failed: errors.length,
                    results,
                    errors,
                    summary: this._generateBatchSummary(results)
                }
            };
        } catch (error) {
            console.error('批量处理失败:', error);
            return {
                success: false,
                error: error.message,
                partialResults: results,
                errors
            };
        }
    }

    /**
     * 生成批量处理摘要
     * @private
     */
    _generateBatchSummary(results) {
        const totalAmount = results.reduce((sum, r) => sum + parseFloat(r.totalAmount || 0), 0);
        const avgConfidence = results.reduce((sum, r) => sum + parseFloat(r.confidence || 0), 0) / results.length;
        
        const typeCount = {};
        results.forEach(r => {
            typeCount[r.invoiceType] = (typeCount[r.invoiceType] || 0) + 1;
        });
        
        return {
            totalAmount: totalAmount.toFixed(2),
            avgConfidence: avgConfidence.toFixed(2),
            typeDistribution: typeCount,
            dateRange: {
                earliest: results.reduce((min, r) => r.invoiceDate < min ? r.invoiceDate : min, results[0]?.invoiceDate),
                latest: results.reduce((max, r) => r.invoiceDate > max ? r.invoiceDate : max, results[0]?.invoiceDate)
            }
        };
    }

    /**
     * 生成异常预警
     * @param {Object} anomalyData - 异常数据
     * @returns {Promise<Object>} 预警结果
     */
    async generateAlert(anomalyData) {
        try {
            const alert = {
                id: 'ALERT-' + Date.now(),
                type: anomalyData.type, // 'SERIAL' | 'DUPLICATE' | 'INVALID'
                level: anomalyData.riskLevel || 'MEDIUM',
                title: this._getAlertTitle(anomalyData.type),
                description: anomalyData.description,
                involvedInvoices: anomalyData.invoices || [],
                evidenceData: anomalyData,
                status: 'NEW',
                createdAt: new Date().toISOString(),
                category: '票据异常'
            };
            
            // 在实际应用中,这里会调用预警服务API
            console.log('生成预警:', alert);
            
            return {
                success: true,
                data: alert
            };
        } catch (error) {
            console.error('生成预警失败:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * 获取预警标题
     * @private
     */
    _getAlertTitle(type) {
        const titles = {
            'SERIAL': '发现连号发票异常',
            'DUPLICATE': '发现重复发票',
            'INVALID': '发现无效发票',
            'HIGH_AMOUNT': '发现大额发票异常'
        };
        return titles[type] || '发票异常';
    }

    /**
     * 导出识别结果
     * @param {Array<Object>} results - 识别结果列表
     * @param {string} format - 导出格式 ('CSV' | 'EXCEL' | 'JSON')
     * @returns {Promise<Blob>} 导出文件
     */
    async exportResults(results, format = 'CSV') {
        try {
            let content;
            let mimeType;
            let filename;
            
            switch (format) {
                case 'CSV':
                    content = this._convertToCSV(results);
                    mimeType = 'text/csv;charset=utf-8;';
                    filename = `invoice_ocr_results_${Date.now()}.csv`;
                    break;
                case 'JSON':
                    content = JSON.stringify(results, null, 2);
                    mimeType = 'application/json';
                    filename = `invoice_ocr_results_${Date.now()}.json`;
                    break;
                default:
                    throw new Error('不支持的导出格式');
            }
            
            const blob = new Blob([content], { type: mimeType });
            return { blob, filename };
        } catch (error) {
            console.error('导出失败:', error);
            throw error;
        }
    }

    /**
     * 转换为CSV格式
     * @private
     */
    _convertToCSV(results) {
        const headers = [
            '发票类型', '发票代码', '发票号码', '开票日期', 
            '金额', '税额', '价税合计', '销售方名称', '销售方税号',
            '购买方名称', '购买方税号', '识别置信度', '查验状态'
        ];
        
        const rows = results.map(r => [
            r.invoiceType,
            r.invoiceCode,
            r.invoiceNumber,
            r.invoiceDate,
            r.amount,
            r.taxAmount,
            r.totalAmount,
            r.seller.name,
            r.seller.taxNumber,
            r.buyer.name,
            r.buyer.taxNumber,
            r.confidence,
            r.verificationStatus
        ]);
        
        return [headers, ...rows].map(row => row.join(',')).join('\n');
    }
}

// 导出服务实例
window.InvoiceOCRService = InvoiceOCRService;
