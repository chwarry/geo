# 登录问题排查指南

## 🔍 登录报错可能的原因

### 1. **后端服务未启动或无法访问** ⚠️ 最常见

**症状**:
- 浏览器控制台显示网络错误
- 错误信息: `Network Error` 或 `ERR_CONNECTION_REFUSED`

**检查方法**:
```bash
# 测试后端是否可访问
curl http://121.40.127.120:8080/api/auth/login

# 或在浏览器中访问
http://121.40.127.120:8080/swagger-ui/index.html
```

**解决方案**:
- 确认后端服务器正在运行
- 检查网络连接
- 确认防火墙没有阻止访问

---

### 2. **用户名或密码错误** 🔐

**症状**:
- 返回错误: `用户名或密码错误`
- HTTP状态码: 401 Unauthorized
- `resultcode` 不等于 200

**常见原因**:
- ❌ 用户名拼写错误
- ❌ 密码输入错误
- ❌ 账号不存在
- ❌ 账号被禁用

**解决方案**:
1. **检查用户名和密码是否正确**
2. **联系后端管理员确认账号状态**
3. **查看后端日志获取详细错误信息**

---

### 3. **CORS跨域问题** 🌐

**症状**:
- 控制台错误: `CORS policy: No 'Access-Control-Allow-Origin' header`
- 请求被浏览器阻止

**检查方法**:
打开浏览器开发者工具 → Network标签 → 查看请求状态

**解决方案**:
- 开发环境: 使用 `setupProxy.js` 代理（已配置）
- 生产环境: 后端需要配置CORS允许前端域名

---

### 4. **API路径错误** 🛣️

**症状**:
- HTTP状态码: 404 Not Found
- 错误信息: `Cannot POST /api/auth/login`

**检查方法**:
```javascript
// 查看实际请求的URL
console.log('登录请求URL:', '/api/auth/login')
```

**当前配置**:
- 前端请求: `/api/auth/login`
- 代理转发: `http://121.40.127.120:8080/api/auth/login`

---

### 5. **Token过期或无效** 🎫

**症状**:
- 登录后立即跳转回登录页
- 其他API请求返回401

**解决方案**:
```javascript
// 清除旧的token
localStorage.clear()
// 重新登录
```

---

## 🛠️ 调试步骤

### 第一步: 打开浏览器开发者工具

**Chrome/Edge**: 按 `F12` 或 `Ctrl+Shift+I`

### 第二步: 查看Console标签

查找以下日志：

```javascript
🔐 登录请求: { username: "xxx", password: "******" }
✅ 登录响应: { ... }
```

或错误信息：

```javascript
❌ 登录失败: Error: ...
```

### 第三步: 查看Network标签

1. 找到 `login` 请求
2. 查看请求详情：
   - **Status**: 应该是 `200 OK`
   - **Request URL**: 应该是 `http://121.40.127.120:8080/api/auth/login`
   - **Request Headers**: 包含 `Content-Type: application/json`
   - **Request Payload**: 包含用户名和密码
   - **Response**: 查看返回的数据

### 第四步: 检查响应数据

**成功的响应**:
```json
{
  "resultcode": 200,
  "message": "登录成功",
  "data": {
    "token": "eyJhbGci...",
    "username": "用户名",
    "userId": 1,
    "roles": ["user"]
  }
}
```

**失败的响应**:
```json
{
  "resultcode": 401,
  "message": "用户名或密码错误",
  "data": null
}
```

---

## 🔧 常见错误及解决方案

### 错误1: Network Error

```
Error: Network Error
```

**原因**: 无法连接到后端服务器

**解决**:
1. 检查后端服务是否启动
2. 检查URL是否正确: `http://121.40.127.120:8080`
3. 检查网络连接
4. 尝试直接访问: `http://121.40.127.120:8080/swagger-ui/index.html`

---

### 错误2: 401 Unauthorized

```
{
  "resultcode": 401,
  "message": "用户名或密码错误"
}
```

**原因**: 认证失败

**解决**:
1. ✅ **确认用户名和密码正确**
2. 检查账号是否存在
3. 联系管理员重置密码
4. 查看后端日志确认具体原因

---

### 错误3: 404 Not Found

```
Cannot POST /api/auth/login
```

**原因**: API路径不存在

**解决**:
1. 确认后端登录接口路径
2. 检查 `setupProxy.js` 代理配置
3. 联系后端开发确认接口地址

---

### 错误4: 500 Internal Server Error

```
{
  "resultcode": 500,
  "message": "服务器内部错误"
}
```

**原因**: 后端服务异常

**解决**:
1. 查看后端服务日志
2. 联系后端开发人员
3. 检查数据库连接

---

## 📋 检查清单

在报告问题前，请检查以下项目：

- [ ] 后端服务是否正在运行？
- [ ] 能否访问 Swagger UI: `http://121.40.127.120:8080/swagger-ui/index.html`
- [ ] 用户名和密码是否正确？
- [ ] 浏览器控制台是否有错误信息？
- [ ] Network标签中的请求状态码是什么？
- [ ] 响应数据中的 `resultcode` 是什么？
- [ ] 响应数据中的 `message` 是什么？

---

## 🆘 如何获取帮助

### 提供以下信息：

1. **错误截图**
   - 浏览器控制台的错误信息
   - Network标签中的请求详情

2. **请求信息**
   - 请求URL
   - 请求方法 (POST)
   - 请求头
   - 请求体

3. **响应信息**
   - 状态码
   - 响应头
   - 响应体

4. **环境信息**
   - 浏览器版本
   - 前端运行方式 (npm start / 生产环境)
   - 后端服务地址

---

## 💡 测试建议

### 1. 使用Swagger UI测试

访问: `http://121.40.127.120:8080/swagger-ui/index.html`

找到 `/api/auth/login` 接口，点击 "Try it out"，输入：

```json
{
  "username": "你的用户名",
  "password": "你的密码"
}
```

点击 "Execute" 查看响应。

### 2. 使用curl测试

```bash
curl -X POST http://121.40.127.120:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"你的用户名","password":"你的密码"}'
```

### 3. 使用Postman测试

1. 创建新请求
2. 方法: POST
3. URL: `http://121.40.127.120:8080/api/auth/login`
4. Headers: `Content-Type: application/json`
5. Body (raw JSON):
```json
{
  "username": "你的用户名",
  "password": "你的密码"
}
```

---

## 🎯 最可能的原因

根据经验，登录失败最常见的原因是：

1. **用户名或密码错误** (60%)
2. **后端服务未启动** (20%)
3. **网络连接问题** (10%)
4. **账号不存在或被禁用** (5%)
5. **其他原因** (5%)

---

## 📞 联系方式

如果以上方法都无法解决问题，请：

1. 联系后端开发人员确认账号状态
2. 提供完整的错误信息和截图
3. 查看后端服务日志获取详细错误

---

**最后更新**: 2024年11月15日
