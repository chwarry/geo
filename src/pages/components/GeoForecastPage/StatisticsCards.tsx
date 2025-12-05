import React from 'react';
import { Card } from '@arco-design/web-react';

interface Statistics {
  totalTunnels: number;
  totalWorkPoints: number;
  completedWorkPoints: number;
  highRiskPoints: number;
}

interface StatisticsCardsProps {
  statistics: Statistics;
}

const StatisticsCards: React.FC<StatisticsCardsProps> = ({ statistics }) => {
  return (
    <div style={{ 
      marginBottom: '24px',
      display: 'flex',
      gap: '16px'
    }}>
      <Card style={{ flex: 1, textAlign: 'center' }}>
        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#165dff' }}>
          {statistics.totalTunnels}
        </div>
        <div style={{ color: '#86909c', marginTop: '4px' }}>隧道总数</div>
      </Card>
      <Card style={{ flex: 1, textAlign: 'center' }}>
        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#52c41a' }}>
          {statistics.totalWorkPoints}
        </div>
        <div style={{ color: '#86909c', marginTop: '4px' }}>工点总数</div>
      </Card>
      <Card style={{ flex: 1, textAlign: 'center' }}>
        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#faad14' }}>
          {statistics.completedWorkPoints}
        </div>
        <div style={{ color: '#86909c', marginTop: '4px' }}>已完成</div>
      </Card>
      <Card style={{ flex: 1, textAlign: 'center' }}>
        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f5222d' }}>
          {statistics.highRiskPoints}
        </div>
        <div style={{ color: '#86909c', marginTop: '4px' }}>高风险工点</div>
      </Card>
    </div>
  );
};

export default StatisticsCards;

