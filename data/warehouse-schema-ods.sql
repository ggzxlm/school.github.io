-- =====================================================
-- ODS层 (Operational Data Store) - 明细层表结构
-- 保持与源系统一致的数据结构,记录原始数据
-- =====================================================

-- ODS层通用字段说明:
-- source_system: 来源系统标识
-- load_time: 数据采集时间戳
-- load_type: 加载类型 (FULL-全量, INCREMENTAL-增量)
-- is_deleted: 逻辑删除标记

-- =====================================================
-- 财务系统相关表
-- =====================================================

-- ODS: 预算数据
CREATE TABLE IF NOT EXISTS ods_budget (
    id VARCHAR(50) PRIMARY KEY,
    budget_year INT NOT NULL,
    department_code VARCHAR(50),
    department_name VARCHAR(200),
    budget_category VARCHAR(100),
    budget_item VARCHAR(200),
    budget_amount DECIMAL(18,2),
    approved_amount DECIMAL(18,2),
    approved_date DATE,
    status VARCHAR(20),
    remarks TEXT,
    source_system VARCHAR(50) DEFAULT 'FINANCE',
    load_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    load_type VARCHAR(20) DEFAULT 'INCREMENTAL',
    is_deleted BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_ods_budget_dept ON ods_budget(department_code);
CREATE INDEX idx_ods_budget_year ON ods_budget(budget_year);
CREATE INDEX idx_ods_budget_load_time ON ods_budget(load_time);

-- ODS: 支出数据
CREATE TABLE IF NOT EXISTS ods_expense (
    id VARCHAR(50) PRIMARY KEY,
    expense_date DATE NOT NULL,
    department_code VARCHAR(50),
    department_name VARCHAR(200),
    expense_category VARCHAR(100),
    expense_item VARCHAR(200),
    amount DECIMAL(18,2),
    budget_id VARCHAR(50),
    payee VARCHAR(200),
    payment_method VARCHAR(50),
    invoice_number VARCHAR(100),
    purpose TEXT,
    approver VARCHAR(100),
    approval_date DATE,
    status VARCHAR(20),
    source_system VARCHAR(50) DEFAULT 'FINANCE',
    load_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    load_type VARCHAR(20) DEFAULT 'INCREMENTAL',
    is_deleted BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_ods_expense_dept ON ods_expense(department_code);
CREATE INDEX idx_ods_expense_date ON ods_expense(expense_date);
CREATE INDEX idx_ods_expense_load_time ON ods_expense(load_time);

-- ODS: 三公经费
CREATE TABLE IF NOT EXISTS ods_three_public_expense (
    id VARCHAR(50) PRIMARY KEY,
    expense_date DATE NOT NULL,
    department_code VARCHAR(50),
    department_name VARCHAR(200),
    expense_type VARCHAR(50), -- TRAVEL, VEHICLE, RECEPTION
    amount DECIMAL(18,2),
    destination VARCHAR(200),
    participants TEXT,
    purpose TEXT,
    days INT,
    vehicle_info VARCHAR(200),
    invoice_number VARCHAR(100),
    approver VARCHAR(100),
    approval_date DATE,
    source_system VARCHAR(50) DEFAULT 'FINANCE',
    load_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    load_type VARCHAR(20) DEFAULT 'INCREMENTAL',
    is_deleted BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_ods_three_public_dept ON ods_three_public_expense(department_code);
CREATE INDEX idx_ods_three_public_date ON ods_three_public_expense(expense_date);
CREATE INDEX idx_ods_three_public_type ON ods_three_public_expense(expense_type);

-- =====================================================
-- 采购系统相关表
-- =====================================================

-- ODS: 采购项目
CREATE TABLE IF NOT EXISTS ods_procurement (
    id VARCHAR(50) PRIMARY KEY,
    project_code VARCHAR(100),
    project_name VARCHAR(200),
    department_code VARCHAR(50),
    department_name VARCHAR(200),
    procurement_type VARCHAR(50), -- PUBLIC_BIDDING, INVITATION, INQUIRY, SINGLE_SOURCE
    procurement_method VARCHAR(50),
    budget_amount DECIMAL(18,2),
    estimated_amount DECIMAL(18,2),
    actual_amount DECIMAL(18,2),
    supplier_id VARCHAR(50),
    supplier_name VARCHAR(200),
    contract_id VARCHAR(50),
    contract_date DATE,
    start_date DATE,
    end_date DATE,
    status VARCHAR(20),
    project_manager VARCHAR(100),
    remarks TEXT,
    source_system VARCHAR(50) DEFAULT 'PROCUREMENT',
    load_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    load_type VARCHAR(20) DEFAULT 'INCREMENTAL',
    is_deleted BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_ods_procurement_dept ON ods_procurement(department_code);
CREATE INDEX idx_ods_procurement_supplier ON ods_procurement(supplier_id);
CREATE INDEX idx_ods_procurement_date ON ods_procurement(contract_date);

-- ODS: 招标信息
CREATE TABLE IF NOT EXISTS ods_bidding (
    id VARCHAR(50) PRIMARY KEY,
    bidding_code VARCHAR(100),
    procurement_id VARCHAR(50),
    project_name VARCHAR(200),
    announcement_date DATE,
    bidding_date DATE,
    opening_date DATE,
    budget_amount DECIMAL(18,2),
    qualification_requirements TEXT,
    technical_requirements TEXT,
    evaluation_criteria TEXT,
    bidder_count INT,
    status VARCHAR(20),
    source_system VARCHAR(50) DEFAULT 'PROCUREMENT',
    load_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    load_type VARCHAR(20) DEFAULT 'INCREMENTAL',
    is_deleted BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_ods_bidding_procurement ON ods_bidding(procurement_id);
CREATE INDEX idx_ods_bidding_date ON ods_bidding(announcement_date);

-- ODS: 投标记录
CREATE TABLE IF NOT EXISTS ods_bid_record (
    id VARCHAR(50) PRIMARY KEY,
    bidding_id VARCHAR(50),
    supplier_id VARCHAR(50),
    supplier_name VARCHAR(200),
    bid_amount DECIMAL(18,2),
    technical_score DECIMAL(5,2),
    commercial_score DECIMAL(5,2),
    total_score DECIMAL(5,2),
    ranking INT,
    is_winner BOOLEAN,
    bid_date DATE,
    source_system VARCHAR(50) DEFAULT 'PROCUREMENT',
    load_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    load_type VARCHAR(20) DEFAULT 'INCREMENTAL',
    is_deleted BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_ods_bid_record_bidding ON ods_bid_record(bidding_id);
CREATE INDEX idx_ods_bid_record_supplier ON ods_bid_record(supplier_id);

-- =====================================================
-- 科研系统相关表
-- =====================================================

-- ODS: 科研项目
CREATE TABLE IF NOT EXISTS ods_research_project (
    id VARCHAR(50) PRIMARY KEY,
    project_code VARCHAR(100),
    project_name VARCHAR(200),
    project_type VARCHAR(50), -- NATIONAL, PROVINCIAL, HORIZONTAL
    project_level VARCHAR(50),
    principal_investigator VARCHAR(100),
    pi_id_card VARCHAR(50),
    department_code VARCHAR(50),
    department_name VARCHAR(200),
    start_date DATE,
    end_date DATE,
    total_funding DECIMAL(18,2),
    funding_source VARCHAR(200),
    status VARCHAR(20),
    source_system VARCHAR(50) DEFAULT 'RESEARCH',
    load_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    load_type VARCHAR(20) DEFAULT 'INCREMENTAL',
    is_deleted BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_ods_research_pi ON ods_research_project(principal_investigator);
CREATE INDEX idx_ods_research_dept ON ods_research_project(department_code);
CREATE INDEX idx_ods_research_date ON ods_research_project(start_date);

-- ODS: 科研经费支出
CREATE TABLE IF NOT EXISTS ods_research_expense (
    id VARCHAR(50) PRIMARY KEY,
    project_id VARCHAR(50),
    project_code VARCHAR(100),
    expense_date DATE,
    expense_category VARCHAR(100), -- EQUIPMENT, MATERIAL, TRAVEL, LABOR, MEETING, PUBLICATION
    expense_item VARCHAR(200),
    amount DECIMAL(18,2),
    payee VARCHAR(200),
    invoice_number VARCHAR(100),
    purpose TEXT,
    approver VARCHAR(100),
    approval_date DATE,
    source_system VARCHAR(50) DEFAULT 'RESEARCH',
    load_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    load_type VARCHAR(20) DEFAULT 'INCREMENTAL',
    is_deleted BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_ods_research_expense_project ON ods_research_expense(project_id);
CREATE INDEX idx_ods_research_expense_date ON ods_research_expense(expense_date);
CREATE INDEX idx_ods_research_expense_category ON ods_research_expense(expense_category);

-- =====================================================
-- 资产系统相关表
-- =====================================================

-- ODS: 资产信息
CREATE TABLE IF NOT EXISTS ods_asset (
    id VARCHAR(50) PRIMARY KEY,
    asset_code VARCHAR(100),
    asset_name VARCHAR(200),
    asset_category VARCHAR(100),
    asset_type VARCHAR(100),
    specification TEXT,
    unit VARCHAR(20),
    quantity DECIMAL(10,2),
    unit_price DECIMAL(18,2),
    total_price DECIMAL(18,2),
    purchase_date DATE,
    supplier_id VARCHAR(50),
    supplier_name VARCHAR(200),
    department_code VARCHAR(50),
    department_name VARCHAR(200),
    custodian VARCHAR(100),
    location VARCHAR(200),
    status VARCHAR(20), -- IN_USE, IDLE, MAINTENANCE, SCRAPPED
    source_system VARCHAR(50) DEFAULT 'ASSET',
    load_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    load_type VARCHAR(20) DEFAULT 'INCREMENTAL',
    is_deleted BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_ods_asset_dept ON ods_asset(department_code);
CREATE INDEX idx_ods_asset_category ON ods_asset(asset_category);
CREATE INDEX idx_ods_asset_status ON ods_asset(status);

-- ODS: 资产变动记录
CREATE TABLE IF NOT EXISTS ods_asset_change (
    id VARCHAR(50) PRIMARY KEY,
    asset_id VARCHAR(50),
    asset_code VARCHAR(100),
    change_type VARCHAR(50), -- PURCHASE, TRANSFER, DISPOSAL, MAINTENANCE
    change_date DATE,
    from_department VARCHAR(50),
    to_department VARCHAR(50),
    from_custodian VARCHAR(100),
    to_custodian VARCHAR(100),
    reason TEXT,
    approver VARCHAR(100),
    approval_date DATE,
    source_system VARCHAR(50) DEFAULT 'ASSET',
    load_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    load_type VARCHAR(20) DEFAULT 'INCREMENTAL',
    is_deleted BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_ods_asset_change_asset ON ods_asset_change(asset_id);
CREATE INDEX idx_ods_asset_change_date ON ods_asset_change(change_date);
CREATE INDEX idx_ods_asset_change_type ON ods_asset_change(change_type);

-- =====================================================
-- 人事系统相关表
-- =====================================================

-- ODS: 人员信息
CREATE TABLE IF NOT EXISTS ods_personnel (
    id VARCHAR(50) PRIMARY KEY,
    employee_code VARCHAR(100),
    name VARCHAR(100),
    id_card VARCHAR(50),
    gender VARCHAR(10),
    birth_date DATE,
    department_code VARCHAR(50),
    department_name VARCHAR(200),
    position VARCHAR(100),
    title VARCHAR(100),
    employment_type VARCHAR(50), -- FULL_TIME, PART_TIME, CONTRACT
    entry_date DATE,
    leave_date DATE,
    status VARCHAR(20), -- ACTIVE, LEAVE, RETIRED
    phone VARCHAR(50),
    email VARCHAR(100),
    source_system VARCHAR(50) DEFAULT 'HR',
    load_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    load_type VARCHAR(20) DEFAULT 'INCREMENTAL',
    is_deleted BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_ods_personnel_dept ON ods_personnel(department_code);
CREATE INDEX idx_ods_personnel_id_card ON ods_personnel(id_card);
CREATE INDEX idx_ods_personnel_status ON ods_personnel(status);

-- ODS: 薪酬数据
CREATE TABLE IF NOT EXISTS ods_salary (
    id VARCHAR(50) PRIMARY KEY,
    employee_id VARCHAR(50),
    employee_code VARCHAR(100),
    salary_month VARCHAR(7), -- YYYY-MM
    base_salary DECIMAL(18,2),
    performance_bonus DECIMAL(18,2),
    allowance DECIMAL(18,2),
    deduction DECIMAL(18,2),
    total_salary DECIMAL(18,2),
    payment_date DATE,
    source_system VARCHAR(50) DEFAULT 'HR',
    load_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    load_type VARCHAR(20) DEFAULT 'INCREMENTAL',
    is_deleted BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_ods_salary_employee ON ods_salary(employee_id);
CREATE INDEX idx_ods_salary_month ON ods_salary(salary_month);

-- =====================================================
-- 合同系统相关表
-- =====================================================

-- ODS: 合同信息
CREATE TABLE IF NOT EXISTS ods_contract (
    id VARCHAR(50) PRIMARY KEY,
    contract_code VARCHAR(100),
    contract_name VARCHAR(200),
    contract_type VARCHAR(50), -- PROCUREMENT, SERVICE, CONSTRUCTION, RESEARCH
    party_a VARCHAR(200), -- 甲方
    party_b VARCHAR(200), -- 乙方
    party_b_id VARCHAR(50), -- 乙方ID
    contract_amount DECIMAL(18,2),
    signing_date DATE,
    start_date DATE,
    end_date DATE,
    payment_terms TEXT,
    performance_bond DECIMAL(18,2),
    department_code VARCHAR(50),
    department_name VARCHAR(200),
    contract_manager VARCHAR(100),
    status VARCHAR(20),
    source_system VARCHAR(50) DEFAULT 'CONTRACT',
    load_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    load_type VARCHAR(20) DEFAULT 'INCREMENTAL',
    is_deleted BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_ods_contract_party_b ON ods_contract(party_b_id);
CREATE INDEX idx_ods_contract_dept ON ods_contract(department_code);
CREATE INDEX idx_ods_contract_date ON ods_contract(signing_date);

-- ODS: 合同付款记录
CREATE TABLE IF NOT EXISTS ods_contract_payment (
    id VARCHAR(50) PRIMARY KEY,
    contract_id VARCHAR(50),
    contract_code VARCHAR(100),
    payment_phase VARCHAR(50),
    payment_amount DECIMAL(18,2),
    payment_date DATE,
    payment_method VARCHAR(50),
    invoice_number VARCHAR(100),
    approver VARCHAR(100),
    approval_date DATE,
    remarks TEXT,
    source_system VARCHAR(50) DEFAULT 'CONTRACT',
    load_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    load_type VARCHAR(20) DEFAULT 'INCREMENTAL',
    is_deleted BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_ods_contract_payment_contract ON ods_contract_payment(contract_id);
CREATE INDEX idx_ods_contract_payment_date ON ods_contract_payment(payment_date);

-- =====================================================
-- 招生系统相关表
-- =====================================================

-- ODS: 招生计划
CREATE TABLE IF NOT EXISTS ods_enrollment_plan (
    id VARCHAR(50) PRIMARY KEY,
    academic_year VARCHAR(10),
    department_code VARCHAR(50),
    department_name VARCHAR(200),
    major_code VARCHAR(50),
    major_name VARCHAR(200),
    degree_type VARCHAR(50), -- BACHELOR, MASTER, DOCTOR
    planned_count INT,
    actual_count INT,
    source_system VARCHAR(50) DEFAULT 'ENROLLMENT',
    load_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    load_type VARCHAR(20) DEFAULT 'INCREMENTAL',
    is_deleted BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_ods_enrollment_plan_year ON ods_enrollment_plan(academic_year);
CREATE INDEX idx_ods_enrollment_plan_dept ON ods_enrollment_plan(department_code);

-- ODS: 学生录取记录
CREATE TABLE IF NOT EXISTS ods_admission (
    id VARCHAR(50) PRIMARY KEY,
    admission_code VARCHAR(100),
    student_name VARCHAR(100),
    id_card VARCHAR(50),
    gender VARCHAR(10),
    birth_date DATE,
    academic_year VARCHAR(10),
    department_code VARCHAR(50),
    department_name VARCHAR(200),
    major_code VARCHAR(50),
    major_name VARCHAR(200),
    degree_type VARCHAR(50),
    exam_score DECIMAL(5,2),
    admission_date DATE,
    status VARCHAR(20),
    source_system VARCHAR(50) DEFAULT 'ENROLLMENT',
    load_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    load_type VARCHAR(20) DEFAULT 'INCREMENTAL',
    is_deleted BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_ods_admission_year ON ods_admission(academic_year);
CREATE INDEX idx_ods_admission_dept ON ods_admission(department_code);
CREATE INDEX idx_ods_admission_id_card ON ods_admission(id_card);

-- =====================================================
-- 审批系统相关表
-- =====================================================

-- ODS: 审批流程
CREATE TABLE IF NOT EXISTS ods_approval_flow (
    id VARCHAR(50) PRIMARY KEY,
    business_id VARCHAR(50),
    business_type VARCHAR(50), -- BUDGET, PROCUREMENT, EXPENSE, CONTRACT
    flow_name VARCHAR(200),
    initiator VARCHAR(100),
    initiate_date TIMESTAMP,
    current_node VARCHAR(100),
    status VARCHAR(20), -- PENDING, APPROVED, REJECTED, CANCELLED
    source_system VARCHAR(50),
    load_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    load_type VARCHAR(20) DEFAULT 'INCREMENTAL',
    is_deleted BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_ods_approval_flow_business ON ods_approval_flow(business_id);
CREATE INDEX idx_ods_approval_flow_type ON ods_approval_flow(business_type);
CREATE INDEX idx_ods_approval_flow_status ON ods_approval_flow(status);

-- ODS: 审批节点记录
CREATE TABLE IF NOT EXISTS ods_approval_node (
    id VARCHAR(50) PRIMARY KEY,
    flow_id VARCHAR(50),
    node_name VARCHAR(100),
    node_order INT,
    approver VARCHAR(100),
    approver_id VARCHAR(50),
    approval_action VARCHAR(20), -- APPROVE, REJECT, TRANSFER
    approval_opinion TEXT,
    approval_time TIMESTAMP,
    time_spent INT, -- 审批耗时(分钟)
    source_system VARCHAR(50),
    load_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    load_type VARCHAR(20) DEFAULT 'INCREMENTAL',
    is_deleted BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_ods_approval_node_flow ON ods_approval_node(flow_id);
CREATE INDEX idx_ods_approval_node_approver ON ods_approval_node(approver_id);

-- =====================================================
-- 供应商系统相关表
-- =====================================================

-- ODS: 供应商信息
CREATE TABLE IF NOT EXISTS ods_supplier (
    id VARCHAR(50) PRIMARY KEY,
    supplier_code VARCHAR(100),
    supplier_name VARCHAR(200),
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
    status VARCHAR(20), -- ACTIVE, BLACKLIST, SUSPENDED
    source_system VARCHAR(50) DEFAULT 'SUPPLIER',
    load_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    load_type VARCHAR(20) DEFAULT 'INCREMENTAL',
    is_deleted BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_ods_supplier_code ON ods_supplier(unified_social_credit_code);
CREATE INDEX idx_ods_supplier_status ON ods_supplier(status);

-- =====================================================
-- 数据采集元信息表
-- =====================================================

-- ODS数据加载日志
CREATE TABLE IF NOT EXISTS ods_load_log (
    id VARCHAR(50) PRIMARY KEY,
    table_name VARCHAR(100),
    source_system VARCHAR(50),
    load_type VARCHAR(20),
    load_start_time TIMESTAMP,
    load_end_time TIMESTAMP,
    records_count INT,
    success_count INT,
    failed_count INT,
    status VARCHAR(20),
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_ods_load_log_table ON ods_load_log(table_name);
CREATE INDEX idx_ods_load_log_time ON ods_load_log(load_start_time);
