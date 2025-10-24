-- =====================================================
-- 数据仓库分区和归档策略
-- 实现按时间的自动分区、冷热数据分层存储、历史数据归档
-- =====================================================

-- =====================================================
-- 分区表定义 (以PostgreSQL为例)
-- =====================================================

-- ODS层分区表示例: 按月分区的支出数据
CREATE TABLE IF NOT EXISTS ods_expense_partitioned (
    id VARCHAR(50),
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
    is_deleted BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (id, expense_date)
) PARTITION BY RANGE (expense_date);

-- 创建月度分区
CREATE TABLE IF NOT EXISTS ods_expense_2024_01 PARTITION OF ods_expense_partitioned
    FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');

CREATE TABLE IF NOT EXISTS ods_expense_2024_02 PARTITION OF ods_expense_partitioned
    FOR VALUES FROM ('2024-02-01') TO ('2024-03-01');

CREATE TABLE IF NOT EXISTS ods_expense_2024_03 PARTITION OF ods_expense_partitioned
    FOR VALUES FROM ('2024-03-01') TO ('2024-04-01');

-- DWD层分区表示例: 按月分区的支出事实表
CREATE TABLE IF NOT EXISTS dwd_fact_expense_partitioned (
    fact_id VARCHAR(50),
    date_id VARCHAR(8) NOT NULL,
    department_id VARCHAR(50) NOT NULL,
    budget_item_id VARCHAR(50),
    person_id VARCHAR(50),
    supplier_id VARCHAR(50),
    project_id VARCHAR(50),
    contract_id VARCHAR(50),
    expense_category VARCHAR(100),
    expense_type VARCHAR(50),
    amount DECIMAL(18,2),
    payment_method VARCHAR(50),
    invoice_number VARCHAR(100),
    approval_status VARCHAR(20),
    source_record_id VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (fact_id, date_id)
) PARTITION BY RANGE (date_id);

-- 创建月度分区
CREATE TABLE IF NOT EXISTS dwd_fact_expense_2024_01 PARTITION OF dwd_fact_expense_partitioned
    FOR VALUES FROM ('20240101') TO ('20240201');

CREATE TABLE IF NOT EXISTS dwd_fact_expense_2024_02 PARTITION OF dwd_fact_expense_partitioned
    FOR VALUES FROM ('20240201') TO ('20240301');

CREATE TABLE IF NOT EXISTS dwd_fact_expense_2024_03 PARTITION OF dwd_fact_expense_partitioned
    FOR VALUES FROM ('20240301') TO ('20240401');

-- =====================================================
-- 分区管理表
-- =====================================================

-- 分区配置表
CREATE TABLE IF NOT EXISTS partition_config (
    config_id VARCHAR(50) PRIMARY KEY,
    table_name VARCHAR(100) NOT NULL,
    partition_type VARCHAR(20) NOT NULL, -- RANGE, LIST, HASH
    partition_key VARCHAR(100) NOT NULL,
    partition_interval VARCHAR(20), -- DAILY, MONTHLY, QUARTERLY, YEARLY
    retention_period INT, -- 保留期限(天)
    auto_create BOOLEAN DEFAULT TRUE,
    auto_drop BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 插入分区配置
INSERT INTO partition_config (config_id, table_name, partition_type, partition_key, partition_interval, retention_period, auto_create, auto_drop)
VALUES 
    ('PART_CFG_001', 'ods_expense', 'RANGE', 'expense_date', 'MONTHLY', 1095, TRUE, FALSE),
    ('PART_CFG_002', 'dwd_fact_expense', 'RANGE', 'date_id', 'MONTHLY', 1095, TRUE, FALSE),
    ('PART_CFG_003', 'dwd_fact_procurement', 'RANGE', 'date_id', 'MONTHLY', 1095, TRUE, FALSE),
    ('PART_CFG_004', 'dwd_fact_research', 'RANGE', 'date_id', 'MONTHLY', 1095, TRUE, FALSE);

-- 分区元数据表
CREATE TABLE IF NOT EXISTS partition_metadata (
    partition_id VARCHAR(50) PRIMARY KEY,
    table_name VARCHAR(100) NOT NULL,
    partition_name VARCHAR(100) NOT NULL,
    partition_type VARCHAR(20),
    partition_key VARCHAR(100),
    partition_value_from VARCHAR(50),
    partition_value_to VARCHAR(50),
    row_count BIGINT DEFAULT 0,
    data_size_mb DECIMAL(10,2) DEFAULT 0,
    status VARCHAR(20) DEFAULT 'ACTIVE', -- ACTIVE, ARCHIVED, DROPPED
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_accessed_at TIMESTAMP,
    archived_at TIMESTAMP,
    UNIQUE KEY uk_partition (table_name, partition_name)
);

CREATE INDEX idx_partition_meta_table ON partition_metadata(table_name);
CREATE INDEX idx_partition_meta_status ON partition_metadata(status);

-- =====================================================
-- 归档配置表
-- =====================================================

-- 归档策略配置表
CREATE TABLE IF NOT EXISTS archive_policy (
    policy_id VARCHAR(50) PRIMARY KEY,
    policy_name VARCHAR(200) NOT NULL,
    table_name VARCHAR(100) NOT NULL,
    archive_condition TEXT, -- 归档条件(SQL WHERE子句)
    archive_age_days INT, -- 数据年龄(天)
    archive_storage_type VARCHAR(20), -- COLD_STORAGE, OBJECT_STORAGE, TAPE
    archive_storage_path VARCHAR(500),
    compression_enabled BOOLEAN DEFAULT TRUE,
    compression_type VARCHAR(20), -- GZIP, BZIP2, LZ4
    enabled BOOLEAN DEFAULT TRUE,
    schedule_cron VARCHAR(100), -- 归档调度Cron表达式
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 插入归档策略
INSERT INTO archive_policy (policy_id, policy_name, table_name, archive_condition, archive_age_days, archive_storage_type, archive_storage_path, compression_enabled, compression_type, enabled, schedule_cron)
VALUES 
    ('ARCH_POL_001', 'ODS支出数据归档', 'ods_expense', 'expense_date < CURRENT_DATE - INTERVAL ''3 years''', 1095, 'COLD_STORAGE', '/archive/ods/expense/', TRUE, 'GZIP', TRUE, '0 2 1 * *'),
    ('ARCH_POL_002', 'DWD事实表归档', 'dwd_fact_expense', 'date_id < TO_CHAR(CURRENT_DATE - INTERVAL ''3 years'', ''YYYYMMDD'')', 1095, 'COLD_STORAGE', '/archive/dwd/expense/', TRUE, 'GZIP', TRUE, '0 3 1 * *'),
    ('ARCH_POL_003', 'ODS采集日志归档', 'ods_load_log', 'created_at < CURRENT_DATE - INTERVAL ''1 year''', 365, 'OBJECT_STORAGE', '/archive/logs/', TRUE, 'GZIP', TRUE, '0 4 1 * *');

-- 归档执行记录表
CREATE TABLE IF NOT EXISTS archive_execution_log (
    execution_id VARCHAR(50) PRIMARY KEY,
    policy_id VARCHAR(50) NOT NULL,
    table_name VARCHAR(100) NOT NULL,
    execution_start_time TIMESTAMP,
    execution_end_time TIMESTAMP,
    records_archived BIGINT DEFAULT 0,
    data_size_mb DECIMAL(10,2) DEFAULT 0,
    archive_file_path VARCHAR(500),
    status VARCHAR(20), -- RUNNING, SUCCESS, FAILED
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (policy_id) REFERENCES archive_policy(policy_id)
);

CREATE INDEX idx_archive_log_policy ON archive_execution_log(policy_id);
CREATE INDEX idx_archive_log_time ON archive_execution_log(execution_start_time);
CREATE INDEX idx_archive_log_status ON archive_execution_log(status);

-- =====================================================
-- 冷热数据分层配置表
-- =====================================================

-- 数据温度配置表
CREATE TABLE IF NOT EXISTS data_temperature_config (
    config_id VARCHAR(50) PRIMARY KEY,
    table_name VARCHAR(100) NOT NULL,
    hot_data_age_days INT DEFAULT 90, -- 热数据年龄(天)
    warm_data_age_days INT DEFAULT 365, -- 温数据年龄(天)
    cold_data_age_days INT DEFAULT 1095, -- 冷数据年龄(天)
    hot_storage_type VARCHAR(20) DEFAULT 'SSD', -- SSD, MEMORY
    warm_storage_type VARCHAR(20) DEFAULT 'HDD',
    cold_storage_type VARCHAR(20) DEFAULT 'OBJECT_STORAGE',
    auto_migrate BOOLEAN DEFAULT TRUE,
    migration_schedule VARCHAR(100), -- Cron表达式
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 插入数据温度配置
INSERT INTO data_temperature_config (config_id, table_name, hot_data_age_days, warm_data_age_days, cold_data_age_days, hot_storage_type, warm_storage_type, cold_storage_type, auto_migrate, migration_schedule)
VALUES 
    ('TEMP_CFG_001', 'ods_expense', 90, 365, 1095, 'SSD', 'HDD', 'OBJECT_STORAGE', TRUE, '0 1 * * 0'),
    ('TEMP_CFG_002', 'dwd_fact_expense', 90, 365, 1095, 'SSD', 'HDD', 'OBJECT_STORAGE', TRUE, '0 1 * * 0'),
    ('TEMP_CFG_003', 'dwd_fact_procurement', 90, 365, 1095, 'SSD', 'HDD', 'OBJECT_STORAGE', TRUE, '0 1 * * 0'),
    ('TEMP_CFG_004', 'dws_dept_expense_summary', 180, 730, 1825, 'SSD', 'HDD', 'OBJECT_STORAGE', TRUE, '0 2 * * 0');

-- 数据迁移记录表
CREATE TABLE IF NOT EXISTS data_migration_log (
    migration_id VARCHAR(50) PRIMARY KEY,
    table_name VARCHAR(100) NOT NULL,
    partition_name VARCHAR(100),
    from_storage VARCHAR(20),
    to_storage VARCHAR(20),
    migration_start_time TIMESTAMP,
    migration_end_time TIMESTAMP,
    records_migrated BIGINT DEFAULT 0,
    data_size_mb DECIMAL(10,2) DEFAULT 0,
    status VARCHAR(20), -- RUNNING, SUCCESS, FAILED
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_migration_log_table ON data_migration_log(table_name);
CREATE INDEX idx_migration_log_time ON data_migration_log(migration_start_time);
CREATE INDEX idx_migration_log_status ON data_migration_log(status);

-- =====================================================
-- 数据清理配置表
-- =====================================================

-- 数据清理策略表
CREATE TABLE IF NOT EXISTS data_cleanup_policy (
    policy_id VARCHAR(50) PRIMARY KEY,
    policy_name VARCHAR(200) NOT NULL,
    table_name VARCHAR(100) NOT NULL,
    cleanup_type VARCHAR(20), -- DELETE, TRUNCATE, DROP_PARTITION
    cleanup_condition TEXT, -- 清理条件
    retention_days INT, -- 保留天数
    enabled BOOLEAN DEFAULT TRUE,
    schedule_cron VARCHAR(100),
    last_execution_time TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 插入清理策略
INSERT INTO data_cleanup_policy (policy_id, policy_name, table_name, cleanup_type, cleanup_condition, retention_days, enabled, schedule_cron)
VALUES 
    ('CLEAN_POL_001', '清理ODS加载日志', 'ods_load_log', 'DELETE', 'created_at < CURRENT_DATE - INTERVAL ''90 days''', 90, TRUE, '0 5 * * 0'),
    ('CLEAN_POL_002', '清理DWS刷新日志', 'dws_refresh_log', 'DELETE', 'refresh_start_time < CURRENT_DATE - INTERVAL ''90 days''', 90, TRUE, '0 5 * * 0'),
    ('CLEAN_POL_003', '清理ADS刷新日志', 'ads_refresh_log', 'DELETE', 'refresh_start_time < CURRENT_DATE - INTERVAL ''90 days''', 90, TRUE, '0 5 * * 0'),
    ('CLEAN_POL_004', '删除已归档分区', 'ods_expense', 'DROP_PARTITION', 'status = ''ARCHIVED'' AND archived_at < CURRENT_DATE - INTERVAL ''30 days''', 30, TRUE, '0 6 1 * *');

-- 数据清理执行记录表
CREATE TABLE IF NOT EXISTS data_cleanup_log (
    cleanup_id VARCHAR(50) PRIMARY KEY,
    policy_id VARCHAR(50) NOT NULL,
    table_name VARCHAR(100) NOT NULL,
    cleanup_start_time TIMESTAMP,
    cleanup_end_time TIMESTAMP,
    records_deleted BIGINT DEFAULT 0,
    space_freed_mb DECIMAL(10,2) DEFAULT 0,
    status VARCHAR(20), -- RUNNING, SUCCESS, FAILED
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (policy_id) REFERENCES data_cleanup_policy(policy_id)
);

CREATE INDEX idx_cleanup_log_policy ON data_cleanup_log(policy_id);
CREATE INDEX idx_cleanup_log_time ON data_cleanup_log(cleanup_start_time);
CREATE INDEX idx_cleanup_log_status ON data_cleanup_log(status);

-- =====================================================
-- 存储空间监控表
-- =====================================================

-- 表空间使用情况表
CREATE TABLE IF NOT EXISTS tablespace_usage (
    usage_id VARCHAR(50) PRIMARY KEY,
    table_name VARCHAR(100) NOT NULL,
    partition_name VARCHAR(100),
    storage_type VARCHAR(20), -- HOT, WARM, COLD
    row_count BIGINT DEFAULT 0,
    data_size_mb DECIMAL(10,2) DEFAULT 0,
    index_size_mb DECIMAL(10,2) DEFAULT 0,
    total_size_mb DECIMAL(10,2) DEFAULT 0,
    last_vacuum_time TIMESTAMP,
    last_analyze_time TIMESTAMP,
    snapshot_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_tablespace_usage_table ON tablespace_usage(table_name);
CREATE INDEX idx_tablespace_usage_time ON tablespace_usage(snapshot_time);

-- 存储容量预警表
CREATE TABLE IF NOT EXISTS storage_capacity_alert (
    alert_id VARCHAR(50) PRIMARY KEY,
    storage_type VARCHAR(20),
    total_capacity_gb DECIMAL(10,2),
    used_capacity_gb DECIMAL(10,2),
    free_capacity_gb DECIMAL(10,2),
    usage_percentage DECIMAL(5,2),
    alert_level VARCHAR(20), -- WARNING, CRITICAL
    alert_message TEXT,
    alert_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved BOOLEAN DEFAULT FALSE,
    resolved_time TIMESTAMP
);

CREATE INDEX idx_storage_alert_type ON storage_capacity_alert(storage_type);
CREATE INDEX idx_storage_alert_time ON storage_capacity_alert(alert_time);
CREATE INDEX idx_storage_alert_resolved ON storage_capacity_alert(resolved);

-- =====================================================
-- 分区管理存储过程(示例)
-- =====================================================

-- 自动创建下个月的分区
CREATE OR REPLACE FUNCTION create_next_month_partition(
    p_table_name VARCHAR,
    p_partition_key VARCHAR
) RETURNS VOID AS $$
DECLARE
    v_next_month DATE;
    v_month_after DATE;
    v_partition_name VARCHAR;
    v_sql TEXT;
BEGIN
    -- 计算下个月的第一天
    v_next_month := DATE_TRUNC('month', CURRENT_DATE + INTERVAL '1 month');
    v_month_after := v_next_month + INTERVAL '1 month';
    
    -- 生成分区名称
    v_partition_name := p_table_name || '_' || TO_CHAR(v_next_month, 'YYYY_MM');
    
    -- 构建创建分区的SQL
    v_sql := FORMAT(
        'CREATE TABLE IF NOT EXISTS %I PARTITION OF %I FOR VALUES FROM (%L) TO (%L)',
        v_partition_name,
        p_table_name || '_partitioned',
        v_next_month,
        v_month_after
    );
    
    -- 执行SQL
    EXECUTE v_sql;
    
    -- 记录分区元数据
    INSERT INTO partition_metadata (
        partition_id, table_name, partition_name, partition_type, 
        partition_key, partition_value_from, partition_value_to, status
    ) VALUES (
        'PART_' || TO_CHAR(CURRENT_TIMESTAMP, 'YYYYMMDDHH24MISS') || '_' || FLOOR(RANDOM() * 1000),
        p_table_name,
        v_partition_name,
        'RANGE',
        p_partition_key,
        TO_CHAR(v_next_month, 'YYYY-MM-DD'),
        TO_CHAR(v_month_after, 'YYYY-MM-DD'),
        'ACTIVE'
    );
END;
$$ LANGUAGE plpgsql;

-- 归档旧分区数据
CREATE OR REPLACE FUNCTION archive_old_partition(
    p_table_name VARCHAR,
    p_partition_name VARCHAR,
    p_archive_path VARCHAR
) RETURNS BIGINT AS $$
DECLARE
    v_records_archived BIGINT;
    v_sql TEXT;
BEGIN
    -- 导出分区数据到文件
    v_sql := FORMAT(
        'COPY %I TO %L WITH (FORMAT CSV, HEADER TRUE, COMPRESSION GZIP)',
        p_partition_name,
        p_archive_path || '/' || p_partition_name || '.csv.gz'
    );
    
    EXECUTE v_sql;
    
    -- 获取归档记录数
    EXECUTE FORMAT('SELECT COUNT(*) FROM %I', p_partition_name) INTO v_records_archived;
    
    -- 更新分区元数据状态
    UPDATE partition_metadata
    SET status = 'ARCHIVED',
        archived_at = CURRENT_TIMESTAMP
    WHERE partition_name = p_partition_name;
    
    RETURN v_records_archived;
END;
$$ LANGUAGE plpgsql;

-- 删除已归档的分区
CREATE OR REPLACE FUNCTION drop_archived_partition(
    p_partition_name VARCHAR
) RETURNS VOID AS $$
DECLARE
    v_sql TEXT;
BEGIN
    -- 检查分区是否已归档
    IF EXISTS (
        SELECT 1 FROM partition_metadata 
        WHERE partition_name = p_partition_name 
        AND status = 'ARCHIVED'
        AND archived_at < CURRENT_DATE - INTERVAL '30 days'
    ) THEN
        -- 删除分区
        v_sql := FORMAT('DROP TABLE IF EXISTS %I', p_partition_name);
        EXECUTE v_sql;
        
        -- 更新分区元数据状态
        UPDATE partition_metadata
        SET status = 'DROPPED'
        WHERE partition_name = p_partition_name;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 定期维护任务(示例Cron配置)
-- =====================================================

-- 每月1号凌晨2点创建下个月的分区
-- 0 2 1 * * psql -d database -c "SELECT create_next_month_partition('ods_expense', 'expense_date')"

-- 每月1号凌晨3点归档3年前的数据
-- 0 3 1 * * psql -d database -c "SELECT archive_old_partition('ods_expense', 'ods_expense_2021_01', '/archive/ods/expense')"

-- 每周日凌晨1点执行数据迁移(热->温->冷)
-- 0 1 * * 0 /scripts/migrate_data_by_temperature.sh

-- 每周日凌晨5点清理日志数据
-- 0 5 * * 0 /scripts/cleanup_old_logs.sh

-- 每天凌晨4点收集表空间使用情况
-- 0 4 * * * /scripts/collect_tablespace_usage.sh
