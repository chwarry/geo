import React, { useState, useEffect } from 'react';
import { Card, Button, Space, Typography, Table, Message, Spin, Select, Tabs } from '@arco-design/web-react';
import { get } from '../utils/api';

const { Title, Text } = Typography;
const TabPane = Tabs.TabPane;

// 类型定义
interface BidSection {
  bdPk?: number;
  sdPk?: number;
  bdName?: string;
  sdName?: string;
  [key: string]: any;
}

interface GeophysicalMethod {
  wtfPk?: number;
  wtfName?: string;
  wtfDate?: string;
  [key: string]: any;
}

interface SeismicData {
  tspPk?: number;
  tspDepth?: number;
  tspDistance?: number;
  [key: string]: any;
}

const BusinessDataPage: React.FC = () => {
  // 标段数据
  const [bidSections, setBidSections] = useState<BidSection[]>([]);
  const [loadingBidSections, setLoadingBidSections] = useState(false);
  
  // 物探法数据
  const [geophysicalMethods, setGeophysicalMethods] = useState<GeophysicalMethod[]>([]);
  const [loadingGeophysical, setLoadingGeophysical] = useState(false);
  const [selectedBidSection, setSelectedBidSection] = useState<number>(1);
  
  // 地震波反射数据
  const [seismicData, setSeismicData] = useState<SeismicData[]>([]);
  const [loadingSeismic, setLoadingSeismic] = useState(false);
  const [selectedWtfPk, setSelectedWtfPk] = useState<number>(1);

  // 获取标段列表
  const fetchBidSections = async (userId: number = 1) => {
    setLoadingBidSections(true);
    try {
      const response = await get<any>('/api/bd/list', { params: { userid: userId } });
      console.log('标段数据响应:', response);
      
      // 根据后端返回格式调整
      const data = response?.data || response || [];
      setBidSections(Array.isArray(data) ? data : [data]);
      Message.success(`成功获取 ${Array.isArray(data) ? data.length : 1} 个标段`);
    } catch (error: any) {
      console.error('获取标段列表失败:', error);
      Message.error('获取标段列表失败: ' + error.message);
    } finally {
      setLoadingBidSections(false);
    }
  };

  // 获取物探法数据
  const fetchGeophysicalMethods = async (bdPk: number) => {
    setLoadingGeophysical(true);
    try {
      const response = await get<any>(`/api/wtf/${bdPk}`);
      console.log('物探法数据响应:', response);
      
      const data = response?.data || response || [];
      setGeophysicalMethods(Array.isArray(data) ? data : [data]);
      Message.success(`成功获取物探法数据`);
    } catch (error: any) {
      console.error('获取物探法数据失败:', error);
      Message.error('获取物探法数据失败: ' + error.message);
    } finally {
      setLoadingGeophysical(false);
    }
  };

  // 获取地震波反射数据
  const fetchSeismicData = async (wtfPk: number) => {
    setLoadingSeismic(true);
    try {
      const response = await get<any>('/api/wtf/tsp', { params: { wtfPk } });
      console.log('地震波反射数据响应:', response);
      
      const data = response?.data || response || [];
      setSeismicData(Array.isArray(data) ? data : [data]);
      Message.success(`成功获取地震波反射数据`);
    } catch (error: any) {
      console.error('获取地震波反射数据失败:', error);
      Message.error('获取地震波反射数据失败: ' + error.message);
    } finally {
      setLoadingSeismic(false);
    }
  };

  // 初始化加载数据
  useEffect(() => {
    fetchBidSections();
  }, []);

  // 标段列表列定义
  const bidSectionColumns = [
    { title: '标段ID', dataIndex: 'bdPk', width: 100 },
    { title: '标段名称', dataIndex: 'bdName', width: 200 },
    { title: '隧道ID', dataIndex: 'sdPk', width: 100 },
    { title: '隧道名称', dataIndex: 'sdName', width: 200 },
    {
      title: '操作',
      width: 200,
      render: (_: any, record: BidSection) => (
        <Space>
          <Button
            type="primary"
            size="small"
            onClick={() => {
              if (record.bdPk) {
                setSelectedBidSection(record.bdPk);
                fetchGeophysicalMethods(record.bdPk);
              }
            }}
          >
            查看物探法
          </Button>
        </Space>
      ),
    },
  ];

  // 物探法列定义
  const geophysicalColumns = [
    { title: '物探法ID', dataIndex: 'wtfPk', width: 100 },
    { title: '物探法名称', dataIndex: 'wtfName', width: 200 },
    { title: '探测日期', dataIndex: 'wtfDate', width: 150 },
    { title: '探测方法', dataIndex: 'wtfMethod', width: 150 },
    {
      title: '操作',
      width: 200,
      render: (_: any, record: GeophysicalMethod) => (
        <Space>
          <Button
            type="primary"
            size="small"
            onClick={() => {
              if (record.wtfPk) {
                setSelectedWtfPk(record.wtfPk);
                fetchSeismicData(record.wtfPk);
              }
            }}
          >
            查看地震波数据
          </Button>
        </Space>
      ),
    },
  ];

  // 地震波反射数据列定义
  const seismicColumns = [
    { title: '数据ID', dataIndex: 'tspPk', width: 100 },
    { title: '深度(m)', dataIndex: 'tspDepth', width: 120 },
    { title: '距离(m)', dataIndex: 'tspDistance', width: 120 },
    { title: '反射强度', dataIndex: 'tspIntensity', width: 120 },
    { title: '波速(m/s)', dataIndex: 'tspVelocity', width: 120 },
  ];

  return (
    <div style={{ padding: '24px', backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
      <Card style={{ marginBottom: '24px' }}>
        <Title heading={3}>业务数据查询</Title>
        <Text type="secondary">
          集成后端真实业务接口：标段查询、物探法数据、地震波反射数据
        </Text>
      </Card>

      <Tabs defaultActiveTab="1" type="card">
        {/* 标段查询 Tab */}
        <TabPane key="1" title="📍 标段查询">
          <Card
            title="标段列表"
            extra={
              <Space>
                <Button type="primary" onClick={() => fetchBidSections(1)} loading={loadingBidSections}>
                  刷新数据
                </Button>
              </Space>
            }
          >
            <Spin loading={loadingBidSections}>
              <Table
                columns={bidSectionColumns}
                data={bidSections}
                pagination={{ pageSize: 10 }}
                border
                stripe
                noDataElement={
                  <div style={{ textAlign: 'center', padding: '40px 0', color: '#86909c' }}>
                    暂无数据，点击刷新按钮获取
                  </div>
                }
              />
            </Spin>
          </Card>
        </TabPane>

        {/* 物探法查询 Tab */}
        <TabPane key="2" title="🔍 物探法数据">
          <Card
            title="物探法数据"
            extra={
              <Space>
                <Text>标段ID:</Text>
                <Select
                  value={selectedBidSection}
                  onChange={(value) => {
                    setSelectedBidSection(value);
                    fetchGeophysicalMethods(value);
                  }}
                  style={{ width: 200 }}
                >
                  {bidSections.map((bd) => (
                    <Select.Option key={bd.bdPk} value={bd.bdPk!}>
                      {bd.bdName || `标段 ${bd.bdPk}`}
                    </Select.Option>
                  ))}
                </Select>
                <Button
                  type="primary"
                  onClick={() => fetchGeophysicalMethods(selectedBidSection)}
                  loading={loadingGeophysical}
                >
                  查询
                </Button>
              </Space>
            }
          >
            <Spin loading={loadingGeophysical}>
              <Table
                columns={geophysicalColumns}
                data={geophysicalMethods}
                pagination={{ pageSize: 10 }}
                border
                stripe
                noDataElement={
                  <div style={{ textAlign: 'center', padding: '40px 0', color: '#86909c' }}>
                    暂无数据，请选择标段并点击查询
                  </div>
                }
              />
            </Spin>
          </Card>
        </TabPane>

        {/* 地震波反射数据 Tab */}
        <TabPane key="3" title="📊 地震波反射">
          <Card
            title="地震波反射数据"
            extra={
              <Space>
                <Text>物探法ID:</Text>
                <Select
                  value={selectedWtfPk}
                  onChange={(value) => {
                    setSelectedWtfPk(value);
                    fetchSeismicData(value);
                  }}
                  style={{ width: 200 }}
                >
                  {geophysicalMethods.map((wtf) => (
                    <Select.Option key={wtf.wtfPk} value={wtf.wtfPk!}>
                      {wtf.wtfName || `物探法 ${wtf.wtfPk}`}
                    </Select.Option>
                  ))}
                </Select>
                <Button
                  type="primary"
                  onClick={() => fetchSeismicData(selectedWtfPk)}
                  loading={loadingSeismic}
                >
                  查询
                </Button>
              </Space>
            }
          >
            <Spin loading={loadingSeismic}>
              <Table
                columns={seismicColumns}
                data={seismicData}
                pagination={{ pageSize: 10 }}
                border
                stripe
                noDataElement={
                  <div style={{ textAlign: 'center', padding: '40px 0', color: '#86909c' }}>
                    暂无数据，请选择物探法并点击查询
                  </div>
                }
              />
            </Spin>
          </Card>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default BusinessDataPage;

