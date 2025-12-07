import React, { useState, useEffect } from 'react'
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
  Upload,
  Table,
  Modal,
  Tag
} from '@arco-design/web-react'
import { IconLeft, IconSave, IconPlus, IconEdit, IconDelete } from '@arco-design/web-react/icon'
import apiAdapter from '../services/apiAdapter'

const { TextArea } = Input
const TabPane = Tabs.TabPane
const { Row, Col } = Grid

function SurfaceSupplementEditPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [searchParams] = useSearchParams()
  const location = useLocation()
  
  const siteId = searchParams.get('siteId')
  
  const [form] = Form.useForm()
  const [segmentForm] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('basic')
  const [segmentList, setSegmentList] = useState<any[]>([])
  const [detailData, setDetailData] = useState<any>(null)
  
  // 分段信息编辑弹窗状态
  const [segmentModalVisible, setSegmentModalVisible] = useState(false)
  const [editingSegment, setEditingSegment] = useState<any>(null)

  // 获取详情数据
  useEffect(() => {
    const fetchDetail = async () => {
      if (!id) return
      
      setLoading(true)
      try {
        if (location.state?.record) {
          const data = location.state.record
          form.setFieldsValue(data)
        }
        
        const detail = await apiAdapter.getSurfaceSupplementInfo(id)
        if (detail) {
          setDetailData(detail)
          form.setFieldsValue(detail)
          console.log('✅ 地表补充详情数据:', detail)
          
          if (detail.ybjgVOList && Array.isArray(detail.ybjgVOList)) {
            setSegmentList(detail.ybjgVOList)
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
  }, [id, location.state, form])

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
        ...detailData,    // 先用原始数据
        ...values,        // 再用表单值覆盖（用户修改的部分）
        ybPk: id,
        siteId: siteId || detailData?.siteId,
        ybjgDTOList: segmentList.map(item => ({
          ybjgPk: item.ybjgPk,
          ybPk: id,
          dkname: item.dkname,
          sdkilo: item.sdkilo,
          edkilo: item.edkilo,
          ybjgTime: item.ybjgTime,
          risklevel: item.risklevel,
          wylevel: item.wylevel,
          grade: item.grade,
          jlresult: item.jlresult
        }))
      }
      
      console.log('📤 [地表补充] 提交数据:', submitData)
      
      const result = await apiAdapter.updateSurfaceSupplement(id!, submitData)
      
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

  // 打开分段信息编辑弹窗
  const handleEditSegment = (record: any) => {
    setEditingSegment(record)
    segmentForm.setFieldsValue({
      dkname: record.dkname || 'X2DK',
      wylevel: record.wylevel || 1,
      sdkilo: record.sdkilo,
      edkilo: record.edkilo,
      sdkiloEnd: record.sdkiloEnd || 250,
      edkiloEnd: record.edkiloEnd || 240,
      ybjgTime: record.ybjgTime,
      risklevel: record.risklevel || '破碎带',
      grade: record.grade,
      jlresult: record.jlresult
    })
    setSegmentModalVisible(true)
  }

  // 新增分段信息
  const handleAddSegment = () => {
    setEditingSegment(null)
    segmentForm.resetFields()
    segmentForm.setFieldsValue({
      dkname: 'X2DK',
      wylevel: 1,
      ybjgTime: new Date().toISOString().replace('T', ' ').substring(0, 19)
    })
    setSegmentModalVisible(true)
  }

  // 保存分段信息
  const handleSaveSegment = async () => {
    try {
      await segmentForm.validate()
      const values = segmentForm.getFieldsValue()
      
      if (editingSegment) {
        // 编辑现有记录
        const updatedList = segmentList.map(item => 
          item.ybjgPk === editingSegment.ybjgPk ? { ...item, ...values } : item
        )
        setSegmentList(updatedList)
        Message.success('分段信息更新成功')
      } else {
        // 新增记录
        const newSegment = {
          ...values,
          ybjgPk: Date.now(), // 临时ID
          ybPk: id
        }
        setSegmentList([...segmentList, newSegment])
        Message.success('分段信息添加成功')
      }
      
      setSegmentModalVisible(false)
    } catch (error) {
      console.error('❌ 保存分段信息失败:', error)
      Message.error('请检查表单填写')
    }
  }

  // 删除分段信息
  const handleDeleteSegment = (record: any) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这条分段信息吗？',
      okButtonProps: { status: 'danger' },
      onOk: () => {
        const updatedList = segmentList.filter(item => item.ybjgPk !== record.ybjgPk)
        setSegmentList(updatedList)
        Message.success('删除成功')
      }
    })
  }

  return (
    <div style={{ padding: '20px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
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
        <span>地表信息编辑</span>
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
            {/* 基本信息及其他信息 Tab */}
            <TabPane key="basic" title="基本信息及其他信息">
              <Form form={form} layout="vertical" style={{ marginTop: 20 }}>
                {/* 基本信息 */}
                <div style={{ 
                  textAlign: 'center', 
                  fontSize: 14, 
                  fontWeight: 600, 
                  marginBottom: 20,
                  padding: '10px 0',
                  backgroundColor: '#f7f8fa',
                  borderRadius: 4
                }}>
                  基本信息
                </div>
                
                <Row gutter={24}>
                  <Col span={8}>
                    <Form.Item label="预报时间" field="monitordate" rules={[{ required: true, message: '请选择预报时间' }]}>
                      <DatePicker showTime style={{ width: '100%' }} />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="里程冠号" field="dkname" rules={[{ required: true, message: '请输入里程冠号' }]}>
                      <Input placeholder="如 X2DK" />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="掌子面里程">
                      <Input.Group>
                        <Form.Item field="dkilo" noStyle>
                          <InputNumber placeholder="0" style={{ width: '40%' }} />
                        </Form.Item>
                        <span style={{ padding: '0 8px', lineHeight: '32px' }}>+</span>
                        <Form.Item field="beginkilo" noStyle>
                          <InputNumber placeholder="250" style={{ width: '40%' }} />
                        </Form.Item>
                      </Input.Group>
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={24}>
                  <Col span={8}>
                    <Form.Item label="开始里程范围">
                      <Input.Group>
                        <Form.Item field="beginkiloStart" noStyle>
                          <InputNumber placeholder="0" style={{ width: '40%' }} />
                        </Form.Item>
                        <span style={{ padding: '0 8px', lineHeight: '32px' }}>+</span>
                        <Form.Item field="beginkiloEnd" noStyle>
                          <InputNumber placeholder="250" style={{ width: '40%' }} />
                        </Form.Item>
                      </Input.Group>
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="本次预报长度" field="dbbcLength" rules={[{ required: true, message: '请输入预报长度' }]}>
                      <InputNumber placeholder="-10.00" style={{ width: '100%' }} />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="设计围岩等级" field="sjwydj" rules={[{ required: true, message: '请选择围岩等级' }]}>
                      <Select placeholder="请选择">
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

                <Row gutter={24}>
                  <Col span={8}>
                    <Form.Item label="与设计情况是否相符" field="sjqk" rules={[{ required: true, message: '请选择' }]}>
                      <Select placeholder="请选择">
                        <Select.Option value={1}>相符</Select.Option>
                        <Select.Option value={2}>不相符</Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={24}>
                  <Col span={8}>
                    <Form.Item label="检测人" field="testname" rules={[{ required: true, message: '请输入检测人' }]}>
                      <Input placeholder="测试1" />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="检测人身份证" field="testno" rules={[{ required: true, message: '请输入身份证' }]}>
                      <Input placeholder="511523199405295595" />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="检测人电话" field="testtel" rules={[{ required: true, message: '请输入电话' }]}>
                      <Input placeholder="15000000000" />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={24}>
                  <Col span={8}>
                    <Form.Item label="复核人" field="monitorname" rules={[{ required: true, message: '请输入复核人' }]}>
                      <Input placeholder="测试2" />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="复核人身份证" field="monitorno" rules={[{ required: true, message: '请输入身份证' }]}>
                      <Input placeholder="620422199508151115" />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="复核人电话" field="monitortel" rules={[{ required: true, message: '请输入电话' }]}>
                      <Input placeholder="15000000000" />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={24}>
                  <Col span={8}>
                    <Form.Item label="监理工程师" field="supervisorname" rules={[{ required: true, message: '请输入监理工程师' }]}>
                      <Input placeholder="测试3" />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="监理身份证" field="supervisorno" rules={[{ required: true, message: '请输入身份证' }]}>
                      <Input placeholder="411402198303293015" />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="监理电话" field="supervisortel" rules={[{ required: true, message: '请输入电话' }]}>
                      <Input placeholder="15000000000" />
                    </Form.Item>
                  </Col>
                </Row>

                {/* 其他信息 */}
                <div style={{ 
                  textAlign: 'center', 
                  fontSize: 14, 
                  fontWeight: 600, 
                  marginTop: 30,
                  marginBottom: 20,
                  padding: '10px 0',
                  backgroundColor: '#f7f8fa',
                  borderRadius: 4
                }}>
                  其他信息
                </div>

                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item label="预报分段结论" field="conclusionyb">
                      <TextArea 
                        placeholder="文字描述（选填）" 
                        maxLength={512}
                        showWordLimit
                        style={{ minHeight: 100 }}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="后续建议" field="suggestion">
                      <TextArea 
                        placeholder="文字描述（选填）" 
                        maxLength={512}
                        showWordLimit
                        style={{ minHeight: 100 }}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item label="处预审预措施" field="solution">
                      <TextArea 
                        placeholder="文字描述（选填）" 
                        maxLength={512}
                        showWordLimit
                        style={{ minHeight: 100 }}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="备注" field="remark" rules={[{ required: true, message: '请输入备注' }]}>
                      <TextArea 
                        placeholder="文字描述（选填）" 
                        maxLength={15}
                        showWordLimit
                        style={{ minHeight: 100 }}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </TabPane>

            {/* 地表信息 Tab */}
            <TabPane key="surface" title="地表信息">
              <Form form={form} layout="vertical" style={{ marginTop: 20 }}>
                <div style={{ 
                  textAlign: 'center', 
                  fontSize: 14, 
                  fontWeight: 600, 
                  marginBottom: 20,
                  padding: '10px 0',
                  backgroundColor: '#f7f8fa',
                  borderRadius: 4
                }}>
                  其他地表信息
                </div>

                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item label="地层岩性描述" field="dcyx" rules={[{ required: true, message: '请输入地层岩性描述' }]}>
                      <TextArea 
                        placeholder="文字描述（必填）" 
                        maxLength={256}
                        showWordLimit
                        style={{ minHeight: 100 }}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="地表岩溶描述" field="dbry" rules={[{ required: true, message: '请输入地表岩溶描述' }]}>
                      <TextArea 
                        placeholder="文字描述（必填）" 
                        maxLength={256}
                        showWordLimit
                        style={{ minHeight: 100 }}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item label="特殊地质产状描述" field="tsdz" rules={[{ required: true, message: '请输入特殊地质产状描述' }]}>
                      <TextArea 
                        placeholder="文字描述（必填）" 
                        maxLength={256}
                        showWordLimit
                        style={{ minHeight: 100 }}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="人为坑道描述" field="rwdk" rules={[{ required: true, message: '请输入人为坑道描述' }]}>
                      <TextArea 
                        placeholder="文字描述（必填）" 
                        maxLength={256}
                        showWordLimit
                        style={{ minHeight: 100 }}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item label="地质评定" field="dzpj" rules={[{ required: true, message: '请输入地质评定' }]}>
                      <TextArea 
                        placeholder="文字描述（必填）" 
                        maxLength={256}
                        showWordLimit
                        style={{ minHeight: 100 }}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </TabPane>

            {/* 分段信息及下次超前 Tab */}
            <TabPane key="segment" title="分段信息及下次超前">
              <div style={{ marginTop: 20 }}>
                <div style={{ 
                  textAlign: 'center', 
                  fontSize: 14, 
                  fontWeight: 600, 
                  marginBottom: 20,
                  padding: '10px 0',
                  backgroundColor: '#f7f8fa',
                  borderRadius: 4
                }}>
                  分段信息
                </div>

                <div style={{ marginBottom: 16 }}>
                  <Button type="primary" icon={<IconPlus />} onClick={handleAddSegment}>
                    新增
                  </Button>
                </div>
                
                <Table
                  columns={[
                    { 
                      title: '序号', 
                      dataIndex: 'index', 
                      width: 60, 
                      align: 'center' as const,
                      render: (_: any, __: any, index: number) => index + 1 
                    },
                    { 
                      title: '里程冠号', 
                      dataIndex: 'dkname', 
                      width: 100,
                      align: 'center' as const
                    },
                    { 
                      title: '开始里程值', 
                      dataIndex: 'sdkilo', 
                      width: 110,
                      align: 'center' as const
                    },
                    { 
                      title: '结束里程值', 
                      dataIndex: 'edkilo', 
                      width: 110,
                      align: 'center' as const
                    },
                    { 
                      title: '生产时间', 
                      dataIndex: 'ybjgTime', 
                      width: 160,
                      align: 'center' as const,
                      render: (time: string) => time ? time.replace('T', ' ').substring(0, 16) : '-'
                    },
                    { 
                      title: '风险类别', 
                      dataIndex: 'risklevel', 
                      width: 100,
                      align: 'center' as const,
                      render: (val: string) => {
                        const riskMap: Record<string, string> = { '1': '低风险', '2': '中风险', '3': '高风险', '4': '极高风险' }
                        return riskMap[val] || '破碎带'
                      }
                    },
                    { 
                      title: '地质类别', 
                      dataIndex: 'geologyType', 
                      width: 100,
                      align: 'center' as const,
                      render: () => '绿色'
                    },
                    { 
                      title: '围岩等级', 
                      dataIndex: 'wylevel', 
                      width: 100,
                      align: 'center' as const,
                      render: (val: number) => {
                        if (!val) return '1'
                        const gradeMap: Record<number, string> = { 1: 'Ⅰ', 2: 'Ⅱ', 3: 'Ⅲ', 4: 'Ⅳ', 5: 'Ⅴ', 6: 'Ⅵ' }
                        return gradeMap[val] || val
                      }
                    },
                    { 
                      title: '预报结论', 
                      dataIndex: 'jlresult', 
                      width: 120,
                      render: (val: string) => val || '文字描述'
                    },
                    {
                      title: '操作',
                      width: 100,
                      align: 'center' as const,
                      render: (_: any, record: any) => (
                        <Space>
                          <Button 
                            type="primary" 
                            shape="circle" 
                            size="small" 
                            style={{ backgroundColor: '#165dff' }}
                            onClick={() => handleEditSegment(record)}
                          >
                            <IconEdit style={{ fontSize: 12 }} />
                          </Button>
                          <Button 
                            type="primary" 
                            shape="circle" 
                            size="small" 
                            status="danger"
                            onClick={() => handleDeleteSegment(record)}
                          >
                            <IconDelete style={{ fontSize: 12 }} />
                          </Button>
                        </Space>
                      )
                    }
                  ]}
                  data={segmentList}
                  rowKey={(record: any) => record.ybjgPk || Math.random()}
                  pagination={{ pageSize: 5, showTotal: true }}
                  border
                  stripe
                  noDataElement={
                    <div style={{ padding: 20, color: '#86909c' }}>暂无分段信息数据</div>
                  }
                />

                {/* 下次超前地质预报 */}
                <div style={{ 
                  textAlign: 'center', 
                  fontSize: 14, 
                  fontWeight: 600, 
                  marginTop: 30,
                  marginBottom: 20,
                  padding: '10px 0',
                  backgroundColor: '#f7f8fa',
                  borderRadius: 4
                }}>
                  下次超前地质预报
                </div>
                
                <Form form={form} layout="inline">
                  <Row gutter={24} style={{ width: '100%' }}>
                    <Col span={8}>
                      <Form.Item label="下次预报方法" field="nextMethod">
                        <Select placeholder="请选择" style={{ width: 200 }}>
                          <Select.Option value="1">地震波反射</Select.Option>
                          <Select.Option value="2">水平声波剖面</Select.Option>
                          <Select.Option value="3">陆地声呐</Select.Option>
                          <Select.Option value="4">电磁波反射</Select.Option>
                          <Select.Option value="5">高分辨直流电</Select.Option>
                          <Select.Option value="6">瞬变电磁</Select.Option>
                          <Select.Option value="12">地表补充</Select.Option>
                          <Select.Option value="13">超前水平钻</Select.Option>
                          <Select.Option value="14">加深炮孔</Select.Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item label="预报开始里程" field="nextBeginKilo">
                        <Input placeholder="请输入" style={{ width: 200 }} />
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
              </div>
            </TabPane>

            {/* 图片上传 Tab */}
            <TabPane key="upload" title="图片上传">
              <div style={{ marginTop: 20 }}>
                <div style={{ 
                  textAlign: 'center', 
                  fontSize: 14, 
                  fontWeight: 600, 
                  marginBottom: 20,
                  padding: '10px 0',
                  backgroundColor: '#f7f8fa',
                  borderRadius: 4
                }}>
                  附件及成果图信息
                </div>

                <Row gutter={24}>
                  <Col span={24}>
                    <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                      <span style={{ color: '#f53f3f', marginRight: 4 }}>*</span>
                      <span style={{ fontWeight: 500, marginRight: 16, whiteSpace: 'nowrap', minWidth: 120 }}>附件（其他报告）：</span>
                      <div style={{ display: 'flex', gap: 12 }}>
                        {/* 已上传文件显示 */}
                        <div style={{ 
                          width: 100, 
                          height: 100, 
                          border: '1px solid #e5e6eb', 
                          borderRadius: 4,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: '#fafafa',
                          cursor: 'pointer'
                        }}>
                          {detailData?.addition && detailData.addition !== '1' ? (
                            <a 
                              href={`/api/v1/file/${siteId || detailData?.siteId}/dbbc/${detailData?.ybPk || id}/${detailData.addition}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ textAlign: 'center', textDecoration: 'none' }}
                            >
                              <div style={{ fontSize: 32, color: '#165dff', marginBottom: 4 }}>📄</div>
                              <div style={{ fontSize: 12, color: '#1d2129', wordBreak: 'break-all', padding: '0 4px' }}>
                                {detailData.addition.length > 12 ? detailData.addition.substring(0, 12) + '...' : detailData.addition}
                              </div>
                            </a>
                          ) : (
                            <div style={{ textAlign: 'center' }}>
                              <div style={{ fontSize: 32, color: '#c9cdd4', marginBottom: 4 }}>📄</div>
                              <div style={{ fontSize: 12, color: '#86909c' }}>暂无文件</div>
                            </div>
                          )}
                        </div>
                        
                        {/* 修改按钮 */}
                        <Upload 
                          action={`/api/v1/dbbc/upload`}
                          accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                          showUploadList={false}
                          data={{ ybPk: id, fileType: 'addition' }}
                          onChange={(fileList, file) => {
                            if (file.status === 'done') {
                              Message.success('文件上传成功')
                              // 刷新数据
                            } else if (file.status === 'error') {
                              Message.error('文件上传失败')
                            }
                          }}
                        >
                          <div style={{ 
                            width: 100, 
                            height: 100, 
                            border: '1px dashed #c9cdd4', 
                            borderRadius: 4,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: '#fff',
                            cursor: 'pointer'
                          }}>
                            <div style={{ fontSize: 24, color: '#86909c', marginBottom: 4 }}>✏️</div>
                            <div style={{ fontSize: 12, color: '#86909c' }}>修改</div>
                          </div>
                        </Upload>
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>
            </TabPane>
          </Tabs>

          {/* 底部按钮 - 在Tabs外面 */}
          <div style={{ marginTop: 24, textAlign: 'right', borderTop: '1px solid #e5e6eb', paddingTop: 16 }}>
            <Space>
              <Button onClick={handleBack}>取消</Button>
              <Button type="primary" icon={<IconSave />} loading={saving} onClick={handleSave}>
                保存
              </Button>
            </Space>
          </div>
        </Spin>
      </div>

      {/* 分段信息编辑弹窗 */}
      <Modal
        title={editingSegment ? '编辑分段信息' : '新增分段信息'}
        visible={segmentModalVisible}
        onOk={handleSaveSegment}
        onCancel={() => setSegmentModalVisible(false)}
        style={{ width: 700 }}
        okText="确认"
        cancelText="取消"
      >
        <Form form={segmentForm} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="里程冠号" field="dkname" rules={[{ required: true, message: '请输入里程冠号' }]}>
                <Input placeholder="X2DK" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="围岩等级" field="wylevel" rules={[{ required: true, message: '请选择围岩等级' }]}>
                <Select placeholder="请选择">
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
              <Form.Item label="开始里程" rules={[{ required: true, message: '请输入开始里程' }]}>
                <Input.Group>
                  <Form.Item field="sdkilo" noStyle>
                    <InputNumber placeholder="0" style={{ width: '45%' }} />
                  </Form.Item>
                  <span style={{ padding: '0 8px', lineHeight: '32px' }}>+</span>
                  <Form.Item field="sdkiloEnd" noStyle>
                    <InputNumber placeholder="250" style={{ width: '45%' }} />
                  </Form.Item>
                </Input.Group>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="结束里程" rules={[{ required: true, message: '请输入结束里程' }]}>
                <Input.Group>
                  <Form.Item field="edkilo" noStyle>
                    <InputNumber placeholder="0" style={{ width: '45%' }} />
                  </Form.Item>
                  <span style={{ padding: '0 8px', lineHeight: '32px' }}>+</span>
                  <Form.Item field="edkiloEnd" noStyle>
                    <InputNumber placeholder="240" style={{ width: '45%' }} />
                  </Form.Item>
                </Input.Group>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="产生时间" field="ybjgTime" rules={[{ required: true, message: '请选择时间' }]}>
                <DatePicker showTime style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="风险类别" field="risklevel" rules={[{ required: true, message: '请输入风险类别' }]}>
                <Input placeholder="破碎带 ▼" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="地质级别" field="grade">
                <div>
                  <span style={{ marginRight: 8 }}>已选:</span>
                  <Tag color="red">红色</Tag>
                  <div style={{ marginTop: 8 }}>
                    <span style={{ marginRight: 8 }}>待选:</span>
                    <Tag color="green" style={{ cursor: 'pointer', marginRight: 4 }}>绿色</Tag>
                    <Tag color="gold" style={{ cursor: 'pointer', marginRight: 4 }}>黄色</Tag>
                    <Tag color="orange" style={{ cursor: 'pointer' }}>橙色</Tag>
                  </div>
                </div>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item label="预报结论" field="jlresult" rules={[{ required: true, message: '请输入预报结论' }]}>
                <TextArea 
                  placeholder="文字描述" 
                  maxLength={500}
                  showWordLimit
                  style={{ minHeight: 80 }}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  )
}

export default SurfaceSupplementEditPage
