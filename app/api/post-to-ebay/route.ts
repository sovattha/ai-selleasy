import { NextRequest, NextResponse } from 'next/server'
import { adminDb, adminAuth } from '@/lib/firebase-admin'
import { ebayAPI } from '@/lib/ebay'

export async function POST(request: NextRequest) {
  try {
    const { itemId } = await request.json()
    const authHeader = request.headers.get('authorization')

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Missing or invalid authorization header' },
        { status: 401 }
      )
    }

    const token = authHeader.split('Bearer ')[1]
    let decodedToken
    
    try {
      decodedToken = await adminAuth.verifyIdToken(token)
    } catch (authError) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    if (!itemId) {
      return NextResponse.json(
        { error: 'Item ID is required' },
        { status: 400 }
      )
    }

    const itemRef = adminDb.collection('items').doc(itemId)
    const itemDoc = await itemRef.get()

    if (!itemDoc.exists) {
      return NextResponse.json(
        { error: 'Item not found' },
        { status: 404 }
      )
    }

    const itemData = itemDoc.data()
    
    if (itemData?.userId !== decodedToken.uid) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    if (itemData?.ebayListingId) {
      return NextResponse.json(
        { error: 'Item already posted to eBay' },
        { status: 400 }
      )
    }

    try {
      const ebayResponse = await ebayAPI.createListing({
        title: itemData.title,
        description: itemData.description,
        price: itemData.price,
        imageUrls: itemData.imageUrls,
      })

      await itemRef.update({
        ebayListingId: ebayResponse.listingId,
        ebayListingUrl: ebayResponse.listingUrl,
      })

      return NextResponse.json({
        success: true,
        listingId: ebayResponse.listingId,
        listingUrl: ebayResponse.listingUrl,
      })
    } catch (ebayError) {
      console.error('eBay API Error:', ebayError)
      return NextResponse.json(
        { error: 'Failed to create eBay listing' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Error posting to eBay:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}