# 数据安全策略执行机制

## 概述

安全策略不是孤立存在的，它需要与**数据分级分类系统**结合，通过策略引擎在数据访问、操作时自动执行。

## 核心问题解答

### Q1: 安全策略什么时候调用？

安全策略在以下场景自动触发：

#### 1. 数据访问时 🔍
```javascript
// 用户查询数据时
SELECT * FROM student_info WHERE id = 123
↓
触发：访问控制策略
检查：用户是否有权限访问该表
执行：身份认证、权限验证
记录：访问日志
```

#### 2. 数据展示时 👁️
```javascript
// 数据返回给前端时
{
  name: "张三",
  id_card: "110101199001011234"
}
↓
触发：数据脱敏策略
检查：该字段是否需要脱敏
执行：身份证号脱敏
返回：{ name: "张三", id_card: "110101********1234" }
```

#### 3. 数据导出时 📤
```javascript
// 用户导出数据时
exportData(tableName, filters)
↓
触发：导出审计策略
检查：是否需要审批
执行：记录导出日志、文件加密
通知：管理员审批
```

#### 4. 数据修改时 ✏️
```javascript
// 更新数据时
UPDATE financial_data SET amount = 10000
↓
触发：变更审计策略
检查：是否有修改权限
执行：记录变更前后值
保存：审计日志
```

#### 5. 数据备份时 💾
```javascript
// 定时备份任务
scheduledBackup()
↓
触发：数据备份策略
执行：加密备份、异地存储
验证：备份完整性
记录：备份日志
```

### Q2: 怎么知道哪些是核心数据？

通过**数据分级分类系统**来识别：

#### 方法1: 基于数据分类 📊

```javascript
// 数据分类表（data-classification.html）
{
  tableName: "financial_transaction",
  category: "财务数据",        // 分类
  level: "L4",                 // 级别：L4-机密
  fields: ["amount", "account"] // 关键字段
}

// 策略匹配
if (table.level === "L4") {
  // 这是核心数据，应用高级别策略
  applyPolicy("数据加密策略");
  applyPolicy("访问控制策略");
}
```

#### 方法2: 基于字段识别 🔍

```javascript
// 敏感字段识别
const sensitiveFields = [
  "id_card",      // 身份证
  "phone",        // 手机号
  "bank_card",    // 银行卡
  "password",     // 密码
  "salary",       // 薪资
  "account"       // 账号
];

// 自动识别
if (sensitiveFields.includes(fieldName)) {
  // 这是敏感字段，应用脱敏策略
  applyMaskingRule(fieldName);
}
```

#### 方法3: 基于表名模式 📝

```javascript
// 核心数据表模式
const coreDataPatterns = [
  /^financial_/,    // 财务相关
  /^salary_/,       // 薪资相关
  /^audit_/,        // 审计相关
  /_secret$/,       // 机密数据
  /_confidential$/  // 保密数据
];

// 模式匹配
if (coreDataPatterns.some(pattern => pattern.test(tableName))) {
  // 这是核心数据表
  applyHighSecurityPolicy();
}
```

## 完整的策略执行流程

### 流程图

```
用户操作（查询/修改/导出）
    ↓
1. 识别数据类型
   - 查询数据分类表
   - 获取数据级别（L1-L4）
   - 识别敏感字段
    ↓
2. 匹配安全策略
   - 根据数据级别匹配策略
   - 根据操作类型匹配策略
   - 根据用户角色匹配策略
    ↓
3. 执行策略检查
   - 访问控制：验证权限
   - 数据脱敏：标记需脱敏字段
   - 审计监控：准备日志记录
    ↓
4. 执行操作
   - 允许：执行并应用策略
   - 拒绝：返回错误信息
    ↓
5. 后处理
   - 数据脱敏处理
   - 记录审计日志
   - 触发告警（如有异常）
```

## 实际应用示例

### 示例1: 查询学生信息

```javascript
// 1. 用户操作
const result = await query("SELECT * FROM student_info WHERE id = 123");

// 2. 系统识别
const classification = getDataClassification("student_info");
// { category: "个人信息", level: "L3", fields: ["name", "id_card", "phone"] }

// 3. 匹配策略
const policies = getPoliciesByLevel("L3");
// [
//   { name: "访问控制策略", type: "访问控制" },
//   { name: "数据脱敏策略", type: "数据脱敏" },
//   { name: "审计日志策略", type: "审计监控" }
// ]

// 4. 执行访问控制
if (!checkPermission(user, "student_info", "READ")) {
  throw new Error("无权访问该数据");
}

// 5. 执行数据脱敏
result.id_card = maskIdCard(result.id_card);  // 110101********1234
result.phone = maskPhone(result.phone);        // 138****5678

// 6. 记录审计日志
auditLog({
  user: user.name,
  action: "查询",
  resource: "student_info",
  result: "成功",
  time: new Date()
});

// 7. 返回结果
return result;
```

### 示例2: 导出财务数据

```javascript
// 1. 用户操作
exportData("financial_transaction", { date: "2024-10" });

// 2. 系统识别
const classification = getDataClassification("financial_transaction");
// { category: "财务数据", level: "L4", fields: ["amount", "account"] }

// 3. 匹配策略（L4级别 - 最高安全级别）
const policies = getPoliciesByLevel("L4");
// [
//   { name: "导出审批策略", rules: "需要二级审批" },
//   { name: "数据加密策略", rules: "导出文件必须加密" },
//   { name: "审计监控策略", rules: "记录详细日志" }
// ]

// 4. 执行审批流程
const approval = await requestApproval({
  user: user.name,
  resource: "financial_transaction",
  action: "导出",
  level: "L4"
});

if (!approval.approved) {
  throw new Error("导出申请未通过审批");
}

// 5. 执行导出（加密）
const data = await fetchData("financial_transaction", filters);
const encryptedFile = encryptData(data, "AES-256");

// 6. 记录审计日志
auditLog({
  user: user.name,
  action: "导出",
  resource: "financial_transaction",
  recordCount: data.length,
  approver: approval.approver,
  result: "成功",
  time: new Date()
});

// 7. 返回加密文件
return encryptedFile;
```

## 策略与数据分类的映射关系

### 映射表

| 数据级别 | 数据类型 | 应用策略 | 执行规则 |
|---------|---------|---------|---------|
| L4-机密 | 财务数据、薪资 | 访问控制<br>数据加密<br>审计监控 | 多重认证<br>强制加密<br>完整审计 |
| L3-敏感 | 个人信息、科研 | 访问控制<br>数据脱敏<br>审计监控 | 身份认证<br>敏感字段脱敏<br>访问日志 |
| L2-内部 | 业务数据 | 访问控制<br>审计监控 | 角色权限<br>基础日志 |
| L1-公开 | 公告、新闻 | 审计监控 | 简单日志 |

### 配置示例

```javascript
// 策略配置表
const policyMapping = {
  "L4": {
    policies: [
      "数据加密策略",
      "访问控制策略", 
      "审计监控策略",
      "数据备份策略"
    ],
    rules: {
      authentication: "多因素认证",
      encryption: "AES-256",
      audit: "完整审计",
      approval: "二级审批"
    }
  },
  "L3": {
    policies: [
      "访问控制策略",
      "数据脱敏策略",
      "审计监控策略"
    ],
    rules: {
      authentication: "身份认证",
      masking: "敏感字段脱敏",
      audit: "访问日志"
    }
  },
  "L2": {
    policies: [
      "访问控制策略",
      "审计监控策略"
    ],
    rules: {
      authentication: "基础认证",
      audit: "基础日志"
    }
  },
  "L1": {
    policies: [
      "审计监控策略"
    ],
    rules: {
      audit: "简单日志"
    }
  }
};
```

## 策略引擎实现

### 核心代码结构

```javascript
// 策略引擎
class SecurityPolicyEngine {
  
  // 执行策略检查
  async executePolicy(operation) {
    // 1. 识别数据
    const dataInfo = this.identifyData(operation.resource);
    
    // 2. 获取适用策略
    const policies = this.getApplicablePolicies(dataInfo, operation);
    
    // 3. 执行策略
    for (const policy of policies) {
      await this.applyPolicy(policy, operation, dataInfo);
    }
    
    // 4. 记录审计
    this.recordAudit(operation, dataInfo, policies);
  }
  
  // 识别数据
  identifyData(resource) {
    // 从数据分类系统获取信息
    const classification = dataClassificationService.getByTableName(resource);
    
    return {
      tableName: resource,
      category: classification.category,
      level: classification.level,
      sensitiveFields: classification.fields
    };
  }
  
  // 获取适用策略
  getApplicablePolicies(dataInfo, operation) {
    // 根据数据级别和操作类型获取策略
    const policies = dataSecurityService.getPolicies({
      level: dataInfo.level,
      type: operation.type,
      status: 'enabled'
    });
    
    return policies;
  }
  
  // 应用策略
  async applyPolicy(policy, operation, dataInfo) {
    switch (policy.type) {
      case '访问控制':
        return this.checkAccess(operation.user, dataInfo);
      case '数据脱敏':
        return this.maskData(operation.data, dataInfo.sensitiveFields);
      case '数据加密':
        return this.encryptData(operation.data);
      case '审计监控':
        return this.auditOperation(operation);
      default:
        console.warn('未知策略类型:', policy.type);
    }
  }
}
```

## 配置步骤

### 第一步：配置数据分类

在 `data-classification.html` 页面：

1. 创建数据分类（如：财务数据）
2. 设置数据级别（如：L4-机密）
3. 配置关键字段（如：amount, account）

### 第二步：创建安全策略

在 `data-security-management.html` 页面：

1. 创建策略（如：数据加密策略）
2. 选择策略类型（如：数据加密）
3. 设置安全级别（如：高）
4. 配置适用范围（如：所有L4级别数据）
5. 选择执行规则（如：存储加密）

### 第三步：建立映射关系

```javascript
// 在策略的"适用范围"字段中指定
适用范围: "数据级别=L4" 或 "数据分类=财务数据"
```

### 第四步：启用策略

勾选"立即启用该策略"，策略开始生效。

## 监控和验证

### 查看策略执行情况

1. 切换到"审计日志"标签页
2. 查看策略触发记录
3. 分析策略执行效果

### 统计信息

- 今日访问次数
- 策略应用次数
- 异常访问告警
- 数据导出记录

## 最佳实践

### 1. 先分类后策略
```
数据分级分类 → 创建安全策略 → 建立映射 → 启用策略
```

### 2. 分级管理
```
L4数据 → 最严格策略（加密+审批+审计）
L3数据 → 严格策略（脱敏+认证+审计）
L2数据 → 标准策略（认证+审计）
L1数据 → 基础策略（审计）
```

### 3. 定期审查
```
每月审查策略执行情况
每季度更新策略规则
每年进行安全评估
```

## 总结

安全策略的执行是一个**自动化、智能化**的过程：

1. **数据分类**是基础 - 告诉系统哪些是核心数据
2. **安全策略**是规则 - 定义如何保护数据
3. **策略引擎**是执行者 - 自动应用策略
4. **审计日志**是监督 - 记录所有操作

通过这套机制，系统能够：
- ✅ 自动识别核心数据
- ✅ 自动应用安全策略
- ✅ 自动记录审计日志
- ✅ 自动告警异常行为

---

**版本**: 1.0.0  
**更新时间**: 2024-10-25
