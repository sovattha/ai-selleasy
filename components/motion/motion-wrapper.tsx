'use client'

import { motion } from 'framer-motion'
import { forwardRef } from 'react'

// Export all motion components we need
export const MotionDiv = motion.div
export const MotionButton = motion.button  
export const MotionH1 = motion.h1
export const MotionP = motion.p
export const MotionA = motion.a

// AnimatePresence for transitions
export { AnimatePresence } from 'framer-motion'
