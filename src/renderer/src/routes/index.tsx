import type { ColumnsType } from 'antd/es/table'
import type { TimerPlanModel } from '~~/src/main/db/db'
import { useMutation, useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { Button, Form, Input, Modal, Space, Switch, Table } from 'antd'
import { cloneDeep } from 'lodash-es'
import { useMemo, useState } from 'react'
import { useToggle } from 'usehooks-ts'
import { createTimer, deleteTimer, findTimerList, saveData, startSchedule, updateTimer } from '~/api/ipc'
import { queryClient } from '~/store'

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function useTimerForm() {
  const [form] = Form.useForm()
  const [isOpen, _, setOpen] = useToggle(false)
  const [id, setId] = useState<number>()

  const { mutate: saveAction, isPending } = useMutation({
    mutationFn: (data: TimerPlanModel) => {
      return id ? updateTimer({ ...data, id }) : createTimer(data)
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['selectAll'] })
      setOpen(false)
    },
  })

  function handleSaveForm() {
    form.validateFields().then((values: TimerPlanModel) => {
      saveAction(values)
    })
  }

  function handleOpenDialog(row?: TimerPlanModel) {
    setOpen(true)
    if (row) {
      form.setFieldsValue(cloneDeep(row))
    }
    else {
      form.setFieldsValue({})
    }
    setId(row?.id)
  }

  function handleCloseDialog() {
    setOpen(false)
  }

  async function selectFile() {
    const data = await saveData()
    if (data) {
      form.setFieldValue('file', data)
    }
  }

  return {
    isOpen,
    form,
    isPending,
    selectFile,
    handleSaveForm,
    handleOpenDialog,
    handleCloseDialog,
  }
}

function RouteComponent() {
  const { data = [], isLoading, refetch } = useQuery({
    queryKey: ['selectAll'],
    queryFn: findTimerList,
  })

  const { isOpen, form, isPending, selectFile, handleSaveForm, handleOpenDialog, handleCloseDialog } = useTimerForm()

  const { mutate: deleteAction, isPending: isDeletePending } = useMutation({
    mutationFn: (params: TimerPlanModel) => deleteTimer(params.id),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['selectAll'] })
    },
  })

  const columns: ColumnsType<TimerPlanModel> = useMemo(() => [
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
      render: open => (open ? '开启' : '关闭'),
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
      render(_, row) {
        return (
          <Space size="middle">
            <a type="link" onClick={() => handleOpenDialog(row)}>编辑</a>
            <a type="link" onClick={() => deleteAction(row)}>删除</a>
          </Space>
        )
      },
    },
  ], [deleteAction, handleOpenDialog])

  return (
    <div className=" px-2 py-4">
      <Space>
        <Button type="primary" onClick={() => handleOpenDialog()}>新增</Button>
        <Button type="primary" onClick={() => refetch()}>刷新</Button>
        <Button type="primary" onClick={() => startSchedule()}>任务重置刷新</Button>
      </Space>
      <Modal title="定时器" open={isOpen} onOk={handleSaveForm} confirmLoading={isPending} onCancel={handleCloseDialog}>
        <Form
          form={form}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
          style={{ maxWidth: 600 }}
        >
          <Form.Item label="名称" name="name" rules={[{ required: true, message: '请输入名称' }]}>
            <Input placeholder="请输入名称" />
          </Form.Item>
          <Form.Item label="文件路径" name="file" rules={[{ required: true, message: '请输入文件路径' }]}>
            {
              (form.getFieldValue('file')
                ? (
                    <Space>
                      <Input placeholder="请输入文件路径" value={form.getFieldValue('file')} />
                      <Button type="primary" onClick={selectFile}>选择文件</Button>
                    </Space>
                  )
                : null)
            }
          </Form.Item>
          <Form.Item label="定时器" name="timer" rules={[{ required: true, message: '请输入定时器' }]}>
            <Input placeholder="请输入定时器" />
          </Form.Item>
          <Form.Item label="状态" name="open">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
      <Table<TimerPlanModel> rowKey="id" pagination={false} columns={columns} loading={isLoading || isDeletePending} dataSource={data} />
    </div>
  )
}
