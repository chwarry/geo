import React from 'react';
import { Card, Tabs, Table, Space, Button, Spin, Empty } from '@arco-design/web-react';
import DetectionChart from '../../../components/DetectionChart';

const TabPane = Tabs.TabPane;

interface WorkPointDetailProps {
  workPointId: string;
  isLoadingDetection: boolean;
  detectionData: any;
  isLoadingForecast: boolean;
  geophysicalData: any[];
  palmSketchData: any[];
  tunnelSketchData: any[];
  drillingData: any[];
  surfaceData: any[];
  onNavigate: (path: string) => void;
}

// 方法类型映射
const methodTypeMap: Record<number, string> = {
  1: '物探法',
  2: '掌子面素描',
  3: '洞身素描',
  4: '钻探法',
  5: '地表补充'
};

// 物探法子方法映射
const geophysicalMethodMap: Record<number, string> = {
  1: '地震波反射',
  2: '地质雷达',
  3: '瞬变电磁',
  4: '红外探测',
  5: '其它'
};

const WorkPointDetail: React.FC<WorkPointDetailProps> = ({
  workPointId,
  isLoadingDetection,
  detectionData,
  isLoadingForecast,
  geophysicalData,
  palmSketchData,
  tunnelSketchData,
  drillingData,
  surfaceData,
  onNavigate
}) => {
  // 查看详情按钮点击处理
  const handleViewDetail = (record: any, methodType: string) => {
    const pk = record.ybPk || record.wtfPk || record.zzmsmPk || record.dssmPk || record.ztfPk || record.dbbcPk;
    onNavigate(`/forecast/geology/detail/${methodType}/${pk}`);
  };

  // 通用表格列配置
  const getColumns = (methodType: string) => [
    { 
      title: '预报方法', 
      dataIndex: 'wtfMethod',
      width: 120,
      render: (val: number, record: any) => {
        // 物探法显示子方法名称
        if (methodType === 'geophysical') {
          return geophysicalMethodMap[val] || geophysicalMethodMap[record.method] || '物探法';
        }
        return methodTypeMap[record.method] || methodType;
      }
    },
    { 
      title: '预报时间', 
      dataIndex: 'monitordate', 
      width: 160,
      render: (val: string) => {
        if (!val) return '-';
        // 格式化为 YYYY-MM-DD HH:mm:ss
        return val.replace('T', ' ').substring(0, 19);
      }
    },
    { 
      title: '掌子面里程', 
      dataIndex: 'dkilo', 
      width: 150, 
      render: (val: number, record: any) => {
        const dkname = record.dkname || 'D1K';
        if (!val) return '-';
        // 格式化里程显示，如 D1K725+755.00
        const kiloStr = val.toFixed(2);
        const intPart = Math.floor(val / 1000);
        const decPart = (val % 1000).toFixed(2);
        return `${dkname}${intPart}+${decPart}`;
      }
    },
    { 
      title: '长度', 
      dataIndex: 'ybLength', 
      width: 80,
      render: (val: number, record: any) => val || record.wtfLength || record.dbbcLength || '-'
    },
    { 
      title: '状态', 
      dataIndex: 'submitFlag', 
      width: 80,
      render: () => (
        <span style={{ color: '#00b42a' }}>已上传</span>
      )
    },
    {
      title: '操作',
      width: 80,
      render: (_: any, record: any) => (
        <Button 
          type="text" 
          size="small"
          style={{ color: '#165dff' }}
          onClick={() => handleViewDetail(record, methodType)}
        >
          <span style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            width: 24, 
            height: 24, 
            borderRadius: 4,
            backgroundColor: '#e8f3ff'
          }}>
            📋
          </span>
        </Button>
      )
    }
  ];

  return (
    <div style={{ padding: '20px' }}>
      {/* 探测信息图表 */}
      <Card 
        title={<span style={{ fontSize: '16px', fontWeight: 500 }}>探测信息</span>}
        style={{ marginBottom: '20px' }}
        bodyStyle={{ padding: '24px' }}
      >
        <Spin loading={isLoadingDetection && !detectionData}> 
          {detectionData ? (
            <DetectionChart data={detectionData} />
          ) : (
            <Empty description="暂无探测数据" style={{ padding: '60px 0' }} />
          )}
        </Spin>
      </Card>

      {/* 五种预报方法选项卡 - 只显示已上传的数据 */}
      <Card bodyStyle={{ padding: 0 }}>
        <Spin loading={isLoadingForecast && geophysicalData.length === 0}>
          <Tabs defaultActiveTab="geophysical" type="card-gutter">
            <TabPane key="geophysical" title={`物探法 (${geophysicalData.length})`}>
              <div style={{ padding: '24px' }}>
                {geophysicalData.length > 0 ? (
                  <Table
                    columns={getColumns('geophysical')}
                    data={geophysicalData}
                    pagination={false}
                    rowKey={(record) => record.ybPk || record.wtfPk}
                  />
                ) : (
                  <Empty description="暂无已上传的物探法数据" />
                )}
              </div>
            </TabPane>
            <TabPane key="palm-sketch" title={`掌子面素描 (${palmSketchData.length})`}>
              <div style={{ padding: '24px' }}>
                {palmSketchData.length > 0 ? (
                  <Table
                    columns={getColumns('palmSketch')}
                    data={palmSketchData}
                    pagination={false}
                    rowKey={(record) => record.ybPk || record.zzmsmPk}
                  />
                ) : (
                  <Empty description="暂无已上传的掌子面素描数据" />
                )}
              </div>
            </TabPane>
            <TabPane key="tunnel-sketch" title={`洞身素描 (${tunnelSketchData.length})`}>
              <div style={{ padding: '24px' }}>
                {tunnelSketchData.length > 0 ? (
                  <Table
                    columns={getColumns('tunnelSketch')}
                    data={tunnelSketchData}
                    pagination={false}
                    rowKey={(record) => record.ybPk || record.dssmPk}
                  />
                ) : (
                  <Empty description="暂无已上传的洞身素描数据" />
                )}
              </div>
            </TabPane>
            <TabPane key="drilling" title={`钻探法 (${drillingData.length})`}>
              <div style={{ padding: '24px' }}>
                {drillingData.length > 0 ? (
                  <Table
                    columns={getColumns('drilling')}
                    data={drillingData}
                    pagination={false}
                    rowKey={(record) => record.ybPk || record.ztfPk}
                  />
                ) : (
                  <Empty description="暂无已上传的钻探法数据" />
                )}
              </div>
            </TabPane>
            <TabPane key="surface" title={`地表补充 (${surfaceData.length})`}>
              <div style={{ padding: '24px' }}>
                {surfaceData.length > 0 ? (
                  <Table
                    columns={getColumns('surface')}
                    data={surfaceData}
                    pagination={false}
                    rowKey={(record) => record.ybPk || record.dbbcPk}
                  />
                ) : (
                  <Empty description="暂无已上传的地表补充数据" />
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
            onClick={() => onNavigate(`/forecast/design?siteId=${workPointId}`)}
          >
            设计信息
          </Button>
          <Button
            type="primary"
            size="large"
            onClick={() => onNavigate(`/forecast/geology/${workPointId}`)}
          >
            地质预报
          </Button>
          <Button
            type="primary"
            size="large"
            onClick={() => onNavigate(`/forecast/comprehensive?siteId=${workPointId}`)}
          >
            综合结论
          </Button>
        </Space>
      </Card>
    </div>
  );
};

export default WorkPointDetail;
