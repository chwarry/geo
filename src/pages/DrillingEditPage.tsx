import { useState, useEffect } from 'react'
import { useNavigate, useParams, useSearchParams, useLocation } from 'react-router-dom'
import {
  Form,
  Input,
  InputNumber,
  DatePicker,
  Select,
  Button,
  Message,
  Tabs,
  Grid,
  Spin,
  Space,
  Table,
  Modal,
  Upload
} from '@arco-design/web-react'
import { IconLeft, IconSave, IconPlus } from '@arco-design/web-react/icon'
import apiAdapter from '../services/apiAdapter'

const { TextArea } = Input
const TabPane = Tabs.TabPane
const { Row, Col } = Grid

function DrillingEditPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [searchParams] = useSearchParams()
  const location = useLocation()
  
  const method = searchParams.get('method')
  const siteId = searchParams.get('siteId')
  
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('basic')
  const [originalData, setOriginalData] = useState<any>(null) // 保存原始数据
  
  // 钻孔数据列表
  const [zkList, setZkList] = useState<any[]>([])
  const [zkModalVisible, setZkModalVisible] = useState(false)
  const [currentZk, setCurrentZk] = useState<any>(null)
  const [zkForm] = Form.useForm()

  // 下冲断层数据预报列表
  const [forecastList, setForecastList] = useState<any[]>([])
  const [forecastModalVisible, setForecastModalVisible] = useState(false)
  const [currentForecast, setCurrentForecast] = useState<any>(null)
  const [forecastForm] = Form.useForm()

  // 获取详情数据
  useEffect(() => {
    const fetchDetail = async () => {
      if (!id) return
      
      setLoading(true)
      try {
        // 尝试从路由状态获取
        if (location.state?.record) {
          const data = location.state.record
          form.setFieldsValue(data)
          
          // 设置钻孔列表
          const isJspk = method === '14'
          const zkData = isJspk ? data.jspkZkzzVOList : data.cqspzZkzzVOList
          if (zkData) {
            setZkList(zkData)
          }
          
          // 设置分段信息列表（预报结果）
          if (data.ybjgVOList) {
            setForecastList(data.ybjgVOList)
            console.log('📊 [编辑页] 从路由状态加载分段信息:', data.ybjgVOList)
          }
        }
        
        // 调用详情接口
        const detail = await apiAdapter.getDrillingDetail(id, method)
        if (detail) {
          form.setFieldsValue(detail)
          setOriginalData(detail) // 保存原始数据
          
          // 设置钻孔列表
          const isJspk = method === '14'
          const zkData = isJspk ? detail.jspkZkzzVOList : detail.cqspzZkzzVOList
          if (zkData) {
            setZkList(zkData)
          }
          
          // 设置分段信息列表（预报结果）
          if (detail.ybjgVOList) {
            setForecastList(detail.ybjgVOList)
            console.log('📊 [编辑页] 从API加载分段信息:', detail.ybjgVOList)
          }
        }
      } catch (error) {
        console.error('❌ 获取详情失败:', error)
        Message.error('获取详情数据失败')
      } finally {
        setLoading(false)
      }
    }
    
    fetchDetail()
  }, [id, method, location.state, form])

  const handleBack = () => {
    if (siteId) {
      navigate(`/forecast/geology/${siteId}`)
    } else {
      navigate(-1)
    }
  }

  const handleSave = async () => {
    try {
      await form.validate()
      const values = form.getFieldsValue()
      
      setSaving(true)
      
      // 合并原始数据和表单修改的数据，确保未修改的字段保留原值
      const submitData = {
        ...originalData,  // 先用原始数据
        ...values,        // 再用表单值覆盖（用户修改的部分）
        ybPk: id,
        siteId: siteId || originalData?.siteId,
        zkList
      }
      
      console.log('📤 [钻探法] 提交数据:', submitData)
      
      // 调用更新接口
      const result = await apiAdapter.updateDrilling(id!, submitData)
      
      if (result?.success) {
        Message.success('保存成功')
        handleBack()
      } else {
        Message.error('保存失败')
      }
    } catch (error) {
      console.error('❌ 保存失败:', error)
      Message.error('保存失败，请检查表单')
    } finally {
      setSaving(false)
    }
  }

  // 添加/编辑钻孔
  const handleAddZk = () => {
    setCurrentZk(null)
    zkForm.resetFields()
    setZkModalVisible(true)
  }

  const handleEditZk = (record: any, index: number) => {
    setCurrentZk({ ...record, index })
    zkForm.setFieldsValue(record)
    setZkModalVisible(true)
  }

  const handleDeleteZk = (index: number) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这条钻孔数据吗？',
      onOk: () => {
        const newList = [...zkList]
        newList.splice(index, 1)
        setZkList(newList)
        Message.success('删除成功')
      }
    })
  }

  const handleZkModalOk = async () => {
    try {
      await zkForm.validate()
      const values = zkForm.getFieldsValue()
      
      if (currentZk && currentZk.index !== undefined) {
        // 编辑
        const newList = [...zkList]
        newList[currentZk.index] = values
        setZkList(newList)
      } else {
        // 新增
        setZkList([...zkList, values])
      }
      
      setZkModalVisible(false)
      Message.success(currentZk ? '修改成功' : '添加成功')
    } catch (error) {
      console.error('表单验证失败:', error)
    }
  }

  // 添加/编辑预报数据
  const handleAddForecast = () => {
    setCurrentForecast(null)
    forecastForm.resetFields()
    setForecastModalVisible(true)
  }

  const handleEditForecast = (record: any, index: number) => {
    setCurrentForecast({ ...record, index })
    forecastForm.setFieldsValue(record)
    setForecastModalVisible(true)
  }

  const handleDeleteForecast = (index: number) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这条预报数据吗？',
      onOk: () => {
        const newList = [...forecastList]
        newList.splice(index, 1)
        setForecastList(newList)
        Message.success('删除成功')
      }
    })
  }

  const handleForecastModalOk = async () => {
    try {
      await forecastForm.validate()
      const values = forecastForm.getFieldsValue()
      
      if (currentForecast && currentForecast.index !== undefined) {
        // 编辑
        const newList = [...forecastList]
        newList[currentForecast.index] = values
        setForecastList(newList)
      } else {
        // 新增
        setForecastList([...forecastList, values])
      }
      
      setForecastModalVisible(false)
      Message.success(currentForecast ? '修改成功' : '添加成功')
    } catch (error) {
      console.error('表单验证失败:', error)
    }
  }

  // 钻孔数据表格列
  const isJspk = method === '14'
  const zkColumns = isJspk ? [
    { title: '编号', dataIndex: 'index', width: 80, render: (_: any, __: any, index: number) => index + 1 },
    { title: '钻孔位置', dataIndex: 'zkwz', width: 150 },
    { title: '外插角', dataIndex: 'wcj', width: 100 },
    { title: '钻孔长度', dataIndex: 'zkcd', width: 100 },
    { title: '钻探情况及预报地质描述', dataIndex: 'dzqkjs', ellipsis: true },
    {
      title: '操作',
      width: 150,
      render: (_: any, __: any, index: number) => (
        <Space>
          <Button size="small" type="text" onClick={() => handleEditZk(zkList[index], index)}>编辑</Button>
          <Button size="small" type="text" status="danger" onClick={() => handleDeleteZk(index)}>删除</Button>
        </Space>
      )
    }
  ] : [
    { title: '编号', dataIndex: 'index', width: 80, render: (_: any, __: any, index: number) => index + 1 },
    { title: '钻孔位置', dataIndex: 'kwbh', width: 150 },
    { title: '外插角', dataIndex: 'kwpjangle', width: 100 },
    { title: '钻孔长度', dataIndex: 'jgdjl', width: 100 },
    { title: '钻探情况及预报地质描述', dataIndex: 'zjcode', ellipsis: true },
    {
      title: '操作',
      width: 150,
      render: (_: any, __: any, index: number) => (
        <Space>
          <Button size="small" type="text" onClick={() => handleEditZk(zkList[index], index)}>编辑</Button>
          <Button size="small" type="text" status="danger" onClick={() => handleDeleteZk(index)}>删除</Button>
        </Space>
      )
    }
  ]

  const methodName = method === '14' ? '加深炮孔' : method === '13' ? '超前水平钻' : '钻探法'

  // 围岩等级映射
  const rockGradeMap = ['Ⅰ', 'Ⅱ', 'Ⅲ', 'Ⅳ', 'Ⅴ', 'Ⅵ']
  
  // 风险类别映射（数字转中文）
  const riskLevelMap: Record<string, string> = {
    '1': '低风险',
    '2': '中风险',
    '3': '高风险',
    '4': '极高风险'
  }
  
  // 风险类别颜色映射
  const riskColorMap: Record<string, string> = {
    '低风险': '#00b42a',
    '中风险': '#ff7d00',
    '高风险': '#f53f3f',
    '极高风险': '#d91ad9'
  }

  // 预报数据表格列（分段信息）
  const forecastColumns = [
    { title: '序号', dataIndex: 'index', width: 80, render: (_: any, __: any, index: number) => index + 1 },
    { title: '里程起点', dataIndex: 'dkname', width: 100 },
    { title: '开始里程值', dataIndex: 'sdkilo', width: 110 },
    { title: '位置里程值', dataIndex: 'edkilo', width: 110 },
    { 
      title: '当前位置日期上传', 
      dataIndex: 'ybjgTime', 
      width: 160,
      render: (time: string) => time ? time.replace('T', ' ').substring(0, 16) : '-'
    },
    { 
      title: '风险类别', 
      dataIndex: 'risklevel', 
      width: 100,
      align: 'center' as const,
      render: (val: string) => {
        const riskText = riskLevelMap[val] || val || '-'
        const color = riskColorMap[riskText] || '#1d2129'
        return (
          <span style={{ color, fontWeight: 500 }}>
            {riskText}
          </span>
        )
      }
    },
    { 
      title: '围岩等级', 
      dataIndex: 'wylevel', 
      width: 110,
      render: (val: number, record: any) => {
        if (val) {
          const grade = rockGradeMap[val - 1] || val
          const subGrade = record.grade ? `-${record.grade}` : ''
          return `围岩${grade}${subGrade}`
        }
        return '-'
      }
    },
    { title: '结论', dataIndex: 'jlresult', ellipsis: true, width: 200 },
    {
      title: '操作',
      width: 150,
      render: (_: any, __: any, index: number) => (
        <Space>
          <Button size="small" type="text" onClick={() => handleEditForecast(forecastList[index], index)}>编辑</Button>
          <Button size="small" type="text" status="danger" onClick={() => handleDeleteForecast(index)}>删除</Button>
        </Space>
      )
    }
  ]

  return (
    <div style={{ padding: '20px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      {/* 顶部信息栏 */}
      <div style={{ 
        height: 48,
        background: '#E6E8EB',
        borderRadius: '4px 4px 0 0',
        marginBottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        color: '#1D2129',
        fontSize: '14px',
        fontWeight: 500,
        borderBottom: '1px solid #C9CDD4'
      }}>
        <span>{methodName}编辑</span>
        <Button 
          type="text" 
          icon={<IconLeft style={{ fontSize: 18 }} />} 
          style={{ color: '#1D2129' }}
          onClick={handleBack}
        />
      </div>

      <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '0 0 4px 4px' }}>
        <Spin loading={loading} style={{ width: '100%' }}>
          <Tabs activeTab={activeTab} onChange={setActiveTab} type="card">
            {/* 基本信息 Tab */}
            <TabPane key="basic" title="基本信息及其他信息">
              <Form form={form} layout="vertical" style={{ marginTop: 20 }}>
                <div style={{ 
                  textAlign: 'center', 
                  fontSize: 16, 
                  fontWeight: 600, 
                  marginBottom: 24,
                  padding: '12px 0',
                  backgroundColor: '#f7f8fa',
                  borderRadius: 4
                }}>
                  基本信息
                </div>
                
                <Row gutter={24}>
                  <Col span={8}>
                    <Form.Item label="所属工点" field="siteId">
                      <Input placeholder="请输入所属工点" disabled />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="预报时间" field="monitordate">
                      <DatePicker showTime style={{ width: '100%' }} />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={24}>
                  <Col span={8}>
                    <Form.Item label="里程名称" field="dkname">
                      <Input placeholder="请输入里程名称" />
                    </Form.Item>
                  </Col>
                  <Col span={4}>
                    <Form.Item label="掌子面里程" field="dkilo">
                      <InputNumber placeholder="里程" style={{ width: '100%' }} />
                    </Form.Item>
                  </Col>
                  <Col span={4}>
                    <Form.Item label="+" field="dkiloPlus">
                      <InputNumber placeholder="490.8" style={{ width: '100%' }} />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="预报长度" field="ybLength">
                      <InputNumber placeholder="8.00" style={{ width: '100%' }} />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={24}>
                  <Col span={8}>
                    <Form.Item label="检测人" field="testname">
                      <Input placeholder="李泽龙" />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="检测人证件号" field="testno">
                      <Input placeholder="439006198708137856" />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="检测人电话" field="testtel">
                      <Input placeholder="18969655996" />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={24}>
                  <Col span={8}>
                    <Form.Item label="复核人" field="monitorname">
                      <Input placeholder="罗远德" />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="复核人证件号" field="monitorno">
                      <Input placeholder="640324198717182618" />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="复核人电话" field="monitortel">
                      <Input placeholder="18587382416" />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={24}>
                  <Col span={8}>
                    <Form.Item label="监理工程师" field="supervisorname">
                      <Input placeholder="叶明" />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="监理单位证" field="supervisorno">
                      <Input placeholder="512313198701113168" />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="监理电话" field="supervisortel">
                      <Input placeholder="13577828700" />
                    </Form.Item>
                  </Col>
                </Row>

                <div style={{ 
                  textAlign: 'center', 
                  fontSize: 16, 
                  fontWeight: 600, 
                  margin: '32px 0 24px',
                  padding: '12px 0',
                  backgroundColor: '#f7f8fa',
                  borderRadius: 4
                }}>
                  详细描述
                </div>

                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item label="预报综合结论" field="conclusionyb">
                      <TextArea 
                        placeholder="请输入预报综合结论" 
                        maxLength={512}
                        showWordLimit
                        style={{ minHeight: 120 }}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="后续建议" field="suggestion">
                      <TextArea 
                        placeholder="请输入后续建议" 
                        maxLength={512}
                        showWordLimit
                        style={{ minHeight: 120 }}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item label="采取安全措施" field="solution">
                      <TextArea 
                        placeholder="请输入采取安全措施" 
                        maxLength={512}
                        showWordLimit
                        style={{ minHeight: 120 }}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="备注" field="remark">
                      <TextArea 
                        placeholder="无" 
                        maxLength={512}
                        showWordLimit
                        style={{ minHeight: 120 }}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </TabPane>

            {/* 分段信息及下次超前地质预报 Tab */}
            <TabPane key="forecast" title="分段信息及下次超前地质预报">
              <div style={{ marginTop: 20 }}>
                <div style={{ marginBottom: 16 }}>
                  <Button type="primary" icon={<IconPlus />} onClick={handleAddForecast}>
                    添加
                  </Button>
                </div>
                
                <Table
                  columns={forecastColumns}
                  data={forecastList.map((item, idx) => ({ ...item, _index: idx }))}
                  rowKey={(record: any) => `forecast-${record._index}`}
                  pagination={{ pageSize: 10 }}
                  border
                />

                {/* 底部搜索过滤区域 */}
                <div style={{ 
                  marginTop: 24, 
                  padding: '16px 20px', 
                  backgroundColor: '#f7f8fa', 
                  borderRadius: 4,
                  border: '1px solid #e5e6eb'
                }}>
                  <div style={{ 
                    fontSize: 14, 
                    fontWeight: 600, 
                    marginBottom: 16,
                    color: '#1d2129'
                  }}>
                    下冲断层数据预报
                  </div>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item label="干冲断层方法" style={{ marginBottom: 0 }}>
                        <Select placeholder="请选择" style={{ width: '100%' }}>
                          <Select.Option value="method1">方法1</Select.Option>
                          <Select.Option value="method2">方法2</Select.Option>
                          <Select.Option value="method3">方法3</Select.Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="预报时间日期" style={{ marginBottom: 0 }}>
                        <DatePicker style={{ width: '100%' }} />
                      </Form.Item>
                    </Col>
                  </Row>
                </div>
              </div>
            </TabPane>

            {/* 钻孔信息 Tab */}
            <TabPane key="drilling" title="钻孔信息">
              <div style={{ marginTop: 20 }}>
                <div style={{ marginBottom: 16 }}>
                  <Button type="primary" icon={<IconPlus />} onClick={handleAddZk}>
                    添加钻孔
                  </Button>
                </div>
                
                <Table
                  columns={zkColumns}
                  data={zkList.map((item, idx) => ({ ...item, _index: idx }))}
                  rowKey={(record: any) => `zk-${record._index}`}
                  pagination={false}
                  border
                />
              </div>
            </TabPane>

            {/* 附件及图片上传 Tab */}
            <TabPane key="upload" title="附件及图片上传">
              <div style={{ marginTop: 20 }}>
                <div style={{ 
                  fontSize: 16, 
                  fontWeight: 600, 
                  marginBottom: 24,
                  padding: '12px 0',
                  textAlign: 'center',
                  backgroundColor: '#f7f8fa',
                  borderRadius: 4
                }}>
                  附件及图片管理
                </div>

                <Row gutter={24}>
                  {/* 附件（word/pdf） */}
                  <Col span={8}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ marginBottom: 12, fontWeight: 500 }}>附件（word/pdf）</div>
                      <Upload
                        action="/api/v1/ztf/jspk/upload"
                        accept=".doc,.docx,.pdf"
                        listType="picture-card"
                        limit={1}
                        onChange={(fileList) => {
                          console.log('附件上传:', fileList)
                        }}
                      >
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: 20, color: '#86909c' }}>+</div>
                          <div style={{ fontSize: 12, color: '#86909c', marginTop: 8 }}>上传附件</div>
                        </div>
                      </Upload>
                      <Button size="small" style={{ marginTop: 8 }}>修改</Button>
                    </div>
                  </Col>

                  {/* 钻进现场图片 */}
                  <Col span={8}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ marginBottom: 12, fontWeight: 500 }}>钻进现场图片</div>
                      <Upload
                        action="/api/v1/ztf/jspk/upload"
                        accept="image/*"
                        listType="picture-card"
                        limit={1}
                        onChange={(fileList) => {
                          console.log('钻进现场图片上传:', fileList)
                        }}
                      >
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: 20, color: '#86909c' }}>+</div>
                          <div style={{ fontSize: 12, color: '#86909c', marginTop: 8 }}>上传图片</div>
                        </div>
                      </Upload>
                      <Button size="small" style={{ marginTop: 8 }}>修改</Button>
                    </div>
                  </Col>

                  {/* 综合内容图片 */}
                  <Col span={8}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ marginBottom: 12, fontWeight: 500 }}>综合内容图片</div>
                      <Upload
                        action="/api/v1/ztf/jspk/upload"
                        accept="image/*"
                        listType="picture-card"
                        limit={1}
                        onChange={(fileList) => {
                          console.log('综合内容图片上传:', fileList)
                        }}
                      >
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: 20, color: '#86909c' }}>+</div>
                          <div style={{ fontSize: 12, color: '#86909c', marginTop: 8 }}>上传图片</div>
                        </div>
                      </Upload>
                      <Button size="small" style={{ marginTop: 8 }}>修改</Button>
                    </div>
                  </Col>
                </Row>

                {/* 底部按钮 */}
                <div style={{ marginTop: 40, textAlign: 'right' }}>
                  <Space>
                    <Button>上传</Button>
                    <Button type="primary">提交</Button>
                  </Space>
                </div>
              </div>
            </TabPane>
          </Tabs>

          {/* 底部按钮 */}
          <div style={{ marginTop: 24, textAlign: 'right' }}>
            <Space>
              <Button onClick={handleBack}>取消</Button>
              <Button type="primary" icon={<IconSave />} loading={saving} onClick={handleSave}>
                保存
              </Button>
            </Space>
          </div>
        </Spin>
      </div>

      {/* 钻孔编辑弹窗 */}
      <Modal
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingRight: 40 }}>
            <span>超前地质预报</span>
            <Space>
              <Button size="small">切换</Button>
              <Button size="small">批量管理</Button>
            </Space>
          </div>
        }
        visible={zkModalVisible}
        onOk={handleZkModalOk}
        onCancel={() => setZkModalVisible(false)}
        style={{ width: 700 }}
        okText="确认"
        cancelText="取消"
      >
        <Form form={zkForm} layout="vertical">
          {isJspk ? (
            <>
              <Form.Item label="钻孔位置" field="zkwz" rules={[{ required: true }]}>
                <Space>
                  <Button type={zkForm.getFieldValue('zkwz')?.includes('拱顶') ? 'primary' : 'default'} 
                    onClick={() => {
                      const current = zkForm.getFieldValue('zkwz') || ''
                      const positions = current.split('、').filter(Boolean)
                      if (positions.includes('拱顶')) {
                        zkForm.setFieldValue('zkwz', positions.filter((p: string) => p !== '拱顶').join('、'))
                      } else {
                        zkForm.setFieldValue('zkwz', [...positions, '拱顶'].join('、'))
                      }
                    }}>
                    拱顶
                  </Button>
                  <Button type={zkForm.getFieldValue('zkwz')?.includes('拱腰') ? 'primary' : 'default'}
                    onClick={() => {
                      const current = zkForm.getFieldValue('zkwz') || ''
                      const positions = current.split('、').filter(Boolean)
                      if (positions.includes('拱腰')) {
                        zkForm.setFieldValue('zkwz', positions.filter((p: string) => p !== '拱腰').join('、'))
                      } else {
                        zkForm.setFieldValue('zkwz', [...positions, '拱腰'].join('、'))
                      }
                    }}>
                    拱腰
                  </Button>
                  <Button type={zkForm.getFieldValue('zkwz')?.includes('拱脚') ? 'primary' : 'default'}
                    onClick={() => {
                      const current = zkForm.getFieldValue('zkwz') || ''
                      const positions = current.split('、').filter(Boolean)
                      if (positions.includes('拱脚')) {
                        zkForm.setFieldValue('zkwz', positions.filter((p: string) => p !== '拱脚').join('、'))
                      } else {
                        zkForm.setFieldValue('zkwz', [...positions, '拱脚'].join('、'))
                      }
                    }}>
                    拱脚
                  </Button>
                </Space>
              </Form.Item>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="外插角" field="wcj">
                    <InputNumber 
                      placeholder="请输入外插角" 
                      style={{ width: '100%' }} 
                      precision={1}
                      step={0.1}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="钻孔长度" field="zkcd">
                    <InputNumber 
                      placeholder="请输入钻孔长度" 
                      style={{ width: '100%' }} 
                      precision={2}
                      step={0.01}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item label="钻探情况及预报地质描述" field="dzqkjs">
                <TextArea 
                  placeholder="请输入钻探情况及预报地质描述，如：钻进顺畅一般，无干扰、砂粒、无水。" 
                  maxLength={512}
                  showWordLimit
                  style={{ minHeight: 100 }}
                />
              </Form.Item>
            </>
          ) : (
            <>
              <Form.Item label="钻孔位置" field="kwbh" rules={[{ required: true }]}>
                <Space>
                  <Button type={zkForm.getFieldValue('kwbh')?.includes('拱顶') ? 'primary' : 'default'} 
                    onClick={() => {
                      const current = zkForm.getFieldValue('kwbh') || ''
                      const positions = current.split('、').filter(Boolean)
                      if (positions.includes('拱顶')) {
                        zkForm.setFieldValue('kwbh', positions.filter((p: string) => p !== '拱顶').join('、'))
                      } else {
                        zkForm.setFieldValue('kwbh', [...positions, '拱顶'].join('、'))
                      }
                    }}>
                    拱顶
                  </Button>
                  <Button type={zkForm.getFieldValue('kwbh')?.includes('拱腰') ? 'primary' : 'default'}
                    onClick={() => {
                      const current = zkForm.getFieldValue('kwbh') || ''
                      const positions = current.split('、').filter(Boolean)
                      if (positions.includes('拱腰')) {
                        zkForm.setFieldValue('kwbh', positions.filter((p: string) => p !== '拱腰').join('、'))
                      } else {
                        zkForm.setFieldValue('kwbh', [...positions, '拱腰'].join('、'))
                      }
                    }}>
                    拱腰
                  </Button>
                  <Button type={zkForm.getFieldValue('kwbh')?.includes('拱脚') ? 'primary' : 'default'}
                    onClick={() => {
                      const current = zkForm.getFieldValue('kwbh') || ''
                      const positions = current.split('、').filter(Boolean)
                      if (positions.includes('拱脚')) {
                        zkForm.setFieldValue('kwbh', positions.filter((p: string) => p !== '拱脚').join('、'))
                      } else {
                        zkForm.setFieldValue('kwbh', [...positions, '拱脚'].join('、'))
                      }
                    }}>
                    拱脚
                  </Button>
                </Space>
              </Form.Item>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="外插角" field="kwpjangle">
                    <InputNumber 
                      placeholder="请输入外插角" 
                      style={{ width: '100%' }} 
                      precision={1}
                      step={0.1}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="钻孔长度" field="jgdjl">
                    <InputNumber 
                      placeholder="请输入钻孔长度" 
                      style={{ width: '100%' }} 
                      precision={2}
                      step={0.01}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item label="钻探情况及预报地质描述" field="zjcode">
                <TextArea 
                  placeholder="请输入钻探情况及预报地质描述，如：钻进顺畅一般，无干扰、砂粒、无水。" 
                  maxLength={512}
                  showWordLimit
                  style={{ minHeight: 100 }}
                />
              </Form.Item>
            </>
          )}
        </Form>
      </Modal>

      {/* 预报数据编辑弹窗 */}
      <Modal
        title={currentForecast ? '编辑预报数据' : '添加预报数据'}
        visible={forecastModalVisible}
        onOk={handleForecastModalOk}
        onCancel={() => setForecastModalVisible(false)}
        style={{ width: 700 }}
      >
        <Form form={forecastForm} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="里程起点" field="dkname" rules={[{ required: true }]}>
                <Input placeholder="请输入里程起点，如：DK" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="开始里程值" field="sdkilo" rules={[{ required: true }]}>
                <InputNumber placeholder="请输入开始里程值" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="位置里程值" field="edkilo" rules={[{ required: true }]}>
                <InputNumber placeholder="请输入位置里程值" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="预报时间" field="ybjgTime" rules={[{ required: true }]}>
                <DatePicker showTime style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="风险类别" field="risklevel" rules={[{ required: true }]}>
                <Select placeholder="请选择风险类别" style={{ width: '100%' }}>
                  <Select.Option value="1">低风险</Select.Option>
                  <Select.Option value="2">中风险</Select.Option>
                  <Select.Option value="3">高风险</Select.Option>
                  <Select.Option value="4">极高风险</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="围岩等级" field="wylevel" rules={[{ required: true }]}>
                <Select placeholder="请选择围岩等级" style={{ width: '100%' }}>
                  <Select.Option value={1}>Ⅰ</Select.Option>
                  <Select.Option value={2}>Ⅱ</Select.Option>
                  <Select.Option value={3}>Ⅲ</Select.Option>
                  <Select.Option value={4}>Ⅳ</Select.Option>
                  <Select.Option value={5}>Ⅴ</Select.Option>
                  <Select.Option value={6}>Ⅵ</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="围岩分级" field="grade">
                <InputNumber placeholder="请输入围岩分级，如：0" style={{ width: '100%' }} min={0} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item label="结论" field="jlresult">
                <TextArea 
                  placeholder="请输入结论" 
                  maxLength={512}
                  showWordLimit
                  style={{ minHeight: 100 }}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  )
}

export default DrillingEditPage
