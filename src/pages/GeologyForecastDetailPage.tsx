import React, { useState, useEffect } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import {
  Card,
  Button,
  Tabs,
  Table,
  Spin,
  Message,
  Image,
  Descriptions,
  Space,
  Typography
} from '@arco-design/web-react'
import { IconLeft } from '@arco-design/web-react/icon'
import apiAdapter from '../services/apiAdapter'

const { Paragraph } = Typography

const TabPane = Tabs.TabPane

// 预报方法映射
const METHOD_MAP: Record<number, string> = {
  1: '地震波反射',
  2: '水平声波剖面',
  3: '陆地声呐',
  4: '电磁波反射',
  5: '高分辨直流电',
  6: '瞬变电磁',
  7: '掌子面素描',
  8: '洞身素描',
  12: '地表补充',
  13: '超前水平钻',
  14: '加深炮孔',
}

function GeologyForecastDetailPage() {
  const navigate = useNavigate()
  const { type, id } = useParams<{ type: string; id: string }>()
  const [searchParams] = useSearchParams()
  
  const method = searchParams.get('method')
  const siteId = searchParams.get('siteId')
  
  const [loading, setLoading] = useState(false)
  const [detailData, setDetailData] = useState<any>(null)
  const [activeTab, setActiveTab] = useState('result')

  // 获取详情数据
  useEffect(() => {
    const fetchDetail = async () => {
      if (!id || !type) return
      
      setLoading(true)
      try {
        let detail = null
        
        switch (type) {
          case 'geophysical':
            if (method) {
              detail = await apiAdapter.getGeophysicalDetailByMethod(method, id)
            }
            break
          case 'palmSketch':
            detail = await apiAdapter.getPalmSketchDetail(id)
            break
          case 'tunnelSketch':
            detail = await apiAdapter.getTunnelSketchDetail(id)
            break
          case 'drilling':
            detail = await apiAdapter.getDrillingDetail(id, method)
            break
          default:
            Message.error('未知的预报类型')
            return
        }
        
        if (detail) {
          setDetailData(detail)
          console.log('✅ 详情数据加载成功:', detail)
          console.log('📊 结论数据 ybjgVOList:', detail.ybjgVOList)
          console.log('📊 物理参数 tspBxdataVOList:', detail.tspBxdataVOList)
          console.log('📊 现场数据 tspPddataVOList:', detail.tspPddataVOList)
        } else {
          Message.error('获取详情数据失败')
        }
      } catch (error) {
        console.error('❌ 获取详情失败:', error)
        Message.error('获取详情数据失败')
      } finally {
        setLoading(false)
      }
    }
    
    fetchDetail()
  }, [type, id, method])

  // 返回按钮
  const handleBack = () => {
    if (siteId) {
      navigate(`/forecast/geology/${siteId}`)
    } else {
      navigate(-1)
    }
  }

  // 渲染基本信息
  const renderBasicInfo = () => {
    if (!detailData) return null
    
    const data = [
      { label: '工程名称', value: detailData.dkname || '-' },
      { label: '掌子面里程(m)', value: detailData.dkilo || '-' },
      { label: '激发孔数量', value: detailData.jfpknum || '-' },
      { label: '检波器数量', value: detailData.jspknum || '-' },
      { label: '监测期间', value: detailData.monitordate ? detailData.monitordate.replace('T', ' ') : '-' },
      { label: '设备', value: detailData.sbName || '-' },
      { label: '激发孔间距(m)', value: detailData.jfpkjj || '-' },
      { label: '激发孔深度(m)', value: detailData.jfpksd || '-' },
      { label: '激发孔直径(m)', value: detailData.jfpkzj || '-' },
      { label: '激发孔角度(°)', value: detailData.jfpkjdmgd || '-' },
      { label: '测线方位角(°)', value: detailData.kwwz || '-' },
      { label: '测线左侧里程', value: detailData.leftkilo || '-' },
      { label: '测线右侧里程', value: detailData.rightkilo || '-' },
      { label: '预报长度(m)', value: detailData.ybLength || '-' },
    ]
    
    return (
      <div style={{ 
        marginBottom: 24,
        padding: 16,
        backgroundColor: '#f7f8fa',
        borderRadius: 4
      }}>
        <h3 style={{ marginBottom: 16, fontSize: 16, fontWeight: 600 }}>地震波预报结果</h3>
        <Descriptions
          column={2}
          data={data}
          labelStyle={{ width: 180, fontWeight: 500, color: '#4e5969' }}
          valueStyle={{ color: '#1d2129' }}
        />
      </div>
    )
  }

  // 渲染图表区域
  const renderCharts = () => {
    if (!detailData) return null
    
    console.log('🖼️ 图片数据检查:', {
      pic1: detailData.pic1,
      pic2: detailData.pic2,
      pic3: detailData.pic3,
      pic4: detailData.pic4,
      pic5: detailData.pic5,
      pic6: detailData.pic6,
    })
    
    const images = [
      { title: '波形分布图', url: detailData.pic1, key: 'pic1' },
      { title: '2D成果图', url: detailData.pic2, key: 'pic2' },
      { title: 'X向云图', url: detailData.pic3, key: 'pic3' },
      { title: 'Y向云图', url: detailData.pic4, key: 'pic4' },
      { title: 'Z向云图', url: detailData.pic5, key: 'pic5' },
      { title: '岩土物性图', url: detailData.pic6, key: 'pic6' },
    ].filter(img => img.url)
    
    console.log('🖼️ 过滤后的图片数量:', images.length)
    
    if (images.length === 0) {
      return (
        <div style={{ 
          padding: 24, 
          textAlign: 'center', 
          color: '#86909c',
          backgroundColor: '#f7f8fa',
          borderRadius: 4,
          marginBottom: 24
        }}>
          <div style={{ marginBottom: 8 }}>暂无图片数据</div>
          <div style={{ fontSize: 12 }}>数据库中没有图片记录</div>
        </div>
      )
    }
    
    // 添加图片加载说明
    const hasImageLoadIssue = true // 当前图片加载有权限问题
    
    if (hasImageLoadIssue) {
      return (
        <div style={{ marginBottom: 24 }}>
          <div style={{ 
            padding: 16, 
            backgroundColor: '#fff7e8',
            border: '1px solid #ffcf8b',
            borderRadius: 4,
            marginBottom: 16
          }}>
            <div style={{ fontWeight: 500, marginBottom: 8, color: '#ff7d00' }}>
              ⚠️ 图片加载问题
            </div>
            <div style={{ fontSize: 13, color: '#4e5969', lineHeight: 1.6 }}>
              当前图片无法加载（403 Forbidden），可能的原因：
              <ul style={{ margin: '8px 0', paddingLeft: 20 }}>
                <li>后端文件下载接口需要特殊权限配置</li>
                <li>文件存储路径或 fileType 参数不正确</li>
                <li>文件服务器未正确配置 CORS</li>
              </ul>
              <div style={{ marginTop: 8 }}>
                <strong>建议：</strong>联系后端开发人员检查文件下载接口权限配置
              </div>
            </div>
          </div>
          
          <div style={{ fontSize: 13, color: '#86909c', marginBottom: 16 }}>
            图片 UUID 列表（共 {images.length} 张）：
          </div>
          {images.map((img) => (
            <div 
              key={img.key} 
              style={{ 
                marginBottom: 16,
                padding: 12,
                border: '1px solid #e5e6eb',
                borderRadius: 4,
                backgroundColor: '#f7f8fa'
              }}
            >
              <div style={{ fontWeight: 500, marginBottom: 8 }}>{img.title}</div>
              <div style={{ fontSize: 12, color: '#86909c', wordBreak: 'break-all' }}>
                UUID: {img.url}
              </div>
            </div>
          ))}
        </div>
      )
    }
    
    return (
      <div style={{ marginBottom: 24 }}>
        {images.map((img) => {
          // 处理图片 URL
          let imageUrl = img.url
          
          // 如果是 UUID 格式（没有 http 和 /），需要构建完整的文件下载路径
          if (imageUrl && !imageUrl.startsWith('http') && !imageUrl.startsWith('/')) {
            // 使用文件下载 API: /api/v1/file/{siteId}/{fileType}/{ybPk}/{fileName}
            const siteIdParam = detailData.siteId || siteId || ''
            const ybPkParam = detailData.ybPk || id || ''
            const fileType = 'tsp' // 根据预报类型确定
            
            // 构建完整的文件下载 URL
            imageUrl = `/api/v1/file/${siteIdParam}/${fileType}/${ybPkParam}/${imageUrl}`
          }
          // 如果是相对路径（以 / 开头），保持不变（会被代理）
          else if (imageUrl && imageUrl.startsWith('/')) {
            // 已经是相对路径，不需要处理
          }
          // 如果是完整 URL（以 http 开头），保持不变
          else if (imageUrl && imageUrl.startsWith('http')) {
            // 已经是完整 URL，不需要处理
          }
          
          console.log('🖼️ 图片URL处理:', img.key, '原始:', img.url, '处理后:', imageUrl)
          
          return (
            <div 
              key={img.key} 
              style={{ 
                marginBottom: 24,
                border: '1px solid #e5e6eb',
                borderRadius: 4,
                overflow: 'hidden'
              }}
            >
              <div style={{ 
                padding: '12px 16px', 
                backgroundColor: '#f7f8fa',
                borderBottom: '1px solid #e5e6eb',
                fontSize: 14,
                fontWeight: 500
              }}>
                {img.title}
              </div>
              <div style={{ padding: 16, backgroundColor: '#fff' }}>
                <div>
                  <Image
                    src={imageUrl}
                    alt={img.title}
                    style={{ width: '100%', display: 'block' }}
                    preview
                    loader
                    error={
                      <div style={{ 
                        padding: 40, 
                        textAlign: 'center', 
                        color: '#86909c',
                        backgroundColor: '#f7f8fa',
                        borderRadius: 4
                      }}>
                        <div style={{ marginBottom: 12, fontSize: 14 }}>图片加载失败 (403 Forbidden)</div>
                        <div style={{ fontSize: 12, color: '#c9cdd4', marginBottom: 16, wordBreak: 'break-all' }}>
                          {imageUrl}
                        </div>
                        <Space>
                          <Button 
                            size="small" 
                            type="outline"
                            onClick={() => window.open(imageUrl, '_blank')}
                          >
                            在新标签页打开
                          </Button>
                          <Button 
                            size="small" 
                            type="outline"
                            onClick={() => {
                              navigator.clipboard.writeText(imageUrl)
                              Message.success('URL 已复制到剪贴板')
                            }}
                          >
                            复制 URL
                          </Button>
                        </Space>
                        <div style={{ marginTop: 12, fontSize: 12, color: '#f53f3f' }}>
                          提示：可能是权限问题或文件不存在
                        </div>
                      </div>
                    }
                  />
                </div>
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  // 渲染结论表格
  const renderConclusionTable = () => {
    if (!detailData || !detailData.ybjgVOList || detailData.ybjgVOList.length === 0) {
      return null
    }
    
    const columns = [
      {
        title: '序号',
        dataIndex: 'index',
        width: 80,
        align: 'center' as const,
        render: (_: any, __: any, index: number) => index + 1
      },
      {
        title: '里程范围',
        dataIndex: 'lcfw',
        width: 200,
        render: (_: any, record: any) => {
          if (record.sdkilo && record.edkilo) {
            return `DK${record.sdkilo} - DK${record.edkilo}`
          }
          return record.lcfw || '-'
        }
      },
      {
        title: '长度',
        dataIndex: 'length',
        width: 100,
        align: 'center' as const,
        render: (_: any, record: any) => {
          if (record.sdkilo && record.edkilo) {
            const length = (record.edkilo - record.sdkilo).toFixed(1)
            return `${length}m`
          }
          return record.length || '-'
        }
      },
      {
        title: '预测结论',
        dataIndex: 'jlresult',
        ellipsis: true,
        render: (val: string) => val || '-'
      },
      {
        title: '风险类别',
        dataIndex: 'risklevel',
        width: 120,
        align: 'center' as const,
        render: (val: string) => {
          const colorMap: Record<string, string> = {
            '高风险': '#f53f3f',
            '中风险': '#ff7d00',
            '低风险': '#00b42a',
          }
          return (
            <span style={{ color: colorMap[val] || '#1d2129', fontWeight: 500 }}>
              {val || '-'}
            </span>
          )
        }
      },
      {
        title: '围岩等级',
        dataIndex: 'wylevel',
        width: 120,
        align: 'center' as const,
        render: (val: number) => {
          if (val) {
            return `Ⅴ${val}级`
          }
          return '-'
        }
      },
    ]
    
    return (
      <div style={{ marginBottom: 24 }}>
        <h4 style={{ 
          marginBottom: 12, 
          fontSize: 14, 
          fontWeight: 600,
          padding: '12px 16px',
          backgroundColor: '#f7f8fa',
          borderRadius: 4
        }}>
          结论
        </h4>
        <Table
          columns={columns}
          data={detailData.ybjgVOList}
          rowKey={(record) => String(record.ybjgPk || record.id || Math.random())}
          pagination={false}
          border
          stripe
        />
      </div>
    )
  }

  // 渲染后续建议
  const renderSuggestion = () => {
    if (!detailData) return null
    
    return (
      <div style={{ marginBottom: 24 }}>
        <h4 style={{ marginBottom: 12, fontSize: 14, fontWeight: 500 }}>后续建议</h4>
        <div style={{ 
          padding: 16, 
          backgroundColor: '#f7f8fa', 
          borderRadius: 4,
          lineHeight: 1.8
        }}>
          {detailData.suggestion || detailData.conclusionyb || '暂无建议'}
        </div>
      </div>
    )
  }

  // 渲染原始文件
  const renderFiles = () => {
    if (!detailData) return null
    
    return (
      <div style={{ marginBottom: 24 }}>
        <h4 style={{ marginBottom: 12, fontSize: 14, fontWeight: 500 }}>原始文件</h4>
        <Space>
          <Button type="primary">文件下载</Button>
        </Space>
      </div>
    )
  }

  // 渲染签名区
  const renderSignature = () => {
    if (!detailData) return null
    
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-around',
        padding: '24px 0',
        borderTop: '1px solid #e5e6eb'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ marginBottom: 8, color: '#86909c' }}>检测</div>
          <div style={{ fontWeight: 500 }}>{detailData.testname || '-'}</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ marginBottom: 8, color: '#86909c' }}>审核</div>
          <div style={{ fontWeight: 500 }}>{detailData.monitorname || '-'}</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ marginBottom: 8, color: '#86909c' }}>批准</div>
          <div style={{ fontWeight: 500 }}>{detailData.supervisorname || '-'}</div>
        </div>
      </div>
    )
  }

  // 渲染围岩参数物理学参数表
  const renderPhysicsParams = () => {
    if (!detailData || !detailData.tspBxdataVOList || detailData.tspBxdataVOList.length === 0) {
      return (
        <div style={{ padding: 60, textAlign: 'center', color: '#86909c', backgroundColor: '#f7f8fa', borderRadius: 4 }}>
          <div style={{ fontSize: 14, marginBottom: 8 }}>暂无围岩参数数据</div>
          <div style={{ fontSize: 12 }}>该预报记录未包含物理学参数信息</div>
        </div>
      )
    }
    
    const columns = [
      { 
        title: '检波器', 
        dataIndex: 'jbq', 
        width: 150,
        render: (val: string) => val || '-'
      },
      { 
        title: '序号', 
        dataIndex: 'jbxh', 
        width: 100,
        align: 'center' as const,
        render: (val: string) => val || '-'
      },
      { 
        title: '波型', 
        dataIndex: 'bx', 
        width: 100,
        align: 'center' as const,
        render: (val: number) => {
          if (val === 1) return 'P波'
          if (val === 2) return 'S波'
          return val || '-'
        }
      },
      { 
        title: '隧道里程', 
        dataIndex: 'sdlcz', 
        width: 150,
        align: 'center' as const,
        render: (val: number) => val ? `${val}` : '-'
      },
      { 
        title: '速度 (m/s)', 
        dataIndex: 'bs', 
        width: 120,
        align: 'center' as const,
        render: (val: number) => val || '-'
      },
      { 
        title: 'Vp/Vs', 
        dataIndex: 'vps', 
        width: 100,
        align: 'center' as const,
        render: (val: number) => val ? val.toFixed(2) : '-'
      },
      { 
        title: '泊松比', 
        dataIndex: 'bsb', 
        width: 100,
        align: 'center' as const,
        render: (val: number) => val ? val.toFixed(1) : '-'
      },
      { 
        title: '密度 (g/cm3)', 
        dataIndex: 'md', 
        width: 120,
        align: 'center' as const,
        render: (val: number) => val ? val.toFixed(2) : '-'
      },
    ]
    
    return (
      <div>
        {/* 标题 */}
        <div style={{ 
          textAlign: 'center', 
          fontSize: 16, 
          fontWeight: 600, 
          marginBottom: 24,
          padding: '16px 0',
          borderBottom: '2px solid #e5e6eb'
        }}>
          围岩岩体物理学参数表
        </div>
        
        {/* 表格 */}
        <Table
          columns={columns}
          data={detailData.tspBxdataVOList}
          rowKey={(record: any) => String(record.tspBxdataPk || record.id || Math.random())}
          pagination={false}
          border
          stripe
          style={{ marginBottom: 24 }}
        />
        
        {/* 底部签名区 */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-around',
          padding: '24px 0',
          borderTop: '1px solid #e5e6eb'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ marginBottom: 8, color: '#86909c', fontSize: 13 }}>检测：</div>
            <div style={{ fontWeight: 500 }}>{detailData.testname || '边嘉琪'}</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ marginBottom: 8, color: '#86909c', fontSize: 13 }}>复核：</div>
            <div style={{ fontWeight: 500 }}>{detailData.monitorname || '准永清'}</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ marginBottom: 8, color: '#86909c', fontSize: 13 }}>监理：</div>
            <div style={{ fontWeight: 500 }}>{detailData.supervisorname || '崔阳'}</div>
          </div>
        </div>
      </div>
    )
  }

  // 渲染地震波现场数据记录表
  const renderFieldData = () => {
    if (!detailData || !detailData.tspPddataVOList || detailData.tspPddataVOList.length === 0) {
      return (
        <div style={{ padding: 60, textAlign: 'center', color: '#86909c', backgroundColor: '#f7f8fa', borderRadius: 4 }}>
          <div style={{ fontSize: 14, marginBottom: 8 }}>暂无现场数据</div>
          <div style={{ fontSize: 12 }}>该预报记录未包含现场数据记录信息</div>
        </div>
      )
    }
    
    // 炮点参数表格列定义
    const paodianColumns = [
      { 
        title: '序号', 
        dataIndex: 'index', 
        width: 60,
        align: 'center' as const,
        render: (_: any, __: any, index: number) => index + 1 
      },
      { 
        title: '距离 (m)', 
        dataIndex: 'pdjl', 
        align: 'center' as const,
        render: (val: number) => val || '-'
      },
      { 
        title: '深度 (m)', 
        dataIndex: 'pdsd', 
        align: 'center' as const,
        render: (val: number) => val || '-'
      },
      { 
        title: '高度 (m)', 
        dataIndex: 'height', 
        align: 'center' as const,
        render: (val: number) => val || '-'
      },
      { 
        title: '方位角 (°)', 
        dataIndex: 'fwj', 
        align: 'center' as const,
        render: (val: number) => val || '-'
      },
      { 
        title: '倾角 (°)', 
        dataIndex: 'qj', 
        align: 'center' as const,
        render: (val: number) => val || '-'
      },
      { 
        title: '药量 (g)', 
        dataIndex: 'yl', 
        align: 'center' as const,
        render: (val: number) => val || '-'
      },
    ]
    
    return (
      <div>
        {/* 标题 */}
        <div style={{ 
          textAlign: 'center', 
          fontSize: 16, 
          fontWeight: 600, 
          padding: '20px 0',
          borderBottom: '1px solid #e5e6eb',
          marginBottom: 16
        }}>
          TSP现场数据记录表
        </div>
        
        {/* 顶部信息区 */}
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: '3fr 1fr',
          gap: 0,
          border: '1px solid #e5e6eb',
          marginBottom: 16
        }}>
          <div style={{ 
            padding: '12px 16px',
            borderRight: '1px solid #e5e6eb',
            display: 'flex',
            alignItems: 'center'
          }}>
            <span style={{ color: '#4e5969' }}>隧道名称：</span>
            <span style={{ fontWeight: 500 }}>{detailData.dkname || '-'}</span>
          </div>
          <div style={{ 
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end'
          }}>
            {detailData.monitordate ? detailData.monitordate.replace('T', ' ').substring(0, 19) : '-'}
          </div>
        </div>

        {/* 掌子面里程和炮孔布置 */}
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 0,
          border: '1px solid #e5e6eb',
          marginBottom: 16
        }}>
          <div style={{ 
            padding: '12px 16px',
            borderRight: '1px solid #e5e6eb',
            textAlign: 'center'
          }}>
            <div style={{ color: '#4e5969', marginBottom: 4 }}>掌子面里程</div>
            <div style={{ fontWeight: 500, fontSize: 15 }}>
              DK{detailData.dkilo || '-'}
            </div>
          </div>
          <div style={{ 
            padding: '12px 16px',
            textAlign: 'center'
          }}>
            <div style={{ color: '#4e5969', marginBottom: 4 }}>炮孔布置</div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 16 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <input type="radio" checked={detailData.kwwz === 1} readOnly />
                <span>左边墙</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <input type="radio" checked={detailData.kwwz === 2} readOnly />
                <span>右边墙</span>
              </label>
            </div>
          </div>
        </div>

        {/* 检波器信息表格 */}
        <div style={{ marginBottom: 16 }}>
          <table style={{ 
            width: '100%', 
            border: '1px solid #e5e6eb',
            borderCollapse: 'collapse'
          }}>
            <thead>
              <tr style={{ backgroundColor: '#f7f8fa' }}>
                <th rowSpan={2} style={{ 
                  border: '1px solid #e5e6eb', 
                  padding: '12px 8px',
                  textAlign: 'center',
                  width: '100px'
                }}>检波器</th>
                <th rowSpan={2} style={{ 
                  border: '1px solid #e5e6eb', 
                  padding: '12px 8px',
                  textAlign: 'center',
                  width: '150px'
                }}>里程</th>
                <th colSpan={3} style={{ 
                  border: '1px solid #e5e6eb', 
                  padding: '12px 8px',
                  textAlign: 'center'
                }}>距掌子面距离 (m)</th>
                <th rowSpan={2} style={{ 
                  border: '1px solid #e5e6eb', 
                  padding: '12px 8px',
                  textAlign: 'center',
                  width: '100px'
                }}>孔深 (m)</th>
                <th rowSpan={2} style={{ 
                  border: '1px solid #e5e6eb', 
                  padding: '12px 8px',
                  textAlign: 'center',
                  width: '100px'
                }}>倾角 (°)</th>
              </tr>
              <tr style={{ backgroundColor: '#f7f8fa' }}>
                <th style={{ border: '1px solid #e5e6eb', padding: '8px', textAlign: 'center' }}>距中线距离</th>
                <th style={{ border: '1px solid #e5e6eb', padding: '8px', textAlign: 'center' }}>距左侧距离</th>
                <th style={{ border: '1px solid #e5e6eb', padding: '8px', textAlign: 'center' }}>距地面距离</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td rowSpan={2} style={{ 
                  border: '1px solid #e5e6eb', 
                  padding: '8px',
                  textAlign: 'center',
                  fontWeight: 500
                }}>左</td>
                <td style={{ border: '1px solid #e5e6eb', padding: '8px', textAlign: 'center' }}>
                  DK{detailData.leftkilo || '-'}
                </td>
                <td style={{ border: '1px solid #e5e6eb', padding: '8px', textAlign: 'center' }}>
                  {detailData.leftjgdczjl || '-'}
                </td>
                <td style={{ border: '1px solid #e5e6eb', padding: '8px', textAlign: 'center' }}>
                  {detailData.leftzxjl || '-'}
                </td>
                <td style={{ border: '1px solid #e5e6eb', padding: '8px', textAlign: 'center' }}>
                  {detailData.leftjdmgd || '-'}
                </td>
                <td style={{ border: '1px solid #e5e6eb', padding: '8px', textAlign: 'center' }}>
                  {detailData.leftks || '-'}
                </td>
                <td style={{ border: '1px solid #e5e6eb', padding: '8px', textAlign: 'center' }}>
                  {detailData.leftqj || '-'}
                </td>
              </tr>
              <tr>
                <td style={{ border: '1px solid #e5e6eb', padding: '8px', textAlign: 'center' }}>
                  DK{detailData.rightkilo || '-'}
                </td>
                <td style={{ border: '1px solid #e5e6eb', padding: '8px', textAlign: 'center' }}>
                  {detailData.rightjgdczjl || '-'}
                </td>
                <td style={{ border: '1px solid #e5e6eb', padding: '8px', textAlign: 'center' }}>
                  {detailData.rightzxjl || '-'}
                </td>
                <td style={{ border: '1px solid #e5e6eb', padding: '8px', textAlign: 'center' }}>
                  {detailData.rightjdmgd || '-'}
                </td>
                <td style={{ border: '1px solid #e5e6eb', padding: '8px', textAlign: 'center' }}>
                  {detailData.rightks || '-'}
                </td>
                <td style={{ border: '1px solid #e5e6eb', padding: '8px', textAlign: 'center' }}>
                  {detailData.rightqj || '-'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 炮点参数标题 */}
        <div style={{ 
          padding: '12px 16px',
          backgroundColor: '#f7f8fa',
          border: '1px solid #e5e6eb',
          borderBottom: 'none',
          fontWeight: 500,
          textAlign: 'center'
        }}>
          炮点参数
        </div>
        
        {/* 炮点参数表格 */}
        <Table
          columns={paodianColumns}
          data={detailData.tspPddataVOList}
          rowKey={(record: any) => String(record.tspPddataPk || record.id || Math.random())}
          pagination={{
            pageSize: 10,
            showTotal: (total) => `共 ${total} 条`,
            simple: false
          }}
          border
          stripe
        />
      </div>
    )
  }

  const methodName = method ? METHOD_MAP[parseInt(method)] : '详情'

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
        <span>{methodName} - 详情页面</span>
        <Button 
          type="text" 
          icon={<IconLeft style={{ fontSize: 18 }} />} 
          style={{ color: '#1D2129' }}
          onClick={handleBack}
        />
      </div>

      <Card style={{ borderRadius: '0 0 4px 4px' }}>
        <Spin loading={loading} style={{ width: '100%' }}>
          <Tabs activeTab={activeTab} onChange={setActiveTab} type="line">
            <TabPane key="result" title="地震波预报结果">
              <div style={{ padding: '24px 0' }}>
                {renderBasicInfo()}
                {renderCharts()}
                {renderConclusionTable()}
                {renderSuggestion()}
                {renderFiles()}
                {renderSignature()}
              </div>
            </TabPane>
            
            <TabPane key="physics" title="围岩参数物理学参数表">
              <div style={{ padding: '24px 0' }}>
                {renderPhysicsParams()}
              </div>
            </TabPane>
            
            <TabPane key="field" title="地震波现场数据记录表">
              <div style={{ padding: '24px 0' }}>
                {renderFieldData()}
              </div>
            </TabPane>
          </Tabs>
        </Spin>
      </Card>
    </div>
  )
}

export default GeologyForecastDetailPage
