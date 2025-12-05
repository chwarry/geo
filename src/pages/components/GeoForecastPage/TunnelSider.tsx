import React from 'react';
import { Layout, Input, Spin, Empty, Card } from '@arco-design/web-react';
import { IconFile } from '@arco-design/web-react/icon';
import { Tunnel } from '../../../services/geoForecastAPI';

const { Sider } = Layout;
const { Search } = Input;

interface TunnelSiderProps {
  searchKeyword: string;
  onSearch: (keyword: string) => void;
  loading: boolean;
  tunnels: Tunnel[];
  selectedTunnelId: string;
  onSelectTunnel: (id: string) => void;
}

const TunnelSider: React.FC<TunnelSiderProps> = ({
  searchKeyword,
  onSearch,
  loading,
  tunnels,
  selectedTunnelId,
  onSelectTunnel
}) => {
  return (
    <Sider 
      width={280} 
      style={{ 
        backgroundColor: '#f7f8fa',
        borderRight: '1px solid #e8e9ea',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}
    >
      <div style={{ 
        padding: '16px',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          marginBottom: '16px',
          fontSize: '16px',
          fontWeight: 500,
          color: '#1d2129',
          flexShrink: 0
        }}>
          <IconFile style={{ marginRight: '8px', color: '#165dff' }} />
          标段查询
        </div>
        
        <Search 
          placeholder="搜索隧道名称或编号"
          style={{ marginBottom: '16px', flexShrink: 0 }}
          value={searchKeyword}
          onChange={onSearch}
          allowClear
        />

        <div style={{ 
          marginTop: '20px',
          flex: 1,
          overflow: 'auto',
          minHeight: 0
        }}>
          <Spin loading={loading}>
            {tunnels.length === 0 ? (
              <Empty 
                description="暂无隧道数据"
                style={{ padding: '20px 0' }}
              />
            ) : (
              tunnels.map((tunnel) => (
                <Card
                  key={tunnel.id}
                  hoverable
                  style={{
                    marginBottom: '8px',
                    backgroundColor: tunnel.id === selectedTunnelId ? '#e8f3ff' : '#fff',
                    border: tunnel.id === selectedTunnelId ? '1px solid #165dff' : '1px solid #e8e9ea',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  bodyStyle={{ padding: '12px 16px' }}
                  onClick={() => onSelectTunnel(tunnel.id)}
                >
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    color: tunnel.id === selectedTunnelId ? '#165dff' : '#1d2129'
                  }}>
                    <IconFile style={{ marginRight: '8px' }} />
                    <div>
                      <div style={{ fontWeight: 500 }}>{tunnel.name}</div>
                      <div style={{ fontSize: '12px', color: '#86909c', marginTop: '2px' }}>
                        {tunnel.code}
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </Spin>
        </div>
      </div>
    </Sider>
  );
};

export default TunnelSider;

