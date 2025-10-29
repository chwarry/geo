import React, { useState, useEffect } from 'react'
import { 
  Card, 
  Button, 
  Select, 
  DatePicker, 
  Space, 
  Table, 
  Empty,
  Layout,
  Menu,
  Avatar,
  Dropdown,
  Typography,
  Message,
  Spin
} from '@arco-design/web-react'
import { IconUser, IconDown } from '@arco-design/web-react/icon'
import apiAdapter from '../services/apiAdapter'

const { Header, Content } = Layout
const { Text } = Typography

// 地质预报记录类型
type GeologyForecastRecord = {
  id: string
  method: string
  time: string
  mileage: string
  length: string
  status: string
  uploadTip: string
}

// 表格列定义
const columns = [
  {
    title: '预报方法',
    dataIndex: 'method',
    key: 'method',
  },
  {
    title: '预报时间',
    dataIndex: 'time',
    key: 'time',
  },
  {
    title: '掌子面里程',
    dataIndex: 'mileage',
    key: 'mileage',
  },
  {
    title: '预报长度',
    dataIndex: 'length',
    key: 'length',
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
  },
  {
    title: '上传提示',
    dataIndex: 'uploadTip',
    key: 'uploadTip',
  },
  {
    title: '操作',
    dataIndex: 'operation',
    key: 'operation',
    render: () => (
      <Button type="text" size="small">
        操作
      </Button>
    ),
  },
]

function ForecastGeologyPage() {
  const [selectedMethod, setSelectedMethod] = useState('物探法')
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<GeologyForecastRecord[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  
  const methods = ['物探法', '掌子面素描', '洞身素描', '钻探法', '地表补充']
  
  const userMenuItems = [
    { key: 'profile', label: '个人中心' },
    { key: 'settings', label: '设置' },
    { key: 'logout', label: '退出登录' },
  ]

  // 获取地质预报数据
  const fetchGeologyData = async () => {
    setLoading(true)
    try {
      // 这里暂时使用 Mock 数据，因为没有工点ID
      // 实际应该从路由参数或上下文中获取 workPointId
      const mockWorkPointId = '1'
      
      console.log('🔍 [ForecastGeologyPage] 获取地质预报数据, workPointId:', mockWorkPointId)
      
      const result = await apiAdapter.getWorkPointGeologyForecast(mockWorkPointId, {
        page,
        pageSize
      })
      
      console.log('✅ [ForecastGeologyPage] 地质预报数据:', result)
      
      // 转换数据格式
      const geologyData: GeologyForecastRecord[] = result.list.map((item: any) => ({
        id: item.id || String(Math.random()),
        method: item.method || selectedMethod,
        time: item.createdAt || new Date().toISOString().split('T')[0],
        mileage: item.startMileage || 'DK713+000',
        length: `${item.length || 0}m`,
        status: '已完成',
        uploadTip: '已上传'
      }))
      
      setData(geologyData)
      setTotal(result.total)
      
      if (geologyData.length > 0) {
        Message.success(`加载了 ${geologyData.length} 条地质预报数据`)
      } else {
        Message.info('暂无地质预报数据')
      }
    } catch (error) {
      console.error('❌ [ForecastGeologyPage] 获取地质预报数据失败:', error)
      Message.error('获取地质预报数据失败')
      setData([])
      setTotal(0)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchGeologyData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize, selectedMethod])

  return (
    <Layout style={{ height: '100vh' }}>
      {/* 顶部导航栏 */}
      <Header style={{ 
        backgroundColor: '#fff', 
        padding: '0 24px',
        borderBottom: '1px solid #e8e9ea',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <h3 style={{ margin: 0, color: '#1d2129', fontSize: '20px', fontWeight: 600 }}>
            超前地质预报
          </h3>
          <Menu
            mode="horizontal"
            style={{ 
              backgroundColor: 'transparent', 
              border: 'none',
              marginLeft: '60px'
            }}
            defaultSelectedKeys={['geology']}
          >
            <Menu.Item key="home">首页</Menu.Item>
            <Menu.Item key="geology">地质预报</Menu.Item>
          </Menu>
        </div>
        
        <Dropdown 
          droplist={
            <Menu>
              {userMenuItems.map(item => (
                <Menu.Item key={item.key}>{item.label}</Menu.Item>
              ))}
            </Menu>
          }
        >
          <Space style={{ cursor: 'pointer', padding: '8px 12px', borderRadius: '6px' }}>
            <Avatar size={32} style={{ backgroundColor: '#165dff' }}>
              <IconUser />
            </Avatar>
            <Text>admin</Text>
            <IconDown />
          </Space>
        </Dropdown>
      </Header>

      <Content style={{ padding: '24px', backgroundColor: '#f7f8fa' }}>
        {/* 面包屑导航 */}
        <div style={{ 
          padding: '16px 24px', 
          backgroundColor: '#7c5cfc', 
          borderRadius: '8px',
          marginBottom: '24px',
          color: '#fff',
          fontSize: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <span>站前3标/青龙山隧道/青龙山隧道出口明洞</span>
          <Button 
            type="text" 
            icon={<span style={{ color: '#fff' }}>↩</span>}
            style={{ color: '#fff' }}
          >
          </Button>
        </div>

        {/* 探测方法选项卡 */}
        <Card style={{ marginBottom: '24px' }}>
          <Space size="medium" wrap>
            {methods.map(method => (
              <Button
                key={method}
                type={selectedMethod === method ? 'primary' : 'outline'}
                onClick={() => setSelectedMethod(method)}
              >
                {method}
              </Button>
            ))}
          </Space>
        </Card>

        {/* 筛选条件 */}
        <Card style={{ marginBottom: '24px' }}>
          <Space size="large">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span>预报方法：</span>
              <Select
                placeholder="请选择预报方法"
                style={{ width: 200 }}
                allowClear
              >
                <Select.Option value="方法1">方法1</Select.Option>
                <Select.Option value="方法2">方法2</Select.Option>
              </Select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span>预报时间：</span>
              <DatePicker style={{ width: 200 }} placeholder="请选择日期" />
            </div>

            <Button type="primary" icon={<span>🔍</span>}>
              查询
            </Button>
            <Button icon={<span>🔄</span>}>
              重置
            </Button>
          </Space>
        </Card>

        {/* 操作按钮 */}
        <Card style={{ marginBottom: '24px' }}>
          <Space>
            <Button type="primary" icon={<span>📥</span>}>
              下载模板
            </Button>
            <Button type="primary" icon={<span>📤</span>}>
              导入
            </Button>
            <Button type="primary" icon={<span>➕</span>}>
              新增
            </Button>
            <Button type="primary" status="danger" icon={<span>🗑️</span>}>
              批量删除
            </Button>
          </Space>
        </Card>

        {/* 数据表格 */}
        <Card>
          <Spin loading={loading}>
            <Table
              columns={columns}
              data={data}
              pagination={{
                total,
                current: page,
                pageSize,
                showTotal: true,
                onChange: (pageNumber, pageSize) => {
                  setPage(pageNumber)
                  setPageSize(pageSize)
                },
              }}
              noDataElement={<Empty description="暂无数据" />}
            />
          </Spin>
        </Card>
      </Content>
    </Layout>
  )
}

export default ForecastGeologyPage

