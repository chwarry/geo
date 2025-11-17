# 登录流程和API调用文档

## 🔐 完整登录流程

### 1. 登录接口
```
POST /api/auth/login

请求：
{
  "username": "admin",
  "password": "admin123"
}

响应：
{
  "resultcode": 0,
  "message": "操作成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "username": "admin",
    "userId": 1,
    "roles": ["ROLE_USER"]
  }
}
```

### 2. 获取标段和项目列表
```
GET /api/v1/bd/bd-xm
Authorization: Bearer {token}

响应：
{
  "resultcode": 0,
  "message": "操作成功",
  "data": [
    {
      "bdId": 1,
      "bdName": "站前3标",
      "xmId": 1,
      "xmName": "某铁路项目"
    }
  ]
}
```

### 3. 获取标段的构筑物和工点信息
```
GET /api/v1/bd/bd-gd/{bdId}
Authorization: Bearer {token}

响应：
{
  "resultcode": 0,
  "message": "操作成功",
  "data": {
    "bdInfo": {
      "bdId": 1,
      "bdName": "站前3标",
      "xmId": 1,
      "xmName": "某铁路项目"
    },
    "gdzwList": [
      {
        "gdzwId": 1,
        "gdzwName": "青龙山隧道",
        "gdzwType": "隧道"
      }
    ]
  }
}
```

## 📋 前端实现

### Token管理

#### 1. Token存储
登录成功后，token会自动存储在localStorage：

```typescript
// src/utils/auth.ts
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
```

#### 2. Token自动附加
http拦截器会自动在所有请求中添加Authorization头：

```typescript
// src/utils/http.ts
http.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
```

### API服务

#### 创建API服务文件
**文件**: `src/services/projectAPI.ts`

```typescript
import http from '../utils/http'

/**
 * 获取标段和项目列表
 * GET /api/v1/bd/bd-xm
 */
export async function getBdXmList() {
  const response = await http.get('/api/v1/bd/bd-xm')
  return response
}

/**
 * 根据标段ID获取构筑物和工点信息
 * GET /api/v1/bd/bd-gd/{bdId}
 */
export async function getBdGdInfo(bdId: number) {
  const response = await http.get(`/api/v1/bd/bd-gd/${bdId}`)
  return response
}
```

### 登录页面集成

#### 登录成功后自动调用API
**文件**: `src/pages/LoginPage.tsx`

```typescript
// 登录成功后
if (response.resultcode === 200 && response.data) {
  const { token, username, userId, roles } = response.data

  // 1. 保存token和用户信息
  saveLoginInfo(token, username, userId, roles)

  // 2. 获取标段和项目信息
  try {
    const bdXmData = await getBdXmList()
    console.log('标段和项目列表:', bdXmData)
    
    // 3. 如果有标段，获取第一个标段的工点信息
    if (bdXmData.data && bdXmData.data.length > 0) {
      const firstBd = bdXmData.data[0]
      const bdGdData = await getBdGdInfo(firstBd.bdId)
      console.log('工点信息:', bdGdData)
    }
  } catch (apiError) {
    console.error('获取项目数据失败，但不影响登录:', apiError)
  }

  // 4. 跳转到首页
  navigate('/home')
}
```

## 🔄 完整流程图

```
用户输入用户名密码
    ↓
点击登录按钮
    ↓
POST /api/auth/login
    ↓
✅ 登录成功
    ↓
保存 token 到 localStorage
    ↓
GET /api/v1/bd/bd-xm (自动带上 Authorization: Bearer {token})
    ↓
✅ 获取到标段列表
    ↓
GET /api/v1/bd/bd-gd/{bdId} (自动带上 Authorization: Bearer {token})
    ↓
✅ 获取到工点信息
    ↓
跳转到首页
```

## 📡 代理配置

### setupProxy.js
```javascript
app.use(
  '/api',
  createProxyMiddleware({
    target: 'http://121.40.127.120:8080',
    changeOrigin: true,
    // 不进行路径重写，直接转发
    // 前端: /api/auth/login -> 后端: /api/auth/login
    // 前端: /api/v1/bd/bd-xm -> 后端: /api/v1/bd/bd-xm
  })
)
```

### 路径映射

| 前端请求 | 代理后 | 后端实际路径 |
|---------|--------|------------|
| `/api/auth/login` | → | `http://121.40.127.120:8080/api/auth/login` |
| `/api/v1/bd/bd-xm` | → | `http://121.40.127.120:8080/api/v1/bd/bd-xm` |
| `/api/v1/bd/bd-gd/1` | → | `http://121.40.127.120:8080/api/v1/bd/bd-gd/1` |

## 🧪 测试步骤

### 1. 测试登录和API调用

1. 打开浏览器开发者工具（F12）
2. 切换到Console标签
3. 访问 `http://localhost:3000/login`
4. 输入用户名: `admin`
5. 输入密码: `admin123`
6. 点击登录

### 2. 查看控制台日志

应该看到以下日志输出：

```
🔐 登录请求: {username: "admin", password: "******"}
✅ 登录响应: {resultcode: 0, message: "操作成功", data: {...}}
🔍 [ProjectAPI] 获取标段和项目列表
[API Proxy] GET /api/v1/bd/bd-xm -> /api/v1/bd/bd-xm
[API Response] 200 /api/v1/bd/bd-xm
✅ [ProjectAPI] 标段和项目列表: {...}
📋 [Login] 标段和项目列表: {...}
🏗️ [Login] 获取第一个标段的工点信息, bdId: 1
🔍 [ProjectAPI] 获取标段构筑物和工点信息, bdId: 1
[API Proxy] GET /api/v1/bd/bd-gd/1 -> /api/v1/bd/bd-gd/1
[API Response] 200 /api/v1/bd/bd-gd/1
✅ [ProjectAPI] 标段构筑物和工点信息: {...}
📍 [Login] 工点信息: {...}
```

### 3. 查看Network标签

应该看到以下请求：

1. `POST /api/auth/login` - 登录请求
   - Status: 200
   - Response: 包含token

2. `GET /api/v1/bd/bd-xm` - 获取标段项目
   - Status: 200
   - Request Headers: `Authorization: Bearer eyJhbGci...`
   - Response: 标段列表数组

3. `GET /api/v1/bd/bd-gd/1` - 获取工点信息
   - Status: 200
   - Request Headers: `Authorization: Bearer eyJhbGci...`
   - Response: 工点信息对象

### 4. 验证Token

在Network标签中点击任一API请求，查看Request Headers：

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

确认token已正确附加在Authorization头中。

## 🔍 调试技巧

### 1. 查看localStorage
```javascript
// 浏览器控制台执行
console.log('Token:', localStorage.getItem('token'))
console.log('Username:', localStorage.getItem('username'))
console.log('UserId:', localStorage.getItem('userId'))
console.log('Roles:', localStorage.getItem('roles'))
```

### 2. 手动调用API
```javascript
// 在浏览器控制台执行
import { getBdXmList, getBdGdInfo } from './services/projectAPI'

// 获取标段列表
getBdXmList().then(console.log)

// 获取工点信息
getBdGdInfo(1).then(console.log)
```

### 3. 查看请求详情
打开Network标签 → 点击请求 → 查看：
- **Headers**: 请求头（包含Authorization）
- **Payload**: 请求体
- **Preview**: 响应预览
- **Response**: 原始响应

## ⚠️ 常见问题

### 1. Token未附加到请求头

**症状**: API返回401未授权

**解决方案**:
```javascript
// 检查token是否存在
console.log('Token exists:', !!localStorage.getItem('token'))

// 检查http拦截器
console.log('Http interceptors:', http.interceptors.request)
```

### 2. API路径错误

**症状**: 404 Not Found

**解决方案**:
- 检查代理配置 `src/setupProxy.js`
- 确认后端API路径正确
- 查看控制台代理日志

### 3. CORS错误

**症状**: Access-Control-Allow-Origin 错误

**解决方案**:
- 确保代理配置中 `changeOrigin: true`
- 检查后端是否允许跨域

### 4. Token过期

**症状**: API返回401或token无效

**解决方案**:
```typescript
// 在响应拦截器中处理401
http.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      logout()
      Message.error('登录已过期，请重新登录')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)
```

## 📊 数据结构示例

### 标段和项目列表响应
```json
{
  "resultcode": 0,
  "message": "操作成功",
  "data": [
    {
      "bdId": 1,
      "bdName": "站前3标",
      "xmId": 1,
      "xmName": "京沪高铁",
      "bdCode": "ZQ3",
      "createTime": "2024-01-01 00:00:00"
    },
    {
      "bdId": 2,
      "bdName": "站前4标",
      "xmId": 1,
      "xmName": "京沪高铁",
      "bdCode": "ZQ4",
      "createTime": "2024-01-01 00:00:00"
    }
  ]
}
```

### 工点信息响应
```json
{
  "resultcode": 0,
  "message": "操作成功",
  "data": {
    "bdInfo": {
      "bdId": 1,
      "bdName": "站前3标",
      "xmId": 1,
      "xmName": "京沪高铁"
    },
    "gdzwList": [
      {
        "gdzwId": 1,
        "gdzwName": "青龙山隧道",
        "gdzwType": "隧道",
        "gdzwLength": 3500.0,
        "startMileage": "DK100+000",
        "endMileage": "DK103+500"
      },
      {
        "gdzwId": 2,
        "gdzwName": "白云山隧道",
        "gdzwType": "隧道",
        "gdzwLength": 2800.0,
        "startMileage": "DK104+000",
        "endMileage": "DK106+800"
      }
    ]
  }
}
```

## ✅ 功能清单

- [x] 创建projectAPI服务文件
- [x] 实现getBdXmList函数
- [x] 实现getBdGdInfo函数
- [x] 登录成功后自动调用getBdXmList
- [x] 如果有标段数据，自动调用getBdGdInfo
- [x] Token自动附加到所有API请求
- [x] 修复代理配置，移除路径重写
- [x] 添加详细的日志输出
- [x] 错误处理不影响登录流程

## 🚀 后续优化

1. **缓存机制**
   - 缓存标段和项目列表
   - 避免重复请求

2. **状态管理**
   - 使用Redux或Context存储项目数据
   - 全局访问标段和工点信息

3. **错误处理**
   - 更详细的错误提示
   - API失败重试机制

4. **加载状态**
   - 显示加载动画
   - 优化用户体验

完整的登录和API调用流程已实现！🎉

