import React from 'react'
import { useParams, useSearchParams, Navigate } from 'react-router-dom'
import GeologyForecastDetailPage from './GeologyForecastDetailPage'
import DrillingDetailPage from './DrillingDetailPage'
import PalmSketchDetailPage from './PalmSketchDetailPage'
import TunnelSketchDetailPage from './TunnelSketchDetailPage'
import SurfaceSupplementDetailPage from './SurfaceSupplementDetailPage'

/**
 * 预报详情页面路由分发器
 * 根据不同的预报类型（type）渲染不同的详情页面
 */
function ForecastDetailRouter() {
  const { type, id } = useParams<{ type: string; id: string }>()
  const [searchParams] = useSearchParams()
  
  const method = searchParams.get('method')
  const siteId = searchParams.get('siteId')
  
  console.log('🔀 [详情路由] type:', type, 'id:', id, 'method:', method, 'siteId:', siteId)
  
  // 根据 type 渲染不同的详情页面
  switch (type) {
    case 'geophysical':
      // 物探法详情页面（已实现）
      return <GeologyForecastDetailPage />
      
    case 'palmSketch':
      // 掌子面素描详情页面
      return <PalmSketchDetailPage />
      
    case 'tunnelSketch':
      // 洞身素描详情页面
      return <TunnelSketchDetailPage />
      
    case 'drilling':
      // 钻探法详情页面（已实现）
      return <DrillingDetailPage />
      
    case 'surface':
      // 地表补充详情页面
      return <SurfaceSupplementDetailPage />
      
    default:
      // 未知类型，重定向到列表页
      console.error('❌ [详情路由] 未知的预报类型:', type)
      return <Navigate to="/forecast/geology" replace />
  }
}

export default ForecastDetailRouter
