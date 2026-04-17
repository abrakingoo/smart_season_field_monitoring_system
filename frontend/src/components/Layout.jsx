import Header from './Header'
import Footer from './Footer'

export default function Layout({ children, showLogout = true }) {
  return (
    <div className="min-h-screen bg-[#f4f6f3] flex flex-col">
      <Header showLogout={showLogout} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
