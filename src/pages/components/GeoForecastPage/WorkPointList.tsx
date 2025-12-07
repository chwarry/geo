import React, { useState, useCallback } from 'react';
import { Spin, Empty, Collapse } from '@arco-design/web-react';
import { IconRight, IconFile } from '@arco-design/web-react/icon';
import { WorkPoint } from '../../../services/geoForecastAPI';
import apiAdapter from '../../../services/realAPI';
import WorkPointDetail from './WorkPointDetail';

const CollapseItem = Collapse.Item;

interface WorkPointListProps {
  loading: boolean;
  workPoints: WorkPoint[];
  searchKeyword: string;
  onExpand: (workPoint: WorkPoint, expanded: boolean) => void;
  onNavigate: (path: string) => void;
}

const WorkPointList: React.FC<WorkPointListProps> = ({
  loading,
  workPoints,
  searchKeyword,
  onExpand,
  onNavigate
}) => {
  // 本地状态管理 - 使用 Map 存储每个工点的数据
  const [detectionDataMap, setDetectionDataMap] = useState<Record<string, any>>({});
  const [geophysicalDataMap, setGeophysicalDataMap] = useState<Record<string, any[]>>({});
  const [palmSketchDataMap, setPalmSketchDataMap] = useState<Record<string, any[]>>({});
  const [tunnelSketchDataMap, setTunnelSketchDataMap] = useState<Record<string, any[]>>({});
  const [drillingDataMap, setDrillingDataMap] = useState<Record<string, any[]>>({});
  const [surfaceDataMap, setSurfaceDataMap] = useState<Record<string, any[]>>({});
  
  const [loadingDetectionMap, setLoadingDetectionMap] = useState<Record<string, boolean>>({});
  const [loadingForecastMap, setLoadingForecastMap] = useState<Record<string, boolean>>({});

  // 加载工点详情数据
  const loadWorkPointData = useCallback(async (workPointId: string) => {
    // 设置加载状态
    setLoadingDetectionMap(prev => ({ ...prev, [workPointId]: true }));
    setLoadingForecastMap(prev => ({ ...prev, [workPointId]: true }));

    try {
      // 1. 加载探测数据
      apiAdapter.getGeoPointDetectionData(workPointId)
        .then(data => {
          setDetectionDataMap(prev => ({ ...prev, [workPointId]: data }));
        })
        .catch(err => {
          console.error('加载探测数据失败:', err);
        })
        .finally(() => {
          setLoadingDetectionMap(prev => ({ ...prev, [workPointId]: false }));
        });

      // 2. 加载预报方法数据 - 只显示已上传的数据 (submitFlag === 1)
      Promise.all([
        apiAdapter.getGeophysicalList({ pageNum: 1, pageSize: 100, siteId: workPointId }),
        apiAdapter.getPalmSketchList({ pageNum: 1, pageSize: 100, siteId: workPointId }),
        apiAdapter.getTunnelSketchList({ pageNum: 1, pageSize: 100, siteId: workPointId }),
        apiAdapter.getDrillingList({ pageNum: 1, pageSize: 100, siteId: workPointId }),
        apiAdapter.getSurfaceSupplementList({ pageNum: 1, pageSize: 100, siteId: workPointId })
      ]).then(([geophysical, palmSketch, tunnelSketch, drilling, surface]) => {
        // 过滤只显示已上传的数据 (submitFlag === 1)
        const filterUploaded = (records: any[]) => 
          (records || []).filter(item => Number(item.submitFlag) === 1);
        
        setGeophysicalDataMap(prev => ({ ...prev, [workPointId]: filterUploaded(geophysical.records) }));
        setPalmSketchDataMap(prev => ({ ...prev, [workPointId]: filterUploaded(palmSketch.records) }));
        setTunnelSketchDataMap(prev => ({ ...prev, [workPointId]: filterUploaded(tunnelSketch.records) }));
        setDrillingDataMap(prev => ({ ...prev, [workPointId]: filterUploaded(drilling.records) }));
        setSurfaceDataMap(prev => ({ ...prev, [workPointId]: filterUploaded(surface.records) }));
      }).catch(err => {
        console.error('加载预报方法数据失败:', err);
      }).finally(() => {
        setLoadingForecastMap(prev => ({ ...prev, [workPointId]: false }));
      });

    } catch (error) {
      console.error('加载工点数据失败:', error);
    }
  }, []);

  return (
    <Spin loading={loading}>
      {workPoints.length === 0 ? (
        <Empty 
          description={searchKeyword ? "未找到匹配的工点" : "暂无工点数据"}
          style={{ padding: '40px 0' }}
        />
      ) : (
        <Collapse
          accordion={false}
          style={{ 
            backgroundColor: 'transparent', 
            border: 'none'
          }}
          expandIcon={<IconRight />}
          expandIconPosition="right"
          onChange={(key, keys) => {
            const currentKeys = Array.isArray(keys) ? keys : [keys];
            // 对每个展开的 key，如果没有数据则加载
            currentKeys.forEach(k => {
              if (!detectionDataMap[k] && !loadingDetectionMap[k]) {
                loadWorkPointData(k);
              }
            });
          }}
        >
          {workPoints.map((item) => {
            // 获取当前工点的数据
            const detectionData = detectionDataMap[item.id];
            const geophysicalData = geophysicalDataMap[item.id] || [];
            const palmSketchData = palmSketchDataMap[item.id] || [];
            const tunnelSketchData = tunnelSketchDataMap[item.id] || [];
            const drillingData = drillingDataMap[item.id] || [];
            const surfaceData = surfaceDataMap[item.id] || [];
            
            const isLoadingDetection = loadingDetectionMap[item.id] || false;
            const isLoadingForecast = loadingForecastMap[item.id] || false;
            
            return (
              <CollapseItem
                key={item.id}
                header={
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    width: '100%'
                  }}>
                    <IconFile style={{ 
                      marginRight: '12px', 
                      color: '#165dff', 
                      fontSize: '16px'
                    }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ 
                        fontWeight: 500,
                        color: '#1d2129',
                        fontSize: '15px',
                        marginBottom: '6px'
                      }}>
                        {item.name}
                      </div>
                      <div style={{ 
                        fontSize: '13px', 
                        color: '#86909c',
                        display: 'flex',
                        gap: '16px',
                        flexWrap: 'wrap'
                      }}>
                        <span>里程: {item.code}</span>
                        <span>长度: {item.length > 0 ? '+' : ''}{item.length}m</span>
                        {item.type && <span>类型: {item.type}</span>}
                        {item.riskLevel && (
                          <span style={{ 
                            color: item.riskLevel === '高风险' ? '#f53f3f' : 
                                    item.riskLevel === '中风险' ? '#ff7d00' : '#00b42a',
                            fontWeight: 500
                          }}>
                            {item.riskLevel}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                }
                name={item.id}
                destroyOnHide
              >
                <WorkPointDetail
                  workPointId={item.id}
                  isLoadingDetection={isLoadingDetection}
                  detectionData={detectionData}
                  isLoadingForecast={isLoadingForecast}
                  geophysicalData={geophysicalData}
                  palmSketchData={palmSketchData}
                  tunnelSketchData={tunnelSketchData}
                  drillingData={drillingData}
                  surfaceData={surfaceData}
                  onNavigate={onNavigate}
                />
              </CollapseItem>
            );
          })}
        </Collapse>
      )}
    </Spin>
  );
};

export default WorkPointList;

