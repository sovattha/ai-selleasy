import { NextRequest, NextResponse } from 'next/server'
import { generateItemCopy } from '@/lib/vertex-ai'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    
    const images: Buffer[] = []
    let imageIndex = 0
    
    while (formData.get(`image_${imageIndex}`)) {
      const imageFile = formData.get(`image_${imageIndex}`) as File
      const buffer = Buffer.from(await imageFile.arrayBuffer())
      images.push(buffer)
      imageIndex++
    }

    if (images.length === 0) {
      return NextResponse.json(
        { error: 'At least one image is required' },
        { status: 400 }
      )
    }

    if (images.length > 5) {
      return NextResponse.json(
        { error: 'Maximum 5 images allowed' },
        { status: 400 }
      )
    }

    const generatedCopy = await generateItemCopy(images)

    return NextResponse.json(generatedCopy)
  } catch (error) {
    console.error('Error generating copy:', error)
    return NextResponse.json(
      { error: 'Failed to generate copy' },
      { status: 500 }
    )
  }
}