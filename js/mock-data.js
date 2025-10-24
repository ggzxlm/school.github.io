/**
 * 模拟数据
 * 将JSON数据内嵌到JavaScript中,避免CORS问题
 */

window.MOCK_DATA = {
  "users": [
    {
      "id": "U001",
      "username": "admin",
      "name": "系统管理员",
      "department": "纪检监察室",
      "role": "管理员",
      "status": "active",
      "email": "admin@university.edu.cn",
      "phone": "138****0001",
      "avatar": null
    },
    {
      "id": "U002",
      "username": "zhangsan",
      "name": "张三",
      "department": "纪检监察室",
      "role": "纪检人员",
      "status": "active",
      "email": "zhangsan@university.edu.cn",
      "phone": "138****0002",
      "avatar": null
    },
    {
      "id": "U003",
      "username": "lisi",
      "name": "李四",
      "department": "审计处",
      "role": "审计人员",
      "status": "active",
      "email": "lisi@university.edu.cn",
      "phone": "138****0003",
      "avatar": null
    },
    {
      "id": "U004",
      "username": "wangwu",
      "name": "王五",
      "department": "财务处",
      "role": "二级单位管理员",
      "status": "active",
      "email": "wangwu@university.edu.cn",
      "phone": "138****0004",
      "avatar": null
    },
    {
      "id": "U005",
      "username": "zhaoliu",
      "name": "赵六",
      "department": "科研处",
      "role": "二级单位管理员",
      "status": "active",
      "email": "zhaoliu@university.edu.cn",
      "phone": "138****0005",
      "avatar": null
    }
  ],
  "clues": [
    {
      "id": "CL2025001",
      "title": "科研经费异常报销问题",
      "source": "规则引擎",
      "sourceType": "auto",
      "riskLevel": "high",
      "status": "processing",
      "description": "检测到某科研项目存在连号发票报销，涉及金额较大，存在虚假报销风险。",
      "involvedPerson": "张教授",
      "involvedDepartment": "计算机学院",
      "amount": 50000,
      "createTime": "2025-10-20 09:30:00",
      "updateTime": "2025-10-21 14:20:00",
      "assignee": "张三",
      "tags": ["科研经费", "发票异常", "高风险"],
      "evidence": ["invoice_001.pdf", "invoice_002.pdf", "report_001.docx"]
    },
    {
      "id": "CL2025002",
      "title": "招生录取低分高录疑似问题",
      "source": "数据比对",
      "sourceType": "auto",
      "riskLevel": "medium",
      "status": "pending",
      "description": "2025年招生中发现某考生分数低于专业录取线但被录取，需核查是否存在违规操作。",
      "involvedPerson": "考生李某",
      "involvedDepartment": "招生办",
      "amount": 0,
      "createTime": "2025-10-18 16:45:00",
      "updateTime": "2025-10-18 16:45:00",
      "assignee": null,
      "tags": ["招生录取", "低分高录", "中风险"],
      "evidence": []
    },
    {
      "id": "CL2025003",
      "title": "三公经费超预算预警",
      "source": "预算监控",
      "sourceType": "auto",
      "riskLevel": "medium",
      "status": "completed",
      "description": "某学院三公经费支出已达预算的95%，存在超预算风险。",
      "involvedPerson": "院长王某",
      "involvedDepartment": "经济学院",
      "amount": 285000,
      "createTime": "2025-10-15 10:00:00",
      "updateTime": "2025-10-19 17:30:00",
      "assignee": "李四",
      "tags": ["三公经费", "预算超支", "中风险"],
      "evidence": ["budget_report.xlsx"]
    }
  ],
  "alerts": [
    {
      "id": "AL2025001",
      "title": "连号发票异常",
      "type": "科研经费",
      "riskLevel": "high",
      "status": "unprocessed",
      "description": "检测到项目编号KY2024-001存在5张连号发票，发票号码为：12345671-12345675，总金额50,000元。",
      "source": "规则引擎",
      "involvedPerson": "张教授",
      "involvedDepartment": "计算机学院",
      "amount": 50000,
      "createTime": "2025-10-20 09:30:00",
      "deadline": "2025-10-27 09:30:00",
      "relatedClue": "CL2025001"
    },
    {
      "id": "AL2025002",
      "title": "低分高录风险",
      "type": "招生录取",
      "riskLevel": "medium",
      "status": "assigned",
      "description": "考生李某（考号：2025001234）文化课成绩480分，低于专业录取线500分，但已被录取。",
      "source": "数据比对",
      "involvedPerson": "考生李某",
      "involvedDepartment": "招生办",
      "amount": 0,
      "createTime": "2025-10-18 16:45:00",
      "deadline": "2025-10-25 16:45:00",
      "relatedClue": "CL2025002"
    },
    {
      "id": "AL2025003",
      "title": "三公经费预算红线预警",
      "type": "财务管理",
      "riskLevel": "medium",
      "status": "processing",
      "description": "经济学院三公经费已支出285,000元，占预算300,000元的95%，接近预算红线。",
      "source": "预算监控",
      "involvedPerson": "院长王某",
      "involvedDepartment": "经济学院",
      "amount": 285000,
      "createTime": "2025-10-15 10:00:00",
      "deadline": "2025-10-22 10:00:00",
      "relatedClue": "CL2025003"
    },
    {
      "id": "AL2025004",
      "title": "设备重复采购预警",
      "type": "科研经费",
      "riskLevel": "low",
      "status": "ignored",
      "description": "检测到物理学院在3个月内采购了2台相同型号的高性能服务器，可能存在重复采购。",
      "source": "规则引擎",
      "involvedPerson": "实验室主任刘某",
      "involvedDepartment": "物理学院",
      "amount": 120000,
      "createTime": "2025-10-10 14:20:00",
      "deadline": "2025-10-17 14:20:00",
      "relatedClue": null
    },
    {
      "id": "AL2025005",
      "title": "公车轨迹异常",
      "type": "八项规定",
      "riskLevel": "high",
      "status": "unprocessed",
      "description": "车牌号为京A12345的公务用车在周末出现在旅游景区，疑似公车私用。",
      "source": "GPS监控",
      "involvedPerson": "驾驶员陈某",
      "involvedDepartment": "后勤处",
      "amount": 0,
      "createTime": "2025-10-21 08:00:00",
      "deadline": "2025-10-28 08:00:00",
      "relatedClue": null
    },
    {
      "id": "AL2025006",
      "title": "超预算支出预警",
      "type": "预算执行",
      "riskLevel": "high",
      "status": "unprocessed",
      "description": "化学学院办公费科目本月支出35,000元，超出月度预算30,000元。",
      "source": "预算监控",
      "involvedPerson": "财务负责人周某",
      "involvedDepartment": "化学学院",
      "amount": 35000,
      "createTime": "2025-10-22 10:15:00",
      "deadline": "2025-10-29 10:15:00",
      "relatedClue": null
    }
  ],
  "workOrders": [],
  "rectifications": [],
  "dashboardStats": {
    "todos": {
      "total": 12,
      "trend": "+15%",
      "trendUp": true,
      "chartData": [8, 10, 9, 11, 10, 12, 12]
    },
    "myAlerts": {
      "total": 8,
      "trend": "-10%",
      "trendUp": false,
      "chartData": [12, 11, 10, 9, 10, 8, 8]
    },
    "rectifications": {
      "total": 5,
      "trend": "+25%",
      "trendUp": true,
      "chartData": [3, 4, 4, 5, 4, 5, 5]
    },
    "monthlyClues": {
      "total": 23,
      "trend": "+8%",
      "trendUp": true,
      "chartData": [18, 20, 21, 22, 21, 23, 23]
    }
  },
  "todos": [],
  "recentActivities": [],
  "commandCenterStats": {},
  "alertTrend": {},
  "departmentRisk": [],
  "problemCategories": [],
  "rectificationProgress": {},
  "realtimeAlerts": [],
  "disciplineSupervision": {},
  "auditSupervision": {},
  "departments": [],
  "roles": [],
  "dataSources": [],
  "rules": [],
  "auditLogs": [],
  "reports": []
};
