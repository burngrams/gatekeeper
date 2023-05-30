import React, { useState } from 'react'

export const useLocalstorageState = <T>(key: string, defaultValue: T) => {
  const [state, setState] = useState<T>(() => {
    const storedState = localStorage.getItem(key)
    return storedState ? JSON.parse(storedState) : defaultValue
  })
  const setLocalstorageState = (newState: T) => {
    localStorage.setItem(key, JSON.stringify(newState))
    setState(newState)
  }
  return [state, setLocalstorageState] as const
}
