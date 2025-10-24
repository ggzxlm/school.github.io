-- =====================================================
-- DWS层 (Data Warehouse Summary) - 汇总层表结构
-- 按时间、部门等维度进行轻度汇总和预聚合
-- 优化查询性能,支持快速分析
-- =====================================================

-- =====================================================
-- 按部门汇总表
-- =====================================================

-- DWS: 部门预算汇总表
CREATE TABLE IF NOT EXISTS dws_dept_budget_summary (
    summary_id VARCHAR(50) PRIMARY KEY,
    department_id VARCHAR(50) NOT NULL,
    budget_year INT NOT NULL,
    budget_month INT,
    total_budget_amount DECIMAL(18,2),
    total_approved_amount DECIMAL(18,2),
    total_adjusted_amount DECIMAL(18,2),
    budget_item_count INT,
    approval_rate DECIMAL(5,2), -- 批准率
    adjustment_rate DECIMAL(5,2), -- 调整率
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_dept_budget (department_id, budget_year, budget_month)
);

CREATE INDEX idx_dws_dept_budget_dept ON dws_dept_budget_summary(department_id);
CREATE INDEX idx_dws_dept_budget_year ON dws_dept_budget_summary(budget_year);

-- DWS: 部门支出汇总表
CREATE TABLE IF NOT EXISTS dws_dept_expense_summary (
    summary_id VARCHAR(50) PRIMARY KEY,
    department_id VARCHAR(50) NOT NULL,
    year INT NOT NULL,
    month INT NOT NULL,
    total_expense DECIMAL(18,2),
    normal_expense DECIMAL(18,2),
    three_public_expense DECIMAL(18,2),
    research_expense DECIMAL(18,2),
    expense_count INT,
    avg_expense DECIMAL(18,2),
    max_expense DECIMAL(18,2),
    supplier_count INT, -- 供应商数量
    invoice_count INT, -- 发票数量
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_dept_expense (department_id, year, month)
);

CREATE INDEX idx_dws_dept_expense_dept ON dws_dept_expense_summary(department_id);
CREATE INDEX idx_dws_dept_expense_date ON dws_dept_expense_summary(year, month);

-- DWS: 部门采购汇总表
CREATE TABLE IF NOT EXISTS dws_dept_procurement_summary (
    summary_id VARCHAR(50) PRIMARY KEY,
    department_id VARCHAR(50) NOT NULL,
    year INT NOT NULL,
    quarter INT NOT NULL,
    total_procurement_amount DECIMAL(18,2),
    total_contract_amount DECIMAL(18,2),
    total_actual_amount DECIMAL(18,2),
    total_savings_amount DECIMAL(18,2),
    avg_savings_rate DECIMAL(5,2),
    project_count INT,
    public_bidding_count INT,
    invitation_bidding_count INT,
    inquiry_count INT,
    single_source_count INT,
    supplier_count INT,
    high_risk_count INT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_dept_procurement (department_id, year, quarter)
);

CREATE INDEX idx_dws_dept_procurement_dept ON dws_dept_procurement_summary(department_id);
CREATE INDEX idx_dws_dept_procurement_date ON dws_dept_procurement_summary(year, quarter);

-- DWS: 部门科研汇总表
CREATE TABLE IF NOT EXISTS dws_dept_research_summary (
    summary_id VARCHAR(50) PRIMARY KEY,
    department_id VARCHAR(50) NOT NULL,
    year INT NOT NULL,
    quarter INT NOT NULL,
    total_funding DECIMAL(18,2),
    total_spent DECIMAL(18,2),
    total_remaining DECIMAL(18,2),
    avg_spending_rate DECIMAL(5,2),
    project_count INT,
    national_project_count INT,
    provincial_project_count INT,
    horizontal_project_count INT,
    overbudget_count INT,
    delayed_count INT,
    high_risk_count INT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_dept_research (department_id, year, quarter)
);

CREATE INDEX idx_dws_dept_research_dept ON dws_dept_research_summary(department_id);
CREATE INDEX idx_dws_dept_research_date ON dws_dept_research_summary(year, quarter);

-- DWS: 部门资产汇总表
CREATE TABLE IF NOT EXISTS dws_dept_asset_summary (
    summary_id VARCHAR(50) PRIMARY KEY,
    department_id VARCHAR(50) NOT NULL,
    year INT NOT NULL,
    month INT NOT NULL,
    total_asset_value DECIMAL(18,2),
    total_net_value DECIMAL(18,2),
    asset_count INT,
    in_use_count INT,
    idle_count INT,
    maintenance_count INT,
    scrapped_count INT,
    avg_utilization_rate DECIMAL(5,2),
    new_asset_count INT, -- 本月新增
    disposed_asset_count INT, -- 本月处置
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_dept_asset (department_id, year, month)
);

CREATE INDEX idx_dws_dept_asset_dept ON dws_dept_asset_summary(department_id);
CREATE INDEX idx_dws_dept_asset_date ON dws_dept_asset_summary(year, month);

-- =====================================================
-- 按时间汇总表
-- =====================================================

-- DWS: 日度支出汇总表
CREATE TABLE IF NOT EXISTS dws_daily_expense_summary (
    summary_id VARCHAR(50) PRIMARY KEY,
    date_id VARCHAR(8) NOT NULL UNIQUE,
    total_expense DECIMAL(18,2),
    expense_count INT,
    department_count INT,
    avg_expense DECIMAL(18,2),
    max_expense DECIMAL(18,2),
    min_expense DECIMAL(18,2),
    normal_expense DECIMAL(18,2),
    three_public_expense DECIMAL(18,2),
    research_expense DECIMAL(18,2),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_dws_daily_expense_date ON dws_daily_expense_summary(date_id);

-- DWS: 月度预算执行汇总表
CREATE TABLE IF NOT EXISTS dws_monthly_budget_execution (
    summary_id VARCHAR(50) PRIMARY KEY,
    year INT NOT NULL,
    month INT NOT NULL,
    total_budget DECIMAL(18,2),
    total_expense DECIMAL(18,2),
    total_remaining DECIMAL(18,2),
    execution_rate DECIMAL(5,2), -- 执行率
    department_count INT,
    over_budget_dept_count INT, -- 超预算部门数
    under_execution_dept_count INT, -- 执行不足部门数
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_monthly_budget (year, month)
);

CREATE INDEX idx_dws_monthly_budget_date ON dws_monthly_budget_execution(year, month);

-- DWS: 季度采购汇总表
CREATE TABLE IF NOT EXISTS dws_quarterly_procurement_summary (
    summary_id VARCHAR(50) PRIMARY KEY,
    year INT NOT NULL,
    quarter INT NOT NULL,
    total_procurement_amount DECIMAL(18,2),
    total_savings_amount DECIMAL(18,2),
    avg_savings_rate DECIMAL(5,2),
    project_count INT,
    department_count INT,
    supplier_count INT,
    public_bidding_rate DECIMAL(5,2), -- 公开招标率
    compliance_rate DECIMAL(5,2), -- 合规率
    high_risk_count INT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_quarterly_procurement (year, quarter)
);

CREATE INDEX idx_dws_quarterly_procurement_date ON dws_quarterly_procurement_summary(year, quarter);

-- DWS: 年度科研汇总表
CREATE TABLE IF NOT EXISTS dws_yearly_research_summary (
    summary_id VARCHAR(50) PRIMARY KEY,
    year INT NOT NULL UNIQUE,
    total_funding DECIMAL(18,2),
    total_spent DECIMAL(18,2),
    avg_spending_rate DECIMAL(5,2),
    project_count INT,
    department_count INT,
    researcher_count INT,
    national_project_count INT,
    provincial_project_count INT,
    horizontal_project_count INT,
    completed_project_count INT,
    in_progress_project_count INT,
    overbudget_count INT,
    delayed_count INT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_dws_yearly_research_year ON dws_yearly_research_summary(year);

-- =====================================================
-- 按供应商汇总表
-- =====================================================

-- DWS: 供应商交易汇总表
CREATE TABLE IF NOT EXISTS dws_supplier_transaction_summary (
    summary_id VARCHAR(50) PRIMARY KEY,
    supplier_id VARCHAR(50) NOT NULL,
    year INT NOT NULL,
    quarter INT NOT NULL,
    total_contract_amount DECIMAL(18,2),
    total_paid_amount DECIMAL(18,2),
    total_unpaid_amount DECIMAL(18,2),
    contract_count INT,
    department_count INT, -- 合作部门数
    avg_contract_amount DECIMAL(18,2),
    max_contract_amount DECIMAL(18,2),
    on_time_delivery_rate DECIMAL(5,2), -- 按时交付率
    quality_pass_rate DECIMAL(5,2), -- 质量合格率
    complaint_count INT, -- 投诉次数
    risk_level VARCHAR(20),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_supplier_transaction (supplier_id, year, quarter)
);

CREATE INDEX idx_dws_supplier_trans_supplier ON dws_supplier_transaction_summary(supplier_id);
CREATE INDEX idx_dws_supplier_trans_date ON dws_supplier_transaction_summary(year, quarter);
CREATE INDEX idx_dws_supplier_trans_risk ON dws_supplier_transaction_summary(risk_level);

-- =====================================================
-- 按项目汇总表
-- =====================================================

-- DWS: 项目执行汇总表
CREATE TABLE IF NOT EXISTS dws_project_execution_summary (
    summary_id VARCHAR(50) PRIMARY KEY,
    project_id VARCHAR(50) NOT NULL,
    year INT NOT NULL,
    month INT NOT NULL,
    budget_amount DECIMAL(18,2),
    spent_amount DECIMAL(18,2),
    remaining_amount DECIMAL(18,2),
    spending_rate DECIMAL(5,2),
    expense_count INT,
    supplier_count INT,
    contract_count INT,
    is_overbudget BOOLEAN,
    overbudget_amount DECIMAL(18,2),
    is_delayed BOOLEAN,
    delay_days INT,
    risk_level VARCHAR(20),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_project_execution (project_id, year, month)
);

CREATE INDEX idx_dws_project_exec_project ON dws_project_execution_summary(project_id);
CREATE INDEX idx_dws_project_exec_date ON dws_project_execution_summary(year, month);
CREATE INDEX idx_dws_project_exec_risk ON dws_project_execution_summary(risk_level);

-- =====================================================
-- 按人员汇总表
-- =====================================================

-- DWS: 人员科研汇总表
CREATE TABLE IF NOT EXISTS dws_person_research_summary (
    summary_id VARCHAR(50) PRIMARY KEY,
    person_id VARCHAR(50) NOT NULL,
    year INT NOT NULL,
    total_funding DECIMAL(18,2),
    total_spent DECIMAL(18,2),
    project_count INT,
    as_pi_count INT, -- 作为负责人的项目数
    as_member_count INT, -- 作为成员的项目数
    national_project_count INT,
    provincial_project_count INT,
    horizontal_project_count INT,
    avg_spending_rate DECIMAL(5,2),
    overbudget_count INT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_person_research (person_id, year)
);

CREATE INDEX idx_dws_person_research_person ON dws_person_research_summary(person_id);
CREATE INDEX idx_dws_person_research_year ON dws_person_research_summary(year);

-- DWS: 人员审批汇总表
CREATE TABLE IF NOT EXISTS dws_person_approval_summary (
    summary_id VARCHAR(50) PRIMARY KEY,
    person_id VARCHAR(50) NOT NULL,
    year INT NOT NULL,
    month INT NOT NULL,
    as_initiator_count INT, -- 作为发起人的审批数
    as_approver_count INT, -- 作为审批人的审批数
    approved_count INT,
    rejected_count INT,
    avg_approval_duration INT, -- 平均审批时长(分钟)
    timeout_count INT,
    skip_count INT,
    unauthorized_count INT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_person_approval (person_id, year, month)
);

CREATE INDEX idx_dws_person_approval_person ON dws_person_approval_summary(person_id);
CREATE INDEX idx_dws_person_approval_date ON dws_person_approval_summary(year, month);

-- =====================================================
-- 监督指标汇总表
-- =====================================================

-- DWS: 预警汇总表
CREATE TABLE IF NOT EXISTS dws_alert_summary (
    summary_id VARCHAR(50) PRIMARY KEY,
    year INT NOT NULL,
    month INT NOT NULL,
    department_id VARCHAR(50),
    alert_category VARCHAR(100),
    total_alert_count INT,
    high_level_count INT,
    medium_level_count INT,
    low_level_count INT,
    new_count INT,
    assigned_count INT,
    processing_count INT,
    resolved_count INT,
    ignored_count INT,
    avg_resolution_time INT, -- 平均处理时长(小时)
    resolution_rate DECIMAL(5,2), -- 处理率
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_alert_summary (year, month, department_id, alert_category)
);

CREATE INDEX idx_dws_alert_summary_date ON dws_alert_summary(year, month);
CREATE INDEX idx_dws_alert_summary_dept ON dws_alert_summary(department_id);
CREATE INDEX idx_dws_alert_summary_category ON dws_alert_summary(alert_category);

-- DWS: 线索汇总表
CREATE TABLE IF NOT EXISTS dws_clue_summary (
    summary_id VARCHAR(50) PRIMARY KEY,
    year INT NOT NULL,
    month INT NOT NULL,
    department_id VARCHAR(50),
    clue_category VARCHAR(100),
    total_clue_count INT,
    high_priority_count INT,
    medium_priority_count INT,
    low_priority_count INT,
    pending_count INT,
    investigating_count INT,
    completed_count INT,
    archived_count INT,
    avg_investigation_time INT, -- 平均调查时长(天)
    completion_rate DECIMAL(5,2), -- 完成率
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_clue_summary (year, month, department_id, clue_category)
);

CREATE INDEX idx_dws_clue_summary_date ON dws_clue_summary(year, month);
CREATE INDEX idx_dws_clue_summary_dept ON dws_clue_summary(department_id);
CREATE INDEX idx_dws_clue_summary_category ON dws_clue_summary(clue_category);

-- DWS: 整改汇总表
CREATE TABLE IF NOT EXISTS dws_rectification_summary (
    summary_id VARCHAR(50) PRIMARY KEY,
    year INT NOT NULL,
    month INT NOT NULL,
    department_id VARCHAR(50),
    total_rectification_count INT,
    pending_count INT,
    in_progress_count INT,
    completed_count INT,
    overdue_count INT,
    avg_completion_time INT, -- 平均完成时长(天)
    completion_rate DECIMAL(5,2), -- 完成率
    on_time_rate DECIMAL(5,2), -- 按时完成率
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_rectification_summary (year, month, department_id)
);

CREATE INDEX idx_dws_rectification_summary_date ON dws_rectification_summary(year, month);
CREATE INDEX idx_dws_rectification_summary_dept ON dws_rectification_summary(department_id);

-- =====================================================
-- 趋势分析表
-- =====================================================

-- DWS: 支出趋势表
CREATE TABLE IF NOT EXISTS dws_expense_trend (
    trend_id VARCHAR(50) PRIMARY KEY,
    department_id VARCHAR(50) NOT NULL,
    year INT NOT NULL,
    month INT NOT NULL,
    current_month_expense DECIMAL(18,2),
    last_month_expense DECIMAL(18,2),
    same_month_last_year_expense DECIMAL(18,2),
    mom_growth_rate DECIMAL(5,2), -- 环比增长率
    yoy_growth_rate DECIMAL(5,2), -- 同比增长率
    moving_avg_3month DECIMAL(18,2), -- 3个月移动平均
    moving_avg_6month DECIMAL(18,2), -- 6个月移动平均
    trend_direction VARCHAR(20), -- UP, DOWN, STABLE
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_expense_trend (department_id, year, month)
);

CREATE INDEX idx_dws_expense_trend_dept ON dws_expense_trend(department_id);
CREATE INDEX idx_dws_expense_trend_date ON dws_expense_trend(year, month);

-- DWS: 预警趋势表
CREATE TABLE IF NOT EXISTS dws_alert_trend (
    trend_id VARCHAR(50) PRIMARY KEY,
    year INT NOT NULL,
    month INT NOT NULL,
    alert_category VARCHAR(100),
    current_month_count INT,
    last_month_count INT,
    same_month_last_year_count INT,
    mom_growth_rate DECIMAL(5,2),
    yoy_growth_rate DECIMAL(5,2),
    moving_avg_3month DECIMAL(10,2),
    trend_direction VARCHAR(20),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_alert_trend (year, month, alert_category)
);

CREATE INDEX idx_dws_alert_trend_date ON dws_alert_trend(year, month);
CREATE INDEX idx_dws_alert_trend_category ON dws_alert_trend(alert_category);

-- =====================================================
-- 数据刷新日志表
-- =====================================================

-- DWS层数据刷新日志
CREATE TABLE IF NOT EXISTS dws_refresh_log (
    log_id VARCHAR(50) PRIMARY KEY,
    table_name VARCHAR(100),
    refresh_type VARCHAR(20), -- FULL, INCREMENTAL
    refresh_start_time TIMESTAMP,
    refresh_end_time TIMESTAMP,
    source_record_count INT,
    target_record_count INT,
    status VARCHAR(20),
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_dws_refresh_log_table ON dws_refresh_log(table_name);
CREATE INDEX idx_dws_refresh_log_time ON dws_refresh_log(refresh_start_time);
