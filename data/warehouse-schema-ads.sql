-- =====================================================
-- ADS层 (Application Data Store) - 应用层表结构
-- 面向应用的数据集市,直接支撑业务查询和报表
-- 创建指标数据表和报表数据表
-- =====================================================

-- =====================================================
-- 监督指标数据集市
-- =====================================================

-- ADS: 综合监督指标表
CREATE TABLE IF NOT EXISTS ads_supervision_metrics (
    metric_id VARCHAR(50) PRIMARY KEY,
    metric_date DATE NOT NULL,
    department_id VARCHAR(50),
    department_name VARCHAR(200),
    -- 预警指标
    total_alert_count INT DEFAULT 0,
    high_alert_count INT DEFAULT 0,
    medium_alert_count INT DEFAULT 0,
    low_alert_count INT DEFAULT 0,
    alert_resolution_rate DECIMAL(5,2) DEFAULT 0,
    -- 线索指标
    total_clue_count INT DEFAULT 0,
    clue_completion_rate DECIMAL(5,2) DEFAULT 0,
    -- 整改指标
    total_rectification_count INT DEFAULT 0,
    rectification_completion_rate DECIMAL(5,2) DEFAULT 0,
    rectification_on_time_rate DECIMAL(5,2) DEFAULT 0,
    -- 风险指标
    high_risk_project_count INT DEFAULT 0,
    high_risk_supplier_count INT DEFAULT 0,
    risk_score DECIMAL(5,2) DEFAULT 0,
    -- 合规指标
    compliance_rate DECIMAL(5,2) DEFAULT 0,
    violation_count INT DEFAULT 0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_supervision_metrics (metric_date, department_id)
);

CREATE INDEX idx_ads_supervision_date ON ads_supervision_metrics(metric_date);
CREATE INDEX idx_ads_supervision_dept ON ads_supervision_metrics(department_id);

-- ADS: 预算执行指标表
CREATE TABLE IF NOT EXISTS ads_budget_execution_metrics (
    metric_id VARCHAR(50) PRIMARY KEY,
    metric_date DATE NOT NULL,
    department_id VARCHAR(50),
    department_name VARCHAR(200),
    budget_year INT,
    -- 预算指标
    total_budget DECIMAL(18,2) DEFAULT 0,
    total_expense DECIMAL(18,2) DEFAULT 0,
    total_remaining DECIMAL(18,2) DEFAULT 0,
    execution_rate DECIMAL(5,2) DEFAULT 0,
    -- 超预算指标
    over_budget_amount DECIMAL(18,2) DEFAULT 0,
    over_budget_item_count INT DEFAULT 0,
    -- 执行进度指标
    expected_execution_rate DECIMAL(5,2) DEFAULT 0,
    execution_deviation DECIMAL(5,2) DEFAULT 0,
    -- 三公经费指标
    three_public_budget DECIMAL(18,2) DEFAULT 0,
    three_public_expense DECIMAL(18,2) DEFAULT 0,
    three_public_execution_rate DECIMAL(5,2) DEFAULT 0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_budget_metrics (metric_date, department_id, budget_year)
);

CREATE INDEX idx_ads_budget_date ON ads_budget_execution_metrics(metric_date);
CREATE INDEX idx_ads_budget_dept ON ads_budget_execution_metrics(department_id);
CREATE INDEX idx_ads_budget_year ON ads_budget_execution_metrics(budget_year);

-- ADS: 采购监督指标表
CREATE TABLE IF NOT EXISTS ads_procurement_metrics (
    metric_id VARCHAR(50) PRIMARY KEY,
    metric_date DATE NOT NULL,
    department_id VARCHAR(50),
    department_name VARCHAR(200),
    -- 采购规模指标
    total_procurement_amount DECIMAL(18,2) DEFAULT 0,
    total_contract_amount DECIMAL(18,2) DEFAULT 0,
    project_count INT DEFAULT 0,
    -- 采购方式指标
    public_bidding_count INT DEFAULT 0,
    public_bidding_rate DECIMAL(5,2) DEFAULT 0,
    single_source_count INT DEFAULT 0,
    single_source_rate DECIMAL(5,2) DEFAULT 0,
    -- 节约指标
    total_savings_amount DECIMAL(18,2) DEFAULT 0,
    avg_savings_rate DECIMAL(5,2) DEFAULT 0,
    -- 合规指标
    compliance_rate DECIMAL(5,2) DEFAULT 0,
    violation_count INT DEFAULT 0,
    -- 风险指标
    high_risk_count INT DEFAULT 0,
    split_procurement_count INT DEFAULT 0,
    related_party_count INT DEFAULT 0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_procurement_metrics (metric_date, department_id)
);

CREATE INDEX idx_ads_procurement_date ON ads_procurement_metrics(metric_date);
CREATE INDEX idx_ads_procurement_dept ON ads_procurement_metrics(department_id);

-- ADS: 科研监督指标表
CREATE TABLE IF NOT EXISTS ads_research_metrics (
    metric_id VARCHAR(50) PRIMARY KEY,
    metric_date DATE NOT NULL,
    department_id VARCHAR(50),
    department_name VARCHAR(200),
    -- 项目规模指标
    total_funding DECIMAL(18,2) DEFAULT 0,
    total_spent DECIMAL(18,2) DEFAULT 0,
    project_count INT DEFAULT 0,
    -- 项目类型指标
    national_project_count INT DEFAULT 0,
    provincial_project_count INT DEFAULT 0,
    horizontal_project_count INT DEFAULT 0,
    -- 执行进度指标
    avg_spending_rate DECIMAL(5,2) DEFAULT 0,
    overbudget_count INT DEFAULT 0,
    delayed_count INT DEFAULT 0,
    -- 合规指标
    compliance_rate DECIMAL(5,2) DEFAULT 0,
    violation_count INT DEFAULT 0,
    -- 风险指标
    high_risk_count INT DEFAULT 0,
    misuse_count INT DEFAULT 0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_research_metrics (metric_date, department_id)
);

CREATE INDEX idx_ads_research_date ON ads_research_metrics(metric_date);
CREATE INDEX idx_ads_research_dept ON ads_research_metrics(department_id);

-- ADS: 资产监督指标表
CREATE TABLE IF NOT EXISTS ads_asset_metrics (
    metric_id VARCHAR(50) PRIMARY KEY,
    metric_date DATE NOT NULL,
    department_id VARCHAR(50),
    department_name VARCHAR(200),
    -- 资产规模指标
    total_asset_value DECIMAL(18,2) DEFAULT 0,
    total_net_value DECIMAL(18,2) DEFAULT 0,
    asset_count INT DEFAULT 0,
    -- 资产状态指标
    in_use_count INT DEFAULT 0,
    idle_count INT DEFAULT 0,
    idle_rate DECIMAL(5,2) DEFAULT 0,
    -- 使用效率指标
    avg_utilization_rate DECIMAL(5,2) DEFAULT 0,
    low_utilization_count INT DEFAULT 0,
    -- 变动指标
    new_asset_count INT DEFAULT 0,
    disposed_asset_count INT DEFAULT 0,
    transfer_count INT DEFAULT 0,
    -- 风险指标
    missing_count INT DEFAULT 0,
    unauthorized_disposal_count INT DEFAULT 0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_asset_metrics (metric_date, department_id)
);

CREATE INDEX idx_ads_asset_date ON ads_asset_metrics(metric_date);
CREATE INDEX idx_ads_asset_dept ON ads_asset_metrics(department_id);

-- =====================================================
-- 报表数据集市
-- =====================================================

-- ADS: 部门监督看板数据
CREATE TABLE IF NOT EXISTS ads_dept_supervision_dashboard (
    dashboard_id VARCHAR(50) PRIMARY KEY,
    department_id VARCHAR(50) NOT NULL,
    department_name VARCHAR(200),
    report_date DATE NOT NULL,
    -- 预警统计
    alert_total INT DEFAULT 0,
    alert_high INT DEFAULT 0,
    alert_pending INT DEFAULT 0,
    alert_resolved INT DEFAULT 0,
    -- 线索统计
    clue_total INT DEFAULT 0,
    clue_investigating INT DEFAULT 0,
    clue_completed INT DEFAULT 0,
    -- 整改统计
    rectification_total INT DEFAULT 0,
    rectification_pending INT DEFAULT 0,
    rectification_completed INT DEFAULT 0,
    rectification_overdue INT DEFAULT 0,
    -- 风险评级
    risk_level VARCHAR(20),
    risk_score DECIMAL(5,2),
    -- 排名
    alert_rank INT,
    compliance_rank INT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_dept_dashboard (department_id, report_date)
);

CREATE INDEX idx_ads_dept_dashboard_dept ON ads_dept_supervision_dashboard(department_id);
CREATE INDEX idx_ads_dept_dashboard_date ON ads_dept_supervision_dashboard(report_date);

-- ADS: 预算执行报表数据
CREATE TABLE IF NOT EXISTS ads_budget_execution_report (
    report_id VARCHAR(50) PRIMARY KEY,
    department_id VARCHAR(50) NOT NULL,
    department_name VARCHAR(200),
    budget_year INT NOT NULL,
    report_month INT NOT NULL,
    -- 预算数据
    annual_budget DECIMAL(18,2),
    ytd_budget DECIMAL(18,2), -- 年初至今预算
    monthly_budget DECIMAL(18,2),
    -- 支出数据
    ytd_expense DECIMAL(18,2),
    monthly_expense DECIMAL(18,2),
    -- 执行率
    ytd_execution_rate DECIMAL(5,2),
    monthly_execution_rate DECIMAL(5,2),
    -- 进度对比
    time_progress DECIMAL(5,2), -- 时间进度
    budget_progress DECIMAL(5,2), -- 预算进度
    progress_deviation DECIMAL(5,2), -- 进度偏差
    -- 预测
    predicted_year_end_expense DECIMAL(18,2),
    predicted_surplus DECIMAL(18,2),
    -- 预警标识
    is_over_budget BOOLEAN DEFAULT FALSE,
    is_under_execution BOOLEAN DEFAULT FALSE,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_budget_report (department_id, budget_year, report_month)
);

CREATE INDEX idx_ads_budget_report_dept ON ads_budget_execution_report(department_id);
CREATE INDEX idx_ads_budget_report_year ON ads_budget_execution_report(budget_year);

-- ADS: 采购分析报表数据
CREATE TABLE IF NOT EXISTS ads_procurement_analysis_report (
    report_id VARCHAR(50) PRIMARY KEY,
    department_id VARCHAR(50),
    department_name VARCHAR(200),
    report_year INT NOT NULL,
    report_quarter INT NOT NULL,
    -- 采购统计
    total_projects INT,
    total_amount DECIMAL(18,2),
    avg_project_amount DECIMAL(18,2),
    -- 采购方式分布
    public_bidding_amount DECIMAL(18,2),
    invitation_bidding_amount DECIMAL(18,2),
    inquiry_amount DECIMAL(18,2),
    single_source_amount DECIMAL(18,2),
    -- 供应商分析
    total_suppliers INT,
    new_suppliers INT,
    top_supplier_concentration DECIMAL(5,2), -- 前5供应商集中度
    -- 节约分析
    total_savings DECIMAL(18,2),
    savings_rate DECIMAL(5,2),
    -- 风险分析
    high_risk_projects INT,
    related_party_transactions INT,
    split_procurements INT,
    -- 合规分析
    compliant_projects INT,
    compliance_rate DECIMAL(5,2),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_procurement_report (department_id, report_year, report_quarter)
);

CREATE INDEX idx_ads_procurement_report_dept ON ads_procurement_analysis_report(department_id);
CREATE INDEX idx_ads_procurement_report_date ON ads_procurement_analysis_report(report_year, report_quarter);

-- ADS: 科研项目监控报表数据
CREATE TABLE IF NOT EXISTS ads_research_monitoring_report (
    report_id VARCHAR(50) PRIMARY KEY,
    project_id VARCHAR(50) NOT NULL,
    project_code VARCHAR(100),
    project_name VARCHAR(200),
    principal_investigator VARCHAR(100),
    department_id VARCHAR(50),
    department_name VARCHAR(200),
    report_date DATE NOT NULL,
    -- 项目基本信息
    project_type VARCHAR(50),
    project_level VARCHAR(50),
    start_date DATE,
    end_date DATE,
    -- 经费情况
    total_funding DECIMAL(18,2),
    spent_amount DECIMAL(18,2),
    remaining_amount DECIMAL(18,2),
    spending_rate DECIMAL(5,2),
    -- 进度情况
    project_progress DECIMAL(5,2),
    time_progress DECIMAL(5,2),
    progress_deviation DECIMAL(5,2),
    -- 支出分析
    equipment_expense DECIMAL(18,2),
    material_expense DECIMAL(18,2),
    travel_expense DECIMAL(18,2),
    labor_expense DECIMAL(18,2),
    -- 风险标识
    is_overbudget BOOLEAN DEFAULT FALSE,
    is_delayed BOOLEAN DEFAULT FALSE,
    has_misuse BOOLEAN DEFAULT FALSE,
    risk_level VARCHAR(20),
    -- 预警信息
    alert_count INT DEFAULT 0,
    latest_alert TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_research_report (project_id, report_date)
);

CREATE INDEX idx_ads_research_report_project ON ads_research_monitoring_report(project_id);
CREATE INDEX idx_ads_research_report_dept ON ads_research_monitoring_report(department_id);
CREATE INDEX idx_ads_research_report_date ON ads_research_monitoring_report(report_date);

-- ADS: 供应商评估报表数据
CREATE TABLE IF NOT EXISTS ads_supplier_evaluation_report (
    report_id VARCHAR(50) PRIMARY KEY,
    supplier_id VARCHAR(50) NOT NULL,
    supplier_name VARCHAR(200),
    report_year INT NOT NULL,
    report_quarter INT NOT NULL,
    -- 交易统计
    contract_count INT,
    total_contract_amount DECIMAL(18,2),
    total_paid_amount DECIMAL(18,2),
    cooperating_dept_count INT,
    -- 履约情况
    on_time_delivery_rate DECIMAL(5,2),
    quality_pass_rate DECIMAL(5,2),
    service_satisfaction DECIMAL(5,2),
    -- 问题统计
    complaint_count INT,
    penalty_count INT,
    contract_breach_count INT,
    -- 风险评估
    risk_level VARCHAR(20),
    risk_score DECIMAL(5,2),
    blacklist_flag BOOLEAN DEFAULT FALSE,
    -- 关联关系
    has_related_party BOOLEAN DEFAULT FALSE,
    related_party_desc TEXT,
    -- 综合评价
    overall_score DECIMAL(5,2),
    evaluation_grade VARCHAR(10), -- A, B, C, D
    recommendation TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_supplier_report (supplier_id, report_year, report_quarter)
);

CREATE INDEX idx_ads_supplier_report_supplier ON ads_supplier_evaluation_report(supplier_id);
CREATE INDEX idx_ads_supplier_report_date ON ads_supplier_evaluation_report(report_year, report_quarter);
CREATE INDEX idx_ads_supplier_report_risk ON ads_supplier_evaluation_report(risk_level);

-- ADS: 审批效率报表数据
CREATE TABLE IF NOT EXISTS ads_approval_efficiency_report (
    report_id VARCHAR(50) PRIMARY KEY,
    department_id VARCHAR(50),
    department_name VARCHAR(200),
    report_year INT NOT NULL,
    report_month INT NOT NULL,
    -- 审批统计
    total_approval_count INT,
    approved_count INT,
    rejected_count INT,
    approval_rate DECIMAL(5,2),
    -- 效率指标
    avg_approval_duration INT, -- 平均审批时长(分钟)
    max_approval_duration INT,
    min_approval_duration INT,
    -- 异常统计
    timeout_count INT,
    timeout_rate DECIMAL(5,2),
    skip_count INT,
    unauthorized_count INT,
    -- 业务类型分布
    budget_approval_count INT,
    procurement_approval_count INT,
    expense_approval_count INT,
    contract_approval_count INT,
    -- 改进建议
    bottleneck_nodes TEXT,
    optimization_suggestions TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_approval_report (department_id, report_year, report_month)
);

CREATE INDEX idx_ads_approval_report_dept ON ads_approval_efficiency_report(department_id);
CREATE INDEX idx_ads_approval_report_date ON ads_approval_efficiency_report(report_year, report_month);

-- =====================================================
-- 领导驾驶舱数据集市
-- =====================================================

-- ADS: 领导驾驶舱综合数据
CREATE TABLE IF NOT EXISTS ads_leadership_cockpit (
    cockpit_id VARCHAR(50) PRIMARY KEY,
    report_date DATE NOT NULL UNIQUE,
    -- 监督概况
    total_alert_count INT DEFAULT 0,
    high_alert_count INT DEFAULT 0,
    alert_resolution_rate DECIMAL(5,2) DEFAULT 0,
    total_clue_count INT DEFAULT 0,
    clue_completion_rate DECIMAL(5,2) DEFAULT 0,
    -- 预算执行
    total_budget DECIMAL(18,2) DEFAULT 0,
    total_expense DECIMAL(18,2) DEFAULT 0,
    budget_execution_rate DECIMAL(5,2) DEFAULT 0,
    over_budget_dept_count INT DEFAULT 0,
    -- 采购监督
    total_procurement_amount DECIMAL(18,2) DEFAULT 0,
    procurement_compliance_rate DECIMAL(5,2) DEFAULT 0,
    procurement_savings_rate DECIMAL(5,2) DEFAULT 0,
    -- 科研监督
    total_research_funding DECIMAL(18,2) DEFAULT 0,
    research_project_count INT DEFAULT 0,
    research_compliance_rate DECIMAL(5,2) DEFAULT 0,
    -- 资产监督
    total_asset_value DECIMAL(18,2) DEFAULT 0,
    asset_utilization_rate DECIMAL(5,2) DEFAULT 0,
    -- 风险态势
    high_risk_dept_count INT DEFAULT 0,
    high_risk_project_count INT DEFAULT 0,
    high_risk_supplier_count INT DEFAULT 0,
    overall_risk_level VARCHAR(20),
    -- 趋势指标
    alert_mom_growth DECIMAL(5,2) DEFAULT 0, -- 预警环比增长
    expense_mom_growth DECIMAL(5,2) DEFAULT 0, -- 支出环比增长
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_ads_cockpit_date ON ads_leadership_cockpit(report_date);

-- ADS: 部门排名数据
CREATE TABLE IF NOT EXISTS ads_department_ranking (
    ranking_id VARCHAR(50) PRIMARY KEY,
    report_date DATE NOT NULL,
    department_id VARCHAR(50) NOT NULL,
    department_name VARCHAR(200),
    -- 预警排名
    alert_count INT,
    alert_rank INT,
    alert_percentile DECIMAL(5,2),
    -- 合规排名
    compliance_rate DECIMAL(5,2),
    compliance_rank INT,
    compliance_percentile DECIMAL(5,2),
    -- 预算执行排名
    budget_execution_rate DECIMAL(5,2),
    budget_execution_rank INT,
    -- 整改排名
    rectification_completion_rate DECIMAL(5,2),
    rectification_rank INT,
    -- 综合评分
    overall_score DECIMAL(5,2),
    overall_rank INT,
    grade VARCHAR(10), -- A, B, C, D
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_dept_ranking (report_date, department_id)
);

CREATE INDEX idx_ads_ranking_date ON ads_department_ranking(report_date);
CREATE INDEX idx_ads_ranking_dept ON ads_department_ranking(department_id);
CREATE INDEX idx_ads_ranking_overall ON ads_department_ranking(overall_rank);

-- =====================================================
-- 预测分析数据集市
-- =====================================================

-- ADS: 预算执行预测数据
CREATE TABLE IF NOT EXISTS ads_budget_forecast (
    forecast_id VARCHAR(50) PRIMARY KEY,
    department_id VARCHAR(50) NOT NULL,
    budget_year INT NOT NULL,
    forecast_date DATE NOT NULL,
    -- 历史数据
    ytd_expense DECIMAL(18,2),
    ytd_execution_rate DECIMAL(5,2),
    -- 预测数据
    predicted_year_end_expense DECIMAL(18,2),
    predicted_execution_rate DECIMAL(5,2),
    predicted_surplus DECIMAL(18,2),
    -- 预测区间
    lower_bound DECIMAL(18,2),
    upper_bound DECIMAL(18,2),
    confidence_level DECIMAL(5,2),
    -- 预警
    is_predicted_overbudget BOOLEAN DEFAULT FALSE,
    is_predicted_underexecution BOOLEAN DEFAULT FALSE,
    risk_level VARCHAR(20),
    -- 建议
    recommendations TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_budget_forecast (department_id, budget_year, forecast_date)
);

CREATE INDEX idx_ads_forecast_dept ON ads_budget_forecast(department_id);
CREATE INDEX idx_ads_forecast_year ON ads_budget_forecast(budget_year);
CREATE INDEX idx_ads_forecast_date ON ads_budget_forecast(forecast_date);

-- ADS: 风险预测数据
CREATE TABLE IF NOT EXISTS ads_risk_forecast (
    forecast_id VARCHAR(50) PRIMARY KEY,
    forecast_date DATE NOT NULL,
    department_id VARCHAR(50),
    risk_category VARCHAR(100),
    -- 当前风险
    current_risk_score DECIMAL(5,2),
    current_risk_level VARCHAR(20),
    -- 预测风险
    predicted_risk_score DECIMAL(5,2),
    predicted_risk_level VARCHAR(20),
    risk_trend VARCHAR(20), -- INCREASING, DECREASING, STABLE
    -- 风险因素
    risk_factors TEXT,
    contributing_factors TEXT,
    -- 预防措施
    prevention_measures TEXT,
    priority VARCHAR(20),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_ads_risk_forecast_date ON ads_risk_forecast(forecast_date);
CREATE INDEX idx_ads_risk_forecast_dept ON ads_risk_forecast(department_id);
CREATE INDEX idx_ads_risk_forecast_category ON ads_risk_forecast(risk_category);

-- =====================================================
-- 数据刷新日志
-- =====================================================

-- ADS层数据刷新日志
CREATE TABLE IF NOT EXISTS ads_refresh_log (
    log_id VARCHAR(50) PRIMARY KEY,
    table_name VARCHAR(100),
    refresh_type VARCHAR(20),
    refresh_start_time TIMESTAMP,
    refresh_end_time TIMESTAMP,
    source_record_count INT,
    target_record_count INT,
    status VARCHAR(20),
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_ads_refresh_log_table ON ads_refresh_log(table_name);
CREATE INDEX idx_ads_refresh_log_time ON ads_refresh_log(refresh_start_time);
