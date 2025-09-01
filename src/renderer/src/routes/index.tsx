import { createFileRoute } from '@tanstack/react-router'
import * as React from 'react'

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className=" btn">
      home page
      <i className="icon-[custom--anq]"></i>
      <span className="icon-[material-symbols--10k-outline]"></span>
    </div>
  )
}
