'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Wand2, Save } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import { useRouter } from 'next/navigation'
import { ProtectedRoute } from '@/components/auth/protected-route'
import { ImageUploader } from '@/components/new-listing/image-uploader'
import Link from 'next/link'

interface FormData {
  title: string
  description: string
  price: string
}

export default function NewListingPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [images, setImages] = useState<File[]>([])
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    price: '',
  })
  const [loading, setLoading] = useState(false)
  const [generatingCopy, setGeneratingCopy] = useState(false)

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const generateCopy = async () => {
    if (images.length === 0) {
      alert('Please upload at least one image first')
      return
    }

    setGeneratingCopy(true)
    try {
      const formDataObj = new FormData()
      images.forEach((image, index) => {
        formDataObj.append(`image_${index}`, image)
      })

      const response = await fetch('/api/generate-copy', {
        method: 'POST',
        body: formDataObj,
      })

      if (!response.ok) {
        throw new Error('Failed to generate copy')
      }

      const data = await response.json()
      setFormData(prev => ({
        ...prev,
        title: data.title || prev.title,
        description: data.description || prev.description,
        price: data.price ? data.price.toString() : prev.price,
      }))
    } catch (error) {
      console.error('Error generating copy:', error)
      alert('Failed to generate copy. Please try again.')
    } finally {
      setGeneratingCopy(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || images.length === 0) return

    setLoading(true)
    try {
      const submitFormData = new FormData()
      submitFormData.append('title', formData.title)
      submitFormData.append('description', formData.description)
      submitFormData.append('price', formData.price)
      submitFormData.append('userId', user.uid)
      
      images.forEach((image, index) => {
        submitFormData.append(`image_${index}`, image)
      })

      const response = await fetch('/api/items/create', {
        method: 'POST',
        body: submitFormData,
      })

      if (!response.ok) {
        throw new Error('Failed to create listing')
      }

      const data = await response.json()
      router.push(`/item/${data.itemId}`)
    } catch (error) {
      console.error('Error creating listing:', error)
      alert('Failed to create listing. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-900">
        <header className="bg-slate-900 border-b border-slate-800">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center h-16">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 text-slate-300 hover:text-slate-50 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
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
                Create New Listing
              </h1>
              <p className="text-slate-400">
                Upload images and let AI generate compelling sales copy
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-4">
                  Item Images
                </label>
                <ImageUploader images={images} onImagesChange={setImages} />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-50 placeholder-slate-400 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors"
                      placeholder="Enter item title"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Price ($)
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-50 placeholder-slate-400 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors"
                      placeholder="0.00"
                    />
                  </div>

                  <motion.button
                    type="button"
                    onClick={generateCopy}
                    disabled={generatingCopy || images.length === 0}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-sky-600 hover:bg-sky-700 disabled:bg-slate-700 disabled:text-slate-400 text-white rounded-lg font-medium transition-colors"
                    whileHover={{ scale: generatingCopy ? 1 : 1.02 }}
                    whileTap={{ scale: generatingCopy ? 1 : 0.98 }}
                  >
                    <Wand2 className="w-4 h-4" />
                    {generatingCopy ? 'Generating...' : 'Generate with AI'}
                  </motion.button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={12}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-50 placeholder-slate-400 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors resize-none"
                    placeholder="Enter item description"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <motion.button
                  type="submit"
                  disabled={loading || images.length === 0}
                  className="flex items-center gap-2 px-8 py-3 bg-violet-600 hover:bg-violet-700 disabled:bg-slate-700 disabled:text-slate-400 text-white rounded-lg font-medium transition-colors"
                  whileHover={{ scale: loading ? 1 : 1.05 }}
                  whileTap={{ scale: loading ? 1 : 0.95 }}
                >
                  <Save className="w-4 h-4" />
                  {loading ? 'Creating...' : 'Create Listing'}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </main>
      </div>
    </ProtectedRoute>
  )
}