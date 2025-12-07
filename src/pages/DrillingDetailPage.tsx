import React, { useState, useEffect } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import {
  Card,
  Button,
  Spin,
  Message,
  Table,
  Image
} from '@arco-design/web-react'
import { IconLeft } from '@arco-design/web-react/icon'
import apiAdapter from '../services/apiAdapter'

function DrillingDetailPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [searchParams] = useSearchParams()
  
  const method = searchParams.get('method')
  const siteId = searchParams.get('siteId')
  
  const [loading, setLoading] = useState(false)
  const [detailData, setDetailData] = useState<any>(null)

  // 获取详情数据
  useEffect(() => {
    const fetchDetail = async () => {
      if (!id) return
      
      setLoading(true)
      try {
        const detail = await apiAdapter.getDrillingDetail(id, method)
        
        if (detail) {
          setDetailData(detail)
          console.log('✅ 钻探法详情数据加载成功:', detail)
        } else {
          Message.error('获取详情数据失败')
        }
      } catch (error) {
        console.error('❌ 获取钻探法详情失败:', error)
        Message.error('获取详情数据失败')
      } finally {
        setLoading(false)
      }
    }
    
    fetchDetail()
  }, [id, method])

  const handleBack = () => {
    if (siteId) {
      navigate(`/forecast/geology/${siteId}`)
    } else {
      navigate(-1)
    }
  }

  // 渲染钻孔数据表格
  const renderDrillingTable = () => {
    if (!detailData) return null
    
    // 根据 method 判断是加深炮孔还是超前水平钻
    const isJspk = method === '14' // 加深炮孔
    // 实际字段名：cqspzZkzzVOList (超前水平钻) 和 jspkZkzzVOList (加深炮孔)
    const dataList = isJspk ? detailData.jspkZkzzVOList : detailData.cqspzZkzzVOList
    
    console.log('🔍 钻孔数据:', { 
      isJspk, 
      method, 
      dataList, 
      dataListLength: dataList?.length
    })
    
    if (!dataList || dataList.length === 0) {
      return (
        <div style={{ padding: 40, textAlign: 'center', color: '#86909c' }}>
          <div style={{ marginBottom: 8 }}>暂无钻孔数据</div>
          <div style={{ fontSize: 12 }}>该预报记录未包含钻孔信息</div>
        </div>
      )
    }
    
    // 根据不同类型使用不同的列定义
    const columns = isJspk ? [
      // 加深炮孔的列
      {
        title: '编号',
        dataIndex: 'index',
        width: 80,
        align: 'center' as const,
        render: (_: any, __: any, index: number) => index
      },
      {
        title: '钻孔位置',
        dataIndex: 'zkwz',
        width: 150,
        align: 'center' as const,
        render: (val: string) => val || '-'
      },
      {
        title: '外插角',
        dataIndex: 'wcj',
        width: 100,
        align: 'center' as const,
        render: (val: number) => val || '-'
      },
      {
        title: '钻孔长度',
        dataIndex: 'zkcd',
        width: 100,
        align: 'center' as const,
        render: (val: number) => val || '-'
      },
      {
        title: '钻进特征及地质情况描述',
        dataIndex: 'dzqkjs',
        ellipsis: true,
        render: (val: string) => val || '-'
      },
      {
        title: '操作',
        width: 80,
        align: 'center' as const,
        render: () => '-'
      }
    ] : [
      // 超前水平钻的列
      {
        title: '编号',
        dataIndex: 'index',
        width: 80,
        align: 'center' as const,
        render: (_: any, __: any, index: number) => index
      },
      {
        title: '钻孔位置',
        dataIndex: 'kwbh',
        width: 150,
        align: 'center' as const,
        render: (val: string) => val || '-'
      },
      {
        title: '外插角',
        dataIndex: 'kwpjangle',
        width: 100,
        align: 'center' as const,
        render: (val: number) => val || '-'
      },
      {
        title: '钻孔长度',
        dataIndex: 'jgdjl',
        width: 100,
        align: 'center' as const,
        render: (val: number) => val || '-'
      },
      {
        title: '钻进特征及地质情况描述',
        dataIndex: 'zjcode',
        ellipsis: true,
        render: (val: string) => val || '-'
      },
      {
        title: '操作',
        width: 80,
        align: 'center' as const,
        render: () => '-'
      }
    ]
    
    return (
      <Table
        columns={columns}
        data={dataList}
        rowKey={(record: any) => String(record.jspkZkzzPk || record.cqspzZkzzPk || Math.random())}
        pagination={false}
        border
        stripe
      />
    )
  }

  // 渲染钻孔布置示意图
  const renderLayoutDiagram = () => {
    // images 字段可能包含图片路径
    const imageUrl = detailData?.images
    
    if (!imageUrl) {
      return (
        <div style={{ 
          padding: 60, 
          textAlign: 'center', 
          color: '#86909c',
          backgroundColor: '#f7f8fa',
          borderRadius: 4,
          border: '1px dashed #e5e6eb'
        }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>📷</div>
          <div style={{ fontSize: 14, color: '#4e5969', marginBottom: 8 }}>暂无钻孔布置示意图</div>
          <div style={{ fontSize: 12 }}>该预报记录未上传示意图</div>
        </div>
      )
    }
    
    // 处理图片 URL（可能需要添加服务器地址）
    let fullImageUrl = imageUrl
    if (imageUrl && !imageUrl.startsWith('http')) {
      const siteIdParam = detailData.siteId || siteId || ''
      const ybPkParam = detailData.ybPk || id || ''
      const fileType = method === '14' ? 'jspk' : 'cqspz'
      fullImageUrl = `/api/v1/file/${siteIdParam}/${fileType}/${ybPkParam}/${imageUrl}`
    }
    
    return (
      <div style={{ textAlign: 'center', padding: 16, backgroundColor: '#fff' }}>
        <img
          src={fullImageUrl}
          alt="钻孔布置示意图"
          style={{ maxWidth: '100%', maxHeight: 400, display: 'block', margin: '0 auto' }}
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.style.display = 'none'
            const parent = target.parentElement
            if (parent) {
              parent.innerHTML = `
                <div style="padding: 60px 20px; text-align: center; background-color: #f7f8fa; border-radius: 4px; border: 1px dashed #e5e6eb;">
                  <div style="font-size: 32px; margin-bottom: 12px;">📷</div>
                  <div style="font-size: 14px; color: #4e5969; margin-bottom: 8px;">图片暂时无法显示</div>
                  <div style="font-size: 12px; color: #86909c;">图片文件可能未上传或权限受限</div>
                </div>
              `
            }
          }}
        />
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
        align: 'center' as const,
        render: (_: any, record: any) => {
          const rec = record as any
          if (rec.sdkilo && rec.edkilo) {
            return `起DK${rec.sdkilo}\n止DK${rec.edkilo}`
          }
          return rec.lcfw || '-'
        }
      },
      {
        title: '长度',
        dataIndex: 'length',
        width: 100,
        align: 'center' as const,
        render: (_: any, record: any) => {
          const rec = record as any
          if (rec.sdkilo && rec.edkilo) {
            return (rec.edkilo - rec.sdkilo).toFixed(0)
          }
          return rec.length || '-'
        }
      },
      {
        title: '拆测结论',
        dataIndex: 'jlresult',
        ellipsis: true,
        render: (val: string) => val || '-'
      },
      {
        title: '风险类别',
        dataIndex: 'risklevel',
        width: 120,
        align: 'center' as const,
        render: (val: string) => val || '-'
      },
      {
        title: '地质风险等级',
        dataIndex: 'wylevel',
        width: 120,
        align: 'center' as const,
        render: (val: string) => {
          // 根据风险等级显示不同颜色
          const colorMap: Record<string, string> = {
            '破碎带': '#52c41a',
            '高风险': '#f53f3f',
            '中风险': '#ff7d00',
            '低风险': '#00b42a',
          }
          return (
            <div style={{ 
              display: 'inline-block',
              width: 20,
              height: 20,
              backgroundColor: colorMap[val] || '#52c41a',
              borderRadius: 2
            }} />
          )
        }
      },
    ]
    
    return (
      <div style={{ marginTop: 24 }}>
        <div style={{ 
          padding: '12px 16px',
          backgroundColor: '#f7f8fa',
          fontWeight: 500,
          marginBottom: -1
        }}>
          结论
        </div>
        <Table
          columns={columns}
          data={detailData.ybjgVOList}
          rowKey={(record: any) => String(record.ybjgPk || record.id || Math.random())}
          pagination={false}
          border
          stripe
        />
      </div>
    )
  }

  const methodName = method === '14' ? '加深炮孔' : method === '13' ? '超前水平钻' : '钻探法'

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
          {detailData && (
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
                {methodName}预报结果
              </div>
              
              {/* 顶部信息区 */}
              <div style={{ 
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
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
                  <span style={{ color: '#4e5969' }}>工程名称</span>
                  <span style={{ fontWeight: 500, marginLeft: 16 }}>{detailData.dkname || '-'}</span>
                </div>
                <div style={{ 
                  padding: '12px 16px',
                  borderRight: '1px solid #e5e6eb',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <span style={{ color: '#4e5969' }}>掌子面里程</span>
                  <span style={{ fontWeight: 500, marginLeft: 16 }}>DK{detailData.dkilo || '-'}</span>
                </div>
                <div style={{ 
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <span style={{ color: '#4e5969' }}>预报时间</span>
                  <span style={{ fontWeight: 500, marginLeft: 16 }}>
                    {detailData.monitordate ? detailData.monitordate.replace('T', ' ').substring(0, 19) : '-'}
                  </span>
                </div>
              </div>

              {/* 钻孔数据表格 */}
              {renderDrillingTable()}

              {/* 钻孔布置示意图 */}
              <div style={{ marginTop: 24 }}>
                <div style={{ 
                  padding: '12px 16px',
                  backgroundColor: '#f7f8fa',
                  fontWeight: 500,
                  marginBottom: 16
                }}>
                  钻孔布置示意图
                </div>
                {renderLayoutDiagram()}
              </div>

              {/* 结论表格 */}
              {renderConclusionTable()}
            </div>
          )}
        </Spin>
      </Card>
    </div>
  )
}

export default DrillingDetailPage
