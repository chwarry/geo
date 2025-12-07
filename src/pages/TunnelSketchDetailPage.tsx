import React, { useState, useEffect } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { Card, Button, Spin, Message, Pagination } from '@arco-design/web-react'
import { IconLeft } from '@arco-design/web-react/icon'
import apiAdapter from '../services/apiAdapter'

// 表格单元格样式
const cellStyle: React.CSSProperties = {
  padding: '10px 12px',
  border: '1px solid #e5e6eb',
  fontSize: 13,
  verticalAlign: 'middle',
  lineHeight: 1.6
}

const headerCellStyle: React.CSSProperties = {
  ...cellStyle,
  backgroundColor: '#fafafa',
  fontWeight: 500,
  color: '#1d2129',
  textAlign: 'center',
  width: 100
}

const valueCellStyle: React.CSSProperties = {
  ...cellStyle,
  color: '#4e5969'
}

const subHeaderStyle: React.CSSProperties = {
  ...cellStyle,
  backgroundColor: '#fafafa',
  fontWeight: 500,
  color: '#1d2129',
  textAlign: 'center',
  width: 80
}

function TunnelSketchDetailPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [searchParams] = useSearchParams()
  
  const siteId = searchParams.get('siteId')
  
  const [loading, setLoading] = useState(false)
  const [detailData, setDetailData] = useState<any>(null)
  const [conclusionPage, setConclusionPage] = useState(1)

  useEffect(() => {
    const fetchDetail = async () => {
      if (!id) return
      
      setLoading(true)
      try {
        const detail = await apiAdapter.getTunnelSketchDetail(id)
        if (detail) {
          setDetailData(detail)
          console.log('✅ 洞身素描详情数据:', detail)
        } else {
          Message.error('获取详情数据失败')
        }
      } catch (error) {
        console.error('❌ 获取洞身素描详情失败:', error)
        Message.error('获取详情数据失败')
      } finally {
        setLoading(false)
      }
    }
    
    fetchDetail()
  }, [id])

  const handleBack = () => {
    if (siteId) {
      navigate(`/forecast/geology/${siteId}`)
    } else {
      navigate(-1)
    }
  }

  // 围岩等级转换
  const getRockGradeText = (level: number) => {
    const gradeMap: Record<number, string> = { 1: 'Ⅰ', 2: 'Ⅱ', 3: 'Ⅲ', 4: 'Ⅳ', 5: 'Ⅴ', 6: 'Ⅵ' }
    return gradeMap[level] || level || '-'
  }

  // 风险类别转换
  const getRiskText = (level: string | number) => {
    const riskMap: Record<string, string> = { '1': '低风险', '2': '中风险', '3': '高风险', '4': '极高风险' }
    return riskMap[String(level)] || level || '其他'
  }

  // 风险颜色
  const getRiskColor = (level: string | number) => {
    const colorMap: Record<string, string> = { '1': '#00b42a', '2': '#ff7d00', '3': '#f53f3f', '4': '#d91ad9' }
    return colorMap[String(level)] || '#f53f3f'
  }

  // 渲染图片 - 检查是否为有效文件名
  const renderImage = (imageId: string | undefined, alt: string) => {
    // 如果值为空、为"1"或其他无效值，显示暂无图片
    if (!imageId || imageId === '1') {
      return (
        <div style={{ 
          padding: '30px 20px', 
          textAlign: 'center', 
          color: '#86909c',
          backgroundColor: '#f7f8fa',
          minHeight: 120,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          暂无图片
        </div>
      )
    }
    const imgUrl = `/api/v1/file/${siteId || detailData?.siteId}/dssm/${detailData?.ybPk || id}/${imageId}`
    return (
      <div style={{ padding: '10px', textAlign: 'center' }}>
        <img 
          src={imgUrl} 
          alt={alt}
          style={{ maxWidth: '100%', maxHeight: 150 }}
          onError={(e) => { 
            (e.target as HTMLImageElement).style.display = 'none'
            const parent = (e.target as HTMLImageElement).parentElement
            if (parent) {
              parent.innerHTML = '<div style="padding: 20px; text-align: center; color: #86909c;">图片加载失败</div>'
            }
          }}
        />
      </div>
    )
  }

  // 渲染结论表格
  const renderConclusionTable = () => {
    const ybjgList = detailData?.ybjgVOList || []
    if (ybjgList.length === 0) {
      return <div style={{ padding: 16, textAlign: 'center', color: '#86909c' }}>暂无结论数据</div>
    }

    const pageSize = 5
    const total = ybjgList.length
    const startIdx = (conclusionPage - 1) * pageSize
    const currentData = ybjgList.slice(startIdx, startIdx + pageSize)

    return (
      <div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ ...headerCellStyle, width: 50 }}>序号</th>
              <th style={{ ...headerCellStyle, width: 140 }}>里程范围</th>
              <th style={{ ...headerCellStyle, width: 60 }}>长度</th>
              <th style={{ ...headerCellStyle, minWidth: 200 }}>探测结论</th>
              <th style={{ ...headerCellStyle, width: 80 }}>风险类别</th>
              <th style={{ ...headerCellStyle, width: 100 }}>地质风险等级</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((item: any, index: number) => (
              <tr key={item.ybjgPk || index}>
                <td style={{ ...valueCellStyle, textAlign: 'center' }}>{startIdx + index + 1}</td>
                <td style={{ ...valueCellStyle, fontSize: 12 }}>
                  <div>起{item.dkname}+{item.sdkilo}</div>
                  <div>止{item.dkname}+{item.edkilo}</div>
                </td>
                <td style={{ ...valueCellStyle, textAlign: 'center' }}>
                  {item.sdkilo && item.edkilo ? Math.abs(item.sdkilo - item.edkilo) : 0}
                </td>
                <td style={{ ...valueCellStyle, fontSize: 12 }}>{item.jlresult || '文字描述'}</td>
                <td style={{ ...valueCellStyle, textAlign: 'center' }}>{getRiskText(item.risklevel)}</td>
                <td style={{ ...valueCellStyle, textAlign: 'center' }}>
                  <div style={{
                    width: 16, height: 16,
                    backgroundColor: getRiskColor(item.risklevel),
                    display: 'inline-block',
                    borderRadius: 2
                  }} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {total > pageSize && (
          <div style={{ marginTop: 8, textAlign: 'right' }}>
            <Pagination
              current={conclusionPage}
              pageSize={pageSize}
              total={total}
              onChange={setConclusionPage}
              size="small"
              showTotal
            />
          </div>
        )}
      </div>
    )
  }

  return (
    <div style={{ padding: '20px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      {/* 顶部Tab */}
      <div style={{
        backgroundColor: '#fff',
        padding: '0 20px',
        marginBottom: 16,
        borderRadius: 4,
        borderBottom: '1px solid #e5e6eb'
      }}>
        <div style={{ 
          display: 'inline-block',
          padding: '12px 0',
          color: '#165dff', 
          borderBottom: '2px solid #165dff',
          fontSize: 14,
          fontWeight: 500
        }}>
          洞身素描预报结果
        </div>
        <Button 
          type="text" 
          icon={<IconLeft />} 
          style={{ float: 'right', marginTop: 8 }}
          onClick={handleBack}
        >
          返回
        </Button>
      </div>

      <Card style={{ borderRadius: 4 }} bodyStyle={{ padding: 20 }}>
        <Spin loading={loading} style={{ width: '100%' }}>
          {detailData && (
            <div>
              {/* 标题 */}
              <div style={{ textAlign: 'center', fontSize: 16, fontWeight: 600, marginBottom: 16 }}>
                洞身素描预报结果
              </div>

              {/* 主表格 */}
              <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
                <colgroup>
                  <col style={{ width: '10%' }} />
                  <col style={{ width: '10%' }} />
                  <col style={{ width: '30%' }} />
                  <col style={{ width: '10%' }} />
                  <col style={{ width: '40%' }} />
                </colgroup>
                <tbody>
                  {/* 工程名称行 */}
                  <tr>
                    <td style={headerCellStyle} colSpan={2}>工程名称</td>
                    <td style={valueCellStyle}>{detailData.sitename || `${detailData.dkname}大庆山隧道明洞` || '-'}</td>
                    <td style={headerCellStyle}>预报时间</td>
                    <td style={valueCellStyle}>
                      {detailData.monitordate ? detailData.monitordate.replace('T', ' ').substring(0, 19) : '-'}
                    </td>
                  </tr>

                  {/* 展示图 - 左边墙 */}
                  <tr>
                    <td style={headerCellStyle} rowSpan={4}>展示图</td>
                    <td style={subHeaderStyle}>左边墙</td>
                    <td style={valueCellStyle} colSpan={3}>
                      {renderImage(detailData.zbqsmt, '左边墙素描图')}
                    </td>
                  </tr>
                  {/* 展示图 - 拱部 */}
                  <tr>
                    <td style={subHeaderStyle}>拱部</td>
                    <td style={valueCellStyle} colSpan={3}>
                      {renderImage(detailData.gbsmt, '拱部素描图')}
                    </td>
                  </tr>
                  {/* 展示图 - 右边墙 */}
                  <tr>
                    <td style={subHeaderStyle}>右边墙</td>
                    <td style={valueCellStyle} colSpan={3}>
                      {renderImage(detailData.ybqsmt, '右边墙素描图')}
                    </td>
                  </tr>
                  {/* 展示图 - 右边墙（图片中显示有两个右边墙行） */}
                  <tr>
                    <td style={subHeaderStyle}>右边墙</td>
                    <td style={valueCellStyle} colSpan={3}>
                      {renderImage(detailData.ybqxct, '右边墙现场图')}
                    </td>
                  </tr>

                  {/* 里程 */}
                  <tr>
                    <td style={headerCellStyle} colSpan={2}>里程</td>
                    <td style={{ ...valueCellStyle, textAlign: 'center' }} colSpan={3}>
                      {detailData.dkname}+{detailData.dkilo || ''}
                    </td>
                  </tr>

                  {/* 设计工程地质、水文地质情况 */}
                  <tr>
                    <td style={headerCellStyle} colSpan={2}>设计工程地质、水文地质情况</td>
                    <td style={valueCellStyle} colSpan={3}>{detailData.sjdzms || '文字描述'}</td>
                  </tr>

                  {/* 设计围岩等级 */}
                  <tr>
                    <td style={headerCellStyle} colSpan={2}>设计围岩等级</td>
                    <td style={{ ...valueCellStyle, textAlign: 'center', fontWeight: 600 }} colSpan={3}>
                      {getRockGradeText(detailData.sjwydj)}
                    </td>
                  </tr>

                  {/* 施工围岩等级 */}
                  <tr>
                    <td style={headerCellStyle} colSpan={2}>施工围岩等级</td>
                    <td style={{ ...valueCellStyle, textAlign: 'center', fontWeight: 600 }} colSpan={3}>
                      {getRockGradeText(detailData.sgwydj)}
                    </td>
                  </tr>

                  {/* 施工揭示 - 地层岩性特征 */}
                  <tr>
                    <td style={headerCellStyle} rowSpan={3}>施工揭示</td>
                    <td style={subHeaderStyle}>地层岩性特征</td>
                    <td style={valueCellStyle} colSpan={3}>{detailData.sgdztz || '文字描述'}</td>
                  </tr>
                  {/* 施工揭示 - 构造特征 */}
                  <tr>
                    <td style={subHeaderStyle}>构造特征</td>
                    <td style={valueCellStyle} colSpan={3}>{detailData.sggztz || '文字描述'}</td>
                  </tr>
                  {/* 施工揭示 - 水文地质特征 */}
                  <tr>
                    <td style={subHeaderStyle}>水文地质特征</td>
                    <td style={valueCellStyle} colSpan={3}>{detailData.shswtz || '文字描述'}</td>
                  </tr>

                  {/* 现场照片标题 */}
                  <tr>
                    <td style={{ ...headerCellStyle, textAlign: 'center' }} colSpan={5}>现场照片</td>
                  </tr>

                  {/* 现场照片 - 标题行 */}
                  <tr>
                    <td style={subHeaderStyle} colSpan={1}>左边墙</td>
                    <td style={subHeaderStyle} colSpan={2}>拱部</td>
                    <td style={subHeaderStyle} colSpan={2}>右边墙</td>
                  </tr>

                  {/* 现场照片 - 图片行 */}
                  <tr>
                    <td style={valueCellStyle} colSpan={1}>
                      {renderImage(detailData.zbqxct, '左边墙现场图')}
                    </td>
                    <td style={valueCellStyle} colSpan={2}>
                      {renderImage(detailData.gbxct, '拱部现场图')}
                    </td>
                    <td style={valueCellStyle} colSpan={2}>
                      {renderImage(detailData.ybqxct, '右边墙现场图')}
                    </td>
                  </tr>

                  {/* 结论 */}
                  <tr>
                    <td style={headerCellStyle} colSpan={2}>结论</td>
                    <td style={{ ...valueCellStyle, padding: 0 }} colSpan={3}>
                      {renderConclusionTable()}
                    </td>
                  </tr>

                  {/* 后续建议 */}
                  <tr>
                    <td style={headerCellStyle} colSpan={2}>后续建议</td>
                    <td style={valueCellStyle} colSpan={3}>{detailData.suggestion || '文字描述'}</td>
                  </tr>

                  {/* 签名行 */}
                  <tr>
                    <td style={valueCellStyle} colSpan={2}>检测: {detailData.testname || '-'}</td>
                    <td style={valueCellStyle}>复核: {detailData.monitorname || '-'}</td>
                    <td style={valueCellStyle} colSpan={2}>监理: {detailData.supervisorname || '-'}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </Spin>
      </Card>
    </div>
  )
}

export default TunnelSketchDetailPage
