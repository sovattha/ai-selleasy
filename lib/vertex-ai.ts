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
  const parts = [{ text: prompt }]
  
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
      Analyse ces images de produit et génère une annonce pour Ricardo.ch en français.

      Génère:
      1. Un titre accrocheur et descriptif (max 60 caractères)
      2. Une description détaillée qui donne envie d'acheter
      3. La catégorie du produit
      4. La marque (si visible)
      5. Le modèle (si identifiable)
      6. Un prix suggéré en CHF

      Réponds en JSON avec les clés: title, description, category, brand, model, price

      IMPORTANT - Style d'écriture:
      - Écris comme un particulier qui vend ses affaires, pas comme un vendeur professionnel
      - Ton naturel et humain, sans jargon commercial
      - Mentionne pourquoi tu vends (déménagement, plus besoin, etc.)
      - Sois honnête sur l'état, mentionne les petits défauts s'il y en a
      - Utilise "je vends", "j'ai acheté", "fonctionne parfaitement"
      - Évite les superlatifs excessifs et le marketing

      Exemple de ton souhaité:
      "Je vends mon aspirateur Dyson car je déménage. Il fonctionne parfaitement, aspire super bien. Quelques petites rayures sur le plastique mais rien de grave. Très pratique pour les poils d'animaux. Vendu avec tous les accessoires d'origine."
    `

    const text = await callGeminiAPI(prompt, images)

    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const generatedData = JSON.parse(jsonMatch[0])
        return {
          title: generatedData.title || 'Titre généré',
          description: generatedData.description || 'Description générée',
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
      title: lines.find(line => line.toLowerCase().includes('title'))?.replace(/.*title:?\s*/i, '') || 'Titre généré par IA',
      description: lines.slice(1).join('\n') || 'Description générée par IA basée sur les images du produit.',
    }
  } catch (error) {
    console.error('Error generating copy with Vertex AI:', error)
    throw new Error('Failed to generate copy')
  }
}