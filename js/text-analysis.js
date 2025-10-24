/**
 * 文本智能分析页面脚本
 */

let textAnalysisService;
let currentAnalysisType = 'meeting_minutes';
let batchDocuments = [];

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initializePage();
});

/**
 * 初始化页面
 */
function initializePage() {
    // 初始化服务
    textAnalysisService = new TextAnalysisService();
    
    // 绑定分析类型按钮事件
    document.querySelectorAll('.type-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            selectAnalysisType(this.dataset.type);
        });
    });
    
    // 绑定输入框字符计数
    const input = document.getElementById('documentInput');
    input.addEventListener('input', function() {
        updateCharCount();
    });
    
    // 显示敏感词列表
    displaySensitiveWords();
    
    // 加载示例数据
    loadSampleData();
}

/**
 * 选择分析类型
 */
function selectAnalysisType(type) {
    currentAnalysisType = type;
    
    // 更新按钮状态
    document.querySelectorAll('.type-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.type === type) {
            btn.classList.add('active');
        }
    });
    
    // 切换显示区域
    const singleArea = document.getElementById('singleAnalysisArea');
    const batchArea = document.getElementById('batchAnalysisArea');
    const resultArea = document.getElementById('resultArea');
    
    if (type === 'batch') {
        singleArea.style.display = 'none';
        batchArea.style.display = 'block';
    } else {
        singleArea.style.display = 'block';
        batchArea.style.display = 'none';
        
        // 更新标题
        const titles = {
            'meeting_minutes': '会议纪要分析',
            'tender_document': '招标文件分析',
            'contract': '合同文本分析'
        };
        document.getElementById('analysisTitle').textContent = titles[type];
    }
    
    // 隐藏结果区域
    resultArea.style.display = 'none';
}

/**
 * 更新字符计数
 */
function updateCharCount() {
    const input = document.getElementById('documentInput');
    const count = input.value.length;
    document.getElementById('charCount').textContent = count;
}

/**
 * 清空输入
 */
function clearInput() {
    document.getElementById('documentInput').value = '';
    updateCharCount();
    document.getElementById('resultArea').style.display = 'none';
}

/**
 * 分析单个文档
 */
function analyzeSingleDocument() {
    const input = document.getElementById('documentInput');
    const text = input.value.trim();
    
    if (!text) {
        alert('请输入文本内容');
        return;
    }
    
    // 显示加载状态
    showLoading();
    
    // 延迟执行分析，模拟处理时间
    setTimeout(() => {
        let result;
        
        switch (currentAnalysisType) {
            case 'meeting_minutes':
                result = textAnalysisService.analyzeMeetingMinutes(text);
                break;
            case 'tender_document':
                result = textAnalysisService.analyzeTenderDocument(text);
                break;
            case 'contract':
                result = textAnalysisService.analyzeContract(text);
                break;
        }
        
        displaySingleResult(result);
        hideLoading();
    }, 500);
}

/**
 * 显示单个文档分析结果
 */
function displaySingleResult(result) {
    const resultArea = document.getElementById('resultArea');
    const resultContent = document.getElementById('resultContent');
    
    let html = '';
    
    // 摘要和风险等级
    html += `
        <div class="result-summary">
            <h3>分析摘要</h3>
            <p style="font-size: 16px; margin: 10px 0;">${result.summary}</p>
            <div class="summary-stats">
                <div class="stat-item">
                    <div class="stat-value">${getRiskIcon(result.riskLevel)}</div>
                    <div class="stat-label">风险等级: ${getRiskLabel(result.riskLevel)}</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${result.sensitiveWords.length}</div>
                    <div class="stat-label">敏感词数量</div>
                </div>
            </div>
        </div>
    `;
    
    // 根据类型显示不同的提取信息
    if (result.type === 'meeting_minutes') {
        html += displayMeetingResult(result);
    } else if (result.type === 'tender_document') {
        html += displayTenderResult(result);
    } else if (result.type === 'contract') {
        html += displayContractResult(result);
    }
    
    // 敏感词检测结果
    if (result.sensitiveWords.length > 0) {
        html += displaySensitiveWordsResult(result.sensitiveWords);
    }
    
    resultContent.innerHTML = html;
    resultArea.style.display = 'block';
    
    // 滚动到结果区域
    resultArea.scrollIntoView({ behavior: 'smooth' });
}

/**
 * 显示会议纪要分析结果
 */
function displayMeetingResult(result) {
    const extracted = result.extracted;
    let html = '<div class="result-section"><h4>📋 提取信息</h4><div class="extracted-info">';
    
    if (extracted.topic) {
        html += `
            <div class="info-item">
                <div class="info-label">会议主题:</div>
                <div class="info-value">${extracted.topic}</div>
            </div>
        `;
    }
    
    if (extracted.date) {
        html += `
            <div class="info-item">
                <div class="info-label">会议日期:</div>
                <div class="info-value">${extracted.date}</div>
            </div>
        `;
    }
    
    if (extracted.location) {
        html += `
            <div class="info-item">
                <div class="info-label">会议地点:</div>
                <div class="info-value">${extracted.location}</div>
            </div>
        `;
    }
    
    if (extracted.participants.length > 0) {
        html += `
            <div class="info-item">
                <div class="info-label">参会人员:</div>
                <div class="info-value">${extracted.participants.join('、')}</div>
            </div>
        `;
    }
    
    if (extracted.decisions.length > 0) {
        html += `
            <div class="info-item">
                <div class="info-label">决策事项:</div>
                <div class="info-value">
                    <ul class="info-list">
                        ${extracted.decisions.map(d => `<li>${d}</li>`).join('')}
                    </ul>
                </div>
            </div>
        `;
    }
    
    if (extracted.actionItems.length > 0) {
        html += `
            <div class="info-item">
                <div class="info-label">行动事项:</div>
                <div class="info-value">
                    <ul class="info-list">
                        ${extracted.actionItems.map(a => `<li>${a}</li>`).join('')}
                    </ul>
                </div>
            </div>
        `;
    }
    
    html += '</div></div>';
    return html;
}

/**
 * 显示招标文件分析结果
 */
function displayTenderResult(result) {
    const extracted = result.extracted;
    let html = '<div class="result-section"><h4>📢 提取信息</h4><div class="extracted-info">';
    
    if (extracted.projectName) {
        html += `
            <div class="info-item">
                <div class="info-label">项目名称:</div>
                <div class="info-value">${extracted.projectName}</div>
            </div>
        `;
    }
    
    if (extracted.budget) {
        html += `
            <div class="info-item">
                <div class="info-label">预算金额:</div>
                <div class="info-value">${extracted.budget} 万元</div>
            </div>
        `;
    }
    
    if (extracted.deadline) {
        html += `
            <div class="info-item">
                <div class="info-label">截止时间:</div>
                <div class="info-value">${extracted.deadline}</div>
            </div>
        `;
    }
    
    if (extracted.technicalRequirements.length > 0) {
        html += `
            <div class="info-item">
                <div class="info-label">技术要求:</div>
                <div class="info-value">
                    <ul class="info-list">
                        ${extracted.technicalRequirements.slice(0, 5).map(r => `<li>${r}</li>`).join('')}
                        ${extracted.technicalRequirements.length > 5 ? `<li>...还有 ${extracted.technicalRequirements.length - 5} 项</li>` : ''}
                    </ul>
                </div>
            </div>
        `;
    }
    
    if (extracted.qualificationRequirements.length > 0) {
        html += `
            <div class="info-item">
                <div class="info-label">资质要求:</div>
                <div class="info-value">
                    <ul class="info-list">
                        ${extracted.qualificationRequirements.slice(0, 5).map(r => `<li>${r}</li>`).join('')}
                        ${extracted.qualificationRequirements.length > 5 ? `<li>...还有 ${extracted.qualificationRequirements.length - 5} 项</li>` : ''}
                    </ul>
                </div>
            </div>
        `;
    }
    
    html += '</div></div>';
    
    // 风险提示
    if (result.risks.length > 0) {
        html += '<div class="result-section"><h4>⚠️ 风险提示</h4>';
        result.risks.forEach(risk => {
            html += `
                <div class="risk-alert ${risk.level}">
                    <div class="risk-header">
                        <span class="risk-icon">${getRiskIcon(risk.level)}</span>
                        <span>${risk.description}</span>
                    </div>
                    ${risk.details && risk.details.length > 0 ? `
                        <div class="risk-details">
                            <ul class="info-list">
                                ${risk.details.slice(0, 3).map(d => `<li>第${d.line}行: ${d.content}</li>`).join('')}
                            </ul>
                        </div>
                    ` : ''}
                </div>
            `;
        });
        html += '</div>';
    }
    
    return html;
}

/**
 * 显示合同文本分析结果
 */
function displayContractResult(result) {
    const extracted = result.extracted;
    let html = '<div class="result-section"><h4>📝 提取信息</h4><div class="extracted-info">';
    
    if (extracted.contractNumber) {
        html += `
            <div class="info-item">
                <div class="info-label">合同编号:</div>
                <div class="info-value">${extracted.contractNumber}</div>
            </div>
        `;
    }
    
    if (extracted.parties.partyA || extracted.parties.partyB) {
        html += `
            <div class="info-item">
                <div class="info-label">合同双方:</div>
                <div class="info-value">
                    甲方: ${extracted.parties.partyA || '未识别'}<br>
                    乙方: ${extracted.parties.partyB || '未识别'}
                </div>
            </div>
        `;
    }
    
    if (extracted.amount) {
        html += `
            <div class="info-item">
                <div class="info-label">合同金额:</div>
                <div class="info-value">${extracted.amount} 元</div>
            </div>
        `;
    }
    
    if (extracted.duration) {
        html += `
            <div class="info-item">
                <div class="info-label">履约期限:</div>
                <div class="info-value">${extracted.duration}</div>
            </div>
        `;
    }
    
    if (extracted.startDate || extracted.endDate) {
        html += `
            <div class="info-item">
                <div class="info-label">合同期限:</div>
                <div class="info-value">
                    ${extracted.startDate || '未识别'} 至 ${extracted.endDate || '未识别'}
                </div>
            </div>
        `;
    }
    
    if (extracted.paymentTerms.length > 0) {
        html += `
            <div class="info-item">
                <div class="info-label">付款条款:</div>
                <div class="info-value">
                    <ul class="info-list">
                        ${extracted.paymentTerms.map(t => `<li>${t}</li>`).join('')}
                    </ul>
                </div>
            </div>
        `;
    }
    
    if (extracted.breachClauses.length > 0) {
        html += `
            <div class="info-item">
                <div class="info-label">违约条款:</div>
                <div class="info-value">
                    <ul class="info-list">
                        ${extracted.breachClauses.map(c => `<li>${c}</li>`).join('')}
                    </ul>
                </div>
            </div>
        `;
    }
    
    if (extracted.keyTerms.length > 0) {
        html += `
            <div class="info-item">
                <div class="info-label">关键条款:</div>
                <div class="info-value">
                    <ul class="info-list">
                        ${extracted.keyTerms.map(t => `<li><strong>${t.type}:</strong> ${t.content}</li>`).join('')}
                    </ul>
                </div>
            </div>
        `;
    }
    
    html += '</div></div>';
    return html;
}

/**
 * 显示敏感词检测结果
 */
function displaySensitiveWordsResult(sensitiveWords) {
    let html = '<div class="result-section"><h4>🚨 敏感词检测</h4>';
    
    sensitiveWords.forEach(sw => {
        const context = sw.context.replace(
            sw.word,
            `<span class="highlight">${sw.word}</span>`
        );
        
        html += `
            <div class="sensitive-word-item">
                <div class="sensitive-word-header">
                    <div>
                        <span class="word-badge">${sw.word}</span>
                        <span style="margin-left: 10px; color: #8c8c8c;">类别: ${getCategoryLabel(sw.category)}</span>
                    </div>
                    <div class="word-position">第 ${sw.line} 行</div>
                </div>
                <div class="word-context">...${context}...</div>
            </div>
        `;
    });
    
    html += '</div>';
    return html;
}

/**
 * 处理文件选择
 */
function handleFileSelect(event) {
    const files = event.target.files;
    
    for (let file of files) {
        if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
            const reader = new FileReader();
            reader.onload = function(e) {
                addBatchDocument({
                    id: Date.now() + Math.random(),
                    name: file.name,
                    type: guessDocumentType(file.name),
                    content: e.target.result,
                    size: file.size
                });
            };
            reader.readAsText(file);
        }
    }
    
    // 清空文件输入
    event.target.value = '';
}

/**
 * 猜测文档类型
 */
function guessDocumentType(filename) {
    const lower = filename.toLowerCase();
    if (lower.includes('会议') || lower.includes('纪要')) return 'meeting_minutes';
    if (lower.includes('招标') || lower.includes('采购')) return 'tender_document';
    if (lower.includes('合同')) return 'contract';
    return 'meeting_minutes'; // 默认
}

/**
 * 添加批量文档
 */
function addBatchDocument(doc) {
    batchDocuments.push(doc);
    displayBatchDocuments();
}

/**
 * 显示批量文档列表
 */
function displayBatchDocuments() {
    const listEl = document.getElementById('documentList');
    
    if (batchDocuments.length === 0) {
        listEl.innerHTML = '<p style="text-align: center; color: #8c8c8c; padding: 20px;">暂无文档</p>';
        return;
    }
    
    let html = '';
    batchDocuments.forEach((doc, index) => {
        const typeLabels = {
            'meeting_minutes': '会议纪要',
            'tender_document': '招标文件',
            'contract': '合同'
        };
        
        html += `
            <div class="document-item">
                <div class="document-info">
                    <div class="document-icon">📄</div>
                    <div class="document-details">
                        <h4>${doc.name}</h4>
                        <p>类型: ${typeLabels[doc.type]} | 大小: ${formatFileSize(doc.size)}</p>
                    </div>
                </div>
                <div class="document-actions">
                    <button class="btn btn-secondary btn-sm" onclick="removeBatchDocument(${index})">删除</button>
                </div>
            </div>
        `;
    });
    
    listEl.innerHTML = html;
}

/**
 * 移除批量文档
 */
function removeBatchDocument(index) {
    batchDocuments.splice(index, 1);
    displayBatchDocuments();
}

/**
 * 清空批量文档
 */
function clearBatchDocuments() {
    batchDocuments = [];
    displayBatchDocuments();
}

/**
 * 开始批量分析
 */
async function startBatchAnalysis() {
    if (batchDocuments.length === 0) {
        alert('请先添加文档');
        return;
    }
    
    showLoading();
    
    try {
        const result = await textAnalysisService.batchAnalyze(batchDocuments);
        displayBatchResult(result);
    } catch (error) {
        console.error('批量分析失败:', error);
        alert('批量分析失败，请重试');
    } finally {
        hideLoading();
    }
}

/**
 * 显示批量分析结果
 */
function displayBatchResult(result) {
    const resultArea = document.getElementById('resultArea');
    const resultContent = document.getElementById('resultContent');
    
    let html = `
        <div class="result-summary">
            <h3>批量分析完成</h3>
            <p>共分析 ${result.totalDocuments} 个文档，耗时 ${(result.duration / 1000).toFixed(2)} 秒</p>
        </div>
        
        <div class="batch-result-summary">
            <div class="batch-stat-card">
                <div class="value">${result.successCount}</div>
                <div class="label">成功</div>
            </div>
            <div class="batch-stat-card">
                <div class="value" style="color: #ff4d4f;">${result.summary.highRiskCount}</div>
                <div class="label">高风险</div>
            </div>
            <div class="batch-stat-card">
                <div class="value" style="color: #faad14;">${result.summary.mediumRiskCount}</div>
                <div class="label">中风险</div>
            </div>
            <div class="batch-stat-card">
                <div class="value" style="color: #52c41a;">${result.summary.lowRiskCount}</div>
                <div class="label">低风险</div>
            </div>
            <div class="batch-stat-card">
                <div class="value">${result.summary.totalSensitiveWords}</div>
                <div class="label">敏感词总数</div>
            </div>
        </div>
        
        <div class="result-section">
            <h4>📊 分析详情</h4>
            <div class="batch-results-list">
    `;
    
    result.results.forEach(item => {
        if (item.error) {
            html += `
                <div class="batch-result-item">
                    <div class="batch-result-header">
                        <h4>❌ ${item.documentName}</h4>
                        <span class="risk-badge" style="background: #d9d9d9;">错误</span>
                    </div>
                    <p style="color: #ff4d4f;">${item.error}</p>
                </div>
            `;
        } else {
            html += `
                <div class="batch-result-item">
                    <div class="batch-result-header">
                        <h4>📄 ${item.documentName}</h4>
                        <span class="risk-badge ${item.riskLevel}">${getRiskLabel(item.riskLevel)}</span>
                    </div>
                    <div class="batch-result-summary-text">${item.summary}</div>
                    <div class="batch-result-details">
                        <span>敏感词: ${item.sensitiveWords.length} 个</span>
                        ${item.risks ? `<span>风险项: ${item.risks.length} 个</span>` : ''}
                    </div>
                </div>
            `;
        }
    });
    
    html += '</div></div>';
    
    resultContent.innerHTML = html;
    resultArea.style.display = 'block';
    resultArea.scrollIntoView({ behavior: 'smooth' });
}

/**
 * 显示敏感词列表
 */
function displaySensitiveWords() {
    const categories = {
        corruption: 'corruptionWords',
        discrimination: 'discriminationWords',
        violation: 'violationWords',
        relationship: 'relationshipWords',
        financial: 'financialWords'
    };
    
    Object.entries(categories).forEach(([category, elementId]) => {
        const words = textAnalysisService.sensitiveWords[category];
        const html = words.map(word => `<span class="word-tag">${word}</span>`).join('');
        document.getElementById(elementId).innerHTML = html;
    });
}

/**
 * 切换敏感词面板
 */
function toggleSensitiveWordsPanel() {
    const panel = document.getElementById('sensitiveWordsPanel');
    const icon = document.getElementById('toggleIcon');
    
    if (panel.style.display === 'none') {
        panel.style.display = 'block';
        icon.textContent = '▲';
    } else {
        panel.style.display = 'none';
        icon.textContent = '▼';
    }
}

/**
 * 添加敏感词
 */
function addSensitiveWord() {
    const category = document.getElementById('wordCategory').value;
    const word = document.getElementById('newWord').value.trim();
    
    if (!word) {
        alert('请输入敏感词');
        return;
    }
    
    textAnalysisService.addSensitiveWords(category, [word]);
    document.getElementById('newWord').value = '';
    displaySensitiveWords();
    
    showMessage('敏感词添加成功');
}

/**
 * 导出结果
 */
function exportResult() {
    const resultContent = document.getElementById('resultContent');
    const text = resultContent.innerText;
    
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `文本分析结果_${new Date().getTime()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
}

/**
 * 加载示例数据
 */
function loadSampleData() {
    // 可以在这里加载一些示例文本
}

// 辅助函数
function getRiskIcon(level) {
    const icons = {
        high: '🔴',
        medium: '🟡',
        low: '🟢'
    };
    return icons[level] || '⚪';
}

function getRiskLabel(level) {
    const labels = {
        high: '高风险',
        medium: '中风险',
        low: '低风险'
    };
    return labels[level] || '未知';
}

function getCategoryLabel(category) {
    const labels = {
        corruption: '腐败类',
        discrimination: '歧视类',
        violation: '违规类',
        relationship: '关系类',
        financial: '财务类'
    };
    return labels[category] || category;
}

function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

function showLoading() {
    // 可以显示加载动画
    console.log('Loading...');
}

function hideLoading() {
    // 隐藏加载动画
    console.log('Loading complete');
}

function showMessage(message) {
    alert(message);
}
