'use client'

import { MotionButton } from '@/components/motion/motion-wrapper'
import { Chrome } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'

export function LoginButton() {
  const { signInWithGoogle } = useAuth()

  return (
    <MotionButton
      onClick={signInWithGoogle}
      className="flex items-center gap-3 px-6 py-3 bg-white border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition-colors"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Chrome className="w-5 h-5" />
      Sign in with Google
    </MotionButton>
  )
}