'use client'

import { motion } from 'framer-motion'
import { Wand2, Upload, FileText, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-900">
      <main className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          <h1 className="text-6xl font-bold text-slate-50 mb-6">
            AI <span className="text-sky-400">Sell-Easy</span>
          </h1>
          <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto">
            Transformez vos photos de produits en descriptions attractives pour Ricardo.ch 
            grâce à l'intelligence artificielle.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12"
          >
            <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
              <Upload className="w-8 h-8 text-sky-400 mb-4 mx-auto" />
              <h3 className="text-lg font-semibold text-slate-50 mb-2">Téléchargez</h3>
              <p className="text-slate-400">Jusqu'à 5 photos de votre produit</p>
            </div>
            <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
              <Wand2 className="w-8 h-8 text-violet-400 mb-4 mx-auto" />
              <h3 className="text-lg font-semibold text-slate-50 mb-2">IA Magique</h3>
              <p className="text-slate-400">L'IA analyse et crée des descriptions parfaites</p>
            </div>
            <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
              <FileText className="w-8 h-8 text-green-400 mb-4 mx-auto" />
              <h3 className="text-lg font-semibold text-slate-50 mb-2">Copiez</h3>
              <p className="text-slate-400">Utilisez le contenu généré sur Ricardo</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Link
              href="/generate"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-sky-600 to-violet-600 hover:from-sky-700 hover:to-violet-700 text-white rounded-lg font-medium text-lg transition-all duration-200 transform hover:scale-105"
            >
              Commencer
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </motion.div>
      </main>
    </div>
  )
}