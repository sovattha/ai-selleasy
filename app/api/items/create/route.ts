import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'
import { uploadImage } from '@/lib/storage'
import { Timestamp } from 'firebase-admin/firestore'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const price = parseFloat(formData.get('price') as string)
    const userId = formData.get('userId') as string

    if (!title || !description || !price || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const imageUrls: string[] = []
    let imageIndex = 0
    
    while (formData.get(`image_${imageIndex}`)) {
      const imageFile = formData.get(`image_${imageIndex}`) as File
      const fileName = `${Date.now()}_${imageIndex}_${imageFile.name}`
      
      try {
        const imageUrl = await uploadImage(imageFile, fileName)
        imageUrls.push(imageUrl)
      } catch (uploadError) {
        console.error('Error uploading image:', uploadError)
      }
      
      imageIndex++
    }

    if (imageUrls.length === 0) {
      return NextResponse.json(
        { error: 'At least one image is required' },
        { status: 400 }
      )
    }

    const itemData = {
      userId,
      title,
      description,
      price,
      imageUrls,
      status: 'listed' as const,
      createdAt: Timestamp.now(),
    }

    const docRef = await adminDb.collection('items').add(itemData)

    return NextResponse.json({ itemId: docRef.id })
  } catch (error) {
    console.error('Error creating item:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}