import type { TableProps } from 'antd'
import type { TimerPlanModel, TimerRecord } from '~/main/types'
import { Button, Form, Input, Modal, Space, Switch, Table } from 'antd'
import { useMemo } from 'react'
import { Cron } from 'react-js-cron'
import { startSchedule } from '~/api/ipc'
import { DEFAULT_LOCALE_ZH } from '~/assets/cron.locale'
import { useRecord } from './-timer/useRecord'
import { useTimerForm } from './-timer/useTimerForm'
import { useTimerTable } from './-timer/useTimerTable'

export function TimerComponents() {
  const { isOpen, form, isPending, selectFile, handleSaveForm, handleOpenDialog, handleCloseDialog } = useTimerForm()
  const { data: recordData, isOpen: recordIsOpen, handleOpenRecord, handleCloseRecord } = useRecord()
  const { loadingTable, handleSwitch, handleDelete, data, refetch } = useTimerTable()

  const columns: TableProps<TimerPlanModel>['columns'] = useMemo(() => [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '文件路径',
      dataIndex: 'file',
      width: 200,
      key: 'file',
    },
    {
      title: '定时器',
      dataIndex: 'timer',
      key: 'timer',
    },
    {
      title: '状态',
      dataIndex: 'open',
      key: 'open',
      render: (open, row) => (
        <Switch
          checked={open}
          onChange={async () => {
            handleSwitch(row)
          }}
        />
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
    },
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      fixed: 'right',
      render(_, row) {
        return (
          <Space size="middle">
            <a type="link" onClick={() => handleOpenDialog(row)}>编辑</a>
            <a type="link" onClick={() => handleOpenRecord(row.id)}>记录列表</a>
            <a type="link" onClick={() => handleDelete(row)}>删除</a>
          </Space>
        )
      },
    },
  ], [handleDelete, handleOpenDialog, handleSwitch, handleOpenRecord])

  return (
    <div className=" space-y-2 px-2 py-4">
      <Space>
        <Button type="primary" onClick={() => handleOpenDialog()}>新增</Button>
        <Button type="primary" onClick={() => refetch()}>刷新</Button>
        <Button type="primary" onClick={() => startSchedule()}>任务重置刷新</Button>
      </Space>
      <Modal width={800} centered title="定时器" open={isOpen} onOk={handleSaveForm} confirmLoading={isPending} onCancel={handleCloseDialog}>
        <Form
          form={form}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
          style={{ maxWidth: 600 }}
        >
          <Form.Item label="名称" name="name" rules={[{ required: true, message: '请输入名称' }]}>
            <Input placeholder="请输入名称" />
          </Form.Item>
          <Form.Item label="文件路径" required>
            <Space>
              <Form.Item name="file" rules={[{ required: true, message: '请选择文件' }]} noStyle><Input disabled /></Form.Item>
              <Button type="primary" onClick={selectFile}>选择文件</Button>
            </Space>
          </Form.Item>
          <Form.Item label="定时器" name="timer" rules={[{ required: true, message: '请输入定时器' }]}>
            <Cron locale={DEFAULT_LOCALE_ZH} value={form.getFieldValue('timer')} setValue={(val: any) => form.setFieldValue('timer', val)} />
          </Form.Item>
          <Form.Item label="状态" name="open">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
      <Modal title="执行记录" centered footer={null} open={recordIsOpen} onCancel={handleCloseRecord}>
        <Table<TimerRecord>
          rowKey="id"
          columns={[
            {
              title: '执行时间',
              dataIndex: 'execTimer',
              key: 'execTimer',
            },
          ]}
          dataSource={recordData}
        />
      </Modal>
      <Table<TimerPlanModel> rowKey="id" pagination={false} columns={columns} loading={loadingTable} dataSource={data} />
    </div>
  )
}
