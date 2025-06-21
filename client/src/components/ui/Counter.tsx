'use client'

import { useEffect, useState } from 'react'

export function Counter({
  from,
  to,
  duration = 1,
}: {
  from: number
  to: number
  duration?: number
}) {
  const [count, setCount] = useState(from)
  
  useEffect(() => {
    let start = from
    const increment = (to - from) / (duration * 60) // 60fps
    
    const timer = setInterval(() => {
      start += increment
      if (start >= to) {
        setCount(to)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 1000/60) // 60fps

    return () => clearInterval(timer)
  }, [from, to, duration])

  return <>{count}</>
}