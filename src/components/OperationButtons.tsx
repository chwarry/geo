import React from 'react'
import { Button, Space } from '@arco-design/web-react'

interface OperationButtonsProps {
  onDownloadTemplate?: () => void
  onImport?: () => void
  onAdd?: () => void
  onClear?: () => void
  selectedCount?: number
  clearDisabled?: boolean
}

const OperationButtons: React.FC<OperationButtonsProps> = ({
  onDownloadTemplate,
  onImport,
  onAdd,
  onClear,
  selectedCount = 0,
  clearDisabled = false
}) => {
  return (
    <div style={{ 
      marginBottom: '16px',
      padding: '12px 0',
      borderBottom: '1px solid #f0f0f0'
    }}>
      <Space size="medium">
        <Button 
          type="text" 
          style={{ 
            color: '#1890ff',
            padding: '4px 8px',
            fontSize: '14px',
            border: 'none'
          }}
          onClick={onDownloadTemplate}
        >
          📥 下载模板
        </Button>
        <Button 
          type="text" 
          style={{ 
            color: '#1890ff',
            padding: '4px 8px',
            fontSize: '14px',
            border: 'none'
          }}
          onClick={onImport}
        >
          📤 导入
        </Button>
        <Button 
          type="text" 
          style={{ 
            color: '#1890ff',
            padding: '4px 8px',
            fontSize: '14px',
            border: 'none'
          }}
          onClick={onAdd}
        >
          ➕ 新增
        </Button>
        <Button 
          type="text" 
          style={{ 
            color: clearDisabled ? '#d9d9d9' : '#ff4d4f',
            padding: '4px 8px',
            fontSize: '14px',
            border: 'none'
          }}
          onClick={onClear}
          disabled={clearDisabled}
        >
          🗑️ 批量删除 {selectedCount > 0 && `(${selectedCount})`}
        </Button>
      </Space>
    </div>
  )
}

export default OperationButtons
