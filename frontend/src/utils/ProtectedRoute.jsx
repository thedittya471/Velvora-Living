import React, { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, userLoading } = useContext(ShopContext)

  if (userLoading) {
    return null
  }

  if (!isAuthenticated) {
    return <Navigate to='/login' replace />
  }

  return children
}

export default ProtectedRoute
