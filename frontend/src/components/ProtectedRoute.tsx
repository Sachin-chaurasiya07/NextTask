import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '../store'

interface Props {
  children: React.ReactNode
}

export default function ProtectedRoute({ children }: Props) {
  const { token } = useSelector((s: RootState) => s.auth)
  if (!token) return <Navigate to="/login" replace />
  return <>{children}</>
}
