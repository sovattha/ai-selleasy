import { Timestamp } from 'firebase/firestore'

export interface Item {
  id: string
  userId: string
  title: string
  description: string
  price: number
  imageUrls: string[]
  ebayListingId?: string
  ebayListingUrl?: string
  ricardoUrl?: string
  status: 'listed' | 'sold'
  createdAt: Timestamp
}