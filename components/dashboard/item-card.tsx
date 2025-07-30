'use client'

import { motion } from 'framer-motion'
import { ExternalLink, CheckCircle, Eye } from 'lucide-react'
import { Item } from '@/types/item'
import Link from 'next/link'
import Image from 'next/image'

interface ItemCardProps {
  item: Item
  onMarkAsSold: (itemId: string) => void
}

export function ItemCard({ item, onMarkAsSold }: ItemCardProps) {
  return (
    <motion.div
      className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden hover:border-slate-600 transition-all duration-200"
      whileHover={{ y: -2 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="aspect-square relative bg-slate-700">
        {item.imageUrls.length > 0 ? (
          <Image
            src={item.imageUrls[0]}
            alt={item.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400">
            No image
          </div>
        )}
        <div className="absolute top-2 right-2">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              item.status === 'sold'
                ? 'bg-slate-700 text-slate-400'
                : 'bg-violet-600 text-white'
            }`}
          >
            {item.status === 'sold' ? 'Sold' : 'Listed'}
          </span>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-slate-50 mb-2 line-clamp-2">
          {item.title}
        </h3>
        <p className="text-2xl font-bold text-violet-400 mb-4">
          ${item.price.toFixed(2)}
        </p>
        
        <div className="flex gap-2">
          <Link
            href={`/item/${item.id}`}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg transition-colors"
          >
            <Eye className="w-4 h-4" />
            View
          </Link>
          
          {item.ebayListingUrl && (
            <a
              href={item.ebayListingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center px-3 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
          
          {item.status === 'listed' && (
            <motion.button
              onClick={() => onMarkAsSold(item.id)}
              className="flex items-center justify-center px-3 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <CheckCircle className="w-4 h-4" />
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  )
}