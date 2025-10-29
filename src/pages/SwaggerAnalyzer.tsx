import React, { useState, useEffect } from 'react';
import { Card, Button, Space, Typography, Table, Tag, Message, Spin, Collapse } from '@arco-design/web-react';
import axios from 'axios';

const { Title, Text, Paragraph } = Typography;
const CollapseItem = Collapse.Item;

interface SwaggerPath {
  path: string;
  method: string;
  summary?: string;
  description?: string;
  tags?: string[];
  parameters?: any[];
  responses?: any;
}

const SwaggerAnalyzer: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [swaggerDoc, setSwaggerDoc] = useState<any>(null);
  const [apis, setApis] = useState<SwaggerPath[]>([]);

  const fetchSwagger = async () => {
    setLoading(true);
    try {
      // 通过代理获取 Swagger JSON 文档
      const response = await axios.get('/v3/api-docs');
      setSwaggerDoc(response.data);
      
      // 解析 API 列表
      const paths = response.data.paths || {};
      const apiList: SwaggerPath[] = [];
      
      Object.keys(paths).forEach(path => {
        const pathData = paths[path];
        Object.keys(pathData).forEach(method => {
          if (['get', 'post', 'put', 'delete', 'patch'].includes(method.toLowerCase())) {
            const apiData = pathData[method];
            apiList.push({
              path,
              method: method.toUpperCase(),
              summary: apiData.summary,
              description: apiData.description,
              tags: apiData.tags,
              parameters: apiData.parameters,
              responses: apiData.responses
            });
          }
        });
      });
      
      setApis(apiList);
      Message.success(`成功获取 ${apiList.length} 个API接口`);
    } catch (error: any) {
      console.error('获取 Swagger 文档失败:', error);
      Message.error('获取 Swagger 文档失败: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSwagger();
  }, []);

  const columns = [
    { 
      title: '方法', 
      dataIndex: 'method', 
      width: 80,
      render: (method: string) => {
        const color = method === 'GET' ? 'blue' : 
                     method === 'POST' ? 'green' : 
                     method === 'PUT' ? 'orange' : 
                     method === 'DELETE' ? 'red' : 'gray';
        return <Tag color={color}>{method}</Tag>;
      }
    },
    { 
      title: 'API路径', 
      dataIndex: 'path', 
      width: 300,
      render: (path: string) => <Text code>{path}</Text>
    },
    { title: '描述', dataIndex: 'summary', ellipsis: true },
    { 
      title: '标签', 
      dataIndex: 'tags', 
      width: 150,
      render: (tags: string[]) => tags?.map(tag => <Tag key={tag}>{tag}</Tag>)
    },
  ];

  return (
    <div style={{ padding: '24px', backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
      <Card style={{ marginBottom: '24px' }}>
        <Title heading={3}>Swagger API 文档分析</Title>
        <Paragraph>
          文档地址: <Text code>http://121.40.127.120:8080/swagger-ui/index.html</Text>
        </Paragraph>
        <Paragraph>
          API Docs: <Text code>http://121.40.127.120:8080/v3/api-docs</Text>
        </Paragraph>
        <Space>
          <Button type="primary" onClick={fetchSwagger} loading={loading}>
            刷新文档
          </Button>
        </Space>
      </Card>

      <Card title={`发现 ${apis.length} 个API接口`}>
        <Spin loading={loading}>
          {apis.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#86909c' }}>
              暂无API数据，点击刷新按钮获取
            </div>
          ) : (
            <>
              <Table
                columns={columns}
                data={apis}
                pagination={{ pageSize: 20 }}
                border
                stripe
              />
              
              <Card style={{ marginTop: '24px' }} title="详细信息">
                <Collapse>
                  {apis.map((api, index) => (
                    <CollapseItem
                      key={index}
                      header={`${api.method} ${api.path}`}
                      name={String(index)}
                    >
                      <div style={{ padding: '16px' }}>
                        <Title heading={6}>摘要</Title>
                        <Paragraph>{api.summary || '无'}</Paragraph>
                        
                        <Title heading={6}>描述</Title>
                        <Paragraph>{api.description || '无'}</Paragraph>
                        
                        {api.parameters && api.parameters.length > 0 && (
                          <>
                            <Title heading={6}>参数</Title>
                            <pre style={{ 
                              backgroundColor: '#f7f8fa', 
                              padding: '12px', 
                              borderRadius: '4px',
                              overflow: 'auto'
                            }}>
                              {JSON.stringify(api.parameters, null, 2)}
                            </pre>
                          </>
                        )}
                        
                        {api.responses && (
                          <>
                            <Title heading={6}>响应</Title>
                            <pre style={{ 
                              backgroundColor: '#f7f8fa', 
                              padding: '12px', 
                              borderRadius: '4px',
                              overflow: 'auto'
                            }}>
                              {JSON.stringify(api.responses, null, 2)}
                            </pre>
                          </>
                        )}
                      </div>
                    </CollapseItem>
                  ))}
                </Collapse>
              </Card>
            </>
          )}
        </Spin>
      </Card>

      {swaggerDoc && (
        <Card title="完整 Swagger 文档" style={{ marginTop: '24px' }}>
          <pre style={{ 
            backgroundColor: '#1e1e1e', 
            color: '#d4d4d4',
            padding: '16px', 
            borderRadius: '4px',
            overflow: 'auto',
            maxHeight: '600px'
          }}>
            {JSON.stringify(swaggerDoc, null, 2)}
          </pre>
        </Card>
      )}
    </div>
  );
};

export default SwaggerAnalyzer;

