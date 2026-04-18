import Header from './Header'
import Footer from './Footer'

export default function Layout({ children, showLogout = true }) {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#f0ede6' }}>
      <Header showLogout={showLogout} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
