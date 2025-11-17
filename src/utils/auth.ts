/**
 * 认证相关的工具函数
 */

/**
 * 检查用户是否已登录
 */
export function isAuthenticated(): boolean {
  const token = localStorage.getItem('token')
  const username = localStorage.getItem('username')
  return !!(token && username)
}

/**
 * 获取当前登录的用户信息
 */
export function getCurrentUser() {
  return {
    token: localStorage.getItem('token'),
    username: localStorage.getItem('username'),
    userId: localStorage.getItem('userId'),
    roles: JSON.parse(localStorage.getItem('roles') || '[]')
  }
}

/**
 * 退出登录
 * 清除所有本地存储的用户信息
 */
export function logout() {
  localStorage.removeItem('token')
  localStorage.removeItem('username')
  localStorage.removeItem('userId')
  localStorage.removeItem('roles')
  // 不清除 rememberedUsername，保留记住的用户名
}

/**
 * 保存登录信息
 */
export function saveLoginInfo(
  token: string,
  username: string,
  userId: number,
  roles: string[]
) {
  localStorage.setItem('token', token)
  localStorage.setItem('username', username)
  localStorage.setItem('userId', userId.toString())
  localStorage.setItem('roles', JSON.stringify(roles))
}


