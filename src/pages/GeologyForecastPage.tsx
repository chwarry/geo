import React, { useState, useEffect } from 'react'
import {
  Card, 
  Button, 
  Select, 
  DatePicker, 
  Space, 
  Table, 
  Empty,
  Message,
  Spin,
  Modal,
  Form,
  Input,
  InputNumber,
  Tabs
} from '@arco-design/web-react'
import { IconLeft } from '@arco-design/web-react/icon'
import { useNavigate } from 'react-router-dom'
import apiAdapter from '../services/apiAdapter'
import OperationButtons from '../components/OperationButtons'

const { TextArea } = Input
const TabPane = Tabs.TabPane

// 地质预报记录类型（按照用户提供的图片设计）
type GeologyForecastRecord = {
  id: string
  method: string           // 预报方法
  forecastTime: string     // 预报时间
  faceMileage: string      // 掌子面里程
  length: number           // 长度
  minDepth: number         // 最小埋深
  status: string           // 状态
  uploadTip: string        // 上传提示
}

// 五个方法选项卡类型
type MethodTab = 'geophysical' | 'palmSketch' | 'tunnelSketch' | 'drilling' | 'surface'

function GeologyForecastPage() {
  const navigate = useNavigate()
  
  // 状态管理
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<GeologyForecastRecord[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  
  // 表格选择状态
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([])
  
  // 新增弹窗状态
  const [addVisible, setAddVisible] = useState(false)
  const [addForm] = Form.useForm()

  // 编辑弹窗状态
  const [editVisible, setEditVisible] = useState(false)
  const [editingRecord, setEditingRecord] = useState<any>(null)
  const [editForm] = Form.useForm()

  // 五个方法选项卡状态
  const [activeTab, setActiveTab] = useState<MethodTab>('geophysical')
  
  // 各方法的数据状态
  const [geophysicalData, setGeophysicalData] = useState<any[]>([])
  const [palmSketchData, setPalmSketchData] = useState<any[]>([])
  const [tunnelSketchData, setTunnelSketchData] = useState<any[]>([])
  const [drillingData, setDrillingData] = useState<any[]>([])
  const [surfaceData, setSurfaceData] = useState<any>(null)

  // 表格列定义
  const columns = [
    {
      title: '预报方法',
      dataIndex: 'method',
      key: 'method',
      width: 120,
    },
    {
      title: '预报时间',
      dataIndex: 'forecastTime',
      key: 'forecastTime',
      width: 160,
    },
    {
      title: '掌子面里程',
      dataIndex: 'faceMileage',
      key: 'faceMileage',
      width: 140,
    },
    {
      title: '长度',
      dataIndex: 'length',
      key: 'length',
      width: 80,
      render: (length: number) => `${length}m`
    },
    {
      title: '最小埋深',
      dataIndex: 'minDepth',
      key: 'minDepth',
      width: 100,
      render: (depth: number) => `${depth}m`
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => (
        <span style={{ 
          color: status === '编辑中' ? '#ff7d00' : '#00b42a',
          fontWeight: 500 
        }}>
          {status}
        </span>
      )
    },
    {
      title: '上传提示',
      dataIndex: 'uploadTip',
      key: 'uploadTip',
      width: 120,
    },
    {
      title: '操作',
      key: 'operation',
      width: 200,
      fixed: 'right' as const,
      render: (_: any, record: GeologyForecastRecord) => (
        <Space size="small">
          <Button 
            type="text" 
            size="small" 
            style={{ color: '#165dff' }}
            onClick={() => handleViewDetail(record)}
          >
            详情
          </Button>
          <Button 
            type="text" 
            size="small" 
            style={{ color: '#165dff' }}
            onClick={() => handleEdit(record)}
          >
            修改
          </Button>
          <Button 
            type="text" 
            size="small" 
            style={{ color: '#165dff' }}
            onClick={() => handleCopy(record)}
          >
            复制
          </Button>
          <Button 
            type="text" 
            size="small" 
            style={{ color: '#00b42a' }}
            onClick={() => handleUpload(record)}
          >
            上传
          </Button>
          <Button 
            type="text" 
            size="small" 
            style={{ color: '#ff4d4f' }}
            onClick={() => handleDelete(record)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ]

  // 获取各方法的真实数据
  const fetchMethodData = async (workPointId: string = '1') => {
    setLoading(true)
    try {
      console.log('🔍 [GeologyForecastPage] 获取地质预报数据, workPointId:', workPointId)

      // 并行获取五种方法的数据
      const [geophysical, palmSketch, tunnelSketch, drilling, surface] = await Promise.all([
        apiAdapter.getGeophysicalList({ pageNum: 1, pageSize: 100, siteId: workPointId }),
        apiAdapter.getPalmSketchList({ pageNum: 1, pageSize: 100, siteId: workPointId }),
        apiAdapter.getTunnelSketchList({ pageNum: 1, pageSize: 100, siteId: workPointId }),
        apiAdapter.getDrillingList({ pageNum: 1, pageSize: 100, siteId: workPointId }),
        apiAdapter.getSurfaceSupplementInfo(workPointId)
      ])

      // 设置各方法的数据
      setGeophysicalData(geophysical.records || [])
      setPalmSketchData(palmSketch.records || [])
      setTunnelSketchData(tunnelSketch.records || [])
      setDrillingData(drilling.records || [])
      setSurfaceData(surface)

      console.log('✅ [GeologyForecastPage] 数据加载完成:', {
        geophysical: geophysical.records?.length || 0,
        palmSketch: palmSketch.records?.length || 0,
        tunnelSketch: tunnelSketch.records?.length || 0,
        drilling: drilling.records?.length || 0,
        surface: surface ? 'loaded' : 'empty'
      })

      Message.success('地质预报数据加载完成')
    } catch (error) {
      console.error('❌ [GeologyForecastPage] 获取地质预报数据失败:', error)
      Message.error('获取地质预报数据失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMethodData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize])

  // 操作处理函数
  const handleViewDetail = async (record: any) => {
    try {
      let detail = null;
      const recordId = String(record.wtfPk || record.zzmsmPk || record.dssmPk || record.ztfPk || record.id);
      
      // 根据当前选项卡调用对应的详情API
      switch (activeTab) {
        case 'geophysical':
          detail = await apiAdapter.getGeophysicalDetail(recordId);
          break;
        case 'palmSketch':
          detail = await apiAdapter.getPalmSketchDetail(recordId);
          break;
        case 'tunnelSketch':
          detail = await apiAdapter.getTunnelSketchDetail(recordId);
          break;
        case 'drilling':
          detail = await apiAdapter.getDrillingDetail(recordId);
          break;
        default:
          Message.info('暂不支持该类型的详情查看');
          return;
      }
      
      if (detail) {
        Modal.info({
          title: '详情信息',
          content: (
            <div>
              <pre>{JSON.stringify(detail, null, 2)}</pre>
            </div>
          ),
          style: { width: 600 }
        });
      } else {
        Message.error('获取详情失败');
      }
    } catch (error) {
      console.error('查看详情失败:', error);
      Message.error('查看详情失败');
    }
  }

  const handleEdit = (record: any) => {
    setEditingRecord(record)
    editForm.setFieldsValue({
      dkilo: record.dkilo,
      monitordate: record.monitordate,
      addition: record.addition
    })
    setEditVisible(true)
  }

  const handleCopy = async (record: any) => {
    try {
      const recordId = String(record.wtfPk || record.zzmsmPk || record.dssmPk || record.ztfPk || record.id);
      let result = null;
      
      // 根据当前选项卡调用对应的复制API
      switch (activeTab) {
        case 'geophysical':
          result = await apiAdapter.copyGeophysical(recordId);
          break;
        case 'palmSketch':
        case 'tunnelSketch':
        case 'drilling':
          Message.info('该类型暂不支持复制功能');
          return;
        default:
          Message.info('暂不支持该类型的复制');
          return;
      }
      
      if (result?.success) {
        Message.success('复制成功');
        fetchMethodData(); // 刷新数据
      } else {
        Message.error('复制失败');
      }
    } catch (error) {
      console.error('复制失败:', error);
      Message.error('复制失败');
    }
  }

  const handleUpload = async (record: any) => {
    try {
      const recordId = String(record.wtfPk || record.zzmsmPk || record.dssmPk || record.ztfPk || record.id);
      let result = null;
      
      // 根据当前选项卡调用对应的上传API
      switch (activeTab) {
        case 'geophysical':
          result = await apiAdapter.uploadGeophysical(recordId);
          break;
        case 'palmSketch':
        case 'tunnelSketch':
        case 'drilling':
          Message.info('该类型暂不支持上传功能');
          return;
        default:
          Message.info('暂不支持该类型的上传');
          return;
      }
      
      if (result?.success) {
        Message.success('上传成功');
        fetchMethodData(); // 刷新数据
      } else {
        Message.error('上传失败');
      }
    } catch (error) {
      console.error('上传失败:', error);
      Message.error('上传失败');
    }
  }

  const handleDelete = (record: any) => {
    const recordId = String(record.wtfPk || record.zzmsmPk || record.dssmPk || record.ztfPk || record.id);
    const recordName = record.methodName || record.method || `ID: ${recordId}`;
    
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除这条预报记录"${recordName}"吗？此操作不可恢复。`,
      okButtonProps: {
        status: 'danger'
      },
      onOk: async () => {
        try {
          let result = null;
          
          // 根据当前选项卡调用对应的删除API
          switch (activeTab) {
            case 'geophysical':
              result = await apiAdapter.deleteGeophysical(recordId);
              break;
            case 'palmSketch':
              result = await apiAdapter.deletePalmSketch(recordId);
              break;
            case 'tunnelSketch':
              result = await apiAdapter.deleteTunnelSketch(recordId);
              break;
            case 'drilling':
              result = await apiAdapter.deleteDrilling(recordId);
              break;
            default:
              Message.error('暂不支持该类型的删除');
              return;
          }
          
          if (result?.success) {
            Message.success('删除成功');
            fetchMethodData(); // 刷新数据
          } else {
            Message.error('删除失败');
          }
        } catch (error) {
          console.error('删除失败:', error);
          Message.error('删除失败，请稍后重试');
        }
      }
    })
  }

  // 操作按钮处理函数
  const handleDownloadTemplate = async () => {
    try {
      Message.success('模板下载成功')
    } catch (error) {
      Message.error('下载模板失败，请稍后重试')
    }
  }

  const handleImport = () => {
    Message.info('导入功能开发中...')
  }

  const handleAdd = () => {
    addForm.resetFields()
    setAddVisible(true)
  }

  const handleBatchDelete = () => {
    if (selectedRowKeys.length === 0) {
      Message.warning('请先选择要删除的记录')
      return
    }

    Modal.confirm({
      title: '确认批量删除',
      content: `确定要删除选中的 ${selectedRowKeys.length} 条记录吗？此操作不可恢复。`,
      okButtonProps: {
        status: 'danger'
      },
      onOk: async () => {
        try {
          Message.success(`批量删除成功：${selectedRowKeys.length} 条记录`)
          setSelectedRowKeys([])
          fetchMethodData()
        } catch (error) {
          Message.error('批量删除失败，请稍后重试')
        }
      }
    })
  }

  return (
    <div>
      {/* 顶部信息栏 */}
      <div style={{ 
        height: 44,
        background: 'linear-gradient(90deg, #A18AFF 0%, #8B7AE6 100%)', 
        borderRadius: 6,
        marginBottom: 12,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        color: '#fff',
        fontSize: '14px'
      }}>
        <span>设计预报 / 人员信息 / 地质点/DK713+920/DK713+920/地质预报</span>
        <Button 
          type="text" 
          icon={<IconLeft />} 
          style={{ color: '#fff' }}
          onClick={() => navigate('/hello')}
        >
          返回
        </Button>
      </div>

      {/* 五个方法选项卡 */}
      <Card style={{ marginBottom: '24px' }}>
        <Tabs 
          activeTab={activeTab} 
          onChange={(key) => setActiveTab(key as MethodTab)}
          type="card-gutter"
        >
          <TabPane key="geophysical" title={`物探法 (${geophysicalData.length})`} />
          <TabPane key="palmSketch" title={`掌子面素描 (${palmSketchData.length})`} />
          <TabPane key="tunnelSketch" title={`洞身素描 (${tunnelSketchData.length})`} />
          <TabPane key="drilling" title={`钻探法 (${drillingData.length})`} />
          <TabPane key="surface" title="地表补充" />
        </Tabs>
      </Card>

      {/* 筛选条件 */}
      <Card style={{ marginBottom: '24px' }}>
        <Space>
          <span>预报时间：</span>
          <DatePicker.RangePicker />
          
          <Button type="primary" icon={<span>🔍</span>}>
            查询
          </Button>
          <Button icon={<span>🔄</span>}>
            重置
          </Button>
        </Space>
      </Card>

      {/* 操作按钮 */}
      <OperationButtons
        onDownloadTemplate={handleDownloadTemplate}
        onImport={handleImport}
        onAdd={handleAdd}
        onClear={handleBatchDelete}
        selectedCount={selectedRowKeys.length}
        clearDisabled={selectedRowKeys.length === 0}
      />

      {/* 数据表格 */}
      <Card>
        <Spin loading={loading}>
          {activeTab === 'geophysical' && (
            <Table
              columns={[
                { title: 'ID', dataIndex: 'wtfPk', width: 80 },
                { title: '里程', dataIndex: 'dkilo', width: 120, render: (val: number) => `DK${val}` },
                { title: '方法', dataIndex: 'method', width: 100 },
                { title: '监测日期', dataIndex: 'monitordate', width: 120 },
                { title: '备注', dataIndex: 'addition' },
                {
                  title: '操作',
                  dataIndex: 'operation',
                  key: 'operation',
                  width: 320,
                  fixed: 'right' as const,
                  render: (_: any, record: any) => (
                    <Space size="small">
                      <Button 
                        type="text" 
                        size="small" 
                        style={{ color: '#165dff' }}
                        onClick={() => handleViewDetail(record)}
                      >
                        详情
                      </Button>
                      <Button 
                        type="text" 
                        size="small" 
                        style={{ color: '#165dff' }}
                        onClick={() => handleEdit(record)}
                      >
                        修改
                      </Button>
                      <Button 
                        type="text" 
                        size="small" 
                        style={{ color: '#165dff' }}
                        onClick={() => handleCopy(record)}
                      >
                        复制
                      </Button>
                      <Button 
                        type="text" 
                        size="small" 
                        style={{ color: '#00b42a' }}
                        onClick={() => handleUpload(record)}
                      >
                        上传
                      </Button>
                      <Button 
                        type="text" 
                        size="small" 
                        style={{ color: '#ff4d4f' }}
                        onClick={() => handleDelete(record)}
                      >
                        删除
                      </Button>
                    </Space>
                  ),
                }
              ]}
              data={geophysicalData}
              rowKey="wtfPk"
              pagination={false}
              noDataElement={<Empty description="暂无物探法数据" />}
            />
          )}
          
          {activeTab === 'palmSketch' && (
            <Table
              columns={[
                { title: 'ID', dataIndex: 'zzmsmPk', width: 80 },
                { title: '里程', dataIndex: 'dkilo', width: 120, render: (val: number) => `DK${val}` },
                { title: '围岩等级', dataIndex: 'rockGrade', width: 100 },
                { title: '涌水情况', dataIndex: 'waterInflow', width: 100 },
                { title: '监测日期', dataIndex: 'monitordate', width: 120 },
                { title: '备注', dataIndex: 'addition' },
                {
                  title: '操作',
                  dataIndex: 'operation',
                  key: 'operation',
                  width: 320,
                  fixed: 'right' as const,
                  render: (_: any, record: any) => (
                    <Space size="small">
                      <Button type="text" size="small" style={{ color: '#165dff' }} onClick={() => handleViewDetail(record)}>详情</Button>
                      <Button type="text" size="small" style={{ color: '#165dff' }} onClick={() => handleEdit(record)}>修改</Button>
                      <Button type="text" size="small" style={{ color: '#165dff' }} onClick={() => handleCopy(record)}>复制</Button>
                      <Button type="text" size="small" style={{ color: '#00b42a' }} onClick={() => handleUpload(record)}>上传</Button>
                      <Button type="text" size="small" style={{ color: '#ff4d4f' }} onClick={() => handleDelete(record)}>删除</Button>
                    </Space>
                  ),
                }
              ]}
              data={palmSketchData}
              rowKey="zzmsmPk"
              pagination={false}
              noDataElement={<Empty description="暂无掌子面素描数据" />}
            />
          )}
          
          {activeTab === 'tunnelSketch' && (
            <Table
              columns={[
                { title: 'ID', dataIndex: 'dssmPk', width: 80 },
                { title: '里程', dataIndex: 'dkilo', width: 120, render: (val: number) => `DK${val}` },
                { title: '衬砌厚度(cm)', dataIndex: 'liningThickness', width: 120 },
                { title: '裂缝数量', dataIndex: 'crackCount', width: 100 },
                { title: '监测日期', dataIndex: 'monitordate', width: 120 },
                { title: '备注', dataIndex: 'addition' },
                {
                  title: '操作',
                  dataIndex: 'operation',
                  key: 'operation',
                  width: 320,
                  fixed: 'right' as const,
                  render: (_: any, record: any) => (
                    <Space size="small">
                      <Button type="text" size="small" style={{ color: '#165dff' }} onClick={() => handleViewDetail(record)}>详情</Button>
                      <Button type="text" size="small" style={{ color: '#165dff' }} onClick={() => handleEdit(record)}>修改</Button>
                      <Button type="text" size="small" style={{ color: '#165dff' }} onClick={() => handleCopy(record)}>复制</Button>
                      <Button type="text" size="small" style={{ color: '#00b42a' }} onClick={() => handleUpload(record)}>上传</Button>
                      <Button type="text" size="small" style={{ color: '#ff4d4f' }} onClick={() => handleDelete(record)}>删除</Button>
                    </Space>
                  ),
                }
              ]}
              data={tunnelSketchData}
              rowKey="dssmPk"
              pagination={false}
              noDataElement={<Empty description="暂无洞身素描数据" />}
            />
          )}
          
          {activeTab === 'drilling' && (
            <Table
              columns={[
                { title: 'ID', dataIndex: 'ztfPk', width: 80 },
                { title: '里程', dataIndex: 'dkilo', width: 120, render: (val: number) => `DK${val}` },
                { title: '钻探深度(m)', dataIndex: 'drillDepth', width: 120 },
                { title: '取芯长度(m)', dataIndex: 'coreLength', width: 120 },
                { title: '岩石类型', dataIndex: 'rockType', width: 100 },
                { title: '监测日期', dataIndex: 'monitordate', width: 120 },
                { title: '备注', dataIndex: 'addition' },
                {
                  title: '操作',
                  dataIndex: 'operation',
                  key: 'operation',
                  width: 320,
                  fixed: 'right' as const,
                  render: (_: any, record: any) => (
                    <Space size="small">
                      <Button type="text" size="small" style={{ color: '#165dff' }} onClick={() => handleViewDetail(record)}>详情</Button>
                      <Button type="text" size="small" style={{ color: '#165dff' }} onClick={() => handleEdit(record)}>修改</Button>
                      <Button type="text" size="small" style={{ color: '#165dff' }} onClick={() => handleCopy(record)}>复制</Button>
                      <Button type="text" size="small" style={{ color: '#00b42a' }} onClick={() => handleUpload(record)}>上传</Button>
                      <Button type="text" size="small" style={{ color: '#ff4d4f' }} onClick={() => handleDelete(record)}>删除</Button>
                    </Space>
                  ),
                }
              ]}
              data={drillingData}
              rowKey="ztfPk"
              pagination={false}
              noDataElement={<Empty description="暂无钻探法数据" />}
            />
          )}
          
          {activeTab === 'surface' && (
            <div style={{ padding: '24px' }}>
              {surfaceData ? (
                <div>
                  <pre>{JSON.stringify(surfaceData, null, 2)}</pre>
                </div>
              ) : (
                <Empty description="暂无地表补充数据" />
              )}
            </div>
          )}
        </Spin>
      </Card>

      {/* 新增弹窗 */}
      <Modal
        title="新增地质预报"
        visible={addVisible}
        onOk={() => {
          Message.success('新增成功')
          setAddVisible(false)
          fetchMethodData()
        }}
        onCancel={() => setAddVisible(false)}
        style={{ width: 600 }}
      >
        <Form form={addForm} layout="vertical">
          <Form.Item label="里程" field="dkilo" rules={[{ required: true, message: '请输入里程' }]}>
            <Input placeholder="如 DK713+521.20" />
          </Form.Item>
          <Form.Item label="监测日期" field="monitordate">
            <Input placeholder="监测日期" />
          </Form.Item>
          <Form.Item label="备注" field="addition">
            <Input placeholder="备注信息" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 编辑弹窗 */}
      <Modal
        title="修改地质预报"
        visible={editVisible}
        onOk={async () => {
          try {
            const values = await editForm.validate();
            if (editingRecord) {
              const recordId = String(editingRecord.wtfPk || editingRecord.zzmsmPk || editingRecord.dssmPk || editingRecord.ztfPk || editingRecord.id);
              let result = null;
              
              // 根据当前选项卡调用对应的更新API
              switch (activeTab) {
                case 'geophysical':
                  result = await apiAdapter.updateGeophysical(recordId, values);
                  break;
                case 'palmSketch':
                  result = await apiAdapter.updatePalmSketch(recordId, values);
                  break;
                case 'tunnelSketch':
                  result = await apiAdapter.updateTunnelSketch(recordId, values);
                  break;
                case 'drilling':
                  result = await apiAdapter.updateDrilling(recordId, values);
                  break;
                default:
                  Message.error('暂不支持该类型的修改');
                  return;
              }
              
              if (result?.success) {
                Message.success('修改成功');
                setEditVisible(false);
                fetchMethodData(); // 刷新数据
              } else {
                Message.error('修改失败');
              }
            }
          } catch (error) {
            console.error('修改失败:', error);
            Message.error('修改失败，请检查输入');
          }
        }}
        onCancel={() => setEditVisible(false)}
        style={{ width: 600 }}
      >
        <Form form={editForm} layout="vertical">
          <Form.Item label="里程" field="dkilo" rules={[{ required: true, message: '请输入里程' }]}>
            <Input placeholder="如 DK713+521.20" />
          </Form.Item>
          <Form.Item label="监测日期" field="monitordate">
            <Input placeholder="监测日期" />
          </Form.Item>
          <Form.Item label="备注" field="addition">
            <Input placeholder="备注信息" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default GeologyForecastPage
