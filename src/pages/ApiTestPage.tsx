import React, { useState } from 'react';
import { Card, Button, Space, Typography, Divider, Table, Message } from '@arco-design/web-react';
import { get, post, put, del } from '../utils/api';
import apiAdapter from '../services/apiAdapter';

const { Title, Text, Paragraph } = Typography;

interface TestResult {
  method: string;
  url: string;
  status: 'pending' | 'success' | 'error';
  message: string;
  data?: any;
  error?: string;
}

const ApiTestPage: React.FC = () => {
  const [results, setResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  const addResult = (result: TestResult) => {
    setResults(prev => [result, ...prev]);
  };

  const setTestLoading = (key: string, value: boolean) => {
    setLoading(prev => ({ ...prev, [key]: value }));
  };

  // 测试新后端接口 - Hello World（通过代理）
  const testNewBackend = async () => {
    const key = 'newBackend';
    setTestLoading(key, true);
    try {
      // 使用 api 工具函数，通过代理访问（/api -> http://121.40.127.120:8080/api/v1）
      const data = await get<any>('/api/test/hello', undefined, {
        transform: (raw: any) => {
          // 后端返回格式: { resultcode: 0, message: "操作成功", data: "Hello World!" }
          console.log('Raw response:', raw);
          return raw;
        }
      });
      
      addResult({
        method: 'GET',
        url: '/api/test/hello (代理到 http://121.40.127.120:8080/api/v1/test/hello)',
        status: 'success',
        message: '新后端测试成功！',
        data: data
      });
      
      if (data && data.data) {
        Message.success(`后端返回: ${data.data}`);
      } else {
        Message.success('新后端测试成功！');
      }
    } catch (error: any) {
      addResult({
        method: 'GET',
        url: '/api/test/hello',
        status: 'error',
        message: '新后端测试失败',
        error: error.message
      });
      console.error('测试失败:', error);
    } finally {
      setTestLoading(key, false);
    }
  };

  // 测试 GET 请求
  const testGet = async () => {
    const key = 'get';
    setTestLoading(key, true);
    try {
      const data = await get<any>('/api/project/info');
      addResult({
        method: 'GET',
        url: '/api/project/info',
        status: 'success',
        message: '获取项目信息成功',
        data
      });
      Message.success('GET 请求成功');
    } catch (error: any) {
      addResult({
        method: 'GET',
        url: '/api/project/info',
        status: 'error',
        message: 'GET 请求失败',
        error: error.message
      });
    } finally {
      setTestLoading(key, false);
    }
  };

  // 测试 GET 请求（列表）
  const testGetList = async () => {
    const key = 'getList';
    setTestLoading(key, true);
    try {
      const data = await get<any>('/api/tunnels');
      addResult({
        method: 'GET',
        url: '/api/tunnels',
        status: 'success',
        message: '获取隧道列表成功',
        data
      });
      Message.success('GET 列表请求成功');
    } catch (error: any) {
      addResult({
        method: 'GET',
        url: '/api/tunnels',
        status: 'error',
        message: 'GET 列表请求失败',
        error: error.message
      });
    } finally {
      setTestLoading(key, false);
    }
  };

  // 测试 POST 请求
  const testPost = async () => {
    const key = 'post';
    setTestLoading(key, true);
    try {
      const data = await post<any>(
        '/api/forecast/designs',
        {
          method: '测试方法A',
          startMileage: 'DK713+000',
          endMileage: 'DK713+100',
          length: 100,
          minBurialDepth: 15.5,
          designTimes: 1
        }
      );
      addResult({
        method: 'POST',
        url: '/api/forecast/designs',
        status: 'success',
        message: '新增预报设计成功',
        data
      });
      Message.success('POST 请求成功');
    } catch (error: any) {
      addResult({
        method: 'POST',
        url: '/api/forecast/designs',
        status: 'error',
        message: 'POST 请求失败',
        error: error.message
      });
    } finally {
      setTestLoading(key, false);
    }
  };

  // 测试 PUT 请求（静默失败）
  const testPutSilent = async () => {
    const key = 'putSilent';
    setTestLoading(key, true);
    try {
      const data = await put<any>(
        '/api/user/profile',
        { name: '测试用户' },
        undefined,
        { showError: false }
      );
      addResult({
        method: 'PUT',
        url: '/api/user/profile',
        status: 'success',
        message: 'PUT 请求成功（静默模式）',
        data
      });
      Message.success('PUT 请求成功（静默模式）');
    } catch (error: any) {
      addResult({
        method: 'PUT',
        url: '/api/user/profile',
        status: 'error',
        message: 'PUT 请求失败（静默模式，不弹UI）',
        error: error.message
      });
      // 静默模式下也在控制台记录
      console.log('PUT 请求失败（静默）:', error);
    } finally {
      setTestLoading(key, false);
    }
  };

  // 测试 DELETE 请求
  const testDelete = async () => {
    const key = 'delete';
    setTestLoading(key, true);
    try {
      const data = await del<any>(
        '/api/forecast/designs/test-id-123',
        undefined,
        { errorMessage: '删除失败，请稍后重试' }
      );
      addResult({
        method: 'DELETE',
        url: '/api/forecast/designs/test-id-123',
        status: 'success',
        message: '删除成功',
        data
      });
      Message.success('DELETE 请求成功');
    } catch (error: any) {
      addResult({
        method: 'DELETE',
        url: '/api/forecast/designs/test-id-123',
        status: 'error',
        message: '删除失败',
        error: error.message
      });
    } finally {
      setTestLoading(key, false);
    }
  };

  // 测试自定义转换
  const testCustomTransform = async () => {
    const key = 'transform';
    setTestLoading(key, true);
    try {
      const data = await get<{ id: string; name: string }>(
        '/api/tunnels',
        undefined,
        {
          transform: (raw: any) => {
            // 自定义数据转换：只取第一个隧道
            if (Array.isArray(raw)) {
              return raw[0] || {};
            }
            return raw;
          }
        }
      );
      addResult({
        method: 'GET',
        url: '/api/tunnels (with transform)',
        status: 'success',
        message: '自定义转换成功（只取第一项）',
        data
      });
      Message.success('自定义转换请求成功');
    } catch (error: any) {
      addResult({
        method: 'GET',
        url: '/api/tunnels (with transform)',
        status: 'error',
        message: '自定义转换失败',
        error: error.message
      });
    } finally {
      setTestLoading(key, false);
    }
  };

  // 测试标段查询
  const testBidSectionList = async () => {
    const key = 'bidSection';
    setTestLoading(key, true);
    try {
      const data = await get<any>('/api/bd/list', { params: { userid: 1 } });
      addResult({
        method: 'GET',
        url: '/api/bd/list?userid=1',
        status: 'success',
        message: '标段查询成功',
        data
      });
      Message.success('标段查询成功');
    } catch (error: any) {
      addResult({
        method: 'GET',
        url: '/api/bd/list?userid=1',
        status: 'error',
        message: '标段查询失败',
        error: error.message
      });
    } finally {
      setTestLoading(key, false);
    }
  };

  // 测试设计预报查询（带userid）
  const testDesignForecast = async () => {
    const key = 'designForecast';
    setTestLoading(key, true);
    try {
      const params = { userid: 1, currentPage: 1, pageSize: 10 };
      console.log('🔍 [测试1] /api/sjyb/list 参数:', params);
      
      const data = await get<any>('/api/sjyb/list', { params });
      console.log('🔍 [测试1] /api/sjyb/list 原始响应:', data);
      
      addResult({
        method: 'GET',
        url: '/api/sjyb/list?userid=1&currentPage=1&pageSize=10',
        status: 'success',
        message: `设计预报查询成功 - total: ${data?.sjybIPage?.total || 0}, records: ${data?.sjybIPage?.records?.length || 0}`,
        data
      });
      Message.success(`查询完成 - 找到 ${data?.sjybIPage?.total || 0} 条数据`);
    } catch (error: any) {
      addResult({
        method: 'GET',
        url: '/api/sjyb/list',
        status: 'error',
        message: '设计预报查询失败',
        error: error.message
      });
      console.error('设计预报查询失败:', error);
    } finally {
      setTestLoading(key, false);
    }
  };

  // 测试设计预报查询（不带userid）
  const testDesignForecastNoUser = async () => {
    const key = 'designForecastNoUser';
    setTestLoading(key, true);
    try {
      const params = { currentPage: 1, pageSize: 100 };
      console.log('🔍 [测试2-不带userid] /api/sjyb/list 参数:', params);
      
      const data = await get<any>('/api/sjyb/list', { params });
      console.log('🔍 [测试2-不带userid] /api/sjyb/list 原始响应:', data);
      
      addResult({
        method: 'GET',
        url: '/api/sjyb/list?currentPage=1&pageSize=100 (无userid)',
        status: 'success',
        message: `查询成功(无userid) - total: ${data?.sjybIPage?.total || 0}, records: ${data?.sjybIPage?.records?.length || 0}`,
        data
      });
      Message.success(`查询完成(无userid) - 找到 ${data?.sjybIPage?.total || 0} 条数据`);
    } catch (error: any) {
      addResult({
        method: 'GET',
        url: '/api/sjyb/list (无userid)',
        status: 'error',
        message: '查询失败',
        error: error.message
      });
      console.error('查询失败:', error);
    } finally {
      setTestLoading(key, false);
    }
  };

  // 测试物探法查询
  const testGeophysicalMethod = async () => {
    const key = 'geophysical';
    setTestLoading(key, true);
    try {
      const data = await get<any>('/api/wtf/1');
      addResult({
        method: 'GET',
        url: '/api/wtf/1',
        status: 'success',
        message: '物探法查询成功',
        data
      });
      Message.success('物探法查询成功');
    } catch (error: any) {
      addResult({
        method: 'GET',
        url: '/api/wtf/1',
        status: 'error',
        message: '物探法查询失败',
        error: error.message
      });
    } finally {
      setTestLoading(key, false);
    }
  };

  // 测试物探法-地震波反射
  const testSeismicReflection = async () => {
    const key = 'seismic';
    setTestLoading(key, true);
    try {
      const data = await get<any>('/api/wtf/tsp', { params: { wtfPk: 1 } });
      addResult({
        method: 'GET',
        url: '/api/wtf/tsp?wtfPk=1',
        status: 'success',
        message: '地震波反射数据查询成功',
        data
      });
      Message.success('地震波反射数据查询成功');
    } catch (error: any) {
      addResult({
        method: 'GET',
        url: '/api/wtf/tsp?wtfPk=1',
        status: 'error',
        message: '地震波反射数据查询失败',
        error: error.message
      });
    } finally {
      setTestLoading(key, false);
    }
  };

  // 测试新的CRUD接口
  const testDesignRockGrades = async () => {
    const key = 'rockGrades';
    setTestLoading(key, true);
    try {
      const data = await apiAdapter.getDesignRockGrades({ pageNum: 1, pageSize: 5 });
      
      addResult({
        method: 'GET',
        url: 'apiAdapter.getDesignRockGrades()',
        status: 'success',
        message: `获取设计围岩等级成功！共 ${data.total} 条记录`,
        data: data
      });
      
      Message.success(`设计围岩等级测试成功！共 ${data.total} 条记录`);
    } catch (error: any) {
      addResult({
        method: 'GET',
        url: 'apiAdapter.getDesignRockGrades()',
        status: 'error',
        message: '获取设计围岩等级失败',
        error: error.message
      });
      Message.error('设计围岩等级测试失败');
    } finally {
      setTestLoading(key, false);
    }
  };

  const testCreateRockGrade = async () => {
    const key = 'createRockGrade';
    setTestLoading(key, true);
    try {
      const testData = {
        sitePk: 1,
        dkname: 'DK',
        dkilo: 713.485,
        sjwydjLength: 100,
        wydj: 4,
        revise: '测试创建',
        username: '测试用户'
      };

      const result = await apiAdapter.createDesignRockGrade(testData);
      
      addResult({
        method: 'POST',
        url: 'apiAdapter.createDesignRockGrade()',
        status: result.success ? 'success' : 'error',
        message: result.success ? '创建设计围岩等级成功！' : '创建设计围岩等级失败',
        data: result
      });
      
      if (result.success) {
        Message.success('创建设计围岩等级成功！');
      } else {
        Message.error('创建设计围岩等级失败');
      }
    } catch (error: any) {
      addResult({
        method: 'POST',
        url: 'apiAdapter.createDesignRockGrade()',
        status: 'error',
        message: '创建设计围岩等级异常',
        error: error.message
      });
      Message.error('创建设计围岩等级异常');
    } finally {
      setTestLoading(key, false);
    }
  };

  const testGeophysicalMethods = async () => {
    const key = 'geophysicalMethods';
    setTestLoading(key, true);
    try {
      const data = await apiAdapter.getGeophysicalMethods({ pageNum: 1, pageSize: 5 });
      
      addResult({
        method: 'GET',
        url: 'apiAdapter.getGeophysicalMethods()',
        status: 'success',
        message: `获取物探法记录成功！共 ${data.total} 条记录`,
        data: data
      });
      
      Message.success(`物探法记录测试成功！共 ${data.total} 条记录`);
    } catch (error: any) {
      addResult({
        method: 'GET',
        url: 'apiAdapter.getGeophysicalMethods()',
        status: 'error',
        message: '获取物探法记录失败',
        error: error.message
      });
      Message.error('物探法记录测试失败');
    } finally {
      setTestLoading(key, false);
    }
  };

  const testAPIMode = async () => {
    const key = 'apiMode';
    setTestLoading(key, true);
    try {
      const apiType = apiAdapter.getAPIType();
      
      addResult({
        method: 'INFO',
        url: 'apiAdapter.getAPIType()',
        status: 'success',
        message: `当前API模式: ${apiType}`,
        data: { apiType, useRealAPI: process.env.REACT_APP_USE_REAL_API !== 'false' }
      });
      
      Message.info(`当前API模式: ${apiType}`);
    } catch (error: any) {
      addResult({
        method: 'INFO',
        url: 'apiAdapter.getAPIType()',
        status: 'error',
        message: '获取API模式失败',
        error: error.message
      });
    } finally {
      setTestLoading(key, false);
    }
  };

  const clearResults = () => {
    setResults([]);
    Message.info('已清空测试结果');
  };

  const columns = [
    { title: '方法', dataIndex: 'method', width: 80 },
    { title: 'URL', dataIndex: 'url', width: 250 },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (status: string) => (
        <Text
          style={{
            color: status === 'success' ? '#00b42a' : status === 'error' ? '#f53f3f' : '#86909c'
          }}
        >
          {status === 'success' ? '✓ 成功' : status === 'error' ? '✗ 失败' : '⏳ 进行中'}
        </Text>
      )
    },
    { title: '消息', dataIndex: 'message', width: 200 },
    {
      title: '详情',
      width: 150,
      render: (_: any, record: TestResult) => (
        <Text
          style={{
            fontSize: '12px',
            color: '#86909c',
            maxWidth: '100%',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            display: 'block'
          }}
        >
          {record.data ? JSON.stringify(record.data).substring(0, 50) + '...' : record.error || '-'}
        </Text>
      )
    }
  ];

  return (
    <div style={{ padding: '24px', backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
      <Card style={{ marginBottom: '24px' }}>
        <Title heading={3}>API 工具函数测试</Title>
        <Paragraph>
          测试 <Text code>src/utils/api.ts</Text> 中的公共请求函数
        </Paragraph>
        <Paragraph type="secondary">
          当前 API Base URL: <Text code>{process.env.REACT_APP_API_BASE_URL || '(未配置，使用代理)'}</Text>
        </Paragraph>
      </Card>

      <Card style={{ marginBottom: '24px' }}>
        <Title heading={4}>🎯 新后端测试（通过代理）</Title>
        <Paragraph type="secondary">
          前端请求: <Text code>/api/test/hello</Text> → 代理转发到: <Text code>http://121.40.127.120:8080/api/v1/test/hello</Text>
        </Paragraph>
        <Space size="large" wrap style={{ marginBottom: '20px' }}>
          <Button 
            type="primary" 
            size="large"
            status="success"
            onClick={testNewBackend} 
            loading={loading.newBackend}
          >
            ✨ 测试新后端 (Hello World)
          </Button>
        </Space>
        <Divider />
        <Title heading={4}>🔥 真实业务接口测试</Title>
        <Space size="large" wrap style={{ marginBottom: '20px' }}>
          <Button 
            type="primary" 
            status="warning"
            onClick={testDesignForecast} 
            loading={loading.designForecast}
          >
            📋 测试设计预报 (带userid=1)
          </Button>
          <Button 
            type="primary" 
            status="success"
            onClick={testDesignForecastNoUser} 
            loading={loading.designForecastNoUser}
          >
            📋 测试设计预报 (不带userid)
          </Button>
          <Button 
            type="primary" 
            status="warning"
            onClick={testBidSectionList} 
            loading={loading.bidSection}
          >
            📍 标段查询
          </Button>
          <Button 
            type="primary" 
            status="warning"
            onClick={testGeophysicalMethod} 
            loading={loading.geophysical}
          >
            🔍 物探法查询
          </Button>
          <Button 
            type="primary" 
            status="warning"
            onClick={testSeismicReflection} 
            loading={loading.seismic}
          >
            📊 地震波反射
          </Button>
        </Space>
        <Divider />
        <Title heading={4}>🆕 新增CRUD接口测试</Title>
        <Space size="large" wrap style={{ marginBottom: '20px' }}>
          <Button 
            type="primary" 
            status="success"
            onClick={testAPIMode} 
            loading={loading.apiMode}
          >
            🔍 检查API模式
          </Button>
          <Button 
            type="primary" 
            status="success"
            onClick={testDesignRockGrades} 
            loading={loading.rockGrades}
          >
            🏔️ 设计围岩等级查询
          </Button>
          <Button 
            type="primary" 
            status="warning"
            onClick={testCreateRockGrade} 
            loading={loading.createRockGrade}
          >
            ➕ 创建围岩等级
          </Button>
          <Button 
            type="primary" 
            status="success"
            onClick={testGeophysicalMethods} 
            loading={loading.geophysicalMethods}
          >
            🔬 物探法记录查询
          </Button>
        </Space>
        <Divider />
        <Title heading={4}>其他测试用例</Title>
        <Space size="large" wrap>
          <Button type="primary" onClick={testGet} loading={loading.get}>
            测试 GET 请求
          </Button>
          <Button type="primary" onClick={testGetList} loading={loading.getList}>
            测试 GET 列表
          </Button>
          <Button type="primary" onClick={testPost} loading={loading.post}>
            测试 POST 请求
          </Button>
          <Button type="primary" onClick={testPutSilent} loading={loading.putSilent}>
            测试 PUT（静默）
          </Button>
          <Button type="primary" onClick={testDelete} loading={loading.delete}>
            测试 DELETE 请求
          </Button>
          <Button type="primary" onClick={testCustomTransform} loading={loading.transform}>
            测试自定义转换
          </Button>
        </Space>
        <Divider />
        <Button onClick={clearResults}>清空结果</Button>
      </Card>

      <Card title="测试结果">
        {results.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#86909c' }}>
            暂无测试结果，点击上方按钮开始测试
          </div>
        ) : (
          <Table
            columns={columns}
            data={results}
            pagination={false}
            border
            stripe
          />
        )}
      </Card>
    </div>
  );
};

export default ApiTestPage;

