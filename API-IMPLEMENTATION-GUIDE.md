# API 接口实现完成指南

## 🎉 实现完成概览

所有后端API接口已经完全实现！现在系统支持**完整的CRUD操作**，包括：

- ✅ **设计围岩等级** (sjwydj) - 增删改查
- ✅ **设计预报方法** (sjyb) - 增删改查  
- ✅ **设计地质信息** (sjdz) - 增删改查
- ✅ **物探法** (wtf) - 增删改查
- ✅ **钻探法** (ztf) - 增删改查
- ✅ **掌子面素描** (zzmsm) - 增删改查
- ✅ **洞身素描** (dssm) - 增删改查
- ✅ **地表补充** (dbbc) - 增删改查

## 📁 更新的文件

### 1. `src/services/realAPI.ts` ⭐ 核心更新
- 添加了所有模块的完整CRUD方法
- 新增了完整的数据类型定义
- 实现了数据格式转换辅助方法
- 完善了错误处理机制

### 2. `src/services/apiAdapter.ts` ⭐ 智能适配
- 添加了所有新API方法的适配器
- 保持了Mock/真实API自动切换功能
- 新增了Mock数据生成方法

## 🚀 如何使用新的API接口

### 方式1：通过 apiAdapter (推荐)

```typescript
import apiAdapter from '../services/apiAdapter';

// 设计围岩等级 CRUD
const rockGrades = await apiAdapter.getDesignRockGrades({ pageNum: 1, pageSize: 10 });
const result = await apiAdapter.createDesignRockGrade(data);
await apiAdapter.updateDesignRockGrade(id, data);
await apiAdapter.deleteDesignRockGrade(id);

// 设计地质信息 CRUD
const geologies = await apiAdapter.getDesignGeologies({ pageNum: 1, pageSize: 10 });
await apiAdapter.createDesignGeology(data);
await apiAdapter.updateDesignGeology(id, data);
await apiAdapter.deleteDesignGeology(id);

// 物探法 CRUD
const methods = await apiAdapter.getGeophysicalMethods({ pageNum: 1, pageSize: 10 });
await apiAdapter.createGeophysicalMethod(data);
await apiAdapter.updateGeophysicalMethod(id, data);
await apiAdapter.deleteGeophysicalMethod(id);
```

### 方式2：直接使用 realAPI

```typescript
import realAPI from '../services/realAPI';

// 直接调用真实API
const response = await realAPI.getDesignRockGrades({
  userid: 1,
  pageNum: 1,
  pageSize: 15
});

const result = await realAPI.createDesignRockGrade({
  sitePk: 1,
  dkname: 'DK',
  dkilo: 713.485,
  sjwydjLength: 100,
  wydj: 4,
  username: '一分部'
});
```

## 📊 数据格式说明

### 设计围岩等级数据格式

```typescript
// 请求格式
interface DesignRockGradeRequest {
  sitePk: number;        // 工点主键
  dkname: string;        // 里程冠号 (如: "DK")
  dkilo: number;         // 里程公里数 (如: 713.485)
  sjwydjLength: number;  // 预报长度 (如: 100)
  wydj: number;          // 围岩等级 1-6 对应 I-VI
  revise?: string;       // 修改原因
  username: string;      // 填写人 (如: "一分部")
}

// 响应格式
interface DesignRockGrade {
  sjwydjPk: number;      // 主键
  sjwydjId: number;      // ID
  sitePk: number;        // 工点主键
  dkname: string;        // 里程冠号
  dkilo: number;         // 里程公里数
  sjwydjLength: number;  // 预报长度
  wydj: number;          // 围岩等级
  revise?: string;       // 修改原因
  username: string;      // 填写人
  gmtCreate: string;     // 创建时间
  gmtModified: string;   // 修改时间
}
```

### 设计预报方法数据格式

```typescript
// 请求格式
interface DesignForecastRequest {
  sitePk: number;        // 工点主键
  method: number;        // 预报方法代码
  dkname: string;        // 里程冠号
  dkilo: number;         // 起点里程
  sjybLength: number;    // 预报长度
  zxms?: number;         // 最小埋深
  plannum?: number;      // 设计次数
  plantime?: string;     // 计划时间
}
```

### 物探法数据格式

```typescript
// 请求格式
interface GeophysicalRequest {
  sitePk: number;        // 工点主键
  method: number;        // 方法代码
  dkname: string;        // 里程冠号
  dkilo: number;         // 里程公里数
  wtfLength: number;     // 长度
  monitordate?: string;  // 监测日期
  originalfile?: string; // 原始文件
  addition?: string;     // 附加信息
  images?: string;       // 图片
}
```

## 🔧 方法代码映射

### 预报方法代码

```typescript
const methodMap = {
  0: '其他',
  1: '地震波反射',
  2: '水平声波剖面',
  3: '陆地声呐',
  4: '电磁波反射',
  5: '高分辨直流电',
  6: '瞬变电磁',
  7: '掌子面素描',
  8: '洞身素描',
  12: '地表补充',
  13: '超前水平钻',
  14: '加深炮孔',
  99: '全部'
};
```

### 围岩等级映射

```typescript
const rockGradeMap = {
  1: 'I',
  2: 'II', 
  3: 'III',
  4: 'IV',
  5: 'V',
  6: 'VI'
};
```

## 🎯 在页面中使用示例

### React组件中使用

```typescript
import React, { useState, useEffect } from 'react';
import { Table, Button, Message } from '@arco-design/web-react';
import apiAdapter from '../services/apiAdapter';

const DesignRockGradePage: React.FC = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // 加载数据
  const loadData = async () => {
    setLoading(true);
    try {
      const response = await apiAdapter.getDesignRockGrades({
        pageNum: 1,
        pageSize: 10
      });
      setData(response.records);
    } catch (error) {
      Message.error('加载数据失败');
    } finally {
      setLoading(false);
    }
  };

  // 新增记录
  const handleCreate = async (formData: any) => {
    try {
      const result = await apiAdapter.createDesignRockGrade({
        sitePk: 1,
        dkname: formData.dkname,
        dkilo: formData.dkilo,
        sjwydjLength: formData.length,
        wydj: formData.rockGrade,
        username: formData.author
      });
      
      if (result.success) {
        Message.success('创建成功');
        loadData(); // 重新加载数据
      } else {
        Message.error('创建失败');
      }
    } catch (error) {
      Message.error('创建异常');
    }
  };

  // 删除记录
  const handleDelete = async (id: string) => {
    try {
      const result = await apiAdapter.deleteDesignRockGrade(id);
      if (result.success) {
        Message.success('删除成功');
        loadData();
      } else {
        Message.error('删除失败');
      }
    } catch (error) {
      Message.error('删除异常');
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div>
      <Button onClick={() => handleCreate(formData)}>新增</Button>
      <Table 
        data={data} 
        loading={loading}
        // ... 其他配置
      />
    </div>
  );
};
```

## 🔄 API模式切换

### 使用Mock模式 (开发/测试)

```bash
# .env 文件
# 不设置 REACT_APP_API_BASE_URL 或设置为空
# REACT_APP_API_BASE_URL=
```

**特点**：
- ✅ 无需后端服务器
- ✅ 数据丰富真实
- ✅ 响应速度快
- ✅ 支持所有操作

### 使用真实API模式 (生产)

```bash
# .env 文件
REACT_APP_API_BASE_URL=http://121.40.127.120:8080/api
```

**特点**：
- ✅ 连接真实数据库
- ✅ 数据持久化
- ✅ 多用户协作
- ✅ 生产环境就绪

## 🚨 注意事项

### 1. 数据验证

```typescript
// 创建前验证数据
const validateData = (data: any) => {
  if (!data.sitePk || !data.dkname || !data.username) {
    throw new Error('必填字段不能为空');
  }
  if (data.wydj < 1 || data.wydj > 6) {
    throw new Error('围岩等级必须在1-6之间');
  }
};
```

### 2. 错误处理

```typescript
try {
  const result = await apiAdapter.createDesignRockGrade(data);
  if (result.success) {
    // 成功处理
  } else {
    // 失败处理
  }
} catch (error) {
  console.error('API调用异常:', error);
  Message.error('操作失败，请重试');
}
```

### 3. 分页处理

```typescript
const [pagination, setPagination] = useState({
  current: 1,
  pageSize: 10,
  total: 0
});

const handlePageChange = async (page: number, pageSize: number) => {
  const response = await apiAdapter.getDesignRockGrades({
    pageNum: page,
    pageSize: pageSize
  });
  
  setData(response.records);
  setPagination({
    current: response.current,
    pageSize: response.size,
    total: response.total
  });
};
```

## 🎉 完成状态

### ✅ 已完成
- 所有CRUD接口实现
- 数据类型定义完整
- Mock/真实API自动切换
- 错误处理机制
- 数据格式转换

### 🔄 可选优化
- 添加请求缓存
- 实现乐观更新
- 添加重试机制
- 完善日志记录

## 📞 使用支持

如果在使用过程中遇到问题：

1. **检查控制台日志** - 查看详细的API调用信息
2. **验证数据格式** - 确保请求数据符合接口要求
3. **测试网络连接** - 确认后端服务可访问
4. **查看错误信息** - 根据错误提示进行调试

---

**🎉 恭喜！所有API接口已完全实现，系统现在支持完整的CRUD操作！**
