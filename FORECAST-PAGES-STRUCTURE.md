# 地质预报页面结构说明

## 📋 概述

地质预报系统包含5种不同的预报方法，每种方法都有独立的详情页面和编辑页面。

## 🗂️ 预报方法类型

| 类型代码 | 中文名称 | 英文标识 | 状态 |
|---------|---------|---------|------|
| type=geophysical | 物探法 | Geophysical | ✅ 已实现 |
| type=palmSketch | 掌子面素描 | Palm Sketch | ⏳ 待实现 |
| type=tunnelSketch | 洞身素描 | Tunnel Sketch | ⏳ 待实现 |
| type=drilling | 钻探法 | Drilling | ⏳ 待实现 |
| type=surface | 地表补充 | Surface Supplement | ⏳ 待实现 |

## 🔀 路由分发机制

### 详情页面路由
**路径：** `/forecast/geology/detail/:type/:id?method=xxx&siteId=xxx`

**分发器：** `src/pages/ForecastDetailRouter.tsx`

根据 `type` 参数分发到不同的详情页面：
- `geophysical` → `GeologyForecastDetailPage.tsx` ✅
- `palmSketch` → `PalmSketchDetailPage.tsx` ⏳
- `tunnelSketch` → `TunnelSketchDetailPage.tsx` ⏳
- `drilling` → `DrillingDetailPage.tsx` ⏳
- `surface` → `SurfaceSupplementDetailPage.tsx` ⏳

### 编辑页面路由
**路径：** `/forecast/geology/edit/:type/:id?method=xxx&siteId=xxx`

**分发器：** `src/pages/ForecastEditRouter.tsx`

根据 `type` 参数分发到不同的编辑页面：
- `geophysical` → `GeologyForecastEditPage.tsx` ✅
- `palmSketch` → `PalmSketchEditPage.tsx` ⏳
- `tunnelSketch` → `TunnelSketchEditPage.tsx` ⏳
- `drilling` → `DrillingEditPage.tsx` ⏳
- `surface` → `SurfaceSupplementEditPage.tsx` ⏳

## 📁 文件结构

```
src/pages/
├── ForecastDetailRouter.tsx          # 详情页面路由分发器
├── ForecastEditRouter.tsx            # 编辑页面路由分发器
├── GeologyForecastPage.tsx           # 列表页面（所有类型共用）
│
├── GeologyForecastDetailPage.tsx     # 物探法详情页面 ✅
├── GeologyForecastEditPage.tsx       # 物探法编辑页面 ✅
│
├── PalmSketchDetailPage.tsx          # 掌子面素描详情页面 ⏳
├── PalmSketchEditPage.tsx            # 掌子面素描编辑页面 ⏳
│
├── TunnelSketchDetailPage.tsx        # 洞身素描详情页面 ⏳
├── TunnelSketchEditPage.tsx          # 洞身素描编辑页面 ⏳
│
├── DrillingDetailPage.tsx            # 钻探法详情页面 ⏳
├── DrillingEditPage.tsx              # 钻探法编辑页面 ⏳
│
├── SurfaceSupplementDetailPage.tsx   # 地表补充详情页面 ⏳
└── SurfaceSupplementEditPage.tsx     # 地表补充编辑页面 ⏳
```

## 🔧 使用方式

### 从列表页跳转到详情页

```typescript
// 在 GeologyForecastPage.tsx 中
const handleViewDetail = (record: any) => {
  const recordId = String(record.ybPk || record.id)
  const method = record.method
  const recordSiteId = record.siteId || siteId
  
  // 跳转到详情页面，路由分发器会自动选择正确的页面
  navigate(`/forecast/geology/detail/${activeTab}/${recordId}?method=${method}&siteId=${recordSiteId}`)
}
```

### 从列表页跳转到编辑页

```typescript
// 在 GeologyForecastPage.tsx 中
const handleEdit = (record: any) => {
  const recordId = String(record.ybPk || record.id)
  const method = record.method
  const recordSiteId = record.siteId || siteId
  
  // 跳转到编辑页面，路由分发器会自动选择正确的页面
  navigate(`/forecast/geology/edit/${activeTab}/${recordId}?method=${method}&siteId=${recordSiteId}`, {
    state: { record }
  })
}
```

## 📝 实现新页面的步骤

### 1. 创建详情页面

创建文件：`src/pages/[MethodName]DetailPage.tsx`

```typescript
import React, { useState, useEffect } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { Card, Button, Spin, Message } from '@arco-design/web-react'
import { IconLeft } from '@arco-design/web-react/icon'
import apiAdapter from '../services/apiAdapter'

function [MethodName]DetailPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [searchParams] = useSearchParams()
  
  const method = searchParams.get('method')
  const siteId = searchParams.get('siteId')
  
  const [loading, setLoading] = useState(false)
  const [detailData, setDetailData] = useState<any>(null)

  // 获取详情数据
  useEffect(() => {
    const fetchDetail = async () => {
      if (!id) return
      
      setLoading(true)
      try {
        const detail = await apiAdapter.get[MethodName]Detail(id)
        setDetailData(detail)
      } catch (error) {
        Message.error('获取详情数据失败')
      } finally {
        setLoading(false)
      }
    }
    
    fetchDetail()
  }, [id])

  const handleBack = () => {
    if (siteId) {
      navigate(`/forecast/geology/${siteId}`)
    } else {
      navigate(-1)
    }
  }

  return (
    <div style={{ padding: '20px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      {/* 顶部导航栏 */}
      <div style={{ 
        height: 48,
        background: '#E6E8EB',
        borderRadius: '4px 4px 0 0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px'
      }}>
        <span>[方法名称] - 详情页面</span>
        <Button 
          type="text" 
          icon={<IconLeft />} 
          onClick={handleBack}
        />
      </div>

      <Card style={{ borderRadius: '0 0 4px 4px' }}>
        <Spin loading={loading}>
          {/* 详情内容 */}
          <div>详情内容根据设计稿实现</div>
        </Spin>
      </Card>
    </div>
  )
}

export default [MethodName]DetailPage
```

### 2. 在路由分发器中注册

编辑 `src/pages/ForecastDetailRouter.tsx`：

```typescript
import [MethodName]DetailPage from './[MethodName]DetailPage'

// 在 switch 语句中添加
case '[typeCode]':
  return <[MethodName]DetailPage />
```

### 3. 创建编辑页面

类似详情页面的步骤，创建编辑页面并在 `ForecastEditRouter.tsx` 中注册。

## 🎯 当前进度

### ✅ 已完成
- [x] 物探法详情页面（包含3个Tab）
- [x] 物探法编辑页面
- [x] 路由分发机制
- [x] 列表页面的跳转逻辑

### ⏳ 待实现
- [ ] 掌子面素描详情页面
- [ ] 掌子面素描编辑页面
- [ ] 洞身素描详情页面
- [ ] 洞身素描编辑页面
- [ ] 钻探法详情页面
- [ ] 钻探法编辑页面
- [ ] 地表补充详情页面
- [ ] 地表补充编辑页面

## 📌 注意事项

1. **参数传递**：所有页面都需要通过 URL 参数传递 `method` 和 `siteId`
2. **数据获取**：每种方法使用不同的 API 接口获取数据
3. **返回逻辑**：返回按钮应该返回到对应工点的列表页面
4. **状态传递**：编辑页面可以通过 `location.state` 接收列表页传递的记录数据
5. **错误处理**：未知类型应该重定向到列表页面

## 🚀 下一步

请提供其他4种方法的详情页面和编辑页面的设计稿，我将逐一实现。

每个方法需要提供：
1. 详情页面的设计稿（截图）
2. 编辑页面的设计稿（截图）
3. 特殊的业务逻辑说明（如果有）
