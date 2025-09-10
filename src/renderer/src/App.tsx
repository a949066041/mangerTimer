import { useQuery } from '@tanstack/react-query'
import { App, ConfigProvider, Layout, Typography } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import dayjs from 'dayjs'

import { getAppVersion } from '~/api/ipc'
import { TimerComponents } from './routes'
import 'dayjs/locale/zh-cn'

const { Title } = Typography
const { Content } = Layout

dayjs.locale('zh-cn')

export default function RenderApp() {
  const { data } = useQuery({
    queryKey: ['appVersion'],
    queryFn: () => getAppVersion(),
  })

  return (
    <ConfigProvider locale={zhCN}>
      <App>
        <Layout className=" h-screen flex flex-col overflow-hidden">
          <Title level={3}>
            当前软件版本:
            {' '}
            {data}
          </Title>
          <Content className=" flex-1 overflow-auto ">
            <TimerComponents />
          </Content>
        </Layout>
      </App>
    </ConfigProvider>
  )
}
