import React, { useEffect, useMemo, useState } from 'react'
import { Button, Card, Divider, Image, Message, Space, Spin, Tag } from '@arco-design/web-react'
import { IconLeft } from '@arco-design/web-react/icon'
import { useNavigate, useParams } from 'react-router-dom'
import apiAdapter from '../services/apiAdapter'

const METHOD_MAP: Record<number, string> = {
  1: '地震波反射',
  2: '水平声波剖面',
  3: '陆地声呐',
  4: '电磁波反射',
  5: '高分辨直流电',
  6: '瞬变电磁',
  9: '微震监测',
}

function GeophysicalDetailPage() {
  const navigate = useNavigate()
  const { method, ybPk } = useParams<{ method: string; ybPk: string }>()

  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<any>(null)

  const methodNum = useMemo(() => {
    const m = Number(method)
    return Number.isFinite(m) ? m : NaN
  }, [method])

  useEffect(() => {
    const fetchDetail = async () => {
      if (!method || !ybPk) return
      setLoading(true)
      try {
        const res = await apiAdapter.getGeophysicalDetailByMethod(method, ybPk)
        setData(res)
      } catch (e) {
        console.error('加载物探法详情失败:', e)
        Message.error('加载物探法详情失败')
      } finally {
        setLoading(false)
      }
    }
    fetchDetail()
  }, [method, ybPk])

  const mainObj = useMemo(() => {
    if (!data || typeof data !== 'object') return {}
    return (
      data.tsp ||
      data.hsp ||
      data.ldsn ||
      data.dcbfs ||
      data.gfbzld ||
      data.sbdc ||
      data.wzjc ||
      data
    )
  }, [data])

  const imageList: string[] = useMemo(() => {
    const imgs: string[] = []
    const collect = (obj: any) => {
      if (!obj || typeof obj !== 'object') return
      Object.keys(obj).forEach((k) => {
        const v = (obj as any)[k]
        if (v && typeof v === 'string') {
          const lower = k.toLowerCase()
          if (/^pic\d+$/.test(lower) || lower.includes('image') || lower.includes('pic')) {
            imgs.push(v)
          }
        }
      })
    }
    collect(mainObj)
    collect(data)
    return Array.from(new Set(imgs)).filter(Boolean)
  }, [data, mainObj])

  const headerTitle = useMemo(() => {
    const name = METHOD_MAP[methodNum] || `方法${method}`
    return `${name} 详情`
  }, [methodNum, method])

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div
        style={{
          height: 44,
          background: 'linear-gradient(90deg, #A18AFF 0%, #8B7AE6 100%)',
          borderRadius: 6,
          marginBottom: 12,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 16px',
          color: '#fff',
          fontSize: 14,
        }}
      >
        <span>{headerTitle}</span>
        <Button type="text" icon={<IconLeft />} style={{ color: '#fff' }} onClick={() => navigate(-1)}>
          返回
        </Button>
      </div>

      <Card style={{ flex: 1, overflow: 'hidden' }} bodyStyle={{ padding: 0 }}>
        <div style={{ height: 'calc(100vh - 120px)', overflow: 'auto', padding: 16 }}>
          <Spin loading={loading} tip="加载中...">
            <Space direction="vertical" size={16} style={{ width: '100%' }}>
              <Card>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ fontSize: 18, fontWeight: 600 }}>{headerTitle}</div>
                  <Tag color="arcoblue">ybPk: {ybPk}</Tag>
                </div>
                <Divider style={{ margin: '12px 0' }} />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
                  <div>
                    <div style={{ color: '#86909c' }}>预报时间</div>
                    <div>{mainObj.monitordate || mainObj.createdate || mainObj.gmtCreate || '-'}</div>
                  </div>
                  <div>
                    <div style={{ color: '#86909c' }}>掌子面里程</div>
                    <div>{mainObj.dkname ? `${mainObj.dkname}${mainObj.dkilo ?? ''}` : mainObj.dkilo ?? '-'}</div>
                  </div>
                  <div>
                    <div style={{ color: '#86909c' }}>预报长度</div>
                    <div>{mainObj.ybLength || mainObj.wtfLength || mainObj.length || '-'}</div>
                  </div>
                  <div>
                    <div style={{ color: '#86909c' }}>原始文件</div>
                    <div>{mainObj.originalfile || '-'}</div>
                  </div>
                </div>
              </Card>

              {imageList.length > 0 && (
                <Card title="图像成果">
                  <Space direction="vertical" size={12} style={{ width: '100%' }}>
                    {imageList.map((src, idx) => (
                      <Image key={idx} src={src} alt={`图像${idx + 1}`} width="100%" style={{ borderRadius: 6 }} />
                    ))}
                  </Space>
                </Card>
              )}

              {(mainObj.conclusionyb || mainObj.suggestion || mainObj.solution || mainObj.remark) && (
                <Card title="结论与建议">
                  <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.7 }}>
                    {mainObj.conclusionyb && <div><strong>结论：</strong>{mainObj.conclusionyb}</div>}
                    {mainObj.suggestion && <div><strong>建议：</strong>{mainObj.suggestion}</div>}
                    {mainObj.solution && <div><strong>处置：</strong>{mainObj.solution}</div>}
                    {mainObj.remark && <div><strong>备注：</strong>{mainObj.remark}</div>}
                  </div>
                </Card>
              )}

              <Card title="原始数据">
                <pre style={{ background: '#f7f8fa', borderRadius: 6, padding: 12, overflow: 'auto' }}>
{JSON.stringify(data, null, 2)}
                </pre>
              </Card>
            </Space>
          </Spin>
        </div>
      </Card>
    </div>
  )
}

export default GeophysicalDetailPage
