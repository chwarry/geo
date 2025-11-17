/**
 * 角色路由配置
 * 根据不同角色配置不同的首页和可访问路由
 */

export type UserRole = 'admin' | 'manager' | 'engineer' | 'user';

// 路由配置接口
export interface RouteConfig {
  path: string;
  name: string;
  component?: string;
  icon?: string;
  children?: RouteConfig[];
  hidden?: boolean;
}

// 角色路由映射
export interface RoleRouteConfig {
  role: UserRole;
  roleName: string;
  homePage: string; // 登录后的首页
  routes: RouteConfig[]; // 可访问的路由列表
}

/**
 * 角色路由配置表
 */
export const ROLE_ROUTES: Record<UserRole, RoleRouteConfig> = {
  // 系统管理员 - 拥有所有权限
  admin: {
    role: 'admin',
    roleName: '系统管理员',
    homePage: '/user-management', // 管理员首页：用户管理
    routes: [
      {
        path: '/home',
        name: '首页',
        icon: 'icon-home'
      },
      {
        path: '/user-management',
        name: '用户管理',
        icon: 'icon-user'
      },
      {
        path: '/forecast-design',
        name: '预报设计',
        icon: 'icon-file'
      },
      {
        path: '/geo-point-search',
        name: '工点查询',
        icon: 'icon-search'
      },
      {
        path: '/data-analysis',
        name: '数据分析',
        icon: 'icon-bar-chart'
      },
      {
        path: '/system-settings',
        name: '系统设置',
        icon: 'icon-settings'
      }
    ]
  },

  // 项目经理 - 管理和查看权限
  manager: {
    role: 'manager',
    roleName: '项目经理',
    homePage: '/home', // 项目经理首页：项目概览
    routes: [
      {
        path: '/home',
        name: '首页',
        icon: 'icon-home'
      },
      {
        path: '/forecast-design',
        name: '预报设计',
        icon: 'icon-file'
      },
      {
        path: '/geo-point-search',
        name: '工点查询',
        icon: 'icon-search'
      },
      {
        path: '/data-analysis',
        name: '数据分析',
        icon: 'icon-bar-chart'
      },
      {
        path: '/team-management',
        name: '团队管理',
        icon: 'icon-team'
      }
    ]
  },

  // 技术人员 - 操作和查看权限
  engineer: {
    role: 'engineer',
    roleName: '技术人员',
    homePage: '/forecast-design', // 技术人员首页：预报设计
    routes: [
      {
        path: '/home',
        name: '首页',
        icon: 'icon-home'
      },
      {
        path: '/forecast-design',
        name: '预报设计',
        icon: 'icon-file'
      },
      {
        path: '/geo-point-search',
        name: '工点查询',
        icon: 'icon-search'
      },
      {
        path: '/data-entry',
        name: '数据录入',
        icon: 'icon-edit'
      }
    ]
  },

  // 普通用户 - 仅查看权限
  user: {
    role: 'user',
    roleName: '普通用户',
    homePage: '/geo-point-search', // 普通用户首页：工点查询
    routes: [
      {
        path: '/home',
        name: '首页',
        icon: 'icon-home'
      },
      {
        path: '/geo-point-search',
        name: '工点查询',
        icon: 'icon-search'
      },
      {
        path: '/data-view',
        name: '数据查看',
        icon: 'icon-eye'
      }
    ]
  }
};

/**
 * 根据角色获取首页路径
 */
export function getHomePageByRole(role: UserRole): string {
  return ROLE_ROUTES[role]?.homePage || '/home';
}

/**
 * 根据角色获取可访问的路由列表
 */
export function getRoutesByRole(role: UserRole): RouteConfig[] {
  return ROLE_ROUTES[role]?.routes || [];
}

/**
 * 检查用户是否有权限访问某个路由
 */
export function hasRoutePermission(role: UserRole, path: string): boolean {
  const routes = getRoutesByRole(role);
  return routes.some(route => route.path === path);
}

/**
 * 获取角色名称
 */
export function getRoleName(role: UserRole): string {
  return ROLE_ROUTES[role]?.roleName || '未知角色';
}

/**
 * 所有可用的角色列表
 */
export const ALL_ROLES: Array<{ value: UserRole; label: string; color: string }> = [
  { value: 'admin', label: '系统管理员', color: 'red' },
  { value: 'manager', label: '项目经理', color: 'orange' },
  { value: 'engineer', label: '技术人员', color: 'blue' },
  { value: 'user', label: '普通用户', color: 'green' }
];
