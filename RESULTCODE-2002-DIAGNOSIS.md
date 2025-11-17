# ResultCode 2002 错误诊断

## 🔍 问题描述

**错误码**: `resultcode: 2002`  
**接口路径**: `/api/auth/login` (已确认正确)  
**症状**: 每次登录都返回 2002 错误

## 🎯 ResultCode 2002 的常见含义

根据后端开发经验，`resultcode: 2002` 通常表示：

### 1. **参数验证失败** (最可能 70%)
- ❌ 缺少必需参数
- ❌ 参数类型错误
- ❌ 参数格式不正确
- ❌ 参数名称不匹配

### 2. **请求格式错误** (20%)
- ❌ Content-Type 不正确
- ❌ 请求体格式错误
- ❌ JSON 解析失败

### 3. **业务逻辑验证失败** (10%)
- ❌ 用户名格式不符合要求
- ❌ 密码格式不符合要求
- ❌ 账号状态异常

## 🛠️ 诊断步骤

### 第一步：查看完整的错误响应

打开浏览器控制台，查看登录响应的 `message` 字段：

```json
{
  "resultcode": 2002,
  "message": "这里会有具体的错误描述",  ← 关键信息
  "data": null
}
```

**请告诉我 `message` 字段的内容！**

### 第二步：检查请求详情

在 Network 标签中，查看 `login` 请求：

#### Request Headers
```
POST /api/auth/login HTTP/1.1
Host: 121.40.127.120:8080
Content-Type: application/json  ← 应该是这个
Accept: application/json
```

#### Request Payload
```json
{
  "username": "你的用户名",
  "password": "你的密码"
}
```

### 第三步：对比Swagger文档

在 Swagger UI 中测试登录接口：

1. 访问: `http://121.40.127.120:8080/swagger-ui/index.html`
2. 找到 `/api/auth/login` 接口
3. 点击 "Try it out"
4. 输入相同的用户名和密码
5. 点击 "Execute"

**如果Swagger中成功，说明前端请求有问题**  
**如果Swagger中也失败，说明是账号或后端问题**

## 🔧 可能的解决方案

### 方案1: 参数名称不匹配

后端可能期望的参数名不是 `username` 和 `password`。

**常见的参数名变体**:
```json
// 可能是这样
{
  "account": "用户名",
  "password": "密码"
}

// 或者这样
{
  "loginName": "用户名",
  "pwd": "密码"
}

// 或者这样
{
  "userName": "用户名",  // 注意大小写
  "passWord": "密码"
}
```

**如何确认**: 在Swagger UI中查看接口的 Request body schema

### 方案2: 缺少必需参数

后端可能需要额外的参数：

```json
{
  "username": "用户名",
  "password": "密码",
  "captcha": "验证码",     // 可能需要验证码
  "loginType": "password"  // 可能需要登录类型
}
```

### 方案3: 参数类型错误

某些字段可能需要特定类型：

```json
{
  "username": "admin",
  "password": "123456",
  "rememberMe": true  // 布尔值而不是字符串
}
```

### 方案4: Content-Type问题

检查请求头是否正确：

```typescript
// 确保使用 application/json
headers: {
  'Content-Type': 'application/json'
}
```

## 📋 需要您提供的信息

为了准确诊断问题，请提供：

### 1. 完整的错误响应
```json
{
  "resultcode": 2002,
  "message": "？？？",  ← 这里显示什么？
  "data": null
}
```

### 2. Swagger UI中的测试结果

使用相同的用户名和密码在Swagger UI中测试：
- ✅ 成功？返回什么？
- ❌ 失败？返回什么错误？

### 3. Request Body Schema

在Swagger UI中查看 `/api/auth/login` 的 Request body，告诉我：
- 需要哪些字段？
- 每个字段的类型是什么？
- 哪些是必需的？

### 4. 浏览器控制台日志

查看控制台输出的完整日志：
```
🔐 登录请求: { ... }
✅ 登录响应: { ... }
```

## 🎯 快速测试

### 测试1: 使用curl直接测试

```bash
curl -X POST http://121.40.127.120:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"你的用户名","password":"你的密码"}' \
  -v
```

查看返回结果和详细的HTTP信息。

### 测试2: 使用Postman测试

1. 创建新请求
2. 方法: POST
3. URL: `http://121.40.127.120:8080/api/auth/login`
4. Headers: 
   - `Content-Type: application/json`
5. Body (raw JSON):
```json
{
  "username": "你的用户名",
  "password": "你的密码"
}
```

## 💡 常见错误码对照表

| ResultCode | 含义 | 解决方案 |
|------------|------|----------|
| 200 | 成功 | - |
| 401 | 认证失败 | 用户名或密码错误 |
| 403 | 禁止访问 | 账号被禁用 |
| 404 | 接口不存在 | 检查URL路径 |
| 500 | 服务器错误 | 查看后端日志 |
| **2002** | **参数错误** | **检查参数格式和必需字段** |
| 2003 | 业务逻辑错误 | 查看message字段 |

## 🔍 调试增强

我已经在代码中添加了更详细的日志输出：

```typescript
// 现在会输出更详细的信息
console.log('🔐 登录请求:', { 
  url: '/api/auth/login',
  username: values.username, 
  password: '******',
  fullPayload: { ... }
})

console.log('✅ 登录响应:', {
  resultcode: response.resultcode,
  message: response.message,
  hasData: !!response.data,
  fullResponse: response
})
```

**请重新尝试登录，并将控制台的完整输出发给我！**

## 📞 下一步

请提供以下任一信息：

1. ✅ **错误响应中的 `message` 字段内容**
2. ✅ **Swagger UI中的测试结果**
3. ✅ **浏览器控制台的完整日志**
4. ✅ **Swagger中 `/api/auth/login` 的参数定义**

有了这些信息，我就能准确定位问题并修复！🔧

---

**更新时间**: 2024年11月15日 10:15
