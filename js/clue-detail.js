/**
 * 线索详情页面脚本
 */

const ClueDetail = {
    // 当前线索数据
    currentClue: null,
    
    // 初始化
    init() {
        // 从 URL 获取线索 ID
        const urlParams = new URLSearchParams(window.location.search);
        const clueId = urlParams.get('id');
        
        if (clueId) {
            this.loadClueDetail(clueId);
        } else {
            this.showError('未找到线索信息');
        }
        
        // 初始化事件监听
        this.initEventListeners();
    },
    
    // 初始化事件监听
    initEventListeners() {
        // 监听部门选择变化，更新责任人列表
        const deptSelect = document.getElementById('assign-department');
        if (deptSelect) {
            deptSelect.addEventListener('change', () => {
                this.updateResponsiblePersons();
            });
        }
    },
    
    // 加载线索详情
    loadClueDetail(clueId) {
        // 模拟数据加载
        // 实际应用中应该从后端 API 获取数据
        this.currentClue = this.getMockClueData(clueId);
        
        if (this.currentClue) {
            this.renderClueDetail();
            this.renderTimeline();
            this.renderEvidenceList();
            this.updateButtonStates();
        } else {
            this.showError('线索不存在');
        }
    },
    
    // 获取模拟数据
    getMockClueData(clueId) {
        return {
            id: clueId,
            number: 'XS202510210001',
            title: '科研经费异常报销线索',
            riskLevel: 'high',
            status: 'pending',
            sourceType: '规则引擎',
            responsibleDept: '计算机学院',
            responsiblePerson: '张三',
            deadline: '2025-10-28',
            createTime: '2025-10-21 10:30',
            creator: '系统管理员',
            description: `系统监测到计算机学院张三教授在2025年10月期间存在多笔异常报销记录，具体表现为：
                <ul>
                    <li>连续3天内提交5笔报销申请，总金额达50,000元</li>
                    <li>发票号码存在连号情况（发票号：12345678-12345682）</li>
                    <li>报销时间集中在非工作时段（晚上22:00-23:00）</li>
                    <li>部分发票开具单位与科研项目预算科目不符</li>
                </ul>
                <p>该行为触发了科研经费异常报销预警规则，需要进一步核查。</p>`,
            involvedObjects: [
                {
                    type: 'person',
                    name: '张三',
                    detail: '计算机学院 / 教授 / 工号：20180001'
                },
                {
                    type: 'department',
                    name: '计算机学院',
                    detail: '二级学院 / 负责人：李四'
                },
                {
                    type: 'project',
                    name: '人工智能算法研究项目',
                    detail: '项目编号：KY2024001 / 预算：500,000元'
                }
            ],
            amount: {
                total: 50000,
                remaining: 320000,
                executionRate: 36
            },
            tags: ['科研经费', '异常报销', '连号发票', '规则引擎'],
            records: [
                {
                    time: '2025-10-21 10:30',
                    action: '线索创建',
                    operator: '系统管理员',
                    content: '系统自动识别科研经费异常报销风险，创建线索记录。',
                    icon: 'fa-plus-circle'
                },
                {
                    time: '2025-10-21 14:20',
                    action: '初步审核',
                    operator: '李四',
                    content: '经初步审核，该线索具有较高风险，建议立即分发给相关部门进行核查。',
                    icon: 'fa-check-circle'
                },
                {
                    time: '2025-10-21 16:45',
                    action: '补充材料',
                    operator: '王五',
                    content: '已上传相关报销凭证和发票扫描件共5份，供核查使用。',
                    icon: 'fa-file-upload'
                }
            ],
            evidences: [
                {
                    id: 1,
                    name: '报销申请表_20251015.pdf',
                    type: 'pdf',
                    size: '2.3 MB',
                    uploadTime: '2025-10-21 16:45',
                    uploader: '王五'
                },
                {
                    id: 2,
                    name: '发票扫描件_001.jpg',
                    type: 'image',
                    size: '1.8 MB',
                    uploadTime: '2025-10-21 16:46',
                    uploader: '王五'
                },
                {
                    id: 3,
                    name: '发票扫描件_002.jpg',
                    type: 'image',
                    size: '1.9 MB',
                    uploadTime: '2025-10-21 16:46',
                    uploader: '王五'
                },
                {
                    id: 4,
                    name: '项目预算表.xlsx',
                    type: 'excel',
                    size: '156 KB',
                    uploadTime: '2025-10-21 16:47',
                    uploader: '王五'
                },
                {
                    id: 5,
                    name: '审批流程截图.png',
                    type: 'image',
                    size: '892 KB',
                    uploadTime: '2025-10-21 16:48',
                    uploader: '王五'
                }
            ]
        };
    },
    
    // 渲染线索详情
    renderClueDetail() {
        const clue = this.currentClue;
        
        // 更新面包屑
        document.getElementById('breadcrumb-title').textContent = clue.title;
        
        // 更新风险等级
        const riskBadge = document.getElementById('risk-badge');
        riskBadge.className = `risk-badge ${clue.riskLevel}`;
        const riskText = {
            high: '高风险',
            medium: '中风险',
            low: '低风险'
        };
        document.getElementById('risk-level').textContent = riskText[clue.riskLevel];
        
        // 更新标题和元信息
        document.getElementById('clue-title').textContent = clue.title;
        document.getElementById('clue-number').textContent = clue.number;
        document.getElementById('clue-date').textContent = clue.createTime;
        document.getElementById('clue-creator').textContent = clue.creator;
        
        // 更新状态
        const statusBadge = document.getElementById('status-badge');
        const statusText = {
            pending: '待处理',
            assigned: '已分发',
            investigating: '核查中',
            rectifying: '整改中',
            completed: '已完成',
            archived: '已归档'
        };
        statusBadge.textContent = statusText[clue.status];
        statusBadge.className = `status-badge ${clue.status}`;
        
        // 更新基本信息
        document.getElementById('source-type').textContent = clue.sourceType;
        document.getElementById('responsible-dept').textContent = clue.responsibleDept;
        document.getElementById('responsible-person').textContent = clue.responsiblePerson;
        document.getElementById('deadline').textContent = clue.deadline;
        
        // 更新描述
        document.getElementById('clue-description').innerHTML = clue.description;
        
        // 更新涉及对象
        this.renderInvolvedObjects(clue.involvedObjects);
        
        // 更新金额信息
        const amountInfo = document.querySelector('.amount-info');
        amountInfo.innerHTML = `
            <div class="amount-item">
                <label>异常报销总额</label>
                <div class="amount-value highlight">¥${clue.amount.total.toLocaleString()}.00</div>
            </div>
            <div class="amount-item">
                <label>项目剩余预算</label>
                <div class="amount-value">¥${clue.amount.remaining.toLocaleString()}.00</div>
            </div>
            <div class="amount-item">
                <label>预算执行率</label>
                <div class="amount-value">${clue.amount.executionRate}%</div>
            </div>
        `;
        
        // 更新标签
        const tagsList = document.getElementById('tags-list');
        const tagClasses = ['tag-primary', 'tag-warning', 'tag-danger', 'tag-info'];
        tagsList.innerHTML = clue.tags.map((tag, index) => 
            `<span class="tag ${tagClasses[index % tagClasses.length]}">${tag}</span>`
        ).join('');
    },
    
    // 渲染涉及对象
    renderInvolvedObjects(objects) {
        const container = document.getElementById('involved-objects');
        const iconMap = {
            person: 'fa-user',
            department: 'fa-building',
            project: 'fa-project-diagram',
            company: 'fa-briefcase'
        };
        
        container.innerHTML = objects.map(obj => `
            <div class="object-item">
                <div class="object-icon">
                    <i class="fas ${iconMap[obj.type]}"></i>
                </div>
                <div class="object-info">
                    <div class="object-name">${obj.name}</div>
                    <div class="object-detail">${obj.detail}</div>
                </div>
            </div>
        `).join('');
    },
    
    // 渲染时间线
    renderTimeline() {
        const timeline = document.getElementById('timeline');
        const records = this.currentClue.records;
        
        timeline.innerHTML = records.map(record => `
            <div class="timeline-item">
                <div class="timeline-dot">
                    <i class="fas ${record.icon}"></i>
                </div>
                <div class="timeline-content">
                    <div class="timeline-header">
                        <div class="timeline-title">${record.action}</div>
                        <div class="timeline-time">${record.time}</div>
                    </div>
                    <div class="timeline-body">${record.content}</div>
                    <div class="timeline-footer">
                        <i class="fas fa-user"></i> ${record.operator}
                    </div>
                </div>
            </div>
        `).join('');
    },
    
    // 渲染证据材料列表
    renderEvidenceList() {
        const evidenceList = document.getElementById('evidence-list');
        const evidences = this.currentClue.evidences;
        
        const iconMap = {
            pdf: 'fa-file-pdf',
            image: 'fa-file-image',
            excel: 'fa-file-excel',
            word: 'fa-file-word',
            default: 'fa-file'
        };
        
        evidenceList.innerHTML = evidences.map(evidence => `
            <div class="evidence-item">
                <div class="evidence-preview">
                    <i class="fas ${iconMap[evidence.type] || iconMap.default}"></i>
                </div>
                <div class="evidence-info">
                    <div class="evidence-name" title="${evidence.name}">${evidence.name}</div>
                    <div class="evidence-meta">${evidence.size} · ${evidence.uploadTime}</div>
                </div>
                <div class="evidence-actions">
                    <button class="btn btn-sm btn-secondary" onclick="ClueDetail.viewEvidence(${evidence.id})">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-secondary" onclick="ClueDetail.downloadEvidence(${evidence.id})">
                        <i class="fas fa-download"></i>
                    </button>
                </div>
            </div>
        `).join('');
    },
    
    // 切换标签页
    switchTab(tabName) {
        // 更新标签按钮状态
        document.querySelectorAll('.tab-button').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        
        // 更新标签页内容
        document.querySelectorAll('.tab-pane').forEach(pane => {
            pane.classList.remove('active');
        });
        document.getElementById(`tab-${tabName}`).classList.add('active');
    },
    
    // 更新按钮状态（根据线索状态和权限）
    updateButtonStates() {
        const status = this.currentClue.status;
        const btnAssign = document.getElementById('btn-assign');
        const btnInvestigate = document.getElementById('btn-investigate');
        const btnRectify = document.getElementById('btn-rectify');
        const btnArchive = document.getElementById('btn-archive');
        
        // 根据状态控制按钮可用性
        switch (status) {
            case 'pending':
                // 待处理：可以分发
                btnAssign.disabled = false;
                btnInvestigate.disabled = true;
                btnRectify.disabled = true;
                btnArchive.disabled = true;
                break;
            case 'assigned':
                // 已分发：可以核查
                btnAssign.disabled = true;
                btnInvestigate.disabled = false;
                btnRectify.disabled = true;
                btnArchive.disabled = true;
                break;
            case 'investigating':
                // 核查中：可以整改或归档
                btnAssign.disabled = true;
                btnInvestigate.disabled = true;
                btnRectify.disabled = false;
                btnArchive.disabled = false;
                break;
            case 'rectifying':
                // 整改中：可以归档
                btnAssign.disabled = true;
                btnInvestigate.disabled = true;
                btnRectify.disabled = true;
                btnArchive.disabled = false;
                break;
            case 'completed':
            case 'archived':
                // 已完成/已归档：所有按钮禁用
                btnAssign.disabled = true;
                btnInvestigate.disabled = true;
                btnRectify.disabled = true;
                btnArchive.disabled = true;
                break;
        }
    },
    
    // 分发线索
    assignClue() {
        this.openModal('assign-modal');
    },
    
    // 确认分发
    confirmAssign() {
        const department = document.getElementById('assign-department').value;
        const person = document.getElementById('assign-person').value;
        const deadline = document.getElementById('assign-deadline').value;
        const priority = document.getElementById('assign-priority').value;
        const note = document.getElementById('assign-note').value;
        
        if (!department || !person || !deadline) {
            alert('请填写必填项');
            return;
        }
        
        // 模拟分发操作
        console.log('分发线索:', {
            clueId: this.currentClue.id,
            department,
            person,
            deadline,
            priority,
            note
        });
        
        // 更新状态
        this.currentClue.status = 'assigned';
        this.renderClueDetail();
        this.updateButtonStates();
        
        // 添加处置记录
        this.currentClue.records.unshift({
            time: new Date().toLocaleString('zh-CN', { 
                year: 'numeric', 
                month: '2-digit', 
                day: '2-digit', 
                hour: '2-digit', 
                minute: '2-digit' 
            }).replace(/\//g, '-'),
            action: '线索分发',
            operator: '当前用户',
            content: `已将线索分发给${department}的${person}，要求在${deadline}前完成处置。优先级：${priority}。${note ? '备注：' + note : ''}`,
            icon: 'fa-share'
        });
        this.renderTimeline();
        
        this.closeModal('assign-modal');
        this.showSuccess('分发成功');
    },
    
    // 核查线索
    investigateClue() {
        if (confirm('确认开始核查该线索吗？')) {
            // 模拟核查操作
            this.currentClue.status = 'investigating';
            this.renderClueDetail();
            this.updateButtonStates();
            
            // 添加处置记录
            this.currentClue.records.unshift({
                time: new Date().toLocaleString('zh-CN', { 
                    year: 'numeric', 
                    month: '2-digit', 
                    day: '2-digit', 
                    hour: '2-digit', 
                    minute: '2-digit' 
                }).replace(/\//g, '-'),
                action: '开始核查',
                operator: '当前用户',
                content: '已组建核查组，开始对该线索进行详细核查。',
                icon: 'fa-search'
            });
            this.renderTimeline();
            
            this.showSuccess('已开始核查');
        }
    },
    
    // 整改线索
    rectifyClue() {
        if (confirm('确认将该线索转入整改流程吗？')) {
            // 模拟整改操作
            this.currentClue.status = 'rectifying';
            this.renderClueDetail();
            this.updateButtonStates();
            
            // 添加处置记录
            this.currentClue.records.unshift({
                time: new Date().toLocaleString('zh-CN', { 
                    year: 'numeric', 
                    month: '2-digit', 
                    day: '2-digit', 
                    hour: '2-digit', 
                    minute: '2-digit' 
                }).replace(/\//g, '-'),
                action: '转入整改',
                operator: '当前用户',
                content: '核查完成，确认存在问题，已转入整改流程。',
                icon: 'fa-wrench'
            });
            this.renderTimeline();
            
            this.showSuccess('已转入整改');
        }
    },
    
    // 归档线索
    archiveClue() {
        if (confirm('确认归档该线索吗？归档后将无法再进行操作。')) {
            // 模拟归档操作
            this.currentClue.status = 'archived';
            this.renderClueDetail();
            this.updateButtonStates();
            
            // 添加处置记录
            this.currentClue.records.unshift({
                time: new Date().toLocaleString('zh-CN', { 
                    year: 'numeric', 
                    month: '2-digit', 
                    day: '2-digit', 
                    hour: '2-digit', 
                    minute: '2-digit' 
                }).replace(/\//g, '-'),
                action: '线索归档',
                operator: '当前用户',
                content: '线索处置完成，已归档。',
                icon: 'fa-archive'
            });
            this.renderTimeline();
            
            this.showSuccess('归档成功');
        }
    },
    
    // 上传证据
    uploadEvidence() {
        alert('上传证据功能（需要实现文件上传）');
    },
    
    // 批量下载证据
    downloadAll() {
        alert('批量下载功能（需要实现文件打包下载）');
    },
    
    // 查看证据
    viewEvidence(evidenceId) {
        alert(`查看证据 ID: ${evidenceId}`);
    },
    
    // 下载证据
    downloadEvidence(evidenceId) {
        alert(`下载证据 ID: ${evidenceId}`);
    },
    
    // 重置关系图谱
    resetGraph() {
        alert('重置关系图谱视图');
    },
    
    // 展开关系图谱
    expandGraph() {
        alert('展开关联节点');
    },
    
    // 更新责任人列表
    updateResponsiblePersons() {
        const deptSelect = document.getElementById('assign-department');
        const personSelect = document.getElementById('assign-person');
        const dept = deptSelect.value;
        
        // 模拟根据部门获取人员列表
        const persons = {
            dept1: ['张三', '李四', '王五'],
            dept2: ['赵六', '钱七', '孙八'],
            dept3: ['周九', '吴十', '郑十一'],
            dept4: ['王十二', '李十三', '张十四'],
            dept5: ['刘十五', '陈十六', '杨十七']
        };
        
        personSelect.innerHTML = '<option value="">请选择责任人</option>';
        if (dept && persons[dept]) {
            persons[dept].forEach(person => {
                const option = document.createElement('option');
                option.value = person;
                option.textContent = person;
                personSelect.appendChild(option);
            });
        }
    },
    
    // 返回列表
    goBack() {
        window.location.href = 'clue-library.html';
    },
    
    // 打开模态框
    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
        }
    },
    
    // 关闭模态框
    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
            // 重置表单
            const form = modal.querySelector('form');
            if (form) {
                form.reset();
            }
        }
    },
    
    // 显示成功消息
    showSuccess(message) {
        alert(message);
        // 实际应用中应该使用 Toast 组件
    },
    
    // 显示错误消息
    showError(message) {
        alert(message);
        // 实际应用中应该使用 Toast 组件
    }
};

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    ClueDetail.init();
});
