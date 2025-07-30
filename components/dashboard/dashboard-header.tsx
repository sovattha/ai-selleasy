'use client'

import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { UserMenu } from '@/components/auth/user-menu'
import Link from 'next/link'

export function DashboardHeader() {
  return (
    <header className="bg-slate-900 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <motion.h1 
            className="text-2xl font-bold text-slate-50"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            AI Sell-Easy
          </motion.h1>
          
          <div className="flex items-center gap-4">
            <Link href="/new-listing">
              <motion.button
                className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-medium transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Plus className="w-4 h-4" />
                New Listing
              </motion.button>
            </Link>
            <UserMenu />
          </div>
        </div>
      </div>
    </header>
  )
}