import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json()
    
    if (payload.eventType === 'ITEM_SOLD') {
      const { itemId } = payload.data
      
      if (!itemId) {
        return NextResponse.json(
          { error: 'Missing itemId in webhook payload' },
          { status: 400 }
        )
      }

      const itemsQuery = await adminDb
        .collection('items')
        .where('ebayListingId', '==', itemId)
        .limit(1)
        .get()

      if (itemsQuery.empty) {
        console.log(`No item found with eBay listing ID: ${itemId}`)
        return NextResponse.json({ message: 'Item not found' }, { status: 200 })
      }

      const itemDoc = itemsQuery.docs[0]
      await itemDoc.ref.update({
        status: 'sold',
      })

      console.log(`Item ${itemDoc.id} marked as sold via eBay webhook`)
      return NextResponse.json({ message: 'Item status updated' }, { status: 200 })
    }

    return NextResponse.json({ message: 'Event not handled' }, { status: 200 })
  } catch (error) {
    console.error('eBay webhook error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}