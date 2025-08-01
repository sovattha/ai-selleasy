'use client'

import { useState, useEffect } from 'react'

export function usePersistentState<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  const [state, setState] = useState<T>(initialValue)
  const [isHydrated, setIsHydrated] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const item = localStorage.getItem(key)
      if (item) {
        const parsedValue = JSON.parse(item)
        setState(parsedValue)
      }
    } catch (error) {
      console.error(`Error loading ${key} from localStorage:`, error)
    } finally {
      setIsHydrated(true)
    }
  }, [key])

  // Save to localStorage when state changes
  const setPersistentState = (value: T | ((prev: T) => T)) => {
    try {
      const newValue = typeof value === 'function' ? (value as (prev: T) => T)(state) : value
      setState(newValue)
      
      if (isHydrated) {
        localStorage.setItem(key, JSON.stringify(newValue))
      }
    } catch (error) {
      console.error(`Error saving ${key} to localStorage:`, error)
      setState(typeof value === 'function' ? (value as (prev: T) => T)(state) : value)
    }
  }

  return [state, setPersistentState]
}

export function clearPersistedState(key: string) {
  try {
    localStorage.removeItem(key)
  } catch (error) {
    console.error(`Error clearing ${key} from localStorage:`, error)
  }
}

export function getAllPersistedKeys(): string[] {
  try {
    return Object.keys(localStorage).filter(key => 
      key.startsWith('ai-sell-easy-')
    )
  } catch (error) {
    console.error('Error getting persisted keys:', error)
    return []
  }
}