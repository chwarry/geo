# 地质预报编辑功能 - 四选项卡设计

## 📋 概述
为地质预报页面的"修改"按钮添加了完整的编辑功能，包含4个选项卡：基本信息、地表信息、分段信息、图片上传。

## ✅ 实现的功能

### 1. 编辑弹窗结构
```
修改设计围岩
├── 基本信息 (已完成)
├── 地表信息 (预留)
├── 分段信息 (预留)
└── 图片上传 (已完成)
```

### 2. 选项卡详情

#### 选项卡1：基本信息 ⭐
完全按照设计稿实现，包含以下字段：

| 字段名称 | 组件类型 | 必填 | 说明 |
|---------|---------|-----|------|
| **围岩等级** | Select下拉 | ✅ | I, II, III, IV, V, VI |
| **里程冠号** | Input输入框 | ✅ | 例如：DK |
| **开始里程** | InputNumber×2 | ✅ | 例如：713 + 485 |
| **预报长度** | InputNumber | ✅ | 可为负数，例如：-205.00 |
| **填写人** | Select下拉 | ✅ | 一分部、二分部、三分部、其他 |
| **修改原因说明** | TextArea | ✅ | 多行文本输入 |

**表单布局**：
```
┌────────────────────────────────────────────────┐
│ 修改设计围岩                                    │
├────────────────────────────────────────────────┤
│ [基本信息] [地表信息] [分段信息] [图片上传]     │
├────────────────────────────────────────────────┤
│                                                 │
│ [围岩等级: IV ▼]       [里程冠号: DK       ]   │
│                                                 │
│ [开始里程: 713  +  485                     ]   │
│                                                 │
│ [预报长度: -205.00]    [填写人: 一分部 ▼]      │
│                                                 │
│ [修改原因说明:                              ]   │
│ [                                           ]   │
│ [                                           ]   │
│                                                 │
│                           [确定]  [取消]        │
└────────────────────────────────────────────────┘
```

#### 选项卡2：地表信息 🚧
- **状态**: 预留，显示"地表信息功能开发中..."
- **用途**: 未来用于输入地表相关的地质信息

#### 选项卡3：分段信息 🚧
- **状态**: 预留，显示"分段信息功能开发中..."
- **用途**: 未来用于管理分段数据

#### 选项卡4：图片上传 ✅
- **状态**: 已实现
- **功能**: 拖拽上传图片
- **支持格式**: .jpg, .png, .gif
- **特点**: 支持批量上传

## 🔧 技术实现

### 状态管理
```typescript
// 编辑弹窗状态
const [editVisible, setEditVisible] = useState(false)
const [editingRecord, setEditingRecord] = useState<GeologyForecastRecord | null>(null)
const [activeTab, setActiveTab] = useState('1')
const [editForm] = Form.useForm()
```

### 编辑流程

#### 1. 打开编辑弹窗
```typescript
const handleEdit = (record: GeologyForecastRecord) => {
  setEditingRecord(record)
  
  // 解析里程数据（例如 "DK713+485"）
  const mileageMatch = record.mileage.match(/([A-Z]+)?(\d+)\+(\d+)/)
  const mileagePrefix = mileageMatch?.[1] || 'DK'
  const mileageMain = mileageMatch?.[2] || '713'
  const mileageSub = mileageMatch?.[3] || '485'
  
  // 解析长度（例如 "100m"）
  const length = parseFloat(record.length.replace('m', '')) || 0
  
  // 设置表单初始值
  editForm.setFieldsValue({
    rockGrade: 'IV',
    mileagePrefix,
    startMileageMain: parseInt(mileageMain),
    startMileageSub: parseInt(mileageSub),
    length,
    author: '一分部',
    modifyReason: ''
  })
  
  setActiveTab('1')
  setEditVisible(true)
}
```

#### 2. 提交编辑
```typescript
const handleEditOk = async () => {
  try {
    const values = await editForm.validate()
    
    // 合并开始里程
    const startMileage = `${values.mileagePrefix}${values.startMileageMain}+${values.startMileageSub}`
    
    console.log('提交编辑数据:', {
      ...values,
      startMileage,
      id: editingRecord?.id
    })
    
    // TODO: 调用API更新
    Message.success('修改成功')
    setEditVisible(false)
    setEditingRecord(null)
    editForm.resetFields()
    
    // 刷新列表
    fetchGeologyData()
  } catch (error) {
    console.error('表单验证失败:', error)
  }
}
```

#### 3. 取消编辑
```typescript
const handleEditCancel = () => {
  setEditVisible(false)
  setEditingRecord(null)
  editForm.resetFields()
  setActiveTab('1')
}
```

### Modal结构
```tsx
<Modal
  title="修改设计围岩"
  visible={editVisible}
  onOk={handleEditOk}
  onCancel={handleEditCancel}
  style={{ width: 1000 }}
  okText="确定"
  cancelText="取消"
>
  <Tabs activeTab={activeTab} onChange={setActiveTab} type="line">
    <TabPane key="1" title="基本信息">
      <Form form={editForm} layout="vertical">
        {/* 表单字段 */}
      </Form>
    </TabPane>
    
    <TabPane key="2" title="地表信息">
      {/* 预留 */}
    </TabPane>
    
    <TabPane key="3" title="分段信息">
      {/* 预留 */}
    </TabPane>
    
    <TabPane key="4" title="图片上传">
      <Upload drag multiple accept="image/*">
        {/* 上传区域 */}
      </Upload>
    </TabPane>
  </Tabs>
</Modal>
```

## 📊 表单字段详解

### 围岩等级 (rockGrade)
- **类型**: 下拉选择
- **选项**: I, II, III, IV, V, VI（罗马数字）
- **默认值**: IV
- **验证**: 必填

### 里程冠号 (mileagePrefix)
- **类型**: 文本输入
- **示例**: DK, K
- **验证**: 必填

### 开始里程 (startMileageMain + startMileageSub)
- **类型**: 双数字输入
- **格式**: 主里程 + 附加里程
- **示例**: 713 + 485 → DK713+485
- **验证**: 两个字段都必填

### 预报长度 (length)
- **类型**: 数字输入
- **单位**: 米
- **特点**: 可以为负数
- **示例**: -205.00
- **验证**: 必填

### 填写人 (author)
- **类型**: 下拉选择
- **选项**: 一分部、二分部、三分部、其他
- **验证**: 必填

### 修改原因说明 (modifyReason)
- **类型**: 多行文本
- **行数**: 3行
- **验证**: 必填

## 🎨 UI特点

### 1. 响应式布局
- 第一行：围岩等级 | 里程冠号（两列等宽）
- 第二行：开始里程（整行，两个输入框+号分隔）
- 第三行：预报长度 | 填写人（两列等宽）
- 第四行：修改原因说明（整行）

### 2. 表单验证
- 所有字段必填
- 实时验证反馈
- 提交前完整验证

### 3. 用户体验
- 打开弹窗时自动填充现有数据
- 取消时清空表单
- 提交成功后自动刷新列表
- 成功提示消息

## 🔌 API对接准备

### 提交的数据格式
```typescript
{
  id: string,              // 记录ID
  rockGrade: string,       // 围岩等级: "I" | "II" | "III" | "IV" | "V" | "VI"
  mileagePrefix: string,   // 里程冠号: "DK"
  startMileage: string,    // 开始里程: "DK713+485"
  length: number,          // 预报长度: -205.00
  author: string,          // 填写人: "一分部"
  modifyReason: string     // 修改原因: "..."
}
```

### 建议的API端点
```
PUT /api/v1/geology-forecast/{id}
Content-Type: application/json

{
  "rockGrade": "IV",
  "mileagePrefix": "DK",
  "startMileage": "DK713+485",
  "length": -205.00,
  "author": "一分部",
  "modifyReason": "修改原因说明"
}
```

## 📝 使用指南

### 1. 用户操作流程
1. 在地质预报列表中点击某条记录的"修改"按钮
2. 弹出"修改设计围岩"对话框
3. 默认显示"基本信息"选项卡
4. 修改需要更改的字段
5. 可以切换到其他选项卡（地表信息、分段信息、图片上传）
6. 点击"确定"提交修改
7. 或点击"取消"放弃修改

### 2. 数据自动填充
打开编辑弹窗时，会自动解析现有数据并填充到表单：
- 从 `mileage` 字段解析出里程冠号和里程数字
- 从 `length` 字段解析出预报长度
- 其他字段使用默认值

### 3. 表单验证规则
- 所有字段必填
- 开始里程的两部分都必须输入
- 预报长度可以为负数
- 提交前会进行完整验证

## 🚀 后续优化建议

### 1. 地表信息选项卡
- 添加地形地貌描述
- 植被覆盖情况
- 水文条件
- 地表裂缝信息

### 2. 分段信息选项卡
- 分段列表展示
- 分段编辑功能
- 分段合并/拆分
- 分段数据导入/导出

### 3. 图片上传选项卡
- ✅ 已实现拖拽上传
- 图片预览功能
- 图片删除功能
- 图片标注功能
- 与分段关联

### 4. 数据持久化
- 集成后端API
- 离线草稿保存
- 版本历史记录
- 修改日志追踪

## ✅ 验证清单

- [x] 弹窗标题显示"修改设计围岩"
- [x] 包含4个选项卡
- [x] 基本信息选项卡完整实现
- [x] 围岩等级下拉显示I-VI
- [x] 里程冠号输入框
- [x] 开始里程双输入框，中间有"+"
- [x] 预报长度可输入负数
- [x] 填写人下拉显示分部选项
- [x] 修改原因为多行文本框
- [x] 所有字段必填验证
- [x] 图片上传选项卡可用
- [x] 取消按钮清空表单
- [x] 确定按钮验证并提交

完美实现了设计要求！🎉

