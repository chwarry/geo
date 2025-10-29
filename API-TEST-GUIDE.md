# API 测试指南

## 📋 测试内容

测试新创建的公共请求函数 `src/utils/api.ts`，该工具封装了常用的 HTTP 请求方法，提供统一的错误处理和数据转换。

## 🎯 已完成的准备工作

### 1. 创建的文件

#### `src/utils/api.ts` ✨ 核心工具
- **功能**：统一的 HTTP 请求封装
- **方法**：`get`, `post`, `put`, `del`
- **特性**：
  - 自动错误提示（可配置）
  - 自定义数据转换
  - 统一错误处理
  - 支持自定义错误消息

#### `src/setupProxy.js` 🔌 代理配置
- **功能**：开发环境代理转发
- **配置**：
  - 代理路径：`/api/*`
  - 目标服务器：`process.env.REACT_APP_API_BASE_URL` 或 `http://localhost:8080`
  - 日志输出：请求和响应日志

#### `src/pages/ApiTestPage.tsx` 🧪 测试页面
- **功能**：可视化测试界面
- **测试用例**：
  1. GET 请求（获取项目信息）
  2. GET 列表（获取隧道列表）
  3. POST 请求（新增预报设计）
  4. PUT 请求（静默模式）
  5. DELETE 请求（自定义错误消息）
  6. 自定义数据转换

## 🚀 如何测试

### 方式 1：访问测试页面（推荐）

1. 启动开发服务器（已自动启动）
2. 访问测试页面：http://localhost:3000/api-test
3. 点击各个测试按钮
4. 查看测试结果表格

### 方式 2：在代码中直接调用

```typescript
import { get, post, put, del } from '../utils/api';

// GET 请求
const data = await get<Project>('/api/project/info');

// POST 请求
const result = await post('/api/forecast/designs', {
  method: '方法A',
  startMileage: 'DK713+000',
  endMileage: 'DK713+100',
  length: 100
});

// 自定义转换
const customData = await get('/api/tunnels', undefined, {
  transform: (raw) => raw[0]  // 只取第一项
});

// 静默失败（不显示错误提示）
await put('/api/user/profile', data, undefined, {
  showError: false
});
```

## ⚠️ 可能遇到的问题

### 问题 1：代理转发失败

**症状**：
- 请求返回 404
- 控制台显示 "Proxy Error"
- 后端未收到请求

**原因分析**：
1. 后端服务器未启动
2. 代理配置路径不匹配
3. CORS 跨域问题

**解决方案**：

#### 方案 A：检查后端服务器
```bash
# 确保后端服务器正在运行
# 访问 http://localhost:8080/api/project/info 检查后端是否正常
```

#### 方案 B：检查代理配置
打开 `src/setupProxy.js`，确认：
- `target` 指向正确的后端地址
- `pathRewrite` 配置正确

```javascript
app.use(
  '/api',
  createProxyMiddleware({
    target: 'http://localhost:8080',  // 确保后端地址正确
    changeOrigin: true,
    logLevel: 'debug'  // 添加详细日志
  })
);
```

#### 方案 C：修改 API 基础路径
如果代理一直有问题，可以直接在环境变量中配置后端地址：

创建 `.env.development` 文件：
```properties
REACT_APP_API_BASE_URL=http://localhost:8080/api
```

这样请求会直接发送到后端，绕过代理。

### 问题 2：CORS 跨域错误

**症状**：
- 浏览器控制台显示 CORS 错误
- 请求被浏览器阻止

**解决方案**：

#### 后端添加 CORS 支持（推荐）
```java
// Spring Boot 示例
@Configuration
public class CorsConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                    .allowedOrigins("http://localhost:3000")
                    .allowedMethods("GET", "POST", "PUT", "DELETE")
                    .allowedHeaders("*")
                    .allowCredentials(true);
            }
        };
    }
}
```

### 问题 3：请求路径不匹配

**症状**：
- 404 Not Found
- 后端日志显示路径不存在

**原因**：
- 前端请求路径与后端接口路径不一致

**解决方案**：

检查路径映射：
```
前端请求: /api/project/info
↓ 代理转发
后端接口: http://localhost:8080/api/project/info

确保后端有这个接口！
```

### 问题 4：数据格式不匹配

**症状**：
- 返回数据但解析失败
- 类型错误

**原因**：
- 后端返回的数据格式与前端期望不一致

**解决方案**：

使用自定义转换：
```typescript
const data = await get('/api/project/info', undefined, {
  transform: (raw) => {
    // 后端返回 { code: 200, data: {...}, message: 'ok' }
    if (raw.code === 200) {
      return raw.data;
    }
    // 后端直接返回数据对象
    return raw;
  }
});
```

## 📊 代理工作原理

```
浏览器                   代理中间件                  后端服务器
  |                         |                         |
  |  /api/project/info      |                         |
  |------------------------>|                         |
  |                         |  http://localhost:8080/api/project/info
  |                         |------------------------>|
  |                         |                         |
  |                         |    { data: {...} }      |
  |                         |<------------------------|
  |    { data: {...} }      |                         |
  |<------------------------|                         |
```

**优点**：
- ✅ 避免 CORS 问题
- ✅ 统一开发和生产环境配置
- ✅ 方便调试和日志记录

## 🔍 调试方法

### 1. 查看代理日志
代理配置中已添加日志输出，在终端查看：
```
[Proxy] GET /api/project/info -> /api/project/info
[Proxy Response] 200 /api/project/info
```

### 2. 查看网络请求
打开浏览器开发者工具 → Network 标签：
- 查看请求 URL
- 查看请求方法和参数
- 查看响应状态码和数据

### 3. 查看错误消息
错误会自动显示 Arco Message 提示，也可以在控制台查看详细信息。

## ✅ 预期测试结果

### 没有后端服务器（当前状态）
- ❌ 所有请求会失败
- ❌ 显示代理错误或连接失败
- ✅ 错误消息正确显示
- ✅ 测试页面正常工作

### 有后端服务器
- ✅ GET 请求成功返回数据
- ✅ POST 请求成功创建数据
- ✅ PUT/DELETE 请求正常工作
- ✅ 自定义转换正确执行
- ✅ 错误处理符合预期

## 📝 后续步骤

1. **启动后端服务器**
   - 确保后端监听 `http://localhost:8080`
   - 实现对应的 API 接口

2. **测试所有请求**
   - 访问 http://localhost:3000/api-test
   - 逐个点击测试按钮
   - 检查结果是否正确

3. **调整配置**
   - 根据实际后端接口调整请求路径
   - 配置正确的数据转换函数
   - 优化错误消息

## 🎉 完成标志

当看到以下现象时，说明测试成功：
- ✅ 代理正常转发请求
- ✅ 后端正确处理请求
- ✅ 前端正确解析响应
- ✅ 错误处理符合预期
- ✅ 所有测试用例通过

## 📞 需要帮助？

如果遇到问题，请提供：
1. 错误截图（浏览器控制台和Network）
2. 终端日志（代理日志）
3. 后端接口文档
4. 具体的错误消息

我会帮你定位和解决问题！🚀

