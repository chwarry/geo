import React from 'react';
import { Spin, Empty, Collapse, Card, Tabs, Table, Space, Button, Message } from '@arco-design/web-react';
import { IconRight, IconFile } from '@arco-design/web-react/icon';
import DetectionChart from '../../../components/DetectionChart';
import { WorkPoint } from '../../../services/geoForecastAPI';

const CollapseItem = Collapse.Item;
const TabPane = Tabs.TabPane;

interface WorkPointListProps {
  loading: boolean;
  workPoints: WorkPoint[];
  searchKeyword: string;
  onExpand: (workPoint: WorkPoint) => void;
  // Detail props
  loadingDetection: boolean;
  detectionData: any;
  selectedWorkPointId: string | undefined;
  loadingForecastMethods: boolean;
  geophysicalData: any[];
  palmSketchData: any[];
  tunnelSketchData: any[];
  drillingData: any[];
  surfaceData: any;
  onNavigate: (path: string) => void;
}

const WorkPointList: React.FC<WorkPointListProps> = ({
  loading,
  workPoints,
  searchKeyword,
  onExpand,
  loadingDetection,
  detectionData,
  selectedWorkPointId,
  loadingForecastMethods,
  geophysicalData,
  palmSketchData,
  tunnelSketchData,
  drillingData,
  surfaceData,
  onNavigate
}) => {
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
            if (typeof key === 'string' && keys.includes(key)) {
              const workPoint = workPoints.find(wp => wp.id === key);
              if (workPoint) {
                onExpand(workPoint);
              }
            }
          }}
        >
          {workPoints.map((item) => (
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
              {/* 工点详细内容 - 可以在这里拆分出 DetailComponent，但为了简单暂且保留在这里 */}
              <div style={{ padding: '20px' }}>
                {/* 探测信息图表 */}
                <Card 
                  title={<span style={{ fontSize: '16px', fontWeight: 500 }}>探测信息</span>}
                  style={{ marginBottom: '20px' }}
                  bodyStyle={{ padding: '24px' }}
                >
                  <Spin loading={loadingDetection}>
                    {detectionData && selectedWorkPointId === item.id ? (
                      <DetectionChart data={detectionData} />
                    ) : (
                      <Empty description="暂无探测数据" style={{ padding: '60px 0' }} />
                    )}
                  </Spin>
                </Card>

                {/* 五种预报方法选项卡 */}
                <Card bodyStyle={{ padding: 0 }}>
                  <Spin loading={loadingForecastMethods}>
                    <Tabs defaultActiveTab="geophysical" type="card-gutter">
                      <TabPane key="geophysical" title={`物探法 (${geophysicalData.length})`}>
                        <div style={{ padding: '24px' }}>
                          {geophysicalData.length > 0 ? (
                            <Table
                              columns={[
                                { title: 'ID', dataIndex: 'wtfPk', width: 80 },
                                { title: '方法', dataIndex: 'methodName', width: 120, render: (text, record) => text || record.method },
                                { title: '里程', dataIndex: 'dkilo', width: 120, render: (val) => `DK${val}` },
                                { title: '长度(m)', dataIndex: 'wtfLength', width: 100 },
                                { title: '监测日期', dataIndex: 'monitordate', width: 120 },
                                { title: '备注', dataIndex: 'addition' }
                              ]}
                              data={geophysicalData}
                              pagination={false}
                              rowKey="wtfPk"
                            />
                          ) : (
                            <Empty description="暂无物探法数据" />
                          )}
                        </div>
                      </TabPane>
                      <TabPane key="palm-sketch" title={`掌子面素描 (${palmSketchData.length})`}>
                        <div style={{ padding: '24px' }}>
                          {palmSketchData.length > 0 ? (
                            <Table
                              columns={[
                                { title: 'ID', dataIndex: 'zzmsmPk', width: 80 },
                                { title: '里程', dataIndex: 'dkilo', width: 120, render: (val) => `DK${val}` },
                                { title: '围岩等级', dataIndex: 'rockGrade', width: 100 },
                                { title: '涌水情况', dataIndex: 'waterInflow', width: 100 },
                                { title: '监测日期', dataIndex: 'monitordate', width: 120 },
                                { title: '备注', dataIndex: 'addition' }
                              ]}
                              data={palmSketchData}
                              pagination={false}
                              rowKey="zzmsmPk"
                            />
                          ) : (
                            <Empty description="暂无掌子面素描数据" />
                          )}
                        </div>
                      </TabPane>
                      <TabPane key="tunnel-sketch" title={`洞身素描 (${tunnelSketchData.length})`}>
                        <div style={{ padding: '24px' }}>
                          {tunnelSketchData.length > 0 ? (
                            <Table
                              columns={[
                                { title: 'ID', dataIndex: 'dssmPk', width: 80 },
                                { title: '里程', dataIndex: 'dkilo', width: 120, render: (val) => `DK${val}` },
                                { title: '衬砌厚度(cm)', dataIndex: 'liningThickness', width: 120 },
                                { title: '裂缝数量', dataIndex: 'crackCount', width: 100 },
                                { title: '监测日期', dataIndex: 'monitordate', width: 120 },
                                { title: '备注', dataIndex: 'addition' }
                              ]}
                              data={tunnelSketchData}
                              pagination={false}
                              rowKey="dssmPk"
                            />
                          ) : (
                            <Empty description="暂无洞身素描数据" />
                          )}
                        </div>
                      </TabPane>
                      <TabPane key="drilling" title={`钻探法 (${drillingData.length})`}>
                        <div style={{ padding: '24px' }}>
                          {drillingData.length > 0 ? (
                            <Table
                              columns={[
                                { title: 'ID', dataIndex: 'ztfPk', width: 80 },
                                { title: '里程', dataIndex: 'dkilo', width: 120, render: (val) => `DK${val}` },
                                { title: '钻探深度(m)', dataIndex: 'drillDepth', width: 120 },
                                { title: '取芯长度(m)', dataIndex: 'coreLength', width: 120 },
                                { title: '岩石类型', dataIndex: 'rockType', width: 100 },
                                { title: '监测日期', dataIndex: 'monitordate', width: 120 },
                                { title: '备注', dataIndex: 'addition' }
                              ]}
                              data={drillingData}
                              pagination={false}
                              rowKey="ztfPk"
                            />
                          ) : (
                            <Empty description="暂无钻探法数据" />
                          )}
                        </div>
                      </TabPane>
                      <TabPane key="surface" title="地表补充">
                        <div style={{ padding: '24px' }}>
                          {surfaceData ? (
                            <div>
                              <pre>{JSON.stringify(surfaceData, null, 2)}</pre>
                            </div>
                          ) : (
                            <Empty description="暂无地表补充数据" />
                          )}
                        </div>
                      </TabPane>
                    </Tabs>
                  </Spin>
                </Card>

                {/* 三个导航按钮 */}
                <Card bodyStyle={{ padding: '24px' }} style={{ marginTop: '20px' }}>
                  <Space size="large">
                    <Button
                      type="primary"
                      size="large"
                      onClick={() => onNavigate('/forecast/design')}
                    >
                      设计信息
                    </Button>
                    <Button
                      type="primary"
                      size="large"
                      onClick={() => onNavigate(`/forecast/geology/${item.id}`)}
                    >
                      地质预报
                    </Button>
                    <Button 
                      type="primary"
                      size="large"
                      onClick={() => onNavigate('/forecast/comprehensive')}
                    >
                      综合结论
                    </Button>
                  </Space>
                </Card>
              </div>
            </CollapseItem>
          ))}
        </Collapse>
      )}
    </Spin>
  );
};

export default WorkPointList;

