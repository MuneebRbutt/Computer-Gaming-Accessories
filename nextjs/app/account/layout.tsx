import Header from '@/components/Header'
import AccountSidebar from '@/components/AccountSidebar'

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-[16rem_1fr] gap-6">
          <AccountSidebar />
          <div>{children}</div>
        </div>
      </main>
    </div>
  )
}


