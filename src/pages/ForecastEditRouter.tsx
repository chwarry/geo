import React from 'react'
import { useParams, useSearchParams, Navigate } from 'react-router-dom'
import GeologyForecastEditPage from './GeologyForecastEditPage'
import DrillingEditPage from './DrillingEditPage'
import PalmSketchEditPage from './PalmSketchEditPage'
import TunnelSketchEditPage from './TunnelSketchEditPage'
import SurfaceSupplementEditPage from './SurfaceSupplementEditPage'

/**
 * 预报编辑页面路由分发器
 * 根据不同的预报类型（type）渲染不同的编辑页面
 */
function ForecastEditRouter() {
  const { type, id } = useParams<{ type: string; id: string }>()
  const [searchParams] = useSearchParams()
  
  const method = searchParams.get('method')
  const siteId = searchParams.get('siteId')
  
  console.log('🔀 [编辑路由] type:', type, 'id:', id, 'method:', method, 'siteId:', siteId)
  
  // 根据 type 渲染不同的编辑页面
  switch (type) {
    case 'geophysical':
      // 物探法编辑页面（已实现）
      return <GeologyForecastEditPage />
      
    case 'palmSketch':
      // 掌子面素描编辑页面（已实现）
      return <PalmSketchEditPage />
      
    case 'tunnelSketch':
      // 洞身素描编辑页面
      return <TunnelSketchEditPage />
      
    case 'drilling':
      // 钻探法编辑页面（已实现）
      return <DrillingEditPage />
      
    case 'surface':
      // 地表补充编辑页面
      return <SurfaceSupplementEditPage />
      
    default:
      // 未知类型，重定向到列表页
      console.error('❌ [编辑路由] 未知的预报类型:', type)
      return <Navigate to="/forecast/geology" replace />
  }
}

export default ForecastEditRouter
