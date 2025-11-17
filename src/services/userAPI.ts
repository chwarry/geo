import http from '../utils/http';

/**
 * 用户管理API
 */

// 用户数据类型
export interface User {
  id: string;
  username: string;
  realName: string;
  phone: string;
  email: string;
  department: string;
  role: string;
  status: 'active' | 'inactive';
  createTime: string;
}

// 用户列表查询参数
export interface UserQueryParams {
  username?: string;
  role?: string;
  status?: string;
  pageNum?: number;
  pageSize?: number;
}

// 用户列表响应
export interface UserListResponse {
  resultcode: number;
  message: string;
  data: {
    list: User[];
    total: number;
    pageNum: number;
    pageSize: number;
  };
}

// 创建/更新用户参数
export interface UserFormData {
  username: string;
  password?: string;
  realName: string;
  phone: string;
  email: string;
  department: string;
  role: string;
  status: 'active' | 'inactive';
}

// 基础响应类型
export interface BaseResponse<T = any> {
  resultcode: number;
  message: string;
  data?: T;
}

/**
 * 获取用户列表
 */
export async function getUserList(params: UserQueryParams): Promise<UserListResponse> {
  try {
    const response = await http.get<UserListResponse>('/api/v1/users', {
      params
    });
    return response;
  } catch (error) {
    console.error('获取用户列表失败:', error);
    throw error;
  }
}

/**
 * 获取用户详情
 */
export async function getUserDetail(id: string): Promise<BaseResponse<User>> {
  try {
    const response = await http.get<BaseResponse<User>>(`/api/v1/users/${id}`);
    return response;
  } catch (error) {
    console.error('获取用户详情失败:', error);
    throw error;
  }
}

/**
 * 创建用户
 */
export async function createUser(data: UserFormData): Promise<BaseResponse> {
  try {
    const response = await http.post<BaseResponse>('/api/v1/users', data);
    return response;
  } catch (error) {
    console.error('创建用户失败:', error);
    throw error;
  }
}

/**
 * 更新用户
 */
export async function updateUser(id: string, data: Partial<UserFormData>): Promise<BaseResponse> {
  try {
    const response = await http.put<BaseResponse>(`/api/v1/users/${id}`, data);
    return response;
  } catch (error) {
    console.error('更新用户失败:', error);
    throw error;
  }
}

/**
 * 删除用户
 */
export async function deleteUser(id: string): Promise<BaseResponse> {
  try {
    const response = await http.delete<BaseResponse>(`/api/v1/users/${id}`);
    return response;
  } catch (error) {
    console.error('删除用户失败:', error);
    throw error;
  }
}

/**
 * 批量删除用户
 */
export async function batchDeleteUsers(ids: string[]): Promise<BaseResponse> {
  try {
    const response = await http.post<BaseResponse>('/api/v1/users/batch-delete', { ids });
    return response;
  } catch (error) {
    console.error('批量删除用户失败:', error);
    throw error;
  }
}

/**
 * 重置用户密码
 */
export async function resetPassword(id: string, newPassword: string): Promise<BaseResponse> {
  try {
    const response = await http.post<BaseResponse>(`/api/v1/users/${id}/reset-password`, {
      password: newPassword
    });
    return response;
  } catch (error) {
    console.error('重置密码失败:', error);
    throw error;
  }
}

/**
 * 导出用户数据
 */
export async function exportUsers(params: UserQueryParams): Promise<Blob> {
  try {
    const response = await http.get('/api/v1/users/export', {
      params,
      responseType: 'blob'
    });
    return response as any;
  } catch (error) {
    console.error('导出用户数据失败:', error);
    throw error;
  }
}
