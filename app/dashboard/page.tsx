'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useAuth } from '@/contexts/auth-context'
import { Item } from '@/types/item'
import { ItemCard } from '@/components/dashboard/item-card'
import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { ProtectedRoute } from '@/components/auth/protected-route'

export default function DashboardPage() {
  const { user } = useAuth()
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    const q = query(
      collection(db, 'items'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const itemsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Item[]
      
      setItems(itemsData)
      setLoading(false)
    })

    return unsubscribe
  }, [user])

  const handleMarkAsSold = async (itemId: string) => {
    try {
      const response = await fetch('/api/items/mark-as-sold', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ itemId }),
      })

      if (!response.ok) {
        throw new Error('Failed to mark item as sold')
      }
    } catch (error) {
      console.error('Error marking item as sold:', error)
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-900">
        <DashboardHeader />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-8 h-8 border-2 border-violet-600 border-t-transparent rounded-full"
              />
            </div>
          ) : items.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <h2 className="text-2xl font-semibold text-slate-50 mb-4">
                No listings yet
              </h2>
              <p className="text-slate-400 mb-8">
                Create your first listing to get started with AI Sell-Easy
              </p>
              <motion.a
                href="/new-listing"
                className="inline-flex items-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-medium transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Create Your First Listing
              </motion.a>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {items.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <ItemCard item={item} onMarkAsSold={handleMarkAsSold} />
                </motion.div>
              ))}
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  )
}