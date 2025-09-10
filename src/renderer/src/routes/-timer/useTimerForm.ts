import type { TimerPlanModel } from '~/main/types'
import { useMutation } from '@tanstack/react-query'
import { Form } from 'antd'
import { cloneDeep } from 'lodash-es'
import { useState } from 'react'
import { useToggle } from 'usehooks-ts'
import { createTimer, saveFile, updateTimer } from '~/api'
import { queryClient } from '~/store'

export function useTimerForm() {
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
      form.resetFields()
    }
    setId(row?.id)
  }

  function handleCloseDialog() {
    setOpen(false)
  }

  async function selectFile() {
    const data = await saveFile()
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
