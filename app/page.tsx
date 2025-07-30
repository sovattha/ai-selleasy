'use client'

import { useAuth } from '@/contexts/auth-context'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { LoginButton } from '@/components/auth/login-button'
import { MotionDiv, MotionH1, MotionP } from '@/components/motion/motion-wrapper'

export default function HomePage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <MotionDiv
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-8 h-8 border-2 border-violet-600 border-t-transparent rounded-full"
        />
      </div>
    )
  }

  if (user) {
    return null
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <MotionDiv
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md mx-auto px-6"
      >
        <MotionH1 
          className="text-4xl font-bold text-slate-50 mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          AI Sell-Easy
        </MotionH1>
        <MotionP 
          className="text-slate-400 mb-8 text-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Generate compelling sales copy with AI and list your items effortlessly on eBay
        </MotionP>
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <LoginButton />
        </MotionDiv>
      </MotionDiv>
    </div>
  )
}