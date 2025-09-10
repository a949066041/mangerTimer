import { useMutation, useQuery } from '@tanstack/react-query'
import { Button, Drawer, Form, Switch, Table } from 'antd'
import { useToggle } from 'usehooks-ts'
import { getEnabled, getSchedule, startSchedule, switchEnabled } from '~/api'

export function AppConfig() {
  const [open, _, setOpen] = useToggle()
  const { data: autoStartData = false, refetch: autoStartRefetch } = useQuery({
    queryKey: ['auto-start'],
    enabled: open,
    queryFn: getEnabled,
  })

  const { mutate: switchAction } = useMutation({
    mutationFn: switchEnabled,
    onSuccess() {
      autoStartRefetch()
    },
  })

  const { data: scheduleData = [], refetch: scheduleRefetch } = useQuery({
    queryKey: ['schedule-all'],
    enabled: open,
    queryFn: getSchedule,
  })

  const { mutate: scheduleRefreshAction } = useMutation({
    mutationFn: startSchedule,
    onSuccess() {
      scheduleRefetch()
    },
  })

  function handleOpenConfig() {
    setOpen(true)
  }

  return (
    <>
      <Button onClick={handleOpenConfig}>
        <span className="icon-[icon-park-outline--setting-two]"></span>
        软件设置
      </Button>
      <Drawer
        closable
        title={<p>应用配置</p>}
        placement="right"
        open={open}
        onClose={() => setOpen(false)}
      >
        <Form
          layout="vertical"
          style={{ maxWidth: 600 }}
        >
          <Form.Item label="是否开机自启动" name="size">
            <Switch checked={autoStartData} onChange={() => switchAction()} />
          </Form.Item>
          <Form.Item label="当前任务" name="schedule">
            <Button className=" mb-2" size="small" type="primary" onClick={() => scheduleRefreshAction()}>刷新任务</Button>
            <Table
              columns={[
                {
                  title: '名称',
                  dataIndex: 'name',
                  key: 'name',
                },
              ]}
              dataSource={scheduleData}
            />
          </Form.Item>
        </Form>
      </Drawer>
    </>
  )
}
