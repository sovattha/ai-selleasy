'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, X, Image as ImageIcon } from 'lucide-react'
import Image from 'next/image'

interface ImageUploaderProps {
  images: File[]
  onImagesChange: (images: File[]) => void
}

export function ImageUploader({ images, onImagesChange }: ImageUploaderProps) {
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = () => {
    setDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    
    const files = Array.from(e.dataTransfer.files).filter(
      file => file.type.startsWith('image/')
    )
    
    onImagesChange([...images, ...files])
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).filter(
      file => file.type.startsWith('image/')
    )
    
    // Limit file size for mobile compatibility (5MB per image)
    const validFiles = files.filter(file => {
      if (file.size > 5 * 1024 * 1024) {
        console.warn(`File ${file.name} is too large (${Math.round(file.size / 1024 / 1024)}MB). Maximum size is 5MB.`)
        return false
      }
      return true
    })
    
    // Process files one by one to avoid memory issues on mobile
    if (validFiles.length > 0) {
      const processFiles = async () => {
        const processedFiles: File[] = []
        
        for (const file of validFiles) {
          try {
            // Create a smaller version for mobile devices
            const processedFile = await optimizeImageForMobile(file)
            processedFiles.push(processedFile)
          } catch (error) {
            console.error(`Error processing ${file.name}:`, error)
            // Fallback to original file if processing fails
            processedFiles.push(file)
          }
        }
        
        onImagesChange([...images, ...processedFiles])
      }
      
      processFiles()
    }
  }

  // Optimize images for mobile compatibility
  const optimizeImageForMobile = (file: File): Promise<File> => {
    return new Promise((resolve) => {
      // If file is already small enough, return as-is
      if (file.size <= 1024 * 1024) { // 1MB
        resolve(file)
        return
      }

      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = document.createElement('img')
      
      img.onload = () => {
        // Calculate new dimensions (max 1920px width, maintain aspect ratio)
        const maxWidth = 1920
        const ratio = Math.min(maxWidth / img.width, maxWidth / img.height)
        
        canvas.width = img.width * ratio
        canvas.height = img.height * ratio
        
        // Draw and compress
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height)
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const optimizedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now()
              })
              resolve(optimizedFile)
            } else {
              resolve(file) // Fallback to original
            }
          },
          'image/jpeg',
          0.8 // 80% quality
        )
      }
      
      img.onerror = () => resolve(file) // Fallback to original
      img.src = URL.createObjectURL(file)
    })
  }

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    onImagesChange(newImages)
  }

  return (
    <div className="space-y-4">
      <motion.div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200 ${
          dragOver
            ? 'border-violet-500 bg-violet-500/10'
            : 'border-slate-600 hover:border-slate-500'
        }`}
        whileHover={{ scale: 1.01 }}
      >
        <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
        <p className="text-slate-300 mb-2">
          Drop images here or click to select
        </p>
        <p className="text-slate-500 text-sm">
          Supports JPG, PNG, WebP
        </p>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </motion.div>

      <AnimatePresence>
        {images.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          >
            {images.map((image, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="relative aspect-square bg-slate-800 rounded-lg overflow-hidden group"
              >
                <Image
                  src={URL.createObjectURL(image)}
                  alt={`Upload ${index + 1}`}
                  fill
                  className="object-cover"
                />
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation()
                    removeImage(index)
                  }}
                  className="absolute top-2 right-2 w-6 h-6 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-3 h-3" />
                </motion.button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}