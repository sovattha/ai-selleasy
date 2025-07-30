'use client'

import { useAuth } from '@/contexts/auth-context'
import { LoginButton } from './login-button'
import { motion } from 'framer-motion'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-8 h-8 border-2 border-violet-600 border-t-transparent rounded-full"
        />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-3xl font-bold text-slate-50 mb-8">AI Sell-Easy</h1>
          <p className="text-slate-400 mb-8">Sign in to manage your listings</p>
          <LoginButton />
        </motion.div>
      </div>
    )
  }

  return <>{children}</>
}