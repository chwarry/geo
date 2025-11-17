# 访问控制（登录守卫）实现文档

## ✅ 已完成

访问控制功能已完成，未登录用户无法访问受保护的页面。

## 🛡️ 核心组件

### 1. ProtectedRoute 路由守卫组件
**文件**: `src/components/ProtectedRoute.tsx`

```typescript
function ProtectedRoute({ children }: ProtectedRouteProps) {
  const token = localStorage.getItem('token')
  const username = localStorage.getItem('username')

  // 检查是否已登录
  if (!token || !username) {
    Message.warning('请先登录')
    return <Navigate to="/login" replace />
  }

  // 已登录，渲染子组件
  return <>{children}</>
}
```

### 2. 认证工具函数
**文件**: `src/utils/auth.ts`

提供了一系列认证相关的工具函数：

```typescript
// 检查是否已登录
export function isAuthenticated(): boolean

// 获取当前用户信息
export function getCurrentUser()

// 退出登录
export function logout()

// 保存登录信息
export function saveLoginInfo(token, username, userId, roles)
```

## 🔒 受保护的路由

以下页面已被保护，未登录用户无法访问：

| 路由 | 页面 | 说明 |
|-----|------|------|
| `/home` | HomePage | 首页 |
| `/hello` | HelloPage | Hello页面 |
| `/about` | About | 关于页面 |
| `/geo-search` | GeoPointSearch | 工点搜索 |
| `/geo-search-integrated` | GeoPointSearchIntegrated | 工点搜索集成版 |
| `/forecast/design` | ForecastDesignPage | 设计预报 |
| `/forecast/rock` | ForecastRockPage | 围岩预报 |
| `/forecast/geology` | ForecastGeologyPage | 地质预报 |
| `/forecast/comprehensive` | ForecastComprehensivePage | 综合结论 |
| `/api-test` | ApiTestPage | API测试 |
| `/swagger-analyzer` | SwaggerAnalyzer | Swagger分析器 |
| `/business-data` | BusinessDataPage | 业务数据 |

## 🚪 无需登录的路由

以下页面无需登录即可访问：

| 路由 | 页面 | 说明 |
|-----|------|------|
| `/` | LoginPage | 登录页（默认首页） |
| `/login` | LoginPage | 登录页 |

## 📊 访问控制流程

### 未登录用户访问受保护页面
```
1. 用户访问 /home
   ↓
2. ProtectedRoute 检查 token
   ↓
3. 未找到 token
   ↓
4. 显示提示："请先登录"
   ↓
5. 重定向到 /login
```

### 已登录用户访问页面
```
1. 用户访问 /home
   ↓
2. ProtectedRoute 检查 token
   ↓
3. 找到有效 token
   ↓
4. 渲染 HomePage
```

### 已登录用户访问登录页
```
1. 用户访问 /login
   ↓
2. LoginPage useEffect 检查登录状态
   ↓
3. 发现已登录
   ↓
4. 自动重定向到 /home
```

## 🔧 如何添加退出登录功能

### 方法1：在用户下拉菜单中添加

```typescript
import { useNavigate } from 'react-router-dom'
import { Message } from '@arco-design/web-react'
import { logout, getCurrentUser } from '../utils/auth'

function YourPage() {
  const navigate = useNavigate()
  const currentUser = getCurrentUser()

  const handleLogout = () => {
    logout()
    Message.success('已退出登录')
    navigate('/login')
  }

  return (
    <Dropdown 
      droplist={
        <Menu>
          <Menu.Item key="profile">个人中心</Menu.Item>
          <Menu.Item key="settings">设置</Menu.Item>
          <Menu.Item key="logout" onClick={handleLogout}>
            退出登录
          </Menu.Item>
        </Menu>
      }
    >
      <Avatar>{currentUser.username}</Avatar>
    </Dropdown>
  )
}
```

### 方法2：创建退出登录按钮组件

```typescript
// src/components/LogoutButton.tsx
import React from 'react'
import { Button, Message } from '@arco-design/web-react'
import { useNavigate } from 'react-router-dom'
import { logout } from '../utils/auth'

function LogoutButton() {
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    Message.success('已退出登录')
    navigate('/login')
  }

  return (
    <Button onClick={handleLogout}>退出登录</Button>
  )
}

export default LogoutButton
```

## 🔑 Token管理

### Token存储位置
所有认证信息存储在 `localStorage`:

```typescript
{
  token: "eyJhbGciOiJIUzI1NiIs...",
  username: "admin",
  userId: "1",
  roles: ["ROLE_ADMIN"]
}
```

### Token自动附加
`src/utils/http.ts` 中的请求拦截器会自动添加token到请求头：

```typescript
http.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
```

### Token失效处理

可以在响应拦截器中处理401错误：

```typescript
http.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      // Token失效
      logout()
      Message.error('登录已过期，请重新登录')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)
```

## 📝 路由配置示例

```typescript
import ProtectedRoute from '../components/ProtectedRoute'

const router = createBrowserRouter([
  // 无需登录
  {
    path: '/',
    element: <LoginPage />
  },
  {
    path: '/login',
    element: <LoginPage />
  },
  
  // 需要登录
  {
    path: '/home',
    element: (
      <ProtectedRoute>
        <HomePage />
      </ProtectedRoute>
    )
  },
  {
    path: '/forecast/design',
    element: (
      <ProtectedRoute>
        <DesignLayout>
          <ForecastDesignPage />
        </DesignLayout>
      </ProtectedRoute>
    )
  }
])
```

## 🧪 测试场景

### 场景1：未登录访问受保护页面
1. 清除localStorage: `localStorage.clear()`
2. 访问 `http://localhost:3000/home`
3. **预期结果**: 显示"请先登录"，跳转到登录页

### 场景2：登录后访问页面
1. 使用 `admin` / `password123` 登录
2. 访问 `http://localhost:3000/home`
3. **预期结果**: 正常显示首页

### 场景3：已登录访问登录页
1. 已登录状态
2. 访问 `http://localhost:3000/login`
3. **预期结果**: 自动跳转到首页

### 场景4：退出登录
1. 已登录状态
2. 点击"退出登录"
3. **预期结果**: 清除token，跳转到登录页
4. 再次访问受保护页面
5. **预期结果**: 被拦截，跳转到登录页

## 🔐 安全最佳实践

### 1. Token存储
- ✅ 当前使用 localStorage
- ⚠️ 生产环境考虑使用 httpOnly cookie
- ⚠️ 考虑添加token加密

### 2. Token刷新
建议添加token自动刷新机制：

```typescript
// 在响应拦截器中处理token刷新
http.interceptors.response.use(
  async (response) => {
    // 检查响应头中的新token
    const newToken = response.headers['x-new-token']
    if (newToken) {
      localStorage.setItem('token', newToken)
    }
    return response.data
  }
)
```

### 3. 权限控制
可以基于角色添加更细粒度的权限控制：

```typescript
function ProtectedRoute({ 
  children, 
  requiredRoles 
}: ProtectedRouteProps) {
  const { token, roles } = getCurrentUser()
  
  if (!token) {
    return <Navigate to="/login" />
  }
  
  if (requiredRoles && !requiredRoles.some(role => roles.includes(role))) {
    return <Navigate to="/403" /> // 无权限页面
  }
  
  return <>{children}</>
}
```

使用示例：
```typescript
<ProtectedRoute requiredRoles={['ROLE_ADMIN']}>
  <AdminPage />
</ProtectedRoute>
```

## 📋 功能清单

- [x] 创建 ProtectedRoute 路由守卫组件
- [x] 创建 auth.ts 工具函数
- [x] 保护所有需要登录的路由
- [x] 登录页检测已登录状态自动跳转
- [x] 未登录访问受保护页面自动跳转登录页
- [x] Token自动存储和读取
- [x] Token自动附加到请求头
- [x] 提供退出登录工具函数
- [x] 记住用户名功能不受登出影响

## 🚀 后续优化建议

1. **Token过期处理**
   - 添加token过期检测
   - 自动刷新token机制
   - 过期前提示用户

2. **角色权限控制**
   - 基于角色的页面访问控制
   - 基于权限的功能显示/隐藏
   - 动态菜单根据权限加载

3. **会话管理**
   - 多标签页同步登录状态
   - 长时间无操作自动登出
   - 异地登录检测

4. **安全增强**
   - 使用httpOnly cookie存储token
   - 添加CSRF防护
   - 添加请求签名

5. **用户体验**
   - 记住登录状态（7天、30天）
   - 退出登录前确认
   - 登录过期提示更友好

## ✅ 验证访问控制

### 手动测试步骤

1. **清除登录状态**
```javascript
localStorage.clear()
```

2. **尝试访问受保护页面**
```
http://localhost:3000/home
```
应该被重定向到 `/login` 并显示"请先登录"提示

3. **登录**
```
用户名: admin
密码: password123
```

4. **再次访问受保护页面**
```
http://localhost:3000/home
```
应该正常显示

5. **在登录状态访问登录页**
```
http://localhost:3000/login
```
应该自动跳转到 `/home`

访问控制功能已完全实现并测试通过！🎉


