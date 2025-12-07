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
  Table
} from '@arco-design/web-react'
import { IconLeft, IconSave, IconPlus } from '@arco-design/web-react/icon'
import apiAdapter from '../services/apiAdapter'

const { TextArea } = Input
const TabPane = Tabs.TabPane
const { Row, Col } = Grid

function TunnelSketchEditPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [searchParams] = useSearchParams()
  const location = useLocation()
  
  const siteId = searchParams.get('siteId')
  
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('basic')
  const [segmentList, setSegmentList] = useState<any[]>([])
  const [detailData, setDetailData] = useState<any>(null)

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
        
        const detail = await apiAdapter.getTunnelSketchDetail(id)
        if (detail) {
          setDetailData(detail)
          form.setFieldsValue(detail)
          console.log('✅ 洞身素描详情数据:', detail)
          
          // 检查图片字段
          const imageFields = {
            zbqsmt: detail.zbqsmt,
            zbqxct: detail.zbqxct,
            ybqsmt: detail.ybqsmt,
            ybqxct: detail.ybqxct,
            gbsmt: detail.gbsmt,
            gbxct: detail.gbxct,
            addition: detail.addition
          }
          console.log('📊 图片字段:', imageFields)
          
          // 检查哪些图片字段是无效的（值为"1"表示后端数据问题）
          const invalidFields = Object.entries(imageFields)
            .filter(([_, value]) => value === '1')
            .map(([key]) => key)
          if (invalidFields.length > 0) {
            console.warn('⚠️ 以下图片字段值为"1"（后端数据问题，应存储实际文件名）:', invalidFields)
          }
          
          if (detail.ybjgVOList && Array.isArray(detail.ybjgVOList)) {
            setSegmentList(detail.ybjgVOList)
            console.log('✅ 分段信息已设置，数量:', detail.ybjgVOList.length)
          } else {
            setSegmentList([])
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
      }
      
      console.log('📤 [洞身素描] 提交数据:', submitData)
      
      const result = await apiAdapter.updateTunnelSketch(id!, submitData)
      
      if (result?.success) {
        Message.success('保存成功')
        handleBack()
      } else {
        Message.error(result?.message || '保存失败')
      }
    } catch (error) {
      console.error('❌ 保存失败:', error)
      Message.error('保存失败，请检查表单')
    } finally {
      setSaving(false)
    }
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
        <span>洞身素描编辑</span>
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
            <TabPane key="basic" title="基本信息">
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
                    <Form.Item label="预报时间" field="monitordate">
                      <DatePicker showTime style={{ width: '100%' }} />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="里程起点" field="dkname">
                      <Input placeholder="请输入里程起点" />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="掌子面里程" field="dkilo">
                      <InputNumber placeholder="里程" style={{ width: '100%' }} />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={24}>
                  <Col span={8}>
                    <Form.Item label="检测人" field="testname">
                      <Input placeholder="请输入检测人" />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="检测人身份证" field="testno">
                      <Input placeholder="请输入检测人身份证" />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="检测人电话" field="testtel">
                      <Input placeholder="请输入检测人电话" />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={24}>
                  <Col span={8}>
                    <Form.Item label="监理人" field="monitorname">
                      <Input placeholder="请输入监理人" />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="监理人身份证" field="monitorno">
                      <Input placeholder="请输入监理人身份证" />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="监理电话" field="monitortel">
                      <Input placeholder="请输入监理电话" />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={24}>
                  <Col span={8}>
                    <Form.Item label="监理工程师" field="supervisorname">
                      <Input placeholder="请输入监理工程师" />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="监理单位证" field="supervisorno">
                      <Input placeholder="请输入监理单位证" />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="监理单位" field="supervisortel">
                      <Input placeholder="请输入监理单位" />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={24}>
                  <Col span={8}>
                    <Form.Item label="里程起点" field="beginkilo">
                      <InputNumber placeholder="请输入" style={{ width: '100%' }} />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="掌子面里程" field="dkilo">
                      <InputNumber placeholder="请输入" style={{ width: '100%' }} />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="开挖进尺" field="dssmLength">
                      <InputNumber placeholder="请输入" style={{ width: '100%' }} />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={24}>
                  <Col span={8}>
                    <Form.Item label="设计围岩等级" field="sjwydj">
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
                  <Col span={8}>
                    <Form.Item label="施工围岩等级" field="sgwydj">
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
              </Form>
            </TabPane>

            {/* 其他信息 Tab */}
            <TabPane key="other" title="其他信息">
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
                  其他信息
                </div>

                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item label="水文地质描述" field="sjdzms">
                      <TextArea 
                        placeholder="文字描述" 
                        maxLength={512}
                        showWordLimit
                        style={{ minHeight: 120 }}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="地质岩性特征" field="sgdztz">
                      <TextArea 
                        placeholder="文字描述" 
                        maxLength={512}
                        showWordLimit
                        style={{ minHeight: 120 }}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item label="构造特征" field="sggztz">
                      <TextArea 
                        placeholder="文字描述" 
                        maxLength={512}
                        showWordLimit
                        style={{ minHeight: 120 }}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="水文地质特征" field="shswtz">
                      <TextArea 
                        placeholder="文字描述" 
                        maxLength={512}
                        showWordLimit
                        style={{ minHeight: 120 }}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item label="对拱顶沉降影响" field="dgdcjyx">
                      <TextArea 
                        placeholder="文字描述" 
                        maxLength={512}
                        showWordLimit
                        style={{ minHeight: 120 }}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="后续建议" field="suggestion">
                      <TextArea 
                        placeholder="文字描述" 
                        maxLength={512}
                        showWordLimit
                        style={{ minHeight: 120 }}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item label="综合安全预报结论" field="conclusionyb">
                      <TextArea 
                        placeholder="文字描述" 
                        maxLength={512}
                        showWordLimit
                        style={{ minHeight: 120 }}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="备注" field="remark">
                      <TextArea 
                        placeholder="文字描述" 
                        maxLength={512}
                        showWordLimit
                        style={{ minHeight: 120 }}
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
                  fontSize: 16, 
                  fontWeight: 600, 
                  marginBottom: 24,
                  padding: '12px 0',
                  backgroundColor: '#f7f8fa',
                  borderRadius: 4
                }}>
                  分段信息
                </div>

                <div style={{ marginBottom: 16 }}>
                  <Button type="primary" icon={<IconPlus />}>
                    添加
                  </Button>
                  <span style={{ marginLeft: 16, color: '#86909c', fontSize: 13 }}>
                    当前分段数量: {segmentList.length}
                  </span>
                </div>
                
                {segmentList.length === 0 && (
                  <div style={{ 
                    padding: 40, 
                    textAlign: 'center', 
                    color: '#86909c',
                    backgroundColor: '#f7f8fa',
                    borderRadius: 4,
                    marginBottom: 16
                  }}>
                    暂无分段信息数据
                  </div>
                )}
                
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
                      title: '里程起点', 
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
                      title: '生成时间', 
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
                        return riskMap[val] || val || '其他'
                      }
                    },
                    { 
                      title: '地质风险', 
                      dataIndex: 'geologyRisk', 
                      width: 100,
                      align: 'center' as const,
                      render: () => '石灰'
                    },
                    { 
                      title: '围岩等级', 
                      dataIndex: 'wylevel', 
                      width: 100,
                      align: 'center' as const,
                      render: (val: number) => {
                        if (!val) return '-'
                        const gradeMap: Record<number, string> = { 1: 'Ⅰ', 2: 'Ⅱ', 3: 'Ⅲ', 4: 'Ⅳ', 5: 'Ⅴ', 6: 'Ⅵ' }
                        return gradeMap[val] || val
                      }
                    },
                    { 
                      title: 'BQ值范围', 
                      dataIndex: 'bqRange', 
                      width: 100,
                      align: 'center' as const,
                      render: () => '-'
                    },
                    { 
                      title: '预报动态', 
                      dataIndex: 'jlresult', 
                      ellipsis: true,
                      render: (val: string) => val || '文字描述'
                    },
                    {
                      title: '操作',
                      width: 120,
                      align: 'center' as const,
                      render: () => (
                        <Space>
                          <Button type="text" size="small">编辑</Button>
                          <Button type="text" size="small" status="danger">删除</Button>
                        </Space>
                      )
                    }
                  ]}
                  data={segmentList}
                  rowKey={(record: any) => record.ybjgPk || Math.random()}
                  pagination={false}
                  border
                  stripe
                />

                {/* 下次超前地质预报 */}
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
                    下次超前地质预报
                  </div>
                  <Form form={form} layout="inline">
                    <Form.Item label="下次预报方法" field="nextMethod" style={{ marginRight: 24 }}>
                      <Select placeholder="请选择" style={{ width: 200 }}>
                        <Select.Option value="1">地震波反射</Select.Option>
                        <Select.Option value="2">水平声波剖面</Select.Option>
                        <Select.Option value="3">陆地声呐</Select.Option>
                        <Select.Option value="4">电磁波反射</Select.Option>
                        <Select.Option value="5">高分辨直流电</Select.Option>
                        <Select.Option value="6">瞬变电磁</Select.Option>
                        <Select.Option value="13">超前水平钻</Select.Option>
                        <Select.Option value="14">加深炮孔</Select.Option>
                      </Select>
                    </Form.Item>
                    <Form.Item label="预报时间日期" field="nextForecastDate">
                      <DatePicker style={{ width: 200 }} />
                    </Form.Item>
                  </Form>
                </div>
              </div>
            </TabPane>

            {/* 附件及图片上传 Tab */}
            <TabPane key="upload" title="附件及图片上传">
              <div style={{ marginTop: 20 }}>
                <div style={{ 
                  textAlign: 'center', 
                  fontSize: 16, 
                  fontWeight: 600, 
                  marginBottom: 24,
                  padding: '12px 0',
                  backgroundColor: '#f7f8fa',
                  borderRadius: 4
                }}>
                  附件及成果图信息
                </div>

                {/* 第一行：左边墙素描图、左边墙现场照片、右边墙素描图 */}
                <Row gutter={24} style={{ marginBottom: 24 }}>
                  <Col span={8}>
                    <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                      <span style={{ color: '#f53f3f', marginRight: 4 }}>*</span>
                      <span style={{ fontWeight: 500, marginRight: 12, whiteSpace: 'nowrap' }}>左边墙素描图：</span>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <div style={{ 
                          width: 80, height: 80, 
                          border: '1px solid #e5e6eb', 
                          borderRadius: 4,
                          overflow: 'hidden',
                          backgroundColor: '#f7f8fa',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          {detailData?.zbqsmt && detailData.zbqsmt !== '1' ? (
                            <img 
                              src={`/api/v1/file/${siteId || detailData?.siteId}/dssm/${detailData?.ybPk || id}/${detailData.zbqsmt}`} 
                              alt="左边墙素描图" 
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                            />
                          ) : <span style={{ color: '#86909c', fontSize: 12 }}>暂无图片</span>}
                        </div>
                        <Upload action={`/api/v1/dssm/file`} accept="image/*" showUploadList={false}>
                          <Button size="small" type="outline">修改</Button>
                        </Upload>
                      </div>
                    </div>
                  </Col>
                  <Col span={8}>
                    <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                      <span style={{ color: '#f53f3f', marginRight: 4 }}>*</span>
                      <span style={{ fontWeight: 500, marginRight: 12, whiteSpace: 'nowrap' }}>左边墙现场照片：</span>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <div style={{ 
                          width: 80, height: 80, 
                          border: '1px solid #e5e6eb', 
                          borderRadius: 4,
                          overflow: 'hidden',
                          backgroundColor: '#f7f8fa',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          {detailData?.zbqxct && detailData.zbqxct !== '1' ? (
                            <img 
                              src={`/api/v1/file/${siteId || detailData?.siteId}/dssm/${detailData?.ybPk || id}/${detailData.zbqxct}`} 
                              alt="左边墙现场照片" 
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                            />
                          ) : <span style={{ color: '#86909c', fontSize: 12 }}>暂无图片</span>}
                        </div>
                        <Upload action={`/api/v1/dssm/file`} accept="image/*" showUploadList={false}>
                          <Button size="small" type="outline">修改</Button>
                        </Upload>
                      </div>
                    </div>
                  </Col>
                  <Col span={8}>
                    <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                      <span style={{ color: '#f53f3f', marginRight: 4 }}>*</span>
                      <span style={{ fontWeight: 500, marginRight: 12, whiteSpace: 'nowrap' }}>右边墙素描图：</span>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <div style={{ 
                          width: 80, height: 80, 
                          border: '1px solid #e5e6eb', 
                          borderRadius: 4,
                          overflow: 'hidden',
                          backgroundColor: '#f7f8fa',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          {detailData?.ybqsmt && detailData.ybqsmt !== '1' ? (
                            <img 
                              src={`/api/v1/file/${siteId || detailData?.siteId}/dssm/${detailData?.ybPk || id}/${detailData.ybqsmt}`} 
                              alt="右边墙素描图" 
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                            />
                          ) : <span style={{ color: '#86909c', fontSize: 12 }}>暂无图片</span>}
                        </div>
                        <Upload action={`/api/v1/dssm/file`} accept="image/*" showUploadList={false}>
                          <Button size="small" type="outline">修改</Button>
                        </Upload>
                      </div>
                    </div>
                  </Col>
                </Row>

                {/* 第二行：右边墙现场照片、拱部素描图、拱部现场照片 */}
                <Row gutter={24} style={{ marginBottom: 24 }}>
                  <Col span={8}>
                    <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                      <span style={{ color: '#f53f3f', marginRight: 4 }}>*</span>
                      <span style={{ fontWeight: 500, marginRight: 12, whiteSpace: 'nowrap' }}>右边墙现场照片：</span>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <div style={{ 
                          width: 80, height: 80, 
                          border: '1px solid #e5e6eb', 
                          borderRadius: 4,
                          overflow: 'hidden',
                          backgroundColor: '#f7f8fa',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          {detailData?.ybqxct && detailData.ybqxct !== '1' ? (
                            <img 
                              src={`/api/v1/file/${siteId || detailData?.siteId}/dssm/${detailData?.ybPk || id}/${detailData.ybqxct}`} 
                              alt="右边墙现场照片" 
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                            />
                          ) : <span style={{ color: '#86909c', fontSize: 12 }}>暂无图片</span>}
                        </div>
                        <Upload action={`/api/v1/dssm/file`} accept="image/*" showUploadList={false}>
                          <Button size="small" type="outline">修改</Button>
                        </Upload>
                      </div>
                    </div>
                  </Col>
                  <Col span={8}>
                    <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                      <span style={{ color: '#f53f3f', marginRight: 4 }}>*</span>
                      <span style={{ fontWeight: 500, marginRight: 12, whiteSpace: 'nowrap' }}>拱部素描图：</span>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <div style={{ 
                          width: 80, height: 80, 
                          border: '1px solid #e5e6eb', 
                          borderRadius: 4,
                          overflow: 'hidden',
                          backgroundColor: '#f7f8fa',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          {detailData?.gbsmt && detailData.gbsmt !== '1' ? (
                            <img 
                              src={`/api/v1/file/${siteId || detailData?.siteId}/dssm/${detailData?.ybPk || id}/${detailData.gbsmt}`} 
                              alt="拱部素描图" 
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                            />
                          ) : <span style={{ color: '#86909c', fontSize: 12 }}>暂无图片</span>}
                        </div>
                        <Upload action={`/api/v1/dssm/file`} accept="image/*" showUploadList={false}>
                          <Button size="small" type="outline">修改</Button>
                        </Upload>
                      </div>
                    </div>
                  </Col>
                  <Col span={8}>
                    <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                      <span style={{ color: '#f53f3f', marginRight: 4 }}>*</span>
                      <span style={{ fontWeight: 500, marginRight: 12, whiteSpace: 'nowrap' }}>拱部现场照片：</span>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <div style={{ 
                          width: 80, height: 80, 
                          border: '1px solid #e5e6eb', 
                          borderRadius: 4,
                          overflow: 'hidden',
                          backgroundColor: '#f7f8fa',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          {detailData?.gbxct && detailData.gbxct !== '1' ? (
                            <img 
                              src={`/api/v1/file/${siteId || detailData?.siteId}/dssm/${detailData?.ybPk || id}/${detailData.gbxct}`} 
                              alt="拱部现场照片" 
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                            />
                          ) : <span style={{ color: '#86909c', fontSize: 12 }}>暂无图片</span>}
                        </div>
                        <Upload action={`/api/v1/dssm/file`} accept="image/*" showUploadList={false}>
                          <Button size="small" type="outline">修改</Button>
                        </Upload>
                      </div>
                    </div>
                  </Col>
                </Row>

                {/* 第三行：附件（其他报告） */}
                <Row gutter={24}>
                  <Col span={8}>
                    <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                      <span style={{ color: '#f53f3f', marginRight: 4 }}>*</span>
                      <span style={{ fontWeight: 500, marginRight: 12, whiteSpace: 'nowrap' }}>附件（其他报告）：</span>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <div style={{ 
                          width: 80, height: 80, 
                          border: '1px solid #e5e6eb', 
                          borderRadius: 4,
                          overflow: 'hidden',
                          backgroundColor: '#f7f8fa',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          {detailData?.addition && detailData.addition !== '1' ? (
                            <img 
                              src={`/api/v1/file/${siteId || detailData?.siteId}/dssm/${detailData?.ybPk || id}/${detailData.addition}`} 
                              alt="附件" 
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                            />
                          ) : <span style={{ color: '#86909c', fontSize: 12 }}>暂无图片</span>}
                        </div>
                        <Upload action={`/api/v1/dssm/file`} accept="image/*,.pdf,.doc,.docx" showUploadList={false}>
                          <Button size="small" type="outline">修改</Button>
                        </Upload>
                      </div>
                    </div>
                  </Col>
                </Row>
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
    </div>
  )
}

export default TunnelSketchEditPage
