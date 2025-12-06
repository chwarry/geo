import React from 'react';
import { Space, Input, Select, Button } from '@arco-design/web-react';
import { IconSearch } from '@arco-design/web-react/icon';

const { Search } = Input;

interface WorkPointFilterProps {
  keyword: string;
  onSearch: (keyword: string) => void;
  type: string;
  onTypeChange: (type: string) => void;
  riskLevel: string;
  onRiskLevelChange: (level: string) => void;
  onRefresh: () => void;
}

const WorkPointFilter: React.FC<WorkPointFilterProps> = ({
  keyword,
  onSearch,
  type,
  onTypeChange,
  riskLevel,
  onRiskLevelChange,
  onRefresh
}) => {
  return (
    <>
      <div style={{ 
        marginBottom: '20px', 
        padding: '16px', 
        backgroundColor: '#f7f8fa', 
        borderRadius: '4px',
        display: 'flex',
        gap: '12px',
        alignItems: 'center'
      }}>
        <Input 
          placeholder="输入名称搜索"
          style={{ flex: 1, minWidth: '200px' }}
          value={keyword}
          onChange={onSearch}
          allowClear
          prefix={<IconSearch />}
        />
        <Select
          placeholder="工点类型"
          style={{ width: '160px' }}
          value={type}
          onChange={onTypeChange}
          allowClear
        >
          <Select.Option value="明洞">明洞</Select.Option>
          <Select.Option value="洞门">洞门</Select.Option>
          <Select.Option value="主洞段">主洞段</Select.Option>
          <Select.Option value="横通道">横通道</Select.Option>
          <Select.Option value="暗挖段">暗挖段</Select.Option>
          <Select.Option value="救援站">救援站</Select.Option>
          <Select.Option value="通风井">通风井</Select.Option>
        </Select>
        <Select
          placeholder="风险等级"
          style={{ width: '160px' }}
          value={riskLevel}
          onChange={onRiskLevelChange}
          allowClear
        >
          <Select.Option value="低风险">低风险</Select.Option>
          <Select.Option value="中风险">中风险</Select.Option>
          <Select.Option value="高风险">高风险</Select.Option>
        </Select>
        <Button onClick={onRefresh}>
          刷新
        </Button>
      </div>
    </>
  );
};

export default WorkPointFilter;

