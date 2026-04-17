import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import LoginPage      from './pages/LoginPage'
import Dashboard      from './pages/Dashboard'
import AdminDashboard from './pages/AdminDashboard'

function PrivateRoute({ children, role }) {
  if (!localStorage.getItem('auth')) return <Navigate to="/" replace />
  if (role && localStorage.getItem('role') !== role) return <Navigate to="/" replace />
  return children
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/dashboard" element={<PrivateRoute role="agent"><Dashboard /></PrivateRoute>} />
          <Route path="/admin"     element={<PrivateRoute role="admin"><AdminDashboard /></PrivateRoute>} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  )
}
