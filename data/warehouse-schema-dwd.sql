-- =====================================================
-- DWD层 (Data Warehouse Detail) - 中间层表结构
-- 按主题域整合数据,建立维度表和事实表
-- 实现数据标准化和编码统一
-- =====================================================

-- =====================================================
-- 维度表 (Dimension Tables)
-- =====================================================

-- 维度表: 日期维度
CREATE TABLE IF NOT EXISTS dwd_dim_date (
    date_id VARCHAR(8) PRIMARY KEY, -- YYYYMMDD
    full_date DATE NOT NULL,
    year INT,
    quarter INT,
    month INT,
    week INT,
    day INT,
    day_of_week INT,
    day_name VARCHAR(20),
    is_weekend BOOLEAN,
    is_holiday BOOLEAN,
    holiday_name VARCHAR(100),
    fiscal_year INT,
    fiscal_quarter INT,
    fiscal_month INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_dwd_dim_date_year_month ON dwd_dim_date(year, month);
CREATE INDEX idx_dwd_dim_date_fiscal ON dwd_dim_date(fiscal_year, fiscal_quarter);

-- 维度表: 部门维度
CREATE TABLE IF NOT EXISTS dwd_dim_department (
    department_id VARCHAR(50) PRIMARY KEY,
    department_code VARCHAR(50) UNIQUE NOT NULL,
    department_name VARCHAR(200) NOT NULL,
    parent_department_id VARCHAR(50),
    department_level INT,
    department_type VARCHAR(50), -- TEACHING, RESEARCH, ADMIN, SUPPORT
    leader VARCHAR(100),
    contact_phone VARCHAR(50),
    contact_email VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    effective_date DATE,
    expiry_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_dwd_dim_dept_parent ON dwd_dim_department(parent_department_id);
CREATE INDEX idx_dwd_dim_dept_type ON dwd_dim_department(department_type);

-- 维度表: 人员维度
CREATE TABLE IF NOT EXISTS dwd_dim_person (
    person_id VARCHAR(50) PRIMARY KEY,
    employee_code VARCHAR(100),
    name VARCHAR(100) NOT NULL,
    id_card VARCHAR(50),
    gender VARCHAR(10),
    birth_date DATE,
    department_id VARCHAR(50),
    position VARCHAR(100),
    title VARCHAR(100),
    employment_type VARCHAR(50),
    entry_date DATE,
    leave_date DATE,
    status VARCHAR(20),
    phone VARCHAR(50),
    email VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    effective_date DATE,
    expiry_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (department_id) REFERENCES dwd_dim_department(department_id)
);

CREATE INDEX idx_dwd_dim_person_dept ON dwd_dim_person(department_id);
CREATE INDEX idx_dwd_dim_person_id_card ON dwd_dim_person(id_card);
CREATE INDEX idx_dwd_dim_person_status ON dwd_dim_person(status);

-- 维度表: 供应商维度
CREATE TABLE IF NOT EXISTS dwd_dim_supplier (
    supplier_id VARCHAR(50) PRIMARY KEY,
    supplier_code VARCHAR(100),
    supplier_name VARCHAR(200) NOT NULL,
    unified_social_credit_code VARCHAR(50),
    legal_representative VARCHAR(100),
    registered_capital DECIMAL(18,2),
    registration_date DATE,
    business_scope TEXT,
    contact_person VARCHAR(100),
    contact_phone VARCHAR(50),
    contact_email VARCHAR(100),
    address VARCHAR(500),
    qualification_level VARCHAR(50),
    risk_level VARCHAR(20), -- LOW, MEDIUM, HIGH
    blacklist_flag BOOLEAN DEFAULT FALSE,
    status VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    effective_date DATE,
    expiry_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_dwd_dim_supplier_code ON dwd_dim_supplier(unified_social_credit_code);
CREATE INDEX idx_dwd_dim_supplier_status ON dwd_dim_supplier(status);
CREATE INDEX idx_dwd_dim_supplier_risk ON dwd_dim_supplier(risk_level);

-- 维度表: 项目维度
CREATE TABLE IF NOT EXISTS dwd_dim_project (
    project_id VARCHAR(50) PRIMARY KEY,
    project_code VARCHAR(100) UNIQUE NOT NULL,
    project_name VARCHAR(200) NOT NULL,
    project_type VARCHAR(50), -- RESEARCH, PROCUREMENT, CONSTRUCTION
    project_category VARCHAR(100),
    department_id VARCHAR(50),
    project_manager_id VARCHAR(50),
    start_date DATE,
    end_date DATE,
    budget_amount DECIMAL(18,2),
    status VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    effective_date DATE,
    expiry_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (department_id) REFERENCES dwd_dim_department(department_id),
    FOREIGN KEY (project_manager_id) REFERENCES dwd_dim_person(person_id)
);

CREATE INDEX idx_dwd_dim_project_dept ON dwd_dim_project(department_id);
CREATE INDEX idx_dwd_dim_project_type ON dwd_dim_project(project_type);
CREATE INDEX idx_dwd_dim_project_status ON dwd_dim_project(status);

-- 维度表: 合同维度
CREATE TABLE IF NOT EXISTS dwd_dim_contract (
    contract_id VARCHAR(50) PRIMARY KEY,
    contract_code VARCHAR(100) UNIQUE NOT NULL,
    contract_name VARCHAR(200) NOT NULL,
    contract_type VARCHAR(50),
    supplier_id VARCHAR(50),
    department_id VARCHAR(50),
    contract_amount DECIMAL(18,2),
    signing_date DATE,
    start_date DATE,
    end_date DATE,
    contract_manager_id VARCHAR(50),
    status VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    effective_date DATE,
    expiry_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (supplier_id) REFERENCES dwd_dim_supplier(supplier_id),
    FOREIGN KEY (department_id) REFERENCES dwd_dim_department(department_id),
    FOREIGN KEY (contract_manager_id) REFERENCES dwd_dim_person(person_id)
);

CREATE INDEX idx_dwd_dim_contract_supplier ON dwd_dim_contract(supplier_id);
CREATE INDEX idx_dwd_dim_contract_dept ON dwd_dim_contract(department_id);
CREATE INDEX idx_dwd_dim_contract_status ON dwd_dim_contract(status);

-- 维度表: 资产类别维度
CREATE TABLE IF NOT EXISTS dwd_dim_asset_category (
    category_id VARCHAR(50) PRIMARY KEY,
    category_code VARCHAR(50) UNIQUE NOT NULL,
    category_name VARCHAR(200) NOT NULL,
    parent_category_id VARCHAR(50),
    category_level INT,
    depreciation_rate DECIMAL(5,2),
    useful_life INT, -- 使用年限(年)
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_dwd_dim_asset_cat_parent ON dwd_dim_asset_category(parent_category_id);

-- 维度表: 预算科目维度
CREATE TABLE IF NOT EXISTS dwd_dim_budget_item (
    item_id VARCHAR(50) PRIMARY KEY,
    item_code VARCHAR(50) UNIQUE NOT NULL,
    item_name VARCHAR(200) NOT NULL,
    parent_item_id VARCHAR(50),
    item_level INT,
    item_category VARCHAR(100), -- TEACHING, RESEARCH, ADMIN, INFRASTRUCTURE
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_dwd_dim_budget_item_parent ON dwd_dim_budget_item(parent_item_id);
CREATE INDEX idx_dwd_dim_budget_item_category ON dwd_dim_budget_item(item_category);

-- =====================================================
-- 事实表 (Fact Tables)
-- =====================================================

-- 事实表: 预算事实表
CREATE TABLE IF NOT EXISTS dwd_fact_budget (
    fact_id VARCHAR(50) PRIMARY KEY,
    date_id VARCHAR(8) NOT NULL,
    department_id VARCHAR(50) NOT NULL,
    budget_item_id VARCHAR(50) NOT NULL,
    budget_year INT NOT NULL,
    budget_amount DECIMAL(18,2),
    approved_amount DECIMAL(18,2),
    adjusted_amount DECIMAL(18,2),
    status VARCHAR(20),
    source_record_id VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (date_id) REFERENCES dwd_dim_date(date_id),
    FOREIGN KEY (department_id) REFERENCES dwd_dim_department(department_id),
    FOREIGN KEY (budget_item_id) REFERENCES dwd_dim_budget_item(item_id)
);

CREATE INDEX idx_dwd_fact_budget_date ON dwd_fact_budget(date_id);
CREATE INDEX idx_dwd_fact_budget_dept ON dwd_fact_budget(department_id);
CREATE INDEX idx_dwd_fact_budget_year ON dwd_fact_budget(budget_year);

-- 事实表: 支出事实表
CREATE TABLE IF NOT EXISTS dwd_fact_expense (
    fact_id VARCHAR(50) PRIMARY KEY,
    date_id VARCHAR(8) NOT NULL,
    department_id VARCHAR(50) NOT NULL,
    budget_item_id VARCHAR(50),
    person_id VARCHAR(50),
    supplier_id VARCHAR(50),
    project_id VARCHAR(50),
    contract_id VARCHAR(50),
    expense_category VARCHAR(100),
    expense_type VARCHAR(50), -- NORMAL, THREE_PUBLIC, RESEARCH
    amount DECIMAL(18,2),
    payment_method VARCHAR(50),
    invoice_number VARCHAR(100),
    approval_status VARCHAR(20),
    source_record_id VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (date_id) REFERENCES dwd_dim_date(date_id),
    FOREIGN KEY (department_id) REFERENCES dwd_dim_department(department_id),
    FOREIGN KEY (budget_item_id) REFERENCES dwd_dim_budget_item(item_id),
    FOREIGN KEY (person_id) REFERENCES dwd_dim_person(person_id),
    FOREIGN KEY (supplier_id) REFERENCES dwd_dim_supplier(supplier_id),
    FOREIGN KEY (project_id) REFERENCES dwd_dim_project(project_id),
    FOREIGN KEY (contract_id) REFERENCES dwd_dim_contract(contract_id)
);

CREATE INDEX idx_dwd_fact_expense_date ON dwd_fact_expense(date_id);
CREATE INDEX idx_dwd_fact_expense_dept ON dwd_fact_expense(department_id);
CREATE INDEX idx_dwd_fact_expense_type ON dwd_fact_expense(expense_type);
CREATE INDEX idx_dwd_fact_expense_project ON dwd_fact_expense(project_id);

-- 事实表: 采购事实表
CREATE TABLE IF NOT EXISTS dwd_fact_procurement (
    fact_id VARCHAR(50) PRIMARY KEY,
    date_id VARCHAR(8) NOT NULL,
    department_id VARCHAR(50) NOT NULL,
    supplier_id VARCHAR(50),
    contract_id VARCHAR(50),
    project_id VARCHAR(50),
    procurement_type VARCHAR(50),
    procurement_method VARCHAR(50),
    budget_amount DECIMAL(18,2),
    contract_amount DECIMAL(18,2),
    actual_amount DECIMAL(18,2),
    savings_amount DECIMAL(18,2), -- 节约金额
    savings_rate DECIMAL(5,2), -- 节约率
    bidder_count INT,
    is_compliant BOOLEAN, -- 是否合规
    risk_level VARCHAR(20),
    source_record_id VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (date_id) REFERENCES dwd_dim_date(date_id),
    FOREIGN KEY (department_id) REFERENCES dwd_dim_department(department_id),
    FOREIGN KEY (supplier_id) REFERENCES dwd_dim_supplier(supplier_id),
    FOREIGN KEY (contract_id) REFERENCES dwd_dim_contract(contract_id),
    FOREIGN KEY (project_id) REFERENCES dwd_dim_project(project_id)
);

CREATE INDEX idx_dwd_fact_procurement_date ON dwd_fact_procurement(date_id);
CREATE INDEX idx_dwd_fact_procurement_dept ON dwd_fact_procurement(department_id);
CREATE INDEX idx_dwd_fact_procurement_supplier ON dwd_fact_procurement(supplier_id);
CREATE INDEX idx_dwd_fact_procurement_risk ON dwd_fact_procurement(risk_level);

-- 事实表: 科研项目事实表
CREATE TABLE IF NOT EXISTS dwd_fact_research (
    fact_id VARCHAR(50) PRIMARY KEY,
    date_id VARCHAR(8) NOT NULL,
    department_id VARCHAR(50) NOT NULL,
    project_id VARCHAR(50) NOT NULL,
    person_id VARCHAR(50), -- 项目负责人
    project_type VARCHAR(50),
    project_level VARCHAR(50),
    total_funding DECIMAL(18,2),
    spent_amount DECIMAL(18,2),
    remaining_amount DECIMAL(18,2),
    spending_rate DECIMAL(5,2), -- 支出进度
    project_progress DECIMAL(5,2), -- 项目进度
    is_overbudget BOOLEAN,
    is_delayed BOOLEAN,
    risk_level VARCHAR(20),
    source_record_id VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (date_id) REFERENCES dwd_dim_date(date_id),
    FOREIGN KEY (department_id) REFERENCES dwd_dim_department(department_id),
    FOREIGN KEY (project_id) REFERENCES dwd_dim_project(project_id),
    FOREIGN KEY (person_id) REFERENCES dwd_dim_person(person_id)
);

CREATE INDEX idx_dwd_fact_research_date ON dwd_fact_research(date_id);
CREATE INDEX idx_dwd_fact_research_dept ON dwd_fact_research(department_id);
CREATE INDEX idx_dwd_fact_research_project ON dwd_fact_research(project_id);
CREATE INDEX idx_dwd_fact_research_risk ON dwd_fact_research(risk_level);

-- 事实表: 资产事实表
CREATE TABLE IF NOT EXISTS dwd_fact_asset (
    fact_id VARCHAR(50) PRIMARY KEY,
    date_id VARCHAR(8) NOT NULL,
    department_id VARCHAR(50) NOT NULL,
    category_id VARCHAR(50) NOT NULL,
    supplier_id VARCHAR(50),
    asset_code VARCHAR(100),
    asset_name VARCHAR(200),
    quantity DECIMAL(10,2),
    unit_price DECIMAL(18,2),
    total_price DECIMAL(18,2),
    accumulated_depreciation DECIMAL(18,2),
    net_value DECIMAL(18,2),
    custodian_id VARCHAR(50),
    location VARCHAR(200),
    status VARCHAR(20),
    utilization_rate DECIMAL(5,2), -- 使用率
    source_record_id VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (date_id) REFERENCES dwd_dim_date(date_id),
    FOREIGN KEY (department_id) REFERENCES dwd_dim_department(department_id),
    FOREIGN KEY (category_id) REFERENCES dwd_dim_asset_category(category_id),
    FOREIGN KEY (supplier_id) REFERENCES dwd_dim_supplier(supplier_id),
    FOREIGN KEY (custodian_id) REFERENCES dwd_dim_person(person_id)
);

CREATE INDEX idx_dwd_fact_asset_date ON dwd_fact_asset(date_id);
CREATE INDEX idx_dwd_fact_asset_dept ON dwd_fact_asset(department_id);
CREATE INDEX idx_dwd_fact_asset_category ON dwd_fact_asset(category_id);
CREATE INDEX idx_dwd_fact_asset_status ON dwd_fact_asset(status);

-- 事实表: 合同履约事实表
CREATE TABLE IF NOT EXISTS dwd_fact_contract_performance (
    fact_id VARCHAR(50) PRIMARY KEY,
    date_id VARCHAR(8) NOT NULL,
    contract_id VARCHAR(50) NOT NULL,
    department_id VARCHAR(50) NOT NULL,
    supplier_id VARCHAR(50) NOT NULL,
    contract_amount DECIMAL(18,2),
    paid_amount DECIMAL(18,2),
    unpaid_amount DECIMAL(18,2),
    payment_progress DECIMAL(5,2), -- 付款进度
    delivery_progress DECIMAL(5,2), -- 交付进度
    is_overdue BOOLEAN, -- 是否逾期
    overdue_days INT,
    is_compliant BOOLEAN,
    risk_level VARCHAR(20),
    source_record_id VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (date_id) REFERENCES dwd_dim_date(date_id),
    FOREIGN KEY (contract_id) REFERENCES dwd_dim_contract(contract_id),
    FOREIGN KEY (department_id) REFERENCES dwd_dim_department(department_id),
    FOREIGN KEY (supplier_id) REFERENCES dwd_dim_supplier(supplier_id)
);

CREATE INDEX idx_dwd_fact_contract_perf_date ON dwd_fact_contract_performance(date_id);
CREATE INDEX idx_dwd_fact_contract_perf_contract ON dwd_fact_contract_performance(contract_id);
CREATE INDEX idx_dwd_fact_contract_perf_risk ON dwd_fact_contract_performance(risk_level);

-- 事实表: 招生事实表
CREATE TABLE IF NOT EXISTS dwd_fact_enrollment (
    fact_id VARCHAR(50) PRIMARY KEY,
    date_id VARCHAR(8) NOT NULL,
    department_id VARCHAR(50) NOT NULL,
    academic_year VARCHAR(10),
    major_code VARCHAR(50),
    major_name VARCHAR(200),
    degree_type VARCHAR(50),
    planned_count INT,
    admitted_count INT,
    enrolled_count INT,
    completion_rate DECIMAL(5,2), -- 完成率
    average_score DECIMAL(5,2),
    source_record_id VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (date_id) REFERENCES dwd_dim_date(date_id),
    FOREIGN KEY (department_id) REFERENCES dwd_dim_department(department_id)
);

CREATE INDEX idx_dwd_fact_enrollment_date ON dwd_fact_enrollment(date_id);
CREATE INDEX idx_dwd_fact_enrollment_dept ON dwd_fact_enrollment(department_id);
CREATE INDEX idx_dwd_fact_enrollment_year ON dwd_fact_enrollment(academic_year);

-- 事实表: 审批事实表
CREATE TABLE IF NOT EXISTS dwd_fact_approval (
    fact_id VARCHAR(50) PRIMARY KEY,
    date_id VARCHAR(8) NOT NULL,
    department_id VARCHAR(50) NOT NULL,
    business_type VARCHAR(50),
    initiator_id VARCHAR(50),
    approver_id VARCHAR(50),
    approval_level INT, -- 审批层级
    approval_duration INT, -- 审批耗时(分钟)
    is_timeout BOOLEAN, -- 是否超时
    is_skipped BOOLEAN, -- 是否跳过节点
    is_unauthorized BOOLEAN, -- 是否越权
    approval_result VARCHAR(20), -- APPROVED, REJECTED
    source_record_id VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (date_id) REFERENCES dwd_dim_date(date_id),
    FOREIGN KEY (department_id) REFERENCES dwd_dim_department(department_id),
    FOREIGN KEY (initiator_id) REFERENCES dwd_dim_person(person_id),
    FOREIGN KEY (approver_id) REFERENCES dwd_dim_person(person_id)
);

CREATE INDEX idx_dwd_fact_approval_date ON dwd_fact_approval(date_id);
CREATE INDEX idx_dwd_fact_approval_dept ON dwd_fact_approval(department_id);
CREATE INDEX idx_dwd_fact_approval_type ON dwd_fact_approval(business_type);
CREATE INDEX idx_dwd_fact_approval_timeout ON dwd_fact_approval(is_timeout);

-- =====================================================
-- 数据质量和血缘追踪表
-- =====================================================

-- DWD层数据血缘表
CREATE TABLE IF NOT EXISTS dwd_data_lineage (
    lineage_id VARCHAR(50) PRIMARY KEY,
    source_table VARCHAR(100),
    source_field VARCHAR(100),
    target_table VARCHAR(100),
    target_field VARCHAR(100),
    transform_logic TEXT,
    transform_type VARCHAR(50), -- DIRECT, CALCULATE, AGGREGATE, JOIN
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_dwd_lineage_source ON dwd_data_lineage(source_table, source_field);
CREATE INDEX idx_dwd_lineage_target ON dwd_data_lineage(target_table, target_field);

-- DWD层数据质量记录表
CREATE TABLE IF NOT EXISTS dwd_data_quality_log (
    log_id VARCHAR(50) PRIMARY KEY,
    table_name VARCHAR(100),
    check_date DATE,
    total_records INT,
    valid_records INT,
    invalid_records INT,
    quality_score DECIMAL(5,2),
    check_rules TEXT,
    issues TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_dwd_quality_log_table ON dwd_data_quality_log(table_name);
CREATE INDEX idx_dwd_quality_log_date ON dwd_data_quality_log(check_date);
