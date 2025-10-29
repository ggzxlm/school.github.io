/**
 * 文本智能分析服务
 * 提供会议纪要、招标文件、合同文本分析和敏感词检测功能
 */

class TextAnalysisService {
    constructor() {
        this.sensitiveWords = this.initSensitiveWords();
        this.analysisHistory = [];
    }

    /**
     * 初始化敏感词词库
     */
    initSensitiveWords() {
        return {
            corruption: ['贿赂', '回扣', '好处费', '感谢费', '辛苦费', '茶水费'],
            discrimination: ['排他', '指定', '唯一', '独家', '特定品牌'],
            violation: ['违规', '违法', '私自', '擅自', '未经批准'],
            relationship: ['亲属', '关系户', '熟人', '朋友公司'],
            financial: ['账外', '小金库', '私账', '现金交易', '不开票']
        };
    }

    /**
     * 分析会议纪要
     * @param {string} text - 会议纪要文本
     * @returns {Object} 分析结果
     */
    analyzeMeetingMinutes(text) {
        const result = {
            type: 'meeting_minutes',
            timestamp: new Date().toISOString(),
            original: text,
            extracted: {
                topic: this.extractMeetingTopic(text),
                participants: this.extractParticipants(text),
                decisions: this.extractDecisions(text),
                actionItems: this.extractActionItems(text),
                date: this.extractDate(text),
                location: this.extractLocation(text)
            },
            summary: '',
            sensitiveWords: this.detectSensitiveWords(text),
            riskLevel: 'low'
        };

        // 生成摘要
        result.summary = this.generateMeetingSummary(result.extracted);

        // 评估风险等级
        result.riskLevel = this.assessRiskLevel(result.sensitiveWords);

        this.analysisHistory.push(result);
        return result;
    }

    /**
     * 提取会议主题
     */
    extractMeetingTopic(text) {
        const topicPatterns = [
            /(?:会议主题|主题|议题)[:：]\s*(.+?)(?:\n|$)/,
            /(?:关于|讨论)(.+?)(?:的会议|会议)/,
            /^(.{10,50}?)会议/m
        ];

        for (const pattern of topicPatterns) {
            const match = text.match(pattern);
            if (match) {
                return match[1].trim();
            }
        }

        // 如果没有明确主题，提取第一句话作为主题
        const firstLine = text.split('\n')[0];
        return firstLine.substring(0, 50);
    }

    /**
     * 提取参会人员
     */
    extractParticipants(text) {
        const participants = [];
        const patterns = [
            /(?:参会人员|参加人员|出席人员|与会人员)[:：]\s*(.+?)(?:\n|$)/,
            /(?:参会|出席|列席)[:：]\s*(.+?)(?:\n|$)/
        ];

        for (const pattern of patterns) {
            const match = text.match(pattern);
            if (match) {
                const names = match[1].split(/[,，、；;]/).map(n => n.trim()).filter(n => n);
                participants.push(...names);
            }
        }

        // 提取姓名模式（中文姓名）
        const namePattern = /([A-Z][a-z]+|[一-龥]{2,4})(?:同志|老师|教授|主任|处长|科长|局长|书记|校长|院长)/g;
        const nameMatches = text.match(namePattern);
        if (nameMatches) {
            nameMatches.forEach(match => {
                const name = match.replace(/(?:同志|老师|教授|主任|处长|科长|局长|书记|校长|院长)/, '');
                if (!participants.includes(name)) {
                    participants.push(name);
                }
            });
        }

        return [...new Set(participants)];
    }

    /**
     * 提取决策事项
     */
    extractDecisions(text) {
        const decisions = [];
        const patterns = [
            /(?:决定|决议|通过|批准|同意)[:：]?\s*(.+?)(?:\n|$)/g,
            /(?:会议决定|会议决议|会议通过)[:：]?\s*(.+?)(?:\n|$)/g,
            /[一二三四五六七八九十]、\s*(.+?)(?:\n|$)/g
        ];

        for (const pattern of patterns) {
            let match;
            while ((match = pattern.exec(text)) !== null) {
                const decision = match[1].trim();
                if (decision.length > 5 && decision.length < 200) {
                    decisions.push(decision);
                }
            }
        }

        return [...new Set(decisions)];
    }

    /**
     * 提取行动事项
     */
    extractActionItems(text) {
        const actionItems = [];
        const actionVerbs = ['负责', '完成', '落实', '执行', '办理', '跟进', '推进', '实施'];
        
        const lines = text.split('\n');
        lines.forEach(line => {
            if (actionVerbs.some(verb => line.includes(verb))) {
                const cleaned = line.trim();
                if (cleaned.length > 10 && cleaned.length < 200) {
                    actionItems.push(cleaned);
                }
            }
        });

        return actionItems;
    }

    /**
     * 提取日期
     */
    extractDate(text) {
        const datePatterns = [
            /(\d{4})年(\d{1,2})月(\d{1,2})日/,
            /(\d{4})-(\d{1,2})-(\d{1,2})/,
            /(\d{4})\/(\d{1,2})\/(\d{1,2})/
        ];

        for (const pattern of datePatterns) {
            const match = text.match(pattern);
            if (match) {
                return `${match[1]}-${match[2].padStart(2, '0')}-${match[3].padStart(2, '0')}`;
            }
        }

        return null;
    }

    /**
     * 提取地点
     */
    extractLocation(text) {
        const locationPatterns = [
            /(?:地点|会议地点|召开地点)[:：]\s*(.+?)(?:\n|$)/,
            /在(.+?会议室|.+?办公室|.+?大厅)(?:召开|举行)/
        ];

        for (const pattern of locationPatterns) {
            const match = text.match(pattern);
            if (match) {
                return match[1].trim();
            }
        }

        return null;
    }

    /**
     * 生成会议摘要
     */
    generateMeetingSummary(extracted) {
        const parts = [];
        
        if (extracted.date) {
            parts.push(`${extracted.date}`);
        }
        
        if (extracted.location) {
            parts.push(`在${extracted.location}`);
        }
        
        if (extracted.topic) {
            parts.push(`召开${extracted.topic}`);
        }
        
        if (extracted.participants.length > 0) {
            const participantStr = extracted.participants.slice(0, 3).join('、');
            const more = extracted.participants.length > 3 ? `等${extracted.participants.length}人` : '';
            parts.push(`${participantStr}${more}参加`);
        }
        
        if (extracted.decisions.length > 0) {
            parts.push(`会议形成${extracted.decisions.length}项决议`);
        }

        return parts.join('，') + '。';
    }

    /**
     * 分析招标文件
     */
    analyzeTenderDocument(text) {
        const result = {
            type: 'tender_document',
            timestamp: new Date().toISOString(),
            original: text,
            extracted: {
                projectName: this.extractProjectName(text),
                budget: this.extractBudget(text),
                technicalRequirements: this.extractTechnicalRequirements(text),
                qualificationRequirements: this.extractQualificationRequirements(text),
                deadline: this.extractDeadline(text),
                exclusiveClauses: this.detectExclusiveClauses(text),
                biasedClauses: this.detectBiasedClauses(text)
            },
            summary: '',
            risks: [],
            sensitiveWords: this.detectSensitiveWords(text),
            riskLevel: 'low'
        };

        // 生成摘要
        result.summary = this.generateTenderSummary(result.extracted);

        // 评估风险
        result.risks = this.assessTenderRisks(result.extracted, result.sensitiveWords);
        result.riskLevel = this.assessRiskLevel(result.sensitiveWords, result.risks);

        this.analysisHistory.push(result);
        return result;
    }

    /**
     * 提取项目名称
     */
    extractProjectName(text) {
        const patterns = [
            /(?:项目名称|招标项目)[:：]\s*(.+?)(?:\n|$)/,
            /(.+?)(?:招标|采购)(?:公告|文件)/
        ];

        for (const pattern of patterns) {
            const match = text.match(pattern);
            if (match) {
                return match[1].trim();
            }
        }

        return '未识别';
    }

    /**
     * 提取预算金额
     */
    extractBudget(text) {
        const patterns = [
            /(?:预算|预算金额|项目预算)[:：]\s*([\d,.]+)\s*(?:元|万元)/,
            /([\d,.]+)\s*万元/
        ];

        for (const pattern of patterns) {
            const match = text.match(pattern);
            if (match) {
                return match[1].replace(/,/g, '');
            }
        }

        return null;
    }

    /**
     * 提取技术要求
     */
    extractTechnicalRequirements(text) {
        const requirements = [];
        const patterns = [
            /(?:技术要求|技术参数|技术规格)[:：]\s*(.+?)(?:\n\n|$)/s,
            /(?:技术指标|性能指标)[:：]\s*(.+?)(?:\n\n|$)/s
        ];

        for (const pattern of patterns) {
            const match = text.match(pattern);
            if (match) {
                const lines = match[1].split('\n').filter(l => l.trim());
                requirements.push(...lines);
            }
        }

        return requirements;
    }

    /**
     * 提取资质要求
     */
    extractQualificationRequirements(text) {
        const requirements = [];
        const patterns = [
            /(?:资质要求|资格要求)[:：]\s*(.+?)(?:\n\n|$)/s,
            /(?:投标人资格|供应商资格)[:：]\s*(.+?)(?:\n\n|$)/s
        ];

        for (const pattern of patterns) {
            const match = text.match(pattern);
            if (match) {
                const lines = match[1].split('\n').filter(l => l.trim());
                requirements.push(...lines);
            }
        }

        return requirements;
    }

    /**
     * 提取截止时间
     */
    extractDeadline(text) {
        const patterns = [
            /(?:截止时间|投标截止时间)[:：]\s*(.+?)(?:\n|$)/,
            /(\d{4}年\d{1,2}月\d{1,2}日\s*\d{1,2}:\d{2})/
        ];

        for (const pattern of patterns) {
            const match = text.match(pattern);
            if (match) {
                return match[1].trim();
            }
        }

        return null;
    }

    /**
     * 检测排他性条款
     */
    detectExclusiveClauses(text) {
        const exclusiveKeywords = ['唯一', '独家', '指定品牌', '特定品牌', '仅限', '必须为'];
        const clauses = [];

        const lines = text.split('\n');
        lines.forEach((line, index) => {
            exclusiveKeywords.forEach(keyword => {
                if (line.includes(keyword)) {
                    clauses.push({
                        line: index + 1,
                        content: line.trim(),
                        keyword: keyword,
                        type: 'exclusive'
                    });
                }
            });
        });

        return clauses;
    }

    /**
     * 检测倾向性条款
     */
    detectBiasedClauses(text) {
        const biasedKeywords = ['优先', '加分', '优势', '特别要求', '限定'];
        const clauses = [];

        const lines = text.split('\n');
        lines.forEach((line, index) => {
            biasedKeywords.forEach(keyword => {
                if (line.includes(keyword)) {
                    clauses.push({
                        line: index + 1,
                        content: line.trim(),
                        keyword: keyword,
                        type: 'biased'
                    });
                }
            });
        });

        return clauses;
    }

    /**
     * 生成招标文件摘要
     */
    generateTenderSummary(extracted) {
        const parts = [];
        
        if (extracted.projectName) {
            parts.push(`项目：${extracted.projectName}`);
        }
        
        if (extracted.budget) {
            parts.push(`预算：${extracted.budget}万元`);
        }
        
        if (extracted.deadline) {
            parts.push(`截止时间：${extracted.deadline}`);
        }
        
        if (extracted.technicalRequirements.length > 0) {
            parts.push(`技术要求${extracted.technicalRequirements.length}项`);
        }
        
        if (extracted.qualificationRequirements.length > 0) {
            parts.push(`资质要求${extracted.qualificationRequirements.length}项`);
        }

        return parts.join('，') + '。';
    }

    /**
     * 评估招标风险
     */
    assessTenderRisks(extracted, sensitiveWords) {
        const risks = [];

        // 检查排他性条款
        if (extracted.exclusiveClauses.length > 0) {
            risks.push({
                type: 'exclusive_clause',
                level: 'high',
                description: `发现${extracted.exclusiveClauses.length}处排他性条款`,
                details: extracted.exclusiveClauses
            });
        }

        // 检查倾向性条款
        if (extracted.biasedClauses.length > 0) {
            risks.push({
                type: 'biased_clause',
                level: 'medium',
                description: `发现${extracted.biasedClauses.length}处倾向性条款`,
                details: extracted.biasedClauses
            });
        }

        // 检查敏感词
        if (sensitiveWords.length > 0) {
            // 转换敏感词格式以匹配显示需求
            const formattedDetails = sensitiveWords.map(sw => ({
                line: sw.line,
                content: sw.context,
                keyword: sw.word,
                type: 'sensitive'
            }));
            
            risks.push({
                type: 'sensitive_words',
                level: 'high',
                description: `发现${sensitiveWords.length}个敏感词`,
                details: formattedDetails
            });
        }

        return risks;
    }

    /**
     * 分析合同文本
     */
    analyzeContract(text) {
        const result = {
            type: 'contract',
            timestamp: new Date().toISOString(),
            original: text,
            extracted: {
                contractNumber: this.extractContractNumber(text),
                parties: this.extractParties(text),
                amount: this.extractContractAmount(text),
                duration: this.extractDuration(text),
                startDate: this.extractStartDate(text),
                endDate: this.extractEndDate(text),
                paymentTerms: this.extractPaymentTerms(text),
                breachClauses: this.extractBreachClauses(text),
                keyTerms: this.extractKeyTerms(text)
            },
            summary: '',
            sensitiveWords: this.detectSensitiveWords(text),
            riskLevel: 'low'
        };

        // 生成摘要
        result.summary = this.generateContractSummary(result.extracted);

        // 评估风险等级
        result.riskLevel = this.assessRiskLevel(result.sensitiveWords);

        this.analysisHistory.push(result);
        return result;
    }

    /**
     * 提取合同编号
     */
    extractContractNumber(text) {
        const patterns = [
            /(?:合同编号|合同号)[:：]\s*([A-Z0-9\-]+)/,
            /编号[:：]\s*([A-Z0-9\-]+)/
        ];

        for (const pattern of patterns) {
            const match = text.match(pattern);
            if (match) {
                return match[1].trim();
            }
        }

        return null;
    }

    /**
     * 提取合同双方
     */
    extractParties(text) {
        const parties = {
            partyA: null,
            partyB: null
        };

        const partyAPattern = /(?:甲方|委托方|采购方)[:：]\s*(.+?)(?:\n|$)/;
        const partyBPattern = /(?:乙方|受托方|供应方|承包方)[:：]\s*(.+?)(?:\n|$)/;

        const matchA = text.match(partyAPattern);
        if (matchA) {
            parties.partyA = matchA[1].trim();
        }

        const matchB = text.match(partyBPattern);
        if (matchB) {
            parties.partyB = matchB[1].trim();
        }

        return parties;
    }

    /**
     * 提取合同金额
     */
    extractContractAmount(text) {
        const patterns = [
            /(?:合同金额|合同总价|总金额)[:：]\s*([\d,.]+)\s*(?:元|万元)/,
            /(?:人民币|￥|¥)\s*([\d,.]+)\s*(?:元|万元)/
        ];

        for (const pattern of patterns) {
            const match = text.match(pattern);
            if (match) {
                return match[1].replace(/,/g, '');
            }
        }

        return null;
    }

    /**
     * 提取履约期限
     */
    extractDuration(text) {
        const patterns = [
            /(?:履约期限|合同期限|工期)[:：]\s*(.+?)(?:\n|$)/,
            /(\d+)\s*(?:天|日|个月|年)/
        ];

        for (const pattern of patterns) {
            const match = text.match(pattern);
            if (match) {
                return match[1].trim();
            }
        }

        return null;
    }

    /**
     * 提取开始日期
     */
    extractStartDate(text) {
        const patterns = [
            /(?:开始日期|起始日期|生效日期)[:：]\s*(\d{4}[-年]\d{1,2}[-月]\d{1,2}[日]?)/
        ];

        for (const pattern of patterns) {
            const match = text.match(pattern);
            if (match) {
                return match[1].replace(/[年月]/g, '-').replace(/日/g, '');
            }
        }

        return null;
    }

    /**
     * 提取结束日期
     */
    extractEndDate(text) {
        const patterns = [
            /(?:结束日期|终止日期|到期日期)[:：]\s*(\d{4}[-年]\d{1,2}[-月]\d{1,2}[日]?)/
        ];

        for (const pattern of patterns) {
            const match = text.match(pattern);
            if (match) {
                return match[1].replace(/[年月]/g, '-').replace(/日/g, '');
            }
        }

        return null;
    }

    /**
     * 提取付款条款
     */
    extractPaymentTerms(text) {
        const terms = [];
        const patterns = [
            /(?:付款方式|支付方式|付款条件)[:：]\s*(.+?)(?:\n\n|$)/s,
            /(?:预付|首付|尾款).*?(\d+)%/g
        ];

        for (const pattern of patterns) {
            let match;
            if (pattern.global) {
                while ((match = pattern.exec(text)) !== null) {
                    terms.push(match[0].trim());
                }
            } else {
                match = text.match(pattern);
                if (match) {
                    const lines = match[1].split('\n').filter(l => l.trim());
                    terms.push(...lines);
                }
            }
        }

        return terms;
    }

    /**
     * 提取违约条款
     */
    extractBreachClauses(text) {
        const clauses = [];
        const patterns = [
            /(?:违约责任|违约条款)[:：]\s*(.+?)(?:\n\n|$)/s,
            /违约.*?(?:赔偿|承担|支付).*?(\d+)%/g
        ];

        for (const pattern of patterns) {
            let match;
            if (pattern.global) {
                while ((match = pattern.exec(text)) !== null) {
                    clauses.push(match[0].trim());
                }
            } else {
                match = text.match(pattern);
                if (match) {
                    const lines = match[1].split('\n').filter(l => l.trim());
                    clauses.push(...lines);
                }
            }
        }

        return clauses;
    }

    /**
     * 提取关键条款
     */
    extractKeyTerms(text) {
        const terms = [];
        const keywords = ['保密', '知识产权', '争议解决', '不可抗力', '终止条件'];

        keywords.forEach(keyword => {
            const pattern = new RegExp(`${keyword}.*?[:：]\\s*(.+?)(?:\\n\\n|$)`, 's');
            const match = text.match(pattern);
            if (match) {
                terms.push({
                    type: keyword,
                    content: match[1].trim().substring(0, 200)
                });
            }
        });

        return terms;
    }

    /**
     * 生成合同摘要
     */
    generateContractSummary(extracted) {
        const parts = [];
        
        if (extracted.contractNumber) {
            parts.push(`合同编号：${extracted.contractNumber}`);
        }
        
        if (extracted.parties.partyA && extracted.parties.partyB) {
            parts.push(`${extracted.parties.partyA}与${extracted.parties.partyB}签订`);
        }
        
        if (extracted.amount) {
            parts.push(`金额：${extracted.amount}元`);
        }
        
        if (extracted.duration) {
            parts.push(`期限：${extracted.duration}`);
        }

        return parts.join('，') + '。';
    }

    /**
     * 检测敏感词
     */
    detectSensitiveWords(text) {
        const detected = [];

        Object.entries(this.sensitiveWords).forEach(([category, words]) => {
            words.forEach(word => {
                const regex = new RegExp(word, 'g');
                let match;
                while ((match = regex.exec(text)) !== null) {
                    // 获取上下文
                    const start = Math.max(0, match.index - 20);
                    const end = Math.min(text.length, match.index + word.length + 20);
                    const context = text.substring(start, end);

                    detected.push({
                        word: word,
                        category: category,
                        position: match.index,
                        context: context,
                        line: text.substring(0, match.index).split('\n').length
                    });
                }
            });
        });

        return detected;
    }

    /**
     * 评估风险等级
     */
    assessRiskLevel(sensitiveWords, additionalRisks = []) {
        let score = 0;

        // 敏感词评分
        sensitiveWords.forEach(sw => {
            if (sw.category === 'corruption' || sw.category === 'violation') {
                score += 10;
            } else if (sw.category === 'discrimination' || sw.category === 'financial') {
                score += 5;
            } else {
                score += 3;
            }
        });

        // 额外风险评分
        additionalRisks.forEach(risk => {
            if (risk.level === 'high') {
                score += 10;
            } else if (risk.level === 'medium') {
                score += 5;
            } else {
                score += 2;
            }
        });

        if (score >= 20) return 'high';
        if (score >= 10) return 'medium';
        return 'low';
    }

    /**
     * 批量分析文档
     */
    async batchAnalyze(documents) {
        const results = [];
        const startTime = Date.now();

        // 并行处理文档
        const promises = documents.map(async (doc, index) => {
            return new Promise((resolve) => {
                setTimeout(() => {
                    let result;
                    switch (doc.type) {
                        case 'meeting_minutes':
                            result = this.analyzeMeetingMinutes(doc.content);
                            break;
                        case 'tender_document':
                            result = this.analyzeTenderDocument(doc.content);
                            break;
                        case 'contract':
                            result = this.analyzeContract(doc.content);
                            break;
                        default:
                            result = {
                                type: 'unknown',
                                error: '未知文档类型'
                            };
                    }
                    result.documentId = doc.id;
                    result.documentName = doc.name;
                    resolve(result);
                }, index * 100); // 模拟异步处理
            });
        });

        const analysisResults = await Promise.all(promises);
        results.push(...analysisResults);

        const endTime = Date.now();
        const duration = endTime - startTime;

        return {
            totalDocuments: documents.length,
            successCount: results.filter(r => !r.error).length,
            failureCount: results.filter(r => r.error).length,
            duration: duration,
            results: results,
            summary: this.generateBatchSummary(results)
        };
    }

    /**
     * 生成批量分析摘要
     */
    generateBatchSummary(results) {
        const summary = {
            totalSensitiveWords: 0,
            highRiskCount: 0,
            mediumRiskCount: 0,
            lowRiskCount: 0,
            byType: {}
        };

        results.forEach(result => {
            if (result.error) return;

            // 统计敏感词
            if (result.sensitiveWords) {
                summary.totalSensitiveWords += result.sensitiveWords.length;
            }

            // 统计风险等级
            if (result.riskLevel === 'high') summary.highRiskCount++;
            else if (result.riskLevel === 'medium') summary.mediumRiskCount++;
            else summary.lowRiskCount++;

            // 按类型统计
            if (!summary.byType[result.type]) {
                summary.byType[result.type] = 0;
            }
            summary.byType[result.type]++;
        });

        return summary;
    }

    /**
     * 添加自定义敏感词
     */
    addSensitiveWords(category, words) {
        if (!this.sensitiveWords[category]) {
            this.sensitiveWords[category] = [];
        }
        this.sensitiveWords[category].push(...words);
    }

    /**
     * 获取分析历史
     */
    getAnalysisHistory(limit = 10) {
        return this.analysisHistory.slice(-limit);
    }

    /**
     * 清除分析历史
     */
    clearHistory() {
        this.analysisHistory = [];
    }
}

// 导出服务
window.TextAnalysisService = TextAnalysisService;
