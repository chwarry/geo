import React, { useState, useEffect } from 'react'
import {
  Card,
  Button,
  Select,
  DatePicker,
  Space,
  Table,
  Empty,
  Message,
  Breadcrumb,
  Modal,
  Descriptions,
  Divider
} from '@arco-design/web-react'
import { IconLeft, IconSearch, IconRefresh, IconPlus, IconDownload } from '@arco-design/web-react/icon'
import { useNavigate, useLocation } from 'react-router-dom'
import realAPI from '../services/realAPI'

const { RangePicker } = DatePicker

// 处置类型选项
const disposalTypeOptions = [{ label: '综合结论', value: '综合结论' }]

// 处置状态选项
const disposalStatusOptions = [
  { label: '已处置', value: 1 },
  { label: '未处置', value: 0 }
]

function ForecastComprehensivePage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  // 筛选条件
  const [disposalType, setDisposalType] = useState<string | undefined>(undefined)
  const [disposalStatus, setDisposalStatus] = useState<number | undefined>(undefined)
  const [dateRange, setDateRange] = useState<string[]>([])

  // 详情弹窗
  const [detailVisible, setDetailVisible] = useState(false)
  const [detailRecord, setDetailRecord] = useState<any>(null)

  // 获取URL参数
  const searchParams = new URLSearchParams(location.search)
  const siteId = searchParams.get('siteId')

  // 加载数据
  const fetchData = async (page = 1, size = 10) => {
    setLoading(true)
    try {
      const params: any = { pageNum: page, pageSize: size }
      if (disposalStatus !== undefined) params.warndealflag = disposalStatus
      if (dateRange.length === 2) {
        params.begin = dateRange[0]
        params.end = dateRange[1]
      }

      const res = await realAPI.getComprehensiveConclusionList(params)
      console.log('✅ [ForecastComprehensivePage] 获取数据:', res)

      if (res && res.data && res.data.zhjlIPage) {
        const pageData = res.data.zhjlIPage
        setData(pageData.records || [])
        setTotal(pageData.total || 0)
      } else if (res && res.records) {
        setData(res.records || [])
        setTotal(res.total || 0)
      } else {
        setData([])
        setTotal(0)
      }
    } catch (error) {
      console.error('❌ 加载数据失败:', error)
      Message.error('加载数据失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData(currentPage, pageSize)
  }, [])

  const handleSearch = () => {
    setCurrentPage(1)
    fetchData(1, pageSize)
  }

  const handleReset = () => {
    setDisposalType(undefined)
    setDisposalStatus(undefined)
    setDateRange([])
    setCurrentPage(1)
    fetchData(1, pageSize)
  }

  const handlePageChange = (page: number, size: number) => {
    setCurrentPage(page)
    setPageSize(size)
    fetchData(page, size)
  }


  // 查看详情
  const handleViewDetail = (record: any) => {
    console.log('查看详情:', record)
    setDetailRecord(record)
    setDetailVisible(true)
  }

  // 新增
  const handleAdd = () => {
    Message.info('新增功能开发中')
  }

  // 表格列定义
  const columns = [
    { title: '分段记录码', dataIndex: 'zhjlId', width: 150 },
    { title: '处置类型', dataIndex: 'disposalType', width: 150, render: () => '综合结论' },
    {
      title: '创建时间',
      dataIndex: 'gmtCreate',
      width: 200,
      render: (val: string) => (val ? val.replace('T', ' ').substring(0, 19) : '-')
    },
    {
      title: '处置状态',
      dataIndex: 'warndealflag',
      width: 120,
      render: (val: number) => (
        <span style={{ color: val === 1 ? '#00b42a' : '#ff7d00' }}>
          {val === 1 ? '已处置' : '未处置'}
        </span>
      )
    },
    {
      title: '操作',
      width: 80,
      render: (_: any, record: any) => (
        <Button type="text" size="small" style={{ padding: 4 }} onClick={() => handleViewDetail(record)}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 28,
              height: 28,
              borderRadius: 6,
              backgroundColor: '#7c5cfc',
              color: '#fff'
            }}
          >
            📋
          </span>
        </Button>
      )
    }
  ]

  // 处置内容表格列
  const disposalContentColumns = [
    { title: '序号', dataIndex: 'index', width: 60, render: (_: any, __: any, index: number) => index + 1 },
    { title: '分段记录码', dataIndex: 'zhjlId', width: 100 },
    {
      title: '处置时间',
      dataIndex: 'gmtCreate',
      width: 150,
      render: (val: string) => (val ? val.replace('T', ' ').substring(0, 19) : '-')
    },
    { title: '处置人姓名', dataIndex: 'handlerName', width: 100, render: (val: string) => val || '张永海' },
    { title: '处置人身份证', dataIndex: 'handlerId', width: 160, render: (val: string) => val || '230882199110254514' },
    { title: '处置人电话', dataIndex: 'handlerPhone', width: 120, render: (val: string) => val || '18895738242' },
    { title: '处置内容', dataIndex: 'remark', width: 100, render: (val: string) => val || '与原设计一样' },
    {
      title: '附件',
      dataIndex: 'addition',
      width: 60,
      render: (val: string) =>
        val ? (
          <Button type="text" size="small" icon={<IconDownload />} />
        ) : (
          '-'
        )
    },
    {
      title: '操作',
      width: 60,
      render: () => (
        <Button type="text" size="small">
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 24,
              height: 24,
              borderRadius: 4,
              backgroundColor: '#7c5cfc',
              color: '#fff',
              fontSize: 12
            }}
          >
            📋
          </span>
        </Button>
      )
    }
  ]

  // 处置情况表格列
  const disposalStatusColumns = [
    {
      title: '处置状态',
      dataIndex: 'warndealflag',
      width: 150,
      render: (val: number) => (
        <span style={{ color: val === 1 ? '#00b42a' : '#ff7d00' }}>
          {val === 1 ? '已处置' : '未处置'}
        </span>
      )
    },
    {
      title: '创建时间',
      dataIndex: 'gmtCreate',
      width: 200,
      render: (val: string) => (val ? val.replace('T', ' ').substring(0, 19) : '-')
    },
    {
      title: '操作',
      width: 80,
      render: () => (
        <Button type="text" size="small">
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 24,
              height: 24,
              borderRadius: 4,
              backgroundColor: '#7c5cfc',
              color: '#fff',
              fontSize: 12
            }}
          >
            📋
          </span>
        </Button>
      )
    }
  ]

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f6f7' }}>
      {/* 顶部紫色导航条 */}
      <div
        style={{
          height: 48,
          background: '#7c5cfc',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          color: '#fff'
        }}
      >
        <Breadcrumb style={{ color: '#fff' }}>
          <Breadcrumb.Item style={{ color: 'rgba(255,255,255,0.8)' }}>地质预报</Breadcrumb.Item>
          <Breadcrumb.Item style={{ color: '#fff' }}>综合结论</Breadcrumb.Item>
        </Breadcrumb>
        <Button
          type="text"
          icon={<IconLeft style={{ color: '#fff' }} />}
          style={{ color: '#fff' }}
          onClick={() => navigate(-1)}
        >
          返回
        </Button>
      </div>

      <div style={{ padding: '24px' }}>
        {/* 筛选条件 */}
        <Card style={{ marginBottom: '16px' }} bodyStyle={{ padding: '16px 24px' }}>
          <Space size="large" wrap>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#86909c' }}>处置类型：</span>
              <Select
                placeholder="请选处置类型"
                style={{ width: 160 }}
                allowClear
                value={disposalType}
                onChange={setDisposalType}
              >
                {disposalTypeOptions.map((opt) => (
                  <Select.Option key={opt.value} value={opt.value}>
                    {opt.label}
                  </Select.Option>
                ))}
              </Select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#86909c' }}>处置状态：</span>
              <Select
                placeholder="请选择处置状态"
                style={{ width: 160 }}
                allowClear
                value={disposalStatus}
                onChange={setDisposalStatus}
              >
                {disposalStatusOptions.map((opt) => (
                  <Select.Option key={opt.value} value={opt.value}>
                    {opt.label}
                  </Select.Option>
                ))}
              </Select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#86909c' }}>预报时间：</span>
              <RangePicker
                style={{ width: 280 }}
                placeholder={['开始日期', '结束日期']}
                onChange={(_, dateString) => setDateRange(dateString as unknown as string[])}
              />
            </div>

            <Button type="primary" icon={<IconSearch />} onClick={handleSearch}>
              查询
            </Button>
            <Button icon={<IconRefresh />} onClick={handleReset}>
              重置
            </Button>
          </Space>
        </Card>

        {/* 新增按钮 */}
        <div style={{ marginBottom: '16px' }}>
          <Button
            type="primary"
            icon={<IconPlus />}
            style={{ backgroundColor: '#7c5cfc', borderColor: '#7c5cfc' }}
            onClick={handleAdd}
          >
            新增
          </Button>
        </div>

        {/* 数据表格 */}
        <Card bodyStyle={{ padding: 0 }}>
          <Table
            loading={loading}
            columns={columns}
            data={data}
            pagination={{
              total: total,
              current: currentPage,
              pageSize: pageSize,
              showTotal: true,
              showJumper: true,
              sizeCanChange: true,
              pageSizeChangeResetCurrent: true,
              onChange: handlePageChange
            }}
            noDataElement={<Empty description="暂无数据" />}
            rowKey="zhjlPk"
            stripe
          />
        </Card>
      </div>

      {/* 详情弹窗 */}
      <Modal
        title="综合结论处置"
        visible={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={<Button onClick={() => setDetailVisible(false)}>关闭</Button>}
        style={{ width: 900 }}
        unmountOnExit
      >
        {detailRecord && (
          <div>
            {/* 基本信息 */}
            <Descriptions
              column={2}
              data={[
                { label: '已阅人员', value: detailRecord.handlerName || '张永海' },
                { label: '处置结果', value: detailRecord.remark || '与原设计一样' }
              ]}
              style={{ marginBottom: 16 }}
              labelStyle={{ color: '#86909c' }}
            />
            <div style={{ marginBottom: 8 }}>
              <span style={{ color: '#00b42a' }}>* 处置状态：</span>
              <span style={{ color: '#00b42a' }}>
                {detailRecord.warndealflag === 1 ? '已处置' : '未处置'}
              </span>
            </div>

            {/* 处置内容 */}
            <Divider style={{ margin: '16px 0' }} />
            <div
              style={{
                background: '#f7f8fa',
                padding: '8px 16px',
                marginBottom: 16,
                fontWeight: 500
              }}
            >
              处置内容
            </div>
            <div style={{ marginBottom: 16 }}>
              <Button
                type="primary"
                size="small"
                icon={<IconPlus />}
                style={{ backgroundColor: '#7c5cfc', borderColor: '#7c5cfc' }}
              >
                新增
              </Button>
            </div>
            <Table
              columns={disposalContentColumns}
              data={[detailRecord]}
              pagination={{ pageSize: 5, simple: true }}
              rowKey="zhjlPk"
              size="small"
              border
            />

            {/* 处置情况 */}
            <Divider style={{ margin: '24px 0 16px' }} />
            <div style={{ fontWeight: 500, marginBottom: 16 }}>处置情况</div>
            <Table
              columns={disposalStatusColumns}
              data={[detailRecord]}
              pagination={{ pageSize: 5, simple: true }}
              rowKey="zhjlPk"
              size="small"
              border
            />
          </div>
        )}
      </Modal>
    </div>
  )
}

export default ForecastComprehensivePage
