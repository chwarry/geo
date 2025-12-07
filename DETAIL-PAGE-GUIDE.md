# 地质预报详情页面开发说明

## 功能概述

已成功创建地质预报详情页面，点击列表中的详情按钮（眼睛图标）后，会跳转到独立的详情页面展示完整信息。

## 实现内容

### 1. 新增文件
- **src/pages/GeologyForecastDetailPage.tsx** - 详情页面组件

### 2. 修改文件
- **src/router/index.tsx** - 添加详情页面路由
- **src/pages/GeologyForecastPage.tsx** - 修改详情按钮点击事件，从 Modal 弹窗改为页面跳转

## 路由配置

### 详情页面路由
```
/forecast/geology/detail/:type/:id?method=xxx&siteId=xxx
```

**参数说明：**
- `type`: 预报类型（geophysical/palmSketch/tunnelSketch/drilling）
- `id`: 记录ID（根据类型使用不同的主键：ybPk/zzmsmPk/dssmPk/ztfPk）
- `method`: 预报方法代码（1-14）
- `siteId`: 工点ID

**示例：**
```
/forecast/geology/detail/geophysical/12345?method=1&siteId=76833
```

## 页面功能

### Tab 切换
1. **地震波预报结果** - 主要详情信息
   - 基本信息表格
   - 多个图表展示（波形分布图、2D成果图、X/Y/Z向云图、岩土物性图）
   - 结论表格
   - 后续建议
   - 原始文件下载
   - 签名区（检测、审核、批准）

2. **围岩参数物理学参数表** - 物理参数数据表格

3. **地震波现场数据记录表** - 现场数据记录表格

### 数据来源

根据不同的预报类型调用不同的 API：

#### 物探法（Geophysical）
- 根据 method 参数调用对应的详情接口
- method=1: TSP 地震波反射 `/api/v1/wtf/tsp/{ybPk}`
- method=2: HSP 水平声波剖面 `/api/v1/wtf/hsp/{ybPk}`
- method=3: LDSN 陆地声呐 `/api/v1/wtf/ldsn/{ybPk}`
- method=4: DCBFS 电磁波反射 `/api/v1/wtf/dcbfs/{ybPk}`
- method=5: GFBZLD 高分辨直流电 `/api/v1/wtf/gfbzld/{ybPk}`
- method=6: SBDC 瞬变电磁 `/api/v1/wtf/sbdc/{ybPk}`
- method=9: WZJC 微震监测 `/api/v1/wtf/wzjc/{ybPk}`

#### 掌子面素描（Palm Sketch）
- `/api/v1/zzmsm/{zzmsmPk}`

#### 洞身素描（Tunnel Sketch）
- `/api/v1/dssm/{dssmPk}`

#### 钻探法（Drilling）
- 加深炮孔: `/api/v1/ztf/jspk/{ztfPk}`
- 超前水平钻: `/api/v1/ztf/cqspz/{ztfPk}`

## 数据结构

### TspDetailVO（地震波反射详情）

**基本信息字段：**
- `dkname`: 工程名称
- `dkilo`: 掌子面里程
- `ybLength`: 预报长度
- `monitordate`: 监测期间
- `sbName`: 设备名称
- `jfpknum`: 激发孔数量
- `jfpksd`: 激发孔深度
- `jfpkzj`: 激发孔直径
- `jfpkjdmgd`: 激发孔角度
- `jfpkjj`: 激发孔间距
- `jspknum`: 检波器数量
- `kwwz`: 测线方位角
- `leftkilo/rightkilo`: 测线左右侧里程

**图片字段：**
- `pic1`: 波形分布图
- `pic2`: 2D成果图
- `pic3`: X向云图
- `pic4`: Y向云图
- `pic5`: Z向云图
- `pic6`: 岩土物性图

**结论数据：**
- `ybjgVOList`: 预报结果列表
  - `lcfw`: 里程范围
  - `length`: 长度
  - `conclusion`: 预测结论
  - `riskLevel`: 风险类别
  - `wyLevel`: 围岩等级

**建议与签名：**
- `suggestion`: 后续建议
- `conclusionyb`: 预报结论
- `testname`: 检测人
- `monitorname`: 审核人
- `supervisorname`: 批准人

**物理参数表：**
- `tspBxdataVOList`: 围岩参数物理学参数列表
  - `lcfw`: 里程范围
  - `vp`: 纵波速度
  - `vs`: 横波速度
  - `poisson`: 泊松比
  - `density`: 密度
  - `elastic`: 弹性模量

**现场数据表：**
- `tspPddataVOList`: 地震波现场数据记录列表
  - `pdjl`: 炮点距离
  - `pdsd`: 炮点深度
  - `height`: 高程
  - `qj`: 倾角
  - `fwj`: 方位角
  - `yl`: 药量

## 使用方式

### 从列表页跳转
在 `GeologyForecastPage.tsx` 中，点击详情按钮（眼睛图标）：

```typescript
const handleViewDetail = (record: any) => {
  // 自动提取正确的ID和参数
  // 跳转到详情页面
  navigate(`/forecast/geology/detail/${activeTab}/${recordId}?method=${method}&siteId=${siteId}`)
}
```

### 返回列表页
点击左上角的返回按钮，会自动返回到对应工点的列表页面。

## 样式特点

1. **顶部导航栏** - 灰色背景，显示方法名称和返回按钮
2. **Tab 切换** - 三个 Tab 页签切换不同内容
3. **基本信息** - 浅灰色背景的描述列表
4. **图表展示** - 带边框的卡片式展示，支持图片预览
5. **结论表格** - 带斑马纹的表格，风险类别有颜色标识
6. **签名区** - 底部三栏布局显示检测、审核、批准人

## 后续优化建议

1. **图片加载优化** - 添加加载状态和错误处理
2. **文件下载功能** - 实现原始文件下载
3. **打印功能** - 添加打印预览和导出 PDF
4. **数据校验** - 对缺失数据进行友好提示
5. **响应式布局** - 优化移动端显示效果
6. **权限控制** - 根据用户角色显示不同内容

## 测试建议

1. 测试不同预报类型的详情展示
2. 测试图片加载和预览功能
3. 测试 Tab 切换和数据展示
4. 测试返回按钮功能
5. 测试数据缺失时的显示效果
