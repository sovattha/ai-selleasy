'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { doc, getDoc } from 'firebase/firestore'
import { ExternalLink, Calendar, DollarSign } from 'lucide-react'
import { db } from '@/lib/firebase'
import { Item } from '@/types/item'
import { ImageGallery } from '@/components/item/image-gallery'
import { notFound } from 'next/navigation'

interface ItemPageProps {
  params: { itemId: string }
}

export default function ItemPage({ params }: ItemPageProps) {
  const [item, setItem] = useState<Item | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const itemDoc = await getDoc(doc(db, 'items', params.itemId))
        
        if (!itemDoc.exists()) {
          notFound()
          return
        }

        const itemData = {
          id: itemDoc.id,
          ...itemDoc.data()
        } as Item

        setItem(itemData)
      } catch (error) {
        console.error('Error fetching item:', error)
        notFound()
      } finally {
        setLoading(false)
      }
    }

    fetchItem()
  }, [params.itemId])

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

  if (!item) {
    return notFound()
  }

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'Unknown'
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          <div>
            <ImageGallery images={item.imageUrls} title={item.title} />
          </div>

          <div className="space-y-6">
            <div>
              {item.status === 'sold' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="inline-flex items-center px-3 py-1 bg-slate-700 text-slate-400 rounded-full text-sm font-medium mb-4"
                >
                  SOLD
                </motion.div>
              )}
              
              <motion.h1 
                className="text-3xl lg:text-4xl font-bold text-slate-50 mb-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                {item.title}
              </motion.h1>

              <motion.div
                className="flex items-center gap-2 text-3xl font-bold text-violet-400 mb-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <DollarSign className="w-8 h-8" />
                {item.price.toFixed(2)}
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-4"
            >
              <h2 className="text-xl font-semibold text-slate-300">Description</h2>
              <div className="bg-slate-800 rounded-lg p-6">
                <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {item.description}
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center gap-2 text-slate-400"
            >
              <Calendar className="w-4 h-4" />
              Listed on {formatDate(item.createdAt)}
            </motion.div>

            {item.status === 'listed' && item.ebayListingUrl && (
              <motion.a
                href={item.ebayListingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full px-8 py-4 bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-semibold text-lg transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <ExternalLink className="w-5 h-5" />
                Buy on eBay
              </motion.a>
            )}

            {item.status === 'sold' && (
              <motion.div
                className="w-full px-8 py-4 bg-slate-700 text-slate-400 rounded-lg font-semibold text-lg text-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                This item has been sold
              </motion.div>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  )
}