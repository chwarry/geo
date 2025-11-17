# 用户管理功能快速开始

## 🚀 快速访问

### 直接访问用户管理页面

```
http://localhost:3000/user-management
```

⚠️ **注意**: 需要先登录才能访问

## 🎯 功能演示

### 1. 启动项目

```bash
cd d:\Bjtu\project\geo-forecast-mis
npm start
```

### 2. 访问页面

浏览器会自动打开 `http://localhost:3000`

### 3. 登录（临时跳过）

由于您要求暂时不走登录逻辑，可以：

**方法1: 手动设置token（开发测试）**

在浏览器控制台执行：

```javascript
// 设置模拟登录信息
localStorage.setItem('token', 'test-token');
localStorage.setItem('username', 'admin');
localStorage.setItem('userId', '1');
localStorage.setItem('roles', JSON.stringify(['admin']));

// 刷新页面
window.location.reload();
```

**方法2: 直接访问（如果已登录）**

如果之前已经登录过，直接访问：
```
http://localhost:3000/user-management
```

## 📸 页面预览

### 用户管理页面包含：

```
┌─────────────────────────────────────────────────────┐
│  👥 人员信息管理                                      │
├─────────────────────────────────────────────────────┤
│  姓名: [_______]  角色: [选择▼]  状态: [选择▼]       │
│  [🔍 查询] [🔄 重置]                                  │
├─────────────────────────────────────────────────────┤
│  [➕ 新增人员] [📥 导入] [📤 导出]                    │
├─────────────────────────────────────────────────────┤
│  序号 │ 用户名 │ 姓名 │ 手机号 │ 邮箱 │ 部门 │ 角色 │  │
│  ────┼────────┼──────┼────────┼──────┼──────┼──────┤  │
│   1  │ admin  │ 张三 │ 138... │ ...  │ 技术 │ 管理 │  │
│   2  │ user01 │ 李四 │ 139... │ ...  │ 工程 │ 用户 │  │
│  ... │  ...   │ ...  │  ...   │ ...  │ ...  │ ...  │  │
├─────────────────────────────────────────────────────┤
│  共 4 条记录  每页 10 条  [1] 2 3 ... >              │
└─────────────────────────────────────────────────────┘
```

## 🎨 功能测试

### 测试1: 查看用户列表

1. 访问 `/user-management`
2. 查看默认的4个用户
3. 观察不同角色的标签颜色

### 测试2: 搜索用户

1. 在"姓名"输入框输入 "张"
2. 点击"查询"按钮
3. 查看筛选结果

### 测试3: 新增用户

1. 点击"新增人员"按钮
2. 填写表单：
   ```
   用户名: test01
   密码: 123456
   姓名: 测试用户
   手机号: 13700000000
   邮箱: test@example.com
   部门: 测试部
   角色: 普通用户
   状态: 启用
   ```
3. 点击"确定"
4. 查看成功提示

### 测试4: 编辑用户

1. 点击某个用户的"编辑"按钮
2. 修改信息（如姓名、部门）
3. 点击"确定"
4. 查看更新结果

### 测试5: 删除用户

1. 点击某个用户的"删除"按钮
2. 在确认对话框中点击"确定"
3. 查看删除结果

## 🔧 角色测试

### 测试不同角色登录后的跳转

#### 管理员 (admin)

```javascript
localStorage.setItem('roles', JSON.stringify(['admin']));
// 登录后跳转到: /user-management
```

#### 项目经理 (manager)

```javascript
localStorage.setItem('roles', JSON.stringify(['manager']));
// 登录后跳转到: /home
```

#### 技术人员 (engineer)

```javascript
localStorage.setItem('roles', JSON.stringify(['engineer']));
// 登录后跳转到: /forecast-design
```

#### 普通用户 (user)

```javascript
localStorage.setItem('roles', JSON.stringify(['user']));
// 登录后跳转到: /geo-point-search
```

## 📊 Mock数据

当前使用的测试数据：

| 用户名 | 姓名 | 角色 | 状态 |
|--------|------|------|------|
| admin | 张三 | 系统管理员 | 启用 |
| manager01 | 李四 | 项目经理 | 启用 |
| engineer01 | 王五 | 技术人员 | 启用 |
| user01 | 赵六 | 普通用户 | 禁用 |

## 🎯 下一步

### 集成真实API

1. 后端提供用户管理接口
2. 修改 `UserManagementPage.tsx` 中的API调用
3. 替换Mock数据为真实数据

### 添加更多功能

- [ ] 批量删除
- [ ] 批量导入
- [ ] 数据导出
- [ ] 重置密码
- [ ] 用户详情页
- [ ] 操作日志

## 💡 开发提示

### 修改Mock数据

编辑 `src/pages/UserManagementPage.tsx`:

```typescript
const mockUsers: User[] = [
  {
    id: '1',
    username: 'admin',
    realName: '张三',
    // ... 修改或添加用户
  }
];
```

### 修改角色配置

编辑 `src/config/roleRoutes.ts`:

```typescript
export const ROLE_ROUTES: Record<UserRole, RoleRouteConfig> = {
  admin: {
    homePage: '/user-management',  // 修改首页
    routes: [
      // 添加或修改路由
    ]
  }
};
```

### 添加新角色

1. 在 `roleRoutes.ts` 中添加新角色配置
2. 在 `UserManagementPage.tsx` 中添加角色选项
3. 更新 `roleAuth.ts` 中的权限检查逻辑

## 🐛 常见问题

### Q1: 页面显示"请先登录"

**解决方案**: 执行上面的"手动设置token"步骤

### Q2: 点击按钮没有反应

**解决方案**: 
- 检查浏览器控制台是否有错误
- 确认Mock数据加载成功
- 刷新页面重试

### Q3: 角色标签不显示

**解决方案**: 
- 检查角色值是否正确
- 确认 `ROLES` 配置是否包含该角色

### Q4: 搜索功能不工作

**解决方案**: 
- 当前使用前端过滤
- 确认输入的搜索条件
- 点击"重置"清空条件

## 📞 技术支持

如有问题，请查看：
- [完整使用指南](./ROLE-BASED-ROUTING-GUIDE.md)
- [API文档](./API-IMPLEMENTATION-GUIDE.md)

---

**快速开始版本**: 1.0.0  
**更新时间**: 2024年11月16日
