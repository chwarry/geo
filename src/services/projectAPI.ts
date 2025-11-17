import http from '../utils/http'

/**
 * 项目和标段相关API
 */

// 标段和项目响应类型
export interface BdXmItem {
  bdId: number
  bdName: string
  xmId: number
  xmName: string
  [key: string]: any
}

export interface BdXmResponse {
  resultcode: number
  message: string
  data: BdXmItem[]
}

// 工点信息响应类型
export interface GdzwItem {
  gdzwId: number
  gdzwName: string
  gdzwType: string
  [key: string]: any
}

export interface BdGdResponse {
  resultcode: number
  message: string
  data: {
    bdInfo: {
      bdId: number
      bdName: string
      xmId: number
      xmName: string
    }
    gdzwList: GdzwItem[]
  }
}

/**
 * 获取标段和项目列表
 * GET /api/v1/bd/bd-xm
 */
export async function getBdXmList(): Promise<BdXmResponse> {
  try {
    console.log('🔍 [ProjectAPI] 获取标段和项目列表')
    const response = await http.get<BdXmResponse>('/api/v1/bd/bd-xm')
    console.log('✅ [ProjectAPI] 标段和项目列表:', response)
    return response
  } catch (error) {
    console.error('❌ [ProjectAPI] 获取标段和项目列表失败:', error)
    throw error
  }
}

/**
 * 根据标段ID获取构筑物和工点信息
 * GET /api/v1/bd/bd-gd/{bdId}
 * @param bdId 标段ID
 */
export async function getBdGdInfo(bdId: number) {
  try {
    console.log('🔍 [ProjectAPI] 获取标段构筑物和工点信息, bdId:', bdId)
    const response = await http.get<BdGdResponse>(`/api/v1/bd/bd-gd/${bdId}`)
    console.log('✅ [ProjectAPI] 标段构筑物和工点信息:', response)
    return response
  } catch (error) {
    console.error('❌ [ProjectAPI] 获取标段构筑物和工点信息失败:', error)
    throw error
  }
}

