import { VertexAI } from '@google-cloud/vertexai'

const vertexAI = new VertexAI({
  project: process.env.GOOGLE_CLOUD_PROJECT_ID,
  location: 'us-central1',
})

const model = vertexAI.getGenerativeModel({
  model: 'gemini-pro-vision',
})

interface GeneratedCopy {
  title: string
  description: string
  price?: number
}

export async function generateItemCopy(images: Buffer[]): Promise<GeneratedCopy> {
  try {
    const imageObjects = images.map(buffer => ({
      inlineData: {
        data: buffer.toString('base64'),
        mimeType: 'image/jpeg',
      },
    }))

    const prompt = `
      Analyze these product images and generate compelling sales copy for an eBay listing.

      Please provide:
      1. A catchy, descriptive title (60 characters max)
      2. A detailed description highlighting key features, condition, and benefits
      3. A suggested price range based on the item type and condition

      Format your response as JSON with keys: title, description, price (optional number)

      Focus on:
      - Highlighting the item's best features
      - Describing condition accurately
      - Using keywords buyers would search for
      - Creating urgency and appeal
      - Being honest about any flaws visible
    `

    const result = await model.generateContent([
      { text: prompt },
      ...imageObjects,
    ])

    const response = await result.response
    const text = response.text()

    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const generatedData = JSON.parse(jsonMatch[0])
        return {
          title: generatedData.title || 'Generated Title',
          description: generatedData.description || 'Generated description',
          price: generatedData.price || undefined,
        }
      }
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError)
    }

    const lines = text.split('\n').filter(line => line.trim())
    return {
      title: lines.find(line => line.toLowerCase().includes('title'))?.replace(/.*title:?\s*/i, '') || 'AI Generated Title',
      description: lines.slice(1).join('\n') || 'AI generated description based on product images.',
    }
  } catch (error) {
    console.error('Error generating copy with Vertex AI:', error)
    throw new Error('Failed to generate copy')
  }
}