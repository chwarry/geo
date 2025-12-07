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
  Upload,
  Table
} from '@arco-design/web-react'
import { IconLeft, IconSave, IconPlus } from '@arco-design/web-react/icon'
import apiAdapter from '../services/apiAdapter'

const { TextArea } = Input
const TabPane = Tabs.TabPane
const { Row, Col } = Grid

function PalmSketchEditPage() {
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
  const [originalData, setOriginalData] = useState<any>(null) // 保存原始数据

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
          setOriginalData(data)
        }
        
        // 调用详情接口 - 使用真实API
        const detail = await apiAdapter.getPalmSketchDetail(id)
        if (detail) {
          form.setFieldsValue(detail)
          setOriginalData(detail) // 保存原始数据
          console.log('✅ 掌子面素描详情数据:', detail)
          
          // 设置分段信息列表
          if (detail.ybjgVOList) {
            setSegmentList(detail.ybjgVOList)
            console.log('📊 分段信息数据:', detail.ybjgVOList)
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
        ...originalData,  // 先用原始数据
        ...values,        // 再用表单值覆盖（用户修改的部分）
        ybPk: id,
        siteId: siteId || originalData?.siteId,
      }
      
      console.log('📤 [掌子面素描] 提交数据:', submitData)
      
      // 调用更新接口 - 使用真实API
      const result = await apiAdapter.updatePalmSketch(id!, submitData)
      
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
        <span>掌子面素描编辑</span>
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
            {/* 基本信息其他信息 Tab */}
            <TabPane key="basic" title="基本信息其他信息">
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
                    <Form.Item label="现场时间" field="monitordate">
                      <DatePicker showTime style={{ width: '100%' }} />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="里程起点" field="dkname">
                      <Input placeholder="请输入里程起点" />
                    </Form.Item>
                  </Col>
                  <Col span={4}>
                    <Form.Item label="掌子面里程" field="dkilo">
                      <InputNumber placeholder="里程" style={{ width: '100%' }} />
                    </Form.Item>
                  </Col>
                  <Col span={4}>
                    <Form.Item label="+" field="dkiloPlus">
                      <InputNumber placeholder="521.2" style={{ width: '100%' }} precision={1} />
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
                    <Form.Item label="开挖分区" field="kwfs">
                      <Select placeholder="请选择开挖分区">
                        <Select.Option value={1}>全断面法</Select.Option>
                        <Select.Option value={2}>台阶法</Select.Option>
                        <Select.Option value={3}>CD法</Select.Option>
                        <Select.Option value={4}>双侧壁导坑法</Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>

                {/* 掌子面图示 */}
                <Row gutter={24}>
                  <Col span={24}>
                    <Form.Item label="掌子面位置">
                      <div style={{ 
                        textAlign: 'center', 
                        padding: '20px',
                        border: '1px solid #e5e6eb',
                        borderRadius: 4,
                        backgroundColor: '#f7f8fa'
                      }}>
                        {/* 这里可以放置掌子面示意图 */}
                        <div style={{ fontSize: 14, color: '#86909c' }}>掌子面位置示意图</div>
                      </div>
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
                  开挖方式及水平
                </div>

                <Row gutter={24}>
                  <Col span={8}>
                    <Form.Item label="拱顶围岩级别" field="basicwylevel">
                      <Select placeholder="请选择围岩级别">
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
                    <Form.Item label="开挖高度" field="kwgd">
                      <InputNumber placeholder="请输入" style={{ width: '100%' }} precision={2} />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="开挖宽度" field="kwkd">
                      <InputNumber placeholder="请输入" style={{ width: '100%' }} precision={2} />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={24}>
                  <Col span={8}>
                    <Form.Item label="开挖面积" field="kwmj">
                      <InputNumber placeholder="请输入" style={{ width: '100%' }} precision={2} />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="爆破数" field="bwnum">
                      <InputNumber placeholder="请输入爆破数" style={{ width: '100%' }} min={0} />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="掌子面状态" field="zzmzt">
                      <Select placeholder="请选择">
                        <Select.Option value="稳定">稳定</Select.Option>
                        <Select.Option value="较稳定">较稳定</Select.Option>
                        <Select.Option value="不稳定">不稳定</Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={24}>
                  <Col span={24}>
                    <Form.Item label="掌子面状态描述" field="zzmms">
                      <TextArea 
                        placeholder="请输入掌子面状态描述" 
                        maxLength={512}
                        showWordLimit
                        style={{ minHeight: 100 }}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </TabPane>

            {/* 及岩土体数据信息 Tab */}
            <TabPane key="rocksoil" title="及岩土体数据信息">
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
                  岩体信息
                </div>

                <Row gutter={24}>
                  <Col span={8}>
                    <Form.Item label="岩体完整性评定" field="ytwzztpd">
                      <InputNumber placeholder="请输入岩体完整性评定" style={{ width: '100%' }} min={1} max={5} />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="岩性" field="ytlx">
                      <Input placeholder="请输入岩性，如：泥岩夹砂岩" />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="岩土特征类别" field="zzmsmType">
                      <Select placeholder="请选择">
                        <Select.Option value={1}>岩体</Select.Option>
                        <Select.Option value={2}>土体</Select.Option>
                      </Select>
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
                  土体数据
                </div>

                <Row gutter={24}>
                  <Col span={8}>
                    <Form.Item label="土名称" field="tmc">
                      <Input placeholder="请输入土名称，如：粉质土" />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="土体特征" field="tttz">
                      <TextArea 
                        placeholder="请输入土体特征" 
                        maxLength={512}
                        showWordLimit
                        style={{ minHeight: 80 }}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="地质年代" field="dznd">
                      <Select placeholder="请选择地质年代">
                        <Select.Option value="中元古代-蓟县">中元古代-蓟县</Select.Option>
                        <Select.Option value="新元古代">新元古代</Select.Option>
                        <Select.Option value="古生代">古生代</Select.Option>
                        <Select.Option value="中生代">中生代</Select.Option>
                        <Select.Option value="新生代">新生代</Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={24}>
                  <Col span={8}>
                    <Form.Item label="土体颜色" field="ttys">
                      <TextArea 
                        placeholder="请输入土体颜色" 
                        maxLength={512}
                        showWordLimit
                        style={{ minHeight: 80 }}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="土体结构" field="ttjg">
                      <TextArea 
                        placeholder="请输入土体结构" 
                        maxLength={512}
                        showWordLimit
                        style={{ minHeight: 80 }}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="成因" field="cy">
                      <TextArea 
                        placeholder="请输入成因" 
                        maxLength={512}
                        showWordLimit
                        style={{ minHeight: 80 }}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={24}>
                  <Col span={8}>
                    <Form.Item label="湿度" field="sd">
                      <TextArea 
                        placeholder="请输入湿度" 
                        maxLength={512}
                        showWordLimit
                        style={{ minHeight: 80 }}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="密实度" field="msd">
                      <TextArea 
                        placeholder="请输入密实度" 
                        maxLength={512}
                        showWordLimit
                        style={{ minHeight: 80 }}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="塑性" field="sx">
                      <TextArea 
                        placeholder="请输入塑性" 
                        maxLength={512}
                        showWordLimit
                        style={{ minHeight: 80 }}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={24}>
                  <Col span={8}>
                    <Form.Item label="硬度" field="yd">
                      <InputNumber placeholder="请输入硬度" style={{ width: '100%' }} />
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </TabPane>

            {/* 掌子面数据 Tab */}
            <TabPane key="facedata" title="掌子面数据">
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
                  掌子面三维数据
                </div>

                <Row gutter={24}>
                  <Col span={8}>
                    <Form.Item label="基本围岩级别" field="basicwylevel">
                      <Select placeholder="请选择基本围岩级别">
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
                    <Form.Item label="节理面组数" field="jgmzs">
                      <InputNumber placeholder="请输入节理面组数" style={{ width: '100%' }} min={0} />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="地下水评定" field="dxspd">
                      <InputNumber placeholder="请输入地下水评定" style={{ width: '100%' }} min={0} />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={24}>
                  <Col span={8}>
                    <Form.Item label="平均间距(m)" field="pjjj">
                      <InputNumber 
                        placeholder="请输入平均间距" 
                        style={{ width: '100%' }} 
                        precision={2}
                        step={0.01}
                        min={0}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="评估结值" field="pgjz">
                      <InputNumber placeholder="请输入评估结值" style={{ width: '100%' }} min={0} />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="修正后围岩级别" field="fixwylevel">
                      <Select placeholder="请选择修正后围岩级别">
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
                    <Form.Item label="初始地应力评定" field="csdylpd">
                      <Input placeholder="请输入初始地应力评定" />
                    </Form.Item>
                  </Col>
                  <Col span={16}>
                    <Form.Item label="地质构造应力" field="dzgzyl">
                      <TextArea 
                        placeholder="请输入地质构造应力描述" 
                        maxLength={512}
                        showWordLimit
                        style={{ minHeight: 80 }}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={24}>
                  <Col span={24}>
                    <Form.Item label="掌子面描述" field="zzmms">
                      <TextArea 
                        placeholder="请输入掌子面描述" 
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
                </div>
                
                <Table
                  columns={[
                    { title: '序号', dataIndex: 'index', width: 80, render: (_: any, __: any, index: number) => index + 1 },
                    { title: '里程起点', dataIndex: 'dkname', width: 100 },
                    { title: '开始里程值', dataIndex: 'sdkilo', width: 120 },
                    { title: '结束里程值', dataIndex: 'edkilo', width: 120 },
                    { 
                      title: '生成时间', 
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
                        const riskMap: Record<string, string> = { '1': '低风险', '2': '中风险', '3': '高风险', '4': '极高风险' }
                        const riskText = riskMap[val] || val || '-'
                        const colorMap: Record<string, string> = { '低风险': '#00b42a', '中风险': '#ff7d00', '高风险': '#f53f3f', '极高风险': '#d91ad9' }
                        const color = colorMap[riskText] || '#1d2129'
                        return <span style={{ color, fontWeight: 500 }}>{riskText}</span>
                      }
                    },
                    { title: '地质类型', dataIndex: 'geologyType', width: 100 },
                    { 
                      title: '围岩等级', 
                      dataIndex: 'wylevel', 
                      width: 110,
                      align: 'center' as const,
                      render: (val: number, record: any) => {
                        if (val) {
                          const rockGradeMap = ['Ⅰ', 'Ⅱ', 'Ⅲ', 'Ⅳ', 'Ⅴ', 'Ⅵ']
                          const grade = rockGradeMap[val - 1] || val
                          const subGrade = record.grade ? `-${record.grade}` : ''
                          return `围岩${grade}${subGrade}`
                        }
                        return '-'
                      }
                    },
                    { title: '预报动态', dataIndex: 'jlresult', ellipsis: true, width: 200 }
                  ]}
                  data={segmentList}
                  rowKey={(record: any) => record.ybjgPk}
                  pagination={false}
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
                    下次超前地质预报
                  </div>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item label="下次超前预报方法" style={{ marginBottom: 0 }}>
                        <Select placeholder="请选择预报方法" style={{ width: '100%' }}>
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
                  附件及图片管理
                </div>

                <Row gutter={24}>
                  {/* 附件（word/pdf） */}
                  <Col span={8}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ marginBottom: 12, fontWeight: 500 }}>附件（word/pdf）</div>
                      <Upload
                        action="/api/v1/zzmsm/file"
                        accept=".doc,.docx,.pdf"
                        listType="picture-card"
                        limit={1}
                        onChange={(fileList) => {
                          console.log('附件上传:', fileList)
                        }}
                      >
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: 20, color: '#86909c' }}>+</div>
                          <div style={{ fontSize: 12, color: '#86909c', marginTop: 8 }}>上传</div>
                        </div>
                      </Upload>
                    </div>
                  </Col>

                  {/* 掌子面照片 */}
                  <Col span={8}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ marginBottom: 12, fontWeight: 500 }}>掌子面照片</div>
                      <Upload
                        action="/api/v1/zzmsm/file"
                        accept="image/*"
                        listType="picture-card"
                        limit={1}
                        onChange={(fileList) => {
                          console.log('掌子面照片上传:', fileList)
                        }}
                      >
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: 20, color: '#86909c' }}>+</div>
                          <div style={{ fontSize: 12, color: '#86909c', marginTop: 8 }}>上传</div>
                        </div>
                      </Upload>
                    </div>
                  </Col>

                  {/* 综合照片图片 */}
                  <Col span={8}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ marginBottom: 12, fontWeight: 500 }}>综合照片图片</div>
                      <Upload
                        action="/api/v1/zzmsm/file"
                        accept="image/*"
                        listType="picture-card"
                        limit={1}
                        onChange={(fileList) => {
                          console.log('综合照片图片上传:', fileList)
                        }}
                      >
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: 20, color: '#86909c' }}>+</div>
                          <div style={{ fontSize: 12, color: '#86909c', marginTop: 8 }}>上传</div>
                        </div>
                      </Upload>
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

export default PalmSketchEditPage
