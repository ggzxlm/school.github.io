/**
 * 数据流联调测试服务
 * 
 * 测试数据从采集到预警的完整流程
 * 验证数据质量和准确性
 * 优化数据处理性能
 * 
 * @author 开发团队
 * @version 1.0.0
 * @date 2025-10-23
 */

const DataFlowTestService = {
    /**
     * 测试数据流完整性
     */
    async testCompleteDataFlow() {
        console.log('========== 开始数据流完整性测试 ==========');
        
        const results = {
            dataCollection: null,
            dataTransform: null,
            dataQuality: null,
            ruleExecution: null,
            alertGeneration: null,
            overall: null
        };
        
        try {
            // 1. 测试数据采集
            results.dataCollection = await this.testDataCollection();
            
            // 2. 测试数据转换
            if (results.dataCollection.success) {
                results.dataTransform = await this.testDataTransform(results.dataCollection.data);
            }
            
            // 3. 测试数据质量检查
            if (results.dataTransform && results.dataTransform.success) {
                results.dataQuality = await this.testDataQuality(results.dataTransform.data);
            }
            
            // 4. 测试规则执行
            if (results.dataQuality && results.dataQuality.success) {
                results.ruleExecution = await this.testRuleExecution(results.dataQuality.data);
            }
            
            // 5. 测试预警生成
            if (results.ruleExecution && results.ruleExecution.success) {
                results.alertGeneration = await this.testAlertGeneration(results.ruleExecution.data);
            }
            
            // 计算整体结果
            results.overall = {
                success: Object.values(results).every(r => r && r.success),
                totalSteps: 5,
                passedSteps: Object.values(results).filter(r => r && r.success).length,
                duration: this.calculateTotalDuration(results)
            };
            
            console.log('========== 数据流完整性测试完成 ==========');
            return results;
            
        } catch (error) {
            console.error('数据流测试失败:', error);
            results.overall = {
                success: false,
                error: error.message
            };
            return results;
        }
    },
    
    /**
     * 测试数据采集
     */
    async testDataCollection() {
        console.log('测试步骤 1/5: 数据采集');
        const startTime = Date.now();
        
        try {
            // 模拟数据采集
            const mockData = this.generateMockSourceData();
            
            // 验证数据格式
            const isValid = this.validateSourceData(mockData);
            
            const duration = Date.now() - startTime;
            
            return {
                success: isValid,
                data: mockData,
                recordCount: mockData.length,
                duration,
                message: isValid ? '数据采集成功' : '数据格式验证失败'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                duration: Date.now() - startTime
            };
        }
    },
    
    /**
     * 测试数据转换
     */
    async testDataTransform(sourceData) {
        console.log('测试步骤 2/5: 数据转换');
        const startTime = Date.now();
        
        try {
            // 模拟ETL转换
            const transformedData = sourceData.map(record => ({
                ...record,
                amount: parseFloat(record.amount),
                date: new Date(record.date),
                category: this.categorizeRecord(record),
                normalized: true
            }));
            
            // 验证转换结果
            const isValid = transformedData.every(r => 
                typeof r.amount === 'number' && 
                r.date instanceof Date &&
                r.category
            );
            
            const duration = Date.now() - startTime;
            
            return {
                success: isValid,
                data: transformedData,
                recordCount: transformedData.length,
                duration,
                message: isValid ? '数据转换成功' : '数据转换验证失败'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                duration: Date.now() - startTime
            };
        }
    },
    
    /**
     * 测试数据质量检查
     */
    async testDataQuality(transformedData) {
        console.log('测试步骤 3/5: 数据质量检查');
        const startTime = Date.now();
        
        try {
            const qualityResults = {
                completeness: this.checkCompleteness(transformedData),
                accuracy: this.checkAccuracy(transformedData),
                consistency: this.checkConsistency(transformedData),
                timeliness: this.checkTimeliness(transformedData)
            };
            
            const overallScore = Object.values(qualityResults).reduce((sum, r) => sum + r.score, 0) / 4;
            const isValid = overallScore >= 60;
            
            const duration = Date.now() - startTime;
            
            return {
                success: isValid,
                data: transformedData,
                qualityScore: overallScore,
                qualityDetails: qualityResults,
                duration,
                message: `数据质量评分: ${overallScore.toFixed(2)}分`
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                duration: Date.now() - startTime
            };
        }
    },
    
    /**
     * 测试规则执行
     */
    async testRuleExecution(qualityData) {
        console.log('测试步骤 4/5: 规则执行');
        const startTime = Date.now();
        
        try {
            // 模拟规则执行
            const rules = this.getMockRules();
            const matchedRecords = [];
            
            qualityData.forEach(record => {
                rules.forEach(rule => {
                    if (this.evaluateRule(rule, record)) {
                        matchedRecords.push({
                            record,
                            rule,
                            matchedAt: new Date()
                        });
                    }
                });
            });
            
            const duration = Date.now() - startTime;
            
            return {
                success: true,
                data: matchedRecords,
                totalRules: rules.length,
                matchedCount: matchedRecords.length,
                duration,
                message: `规则执行完成，命中 ${matchedRecords.length} 条记录`
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                duration: Date.now() - startTime
            };
        }
    },
    
    /**
     * 测试预警生成
     */
    async testAlertGeneration(ruleMatches) {
        console.log('测试步骤 5/5: 预警生成');
        const startTime = Date.now();
        
        try {
            // 生成预警
            const alerts = ruleMatches.map(match => ({
                id: `ALERT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                title: match.rule.name,
                level: match.rule.level,
                category: match.rule.category,
                description: match.rule.description,
                evidenceData: match.record,
                createdAt: new Date(),
                status: 'NEW'
            }));
            
            // 预警去重和聚类
            const clusteredAlerts = this.clusterAlerts(alerts);
            
            const duration = Date.now() - startTime;
            
            return {
                success: true,
                data: clusteredAlerts,
                alertCount: alerts.length,
                clusterCount: clusteredAlerts.length,
                duration,
                message: `生成 ${alerts.length} 条预警，聚类为 ${clusteredAlerts.length} 组`
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                duration: Date.now() - startTime
            };
        }
    },
    
    /**
     * 生成模拟源数据
     */
    generateMockSourceData() {
        const data = [];
        const categories = ['采购', '科研', '资产', '财务'];
        const departments = ['计算机学院', '经济学院', '管理学院', '文学院'];
        
        for (let i = 0; i < 100; i++) {
            data.push({
                id: `REC-${i + 1}`,
                category: categories[Math.floor(Math.random() * categories.length)],
                department: departments[Math.floor(Math.random() * departments.length)],
                amount: (Math.random() * 1000000).toFixed(2),
                date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
                description: `测试记录 ${i + 1}`,
                status: Math.random() > 0.8 ? 'ABNORMAL' : 'NORMAL'
            });
        }
        
        return data;
    },
    
    /**
     * 验证源数据
     */
    validateSourceData(data) {
        if (!Array.isArray(data) || data.length === 0) {
            return false;
        }
        
        return data.every(record => 
            record.id &&
            record.category &&
            record.amount &&
            record.date
        );
    },
    
    /**
     * 分类记录
     */
    categorizeRecord(record) {
        const amount = parseFloat(record.amount);
        if (amount > 500000) return 'HIGH_VALUE';
        if (amount > 100000) return 'MEDIUM_VALUE';
        return 'LOW_VALUE';
    },
    
    /**
     * 检查完整性
     */
    checkCompleteness(data) {
        const requiredFields = ['id', 'category', 'amount', 'date'];
        let completeCount = 0;
        
        data.forEach(record => {
            if (requiredFields.every(field => record[field] !== null && record[field] !== undefined)) {
                completeCount++;
            }
        });
        
        const score = (completeCount / data.length) * 100;
        return {
            score,
            completeCount,
            totalCount: data.length,
            message: `完整性: ${score.toFixed(2)}%`
        };
    },
    
    /**
     * 检查准确性
     */
    checkAccuracy(data) {
        let accurateCount = 0;
        
        data.forEach(record => {
            if (
                typeof record.amount === 'number' &&
                record.amount >= 0 &&
                record.date instanceof Date &&
                !isNaN(record.date.getTime())
            ) {
                accurateCount++;
            }
        });
        
        const score = (accurateCount / data.length) * 100;
        return {
            score,
            accurateCount,
            totalCount: data.length,
            message: `准确性: ${score.toFixed(2)}%`
        };
    },
    
    /**
     * 检查一致性
     */
    checkConsistency(data) {
        // 简单的一致性检查：检查分类是否与金额匹配
        let consistentCount = 0;
        
        data.forEach(record => {
            const expectedCategory = this.categorizeRecord(record);
            if (record.category === expectedCategory) {
                consistentCount++;
            }
        });
        
        const score = (consistentCount / data.length) * 100;
        return {
            score,
            consistentCount,
            totalCount: data.length,
            message: `一致性: ${score.toFixed(2)}%`
        };
    },
    
    /**
     * 检查及时性
     */
    checkTimeliness(data) {
        const now = new Date();
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        let timelyCount = 0;
        
        data.forEach(record => {
            if (record.date >= thirtyDaysAgo) {
                timelyCount++;
            }
        });
        
        const score = (timelyCount / data.length) * 100;
        return {
            score,
            timelyCount,
            totalCount: data.length,
            message: `及时性: ${score.toFixed(2)}%`
        };
    },
    
    /**
     * 获取模拟规则
     */
    getMockRules() {
        return [
            {
                id: 'RULE-001',
                name: '大额采购预警',
                category: '采购监督',
                level: 'HIGH',
                description: '单笔采购金额超过50万元',
                condition: (record) => record.category === '采购' && record.amount > 500000
            },
            {
                id: 'RULE-002',
                name: '科研经费异常',
                category: '科研监督',
                level: 'MEDIUM',
                description: '科研经费支出异常',
                condition: (record) => record.category === '科研' && record.status === 'ABNORMAL'
            },
            {
                id: 'RULE-003',
                name: '资产管理预警',
                category: '资产监督',
                level: 'LOW',
                description: '资产金额超过10万元',
                condition: (record) => record.category === '资产' && record.amount > 100000
            }
        ];
    },
    
    /**
     * 评估规则
     */
    evaluateRule(rule, record) {
        try {
            return rule.condition(record);
        } catch (error) {
            console.error('规则评估失败:', error);
            return false;
        }
    },
    
    /**
     * 预警聚类
     */
    clusterAlerts(alerts) {
        const clusters = new Map();
        
        alerts.forEach(alert => {
            const key = `${alert.category}-${alert.level}`;
            if (!clusters.has(key)) {
                clusters.set(key, {
                    id: `CLUSTER-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                    category: alert.category,
                    level: alert.level,
                    alerts: [],
                    count: 0
                });
            }
            
            const cluster = clusters.get(key);
            cluster.alerts.push(alert);
            cluster.count++;
        });
        
        return Array.from(clusters.values());
    },
    
    /**
     * 计算总耗时
     */
    calculateTotalDuration(results) {
        let total = 0;
        Object.values(results).forEach(result => {
            if (result && result.duration) {
                total += result.duration;
            }
        });
        return total;
    },
    
    /**
     * 性能测试
     */
    async testPerformance() {
        console.log('========== 开始性能测试 ==========');
        
        const results = {
            smallDataset: null,
            mediumDataset: null,
            largeDataset: null
        };
        
        // 测试小数据集 (100条)
        results.smallDataset = await this.testDatasetPerformance(100);
        
        // 测试中等数据集 (1000条)
        results.mediumDataset = await this.testDatasetPerformance(1000);
        
        // 测试大数据集 (10000条)
        results.largeDataset = await this.testDatasetPerformance(10000);
        
        console.log('========== 性能测试完成 ==========');
        return results;
    },
    
    /**
     * 测试数据集性能
     */
    async testDatasetPerformance(recordCount) {
        const startTime = Date.now();
        
        // 生成测试数据
        const data = [];
        for (let i = 0; i < recordCount; i++) {
            data.push({
                id: `REC-${i}`,
                amount: Math.random() * 1000000,
                category: ['采购', '科研', '资产'][Math.floor(Math.random() * 3)],
                date: new Date()
            });
        }
        
        // 执行转换
        const transformed = data.map(r => ({
            ...r,
            normalized: true,
            category: this.categorizeRecord(r)
        }));
        
        // 执行质量检查
        const qualityCheck = this.checkCompleteness(transformed);
        
        // 执行规则
        const rules = this.getMockRules();
        let matchCount = 0;
        transformed.forEach(record => {
            rules.forEach(rule => {
                if (this.evaluateRule(rule, record)) {
                    matchCount++;
                }
            });
        });
        
        const duration = Date.now() - startTime;
        const throughput = (recordCount / duration * 1000).toFixed(2);
        
        return {
            recordCount,
            duration,
            throughput: `${throughput} 条/秒`,
            qualityScore: qualityCheck.score,
            matchCount
        };
    },
    
    /**
     * 数据准确性验证
     */
    async validateDataAccuracy() {
        console.log('========== 开始数据准确性验证 ==========');
        
        const results = {
            dataIntegrity: null,
            transformAccuracy: null,
            ruleAccuracy: null
        };
        
        // 1. 数据完整性验证
        results.dataIntegrity = await this.validateDataIntegrity();
        
        // 2. 转换准确性验证
        results.transformAccuracy = await this.validateTransformAccuracy();
        
        // 3. 规则准确性验证
        results.ruleAccuracy = await this.validateRuleAccuracy();
        
        console.log('========== 数据准确性验证完成 ==========');
        return results;
    },
    
    /**
     * 验证数据完整性
     */
    async validateDataIntegrity() {
        const sourceData = this.generateMockSourceData();
        const transformedData = sourceData.map(r => ({ ...r, normalized: true }));
        
        // 验证记录数量一致
        const countMatch = sourceData.length === transformedData.length;
        
        // 验证ID一致性
        const idsMatch = sourceData.every((r, i) => r.id === transformedData[i].id);
        
        return {
            success: countMatch && idsMatch,
            sourceCount: sourceData.length,
            transformedCount: transformedData.length,
            idsMatch,
            message: countMatch && idsMatch ? '数据完整性验证通过' : '数据完整性验证失败'
        };
    },
    
    /**
     * 验证转换准确性
     */
    async validateTransformAccuracy() {
        const testCases = [
            { amount: '100000.50', expected: 100000.50 },
            { amount: '500000', expected: 500000 },
            { amount: '1234567.89', expected: 1234567.89 }
        ];
        
        let passedCount = 0;
        testCases.forEach(testCase => {
            const result = parseFloat(testCase.amount);
            if (result === testCase.expected) {
                passedCount++;
            }
        });
        
        const accuracy = (passedCount / testCases.length) * 100;
        
        return {
            success: accuracy === 100,
            accuracy: `${accuracy}%`,
            passedCount,
            totalCount: testCases.length,
            message: `转换准确性: ${accuracy}%`
        };
    },
    
    /**
     * 验证规则准确性
     */
    async validateRuleAccuracy() {
        const testData = [
            { category: '采购', amount: 600000, shouldMatch: true },
            { category: '采购', amount: 400000, shouldMatch: false },
            { category: '科研', amount: 100000, status: 'ABNORMAL', shouldMatch: true },
            { category: '科研', amount: 100000, status: 'NORMAL', shouldMatch: false }
        ];
        
        const rules = this.getMockRules();
        let correctCount = 0;
        
        testData.forEach(data => {
            const matched = rules.some(rule => this.evaluateRule(rule, data));
            if (matched === data.shouldMatch) {
                correctCount++;
            }
        });
        
        const accuracy = (correctCount / testData.length) * 100;
        
        return {
            success: accuracy === 100,
            accuracy: `${accuracy}%`,
            correctCount,
            totalCount: testData.length,
            message: `规则准确性: ${accuracy}%`
        };
    }
};

// 导出到全局
window.DataFlowTestService = DataFlowTestService;
