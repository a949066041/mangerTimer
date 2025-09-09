import type { TimerPlanModel } from '~~/src/main/db/db'
import { useMutation, useQuery } from '@tanstack/react-query'
import { App } from 'antd'
import { useCallback, useMemo } from 'react'
import { deleteTimer, findTimerList, switchOpen } from '~/api'
import { queryClient } from '~/store'

export function useTimerTable() {
  const { message, modal } = App.useApp()

  const { data = [], isLoading, refetch } = useQuery({
    queryKey: ['selectAll'],
    queryFn: findTimerList,
  })

  const { mutate: deleteAction, isPending: isDeletePending } = useMutation({
    mutationFn: (params: TimerPlanModel) => deleteTimer(params.id),
    onSuccess() {
      message.success('删除成功')
      queryClient.invalidateQueries({ queryKey: ['selectAll'] })
    },
  })

  const { mutate: switchAction, isPending: isSwitchPending } = useMutation({
    mutationFn: (id: number) => switchOpen(id),
    onSuccess() {
      message.success('切换成功')
      queryClient.invalidateQueries({ queryKey: ['selectAll'] })
    },
  })

  const handleDelete = useCallback((row: TimerPlanModel) => {
    modal.confirm({
      title: '确认删除吗？',
      onOk: () => {
        deleteAction(row)
      },
    })
  }, [deleteAction, modal])

  const handleSwitch = useCallback((row: TimerPlanModel) => {
    modal.confirm({
      title: '确认切换状态吗？',
      onOk: () => {
        switchAction(row.id)
      },
    })
  }, [switchAction, modal])

  const loadingTable = useMemo(() => isLoading || isDeletePending || isSwitchPending, [isLoading, isDeletePending, isSwitchPending])

  return {
    data,
    refetch,
    loadingTable,
    handleSwitch,
    handleDelete,
  }
}
