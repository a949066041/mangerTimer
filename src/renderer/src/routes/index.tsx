import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className=" px-2 py-4">
      <div>123</div>
    </div>
  )
}
