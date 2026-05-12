import { Sidebar } from '@/components'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex">
      <Sidebar />
      <main className="ml-64 w-full">
        {children}
      </main>
    </div>
  )
}
