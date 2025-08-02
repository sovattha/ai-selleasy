'use client';

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Wand2, Copy, ExternalLink } from 'lucide-react'
import { ImageUploader } from '@/components/generate/image-uploader'
import { usePersistentState } from '@/hooks/use-persistent-state'
import Link from 'next/link'

interface FormData {
  title: string
  description: string
  price: string
  category: string
  brand: string
  model: string
}

export default function GeneratePage() {
  const [images, setImages] = useState<File[]>([])
  const [formData, setFormData] = usePersistentState<FormData>('ai-sell-easy-form-data', {
    title: '',
    description: '',
    price: '',
    category: '',
    brand: '',
    model: '',
  })
  const [generatingCopy, setGeneratingCopy] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const generateCopy = async () => {
    if (images.length === 0) {
      setToastMessage('Please upload at least one image')
      setTimeout(() => setToastMessage(''), 2000)
      return
    }

    setGeneratingCopy(true)
    const startTime = Date.now()
    
    try {
      const formDataObj = new FormData()
      images.forEach((image, index) => {
        formDataObj.append(`image_${index}`, image)
      })

      const response = await fetch('/api/generate-copy', {
        method: 'POST',
        body: formDataObj,
      })

      const responseTime = Date.now() - startTime

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        
        // Log detailed error information
        const errorLog = {
          timestamp: new Date().toISOString(),
          error: 'API Error',
          status: response.status,
          statusText: response.statusText,
          responseTime,
          imageCount: images.length,
          userAgent: navigator.userAgent,
          url: window.location.href,
          errorData
        }
        
        console.error('API Error:', errorLog)
        
        // Store error for debugging
        try {
          const existingErrors = JSON.parse(localStorage.getItem('api_errors') || '[]')
          existingErrors.push(errorLog)
          localStorage.setItem('api_errors', JSON.stringify(existingErrors.slice(-20)))
        } catch (e) {
          console.error('Failed to store API error:', e)
        }
        
        throw new Error(`API Error: ${response.status} ${errorData.error || response.statusText}`)
      }

      const data = await response.json()
      
      // Log successful generation
      console.log(`AI generation successful in ${responseTime}ms`)
      
      setFormData(prev => ({
        ...prev,
        title: data.title || prev.title,
        description: data.description || prev.description,
        price: data.price ? data.price.toString() : prev.price,
        category: data.category || prev.category,
        brand: data.brand || prev.brand,
        model: data.model || prev.model,
      }))
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      console.error('Error generating copy:', error)
      
      // Enhanced error logging
      const errorLog = {
        timestamp: new Date().toISOString(),
        error: 'Generation Error',
        message: errorMessage,
        stack: error instanceof Error ? error.stack : undefined,
        responseTime: Date.now() - startTime,
        imageCount: images.length,
        imageSizes: images.map(img => ({ name: img.name, size: img.size, type: img.type })),
        userAgent: navigator.userAgent,
        url: window.location.href
      }
      
      try {
        const existingErrors = JSON.parse(localStorage.getItem('generation_errors') || '[]')
        existingErrors.push(errorLog)
        localStorage.setItem('generation_errors', JSON.stringify(existingErrors.slice(-20)))
      } catch (e) {
        console.error('Failed to store generation error:', e)
      }
      
      setToastMessage('Generation error. Please try again.')
      setTimeout(() => setToastMessage(''), 2000)
    } finally {
      setGeneratingCopy(false)
    }
  }

  const copyToClipboard = async (text: string, fieldName: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setToastMessage(`${fieldName} copied!`)
      setTimeout(() => setToastMessage(''), 2000)
    } catch (error) {
      console.error('Error copying to clipboard:', error)
      setToastMessage('Copy error')
      setTimeout(() => setToastMessage(''), 2000)
    }
  }

  const openMarketplace = () => {
    // Users can adapt this to their preferred marketplace
    window.open('https://www.ebay.com/sell/', '_blank')
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <header className="bg-slate-900 border-b border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link
              href="/"
              className="flex items-center gap-2 text-slate-300 hover:text-slate-50 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-slate-50 mb-2">
              AI Listing Generator
            </h1>
            <p className="text-slate-400">
              Upload images and let AI generate an attractive description
            </p>
          </div>

          <div className="space-y-8">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-4">
                Product Images
              </label>
              <ImageUploader images={images} onImagesChange={setImages} />
            </div>

            <div className="flex justify-center">
              <motion.button
                type="button"
                onClick={generateCopy}
                disabled={generatingCopy || images.length === 0}
                className="flex items-center justify-center gap-2 px-8 py-4 bg-sky-600 hover:bg-sky-700 disabled:bg-slate-700 disabled:text-slate-400 text-white rounded-lg font-medium text-lg transition-colors"
                whileHover={{ scale: generatingCopy ? 1 : 1.02 }}
                whileTap={{ scale: generatingCopy ? 1 : 0.98 }}
              >
                <Wand2 className="w-5 h-5" />
                {generatingCopy ? 'Generating...' : 'Generate with AI'}
              </motion.button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-slate-300">
                      Title
                    </label>
                    {formData.title && (
                      <button
                        type="button"
                        onClick={() => copyToClipboard(formData.title, 'Title')}
                        className="flex items-center gap-1 px-2 py-1 text-xs text-slate-400 hover:text-slate-300 transition-colors"
                      >
                        <Copy className="w-3 h-3" />
                        Copy
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-50 placeholder-slate-400 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors"
                    placeholder="Listing title"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-slate-300">
                      Price
                    </label>
                    {formData.price && (
                      <button
                        type="button"
                        onClick={() => copyToClipboard(formData.price, 'Price')}
                        className="flex items-center gap-1 px-2 py-1 text-xs text-slate-400 hover:text-slate-300 transition-colors"
                      >
                        <Copy className="w-3 h-3" />
                        Copy
                      </button>
                    )}
                  </div>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-50 placeholder-slate-400 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-slate-300">
                      Category
                    </label>
                    {formData.category && (
                      <button
                        type="button"
                        onClick={() => copyToClipboard(formData.category, 'Category')}
                        className="flex items-center gap-1 px-2 py-1 text-xs text-slate-400 hover:text-slate-300 transition-colors"
                      >
                        <Copy className="w-3 h-3" />
                        Copy
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-50 placeholder-slate-400 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors"
                    placeholder="e.g., Electronics, Clothing"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-slate-300">
                      Brand
                    </label>
                    {formData.brand && (
                      <button
                        type="button"
                        onClick={() => copyToClipboard(formData.brand, 'Brand')}
                        className="flex items-center gap-1 px-2 py-1 text-xs text-slate-400 hover:text-slate-300 transition-colors"
                      >
                        <Copy className="w-3 h-3" />
                        Copy
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-50 placeholder-slate-400 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors"
                    placeholder="ex: Apple, Nike"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-slate-300">
                      Model
                    </label>
                    {formData.model && (
                      <button
                        type="button"
                        onClick={() => copyToClipboard(formData.model, 'Model')}
                        className="flex items-center gap-1 px-2 py-1 text-xs text-slate-400 hover:text-slate-300 transition-colors"
                      >
                        <Copy className="w-3 h-3" />
                        Copy
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    name="model"
                    value={formData.model}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-50 placeholder-slate-400 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors"
                    placeholder="ex: iPhone 14, Air Max"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-slate-300">
                    Description
                  </label>
                  {formData.description && (
                    <button
                      type="button"
                      onClick={() => copyToClipboard(formData.description, 'Description')}
                      className="flex items-center gap-1 px-2 py-1 text-xs text-slate-400 hover:text-slate-300 transition-colors"
                    >
                      <Copy className="w-3 h-3" />
                      Copy
                    </button>
                  )}
                </div>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={20}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-50 placeholder-slate-400 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors resize-none"
                  placeholder="Product description..."
                />
              </div>
            </div>

            <div className="flex justify-center">
              <motion.button
                type="button"
                onClick={openMarketplace}
                className="flex items-center gap-2 px-8 py-4 bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-medium text-lg transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <ExternalLink className="w-5 h-5" />
                Open Marketplace
              </motion.button>
            </div>
          </div>

          {/* Toast notification */}
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg"
            >
              {toastMessage}
            </motion.div>
          )}
        </motion.div>
      </main>
    </div>
  )
}