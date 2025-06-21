import { Header } from '@/components/shared/Header'
import { Footer } from '@/components/shared/Footer'
import { ToastViewport } from '@/components/ui/toast'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        {children}
      </main>
      <Footer />
      <ToastViewport />
    </div>
  )
}