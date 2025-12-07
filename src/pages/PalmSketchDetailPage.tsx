import React, { useState, useEffect } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { Card, Button, Spin, Message, Pagination } from '@arco-design/web-react'
import { IconLeft } from '@arco-design/web-react/icon'
import apiAdapter from '../services/apiAdapter'

// 表格单元格样式
const cellStyle: React.CSSProperties = {
  padding: '8px 12px',
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

function PalmSketchDetailPage() {
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
        const detail = await apiAdapter.getPalmSketchDetail(id)
        if (detail) {
          setDetailData(detail)
          console.log('✅ 掌子面素描详情数据:', detail)
        } else {
          Message.error('获取详情数据失败')
        }
      } catch (error) {
        console.error('❌ 获取掌子面素描详情失败:', error)
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
    return riskMap[String(level)] || level || '-'
  }

  // 风险颜色
  const getRiskColor = (level: string | number) => {
    const colorMap: Record<string, string> = { '1': '#00b42a', '2': '#ff7d00', '3': '#f53f3f', '4': '#d91ad9' }
    return colorMap[String(level)] || '#52c41a'
  }

  // 渲染开挖位置示意图（根据图片中的样式）
  const renderExcavationDiagram = () => {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '10px 0' }}>
        <svg viewBox="0 0 80 70" style={{ width: 80, height: 70 }}>
          {/* 隧道轮廓 - 拱形 */}
          <path d="M5 60 Q5 15 40 8 Q75 15 75 60" fill="none" stroke="#999" strokeWidth="2"/>
          <line x1="5" y1="60" x2="75" y2="60" stroke="#999" strokeWidth="2"/>
          {/* 标记点1 - 拱顶 */}
          <circle cx="40" cy="12" r="10" fill="#165dff" stroke="#fff" strokeWidth="1"/>
          <text x="40" y="16" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="500">1</text>
          {/* 标记点2 - 左拱腰 */}
          <circle cx="15" cy="35" r="10" fill="#165dff" stroke="#fff" strokeWidth="1"/>
          <text x="15" y="39" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="500">2</text>
          {/* 标记点3 - 右拱腰 */}
          <circle cx="65" cy="35" r="10" fill="#165dff" stroke="#fff" strokeWidth="1"/>
          <text x="65" y="39" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="500">3</text>
        </svg>
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
              <th style={{ ...headerCellStyle, minWidth: 250 }}>探测结论</th>
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
                <td style={{ ...valueCellStyle, fontSize: 12, lineHeight: 1.5 }}>{item.jlresult || '-'}</td>
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
          掌子面土体预报结果
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
              <div style={{ textAlign: 'center', fontSize: 16, fontWeight: 600, marginBottom: 8 }}>
                掌子面素描预报结果
              </div>
              <div style={{ textAlign: 'right', marginBottom: 16, color: '#86909c', fontSize: 13 }}>
                预报时间: {detailData.monitordate ? detailData.monitordate.replace('T', ' ').substring(0, 19) : '-'}
              </div>

              {/* 主表格 - 严格按照图片布局 */}
              <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
                <colgroup>
                  <col style={{ width: '10%' }} />
                  <col style={{ width: '18%' }} />
                  <col style={{ width: '12%' }} />
                  <col style={{ width: '18%' }} />
                  <col style={{ width: '12%' }} />
                  <col style={{ width: '18%' }} />
                  <col style={{ width: '12%' }} />
                </colgroup>
                <tbody>
                  {/* 第一行：工程名称 */}
                  <tr>
                    <td style={headerCellStyle} rowSpan={2}>工程名称</td>
                    <td style={valueCellStyle} rowSpan={2}>{detailData.sitename || `${detailData.dkname}大庆山隧道明洞` || '-'}</td>
                    <td style={headerCellStyle}>施工里程</td>
                    <td style={valueCellStyle}>{detailData.dkname}+{detailData.dkilo || ''}</td>
                    <td style={headerCellStyle} rowSpan={2}>评定</td>
                    <td style={valueCellStyle} rowSpan={2} colSpan={2}>--</td>
                  </tr>
                  <tr>
                    <td style={headerCellStyle}>距洞口距离</td>
                    <td style={valueCellStyle}>{detailData.jdkjl || '-'}</td>
                  </tr>

                  {/* 基础信息 */}
                  <tr>
                    <td style={headerCellStyle} rowSpan={2}>基础信息</td>
                    <td style={valueCellStyle}>开挖宽度: {detailData.kwkd || '-'}</td>
                    <td style={valueCellStyle}>开挖高度: {detailData.kwgd || '-'}</td>
                    <td style={valueCellStyle}>开挖面积: {detailData.kwmj || '-'}</td>
                    <td style={headerCellStyle} rowSpan={2}>本次素描部位</td>
                    <td style={valueCellStyle} rowSpan={2} colSpan={2}>{renderExcavationDiagram()}</td>
                  </tr>
                  <tr>
                    <td style={valueCellStyle}>掌子面状态: {detailData.zzmzt || '稳定'}</td>
                    <td style={valueCellStyle} colSpan={2}>开挖方式: {detailData.kwfs || '-'}</td>
                  </tr>

                  {/* 土体信息 */}
                  <tr>
                    <td style={headerCellStyle} rowSpan={3}>土体信息</td>
                    <td style={valueCellStyle} colSpan={2}>土的名称: {detailData.tmc || '粘性土'}</td>
                    <td style={valueCellStyle} colSpan={2}>地质年代: {detailData.dznd || '-'}</td>
                    <td style={valueCellStyle} colSpan={2}>--</td>
                  </tr>
                  <tr>
                    <td style={valueCellStyle}>地质成因: {detailData.cy || '-'}</td>
                    <td style={valueCellStyle} colSpan={3}>其他: {detailData.tttz || '-'}</td>
                    <td style={valueCellStyle} colSpan={2}>--</td>
                  </tr>
                  <tr>
                    <td style={valueCellStyle}>湿度: {detailData.sd || '-'}</td>
                    <td style={valueCellStyle} colSpan={3}>密实度: {detailData.msd || '-'}</td>
                    <td style={valueCellStyle} colSpan={2}>--</td>
                  </tr>

                  {/* 物理力学指标 */}
                  <tr>
                    <td style={headerCellStyle} rowSpan={2}>物理力学指标</td>
                    <td style={valueCellStyle} colSpan={2}>密度(或天然重度): {detailData.md || '-'}</td>
                    <td style={valueCellStyle} colSpan={2}>含水量: {detailData.hsl || '-'}</td>
                    <td style={valueCellStyle} colSpan={2}>--</td>
                  </tr>
                  <tr>
                    <td style={valueCellStyle} colSpan={2}>压缩模量: {detailData.ysml || '-'}</td>
                    <td style={valueCellStyle} colSpan={2}>纵波波速: {detailData.zbbs || '-'}</td>
                    <td style={valueCellStyle} colSpan={2}>--</td>
                  </tr>

                  {/* 围岩基本分级 */}
                  <tr>
                    <td style={headerCellStyle}>围岩基本分级</td>
                    <td style={{ ...valueCellStyle, textAlign: 'center', fontWeight: 600, fontSize: 15 }} colSpan={6}>
                      {getRockGradeText(detailData.basicwylevel)}
                    </td>
                  </tr>

                  {/* 地下水状态 */}
                  <tr>
                    <td style={headerCellStyle}>地下水状态</td>
                    <td style={valueCellStyle} colSpan={2}>渗水量[L/(min.10m)]: {detailData.ssl || '-'}</td>
                    <td style={{ ...valueCellStyle, textAlign: 'center' }}>{detailData.dxspd || '1'}</td>
                    <td style={valueCellStyle} colSpan={3}>{detailData.dxszt || '潮湿或点滴状出水'}</td>
                  </tr>

                  {/* 初始地应力状态 */}
                  <tr>
                    <td style={headerCellStyle}>初始地应力状态</td>
                    <td style={valueCellStyle}>埋深H={detailData.ms || '0'}</td>
                    <td style={valueCellStyle} colSpan={2}>评估基准Rc/σmax{detailData.pgjz || '1'}</td>
                    <td style={valueCellStyle}>其他: {detailData.csdylqt || '一般地应力'}</td>
                    <td style={valueCellStyle} colSpan={2}>{detailData.csdylpd || '一般地应力'}</td>
                  </tr>

                  {/* 地质构造应力状态 */}
                  <tr>
                    <td style={headerCellStyle} colSpan={2}>地质构造应力状态: {detailData.dzgzyl || '一般地应力'}</td>
                    <td style={valueCellStyle} colSpan={5}>其他: {detailData.dzgzylqt || '一般地应力'}</td>
                  </tr>

                  {/* 修正后围岩等级 */}
                  <tr>
                    <td style={headerCellStyle}>修正后围岩等级</td>
                    <td style={{ ...valueCellStyle, textAlign: 'center', fontWeight: 600, fontSize: 15 }} colSpan={6}>
                      {getRockGradeText(detailData.fixwylevel)}
                    </td>
                  </tr>

                  {/* 结论 */}
                  <tr>
                    <td style={headerCellStyle}>结论</td>
                    <td style={{ ...valueCellStyle, padding: 0 }} colSpan={6}>
                      {renderConclusionTable()}
                    </td>
                  </tr>

                  {/* 开挖工作面 */}
                  <tr>
                    <td style={headerCellStyle} rowSpan={2}>开挖工作面</td>
                    <td style={{ ...headerCellStyle, width: 'auto' }}>素描图</td>
                    <td style={valueCellStyle} colSpan={2}>
                      {detailData.images ? (
                        <img 
                          src={`/api/v1/file/${siteId || detailData.siteId}/zzmsm/${detailData.ybPk || id}/${detailData.images}`} 
                          alt="素描图" 
                          style={{ maxWidth: '100%', maxHeight: 120 }}
                          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                        />
                      ) : <span style={{ color: '#86909c' }}>暂无图片</span>}
                    </td>
                    <td style={{ ...headerCellStyle, width: 'auto' }}>现场照片</td>
                    <td style={valueCellStyle} colSpan={2}>
                      {detailData.photo ? (
                        <img 
                          src={`/api/v1/file/${siteId || detailData.siteId}/zzmsm/${detailData.ybPk || id}/${detailData.photo}`} 
                          alt="现场照片" 
                          style={{ maxWidth: '100%', maxHeight: 120 }}
                          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                        />
                      ) : <span style={{ color: '#86909c' }}>暂无照片</span>}
                    </td>
                  </tr>
                  <tr>
                    <td style={headerCellStyle}>地质简要描述</td>
                    <td style={{ ...valueCellStyle, lineHeight: 1.6 }} colSpan={5}>{detailData.zzmms || '-'}</td>
                  </tr>

                  {/* 后续建议 */}
                  <tr>
                    <td style={headerCellStyle}>后续建议</td>
                    <td style={{ ...valueCellStyle, lineHeight: 1.6 }} colSpan={6}>{detailData.suggestion || '-'}</td>
                  </tr>

                  {/* 签名行 */}
                  <tr>
                    <td style={valueCellStyle} colSpan={2}>检测: {detailData.testname || '-'}</td>
                    <td style={valueCellStyle} colSpan={3}>复核: {detailData.monitorname || '-'}</td>
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

export default PalmSketchDetailPage
