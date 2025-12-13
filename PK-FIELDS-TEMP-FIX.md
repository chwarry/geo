# PK字段临时修复记录

## 背景
由于后端原因，提交数据时所有带PK的字段需要设置为null。后端修复后需要按照此文档恢复。

## 修改日期
2025-12-12

## 修改文件列表

### 1. src/pages/TunnelSketchEditPage.tsx
- `ybPk`: 原值 `isNew ? 0 : Number(id)` → 改为 `null`
- `dssmPk`: 原值 `isNew ? 0 : (detailData?.dssmPk || 0)` → 改为 `null`
- `ybjgDTOList` 中的 `ybjgPk`: 原值 `seg.ybjgPk || 0` → 改为 `null`
- `ybjgDTOList` 中的 `ybPk`: 原值 `isNew ? 0 : Number(id)` → 改为 `null`
- 新增分段时 `ybjgPk`: 原值 `0` → 改为 `null`

### 2. src/pages/PalmSketchEditPage.tsx
- `ybPk`: 原值 `id` → 改为 `null`
- 新增分段时 `ybjgPk`: 原值 `0` → 改为 `null`
- 新增分段时 `ybPk`: 原值 `0` → 改为 `null`

### 3. src/pages/SurfaceSupplementEditPage.tsx
- `ybPk`: 原值 `id` → 改为 `null`
- `ybjgDTOList` 中的 `ybjgPk`: 原值 `item.ybjgPk` → 改为 `null`
- `ybjgDTOList` 中的 `ybPk`: 原值 `id` → 改为 `null`
- 新增分段时 `ybjgPk`: 原值 `Date.now()` → 改为 `null`（注意：本地临时ID仍需保留用于列表操作）
- 新增分段时 `ybPk`: 原值 `id` → 改为 `null`

### 4. src/pages/DrillingEditPage.tsx
- `ybPk`: 原值 `id` → 改为 `null`
- 新增分段时 `ybjgPk`: 原值 `0` → 改为 `null`
- 新增分段时 `ybjgId`: 原值 `0` → 改为 `null`
- 新增分段时 `ybPk`: 原值 `0` → 改为 `null`

## 恢复方法
后端修复后，按照上述列表将null改回原值即可。
