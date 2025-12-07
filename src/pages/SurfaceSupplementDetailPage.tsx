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
  width: 120
}

const valueCellStyle: React.CSSProperties = {
  ...cellStyle,
  color: '#4e5969'
}

function SurfaceSupplementDetailPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [searchParams] = useSearchParams()
  
  const siteId = searchParams.get('siteId')
  
  const [loading, setLoading] = useState(false)
  const [detailData, setDetailData] = useState<any>(null)
  const [conclusionPage, setConclusionPage] = useState(1)

  useEffect(() => {
    const fetchDetail = async () => {
      if (!id) {
        console.warn('⚠️ 地表补充详情: 缺少ID参数')
        return
      }
      
      console.log('🔍 [地表补充详情] 开始获取数据, id:', id, 'siteId:', siteId)
      
      setLoading(true)
      try {
        const detail = await apiAdapter.getSurfaceSupplementInfo(id)
        console.log('🔍 [地表补充详情] API返回:', detail)
        
        if (detail) {
          setDetailData(detail)
          console.log('✅ 地表补充详情数据:', detail)
        } else {
          console.warn('⚠️ 地表补充详情: API返回空数据')
          Message.warning('暂无详情数据')
        }
      } catch (error) {
        console.error('❌ 获取地表补充详情失败:', error)
        Message.error('获取详情数据失败')
      } finally {
        setLoading(false)
      }
    }
    
    fetchDetail()
  }, [id, siteId])

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
    return colorMap[String(level)] || '#00b42a'
  }

  // 与设计情况是否相符
  const getSjqkText = (val: number) => {
    const map: Record<number, string> = { 1: '相符', 2: '不相符' }
    return map[val] || '-'
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
                  <div>起{item.dkname || 'X2DK'}+{item.sdkilo}</div>
                  <div>止{item.dkname || 'X2DK'}+{item.edkilo}</div>
                </td>
                <td style={{ ...valueCellStyle, textAlign: 'center' }}>
                  {item.sdkilo && item.edkilo ? Math.abs(item.edkilo - item.sdkilo) : 0}
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
          地表信息预报结果
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
                地表补充调查预报结果
              </div>

              {/* 主表格 */}
              <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
                <colgroup>
                  <col style={{ width: '15%' }} />
                  <col style={{ width: '35%' }} />
                  <col style={{ width: '15%' }} />
                  <col style={{ width: '35%' }} />
                </colgroup>
                <tbody>
                  {/* 工程名称 & 预报时间 */}
                  <tr>
                    <td style={headerCellStyle}>工程名称</td>
                    <td style={valueCellStyle}>{detailData.sitename || `${detailData.dkname || 'DK'}713+920大庆山隧道明洞` || '-'}</td>
                    <td style={headerCellStyle}>预报时间</td>
                    <td style={valueCellStyle}>
                      {detailData.monitordate ? detailData.monitordate.replace('T', ' ').substring(0, 19) : '-'}
                    </td>
                  </tr>

                  {/* 起始里程 & 终止里程 */}
                  <tr>
                    <td style={headerCellStyle}>起始里程</td>
                    <td style={{ ...valueCellStyle, textAlign: 'center' }}>
                      {detailData.dkname || 'DK'}+{detailData.beginkilo || detailData.dkilo || ''}
                    </td>
                    <td style={headerCellStyle}>终止里程</td>
                    <td style={{ ...valueCellStyle, textAlign: 'center' }}>
                      {detailData.dkname || 'DK'}+{detailData.dkilo ? (detailData.dkilo + (detailData.dbbcLength || 0)) : ''}
                    </td>
                  </tr>

                  {/* 设计围岩等级 & 本次预报长度 */}
                  <tr>
                    <td style={headerCellStyle}>设计围岩等级</td>
                    <td style={{ ...valueCellStyle, textAlign: 'center', fontWeight: 600 }}>
                      {getRockGradeText(detailData.sjwydj)}
                    </td>
                    <td style={headerCellStyle}>本次预报长度</td>
                    <td style={{ ...valueCellStyle, textAlign: 'center' }}>
                      {detailData.dbbcLength || detailData.ybLength || '-'}
                    </td>
                  </tr>

                  {/* 地层岩性描述 */}
                  <tr>
                    <td style={headerCellStyle}>地层岩性描述</td>
                    <td style={valueCellStyle} colSpan={3}>{detailData.dcyx || '文字描述（必填）'}</td>
                  </tr>

                  {/* 地表岩溶描述 */}
                  <tr>
                    <td style={headerCellStyle}>地表岩溶描述</td>
                    <td style={valueCellStyle} colSpan={3}>{detailData.dbry || '文字描述（必填）'}</td>
                  </tr>

                  {/* 特殊地质产状描述 */}
                  <tr>
                    <td style={headerCellStyle}>特殊地质产状描述</td>
                    <td style={valueCellStyle} colSpan={3}>{detailData.tsdz || '文字描述（必填）'}</td>
                  </tr>

                  {/* 人为坑道描述 */}
                  <tr>
                    <td style={headerCellStyle}>人为坑道描述</td>
                    <td style={valueCellStyle} colSpan={3}>{detailData.rwdk || '文字描述（必填）'}</td>
                  </tr>

                  {/* 附件 */}
                  <tr>
                    <td style={headerCellStyle}>附件</td>
                    <td style={valueCellStyle} colSpan={3}>
                      {detailData.addition && detailData.addition !== '1' ? (
                        <a 
                          href={`/api/v1/file/${siteId || detailData.siteId}/dbbc/${detailData.ybPk || id}/${detailData.addition}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: '#165dff' }}
                        >
                          文件下载
                        </a>
                      ) : (
                        <span style={{ color: '#86909c' }}>暂无附件</span>
                      )}
                    </td>
                  </tr>

                  {/* 与设计情况是否相符 */}
                  <tr>
                    <td style={headerCellStyle}>与设计情况是否相符</td>
                    <td style={{ ...valueCellStyle, textAlign: 'center' }} colSpan={3}>
                      {getSjqkText(detailData.sjqk)}
                    </td>
                  </tr>

                  {/* 地质评定 */}
                  <tr>
                    <td style={headerCellStyle}>地质评定</td>
                    <td style={valueCellStyle} colSpan={3}>{detailData.dzpj || '文字描述（必填）'}</td>
                  </tr>

                  {/* 结论 */}
                  <tr>
                    <td style={headerCellStyle}>结论</td>
                    <td style={{ ...valueCellStyle, padding: 0 }} colSpan={3}>
                      {renderConclusionTable()}
                    </td>
                  </tr>

                  {/* 签名行 */}
                  <tr>
                    <td style={valueCellStyle} colSpan={1}>检测: {detailData.testname || '-'}</td>
                    <td style={valueCellStyle} colSpan={2}>复核: {detailData.monitorname || '-'}</td>
                    <td style={valueCellStyle} colSpan={1}>监理: {detailData.supervisorname || '-'}</td>
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

export default SurfaceSupplementDetailPage
