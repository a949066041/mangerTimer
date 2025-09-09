import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { useToggle } from 'usehooks-ts'
import { getRecord } from '~/api'

export function useRecord() {
  const [isOpen, _, setOpen] = useToggle(false)
  const [id, setId] = useState<number>()
  const { data = [] } = useQuery({
    queryKey: ['record', id],
    queryFn: () => getRecord(id!),
    enabled: !!id,
  })

  function handleOpenRecord(id: number) {
    setOpen(true)
    setId(id)
  }

  function handleCloseRecord() {
    setOpen(false)
  }

  return {
    isOpen,
    handleOpenRecord,
    handleCloseRecord,
    data,
  }
}
