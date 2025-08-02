interface GenerativeAIResponse {
  candidates: Array<{
    content: {
      parts: Array<{ text: string }>
    }
  }>
}

async function callGeminiAPI(prompt: string, images: Buffer[]): Promise<string> {
  const apiKey = process.env.GOOGLE_AI_API_KEY
  
  if (!apiKey) {
    throw new Error('GOOGLE_AI_API_KEY environment variable is required. Get one from https://aistudio.google.com/')
  }

  // Prepare the request body
  const parts: any[] = [{ text: prompt }]
  
  // Add images to the request
  for (const imageBuffer of images) {
    parts.push({
      inline_data: {
        mime_type: 'image/jpeg',
        data: imageBuffer.toString('base64')
      }
    })
  }

  const requestBody = {
    contents: [{
      parts: parts
    }]
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    }
  )

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`API call failed: ${response.status} ${response.statusText}. ${errorText}`)
  }

  const data: GenerativeAIResponse = await response.json()
  return data.candidates[0]?.content?.parts[0]?.text || 'No response generated'
}

interface GeneratedCopy {
  title: string
  description: string
  price?: number
  category?: string
  brand?: string
  model?: string
}

export async function generateItemCopy(images: Buffer[]): Promise<GeneratedCopy> {
  try {
    const prompt = `
      Analyze these product images and generate a marketplace listing in English.

      Generate:
      1. A catchy and descriptive title (max 60 characters)
      2. A detailed description that makes people want to buy
      3. The product category
      4. The brand (if visible)
      5. The model (if identifiable)
      6. A suggested price in USD

      Respond in JSON with keys: title, description, category, brand, model, price

      IMPORTANT - Writing style:
      - Write like an individual selling their belongings, not a professional seller
      - Natural and human tone, without commercial jargon
      - Mention why you're selling (moving, no longer needed, etc.)
      - Be honest about condition, mention small defects if any
      - Use "I'm selling", "I bought", "works perfectly"
      - Avoid excessive superlatives and marketing speak

      Example tone:
      "I'm selling my Dyson vacuum because I'm moving. It works perfectly, suction is great. Some minor scratches on the plastic but nothing serious. Very practical for pet hair. Comes with all original accessories."
    `

    const text = await callGeminiAPI(prompt, images)

    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const generatedData = JSON.parse(jsonMatch[0])
        return {
          title: generatedData.title || 'Generated Title',
          description: generatedData.description || 'Generated Description',
          price: generatedData.price || undefined,
          category: generatedData.category || undefined,
          brand: generatedData.brand || undefined,
          model: generatedData.model || undefined,
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