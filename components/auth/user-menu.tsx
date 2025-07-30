'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LogOut, User } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'

export function UserMenu() {
  const { user, logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  if (!user) return null

  return (
    <div className="relative">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-800 transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {user.photoURL ? (
          <img
            src={user.photoURL}
            alt={user.displayName || 'User'}
            className="w-8 h-8 rounded-full"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
        )}
        <span className="text-slate-50 font-medium">{user.displayName}</span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-lg z-50"
          >
            <button
              onClick={() => {
                logout()
                setIsOpen(false)
              }}
              className="flex items-center gap-2 w-full px-4 py-2 text-left text-slate-300 hover:text-slate-50 hover:bg-slate-700 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign out
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}